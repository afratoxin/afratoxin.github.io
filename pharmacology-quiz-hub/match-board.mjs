import {studyStore,studyCountLabel,paintStudyProgress} from './study-records.mjs?v=20261015-review1';
// Shared interactive board for the lecture matching exercises.
export function isMatchPlacement(item,chosen,categoriesOf){return Boolean(chosen)&&categoriesOf(item).includes(chosen);}
export function createMatchBoard({poolId,cardsId,zonesId,statusId,checkId,resetId,items,categoryOf,categoriesOf= item=>[categoryOf(item)],keyOf,labelOf,onGrade,studyId,categoryOptions,store=studyStore}){
  const $=id=>document.getElementById(id);
  const pool=$(poolId),cards=$(cardsId),zones=$(zonesId),status=$(statusId),check=$(checkId),reset=$(resetId);
  const scope=studyId||store.boardScope(cardsId);
  let wrongOnly=false,toggle=null,summary=null;
  function progress(){if(!scope)return;const n=store.counts(scope);if(summary){summary.textContent=studyCountLabel(n);paintStudyProgress(summary,n);}if(toggle){toggle.textContent=wrongOnly?'전체 카드로 돌아가기':`오답 카드만 · ${store.wrong(scope).length}`;toggle.setAttribute('aria-pressed',String(wrongOnly));}}
  let board=[],chips=new Map(),placements=new Map(),selected=null,graded=false;
  const categories=[...new Set(categoryOptions||items.flatMap(categoriesOf))];
  const shuffle=a=>{const copy=[...a];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;};
  const message=s=>{status.textContent=s;};
  function render(){
    // Move the actual card nodes between their containers so placement is visually tangible.
    const fragments=new Map(categories.map(c=>[c,document.createDocumentFragment()]));
    for(const item of board){
      const key=keyOf(item),chip=chips.get(key),category=placements.get(key);
      chip.classList.toggle('selected',key===selected);
      chip.classList.toggle('placed',Boolean(category));
      chip.setAttribute('aria-label',category?`${labelOf(item)} · ${category}에 배치됨, 선택하여 다른 칸으로 이동`:`${labelOf(item)} · 선택하여 배치`);
      chip.title=category?'카드를 선택한 뒤 다른 칸을 누르거나 목록에 끌어 놓으세요':'카드를 선택하고 분류 칸을 누르세요';
      (category?fragments.get(category):cards).append(chip);
    }
    for(const category of categories){zones.querySelector(`[data-category="${CSS.escape(category)}"] .zone-chips`).replaceChildren(fragments.get(category));}
    pool.classList.toggle('pool-over',false);
    check.disabled=!board.length;
    check.textContent=`지금 채점하기 · ${placements.size}/${board.length}개 배치`;
    const count=pool.querySelector('.pool-count');if(count)count.textContent=`남은 카드 ${board.length-placements.size}개`;
  }
  function move(key,category){
    if(graded||!chips.has(key)||!categories.includes(category))return;
    placements.set(key,category);selected=null;render();
    message(`${labelOf(board.find(x=>keyOf(x)===key))} 이동 완료 · ${placements.size}/${board.length}개 배치`);
  }
  function remove(key){
    if(graded||!placements.has(key))return;
    placements.delete(key);selected=null;render();
    message(`${labelOf(board.find(x=>keyOf(x)===key))} 카드를 꺼냈습니다 · ${placements.size}/${board.length}개 배치`);
  }
  function setup(){
    const wrongIds=wrongOnly?new Set(store.wrong(scope).map(x=>x.id)):null;
    board=shuffle(wrongIds?items.filter(x=>wrongIds.has(String(keyOf(x)))):items);placements=new Map();chips=new Map();selected=null;graded=false;
    cards.replaceChildren();zones.replaceChildren();check.hidden=false;reset.hidden=true;
    pool.classList.remove('graded');
    for(const category of shuffle(categories)){
      const zone=document.createElement('div');zone.className='drop-zone';zone.dataset.category=category;zone.tabIndex=0;zone.setAttribute('role','button');zone.setAttribute('aria-label',`${category} 칸`);
      const title=document.createElement('strong');title.className='zone-label';title.textContent=category;
      const target=document.createElement('div');target.className='zone-chips';zone.append(title,target);
      zone.addEventListener('dragover',e=>{if(graded)return;e.preventDefault();zone.classList.add('over');});
      zone.addEventListener('dragleave',()=>zone.classList.remove('over'));
      zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('over');move(e.dataTransfer.getData('text/plain'),category);});
      zone.addEventListener('click',e=>{if(e.target.closest('.drug-chip'))return;if(selected)move(selected,category);});
      zone.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&selected){e.preventDefault();move(selected,category);}});
      zones.append(zone);
    }
    for(const item of board){
      const key=keyOf(item),chip=document.createElement('button');chip.type='button';chip.className='drug-chip';chip.draggable=true;chip.textContent=labelOf(item);chips.set(key,chip);
      chip.addEventListener('dragstart',e=>{if(graded){e.preventDefault();return;}e.dataTransfer.setData('text/plain',key);e.dataTransfer.effectAllowed='move';});
      chip.addEventListener('click',e=>{e.stopPropagation();if(graded)return;selected=selected===key?null:key;render();message(selected?`${labelOf(item)} 선택됨 · 옮길 칸을 누르세요. 목록의 빈 곳을 누르면 카드를 꺼낼 수 있습니다.`:'선택을 해제했습니다.');});
    }
    render();progress();message(board.length?'카드를 끌거나 누른 뒤 칸을 선택하세요. 일부만 놓아도 채점할 수 있습니다.':'이 범위에 남은 오답 카드가 없습니다. 전체 카드로 돌아가 새로 연습할 수 있습니다.');
  }
  function resume(){
    if(!graded)return;
    graded=false;selected=null;pool.classList.remove('graded');
    for(const chip of chips.values()){chip.classList.remove('matched');chip.classList.remove('mismatch');chip.draggable=true;}
    check.hidden=false;reset.hidden=true;render();
    message(`이 배치에서 계속하기 · ${placements.size}/${board.length}개 배치. 카드를 옮기거나 추가한 뒤 언제든 다시 채점하세요.`);
  }
  pool.addEventListener('dragover',e=>{if(graded)return;e.preventDefault();pool.classList.add('pool-over');});
  pool.addEventListener('dragleave',e=>{if(!pool.contains(e.relatedTarget))pool.classList.remove('pool-over');});
  pool.addEventListener('drop',e=>{e.preventDefault();pool.classList.remove('pool-over');remove(e.dataTransfer.getData('text/plain'));});
  pool.addEventListener('click',e=>{if(graded||e.target.closest('.drug-chip')||!selected)return;if(placements.has(selected))remove(selected);else{selected=null;render();message('선택을 해제했습니다.');}});
  check.addEventListener('click',()=>{
    if(graded)return;graded=true;selected=null;render();pool.classList.add('graded');
    const results=board.map(item=>({item,chosen:placements.get(keyOf(item)),correct:isMatchPlacement(item,placements.get(keyOf(item)),categoriesOf)}));
    const good=results.filter(r=>r.correct).length;
    for(const r of results){const chip=chips.get(keyOf(r.item));if(r.chosen)chip.classList.add(r.correct?'matched':'mismatch');chip.draggable=false;}
    if(scope)store.recordMatch(scope,results,keyOf);
    onGrade(results);progress();
    message(`배치한 ${placements.size}개 중 ${good}개 정답 · 미배치 ${board.length-placements.size}개. 이 배치에서 계속할 수 있습니다.`);
    const details=document.createElement('details');details.className='match-details';
    const summary=document.createElement('summary');summary.textContent='배치한 카드의 정답과 내가 놓은 칸 보기';details.append(summary);
    const list=document.createElement('ul');
    results.filter(r=>r.chosen).forEach(r=>{const li=document.createElement('li');li.textContent=`${r.correct?'✓':'✗'} ${labelOf(r.item)} · ${r.chosen} · 정답: ${categoriesOf(r.item).join(' / ')}${r.item.note?' · '+r.item.note:''}`;list.append(li);});
    if(placements.size){details.append(list);status.append(details);}
    check.hidden=true;reset.hidden=false;
  });
  reset.addEventListener('click',resume);
  if(scope&&store.definitions.has(scope)){
    toggle=document.createElement('button');toggle.type='button';toggle.className='back-button match-wrong-toggle';toggle.addEventListener('click',()=>{wrongOnly=!wrongOnly;setup();});
    summary=document.createElement('p');summary.className='study-board-summary';pool.append(toggle,summary);progress();
  }
  return {open(){if(!board.length)setup();else progress();},reset:setup};
}

