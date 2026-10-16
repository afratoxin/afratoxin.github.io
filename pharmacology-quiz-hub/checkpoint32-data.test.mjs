import test from 'node:test';import assert from 'node:assert/strict';
const api=await import('./checkpoint32-data.mjs').catch(()=>({}));
const expected={Atezolizumab:'PD-L1 차단',Cemiplimab:'PD-1 차단',Ipilimumab:'CTLA-4 차단',Nivolumab:'PD-1 차단',Tremelimumab:'CTLA-4 차단',Pembrolizumab:'PD-1 차단',Durvalumab:'PD-L1 차단',Avelumab:'PD-L1 차단'};
test('지정한 8개 성분만 강의록 8쪽의 세 표적으로 정확히 분류한다',()=>{
 assert.ok(api.C32_DRUGS);assert.deepEqual(Object.fromEntries(api.C32_DRUGS.map(d=>[d.name,d.target])),expected);
 assert.equal(new Set(api.C32_DRUGS.map(d=>d.id)).size,8);for(const d of api.C32_DRUGS)assert.match(d.source,/32강.*8쪽/);
 assert.doesNotMatch(JSON.stringify(api.C32_DRUGS),/Prembrolizumab|Keytruda|Opdivo/i);
});
test('CAR 비교는 32쪽 표의 자가·동종·세포·CRS·비용·적응증을 따르고 공유 특징은 복수 칸을 허용한다',()=>{
 assert.ok(api.C32_CARS);const by=name=>api.C32_CARS.find(c=>c.name===name);
 assert.deepEqual(api.C32_CARS.map(c=>[c.name,c.cell,c.origin,c.crs,c.cost,c.indication]),[
  ['CAR-T','T세포','자가 유래 · 환자 혈액','발생 우려가 상대적으로 큼','환자 맞춤형 · 고가','혈액암'],
  ['CAR-NK','NK세포','동종 유래 · 일반인 혈액','발생 우려가 상대적으로 적음','기성품 방식 · 상대적 저가','혈액암·고형암'],
  ['CAR-M','대식세포','동종 유래 · 일반인 혈액','발생 우려가 상대적으로 적음','기성품 방식 · 상대적 저가','고형암']
 ]);
 assert.equal(api.C32_FEATURE_CARDS.length,11);
 for(const id of ['allogeneic','low-crs','off-the-shelf'])assert.deepEqual(api.C32_FEATURE_CARDS.find(c=>c.id===id).categories,['CAR-NK','CAR-M']);
 for(const c of api.C32_FEATURE_CARDS){assert.match(c.source,/32쪽/);assert.ok(c.categories.every(name=>by(name)));}
 assert.doesNotMatch(JSON.stringify(api.C32_FEATURE_CARDS),/rejection.*없|CRS.*절대|75.*100/);
});
test('46개 판별형은 다섯 연결·유일 정답·전 선지 해설을 갖추고 요청 범위 밖으로 나가지 않는다',()=>{
 assert.ok(api.C32_QUESTIONS);assert.equal(api.C32_QUESTIONS.length,46);
 assert.equal(new Set(api.C32_QUESTIONS.map(q=>q.id)).size,46);
 for(const area of ['target','car'])for(const polarity of ['correct','incorrect'])assert.equal(api.C32_QUESTIONS.filter(q=>q.area===area&&q.polarity===polarity).length,area==='target'?8:15);
 for(const q of api.C32_QUESTIONS){assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);assert.ok(q.options.includes(q.answer));assert.equal(q.details.length,5);assert.match(q.stem,q.polarity==='correct'?/옳은 것은/:/옳지 않은 것은/);
  assert.equal(q.pairs.filter(p=>p.valid).length,q.polarity==='correct'?1:4);
  const answer=q.pairs.find(p=>p.valid===(q.polarity==='correct'));assert.equal(q.answer,answer.left+' — '+answer.right);
  for(const p of q.pairs){assert.ok(p.source&&p.correctRight);assert.ok(q.details.some(d=>d.startsWith(p.left+' — '+p.right+':')));if(q.area==='target')assert.equal(p.right===expected[p.left],p.valid);}
  if(q.area==='car'){assert.match(q.stem,/32강 비교표/);const fields={'세포 기반':'cell','세포 유래':'origin','CRS 우려':'crs','생산 방식·비용':'cost','주요 적응증':'indication'};for(const p of q.pairs){const [name,label]=p.left.split(' · '),c=api.C32_CARS.find(c=>c.name===name);assert.equal(p.correctRight,c[fields[label]]);assert.equal(p.right===c[fields[label]],p.valid,q.id+p.left);}}
 }
});
test('1000회 혼합 출제는 두 주제를 절반씩 회독하며 선지 순서·최근 문항을 섞는다',()=>{
 assert.equal(typeof api.pickCheckpointQuestion,'function');let seed=2026;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
 const state={draws:0,seen:{},recent:[],subjects:[],lastArea:null},counts={target:0,car:0},positions=[0,0,0,0,0];
 for(let i=0;i<1000;i++){const q=api.pickCheckpointQuestion(state,'all',random);assert.ok(!state.recent.includes(q.id));assert.equal(q.choices[q.answerIndex].text,q.answer);if(state.lastArea)assert.notEqual(q.area,state.lastArea);counts[q.area]++;positions[q.answerIndex]++;state.draws++;state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.subjects=[q.subject,...state.subjects].slice(0,3);state.lastArea=q.area;}
 assert.deepEqual(counts,{target:500,car:500});for(const q of api.C32_QUESTIONS)assert.ok(state.seen[q.id],q.id);for(const n of positions)assert.ok(n>130&&n<270);
 for(const area of ['target','car'])assert.equal(api.pickCheckpointQuestion(state,area,random).area,area);
});
