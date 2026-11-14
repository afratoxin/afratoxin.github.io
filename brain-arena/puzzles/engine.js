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

// Every blank is one digit. Each puzzle consumes exactly 1..6 or 1..7 once.
const clockValue=(a,indices)=>Number(indices.map(i=>a[i]).join(''));
function timeParts(p){
 const [h,m,eh,em]=p.fields.map(slots=>({slots})),parts=[h,'시 ',m,'분에서 '];
 p.moves.forEach((d,i)=>{const n=Math.abs(d);parts.push((i?'다시 ':'')+(Math.floor(n/60)?Math.floor(n/60)+'시간 ':'')+(n%60?n%60+'분 ':'')+(d>0?'후':'전')+(i===p.moves.length-1?'는 ':'로 이동하고, '));});
 return [...parts,eh,'시 ',em,'분이다.'];
}
function validTime(p,a){
 if(a.length!==p.cards.length||a.some(n=>!Number.isInteger(n))||[...a].sort((a,b)=>a-b).join()!==p.cards.join())return false;
 const [h,m,eh,em]=p.fields.map(indices=>clockValue(a,indices));
 return h<24&&eh<24&&m<60&&em<60&&mod(h*60+m+sum(p.moves),1440)===eh*60+em;
}
function time(level=1,r=Math.random){
 const count=level<4?6:7,cards=Array.from({length:count},(_,i)=>i+1);
 // The first three stages use one-digit hours. Later stages add a two-digit
 // hour, midnight crossings, and then multiple forward/backward moves.
 const longStart=![5,6].includes(level),widths=count===6?[1,2,1,2]:longStart?[2,2,1,2]:[1,2,2,2];
 let index=0;const fields=widths.map(n=>Array.from({length:n},()=>index++));
 for(let t=0;t<10000;t++){
  const a=shuffle(cards,r),[h,m,eh,em]=fields.map(indices=>clockValue(a,indices));if(h>=24||eh>=24||m>=60||em>=60)continue;
  const delta=(eh-h)*60+em-m;let total;
  if(level===1){if(delta<=0||delta>240||em<=m)continue;total=delta;}
  else if(level===2){if(delta<=0||em>=m)continue;total=delta;}
  else if(level===3){if(delta>=0||em<=m)continue;total=delta;}
  else if([4,7,8].includes(level)){if(delta>=0)continue;total=delta+1440;}
  else if(level===5){if(delta<=0)continue;total=delta-1440;}
  else{if(delta<=0)continue;total=delta;}
  let moves=[total];
  if(level===6){const back=int(40,220,r);moves=[total+back,-back];}
  if(level===7){const back=int(80,300,r);moves=[-back,total+back];}
  if(level===8){const forward=int(100,350,r),back=int(60,240,r);moves=[forward,-back,total-forward+back];}
  const p={level,cards,fields,moves,sample:a};p.parts=timeParts(p);if(validTime(p,a))return p;
 }
 throw Error('Could not prepare a clock statement');
}

function rotatePixels(a,n=3){const out=Array(a.length);for(let y=0;y<n;y++)for(let x=0;x<n;x++)out[x*n+n-1-y]=a[y*n+x];return out;}
function rotated(a,k,n=3){for(let i=0;i<mod(k,4);i++)a=rotatePixels(a,n);return [...a];}
const PIXEL_COLORS=['#f3f2e9','#e34958','#f1cf53','#ee9048','#4b82df','#a96dcc','#58aa70','#252c3a'];
function mixPixels(cards){
 const result=[];for(let i=0;i<9;i++){const counts=[0,0,0];for(const a of cards){if(a[i]===1)counts[0]++;else if(a[i]===2)counts[1]++;else if(a[i]===4)counts[2]++;else if(a[i]!==0)return null;}
  if(counts.some(n=>n>1))return null;
  result.push(counts.reduce((s,n,j)=>s|(n?1<<j:0),0));
 }return result;
}
function artSolution(p,ids){
 if(ids.length!==3||new Set(ids).size!==3||ids.some(id=>!Number.isInteger(id)||id<0||id>=p.cards.length))return null;
 for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let c=0;c<4;c++){
  const turns=[a,b,c],result=mixPixels(ids.map((id,i)=>rotated(p.cards[id],turns[i])));
  if(result&&result.join()===p.target.join())return ids.map((id,i)=>({id,rotation:turns[i]}));
 }return null;
}
const validArt=(p,ids)=>artSolution(p,ids)!==null;
function art(level=1,r=Math.random){
 for(let t=0;t<3000;t++){
  const cards=shuffle(Array.from({length:9},(_,i)=>{const color=1<<Math.floor(i/3);let mask;do{mask=Array.from({length:9},()=>r()<(.27+level*.035)?color:0);}while(mask.filter(Boolean).length<2||mask.filter(Boolean).length>6);return mask;}),r);
  const ids=shuffle(Array.from({length:9},(_,i)=>i),r).slice(0,3),sample=ids.map(id=>({id,rotation:int(0,3,r)})),target=mixPixels(sample.map(s=>rotated(cards[s.id],s.rotation)));
  if(target&&target.filter(Boolean).length>=(level<6?5:level===6?7:8)&&target.filter(v=>![0,1,2,4].includes(v)).length>=(level<6?(level>2?2:1):level-3)){
   if(level>=6){
    // Close distractors make the added stages harder without adding controls.
    cards.forEach((card,id)=>{if(ids.includes(id))return;const color=card.find(Boolean),source=ids.map(i=>cards[i]).find(a=>a.includes(color));if(!source)return;const next=[...source];for(const at of shuffle(Array.from({length:9},(_,i)=>i),r).slice(0,level===6?3:level===7?2:1))next[at]=next[at]?0:color;if(next.filter(Boolean).length>=2)cards[id]=rotated(next,int(0,3,r));});
   }
   return{level,cards,target,sample};
  }
 }throw Error('Could not prepare pixel art');
}

