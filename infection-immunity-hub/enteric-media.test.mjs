import test from 'node:test';
import assert from 'node:assert/strict';
import {ENTERIC_MEDIA_QUESTIONS as questions,ENTERIC_MEDIA_PARTS as parts} from './enteric-media-bank.mjs';

test('the added screenshot recall covers transport, MacConkey, SS and KIA with complete source-linked choices',()=>{
 assert.ok(questions.length>=14&&questions.length<=18);
 assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
 for(const q of questions){
  assert.equal(q.lecture,'261105_02');assert.equal(q.format,'mcq');assert.equal(q.kind,'table');
  assert.equal(q.topic,'table-enteric-media');assert.equal(new Set(q.choices).size,5);
  assert.ok(q.choices.every(c=>c.trim()===c&&c.length<=55),q.id);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5,q.id);
  assert.equal(q.choiceNotes.length,5);assert.ok(q.choiceNotes.every(Boolean));
  assert.ok(q.explanation&&q.keyClue);assert.deepEqual(q.examRefs,[]);
  assert.ok(q.sourceRefs.every(r=>r.doc==='261105_02'&&r.pages.every(p=>[4,5,6].includes(p))),q.id);
  assert.ok(q.recallSection.startsWith('261105_02:'));
 }
 const sections=Object.groupBy(questions,q=>q.recallSection);
 for(const section of ['transport','media','ss','kia'])assert.ok(sections['261105_02:'+section]?.length>=2,section);
 for(const section of ['transport','ss','kia'])for(const field of ['what','how','why'])assert.ok(parts['261105_02:'+section][field].length>=15);
});

test('lecture-table taxonomy is qualified and gas is distinguished from sulfide darkening',()=>{
 const classification=questions.find(q=>q.id.endsWith('-serratiacitrobacter'));
 assert.ok(classification.stem.includes('강의표'));
 assert.match(classification.explanation,/S\. marcescens/);assert.match(classification.explanation,/비발효/);assert.match(classification.explanation,/Citrobacter.*차이/);
 assert.ok(classification.externalRefs.every(r=>r.url.startsWith('https://')));
 const ss=questions.find(q=>q.id.endsWith('-ss-black'));assert.match(ss.stem,/중심/);assert.equal(ss.choices[ss.answer],'H₂S 생성');
 const gas=questions.find(q=>q.id.endsWith('-kia-gas-only'));assert.equal(gas.choices[gas.answer],'H₂S − · Gas +');
 const black=questions.find(q=>q.id.endsWith('-kia-h2s-only'));assert.equal(black.choices[black.answer],'H₂S + · Gas −');
});
