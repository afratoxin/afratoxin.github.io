'use strict';
const names=['하이카드','원페어','투페어','트리플','스트레이트','플러시','풀하우스','포카드','스트레이트 플러시'];
function score(cards){const v=cards.map(c=>c.r).sort((a,b)=>b-a),m={};v.forEach(x=>m[x]=(m[x]||0)+1);const groups=Object.entries(m).map(([r,n])=>[n,+r]).sort((a,b)=>b[0]-a[0]||b[1]-a[1]);let straight=new Set(v).size===5&&(v[0]-v[4]===4?v[0]:v.join()==='14,5,4,3,2'?5:0);const flush=cards.every(c=>c.s===cards[0].s);let out=straight&&flush?[8,straight]:groups[0][0]===4?[7,...groups.map(g=>g[1])]:groups[0][0]===3&&groups[1][0]===2?[6,...groups.map(g=>g[1])]:flush?[5,...v]:straight?[4,straight]:groups[0][0]===3?[3,...groups.map(g=>g[1])]:groups[0][0]===2&&groups[1][0]===2?[2,...groups.map(g=>g[1])]:groups[0][0]===2?[1,...groups.map(g=>g[1])]:[0,...v];while(out.length<6)out.push(0);return out.reduce((a,n)=>a*15+n,0);}
function category(s){return names[Math.floor(s/15**5)];}
function deal(rng=Math.random){
 const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const base=2+Math.floor(rng()*9),suit=Math.floor(rng()*4),paired=rng()<.5;
 const shared=paired?[{r:base,s:suit},{r:base,s:(suit+1)%4},{r:base+1,s:(suit+2)%4}]:[0,1,2].map(i=>({r:base+i,s:suit}));
 const key=c=>c.r+':'+c.s,used=new Set(shared.map(key)),cards=[];
 const add=c=>{if(!used.has(key(c))&&cards.length<16){used.add(key(c));cards.push(c);}};
 // Matching ranks supply pairs, trips and full houses; suited runs supply straights and flushes.
 for(const r of [base,base+1,base+2])for(let s=0;s<4;s++)add({r,s});
 for(const r of [base+3,base+4,14])add({r,s:suit});
 const deck=[];for(let s=0;s<4;s++)for(let r=2;r<=14;r++)deck.push({r,s});shuffle(deck).forEach(add);
 return {cards:shuffle(cards),shared};
}
function pipPositions(rank){
 const sides=ys=>ys.flatMap(y=>[[29,y],[71,y]]);
 const layouts={2:[[50,32],[50,108]],3:[[50,32],[50,70],[50,108]],4:sides([32,108]),5:[...sides([32,108]),[50,70]],6:sides([32,70,108]),7:[...sides([32,70,108]),[50,51]],8:[...sides([32,70,108]),[50,51],[50,89]],9:[...sides([30,56,84,110]),[50,70]],10:[...sides([30,56,84,110]),[50,43],[50,97]],14:[[50,70]]};
 return layouts[rank]||[];
}
if(typeof document==='undefined')module.exports={score,category,deal,pipPositions};
else {
const $=id=>document.getElementById(id),suits=['♠','♥','♦','♣'];let cards=[],shared=[],chosen=[],state='idle',deadline=0,timer;
function label(c){return ({11:'J',12:'Q',13:'K',14:'A'}[c.r]||c.r)+suits[c.s];}
function card(c,hidden=false){
 const b=document.createElement('button');b.className='card'+(hidden?' back':c.s===1||c.s===2?' red':'');b.type='button';
 if(hidden){b.setAttribute('aria-label','뒤집힌 카드');return b;}
 b.setAttribute('aria-label',label(c));
 const rank=({11:'J',12:'Q',13:'K',14:'A'}[c.r]||c.r),suit=suits[c.s];
 const corner=`<g class="svg-corner"><text x="11" y="21" text-anchor="middle" font-size="17" font-weight="bold">${rank}</text><text x="11" y="38" text-anchor="middle" font-size="17">${suit}</text></g>`;
 const pips=pipPositions(c.r).map(([x,y])=>`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="${c.r===14?40:23}"${y>70?` transform="rotate(180 ${x} ${y})"`:''}>${suit}</text>`).join('');
 const face=c.r>=11&&c.r<=13?`<rect x="25" y="30" width="50" height="80" fill="#d4b66b22" stroke="#a68a46" stroke-width=".8"/><path d="M26 31L74 109M26 109L74 31M26 52H74M26 88H74" stroke="#b39553" stroke-width=".6"/><text x="50" y="59" text-anchor="middle" font-size="23">${c.r===12?'♛':c.r===13?'♚':'♞'}</text><text x="50" y="59" text-anchor="middle" font-size="23" transform="rotate(180 50 70)">${c.r===12?'♛':c.r===13?'♚':'♞'}</text>`:'';
 b.innerHTML=`<svg class="card-art" viewBox="0 0 100 140" aria-hidden="true" style="font-family:Georgia,'DejaVu Serif',serif;fill:currentColor">${corner}<g transform="rotate(180 50 70)">${corner}</g>${pips}${face}</svg>`;
 return b;
}
function render(){ $('grid').replaceChildren();cards.forEach((c,i)=>{const wrap=document.createElement('div');wrap.className='slot';const b=card(c,state==='select');b.disabled=state!=='select';if(chosen.includes(i))b.classList.add('chosen');b.setAttribute('aria-label',`${i+1}번 ${state==='select'?'뒤집힌 카드':label(c)}`);b.setAttribute('aria-pressed',chosen.includes(i));b.onclick=()=>{if(state!=='select')return;chosen=chosen.includes(i)?chosen.filter(x=>x!==i):chosen.length<2?[...chosen,i]:chosen;render();};const num=document.createElement('small');num.textContent=String(i+1).padStart(2,'0');wrap.append(b,num);$('grid').append(wrap);});$('submit').disabled=state!=='select'||chosen.length!==2;}
function reveal(){state='select';clearInterval(timer);$('clock').textContent='선택';$('status').textContent='기억한 위치에서 2장을 고르세요.';$('shared').replaceChildren();shared.forEach(c=>{const b=card(c);b.disabled=true;$('shared').append(b);});$('giveup').disabled=false;render();}
function tick(){if(state!=='memorize')return;const left=Math.max(0,Math.ceil((deadline-Date.now())/1000));$('clock').textContent=left+'초';if(!left)reveal();}
$('start').onclick=()=>{clearInterval(timer);const next=deal();cards=next.cards;shared=next.shared;chosen=[];state='memorize';$('result').hidden=true;$('shared').textContent='공유 카드 3장은 암기 후 공개됩니다.';$('status').textContent='카드와 위치를 기억하세요.';$('giveup').disabled=true;deadline=Date.now()+20000;render();tick();timer=setInterval(tick,100);};
function finish(giveup){if(state!=='select'||!giveup&&chosen.length!==2)return;const all=[];for(let a=0;a<16;a++)for(let b=a+1;b<16;b++)all.push({a,b,value:score([...shared,cards[a],cards[b]])});all.sort((a,b)=>b.value-a.value);const mine=giveup?null:score([...shared,...chosen.map(i=>cards[i])]);const stronger=all.filter(x=>x.value>mine).length,ties=all.filter(x=>x.value===mine).length;state='result';render();$('giveup').disabled=true;$('clock').textContent='결과';$('status').textContent='전체 카드를 공개했습니다.';const result=$('result');result.hidden=false;result.innerHTML=giveup?'<h2>최선의 선택을 확인하세요.</h2>':`<h2>${ties>1?'공동 ':''}${stronger+1}위 / 120가지</h2><p>내 선택: ${chosen.map(i=>`${i+1}번 ${label(cards[i])}`).join(' + ')} · <strong>${category(mine)}</strong><br>더 강한 선택 ${stronger}개 · 같은 강도 ${ties}개</p>`;const best=all[0];result.innerHTML+=`<p>최고의 선택: ${best.a+1}번 ${label(cards[best.a])} + ${best.b+1}번 ${label(cards[best.b])} · ${category(best.value)}</p><details><summary>120가지 전체 순위 보기</summary><table><thead><tr><th>순위</th><th>선택 카드</th><th>족보</th></tr></thead><tbody>${all.map((x,i)=>`<tr class="${!giveup&&chosen.includes(x.a)&&chosen.includes(x.b)?'my-choice':''}"><td>${all.findIndex(y=>y.value===x.value)+1}</td><td>${x.a+1}번 ${label(cards[x.a])} / ${x.b+1}번 ${label(cards[x.b])}${!giveup&&chosen.includes(x.a)&&chosen.includes(x.b)?'<strong class="my-badge">내 선택</strong>':''}</td><td>${category(x.value)}</td></tr>`).join('')}</tbody></table></details>`;const list=result.querySelector('details');list.addEventListener('toggle',()=>{if(list.open){const row=result.querySelector('.my-choice');if(row)row.scrollIntoView({block:'center',behavior:'smooth'});}});}
$('submit').onclick=()=>finish(false);$('giveup').onclick=()=>finish(true);
}
