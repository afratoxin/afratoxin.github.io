import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const api=await import('./cns-data.mjs').catch(()=>({}));
test('수용체 예외와 아형을 독립된 근거표대로 분류한다',()=>{
  assert.ok(Array.isArray(api.RECEPTORS),'중추신경계 수용체 데이터가 필요합니다');
  const byId=Object.fromEntries(api.RECEPTORS.map(x=>[x.id,x]));
  for(const [id,type,effect] of [['gabaa','ionotropic','inhibitory'],['gabab','metabotropic','inhibitory'],['5ht3','ionotropic','excitatory'],['5ht1','metabotropic','inhibitory'],['mglu5','metabotropic','excitatory'],['mglu6','metabotropic','inhibitory'],['d1','metabotropic','excitatory'],['d2','metabotropic','inhibitory'],['glyr','ionotropic','inhibitory'],['nmda','ionotropic','excitatory']]){
    assert.equal(byId[id]?.type,type,id);assert.equal(byId[id]?.effect,effect,id);
  }
  assert.equal(byId['nmda-glycine']?.effect,'excitatory');
  assert.ok(!api.CNS_MATCH.structure.some(x=>x.id==='nmda-glycine'),'결합부위는 별개의 수용체로 분류하지 않습니다');
});

test('임상형을 포함한 다섯 영역의 모든 문항에 다섯 개의 서로 다른 선지와 한 정답이 있다',()=>{
  assert.ok(api.CNS_QUESTIONS?.length>=100,'전체 범위를 회독할 문항이 필요합니다');
  assert.equal(new Set(api.CNS_QUESTIONS.map(x=>x.id)).size,api.CNS_QUESTIONS.length);
  for(const q of api.CNS_QUESTIONS){
    assert.equal(q.options.length,5,q.id);assert.equal(new Set(q.options).size,5,q.id);
    assert.equal(q.options.filter(x=>x===q.answer).length,1,q.id);
    assert.ok(q.note.length>15&&q.source,q.id);
    if(q.area==='structure'||q.area==='effect'){
      const property=q.area==='structure'?'type':'effect';
      const pool=q.pairs.map(p=>api.RECEPTORS.find(x=>x.id===p.entity));
      assert.ok(pool.every(Boolean),q.id);
      assert.equal(q.pairs.filter(p=>p.valid===(q.polarity==='correct')).length,1,q.id);
    }
  }
  assert.deepEqual([...new Set(api.CNS_QUESTIONS.map(x=>x.area))].sort(),['clinical','disease','effect','features','structure']);
});

test('1,000문제 순환에서 영역 선택·중복 억제·정답 위치를 유지한다',()=>{
  assert.equal(typeof api.pickCnsQuestion,'function');
  const state={seen:{},recent:[],recentSubjects:[],lastGroup:null};
  for(let i=0;i<1000;i++){
    const q=api.pickCnsQuestion(state,'all');
    assert.ok(!state.recent.includes(q.id));
    assert.ok(!state.recentSubjects.includes(q.subject));
    assert.notEqual(q.group,state.lastGroup);
    assert.equal(q.choices[q.answerIndex].text,q.answer);
    state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.recentSubjects=[q.subject,...state.recentSubjects].slice(0,3);state.lastGroup=q.group;
  }
  assert.equal(Object.keys(state.seen).length,api.CNS_QUESTIONS.length);
  for(const clinical of [true,false]){const counts=api.CNS_QUESTIONS.filter(q=>(q.format==='clinical')===clinical).map(q=>state.seen[q.id]);assert.ok(Math.max(...counts)-Math.min(...counts)<=2);}
  for(const area of ['structure','effect','disease','features'])assert.equal(api.pickCnsQuestion(state,area).area,area);
});

test('표적이 겹치는 약물이 잘못된 오답으로 들어가지 않는다',()=>{
  const truths={na:['Carbamazepine','Phenytoin','Lamotrigine','Valproic acid','Zonisamide'],ttype:['Ethosuximide','Valproic acid','Zonisamide'],nmda:['Memantine','Amantadine','Felbamate','Ketamine'],opioid:['Morphine','Fentanyl']};
  for(const [key,names] of Object.entries(truths))for(const d of api.DRUGS.filter(d=>d.mechanism===key)){
    const q=api.CNS_QUESTIONS.find(q=>q.id==='mechanism-'+d.id);
    for(const p of q.pairs.filter(p=>p.dimension==='mechanism'&&p.value===key))assert.equal(p.valid,names.includes(p.left),q.id+' '+p.left);
  }
  for(const drug of ['Duloxetine','Venlafaxine']){
    const q=api.CNS_QUESTIONS.find(q=>q.id==='mechanism-'+drug.toLowerCase());assert.ok(q.pairs.some(p=>p.left===drug&&p.correctRight==='대표 분류: SNRI'));assert.match(q.stem,/ 연결/);
  }
});

test('질환 매칭은 복수 적응증을 허용하고 관련 없는 칸은 오답으로 채점한다',async()=>{
  assert.ok(api.CNS_MATCH?.disease?.length>40);
  const board=await import('./match-board.mjs');
  assert.equal(typeof board.isMatchPlacement,'function');
  const diazepam=api.CNS_MATCH.disease.find(x=>x.id==='diazepam');
  assert.ok(board.isMatchPlacement(diazepam,'불안 완화',x=>x.categories));
  assert.ok(board.isMatchPlacement(diazepam,'뇌전증',x=>x.categories));
  assert.equal(board.isMatchPlacement(diazepam,'파킨슨병',x=>x.categories),false);
  const ethosuximide=api.CNS_MATCH.disease.find(x=>x.id==='ethosuximide');
  assert.deepEqual(ethosuximide.categories,['뇌전증']);
  for(const items of Object.values(api.CNS_MATCH))assert.equal(new Set(items.map(x=>x.id)).size,items.length);
});

test('기존 허브와 직접 주소에서 새 탭에 진입할 수 있다',async()=>{
  const [html,app]=await Promise.all(['index.html','app.mjs'].map(f=>readFile(new URL(f,import.meta.url),'utf8')));
  assert.match(html,/data-open="cns"/);assert.match(html,/id="cnsView"/);
  for(const tab of ['Quiz','Structure','Effect','Disease'])assert.match(html,new RegExp('id="cns'+tab+'Tab"'));
  assert.match(app,/initCnsQuiz/);assert.match(app,/if\(view==='cns'\)cns.open\(\)/);
  assert.ok((app.match(/'cns'/g)||[]).length>=3);
});
