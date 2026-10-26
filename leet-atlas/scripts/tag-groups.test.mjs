import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {groupTags} from '../tag-groups.mjs';

const archive=JSON.parse(await readFile(new URL('../data/archive.json',import.meta.url),'utf8'));
const tags=archive.taxonomy;
const axes=['domain','field','subject','type','logic','year'];

test('grouping preserves every registered tag exactly once without mutating taxonomy',()=>{
 const before=structuredClone(tags);
 for(const axis of axes) {
  const input=tags.filter(t=>t.axis===axis);
  const groups=groupTags(input,{axis});
  const flattened=groups.flatMap(g=>g.tags);
  assert.equal(new Set(groups.map(g=>g.id)).size,groups.length);
  assert.deepEqual(flattened.map(t=>t.id).sort(),input.map(t=>t.id).sort());
  assert.equal(new Set(flattened.map(t=>t.id)).size,input.length);
  assert.ok(groups.every(g=>g.label&&g.tags.length));
  assert.ok(flattened.every(t=>input.includes(t)));
 }
 assert.deepEqual(tags,before);
});

test('field groups put related legal, formal and natural sciences together',()=>{
 const groups=groupTags(tags,{axis:'field'});
 const containing=label=>groups.find(g=>g.tags.some(t=>t.label===label));
 assert.equal(containing('공법'),containing('형사·증거'));
 assert.equal(containing('철학'),containing('역사학'));
 assert.equal(containing('경제학'),containing('심리학'));
 assert.equal(containing('논리학'),containing('정보과학'));
 assert.equal(containing('물리'),containing('생물'));
 assert.notEqual(containing('철학'),containing('물리'));
});

test('subjects group under their primary parent while retaining all parent metadata',()=>{
 const groups=groupTags(tags,{axis:'subject'});
 const philosophy=groups.find(g=>g.label==='철학');
 assert.ok(philosophy.tags.some(t=>t.label==='인식론'));
 assert.ok(philosophy.tags.some(t=>t.label==='도덕'));
 const shared=groups.flatMap(g=>g.tags).find(t=>t.label==='사회변동');
 assert.deepEqual(shared.parentFields,['역사학','일반사회']);
 assert.ok(groups.find(g=>g.label==='역사학').tags.includes(shared));
});

test('logic and question types form semantic neighborhoods',()=>{
 const logic=groupTags(tags,{axis:'logic'});
 const groupOf=label=>logic.find(g=>g.tags.some(t=>t.label===label));
 assert.equal(groupOf('조건문 연결'),groupOf('대우'));
 assert.equal(groupOf('변수 통제'),groupOf('인과·상관 구별'));
 assert.equal(groupOf('강화·약화'),groupOf('숨은 전제'));
 assert.equal(groupOf('비율·절대량'),groupOf('수식 계산'));
 const types=groupTags(tags,{axis:'type'});
 assert.ok(types.some(g=>g.tags.some(t=>t.label==='관점 비교')&&g.tags.some(t=>t.label==='논증 평가')));
});

test('years show recent decades first and regular 2009 before its preliminary exam',()=>{
 const groups=groupTags(tags,{axis:'year'});
 assert.deepEqual(groups.map(g=>g.label),['2020년대','2010년대','2009학년도·예비시험']);
 assert.deepEqual(groups[0].tags.map(t=>t.label),['2027학년도','2026학년도','2025학년도','2024학년도','2023학년도','2022학년도','2021학년도','2020학년도']);
 assert.deepEqual(groups.at(-1).tags.map(t=>t.label),['2009학년도','2009학년도 예비시험']);
});

test('unseen labels and missing parents remain discoverable with stable fallback groups',()=>{
 const unknown=[{id:'future',axis:'logic',label:'새 논리 기법'},{id:'other',axis:'logic',label:'추가 기법'}];
 const grouped=groupTags(unknown,{axis:'logic'});
 assert.equal(grouped.length,1);
 assert.equal(grouped[0].label,'기타 풀이 논리');
 assert.equal(grouped[0].tags.length,2);
 assert.deepEqual(groupTags([], {axis:'field'}),[]);
 assert.equal(groupTags([{id:'x',axis:'subject',label:'새 소재'}],{axis:'subject'})[0].label,'분야 미지정');
});

test('strengthen refinements form two explicit catalog groups with no duplicates',()=>{
 const input=[
  {id:'logic-strengthen',axis:'logic',label:'강화·약화'},
  {id:'direction',axis:'logic',label:'평가 방향 역전',parentTagId:'logic-strengthen',refinementGroup:'판단상 혼동'},
  {id:'neutral',axis:'logic',label:'관련되지만 중립',parentTagId:'logic-strengthen',refinementGroup:'판단상 혼동'},
  {id:'link',axis:'logic',label:'근거–결론 연결 변화',parentTagId:'logic-strengthen',refinementGroup:'증거의 작용 방식'},
 ];
 const groups=groupTags(input,{axis:'logic'});
 assert.deepEqual(groups.map(g=>g.label),['논증 평가·전제','강화·약화 · 판단상 혼동','강화·약화 · 증거의 작용 방식']);
 assert.deepEqual(groups[1].tags.map(t=>t.id),['direction','neutral']);
 assert.equal(groups.flatMap(g=>g.tags).length,4);
});
