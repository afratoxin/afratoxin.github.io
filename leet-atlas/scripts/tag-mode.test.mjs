import test from 'node:test';
import assert from 'node:assert/strict';
import {filterQuestions,parseRoute,buildRoute} from '../core.mjs';

const taxonomy=[
 ...[2024,2025,2026,2027].map(year=>({id:`year-${year}`,axis:'year'})),
 {id:'law',axis:'field'},{id:'science',axis:'field'},
 {id:'argument',axis:'type'},{id:'application',axis:'type'},
];
const questions=[
 {id:'2401',year:2024,examKey:'2024',number:1,title:'권리 논증',tags:['year-2024','law','argument']},
 {id:'2501',year:2025,examKey:'2025',number:1,title:'권리 논증',tags:['year-2025','law','argument']},
 {id:'2601',year:2026,examKey:'2026',number:1,title:'권리 적용',tags:['year-2026','law','application']},
 {id:'2602',year:2026,examKey:'2026',number:2,title:'실험 논증',tags:['year-2026','science','argument']},
 {id:'2701',year:2027,examKey:'2027',number:1,title:'권리 논증',tags:['year-2027','law','argument']},
];
const ids=rows=>rows.map(q=>q.id);

test('automatic filtering unions years while intersecting selected nonyear tags',()=>{
 assert.deepEqual(ids(filterQuestions(questions,{sort:'oldest',taxonomy,tags:['year-2025','year-2026','year-2027']})),['2501','2601','2602','2701']);
 assert.deepEqual(ids(filterQuestions(questions,{sort:'oldest',taxonomy,tags:['year-2025','year-2026','year-2027','law','argument']})),['2501','2701']);
 assert.deepEqual(ids(filterQuestions(questions,{sort:'oldest',taxonomy,tags:['law','science']})),[]);
});

test('optional OR operates within each axis while cross-axis and required restrictions remain strict',()=>{
 for(const tagMode of ['and','or','auto','invalid']) {
  assert.deepEqual(ids(filterQuestions(questions,{sort:'oldest',taxonomy,tags:['year-2025','year-2026','law'],tagMode})),['2501','2601']);
  assert.deepEqual(ids(filterQuestions(questions,{sort:'oldest',taxonomy,tags:['law','argument'],tagMode})),['2401','2501','2701']);
  assert.deepEqual(filterQuestions(questions,{sort:'oldest',taxonomy,tags:[],tagMode}),questions);
 }
 assert.deepEqual(ids(filterQuestions(questions,{sort:'oldest',taxonomy,tags:['law','science','argument'],tagMode:'or'})),['2401','2501','2602','2701']);
 assert.deepEqual(ids(filterQuestions(questions,{sort:'oldest',taxonomy,tags:['law','science','argument'],tagMode:'auto'})),[]);
});

test('explicit required tags remain unconditional intersections',()=>{
 assert.deepEqual(ids(filterQuestions(questions,{sort:'oldest',taxonomy,requiredTags:['law'],tags:['year-2026','year-2027']})),['2601','2701']);
 assert.deepEqual(ids(filterQuestions(questions,{sort:'oldest',taxonomy,requiredTags:['law','argument'],tags:[]})),['2401','2501','2701']);
 assert.deepEqual(filterQuestions(questions,{sort:'oldest',taxonomy,requiredTags:['year-2025'],tags:['year-2026','year-2027']}),[]);
 assert.deepEqual(filterQuestions(questions,{sort:'oldest',taxonomy,requiredTags:['year-2025','year-2026']}),[]);
});

test('automatic year alternatives do not broaden query, bookmark, or review conditions',()=>{
 const reviews={'2501':{bookmarkColors:['blue'],status:'check'},'2601':{bookmarkColors:['blue'],status:'done'},'2602':{bookmarkColors:['blue'],status:'check'},'2701':{bookmarkColors:['red'],status:'check'}};
 const selected=filterQuestions(questions,{sort:'oldest',taxonomy,query:'권리',tags:['year-2025','year-2026','year-2027'],requiredTags:['law'],bookmark:'blue',review:'check',sort:'newest'},reviews);
 assert.deepEqual(ids(selected),['2501']);
});

test('canonical tagged routes round trip while retaining only the optional OR mode',()=>{
 for(const route of [
  {view:'list',id:null,tags:['year-2025','year-2026'],bookmark:'all',page:2,mode:'paged',sort:'newest'},
  {view:'bookmarks',id:null,tags:['law','science'],bookmark:'blue',page:1,mode:'scroll',sort:'oldest'},
  {view:'tag',id:'field-law',tags:['year-2026','year-2027'],bookmark:'all',page:1,mode:'paged',sort:'newest'},
  {view:'question',id:'2601',tags:['law','application'],bookmark:'all',page:3,mode:'paged',sort:'oldest'},
 ]) {
  for(const tagMode of ['auto','and','or','invalid',undefined]) {
   const hash=buildRoute({...route,tagMode});
   assert.deepEqual(parseRoute(hash),{...route,tagMode:tagMode==='or'?'or':'auto',query:'',searchMode:'recommend',excludedTags:[]});
   assert.equal(new URLSearchParams(hash.split('?')[1]).has('tagMode'),tagMode==='or');
  }
 }
});

test('invalid mode URLs normalize to automatic filtering while explicit OR persists',()=>{
 for(const value of ['', 'and','or','OR','invalid','auto']) {
  const route=parseRoute(`#/questions?tag=year-2025&tag=year-2026&tag=law&tagMode=${value}&sort=newest&page=2`);
  assert.equal(route.tagMode,value==='or'?'or':'auto');
  assert.deepEqual(route.tags,['year-2025','year-2026','law']);
  assert.equal(route.sort,'newest');
  assert.equal(route.page,2);
  assert.equal(buildRoute(route).includes('tagMode='),value==='or');
  assert.deepEqual(ids(filterQuestions(questions,{...route,taxonomy})),['2601','2501']);
 }
 assert.equal(parseRoute('#/questions').tagMode,'auto');
 assert.equal(buildRoute({tagMode:'or'}),'#/questions?tagMode=or');
});
