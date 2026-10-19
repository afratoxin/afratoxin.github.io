import test from 'node:test';
import assert from 'node:assert/strict';
import * as pk from './pk-calculations.mjs';
const {PK_TOPICS,PK_VARIANTS,makePkQuestion,pickPkTopic}=pk;
let seed=314159;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
function reference(q){
 const p=q.parameters;
 switch(q.topic){
 case 'ke':return q.variant==='slope'?(p.logC1-p.logC2)/(p.t2-p.t1):p.clearance/p.volume;
 case 'half':return q.variant==='fromKe'?.693/p.ke:.693*p.volume/p.clearance;
 case 'volume':return q.variant==='ratio'?p.weight*p.mgPerKg/p.c0:p.dose/p.c0;
 case 'clearance':return (q.variant==='oral'?p.f:1)*p.dose/p.auc;
 case 'bio':return p.aucOral*p.doseIv/(p.aucIv*p.doseOral)*100;
 case 'auc':return (p.concentrations[0]+p.concentrations[1])*(p.times[1]-p.times[0])/2;
 case 'tail':return p.clast/p.ke+(q.variant==='total'?p.aucObserved:0);
 case 'concentration':return p.rate/p.clearance;
 case 'infusion':return p.target*p.clearance;
 case 'loading':return p.target*p.volume;
 default:throw Error(q.topic);
 }
}
test('승인한 10유형은 숫자 선지와 짧은 상황 발문만 출제하며 8,000개 수치를 독립 검증',()=>{
 assert.deepEqual(PK_TOPICS.map(t=>t.id),['ke','half','volume','clearance','bio','auc','tail','concentration','infusion','loading']);
 assert.equal(Object.values(PK_VARIANTS).flat().length,16);
 let checked=0;
 for(const topic of PK_TOPICS)for(const variant of PK_VARIANTS[topic.id]){
  const positions=new Set();
  for(let i=0;i<500;i++){
   const q=makePkQuestion(topic.id,random,variant);
   assert.equal(q.answer,Number(reference(q).toFixed(q.digits)),q.id);
   assert.equal(q.choices.length,5);assert.equal(new Set(q.choices.map(c=>c.text)).size,5);
   assert.equal(q.choices.filter(c=>c.correct).length,1);
   assert.equal(Number(q.choices[q.answerIndex].text),q.answer);
   assert.ok(q.choices.every(c=>/^-?\d+(\.\d+)?$/.test(c.text)&&Number(c.text)===c.value&&c.reason),q.id);
   assert.ok(q.stem.includes(q.unit),q.id+' unit in stem');
   assert.ok(q.stem.length<220,q.stem);assert.doesNotMatch(q.stem,/옳은 것은|옳지 않은 것은/);
   assert.match(q.source,/본인 정리본 PDF 2쪽/);assert.match(q.source,/약동학\(/);
   assert.ok(q.steps.length>=3&&q.formula);
   positions.add(q.answerIndex);checked++;
  }
  assert.equal(positions.size,5,topic.id+':'+variant);
 }
 assert.equal(checked,8000);
});
test('정리본의 CL/V·말단 기울기·반감기·꼬리 면적을 간단한 수치로 계산',()=>{
 assert.equal(makePkQuestion('ke',()=>0,'clearance').answer,.1);
 assert.equal(makePkQuestion('ke',()=>0,'slope').answer,.5);
 assert.equal(makePkQuestion('half',()=>0,'fromKe').answer,10);
 assert.equal(makePkQuestion('volume',()=>0,'volume').answer,20);
 assert.equal(makePkQuestion('tail',()=>0,'tail').answer,10);
 assert.equal(makePkQuestion('tail',()=>0,'total').answer,30);
 const rate=makePkQuestion('infusion',()=>.99,'rate');
 assert.equal(rate.answer,250);assert.match(rate.source,/족보 PDF 7쪽/);
 assert.equal(makePkQuestion('bio',()=>0,'differentDose').answer,25);
});
test('혼합 출제는 열 유형을 고르게 돌리고 인접 유형을 피한다',()=>{
 const state={seenTopics:{},missedTopics:{},lastTopic:null};
 for(let i=0;i<1000;i++){
  const topic=pickPkTopic(state,'all',random);assert.notEqual(topic,state.lastTopic);
  state.seenTopics[topic]=(state.seenTopics[topic]||0)+1;state.lastTopic=topic;
 }
 assert.deepEqual(Object.values(state.seenTopics),Array(10).fill(100));
 assert.equal(pickPkTopic(state,'tail',random),'tail');
});
test('옮긴 유형은 기존 AUC·주입 농도 ID를 보존하고 제외한 유형은 출제하지 않는다',()=>{
 assert.equal(pk.pkQuestionId('tail','tail'),'auc:tail');
 assert.equal(pk.pkQuestionId('tail','total'),'auc:total');
 assert.equal(pk.pkQuestionId('concentration','concentration'),'infusion:concentration');
 const ids=PK_TOPICS.flatMap(t=>PK_VARIANTS[t.id].map(v=>makePkQuestion(t.id,random,v).id));
 assert.equal(new Set(ids).size,16);
 for(const id of ids)assert.doesNotMatch(id,/judge|accumulation|renal|steady|apparent/);
 assert.throws(()=>makePkQuestion('ke',random,'judge-correct'));
});
