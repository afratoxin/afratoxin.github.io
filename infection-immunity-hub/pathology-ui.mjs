import {startContinuousSession,advanceContinuousSession,resumeContinuousSession,continuousProgress} from './continuous-queue.mjs?v=20261116b';
import {emphasizeFeedback,emphasizePrompt} from './emphasis.mjs?v=20261116b';
import {PATH_QUESTIONS,PATH_TOPICS,PHOTOS,PATH_DOCUMENTS,EXAM_REVIEW,pathSource} from './pathology-bank.mjs?v=20261116b';
import {grade,stats,readProgress,readBookmarks,toggleBookmark as toggleSavedBookmark} from './logic.mjs?v=20261116b';
import {PATHOLOGY_TABLES,renderTables} from './reference-tables.mjs?v=20261116b';
import {practiceLayout} from './practice-layout.mjs?v=20261116b';

const e=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=id=>document.getElementById(id);
export function photoSourceLabel(photo){return photo.doc==='pathedu'?`PathEdu · 슬라이드 ${photo.slideNumber||photo.page}`:`${PATH_DOCUMENTS[photo.doc]||photo.doc} PDF ${photo.page}쪽`;}
export function pathologyFilters(type='all',mode='all',count=0){return {topic:type==='library'?'all':type,format:'all',mode,count:0,...(type==='library'?{sourceScope:'library',questionIds:PATH_QUESTIONS.filter(q=>q.sourceScope==='library').map(q=>q.id)}:{})};}
function publicPathLinks(question){
 return (question.externalRefs||[]).filter(ref=>{
  try{const url=new URL(ref.url);return url.protocol==='https:'&&((url.hostname==='pathedu.snu.ac.kr'&&url.pathname==='/library'&&!url.search)||(url.hostname==='cdc.gov'||url.hostname.endsWith('.cdc.gov'))&&!/classfilekey|token|secret|authorization/i.test(url.search));}catch{return false;}
 }).map(ref=>`<a href="${e(ref.url)}" target="_blank" rel="noopener noreferrer">${e(ref.title||'보충 근거')} ↗</a>`).join(' · ');
}
export function imageMarkup(q){
 if(!q.photos.length)return '';
 return `<div class="path-photos${q.photos.length===1?' single':''}">${q.photos.map((id,i)=>{const p=PHOTOS[id];return `<figure><button type="button" class="photo-zoom" data-photo-id="${id}" aria-label="표본 사진 ${i+1} 확대"><img src="${p.src}" alt="${e(p.alt)}" width="${p.width}" height="${p.height}" loading="lazy"><span>확대 보기 ⤢</span></button><figcaption>${e(p.caption)} · ${e(photoSourceLabel(p))}</figcaption></figure>`;}).join('')}</div>`;
}
export function pathFeedback(q,correct,order=q.choices){
 const visual=q.sourceScope==='library'&&['imageClue','coreFact','contrast'].every(key=>typeof q[key]==='string'&&q[key].trim());
 const explanation=visual?`<dl class="path-visual-feedback"><div><dt>사진 단서</dt><dd>${emphasizeFeedback(q.imageClue,{clue:true})}</dd></div><div><dt>핵심 연결</dt><dd>${emphasizeFeedback(q.coreFact)}</dd></div><div><dt>가장 헷갈리는 감별</dt><dd>${emphasizeFeedback(q.contrast)}</dd></div></dl>`:`<p>${emphasizeFeedback(q.explanation)}</p>`;
 return `<div class="feedback${correct?'':' missed'}" tabindex="-1"><h3>${correct?'정답입니다.':'감별점을 다시 확인하세요.'}</h3><p class="answer-line">정답 · ${e(q.choices[q.answer])}</p>${explanation}<details class="choice-explanations" open><summary>선지별 해설</summary><ol>${order.map(c=>`<li><b>${e(c)}</b><p>${emphasizeFeedback(q.choiceNotes[q.choices.indexOf(c)])}</p></li>`).join('')}</ol></details><p class="source-line">근거: ${e(pathSource(q))}${q.examRefs.length?`<br>참고한 족보 발문: ${e(q.examRefs.join(' · '))}`:''}</p>${publicPathLinks(q)?`<p class="source-line">사진·보충 근거: ${publicPathLinks(q)}</p>`:''}</div>`;
}
export function createPathologyUI({read,save,openTab,onChange,announce}){
 const keys={progress:'infection-immunity.pathology.progress.v1',session:'infection-immunity.pathology.session.v1',bookmarks:'infection-immunity.pathology.bookmarks.v1'};
 let progress=readProgress(read(keys.progress),PATH_QUESTIONS);
 let bookmarks=readBookmarks(read(keys.bookmarks),PATH_QUESTIONS);
 let session=resumeContinuousSession(read(keys.session),PATH_QUESTIONS,progress,Math.random,bookmarks);
 let view='quiz';
 $('pathologyContent').innerHTML=`<div class="section-heading page-heading"><div><p class="eyebrow blue">PATHOLOGY · IMAGE & REASONING</p><h1>감염성 질환의 병리</h1><p class="muted">병리 1·2 + 통합실습 + PathEdu · 사진 ${PATH_QUESTIONS.filter(q=>q.topic==='path-image').length} / 특성 ${PATH_QUESTIONS.filter(q=>q.topic==='path-traits').length} / 총론 ${PATH_QUESTIONS.filter(q=>q.topic==='path-general').length} · 총 ${PATH_QUESTIONS.length}문항</p></div><div id="pathProgressPill" class="tiny-chip"></div></div>
  <div class="subnav" aria-label="병리 학습 방식"><button type="button" class="active" data-path-view="quiz" aria-pressed="true">문제 풀기</button><button type="button" data-path-view="tables" aria-pressed="false">정리표</button><button type="button" id="pathWrongQuick">병리 오답 <span id="pathWrongCount">0</span></button></div>
  <section id="pathQuizPanel" aria-label="병리 문제 풀기"><div class="path-intro"><p>사진의 제목·병원체명·정답 주석을 제외했습니다. <b>옳은 것 / 옳지 않은 것</b> 발문을 확인하세요.</p><span>족보 7–8강 · ${EXAM_REVIEW.count}문항의 발문·감별 구조 참고</span></div>
   <form id="pathSetup" class="setup-card"><div class="filter-grid path-filter-grid"><label>문제 유형<select id="pathType"><option value="all">3개 유형 종합</option><option value="path-image">사진 → 원인균</option><option value="path-traits">원인균 특성 판별</option><option value="path-general">총론 판별</option><option value="library">PathEdu 조직 통합</option></select></label><label>복습 범위<select id="pathMode"><option value="all">미풀이 → 오답</option><option value="unanswered">미풀이부터 이어 풀기</option><option value="wrong">오답 복습</option><option value="bookmarks">별표 문항</option></select></label></div><div class="setup-bottom"><p id="pathEligible" class="muted" aria-live="polite"></p><button type="submit" class="button path-primary">전체 이어 풀기 →</button></div></form>
   <div id="pathStage"></div></section>
  <section id="pathTablesPanel" aria-label="병리 정리표" hidden><p class="table-tip">표는 휴대폰에서 좌우로 밀어 볼 수 있습니다. 출처 쪽수는 첨부 PDF의 실제 페이지입니다.</p>${renderTables(PATHOLOGY_TABLES)}<details class="exam-style-note"><summary>족보에서 참고한 출제 방식과 범위</summary><p>족보 PDF ${EXAM_REVIEW.pages[0]}–${EXAM_REVIEW.pages.at(-1)}쪽, 병리 단원 ${EXAM_REVIEW.count}문항을 검토했습니다. 사진+짧은 증례, 병원체별 특징을 바꾼 선지, 총론의 옳고 그름 판별 구조를 반영했습니다.</p><p>${EXAM_REVIEW.years.map(x=>`${x.year}: ${x.numbers.join('·')}번`).join(' / ')}</p><p>${e(EXAM_REVIEW.note)}</p><p>사진은 병리 1·2·통합실습 강의와 서울대학교 병리교육 라이브러리의 조직 자료를 사용했습니다. 병원체명·슬라이드 제목·학생 주석을 제외했으며, 형태만으로 구분하기 어려운 종이나 유전형을 확정하는 문제는 피했습니다.</p><p>분류·전파 보충: <a href="https://www.cdc.gov/dpdx/pneumocystis/index.html" target="_blank" rel="noopener noreferrer">CDC · Pneumocystis</a></p></details></section>`;
 if(!$('photoDialog'))document.body.insertAdjacentHTML('beforeend','<dialog id="photoDialog" class="photo-dialog" aria-labelledby="photoTitle"><div class="photo-dialog-head"><h2 id="photoTitle">표본 사진 확대</h2><button type="button" id="closePhoto" class="button outline small" aria-label="확대 사진 닫기">닫기 ×</button></div><img id="photoLarge" alt=""><p id="photoCaption"></p></dialog>');
 const filters=()=>pathologyFilters($('pathType').value,$('pathMode').value);
 function setFilters(f){$('pathType').value=f.sourceScope==='library'?'library':f.topic||'all';$('pathMode').value=['all','unanswered','wrong','bookmarks'].includes(f.mode)?f.mode:'all';eligible();}
 function scopeStats(f=session?.filters||filters()){return continuousProgress(PATH_QUESTIONS,f,progress,bookmarks);}
 function eligible(){const value=scopeStats(filters());$('pathEligible').textContent=value.total?`전체 ${value.total}문항 · 미풀이 ${value.unanswered} · 오답 ${value.wrong} · 미풀이를 마치면 오답을 이어 풉니다`:'선택 범위에 문항이 없습니다';}
 function refreshSession(){progress=readProgress(read(keys.progress),PATH_QUESTIONS);session=resumeContinuousSession(read(keys.session),PATH_QUESTIONS,progress,Math.random,bookmarks);if(session){setFilters(session.filters);save(keys.session,session);}}
 function sync(){if(session)session.queueCounts=scopeStats(session.filters);save(keys.progress,progress);save(keys.session,session);update();onChange();}
 function update(){const s=stats(PATH_QUESTIONS,progress);$('pathWrongCount').textContent=s.wrong;$('pathProgressPill').textContent=`정답 ${s.correct} · 오답 ${s.wrong} · 미풀이 ${s.unanswered}`;eligible();}
 function show(v){const next=v==='tables'?'tables':'quiz',changed=view!==next;view=next;$('pathQuizPanel').hidden=view!=='quiz';$('pathTablesPanel').hidden=view!=='tables';document.querySelectorAll('[data-path-view]').forEach(b=>{const on=b.dataset.pathView===view;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});if(changed)window.scrollTo({top:0,behavior:'auto'});}
 function focus(){requestAnimationFrame(()=>{const c=$('pathQuestion')||$('pathSummary');if(c){c.focus({preventScroll:true});c.scrollIntoView({block:'nearest',behavior:'auto'});}});}
 function start(f=filters(),force=false,single=null){
  openTab('pathology');show('quiz');
  progress=readProgress(read(keys.progress),PATH_QUESTIONS);
  const nextFilters={...f,count:0,...(single?{questionIds:[single]}:{})};
  session=startContinuousSession(PATH_QUESTIONS,nextFilters,progress,Math.random,bookmarks,nextFilters.mode==='review'?null:session);
  setFilters(session.filters);save(keys.session,session);update();render();onChange();focus();
 }
 function render(){
  if(!session){$('pathStage').innerHTML='<div class="empty-state"><span class="empty-icon" aria-hidden="true">▧</span><h2>사진에서 원인을, 선지에서 차이를.</h2><p>사진형·특성형·총론형을 섞거나 원하는 유형만 선택하세요.<br>채점 후 모든 선지의 판단 근거를 확인할 수 있습니다.</p><button type="button" class="button path-primary" data-path-start="mixed">병리 전체 이어 풀기 →</button></div>';return;}
  if(!session.items.length||session.phase==='complete'||session.position>=session.items.length){summary();return;}
  const item=session.items[session.position],q=PATH_QUESTIONS.find(q=>q.id===item.id),graded=item.selected!==null;
  const value=scopeStats(session.filters),phase=session.phase==='wrong'?'오답 복습':session.phase==='review'?'직접 복습':'미풀이 학습';
  const question=`<article class="question-card pathology-question" id="pathQuestion" tabindex="-1" aria-labelledby="pathStem"><div class="q-top"><div class="q-tags"><span class="pill blue">${PATH_TOPICS[q.topic].short}</span><span class="ask-tag ${q.ask==='incorrect'?'negative':''}">${q.ask==='organism'?'원인 병원체':q.ask==='incorrect'?'옳지 않은 것':'옳은 것'}</span></div><button type="button" class="bookmark" data-path-bookmark="${q.id}" aria-label="${bookmarks.includes(q.id)?'병리 북마크 해제':'이 병리 문제 북마크'}" aria-pressed="${bookmarks.includes(q.id)}">${bookmarks.includes(q.id)?'★':'☆'}</button></div><div class="session-line"><span>${phase} <b>${session.position+1}</b> / ${session.items.length}</span><span>전체 ${value.total} · 미풀이 ${value.unanswered} · 오답 ${value.wrong}</span></div><div class="session-track"><span style="width:${value.total?value.correct/value.total*100:0}%"></span></div><h2 id="pathStem" class="question-stem">${emphasizePrompt(q.stem)}</h2>${imageMarkup(q)}<p class="question-instruction">${graded?'채점 완료 · Enter로 다음 문제':'숫자 1–5로 답 선택 · 채점 후 Enter로 다음 문제'}${q.photos.length?' · 사진을 누르면 확대':''}</p><div class="choices" role="group" aria-labelledby="pathStem">${item.choices.map((c,i)=>{const cls=!graded?'':i===item.answer?' right':i===item.selected?' wrong':' dim';return `<button type="button" class="choice${cls}" data-path-answer="${i}" ${graded?'disabled':''}><span class="choice-num" aria-hidden="true">${i+1}</span><span class="choice-copy">${e(c)}</span>${graded&&i===item.answer?'<span class="choice-label">정답</span>':graded&&i===item.selected?'<span class="choice-label">내 선택</span>':''}</button>`;}).join('')}</div><div class="question-actions"><button type="button" class="text-button" data-path-action="${session.position?'previous':'home'}">${session.position?'← 이전 문제':'← 학습 허브'}</button><button type="button" class="${graded?'button path-primary':'text-button'}" data-path-action="next">${graded?'다음 문제 →':'건너뛰기 →'}</button></div></article>`;
  $('pathStage').innerHTML=practiceLayout({question,feedback:graded?pathFeedback(q,item.selected===item.answer,item.choices):'',q,session,sourceLabel:pathSource(q)});
 }
 function summary(){
  const value=scopeStats(session.filters),review=session.filters.mode==='review',wrongOnly=session.filters.mode==='wrong';
  $('pathStage').innerHTML=`<article class="summary-card" id="pathSummary" tabindex="-1"><p class="eyebrow blue">PATHOLOGY · LEARNING COMPLETE</p><h2>${!value.total?'선택 범위에 문항이 없습니다.':review?'선택한 문항의 복습을 마쳤습니다.':wrongOnly?'선택한 오답 복습을 마쳤습니다.':'선택 범위를 모두 맞혔습니다.'}</h2><p class="muted">전체 ${value.total}문항 · 정답 ${value.correct} · 미풀이 ${value.unanswered} · 오답 ${value.wrong}</p><p class="muted">학습 기록은 저장되었습니다. 다른 범위를 선택해서 이어서 학습할 수 있습니다.</p><div class="summary-actions"><button type="button" class="button outline" data-path-scope>유형·범위 선택</button><button type="button" class="text-button" data-path-view="tables">병리 정리표 보기</button><button type="button" class="text-button" data-path-action="home">학습 허브로 →</button></div></article>`;
 }
 function answer(selected){if(!session||session.position>=session.items.length)return;const r=grade(session,progress,session.position,selected,PATH_QUESTIONS);if(r.duplicate)return;progress=r.progress;sync();render();announce(r.correct?'병리 정답입니다.':'병리 오답입니다. 선지별 해설을 확인하세요.');requestAnimationFrame(()=>document.querySelector('#pathStage .feedback')?.focus({preventScroll:true}));}
 function next(){if(!session||session.position>=session.items.length)return;session=advanceContinuousSession(session,progress,PATH_QUESTIONS,Math.random,bookmarks);save(keys.session,session);update();render();onChange();focus();}
 function refreshBookmarks(){document.querySelectorAll('[data-path-bookmark]').forEach(b=>{const on=bookmarks.includes(b.dataset.pathBookmark);b.textContent=on?'★':'☆';b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',on?'병리 북마크 해제':'이 병리 문제 북마크');});eligible();}
 function bookmark(id){const saved=toggleSavedBookmark(read(keys.bookmarks),id);bookmarks=readBookmarks(JSON.stringify(saved),PATH_QUESTIONS);save(keys.bookmarks,saved);refreshBookmarks();announce(bookmarks.includes(id)?'병리 북마크에 저장했습니다.':'병리 북마크를 해제했습니다.');}
 $('pathSetup').addEventListener('submit',ev=>{ev.preventDefault();start(filters());});
 for(const id of ['pathType','pathMode'])$(id).addEventListener('change',eligible);
 $('pathWrongQuick').addEventListener('click',()=>start({topic:'all',mode:'wrong',count:0}));
 $('closePhoto').addEventListener('click',()=>$('photoDialog').close());
 $('photoDialog').addEventListener('click',ev=>{if(ev.target===$('photoDialog')){const b=$('photoDialog').getBoundingClientRect();if(ev.clientX<b.left||ev.clientX>b.right||ev.clientY<b.top||ev.clientY>b.bottom)$('photoDialog').close();}});
 document.addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.pathView){show(b.dataset.pathView);return;}
  if(b.hasAttribute('data-path-scope')){$('pathSetup').scrollIntoView({block:'start',behavior:'auto'});$('pathType').focus();return;}
  if(b.dataset.photoId){const p=PHOTOS[b.dataset.photoId];if(!p)return;$('photoLarge').src=p.src;$('photoLarge').alt=p.alt;$('photoCaption').textContent=`${p.caption} · ${photoSourceLabel(p)}`;$('photoDialog').showModal();return;}
  if(b.dataset.pathAnswer!==undefined){answer(Number(b.dataset.pathAnswer));return;}
  if(b.dataset.pathBookmark){bookmark(b.dataset.pathBookmark);return;}
  if(b.dataset.pathStart){const action=b.dataset.pathStart;start(action==='again'?(session?.filters||filters()):pathologyFilters(action==='mixed'||action==='wrong'?'all':action,action==='wrong'?'wrong':'all',0));return;}
  if(b.dataset.pathJump!==undefined){session.position=Number(b.dataset.pathJump);save(keys.session,session);render();focus();return;}
  if(b.dataset.pathAction==='home'){openTab('home');return;}
  if(!session)return;
  if(b.dataset.pathAction==='next')next();
  if(b.dataset.pathAction==='previous'){session.position=Math.max(0,session.position-1);save(keys.session,session);render();focus();}
 });
 window.addEventListener('storage',ev=>{if(ev.key===keys.progress||ev.key===null){progress=readProgress(ev.newValue,PATH_QUESTIONS);update();onChange();}if(ev.key===keys.bookmarks||ev.key===null){bookmarks=readBookmarks(ev.newValue,PATH_QUESTIONS);refreshBookmarks();}});
 if(session){setFilters(session.filters||{});save(keys.session,session);}update();render();
 return {open(){refreshSession();update();render();},start,show,stats:()=>stats(PATH_QUESTIONS,progress),getProgress:()=>progress,hasSession:()=>!!session&&session.phase!=='complete'&&session.position<session.items.length,resume(){openTab('pathology');show('quiz');refreshSession();update();render();onChange();focus();},retry(id){const q=PATH_QUESTIONS.find(q=>q.id===id);if(q)start({topic:q.topic,mode:'review',questionIds:[id],count:0},false,id);}};
}
