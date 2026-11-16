'use strict';
(function(root){
const OPS={R:{short:'↻90°',name:'오른쪽 90° 회전'},M:{short:'좌우',name:'좌우 반전'},I:{short:'흑백',name:'흑백 반전'},C:{short:'중앙',name:'중앙 네 칸 반전'}};
const LEVELS=[{name:'기본',parents:[-1,0,0,1,1,2,2],fixed:[0,3],ops:['R','M','I']},{name:'역추론',parents:[-1,0,0,1,2,3,3,4,4],fixed:[1,8],ops:['R','M','I','C']},{name:'복합',parents:[-1,0,0,1,1,2,2,3,4,5,6],fixed:[3,10],ops:['R','M','I','C']}];
const MOTIFS=['1110001001100100','1100100001110010','0100111001000111','1110101000100110','0110100011100010','1001110001100100','0010111001010100','1100010001110100','0110101000111000','1010111001000110'].map(s=>parseInt(s,2));
function rng(seed){let a=2166136261;for(const ch of String(seed))a=Math.imul(a^ch.charCodeAt(0),16777619);return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function shuffle(list,r=Math.random){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function transform(value,op){if(op==='I')return value^65535;if(op==='C')return value^1632;if(!['R','M'].includes(op))throw Error('Unknown operation');let out=0;for(let y=0;y<4;y++)for(let x=0;x<4;x++)if(value&(1<<(y*4+x))){const xx=op==='R'?3-y:3-x,yy=op==='R'?x:y;out|=1<<(yy*4+xx);}return out;}
function apply(value,ops){return ops.reduce(transform,value);}
const count=v=>{let n=0;for(let i=0;i<16;i++)n+=(v>>i)&1;return n;};
function make(seed,level=1){
 if(!LEVELS[level-1])throw Error('Unknown level');seed=String(seed).toUpperCase();const r=rng(seed+':'+level),config=LEVELS[level-1],n=config.parents.length;
 for(let attempt=0;attempt<500;attempt++){
  const values=[apply(MOTIFS[Math.floor(r()*MOTIFS.length)],shuffle(['R','M','I'],r).slice(0,Math.floor(r()*4)))],edges=[];let failed=false;
  for(let i=1;i<n;i++){
   const options=[];for(const a of config.ops)for(const b of level===3?config.ops:[null]){const ops=b?[a,b]:[a];if(a===b)continue;const value=apply(values[config.parents[i]],ops);if(!values.includes(value)&&count(value)>=4&&count(value)<=12)options.push({ops,value});}
   if(!options.length){failed=true;break;}const selected=options[Math.floor(r()*options.length)];values.push(selected.value);edges.push({from:config.parents[i],to:i,ops:selected.ops});
  }
  if(failed)continue;
  const free=Array.from({length:n},(_,i)=>i).filter(i=>!config.fixed.includes(i)),order=shuffle(free,r),tiles=order.map((node,i)=>({id:i,label:String.fromCharCode(65+i),value:values[node]})),solution=Array(n).fill(null);tiles.forEach((tile,i)=>solution[order[i]]=tile.id);
  const nodes=values.map((value,i)=>({index:i,fixed:config.fixed.includes(i),value:config.fixed.includes(i)?value:null}));return{seed,level,n,nodes,edges,tiles,solution};
 }throw Error('Could not generate distinct tiles');
}
function valid(p,placements){if(!Array.isArray(placements)||placements.length!==p.n)return false;const free=p.nodes.filter(n=>!n.fixed);if(free.some(n=>!Number.isInteger(placements[n.index])||!p.tiles.some(t=>t.id===placements[n.index])))return false;if(new Set(free.map(n=>placements[n.index])).size!==p.tiles.length)return false;const values=p.nodes.map(n=>n.fixed?n.value:p.tiles.find(t=>t.id===placements[n.index]).value);return p.edges.every(e=>apply(values[e.from],e.ops)===values[e.to]);}
function place(p,placements,node,id){if(!Number.isInteger(node)||!p.nodes[node]||p.nodes[node].fixed||id!==null&&!p.tiles.some(t=>t.id===id))return placements;const next=[...placements],old=next[node],source=id===null?-1:next.indexOf(id);if(source>=0)next[source]=old;next[node]=id;return next;}
function layout(p){const children=p.nodes.map(()=>[]);p.edges.forEach(e=>children[e.from].push(e.to));let cursor=0;const positions=Array(p.n);function walk(i,depth){const xs=children[i].map(c=>walk(c,depth+1)),x=xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:cursor++;positions[i]={x,y:depth};return x;}walk(0,0);return positions.map(pos=>({x:90+pos.x*(540/Math.max(1,cursor-1)),y:70+pos.y*155}));}
function tileSVG(value,label='타일'){let cells='';for(let y=0;y<4;y++)for(let x=0;x<4;x++)cells+='<rect x="'+(14+x*18)+'" y="'+(14+y*18)+'" width="18" height="18" fill="'+(value&(1<<(y*4+x))?'#182f42':'#edece3')+'" stroke="#c6c9c2" stroke-width=".6"/>';return '<svg viewBox="0 0 100 100" role="img" aria-label="'+label+'"><rect width="100" height="100" rx="7" fill="#f7f5ec"/><path d="M46 5H54" stroke="#7d8f8d" stroke-width="2"/>'+cells+'</svg>';}
const api={OPS,LEVELS,rng,shuffle,transform,apply,make,valid,place,layout,tileSVG};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TileConnect=api;
})(typeof window==='undefined'?globalThis:window);
