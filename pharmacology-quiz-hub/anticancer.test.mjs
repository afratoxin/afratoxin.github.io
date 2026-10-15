import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const api=await import('./anticancer-data.mjs').catch(()=>({}));

test('30강 표적·독성의 핵심 연결을 정확하게 보존한다',()=>{
  assert.ok(api.ANTI_DRUGS,'항암제 자료가 필요합니다');
  const d=Object.fromEntries(api.ANTI_DRUGS.map(x=>[x.id,x]));
  for(const [id,key] of Object.entries({vincristine:'vinca',vinblastine:'vinca',paclitaxel:'taxane',docetaxel:'taxane',irinotecan:'topo1',topotecan:'topo1',etoposide:'topo2',doxorubicin:'anthra',bleomycin:'ros',asparaginase:'asparagine',tamoxifen:'serm',fulvestrant:'serd',leuprolide:'gnrhagonist',degarelix:'gnrhantagonist',enzalutamide:'ar',abiraterone:'cyp17'}))assert.equal(d[id]?.key,key,id);
  assert.match(d.vincristine.toxicity,/신경|변비/);assert.match(d.vinblastine.toxicity,/골수/);
  assert.match(d.irinotecan.note,/SN-38/);assert.match(d.irinotecan.note,/UGT1A1/);assert.match(d.abiraterone.note,/ACTH/);
  assert.match(d.bleomycin.toxicity,/폐섬유화/);
  const anthra=api.ANTI_TARGETS.find(x=>x.id==='doxorubicin');
  for(const id of ['etoposide','bleomycin','dactinomycin'])assert.ok(anthra.categories.includes(d[id].target),id+' 기전도 정답');
  assert.ok(!api.ANTI_TARGETS.find(x=>x.id==='bleomycin').categories.includes(d.doxorubicin.target));
});

test('동일·중첩 표적을 오답으로 사용하지 않고 5지선다 단일 정답을 유지한다',()=>{
  assert.ok(api.ANTI_QUESTIONS?.length>=70);
  const ids=new Set();
  for(const q of api.ANTI_QUESTIONS){assert.ok(!ids.has(q.id),q.id);ids.add(q.id);assert.equal(q.options.length,5,q.id);assert.equal(new Set(q.options).size,5,q.id);assert.equal(q.options.filter(x=>x===q.answer).length,1,q.id);assert.ok(q.note&&q.source,q.id);}
  const ambiguous={topo2:['Etoposide','Doxorubicin','Daunorubicin'],ros:['Bleomycin','Doxorubicin','Daunorubicin'],intercalation:['Dactinomycin (Actinomycin D)','Doxorubicin','Daunorubicin']};
  for(const [key,names] of Object.entries(ambiguous))for(const q of api.ANTI_QUESTIONS.filter(q=>q.direction==='reverse'&&q.key===key))assert.equal(q.options.filter(x=>names.includes(x)).length,1,q.id);
});

test('1000회 출제에서 빈출 우선·표적 80%·최근 약물과 방향 중복 억제를 지킨다',()=>{
  assert.equal(typeof api.pickAntiQuestion,'function');
  const state={draws:0,seen:{},recent:[],subjects:[],lastGroup:null};let n=0,seed=159;
  const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
  for(let i=0;i<1000;i++){
    const q=api.pickAntiQuestion(state,'core','mixed',random);assert.ok(q.core);assert.ok(!state.recent.includes(q.id));assert.ok(!state.subjects.includes(q.subject));assert.notEqual(q.group,state.lastGroup);assert.equal(q.choices[q.answerIndex].text,q.answer);n+=q.kind==='target';
    state.draws++;state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.subjects=[q.subject,...state.subjects].slice(0,3);state.lastGroup=q.group;
  }
  assert.equal(n,800);for(const q of api.ANTI_QUESTIONS.filter(q=>q.core))assert.ok(state.seen[q.id],q.id);
  for(const mode of ['target','support'])assert.equal(api.pickAntiQuestion(state,'all',mode,random).kind,mode);
});

test('면역억제제와 항암제는 같은 묶음의 탭으로 열리고 다른 메뉴로 가면 함께 숨긴다',async()=>{
  const mod=await import('./study-folder.mjs').catch(()=>({}));assert.equal(typeof mod.syncStudyFolder,'function');
  const ids=['oncoView','immuneView','anticancerView','immuneUnitTab','anticancerUnitTab'];
  const elements=Object.fromEntries(ids.map(id=>[id,{hidden:true,attributes:{},classList:{toggle(){}},setAttribute(k,v){this.attributes[k]=v;}}]));
  const doc={getElementById:id=>elements[id]};
  mod.syncStudyFolder('anticancer',doc);assert.equal(elements.oncoView.hidden,false);assert.equal(elements.anticancerView.hidden,false);assert.equal(elements.immuneView.hidden,true);assert.equal(elements.anticancerUnitTab.attributes['aria-selected'],'true');
  mod.syncStudyFolder('immune',doc);assert.equal(elements.immuneView.hidden,false);assert.equal(elements.anticancerView.hidden,true);
  mod.syncStudyFolder('home',doc);for(const id of ['oncoView','immuneView','anticancerView'])assert.equal(elements[id].hidden,true);
  const [html,app]=await Promise.all(['index.html','app.mjs'].map(f=>readFile(new URL(f,import.meta.url),'utf8')));
  assert.match(html,/data-open="anticancer"/);assert.match(app,/if\(view==='anticancer'\)anticancer.open\(\)/);
  assert.match(app,/\[[^\]]*'anticancer'[^\]]*\]\.includes\(location\.hash\.slice\(1\)\)/);
});
