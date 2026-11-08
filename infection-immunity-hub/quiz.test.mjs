import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

test('the complete study bank and quiz engine are available', async () => {
  assert.ok(existsSync(new URL('./bank.mjs', import.meta.url)), 'lecture-grounded question bank is missing');
  assert.ok(existsSync(new URL('./logic.mjs', import.meta.url)), 'quiz engine is missing');
  const { QUESTIONS } = await import('./bank.mjs');
  const { buildSession, grade, stats, restoreSession, readProgress } = await import('./logic.mjs');
  assert.equal(QUESTIONS.length,72);
  assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,72);
  for (const topic of ['oral','bbb','pregnancy','cases']) {
    const bank = QUESTIONS.filter(q=>q.topic===topic);
    assert.ok(bank.length>=16);
    assert.ok(bank.some(q=>q.format==='mcq') && bank.some(q=>q.format==='ox'));
  }
  for (const q of QUESTIONS) {
    assert.ok(q.stem && q.explanation && q.pages.length);
    assert.equal(q.choices.length, q.format==='mcq'?5:2);
    assert.equal(new Set(q.choices).size,q.choices.length);
    assert.ok(q.answer>=0 && q.answer<q.choices.length);
    assert.ok(q.pages.every(p=>p>=1 && p<=55));
  }
  const session = buildSession(QUESTIONS,{topic:'bbb',format:'mcq',count:10}, {},()=>0.3);
  assert.equal(session.items.length,8);
  for(const item of session.items) {
    const q=QUESTIONS.find(q=>q.id===item.id);
    assert.equal(item.choices[item.answer],q.choices[q.answer], 'answer must follow shuffled choices');
  }
  let progress={};
  const item=session.items[0];
  let g=grade(session,progress,0,(item.answer+1)%item.choices.length,QUESTIONS);
  assert.equal(g.correct,false); progress=g.progress;
  assert.equal(stats(QUESTIONS,progress).wrong,1);
  assert.equal(stats(QUESTIONS,progress).total,72);
  assert.equal(grade(session,progress,0,item.answer,QUESTIONS).duplicate,true,'cannot regrade the same rendered item');
  const retry=buildSession(QUESTIONS,{mode:'wrong',count:0},progress,()=>0.2);
  assert.equal(retry.items.length,1);
  progress=grade(retry,progress,0,retry.items[0].answer,QUESTIONS).progress;
  assert.equal(stats(QUESTIONS,progress).wrong,0);
  assert.equal(stats(QUESTIONS,progress).correct,1);
  assert.equal(stats(QUESTIONS,progress).unanswered,71);
  assert.equal(buildSession(QUESTIONS,{mode:'wrong'},progress).items.length,0);
  assert.equal(buildSession(QUESTIONS,{mode:'bookmarks'},progress).items.length,0);
  assert.equal(restoreSession(JSON.stringify(session),QUESTIONS).items[0].selected,(item.answer+1)%item.choices.length);
  assert.equal(restoreSession('{bad',QUESTIONS),null);
  assert.equal(restoreSession(JSON.stringify({items:[{id:'unknown'}]}),QUESTIONS),null);
  assert.equal(restoreSession(JSON.stringify({...session,position:-1}),QUESTIONS),null);
  assert.deepEqual(readProgress('{bad',QUESTIONS),{});
  assert.deepEqual(readProgress(JSON.stringify({unknown:{correct:true}}),QUESTIONS),{});
  assert.deepEqual(readProgress(JSON.stringify({[item.id]:{correct:'false'}}),QUESTIONS),{});
});

test('a malformed saved answer index is rejected instead of misgrading a correct answer', async()=>{
  const {QUESTIONS}=await import('./bank.mjs');
  const {buildSession,restoreSession}=await import('./logic.mjs');
  const s=buildSession(QUESTIONS,{count:10});
  s.items[0].answer=String(s.items[0].answer);
  assert.equal(restoreSession(JSON.stringify(s),QUESTIONS),null);
});

test('the skip-to-content anchor is not interpreted as a home-tab navigation',async()=>{
  const {tabFromHash}=await import('./logic.mjs');
  assert.equal(typeof tabFromHash,'function');
  assert.equal(tabFromHash('#mainContent'),null);
  assert.equal(tabFromHash('#quiz'),'quiz');
  assert.equal(tabFromHash('#review'),'review');
  assert.equal(tabFromHash('#invalid'),'home');
});
