'use strict';
(function(){
const E=GeniusEngine,$=id=>document.getElementById(id),mode=document.body.dataset.game;
const letters='ABCDEFGHIJKLMNOP',colors=['#e95855','#f3cd48','#377bdc'],backgrounds=['#161923','#898c93','#f4f1e9'],shapes=['원','삼각형','사각형'],bgNames=['검정','회색','하양'],colorNames=['빨강','노랑','파랑'];
const pictures=Array.from({length:16},(_,i)=>['기하 문양 '+(i+1)]);
// Flat, solid silhouettes redrawn from the broadcast's geometric visual language.
// Paired silhouettes deliberately recur in different colors; IDs stay neutral.
const pictureDesigns=[
 [0,'#245c8c'],[0,'#83ae30'],
 [1,'#c92847'],[1,'#e0ad11'],
 [2,'#c92847'],[2,'#83ae30'],
 [3,'#c92847'],[3,'#83ae30'],
 [4,'#245c8c'],[4,'#e0ad11'],
 [5,'#245c8c'],[5,'#83ae30'],
 [6,'#e0ad11'],[6,'#83ae30'],
 [7,'#c92847'],[7,'#245c8c']
];
const picturePaths=[
 // Two opposed triangles: the white side wedges matter as much as the color.
 '<path d="M5 5H95L50 50ZM5 95H95L50 50Z"/>',
 '<path d="M50 4 61 36 95 37 68 58 78 91 50 71 22 91 32 58 5 37 39 36Z"/>',
 // Four outward arrowheads, connected through a narrow central cross.
 '<path d="M50 3 64 20H56V44H80V36L97 50 80 64V56H56V80H64L50 97 36 80H44V56H20V64L3 50 20 36V44H44V20H36Z"/>',
 // Four diamond blocks frame a white diamond-shaped opening.
 '<path d="M50 3 72 25 50 47 28 25ZM97 50 75 72 53 50 75 28ZM50 97 28 75 50 53 72 75ZM3 50 25 28 47 50 25 72Z"/>',
 // Forked diagonal cross, with four white notches at its tips.
 '<path d="M5 5H20V13L43 36 50 29 57 36 80 13V5H95V20H87L64 43 71 50 64 57 87 80H95V95H80V87L57 64 50 71 43 64 20 87V95H5V80H13L36 57 29 50 36 43 13 20H5Z"/>',
 // Four clockwise quarter arrows: no decorative outline or tiny detail.
 '<g><path d="M36 9A43 43 0 0 1 81 20L89 12V38H63L72 29A31 31 0 0 0 39 21Z"/><path d="M36 9A43 43 0 0 1 81 20L89 12V38H63L72 29A31 31 0 0 0 39 21Z" transform="rotate(90 50 50)"/><path d="M36 9A43 43 0 0 1 81 20L89 12V38H63L72 29A31 31 0 0 0 39 21Z" transform="rotate(180 50 50)"/><path d="M36 9A43 43 0 0 1 81 20L89 12V38H63L72 29A31 31 0 0 0 39 21Z" transform="rotate(270 50 50)"/></g>',
 // A negative-space diamond, close in appearance to the hourglass.
 '<path d="M4 4H50L4 50ZM50 4H96V50ZM96 50V96H50ZM50 96H4V50Z"/>',
 // Four broad diagonal points surrounding a white central square.
 '<path d="M5 5 38 16 38 38 16 38ZM95 5 84 38H62V16ZM95 95 62 84V62H84ZM5 95 16 62H38V84Z"/>'
];
function icon(i){
 const [motif,color]=pictureDesigns[i];
 return `<svg class="picture-symbol" viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#fff"/><g fill="${color}">${picturePaths[motif]}</g></svg>`;
}
function shape(c){return `<svg viewBox="0 0 100 100" aria-hidden="true" fill="${colors[c[2]]}" stroke="#c2c4cd" stroke-width="1">${c[0]===0?'<circle cx="50" cy="50" r="35"/>':c[0]===1?'<path d="M50 10 92 85H8Z"/>':'<rect x="16" y="16" width="68" height="68"/>'}</svg>`;}
let board=[],state='idle',selected=[],exposed=new Set(),score=0,round=0,deadline=0,practice=false,targets=[],solutions=new Map(),target=null,position=12,belt=[],allHaps=[],found=new Set(),pictureTarget=0;
const config={
 'same-picture':{title:'같은그림찾기',english:'SAME PICTURE',lead:'보이지 않는 그림을 기억해, 컨베이어의 끝까지.',rules:'그림판의 A~P 뒤에는 방송 화면을 참고해 다시 그린 기하 문양 16개가 있습니다. 흰 바탕의 굵은 도형으로 구성되며, 같은 모양의 색상 변형과 윤곽이 비슷한 문양이 함께 나옵니다. 모양과 색을 함께 기억해야 합니다. 처음에는 모두 가려져 있습니다. 다음 칸의 그림과 같은 타일을 찾으면 한 칸 전진하고, 보너스로 타일 하나를 더 확인할 수 있습니다. 틀리면 공개된 그림을 기억하세요. 컨베이어가 한 칸 밀리며 새 그림이 들어옵니다. 12번째 칸에서 시작해 20번째 칸에 도달하면 성공, 0칸으로 밀리면 실패합니다. 이 버전은 상대의 턴을 생략한 1인 컨베이어 연습입니다.',source:'https://tvn.cjenm.com/ko/thegenius/video/#clipLayerPopup/315370/더-지니어스-게임의법칙-11-회'},
 'same-number':{title:'같은숫자찾기',english:'SAME NUMBER',lead:'5초의 기억. 세 개의 알파벳으로 완성하는 수식.',rules:'1~12와 +, −, ×, ÷가 섞인 16칸을 처음 5초 동안 한 번만 공개합니다. 가려진 뒤 타깃을 보고 버저를 누르면 5초 안에 숫자 → 기호 → 숫자 순서로 서로 다른 세 타일을 골라 제출해야 합니다. 선택한 타일은 제출 후에만 공개됩니다. 1인 연습은 총 10문제이며 정답은 +1점입니다. 같은 판을 계속 사용하고 타깃은 중복되지 않습니다. 연습 모드는 암기·답변 시간을 각각 15초로 늘립니다.',source:'https://www.namu.moe/w/같은%20숫자%20찾기'},
 'gyul-hap':{title:'결! 합!',english:'GYUL! HAP!',lead:'같거나, 다르거나. 끝났다는 확신까지.',rules:'도형의 모양(원·삼각형·사각형), 배경색(검정·회색·하양), 도형색(빨강·노랑·파랑)을 조합한 27장 중 9장을 공개합니다. 세 장을 골랐을 때 각 속성이 각각 모두 같거나 모두 다르면 합입니다. 합 정답 +1점, 오답·중복 합 −1점. 이미 찾은 합도 그림은 그대로 남습니다. 남은 합이 없을 때 결을 선언하면 +3점, 남아 있으면 −1점입니다. 10라운드의 1인 연습으로, 턴 교대와 제한 시간은 생략했습니다. 포기하면 남은 모든 합을 확인할 수 있습니다.',source:'https://www.namu.moe/w/결!%20합!'}
}[mode];
$('title').textContent=config.title;$('english').textContent=config.english;$('lead').textContent=config.lead;$('rulesText').textContent=config.rules;$('source').href=config.source;document.title=config.title+' · BRAIN ARENA';
$('modeLabel').hidden=mode!=='same-number';$('numberControls').hidden=mode!=='same-number';$('setControls').hidden=mode!=='gyul-hap';$('beltArea').hidden=mode!=='same-picture';$('targetLabel').textContent=mode==='same-picture'?'다음 칸의 그림':mode==='same-number'?'TARGET NUMBER':'찾아낸 합';
function status(text){$('status').textContent=text;}
function draw(){
 $('numberControls').hidden=mode!=='same-number'||['idle','memorize'].includes(state);
 $('board').replaceChildren();board.forEach((v,i)=>{
  const b=document.createElement('button');b.className='tile';b.type='button';
  const open=mode==='gyul-hap'||state==='memorize'||state==='ended'||exposed.has(i);
  if(open)b.classList.add('open');if(selected.includes(i))b.classList.add('selected');
  const selectable=mode==='same-picture'?['choose','bonus'].includes(state):mode==='same-number'?state==='answer':state==='choose';b.disabled=!selectable;
  if(mode==='gyul-hap'){
   b.style.background=backgrounds[v[1]];b.innerHTML=`<span class="shape-wrap">${shape(v)}</span><span class="tile-label">${i+1}</span>`;b.setAttribute('aria-label',`${i+1}번 ${bgNames[v[1]]} 배경 ${colorNames[v[2]]} ${shapes[v[0]]}`);
  }else{
   b.innerHTML=open?(mode==='same-picture'?icon(v):String(v)):letters[i];
   if(open){const n=document.createElement('small');n.textContent=letters[i];b.append(n);}
   b.setAttribute('aria-label',letters[i]+(open?' '+(mode==='same-picture'?pictures[v][0]:v):' 숨겨진 타일'));
  }
  b.setAttribute('aria-pressed',selected.includes(i));b.onclick=()=>pick(i);$('board').append(b);
 });
 $('selection').textContent=mode==='same-number'?selected.map(i=>letters[i]).join(' → '):mode==='gyul-hap'?selected.map(i=>i+1).join(' · '):'';
 $('score').textContent=score;$('progress').textContent=mode==='same-picture'?position+' / 20':round+' / 10';
 $('submit').disabled=state!=='answer'||selected.length!==3;$('hap').disabled=state!=='choose'||selected.length!==3;$('gyul').disabled=state!=='choose';$('buzz').disabled=state!=='choose';$('giveup').disabled=['idle','memorize','ended','review'].includes(state);
 if(mode==='same-picture'){
  $('target').innerHTML=state==='idle'?'?':icon(pictureTarget);$('target').setAttribute('aria-label','다음 그림 '+(state==='idle'?'미공개':pictures[pictureTarget][0]));
  $('belt').innerHTML=belt.map((v,i)=>`<div class="${i===position-1?'current':i===position?'next':''}" title="${i+1}번 칸 ${pictures[v][0]}">${icon(v)}<small>${i+1}</small></div>`).join('');
 }else $('target').textContent=mode==='same-number'?(state==='memorize'||state==='idle'?'—':target):found.size+'개';
}
function start(){
 score=0;round=0;selected=[];exposed.clear();$('review').hidden=true;$('setup').hidden=true;$('next').hidden=true;practice=$('mode').value==='practice';
 if(mode==='same-picture'){board=E.shuffle(Array.from({length:16},(_,i)=>i));belt=E.shuffle(Array.from({length:48},(_,i)=>i%16)).slice(0,20);position=12;state='choose';pictureTarget=belt[position];$('clock').textContent='관찰';status('다음 그림의 위치를 찾으세요. 틀린 타일도 공개되어 기억을 쌓을 수 있습니다.');}
 else if(mode==='same-number'){board=E.numberBoard();solutions=E.numberSolutions(board);targets=E.shuffle([...solutions.keys()]).slice(0,10);state='memorize';deadline=Date.now()+(practice?15000:5000);status('숫자와 연산기호의 위치를 기억하세요.');}
 else newSetRound();draw();tick();
}
function newNumberRound(){round++;target=targets[round-1];state='choose';selected=[];exposed.clear();$('review').hidden=true;$('next').hidden=true;$('clock').textContent='버저 대기';status('타깃을 만들 수식을 떠올린 뒤 버저를 누르세요.');draw();}
function newSetRound(){round++;board=E.shuffle(E.setDeck()).slice(0,9);allHaps=E.haps(board);found=new Set();selected=[];state='choose';$('review').hidden=true;$('next').hidden=true;$('clock').textContent='자유 연습';$('foundList').replaceChildren();status('세 장을 골라 합을 제출하세요. 남은 합이 없다면 결!');}
function pick(i){
 if(mode==='same-picture'){
  if(state==='bonus'){exposed.add(i);state='feedback';status('보너스 타일을 확인했습니다. 다음 목표로 진행하세요.');draw();return;}
  if(state!=='choose')return;selected=[i];exposed.add(i);const ok=board[i]===pictureTarget;position=E.pictureStep(position,ok);if(ok)score++;else{belt.shift();belt.push(Math.floor(Math.random()*16));}
  if(position===20||position===0){state='ended';endReview(position===20?'컨베이어 완주!':'컨베이어에서 떨어졌습니다.','그림판을 모두 공개했습니다. 다시 도전하며 기억력을 시험해 보세요.');}
  else{state=ok?'bonus':'feedback';status(ok?'정답! 한 칸 전진했습니다. 보너스로 확인할 타일 하나를 고르거나 다음 목표로 진행하세요.':'오답. 컨베이어가 한 칸 밀렸습니다. 공개된 그림을 기억하세요.');$('next').hidden=false;$('next').textContent='다음 목표 →';}draw();return;
 }
 if(mode==='same-number'&&state!=='answer'||mode==='gyul-hap'&&state!=='choose')return;
 if(mode==='same-number'&&Date.now()>=deadline){numberFinish(false,'답변 시간이 끝났습니다.');return;}
 selected=selected.includes(i)?selected.filter(x=>x!==i):selected.length<3?[...selected,i]:selected;draw();
}
function endReview(title,text){$('review').hidden=false;$('resultTitle').textContent=title;$('resultText').textContent=text;$('solutions').replaceChildren();$('next').hidden=state==='ended';$('next').textContent=round===10?'최종 결과 보기':'다음 문제 →';}
function numberFinish(ok,reason){
 if(!['answer','choose'].includes(state))return;if(ok)score++;state='review';selected.forEach(i=>exposed.add(i));const expr=selected.map(i=>board[i]).join(' ');endReview(ok?'정답입니다.':'정답 수식을 확인하세요.',reason+(expr?' · 선택: '+expr:''));
 for(const s of solutions.get(target)){const b=document.createElement('button');b.textContent=s.map(i=>letters[i]).join(' → ')+' : '+s.map(i=>board[i]).join(' ')+' = '+target;b.onclick=()=>{selected=[...s];exposed=new Set(s);draw();};$('solutions').append(b);}
 $('next').hidden=false;draw();
}
function finishSet(complete,giveup=false){
 if(state!=='choose')return;const remaining=allHaps.filter(s=>!found.has(s.join(',')));
 if(!complete&&!giveup){score--;status('아직 찾지 못한 합이 있습니다. −1점. 계속 찾아보세요.');draw();return;}
 if(complete)score+=3;state='review';endReview(complete?'결! 모든 합을 찾았습니다.':'남은 합을 확인하세요.',complete?'결 선언 성공 · +3점':'정답 조합 버튼을 누르면 해당 그림이 강조됩니다.');
 for(const s of allHaps){const b=document.createElement('button');b.textContent=s.map(i=>i+1).join(' · ')+(found.has(s.join(','))?' ✓':'');if(found.has(s.join(',')))b.classList.add('found');b.onclick=()=>{selected=[...s];draw();};$('solutions').append(b);}
 if(!allHaps.length)$('solutions').textContent='이 판에는 합이 없습니다.';$('next').hidden=false;draw();
}
function tick(){
 if(state!=='memorize'&&state!=='answer')return;const sec=Math.max(0,Math.ceil((deadline-Date.now())/1000));$('clock').textContent=sec+'초';if(sec)return;if(state==='memorize')newNumberRound();else numberFinish(false,'답변 시간이 끝났습니다.');
}
$('start').onclick=start;$('restart').onclick=()=>{state='idle';$('setup').hidden=false;$('review').hidden=true;$('next').hidden=true;selected=[];exposed.clear();$('clock').textContent=mode==='same-number'?'05초':'준비';status('시작하면 새로운 판이 생성됩니다.');draw();};
$('buzz').onclick=()=>{if(state!=='choose')return;state='answer';selected=[];deadline=Date.now()+(practice?15000:5000);status('숫자 → 기호 → 숫자 순서로 3개를 고르고 제출하세요.');draw();tick();};
$('clear').onclick=()=>{if(state==='answer'){selected=[];draw();}};
$('submit').onclick=()=>{if(state!=='answer'||selected.length!==3)return;if(Date.now()>=deadline){numberFinish(false,'답변 시간이 끝났습니다.');return;}const value=E.calculate(...selected.map(i=>board[i]));numberFinish(value===target,value===target?'+1점':`타깃 ${target}와 일치하지 않습니다.`);};
$('hap').onclick=()=>{if(state!=='choose'||selected.length!==3)return;const key=[...selected].sort((a,b)=>a-b).join(',');if(found.has(key)){score--;status('이미 찾은 합입니다. −1점.');}else if(E.isHap(selected.map(i=>board[i]))){found.add(key);score++;status('합! +1점. 다른 조합을 찾거나 결을 선언하세요.');const tag=document.createElement('span');tag.className='badge';tag.textContent=[...selected].sort((a,b)=>a-b).map(i=>i+1).join(' · ');$('foundList').append(tag);}else{score--;status('합이 아닙니다. −1점. 각 속성이 모두 같거나 모두 다른지 확인하세요.');}selected=[];draw();};
$('gyul').onclick=()=>finishSet(found.size===allHaps.length);
$('giveup').onclick=()=>{if(mode==='same-number')numberFinish(false,'문제를 포기했습니다.');else if(mode==='gyul-hap')finishSet(false,true);else{state='ended';endReview('그림판을 공개합니다.','알파벳과 그림의 위치를 확인하세요.');draw();}};
$('next').onclick=()=>{
 if(mode==='same-picture'){state='choose';selected=[];exposed.clear();pictureTarget=belt[position];$('next').hidden=true;status('다음 칸과 같은 그림을 찾아보세요.');draw();return;}
 if(round===10){state='ended';selected=[];exposed.clear();endReview('연습 완료',`총점 ${score}점 · 새 게임으로 다시 도전할 수 있습니다.`);draw();return;}
 if(mode==='same-number')newNumberRound();else{newSetRound();draw();}
};
board=mode==='gyul-hap'?E.shuffle(E.setDeck()).slice(0,9):mode==='same-picture'?Array.from({length:16},(_,i)=>i):E.numberBoard();draw();setInterval(tick,100);
})();
