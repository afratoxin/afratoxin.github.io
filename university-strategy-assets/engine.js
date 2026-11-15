'use strict';
(function(root){
const shuffle=(a,r=Math.random)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;},int=(a,b,r=Math.random)=>a+Math.floor(r()*(b-a+1)),pick=(a,r=Math.random)=>a[int(0,a.length-1,r)];
const DIRS=[[-1,0],[0,1],[1,0],[0,-1]],opposite=d=>(d+2)%4;
function adjacent(p,n){const y=Math.floor(p/n),x=p%n;return DIRS.map(([dy,dx],d)=>({p:(y+dy)*n+x+dx,d})).filter(({p,d})=>{const [dy,dx]=DIRS[d];return y+dy>=0&&y+dy<n&&x+dx>=0&&x+dx<n;});}
function route(walls,start,end){const queue=[start],previous=new Map([[start,null]]);for(let i=0;i<queue.length;i++){const p=queue[i];if(p===end){const path=[];for(let at=p;at!==null;at=previous.get(at))path.unshift(at);return path;}for(const {p:q,d} of adjacent(p,9))if(walls[p][d]===0&&!previous.has(q)){previous.set(q,p);queue.push(q);}}return null;}
const MAZE_LEVELS=[[9.4,10],[10.2,10.8],[11,11.6],[12.6,13.2],[13.4,14]].map(([min,max],i)=>({level:i+1,min,max,shared:[4,5,6,8,10][i],turns:24}));
function tripleMaze(r=Math.random,level=0,pools=null){if(pools)return JSON.parse(JSON.stringify(pick(pools[level-1],r)));const config=level?MAZE_LEVELS[level-1]:{min:0,max:16,shared:3,turns:6};for(let attempt=0;attempt<6000;attempt++){
 const n=9,start=76,walls=Array.from({length:81},()=>Array(4).fill(1)),seen=new Set([start]),frontiers=[[],[],[]];
 const region=p=>p===75?2:p===77?1:p%9<=2?2:p%9>=6?1:0;
 const open=(p,q,branch)=>{walls[p][q.d]=walls[q.p][opposite(q.d)]=0;seen.add(q.p);for(const next of adjacent(q.p,n))if(!seen.has(next.p)&&(level<3||region(next.p)===branch))frontiers[branch].push({from:q.p,...next});};
 // Grow several branches together instead of one long depth-first corridor.
 adjacent(start,n).forEach((q,i)=>open(start,q,i));
 while(frontiers.some(f=>f.length))for(const branch of shuffle([0,1,2],r)){const frontier=frontiers[branch];while(frontier.length){const i=level>2&&r()<Math.min(.65,(level-2)*.1)?frontier.length-1:int(0,frontier.length-1,r),edge=frontier[i];frontier[i]=frontier.at(-1);frontier.pop();if(!seen.has(edge.p)){open(edge.from,edge,branch);break;}}}
 const candidates=shuffle(Array.from({length:81},(_,i)=>i).filter(p=>p%9>0&&p%9<8&&p>=9&&p<72&&walls[p].filter(x=>x===0).length===1),r).map(p=>{
  const path=route(walls,start,p),dirs=path.slice(1).map((q,i)=>adjacent(path[i],n).find(a=>a.p===q).d);
  return {p,path,turns:dirs.slice(1).filter((d,i)=>d!==dirs[i]).length};
 }).filter(c=>c.path.length>=Math.max(7,Math.floor(config.min)-2)&&c.path.length<=(level?Math.min(25,Math.ceil(config.max)+5):17)&&c.turns<=config.turns);
 let chosen=null;
 const select=(group,at)=>{if(group.length===5){const mean=group.reduce((sum,c)=>sum+c.path.length-1,0)/5;if(mean>=config.min&&mean<=config.max&&new Set(group.map(c=>c.path[1])).size===3&&group.some(c=>c.p%9<=2)&&group.some(c=>c.p%9>=6)&&group.some(c=>c.p<36)){chosen=group;return true;}return false;}
  for(let i=at;i<=candidates.length-(5-group.length);i++){const c=candidates[i];if(group.some(a=>adjacent(a.p,n).some(q=>q.p===c.p)||c.path.filter(p=>p!==start&&a.path.includes(p)).length>config.shared))continue;if(select([...group,c],i+1))return true;}return false;};
 if(!select([],0))continue;
 for(let p=0;p<81;p++){const ns=adjacent(p,n);for(let d=0;d<4;d++){if(!ns.some(q=>q.d===d)){walls[p][d]=-1;continue;}if(walls[p][d]&&d<2){const q=ns.find(q=>q.d===d);walls[p][d]=walls[q.p][opposite(d)]=int(1,3,r);}}}
 const goals=[];
 for(const {p} of chosen){const colors=shuffle([1,2,3],r);let k=0;for(const q of adjacent(p,n))if(walls[p][q.d]!==0)walls[p][q.d]=walls[q.p][opposite(q.d)]=colors[k++];goals.push({p,pattern:[...walls[p]]});}
 const targetCells=new Set(goals.map(g=>g.p));
 for(let p=0;p<81;p++)if(!targetCells.has(p)&&goals.some(g=>walls[p].join()===g.pattern.join())){const edge=adjacent(p,n).find(q=>walls[p][q.d]>0&&!targetCells.has(q.p));if(edge){const duplicate=walls[p].find((v,d)=>v>0&&d!==edge.d);walls[p][edge.d]=walls[edge.p][opposite(edge.d)]=duplicate;}}
 if(goals.some(g=>walls.filter(w=>w.join()===g.pattern.join()).length!==1))continue;
 return {n,start,walls,goals,level,meanPath:chosen.reduce((sum,c)=>sum+c.path.length-1,0)/5};
 }throw Error('삼중미로 생성 실패');}
function mazeStep(p,position,previous,d){const next=adjacent(position,9).find(q=>q.d===d);if(!next)return {ok:false,reason:'edge'};if(next.p===previous)return {ok:false,reason:'reverse'};if(p.walls[position][d]!==0)return {ok:false,reason:'wall'};return {ok:true,position:next.p,previous:position};}
// Sum & Difference Gomoku: maximal uninterrupted occupied lines, including opponents at both ends.
const GDIRS=[[0,1],[1,0],[1,1],[1,-1]];
function sumLine(board,p,dy,dx){const n=9,y=Math.floor(p/n),x=p%n;let a=y,b=x;while(a-dy>=0&&a-dy<n&&b-dx>=0&&b-dx<n&&board[(a-dy)*n+b-dx]){a-=dy;b-=dx;}const cells=[];let total=0;while(a>=0&&a<n&&b>=0&&b<n&&board[a*n+b]){const i=a*n+b,c=board[i];cells.push(i);total+=(c.side===0?1:-1)*c.value;a+=dy;b+=dx;}return {cells,total};}
function sumWins(board,p){return GDIRS.map(([dy,dx])=>sumLine(board,p,dy,dx)).filter(l=>Math.abs(l.total)===16).map(l=>({...l,side:l.total===16?0:1}));}
function newGomoku(){return {board:Array(81).fill(null),stock:[Array(6).fill(4),Array(6).fill(4)],turn:0,moves:0,winner:null,line:[],draw:false};}
function gomokuMoves(s,side=s.turn){const empty=[];for(let p=0;p<81;p++)if(!s.board[p]&&(!s.moves?p===40:adjacent(p,9).some(x=>s.board[x.p])||[[-1,-1],[-1,1],[1,-1],[1,1]].some(([dy,dx])=>{const y=Math.floor(p/9)+dy,x=p%9+dx;return y>=0&&y<9&&x>=0&&x<9&&s.board[y*9+x];})))for(let v=1;v<=5;v++)if(s.stock[side][v]>0&&(s.moves>0||v<=3))empty.push({p,value:v});return empty;}
function gomokuPlace(s,p,value){if(s.winner!==null||s.draw||!Number.isInteger(p)||p<0||p>80||s.board[p]||!Number.isInteger(value)||value<1||value>5||!s.stock[s.turn][value]||(!s.moves&&value>3))return null;const board=[...s.board],stock=s.stock.map(a=>[...a]);board[p]={side:s.turn,value};stock[s.turn][value]--;const wins=sumWins(board,p),win=wins.find(w=>w.side===s.turn)||wins[0];return {...s,board,stock,turn:1-s.turn,moves:s.moves+1,winner:win?win.side:null,line:win?win.cells:[],draw:!win&&stock.every(a=>a.slice(1).every(x=>x===0))};}
function winningMoves(s,side){return gomokuMoves({...s,turn:side},side).filter(m=>{const b=[...s.board];b[m.p]={side,value:m.value};return sumWins(b,m.p).some(w=>w.side===side);});}
// Bounded iterative alpha-beta search. Tactical checks happen before move pruning.
const AI_MATE=1000000;
function duelSearch(s,config,options={}){
 const limit=options.maxNodes??2600,until=Date.now()+(options.timeMs??550),maxDepth=options.maxDepth??config.depth,table=new Map(),memo=new Map(),path=new Set(),abort={};let nodes=0,completed=0;
 const key=config.key,check=()=>{if(nodes>=limit||Date.now()>=until)throw abort;},evaluate=p=>{const k=key(p);if(!memo.has(k))memo.set(k,config.evaluate(p));return memo.get(k);};
 const rootSide=s.turn,sign=p=>p.turn===rootSide?1:-1,terminal=(p,ply)=>p.winner===null?null:(p.winner===rootSide?AI_MATE-ply:-AI_MATE+ply);
 function ordered(p,root=false){
  let moves=config.moves(p);if(!moves.length)return moves;
  const wins=moves.filter(m=>m.next.winner===p.turn);if(wins.length)return wins;
  moves=config.order(p,moves,evaluate,root);
  // A next-turn loss is never hidden by a beam cutoff.
  const safe=moves.filter(m=>m.next.winner===null&&!config.immediate(m.next));
  if(safe.length)moves=safe;
  return moves.slice(0,root?config.rootBeam:config.beam);
 }
 function search(p,depth,alpha,beta,ply){
  nodes++;if((nodes&15)===0)check();const end=terminal(p,ply);if(end!==null)return end;if(p.draw)return 0;
  const k=key(p);if(path.has(k))return evaluate(p)*sign(p)*.1;
  if(config.immediate(p))return p.turn===rootSide?AI_MATE-ply-1:-AI_MATE+ply+1;
  if(depth<=0)return evaluate(p)*sign(p);
  const old=table.get(k),a0=alpha,b0=beta;if(old&&old.depth>=depth){if(old.flag===0)return old.value;if(old.flag===1)alpha=Math.max(alpha,old.value);else beta=Math.min(beta,old.value);if(alpha>=beta)return old.value;}
  const moves=ordered(p);if(!moves.length){if(!config.pass)return 0;const other={...p,turn:1-p.turn};if(!config.moves(other).length)return 0;return search(other,depth-1,alpha,beta,ply+1);}
  path.add(k);let best=p.turn===rootSide?-Infinity:Infinity;
  for(const m of moves){const value=search(m.next,depth-1,alpha,beta,ply+1);if(p.turn===rootSide){best=Math.max(best,value);alpha=Math.max(alpha,best);}else{best=Math.min(best,value);beta=Math.min(beta,best);}if(alpha>=beta)break;}
  path.delete(k);table.set(k,{depth,value:best,flag:best<=a0?2:best>=b0?1:0});return best;
 }
 // Root ordering is completed once so an interrupted iteration always has a legal, safe fallback.
 const rootMoves=ordered(s,true);if(!rootMoves.length)return null;let chosen=rootMoves[0],bestScore=-evaluate(rootMoves[0].next);
 if(chosen.next.winner===rootSide)return {...chosen,analysis:{depth:1,nodes:0,score:AI_MATE}};
 for(let depth=1;depth<=maxDepth;depth++){
  let best=null,value=-Infinity;path.clear();path.add(key(s));
  try{for(const m of rootMoves){check();const score=search(m.next,depth-1,value,Infinity,1);if(score>value){value=score;best=m;}}}catch(e){if(e!==abort)throw e;break;}
  if(best){chosen=best;bestScore=value;completed=depth;rootMoves.splice(rootMoves.indexOf(best),1);rootMoves.unshift(best);}if(Math.abs(value)>AI_MATE-100)break;
 }
 return {...chosen,analysis:{depth:completed,nodes,score:bestScore}};
}
const gomokuKey=s=>s.turn+':'+s.board.map(c=>c?String.fromCharCode(65+c.side*5+c.value):'.').join('')+':'+s.stock.map(a=>a.slice(1).join('')).join('');
function gomokuTotals(board,p){
 const y=Math.floor(p/9),x=p%9;return GDIRS.map(([dy,dx])=>{let total=0,length=0,ends=[];for(const sign of [-1,1]){let yy=y+dy*sign,xx=x+dx*sign;while(yy>=0&&yy<9&&xx>=0&&xx<9&&board[yy*9+xx]){const c=board[yy*9+xx];total+=(c.side? -1:1)*c.value;length++;yy+=dy*sign;xx+=dx*sign;}if(yy>=0&&yy<9&&xx>=0&&xx<9)ends.push(yy*9+xx);}return{total,length,ends};});
}
function gomokuImmediate(s){
 const sign=s.turn? -1:1,positions=new Set(gomokuMoves(s).map(m=>m.p));for(const p of positions)for(const line of gomokuTotals(s.board,p)){const v=16-line.total*sign;if(Number.isInteger(v)&&v>=1&&v<=5&&s.stock[s.turn][v]&&(!s.moves?v<=3:true))return true;}return false;
}
function gomokuEvaluation(s){
 if(s.winner!==null)return s.winner===s.turn?AI_MATE:-AI_MATE;
 const sign=s.turn? -1:1;let score=0;const positions=new Set(gomokuMoves(s).map(m=>m.p)),winning=[new Set(),new Set()];
 for(const p of positions)for(const l of gomokuTotals(s.board,p)){
  for(let side=0;side<2;side++){const v=16-l.total*(side? -1:1);if(v>=1&&v<=5&&s.stock[side][v])winning[side].add(p);}
 }
 score+=(winning[s.turn].size-winning[1-s.turn].size)*1800;
 // Count each maximal occupied run exactly once; overshooting 16 has no winning bonus.
 for(let p=0;p<81;p++)if(s.board[p])for(const [dy,dx]of GDIRS){const y=Math.floor(p/9),x=p%9,py=y-dy,px=x-dx;if(py>=0&&py<9&&px>=0&&px<9&&s.board[py*9+px])continue;const l=sumLine(s.board,p,dy,dx),v=l.total*sign,last=l.cells.at(-1),ey=Math.floor(last/9)+dy,ex=last%9+dx,open=(py>=0&&py<9&&px>=0&&px<9?1:0)+(ey>=0&&ey<9&&ex>=0&&ex<9?1:0);if(open){const strength=Math.abs(v)<=16?Math.abs(v)**2/8:Math.max(0,28-Math.abs(v));score+=(v>0?1:-1)*strength*(open===2?1.3:.8);}}
 return score;
}
function gomokuAI(s,r=Math.random,options={}){
 const ctx={depth:4,rootBeam:22,beam:9,pass:false,key:gomokuKey,immediate:gomokuImmediate,evaluate:gomokuEvaluation,
  moves:p=>gomokuMoves(p).map(m=>({...m,next:gomokuPlace(p,m.p,m.value)})),
  order(p,moves,evaluate,root){
   // Keep every possible defensive move when the opponent already threatens 16.
   const threatened=gomokuImmediate({...p,turn:1-p.turn}),sign=p.turn? -1:1,totals=new Map();
   const cheap=m=>{if(m.next.winner!==null)return m.next.winner===p.turn?AI_MATE:-AI_MATE;if(!totals.has(m.p))totals.set(m.p,gomokuTotals(p.board,m.p));let v=0;for(const l of totals.get(m.p)){const n=l.total*sign+m.value;v+=n>0&&n<16?n*n*.4+(l.length+1)*2:n>16?-(n-16):0;}return v-(Math.abs(m.p%9-4)+Math.abs(Math.floor(m.p/9)-4))*.1;};
   moves.sort((a,b)=>cheap(b)-cheap(a));if(!threatened)moves=moves.slice(0,root?54:24);
   const ranked=moves.map(m=>({m,value:-evaluate(m.next)-(gomokuImmediate(m.next)?AI_MATE/2:0)}));ranked.sort((a,b)=>b.value-a.value);return ranked.map(q=>q.m);
  }};
 return duelSearch(s,ctx,{timeMs:750,maxNodes:6000,...options});
}
// Exit Strategy 2: landing on D4 exits; passing through does not stop sliding.
const EXIT=24,BLOCKS=[21,27];
function newExit(r=Math.random){const board=Array(49).fill(null);for(let side=0;side<2;side++){const cells=[];for(const x of side?[4,5,6]:[0,1,2])shuffle([0,1,2,4,5,6],r).slice(0,2).forEach(y=>cells.push(y*7+x));shuffle([1,2,3,4,5,6],r).forEach((value,i)=>board[cells[i]]={side,value});}return {board,turn:0,escaped:[0,0],winner:null,moves:0,lastPath:[]};}
// Precomputed rays keep multi-ply search and route estimates inexpensive.
const EXIT_RAYS=Array.from({length:49},(_,p)=>DIRS.map(([dy,dx])=>{const ray=[];let y=Math.floor(p/7)+dy,x=p%7+dx;while(y>=0&&y<7&&x>=0&&x<7){const q=y*7+x;if(BLOCKS.includes(q))break;ray.push(q);y+=dy;x+=dx;}return ray;}));
function exitSlide(s,p,d){
 const c=s.board[p];if(!c||c.side!==s.turn||!EXIT_RAYS[p]?.[d])return null;let current=p,path=[p];for(const q of EXIT_RAYS[p][d]){if(s.board[q])break;current=q;path.push(q);}if(current===p)return null;
 const board=[...s.board],escaped=[...s.escaped];board[p]=null;const out=current===EXIT;if(out)escaped[s.turn]++;else board[current]=c;
 return {...s,board,escaped,turn:1-s.turn,winner:escaped[s.turn]>=2?s.turn:null,moves:s.moves+1,lastPath:path,lastMove:{from:p,to:current,piece:c.value,side:c.side,out},positionHistory:[...(s.positionHistory||[]),exitKey(s)].slice(-24)};
}
function exitMoves(s,side=s.turn){const out=[];for(let p=0;p<49;p++)if(s.board[p]?.side===side)for(let d=0;d<4;d++){const next=exitSlide({...s,turn:side},p,d);if(next)out.push({p,d,next});}return out;}
function exitRoutes(s,p){
 if(!s.board[p])return {exit:6,setup:6};const seen=new Uint8Array(49),queue=[p],depth=[0],stops=[17,23,25,31];let goal=6,setup=stops.includes(p)?0:6;seen[p]=1;
 for(let k=0;k<queue.length;k++){if(depth[k]>=4)continue;for(const ray of EXIT_RAYS[queue[k]]){let end=queue[k];for(const q of ray){if(q!==p&&s.board[q])break;end=q;}if(end===EXIT)goal=Math.min(goal,depth[k]+1);if(stops.includes(end))setup=Math.min(setup,depth[k]+1);if(goal<6&&setup<6)return{exit:goal,setup};if(!seen[end]){seen[end]=1;queue.push(end);depth.push(depth[k]+1);}}}return {exit:goal,setup};
}
function exitDistance(s,p){return exitRoutes(s,p).exit;}
function exitKey(s){return s.turn+':'+s.escaped.join('')+':'+s.board.map(c=>c?c.side?'B':'A':'.').join('');}
function exitImmediate(s){if(s.escaped[s.turn]<1)return false;for(let p=0;p<49;p++)if(s.board[p]?.side===s.turn)for(const ray of EXIT_RAYS[p]){let end=p;for(const q of ray){if(s.board[q])break;end=q;}if(end===EXIT)return true;}return false;}
function exitEval(s,side){
 if(s.winner!==null)return s.winner===side?AI_MATE:-AI_MATE;
 const routes=[[],[]],preparation=[[],[]],weights={1:1600,2:380,3:95,4:22,6:0},setupWeight={0:35,1:22,2:9,3:3,4:1,6:0};for(let p=0;p<49;p++)if(s.board[p]){const d=exitRoutes(s,p);routes[s.board[p].side].push(d.exit);preparation[s.board[p].side].push(d.setup);}
 let total=(s.escaped[side]-s.escaped[1-side])*22000;
 for(let owner=0;owner<2;owner++){routes[owner].sort((a,b)=>a-b);const needed=2-s.escaped[owner],routeValue=routes[owner].slice(0,needed).reduce((a,d,i)=>a+(weights[d]||0)*(i?.6:1),0);const setup=Math.max(0,...preparation[owner].map(d=>setupWeight[d]||0));total+=(owner===side?1:-1)*(routeValue+setup);}
 return total;
}
function exitAI(s,r=Math.random,options={}){
 const previous=new Set(s.positionHistory||[]),ctx={depth:6,rootBeam:18,beam:9,pass:true,key:exitKey,immediate:exitImmediate,evaluate:p=>exitEval(p,p.turn),
  moves:p=>exitMoves(p),order(p,moves,evaluate,root){
   return moves.map(m=>({m,value:m.next.winner===p.turn?AI_MATE:-evaluate(m.next)-(exitImmediate(m.next)?AI_MATE/2:0)-(root&&previous.has(exitKey(m.next))?800:0)})).sort((a,b)=>b.value-a.value).map(q=>q.m);
  }};
 return duelSearch(s,ctx,{timeMs:650,maxNodes:10000,...options});
}
// Rainbow Sequence: every column contains all seven colors exactly once.
const digitSum=n=>[...String(Math.abs(n))].reduce((a,b)=>a+ +b,0),digitProduct=n=>[...String(Math.abs(n))].reduce((a,b)=>a* +b,1),primes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67];
function sequence(kind,r=Math.random){let a=[],rule='';const x=int(1,8,r),d=int(2,7,r),q=int(2,9,r);if(kind===0){a=Array.from({length:7},(_,k)=>x+k*d+q*k*(k-1)/2);rule=`차이는 ${d}부터 시작해 ${q}씩 증가`;}if(kind===1){a=[x];for(let k=1;k<7;k++)a.push(a.at(-1)+(k%2?d+2:-d));rule=`+${d+2}, −${d}를 번갈아 적용`;}if(kind===2){a=Array.from({length:7},(_,k)=>x+d*(2**k-1));rule=`차이 ${d}부터 두 배씩 증가`;}if(kind===3){a=Array.from({length:7},(_,k)=>k%2===0?(k/2+1)**2+x:2**((k+1)/2));rule=`홀수 번째는 제곱수+${x}, 짝수 번째는 2의 거듭제곱`;}if(kind===4){const start=int(0,10,r);a=primes.slice(start,start+7);rule='연속된 소수';}if(kind===5){a=[int(11,29,r)];for(let k=1;k<7;k++)a.push(a.at(-1)+digitSum(a.at(-1)));rule='이전 항에 그 자릿수의 합을 더함';}if(kind===6){do{a=[int(11,37,r)];for(let k=1;k<7;k++)a.push(a.at(-1)+digitProduct(a.at(-1)));}while(new Set(a).size<7||Math.max(...a)>900);rule='이전 항에 그 자릿수의 곱을 더함';}if(kind===7){const scale=int(1,2,r);a=[2,3,5,10,25,75,250].map(n=>n*scale);rule='앞의 두 항의 차에 5를 곱함';}if(kind===8){a=[8,4,4,6,12,30,90].map(n=>n*x);rule='곱하는 수가 0.5, 1, 1.5, 2, 2.5, 3';}if(kind===9){a=[int(5,9,r)];for(let k=1;k<7;k++)a.push(k%2?a.at(-1)-k:a.at(-1)*k);rule='−1, ×2, −3, ×4, −5, ×6';}if(kind===10){const start=pick([13,16,19],r);a=Array.from({length:7},(_,k)=>Number(String(start+k*3).split('').reverse().join('')));rule=`각 항을 뒤집으면 ${start}부터 3씩 증가`;}if(kind===11){const m=pick([3,4,7,9],r),text=Array.from({length:20},(_,k)=>m*(k+1)).join('');a=Array.from({length:7},(_,k)=>Number(text.slice(k*2,k*2+2)));rule=`${m}의 배수를 이어 쓴 뒤 두 자리씩 구분`;}
 if(kind===12){a=Array.from({length:7},(_,k)=>x+k*d);rule=`${d}씩 증가`;}
 if(kind===13){const ratio=int(2,3,r);a=Array.from({length:7},(_,k)=>x*ratio**k);rule=`${ratio}배씩 증가`;}
 if(kind===14){a=Array.from({length:7},(_,k)=>x+(k+1)*(k+2)/2);rule=`삼각수 1, 3, 6, 10…에 ${x}를 더함`;}
 if(kind===16){a=Array.from({length:7},(_,k)=>(k+1)**2+x);rule=`제곱수에 ${x}를 더함`;}
 if(kind===17){a=Array.from({length:7},(_,k)=>x+7*d-k*d);rule=`${d}씩 감소`;}
 // Advanced rules combine two observable operations, without changing the 7×7 board or timers.
 if(kind===18){const base=int(2,5,r),step=int(2,4,r);a=Array.from({length:7},(_,k)=>k%2===0?(k/2+base)**2+x:step**((k+1)/2)+d);rule=`홀수 번째는 ${base}부터의 제곱수+${x}, 짝수 번째는 ${step}의 거듭제곱+${d}`;}
 if(kind===19){const m=int(2,3,r),b=int(2,6,r);a=[x];for(let k=1;k<7;k++)a.push(k%2?a.at(-1)*m+k:a.at(-1)*m-b*k);rule=`이전 항을 ${m}배 한 뒤 홀수 번째 연산은 순서 번호를 더하고, 짝수 번째 연산은 순서 번호의 ${b}배를 뺌`;}
 if(kind===20){const c=int(2,5,r),b=int(1,4,r);a=[x,d];for(let k=2;k<7;k++)a.push(c*a[k-1]-a[k-2]+b);rule=`둘째 항부터, 다음 항 = 바로 앞 항×${c} − 그 전 항 + ${b}`;}
 if(kind===21){const c=int(2,4,r);a=[int(12,28,r)];for(let k=1;k<7;k++)a.push(a.at(-1)+c*digitSum(a.at(-1))+k);rule=`이전 항에 자릿수 합의 ${c}배와 연산 순서 1, 2, 3…을 더함`;}
 if(kind===22){const start=int(2,5,r),step=int(1,2,r);a=Array.from({length:7},(_,k)=>Number(String((start+k*step)**2).split('').reverse().join('')));rule=`${start}부터 ${step}씩 증가하는 수를 제곱한 뒤 자릿수 순서를 뒤집음 (앞의 0은 생략)`;}
 if(kind===23){const start=int(0,5,r),m=int(2,5,r);a=[x];for(let k=1;k<7;k++)a.push(a.at(-1)+(k%2?1:-1)*primes[start+k-1]*m);rule=`연속 소수 ${primes[start]}부터 각각 ${m}배한 수를 번갈아 더하고 뺌`;}
 if(kind===24){const b=int(2,5,r);a=[x];for(let k=1;k<7;k++)a.push(a.at(-1)+b*k**3+(k%2?d:-d));rule=`차이는 ${b}×1³+${d}, ${b}×2³−${d}, ${b}×3³+${d}…`;}
 if(kind===25){const start=int(2,5,r),offset=int(1,4,r),text=Array.from({length:20},(_,k)=>(start+k)**2+offset).join('');a=Array.from({length:7},(_,k)=>Number(text.slice(k*2,k*2+2)));rule=`${start}부터 연속된 수의 제곱에 ${offset}을 더해 이어 쓴 뒤 두 자리씩 구분`;}
 return {values:a,rule,kind};}
