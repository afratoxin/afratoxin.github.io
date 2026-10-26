import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const catalog=JSON.parse(readFileSync(new URL('../data/catalog.json',import.meta.url),'utf8'));

test('최근 17회 전136문항과 나형15회 117문항을 중복 없이 수록',()=>{
  const recent=catalog.items.filter(x=>x.source==='recent'),legacy=catalog.items.filter(x=>x.source==='legacy');
  assert.equal(recent.length,136);assert.equal(legacy.length,117);
  assert.equal(new Set(catalog.items.map(x=>x.id)).size,253);
  const exams=new Map();
  for(const x of recent){const key=x.id.split('-')[0];if(!exams.has(key))exams.set(key,[]);exams.get(key).push(x.question);}
  assert.equal(exams.size,17);
  for(const qs of exams.values())assert.deepEqual(qs.sort((a,b)=>a-b),[23,24,25,26,27,28,29,30]);
  assert.equal(new Set(legacy.map(x=>x.id.split('-')[0])).size,15);
});
test('모든 문항에 검증 가능한 원본 위치와 실제 조건이 있다',()=>{
  const families=new Set(catalog.families.map(x=>x.id));assert.equal(families.size,13);
  for(const item of catalog.items){
    assert.ok(families.has(item.family),item.id);
    assert.ok(item.exam&&item.summary&&item.insight,item.id);
    assert.ok(Number.isInteger(item.pdfPage)&&item.pdfPage>=1&&item.pdfPage<=(item.source==='recent'?68:360),item.id);
    assert.ok(Number.isInteger(item.academicYear)&&item.session,item.id);
    assert.ok(Array.isArray(item.conditions)&&item.conditions.length>0,item.id);
    assert.ok(Array.isArray(item.parameters)&&item.parameters.length>0,item.id);
  }
});
test('실제 관찰한 조건과 제안 조건을 구분한다',()=>{
  for(const f of catalog.families){
    for(const key of ['observedConditions','proposedConditions','differences'])assert.ok(Array.isArray(f[key])&&f[key].length>0,`${f.id}/${key}`);
    assert.ok(catalog.items.some(x=>x.family===f.id));
  }
  assert.equal(catalog.coverage.recent.items,136);assert.equal(catalog.coverage.legacy.items,117);
});
test('표본평균 분포와 신뢰구간을 구분한다',()=>{
  for(const id of ['1811-na-15','1809-na-27','2109-na-12','2111-na-11'])assert.equal(catalog.items.find(x=>x.id===id)?.family,'normal',id);
});
