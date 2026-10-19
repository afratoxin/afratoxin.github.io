import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const html=()=>readFileSync(new URL('./index.html',import.meta.url),'utf8');
const api=async()=>{assert.ok(existsSync(new URL('./comprehensive-data.mjs',import.meta.url)),'강의별 전단원 문항집이 있어야 한다');return import('./comprehensive-data.mjs');};
test('전단원 묶음은 기존 허브와 직접 주소에서 열리고 단원별 선택·재풀이 진입점을 제공한다',()=>{
 for(const id of ['comprehensiveView','compLecture','compUnitGrid','compStem','compChoices','compFeedback','compNext','compSkip','comprehensiveStats'])assert.ok(html().includes('id="'+id+'"'),id);
 assert.match(html(),/data-open="comprehensive"/);
 const app=readFileSync(new URL('./app.mjs',import.meta.url),'utf8');assert.match(app,/initComprehensiveQuiz/);assert.match(app,/view==='comprehensive'/);assert.match(app,/'comprehensive'[^\n]*includes\(location/);
});
test('2–36강 각각 다섯 개로 분리된 175문항과 다섯 선지·해설·원자료 근거를 제공한다',async()=>{
 const {COMPREHENSIVE_LECTURES:units,COMPREHENSIVE_QUESTIONS:bank}=await api();
 assert.deepEqual(units.map(u=>u.number),Array.from({length:35},(_,i)=>i+2));assert.equal(bank.length,175);assert.equal(new Set(bank.map(q=>q.id)).size,175);
 const exams=JSON.parse(readFileSync(new URL('./questions.json',import.meta.url))).questions,lookup=new Map(exams.map(q=>[q.id,q]));
 for(const unit of units){
  const qs=bank.filter(q=>q.lecture===unit.number);assert.equal(qs.length,5,unit.title);assert.equal(new Set(qs.map(q=>q.concept)).size,5,unit.title);
  assert.equal(new Set(qs.map(q=>q.stem)).size,5);
  for(const q of qs){
   assert.equal(q.scope,unit.scope);assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);
   assert.ok(q.options.includes(q.answer));assert.equal(q.details.length,5);
   q.options.forEach((o,i)=>assert.ok(q.details[i].startsWith(o+':')&&q.explanations[i].length>12,q.id));
   assert.ok(q.note&&q.source&&q.notesPages.length&&(q.examRefs.length||q.lectureSources.length),q.id);
   assert.ok(q.notesPages.every(p=>Number.isInteger(p)&&p>=1&&p<=48));
   for(const ref of q.examRefs){assert.ok(lookup.has(ref.id),q.id+' invalid exam ID '+ref.id);assert.equal(lookup.get(ref.id).page,ref.page,q.id);}
   assert.ok(['judgment','association','case','numeric'].includes(q.format),q.id);
   assert.doesNotMatch(q.options.join(' '),/모두 옳|모두 틀|정답 없음|Humira|Remicade|Enbrel/);
   if(q.format==='judgment'){assert.ok(['correct','incorrect'].includes(q.polarity),q.id);if(q.polarity==='incorrect')assert.match(q.stem,/옳지|않은|아닌|틀린|잘못/);else assert.doesNotMatch(q.stem,/옳지|않은|아닌|틀린|잘못/);}
   if(q.format==='numeric')assert.ok(q.options.every(o=>/^-?\d+(\.\d+)?$/.test(o)),q.id);
  }
 }
});
test('2·3·4강은 각 강의록의 실제 별표·중요 스탬프 쪽수에 근거한다',async()=>{
 const {COMPREHENSIVE_QUESTIONS:bank}=await api();
 const stars={2:[9,11,13,15,17,19,20,22,23,25,27],3:[5,7,8,9,14,15,19,20,22],4:[6,11,12,13,16,21,24]};
 for(const n of [2,3,4]){
  const qs=bank.filter(q=>q.lecture===n);assert.equal(qs.length,5);
  for(const q of qs){assert.ok(q.emphasis?.kind,q.id);assert.ok(q.emphasis.pages.some(p=>stars[n].includes(p)),q.id);assert.ok(q.lectureSources.some(s=>s.label===`약동학(${n-1})`&&stars[n].includes(s.page)),q.id);}
 }
});
test('새 원본을 받은 22·28–36강의 50문항은 해당 강의록의 쪽수와 강조 근거를 제공한다',async()=>{
 const {COMPREHENSIVE_LECTURES:units,COMPREHENSIVE_QUESTIONS:bank}=await api();
 const bounds={22:33,28:54,29:30,30:40,31:57,32:39,33:36,34:41,35:27,36:40};
 const revised=bank.filter(q=>bounds[q.lecture]);assert.equal(revised.length,50);
 assert.equal(units.find(u=>u.number===29).title,'유전자 표적 항암 약리');
 for(const q of revised){
  const sources=q.lectureSources.filter(s=>s.kind==='lecture'&&s.lecture===q.lecture);
  assert.ok(sources.length,q.id+' 원본 강의록 출처 누락');
  assert.ok(sources.every(s=>Number.isInteger(s.page)&&s.page>=1&&s.page<=bounds[q.lecture]),q.id);
  assert.ok(q.emphasis?.kind&&q.emphasis.pages.length,q.id+' 강조 근거 누락');
  assert.ok(q.emphasis.pages.every(p=>sources.some(s=>s.page===p)),q.id);
  assert.equal(q.materialRevision,'20261020-lectures1',q.id);
 }
});
test('강의별 회독은 최근 세 문항을 피하고 전 문항·모든 정답 위치를 사용한다',async()=>{
 const {COMPREHENSIVE_LECTURES:units,pickComprehensiveQuestion}=await api();
 let seed=919;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(const u of units){
  const state={seen:{},recent:[]},positions=new Set();
  for(let i=0;i<100;i++){
   const q=pickComprehensiveQuestion(u.number,state,random);assert.ok(q);assert.equal(q.lecture,u.number);assert.ok(!state.recent.includes(q.id));
   assert.equal(q.choices.length,5);assert.equal(q.choices[q.answerIndex].text,q.answer);
   assert.equal(q.choices.filter(c=>c.correct).length,1);assert.ok(q.choices.every(c=>c.reason));positions.add(q.answerIndex);
   state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.lastLecture=q.lecture;if(q.polarity)state.lastPolarity=q.polarity;
  }
  assert.equal(Object.keys(state.seen).length,5);assert.equal(positions.size,5);assert.ok(Math.max(...Object.values(state.seen))-Math.min(...Object.values(state.seen))<=1);
 }
 const state={seen:{},recent:[]};
 for(let i=0;i<1750;i++){const q=pickComprehensiveQuestion('all',state,random);assert.notEqual(q.lecture,state.lastLecture);state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.lastLecture=q.lecture;}
 assert.equal(Object.keys(state.seen).length,175);assert.equal(pickComprehensiveQuestion(1,{},random),null);
});
test('전단원은 강의별 분모 5·전체 175로 등록되고 실제 오답을 저장한다',async()=>{
 const {COMPREHENSIVE_LECTURES:units,pickComprehensiveQuestion}=await api();
 const {createStudyStore}=await import('./study-records.mjs'),{registerLectureStudies}=await import('./study-catalog.mjs');
 const disk=new Map(),store=createStudyStore({getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)});registerLectureStudies(store);
 assert.equal(store.counts(units.map(u=>u.scope)).total,175);
 for(const u of units){
  assert.equal(store.counts(u.scope).total,5);assert.equal(store.counts(u.scope).solved,0);
  const q=pickComprehensiveQuestion(u.number,{},()=>.3);assert.equal(store.record(u.scope,q,false),true);
  const saved=store.wrong(u.scope)[0].question;assert.deepEqual(saved.choices,q.choices.map(c=>c.text));assert.deepEqual(saved.answers,[q.answerIndex]);assert.equal(saved.stem,q.stem);
  store.record(u.scope,q,true);assert.equal(store.wrong(u.scope).length,0);assert.equal(store.counts(u.scope).solved,1);
 }
});
test('개념을 교체한 새 문항은 미풀이로 시작하고 유지한 개념과 다른 강의의 기록은 보존한다',async()=>{
 const {createStudyStore,STUDY_KEY}=await import('./study-records.mjs'),{registerLectureStudies}=await import('./study-catalog.mjs');
 const previous={version:1,records:{'comp-29':{'comp-L29-Q1':{status:'correct'},'comp-L29-Q3':{status:'wrong'}},'comp-30':{'comp-L30-Q2':{status:'wrong'},'comp-L30-Q3':{status:'correct'}},'comp-31':{'comp-L31-Q5':{status:'wrong'}},'comp-32':{'comp-L32-Q5':{status:'correct'}},'comp-34':{'comp-L34-Q4':{status:'wrong'}},'comp-02':{'comp-L02-Q1':{status:'correct'}}}};
 const disk=new Map([[STUDY_KEY,JSON.stringify(previous)]]),store=createStudyStore({getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)});registerLectureStudies(store);
 assert.equal(store.counts('comp-29').total,5);assert.equal(store.counts('comp-29').solved,1);assert.equal(store.counts('comp-29').wrong,1);
 for(const scope of ['comp-30','comp-31','comp-32','comp-34'])assert.equal(store.counts(scope).solved,0);assert.equal(store.counts('comp-02').solved,1);
 for(const [scope,id]of [['comp-29','comp-L29-Q1-lectures1'],['comp-29','comp-L29-Q4-lectures1'],['comp-30','comp-L30-Q2-lectures1'],['comp-30','comp-L30-Q3-lectures1'],['comp-31','comp-L31-Q5-lectures1'],['comp-32','comp-L32-Q5-lectures1'],['comp-34','comp-L34-Q4-lectures1']]){
  assert.ok(store.definitions.get(scope).items.has(id));assert.equal(store.status(scope,id),'unanswered');
 }
 const saved=JSON.parse(disk.get(STUDY_KEY));for(const [scope,rows]of Object.entries(previous.records))assert.deepEqual(saved.records[scope],rows);
});
test('실제 화면은 35개 강의를 선택·채점하고 건너뛰기와 숨겨진 화면을 미풀이로 남긴다',async()=>{
 const {COMPREHENSIVE_LECTURES:units,COMPREHENSIVE_QUESTIONS:bank}=await api();
 const {createTestDocument}=await import('./test-dom.mjs');
 const oldDoc=globalThis.document,oldStorage=globalThis.localStorage,doc=createTestDocument(html()),disk=new Map();
 globalThis.document=doc;globalThis.localStorage={getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)};
 try{
  const {registerLectureStudies}=await import('./study-catalog.mjs'),{studyStore}=await import('./study-records.mjs?v=20261015-review1'),{initComprehensiveQuiz}=await import('./comprehensive-quiz.mjs');
  registerLectureStudies();const quiz=initComprehensiveQuiz(),el=id=>doc.getElementById(id);el('comprehensiveView').hidden=false;quiz.open();
  assert.equal(el('compUnitGrid').children.length,35);assert.equal(el('compLecture').children.length,36);
  el('compSkip').click();assert.equal(studyStore.counts(units.map(u=>u.scope)).solved,0);
  for(const u of units){
   el('compLecture').value=String(u.number);el('compLecture').dispatch('change');
   assert.match(el('compHeading').textContent,new RegExp('^'+u.number+'강'));
   assert.equal(el(u.tabId).getAttribute('aria-pressed'),'true');assert.equal(el('compChoices').children.length,5);
   const q=bank.find(q=>q.stem===el('compStem').textContent),buttons=el('compChoices').children;
   const bad=buttons.find(b=>b.children[1].textContent!==q.answer);bad.click();
   assert.equal(studyStore.counts(u.scope).solved,1);assert.equal(studyStore.counts(u.scope).wrong,1);
   assert.equal(el('compFeedback').children[2].children.length,5);assert.equal(el('compNext').hidden,false);
   assert.equal(el(u.tabId).style.getPropertyValue('--study-wrong-end'),'20%');
   const saved=studyStore.wrong(u.scope)[0].question;assert.deepEqual(saved.choices,buttons.map(b=>b.children[1].textContent));
   bad.click();assert.equal(studyStore.counts(u.scope).solved,1);studyStore.record(u.scope,saved,true);
  }
  el('compAll').click();assert.match(el('compSelectedStats').textContent,/175/);
  el('compNext').click();const total=studyStore.counts(units.map(u=>u.scope)).solved;
  el('comprehensiveView').hidden=true;doc.dispatch('keydown',{key:'1',target:doc.createElement('div')});el('compChoices').children[0].click();
  assert.equal(studyStore.counts(units.map(u=>u.scope)).solved,total);
 }finally{globalThis.document=oldDoc;globalThis.localStorage=oldStorage;}
});
