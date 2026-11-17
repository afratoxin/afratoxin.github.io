import {originalPrompt,originalFeedback,originalEmpty,originalLabel,originalChoiceImage} from './cbl-original.mjs?v=20261118a';
import {startContinuousSession,advanceContinuousSession,resumeContinuousSession,continuousProgress} from './continuous-queue.mjs?v=20261118a';
import {COURSE_GROUPS} from './course-catalog.mjs?v=20261118a';
import {practiceLayout} from './practice-layout.mjs?v=20261118a';
import {emphasizeFeedback,emphasizePrompt} from './emphasis.mjs?v=20261118a';
import {grade,stats,readProgress,readBookmarks,toggleBookmark as toggleSavedBookmark,isCorrectChoice} from './logic.mjs?v=20261118a';
import {sourceText,topicProgress} from './study-core.mjs?v=20261118a';
import {DOCUMENTS,LECTURES} from './study-bank.mjs?v=20261118a';
const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const externalLinks=q=>(q.externalRefs||[]).filter(r=>/^https:\/\//.test(r.url||'')).map(r=>`<a href="${e(r.url)}" target="_blank" rel="noopener noreferrer">${e(r.title||'보충 근거')} ↗</a>`).join(' · ');

export function studyFeedback(q,correct,order=q.choices){
 if(q.original)return `<div class="feedback${correct===false?' missed':''}" tabindex="-1">${originalFeedback(q,correct)}<p class="source-line">강의 근거: ${e(sourceText(q,DOCUMENTS))}<br>원문 출처: ${e((q.examRefs||[]).join(' · '))}</p>${externalLinks(q)}</div>`;
 return `<div class="feedback${correct?'':' missed'}" tabindex="-1"><h3>${correct?'정답입니다.':'감별 단서를 확인하세요.'}</h3><p class="answer-line">정답 · ${e(q.choices[q.answer])}</p>${q.keyClue?`<p class="study-clue"><b>결정적 단서</b> ${emphasizeFeedback(q.keyClue,{clue:true})}</p>`:''}${q.explanation!==q.keyClue?`<p>${emphasizeFeedback(q.explanation)}</p>`:''}${q.choiceNotes?.length===5?`<details class="choice-explanations" open><summary>비슷한 보기 구분하기</summary><ol>${order.map(c=>`<li><b>${e(c)}</b><p>${emphasizeFeedback(q.choiceNotes[q.choices.indexOf(c)])}</p></li>`).join('')}</ol></details>`:''}<p class="source-line">근거: ${e(sourceText(q,DOCUMENTS))}${q.examRefs?.length?`<br>족보 유형 참고: ${e(q.examRefs.join(' · '))}`:''}</p>${externalLinks(q)}${q.note?`<p class="supplement">${emphasizeFeedback(q.note)}</p>`:''}</div>`;
}
export function createStudyUI({id,tab,title,subtitle,bank,topics,read,save,openTab,onChange,announce,isActive,drill=false,scopes=null,contentId=id+'Content',onExit=null,courseGroups=COURSE_GROUPS,libraryIntro='',originals=false}){
 const root=document.getElementById(contentId),$=name=>document.getElementById(id+'-'+name);
 const keys={progress:`infection-immunity.${id}.progress.v1`,session:`infection-immunity.${id}.session.v1`,bookmarks:`infection-immunity.${id}.bookmarks.v1`,auto:`infection-immunity.${id}.auto.v1`};
 let revealedId=null;
 let learningView=drill?'practice':'units',unitGroup=Object.keys(courseGroups)[0]||'general';
 let progress=readProgress(read(keys.progress),bank),bookmarks=readBookmarks(read(keys.bookmarks),bank),timer=null,scopeIds=null;
 let session=resumeContinuousSession(read(keys.session),bank,progress,Math.random,bookmarks);
 const ordered=Object.entries(topics).sort((a,b)=>(a[1].order||0)-(b[1].order||0));
 const selectionTopics=scopes||topics;
 const selectedOptions=Object.entries(selectionTopics).sort((a,b)=>(a[1].order||0)-(b[1].order||0));
 const unitCard=([code,t])=>`<button type="button" data-study-topic="${e(code)}" data-lecture-group-card="${e(t.group)}" ${t.group!==unitGroup?'hidden':''}><span>${String(t.order).padStart(2,'0')}</span><b>${e(t.title)}</b><small>${bank.filter(q=>q.topic===code).length}문항${t.teacher?' · '+e(t.teacher):''}</small>${t.emptyEvidence?'<span class="original-library-note">출제 없음 기록 보기 →</span>':`<span class="unit-progress" data-unit-progress="${e(code)}"></span>`}</button>`;
 root.innerHTML=`${onExit?'<button type="button" class="text-button recall-back" data-study-exit>← 암기 범위 고르기</button>':''}<div class="section-heading page-heading"><div><p class="eyebrow green">${drill?'TABLE RECALL · REPEAT':'LECTURE PRACTICE · DIFFERENTIAL'}</p><h1 id="${id}-title">${e(title)}</h1><p id="${id}-subtitle" class="muted">${e(subtitle)}</p></div><span id="${id}-stats" class="tiny-chip"></span></div>
  <div class="study-intro">${originals?'족보의 <b>원문 캡처·OCR·선지 번호</b>를 보존했습니다. 답을 고르면 상세 해설과 강의 근거가 열립니다.':drill?'선택한 범위의 <b>미풀이 전체 → 오답 복습</b> 순서로 이어갑니다.':'증례의 <b>결정적 감별 단서</b>를 찾고, 비슷한 균명·독소명·검사명 중 하나를 고르세요. 족보 유형을 참고한 예상문제입니다.'}</div>
  ${drill?`<details class="study-scope"><summary>${drill?'표 주제 골라 풀기':'강의 순서대로 골라 풀기'}</summary><div class="lecture-grid">${ordered.map(([code,t])=>`<button type="button" data-study-topic="${e(code)}"><span>${t.order?String(t.order).padStart(2,'0'):'표'}</span><b>${e(t.title)}</b><small>${bank.filter(q=>q.topic===code).length}문항${t.teacher?' · '+e(t.teacher):''}</small></button>`).join('')}</div></details>`:`<section id="${id}-units" class="study-unit-menu" hidden><div class="study-view-bar"><button type="button" class="text-button" data-tab="home">← 학습 허브</button><h2>단원별 학습 · 강의 선택</h2></div>${libraryIntro}<div class="lecture-group-controls">${Object.entries(courseGroups).map(([group,g])=>`<button type="button" data-lecture-group="${group}" aria-pressed="${group===unitGroup}">${e(g.title)} <small>${ordered.filter(([,t])=>t.group===group).length}강</small></button>`).join('')}</div><div class="lecture-grid">${ordered.filter(([,t])=>t.order>0).map(unitCard).join('')}</div></section><div id="${id}-viewbar" class="study-practice-menu" hidden><button type="button" class="text-button" data-tab="home">← 학습 허브</button><p id="${id}-mixed-intro" class="study-mixed-intro" hidden>${originals?'CBL 1~6 기출 원문 전체를 섞어서 풉니다.':Object.keys(LECTURES).length+'개 강의와 단원 통합 문제를 섞어서 풉니다.'} 미풀이 전체를 먼저 풀고 오답으로 이어집니다.</p></div>`}
  <details id="${id}-settings" class="study-settings" ${session?'':'open'}><summary>학습 범위</summary><form id="${id}-setup" class="setup-card"><div class="filter-grid study-filter-grid"><label for="${id}-topic">${drill?'암기표':'강의'}<select id="${id}-topic"><option value="all">전체 종합</option>${selectedOptions.map(([code,t])=>`<option value="${e(code)}">${t.order?String(t.order).padStart(2,'0')+' ':''}${e(t.title)}</option>`).join('')}</select></label><label for="${id}-mode">풀 문제<select id="${id}-mode"><option value="all">미풀이 → 오답</option><option value="wrong">오답 복습</option><option value="bookmarks">별표 문항</option></select></label></div><div class="setup-bottom"><p id="${id}-eligible" class="muted" aria-live="polite"></p><button type="submit" class="button primary">이 범위 이어 풀기 →</button></div>${drill?`<label class="study-auto"><input type="checkbox" id="${id}-auto"> 정답이면 자동으로 다음 문제</label>`:''}</form></details>
  <div id="${id}-stage"></div>${drill?`<details class="study-scope study-table-details"><summary>선택한 암기표 펼쳐 보기</summary><div id="${id}-table"></div></details>`:''}`;
 function applyView(){
  if(drill)return;
  for(const view of ['units','mixed','practice'])root.classList.toggle('study-view-'+view,learningView===view);
  $('units').hidden=learningView!=='units';$('viewbar').hidden=!['mixed','practice'].includes(learningView);$('mixed-intro').hidden=learningView!=='mixed';
  if(learningView==='mixed')$('settings').open=true;
 }
 const filters=()=>({topic:scopes?'all':$('topic').value,...(scopes&&scopes[$('topic').value]?{scope:$('topic').value,questionIds:scopes[$('topic').value].questionIds}:scopeIds?{questionIds:[...scopeIds]}:{}),mode:$('mode').value,count:0,format:drill?'all':'mcq'});
 function setFilters(f){scopeIds=Array.isArray(f.questionIds)?[...f.questionIds]:null;$('topic').value=scopes?(scopes[f.scope]?f.scope:'all'):(topics[f.topic]?f.topic:'all');$('mode').value=['wrong','bookmarks'].includes(f.mode)?f.mode:'all';}
 function scopeBank(f=filters()){return bank.filter(q=>(!Array.isArray(f.questionIds)||f.questionIds.includes(q.id))&&(!f.topic||f.topic==='all'||q.topic===f.topic)&&(!f.format||f.format==='all'||q.format===f.format)&&(f.mode!=='bookmarks'||bookmarks.includes(q.id)));}
 const phaseLabel=()=>session?.phase==='wrong'?'오답 복습':session?.phase==='review'?'직접 복습':'미풀이 학습';
 function update(){const meta=learningView==='practice'?topics[filters().topic]:null;$('title').textContent=meta?.practiceTitle||title;$('subtitle').textContent=meta?.practiceSubtitle||subtitle;const s=stats(meta?.practiceTitle?scopeBank():bank,progress),selected=stats(scopeBank(),progress);$('stats').textContent=`정답 ${s.correct} · 오답 ${s.wrong} · 미풀이 ${s.unanswered}`;$('eligible').textContent=selected.total?`선택 범위 ${selected.total}문항 · 미풀이 ${selected.unanswered} → 오답 ${selected.wrong}`:'선택 조건에 해당하는 문제가 없습니다.';if(drill)renderTable();
  for(const card of root.querySelectorAll('[data-unit-progress]')){
   const value=topicProgress(bank,progress,card.dataset.unitProgress);
   card.innerHTML=`<span class="unit-progress-label"><b>${value.attempted}<small> / ${value.total} 풀이</small></b><span>${value.percent}%</span></span><span class="unit-progress-track" role="progressbar" aria-label="${e(topics[card.dataset.unitProgress]?.title)} 풀이 진행도" aria-valuemin="0" aria-valuemax="${value.total}" aria-valuenow="${value.attempted}"><span class="unit-correct" style="width:${value.total?value.correct/value.total*100:0}%"></span><span class="unit-wrong" style="width:${value.total?value.wrong/value.total*100:0}%"></span></span><span class="unit-progress-results"><span>정답 <b>${value.correct}</b></span><span>오답 <b>${value.wrong}</b></span><span>미풀이 ${value.unanswered}</span></span>`;
  }
 }
 function sync(){if(session)session.queueCounts=continuousProgress(bank,session.filters,progress,bookmarks);save(keys.progress,progress);save(keys.session,session);update();onChange();}
 function focus(){requestAnimationFrame(()=>{const target=$('question')||$('summary');target?.focus({preventScroll:true});target?.scrollIntoView({block:'nearest',behavior:'auto'});});}
 function start(f=filters(),force=false,single=null){
  clearTimeout(timer);openTab(tab);if(!drill){learningView='practice';applyView();}
  f={...f,count:0,...(topics[f.topic]?.shuffle?{shuffle:true}:{}),...(single?{questionIds:[single],mode:'review'}:{})};setFilters(f);
  session=startContinuousSession(bank,f,progress,Math.random,bookmarks,f.mode==='review'?null:session);
  session.tally={total:0,correct:0};sync();render();focus();
 }
 function resumeCurrent(){
  clearTimeout(timer);session=resumeContinuousSession(read(keys.session)||JSON.stringify(session),bank,progress,Math.random,bookmarks);
  if(session){setFilters(session.filters);save(keys.session,session);}
 }
 function render(){
  const active=Boolean(session&&session.position<session.items.length)&&(drill||learningView==='practice');root.classList.toggle('practice-active',active);if(active)$('settings').open=false;applyView();
  if(!session){$('stage').innerHTML=`<div class="empty-state"><h2>${drill?'한 번 보고, 여러 번 떠올리기.':'비슷한 보기에서 감별점을 찾아보세요.'}</h2><p>${drill?'항생제 분류·균 동정·독소·조직 소견·매개체를 원하는 범위로 반복하세요.':'강의별로 풀거나 단원 통합 문제까지 섞어서 풀 수 있습니다.'}</p><button type="button" class="button primary" data-study-start>시작하기 →</button></div>`;return;}
  if(session.phase==='complete'||!session.items.length){summary();return;}
  if(session.position>=session.items.length){summary();return;}
  const item=session.items[session.position],q=bank.find(q=>q.id===item.id),graded=item.selected!==null,revealed=Boolean(q.original&&revealedId===q.id);
  const question=`<article class="question-card study-question" id="${id}-question" tabindex="-1" aria-labelledby="${id}-stem"><div class="q-top"><div class="q-tags"><span class="pill">${e(q.original?(!graded&&session.filters.topic==='all'?'CBL 종합 기출':topics[q.topic]?.title||'CBL 기출'):drill?(scopes?.[session.filters.scope]?.title||'표 암기'):!graded&&(session.filters.topic==='all'||q.topic==='integrated')?'종합·통합 감별':topics[q.topic]?.title||q.topic)}</span><span class="format-tag">${q.original?'기출 원문':drill?'표 암기':q.kind==='case'?'증례 감별':'키워드 감별'} · ${q.format==='ox'?'O/X':'5지선다'}</span></div><button type="button" class="bookmark" data-study-bookmark="${e(q.id)}" aria-label="${bookmarks.includes(q.id)?'북마크 해제':'이 문제 북마크'}" aria-pressed="${bookmarks.includes(q.id)}">${bookmarks.includes(q.id)?'★':'☆'}</button></div><div class="session-line"><span>${phaseLabel()} · 문제 <b>${session.position+1}</b> / ${session.items.length}</span><span>미풀이 ${stats(scopeBank(session.filters),progress).unanswered} · 오답 ${stats(scopeBank(session.filters),progress).wrong}</span></div><div class="session-track"><span style="width:${session.position/session.items.length*100}%"></span></div><h2 class="question-stem" id="${id}-stem">${q.original?e(originalLabel(q)):emphasizePrompt(q.stem)}</h2>${q.original?`<div class="original-tools"><button type="button" class="button outline small" data-study-solution>${revealed?'해설 가리기':'정답·해설 보기'}</button><span>보기만 하면 풀이 기록은 바뀌지 않습니다.</span></div>${originalPrompt(q)}`:''}<p class="question-instruction">${graded?'채점 완료 · Enter로 다음 문제':q.format==='ox'?'1 = O · 2 = X · 채점 후 Enter로 다음 문제':'숫자 1–5로 답 선택 · 채점 후 Enter로 다음 문제'}</p><div class="choices study-keywords${q.format==='ox'?' ox':''}" role="group" aria-labelledby="${id}-stem">${item.choices.map((c,i)=>`<button type="button" class="choice${graded?(isCorrectChoice(q,c)?' right':i===item.selected?' wrong':' dim'):''}" data-study-answer="${i}" ${graded?'disabled':''}><span class="choice-num" aria-hidden="true">${i+1}</span><span class="choice-copy">${originalChoiceImage(q,q.choices.indexOf(c))}${e(c)}</span>${graded&&isCorrectChoice(q,c)?'<span class="choice-label">정답</span>':graded&&i===item.selected?'<span class="choice-label">내 선택</span>':''}</button>`).join('')}</div><div class="question-actions"><button type="button" class="text-button" data-study-previous ${session.position===0?'disabled':''}>← 이전</button><button type="button" class="${graded?'button primary':'text-button'}" data-study-next>${graded?'다음 문제 →':'건너뛰기 →'}</button></div></article>`;
  $('stage').innerHTML=practiceLayout({question,feedback:graded||revealed?studyFeedback(q,graded?isCorrectChoice(q,item.choices[item.selected]):null,item.choices):'',q,session,sourceLabel:sourceText(q,DOCUMENTS)});
 }
 function summary(){
  const selected=scopeBank(session?.filters||filters()),s=stats(selected,progress);
  const empty=topics[session?.filters?.topic]?.emptyEvidence;
  if(!s.total&&empty){$('settings').open=false;$('stage').innerHTML=`<article class="summary-card" id="${id}-summary" tabindex="-1"><h2>${e(topics[session.filters.topic].title)}</h2>${originalEmpty(empty)}<button type="button" class="button primary" data-study-select>기출 목록으로 →</button></article>`;return;}
  $('stage').innerHTML=`<article class="summary-card" id="${id}-summary" tabindex="-1"><p class="eyebrow green">LEARNING COMPLETE</p><h2>${!s.total?'선택한 조건의 문항이 없습니다.':s.unanswered||s.wrong?'직접 복습을 마쳤습니다.':'선택한 범위를 모두 맞혔습니다.'}</h2><div class="summary-score">${s.correct}<small> / ${s.total} 정답</small></div><p class="muted">미풀이 ${s.unanswered}문항 · 오답 ${s.wrong}문항 · 학습 기록은 그대로 저장됩니다.</p><div class="summary-actions">${s.wrong?'<button type="button" class="button primary" data-study-wrong>남은 오답 복습 →</button>':''}<button type="button" class="button primary" data-study-select>학습 범위 고르기 →</button><button type="button" class="button outline" data-study-all>전체 범위 이어 풀기 →</button></div>${!s.total?originalEmpty(topics[session?.filters?.topic]?.emptyEvidence):''}</article>`;
 }
 function answer(n){
  if(!session||session.position>=session.items.length)return;
  const r=grade(session,progress,session.position,n,bank);if(r.duplicate)return;
  progress=r.progress;session.tally||={total:0,correct:0};session.tally.total++;if(r.correct)session.tally.correct++;
  sync();render();announce(r.correct?'정답입니다.':'오답입니다. 감별 단서를 확인하세요.');
  requestAnimationFrame(()=>$('stage').querySelector('.feedback')?.focus({preventScroll:true}));
  if(drill&&r.correct&&$('auto').checked)timer=setTimeout(()=>{if(isActive()&&!document.querySelector('dialog[open]'))next();},900);
 }
 function next(){
  clearTimeout(timer);if(!session)return;
  const tally=session.tally;session=advanceContinuousSession(session,progress,bank,Math.random,bookmarks);session.tally=tally;
  save(keys.session,session);update();render();onChange();focus();
 }
 function renderTable(){
  if(scopes){
   const selected=scopes[$('topic').value];
   $('table').innerHTML=selected?`<h3>${e(selected.title)}</h3><div class="reference-table-wrap"><table class="reference-table"><thead><tr><th>단서·질문</th><th>대응 키워드</th><th>근거</th></tr></thead><tbody>${bank.filter(q=>selected.questionIds.includes(q.id)).map(q=>`<tr><td>${e(q.stem)}</td><td><b class="mark-blue">${e(q.choices[q.answer])}</b></td><td>${e(sourceText(q,DOCUMENTS))}</td></tr>`).join('')}</tbody></table></div>`:'<p class="muted">강의별 작은 묶음을 고르면 그 부분의 대응표를 펼칠 수 있습니다.</p>';
   return;
  }
  const groups=Object.entries(topics).filter(([topic])=>filters().topic==='all'||topic===filters().topic);
  $('table').innerHTML=groups.map(([topic,t])=>`<h3>${e(t.title)}</h3><div class="reference-table-wrap"><table class="reference-table"><thead><tr><th>단서·질문</th><th>대응 키워드</th><th>근거</th></tr></thead><tbody>${bank.filter(q=>q.topic===topic).map(q=>`<tr><td>${emphasizePrompt(q.stem)}</td><td><b class="mark-blue">${e(q.choices[q.answer])}</b></td><td>${e(sourceText(q,DOCUMENTS))}</td></tr>`).join('')}</tbody></table></div>`).join('');
 }
 $('setup').addEventListener('submit',event=>{event.preventDefault();start();});
 $('topic').addEventListener('change',()=>{scopeIds=null;update();});$('mode').addEventListener('change',update);
 if(drill){$('auto').checked=read(keys.auto)==='true';$('auto').addEventListener('change',()=>{clearTimeout(timer);save(keys.auto,$('auto').checked);});}
 root.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b||b.disabled)return;
  if(b.hasAttribute('data-study-exit')){clearTimeout(timer);onExit?.();return;}
  if(b.dataset.lectureGroup){unitGroup=b.dataset.lectureGroup;for(const card of root.querySelectorAll('[data-lecture-group-card]'))card.hidden=card.dataset.lectureGroupCard!==unitGroup;for(const button of root.querySelectorAll('[data-lecture-group]'))button.setAttribute('aria-pressed',String(button.dataset.lectureGroup===unitGroup));return;}

  if(b.dataset.studyView){if(b.dataset.studyView==='mixed'){start({topic:'all',mode:'all',count:0});return;}learningView='units';render();root.scrollIntoView({block:'start',behavior:'auto'});return;}
  if(b.hasAttribute('data-study-resume')){resumeCurrent();learningView='practice';update();render();focus();return;}
  if(b.dataset.studyOriginal){const q=bank.find(q=>q.id===b.dataset.studyOriginal);if(q)start({topic:q.topic,mode:'review',count:0,questionIds:[q.id]},true,q.id);return;}
  if(b.hasAttribute('data-study-topic')){start({...filters(),topic:b.dataset.studyTopic,count:0,mode:'all',questionIds:undefined});return;}
  if(b.hasAttribute('data-study-start')){start();return;}
  if(b.hasAttribute('data-study-all')){start({topic:'all',mode:'all',count:0},true);return;}
  if(b.hasAttribute('data-study-wrong')){start({...filters(),mode:'wrong'},true);return;}
  if(b.hasAttribute('data-study-select')){clearTimeout(timer);if(onExit){onExit();return;}learningView='units';render();root.scrollIntoView({block:'start',behavior:'auto'});return;}
  if(b.hasAttribute('data-study-solution')){const q=session&&bank.find(q=>q.id===session.items[session.position]?.id);if(q?.original){revealedId=revealedId===q.id?null:q.id;render();}return;}
  if(b.dataset.studyAnswer!==undefined){answer(Number(b.dataset.studyAnswer));return;}
  if(b.hasAttribute('data-study-next')){next();return;}
  if(b.hasAttribute('data-study-previous')){clearTimeout(timer);session.position=Math.max(0,session.position-1);save(keys.session,session);render();focus();return;}
  if(b.dataset.studyJump!==undefined){session.position=Number(b.dataset.studyJump);save(keys.session,session);render();focus();return;}
  if(b.dataset.studyBookmark){
   const qid=b.dataset.studyBookmark,saved=toggleSavedBookmark(read(keys.bookmarks),qid);bookmarks=readBookmarks(JSON.stringify(saved),bank);save(keys.bookmarks,saved);update();render();announce(bookmarks.includes(qid)?'북마크에 저장했습니다.':'북마크를 해제했습니다.');
  }
 });
 window.addEventListener('storage',event=>{
  if(event.key===keys.progress||event.key===null){progress=readProgress(event.newValue,bank);if(session)resumeCurrent();update();if(isActive())render();onChange();}
  if(event.key===keys.bookmarks||event.key===null){bookmarks=readBookmarks(event.newValue,bank);update();if(isActive())render();}
 });
 if(session){setFilters(session.filters||{});save(keys.session,session);}update();render();
 return {suspend(){clearTimeout(timer);},open(){resumeCurrent();if(!drill)learningView=session&&session.phase!=='complete'?'practice':'units';update();render();},choose(view){clearTimeout(timer);if(view==='mixed'){start({topic:'all',mode:'all',count:0});return;}openTab(tab);learningView='units';update();render();},start,resume(){openTab(tab);resumeCurrent();if(!session){start({topic:'all',mode:'all',count:0});return;}if(!drill)learningView='practice';update();render();focus();},retry(qid){const q=bank.find(q=>q.id===qid);if(q)start({topic:q.topic,mode:'review',count:0,questionIds:[qid]},true,qid);},getProgress:()=>progress,hasSession:()=>Boolean(session&&session.phase!=='complete'&&session.position<session.items.length)};
}
