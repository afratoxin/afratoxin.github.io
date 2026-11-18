import {createStudyUI} from './study-ui.mjs?v=20261118c';
import {COURSE_GROUPS} from './course-catalog.mjs?v=20261118c';
import {RECALL_SETS,RECALL_LECTURES,recallProgress} from './recall-catalog.mjs?v=20261118c';
import {DOCUMENTS} from './study-bank.mjs?v=20261118c';
const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function progressMarkup(s){return `<div class="recall-progress-line"><b>${s.attempted}<small> / ${s.total} 풀이</small></b><span>${s.percent}%</span></div><div class="unit-progress-track" role="progressbar" aria-label="풀이 진행도" aria-valuemin="0" aria-valuemax="${s.total}" aria-valuenow="${s.attempted}"><span class="unit-correct" style="width:${s.total?s.correct/s.total*100:0}%"></span><span class="unit-wrong" style="width:${s.total?s.wrong/s.total*100:0}%"></span></div><p class="unit-progress-results"><span>정답 <b>${s.correct}</b></span><span>오답 <b>${s.wrong}</b></span><span>미풀이 ${s.unanswered}</span></p>`;}

export function createRecallUI(options){
 const {bank,read,save,openTab,onChange}=options;
 const root=document.getElementById('drillContent'),prefsKey='infection-immunity.drill.library.v1';
 let prefs={group:'general',lecture:null,set:null};
 try{const stored=JSON.parse(read(prefsKey));if(stored&&COURSE_GROUPS[stored.group])prefs={...prefs,...stored};}catch{}
 if(prefs.lecture&&!RECALL_LECTURES[prefs.lecture])prefs.lecture=null;
 let engine;
 root.innerHTML='<section id="recallLibrary" class="recall-library" aria-label="강의별 표 암기"></section><section id="recallPractice" hidden><div id="drillPracticeContent" class="recall-practice-content"></div></section>';
 const library=document.getElementById('recallLibrary'),practice=document.getElementById('recallPractice');
 const persist=()=>save(prefsKey,prefs);
 const selectedSet=()=>RECALL_SETS[prefs.set];
 function renderLibrary(){
  const progress=engine?.getProgress()||{};
  if(!prefs.lecture){
   const lectures=Object.entries(RECALL_LECTURES).filter(([,t])=>t.group===prefs.group&&t.questionIds.length);
   library.innerHTML=`<div class="section-heading page-heading"><div><p class="eyebrow green">RECALL · CONTINUOUS LEARNING</p><h1>강의별 표 암기</h1><p class="muted">강의록 → 학습 범위 → 미풀이 전체 → 오답 복습</p></div><button type="button" class="text-button" data-recall-mixed>전체 이어 풀기 →</button></div><div class="lecture-group-controls" aria-label="암기 강의 분류">${Object.entries(COURSE_GROUPS).map(([group,g])=>`<button type="button" data-recall-group="${group}" aria-pressed="${group===prefs.group}">${e(g.title)} <small>${Object.values(RECALL_LECTURES).filter(t=>t.group===group).length}강</small></button>`).join('')}</div><p class="recall-guide">${e(COURSE_GROUPS[prefs.group].description)}<span>빈칸·대응 관계·짝 비교 중심</span></p><div class="recall-lecture-grid">${lectures.map(([code,t])=>`<button type="button" class="recall-lecture-card" data-recall-lecture="${code}"><span class="recall-lecture-label">${String(t.order).padStart(2,'0')} · ${e(t.teacher)}</span><b>${e(t.title)}</b><span class="recall-set-names">${t.sets.map(id=>e(RECALL_SETS[id].title)).join(' · ')}</span><span class="recall-lecture-count">${t.sets.length}개 묶음 · ${t.questionIds.length}문항</span>${progressMarkup(recallProgress(bank,progress,t.questionIds))}</button>`).join('')}</div>`;
   return;
  }
  const lecture=RECALL_LECTURES[prefs.lecture];
  if(!lecture.sets.includes(prefs.set))prefs.set=lecture.sets[0];
  const set=selectedSet(),s=recallProgress(bank,progress,set.questionIds);
  const sources=set.sourceRefs.map(ref=>`${DOCUMENTS[ref.doc]?.title||ref.doc} PDF ${ref.pages.join('·')}쪽`).join(' / ');
  library.innerHTML=`<button type="button" class="text-button recall-back" data-recall-list>← ${e(COURSE_GROUPS[lecture.group].title)} 강의 목록</button><div class="section-heading page-heading"><div><p class="eyebrow green">${e(COURSE_GROUPS[lecture.group].title)} · ${e(lecture.teacher)}</p><h1>${e(lecture.title)}</h1><p class="muted">${lecture.sets.length}개 묶음 · 외울 부분을 고르면 미풀이 전체 뒤 오답으로 이어집니다.</p></div><button type="button" class="button outline small" data-recall-whole-lecture>이 강의 전체</button></div><div class="recall-small-tabs" role="tablist" aria-label="${e(lecture.title)} 암기 부분">${lecture.sets.map(id=>`<button type="button" role="tab" id="recall-tab-${e(id)}" aria-controls="recall-set-panel" aria-selected="${id===prefs.set}" tabindex="${id===prefs.set?0:-1}" data-recall-set="${e(id)}">${e(RECALL_SETS[id].title)}<span>${RECALL_SETS[id].questionIds.length}</span></button>`).join('')}</div><article id="recall-set-panel" class="recall-set-panel" role="tabpanel" aria-labelledby="recall-tab-${e(prefs.set)}"><div class="recall-set-heading"><div><h2>${e(set.title)}</h2><p class="recall-focus">${e(set.focus)}${set.examLinked?'<span class="recall-exam">족보 유형 연결</span>':''}</p></div><strong>${set.questionIds.length}<small>문항</small></strong></div><dl class="recall-purpose"><div><dt>무엇을</dt><dd>${e(set.what)}</dd></div><div><dt>어떻게</dt><dd>${e(set.how)}</dd></div><div><dt>왜</dt><dd>${e(set.why)}</dd></div></dl><div class="recall-start-row"><div class="recall-set-progress">${progressMarkup(s)}</div><div class="recall-start-actions"><button type="button" class="button primary" data-recall-start="all">이 범위 이어 풀기 →</button><button type="button" class="button outline" data-recall-start="wrong" ${s.wrong?'':'disabled'}>오답 ${s.wrong}개</button><button type="button" class="text-button" data-recall-start="unanswered" ${s.unanswered?'':'disabled'}>미풀이 ${s.unanswered}개</button></div></div><p class="recall-source">${e(sources)}</p></article>`;
 }
 function showLibrary(){engine?.suspend();practice.hidden=true;library.hidden=false;renderLibrary();}
 function showPractice(){library.hidden=true;practice.hidden=false;}
 engine=createStudyUI({...options,contentId:'drillPracticeContent',scopes:RECALL_SETS,drill:true,onExit:showLibrary,openTab(tab){openTab(tab);showPractice();},isActive:()=>options.isActive()&&!practice.hidden,onChange(){renderLibrary();onChange();}});
 function startSet(mode){const set=selectedSet();if(!set)return;persist();engine.start({topic:'all',scope:set.id,questionIds:set.questionIds,mode,count:0});showPractice();}
 library.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.recallGroup){prefs={group:b.dataset.recallGroup,lecture:null,set:null};persist();renderLibrary();return;}
  if(b.dataset.recallLecture){prefs.lecture=b.dataset.recallLecture;prefs.set=RECALL_LECTURES[prefs.lecture].sets[0];persist();renderLibrary();return;}
  if(b.dataset.recallSet){prefs.set=b.dataset.recallSet;persist();renderLibrary();document.getElementById('recall-tab-'+prefs.set)?.focus({preventScroll:true});return;}
  if(b.hasAttribute('data-recall-list')){prefs.lecture=null;prefs.set=null;persist();renderLibrary();return;}
  if(b.dataset.recallStart){startSet(b.dataset.recallStart);return;}
  if(b.hasAttribute('data-recall-whole-lecture')){const t=RECALL_LECTURES[prefs.lecture];engine.start({topic:'all',questionIds:t.questionIds,mode:'all',count:0});showPractice();return;}
  if(b.hasAttribute('data-recall-mixed')){engine.start({topic:'all',mode:'all',count:0});showPractice();}
 });
 library.addEventListener('keydown',event=>{
  const button=event.target.closest('[role="tab"]');if(!button||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();const sets=RECALL_LECTURES[prefs.lecture].sets,i=sets.indexOf(prefs.set);
  prefs.set=event.key==='Home'?sets[0]:event.key==='End'?sets.at(-1):sets[(i+(event.key==='ArrowRight'?1:-1)+sets.length)%sets.length];persist();renderLibrary();document.getElementById('recall-tab-'+prefs.set)?.focus({preventScroll:true});
 });
 showLibrary();
 return {open(){if(engine.hasSession()){engine.open();showPractice();}else showLibrary();},browse(){openTab('drill');prefs.lecture=null;persist();showLibrary();},start(...args){engine.start(...args);showPractice();},resume(){engine.resume();showPractice();},retry(qid){engine.retry(qid);showPractice();},getProgress:()=>engine.getProgress(),hasSession:()=>engine.hasSession()};
}
