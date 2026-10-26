import { parseExpression, polynomial } from './expression-parser.mjs?v=20261026-structure';

const CAP=999;
const RESERVED=new Set(['__proto__','prototype','constructor']);
const DISPLAY_FIELDS=['question','answer','exact','numeric','steps','cases','samples','chart','fraction','value','probability','mean','variance','proofSummary','insight','warnings'];
const CONTINUOUS=new Set(['normal','estimation','continuous']);
const CHEAP_SCAN=new Set(['event-algebra','binomial','function','coefficient','discrete']);
const failure=message=>({status:'invalid',question:'수능 계산 범위에 맞게 조건을 조정하세요.',answer:'조건 확인 필요',numeric:null,unit:'',steps:[],cases:[],insight:message,warnings:[message]});
const limitMessage='입력·문자의 값·경우의 수·확률의 분자와 분모는 절댓값 999 이하여야 합니다. 조건을 더 작게 조정하세요.';
const isObject=value=>value!==null&&typeof value==='object';
function numeric(value){
 if(typeof value==='bigint'){if(value>999n||value< -999n)throw Error(limitMessage);return;}
 if(typeof value==='number'&&(!Number.isFinite(value)||Math.abs(value)>CAP))throw Error(limitMessage);
}
function textNumbers(source,allowYears=true){
 const superscripts={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-','⁺':'+'};
 const text=source.replaceAll('−','-').replaceAll('∞',' Infinity ').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g,part=>'^'+[...part].map(c=>superscripts[c]).join(''));
 if(/(?:^|[^A-Za-z])(?:NaN|Infinity)(?![A-Za-z])/.test(text))throw Error('유한한 값으로 계산할 수 있는 조건을 입력하세요.');
 // A comma inside parentheses separates variables or combinatorial arguments.
 let depth=0;const prepared=[...text].map(char=>{if(char==='(')depth++;if(char===')')depth--;return char===','&&depth>0?' ':char;}).join('');
 const token=/[+-]?(?:(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/g;
 for(const match of prepared.matchAll(token)){
  const number=Number(match[0].replaceAll(',','')),before=prepared.slice(Math.max(0,match.index-16),match.index),after=prepared.slice(match.index+match[0].length);
  const year=allowYears&&Number.isInteger(number)&&number>=1900&&number<=2100&&(/^(?:학년도|년도|년)/.test(after)||/(?:출처|연도|기출)\s*[:：]?\s*$/.test(before));
  if(!year)numeric(number);
 }
 if(/\/\s*(?:\(\s*[+-]?\s*(?:0+(?:\.0*)?|\.0+)\s*\)|[+-]?\s*(?:0+(?:\.0*)?|\.0+)(?![\d.eE!]))/.test(prepared))throw Error('확률과 유리수의 분모는 0일 수 없습니다.');
 for(const match of prepared.matchAll(/([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\/\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))/g))if(Number(match[2])===0)throw Error('확률과 유리수의 분모는 0일 수 없습니다.');
 for(const match of prepared.matchAll(/(?:\(\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\)|([+-]?(?:\d+(?:\.\d*)?|\.\d+)))\s*\^\s*(?:\(\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\)|([+-]?(?:\d+(?:\.\d*)?|\.\d+)))/g))numeric(Number(match[1]??match[2])**Number(match[3]??match[4]));
}
function inspectTree(value,{input=false}={},path=new WeakSet(),state={nodes:0},depth=0){
 if(++state.nodes>3000||depth>28)throw Error('조건의 구조가 너무 복잡합니다.');
 if(value==null||typeof value==='boolean')return;
 if(typeof value==='number'||typeof value==='bigint'){numeric(value);return;}
 if(typeof value==='string'){if(input&&value.length>2000)throw Error('입력 문자열이 너무 깁니다.');textNumbers(value,!input);return;}
 if(!isObject(value))throw Error('입력 형식이 올바르지 않습니다.');
 if(path.has(value))throw Error('순환하는 입력 구조는 사용할 수 없습니다.');
 if(input){const proto=Object.getPrototypeOf(value);if(proto!==null&&proto!==Object.prototype&&proto!==Array.prototype)throw Error('입력 객체의 형식을 확인하세요.');}
 path.add(value);
 for(const key of Object.keys(value)){
  if(RESERVED.has(key))throw Error('사용할 수 없는 입력 키가 있습니다.');
  if((key==='denominator'||key==='den')&&(value[key]===0||value[key]===0n||value[key]==='0'))throw Error('분모는 0일 수 없습니다.');
  inspectTree(value[key],{input},path,state,depth+1);
 }
 path.delete(value);
}
function inspectExpressions(structure,k){
 if(!structure?.enabled)return;
 const expanded=new Map();
 const expressions=[structure.left,structure.right,...(Array.isArray(structure.conditions)?structure.conditions.filter(c=>c?.kind==='expression').flatMap(c=>[c.left,c.right]):[])];
 for(const source of expressions){
  const ast=parseExpression(source,k);
  function constant(tree){
   if(tree.type==='number'){numeric(tree.value);return tree.value;}
   if(tree.type==='variable')return null;
   if(tree.type==='unary'){const n=constant(tree.argument);if(n===null)return null;const v=tree.op==='-'?-n:n;numeric(v);return v;}
   if(tree.type==='square'){const n=constant(tree.argument);if(n===null)return null;const v=n*n;numeric(v);return v;}
   const a=constant(tree.left),b=constant(tree.right);if(a===null||b===null)return null;
   const v=tree.op==='+'?a+b:tree.op==='-'?a-b:a*b;numeric(v);return v;
  }
  constant(ast);const poly=polynomial(ast);for(const coefficient of poly.values())numeric(coefficient);expanded.set(source,poly);
 }
 const pairs=[[structure.left,structure.right],...(Array.isArray(structure.conditions)?structure.conditions.filter(c=>c?.kind==='expression').map(c=>[c.left,c.right]):[])];
 for(const [left,right]of pairs){const difference=new Map(expanded.get(left));for(const [key,value]of expanded.get(right))difference.set(key,(difference.get(key)??0)-value);for(const coefficient of difference.values())numeric(coefficient);}
}
const cloneControl=control=>({...control,...(Array.isArray(control.options)?{options:control.options.map(option=>({...option}))}:{})});
function clampControl(control,id){
 const result=cloneControl(control);if(result.type!=='number')return result;
 result.min=Math.max(-CAP,Number.isFinite(result.min)?result.min:-CAP);result.max=Math.min(CAP,Number.isFinite(result.max)?result.max:CAP);
 if(id==='integer-sum'&&['total','lower','upper'].includes(result.key)){result.min=Math.max(-30,result.min);result.max=Math.min(30,result.max);}
 return result;
}
function strictControls(params,controls){
 for(const control of controls){
  const value=params[control.key];
  if(control.type==='number'){
   const tolerance=control.normalBound?1e-7:1e-9;
   if(typeof value!=='number'||!Number.isFinite(value)||value<control.min-tolerance||value>control.max+tolerance)throw Error(`${control.label??control.key}의 값을 허용된 범위 안에서 입력하세요.`);
   if(control.step!=='any'&&!control.normalBound){const step=control.step??1;if(typeof step!=='number'||step<=0)throw Error('입력 간격을 확인하세요.');const units=value/step;if(Math.abs(units-Math.round(units))>1e-7)throw Error(`${control.label??control.key}의 입력 간격을 확인하세요.`);}
  }else if(control.type==='checkbox'){if(typeof value!=='boolean')throw Error('조건 선택값은 참 또는 거짓이어야 합니다.');}
  else if(control.type==='select'&&!control.options?.some(option=>option.value===value))throw Error(`${control.label??control.key}의 선택값을 확인하세요.`);
 }
}
function stable(value){if(Array.isArray(value))return value.map(stable);if(isObject(value))return Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])]));return value;}
function simpleStructure(params){
 const s=params.structure;if(!s?.enabled||!Array.isArray(s.variables)||!Array.isArray(s.conditions)||s.conditions.length||s.relation!==params.relation||s.variables.some(v=>v&&((v.domain&&v.domain!=='inherit')||(v.parity&&v.parity!=='any')||v.lower!=null||v.upper!=null)))return false;
 try{const left=polynomial(parseExpression(s.left,params.k)),right=polynomial(parseExpression(s.right,params.k));return left.size===params.k&&Array.from({length:params.k},(_,i)=>left.get(String(i))===1).every(Boolean)&&right.size<2&&(right.get('')??0)===params.total;}catch{return false;}
}
function simpleBeforeChange(params,key){
 if(simpleStructure(params))return true;const s=params.structure;if(!s?.enabled)return false;
 if(key==='k'&&Array.isArray(s.variables)&&simpleStructure({...params,k:s.variables.length}))return true;
 if(key==='relation'&&simpleStructure({...params,relation:s.relation}))return true;
 if(key==='total')try{const right=polynomial(parseExpression(s.right,params.k));if(right.size<2&&simpleStructure({...params,total:right.get('')??0}))return true;}catch{}
 return false;
}
function integerPhysicalControls(params,controls){
 if(params.structure?.enabled&&!simpleStructure(params))return controls;
 const info={natural:[1,1,0],nonnegative:[0,1,0],integer:[-Infinity,1,0],'positive-even':[2,2,0],'positive-odd':[1,2,1],'integer-even':[-Infinity,2,0],'integer-odd':[-Infinity,2,1]}[params.domain];
 if(!info||!Number.isInteger(params.k))return controls;
 const[domainLow,step,residue]=info,mod=(v,d)=>((v%d)+d)%d;
 let low=Math.max(domainLow,params.lowerOn?params.lower:-Infinity),high=params.upperOn?params.upper:Infinity;
 if(Number.isFinite(low))low+=mod(residue-low,step);if(Number.isFinite(high))high-=mod(high-residue,step);
 const offset=params.distinct||params.order==='increasing'?step*params.k*(params.k-1)/2:0,minimum=params.k*low+offset,maximum=params.k*high-offset;
 return controls.map(control=>{
  if(control.key!=='total')return control;let min=control.min,max=control.max;
  if(['eq','le','lt'].includes(params.relation)&&Number.isFinite(minimum))min=Math.max(min,minimum+(params.relation==='lt'?1:0));
  if(['eq','ge','gt'].includes(params.relation)&&Number.isFinite(maximum))max=Math.min(max,maximum-(params.relation==='gt'?1:0));
  return{...control,min,max};
 });
}
function syncStructure(params){return{...params,structure:{...params.structure,left:Array.from({length:params.k},(_,i)=>String.fromCharCode(97+i)).join('+'),right:String(params.total),relation:params.relation,variables:Array.from({length:params.k},(_,i)=>params.structure.variables[i]??{domain:'inherit',parity:'any',lower:null,upper:null})}};}