const RAINBOW_LEVELS=[{medium:3,hard:4,advanced:0,label:'방송 수준'},{medium:0,hard:4,advanced:3,label:'심화'},{medium:0,hard:0,advanced:7,label:'최상급'}];
const RAINBOW_MEDIUM=[0,1,2,4,5,9],RAINBOW_HARD=[3,6,7,8,10,11],RAINBOW_ADVANCED=[18,19,20,21,22,23,24,25];
function rainbow(r=Math.random,level=0,pools=null){
 if(pools)return JSON.parse(JSON.stringify(pick(pools[level-1],r)));
 const c=RAINBOW_LEVELS[(level||1)-1];if(!c)throw Error('Rainbow stage must be 1–3');
 const kinds=[...shuffle(RAINBOW_MEDIUM,r).slice(0,c.medium),...shuffle(RAINBOW_HARD,r).slice(0,c.hard),...shuffle(RAINBOW_ADVANCED,r).slice(0,c.advanced)],sequences=shuffle(kinds,r).map(k=>sequence(k,r)),cells=Array(49);
 for(let col=0;col<7;col++)shuffle([0,1,2,3,4,5,6],r).forEach((color,row)=>cells[row*7+col]={color,value:sequences[color].values[col]});
 return{cells,sequences,level,mediumCount:c.medium,hardCount:c.hard,advancedCount:c.advanced,difficultyLabel:c.label};
}
// A six-face orientation is tracked independently of the hand printed on each face.
const RPS_FLOOR=['가바보가보바가','보가바바가보보','바보가보바바가','가보바보가보바','보바바가보보보','바가가보바보가','바가바가바가바'].join('').split('').map(c=>({바:0,보:1,가:2})[c]);
const RPS_NETS=[[0,0,1,2,2,1],[0,2,2,1,1,0],[2,1,1,2,0,0]];
const RPS_COLORS=['#f2a5a0','#f1d07b','#a4d5c7','#bcb2e0','#91c1e8','#edbc8e'],RPS_FACE_UP=[[0,-1,0],[0,0,-1],[0,0,-1],[0,0,-1],[0,1,0],[0,0,1]];
const rotateVector=([x,y,z],d)=>d===0?[x,z,-y]:d===2?[x,-z,y]:d===1?[y,-x,z]:[-y,x,z];
function roll(o,d){const n={...o};if(d===0){n.top=o.south;n.bottom=o.north;n.north=o.top;n.south=o.bottom;}if(d===2){n.top=o.north;n.bottom=o.south;n.north=o.bottom;n.south=o.top;}if(d===1){n.top=o.west;n.bottom=o.east;n.east=o.top;n.west=o.bottom;}if(d===3){n.top=o.east;n.bottom=o.west;n.east=o.bottom;n.west=o.top;}return n;}
const rpsResult=(a,b)=>a===b?0:(a-b+3)%3===1?1:-1;
function newRPS(round=1,r=Math.random){return {floor:[...RPS_FLOOR],net:round<=3?[...RPS_NETS[round-1]]:shuffle([0,0,1,1,2,2],r),orientation:{north:0,top:1,west:2,east:3,south:4,bottom:5},faceUp:RPS_FACE_UP.map(a=>[...a]),position:-4,previous:null,turn:0,scores:[0,0],budget:pick([3,4,5],r),remaining:0,path:[],winner:null};}
function rpsNext(s,d){if(s.position===-4){if(d!==2)return null;return 3;}const q=adjacent(s.position,7).find(x=>x.d===d);return q&&q.p!==s.previous?q.p:null;}
function rpsStep(s,d){const p=rpsNext(s,d);if(p===null||s.remaining<=0||s.winner!==null)return null;return {...s,position:p,previous:s.position,orientation:roll(s.orientation,d),faceUp:s.faceUp.map(v=>rotateVector(v,d)),remaining:s.remaining-1,path:[...s.path,p]};}
function rpsPaths(s){const out=[];function visit(a,dirs){if(!a.remaining){out.push({dirs,state:a,result:rpsResult(a.net[a.orientation.bottom],a.floor[a.position])});return;}for(let d=0;d<4;d++){const q=rpsStep(a,d);if(q)visit(q,[...dirs,d]);}}visit({...s,remaining:s.budget,path:[]},[]);return out;}
function rpsAI(s){const options=rpsPaths(s);let best=null;for(const o of options){let worst=0;for(const budget of [3,4,5]){const next=rpsPaths({...o.state,budget});worst+=Math.max(...next.map(p=>p.result));}const value=o.result*100-worst*12;if(!best||value>best.value)best={...o,value};}return best;}
const api={RPS_COLORS,RPS_FACE_UP,rotateVector,MAZE_LEVELS,RAINBOW_LEVELS,shuffle,int,pick,DIRS,adjacent,route,tripleMaze,mazeStep,GDIRS,sumLine,sumWins,newGomoku,gomokuMoves,gomokuPlace,winningMoves,gomokuAI,EXIT,BLOCKS,newExit,exitSlide,exitMoves,exitDistance,exitEval,exitAI,sequence,rainbow,RPS_FLOOR,RPS_NETS,roll,rpsResult,newRPS,rpsNext,rpsStep,rpsPaths,rpsAI};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.UniversityStrategy=api;
})(typeof window!=='undefined'?window:globalThis);
