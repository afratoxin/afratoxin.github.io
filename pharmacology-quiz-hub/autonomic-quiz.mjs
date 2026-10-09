import {createMatchBoard} from './match-board.mjs?v=20261009-1';

const symbols=['①','②','③','④','⑤'];
export function shuffle(items,random=Math.random){
  const copy=[...items];
  for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
  return copy;
}
export function prepareQuestion(fact,random=Math.random){
  const choices=shuffle(fact.options,random).map(text=>({text}));
  return {...fact,choices,answerIndex:choices.findIndex(x=>x.text===fact.answer)};
}

export function pickQuestion(bank,state,random=Math.random){
  let pool=bank.filter(x=>!state.recent.includes(x.id)&&x.group!==state.lastGroup);
  if(!pool.length)pool=bank.filter(x=>!state.recent.includes(x.id));
  if(!pool.length)pool=bank;
  // Keep clinical drug selection in every short practice run while still rotating all facts.
  if((state.total||0)%3===0){const cases=pool.filter(x=>x.group==='clinical');if(cases.length)pool=cases;}
  const value=x=>(state.seen[x.id]||0)-0.3*(state.missed[x.id]||0);
  const min=Math.min(...pool.map(value));
  return prepareQuestion(shuffle(pool.filter(x=>value(x)===min),random)[0],random);
}

export function initAutonomicQuiz({prefix,viewId,bank,matchItems,storageKey,draw}){
  const $=id=>document.getElementById(id), state={seen:{},missed:{},recent:[],lastGroup:null,lastLecture:null,total:0,right:0};
  try{Object.assign(state,JSON.parse(localStorage.getItem(storageKey)||'{}'));}catch{}
  state.seen||={};state.missed||={};state.recent||=[];
  const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{}};
  let current=null,answered=false,session=0,tab='quiz';
  const match=matchItems?createMatchBoard({
    poolId:prefix+'Pool',cardsId:prefix+'Cards',zonesId:prefix+'Zones',statusId:prefix+'DragStatus',checkId:prefix+'Check',resetId:prefix+'Reset',
    items:matchItems,categoryOf:x=>x.category,keyOf:x=>x.drug,labelOf:x=>x.drug,onGrade:()=>{}
  }):null;
  function stats(){
    $(prefix+'Stats').textContent=`정답 ${state.right}/${state.total} · 복기한 연결 ${Object.keys(state.seen).length}/${bank.length}`;
  }
  function next(){
    current=draw?draw(state):pickQuestion(bank,state);
    state.recent=[current.id,...state.recent.filter(id=>id!==current.id)].slice(0,3);
    state.lastGroup=current.group;state.lastLecture=current.lecture??null;
    answered=false;session++;save();stats();
    $(prefix+'Progress').textContent=`이번 회독 ${session}문제`;
    $(prefix+'Stem').textContent=current.stem;
    if($(prefix+'Source'))$(prefix+'Source').textContent=current.lecture==='cross'?'9~13강 연결':`${current.lecture||prefix.replace('adr','')}강 · 강의록 ${current.page||'관련'}쪽`;
    $(prefix+'Feedback').hidden=true;$(prefix+'Next').hidden=true;
    const host=$(prefix+'Choices');host.replaceChildren();
    current.choices.forEach((item,i)=>{
      const button=document.createElement('button');button.type='button';
      const number=document.createElement('span');number.className='option-no';number.textContent=symbols[i];
      const label=document.createElement('span');label.textContent=item.text;
      button.append(number,label);button.addEventListener('click',()=>answer(i));host.append(button);
    });
  }
  function answer(i){
    if(!current||answered)return;
    answered=true;const good=i===current.answerIndex;
    state.total++;state.right+=Number(good);state.seen[current.id]=(state.seen[current.id]||0)+1;
    if(!good)state.missed[current.id]=(state.missed[current.id]||0)+1;
    save();stats();
    [...$(prefix+'Choices').children].forEach((button,j)=>{button.disabled=true;if(j===current.answerIndex)button.classList.add('correct');else if(j===i)button.classList.add('wrong');});
    const fb=$(prefix+'Feedback');fb.className=`feedback ${good?'ok':'bad'}`;fb.replaceChildren();
    const heading=document.createElement('strong');heading.textContent=`${good?'정답입니다.':'다시 연결해 보세요.'} 정답 ${symbols[current.answerIndex]} · ${current.choices[current.answerIndex].text}`;
    const note=document.createElement('p');note.textContent=current.note;
    fb.append(heading,note);
    if(current.details?.length){const list=document.createElement('ol');list.className='ans-explanations';for(const detail of current.details){const row=document.createElement('li');row.textContent=detail;list.append(row);}fb.append(list);}
    fb.hidden=false;$(prefix+'Next').hidden=false;
  }
  $(prefix+'Next').addEventListener('click',next);
  if(match){
    for(const [id,name] of [[prefix+'QuizTab','quiz'],[prefix+'DragTab','drag']])$(id).addEventListener('click',()=>{
      tab=name;
      $(prefix+'QuizPanel').hidden=tab!=='quiz';$(prefix+'DragPanel').hidden=tab!=='drag';
      for(const [key,active] of [[prefix+'QuizTab',tab==='quiz'],[prefix+'DragTab',tab==='drag']]){$(key).classList.toggle('active',active);$(key).setAttribute('aria-selected',String(active));}
      if(tab==='drag')match.open();else if(!current)next();
    });
  }
  document.addEventListener('keydown',event=>{
    if($(viewId).hidden||tab!=='quiz'||event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;
    if(/^[1-5]$/.test(event.key)){event.preventDefault();answer(Number(event.key)-1);}
    if(event.key==='Enter'&&answered){event.preventDefault();next();}
  });
  stats();return {open(){if(tab==='drag')match.open();else if(!current)next();}};
}
