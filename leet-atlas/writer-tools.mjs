import {questionLabel} from './question-label.mjs?v=20261031-author-db1';
import {answerInfo} from './answer-notes.mjs?v=20261031-author-db1';
import {buildDesignProfile} from './design-profile.mjs?v=20261031-author-db1';
import {parseResearchBackup,researchBackup,mergeResearch,relatedQuestions} from './research-store.mjs?v=20261031-author-db1';
import {researchWorkspaceMarkup,selectionMarkdown,printableSelection,escapeHtml as esc} from './research-workspace.mjs?v=20261031-author-db1';
const LEVELS=[['rules','조건 상호작용'],['inference','추론 연결'],['distractors','선지 구별'],['visual','시각자료 해석']];
const uid=()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
const date=()=>new Date().toISOString();
export function downloadWriterFile(name,text,type='application/json'){
 const url=URL.createObjectURL(new Blob([text],{type:`${type};charset=utf-8`})),link=document.createElement('a');
 link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function createWriterTools({state,store,main,toast,navigate,filteredQuestions,saveReview,restoreReviews,runSearch,getImage,ensureImages,copySearch,download=downloadWriterFile,document:documentRef=globalThis.document}){
 const document=documentRef;
 const dialog=document.querySelector('#writer-dialog');let pending;
 const questionIds=new Set(state.questions.keys());
 const backup=()=>researchBackup(store.state,state.reviews);
 function update(change){store.update(change);if(store.error)toast(store.error);if(state.route.view==='workspace')renderPage();renderSelection();}
 function designMarkup(q){
  const {profile}=buildDesignProfile(q),saved=state.reviews[q.id]?.designReview||{};
  return `<details class="writer-design-panel"><summary>출제 부담 검토 · ${saved.updatedAt?'내 평가 있음':'내 평가 미입력'}</summary><p>자동 관찰값과 출제자의 판단을 구분합니다. 아래 평가는 실제 응시자 정답률·변별도가 아닙니다.</p><dl class="design-observations"><div><dt>문자 자료 분량</dt><dd>${profile.reading.chars}자</dd></div><div><dt>조건 표현</dt><dd>${profile.conditions.markerCount}곳 · 실제 상호작용은 직접 검토</dd></div><div><dt>정량 처리 단서</dt><dd>${esc(profile.quantitative.labels.join(' · ')||'별도 단서 미확인')}</dd></div><div><dt>시각자료</dt><dd>${profile.visual.referenceDetected||profile.visual.possibleMissingOptions?'자료 확인 필요 · 자동 부담 미측정':'시각 부담 자동 판정 없음'}</dd></div></dl><details><summary>평가 기준 1~5</summary><p>조건: 단일 직접 적용(1) → 독립 조건(2) → 조건 결합·예외(3) → 다중 결합·경계(4) → 복잡한 분기·역추론(5). 추론: 직접 대응(1) → 단일 변환(2) → 연쇄 연결(3) → 경우·반례 결합(4) → 여러 표현·모형을 왕복(5). 선지: 직접 대조(1) → 한정어 구별(2) → 유사 오독 비교(3) → 복수 논점 결합(4) → 강한 오답 유인을 모두 배제(5). 시각자료: 없음(1) → 단순 읽기(2) → 관계 비교(3) → 다단 변환(4) → 복수 도식·자료 통합(5).</p></details><form data-design-review="${esc(q.id)}"><div class="design-rating-grid">${LEVELS.map(([key,label])=>`<label>${label}<select name="${key}"><option value="">미평가</option>${[1,2,3,4,5].map(n=>`<option value="${n}" ${Number(saved[key])===n?'selected':''}>${n}</option>`).join('')}</select></label>`).join('')}<label>예상 풀이 시간(분)<input name="expectedMinutes" type="number" min="0.1" max="60" step="0.1" value="${esc(saved.expectedMinutes||'')}"></label></div><label>판단 근거·경계 사례<textarea name="reason" rows="2" maxlength="10000">${esc(saved.reason||'')}</textarea></label><button class="button button-sage" type="submit">내 설계 평가 저장</button></form></details>`;
 }
 function relatedMarkup(q){return `<details class="writer-related"><summary>출제 구조를 비교할 기출 찾기</summary>${[['logic','같은 논리 · 다른 소재'],['material','같은 소재 · 다른 작업']].map(([mode,label])=>`<h3>${label}</h3>${relatedQuestions(q,state.data.questions,mode,{limit:4}).map(item=>`<article><a href="#/question/${esc(item.question.id)}">${esc(questionLabel(item.question))} · ${esc(item.question.title)}</a><p>${esc(item.reason)}</p><button class="button-text" data-compare-id="${esc(item.question.id)}">비교에 담기</button></article>`).join('')||'<p>현재 분류에서 연결되는 문항이 없습니다.</p>'}`).join('')}</details>`;}
 function comparisonProfile(q){const {profile:p}=buildDesignProfile(q),review=state.reviews[q.id]?.designReview;return {dimensions:{reading:{label:'원문',labelValue:`${p.reading.chars}자`},conditions:{label:'조건 단서',labelValue:`${p.conditions.markerCount}곳`},comparison:{label:'선지',labelValue:p.comparison.optionChars===null?'그림 포함 · 미측정':`${p.comparison.optionChars}자`},manual:{label:'내 설계 평가',labelValue:review?LEVELS.map(([key,label])=>`${label} ${review[key]||'미평가'}`).join(' · '):'미입력'}}};}
 function renderPage(){document.title='출제 자료실 · LEET Atlas';main.innerHTML=researchWorkspaceMarkup({archive:state.data,research:store.state,registry:state.answerRegistry,profileOf:comparisonProfile});}
 function renderSelection(){
  const bar=document.querySelector('#writer-selection-bar');if(!bar)return;
  const count=state.selectedIds.size,comparisons=store.state.compareIds.length;bar.hidden=!count&&!comparisons;
  bar.innerHTML=`<strong>선정 ${count}개 · 비교 ${comparisons}/4</strong><button class="button button-sage" data-selection-save>자료 묶음에 담기</button><button class="button button-quiet" data-selection-compare>선정 문항 비교</button><a class="button button-quiet" href="#/workspace">출제 자료실</a><button class="button-text" data-selection-clear>선정 해제</button>`;
 }
 function openDialog(kind,ids=[]){
  pending={kind,ids:[...new Set(ids)].filter(id=>questionIds.has(id))};
  const q=state.questions.get(ids[0]),sets=store.state.sets;
  const titles={collection:'출제 자료 묶음에 담기',search:'검색 조건 저장',issue:'검토 쟁점 기록'};
  dialog.innerHTML=`<div class="workspace-heading"><h2 id="writer-dialog-title">${titles[kind]}</h2><button class="button-text" data-writer-dialog-close aria-label="작업 창 닫기">닫기</button></div>${kind==='collection'?`<p>${pending.ids.length}개 문항을 자료 묶음으로 관리합니다.</p><label>기존 묶음<select id="writer-target-set"><option value="">새 자료 묶음</option>${sets.map(set=>`<option value="${esc(set.id)}">${esc(set.name)}</option>`).join('')}</select></label>`:''}${kind==='issue'?`<p>${q?esc(questionLabel(q)):''}</p><label>검토 종류<select id="writer-issue-type"><option>답안·최종 처리</option><option>원문·수식·도식</option><option>해설 논리</option><option>분류·검색</option><option>출제 설계</option></select></label><label>근거와 확인할 내용<textarea id="writer-note" rows="5" maxlength="20000"></textarea></label>`:`<label>${kind==='search'?'저장 검색 이름':'새 묶음 이름'}<input id="writer-name" maxlength="120" value="${kind==='search'?esc(state.query.slice(0,60)):''}" placeholder="예: 조건 역전형 법률 문항"></label>${kind==='collection'?'<label>출제 의도·메모<textarea id="writer-note" rows="2" maxlength="20000"></textarea></label>':''}`}<p id="writer-dialog-error" role="status"></p><button class="button button-sage" data-writer-confirm>저장</button>`;
  dialog.showModal();(dialog.querySelector('input')||dialog.querySelector('textarea')||dialog.querySelector('select'))?.focus();
 }
 function confirmDialog(){
  try{
   const name=dialog.querySelector('#writer-name')?.value.trim(),note=dialog.querySelector('#writer-note')?.value.trim()||'';
   if(pending.kind==='collection'){
    const selected=dialog.querySelector('#writer-target-set').value;
    if(!selected&&!name)throw new Error('새 자료 묶음 이름을 입력해 주세요.');
    update(data=>{const existing=data.sets.find(set=>set.id===selected);if(existing){existing.ids=[...new Set([...existing.ids,...pending.ids])];if(note)existing.notes+=(existing.notes?'\n':'')+note;existing.updatedAt=date();}else data.sets.push({id:uid(),name,ids:pending.ids,notes:note,updatedAt:date()});});
   }else if(pending.kind==='search'){
    if(!name)throw new Error('저장 검색 이름을 입력해 주세요.');
    update(data=>data.savedSearches.push({id:uid(),name,query:state.query,mode:state.searchMode,tags:[...new Set([...(state.route.tags||[]),...(state.route.view==='tag'?[state.route.id]:[])])],excludedTags:state.route.excludedTags||[],tagMode:state.route.tagMode}));
   }else{
    if(!note)throw new Error('확인할 근거와 내용을 입력해 주세요.');
    update(data=>data.issues.unshift({id:uid(),questionId:pending.ids[0],type:dialog.querySelector('#writer-issue-type').value,body:note,status:'open',createdAt:date(),updatedAt:date(),history:[{date:date(),action:'검토 쟁점 등록'}]}));
   }
   dialog.close();toast(store.error||'출제 자료에 저장했습니다.');
  }catch(error){dialog.querySelector('#writer-dialog-error').textContent=error.message;}
 }
 async function exportSet(id,format){
  try{
   const set=store.state.sets.find(item=>item.id===id);if(!set)return;
   const questions=set.ids.map(id=>state.questions.get(id));if(!questions.length)throw new Error('먼저 문항을 담아 주세요.');
   const title=set.name,filename=title.replace(/[\\/:*?"<>|]/g,'_').slice(0,80);
   if(format==='json'){download(`${filename}.json`,JSON.stringify({kind:'leet-reference-set',schemaVersion:1,set,questions,answerExceptions:state.answerRegistry.records.filter(r=>set.ids.includes(r.questionId))},null,2));return;}
   if(format==='markdown'){download(`${filename}.md`,selectionMarkdown(questions,{registry:state.answerRegistry,title}),'text/markdown');return;}
   toast('인쇄 자료를 준비하고 있습니다.');
   const prepared=format==='print-source'?await ensureImages(questions):null;
   const images=prepared||new Map(questions.map(q=>[q.id,getImage(q)]));
   const sourceBounds=Object.fromEntries(Object.entries(state.imageBounds).filter(([id])=>!state.localSources.has(id)));
   download(`${filename}-${format==='print-source'?'원문':'해설'}.html`,printableSelection(questions,{registry:state.answerRegistry,title,solutions:format==='print-solution',images,bounds:sourceBounds}),'text/html');
   toast('인쇄용 HTML을 내려받았습니다. 파일을 열어 인쇄/PDF로 저장하세요.');
  }catch(error){toast(error.message);}
 }
 async function restoreFile(file){
  try{if(file.size>6000000)throw new Error('백업은 6MB 이하로 선택해 주세요.');const imported=parseResearchBackup(await file.text(),questionIds);download('leet-복원전-백업.json',backup());const merged=mergeResearch(store.state,imported.research);update(data=>Object.assign(data,merged));const reviewsSaved=restoreReviews(imported.reviews);toast(store.error||(reviewsSaved===false?'검수 기록은 현재 화면에 복원됐지만 브라우저 저장에 실패했습니다. 백업 파일을 보관해 주세요.':'기존 자료에 백업을 합쳤습니다. 복원 전 파일도 내려받았습니다.'));if(state.route.view==='workspace')renderPage();}catch(error){toast(`복원하지 않았습니다: ${error.message}`);}
 }
 function handleClick(button){
  const d=button.dataset;
  if(button.hasAttribute('data-compare-id')){const id=d.compareId;if(!questionIds.has(id))return true;const ids=store.state.compareIds;if(ids.includes(id))update(data=>data.compareIds=data.compareIds.filter(v=>v!==id));else if(ids.length>=4){toast('비교는 최대 4개입니다. 자료실에서 하나를 제외해 주세요.');return true;}else update(data=>data.compareIds.push(id));toast(store.error||'비교 목록을 갱신했습니다.');return true;}
  if(button.hasAttribute('data-collect-id')){openDialog('collection',[d.collectId]);return true;}
  if(button.hasAttribute('data-writer-issue')){openDialog('issue',[d.writerIssue]);return true;}
  if(button.hasAttribute('data-research-create-set')){openDialog('collection');return true;}
  if(button.hasAttribute('data-writer-save-search')){openDialog('search');return true;}
  if(button.hasAttribute('data-writer-confirm')){confirmDialog();return true;}
  if(button.hasAttribute('data-writer-dialog-close')){dialog.close();return true;}
  if(button.hasAttribute('data-writer-backup')){download('leet-출제자료-백업.json',backup());return true;}
  if(button.hasAttribute('data-copy-search')){copySearch();return true;}
  if(button.hasAttribute('data-selection-save')){if(!state.selectedIds.size)toast('먼저 문항을 선정해 주세요.');else openDialog('collection',[...state.selectedIds]);return true;}
  if(button.hasAttribute('data-selection-compare')){if(state.selectedIds.size<1||state.selectedIds.size>4)toast('비교할 문항을 1~4개 선정해 주세요.');else{update(data=>data.compareIds=[...state.selectedIds]);navigate({view:'workspace'});}return true;}
  if(button.hasAttribute('data-selection-clear')){state.selectedIds.clear();document.querySelectorAll('[data-select-question]').forEach(input=>input.checked=false);renderSelection();return true;}
  if(button.hasAttribute('data-select-visible')){document.querySelectorAll('[data-select-question]').forEach(input=>{state.selectedIds.add(input.dataset.selectQuestion);input.checked=true;});renderSelection();return true;}
  if(button.hasAttribute('data-research-clear-compare')){update(data=>data.compareIds=[]);return true;}
  if(button.hasAttribute('data-research-delete-set')){if(confirm('이 자료 묶음을 삭제할까요? 기출과 검수 기록은 유지됩니다.'))update(data=>data.sets=data.sets.filter(set=>set.id!==d.researchDeleteSet));return true;}
  if(button.hasAttribute('data-set-remove')){update(data=>{const set=data.sets.find(item=>item.id===d.setRemove);if(set)set.ids=set.ids.filter(id=>id!==d.questionId);});return true;}
  if(button.hasAttribute('data-set-export')){void exportSet(d.setExport,d.format);return true;}
  if(button.hasAttribute('data-research-run-search')){const search=store.state.savedSearches.find(s=>s.id===d.researchRunSearch);if(search)runSearch(search);return true;}
  if(button.hasAttribute('data-research-delete-search')){update(data=>data.savedSearches=data.savedSearches.filter(s=>s.id!==d.researchDeleteSearch));return true;}
  if(button.hasAttribute('data-research-export-issues')){download('leet-검토쟁점.json',JSON.stringify({kind:'leet-review-issues',issues:store.state.issues},null,2));return true;}
  if(button.hasAttribute('data-research-resolve')){update(data=>{const issue=data.issues.find(v=>v.id===d.researchResolve);if(issue){issue.status=issue.status==='resolved'?'open':'resolved';issue.updatedAt=date();issue.history.push({date:date(),action:issue.status==='resolved'?'검토 완료 표시':'검토 재개'});}});return true;}
  return false;
 }
 function handleChange(event){const target=event.target,d=target.dataset;
  if(target.hasAttribute('data-select-question')){if(target.checked)state.selectedIds.add(d.selectQuestion);else state.selectedIds.delete(d.selectQuestion);renderSelection();}
  if(target.hasAttribute('data-set-name')||target.hasAttribute('data-set-notes')){const id=d.setName||d.setNotes;try{update(data=>{const set=data.sets.find(v=>v.id===id);if(set){if(d.setName)set.name=target.value.trim();else set.notes=target.value;set.updatedAt=date();}});}catch(error){toast(error.message);}}
  if(['writer-backup-input','header-backup-input'].includes(target.id)&&target.files?.[0])void restoreFile(target.files[0]);
 }
 function handleSubmit(event){const form=event.target;if(!form.matches('[data-design-review]'))return;event.preventDefault();const values=new FormData(form),result={updatedAt:date(),basis:'writer-review',reason:String(values.get('reason')||'').trim()};for(const [key] of LEVELS){const v=values.get(key);result[key]=v?Number(v):null;}result.expectedMinutes=values.get('expectedMinutes')?Number(values.get('expectedMinutes')):null;if(!result.reason||!LEVELS.some(([key])=>result[key])){toast('한 항목 이상 평가하고 판단 근거를 적어 주세요.');return;}if(result.expectedMinutes!==null&&(!(result.expectedMinutes>0)||result.expectedMinutes>60)){toast('예상 시간은 0분 초과 60분 이하로 적어 주세요.');return;}const saved=saveReview(form.dataset.designReview,{designReview:result});toast(saved===false?'출제 부담 평가를 브라우저에 저장하지 못했습니다. 현재 화면의 기록을 백업해 주세요.':'내 출제 부담 평가를 저장했습니다.');}
 return {renderPage,renderSelection,designMarkup,relatedMarkup,handleClick,handleChange,handleSubmit,restoreFile};
}
