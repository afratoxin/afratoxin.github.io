// Small DOM adapter for behavioral app checks; it does not test browser layout.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {pathToFileURL, fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url)).replace(/\/$/,'');
const scenario=process.argv[2];
if(!scenario)process.exit(0);
process.env.TEST_NETWORK_FAIL=scenario==='network'?'1':'';
process.env.TEST_REAL_CATALOG=scenario==='catalog'?'1':'';
process.env.TEST_HASH=scenario==='hash'?'#lab='+encodeURIComponent(JSON.stringify({family:'normal',params:{mu:1.5,sigma:0.25,n:4,lower:1,upper:2},view:'compare'})):scenario==='malformed'?'#lab='+encodeURIComponent(JSON.stringify({family:'integer-sum',params:null})):'';
let randomSeed=137;Math.random=()=>((randomSeed=(randomSeed*1664525+1013904223)>>>0)/2**32);
class Element {
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.parentNode=null;this.attrs={};this.dataset={};this.style={setProperty(name,value){this[name]=String(value);}};this.events={};this.hidden=false;this.disabled=false;this._value='';this._text='';this.checked=false;this.selected=false;this.type='';}
  get id(){return this.attrs.id||'';} set id(v){this.attrs.id=String(v);}
  get className(){return this.attrs.class||'';} set className(v){this.attrs.class=String(v);}
  get textContent(){return this._text+this.children.map(x=>x.textContent).join('');} set textContent(v){this.replaceChildren();this._text=String(v);}
  get value(){if(this.tagName==='SELECT') {const selected=this.children.find(o=>o.selected);return selected?selected.value:(this.children[0]?.value||'');}return this._value;}
  set value(v){v=String(v);this._value=v;if(this.tagName==='SELECT')this.children.forEach(o=>o.selected=o.value===v);}
  get valueAsNumber(){return this.value===''?NaN:Number(this.value);} set valueAsNumber(value){this.value=String(value);}
  get validity(){const value=Number(this.value),step=Number(this.step||1),min=Number(this.min||0), units=(value-min)/step;return {valid:!(this.required&&this.value==='')&&Number.isFinite(value)&&(this.min===undefined||value>=Number(this.min))&&(this.max===undefined||value<=Number(this.max))&&Math.abs(units-Math.round(units))<1e-7};}
  append(...nodes){for(let n of nodes){if(typeof n==='string'){const t=new Element('#text');t._text=n;n=t;}n.remove();n.parentNode=this;this.children.push(n);}}
  prepend(...nodes){for(const n of [...nodes].reverse()){n.remove();n.parentNode=this;this.children.unshift(n);}}
  replaceChildren(...nodes){for(const c of this.children)c.parentNode=null;this.children=[];this._text='';this.append(...nodes);}
  remove(){if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(c=>c!==this);this.parentNode=null;}}
  setAttribute(k,v){this.attrs[k]=String(v);if(k==='value')this._value=String(v);if(k==='type')this.type=String(v);if(k==='selected')this.selected=true;if(k==='hidden')this.hidden=true;if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,x)=>x.toUpperCase())]=String(v);}
  getAttribute(k){return Object.hasOwn(this.attrs,k)?this.attrs[k]:null;}
  addEventListener(name,fn){(this.events[name]??=[]).push(fn);}
  dispatch(name,extra={}){if(this.disabled&&name==='click')return;const event={type:name,target:this,currentTarget:this,preventDefault(){},...extra};for(const fn of this.events[name]||[])fn(event);}
  click(){if(this.type==='checkbox')this.checked=!this.checked;this.dispatch('click');}
  focus(){document.activeElement=this;} scrollIntoView(){} select(){}
  querySelectorAll(selector){return descend(this).filter(e=>matches(e,selector));}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
}
function descend(node){return node.children.flatMap(c=>[c,...descend(c)]);}
function matches(e,selector){if(selector.includes(','))return selector.split(',').some(s=>matches(e,s.trim()));if(selector.startsWith('#'))return e.id===selector.slice(1);if(selector.startsWith('.'))return e.className.split(/\s+/).includes(selector.slice(1));if(selector.startsWith('[')){const [key,value]=selector.slice(1,-1).split('=');return e.getAttribute(key)!==null&&(value===undefined||e.getAttribute(key)===value.replace(/["']/g,''));}return e.tagName===selector.toUpperCase();}
const document=new Element('document'); document.createElement=tag=>new Element(tag);document.createTextNode=text=>{const e=new Element('#text');e._text=String(text);return e;};document.getElementById=id=>descend(document).find(e=>e.id===id)||null;
const source=fs.readFileSync(root+'/index.html','utf8');const stack=[document];const voids=new Set(['META','LINK','INPUT','BR','HR','IMG']);
for(const token of source.match(/<[^>]+>|[^<]+/g)||[]){if(token.startsWith('<!'))continue;if(token.startsWith('</')){const tag=token.slice(2,-1).trim().toUpperCase(),index=stack.findLastIndex(e=>e.tagName===tag);if(index>0)stack.splice(index);continue;}if(token.startsWith('<')){const match=token.match(/^<([\w-]+)/);if(!match)continue;const e=new Element(match[1]);for(const m of token.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)){if(m.index<=1)continue;e.setAttribute(m[1],m[2]??m[3]??m[4]??'');}stack.at(-1).append(e);if(!voids.has(e.tagName))stack.push(e);}else{const t=document.createTextNode(token);stack.at(-1).append(t);}}
document.body=document.querySelector('body');
const windowEvents={};const window={addEventListener(name,fn){(windowEvents[name]??=[]).push(fn);}};
const location=new URL('https://example.test/probability-lab/'+(process.env.TEST_HASH||''));let clipboard='';
Object.assign(globalThis,{document,window,location,Option:function(text,value){const o=new Element('option');o.textContent=text;o.value=value;return o;},history:{replaceState(_a,_b,url){location.href=String(url);}}});
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{async writeText(v){clipboard=v;}}}});
const catalog={families:[{id:'integer-sum',title:'정수해와 분배',observedConditions:['실제 조건'],proposedConditions:['제안 조건'],differences:['차이']}],items:[{id:'r1',source:'recent',family:'integer-sum',academicYear:2026,session:'9월',question:23,pdfPage:1,summary:'정수해 합 조건',conditions:['모두 자연수'],parameters:['상한'],insight:'분배'},{id:'l1',source:'legacy',family:'normal',academicYear:2020,session:'수능',question:12,pdfPage:2,summary:'표본평균',conditions:['표본 크기'],parameters:['평균'],insight:'표준화'}],coverage:{recent:{exams:1,items:1}},sourceDocuments:[]};
globalThis.fetch=async()=>{if(process.env.TEST_NETWORK_FAIL)throw Error('test-network-failure');return {ok:true,json:async()=>process.env.TEST_REAL_CATALOG?JSON.parse(fs.readFileSync(root+'/data/catalog.json','utf8')):catalog};};
const warnings=[];console.warn=(...args)=>warnings.push(args);
await import(pathToFileURL(root+'/app.mjs').href+'?test='+Date.now());
await new Promise(resolve=>setTimeout(resolve,0));
const $=id=>document.getElementById(id);const wait=()=>new Promise(resolve=>setTimeout(resolve,120));
const family=id=>{$('family-list').children.find(e=>e.dataset.family===id).click();};
const input=(key,value,event='input')=>{const e=$('control-'+key);if(e.type==='checkbox')e.checked=value;else e.value=value;e.dispatch(event);return e;};
const select=(key,index)=>input(key,String(index),'change');
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
  const {specs}=await import(root+'/engines.mjs');
  const drag=(key,value)=>{
    const slider=$('slider-'+key);
    assert.ok(slider,`slider-${key} must be present`);
    assert.equal(slider.type,'range',`slider-${key} is a native range input`);
    slider.value=String(value);slider.dispatch('input');return slider;
  };
  const assertSliders=(spec,params)=>{
    for(const control of spec.controls){
      const slider=$('slider-'+control.key);
      assert.ok(slider,`${spec.id}.${control.key} has a slider`);
      assert.equal(slider.type,'range');
      assert.ok(slider.getAttribute('aria-label'),`${spec.id}.${control.key} slider has an accessible name`);
      assert.ok(document.querySelectorAll('label').some(label=>label.htmlFor===slider.id),`${spec.id}.${control.key} label names the slider`);
      assert.equal(slider.min,String(control.type==='number'?control.min:0));
      assert.equal(slider.max,String(control.type==='number'?control.max:control.type==='select'?control.options.length-1:1));
      assert.equal(slider.step,String(control.type==='number'?(control.step??1):1));
      const expected=control.type==='number'?params[control.key]:control.type==='checkbox'?(params[control.key]?1:0):control.options.findIndex(o=>o.value===params[control.key]);
      assert.equal(Number(slider.value),Number(expected),`${spec.id}.${control.key} slider matches its companion`);
      if(control.type==='select')assert.equal(slider.getAttribute('aria-valuetext'),control.options[expected].label);
      if(control.type==='checkbox')assert.equal(slider.getAttribute('aria-valuetext'),params[control.key]?'적용':'미적용');
    }
  };
  // Known answers test the actual drag -> typed parameter -> solve -> render path.
  assert.ok($('slider-total'),'the sum control must have a primary drag slider');
  assert.equal($('slider-total').value,'7');
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
  for(const [index,status,answer] of [[0,'계산 완료','21'],[1,'계산 완료','56'],[2,'계산 완료','35'],[3,'무한히 많음',null],[4,'무한히 많음',null]]){
    drag('relation',index);assert.equal($('control-relation').value,String(index));await wait();
    assert.equal($('result-status').textContent,status,`relation option ${index} has its mathematical meaning`);
    if(answer!==null)assert.equal($('answer-value').textContent,answer);
  }
  select('relation',0);await wait();assert.equal($('slider-relation').value,'0');assert.equal($('answer-value').textContent,'21');
  for(const [index,answer,status='계산 완료'] of [[0,'21'],[1,'45'],[2,null,'무한히 많음'],[3,'3'],[4,'0'],[5,null,'무한히 많음'],[6,'0']]){
    drag('domain',index);await wait();assert.equal($('control-domain').value,String(index));
    assert.equal($('result-status').textContent,status,`domain option ${index} keeps its intended type`);
    if(answer!==null)assert.equal($('answer-value').textContent,answer);
  }
  select('domain',0);await wait();assert.equal($('slider-domain').value,'0');
  drag('upperOn',1);assert.equal($('control-upperOn').checked,true);await wait();
  drag('upper',3);await wait();assert.equal($('answer-value').textContent,'3');
  drag('upperOn',0);assert.equal($('control-upperOn').checked,false);await wait();assert.equal($('answer-value').textContent,'21');
  input('upperOn',true,'change');await wait();assert.equal($('slider-upperOn').value,'1');assert.equal($('answer-value').textContent,'3');
  input('upperOn',false,'change');input('total','10');await wait();assert.equal($('slider-total').value,'10');
  for(const bad of ['10.5','','999']){
    input('total',bad);await wait();assert.equal($('result-status').textContent,'조건 확인');
    assert.equal($('form-error').hidden,false);assert.equal($('slider-total').value,'10','invalid exact entry must not move or sanitize the slider');
  }
  input('total','8');await wait();assert.equal($('slider-total').value,'8');assert.equal($('answer-value').textContent,'21');
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
    setHash(data);const spec=specs.find(s=>s.id===data.family);assertSliders(spec,{...spec.defaults,...data.params});
    assert.equal($('result-status').textContent,'계산 완료');
  }
  // Every control retains its own metadata and resets together with its companion.
  for(const spec of specs){family(spec.id);assertSliders(spec,spec.defaults);}
  console.log('PASS continuous drag before release / immediate final value / drag math answers / relation-domain meanings / checkbox and decimal sync / invalid exact entry / preset-reset-link state / all 13 slider metadata');process.exit(0);
}
if(process.env.TEST_REAL_CATALOG){
  const {specs}=await import(root+'/engines.mjs');
  for(const spec of specs){
    family(spec.id);
    assert.equal($('answer-value').textContent,spec.solve(spec.defaults).answer,spec.id+' defaults');
    for(let index=0;index<spec.presets.length;index++){
      $('preset-row').children[index].click();
      assert.equal($('answer-value').textContent,spec.solve({...spec.defaults,...spec.presets[index].params}).answer,spec.id+' preset '+index);
      assert.equal($('form-error').hidden,true,spec.id+' preset '+index+' browser validity');
    }
    for(let i=0;i<10;i++){$('random-button').click();assert.equal($('result-status').textContent,'계산 완료',spec.id+' random '+i);assert.equal($('form-error').hidden,true,spec.id+' random '+i+' browser validity');}
    $('link-button').click();await new Promise(resolve=>setTimeout(resolve,0));
    const saved=JSON.parse(decodeURIComponent(new URL(clipboard).hash.slice(5)));
    for(const c of spec.controls)assert.equal(typeof saved.params[c.key],c.type==='number'?'number':c.type==='checkbox'?'boolean':typeof c.options[0].value,spec.id+'.'+c.key+' serialized type');
  }
  $('tab-map').click();assert.ok($('catalog-count').textContent.includes('136문항'));
  $('filter-source').value='all';$('filter-source').dispatch('change');assert.ok($('catalog-count').textContent.includes('253문항'));
  let seen=12;while(!$('pagination').children.at(-1).disabled){$('pagination').children.at(-1).click();seen+=$('catalog-list').children.length;}
  assert.equal(seen,253);
  $('filter-source').value='legacy';$('filter-source').dispatch('change');assert.ok($('catalog-count').textContent.includes('117문항'));assert.equal($('legacy-notice').hidden,false);
  console.log('PASS actual catalog 253 records / pagination / all 13 defaults and presets / 130 random clicks / parameter serialization types');process.exit(0);
}
assert.equal($('family-list').children.length,13);assert.equal($('result-status').textContent,'계산 완료');
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
