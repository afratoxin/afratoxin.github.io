// 2026년 7강 약물대사, 강의록 54쪽: CYP3A4/5 substrates, inhibitors, inducers.
export const CYP3A45_FACTS=[
  {id:'ritonavir',drug:'ritonavir',category:'inhibitor'},
  {id:'itraconazole',drug:'itraconazole',category:'inhibitor'},
  {id:'ketoconazole',drug:'ketoconazole',category:'inhibitor'},
  {id:'grapefruit-juice',drug:'grapefruit juice',category:'inhibitor'},
  {id:'rifampin',drug:'rifampin',category:'inducer'},
  {id:'glucocorticosteroids',drug:'glucocorticosteroids',category:'inducer'},
  {id:'st-johns-wort',drug:"St. John's wort",category:'inducer'},
  {id:'midazolam',drug:'midazolam',category:'substrate'},
  {id:'alfentanil',drug:'alfentanil',category:'substrate'},
  {id:'tacrolimus',drug:'tacrolimus',category:'substrate'},
  {id:'terfenadine',drug:'terfenadine',category:'substrate'}
];

export const CYP3A45_LABELS={
  inhibitor:'inhibitor(억제제)',
  inducer:'inducer(유도제)',
  substrate:'substrate(기질)'
};
const SYMBOLS=['①','②','③','④','⑤'];

