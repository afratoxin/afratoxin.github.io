import test from 'node:test';
import assert from 'node:assert/strict';
import {EXTRA_LECTURES,groupForLecture} from './course-catalog.mjs';
import {EXTENSION_QUESTIONS,EXTENSION_RECALL_QUESTIONS} from './extension-bank.mjs';
import {EXTENSION_INTEGRATED_QUESTIONS} from './extension-integrated.mjs';

test('each new supplied lecture has sourced practice and focused recall, with organic counts',()=>{
 const counts=[];
 for(const code of Object.keys(EXTRA_LECTURES)){
  const q=EXTENSION_QUESTIONS.filter(q=>q.lecture===code),r=EXTENSION_RECALL_QUESTIONS.filter(q=>q.lecture===code);
  assert.ok(q.length>=8,code);assert.equal(r.length,q.length);counts.push(q.length);
  assert.ok(['general','virus'].includes(groupForLecture(code)));
  assert.ok(new Set(r.map(q=>q.recallSection)).size>=2,code);
 }
 assert.ok(new Set(counts).size>=5,'do not force a common lecture quota');
 for(const q of [...EXTENSION_QUESTIONS,...EXTENSION_RECALL_QUESTIONS]){
  assert.ok(q.keyClue&&q.explanation&&q.sourceRefs.length,q.id);
  assert.equal(new Set(q.choices).size,5,q.id);assert.equal(q.choiceNotes.length,5);
 }
});
test('new integrated cases retain distinct source lectures and five nearby options',()=>{
 assert.ok(EXTENSION_INTEGRATED_QUESTIONS.length>=20);
 for(const q of EXTENSION_INTEGRATED_QUESTIONS){assert.equal(q.topic,'integrated');assert.equal(q.format,'mcq');assert.equal(new Set(q.choices).size,5);assert.ok(new Set(q.sourceRefs.map(r=>r.doc)).size>=2,q.id);}
});
