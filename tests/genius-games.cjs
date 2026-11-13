const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const E=require('../genius-assets/engine.js'),P=require('../memory-poker/game.js');
assert.equal(E.haps(E.setDeck()).length,117);
let seed=112213;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(let n=0;n<100;n++){
 const board=E.shuffle(E.setDeck(),rng).slice(0,9),other=[];
 for(let a=0;a<9;a++)for(let b=a+1;b<9;b++)for(let c=b+1;c<9;c++)if([0,1,2].every(p=>(board[a][p]+board[b][p]+board[c][p])%3===0))other.push([a,b,c]);
 assert.deepEqual(E.haps(board),other);const nums=E.numberBoard(rng),sol=E.numberSolutions(nums);assert.equal(sol.size,56);for(const [target,answers] of sol)for(const a of answers){assert.equal(new Set(a).size,3);assert.equal(E.calculate(...a.map(i=>nums[i])),target);}
}
assert.equal(E.pictureStep(12,true),13);assert.equal(E.pictureStep(1,false),0);assert.equal(E.pictureStep(19,true),20);
let triple=0;for(let t=1;t<=8;t++)for(let n=0;n<50;n++){const d=P.deal(rng,t);assert.equal(new Set([...d.cards,...d.shared].map(c=>c.r+':'+c.s)).size,19);let best=0;for(let a=0;a<16;a++)for(let b=a+1;b<16;b++)best=Math.max(best,P.score([...d.shared,d.cards[a],d.cards[b]]));assert.equal(Math.floor(best/15**5),t);if(Array.from({length:13},(_,i)=>i+2).some(r=>d.cards.filter(c=>c.r===r).length>=3))triple++;}assert(triple>30);
function node(){return{hidden:false,disabled:false,value:'broadcast',textContent:'',innerHTML:'',children:[],style:{},attrs:{},className:'',classList:{add(){}},setAttribute(k,v){this.attrs[k]=v;},append(...n){this.children.push(...n);},replaceChildren(){this.children=[];this.innerHTML='';},focus(){}};}
function runtime(mode){const dom=new Map(),get=id=>{if(!dom.has(id))dom.set(id,node());return dom.get(id);};let now=0,tick;const m=Object.create(Math);m.random=()=>0;const document={body:{dataset:{game:mode}},title:'',getElementById:get,createElement:node};const context=vm.createContext({document,GeniusEngine:{...E,shuffle:items=>E.shuffle(items,()=>0)},Math:m,Date:{now:()=>now},setInterval(fn){tick=fn;}});vm.runInContext(fs.readFileSync('genius-assets/game.js','utf8'),context);return{get,advance(ms){now+=ms;tick();}};}
{
 const {get,advance}=runtime('same-number');get('start').onclick();const values=get('board').children.map(b=>{const text=b.innerHTML;return /^\d+$/.test(text)?+text:text;});assert.equal(get('board').children.length,16);advance(5001);const target=+get('target').textContent,solution=E.numberSolutions(values).get(target)[0];get('buzz').onclick();solution.forEach(i=>get('board').children[i].onclick());get('submit').onclick();assert.equal(+get('score').textContent,1);assert.match(get('resultTitle').textContent,/정답/);get('next').onclick();get('buzz').onclick();advance(5001);assert.match(get('resultText').textContent,/시간/);assert(get('solutions').children.length>0);get('next').onclick();get('giveup').onclick();assert.match(get('resultText').textContent,/포기/);
}
{
 const {get}=runtime('same-picture');get('start').onclick();const board=E.shuffle(Array.from({length:16},(_,i)=>i),()=>0),belt=E.shuffle(Array.from({length:48},(_,i)=>i%16),()=>0).slice(0,20);const i=board.indexOf(belt[12]);get('board').children[i].onclick();assert.equal(get('progress').textContent,'13 / 20');get('board').children[0].onclick();get('next').onclick();get('giveup').onclick();assert.equal(get('board').children.length,16);assert.match(get('resultTitle').textContent,/공개/);
}
{
 const {get}=runtime('gyul-hap');get('start').onclick();const sets=E.haps(E.shuffle(E.setDeck(),()=>0).slice(0,9));assert(sets.length>0);sets[0].forEach(i=>get('board').children[i].onclick());get('hap').onclick();assert.equal(+get('score').textContent,1);sets[0].forEach(i=>get('board').children[i].onclick());get('hap').onclick();assert.equal(+get('score').textContent,0);get('gyul').onclick();assert.equal(+get('score').textContent,-1);get('giveup').onclick();assert.equal(get('solutions').children.length,sets.length);get('solutions').children[0].onclick();
}
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('brain-arena/catalog.js','utf8'),ctx);const {games,categories}=ctx.window.BrainArenaCatalog;assert.equal(games.length,15);assert.equal(games.filter(g=>g.category==='genius').length,3);assert.equal(new Set(games.map(g=>g.id)).size,15);for(const g of games){assert(categories.some(c=>c.id===g.category));const s=fs.readFileSync(g.id+'/index.html','utf8');assert(s.includes('href="/brain-arena/?v='));}
console.log('PASS: 117 full-deck sets, 100 independent set enumerations, 56 arithmetic targets on 100 boards; UI scoring/timers/reviews for all 3 games; 400 poker deals, '+triple+' with 3+ copies; 15 catalog entries and logo links.');
