'use strict';
(function(){
const {categories,games}=window.BrainArenaCatalog;
const $=id=>document.getElementById(id);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon='<svg viewBox="0 0 88 68" fill="none" aria-hidden="true"><path d="M5 19V11a6 6 0 0 1 6-6h21l8 9h36a7 7 0 0 1 7 7v36a6 6 0 0 1-6 6H11a6 6 0 0 1-6-6V19Z" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="1.4"/><path d="M5 26a7 7 0 0 1 7-7h63a8 8 0 0 1 8 8v30a6 6 0 0 1-6 6H11a6 6 0 0 1-6-6V26Z" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.4"/><path d="M18 36h24M18 43h15" stroke="currentColor" stroke-opacity=".6" stroke-width="1.4"/></svg>';
function render(focus=false){
 const id=location.hash.slice(1);const category=categories.find(c=>c.id===id);
 $('folders').hidden=!!category;$('collection').hidden=!category;$('crumb').hidden=!category;
 if(category){
  document.title=category.title+' | 브레인 아레나';$('main').style.setProperty('--accent',category.color);
  $('crumb').textContent=' / '+category.title;$('eyebrow').textContent=category.english;$('heading').textContent=category.title;$('intro').textContent=category.description;
  const entries=games.filter(g=>g.category===category.id);$('counts').textContent=entries.length+'개의 게임';$('viewLabel').textContent='INSIDE THE FOLDER';$('empty').hidden=entries.length>0;
  $('games').innerHTML=entries.map(g=>`<a class="tile game-tile" href="${escape(g.href)}"><span class="number">${escape(category.title)}</span><h2>${escape(g.title)}</h2><p>${escape(g.description)}</p><span class="tag">${escape(g.tag)}</span><span class="cta">플레이하기 ↗</span></a>`).join('');
 }else{
  document.title='브레인 아레나 | 게임 폴더';$('main').style.removeProperty('--accent');$('eyebrow').textContent='YOUR GAME LIBRARY';$('heading').innerHTML='어떤 세계에<br>도전할까요?';$('intro').innerHTML='다섯 개의 폴더에서 골라 보세요.<br>원작별로 모은 두뇌 게임이 기다리고 있습니다.';$('viewLabel').textContent='COLLECTIONS';$('counts').textContent=`5개의 폴더 · ${games.length}개의 게임`;
  $('folders').innerHTML=categories.map((c,i)=>{const n=games.filter(g=>g.category===c.id).length;return `<a class="folder" href="#${c.id}" style="--accent:${c.color}"><div class="folder-top"><span class="folder-index">0${i+1}</span><span class="folder-count">${n} GAMES</span></div><div class="folder-icon">${icon}</div><div class="folder-en">${escape(c.english)}</div><h2>${escape(c.title)}</h2><p>${escape(c.description)}</p><div class="folder-bottom"><span>${n?'폴더 열기':'준비 중 · 폴더 보기'}</span><span aria-hidden="true">↗</span></div></a>`;}).join('');
 }
 if(focus){$('heading').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
}
window.addEventListener('hashchange',()=>render(true));render();
})();