// Explicit occupied unit cubes allow arches, wells and separated pillars.
const BLOCK_NAMES={pillars:'여러 기둥',long:'긴 직육면체 변형',tower:'탑',pyramid:'피라미드',stairs:'꺾인 계단',well:'가운데가 빈 구조',arch:'구멍이 뚫린 문',bridge:'다리와 기둥',courtyard:'회랑과 중정'};
function blockFamilies(level){return Object.keys(BLOCK_NAMES).filter(name=>level>=({well:2,arch:3,bridge:4,courtyard:6}[name]||1));}
function blocks(level=1,r=Math.random,family=null){
 const choices=blockFamilies(level);family=family&&choices.includes(family)?family:choices[int(0,choices.length-1,r)];
 const cubes=new Map(),add=(x,y,z)=>cubes.set([x,y,z].join(','),[x,y,z]);
 const box=(x,y,z,w,d,h)=>{for(let i=x;i<x+w;i++)for(let j=y;j<y+d;j++)for(let k=z;k<z+h;k++)add(i,j,k);};
 const tier=Math.floor((level-1)/2),height=level<3?3:3+tier+int(0,1,r);
 if(family==='pillars'){
  const count=2+tier,thick=level<5?1:2;
  for(let i=0;i<count;i++)box(i*(thick+1),i%2*(thick+1),0,thick,thick,int(2,height,r));
  if(level>3)box(0,0,0,count*(thick+1)-1,1,1);
 }else if(family==='long'){
  const w=4+tier*2+int(0,1,r),d=level<4?2:3,h=level<3?2:height-1;
  box(0,0,0,w,d,1);box(0,0,1,Math.max(2,w-2),1,h-1);box(w-2,0,1,2,d,1);
  if(level>=5)box(Math.floor(w/2),1,1,2,2,height-1);
 }else if(family==='tower'){
  const n=level<3?3:level<6?5:7;box(0,0,0,n,n,1);
  const core=level<3?1:3,offset=(n-core)/2;box(offset,offset,1,core,core,height-1);
  if(level>=3)box(offset-1,offset-1,height,n-2,n-2,1);
  if(level>=6)box((n-1)/2,(n-1)/2,height+1,1,1,2);
 }else if(family==='pyramid'){
  const n=3+tier*2;for(let z=0;z<=tier+1;z++){const side=n-2*z;if(side>0)box(z,z,z,side,side,1);}
 }else if(family==='stairs'){
  const n=3+tier,d=level<3?2:3;for(let x=0;x<n;x++)box(x,0,0,1,d,1+x);
  if(level>=4)for(let y=1;y<=tier+1;y++)box(n-1,y+d-1,0,1,1,Math.max(1,n-y));
 }else if(family==='well'){
  const w=4+tier,d=3+tier,h=2+tier;for(let x=0;x<w;x++)for(let y=0;y<d;y++)if(x===0||y===0||x===w-1||y===d-1)box(x,y,0,1,1,h);
  // The empty center is open from above; it is never silently filled.
  if(level>=5)for(let x=0;x<w;x+=2)add(x,0,h);
 }else if(family==='arch'){
  const opening=2+tier,w=opening+2,d=level<6?1:2,h=height;
  box(0,0,0,1,d,h);box(w-1,0,0,1,d,h);box(0,0,h,w,d,level<7?1:2);
  if(level>=5){box(0,0,h+1,2,d,1);box(w-2,0,h+1,2,d,1);}
 }else if(family==='bridge'){
  const span=3+tier,w=span+2,d=2;
  box(0,0,0,1,d,height);box(w-1,0,0,1,d,height);box(0,0,height,w,d,1);
  if(level>=6){box(0,0,height+1,w,1,1);box(Math.floor(w/2),1,0,1,1,height);}
 }else{
  const n=5+tier,h=height-1;
  for(let x=0;x<n;x++)for(let y=0;y<n;y++)if(x===0||x===n-1||y===0||y===n-1){if((x+y)%3===0||((x===0||x===n-1)&&(y===0||y===n-1)))box(x,y,0,1,1,h);add(x,y,h);}
  // Roof corridors are supported at their ends and the central courtyard stays open.
  box(0,0,0,1,n,1);box(n-1,0,0,1,n,1);
 }
 let list=[...cubes.values()];const turns=int(0,3,r);for(let t=0;t<turns;t++)list=list.map(([x,y,z])=>[-y,x,z]);
 const minX=Math.min(...list.map(c=>c[0])),minY=Math.min(...list.map(c=>c[1]));list=list.map(([x,y,z])=>[x-minX,y-minY,z]);
 const width=1+Math.max(...list.map(c=>c[0])),depth=1+Math.max(...list.map(c=>c[1])),maxHeight=1+Math.max(...list.map(c=>c[2]));
 return{level,family,name:BLOCK_NAMES[family],width,depth,height:maxHeight,cubes:list,answer:list.length};
}
function blockSVG(p,layer=null,turns=0){
 let cubes=p.cubes.map(c=>[...c]);for(let t=0;t<mod(turns,4);t++)cubes=cubes.map(([x,y,z])=>[-y,x,z]);
 if(layer!==null)cubes=cubes.filter(c=>c[2]===layer-1).map(([x,y])=>[x,y,0]);
 const occupied=new Set(cubes.map(c=>c.join(','))),project=([x,y,z])=>[(x-y)*32,(x+y)*17-z*34],points=a=>a.map(v=>project(v).join(',')).join(' ');
 const verts=cubes.flatMap(([x,y,z])=>[[x,y,z],[x+1,y,z],[x,y+1,z],[x+1,y+1,z+1],[x,y,z+1]]).map(project);
 const minX=Math.min(0,...verts.map(v=>v[0]))-28,minY=Math.min(0,...verts.map(v=>v[1]))-28,maxX=Math.max(0,...verts.map(v=>v[0]))+28,maxY=Math.max(0,...verts.map(v=>v[1]))+28;
 let body='';cubes.sort((a,b)=>sum(a)-sum(b)||a[2]-b[2]||a[0]-b[0]).forEach(([x,y,z])=>{
  body+='<g class="counted-cube" data-column="'+x+','+y+'" data-layer="'+(layer===null?z+1:layer)+'">';
  if(!occupied.has([x+1,y,z].join(',')))body+='<polygon points="'+points([[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]])+'" fill="#8da3bd"/>';
  if(!occupied.has([x,y+1,z].join(',')))body+='<polygon points="'+points([[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]])+'" fill="#627d9f"/>';
  if(!occupied.has([x,y,z+1].join(',')))body+='<polygon points="'+points([[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]])+'" fill="#e3edf8"/>';
  body+='</g>';
 });
 return '<svg class="block-model" viewBox="'+[minX,minY,maxX-minX,maxY-minY].join(' ')+'" role="img" aria-label="'+p.name+' 형태의 정육면체 블록 그림'+(layer===null?'':' · '+layer+'층')+'"><g stroke="#263a52" stroke-width="1.3" stroke-linejoin="round">'+body+'</g></svg>';
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
const api={int,shuffle,sum,mod,scale,scaleSolutions,validScale,time,timeParts,validTime,rotatePixels,rotated,PIXEL_COLORS,mixPixels,art,artSolution,validArt,BLOCK_NAMES,blockFamilies,blocks,blockSVG,rotatePattern,patternVariants,patternKey,windowAt,patternSolutions,patternSet,patternAction};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.ArenaPuzzles=api;
})(typeof window!=='undefined'?window:globalThis);
