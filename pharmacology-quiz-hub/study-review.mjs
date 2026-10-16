import {cleanStudyDrugLabels} from './drug-labels.mjs?v=20261016-abx1';
import {studyStore,studyCountLabel,paintStudyProgress,shuffleStudyQuestion,gradeStudyAnswer} from './study-records.mjs?v=20261015-review1';
import {createMatchBoard} from './match-board.mjs?v=20261015-review1';
import {createPkPlot} from './pk-quiz.mjs?v=20261017-exam2';

export function initStudyReview({navigate}){
  const $=id=>document.getElementById(id),symbols=['①','②','③','④','⑤','⑥','⑦','⑧','⑨'];
  const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  let group=null,activeType='quiz',current=null,shown=null,answered=false,selected=new Set(),previous=null,reviewSeen={};
  const routeButtons=new Map(),summaries=new Map();
  const routeOf=d=>d.route==='drag'?'cyp':d.route;
  function scoped(){const value=$('studyReviewScope').value;return value==='group'&&group?group:value==='all'?null:[value];}
  const typed=type=>[...studyStore.definitions.values()].filter(d=>d.type===type&&(!scoped()||scoped().includes(d.id))).map(d=>d.id);
  function paint(){
    const counts=studyStore.counts(scoped());$('studyReviewSummary').textContent=studyCountLabel(counts);paintStudyProgress($('studyReviewSummary'),counts);
    $('studyWrongQuizTab').textContent=`객관식 오답 · ${studyStore.wrong(typed('quiz')).length}`;
    $('studyWrongMatchTab').textContent=`드래그 오답 · ${studyStore.wrong(typed('match')).length}`;
    for(const [route,b]of routeButtons){const ids=route==='drag'?['cyp-match']:[...studyStore.definitions.values()].filter(d=>routeOf(d)===route).map(d=>d.id);b.textContent=`오답 다시 풀기 · ${studyStore.wrong(ids).length}`;}
    for(const [route,summary]of summaries){const ids=route==='ddi'?['ddi']:route==='cyp'?['cyp']:[...studyStore.definitions.values()].filter(d=>d.type==='quiz'&&routeOf(d)===route).map(d=>d.id),n=studyStore.counts(ids);summary.textContent=studyCountLabel(n);paintStudyProgress(summary,n);}
    for(const d of studyStore.definitions.values())if(d.tabId){const tab=$(d.tabId);if(tab){paintStudyProgress(tab,studyStore.counts(d.id));tab.title=d.title+' · '+studyCountLabel(studyStore.counts(d.id));tab.setAttribute('aria-label',tab.title);}}
    for(const b of document.querySelectorAll('.hub-card[data-open]')){
      const ids=[...studyStore.definitions.values()].filter(d=>d.type==='quiz'&&routeOf(d)===b.dataset.open).map(d=>d.id);if(!ids.length)continue;
      const n=studyStore.counts(ids);paintStudyProgress(b,n);let label=b.querySelector('.study-counts');if(!label){label=node('small','study-counts');const title=b.querySelector('strong');(title?.parentNode||b).append(label);}b.setAttribute('aria-label',(b.querySelector('strong')?.textContent||'퀴즈')+' · '+studyCountLabel(n));label.textContent=(ids.length===1&&studyStore.definitions.get(ids[0]).unitLabel?'형태 기준 · ':'')+studyCountLabel(n);
    }
  }
  function mountRoutes(){
    for(const route of new Set([...studyStore.definitions.values()].map(routeOf))){
      if(routeButtons.has(route))continue;const view=$(route+'View');if(!view)continue;
      const defs=[...studyStore.definitions.values()].filter(d=>routeOf(d)===route),existing=defs.map(d=>d.tabId&&$(d.tabId)?.parentNode).find(Boolean);
      let nav=existing;if(!nav){nav=node('div','ans-tabs study-review-nav');const normal=node('button','active','전체 문제');normal.type='button';normal.addEventListener('click',()=>navigate(route));nav.append(normal);view.insertBefore(nav,view.firstElementChild?.nextSibling||null);}
      const button=node('button','study-wrong-tab','오답 다시 풀기');button.type='button';button.setAttribute('aria-controls','mistakesView');button.addEventListener('click',()=>open([...studyStore.definitions.values()].filter(d=>routeOf(d)===route).map(d=>d.id)));nav.append(button);routeButtons.set(route,button);
      const statsId={cyp:'cypStats',immune:'immStats',anticancer:'antiStats'}[route]||route+'Stats',stats=$(statsId);
      if(stats){stats.hidden=true;const summary=node('p','study-live-summary');stats.parentNode.append(summary);summaries.set(route,summary);}
    }
    if(!summaries.has('ddi')&&$('cypDdiStats')){const stats=$('cypDdiStats');stats.hidden=true;const summary=node('p','study-live-summary');stats.parentNode.append(summary);summaries.set('ddi',summary);}
    // CYP matching is a separate screen linked from the same lecture.
    const drag=$('dragView');if(drag&&!routeButtons.has('drag')){const b=node('button','study-wrong-tab back-button','오답 다시 풀기');b.type='button';b.addEventListener('click',()=>open(['cyp-match']));drag.insertBefore(b,drag.firstElementChild?.nextSibling||null);routeButtons.set('drag',b);}
  }
  function scopeOptions(){
    const select=$('studyReviewScope');select.replaceChildren();
    const option=(value,text)=>{const o=node('option','',text);o.value=value;select.append(o);};
    if(group)option('group','선택한 퀴즈의 오답');option('all','모든 퀴즈의 오답');
    for(const d of studyStore.definitions.values())option(d.id,d.title);
    select.value=group?'group':'all';
  }
  function renderVisual(q){
    const host=$('studyWrongVisual');host.replaceChildren();host.hidden=!q.plot&&!q.table&&!q.figure;
    if(q.figure){const a=node('a');a.href=q.figure;a.target='_blank';a.rel='noopener';const img=node('img');img.src=q.figure;img.alt='문항 원본 그림';a.append(img);host.append(a);}
    if(q.plot)host.append(createPkPlot(document,q.plot));
    if(q.table){const table=node('table','pk-data-table'),head=node('thead'),tr=node('tr');for(const text of q.table.headers){const th=node('th','',text);th.setAttribute('scope','col');tr.append(th);}head.append(tr);table.append(head);const body=node('tbody');for(const row of q.table.rows){const tr=node('tr');for(const text of row)tr.append(node('td','',String(text)));body.append(tr);}table.append(body);host.append(table);}
  }
  function next(){
    const pool=studyStore.wrong(typed('quiz')).filter(x=>x.question),eligible=pool.filter(x=>x.scope+':'+x.id!==previous),available=eligible.length?eligible:pool;
    const score=x=>reviewSeen[x.scope+':'+x.id]||0,min=Math.min(...available.map(score));current=available.find(x=>score(x)===min)||null;answered=false;selected=new Set();$('studyWrongFeedback').hidden=true;$('studyWrongNext').hidden=true;$('studyWrongCheck').disabled=true;
    $('studyWrongCard').hidden=!current;$('studyWrongEmpty').hidden=Boolean(current);
    if(!current){$('studyWrongEmpty').textContent='이 범위에 남은 객관식 오답이 없습니다. 전체 문제에서 계속 연습할 수 있습니다.';paint();return;}
    previous=current.scope+':'+current.id;reviewSeen[previous]=(reviewSeen[previous]||0)+1;shown=shuffleStudyQuestion(cleanStudyDrugLabels(current.definition.reviewQuestion?.(current.question)||current.question));
    $('studyWrongMeta').textContent=current.definition.title+' · '+(shown.source||'오답 재풀이');$('studyWrongStem').textContent=shown.stem;renderVisual(shown);
    const host=$('studyWrongChoices');host.replaceChildren();shown.choices.forEach((text,i)=>{const b=node('button');b.type='button';b.append(node('span','option-no',symbols[i]||String(i+1)),node('span','',text));b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>choose(i));host.append(b);});
    $('studyWrongCheck').textContent=shown.answers.length>1?'선택한 답 확인 (복수 정답)':'정답 확인';paint();
  }
  function choose(i){
    if(answered||!shown||i>=shown.choices.length)return;
    if(shown.answers.length===1)selected=new Set([i]);else if(selected.has(i))selected.delete(i);else selected.add(i);
    [...$('studyWrongChoices').children].forEach((b,j)=>{b.classList.toggle('selected',selected.has(j));b.setAttribute('aria-pressed',String(selected.has(j)));});$('studyWrongCheck').disabled=!selected.size;
  }
  function grade(){
    if(!current||answered||!selected.size)return;answered=true;const good=gradeStudyAnswer(shown,[...selected]);
    studyStore.record(current.scope,shown,good);paint();
    [...$('studyWrongChoices').children].forEach((b,i)=>{b.disabled=true;if(shown.answers.includes(i))b.classList.add('correct');else if(selected.has(i))b.classList.add('wrong');});
    const fb=$('studyWrongFeedback');fb.className=`feedback ${good?'ok':'bad'}`;fb.replaceChildren(node('strong','',good?'정답입니다. 오답 목록에서 빠졌습니다.':'다시 복습할 문항으로 남겼습니다.'),node('p','',`정답: ${shown.answers.map(i=>(symbols[i]||i+1)+' '+shown.choices[i]).join(' / ')}`));
    if(shown.note)fb.append(node('p','',shown.note));if(shown.steps?.length){const list=node('ol','pk-solution');for(const text of shown.steps)list.append(node('li','',text));fb.append(list);}
    if(shown.details?.length){const details=node('details','cns-choice-notes');details.append(node('summary','','선지별 설명'));const list=node('ul');for(const text of shown.details)list.append(node('li','',text.replace(/^\d+\.\s*/,'')));details.append(list);fb.append(details);}
    if(shown.answerNote)fb.append(node('p','',shown.answerNote));if(shown.source)fb.append(node('p','cns-source',shown.source));fb.hidden=false;$('studyWrongCheck').disabled=true;$('studyWrongNext').hidden=false;
  }
  function matchOptions(){
    const select=$('studyMatchScope'),old=select.value;select.replaceChildren();
    for(const id of typed('match')){const n=studyStore.wrong(id).length;if(!n)continue;const o=node('option','',studyStore.definitions.get(id).title+' · '+n+'개');o.value=id;select.append(o);}
    select.value=[...select.children].some(o=>o.value===old)?old:(select.children[0]?.value||'');
  }
  function renderMatch(){
    const host=$('studyWrongBoard');host.replaceChildren();const scope=$('studyMatchScope').value,def=studyStore.definitions.get(scope),wrong=def?studyStore.wrong(scope):[];
    if(!wrong.length){host.append(node('div','empty','이 범위에 남은 드래그 오답이 없습니다.'));return;}
    const wrap=node('div','match-board'),pool=node('div','match-column match-pool');pool.id='studyPool';const heading=node('h3','','오답 카드 ');heading.append(node('span','pool-count'));pool.append(heading);const cards=node('div','drag-cards');cards.id='studyCards';pool.append(cards);
    const targets=node('div','match-column match-targets'),zones=node('div','drop-zones');zones.id='studyZones';targets.append(node('h3','','분류·표적 칸'),zones);wrap.append(pool,targets);
    const actions=node('div','match-actions'),status=node('div','match-status');status.id='studyDragStatus';status.setAttribute('role','status');const check=node('button','primary','지금 채점하기');check.id='studyCheck';check.type='button';const resume=node('button','primary','이 배치에서 계속하기');resume.id='studyReset';resume.type='button';resume.hidden=true;actions.append(status,check,resume);host.append(wrap,actions);
    const board=createMatchBoard({studyId:scope,poolId:pool.id,cardsId:cards.id,zonesId:zones.id,statusId:status.id,checkId:check.id,resetId:resume.id,items:wrong.map(x=>x.item),categoryOptions:[...new Set([...def.items.values()].flatMap(x=>x.categories))],categoryOf:x=>x.categories[0],categoriesOf:x=>x.categories,keyOf:x=>x.id,labelOf:x=>x.name,onGrade:paint});board.open();
  }
  function type(value){
    activeType=value;for(const [id,yes]of [['studyWrongQuizTab',value==='quiz'],['studyWrongMatchTab',value==='match']]){$(id).classList.toggle('active',yes);$(id).setAttribute('aria-selected',String(yes));}
    $('studyWrongQuizPanel').hidden=value!=='quiz';$('studyWrongMatchPanel').hidden=value!=='match';if(value==='quiz')next();else{matchOptions();renderMatch();}paint();
  }
  function open(scopes=null){
    group=scopes&&scopes.length?scopes:null;previous=null;reviewSeen={};scopeOptions();$('studyReviewTitle').textContent=group?'선택한 퀴즈 · 오답 다시 풀기':'전체 퀴즈 · 오답 다시 풀기';navigate('mistakes');const hasQuiz=studyStore.wrong(typed('quiz')).length,hasMatch=studyStore.wrong(typed('match')).length;type(typed('quiz').length&&(hasQuiz||!hasMatch)?'quiz':'match');
  }
  $('studyReviewScope').addEventListener('change',()=>{previous=null;reviewSeen={};type(activeType);});$('studyWrongQuizTab').addEventListener('click',()=>type('quiz'));$('studyWrongMatchTab').addEventListener('click',()=>type('match'));
  $('studyWrongCheck').addEventListener('click',grade);$('studyWrongNext').addEventListener('click',next);$('studyMatchScope').addEventListener('change',renderMatch);$('studyMatchRefresh').addEventListener('click',()=>{matchOptions();renderMatch();paint();});
  $('studyReviewBack').addEventListener('click',()=>{const def=group&&studyStore.definitions.get(group[0]);navigate(def?.route||'home');});
  document.addEventListener('keydown',e=>{
    if($('mistakesView').hidden||activeType!=='quiz'||e.altKey||e.ctrlKey||e.metaKey||/^(INPUT|TEXTAREA|SELECT|SUMMARY)$/.test(e.target.tagName))return;
    if(/^[1-5]$/.test(e.key)){e.preventDefault();choose(Number(e.key)-1);}if(e.key==='Enter'&&!/^(BUTTON|A)$/.test(e.target.tagName)){e.preventDefault();answered?next():grade();}
  });
  const refresh=()=>{mountRoutes();paint();};studyStore.subscribe(refresh);refresh();return {open,refresh};
}
