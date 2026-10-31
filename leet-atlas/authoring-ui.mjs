import {PROJECT_KEY,REVIEW_CRITERIA,AXIS_LABELS,buildCreationPrompt,referenceBlueprint,parseDraft,parseProject,inspectDraft,withDraft,draftMarkdown} from './authoring.mjs?v=20261031-author2';
import {rankReferences} from './reference-search.mjs?v=20261026-general-search4';
import {createSemanticSearch} from './semantic-search.mjs?v=20261026-general-search4';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const circle=['','①','②','③','④','⑤'];
function downloadFile(name,text,type='application/json'){
 const url=URL.createObjectURL(new Blob([text],{type:`${type};charset=utf-8`}));
 const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function createAuthoringWorkspace(root,{archive,storage,semanticSearch,semanticFactory=createSemanticSearch,download=downloadFile,clipboard=globalThis.navigator?.clipboard,hash=''}={}){
 const taxonomy=archive.taxonomy,questions=new Map(archive.questions.map(q=>[q.id,q]));
 let project={schemaVersion:1,kind:'leet-authoring-project',brief:'',designNotes:'',referenceIds:[],draft:null,humanReview:{}};
 const state={prompt:'',matches:[],searchedBrief:'',searching:false,message:'',searchMessage:'',storageFailed:!storage,rawResponse:'',semanticFailed:false};
 let sequence=0,client=semanticSearch,disposed=false;
 try{const saved=storage?.getItem(PROJECT_KEY);if(saved)project=parseProject(saved,taxonomy,new Set(questions.keys()));}catch{state.storageFailed=true;state.message='저장한 작업을 읽지 못했습니다. 내보낸 작업 파일이 있다면 불러와 주세요.';}
 const entry=new URLSearchParams(hash.replace(/^#/,''));
 if(entry.has('brief'))project.brief=entry.get('brief').slice(0,10000);
 const requested=entry.get('ref');
 if(questions.has(requested)&&!project.referenceIds.includes(requested)){
  if(project.referenceIds.length<5)project.referenceIds.push(requested);else state.message='참고 기출은 최대5개입니다. 하나를 제외한 뒤 다시 추가해 주세요.';
 }
 function save(){
  try{if(!storage)throw new Error();storage.setItem(PROJECT_KEY,JSON.stringify(project));state.storageFailed=false;}catch{state.storageFailed=true;}
  const label=root.querySelector?.('#author-save-status');if(label)label.textContent=state.storageFailed?'브라우저 저장에 실패했습니다. 화면 작업은 유지됩니다. 작업 JSON을 내려받아 보관하세요.':'이 브라우저에 저장됨 · 다른 기기로 옮길 때는 작업 JSON을 내려받으세요.';
 }
 function invalidatePrompt(){state.prompt='';const field=root.querySelector?.('#creation-prompt');if(field)field.value='';const label=root.querySelector?.('#prompt-status');if(label)label.textContent='입력·참고 자료가 바뀌었습니다. 프롬프트를 다시 만들어 주세요.';}
 function setBrief(value){project.brief=String(value).slice(0,10000);sequence++;state.searching=false;state.matches=[];state.searchedBrief='';state.searchMessage='내용을 수정했습니다. 참고 기출 찾기를 눌러 주세요.';invalidatePrompt();save();const status=root.querySelector?.('#creation-search-status');if(status)status.textContent=state.searchMessage;const results=root.querySelector?.('#creation-search-results');if(results)results.innerHTML='';}
 function setNotes(value){project.designNotes=String(value).slice(0,20000);invalidatePrompt();save();}
 function select(id){
  if(!questions.has(id))return;
  if(project.referenceIds.includes(id))project.referenceIds=project.referenceIds.filter(v=>v!==id);
  else if(project.referenceIds.length<5)project.referenceIds.push(id);
  else{state.message='참고 기출은 최대5개입니다. 먼저 하나를 제외해 주세요.';render();return;}
  invalidatePrompt();save();render();
 }
 async function search(){
  const brief=project.brief.trim(),request=++sequence;
  if(!brief){state.message='만들고 싶은 문항의 요소를 적어 주세요.';render();return;}
  state.searchedBrief=brief;state.searching=true;state.semanticFailed=false;state.searchMessage='관련 표현으로 후보를 찾았습니다. 전체 문항과 문장 의미를 비교합니다.';
  state.matches=rankReferences(archive.questions,brief).slice(0,12);render();
  if(/^(?:p\d{3}|\d{4})$/i.test(brief)){state.searching=false;state.searchMessage='문항번호가 일치하는 기출입니다.';render();return;}
  try{
   if(!client){
    let created;
    created=semanticFactory({onStatus(status){
     const owns=client===created;
     if(status.state==='fallback'){created?.dispose?.();if(owns)client=null;}
     if(!owns||!state.searching||state.searchedBrief!==project.brief.trim())return;
     if(status.state==='fallback'){state.semanticFailed=true;state.searchMessage='의미 검색을 준비하지 못해 관련 표현·분류로 찾았습니다. 다시 시도할 수 있습니다.';}
     else if(status.state==='loading')state.searchMessage='처음 한 번 의미 검색 자료를 준비합니다. 모델 약118MB와 실행 자료를 내려받습니다.';
     else if(status.state==='searching')state.searchMessage='원문·해설과 문장 의미를 비교합니다.';
     const node=root.querySelector?.('#creation-search-status');if(node)node.textContent=state.searchMessage;
    }});
    client=created;
   }
   const scores=await client.search(brief);
   if(disposed||request!==sequence)return;
   if(!state.semanticFailed){state.matches=rankReferences(archive.questions,brief,{semanticScores:scores}).slice(0,12);
   state.searchMessage=scores.size?'문장 의미와 원문·해설을 비교한 참고 후보입니다. 채택할 논리는 아래 근거를 확인하세요.':'의미 비교 결과가 없어 관련 표현·분류로 찾았습니다. 표현을 바꾸어 다시 검색할 수 있습니다.';}
  }catch{if(disposed||request!==sequence)return;state.searchMessage='의미 검색을 준비하지 못해 관련 표현·분류로 찾았습니다. 다시 시도할 수 있습니다.';client?.dispose?.();client=null;}
  if(request===sequence&&!disposed){state.searching=false;render();}
 }
 function createPrompt(){
  try{state.prompt=buildCreationPrompt({brief:project.brief,designNotes:project.designNotes,questions:project.referenceIds.map(id=>questions.get(id)),taxonomy,draft:project.draft,humanReview:project.humanReview});state.message='프롬프트를 만들었습니다. 복사해 ChatGPT에 붙여 넣고, 응답 JSON을 아래에 가져오세요.';}
  catch(error){state.prompt='';state.message=error.message;}
  render();return state.prompt;
 }
 function importDraft(text){
  state.rawResponse=text;invalidatePrompt();
  try{const next=parseDraft(text,taxonomy);project=withDraft(project,next);state.rawResponse=JSON.stringify(next,null,2);state.importError='';invalidatePrompt();save();state.message='초안·분류·AI 자체 검토를 가져왔습니다. 아래에서 독립적으로 확인해 주세요.';render();return true;}
  catch(error){state.importError=error.message;state.message=`초안을 반영하지 못했습니다: ${error.message} 기존 초안은 유지됩니다. 응답 보완·독립 재검토 프롬프트로 수정을 요청할 수 있습니다.`;render();return false;}
 }
 function repairPrompt(){
  try{state.prompt=buildCreationPrompt({brief:project.brief,designNotes:project.designNotes,questions:project.referenceIds.map(id=>questions.get(id)),taxonomy,rejectedResponse:state.rawResponse,validationError:state.importError});if(!state.rawResponse.trim())throw new Error('보완할 응답을 먼저 붙여 넣어 주세요.');state.message='응답 보완 프롬프트를 만들었습니다. 위 프롬프트 칸에서 복사해 ChatGPT의 새 채팅에서 독립 재검토를 요청하세요.';}
  catch(error){state.prompt='';state.message=error.message;}render();return state.prompt;
 }
 function importProject(text){
  try{const next=parseProject(text,taxonomy,new Set(questions.keys()));project=next;sequence++;state.searching=false;state.matches=[];state.searchedBrief='';state.importError='';state.rawResponse=project.draft?JSON.stringify(project.draft,null,2):'';invalidatePrompt();save();state.message='제작 작업을 복원했습니다.';render();return true;}
  catch(error){state.message=`작업을 불러오지 못했습니다: ${error.message} 현재 작업은 유지됩니다.`;render();return false;}
 }
 function confirmReview(id,checked){if(REVIEW_CRITERIA.some(c=>c.id===id)){project.humanReview={...project.humanReview,[id]:checked===true};invalidatePrompt();save();const node=root.querySelector?.('#human-review-count');if(node)node.textContent=Object.values(project.humanReview).filter(Boolean).length;}}
 const exportProject=()=>JSON.stringify(project,null,2);
 function newProject(){
  try{if(project.brief||project.designNotes||project.referenceIds.length||project.draft)download('leet-authoring-backup.json',exportProject());}
  catch{state.message='현재 작업을 백업하지 못해 그대로 유지했습니다. 작업 JSON을 먼저 내려받아 주세요.';render();return false;}
  sequence++;project={schemaVersion:1,kind:'leet-authoring-project',brief:'',designNotes:'',referenceIds:[],draft:null,humanReview:{}};
  Object.assign(state,{prompt:'',rawResponse:'',importError:'',matches:[],searchedBrief:'',searching:false,searchMessage:'',message:'이전 작업을 파일로 백업하고 새 작업을 시작했습니다.'});save();render();return true;
 }
 function draftView(){
  const d=project.draft;if(!d)return '<div class="author-empty">ChatGPT의 완성 응답을 가져오면 지문·선택지·해설·분류·검토 결과가 함께 나타납니다.</div>';
  return `<div class="author-topline"><h3>현재 초안 · ${esc(d.title)}</h3><div class="author-actions"><button class="button button-quiet" data-author-action="export-md">문항 Markdown</button><button class="button button-quiet" data-author-action="edit-draft">응답 JSON 편집</button></div></div><div class="author-draft"><article class="draft-paper"><h3>${esc(d.title)}</h3><div class="draft-prose">${esc(d.passage)}</div><p><strong>${esc(d.question)}</strong></p>${d.choices.map((v,i)=>`<div class="draft-choice"><strong>${circle[i+1]}</strong><span class="draft-prose">${esc(v)}</span></div>`).join('')}<details><summary>정답·해설 보기</summary><h3>정답 ${circle[d.answer]}</h3><p class="draft-prose">${esc(d.solution)}</p><ol>${d.steps.map(v=>`<li class="draft-prose">${esc(v)}</li>`).join('')}</ol>${d.optionAnalyses.map(v=>`<p class="draft-prose"><strong>${circle[v.number]} ${v.isAnswer?'정답 선택지':'오답 선택지'}</strong><br>${esc(v.reason)}</p>`).join('')}</details></article><div><h3>문항 분류와 근거</h3>${d.classifications.map(v=>`<div class="author-verdict"><strong>${esc(AXIS_LABELS[v.axis])} · ${esc(v.label)}</strong><p>${esc(v.reason)}</p></div>`).join('')}<h3>형식 검사</h3><p class="author-note">표시 구조와 정답 번호의 일관성을 확인했습니다. 논리적 정답 여부는 아래에서 검토합니다.</p>${inspectDraft(d).map(v=>`<p class="author-mini">${v.ok?'✓':'!'} ${esc(v.label)}</p>`).join('')}<h3>AI 자체 검토 · 독립 검증 전</h3><p class="author-note">AI가 보고한 검토입니다. ‘통과’ 표시도 사람이 다시 확인해야 합니다.</p>${d.review.map(v=>`<div class="author-verdict ${v.status==='pass'?'':'is-warning'}"><strong>${esc(REVIEW_CRITERIA.find(c=>c.id===v.criterion).label)} · ${v.status==='pass'?'AI 검토상 통과':v.status==='revise'?'수정 필요':'미확인'}</strong><p>${esc(v.evidence)}</p></div>`).join('')}<h3>내가 확인한 항목 <span id="human-review-count">${Object.values(project.humanReview).filter(Boolean).length}</span>/5</h3><p class="author-note">직접 풀이·대조한 항목만 표시하세요. 초안을 다시 반영하면 확인 표시가 초기화됩니다.</p>${REVIEW_CRITERIA.map(c=>`<label class="author-check"><input type="checkbox" data-human-review="${c.id}" ${project.humanReview[c.id]?'checked':''}>${c.label} 직접 확인함</label>`).join('')}</div></div>`;
 }
 function render(){
  const selected=project.referenceIds.map(id=>questions.get(id));
  root.innerHTML=`<div class="author-heading"><div class="eyebrow">QUESTION WORKSHOP</div><h1>기출의 논리로 새 문항 만들기</h1><p>원하는 요소를 설명하고 참고 기출을 고르세요. 출제 논리와 모든 해설을 담은 제작 프롬프트를 만들고, 완성된 문항의 분류·검토까지 이어갑니다.</p><ol class="author-steps"><li>1 · 의도와 참고 기출</li><li>2 · 출제 설계와 프롬프트</li><li>3 · 초안·분류·검토</li></ol><div class="author-topline"><p id="author-save-status" class="${state.storageFailed?'author-storage-error':'author-note'}">${state.storageFailed?'브라우저 저장에 실패했습니다. 화면 작업은 유지됩니다. 작업 JSON을 내려받아 보관하세요.':'이 브라우저에 저장됨 · 다른 기기로 옮길 때는 작업 JSON을 내려받으세요.'}</p><div class="author-actions"><button class="button button-quiet" data-author-action="new-project">새 작업 · 현재 작업 백업</button><button class="button button-quiet" data-author-action="export-project">작업 JSON 내려받기</button><label class="author-file">작업 JSON 복원<input type="file" id="author-project-file" accept=".json,application/json"></label></div></div><p id="author-message" class="author-alert" role="status" ${state.message?'':'hidden'}>${esc(state.message)}</p></div>
  <div class="author-grid"><section class="author-panel"><h2>1. 만들고 싶은 문항과 참고 기출</h2><form id="author-search-form"><label for="creation-brief">새 문항에 활용하고 싶은 요소</label><textarea id="creation-brief" rows="4" maxlength="10000" placeholder="소재, 논증 구조, 선택지의 함정 등을 자유롭게 설명해 주세요.">${esc(project.brief)}</textarea><div class="author-actions"><button class="button button-sage" type="submit">참고 기출 찾기</button><a href="index.html#/questions" class="author-mini">문항 탐색에서 고르기 ↗</a></div></form><p id="creation-search-status" class="author-status" aria-live="polite">${esc(state.searchMessage||'어떤 문장이든 전체 기출의 원문·선택지·해설과 비교합니다.')}</p><p class="author-note">첫 의미 검색은 모델 약118MB와 실행 자료를 내려받습니다. 별도 이용료 없이 이 기기에서 처리합니다.</p><div id="creation-search-results">${state.matches.map(match=>{const q=questions.get(match.id);return `<article class="author-result"><div class="author-topline"><h3><a href="index.html#/question/${esc(q.id)}" target="_blank" rel="noopener">${esc(q.id)} · ${esc(q.title)} ↗</a></h3><button class="button button-quiet" data-select-ref="${esc(q.id)}" aria-pressed="${project.referenceIds.includes(q.id)}">${project.referenceIds.includes(q.id)?'참고에서 제외':'참고로 선택'}</button></div><p>${esc(match.reasons?.join(' · ')||'의미가 가까운 후보')}</p><p>${esc(match.snippet||q.summary)}</p></article>`;}).join('')}</div></section>
  <section class="author-panel"><h2>2. 참고할 출제 논리와 제작 프롬프트</h2><p class="author-note">선택한 기출 ${selected.length}/5 · 이 자료의 논리가 제작 의도에 맞는지 원문과 함께 판단하세요.</p>${selected.length?selected.map(q=>`<article class="author-reference"><div class="author-topline"><h3>${esc(q.id)} · ${esc(q.title)}</h3><button class="button button-quiet" data-select-ref="${esc(q.id)}">제외</button></div><div class="author-meta">${esc([...(q.types||[]),...(q.logic||[])].join(' · '))}</div><p class="author-mini">${esc(q.summary)}</p><details><summary>출제 논리·풀이·오답 함정 살펴보기</summary>${referenceBlueprint(q).map(s=>`<p><strong>${esc(s.label)}</strong><br>${esc(s.text)}</p>`).join('')}<a href="index.html#/question/${esc(q.id)}" target="_blank" rel="noopener">원문·해설 대조 ↗</a></details></article>`).join(''):'<p class="author-empty">왼쪽에서 기출을 고르거나, 문항 탐색·상세의 ‘제작에 참고’를 누르세요.</p>'}<label for="creation-notes">채택할 논리와 바꿀 점</label><textarea id="creation-notes" rows="4" maxlength="20000" placeholder="참고 기출에서 가져올 추론 구조, 바꿀 소재, 원하는 오답 함정 등을 적어 주세요. 비워 두면 제작 의도에 맞게 선택하도록 요청합니다.">${esc(project.designNotes)}</textarea><div class="author-actions"><button class="button button-sage" data-author-action="make-prompt">${project.draft?'현재 초안 수정 프롬프트 만들기':'제작 프롬프트 만들기'}</button></div><p class="author-note">현재 사이트는 문항을 직접 생성하는 대신, 선택한 기출 자료와 완성·분류·검토 지침을 담아 ChatGPT에 전달할 글을 만듭니다.</p><label for="creation-prompt">ChatGPT에 붙여 넣을 프롬프트</label><textarea id="creation-prompt" class="author-prompt" rows="7" readonly>${esc(state.prompt)}</textarea><p id="prompt-status" class="author-note">${state.prompt?`총 ${state.prompt.length.toLocaleString()}자 · 원문과 전체 선택지 해설 포함`:'입력과 참고 자료를 정한 뒤 프롬프트를 만들어 주세요.'}</p><div class="author-actions"><button class="button button-quiet" data-author-action="copy-prompt">프롬프트 복사</button><button class="button button-quiet" data-author-action="download-prompt">프롬프트 파일</button><a class="button button-quiet" href="https://chatgpt.com/" target="_blank" rel="noopener">ChatGPT 열기 ↗</a></div><p class="author-note">복사한 뒤 ChatGPT에 직접 붙여 넣으세요. 요청에는 완전한 새 문항과 분류·검토를 포함한 JSON 응답이 지정되어 있습니다.</p></section>
  <section class="author-panel author-wide"><h2>3. 완성 초안 가져오기 · 분류와 검토</h2><details id="draft-import" ${project.draft&&!state.importError?'':'open'}><summary>ChatGPT 응답 JSON 붙여 넣기·수정</summary>${state.importError?`<p class="author-alert" role="status">${esc(state.importError)} 기존 초안은 유지됩니다. 아래 보완 프롬프트로 수정을 요청할 수 있습니다.</p>`:''}<label for="creation-response">완성 응답 JSON</label><textarea id="creation-response" class="author-prompt" rows="8" placeholder="ChatGPT의 JSON 응답 하나를 붙여 넣으세요. 반영하면 이 브라우저에 저장됩니다.">${esc(state.rawResponse)}</textarea><div class="author-actions"><button class="button button-sage" data-author-action="import-draft">초안·분류·검토 반영</button><button class="button button-quiet" data-author-action="repair-prompt">응답 보완·독립 재검토 프롬프트</button></div></details><div id="author-draft">${draftView()}</div></section></div>`;
 }
 async function onClick(event){
  const button=event.target.closest?.('button');if(!button)return;
  if(button.dataset.selectRef){select(button.dataset.selectRef);return;}
  switch(button.dataset.authorAction){
   case 'new-project':newProject();break;
   case 'make-prompt':createPrompt();break;
   case 'repair-prompt':repairPrompt();break;
   case 'copy-prompt':
    if(!state.prompt){state.message='먼저 현재 입력으로 프롬프트를 만들어 주세요.';render();break;}
    try{if(!clipboard?.writeText)throw new Error();await clipboard.writeText(state.prompt);state.message='프롬프트를 복사했습니다.';render();}catch{state.message='자동 복사를 사용할 수 없습니다. 프롬프트 칸의 글을 선택해 복사해 주세요.';render();root.querySelector?.('#creation-prompt')?.select?.();}break;
   case 'download-prompt':if(state.prompt)download('leet-creation-prompt.txt',state.prompt,'text/plain');else{state.message='먼저 프롬프트를 만들어 주세요.';render();}break;
   case 'export-project':download('leet-authoring-project.json',exportProject());break;
   case 'import-draft':importDraft(state.rawResponse);break;
   case 'edit-draft':{state.rawResponse=JSON.stringify(project.draft,null,2);render();const details=root.querySelector?.('#draft-import');if(details)details.open=true;root.querySelector?.('#creation-response')?.focus?.();break;}
   case 'export-md':if(project.draft)download('leet-new-question.md',draftMarkdown(project.draft)+`\n\n사용자 확인: ${REVIEW_CRITERIA.map(c=>`${c.label} ${project.humanReview[c.id]?'확인 표시':'미확인'}`).join(' / ')}\n참고 기출: ${project.referenceIds.join(', ')}\n`,'text/markdown');break;
  }
 }
 function onInput(event){if(event.target.id==='creation-brief')setBrief(event.target.value);if(event.target.id==='creation-notes')setNotes(event.target.value);if(event.target.id==='creation-response'){state.rawResponse=event.target.value;state.importError='';invalidatePrompt();}}
 async function onChange(event){
  if(event.target.dataset?.humanReview)confirmReview(event.target.dataset.humanReview,event.target.checked);
  if(event.target.id==='author-project-file'&&event.target.files?.[0]){const file=event.target.files[0];if(file.size>1000000){state.message='1MB 이하 작업 파일을 골라 주세요.';render();return;}try{importProject(await file.text());}catch{state.message='파일을 읽지 못했습니다. 현재 작업은 유지됩니다.';render();}}
 }
 function onSubmit(event){if(event.target.id==='author-search-form'){event.preventDefault();void search();}}
 root.addEventListener('click',onClick);root.addEventListener('input',onInput);root.addEventListener('change',onChange);root.addEventListener('submit',onSubmit);
 if(entry.has('brief')||questions.has(requested))save();render();
 return {get project(){return project;},state,setBrief,setNotes,select,search,createPrompt,importDraft,importProject,confirmReview,exportProject,newProject,repairPrompt,render,dispose(){disposed=true;sequence++;client?.dispose?.();for(const [type,handler]of [['click',onClick],['input',onInput],['change',onChange],['submit',onSubmit]])root.removeEventListener(type,handler);}};
}

if(typeof document!=='undefined'&&document.querySelector('#author-project-file')===null){
 const root=document.querySelector('#main');
 if(root&&location.pathname.endsWith('/author.html')){
  try{const response=await fetch('data/archive.json?v=20261026-general-search4');if(!response.ok)throw new Error('HTTP '+response.status);const archive=await response.json();if(!Array.isArray(archive.questions)||!Array.isArray(archive.taxonomy))throw new Error('문항 자료 형식 오류');let storage;try{storage=localStorage;}catch{}createAuthoringWorkspace(root,{archive,storage,hash:location.hash});if(location.hash)history.replaceState(null,'',location.pathname);}
  catch(error){root.innerHTML=`<div class="error-state"><h1>제작 자료를 불러오지 못했습니다.</h1><p>${esc(error.message)}</p><a href="author.html">다시 불러오기</a></div>`;}
 }
}
