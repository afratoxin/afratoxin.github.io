import test from 'node:test';
import assert from 'node:assert/strict';
import {grade,buildSession,restoreSession} from './logic.mjs';
const api=await import('./continuous-queue.mjs').catch(()=>({}));
const bank=Array.from({length:37},(_,i)=>({id:'q'+i,topic:i<30?'a':'b',format:i===36?'ox':'mcq',choices:i===36?['O','X']:['A','B','C','D','E'],answer:i===36?1:i%5,sourceScope:i<20?'lecture':'library'}));
const rng=()=>0.37;

test('integrated practice shuffles the whole range once and keeps its remaining order on return',()=>{
 const s=api.startContinuousSession(bank,{topic:'all',count:20},{},rng);
 assert.equal(s.items.length,37);assert.notDeepEqual(s.items.map(q=>q.id),bank.map(q=>q.id));
 const p=grade(s,{},0,s.items[0].answer,bank).progress;
 const restored=api.resumeContinuousSession(JSON.stringify(s),bank,p,rng);
 assert.deepEqual(restored.items.map(q=>q.id),s.items.slice(1).map(q=>q.id));
});
function start(...args){assert.equal(typeof api.startContinuousSession,'function','continuous queue core is missing');return api.startContinuousSession(...args);}
function advance(...args){assert.equal(typeof api.advanceContinuousSession,'function');return api.advanceContinuousSession(...args);}
function resume(...args){assert.equal(typeof api.resumeContinuousSession,'function');return api.resumeContinuousSession(...args);}
function answer(session,progress,correct=true){const item=session.items[session.position];return grade(session,progress,session.position,correct?item.answer:(item.answer+1)%item.choices.length,bank).progress;}

