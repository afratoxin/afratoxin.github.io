import {initSimpleTargetQuiz} from './simple-target-quiz.mjs?v=20261017-exam2';
import {recordStudyResult} from './study-records.mjs?v=20261015-review1';
import {ANTI_SECTIONS,ANTI_QUESTIONS,ANTI_TARGETS,ANTI_TOXICITY,ANTI_NOTES,pickAntiQuestion} from './anticancer-data.mjs?v=20261017-exam2';
import {createMatchBoard} from './match-board.mjs?v=20261015-review1';

export function initAnticancerQuiz(){
  const $=id=>document.getElementById(id),symbols=['①','②','③','④','⑤'],storage='pharmacology-anticancer-30-v1';
  const state={draws:0,total:0,right:0,seen:{},lastResult:{},recent:[],subjects:[],lastGroup:null};
  try{const saved=JSON.parse(localStorage.getItem(storage)||'null');if(saved&&typeof saved==='object')Object.assign(state,saved);}catch{}
  state.seen||={};state.lastResult||={};if(!Array.isArray(state.recent))state.recent=[];if(!Array.isArray(state.subjects))state.subjects=[];
  const save=()=>{try{localStorage.setItem(storage,JSON.stringify(state));}catch{}};
  const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  let current=null,answered=false,tab='Quiz',board=null;
  const simple=initSimpleTargetQuiz({scope:'anticancer-simple',prefix:'antiSimple',viewId:'anticancerView'});
  function stats(){
    $('antiStats').textContent=`정답 ${state.right}/${state.total} · 복습 ${Object.keys(state.seen).length}/${ANTI_QUESTIONS.length}문항`;

  }
  function next(){
    current=pickAntiQuestion(state,$('antiScope').value,$('antiMode').value);answered=false;state.draws++;
    state.recent=[current.id,...state.recent].slice(0,3);state.subjects=[current.subject,...state.subjects].slice(0,3);state.lastGroup=current.group;save();stats();
    $('antiProgress').textContent=`${current.kind==='target'?'표적·매칭':'기전·독성·사례'} · ${state.draws}번째 연습`;
    $('antiStem').textContent=current.stem;$('antiSource').textContent=current.source;$('antiExam').textContent=current.exam||'전체 범위 · 강의록';
    $('antiFeedback').hidden=true;$('antiNext').hidden=true;$('antiChoices').replaceChildren();
    current.choices.forEach((c,i)=>{const b=node('button');b.type='button';b.append(node('span','option-no',symbols[i]),node('span','',c.text));b.addEventListener('click',()=>answer(i));$('antiChoices').append(b);});
  }
  function answer(index){
    if(!current||answered)return;answered=true;const good=index===current.answerIndex;
    state.total++;state.right+=Number(good);state.seen[current.id]=(state.seen[current.id]||0)+1;state.lastResult[current.id]=good;save();stats();
    recordStudyResult('anticancer',current,good);
    [...$('antiChoices').children].forEach((b,i)=>{b.disabled=true;if(i===current.answerIndex)b.classList.add('correct');else if(i===index)b.classList.add('wrong');});
    const feedback=$('antiFeedback');feedback.className=`feedback ${good?'ok':'bad'}`;feedback.replaceChildren(node('strong','',`${good?'정답입니다.':'다시 연결해 보세요.'} 정답 ${symbols[current.answerIndex]} · ${current.answer}`),node('p','',current.note));
    if(current.details?.length){const details=node('details','cns-choice-notes');details.append(node('summary','','선지별 연결 보기'));const list=node('ul');for(const c of current.choices){const text=current.details.find(x=>x.startsWith(c.text+':'));if(text)list.append(node('li','',text));}details.append(list);feedback.append(details);}
    feedback.append(node('p','cns-source',current.source));feedback.hidden=false;$('antiNext').hidden=false;
  }
  function buildBoard(){
    const toxicity=$('antiMatchKind').value==='toxicity',filter=$('antiMatchFilter').value;
    const items=(toxicity?ANTI_TOXICITY:ANTI_TARGETS).filter(d=>filter==='all'||(filter==='core'?d.core:d.section===filter)).sort((a,b)=>Number(b.core)-Number(a.core)||b.weight-a.weight);
    const host=$('antiBoard');host.replaceChildren();
    const wrap=node('div','match-board'),pool=node('div','match-column match-pool');pool.id='antiPool';
    const heading=node('h3','','약물 카드 ');heading.append(node('span','pool-count'));pool.append(heading);
    const cards=node('div','drag-cards');cards.id='antiCards';pool.append(cards,node('small','','카드를 끌거나, 카드와 칸을 차례로 누르세요. 놓은 카드도 옮기거나 목록으로 되돌릴 수 있습니다.'));
    const targets=node('div','match-column match-targets');targets.append(node('h3','',toxicity?'대표 독성·구별 단서':'표적·핵심 작용'));
    const zones=node('div','drop-zones');zones.id='antiZones';targets.append(zones);wrap.append(pool,targets);
    const actions=node('div','match-actions'),status=node('div','match-status');status.id='antiDragStatus';status.setAttribute('role','status');
    const check=node('button','primary','지금 채점하기');check.id='antiCheck';check.type='button';
    const resume=node('button','primary','이 배치에서 계속하기 →');resume.id='antiReset';resume.type='button';resume.hidden=true;
    const fresh=node('button','back-button','처음부터 섞기');fresh.type='button';
    actions.append(status,check,resume,fresh);host.append(wrap,actions);
    board=createMatchBoard({studyId:toxicity?'anti-toxicity':'anti-target',poolId:pool.id,cardsId:cards.id,zonesId:zones.id,statusId:status.id,checkId:check.id,resetId:resume.id,items,categoryOf:d=>d.categories[0],categoriesOf:d=>d.categories,keyOf:d=>d.id,labelOf:d=>d.name,onGrade:()=>{}});
    const currentBoard=board;fresh.addEventListener('click',()=>currentBoard.reset());board.open();
  }
  for(const section of ANTI_SECTIONS){const option=node('option','',section);option.value=section;$('antiMatchFilter').append(option);}
  for(const text of ANTI_NOTES)$('antiNotes').append(node('p','',text));
  for(const id of ['antiMatchFilter','antiMatchKind'])$(id).addEventListener('change',buildBoard);
  for(const name of ['Quiz','Simple','Drag'])$('anti'+name+'Tab').addEventListener('click',()=>{
    tab=name;for(const n of ['Quiz','Simple','Drag']){$('anti'+n+'Panel').hidden=n!==name;const b=$('anti'+n+'Tab');b.classList.toggle('active',n===name);b.setAttribute('aria-selected',String(n===name));}
    if(name==='Quiz'){if(!current)next();}else if(name==='Simple')simple.open();else if(!board)buildBoard();else board.open();
  });
  for(const id of ['antiScope','antiMode'])$(id).addEventListener('change',next);
  $('antiNext').addEventListener('click',next);$('antiSkip').addEventListener('click',next);
  document.addEventListener('keydown',e=>{
    if($('anticancerView').hidden||tab!=='Quiz'||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT|SUMMARY/.test(e.target.tagName))return;
    if(/^[1-5]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}
    if(e.key==='Enter'&&answered&&!/^(BUTTON|A)$/.test(e.target.tagName)){e.preventDefault();next();}
  });
  stats();return {open(){if(tab==='Quiz'){if(!current)next();}else if(tab==='Simple')simple.open();else if(!board)buildBoard();else board.open();}};
}
