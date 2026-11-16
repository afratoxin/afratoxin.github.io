const A = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm');
const E = require('../rotation-pattern/engine.js');
function rng(seed) { return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296); }
// Independent screen-centred geometry oracle, including the two possible 3D flip axes.
function geometric(index, n, ops) {
  let x = index % n - (n - 1) / 2, y = Math.floor(index / n) - (n - 1) / 2;
  for (const op of ops) {
    const { axis, angle } = E.OPS[op];
    if (axis === 'X') y = -y;
    else if (axis === 'Y') x = -x;
    else { const a = angle * Math.PI / 180, oldX = x; x = Math.round((x * Math.cos(a) - y * Math.sin(a)) * 2) / 2; y = Math.round((oldX * Math.sin(a) + y * Math.cos(a)) * 2) / 2; }
  }
  return Math.round(y + (n - 1) / 2) * n + Math.round(x + (n - 1) / 2);
}
for (let n = 3; n <= 11; n++) for (let i = 0; i < n * n; i++) {
  for (const op of Object.keys(E.OPS)) A.equal(E.transform(i, n, op), geometric(i, n, [op]), n + ':' + i + ':' + op);
  A.equal(E.apply([i], n, ['cw', 'cw', 'cw', 'cw'])[0], i);
  A.equal(E.apply([i], n, ['up', 'right', 'down', 'left'])[0], i);
  for (const op1 of Object.keys(E.OPS)) for (const op2 of Object.keys(E.OPS)) A.equal(E.apply([i], n, [op1, op2, 'cw'])[0], geometric(i, n, [op1, op2, 'cw']));
}
for (let stage = 1; stage <= 20; stage++) {
  const cfg = E.config(stage); A.equal(cfg.count, stage + 4); A(cfg.memory >= 5 && cfg.memory <= 10);
  if (stage > 1) A.equal(cfg.count, E.config(stage - 1).count + 1);
  for (let seed = 1; seed <= 100; seed++) {
    const p = E.make(cfg, rng(seed * 31 + stage));
    A.equal(new Set(p.source).size, cfg.count); A.equal(p.target.length, cfg.count);
    A.equal(p.operations.length, cfg.transforms); A(!E.same(p.source, p.target));
    for (let i = 1; i < p.operations.length; i++) A(!E.same(E.apply([0, 1, 3], 2, p.operations.slice(i - 1, i + 1)), [0, 1, 3]), 'no immediate undo');
    A.deepEqual(p.target, p.source.map(i => geometric(i, p.size, p.operations)).sort((a, b) => a - b));
    A(p.target.every(i => i >= 0 && i < p.size * p.size));
    A(E.judge(p.target, p.target).correct);
    const missing = E.judge(p.target, p.target.slice(1)); A(!missing.correct); A.equal(missing.missing.length, 1);
    const blank = Array.from({ length: p.size * p.size }, (_, i) => i).find(i => !p.target.includes(i));
    const wrong = E.judge(p.target, [blank, ...p.target.slice(1)]); A.equal(wrong.extra.length, 1); A.equal(wrong.missing.length, 1);
  }
}
console.log('PASS: 2,000 generated puzzles across all 20 stages; independent 3D geometry and composition oracle; exact-set grading and increasing light counts.');

