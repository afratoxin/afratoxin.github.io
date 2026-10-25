// Regression coverage uses the actual app renderer with the browser-I/O adapter
// from archive-ui.test.mjs. It never modifies source data or contacts a remote.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as core from '../core.mjs';
import * as tagGroups from '../tag-groups.mjs';
import * as localText from '../local-text.mjs';

const source = (await readFile(new URL('../app.js', import.meta.url), 'utf8')).replace(/^import[^\n]+\n/gm, '');
const caseData = JSON.parse(await readFile(new URL('./fixtures/no-listed-answer.json', import.meta.url), 'utf8'));
const preserved = JSON.parse(await readFile(new URL('../data/2027.json', import.meta.url), 'utf8')).questions.find(q => q.id === '2701');
const conflict = {
  ...caseData.solution, year: 2023, examKey: '2023', examLabel: '2023학년도', number: 5,
  title: '제재처분 횟수의 문언 해석', sourceAccess: 'local-only', text: '원본 텍스트',
  sourcePage: 1, examPage: 1, dataPath: 'data/archive.json', tags: [],
};
const fixture = {
  exam: { questionCount: 2, examCount: 2 }, taxonomy: [],
  exams: [{ key: '2023', label: '2023학년도' }, { key: '2027', label: '2027학년도' }],
  questions: [conflict, { ...preserved, examKey: '2027', tags: [] }],
};

