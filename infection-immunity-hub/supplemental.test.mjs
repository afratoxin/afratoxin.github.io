import test from 'node:test';
import assert from 'node:assert/strict';
import {SUPPLEMENTAL_QUESTIONS,INTEGRATED_QUESTIONS} from './supplemental-bank.mjs';
import {LECTURES,LECTURE_QUESTIONS} from './study-bank.mjs';
test('expanded bank varies coverage with source content instead of a ten-item quota',()=>{
 const counts=Object.keys(LECTURES).map(code=>LECTURE_QUESTIONS.filter(q=>q.topic===code).length);
 assert.ok(new Set(counts).size>=4);assert.ok(Math.max(...counts)>=22);
 assert.ok(SUPPLEMENTAL_QUESTIONS.length>=100);
 assert.ok(SUPPLEMENTAL_QUESTIONS.filter(q=>q.kind==='basic').length>=70);
 for(const q of [...SUPPLEMENTAL_QUESTIONS,...INTEGRATED_QUESTIONS]){
  assert.equal(new Set(q.choices).size,5,q.id);assert.equal(q.choices.length,5);
  assert.ok(q.answer>=0&&q.answer<5);assert.equal(q.choiceNotes.length,5);assert.ok(q.sourceRefs.length);
 }
});
test('integrated practice spans distinct lectures and retains clinical source evidence',()=>{
 assert.ok(INTEGRATED_QUESTIONS.length>=36);
 for(const q of INTEGRATED_QUESTIONS){
  assert.equal(q.topic,'integrated');assert.ok(new Set(q.sourceRefs.map(r=>r.doc)).size>=2,q.id);
  assert.ok(q.stem.length>=25);assert.ok(q.keyClue&&q.explanation);
 }
});
