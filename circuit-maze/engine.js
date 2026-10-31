(function(root){
'use strict';
const configs={easy:{n:5,colors:2,gems:2,par:60},normal:{n:7,colors:3,gems:3,par:100},hard:{n:9,colors:3,gems:3,par:160}};
const dirs=[[0,-1],[1,0],[0,1],[-1,0]],edgeKey=(a,b)=>a<b?a+':'+b:b+':'+a;
function neighbor(i,d,n){const x=i%n+dirs[d][0],y=(i/n|0)+dirs[d][1];return x<0||y<0||x>=n||y>=n?-1:y*n+x}
function rng(seed){let s=seed>>>0||1;return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296}}
function canMove(p,a,b,mask,ignore=false){if(!p.edges[a].includes(b))return false;const g=p.gates[edgeKey(a,b)];return ignore||!g||((mask>>g.color)&1)===g.phase}
function solve(p,ignore=false){const n=p.n*p.n,states=1<<p.colors,full=(1<<p.gems.length)-1,encode=(pos,mask,bits)=>(bits*states+mask)*n+pos,total=n*states*(full+1),seen=new Uint8Array(total),previous=new Int32Array(total).fill(-1),action=new Int8Array(total),q=new Int32Array(total);let head=0,tail=1;q[0]=0;seen[0]=1;
while(head<tail){const id=q[head++],pos=id%n,mask=(id/n|0)%states,bits=(id/n/states|0);if(pos===p.end&&bits===full){const actions=[];let x=id;while(previous[x]>=0){actions.push(action[x]);x=previous[x]}return actions.reverse()}
const add=(v,m,b,a)=>{const next=encode(v,m,b);if(!seen[next]){seen[next]=1;previous[next]=id;action[next]=a;q[tail++]=next}};
for(let d=0;d<4;d++){const v=neighbor(pos,d,p.n);if(v<0||!canMove(p,pos,v,mask,ignore))continue;const g=p.gems.indexOf(v);add(v,mask,bits|(g<0?0:1<<g),d)}if(!ignore&&p.switches[pos]!==undefined)add(pos,mask^(1<<p.switches[pos]),bits,4);
}return null}
function build(level,random){const c=configs[level],n=c.n,edges=Array.from({length:n*n},()=>[]),visited=new Set([0]),stack=[0];const join=(a,b)=>{edges[a].push(b);edges[b].push(a)};while(stack.length){const a=stack.at(-1),opts=[0,1,2,3].map(d=>neighbor(a,d,n)).filter(b=>b>=0&&!visited.has(b));if(!opts.length){stack.pop();continue}const b=opts[Math.floor(random()*opts.length)];join(a,b);visited.add(b);stack.push(b)}for(let a=0;a<n*n;a++)for(const d of [1,2]){const b=neighbor(a,d,n);if(b>=0&&!edges[a].includes(b)&&random()<.10)join(a,b)}
const shuffle=arr=>{for(let i=arr.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr};const cells=shuffle(Array.from({length:n*n-2},(_,i)=>i+1)),switches={};for(let color=0;color<c.colors;color++)switches[cells.pop()]=color;const gems=cells.splice(0,c.gems),links=shuffle(edges.flatMap((bs,a)=>bs.filter(b=>b>a).map(b=>[a,b]))),gates={};for(let color=0;color<c.colors;color++)for(let phase=0;phase<2;phase++){const [a,b]=links.pop();gates[edgeKey(a,b)]={color,phase}}return {...c,level,edges,gates,switches,gems,end:n*n-1}}
function generate(level,seed=Math.floor(Math.random()*4294967295)){if(!configs[level])throw Error('Unknown difficulty');const random=rng(seed);for(let attempt=0;attempt<500;attempt++){const p=build(level,random),solution=solve(p);if(!solution)continue;const toggles=solution.filter(d=>d===4).length;const plain=solve(p,true);if(toggles>=p.colors&&solution.length>=plain.length+4){p.optimal=solution.length;p.seed=seed;p.id=(seed>>>0).toString(36).toUpperCase();return p}}throw Error('미로 생성에 실패했습니다. 다시 시작해 주세요.')}
function score(level,seconds){return Math.max(0,Math.round(10000*configs[level].par/(configs[level].par+Math.max(0,seconds))))}
const api={configs,dirs,edgeKey,neighbor,canMove,solve,generate,score};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CircuitMaze=api;
})(typeof globalThis==='undefined'?this:globalThis);
