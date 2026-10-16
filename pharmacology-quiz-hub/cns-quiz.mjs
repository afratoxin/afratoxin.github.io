import {recordStudyResult} from './study-records.mjs?v=20261015-review1';
import {CNS_AREAS,CNS_QUESTIONS,CNS_MATCH,pickCnsQuestion} from './cns-data.mjs?v=20261016-cnspairs1';
import {createMatchBoard} from './match-board.mjs?v=20261015-review1';

export function initCnsQuiz(){
  const $=id=>document.getElementById(id),symbols=['①','②','③','④','⑤'];
  const storage='pharmacology-cns-14-15-v1';
  const state={seen:{},lastResult:{},recent:[],recentSubjects:[],lastGroup:null,lastSubject:null,total:0,right:0};
  try{const saved=JSON.parse(localStorage.getItem(storage)||'null');if(saved&&typeof saved==='object')Object.assign(state,saved);}catch{}
  state.seen||={};state.lastResult||={};if(!Array.isArray(state.recent))state.recent=[];if(!Array.isArray(state.recentSubjects))state.recentSubjects=[];
  let tab='Quiz',current=null,answered=false,session=0;
  const boards={};
  const save=()=>{try{localStorage.setItem(storage,JSON.stringify(state));}catch{}};
  const node=(tag,className,text)=>{const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e;};
  function stats(){
    $('cnsStats').textContent=`정답 ${state.right}/${state.total} · 복습 ${Object.keys(state.seen).length}/${CNS_QUESTIONS.length}문항`;

  }
  function next(){
    current=pickCnsQuestion(state,$('cnsArea').value);answered=false;session++;
    state.recent=[current.id,...state.recent].slice(0,3);state.recentSubjects=[current.subject,...state.recentSubjects].slice(0,3);state.lastGroup=current.group;state.lastSubject=current.subject;save();
    $('cnsProgress').textContent=`${CNS_AREAS[current.area]} · 이번 회독 ${session}문제`;
    $('cnsPolarity').textContent=current.polarity==='incorrect'?'옳지 않은 연결 1개':'옳은 연결 1개';$('cnsPolarity').classList.toggle('cns-negative',current.polarity==='incorrect');
    $('cnsStem').textContent=current.stem;$('cnsSource').textContent=current.source;
    $('cnsFeedback').hidden=true;$('cnsNext').hidden=true;
    const host=$('cnsChoices');host.replaceChildren();
    current.choices.forEach((c,i)=>{const b=node('button');b.type='button';b.append(node('span','option-no',symbols[i]),node('span','',c.text));b.addEventListener('click',()=>answer(i));host.append(b);});stats();
  }
  function answer(index){
    if(!current||answered)return;
    answered=true;const good=index===current.answerIndex;
    state.total++;state.right+=Number(good);state.seen[current.id]=(state.seen[current.id]||0)+1;state.lastResult[current.id]=good;save();stats();
    recordStudyResult('cns',current,good);
    [...$('cnsChoices').children].forEach((b,i)=>{b.disabled=true;if(i===current.answerIndex)b.classList.add('correct');else if(i===index)b.classList.add('wrong');});
    const feedback=$('cnsFeedback');feedback.className=`feedback ${good?'ok':'bad'}`;feedback.replaceChildren(node('strong','',`${good?'정답입니다.':'다시 연결해 보세요.'} 정답 ${symbols[current.answerIndex]} · ${current.answer}`),node('p','',current.note));
    if(current.details?.length){const details=node('details','cns-choice-notes');details.append(node('summary','','선지별 비교 보기'));const ul=node('ul');current.choices.forEach(c=>{const text=current.details.find(x=>x.startsWith(c.text+':'));if(text)ul.append(node('li','',text));});details.append(ul);feedback.append(details);}
    feedback.append(node('p','cns-source',current.source));feedback.hidden=false;$('cnsNext').hidden=false;
  }
  function buildBoard(name){
    const kind=name.toLowerCase(),prefix='cns'+name,filter=$(prefix+'Filter').value;
    const items=CNS_MATCH[kind].filter(x=>filter==='all'||x.family===filter).map(x=>({...x,note:x.why||x.note}));
    const host=$(prefix+'Board');host.replaceChildren();
    const board=node('div','match-board'),pool=node('div','match-column match-pool');pool.id=prefix+'Pool';
    const heading=node('h3','','카드 ');heading.append(node('span','pool-count'));pool.append(heading);
    const cards=node('div','drag-cards');cards.id=prefix+'Cards';pool.append(cards,node('small','','카드를 끌거나, 카드와 칸을 차례로 누르세요. 놓은 카드도 다시 이동할 수 있습니다.'));
    const targets=node('div','match-column match-targets');targets.append(node('h3','',kind==='disease'?'질환·치료 목적':'분류 칸'));
    const zones=node('div','drop-zones');zones.id=prefix+'Zones';targets.append(zones);board.append(pool,targets);
    const actions=node('div','match-actions'),status=node('div','match-status');status.id=prefix+'DragStatus';status.setAttribute('role','status');
    const check=node('button','primary','지금 채점하기');check.id=prefix+'Check';check.type='button';
    const reset=node('button','primary','이 배치에서 계속하기 →');reset.id=prefix+'Reset';reset.type='button';reset.hidden=true;
    const fresh=node('button','back-button','처음부터 섞기');fresh.type='button';
    actions.append(status,check,reset,fresh);host.append(board,actions);
    const match=createMatchBoard({poolId:pool.id,cardsId:cards.id,zonesId:zones.id,statusId:status.id,checkId:check.id,resetId:reset.id,items,categoryOf:x=>x.categories[0],categoriesOf:x=>x.categories,keyOf:x=>x.id,labelOf:x=>x.name,onGrade:()=>{}});
    fresh.addEventListener('click',()=>match.reset());match.open();boards[name]=match;
  }
  for(const name of ['Structure','Effect','Disease']){
    const select=$('cns'+name+'Filter');
    for(const family of [...new Set(CNS_MATCH[name.toLowerCase()].map(x=>x.family))]){const option=node('option','',family);option.value=family;select.append(option);}
    select.addEventListener('change',()=>buildBoard(name));
  }
  for(const name of ['Quiz','Structure','Effect','Disease'])$('cns'+name+'Tab').addEventListener('click',()=>{
    tab=name;
    for(const n of ['Quiz','Structure','Effect','Disease']){$('cns'+n+'Panel').hidden=n!==tab;const b=$('cns'+n+'Tab');b.classList.toggle('active',n===tab);b.setAttribute('aria-selected',String(n===tab));}
    if(tab==='Quiz'){if(!current)next();}else if(!boards[name])buildBoard(name);else boards[name].open();
  });
  $('cnsArea').addEventListener('change',next);$('cnsNext').addEventListener('click',next);$('cnsSkip').addEventListener('click',next);
  document.addEventListener('keydown',e=>{
    if($('cnsView').hidden||tab!=='Quiz'||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT|SUMMARY/.test(e.target.tagName))return;
    if(/^[1-5]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}
    if(e.key==='Enter'&&answered&&!/^(BUTTON|A)$/.test(e.target.tagName)){e.preventDefault();next();}
  });
  stats();return {open(){if(tab==='Quiz'){if(!current)next();}else if(!boards[tab])buildBoard(tab);else boards[tab].open();}};
}
