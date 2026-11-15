import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSession,grade} from './logic.mjs';
import {startContinuousSession,resumeContinuousSession} from './continuous-queue.mjs';

const base={id:'original',topic:'original',format:'mcq',choices:['A','B','C','D','E'],answer:2,preserveChoiceOrder:true};
test('original exam option numbers remain faithful across shuffle and resume',()=>{
 const s=buildSession([base],{}, {},()=>0);
 assert.deepEqual(s.items[0].choices,base.choices);assert.equal(s.items[0].answer,2);
 const continuous=startContinuousSession([base],{topic:'original'}, {},()=>0);
 assert.deepEqual(resumeContinuousSession(JSON.stringify(continuous),[base],{},()=>0.9).items[0].choices,base.choices);
});
test('a documented all-credit question accepts every original option without changing ordinary grading',()=>{
 const q={...base,answerPolicy:'all-credit',acceptedAnswers:[0,1,2,3,4]};
 for(let index=0;index<5;index++){
  const session=buildSession([q],{}, {},()=>0);
  assert.equal(grade(session,{},0,index,[q]).correct,true);
  assert.equal(grade(session,{},0,index,[q]).correct,true);
 }
 assert.equal(grade(buildSession([base],{}, {},()=>0),{},0,0,[base]).correct,false);
});
