const A=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),E=require('../brain-arena/puzzles/engine.js');
let seed=824671;const rng=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const example={values:[2,3,7,5,11,13],count:3};A(E.validScale(example,[1,1,0,1,0,0]));A(!E.validScale(example,[0,0,1,1,0,0]));A(!E.validScale(example,[-1,2,0,1,0,1]));
const fingerprints=new Set();
for(let level=1;level<=5;level++)for(let i=0;i<80;i++){
 const p=E.scale(level,rng);A.equal(p.count,level+3);A.equal(new Set(p.values).size,6);for(const a of p.solutions){A(E.validScale(p,a));A.equal(a.slice(0,3).reduce((s,n,i)=>s+n*p.values[i],0),a.slice(3).reduce((s,n,i)=>s+n*p.values[i+3],0));A.equal(a.reduce((a,b)=>a+b),p.count);}fingerprints.add(p.values.join()+':'+p.count);
 const t=E.time(level,rng);A(E.validTime(t,t.sample));A.equal(new Set(t.cards).size,t.cards.length);A.deepEqual([...t.cards].sort((a,b)=>a-b),[...t.sample].sort((a,b)=>a-b));A(!E.validTime(t,[...t.sample.slice(1),t.sample[1]]));
 const b=E.blocks(level,rng);let total=0;for(let z=1;z<=level+2;z++)for(let x=0;x<b.n;x++)for(let y=0;y<b.n;y++)if(b.heights[x][y]>=z)total++;A.equal(total,b.answer);A.equal((E.blockSVG(b).match(/class="counted-cube"/g)||[]).length,total);A(!E.blockSVG(b).includes('NaN'));for(let x=0;x<b.n;x++)for(let y=0;y<b.n;y++){if(x)A(b.heights[x][y]<=b.heights[x-1][y]);if(y)A(b.heights[x][y]<=b.heights[x][y-1]);}const layer=1+i%(level+2);A.equal((E.blockSVG(b,layer).match(/class="counted-cube"/g)||[]).length,b.heights.flat().filter(h=>h>=layer).length);
}
A(fingerprints.size>380);
A(E.validTime({kind:0,cards:[1,2,3]},[2,1,3]));A(E.validTime({kind:0,cards:[1,2,3]},[1,2,3]));A(!E.validTime({kind:0,cards:[1,2,3]},[3,2,1]));
for(const [kind,a] of [[2,[22,50,3,25,2,15]],[3,[1,10,2,25,22,45]]])A(E.validTime({kind,cards:a},a));
const solid=n=>Array(9).fill(n);A.deepEqual(E.mixPixels([solid(1),solid(2),solid(4)]),solid(7));A.deepEqual(E.mixPixels([solid(1),solid(1),solid(0)]),solid(1));A.equal(E.mixPixels([solid(1),solid(1),solid(2)]),null);
A.deepEqual(E.rotatePixels([1,2,3,4,5,6,7,8,9]),[7,4,1,8,5,2,9,6,3]);
let rotated=Array.from({length:9},(_,i)=>i);for(let k=0;k<4;k++)rotated=E.rotatePixels(rotated);A.deepEqual(rotated,Array.from({length:9},(_,i)=>i));
for(let level=1;level<=5;level++)for(let i=0;i<100;i++){const p=E.art(level,rng);A.equal(p.cards.length,9);A(p.cards.every(a=>a.every(n=>[0,1,2,4].includes(n))));A(E.validArt(p,p.sample));A(!E.validArt(p,[p.sample[0],p.sample[0],p.sample[2]]));const layers=p.sample.map(s=>{const out=Array(9);for(let y=0;y<3;y++)for(let x=0;x<3;x++){let a=x,b=y;for(let k=0;k<s.rotation;k++)[a,b]=[2-b,a];out[b*3+a]=p.cards[s.id][y*3+x];}return out;});A.deepEqual(E.mixPixels(layers),p.target);}
A.deepEqual(E.rotatePattern([0,1,2,3]),[3,1,0,2]);A.deepEqual(E.patternSolutions([[3,0],[1,2]],[0,1,2,3]),[]);
for(let k=0;k<80;k++)for(const p of E.patternSet(rng)){
 const independent=[];for(let y=0;y<7;y++)for(let x=0;x<9;x++){const cell=[p.board[y][x],p.board[y][x+1],p.board[y+1][x],p.board[y+1][x+1]];let ok=false;for(let turns=0;turns<4;turns++){const rotated=Array(4);for(let a=0;a<4;a++){let xx=a%2,yy=Math.floor(a/2);for(let j=0;j<turns;j++)[xx,yy]=[1-yy,xx];rotated[yy*2+xx]=(p.target[a]+turns)%4;}if(rotated.join()===cell.join())ok=true;}if(ok)independent.push(y*10+x);}A.deepEqual(p.solutions,independent);A(p.solutions.length>=4);const a=p.solutions[0];A.equal(E.patternAction(p,[],a).delta,1);A.equal(E.patternAction(p,[a],a).delta,-1);A.equal(E.patternAction(p,[],'end').delta,-2);A.equal(E.patternAction(p,p.solutions,'end').delta,3);
}
console.log('PASS: 400 solvable balance/clock/block problems, alternative valid clocks, day rollovers, solid visible-top block layers; 500 colored-art witnesses with strict equal mixing and rotations; 240 pattern boards checked by independent geometric rotation and scoring.');

