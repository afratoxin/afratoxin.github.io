import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const api=await import('./cns-quiz.mjs').catch(()=>({}));

function fixture(html){
  const ids=new Map(),listeners={};
  class Element{
    constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.listeners={};this.attributes={};this.dataset={};this.hidden=false;this.value='all';this.className='';this._text='';this.style={setProperty(){}};this.classList={add:(...c)=>c.forEach(x=>this.classList.toggle(x,true)),remove:(...c)=>c.forEach(x=>this.classList.toggle(x,false)),contains:c=>this.className.split(' ').includes(c),toggle:(c,on)=>{const s=new Set(this.className.split(' ').filter(Boolean));on??=!s.has(c);on?s.add(c):s.delete(c);this.className=[...s].join(' ');}};}
    set id(v){this._id=v;ids.set(v,this);}get id(){return this._id;}
    set textContent(v){this._text=String(v);this.replaceChildren();}get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}
    append(...nodes){for(const n of nodes){if(n.fragment){this.append(...[...n.children]);continue;}if(n.parentNode)n.parentNode.children=n.parentNode.children.filter(x=>x!==n);this.children.push(n);n.parentNode=this;}}
    replaceChildren(...nodes){this.children.forEach(n=>{n.parentNode=null;});this.children=[];this.append(...nodes);}
    setAttribute(k,v){this.attributes[k]=v;}
    addEventListener(k,f){(this.listeners[k]??=[]).push(f);}
    dispatch(k,extra={}){const e={target:this,preventDefault(){},stopPropagation(){},...extra};for(const f of this.listeners[k]||[])f(e);}
    click(){if(!this.disabled)this.dispatch('click');}
    contains(n){return n===this||this.children.some(c=>c.contains(n));}
    closest(selector){if(selector.startsWith('.')&&this.classList.contains(selector.slice(1)))return this;return this.parentNode?.closest(selector)||null;}
    querySelector(selector){const match=selector.match(/^\[data-category="(.*)"\] \.zone-chips$/);if(match){const zone=this.children.find(c=>c.dataset.category===match[1]);return zone?.querySelector('.zone-chips');}for(const c of this.children){if(selector.startsWith('.')&&c.classList.contains(selector.slice(1)))return c;const found=c.querySelector(selector);if(found)return found;}return null;}
  }
  for(const [,id] of html.matchAll(/id="(cns[^"]+)"/g)){const e=new Element(id.includes('Filter')||id==='cnsArea'?'select':'div');e.id=id;}
  const saved=new Map();
  globalThis.document={getElementById:id=>ids.get(id),createElement:tag=>new Element(tag),createDocumentFragment:()=>Object.assign(new Element(),{fragment:true}),addEventListener:(k,f)=>{listeners[k]=f;}};
  globalThis.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
  globalThis.CSS={escape:x=>x};
  return {ids,listeners,Element,saved};
}

