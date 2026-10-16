import test from 'node:test';
import assert from 'node:assert/strict';
import {PK_TOPICS,PK_VARIANTS,makePkQuestion} from './pk-calculations.mjs';
import {initPkQuiz} from './pk-quiz.mjs';
import {createStudyStore} from './study-records.mjs';

test('10개 약동학 주제에 수치형 21개를 보존하고 판단형 20개를 추가',()=>{
  assert.equal(Object.values(PK_VARIANTS).flat().filter(v=>!v.startsWith('judge-')).length,21);
  assert.equal(Object.values(PK_VARIANTS).flat().length,41);
  for(const topic of PK_TOPICS)assert.deepEqual(PK_VARIANTS[topic.id].filter(v=>v.startsWith('judge-')),['judge-correct','judge-incorrect']);
});

test('판단형은 다섯 독립 명제를 비교하며 발문에 맞는 정답 하나와 전체 보기 해설 제공',()=>{
  let seed=741;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(const topic of PK_TOPICS)for(const polarity of ['correct','incorrect']){
    const positions=new Set(),keyedEntities=new Set();
    for(let i=0;i<80;i++){
      const q=makePkQuestion(topic.id,random,`judge-${polarity}`);
      assert.equal(q.id,`${topic.id}:judge-${polarity}`);
      assert.equal(q.format,'judgment');assert.equal(q.polarity,polarity);
      assert.match(q.stem,polarity==='correct'?/옳은 것은\?/:/옳지 않은 것은\?/);
      assert.equal(q.pairs.length,5);assert.equal(new Set(q.pairs.map(p=>p.left)).size,5);
      assert.equal(q.pairs.filter(p=>p.valid).length,polarity==='correct'?1:4);
      assert.equal(q.choices.length,5);assert.equal(new Set(q.choices.map(c=>c.text)).size,5);
      assert.equal(q.choices.filter(c=>c.correct).length,1);
      assert.equal(q.choices[q.answerIndex].text,q.answer);
      const chosen=q.pairs.find(p=>p.left+' — '+p.right===q.answer);
      assert.equal(chosen.valid,polarity==='correct');
      keyedEntities.add(chosen.entity);
      assert.ok(q.choices.every(c=>c.reason.includes('바른 연결:')&&c.reason.includes('PDF')));
      assert.ok(q.steps.length>=3&&q.formula&&q.source);
      assert.equal(q.details.length,5);assert.ok(q.details.every(d=>d.includes('바른 연결:')));
      positions.add(q.answerIndex);
    }
    assert.equal(positions.size,5,topic.id+':'+polarity);
    assert.equal(keyedEntities.size,5,'five keyed propositions: '+topic.id+':'+polarity);
  }
});

test('기본 가정·IV/경구 구분·AUC 꼬리와 CL/V 관계가 판단형에도 명시',()=>{
  for(const topic of PK_TOPICS){const q=makePkQuestion(topic.id,()=>0,'judge-incorrect');assert.match(q.stem,/선형.*1구획.*1차 소실/);}
  const ke=makePkQuestion('ke',()=>0,'judge-correct');
  assert.equal(ke.pairs[0].correctRight,'CL/V');
  const auc=makePkQuestion('auc',()=>0,'judge-correct');
  assert.equal(auc.pairs[0].correctRight,'C_last/kₑ');
  assert.match(makePkQuestion('clearance',()=>0,'judge-correct').pairs.map(p=>p.left).join(' '),/정맥.*경구/);
  assert.match(makePkQuestion('clearance',()=>0,'judge-incorrect').stem,/0<F<1/);
  assert.match(makePkQuestion('renal',()=>0,'judge-incorrect').stem,/0<fₑ<1.*0<g<1/);
});

test('판단형 오답은 실제 표시 순서와 전체 진위 해설을 보존하고 맞히면 제거',()=>{
  const storage=new Map(),store=createStudyStore({getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)});
  for(const topic of PK_TOPICS)for(const polarity of ['correct','incorrect']){
    const q=makePkQuestion(topic.id,()=>.3,`judge-${polarity}`);
    store.register({id:'pk',title:'약동학',route:'pk',items:[q.id]});
    assert.equal(store.record('pk',q,false),true);
    const snapshot=store.wrong('pk')[0].question;
    assert.deepEqual(snapshot.choices,q.choices.map(c=>c.text));
    assert.deepEqual(snapshot.answers,[q.answerIndex]);
    assert.deepEqual(snapshot.details,q.details);
    assert.deepEqual(snapshot.steps,q.steps);
    store.record('pk',q,true);assert.equal(store.wrong('pk').length,0);
  }
});

test('판단형 화면은 정답 여부와 관계없이 다섯 명제의 진위와 수정 해설을 모두 표시',()=>{
  class Element{
    constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.listeners={};this.hidden=false;this.value='renal';this.textContent='';this.classList={add(){},toggle(){}};}
    append(...nodes){this.children.push(...nodes);}
    replaceChildren(...nodes){this.children=nodes;}
    setAttribute(){}
    addEventListener(k,f){this.listeners[k]=f;}
    click(){this.listeners.click?.({target:this,preventDefault(){}});}
  }
  const names=['pkView','pkQuizTab','pkFormulaTab','pkQuizPanel','pkFormulaPanel','pkTopic','pkProgress','pkStem','pkChoices','pkVisual','pkFeedback','pkNext','pkHintButton','pkHint','pkStats','pkSource','pkFormulaRows'];
  const els=Object.fromEntries(names.map(n=>[n,new Element()]));
  const previousDocument=globalThis.document,previousStorage=globalThis.localStorage;
  globalThis.document={getElementById:id=>els[id],createElement:tag=>new Element(tag),addEventListener(){}};
  try{
    for(const polarity of ['correct','incorrect']){
      const seenVariants=Object.fromEntries(PK_VARIANTS.renal.map(v=>[`renal:${v}`,v===`judge-${polarity}`?0:1]));
      const saved=new Map([['pharmacology-pk-calculations-v1',JSON.stringify({seenVariants})]]);
      globalThis.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
      initPkQuiz().open();
      assert.match(els.pkStem.textContent,polarity==='correct'?/옳은 것은\?/:/옳지 않은 것은\?/);
      els.pkChoices.children[0].click();
      const details=els.pkFeedback.children[2],list=details.children[1];
      assert.equal(details.open,true);
      assert.equal(details.children[0].textContent,'보기별 진위와 바른 관계 확인');
      assert.equal(list.children.length,5);
      const texts=list.children.map(li=>li.textContent);
      assert.ok(texts.every(t=>t.includes('바른 연결:')&&t.includes('약동학(3) PDF 15쪽')));
      assert.equal(texts.filter(t=>t.includes(': 옳은 연결.')).length,polarity==='correct'?1:4);
      assert.equal(texts.filter(t=>t.includes(': 옳지 않은 연결.')).length,polarity==='correct'?4:1);
    }
  }finally{globalThis.document=previousDocument;globalThis.localStorage=previousStorage;}
});
