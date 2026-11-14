import {emphasizeFeedback,emphasizePrompt} from './emphasis.mjs?v=20261114b';
import {QUESTIONS,TOPICS,SOURCES} from './bank.mjs?v=20261114b';
import {buildSession,grade,stats,restoreSession,readProgress,tabFromHash} from './logic.mjs?v=20261114b';
import {PATH_QUESTIONS,PATH_TOPICS,pathSource} from './pathology-bank.mjs?v=20261114b';
import {createPathologyUI,pathFeedback,imageMarkup} from './pathology-ui.mjs?v=20261114b';
import {ANTIBIOTIC_TABLES,renderTables} from './reference-tables.mjs?v=20261114b';
import {LECTURES,DOCUMENTS,LECTURE_QUESTIONS,TABLE_QUESTIONS,TABLE_TOPICS} from './study-bank.mjs?v=20261114b';
import {createStudyUI,studyFeedback} from './study-ui.mjs?v=20261114b';
import {sourceText} from './study-core.mjs?v=20261114b';

const $=id=>document.getElementById(id);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEYS={progress:'infection-immunity.progress.v1',session:'infection-immunity.session.v1',bookmarks:'infection-immunity.bookmarks.v1'};
let memoryOnly=false;
function storageNotice(){memoryOnly=true;$('saveStatus').textContent='이번 방문에서만 기록됩니다 · 브라우저 저장 불가';}
function read(key){try{return localStorage.getItem(key);}catch{storageNotice();return null;}}
function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{storageNotice();}}
let progress=readProgress(read(KEYS.progress),QUESTIONS);
let session=restoreSession(read(KEYS.session),QUESTIONS);
let bookmarks=[];
try{const b=JSON.parse(read(KEYS.bookmarks));if(Array.isArray(b))bookmarks=[...new Set(b.filter(id=>QUESTIONS.some(q=>q.id===id)))];}catch{}
let activeTab='home';
let pendingFilters=null;
let pathologyUI=null;
let lectureUI=null,drillUI=null;
const ALL_QUESTIONS=[...QUESTIONS,...PATH_QUESTIONS,...LECTURE_QUESTIONS,...TABLE_QUESTIONS];
const ALL_TOPICS={...TOPICS,...PATH_TOPICS,...LECTURES,...TABLE_TOPICS};
const isPath=q=>q.id.startsWith('path-');
const isStudy=q=>q.id.startsWith('lecture-')||q.id.startsWith('table-');
const allProgress=()=>({...progress,...pathologyUI?.getProgress(),...lectureUI?.getProgress(),...drillUI?.getProgress()});

