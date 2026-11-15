import test from 'node:test';
import assert from 'node:assert/strict';
import {PATHEDU_QUESTIONS as questions} from './pathedu-bank.mjs';
import {pathFeedback} from './pathology-ui.mjs';
import {practiceLayout} from './practice-layout.mjs';

test('library questions depend on the photograph rather than a written diagnosis',()=>{
 assert.ok(questions.length>=12&&questions.length<=18,'use distinct diseases instead of one generic item per stain');
 for(const q of questions){
  assert.equal(q.ask,'organism',q.id);assert.ok(q.photos.length,q.id);
  assert.ok(q.stem.length<=115,q.id+' has an overlong stem');
  assert.doesNotMatch(q.stem,/보고되었|기재되어|sulfur granule|koilocyt|owl|decoy|molluscum body|다핵화|핵 molding|격막성|리본형|예각 분지|endospore|구형체/i,q.id+' gives the image answer in words');
  assert.ok(q.choices.every(c=>c.length<=40&&!/옳다|옳은|이용한다|위치한다/.test(c)),q.id);
  assert.ok(q.imageClue&&q.coreFact&&q.contrast,q.id+' needs visible morphology and a close differential after grading');
  assert.ok(q.id.startsWith('path-edu-v2-'),'revised questions must not reuse graded IDs');
 }
});

test('the visible clue and closest differential stay hidden until grading',()=>{
 const q=questions.find(q=>q.imageClue);assert.ok(q,'image-specific feedback is missing');
 const answer=pathFeedback({...q,sourceScope:'library'},true);
 assert.match(answer,/사진 단서/);assert.match(answer,/핵심 연결/);assert.match(answer,/가장 헷갈리는 감별/);
 const hidden=practiceLayout({question:'<article>question and photograph</article>',q,session:{items:[{selected:null}]}});
 assert.ok(!hidden.includes(q.imageClue));assert.ok(!hidden.includes(q.coreFact));assert.ok(!hidden.includes(q.contrast));
});
