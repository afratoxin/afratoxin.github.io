const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function createBookmarkManager({store,document:doc,onChange=()=>{},getReviews=()=>({}),toast=()=>{}}){
 const dialog=doc.querySelector('#bookmark-manager');
 let lastTrigger;
 function render(message=''){
  dialog.innerHTML=`<div class="workspace-heading"><h2 id="bookmark-manager-title">북마크 관리</h2><button type="button" class="button-text" data-close-bookmark-manager>닫기</button></div><p class="bookmark-manager-help">기본 3개로 시작합니다. 용도에 맞게 이름을 바꾸고 필요한 종류를 추가하세요. 이름을 바꿔도 담아 둔 문항은 유지됩니다.</p><div class="bookmark-category-list">${store.state.map(category=>`<div class="bookmark-category-row"><i class="bookmark-dot" style="--bookmark-color:${esc(category.hex)}" aria-hidden="true"></i><label class="sr-only" for="bookmark-name-${esc(category.id)}">${esc(category.label)} 이름</label><input id="bookmark-name-${esc(category.id)}" value="${esc(category.label)}" maxlength="40" autocomplete="off"><button type="button" class="button button-quiet" data-bookmark-rename="${esc(category.id)}">이름 저장</button></div>`).join('')}</div><form data-bookmark-add-form class="bookmark-add-form"><label for="bookmark-new-name">새 북마크 이름</label><div><input id="bookmark-new-name" name="label" placeholder="예: 변형 후보" maxlength="40" autocomplete="off" required><button type="submit" class="button button-sage">종류 추가</button></div></form><p class="bookmark-manager-status" role="status">${esc(store.error||message)}</p><p class="bookmark-manager-help">이 브라우저에 저장됩니다. 자료 백업에는 북마크 이름도 포함됩니다. 이전 색에 담긴 문항은 추가 종류로 보존합니다.</p>`;
 }
 function report(error){const status=dialog.querySelector('.bookmark-manager-status');if(status)status.textContent=error.message||String(error);}
 function changed(message){onChange();render(message);if(store.error)toast(store.error);}
 function open(trigger){lastTrigger=trigger;store.sync(getReviews());render();dialog.showModal();dialog.querySelector('input')?.focus();}
 function close(){dialog.close();const target=lastTrigger?.getClientRects?.().length?lastTrigger:doc.querySelector('#main');target?.focus?.({preventScroll:true});}
 function handleClick(button){
  if(button.hasAttribute('data-close-bookmark-manager')){close();return true;}
  if(!button.hasAttribute('data-bookmark-rename'))return false;
  try{const id=button.dataset.bookmarkRename;const input=doc.querySelector(`#bookmark-name-${id}`);store.rename(id,input.value);changed('북마크 이름을 변경했습니다.');doc.querySelector(`#bookmark-name-${id}`)?.focus();}catch(error){report(error);}
  return true;
 }
 function handleSubmit(event){
  if(!event.target.matches('[data-bookmark-add-form]'))return false;
  event.preventDefault();
  try{const input=doc.querySelector('#bookmark-new-name');store.add(input.value);changed('새 북마크 종류를 추가했습니다.');doc.querySelector('#bookmark-new-name')?.focus();}catch(error){report(error);}
  return true;
 }
 return {open,close,render,handleClick,handleSubmit};
}
