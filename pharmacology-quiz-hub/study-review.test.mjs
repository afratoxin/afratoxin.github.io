import test from 'node:test';import assert from 'node:assert/strict';
const ui=await import('./study-review.mjs').catch(()=>({}));
import {studyStore,createStudyStore} from './study-records.mjs?v=20261015-review1';
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
  for(const [,id] of html.matchAll(/id="([^"]+)"/g)){const e=new Element(id.includes('Filter')||id==='antiArea'?'select':'div');e.id=id;}
  const saved=new Map();
  globalThis.document={getElementById:id=>ids.get(id),createElement:tag=>new Element(tag),createDocumentFragment:()=>Object.assign(new Element(),{fragment:true}),addEventListener:(k,f)=>{listeners[k]=f;}};
  globalThis.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
  globalThis.CSS={escape:x=>x};
  return {ids,listeners,Element,saved};
}


test('오답 재풀이 탭에서 복수 정답을 채점하고 정답 시 빈 목록으로 전환한다',()=>{
 assert.equal(typeof ui.initStudyReview,'function');
 const names=['mistakesView','studyReviewScope','studyReviewSummary','studyReviewTitle','studyReviewBack','studyWrongQuizTab','studyWrongMatchTab','studyWrongQuizPanel','studyWrongMatchPanel','studyWrongEmpty','studyWrongCard','studyWrongMeta','studyWrongStem','studyWrongVisual','studyWrongChoices','studyWrongCheck','studyWrongFeedback','studyWrongNext','studyMatchScope','studyWrongBoard','studyMatchRefresh'];
 const {ids,listeners,Element}=fixture(names.map(x=>'id="'+x+'"').join(' ')),el=id=>ids.get(id);
 document.querySelectorAll=()=>[];
 const q={id:'a',stem:'둘 선택',choices:['X','Y','Z'],answer:[1,3],note:'근거'};
 studyStore.register({id:'test-ui',title:'시험',route:'test',items:['a'],build:()=>q});studyStore.record('test-ui',q,false);
 let route;const review=ui.initStudyReview({navigate:x=>{route=x;}});review.open(['test-ui']);assert.equal(route,'mistakes');
 assert.equal(el('studyWrongChoices').children.length,3);assert.equal(el('studyWrongCheck').disabled,true);
 // Correct answer texts survive randomized positions.
 for(const b of el('studyWrongChoices').children)if(['X','Z'].includes(b.children[1].textContent))b.click();
 el('studyWrongCheck').click();assert.equal(studyStore.counts('test-ui').wrong,0);assert.equal(el('studyWrongFeedback').hidden,false);
 let prevented=false;listeners.keydown({key:'Enter',target:{tagName:'BUTTON'},preventDefault(){prevented=true;}});assert.equal(prevented,false);
 el('studyWrongNext').click();assert.equal(el('studyWrongCard').hidden,true);assert.equal(el('studyWrongEmpty').hidden,false);
 el('mistakesView').hidden=true;listeners.keydown({key:'1',target:new Element(),preventDefault(){throw Error('숨긴 화면은 키보드에 반응하지 않음');}});
 studyStore.register({id:'ui-queue',items:['a','b','c'],title:'회전',route:'test',build:id=>({id,stem:id,choices:['X','Y','Z'],answer:[1]})});
 for(const id of ['a','b','c'])studyStore.record('ui-queue',{id,stem:id,choices:['X','Y','Z'],answer:[1]},false);
 review.open(['ui-queue']);const stems=[];
 for(let n=0;n<6;n++){stems.push(el('studyWrongStem').textContent);el('studyWrongChoices').children.find(b=>b.children[1].textContent==='Y').click();el('studyWrongCheck').click();el('studyWrongNext').click();}
 assert.equal(new Set(stems.slice(0,3)).size,3,'모든 오답을 한 번씩 먼저 출제');
 const old={id:'old-label',stem:'Filgrastim (rhG-CSF)의 연결은?',choices:['Filgrastim (rhG-CSF)','Sargramostim (rhGM-CSF)','Abatacept (CTLA-4-Ig)','Alefacept (LFA-3-Ig)','Etanercept (Enbrel)'],answerIndex:0,note:'기전 설명은 그대로'};
 studyStore.register({id:'label-ui',title:'이전 약물명',route:'test',items:['old-label'],build:()=>old});studyStore.record('label-ui',old,false);review.open(['label-ui']);
 assert.equal(el('studyWrongStem').textContent,'Filgrastim의 연결은?');assert.deepEqual(new Set(el('studyWrongChoices').children.map(b=>b.children[1].textContent)),new Set(['Filgrastim','Sargramostim','Abatacept','Alefacept','Etanercept']));
 el('studyWrongChoices').children.find(b=>b.children[1].textContent==='Filgrastim').click();el('studyWrongCheck').click();assert.equal(studyStore.status('label-ui','old-label'),'correct');
 const legacy={id:'old-style',stem:'다음 수용체 중 이온통로형은?',choices:['Nicotinic','M1','M2','D1','D2'],answerIndex:0,note:'이전 설명'};
 const revised={id:'old-style',stem:'다음 수용체–특징 연결 중 옳은 것은?',choices:['Nicotinic — Ionotropic','M1 — Ionotropic','M2 — Ionotropic','D1 — Ionotropic','D2 — Ionotropic'],answers:[0],note:'개편된 설명'};
 studyStore.register({id:'refresh-ui',title:'연결형 개편',route:'test',items:['old-style'],build:()=>legacy,reviewQuestion:()=>revised});studyStore.record('refresh-ui',legacy,false);review.open(['refresh-ui']);
 assert.equal(el('studyWrongStem').textContent,revised.stem);assert.ok(el('studyWrongChoices').children.every(b=>b.children[1].textContent.includes(' — ')));assert.equal(studyStore.counts('refresh-ui').wrong,1);
 el('studyWrongChoices').children.find(b=>b.children[1].textContent==='Nicotinic — Ionotropic').click();el('studyWrongCheck').click();assert.equal(studyStore.status('refresh-ui','old-style'),'correct');



});

