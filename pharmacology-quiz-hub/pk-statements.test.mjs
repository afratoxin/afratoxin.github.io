import test from 'node:test';
import assert from 'node:assert/strict';
import {PK_TOPICS,PK_VARIANTS,pkQuestionId,makePkQuestion} from './pk-calculations.mjs';
import {initPkQuiz} from './pk-quiz.mjs';
import {createStudyStore} from './study-records.mjs';
import {registerLectureStudies} from './study-catalog.mjs';

test('계산 탭의 전체 목록은 16개 수치형이며 옛 정오 판별형을 생성하지 않는다',()=>{
 const ids=PK_TOPICS.flatMap(t=>PK_VARIANTS[t.id].map(v=>pkQuestionId(t.id,v)));
 assert.equal(ids.length,16);assert.ok(ids.every(id=>!id.includes('judge')));
 for(const t of PK_TOPICS)for(const v of PK_VARIANTS[t.id])assert.equal(makePkQuestion(t.id,()=>.3,v).format,'numeric');
});
test('실제 계산값·숫자 선지·풀이가 오답에 저장되고 이동한 유형도 등록·재시도된다',()=>{
 const disk=new Map(),storage={getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)};
 const store=createStudyStore(storage);registerLectureStudies(store);
 assert.equal(store.counts('pk').total,16);
 for(const [topic,variant]of [['tail','tail'],['tail','total'],['concentration','concentration']]){
  const q=makePkQuestion(topic,()=>.3,variant);
  assert.ok(store.definitions.get('pk').items.has(q.id),q.id);
  assert.equal(store.record('pk',q,false),true);
  const snapshot=store.wrong('pk').find(x=>x.id===q.id).question;
  assert.equal(snapshot.stem,q.stem);assert.deepEqual(snapshot.choices,q.choices.map(c=>c.text));
  assert.deepEqual(snapshot.answers,[q.answerIndex]);assert.deepEqual(snapshot.steps,q.steps);assert.equal(snapshot.formula,q.formula);
  store.record('pk',q,true);assert.ok(!store.wrong('pk').some(x=>x.id===q.id));
 }
 assert.equal(store.counts('pk').total,16);assert.equal(store.counts('pk').correct,3);
});
test('기존 저장된 오답은 수치와 단위를 포함한 당시 모습 그대로 보존한다',()=>{
 const disk=new Map(),storage={getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)},first=createStudyStore(storage);
 const raw={id:'auc:tail',stem:'마지막 농도가 3 mg/L, kₑ가 0.3 h⁻¹일 때 마지막 측정 이후 면적은?',choices:['5 mg·h/L','10 mg·h/L','15 mg·h/L','20 mg·h/L','25 mg·h/L'],answerIndex:1,steps:['3/0.3 = 10 mg·h/L']};
 first.register({id:'pk',items:['auc:tail','renal:auc','ke:judge-correct']});
 first.record('pk',raw,false);
 first.record('pk',{...raw,id:'renal:auc'},false);
 const reloaded=createStudyStore(storage);registerLectureStudies(reloaded);
 assert.equal(reloaded.counts('pk').total,16);assert.equal(reloaded.counts('pk').wrong,1);
 const saved=reloaded.wrong('pk')[0].question;
 assert.equal(saved.stem,raw.stem);assert.deepEqual(saved.choices,raw.choices);assert.deepEqual(saved.steps,raw.steps);
});
test('이동한 AUC 필터도 이전 출제 횟수로 균형을 잡고 제외된 풀이 수를 새 분모에 넣지 않는다',()=>{
 class Element{
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.listeners={};this.hidden=false;this.value='tail';this.textContent='';this.classList={add(){},toggle(){}};}
  append(...nodes){this.children.push(...nodes);} replaceChildren(...nodes){this.children=nodes;}
  setAttribute(){} addEventListener(k,f){this.listeners[k]=f;}
 }
 const names=['pkView','pkQuizTab','pkFormulaTab','pkQuizPanel','pkFormulaPanel','pkTopic','pkProgress','pkStem','pkChoices','pkVisual','pkFeedback','pkNext','pkHintButton','pkHint','pkStats','pkSource','pkFormulaRows'];
 const els=Object.fromEntries(names.map(n=>[n,new Element()]));
 const previousDocument=globalThis.document,previousStorage=globalThis.localStorage,previousRandom=Math.random;
 const data={seenVariants:{'auc:tail':2,'auc:total':0},attemptedVariants:{'auc:tail':2,'ke:judge-correct':1,'renal:auc':1}};
 const disk=new Map([['pharmacology-pk-calculations-v1',JSON.stringify(data)]]);
 globalThis.document={getElementById:id=>els[id],createElement:tag=>new Element(tag),addEventListener(){}};
 globalThis.localStorage={getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)};Math.random=()=>.99;
 try{
  initPkQuiz().open();
  assert.match(els.pkStem.textContent,/전체 AUC/);
  assert.match(els.pkStats.textContent,/풀이한 형태 1\/16/);
  assert.equal(els.pkFormulaRows.children.length,10);
  assert.ok(els.pkChoices.children.every(b=>/^\d+(\.\d+)?$/.test(b.children[1].textContent)));
  assert.match(els.pkSource.textContent,/본인 정리본 PDF 2쪽/);
 }finally{globalThis.document=previousDocument;globalThis.localStorage=previousStorage;Math.random=previousRandom;}
});
