import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const api=await import('./immune-data.mjs').catch(()=>({}));

test('족보의 빈출 표적과 사진의 오기를 올바르게 구분한다',()=>{
  assert.ok(api.IMM_DRUGS,'면역약리 자료가 필요합니다');
  const map=Object.fromEntries(api.IMM_DRUGS.map(x=>[x.id,x]));
  for(const [id,key] of Object.entries({cyclosporine:'calcineurin',tacrolimus:'calcineurin',sirolimus:'mtor',abatacept:'b7',alefacept:'cd2',efalizumab:'cd11a',natalizumab:'a4',basiliximab:'cd25',alemtuzumab:'cd52',rituximab:'cd20',etanercept:'tnf',infliximab:'tnf',adalimumab:'tnf',mmf:'impdh'}))assert.equal(map[id]?.key,key,id);
  assert.equal(map.cyclosporine.binding,'Cyclophilin');assert.equal(map.tacrolimus.binding,'FKBP12');assert.equal(map.sirolimus.binding,'FKBP12');
  assert.match(map.alefacept.note,/CD2/);assert.match(map.mmf.note,/MPA|mycophenolic/);
});

test('모든 객관식은 5개 선지와 유일한 정답을 가지며 역방향 동계열 약물을 중복 정답으로 쓰지 않는다',()=>{
  assert.ok(api.IMM_QUESTIONS?.length>=80);
  const ids=new Set();
  for(const q of api.IMM_QUESTIONS){
    assert.ok(!ids.has(q.id));ids.add(q.id);
    assert.equal(q.options.length,5,q.id);assert.equal(new Set(q.options).size,5,q.id);assert.equal(q.options.filter(x=>x===q.answer).length,1,q.id);assert.ok(q.note&&q.source,q.id);
    if(q.direction==='reverse'){
      const ds=q.options.map(n=>api.IMM_DRUGS.find(d=>d.name===n));assert.ok(ds.every(Boolean));
      assert.equal(ds.filter(d=>d.key===q.key).length,1,q.id);
    }
  }
  assert.ok(api.IMM_CORRECTIONS.some(x=>/Alefacept/i.test(x.title)));
});

test('기본 1000회 출제에서 매칭 80%, 빈출 우선, 최근 약물과 방향 반복 억제를 유지한다',()=>{
  assert.equal(typeof api.pickImmQuestion,'function');
  let seed=739;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/2**32);
  const state={draws:0,seen:{},recent:[],subjects:[],lastGroup:null};let target=0;
  for(let i=0;i<1000;i++){
    const q=api.pickImmQuestion(state,'core','mixed',random);
    assert.ok(q.core,q.id);assert.equal(q.choices[q.answerIndex].text,q.answer);
    assert.ok(!state.recent.includes(q.id));assert.ok(!state.subjects.includes(q.subject));assert.notEqual(q.group,state.lastGroup);
    target+=q.kind==='target';state.draws++;state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.subjects=[q.subject,...state.subjects].slice(0,3);state.lastGroup=q.group;
  }
  assert.equal(target,800);
  for(const q of api.IMM_QUESTIONS.filter(q=>q.core))assert.ok(state.seen[q.id],q.id);
  for(const mode of ['target','support'])assert.equal(api.pickImmQuestion(state,'all',mode,random).kind,mode);
});

test('공통 HPV 유형 때문에 두 백신이 함께 정답이 되지 않도록 전체 유형 목록을 묻는다',()=>{
  for(const id of ['reverse-cervarix','reverse-gardasil9'])assert.match(api.IMM_QUESTIONS.find(q=>q.id===id).stem,/전체 목록/);
});

test('새 묶음은 허브·직접 주소·3개 탭에 연결하고 기존 약동학과 중추신경계를 보존한다',async()=>{
  const [html,app]=await Promise.all(['index.html','app.mjs'].map(f=>readFile(new URL(f,import.meta.url),'utf8')));
  assert.match(html,/data-open="immune"/);assert.match(html,/id="immuneGroupTitle"/);
  for(const n of ['Quiz','Drag','Table'])assert.ok(html.includes(`id="imm${n}Tab"`));
  assert.match(app,/if\(view==='immune'\)immune.open\(\)/);
  assert.match(app,/\[[^\]]*'immune'[^\]]*\]\.includes\(location\.hash\.slice\(1\)\)/);
  assert.match(app,/if\(view==='cns'\)cns.open\(\)/);assert.match(app,/if\(view==='pk'\)pk.open\(\)/);
});
