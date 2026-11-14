import test from 'node:test';
import assert from 'node:assert/strict';
import {sessionMetrics,practiceLayout,sourcePages} from './practice-layout.mjs';
import fs from 'node:fs';
import {SOURCE_PAGES} from './source-pages.mjs';
import {QUESTIONS} from './bank.mjs';
import {PATH_QUESTIONS} from './pathology-bank.mjs';
import {LECTURE_QUESTIONS,TABLE_QUESTIONS} from './study-bank.mjs';

test('session accuracy counts only graded questions and handles an empty set',()=>{
 assert.deepEqual(sessionMetrics(null),{answered:0,correct:0,wrong:0,total:0,rate:null});
 const session={position:2,items:[{selected:2,answer:2},{selected:0,answer:1},{selected:null,answer:3}]};
 assert.deepEqual(sessionMetrics(session),{answered:2,correct:1,wrong:1,total:3,rate:50});
 assert.equal(sessionMetrics({items:[{selected:null,answer:0}]}).rate,null);
});

test('ungraded workspace cannot reveal explanation, source titles, image paths or answer',()=>{
 const html=practiceLayout({question:'<article>Question</article>',feedback:'',q:{id:'q',pages:[12],sourceRefs:[{doc:'261104_01',pages:[13]}],explanation:'SECRET',choices:['SECRET'],answer:0},session:{items:[{selected:null,answer:0}]},sourceLabel:'SECRET SOURCE'});
 assert.match(html,/practice-layout/);assert.match(html,/학습 현황/);
 assert.doesNotMatch(html,/SECRET|261104_01|source-page-image|evidence-open/);
});

test('graded workspace places feedback after question and includes only cited page previews',()=>{
 const html=practiceLayout({question:'<article>Question</article>',feedback:'<div class="feedback">Answer</div>',q:{id:'q',sourceRefs:[{doc:'261104_01',pages:[13,13]}]},session:{items:[{selected:0,answer:0}]},sourceLabel:'<source>'});
 assert.ok(html.indexOf('<article>Question')<html.indexOf('class="feedback"'));
 assert.match(html,/100%/);assert.match(html,/&lt;source&gt;/);
 assert.equal((html.match(/data-evidence-open=/g)||[]).length,1);
 assert.doesNotMatch(html,/<source>/);
});

test('source references normalize legacy aliases and deduplicate physical pages',()=>{
 assert.deepEqual(sourcePages({sourceRefs:[{doc:'path1',pages:[7,7]},{doc:'261104_02',pages:[7,8]}]}).map(x=>[x.doc,x.page]),[['261104_02',7],['261104_02',8]]);
 assert.deepEqual(sourcePages({pages:[40,40]}).map(x=>[x.doc,x.page]),[['antibiotics',40]]);
 assert.deepEqual(sourcePages({sourceRefs:[{doc:'../../bad',pages:[-1,1]}]}),[]);
});

test('every question has its actual cited page assets and no local source paths are published',()=>{
 const aliases={path1:'261104_02',path2:'261104_03',lab:'261104_05'};
 for(const q of [...QUESTIONS,...PATH_QUESTIONS,...LECTURE_QUESTIONS,...TABLE_QUESTIONS]){
  const refs=q.sourceRefs?.length?q.sourceRefs:[{doc:'antibiotics',pages:q.pages}],keys=new Set(refs.flatMap(ref=>ref.pages.map(page=>`${aliases[ref.doc]||ref.doc}:${page}`)));
  assert.equal(sourcePages(q).length,keys.size,`incomplete evidence for ${q.id}`);
 }
 assert.equal(Object.keys(SOURCE_PAGES).length,415);
 for(const page of Object.values(SOURCE_PAGES)){
  assert.match(page.src,/^assets\/evidence\/[a-z0-9_]+-\d{3}\.webp$/);
  assert.ok(fs.existsSync(new URL(page.src,import.meta.url)),page.src);
  assert.equal(page.width,900);assert.ok(page.height>0);
 }
 assert.doesNotMatch(JSON.stringify(SOURCE_PAGES),/[A-Z]:\\|Dropbox|math6/);
});
