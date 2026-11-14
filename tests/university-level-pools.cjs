const A=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),S=require('../university-strategy-assets/engine.js'),U=require('../university-assets/engine.js');
function load(kind){const c=vm.createContext({});vm.runInContext(fs.readFileSync('university-levels/'+kind+'-pool.js','utf8'),c);vm.runInContext(fs.readFileSync('university-levels/session.js','utf8'),c);return c;}
function paths(m){const out=new Map([[m.start,[m.start]]]),q=[m.start];for(let k=0;k<q.length;k++){const p=q[k],y=Math.floor(p/9),x=p%9;[[-1,0],[0,1],[1,0],[0,-1]].forEach(([dy,dx],d)=>{const row=y+dy,col=x+dx;if(row<0||row>8||col<0||col>8){A.equal(m.walls[p][d],-1);return;}const n=row*9+col;A.equal(m.walls[p][d],m.walls[n][(d+2)%4]);if(m.walls[p][d]===0&&!out.has(n)){out.set(n,[...out.get(p),n]);q.push(n);}});}A.equal(out.size,81);return out;}
for(const kind of ['maze','rainbow','ladder','algorithm','weekday']){
 const c=load(kind),pools=JSON.parse(JSON.stringify(c.UniversityLevelPools[kind]));A.equal(pools.length,5);const ids=new Set();let previousMax=0,previousComplexity=-1;
 for(let level=1;level<=5;level++){
  const pool=pools[level-1];A.equal(pool.length,12);A.equal(new Set(pool.map(p=>JSON.stringify({...p,id:null}))).size,12);
  const means=[];
  for(const p of pool){A(!ids.has(p.id));ids.add(p.id);A.equal(p.level,level);
   if(kind==='maze'){
    const routes=paths(p),goalPaths=p.goals.map(g=>routes.get(g.p)),mean=goalPaths.reduce((n,a)=>n+a.length-1,0)/5,config=S.MAZE_LEVELS[level-1];
    A.equal(p.meanPath,mean);A(mean>=config.min&&mean<=config.max);means.push(mean);A.equal(new Set(goalPaths.map(a=>a[1])).size,3);
    A.equal(p.goals.length,5);for(const g of p.goals){A.deepEqual(g.pattern,p.walls[g.p]);A.deepEqual(g.pattern.filter(x=>x>0).sort(),[1,2,3]);A.equal(p.walls.filter(w=>w.join()===g.pattern.join()).length,1);}
    for(let i=0;i<5;i++)for(let j=0;j<i;j++)A(goalPaths[i].filter(v=>v!==p.start&&goalPaths[j].includes(v)).length<=config.shared);
   }else if(kind==='rainbow'){
    A.equal(p.cells.length,49);A.equal(p.sequences.length,7);A.equal(new Set(p.sequences.map(s=>s.kind)).size,7);
    for(let col=0;col<7;col++)A.deepEqual(Array.from({length:7},(_,row)=>p.cells[row*7+col].color).sort(),[0,1,2,3,4,5,6]);
    p.cells.forEach((cell,i)=>A.equal(cell.value,p.sequences[cell.color].values[i%7]));
    let medium=0,hard=0;for(const s of p.sequences){const a=s.values;A.equal(a.length,7);A(a.every(n=>Number.isInteger(n)&&Math.abs(n)<1000000));if([1,2,5,9].includes(s.kind))medium++;if([3,6,7,8,10,11].includes(s.kind))hard++;
     const diff=a.slice(1).map((n,i)=>n-a[i]);
     if([12,17].includes(s.kind))A(diff.every(d=>d===diff[0]));
     if(s.kind===13)A(a.slice(1).every((n,i)=>n/a[i]===a[1]/a[0]));
     if(s.kind===14)A.deepEqual(diff,[2,3,4,5,6,7]);
     if(s.kind===16)A.deepEqual(diff,[3,5,7,9,11,13]);
     if(s.kind===0)A(diff.slice(1).every((d,i)=>d-diff[i]===diff[1]-diff[0]));
     if(s.kind===1)A(diff.every((d,i)=>d===diff[i%2]));
     if(s.kind===2)A(diff.slice(1).every((d,i)=>d===diff[i]*2));
     if(s.kind===3){for(let i=0;i<7;i++)A.equal(a[i],i%2?2**((i+1)/2):a[0]-1+(i/2+1)**2);}
     if(s.kind===4){const prime=n=>n>1&&Array.from({length:Math.max(0,Math.floor(Math.sqrt(n))-1)},(_,i)=>i+2).every(k=>n%k);A(a.every(prime));for(let i=1;i<7;i++)for(let n=a[i-1]+1;n<a[i];n++)A(!prime(n));}
     if(s.kind===5||s.kind===6)for(let i=1;i<7;i++){const digits=[...String(a[i-1])].map(Number),extra=digits.reduce((x,y)=>s.kind===5?x+y:x*y,s.kind===5?0:1);A.equal(a[i],a[i-1]+extra);}
     if(s.kind===7)for(let i=2;i<7;i++)A.equal(a[i],5*(a[i-1]-a[i-2]));
     if(s.kind===8)for(let i=1;i<7;i++)A.equal(a[i],a[i-1]*i/2);
     if(s.kind===9)for(let i=1;i<7;i++)A.equal(a[i],i%2?a[i-1]-i:a[i-1]*i);
     if(s.kind===10){const b=a.map(n=>Number(String(n).split('').reverse().join('')));A(b.slice(1).every((n,i)=>n-b[i]===3));}
     if(s.kind===11){const m=Number(s.rule.match(/^([0-9]+)/)[1]),text=Array.from({length:20},(_,i)=>m*(i+1)).join('');A.equal(a.map(n=>String(n).padStart(2,'0')).join(''),text.slice(0,14));}
    }
    A.equal(medium,p.mediumCount);A.equal(hard,p.hardCount);A.equal(medium,S.RAINBOW_LEVELS[level-1].medium);A.equal(hard,S.RAINBOW_LEVELS[level-1].hard);
   }else if(kind==='ladder'){
    const config=U.LADDER_LEVELS[level-1],n=config.size;A.equal(p.size,n);A.equal(p.edges.length,config.rungs);A.equal(p.owners.length,p.edges.length);p.owners.forEach((owner,i)=>A(owner===p.edges[i]||owner===p.edges[i]+1));A.equal(Math.abs(p.tilt),config.tilt);A.equal(new Set(p.edges).size,n-1);A(p.edges.slice(1).every((e,i)=>e!==p.edges[i]));
    const ends=Array.from({length:n},(_,i)=>i+1);p.edges.forEach(e=>{A(e>=0&&e<n-1);[ends[e],ends[e+1]]=[ends[e+1],ends[e]];});A.deepEqual(p.bottom,ends);A.deepEqual(p.answer,p.strips.map(v=>ends[v-1]));
    A.deepEqual(p.strips.slice().sort(),Array.from({length:n},(_,i)=>i+1));
    const gap=250/(p.edges.length+1);p.rises.forEach(rise=>A(Math.abs(rise)<gap));A(config.tilt?p.rises.every(r=>r!==0):p.rises.every(r=>r===0));
   }else if(kind==='algorithm'){
    const config=U.ALGORITHM_LEVELS[level-1];A.equal(p.grid.length,config.n);A(p.solutions.length);for(const sol of p.solutions){const run=U.walk(p.grid,p.start,sol.priority);A.equal(run.stop,p.end);A.deepEqual(run.path,sol.path);}A(p.solutions.some(sol=>sol.path.length>=config.min&&sol.path.length<=config.max));
   }else if(kind==='weekday'){
    A(p.modern);A(p.target>=15&&p.target<=205);A(U.WEEKDAY_LEVELS[level-1].includes(p.kind));A(U.validWeekday(p,p.sample));const expression=U.weekdayExpression(p,p.sample).replaceAll('×','*').replaceAll('÷','/').replaceAll('−','-').replaceAll('²','**2').replaceAll('^','**').replace(/(\([^()]*\)|\d+)!/g,'factorial($1)');const factorial=n=>Number.isInteger(n)&&n>=0&&n<=6?Array.from({length:n},(_,i)=>i+1).reduce((a,b)=>a*b,1):NaN;const value=vm.runInNewContext(expression,{factorial});A(Math.abs(value-p.target)<1e-8);A(U.weekdaySolutions(p).length>0);
   }
  }
  if(kind==='maze'){A(Math.min(...means)>previousMax);previousMax=Math.max(...means);}
  if(kind==='rainbow'){const c=S.RAINBOW_LEVELS[level-1],complexity=c.medium+c.hard*3;A(complexity>previousComplexity);previousComplexity=complexity;}
 }
 const run=c.UniversityLevels.create(kind,()=>.4);for(let level=1;level<=5;level++){const seen=new Set();for(let i=0;i<12;i++){const p=i?run.next():run.puzzle||run.draw();A.equal(run.level,level);A(!seen.has(p.id));seen.add(p.id);}const last=run.puzzle.id;run.next();A.notEqual(run.puzzle.id,last);A.equal(run.level,level);run.clear();if(level<5){run.next();A.equal(run.level,level+1);}else{A(run.complete);A.equal(run.next(),null);}}run.reset();A.equal(run.level,1);A.equal(run.puzzle,null);
 console.log('PASS: '+kind+' 5 × 12 checked problems; no repeats before pool exhaustion, forfeit stays at the same stage, clear advances, final completion and reset.');
}
