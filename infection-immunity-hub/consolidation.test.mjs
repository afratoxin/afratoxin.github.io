import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {tabFromHash} from './logic.mjs';
import {QUESTIONS} from './bank.mjs';
import {PATH_QUESTIONS} from './pathology-bank.mjs';
import {CBL_PAST_QUESTIONS} from './cbl-past-bank.mjs';
import {LECTURE_QUESTIONS as BEFORE,TABLE_QUESTIONS as LEGACY} from './study-bank.mjs';
import {LECTURE_QUESTIONS,PROMOTED_QUESTIONS,LECTURES} from './quiz-bank.mjs';
import {RECALL_CONSOLIDATION as PLAN} from './recall-consolidation.mjs';
import {migrateRecallRecords,createRecallStorage,RECALL_MIGRATION_KEY} from './recall-migration.mjs';
import {startContinuousSession,resumeContinuousSession,advanceContinuousSession} from './continuous-queue.mjs';
import {grade} from './logic.mjs';
import {sourcePages} from './practice-layout.mjs';

test('retired table-quiz links lead to regular lecture practice',()=>{
 assert.equal(tabFromHash('#drill'),'lectures');
 assert.equal(tabFromHash('#mainContent'),null);
});

test('the hub, bookmarks and wrong-answer UI have no separate recall quiz',()=>{
 const read=name=>fs.readFileSync(new URL(name,import.meta.url),'utf8');
 const html=read('index.html'),app=read('app.mjs'),stars=read('bookmark-ui.mjs');
 assert.ok(!/id="(?:homeDrillStart|homeDrillMixed|drillResumeButton|drillRetryAll|panel-drill)"/.test(html));
 assert.ok(!/createRecallUI|drillUI/.test(app));
 assert.ok(!/TABLE_TOPICS|TABLE_QUESTIONS/.test(app));
 assert.match(app,/migrateRecallRecords\(recallStorage\.read,recallStorage\.write\)/);
 assert.doesNotMatch(stars,/강의별·표 암기/);
 assert.match(html,/항생제 정리표/,'reference tables remain available');
});

test('every historical recall item is reviewed and only nineteen unique items join active lectures',()=>{
 const active=[...QUESTIONS,...PATH_QUESTIONS,...LECTURE_QUESTIONS,...CBL_PAST_QUESTIONS],ids=new Set(active.map(q=>q.id));
 assert.equal(LEGACY.length,540);assert.equal(Object.keys(PLAN).length,540);assert.equal(active.length,1461);
 assert.equal(ids.size,active.length);assert.equal(PROMOTED_QUESTIONS.length,19);
 assert.equal(Object.values(PLAN).filter(p=>p.action==='duplicate').length,521);
 for(const q of BEFORE)assert.deepEqual(LECTURE_QUESTIONS.find(x=>x.id===q.id),q,'existing regular item changed: '+q.id);
 for(const q of LEGACY){
  const p=PLAN[q.id];assert.ok(p.reason&&ids.has(p.destination),q.id);
  assert.equal(ids.has(q.id),p.action==='move',q.id);
  if(p.action==='move'){
   const moved=PROMOTED_QUESTIONS.find(x=>x.id===q.id);assert.equal(moved.topic,p.lecture);assert.ok(LECTURES[moved.topic]);
   assert.deepEqual(moved.choices,q.choices);assert.equal(moved.answer,q.answer);assert.deepEqual(moved.sourceRefs,q.sourceRefs);
   assert.equal(moved.choiceNotes.length,5);assert.ok(moved.choiceNotes.every(Boolean));assert.ok(moved.keyClue&&sourcePages(moved).length);
  }
 }
});

test('promoted questions share the whole lecture queue, preserve saved choice order and reach wrong review',()=>{
 const q=PROMOTED_QUESTIONS.find(q=>q.id==='table-261118_02-nov18-cd4-50');
 const f={topic:q.topic,mode:'all',count:0,questionIds:[q.id]};
 let session=startContinuousSession(LECTURE_QUESTIONS,f,{},()=>.2),progress={};
 assert.equal(session.items.length,1);const choices=session.items[0].choices;
 session=resumeContinuousSession(JSON.stringify(session),LECTURE_QUESTIONS,progress,()=>.8);assert.deepEqual(session.items[0].choices,choices);
 progress=grade(session,progress,0,(session.items[0].answer+1)%5,LECTURE_QUESTIONS).progress;
 session=advanceContinuousSession(session,progress,LECTURE_QUESTIONS,()=>.2);assert.equal(session.phase,'wrong');assert.equal(session.items[0].id,q.id);
 progress=grade(session,progress,0,session.items[0].answer,LECTURE_QUESTIONS).progress;
 assert.equal(advanceContinuousSession(session,progress,LECTURE_QUESTIONS).phase,'complete');
});