test('객관식 영역 선택·채점·키보드와 드래그 3개 탭이 함께 작동한다',async()=>{
  assert.equal(typeof api.initCnsQuiz,'function','중추신경계 화면을 구현해야 합니다');
  const html=await readFile(new URL('index.html',import.meta.url),'utf8');
  const {ids,listeners,Element,saved}=fixture(html),el=id=>ids.get(id);
  const quiz=api.initCnsQuiz();quiz.open();
  assert.equal(el('cnsChoices').children.length,5);
  el('cnsArea').value='effect';el('cnsArea').dispatch('change');
  assert.match(el('cnsStem').textContent,/연결.*옳/);assert.match(el('cnsChoices').textContent,/흥분성|억제성/);
  el('cnsChoices').children[0].click();assert.equal(el('cnsFeedback').hidden,false);
  assert.ok(el('cnsChoices').children.every(b=>b.disabled));assert.equal(el('cnsNext').hidden,false);
  const firstTotal=JSON.parse([...saved.values()][0]).total;
  el('cnsChoices').children[1].click();assert.equal(JSON.parse([...saved.values()][0]).total,firstTotal);
  let prevented=false;
  listeners.keydown({key:'Enter',target:{tagName:'BUTTON',id:'cnsStructureTab'},preventDefault(){prevented=true;}});
  assert.equal(prevented,false,'탭 버튼의 기본 Enter 동작을 가로채지 않아야 합니다');
  assert.equal(el('cnsFeedback').hidden,false,'탭의 Enter 입력으로 다음 문항을 출제하지 않아야 합니다');
  listeners.keydown({key:'Enter',target:new Element(),preventDefault(){}});assert.equal(el('cnsFeedback').hidden,true);
  el('cnsStructureTab').click();assert.equal(el('cnsQuizPanel').hidden,true);
  assert.equal(el('cnsStructureCards').children.length,45);
  const gaba=el('cnsStructureCards').children.find(x=>x.textContent==='GABA_B 수용체');gaba.click();
  const gpcr=el('cnsStructureZones').children.find(x=>x.dataset.category.startsWith('Metabotropic'));gpcr.click();
  assert.ok(gpcr.querySelector('.zone-chips').children.includes(gaba));
  el('cnsStructureCheck').click();assert.match(el('cnsStructureDragStatus').textContent,/1개 정답/);
  el('cnsStructureReset').click();assert.equal(el('cnsStructureCheck').hidden,false);
  el('cnsStructureFilter').value='아세틸콜린';el('cnsStructureFilter').dispatch('change');
  assert.equal(el('cnsStructureCards').children.length,6);
  listeners.keydown({key:'1',target:new Element(),preventDefault(){}});assert.equal(JSON.parse([...saved.values()][0]).total,firstTotal);
  el('cnsEffectTab').click();assert.equal(el('cnsEffectCards').children.length,46);
  el('cnsDiseaseTab').click();assert.equal(el('cnsDiseaseCards').children.length,84);
  const diazepam=el('cnsDiseaseCards').children.find(x=>x.textContent==='Diazepam');diazepam.click();
  el('cnsDiseaseZones').children.find(x=>x.dataset.category==='뇌전증').click();
  el('cnsDiseaseCheck').click();assert.match(el('cnsDiseaseDragStatus').textContent,/1개 정답/);
  el('cnsQuizTab').click();assert.equal(el('cnsQuizPanel').hidden,false);
  listeners.keydown({key:'1',target:new Element(),preventDefault(){}});assert.equal(JSON.parse([...saved.values()][0]).total,firstTotal+1);
});

test('기존 단일 정답 매칭은 같은 방식으로 채점한다',async()=>{
  const {createMatchBoard}=await import('./match-board.mjs');
  const html=['Pool','Cards','Zones','DragStatus','Check','Reset'].map(n=>`id="cnsLegacy${n}"`).join(' ');
  const {ids}=fixture(html),el=n=>ids.get('cnsLegacy'+n);
  createMatchBoard({poolId:'cnsLegacyPool',cardsId:'cnsLegacyCards',zonesId:'cnsLegacyZones',statusId:'cnsLegacyDragStatus',checkId:'cnsLegacyCheck',resetId:'cnsLegacyReset',items:[{drug:'X',category:'A'},{drug:'Y',category:'B'}],categoryOf:x=>x.category,keyOf:x=>x.drug,labelOf:x=>x.drug,onGrade:()=>{}}).open();
  el('Cards').children.find(x=>x.textContent==='X').click();el('Zones').children.find(x=>x.dataset.category==='B').click();
  el('Check').click();assert.match(el('DragStatus').textContent,/0개 정답/);
  el('Reset').click();el('Zones').children.find(x=>x.dataset.category==='B').querySelector('.zone-chips').children[0].click();el('Zones').children.find(x=>x.dataset.category==='A').click();el('Check').click();
  assert.match(el('DragStatus').textContent,/1개 정답/);
});
