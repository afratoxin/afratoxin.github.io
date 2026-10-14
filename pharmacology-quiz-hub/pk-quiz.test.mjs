import test from 'node:test';
import assert from 'node:assert/strict';
import {initPkQuiz} from './pk-quiz.mjs';
class Element{
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.listeners={};this.attributes={};this.hidden=false;this.value='all';this.textContent='';this.className='';this.classList={toggle:(c,on)=>{const s=new Set(this.className.split(' ').filter(Boolean));on?s.add(c):s.delete(c);this.className=[...s].join(' ');},add:c=>this.classList.toggle(c,true)};}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
  setAttribute(k,v){this.attributes[k]=v;}
  addEventListener(k,f){this.listeners[k]=f;}
  click(){this.listeners.click?.({target:this,preventDefault(){}});}
  dispatch(k){this.listeners[k]?.({target:this,preventDefault(){}});}
}
test('계산 화면의 채점·다음 문제·유형 선택·힌트·공식 탭 동작',()=>{
  const names=['pkView','pkQuizTab','pkFormulaTab','pkQuizPanel','pkFormulaPanel','pkTopic','pkProgress','pkStem','pkChoices','pkVisual','pkFeedback','pkNext','pkHintButton','pkHint','pkStats','pkSource','pkFormulaRows'];
  const els=Object.fromEntries(names.map(n=>[n,new Element()])),listeners={};
  globalThis.document={getElementById:id=>els[id],createElement:tag=>new Element(tag),createElementNS:(_,tag)=>new Element(tag),addEventListener:(k,f)=>{listeners[k]=f;}};
  const saved=new Map();globalThis.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
  const quiz=initPkQuiz();quiz.open();
  assert.equal(els.pkChoices.children.length,5);
  const before=els.pkStem.textContent;
  els.pkHintButton.click();assert.equal(els.pkHint.hidden,false);
  els.pkChoices.children[0].click();assert.equal(els.pkFeedback.hidden,false);assert.equal(els.pkNext.hidden,false);
  assert.ok(els.pkChoices.children.every(b=>b.disabled));
  els.pkNext.click();assert.notEqual(els.pkStem.textContent,before);assert.equal(els.pkHint.hidden,true);
  els.pkTopic.value='renal';els.pkTopic.dispatch('change');assert.match(els.pkStem.textContent,/신기능/);
  els.pkFormulaTab.click();assert.equal(els.pkQuizPanel.hidden,true);assert.equal(els.pkFormulaPanel.hidden,false);
  const total=JSON.parse([...saved.values()][0]).total;
  listeners.keydown({key:'1',target:new Element(),preventDefault(){}});
  assert.equal(JSON.parse([...saved.values()][0]).total,total);
  els.pkQuizTab.click();assert.equal(els.pkQuizPanel.hidden,false);
  els.pkChoices.children[0].click();listeners.keydown({key:'Enter',target:new Element(),preventDefault(){}});
  assert.equal(els.pkFeedback.hidden,true);
});
