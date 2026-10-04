// 2026년 7강 약물대사: 강의록에 제시된 CYP probe drug (16, 36, 39쪽).
export const CYP_FACTS = [
  {id:'theophylline', enzyme:'CYP1A2', drug:'theophylline', page:16, note:'CYP1A2의 probe drug으로 제시됩니다.'},
  {id:'bupropion', enzyme:'CYP2B6', drug:'bupropion', page:16, note:'CYP2B6의 probe drug으로 제시됩니다.'},
  {id:'omeprazole', enzyme:'CYP2C19', drug:'omeprazole', page:16, note:'CYP2C19의 대표 probe drug이며, 37쪽에는 CYP3A4를 이용하는 minor pathway도 설명됩니다.'},
  {id:'voriconazole', enzyme:'CYP2C19', drug:'voriconazole', page:36, note:'CYP2C19의 probe drug으로 제시됩니다.'},
  {id:'clopidogrel', enzyme:'CYP2C19', drug:'clopidogrel', page:36, note:'CYP2C19가 활성 대사체 생성에 관여하는 전구약물입니다. 효소 활성이 낮으면 활성화도 줄 수 있습니다.'},
  {id:'s-warfarin', enzyme:'CYP2C9', drug:'S-warfarin', page:16, note:'16·39쪽에서 CYP2C9와 연결됩니다. R-warfarin과 구별하세요.'},
  {id:'ibuprofen', enzyme:'CYP2C9', drug:'ibuprofen', page:39, note:'CYP2C9의 probe drug으로 제시됩니다.'},
  {id:'codeine', enzyme:'CYP2D6', drug:'codeine', page:16, note:'CYP2D6를 통한 morphine 활성화가 연결되는 사례입니다.'},
  {id:'midazolam', enzyme:'CYP3A4', drug:'midazolam', page:16, note:'CYP3A4의 probe drug으로 제시됩니다.'},
  {id:'alfentanil', enzyme:'CYP3A4', drug:'alfentanil', page:16, note:'CYP3A4의 probe drug으로 제시됩니다.'}
];
export const CYP_ENZYMES = [...new Set(CYP_FACTS.map(f=>f.enzyme))];
const SYMBOLS=['①','②','③','④','⑤'];

