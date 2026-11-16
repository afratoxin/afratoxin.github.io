import test from 'node:test';
import assert from 'node:assert/strict';
import {NOV16_LECTURES,groupForLecture} from './course-catalog.mjs';
import {QUESTIONS as V,RECALL_QUESTIONS as VR,PARTS as VP,INTEGRATED_QUESTIONS as VI} from './nov16-virus-bank.mjs';
import {QUESTIONS as FI} from './nov16-integrated-fungi.mjs';
import {QUESTIONS as F,RECALL_QUESTIONS as FR,PARTS as FP} from './nov16-fungi-bank.mjs';
import {LECTURE_QUESTIONS,TABLE_QUESTIONS,DOCUMENTS} from './study-bank.mjs';
import {PATH_QUESTIONS} from './pathology-bank.mjs';
import {QUESTIONS as ABX} from './bank.mjs';
import {CBL_PAST_QUESTIONS} from './cbl-past-bank.mjs';
import {CURATION_SUMMARY,RETIRED_IDS,REPLACEMENTS,REFINEMENTS,curateQuestions} from './question-curation.mjs';
import {SOURCE_PAGES} from './source-pages.mjs';
import {RECALL_SETS} from './recall-catalog.mjs';

test('Nov 16 lectures have organic source-backed main and focused recall questions',()=>{
 const all=[...V,...F],recall=[...VR,...FR],parts={...VP,...FP},counts=[];
 assert.equal(Object.keys(NOV16_LECTURES).length,5);
 for(const [code,meta] of Object.entries(NOV16_LECTURES)){
  assert.equal(groupForLecture(code),meta.group);
  const main=all.filter(q=>q.lecture===code),r=recall.filter(q=>q.lecture===code);
  assert.ok(main.length>0&&r.length>0,code);counts.push(main.length);
  assert.ok(new Set(r.map(q=>q.recallSection)).size>=2,code);
  for(const q of main)assert.ok(LECTURE_QUESTIONS.some(x=>x.id===q.id),q.id);
  for(const q of r){assert.ok(TABLE_QUESTIONS.some(x=>x.id===q.id),q.id);assert.ok(parts[q.recallSection]);assert.ok(RECALL_SETS[q.recallSection]);}
 }
 assert.ok(new Set(counts).size>1,'counts follow source content');
 for(const q of [...all,...recall]){
  assert.equal(q.choices.length,5,q.id);assert.equal(new Set(q.choices).size,5,q.id);
  assert.ok(q.choices.every(c=>c.length<=55),q.id);assert.equal(q.choiceNotes.length,5,q.id);
  assert.ok(q.keyClue&&q.explanation&&q.sourceRefs.length,q.id);
  assert.ok(!/(항상|절대로|뿐이다)/.test(q.choices.join(' ')),q.id);
  for(const ref of q.sourceRefs)for(const p of ref.pages){assert.ok(p>=1&&p<=DOCUMENTS[ref.doc].pages,q.id);assert.ok(SOURCE_PAGES[`${ref.doc}:${p}`],`${q.id} missing evidence`);}
 }
});
test('source curation covers all old generated questions and never alters original exams',()=>{
 assert.equal(CURATION_SUMMARY.reviewed,1206);
 assert.ok(CURATION_SUMMARY.retired>0&&CURATION_SUMMARY.rewritten>0);
 const active=[...LECTURE_QUESTIONS,...TABLE_QUESTIONS,...PATH_QUESTIONS,...ABX],ids=new Set(active.map(q=>q.id));
 assert.equal(ids.size,active.length);
 for(const id of RETIRED_IDS)assert.ok(!ids.has(id),id);
 for(const [old,q] of Object.entries(REPLACEMENTS)){assert.ok(!ids.has(old),old);assert.ok(ids.has(q.id),q.id);assert.notEqual(q.id,old);}
 for(const [old,q] of Object.entries(REFINEMENTS)){assert.equal(q.id,old);assert.ok(ids.has(old));}
 assert.equal(CBL_PAST_QUESTIONS.length,56);
 assert.deepEqual(curateQuestions(CBL_PAST_QUESTIONS),CBL_PAST_QUESTIONS);
 const retained={id:'untouched-progress-id',answer:2};assert.equal(curateQuestions([retained])[0],retained);
});
test('new integrated cases connect distinct lecture evidence and close keyword choices',()=>{
 assert.ok(VI.length+FI.length>=8);
 for(const q of [...VI,...FI]){
  assert.equal(q.lecture,'integrated');assert.equal(q.topic,'integrated');
  assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);
  assert.ok(q.choices.every(c=>c.length<=55));assert.equal(q.choiceNotes.length,5);
  assert.ok(new Set(q.sourceRefs.map(s=>s.doc)).size>=2,q.id);
  assert.ok(LECTURE_QUESTIONS.some(x=>x.id===q.id));
 }
});
