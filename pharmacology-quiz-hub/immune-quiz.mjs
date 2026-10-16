import {initSimpleTargetQuiz} from './simple-target-quiz.mjs?v=20261017-sigfreq1';
import {recordStudyResult} from './study-records.mjs?v=20261015-review1';
import {IMM_DRUGS,IMM_SECTIONS,IMM_QUESTIONS,IMM_CORRECTIONS,pickImmQuestion} from './immune-data.mjs?v=20261017-clinical1';
import {createMatchBoard} from './match-board.mjs?v=20261015-review1';

export function initImmuneQuiz(){
  const $=id=>document.getElementById(id),symbols=['①','②','③','④','⑤'],storage='pharmacology-immune-28-v1';
  const state={draws:0,total:0,right:0,seen:{},lastResult:{},recent:[],subjects:[],lastGroup:null};
  try{const saved=JSON.parse(localStorage.getItem(storage)||'null');if(saved&&typeof saved==='object')Object.assign(state,saved);}catch{}
  state.seen||={};state.lastResult||={};if(!Array.isArray(state.recent))state.recent=[];if(!Array.isArray(state.subjects))state.subjects=[];
  const save=()=>{try{localStorage.setItem(storage,JSON.stringify(state));}catch{}};
  const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  let current=null,answered=false,tab='Quiz',board=null;
  const simple=initSimpleTargetQuiz({scope:'immune-simple',prefix:'immSimple',viewId:'immuneView'});
  function stats(){
    $('immStats').textContent=`정답 ${state.right}/${state.total} · 복습 ${Object.keys(state.seen).length}/${IMM_QUESTIONS.length}문항`;

  }
  function next(){
    current=pickImmQuestion(state,$('immScope').value,$('immMode').value);answered=false;state.draws++;
    state.recent=[current.id,...state.recent].slice(0,3);state.subjects=[current.subject,...state.subjects].slice(0,3);state.lastGroup=current.group;save();stats();
    $('immProgress').textContent=`${current.format==='clinical'?'임상 상황 · 약물 선택':current.kind==='target'?'표적·매칭':'기전·부작용'} · ${state.draws}번째 연습`;
    $('immStem').textContent=current.stem;$('immSource').textContent=current.source;$('immExam').textContent=current.exam||'전체 범위 · 강의록';
    $('immFeedback').hidden=true;$('immNext').hidden=true;$('immChoices').replaceChildren();
    current.choices.forEach((c,i)=>{const b=node('button');b.type='button';b.append(node('span','option-no',symbols[i]),node('span','',c.text));b.addEventListener('click',()=>answer(i));$('immChoices').append(b);});
  }
  function answer(index){
    if(!current||answered)return;answered=true;const good=index===current.answerIndex;
    state.total++;state.right+=Number(good);state.seen[current.id]=(state.seen[current.id]||0)+1;state.lastResult[current.id]=good;save();stats();
    recordStudyResult('immune',current,good);
    [...$('immChoices').children].forEach((b,i)=>{b.disabled=true;if(i===current.answerIndex)b.classList.add('correct');else if(i===index)b.classList.add('wrong');});
    const feedback=$('immFeedback');feedback.className=`feedback ${good?'ok':'bad'}`;feedback.replaceChildren(node('strong','',`${good?'정답입니다.':'다시 연결해 보세요.'} 정답 ${symbols[current.answerIndex]} · ${current.answer}`),node('p','',current.note));
    if(current.details?.length){const details=node('details','cns-choice-notes');details.append(node('summary','','선지별 연결 보기'));const list=node('ul');for(const c of current.choices){const text=current.details.find(x=>x.startsWith(c.text+':'));if(text)list.append(node('li','',text));}details.append(list);feedback.append(details);}
    feedback.append(node('p','cns-source',current.source));feedback.hidden=false;$('immNext').hidden=false;
  }
  function selected(value){return IMM_DRUGS.filter(d=>value==='all'||(value==='core'?d.core:d.section===value)).sort((a,b)=>Number(b.core)-Number(a.core)||b.weight-a.weight);}
  function buildBoard(){
    const host=$('immBoard');host.replaceChildren();
    const wrap=node('div','match-board'),pool=node('div','match-column match-pool');pool.id='immPool';
    const heading=node('h3','','약물 카드 ');heading.append(node('span','pool-count'));pool.append(heading);
    const cards=node('div','drag-cards');cards.id='immCards';pool.append(cards,node('small','','카드를 끌거나, 카드와 칸을 차례로 누르세요. 놓은 카드도 옮기거나 목록으로 되돌릴 수 있습니다.'));
    const targets=node('div','match-column match-targets');targets.append(node('h3','','표적·핵심 연결'));
    const zones=node('div','drop-zones');zones.id='immZones';targets.append(zones);wrap.append(pool,targets);
    const actions=node('div','match-actions'),status=node('div','match-status');status.id='immDragStatus';status.setAttribute('role','status');
    const check=node('button','primary','지금 채점하기');check.id='immCheck';check.type='button';
    const resume=node('button','primary','이 배치에서 계속하기 →');resume.id='immReset';resume.type='button';resume.hidden=true;
    const fresh=node('button','back-button','처음부터 섞기');fresh.type='button';
    actions.append(status,check,resume,fresh);host.append(wrap,actions);
    board=createMatchBoard({poolId:pool.id,cardsId:cards.id,zonesId:zones.id,statusId:status.id,checkId:check.id,resetId:resume.id,items:selected($('immMatchFilter').value),categoryOf:d=>d.binding==='—'?d.target:`${d.binding} → ${d.target}`,keyOf:d=>d.id,labelOf:d=>d.name,onGrade:()=>{}});
    const currentBoard=board;fresh.addEventListener('click',()=>currentBoard.reset());board.open();
  }
  function table(){
    const body=$('immTableBody');body.replaceChildren();
    for(const d of selected($('immTableFilter').value)){
      const tr=node('tr'),name=node('td');name.append(node('strong','',d.name));if(d.exam)name.append(node('small','imm-row-exam',d.exam));
      const target=node('td');if(d.binding!=='—')target.append(node('small','imm-binding',`결합 단백질: ${d.binding}`));target.append(node('strong','',d.target));
      tr.append(name,target,node('td','',d.note),node('td','',`${d.clinical} · ${d.risk}`),node('td','',d.source));body.append(tr);
    }
  }
  for(const id of ['immMatchFilter','immTableFilter']){
    const select=$(id);for(const section of IMM_SECTIONS){const option=node('option','',section);option.value=section;select.append(option);}
  }
  for(const item of IMM_CORRECTIONS){const p=node('p');p.append(node('strong','',item.title+' · '),node('span','',item.text+' '));const a=node('a','source-button','확인 근거');a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';p.append(a);$('immCorrections').append(p);}
  $('immMatchFilter').addEventListener('change',buildBoard);$('immTableFilter').addEventListener('change',table);
  for(const name of ['Quiz','Simple','Drag','Table'])$('imm'+name+'Tab').addEventListener('click',()=>{
    tab=name;for(const n of ['Quiz','Simple','Drag','Table']){$('imm'+n+'Panel').hidden=n!==name;const b=$('imm'+n+'Tab');b.classList.toggle('active',n===name);b.setAttribute('aria-selected',String(n===name));}
    if(name==='Quiz'){if(!current)next();}else if(name==='Drag'){if(!board)buildBoard();else board.open();}else if(name==='Table')table();else simple.open();
  });
  for(const id of ['immScope','immMode'])$(id).addEventListener('change',next);
  $('immNext').addEventListener('click',next);$('immSkip').addEventListener('click',next);
  document.addEventListener('keydown',e=>{
    if($('immuneView').hidden||tab!=='Quiz'||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT|SUMMARY/.test(e.target.tagName))return;
    if(/^[1-5]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}
    if(e.key==='Enter'&&answered&&!/^(BUTTON|A)$/.test(e.target.tagName)){e.preventDefault();next();}
  });
  stats();return {open(){if(tab==='Quiz'){if(!current)next();}else if(tab==='Drag'){if(!board)buildBoard();else board.open();}else if(tab==='Table')table();else simple.open();}};
}
