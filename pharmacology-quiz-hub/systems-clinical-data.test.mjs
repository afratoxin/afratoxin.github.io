import test from 'node:test';
import assert from 'node:assert/strict';
import {ADR12_CLINICAL,ADR13_CLINICAL,CYP_CLINICAL,TX_CLINICAL,ABX_CLINICAL} from './systems-clinical-data.mjs';
import {normalizeStudyQuestion,gradeStudyAnswer,shuffleStudyQuestion} from './study-records.mjs';
import {ABX_DRUGS} from './abx-data.mjs';
import {ADR12_MATCH} from './adr12.mjs';
import {ADR13_MATCH} from './adr13.mjs';
import {CYP_FACTS} from './cyp.mjs';
import {TRANSPORT_DRUGS} from './transport8.mjs';

// Independent answer key: a wrong or accidentally moved key must fail even if
// the row still contains five well-formed options.
const expected={
 'clinical-adr12-hypoperfusion':'Dobutamine','clinical-adr12-airway-short':'Albuterol',
 'clinical-adr12-copd-maintenance':'Salmeterol','clinical-adr12-urgency':'Mirabegron',
 'clinical-adr12-mydriasis':'Phenylephrine','clinical-adr12-central-output':'Clonidine',
 'clinical-adr12-low-resistance':'Midodrine','clinical-adr12-uterine-relaxation':'Ritodrine',
 'clinical-adr13-pheo-persistent':'Phenoxybenzamine','clinical-adr13-pheo-titration':'Phentolamine',
 'clinical-adr13-bph-subtype':'Tamsulosin','clinical-adr13-bph-vessels':'Prazosin',
 'clinical-adr13-glaucoma-production':'Timolol','clinical-adr13-asthma-bronchospasm':'Propranolol',
 'clinical-adr13-pheo-synthesis':'Metyrosine','clinical-adr13-mixed-antioxidant':'Carvedilol',
 'clinical-cyp-codeine-activation':'Codeine','clinical-cyp-clopidogrel-activation':'Clopidogrel',
 'clinical-cyp-warfarin-exposure':'S-warfarin','clinical-cyp-voriconazole-exposure':'Voriconazole',
 'clinical-tx-hdv-entry':'Bulevirtide','clinical-tx-anion-secretion':'Probenecid',
 'clinical-tx-metformin-mate':'Pyrimethamine',
 'clinical-abx-dna-radicals':'Metronidazole','clinical-abx-mrsa-beta-lactam':'Ceftaroline',
 'clinical-abx-cilastatin-partner':'Imipenem','clinical-abx-cf-inhalation':'Tobramycin',
 'clinical-abx-pseudomonas-gyrase':'Ciprofloxacin','clinical-abx-colitis-local':'Vancomycin',
 'clinical-abx-rickettsia':'Doxycycline','clinical-abx-candida-local':'Nystatin',
 'clinical-abx-influenza-inhaled':'Zanamivir','clinical-abx-b6-neuropathy':'Isoniazid'
};
const banks=[['adr12',ADR12_CLINICAL,8],['adr13',ADR13_CLINICAL,8],['cyp',CYP_CLINICAL,4],['tx',TX_CLINICAL,3],['abx',ABX_CLINICAL,10]];
const all=banks.flatMap(([,bank])=>bank);
const known={adr12:new Set(ADR12_MATCH.map(d=>d.drug)),adr13:new Set(ADR13_MATCH.map(d=>d.drug)),cyp:new Set(CYP_FACTS.map(d=>d.id)),tx:new Set(TRANSPORT_DRUGS.map(d=>d.drug)),abx:new Set(ABX_DRUGS.map(d=>d.id))};
const names={adr12:known.adr12,adr13:new Set([...known.adr13,...known.adr12]),cyp:new Set(CYP_FACTS.map(d=>d.drug.toLowerCase())),tx:known.tx,abx:new Set(ABX_DRUGS.map(d=>d.name.toLowerCase()))};

