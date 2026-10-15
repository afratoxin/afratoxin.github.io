import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const api=await import('./immune-quiz.mjs').catch(()=>({}));
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
  for(const [,id] of html.matchAll(/id="(imm[^"]+)"/g)){const e=new Element(id.includes('Filter')||id==='immArea'?'select':'div');e.id=id;}
  const saved=new Map();
  globalThis.document={getElementById:id=>ids.get(id),createElement:tag=>new Element(tag),createDocumentFragment:()=>Object.assign(new Element(),{fragment:true}),addEventListener:(k,f)=>{listeners[k]=f;}};
  globalThis.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
  globalThis.CSS={escape:x=>x};
  return {ids,listeners,Element,saved};
}


test('빈출·표적 선택, 채점, 키보드, 드래그, 암기표가 함께 작동한다',async()=>{
  assert.equal(typeof api.initImmuneQuiz,'function','면역억제제 화면을 구현해야 합니다');
  const html=await readFile(new URL('index.html',import.meta.url),'utf8');
  const {ids,listeners,Element,saved}=fixture(html),el=id=>ids.get(id);
  el('immScope').value='core';el('immMode').value='mixed';el('immMatchFilter').value='core';el('immTableFilter').value='core';
  const quiz=api.initImmuneQuiz();quiz.open();assert.equal(el('immChoices').children.length,5);
  assert.ok(el('immExam').textContent);el('immChoices').children[0].click();assert.equal(el('immFeedback').hidden,false);
  const first=JSON.parse([...saved.values()][0]).total;el('immChoices').children[1].click();assert.equal(JSON.parse([...saved.values()][0]).total,first);
  let prevented=false;listeners.keydown({key:'Enter',target:{tagName:'BUTTON'},preventDefault(){prevented=true;}});assert.equal(prevented,false);
  listeners.keydown({key:'Enter',target:new Element(),preventDefault(){}});assert.equal(el('immFeedback').hidden,true);
  el('immScope').value='all';el('immScope').dispatch('change');el('immMode').value='target';el('immMode').dispatch('change');assert.match(el('immProgress').textContent,/표적·매칭/);
  el('immDragTab').click();assert.equal(el('immQuizPanel').hidden,true);
  const core=el('immCards').children.length;assert.ok(core>15);
  const abat=el('immCards').children.find(c=>c.textContent==='Abatacept (CTLA-4-Ig)');abat.click();
  el('immZones').children.find(z=>z.dataset.category==='B7 (CD80·CD86)').click();el('immCheck').click();assert.match(el('immDragStatus').textContent,/1개 정답/);
  el('immReset').click();assert.equal(el('immCheck').hidden,false);
  el('immMatchFilter').value='all';el('immMatchFilter').dispatch('change');assert.ok(el('immCards').children.length>core);
  listeners.keydown({key:'1',target:new Element(),preventDefault(){}});assert.equal(JSON.parse([...saved.values()][0]).total,first);
  el('immTableTab').click();const coreRows=el('immTableBody').children.length;assert.equal(coreRows,core);
  el('immTableFilter').value='all';el('immTableFilter').dispatch('change');assert.equal(el('immTableBody').children.length,el('immCards').children.length);
  assert.ok(el('immCorrections').children.length>=5);
  el('immQuizTab').click();assert.equal(el('immQuizPanel').hidden,false);
  listeners.keydown({key:'1',target:new Element(),preventDefault(){}});assert.equal(JSON.parse([...saved.values()][0]).total,first+1);
});
