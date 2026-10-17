import test from 'node:test';import assert from 'node:assert/strict';
const api=await import('./abx-data.mjs').catch(()=>({}));
test('23–27강의 약물·기전과 일반 문항을 분리한 완전한 은행을 제공한다',()=>{
 assert.ok(api.ABX_DRUGS?.length===47);assert.ok(api.ABX_SIMPLE?.length===47);assert.ok(api.ABX_QUESTIONS?.length===50);
 assert.equal(new Set(api.ABX_DRUGS.map(d=>d.id)).size,api.ABX_DRUGS.length);
 for(const d of api.ABX_DRUGS){assert.ok([23,24,25,26,27].includes(d.lecture));assert.ok(d.source&&d.note&&d.family);for(const key of d.targets)assert.ok(api.ABX_MECHANISMS[key],d.id+key);}
 for(const bank of [api.ABX_SIMPLE,api.ABX_QUESTIONS]){assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);for(const q of bank){assert.equal(q.options.length,5,q.id);assert.equal(new Set(q.options).size,5,q.id);assert.ok(q.options.includes(q.answer));assert.ok(q.note&&q.source);}}
 for(const q of api.ABX_SIMPLE.filter(q=>q.format!=='judgment')){const d=api.ABX_DRUGS.find(d=>d.id===q.subject);assert.equal(q.options.filter(x=>d.targets.map(t=>api.ABX_MECHANISMS[t]).includes(x)).length,1,q.id);for(const x of q.options)assert.ok(x.length<=30,x);}
});
test('표적 중첩·30S/50S 경계를 지키고 1000회 출제에서 전 범위를 회독한다',()=>{
 assert.equal(typeof api.pickAbxQuestion,'function');let seed=1294;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
 for(const kind of ['simple','general']){const state={seen:{},recent:[],subjects:[],lastGroup:null},bank=kind==='simple'?api.ABX_SIMPLE:api.ABX_QUESTIONS,positions=[0,0,0,0,0];
  for(let n=0;n<1000;n++){const q=api.pickAbxQuestion(kind,state,'all','all',random);assert.ok(!state.recent.includes(q.id));assert.ok(!state.subjects.includes(q.subject));assert.equal(q.choices[q.answerIndex].text,q.answer);positions[q.answerIndex]++;state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.subjects=[q.subject,...state.subjects].slice(0,3);state.lastGroup=q.group;}
  for(const q of bank)assert.ok(state.seen[q.id],kind+q.id);for(const n of positions)assert.ok(n>130&&n<270);
  for(const lecture of [23,24,25,26,27]){const qs=bank.filter(q=>q.lecture===lecture);assert.ok(qs.length,kind+' lecture '+lecture+' populated');const q=api.pickAbxQuestion(kind,state,String(lecture),'all',random);assert.equal(q.lecture,lecture);}
  for(let i=0;i<100;i++)assert.ok(api.pickAbxQuestion(kind,state,'all','core',random).core);
 }
 for(const q of [...api.ABX_SIMPLE,...api.ABX_QUESTIONS])assert.doesNotMatch([q.stem,...q.options].join(' '),/23S\s*rRNA|16S\s*rRNA|A\s*site|P\s*site|peptidyl.transferase|translocation/i,q.id+' ribosome detail beyond requested boundary');
});
