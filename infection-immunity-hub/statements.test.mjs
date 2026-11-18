import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STATEMENT_QUESTIONS as NEG,STATEMENT_FACT_GROUPS} from './statement-bank.mjs';
import {LECTURES,LECTURE_QUESTIONS,DOCUMENTS} from './study-bank.mjs';
import {buildSession,grade,readBookmarks,toggleBookmark} from './logic.mjs';
import {startContinuousSession,resumeContinuousSession,advanceContinuousSession} from './continuous-queue.mjs';
import {studyFeedback} from './study-ui.mjs';
import {sourcePages} from './practice-layout.mjs';

test('each current lecture receives distinct four-true/one-false statement questions with corrections and physical evidence',()=>{
 assert.ok(NEG.length>=300);
 assert.equal(new Set(NEG.map(q=>q.id)).size,NEG.length);
 assert.equal(LECTURE_QUESTIONS.filter(q=>q.questionType!=='incorrect'&&!q.lecture.startsWith('261118_')&&!q.id.startsWith('lecture-vcase-')).length,754);
 const sizes=[];
 for(const code of Object.keys(LECTURES)){
  const own=NEG.filter(q=>q.topic===code);assert.ok(own.length>=5,code);sizes.push(own.length);
 }
 assert.ok(new Set(sizes).size>1,'coverage follows material rather than equal quotas');
 for(const q of NEG){
  assert.ok(LECTURE_QUESTIONS.some(x=>x.id===q.id));
  assert.equal(q.lecture,q.topic);assert.equal(q.questionType,'incorrect');assert.equal(q.format,'mcq');
  assert.match(q.stem,/옳지 않은 것은\?/);assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);
  assert.equal(q.statementEvidence.length,5);assert.equal(q.choiceNotes.length,5);
  assert.equal(q.statementEvidence.filter(s=>s.isTrue).length,4);
  assert.equal(q.statementEvidence[q.answer].isTrue,false);
  assert.equal(q.correctedStatement,q.statementEvidence[q.answer].correctedStatement);
  assert.notEqual(q.choices[q.answer],q.correctedStatement);
  assert.equal(new Set(q.statementEvidence.map(s=>s.factId)).size,5);
  for(let i=0;i<5;i++){
   const e=q.statementEvidence[i],f=STATEMENT_FACT_GROUPS[q.lecture].find(f=>f.id===e.factId);
   assert.ok(f);assert.equal(q.choices[i],e.isTrue?f.truth:f.falsehood);
   assert.equal(e.correctedStatement,f.truth);assert.ok(q.choiceNotes[i]);
   if(e.isTrue)assert.doesNotMatch(q.choiceNotes[i],/(바꾼|바꿔 넣은|바꿔 놓은|옮긴) 선지/);
   assert.ok(q.choices[i].length<=140);
   for(const r of e.sourceRefs)for(const p of r.pages)assert.ok(p>=1&&p<=DOCUMENTS[r.doc].pages,q.id+' invalid choice evidence');
  }
  assert.ok(sourcePages(q).length>0,q.id+' primary capture');
  assert.doesNotMatch(q.choices[q.answer],/항상|절대(?!무산소|혐기|호기)|무조건|뿐이다|모든 .*보장/);
 }
});

test('statement-only lecture queues stay filtered through grade, resume, wrong phase, stars and direct sessions',()=>{
 const code='261104_01',bank=LECTURE_QUESTIONS,f={topic:code,questionType:'incorrect',mode:'all',count:0};
 const expected=NEG.filter(q=>q.topic===code);
 assert.equal(buildSession(bank,f,{},()=>.4).items.length,expected.length);
 let s=startContinuousSession(bank,f,{},()=>.4),p={};assert.equal(s.items.length,expected.length);
 const wrongId=s.items[0].id;
 p=grade(s,p,0,(s.items[0].answer+1)%5,bank).progress;s=advanceContinuousSession(s,p,bank,()=>.4);
 s=resumeContinuousSession(JSON.stringify(s),bank,p,()=>.7);
 assert.ok(s.items.every(i=>expected.some(q=>q.id===i.id)));assert.ok(!s.items.some(i=>i.id===wrongId));
 while(s.phase==='unanswered'){p=grade(s,p,s.position,s.items[s.position].answer,bank).progress;s=advanceContinuousSession(s,p,bank,()=>.4);}
 assert.equal(s.phase,'wrong');assert.deepEqual(s.items.map(i=>i.id),[wrongId]);
 const stars=readBookmarks(JSON.stringify(toggleBookmark('[]',wrongId)),bank);
 assert.deepEqual(startContinuousSession(bank,{...f,mode:'bookmarks'},p,()=>.4,stars).items.map(i=>i.id),[wrongId]);
});

test('negative feedback identifies the false statement, corrects it and gives shuffled per-choice sources',()=>{
 const q=NEG[0],order=[...q.choices].reverse(),html=studyFeedback(q,true,order);
 assert.match(html,/옳지 않은 설명/);assert.match(html,/정정/);
 assert.ok(html.replace(/<[^>]*>/g,'').includes(q.correctedStatement));assert.match(html,/옳은 설명/);assert.match(html,/틀린 설명/);
 for(const evidence of q.statementEvidence)for(const r of evidence.sourceRefs)assert.ok(html.includes(r.pages.join('·')));
});

test('type selection lives within the existing lecture menu and keeps common keyboard controls',()=>{
 const ui=fs.readFileSync(new URL('./study-ui.mjs',import.meta.url),'utf8'),app=fs.readFileSync(new URL('./app.mjs',import.meta.url),'utf8'),html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
 assert.match(ui,/questionType/);assert.match(ui,/틀린 설명 찾기/);
 assert.match(html,/id="homeLectureStatements"/);assert.match(app,/homeLectureStatements/);
 const nav=html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/)[0];assert.deepEqual([...nav.matchAll(/data-tab="([^"]+)"/g)].map(m=>m[1]),['home','bookmarks','review']);
 assert.match(app,/installQuizKeyboard\(\)/);
});
