import test from 'node:test';import assert from 'node:assert/strict';
import {SIGNAL_QUESTIONS,pickSignalQuestion} from './signal31-data.mjs';
import {SIMPLE_BANKS,pickSimpleTargetQuestion} from './simple-target-data.mjs';
const high=new Set(['gefitinib','dasatinib','imatinib','sunitinib','cetuximab','trastuzumab','lapatinib','rituximab','alemtuzumab','bevacizumab','tretinoin','gemtuzumab']);
function sample(kind,range='core',graded=true){
 let seed=19531;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32),state={draws:0,seen:{},recent:[],subjects:[],lastGroup:null},counts={};let priority=0,target=0,clinical=0;
 for(let i=0;i<2000;i++){
  const q=kind==='simple'?pickSimpleTargetQuestion('signal-simple',state,range,random):pickSignalQuestion(state,range,'mixed',random);
  priority+=high.has(q.subject);target+=q.kind==='target';clinical+=q.format==='clinical';counts[q.subject]=(counts[q.subject]||0)+1;
  assert.equal(q.choices[q.answerIndex].text,q.answer);assert.ok(!state.recent.includes(q.id));assert.ok(!state.subjects.includes(q.subject));
  state.draws++;if(graded)state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.subjects=[q.subject,...state.subjects].slice(0,3);state.lastGroup=q.group;
 }
 return {priority,target,clinical,counts,state};
}
test('단순 대응·일반형의 기본·전체 범위 모두 족보 핵심 약물 비중을 약 80%로 높인다',()=>{
 for(const kind of ['simple','general'])for(const range of ['core','all']){
  const result=sample(kind,range);assert.ok(result.priority>=1560&&result.priority<=1640,`${kind}/${range}: ${result.priority}/2000`);
  const bank=kind==='simple'?SIMPLE_BANKS['signal-simple']:SIGNAL_QUESTIONS;
  for(const q of bank.filter(q=>range!=='core'||q.core))assert.ok(result.state.seen[q.id],`${kind}/${range}: ${q.id} 회독`);
  if(kind==='general'){assert.equal(result.target,1600);assert.equal(result.clinical,400);}
 }
});
test('여러 표적의 문항 수 때문에 다사티닙이 게피티닙보다 네 배씩 나오지 않는다',()=>{
 for(const graded of [true,false]){const {counts,priority}=sample('simple','core',graded);const ratio=counts.dasatinib/counts.gefitinib;
  assert.ok(ratio>=0.75&&ratio<=1.35,`graded=${graded}: Dasatinib/Gefitinib=${ratio}`);assert.ok(priority>=1560&&priority<=1640);
 }
});
test('족보 우선순위에 기출 근거를 남기고 새 출제는 풀이 기록을 임의로 수정하지 않는다',async()=>{
 const api=await import('./signal31-priority.mjs').catch(()=>({}));assert.ok(api.SIGNAL_EXAM_PRIORITY);
 assert.deepEqual(Object.keys(api.SIGNAL_EXAM_PRIORITY).sort(),[...high].sort());for(const d of Object.values(api.SIGNAL_EXAM_PRIORITY))assert.ok(d.sources.length&&d.weight>0);
 const state={draws:0,seen:{},recent:[],subjects:[]},before=JSON.stringify(state);pickSignalQuestion(state);pickSimpleTargetQuestion('signal-simple',state);assert.equal(JSON.stringify(state),before);
});