function track(s){return `<span class="segment-correct" style="width:${s.total?s.correct/s.total*100:0}%"></span><span class="segment-wrong" style="width:${s.total?s.wrong/s.total*100:0}%"></span>`;}
function source(q){if(isStudy(q))return sourceText(q,DOCUMENTS);return isPath(q)?pathSource(q):`근거: 강의 PDF ${q.pages.join('·')}쪽${q.refs.length?' · 보충 근거 포함':''}`;}
function links(q){return q.refs.map(ref=>`<a href="${escape(SOURCES[ref].url)}" target="_blank" rel="noopener noreferrer">${escape(SOURCES[ref].title)} ↗</a>`).join('');}
function explanation(q,correct){if(isStudy(q))return studyFeedback(q,correct);if(isPath(q))return pathFeedback(q,correct);return `<div class="feedback${correct?'':' missed'}" tabindex="-1"><h3>${correct?'정답입니다.':'이 부분을 다시 기억해 두세요.'}</h3><p class="answer-line">정답 · ${escape(q.choices[q.answer])}</p><p>${emphasizeFeedback(q.explanation)}</p>${q.note?`<p class="supplement"><b>구분해서 기억하기</b><br>${emphasizeFeedback(q.note)}</p>`:''}<p class="source-line">${escape(source(q))}</p>${links(q)}</div>`;}
function announce(message){$('announcement').textContent=message;}
function updateDashboard(){
  const s=stats(ALL_QUESTIONS,allProgress());
  $('homeAttempted').textContent=s.attempted;$('homeCorrect').textContent=s.correct;$('homeWrong').textContent=s.wrong;$('homeUnanswered').textContent=s.unanswered;
  $('homeTotal').textContent=s.total;
  $('homeTrack').innerHTML=track(s);$('homeTrack').setAttribute('aria-label',`전체 ${s.total}문항 중 정답 ${s.correct}, 오답 ${s.wrong}, 미풀이 ${s.unanswered}`);
  $('wrongBadge').textContent=s.wrong;
  $('resumeButton').hidden=!session || session.position>=session.items.length;
  if(session)$('resumeButton').textContent=`이어서 풀기 · ${Math.min(session.position+1,session.items.length)}/${session.items.length} →`;
  const a=stats(QUESTIONS,progress),p=stats(PATH_QUESTIONS,pathologyUI?.getProgress()||{});
  $('abxCourseTrack').innerHTML=track(a);$('pathCourseTrack').innerHTML=track(p);
  $('abxCourseStats').textContent=`정답 ${a.correct} · 오답 ${a.wrong} · 미풀이 ${a.unanswered}`;
  $('pathCourseStats').textContent=`정답 ${p.correct} · 오답 ${p.wrong} · 미풀이 ${p.unanswered}`;
  $('pathResumeButton').hidden=!pathologyUI?.hasSession();
  for(const [prefix,bank,ui] of [['lecture',LECTURE_QUESTIONS,lectureUI],['drill',TABLE_QUESTIONS,drillUI]]){
    const value=stats(bank,ui?.getProgress()||{});
    $(`${prefix}CourseStats`).textContent=`정답 ${value.correct} · 오답 ${value.wrong} · 미풀이 ${value.unanswered}`;
    $(`${prefix}CourseCount`).textContent=`${bank.length}문항`;
  }
  $('libraryCount').innerHTML=`4개 퀴즈 단원 <b>${ALL_QUESTIONS.length}문항</b>`;
  if(!memoryOnly)$('saveStatus').innerHTML='<i aria-hidden="true"></i> 이 브라우저에 학습 기록 저장';
}
function navigate(tab,focus=false){
  if(!['home','quiz','pathology','lectures','drill','review','notes'].includes(tab))tab='home';
  const changed=activeTab!==tab;
  activeTab=tab;
  for(const name of ['home','quiz','pathology','lectures','drill','review','notes']){
    $(`panel-${name}`).hidden=name!==tab;
  }
  const mainTab=tab==='notes'?'quiz':tab;
  for(const name of ['home','quiz','pathology','lectures','drill','review']){$(`tab-${name}`).setAttribute('aria-selected',String(name===mainTab));$(`tab-${name}`).tabIndex=name===mainTab?0:-1;}
  if(location.hash!==`#${tab}`)history.pushState(null,'',`#${tab}`);
  updateDashboard();
  if(tab==='quiz'){updateEligible();renderSession();}
  if(tab==='review')renderReview();
  if(tab==='pathology')pathologyUI?.open();
  if(tab==='lectures')lectureUI?.open();
  if(tab==='drill')drillUI?.open();
  if(changed)window.scrollTo({top:0,behavior:'auto'});
  if(focus)$(`tab-${mainTab}`).focus();
}
function filters(){return {topic:$('topicFilter').value,format:$('formatFilter').value,mode:$('modeFilter').value,count:Number($('countFilter').value)};}
function setFilters(f){$('topicFilter').value=f.topic||'all';$('formatFilter').value=f.format||'all';$('modeFilter').value=f.mode||'all';$('countFilter').value=String(f.count??20);updateEligible();}
function updateEligible(){
  const f=filters(),n=buildSession(QUESTIONS,{...f,count:0},progress,Math.random,bookmarks).items.length;
  const used=f.count?Math.min(f.count,n):n;
  $('eligibleCount').textContent=n?`선택 가능한 ${n}문항 중 ${used}문항 · 순서는 매번 섞입니다`:'선택 조건에 해당하는 문제가 없습니다';
}
function startSession(f,force=false){
  if(!force && session && session.position<session.items.length){pendingFilters={...f};navigate('quiz');$('replacePrompt').hidden=false;$('confirmReplace').focus();return;}
  $('replacePrompt').hidden=true;pendingFilters=null;
  setFilters(f);session=buildSession(QUESTIONS,f,progress,Math.random,bookmarks);save(KEYS.session,session);
  navigate('quiz');focusQuestion();
}
function focusQuestion(){requestAnimationFrame(()=>{const card=$('questionCard')||$('sessionSummary');if(card){card.focus({preventScroll:true});card.scrollIntoView({behavior:'auto',block:'nearest'});}});}
function renderSession(){
  const stage=$('quizStage');
  if(!session){stage.innerHTML='<div class="empty-state"><span class="empty-icon" aria-hidden="true">✚</span><h2>오늘은 어떤 문제를 풀까요?</h2><p>위에서 범위를 고르거나 종합 20문항으로 시작하세요.<br>답을 고르면 바로 채점하고, 해설과 강의 근거를 보여 드립니다.</p><button type="button" class="button primary" data-start="mixed">종합 20문항 시작 →</button></div>';return;}
  if(!session.items.length){stage.innerHTML='<div class="empty-state"><span class="empty-icon" aria-hidden="true">✓</span><h2>이 조건에 해당하는 문제가 없습니다.</h2><p>오답이 없거나 선택한 형식·주제의 문제가 없을 수 있습니다. 위 필터를 바꾸어 새 세트를 시작하세요.</p><button type="button" class="button outline" data-start="mixed">전체에서 종합 20문항 풀기 →</button></div>';return;}
  if(session.position>=session.items.length){renderSummary();return;}
  const item=session.items[session.position],q=QUESTIONS.find(q=>q.id===item.id),graded=item.selected!==null;
  const answered=session.items.filter(i=>i.selected!==null),correct=answered.filter(i=>i.selected===i.answer).length;
  stage.innerHTML=`<div class="quiz-layout"><article id="questionCard" class="question-card" tabindex="-1" aria-labelledby="questionStem">
    <div class="q-top"><div class="q-tags"><span class="pill">${TOPICS[q.topic].title}</span><span class="format-tag">${q.format==='mcq'?'5지선다':'OX 퀴즈'}</span><span class="format-tag">${q.id}</span></div><button type="button" class="bookmark" data-bookmark="${q.id}" aria-pressed="${bookmarks.includes(q.id)}" aria-label="${bookmarks.includes(q.id)?'북마크 해제':'이 문제 북마크'}">${bookmarks.includes(q.id)?'★':'☆'}</button></div>
    <div class="session-line"><span>문제 <b>${session.position+1}</b> / ${session.items.length}</span><span>${answered.length}문항 채점 완료</span></div><div class="session-track" aria-hidden="true"><span style="width:${session.position/session.items.length*100}%"></span></div>
    <h2 id="questionStem" class="question-stem">${emphasizePrompt(q.stem)}</h2><p class="question-instruction">${q.format==='mcq'?'가장 적절한 답을 하나 고르세요. · 키보드 1–5':'물음에 대한 답이 예이면 O, 아니요이면 X를 고르세요. · 키보드 O / X'}</p>
    <div class="choices${q.format==='ox'?' ox':''}" role="group" aria-labelledby="questionStem">${item.choices.map((c,i)=>{
      let cls='',label='';
      if(graded){if(i===item.answer){cls=' right';label='정답';}else if(i===item.selected){cls=' wrong';label='내 선택';}else cls=' dim';}
      return `<button type="button" class="choice${cls}" data-answer="${i}" ${graded?'disabled':''}><span class="choice-num" aria-hidden="true">${i+1}</span><span class="choice-copy">${escape(c)}</span>${label?`<span class="choice-label">${label}</span>`:''}</button>`;
    }).join('')}</div>${graded?explanation(q,item.selected===item.answer):''}
    <div class="question-actions"><button type="button" class="text-button" data-action="${session.position?'previous':'menu'}">${session.position?'← 이전 문제':'← 학습 허브'}</button>${graded?`<button type="button" class="button primary" id="nextQuestion" data-action="next">${session.position===session.items.length-1?'세트 결과 보기':'다음 문제'} →</button>`:'<button type="button" class="text-button" data-action="skip">건너뛰기 →</button>'}</div></article>
    <aside class="quiz-aside"><div class="aside-card"><p class="eyebrow green">THINK IN THREE STEPS</p><h3>선택의 기준을 연결하세요.</h3><div class="decision-step"><b>1</b> 어디에 감염되었나?</div><div class="decision-step"><b>2</b> 어떤 균이며, 감수성은?</div><div class="decision-step"><b>3</b> 숙주와 투여 경로는?</div><p>혈중 농도와 감염 부위 농도는<br>서로 다를 수 있습니다.</p></div><div class="aside-card white"><p class="eyebrow green">THIS SESSION</p><div class="aside-count">${correct}<small>정답 / ${answered.length}문항 채점</small></div><p>건너뛴 문제는 미풀이로 남습니다.<br>문항별 최신 결과는 전체 진도에 반영됩니다.</p><button type="button" class="text-button" data-tab="review">오답 노트 확인 →</button></div></aside></div>`;
}
function renderSummary(){
  const answered=session.items.filter(i=>i.selected!==null),correct=answered.filter(i=>i.selected===i.answer).length,wrong=answered.length-correct;
  $('quizStage').innerHTML=`<article id="sessionSummary" class="summary-card" tabindex="-1"><p class="eyebrow green">SESSION COMPLETE</p><h2>한 세트를 마쳤습니다.</h2><p class="muted">${session.items.length}문항 중 ${answered.length}문항 채점 · ${session.items.length-answered.length}문항 건너뜀</p><div class="summary-score">${correct}<small> / ${answered.length} 정답</small></div><p class="muted">${answered.length?`채점한 문제의 정답률 ${Math.round(correct/answered.length*100)}%`:'채점한 문제가 없습니다.'} · 오답 ${wrong}문항</p><div class="summary-results">${session.items.map((i,n)=>`<button type="button" class="result-number ${i.selected===null?'':i.selected===i.answer?'correct':'wrong'}" data-jump="${n}" aria-label="${n+1}번 ${i.selected===null?'미풀이':i.selected===i.answer?'정답':'오답'} 확인">${n+1}</button>`).join('')}</div><div class="summary-actions"><button type="button" class="button primary" data-start="wrong" ${!stats(QUESTIONS,progress).wrong?'disabled':''}>오답만 다시 풀기 →</button><button type="button" class="button outline" data-start="again">현재 설정으로 새 세트</button><button type="button" class="text-button" data-tab="home">학습 허브로</button></div><p class="muted" style="margin-top:20px">번호를 누르면 해당 문제를 다시 확인할 수 있습니다.</p></article>`;
}
function answer(selected){
  if(activeTab!=='quiz'||!session||session.position>=session.items.length)return;
  const result=grade(session,progress,session.position,selected,QUESTIONS);if(result.duplicate)return;
  progress=result.progress;save(KEYS.progress,progress);save(KEYS.session,session);updateDashboard();updateEligible();renderSession();
  announce(result.correct?'정답입니다.':'오답입니다. 해설을 확인하세요.');
  requestAnimationFrame(()=>{const fb=document.querySelector('#quizStage .feedback');fb?.focus({preventScroll:true});});
}
function moveNext(){if(!session)return;session.position=Math.min(session.position+1,session.items.length);save(KEYS.session,session);renderSession();updateDashboard();focusQuestion();}
function toggleBookmark(id){
  if(!QUESTIONS.some(q=>q.id===id))return;
  bookmarks=bookmarks.includes(id)?bookmarks.filter(x=>x!==id):[...bookmarks,id];save(KEYS.bookmarks,bookmarks);
  document.querySelectorAll('[data-bookmark]').forEach(b=>{if(b.dataset.bookmark===id){const on=bookmarks.includes(id);b.textContent=on?'★':'☆';b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',on?'북마크 해제':'이 문제 북마크');}});
  updateEligible();announce(bookmarks.includes(id)?'북마크에 저장했습니다.':'북마크를 해제했습니다.');
}
function renderReview(){
  const records=allProgress(),s=stats(ALL_QUESTIONS,records),a=stats(QUESTIONS,progress),p=stats(PATH_QUESTIONS,pathologyUI?.getProgress()||{});
  $('retryAll').disabled=!a.wrong;$('retryAll').textContent=`항생제 오답 ${a.wrong} →`;
  $('pathRetryAll').disabled=!p.wrong;$('pathRetryAll').textContent=`병리 오답 ${p.wrong} →`;
  $('reviewSummary').innerHTML=`<span>전체 오답 <strong>${s.wrong}</strong></span><span>정답 <strong>${s.correct}</strong></span><span>미풀이 <strong>${s.unanswered}</strong></span><span class="muted">총 ${s.total}문항 · 단원별 최신 결과</span>`;
  for(const [name,bank,ui] of [['lecture',LECTURE_QUESTIONS,lectureUI],['drill',TABLE_QUESTIONS,drillUI]]){
    const count=stats(bank,ui?.getProgress()||{}).wrong;
    $(`${name}RetryAll`).disabled=!count;$(`${name}RetryAll`).textContent=`${name==='lecture'?'강의별':'표 암기'} 오답 ${count} →`;
  }
  const topic=$('reviewTopic').value,search=$('reviewSearch').value.toLocaleLowerCase().trim();
  const wrong=ALL_QUESTIONS.filter(q=>records[q.id]?.correct===false && (topic==='all'||q.topic===topic) && `${q.stem} ${q.choices.join(' ')} ${q.explanation}`.toLocaleLowerCase().includes(search));
  $('reviewCount').textContent=`${wrong.length}문항`;
  if(!wrong.length){$('reviewList').innerHTML=`<div class="empty-state"><span class="empty-icon" aria-hidden="true">${s.wrong?'⌕':'✓'}</span><h2>${s.wrong?'검색 조건에 맞는 오답이 없습니다.':'현재 남아 있는 오답이 없습니다.'}</h2><p>${s.wrong?'다른 주제를 고르거나 검색어를 바꾸어 보세요.':s.attempted?'아직 안 푼 문제나 북마크한 문제를 이어서 풀어 보세요.':'퀴즈를 풀면 틀린 문제가 이곳에 모입니다. 다시 맞히면 목록에서 빠집니다.'}</p><button type="button" class="button outline" data-tab="home">학습 단원 선택 →</button></div>`;return;}
  $('reviewList').innerHTML=wrong.map(q=>`<details class="review-item"><summary><span class="review-tags"><span class="pill${isPath(q)?' blue':''}">${q.id.startsWith('table-')?'표 암기':q.id.startsWith('lecture-')?'강의별':isPath(q)?'병리':'항생제'} · ${ALL_TOPICS[q.topic].title}</span><span class="format-tag">${q.format==='mcq'?'5지선다':'OX'} · ${q.id}</span></span>${emphasizePrompt(q.stem)}</summary><div class="review-body">${isPath(q)?imageMarkup(q):''}${q.choices.map((c,i)=>`<div class="review-choice${i===q.answer?' is-answer':''}${i===records[q.id].selected?' is-selected':''}">${escape(c)}${i===q.answer?'<small>정답</small>':''}${i===records[q.id].selected?'<small>내 선택</small>':''}</div>`).join('')}${explanation(q,false)}<div class="review-bottom"><button type="button" class="text-button" data-retry="${q.id}">이 문제 다시 풀기 →</button>${isPath(q)||isStudy(q)?'':`<button type="button" class="bookmark" data-bookmark="${q.id}" aria-pressed="${bookmarks.includes(q.id)}" aria-label="${bookmarks.includes(q.id)?'북마크 해제':'이 문제 북마크'}">${bookmarks.includes(q.id)?'★':'☆'}</button>`}</div></div></details>`).join('');
}
function oneQuestion(id){
  if(id.startsWith('lecture-')){lectureUI.retry(id);return;}
  if(id.startsWith('table-')){drillUI.retry(id);return;}
  if(id.startsWith('path-')){pathologyUI.retry(id);return;}
  const q=QUESTIONS.find(q=>q.id===id);if(!q)return;
  // A one-question retry keeps the bank ID, so a correct answer resolves its old mistake.
  if(session && session.position<session.items.length){pendingFilters={single:id,topic:q.topic,format:q.format,mode:'wrong',count:10};navigate('quiz');$('replacePrompt').hidden=false;$('confirmReplace').focus();return;}
  session=buildSession([q],{topic:q.topic,format:q.format,mode:'all',count:0},progress,Math.random,bookmarks);setFilters(session.filters);save(KEYS.session,session);navigate('quiz');focusQuestion();
}
function beginAction(name){
  if(name==='mixed')startSession({topic:'all',format:'all',mode:'all',count:20});
  if(name==='wrong')startSession({topic:'all',format:'all',mode:'wrong',count:0});
  if(name==='again')startSession(session?.filters||filters());
}

$('sourceLinks').innerHTML=Object.values(SOURCES).map(s=>`<a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)} ↗</a>`).join('');
$('quizSetup').addEventListener('submit',e=>{e.preventDefault();startSession(filters());});
for(const id of ['topicFilter','formatFilter','modeFilter','countFilter'])$(id).addEventListener('change',updateEligible);
$('confirmReplace').addEventListener('click',()=>{const f=pendingFilters;$('replacePrompt').hidden=true;pendingFilters=null;if(!f)return;if(f.single){session=null;oneQuestion(f.single);}else startSession(f,true);});
$('cancelReplace').addEventListener('click',()=>{$('replacePrompt').hidden=true;pendingFilters=null;focusQuestion();});
$('resumeButton').addEventListener('click',()=>{if(session)setFilters(session.filters||{});navigate('quiz');focusQuestion();});
$('retryAll').addEventListener('click',()=>beginAction('wrong'));
$('pathRetryAll').addEventListener('click',()=>pathologyUI.start({topic:'all',mode:'wrong',count:0}));
$('homePathTables').addEventListener('click',()=>{navigate('pathology');pathologyUI.show('tables');});
$('pathResumeButton').addEventListener('click',()=>pathologyUI.resume());
$('homeLectureStart').addEventListener('click',()=>lectureUI.start({topic:'all',mode:'all',count:20}));
$('homeDrillStart').addEventListener('click',()=>drillUI.start({topic:'all',mode:'all',count:0}));
$('lectureRetryAll').addEventListener('click',()=>lectureUI.start({topic:'all',mode:'wrong',count:0}));
$('drillRetryAll').addEventListener('click',()=>drillUI.start({topic:'all',mode:'wrong',count:0}));
$('reviewTopic').insertAdjacentHTML('beforeend',`<optgroup label="강의별 감별">${Object.entries(LECTURES).map(([id,t])=>`<option value="${id}">${t.order}. ${escape(t.title)}</option>`).join('')}</optgroup><optgroup label="표 암기">${Object.entries(TABLE_TOPICS).map(([id,t])=>`<option value="${id}">${escape(t.title)}</option>`).join('')}</optgroup>`);
$('reviewTopic').addEventListener('change',renderReview);$('reviewSearch').addEventListener('input',renderReview);
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.tab){navigate(b.dataset.tab);return;}
  if(b.dataset.start){beginAction(b.dataset.start);return;}
  if(b.dataset.topic){startSession({topic:b.dataset.topic,format:'all',mode:'all',count:20});return;}
  if(b.dataset.answer!==undefined){answer(Number(b.dataset.answer));return;}
  if(b.dataset.bookmark){toggleBookmark(b.dataset.bookmark);return;}
  if(b.dataset.retry){oneQuestion(b.dataset.retry);return;}
  if(b.dataset.jump!==undefined){session.position=Number(b.dataset.jump);save(KEYS.session,session);renderSession();focusQuestion();return;}
  if(b.dataset.action==='menu'){navigate('home');return;}
  if(b.dataset.action==='next'||b.dataset.action==='skip'){moveNext();return;}
  if(b.dataset.action==='previous' && session){session.position=Math.max(0,session.position-1);save(KEYS.session,session);renderSession();focusQuestion();}
});
document.querySelector('.main-nav [role=tablist]').addEventListener('keydown',e=>{
  const tabs=[...document.querySelectorAll('.main-nav [role=tab]')],i=tabs.indexOf(e.target);if(i<0)return;
  let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;
  e.preventDefault();navigate(tabs[n].dataset.tab,true);
});
document.addEventListener('keydown',e=>{
  if(e.defaultPrevented||e.ctrlKey||e.altKey||e.metaKey||e.repeat||activeTab!=='quiz'||!session||session.position>=session.items.length||!$('replacePrompt').hidden)return;
  if(e.target.closest('input,select,textarea,[role=tablist]'))return;
  const item=session.items[session.position];if(item.selected!==null)return;
  const q=QUESTIONS.find(q=>q.id===item.id);let selected;
  if(q.format==='mcq'&&/^[1-5]$/.test(e.key))selected=Number(e.key)-1;
  if(q.format==='ox'){if(['o','O','1'].includes(e.key))selected=0;if(['x','X','2'].includes(e.key))selected=1;}
  if(selected!==undefined){e.preventDefault();answer(selected);}
});
function followHash(){const tab=tabFromHash(location.hash);if(tab)navigate(tab);}
window.addEventListener('hashchange',followHash);
window.addEventListener('popstate',followHash);
window.addEventListener('storage',e=>{if(e.key===KEYS.progress){progress=readProgress(e.newValue,QUESTIONS);updateDashboard();updateEligible();if(activeTab==='review')renderReview();}if(e.key===KEYS.bookmarks){try{const b=JSON.parse(e.newValue);if(Array.isArray(b))bookmarks=b.filter(id=>QUESTIONS.some(q=>q.id===id));}catch{}updateEligible();}});
if(session)setFilters(session.filters||{});
$('antibioticTables').innerHTML=renderTables(ANTIBIOTIC_TABLES);
pathologyUI=createPathologyUI({read,save,openTab:navigate,announce,onChange(){updateDashboard();if(activeTab==='review')renderReview();}});
const studyChange=()=>{updateDashboard();if(activeTab==='review')renderReview();};
lectureUI=createStudyUI({id:'lectures',tab:'lectures',title:'강의별 감별 문제',subtitle:'16개 강의 · 짧은 키워드 선택지 · 증례와 특이 소견',bank:LECTURE_QUESTIONS,topics:LECTURES,read,save,openTab:navigate,onChange:studyChange,announce,isActive:()=>activeTab==='lectures'});
drillUI=createStudyUI({id:'drill',tab:'drill',title:'표 암기 반복 퀴즈',subtitle:'항생제 · 동정검사 · 독소 · 병리 · 매개체',bank:TABLE_QUESTIONS,topics:TABLE_TOPICS,read,save,openTab:navigate,onChange:studyChange,announce,isActive:()=>activeTab==='drill',drill:true});
navigate(tabFromHash(location.hash)||'home');
