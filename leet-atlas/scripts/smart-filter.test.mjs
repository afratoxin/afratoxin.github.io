import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as core from '../core.mjs';

const {filterQuestions,paginateQuestions,parseRoute,buildRoute}=core;
const {questions,taxonomy}=JSON.parse(await readFile(new URL('../data/archive.json',import.meta.url),'utf8'));
const taxonomyMap=new Map(taxonomy.map(tag=>[tag.id,tag]));
const Y2025='year-abefd8a26e',Y2026='year-750655310c';
const PRELIMINARY='year-220e7b197d',Y2009='year-c68ff39a4f';
const PUZZLE='type-4536b24c5d';
const ids=rows=>rows.map(question=>question.id);
const select=(tags,options={},reviews={})=>filterQuestions(questions,{sort:'oldest',taxonomy,tags,...options},reviews);
const canonicalGroups=groups=>groups.map(group=>({...group,tags:[...group.tags].sort()})).sort((a,b)=>a.axis.localeCompare(b.axis));

test('2026 and puzzle select exactly the three matching archive questions',()=>{
 assert.deepEqual(ids(select([Y2026,PUZZLE])),['2632','2633','2634']);
});

test('2025 or 2026 remains intersected with the puzzle type',()=>{
 assert.deepEqual(ids(select([Y2025,Y2026,PUZZLE])),['2512','2533','2534','2535','2632','2633','2634']);
});

for(const {axis,tags,want} of [
 {axis:'field',tags:['field-e76d2ef356','field-c2de884ea9'],want:['2632','2634']},
 {axis:'subject',tags:['subject-bba3261cef','subject-913be1770a'],want:['2632']},
 {axis:'type',tags:[PUZZLE,'type-05762b8c50'],want:['2633']},
 {axis:'logic',tags:['logic-cases','logic-09ba3f99df'],want:['2534','2625','2632','2634']},
])test(`overlapping ${axis} tags must all be present despite the year alternatives`,()=>{
 assert.deepEqual(ids(select([Y2025,Y2026,...tags])),want);
});

test('different nonyear axes all constrain the selected year union',()=>{
 assert.deepEqual(ids(select([Y2025,Y2026,'field-e76d2ef356',PUZZLE,'logic-cases'])),['2533','2534','2535','2632','2634']);
});

test('preliminary and regular 2009 are separate year alternatives with chronological order',()=>{
 const tags=[PRELIMINARY,Y2009,PUZZLE];
 assert.deepEqual(ids(select(tags)),['p003','p013','p016','p031','p033','p036','p037','p040','0905','0906','0912','0913','0924','0926']);
 assert.deepEqual(ids(select(tags,{sort:'newest'})),['0905','0906','0912','0913','0924','0926','p003','p013','p016','p031','p033','p036','p037','p040']);
});

test('taxonomy array and ID map give the same automatic filter behavior',()=>{
 const tags=[Y2025,Y2026,PUZZLE];
 for(const source of [taxonomy,taxonomyMap])assert.deepEqual(ids(select(tags,{taxonomy:source})),['2512','2533','2534','2535','2632','2633','2634']);
});

test('missing taxonomy metadata keeps tags mandatory without guessing from year prefixes',()=>{
 const sample=questions.filter(question=>['2533','2632','2633'].includes(question.id)).map(question=>({...question,tags:[...question.tags,...(question.id==='2632'?['year-unregistered']:[])]}));
 for(const source of [taxonomy,taxonomyMap]) {
  assert.deepEqual(ids(filterQuestions(sample,{taxonomy:source,tags:[Y2025,Y2026,'year-unregistered',PUZZLE]})),['2632']);
  assert.deepEqual(filterQuestions(sample,{taxonomy:source,tags:[Y2025,Y2026,'year-missing',PUZZLE]}),[]);
 }
 assert.deepEqual(ids(filterQuestions(questions,{tags:[Y2026,PUZZLE]})),['2632','2633','2634']);
 assert.deepEqual(filterQuestions(questions,{tags:[Y2025,Y2026,PUZZLE]}),[]);
});

