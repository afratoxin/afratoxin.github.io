import test from 'node:test';
import assert from 'node:assert/strict';

// Catch the missing module so the initial run reports the intended data-contract failures.
const api = await import('./abx-extra-data.mjs').catch(() => ({}));
const keys = new Set(['mycolic','arabinosyl','pza','atpsynthase','rnap','ergosterol','demethylase','glucan','dna_pol','rt','viral_rnap','hcv_protease','ns5a','ns5b','m2','neuraminidase','endonuclease','hiv_protease','ccr5','fusion','integrase']);

test('27강 약물 44개는 강의 출처와 기전 키를 가진다', () => {
  assert.ok(Array.isArray(api.DRUGS), 'DRUGS export');
  assert.equal(api.DRUGS.length, 44);
  assert.equal(new Set(api.DRUGS.map(d => d.id)).size, 44);
  assert.deepEqual(new Set(api.DRUGS.map(d => d.family)), new Set(['항마이코박테리아','항진균','항바이러스']));
  for (const d of api.DRUGS) {
    assert.equal(d.lecture, 27);
    assert.match(d.source, /^27강 강의록 PDF \d+쪽$/);
    assert.ok(d.id && d.name && d.note);
    assert.equal(typeof d.core, 'boolean');
    assert.ok([1,2,3].includes(d.weight));
    assert.ok(d.targets.length && new Set(d.targets).size === d.targets.length);
    for (const key of d.targets) assert.ok(keys.has(key), `${d.id}: ${key}`);
  }
});

test('교차 표적과 잘못된 요약의 기전을 바로잡는다', () => {
  assert.ok(Array.isArray(api.DRUGS));
  const by = id => api.DRUGS.find(d => d.id === id);
  assert.deepEqual(by('isoniazid').targets, ['mycolic']);
  assert.deepEqual(by('rifampin').targets, ['rnap']);
  assert.deepEqual(by('ethambutol').targets, ['arabinosyl']);
  assert.deepEqual(by('pyrazinamide').targets, ['pza']);
  for (const id of ['tenofovir','lamivudine']) assert.deepEqual(new Set(by(id).targets), new Set(['dna_pol','rt']));
  for (const id of ['ketoconazole','itraconazole','fluconazole','voriconazole','posaconazole']) {
    assert.deepEqual(by(id).targets, ['demethylase']);
    assert.match(by(id).note, /14α-demethylase/);
  }
  assert.deepEqual(by('enfuvirtide').targets, ['fusion']);
  assert.match(by('enfuvirtide').note, /gp41/);
  assert.deepEqual(by('maraviroc').targets, ['ccr5']);
  assert.match(by('nystatin').note, /경구/);
  assert.match(by('nystatin').note, /흡수.*거의/);
  assert.doesNotMatch(by('pyrazinamide').note, /RpsA/);
  assert.deepEqual(by('glecaprevir').targets, ['hcv_protease']);
  assert.deepEqual(by('pibrentasvir').targets, ['ns5a']);
  assert.deepEqual(by('sofosbuvir').targets, ['ns5b']);
});

test('41문항은 단일 정답 5지선다·고유 ID·강의 페이지 출처를 제공한다', () => {
  assert.ok(Array.isArray(api.QUESTIONS), 'QUESTIONS export');
  assert.equal(api.QUESTIONS.length, 41);
  assert.equal(new Set(api.QUESTIONS.map(q => q.id)).size, 41);
  assert.equal(new Set(api.QUESTIONS.map(q => q.stem)).size, 41);
  for (const q of api.QUESTIONS) {
    assert.match(q.id, /^extra-/);
    assert.equal(q.lecture, 27);
    assert.ok(['mechanism','clinical','resistance','pkpd'].includes(q.group));
    assert.equal(q.options.length, 5, q.id);
    assert.equal(new Set(q.options).size, 5, q.id);
    assert.equal(q.options[0], q.answer, q.id);
    assert.equal(q.options.filter(x => x === q.answer).length, 1);
    assert.ok(q.subject && q.stem && q.note);
    assert.match(q.source, /^27강 강의록 PDF \d+쪽$/);
    assert.equal(typeof q.core, 'boolean');
    assert.ok([1,2,3].includes(q.weight));
  }
  assert.deepEqual(new Set(api.QUESTIONS.map(q => q.group)), new Set(['mechanism','clinical','resistance','pkpd']));
});

test('별도 슬라이드의 Ribavirin을 바이러스 RNA polymerase 억제로 포함한다', () => {
  assert.ok(Array.isArray(api.DRUGS) && Array.isArray(api.QUESTIONS));
  const d = api.DRUGS.find(d => d.id === 'ribavirin');
  assert.ok(d, '27강 PDF 34쪽의 Ribavirin 포함');
  assert.deepEqual(d.targets, ['viral_rnap']);
  assert.equal(d.lecture, 27);
  assert.equal(d.family, '항바이러스');
  assert.equal(d.source, '27강 강의록 PDF 34쪽');
  assert.match(d.note, /RNA-dependent RNA polymerase/);
  assert.doesNotMatch(d.note, /NS5B/);
  const q = api.QUESTIONS.find(q => q.subject === 'ribavirin');
  assert.ok(q);
  assert.equal(q.answer, 'RNA 의존성 RNA polymerase 억제');
  assert.equal(q.source, '27강 강의록 PDF 34쪽');
});

test('다중 표적 약물·공통 역전사효소 표적은 단일 오답으로 취급하지 않는다', () => {
  assert.ok(Array.isArray(api.QUESTIONS));
  const q = id => api.QUESTIONS.find(q => q.id === id);
  assert.equal(q('extra-tenofovir-dual').answer, 'HBV DNA polymerase·HIV 역전사효소');
  assert.equal(q('extra-enfuvirtide-target').answer, '바이러스 gp41');
  assert.equal(q('extra-efavirenz-activation').answer, '인산화 없이 역전사효소 억제');
  assert.equal(q('extra-raltegravir-stage').answer, '바이러스 DNA의 숙주 염색체 통합');
  for (const item of api.QUESTIONS.filter(q => ['nrtis','efavirenz','ritonavir','maraviroc','enfuvirtide','raltegravir'].includes(q.subject))) {
    assert.equal(item.core, false, item.id);
    assert.equal(item.weight, 1, item.id);
  }
});

test('외부 교정 근거는 공식 허가문서 링크와 원래 PDF 위치를 함께 남긴다', () => {
  assert.ok(Array.isArray(api.SOURCE_CORRECTIONS));
  for (const id of ['azole-target','nystatin-route','enfuvirtide-target','hcv-targets']) {
    const row = api.SOURCE_CORRECTIONS.find(x => x.id === id);
    assert.ok(row && row.note && row.source);
    assert.ok(row.urls.length);
    for (const url of row.urls) assert.match(url, /^https:\/\/(www\.)?dailymed\.nlm\.nih\.gov\//);
  }
});
