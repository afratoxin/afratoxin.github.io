import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createTestDocument} from './test-dom.mjs';
import {registerLectureStudies} from './study-catalog.mjs';
import {studyStore} from './study-records.mjs?v=20261015-review1';
import {initCypQuiz,CYP_CASES} from './cyp.mjs';
import {initTransportQuiz,TRANSPORT_CASES} from './transport8.mjs';
import {initCnsQuiz} from './cns-quiz.mjs';
import {CNS_QUESTIONS} from './cns-data.mjs';
import {initImmuneQuiz} from './immune-quiz.mjs';
import {IMM_QUESTIONS} from './immune-data.mjs';
import {initAnticancerQuiz} from './anticancer-quiz.mjs';
import {ANTI_QUESTIONS} from './anticancer-data.mjs';
import {initSignalQuiz} from './signal31-quiz.mjs';
import {SIGNAL_QUESTIONS} from './signal31-data.mjs';
import {initAbxQuiz} from './abx-quiz.mjs';
import {ABX_QUESTIONS} from './abx-data.mjs';
import {initAutonomicQuiz} from './autonomic-quiz.mjs';
import {ADR12_QUESTIONS} from './adr12.mjs';
import {ADR13_QUESTIONS} from './adr13.mjs';

const html=await readFile(new URL('index.html',import.meta.url),'utf8');
function fixture(){
 const doc=createTestDocument(html),disk=new Map();
 globalThis.document=doc;
 globalThis.localStorage={getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)};
 globalThis.CSS={escape:s=>s};
 registerLectureStudies();
 return {doc,el:id=>doc.getElementById(id)};
}
function shown(el,prefix,bank){
 const fact=bank.find(q=>q.stem===el(prefix+'Stem').textContent);
 assert.equal(fact?.format,'clinical',prefix+' 임상 전용 모드가 기존 유형으로 바뀌면 안 된다');
 const choices=el(prefix+'Choices').children.map(b=>b.children.at(-1).textContent);
 assert.equal(choices.length,5);assert.equal(new Set(choices).size,5);
 assert.ok(choices.includes(fact.answer));
 return {fact,choices};
}
function missAndCheck(el,scope,prefix,bank){
 const {fact,choices}=shown(el,prefix,bank),wrong=choices.findIndex(x=>x!==fact.answer);
 el(prefix+'Choices').children[wrong].click();
 assert.equal(el(prefix+'Feedback').hidden,false);
 assert.ok(el(prefix+'Choices').children.every(b=>b.disabled));
 const saved=studyStore.wrong(scope).find(q=>q.id===fact.id)?.question;
 assert.ok(saved,scope+' actual graded ID must be in review');
 assert.equal(saved.stem,fact.stem);assert.deepEqual(saved.choices,choices);
 assert.equal(saved.choices[saved.answers[0]],fact.answer);
 assert.equal(saved.source,fact.source);assert.equal(saved.note,fact.note);
 assert.deepEqual([...saved.details].sort(),[...fact.details].sort());
 for(const option of choices)assert.equal(saved.details.filter(x=>x.startsWith(option+':')).length,1);
 for(const detail of fact.details)assert.ok(el(prefix+'Feedback').textContent.includes(detail));
 return {fact,choices};
}

