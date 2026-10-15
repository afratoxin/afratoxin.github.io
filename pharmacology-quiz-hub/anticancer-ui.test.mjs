import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const api=await import('./anticancer-quiz.mjs').catch(()=>({}));
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
  for(const [,id] of html.matchAll(/id="(anti[^"]+)"/g)){const e=new Element(id.includes('Filter')||id==='antiArea'?'select':'div');e.id=id;}
  const saved=new Map();
  globalThis.document={getElementById:id=>ids.get(id),createElement:tag=>new Element(tag),createDocumentFragment:()=>Object.assign(new Element(),{fragment:true}),addEventListener:(k,f)=>{listeners[k]=f;}};
  globalThis.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
  globalThis.CSS={escape:x=>x};
  return {ids,listeners,Element,saved};
}


test('30강 객관식·키보드·표적 및 독성 드래그가 작동한다',async()=>{
  assert.equal(typeof api.initAnticancerQuiz,'function');
  const html=await readFile(new URL('index.html',import.meta.url),'utf8');
  const {ids,listeners,Element,saved}=fixture(html),el=id=>ids.get(id);
  for(const [id,value] of Object.entries({antiScope:'core',antiMode:'mixed',antiMatchFilter:'core',antiMatchKind:'target'}))el(id).value=value;
  el('anticancerView').hidden=false;
  const quiz=api.initAnticancerQuiz();quiz.open();assert.equal(el('antiChoices').children.length,5);
  el('antiChoices').children[0].click();assert.equal(el('antiFeedback').hidden,false);
  const total=()=>JSON.parse([...saved.values()][0]).total;
  const first=total();el('antiChoices').children[1].click();assert.equal(total(),first);
  let prevented=false;listeners.keydown({key:'Enter',target:{tagName:'BUTTON'},preventDefault(){prevented=true;}});assert.equal(prevented,false);
  listeners.keydown({key:'Enter',target:new Element(),preventDefault(){}});assert.equal(el('antiFeedback').hidden,true);
  el('antiScope').value='all';el('antiScope').dispatch('change');el('antiMode').value='target';el('antiMode').dispatch('change');assert.match(el('antiProgress').textContent,/표적·매칭/);
  el('antiDragTab').click();assert.equal(el('antiQuizPanel').hidden,true);
  const core=el('antiCards').children.length;assert.ok(core>=20);
  el('antiCards').children.find(c=>c.textContent==='Vincristine').click();
  el('antiZones').children.find(z=>z.dataset.category==='미세소관 중합 억제').click();el('antiCheck').click();assert.match(el('antiDragStatus').textContent,/1개 정답/);
  el('antiReset').click();assert.equal(el('antiCheck').hidden,false);
  el('antiCards').children.find(c=>c.textContent==='Doxorubicin').click();
  el('antiZones').children.find(z=>z.dataset.category==='Topoisomerase II 절단 복합체 안정화').click();el('antiCheck').click();assert.match(el('antiDragStatus').textContent,/2개 정답/);
  el('antiMatchFilter').value='all';el('antiMatchFilter').dispatch('change');assert.ok(el('antiCards').children.length>core);
  el('antiMatchKind').value='toxicity';el('antiMatchKind').dispatch('change');
  el('antiCards').children.find(c=>c.textContent==='Docetaxel').click();
  el('antiZones').children.find(z=>z.dataset.category==='Taxane · 용매 제형 과민반응·steroid 전처치').click();el('antiCheck').click();assert.match(el('antiDragStatus').textContent,/1개 정답/);
  el('antiMatchFilter').value='유방암 호르몬';el('antiMatchFilter').dispatch('change');assert.equal(el('antiCards').children.length,5);
  listeners.keydown({key:'1',target:new Element(),preventDefault(){}});assert.equal(total(),first);
  el('antiQuizTab').click();assert.equal(el('antiQuizPanel').hidden,false);
  el('anticancerView').hidden=true;listeners.keydown({key:'1',target:new Element(),preventDefault(){}});assert.equal(total(),first);
  el('anticancerView').hidden=false;listeners.keydown({key:'1',target:new Element(),preventDefault(){}});assert.equal(total(),first+1);
  assert.ok(el('antiNotes').children.length>=4);
});
