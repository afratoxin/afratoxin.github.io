// 2026 11강 콜린성 약리학 (2): 강의록 11–22쪽과 족보 임상 발문.
import {shuffle} from './cyp.mjs?v=20261007-1';
import {createMatchBoard} from './match-board.mjs?v=20261006-1';
const f=(id,group,correct,incorrect,note,page)=>({id,group,correct,incorrect,note,page});
export const CHOL11_FACTS=[
  f('block-m','effects','Atropine은 무스카린 수용체를 차단해 부교감 작용을 억제한다.','Atropine은 니코틴 수용체를 차단해 부교감 작용을 억제한다.','Atropine은 항무스카린제이며 신경절의 니코틴 수용체 차단제가 아니다.',11),
  f('heart-rate','effects','Atropine의 무스카린 차단은 심박수를 증가시킨다.','Atropine의 무스카린 차단은 심박수를 감소시킨다.','심장의 미주신경 작용을 억제한다.',15),
  f('pupil','effects','항무스카린 약물은 동공을 확대하고 조절마비를 일으킨다.','항무스카린 약물은 동공을 축소하고 조절마비를 일으킨다.','축동을 매개하는 부교감 작용을 차단한다.',14),
  f('gland','effects','항무스카린 약물은 침과 눈물의 분비를 감소시킨다.','항무스카린 약물은 침과 눈물의 분비를 증가시킨다.','분비샘의 무스카린 작용이 차단된다.',13),
  f('bronchi','effects','항무스카린 약물은 기관지 근육을 이완시킨다.','항무스카린 약물은 기관지 근육을 수축시킨다.','기관지 평활근의 부교감 수축 작용을 억제한다.',16),
  f('gut','effects','항무스카린 약물은 위장관 운동을 억제한다.','항무스카린 약물은 위장관 운동을 촉진한다.','무스카린 차단은 장의 경련성 수축을 낮춘다.',13),
  f('bladder','effects','항무스카린 약물은 방광 배뇨근을 이완시킨다.','항무스카린 약물은 방광 배뇨근을 수축시킨다.','과민성 방광에서 요절박을 줄이는 작용과 연결된다.',17),
  f('drymouth','effects','Atropine의 항무스카린 작용은 구강건조를 유발할 수 있다.','Atropine의 항무스카린 작용은 타액 증가를 유발할 수 있다.','침 분비 억제는 항무스카린제의 대표 부작용이다.',13),
  f('glaucoma','effects','항무스카린 산동제는 녹내장 환자에서 안압 악화를 주의한다.','항무스카린 산동제는 녹내장 환자에서 안압 감소를 기대한다.','강의록은 녹내장 환자에서 안과 산동제를 피하도록 설명한다.',14),
  f('urine-retention','effects','방광 배뇨근을 이완시키는 약물은 소변 정체를 악화시킬 수 있다.','방광 배뇨근을 이완시키는 약물은 소변 정체를 완화할 수 있다.','항무스카린제는 소변 배출을 느리게 한다.',17),
  f('scopo-motion','clinical','Scopolamine은 멀미 예방에 쓰이는 항무스카린 약물이다.','Scopolamine은 멀미 예방에 쓰이는 무스카린 효현제이다.','전정기관에서 중추로 가는 콜린성 신호를 억제한다.',13),
  f('scopo-bbb','clinical','Scopolamine은 atropine보다 BBB를 더 잘 통과한다.','Scopolamine은 atropine보다 BBB를 더 못 통과한다.','두 약물 모두 3차 아민이지만 scopolamine의 CNS 유입이 더 용이하다.',13),
  f('tropic-short','clinical','Tropicamide는 안과 검사에 쓰이는 짧은 작용성 산동제이다.','Tropicamide는 안과 검사에 쓰이는 긴 작용성 산동제이다.','강의록 비교표에서 tropicamide는 약 0.25일, atropine은 7–10일이다.',14),
  f('atrop-eye','clinical','Atropine 점안은 tropicamide보다 산동 효과가 오래간다.','Atropine 점안은 tropicamide보다 산동 효과가 짧게 간다.','안과 약물 효과 기간 표에 따른 비교이다.',14),
  f('ipra-airway','clinical','Ipratropium은 기관지 확장을 위해 쓰이는 항무스카린 약물이다.','Ipratropium은 기관지 수축을 위해 쓰이는 항무스카린 약물이다.','강의록에서 COPD·천식에 사용할 수 있는 4차 아민으로 분류한다.',16),
  f('tio-airway','clinical','Tiotropium은 기관지 확장을 위해 쓰이는 항무스카린 약물이다.','Tiotropium은 기관지 수축을 위해 쓰이는 항무스카린 약물이다.','기도 평활근의 무스카린 수용체를 차단한다.',16),
  f('oxy-bladder','clinical','Oxybutynin은 과민성 방광의 요절박에 쓰이는 약물이다.','Oxybutynin은 소변 정체의 배뇨 촉진에 쓰이는 약물이다.','방광의 배뇨근 수축을 억제한다.',17),
  f('tolt-bladder','clinical','Tolterodine은 과민성 방광과 연결되는 항무스카린 약물이다.','Tolterodine은 과민성 방광과 연결되는 무스카린 효현제이다.','강의록 방광 표와 족보에 출제된 계열이다.',17),
  f('soli-bladder','clinical','Solifenacin은 과민성 방광에 쓰이는 항무스카린제이다.','Solifenacin은 과민성 방광에 쓰이는 무스카린 효현제이다.','강의록 방광 표에 등장한다.',17),
  f('benztropine','clinical','Benztropine은 파킨슨병의 떨림 완화에 쓰이는 약물이다.','Benztropine은 파킨슨병의 떨림 악화에 쓰이는 약물이다.','중추 콜린성 과활성을 억제하는 항무스카린제이다.',13),
  f('atrop-antidote','clinical','Atropine은 유기인 중독의 무스카린 증상 완화에 쓰인다.','Atropine은 유기인 중독의 AChE 재생에 쓰인다.','수용체를 차단하며 인산화된 효소 자체를 재생시키지는 않는다.',18),
  f('pam-antidote','clinical','Pralidoxime은 숙성 전에 인산화된 AChE의 재생을 돕는다.','Pralidoxime은 숙성 후에 인산화된 AChE의 재생을 돕는다.','Oxime이 AChE에 결합된 인을 떼어내는 기전이다.',18),
  f('nicotine-cessation','clinical','Nicotine은 금연 보조에 쓰이는 니코틴 수용체 작용제이다.','Nicotine은 금연 보조에 쓰이는 무스카린 수용체 작용제이다.','강의록의 자율신경절 작용약물 분류이다.',20),
  f('varenicline','clinical','Varenicline은 금연 보조제로 제시된 니코틴 수용체 작용제이다.','Varenicline은 금연 보조제로 제시된 무스카린 수용체 작용제이다.','강의록에는 nicotine·cytisine과 함께 등장한다.',20),
  f('cytisine','clinical','Cytisine은 금연 보조제로 제시된 니코틴 수용체 작용제이다.','Cytisine은 금연 보조제로 제시된 무스카린 수용체 작용제이다.','강의록의 자율신경절 흥분 약물 표에 실린다.',20),
  f('ganglion-nicotine','mechanism','Nicotine은 자율신경절의 니코틴 수용체를 흥분시킨다.','Nicotine은 자율신경절의 무스카린 수용체를 흥분시킨다.','자율신경절의 수용체는 Nn 니코틴 수용체다.',20),
  f('ganglion-block','mechanism','자율신경절 차단은 교감·부교감 출력을 함께 막을 수 있다.','자율신경절 차단은 교감 출력만 선택적으로 막을 수 있다.','신경절이 두 자율신경계에서 공통인 단계를 이룬다.',20),
  f('tubocurarine','mechanism','Tubocurarine은 신경근 니코틴 수용체의 경쟁적 길항제이다.','Tubocurarine은 신경근 니코틴 수용체의 지속적 탈분극제이다.','비탈분극성 신경근 봉쇄제이다.',22),
  f('rocuronium','mechanism','Rocuronium은 비탈분극성 신경근 봉쇄제이다.','Rocuronium은 탈분극성 신경근 봉쇄제이다.','ACh 결합 부위에서 경쟁적으로 길항한다.',22),
  f('vecuronium','mechanism','Vecuronium은 신경근 접합부의 니코틴 수용체를 경쟁적으로 차단한다.','Vecuronium은 신경근 접합부의 무스카린 수용체를 경쟁적으로 차단한다.','강의록의 약물명 오타 vecurocurium을 바로잡았다.',22),
  f('succinylcholine','mechanism','Succinylcholine은 운동종판의 지속적 탈분극으로 근육을 이완시킨다.','Succinylcholine은 운동종판의 경쟁적 길항으로 근육을 이완시킨다.','탈분극성 약물로 니코틴 수용체에 작용한다.',22),
  f('hyperkalemia','mechanism','Succinylcholine은 고칼륨혈증을 유발할 수 있다.','Succinylcholine은 저칼륨혈증을 유발할 수 있다.','강의록 신경근 봉쇄제 부작용 표와 족보 사례에 등장한다.',22),
  f('resp','mechanism','두 종류의 신경근 봉쇄제 모두 호흡근 마비를 유발할 수 있다.','탈분극성 신경근 봉쇄제만 호흡근 마비를 유발할 수 있다.','횡격막과 늑간근도 골격근이므로 두 종류에 공통이다.',22),
  f('nm-muscle','mechanism','신경근 봉쇄제는 골격근 운동종판의 니코틴 수용체에 작용한다.','신경근 봉쇄제는 골격근 운동종판의 무스카린 수용체에 작용한다.','신경근 접합부는 Nm 니코틴 수용체에 의해 신호가 전달된다.',21),
  f('var-vs-muscle','mechanism','Varenicline은 금연 보조에, rocuronium은 신경근 봉쇄에 쓰인다.','Varenicline은 신경근 봉쇄에, rocuronium은 금연 보조에 쓰인다.','둘 다 니코틴 수용체와 연관되지만 작용 위치와 쓰임이 다르다.',20),
  f('oab-beth','clinical','Oxybutynin은 방광 배뇨근 이완에, bethanechol은 수축에 연결된다.','Oxybutynin은 방광 배뇨근 수축에, bethanechol은 이완에 연결된다.','10강 콜린 효현제와 11강 항무스카린제를 반대 방향으로 복습한다.',17),
  f('parkin-list','clinical','Trihexyphenidyl은 파킨슨병의 떨림 완화에 연결된다.','Trihexyphenidyl은 파킨슨병의 떨림 악화에 연결된다.','강의록 중추신경계 임상응용 표의 항무스카린제이다.',13),
  f('homatropine-eye','clinical','Homatropine은 안과 검사에 쓰이는 항무스카린성 산동제이다.','Homatropine은 안과 검사에 쓰이는 항무스카린성 축동제이다.','강의록의 안과 약물 지속 시간 표에 실린다.',14)
];
export const CHOL11_SPECIALS=[
  {id:'case-motion',group:'clinical',stem:'멀미 예방을 위해 전정기관에서 중추로 가는 콜린성 신호를 억제하려 한다. 가장 알맞은 약물은?',answer:'Scopolamine',options:['Scopolamine','Tropicamide','Ipratropium','Oxybutynin','Benztropine'],note:'Scopolamine은 BBB를 통과하는 항무스카린제이며 멀미에 쓰인다.'},
  {id:'case-eye',group:'clinical',stem:'안과 검사에서 짧은 시간 동안 동공을 확대하려 한다. 가장 알맞은 약물은?',answer:'Tropicamide',options:['Tropicamide','Atropine','Scopolamine','Homatropine','Cyclopentolate'],note:'강의록의 지속 시간 비교에서 tropicamide의 산동 효과가 가장 짧다.'},
  {id:'case-oab',group:'clinical',stem:'요절박을 호소하는 과민성 방광 환자에게 쓰이는 항무스카린 약물은?',answer:'Oxybutynin',options:['Oxybutynin','Bethanechol','Pilocarpine','Cevimeline','Carbachol'],note:'Oxybutynin은 방광 배뇨근을 이완한다. 나머지는 직접작용 콜린 효현제이다.'},
  {id:'case-bbb',group:'clinical',stem:'다음 중 강의록의 비교에서 BBB를 가장 잘 통과하는 약물은?',answer:'Scopolamine',options:['Scopolamine','Atropine','Ipratropium','Tiotropium','Edrophonium'],note:'Atropine과 scopolamine은 3차 아민이며 scopolamine이 더 쉽게 BBB를 통과한다.'},
  {id:'case-antidote',group:'mechanism',stem:'살충제 노출 후 서맥·과다 분비가 나타났다. 무스카린 증상을 우선 차단할 약물은?',answer:'Atropine',options:['Atropine','Pralidoxime','Scopolamine','Carbachol','Physostigmine'],note:'강의록은 우선 atropine으로 무스카린 수용체를 차단하고 pralidoxime으로 숙성 전 AChE를 재생한다고 설명한다.'},
  {id:'case-oxime',group:'mechanism',stem:'유기인 중독에서 숙성 전에 인산화된 AChE를 재생할 약물은?',answer:'Pralidoxime',options:['Pralidoxime','Atropine','Scopolamine','Neostigmine','Pilocarpine'],note:'Pralidoxime(2-PAM)의 oxime기가 인산화된 AChE에서 인을 떼어낸다.'},
  {id:'case-neuromuscular',group:'mechanism',stem:'신경근 봉쇄와 고칼륨혈증이 함께 연결되는 약물은?',answer:'Succinylcholine',options:['Succinylcholine','Rocuronium','Vecuronium','Tubocurarine','Mivacurium'],note:'Succinylcholine은 탈분극성 신경근 봉쇄제이다. 다른 네 약물은 강의록의 비탈분극성 목록이다.'},
  {id:'case-oab-exception',group:'mechanism',stem:'다음 중 족보의 과민성 방광 치료제 선지에서 작용 기전이 다른 약물은?',answer:'Mirabegron',options:['Mirabegron','Oxybutynin','Tolterodine','Solifenacin','Trospium'],note:'족보의 비교 선지: 나머지 네 약물은 항무스카린제이고 mirabegron은 β3 아드레날린 수용체 효현제다.'}
];
export const CHOL11_CASES=[
  {id:'case-parkinson-benztropine',group:'clinical',
    stem:'파킨슨병 환자의 떨림에서 중추 콜린성 과활성을 낮추는 항무스카린 약물은?',answer:'Benztropine',
    options:['Benztropine','Tropicamide','Oxybutynin','Tiotropium','Scopolamine'],
    note:'Benztropine은 파킨슨병의 떨림 완화에 연결된다. Tropicamide는 산동, oxybutynin은 과민성 방광, tiotropium은 기관지 확장, scopolamine은 멀미 예방에 쓰인다. (강의록 13쪽)'},
  {id:'case-copd-tiotropium',group:'clinical',
    stem:'COPD 환자의 기관지 평활근에서 무스카린 작용을 차단해 확장을 돕는 흡입 약물은?',answer:'Tiotropium',
    options:['Tiotropium','Tropicamide','Oxybutynin','Benztropine','Bethanechol'],
    note:'Tiotropium은 4차 아민 흡입 항무스카린제로 기관지 확장에 쓰인다. Ipratropium도 같은 용도로 쓰지만 이 보기에는 없다. Tropicamide는 안과, oxybutynin은 방광, benztropine은 떨림에 쓰고 bethanechol은 무스카린 효현제다. (강의록 16쪽)'}
];
// A canonical role is assigned when a medicine has several possible applications.
export const CHOL11_DRUGS=[
  ['atropine','유기인 중독 대응'],['pralidoxime','유기인 중독 대응'],
  ['scopolamine','멀미 예방'],
  ['benztropine','파킨슨병 떨림'],['trihexyphenidyl','파킨슨병 떨림'],['orphenadrine','파킨슨병 떨림'],['procyclidine','파킨슨병 떨림'],
  ['dicyclomine','위장관 증상'],['diphenoxylate','위장관 증상'],['pirenzepine','위장관 증상'],['telenzepine','위장관 증상'],
  ['homatropine','안과 산동'],['cyclopentolate','안과 산동'],['tropicamide','안과 산동'],
  ['ipratropium','기관지 확장'],['tiotropium','기관지 확장'],
  ['oxybutynin','과민성 방광'],['tolterodine','과민성 방광'],['darifenacin','과민성 방광'],['solifenacin','과민성 방광'],['trospium','과민성 방광'],['fesoterodine','과민성 방광'],
  ['nicotine','금연 보조'],['varenicline','금연 보조'],['cytisine','금연 보조'],
  ['tubocurarine','비탈분극성 근이완'],['vecuronium','비탈분극성 근이완'],['rocuronium','비탈분극성 근이완'],['mivacurium','비탈분극성 근이완'],
  ['succinylcholine','탈분극성 근이완']
].map(([drug,category])=>({drug,category}));
const SYMBOLS=['①','②','③','④','⑤'];
export function makeChol11Question(fact,targetCorrect,random=Math.random){
  const others=shuffle(CHOL11_FACTS.filter(x=>x.group===fact.group&&x.id!==fact.id),random);
  const desired=(targetCorrect?fact.correct:fact.incorrect).length;
  const competitors=others.sort((a,b)=>Math.abs((targetCorrect?a.incorrect:a.correct).length-desired)-Math.abs((targetCorrect?b.incorrect:b.correct).length-desired)).slice(0,4);
  const choices=shuffle([{fact,text:targetCorrect?fact.correct:fact.incorrect,isAnswer:true},...competitors.map(x=>({fact:x,text:targetCorrect?x.incorrect:x.correct,isAnswer:false}))],random);
  const topic={clinical:'임상 응용',effects:'장기에 대한 작용',mechanism:'작용 기전'}[fact.group];
  return {stem:`다음 중 ${topic}에 관한 설명으로 ${targetCorrect?'옳은':'옳지 않은'} 것은?`,choices,answerIndex:choices.findIndex(x=>x.isAnswer),fact};
}
export function makeChol11Special(fact,random=Math.random){
  const choices=shuffle(fact.options.map(text=>({text,isAnswer:text===fact.answer})),random);
  return {stem:fact.stem,choices,answerIndex:choices.findIndex(x=>x.isAnswer),fact,special:true};
}
export function initChol11Quiz(){
  const $=id=>document.getElementById(id),KEY='pharmacology-cholinergic-lecture11-v1';
  let state={seen:{},missed:{},recent:[],lastGroup:null,lastTarget:false,total:0,right:0,boards:0};
  try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved?.seen)state={...state,...saved};}catch{}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
  let tab='quiz',current=null,answered=false,session=0;
  function stats(){$('chol11Stats').textContent=`정답 ${state.right}/${state.total} · 복기한 연결 ${Object.keys(state.seen).length}/${CHOL11_FACTS.length+CHOL11_SPECIALS.length+CHOL11_CASES.length}`;}
  function next(){
    const all=[...CHOL11_FACTS,...CHOL11_SPECIALS,...CHOL11_CASES];
    let pool=all.filter(f=>!(state.recent||[]).includes(f.id)&&f.group!==state.lastGroup);
    if(!pool.length)pool=all.filter(f=>!(state.recent||[]).includes(f.id));
    if(session%4===0){const short=pool.filter(f=>CHOL11_SPECIALS.includes(f)||CHOL11_CASES.includes(f));if(short.length)pool=short;}
    const weight=f=>(state.seen[f.id]||0)-0.3*(state.missed[f.id]||0);
    const low=Math.min(...pool.map(weight));const fact=shuffle(pool.filter(f=>weight(f)===low))[0];
    const target=!state.lastTarget;state.lastTarget=target;state.lastGroup=fact.group;
    state.recent=[fact.id,...(state.recent||[]).filter(id=>id!==fact.id)].slice(0,3);
    current=CHOL11_SPECIALS.includes(fact)||CHOL11_CASES.includes(fact)?makeChol11Special(fact):makeChol11Question(fact,target);
    answered=false;session++;save();stats();
    $('chol11Progress').textContent=`이번 회독 ${session}문제`;$('chol11Stem').textContent=current.stem;
    $('chol11Feedback').hidden=true;$('chol11Next').hidden=true;
    const host=$('chol11Choices');host.replaceChildren();
    current.choices.forEach((entry,i)=>{const button=document.createElement('button');button.type='button';const no=document.createElement('span');no.className='option-no';no.textContent=SYMBOLS[i];const label=document.createElement('span');label.textContent=entry.text;button.append(no,label);button.addEventListener('click',()=>answer(i));host.append(button);});
  }
  function answer(i){
    if(answered||!current)return;answered=true;
    const good=i===current.answerIndex,f=current.fact;
    state.total++;state.right+=Number(good);state.seen[f.id]=(state.seen[f.id]||0)+1;
    if(!good)state.missed[f.id]=(state.missed[f.id]||0)+1;save();stats();
    [...$('chol11Choices').children].forEach((button,j)=>{button.disabled=true;if(j===current.answerIndex)button.classList.add('correct');else if(j===i)button.classList.add('wrong');});
    const fb=$('chol11Feedback');fb.className=`feedback ${good?'ok':'bad'}`;fb.replaceChildren();
    const heading=document.createElement('strong');heading.textContent=`${good?'정답입니다.':'바뀐 부분을 확인하세요.'} 정답 ${SYMBOLS[current.answerIndex]}`;
    const list=document.createElement('ol');list.className='ans-explanations';
    if(current.special){const row=document.createElement('li');row.textContent=`${f.answer} · ${f.note}`;list.append(row);}
    else current.choices.forEach((item,j)=>{const row=document.createElement('li');row.textContent=`${SYMBOLS[j]} ${item.text===item.fact.correct?'옳음':'틀림'} · ${item.fact.note}${item.text!==item.fact.correct?' 바른 설명: '+item.fact.correct:''} (강의록 ${item.fact.page}쪽)`;list.append(row);});
    fb.append(heading,list);fb.hidden=false;$('chol11Next').hidden=false;
  }
  const match=createMatchBoard({poolId:'chol11Pool',cardsId:'chol11Cards',zonesId:'chol11Zones',statusId:'chol11DragStatus',checkId:'chol11Check',resetId:'chol11Reset',items:CHOL11_DRUGS,categoryOf:f=>f.category,keyOf:f=>f.drug,labelOf:f=>f.drug,onGrade:()=>{state.boards++;save();}});
  $('chol11Next').addEventListener('click',next);
  for(const [id,value] of [['chol11QuizTab','quiz'],['chol11DragTab','drag']])$(id).addEventListener('click',()=>{
    tab=value;$('chol11QuizPanel').hidden=tab!=='quiz';$('chol11DragPanel').hidden=tab!=='drag';
    for(const [tabId,active] of [['chol11QuizTab',tab==='quiz'],['chol11DragTab',tab==='drag']]){$(tabId).classList.toggle('active',active);$(tabId).setAttribute('aria-selected',String(active));}
    if(tab==='quiz'&&!current)next();if(tab==='drag')match.open();
  });
  document.addEventListener('keydown',e=>{if($('chol11View').hidden||tab!=='quiz'||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(/^[1-5]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}if(e.key==='Enter'&&answered){e.preventDefault();next();}});
  stats();return {open(){if(tab==='quiz'&&!current)next();if(tab==='drag')match.open();}};
}
