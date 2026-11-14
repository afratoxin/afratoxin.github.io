'use strict';
(function(root){
const groups={arithmetic:'계산',digits:'숫자와 모양',properties:'수의 성질',interval:'비교와 간격',korean:'한글 변환',decimal:'소수 표현'};
const digits=n=>[...String(Math.abs(n))].map(Number),sum=a=>a.reduce((s,n)=>s+n,0),gcd=(a,b)=>b?gcd(b,a%b):a;
const primeCache=new Map();function prime(n){if(primeCache.has(n))return primeCache.get(n);let ok=n>=2;for(let d=2;d*d<=n&&ok;d++)if(n%d===0)ok=false;primeCache.set(n,ok);return ok;}
const primeList=Array.from({length:1000},(_,i)=>i).filter(prime),between=(a,b,p,closed=true)=>{let count=0;for(let n=Math.min(a,b)+(closed?0:1);n<=Math.max(a,b)-(closed?0:1);n++)if(p(n))count++;return count;};
const reverse=n=>Number(String(n).split('').reverse().join(''));
function factors(n){const a=[];for(let d=2;d*d<=n;d++)while(n%d===0){a.push(d);n/=d;}if(n>1)a.push(n);return a;}
const divisorCount=n=>{let count=0;for(let d=1;d*d<=n;d++)if(n%d===0)count+=d*d===n?1:2;return count;};
function korean(n){if(!n)return '영';const d=['','일','이','삼','사','오','육','칠','팔','구'];return [...String(n)].map((v,i,a)=>{const k=a.length-i-1;return +v?(k?(+v===1?'':d[+v])+['','십','백','천'][k]:d[+v]):'';}).join('');}
const finals=n=>[...korean(n)].filter(c=>(c.charCodeAt(0)-44032)%28!==0).length;
const occurrences=(s,character)=>[...s].filter(c=>c===character).length;
const common=(a,b)=>{const bag=[...b];let n=0;for(const v of a){const i=bag.indexOf(v);if(i>=0){n++;bag.splice(i,1);}}return n;};
function places(a,b){b/=gcd(a,b);let twos=0,fives=0;while(b%2===0){twos++;b/=2;}while(b%5===0){fives++;b/=5;}return b===1?Math.max(twos,fives):null;}
function period(a,b){let rest=a%b,step=0;const seen=new Map();while(rest&&!seen.has(rest)){seen.set(rest,step++);rest=rest*10%b;}return rest?step-seen.get(rest):0;}
const R=[];function rule(id,group,name,difficulty,calc,description,limit=99){R.push({id,group,name,difficulty,calc,description,limit});}
rule('sum','arithmetic','두 수의 합',1,(a,b)=>a+b,'두 수를 더합니다.');
rule('subtract','arithmetic','앞 수에서 뒤 수 빼기',1,(a,b)=>a-b,'앞 수에서 뒤 수를 뺍니다. 순서가 바뀌면 부호도 바뀝니다.');
rule('multiply','arithmetic','두 수의 곱',1,(a,b)=>a*b,'두 수를 곱합니다.',30);
rule('gap','arithmetic','큰 수와 작은 수의 차',1,(a,b)=>Math.abs(a-b),'큰 수에서 작은 수를 뺍니다.');
rule('quotient','arithmetic','나눗셈의 몫',2,(a,b)=>Math.floor(a/b),'앞 수를 뒤 수로 나눈 정수 몫입니다.');
rule('remainder','arithmetic','나눗셈의 나머지',2,(a,b)=>a%b,'앞 수를 뒤 수로 나눈 나머지입니다.');
rule('product-plus-front','arithmetic','곱에 앞 수 더하기',3,(a,b)=>a*b+a,'두 수의 곱에 앞 수를 더합니다.',30);
rule('square-plus','arithmetic','앞 수의 제곱과 뒤 수의 합',3,(a,b)=>a*a+b,'앞 수를 제곱한 뒤 뒤 수를 더합니다.',30);
rule('square-gap','arithmetic','제곱수의 차',4,(a,b)=>a*a-b*b,'앞 수의 제곱에서 뒤 수의 제곱을 뺍니다.',30);
rule('digit-count','digits','두 수의 자릿수 합',1,(a,b)=>digits(a).length+digits(b).length,'두 수를 십진수로 적었을 때 숫자가 몇 개 쓰였는지 셉니다.',999);
rule('digit-sum','digits','모든 자리 숫자의 합',1,(a,b)=>sum(digits(a))+sum(digits(b)),'두 수의 각 자리 숫자를 전부 더합니다.',999);
rule('digit-product','digits','자리 숫자의 곱끼리 더하기',3,(a,b)=>digits(a).reduce((x,y)=>x*y,1)+digits(b).reduce((x,y)=>x*y,1),'각 수의 자리 숫자들을 곱한 뒤 두 결과를 더합니다. 0이 있으면 그 수의 자리 곱은 0입니다.',999);
rule('distinct-digits','digits','서로 다른 숫자의 종류',2,(a,b)=>new Set([...digits(a),...digits(b)]).size,'두 수 전체에서 서로 다른 숫자가 몇 종류인지 셉니다. 중복은 한 번만 셉니다.',999);
rule('common-digits','digits','공통으로 쓰인 숫자 개수',3,(a,b)=>common(digits(a),digits(b)),'두 수에 공통으로 있는 자리 숫자를 짝지어 셉니다. 예를 들어 112와 121은 세 쌍입니다.',999);
rule('zero-count','digits','숫자 0의 개수',2,(a,b)=>occurrences(String(a)+b,'0'),'두 수를 적었을 때 등장하는 숫자 0을 셉니다.',999);
rule('holes','digits','숫자 속 닫힌 공간',2,(a,b)=>sum([...digits(a),...digits(b)].map(n=>n===8?2:[0,6,9].includes(n)?1:0)),'숫자의 닫힌 공간을 셉니다. 0·6·9는 하나, 8은 둘, 나머지는 0개입니다. 4는 열린 모양을 기준으로 합니다.',999);
rule('segments','digits','전자시계 막대 개수',4,(a,b)=>sum([...digits(a),...digits(b)].map(n=>[6,2,5,5,4,5,6,3,7,6][n])),'전자시계의 7세그먼트 표기에서 켜지는 막대 수를 더합니다. 0부터 9까지 각각 6·2·5·5·4·5·6·3·7·6개입니다.',999);
rule('reverse-sum','digits','거꾸로 읽은 수의 합',3,(a,b)=>reverse(a)+reverse(b),'각 수의 자리 순서를 거꾸로 읽은 뒤 더합니다. 뒤집어서 맨 앞이 된 0은 생략합니다.',999);
rule('sum-digit-sum','digits','합의 자리 숫자 합',3,(a,b)=>sum(digits(a+b)),'먼저 두 수를 더한 뒤, 그 결과의 각 자리 숫자를 더합니다.',999);
rule('product-digit-sum','digits','곱의 자리 숫자 합',4,(a,b)=>sum(digits(a*b)),'먼저 두 수를 곱한 뒤, 그 결과의 각 자리 숫자를 더합니다.');
rule('prime-digits','digits','소수인 자리 숫자의 개수',2,(a,b)=>[...digits(a),...digits(b)].filter(n=>[2,3,5,7].includes(n)).length,'각 자리에서 소수인 숫자 2·3·5·7이 몇 번 등장하는지 셉니다.',999);
rule('even-digits','digits','짝수 자리 숫자의 개수',2,(a,b)=>[...digits(a),...digits(b)].filter(n=>n%2===0).length,'각 자리에서 짝수인 숫자 0·2·4·6·8이 몇 번 등장하는지 셉니다.',999);
rule('gcd','properties','최대공약수',3,gcd,'두 수의 공약수 중 가장 큰 수입니다.');
rule('lcm','properties','최소공배수',4,(a,b)=>a/gcd(a,b)*b,'두 수의 양의 공배수 중 가장 작은 수입니다.',50);
rule('divisors','properties','약수 개수의 합',3,(a,b)=>divisorCount(a)+divisorCount(b),'각 수의 양의 약수를 센 뒤 두 개수를 더합니다.');
rule('common-divisors','properties','공약수의 개수',4,(a,b)=>divisorCount(gcd(a,b)),'두 수를 모두 나누어떨어지게 하는 양의 정수를 셉니다.');
rule('prime-factors','properties','소인수 개수의 합',4,(a,b)=>factors(a).length+factors(b).length,'두 수를 소인수분해하고, 중복을 포함한 소인수 개수를 더합니다. 예: 12는 2·2·3으로 세 개입니다.');
rule('distinct-prime-factors','properties','서로 다른 소인수의 종류',4,(a,b)=>new Set([...factors(a),...factors(b)]).size,'두 수의 소인수들을 모아 서로 다른 소수가 몇 종류인지 셉니다.');
rule('next-primes','properties','바로 다음 소수의 합',4,(a,b)=>primeList.find(p=>p>a)+primeList.find(p=>p>b),'각 수보다 큰 소수 중 가장 가까운 것을 하나씩 찾아 더합니다.');
rule('max','interval','큰 수 고르기',1,(a,b)=>Math.max(a,b),'두 수 중 더 큰 수를 그대로 씁니다.');
rule('min','interval','작은 수 고르기',1,(a,b)=>Math.min(a,b),'두 수 중 더 작은 수를 그대로 씁니다.');
rule('comparison','interval','두 수의 대소 비교',2,(a,b)=>a>b?1:a===b?0:-1,'앞 수가 더 크면 1, 같으면 0, 더 작으면 −1입니다.');
rule('between-integers','interval','사이의 정수 개수',2,(a,b)=>Math.max(0,Math.abs(a-b)-1),'두 수 사이의 정수를 셉니다. 양 끝의 수는 제외합니다.');
rule('between-primes','interval','사이의 소수 개수',3,(a,b)=>between(a,b,prime,false),'두 수 사이에서 1과 자기 자신만을 약수로 갖는 소수를 셉니다. 양 끝은 제외하고, 1은 소수가 아닙니다.',70);
rule('closed-primes','interval','양 끝을 포함한 소수 개수',3,(a,b)=>between(a,b,prime),'작은 수부터 큰 수까지의 소수를 셉니다. 양 끝의 수도 소수이면 포함합니다.',70);
rule('between-even','interval','구간의 짝수 개수',2,(a,b)=>between(a,b,n=>n%2===0),'작은 수부터 큰 수까지의 짝수를 셉니다. 양 끝도 포함합니다.');
rule('between-three','interval','구간의 3의 배수 개수',3,(a,b)=>between(a,b,n=>n%3===0),'작은 수부터 큰 수까지의 3의 배수를 셉니다. 양 끝도 포함합니다.');
rule('between-squares','interval','구간의 제곱수 개수',3,(a,b)=>between(a,b,n=>Number.isInteger(Math.sqrt(n))),'작은 수부터 큰 수까지의 제곱수를 셉니다. 양 끝도 포함합니다.');
rule('distance-next-ten','interval','각각 다음 10의 배수까지 거리',3,(a,b)=>(10-a%10)+(10-b%10),'각 수에서 자신보다 큰 가장 가까운 10의 배수까지의 거리를 더합니다. 이미 10의 배수이면 다음 배수까지 10입니다.');
rule('korean-length','korean','한자어 숫자의 글자 수',2,(a,b)=>korean(a).length+korean(b).length,'두 수를 일·이·삼 방식의 한자어로 읽고 글자 수를 더합니다. 일십·일백 대신 십·백으로 씁니다.',999);
rule('korean-sum-length','korean','합을 한글로 읽은 글자 수',3,(a,b)=>korean(a+b).length,'두 수를 더한 결과를 한자어로 읽고 글자 수를 셉니다.',999);
rule('korean-finals','korean','한글 숫자의 받침 개수',3,(a,b)=>finals(a)+finals(b),'두 수를 한자어로 읽고 받침이 있는 글자를 셉니다. 예: 삼·육·칠·팔·십·백에는 받침이 있습니다.',999);
rule('korean-jamo','korean','한글 숫자의 자모 개수',4,(a,b)=>2*(korean(a).length+korean(b).length)+finals(a)+finals(b),'한자어 표기의 글자를 초성·중성·종성으로 나누어 셉니다. 받침 없는 글자는 2개, 받침 있는 글자는 3개입니다.',999);
rule('korean-common','korean','한글 숫자의 공통 글자',4,(a,b)=>common(korean(a),korean(b)),'두 수를 한자어로 읽었을 때 공통인 글자를 짝지어 셉니다. 같은 글자가 반복되면 짝지을 수 있는 횟수만큼 셉니다.',999);
rule('korean-initial-ieung','korean','한글 숫자의 초성 ㅇ',3,(a,b)=>[...korean(a)+korean(b)].filter(c=>Math.floor((c.charCodeAt(0)-44032)/588)===11).length,'두 수를 한자어로 읽었을 때 초성이 ㅇ인 글자를 셉니다.',999);
rule('korean-ones','korean','한글 숫자의 일 개수',3,(a,b)=>occurrences(korean(a)+korean(b),'일'),'두 수를 한자어로 읽었을 때 글자 일이 등장하는 횟수입니다. 십·백·천 앞의 일은 생략합니다.',999);
rule('decimal-length','decimal','유한소수의 소수 자릿수',4,places,'앞 수를 뒤 수로 나눈 값을 가장 짧은 유한소수로 적었을 때 소수점 아래 자릿수입니다. 정수는 0자리, 끝의 0은 생략합니다.');
rule('decimal-first','decimal','소수 첫째 자리',3,(a,b)=>Math.floor((a%b)*10/b),'앞 수를 뒤 수로 나눈 소수의 소수점 바로 뒤 첫 숫자입니다. 소수 첫째 자리의 0도 숫자로 셉니다.');
rule('decimal-cycle','decimal','순환마디의 길이',4,period,'앞 수를 뒤 수로 나누었을 때 반복되는 가장 짧은 순환마디의 길이입니다. 유한소수는 0입니다.',40);
const shuffle=(a,r)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const output=(rule,a,b)=>{const n=rule.calc(a,b);return Number.isInteger(n)&&Math.abs(n)<=100000?n:null;};
function make(level=1,r=Math.random,options={}){
 const pool=options.pool||'all',eligible=R.filter(q=>(pool==='easy'?q.difficulty<=2:pool==='hard'?q.difficulty>=3:groups[pool]?q.group===pool:true));
 let choices=eligible.filter(q=>!(options.exclude||[]).includes(q.id));if(!choices.length)choices=eligible;
 if(pool==='all'){const frequency=Object.fromEntries(Object.keys(groups).map(g=>[g,(options.exclude||[]).filter(id=>R.find(q=>q.id===id)?.group===g).length]));const min=Math.min(...choices.map(q=>frequency[q.group]));choices=choices.filter(q=>frequency[q.group]===min);}
 const chosen=choices[Math.floor(r()*choices.length)];
 const pairs=[[1,1],[1,2],[2,1],[2,3],[3,2],[7,7],[8,16],[12,24],[21,12],[20,10],[11,13],[10,20],[6,9],[88,100],[101,110],[123,321],[37,74]];
 for(let i=0;i<160;i++)pairs.push([1+Math.floor(r()*chosen.limit),1+Math.floor(r()*chosen.limit)]);
 if(chosen.group==='decimal')for(let i=0;i<40;i++)pairs.push([1+Math.floor(r()*50),[2,4,5,8,10,16,20,25,40,50,64,80,100][Math.floor(r()*13)]]);
 const chosenIndex=R.indexOf(chosen),usable=shuffle([...new Map(pairs.map(a=>[a.join(),a])).values()],r).map(pair=>({pair,values:R.map(q=>output(q,...pair))})).filter(row=>row.values[chosenIndex]!==null);
 let candidates=R.map((_,i)=>i),examples=[],used=new Set();
 for(let i=0;i<6;i++){
  let best=null,rank=Infinity;
  for(const row of usable){if(used.has(row.pair.join()))continue;const value=row.values[chosenIndex],remaining=candidates.filter(index=>row.values[index]===value).length;
   const score=remaining*100+(examples.some(e=>e.value===value)?12:0)+(row.pair[0]===row.pair[1]?8:0)+r();if(score<rank){rank=score;best=row;}
  }
  if(!best)break;const value=best.values[chosenIndex];examples.push({pair:best.pair,value});used.add(best.pair.join());candidates=candidates.filter(index=>best.values[index]===value);
 }
 const targets=usable.filter(row=>!used.has(row.pair.join())&&candidates.every(index=>row.values[index]===row.values[chosenIndex]));
 if(!targets.length)throw Error('Could not disambiguate Mystery Sign');
 const target=targets[Math.floor(r()*targets.length)],question=target.pair,answer=target.values[chosenIndex];

 return{level,ruleId:chosen.id,examples,question,answer,description:chosen.description,name:chosen.name,group:chosen.group,candidateIds:candidates.map(index=>R[index].id)};
}
function explain(p){const pairs=[...p.examples,{pair:p.question,value:p.answer}];return{description:p.description,rows:pairs.map(({pair:[a,b],value})=>({a,b,value,words:korean(a)+' / '+korean(b)}))};}
const api={rules:R,groups,make,explain,korean,prime,factors,divisorCount,places,period,output};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.MysterySign=api;
})(typeof window!=='undefined'?window:globalThis);
