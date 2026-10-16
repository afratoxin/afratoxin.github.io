import test from 'node:test';import assert from 'node:assert/strict';
import {SIMPLE_BANKS,pickSimpleTargetQuestion} from './simple-target-data.mjs';
test('세 단순 매칭 세트는 직접 매칭을 보존하며 같은 표적 범위의 정·오 연결형을 두 배 추가한다',()=>{
 for(const [scope,bank]of Object.entries(SIMPLE_BANKS)){
  const direct=bank.filter(q=>q.format!=='judgment'),judged=bank.filter(q=>q.format==='judgment');assert.equal(judged.length,direct.length*2,scope);
  const truth=Object.fromEntries(direct.map(q=>[q.id,q.validTargets]));
  assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
  for(const q of judged){assert.equal(q.options.length,5);assert.equal(new Set(q.pairs.map(p=>p.left)).size,5);assert.ok(q.details.includes(q.lectureNote));
   for(const p of q.pairs){assert.ok(truth[p.entity],p.entity);assert.equal(p.valid,truth[p.entity].includes(p.right),scope+p.left+p.right);}
   const selected=q.pairs.filter(p=>p.valid===(q.polarity==='correct'));assert.equal(selected.length,1);assert.equal(q.answer,selected[0].left+' — '+selected[0].right);
  }
 }
});
test('실제 단순 매칭 회독의 과반이 판별형이며 두 발문과 모든 정답 위치를 사용한다',()=>{
 let seed=302;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
 for(const scope of Object.keys(SIMPLE_BANKS)){
  const state={seen:{},recent:[],subjects:[]};let judgments=0;const polarities=new Set(),positions=new Set();
  for(let i=0;i<1000;i++){const q=pickSimpleTargetQuestion(scope,state,'all',random);assert.equal(q.choices[q.answerIndex].text,q.answer);if(q.format==='judgment'){judgments++;polarities.add(q.polarity);positions.add(q.answerIndex);}
   state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.subjects=[q.subject,...state.subjects].slice(0,3);
  }
  assert.ok(judgments>=550,scope+judgments);assert.equal(polarities.size,2);assert.equal(positions.size,5);
 }
});
