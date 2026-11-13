(function(root){
'use strict';
function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function hexCells(){const cells=[];for(let r=-2;r<=2;r++)for(let q=Math.max(-2,-r-2);q<=Math.min(2,-r+2);q++)cells.push({q,r});return cells;}
const cells=hexCells();
function hexLines(){const index=new Map(cells.map((c,i)=>[c.q+','+c.r,i])),out=[];for(let i=0;i<cells.length;i++)for(const [dq,dr] of [[1,0],[0,1],[1,-1]]){const c=cells[i],b=index.get((c.q+dq)+','+(c.r+dr)),d=index.get((c.q+2*dq)+','+(c.r+2*dr));if(b!==undefined&&d!==undefined)out.push([i,b,d]);}return out;}
function hexSolutions(board,target){return hexLines().filter(line=>line.reduce((s,i)=>s+board[i],0)===target);}
function hexPuzzle(rng=Math.random){const board=Array.from({length:19},()=>1+Math.floor(rng()*6));const sums=new Map();for(const l of hexLines()){const t=l.reduce((s,i)=>s+board[i],0);sums.set(t,(sums.get(t)||0)+1);}const options=[...sums].filter(([t,n])=>n>=2&&n<=5);const target=(options.length?options:[...sums])[Math.floor(rng()*(options.length||sums.size))][0];return{board,target,solutions:hexSolutions(board,target)};}
function gcd(a,b){a=Math.abs(a);while(b){const t=b;b=a%b;a=t;}return a||1;}
function rational(n,d=1){if(d===0)return null;if(d<0){n=-n;d=-d;}const g=gcd(n,d);return{n:n/g,d:d/g};}
function apply(a,op,b){if(!a||!b)return null;if(op==='+')return rational(a.n*b.d+b.n*a.d,a.d*b.d);if(op==='−')return rational(a.n*b.d-b.n*a.d,a.d*b.d);if(op==='×')return rational(a.n*b.n,a.d*b.d);return rational(a.n*b.d,a.d*b.n);}
function pyramidValue(board,indices){if(indices.length!==3||new Set(indices).size!==3||indices.some(i=>!board[i]))return null;const [a,b,c]=indices.map(i=>board[i]);const x=rational(a.n),y=rational(b.n),z=rational(c.n);return ['+','−'].includes(b.op)&&['×','÷'].includes(c.op)?apply(x,b.op,apply(y,c.op,z)):apply(apply(x,b.op,y),c.op,z);}
function pyramidSolutions(board,target){const out=[];for(let a=0;a<10;a++)for(let b=0;b<10;b++)for(let c=0;c<10;c++){if(a===b||a===c||b===c)continue;const v=pyramidValue(board,[a,b,c]);if(v&&v.d===1&&v.n===target)out.push([a,b,c]);}return out;}
const broadcastPyramids=[{id:'s2-r1',target:10,board:[['×',7],['÷',5],['+',9],['−',5],['×',2],['+',2],['÷',8],['÷',3],['−',8],['×',3]],source:'시즌 2 · 수식 피라미드 1라운드'},{id:'s2-r7',target:19,board:[['−',1],['+',2],['+',3],['−',4],['×',5],['×',6],['×',7],['−',8],['×',9],['−',10]],source:'시즌 2 · 수식 피라미드 7라운드'}].map(p=>({...p,board:p.board.map(([op,n])=>({op,n}))}));
function pyramidPuzzle(rng=Math.random){for(let attempt=0;attempt<100;attempt++){
 const board=shuffle(Array.from({length:80},(_,i)=>({op:['+','−','×','÷'][Math.floor(i/20)],n:i%20+1})),rng).slice(0,10),hist=new Map();
 for(let a=0;a<10;a++)for(let b=0;b<10;b++)for(let c=0;c<10;c++){if(a===b||a===c||b===c)continue;const v=pyramidValue(board,[a,b,c]);if(v&&v.d===1&&v.n>=1&&v.n<=30){if(!hist.has(v.n))hist.set(v.n,[]);hist.get(v.n).push([a,b,c]);}}
 const candidates=[...hist].filter(([t,s])=>s.length>=2&&s.length<=9);if(candidates.length){const [target,solutions]=candidates[Math.floor(rng()*candidates.length)];return{board,target,solutions};}
 }const p=broadcastPyramids[0];return{...p,solutions:pyramidSolutions(p.board,p.target)};}
function expression(board,indices){return indices.map((i,k)=>(k?' '+board[i].op+' ':'')+board[i].n).join('');}
const api={shuffle,hexCells,hexLines,hexSolutions,hexPuzzle,pyramidValue,pyramidSolutions,pyramidPuzzle,broadcastPyramids,expression};if(typeof document==='undefined')module.exports=api;else root.DevilsEngine=api;
})(typeof window==='undefined'?globalThis:window);
