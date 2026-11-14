const A=require('node:assert/strict'),E=require('../university-strategy-assets/engine.js');let seed=7718;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(let i=0;i<50;i++){const m=E.tripleMaze(rng);A.equal(m.walls.length,81);for(let p=0;p<81;p++)for(const q of E.adjacent(p,9))A.equal(m.walls[p][q.d],m.walls[q.p][(q.d+2)%4]);const seen=new Set([m.start]),queue=[m.start];for(let k=0;k<queue.length;k++)for(const q of E.adjacent(queue[k],9))if(!m.walls[queue[k]][q.d]&&!seen.has(q.p)){seen.add(q.p);queue.push(q.p);}A.equal(seen.size,81);for(const g of m.goals){A.deepEqual(g.pattern.filter(x=>x>0).sort(),[1,2,3]);A.equal(m.walls.filter(w=>w.join()===g.pattern.join()).length,1);const path=E.route(m.walls,m.start,g.p);A(path.length>1);let previous=null,position=m.start;for(const next of path.slice(1)){const dir=E.adjacent(position,9).find(q=>q.p===next).d,move=E.mazeStep(m,position,previous,dir);A(move.ok);previous=position;position=move.position;}A.equal(position,g.p);const back=E.adjacent(position,9).find(q=>q.p===previous).d;A.equal(E.mazeStep(m,position,previous,back).reason,'reverse');}}
{
 let s=E.newGomoku();A.equal(E.gomokuPlace(s,40,4),null);s=E.gomokuPlace(s,40,3);A.equal(s.stock[0][3],3);A.equal(s.turn,1);A.equal(E.gomokuPlace(s,40,1),null);const board=Array(81).fill(null),stones=[[0,4],[0,2],[0,5],[0,3],[1,2],[1,1],[0,5]];stones.forEach(([side,value],i)=>board[36+i+1]={side,value});A.equal(E.sumWins(board,40)[0].side,0);A.equal(E.sumWins(board,40)[0].cells.length,7);board[36]={side:0,value:1};A.equal(E.sumWins(board,40).length,0);board[36]={side:1,value:1};A.equal(E.sumWins(board,40).length,0);
 const win=E.newGomoku();[5,5,5].forEach((value,i)=>win.board[36+i]={side:1,value});win.turn=1;win.moves=3;const m=E.gomokuAI(win,rng);A.equal(E.gomokuPlace(win,m.p,m.value).winner,1);
 let game=E.newGomoku();for(let k=0;k<20&&game.winner===null&&!game.draw;k++){const move=E.gomokuAI(game,rng);A(move);const next=E.gomokuPlace(game,move.p,move.value);A(next);A.equal(next.board.filter(Boolean).length,k+1);for(let side=0;side<2;side++)for(let value=1;value<=5;value++)A.equal(next.stock[side][value]+next.board.filter(c=>c?.side===side&&c.value===value).length,4);game=next;}
}
function independentSlide(s,p,d){const x0=p%7,y0=Math.floor(p/7),dirs=[[-1,0],[0,1],[1,0],[0,-1]];let x=x0,y=y0;for(;;){const ny=y+dirs[d][0],nx=x+dirs[d][1],q=ny*7+nx;if(nx<0||nx>6||ny<0||ny>6||q===21||q===27||s.board[q])break;x=nx;y=ny;}return y*7+x;}
for(let i=0;i<60;i++){let s=E.newExit(rng);for(let side=0;side<2;side++){A.equal(s.board.filter(c=>c?.side===side).length,6);A.deepEqual(s.board.filter(c=>c?.side===side).map(c=>c.value).sort(),[1,2,3,4,5,6]);}for(const m of E.exitMoves(s)){const end=independentSlide(s,m.p,m.d);A.equal(m.next.lastMove.to,end);A.notEqual(end,m.p);A.equal(m.next.escaped[0],end===24?1:0);}const ai=E.exitAI(s,rng);A(ai);A.equal(independentSlide(s,ai.p,ai.d),ai.next.lastMove.to);}
{
 const s={...E.newExit(rng),board:Array(49).fill(null)};s.board[3]={side:0,value:1};s.board[38]={side:1,value:1};const pass=E.exitSlide(s,3,2);A.equal(pass.lastMove.to,31);A.equal(pass.escaped[0],0);s.board[38]=null;s.board[31]={side:1,value:1};const out=E.exitSlide(s,3,2);A.equal(out.lastMove.to,24);A.equal(out.escaped[0],1);A.equal(out.board[24],null);A.equal(E.exitSlide({...s,escaped:[1,0]},3,2).winner,0);
}
for(let i=0;i<100;i++){const p=E.rainbow(rng);A.equal(new Set(p.sequences.map(s=>s.kind)).size,7);for(let col=0;col<7;col++){const colors=[];for(let row=0;row<7;row++){const c=p.cells[row*7+col];colors.push(c.color);A.equal(c.value,p.sequences[c.color].values[col]);A(Number.isInteger(c.value));}A.deepEqual(colors.sort(),[0,1,2,3,4,5,6]);}}
for(let kind=0;kind<12;kind++){const s=E.sequence(kind,rng);A.equal(s.values.length,7);A(s.values.every(Number.isInteger));if(kind===7)for(let k=2;k<7;k++)A.equal(s.values[k],(s.values[k-1]-s.values[k-2])*5);if(kind===5)for(let k=1;k<7;k++)A.equal(s.values[k],s.values[k-1]+[...String(s.values[k-1])].reduce((a,c)=>a+ +c,0));}
{
 let cube=E.newRPS(1,rng).orientation;const vectors=[[0,0,-1],[0,1,0],[-1,0,0],[1,0,0],[0,0,1],[0,-1,0]],names=['north','top','west','east','south','bottom'],expected=[[0,0,-1],[0,1,0],[-1,0,0],[1,0,0],[0,0,1],[0,-1,0]];let current=vectors;
 for(let k=0;k<100;k++){const d=E.int(0,3,rng);cube=E.roll(cube,d);current=current.map(([x,y,z])=>d===0?[x,z,-y]:d===2?[x,-z,y]:d===1?[y,-x,z]:[-y,x,z]);expected.forEach((v,i)=>A.equal(cube[names[i]],current.findIndex(q=>q.every((a,j)=>a===v[j]))));A.equal(new Set(Object.values(cube)).size,6);}
 A.equal(E.rpsResult(0,2),1);A.equal(E.rpsResult(1,0),1);A.equal(E.rpsResult(2,1),1);A.equal(E.rpsResult(2,0),-1);A.equal(E.rpsResult(1,1),0);
 for(let round=1;round<=5;round++){const s=E.newRPS(round,rng);for(const v of [0,1,2])A.equal(s.net.filter(x=>x===v).length,2);s.remaining=s.budget;A.equal(E.rpsNext(s,0),null);const first=E.rpsStep(s,2);A.equal(first.position,3);A.equal(E.rpsNext(first,0),null);const options=E.rpsPaths(s);A(options.length);for(const o of options){A.equal(o.dirs.length,s.budget);A.equal(o.state.remaining,0);A.equal(o.result,E.rpsResult(o.state.net[o.state.orientation.bottom],o.state.floor[o.state.position]));for(let k=2;k<o.state.path.length;k++)A.notEqual(o.state.path[k],o.state.path[k-2]);}const ai=E.rpsAI(s);A(options.some(p=>p.dirs.join()===ai.dirs.join()));}
}
console.log('PASS: 50 connected unique-target mazes; exact maximal-line 16 and legal Gomoku AI; 60 independently checked sliding positions and exact-stop exits; 100 colored sequence boards and complex recurrences; 100 physical cube rotations and legal AI paths.');
const fs=require('node:fs'),vm=require('node:vm');
function node(){return {hidden:false,disabled:false,value:'challenge',textContent:'',innerHTML:'',children:[],attrs:{},className:'',style:{setProperty(k,v){this[k]=v;}},setAttribute(k,v){this.attrs[k]=v;},append(...a){this.children.push(...a);},replaceChildren(...a){this.children=[...a];this.innerHTML='';}};}
function runtime(game,practice=true){let now=1000,tick,p,progression=null,timers=[];const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);},engine={...E};for(const key of ['tripleMaze','newGomoku','newExit','rainbow','newRPS'])engine[key]=(...args)=>p=E[key](...args.slice(0,key==='newRPS'?1:0),rng);class D extends Date{static now(){return now;}}const ctx=vm.createContext({UniversityStrategy:engine,document:{body:{dataset:{game}},title:'',getElementById:get,createElement:node,addEventListener(){}},Date:D,setInterval(fn){tick=fn;},setTimeout(fn,ms){timers.push({fn,at:now+ms});}});if(['triple-maze','rainbow-sequence'].includes(game)){const kind=game==='triple-maze'?'maze':'rainbow';vm.runInContext(fs.readFileSync('university-levels/'+kind+'-pool.js','utf8'),ctx);vm.runInContext(fs.readFileSync('university-levels/session.js','utf8'),ctx);const create=ctx.UniversityLevels.create;ctx.UniversityLevels.create=k=>progression=create(k,rng);}vm.runInContext(fs.readFileSync('university-strategy-assets/game.js','utf8'),ctx);get('mode').value=practice?'practice':'challenge';get('start').onclick();return {get,puzzle:()=>progression?.puzzle||p,progression:()=>progression,grid(){return get('board').children.find(c=>c.className?.includes('strategy-grid'));},at(p,n){return this.grid().children[(Math.floor(p/n)+1)*(n+1)+p%n+1];},arrow(d){get('actions').children[0].children.find(b=>b.attrs['aria-label']===['위','오른쪽','아래','왼쪽'][d]+'로 이동').onclick();},advance(ms){const end=now+ms;while(timers.some(t=>t.at<=end)){timers.sort((a,b)=>a.at-b.at);const t=timers.shift();now=t.at;t.fn();tick();}now=end;tick();}};}
{
 const r=runtime('triple-maze');const p=r.puzzle();for(let goal=0;goal<2;goal++){r.get('actions').children[0].onclick();const path=E.route(p.walls,p.start,p.goals[goal].p);for(let i=1;i<path.length;i++){const d=E.adjacent(path[i-1],9).find(q=>q.p===path[i]).d;r.arrow(d);}r.get('actions').children[1].children[goal].onclick();if(goal===0){A.equal(r.get('round').textContent,'1 / 2');r.get('actions').children[0].onclick();}}A.match(r.get('resultTitle').textContent,/1단계 클리어/);A.equal(r.get('review').hidden,false);
}
{
 const r=runtime('sum-difference-gomoku');r.at(40,9).onclick();r.advance(1000);A(r.get('log').textContent.includes('컴퓨터'));A.equal(r.grid().children.filter(b=>b.innerHTML.includes('class="stone')).length,2);r.get('giveup').onclick();A.match(r.get('resultTitle').textContent,/컴퓨터/);r.get('restart').onclick();r.advance(1000);A.equal(r.get('review').hidden,true);
}
{
 const r=runtime('exit-strategy-2'),p=r.puzzle(),move=E.exitMoves(p)[0];r.at(move.p,7).onclick();r.arrow(move.d);r.advance(1000);A(r.get('log').textContent.includes('컴퓨터'));A.equal(r.get('review').hidden,true);
}
{
 const r=runtime('rainbow-sequence'),p=r.puzzle();r.get('actions').children[0].onclick();r.at(0,7).onclick();r.get('rainbowAnswer').value=String(p.cells[0].value);r.get('inputArea').children[0].onsubmit({preventDefault(){}});A.equal(+r.get('score').textContent,1);r.at(6,7).onclick();r.get('rainbowAnswer').value=String(p.cells[6].value);r.get('inputArea').children[0].onsubmit({preventDefault(){}});A.equal(+r.get('score').textContent,5);r.get('giveup').onclick();A.equal(r.get('solution').children.length,7);r.get('next').onclick();A.equal(r.progression().level,1);A.equal(r.get('round').textContent,'0 / 49');A.equal(+r.get('score').textContent,5);
}
{
 const r=runtime('rotating-rps'),p=r.puzzle();r.get('actions').children[0].onclick();const path=E.rpsPaths(p)[0];path.dirs.forEach(d=>r.arrow(d));A(r.get('actions').children[0].textContent.includes('컴퓨터'));r.get('actions').children[0].onclick();r.advance(4000);A(r.get('log').textContent.includes('컴퓨터'));A(r.get('actions').children[0].textContent.includes('내 차례'));r.get('giveup').onclick();r.get('restart').onclick();r.advance(2000);A.equal(r.get('review').hidden,true);
}
console.log('PASS: playable controller flows for five games, two maze goals, actual AI replies, rainbow regular/hidden scoring and round persistence, shared RPS turn animation and cancellation after restart.');
{
 const r=runtime('triple-maze'),first=r.puzzle().id;r.get('giveup').onclick();A.equal(r.progression().level,1);r.get('next').onclick();A.equal(r.progression().level,1);A.notEqual(r.puzzle().id,first);
 for(let level=1;level<=8;level++){
  const p=r.puzzle();A.equal(p.level,level);
  for(let goal=0;goal<2;goal++){
   r.get('actions').children[0].onclick();const path=E.route(p.walls,p.start,p.goals[goal].p);
   for(let i=1;i<path.length;i++)r.arrow(E.adjacent(path[i-1],9).find(q=>q.p===path[i]).d);
   r.get('actions').children[1].children[goal].onclick();
   if(goal===0){A.equal(r.get('review').hidden,true);r.get('actions').children[0].onclick();}
  }
  A.equal(r.get('review').hidden,false);A(r.progression().cleared);A.equal(r.get('next').hidden,level===8);
  if(level<8){A.match(r.get('next').textContent,new RegExp((level+1)+'단계'));r.get('next').onclick();}
 }
 A.match(r.get('resultTitle').textContent,/전체 단계 클리어/);r.get('restart').onclick();A.equal(r.progression().level,1);
}
{
 const r=runtime('rainbow-sequence');let first=r.puzzle().id;r.get('actions').children[0].onclick();r.at(0,7).onclick();r.get('rainbowAnswer').value=String(r.puzzle().cells[0].value+1);r.get('inputArea').children[0].onsubmit({preventDefault(){}});A.equal(r.progression().level,1);r.advance(10000);A.equal(r.puzzle().id,first);r.get('giveup').onclick();r.get('next').onclick();A.equal(r.progression().level,1);A.notEqual(r.puzzle().id,first);
 for(let level=1;level<=8;level++){
  const p=r.puzzle();A.equal(p.level,level);r.get('actions').children[0].onclick();
  for(let i=0;i<49;i++){r.at(i,7).onclick();r.get('rainbowAnswer').value=String(p.cells[i].value);r.get('inputArea').children[0].onsubmit({preventDefault(){}});}
  A.equal(r.get('review').hidden,false);A(r.progression().cleared);A.equal(+r.get('score').textContent,level*70);A.equal(r.get('next').hidden,level===8);if(level<8)r.get('next').onclick();
 }
 A.match(r.get('resultTitle').textContent,/전체 단계 클리어/);
}
console.log('PASS: complete eight-stage journeys for Maze and Rainbow; forfeit and wrong-answer retries never advance; 392 rainbow cells scored; final completion stops advancement.');
