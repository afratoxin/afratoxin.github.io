import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {IMM_DRUGS} from './immune-data.mjs';
import {ANTI_DRUGS} from './anticancer-data.mjs';
import {SIGNAL_DRUGS} from './signal31-data.mjs';
import {normalizeStudyQuestion,shuffleStudyQuestion,gradeStudyAnswer} from './study-records.mjs';

const path=new URL('./immune-cancer-clinical-data.mjs',import.meta.url);
const api=existsSync(path)?await import(path):{};
// Independently specified answers and the clinical discriminator each case must retain.
const expected={
 IMM_CLINICAL:{filgrastim:['Filgrastim',/호중구/,/G-CSF/],sargramostim:['Sargramostim',/호산구/,/GM-CSF/],epo:['EPO',/빈혈/,/적혈구/],cyclosporine:['Cyclosporine',/이식/,/Cyclophilin/],tacrolimus:['Tacrolimus',/이식/,/FKBP12/],mmf:['Mycophenolate mofetil (MMF)',/이식/,/IMPDH/],aza:['Azathioprine (AZA)',/이식/,/6-MP/],atg:['ATG',/이식/,/다클론/],abatacept:['Abatacept',/류마티스/,/공동자극/],natalizumab:['Natalizumab',/다발성경화증/,/침윤/]},
 ANTI_CLINICAL:{dactinomycin:['Dactinomycin (Actinomycin D)',/Wilms/,/전사/],asparaginase:['Asparaginase',/백혈병/,/asparagine/],tamoxifen:['Tamoxifen',/유방암/,/경구/],fulvestrant:['Fulvestrant',/유방암/,/근육주사/],exemestane:['Exemestane',/폐경 후/,/비가역/],enzalutamide:['Enzalutamide',/전립선암/,/핵 이동/],abiraterone:['Abiraterone',/전립선암/,/prednisone/i],degarelix:['Degarelix',/전립선암/,/flare/],vincristine:['Vincristine',/손발저림/,/변비/],bleomycin:['Bleomycin',/폐섬유화/,/골수억제/]},
 SIGNAL_CLINICAL:{tretinoin:['Tretinoin (ATRA)',/전골수성백혈병/,/분화/],trastuzumab:['Trastuzumab (Herceptin)',/유방암/,/세포외/],enhertu:['Enhertu (trastuzumab deruxtecan)',/유방암/,/Topo I/],rituximab:['Rituximab',/림프종/,/방사성/],gemtuzumab:['Gemtuzumab ozogamicin',/골수성백혈병/,/CD33/],brentuximab:['Brentuximab vedotin',/호지킨림프종/,/CD30/],imatinib:['Imatinib (Gleevec)',/GIST/,/1세대/],sunitinib:['Sunitinib',/GIST/,/내성/],bevacizumab:['Bevacizumab (Avastin)',/대장직장암/,/리간드/],bortezomib:['Bortezomib',/골수종/,/proteasome/]}
};
const banks={IMM_CLINICAL:IMM_DRUGS,ANTI_CLINICAL:ANTI_DRUGS,SIGNAL_CLINICAL:SIGNAL_DRUGS};

test('each unit supplies ten source-backed clinical drug-selection cases',()=>{
 for(const [key,drugs] of Object.entries(banks)){
  assert.ok(Array.isArray(api[key]),`${key} clinical cases must exist`);
  assert.equal(api[key].length,10);
  for(const q of api[key]){
   const d=drugs.find(x=>x.id===q.subject),proof=expected[key][q.subject];
   assert.ok(d,`${q.id} uses a canonical subject`);assert.ok(proof,q.id);
   assert.equal(q.answer,proof[0]);assert.equal(q.answer,d.name);
   for(const re of proof.slice(1))assert.match(q.stem,re,`${q.id} retains the clinical discriminator`);
   assert.equal(q.source,d.source);assert.equal(q.weight,d.weight||1);
   assert.match(q.stem,/환자|소아/);assert.match(q.stem,/약물|제제/);
   assert.equal(q.format,'clinical');assert.equal(q.kind,'target');assert.equal(q.direction,'clinical');assert.equal(q.group,'clinical');assert.equal(q.exam,'강의 임상응용');assert.equal(q.core,true);
  }
 }
});

test('clinical cases have distinct IDs, five drug names and standalone feedback',()=>{
 const ids=new Set();
 for(const [key,drugs] of Object.entries(banks))for(const q of api[key]||[]){
  assert.match(q.id,/^clinical-/);assert.ok(!ids.has(q.id),q.id);ids.add(q.id);
  assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);
  assert.equal(q.options.filter(n=>n===q.answer).length,1);
  for(const name of q.options)assert.ok(drugs.some(d=>d.name===name),`${q.id}: drug option ${name}`);
  assert.equal(q.details.length,5);
  for(const name of q.options){const feedback=q.details.find(x=>x.startsWith(name+': '));assert.ok(feedback,`${q.id}: ${name}`);assert.ok(feedback.length>name.length+22);assert.doesNotMatch(feedback,/나머지|위와 같|다른 보기/);}
  assert.ok(q.note.length>25);
 }
 assert.equal(ids.size,30);
});

test('clinical cases normalize and preserve correct answers through study shuffling',()=>{
 assert.equal(Object.keys(banks).flatMap(key=>api[key]||[]).length,30);
 for(const key of Object.keys(banks))for(const q of api[key]||[]){
  const normalized=normalizeStudyQuestion(q);
  assert.equal(normalized.choices[normalized.answers[0]],expected[key][q.subject][0]);
  assert.deepEqual(normalized.details,q.details);
  const shuffled=shuffleStudyQuestion(normalized,()=>0.25);
  assert.equal(shuffled.choices[shuffled.answers[0]],q.answer);
  assert.equal(gradeStudyAnswer(shuffled,shuffled.answers),true);
  assert.equal(gradeStudyAnswer(shuffled,[(shuffled.answers[0]+1)%5]),false);
 }
});