function runtime(kind,practice=true){
 let now=1000,tick,p,batches=[];const nodes=new Map();
 function node(){let id='';const n={value:'',textContent:'',innerHTML:'',hidden:false,disabled:false,children:[],attrs:{},style:{},className:'',append(...a){this.children.push(...a);},replaceChildren(...a){this.children=[...a];this.innerHTML='';},setAttribute(k,v){this.attrs[k]=v;},focus(){}};Object.defineProperty(n,'id',{get:()=>id,set:value=>{id=value;nodes.set(value,n);}});return n;}
 const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);},engine={...E};for(const name of ['scale','time','art','blocks'])engine[name]=level=>p=E[name](level,rng);engine.patternSet=()=>{const a=E.patternSet(rng);batches.push(a);return a;};class Clock extends Date{static now(){return now;}}
 const ctx=vm.createContext({ArenaPuzzles:engine,document:{body:{dataset:{puzzle:kind}},getElementById:get,createElement:node},Date:Clock,setInterval(fn){tick=fn;}});vm.runInContext(fs.readFileSync('brain-arena/puzzles/game.js','utf8'),ctx);get('mode').value=practice?'practice':'challenge';get('start').onclick();return{get,puzzle:()=>kind==='same-pattern'?batches.flat()[parseInt(get('round').textContent)-1]:p,advance(ms){now+=ms;tick();},input(value){get('answer').value=String(value);get('answer').oninput();},submit(){get('submit').onclick();}};
}
function solve(r,kind){const p=r.puzzle();if(kind==='scale-balance')p.sample.forEach((n,i)=>{for(let j=0;j<n;j++)r.get('scale-place-'+i).onclick();});else if(kind==='time-shift')p.sample.forEach(n=>r.get('time-card-'+n).onclick());else if(kind==='pixel-art')p.sample.forEach(s=>{r.get('art-select-'+s.id).onclick();for(let k=0;k<s.rotation;k++)r.get('art-rotate-'+s.id).onclick();});else r.input(p.answer);r.submit();}
for(const kind of ['scale-balance','time-shift','pixel-art','block-count']){
 const r=runtime(kind);for(let level=1;level<=5;level++){A.equal(r.puzzle().level,level);solve(r,kind);A.equal(+r.get('score').textContent,level);A.equal(r.get('review').hidden,false);A.equal(r.get('next').hidden,level===5);if(level<5)r.get('next').onclick();}A.match(r.get('resultTitle').textContent,/전체 5단계/);r.get('restart').onclick();A.equal(r.get('setup').hidden,false);
 const retry=runtime(kind);retry.get('giveup').onclick();A.equal(retry.get('review').hidden,false);retry.get('next').onclick();A.equal(retry.puzzle().level,1);
}
{
 const r=runtime('block-count',false);r.input(0);r.submit();A.equal(r.get('submit').disabled,true);r.advance(9999);A.equal(r.get('submit').disabled,true);r.advance(1);A.equal(r.get('submit').disabled,false);r.advance(110000);A.equal(r.get('review').hidden,false);A.match(r.get('resultTitle').textContent,/시간/);r.get('next').onclick();A.equal(r.puzzle().level,1);
 const t=runtime('time-shift'),p=t.puzzle();t.get('time-card-'+p.sample[0]).onclick();A.equal(t.get('time-card-'+p.sample[0]).disabled,true);t.get('time-slot-0').onclick();A.equal(t.get('time-card-'+p.sample[0]).disabled,false);solve(t,'time-shift');A.equal(t.get('review').hidden,false);
}
{
 const r=runtime('same-pattern'),p=r.puzzle();A.equal(r.get('levelProgress').hidden,true);r.get('pattern-cell-'+p.solutions[0]).onclick();r.submit();A.equal(+r.get('score').textContent,1);r.get('pattern-cell-'+p.solutions[0]).onclick();r.submit();A.equal(+r.get('score').textContent,0);r.advance(10000);r.get('declareEnd').onclick();A.equal(+r.get('score').textContent,-2);r.advance(10000);for(const i of p.solutions.slice(1)){r.get('pattern-cell-'+i).onclick();r.submit();}r.get('declareEnd').onclick();A.equal(r.get('review').hidden,false);A.equal(+r.get('score').textContent,p.solutions.length);const first=p.board;for(let round=2;round<=6;round++){r.get('next').onclick();A.equal(r.get('round').textContent,round+' / 6');if(round<4)A.deepEqual(r.puzzle().board,first);if(round===4)A.notDeepEqual(r.puzzle().board,first);r.get('giveup').onclick();}A.equal(r.get('next').hidden,true);
}
console.log('PASS: all four five-stage controllers clear and stop; forfeit retains difficulty; exact ten-second retry and two-minute expiry; time-card return; pattern duplicates/early-end penalties, valid completion, six rounds and board replacement at round four.');
