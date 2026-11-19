import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {VIRAL_CASE_QUESTIONS as CASES,VIRAL_CASE_TOPIC} from './virus-case-bank.mjs';
import {LECTURE_QUESTIONS,STUDY_TOPICS,DOCUMENTS,LECTURES} from './study-bank.mjs';
import {SOURCE_PAGES} from './source-pages.mjs';
import {startContinuousSession,resumeContinuousSession,advanceContinuousSession} from './continuous-queue.mjs';
import {grade,readBookmarks,toggleBookmark} from './logic.mjs';
import {studyFeedback} from './study-ui.mjs';
import {practiceLayout} from './practice-layout.mjs';

const filters={topic:VIRAL_CASE_TOPIC,mode:'all',format:'mcq',count:0,shuffle:true};
const byId=new Map(CASES.map(q=>[q.id,q]));
function random(seed){return()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);}

test('viral integrated cases cover all ten lectures with five close options and captured lecture evidence',()=>{
 assert.equal(CASES.length,60);
 assert.equal(new Set(CASES.map(q=>q.lecture)).size,10);
 assert.equal(LECTURE_QUESTIONS.filter(q=>!byId.has(q.id)&&q.questionType!=='incorrect'&&!q.lecture.startsWith('261118_')).length,754);
 assert.equal(new Set(LECTURE_QUESTIONS.map(q=>q.id)).size,LECTURE_QUESTIONS.length);
 assert.equal(STUDY_TOPICS[VIRAL_CASE_TOPIC].shuffle,true);
 for(const q of CASES){
  assert.equal(LECTURES[q.lecture].group,'virus');
  assert.match(q.id,/^lecture-vcase-/);assert.equal(q.topic,VIRAL_CASE_TOPIC);
  assert.equal(q.kind,'case');assert.equal(q.format,'mcq');
  assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);
  assert.ok(q.choices.every(c=>c.trim()===c&&c.length<=55));
  assert.equal(q.choiceNotes.length,5);assert.ok(q.choiceNotes.every(c=>c.length>10));
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5);
  assert.ok(q.stem&&q.keyClue&&q.explanation&&q.subjectId&&q.rotationGroup);
  assert.ok(!q.stem.toLowerCase().includes(q.choices[q.answer].toLowerCase()),q.id+' leaks answer');
  for(const ref of q.sourceRefs)for(const page of ref.pages){
   assert.ok(DOCUMENTS[ref.doc]&&page>=1&&page<=DOCUMENTS[ref.doc].pages,q.id+' page bounds');
   assert.ok(SOURCE_PAGES[`${ref.doc}:${page}`],q.id+' missing captured page');
  }
 }
});

test('one thousand viral queues retain every case, shuffle answer positions and spread repeat subjects when possible',()=>{
 const positions=[0,0,0,0,0],rng=random(261118);
 for(let round=0;round<1000;round++){
  const s=startContinuousSession(LECTURE_QUESTIONS,filters,{},rng,[]);
  assert.equal(s.items.length,CASES.length);assert.equal(new Set(s.items.map(i=>i.id)).size,CASES.length);
  const remaining=[...CASES],recent=[];let lastGroup=null;
  for(const item of s.items){
   const q=byId.get(item.id);
   assert.equal(item.choices.length,5);assert.equal(new Set(item.choices).size,5);
   assert.equal(item.choices[item.answer],q.choices[q.answer]);positions[item.answer]++;
   const ideal=remaining.some(x=>!recent.includes(x.subjectId)&&x.rotationGroup!==lastGroup);
   const fresh=remaining.some(x=>!recent.includes(x.subjectId));
   if(ideal){assert.ok(!recent.includes(q.subjectId));assert.notEqual(q.rotationGroup,lastGroup);}
   else if(fresh)assert.ok(!recent.includes(q.subjectId));
   remaining.splice(remaining.indexOf(q),1);recent.push(q.subjectId);if(recent.length>3)recent.shift();lastGroup=q.rotationGroup;
  }
 }
 assert.ok(Math.max(...positions)-Math.min(...positions)<1000,positions.join(','));
});

