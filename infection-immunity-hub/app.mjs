import {VIRAL_CASE_QUESTIONS,VIRAL_CASE_TOPIC} from './virus-case-bank.mjs?v=20261118b';
import {BACTERIAL_CASE_QUESTIONS,BACTERIAL_CASE_TOPIC} from './bacteria-case-bank.mjs?v=20261118a';
import {CBL_PAST_QUESTIONS,CBL_PAST_TOPICS} from './cbl-past-bank.mjs?v=20261118a';
import {originalPrompt,originalIndex,installOriginalViewer} from './cbl-original.mjs?v=20261118a';
import {createBookmarkUI} from './bookmark-ui.mjs?v=20261118a';
import {COURSE_GROUPS} from './course-catalog.mjs?v=20261118a';
import {installQuizKeyboard} from './quiz-keyboard.mjs?v=20261118a';
import {startContinuousSession,advanceContinuousSession,resumeContinuousSession,continuousProgress} from './continuous-queue.mjs?v=20261118b';
import {createRecallUI} from './recall-ui.mjs?v=20261118a';
import {emphasizeFeedback,emphasizePrompt} from './emphasis.mjs?v=20261118a';
import {QUESTIONS,TOPICS,SOURCES} from './bank.mjs?v=20261118a';
import {grade,stats,readProgress,readBookmarks,toggleBookmark as toggleSavedBookmark,tabFromHash,isCorrectChoice} from './logic.mjs?v=20261118a';
import {PATH_QUESTIONS,PATH_TOPICS,pathSource} from './pathology-bank.mjs?v=20261118a';
import {createPathologyUI,pathFeedback,imageMarkup} from './pathology-ui.mjs?v=20261118a';
import {ANTIBIOTIC_TABLES,renderTables} from './reference-tables.mjs?v=20261118a';
import {LECTURES,STUDY_TOPICS,DOCUMENTS,LECTURE_QUESTIONS,TABLE_QUESTIONS,TABLE_TOPICS} from './study-bank.mjs?v=20261118b';
import {createStudyUI,studyFeedback} from './study-ui.mjs?v=20261118b';
import {sourceText} from './study-core.mjs?v=20261118a';
import {practiceLayout,installEvidenceViewer} from './practice-layout.mjs?v=20261118a';

