import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createTestDocument} from './test-dom.mjs';
import {SYSTEMS_BANKS,pickSystemsQuestion} from './systems-data.mjs';
import {registerLectureStudies} from './study-catalog.mjs';
import {createStudyStore} from './study-records.mjs';
import {studyStore} from './study-records.mjs?v=20261015-review1';
import {initSystemsQuiz} from './systems-quiz.mjs';
import {buildUnderstandingBank} from './systems-builder.mjs';
import {SYSTEMS_CASES} from './systems-data.mjs';

test('각 40문항에서 원인 추론형 12개를 제공하고 정답 약물의 이름·별칭을 채점 전 노출하지 않는다',()=>{
 for(const [scope,bank]of Object.entries(SYSTEMS_BANKS)){
  assert.equal(bank.length,40);const causes=bank.filter(q=>q.format==='cause');assert.equal(causes.length,12,scope);
  assert.equal(bank.filter(q=>q.format==='judgment').length,28);
  for(const q of causes){
   assert.ok(q.id.startsWith(scope+'-cause:'));assert.ok(q.context.length>35);assert.ok(q.note.length>35);assert.match(q.stem,/약물|계열|물질/);
   assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);assert.equal(q.options.filter(x=>x===q.answer).length,1);
   const visible=[q.stem,q.source,q.exam,q.group].join(' ').toLowerCase();
   for(const alias of q.answerAliases)assert.ok(!visible.includes(alias.toLowerCase()),q.id+' leaks '+alias);
   assert.ok(q.answerAliases.includes(q.answer));assert.equal(q.details.length,5);assert.ok(q.details.every(d=>!d.includes('undefined')));
   for(const option of q.options)assert.equal(q.details.filter(d=>d.startsWith(option+':')).length,1);
  }
 }
});

test('1000회 혼합은 원인 추론형을 정확히 60% 내고 전 문항·모든 정답 위치를 순환한다',()=>{
 let seed=173;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
 for(const [scope,bank]of Object.entries(SYSTEMS_BANKS)){
  const state={draws:0,seen:{},recent:[],subjects:[],lastPolarity:null},positions=new Set();let count=0,lastJudgment;
  for(let i=0;i<1000;i++){
   const q=pickSystemsQuestion(scope,state,'all',random);assert.ok(q);assert.ok(!state.recent.includes(q.id));assert.ok(!state.subjects.includes(q.subject));
   assert.equal(q.choices[q.answerIndex].text,q.answer);positions.add(q.answerIndex);count+=q.format==='cause';
   if(q.format==='judgment'){if(lastJudgment)assert.notEqual(q.polarity,lastJudgment);lastJudgment=q.polarity;state.lastPolarity=q.polarity;}
   state.draws++;state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,4);state.subjects=[q.subject,...state.subjects].slice(0,3);
  }
  assert.equal(count,600,scope);assert.equal(Object.keys(state.seen).length,40);assert.equal(positions.size,5);
  assert.equal(pickSystemsQuestion(scope,state,'cause',random).format,'cause');
  assert.equal(pickSystemsQuestion(scope,state,'judgment',random).format,'judgment');
  assert.equal(pickSystemsQuestion(scope,state,'correct',random).polarity,'correct');
 }
});

test('독립 정답표와 강의 핵심 구별점은 정·오 선지의 위치와 무관하다',()=>{
 const key={endocrine:{'fasting-hypoglycemia':'Sulfonylurea계','insulin-deficient':'Insulin','renal-lactate':'Metformin','hepatic-production':'Metformin','fluid-weight':'Thiazolidinedione계','slow-sensitizing':'Thiazolidinedione계','intestinal-gas':'α-Glucosidase 억제제','starch-challenge':'α-Glucosidase 억제제','satiety-nausea':'GLP-1 수용체 작용제','glucosuria-volume':'SGLT2 억제제','glucosuria-infection':'SGLT2 억제제','endogenous-incretin':'DPP-4 억제제'},renal:{'bicarbonate-loss':'Acetazolamide','ammonia-retention':'Acetazolamide','phosphate-stone':'Acetazolamide','calcium-magnesium-loss':'Furosemide','tetany-after-diuresis':'Furosemide','concentrating-gradient':'Furosemide','low-calcium-urine':'Thiazide','calcium-direction':'Thiazide','steroid-off-target':'Spironolactone','aldosterone-response':'Spironolactone','rapid-luminal':'Amiloride','osmotic-volume':'Mannitol'},cardio:{'ion-coupling':'Digoxin','potassium-sensitivity':'Digoxin','after-repolarization':'Digoxin','pulse-renin':'Propranolol','stress-response':'Esmolol','nodal-upstroke':'Verapamil','transient-hyperpolarization':'Adenosine','moderate-recovery':'Procainamide','short-recovery':'Lidocaine','slow-recovery':'Flecainide','delayed-repolarization':'Sotalol','peptide-profile':'ACE 억제제'}};
 for(const [scope,rows]of Object.entries(key))for(const [id,answer]of Object.entries(rows))assert.equal(SYSTEMS_BANKS[scope].find(q=>q.id===scope+'-cause:'+id)?.answer,answer,scope+id);
 const betaOptions=new Set(['Propranolol','Esmolol','Sotalol']);
 for(const id of ['pulse-renin','stress-response'])assert.equal(SYSTEMS_BANKS.cardio.find(q=>q.id==='cardio-cause:'+id).options.filter(x=>betaOptions.has(x)).length,1);
});