test('실제 드래그 채점은 미배치를 제외하며 오답 카드 모드에서도 모든 분류 칸을 유지한다',async()=>{
 const {createMatchBoard}=await import('./match-board.mjs?v=20261015-review1');
 const {ids}=fixture(['pool','cards','zones','status','check','reset'].map(x=>'id="'+x+'"').join(' ')),el=id=>ids.get(id);
 const store=createStudyStore({getItem(){},setItem(){}});
 const items=[{id:'x',name:'X',categories:['A']},{id:'y',name:'Y',categories:['B','C']}];
 store.register({id:'test-drag',type:'match',title:'드래그',items});
 const board=createMatchBoard({store,studyId:'test-drag',poolId:'pool',cardsId:'cards',zonesId:'zones',statusId:'status',checkId:'check',resetId:'reset',items,categoryOf:x=>x.categories[0],categoriesOf:x=>x.categories,keyOf:x=>x.id,labelOf:x=>x.name,onGrade(){}});board.open();
 const toggle=el('pool').querySelector('.match-wrong-toggle');assert.ok(toggle,'오답 카드 탭이 필요합니다');
 el('cards').children.find(x=>x.textContent==='X').click();el('zones').children.find(x=>x.dataset.category==='B').click();el('check').click();
 assert.equal(store.counts('test-drag').wrong,1);assert.equal(store.counts('test-drag').unanswered,1);
 store.record('test-drag',{id:'x'},true);board.open();assert.match(el('pool').querySelector('.study-board-summary').textContent,/정답 1/);store.record('test-drag',{id:'x'},false);board.open();
 toggle.click();assert.equal(el('cards').children.length,1);assert.equal(el('zones').children.length,3);
 el('cards').children[0].click();el('zones').children.find(x=>x.dataset.category==='A').click();el('check').click();assert.equal(store.counts('test-drag').wrong,0);
});
