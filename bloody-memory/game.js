'use strict';
(function(){
const E=BloodyMemory,$=id=>document.getElementById(id),pattern=document.body.dataset.game==='pattern-block',total=pattern?6:3;
let phase='idle',practice=false,run=null,round=0,score=0,deadline=Infinity,retryAt=0,started=0,stopped=0;
let placements=[],active=1,undoHistory=[],moving=null,failedPair=[],selected=[],removed=new Set(),peek=-1,peekUntil=0,peekPending=false,openUsed=false,doubleUsed=false,doubleLeft=0,answer='',attempts=0;
const current=()=>pattern?run.questions[round]:run[round],map=()=>run.maps[Math.floor(round/3)],playing=()=>phase==='play'&&peek<0&&!peekPending;
function button(text,fn,cls='secondary'){const b=document.createElement('button');b.type='button';b.textContent=text;b.className=cls;b.onclick=fn;return b;}
function status(text,type=''){const s=$('status');s.textContent=text;s.className='status message '+type;}
const time=ms=>Math.floor(ms/60000)+':'+String(Math.floor(ms/1000)%60).padStart(2,'0');
function study(){phase='study';deadline=practice?Infinity:Date.now()+(pattern?(round%3===0?60000:10000):(round+1)*10000);started=stopped=0;placements=[];active=1;undoHistory=[];moving=null;failedPair=[];selected=[];removed=new Set();peek=-1;peekPending=false;doubleLeft=0;answer='';$('review').hidden=true;status(pattern?'패턴과 번호의 대응을 기억하세요.':'같은 그림 두 개의 위치를 기억하세요. 숨은 글자는 아직 공개되지 않습니다.');render();}
function start(){practice=$('mode').value==='practice';run=pattern?E.patternRun():E.hiddenRun();round=score=attempts=0;openUsed=doubleUsed=false;study();}
function begin(){if(phase!=='study')return;phase='play';deadline=Infinity;started=Date.now();status(pattern?'숫자를 고르고 원하는 칸에 한 개씩 배치하세요.':'같은 그림의 번호 두 개를 고르거나, 열린 글자에서 히든미션의 답을 추리하세요.');render();}
function chooseNumber(value){if(phase!=='play')return;active=value;moving=null;render();}
function editBoard(action){if(phase!=='play')return;const next=E.editCells(current(),placements,action);if(JSON.stringify(next)===JSON.stringify(placements))return;undoHistory.push(placements);if(undoHistory.length>100)undoHistory.shift();placements=next;moving=null;render();}
function putNumber(x,y){if(moving){editBoard({type:'move',from:moving,x,y});moving=null;render();}else editBoard({type:'place',x,y,value:active});}
function mapBoard(showPatterns,solution=false){const grid=document.createElement('div');grid.className='pattern-map memory-grid';map().forEach((id,i)=>{const cell=document.createElement('div');cell.className='memory-cell reference-cell';cell.innerHTML=showPatterns?'<small>'+(i+1)+'</small>'+E.patternSVG(id,(i+1)+'번 패턴'):String(i+1);if(!showPatterns)cell.className+=' covered';if(solution)cell.className+=' solution-cell';grid.append(cell);});return grid;}
function targetSVG(q,solution=false){const size=70;return '<svg class="pattern-target" viewBox="0 0 '+q.width*size+' '+q.height*size+'" role="img" aria-label="재현할 목표 패턴"><g>'+q.cells.map(c=>'<g transform="translate('+c.x*size+' '+c.y*size+')"><rect width="70" height="70" fill="#f4f2e9" stroke="#b7b9b6"/>'+'<g transform="scale(.7)">'+E.patternSVG(c.pattern,'목표 그림').replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')+'</g>'+(solution?'<rect x="2" y="2" width="24" height="22" rx="3" fill="#102033"/><text x="14" y="18" text-anchor="middle" fill="#fff" font-size="15" font-family="sans-serif">'+c.value+'</text>':'')+'</g>').join('')+'</g></svg>';}
function renderPattern(){
 const board=$('board');if(phase==='study'){const p=document.createElement('p');p.className='memory-instruction';p.textContent='번호 1~25와 선의 방향을 함께 기억하세요.';board.append(p,mapBoard(true));}
 else{
  const assembly=document.createElement('div');assembly.className='block-assembly';const target=document.createElement('section');target.className='assembly-pane';target.innerHTML='<h2>목표 그림</h2>'+targetSVG(current());
  const build=document.createElement('section');build.className='assembly-pane';const title=document.createElement('h2');title.textContent='나의 숫자 블록';const grid=document.createElement('div');grid.className='build-grid';grid.style.gridTemplateColumns='repeat('+current().width+',minmax(0,1fr))';
  const occupied=placements,shape=new Set(current().cells.map(c=>c.x+','+c.y));
  for(let y=0;y<current().height;y++)for(let x=0;x<current().width;x++){
   if(!shape.has(x+','+y)){const gap=document.createElement('span');gap.className='build-gap';grid.append(gap);continue;}
   const cell=occupied.find(c=>c.x===x&&c.y===y),b=button(cell?String(cell.value):'·',()=>putNumber(x,y),'build-cell'+(cell?' occupied':'')+(moving&&moving.x===x&&moving.y===y?' picked':''));b.id='place-'+x+'-'+y;b.disabled=phase!=='play';b.setAttribute('aria-label',(y+1)+'행 '+(x+1)+'열 '+(cell?cell.value:'빈칸'));b.draggable=phase==='play'&&!!cell;
   b.onkeydown=e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();editBoard({type:'place',x,y,value:null});}};
   b.oncontextmenu=e=>{e.preventDefault();if(phase==='play'&&cell){moving={x,y};status('이동할 칸을 누르세요. 이미 숫자가 있으면 서로 바꿉니다.');render();}};
   b.ondragstart=e=>e.dataTransfer.setData('text/plain',JSON.stringify({type:'move',from:{x,y}}));b.ondragover=e=>{if(phase==='play')e.preventDefault();};b.ondrop=e=>{e.preventDefault();try{const data=JSON.parse(e.dataTransfer.getData('text/plain'));editBoard({...data,x,y});}catch{}};grid.append(b);
  }
  build.append(title,grid);assembly.append(target,build);board.append(assembly);
  const reference=document.createElement('details');reference.className='number-reference';const summary=document.createElement('summary');summary.textContent='숫자로 가려진 암기판';reference.append(summary,mapBoard(false));board.append(reference);
 }
 if(phase==='play'){
  const bank=document.createElement('div');bank.className='number-palette';bank.setAttribute('aria-label','개별 숫자 블록');for(let n=1;n<=25;n++){const pick=button(String(n),()=>chooseNumber(n),'number-tile'+(active===n&&!moving?' active':''));pick.id='number-'+n;pick.setAttribute('aria-pressed',String(active===n&&!moving));pick.draggable=true;pick.ondragstart=e=>e.dataTransfer.setData('text/plain',JSON.stringify({type:'place',value:n}));bank.append(pick);}board.append(bank);
  const controls=document.createElement('div');controls.className='workspace-tools';const erase=button('지우개',()=>chooseNumber(null));erase.id='eraseBlock';erase.setAttribute('aria-pressed',String(active===null&&!moving));const move=button('이동 / 교환',()=>{active=null;moving=null;status('옮길 숫자를 먼저 누르고, 이동할 칸을 누르세요.');const occupiedButtons=placements.map(c=>$('place-'+c.x+'-'+c.y));occupiedButtons.forEach(b=>b.onclick=()=>{const c=placements.find(c=>'place-'+c.x+'-'+c.y===b.id);moving={x:c.x,y:c.y};status('이동할 칸을 누르세요. 숫자가 있는 칸은 서로 교환합니다.');render();});});move.id='moveBlock';move.disabled=!placements.length;
  const undo=button('되돌리기',()=>{if(undoHistory.length){placements=undoHistory.pop();moving=null;render();}});undo.id='undoBlock';undo.disabled=!undoHistory.length;
  const clear=button('배치 초기화',()=>{if(placements.length){undoHistory.push(placements);placements=[];moving=null;render();}});clear.id='clearBlocks';clear.disabled=!placements.length;controls.append(erase,move,undo,clear);board.append(controls);
 }
 const help=document.createElement('p');help.className='memory-note';help.textContent='숫자 선택 → 원하는 칸을 눌러 배치·교체합니다. 같은 숫자를 여러 번 쓸 수 있습니다. 끌어 놓거나 이동 / 교환으로 한 칸씩 옮기세요. 지우개와 되돌리기도 사용할 수 있습니다.';board.append(help);
 $('submitPair').textContent='블록 배치 정답 제출';$('submitPair').hidden=phase==='study';$('submitPair').disabled=phase!=='play';$('missionArea').hidden=true;$('items').hidden=true;
}
function hiddenCell(i){
 if(phase!=='play')return;if(peek>=0)return;
 if(peekPending){if(removed.has(i))return;openUsed=true;peekPending=false;peek=i;peekUntil=Date.now()+3000;selected=[];status('오픈 · 3초 동안 이 그림만 확인할 수 있습니다. 숨은 글자는 열리지 않습니다.');render();return;}
 if(removed.has(i))return;selected=selected.includes(i)?selected.filter(n=>n!==i):selected.length<2?[...selected,i]:[selected[1],i];render();
}
function renderHidden(){
 const p=current(),heading=document.createElement('p');heading.className='memory-instruction';heading.textContent=E.HIDDEN_THEMES[p.theme].label+' · '+E.HIDDEN_THEMES[p.theme].hint;$('board').append(heading);const grid=document.createElement('div');grid.className='hidden-board memory-grid';
 p.faces.forEach((symbol,i)=>{const show=phase==='study'||peek===i||failedPair.includes(i),open=removed.has(i),b=button('',()=>hiddenCell(i),'memory-cell'+(show?' picture':open?' revealed':' covered')+(selected.includes(i)?' selected':'')+(peek===i?' peek':''));b.id='tile-'+i;b.disabled=phase!=='play'||open;b.innerHTML=show?'<small>'+(i+1)+'</small>'+E.hiddenSymbolSVG(symbol,(i+1)+'번 그림'):open?'<small>'+(i+1)+'</small><strong>'+(p.letters[i]===' '?'':p.letters[i])+'</strong>':String(i+1);b.setAttribute('aria-label',(i+1)+'번 '+(show?'그림':open?'공개 '+(p.letters[i]===' '?'빈칸':p.letters[i]):'가려진 블록'));b.setAttribute('aria-pressed',String(selected.includes(i)));grid.append(b);});$('board').append(grid);
 if(phase!=='study'){const fragment=document.createElement('p');fragment.className='mission-fragment';fragment.setAttribute('aria-label','현재 공개된 문장');fragment.textContent=p.letters.map((ch,i)=>removed.has(i)?ch:'□').join('');$('board').append(fragment);}
 const note=document.createElement('p');note.className='memory-note';note.textContent=phase==='study'?'각 그림이 정확히 두 번씩 나옵니다. 번호와 위치를 함께 기억하세요.':'열린 쌍 '+removed.size/2+' / 18 · 선택 '+(selected.length?selected.map(i=>i+1).join(' + '):'없음')+(doubleLeft?' · 더블 '+doubleLeft+'쌍 남음':'');$('board').append(note);
 $('submitPair').textContent='이 두 번호 · 같은 그림 선언';$('submitPair').hidden=phase==='study';$('submitPair').disabled=!playing()||selected.length!==2;$('missionArea').hidden=phase==='study';$('items').hidden=phase==='study';$('missionAnswer').value=answer;$('missionAnswer').disabled=!playing();$('guessMission').disabled=!playing();$('doubleItem').disabled=!playing()||doubleUsed||removed.size===36;$('doubleItem').textContent=doubleUsed?'더블 · 사용함':'더블 · 한 번만';$('openItem').disabled=phase!=='play'||openUsed||peek>=0||removed.size===36;$('openItem').textContent=peekPending?'오픈 취소':openUsed?'오픈 · 사용함':'오픈 · 한 번만';
}
function render(){
 $('setup').hidden=phase!=='idle';$('begin').hidden=phase!=='study';$('giveup').disabled=!['play','cooldown'].includes(phase);$('next').hidden=phase!=='review'||round===total-1;$('next').textContent=pattern?(round%3===2?'새 판 · 60초 암기 →':'같은 판 · 다시 암기 →'):'다음 라운드 →';$('restart').hidden=phase==='idle';$('score').textContent=String(score);$('round').textContent=phase==='idle'?'준비':(round+1)+' / '+total;$('board').replaceChildren();
 if(phase==='idle'){const ready=document.createElement('div');ready.className='ready';ready.innerHTML='<span>BRAIN ARENA · SOLO</span><strong>'+(pattern?'패턴블록':'히든미션')+'</strong><p>규칙을 확인하고 시작하세요.</p>';$('board').append(ready);$('submitPair').hidden=$('missionArea').hidden=$('items').hidden=true;}
 else if(pattern)renderPattern();else renderHidden();clock();
}
function wrong(text){attempts++;phase='cooldown';retryAt=Date.now()+(pattern?30000:10000);status(text+' '+(pattern?30:10)+'초 뒤 다시 도전할 수 있습니다.','bad');render();}
function submitPair(){
 if(phase!=='play')return;
 if(pattern){if(placements.length!==current().cells.length){status('목표 그림의 모든 칸에 숫자를 배치하세요.');return;}if(E.validCells(current(),placements)){score++;finish('정답! · +1점');}else wrong('목표 그림과 일치하지 않습니다.');return;}
 if(!playing()||selected.length!==2)return;
 if(E.isPair(current(),selected,[...removed])){selected.forEach(i=>removed.add(i));const gain=doubleLeft===1?2:1;score+=gain;if(doubleLeft)doubleLeft--;selected=[];status('같은 그림! +'+gain+'점 · 뒤의 글자가 열렸습니다.','good');render();}
 else{const penalty=doubleLeft>0;if(penalty){score--;doubleLeft=0;}failedPair=[...selected];selected=[];wrong('서로 다른 그림입니다. 선택한 두 그림을 확인하세요.'+(penalty?' 더블 오답으로 −1점.':''));}
}
function guess(){if(pattern||!playing())return;if(!answer.trim()){status('히든미션의 답을 입력하세요.');return;}if(E.correctMission(current(),answer)){score+=3;finish('히든미션 정답! · +3점');}else wrong('히든미션의 정답이 아닙니다.');}
function finish(title){phase='review';failedPair=[];stopped=Date.now();peek=-1;peekPending=false;deadline=Infinity;$('resultTitle').textContent=round===total-1?title+' · 전체 종료':title;$('resultText').textContent='누적 '+score+'점 · 이번 풀이 '+time(started?stopped-started:0)+' · 누적 오답 '+attempts+'회';status(title,'good');render();$('review').hidden=false;const solutions=$('solutions');solutions.replaceChildren();
 if(pattern){const row=document.createElement('div');row.className='block-solution';row.innerHTML='<h3>정답 번호와 목표 그림</h3>'+targetSVG(current(),true);solutions.append(row);const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent='이 문제의 전체 암기판 확인';details.append(summary,mapBoard(true,true));solutions.append(details);const text=document.createElement('p');text.className='memory-note';text.textContent='각 칸에 표시된 번호가 정답입니다. 숫자 블록은 한 칸씩 독립적으로 배치합니다.';solutions.append(text);}
 else{const text=document.createElement('p');text.className='mission-full';text.textContent=current().mission.question;const a=document.createElement('h3');a.textContent='정답: '+current().mission.answers[0];solutions.append(text,a);const pairs=document.createElement('div');pairs.className='pair-solutions';for(const symbol of new Set(current().faces)){const positions=current().faces.map((v,i)=>v===symbol?i+1:null).filter(Boolean),p=document.createElement('p');p.innerHTML=E.hiddenSymbolSVG(symbol,'정답 그림')+'<span>'+positions.join(' + ')+'</span>';pairs.append(p);}solutions.append(pairs);}
}
function next(){if(phase!=='review'||round>=total-1)return;round++;study();}
function clock(){const now=Date.now();$('clock').textContent=phase==='idle'?'준비':phase==='study'?Number.isFinite(deadline)?Math.max(0,Math.ceil((deadline-now)/1000))+'초':'암기 시간 제한 없음':phase==='cooldown'?Math.max(0,Math.ceil((retryAt-now)/1000))+'초 후 재도전':phase==='review'?'완료':peek>=0?'오픈 '+Math.max(0,Math.ceil((peekUntil-now)/1000))+'초':'풀이 시간 제한 없음';$('elapsed').textContent=started?time((stopped||now)-started):'0:00';}
function tick(){clock();if(phase==='study'&&Date.now()>=deadline){begin();return;}if(phase==='cooldown'&&Date.now()>=retryAt){phase='play';failedPair=[];status('다시 도전할 수 있습니다.');render();}if(phase==='play'&&peek>=0&&Date.now()>=peekUntil){peek=-1;status('오픈이 끝났습니다. 기억한 위치를 활용하세요.');render();}}
$('start').onclick=start;$('begin').onclick=begin;$('submitPair').onclick=submitPair;$('guessMission').onclick=guess;$('missionAnswer').oninput=()=>answer=$('missionAnswer').value;$('missionAnswer').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();guess();}};$('giveup').onclick=()=>{if(['play','cooldown'].includes(phase))finish('정답 공개 · 득점 없음');};$('next').onclick=next;$('restart').onclick=()=>{phase='idle';run=null;started=stopped=0;score=round=0;answer='';$('review').hidden=true;status('준비되면 시작하세요.');render();};$('doubleItem').onclick=()=>{if(pattern||!playing()||doubleUsed)return;doubleUsed=true;doubleLeft=2;status('더블: 다음 두 쌍은 +1점, +2점. 도중 오답이면 −1점 후 종료됩니다.');render();};$('openItem').onclick=()=>{if(pattern||phase!=='play'||openUsed||peek>=0)return;peekPending=!peekPending;selected=[];status(peekPending?'그림을 잠깐 확인할 번호 하나를 누르세요.':'오픈 선택을 취소했습니다.');render();};render();setInterval(tick,100);
})();
