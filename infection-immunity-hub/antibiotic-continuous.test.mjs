import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {QUESTIONS} from './bank.mjs';
import {grade} from './logic.mjs';
import {startContinuousSession,resumeContinuousSession,advanceContinuousSession} from './continuous-queue.mjs';

test('antibiotics has one global keyboard delegate and no bounded-session controls or replacement gate',()=>{
 const app=fs.readFileSync(new URL('./app.mjs',import.meta.url),'utf8'),html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
 assert.doesNotMatch(app+html,/countFilter|replacePrompt|confirmReplace|cancelReplace|pendingFilters|\b20문항|세트 길이|새 세트|세트 결과/);
 assert.equal((app.match(/installQuizKeyboard\(\)/g)||[]).length,1);
 assert.doesNotMatch(app,/addEventListener\('keydown'/);
 for(const call of ['startContinuousSession','resumeContinuousSession','advanceContinuousSession','continuousProgress'])assert.ok(app.includes(call),call);
 for(const id of ['topicFilter','formatFilter','modeFilter'])assert.ok(html.includes(`id="${id}"`));
 assert.match(app,/채점 완료 · Enter/);
});

test('the actual antibiotic bank resumes the full pending scope and moves to its wrong items',()=>{
 let progress={},s=startContinuousSession(QUESTIONS,{topic:'all',format:'all',count:10},progress,()=>0.3);
 assert.equal(s.items.length,QUESTIONS.length);
 for(let i=0;i<12;i++){
  const item=s.items[s.position];progress=grade(s,progress,s.position,i===0?(item.answer+1)%item.choices.length:item.answer,QUESTIONS).progress;
  s=advanceContinuousSession(s,progress,QUESTIONS,()=>0.3);
 }
 s=resumeContinuousSession(JSON.stringify(s),QUESTIONS,progress,()=>0.3);assert.equal(s.items.length,QUESTIONS.length-12);assert.equal(s.phase,'unanswered');
 while(s.phase==='unanswered'){
  progress=grade(s,progress,s.position,s.items[s.position].answer,QUESTIONS).progress;s=advanceContinuousSession(s,progress,QUESTIONS,()=>0.3);
 }
 assert.equal(s.phase,'wrong');assert.equal(s.items.length,1);assert.equal(s.queueCounts.unanswered,0);
});
