import { structuredSolve } from './structured-integer.mjs?v=20261026-challenge-grid';
import { conditionLabel } from '../exam-paper.mjs?v=20261026-challenge-grid';

const options = pairs => pairs.map(([value,label])=>({value,label}));
const defaults={k:4,total:7,relation:'eq',domain:'natural',lowerOn:false,lower:0,upperOn:false,upper:7,order:'any',distinct:false};
const domains={natural:{label:'자연수',low:1,step:1,residue:0},nonnegative:{label:'0 이상의 정수',low:0,step:1,residue:0},integer:{label:'정수',low:-Infinity,step:1,residue:0},'positive-even':{label:'양의 짝수',low:2,step:2,residue:0},'positive-odd':{label:'양의 홀수',low:1,step:2,residue:1},'integer-even':{label:'짝수인 정수',low:-Infinity,step:2,residue:0},'integer-odd':{label:'홀수인 정수',low:-Infinity,step:2,residue:1}};
const relationLabels={eq:'=',le:'≤',lt:'<',ge:'≥',gt:'>'};
const mod=(x,m)=>((x%m)+m)%m;
const factorial=n=>{let a=1n;for(let i=2;i<=n;i++)a*=BigInt(i);return a;};
const choose=(n,r)=>{if(n<r||r<0)return 0n;let a=1n;for(let i=1;i<=r;i++)a=a*BigInt(n-r+i)/BigInt(i);return a;};
const fail=message=>({status:'invalid',question:'입력한 조건을 확인하세요.',answer:'계산할 수 없음',numeric:null,unit:'',steps:[],insight:message,warnings:[message]});

