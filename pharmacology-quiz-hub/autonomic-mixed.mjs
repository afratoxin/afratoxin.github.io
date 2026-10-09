import {ANS_FACTS,ANS_CASES,makeAnsQuestion,makeAnsSpecialQuestion} from './ans9.mjs?v=20261009-1';
import {CHOL_FACTS,CHOL_SPECIALS,CHOL_CASES,makeCholQuestion,makeCholSpecialQuestion} from './chol10.mjs?v=20261007-1';
import {CHOL11_FACTS,CHOL11_SPECIALS,CHOL11_CASES,makeChol11Question,makeChol11Special} from './chol11.mjs?v=20261007-1';
import {ADR12_QUESTIONS} from './adr12.mjs?v=20261009-1';
import {ADR13_QUESTIONS} from './adr13.mjs?v=20261009-1';
import {shuffle,prepareQuestion} from './autonomic-quiz.mjs?v=20261009-1';

const q=(id,stem,answer,distractors,note)=>({id,group:'cross',lecture:'cross',stem,answer,options:[answer,...distractors],note});
export const MIXED_QUESTIONS=[
  q('oab-beta3','과민성 방광 환자에서 배뇨근을 이완시키되 β3 수용체를 직접 자극하는 약물은?','Mirabegron',['Oxybutynin','Bethanechol','Pilocarpine','Prazosin'],'Mirabegron(12강)은 β3 효현제다. Oxybutynin(11강)은 항무스카린제이고 bethanechol(10강)은 배뇨근을 수축시킨다.'),
  q('oab-antimuscarinic','과민성 방광에서 무스카린 수용체를 차단해 배뇨근을 이완시키는 약물은?','Oxybutynin',['Mirabegron','Bethanechol','Pilocarpine','Phenylephrine'],'Oxybutynin(11강)은 항무스카린제다. Mirabegron(12강)도 배뇨근을 이완하지만 β3 효현제이며 bethanechol(10강)은 반대 방향으로 작용한다.'),
  q('retention','수술 후 소변 정체에서 배뇨근의 무스카린 수용체를 자극해 수축시키려 한다. 약물은?','Bethanechol',['Oxybutynin','Mirabegron','Prazosin','Tamsulosin'],'Bethanechol(10강)은 배뇨근 수축과 연결된다. Oxybutynin·mirabegron은 과민성 방광에서 배뇨근을 이완하고 α1 차단제는 전립선 출구 저항을 낮춘다.'),
  q('bronchi-beta','기도 평활근을 직접 β2 자극하여 빠른 기관지 확장에 사용할 약물은?','Albuterol',['Ipratropium','Tiotropium','Propranolol','Clonidine'],'Albuterol(12강)은 단시간 작용 β2 효현제다. Ipratropium·tiotropium(11강)은 무스카린 차단, propranolol(13강)은 β 차단제다.'),
  q('bronchi-muscarinic','COPD에서 기관지의 무스카린 수용체를 차단하는 흡입 약물은?','Tiotropium',['Albuterol','Salmeterol','Propranolol','Clonidine'],'Tiotropium(11강)은 항무스카린 기관지 확장제다. Albuterol·salmeterol(12강)은 β2 효현제이고 propranolol(13강)은 β 차단제다.'),
  q('asthma-beta-block','천식 병력 환자에서 β2 차단으로 기관지 수축에 특히 주의할 약물은?','Propranolol',['Metoprolol','Atenolol','Bisoprolol','Esmolol'],'Propranolol(13강)은 비선택성 β 차단제다. 다른 보기 네 약물은 β1 선택성이며, β2 효현제는 기도를 이완한다.'),
  q('glaucoma-beta','녹내장에서 방수 생성 자체를 줄이는 β 차단제는?','Timolol',['Carbachol','Pilocarpine','Phenylephrine','Tropicamide'],'Timolol(13강)은 방수 생성을 낮춘다. Carbachol·pilocarpine(10강)은 콜린성 축동제이며 tropicamide(11강)는 항무스카린 산동제다.'),
  q('glaucoma-cholin','녹내장에서 직접 콜린 수용체를 자극하여 축동과 방수 유출을 돕는 약물은?','Carbachol',['Timolol','Tropicamide','Phenylephrine','Atropine'],'Carbachol(10강)은 직접 콜린 효현제다. Timolol(13강)은 방수 생성 감소, tropicamide·atropine(11강)은 항무스카린 산동 약물이다.'),
  q('cholin-uptake','ACh 합성에 필요한 choline의 신경말단 유입을 차단하는 약물은?','Hemicholinium',['Vesamicol','Reserpine','Cocaine','Metyrosine'],'Hemicholinium(9강)은 ChT 억제제다. Vesamicol은 VAChT, reserpine은 VMAT, cocaine은 NET, metyrosine은 tyrosine hydroxylase에 작용한다.'),
  q('ne-reuptake','NE가 시냅스전 뉴런으로 돌아오는 NET 재흡수를 차단하는 약물은?','Cocaine',['Reserpine','Vesamicol','Hemicholinium','Guanethidine'],'Cocaine(9·12강)은 NET를 억제한다. Reserpine은 VMAT, vesamicol은 VAChT, hemicholinium은 ChT, guanethidine은 NE 유리에 작용한다.'),
  q('a2-opposite','시냅스전 α2 자가수용체를 활성화하여 NE 유리를 줄이는 약물은?','Clonidine',['Yohimbine','Prazosin','Phenylephrine','Phentolamine'],'Clonidine(12강)은 α2 효현제다. Yohimbine(13강)은 α2 길항제로 NE 유리 방향이 반대다.'),
  q('a2-block','시냅스전 α2 자가수용체를 차단하여 NE 유리를 늘리는 약물은?','Yohimbine',['Clonidine','Prazosin','Phenylephrine','Metoprolol'],'Yohimbine(13강)은 α2 길항제다. Clonidine(12강)은 α2 효현제이므로 NE 유리를 줄인다.'),
  q('bph','전립선비대증에서 전립선 평활근의 α1 수용체를 차단할 약물은?','Tamsulosin',['Bethanechol','Mirabegron','Oxybutynin','Phenylephrine'],'Tamsulosin(13강)은 α1A 차단제다. Bethanechol은 배뇨근 수축, mirabegron·oxybutynin은 배뇨근 이완, phenylephrine은 α1 효현제다.'),
  q('neuromuscular','골격근 Nm 수용체에서 지속적 탈분극으로 신경근 봉쇄를 유발하는 약물은?','Succinylcholine',['Rocuronium','Nicotine','Neostigmine','Atropine'],'Succinylcholine(11강)은 탈분극성 봉쇄제다. Rocuronium은 경쟁적 길항제, neostigmine은 AChE 억제제이며 9강의 Nm은 운동종판 수용체다.')
];

