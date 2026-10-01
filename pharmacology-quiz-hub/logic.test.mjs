import test from 'node:test';
import assert from 'node:assert/strict';
import {shuffleChoices,gradeSelection,chooseQuestion,visibleQuestions} from './logic.mjs';

test('shuffling keeps the original answer texts for a multi-answer question',()=>{
  const q={choices:['A','B','C','D','E'],answer:[2,4]};
  const shuffled=shuffleChoices(q,()=>0.13);
  assert.equal(shuffled.choices.length,5);
  assert.deepEqual(shuffled.answer.map(i=>shuffled.choices[i-1]).sort(),['B','D']);
});
test('multi-answer grading requires the full exact answer set',()=>{
  assert.equal(gradeSelection([2,4],[4,2]),true);
  assert.equal(gradeSelection([2,4],[2]),false);
  assert.equal(gradeSelection([2,4],[2,3,4]),false);
});
test('recent questions and seen counts give other source questions a turn',()=>{
  const pool=[{id:'a'},{id:'b'},{id:'c'}];
  assert.equal(chooseQuestion(pool,{a:9,b:1,c:0},['c'],()=>0).id,'b');
});
test('review entries never enter scored practice',()=>{
  const pool=[{id:'a',status:'quiz',section:'9',year:2025},{id:'b',status:'review',section:'9',year:2025}];
  assert.deepEqual(visibleQuestions(pool,'9','all','quiz').map(x=>x.id),['a']);
});
