const fs=require('node:fs'),S=require('../university-strategy-assets/engine.js'),U=require('../university-assets/engine.js');
let seed=20261114;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
for(const [kind,maker] of [['maze',S.tripleMaze],['rainbow',S.rainbow],['ladder',U.ladder],['algorithm',U.algorithm],['weekday',U.weekdayStage]]){
 const pools=[];
 for(let level=1;level<=5;level++){
  const pool=[],seen=new Set();
  while(pool.length<12){const p=kind==='weekday'?maker(random,level,U.WEEKDAY_LEVELS[level-1][pool.length%U.WEEKDAY_LEVELS[level-1].length]):maker(random,level),signature=JSON.stringify(p);if(seen.has(signature))continue;seen.add(signature);p.id=kind+'-'+level+'-'+(pool.length+1);if(kind==='rainbow'){p.mediumCount=S.RAINBOW_LEVELS[level-1].medium;p.hardCount=S.RAINBOW_LEVELS[level-1].hard;}if(kind==='ladder')p.rises=p.edges.map(()=>p.tilt?U.int(5,9,random)*(random()<.5?-1:1):0);pool.push(p);}
  pools.push(pool);console.log(kind+' '+level+': '+pool.length+(kind==='maze'?' / mean '+pool.map(p=>p.meanPath).join(', '):''));
 }
 fs.writeFileSync('university-levels/'+kind+'-pool.js',"(typeof window==='undefined'?globalThis:window).UniversityLevelPools="+JSON.stringify({[kind]:pools})+';\n');
}
