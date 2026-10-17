import test from 'node:test';
import assert from 'node:assert/strict';
import {ABX_DRUGS,ABX_SIMPLE,ABX_QUESTIONS,pickAbxQuestion} from './abx-data.mjs';
import {createStudyStore,STUDY_KEY} from './study-records.mjs';
import {registerLectureStudies} from './study-catalog.mjs';

test('중복과 확장 범위를 실제 문항집에서 덜어내 47개 단순 대응·50개 종합 문항만 남긴다',()=>{
 assert.equal(ABX_DRUGS.length,47);assert.equal(ABX_SIMPLE.length,47);assert.equal(ABX_QUESTIONS.length,50);
 assert.equal(new Set(ABX_SIMPLE.map(q=>q.subject)).size,47);
 assert.equal(ABX_QUESTIONS.filter(q=>q.kind==='feature').length,30);
 assert.equal(ABX_QUESTIONS.filter(q=>q.format==='clinical').length,12);
 assert.equal(new Set(ABX_QUESTIONS.filter(q=>q.kind==='feature').map(q=>q.featureGroup)).size,10);
 assert.equal(ABX_QUESTIONS.filter(q=>q.polarity==='correct').length,15);
 assert.equal(ABX_QUESTIONS.filter(q=>q.polarity==='incorrect').length,15);
 for(const lecture of [23,24,25,26,27])assert.ok(ABX_QUESTIONS.some(q=>q.lecture===lecture));
 for(const q of [...ABX_SIMPLE,...ABX_QUESTIONS]){
  assert.ok(q.core);assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);assert.ok(q.options.includes(q.answer));assert.ok(q.note&&q.source);
 }
});

test('새 특징 판별은 양 극성의 단일정답·전 선지 해설과 강의·족보·정리 근거를 가진다',()=>{
 const clinicalKey={'statin':'Azithromycin','urine':'Moxifloxacin','vestibular':'Minocycline','red-fluid':'Rifampin','optic':'Ethambutol','gray-baby':'Chloramphenicol','fungal-kidney':'Amphotericin B'};
 for(const [id,answer]of Object.entries(clinicalKey))assert.equal(ABX_QUESTIONS.find(q=>q.id==='clinical-abx-feature-'+id)?.answer,answer);
 for(const q of ABX_QUESTIONS.filter(q=>q.kind==='feature')){
  assert.equal(q.pairs.length,5);assert.equal(q.pairs.filter(p=>p.valid).length,q.polarity==='correct'?1:4);
  assert.equal(q.pairs.find(p=>q.answer===p.left+' — '+p.right).valid,q.polarity==='correct');
  assert.match(q.source,/강의록 PDF/);assert.ok(q.prioritySources.some(s=>s.includes('정리')));assert.ok(q.exam);
  for(const option of q.options)assert.equal(q.details.filter(d=>d.startsWith(option+':')).length,1);
 }
 for(const q of ABX_QUESTIONS.filter(q=>q.format==='clinical')){
  assert.equal(q.details.length,5);for(const option of q.options)assert.equal(q.details.filter(d=>d.startsWith(option+':')).length,1);
 }
});

test('축약해도 보존 문항의 최신 오답은 유지되며 제외된 기록은 삭제하거나 분모에 넣지 않는다',()=>{
 const disk=new Map(),storage={getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)};
 const s=createStudyStore(storage);const kept=ABX_SIMPLE[0],removed={id:'abx-simple-judgment:gentamicin:30s:correct',stem:'이전 문제',options:['a','b','c','d','e'],answer:'a'};
 s.register({id:'abx-simple',items:[kept.id,removed.id],build:id=>id===kept.id?kept:removed});s.record('abx-simple',kept,false);s.record('abx-simple',removed,false);
 registerLectureStudies(s);assert.equal(s.counts('abx-simple').total,47);assert.equal(s.counts('abx').total,50);
 assert.equal(s.wrong('abx-simple').length,1);assert.equal(s.wrong('abx-simple')[0].id,kept.id);
 assert.equal(JSON.parse(disk.get(STUDY_KEY)).records['abx-simple'][removed.id].status,'wrong');
 s.record('abx-simple',kept,true);assert.equal(s.wrong('abx-simple').length,0);
});

test('1000회 회독에서 축약한 전 문항과 모든 정답 위치를 사용하고 특징 전용도 제공한다',()=>{
 let seed=312;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
 for(const [kind,bank]of [['simple',ABX_SIMPLE],['general',ABX_QUESTIONS]]){
  const state={draws:0,seen:{},recent:[],subjects:[]},positions=new Set();let clinical=0;
  for(let i=0;i<1000;i++){
   const q=pickAbxQuestion(kind,state,'all','core',random,'mixed');assert.ok(!state.recent.includes(q.id));assert.ok(!state.subjects.includes(q.subject));assert.equal(q.choices[q.answerIndex].text,q.answer);positions.add(q.answerIndex);clinical+=q.format==='clinical';
   state.draws++;state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.subjects=[q.subject,...state.subjects].slice(0,3);state.lastGroup=q.group;
  }
  assert.equal(Object.keys(state.seen).length,bank.length);assert.equal(positions.size,5);if(kind==='general')assert.equal(clinical,250);
 }
 for(const lecture of [24,25,26,27]){
  const q=pickAbxQuestion('general',{},String(lecture),'core',random,'features');assert.equal(q.kind,'feature');assert.equal(q.lecture,lecture);
 }
 assert.equal(pickAbxQuestion('general',{},'23','core',random,'clinical'),null);
});