test('each system has the intended finite case set and independent answer key',()=>{
 assert.equal(new Set(all.map(q=>q.id)).size,33);
 assert.deepEqual(all.map(q=>q.id).sort(),Object.keys(expected).sort());
 for(const [scope,bank,count]of banks){
  assert.equal(bank.length,count,scope);
  for(const q of bank){
   assert.ok(q.id.startsWith(`clinical-${scope}-`));
   assert.equal(q.answer,expected[q.id],q.id);
   assert.ok(known[scope].has(q.subject),`${q.id}: existing subject`);
   assert.equal(q.format,'clinical');assert.equal(q.core,true);assert.equal(q.weight,1);
   assert.ok(scope==='tx'?['renal','hepatic'].includes(q.group):q.group==='clinical');
   assert.ok(q.stem.length>=35&&q.stem.length<=200,q.id);
   assert.match(q.source,/강.*\d+.*쪽/);assert.ok(q.note.length>30);
   assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);
   assert.equal(q.options.filter(x=>x===q.answer).length,1);
   assert.ok(q.options.every(x=>names[scope].has(x.toLowerCase())),`${q.id}: drug names only`);
   assert.equal(q.details.length,5);assert.ok(q.details.every(d=>!d.includes('undefined')));
   for(const option of q.options){const row=q.details.find(d=>d.startsWith(option+': '));assert.ok(row&&row.length>option.length+14,`${q.id}: independent explanation for ${option}`);}
  }
 }
});

test('new cases keep the exact single answer through normalization and reshuffling',()=>{
 for(const raw of all){
  for(const random of [()=>0,()=>0.37,()=>0.99]){
   const q=shuffleStudyQuestion(normalizeStudyQuestion(raw),random);
   assert.equal(q.answers.length,1);
   assert.equal(q.choices[q.answers[0]],expected[raw.id]);
   for(let i=0;i<5;i++)assert.equal(gradeStudyAnswer(q,[i]),q.choices[i]===expected[raw.id]);
   assert.equal(gradeStudyAnswer(q,[q.answers[0],(q.answers[0]+1)%5]),false);
   assert.equal(gradeStudyAnswer(q,[]),false);
   assert.equal(q.details.length,5);assert.equal(q.source,raw.source);
  }
 }
});

test('CYP cases distinguish activation from loss of clearance with maker metadata',()=>{
 const byId=Object.fromEntries(CYP_CLINICAL.map(q=>[q.subject,q]));
 assert.equal(byId.codeine.enzyme,'CYP2D6');assert.match(byId.codeine.stem,/morphine|모르핀/);
 assert.equal(byId.clopidogrel.enzyme,'CYP2C19');assert.match(byId.clopidogrel.stem,/활성/);
 assert.equal(byId['s-warfarin'].enzyme,'CYP2C9');assert.match(byId['s-warfarin'].stem,/노출|농도/);
 assert.equal(byId.voriconazole.enzyme,'CYP2C19');
 for(const q of CYP_CLINICAL){assert.equal(q.drug.toLowerCase(),q.answer.toLowerCase());assert.ok(Number.isInteger(q.page));}
});

test('transporter cases name a precise route and avoid assuming more exposure means more effect',()=>{
 const rows=Object.fromEntries(TX_CLINICAL.map(q=>[q.subject,q]));
 assert.match(rows.bulevirtide.stem,/HDV/);assert.match(rows.bulevirtide.stem,/NTCP/);
 assert.match(rows.probenecid.stem,/OAT1.*OAT3/);
 assert.match(rows.pyrimethamine.stem,/MATE1.*MATE2-K/);
 assert.doesNotMatch(rows.pyrimethamine.note,/혈당.*효과.*증가한다/);
 for(const q of TX_CLINICAL)assert.ok(Number.isInteger(q.page));
});

test('antimicrobial coverage preserves source lecture, family and unambiguous route/target clues',()=>{
 assert.deepEqual([...new Set(ABX_CLINICAL.map(q=>q.lecture))].sort(),[23,24,25,26,27]);
 for(const q of ABX_CLINICAL){const drug=ABX_DRUGS.find(d=>d.id===q.subject);assert.equal(q.lecture,drug.lecture);assert.equal(q.family,drug.family);assert.equal(q.source,drug.source);}
 const rows=Object.fromEntries(ABX_CLINICAL.map(q=>[q.subject,q]));
 assert.match(rows.ceftaroline.stem,/MRSA/);assert.match(rows.ceftaroline.stem,/β-lactam/);
 assert.match(rows.vancomycin.stem,/경구/);assert.match(rows.vancomycin.stem,/D-Ala-D-Ala/);
 assert.match(rows.tobramycin.stem,/흡입/);assert.match(rows.zanamivir.stem,/흡입/);
 assert.match(rows.doxycycline.stem,/30S/);assert.doesNotMatch(rows.doxycycline.note,/50S/);
});
