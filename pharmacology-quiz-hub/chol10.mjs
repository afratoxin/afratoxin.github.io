import {createMatchBoard} from './match-board.mjs?v=20261006-1';
// 2026 10강 콜린성 약리학 (1): 강의록 직접작용제·AChE 억제제 표와 사례.
import {shuffle} from './cyp.mjs?v=20261005-3';
const f=(id,group,correct,incorrect,note)=>({id,group,correct,incorrect,note});
export const CHOL_FACTS=[
  f('car-glaucoma','clinical','Carbachol은 녹내장 치료에 쓰이는 직접작용 콜린 효현제이다.','Carbachol은 녹내장 치료에 쓰이는 간접작용 콜린 효현제이다.','Carbachol은 수용체에 직접 결합하며 방수 배출을 돕는다.'),
  f('pilo-sjogren','clinical','Pilocarpine은 쇼그렌증후군의 구강건조 완화에 쓰인다.','Pilocarpine은 쇼그렌증후군의 침 분비 억제에 쓰인다.','Muscarinic 수용체를 자극해 침 분비를 늘린다.'),
  f('cevi-sjogren','clinical','Cevimeline은 쇼그렌증후군의 침 분비 촉진에 쓰인다.','Cevimeline은 쇼그렌증후군의 침 분비 차단에 쓰인다.','Pilocarpine과 함께 침 분비제로 분류한다.'),
  f('beth-bladder','clinical','Bethanechol은 방광근을 수축시켜 소변 정체를 완화한다.','Bethanechol은 방광근을 이완시켜 소변 정체를 완화한다.','평활근 무스카린 작용을 통한 방광근 수축이다.'),
  f('beth-ileus','clinical','Bethanechol은 창자막힘증에서 장운동 촉진에 연결된다.','Bethanechol은 창자막힘증에서 장운동 억제에 연결된다.','강의록에서는 창자막힘증 해결로 기재한다. 기계적 폐쇄는 별도로 구별한다.'),
  f('neo-mg','clinical','Neostigmine은 중증근무력증에 쓰이는 가역적 AChE 억제제이다.','Neostigmine은 중증근무력증에 쓰이는 비가역적 AChE 억제제이다.','가역성 carbamate로 신경근 접합부 ACh를 늘린다.'),
  f('pyr-mg','clinical','Pyridostigmine은 중증근무력증에 쓰이는 가역적 AChE 억제제이다.','Pyridostigmine은 중증근무력증에 쓰이는 비가역적 AChE 억제제이다.','중간작용성 가역성 carbamate로 분류한다.'),
  f('phy-mg','clinical','Physostigmine은 강의록의 중증근무력증 관련 carbamate 목록에 실려 있다.','Physostigmine은 강의록의 불가역성 유기인 목록에 실려 있다.','강의록 표에는 MG와 함께 실렸지만, BBB 통과성이 있어 4차 아민 약물과 구별한다.'),
  f('tac-ad','clinical','Tacrine은 알츠하이머 치료에 사용된 1세대 AChE 억제제이다.','Tacrine은 알츠하이머 치료에 사용된 2세대 AChE 억제제이다.','간기능 이상으로 사용이 중지된 1세대 약물이다.'),
  f('don-ad','clinical','Donepezil은 알츠하이머 치료에 쓰이는 AChE 억제제이다.','Donepezil은 알츠하이머 치료에 쓰이는 AChE 활성제이다.','강의록의 2세대 알츠하이머 치료 약물이다.'),
  f('riv-ad','clinical','Rivastigmine은 알츠하이머 치료와 연결되는 약물이다.','Rivastigmine은 중증근무력증 진단과 연결되는 약물이다.','강의록 임상 응용 표의 알츠하이머 치료 항목에 실린다.'),
  f('gal-ad','clinical','Galantamine은 알츠하이머 치료와 연결되는 약물이다.','Galantamine은 중증근무력증 진단과 연결되는 약물이다.','강의록 임상 응용 표의 알츠하이머 치료 항목에 실린다.'),
  f('mal-insect','clinical','Malathion은 살충제로 쓰이는 유기인계 AChE 억제제이다.','Malathion은 살충제로 쓰이는 carbamate계 AChE 억제제이다.','불가역성 유기인 계열의 살충제이다.'),
  f('par-insect','clinical','Parathion은 살충제로 쓰이는 유기인계 AChE 억제제이다.','Parathion은 살충제로 쓰이는 carbamate계 AChE 억제제이다.','불가역성 유기인 계열의 살충제이다.'),
  f('pilo-receptor','mechanism','Pilocarpine은 부교감신경의 무스카린 수용체를 직접 활성화한다.','Pilocarpine은 부교감신경의 니코틴 수용체를 직접 활성화한다.','족보의 쇼그렌증후군 사례: 직접작용 muscarinic agonist.'),
  f('cevi-receptor','mechanism','Cevimeline은 무스카린 수용체를 직접 활성화해 침 분비를 늘린다.','Cevimeline은 무스카린 수용체를 직접 억제해 침 분비를 늘린다.','직접작용 콜린 효현제이다.'),
  f('car-nicotinic','mechanism','Carbachol은 무스카린 작용과 니코틴 작용이 모두 있다.','Carbachol은 무스카린 작용만 있고 니코틴 작용은 없다.','사진 비교표: muscarinic ++, nicotinic +++.'),
  f('beth-nicotinic','mechanism','Bethanechol은 니코틴 작용이 거의 없고 무스카린 작용을 한다.','Bethanechol은 무스카린 작용이 거의 없고 니코틴 작용을 한다.','β-methyl기는 니코틴 수용체 결합을 줄인다.'),
  f('metha-nicotinic','mechanism','Methacholine은 니코틴 작용이 거의 없고 무스카린 작용을 한다.','Methacholine은 무스카린 작용이 거의 없고 니코틴 작용을 한다.','사진 비교표에서 nicotinic action은 None이다.'),
  f('car-resistant','mechanism','Carbachol은 AChE에 의한 분해가 매우 느리며 니코틴 작용이 있다.','Carbachol은 AChE에 의한 분해가 매우 빠르며 니코틴 작용이 있다.','Carbamoyl기가 AChE 가수분해를 억제한다.'),
  f('beth-resistant','mechanism','Bethanechol은 AChE에 의한 분해가 매우 느리며 니코틴 작용은 거의 없다.','Bethanechol은 AChE에 의한 분해가 매우 느리며 니코틴 작용이 강하다.','Carbamoyl기와 β-methyl기를 모두 갖는다.'),
  f('neo-indirect','mechanism','Neostigmine은 AChE를 억제해 ACh 작용을 간접적으로 늘린다.','Neostigmine은 AChE를 활성화해 ACh 작용을 간접적으로 늘린다.','수용체 직접 효현제가 아니라 AChE 억제제이다.'),
  f('edro-diagnosis','mechanism','Edrophonium은 중증근무력증의 진단 목적으로 제시된다.','Edrophonium은 중증근무력증의 장기 치료 목적으로 제시된다.','비공유결합성 단시간 작용제로 진단 목적에 연결된다.'),
  f('phy-bbb','properties','Physostigmine은 3차 아민으로 BBB를 통과한다.','Physostigmine은 4차 아민으로 BBB를 통과하지 못한다.','BBB 비교에서는 neostigmine·edrophonium의 4차 아민과 구별한다.'),
  f('neo-bbb','properties','Neostigmine은 4차 아민으로 BBB를 통과하지 못한다.','Neostigmine은 3차 아민으로 BBB를 통과한다.','강의록의 4차 아민과 3차 아민 비교를 따른다.'),
  f('edro-bbb','properties','Edrophonium은 4차 아민으로 BBB를 통과하지 못한다.','Edrophonium은 3차 아민으로 BBB를 통과한다.','강의록의 단시간 작용성 약물 표에 기재된다.'),
  f('org-duration','properties','불가역성 유기인제제는 AChE를 인산화해 오래 작용한다.','불가역성 유기인제제는 AChE를 탈인산화해 오래 작용한다.','안정적인 공유결합과 aging으로 지속시간이 매우 길다.'),
  f('carb-duration','properties','가역성 carbamate 제제는 AChE 억제 후 서서히 분해된다.','가역성 carbamate 제제는 AChE 억제 후 거의 분해되지 않는다.','강의록의 중간작용성 분류이다.'),
  f('echo-duration','properties','Echothiophate는 장시간 작용하는 불가역성 유기인제제이다.','Echothiophate는 단시간 작용하는 비공유결합 제제이다.','강의록에서는 심한 녹내장에 드물게 쓰이는 장시간 작용제로 소개한다.'),
  f('pralidoxime','properties','Pralidoxime은 유기인 중독에서 AChE 재활성화에 사용한다.','Pralidoxime은 유기인 중독에서 AChE를 추가로 인산화한다.','강의록의 농약 노출 사례와 oxime 설명을 따른다.')
];
export const CHOL_DRUGS=[
  ['acetylcholine','직접작용 대표 물질'],['methacholine','직접작용 대표 물질'],
  ['carbachol','녹내장 치료'],['echothiophate','녹내장 치료'],
  ['pilocarpine','침 분비 촉진'],['cevimeline','침 분비 촉진'],
  ['bethanechol','방광·장운동 촉진'],
  ['neostigmine','중증근무력증 관련'],['pyridostigmine','중증근무력증 관련'],['physostigmine','중증근무력증 관련'],
  ['edrophonium','중증근무력증 진단'],
  ['tacrine','알츠하이머 관련'],['donepezil','알츠하이머 관련'],['rivastigmine','알츠하이머 관련'],['galantamine','알츠하이머 관련'],
  ['malathion','살충제'],['parathion','살충제'],
  ['soman','신경가스'],['sarin','신경가스'],['VX','신경가스']
].map(([drug,category])=>({drug,category}));
export const CHOL_SPECIALS=[
  {id:'pick-bbb',group:'properties',stem:'다음 중 혈액뇌장벽(BBB)을 가장 잘 통과하는 약물은?',answer:'Physostigmine',options:['Physostigmine','Neostigmine','Pyridostigmine','Edrophonium','Bethanechol'],note:'Physostigmine은 3차 아민이다. 다른 보기의 4차 암모늄 약물은 BBB를 잘 통과하지 못한다.'},
  {id:'pick-duration',group:'properties',stem:'다음 중 AChE 억제 작용 시간이 가장 긴 약물은?',answer:'Echothiophate',options:['Echothiophate','Edrophonium','Neostigmine','Physostigmine','Pyridostigmine'],note:'Echothiophate는 AChE를 인산화하는 불가역성 유기인제제이며 작용이 장시간 지속된다.'},
  {id:'pick-resistant-nicotinic',group:'mechanism',stem:'다음 중 cholinesterase에 의한 분해가 매우 느리면서 니코틴 작용도 있는 약물은?',answer:'Carbachol',options:['Carbachol','Bethanechol','Methacholine','Acetylcholine','Pilocarpine'],note:'Carbachol의 carbamoyl기는 분해를 늦추며 니코틴 작용도 유지한다. Bethanechol과 methacholine은 β-methyl기로 니코틴 작용이 감소한다.'}
];
const SYMBOLS=['①','②','③','④','⑤'];
export function makeCholQuestion(fact,targetCorrect,random=Math.random){
  const pool=shuffle(CHOL_FACTS.filter(x=>x.group===fact.group&&x.id!==fact.id),random);
  const target=(targetCorrect?fact.correct:fact.incorrect).length;
  const competitors=pool.sort((a,b)=>Math.abs((targetCorrect?a.incorrect:a.correct).length-target)-Math.abs((targetCorrect?b.incorrect:b.correct).length-target)).slice(0,4);
  const choices=shuffle([{fact,text:targetCorrect?fact.correct:fact.incorrect,isAnswer:true},...competitors.map(x=>({fact:x,text:targetCorrect?x.incorrect:x.correct,isAnswer:false}))],random);
  const subject={clinical:'임상 용도',mechanism:'작용 기전',properties:'약물 특성'}[fact.group];
  return {stem:`다음 중 ${subject}에 관한 설명으로 ${targetCorrect?'옳은':'옳지 않은'} 것은?`,choices,answerIndex:choices.findIndex(x=>x.isAnswer),fact};
}
export function makeCholSpecialQuestion(fact,random=Math.random){
  const choices=shuffle(fact.options.map(text=>({text,isAnswer:text===fact.answer})),random);
  return {stem:fact.stem,choices,answerIndex:choices.findIndex(x=>x.isAnswer),fact,special:true};
}
export function initCholQuiz(){
  const $=id=>document.getElementById(id),KEY='pharmacology-cholinergic-lecture10-v1';
  let state={seen:{},missed:{},total:0,right:0,recent:[],lastGroup:null,lastTarget:false,boards:0};
  try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved?.seen)state={...state,...saved};}catch{}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
  let tab='quiz',current=null,answered=false,session=0;
  const stats=()=>{$('cholStats').textContent=`정답 ${state.right}/${state.total} · 복기한 연결 ${Object.keys(state.seen).length}/${CHOL_FACTS.length+CHOL_SPECIALS.length}`;};
  function next(){
    const all=[...CHOL_FACTS,...CHOL_SPECIALS];
    let pool=all.filter(f=>!state.recent.includes(f.id)&&f.group!==state.lastGroup);
    if(!pool.length)pool=all.filter(f=>!state.recent.includes(f.id));
    const min=Math.min(...pool.map(f=>(state.seen[f.id]||0)-0.3*(state.missed[f.id]||0)));
    const fact=shuffle(pool.filter(f=>(state.seen[f.id]||0)-0.3*(state.missed[f.id]||0)===min))[0];
    const target=!state.lastTarget;state.lastTarget=target;state.lastGroup=fact.group;
    state.recent=[fact.id,...state.recent.filter(id=>id!==fact.id)].slice(0,3);
    current=CHOL_SPECIALS.includes(fact)?makeCholSpecialQuestion(fact):makeCholQuestion(fact,target);save();answered=false;session++;
    $('cholProgress').textContent=`이번 회독 ${session}문제`;$('cholStem').textContent=current.stem;
    $('cholFeedback').hidden=true;$('cholNext').hidden=true;
    const host=$('cholChoices');host.replaceChildren();
    current.choices.forEach((c,i)=>{const button=document.createElement('button');button.type='button';const number=document.createElement('span');number.className='option-no';number.textContent=SYMBOLS[i];const label=document.createElement('span');label.textContent=c.text;button.append(number,label);button.addEventListener('click',()=>answer(i));host.append(button);});stats();
  }
  function answer(i){
    if(answered||!current)return;answered=true;
    const good=i===current.answerIndex,f=current.fact;
    state.total++;state.right+=Number(good);state.seen[f.id]=(state.seen[f.id]||0)+1;
    if(!good)state.missed[f.id]=(state.missed[f.id]||0)+1;save();stats();
    [...$('cholChoices').children].forEach((button,j)=>{button.disabled=true;if(j===current.answerIndex)button.classList.add('correct');else if(j===i)button.classList.add('wrong');});
    const fb=$('cholFeedback');fb.replaceChildren();fb.className=`feedback ${good?'ok':'bad'}`;
    const heading=document.createElement('strong');heading.textContent=`${good?'정답입니다.':'바뀐 부분을 확인하세요.'} 정답 ${SYMBOLS[current.answerIndex]}`;
    const list=document.createElement('ol');list.className='ans-explanations';
    if(current.special){const detail=document.createElement('li');detail.textContent=`${f.answer} · ${f.note}`;list.append(detail);}
    else current.choices.forEach((item,j)=>{const row=document.createElement('li');row.textContent=`${SYMBOLS[j]} ${item.text===item.fact.correct?'옳음':'틀림'} · ${item.fact.note}${item.text!==item.fact.correct?' 바른 설명: '+item.fact.correct:''}`;list.append(row);});
    fb.append(heading,list);fb.hidden=false;$('cholNext').hidden=false;
  }
  const match=createMatchBoard({
    poolId:'cholPool',cardsId:'cholCards',zonesId:'cholZones',statusId:'cholDragStatus',checkId:'cholCheck',resetId:'cholReset',
    items:CHOL_DRUGS,categoryOf:f=>f.category,keyOf:f=>f.drug,labelOf:f=>f.drug,
    onGrade:()=>{state.boards++;save();}
  });
  $('cholNext').addEventListener('click',next);
  for(const [id,value] of [['cholQuizTab','quiz'],['cholDragTab','drag']])$(id).addEventListener('click',()=>{
    tab=value;$('cholQuizPanel').hidden=tab!=='quiz';$('cholDragPanel').hidden=tab!=='drag';
    for(const [tabId,active] of [['cholQuizTab',tab==='quiz'],['cholDragTab',tab==='drag']]){$(tabId).classList.toggle('active',active);$(tabId).setAttribute('aria-selected',String(active));}
    if(tab==='quiz'&&!current)next();if(tab==='drag')match.open();
  });
  document.addEventListener('keydown',e=>{if($('cholView').hidden||tab!=='quiz'||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(/^[1-5]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}if(e.key==='Enter'&&answered){e.preventDefault();next();}});
  stats();return {open(){if(tab==='quiz'&&!current)next();if(tab==='drag')match.open();}};
}
