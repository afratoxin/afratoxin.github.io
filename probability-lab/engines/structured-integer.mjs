import { parseExpression, polynomial } from './expression-parser.mjs?v=20261026-structure';

const DOMAINS={natural:{label:'자연수',low:1,step:1,residue:0},nonnegative:{label:'0 이상의 정수',low:0,step:1,residue:0},integer:{label:'정수',low:-Infinity,step:1,residue:0},'positive-even':{label:'양의 짝수',low:2,step:2,residue:0},'positive-odd':{label:'양의 홀수',low:1,step:2,residue:1},'integer-even':{label:'짝수인 정수',low:-Infinity,step:2,residue:0},'integer-odd':{label:'홀수인 정수',low:-Infinity,step:2,residue:1}};
const LABELS={eq:'=',ne:'≠',lt:'<',le:'≤',gt:'>',ge:'≥'};
const REVERSE={eq:'eq',ne:'ne',lt:'gt',le:'ge',gt:'lt',ge:'le'};
const MAX_WORK=2000000,MAX_BOUND=10000;
const mod=(a,b)=>((a%b)+b)%b;
const name=i=>String.fromCharCode(97+i);
const compare=(a,r,b=0)=>({eq:a===b,ne:a!==b,lt:a<b,le:a<=b,gt:a>b,ge:a>=b})[r];
const fail=message=>({status:'invalid',question:'입력한 조건을 확인하세요.',answer:'계산할 수 없음',numeric:null,unit:'',steps:[],cases:[],insight:message,warnings:[message]});
const choose=(n,r)=>{if(!Number.isSafeInteger(n)||!Number.isSafeInteger(r))throw Error('조합식의 정수 범위가 너무 큽니다. 변수 범위와 상수를 줄여 주세요.');if(n<r||r<0)return 0n;let v=1n;for(let i=1;i<=r;i++)v=v*BigInt(n-r+i)/BigInt(i);return v;};
const multiply=values=>values.reduce((a,b)=>a*BigInt(b),1n);
const indices=key=>key===''?[]:key.split(',').map(Number);
const polyVars=p=>new Set([...p].flatMap(([key])=>indices(key)));
const negate=p=>new Map([...p].map(([key,v])=>[key,-v]));
function difference(left,right,k){
 const p=polynomial(parseExpression(left,k)),q=polynomial(parseExpression(right,k));
 for(const [key,c]of q){const value=(p.get(key)||0)-c;if(!Number.isSafeInteger(value))throw Error('식의 계수가 안전한 정수 범위를 벗어납니다.');if(value)p.set(key,value);else p.delete(key);}
 return p;
}
function exactValue(poly,values){let result=0n;for(const [key,c]of poly){let term=BigInt(c);for(const i of indices(key))term*=BigInt(values[i]);result+=term;}return result;}
function safeNumber(value){const n=Number(value);if(!Number.isSafeInteger(n))throw Error('식의 계산 범위가 너무 큽니다. 상수와 변수 범위를 줄여 주세요.');return n;}
function normaliseBound(v){if(Number.isFinite(v.low))v.low+=mod(v.residue-v.low,v.step);if(Number.isFinite(v.high))v.high-=mod(v.high-v.residue,v.step);}
function termMinimum(key,coefficient,bounds){
 const powers=new Map();for(const i of indices(key))powers.set(i,(powers.get(i)||0)+1);
 let low=1,high=1;
 for(const [i,power]of powers){const {low:l,high:h}=bounds[i];let a,b;
  if(power%2===0){a=l<=0&&h>=0?0:Math.min(l**power,h**power);b=Math.max(l**power,h**power);}else{a=l**power;b=h**power;}
  const products=[low*a,low*b,high*a,high*b].filter(v=>!Number.isNaN(v));
  if(!products.length){low=high=0;}else{low=Math.min(...products);high=Math.max(...products);}
 }
 const result=coefficient>=0?coefficient*low:coefficient*high;
 // Rounding a huge lower bound upward could remove valid solutions; use a weaker bound.
 return Number.isFinite(result)&&!Number.isSafeInteger(result)?(result>=0?0:-Infinity):result;
}
function inequalities(c){if(c.relation==='eq')return [c.poly,negate(c.poly)];if(c.relation==='le')return [c.poly];if(c.relation==='lt'){const p=new Map(c.poly);p.set('',(p.get('')||0)+1);return[p];}if(c.relation==='ge')return[negate(c.poly)];if(c.relation==='gt'){const p=negate(c.poly);p.set('',(p.get('')||0)+1);return[p];}return[];}
function integerRoot(n,power){if(n<0)return-1;let root=Math.floor(n**(1/power));while((root+1)**power<=n)root++;while(root**power>n)root--;return root;}
function deriveBounds(bounds,constraints){
 const expressions=constraints.flatMap(inequalities);
 for(let pass=0;pass<bounds.length*3+2;pass++){
  let changed=false;
  for(const poly of expressions){
   const constant=poly.get('')||0,terms=[...poly].filter(([key])=>key!=='');
   const minima=terms.map(([key,c])=>termMinimum(key,c,bounds));
   const minTotal=constant+minima.reduce((a,b)=>a+b,0);
   if(minTotal>0&&Number.isSafeInteger(minTotal))return false;
   for(let t=0;t<terms.length;t++){
    const [key,coefficient]=terms[t],powers=new Map();for(const i of indices(key))powers.set(i,(powers.get(i)||0)+1);
    const otherMinimum=constant+minima.reduce((a,b,j)=>j===t?a:a+b,0);
    if(!Number.isSafeInteger(otherMinimum))continue;
    const budget=-otherMinimum;
    for(const [i,power]of powers){
     const v=bounds[i];let l=v.low,h=v.high;
     if(powers.size===1&&power===1){if(coefficient>0)h=Math.min(h,Math.floor(budget/coefficient));else l=Math.max(l,Math.ceil(budget/coefficient));}
     else if(coefficient>0){
      let denominator=coefficient;
      for(const [j,p]of powers)if(i!==j){const w=bounds[j];let factor;if(p%2===0)factor=w.low<=0&&w.high>=0?0:Math.min(w.low**p,w.high**p);else factor=w.low>=0?w.low**p:0;denominator*=factor;}
      if(denominator>0&&Number.isSafeInteger(denominator)){
       const root=integerRoot(Math.floor(budget/denominator),power);
       if(power%2===0){l=Math.max(l,-root);h=Math.min(h,root);}else if(v.low>=0)h=Math.min(h,root);
      }
     }
     if(l!==v.low||h!==v.high){v.low=l;v.high=h;normaliseBound(v);changed=true;}
     if(v.low>v.high)return false;
    }
   }
  }
  if(!changed)break;
 }
 return true;
}
function validate(p){
 for(const [key,lo,hi]of [['k',2,8],['total',-40,80],['lower',-30,40],['upper',-30,40]])if(!Number.isInteger(p[key])||p[key]<lo||p[key]>hi)throw Error(`${key}의 값을 ${lo}~${hi} 사이의 정수로 입력하세요.`);
 if(!Object.hasOwn(DOMAINS,p.domain)||!Object.hasOwn(LABELS,p.relation)||!['any','nondecreasing','increasing'].includes(p.order)||['lowerOn','upperOn','distinct'].some(key=>typeof p[key]!=='boolean'))throw Error('공통 정의역·경계·순서 조건을 확인하세요.');
 const s=p.structure;if(!s||typeof s!=='object'||Array.isArray(s)||s.enabled!==true||!Object.hasOwn(LABELS,s.relation))throw Error('식의 관계를 확인하세요.');
 if(!Array.isArray(s.variables)||s.variables.length>p.k||!Array.isArray(s.conditions)||s.conditions.length>12)throw Error('변수별 조건과 추가 조건의 개수를 확인하세요.');
 const main={poly:difference(s.left,s.right,p.k),relation:s.relation};
 let empty=false;
 const bounds=Array.from({length:p.k},(_,i)=>{
  const data=s.variables[i]??{};if(!data||typeof data!=='object'||Array.isArray(data))throw Error('변수별 조건은 객체여야 합니다.');
  const domain=data.domain??'inherit',parity=data.parity??'any';
  if((domain!=='inherit'&&!Object.hasOwn(DOMAINS,domain))||!['any','even','odd'].includes(parity))throw Error(`${name(i)}의 정의역·홀짝 조건을 확인하세요.`);
  for(const edge of ['lower','upper'])if(data[edge]!=null&&(!Number.isInteger(data[edge])||Math.abs(data[edge])>MAX_BOUND))throw Error(`${name(i)}의 ${edge}은 절댓값 ${MAX_BOUND} 이하의 정수여야 합니다.`);
  const d=DOMAINS[domain==='inherit'?p.domain:domain];let step=d.step,residue=d.residue;
  if(parity!=='any'){const wanted=parity==='odd'?1:0;if(step===2&&residue!==wanted)empty=true;step=2;residue=wanted;}
  const v={low:Math.max(d.low,p.lowerOn?p.lower:-Infinity,data.lower??-Infinity),high:Math.min(p.upperOn?p.upper:Infinity,data.upper??Infinity),step,residue,label:d.label,userUpper:p.upperOn||data.upper!=null};
  normaliseBound(v);if(v.low>v.high)empty=true;return v;
 });
 const constraints=s.conditions.map(c=>{
  if(!c||typeof c!=='object'||Array.isArray(c))throw Error('추가 조건을 확인하세요.');
  if(c.kind==='expression'){if(!Object.hasOwn(LABELS,c.relation))throw Error('추가 식의 부등호를 확인하세요.');return{...c,poly:difference(c.left,c.right,p.k)};}
  if(!['distinct','nondecreasing','increasing'].includes(c.kind)||!Array.isArray(c.variables)||c.variables.length<2||c.variables.length>p.k||new Set(c.variables).size!==c.variables.length||c.variables.some(i=>!Number.isInteger(i)||i<0||i>=p.k))throw Error('서로 다름·순서 조건에는 서로 다른 변수 번호를 2개 이상 선택하세요.');
  return{...c};
 });
 const all=Array.from({length:p.k},(_,i)=>i);if(p.order!=='any')constraints.push({kind:p.order,variables:all});if(p.distinct)constraints.push({kind:'distinct',variables:all});
 return{main,bounds,constraints,empty};
}
function residualCounter(bounds,spend){
 const lower=safeNumber(bounds.reduce((s,v)=>s+BigInt(v.low),0n)),sizes=bounds.map(v=>safeNumber((BigInt(v.high)-BigInt(v.low))/BigInt(v.step)+1n)),total=multiply(sizes),cache=new Map();
 const allCaps=sizes.map(n=>n-1);safeNumber(allCaps.reduce((s,n)=>s+BigInt(n),0n));
 const groups=[1,2].map(step=>({step,items:bounds.filter(v=>v.step===step)})).filter(g=>g.items.length);
 function uniform(group,units,cumulative){
  const caps=group.items.map(v=>safeNumber((BigInt(v.high)-BigInt(v.low))/BigInt(v.step))),m=caps.length,max=safeNumber(caps.reduce((s,v)=>s+BigInt(v),0n));
  if(!m)return cumulative?(units>=0?1n:0n):(units===0?1n:0n);
  if(units<0)return 0n;if(cumulative&&units>=max)return multiply(caps.map(v=>v+1));if(!cumulative&&units>max)return 0n;
  let count=0n;for(let mask=0;mask<(1<<m);mask++){
   spend();let remaining=units,sign=1;for(let i=0;i<m;i++)if(mask&(1<<i)){remaining-=caps[i]+1;sign=-sign;if(remaining<0)break;}
   if(remaining>=0)count+=BigInt(sign)*choose(remaining+m-(cumulative?0:1),m-(cumulative?0:1));
  }return count;
 }
 function below(target,cumulative){
  if(!Number.isSafeInteger(target))throw Error('합의 정수 경계가 너무 큽니다. 상수와 변수 범위를 줄여 주세요.');
  const adjusted=safeNumber(BigInt(target)-BigInt(lower));
  if(!groups.length)return cumulative?(adjusted>=0?1n:0n):(adjusted===0?1n:0n);
  if(groups.length===1){const g=groups[0];if(!cumulative&&mod(adjusted,g.step))return 0n;return uniform(g,Math.floor(adjusted/g.step),cumulative);}
  const ones=groups.find(g=>g.step===1),twos=groups.find(g=>g.step===2),maxTwo=twos.items.reduce((s,v)=>s+(v.high-v.low)/2,0);
  let result=0n;for(let t=0;t<=Math.min(maxTwo,Math.floor(adjusted/2));t++){spend();result+=uniform(twos,t,false)*uniform(ones,adjusted-2*t,cumulative);}return result;
 }
 return(target,relation)=>{
  const key=`${relation}:${target}`;if(cache.has(key))return cache.get(key);
  let result;if(relation==='eq')result=below(target,false);else if(relation==='le')result=below(target,true);else if(relation==='lt')result=below(target-1,true);else if(relation==='ne')result=total-below(target,false);else if(relation==='ge')result=total-below(target-1,true);else result=total-below(target,true);
  cache.set(key,result);return result;
 };
}
function residualFormula(bounds,target,relation,ways){
 const m=bounds.length;if(!m)return `조건 판정: ${ways}`;
 const lower=safeNumber(bounds.reduce((s,v)=>s+BigInt(v.low),0n)),N=safeNumber(BigInt(target)-BigInt(lower)),total=multiply(bounds.map(v=>safeNumber((BigInt(v.high)-BigInt(v.low))/BigInt(v.step)+1n)));
 const groups=[1,2].map(step=>({step,items:bounds.filter(v=>v.step===step)})).filter(g=>g.items.length);
 if(groups.length===1){
  const d=groups[0].step,caps=bounds.map(v=>(v.high-v.low)/d),cumulative=!['eq','ne'].includes(relation),complement=['ne','ge','gt'].includes(relation);
  if(!cumulative&&mod(N,d))return `${N}은 ${d}의 배수가 아님 ⇒ ${ways}`;
  const threshold=['lt','ge'].includes(relation)?Math.ceil(N/d)-1:Math.floor(N/d),r=cumulative?m:m-1,terms=new Map();
  for(let mask=0;mask<(1<<m);mask++){let shift=0,sign=1;for(let i=0;i<m;i++)if(mask&(1<<i)){shift+=caps[i]+1;sign=-sign;}if(threshold-shift>=0)terms.set(shift,(terms.get(shift)||0)+sign);}
  const active=[...terms].filter(([,c])=>c).sort(([a],[b])=>a-b);let expression='0';
  if(active.length&&active.length<=12)expression=active.map(([shift,c],i)=>`${i?(c<0?' − ':' + '):(c<0?'−':'')}${Math.abs(c)===1?'':`${Math.abs(c)}·`}C(${threshold-shift+r}, ${r})`).join('');
  else if(active.length)expression=`Σ_A (−1)^|A| C(${threshold}−Σ_{i∈A}(Uᵢ+1)+${r}, ${r}), U=(${caps.join(',')})`;
  return `${complement?`${total} − (${expression})`:expression} = ${ways}`;
 }
 const ones=groups.find(g=>g.step===1),twos=groups.find(g=>g.step===2),maxTwo=twos.items.reduce((s,v)=>s+(v.high-v.low)/2,0);
 if(relation==='eq'&&ones.items.length===1&&twos.items.length===1){
  const A=maxTwo,B=ones.items[0].high-ones.items[0].low,lo=Math.max(0,Math.ceil((N-B)/2)),hi=Math.min(A,Math.floor(N/2));
  return lo===0&&hi===Math.floor(N/2)?`2u+v=${N} ⇒ ⌊${N}/2⌋+1 = ${ways}`:`2u+v=${N}, ${lo}≤u≤${hi} ⇒ ${Math.max(0,hi-lo+1)} = ${ways}`;
 }
 const q=twos.items.length,p=ones.items.length,cumulative=!['eq','ne'].includes(relation),threshold=['lt','ge'].includes(relation)?N-1:N,complement=['ne','ge','gt'].includes(relation);
 const groupFormula=(items,argument,cum)=>{
  const caps=items.map(v=>(v.high-v.low)/v.step),r=items.length-(cum?0:1);
  if(caps.every(cap=>cap>=Math.max(0,threshold)))return `C(${argument}+${r},${r})`;
  return `Σ_A(−1)^|A|C(${argument}−Σ(Uᵢ+1)+${r},${r}) [U=${caps.join(',')}]`;
 };
 const expression=`Σ_{t=0}^{${Math.max(-1,Math.min(maxTwo,Math.floor(threshold/2)))}} (${groupFormula(twos.items,'t',false)}) × (${groupFormula(ones.items,`${threshold}−2t`,cumulative)})`;
 return `${complement?`${total} − [${expression}]`:expression} = ${ways}`;
}
function pairStructure(constraints){
 for(const c of constraints){if(c.kind!=='expression'||c.relation!=='eq')continue;const terms=[...c.poly].filter(([key])=>key!==''),constant=c.poly.get('')||0;
  if(terms.length===1){const [key,coefficient]=terms[0],ids=indices(key),target=-constant/coefficient;if(ids.length===2&&ids[0]!==ids[1]&&Number.isSafeInteger(target)&&target!==0)return{kind:'factor-pairs',indices:ids,target};}
  const ids=[...polyVars(c.poly)];if(ids.length===2&&terms.length===3){const[a,b]=ids,caa=c.poly.get(`${a},${a}`),cbb=c.poly.get(`${b},${b}`),cab=c.poly.get([a,b].sort((x,y)=>x-y).join(','));if(caa&&caa===cbb&&cab===-2*caa){const n=-constant/caa,gap=Math.sqrt(n);if(Number.isInteger(gap))return{kind:'symmetry',indices:[a,b],gap};}}
 }return null;
}
function accepts(c,values,spend){if(c.kind==='expression'){spend([...c.poly].reduce((n,[key])=>n+indices(key).length+1,0));return compare(exactValue(c.poly,values),c.relation,0n);}const xs=c.variables.map(i=>values[i]);if(c.kind==='distinct')return new Set(xs).size===xs.length;return xs.every((v,i)=>!i||(c.kind==='increasing'?xs[i-1]<v:xs[i-1]<=v));}
function parityPossible(bounds,constraints){
 const equalities=constraints.filter(c=>c.relation==='eq');if(!equalities.length)return true;
 const values=bounds.map(v=>v.step===2?v.residue:v.low===v.high?mod(v.low,2):0),free=bounds.map((v,i)=>v.step===1&&v.low!==v.high?i:-1).filter(i=>i>=0);
 for(let mask=0;mask<(1<<free.length);mask++){
  free.forEach((i,j)=>values[i]=(mask>>j)&1);
  if(equalities.every(c=>exactValue(c.poly,values)%2n===0n))return true;
 }return false;
}
function primeExponentSolution(main,bounds,base){
 if(main.relation!=='eq')return null;const terms=[...main.poly].filter(([key])=>key!=='');if(terms.length!==1)return null;
 const[key,coefficient]=terms[0],ids=indices(key),k=bounds.length,target=-(main.poly.get('')||0)/coefficient;
 if(ids.length!==k||new Set(ids).size!==k||!Number.isSafeInteger(target)||target<1||bounds.some(v=>v.low!==1||v.step!==1||v.high<target))return null;
 let remaining=target,work=0;const factors=[];
 for(let prime=2;prime*prime<=remaining;prime=prime===2?3:prime+2){
  if(++work>MAX_WORK)throw Error('소인수 분해가 계산 한도를 넘습니다. 곱의 상수를 줄여 주세요.');
  let exponent=0;while(remaining%prime===0){remaining/=prime;exponent++;}if(exponent)factors.push({prime,exponent});
 }if(remaining>1)factors.push({prime:remaining,exponent:1});
 const counts=factors.map(({exponent})=>choose(exponent+k-1,k-1)),count=counts.reduce((a,b)=>a*b,1n);
 const decomposition=factors.length?factors.map(({prime,exponent})=>`${prime}^${exponent}`).join(' × '):'1';
 const steps=[{title:'곱을 소인수별 지수의 합으로 바꾸기',body:`모든 변수는 양의 정수이므로 ${target}의 소인수만 가질 수 있다. 각 소인수의 지수를 ${k}개 변수에 나누어 준 결과와 원래 순서쌍은 일대일 대응한다. 각 변수의 가능한 최대값은 ${target}이므로 현재 상한은 제한을 추가하지 않는다.`,formula:`${target} = ${decomposition}`},
 ...factors.map(({prime,exponent},i)=>({title:`소인수 ${prime}의 지수를 중복조합으로 분배`,body:`${prime}의 지수를 e₁,…,e${k}라 하면 모두 0 이상의 정수이고 합은 ${exponent}이다. 별과 막대로 지수의 분배를 센다.`,formula:`e₁ + … + e${k} = ${exponent} ⇒ C(${exponent+k-1}, ${k-1}) = ${counts[i]}`})),
 {title:'서로 독립인 지수 분배에 곱의 법칙 적용',body:'서로 다른 소인수의 지수 분배는 독립적으로 선택할 수 있다. 지수 선택을 곱해 각 변수의 값을 복원하면 중복이나 누락이 없다.',formula:`${factors.length?factors.map(({exponent})=>`C(${exponent+k-1}, ${k-1})`).join(' × '):'1'} = ${count}`}];
 return{...base,answer:String(count),exact:String(count),numeric:Number(count),steps,cases:[{label:'소인수별 지수 분배의 독립적인 조합',count:String(count)}],solutionMethod:'prime-exponents',proofSummary:'소인수의 지수 분배와 양의 정수 순서쌍의 일대일 대응을 이용하여 중복조합과 곱의 법칙으로 셌다.'};
}
function originalQuestion(p,bounds){
 const s=p.structure,names=Array.from({length:p.k},(_,i)=>name(i));
 const conditions=[`${s.left} ${LABELS[s.relation]} ${s.right}`];
 const variableGroups=new Map();
 for(let i=0;i<p.k;i++){
  const data=s.variables[i]??{};let kind=data.domain&&data.domain!=='inherit'?DOMAINS[data.domain].label:DOMAINS[p.domain].label;
  if(data.parity&&data.parity!=='any'){
   const parityName=data.parity==='even'?'짝수':'홀수';
   if(!/짝수|홀수/.test(kind))kind=`${parityName}인 ${kind}`;
   else if(!kind.includes(parityName))kind=`${kind}이면서 ${parityName}`;
  }
  const low=Math.max(p.lowerOn?p.lower:-Infinity,data.lower??-Infinity),high=Math.min(p.upperOn?p.upper:Infinity,data.upper??Infinity);
  if(kind===DOMAINS[p.domain].label&&!Number.isFinite(low)&&!Number.isFinite(high))continue;
  const key=JSON.stringify([kind,low,high]);if(!variableGroups.has(key))variableGroups.set(key,{kind,low,high,vars:[]});variableGroups.get(key).vars.push(names[i]);
 }
 for(const {kind,low,high,vars} of variableGroups.values()){
  const list=vars.join(', '),parts=[];
  if(kind!==DOMAINS[p.domain].label)parts.push(`${list}는 ${kind}이다`);
  if(Number.isFinite(low)&&Number.isFinite(high))parts.push(`${low} ≤ ${list} ≤ ${high}`);
  else if(Number.isFinite(low))parts.push(`${list} ≥ ${low}`);
  else if(Number.isFinite(high))parts.push(`${list} ≤ ${high}`);
  conditions.push(parts.join(', 그리고 '));
 }
 for(const c of s.conditions)conditions.push(c.kind==='expression'?`${c.left} ${LABELS[c.relation]} ${c.right}`:c.kind==='distinct'?`${c.variables.map(name).join(', ')}의 값은 서로 다르다.`:c.variables.map(name).join(c.kind==='increasing'?' < ':' ≤ '));
 if(p.order!=='any')conditions.push(names.join(p.order==='increasing'||p.distinct?' < ':' ≤ '));else if(p.distinct)conditions.push(`${names.join(', ')}의 값은 서로 다르다.`);
 const heading=`${DOMAINS[p.domain].label} ${names.join(', ')}에 대하여, 다음 조건을 만족시키는 (${names.join(', ')})의 개수를 구하시오.`;
 return `${heading}\n${conditions.map((condition,i)=>`(${String.fromCharCode(44032+i)}) ${condition}`).join('\n')}`;
}
export function structuredSolve(p,basicSolve){
 try{
  const {main,bounds,constraints,empty}=validate(p),question=originalQuestion(p,bounds);
  const base={status:'ok',question,unit:'개',samples:[],warnings:[],insight:'추가 조건에 얽힌 변수만 먼저 정하고, 남는 합은 하한·홀짝을 치환한 뒤 중복조합으로 셉니다.'};
  const zero=reason=>({...base,answer:'0',exact:'0',numeric:0,steps:[{title:'조건의 양립 가능성',body:reason,formula:'경우의 수 = 0'}],cases:[],solutionMethod:'contradiction',proofSummary:reason});
  if(empty)return zero('정의역·홀짝·상하한을 동시에 만족하는 값이 없는 변수가 있다.');
  if([main,...constraints.filter(c=>c.kind==='expression')].some(c=>polyVars(c.poly).size===0&&!compare(BigInt(c.poly.get('')||0),c.relation,0n)))return zero('양변을 정리하면 변수와 무관하게 거짓인 상수 조건이 된다.');
  if(!parityPossible(bounds,[main,...constraints.filter(c=>c.kind==='expression')]))return zero('각 변수의 홀짝을 반영하면 등식 양변의 홀짝이 달라진다. 유한 범위를 정하기 전에도 해가 없음을 알 수 있다.');
  if(constraints.length===0){const product=primeExponentSolution(main,bounds,base);if(product)return product;}
  // Preserve the existing infinite and ordered plain-sum models.
  const plain=p.structure.conditions.length===0&&bounds.every((_,i)=>{const v=p.structure.variables[i]??{};return(!v.domain||v.domain==='inherit')&&(!v.parity||v.parity==='any')&&v.lower==null&&v.upper==null;})&&main.poly.size-(main.poly.has('')?1:0)===p.k&&Array.from({length:p.k},(_,i)=>main.poly.get(String(i))===1).every(Boolean);
  if(plain&&p.structure.relation!=='ne'){
   const t=-(main.poly.get('')||0);if(t>=-40&&t<=80){const old=basicSolve({...p,total:t,relation:p.structure.relation});if(old.status==='infinite'||old.answer==='0'||p.order!=='any'||p.distinct)return{...old,question,solutionMethod:old.status==='infinite'?'unbounded':'gap-substitution'};}
  }
  if(!deriveBounds(bounds,[main,...constraints.filter(c=>c.kind==='expression')]))return zero('식의 최소값·최대값과 경계 조건이 양립하지 않는다.');
  if(bounds.some(v=>!Number.isFinite(v.low)||!Number.isFinite(v.high)))return fail('일반 곱·차·부등식만으로는 모든 변수의 유한 범위를 확정할 수 없습니다. 제한이 없는 변수에 명시적인 상한·하한을 추가하세요.');
  if(bounds.some(v=>v.low>v.high))return zero('합과 경계 조건을 반영하면 가능한 값이 없다.');
  if(bounds.some(v=>!Number.isSafeInteger(v.low)||!Number.isSafeInteger(v.high)))return fail('유도된 변수 범위가 안전한 정수 범위를 벗어납니다. 명시적인 범위를 추가하세요.');
  // Choose the sign that leaves the greatest number of coefficient-one variables.
  let poly=main.poly,relation=main.relation;const countSign=sign=>Array.from({length:p.k},(_,i)=>poly.get(String(i))===sign).filter(Boolean).length;
  if(countSign(-1)>countSign(1)){poly=negate(poly);relation=REVERSE[relation];}
  const involved=new Set();for(const c of constraints)for(const i of c.kind==='expression'?polyVars(c.poly):c.variables)involved.add(i);
  for(const[key]of poly)if(indices(key).length!==1)for(const i of indices(key))involved.add(i);
  const residual=Array.from({length:p.k},(_,i)=>i).filter(i=>poly.get(String(i))===1&&!involved.has(i));
  const core=Array.from({length:p.k},(_,i)=>i).filter(i=>!residual.includes(i));
  let work=0;const spend=(n=1)=>{work+=n;if(work>MAX_WORK)throw Error('경우 분류가 계산 한도(200만 회)를 넘습니다. 변수 범위나 추가 조건을 더 좁혀 주세요. 일부만 센 값을 정답으로 표시하지 않습니다.');};
  const remainingCount=residualCounter(residual.map(i=>bounds[i]),spend),values=Array(p.k).fill(0),pair=pairStructure(constraints),components=[];
  const inRange=(i,v)=>v>=bounds[i].low&&v<=bounds[i].high&&mod(v-bounds[i].residue,bounds[i].step)===0;
  if(pair){const[a,b]=pair.indices,candidates=[];const va=bounds[a],size=(va.high-va.low)/va.step+1;if(size>MAX_WORK)throw Error('핵심 변수 범위가 너무 넓습니다. 명시적인 상한·하한을 더 좁혀 주세요.');for(let x=va.low;x<=va.high;x+=va.step){spend();if(pair.kind==='factor-pairs'){if(x&&pair.target%x===0){const y=pair.target/x;if(inRange(b,y))candidates.push([[a,x],[b,y]]);}}else{for(const delta of pair.gap===0?[0]:[-pair.gap,pair.gap]){const y=x+delta;if(inRange(b,y))candidates.push([[a,x],[b,y]]);}}}components.push(candidates);}
  for(const i of core)if(!pair||!pair.indices.includes(i)){
   const v=bounds[i],size=(v.high-v.low)/v.step+1;if(size>MAX_WORK)throw Error('핵심 변수 범위가 너무 넓습니다. 명시적인 상한·하한을 더 좁혀 주세요.');
   const candidates=[];for(let x=v.low;x<=v.high;x+=v.step)candidates.push([[i,x]]);components.push(candidates);
  }
  components.sort((a,b)=>a.length-b.length);
  const leafCost=1+constraints.reduce((n,c)=>n+(c.kind==='expression'?[...c.poly].reduce((cost,[key])=>cost+indices(key).length+1,0):c.variables.length),0)+[...poly].reduce((n,[key])=>n+indices(key).length+1,0);
  let estimate=1;for(const component of components){estimate*=component.length;if(estimate*leafCost>MAX_WORK)throw Error('핵심 변수의 경우 분류가 계산 한도(200만 회)를 넘습니다. 변수별 상한이나 추가 조건을 더 좁혀 주세요.');}
  let count=0n;const caseMap=new Map(),corePoly=new Map([...poly].filter(([key])=>key===''||!residual.includes(Number(key))||indices(key).length!==1));
  function visit(position){
   spend();if(position<components.length){for(const assignment of components[position]){for(const[i,x]of assignment)values[i]=x;visit(position+1);}return;}
   if(!constraints.every(c=>accepts(c,values,spend)))return;
   spend([...corePoly].reduce((n,[key])=>n+indices(key).length+1,0));
   const target=-safeNumber(exactValue(corePoly,values)),ways=remainingCount(target,relation);if(!ways)return;count+=ways;
   let label;if(!core.length)label=`${residual.map(name).join(' + ')} ${LABELS[relation]} ${target}`;
   else if(pair?.kind==='symmetry')label=`${pair.indices.map(name).join(' + ')} = ${pair.indices.reduce((s,i)=>s+values[i],0)} (차는 ${pair.gap===0?'0':`±${pair.gap}`})`;
   else if(!residual.length)label=`${name(core[0])} = ${values[core[0]]}인 경우`;
   else label=core.map(i=>`${name(i)} = ${values[i]}`).join(', ');
   const caseKey=residual.length?`${label};남는기준=${target}`:label,current=caseMap.get(caseKey);if(current){current.count+=ways;current.multiplicity++;}else caseMap.set(caseKey,{label,count:ways,target,multiplicity:1,each:ways});
  }
  visit(0);
  const upperUsed=residual.some(i=>bounds[i].userUpper),mixedSteps=new Set(residual.map(i=>bounds[i].step)).size>1,complement=['ne','ge','gt'].includes(relation);
  let solutionMethod=pair?.kind||(core.length?'core-cases':complement?'complement':upperUsed?'inclusion-exclusion':'stars-bars');
  const steps=[{title:'변수별 정의역과 유한 범위 확인',body:'공통 조건과 변수별 조건의 교집합을 취한다. 식의 상한에서 각 항의 최소 기여를 빼서 아래 범위를 얻는다. 새로 넣은 상한이 아니라 원래 식의 필요조건이다.',formula:bounds.map((v,i)=>`${v.low} ≤ ${name(i)} ≤ ${v.high}${v.step===2?` (${v.residue?'홀수':'짝수'})`:''}`).join(', ')}];
  if(pair?.kind==='factor-pairs')steps.push({title:'곱 조건을 약수쌍으로 분류',body:`${pair.indices.map(name).join('·')} = ${pair.target}이므로 첫 변수의 약수와 그 짝인 몫만 확인한다. 가능한 약수쌍은 서로 겹치지 않는다.`,formula:`${name(pair.indices[1])} = ${pair.target} / ${name(pair.indices[0])}`});
  else if(pair?.kind==='symmetry')steps.push({title:'차의 제곱을 두 부호로 나누기',body:`${pair.gap===0?'차가 0인 경우 하나':`차가 +${pair.gap}인 경우와 −${pair.gap}인 경우`}로 나눈다. 두 변수의 조건이 같으면 서로 바꾸는 대칭이 두 부호를 대응시킨다. 조건이 다를 때에는 각 부호의 조건을 따로 확인한다. 표는 같은 두 변수의 합을 묶어 두 부호의 기여를 합했다.`,formula:`${name(pair.indices[0])} − ${name(pair.indices[1])} = ${pair.gap===0?'0':`±${pair.gap}`}`});
  else if(core.length)steps.push({title:'제곱·계수·추가 조건에 얽힌 핵심 변수만 분류',body:`${core.map(name).join(', ')}를 정하면 ${residual.length?'남는 변수는 합 조건 하나로 정리된다.':'모든 조건의 참·거짓을 판정할 수 있다. 같은 첫 변수의 경우는 표에서 묶었다.'} 일반 식에서는 더 간단한 조합식이 항상 존재하지 않으므로 이 핵심 경우 분류의 범위를 명시한다.`});
  if(residual.length){
   steps.push({title:'남는 변수의 하한과 홀짝을 치환',body:`핵심 변수의 값을 정한 뒤 ${residual.map(name).join(', ')}만 남긴다. 각 변수를 그 최소값과 0 이상의 정수로 바꾸면 원래 해와 일대일 대응한다.`,formula:residual.map(i=>`${name(i)} = ${bounds[i].low} + ${bounds[i].step===1?'':bounds[i].step}y_${name(i)}`).join(', ')});
   if(mixedSteps)steps.push({title:'홀짝에 따라 부분합을 묶기',body:'2y로 치환한 변수들의 y의 합을 t로 두고 먼저 중복조합으로 센다. 나머지 변수들의 합은 S−2t로 결정된다. 각 t의 두 조합수를 곱한 뒤 합하므로 개별 순서쌍을 전부 나열하지 않는다.',formula:'Σₜ (2y 그룹의 합이 t인 조합수) × (y 그룹의 합이 S−2t인 조합수)'});
   const cumulative=!['eq','ne'].includes(relation),boundary=['lt','ge'].includes(relation)?'S−1':'S',dimension=cumulative?'m':'m−1';
   const relationProof={eq:'남는 합이 S인 경우를 센다.',ne:'남는 합이 S인 경우를 구해서 전체에서 뺀다.',le:'남는 합이 S 이하인 경우를 센다.',lt:'정수인 남는 합이 S보다 작다는 것은 S−1 이하라는 뜻이다.',ge:'S 이상인 경우는 전체에서 S−1 이하인 경우를 뺀다.',gt:'S보다 큰 경우는 전체에서 S 이하인 경우를 뺀다.'}[relation];
   steps.push({title:upperUsed?'상한 초과를 포함배제로 제외':'남는 합을 중복조합으로 세기',body:`${relationProof} ${upperUsed?'상한을 잠시 풀고, 상한 초과 변수에서 Uᵢ+1을 빼서 0 이상으로 치환한다. 한 변수 초과는 빼고 두 변수 동시 초과는 다시 더한다.':'합이 정해진 0 이상의 정수 m개를 별과 막대로 센다.'} ${cumulative?'이하 조건은 남는 양을 새 변수로 두므로 조합수의 아래 수가 m이다.':'등식 조건은 조합수의 아래 수가 m−1이다.'} 모든 변수가 2y 꼴이면 실제 경계는 나눗셈 후 내림·올림하여 각 표의 수식에 반영한다. 홀짝이 섞이면 앞 단계의 두 그룹 각각에 적용한다.`,formula:upperUsed?`Σ_{A⊆{1,…,m}} (−1)^|A| C(${boundary}−Σ_{i∈A}(Uᵢ+1)+${dimension}, ${dimension})`:`y₁ + … + yₘ ${cumulative?'≤':'='} ${boundary} ⇒ C(${boundary}+${dimension}, ${dimension})`});
   if(complement)steps.push({title:'여사건으로 필요한 관계 세기',body:relation==='ne'?'유한한 전체 범위에서 등식을 만족하는 경우를 뺀다.':'유한한 전체 범위에서 반대쪽 작은 합의 경우를 뺀다. 경계값을 포함하는지에 따라 S−1과 S를 구분한다.',formula:relation==='ne'?'전체 − (합이 S인 경우)':relation==='ge'?'전체 − (합이 S−1 이하인 경우)':'전체 − (합이 S 이하인 경우)'});
  }
  steps.push({title:'서로 겹치지 않는 핵심 경우의 조합수 합산',body:`각 행은 핵심 조건이 고정된 경우이고, 그 안의 남는 변수들은 위 조합식으로 센다. ${core.length===0?'핵심 변수가 없으므로 조합식 한 번으로 끝난다.':''}`,formula:`경우의 수 = ${count}`});
  const entries=[...caseMap];let cases=entries.slice(0,79).map(([,item])=>{let detail;if(residual.length){const formula=residualFormula(residual.map(i=>bounds[i]),item.target,relation,item.each);detail=item.multiplicity>1?`${item.multiplicity} × [${formula.replace(/ = \d+$/,'')}] = ${item.count}`:formula;}return{label:item.label,count:String(item.count),...(detail?{detail}:{})};});
  if(entries.length>79)cases.push({label:`그 밖의 ${entries.length-79}개 핵심 경우`,count:String(entries.slice(79).reduce((s,[,v])=>s+v.count,0n))});
  if(!residual.length&&core.length)base.warnings.push('이 일반 식은 남는 독립적인 합 변수가 없어 유한한 핵심 경우 분류로 계산했습니다. 더 짧은 중복조합 공식은 제시하지 않습니다.');
  return{...base,answer:String(count),exact:String(count),numeric:Number(count),steps,cases,solutionMethod,proofSummary:`핵심 변수 ${core.length}개를 분류하고, 남는 ${residual.length}개 변수는 하한·홀짝 치환과 조합식으로 센 결과이다.`,chart:cases.slice(0,12).map(c=>({label:c.label,value:Number(c.count)}))};
 }catch(error){return fail(error instanceof Error?error.message:'식과 범위 조건을 확인하세요.');}
}
