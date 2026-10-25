import test from 'node:test';
import assert from 'node:assert/strict';
import {filterQuestions, paginateQuestions, parseRoute, buildRoute} from '../core.mjs';

const questions = [
  {id:'2702',year:2027,examKey:'2027',number:2,title:'법률 적용',tags:['law']},
  {id:'0902',year:2009,examKey:'2009',number:2,title:'법률 적용',tags:['law']},
  {id:'p002',year:2009,examKey:'preliminary',number:2,title:'법률 적용',tags:['law']},
  {id:'2701',year:2027,examKey:'2027',number:1,title:'법률 적용',tags:['law']},
  {id:'p001',year:2009,examKey:'preliminary',number:1,title:'법률 적용',tags:['law']},
  {id:'0901',year:2009,examKey:'2009',number:1,title:'과학 실험',tags:['science']},
];
const ids = rows => rows.map(question => question.id);

test('chronological sort changes exam order while keeping question numbers ascending', () => {
  const before = [...questions];
  assert.deepEqual(ids(filterQuestions(questions,{sort:'oldest'})),['p001','p002','0901','0902','2701','2702']);
  assert.deepEqual(ids(filterQuestions(questions,{sort:'newest'})),['2701','2702','0901','0902','p001','p002']);
  assert.deepEqual(questions,before,'sorting must not mutate the source array');
});

test('newest ordering retains tag, query, bookmark and review intersections', () => {
  const reviews = {
    '2701':{bookmarkColors:['blue'],status:'check'},
    '2702':{bookmarkColors:['red'],status:'check'},
    '0902':{bookmarkColors:['blue'],status:'check'},
    'p002':{bookmarkColors:['blue'],status:'done'},
  };
  const selected = filterQuestions(questions,{sort:'newest',query:'법률',tags:['law'],bookmark:'blue',review:'check'},reviews);
  assert.deepEqual(ids(selected),['2701','0902']);
});

test('sort URLs round trip list, tag, bookmark and question pages', () => {
  for (const route of [
    {view:'list',id:null,tags:[],bookmark:'all',page:3,mode:'paged',sort:'newest'},
    {view:'tag',id:'logic-대우',tags:['law'],bookmark:'all',page:2,mode:'paged',sort:'newest'},
    {view:'bookmarks',id:null,tags:[],bookmark:'blue',page:1,mode:'scroll',sort:'newest'},
    {view:'question',id:'2701',tags:['law'],bookmark:'all',page:2,mode:'paged',sort:'newest'},
  ]) assert.deepEqual(parseRoute(buildRoute(route)),{...route,tagMode:'auto'});
});

test('sort defaults to oldest and invalid URL values cannot change the default', () => {
  assert.equal(parseRoute('#/questions').sort,'oldest');
  assert.equal(parseRoute('#/questions?sort=oldest').sort,'oldest');
  assert.equal(parseRoute('#/questions?sort=sideways').sort,'oldest');
  assert.equal(parseRoute('#/questions?sort=NEWEST').sort,'oldest');
  assert.equal(buildRoute({sort:'oldest'}),'#/questions');
  assert.equal(buildRoute({sort:'sideways'}),'#/questions');
  assert.deepEqual(ids(filterQuestions(questions)),ids(filterQuestions(questions,{sort:'oldest'})));
  assert.deepEqual(ids(filterQuestions(questions,{sort:'sideways'})),ids(filterQuestions(questions,{sort:'oldest'})));
});

test('pagination applies to the selected chronological order', () => {
  const route = parseRoute('#/questions?sort=newest&page=3');
  const page = paginateQuestions(filterQuestions(questions,route),{...route,pageSize:2});
  assert.deepEqual(ids(page.items),['p001','p002']);
  assert.equal(page.page,3);
  assert.equal(page.pageCount,3);
});
