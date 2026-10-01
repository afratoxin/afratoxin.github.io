import fs from 'node:fs';
import assert from 'node:assert/strict';
import {shuffleChoices,gradeSelection,chooseQuestion,visibleQuestions} from './logic.mjs';
const data=JSON.parse(fs.readFileSync(new URL('./questions.json',import.meta.url),'utf8'));
const questions=data.questions;
assert.equal(questions.length,579);
const ids=new Set(questions.map(q=>q.id));
assert.equal(ids.size,questions.length,'stable IDs must be unique');
let quiz=0,review=0;
for(const q of questions){
  assert.ok(!q.image,'raw source images are not part of the published quiz');
  if(q.status==='review'){review++;assert.ok(q.reviewReason);continue;}
  quiz++;
  assert.equal(q.choices.length,5,q.id);
  assert.equal(new Set(q.choices).size,5,q.id);
  assert.ok(q.answer.length && q.answer.every(a=>a>=1 && a<=5),q.id);
  for(let i=0;i<3;i++){
    const shown=shuffleChoices(q);
    assert.deepEqual(shown.answer.map(a=>shown.choices[a-1]).sort(),q.answer.map(a=>q.choices[a-1]).sort(),q.id);
    assert.ok(gradeSelection(shown.answer,[...shown.answer]),q.id);
  }
}
assert.equal(quiz,453);assert.equal(review,126);
for(const unit of ['all',...data.unitOrder]){
  const pool=visibleQuestions(questions,unit,'all','quiz');
  if(!pool.length)continue;
  const seen={};let recent=[];const coverage=new Set();
  for(let i=0;i<1000;i++){
    const picked=chooseQuestion(pool,seen,recent);
    assert.ok(picked);
    if(pool.length>1)assert.notEqual(picked.id,recent[0],'adjacent repetition: '+unit);
    coverage.add(picked.id);seen[picked.id]=(seen[picked.id]||0)+1;
    recent=[picked.id,...recent.filter(id=>id!==picked.id)].slice(0,Math.min(8,pool.length-1));
  }
  assert.equal(coverage.size,pool.length,'unreached question in '+unit);
}
console.log(`Validated ${quiz} five-choice quizzes, ${review} review entries and 1,000-question rotation per unit.`);
