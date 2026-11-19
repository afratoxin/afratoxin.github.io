import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {QUESTIONS} from './bank.mjs';
import {PATH_QUESTIONS} from './pathology-bank.mjs';
import {CBL_PAST_QUESTIONS} from './cbl-past-bank.mjs';
import {LECTURES,DOCUMENTS,LECTURE_QUESTIONS,TABLE_QUESTIONS} from './quiz-bank.mjs';
import {SOURCE_PAGES} from './source-pages.mjs';
import {sourcePages} from './practice-layout.mjs';
import {startContinuousSession,resumeContinuousSession,advanceContinuousSession} from './continuous-queue.mjs';
import {grade,readBookmarks} from './logic.mjs';
import {studyFeedback} from './study-ui.mjs';

const codes=['261119_01','261119_02','261119_03'];
const own=LECTURE_QUESTIONS.filter(q=>codes.includes(q.lecture));

test('three November19 lectures appear in general in lecture order with both comparison and negative questions',()=>{
 assert.equal(Object.keys(LECTURES).length,43);
 for(let i=0;i<3;i++){
  const code=codes[i],bank=own.filter(q=>q.lecture===code),negative=bank.filter(q=>q.questionType==='incorrect');
  assert.equal(LECTURES[code].group,'general');assert.equal(LECTURES[code].order,41+i);
  assert.equal(DOCUMENTS[code].pages,[29,33,37][i]);
  assert.ok(bank.length>=24,code+' has insufficient distinct coverage');
  assert.ok(negative.length>=10&&bank.length-negative.length>=10,code);
 }
 assert.equal(TABLE_QUESTIONS.length,0,'no new memorization bank');
});

test('new questions have complete physical evidence and close five-option choices with one false statement',()=>{
 assert.ok(own.length>0);
 for(const q of own){
  assert.equal(q.topic,q.lecture);assert.equal(q.format,'mcq');assert.equal(q.choices.length,5);
  assert.equal(new Set(q.choices).size,5);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5);
  assert.equal(q.choiceNotes.length,5);assert.ok(q.choiceNotes.every(Boolean));assert.ok(q.keyClue&&q.explanation&&q.examRefs.length);
  assert.ok(q.choices.every(s=>s.trim()===s&&s.length<=(q.questionType==='incorrect'?140:55)),q.id);
  const refs=[...q.sourceRefs,...(q.statementEvidence||[]).flatMap(e=>e.sourceRefs)];
  for(const r of refs)for(const p of r.pages){
   assert.ok(p>=1&&p<=DOCUMENTS[r.doc].pages,q.id);
   assert.ok(SOURCE_PAGES[r.doc+':'+p],q.id+' missing capture');
   assert.ok(fs.existsSync(new URL(SOURCE_PAGES[r.doc+':'+p].src,import.meta.url)));
  }
  assert.ok(sourcePages(q).length);
  if(q.questionType==='incorrect'){
   assert.equal(q.statementEvidence.filter(e=>e.isTrue).length,4);assert.equal(q.statementEvidence[q.answer].isTrue,false);
   assert.equal(q.correctedStatement,q.statementEvidence[q.answer].correctedStatement);
   assert.notEqual(q.choices[q.answer],q.correctedStatement);
   assert.doesNotMatch(q.choices[q.answer],/항상|절대|무조건|뿐이다|모든 .*보장/);
  }
 }
});

test('the preceding1461 active questions retain every ID, choice, key, explanation and evidence',()=>{
 const before=[...QUESTIONS,...PATH_QUESTIONS,...LECTURE_QUESTIONS,...CBL_PAST_QUESTIONS].filter(q=>!codes.includes(q.lecture)).sort((a,b)=>a.id.localeCompare(b.id));
 assert.equal(before.length,1461);
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(before)).digest('hex'),'163b63dea90768d118887943ce83c4e92bba3dec718db54692500e895021dc30');
 assert.equal(new Set([...before,...own].map(q=>q.id)).size,before.length+own.length);
});

test('every new lecture resumes all pending questions before its wrong items and shares ordinary stars',()=>{
 for(const code of codes){
  const filters={topic:code,mode:'all',count:0},expected=own.filter(q=>q.topic===code);
  let s=startContinuousSession(LECTURE_QUESTIONS,filters,{},()=>.3),p={};
  assert.ok(expected.length>0);assert.equal(s.items.length,expected.length);
  const wrong=s.items[0].id;
  p=grade(s,p,0,(s.items[0].answer+1)%5,LECTURE_QUESTIONS).progress;
  s=advanceContinuousSession(s,p,LECTURE_QUESTIONS,()=>.3);
  const pendingOrder=s.items.slice(s.position).map(i=>[i.id,i.choices]);
  s=resumeContinuousSession(JSON.stringify(s),LECTURE_QUESTIONS,p,()=>.7);
  assert.deepEqual(s.items.map(i=>[i.id,i.choices]),pendingOrder);assert.ok(!s.items.some(i=>i.id===wrong));
  assert.ok(s.items.every(i=>expected.some(q=>q.id===i.id)));
  while(s.phase==='unanswered'){
   p=grade(s,p,s.position,s.items[s.position].answer,LECTURE_QUESTIONS).progress;
   s=advanceContinuousSession(s,p,LECTURE_QUESTIONS,()=>.3);
  }
  assert.equal(s.phase,'wrong');assert.deepEqual(s.items.map(i=>i.id),[wrong]);
  const stars=readBookmarks(JSON.stringify([wrong]),LECTURE_QUESTIONS);
  assert.deepEqual(startContinuousSession(LECTURE_QUESTIONS,{...filters,mode:'bookmarks'},p,()=>.3,stars).items.map(i=>i.id),[wrong]);
 }
});

test('new statement feedback remains aligned after shuffling and retains any primary-source supplements',()=>{
 const negative=own.filter(q=>q.questionType==='incorrect');assert.ok(negative.length>0);
 for(const q of negative){
  const html=studyFeedback(q,false,[...q.choices].reverse());
  assert.ok(html.replace(/<[^>]*>/g,'').includes(q.correctedStatement),q.id);assert.match(html,/옳은 설명/);assert.match(html,/틀린 설명/);
  for(const r of q.externalRefs||[])assert.ok(html.includes(r.url));
 }
});

test('a saved whole-lecture session picks up new unanswered items without resetting its prior results',()=>{
 assert.ok(own.length>0);
 const before=LECTURE_QUESTIONS.filter(q=>!codes.includes(q.lecture)),filters={topic:'all',mode:'all',count:0};
 let s=startContinuousSession(before,filters,{},()=>.3),p={};
 const completed=s.items[0].id;p=grade(s,p,0,s.items[0].answer,before).progress;
 s=advanceContinuousSession(s,p,before,()=>.3);
 const oldOrder=s.items.slice(s.position).map(i=>i.id),saved=JSON.stringify(s);
 const resumed=resumeContinuousSession(saved,LECTURE_QUESTIONS,p,()=>.7);
 assert.equal(resumed.items.length,LECTURE_QUESTIONS.length-1);
 assert.deepEqual(resumed.items.filter(i=>!own.some(q=>q.id===i.id)).map(i=>i.id),oldOrder);
 assert.ok(own.every(q=>resumed.items.some(i=>i.id===q.id)));
 assert.equal(p[completed].correct,true);assert.ok(!resumed.items.some(i=>i.id===completed));
});
