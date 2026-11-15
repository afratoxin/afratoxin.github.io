import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSE_GROUPS,groupForLecture} from './course-catalog.mjs';
import {LECTURES,DOCUMENTS,LECTURE_QUESTIONS,TABLE_QUESTIONS} from './study-bank.mjs';
import {RECALL_LECTURES,RECALL_SETS} from './recall-catalog.mjs';
import {startContinuousSession,resumeContinuousSession} from './continuous-queue.mjs';

const codes=['261109_06','261111_03','261113_03'];
test('CBL is a fourth course category with three individual supplied lectures',()=>{
 assert.equal(COURSE_GROUPS.cbl?.title,'CBL');
 assert.equal(Object.keys(COURSE_GROUPS).length,4);
 for(const code of codes){assert.equal(groupForLecture(code),'cbl');assert.equal(LECTURES[code]?.group,'cbl');assert.ok(DOCUMENTS[code]?.pages);}
});
test('each CBL has case questions and narrowly focused recall with valid physical page sources',()=>{
 for(const code of codes){
  const main=LECTURE_QUESTIONS.filter(q=>q.lecture===code),recall=TABLE_QUESTIONS.filter(q=>q.lecture===code);
  assert.ok(main.length>=8,code+' needs substantive case coverage');
  assert.ok(main.some(q=>q.kind==='case'),code+' needs clinical cases');
  assert.ok(main.some(q=>q.examRefs.length),code+' needs verified exam links');
  assert.ok(recall.length>=4,code+' needs focused recall');
  assert.ok(RECALL_LECTURES[code].sets.length>=2,code+' needs small topic sections');
  for(const q of [...main,...recall]){
   assert.equal(q.format,'mcq');assert.equal(new Set(q.choices).size,5,q.id);
   assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5,q.id);
   assert.equal(q.choiceNotes.length,5,q.id);assert.ok(q.explanation&&q.keyClue,q.id);
   assert.ok(q.sourceRefs.some(r=>r.doc===code),q.id+' must cite its CBL');
   for(const r of q.sourceRefs)for(const p of r.pages)assert.ok(Number.isInteger(p)&&p>=1&&p<=DOCUMENTS[r.doc].pages,q.id+' invalid source page');
  }
  const membership=RECALL_LECTURES[code].sets.flatMap(id=>RECALL_SETS[id].questionIds);
  assert.deepEqual([...membership].sort(),recall.map(q=>q.id).sort());
 }
});
test('CBL lecture queues retain the whole range and resume pending questions before wrong ones',()=>{
 const bank=LECTURE_QUESTIONS.filter(q=>q.lecture==='261109_06');assert.ok(bank.length>0);
 const progress={[bank[0].id]:{correct:true},[bank[1].id]:{correct:false}};
 const s=startContinuousSession(bank,{topic:'261109_06',count:10},progress,()=>0.5);
 assert.equal(s.scopeSize,bank.length);assert.equal(s.phase,'unanswered');
 assert.equal(s.items.length,bank.length-2);
 const restored=resumeContinuousSession(JSON.stringify(s),bank,progress,()=>0.5);
 assert.equal(restored.items.length,bank.length-2);
 assert.ok(restored.items.every(q=>q.id!==bank[0].id&&q.id!==bank[1].id));
});
