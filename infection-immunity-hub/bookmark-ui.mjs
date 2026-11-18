import {readBookmarks} from './logic.mjs?v=20261119c';
const e=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function collectBookmarkedQuestions(groups,read){
 const items=[];
 for(const group of groups){
  const byId=new Map(group.questions.map(q=>[q.id,q]));
  for(const id of readBookmarks(read(group.key),group.questions))items.push({question:byId.get(id),group:group.id,label:group.label,key:group.key});
 }
 return items;
}
export function removeBookmark(raw,id){
 try{const value=JSON.parse(raw);return Array.isArray(value)?[...new Set(value.filter(saved=>typeof saved==='string'&&saved!==id))]:[];}catch{return [];}
}
export function filterBookmarkQuestions(items,{group='all',search=''}={}){
 const term=search.trim().toLocaleLowerCase();
 return items.filter(item=>(group==='all'||item.group===group)&&`${item.question.stem} ${item.question.choices.join(' ')}`.toLocaleLowerCase().includes(term));
}
export function createBookmarkUI({root,groups,read,save,onRetry,renderDetails,topicTitle=()=>'',formatPrompt=e,onChange=()=>{}}){
 let selectedGroup='all',search='';
 root.innerHTML=`<div class="section-heading page-heading"><div><p class="eyebrow green">STARRED QUESTIONS</p><h1>별표 문항</h1><p class="muted">항생제·병리·강의별·표 암기·CBL 기출에서 표시한 문제를 한곳에 모았습니다.</p></div><span class="tiny-chip" data-bookmark-total></span></div><div class="bookmark-toolbar"><label><span class="sr-only">별표 문항 분류</span><select data-bookmark-filter><option value="all">전체 문항</option>${groups.map(g=>`<option value="${e(g.id)}">${e(g.label)}</option>`).join('')}</select></label><label class="bookmark-search"><span class="sr-only">별표 문항 검색</span><input type="search" data-bookmark-search placeholder="문제·약물·미생물명 검색" autocomplete="off"></label><span data-bookmark-count class="muted" aria-live="polite"></span></div><div class="bookmark-list" data-bookmark-list></div>`;
 const list=root.querySelector('[data-bookmark-list]'),select=root.querySelector('[data-bookmark-filter]');
 function render(){
  const all=collectBookmarkedQuestions(groups,read),items=filterBookmarkQuestions(all,{group:selectedGroup,search});
  root.querySelector('[data-bookmark-total]').textContent=`전체 ${all.length}문항`;
  root.querySelector('[data-bookmark-count]').textContent=`${items.length}문항`;
  for(const option of select.options){const group=groups.find(g=>g.id===option.value);option.textContent=group?`${group.label} ${all.filter(x=>x.group===group.id).length}`:`전체 문항 ${all.length}`;}
  if(!items.length){list.innerHTML=`<div class="empty-state"><span class="empty-icon" aria-hidden="true">☆</span><h2>${all.length?'조건에 맞는 별표 문항이 없습니다.':'아직 별표 표시한 문항이 없습니다.'}</h2><p>${all.length?'분류나 검색어를 바꾸어 보세요.':'문제를 풀 때 ☆를 누르면 이곳에서 다시 볼 수 있습니다.'}</p><button type="button" class="button outline" data-tab="home">학습 허브로 →</button></div>`;return;}
  list.innerHTML=items.map(({question:q,label})=>`<article class="bookmark-entry"><div class="bookmark-entry-meta"><span class="pill">${e(label)}${topicTitle(q)?` · ${e(topicTitle(q))}`:''}</span><span class="format-tag">${q.format==='ox'?'O/X':'5지선다'}</span></div><div class="bookmark-entry-main"><details data-star-details="${e(q.id)}"><summary>${formatPrompt(q.stem)}</summary><div class="bookmark-answer" data-star-answer></div></details><button type="button" class="bookmark bookmark-remove" data-star-remove="${e(q.id)}" aria-label="이 문항 별표 해제" title="별표 해제">★</button></div><div class="bookmark-entry-actions"><button type="button" class="text-button" data-star-retry="${e(q.id)}">다시 풀기 →</button><span>문제를 펼치면 정답·해설 확인</span></div></article>`).join('');
 }
 root.addEventListener('change',event=>{if(event.target.matches('[data-bookmark-filter]')){selectedGroup=event.target.value;render();}});
 root.addEventListener('input',event=>{if(event.target.matches('[data-bookmark-search]')){search=event.target.value;render();}});
 root.addEventListener('toggle',event=>{
  const details=event.target;if(!details.matches?.('[data-star-details]')||!details.open)return;
  const body=details.querySelector('[data-star-answer]');if(body.childElementCount)return;
  const item=collectBookmarkedQuestions(groups,read).find(x=>x.question.id===details.dataset.starDetails);
  if(item)body.innerHTML=renderDetails(item.question);
 },true);
 root.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.starRetry){onRetry(button.dataset.starRetry);return;}
  if(!button.dataset.starRemove)return;
  const item=collectBookmarkedQuestions(groups,read).find(x=>x.question.id===button.dataset.starRemove);if(!item)return;
  save(item.key,removeBookmark(read(item.key),item.question.id));render();onChange();
 });
 render();
 return {render,count:()=>collectBookmarkedQuestions(groups,read).length};
}
