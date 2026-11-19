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

const batch='20261120-final';
const added=LECTURE_QUESTIONS.filter(q=>q.addedBatch===batch);
const summaries=added.filter(q=>q.sourceScope==='personal-summary');
const all=[...QUESTIONS,...PATH_QUESTIONS,...LECTURE_QUESTIONS,...CBL_PAST_QUESTIONS];

test('the final two supplied lectures appear as the last general lectures with varied ordinary and statement practice',()=>{
 assert.equal(Object.keys(LECTURES).length,45);
 for(const [code,order,pages] of [['261119_06',44,46],['261119_07',45,55]]){
  assert.equal(LECTURES[code].group,'general');assert.equal(LECTURES[code].order,order);assert.equal(DOCUMENTS[code].pages,pages);
  const own=added.filter(q=>q.lecture===code&&q.sourceScope!=='personal-summary');
  assert.ok(own.length>=24,code);assert.ok(own.filter(q=>q.questionType==='incorrect').length>=8,code);
  assert.ok(own.filter(q=>q.questionType!=='incorrect').length>=8,code);
 }
 assert.equal(TABLE_QUESTIONS.length,0);
});

test('three summary pools are grounded in the actual personal PDF and record a distinct learning comparison',()=>{
 const ids=new Set(all.map(q=>q.id));
 for(const [doc,pages] of [['notes_general',19],['notes_bacteria',24],['notes_virus',20]]){
  assert.equal(DOCUMENTS[doc]?.pages,pages);
  const own=summaries.filter(q=>q.summaryDoc===doc);assert.ok(own.length>=12,doc);
  for(const q of own){
   assert.equal(q.sourceRefs[0].doc,doc,q.id);
   assert.ok(q.novelty?.reason?.length>=15,q.id);
   assert.ok(Array.isArray(q.novelty.relatedQuestionIds));
   assert.ok(q.novelty.relatedQuestionIds.every(id=>ids.has(id)&&id!==q.id),q.id+' unknown related question');
   assert.ok(LECTURES[q.lecture]||q.lecture==='integrated');
  }
 }
});

test('all new questions have five close options, complete explanations and actual physical page evidence',()=>{
 assert.ok(added.length>0);assert.equal(new Set(all.map(q=>q.id)).size,all.length);
 for(const q of added){
  assert.equal(q.format,'mcq');assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);
  assert.equal(q.choiceNotes.length,5);assert.ok(q.choiceNotes.every(Boolean));assert.ok(q.keyClue&&q.explanation&&q.examRefs.length);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5);
  assert.ok(q.choices.every(s=>s.trim()===s&&s.length<=(q.questionType==='incorrect'?140:55)),q.id);
  assert.ok(sourcePages(q).length,q.id);
  for(const r of [...q.sourceRefs,...(q.statementEvidence||[]).flatMap(e=>e.sourceRefs)])for(const p of r.pages){
   assert.ok(Number.isInteger(p)&&p>0&&p<=DOCUMENTS[r.doc]?.pages,q.id+' invalid page');
   assert.ok(SOURCE_PAGES[r.doc+':'+p],q.id+' missing evidence');
  }
  if(q.questionType==='incorrect'){
   assert.equal(q.statementEvidence.filter(e=>e.isTrue).length,4);assert.equal(q.statementEvidence[q.answer].isTrue,false);
   assert.equal(q.correctedStatement,q.statementEvidence[q.answer].correctedStatement);
   assert.doesNotMatch(q.choices[q.answer],/항상|절대(?!무산소|혐기|호기|세포내)|무조건|뿐이다|모든 .*보장/);
  }
 }
});

test('all1568 previously published questions retain their complete objects and IDs',()=>{
 const old=all.filter(q=>q.addedBatch!==batch).sort((a,b)=>a.id.localeCompare(b.id));
 assert.equal(old.length,1568);
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(old)).digest('hex'),'8ca2bf9ee34903f002f236cb2787f2c23bdd8bf1e20a3da82c75087f3c1ed1e2');
});

test('summary entry controls live in the hub, reuse lecture records and do not disclose the target lecture in a mixed question label',async()=>{
 const file=new URL('./summary-scopes.mjs',import.meta.url);assert.ok(fs.existsSync(file),'summary scope helper is missing');
 const {SUMMARY_SCOPES,summaryFilters,summaryQuestionLabel}=await import(file.href);
 assert.deepEqual(Object.keys(SUMMARY_SCOPES),['general','bacteria','virus']);
 for(const group of Object.keys(SUMMARY_SCOPES)){
  const f=summaryFilters(group);assert.equal(f.count,0);assert.equal(f.topic,'all');
  assert.equal(f.summaryScope,group);
  const own=summaries.filter(q=>q.summaryDoc===SUMMARY_SCOPES[group].doc);
  assert.deepEqual([...f.questionIds].sort(),own.map(q=>q.id).sort());
  assert.ok(own.every(q=>summaryQuestionLabel(q,LECTURES).includes('정리본')));
 }
 assert.deepEqual(summaryFilters('missing').questionIds,[]);
 const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
 const nav=html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/)[0];
 assert.deepEqual([...nav.matchAll(/data-tab="([^"]+)"/g)].map(m=>m[1]),['home','bookmarks','review']);
 assert.ok(html.includes('정리본 종합 복습'));
 assert.deepEqual([...html.matchAll(/data-summary-start="([^"]+)"/g)].map(m=>m[1]).sort(),['all','bacteria','general','virus']);
 const app=fs.readFileSync(new URL('./app.mjs',import.meta.url),'utf8');assert.match(app,/lectureUI\.start\(summaryFilters\(/);
});

test('each summary scope preserves remaining order and choice order, then moves to its wrong items and shares stars',async()=>{
 const file=new URL('./summary-scopes.mjs',import.meta.url);assert.ok(fs.existsSync(file));
 const {summaryFilters}=await import(file.href);
 for(const group of ['general','bacteria','virus']){
  const filters=summaryFilters(group);let progress={},session=startContinuousSession(LECTURE_QUESTIONS,filters,progress,()=>.31);
  assert.ok(session.items.length>=12);assert.equal(session.items.length,filters.questionIds.length);
  const wrong=session.items[0].id;
  progress=grade(session,progress,0,(session.items[0].answer+1)%5,LECTURE_QUESTIONS).progress;
  session=advanceContinuousSession(session,progress,LECTURE_QUESTIONS,()=>.31);
  const pending=session.items.slice(session.position).map(i=>[i.id,i.choices]);
  session=resumeContinuousSession(JSON.stringify(session),LECTURE_QUESTIONS,progress,()=>.72);
  assert.equal(session.filters.summaryScope,group);
  assert.deepEqual(session.items.map(i=>[i.id,i.choices]),pending);
  assert.ok(session.items.every(i=>filters.questionIds.includes(i.id)));
  while(session.phase==='unanswered'){
   progress=grade(session,progress,session.position,session.items[session.position].answer,LECTURE_QUESTIONS).progress;
   session=advanceContinuousSession(session,progress,LECTURE_QUESTIONS,()=>.31);
  }
  assert.equal(session.phase,'wrong');assert.deepEqual(session.items.map(i=>i.id),[wrong]);
  const stars=readBookmarks(JSON.stringify([wrong]),LECTURE_QUESTIONS);
  assert.deepEqual(startContinuousSession(LECTURE_QUESTIONS,{...filters,mode:'bookmarks'},progress,()=>.31,stars).items.map(i=>i.id),[wrong]);
 }
 const empty=startContinuousSession(LECTURE_QUESTIONS,summaryFilters('missing'),{});assert.equal(empty.items.length,0);
});