export function shuffleDdi(items,random=Math.random){
  const result=[...items];
  for(let i=result.length-1;i>0;i--){
    const j=Math.floor(random()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}

export function makeDdiClassificationQuestion(fact,random=Math.random){
  const distractors=shuffleDdi(CYP3A45_FACTS.filter(f=>f.category!==fact.category),random).slice(0,4);
  const choices=shuffleDdi([fact,...distractors],random);
  return {
    id:`class:${fact.id}`,
    kind:'classification',
    fact,
    stem:`다음 중 CYP3A4/5 ${CYP3A45_LABELS[fact.category]}에 해당하는 것은?`,
    choices:choices.map(f=>({text:f.drug,fact:f,correct:f.id===fact.id})),
    answerIndex:choices.findIndex(f=>f.id===fact.id)
  };
}

export function makeDdiEffectQuestion(modifier,substrate,random=Math.random){
  if(!['inhibitor','inducer'].includes(modifier.category)||substrate.category!=='substrate')
    throw new Error('CYP3A4/5 효과 문항의 분류가 잘못되었습니다.');
  const patterns=[
    {metabolism:'감소',exposure:'증가'},
    {metabolism:'증가',exposure:'증가'},
    {metabolism:'감소',exposure:'감소'},
    {metabolism:'증가',exposure:'감소'},
    {metabolism:'변화 없음',exposure:'변화 없음'}
  ];
  const correctPattern=modifier.category==='inhibitor'?patterns[0]:patterns[3];
  const choices=shuffleDdi(patterns.map(pattern=>({
    text:`${substrate.drug} 대사 ${pattern.metabolism} · ${substrate.drug} 노출 ${pattern.exposure}`,
    correct:pattern===correctPattern,
    pattern
  })),random);
  return {
    id:`effect:${modifier.id}:${substrate.id}`,
    kind:'effect',
    modifier,
    substrate,
    stem:`${modifier.drug}와 ${substrate.drug}을 병용할 때 CYP3A4/5 상호작용으로 예상되는 변화는?`,
    choices,
    answerIndex:choices.findIndex(choice=>choice.correct)
  };
}

export function ddiCandidates(){
  const classification=CYP3A45_FACTS.map(f=>({id:`class:${f.id}`,kind:'classification',fact:f}));
  const modifiers=CYP3A45_FACTS.filter(f=>f.category!=='substrate');
  const substrates=CYP3A45_FACTS.filter(f=>f.category==='substrate');
  const effects=modifiers.flatMap(modifier=>substrates.map(substrate=>({
    id:`effect:${modifier.id}:${substrate.id}`,kind:'effect',modifier,substrate
  })));
  return [...classification,...effects];
}

export function pickDdiCandidate(progress={},random=Math.random){
  const desired=progress.lastKind==='classification'?'effect':'classification';
  let pool=ddiCandidates().filter(c=>c.kind===desired);
  const recent=progress.recent||[];
  const withoutRecent=pool.filter(c=>!recent.includes(c.id));
  if(withoutRecent.length)pool=withoutRecent;
  const score=c=>(progress.seen?.[c.id]||0)-0.5*(progress.missed?.[c.id]||0);
  const min=Math.min(...pool.map(score));
  const least=pool.filter(c=>score(c)===min);
  return least[Math.floor(random()*least.length)];
}

export function initCyp3a45Quiz(){
  const $=id=>document.getElementById(id),KEY='pharmacology-cyp3a45-ddi-v1';
  let progress={seen:{},missed:{},recent:[],lastKind:'effect',correct:0,total:0};
  try{
    const saved=JSON.parse(localStorage.getItem(KEY)||'null');
    if(saved&&typeof saved==='object')progress={...progress,...saved,seen:saved.seen||{},missed:saved.missed||{}};
  }catch{}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(progress));}catch{}};
  let current=null,answered=false,session=0,activeTab='probe';

  function switchTab(tab){
    activeTab=tab;
    $('cypProbePanel').hidden=tab!=='probe';
    $('cypDdiPanel').hidden=tab!=='ddi';
    for(const [id,value] of [['cypProbeTab','probe'],['cypDdiTab','ddi']]){
      const active=value===tab;
      $(id).classList.toggle('active',active);
      $(id).setAttribute('aria-selected',String(active));
    }
    if(tab==='ddi'&&!current)next();
  }

  function renderStats(){
    const seenClass=Object.keys(progress.seen).filter(id=>id.startsWith('class:')).length;
    const seenEffect=Object.keys(progress.seen).filter(id=>id.startsWith('effect:')).length;
    $('cypDdiStats').textContent=`정답 ${progress.correct} / ${progress.total} · 분류 ${seenClass}/11 · 병용 조합 ${seenEffect}/28`;
  }

  function next(){
    const candidate=pickDdiCandidate(progress);
    current=candidate.kind==='classification'
      ?makeDdiClassificationQuestion(candidate.fact)
      :makeDdiEffectQuestion(candidate.modifier,candidate.substrate);
    progress.lastKind=candidate.kind;
    progress.recent=[candidate.id,...(progress.recent||[]).filter(id=>id!==candidate.id)].slice(0,4);
    save();answered=false;session++;
    $('cypDdiProgress').textContent=`${current.kind==='classification'?'분류':'병용 효과'} · ${session}문제`;
    $('cypDdiStem').textContent=current.stem;
    $('cypDdiFeedback').hidden=true;$('cypDdiNext').hidden=true;
    const host=$('cypDdiChoices');host.replaceChildren();
    current.choices.forEach((choice,index)=>{
      const button=document.createElement('button');button.type='button';
      const no=document.createElement('span');no.className='option-no';no.textContent=SYMBOLS[index];
      const label=document.createElement('span');label.textContent=choice.text;
      button.append(no,label);button.addEventListener('click',()=>answer(index));host.append(button);
    });
    renderStats();
  }

  function answer(index){
    if(!current||answered)return;
    answered=true;
    const good=index===current.answerIndex;
    progress.total++;progress.correct+=Number(good);
    progress.seen[current.id]=(progress.seen[current.id]||0)+1;
    if(!good)progress.missed[current.id]=(progress.missed[current.id]||0)+1;
    save();renderStats();
    [...$('cypDdiChoices').children].forEach((button,i)=>{
      button.disabled=true;
      if(i===current.answerIndex)button.classList.add('correct');
      else if(i===index)button.classList.add('wrong');
    });
    const feedback=$('cypDdiFeedback');feedback.className=`feedback ${good?'ok':'bad'}`;feedback.replaceChildren();
    const title=document.createElement('strong');title.textContent=good?'정답입니다.':'분류와 변화 방향을 다시 확인하세요.';
    const main=document.createElement('p');
    if(current.kind==='classification'){
      main.textContent=`${current.fact.drug}은(는) CYP3A4/5 ${CYP3A45_LABELS[current.fact.category]}입니다. (강의록 54쪽)`;
      const list=document.createElement('ul');list.className='ddi-explanations';
      current.choices.forEach((choice,i)=>{
        const li=document.createElement('li');
        li.textContent=`${SYMBOLS[i]} ${choice.fact.drug} · ${CYP3A45_LABELS[choice.fact.category]}`;
        list.append(li);
      });
      feedback.append(title,main,list);
    }else{
      const inhibitor=current.modifier.category==='inhibitor';
      main.textContent=`${current.modifier.drug}은(는) CYP3A4/5 ${CYP3A45_LABELS[current.modifier.category]}이므로 ${current.substrate.drug} 대사는 ${inhibitor?'감소':'증가'}하고 노출은 ${inhibitor?'증가':'감소'}합니다. (강의록 54쪽)`;
      const cue=document.createElement('p');
      cue.textContent=inhibitor?'억제 → 기질 제거 감소 → 기질 AUC·노출 증가':'유도 → 기질 제거 증가 → 기질 AUC·노출 감소';
      feedback.append(title,main,cue);
    }
    feedback.hidden=false;$('cypDdiNext').hidden=false;
  }

  $('cypProbeTab').addEventListener('click',()=>switchTab('probe'));
  $('cypDdiTab').addEventListener('click',()=>switchTab('ddi'));
  $('cypDdiNext').addEventListener('click',next);
  document.addEventListener('keydown',event=>{
    if($('cypView').hidden||$('cypDdiPanel').hidden||event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;
    if(/^[1-5]$/.test(event.key)){event.preventDefault();answer(Number(event.key)-1);}
    if(event.key==='Enter'&&answered){event.preventDefault();next();}
  });
  renderStats();
  return {open(view){if(view==='cyp'&&activeTab==='ddi'&&!current)next();}};
}
