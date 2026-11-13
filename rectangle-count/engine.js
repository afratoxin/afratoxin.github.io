(function(root){
'use strict';
const TYPES={
 dense:{name:'숫자 밀집',hint:'모든 칸에 숫자가 있습니다. 행과 열의 누적합을 나눠 살펴보세요.'},
 fractions:{name:'분수 조합',hint:'서로 다른 분모를 통분해 보세요. 분수의 합도 정확히 타깃과 같아야 합니다.'},
 holes:{name:'구멍 난 판',hint:'짙은 구멍은 0이 아닙니다. 내부에 구멍을 포함하는 네모도 제외합니다.'},
 symmetry:{name:'대칭의 짝',hint:'대칭인 네모는 짝으로, 대칭 이동 후 위치가 같은 네모는 한 번만 셉니다.'},
 signed:{name:'양수와 음수',hint:'수를 더할수록 합이 커지지는 않습니다. 음수로 상쇄되는 큰 네모를 찾아보세요.'},
 pattern:{name:'반복의 함정',hint:'규칙적으로 반복되는 숫자들. 같은 크기라도 시작 위치에 따라 합이 달라집니다.'},
 classic:{name:'빈칸 확장',hint:'빈칸은 0입니다. 합을 유지하면서 네모를 얼마나 확장할 수 있을까요?'}
};
function rectangles(board,target){
 const rows=board.length,cols=board[0].length,out=[];
 for(let top=0;top<rows;top++){
  const sums=Array(cols).fill(0),valid=Array(cols).fill(true);
  for(let bottom=top;bottom<rows;bottom++){
   for(let x=0;x<cols;x++){if(board[bottom][x]===null)valid[x]=false;else sums[x]+=board[bottom][x];}
   for(let left=0;left<cols;left++){let sum=0;for(let right=left;right<cols&&valid[right];right++){sum+=sums[right];if(target===undefined||sum===target)out.push({top,bottom,left,right,sum});}}
  }
 }
 return out;
}
function gcd(a,b){a=Math.abs(a);while(b){const t=b;b=a%b;a=t;}return a;}
function parts(value,unit=1){const d=gcd(value,unit);return {n:value/d,d:unit/d};}
function format(value,unit=1){const f=parts(value,unit);return f.d===1?String(f.n):`${f.n}/${f.d}`;}
function mirror(rect,rows,cols,symmetry){return symmetry==='point'?{top:rows-1-rect.bottom,bottom:rows-1-rect.top,left:cols-1-rect.right,right:cols-1-rect.left}:{top:rect.top,bottom:rect.bottom,left:cols-1-rect.right,right:cols-1-rect.left};}
function key(r){return [r.top,r.bottom,r.left,r.right].join(',');}
function shape(rows,cols,type,rng){
 const rand=n=>Math.floor(rng()*n),spine=Math.floor(rows/2);
 let b=Array.from({length:rows},()=>Array(cols).fill(0));
 if(type==='classic'){
  b=b.map(r=>r.map(()=>null));for(let x=0;x<cols;x++){const top=rand(spine+1),bottom=spine+rand(rows-spine);for(let y=top;y<=bottom;y++)b[y][x]=0;}
 }else if(type==='holes'){
  // Keep the outer ring: every removed cell is a true enclosed hole.
  const holes=1+rand(Math.max(1,Math.floor(cols/4)));
  for(let n=0;n<holes;n++){const x=1+rand(cols-2),y=1+rand(rows-2);b[y][x]=null;if(rng()<.4&&x+1<cols-1)b[y][x+1]=null;}
 }else if(type==='symmetry'){
  for(let y=0;y<rows;y++){const inset=Math.min(Math.floor(Math.abs(y-(rows-1)/2)),Math.floor(cols/3));for(let x=0;x<inset;x++)b[y][x]=b[y][cols-1-x]=null;}
 }else if(type==='pattern'){
  // Two different silhouettes: full checkerboard or an offset staircase.
  if(rng()<.5)for(let y=0;y<rows;y++){const inset=y%3;for(let x=0;x<inset;x++)b[y][x]=null;}
 }else if(type==='dense'&&rng()<.5){
  for(let y=0;y<rows;y++){const inset=y%2;for(let x=cols-inset;x<cols;x++)b[y][x]=null;}
 }
 return b;
}
function generate(level='normal',rng=Math.random,type='dense'){
 if(!TYPES[type])type='dense';
 const sizes={dense:[[4,4],[5,4],[6,5]],fractions:[[3,3],[4,3],[4,4]],holes:[[5,4],[5,5],[6,5]],symmetry:[[5,3],[6,4],[7,5]],signed:[[3,3],[4,4],[5,4]],pattern:[[4,3],[5,4],[6,4]],classic:[[5,4],[7,4],[8,5]]}; const [cols,rows]=sizes[type][({easy:0,normal:1,hard:2})[level]??1];
 const rand=n=>Math.floor(rng()*n),unit=type==='fractions'?12:1;
 const desired=type==='classic'?{easy:[5,30],normal:[18,100],hard:[45,190]}[level]||[18,100]:{easy:[4,20],normal:[8,45],hard:[14,80]}[level]||[8,45];
 let fallback;
 for(let attempt=0;attempt<90;attempt++){
  const board=shape(rows,cols,type,rng),symmetry=type==='symmetry'?(rng()<.5?'vertical':'point'):null;
  const patternKind=rand(3),a=1+rand(3),b=1+rand(3);
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
   if(board[y][x]===null)continue;
   if(type==='classic')board[y][x]=rng()<.2?1+rand(5):0;
   else if(type==='fractions')board[y][x]=[3,4,6,8,9,12,16,18][rand(8)];
   else if(type==='signed'){const v=1+rand(level==='easy'?3:5);board[y][x]=(rng()<.43?-1:1)*v;}
   else if(type==='pattern')board[y][x]=patternKind===0?((x+y)%2?a:b+3):patternKind===1?1+(x%3)+((y%2)*2):1+((x+2*y)%4);
   else board[y][x]=1+rand(type==='holes'?3:level==='easy'?4:6);
  }
  if(symmetry)for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
   const yy=symmetry==='point'?rows-1-y:y,xx=cols-1-x;
   if(y*cols+x<=yy*cols+xx)board[yy][xx]=board[y][x];
  }
  const hist=new Map();for(const r of rectangles(board)){if(!hist.has(r.sum))hist.set(r.sum,[]);hist.get(r.sum).push(r);}
  const maxCell=Math.max(...board.flat().filter(v=>v!==null)),hasFraction=board.flat().some(v=>v!==null&&v%unit!==0),hasNegative=board.flat().some(v=>v!==null&&v<0),hasPositive=board.flat().some(v=>v!==null&&v>0);
  if(type==='fractions'&&!hasFraction||type==='signed'&&(!hasNegative||!hasPositive))continue;
  const options=[...hist].filter(([target,sol])=>{
   if(sol.length<desired[0]||sol.length>desired[1])return false;
   if(type!=='classic'&&type!=='signed'&&target<=maxCell)return false;
   if(type==='signed'&&Math.abs(target)>8)return false;
   return new Set(sol.map(r=>(r.right-r.left+1)*(r.bottom-r.top+1))).size>=2;
  });
  // Retain a type-preserving candidate instead of falling back to a blank board.
  const loose=[...hist].filter(([t,s])=>s.length>=2&&(type==='signed'||t>maxCell));
  const candidates=options.length?options:loose;
  if(candidates.length){const [target,solutions]=candidates[rand(candidates.length)];const result={board,target,solutions,unit,type,symmetry,patternKind};if(options.length)return result;fallback=result;}
 }
 if(fallback)return fallback;
 // The board remains of the requested type even with a pathological custom RNG.
 const board=shape(rows,cols,type,rng);for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)if(board[y][x]!==null)board[y][x]=type==='fractions'?6:type==='signed'?(x%2?-1:1):1;
 if(type==='signed')board[0][0]=1;
 const target=type==='signed'?0:type==='fractions'?12:2;
 return {board,target,solutions:rectangles(board,target),unit,type,symmetry:type==='symmetry'?'vertical':null};
}
const api={TYPES,rectangles,generate,parts,format,mirror,key};if(typeof module!=='undefined')module.exports=api;else root.RectangleEngine=api;
})(typeof window==='undefined'?globalThis:window);