export function shuffle(items, random=Math.random){
  const result=[...items];
  for(let i=result.length-1;i>0;i--){
    const j=Math.floor(random()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}

export function makeCypQuestion(fact,direction,random=Math.random){
  const reverse=direction==='enzyme-to-drug';
  let choices;
  if(reverse){
    // Every distractor belongs to a different enzyme; none is another valid answer.
    const otherEnzymes=shuffle(CYP_ENZYMES.filter(e=>e!==fact.enzyme),random).slice(0,4);
    choices=shuffle([fact.drug,...otherEnzymes.map(e=>{
      const candidates=CYP_FACTS.filter(f=>f.enzyme===e);
      return candidates[Math.floor(random()*candidates.length)].drug;
    })],random);
  }else{
    choices=shuffle([fact.enzyme,...shuffle(CYP_ENZYMES.filter(e=>e!==fact.enzyme),random).slice(0,4)],random);
  }
  const answer=reverse?fact.drug:fact.enzyme;
  return {fact,direction,choices,answer,stem:reverse
    ? `${fact.enzyme}의 probe drug은?`
    : `${fact.drug}과 대응하는 CYP 효소는?`};
}

export function pickCypFact(progress={},random=Math.random){
  const recent=progress.recent||[];
  const available=CYP_FACTS.filter(f=>!recent.includes(f.id));
  const pool=available.length?available:CYP_FACTS;
  // 낮은 회상 횟수와 이전 오답을 함께 고려한다.
  const weight=f=>(progress.seen?.[f.id]||0)-0.5*(progress.missed?.[f.id]||0);
  const min=Math.min(...pool.map(weight));
  const choices=pool.filter(f=>weight(f)===min);
  return choices[Math.floor(random()*choices.length)];
}

export function initCypQuiz(){
  const $=id=>document.getElementById(id);
  const KEY='pharmacology-cyp-probes-v1';
  let progress={seen:{},missed:{},right:0,total:0,recent:[],lastDirection:null,boards:0};
  try{
    const saved=JSON.parse(localStorage.getItem(KEY)||'null');
    if(saved&&typeof saved==='object') progress={...progress,...saved,seen:saved.seen||{},missed:saved.missed||{}};
  }catch{}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(progress));}catch{}};
  let current=null,answered=false,quizCount=0,board=[],matched=new Set(),selectedId=null;
  const factById=id=>CYP_FACTS.find(f=>f.id===id);
  const record=(fact,good)=>{
    progress.total++;
    if(good)progress.right++;
    else progress.missed[fact.id]=(progress.missed[fact.id]||0)+1;
    if(good)progress.seen[fact.id]=(progress.seen[fact.id]||0)+1;
    save();
    $('cypStats').textContent=`정답 ${progress.right} / 시도 ${progress.total} · 복기한 약물 ${Object.keys(progress.seen).length}/${CYP_FACTS.length}`;
  };
  const buildTable=()=>{
    const tbody=$('cypTableBody');
    tbody.replaceChildren();
    for(const f of CYP_FACTS){
      const row=document.createElement('tr');
      for(const value of [f.enzyme,f.drug,f.note,`${f.page}쪽`]){
        const td=document.createElement('td');
        td.textContent=value;row.append(td);
      }
      tbody.append(row);
    }
  };
  const nextQuestion=()=>{
    const fact=pickCypFact(progress);
    const direction=progress.lastDirection==='drug-to-enzyme'?'enzyme-to-drug':'drug-to-enzyme';
    current=makeCypQuestion(fact,direction);
    progress.lastDirection=direction;
    progress.recent=[fact.id,...(progress.recent||[]).filter(id=>id!==fact.id)].slice(0,3);
    save();
    answered=false;quizCount++;
    $('cypProgress').textContent=`이번 회독 ${quizCount}문제`;
    $('cypStem').textContent=current.stem;
    $('cypFeedback').hidden=true;$('cypNext').hidden=true;
    const host=$('cypChoices');host.replaceChildren();
    current.choices.forEach((choice,index)=>{
      const button=document.createElement('button');
      button.type='button';
      const no=document.createElement('span');no.className='option-no';no.textContent=SYMBOLS[index];
      const label=document.createElement('span');label.textContent=choice;
      button.append(no,label);
      button.addEventListener('click',()=>answerQuestion(index));
      host.append(button);
    });
  };
  const answerQuestion=index=>{
    if(answered||!current)return;
    answered=true;
    const selected=current.choices[index],good=selected===current.answer;
    record(current.fact,good);
    const buttons=[...$('cypChoices').children];
    buttons.forEach((button,i)=>{
      button.disabled=true;
      if(current.choices[i]===current.answer)button.classList.add('correct');
      else if(i===index)button.classList.add('wrong');
    });
    const feedback=$('cypFeedback');
    feedback.className=`feedback ${good?'ok':'bad'}`;
    const why=document.createElement('p');
    why.textContent=`${current.fact.enzyme} ↔ ${current.fact.drug}. ${current.fact.note} (강의록 ${current.fact.page}쪽)`;
    feedback.replaceChildren();
    const title=document.createElement('strong');title.textContent=good?'정답입니다.':'다시 짚어보세요.';
    feedback.append(title,why);
    if(!good){
      const competing=current.direction==='drug-to-enzyme'
        ?CYP_FACTS.find(f=>f.enzyme===selected)
        :factById(selected);
      if(competing){
        const contrast=document.createElement('p');
        contrast.textContent=`선택한 ${selected}은(는) ${competing.enzyme} ↔ ${competing.drug} 쪽의 대응입니다.`;
        feedback.append(contrast);
      }
    }
    feedback.hidden=false;$('cypNext').hidden=false;
  };
  const newBoard=()=>{
    const enzymes=shuffle(CYP_ENZYMES).slice(0,5);
    board=enzymes.map(enzyme=>{
      const facts=CYP_FACTS.filter(f=>f.enzyme===enzyme);
      const min=Math.min(...facts.map(f=>progress.seen[f.id]||0));
      return shuffle(facts.filter(f=>(progress.seen[f.id]||0)===min))[0];
    });
    matched=new Set();selectedId=null;
    $('dragNext').hidden=true;
    $('dragStatus').textContent='약물 5개를 효소 칸에 맞춰 주세요. 터치에서는 약물을 먼저 선택하세요.';
    const cardHost=$('dragCards'),zoneHost=$('dropZones');
    cardHost.replaceChildren();zoneHost.replaceChildren();
    for(const fact of shuffle(board)){
      const button=document.createElement('button');button.type='button';button.className='drug-chip';
      button.draggable=true;button.dataset.factId=fact.id;button.textContent=fact.drug;
      button.addEventListener('dragstart',event=>{event.dataTransfer.setData('text/plain',fact.id);event.dataTransfer.effectAllowed='move';});
      button.addEventListener('click',()=>{selectedId=fact.id;cardHost.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b===button));$('dragStatus').textContent=`${fact.drug} 선택됨. 대응하는 효소를 누르세요.`;});
      cardHost.append(button);
    }
    for(const fact of shuffle(board)){
      const zone=document.createElement('button');zone.type='button';zone.className='drop-zone';
      zone.dataset.enzyme=fact.enzyme;zone.textContent=fact.enzyme;
      zone.addEventListener('dragover',event=>{event.preventDefault();zone.classList.add('over');});
      zone.addEventListener('dragleave',()=>zone.classList.remove('over'));
      zone.addEventListener('drop',event=>{event.preventDefault();zone.classList.remove('over');attempt(event.dataTransfer.getData('text/plain'),fact.enzyme);});
      zone.addEventListener('click',()=>attempt(selectedId,fact.enzyme));
      zoneHost.append(zone);
    }
  };
  const attempt=(id,enzyme)=>{
    const fact=board.find(f=>f.id===id);
    if(!fact||matched.has(id))return;
    const zone=[...$('dropZones').children].find(z=>z.dataset.enzyme===enzyme);
    if(zone.disabled)return;
    if(fact.enzyme!==enzyme){
      progress.missed[id]=(progress.missed[id]||0)+1;save();
      $('dragStatus').textContent=`${fact.drug} ↔ ${enzyme}: 다시 시도하세요.`;
      zone.classList.add('mismatch');setTimeout(()=>zone.classList.remove('mismatch'),650);
      return;
    }
    matched.add(id);record(fact,true);
    const chip=[...$('dragCards').children].find(c=>c.dataset.factId===id);
    chip.disabled=true;chip.draggable=false;chip.classList.remove('selected');chip.classList.add('matched');
    zone.disabled=true;zone.classList.add('matched');zone.textContent=`${enzyme} ✓ ${fact.drug}`;
    selectedId=null;
    $('dragStatus').textContent=matched.size===board.length
      ?'5개 모두 정답입니다. 새 조합으로 다시 풀어보세요.'
      :`정답: ${fact.enzyme} ↔ ${fact.drug} · ${matched.size}/${board.length}`;
    if(matched.size===board.length){progress.boards++;save();$('dragNext').hidden=false;}
  };
  $('cypNext').addEventListener('click',nextQuestion);
  $('dragNext').addEventListener('click',newBoard);
  document.addEventListener('keydown',event=>{
    if($('cypView').hidden||$('cypProbePanel').hidden||event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;
    if(/^[1-5]$/.test(event.key)){event.preventDefault();answerQuestion(Number(event.key)-1);}
    if(event.key==='Enter'&&answered){event.preventDefault();nextQuestion();}
  });
  buildTable();
  $('cypStats').textContent=`정답 ${progress.right} / 시도 ${progress.total} · 복기한 약물 ${Object.keys(progress.seen).length}/${CYP_FACTS.length}`;
  return {open(view){
    if(view==='cyp'&&!current)nextQuestion();
    if(view==='drag'&&!board.length)newBoard();
  }};
}
