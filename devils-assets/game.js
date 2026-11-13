'use strict';
(function(){
const E=DevilsEngine,$=id=>document.getElementById(id),hex=document.body.dataset.game==='hexagon',letters='ABCDEFGHIJKLMNOPQRS';let puzzle,state='idle',round=0,score=0,selected=[],found=new Set(),memoryDeadline=0,answerDeadline=0,roundDeadline=0,idleDeadline=0,practice=false,source='random';
function key(a){return hex?[...a].sort((a,b)=>a-b).join(','):a.join(',');}
function showBoard(){
 $('board').replaceChildren();const visible=!hex||practice||['memorize','review','ended'].includes(state);
 const cells=hex?E.hexCells():Array.from({length:10},(_,i)=>({row:i<1?0:i<3?1:i<6?2:3}));
 puzzle.board.forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='cell'+(selected.includes(i)?' selected':'')+(visible?' open':'');b.disabled=state!=='answer';b.setAttribute('aria-pressed',selected.includes(i));
 if(hex){const c=cells[i];b.style.left=((c.q+c.r/2)*18+50)+'%';b.style.top=(c.r*16+50)+'%';b.innerHTML=`<span>${visible?v:letters[i]}</span>${visible?'<small>'+letters[i]+'</small>':''}`;b.setAttribute('aria-label',letters[i]+(visible?' '+v:' 숨겨진 숫자'));}
 else{const row=cells[i].row,col=i-[0,1,3,6][row];b.style.left=(50+(col-row/2)*23)+'%';b.style.top=(13+row*24)+'%';b.innerHTML=`<small>${letters[i]}</small><span>${v.op}${v.n}</span>`;b.setAttribute('aria-label',letters[i]+' '+v.op+v.n);}
 b.onclick=()=>{if(state!=='answer')return;if(Date.now()>=answerDeadline&&!practice){attempt(false,'답변 시간이 끝났습니다.');return;}if(selected.includes(i))selected=selected.filter(j=>j!==i);else if(selected.length<3)selected.push(i);showBoard();update();};$('board').append(b);
 });
}
function update(){
 $('score').textContent=score;$('round').textContent=round+' / 10';$('target').textContent=state==='memorize'||state==='idle'?'—':puzzle.target;$('selection').textContent=selected.map(i=>letters[i]).join(' → ');$('submit').disabled=state!=='answer'||selected.length!==3;$('clear').disabled=state!=='answer';$('buzz').disabled=state!=='choose';$('giveup').disabled=!['choose','answer'].includes(state);$('skipMemory').hidden=!(hex&&practice&&state==='memorize');
}
function status(s){$('status').textContent=s;}
function newRound(){round++;found=new Set();selected=[];$('review').hidden=true;$('next').hidden=true;
 if(hex)puzzle=E.hexPuzzle();else if(source==='broadcast'){const p=E.broadcastPyramids[(round-1)%E.broadcastPyramids.length];puzzle={...p,solutions:E.pyramidSolutions(p.board,p.target)};}else puzzle=E.pyramidPuzzle();
 if(hex){state='memorize';memoryDeadline=Date.now()+30000;status('숫자의 위치를 30초 동안 기억하세요. 타깃은 암기 후 공개됩니다.');}
 else{state='choose';roundDeadline=Date.now()+180000;status('첫 칸의 기호는 무시합니다. 세 칸을 순서대로 골라 수식을 만드세요.');}
 showBoard();update();tick();
}
function beginChoices(){state='choose';idleDeadline=Date.now()+90000;selected=[];status('가로·대각선으로 연속한 세 칸의 합을 찾으세요. 이미 제출한 조합도 기억해야 합니다.');showBoard();update();}
function start(){practice=$('mode').value==='practice';source=$('source').value;score=0;round=0;$('setup').hidden=true;newRound();}
function review(reason){state='review';selected=[];$('review').hidden=false;$('resultTitle').textContent='라운드 정답 확인';$('resultText').textContent=reason+' · 정답 조합 '+puzzle.solutions.length+'개';$('solutions').replaceChildren();
 for(const answer of puzzle.solutions){const b=document.createElement('button');b.textContent=answer.map(i=>letters[i]).join(' → ')+(found.has(key(answer))?' ✓':'')+' : '+(hex?answer.map(i=>puzzle.board[i]).join(' + '):E.expression(puzzle.board,answer))+' = '+puzzle.target;b.onclick=()=>{selected=[...answer];showBoard();update();};$('solutions').append(b);}
 $('next').hidden=false;$('next').textContent=round===10?'최종 결과':'다음 라운드 →';status('정답 버튼을 눌러 칸과 계산을 확인하세요.');showBoard();update();
}
function attempt(ok,reason){if(state!=='answer')return;if(ok)score++;else score--;selected=[];
 if(found.size===puzzle.solutions.length){review('모든 정답을 찾았습니다.');return;}
 state='choose';idleDeadline=Date.now()+90000;status(reason+(ok?' +1점':' −1점')+' · 다음 조합이 떠오르면 버저를 누르세요.');showBoard();update();tick();
}
function tick(){
 if(state==='idle'||state==='review'||state==='ended')return;const now=Date.now();let remaining,label;
 if(state==='memorize'){remaining=memoryDeadline-now;label='암기 시간';if(remaining<=0){beginChoices();tick();return;}}
 else{if(!practice&&((hex&&state==='choose'&&now>=idleDeadline)||(!hex&&now>=roundDeadline))){review(hex?'90초 동안 새로운 답변이 없었습니다.':'3분 제한 시간이 끝났습니다.');return;}
 if(state==='answer'){remaining=answerDeadline-now;label='답변 시간';if(!practice&&remaining<=0){attempt(false,'답변 시간이 끝났습니다.');return;}}
 else{remaining=hex?idleDeadline-now:roundDeadline-now;label=hex?'대기 시간':'라운드 시간';}}
 $('timeLabel').textContent=label;$('timer').textContent=practice&&state!=='memorize'?'∞':Math.max(0,Math.ceil(remaining/1000))+'초';
}
$('start').onclick=start;$('buzz').onclick=()=>{if(state!=='choose')return;tick();if(state!=='choose')return;state='answer';answerDeadline=Date.now()+10000;selected=[];status('10초 안에 세 칸을 고르고 제출하세요.');showBoard();update();tick();};
$('submit').onclick=()=>{if(state!=='answer'||selected.length!==3)return;if(!practice&&Date.now()>=answerDeadline){attempt(false,'답변 시간이 끝났습니다.');return;}if(!hex&&!practice&&Date.now()>=roundDeadline){review('라운드 시간이 끝났습니다.');return;}const k=key(selected);if(found.has(k)){attempt(false,'이미 선언한 정답입니다.');return;}
 const ok=puzzle.solutions.some(s=>key(s)===k);if(ok)found.add(k);attempt(ok,ok?'정답입니다.':'타깃과 조건을 만족하지 않습니다.');};
$('clear').onclick=()=>{selected=[];showBoard();update();};$('giveup').onclick=()=>review('라운드를 포기했습니다.');$('skipMemory').onclick=beginChoices;
$('next').onclick=()=>{if(round===10){state='ended';$('resultTitle').textContent='10라운드 완료';$('resultText').textContent='최종 점수 '+score+'점';$('next').hidden=true;update();return;}newRound();};
$('restart').onclick=()=>{state='idle';$('setup').hidden=false;$('review').hidden=true;$('next').hidden=true;score=0;round=0;selected=[];showBoard();update();$('timer').textContent='준비';status('시작하면 새 판으로 진행됩니다.');};
$('sourceLabel').hidden=hex;puzzle=hex?E.hexPuzzle():E.pyramidPuzzle();showBoard();update();setInterval(tick,100);
})();
