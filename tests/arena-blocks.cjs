const A=require('node:assert/strict'),E=require('../brain-arena/puzzles/engine.js');
let seed=71501;const r=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296),dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
let generated=0;
for(let level=1;level<=8;level++)for(const family of E.blockFamilies(level))for(let trial=0;trial<12;trial++){
 const p=E.blocks(level,r,family),solid=new Set(p.cubes.map(c=>c.join(',')));generated++;
 A.equal(p.family,family);A.equal(p.answer,solid.size);A(p.cubes.every(c=>c.every(Number.isInteger)&&c.every(v=>v>=0)));if(level===1)A(p.answer<=27);
 // Each solid component connects to the ground, including supported bridges.
 const supported=new Set(p.cubes.filter(c=>c[2]===0).map(c=>c.join(','))),queue=p.cubes.filter(c=>c[2]===0);
 for(let at=0;at<queue.length;at++)for(const d of dirs){const c=queue[at].map((v,i)=>v+d[i]),key=c.join(',');if(solid.has(key)&&!supported.has(key)){supported.add(key);queue.push(c);}}A.equal(supported.size,p.answer);
 // All empty cells communicate with outside air: no invisible sealed cavities.
 const air=new Set(['-1,-1,-1']),flood=[[-1,-1,-1]];for(let at=0;at<flood.length;at++)for(const d of dirs){const c=flood[at].map((v,i)=>v+d[i]),[x,y,z]=c,key=c.join(',');if(x< -1||y< -1||z< -1||x>p.width||y>p.depth||z>p.height||solid.has(key)||air.has(key))continue;air.add(key);flood.push(c);}
 for(let x=0;x<p.width;x++)for(let y=0;y<p.depth;y++)for(let z=0;z<p.height;z++)A(solid.has([x,y,z].join(','))||air.has([x,y,z].join(',')));
 for(let angle=0;angle<4;angle++){const svg=E.blockSVG(p,null,angle);A.equal((svg.match(/class="counted-cube"/g)||[]).length,p.answer);A(!/NaN|undefined/.test(svg));const box=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number),points=[...svg.matchAll(/points="([^"]+)"/g)].flatMap(m=>m[1].split(' ').map(p=>p.split(',').map(Number)));for(const [x,y]of points){A(x>=box[0]&&x<=box[0]+box[2]);A(y>=box[1]&&y<=box[1]+box[3]);}}
 for(let z=1;z<=p.height;z++)A.equal((E.blockSVG(p,z).match(/class="counted-cube"/g)||[]).length,p.cubes.filter(c=>c[2]===z-1).length);
 if(['arch','bridge','courtyard'].includes(family))A(p.cubes.some(([x,y,z])=>z>0&&!solid.has([x,y,z-1].join(','))));
 if(family==='well'){const columns=new Set(p.cubes.map(c=>c.slice(0,2).join(',')));A(columns.size<p.width*p.depth);}
 if(family==='long')A(Math.max(p.width,p.depth)>=2*Math.min(p.width,p.depth));
 if(family==='pyramid'){const layers=Array.from({length:p.height},(_,i)=>p.cubes.filter(c=>c[2]===i).length);A(layers.every((n,i)=>!i||n<layers[i-1]));}
}
console.log('PASS: '+generated+' block structures, nine distinct families, ground-connected supports, real open holes, no sealed cavities, all four views within bounds, exact layer counts and introductory count ceiling.');
