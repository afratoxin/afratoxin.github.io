import test from 'node:test';
import assert from 'node:assert/strict';
import {filterQuestions,parseRoute,buildRoute} from '../core.mjs';

const questions=[
 {id:'2401',year:2024,examKey:'2024',number:1,title:'권리 논증',tags:['year-2024','law','argument']},
 {id:'2501',year:2025,examKey:'2025',number:1,title:'권리 논증',tags:['year-2025','law','argument']},
 {id:'2601',year:2026,examKey:'2026',number:1,title:'권리 적용',tags:['year-2026','law','application']},
 {id:'2602',year:2026,examKey:'2026',number:2,title:'실험 논증',tags:['year-2026','science','argument']},
 {id:'2701',year:2027,examKey:'2027',number:1,title:'권리 논증',tags:['year-2027','law','argument']},
];
const ids=rows=>rows.map(q=>q.id);

test('OR shows the union of selected years; AND keeps the existing intersection',()=>{
 const options={tags:['year-2025','year-2026','year-2027']};
 assert.deepEqual(ids(filterQuestions(questions,options)),[]);
 assert.deepEqual(ids(filterQuestions(questions,{...options,tagMode:'or'})),['2501','2601','2602','2701']);
 assert.deepEqual(ids(filterQuestions(questions,{tags:['law','argument'],tagMode:'and'})),['2401','2501','2701']);
});

test('empty selections match all in either mode and invalid modes fall back to AND',()=>{
 for(const tagMode of ['and','or'])assert.deepEqual(filterQuestions(questions,{tags:[],tagMode}),questions);
 assert.deepEqual(ids(filterQuestions(questions,{tags:['law','science'],tagMode:'invalid'})),[]);
});

test('required collection tags remain mandatory even when extra tags use OR',()=>{
 const selected=filterQuestions(questions,{requiredTags:['law'],tags:['year-2026','year-2027'],tagMode:'or'});
 assert.deepEqual(ids(selected),['2601','2701']);
 assert.deepEqual(ids(filterQuestions(questions,{requiredTags:['law','argument'],tags:[],tagMode:'or'})),['2401','2501','2701']);
});

test('OR does not broaden query, bookmark, review, or required-tag conditions',()=>{
 const reviews={'2501':{bookmarkColors:['blue'],status:'check'},'2601':{bookmarkColors:['blue'],status:'done'},'2602':{bookmarkColors:['blue'],status:'check'},'2701':{bookmarkColors:['red'],status:'check'}};
 const selected=filterQuestions(questions,{query:'권리',tags:['year-2025','year-2026','year-2027'],tagMode:'or',requiredTags:['law'],bookmark:'blue',review:'check',sort:'newest'},reviews);
 assert.deepEqual(ids(selected),['2501']);
});

test('OR mode round trips tagged list, bookmark, collection, and detail routes',()=>{
 for(const route of [
  {view:'list',id:null,tags:['year-2025','year-2026'],bookmark:'all',page:2,mode:'paged',sort:'newest',tagMode:'or'},
  {view:'bookmarks',id:null,tags:['law','science'],bookmark:'blue',page:1,mode:'scroll',sort:'oldest',tagMode:'or'},
  {view:'tag',id:'field-law',tags:['year-2026','year-2027'],bookmark:'all',page:1,mode:'paged',sort:'newest',tagMode:'or'},
  {view:'question',id:'2601',tags:['law','application'],bookmark:'all',page:3,mode:'paged',sort:'oldest',tagMode:'or'},
 ]) {
  assert.deepEqual(parseRoute(buildRoute(route)),route);
  assert.match(buildRoute(route),/tagMode=or/);
 }
});

test('legacy and malformed URLs default to AND without changing existing links',()=>{
 for(const hash of ['#/questions','#/questions?tagMode=and','#/questions?tagMode=OR','#/questions?tagMode=invalid'])assert.equal(parseRoute(hash).tagMode,'and');
 assert.equal(buildRoute({tagMode:'and'}),'#/questions');
 assert.equal(buildRoute({tagMode:'invalid'}),'#/questions');
});
