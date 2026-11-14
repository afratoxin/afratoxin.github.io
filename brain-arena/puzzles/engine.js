'use strict';
(function(root) {
const int=(a,b,r=Math.random)=>a+Math.floor(r()*(b-a+1));
function shuffle(a,r=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=int(0,i,r);[a[i],a[j]]=[a[j],a[i]];}return a;}
const sum=a=>a.reduce((a,b)=>a+b,0),mod=(a,b)=>(a%b+b)%b;

// A slot's number is its contribution per counter, not an extra lever multiplier.
function scaleSolutions(values,count){
 const out=[],n=values.length,half=n/2;
 function walk(i,left,balance,a){
  if(i===n){if(!left&&!balance&&sum(a.slice(0,half))&&sum(a.slice(half)))out.push(a);return;}
  for(let k=0;k<=left;k++)walk(i+1,left-k,balance+(i<half?1:-1)*k*values[i],[...a,k]);
 }
 walk(0,count,0,[]);return out;
}
function validScale(p,counts){return counts.length===p.values.length&&counts.every(n=>Number.isInteger(n)&&n>=0)&&sum(counts)===p.count&&sum(counts.slice(0,3))>0&&sum(counts.slice(3))>0&&counts.reduce((s,n,i)=>s+n*p.values[i]*(i<3?1:-1),0)===0;}
function scale(level=1,r=Math.random){
 for(let t=0;t<500;t++){
  const count=level+3,values=shuffle(Array.from({length:14+level*7},(_,i)=>i+2),r).slice(0,6),solutions=scaleSolutions(values,count);
  if(solutions.length&&solutions.every(a=>a.filter(Boolean).length>=(level>2?4:3))){return{level,count,values,sample:solutions[int(0,solutions.length-1,r)],solutions};}
 }
 throw Error('Could not prepare a balance problem');
}

// Clock statements use a 24-hour clock; a day rollover is intentional.
function timeParts(kind){
 const b=i=>({slot:i});
 if(kind===0)return[b(0),'시에서 ',b(1),'시간 후는 ',b(2),'시이다.'];
 if(kind===1)return[b(0),'시 ',b(1),'분에서 ',b(2),'분 후는 ',b(3),'시 정각이다.'];
 if(kind===2||kind===3)return[b(0),'시 ',b(1),'분에서 ',b(2),'시간 ',b(3),'분 '+(kind===2?'후':'전')+'는 ',b(4),'시 ',b(5),'분이다.'];
 return[b(0),'시 ',b(1),'분에서 ',b(2),'시간 ',b(3),'분 후로 이동하고, 다시 ',b(4),'시간 ',b(5),'분 전으로 이동하면 ',b(6),'시 ',b(7),'분이다.'];
}
function validTime(p,a){
 if(a.length!==p.cards.length||a.some(n=>!Number.isInteger(n))||[...a].sort((a,b)=>a-b).join()!==[...p.cards].sort((a,b)=>a-b).join())return false;
 if(p.kind===0)return a.every(n=>n>=0&&n<24)&&mod(a[0]+a[1],24)===a[2];
 if(p.kind===1)return a[0]>=0&&a[0]<24&&a[1]>=0&&a[1]<60&&a[2]>=0&&a[2]<60&&a[3]>=0&&a[3]<24&&mod(60*a[0]+a[1]+a[2],1440)===60*a[3];
 const hours=p.kind===4?[0,2,4,6]:[0,2,4],minutes=p.kind===4?[1,3,5,7]:[1,3,5];
 if(hours.some(i=>a[i]<0||a[i]>23)||minutes.some(i=>a[i]<0||a[i]>59))return false;
 if(p.kind===4)return mod(a[0]*60+a[1]+a[2]*60+a[3]-a[4]*60-a[5],1440)===a[6]*60+a[7];
 return mod(a[0]*60+a[1]+(p.kind===2?1:-1)*(a[2]*60+a[3]),1440)===a[4]*60+a[5];
}
function time(level=1,r=Math.random){
 const kind=level-1;
 for(let t=0;t<2000;t++){
  let a;
  if(kind===0){const h=int(1,22,r),d=int(1,14,r);a=[h,d,mod(h+d,24)];}
  else if(kind===1){const h=int(1,22,r),m=int(1,59,r);a=[h,m,60-m,mod(h+1,24)];}
  else{a=[int(0,23,r),int(0,59,r),int(1,12,r),int(1,59,r)];if(kind===4)a.push(int(1,12,r),int(1,59,r));const v=mod(a[0]*60+a[1]+(kind===3?-1:1)*(a[2]*60+a[3])-(kind===4?a[4]*60+a[5]:0),1440);a.push(Math.floor(v/60),v%60);}
  if(new Set(a).size!==a.length)continue;
  const p={level,kind,cards:shuffle(a,r),sample:a,parts:timeParts(kind)};if(validTime(p,a))return p;
 }
 throw Error('Could not prepare a clock statement');
}

function rotatePixels(a,n=3){const out=Array(a.length);for(let y=0;y<n;y++)for(let x=0;x<n;x++)out[x*n+n-1-y]=a[y*n+x];return out;}
function rotated(a,k,n=3){for(let i=0;i<mod(k,4);i++)a=rotatePixels(a,n);return [...a];}
const PIXEL_COLORS=['#f3f2e9','#e34958','#f1cf53','#ee9048','#4b82df','#a96dcc','#58aa70','#252c3a'];
function mixPixels(cards){
 const result=[];for(let i=0;i<9;i++){const counts=[0,0,0];for(const a of cards){if(a[i]===1)counts[0]++;else if(a[i]===2)counts[1]++;else if(a[i]===4)counts[2]++;else if(a[i]!==0)return null;}
  const used=counts.filter(Boolean);if(used.length>1&&new Set(used).size!==1)return null;
  result.push(counts.reduce((s,n,j)=>s|(n?1<<j:0),0));
 }return result;
}
function validArt(p,selection){
 if(selection.length!==3||new Set(selection.map(s=>s.id)).size!==3||selection.some(s=>!Number.isInteger(s.id)||s.id<0||s.id>=9||!Number.isInteger(s.rotation)||s.rotation<0||s.rotation>3))return false;
 const result=mixPixels(selection.map(s=>rotated(p.cards[s.id],s.rotation)));return result!==null&&result.join()===p.target.join();
}
function art(level=1,r=Math.random){
 for(let t=0;t<3000;t++){
  const cards=shuffle(Array.from({length:9},(_,i)=>{const color=1<<Math.floor(i/3);let mask;do{mask=Array.from({length:9},()=>r()<(.27+level*.035)?color:0);}while(mask.filter(Boolean).length<2||mask.filter(Boolean).length>6);return mask;}),r);
  const ids=shuffle(Array.from({length:9},(_,i)=>i),r).slice(0,3),sample=ids.map(id=>({id,rotation:int(0,3,r)})),target=mixPixels(sample.map(s=>rotated(cards[s.id],s.rotation)));
  if(target&&target.filter(Boolean).length>=5&&target.filter(v=>![0,1,2,4].includes(v)).length>=(level>2?2:1))return{level,cards,target,sample};
 }throw Error('Could not prepare pixel art');
}

// Height maps are solid to the floor and fall toward the viewer. Every column's
// top is visible, so its hidden support cubes can be inferred without guessing.
function blocks(level=1,r=Math.random){
 const n=level<3?3:level<5?4:5,max=level+2,heights=[];
 for(let x=0;x<n;x++){heights[x]=[];for(let y=0;y<n;y++){const cap=Math.min(x?heights[x-1][y]:max,y?heights[x][y-1]:max);heights[x][y]=x===0&&y===0?max:Math.max(1,cap-int(0,1,r));}}
 return{level,n,heights,answer:sum(heights.flat())};
}
function blockSVG(p,layer=null){
 const n=p.n,w=34,h=18,z=36,project=(x,y,k)=>[60+(n+x-y)*w,70+(x+y)*h+(p.level+2-k)*z],points=a=>a.map(v=>project(...v).join(',')).join(' ');
 let body='';
 for(let d=0;d<=2*(n-1);d++)for(let x=0;x<n;x++){const y=d-x;if(y<0||y>=n)continue;const height=layer===null?p.heights[x][y]:(p.heights[x][y]>=layer?1:0);
  for(let k=0;k<height;k++){
   body+='<g class="counted-cube" data-column="'+x+','+y+'" data-layer="'+(layer===null?k+1:layer)+'">';
   body+='<polygon points="'+points([[x+1,y,k],[x+1,y+1,k],[x+1,y+1,k+1],[x+1,y,k+1]])+'" fill="#8da3bd"/>';
   body+='<polygon points="'+points([[x,y+1,k],[x+1,y+1,k],[x+1,y+1,k+1],[x,y+1,k+1]])+'" fill="#627d9f"/>';
   body+='<polygon points="'+points([[x,y,k+1],[x+1,y,k+1],[x+1,y+1,k+1],[x,y+1,k+1]])+'" fill="#e3edf8"/></g>';
  }
 }
 return '<svg class="block-model" viewBox="0 0 '+(120+2*n*w)+' '+(120+2*n*h+(p.level+2)*z)+'" role="img" aria-label="바닥까지 빈틈없이 쌓인 정육면체 블록 그림"><g stroke="#263a52" stroke-width="1.4" stroke-linejoin="round">'+body+'</g></svg>';
}

// Clockwise rotation moves both arrow positions and arrow directions.
function rotatePattern(a){return[(a[2]+1)%4,(a[0]+1)%4,(a[3]+1)%4,(a[1]+1)%4];}
function patternVariants(a){const out=[];for(let k=0;k<4;k++){out.push(a);a=rotatePattern(a);}return out;}
const patternKey=a=>patternVariants(a).map(a=>a.join('')).sort()[0];
const windowAt=(board,x,y)=>[board[y][x],board[y][x+1],board[y+1][x],board[y+1][x+1]];
function patternSolutions(board,target){
 const variants=new Set(patternVariants(target).map(a=>a.join(''))),out=[];
 for(let y=0;y<board.length-1;y++)for(let x=0;x<board[0].length-1;x++)if(variants.has(windowAt(board,x,y).join('')))out.push(y*10+x);
 return out;
}
function patternSet(r=Math.random){
 const choices=[];for(let a=0;a<256;a++){const p=[a%4,(a>>2)%4,(a>>4)%4,(a>>6)%4];if(new Set(p).size>=3&&!choices.some(q=>patternKey(q)===patternKey(p)))choices.push(p);}
 for(let trial=0;trial<200;trial++){
  const targets=shuffle(choices,r).slice(0,3),board=Array.from({length:8},()=>Array.from({length:10},()=>int(0,3,r))),slots=shuffle(Array.from({length:20},(_,i)=>[i%5*2,Math.floor(i/5)*2]),r);
  targets.forEach((p,i)=>{for(let j=0;j<4;j++){const [x,y]=slots[i*4+j],q=patternVariants(p)[int(0,3,r)];[board[y][x],board[y][x+1],board[y+1][x],board[y+1][x+1]]=q;}});
  const puzzles=targets.map(target=>({board,target,solutions:patternSolutions(board,target)}));if(puzzles.every(p=>p.solutions.length>=4&&p.solutions.length<=12))return puzzles;
 }throw Error('Could not prepare matching patterns');
}
function patternAction(p,found,action){
 if(action==='end')return{delta:p.solutions.every(i=>found.includes(i))?3:-2,complete:p.solutions.every(i=>found.includes(i)),found:[...found]};
 const correct=Number.isInteger(action)&&p.solutions.includes(action)&&!found.includes(action);
 return{delta:correct?1:-1,complete:false,found:correct?[...found,action]:[...found]};
}
const api={int,shuffle,sum,mod,scale,scaleSolutions,validScale,time,timeParts,validTime,rotatePixels,rotated,PIXEL_COLORS,mixPixels,art,validArt,blocks,blockSVG,rotatePattern,patternVariants,patternKey,windowAt,patternSolutions,patternSet,patternAction};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.ArenaPuzzles=api;
})(typeof window!=='undefined'?window:globalThis);
