import test from 'node:test';import assert from 'node:assert/strict';
const api=await import('./signal31-data.mjs').catch(()=>({}));
// Independent target map: these overlaps must never create a second MCQ answer.
const truth={tretinoin:['RARα'],cetuximab:['EGFR'],panitumumab:['EGFR'],gefitinib:['EGFR'],erlotinib:['EGFR'],lapatinib:['EGFR','HER2'],afatinib:['EGFR','HER2','HER4'],trastuzumab:['HER2'],enhertu:['HER2'],rituximab:['CD20'],ibritumomab:['CD20'],alemtuzumab:['CD52'],denileukin:['IL-2R'],gemtuzumab:['CD33'],brentuximab:['CD30'],pembrolizumab:['PD-1'],nivolumab:['PD-1'],durvalumab:['PD-L1'],atezolizumab:['PD-L1'],imatinib:['BCR-ABL','KIT','PDGFR'],nilotinib:['BCR-ABL','KIT','PDGFR'],dasatinib:['BCR-ABL','SRC','KIT','PDGFR'],bevacizumab:['VEGF-A'],sorafenib:['RAF','VEGFR','PDGFR','KIT'],sunitinib:['VEGFR','PDGFR','KIT'],bortezomib:['26S proteasome'],crizotinib:['ALK','c-MET'],vorinostat:['HDAC']};

test('31강의 표적과 이미지 오기를 독립 근거표대로 구분한다',()=>{
 assert.ok(api.SIGNAL_DRUGS);assert.equal(api.SIGNAL_DRUGS.length,28);
 for(const d of api.SIGNAL_DRUGS)assert.deepEqual([...d.targets].sort(),[...truth[d.id]].sort(),d.id);
 const by=id=>api.SIGNAL_DRUGS.find(d=>d.id===id);
 assert.match(by('bortezomib').note,/IκBα/);assert.match(by('bortezomib').note,/분해.*억제|분해.*막/);assert.match(by('enhertu').note,/Topo I|topoisomerase I/);
 assert.equal(by('vorinostat').core,false);
 const match=api.SIGNAL_TARGETS.find(d=>d.id==='dasatinib');for(const target of ['BCR-ABL','KIT','PDGFR'])assert.ok(match.categories.includes(target));
 assert.ok(!match.categories.includes('SRC'),'이미지 밖의 세부 kinase 분류는 드래그에 추가하지 않는다');
 assert.ok(!api.SIGNAL_TARGETS.find(d=>d.id==='bevacizumab').categories.includes('VEGFR'));
});
test('중첩 표적을 단일 정답으로 오인하지 않고 모두 5지선다와 근거를 제공한다',()=>{
 assert.ok(api.SIGNAL_QUESTIONS?.length>=75);const ids=new Set();
 for(const q of api.SIGNAL_QUESTIONS){assert.ok(!ids.has(q.id));ids.add(q.id);assert.equal(q.options.length,5,q.id);assert.equal(new Set(q.options).size,5,q.id);assert.ok(q.options.includes(q.answer),q.id);assert.ok(q.note&&q.source,q.id);
  if(q.direction==='reverse'){const candidates=q.optionIds.filter(id=>q.askedTargets.every(t=>truth[id].includes(t)));assert.equal(candidates.length,1,q.id);}
  if(q.direction==='forward')assert.ok(q.options.every(label=>Object.values(truth).flat().includes(label)),q.id+' 표적 하나씩 평행한 보기');
  if(q.direction==='forward')for(const id of q.distractorIds)assert.ok(!truth[q.subject].some(t=>truth[id].includes(t)),q.id+' '+id);
 }
});
test('1000회에서 표적 80%, 최근 약물·방향 중복 억제 및 빈출 은행의 전체 회독을 유지한다',()=>{
 assert.equal(typeof api.pickSignalQuestion,'function');let seed=31;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32),state={draws:0,seen:{},recent:[],subjects:[],lastGroup:null},positions=[0,0,0,0,0];let target=0;
 for(let i=0;i<1000;i++){const q=api.pickSignalQuestion(state,'core','mixed',random);assert.ok(q.core);assert.ok(!state.recent.includes(q.id));assert.ok(!state.subjects.includes(q.subject));assert.notEqual(q.group,state.lastGroup);assert.equal(q.choices[q.answerIndex].text,q.answer);target+=q.kind==='target';positions[q.answerIndex]++;state.draws++;state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.subjects=[q.subject,...state.subjects].slice(0,3);state.lastGroup=q.group;}
 assert.equal(target,800);for(const q of api.SIGNAL_QUESTIONS.filter(q=>q.core))assert.ok(state.seen[q.id],q.id);assert.ok(positions.every(n=>n>140&&n<260));
 for(const mode of ['target','support'])assert.equal(api.pickSignalQuestion(state,'all',mode,random).kind,mode);
});