function basicSolve(input={}) {
  if(!input||typeof input!=='object'||Array.isArray(input))return fail('입력은 매개변수 객체여야 합니다.');
  const p={...defaults,...input};
  for(const [key,lo,hi] of [['k',2,8],['total',-40,80],['lower',-30,40],['upper',-30,40]])if(!Number.isInteger(p[key])||p[key]<lo||p[key]>hi)return fail(`${key}의 값을 ${lo}~${hi} 사이의 정수로 입력하세요.`);
  if(!Object.hasOwn(domains,p.domain)||!Object.hasOwn(relationLabels,p.relation)||!['any','nondecreasing','increasing'].includes(p.order))return fail('정의역·부등호·순서 조건을 확인하세요.');
  if(['lowerOn','upperOn','distinct'].some(k=>typeof p[k]!=='boolean'))return fail('조건 선택값이 올바르지 않습니다.');
  const {k,total:T}=p,d=domains[p.domain];
  const names=Array.from({length:k},(_,i)=>String.fromCharCode(97+i)),sum=names.join(' + ');
  const extras=[];
  if(p.lowerOn)extras.push(`${names.join(', ')} ≥ ${p.lower}`);
  if(p.upperOn)extras.push(`${names.join(', ')} ≤ ${p.upper}`);
  if(p.order!=='any')extras.push(names.join(p.order==='increasing'||p.distinct?' < ':' ≤ '));
  else if(p.distinct)extras.push(`${names.join(', ')}의 값은 서로 다르다.`);
  const conditions=[`${sum} ${relationLabels[p.relation]} ${T}`,...extras];
  const question=`${d.label} ${names.join(', ')}에 대하여, 다음 조건을 만족시키는 (${names.join(', ')})의 개수를 구하시오.\n${conditions.map((condition,i)=>`(${conditionLabel(i)}) ${condition}`).join('\n')}`;
  const base={status:'ok',question,unit:'개',steps:[],insight:'각 변수의 최소값과 홀짝을 먼저 반영하면, 합의 조건을 만족하는 정수해를 세는 문제로 바뀝니다.'};
  const zero=reason=>({...base,answer:'0',exact:'0',numeric:0,steps:[{title:'조건의 양립 가능성 확인',body:reason},{title:'경우의 수',body:'주어진 모든 조건을 동시에 만족시키는 순서쌍은 없다.',formula:'경우의 수 = 0'}],cases:[],samples:[]});
  let L=Math.max(d.low,p.lowerOn?p.lower:-Infinity),U=p.upperOn?p.upper:Infinity;
  if(Number.isFinite(L))L+=mod(d.residue-L,d.step);
  if(Number.isFinite(U))U-=mod(U-d.residue,d.step);
  if(L>U)return zero('하한과 상한 사이에 정의역에 속하는 정수가 없다.');
  if(p.relation==='eq'&&mod(T-k*d.residue,d.step)!==0)return zero(`각 변수의 홀짝 조건 때문에 합은 ${d.step}로 나눈 나머지가 ${mod(k*d.residue,d.step)}이어야 한다. ${T}은 이 조건에 맞지 않는다.`);
  let lowSum=-Infinity,highSum=Infinity;
  if(p.relation==='eq')lowSum=highSum=T;
  else if(p.relation==='le')highSum=T;
  else if(p.relation==='lt')highSum=T-1;
  else if(p.relation==='ge')lowSum=T;
  else lowSum=T+1;
  if(Number.isFinite(L)&&k*L>highSum)return zero(`각 변수의 최소값은 ${L}이므로 합은 적어도 ${k*L}이다. 합의 상한 ${highSum}과 양립하지 않는다.`);
  if(Number.isFinite(U)&&k*U<lowSum)return zero(`각 변수의 최대값은 ${U}이므로 합은 최대 ${k*U}이다. 합의 하한 ${lowSum}과 양립하지 않는다.`);
  if(!Number.isFinite(U)&&Number.isFinite(L)&&Number.isFinite(highSum))U=highSum-(k-1)*L;
  if(!Number.isFinite(L)&&Number.isFinite(U)&&Number.isFinite(lowSum))L=lowSum-(k-1)*U;
  if(!Number.isFinite(L)||!Number.isFinite(U)){
    const freeBoth=!Number.isFinite(L)&&!Number.isFinite(U);
    const body=freeBoth&&p.relation==='eq'
      ?'합을 고정해도 한 변수는 작게, 다른 변수는 크게 움직일 수 있다. 순서 조건이 있으면 값을 정렬하고, 서로 다름 조건이 있으면 충분히 떨어진 값을 선택할 수 있으므로 가능한 순서쌍은 계속 만들어진다.'
      :'합의 조건을 만족하는 값을 잡은 뒤, 제한이 없는 방향으로 변수의 값을 계속 바꿀 수 있다. 순서나 서로 다름 조건이 있으면 간격을 충분히 크게 유지하면 된다.';
    return {...base,status:'infinite',answer:'무한히 많음',numeric:null,unit:'',steps:[{title:'정의역 확인',body:`각 변수의 범위는 ${Number.isFinite(L)?L:'아래로 무한'}부터 ${Number.isFinite(U)?U:'위로 무한'}까지이다.`},{title:'유한 여부 판단',body}],insight:'정수 조건을 넣을 때에는 먼저 해의 개수가 유한한지 확인해야 합니다.',warnings:['유한한 경우의 수를 얻으려면 상한·하한 또는 합의 부등호를 조정하세요.']};
  }
  L+=mod(d.residue-L,d.step);U-=mod(U-d.residue,d.step);
  if(L>U)return zero('합과 경계 조건을 함께 반영하면 가능한 변수 값이 남지 않는다.');
  const values=[];for(let v=L;v<=U;v+=d.step)values.push(v);
  const unique=p.distinct||p.order==='increasing',sorted=p.order!=='any'||unique;
  if(unique&&values.length<k)return zero(`가능한 서로 다른 값은 ${values.length}개뿐이므로 ${k}개를 선택할 수 없다.`);
  let distribution;
  if(!sorted){
    let dp=new Map([[0,1n]]);
    for(let i=0;i<k;i++){
      const next=new Map();
      for(const [sum,count] of dp)for(const v of values){
        const s=sum+v,remain=k-i-1;
        if(s+remain*L>highSum||s+remain*U<lowSum)continue;
        next.set(s,(next.get(s)||0n)+count);
      }
      dp=next;
    }
    distribution=dp;
  }else{
    // A generating-function table indexed by number selected and total sum.
    let dp=Array.from({length:k+1},()=>new Map());dp[0].set(0,1n);
    for(const v of values){
      const next=Array.from({length:k+1},()=>new Map());
      for(let used=0;used<=k;used++)for(const [sum,count]of dp[used])for(let take=0;take<=Math.min(unique?1:k,k-used);take++){
        const s=sum+v*take;next[used+take].set(s,(next[used+take].get(s)||0n)+count);
      }
      dp=next;
    }
    distribution=dp[k];
    if(unique&&p.order==='any')for(const [s,c]of distribution)distribution.set(s,c*factorial(k));
  }
  const valid=[...distribution].filter(([s])=>s>=lowSum&&s<=highSum).sort((a,b)=>a[0]-b[0]);
  const count=valid.reduce((acc,[,c])=>acc+c,0n);
  const steps=[{title:'변수가 가질 수 있는 값부터 정하기',body:`정의역·경계·합 조건을 반영하면 각 변수는 ${L}부터 ${U}까지의 ${d.step===2?'같은 홀짝의 정수':'정수'}이다. ${p.order==='any'?'변수의 위치는 서로 구별한다.':'주어진 크기 순서를 유지한다.'}`}];
  const noExtraOrder=!unique&&p.order==='any';
  const originalLower=Math.max(d.low,p.lowerOn?p.lower:-Infinity);
  if(noExtraOrder&&!p.upperOn&&Number.isFinite(originalLower)&&Number.isFinite(highSum)){
    const M=Math.floor((highSum-k*L)/d.step);
    steps.push({title:'최소값과 홀짝을 치환으로 흡수하기',body:`각 i에 대하여 xᵢ = ${L} + ${d.step===1?'yᵢ':`${d.step}yᵢ`}로 놓으면 yᵢ는 0 이상의 정수이다.`,formula:`y₁ + … + y${sub[k-1]} ${p.relation==='eq'?'=':'≤'} ${M}`});
    const n=p.relation==='eq'?M+k-1:M+k,r=p.relation==='eq'?k-1:k;
    steps.push({title:p.relation==='eq'?'중복조합으로 세기':'남는 양을 새 변수로 두기',body:p.relation==='eq'?'합이 정해진 0 이상의 정수해는 별과 막대로 일대일 대응시킨다.':'남는 양을 0 이상의 정수인 새 변수로 두면 등식 하나로 바뀐다. 이를 중복조합으로 센다.',formula:`C(${n}, ${r}) = ${choose(n,r)}`});
  }else if(noExtraOrder){
    const B=(U-L)/d.step;
    const cumulative=p.relation!=='eq';
    const S=p.relation==='eq'?(T-k*L)/d.step:Number.isFinite(highSum)?Math.floor((highSum-k*L)/d.step):Math.ceil((lowSum-k*L)/d.step)-1;
    steps.push({title:'하한과 홀짝을 치환하기',body:`xᵢ = ${L} + ${d.step===1?'':d.step}yᵢ로 두면 0 ≤ yᵢ ≤ ${B}이다. 상한을 잠시 풀면 합이 정해진 0 이상의 정수해를 중복조합으로 셀 수 있다.`,formula:`0 ≤ yᵢ ≤ ${B}`});
    const combination=`Σⱼ (−1)^j C(${k}, j) C(${S}−j·${B+1}+${cumulative?k:k-1}, ${cumulative?k:k-1})`;
    steps.push({title:'상한을 넘는 경우를 포함배제로 제외',body:`상한을 넘는 j개 변수를 고르고 각각 yᵢ에서 ${B+1}을 뺀다. 한 변수 초과는 빼고 두 변수 동시 초과는 더하는 포함배제를 적용한다. ${cumulative?'합의 부등식은 남는 양을 0 이상의 새 변수로 두어 중복조합으로 센다.':''} 위쪽 수가 아래쪽 수보다 작은 조합수는 0으로 본다.`,formula:Number.isFinite(highSum)?`${combination} = ${count}`:`${B+1}^${k} − (${combination}) = ${count}`});
    if(!Number.isFinite(highSum))steps.push({title:'여사건으로 큰 합의 경우 세기',body:`유한한 전체 범위의 ${B+1}^${k}개에서 합이 기준보다 작은 경우를 뺀다. 등호 포함 여부는 정수 경계 ${S}에 반영되어 있다.`});
  }else{
    const strict=unique,shift=strict?k*(k-1)/2:0;
    steps.push({title:'정렬한 값의 간격을 새 변수로 두기',body:`${unique&&p.order==='any'?`먼저 값을 엄격한 오름차순으로 고른다. 서로 다른 ${k}개 값의 배치는 각각 ${k}!가지이므로 마지막에 곱한다. `:''}xᵢ = ${L} + ${d.step===1?'':d.step}(zᵢ${strict?' + i − 1':''})로 놓으면 0 ≤ z₁ ≤ … ≤ z${sub[k-1]}이다. g₁=z₁, g₂=z₂−z₁, …로 간격을 치환하면 모든 gᵢ가 0 이상이다.`,formula:`x₁+…+x${sub[k-1]} = ${k*L+d.step*shift} + ${d.step===1?'':`${d.step}·`}(${k}g₁ + ${k-1}g₂ + … + g${sub[k-1]})`});
    steps.push({title:'간격의 가중합을 겹치지 않게 분류',body:`첫 간격부터 가능한 값을 정하면 남은 가중합과 상한이 결정된다. 같은 정렬된 선택이 두 번 나타나지 않도록 각 간격은 한 번씩만 센다. 상한은 g₁+…+g${sub[k-1]} ≤ ${(U-L)/d.step-(strict?k-1:0)}로 함께 반영한다. 일반적인 간격의 가중합은 보통의 중복조합 한 식으로 바꿀 수 없으므로 이 경우 분류의 합을 사용한다.`,formula:`주어진 합 관계를 만족하는 간격의 경우${unique&&p.order==='any'?` × ${k}!`:''} = ${count}`});
  }

  const samples=[];let visits=0;
  function sample(xs,s){
    if(samples.length>=8||++visits>25000)return;
    if(xs.length===k){if(s>=lowSum&&s<=highSum)samples.push(`(${xs.join(', ')})`);return;}
    for(const v of values){
      if(p.order==='nondecreasing'&&xs.length&&v<xs.at(-1))continue;
      if(p.order==='increasing'&&xs.length&&v<=xs.at(-1))continue;
      if(p.distinct&&xs.includes(v))continue;
      const remain=k-xs.length-1;if(s+v+remain*L>highSum||s+v+remain*U<lowSum)continue;
      sample([...xs,v],s+v);if(samples.length>=8||visits>25000)return;
    }
  }
  if(count>0n)sample([],0);
  return {...base,answer:String(count),exact:String(count),numeric:Number(count),solutionMethod:sorted?'gap-substitution':p.upperOn?'inclusion-exclusion':'stars-bars',steps,samples,cases:valid.slice(0,20).map(([s,c])=>({label:`합 = ${s}`,count:String(c)})),warnings:valid.length>20?['합별 표에는 앞의 20개 합만 표시했습니다. 정답에는 모든 합을 반영했습니다.']:[],chart:valid.slice(0,12).map(([s,c])=>({label:String(s),value:Number(c)}))};
}

