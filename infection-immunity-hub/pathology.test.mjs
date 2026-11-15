import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildSession,grade,stats,tabFromHash,restoreSession} from './logic.mjs';
import {QUESTIONS as ABX} from './bank.mjs';

test('pathology has all three requested question styles with physical label-free photo assets',async()=>{
  assert.ok(fs.existsSync(new URL('./pathology-bank.mjs',import.meta.url)),'pathology bank is missing');
  const {PATH_QUESTIONS,PHOTOS}=await import('./pathology-bank.mjs');
  assert.equal(PATH_QUESTIONS.length,86);
  assert.equal(new Set(PATH_QUESTIONS.map(q=>q.id)).size,86);
  for(const [topic,count] of [['path-image',32],['path-traits',32],['path-general',22]])assert.equal(PATH_QUESTIONS.filter(q=>q.topic===topic).length,count);
  for(const q of PATH_QUESTIONS){
    assert.equal(q.format,'mcq');assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);
    assert.ok(q.answer>=0&&q.answer<5);assert.ok(q.explanation);assert.equal(q.choiceNotes.length,5);assert.ok(q.choiceNotes.every(Boolean));
    assert.ok(q.sourceRefs.length);assert.ok(q.sourceRefs.every(s=>['path1','path2','lab'].includes(s.doc)&&s.pages.length));
    if(q.topic==='path-image')assert.ok(q.photos.length);
    for(const id of q.photos){const im=PHOTOS[id];assert.ok(im);assert.match(im.src,/^assets\/pathology\/(?:figure-\d+|edu-\d{2}(?:-detail)?)\.webp$/);assert.ok(fs.existsSync(new URL(im.src,import.meta.url)),im.src);assert.ok(!im.alt.includes(q.choices[q.answer]));}
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
  assert.equal(stats(PATH_QUESTIONS,progress).total,86);
  assert.equal(stats(ABX,abxProgress).wrong,1);
  assert.equal(restoreSession(JSON.stringify(p),PATH_QUESTIONS).items.length,10);
});


test('active pathology omits protozoa, helminths and arthropods while retaining fungal PCP',async()=>{
 const {PATH_QUESTIONS,PHOTOS}=await import('./pathology-bank.mjs');
 const excluded=/원충|기생충|절지|Entamoeba|Trichomonas|Paragonimus|Taenia|Demodex|Sarcoptes|낭미충|옴진드기|아메바|충란|흡반|두절|모낭충|폐흡충|scabies/i;
 assert.ok(!excluded.test(JSON.stringify(PATH_QUESTIONS)),'excluded organisms remain in active pathology data');
 for(let n=19;n<=24;n++)assert.ok(!PATH_QUESTIONS.some(q=>q.id==='path-image-'+n));
 assert.ok(!PATH_QUESTIONS.some(q=>/^path-general-(21|22)-/.test(q.id)));
 assert.deepEqual(Object.keys(PHOTOS).filter(id=>/^p\d+$/.test(id)),Array.from({length:24},(_,n)=>'p'+String(n+1).padStart(2,'0')));
 assert.equal(Object.keys(PHOTOS).length,41);
 assert.equal(Object.keys(PHOTOS).filter(id=>/^edu-/.test(id)).length,17);
 assert.ok(PATH_QUESTIONS.some(q=>q.choices[q.answer].includes('Pneumocystis')));
 assert.ok(PATH_QUESTIONS.some(q=>q.id==='path-image-01'));
 for(const id of ['path-image-08','path-image-11','path-image-13','path-image-16','path-general-09-q3','path-general-10-q3','path-general-19-q3'])assert.ok(!PATH_QUESTIONS.some(q=>q.id===id),'changed choices need a new ID: '+id);
});


test('lecture and library scopes share unique IDs and restore a library-only filter',async()=>{
 const {PATH_QUESTIONS,PHOTOS}=await import('./pathology-bank.mjs');
 const {pathologyFilters}=await import('./pathology-ui.mjs');
 const lectures=PATH_QUESTIONS.filter(q=>q.sourceScope==='lecture'),library=PATH_QUESTIONS.filter(q=>q.sourceScope==='library');
 assert.equal(lectures.length,72);assert.equal(library.length,14);
 assert.equal(new Set(PATH_QUESTIONS.map(q=>q.id)).size,86);
 assert.ok(lectures.some(q=>q.id==='path-image-01'));
 assert.ok(library.every(q=>q.id.startsWith('path-edu-v2-')));
 const f=pathologyFilters('library','unanswered',0);
 assert.equal(f.sourceScope,'library');assert.equal(f.topic,'all');assert.equal(f.questionIds.length,14);
 const session=buildSession(PATH_QUESTIONS,f,{},()=>0.5);
 assert.equal(session.items.length,14);assert.ok(session.items.every(q=>q.id.startsWith('path-edu-')));
 const restored=restoreSession(JSON.stringify(session),PATH_QUESTIONS);assert.equal(restored.filters.sourceScope,'library');
 assert.ok(!pathologyFilters('path-traits').questionIds);
 for(const q of library){assert.ok(q.photos.every(id=>PHOTOS[id]));assert.ok(q.externalRefs.some(r=>r.url==='https://pathedu.snu.ac.kr/library'));}
});

test('library captions and graded source links use public attribution',async()=>{
 const {PHOTOS,PATH_QUESTIONS}=await import('./pathology-bank.mjs');
 const {photoSourceLabel,imageMarkup,pathFeedback}=await import('./pathology-ui.mjs');
 assert.equal(photoSourceLabel(PHOTOS['edu-01']),'PathEdu · 슬라이드 1');
 const q=PATH_QUESTIONS.find(q=>q.id==='path-edu-v2-cmv');
 const image=imageMarkup(q);assert.match(image,/PathEdu · 슬라이드 3/);assert.doesNotMatch(image,/undefined|PathEdu PDF/);
 const html=pathFeedback({...q,externalRefs:[...q.externalRefs,{title:'private',url:'https://pathedu.snu.ac.kr/library?classFileKey=secret'}]},true);
 assert.match(html,/https:\/\/pathedu.snu.ac.kr\/library/);assert.doesNotMatch(html,/classFileKey|secret|>private</);
});