for(const [scope,view,init,bank]of [
 ['tx','txView',initTransportQuiz,TRANSPORT_CASES],
 ['cyp','cypView',initCypQuiz,CYP_CASES]
])test(scope+' 임상 전용 모드는 열 번 연속 다음 문제에서도 임상형·최신 오답·전체 분모를 유지한다',()=>{
 const {doc,el}=fixture();el(view).hidden=false;
 const select=el(scope+'QuestionType');
 assert.ok(select.children.some(o=>o.value==='clinical'),'actual HTML option');
 select.value='clinical';const quiz=init();quiz.open(scope==='cyp'?'cyp':undefined);
 const denominator=studyStore.counts(scope).total;let previous=null;
 for(let i=0;i<10;i++){
  const {fact}=missAndCheck(el,scope,scope,bank);
  assert.notEqual(fact.id,previous,'연속해서 같은 문항을 내지 않는다');previous=fact.id;
  assert.equal(studyStore.counts(scope).total,denominator);
  const stem=el(scope+'Stem').textContent;
  const native=doc.dispatch('keydown',{key:'Enter',target:el(scope+'Next')});
  assert.ok(!native.defaultPrevented);assert.equal(el(scope+'Stem').textContent,stem);
  el(scope+'Next').click();
 }
 const count=studyStore.counts(scope).solved;select.dispatch('change');
 assert.equal(studyStore.counts(scope).solved,count,'출제 방식 변경은 풀이로 세지 않는다');
 el(view).hidden=true;doc.dispatch('keydown',{key:'1',target:doc.createElement('div')});
 assert.equal(studyStore.counts(scope).solved,count,'숨겨진 화면에서는 키보드로 채점하지 않는다');
});

test('나머지 일곱 단원의 실제 임상 선택기·다섯 선지·선지 해설·오답 저장이 함께 동작한다',()=>{
 const {doc,el}=fixture();
 const units=[
  ['cns','cns','cnsView','cnsArea',initCnsQuiz,CNS_QUESTIONS],
  ['immune','imm','immuneView','immMode',initImmuneQuiz,IMM_QUESTIONS],
  ['anticancer','anti','anticancerView','antiMode',initAnticancerQuiz,ANTI_QUESTIONS],
  ['signal','sig','signalView','sigMode',initSignalQuiz,SIGNAL_QUESTIONS],
  ['abx','abx','abxView','abxQuestionType',initAbxQuiz,ABX_QUESTIONS],
  ...[['adr12',ADR12_QUESTIONS],['adr13',ADR13_QUESTIONS]].map(([scope,bank])=>
   [scope,scope,scope+'View',scope+'QuestionType',()=>initAutonomicQuiz({prefix:scope,viewId:scope+'View',bank,storageKey:'clinical-ui-'+scope}),bank])
 ];
 for(const [scope,prefix,view,selector,init,bank]of units){
  el(view).hidden=false;const select=el(selector);
  assert.ok(select.children.some(o=>o.value==='clinical'),selector+' actual HTML option');
  select.value='clinical';const quiz=init();quiz.open();if(scope==='abx')el('abxQuizTab').click();
  missAndCheck(el,scope,prefix,bank);
  assert.equal(studyStore.counts(scope).total,bank.length,'전체 문항집을 분모로 유지한다');
  if(el(prefix+'Source'))assert.ok(el(prefix+'Source').textContent);
  const count=studyStore.counts(scope).solved;select.dispatch('change');
  assert.equal(studyStore.counts(scope).solved,count,'출제 방식 변경은 풀이로 세지 않는다');
  el(view).hidden=true;doc.dispatch('keydown',{key:'1',target:doc.createElement('div')});
  assert.equal(studyStore.counts(scope).solved,count,'숨겨진 화면에서는 키보드로 채점하지 않는다');
 }
});

test('CYP 임상형의 번호별 해설은 화면에서 섞인 같은 번호 약물을 설명한다',()=>{
 const {el}=fixture(),originalRandom=Math.random;
 try{
  Math.random=()=>0.31;el('cypQuestionType').value='clinical';initCypQuiz().open('cyp');
  const {choices}=shown(el,'cyp',CYP_CASES);el('cypChoices').children[0].click();
  const rows=el('cypFeedback').querySelectorAll('li');
  assert.equal(rows.length,5);
  for(const [i,symbol]of ['①','②','③','④','⑤'].entries())assert.ok(rows[i].textContent.startsWith(`${symbol} ${choices[i]}:`),rows[i].textContent+' / '+choices[i]);
 }finally{Math.random=originalRandom;}
});