installEvidenceViewer();
installOriginalViewer();
const $=id=>document.getElementById(id);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEYS={progress:'infection-immunity.progress.v1',session:'infection-immunity.session.v1',bookmarks:'infection-immunity.bookmarks.v1'};
let memoryOnly=false;
const volatileStorage=new Map();
function storageNotice(){memoryOnly=true;$('saveStatus').textContent='이번 방문에서만 기록됩니다 · 브라우저 저장 불가';}
function read(key){if(memoryOnly&&volatileStorage.has(key))return volatileStorage.get(key);try{const value=localStorage.getItem(key);if(value===null)volatileStorage.delete(key);else volatileStorage.set(key,value);return value;}catch{storageNotice();return volatileStorage.get(key)??null;}}
function save(key,value){
  if(key.includes('.progress.')){let previous={};try{previous=JSON.parse(read(key))||{};}catch{}value={...previous,...value};}
  const encoded=JSON.stringify(value);volatileStorage.set(key,encoded);
  try{localStorage.setItem(key,encoded);}catch{storageNotice();}
  if(key.endsWith('.bookmarks.v1'))queueMicrotask(()=>window.dispatchEvent(new StorageEvent('storage',{key,newValue:encoded})));
}
let progress=readProgress(read(KEYS.progress),QUESTIONS);
let session=null;
let bookmarks=[];
try{const b=JSON.parse(read(KEYS.bookmarks));if(Array.isArray(b))bookmarks=[...new Set(b.filter(id=>QUESTIONS.some(q=>q.id===id)))];}catch{}
session=resumeContinuousSession(read(KEYS.session),QUESTIONS,progress,Math.random,bookmarks);
if(session)save(KEYS.session,session);
let activeTab='home';
const phaseTitle=phase=>phase==='wrong'?'오답 복습':phase==='review'?'직접 복습':'미풀이 학습';
let pathologyUI=null;
let lectureUI=null,drillUI=null,bookmarkUI=null,originalUI=null;
const ALL_QUESTIONS=[...QUESTIONS,...PATH_QUESTIONS,...LECTURE_QUESTIONS,...TABLE_QUESTIONS,...CBL_PAST_QUESTIONS];
const ALL_TOPICS={...TOPICS,...PATH_TOPICS,...STUDY_TOPICS,...TABLE_TOPICS,...CBL_PAST_TOPICS};
const BOOKMARK_GROUPS=[
 {id:'antibiotics',label:'항생제',key:KEYS.bookmarks,questions:QUESTIONS},
 {id:'pathology',label:'병리',key:'infection-immunity.pathology.bookmarks.v1',questions:PATH_QUESTIONS},
 {id:'lectures',label:'강의별',key:'infection-immunity.lectures.bookmarks.v1',questions:LECTURE_QUESTIONS},
 {id:'drill',label:'표 암기',key:'infection-immunity.drill.bookmarks.v1',questions:TABLE_QUESTIONS},
 {id:'cblpast',label:'CBL 기출',key:'infection-immunity.cblpast.bookmarks.v1',questions:CBL_PAST_QUESTIONS}
];
const isPath=q=>q.id.startsWith('path-');
const isStudy=q=>q.id.startsWith('lecture-')||q.id.startsWith('table-');
const allProgress=()=>({...progress,...pathologyUI?.getProgress(),...lectureUI?.getProgress(),...drillUI?.getProgress(),...originalUI?.getProgress()});

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
  $('bookmarkBadge').textContent=bookmarkUI?.count()||0;
  $('resumeButton').hidden=!session || session.position>=session.items.length;
  if(session){const pending=continuousProgress(QUESTIONS,session.filters,progress,bookmarks);$('resumeButton').textContent=`이어서 풀기 · 미풀이 ${pending.unanswered} · 오답 ${pending.wrong} →`;}
  const a=stats(QUESTIONS,progress),p=stats(PATH_QUESTIONS,pathologyUI?.getProgress()||{});
  $('abxCourseTrack').innerHTML=track(a);$('pathCourseTrack').innerHTML=track(p);
  $('abxCourseStats').textContent=`정답 ${a.correct} · 오답 ${a.wrong} · 미풀이 ${a.unanswered}`;
  $('pathCourseStats').textContent=`정답 ${p.correct} · 오답 ${p.wrong} · 미풀이 ${p.unanswered}`;
  $('pathCourseCount').textContent=`${PATH_QUESTIONS.length}문항`;
  for(const [id,topic,label] of [['pathImageCaption','path-image','조직 사진 감별'],['pathTraitsCaption','path-traits','옳은 것 / 옳지 않은 것'],['pathGeneralCaption','path-general','조직반응·방어·진단법']])$(''+id).textContent=`${label} · ${PATH_QUESTIONS.filter(q=>q.topic===topic).length}문항`;
  $('pathResumeButton').hidden=!pathologyUI?.hasSession();
  $('lectureResumeButton').hidden=!lectureUI?.hasSession();
  $('drillResumeButton').hidden=!drillUI?.hasSession();
  $('originalResumeButton').hidden=!originalUI?.hasSession();
  for(const [prefix,bank,ui] of [['lecture',LECTURE_QUESTIONS,lectureUI],['bacterialCase',BACTERIAL_CASE_QUESTIONS,lectureUI],['viralCase',VIRAL_CASE_QUESTIONS,lectureUI],['drill',TABLE_QUESTIONS,drillUI],['original',CBL_PAST_QUESTIONS,originalUI]]){
    const value=stats(bank,ui?.getProgress()||{});
    $(`${prefix}CourseStats`).textContent=`정답 ${value.correct} · 오답 ${value.wrong} · 미풀이 ${value.unanswered}`;
    $(`${prefix}CourseCount`).textContent=`${bank.length}문항`;
    const courseTrack=$(`${prefix}CourseTrack`);
    if(courseTrack){courseTrack.innerHTML=track(value);courseTrack.setAttribute('aria-label',`${value.total}문항 중 ${value.attempted}문항 풀이, 정답 ${value.correct}, 오답 ${value.wrong}`);}
  }
  $('libraryCount').innerHTML=`전체 <b>${ALL_QUESTIONS.length}문항</b>`;
  $('lectureCourseKicker').textContent=`${Object.values(COURSE_GROUPS).map(g=>g.title).join(' · ')} ${Object.keys(LECTURES).length}강`;
  if(!memoryOnly)$('saveStatus').innerHTML='<i aria-hidden="true"></i> 이 브라우저에 학습 기록 저장';
}
function navigate(tab,focus=false){
  if(!['home','quiz','pathology','lectures','drill','bookmarks','review','notes','cblpast'].includes(tab))tab='home';
  const changed=activeTab!==tab;
  activeTab=tab;
  for(const name of ['home','quiz','pathology','lectures','drill','bookmarks','review','notes','cblpast']){
    $(`panel-${name}`).hidden=name!==tab;
  }
  const mainTab=['bookmarks','review'].includes(tab)?tab:'home';
  for(const name of ['home','bookmarks','review']){const button=$(`tab-${name}`);if(name===mainTab)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');}
  if(location.hash!==`#${tab}`)history.pushState(null,'',`#${tab}`);
  if(tab==='quiz'&&changed){progress=readProgress(read(KEYS.progress),QUESTIONS);session=resumeContinuousSession(read(KEYS.session),QUESTIONS,progress,Math.random,bookmarks);if(session){setFilters(session.filters);save(KEYS.session,session);}}
  updateDashboard();
  if(tab==='quiz'){updateEligible();renderSession();}
  if(tab==='review')renderReview();
  if(tab==='bookmarks')bookmarkUI?.render();
  if(tab==='pathology')pathologyUI?.open();
  if(tab==='lectures')lectureUI?.open();
  if(tab==='drill')drillUI?.open();
  if(tab==='cblpast')originalUI?.open();
  if(changed)window.scrollTo({top:0,behavior:'auto'});
  if(focus)$(`tab-${mainTab}`).focus();
}
function filters(){return {topic:$('topicFilter').value,format:$('formatFilter').value,mode:$('modeFilter').value,count:0};}
function setFilters(f){$('topicFilter').value=f.topic||'all';$('formatFilter').value=f.format||'all';$('modeFilter').value=['all','unanswered','wrong','bookmarks'].includes(f.mode)?f.mode:'all';updateEligible();}
function updateEligible(){
  const f=filters(),s=continuousProgress(QUESTIONS,f,progress,bookmarks);
  $('eligibleCount').textContent=s.total?`선택 범위 전체 ${s.total}문항 · 미풀이 ${s.unanswered} → 오답 ${s.wrong} · 정답 ${s.correct}`:'선택 조건에 해당하는 문제가 없습니다';
}
function startSession(f={}){
  progress=readProgress(read(KEYS.progress),QUESTIONS);
  session=startContinuousSession(QUESTIONS,{...f,count:0},progress,Math.random,bookmarks,f.mode==='review'?null:session);
  setFilters(session.filters);save(KEYS.session,session);navigate('quiz');focusQuestion();
}
function focusQuestion(){requestAnimationFrame(()=>{const card=$('questionCard')||$('sessionSummary');if(card){card.focus({preventScroll:true});card.scrollIntoView({behavior:'auto',block:'nearest'});}});}
function renderSession(){
  const stage=$('quizStage');
  $('quizSettings').open=!(session&&session.phase!=='complete'&&session.position<session.items.length);
  if(!session){stage.innerHTML='<div class="empty-state"><span class="empty-icon" aria-hidden="true">✚</span><h2>미풀이부터 이어서 학습하세요.</h2><p>선택한 범위의 미풀이를 모두 푼 뒤 남은 오답을 복습합니다.<br>답을 고르면 해설과 강의 근거를 보여 드립니다.</p><button type="button" class="button primary" data-start="mixed">전체 문항 이어서 풀기 →</button></div>';return;}
  if(session.phase==='complete'||session.position>=session.items.length){renderSummary();return;}
  const item=session.items[session.position],q=QUESTIONS.find(q=>q.id===item.id),graded=item.selected!==null;
  const total=continuousProgress(QUESTIONS,session.filters,progress,bookmarks);session.queueCounts=total;
  const question=`<article id="questionCard" class="question-card" tabindex="-1" aria-labelledby="questionStem">
    <div class="q-top"><div class="q-tags"><span class="pill">${TOPICS[q.topic].title}</span><span class="format-tag">${q.format==='mcq'?'5지선다':'OX 퀴즈'}</span></div><button type="button" class="bookmark" data-bookmark="${q.id}" aria-pressed="${bookmarks.includes(q.id)}" aria-label="${bookmarks.includes(q.id)?'북마크 해제':'이 문제 북마크'}">${bookmarks.includes(q.id)?'★':'☆'}</button></div>
    <div class="session-line"><span>${phaseTitle(session.phase)} <b>${session.position+1}</b> / ${session.items.length}</span><span>전체 ${total.total} · 정답 ${total.correct} · 미풀이 ${total.unanswered} · 오답 ${total.wrong}</span></div><div class="session-track" aria-hidden="true"><span style="width:${total.total?total.correct/total.total*100:0}%"></span></div>
    <h2 id="questionStem" class="question-stem">${emphasizePrompt(q.stem)}</h2><p class="question-instruction">${graded?'채점 완료 · Enter로 다음 문제':q.format==='mcq'?'키보드 1–5로 답 선택 · 채점 후 Enter로 다음 문제':'OX · 키보드 1(O) / 2(X) · 채점 후 Enter로 다음 문제'}</p>
    <div class="choices${q.format==='ox'?' ox':''}" role="group" aria-labelledby="questionStem">${item.choices.map((c,i)=>{
      let cls='',label='';
      if(graded){if(i===item.answer){cls=' right';label='정답';}else if(i===item.selected){cls=' wrong';label='내 선택';}else cls=' dim';}
      return `<button type="button" class="choice${cls}" data-answer="${i}" ${graded?'disabled':''}><span class="choice-num" aria-hidden="true">${i+1}</span><span class="choice-copy">${escape(c)}</span>${label?`<span class="choice-label">${label}</span>`:''}</button>`;
    }).join('')}</div>
    <div class="question-actions"><button type="button" class="text-button" data-action="${session.position?'previous':'menu'}">${session.position?'← 이전 문제':'← 학습 허브'}</button>${graded?'<button type="button" class="button primary" id="nextQuestion" data-action="next">다음 문제 →</button>':'<button type="button" class="text-button" data-action="skip">건너뛰기 →</button>'}</div></article>`;
  stage.innerHTML=practiceLayout({question,feedback:graded?explanation(q,item.selected===item.answer):'',q,session,sourceLabel:source(q)});
}
function renderSummary(){
  const total=continuousProgress(QUESTIONS,session.filters,progress,bookmarks);session.queueCounts=total;
  const heading=!total.total?'선택한 범위에 문항이 없습니다.':session.filters.mode==='review'?'문항 복습을 마쳤습니다.':total.unanswered?'현재 남아 있는 오답을 모두 복습했습니다.':'선택한 범위를 모두 맞혔습니다.';
  $('quizStage').innerHTML=`<article id="sessionSummary" class="summary-card" tabindex="-1"><p class="eyebrow green">LEARNING COMPLETE</p><h2>${heading}</h2><p class="muted">선택 범위 전체 ${total.total}문항 · 정답 ${total.correct} · 미풀이 ${total.unanswered} · 오답 ${total.wrong}</p><div class="summary-score">${total.correct}<small> / ${total.total} 정답</small></div><div class="summary-actions">${total.unanswered||total.wrong?'<button type="button" class="button primary" data-start="again">미풀이 → 오답 이어서 학습 →</button>':''}${total.total?'<button type="button" class="button outline" data-start="review">선택 범위 직접 복습</button>':''}<button type="button" class="text-button" data-tab="home">학습 허브로</button></div><p class="muted" style="margin-top:20px">학습 기록은 문항별로 저장되며, 다시 돌아오면 남은 미풀이부터 이어집니다.</p></article>`;
}
function answer(selected){
  if(activeTab!=='quiz'||!session||session.position>=session.items.length)return;
  const result=grade(session,progress,session.position,selected,QUESTIONS);if(result.duplicate)return;
  progress=result.progress;session.queueCounts=continuousProgress(QUESTIONS,session.filters,progress,bookmarks);save(KEYS.progress,progress);save(KEYS.session,session);updateDashboard();updateEligible();renderSession();
  announce(result.correct?'정답입니다.':'오답입니다. 해설을 확인하세요.');
  requestAnimationFrame(()=>{const fb=document.querySelector('#quizStage .feedback');fb?.focus({preventScroll:true});});
}
function moveNext(){if(!session)return;session=advanceContinuousSession(session,progress,QUESTIONS,Math.random,bookmarks);save(KEYS.session,session);renderSession();updateDashboard();focusQuestion();}
function toggleBookmark(id){
  if(!QUESTIONS.some(q=>q.id===id))return;
  const saved=toggleSavedBookmark(read(KEYS.bookmarks),id);bookmarks=readBookmarks(JSON.stringify(saved),QUESTIONS);save(KEYS.bookmarks,saved);
  document.querySelectorAll('[data-bookmark]').forEach(b=>{if(b.dataset.bookmark===id){const on=bookmarks.includes(id);b.textContent=on?'★':'☆';b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',on?'북마크 해제':'이 문제 북마크');}});
  updateEligible();announce(bookmarks.includes(id)?'북마크에 저장했습니다.':'북마크를 해제했습니다.');
}
function renderReview(){
  const records=allProgress(),s=stats(ALL_QUESTIONS,records),a=stats(QUESTIONS,progress),p=stats(PATH_QUESTIONS,pathologyUI?.getProgress()||{});
  $('retryAll').disabled=!a.wrong;$('retryAll').textContent=`항생제 오답 ${a.wrong} →`;
  $('pathRetryAll').disabled=!p.wrong;$('pathRetryAll').textContent=`병리 오답 ${p.wrong} →`;
  $('reviewSummary').innerHTML=`<span>전체 오답 <strong>${s.wrong}</strong></span><span>정답 <strong>${s.correct}</strong></span><span>미풀이 <strong>${s.unanswered}</strong></span><span class="muted">총 ${s.total}문항 · 단원별 최신 결과</span>`;
  for(const [name,bank,ui] of [['lecture',LECTURE_QUESTIONS,lectureUI],['drill',TABLE_QUESTIONS,drillUI],['original',CBL_PAST_QUESTIONS,originalUI]]){
    const count=stats(bank,ui?.getProgress()||{}).wrong;
    $(`${name}RetryAll`).disabled=!count;$(`${name}RetryAll`).textContent=`${name==='lecture'?'강의별':name==='original'?'CBL 기출':'표 암기'} 오답 ${count} →`;
  }
  const topic=$('reviewTopic').value,search=$('reviewSearch').value.toLocaleLowerCase().trim();
  const wrong=ALL_QUESTIONS.filter(q=>records[q.id]?.correct===false && (topic==='all'||q.topic===topic) && `${q.stem} ${q.choices.join(' ')} ${q.explanation}`.toLocaleLowerCase().includes(search));
  $('reviewCount').textContent=`${wrong.length}문항`;
  if(!wrong.length){$('reviewList').innerHTML=`<div class="empty-state"><span class="empty-icon" aria-hidden="true">${s.wrong?'⌕':'✓'}</span><h2>${s.wrong?'검색 조건에 맞는 오답이 없습니다.':'현재 남아 있는 오답이 없습니다.'}</h2><p>${s.wrong?'다른 주제를 고르거나 검색어를 바꾸어 보세요.':s.attempted?'아직 안 푼 문제나 북마크한 문제를 이어서 풀어 보세요.':'퀴즈를 풀면 틀린 문제가 이곳에 모입니다. 다시 맞히면 목록에서 빠집니다.'}</p><button type="button" class="button outline" data-tab="home">학습 단원 선택 →</button></div>`;return;}
  $('reviewList').innerHTML=wrong.map(q=>`<details class="review-item"><summary><span class="review-tags"><span class="pill${isPath(q)?' blue':''}">${q.original?'CBL 기출':q.id.startsWith('table-')?'표 암기':q.id.startsWith('lecture-')?'강의별':isPath(q)?'병리':'항생제'} · ${ALL_TOPICS[q.topic].title}</span><span class="format-tag">${q.format==='mcq'?'5지선다':'OX'} · ${q.id}</span></span>${emphasizePrompt(q.stem)}</summary><div class="review-body">${q.original?originalPrompt(q):isPath(q)?imageMarkup(q):''}${q.choices.map((c,i)=>`<div class="review-choice${isCorrectChoice(q,c)?' is-answer':''}${i===records[q.id].selected?' is-selected':''}">${escape(c)}${isCorrectChoice(q,c)?'<small>정답</small>':''}${i===records[q.id].selected?'<small>내 선택</small>':''}</div>`).join('')}${explanation(q,false)}<div class="review-bottom"><button type="button" class="text-button" data-retry="${q.id}">이 문제 다시 풀기 →</button>${isPath(q)||isStudy(q)?'':`<button type="button" class="bookmark" data-bookmark="${q.id}" aria-pressed="${bookmarks.includes(q.id)}" aria-label="${bookmarks.includes(q.id)?'북마크 해제':'이 문제 북마크'}">${bookmarks.includes(q.id)?'★':'☆'}</button>`}</div></div></details>`).join('');
}
function oneQuestion(id){
  if(id.startsWith('lecture-cbl-past-')){originalUI.retry(id);return;}
  if(id.startsWith('lecture-')){lectureUI.retry(id);return;}
  if(id.startsWith('table-')){drillUI.retry(id);return;}
  if(id.startsWith('path-')){pathologyUI.retry(id);return;}
  const q=QUESTIONS.find(q=>q.id===id);if(!q)return;
  startSession({topic:q.topic,format:q.format,mode:'review',questionIds:[id],count:0});
}
function beginAction(name){
  if(name==='mixed')startSession({topic:'all',format:'all',mode:'all',count:0});
  if(name==='wrong')startSession({topic:'all',format:'all',mode:'wrong',count:0});
  if(name==='again'){const f=session?.filters||filters();startSession({...f,mode:f.mode==='bookmarks'?'bookmarks':'all',count:0});}
  if(name==='review')startSession({...session?.filters||filters(),mode:'review',count:0});
}

$('sourceLinks').innerHTML=Object.values(SOURCES).map(s=>`<a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)} ↗</a>`).join('');
$('quizSetup').addEventListener('submit',e=>{e.preventDefault();startSession(filters());});
for(const id of ['topicFilter','formatFilter','modeFilter'])$(id).addEventListener('change',updateEligible);
$('resumeButton').addEventListener('click',()=>{progress=readProgress(read(KEYS.progress),QUESTIONS);session=resumeContinuousSession(read(KEYS.session),QUESTIONS,progress,Math.random,bookmarks);if(session){setFilters(session.filters);save(KEYS.session,session);}navigate('quiz');focusQuestion();});
$('retryAll').addEventListener('click',()=>beginAction('wrong'));
$('pathRetryAll').addEventListener('click',()=>pathologyUI.start({topic:'all',mode:'wrong',count:0}));
$('homePathTables').addEventListener('click',()=>{navigate('pathology');pathologyUI.show('tables');});
$('pathResumeButton').addEventListener('click',()=>pathologyUI.resume());
$('homeLectureUnits').addEventListener('click',()=>lectureUI.choose('units'));
$('homeLectureStart').addEventListener('click',()=>lectureUI.choose('mixed'));
$('homeBacterialCases').addEventListener('click',()=>lectureUI.start({topic:BACTERIAL_CASE_TOPIC,mode:'all',count:0}));
$('homeBacterialCasesWrong').addEventListener('click',()=>lectureUI.start({topic:BACTERIAL_CASE_TOPIC,mode:'wrong',count:0}));
$('homeViralCases').addEventListener('click',()=>lectureUI.start({topic:VIRAL_CASE_TOPIC,mode:'all',count:0}));
$('homeViralCasesWrong').addEventListener('click',()=>lectureUI.start({topic:VIRAL_CASE_TOPIC,mode:'wrong',count:0}));
$('lectureResumeButton').addEventListener('click',()=>lectureUI.resume());
$('homeOriginalUnits').addEventListener('click',()=>originalUI.choose('units'));
$('homeOriginalMixed').addEventListener('click',()=>originalUI.choose('mixed'));
$('originalResumeButton').addEventListener('click',()=>originalUI.resume());
$('originalRetryAll').addEventListener('click',()=>originalUI.start({topic:'all',mode:'wrong',count:0}));
$('homeDrillStart').addEventListener('click',()=>drillUI.browse());
$('homeDrillMixed').addEventListener('click',()=>drillUI.start({topic:'all',mode:'all',count:0}));
$('drillResumeButton').addEventListener('click',()=>drillUI.resume());
$('lectureRetryAll').addEventListener('click',()=>lectureUI.start({topic:'all',mode:'wrong',count:0}));
$('drillRetryAll').addEventListener('click',()=>drillUI.start({topic:'all',mode:'wrong',count:0}));
$('reviewTopic').insertAdjacentHTML('beforeend',`<optgroup label="강의별 감별">${Object.entries(STUDY_TOPICS).map(([id,t])=>`<option value="${id}">${t.order?t.order+". ":""}${escape(t.title)}</option>`).join('')}</optgroup><optgroup label="표 암기">${Object.entries(TABLE_TOPICS).map(([id,t])=>`<option value="${id}">${escape(t.title)}</option>`).join('')}</optgroup>`);
$('reviewTopic').insertAdjacentHTML('beforeend',`<optgroup label="CBL 기출 원문">${Object.entries(CBL_PAST_TOPICS).map(([id,t])=>`<option value="${id}">${escape(t.title)}</option>`).join('')}</optgroup>`);
$('reviewTopic').addEventListener('change',renderReview);$('reviewSearch').addEventListener('input',renderReview);
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.tab){navigate(b.dataset.tab);return;}
  if(b.dataset.start){beginAction(b.dataset.start);return;}
  if(b.dataset.topic){startSession({topic:b.dataset.topic,format:'all',mode:'all',count:0});return;}
  if(b.dataset.answer!==undefined){answer(Number(b.dataset.answer));return;}
  if(b.dataset.bookmark){toggleBookmark(b.dataset.bookmark);return;}
  if(b.dataset.retry){oneQuestion(b.dataset.retry);return;}
  if(b.dataset.jump!==undefined){session.position=Number(b.dataset.jump);save(KEYS.session,session);renderSession();focusQuestion();return;}
  if(b.dataset.action==='menu'){navigate('home');return;}
  if(b.dataset.action==='next'||b.dataset.action==='skip'){moveNext();return;}
  if(b.dataset.action==='previous' && session){session.position=Math.max(0,session.position-1);save(KEYS.session,session);renderSession();focusQuestion();}
});
function followHash(){const tab=tabFromHash(location.hash);if(tab)navigate(tab);}
window.addEventListener('hashchange',followHash);
window.addEventListener('popstate',followHash);
window.addEventListener('storage',e=>{
  if(e.key===null)volatileStorage.clear();else if(e.newValue===null)volatileStorage.delete(e.key);else volatileStorage.set(e.key,e.newValue);
  if(e.key===KEYS.progress||e.key===null){progress=readProgress(e.newValue,QUESTIONS);if(session)session.queueCounts=continuousProgress(QUESTIONS,session.filters,progress,bookmarks);updateDashboard();updateEligible();if(activeTab==='review')renderReview();if(activeTab==='quiz')renderSession();}
  if(e.key===KEYS.bookmarks||e.key===null){bookmarks=readBookmarks(e.newValue,QUESTIONS);updateEligible();if(activeTab==='quiz')renderSession();}
  if(e.key===null){for(const group of BOOKMARK_GROUPS)window.dispatchEvent(new StorageEvent('storage',{key:group.key,newValue:read(group.key)}));}
  if(e.key===null||BOOKMARK_GROUPS.some(group=>group.key===e.key)){bookmarkUI?.render();updateDashboard();}
});
if(session)setFilters(session.filters||{});
$('antibioticTables').innerHTML=renderTables(ANTIBIOTIC_TABLES);
pathologyUI=createPathologyUI({read,save,openTab:navigate,announce,onChange(){updateDashboard();if(activeTab==='review')renderReview();}});
const studyChange=()=>{updateDashboard();if(activeTab==='review')renderReview();};
lectureUI=createStudyUI({id:'lectures',tab:'lectures',title:'강의별 감별 문제',subtitle:Object.entries(COURSE_GROUPS).map(([group,g])=>`${g.title} ${Object.values(LECTURES).filter(t=>t.group===group).length}강`).join(' · ')+' · 단원 통합',bank:LECTURE_QUESTIONS,topics:STUDY_TOPICS,read,save,openTab:navigate,onChange:studyChange,announce,isActive:()=>activeTab==='lectures'});
drillUI=createRecallUI({id:'drill',tab:'drill',title:'표 암기 반복 퀴즈',subtitle:Object.values(COURSE_GROUPS).map(g=>g.title).join(' · ')+' · 핵심 관계 반복',bank:TABLE_QUESTIONS,topics:TABLE_TOPICS,read,save,openTab:navigate,onChange:studyChange,announce,isActive:()=>activeTab==='drill',drill:true});
originalUI=createStudyUI({id:'cblpast',tab:'cblpast',originals:true,title:'CBL 기출 원문',subtitle:`CBL 1~6 · 원문 ${CBL_PAST_QUESTIONS.length}문항 · 캡처·OCR·선지별 해설`,bank:CBL_PAST_QUESTIONS,topics:CBL_PAST_TOPICS,courseGroups:{cbl:{title:'CBL 1~6'}},libraryIntro:originalIndex(CBL_PAST_QUESTIONS,CBL_PAST_TOPICS),read,save,openTab:navigate,onChange:studyChange,announce,isActive:()=>activeTab==='cblpast'});
bookmarkUI=createBookmarkUI({root:$('bookmarkContent'),groups:BOOKMARK_GROUPS,read,save,onRetry:oneQuestion,topicTitle:q=>ALL_TOPICS[q.topic]?.title||'',formatPrompt:emphasizePrompt,renderDetails(q){return `${q.original?originalPrompt(q):isPath(q)?imageMarkup(q):''}${q.choices.map((choice,index)=>`<div class="review-choice${isCorrectChoice(q,choice)?' is-answer':''}"><span>${index+1}. ${escape(choice)}</span>${isCorrectChoice(q,choice)?'<small>정답</small>':''}</div>`).join('')}${explanation(q,false)}`;},onChange(){updateDashboard();announce('별표를 해제했습니다.');}});
navigate(tabFromHash(location.hash)||'home');
installQuizKeyboard();

