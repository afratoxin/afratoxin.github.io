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
function pixelTwo(r=Math.random){const digits=[int(1,9,r),int(0,9,r)],groups=digits.map(d=>{const noise=shuffle(Array.from({length:15},(_,i)=>i).filter(i=>!has(DIGITS[d],i)),r).slice(0,int(2,Math.max(2,15-pop(DIGITS[d])),r)).reduce((m,i)=>m|1<<(14-i),0);const blue=noise||((~DIGITS[d])&FULL);return {red:splitMask(DIGITS[d]|blue,3,r),blue:splitMask(blue,3,r)};});return {digits,red:Array.from({length:6},(_,i)=>groups[i%2].red[Math.floor(i/2)]),blue:Array.from({length:6},(_,i)=>groups[i%2].blue[Math.floor(i/2)]),answer:digits.join('')};}
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
function either(r=Math.random){const left=Array.from({length:5},()=>int(180,899,r)),right=[...left];const p=shuffle([0,1,2,3,4],r);right[p[0]]+=int(-70,70,r);right[p[1]]+=int(-70,70,r);if(sum(left)===sum(right))right[p[1]]++;return {left:shuffle(left,r),right:shuffle(right,r),answer:Math.max(sum(left),sum(right))};}
function ladderAnswer(edges,bottom){return [0,1,2,3,4].map(start=>{let p=start;for(const e of edges){if(p===e)p++;else if(p===e+1)p--;}return bottom[p];});}
function ladder(r=Math.random){const edges=Array.from({length:int(7,11,r)},()=>int(0,3,r)),bottom=shuffle([1,2,3,4,5],r),strips=shuffle([1,2,3,4,5],r),owners=edges.map(e=>e+int(0,1,r));return {edges,bottom,strips,owners,answer:ladderAnswer(edges,bottom)};}
function permutations(a){if(!a.length)return [[]];return a.flatMap((v,i)=>permutations(a.filter((_,j)=>j!==i)).map(p=>[v,...p]));}
const PRIORITIES=permutations([1,2,3,4]);
function walk(grid,start,priority){const n=grid.length,flat=grid.flat(),path=[start],seen=new Set();let previous=-1,current=start;for(let step=0;step<256;step++){const key=previous+':'+current;if(seen.has(key))return {path,stop:null,reason:'cycle'};seen.add(key);const adjacent=neighbors(current,n).filter(i=>i!==previous);if(!adjacent.length)return {path,stop:current,reason:'edge'};const best=Math.min(...adjacent.map(i=>priority.indexOf(flat[i]))),options=adjacent.filter(i=>priority.indexOf(flat[i])===best);if(options.length!==1)return {path,stop:current,reason:'tie'};previous=current;current=options[0];path.push(current);}return {path,stop:null,reason:'cycle'};}
function algorithm(r=Math.random){for(let attempt=0;attempt<250;attempt++){const grid=Array.from({length:8},()=>Array.from({length:8},()=>int(1,4,r))),start=int(0,63,r),runs=PRIORITIES.map(priority=>({priority,...walk(grid,start,priority)})),candidates=runs.filter(x=>x.stop!==null&&x.path.length>=7&&x.path.length<=22&&x.stop!==start&&x.path.filter(p=>p===x.stop).length===1);if(!candidates.length)continue;const chosen=pick(candidates,r),end=chosen.stop,solutions=runs.filter(x=>x.stop===end&&x.path.filter(p=>p===end).length===1);if(solutions.length<=3)return {grid,start,end,solutions};}throw Error('알고리즘 문제 생성 실패');}
const DIGIT_WORD=['','일','이','삼','사','오','육','칠','팔','구'],INITIAL={일:'ㅇ',이:'ㅇ',삼:'ㅅ',사:'ㅅ',오:'ㅇ',육:'ㅇ',칠:'ㅊ',팔:'ㅍ',구:'ㄱ',십:'ㅅ',백:'ㅂ',천:'ㅊ'};
function korean(n){if(!Number.isInteger(n)||n<1||n>9999)return '';let text='';for(const [unit,name] of [[1000,'천'],[100,'백'],[10,'십'],[1,'']]){const d=Math.floor(n/unit)%10;if(d)text+=(d===1&&unit>1?'':DIGIT_WORD[d])+name;}return text;}
const initials=n=>[...korean(n)].map(c=>INITIAL[c]).join(''),bag=s=>[...s].sort().join('');
function trisection(r=Math.random){for(let t=0;t<200;t++){const sample=[int(10,99,r),int(100,999,r),int(1000,4999,r)],cards=sample.map(initials).join('');if(cards.length>=9&&cards.length<=14)return {sample,target:sum(sample),cards:shuffle([...cards],r)};}throw Error('초성 문제 생성 실패');}
function validTrisection(p,nums){return nums.length===3&&nums.every(n=>Number.isInteger(n)&&n>=1&&n<=9999)&&sum(nums)===p.target&&bag(nums.map(initials).join(''))===bag(p.cards.join(''));}
const days=['일','월','화','수','목','금','토'];
function weekdayValue(v,pattern=0){const [a,b,c,d,e]=v;if(pattern===0)return [a*b*d+c+e*d,d];if(pattern===1)return [a*b*d-c+e*d,d];if(pattern===2)return [a*b+c*d-e,1];return [(a+b)*c-d*e,1];}
const datesFor=(year,month,day)=>Array.from({length:new Date(Date.UTC(year,month,0)).getUTCDate()},(_,i)=>i+1).filter(d=>new Date(Date.UTC(year,month-1,d)).getUTCDay()===day);
function weekday(r=Math.random){for(let attempt=0;attempt<300;attempt++){const year=int(2024,2030,r),month=int(1,12,r),variables=shuffle([0,1,2,3,4,5,6],r).slice(0,5),sample=variables.map(w=>pick(datesFor(year,month,w),r)),pattern=int(0,3,r),[n,d]=weekdayValue(sample,pattern);if(n%d||n/d<10||n/d>900)continue;const reference=int(1,28,r);return {year,month,variables,sample,pattern,target:n/d,reference,referenceDay:new Date(Date.UTC(year,month-1,reference)).getUTCDay()};}throw Error('요일 문제 생성 실패');}
function validWeekday(p,v){if(v.length!==5||v.some((n,i)=>!datesFor(p.year,p.month,p.variables[i]).includes(n)))return false;const [n,d]=weekdayValue(v,p.pattern);return n===p.target*d;}
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
const api={moveCard,shuffle,int,pick,sum,DIGITS,has,pop,pixelOne,pixelSolutions,pixelDigit,pixelTwo,AREA_EXAMPLE,areaStats,neighbors,area,either,ladder,ladderAnswer,PRIORITIES,walk,algorithm,korean,initials,bag,trisection,validTrisection,days,weekdayValue,datesFor,weekday,validWeekday,weekdaySolutions,mix,mixMoves,slide};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.UniversityEngine=api;
})(typeof window!=='undefined'?window:globalThis);
