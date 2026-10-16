import test from 'node:test';
import assert from 'node:assert/strict';
const api=await import('./statement-quiz.mjs').catch(()=>({}));
const facts=[
 {id:'a',left:'GABA_A',right:'이온통로형',wrong:'GPCR',family:'gaba'},
 {id:'b',left:'GABA_B',right:'GPCR',wrong:'이온통로형',family:'gaba'},
 {id:'c',left:'5-HT₃',right:'이온통로형',wrong:'GPCR',family:'serotonin'},
 {id:'d',left:'D₂',right:'GPCR',wrong:'이온통로형',family:'dopamine'},
 {id:'e',left:'M₂',right:'GPCR',wrong:'이온통로형',family:'ach'},
 {id:'f',left:'NMDA',right:'이온통로형',wrong:'GPCR',family:'glutamate'}
].map(r=>({...r,source:'강의록 분류표',note:r.left+'는 '+r.right+'입니다.'}));
test('판별형은 원래 ID·범위를 유지하고 다섯 연결에서 요구한 진릿값을 하나만 고른다',()=>{
 assert.equal(typeof api.createPairedQuestion,'function');
 for(const polarity of ['correct','incorrect'])for(let i=0;i<facts.length;i++){
  const q=api.createPairedQuestion({id:'stable-'+i,core:true,subject:facts[i].id,kind:'target',choices:['obsolete'],answerIndex:9},facts[i],facts,{polarity,index:i,topic:'수용체 구조'});
  assert.equal(q.id,'stable-'+i);assert.equal(q.core,true);assert.equal(q.kind,'target');assert.equal(q.format,'judgment');assert.equal(q.polarity,polarity);assert.equal(q.choices,undefined);assert.equal(q.answerIndex,undefined);
  assert.match(q.stem,polarity==='correct'?/옳은 것은\?/:/옳지 않은 것은\?/);
  assert.equal(q.options.length,5);assert.equal(new Set(q.pairs.map(p=>p.left)).size,5);assert.equal(new Set(q.options).size,5);
  const keyed=q.pairs.filter(p=>p.valid===(polarity==='correct'));assert.equal(keyed.length,1);assert.equal(q.answer,keyed[0].left+' — '+keyed[0].right);
  for(const p of q.pairs){const f=facts.find(f=>f.id===p.id);assert.equal(p.valid,p.right===f.right);assert.equal(p.correctRight,f.right);assert.ok(q.details.some(d=>d.startsWith(p.left+' — '+p.right+':')));assert.ok(p.source&&p.explanation);}
 }
});
test('겹치는 약물명은 중복 선지로 쓰지 않고 잘못된 근거 행·부족한 선지 풀은 거절한다',()=>{
 assert.equal(typeof api.createPairedQuestion,'function');
 const duplicate={...facts[1],id:'alias',left:facts[0].left};
 const q=api.createPairedQuestion({id:'dedupe'},facts[0],[...facts,duplicate],{polarity:'incorrect',topic:'구조'});
 assert.equal(q.pairs.filter(p=>p.left===facts[0].left).length,1);
 assert.throws(()=>api.createPairedQuestion({id:'few'},facts[0],facts.slice(0,4),{polarity:'correct',topic:'구조'}),/five|다섯|5|distinct/i);
 assert.throws(()=>api.createPairedQuestion({id:'bad'},{...facts[0],wrong:facts[0].right},facts,{polarity:'correct',topic:'구조'}),/false|wrong|다른/i);
});
