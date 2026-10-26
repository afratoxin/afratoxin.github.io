// Small DOM adapter for behavioral app checks; it does not test browser layout.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {pathToFileURL, fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url)).replace(/\/$/,'');
const scenario=process.argv[2];
if(!scenario)process.exit(0);
process.env.TEST_NETWORK_FAIL=scenario==='network'?'1':'';
process.env.TEST_REAL_CATALOG=scenario==='catalog'?'1':'';
process.env.TEST_HASH=scenario==='hash'?'#lab='+encodeURIComponent(JSON.stringify({family:'normal',params:{mu:1.5,sigma:0.25,n:4,lower:1.25,upper:1.75},view:'compare'})):scenario==='malformed'?'#lab='+encodeURIComponent(JSON.stringify({family:'integer-sum',params:null})):'';
let randomSeed=137;Math.random=()=>((randomSeed=(randomSeed*1664525+1013904223)>>>0)/2**32);
let interactionChecksReady=false;
const viewportWidth=scenario==='layout-phone'?390:1440;
let actualNavigationActions=0;
class Element {
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.parentNode=null;this.attrs={};const owner=this;this.dataset=new Proxy({},{set(target,key,value){target[key]=String(value);owner.attrs['data-'+String(key).replace(/[A-Z]/g,c=>'-'+c.toLowerCase())]=String(value);return true;},deleteProperty(target,key){delete target[key];delete owner.attrs['data-'+String(key).replace(/[A-Z]/g,c=>'-'+c.toLowerCase())];return true;}});this.style={setProperty(name,value){this[name]=String(value);}};this.events={};this.hidden=false;this.disabled=false;this._value='';this._text='';this.checked=false;this.selected=false;this.type='';}
  get classList(){const element=this;return {contains(name){return element.className.split(/\s+/).includes(name);},add(...names){element.className=[...new Set([...element.className.split(/\s+/).filter(Boolean),...names])].join(' ');},remove(...names){element.className=element.className.split(/\s+/).filter(name=>!names.includes(name)).join(' ');},toggle(name,force){const on=force??!this.contains(name);on?this.add(name):this.remove(name);return on;}};}
  get parentElement(){return this.parentNode;}
  get firstElementChild(){return this.children.find(e=>e.tagName!=='#TEXT')||null;}
  get lastElementChild(){return this.children.findLast(e=>e.tagName!=='#TEXT')||null;}
  get nextElementSibling(){const siblings=this.parentNode?.children||[];return siblings.slice(siblings.indexOf(this)+1).find(e=>e.tagName!=='#TEXT')||null;}
  get previousElementSibling(){const siblings=this.parentNode?.children||[];return siblings.slice(0,siblings.indexOf(this)).findLast(e=>e.tagName!=='#TEXT')||null;}
  get options(){return this.tagName==='SELECT'?this.children:undefined;}
  get id(){return this.attrs.id||'';} set id(v){this.attrs.id=String(v);}
  get className(){return this.attrs.class||'';} set className(v){this.attrs.class=String(v);}
  get textContent(){return this._text+this.children.map(x=>x.textContent).join('');} set textContent(v){this.replaceChildren();this._text=String(v);}
  get value(){if(this.tagName==='SELECT') {const selected=this.children.find(o=>o.selected);return selected?selected.value:(this.children[0]?.value||'');}return this._value;}
  set value(v){v=String(v);this._value=v;if(this.tagName==='SELECT')this.children.forEach(o=>o.selected=o.value===v);}
  get valueAsNumber(){return this.value===''?NaN:Number(this.value);} set valueAsNumber(value){this.value=String(value);}
  get validity(){const value=Number(this.value),step=this.step==='any'?null:Number(this.step||1),min=Number(this.min||0),units=step?(value-min)/step:0;return {valid:!(this.required&&this.value==='')&&Number.isFinite(value)&&(this.min===undefined||value>=Number(this.min))&&(this.max===undefined||value<=Number(this.max))&&(step===null||Math.abs(units-Math.round(units))<1e-7)};}
  append(...nodes){for(let n of nodes){if(typeof n==='string'){const t=new Element('#text');t._text=n;n=t;}n.remove();n.parentNode=this;this.children.push(n);}}
  appendChild(child){this.append(child);return child;}
  removeChild(child){if(child.parentNode!==this)throw new Error('NotFoundError');child.remove();return child;}
  insertBefore(child,before){if(before==null){this.append(child);return child;}const i=this.children.indexOf(before);if(i<0)throw new Error('NotFoundError');child.remove();child.parentNode=this;this.children.splice(i,0,child);return child;}
  prepend(...nodes){for(const n of [...nodes].reverse()){n.remove();n.parentNode=this;this.children.unshift(n);}}
  replaceChildren(...nodes){for(const c of this.children)c.parentNode=null;this.children=[];this._text='';this.append(...nodes);}
  remove(){if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(c=>c!==this);this.parentNode=null;}}
  setAttribute(k,v){this.attrs[k]=String(v);if(k==='value')this._value=String(v);if(k==='type')this.type=String(v);if(k==='selected')this.selected=true;if(k==='hidden')this.hidden=true;if(k==='disabled')this.disabled=true;if(k==='required')this.required=true;if(k==='checked')this.checked=true;if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,x)=>x.toUpperCase())]=String(v);}
  getAttribute(k){return Object.hasOwn(this.attrs,k)?this.attrs[k]:null;}
  hasAttribute(k){return Object.hasOwn(this.attrs,k);}
  removeAttribute(k){delete this.attrs[k];if(k==='hidden')this.hidden=false;if(k==='disabled')this.disabled=false;if(k==='required')this.required=false;}
  addEventListener(name,fn){(this.events[name]??=[]).push(fn);}
  dispatch(name,extra={}){if(this.disabled&&name==='click')return;if(interactionChecksReady&&['input','change','click','keydown'].includes(name)){const fresh=ensureAccess(this);if(fresh!==this){if(['input','change'].includes(name)){fresh.value=this.value;fresh.checked=this.checked;}return fresh.dispatch(name,extra);}assert.equal(isHidden(this),false,`cannot ${name} hidden control ${this.id||this.className}`);}const event={type:name,target:this,currentTarget:this,preventDefault(){},...extra};for(const fn of this.events[name]||[])fn(event);}
  click(){if(this.disabled)return;if(interactionChecksReady){const fresh=ensureAccess(this);if(fresh!==this)return fresh.click();}if(this.type==='checkbox')this.checked=!this.checked;this.dispatch('click');if(this.type==='checkbox'){this.dispatch('input');this.dispatch('change');}}
  focus(){document.activeElement=this;} scrollIntoView(){} select(){}
  contains(other){return this===other||descend(this).includes(other);}
  closest(selector){let current=this;while(current){if(matches(current,selector))return current;current=current.parentNode;}return null;}
  matches(selector){return matches(this,selector);}
  querySelectorAll(selector){return descend(this).filter(e=>matches(e,selector));}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
}
function descend(node){return node.children.flatMap(c=>[c,...descend(c)]);}
function matches(e,selector){
  if(selector.includes(','))return selector.split(',').some(s=>matches(e,s.trim()));
  const ancestry=selector.trim().split(/\s+(?![^[]*\])/);
  if(ancestry.length>1){const last=ancestry.pop();if(!matches(e,last))return false;let parent=e.parentNode;while(parent){if(matches(parent,ancestry.join(' ')))return true;parent=parent.parentNode;}return false;}
  const attribute=selector.match(/\[([^\]=]+)(?:=["']?([^\]"']*)["']?)?\]/);
  if(attribute){const [,key,value]=attribute;if(e.getAttribute(key)===null||(value!==undefined&&e.getAttribute(key)!==value))return false;selector=selector.replace(attribute[0],'');}
  const id=selector.match(/#([\w-]+)/);if(id&&e.id!==id[1])return false;
  const classes=[...selector.matchAll(/\.([\w-]+)/g)].map(m=>m[1]);if(classes.some(name=>!e.classList.contains(name)))return false;
  const tag=selector.replace(/[#.][\w-]+/g,'');return !tag||tag==='*'||e.tagName===tag.toUpperCase();
}
const document=new Element('document'); document.createElement=tag=>new Element(tag);document.createTextNode=text=>{const e=new Element('#text');e._text=String(text);return e;};document.getElementById=id=>descend(document).find(e=>e.id===id)||null;
const source=fs.readFileSync(root+'/index.html','utf8');const stack=[document];const voids=new Set(['META','LINK','INPUT','BR','HR','IMG']);
for(const token of source.match(/<[^>]+>|[^<]+/g)||[]){if(token.startsWith('<!'))continue;if(token.startsWith('</')){const tag=token.slice(2,-1).trim().toUpperCase(),index=stack.findLastIndex(e=>e.tagName===tag);if(index>0)stack.splice(index);continue;}if(token.startsWith('<')){const match=token.match(/^<([\w-]+)/);if(!match)continue;const e=new Element(match[1]);for(const m of token.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)){if(m.index<=1)continue;e.setAttribute(m[1],m[2]??m[3]??m[4]??'');}stack.at(-1).append(e);if(!voids.has(e.tagName))stack.push(e);}else{const t=document.createTextNode(token);stack.at(-1).append(t);}}
document.body=document.querySelector('body');
document.documentElement=document.querySelector('html');
const windowEvents={};const window={innerWidth:viewportWidth,innerHeight:900,addEventListener(name,fn){(windowEvents[name]??=[]).push(fn);},matchMedia(query){const matches=[...query.matchAll(/(min|max)-width\s*:\s*(\d+)px/g)].every(([,side,value])=>side==='min'?viewportWidth>=Number(value):viewportWidth<=Number(value));return{media:query,matches,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}};}};
const location=new URL('https://example.test/probability-lab/'+(process.env.TEST_HASH||''));let clipboard='';
Object.assign(globalThis,{document,window,location,Option:function(text,value){const o=new Element('option');o.textContent=text;o.value=value;return o;},history:{replaceState(_a,_b,url){location.href=String(url);}}});
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{async writeText(v){clipboard=v;}}}});
const catalog={families:[{id:'integer-sum',title:'정수해와 분배',observedConditions:['실제 조건'],proposedConditions:['제안 조건'],differences:['차이']}],items:[{id:'r1',source:'recent',family:'integer-sum',academicYear:2026,session:'9월',question:23,pdfPage:1,summary:'정수해 합 조건',conditions:['모두 자연수'],parameters:['상한'],insight:'분배'},{id:'l1',source:'legacy',family:'normal',academicYear:2020,session:'수능',question:12,pdfPage:2,summary:'표본평균',conditions:['표본 크기'],parameters:['평균'],insight:'표준화'}],coverage:{recent:{exams:1,items:1}},sourceDocuments:[]};
globalThis.fetch=async()=>{if(process.env.TEST_NETWORK_FAIL)throw Error('test-network-failure');return {ok:true,json:async()=>process.env.TEST_REAL_CATALOG?JSON.parse(fs.readFileSync(root+'/data/catalog.json','utf8')):catalog};};
const warnings=[];console.warn=(...args)=>warnings.push(args);
await import(pathToFileURL(root+'/app.mjs').href+'?test='+Date.now());
await new Promise(resolve=>setTimeout(resolve,0));
const raw=id=>document.getElementById(id);
function $(id){
  let found=raw(id);if(found)return found;
  const variable=id.match(/^structure-var-([a-h])-/);
  if(variable&&raw('structure-variable-current')){
    activate('adjust-tab-variables');activate('structure-variable-mode-single');
    const current=raw('structure-variable-current');ensureAccess(current);current.value=String(variable[1].charCodeAt(0)-97);current.dispatch('change');found=raw(id);
  }
  const condition=id.match(/^structure-condition-(\d+)-(?:left|right|relation|kind)$/);
  if(!found&&condition&&raw('structure-condition-next')){activate('adjust-tab-conditions');pageTo(Number(condition[1])/3|0,'structure-condition-prev','structure-condition-next');found=raw(id);}
  return found;
}
function isHidden(element){for(let node=element;node;node=node.parentNode){if(node.hidden||node.getAttribute('aria-hidden')==='true')return true;if(viewportWidth<=1023&&['adjust-pane','problem-pane','solution-pane'].includes(node.id)&&node.dataset.active==='false')return true;}return false;}
function activate(id){const button=raw(id);if(button&&button.getAttribute('aria-selected')!=='true'){actualNavigationActions++;button.click();}}
function pageTo(page,previousId,nextId){const previous=raw(previousId),next=raw(nextId);if(!previous||!next)return;for(let n=0;n<20&&!previous.disabled;n++){actualNavigationActions++;previous.click();}for(let n=0;n<page&&!next.disabled;n++){actualNavigationActions++;next.click();}}
function ensureAccess(element){
  if(!interactionChecksReady)return element;
  if(element.closest('#view-map'))activate('tab-map');else if(element.closest('#view-compare'))activate('tab-compare');else if(element.closest('#view-lab'))activate('tab-lab');
  const pane=element.closest('#adjust-pane,#problem-pane,#solution-pane');if(pane&&viewportWidth<=1023)activate(`pane-tab-${pane.id.replace('-pane','')}`);
  for(const name of ['basic','expression','variables','conditions','examples'])if(element.closest(`#adjust-panel-${name}`))activate(`adjust-tab-${name}`);
  for(const name of ['problem','sources'])if(element.closest(`#question-panel-${name}`))activate(`question-tab-${name}`);
  for(const name of ['explanation','cases','distribution'])if(element.closest(`#solution-pane-${name}`))activate(`solution-tab-${name}`);
  if(element.closest('#structure-variable-bulk'))activate('structure-variable-mode-bulk');
  if(element.closest('#structure-variable-single'))activate('structure-variable-mode-single');
  const field=element.closest('.control-field');
  if(field?.hidden&&field.closest('#adjust-variables-host')&&raw('ball-color-current')){const items=raw('ball-color-current').options;const colors=['red','blue','yellow','green','purple','black'];const index=colors.indexOf(field.dataset.control);raw('ball-color-current').value=String(index);raw('ball-color-current').dispatch('change');}
  if(field?.hidden&&raw('basic-next')){pageTo(0,'basic-prev','basic-next');for(let n=0;n<8&&field.hidden&&!raw('basic-next').disabled;n++){actualNavigationActions++;raw('basic-next').click();}}
  const current=element.id?raw(element.id):element;
  assert.ok(current&&document.contains(current),`interaction target ${element.id||element.className} must remain mounted after navigation`);
  return current;
}
interactionChecksReady=true;
const wait=()=>new Promise(resolve=>setTimeout(resolve,120));
const family=id=>{if(raw('family-select')){const selector=raw('family-select');ensureAccess(selector);selector.value=id;selector.dispatch('change');}else $('family-list').children.find(e=>e.dataset.family===id).click();};
const input=(key,value,event='input')=>{const e=$('control-'+key);if(e.type==='checkbox')e.checked=value;else e.value=value;e.dispatch(event);return e;};
const select=(key,index)=>input(key,String(index),'change');
const setHash=data=>{location.hash='#lab='+encodeURIComponent(JSON.stringify(data));for(const fn of windowEvents.hashchange||[])fn();};
const setField=(id,value,event='input')=>{const element=$(id);assert.ok(element,`${id} must be mounted`);if(element.type==='checkbox')element.checked=value;else element.value=value;element.dispatch(event);return element;};
const blankVariable=more=>({domain:'inherit',parity:'any',lower:null,upper:null,...more});
const structure=(left='a+b+c+d',right='12',more={})=>({enabled:true,left,right,relation:'eq',variables:Array.from({length:4},()=>blankVariable()),conditions:[],...more});
const savedLink=async()=>{$('link-button').click();await new Promise(resolve=>setTimeout(resolve,0));return JSON.parse(decodeURIComponent(new URL(clipboard).hash.slice(5)));};
const boundedOutput=()=>{
  assert.equal(raw('result-status').textContent,'계산 완료');
  const separatedText=element=>element?[element._text,...element.children.map(separatedText)].join(' '):'';
  const content=['problem-text','answer-value','steps-list','result-cases','result-chart','result-samples','insight-text','result-warnings'].map(id=>separatedText(raw(id))).join('\n');
  for(const token of content.match(/[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?/gi)??[])assert.ok(Math.abs(Number(token))<=999,`rendered mathematics exceeds the public limit: ${token}`);
};
if(scenario==='limits-normal'){
  setHash({family:'normal',params:{mu:1.5,sigma:0.25,n:4,lower:1.25,upper:1.75},view:'lab'});
  const near=(actual,expected)=>assert.ok(Math.abs(Number(actual)-expected)<1e-9,`${actual} ~= ${expected}`);
  for(const key of ['lower','upper']){assert.equal(raw(`slider-${key}`).min,'-3');assert.equal(raw(`slider-${key}`).max,'3');assert.equal(raw(`slider-${key}`).step,'0.1');assert.equal(raw(`control-${key}`).step,'any');near(raw(`control-${key}`).min,1.125);near(raw(`control-${key}`).max,1.875);}
  near(raw('slider-lower').value,-2);near(raw('slider-upper').value,2);
  setField('slider-lower','-3');setField('slider-upper','3');await wait();near(raw('control-lower').value,1.125);near(raw('control-upper').value,1.875);boundedOutput();
  input('lower','1.2');await wait();near(raw('slider-lower').value,-2.4);boundedOutput();
  input('lower','1.1249');await wait();assert.equal(raw('result-status').textContent,'조건 확인','typing outside the three-sigma interval is rejected');input('lower','1.25');await wait();
  input('n','16');await wait();for(const key of ['lower','upper']){near(raw(`control-${key}`).min,1.3125);near(raw(`control-${key}`).max,1.6875);}const saved=await savedLink();assert.ok(saved.params.lower>=1.3125-1e-9&&saved.params.upper<=1.6875+1e-9);boundedOutput();
  setHash({family:'normal',params:{mu:1000,sigma:1000,n:1000,lower:-1000,upper:1000},view:'lab'});boundedOutput();const recovered=await savedLink();for(const value of Object.values(recovered.params))if(typeof value==='number')assert.ok(Math.abs(value)<=999);assert.ok(raw('toast').textContent.length>0,'hash recovery is explained');
  console.log('PASS normal standardized [-3,3] sliders / actual numeric bounds / bidirectional decimal mapping / direct outside-bound rejection / dependent n normalization / oversized hash recovery');process.exit(0);
}
if(scenario==='limits-bypass'){
  input('total','1000');await wait();assert.equal(raw('result-status').textContent,'조건 확인');$('reset-button').click();boundedOutput();
  select('domain',2);await wait();assert.equal(raw('result-status').textContent,'조건 확인');input('lowerOn',true,'change');input('lower','0');input('upperOn',true,'change');input('upper','3');await wait();boundedOutput();assert.equal(raw('answer-value').textContent,'40','an unbounded model can be repaired by adding finite bounds without resetting');$('reset-button').click();
  setField('structure-bulk-upper-mode','value','change');setField('structure-bulk-upper','1000');$('structure-bulk-apply').click();assert.equal(raw('structure-error').hidden,false);assert.equal(raw('answer-value').textContent,'20','invalid bulk bounds are not partially applied');
  for(const expression of ['1000','500+500']){setField('structure-main-right',expression);await wait();assert.equal(raw('result-status').textContent,'조건 확인',expression);$('structure-reset-main').click();await wait();boundedOutput();}
  setField('structure-var-a-lower-mode','value','change');setField('structure-var-a-lower','-1000');await wait();assert.equal(raw('result-status').textContent,'조건 확인');$('reset-button').click();
  const hostile=structure('a+b+c+d','1000',{variables:[blankVariable({upper:1000}),blankVariable(),blankVariable(),blankVariable()]});
  setHash({family:'integer-sum',params:{k:4,total:1000,structure:hostile},view:'lab'});boundedOutput();const saved=await savedLink();assert.ok(saved.params.total<=999);assert.ok(saved.params.structure.variables.every(v=>v.upper===null||v.upper<=999));assert.ok(!/(?<!\d)1000(?!\d)/.test(saved.params.structure.right));
  console.log('PASS public limits through direct inputs / bulk bounds / AST literal and constant folding / negative bounds / shared hash recovery');process.exit(0);
}
if(scenario==='layout-tabs'){
  assert.ok(raw('family-select'),'family selection uses the visible native dropdown');
  assert.equal(raw('family-select').options.length,14);
  const tabs=['basic','expression','variables','conditions','examples'];
  for(const name of tabs){const tab=raw(`adjust-tab-${name}`);assert.ok(tab,`${name} tab is always mounted`);assert.equal(isHidden(tab),false);assert.equal(tab.getAttribute('role'),'tab');tab.click();assert.equal(tab.getAttribute('aria-selected'),'true');assert.equal(raw(`adjust-panel-${name}`).hidden,false);}
  activate('adjust-tab-basic');raw('adjust-tab-basic').dispatch('keydown',{key:'ArrowRight'});assert.equal(raw('adjust-tab-expression').getAttribute('aria-selected'),'true');assert.equal(document.activeElement.id,'adjust-tab-expression');
  raw('adjust-tab-expression').dispatch('keydown',{key:'End'});assert.equal(raw('adjust-tab-examples').getAttribute('aria-selected'),'true');raw('adjust-tab-examples').dispatch('keydown',{key:'Home'});assert.equal(raw('adjust-tab-basic').getAttribute('aria-selected'),'true');
  const seen=new Set();pageTo(0,'basic-prev','basic-next');
  for(let page=0;page<8;page++){
    const visible=raw('controls').querySelectorAll('.control-field').filter(field=>!isHidden(field));assert.ok(visible.length>0&&visible.length<=4,'each basic page shows at most four fields');
    for(const field of visible)for(const element of field.querySelectorAll('input,select'))if(element.id.startsWith('control-'))seen.add(element.id);
    if(raw('basic-next').disabled)break;raw('basic-next').click();
  }
  const {specs}=await import(pathToFileURL(root+'/engines.mjs').href);assert.deepEqual([...seen].sort(),specs.find(s=>s.id==='integer-sum').controls.map(c=>'control-'+c.key).sort());
  input('total','12');input('lowerOn',true,'change');input('lower','2');input('upperOn',true,'change');input('upper','4');await wait();assert.equal(raw('answer-value').textContent,'19','values from hidden basic pages remain in the calculation');
  activate('adjust-tab-expression');activate('adjust-tab-variables');activate('adjust-tab-conditions');activate('adjust-tab-examples');activate('adjust-tab-basic');
  assert.equal(raw('control-lower').value,'2');assert.equal(raw('control-upper').value,'4');const saved=await savedLink();assert.equal(saved.params.lower,2);assert.equal(saved.params.upper,4);
  input('k','2.5');await wait();assert.equal(raw('result-status').textContent,'조건 확인');input('distinct',false,'change');await wait();assert.equal(raw('result-status').textContent,'조건 확인','paging away cannot sanitize an invalid hidden basic input');input('k','4');await wait();assert.equal(raw('answer-value').textContent,'19');
  family('coefficient');input('a','3');input('n','4');await wait();assert.equal(raw('answer-value').textContent,'12');assert.equal(raw('control-a').value,'3','paging preserves a value while editing n elsewhere');
  assert.ok(actualNavigationActions>=8,'interactions actually navigate tabs and pages');
  console.log('PASS five accessible adjustment tabs / keyboard navigation / four fields per page / all controls reachable / hidden values counted / paging retains edits / visible native family selection');process.exit(0);
}
if(scenario==='layout-structure'){
  input('upperOn',true,'change');input('upper','2');input('k','8');input('total','12');await wait();activate('adjust-tab-variables');activate('structure-variable-mode-single');
  assert.equal(raw('structure-variable-current').options.length,8);
  for(let i=0;i<8;i++){
    const current=raw('structure-variable-current');current.value=String(i);current.dispatch('change');
    const letter='abcdefgh'[i];assert.ok(raw(`structure-var-${letter}-domain`));assert.equal(raw('structure-variable-single').querySelectorAll('.variable-card').filter(card=>!isHidden(card)).length,1);
    setField(`structure-var-${letter}-upper-mode`,'value','change');setField(`structure-var-${letter}-upper`,'2');
  }
  setField('structure-var-a-lower-mode','value','change');setField('structure-var-a-lower','2');await wait();assert.equal(raw('answer-value').textContent,'35');
  assert.equal($('structure-var-h-upper').value,'2');assert.equal($('structure-var-a-lower').value,'2','single-card state survives switching through h and back to a');
  setField('structure-var-a-upper','1000');await wait();assert.equal(raw('result-status').textContent,'조건 확인');setField('structure-var-h-upper','2');await wait();assert.equal(raw('result-status').textContent,'조건 확인','an invalid unmounted a bound cannot disappear while editing h');assert.equal($('structure-var-a-upper').value,'1000');setField('structure-var-a-upper','2');await wait();assert.equal(raw('answer-value').textContent,'35');
  activate('structure-variable-mode-bulk');setField('structure-bulk-parity','even','change');$('structure-bulk-apply').click();await wait();assert.equal(raw('answer-value').textContent,'15');
  for(let i=0;i<12;i++){$('structure-add-expression').click();setField(`structure-condition-${i}-left`,'a+b');setField(`structure-condition-${i}-right`,'4');setField(`structure-condition-${i}-relation`,'le','change');}await wait();assert.equal(raw('answer-value').textContent,'15');
  assert.match(raw('structure-condition-page').textContent,/4\s*\/\s*4/);assert.equal(raw('structure-conditions').querySelectorAll('.structure-condition-row').filter(row=>!isHidden(row)).length,3);
  const before=await savedLink();assert.equal(before.params.structure.conditions.length,12);$('structure-add-expression').click();const after=await savedLink();assert.equal(after.params.structure.conditions.length,12,'condition cap does not silently append an unreachable thirteenth condition');
  setField('structure-condition-0-right','3');await wait();assert.equal(raw('answer-value').textContent,'0','unchanged constraints on other pages still participate');setField('structure-condition-0-right','4');await wait();assert.equal(raw('answer-value').textContent,'15');
  setField('structure-condition-0-left','not_a_variable');await wait();assert.equal(raw('result-status').textContent,'조건 확인');setField('structure-condition-11-right','4');await wait();assert.equal(raw('result-status').textContent,'조건 확인','off-page invalid expressions remain invalid');setField('structure-condition-0-left','a+b');await wait();assert.equal(raw('answer-value').textContent,'15');
  for(const index of [11,10,9]){const field=$(`structure-condition-${index}-left`);field.closest('.structure-condition-row').querySelector('.remove-condition').click();}
  assert.match(raw('structure-condition-page').textContent,/3\s*\/\s*3/,'deleting the last page clamps to the remaining final page');
  const saved=await savedLink();assert.equal(saved.params.structure.variables.length,8);assert.equal(saved.params.structure.variables[0].lower,2);assert.equal(saved.params.structure.variables[7].upper,2);assert.equal(saved.params.structure.conditions.length,9);
  family('coefficient');setHash(saved);const restored=await savedLink();assert.deepEqual(restored.params.structure,saved.params.structure);
  setField('structure-enabled',false,'change');await wait();assert.equal(raw('answer-value').textContent,'70','turning the structured model off uses the basic sum');setField('structure-enabled',true,'change');await wait();assert.equal(raw('answer-value').textContent,'15','turning it back on restores conditions from every page');
  console.log('PASS eight reachable single variable cards / retained individual and bulk edits / twelve conditions in three-row pages / hidden conditions counted / deletion clamps pages / hash structure preservation');process.exit(0);
}
if(scenario==='layout-phone'){
  const panes=['adjust','problem','solution'];
  const active=()=>panes.filter(name=>raw(`${name}-pane`).dataset.active==='true');
  for(const name of panes){assert.ok(raw(`pane-tab-${name}`));assert.equal(isHidden(raw(`pane-tab-${name}`)),false);}
  assert.deepEqual(active(),['adjust']);input('total','12');await wait();
  raw('pane-tab-problem').click();assert.deepEqual(active(),['problem']);assert.match(raw('problem-text').textContent,/12/);assert.equal(isHidden(raw('adjust-pane')),true);
  raw('pane-tab-solution').click();assert.deepEqual(active(),['solution']);assert.equal(raw('answer-value').textContent,'165');
  for(const name of ['explanation','cases','distribution']){raw(`solution-tab-${name}`).click();assert.equal(raw(`solution-tab-${name}`).getAttribute('aria-selected'),'true');assert.equal(raw(`solution-pane-${name}`).hidden,false);}
  raw('pane-tab-solution').dispatch('keydown',{key:'Home'});assert.deepEqual(active(),['adjust']);assert.equal(document.activeElement.id,'pane-tab-adjust');assert.equal(raw('control-total').value,'12');
  raw('pane-tab-adjust').dispatch('keydown',{key:'ArrowLeft'});assert.deepEqual(active(),['solution']);assert.equal(document.activeElement.id,'pane-tab-solution');
  family('normal');raw('pane-tab-problem').click();raw('question-tab-sources').click();assert.equal(raw('question-panel-sources').hidden,false);raw('question-tab-problem').click();assert.equal(raw('normal-table-container').hidden,false);
  $('answer-button').click();assert.equal(raw('solution-content').hidden,true);raw('pane-tab-problem').click();assert.equal(isHidden(raw('normal-table-container')),false,'question table remains available while the separate solution is hidden');
  raw('tab-map').click();assert.equal(raw('view-map').hidden,false);raw('tab-lab').click();assert.equal(raw('control-mu').value,'50');assert.ok(raw('normal-table-container').querySelector('table'));
  console.log('PASS phone pane replacement rather than vertical stacking / pane and appendix tabs / keyboard focus / preserved values / source and problem switching / normal table independent of hidden solution / map round trip');process.exit(0);
}
if(scenario==='friendly-ui'){
  assert.ok(raw('adjust-description'),'the current adjustment tab explains its purpose');
  assert.ok(raw('decrease-total')&&raw('increase-total'),'exact numeric values support fine adjustment');
  raw('increase-total').click();await wait();assert.equal(raw('control-total').value,'8');assert.equal(raw('answer-value').textContent,'35');
  raw('decrease-total').click();await wait();assert.equal(raw('control-total').value,'7');assert.equal(raw('answer-value').textContent,'20');
  input('total','999');await wait();assert.equal(raw('result-status').textContent,'조건 확인');
  raw('decrease-total').click();await wait();assert.equal(raw('control-total').value,'999','fine adjustment must not sanitize an invalid draft');
  $('reset-button').click();activate('adjust-tab-conditions');assert.match(raw('adjust-description').textContent,/조건/);
  family('selection');assert.equal(raw('adjust-tab-variables').textContent,'색별 수량');
  activate('adjust-tab-conditions');raw('ball-rule-add').click();assert.ok(raw('ball-rule-kind'));
  const chip=raw('adjust-conditions-host').querySelector('[data-color="0"]');assert.ok(chip,'color scope carries its visible color identity');
  const pressed=chip.getAttribute('aria-pressed');chip.click();await wait();assert.notEqual(chip.getAttribute('aria-pressed'),pressed);
  $('tab-map').click();raw('filter-source').value='all';raw('filter-source').dispatch('change');raw('filter-search').value='없는검색어';raw('filter-search').dispatch('input');await wait();
  raw('filter-clear-button').click();assert.equal(raw('filter-source').value,'recent');assert.equal(raw('filter-family').value,'all');assert.equal(raw('filter-search').value,'');assert.match(raw('catalog-count').textContent,/1문항/);
  assert.ok(raw('filter-clear-button').disabled,'clear filters indicates the default filter state');
  console.log('PASS fine numeric steps / invalid draft retention / contextual tab help / color scope / clear filters');process.exit(0);
}
if(scenario==='ball-rule-ranges'){
  family('selection');input('blue',0);input('red',9);input('draw',8);input('relation',0,'change');await wait();
  activate('adjust-tab-conditions');raw('ball-rule-add').click();
  assert.equal(Number(raw('ball-rule-target').max),8,'rule max must use the current draw after scalar edits');
  raw('ball-rule-target-slider').value='8';raw('ball-rule-target-slider').dispatch('input');await wait();assert.equal($('answer-value').textContent,'9');
  input('draw',9);await wait();assert.equal(Number(raw('ball-rule-target-slider').max),9,'mounted rule bounds track later draw changes');
  family('distribution');input('boxes',1);input('red',20);input('blue',20);await wait();
  activate('adjust-tab-conditions');raw('ball-rule-add').click();
  assert.equal(Number(raw('ball-rule-target-slider').max),40,'one box can receive every color inventory');
  raw('ball-rule-target-slider').value='40';raw('ball-rule-target-slider').dispatch('input');await wait();assert.equal($('answer-value').textContent,'1');
  console.log('PASS rule sliders follow live draw and summed color inventory');process.exit(0);
}
if(scenario==='colored-balls'){
  family('selection');
  input('colorKinds',3);await wait();
  assert.ok($('control-yellow'),'third color must have an independent quantity control');
  assert.equal($('adjust-tab-variables').disabled,false);
  input('red',2);input('blue',2);input('yellow',1);input('draw',2);
  input('relation',0,'change');await wait();
  activate('adjust-tab-conditions');
  assert.ok(raw('ball-rule-add'),'condition builder must be reachable');
  raw('ball-rule-add').click();
  const kind=raw('ball-rule-kind');kind.value='kinds';kind.dispatch('change');
  const target=raw('ball-rule-target');target.value='2';target.dispatch('input');await wait();
  assert.equal($('result-status').textContent,'계산 완료');assert.equal($('answer-value').textContent,'8');
  raw('ball-rule-target').value='1000';raw('ball-rule-target').dispatch('input');await wait();assert.equal($('result-status').textContent,'조건 확인');
  raw('ball-rule-target').value='2';raw('ball-rule-target').dispatch('input');await wait();assert.equal($('answer-value').textContent,'8','fixing an invalid rule must recover without resetting');
  $('link-button').click();await wait();
  const saved=JSON.parse(decodeURIComponent(new URL(clipboard).hash.slice(5)));
  assert.equal(saved.params.colorKinds,3);assert.equal(saved.params.yellow,1);assert.equal(saved.params.ballRules.event.rules[0].kind,'kinds');
  location.hash='#lab='+encodeURIComponent(JSON.stringify(saved));for(const fn of windowEvents.hashchange||[])fn();
  assert.equal($('answer-value').textContent,'8');
  input('draw',1);await wait();assert.equal($('answer-value').textContent,'0','count rules survive scalar changes');
  family('distribution');assert.equal($('answer-value').textContent,'18');
  activate('adjust-tab-conditions');raw('ball-rule-add').click();
  const boxKind=raw('ball-rule-kind');boxKind.value='allColorsBoxes';boxKind.dispatch('change');
  raw('ball-rule-target').value='1';raw('ball-rule-target').dispatch('input');await wait();
  assert.equal($('result-status').textContent,'계산 완료');assert.equal($('answer-value').textContent,'9');
  $('reset-button').click();assert.equal($('answer-value').textContent,'18');
  console.log('PASS independent color quantities / rule editing / exact weighted count / preserved rules / shared link round trip / boxes and reset');process.exit(0);
}
if(scenario==='structured-subset'){
  assert.ok($('structure-editor'),'structured editor must be mounted for integer solutions');
  input('total','12');await wait();
  assert.equal($('structure-chip-a').getAttribute('aria-pressed'),'true');assert.equal($('structure-chip-b').getAttribute('aria-pressed'),'true');
  assert.equal($('structure-chip-c').getAttribute('aria-pressed'),'false');assert.equal($('structure-chip-d').getAttribute('aria-pressed'),'false');
  setField('structure-bulk-parity','even','change');$('structure-bulk-apply').click();await wait();
  assert.equal($('answer-value').textContent,'30','only a,b even gives 30, rather than forcing all four variables even');
  for(const letter of ['a','b'])assert.equal($(`structure-var-${letter}-parity`).value,'even');
  for(const letter of ['c','d'])assert.equal($(`structure-var-${letter}-parity`).value,'any');
  $('reset-button').click();input('total','12');await wait();
  setField('structure-bulk-lower-mode','value','change');setField('structure-bulk-lower','2');$('structure-bulk-apply').click();await wait();
  assert.equal($('answer-value').textContent,'84','a,b >=2 leaves c,d starting at 1');
  for(const letter of ['c','d'])assert.equal($(`structure-var-${letter}-lower-mode`).value,'auto');
  $('reset-button').click();input('total','10');await wait();
  setField('structure-bulk-upper-mode','value','change');setField('structure-bulk-upper','3');$('structure-bulk-apply').click();await wait();
  assert.equal($('answer-value').textContent,'45','selected a,b upper bound uses the intended two-variable restriction');
  const saved=await savedLink();assert.equal(saved.params.structure.variables[0].upper,3);assert.equal(saved.params.structure.variables[1].upper,3);assert.equal(saved.params.structure.variables[2].upper,null);
  console.log('PASS selected a,b parity and bounds / untouched c,d / bulk selection math / serialized subsets');process.exit(0);
}
if(scenario==='structured-custom'){
  setField('structure-main-left','a+b+2*c+d^2');setField('structure-main-right','20');await wait();
  assert.equal($('answer-value').textContent,'142');assert.equal($('structure-sync-status').dataset.mode,'custom');
  for(const key of ['total','relation']){assert.equal($(`control-${key}`).disabled,true);assert.equal($(`slider-${key}`).disabled,true);assert.equal($(`structure-scalar-note-${key}`).hidden,false);if(key==='total'){assert.equal(raw('decrease-total').disabled,true);assert.equal(raw('increase-total').disabled,true);}}
  // A link can carry an independent base value even while its unrelated slider is disabled.
  setHash({family:'integer-sum',params:{k:4,total:16,structure:structure('a+b+2*c+d^2','20')},view:'lab'});
  assert.equal($('structure-main-left').value,'a+b+2*c+d^2');assert.equal($('structure-main-right').value,'20');assert.equal($('answer-value').textContent,'142','base sum must not overwrite a custom expression');
  const saved=await savedLink();assert.equal(saved.params.structure.left,'a+b+2*c+d^2');assert.equal(saved.params.structure.right,'20');assert.equal(saved.params.total,16);
  assert.equal($('structure-rhs-controls').hidden,false);assert.equal($('structure-main-right-slider').type,'range');
  const duringRhsDrag=[];
  for(let i=0;i<12;i++){setField('structure-main-right-slider','21');await new Promise(resolve=>setTimeout(resolve,10));duringRhsDrag.push($('answer-value').textContent);}
  assert.ok(duringRhsDrag.includes('164'),'the custom RHS slider updates the answer before release');
  assert.equal($('structure-main-right').value,'21');assert.equal($('structure-main-right-value').value,'21');
  setField('structure-main-right-slider','20','change');assert.equal($('answer-value').textContent,'142','release applies the final RHS immediately');
  setField('structure-main-right-value','21');await wait();assert.equal($('answer-value').textContent,'164');assert.equal($('structure-main-right-slider').value,'21');
  setField('structure-main-right','a+b');await wait();assert.equal($('structure-rhs-controls').hidden,true,'an expression RHS does not expose an unrelated constant slider');
  setField('structure-main-right','20');await wait();assert.equal($('structure-rhs-controls').hidden,false);
  $('structure-reset-main').click();await wait();assert.equal($('structure-main-left').value,'a+b+c+d');assert.equal($('structure-main-right').value,'16');assert.equal($('answer-value').textContent,'455');
  for(const key of ['total','relation']){assert.equal($(`control-${key}`).disabled,false);assert.equal($(`slider-${key}`).disabled,false);assert.equal($(`structure-scalar-note-${key}`).hidden,true);}
  assert.equal($('structure-sync-status').dataset.mode,'auto');input('total','12');await wait();assert.equal($('structure-main-right').value,'12');assert.equal($('answer-value').textContent,'165');
  $('reset-button').click();assert.equal($('control-total').value,'7');assert.equal($('structure-main-right').value,'7');assert.equal($('answer-value').textContent,'20');assert.equal($('structure-sync-status').dataset.mode,'auto');
  for(const [index,answer] of [[1,'16'],[2,'32'],[3,'142'],[4,'30']]){$(`structure-preset-${index}`).click();await wait();assert.equal($('answer-value').textContent,answer,`composite preset ${index}`);}
  console.log('PASS custom expression preservation / disabled irrelevant scalar controls / live custom RHS drag and typed sync / base sum independence / default sum resynchronization / full reset / all four composite presets');process.exit(0);
}
if(scenario==='structured-hash'){
  const subset=structure();subset.variables[0].parity='even';subset.variables[1].parity='even';
  setHash({family:'integer-sum',params:{k:4,total:12,structure:subset},view:'lab'});assert.equal($('answer-value').textContent,'30');
  $('structure-add-nondecreasing').click();await wait();assert.equal($('answer-value').textContent,'20');
  $('structure-add-distinct').click();await wait();assert.equal($('answer-value').textContent,'10');
  const saved=await savedLink();assert.deepEqual(saved.params.structure.conditions,[{kind:'nondecreasing',variables:[0,1]},{kind:'distinct',variables:[0,1]}]);
  family('coefficient');setHash(saved);assert.equal($('answer-value').textContent,'10');assert.equal($('structure-var-a-parity').value,'even');
  const again=await savedLink();assert.deepEqual(again.params.structure,saved.params.structure,'group and subset structures survive exact shared-link round trips');
  const hostile=JSON.parse('{"enabled":true,"left":"globalThis.process.exit()","right":{},"relation":"constructor","variables":[{"domain":"__proto__","parity":"constructor","lower":"9","upper":9999999,"__proto__":{"polluted":true}}],"conditions":[{"kind":"constructor","variables":[0,1]},{"kind":"expression","left":"globalThis.exit()","relation":"eq","right":"0"}],"__proto__":{"polluted":true}}');
  setHash({family:'integer-sum',params:{k:4,total:12,structure:hostile}});assert.equal($('result-status').textContent,'계산 완료');assert.equal($('answer-value').textContent,'165');assert.equal({}.polluted,undefined);
  for(const value of [null,[],7,true,'bad']){setHash({family:'integer-sum',params:{k:4,total:12,structure:value}});assert.equal($('result-status').textContent,'계산 완료');assert.equal($('answer-value').textContent,'165');}
  console.log('PASS local group math / structure serialization / shared hash round trip / malicious and malformed structured models recover safely');process.exit(0);
}
if(scenario==='normal-table'){
  family('normal');const table=$('normal-table-container');assert.ok(table,'normal table belongs in a dedicated question-side container');
  assert.equal($('problem-text').nextElementSibling,table,'normal table is immediately below the question');assert.equal($('solution-content').contains(table),false,'normal table is question data');
  assert.equal(table.hidden,false);assert.ok(table.querySelector('table'));assert.match(table.textContent,/z|Z/);assert.match(table.textContent,/0\.3413|0\.4772/);
  $('answer-button').click();assert.equal($('solution-content').hidden,true);assert.equal(table.hidden,false);assert.ok(table.textContent.length>20);
  input('lower','35');input('upper','65');await wait();assert.equal(table.hidden,false);assert.ok(table.querySelector('table'),'updated standardization keeps the table while answers stay hidden');
  family('coefficient');assert.equal(table.hidden,true);assert.equal(table.children.length,0,'normal table does not leak into unrelated questions');
  console.log('PASS normal table after question / outside hidden answer / numeric table values / live updates / clearing on family switch');process.exit(0);
}
if(process.env.TEST_NETWORK_FAIL){assert.equal($('catalog-notice').hidden,false);assert.equal($('result-status').textContent,'계산 완료');family('coefficient');assert.equal($('answer-value').textContent,'80');console.log('PASS network failure preserves all engines');process.exit(0);}
if(scenario==='hash'){assert.equal($('lab-title').textContent,'정규분포');assert.equal($('control-mu').value,'1.5');assert.equal($('view-compare').hidden,false);const setHash=data=>{location.hash='#lab='+encodeURIComponent(JSON.stringify(data));for(const fn of windowEvents.hashchange||[])fn();};
setHash({family:'estimation',params:{confidence:'99',query:'length'},view:'lab'});
assert.equal($('control-confidence').value,'2');assert.equal($('control-query').value,'1');
setHash({family:'arrangement',params:{circular:true,condition:'apart'},view:'lab'});
assert.equal($('control-circular').checked,true);assert.equal($('result-status').textContent,'계산 완료');
console.log('PASS link restore decimal / string select / boolean checkbox types');process.exit(0);}
if(scenario==='malformed'){
  assert.equal($('result-status').textContent,'계산 완료');
  const setHash=data=>{location.hash='#lab='+encodeURIComponent(JSON.stringify(data));for(const fn of windowEvents.hashchange||[])fn();};
  for(const params of [null,[],7,'bad',true,{total:'12'},{total:{}},{total:NaN}]){
    setHash({family:'integer-sum',params});assert.equal($('result-status').textContent,'계산 완료');
  }
  const malicious=JSON.parse('{"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}},"total":12}');
  setHash({family:'integer-sum',params:malicious});
  assert.equal($('control-total').value,'12');assert.equal({}.polluted,undefined);assert.equal(Object.prototype.polluted,undefined);
  for(const family of ['__proto__','constructor','unknown-family']){setHash({family,params:malicious});assert.equal($('result-status').textContent,'계산 완료');}
  for(const hash of ['#lab=%ZZ','#lab=%7B']){location.hash=hash;for(const fn of windowEvents.hashchange||[])fn();assert.equal($('result-status').textContent,'계산 완료');}
  console.log('PASS malformed/null/scalar hash parameters / invalid encoding / unknown families / prototype pollution rejection');process.exit(0);
}
if(scenario==='slider'){
  const {specs}=await import(pathToFileURL(root+'/engines.mjs').href);
  const drag=(key,value)=>{
    const slider=$('slider-'+key);
    assert.ok(slider,`slider-${key} must be present`);
    assert.equal(slider.type,'range',`slider-${key} is a native range input`);
    const allowed=slider.getAttribute('data-value-mode')==='allowed'?slider.getAttribute('data-allowed-values'):null;
    if(allowed){const values=JSON.parse(allowed),index=values.findIndex(candidate=>Math.abs(candidate-Number(value))<1e-9);assert.ok(index>=0,`${key}=${value} is an allowed actual value`);slider.value=String(index);}else slider.value=String(value);
    slider.dispatch('input');return slider;
  };
  const assertSliders=(spec,params)=>{
    for(const control of (spec.getControls?.(params)??spec.controls)){
      const slider=$('slider-'+control.key);
      assert.ok(slider,`${spec.id}.${control.key} has a slider`);
      assert.equal(slider.type,'range');
      assert.ok(slider.getAttribute('aria-label'),`${spec.id}.${control.key} slider has an accessible name`);
      assert.ok(document.querySelectorAll('label').some(label=>label.htmlFor===slider.id),`${spec.id}.${control.key} label names the slider`);
      const allowed=control.type==='number'&&!control.normalBound?spec.allowedValues?.(control.key,params)??null:null;
      const expectedMin=control.normalBound?-3:allowed?0:control.type==='number'?control.min:0;
      const expectedMax=control.normalBound?3:allowed?Math.max(0,allowed.length-1):control.type==='number'?control.max:control.type==='select'?control.options.length-1:1;
      assert.equal(slider.min,String(expectedMin));assert.equal(slider.max,String(expectedMax));
      assert.equal(slider.step,String(control.normalBound?0.1:allowed?1:control.type==='number'?(control.step??1):1));
      const expected=control.normalBound?(params[control.key]-control.zscore.mu)/control.zscore.se:allowed?allowed.findIndex(value=>Math.abs(value-params[control.key])<1e-9):control.type==='number'?params[control.key]:control.type==='checkbox'?(params[control.key]?1:0):control.options.findIndex(o=>o.value===params[control.key]);
      assert.ok(Math.abs(Number(slider.value)-Number(expected))<1e-6,`${spec.id}.${control.key} slider matches its actual-value companion`);
      if(control.type==='select')assert.equal(slider.getAttribute('aria-valuetext'),control.options[expected].label);
      if(control.type==='checkbox')assert.equal(slider.getAttribute('aria-valuetext'),params[control.key]?'적용':'미적용');
    }
  };
  // Known answers test the actual drag -> typed parameter -> solve -> render path.
  assert.ok($('slider-total'),'the sum control must have a primary drag slider');
  assert.equal($('control-total').value,'7');
  const duringDrag=[];
  for(let i=0;i<12;i++){
    drag('total',8);await new Promise(resolve=>setTimeout(resolve,10));
    duringDrag.push($('answer-value').textContent);
  }
  assert.ok(duringDrag.includes('35'),'a sustained stream of input events must update the solution before any release/change event');
  drag('total',9).dispatch('change');
  assert.equal($('answer-value').textContent,'56','release/change must show the final value immediately');
  $('reset-button').click();
  drag('total',8);assert.equal($('control-total').value,'8');await wait();
  assert.equal($('answer-value').textContent,'35');
  drag('k',3);assert.equal($('control-k').value,'3');await wait();
  assert.equal($('answer-value').textContent,'21');
  input('lowerOn',true,'change');input('lower','0');input('upperOn',true,'change');input('upper','3');await wait();
  for(const [index,status,answer] of [[0,'계산 완료','3'],[1,'계산 완료','26'],[2,'계산 완료','23'],[3,'계산 완료','4'],[4,'계산 완료','1']]){
    drag('relation',index);assert.equal($('control-relation').value,String(index));await wait();
    assert.equal($('result-status').textContent,status,`relation option ${index} has its mathematical meaning`);
    if(answer!==null)assert.equal($('answer-value').textContent,answer);
  }
  select('relation',0);await wait();assert.equal($('slider-relation').value,'0');assert.equal($('answer-value').textContent,'3');
  const domains=[x=>x>=1,x=>x>=0,()=>true,x=>x>0&&x%2===0,x=>x>0&&x%2!==0,x=>x%2===0,x=>x%2!==0];
  for(let index=0;index<7;index++){
    drag('domain',index);await wait();assert.equal($('control-domain').value,String(index));
    const total=Number($('control-total').value);let expected=0;for(let a=0;a<=3;a++)for(let b=0;b<=3;b++)for(let c=0;c<=3;c++)if([a,b,c].every(domains[index])&&a+b+c===total)expected++;
    assert.equal($('result-status').textContent,'계산 완료',`finite domain option ${index} keeps its intended type`);assert.equal($('answer-value').textContent,String(expected));
  }
  select('domain',0);input('total','8');await wait();assert.equal($('slider-domain').value,'0');
  drag('upperOn',1);assert.equal($('control-upperOn').checked,true);await wait();
  drag('upper',3);await wait();assert.equal($('answer-value').textContent,'3');
  drag('upperOn',0);assert.equal($('control-upperOn').checked,false);await wait();assert.equal($('answer-value').textContent,'21');
  input('upperOn',true,'change');await wait();assert.equal($('slider-upperOn').value,'1');assert.equal($('answer-value').textContent,'3');
  input('upperOn',false,'change');input('total','10');await wait();const previousSlider=$('slider-total').value;
  for(const bad of ['10.5','','999']){
    input('total',bad);await wait();assert.equal($('result-status').textContent,'조건 확인');
    assert.equal($('form-error').hidden,false);assert.equal($('slider-total').value,previousSlider,'invalid exact entry must not move or sanitize the slider');
  }
  input('total','8');await wait();assert.equal($('answer-value').textContent,'21');
  const integerSpec=specs.find(x=>x.id==='integer-sum');
  $('preset-row').children[1].click();assertSliders(integerSpec,{...integerSpec.defaults,...integerSpec.presets[1].params});
  $('reset-button').click();assertSliders(integerSpec,integerSpec.defaults);
  family('normal');drag('sigma',0.25);await wait();assert.equal($('control-sigma').value,'0.25');
  assert.equal($('result-status').textContent,'계산 완료');input('mu','1.5');await wait();assert.equal($('slider-mu').value,'1.5');
  $('link-button').click();await new Promise(resolve=>setTimeout(resolve,0));
  const saved=JSON.parse(decodeURIComponent(new URL(clipboard).hash.slice(5)));
  assert.equal(saved.params.sigma,0.25);assert.equal(saved.params.mu,1.5);
  const setHash=data=>{location.hash='#lab='+encodeURIComponent(JSON.stringify(data));for(const fn of windowEvents.hashchange||[])fn();};
  for(const data of [{family:'normal',params:{mu:1.5,sigma:0.25,n:4}}, {family:'estimation',params:{confidence:'99',query:'length'}}, {family:'arrangement',params:{circular:true,condition:'apart'}}]){
    setHash(data);const spec=specs.find(s=>s.id===data.family);const restored=await savedLink();assertSliders(spec,restored.params);
    assert.equal($('result-status').textContent,'계산 완료');
  }
  // Every control retains its own metadata and resets together with its companion.
  for(const spec of specs){family(spec.id);assertSliders(spec,spec.defaults);}
  console.log('PASS continuous drag before release / immediate final value / drag math answers / relation-domain meanings / checkbox and decimal sync / invalid exact entry / preset-reset-link state / all 14 slider metadata');process.exit(0);
}
if(process.env.TEST_REAL_CATALOG){
  const {specs}=await import(pathToFileURL(root+'/engines.mjs').href);
  for(const spec of specs){
    family(spec.id);
    assert.equal($('answer-value').textContent,spec.solve(spec.defaults).answer,spec.id+' defaults');
    boundedOutput();
    for(let index=0;index<spec.presets.length;index++){
      $('preset-row').children[index].click();
      assert.equal($('answer-value').textContent,spec.solve({...spec.defaults,...spec.presets[index].params}).answer,spec.id+' preset '+index);
      assert.equal($('form-error').hidden,true,spec.id+' preset '+index+' browser validity');
      boundedOutput();
    }
    for(let i=0;i<10;i++){$('random-button').click();assert.equal($('result-status').textContent,'계산 완료',spec.id+' random '+i);assert.equal($('form-error').hidden,true,spec.id+' random '+i+' browser validity');boundedOutput();}
    $('link-button').click();await new Promise(resolve=>setTimeout(resolve,0));
    const saved=JSON.parse(decodeURIComponent(new URL(clipboard).hash.slice(5)));
    for(const c of spec.controls)assert.equal(typeof saved.params[c.key],c.type==='number'?'number':c.type==='checkbox'?'boolean':typeof c.options[0].value,spec.id+'.'+c.key+' serialized type');
  }
  $('tab-map').click();assert.ok($('catalog-count').textContent.includes('136문항'));
  $('filter-source').value='all';$('filter-source').dispatch('change');assert.ok($('catalog-count').textContent.includes('253문항'));
  let seen=12;while(!$('pagination').children.at(-1).disabled){$('pagination').children.at(-1).click();seen+=$('catalog-list').children.length;}
  assert.equal(seen,253);
  $('filter-source').value='legacy';$('filter-source').dispatch('change');assert.ok($('catalog-count').textContent.includes('117문항'));assert.equal($('legacy-notice').hidden,false);
  console.log('PASS actual catalog 253 records / pagination / all 14 defaults and presets / 140 random clicks / parameter serialization types');process.exit(0);
}
assert.equal($('family-list').children.length,14);assert.equal($('result-status').textContent,'계산 완료');
family('coefficient');assert.equal($('answer-value').textContent,'80');
input('n','4');await wait();assert.equal($('answer-value').textContent,'8');
$('preset-row').children[1].click();assert.equal($('answer-value').textContent,'625');assert.equal($('control-p').value,'2');
$('reset-button').click();assert.equal($('answer-value').textContent,'80');
$('answer-button').click();assert.equal($('solution-content').hidden,true);input('n','4');await wait();assert.equal($('solution-content').hidden,true);$('answer-button').click();assert.equal($('solution-content').hidden,false);
input('n','2.5');await wait();assert.equal($('result-status').textContent,'조건 확인');assert.equal($('form-error').hidden,false);$('reset-button').click();
family('normal');input('mu','1.5');input('sigma','0.25');await wait();assert.equal($('result-status').textContent,'계산 완료');assert.equal($('control-sigma').step,'0.01');
$('link-button').click();await wait();assert.ok(clipboard.includes('#lab='));const saved=JSON.parse(decodeURIComponent(new URL(clipboard).hash.slice(5)));assert.equal(saved.params.mu,1.5);assert.equal(saved.params.sigma,0.25);assert.equal(typeof saved.params.n,'number');
family('arrangement');input('circular',true,'change');await wait();assert.equal($('result-warnings').hidden,false);assert.ok($('result-warnings').textContent.includes('확장 실험'));family('selection');assert.equal($('result-warnings').hidden,true);assert.equal($('result-warnings').children.length,0);
$('tab-map').click();assert.equal($('view-map').hidden,false);assert.equal($('view-lab').hidden,true);assert.ok($('catalog-count').textContent.includes('1문항'));
const search=$('filter-search');search.value='없는검색어';search.dispatch('input');await wait();assert.ok($('catalog-count').textContent.includes('0문항'));assert.ok($('catalog-list').textContent.includes('없습니다'));
search.value='';search.dispatch('input');await wait();assert.ok($('catalog-count').textContent.includes('1문항'));
$('filter-source').value='all';$('filter-source').dispatch('change');assert.ok($('catalog-count').textContent.includes('2문항'));
$('tab-map').dispatch('keydown',{key:'ArrowRight'});assert.equal($('view-compare').hidden,false);assert.equal(document.activeElement.id,'tab-compare');
console.log('PASS default render / all-type inputs / preset / reset / answer hiding / decimal steps / link copying / warnings clearing / empty search / source filters / keyboard tabs');process.exit(0);
