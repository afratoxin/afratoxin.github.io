import test from 'node:test';
import assert from 'node:assert/strict';
import {PK_TOPICS,PK_VARIANTS,makePkQuestion,pickPkTopic} from './pk-calculations.mjs';

let seed=314159;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
function reference(q){
  const p=q.parameters;
  switch(q.topic){
    case 'ke':return .693*Math.log2(p.c1/p.c2)/(p.t2-p.t1);
    case 'half':return q.variant==='steady'?p.halfLife*p.halfLives:.693*p.volume/p.clearance;
    case 'volume':return p.weight*p.mgPerKg/p.c0;
    case 'clearance':return q.variant==='oral'?p.f*p.dose/p.auc:p.dose/p.auc;
    case 'bio':return p.aucOral*p.doseIv/(p.aucIv*p.doseOral)*100;
    case 'auc':return q.variant==='tail'?p.clast/p.ke:q.variant==='total'?p.aucObserved+p.clast/p.ke:p.times.slice(1).reduce((sum,t,i)=>sum+(p.concentrations[i]+p.concentrations[i+1])/2*(t-p.times[i]),0);
    case 'infusion':return q.variant==='concentration'?p.rate/p.clearance:p.target*p.clearance;
    case 'loading':return p.target*p.volume;
    case 'accumulation':return (q.variant==='peak'?p.c0:1)/(1-p.r);
    case 'renal':{
      const fraction=(1-p.fe)+p.fe*p.functionFraction;
      return q.variant==='auc'?1/fraction:q.variant==='rate'?p.oldRate*fraction:p.oldClearance*fraction;
    }
  }
}
test('10개 주제의 수치형 21개를 독립 계산하고 단일 정답·보기 다섯 개 유지',()=>{
  assert.equal(PK_TOPICS.length,10);
  let checked=0;
  for(const topic of PK_TOPICS)for(const variant of PK_VARIANTS[topic.id].filter(v=>!v.startsWith('judge-'))){
    const positions=new Set();
    for(let i=0;i<500;i++){
      const q=makePkQuestion(topic.id,random,variant);
      const expected=Number(reference(q).toFixed(q.digits));
      assert.equal(Number(q.answer.toFixed(q.digits)),expected,q.id);
      assert.equal(q.choices.length,5,q.id);
      assert.equal(new Set(q.choices.map(x=>x.text)).size,5,q.id);
      assert.equal(q.choices.filter(x=>x.correct).length,1,q.id);
      assert.equal(q.choices[q.answerIndex].correct,true,q.id);
      assert.ok(q.steps.length>=3&&q.source&&q.formula,q.id);
      assert.ok(q.choices.every(x=>x.reason&&Number.isFinite(x.value)),q.id);
      positions.add(q.answerIndex);checked++;
    }
    assert.equal(positions.size,5,topic.id+':'+variant);
  }
  assert.equal(checked,10500);
  console.log('검증한 생성 문항',checked);
});
test('족보 주입속도와 강의록 신장애·축적 예시의 수치가 맞는다',()=>{
  const sequence=values=>{let i=0;return ()=>values[i++]??0;};
  assert.equal(makePkQuestion('infusion',sequence([.99,0,.6]),'rate').answer,250);
  assert.equal(makePkQuestion('renal',()=>0,'auc').answer,1.6);
  assert.equal(makePkQuestion('bio',sequence([0,0,.3]),'differentDose').answer,50);
  assert.equal(makePkQuestion('auc',()=>0,'trapezoids').answer,28);
  assert.equal(makePkQuestion('accumulation',sequence([.5,0]),'ratio').answer,2);
});
test('전체 혼합은 인접 주제를 피하며 10개 주제를 고르게 출제',()=>{
  const state={seenTopics:{},missedTopics:{},lastTopic:null};
  for(let i=0;i<1000;i++){
    const topic=pickPkTopic(state,'all',random);
    assert.notEqual(topic,state.lastTopic);
    state.seenTopics[topic]=(state.seenTopics[topic]||0)+1;
    state.lastTopic=topic;
  }
  assert.deepEqual(Object.values(state.seenTopics),Array(10).fill(100));
  assert.equal(pickPkTopic(state,'renal',random),'renal');
});
test('마지막 채혈 이후 넓이와 전체 AUC를 구별하고 필요한 식을 제공',()=>{
  const tail=makePkQuestion('auc',()=>0,'tail'),total=makePkQuestion('auc',()=>0,'total');
  assert.equal(tail.answer,20);
  assert.equal(total.answer,60);
  assert.match(tail.formula,/C_last\/kₑ/);
  assert.match(total.formula,/AUC₀–last/);
  assert.ok(tail.stem.includes('1차 소실'));
  assert.ok(PK_VARIANTS.auc.includes('tail')&&PK_VARIANTS.auc.includes('total'));
});
