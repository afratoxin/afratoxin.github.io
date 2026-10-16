import test from 'node:test';import assert from 'node:assert/strict';
import {IMM_DRUGS} from './immune-data.mjs';import {ANTI_DRUGS} from './anticancer-data.mjs';import {SIGNAL_DRUGS} from './signal31-data.mjs';
const api=await import('./simple-target-data.mjs').catch(()=>({}));
test('단순 매칭은 세 강의를 별도 은행으로 유지하고 실제 표적과 작용 방향을 보존한다',()=>{
 assert.ok(api.SIMPLE_BANKS);
 const by=(scope,id)=>api.SIMPLE_BANKS[scope].filter(q=>q.subject===id&&q.format!=='judgment');
 for(const [scope,id,target]of [['immune-simple','cyclosporine','Calcineurin'],['immune-simple','tacrolimus','Calcineurin'],['immune-simple','sirolimus','mTOR'],['immune-simple','mmf','IMPDH'],['immune-simple','basiliximab','CD25 (IL-2Rα)'],['immune-simple','abatacept','B7 (CD80·CD86)'],['anticancer-simple','vincristine','미세소관 중합'],['anticancer-simple','paclitaxel','미세소관 탈중합'],['anticancer-simple','etoposide','Topoisomerase II'],['anticancer-simple','irinotecan','Topoisomerase I'],['anticancer-simple','asparaginase','Asparagine'],['anticancer-simple','abiraterone','CYP17'],['signal-simple','bevacizumab','VEGF-A'],['signal-simple','bortezomib','26S proteasome']])assert.ok(by(scope,id).some(q=>q.answer===target),scope+id);
 assert.equal(by('immune-simple','epo').length,0);assert.equal(by('anticancer-simple','dexrazoxane').length,0);
 for(const id of ['leuprolide','goserelin','prednisone'])for(const q of by('anticancer-simple',id))assert.doesNotMatch(q.stem,/억제|차단/,'작용제를 억제제로 오인하지 않음');
 for(const d of SIGNAL_DRUGS)assert.deepEqual(new Set(by('signal-simple',d.id).map(q=>q.answer)),new Set(d.targets));
 assert.equal(api.SIMPLE_BANKS['immune-simple'].filter(q=>q.format!=='judgment').length,IMM_DRUGS.filter(d=>d.section!=='조혈·IFN·백신').length);
 assert.equal(api.SIMPLE_BANKS['anticancer-simple'].filter(q=>q.format!=='judgment').length,ANTI_DRUGS.length-1);
});
test('보기는 짧은 표적명 5개이고 다른 유효 표적을 오답으로 쓰지 않는다',()=>{
 assert.ok(api.SIMPLE_BANKS);
 for(const [scope,bank]of Object.entries(api.SIMPLE_BANKS)){
  assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
  for(const q of bank.filter(q=>q.format!=='judgment')){assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);assert.equal(q.options.filter(x=>q.validTargets.includes(x)).length,1,q.id);assert.ok(q.options.includes(q.answer));assert.ok(q.source&&q.note);assert.ok(q.stem.length<110);for(const x of q.options){assert.ok(x.length<=22,x);assert.doesNotMatch(x,/→|—|\n|억제제입니다|옳은 것은/);}}
 }
});
test('각 강의 1000회 출제에서 정답 위치를 섞고 최근 약물 반복을 막으며 전 범위를 회독한다',()=>{
 assert.equal(typeof api.pickSimpleTargetQuestion,'function');let seed=215;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
 for(const [scope,bank]of Object.entries(api.SIMPLE_BANKS)){
  const state={seen:{},recent:[],subjects:[]},positions=[0,0,0,0,0];
  for(let n=0;n<1000;n++){const q=api.pickSimpleTargetQuestion(scope,state,'all',random);assert.ok(!state.recent.includes(q.id));assert.ok(!state.subjects.includes(q.subject));assert.equal(q.choices[q.answerIndex].text,q.answer);positions[q.answerIndex]++;state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.subjects=[q.subject,...state.subjects].slice(0,3);}
  for(const q of bank)assert.ok(state.seen[q.id],scope+q.id);for(const count of positions)assert.ok(count>140&&count<260);
  for(let n=0;n<100;n++)assert.ok(api.pickSimpleTargetQuestion(scope,state,'core',random).core);
 }
});
test('넓은 작용 범주를 다른 구체 표적의 오답으로 섞지 않는다',()=>{
 assert.ok(api.SIMPLE_BANKS);const bank=api.SIMPLE_BANKS['immune-simple'];
 for(const q of bank.filter(q=>q.format!=='judgment'))for(const broad of ['T세포 표면항원','Purine 합성'])if(q.answer!==broad)assert.ok(!q.options.includes(broad),q.id+' broad distractor '+broad);
 const atg=bank.find(q=>q.subject==='atg');for(const label of atg.options.filter(x=>x!==atg.answer))assert.ok(['Calcineurin','mTOR','JAK','IMPDH','DHFR'].includes(label),'ATG의 일부 실제 표면항원은 오답 불가: '+label);
});
test('단순 매칭의 펼침 해설도 공통 오답 재풀이 문항에 보존한다',async()=>{
 const {normalizeStudyQuestion}=await import('./study-records.mjs');assert.ok(api.SIMPLE_BANKS);
 for(const bank of Object.values(api.SIMPLE_BANKS))for(const q of bank){const normalized=normalizeStudyQuestion(q);assert.ok(normalized.details.includes(q.lectureNote),q.id+' lecture explanation retained');}
});
