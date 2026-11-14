'use strict';
(function(){
const E=ArenaPuzzles,$=id=>document.getElementById(id),kind=document.body.dataset.puzzle;
const generators={'scale-balance':E.scale,'time-shift':E.time,'pixel-art':E.art,'block-count':E.blocks};
const isPattern=kind==='same-pattern',titles={'scale-balance':'저울','time-shift':'시간이동','pixel-art':'픽셀아트','block-count':'블록 개수 세기','same-pattern':'같은 패턴 찾기'};
let phase='idle',puzzle=null,level=1,round=1,score=0,started=0,stopped=0,deadline=Infinity,retryAt=0,cleared=false,practice=true;
let counts=[],slots=[],activeSlot=0,selected=[],rotations=Array(9).fill(0),blockAnswer='',patternAnswer='',found=[],patternRun=[],seen=new Set();
const arrows=['↑','→','↓','←'];
function button(text,fn,cls='secondary'){const b=document.createElement('button');b.type='button';b.textContent=text;b.className=cls;b.onclick=fn;return b;}
function message(text,type=''){const s=$('status');s.textContent=text;s.className='status message '+type;}
const editable=()=>phase==='play';
function timeString(ms){return Math.floor(ms/60000)+':'+String(Math.floor(ms/1000)%60).padStart(2,'0');}
function progress(){const el=$('levelProgress');el.hidden=isPattern;if(!isPattern)el.innerHTML='<div class="level-heading"><b>'+level+'단계 / 5</b><span>정답이면 다음 단계 · 포기하면 같은 단계</span></div><div class="level-steps">'+Array.from({length:5},(_,i)=>'<span class="'+(i+1===level?'active':i+1<level?'done':'')+'">'+(i+1)+'</span>').join('')+'</div>';}
function clearInputs(){counts=puzzle.values?Array(puzzle.values.length).fill(0):[];slots=puzzle.cards&&kind==='time-shift'?Array(puzzle.cards.length).fill(null):[];activeSlot=0;selected=[];rotations=Array(9).fill(0);blockAnswer='';patternAnswer='';found=[];}
function draw(){
 cleared=false;stopped=0;retryAt=0;phase='play';started=Date.now();deadline=practice?Infinity:started+120000;
 if(isPattern)puzzle=patternRun[round-1];else{for(let i=0;i<100;i++){puzzle=generators[kind](level);const key=JSON.stringify(puzzle);if(!seen.has(key)){seen.add(key);break;}}}
 clearInputs();$('review').hidden=true;message(isPattern?'같은 2×2 패턴의 왼쪽 위 칸을 고르세요. 모두 찾았다고 생각하면 끝을 선언하세요.':'문제를 풀고 정답을 제출하세요.');render();
}
function start(){practice=$('mode').value==='practice';score=0;level=1;round=1;seen=new Set();if(isPattern)patternRun=[...E.patternSet(),...E.patternSet()];draw();}
function render(){
 $('setup').hidden=phase!=='idle';$('score').textContent=String(score);$('round').textContent=phase==='idle'?'준비':isPattern?round+' / 6':level+' / 5';$('roundLabel').textContent=isPattern?'라운드':'단계';
 $('giveup').disabled=!['play','cooldown'].includes(phase);$('next').hidden=phase!=='review'||(!isPattern&&level===5&&cleared)||(isPattern&&round===6);$('next').textContent=isPattern?'다음 라운드 →':cleared?'다음 단계 →':'같은 단계 · 새 문제 →';
 progress();$('board').replaceChildren();$('answerArea').replaceChildren();$('actions').replaceChildren();
 if(!puzzle){$('board').innerHTML='<div class="ready"><span>BRAIN ARENA · SOLO</span><strong>'+titles[kind]+'</strong><p>규칙을 확인하고 시작하세요.</p></div>';tickClock();return;}
 if(kind==='scale-balance')renderScale();else if(kind==='time-shift')renderTime();else if(kind==='pixel-art')renderArt();else if(kind==='block-count')renderBlocks();else renderPattern();
 if(['play','cooldown'].includes(phase)){
  const submit=button(isPattern?'이 좌표 정답 제출':'정답 제출',submitAnswer,'primary wide');submit.id='submit';submit.disabled=!editable();$('actions').append(submit);
  if(isPattern){const end=button('끝! · 더 이상 패턴이 없습니다',endPattern,'secondary wide');end.id='declareEnd';end.disabled=!editable();$('actions').append(end);}
  else{const reset=button('입력 초기화',()=>{if(!editable())return;clearInputs();render();},'secondary wide');reset.disabled=!editable();$('actions').append(reset);}
 }
 tickClock();
}
function renderScale(){
 const board=$('board'),info=document.createElement('div');info.className='puzzle-instruction';info.innerHTML='<span>모두 사용하세요</span><strong>추 '+puzzle.count+'개</strong><p>한 칸에 여러 개를 올릴 수 있습니다. 칸의 숫자는 추 한 개의 값입니다.</p>';board.append(info);
 const slotsEl=document.createElement('div');slotsEl.className='scale-slots';
 puzzle.values.forEach((v,i)=>{if(i===3){const gap=document.createElement('span');gap.className='scale-gap';slotsEl.append(gap);}const wrap=document.createElement('div');wrap.className='scale-slot';const add=button('',()=>{if(!editable())return;if(E.sum(counts)>=puzzle.count){message('추를 모두 사용했습니다. 다른 칸의 추를 먼저 빼세요.');return;}counts[i]++;render();},'scale-place');add.innerHTML='<b>'+v+'</b><span class="scale-counters">'+(counts[i]?Array.from({length:counts[i]},()=>'<i></i>').join(''):'<small>＋</small>')+'</span><span class="scale-count">'+counts[i]+'개</span>';add.setAttribute('aria-label',(i<3?'왼쪽 ':'오른쪽 ')+v+'칸에 추 추가 · 현재 '+counts[i]+'개');add.id='scale-place-'+i;add.disabled=!editable();const remove=button('−',()=>{if(editable()&&counts[i]){counts[i]--;render();}},'scale-remove');remove.setAttribute('aria-label',(i<3?'왼쪽 ':'오른쪽 ')+v+'칸 추 하나 빼기');remove.disabled=!editable()||!counts[i];wrap.append(add,remove);slotsEl.append(wrap);});
 board.append(slotsEl);const beam=document.createElement('div');beam.className='balance-beam';beam.innerHTML='<svg viewBox="0 0 760 90" aria-hidden="true"><path d="M22 15H738M380 15V70M335 78 380 15 425 78Z" fill="#243c56" stroke="#83e2cc" stroke-width="5" stroke-linejoin="round"/></svg>';board.append(beam);
 const remain=document.createElement('p');remain.className='scale-stock';remain.textContent='사용 '+E.sum(counts)+' / '+puzzle.count+'개 · 남은 추 '+(puzzle.count-E.sum(counts))+'개';board.append(remain);
}
function putNumber(index,value){if(!editable())return;const old=slots.indexOf(value);if(old>=0)slots[old]=null;slots[index]=value;activeSlot=slots.indexOf(null);render();}
function renderTime(){
 const statement=document.createElement('div');statement.className='time-statement';puzzle.parts.forEach(part=>{if(typeof part==='string'){const t=document.createElement('span');t.textContent=part;statement.append(t);}else{const i=part.slot,b=button(slots[i]===null?'?':String(slots[i]),()=>{if(!editable())return;slots[i]=null;activeSlot=i;render();},'time-slot'+(activeSlot===i?' active':''));b.id='time-slot-'+i;b.disabled=!editable();b.setAttribute('aria-label','빈칸 '+(i+1)+(slots[i]===null?' 비어 있음':' 값 '+slots[i]));b.ondragover=e=>{if(editable())e.preventDefault();};b.ondrop=e=>{e.preventDefault();const value=Number(e.dataTransfer.getData('text/plain'));if(puzzle.cards.includes(value))putNumber(i,value);};statement.append(b);}});$('board').append(statement);
 const note=document.createElement('p');note.className='puzzle-note';note.textContent='24시간제 · 0시~23시 · 자정을 지나면 다음 날(또는 전날)로 이어집니다.';$('board').append(note);
 const deck=document.createElement('div');deck.className='time-deck';puzzle.cards.forEach(value=>{const b=button(String(value),()=>{if(activeSlot<0)return;putNumber(activeSlot,value);},'time-card');b.id='time-card-'+value;b.disabled=!editable()||slots.includes(value);b.draggable=editable();b.ondragstart=e=>e.dataTransfer.setData('text/plain',String(value));deck.append(b);});$('board').append(deck);
 const help=document.createElement('p');help.className='puzzle-note';help.textContent='숫자를 누르거나 빈칸으로 끌어 놓으세요. 채운 빈칸을 누르면 숫자를 돌려놓습니다.';$('board').append(help);
}
function pixelSVG(values,label='픽셀 그림'){return '<svg class="art-pixels" viewBox="0 0 96 96" role="img" aria-label="'+label+'">'+values.map((v,i)=>'<rect x="'+(i%3*32)+'" y="'+(Math.floor(i/3)*32)+'" width="32" height="32" fill="'+E.PIXEL_COLORS[v]+'" stroke="#17283e" stroke-width="1"/>').join('')+'</svg>';}
function renderArt(){
 const heading=document.createElement('div');heading.className='art-target';heading.innerHTML='<div><span class="eyebrow">TARGET</span><h2>이 그림을 완성하세요</h2><p>9장 중 3장 · 회전 가능 · 뒤집기 불가</p></div>'+pixelSVG(puzzle.target,'완성할 타깃 그림');$('answerArea').append(heading);
 const cards=document.createElement('div');cards.className='art-deck';puzzle.cards.forEach((card,id)=>{const wrap=document.createElement('div');wrap.className='art-card'+(selected.includes(id)?' chosen':'');const choose=button('',()=>{if(!editable())return;const i=selected.indexOf(id);if(i>=0)selected.splice(i,1);else if(selected.length<3)selected.push(id);else{message('세 장을 이미 골랐습니다. 먼저 한 장의 선택을 해제하세요.');return;}render();},'art-select');choose.id='art-select-'+id;choose.innerHTML='<span class="art-number">'+(id+1)+'</span>'+pixelSVG(E.rotated(card,rotations[id]),(id+1)+'번 카드 '+rotations[id]*90+'도');choose.setAttribute('aria-pressed',String(selected.includes(id)));choose.setAttribute('aria-label',(id+1)+'번 카드 선택');choose.disabled=!editable();const rotate=button('↻ '+rotations[id]*90+'°',()=>{if(editable()){rotations[id]=(rotations[id]+1)%4;render();}},'art-rotate');rotate.id='art-rotate-'+id;rotate.setAttribute('aria-label',(id+1)+'번 카드 시계방향 90도 회전');rotate.disabled=!editable();wrap.append(choose,rotate);cards.append(wrap);});$('board').append(cards);
 const chosen=document.createElement('p');chosen.className='puzzle-note';chosen.textContent=selected.length?'선택: '+selected.map(id=>(id+1)+'번 ('+rotations[id]*90+'°)').join(' + '):'카드 세 장을 고른 뒤 정답을 제출하세요.';$('answerArea').append(chosen);
}
function numericInput(label,value,setValue,placeholder){const wrap=document.createElement('label');wrap.className='puzzle-answer';const text=document.createElement('span');text.textContent=label;const input=document.createElement('input');input.id='answer';input.value=value;input.type='text';input.inputMode=kind==='same-pattern'?'text':'numeric';input.autocomplete='off';input.placeholder=placeholder;input.disabled=!editable();input.oninput=()=>setValue(input.value);input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();submitAnswer();}};wrap.append(text,input);$('answerArea').append(wrap);}
function renderBlocks(){const model=document.createElement('div');model.className='block-scene';model.innerHTML=E.blockSVG(puzzle);$('board').append(model);const note=document.createElement('p');note.className='puzzle-note';note.textContent='같은 크기의 정육면체입니다. 각 기둥은 바닥부터 빈틈없이 채워져 있습니다. 가려진 받침 블록도 세세요.';$('board').append(note);numericInput('전체 블록 개수',blockAnswer,v=>blockAnswer=v,'개수 입력');}
function patternCoord(i){return String.fromCharCode(65+Math.floor(i/10))+(i%10+1);}
function readCoord(value){const m=value.trim().toUpperCase().match(/^([A-G])([1-9])$/);return m?(m[1].charCodeAt(0)-65)*10+(+m[2]-1):null;}
function patternHTML(a){return '<div class="pattern-target-grid" aria-label="2행 2열 목표 패턴">'+a.map(d=>'<span>'+arrows[d]+'</span>').join('')+'</div>';}
function renderPattern(){
 const target=document.createElement('div');target.className='pattern-target';target.innerHTML='<div><span class="eyebrow">TARGET PATTERN</span><h2>같은 패턴을 찾으세요</h2><p>정방향과 회전만 인정 · 대칭 반전은 제외</p></div>'+patternHTML(puzzle.target);$('answerArea').append(target);
 const grid=document.createElement('div');grid.className='pattern-board';grid.append(document.createElement('span'));for(let x=1;x<=10;x++){const label=document.createElement('span');label.className='pattern-axis';label.textContent=String(x);grid.append(label);}
 const selectedAt=readCoord(patternAnswer),known=phase==='review'?puzzle.solutions:found,matched=new Set(known.flatMap(i=>[i,i+1,i+10,i+11])),highlight=new Set(selectedAt===null?[]:[selectedAt,selectedAt+1,selectedAt+10,selectedAt+11]);
 puzzle.board.forEach((row,y)=>{const label=document.createElement('span');label.className='pattern-axis';label.textContent=String.fromCharCode(65+y);grid.append(label);row.forEach((d,x)=>{const i=y*10+x,b=button(arrows[d],()=>{if(editable()){patternAnswer=patternCoord(i);render();}},'pattern-cell'+(matched.has(i)?' matched':'')+(highlight.has(i)?' selected':''));b.disabled=!editable()||x===9||y===7;b.setAttribute('aria-label',patternCoord(i)+' '+['위','오른쪽','아래','왼쪽'][d]+' 화살표');b.id='pattern-cell-'+i;grid.append(b);});});$('board').append(grid);
 numericInput('패턴 왼쪽 위 좌표',patternAnswer,v=>patternAnswer=v,'예: A1');const note=document.createElement('p');note.className='puzzle-note';note.textContent='찾은 좌표: '+(found.length?found.map(patternCoord).join(' · '):'아직 없음')+' · 남은 개수는 공개하지 않습니다.';$('answerArea').append(note);
}
function wrong(text){phase='cooldown';retryAt=Date.now()+10000;message(text+' 10초 뒤 다시 답할 수 있습니다.','bad');render();}
function submitAnswer(){
 if(!editable())return;
 if(isPattern){const at=readCoord(patternAnswer);if(at===null){message('A1~G9 범위의 왼쪽 위 좌표를 입력하세요.');return;}const result=E.patternAction(puzzle,found,at);score+=result.delta;found=result.found;patternAnswer='';if(result.delta<0)wrong('오답 또는 이미 찾은 좌표입니다. −1점.');else{message('정답! '+patternCoord(at)+' · +1점. 다른 패턴을 찾거나 끝을 선언하세요.','good');render();}return;}
 let correct=false;
 if(kind==='scale-balance'){if(E.sum(counts)!==puzzle.count){message('추 '+puzzle.count+'개를 모두 사용하세요.');return;}correct=E.validScale(puzzle,counts);}
 if(kind==='time-shift'){if(slots.some(v=>v===null)){message('모든 숫자를 한 번씩 사용해 빈칸을 채우세요.');return;}correct=E.validTime(puzzle,slots);}
 if(kind==='pixel-art'){if(selected.length!==3){message('서로 다른 카드 세 장을 선택하세요.');return;}correct=E.validArt(puzzle,selected.map(id=>({id,rotation:rotations[id]})));}
 if(kind==='block-count'){if(!/^\d+$/.test(blockAnswer.trim())){message('블록 개수를 정수로 입력하세요.');return;}correct=+blockAnswer===puzzle.answer;}
 if(correct){score++;cleared=true;finish(level===5?'전체 5단계 클리어!':level+'단계 정답!','+1점 · 정답과 풀이를 확인하세요.');}else wrong('정답과 일치하지 않습니다.');
}
function endPattern(){if(!editable())return;const result=E.patternAction(puzzle,found,'end');score+=result.delta;if(result.complete)finish(round===6?'6라운드 종료!':'끝! · +3점','더 이상 찾을 패턴이 없습니다. 모든 정답을 공개합니다.');else wrong('아직 찾지 않은 패턴이 있습니다. −2점.');}
function equation(counts){return[0,1].map(side=>counts.slice(side*3,side*3+3).map((n,i)=>n?puzzle.values[side*3+i]+'×'+n:null).filter(Boolean).join(' + ')).join(' = ');}
function finish(title,text){message(title,cleared||title.includes('끝!')?'good':'');phase='review';stopped=Date.now();deadline=Infinity;$('resultTitle').textContent=title;$('resultText').textContent=text+' · 점수 '+score+'점 · 풀이 시간 '+timeString(stopped-started);render();$('review').hidden=false;const out=$('solutions');out.replaceChildren();$('reviewVisual').replaceChildren();
 if(kind==='scale-balance'){const a=cleared?[...counts]:puzzle.sample;out.textContent='추 '+puzzle.count+'개를 사용한 한 가지 정답: '+equation(a);}
 else if(kind==='time-shift'){const a=cleared?[...slots]:puzzle.sample;out.textContent=puzzle.parts.map(part=>typeof part==='string'?part:a[part.slot]).join('');}
 else if(kind==='pixel-art'){const a=cleared?selected.map(id=>({id,rotation:rotations[id]})):puzzle.sample;out.textContent=a.map(s=>(s.id+1)+'번 '+s.rotation*90+'°').join(' + ');$('reviewVisual').innerHTML='<div class="art-solution">'+a.map(s=>pixelSVG(E.rotated(puzzle.cards[s.id],s.rotation))).join('<b>＋</b>')+'<b>＝</b>'+pixelSVG(puzzle.target)+'</div>';}
 else if(kind==='block-count'){const layers=Array.from({length:Math.max(...puzzle.heights.flat())},(_,i)=>puzzle.heights.flat().filter(h=>h>=i+1).length);out.textContent='아래층부터 '+layers.join(' + ')+' = '+puzzle.answer+'개';const tools=document.createElement('div');tools.className='layer-tools';layers.forEach((n,i)=>tools.append(button((i+1)+'층 · '+n+'개',()=>{$('reviewVisual').innerHTML=E.blockSVG(puzzle,i+1);})));out.append(tools);$('reviewVisual').innerHTML=E.blockSVG(puzzle);}
 else{out.textContent='전체 정답 '+puzzle.solutions.length+'곳: '+puzzle.solutions.map(patternCoord).join(' · ');$('reviewVisual').innerHTML='<p>회전해서 같은 것으로 인정되는 네 방향</p><div class="pattern-variants">'+E.patternVariants(puzzle.target).map(patternHTML).join('')+'</div>';}
}
function tickClock(){const now=stopped||Date.now();$('elapsed').textContent=started?timeString(now-started):'0:00';$('clock').textContent=phase==='idle'?'준비':phase==='review'?'완료':Number.isFinite(deadline)?Math.max(0,Math.ceil((deadline-Date.now())/1000))+'초':'시간 제한 없음';}
function tick(){tickClock();if(!['play','cooldown'].includes(phase))return;if(Date.now()>=deadline){finish('시간 종료 · 정답 공개','같은 난이도의 새 문제에 다시 도전할 수 있습니다.');return;}if(phase==='cooldown'&&Date.now()>=retryAt){phase='play';message('다시 답할 수 있습니다. 입력을 고치고 제출하세요.');render();}}
$('start').onclick=start;$('giveup').onclick=()=>{if(['play','cooldown'].includes(phase))finish('정답을 공개합니다.','한 가지 풀이를 확인하고 다시 도전하세요.');};$('next').onclick=()=>{if(phase!=='review')return;if(isPattern){if(round>=6)return;round++;}else if(cleared){if(level>=5)return;level++;}draw();};$('restart').onclick=()=>{phase='idle';puzzle=null;score=0;level=round=1;started=stopped=0;deadline=Infinity;$('review').hidden=true;message('준비되면 시작하세요.');render();};render();setInterval(tick,100);
})();
