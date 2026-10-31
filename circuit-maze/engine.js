(function(root){
'use strict';
const configs={easy:{n:5,colors:4,gems:2,doors:28,par:60},normal:{n:7,colors:5,gems:3,doors:64,par:100},hard:{n:9,colors:6,gems:4,doors:116,par:160}};
const dirs=[[0,-1],[1,0],[0,1],[-1,0]],edgeKey=(a,b)=>a<b?a+':'+b:b+':'+a;
function neighbor(i,d,n){const x=i%n+dirs[d][0],y=(i/n|0)+dirs[d][1];return x<0||y<0||x>=n||y>=n?-1:y*n+x}
function rng(seed){let s=seed>>>0||1;return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296}}
function canMove(p,a,b,mask,ignore=false){if(!p.edges[a].includes(b))return false;const g=p.gates[edgeKey(a,b)];return ignore||!g||((mask>>g.color)&1)===g.phase}
function solve(p,ignore=false,locked=-1){const n=p.n*p.n,states=1<<p.colors,full=(1<<p.gems.length)-1,encode=(pos,mask,bits)=>(bits*states+mask)*n+pos,total=n*states*(full+1),seen=new Uint8Array(total),previous=new Int32Array(total).fill(-1),action=new Int8Array(total),q=new Int32Array(total);let head=0,tail=1;q[0]=0;seen[0]=1;
while(head<tail){const id=q[head++],pos=id%n,mask=(id/n|0)%states,bits=(id/n/states|0);if(pos===p.end&&bits===full){const actions=[];let x=id;while(previous[x]>=0){actions.push(action[x]);x=previous[x]}return actions.reverse()}
const add=(v,m,b,a)=>{const next=encode(v,m,b);if(!seen[next]){seen[next]=1;previous[next]=id;action[next]=a;q[tail++]=next}};
for(let d=0;d<4;d++){const v=neighbor(pos,d,p.n);if(v<0||!canMove(p,pos,v,mask,ignore))continue;const g=p.gems.indexOf(v);add(v,mask,bits|(g<0?0:1<<g),d)}if(!ignore&&p.switches[pos]!==undefined&&p.switches[pos]!==locked)add(pos,mask^(1<<p.switches[pos]),bits,4);
}return null}
function build(level,random){
const c=configs[level],n=c.n,edges=Array.from({length:n*n},()=>[]);
for(let a=0;a<n*n;a++)for(const d of [1,2]){const b=neighbor(a,d,n);if(b>=0){edges[a].push(b);edges[b].push(a)}}
const shuffle=arr=>{for(let i=arr.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr};
const cells=shuffle(Array.from({length:n*n-2},(_,i)=>i+1)),switches={1:0};
const protectedCells=cells.filter(i=>((i%n)+(i/n|0))%2===0);
for(let color=1;color<c.colors;color++)switches[protectedCells.pop()]=color;
const gems=cells.filter(i=>switches[i]===undefined).slice(0,c.gems),gates={};
// Every circuit unlocks access to the next circuit; the final circuit guards the exit.
for(const [cell,color] of [...Object.entries(switches).filter(([v,c])=>c>0).map(([v,c])=>[Number(v),c-1]),[n*n-1,c.colors-1]])
for(const b of edges[cell])gates[edgeKey(cell,b)]={color,phase:1};
const links=shuffle(edges.flatMap((bs,a)=>bs.filter(b=>b>a).map(b=>[a,b])).filter(([a,b])=>!gates[edgeKey(a,b)]&&!(a===0&&b===1)));
let k=0;while(Object.keys(gates).length<c.doors){const [a,b]=links.pop();gates[edgeKey(a,b)]={color:k%c.colors,phase:(Math.floor(k/c.colors)%2)};k++}
return {...c,level,edges,gates,switches,gems,end:n*n-1}}
function generate(level,seed=Math.floor(Math.random()*4294967295)){
if(!configs[level])throw Error('Unknown difficulty');const random=rng(seed);
for(let attempt=0;attempt<1500;attempt++){
const p=build(level,random),solution=solve(p);if(!solution)continue;
let pos=0,used=0,toggles=0;for(const d of solution){if(d===4){used|=1<<p.switches[pos];toggles++}else pos=neighbor(pos,d,p.n)}
if(used!==(1<<p.colors)-1||toggles<p.colors+1)continue;
p.optimal=solution.length;p.seed=seed;p.id=(seed>>>0).toString(36).toUpperCase();p.attempts=attempt+1;return p;
}throw Error('미로 생성에 실패했습니다. 다시 시작해 주세요.')}
function score(level,seconds){return Math.max(0,Math.round(10000*configs[level].par/(configs[level].par+Math.max(0,seconds))))}
const api={configs,dirs,edgeKey,neighbor,canMove,solve,generate,score};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CircuitMaze=api;
})(typeof globalThis==='undefined'?this:globalThis);
