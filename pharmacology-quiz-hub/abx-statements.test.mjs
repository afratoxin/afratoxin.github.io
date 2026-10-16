import test from 'node:test';
import assert from 'node:assert/strict';
import {ABX_DRUGS,ABX_MECHANISMS,ABX_SIMPLE,ABX_QUESTIONS,pickAbxQuestion} from './abx-data.mjs';
import {QUESTIONS as core} from './abx-core-data.mjs';
import {QUESTIONS as bacterial} from './abx-bacterial-data.mjs';
import {QUESTIONS as extra} from './abx-extra-data.mjs';

const baseCount=ABX_DRUGS.reduce((n,d)=>n+d.targets.length,0);
const nested=[['cellwall','pbp','dala','mycolic','arabinosyl'],['viral_rnap','ns5b'],['dna_pol','rt'],['membrane','ergosterol','pza','atpsynthase'],['pza','atpsynthase'],['dna_damage','gyrase','topo4','dna_pol','rt']];
const keysByLabel=new Map(Object.entries(ABX_MECHANISMS).map(([key,label])=>[label,key]));

test('항생제 두 모드에 기존 문항을 보존하면서 양 극성 판단형을 충분히 추가한다',()=>{
 assert.deepEqual(ABX_QUESTIONS.slice(0,core.length+bacterial.length+extra.length),[...core,...bacterial,...extra]);
 for(const d of ABX_DRUGS)for(const key of d.targets){
  const original=ABX_SIMPLE.find(q=>q.id===`${d.id}:${key}`);
  assert.ok(original);assert.equal(original.stem,`${d.name}의 작용기전은?`);assert.equal(original.answer,ABX_MECHANISMS[key]);
 }
 for(const [kind,bank] of [['simple',ABX_SIMPLE],['general',ABX_QUESTIONS]]){
  const judgments=bank.filter(q=>q.format==='judgment');
  assert.equal(judgments.length,baseCount*2,kind);
  assert.ok(judgments.length/bank.length>=0.6,kind);
  assert.equal(new Set(bank.map(q=>q.id)).size,bank.length,kind);
  assert.equal(judgments.filter(q=>q.polarity==='correct').length,baseCount,kind);
  assert.equal(judgments.filter(q=>q.polarity==='incorrect').length,baseCount,kind);
  for(const d of ABX_DRUGS)for(const key of d.targets)for(const polarity of ['correct','incorrect']){
   const q=judgments.find(q=>q.id===`abx-${kind}-judgment:${d.id}:${key}:${polarity}`);
   assert.ok(q,`${kind} ${d.id} ${key} ${polarity}`);
   assert.equal(q.subject,d.id);assert.equal(q.lecture,d.lecture);assert.equal(q.core,d.core);
  }
 }
});

test('판단형의 다섯 약물·기전 연결은 출처가 있고 다중 표적과 포괄 기전을 오답으로 삼지 않는다',()=>{
 for(const q of [...ABX_SIMPLE,...ABX_QUESTIONS].filter(q=>q.format==='judgment')){
  assert.equal(q.pairs.length,5,q.id);assert.equal(new Set(q.options).size,5,q.id);
  assert.equal(new Set(q.pairs.map(p=>p.left)).size,5,q.id);
  assert.equal(q.pairs.filter(p=>p.valid).length,q.polarity==='correct'?1:4,q.id);
  const expected=q.pairs.find(p=>p.valid===(q.polarity==='correct'));
  assert.equal(q.answer,`${expected.left} — ${expected.right}`,q.id);
  assert.match(q.stem,q.polarity==='correct'?/옳은 것은/:/옳지 않은 것은/,q.id);
  for(const pair of q.pairs){
   const d=ABX_DRUGS.find(d=>d.name===pair.left);assert.ok(d,pair.left);
   assert.equal(pair.source,d.source,q.id);assert.ok(q.details.some(detail=>detail.includes(pair.source)),q.id);
   assert.ok(d.targets.map(k=>ABX_MECHANISMS[k]).includes(pair.correctRight),q.id);
   const right=keysByLabel.get(pair.right);assert.ok(right,q.id);
   assert.equal(d.targets.includes(right),pair.valid,`${q.id}: ${pair.left} — ${pair.right}`);
   if(!pair.valid&&d.id==='sulbactam')assert.notEqual(right,'pbp',q.id);
   if(!pair.valid){
    assert.ok(!['cellwall','membrane','dna_damage','pza','viral_rnap'].includes(right),q.id);
    for(const cluster of nested)if(d.targets.some(t=>cluster.includes(t)))assert.ok(!cluster.includes(right),q.id);
   }
   assert.ok(q.details.some(detail=>detail.startsWith(`${pair.left} — ${pair.right}:`)),q.id);
  }
  if(q.group==='simple')assert.doesNotMatch([q.stem,...q.options,...q.details].join(' '),/적응증|신독성|시신경|B6|치아|23S\s*rRNA|16S\s*rRNA|A\s*site|P\s*site|peptidyl.transferase|translocation/i,q.id);
 }
});

test('항생제 판단형도 섞인 선지와 원문 메타데이터를 함께 반환한다',()=>{
 for(const kind of ['simple','general']){
  const bank=kind==='simple'?ABX_SIMPLE:ABX_QUESTIONS;
  const target=bank.find(q=>q.format==='judgment'&&q.polarity==='incorrect');
  const seen=Object.fromEntries(bank.map(q=>[q.id,q.id===target.id?0:100]));
  const rendered=pickAbxQuestion(kind,{seen},'all','all',()=>0.5,'ordinary');
  assert.equal(rendered.id,target.id);assert.deepEqual(rendered.pairs,target.pairs);
  assert.equal(rendered.choices[rendered.answerIndex].text,rendered.answer);
 }
});
