'use strict';
(function(root){
const shuffle=(a,r=Math.random)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const int=(a,b,r=Math.random)=>a+Math.floor(r()*(b-a+1)),pick=(a,r=Math.random)=>a[int(0,a.length-1,r)],sum=a=>a.reduce((x,y)=>x+y,0),FULL=32767;
const bits=s=>parseInt(s.replaceAll('/',''),2);
const DIGITS=['111/101/101/101/111','001/001/001/001/001','111/001/111/100/111','111/001/111/001/111','101/101/111/001/001','111/100/111/001/111','111/100/111/101/111','111/001/001/001/001','111/101/111/101/111','111/101/111/001/111'].map(bits);
const has=(mask,i)=>!!(mask&(1<<(14-i))),pop=m=>{let n=0;while(m){m&=m-1;n++;}return n;};
function splitMask(mask,n,r){const on=shuffle(Array.from({length:15},(_,i)=>i).filter(i=>has(mask,i)),r),out=Array(n).fill(0);on.forEach((v,i)=>out[i%n]|=1<<(14-v));out.forEach((m,i)=>{if(!m&&on.length)out[i]=1<<(14-pick(on,r));});return shuffle(out,r);}
function pixelOne(r=Math.random){const targets=shuffle([0,1,2,3,4,5,6,7,8,9],r).slice(0,3);let cards=targets.flatMap(d=>splitMask(DIGITS[d],3,r));for(let i=0;i<6;i++){const on=shuffle(Array.from({length:15},(_,i)=>i),r).slice(0,int(3,5,r));cards.push(on.reduce((m,v)=>m|1<<(14-v),0));}cards=shuffle(cards,r);return {cards,targets};}
function pixelSolutions(cards,digit,minimal=true){const target=DIGITS[digit],valid=cards.map((m,i)=>(m&~target)===0?i:-1).filter(i=>i>=0),out=[];for(let s=1;s<2**valid.length;s++){const indices=valid.filter((_,i)=>s&(1<<i));if(indices.length<2)continue;const mask=indices.reduce((m,i)=>m|cards[i],0);if(mask!==target)continue;if(minimal&&indices.some((_,j)=>indices.filter((_,k)=>k!==j).reduce((m,i)=>m|cards[i],0)===target))continue;out.push(indices);}return out.sort((a,b)=>a.length-b.length);}
function pixelDigit(cards,selected){if(selected.length<2||new Set(selected).size!==selected.length||selected.some(i=>!Number.isInteger(i)||i<0||i>=cards.length))return -1;return DIGITS.indexOf(selected.reduce((m,i)=>m|cards[i],0));}
function pixelTwo(r=Math.random){const thin=[1,4,7],digits=[r()<.55?pick(thin,r):int(1,9,r),r()<.4?pick(thin,r):int(0,9,r)],modes=[],groups=digits.map(d=>{
 const target=DIGITS[d],off=shuffle(Array.from({length:15},(_,i)=>i).filter(i=>!has(target,i)),r),mode=int(0,3,r);modes.push(mode);
 const count=mode===0?0:mode===1?Math.min(1,off.length-1):int(1,Math.max(1,off.length-1),r),removed=off.slice(0,count).reduce((m,i)=>m|1<<(14-i),0),extras=off.slice(count).filter(()=>r()<.55),blue=removed|extras.reduce((m,i)=>m|1<<(14-i),0)||(1<<(14-off[off.length-1])),red=target|removed;
 const overlap=mask=>{const parts=splitMask(mask,3,r),on=Array.from({length:15},(_,i)=>i).filter(i=>has(mask,i));parts.forEach((_,i)=>{if(r()<.8)parts[i]|=1<<(14-pick(on,r));});return parts;};return {red:overlap(red),blue:overlap(blue)};
 });return {digits,modes,red:Array.from({length:6},(_,i)=>groups[i%2].red[Math.floor(i/2)]),blue:Array.from({length:6},(_,i)=>groups[i%2].blue[Math.floor(i/2)]),answer:digits.join('')};}
const AREA_EXAMPLE=['111114444','111111144','132121444','132222444','133222444','133222224','333222224','333332333','333333333'].map(s=>[...s].map(Number));
const neighbors=(i,n)=>[[i%n-1,Math.floor(i/n)],[i%n+1,Math.floor(i/n)],[i%n,Math.floor(i/n)-1],[i%n,Math.floor(i/n)+1]].filter(([x,y])=>x>=0&&y>=0&&x<n&&y<n).map(([x,y])=>y*n+x);
function areaStats(grid){const counts=[1,2,3,4].map(v=>grid.flat().filter(x=>x===v).length);return {counts,answer:[1,2,3,4].sort((a,b)=>counts[b-1]-counts[a-1])};}
function area(r=Math.random){
 for(let trial=0;trial<180;trial++){
  const cells=Array(81).fill(0),counts=[1,1,1,1],seeds=[int(0,1,r)*9+int(0,1,r),int(0,1,r)*9+int(7,8,r),int(7,8,r)*9+int(0,1,r),int(7,8,r)*9+int(7,8,r)],weights=Array.from({length:4},()=>.95+r()*.1);
  seeds.forEach((p,i)=>cells[p]=i+1);
  for(let step=0;step<77;step++){
   const frontier=[];
   for(let p=0;p<81;p++)if(!cells[p])for(const v of new Set(neighbors(p,9).map(i=>cells[i]).filter(Boolean)))frontier.push({p,v,w:weights[v-1]/counts[v-1]**3});
   let t=r()*frontier.reduce((a,b)=>a+b.w,0),choice=frontier.at(-1);
   for(const f of frontier){t-=f.w;if(t<=0){choice=f;break;}}
   cells[choice.p]=choice.v;counts[choice.v-1]++;
  }
  if(new Set(counts).size===4&&Math.min(...counts)>=18&&Math.max(...counts)<=23){const grid=Array.from({length:9},(_,i)=>cells.slice(i*9,i*9+9));return {grid,...areaStats(grid)};}
 }
 // A connected, tightly balanced fallback also covers degenerate random sources.
 const quotas=shuffle(pick([[18,20,21,22],[18,19,21,23]],r),r),cells=Array(81);let cursor=0;
 quotas.forEach((n,v)=>{for(let k=0;k<n;k++){const y=Math.floor(cursor/9),x=y%2?8-cursor%9:cursor%9;cells[y*9+x]=v+1;cursor++;}});
 const grid=Array.from({length:9},(_,i)=>cells.slice(i*9,i*9+9));return {grid,...areaStats(grid)};
}
function either(r=Math.random){const seen=new Set(),draw=(lo,hi)=>{let n=int(lo,hi,r);while(seen.has(n))n=n>=hi?lo:n+1;seen.add(n);return n;},left=Array.from({length:5},()=>draw(180,899)),target=sum(left)+pick([-1,1],r)*int(7,45,r);let right;for(let trial=0;trial<300;trial++){const used=new Set(left),a=[];for(let i=0;i<4;i++){let n=int(180,899,r);while(used.has(n))n=n===899?180:n+1;used.add(n);a.push(n);}const last=target-sum(a);if(last>=180&&last<=899&&!used.has(last)){right=[...a,last];break;}}if(!right){right=left.map(n=>n+5);while(right.some(n=>left.includes(n))||new Set(right).size<5)right=right.map(n=>n+5);}return {left:shuffle(left,r),right:shuffle(right,r),answer:Math.max(sum(left),sum(right))};}
const ZERO_EXAMPLE={values:[5,-1,8,7,1,-2,-6,-5,9,2,-7,-4,-3,-8,3,4,-9,6],targets:[-8,3],answer:[3,13]};
function zeroSum(r=Math.random,first=false){if(first)return JSON.parse(JSON.stringify(ZERO_EXAMPLE));const values=shuffle(Array.from({length:18},(_,i)=>i<9?i+1:8-i),r),positions=shuffle(Array.from({length:18},(_,i)=>i),r).slice(0,2);return {values,targets:positions.map(i=>-values[i]),answer:positions.map(i=>i+1)};}
const ACE_GAMES=['either-or','area-ranking','pixel-number-2','zero-sum'];
const aceLimit=correct=>Math.max(10,120-10*correct);
const LADDER_LEVELS=[{size:5,rungs:9,tilt:0},{size:5,rungs:10,tilt:24},{size:5,rungs:12,tilt:36},{size:6,rungs:14,tilt:42},{size:6,rungs:16,tilt:45}];
function ladderAnswer(edges,bottom){return bottom.map((_,start)=>{let p=start;for(const e of edges){if(p===e)p++;else if(p===e+1)p--;}return bottom[p];});}
function ladder(r=Math.random,level=0,pools=null){if(pools)return JSON.parse(JSON.stringify(pick(pools[level-1],r)));const c=level?LADDER_LEVELS[level-1]:{size:5,rungs:int(7,11,r),tilt:0},n=c.size,edges=shuffle(Array.from({length:n-1},(_,j)=>j),r),labels=Array.from({length:n},(_,i)=>i+1),strips=shuffle(labels,r),owners=edges.map(e=>e+int(0,1,r)),bottom=Array(n),tilt=c.tilt*(r()<.5?-1:1);while(edges.length<c.rungs){const edge=pick(Array.from({length:n-1},(_,j)=>j).filter(e=>e!==edges.at(-1)),r);edges.push(edge);owners.push(edge+int(0,1,r));}ladderAnswer(edges,labels).forEach((end,start)=>bottom[end-1]=start+1);return {edges,bottom,strips,owners,answer:strips.map(v=>bottom[v-1]),size:n,tilt,level};}
function permutations(a){if(!a.length)return [[]];return a.flatMap((v,i)=>permutations(a.filter((_,j)=>j!==i)).map(p=>[v,...p]));}
const PRIORITIES=permutations([1,2,3,4]);
function walk(grid,start,priority){const n=grid.length,flat=grid.flat(),path=[start],seen=new Set();let previous=-1,current=start;for(let step=0;step<256;step++){const key=previous+':'+current;if(seen.has(key))return {path,stop:null,reason:'cycle'};seen.add(key);const adjacent=neighbors(current,n).filter(i=>i!==previous);if(!adjacent.length)return {path,stop:current,reason:'edge'};const best=Math.min(...adjacent.map(i=>priority.indexOf(flat[i]))),options=adjacent.filter(i=>priority.indexOf(flat[i])===best);if(options.length!==1)return {path,stop:current,reason:'tie'};previous=current;current=options[0];path.push(current);}return {path,stop:null,reason:'cycle'};}
const ALGORITHM_LEVELS=[{n:5,min:5,max:7},{n:6,min:7,max:9},{n:6,min:9,max:12},{n:7,min:12,max:16},{n:8,min:16,max:22}];
function algorithm(r=Math.random,level=0){const c=level?ALGORITHM_LEVELS[level-1]:{n:8,min:7,max:22};for(let attempt=0;attempt<3000;attempt++){const grid=Array.from({length:c.n},()=>Array.from({length:c.n},()=>int(1,4,r))),start=int(0,c.n*c.n-1,r),runs=PRIORITIES.map(priority=>({priority,...walk(grid,start,priority)})),candidates=runs.filter(x=>x.stop!==null&&x.path.length>=c.min&&x.path.length<=c.max&&x.stop!==start&&x.path.filter(p=>p===x.stop).length===1);if(!candidates.length)continue;const chosen=pick(candidates,r),end=chosen.stop,solutions=runs.filter(x=>x.stop===end&&x.path.filter(p=>p===end).length===1);if(solutions.length<=(level===1?8:3))return {grid,start,end,solutions,level};}throw Error('알고리즘 문제 생성 실패');}
const DIGIT_WORD=['','일','이','삼','사','오','육','칠','팔','구'],INITIAL={일:'ㅇ',이:'ㅇ',삼:'ㅅ',사:'ㅅ',오:'ㅇ',육:'ㅇ',칠:'ㅊ',팔:'ㅍ',구:'ㄱ',십:'ㅅ',백:'ㅂ',천:'ㅊ'};
function korean(n){if(!Number.isInteger(n)||n<1||n>9999)return '';let text='';for(const [unit,name] of [[1000,'천'],[100,'백'],[10,'십'],[1,'']]){const d=Math.floor(n/unit)%10;if(d)text+=(d===1&&unit>1?'':DIGIT_WORD[d])+name;}return text;}
const initials=n=>[...korean(n)].map(c=>INITIAL[c]).join(''),bag=s=>[...s].sort().join('');
function trisection(r=Math.random){for(let t=0;t<200;t++){const sample=[int(10,99,r),int(100,999,r),int(1000,4999,r)],cards=sample.map(initials).join('');if(cards.length>=9&&cards.length<=14)return {sample,target:sum(sample),cards:shuffle([...cards],r)};}throw Error('초성 문제 생성 실패');}
function validTrisection(p,nums){return nums.length===3&&nums.every(n=>Number.isInteger(n)&&n>=1&&n<=9999)&&sum(nums)===p.target&&bag(nums.map(initials).join(''))===bag(p.cards.join(''));}
const days=['일','월','화','수','목','금','토'];
function weekdayValue(v,pattern=0){const [a,b,c,d,e]=v;if(pattern===0)return [a*b*d+c+e*d,d];if(pattern===1)return [a*b*d-c+e*d,d];if(pattern===2)return [a*b+c*d-e,1];return [(a+b)*c-d*e,1];}
const datesFor=(year,month,day)=>Array.from({length:new Date(Date.UTC(year,month,0)).getUTCDate()},(_,i)=>i+1).filter(d=>new Date(Date.UTC(year,month-1,d)).getUTCDay()===day);
const WEEKDAY_LEVELS=[[1,3,5,6,8,15],[1,3,4,5,8,12],[2,3,6,7,9,16],[6,7,10,11,13,14,17],[7,10,11,13,14,17]];
function weekdayEval(v,k){const [a,b,c,d,e]=v,f=n=>Number.isInteger(n)&&n>=0&&n<=6?Array.from({length:n},(_,i)=>i+1).reduce((x,y)=>x*y,1):NaN,p=(x,y)=>Number.isInteger(y)&&y>=0&&y<=3?x**y:NaN;
 return [a*b+c/d-e,a*a+b+c-d/e,a*a+(b-c)*d/e,f(a)+b*c-d/e,f(a)+(b-c)*d+e,(a-b)**2+c-d/e,p(a,b)+(c-d)/e,f(a-b)+c*c-d/e,(a+b)/c+d*d-e,a/(b-c)+f(d)-e,p(a-b,c)+d-e,(a*a-b*b)/c+d-e,(f(a)+b)/c+d-e,f(a)*(b-c)/(d-e),(a-b)*(c-d)+f(e),(a+b)/(c-d)+e*e,a*a/(b-c)+d-e,f(a-b)+c/(d-e)][k];}
function weekdayExpression(p,values=null){const [a,b,c,d,e]=values||p.variables.map(i=>days[i]);return [`${a}×${b}+${c}÷${d}−${e}`,`${a}²+${b}+${c}−${d}÷${e}`,`${a}²+(${b}−${c})×${d}÷${e}`,`${a}!+${b}×${c}−${d}÷${e}`,`${a}!+(${b}−${c})×${d}+${e}`,`(${a}−${b})²+${c}−${d}÷${e}`,`${a}^${b}+(${c}−${d})÷${e}`,`(${a}−${b})!+${c}²−${d}÷${e}`,`(${a}+${b})÷${c}+${d}²−${e}`,`${a}÷(${b}−${c})+${d}!−${e}`,`(${a}−${b})^${c}+${d}−${e}`,`(${a}²−${b}²)÷${c}+${d}−${e}`,`(${a}!+${b})÷${c}+${d}−${e}`,`${a}!×(${b}−${c})÷(${d}−${e})`,`(${a}−${b})×(${c}−${d})+${e}!`,`(${a}+${b})÷(${c}−${d})+${e}²`,`${a}²÷(${b}−${c})+${d}−${e}`,`(${a}−${b})!+${c}÷(${d}−${e})`][p.kind];}
function weekdayStage(r=Math.random,level=1,forcedKind=null){for(let trial=0;trial<50000;trial++){const year=int(2024,2030,r),month=int(1,12,r),kind=forcedKind===null?pick(WEEKDAY_LEVELS[level-1],r):forcedKind,sample=shuffle(Array.from({length:28},(_,i)=>i+1),r).slice(0,5);if(new Set(sample.map(n=>n%7)).size!==5||kind===6&&sample[1]<2||kind===10&&sample[2]<2)continue;const value=weekdayEval(sample,kind),target=Math.round(value);if(!Number.isFinite(value)||Math.abs(value-target)>1e-8||target<15||target>80+level*25)continue;const variables=sample.map(n=>new Date(Date.UTC(year,month-1,n)).getUTCDay()),reference=int(1,28,r);return {year,month,variables,sample,target,kind,modern:true,level,reference,referenceDay:new Date(Date.UTC(year,month-1,reference)).getUTCDay()};}throw Error('요일 수식 생성 실패');}
function weekday(r=Math.random){for(let attempt=0;attempt<300;attempt++){const year=int(2024,2030,r),month=int(1,12,r),variables=shuffle([0,1,2,3,4,5,6],r).slice(0,5),sample=variables.map(w=>pick(datesFor(year,month,w),r)),pattern=int(0,3,r),[n,d]=weekdayValue(sample,pattern);if(n%d||n/d<10||n/d>900)continue;const reference=int(1,28,r);return {year,month,variables,sample,pattern,target:n/d,reference,referenceDay:new Date(Date.UTC(year,month-1,reference)).getUTCDay()};}throw Error('요일 문제 생성 실패');}
function validWeekday(p,v){if(v.length!==5||v.some((n,i)=>!datesFor(p.year,p.month,p.variables[i]).includes(n)))return false;if(p.modern){const value=weekdayEval(v,p.kind);return Number.isFinite(value)&&Math.abs(value-p.target)<1e-8;}const [n,d]=weekdayValue(v,p.pattern);return n===p.target*d;}
function weekdaySolutions(p){const sets=p.variables.map(w=>datesFor(p.year,p.month,w)),out=[];function recur(a){if(a.length===5){if(validWeekday(p,a))out.push(a);return;}for(const n of sets[a.length])recur([...a,n]);}recur([]);return out;}
function mix(r=Math.random){const values=shuffle(Array.from({length:40},(_,i)=>i%20+1),r);return {panels:Array.from({length:8},(_,i)=>values.slice(i*5,i*5+5)),slots:[0,1,2,3,4,5,6,7,null],blank:8,previousBlank:null};}
function mixMoves(p){return neighbors(p.blank,3).filter(i=>p.slots[i]!==null&&i!==p.previousBlank);}
function slide(p,slot){if(!mixMoves(p).includes(slot))return false;const old=p.blank;p.slots[old]=p.slots[slot];p.slots[slot]=null;p.blank=slot;p.previousBlank=old;return true;}
// Preserve the identity of repeated consonants while moving/reordering cards.
function moveCard(groups,id,to,before=null){
 if(before===id||!Number.isInteger(to)||to<0||to>=groups.length||!groups.some(g=>g.includes(id)))return groups;
 const next=groups.map(g=>g.filter(v=>v!==id)),position=before===null?next[to].length:next[to].indexOf(before);
 next[to].splice(position<0?next[to].length:position,0,id);return next;
}
const api={ALGORITHM_LEVELS,WEEKDAY_LEVELS,weekdayEval,weekdayExpression,weekdayStage,ACE_GAMES,aceLimit,ZERO_EXAMPLE,zeroSum,LADDER_LEVELS,moveCard,shuffle,int,pick,sum,DIGITS,has,pop,pixelOne,pixelSolutions,pixelDigit,pixelTwo,AREA_EXAMPLE,areaStats,neighbors,area,either,ladder,ladderAnswer,PRIORITIES,walk,algorithm,korean,initials,bag,trisection,validTrisection,days,weekdayValue,datesFor,weekday,validWeekday,weekdaySolutions,mix,mixMoves,slide};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.UniversityEngine=api;
})(typeof window!=='undefined'?window:globalThis);