test('viral practice resumes its remaining order, retains stars and finishes unanswered before wrong answers',()=>{
 let session=startContinuousSession(LECTURE_QUESTIONS,filters,{},random(12),[]);
 const first=session.items[0],wrong=first.choices.findIndex((_,i)=>i!==first.answer);
 let progress=grade(session,{},0,wrong,LECTURE_QUESTIONS).progress;
 const stars=readBookmarks(JSON.stringify(toggleBookmark('[]',first.id)),LECTURE_QUESTIONS);
 assert.deepEqual(stars,[first.id]);
 session=advanceContinuousSession(session,progress,LECTURE_QUESTIONS,random(13),stars);
 const remaining=session.items.slice(session.position).map(i=>[i.id,i.choices]);
 session=resumeContinuousSession(JSON.stringify(session),LECTURE_QUESTIONS,progress,random(14),stars);
 assert.deepEqual(session.items.map(i=>[i.id,i.choices]),remaining);
 assert.equal(session.queueCounts.unanswered,59);assert.equal(session.queueCounts.wrong,1);
 while(session.phase==='unanswered'){
  const item=session.items[session.position];progress=grade(session,progress,session.position,item.answer,LECTURE_QUESTIONS).progress;
  session=advanceContinuousSession(session,progress,LECTURE_QUESTIONS,random(15),stars);
 }
 assert.equal(session.phase,'wrong');assert.deepEqual(session.items.map(i=>i.id),[first.id]);
 progress=grade(session,progress,0,session.items[0].answer,LECTURE_QUESTIONS).progress;
 assert.equal(advanceContinuousSession(session,progress,LECTURE_QUESTIONS).phase,'complete');
 const starred=startContinuousSession(LECTURE_QUESTIONS,{...filters,mode:'review',questionIds:stars},progress,random(16),stars);
 assert.deepEqual(starred.items.map(i=>i.id),stars);
});

test('viral choices and feedback stay aligned after shuffling and evidence is only shown after grading',()=>{
 for(const q of CASES){
  const order=[...q.choices].reverse(),feedback=studyFeedback(q,true,order);
  const plain=feedback.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  let offset=-1;
  for(const choice of order){const text=q.choiceNotes[q.choices.indexOf(choice)];const found=plain.indexOf(text,offset+1);assert.ok(found>offset,q.id);offset=found;}
  const hidden=practiceLayout({question:'<article>case</article>',feedback:'',q,session:{items:[]},sourceLabel:'LECTURE_EVIDENCE'});
  assert.doesNotMatch(hidden,/LECTURE_EVIDENCE|source-page-image|data-evidence-open/);
  const shown=practiceLayout({question:'<article>case</article>',feedback,q,session:{items:[]},sourceLabel:'LECTURE_EVIDENCE'});
  assert.match(shown,/LECTURE_EVIDENCE/);assert.match(shown,/data-evidence-open/);
 }
});

test('viral hub entry launches shared practice and refreshes the changed module dependency chain',()=>{
 const read=name=>fs.readFileSync(new URL(name,import.meta.url),'utf8');
 const html=read('index.html'),app=read('app.mjs');
 for(const id of ['homeViralCases','homeViralCasesWrong','viralCaseCourseCount','viralCaseCourseTrack','viralCaseCourseStats'])assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(app,/homeViralCases.*lectureUI\.start\(\{topic:VIRAL_CASE_TOPIC,mode:'all'/);
 assert.match(app,/homeViralCasesWrong.*lectureUI\.start\(\{topic:VIRAL_CASE_TOPIC,mode:'wrong'/);
 assert.match(app,/\['viralCase',VIRAL_CASE_QUESTIONS,lectureUI\]/);
 assert.match(html,/app\.mjs\?v=20261120a/);
 for(const name of ['quiz-bank.mjs','study-ui.mjs','continuous-queue.mjs'])assert.ok(app.includes(name+'?v=20261120a'));
 assert.match(read('quiz-bank.mjs'),/study-bank\.mjs\?v=20261120a/);
 assert.match(read('study-ui.mjs'),/continuous-queue\.mjs\?v=20261120a/);
});
