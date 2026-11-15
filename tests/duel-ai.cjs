'use strict';
const A=require('node:assert/strict'),E=require('../university-strategy-assets/engine.js');
function gPosition(sequence){let s=E.newGomoku();for(const [p,v]of sequence){s=E.gomokuPlace(s,p,v);A(s);A.equal(s.winner,null);}return s;}
const attack=gPosition([[12,1],[0,1],[38,4],[8,1],[39,5],[72,1],[22,4],[80,1],[31,5],[70,2]]);
function forcesGomoku(s,m){const n=E.gomokuPlace(s,m.p,m.value);A(n);return E.gomokuMoves(n).every(reply=>{const p=E.gomokuPlace(n,reply.p,reply.value);return p.winner===s.turn||p.winner===null&&E.winningMoves(p,s.turn).length>0;});}
{
 A.equal(E.winningMoves(attack,attack.turn).length,0);const before=JSON.stringify(attack),m=E.gomokuAI(attack);A(m.analysis.depth>=2);A(m.analysis.score>999900);A(forcesGomoku(attack,m));A.equal(JSON.stringify(attack),before);
}
{
 const s=gPosition([[12,1],[0,1],[38,4],[23,3],[39,5],[30,3],[22,4],[47,3],[31,5],[80,1],[8,1]]);
 A.equal(E.winningMoves(s,0).length,0);A.equal(E.winningMoves(s,1).length,0);
 // The previous policy chose 33/5, allowing an unavoidable cross-fork at 40/5.
 const legacyReply=E.gomokuPlace(s,33,5);A(forcesGomoku(legacyReply,{p:40,value:5}));
 const m=E.gomokuAI(s);A.equal(m.p,40,'preempt the fork before there is an immediate winning move');A(m.analysis.depth>=3);A.equal(E.winningMoves(m.next,m.next.turn).length,0);
}
{
 let s=E.newGomoku();s.moves=6;s.turn=1;for(const [p,v]of [[36,5],[37,5],[38,5]])s.board[p]={side:1,value:v};const m=E.gomokuAI(s);A.equal(E.gomokuPlace(s,m.p,m.value).winner,1);
 s=E.newGomoku();s.moves=6;s.turn=1;for(const [p,v]of [[36,5],[37,5],[38,5]])s.board[p]={side:0,value:v};A(E.winningMoves(s,0).length);const defense=E.gomokuAI(s);A.equal(E.winningMoves(defense.next,0).length,0);
}
const exit=require('./fixtures/exit-fork.json');
function destination(board,p,d){const [dy,dx]=[[-1,0],[0,1],[1,0],[0,-1]][d];let y=Math.floor(p/7),x=p%7;for(;;){const yy=y+dy,xx=x+dx,q=yy*7+xx;if(yy<0||yy>6||xx<0||xx>6||q===21||q===27||board[q])break;y=yy;x=xx;}return y*7+x;}
function directWin(s,side=s.turn){if(s.escaped[side]<1)return false;for(let p=0;p<49;p++)if(s.board[p]?.side===side)for(let d=0;d<4;d++)if(destination(s.board,p,d)===24)return true;return false;}
function forcesExit(s,m){return E.exitMoves(m.next).every(reply=>reply.next.winner===s.turn||reply.next.winner===null&&directWin(reply.next,s.turn));}
{
 const before=JSON.stringify(exit);A.equal(exit.escaped[exit.turn],1);A(!directWin(exit));
 const legacy=E.exitSlide(exit,7,1);A(!forcesExit(exit,{next:legacy}));
 const m=E.exitAI(exit);A(m.analysis.depth>=2);A(m.analysis.score>999900);A(forcesExit(exit,m));A.equal(JSON.stringify(exit),before);A.equal(destination(exit.board,m.p,m.d),m.next.lastMove.to);
}
{
 const s={...E.newExit(),board:Array(49).fill(null),escaped:[1,0],turn:1};s.board[3]={side:0,value:1};s.board[31]={side:1,value:1};s.board[13]={side:1,value:2};s.board[44]={side:1,value:3};A(directWin(s,0));const m=E.exitAI(s);A(!directWin(m.next,0),'remove or block the opponent’s exact-stop second escape');
 s.turn=0;const win=E.exitAI(s);A.equal(win.next.winner,0);
}
// Route estimates must match a separate fixed-blocker breadth-first search.
function routeDistance(s,p){const board=[...s.board];board[p]=null;const queue=[[p,0]],seen=new Set([p]);for(let k=0;k<queue.length;k++){const [at,n]=queue[k];if(n>=4)continue;for(let d=0;d<4;d++){const q=destination(board,at,d);if(q===24)return n+1;if(!seen.has(q)){seen.add(q);queue.push([q,n+1]);}}}return 6;}
let seed=9123;const rng=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
for(let game=0;game<12;game++){let s=E.newExit(rng);for(let k=0;k<8&&s.winner===null;k++){const moves=E.exitMoves(s);if(!moves.length)break;s=moves[Math.floor(rng()*moves.length)].next;}for(let p=0;p<49;p++)if(s.board[p])A.equal(E.exitDistance(s,p),routeDistance(s,p));const m=E.exitAI(s,rng,{timeMs:40,maxNodes:350,maxDepth:3});A(m);A.equal(destination(s.board,m.p,m.d),m.next.lastMove.to);A(Number.isFinite(m.analysis.score));}
console.log('PASS: forced three-ply Gomoku attack, proactive cross-fork defense missed by the previous AI, exact-16 win/defense, forced two-turn Exit win missed by the previous AI, urgent escape defense, legal immutable results and independent route estimates.');
