import test from 'node:test';
import assert from 'node:assert/strict';
import {createStudyStore,normalizeStudyQuestion} from './study-records.mjs';
import {registerLectureStudies} from './study-catalog.mjs';
const module=await import('./systems-data.mjs').catch(()=>({}));

test('three complete banks contain 40 sourced reasoning questions with one unambiguous answer each',()=>{
 assert.ok(module.SYSTEMS_BANKS,'the three requested banks must exist');
 assert.deepEqual(Object.keys(module.SYSTEMS_BANKS),['endocrine','renal','cardio']);
 const ids=new Set();
 for(const [scope,bank] of Object.entries(module.SYSTEMS_BANKS)){
  assert.equal(bank.length,40,scope);
  assert.ok(new Set(bank.map(q=>q.subject)).size>=20,scope);
  for(const polarity of ['correct','incorrect'])assert.equal(bank.filter(q=>q.polarity===polarity).length,14);
  for(const q of bank){
   assert.ok(!ids.has(q.id),q.id);ids.add(q.id);
   assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);
   assert.equal(q.options.filter(x=>x===q.answer).length,1);
   if(q.format==='judgment'){
    assert.equal(q.statements.filter(x=>x.valid).length,q.polarity==='correct'?1:4);
    assert.equal(q.statements.find(x=>x.text===q.answer).valid,q.polarity==='correct');
    assert.match(q.stem,q.polarity==='correct'?/옳은 것은\?$/u:/옳지 않은 것은\?$/u);
   }else{assert.equal(q.format,'cause');assert.ok(q.answerAliases.includes(q.answer));}
   assert.ok(q.context.length>12);assert.ok(q.note.length>25);assert.ok(q.source.includes('쪽'));
   assert.ok(q.exam.length>10,'state the past-exam relationship');
   for(const option of q.options)assert.equal(q.details.filter(x=>x.startsWith(option+':')).length,1);
   const normalized=normalizeStudyQuestion(q);assert.equal(normalized.choices[normalized.answers[0]],q.answer);
  }
 }
});

test('each new bank participates in shared progress and preserves an actual wrong question',()=>{
 assert.ok(module.SYSTEMS_BANKS);
 const s=createStudyStore({getItem(){},setItem(){}});registerLectureStudies(s);
 for(const [scope,bank]of Object.entries(module.SYSTEMS_BANKS)){
  const def=s.definitions.get(scope);assert.equal(def?.route,scope);assert.equal(def?.items.size,40);
  const q=bank[0],rendered={...q,choices:[...q.options].reverse(),answerIndex:4-q.options.indexOf(q.answer)};
  s.record(scope,rendered,false);const saved=s.wrong(scope)[0].question;
  assert.deepEqual(saved.choices,rendered.choices);assert.equal(saved.choices[saved.answers[0]],q.answer);
  assert.deepEqual(saved.details,q.details);assert.equal(s.counts(scope).total,40);assert.equal(s.counts(scope).wrong,1);
  s.record(scope,saved,true);assert.equal(s.counts(scope).wrong,0);assert.equal(s.counts(scope).solved,1);
 }
});

test('1000 draws cover every ID, rotate each format and avoid three recent cases',()=>{
 assert.equal(typeof module.pickSystemsQuestion,'function');
 let seed=71;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/2**32);
 for(const scope of ['endocrine','renal','cardio']){
  const state={draws:0,seen:{},recent:[],subjects:[],lastPolarity:null};let previous;
  for(let i=0;i<1000;i++){
   const q=module.pickSystemsQuestion(scope,state,'all',random);
   assert.ok(q);assert.ok(!state.subjects.includes(q.subject));if(q.format==='judgment'&&previous)assert.notEqual(q.polarity,previous.polarity);
   assert.equal(q.choices.length,5);assert.equal(q.choices[q.answerIndex].text,q.answer);
   state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,4);state.subjects=[q.subject,...state.subjects].slice(0,3);state.draws++;if(q.format==='judgment'){state.lastPolarity=q.polarity;previous=q;}
  }
  assert.equal(Object.keys(state.seen).length,40);for(const format of ['cause','judgment']){const counts=module.SYSTEMS_BANKS[scope].filter(q=>q.format===format).map(q=>state.seen[q.id]);assert.ok(Math.max(...counts)-Math.min(...counts)<=3);}
  assert.equal(module.pickSystemsQuestion(scope,state,'correct',random).polarity,'correct');
  assert.equal(module.pickSystemsQuestion(scope,state,'incorrect',random).polarity,'incorrect');
 }
});