test('남긴 판별형 ID의 원래 정답·선지와 최신 오답은 그대로이며 교체 문항을 새 정답으로 간주하지 않는다',()=>{
 const disk=new Map(),s=createStudyStore({getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)});
 for(const [scope,cases]of Object.entries(SYSTEMS_CASES)){
  const old=buildUnderstandingBank(scope,cases),retained=SYSTEMS_BANKS[scope].filter(q=>q.format==='judgment');
  assert.equal(retained.length,28);
  for(const q of retained)assert.deepEqual(q,old.find(x=>x.id===q.id),q.id);
  const removed=old.find(q=>!retained.some(x=>x.id===q.id));
  s.register({id:scope,items:old.map(q=>q.id),build:id=>old.find(q=>q.id===id)});s.record(scope,retained[0],false);s.record(scope,removed,false);
 }
 registerLectureStudies(s);
 for(const scope of Object.keys(SYSTEMS_BANKS)){
  assert.equal(s.counts(scope).total,40);assert.equal(s.counts(scope).wrong,1);assert.equal(s.counts(scope).unanswered,39);
  assert.ok(s.wrong(scope)[0].id.includes('-understanding:'));
 }
});

test('원인 추론형과 남긴 판별형은 같은 40문항 분모에서 실제 오답과 선택지 순서를 보존한다',()=>{
 const s=createStudyStore({getItem(){},setItem(){}});registerLectureStudies(s);
 for(const [scope,bank]of Object.entries(SYSTEMS_BANKS)){
  const q=bank.find(q=>q.format==='cause'),choices=[...q.options].reverse(),shown={...q,choices,answerIndex:choices.indexOf(q.answer)};
  assert.equal(s.counts(scope).total,40);s.record(scope,shown,false);const saved=s.wrong(scope)[0].question;
  assert.equal(saved.id,q.id);assert.equal(saved.stem,q.stem);assert.deepEqual(saved.choices,choices);assert.deepEqual(saved.details,q.details);
  assert.equal(saved.choices[saved.answers[0]],q.answer);s.record(scope,saved,true);assert.equal(s.wrong(scope).length,0);
 }
});

test('실제 세 화면은 원인 전용·판별 전용과 빈 필터를 처리하고 숨겨진 문제를 채점하지 않는다',async()=>{
 const doc=createTestDocument(await readFile(new URL('index.html',import.meta.url),'utf8')),disk=new Map();globalThis.document=doc;globalThis.localStorage={getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)};registerLectureStudies();
 for(const scope of ['endocrine','renal','cardio']){
  const el=s=>doc.getElementById(scope+s);el('View').hidden=false;
  assert.ok(el('Mode').children.some(o=>o.value==='cause'));el('Mode').value='cause';const ui=initSystemsQuiz(scope);ui.open();
  assert.match(el('Polarity').textContent,/원인/);const q=SYSTEMS_BANKS[scope].find(q=>q.stem===el('Stem').textContent);assert.equal(q.format,'cause');
  const choices=el('Choices').children.map(b=>b.children[1].textContent);el('Choices').children[choices.findIndex(x=>x!==q.answer)].click();assert.equal(studyStore.status(scope,q.id),'wrong');
  assert.equal(el('Feedback').querySelectorAll('li').length,5);const solved=studyStore.counts(scope).solved;
  el('Area').value='nonexistent';el('Area').dispatch('change');assert.equal(el('Choices').children.length,0);assert.match(el('Stem').textContent,/문항이 없습니다/);
  doc.dispatch('keydown',{key:'1',target:doc.createElement('div')});assert.equal(studyStore.counts(scope).solved,solved);
  el('Area').value='all';el('Mode').value='judgment';el('Mode').dispatch('change');assert.equal(el('Choices').children.length,5);assert.match(el('Polarity').textContent,/옳/);
  el('View').hidden=true;doc.dispatch('keydown',{key:'1',target:doc.createElement('div')});assert.equal(studyStore.counts(scope).solved,solved);
 }
});
