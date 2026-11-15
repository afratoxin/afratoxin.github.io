import test from 'node:test';
import assert from 'node:assert/strict';
import {PATH_QUESTIONS} from './pathology-bank.mjs';
import {QUESTIONS} from './bank.mjs';
import {LECTURE_QUESTIONS,TABLE_QUESTIONS} from './study-bank.mjs';

const giveaway=/항상|언제나|반드시|무조건|오직|뿐|전혀|완전히|무관|불필요|절대로|모든\s*(?:환자|감염|진균|바이러스|세균|항생제)/;
test('multiple-choice options do not signal falsehood with sweeping rhetorical claims',()=>{
 for(const q of [...QUESTIONS,...PATH_QUESTIONS,...LECTURE_QUESTIONS,...TABLE_QUESTIONS].filter(q=>q.format==='mcq')){
  for(const c of q.choices)assert.doesNotMatch(c,giveaway,`${q.id}: ${c}`);
 }
});

test('pathology statement questions use five close, source-linked factual substitutions',()=>{
 for(const q of PATH_QUESTIONS.filter(q=>q.ask!=='organism')){
  assert.equal(q.choiceEvidence?.length,5,q.id);
  assert.equal(q.choiceEvidence.filter(e=>e.shownIsTrue).length,q.ask==='correct'?1:4,q.id);
  assert.equal(q.choiceEvidence[q.answer].shownIsTrue,q.ask==='correct',q.id);
  for(const [i,e] of q.choiceEvidence.entries()){
   assert.equal(q.choices[i],e.shownIsTrue?e.trueStatement:e.falseStatement);
   assert.ok(e.trueStatement!==e.falseStatement);
   assert.ok(e.sourceRefs.length&&e.sourceRefs.every(r=>r.pages.length));
   const a=e.trueStatement.length,b=e.falseStatement.length;
   assert.ok(Math.max(a,b)/Math.min(a,b)<1.9,`${q.id}: unbalanced paired wording`);
   assert.equal(q.choiceNotes[i],e.trueStatement);
  }
 }
});

test('question polarity is conveyed by the prompt rather than an exceptional option length',()=>{
 for(const q of PATH_QUESTIONS.filter(q=>q.ask!=='organism')){
  const other=q.choices.filter((_,i)=>i!==q.answer).map(c=>c.length).sort((a,b)=>a-b);
  const typical=(other[1]+other[2])/2;
  assert.ok(q.choices[q.answer].length<=typical*1.7,`${q.id}: keyed option conspicuously longer`);
 }
});
