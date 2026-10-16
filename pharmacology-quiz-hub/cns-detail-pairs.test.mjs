import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const module = await import('./cns-detail-pairs.mjs').catch(error => ({loadError:error}));
const expectedIds = [
  'synapse-amphetamine','synapse-cocaine','ad-donepezil','ad-antibody',
  'pd-carbidopa','pd-bbb','pd-longterm','pd-amantadine','pd-comt',
  'bzd-frequency','bzd-flumazenil','bzd-midazolam','bzd-sleep','bzd-buspirone','bzd-zolpidem',
  'anesthesia-thiopental','anesthesia-long',
  'depression-selective','depression-snri','depression-muscarinic','depression-alpha',
  'depression-histamine','depression-overdose','depression-adverse',
  'psychosis-aripiprazole','psychosis-haloperidol',
  'epilepsy-absence','epilepsy-ttype','epilepsy-dual','epilepsy-gabapentin',
  'epilepsy-felbamate','epilepsy-focal','epilepsy-absence-first',
  'opioid-effects','opioid-naloxone','opioid-antagonist',
  'pd-exception','bzd-exception','depression-exception','anesthesia-exception','epilepsy-exception'
].map(id => 'detail-'+id);

function pairs() {
  assert.ok(Array.isArray(module.CNS_DETAIL_PAIRS), 'CNS_DETAIL_PAIRS must export the approved detail facts');
  return module.CNS_DETAIL_PAIRS;
}
function row(id) {
  const result = pairs().find(pair => pair.id === 'detail-'+id);
  assert.ok(result, 'missing original detail fact: '+id);
  return result;
}

test('paired detail facts retain all 41 approved question identities', () => {
  const actual = pairs();
  assert.deepEqual(actual.map(pair => pair.id), expectedIds);
  assert.equal(new Set(actual.map(pair => pair.id)).size, 41);
});

test('paired detail facts retain original subjects and page references', () => {
  const metadata = pairs().map(({id,subject,source}) => ({id,subject,source}));
  // Original identity/provenance survives; notes must describe facts independently of old choices.
  assert.equal(createHash('sha256').update(JSON.stringify(metadata)).digest('hex'),
    'd297576c3cd54c84dca59cd80f783edd307b71c0d16325d3d9a3867b2a5ad006');
});

test('every detail explanation is independent of the obsolete choice set', () => {
  for (const pair of pairs()) {
    assert.doesNotMatch(pair.note,
      /나머지|다른\s*선지|보기|두 약물|둘 다|같은 표|이 표|족보.*형태/,
      pair.id+': an explanation must name its facts rather than refer to old options');
  }
});

test('formerly context-dependent explanations identify drug classes and adverse effects explicitly', () => {
  assert.match(row('bzd-exception').note, /Buspirone.*5-HT₁A.*부분효능/);
  assert.match(row('bzd-exception').note, /BZD 계열에 속하지/);
  assert.match(row('anesthesia-exception').note, /Propofol.*정맥마취제/);
  assert.match(row('depression-exception').note, /Duloxetine.*SNRI/);
  assert.match(row('pd-exception').note, /Donepezil.*알츠하이머병.*AChE/);
  assert.match(row('pd-longterm').note, /Levodopa.*운동 변동.*이상운동증/);
  assert.match(row('pd-amantadine').note, /Amantadine.*NMDA/);
  assert.match(row('depression-overdose').note, /TCA.*심독성.*QRS 연장/);
});

test('each detail fact provides a concise entity and parallel true/false features for five-option assembly', () => {
  for (const pair of pairs()) {
    for (const key of ['id','subject','left','right','wrong','source','note','family']) {
      assert.equal(typeof pair[key], 'string', pair.id+': '+key);
      assert.ok(pair[key].trim().length, pair.id+': empty '+key);
    }
    assert.notEqual(pair.right, pair.wrong, pair.id);
    assert.ok(pair.left.length <= 70, pair.id+': entity label is too long');
    assert.ok(pair.right.length <= 70 && pair.wrong.length <= 70, pair.id+': feature is too long');
    assert.ok(!/[?？]|다음 중/.test(pair.left+pair.right+pair.wrong), pair.id+': old question leaked into tuple');
    assert.ok(!/모두|항상|전혀/.test(pair.right+pair.wrong), pair.id+': absolute wording is an answer cue');
  }
  assert.ok(new Set(pairs().map(pair => pair.left)).size >= 25, 'enough distinct entities for mixed options');
});