function runtime({ reduced = true, storage = {} } = {}) {
  let ms = 0, nextTimer = 1, latest, made = 0, animationsMade = 0;
  const queue = new Map(), nodes = new Map(), handlers = {}, animations = [];
  class Node {
    constructor(id = '') { this.id = id; this.children = []; this.hidden = false; this.disabled = false; this.value = ''; this.textContent = ''; this.attrs = {}; this.dataset = {}; this.className = ''; this.style = { setProperty(k, v) { this[k] = v; } }; this.listeners = {}; this.tagName = 'DIV'; this.classList = { add: (...c) => c.forEach(x => { if (!this.className.split(' ').includes(x)) this.className = (this.className + ' ' + x).trim(); }), remove: (...c) => { this.className = this.className.split(' ').filter(x => !c.includes(x)).join(' '); }, contains: c => this.className.split(' ').includes(c), toggle: (c, on) => { const v = on === undefined ? !this.classList.contains(c) : on; this.classList[v ? 'add' : 'remove'](c); } }; }
    setAttribute(k, v) { this.attrs[k] = String(v); }
    addEventListener(k, fn) { this.listeners[k] = fn; }
    appendChild(n) { this.children.push(n); return n; }
    replaceChildren(n) { this.children = n.fragment ? n.children : [n]; }
    focus() { document.activeElement = this; }
    animate(_, options) {
      animationsMade++;
      let resolve, reject, remaining = options.duration, started = ms, task;
      const promise = new Promise((a, b) => { resolve = a; reject = b; });
      function schedule() { started = ms; task = timer(() => resolve(), remaining); }
      const obj = { finished: promise, pause() { remaining -= ms - started; queue.delete(task); }, play() { schedule(); }, cancel() { queue.delete(task); reject(new Error('cancelled')); } };
      schedule(); animations.push(obj); return obj;
    }
  }
  const get = id => { if (!nodes.has(id)) nodes.set(id, new Node(id)); return nodes.get(id); };
  for (const [, id] of fs.readFileSync('rotation-pattern/index.html', 'utf8').matchAll(/id="([^"]+)"/g)) get(id);
  Object.assign(get('practiceSize'), { value: '7' }); get('practiceCount').value = '5'; get('practiceMemory').value = '7'; get('practiceTransforms').value = '1'; get('practiceAnswer').value = '0';
  for (const id of ['answerActions', 'reviewLegend', 'resultPanel', 'countdownOverlay', 'privacyCover', 'successBurst', 'playingInfo', 'endActions']) get(id).hidden = true;
  function timer(fn, delay, interval = 0) { const id = nextTimer++; queue.set(id, { fn, at: ms + delay, interval }); return id; }
  const document = { activeElement: null, hidden: false, getElementById: get, createElement: () => { const n = new Node(); n.tagName = 'BUTTON'; return n; }, createDocumentFragment: () => ({ fragment: true, children: [], appendChild(n) { this.children.push(n); } }), querySelectorAll: () => [], addEventListener(k, fn) { handlers[k] = fn; } };
  const context = { document, window: { RotationPattern: { ...E, make(...args) { made++; return latest = E.make(...args); } }, matchMedia: () => ({ matches: reduced }) }, localStorage: { getItem: k => storage[k] || null, setItem: (k, v) => storage[k] = v }, performance: { now: () => ms }, setTimeout: (fn, d) => timer(fn, d), setInterval: (fn, d) => timer(fn, d, d), requestAnimationFrame: fn => timer(fn, 16), console };
  vm.runInNewContext(fs.readFileSync('rotation-pattern/game.js', 'utf8'), context);
  async function advance(amount) {
    const until = ms + amount;
    for (;;) {
      for (let k = 0; k < 8; k++) await Promise.resolve();
      const entry = [...queue].sort((a, b) => a[1].at - b[1].at).find(([, item]) => item.at <= until);
      if (!entry) break;
      const [id, item] = entry; ms = item.at; queue.delete(id);
      if (item.interval) queue.set(id, { ...item, at: ms + item.interval });
      item.fn();
    }
    ms = until; for (let k = 0; k < 10; k++) await Promise.resolve();
  }
  return { get, document, advance, storage, latest: () => latest, made: () => made, animationsMade: () => animationsMade,
    click(id) { get(id).onclick(); }, cell(i) { get('grid').children[i].listeners.click(); },
    phase: () => get('motionBoard').dataset.phase,
    async until(p, max = 30000) { for (let t = 0; t < max && this.phase() !== p; t += 50) await advance(50); A.equal(this.phase(), p); },
    visibility(hidden) { document.hidden = hidden; handlers.visibilitychange(); }, key(event) { handlers.keydown(event); }
  };
}
(async () => {
  const r = runtime(); A.equal(r.get('grid').children.length, 49); r.click('start');
  await r.until('memory'); A.equal(r.get('grid').children.filter(c => c.classList.contains('lit')).length, 5);
  r.cell(0); A.equal(r.get('selectedCount').textContent, '0 / 5');
  r.visibility(true); const savedClock = r.get('clock').textContent; await r.advance(60000);
  A.equal(r.phase(), 'memory'); A.equal(r.get('clock').textContent, savedClock); A(!r.get('privacyCover').hidden);
  r.visibility(false); r.click('resume'); await r.until('answer');
  A.equal(r.get('grid').children.filter(c => c.classList.contains('lit')).length, 0);
  const p = r.latest(); p.target.slice(0, 4).forEach(i => r.cell(i)); A(r.get('submit').disabled);
  r.cell(p.target[4]); A(!r.get('submit').disabled);
  r.get('grid').children[p.target[4]].focus(); let prevented = false;
  await r.advance(1000); r.key({ key: 'Enter', preventDefault() { prevented = true; } });
  A(prevented); A.equal(r.phase(), 'success'); A(!r.get('successBurst').hidden); A.equal(r.get('selectedCount').textContent, '5 / 5');
  // A duplicate submission cannot grant a second stage or start a competing loop.
  r.click('submit'); await r.until('memory'); A.equal(r.latest().count, 6); A.equal(r.made(), 2);
  await r.until('answer'); const p2 = r.latest(), blank = Array.from({ length: 49 }, (_, i) => i).find(i => !p2.target.includes(i));
  r.cell(blank); p2.target.slice(1).forEach(i => r.cell(i)); r.click('submit');
  A.equal(r.phase(), 'ended'); A(!r.get('reviewLegend').hidden);
  A(r.get('grid').children[blank].classList.contains('extra')); A(r.get('grid').children[p2.target[0]].classList.contains('miss'));
  const record = JSON.parse(r.storage['rotation-pattern-record-v1']); A.equal(record.passed, 1); A(record.time >= 1000);
  r.click('replay'); await r.until('answer'); A.equal(r.get('clock').textContent, '제한 없음'); A.deepEqual(r.latest().target, p2.target);
  await r.advance(200000); A.equal(r.phase(), 'answer'); r.click('endRun'); A.equal(r.storage['rotation-pattern-record-v1'], JSON.stringify(record));
  r.click('settings'); A(!r.get('setup').hidden); r.click('challengeMode'); r.click('start'); await r.until('answer');
  await r.advance(25050); A.equal(r.phase(), 'ended'); A.match(r.get('resultTitle').textContent, /시간/);
  r.click('again'); await r.advance(700); r.click('endRun'); const count = r.made(); await r.advance(30000); A.equal(r.made(), count); A.equal(r.phase(), 'ended');
  console.log('PASS: memory blocks input; privacy pause; full hide before answer; exact selection; Enter from focused cell; success advances +1; duplicate guard; wrong/missing review; timeout; record isolation; same-pattern practice; interrupted-loop cancellation.');

  const full = runtime({ reduced: false }); full.click('start');
  for (let stage = 1; stage <= 20; stage++) {
    await full.until('answer', 40000); A.equal(full.latest().count, stage + 4);
    A.equal(full.get('grid').children.length, E.config(stage).size ** 2);
    await full.advance(200); full.latest().target.forEach(i => full.cell(i)); full.click('submit');
    A.equal(full.phase(), 'success'); if (stage < 20) await full.until('countdown');
  }
  await full.until('ended'); A.match(full.get('resultTitle').textContent, /20단계 완주/);
  A.equal(JSON.parse(full.storage['rotation-pattern-record-v1']).passed, 20); A(full.animationsMade() > 40);
  console.log('PASS: full 20-stage challenge using the animated path; board expands at stages 7 and 13; all stage counts and final completion record verified.');

  const hub = fs.readFileSync('brain-arena/catalog.js', 'utf8'); A(!hub.includes('tile-connect')); A(hub.includes('rotation-pattern'));
  A(!fs.existsSync('tile-connect')); A(!fs.existsSync('tests/tile-connect.cjs'));
  console.log('PASS: deleted Tile Connect source and tests; replacement registered in the originals folder.');
})().catch(error => { console.error(error); process.exitCode = 1; });
