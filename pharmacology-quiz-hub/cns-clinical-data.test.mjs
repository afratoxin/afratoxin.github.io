import test from 'node:test';
import assert from 'node:assert/strict';
import {DRUGS} from './cns-data.mjs';
import {CNS_DRUG_PRIORITY} from './cns-priority.mjs';

const module = await import('./cns-clinical-data.mjs').catch(error => ({loadError:error}));
// Independently reviewed lecture answers and physical PDF pages; changing a key or
// page in the bank must not silently change this reference contract.
const expected = [
  ['ad-cholinergic','Donepezil','donepezil','8·10'],
  ['ad-excitotoxicity','Memantine','memantine','8·10'],
  ['ad-amyloid','Lecanemab','lecanemab','8'],
  ['pd-precursor','Levodopa','levodopa','14·16'],
  ['pd-peripheral','Carbidopa','carbidopa','14·16'],
  ['pd-maob','Selegiline','selegiline','14·16'],
  ['pd-comt','Entacapone','entacapone','14·16'],
  ['pd-direct','Bromocriptine','bromocriptine','14·16'],
  ['pd-dyskinesia','Amantadine','amantadine','14'],
  ['bzd-reversal','Flumazenil','flumazenil','17·18'],
  ['procedure-amnesia','Midazolam','midazolam','18'],
  ['anxiety-5ht1a','Buspirone','buspirone','21'],
  ['sleep-zdrug','Zolpidem','zolpidem','21'],
  ['anxiety-bzd','Diazepam','diazepam','17·18·19'],
  ['anesthesia-redistribution','Thiopental','thiopental','20·22'],
  ['anesthesia-inhaled','Sevoflurane','sevoflurane','22'],
  ['epilepsy-long-barbiturate','Phenobarbital','phenobarbital','19·20·31'],
  ['depression-ssri','Fluoxetine','fluoxetine','24·25'],
  ['depression-snri','Duloxetine','duloxetine','24·25'],
  ['psychosis-partial','Aripiprazole','aripiprazole','26·28'],
  ['psychosis-typical','Haloperidol','haloperidol','26·28'],
  ['psychosis-atypical','Risperidone','risperidone','26·28'],
  ['epilepsy-absence','Ethosuximide','ethosuximide','29·31·32'],
  ['epilepsy-focal','Carbamazepine','carbamazepine','31·32'],
  ['epilepsy-hva','Gabapentin','gabapentin','31·32'],
  ['epilepsy-nmda','Felbamate','felbamate','31·32'],
  ['epilepsy-dual','Valproic acid','valproicacid','31·32'],
  ['pain-opioid','Morphine','morphine','33'],
  ['opioid-reversal','Naloxone','naloxone','33']
];
function bank() {
  assert.ok(Array.isArray(module.CNS_CLINICAL), 'CNS_CLINICAL must export the clinical case bank');
  return module.CNS_CLINICAL;
}
const normalize = name => name.toLowerCase().replace(/[^a-z0-9]/g,'');

test('clinical bank preserves all 29 reviewed IDs, answer keys, subjects and PDF pages', () => {
  assert.deepEqual(bank().map(q => [q.id,q.answer,q.subject,q.source]),
    expected.map(([id,answer,subject,pages]) => ['clinical-'+id,answer,subject,'15강 PDF '+pages+'쪽']));
  assert.equal(new Set(bank().map(q => q.id)).size, expected.length);
});

test('clinical options are five unique existing drug names with normalized answer subjects', () => {
  const names = new Set(DRUGS.map(d => d.name));
  for (const q of bank()) {
    assert.equal(q.options.length, 5, q.id);
    assert.equal(new Set(q.options).size, 5, q.id);
    for (const name of q.options) assert.ok(names.has(name), q.id+': unknown or qualified drug '+name);
    assert.ok(q.options.includes(q.answer), q.id);
    assert.equal(normalize(q.answer), q.subject, q.id);
    assert.equal(q.format, 'clinical', q.id);
    assert.equal(q.area, 'clinical', q.id);
    assert.equal(q.group, 'clinical-'+q.family, q.id);
    assert.equal(q.core, true, q.id);
    assert.equal(q.weight, 1, q.id);
    assert.ok(q.stem.length >= 35 && q.stem.length <= 180, q.id+': concise clinical stem');
    assert.match(q.stem, /환자|검사|수술|처치/, q.id);
    assert.ok(q.note.includes(q.answer), q.id+': answer named in explanation');
    assert.ok(q.note.length >= 70, q.id+': explain mechanism and contrast');
    assert.equal(q.details.length, 5, q.id);
    q.details.forEach((detail,i) => {
      assert.ok(detail.startsWith(q.options[i]+': '), q.id+': standalone detail for each option');
      assert.ok(detail.length > q.options[i].length+25, q.id+': substantive detail');
    });
  }
});

test('all clinical answers are emphasized and most have a lecture structure', () => {
  const priority = bank().map(q => CNS_DRUG_PRIORITY[q.subject]);
  assert.ok(priority.every(p => p?.emphasized));
  assert.ok(priority.filter(p => p.structures.length).length >= 22);
  assert.ok(new Set(bank().map(q => q.family)).size >= 8);
});

test('overlapping indications do not create duplicate mechanism answers', () => {
  const get = id => bank().find(q => q.id === 'clinical-'+id);
  assert.ok(!get('ad-cholinergic').options.some(n => ['Rivastigmine','Galantamine'].includes(n)));
  assert.ok(!get('ad-amyloid').options.includes('Donanemab'));
  assert.ok(!get('pd-maob').options.includes('Rasagiline'));
  assert.ok(!get('pd-comt').options.includes('Tolcapone'));
  assert.ok(!get('pd-direct').options.some(n => ['Pramipexole','Ropinirole','Rotigotine'].includes(n)));
  assert.ok(!get('opioid-reversal').options.some(n => ['Naltrexone','Nalmefene'].includes(n)));
  assert.match(get('bzd-reversal').stem, /단독/);
  assert.match(get('bzd-reversal').stem, /의존.*없|없.*의존/);
  assert.match(get('depression-snri').stem, /SNRI/);
  assert.match(get('psychosis-typical').stem, /1세대|정형/);
  assert.match(get('epilepsy-nmda').stem, /NMDA/);
});