test('monoamine and receptor direction distractors oppose the actual action', () => {
  const amphetamine = row('synapse-amphetamine');
  assert.match(amphetamine.right, /유리.*촉진/);
  assert.match(amphetamine.wrong, /유리.*억제/);
  const cocaine = row('synapse-cocaine');
  assert.match(cocaine.right, /재흡수.*억제/);
  assert.match(cocaine.wrong, /재흡수.*촉진/);
  const aripiprazole = row('psychosis-aripiprazole');
  assert.match(aripiprazole.right, /D₂.*부분효능/);
  assert.match(aripiprazole.wrong, /D₂.*완전효능/);
  const haloperidol = row('psychosis-haloperidol');
  assert.match(haloperidol.right, /D₂.*길항/);
  assert.match(haloperidol.wrong, /D₂.*효능/);
});

test('sleep drugs and antidepressants use class distinctions without excluding real additional uses', () => {
  const sleep = row('bzd-sleep');
  assert.match(sleep.left, /Triazolam/);
  assert.match(sleep.right, /입면.*BZD/);
  assert.match(sleep.wrong, /입면.*barbiturate/);
  assert.match(row('bzd-frequency').right, /빈도.*증가/);
  assert.match(row('bzd-frequency').wrong, /시간.*증가/);
  assert.match(row('depression-selective').right, /SSRI/);
  assert.match(row('depression-selective').wrong, /SNRI/);
  assert.match(row('depression-exception').right, /SNRI/);
  assert.match(row('depression-exception').wrong, /SSRI/);
  assert.match(row('bzd-zolpidem').right, /GABA_A.*복합수면행동/);
  assert.match(row('bzd-zolpidem').wrong, /GABA_B.*복합수면행동/);
});

test('TCA adverse-effect options name the blocking action rather than excluding other real drug effects', () => {
  const muscarinic = row('depression-muscarinic');
  assert.match(muscarinic.left, /TCA.*무스카린.*차단/);
  assert.match(muscarinic.right, /구강건조/);
  assert.match(muscarinic.wrong, /침분비 증가/);
  const alpha = row('depression-alpha');
  assert.match(alpha.left, /TCA.*α.*차단/);
  assert.match(alpha.right, /체위성 저혈압/);
  assert.match(alpha.wrong, /체위성 고혈압/);
  const histamine = row('depression-histamine');
  assert.match(histamine.left, /TCA.*히스타민.*차단/);
  assert.match(histamine.right, /진정/);
  assert.match(histamine.wrong, /각성/);
});

test('antiepileptic and opioid details preserve mechanism and lecture-specific indication boundaries', () => {
  assert.match(row('epilepsy-gabapentin').right, /HVA.*Ca²⁺/);
  assert.match(row('epilepsy-gabapentin').wrong, /GABA_A.*직접 효능/);
  assert.match(row('epilepsy-dual').right, /Na⁺.*T형 Ca²⁺.*차단/);
  assert.match(row('epilepsy-absence-first').right, /강의록.*소발작.*1차/);
  assert.match(row('epilepsy-exception').wrong, /강의록.*소발작.*1차/);
  assert.match(row('opioid-effects').right, /호흡억제.*축동.*장운동 감소/);
  assert.match(row('opioid-effects').wrong, /호흡촉진.*산동.*장운동 증가/);
  assert.match(row('opioid-antagonist').right, /아편수용체 길항/);
  assert.match(row('opioid-antagonist').wrong, /아편수용체 효능/);
});
