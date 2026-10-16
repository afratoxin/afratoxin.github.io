import test from 'node:test';import assert from 'node:assert/strict';
import {CNS_QUESTIONS,pickCnsQuestion} from './cns-data.mjs';
import {IMM_QUESTIONS,pickImmQuestion} from './immune-data.mjs';
import {ANTI_QUESTIONS,pickAntiQuestion} from './anticancer-data.mjs';
import {SIGNAL_QUESTIONS,pickSignalQuestion} from './signal31-data.mjs';
import {ADR12_QUESTIONS} from './adr12.mjs';import {ADR13_QUESTIONS} from './adr13.mjs';
import {ABX_QUESTIONS,pickAbxQuestion} from './abx-data.mjs';
import {CYP_CASES,makeCypCaseQuestion} from './cyp.mjs';
import {TRANSPORT_CASES,makeTransportSpecial} from './transport8.mjs';
import {registerLectureStudies} from './study-catalog.mjs';
import {createStudyStore,normalizeStudyQuestion} from './study-records.mjs';
const banks=[['cns',CNS_QUESTIONS,24],['immune',IMM_QUESTIONS,8],['anticancer',ANTI_QUESTIONS,8],['signal',SIGNAL_QUESTIONS,8],['adr12',ADR12_QUESTIONS,6],['adr13',ADR13_QUESTIONS,6],['abx',ABX_QUESTIONS,8],['cyp',CYP_CASES,3],['tx',TRANSPORT_CASES,3]];
test('아홉 단원의 상황→약물 문항이 다섯 선지·출처·해설을 갖추고 전체 문항집에 등록된다',()=>{
 const s=createStudyStore({getItem(){},setItem(){}});registerLectureStudies(s);
 for(const [scope,bank,min]of banks){const cases=bank.filter(q=>q.format==='clinical');assert.ok(cases.length>=min,scope+' clinical count');
  for(const q of cases){assert.equal(q.options.length,5,q.id);assert.equal(new Set(q.options).size,5);assert.ok(q.options.includes(q.answer));assert.ok(q.source&&q.note);assert.equal(q.details.length,5,q.id);
   for(const option of q.options)assert.equal(q.details.filter(t=>t.startsWith(option+':')).length,1,q.id+option);
   const d=s.definitions.get(scope);assert.ok(d.items.has(q.id),scope+q.id);const shown=normalizeStudyQuestion(d.build(q.id),{id:q.id});assert.equal(shown.choices[shown.answers[0]],q.answer);assert.equal(shown.details.length,5);
   s.record(scope,shown,false);assert.equal(s.status(scope,q.id),'wrong');s.record(scope,shown,true);assert.equal(s.status(scope,q.id),'correct');
  }
 }
});
test('면역·항암의 혼합 출제는 임상형 20%를 포함하고 표적 관계 중심 80%를 유지한다',()=>{
 for(const [name,pick]of [['immune',pickImmQuestion],['anticancer',pickAntiQuestion],['signal',pickSignalQuestion]]){
  let seed=319;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32),state={draws:0,seen:{},recent:[],subjects:[],lastGroup:null};let clinical=0,target=0;const cases=new Set();
  for(let i=0;i<1000;i++){const q=pick(state,'core','mixed',random);assert.equal(q.choices[q.answerIndex].text,q.answer);clinical+=q.format==='clinical';target+=q.kind==='target';if(q.format==='clinical')cases.add(q.id);
   state.draws++;state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.subjects=[q.subject,...state.subjects].slice(0,3);state.lastGroup=q.group;
  }
  assert.equal(clinical,200,name);assert.equal(target,800,name);assert.ok(cases.size>=8,name);assert.equal(pick(state,'core','clinical',random).format,'clinical');
 }
});
test('중추신경계·항생제의 혼합과 임상 전용 모드가 정답 섞기·복습을 유지한다',()=>{
 for(const [scope,pick]of [['cns',(s,r,mode)=>pickCnsQuestion(s,mode==='clinical'?'clinical':'all',r,'core')],['abx',(s,r,mode)=>pickAbxQuestion('general',s,'all','core',r,mode)]]){
  const state={draws:0,seen:{},recent:[],subjects:[],recentSubjects:[],lastGroup:null};let clinical=0;
  for(let i=0;i<400;i++){const q=pick(state,Math.random,'mixed');assert.equal(q.choices[q.answerIndex].text,q.answer);clinical+=q.format==='clinical';state.draws++;state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.subjects=[q.subject,...state.subjects].slice(0,3);state.recentSubjects=state.subjects;state.lastGroup=q.group;}
  assert.equal(clinical,100,scope);assert.equal(pick(state,Math.random,'clinical').format,'clinical');
 }
 for(const fact of CYP_CASES.filter(q=>q.format==='clinical'))assert.equal(makeCypCaseQuestion(fact).format,'clinical');
 for(const fact of TRANSPORT_CASES.filter(q=>q.format==='clinical'))assert.equal(makeTransportSpecial(fact).format,'clinical');
});