test('a selected range includes every pending item instead of a ten- or twenty-item quota',()=>{
 const s=start(bank,{topic:'a',count:10,mode:'all'},{},rng);
 assert.equal(s.version,1);assert.equal(s.queueVersion,1);assert.equal(s.phase,'unanswered');assert.equal(s.filters.count,0);
 assert.equal(s.items.length,30);assert.equal(s.position,0);assert.deepEqual(s.items.map(q=>q.id),bank.slice(0,30).map(q=>q.id));
 assert.equal(restoreSession(JSON.stringify(s),bank).items.length,30);
});
test('returning resumes all unanswered questions before existing and newly created wrong answers',()=>{
 let progress={q30:{correct:false}},s=start(bank,{count:20},progress,rng);
 for(let i=0;i<18;i++){progress=answer(s,progress,i!==2);s=advance(s,progress,bank,rng);}
 const pending=s.items.slice(s.position).map(q=>q.id);s=resume(JSON.stringify(s),bank,progress,rng);
 assert.equal(s.phase,'unanswered');assert.equal(s.items.length,18);assert.deepEqual(s.items.map(q=>q.id),pending);
 assert.ok(!s.items.some(q=>['q2','q30'].includes(q.id)));
 while(s.phase==='unanswered'){progress=answer(s,progress);s=advance(s,progress,bank,rng);}
 assert.equal(s.phase,'wrong');assert.deepEqual(new Set(s.items.map(q=>q.id)),new Set(['q2','q30']));
});
test('corrected questions leave later wrong passes and completion requires no remaining work',()=>{
 let progress={q0:{correct:false},q1:{correct:false},q2:{correct:true}},s=start(bank,{questionIds:['q0','q1','q2']},progress,rng);
 assert.equal(s.phase,'wrong');assert.equal(s.items.length,2);
 progress=answer(s,progress,true);s=advance(s,progress,bank,rng);progress=answer(s,progress,false);s=advance(s,progress,bank,rng);
 assert.equal(s.phase,'wrong');assert.deepEqual(s.items.map(q=>q.id),['q1']);
 progress=answer(s,progress,true);s=advance(s,progress,bank,rng);
 assert.equal(s.phase,'complete');assert.equal(s.queueCounts.correct,3);assert.equal(s.queueCounts.unanswered,0);assert.equal(s.queueCounts.wrong,0);
});
test('skipping does not lose unanswered questions or prematurely enter wrong review',()=>{
 let progress={q2:{correct:false}},s=start(bank,{questionIds:['q0','q1','q2']},progress,rng);
 s=advance(s,progress,bank,rng);assert.equal(s.items[s.position].id,'q1');progress=answer(s,progress,true);s=advance(s,progress,bank,rng);
 assert.equal(s.phase,'unanswered');assert.deepEqual(s.items.map(q=>q.id),['q0']);progress=answer(s,progress,true);s=advance(s,progress,bank,rng);
 assert.equal(s.phase,'wrong');assert.deepEqual(s.items.map(q=>q.id),['q2']);
});
test('scope, format, source group and bookmarks remain isolated across phases',()=>{
 const progress={q20:{correct:false},q21:{correct:true},q22:{correct:false}};
 const s=start(bank,{topic:'a',sourceScope:'library',questionIds:['q20','q21','q22','q23'],mode:'bookmarks',count:1},progress,rng,['q20','q21','q23']);
 assert.deepEqual(s.items.map(q=>q.id),['q23']);let p=answer(s,progress,true),next=advance(s,p,bank,rng,['q20','q21','q23']);assert.deepEqual(next.items.map(q=>q.id),['q20']);assert.equal(next.phase,'wrong');
 const ox=start(bank,{format:'ox'},{},rng);assert.equal(ox.items.length,1);assert.equal(ox.items[0].id,'q36');assert.deepEqual(ox.items[0].choices,['O','X']);assert.equal(ox.items[0].answer,1);
});
test('legacy small sessions expand to the entire saved range and preserve pending order and choices',()=>{
 const legacy=buildSession(bank,{topic:'a',count:10},{},rng);legacy.position=3;const progress=Object.fromEntries(legacy.items.slice(0,3).map(item=>[item.id,{correct:true}]));
 const s=resume(JSON.stringify(legacy),bank,progress,rng);assert.equal(s.items.length,27);assert.equal(s.phase,'unanswered');assert.equal(s.filters.count,0);
 assert.deepEqual(s.items.slice(0,7).map(q=>q.id),legacy.items.slice(3).map(q=>q.id));assert.deepEqual(s.items[0].choices,legacy.items[3].choices);assert.equal(s.items[0].selected,null);
});
test('saved wrong phases return to new unanswered work first and explicit wrong mode stays wrong-only',()=>{
 const scope={questionIds:['q0','q1','q2']};let progress={q0:{correct:true},q1:{correct:true},q2:{correct:false}};const s=start(bank,scope,progress,rng);assert.equal(s.phase,'wrong');
 delete progress.q1;const returned=resume(JSON.stringify(s),bank,progress,rng);assert.equal(returned.phase,'unanswered');assert.deepEqual(returned.items.map(q=>q.id),['q1']);
 const wrong=start(bank,{...scope,mode:'wrong'},progress,rng);assert.equal(wrong.phase,'wrong');assert.deepEqual(wrong.items.map(q=>q.id),['q2']);
});
test('answer mapping and immutable advance stay compatible with the existing grader',()=>{
 let s=start(bank,{}, {},rng);const originalPosition=s.position;for(const item of s.items){const q=bank.find(q=>q.id===item.id);assert.equal(item.choices[item.answer],q.choices[q.answer]);}
 const p=answer(s,{},true),next=advance(s,p,bank,rng);assert.equal(s.position,originalPosition);assert.equal(next.position,originalPosition+1);assert.ok(restoreSession(JSON.stringify(next),bank));
});
test('complete, empty and corrupt saved sessions behave deterministically without clearing progress',()=>{
 const progress=Object.fromEntries(bank.map(q=>[q.id,{correct:true}]));const snapshot=JSON.stringify(progress),complete=start(bank,{count:10},progress,rng);assert.equal(complete.phase,'complete');assert.equal(complete.items.length,0);
 assert.equal(resume(JSON.stringify(complete),bank,progress,rng).phase,'complete');for(const raw of [null,'','{bad','{}','[]',JSON.stringify({version:1,items:[],position:-1,filters:{}})])assert.equal(resume(raw,bank,progress,rng),null);
 assert.equal(start([],{}, {},rng).phase,'complete');assert.equal(JSON.stringify(progress),snapshot);
});
test('explicit review can show a correct starred item once without widening its range',()=>{
 let progress={q3:{correct:true}},s=start(bank,{mode:'review',questionIds:['q3'],count:1},progress,rng);assert.equal(s.phase,'review');assert.deepEqual(s.items.map(q=>q.id),['q3']);
 progress=answer(s,progress,true);s=advance(s,progress,bank,rng);assert.equal(s.phase,'complete');assert.equal(s.scopeSize,1);
});
test('a fresh explicit review can repeat intentionally while resuming its completed pass stays complete',()=>{
 let progress={q3:{correct:true}},s=start(bank,{mode:'review',questionIds:['q3']},progress,rng);
 progress=answer(s,progress,true);s=advance(s,progress,bank,rng);
 assert.equal(resume(JSON.stringify(s),bank,progress,rng).phase,'complete');
 assert.equal(start(bank,s.filters,progress,rng,[],s).phase,'review');
 assert.equal(advance(s,progress,bank,rng).phase,'complete');
});
test('malformed saved items are rejected instead of throwing while rebuilding the queue',()=>{
 for(const items of [[null],[{}],[{id:'q0'}],[{id:'q0',choices:['A'],answer:0,selected:3}]]){
  assert.equal(resume(JSON.stringify({version:1,position:0,filters:{},items}),bank,{},rng),null);
 }
});
test('continuous progress uses the same complete scope and bookmark constraints as the queue',()=>{
 assert.equal(typeof api.continuousProgress,'function');
 const progress={q20:{correct:false},q21:{correct:true},q22:{correct:false},q23:{correct:'invalid'}};
 const filters={topic:'a',sourceScope:'library',questionIds:['q19','q20','q21','q22','q23','q31'],mode:'bookmarks',count:1};
 assert.deepEqual(api.continuousProgress(bank,filters,progress,['q19','q20','q21','q23','q31']),{total:3,correct:1,unanswered:1,wrong:1});
 assert.deepEqual(api.continuousProgress(bank,{format:'ox'},progress),{total:1,correct:0,unanswered:1,wrong:0});
});