function fromLegacy(lecture,fact,build){
  return {id:`${lecture}:${fact.id}`,lecture,group:`${lecture}:${fact.group}`,render:seen=>{
    const question=build(fact,seen%2===0);
    const entries=question.choices||question.answers;
    const details=question.special?[]:entries.map((x,i)=>`${i+1}. ${x.fact.note} ${x.text===x.fact.correct?'':'바른 설명: '+x.fact.correct}`);
    return {stem:question.stem,choices:entries.map(x=>({text:x.text})),answerIndex:question.answerIndex,note:question.special?fact.note:`핵심: ${fact.note} (강의록 ${fact.page}쪽)`,details,page:fact.page};
  }};
}

export function buildMixedPool(){
  const out=[];
  for(const f of ANS_FACTS)out.push(fromLegacy(9,f,(x,correct)=>makeAnsQuestion(x,correct)));
  for(const f of ANS_CASES)out.push(fromLegacy(9,f,x=>makeAnsSpecialQuestion(x)));
  for(const f of CHOL_FACTS)out.push(fromLegacy(10,f,(x,correct)=>makeCholQuestion(x,correct)));
  for(const f of [...CHOL_SPECIALS,...CHOL_CASES])out.push(fromLegacy(10,f,x=>makeCholSpecialQuestion(x)));
  for(const f of CHOL11_FACTS)out.push(fromLegacy(11,f,(x,correct)=>makeChol11Question(x,correct)));
  for(const f of [...CHOL11_SPECIALS,...CHOL11_CASES])out.push(fromLegacy(11,f,x=>makeChol11Special(x)));
  for(const [lecture,bank] of [[12,ADR12_QUESTIONS],[13,ADR13_QUESTIONS]])for(const fact of bank){out.push({id:`${lecture}:${fact.id}`,lecture,group:`${lecture}:${fact.group}`,render:()=>prepareQuestion(fact)});}
  for(const fact of MIXED_QUESTIONS)out.push({id:`cross:${fact.id}`,lecture:'cross',group:'cross',render:()=>prepareQuestion(fact)});
  return out;
}

export function nextMixedQuestion(pool,state,random=Math.random){
  const lectures=[9,10,11,12,13,'cross'];
  const count=l=>pool.filter(x=>x.lecture===l).reduce((n,x)=>n+(state.seen[x.id]||0),0);
  const eligible=lectures.filter(l=>l!==state.lastLecture);
  const min=Math.min(...eligible.map(count));
  const lecture=shuffle(eligible.filter(l=>count(l)===min),random)[0];
  let candidates=pool.filter(x=>x.lecture===lecture&&!state.recent.includes(x.id)&&x.group!==state.lastGroup);
  if(!candidates.length)candidates=pool.filter(x=>x.lecture===lecture&&!state.recent.includes(x.id));
  if(!candidates.length)candidates=pool.filter(x=>x.lecture===lecture);
  const score=x=>(state.seen[x.id]||0)-0.3*(state.missed?.[x.id]||0);
  const low=Math.min(...candidates.map(score));
  const fact=shuffle(candidates.filter(x=>score(x)===low),random)[0];
  return {...fact.render(state.seen[fact.id]||0),id:fact.id,lecture:fact.lecture,group:fact.group};
}
