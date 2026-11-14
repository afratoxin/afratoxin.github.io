import test from 'node:test';
import assert from 'node:assert/strict';
import {LECTURES,DOCUMENTS,LECTURE_QUESTIONS,TABLE_QUESTIONS,TABLE_TOPICS} from './study-bank.mjs';
import {QUESTIONS} from './bank.mjs';
import {PATH_QUESTIONS} from './pathology-bank.mjs';
test('sixteen lectures have ten original short-option questions with complete source metadata',()=>{
 assert.equal(Object.keys(LECTURES).length,16);assert.equal(LECTURE_QUESTIONS.length,160);
 const ids=new Set();
 for(const code of Object.keys(LECTURES))assert.equal(LECTURE_QUESTIONS.filter(q=>q.lecture===code).length,10,code);
 for(const q of LECTURE_QUESTIONS){
  assert.ok(!ids.has(q.id));ids.add(q.id);assert.ok(LECTURES[q.lecture]);
  assert.equal(q.format,'mcq');assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);
  assert.ok(q.choices.every(s=>s.trim()===s&&s.length<=55),`long choice ${q.id}`);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5);assert.ok(q.explanation&&q.keyClue);
  assert.equal(q.choiceNotes.length,5);assert.ok(q.choiceNotes.every(Boolean));
  assert.ok(q.sourceRefs.length);assert.ok(Array.isArray(q.examRefs));
 }
 assert.ok(LECTURE_QUESTIONS.filter(q=>q.kind==='case').length>=96);
 assert.ok(LECTURE_QUESTIONS.every(q=>!PATH_QUESTIONS.some(p=>p.stem===q.stem)));
});
test('table drills cover the existing antibiotic classifications and sourced microbe mappings',()=>{
 for(const key of ['table-abx-oral','table-abx-bbb','table-abx-pregnancy'])assert.equal(TABLE_QUESTIONS.filter(q=>q.topic===key).length,8);
 assert.ok(TABLE_QUESTIONS.length>=72);assert.ok(Object.keys(TABLE_TOPICS).length>=8);
 for(const q of TABLE_QUESTIONS){assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);assert.ok(q.answer>=0&&q.answer<5);assert.ok(TABLE_TOPICS[q.topic]);}
});
test('all new source pages are real PDF pages and every canonical ID is globally unique',()=>{
 const all=[...QUESTIONS,...PATH_QUESTIONS,...LECTURE_QUESTIONS,...TABLE_QUESTIONS];assert.equal(new Set(all.map(q=>q.id)).size,all.length);
 for(const q of [...LECTURE_QUESTIONS,...TABLE_QUESTIONS])for(const s of q.sourceRefs){
  assert.ok(DOCUMENTS[s.doc],`unknown document ${q.id}`);assert.ok(s.pages.length);
  assert.ok(s.pages.every(p=>Number.isInteger(p)&&p>=1&&p<=DOCUMENTS[s.doc].pages),`invalid page ${q.id}`);
 }
});
