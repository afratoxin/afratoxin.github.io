import {PATH_QUESTIONS,PATH_TOPICS,PHOTOS,PATH_DOCUMENTS,EXAM_REVIEW,pathSource} from './pathology-bank.mjs?v=20261108b';
import {buildSession,grade,stats,readProgress,restoreSession,readBookmarks} from './logic.mjs?v=20261108b';
import {PATHOLOGY_TABLES,renderTables} from './reference-tables.mjs?v=20261108b';

const e=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=id=>document.getElementById(id);
export function imageMarkup(q){
 if(!q.photos.length)return '';
 return `<div class="path-photos${q.photos.length===1?' single':''}">${q.photos.map((id,i)=>{const p=PHOTOS[id];return `<figure><button type="button" class="photo-zoom" data-photo-id="${id}" aria-label="표본 사진 ${i+1} 확대"><img src="${p.src}" alt="${e(p.alt)}" width="${p.width}" height="${p.height}" loading="lazy"><span>확대 보기 ⤢</span></button><figcaption>${e(p.caption)} · ${PATH_DOCUMENTS[p.doc]} ${p.page}쪽</figcaption></figure>`;}).join('')}</div>`;
}
export function pathFeedback(q,correct,order=q.choices){
 return `<div class="feedback${correct?'':' missed'}" tabindex="-1"><h3>${correct?'정답입니다.':'감별점을 다시 확인하세요.'}</h3><p class="answer-line">정답 · ${e(q.choices[q.answer])}</p><p>${e(q.explanation)}</p><details class="choice-explanations" open><summary>선지별 해설</summary><ol>${order.map(c=>`<li><b>${e(c)}</b><p>${e(q.choiceNotes[q.choices.indexOf(c)])}</p></li>`).join('')}</ol></details><p class="source-line">근거: ${e(pathSource(q))}${q.examRefs.length?`<br>참고한 족보 발문: ${e(q.examRefs.join(' · '))}`:''}</p></div>`;
}
export function createPathologyUI({read,save,openTab,onChange,announce}){
 const keys={progress:'infection-immunity.pathology.progress.v1',session:'infection-immunity.pathology.session.v1',bookmarks:'infection-immunity.pathology.bookmarks.v1'};
 let progress=readProgress(read(keys.progress),PATH_QUESTIONS);
 let session=restoreSession(read(keys.session),PATH_QUESTIONS);
 let bookmarks=readBookmarks(read(keys.bookmarks),PATH_QUESTIONS);
 let view='quiz',pending=null;
 $('pathologyContent').innerHTML=`<div class="section-heading page-heading"><div><p class="eyebrow blue">PATHOLOGY · IMAGE & REASONING</p><h1>감염성 질환의 병리</h1><p class="muted">병리 1·2 + 통합실습 · 사진 24 / 특성 32 / 총론 24 · 총 80문항</p></div><div id="pathProgressPill" class="tiny-chip"></div></div>
  <div class="subnav" aria-label="병리 학습 방식"><button type="button" class="active" data-path-view="quiz" aria-pressed="true">문제 풀기</button><button type="button" data-path-view="tables" aria-pressed="false">정리표</button><button type="button" id="pathWrongQuick">병리 오답 <span id="pathWrongCount">0</span></button></div>
  <section id="pathQuizPanel" aria-label="병리 문제 풀기"><div class="path-intro"><p>사진의 제목·병원체명·정답 주석을 제외했습니다. <b>옳은 것 / 옳지 않은 것</b> 발문을 확인하세요.</p><span>족보 7–8강 · 22문항의 발문·감별 구조 참고</span></div>
   <form id="pathSetup" class="setup-card"><div class="filter-grid path-filter-grid"><label>문제 유형<select id="pathType"><option value="all">3개 유형 종합</option><option value="path-image">사진 → 원인균</option><option value="path-traits">원인균 특성 판별</option><option value="path-general">총론 판별</option></select></label><label>풀 문제<select id="pathMode"><option value="all">전체 문제</option><option value="unanswered">아직 안 푼 문제</option><option value="wrong">틀린 문제</option><option value="bookmarks">북마크한 문제</option></select></label><label>세트 길이<select id="pathCount"><option value="10">10문항</option><option value="20" selected>20문항</option><option value="0">선택 범위 전체</option></select></label></div><div class="setup-bottom"><p id="pathEligible" class="muted" aria-live="polite"></p><button type="submit" class="button path-primary">새 세트 시작 →</button></div><div id="pathReplace" class="replace-prompt" hidden><p>진행 중인 병리 세트를 바꿀까요? 이미 채점한 기록은 유지됩니다.</p><button type="button" id="pathReplaceYes" class="button path-primary small">새 세트로 시작</button><button type="button" id="pathReplaceNo" class="button outline small">이어서 풀기</button></div></form>
   <div id="pathStage"></div></section>
  <section id="pathTablesPanel" aria-label="병리 정리표" hidden><p class="table-tip">표는 휴대폰에서 좌우로 밀어 볼 수 있습니다. 출처 쪽수는 첨부 PDF의 실제 페이지입니다.</p>${renderTables(PATHOLOGY_TABLES)}<details class="exam-style-note"><summary>족보에서 참고한 출제 방식과 범위</summary><p>족보 PDF ${EXAM_REVIEW.pages[0]}–${EXAM_REVIEW.pages.at(-1)}쪽, 병리 단원 ${EXAM_REVIEW.count}문항을 검토했습니다. 사진+짧은 증례, 병원체별 특징을 바꾼 선지, 총론의 옳고 그름 판별 구조를 반영했습니다.</p><p>${EXAM_REVIEW.years.map(x=>`${x.year}: ${x.numbers.join('·')}번`).join(' / ')}</p><p>${e(EXAM_REVIEW.note)}</p><p>사진은 세 강의에 포함된 원본 사진을 사용했습니다. 병원체명·슬라이드 제목·학생 주석을 제외했으며, 형태만으로 구분하기 어려운 종이나 유전형을 확정하는 문제는 피했습니다.</p><p>분류·전파 보충: <a href="https://www.cdc.gov/dpdx/cysticercosis/index.html" target="_blank" rel="noopener noreferrer">CDC · 낭미충증</a> / <a href="https://www.cdc.gov/dpdx/pneumocystis/index.html" target="_blank" rel="noopener noreferrer">CDC · Pneumocystis</a></p></details></section>`;
 if(!$('photoDialog'))document.body.insertAdjacentHTML('beforeend','<dialog id="photoDialog" class="photo-dialog" aria-labelledby="photoTitle"><div class="photo-dialog-head"><h2 id="photoTitle">표본 사진 확대</h2><button type="button" id="closePhoto" class="button outline small" aria-label="확대 사진 닫기">닫기 ×</button></div><img id="photoLarge" alt=""><p id="photoCaption"></p></dialog>');
 const filters=()=>({topic:$('pathType').value,format:'all',mode:$('pathMode').value,count:Number($('pathCount').value)});
 function setFilters(f){$('pathType').value=f.topic||'all';$('pathMode').value=f.mode||'all';$('pathCount').value=String(f.count??20);eligible();}
 function eligible(){const f=filters(),n=buildSession(PATH_QUESTIONS,{...f,count:0},progress,Math.random,bookmarks).items.length;$('pathEligible').textContent=n?`선택 가능한 ${n}문항 중 ${f.count?Math.min(f.count,n):n}문항`:'선택 조건에 해당하는 문제가 없습니다';}
 function sync(){save(keys.progress,progress);save(keys.session,session);update();onChange();}
 function update(){const s=stats(PATH_QUESTIONS,progress);$('pathWrongCount').textContent=s.wrong;$('pathProgressPill').textContent=`정답 ${s.correct} · 오답 ${s.wrong} · 미풀이 ${s.unanswered}`;eligible();}
 function show(v){const next=v==='tables'?'tables':'quiz',changed=view!==next;view=next;$('pathQuizPanel').hidden=view!=='quiz';$('pathTablesPanel').hidden=view!=='tables';document.querySelectorAll('[data-path-view]').forEach(b=>{const on=b.dataset.pathView===view;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});if(changed)window.scrollTo({top:0,behavior:'auto'});}
 function focus(){requestAnimationFrame(()=>{const c=$('pathQuestion')||$('pathSummary');if(c){c.focus({preventScroll:true});c.scrollIntoView({block:'nearest',behavior:'auto'});}});}
 function start(f,force=false,single=null){
  openTab('pathology');show('quiz');
  if(!force&&session&&session.position<session.items.length){pending={f,single};$('pathReplace').hidden=false;$('pathReplaceYes').focus();return;}
  pending=null;$('pathReplace').hidden=true;setFilters(f);
  session=buildSession(single?PATH_QUESTIONS.filter(q=>q.id===single):PATH_QUESTIONS,f,progress,Math.random,bookmarks);
  save(keys.session,session);update();render();onChange();focus();
 }
 function render(){
  if(!session){$('pathStage').innerHTML='<div class="empty-state"><span class="empty-icon" aria-hidden="true">▧</span><h2>사진에서 원인을, 선지에서 차이를.</h2><p>사진형·특성형·총론형을 섞거나 원하는 유형만 선택하세요.<br>채점 후 모든 선지의 판단 근거를 확인할 수 있습니다.</p><button type="button" class="button path-primary" data-path-start="mixed">병리 종합 20문항 시작 →</button></div>';return;}
  if(!session.items.length){$('pathStage').innerHTML='<div class="empty-state"><h2>이 조건에 해당하는 문제가 없습니다.</h2><p>오답이 없거나 선택한 범위의 문제가 없을 수 있습니다. 유형·풀이 조건을 바꾸어 보세요.</p><button type="button" class="button outline" data-path-start="mixed">병리 전체에서 풀기 →</button></div>';return;}
  if(session.position>=session.items.length){summary();return;}
  const item=session.items[session.position],q=PATH_QUESTIONS.find(q=>q.id===item.id),graded=item.selected!==null;
  const attempted=session.items.filter(i=>i.selected!==null).length;
  $('pathStage').innerHTML=`<article class="question-card pathology-question" id="pathQuestion" tabindex="-1" aria-labelledby="pathStem"><div class="q-top"><div class="q-tags"><span class="pill blue">${PATH_TOPICS[q.topic].short}</span><span class="ask-tag ${q.ask==='incorrect'?'negative':''}">${q.ask==='organism'?'원인 병원체':q.ask==='incorrect'?'옳지 않은 것':'옳은 것'}</span><span class="format-tag">${q.id}</span></div><button type="button" class="bookmark" data-path-bookmark="${q.id}" aria-label="${bookmarks.includes(q.id)?'병리 북마크 해제':'이 병리 문제 북마크'}" aria-pressed="${bookmarks.includes(q.id)}">${bookmarks.includes(q.id)?'★':'☆'}</button></div><div class="session-line"><span>문제 <b>${session.position+1}</b> / ${session.items.length}</span><span>${attempted}문항 채점 완료</span></div><div class="session-track"><span style="width:${session.position/session.items.length*100}%"></span></div><h2 id="pathStem" class="question-stem">${e(q.stem)}</h2>${imageMarkup(q)}<p class="question-instruction">가장 적절한 답을 하나 고르세요. · 키보드 1–5${q.photos.length?' · 사진을 누르면 확대':''}</p><div class="choices" role="group" aria-labelledby="pathStem">${item.choices.map((c,i)=>{const cls=!graded?'':i===item.answer?' right':i===item.selected?' wrong':' dim';return `<button type="button" class="choice${cls}" data-path-answer="${i}" ${graded?'disabled':''}><span class="choice-num" aria-hidden="true">${i+1}</span><span class="choice-copy">${e(c)}</span>${graded&&i===item.answer?'<span class="choice-label">정답</span>':graded&&i===item.selected?'<span class="choice-label">내 선택</span>':''}</button>`;}).join('')}</div>${graded?pathFeedback(q,item.selected===item.answer,item.choices):''}<div class="question-actions"><button type="button" class="text-button" data-path-action="${session.position?'previous':'home'}">${session.position?'← 이전 문제':'← 학습 허브'}</button><button type="button" class="${graded?'button path-primary':'text-button'}" data-path-action="next">${graded?(session.position===session.items.length-1?'세트 결과 보기 →':'다음 문제 →'):'건너뛰기 →'}</button></div></article>`;
 }
 function summary(){const answered=session.items.filter(i=>i.selected!==null),correct=answered.filter(i=>i.selected===i.answer).length;
  $('pathStage').innerHTML=`<article class="summary-card" id="pathSummary" tabindex="-1"><p class="eyebrow blue">PATHOLOGY · SESSION COMPLETE</p><h2>병리 한 세트를 마쳤습니다.</h2><p class="muted">${session.items.length}문항 중 ${answered.length}문항 채점 · ${session.items.length-answered.length}문항 건너뜀</p><div class="summary-score">${correct}<small> / ${answered.length} 정답</small></div><p class="muted">${answered.length?`정답률 ${Math.round(correct/answered.length*100)}%`:'채점한 문제가 없습니다.'}</p><div class="summary-results">${session.items.map((it,n)=>`<button type="button" class="result-number ${it.selected===null?'':it.selected===it.answer?'correct':'wrong'}" data-path-jump="${n}" aria-label="병리 ${n+1}번 ${it.selected===null?'미풀이':it.selected===it.answer?'정답':'오답'} 확인">${n+1}</button>`).join('')}</div><div class="summary-actions"><button type="button" class="button path-primary" data-path-start="wrong" ${!stats(PATH_QUESTIONS,progress).wrong?'disabled':''}>병리 오답 다시 풀기 →</button><button type="button" class="button outline" data-path-start="again">현재 설정으로 새 세트</button><button type="button" class="text-button" data-path-view="tables">병리 정리표 보기</button></div></article>`;
 }
 function answer(selected){if(!session||session.position>=session.items.length)return;const r=grade(session,progress,session.position,selected,PATH_QUESTIONS);if(r.duplicate)return;progress=r.progress;sync();render();announce(r.correct?'병리 정답입니다.':'병리 오답입니다. 선지별 해설을 확인하세요.');requestAnimationFrame(()=>document.querySelector('#pathStage .feedback')?.focus({preventScroll:true}));}
 function refreshBookmarks(){document.querySelectorAll('[data-path-bookmark]').forEach(b=>{const on=bookmarks.includes(b.dataset.pathBookmark);b.textContent=on?'★':'☆';b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',on?'병리 북마크 해제':'이 병리 문제 북마크');});eligible();}
 function bookmark(id){bookmarks=bookmarks.includes(id)?bookmarks.filter(x=>x!==id):[...bookmarks,id];save(keys.bookmarks,bookmarks);refreshBookmarks();announce(bookmarks.includes(id)?'병리 북마크에 저장했습니다.':'병리 북마크를 해제했습니다.');}
 $('pathSetup').addEventListener('submit',ev=>{ev.preventDefault();start(filters());});
 for(const id of ['pathType','pathMode','pathCount'])$(id).addEventListener('change',eligible);
 $('pathReplaceYes').addEventListener('click',()=>{if(pending)start(pending.f,true,pending.single);});
 $('pathReplaceNo').addEventListener('click',()=>{pending=null;$('pathReplace').hidden=true;focus();});
 $('pathWrongQuick').addEventListener('click',()=>start({topic:'all',mode:'wrong',count:0}));
 $('closePhoto').addEventListener('click',()=>$('photoDialog').close());
 $('photoDialog').addEventListener('click',ev=>{if(ev.target===$('photoDialog')){const b=$('photoDialog').getBoundingClientRect();if(ev.clientX<b.left||ev.clientX>b.right||ev.clientY<b.top||ev.clientY>b.bottom)$('photoDialog').close();}});
 document.addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.pathView){show(b.dataset.pathView);return;}
  if(b.dataset.photoId){const p=PHOTOS[b.dataset.photoId];if(!p)return;$('photoLarge').src=p.src;$('photoLarge').alt=p.alt;$('photoCaption').textContent=`${p.caption} · ${PATH_DOCUMENTS[p.doc]} PDF ${p.page}쪽`;$('photoDialog').showModal();return;}
  if(b.dataset.pathAnswer!==undefined){answer(Number(b.dataset.pathAnswer));return;}
  if(b.dataset.pathBookmark){bookmark(b.dataset.pathBookmark);return;}
  if(b.dataset.pathStart){const action=b.dataset.pathStart;start(action==='again'?(session?.filters||filters()):{topic:action==='mixed'||action==='wrong'?'all':action,mode:action==='wrong'?'wrong':'all',count:action==='wrong'?0:20});return;}
  if(b.dataset.pathJump!==undefined){session.position=Number(b.dataset.pathJump);save(keys.session,session);render();focus();return;}
  if(b.dataset.pathAction==='home'){openTab('home');return;}
  if(!session)return;
  if(b.dataset.pathAction==='next'){session.position=Math.min(session.position+1,session.items.length);save(keys.session,session);render();onChange();focus();}
  if(b.dataset.pathAction==='previous'){session.position=Math.max(0,session.position-1);save(keys.session,session);render();focus();}
 });
 document.addEventListener('keydown',ev=>{if(ev.defaultPrevented||ev.ctrlKey||ev.altKey||ev.metaKey||ev.repeat||$('panel-pathology').hidden||view!=='quiz'||$('photoDialog').open||!$('pathReplace').hidden||!session||session.position>=session.items.length||ev.target.closest('input,select,textarea,nav,[role=tablist]'))return;if(session.items[session.position].selected!==null)return;if(/^[1-5]$/.test(ev.key)){ev.preventDefault();answer(Number(ev.key)-1);}});
 window.addEventListener('storage',ev=>{if(ev.key===keys.progress){progress=readProgress(ev.newValue,PATH_QUESTIONS);update();onChange();}if(ev.key===keys.bookmarks){bookmarks=readBookmarks(ev.newValue,PATH_QUESTIONS);refreshBookmarks();}});
 if(session)setFilters(session.filters||{});update();render();
 return {open(){update();render();},start,show,stats:()=>stats(PATH_QUESTIONS,progress),getProgress:()=>progress,hasSession:()=>!!session&&session.position<session.items.length,resume(){openTab('pathology');show('quiz');render();focus();},retry(id){const q=PATH_QUESTIONS.find(q=>q.id===id);if(q)start({topic:q.topic,mode:'all',count:0},false,id);}};
}
