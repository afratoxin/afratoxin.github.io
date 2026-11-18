import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {BACTERIAL_CASE_QUESTIONS as CASES,BACTERIAL_CASE_TOPIC} from './bacteria-case-bank.mjs';
import {LECTURE_QUESTIONS,STUDY_TOPICS,DOCUMENTS} from './study-bank.mjs';
import {SOURCE_PAGES} from './source-pages.mjs';
import {startContinuousSession,resumeContinuousSession,advanceContinuousSession} from './continuous-queue.mjs';
import {grade,readProgress,readBookmarks,toggleBookmark} from './logic.mjs';

test('integrated bacterial vignettes have close five-option choices, real evidence and stable lecture IDs',()=>{
 assert.ok(CASES.length>=70);
 assert.equal(LECTURE_QUESTIONS.filter(q=>!q.id.startsWith('lecture-bcase-')&&!q.id.startsWith('lecture-vcase-')&&q.questionType!=='incorrect'&&!q.lecture.startsWith('261118_')).length,674);
 assert.ok(new Set(CASES.map(q=>q.sourceRefs.map(r=>r.doc)).flat()).size>=13);
 assert.equal(new Set(CASES.map(q=>q.id)).size,CASES.length);
 assert.ok(STUDY_TOPICS[BACTERIAL_CASE_TOPIC]);
 for(const q of CASES){
  assert.ok(LECTURE_QUESTIONS.some(x=>x.id===q.id));
  assert.match(q.id,/^lecture-bcase-/);assert.equal(q.topic,BACTERIAL_CASE_TOPIC);
  assert.equal(q.kind,'case');assert.equal(q.format,'mcq');
  assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);
  assert.equal(q.choiceNotes.length,5);assert.ok(q.choiceNotes.every(Boolean));
  assert.ok(q.keyClue&&q.explanation&&q.stem);
  assert.ok(q.choices.every(c=>c.trim()===c&&c.length<=55));
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5);
  assert.ok(!q.stem.toLowerCase().includes(q.choices[q.answer].toLowerCase()),q.id+' gives answer');
  assert.doesNotMatch(q.choices.join(' '),/항상|절대|뿐이다|Candida|Aspergillus|virus/i);
  for(const ref of q.sourceRefs)for(const page of ref.pages){
   assert.ok(page>=1&&page<=DOCUMENTS[ref.doc].pages,q.id+' page bounds');
   assert.ok(SOURCE_PAGES[`${ref.doc}:${page}`],q.id+' captured evidence');
  }
 }
});

test('bacterial scope shares lecture records, keeps the full range, resumes unanswered then wrong and supports stars',()=>{
 const filters={topic:BACTERIAL_CASE_TOPIC,mode:'all',format:'mcq',count:0,shuffle:true};
 let s=startContinuousSession(LECTURE_QUESTIONS,filters,{},()=>.5,[]);
 assert.equal(s.items.length,CASES.length);
 assert.notDeepEqual(s.items.map(i=>i.id),CASES.map(q=>q.id));
 const first=s.items[0],q=CASES.find(q=>q.id===first.id);
 const wrong=first.choices.findIndex(c=>c!==q.choices[q.answer]);
 const g=grade(s,{},0,wrong,LECTURE_QUESTIONS);
 let progress=readProgress(JSON.stringify(g.progress),LECTURE_QUESTIONS);
 s=advanceContinuousSession(s,progress,LECTURE_QUESTIONS,()=>.5,[]);
 const resumed=resumeContinuousSession(JSON.stringify(s),LECTURE_QUESTIONS,progress,()=>.5,[]);
 assert.equal(resumed.queueCounts.unanswered,CASES.length-1);
 assert.equal(resumed.queueCounts.wrong,1);
 assert.ok(resumed.items.every(i=>i.id!==first.id));
 s=resumed;
 while(s.phase==='unanswered'){
  const item=s.items[s.position];
  progress=grade(s,progress,s.position,item.answer,LECTURE_QUESTIONS).progress;
  s=advanceContinuousSession(s,progress,LECTURE_QUESTIONS,()=>.5,[]);
 }
 assert.equal(s.phase,'wrong');assert.deepEqual(s.items.map(i=>i.id),[first.id]);
 progress=grade(s,progress,0,s.items[0].answer,LECTURE_QUESTIONS).progress;
 assert.equal(advanceContinuousSession(s,progress,LECTURE_QUESTIONS,()=>.5,[]).phase,'complete');
 const stars=readBookmarks(JSON.stringify(toggleBookmark('[]',q.id)),LECTURE_QUESTIONS);
 assert.deepEqual(stars,[q.id]);
 const starred=startContinuousSession(LECTURE_QUESTIONS,{...filters,mode:'review',questionIds:stars},progress,()=>.5,stars);
 assert.deepEqual(starred.items.map(i=>i.id),[q.id]);
});

test('bacterial case entry is in the hub and launches the common keyboard-enabled lecture practice',()=>{
 const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
 const app=fs.readFileSync(new URL('./app.mjs',import.meta.url),'utf8');
 assert.match(html,/id="homeBacterialCases"/);
 assert.match(html,/id="bacterialCaseCourseStats"/);
 assert.doesNotMatch(html,/<button[^>]+data-tab="bacteria-cases"/);
 assert.match(app,/homeBacterialCases.*lectureUI\.start\(/);
 assert.match(app,/topic:BACTERIAL_CASE_TOPIC/);
 assert.match(app,/installQuizKeyboard\(\)/);
});
