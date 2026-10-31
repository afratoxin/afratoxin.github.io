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
  ]) assert.deepEqual(parseRoute(buildRoute(route)),{...route,tagMode:'auto',query:'',searchMode:'recommend',excludedTags:[]});
});

test('sort defaults to newest and explicit oldest links remain supported', () => {
  assert.equal(parseRoute('#/questions').sort,'newest');
  assert.equal(parseRoute('#/questions?sort=oldest').sort,'oldest');
  assert.equal(parseRoute('#/questions?sort=sideways').sort,'newest');
  assert.equal(parseRoute('#/questions?sort=NEWEST').sort,'newest');
  assert.equal(buildRoute({sort:'oldest'}),'#/questions?sort=oldest');
  assert.equal(buildRoute({sort:'sideways'}),'#/questions');
  assert.deepEqual(ids(filterQuestions(questions)),ids(filterQuestions(questions,{sort:'newest'})));
  assert.deepEqual(ids(filterQuestions(questions,{sort:'sideways'})),ids(filterQuestions(questions,{sort:'newest'})));
});

const searchable = [
  {id:'2601',year:2026,examKey:'2026',number:1,title:'혈액형 비율',text:'학생 집단의 구성 변화를 조사한다.',tags:['math'],confidence:'low'},
  {id:'2401',year:2024,examKey:'2024',number:1,title:'학생 집단 조사',text:'혈액형 비율 변화에 관한 자료이다.',tags:['math'],confidence:'high'},
  {id:'2701',year:2027,examKey:'2027',number:1,title:'학교 건강 조사',text:'혈액형을 조사한 뒤 여러 조건에 따라 학생 비율을 비교한다.',tags:['math'],confidence:'high'},
  {id:'2501',year:2025,examKey:'2025',number:1,title:'추론 규칙',text:'서로 다른 조건의 적용을 비교한다.',tags:['math'],tagReasons:{math:'혈액형 비율'},confidence:'high'},
];

test('accuracy ranks search relevance to question titles and bodies, independently of confidence', () => {
  const before=structuredClone(searchable);
  assert.deepEqual(ids(filterQuestions(searchable,{query:'혈액형 비율',sort:'accuracy'})),['2601','2401','2701','2501']);
  assert.deepEqual(searchable,before);
  assert.deepEqual(ids(filterQuestions(searchable,{query:'혈액형 비율',sort:'newest'})),['2701','2601','2501','2401']);
});

test('accuracy respects filters and uses newest for empty queries or equal relevance', () => {
  const reviews={'2601':{bookmarkColors:['blue'],status:'check'},'2401':{bookmarkColors:['blue'],status:'check'},'2701':{bookmarkColors:['red'],status:'check'}};
  assert.deepEqual(ids(filterQuestions(searchable,{query:'혈액형 비율',sort:'accuracy',tags:['math'],bookmark:'blue',review:'check'},reviews)),['2601','2401']);
  assert.deepEqual(ids(filterQuestions(questions,{query:'   ',sort:'accuracy'})),ids(filterQuestions(questions,{sort:'newest'})));
  assert.deepEqual(ids(filterQuestions(questions,{query:'법률',sort:'accuracy'})),['2701','2702','0902','p001','p002']);
});

test('all three sort choices round trip across list, collection and reader URLs', () => {
  for(const sort of ['oldest','newest','accuracy']) for(const route of [
    {view:'list',id:null},{view:'bookmarks',id:null},{view:'tag',id:'field-law'},{view:'question',id:'2401'},
  ]) {
    const full={...route,tags:['math'],bookmark:'blue',page:2,mode:'paged',sort};
    assert.deepEqual(parseRoute(buildRoute(full)),{...full,tagMode:'auto',query:'',searchMode:'recommend',excludedTags:[]});
  }
});

test('accuracy normalizes Korean spacing, Unicode and case without treating the query as a pattern', () => {
  const items=[
    {id:'2601',year:2026,number:1,title:'학교 조사',text:'ＤＮＡ를 조사하고 메틸화 여부를 비교한다.'},
    {id:'2401',year:2024,number:1,title:'DNA 메틸화',text:''},
  ];
  assert.deepEqual(ids(filterQuestions(items,{query:'dna 메틸화',sort:'accuracy'})),['2401','2601']);
  assert.deepEqual(filterQuestions(items,{query:'[.*]',sort:'accuracy'}),[]);
});

test('pagination applies to the selected chronological order', () => {
  const route = parseRoute('#/questions?sort=newest&page=3');
  const page = paginateQuestions(filterQuestions(questions,route),{...route,pageSize:2});
  assert.deepEqual(ids(page.items),['p001','p002']);
  assert.equal(page.page,3);
  assert.equal(page.pageCount,3);
});