async function boot(hash = '#/question/2305', data = fixture) {
  const elements = new Map(), events = new Map(), requests = [];
  function element(key) {
    if (!elements.has(key)) elements.set(key, {
      innerHTML: '', textContent: '', hidden: true, open: false, value: '', dataset: {},
      classList: { add() {}, toggle() {} }, style: { setProperty() {} },
      addEventListener() {}, focus() {}, setAttribute() {}, removeAttribute() {},
      getClientRects() { return [1]; },
      getBoundingClientRect() { return { left: 0, top: 0, bottom: 10, width: 100, height: 20 }; },
      showModal() { this.open = true; }, close() { this.open = false; },
    });
    return elements.get(key);
  }
  const document = { querySelector: element, querySelectorAll() { return []; }, addEventListener(k, fn) { events.set(k, fn); } };
  const location = { hash, href: 'https://example.invalid/' + hash };
  const memory = new Map();
  const env = {
    document, location, window: { addEventListener() {}, scrollTo() {}, innerWidth: 1440, innerHeight: 900 },
    history: { replaceState(_a, _b, path) { location.hash = path; } }, navigator: {},
    localStorage: { getItem: k => memory.get(k) || null, setItem: (k, v) => memory.set(k, String(v)) },
    fetch: async path => {
      requests.push(path);
      if (!String(path).startsWith('data/archive.json?')) return { ok: false, status: 404 };
      return { ok: true, json: async () => structuredClone(data) };
    }, ...core, ...tagGroups, ...localText,
  };
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const app = await new AsyncFunction(...Object.keys(env), source + '\nreturn {state,render};')(...Object.values(env));
  return { app, elements, location, requests, html: () => elements.get('#main').innerHTML };
}
const escaped = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function assertNoInventedAnswer(html) {
  assert.match(html, /class="conflict-alert"/);
  assert.match(html, /보존한 원본 표시 답안/);
  assert.match(html, /② · 검토 필요/);
  assert.match(html, /원본 표시 · 불일치/);
  assert.equal((html.match(/class="option-row/g) || []).length, 5);
  assert.doesNotMatch(html, /class="answer-strip"|option-row[^\"]*is-correct|option-correct-label|정답 ②/);
}

test('null-derived conflict preserves source ② and never marks an option as the solved answer', async () => {
  const page = await boot();
  assertNoInventedAnswer(page.html());
  assert.equal(page.app.state.questions.get('2305').sourceMarkedAnswer, 2);
  assert.equal(page.app.state.questions.get('2305').answer, 2);
  assert.equal(page.app.state.questions.get('2305').derivedAnswer, null);
  assert.deepEqual(page.app.state.questions.get('2305').options.map(o => o.correct), [false, false, false, false, false]);
});

test('null-derived conflict explicitly displays the independent no-listed-answer conclusion', async () => {
  for (const sourceAccess of ['local-only', 'bundled']) {
    const data = structuredClone(fixture);
    Object.assign(data.questions[0], { sourceAccess, imageBundle: 'data/images/2023.json' });
    const page = await boot('#/question/2305', data);
    assertNoInventedAnswer(page.html());
    assert.ok(page.html().includes(escaped(caseData.solution.derivedConclusion)),
      `${sourceAccess}: the reader must display derivedConclusion, including that none of the listed choices is correct`);
  }
});

test('a stale correct flag cannot paint a source-conflict choice green', async () => {
  const data = structuredClone(fixture);
  data.questions[0].options[1].correct = true;
  assertNoInventedAnswer((await boot('#/question/2305', data)).html());
});

test('navigation between conflict and preserved 2027 answer does not leak answer markup or mutate either record', async () => {
  const page = await boot();
  const snapshot = structuredClone(page.app.state.data.questions);
  page.location.hash = '#/question/2701'; page.app.render();
  assert.match(page.html(), /class="answer-strip"/);
  assert.equal((page.html().match(/option-correct-label/g) || []).length, 1);
  assert.doesNotMatch(page.html(), /class="conflict-alert"/);
  page.location.hash = '#/question/2305'; page.app.render();
  assertNoInventedAnswer(page.html());
  assert.deepEqual(page.app.state.data.questions, snapshot);
});

test('image cache separates exam paths, validates exam keys, and returns only the requested ID', async () => {
  const calls = [];
  const bytesA = 'UklGRgAA', bytesB = 'UklGRgAB';
  const store = core.createImageBundleStore(async path => {
    calls.push(path);
    const examKey = path.includes('2019') ? '2019' : '2020';
    return { ok: true, json: async () => ({ schemaVersion: 1, mimeType: 'image/webp', examKey,
      images: examKey === '2019' ? { '1901': bytesA, '1902': bytesB } : { '2001': bytesB } }) };
  }, { version: 'independent-review' });
  const a = { id: '1901', examKey: '2019', imageBundle: 'data/images/2019.json' };
  const b = { ...a, id: '1902' };
  const c = { id: '2001', examKey: '2020', imageBundle: 'data/images/2020.json' };
  const [urlA, urlB, urlC] = await Promise.all([store.load(a), store.load(b), store.load(c)]);
  assert.equal(urlA, `data:image/webp;base64,${bytesA}`);
  assert.equal(urlB, `data:image/webp;base64,${bytesB}`);
  assert.equal(urlC, `data:image/webp;base64,${bytesB}`);
  assert.deepEqual(calls.sort(), ['data/images/2019.json?v=independent-review', 'data/images/2020.json?v=independent-review']);
  await assert.rejects(store.load({ ...a, id: '1999' }), /원본 이미지가 없습니다/);
  await assert.rejects(store.load({ ...a, imageBundle: 'data/images/2020.json' }), /이미지 경로가 올바르지 않습니다/);
  await assert.rejects(store.load({ ...a, imageBundle: '../data/images/2019.json' }), /이미지 경로가 올바르지 않습니다/);
});

test('failed or incomplete image bundle can be retried without retaining a previous image', async () => {
  const q = { id: '1901', examKey: '2019', imageBundle: 'data/images/2019.json' };
  let attempts = 0;
  const store = core.createImageBundleStore(async () => {
    attempts++;
    return { ok: true, json: async () => ({ schemaVersion: 1, mimeType: 'image/webp',
      examKey: attempts === 1 ? '2020' : '2019', images: attempts === 3 ? { '1901': 'UklGRgAA' } : {} }) };
  });
  await assert.rejects(store.load(q), /자료 형식/);
  assert.equal(store.get(q).url, '');
  await assert.rejects(store.load(q, { retry: true }), /원본 이미지가 없습니다/);
  assert.equal(store.get(q).url, '');
  assert.equal(await store.load(q, { retry: true }), 'data:image/webp;base64,UklGRgAA');
  assert.equal(attempts, 3);
});

test('the complete 755-question archive renders all real readers with preserved keys and 2027 content', async t => {
  const data = JSON.parse(await readFile(new URL('../data/archive.json', import.meta.url), 'utf8'));
  if (!['full-content', 'explanations-only'].includes(data.publicationMode)) { t.skip('full archive has not yet been generated'); return; }
  assert.equal(data.questions.length, 755);
  const originals = JSON.parse(await readFile(new URL('../data/2027.json', import.meta.url), 'utf8')).questions;
  const stableFields = ['text', 'rawText', 'image', 'thumbnail', 'answer', 'sourceMarkedAnswer', 'answerStatus', 'summary', 'steps', 'statements', 'options', 'textCorrections', 'reviewNotes'];
  for (const before of originals) {
    const after = data.questions.find(q => q.id === before.id);
    for (const key of stableFields) assert.deepEqual(after[key], before[key], `${before.id}: preserved ${key}`);
  }
  const page = await boot('#/question/1034', data);
  assert.equal(page.app.state.questions.size, 755);
  const keys = new Map(data.questions.map(q => [q.id, [q.answer, q.sourceMarkedAnswer, q.derivedAnswer]]));
  let conflicts = 0, noListedAnswers = 0;
  for (const q of data.questions) {
    page.location.hash = `#/question/${q.id}`;
    page.app.render();
    const html = page.html();
    assert.equal((html.match(/class="option-row/g) || []).length, 5, `${q.id}: five explanations`);
    if (q.answerStatus === 'source-conflict') {
      conflicts++;
      assert.doesNotMatch(html, /class="answer-strip"|option-row[^\"]*is-correct|option-correct-label/, q.id);
      assert.match(html, /원본 표시 · 불일치/, q.id);
      if (q.derivedAnswer === null) {
        noListedAnswers++;
        assert.ok(html.includes(escaped(q.derivedConclusion)), `${q.id}: actual no-listed-answer conclusion`);
        assert.ok(q.options.every(o => o.correct === false), q.id);
      }
    } else {
      assert.equal((html.match(/option-correct-label/g) || []).length, 1, `${q.id}: one verified answer`);
    }
    const actual = page.app.state.questions.get(q.id);
    assert.deepEqual([actual.answer, actual.sourceMarkedAnswer, actual.derivedAnswer], keys.get(q.id), `${q.id}: keys unchanged by rendering`);
  }
  assert.ok(conflicts >= 2);
  assert.ok(noListedAnswers >= 2);
});
