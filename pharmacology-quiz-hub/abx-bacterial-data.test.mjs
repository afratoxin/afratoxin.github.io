import test from 'node:test';
import assert from 'node:assert/strict';

// A missing module becomes an assertion failure during the initial red run.
const data = await import('./abx-bacterial-data.mjs').catch(() => ({}));
const drugs = data.DRUGS ?? [];
const questions = data.QUESTIONS ?? [];
const allowedTargets = new Set(['30s', '50s', 'dhps', 'dhfr', 'gyrase', 'topo4', 'dala', 'membrane', 'dna_damage', 'rnap', 'pbp', 'bla', 'bactoprenol', 'alanine']);
const drug = id => drugs.find(row => row.id === id);
const question = id => questions.find(row => row.id === `bac-${id}`);

test('25/26강 약물과 일반문항을 충분한 범위로 내보낸다', () => {
  assert.ok(drugs.length >= 25, 'named drug rows >=25');
  assert.ok(questions.length >= 35 && questions.length <= 45, 'general questions 35–45');
  assert.deepEqual([...new Set(drugs.map(row => row.lecture))].sort(), [25, 26]);
  assert.deepEqual([...new Set(questions.map(row => row.lecture))].sort(), [25, 26]);
});

test('약물 ID·표적·강의 출처와 빈도 가중치가 유효하다', () => {
  assert.equal(new Set(drugs.map(row => row.id)).size, drugs.length);
  for (const row of drugs) {
    assert.match(row.id, /^[a-z0-9-]+$/);
    assert.ok(row.name && row.family && row.note, row.id);
    assert.ok(row.targets.length > 0, row.id);
    assert.equal(new Set(row.targets).size, row.targets.length, row.id);
    assert.ok(row.targets.every(target => allowedTargets.has(target)), row.id);
    assert.match(row.source, new RegExp(`^${row.lecture}강 강의록 PDF \\d+쪽`));
    assert.equal(typeof row.core, 'boolean');
    assert.ok([1, 2, 3].includes(row.weight));
  }
});

test('각 문항은 고유한 다섯 선지와 하나의 정답 및 설명을 가진다', () => {
  assert.equal(new Set(questions.map(row => row.id)).size, questions.length);
  assert.deepEqual([...new Set(questions.map(row => row.group))].sort(), ['clinical', 'mechanism', 'pkpd', 'resistance']);
  for (const row of questions) {
    assert.match(row.id, /^bac-/);
    assert.ok(row.subject && row.stem && row.note, row.id);
    assert.equal(row.options.length, 5, row.id);
    assert.equal(new Set(row.options.map(value => value.trim())).size, 5, row.id);
    assert.equal(row.options.filter(value => value === row.answer).length, 1, row.id);
    assert.equal(row.options[0], row.answer, row.id);
    assert.match(row.source, new RegExp(`^${row.lecture}강 강의록 PDF \\d+쪽`));
    assert.equal(typeof row.core, 'boolean');
    assert.ok([1, 2, 3].includes(row.weight));
    const assessedText = [row.stem, ...row.options].join(' ');
    assert.doesNotMatch(assessedText, /23S\s*rRNA|16S\s*rRNA|\b[AP]\s*site\b|translocation|peptidyl\s*transferase|전좌|펩티딜|아미노아실/i, row.id);
  }
});

test('주요 항균 표적의 계열 구분을 보존한다', () => {
  for (const id of ['gentamicin', 'tobramycin', 'neomycin', 'paromomycin', 'amikacin', 'kanamycin', 'tetracycline', 'doxycycline', 'minocycline', 'tigecycline', 'demeclocycline']) assert.deepEqual(drug(id)?.targets, ['30s'], id);
  for (const id of ['erythromycin', 'clarithromycin', 'azithromycin', 'clindamycin', 'chloramphenicol']) assert.deepEqual(drug(id)?.targets, ['50s'], id);
  assert.deepEqual(drug('sulfamethoxazole')?.targets, ['dhps']);
  assert.deepEqual(drug('trimethoprim')?.targets, ['dhfr']);
  for (const id of ['nalidixic-acid', 'ciprofloxacin', 'levofloxacin', 'moxifloxacin']) assert.deepEqual(drug(id)?.targets, ['gyrase', 'topo4'], id);
  assert.deepEqual(drug('vancomycin')?.targets, ['dala']);
  for (const id of ['polymyxin-b', 'colistin']) assert.deepEqual(drug(id)?.targets, ['membrane'], id);
});

test('TMP 크레아티닌 분비 억제와 실제 신손상을 혼동하지 않는다', () => {
  const row = question('tmp-creatinine');
  assert.ok(row);
  assert.match(row.stem, /BUN.*요량/);
  assert.match(row.answer, /크레아티닌.*세뇨관.*분비.*억제/);
  assert.match(row.note, /실제 신손상/);
  assert.match(question('tmp-potassium')?.answer ?? '', /나트륨.*통로.*차단/);
  assert.match(question('ag-kidney')?.answer ?? '', /근위세뇨관/);
});

test('혐기성 농양·배설 차이·유도성 내성을 정확히 구분한다', () => {
  assert.match(question('ag-hypoxia')?.answer ?? '', /산소.*의존.*수송/);
  assert.match(question('moxi-urine')?.answer ?? '', /요중.*농도.*낮/);
  assert.equal(question('mlsb-scope')?.answer, 'Chloramphenicol');
  assert.match(question('d-test')?.answer ?? '', /D-test/);
  assert.equal(question('macrolide-cyp')?.answer, 'Azithromycin');
});

test('CYP 상호작용 문제는 제형만 다른 동일 성분을 중복 선지로 쓰지 않는다', () => {
  const choices = question('macrolide-cyp')?.options ?? [];
  assert.equal(new Set(choices.map(value => value.replace(/ (장용정|서방정)$/, ''))).size, 5);
});

test('소아 doxycycline 예외와 중증 MRSA에서의 AUC 목표를 명시한다', () => {
  assert.match(question('doxy-child')?.answer ?? '', /단기.*doxycycline/);
  const row = question('vanco-auc');
  assert.match(row?.stem ?? '', /중증 MRSA/);
  assert.match(row?.stem ?? '', /MIC.*1 mg\/L/);
  assert.match(row?.answer ?? '', /AUC24\/MIC.*400.*600/);
  assert.match(row?.note ?? '', /모든 감염/);
});
