import {initSimpleTargetQuiz} from './simple-target-quiz.mjs?v=20261017-sigimage1';
import {recordStudyResult} from './study-records.mjs?v=20261015-review1';
import {SIGNAL_DRUGS,SIGNAL_TARGETS,SIGNAL_SECTIONS,SIGNAL_QUESTIONS,SIGNAL_CORRECTIONS,pickSignalQuestion} from './signal31-data.mjs?v=20261017-sigimage1';
import {createMatchBoard} from './match-board.mjs?v=20261015-review1';

export function initSignalQuiz(){
  const $=id=>document.getElementById(id),symbols=['①','②','③','④','⑤'],storage='pharmacology-signal-31-v1';
  const state={draws:0,total:0,right:0,seen:{},lastResult:{},recent:[],subjects:[],lastGroup:null};
  try{const saved=JSON.parse(localStorage.getItem(storage)||'null');if(saved&&typeof saved==='object')Object.assign(state,saved);}catch{}
  state.seen||={};state.lastResult||={};if(!Array.isArray(state.recent))state.recent=[];if(!Array.isArray(state.subjects))state.subjects=[];
  const save=()=>{try{localStorage.setItem(storage,JSON.stringify(state));}catch{}};
  const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  let current=null,answered=false,tab='Quiz',board=null;
  const simple=initSimpleTargetQuiz({scope:'signal-simple',prefix:'sigSimple',viewId:'signalView'});
  function stats(){
    $('signalStats').textContent=`정답 ${state.right}/${state.total} · 복습 ${Object.keys(state.seen).length}/${SIGNAL_QUESTIONS.length}문항`;

  }
  function next(){
    current=pickSignalQuestion(state,$('sigScope').value,$('sigMode').value);answered=false;state.draws++;
    state.recent=[current.id,...state.recent].slice(0,3);state.subjects=[current.subject,...state.subjects].slice(0,3);state.lastGroup=current.group;save();stats();
    $('sigProgress').textContent=`${current.format==='clinical'?'임상 상황 · 약물 선택':current.kind==='target'?'표적·매칭':'기전·사례'} · ${state.draws}번째 연습`;
    $('sigStem').textContent=current.stem;$('sigSource').textContent=current.source;$('sigExam').textContent=current.exam||'전체 범위 · 강의록';
    $('sigFeedback').hidden=true;$('sigNext').hidden=true;$('sigChoices').replaceChildren();
    current.choices.forEach((c,i)=>{const b=node('button');b.type='button';b.append(node('span','option-no',symbols[i]),node('span','',c.text));b.addEventListener('click',()=>answer(i));$('sigChoices').append(b);});
  }
  function answer(index){
    if(!current||answered)return;answered=true;const good=index===current.answerIndex;
    state.total++;state.right+=Number(good);state.seen[current.id]=(state.seen[current.id]||0)+1;state.lastResult[current.id]=good;save();stats();
    recordStudyResult('signal',current,good);
    [...$('sigChoices').children].forEach((b,i)=>{b.disabled=true;if(i===current.answerIndex)b.classList.add('correct');else if(i===index)b.classList.add('wrong');});
    const feedback=$('sigFeedback');feedback.className=`feedback ${good?'ok':'bad'}`;feedback.replaceChildren(node('strong','',`${good?'정답입니다.':'다시 연결해 보세요.'} 정답 ${symbols[current.answerIndex]} · ${current.answer}`),node('p','',current.note));
    if(current.details?.length){const details=node('details','cns-choice-notes');details.append(node('summary','','선지별 연결 보기'));const list=node('ul');for(const c of current.choices){const text=current.details.find(x=>x.startsWith(c.text+':'));if(text)list.append(node('li','',text));}details.append(list);feedback.append(details);}
    feedback.append(node('p','cns-source',current.source));feedback.hidden=false;$('sigNext').hidden=false;
  }
  function selected(value){return SIGNAL_DRUGS.filter(d=>value==='all'||(value==='core'?d.core:d.section===value)).sort((a,b)=>Number(b.core)-Number(a.core)||b.weight-a.weight);}
  function buildBoard(){
    const host=$('sigBoard');host.replaceChildren();
    const wrap=node('div','match-board'),pool=node('div','match-column match-pool');pool.id='sigPool';
    const heading=node('h3','','약물 카드 ');heading.append(node('span','pool-count'));pool.append(heading);
    const cards=node('div','drag-cards');cards.id='sigCards';pool.append(cards,node('small','','카드를 끌거나, 카드와 칸을 차례로 누르세요. 놓은 카드도 옮기거나 목록으로 되돌릴 수 있습니다.'));
    const targets=node('div','match-column match-targets');targets.append(node('h3','','표적·핵심 연결'));
    const zones=node('div','drop-zones');zones.id='sigZones';targets.append(zones);wrap.append(pool,targets);
    const actions=node('div','match-actions'),status=node('div','match-status');status.id='sigDragStatus';status.setAttribute('role','status');
    const check=node('button','primary','지금 채점하기');check.id='sigCheck';check.type='button';
    const resume=node('button','primary','이 배치에서 계속하기 →');resume.id='sigReset';resume.type='button';resume.hidden=true;
    const fresh=node('button','back-button','처음부터 섞기');fresh.type='button';
    actions.append(status,check,resume,fresh);host.append(wrap,actions);
    const filter=$('sigMatchFilter').value,items=SIGNAL_TARGETS.filter(d=>filter==='image'||filter==='all'||d.section===filter);
    board=createMatchBoard({poolId:pool.id,cardsId:cards.id,zonesId:zones.id,statusId:status.id,checkId:check.id,resetId:resume.id,items,studyId:'signal-target',categoryOf:d=>d.categories[0],categoriesOf:d=>d.categories,keyOf:d=>d.id,labelOf:d=>d.name,onGrade:()=>{}});
    const currentBoard=board;fresh.addEventListener('click',()=>currentBoard.reset());board.open();
  }
  function table(){
    const body=$('sigTableBody');body.replaceChildren();
    const query=$('sigTableSearch').value.trim().toLocaleLowerCase();
    for(const d of selected($('sigTableFilter').value).filter(d=>!query||[d.name,d.targetLabel,d.type,d.note,d.clinical].join(' ').toLocaleLowerCase().includes(query))){
      const tr=node('tr'),name=node('td');name.append(node('strong','',d.name),node('small','imm-row-exam',`${d.core?'핵심':'보충'} · ${d.exam||'강의 정리'}`));
      tr.append(name,node('td','',d.type),node('td','',d.targetLabel),node('td','',d.note),node('td','',d.clinical),node('td','',d.source));body.append(tr);
    }
    $('sigTableEmpty').hidden=body.children.length>0;
  }
  for(const id of ['sigMatchFilter','sigTableFilter']){
    const select=$(id);for(const section of SIGNAL_SECTIONS){const option=node('option','',section);option.value=section;select.append(option);}
  }
  for(const item of SIGNAL_CORRECTIONS){const p=node('p');p.append(node('strong','',item.title+' · '),node('span','',item.text+' '));if(item.url){const a=node('a','source-button','확인 근거');a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';p.append(a);}$('sigCorrections').append(p);}
  $('sigMatchFilter').addEventListener('change',buildBoard);$('sigTableFilter').addEventListener('change',table);$('sigTableSearch').addEventListener('input',table);
  for(const name of ['Quiz','Simple','Drag','Table'])$('sig'+name+'Tab').addEventListener('click',()=>{
    tab=name;for(const n of ['Quiz','Simple','Drag','Table']){$('sig'+n+'Panel').hidden=n!==name;const b=$('sig'+n+'Tab');b.classList.toggle('active',n===name);b.setAttribute('aria-selected',String(n===name));}
    if(name==='Quiz'){if(!current)next();}else if(name==='Drag'){if(!board)buildBoard();else board.open();}else if(name==='Table')table();else simple.open();
  });
  for(const id of ['sigScope','sigMode'])$(id).addEventListener('change',next);
  $('sigNext').addEventListener('click',next);$('sigSkip').addEventListener('click',next);
  document.addEventListener('keydown',e=>{
    if($('signalView').hidden||tab!=='Quiz'||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT|SUMMARY/.test(e.target.tagName))return;
    if(/^[1-5]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}
    if(e.key==='Enter'&&answered&&!/^(BUTTON|A)$/.test(e.target.tagName)){e.preventDefault();next();}
  });
  stats();return {open(){if(tab==='Quiz'){if(!current)next();}else if(tab==='Drag'){if(!board)buildBoard();else board.open();}else if(tab==='Table')table();else simple.open();}};
}
