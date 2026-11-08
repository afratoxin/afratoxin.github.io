import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildSession,grade,stats,tabFromHash,restoreSession} from './logic.mjs';
import {QUESTIONS as ABX} from './bank.mjs';

test('pathology has all three requested question styles with physical label-free photo assets',async()=>{
  assert.ok(fs.existsSync(new URL('./pathology-bank.mjs',import.meta.url)),'pathology bank is missing');
  const {PATH_QUESTIONS,PHOTOS}=await import('./pathology-bank.mjs');
  assert.equal(PATH_QUESTIONS.length,80);
  assert.equal(new Set(PATH_QUESTIONS.map(q=>q.id)).size,80);
  for(const [topic,count] of [['path-image',24],['path-traits',32],['path-general',24]])assert.equal(PATH_QUESTIONS.filter(q=>q.topic===topic).length,count);
  for(const q of PATH_QUESTIONS){
    assert.equal(q.format,'mcq');assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);
    assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation);assert.equal(q.choiceNotes.length,5);assert.ok(q.choiceNotes.every(Boolean));
    assert.ok(q.sourceRefs.length);assert.ok(q.sourceRefs.every(s=>['path1','path2','lab'].includes(s.doc)&&s.pages.length));
    if(q.topic==='path-image')assert.ok(q.photos.length);
    for(const id of q.photos){const im=PHOTOS[id];assert.ok(im);assert.match(im.src,/^assets\/pathology\/figure-\d+\.webp$/);assert.ok(fs.existsSync(new URL(im.src,import.meta.url)),im.src);assert.ok(!im.alt.includes(q.choices[q.answer]));}
    if(q.topic!=='path-image')assert.ok(['correct','incorrect'].includes(q.ask));
  }
});

test('bookmark storage updates preserve known pathology IDs and safely handle clear/corrupt events',async()=>{
 const {readBookmarks}=await import('./logic.mjs');
 assert.equal(typeof readBookmarks,'function');
 const {PATH_QUESTIONS}=await import('./pathology-bank.mjs');
 const [a,b]=PATH_QUESTIONS;
 const first=readBookmarks(JSON.stringify([a.id]),PATH_QUESTIONS);
 const refreshed=readBookmarks(JSON.stringify([...first,b.id,a.id,'unknown']),PATH_QUESTIONS);
 assert.deepEqual(refreshed,[a.id,b.id]);
 assert.deepEqual(readBookmarks(null,PATH_QUESTIONS),[]);
 assert.deepEqual(readBookmarks('{bad',PATH_QUESTIONS),[]);
});

test('pathology routing is independent and old antibiotic progress remains untouched',async()=>{
  assert.equal(tabFromHash('#pathology'),'pathology');
  const {PATH_QUESTIONS}=await import('./pathology-bank.mjs');
  assert.ok(PATH_QUESTIONS.every(q=>!ABX.some(a=>a.id===q.id)));
  const abxProgress={[ABX[0].id]:{correct:false}};
  const p=buildSession(PATH_QUESTIONS,{topic:'path-image',count:10},{},()=>0.4);
  for(const item of p.items){const q=PATH_QUESTIONS.find(q=>q.id===item.id);assert.equal(item.choices[item.answer],q.choices[q.answer]);}
  let progress=grade(p,{},0,(p.items[0].answer+1)%5,PATH_QUESTIONS).progress;
  assert.equal(stats(PATH_QUESTIONS,progress).wrong,1);
  const retry=buildSession(PATH_QUESTIONS,{mode:'wrong'},progress);
  progress=grade(retry,progress,0,retry.items[0].answer,PATH_QUESTIONS).progress;
  assert.equal(stats(PATH_QUESTIONS,progress).wrong,0);
  assert.equal(stats(PATH_QUESTIONS,progress).total,80);
  assert.equal(stats(ABX,abxProgress).wrong,1);
  assert.equal(restoreSession(JSON.stringify(p),PATH_QUESTIONS).items.length,10);
});