const P='infection-immunity.drill.progress.v1',B='infection-immunity.drill.bookmarks.v1',LP='infection-immunity.lectures.progress.v1',LB='infection-immunity.lectures.bookmarks.v1';
const samplePlan={copy:{action:'duplicate',destination:'regular',store:'lectures',choiceCount:5,copyProgress:true},unique:{action:'move',destination:'unique',store:'lectures',choiceCount:5,copyProgress:true},related:{action:'duplicate',destination:'broader',store:'lectures',choiceCount:5,copyProgress:false}};
function memory(initial={}){
 const data=new Map(Object.entries(initial).map(([k,v])=>[k,typeof v==='string'?v:JSON.stringify(v)]));
 return {data,read:key=>data.get(key)??null,write(key,value){data.set(key,JSON.stringify(value));return true;},get(key){return JSON.parse(data.get(key)||'null');}};
}
test('migration preserves latest real answers and source data, without claiming paraphrased questions were solved',()=>{
 const s=memory({[P]:{copy:{correct:true,selected:2,updated:20},unique:{correct:false,selected:1,updated:30},related:{correct:true,selected:0,updated:100},retired:{correct:true}},[B]:['copy','unique','related','unknown'],[LP]:{regular:{correct:false,selected:1,updated:25},retiredDestination:{correct:true,updated:8}},[LB]:['existing','retiredStar']});
 const sourceP=s.read(P),sourceB=s.read(B);migrateRecallRecords(s.read,s.write,samplePlan);
 assert.equal(s.get(LP).regular.correct,false,'newer regular answer wins');assert.equal(s.get(LP).unique.correct,false);assert.equal(s.get(LP).unique.selected,1);
 assert.ok(!Object.hasOwn(s.get(LP),'broader'));assert.ok(s.get(LP).retiredDestination);
 assert.deepEqual(s.get(LB),['existing','retiredStar','regular','unique','broader']);
 assert.equal(s.read(P),sourceP);assert.equal(s.read(B),sourceB);
});
test('migration is repeatable, honors a later unstar and accepts newer updates from an old open page',()=>{
 const s=memory({[P]:{unique:{correct:false,selected:1,updated:30}},[B]:['unique']});
 migrateRecallRecords(s.read,s.write,samplePlan);s.write(LB,[]);
 assert.deepEqual(migrateRecallRecords(s.read,s.write,samplePlan).changedKeys,[]);assert.deepEqual(s.get(LB),[]);
 s.write(P,{unique:{correct:true,selected:3,updated:40}});migrateRecallRecords(s.read,s.write,samplePlan);
 assert.equal(s.get(LP).unique.correct,true);assert.equal(s.get(LP).unique.updated,40);assert.deepEqual(s.get(LB),[]);
});
test('failed writes remain retryable and malformed/retired legacy records are ignored',()=>{
 const s=memory({[P]:{unique:{correct:true,selected:99,updated:20},copy:{correct:'yes'},retired:{correct:true}},[B]:['unknown']});
 const failed=migrateRecallRecords(s.read,()=>false,samplePlan);assert.equal(failed.complete,false);assert.equal(s.read(RECALL_MIGRATION_KEY),null);
 migrateRecallRecords(s.read,s.write,samplePlan);assert.equal(s.get(LP).unique.correct,true);assert.ok(!Object.hasOwn(s.get(LP).unique,'selected'));assert.ok(!s.get(LP).copy);
 const corrupt=memory({[P]:'not json',[B]:{bad:true}});assert.deepEqual(migrateRecallRecords(corrupt.read,corrupt.write,samplePlan).changedKeys,[]);
});

test('a successful bookmark transfer stays checkpointed when a progress write fails',()=>{
 const id='table-261118_02-nov18-cd4-50';
 const s=memory({[P]:{[id]:{correct:false,selected:1,updated:30}},[B]:[id]});
 const failed=migrateRecallRecords(s.read,(key,value)=>key===LP?false:s.write(key,value));
 assert.equal(failed.complete,false);assert.deepEqual(s.get(LB),[id]);
 assert.ok(s.get(RECALL_MIGRATION_KEY).stars.includes(id));
 assert.ok(!s.get(RECALL_MIGRATION_KEY).progress[id]);
 s.write(LB,[]);
 const retried=migrateRecallRecords(s.read,s.write);
 assert.equal(retried.complete,true);assert.equal(s.get(LP)[id].correct,false);
 assert.deepEqual(s.get(LB),[],'a later unstar must survive retrying the failed progress write');
});

test('a failed write cached by the ordinary app cannot be checkpointed before durable persistence',()=>{
 const id='table-261118_02-nov18-cd4-50';
 const s=memory({[P]:{[id]:{correct:false,selected:1,updated:30}},[B]:[id]});
 const fallback=new Map();let blocked=true;
 const durable=createRecallStorage(s.read,(key,raw)=>{
  fallback.set(key,raw);
  if(key===LP&&blocked)throw new Error('quota exceeded');
  s.data.set(key,raw);
 });
 migrateRecallRecords(durable.read,durable.write);assert.ok(fallback.has(LP));assert.equal(s.get(LP),null);
 const repeat=migrateRecallRecords(durable.read,durable.write);
 assert.equal(repeat.complete,false);assert.ok(!s.get(RECALL_MIGRATION_KEY).progress[id]);
 s.write(LB,[]);blocked=false;
 migrateRecallRecords(durable.read,durable.write);assert.equal(s.get(LP)[id].correct,false);assert.deepEqual(s.get(LB),[]);
 const afterReload=createRecallStorage(s.read,(key,raw)=>s.data.set(key,raw));
 assert.deepEqual(migrateRecallRecords(afterReload.read,afterReload.write).changedKeys,[]);
 assert.equal(s.get(LP)[id].correct,false);assert.deepEqual(s.get(LB),[]);
});
