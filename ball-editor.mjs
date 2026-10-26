import { COLORS, emptyBallRules } from './engines/ball-rules.mjs?v=20261026-challenge-grid';
const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=String(text);return e;};
const clone=x=>JSON.parse(JSON.stringify(x));
const relations=[['eq','='],['ne','≠'],['ge','≥'],['le','≤'],['gt','>'],['lt','<']];
export function createBallEditor(params,distribution,onChange,fields){
 let rules=clone(params.ballRules??emptyBallRules()),active='event',index=0,colorIndex=0;
 const panels=Object.fromEntries(['variables','expression','conditions'].map(key=>[key,node('div','ball-editor')]));
 const safeGroup=()=>{const g=rules?.[active];return g&&Array.isArray(g.rules)?g:{logic:'and',negate:false,rules:[]};};
 const commit=(drag=false)=>onChange({drag});
 function select(label,id,options,value,change,parent){
  const field=node('div','ball-field'),text=node('label','control-label',label),input=node('select','control-input'),range=node('input','control-range');text.htmlFor=id;input.id=id;range.id=id+'-slider';range.type='range';range.min='0';range.max=String(options.length-1);range.step='1';range.setAttribute('aria-label',label+' 드래그로 조절');
  options.forEach(([v,l])=>{const option=new Option(l,String(v));input.append(option);});input.value=String(value);range.value=String(Math.max(0,options.findIndex(([v])=>v===value)));
  input.addEventListener('change',()=>{range.value=String(options.findIndex(([v])=>String(v)===input.value));change(options[Number(range.value)][0]);});range.addEventListener('input',()=>{input.value=String(options[Number(range.value)][0]);change(options[Number(range.value)][0]);});
  field.append(text,range,input);parent.append(field);return input;
 }
 function number(label,id,value,min,max,change,parent){
  const field=node('div','ball-field'),text=node('label','control-label',label),range=node('input','control-range'),input=node('input','control-input');text.htmlFor=id;input.id=id;input.type='number';input.min=String(min);input.max=String(max);input.step='1';input.value=String(value);range.id=id+'-slider';range.type='range';range.min=String(min);range.max=String(max);range.step='1';range.value=String(value);range.setAttribute('aria-label',label+' 드래그로 조절');
  input.addEventListener('input',()=>{range.value=input.value;change(input.value===''?NaN:Number(input.value),false);});range.addEventListener('input',()=>{input.value=range.value;change(Number(range.value),true);});field.append(text,range,input);parent.append(field);
 }
 function button(text,id,fn,parent){const b=node('button','button button-secondary compact-button',text);b.type='button';b.id=id;b.addEventListener('click',fn);parent.append(b);return b;}
 function scope(label,key,options,rule,parent){
  const section=node('div','ball-scope');section.append(node('p','control-label',label));const chips=node('div','ball-chips');
  for(const [value,label]of options){const b=node('button','ball-chip',label);b.type='button';if(key==='colors')b.dataset.color=String(value);b.setAttribute('aria-pressed',String((rule[key]??options.map(x=>x[0])).includes(value)));b.addEventListener('click',()=>{const old=rule[key]??options.map(x=>x[0]);rule[key]=old.includes(value)?old.filter(x=>x!==value):[...old,value].sort((a,b)=>a-b);b.setAttribute('aria-pressed',String(rule[key].includes(value)));commit();});chips.append(b);}
  section.append(chips);parent.append(section);
 }
 const choices=distribution?[['eachBox','상자마다 선택한 색의 공 수'],['boxKinds','상자마다 들어 있는 색 종류'],['boxParity','상자별 공 수의 홀짝'],['occupiedBoxes','공이 있는 상자 수'],['emptyBoxes','빈 상자 수'],['monoBoxes','단색 상자 수'],['mixedBoxes','여러 색 상자 수'],['allColorsBoxes','선택한 모든 색이 있는 상자 수'],['boxColorCompare','상자 안 두 색의 수 비교'],['colorOnlyBoxes','한 가지 색만 든 상자 수'],['expression','문자식 · 합·차·곱·제곱']]:[['count','선택한 색의 공 수 합'],['each','선택한 색마다 공 수'],['kinds','뽑힌 색 종류 수'],['parity','선택한 색 공 수 합의 홀짝'],['expression','문자식 · 합·차·곱·제곱']];
 function add(kind=choices[0][0]){
  if(!rules||typeof rules!=='object'||Array.isArray(rules))rules=emptyBallRules();
  if(!rules[active]||!Array.isArray(rules[active].rules))rules[active]={logic:'and',negate:false,rules:[]};
  const g=rules[active];if(g.rules.length>=8)return;g.rules.push(newRule(kind));index=g.rules.length-1;render();commit();
 }
 function newRule(kind){return {kind,colors:kind==='boxColorCompare'?(params.colorKinds>=7?[5,6]:[0,1]):kind==='colorOnlyBoxes'?[params.colorKinds>=7?6:0]:Array.from({length:params.colorKinds},(_,i)=>i),...(distribution?{boxes:Array.from({length:params.boxes},(_,i)=>i)}:{}),target:kind==='parity'||kind==='boxParity'||kind==='colorOnlyBoxes'?0:1,relation:'eq',left:(distribution?params.boxes:params.colorKinds)>1?'a+b':'a',right:'1'};}
 function targetMaximum(rule){
  const selected=rule.colors??Array.from({length:params.colorKinds},(_,i)=>i);
  if(!distribution)return rule.kind==='kinds'?selected.length:params.draw;
  if(rule.kind==='eachBox')return selected.reduce((total,i)=>total+Number(params[COLORS[i]?.[0]]??0),0);
  if(rule.kind==='boxKinds')return selected.length;
  if(rule.kind==='colorOnlyBoxes')return params.boxes;
  return params.boxes;
 }
 function updateParams(next){
  params=next;
  const rule=safeGroup().rules[index],input=panels.conditions.querySelector('#ball-rule-target'),slider=panels.conditions.querySelector('#ball-rule-target-slider');
  if(!rule||!input||!slider)return;
  const maximum=Math.max(0,Math.min(999,targetMaximum(rule)));
  input.max=String(maximum);slider.max=String(maximum);
  if(Number.isFinite(rule.target))slider.value=String(Math.max(0,Math.min(maximum,rule.target)));
 }
 function render(){
  const host=panels.conditions;host.replaceChildren();const g=safeGroup();
  if(!distribution)select('편집할 사건','ball-event', [['event','구하는 사건 A'],['given','주어진 조건 사건 B']],active,value=>{active=value;index=0;render();},host);
  select('조건 묶는 방법','ball-rule-logic',[['and','모든 조건을 만족 (AND)'],['or','하나 이상 만족 (OR)']],g.logic,value=>{g.logic=value;rules[active]=g;commit();},host);
  select('사건 / 여사건','ball-rule-negate',[[false,'조건 묶음 그대로'],[true,'조건 묶음의 여사건']],Boolean(g.negate),value=>{g.negate=value;rules[active]=g;commit();},host);
  const nav=node('div','ball-navigation');const prev=button('←','ball-rule-prev',()=>{index--;render();},nav),status=node('span','',g.rules.length?`${index+1} / ${g.rules.length}`:'조건 없음');nav.append(status);const next=button('→','ball-rule-next',()=>{index++;render();},nav);prev.disabled=index<=0;next.disabled=index>=g.rules.length-1;button('+ 조건','ball-rule-add',()=>add(),nav).disabled=g.rules.length>=8;host.append(nav);
  index=Math.max(0,Math.min(index,g.rules.length-1));const r=g.rules[index];
  if(!r){host.append(node('p','control-hint','조건을 추가하고 적용할 색·상자만 선택하세요.'+(distribution?'':' 기본 탭의 빨간 공 조건도 함께 적용됩니다.')));return;}
  const card=node('div','ball-rule-card'),availableChoices=distribution&&params.colorKinds<2?choices.filter(([kind])=>kind!=='boxColorCompare'):choices;select('조건 종류','ball-rule-kind',availableChoices,r.kind,value=>{g.rules[index]=newRule(value);render();commit();},card);
  if(!['occupiedBoxes','emptyBoxes','monoBoxes','mixedBoxes'].includes(r.kind))scope(distribution?(r.kind==='boxColorCompare'?'비교할 두 색 · 색 순서대로 왼쪽과 오른쪽':'계산할 공의 색'):'적용할 색','colors',COLORS.slice(0,params.colorKinds).map((x,i)=>[i,x[1]]),r,card);
  if(['eachBox','boxKinds','boxParity','boxColorCompare'].includes(r.kind))scope(params.boxesDistinct?'적용할 상자':'모든 상자를 선택하세요','boxes',Array.from({length:params.boxes},(_,i)=>[i,String.fromCharCode(65+i)]),r,card);
  if(r.kind==='expression'){
   card.append(node('p','control-hint',distribution?'a, b, … = 각 상자의 선택한 색 공 수':'a, b, … = 색 순서대로 뽑힌 공의 개수'));
   for(const key of ['left','right']){const label=node('label','control-label',key==='left'?'왼쪽 식':'오른쪽 식'),input=node('input','control-input');input.type='text';input.id='ball-rule-'+key;label.htmlFor=input.id;input.value=r[key];input.maxLength=500;input.addEventListener('input',()=>{r[key]=input.value;commit();});card.append(label,input);}
   select('식의 관계','ball-rule-relation',relations,r.relation,value=>{r.relation=value;commit();},card);
  }else if(r.kind==='parity'||r.kind==='boxParity')select('홀짝','ball-rule-parity',[[0,'짝수'],[1,'홀수']],r.target,value=>{r.target=value;commit();},card);
  else if(r.kind==='boxColorCompare')select('두 색의 수 비교','ball-rule-relation',relations,r.relation,value=>{r.relation=value;commit();},card);
  else {select('수량 조건','ball-rule-relation',relations,r.relation,value=>{r.relation=value;commit();},card);number('기준값','ball-rule-target',r.target,0,targetMaximum(r),(value,drag)=>{r.target=value;commit(drag);},card);}
  button('이 조건 삭제','ball-rule-delete',()=>{g.rules.splice(index,1);index=Math.min(index,g.rules.length-1);render();commit();},card);host.append(card);
 }
 function renderColors(){
  const host=panels.variables;host.replaceChildren();const available=fields.filter(x=>x.control.group==='colors');colorIndex=Math.max(0,Math.min(colorIndex,available.length-1));
  select('편집할 공의 색','ball-color-current',available.map((x,i)=>[i,x.control.label.replace(' 공 수','')]),colorIndex,value=>{colorIndex=value;renderColors();},host);
  available.forEach((entry,i)=>{entry.field.hidden=i!==colorIndex;host.append(entry.field);});
  host.append(node('p','control-hint',distribution?'색별 보유 수량을 조정합니다. 식의 a, b, …는 상자별 공 수입니다.':COLORS.slice(0,params.colorKinds).map((x,i)=>`${String.fromCharCode(97+i)} = ${x[1]} 공 수`).join(' · ')));
 }
 panels.expression.append(node('p','control-hint',distribution?'상자별 공 수에 합·차·곱·상수배·제곱 조건을 추가합니다. 예: a^2-b = 0':'색별 개수에 복합식 조건을 추가합니다. 예: a*b+c^2 ≥ 1'));
 button('문자식 조건 추가','ball-expression-add',()=>{active='event';add('expression');document.getElementById('adjust-tab-conditions').click();},panels.expression);
 const seq=fields.filter(x=>x.control.group==='sequence');for(const entry of seq){entry.field.hidden=false;panels.expression.append(entry.field);}
 panels.expression.append(node('p','control-hint','식은 +, -, *, ^2와 괄호를 사용합니다. 조건 탭에서 관계와 적용 대상을 편집합니다.'));
 renderColors();render();
 return {panels,read:()=>clone(rules),updateParams};
}
