import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSession,grade,restoreSession,readProgress} from './logic.mjs';
import {nextRound} from './study-core.mjs';
import {RECALL_SETS,RECALL_LECTURES,recallProgress} from './recall-catalog.mjs';
import {QUESTIONS as ANTIBIOTIC_QUESTIONS} from './bank.mjs';
import {COURSE_GROUPS} from './course-catalog.mjs';
import {TABLE_QUESTIONS,LECTURES} from './study-bank.mjs';

test('a small recall set cannot leak questions from other lectures or topics',()=>{
 const bank=['a','b','c','d'].map(id=>({id,topic:'same',format:'mcq',choices:['1','2','3','4','5'],answer:0}));
 const filters={topic:'all',questionIds:['a','c'],scope:'small',count:0};
 const s=nextRound(bank,filters,{},()=>0.5);
 assert.deepEqual(s.items.map(q=>q.id).sort(),['a','c']);
 assert.deepEqual(nextRound(bank,{...filters,mode:'wrong'},{b:{correct:false},c:{correct:false}}).items.map(q=>q.id),['c']);
 assert.equal(buildSession(bank,{questionIds:[]}).items.length,0);
 assert.equal(buildSession(bank,{questionIds:['missing']}).items.length,0);
 grade(s,{},0,s.items[0].answer,bank);
 const restored=restoreSession(JSON.stringify(s),bank);
 assert.equal(restored.filters.scope,'small');assert.deepEqual(restored.filters.questionIds,['a','c']);
});
test('all recall questions belong to a lecture and a focused, explained small set',()=>{
 assert.deepEqual(Object.keys(COURSE_GROUPS),['general','bacteria','virus','cbl']);
 assert.equal(Object.keys(LECTURES).length,37);
 const membership=[];
 for(const [id,set] of Object.entries(RECALL_SETS)){
  assert.equal(set.id,id);assert.ok(RECALL_LECTURES[set.lecture],id);assert.ok(set.questionIds.length>0&&set.questionIds.length<=16,id);
  for(const key of ['what','how','why'])assert.ok(set[key].length>=15,`${id}: ${key}`);
  assert.ok(set.sourceRefs.length,id);membership.push(...set.questionIds);
 }
 assert.equal(new Set(membership).size,membership.length,'each item should have one primary study set');
 assert.deepEqual(membership.sort(),TABLE_QUESTIONS.map(q=>q.id).sort());
 assert.ok(Object.keys(RECALL_SETS).length>=50);
 for(const code of Object.keys(LECTURES))assert.ok(Object.values(RECALL_SETS).some(s=>s.lecture===code),code);
});
test('set and lecture progress reuse the same saved unique question results',()=>{
 const set=Object.values(RECALL_SETS).find(s=>s.questionIds.length>=2),[a,b]=set.questionIds;
 const progress=readProgress(JSON.stringify({[a]:{correct:true},[b]:{correct:false},retired:{correct:true}}),TABLE_QUESTIONS);
 const s=recallProgress(TABLE_QUESTIONS,progress,set.questionIds);
 assert.equal(s.attempted,2);assert.equal(s.correct,1);assert.equal(s.wrong,1);
 assert.equal(s.unanswered,set.questionIds.length-2);
 const lecture=RECALL_LECTURES[set.lecture];
 assert.ok(lecture.questionIds.includes(a));assert.equal(recallProgress(TABLE_QUESTIONS,progress,lecture.questionIds).attempted,2);
});


test('all main-hub antibiotics appear once in recall with stable IDs and original OX format',()=>{
 const copies=TABLE_QUESTIONS.filter(q=>q.id.startsWith('table-abx-'));
 assert.equal(copies.length,ANTIBIOTIC_QUESTIONS.length);
 for(const original of ANTIBIOTIC_QUESTIONS){
  const copy=copies.find(q=>q.id==='table-abx-'+original.id);
  assert.ok(copy,original.id);assert.equal(copy.sourceQuestionId,original.id);
  for(const key of ['stem','format','answer','explanation','note'])assert.equal(copy[key],original[key],original.id+' '+key);
  assert.deepEqual(copy.choices,original.choices);
  assert.deepEqual(copy.sourceRefs,[{doc:'antibiotics',pages:original.pages}]);
  assert.ok(RECALL_SETS[copy.recallSection].questionIds.includes(copy.id));
 }
 for(const section of ['oral','bbb','pregnancy'])assert.equal(RECALL_SETS['261102_05:'+section].questionIds.length,ANTIBIOTIC_QUESTIONS.filter(q=>q.topic===section).length);
 const caseSets=['cases-cns','cases-typhi','cases-pyelonephritis','cases-management'].map(key=>RECALL_SETS['261102_05:'+key]);
 assert.equal(caseSets.flatMap(s=>s.questionIds).length,ANTIBIOTIC_QUESTIONS.filter(q=>q.topic==='cases').length);
 assert.ok(caseSets.every(s=>s.questionIds.length<=10));
});

test('antibiotic recall rounds include OX and preserve two-choice grading after reload',()=>{
 const active=Object.values(RECALL_SETS).find(s=>s.lecture==='261102_05'&&s.questionIds.some(id=>TABLE_QUESTIONS.find(q=>q.id===id)?.format==='ox'));
 const fixture={id:'ox-regression-fixture',topic:'ox-test',format:'ox',choices:['O · 그렇다','X · 아니다'],answer:1};
 const bank=active?TABLE_QUESTIONS:[fixture],scope=active||{questionIds:[fixture.id]};
 const session=nextRound(bank,{topic:'all',format:'all',questionIds:scope.questionIds,count:0},{},()=>0.4);
 assert.equal(session.items.length,scope.questionIds.length);
 const index=session.items.findIndex(i=>i.choices.length===2);assert.ok(index>=0);
 assert.deepEqual(session.items[index].choices,['O · 그렇다','X · 아니다']);
 const result=grade(session,{},index,session.items[index].answer,bank);
 assert.equal(result.correct,true);assert.ok(restoreSession(JSON.stringify(session),bank));
 assert.deepEqual(nextRound(bank,session.filters,{},()=>0.2).items.map(q=>q.id).sort(),scope.questionIds.toSorted());
});
