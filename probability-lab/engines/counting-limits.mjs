import { countingSpecs } from './counting.mjs?v=20261026-structure';

// Public examination limits. Raw engines remain available for independent checks.
const raw = new Map(countingSpecs.map(spec => [spec.id, spec]));
const LIMIT = 999n;
const choose = (n,k) => {
  if (n < 0 || k < 0 || k > n) return 0n;
  let value=1n;
  for(let j=1;j<=Math.min(k,n-k);j++)value=value*BigInt(n-j+1)/BigInt(j);
  return value;
};
const power = (base, exponent) => BigInt(base) ** BigInt(exponent);
const fits = value => value >= -LIMIT && value <= LIMIT;
const parameters = (id,input={}) => ({...raw.get(id).defaults,...(input && typeof input==='object' && !Array.isArray(input)?input:{})});
function baseError(id,p) {
  for(const control of raw.get(id).controls) {
    const value=p[control.key];
    if(control.type==='number'&&(!Number.isInteger(value)||value<control.min||value>control.max))return `${control.label}의 지원 범위를 확인하세요.`;
    if(control.type==='checkbox'&&typeof value!=='boolean')return `${control.label}의 적용 여부를 확인하세요.`;
    if(control.type==='select'&&!control.options.some(option=>option.value===value))return `${control.label}의 선택값을 확인하세요.`;
  }
  return '';
}
function controlParams(id,input) {
  const p=parameters(id,input),spec=raw.get(id);
  for(const c of spec.controls) {
    if(c.type==='number')p[c.key]=Number.isInteger(p[c.key])?Math.max(c.min,Math.min(c.max,p[c.key])):spec.defaults[c.key];
    else if(c.type==='checkbox'&&typeof p[c.key]!=='boolean')p[c.key]=spec.defaults[c.key];
    else if(c.type==='select'&&!c.options.some(option=>option.value===p[c.key]))p[c.key]=spec.defaults[c.key];
  }
  return p;
}
function adapted(base,changes={}) {
  return base.map(control=>({...control,...changes[control.key],...(control.options?{options:control.options.map(option=>({...option}))}:{})}));
}
function extrema(min,max,test) {
  const accepted=[];
  for(let value=min;value<=max;value++)if(test(value))accepted.push(value);
  return accepted.length?{min:accepted[0],max:accepted.at(-1)}:{min,max};
}
function resultCounts(result) {
  const values=[];
  if(/^-?\d+$/.test(String(result?.exact??'')))values.push(BigInt(result.exact));
  for(const row of result?.cases??[])if(/^-?\d+$/.test(String(row.count)))values.push(BigInt(row.count));
  return values;
}
function numericInputs(id,p) {
  return raw.get(id).controls.filter(c=>c.type==='number').map(c=>p[c.key]);
}
function facts(id,input,result) {
  const p=controlParams(id,input),counts=resultCounts(result),denominators=[],values=numericInputs(id,p);
  if(id==='arrangement') {
    const n=p.a+p.b+p.c;values.push(n);
    // The non-A arrangement count is explicitly used in the gap argument.
    if(!p.circular&&p.condition==='apart')counts.push(choose(p.b+p.c,p.b));
    // Rotation averaging uses this numerator, rather than an unused n! space.
    if(p.circular&&n&&(p.condition!=='together'||!p.a)&&/^-?\d+$/.test(String(result?.exact??'')))counts.push(BigInt(n)*BigInt(result.exact));
  } else if(id==='selection') {
    const pool=p.red+p.blue;
    counts.push(p.replacement?power(pool,p.draw):choose(pool,p.draw));values.push(pool);
  } else if(id==='function') {
    // An injective/fixed-image question does not use the space of all m^n maps.
    values.push(p.domain-p.fixed);
  } else if(id==='coefficient') {
    values.push(p.n*p.p,p.n*p.q,p.a+p.b);
    if(p.p===p.q)counts.push(power(p.a+p.b,p.n));
  } else if(id==='probability-count') {
    const space=power(p.sides,p.rolls);counts.push(space);denominators.push(space);
  } else if(id==='conditional') {
    const space=choose(p.n,p.draw),condition=cardCondition(p);
    counts.push(space);denominators.push(space,condition.count);
    if(condition.count)values.push(condition.minSum,condition.maxSum);
  }
  return {counts,denominators,values};
}
function safeResult(id,p) {
  if(baseError(id,p))return false;
  const result=raw.get(id).solve(p);
  if(result.status!=='ok')return false;
  return Object.values(facts(id,p,result)).every(group=>group.every(value=>fits(BigInt(value))));
}
function integerPowerCap(base,rawMaximum) {
  let maximum=0;
  for(let exponent=0;exponent<=rawMaximum;exponent++)if(power(base,exponent)<=LIMIT)maximum=exponent;
  return maximum;
}
function poolPowerCap(draw,maxPool) {
  let maximum=0;
  for(let pool=0;pool<=maxPool;pool++)if(power(pool,draw)<=LIMIT)maximum=pool;
  return maximum;
}
function selectionError(p) {
  if(p.red+p.blue<1)return '적어도 한 개의 공이 있어야 합니다.';
  if(!p.replacement&&p.draw>p.red+p.blue)return '비복원 추출의 개수는 전체 공 수 이하여야 합니다.';
  if(p.redTarget>p.draw)return '빨간 공 기준 수는 뽑는 횟수 이하여야 합니다.';
  const space=p.replacement?power(p.red+p.blue,p.draw):choose(p.red+p.blue,p.draw);
  return space>LIMIT?'실제로 사용하는 전체 추출 경우의 수가 999 이하여야 합니다.':'';
}
function selectionControls(input,base) {
  const p=controlParams('selection',input),pool=p.red+p.blue;
  const poolAllowed=n=>n>=Math.max(1,p.draw*(p.replacement?0:1))&&(p.replacement?power(n,p.draw):choose(n,p.draw))<=LIMIT;
  const red=extrema(0,20,value=>poolAllowed(value+p.blue));
  const blue=extrema(0,20,value=>poolAllowed(value+p.red));
  const draw=extrema(0,p.replacement?20:Math.min(20,pool),value=>(p.replacement?power(pool,value):choose(pool,value))<=LIMIT);
  return adapted(base,{red,blue,draw,redTarget:{min:0,max:p.draw}});
}
function cardCondition(p) {
  const {n,draw:r,condition,conditionValue:b}=p;
  if(r>n)return {count:0n,minSum:0,maxSum:0};
  const minSum=r*(r+1)/2,maxSum=r*(2*n-r+1)/2;
  if(condition==='sum-even') {
    const odd=Math.ceil(n/2),even=Math.floor(n/2);let count=0n;
    for(let t=0;t<=r;t+=2)count+=choose(odd,t)*choose(even,r-t);
    return {count,minSum:minSum%2?minSum+1:minSum,maxSum:maxSum%2?maxSum-1:maxSum};
  }
  if(r<1||b<1||b>n)return {count:0n,minSum:0,maxSum:0};
  if(condition==='max-eq')return {count:choose(b-1,r-1),minSum:b+(r-1)*r/2,maxSum:r*b-r*(r-1)/2};
  const remaining=Array.from({length:n},(_,i)=>i+1).filter(value=>value!==b),count=choose(n-1,r-1);
  return {count,minSum:b+remaining.slice(0,r-1).reduce((sum,value)=>sum+value,0),maxSum:b+(r===1?0:remaining.slice(-(r-1)).reduce((sum,value)=>sum+value,0))};
}
function conditionalError(p) {
  if(p.draw>p.n)return '선택하는 카드 수는 전체 카드 수 이하여야 합니다.';
  if(choose(p.n,p.draw)>LIMIT)return '전체 카드 선택의 경우의 수가 999 이하여야 합니다.';
  if(p.conditionValue>p.n)return '조건 카드 번호는 실제 카드 번호 범위 안이어야 합니다.';
  const condition=cardCondition(p);
  if(!condition.count)return '조건 B를 만족하는 카드 선택이 없습니다.';
  if(p.event==='odd-count'&&p.eventValue>p.draw)return '홀수 카드 개수는 뽑는 카드 수 이하여야 합니다.';
  if(p.event==='include'&&(p.eventValue<1||p.eventValue>p.n))return '사건 A의 카드 번호는 실제 카드 번호 범위 안이어야 합니다.';
  if(p.event==='sum-ge'&&(p.eventValue<condition.minSum||p.eventValue>condition.maxSum))return '카드 합의 기준은 조건 B에서 실제 가능한 최소 합과 최대 합 사이여야 합니다.';
  return '';
}
function conditionalControls(input,base) {
  const p=controlParams('conditional',input),condition=cardCondition(p),recoveryDraw=Math.min(p.draw,p.n);
  const n=extrema(Math.max(1,p.draw),18,value=>choose(value,p.draw)<=LIMIT);
  const draw=extrema(p.condition==='sum-even'?0:1,Math.min(9,p.n),value=>choose(p.n,value)<=LIMIT);
  let eventValue;
  if(p.event==='odd-count')eventValue={min:0,max:p.draw};
  else if(p.event==='include')eventValue={min:1,max:p.n};
  else eventValue=condition.count?{min:condition.minSum,max:condition.maxSum}:{min:recoveryDraw*(recoveryDraw+1)/2,max:recoveryDraw*(2*p.n-recoveryDraw+1)/2};
  return adapted(base,{n,draw,conditionValue:{min:p.condition==='max-eq'?Math.min(p.n,Math.max(1,p.draw)):1,max:p.n},eventValue});
}
function validateWith(id,check=()=> '') {
  return input=>{const p=parameters(id,input);return baseError(id,p)||check(p);};
}
const presets = id => raw.get(id).presets.map(preset=>({name:preset.name,params:{...preset.params}}));

