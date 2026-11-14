import {grade,stats,readProgress,restoreSession,readBookmarks} from './logic.mjs?v=20261114a';
import {nextRound,sourceText} from './study-core.mjs?v=20261114a';
import {DOCUMENTS} from './study-bank.mjs?v=20261114a';
const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const externalLinks=q=>(q.externalRefs||[]).filter(r=>/^https:\/\//.test(r.url||'')).map(r=>`<a href="${e(r.url)}" target="_blank" rel="noopener noreferrer">${e(r.title||'보충 근거')} ↗</a>`).join(' · ');

export function studyFeedback(q,correct,order=q.choices){
 return `<div class="feedback${correct?'':' missed'}" tabindex="-1"><h3>${correct?'정답입니다.':'감별 단서를 확인하세요.'}</h3><p class="answer-line">정답 · ${e(q.choices[q.answer])}</p>${q.keyClue?`<p class="study-clue"><b>결정적 단서</b> ${e(q.keyClue)}</p>`:''}<p>${e(q.explanation)}</p>${q.choiceNotes?.length===5?`<details class="choice-explanations" open><summary>비슷한 보기 구분하기</summary><ol>${order.map(c=>`<li><b>${e(c)}</b><p>${e(q.choiceNotes[q.choices.indexOf(c)])}</p></li>`).join('')}</ol></details>`:''}<p class="source-line">근거: ${e(sourceText(q,DOCUMENTS))}${q.examRefs?.length?`<br>족보 유형 참고: ${e(q.examRefs.join(' · '))}`:''}</p>${externalLinks(q)}${q.note?`<p class="supplement">${e(q.note)}</p>`:''}</div>`;
}
export function createStudyUI({id,tab,title,subtitle,bank,topics,read,save,openTab,onChange,announce,isActive,drill=false}){
 const root=document.getElementById(id+'Content'),$=name=>document.getElementById(id+'-'+name);
 const keys={progress:`infection-immunity.${id}.progress.v1`,session:`infection-immunity.${id}.session.v1`,bookmarks:`infection-immunity.${id}.bookmarks.v1`,auto:`infection-immunity.${id}.auto.v1`};
 let progress=readProgress(read(keys.progress),bank),session=restoreSession(read(keys.session),bank),bookmarks=readBookmarks(read(keys.bookmarks),bank),timer=null,pending=null;
 const ordered=Object.entries(topics).sort((a,b)=>(a[1].order||0)-(b[1].order||0));
 root.innerHTML=`<div class="section-heading page-heading"><div><p class="eyebrow green">${drill?'TABLE RECALL · REPEAT':'LECTURE PRACTICE · DIFFERENTIAL'}</p><h1>${e(title)}</h1><p class="muted">${e(subtitle)}</p></div><span id="${id}-stats" class="tiny-chip"></span></div>
  <div class="study-intro">${drill?'외워야 할 대응 관계만 짧게 반복합니다. <b>계속 반복</b>은 한 바퀴 뒤 새 순서로 이어집니다.':'증례의 <b>결정적 감별 단서</b>를 찾고, 비슷한 균명·독소명·검사명 중 하나를 고르세요. 족보 유형을 참고한 예상문제입니다.'}</div>
  <details class="study-scope" ${drill?'':'open'}><summary>${drill?'표 주제 골라 풀기':'강의 순서대로 골라 풀기'}</summary><div class="lecture-grid">${ordered.map(([code,t])=>`<button type="button" data-study-topic="${e(code)}"><span>${t.order?String(t.order).padStart(2,'0'):'표'}</span><b>${e(t.title)}</b><small>${bank.filter(q=>q.topic===code).length}문항${t.teacher?' · '+e(t.teacher):''}</small></button>`).join('')}</div></details>
  <form id="${id}-setup" class="setup-card"><div class="filter-grid study-filter-grid"><label for="${id}-topic">${drill?'암기표':'강의'}<select id="${id}-topic"><option value="all">전체 종합</option>${ordered.map(([code,t])=>`<option value="${e(code)}">${t.order?String(t.order).padStart(2,'0')+' ':''}${e(t.title)}</option>`).join('')}</select></label><label for="${id}-mode">풀 문제<select id="${id}-mode"><option value="all">전체 문제</option><option value="unanswered">미풀이</option><option value="wrong">오답만</option><option value="bookmarks">북마크</option></select></label><label for="${id}-count">반복 길이<select id="${id}-count"><option value="1">1문항</option><option value="10" ${drill?'':'selected'}>10문항</option><option value="20">20문항</option><option value="0" ${drill?'selected':''}>${drill?'계속 반복':'선택 범위 전체'}</option></select></label></div><div class="setup-bottom"><p id="${id}-eligible" class="muted" aria-live="polite"></p><button type="submit" class="button primary">${drill?'암기 퀴즈 시작':'새 세트 시작'} →</button></div>${drill?`<label class="study-auto"><input type="checkbox" id="${id}-auto"> 정답이면 자동으로 다음 문제</label>`:''}<div id="${id}-replace" class="replace-prompt" hidden><p>진행 중인 세트를 바꿀까요? 채점 기록은 유지됩니다.</p><button type="button" data-study-confirm class="button primary small">새로 시작</button><button type="button" data-study-cancel class="button outline small">계속 풀기</button></div></form>
  <div id="${id}-stage"></div>${drill?`<details class="study-scope study-table-details"><summary>선택한 암기표 펼쳐 보기</summary><div id="${id}-table"></div></details>`:''}`;
 const filters=()=>({topic:$('topic').value,mode:$('mode').value,count:Number($('count').value),format:'mcq'});
 function setFilters(f){$('topic').value=topics[f.topic]?f.topic:'all';$('mode').value=f.mode||'all';$('count').value=String(f.count??(drill?0:10));}
 function eligible(){const f=filters();return bank.filter(q=>(f.topic==='all'||q.topic===f.topic)&&(f.mode!=='wrong'||progress[q.id]?.correct===false)&&(f.mode!=='unanswered'||!progress[q.id])&&(f.mode!=='bookmarks'||bookmarks.includes(q.id)));}
 function update(){const s=stats(bank,progress),n=eligible().length;$('stats').textContent=`정답 ${s.correct} · 오답 ${s.wrong} · 미풀이 ${s.unanswered}`;$('eligible').textContent=n?`${n}개 항목${drill&&filters().count===0?' · 순서를 바꾸며 계속 반복':''}`:'선택 조건에 해당하는 문제가 없습니다.';if(drill)renderTable();}
 function sync(){save(keys.progress,progress);save(keys.session,session);update();onChange();}
 function focus(){requestAnimationFrame(()=>{const target=$('question')||$('summary');target?.focus({preventScroll:true});target?.scrollIntoView({block:'nearest',behavior:'auto'});});}
 function start(f=filters(),force=false,single=null){
  clearTimeout(timer);openTab(tab);
  if(!force&&session&&session.position<session.items.length){pending={f,single};$('replace').hidden=false;$('replace').querySelector('[data-study-confirm]').focus();return;}
  $('replace').hidden=true;pending=null;setFilters(f);
  session=nextRound(single?bank.filter(q=>q.id===single):bank,f,progress,Math.random,bookmarks);session.round=1;session.tally={total:0,correct:0};
  sync();render();focus();
 }
 function render(){
  if(!session){$('stage').innerHTML=`<div class="empty-state"><h2>${drill?'한 번 보고, 여러 번 떠올리기.':'비슷한 보기에서 감별점을 찾아보세요.'}</h2><p>${drill?'항생제 분류·균 동정·독소·조직 소견·매개체를 원하는 범위로 반복하세요.':'강의별로 풀거나 16개 강의를 섞어서 풀 수 있습니다.'}</p><button type="button" class="button primary" data-study-start>시작하기 →</button></div>`;return;}
  if(!session.items.length){$('stage').innerHTML='<div class="empty-state"><h2>선택한 조건의 문제가 없습니다.</h2><p>오답을 모두 해결했거나 아직 해당 기록이 없을 수 있습니다. 범위를 바꾸어 시작하세요.</p><button type="button" class="button outline" data-study-all>전체 문제로 돌아가기 →</button></div>';return;}
  if(session.position>=session.items.length){summary();return;}
  const item=session.items[session.position],q=bank.find(q=>q.id===item.id),graded=item.selected!==null;
  $('stage').innerHTML=`<article class="question-card study-question" id="${id}-question" tabindex="-1" aria-labelledby="${id}-stem"><div class="q-top"><div class="q-tags"><span class="pill">${e(topics[q.topic]?.title||q.topic)}</span><span class="format-tag">${drill?'표 암기':q.kind==='case'?'증례 감별':'키워드 감별'} · 5지선다</span></div><button type="button" class="bookmark" data-study-bookmark="${e(q.id)}" aria-label="${bookmarks.includes(q.id)?'북마크 해제':'이 문제 북마크'}" aria-pressed="${bookmarks.includes(q.id)}">${bookmarks.includes(q.id)?'★':'☆'}</button></div><div class="session-line"><span>${drill&&session.filters.count===0?`라운드 ${session.round||1} · `:''}문제 <b>${session.position+1}</b> / ${session.items.length}</span><span>${session.tally?.correct||0} / ${session.tally?.total||0} 정답</span></div><div class="session-track"><span style="width:${session.position/session.items.length*100}%"></span></div><h2 class="question-stem" id="${id}-stem">${e(q.stem)}</h2><p class="question-instruction">가장 적절한 답 하나 · 키보드 1–5${graded?' · Enter로 다음 문제':''}</p><div class="choices study-keywords" role="group" aria-labelledby="${id}-stem">${item.choices.map((c,i)=>`<button type="button" class="choice${graded?(i===item.answer?' right':i===item.selected?' wrong':' dim'):''}" data-study-answer="${i}" ${graded?'disabled':''}><span class="choice-num" aria-hidden="true">${i+1}</span><span class="choice-copy">${e(c)}</span>${graded&&i===item.answer?'<span class="choice-label">정답</span>':''}</button>`).join('')}</div>${graded?studyFeedback(q,item.selected===item.answer,item.choices):''}<div class="question-actions"><button type="button" class="text-button" data-study-previous ${session.position===0?'disabled':''}>← 이전</button><button type="button" class="${graded?'button primary':'text-button'}" data-study-next>${graded?'다음 문제 →':'건너뛰기 →'}</button></div></article>`;
 }
 function summary(){
  const items=session.items,answered=items.filter(x=>x.selected!==null),correct=answered.filter(x=>x.selected===x.answer).length;
  $('stage').innerHTML=`<article class="summary-card" id="${id}-summary" tabindex="-1"><p class="eyebrow green">SESSION COMPLETE</p><h2>한 세트를 마쳤습니다.</h2><div class="summary-score">${correct}<small> / ${answered.length} 정답</small></div><p class="muted">${items.length-answered.length}문항 건너뜀 · 기록은 문항별 최신 결과로 저장됩니다.</p><div class="summary-results">${items.map((it,n)=>`<button type="button" class="result-number ${it.selected===null?'':it.selected===it.answer?'correct':'wrong'}" data-study-jump="${n}" aria-label="${n+1}번 문제 다시 보기">${n+1}</button>`).join('')}</div><div class="summary-actions"><button type="button" class="button primary" data-study-start>같은 범위 다시 풀기 →</button><button type="button" class="button outline" data-study-wrong>오답만 풀기 →</button></div></article>`;
 }
 function answer(n){
  if(!session||session.position>=session.items.length)return;
  const r=grade(session,progress,session.position,n,bank);if(r.duplicate)return;
  progress=r.progress;session.tally||={total:0,correct:0};session.tally.total++;if(r.correct)session.tally.correct++;
  sync();render();announce(r.correct?'정답입니다.':'오답입니다. 감별 단서를 확인하세요.');
  requestAnimationFrame(()=>$('stage').querySelector('.feedback')?.focus({preventScroll:true}));
  if(drill&&r.correct&&$('auto').checked)timer=setTimeout(()=>{if(isActive())next();},900);
 }
 function next(){
  clearTimeout(timer);if(!session)return;
  const previous=session.items[Math.min(session.position,session.items.length-1)]?.id;
  session.position=Math.min(session.position+1,session.items.length);
  if(drill&&session.filters.count===0&&session.position>=session.items.length){
   const old=session;session=nextRound(bank,old.filters,progress,Math.random,bookmarks,previous);session.round=(old.round||1)+1;session.tally=old.tally;
  }
  save(keys.session,session);render();onChange();focus();
 }
 function renderTable(){
  const groups=Object.entries(topics).filter(([topic])=>filters().topic==='all'||topic===filters().topic);
  $('table').innerHTML=groups.map(([topic,t])=>`<h3>${e(t.title)}</h3><div class="reference-table-wrap"><table class="reference-table"><thead><tr><th>단서·질문</th><th>대응 키워드</th><th>근거</th></tr></thead><tbody>${bank.filter(q=>q.topic===topic).map(q=>`<tr><td>${e(q.stem)}</td><td><b>${e(q.choices[q.answer])}</b></td><td>${e(sourceText(q,DOCUMENTS))}</td></tr>`).join('')}</tbody></table></div>`).join('');
 }
 $('setup').addEventListener('submit',event=>{event.preventDefault();start();});
 for(const name of ['topic','mode','count'])$(name).addEventListener('change',update);
 if(drill){$('auto').checked=read(keys.auto)==='true';$('auto').addEventListener('change',()=>{clearTimeout(timer);save(keys.auto,$('auto').checked);});}
 root.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b||b.disabled)return;
  if(b.hasAttribute('data-study-topic')){start({...filters(),topic:b.dataset.studyTopic,count:drill?0:10,mode:'all'});return;}
  if(b.hasAttribute('data-study-start')){start();return;}
  if(b.hasAttribute('data-study-all')){start({topic:'all',mode:'all',count:drill?0:10},true);return;}
  if(b.hasAttribute('data-study-wrong')){start({...filters(),mode:'wrong'},true);return;}
  if(b.hasAttribute('data-study-confirm')){const p=pending;if(p)start(p.f,true,p.single);return;}
  if(b.hasAttribute('data-study-cancel')){pending=null;$('replace').hidden=true;focus();return;}
  if(b.dataset.studyAnswer!==undefined){answer(Number(b.dataset.studyAnswer));return;}
  if(b.hasAttribute('data-study-next')){next();return;}
  if(b.hasAttribute('data-study-previous')){clearTimeout(timer);session.position=Math.max(0,session.position-1);save(keys.session,session);render();focus();return;}
  if(b.dataset.studyJump!==undefined){session.position=Number(b.dataset.studyJump);save(keys.session,session);render();focus();return;}
  if(b.dataset.studyBookmark){
   const qid=b.dataset.studyBookmark;bookmarks=bookmarks.includes(qid)?bookmarks.filter(x=>x!==qid):[...bookmarks,qid];save(keys.bookmarks,bookmarks);update();render();announce(bookmarks.includes(qid)?'북마크에 저장했습니다.':'북마크를 해제했습니다.');
  }
 });
 document.addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.ctrlKey||event.altKey||event.metaKey||event.repeat||!isActive()||!session||session.position>=session.items.length||!$('replace').hidden)return;
  if(event.target.closest('input,select,textarea,[role=tablist]'))return;
  const item=session.items[session.position];
  if(/^[1-5]$/.test(event.key)&&item.selected===null){event.preventDefault();answer(Number(event.key)-1);}
  else if(event.key==='Enter'&&item.selected!==null&&!event.target.closest('button,summary,a')){event.preventDefault();next();}
 });
 window.addEventListener('storage',event=>{
  if(event.key===keys.progress||event.key===null){progress=readProgress(event.newValue,bank);update();onChange();}
  if(event.key===keys.bookmarks||event.key===null){bookmarks=readBookmarks(event.newValue,bank);update();if(isActive())render();}
 });
 if(session)setFilters(session.filters||{});update();render();
 return {open(){update();render();},start,resume(){openTab(tab);render();focus();},retry(qid){const q=bank.find(q=>q.id===qid);if(q)start({topic:q.topic,mode:'all',count:1},false,qid);},getProgress:()=>progress,hasSession:()=>Boolean(session&&session.position<session.items.length)};
}