test('metadata identifies year alternatives even when their IDs lack a year prefix',()=>{
 const renamedTaxonomy=taxonomy.map(tag=>tag.id===Y2025?{...tag,id:'exam-a'}:tag.id===Y2026?{...tag,id:'exam-b'}:tag);
 const renamedQuestions=questions.map(question=>({...question,tags:question.tags.map(tag=>tag===Y2025?'exam-a':tag===Y2026?'exam-b':tag)}));
 assert.deepEqual(ids(filterQuestions(renamedQuestions,{sort:'oldest',taxonomy:renamedTaxonomy,tags:['exam-a','exam-b',PUZZLE]})),['2512','2533','2534','2535','2632','2633','2634']);
});

test('year alternatives preserve query, bookmark, review, and explicit required-tag restrictions',()=>{
 const reviews={'2632':{bookmarkColors:['blue'],status:'check'},'2633':{bookmarkColors:['red'],status:'done'}};
 const options={query:'지원자별 두',bookmark:'blue',review:'check',requiredTags:['field-c2de884ea9']};
 assert.deepEqual(ids(select([Y2025,Y2026,PUZZLE],options,reviews)),['2632']);
 assert.deepEqual(select([Y2025,Y2026,PUZZLE],{...options,bookmark:'red'},reviews),[]);
 assert.deepEqual(select([Y2025,Y2026,PUZZLE],{...options,review:'done'},reviews),[]);
 assert.deepEqual(select([Y2025,Y2026,PUZZLE],{...options,query:'없는 검색어'},reviews),[]);
 assert.deepEqual(select([Y2025,Y2026,PUZZLE],{...options,requiredTags:['field-5cb33dc666']},reviews),[]);
});

test('sorting and pagination apply after automatic selection without mutating the archive',()=>{
 const before=questions.map(question=>question.id);
 const selected=select([Y2025,Y2026,PUZZLE],{sort:'newest'});
 assert.deepEqual(ids(selected),['2632','2633','2634','2512','2533','2534','2535']);
 const page=paginateQuestions(selected,{page:2,pageSize:3});
 assert.deepEqual(ids(page.items),['2512','2533','2534']);
 assert.equal(page.total,7);
 assert.equal(page.pageCount,3);
 assert.equal(page.from,4);
 assert.equal(page.to,6);
 const clamped=paginateQuestions(selected,{page:99,pageSize:3});
 assert.deepEqual(ids(clamped.items),['2535']);
 assert.equal(clamped.page,3);
 assert.deepEqual(ids(paginateQuestions(selected,{mode:'scroll',page:3,pageSize:3}).items),['2632','2633','2634','2512','2533','2534','2535']);
 assert.deepEqual(questions.map(question=>question.id),before);
});

test('filter groups describe OR years and AND operators for every other selected axis',()=>{
 assert.equal(typeof core.tagFilterGroups,'function','core exports the shared automatic tag-group description');
 const tags=[Y2025,PUZZLE,'logic-cases',Y2026,'logic-09ba3f99df','field-e76d2ef356','field-c2de884ea9'];
 const want=[
  {axis:'field',operator:'and',tags:['field-c2de884ea9','field-e76d2ef356']},
  {axis:'logic',operator:'and',tags:['logic-09ba3f99df','logic-cases']},
  {axis:'type',operator:'and',tags:[PUZZLE]},
  {axis:'year',operator:'or',tags:[Y2026,Y2025].sort()},
 ];
 for(const source of [taxonomy,taxonomyMap])assert.deepEqual(canonicalGroups(core.tagFilterGroups(tags,source)),want);
 assert.deepEqual(core.tagFilterGroups([],taxonomy),[]);
 const unknown=core.tagFilterGroups(['year-unregistered'],taxonomy);
 assert.equal(unknown.length,1);
 assert.equal(unknown[0].operator,'and');
 assert.deepEqual(unknown[0].tags,['year-unregistered']);
});

test('old global-mode links migrate without losing their selected tags or list position',()=>{
 for(const mode of ['or','and','invalid']) {
  const route=parseRoute(`#/questions?tag=${Y2025}&tag=${Y2026}&tag=${PUZZLE}&tagMode=${mode}&sort=newest&page=2`);
  assert.equal(route.tagMode,mode==='or'?'or':'auto');
  assert.equal(route.page,2);
  assert.equal(route.sort,'newest');
  assert.deepEqual(ids(filterQuestions(questions,{...route,taxonomy})),['2632','2633','2634','2512','2533','2534','2535']);
  const canonical=buildRoute(route);
  assert.equal(new URLSearchParams(canonical.split('?')[1]).has('tagMode'),mode==='or');
  assert.deepEqual(parseRoute(canonical),route);
 }
});
