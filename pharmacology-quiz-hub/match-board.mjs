// Shared interactive board for the lecture matching exercises.
export function createMatchBoard({poolId,cardsId,zonesId,statusId,checkId,resetId,items,categoryOf,keyOf,labelOf,onGrade}){
  const $=id=>document.getElementById(id);
  const pool=$(poolId),cards=$(cardsId),zones=$(zonesId),status=$(statusId),check=$(checkId),reset=$(resetId);
  let board=[],chips=new Map(),placements=new Map(),selected=null,graded=false;
  const categories=[...new Set(items.map(categoryOf))];
  const shuffle=a=>{const copy=[...a];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;};
  const message=s=>{status.textContent=s;};
  function render(){
    // Move the actual card nodes between their containers so placement is visually tangible.
    const fragments=new Map(categories.map(c=>[c,document.createDocumentFragment()]));
    for(const item of board){
      const key=keyOf(item),chip=chips.get(key),category=placements.get(key);
      chip.classList.toggle('selected',key===selected);
      chip.classList.toggle('placed',Boolean(category));
      chip.setAttribute('aria-label',category?`${labelOf(item)} · ${category}에 배치됨, 눌러 빼기`:`${labelOf(item)} · 선택하여 배치`);
      chip.title=category?`${category}에서 꺼내려면 클릭`:'카드를 선택하고 분류 칸을 누르세요';
      (category?fragments.get(category):cards).append(chip);
    }
    for(const category of categories){zones.querySelector(`[data-category="${CSS.escape(category)}"] .zone-chips`).replaceChildren(fragments.get(category));}
    pool.classList.toggle('pool-over',false);
    check.disabled=placements.size!==board.length;
    check.textContent=`${board.length}개 한 번에 채점 ${placements.size}/${board.length}`;
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
    board=shuffle(items);placements=new Map();chips=new Map();selected=null;graded=false;
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
      chip.addEventListener('click',e=>{e.stopPropagation();if(graded)return;if(placements.has(key)){remove(key);return;}selected=selected===key?null:key;render();message(selected?`${labelOf(item)} 선택됨 · 분류 칸을 누르거나 끌어서 넣으세요.`:'선택을 해제했습니다.');});
    }
    render();message('카드를 끌어서 칸에 넣으세요. 칸의 카드를 누르면 원래 자리로 돌아갑니다.');
  }
  pool.addEventListener('dragover',e=>{if(graded)return;e.preventDefault();pool.classList.add('pool-over');});
  pool.addEventListener('dragleave',e=>{if(!pool.contains(e.relatedTarget))pool.classList.remove('pool-over');});
  pool.addEventListener('drop',e=>{e.preventDefault();pool.classList.remove('pool-over');remove(e.dataTransfer.getData('text/plain'));});
  check.addEventListener('click',()=>{
    if(graded||placements.size!==board.length)return;graded=true;pool.classList.add('graded');
    const results=board.map(item=>({item,chosen:placements.get(keyOf(item)),correct:placements.get(keyOf(item))===categoryOf(item)}));
    const good=results.filter(r=>r.correct).length;
    for(const r of results){const chip=chips.get(keyOf(r.item));chip.classList.add(r.correct?'matched':'mismatch');chip.draggable=false;}
    onGrade(results);
    message(`한 번에 채점: ${good}/${board.length}개 정답. 칸에 표시된 색으로 확인하세요.`);
    const details=document.createElement('details');details.className='match-details';
    const summary=document.createElement('summary');summary.textContent='약물별 정답과 내가 놓은 칸 보기';details.append(summary);
    const list=document.createElement('ul');
    results.forEach(r=>{const li=document.createElement('li');li.textContent=`${r.correct?'✓':'✗'} ${labelOf(r.item)} · ${r.correct?categoryOf(r.item):`${r.chosen} → ${categoryOf(r.item)}`}`;list.append(li);});
    details.append(list);status.append(details);
    check.hidden=true;reset.hidden=false;
  });
  reset.addEventListener('click',setup);
  return {open(){if(!board.length)setup();},reset:setup};
}