function solve(input={}) {
  if(input && typeof input==='object' && !Array.isArray(input) && input.structure?.enabled===true)return structuredSolve({...defaults,...input},basicSolve);
  return basicSolve(input);
}

export const integerSumSpec={id:'integer-sum',title:'정수해 · 같은 공의 분배',category:'경우의 수',description:'문자의 수, 합, 부등호, 정의역과 순서 조건을 함께 바꾸어 봅니다.',defaults,controls:[
  {key:'k',label:'문자의 수',type:'number',min:2,max:8,step:1},
  {key:'total',label:'합의 기준값',type:'number',min:-40,max:80,step:1},
  {key:'relation',label:'합의 관계',type:'select',options:options([['eq','='],['le','≤'],['lt','<'],['ge','≥'],['gt','>']])},
  {key:'domain',label:'각 변수의 범위',type:'select',options:options(Object.entries(domains).map(([k,v])=>[k,v.label]))},
  {key:'lowerOn',label:'공통 하한 추가',type:'checkbox'},
  {key:'lower',label:'각 변수의 하한',type:'number',min:-30,max:40,step:1},
  {key:'upperOn',label:'공통 상한 추가',type:'checkbox'},
  {key:'upper',label:'각 변수의 상한',type:'number',min:-30,max:40,step:1},
  {key:'order',label:'크기 순서',type:'select',options:options([['any','제한 없음'],['nondecreasing','작거나 같다 (오름차순)'],['increasing','엄격히 작다']])},
  {key:'distinct',label:'변수의 값이 모두 다름',type:'checkbox'}
],presets:[{name:'시작 예제: 자연수 4개의 합이 7',params:{...defaults}},{name:'홀수 조건을 치환으로',params:{...defaults,k:3,total:9,domain:'positive-odd'}},{name:'등호를 부등호로',params:{...defaults,k:3,total:7,relation:'le'}},{name:'정수로 바꾸면 무한?',params:{...defaults,domain:'integer'}},{name:'상한과 크기 순서',params:{...defaults,k:3,total:9,upperOn:true,upper:5,order:'nondecreasing'}},{name:'기출형: 약수쌍과 남는 합',params:{...defaults,k:4,total:16,structure:{enabled:true,left:'a+b+c+d',relation:'eq',right:'16',variables:[{},{},{parity:'odd'},{lower:2}],conditions:[{kind:'expression',left:'a*b',relation:'eq',right:'12'}]}}},{name:'기출형: 차의 제곱과 대칭',params:{...defaults,k:4,total:12,structure:{enabled:true,left:'a+b+c+d',relation:'eq',right:'12',variables:[{},{},{},{}],conditions:[{kind:'expression',left:'(a-b)^2',relation:'eq',right:'4'}]}}}],solve};