export function createExamSpec(rawSpec,profile={}){
 let defaults={...rawSpec.defaults,...profile.defaults};
 const baseControls=rawSpec.controls.map(cloneControl),known=new Set([...Object.keys(rawSpec.defaults),...(rawSpec.id==='integer-sum'?['structure']:[])]),allowedCache=new Map();
 const merge=input=>{const p={...defaults};for(const key of Object.keys(input??{}))if(known.has(key))p[key]=input[key];return p;};
 function getControls(input={}){
  const p=merge(isObject(input)&&!Array.isArray(input)?input:{});
  try{const controls=(profile.controls?profile.controls(p,baseControls.map(cloneControl)):baseControls).map(control=>clampControl(control,rawSpec.id));return rawSpec.id==='integer-sum'?integerPhysicalControls(p,controls):controls;}
  catch{return baseControls.map(control=>clampControl(control,rawSpec.id));}
 }
 function solve(input={}){
  try{
   if(!isObject(input)||Array.isArray(input))throw Error('입력은 매개변수 객체여야 합니다.');inspectTree(input,{input:true});
   const params=merge(input);inspectTree(params,{input:true});strictControls(params,getControls(params));inspectExpressions(params.structure,params.k);
   if(profile.validate){const error=profile.validate(params);if(error)throw Error(error);}
   let result=rawSpec.solve(params);
   if(result?.status!=='ok')return result?.status==='invalid'?result:failure('유한한 경우의 수와 계산 범위를 확정할 수 있는 조건을 입력하세요.');
   if(profile.transformResult)result=profile.transformResult(params,result)??result;
   for(const field of DISPLAY_FIELDS)if(result[field]!==undefined)inspectTree(result[field]);
   if(profile.facts){const facts=profile.facts(params,result);if(facts)for(const key of ['counts','denominators','values'])if(facts[key]!==undefined)inspectTree(facts[key]);}
   return result;
  }catch(error){return failure(error instanceof Error?error.message:limitMessage);}
 }
 function normalizeParams(input={},changedKey){
  let p=merge(isObject(input)&&!Array.isArray(input)?input:{});
  const sync=rawSpec.id==='integer-sum'&&simpleBeforeChange(p,changedKey);if(sync)p=syncStructure(p);
  for(let pass=0;pass<3;pass++)for(const control of getControls(p)){
   if(control.key===changedKey)continue;const value=p[control.key];
   if(control.type==='number'&&typeof value==='number'&&Number.isFinite(value)&&control.min<=control.max){let next=Math.min(control.max,Math.max(control.min,value));if(control.step!=='any'&&!control.normalBound){const step=control.step??1;next=Math.round(next/step)*step;if(next<control.min)next=Math.ceil(control.min/step)*step;if(next>control.max)next=Math.floor(control.max/step)*step;}p[control.key]=Number(next.toPrecision(14));}
   if(control.type==='select'&&!control.options?.some(option=>option.value===value))p[control.key]=control.options?.[0]?.value;
  }
  return sync?syncStructure(p):p;
 }
 function allowedValues(key,input={}){
  const p=merge(isObject(input)&&!Array.isArray(input)?input:{}),control=getControls(p).find(c=>c.key===key);
  if(!control||control.type!=='number'||control.step==='any'||!Number.isInteger(control.step??1)||!Number.isInteger(control.min)||!Number.isInteger(control.max)||CONTINUOUS.has(rawSpec.id))return null;
  const synced=rawSpec.id==='integer-sum'&&simpleStructure(p);if(p.structure?.enabled&&!synced)return null;
  const width=control.max-control.min;if(width<0)return [];if(width>60&&(!CHEAP_SCAN.has(rawSpec.id)||width>1000))return null;
  const cacheParams={...p};delete cacheParams[key];if(synced){cacheParams.structure={simpleSum:true};}
  let cacheKey;try{cacheKey=JSON.stringify([key,control.min,control.max,control.step,stable(cacheParams)]);}catch{return null;}
  if(allowedCache.has(cacheKey))return allowedCache.get(cacheKey).slice();
  const result=[],step=control.step??1;
  for(let value=control.min;value<=control.max;value+=step){let candidate={...p,[key]:value};if(synced)candidate=syncStructure(candidate);candidate=normalizeParams(candidate,key);if(synced)candidate=syncStructure(candidate);if(solve(candidate).status==='ok')result.push(value);}
  if(allowedCache.size>=120)allowedCache.delete(allowedCache.keys().next().value);allowedCache.set(cacheKey,result);return result.slice();
 }
 const candidates=profile.presets??rawSpec.presets??[];
 if(solve(defaults).status!=='ok')for(const preset of candidates){const candidate={...defaults,...preset.params};if(solve(candidate).status==='ok'){defaults=candidate;break;}}
 const presets=candidates.map(preset=>({...preset,params:{...defaults,...preset.params}})).filter(preset=>solve(preset.params).status==='ok');
 return{...rawSpec,defaults,controls:getControls(defaults),presets,getControls,solve,allowedValues,normalizeParams};
}
