import test from 'node:test';
import assert from 'node:assert/strict';

// Independent expectations: these fail if a named inhibitor is relabelled as a
// PBP antibiotic, if the corrected Mycoplasma slide is ignored, or if a bank row
// loses its stable identity, source, or single-answer shape.
const bank = await import('./abx-core-data.mjs').catch(() => ({}));
const canonical = new Set(['cellwall', 'pbp', 'bla', 'dala', 'bactoprenol', 'alanine', 'membrane', '30s', '50s', 'dhps', 'dhfr', 'gyrase', 'topo4', 'rnap', 'dna_damage']);

test('23/24 bank exports sufficient named drugs and original MCQs', () => {
  assert.ok(Array.isArray(bank.DRUGS), 'DRUGS bank is not implemented');
  assert.ok(bank.DRUGS.length >= 20);
  assert.ok(Array.isArray(bank.QUESTIONS), 'QUESTIONS bank is not implemented');
  assert.ok(bank.QUESTIONS.length >= 30 && bank.QUESTIONS.length <= 40);
});

test('named PBP drugs and beta-lactamase inhibitors retain distinct targets', () => {
  const rows = new Map((bank.DRUGS || []).map(row => [row.id, row]));
  for (const id of ['penicillin-g', 'ampicillin', 'amoxicillin', 'piperacillin', 'cefazolin', 'ceftazidime', 'cefepime', 'ceftaroline', 'aztreonam', 'imipenem', 'meropenem', 'ertapenem']) {
    assert.deepEqual(rows.get(id)?.targets, ['pbp'], `${id} must act on PBP`);
  }
  for (const id of ['clavulanic-acid', 'sulbactam', 'tazobactam', 'avibactam']) {
    assert.deepEqual(rows.get(id)?.targets, ['bla'], `${id} must be a beta-lactamase inhibitor`);
  }
});

test('23강의 명시된 metronidazole 기전은 DNA 손상으로 유지한다', () => {
  const row = bank.DRUGS?.find(row => row.id === 'metronidazole');
  assert.deepEqual(row?.targets, ['dna_damage']);
  assert.equal(row?.lecture, 23);
  assert.equal(row?.source, '23강 강의록 PDF 19쪽');
});

test('23강 세포벽 억제 약물은 강의에 없는 세부 표적을 추가하지 않는다', () => {
  for (const id of ['bacitracin', 'cycloserine']) {
    const row = bank.DRUGS?.find(row => row.id === id);
    assert.deepEqual(row?.targets, ['cellwall']);
    assert.equal(row?.lecture, 23);
    assert.equal(row?.source, '23강 강의록 PDF 16쪽');
    assert.equal(row?.core, true);
    assert.doesNotMatch(row?.note || '', /bactoprenol|racemase|ligase/i);
  }
  assert.ok(bank.DRUGS?.some(row => row.lecture === 23 && row.core));
});

test('all facts have unique stable IDs, canonical targets and PDF provenance', () => {
  assert.ok(bank.DRUGS?.length);
  assert.equal(new Set(bank.DRUGS.map(row => row.id)).size, bank.DRUGS.length);
  assert.equal(new Set(bank.DRUGS.map(row => row.name.toLowerCase())).size, bank.DRUGS.length);
  for (const row of bank.DRUGS) {
    assert.match(row.id, /^[a-z][a-z0-9-]*$/);
    assert.ok([23, 24].includes(row.lecture));
    assert.ok(row.name && row.family && row.note);
    assert.ok(row.targets.length && row.targets.every(target => canonical.has(target)));
    assert.equal(new Set(row.targets).size, row.targets.length);
    assert.match(row.source, new RegExp(`^${row.lecture}강 강의록 PDF \\d+쪽$`));
    assert.equal(typeof row.core, 'boolean');
    assert.ok([1, 2, 3].includes(row.weight));
  }
});

test('every question has five distinct choices, one answer and an explanation', () => {
  assert.ok(bank.QUESTIONS?.length);
  assert.equal(new Set(bank.QUESTIONS.map(row => row.id)).size, bank.QUESTIONS.length);
  assert.equal(new Set(bank.QUESTIONS.map(row => row.stem)).size, bank.QUESTIONS.length);
  for (const row of bank.QUESTIONS) {
    assert.match(row.id, /^core-[a-z0-9-]+$/);
    assert.ok([23, 24].includes(row.lecture));
    assert.ok(['principle', 'mechanism', 'resistance', 'pkpd', 'clinical'].includes(row.group));
    assert.ok(row.subject && row.stem && row.answer && row.note);
    assert.equal(row.options.length, 5, row.id);
    assert.equal(new Set(row.options).size, 5, row.id);
    assert.equal(row.options.filter(value => value === row.answer).length, 1, row.id);
    assert.equal(row.options[0], row.answer, 'consumer randomizes answer position');
    assert.match(row.source, new RegExp(`^${row.lecture}강 강의록 PDF \\d+쪽$`));
    assert.equal(typeof row.core, 'boolean');
    assert.ok([1, 2, 3].includes(row.weight));
    assert.doesNotMatch(`${row.stem} ${row.note}`, /23S|16S|28S|5S|50S[^.。]*23S/);
  }
  assert.deepEqual(new Set(bank.QUESTIONS.map(row => row.lecture)), new Set([23, 24]));
  assert.deepEqual(new Set(bank.QUESTIONS.map(row => row.group)), new Set(['principle', 'mechanism', 'resistance', 'pkpd', 'clinical']));
});

test('known source corrections and PK/PD distinctions are explicit', () => {
  const rows = new Map((bank.QUESTIONS || []).map(row => [row.id, row]));
  assert.equal(rows.get('core-mic-readout')?.answer, '4 μg/mL');
  assert.equal(rows.get('core-mbc-readout')?.answer, '16 μg/mL');
  assert.match(rows.get('core-mycoplasma-wall')?.answer || '', /Mycoplasma pneumoniae/);
  assert.equal(rows.get('core-mycoplasma-wall')?.source, '24강 강의록 PDF 16쪽');
  assert.match(rows.get('core-beta-time-index')?.answer || '', /fT>MIC/);
  assert.match(rows.get('core-ceftaroline-spectrum')?.answer || '', /MRSA/);
  assert.match(rows.get('core-ceftaroline-spectrum')?.note || '', /녹농균.*활성.*없/);
  assert.match(rows.get('core-ertapenem-exception')?.answer || '', /Ertapenem/);
  assert.match(rows.get('core-cidal-superiority')?.answer || '', /우월.*단정.*없/);
});
