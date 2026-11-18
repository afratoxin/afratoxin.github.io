import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {QUESTIONS} from './bank.mjs';
import {PATH_QUESTIONS} from './pathology-bank.mjs';
import {CBL_PAST_QUESTIONS} from './cbl-past-bank.mjs';
import {LECTURES,DOCUMENTS,LECTURE_QUESTIONS,TABLE_QUESTIONS} from './study-bank.mjs';
import {RECALL_SETS} from './recall-catalog.mjs';
import {SOURCE_PAGES} from './source-pages.mjs';
import {startContinuousSession,resumeContinuousSession,advanceContinuousSession} from './continuous-queue.mjs';
import {grade} from './logic.mjs';

const codes=['261118_01','261118_02','261118_05'];
test('all three November18 lectures have comparison, negative and focused recall questions with physical evidence',()=>{
 assert.equal(Object.keys(LECTURES).length,40);
 for(const code of codes){
  assert.equal(LECTURES[code].group,code==='261118_05'?'virus':'general');
  const main=LECTURE_QUESTIONS.filter(q=>q.lecture===code),negative=main.filter(q=>q.questionType==='incorrect'),recall=TABLE_QUESTIONS.filter(q=>q.lecture===code);
  assert.ok(main.length>=24,code);assert.ok(negative.length>=10,code);assert.ok(main.length-negative.length>=10,code);assert.ok(recall.length>=10,code);
  assert.ok(Object.values(RECALL_SETS).filter(s=>s.lecture===code).length>=3,code);
  for(const q of [...main,...recall]){
   assert.equal(q.choices.length,5);assert.equal(q.choiceNotes.length,5);assert.equal(new Set(q.choices).size,5);
   assert.ok(q.keyClue&&q.explanation&&q.sourceRefs.length);
   for(const r of q.sourceRefs)for(const page of r.pages){assert.ok(page<=DOCUMENTS[r.doc].pages);assert.ok(SOURCE_PAGES[`${r.doc}:${page}`],q.id);}
   if(q.questionType==='incorrect'){assert.equal(q.statementEvidence.filter(e=>e.isTrue).length,4);assert.equal(q.statementEvidence[q.answer].isTrue,false);}
  }
 }
});

test('the existing 1830 published questions keep their IDs, choices, keys, explanations and sources',()=>{
 const old=[...QUESTIONS,...PATH_QUESTIONS,...LECTURE_QUESTIONS,...TABLE_QUESTIONS,...CBL_PAST_QUESTIONS].filter(q=>!codes.includes(q.lecture)).sort((a,b)=>a.id.localeCompare(b.id));
 assert.equal(old.length,1830);
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(old)).digest('hex'),'181a9b66ac8116509920dc495a997e49c278c3b8efc959d90898ed2be60e840b');
});

test('new lecture negative queues resume pending items and retain wrong answers in their own scope',()=>{
 const f={topic:'261118_02',questionType:'incorrect',mode:'all',count:0};
 let session=startContinuousSession(LECTURE_QUESTIONS,f,{},()=>.3),progress={};
 assert.ok(session.items.length>=10);
 const wrong=session.items[0].id;
 progress=grade(session,progress,0,(session.items[0].answer+1)%5,LECTURE_QUESTIONS).progress;
 session=advanceContinuousSession(session,progress,LECTURE_QUESTIONS,()=>.3);
 session=resumeContinuousSession(JSON.stringify(session),LECTURE_QUESTIONS,progress,()=>.3);
 assert.ok(!session.items.some(i=>i.id===wrong));
 assert.ok(session.items.every(i=>LECTURE_QUESTIONS.find(q=>q.id===i.id)?.lecture===f.topic));
 while(session.phase==='unanswered'){progress=grade(session,progress,session.position,session.items[session.position].answer,LECTURE_QUESTIONS).progress;session=advanceContinuousSession(session,progress,LECTURE_QUESTIONS,()=>.3);}
 assert.equal(session.phase,'wrong');assert.deepEqual(session.items.map(i=>i.id),[wrong]);
});

test('new negative choices avoid a longest-answer cue and true-option notes use neutral comparisons',()=>{
 const negative=LECTURE_QUESTIONS.filter(q=>codes.includes(q.lecture)&&q.questionType==='incorrect');
 let longest=0;
 for(const q of negative){
  const lengths=q.choices.map(c=>c.length);if(lengths[q.answer]===Math.max(...lengths))longest++;
  for(let i=0;i<5;i++){
   if(q.statementEvidence[i].isTrue)assert.doesNotMatch(q.choiceNotes[i],/(?:바꾼|교환한) 설명이다/);
   for(const r of q.statementEvidence[i].sourceRefs)for(const page of r.pages)assert.ok(SOURCE_PAGES[`${r.doc}:${page}`]);
  }
 }
 assert.ok(longest/negative.length<.4,'key is conspicuously the longest too often');
});
