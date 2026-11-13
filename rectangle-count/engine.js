(function(root){
'use strict';
function rectangles(board,target){
 const rows=board.length,cols=board[0].length,out=[];
 // Accumulate each pair of rows. A missing cell invalidates the whole rectangle.
 for(let top=0;top<rows;top++){
  const sums=Array(cols).fill(0),valid=Array(cols).fill(true);
  for(let bottom=top;bottom<rows;bottom++){
   for(let x=0;x<cols;x++){if(board[bottom][x]===null)valid[x]=false;else sums[x]+=board[bottom][x];}
   for(let left=0;left<cols;left++){let sum=0;for(let right=left;right<cols&&valid[right];right++){sum+=sums[right];if(target===undefined||sum===target)out.push({top,bottom,left,right,sum});}}
  }
 }
 return out;
}
function generate(level='normal',rng=Math.random){
 const cfg={easy:[7,5,4,25],normal:[10,6,18,100],hard:[12,7,60,190]}[level];
 const [cols,rows,min,max]=cfg;const rand=n=>Math.floor(rng()*n);
 for(let attempt=0;attempt<150;attempt++){
  const spine=Math.floor(rows/2),board=Array.from({length:rows},()=>Array(cols).fill(null));
  for(let x=0;x<cols;x++){const top=rand(spine+1),bottom=spine+rand(rows-spine);for(let y=top;y<=bottom;y++)board[y][x]=rng()<.15?1+rand(level==='easy'?3:5):0;}
  const all=rectangles(board),hist=new Map();for(const r of all)hist.set(r.sum,(hist.get(r.sum)||0)+1);
  const options=[...hist].filter(([t,n])=>t<=15&&n>=min&&n<=max);
  if(options.length){const [target]=options[rand(options.length)];return {board,target,solutions:rectangles(board,target)};}
 }
 // A deterministic valid fallback if a custom RNG repeatedly generates the same board.
 const board=Array.from({length:rows},()=>Array(cols).fill(0));board[spineIndex(rows)][Math.floor(cols/2)]=1;
 return {board,target:1,solutions:rectangles(board,1)};
}
function spineIndex(rows){return Math.floor(rows/2);}
const api={rectangles,generate};if(typeof module!=='undefined')module.exports=api;else root.RectangleEngine=api;
})(typeof window==='undefined'?globalThis:window);