export const countingLimitProfiles = {
  arrangement:{
    presets:presets('arrangement'),
    controls(input,base){const p=controlParams('arrangement',input),changes={};for(const key of ['a','b','c'])changes[key]=extrema(0,10,value=>safeResult('arrangement',{...p,[key]:value}));return adapted(base,changes);},
    validate:validateWith('arrangement',p=>p.a+p.b+p.c>18?'전체 문자 수는 원래 엔진의 지원 범위인 18 이하여야 합니다.':''),
    facts:(p,result)=>facts('arrangement',p,result)
  },
  selection:{presets:presets('selection'),controls:selectionControls,validate:validateWith('selection',selectionError),facts:(p,result)=>facts('selection',p,result)},
  function:{
    presets:presets('function'),
    controls(input,base){const p=controlParams('function',input);return adapted(base,{domain:extrema(p.fixed,12,value=>safeResult('function',{...p,domain:value})),codomain:extrema(0,12,value=>safeResult('function',{...p,codomain:value})),fixed:{min:0,max:p.domain}});},
    validate:validateWith('function',p=>p.fixed>p.domain?'고정하는 함수값 수는 정의역 크기 이하여야 합니다.':''),
    facts:(p,result)=>facts('function',p,result)
  },
  coefficient:{
    presets:presets('coefficient'),
    controls(input,base){const p=controlParams('coefficient',input);return adapted(base,{target:{min:Math.min(p.p,p.q)*p.n,max:Math.max(p.p,p.q)*p.n}});},
    validate:validateWith('coefficient',p=>p.target<Math.min(p.p,p.q)*p.n||p.target>Math.max(p.p,p.q)*p.n?'구할 차수는 전개식의 최소 차수와 최대 차수 사이여야 합니다.':''),
    facts:(p,result)=>facts('coefficient',p,result)
  },
  'probability-count':{
    presets:presets('probability-count').map(preset=>({...preset,params:{...preset.params,...(preset.params.rolls===4&&preset.params.sides===6?{rolls:3}:{})}})),
    controls(input,base){const p=controlParams('probability-count',input),rolls={min:1,max:integerPowerCap(p.sides,8)},sides={min:2,max:Math.max(2,poolPowerCap(p.rolls,12))};const target=p.statistic==='sum'?{min:p.rolls,max:p.sides*p.rolls}:p.statistic==='product'?{min:1,max:Math.min(999,Number(power(p.sides,p.rolls)))}:{min:1,max:p.sides};return adapted(base,{rolls,sides,target});},
    validate:validateWith('probability-count',p=>{
      if(power(p.sides,p.rolls)>LIMIT)return '약분 전 전체 주사위 결과 수가 999 이하여야 합니다.';
      const min=p.statistic==='sum'?p.rolls:1,max=p.statistic==='sum'?p.sides*p.rolls:p.statistic==='product'?Number(power(p.sides,p.rolls)):p.sides;
      return p.target<min||p.target>max?'기준 값은 선택한 관찰값이 실제 가질 수 있는 범위 안이어야 합니다.':'';
    }),
    facts:(p,result)=>facts('probability-count',p,result)
  },
  conditional:{presets:presets('conditional'),controls:conditionalControls,validate:validateWith('conditional',conditionalError),facts:(p,result)=>facts('conditional',p,result)}
};
