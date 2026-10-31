import {questionLabel} from './question-label.mjs?v=20261031-author-db1';
import {renderRichText,renderAttachments,validateAttachments,ATTACHMENT_BYTES} from './author-rich-content.mjs?v=20261031-author-db1';
import {parsePendingEditor,BANK_KEY,restoreVersion,draftDiff,qualityHints,PROJECT_KEY,OUTPUT_MODES,REVIEW_CRITERIA,AXIS_LABELS,buildCreationPrompt,referenceBlueprint,parseDraft,parseProject,inspectDraft,withDraft,draftMarkdown,questionText,solutionText} from './authoring.mjs?v=20261031-author-db1';
import {rankReferences} from './reference-search.mjs?v=20261031-author-db1';
import {createSemanticSearch} from './semantic-search.mjs?v=20261026-general-search4';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const circle=['','①','②','③','④','⑤'];
function downloadFile(name,text,type='application/json'){
 const url=URL.createObjectURL(new Blob([text],{type:`${type};charset=utf-8`}));
 const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function createAuthoringWorkspace(root,{archive,answerRegistry,storage,semanticSearch,semanticFactory=createSemanticSearch,download=downloadFile,clipboard=globalThis.navigator?.clipboard,hash=''}={}){
 const taxonomy=archive.taxonomy,questions=new Map(archive.questions.map(q=>{const treatment=answerRegistry?.records?.find(v=>v.questionId===q.id);return [q.id,treatment?{...q,finalTreatment:treatment}:q];}));
 let project={schemaVersion:1,kind:'leet-authoring-project',outputMode:'question',brief:'',designNotes:'',referenceIds:[],draft:null,humanReview:{}};
 const state={prompt:'',matches:[],searchedBrief:'',searching:false,message:'',searchMessage:'',storageFailed:!storage,rawResponse:'',semanticFailed:false};
 let activeId='project-initial',bank=new Map(),writeBlocked=false;
 let sequence=0,client=semanticSearch,disposed=false;
 try{const savedBank=storage?.getItem(BANK_KEY);if(savedBank){const parsed=parseBank(savedBank);bank=parsed.projects;activeId=parsed.activeId;project=bank.get(activeId);}else{const saved=storage?.getItem(PROJECT_KEY);if(saved)project=parseProject(saved,taxonomy,new Set(questions.keys()));}}catch{writeBlocked=true;state.storageFailed=true;state.message='저장 자료를 읽지 못했습니다. 기존 저장 자료는 덮어쓰지 않습니다. 작업 JSON을 내려받아 보관하세요.';}
 bank.set(activeId,project);if(project.pendingEditor){state.editor=structuredClone(project.pendingEditor);state.editorDirty=true;}
 function parseBank(text){
  if(typeof text!=='string'||new TextEncoder().encode(text).byteLength>30000000)throw new Error('프로젝트 모음은 30MB 이하입니다.');
  const data=JSON.parse(text);if(data?.schemaVersion!==1||data.kind!=='leet-authoring-bank'||!Array.isArray(data.projects)||!data.projects.length||data.projects.length>30)throw new Error('프로젝트 모음 형식 오류');
  const projects=new Map();for(const row of data.projects){if(!row||typeof row.id!=='string'||! /^[a-zA-Z0-9_-]{1,100}$/.test(row.id)||projects.has(row.id))throw new Error('프로젝트 ID 오류');projects.set(row.id,parseProject(JSON.stringify(row.project),taxonomy,new Set(questions.keys())));}if(!projects.has(data.activeId))throw new Error('선택된 프로젝트 오류');return {activeId:data.activeId,projects};
 }
 function exportBank(){bank.set(activeId,project);return JSON.stringify({schemaVersion:1,kind:'leet-authoring-bank',activeId,projects:[...bank].map(([id,project])=>({id,project}))},null,2);}
 function resetTransient(){sequence++;Object.assign(state,{prompt:'',rawResponse:'',importError:'',matches:[],searchedBrief:'',searching:false,searchMessage:'',editor:project.pendingEditor?structuredClone(project.pendingEditor):null,editorDirty:!!project.pendingEditor});}
 function renameProject(name){name=String(name).trim().slice(0,100);if(name){project={...project,name};save();}return project.name;}
 function switchProject(id){if(!bank.has(id))return false;save();bank.set(activeId,project);activeId=id;project=bank.get(id);resetTransient();save();render();return true;}
 function importBank(text){try{const next=parseBank(text);if(state.editorDirty&&!saveEditor(state.editor))return false;bank=next.projects;activeId=next.activeId;project=bank.get(activeId);resetTransient();save();state.message='프로젝트 모음을 복원했습니다.';render();return true;}catch(error){state.message='프로젝트 모음 복원 실패: '+error.message+' 현재 작업은 유지됩니다.';render();return false;}}

 const entry=new URLSearchParams(hash.replace(/^#/,''));
 if(entry.has('brief'))project.brief=entry.get('brief').slice(0,10000);
 const requested=entry.get('ref');
 if(questions.has(requested)&&!project.referenceIds.includes(requested)){
  if(project.referenceIds.length<5)project.referenceIds.push(requested);else state.message='참고 기출은 최대5개입니다. 하나를 제외한 뒤 다시 추가해 주세요.';
 }
 function save(){
  try{if(state.editorDirty&&state.editor)project={...project,pendingEditor:parsePendingEditor(state.editor,taxonomy)};if(!storage||writeBlocked)throw new Error();bank.set(activeId,project);storage.setItem(BANK_KEY,exportBank());storage.setItem(PROJECT_KEY,JSON.stringify(project));state.storageFailed=false;}catch{state.storageFailed=true;}
  const label=root.querySelector?.('#author-save-status');if(label)label.textContent=state.storageFailed?'브라우저 저장에 실패했습니다. 화면 작업은 유지됩니다. 작업 JSON을 내려받아 보관하세요.':'이 브라우저에 저장됨 · 다른 기기로 옮길 때는 작업 JSON을 내려받으세요.';
 }
 function invalidatePrompt(){state.prompt='';const field=root.querySelector?.('#creation-prompt');if(field)field.value='';const label=root.querySelector?.('#prompt-status');if(label)label.textContent='입력·참고 자료가 바뀌었습니다. 프롬프트를 다시 만들어 주세요.';}
 function setBrief(value){project.brief=String(value).slice(0,10000);sequence++;state.searching=false;state.matches=[];state.searchedBrief='';state.searchMessage='내용을 수정했습니다. 참고 기출 찾기를 눌러 주세요.';invalidatePrompt();save();const status=root.querySelector?.('#creation-search-status');if(status)status.textContent=state.searchMessage;const results=root.querySelector?.('#creation-search-results');if(results)results.innerHTML='';}
 function setNotes(value){project.designNotes=String(value).slice(0,20000);invalidatePrompt();save();}
 function setOutputMode(value){
  if(!Object.hasOwn(OUTPUT_MODES,value)||project.outputMode===value)return;
  project.outputMode=value;invalidatePrompt();save();render();
 }
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
  if(state.editorDirty&&!saveEditor(state.editor))return '';
  try{state.prompt=buildCreationPrompt({outputMode:project.outputMode,brief:project.brief,designNotes:project.designNotes,questions:project.referenceIds.map(id=>questions.get(id)),taxonomy,draft:project.draft,humanReview:project.humanReview});state.message=project.outputMode==='json'?'JSON 제작 프롬프트를 만들었습니다. ChatGPT 응답을 아래 선택 단계에서 가져올 수 있습니다.':'프롬프트를 만들었습니다. 복사해 ChatGPT에 붙여 넣으면 선택한 형식으로 완성 문항을 받습니다.';}
  catch(error){state.prompt='';state.message=error.message;}
  render();return state.prompt;
 }
 function importDraft(text){
  if(state.editorDirty&&!saveEditor(state.editor))return false;
  state.rawResponse=text;invalidatePrompt();
  try{const next=parseDraft(text,taxonomy);project=withDraft(project,next);project.pendingEditor=null;state.editor=null;state.editorDirty=false;state.rawResponse=JSON.stringify(next,null,2);state.importError='';invalidatePrompt();save();state.message='초안·분류·AI 자체 검토를 가져왔습니다. 아래에서 독립적으로 확인해 주세요.';render();return true;}
  catch(error){state.importError=error.message;state.message=`초안을 반영하지 못했습니다: ${error.message} 기존 초안은 유지됩니다. 응답 보완·독립 재검토 프롬프트로 수정을 요청할 수 있습니다.`;render();return false;}
 }
 function repairPrompt(){
  try{state.prompt=buildCreationPrompt({outputMode:'json',brief:project.brief,designNotes:project.designNotes,questions:project.referenceIds.map(id=>questions.get(id)),taxonomy,rejectedResponse:state.rawResponse,validationError:state.importError});if(!state.rawResponse.trim())throw new Error('보완할 응답을 먼저 붙여 넣어 주세요.');state.message='JSON 응답 보완 프롬프트를 만들었습니다. 위 프롬프트 칸에서 복사해 ChatGPT의 새 채팅에서 독립 재검토를 요청하세요.';}
  catch(error){state.prompt='';state.message=error.message;}render();return state.prompt;
 }
 function importProject(text){
  try{const next=parseProject(text,taxonomy,new Set(questions.keys()));if(bank.size>=30)throw new Error('프로젝트는 최대 30개입니다.');save();bank.set(activeId,project);activeId='project-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);project=next;state.editor=next.pendingEditor?structuredClone(next.pendingEditor):null;state.editorDirty=!!next.pendingEditor;sequence++;state.searching=false;state.matches=[];state.searchedBrief='';state.importError='';state.rawResponse=project.draft?JSON.stringify(project.draft,null,2):'';invalidatePrompt();save();state.message='제작 작업을 복원했습니다.';render();return true;}
  catch(error){state.message=`작업을 불러오지 못했습니다: ${error.message} 현재 작업은 유지됩니다.`;render();return false;}
 }
 function confirmReview(id,checked){if(REVIEW_CRITERIA.some(c=>c.id===id)){project.humanReview={...project.humanReview,[id]:checked===true};invalidatePrompt();save();const node=root.querySelector?.('#human-review-count');if(node)node.textContent=Object.values(project.humanReview).filter(Boolean).length;}}
 const exportProject=()=>JSON.stringify(project,null,2);
 function newProject(name=''){
  save();
  if(bank.size>=30){state.message='프로젝트는 최대 30개입니다. 모음을 내보내 보관하세요.';render();return false;}
  try{if(project.brief||project.designNotes||project.referenceIds.length||project.draft)download('leet-authoring-backup.json',exportProject());}
  catch{state.message='파일 백업을 만들지 못했지만 이전 작업은 프로젝트 모음에 유지됩니다.';}
  bank.set(activeId,project);activeId='project-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);
  sequence++;project={name:String(name).trim().slice(0,100)||'새 프로젝트 '+(bank.size+1),versions:[],schemaVersion:1,kind:'leet-authoring-project',outputMode:'question',brief:'',designNotes:'',referenceIds:[],draft:null,humanReview:{}};
  Object.assign(state,{prompt:'',rawResponse:'',importError:'',matches:[],searchedBrief:'',searching:false,searchMessage:'',editor:null,editorDirty:false,message:'이전 작업을 모음과 파일에 보관하고 새 프로젝트를 시작했습니다.'});save();render();return true;
 }
 function startEditor(){
  state.editor=structuredClone(project.pendingEditor||project.draft||{schemaVersion:1,title:'',passage:'',question:'',choices:['','','','',''],answer:1,solution:'',steps:[''],optionAnalyses:[1,2,3,4,5].map(number=>({number,isAnswer:number===1,reason:''})),classifications:['domain','type','logic'].map(axis=>({axis,label:taxonomy.find(t=>t.axis===axis)?.label||'',reason:''})),review:REVIEW_CRITERIA.map(({id})=>({criterion:id,status:'uncertain',evidence:'편집자 독립 검토 전'})),expectedMinutes:null,attachments:[]});state.editorDirty=false;render();
 }
 function saveEditor(value=state.editor){
  try{const next=parseDraft(JSON.stringify(value),taxonomy);if(project.draft&&draftDiff(project.draft,next).length)next.review=REVIEW_CRITERIA.map(({id})=>({criterion:id,status:'uncertain',evidence:'사람의 편집으로 초안이 변경됨 · 이전 AI 검토는 재검토 전'}));project=withDraft(project,next);project.pendingEditor=null;state.editor=null;state.editorDirty=false;invalidatePrompt();save();state.message='편집 내용을 반영했습니다. 실제 내용이 바뀐 경우 이전 초안을 버전에 보관하고 직접 확인 표시를 초기화했습니다.';render();return true;}
  catch(error){state.message='편집 내용을 반영하지 못했습니다: '+error.message+' 기존 초안은 유지됩니다.';render();return false;}
 }
 function restoreDraftVersion(id){try{if(state.editorDirty&&!saveEditor(state.editor))return false;project=restoreVersion(project,id);state.editor=null;invalidatePrompt();save();state.message='선택한 버전을 복원했습니다. 복원 직전 초안도 버전에 보관했습니다.';render();return true;}catch(error){state.message=error.message;render();return false;}}
 function editField(path,value){if(!state.editor)return;const [key,index,sub]=path.split('.');const d=state.editor;if(index!==undefined){if(sub)d[key][Number(index)][sub]=value;else d[key][Number(index)]=value;}else d[key]=key==='answer'?Number(value):key==='expectedMinutes'?(value===''?null:Number(value)):key==='steps'?value.split('\n').filter(v=>v.trim()):value;if(key==='answer')d.optionAnalyses.forEach(v=>v.isAnswer=v.number===d.answer);state.editorDirty=true;save();}
 function editorView(){const d=state.editor;if(!d)return '<button class="button button-sage" data-author-action="start-editor">'+(project.draft?'지문·발문·선택지 편집':'양식으로 새 문항 작성')+'</button>';
  const field=(label,path,value,rows=3)=>`<label for="edit-${path}">${esc(label)}</label><textarea id="edit-${path}" data-edit-field="${path}" rows="${rows}">${esc(value)}</textarea>`;
  return `<section class="author-editor"><h3>지문·발문·선택지 편집</h3><p class="author-note">작성 중인 내용도 프로젝트별로 임시 저장됩니다. 필수 항목을 완성한 뒤 반영하면 완성 초안과 이전 버전에 기록됩니다. 표는 Markdown의 | 열 | 형식, 수식은 $x^2$, $\\frac{a}{b}$를 지원합니다.</p>${field('제목 (검토 기록용)','title',d.title,1)}${field('지문 · 규칙 · 표','passage',d.passage,8)}<button class="button button-quiet" data-author-action="insert-table">지문에 표 틀 추가</button>${field('발문','question',d.question,2)}<div class="author-editor-grid">${d.choices.map((v,i)=>field(circle[i+1]+' 선택지','choices.'+i,v,2)).join('')}</div><label for="edit-answer">정답 번호</label><select id="edit-answer" data-edit-field="answer">${[1,2,3,4,5].map(v=>`<option value="${v}" ${d.answer===v?'selected':''}>${circle[v]}</option>`).join('')}</select><label for="edit-time">예상 풀이 시간 (분 · 0.5~180)</label><input id="edit-time" type="number" min="0.5" max="180" step="0.5" data-edit-field="expectedMinutes" value="${d.expectedMinutes??''}">${field('전체 풀이','solution',d.solution,5)}${field('단계별 풀이 · 한 줄에 한 단계','steps',d.steps.join('\n'),4)}${d.optionAnalyses.map((v,i)=>field(circle[v.number]+' 판정 근거','optionAnalyses.'+i+'.reason',v.reason,2)).join('')}<details><summary>분류와 근거 편집</summary>${d.classifications.map((v,i)=>`<label for="class-${i}">${esc(AXIS_LABELS[v.axis])}</label><select id="class-${i}" data-edit-field="classifications.${i}.label">${(v.axis==='subject'?[{label:v.label}]:taxonomy.filter(t=>t.axis===v.axis)).map(t=>`<option ${v.label===t.label?'selected':''}>${esc(t.label)}</option>`).join('')}</select>${field('배정 근거','classifications.'+i+'.reason',v.reason,2)}`).join('')}</details><details><summary>도식 이미지 첨부 · 위치와 설명</summary><p class="author-note">PNG/JPEG/WebP 120KB 이하, 최대 3개. 이 브라우저에서만 읽고 작업 JSON에 보관합니다. TXT·로컬 HWP에는 이미지가 자동 삽입되지 않습니다. 완성 미리보기를 인쇄하거나 이미지를 직접 옮겨 주세요.</p><label class="author-file">도식 추가<input type="file" id="author-attachment-file" accept="image/png,image/jpeg,image/webp"></label>${(d.attachments||[]).map((v,i)=>`<div class="author-attachment">${esc(v.name)}${field('그림 설명','attachments.'+i+'.caption',v.caption,2)}<label for="image-place-${i}">배치</label><select id="image-place-${i}" data-edit-field="attachments.${i}.placement">${[['after-passage','지문 뒤'],['after-question','발문 뒤'],['solution','해설 안']].map(([value,label])=>`<option value="${value}" ${v.placement===value?'selected':''}>${label}</option>`).join('')}</select><button class="button button-quiet" data-remove-attachment="${i}">이 첨부 제외</button></div>`).join('')}</details><div class="author-actions"><button class="button button-sage" data-author-action="save-editor">편집 내용 반영 · 이전 버전 보관</button><button class="button button-quiet" data-author-action="preview-editor">표·수식·도식 미리보기 갱신</button><button class="button button-quiet" data-author-action="cancel-editor">편집 취소 · 현재 초안 유지</button></div><p class="author-note">지원 수식: 영문·숫자, 사칙 기호, ^ 지수, _ 첨자, \\frac, \\sqrt, alpha/beta/pi 등 일부 기호. 지원하지 않는 TeX는 원문 그대로 표시합니다. HTML은 글자로 표시합니다.</p><article class="author-rich-preview">${richPreview(d)}</article></section>`;
 }
 function richPreview(d){return `<h4>${esc(d.question)}</h4>${renderAttachments(d.attachments,'after-question')}${renderRichText(d.passage)}${renderAttachments(d.attachments,'after-passage')}${d.choices.map((v,i)=>`<div class="draft-choice"><span>${circle[i+1]}</span><div>${renderRichText(v)}</div></div>`).join('')}<details><summary>해설 미리보기</summary>${renderRichText(d.solution)}${renderAttachments(d.attachments,'solution')}</details>`;}
 function versionsView(){return `<details class="author-versions"><summary>이전 초안 ${project.versions?.length||0}/20 · 비교와 복원</summary><p class="author-note">실제 내용 변경 전 초안을 최근 20개까지 보관합니다. 복원도 현재 초안을 먼저 보관하며 직접 확인을 초기화합니다.</p>${[...(project.versions||[])].reverse().map(v=>`<article><h4>${esc(v.createdAt.replace('T',' ').slice(0,19))} · ${esc(v.draft.title)}</h4><details><summary>현재 초안과 차이 ${draftDiff(v.draft,project.draft).length}개 필드</summary>${draftDiff(v.draft,project.draft).map(row=>`<h5>${esc(row.field)}</h5><div class="author-diff"><pre>${esc(typeof row.before==='string'?row.before:JSON.stringify(row.before,null,2))}</pre><pre>${esc(typeof row.after==='string'?row.after:JSON.stringify(row.after,null,2))}</pre></div>`).join('')||'<p>내용이 같습니다.</p>'}</details><button class="button button-quiet" data-restore-version="${esc(v.id)}">이 버전 복원</button></article>`).join('')}</details>`;}
 function draftView(){
  const d=project.draft;if(!d)return editorView()+'<div class="author-empty">문항만 모드는 ChatGPT의 완성 문항을 그대로 사용하세요. 구조화 JSON을 가져오면 여기서 문항 복사·TXT 저장과 분류·검토를 할 수 있습니다.</div>';
  return `${editorView()}${versionsView()}<div class="author-topline"><h3>현재 초안 · ${esc(d.title)}</h3><div class="author-actions"><button class="button button-quiet" data-author-action="export-md">검토 기록 Markdown</button><button class="button button-quiet" data-author-action="edit-draft">응답 JSON 편집</button></div></div><div class="author-draft"><article class="draft-paper"><label for="publication-question">완성 문항 · 복사하여 사용</label><textarea id="publication-question" class="publication-question" rows="18" readonly>${esc(questionText(d))}</textarea><div class="author-actions"><button class="button button-sage" data-author-action="copy-question">문항만 복사</button><button class="button button-quiet" data-author-action="download-question">문항 TXT</button></div><details class="publication-solution"><summary>문항과 해설 함께 사용</summary><label for="publication-question-solution">문항과 간결한 해설</label><textarea id="publication-question-solution" class="publication-question" rows="16" readonly>${esc(questionText(d)+'\n정답 및 해설\n\n'+solutionText(d))}</textarea><div class="author-actions"><button class="button button-quiet" data-author-action="copy-question-solution">문항과 해설 복사</button><button class="button button-quiet" data-author-action="download-question-solution">문항과 해설 TXT</button></div></details><details><summary>정답·해설 보기</summary><h3>정답 ${circle[d.answer]}</h3><p class="draft-prose">${esc(d.solution)}</p><ol>${d.steps.map(v=>`<li class="draft-prose">${esc(v)}</li>`).join('')}</ol>${d.optionAnalyses.map(v=>`<p class="draft-prose"><strong>${circle[v.number]} ${v.isAnswer?'정답 선택지':'오답 선택지'}</strong><br>${esc(v.reason)}</p>`).join('')}</details></article><div><h3>문항 분류와 근거</h3>${d.classifications.map(v=>`<div class="author-verdict"><strong>${esc(AXIS_LABELS[v.axis])} · ${esc(v.label)}</strong><p>${esc(v.reason)}</p></div>`).join('')}<details><summary>표·수식·도식 포함 완성 미리보기</summary><article class="author-rich-preview">${richPreview(d)}</article><button class="button button-quiet" data-author-action="print-draft">완성 미리보기 인쇄·PDF</button></details><h3>출제 점검 힌트</h3><p class="author-note">표현과 수치에서 찾은 점검 후보입니다. 논리적 증명이나 자동 검증 결과가 아닙니다. 예상 시간: ${d.expectedMinutes??'미기록'}${d.expectedMinutes?'분':''}</p>${qualityHints(d).map(h=>`<p class="author-alert">${esc(h.message)}</p>`).join('')}<h3>형식 검사</h3><p class="author-note">표시 구조와 정답 번호의 일관성을 확인했습니다. 논리적 정답 여부는 아래에서 검토합니다.</p>${inspectDraft(d).map(v=>`<p class="author-mini">${v.ok?'✓':'!'} ${esc(v.label)}</p>`).join('')}<h3>AI 자체 검토 · 독립 검증 전</h3><p class="author-note">AI가 보고한 검토입니다. ‘통과’ 표시도 사람이 다시 확인해야 합니다.</p>${d.review.map(v=>`<div class="author-verdict ${v.status==='pass'?'':'is-warning'}"><strong>${esc(REVIEW_CRITERIA.find(c=>c.id===v.criterion).label)} · ${v.status==='pass'?'AI 검토상 통과':v.status==='revise'?'수정 필요':'미확인'}</strong><p>${esc(v.evidence)}</p></div>`).join('')}<h3>내가 확인한 항목 <span id="human-review-count">${Object.values(project.humanReview).filter(Boolean).length}</span>/${REVIEW_CRITERIA.length}</h3><p class="author-note">직접 풀이·대조한 항목만 표시하세요. 초안을 다시 반영하면 확인 표시가 초기화됩니다.</p>${REVIEW_CRITERIA.map(c=>`<label class="author-check"><input type="checkbox" data-human-review="${c.id}" ${project.humanReview[c.id]?'checked':''}>${c.label} 직접 확인함</label>`).join('')}</div></div>`;
 }
 function bankView(){return `<section class="author-bank"><div><div class="eyebrow">PROJECT BANK</div><h2>문항 제작 프로젝트</h2><p class="author-note">프로젝트 ${bank.size}/30 · 전환해도 현재 작업은 보관됩니다.</p></div><div><label for="author-project-select">프로젝트 선택</label><select id="author-project-select">${[...bank].map(([id,p])=>`<option value="${esc(id)}" ${id===activeId?'selected':''}>${esc(p.name||'이름 없는 프로젝트')}</option>`).join('')}</select><label for="author-project-name">현재 프로젝트 이름</label><input id="author-project-name" maxlength="100" value="${esc(project.name||'이름 없는 프로젝트')}"><button class="button button-quiet" data-author-action="new-project">새 프로젝트</button></div></section>`;}
 function render(){
  const selected=project.referenceIds.map(id=>questions.get(id));
  root.innerHTML=`${bankView()}<div class="author-heading"><div class="eyebrow">QUESTION WORKSHOP</div><h1>기출의 논리로 새 문항 만들기</h1><p>원하는 요소를 설명하고 참고 기출을 고르세요. 기본 출력은 발문부터 시작하는 완성 문항입니다. 해설이나 분류·검토가 필요하면 출력 형식을 바꿀 수 있습니다.</p><ol class="author-steps"><li>1 · 의도와 참고 기출</li><li>2 · 출제 설계와 프롬프트</li><li>3 · 완성 문항 사용 · JSON 검토는 선택</li></ol><div class="author-topline"><p id="author-save-status" class="${state.storageFailed?'author-storage-error':'author-note'}">${state.storageFailed?'브라우저 저장에 실패했습니다. 화면 작업은 유지됩니다. 작업 JSON을 내려받아 보관하세요.':'이 브라우저에 저장됨 · 다른 기기로 옮길 때는 작업 JSON을 내려받으세요.'}</p><details class="author-management"><summary>작업 관리 · 가져오기·내보내기</summary><div class="author-actions"><button class="button button-quiet" data-author-action="new-project">새 프로젝트 · 현재 작업 보관</button><button class="button button-quiet" data-author-action="export-bank">프로젝트 모음 JSON</button><label class="author-file">모음 JSON 복원<input type="file" id="author-bank-file" accept=".json,application/json"></label><button class="button button-quiet" data-author-action="export-project">작업 JSON 내려받기</button><label class="author-file">작업 JSON 복원<input type="file" id="author-project-file" accept=".json,application/json"></label></div></details></div><p id="author-message" class="author-alert" role="status" ${state.message?'':'hidden'}>${esc(state.message)}</p></div>
  <div class="author-grid"><section class="author-panel"><h2>1. 만들고 싶은 문항과 참고 기출</h2><form id="author-search-form"><label for="creation-brief">새 문항에 활용하고 싶은 요소</label><textarea id="creation-brief" rows="4" maxlength="10000" placeholder="소재, 논증 구조, 선택지의 함정 등을 자유롭게 설명해 주세요.">${esc(project.brief)}</textarea><div class="author-actions"><button class="button button-sage" type="submit">참고 기출 찾기</button><a href="index.html#/questions" class="author-mini">문항 탐색에서 고르기 ↗</a></div></form><p id="creation-search-status" class="author-status" aria-live="polite">${esc(state.searchMessage||'어떤 문장이든 전체 기출의 원문·선택지·해설과 비교합니다.')}</p><p class="author-note">첫 의미 검색은 모델 약118MB와 실행 자료를 내려받습니다. 별도 이용료 없이 이 기기에서 처리합니다.</p><div id="creation-search-results">${state.matches.map(match=>{const q=questions.get(match.id);return `<article class="author-result"><div class="author-topline"><h3><a href="index.html#/question/${esc(q.id)}" target="_blank" rel="noopener">${esc(questionLabel(q))} · ${esc(q.title)} ↗</a></h3><button class="button button-quiet" data-select-ref="${esc(q.id)}" aria-pressed="${project.referenceIds.includes(q.id)}">${project.referenceIds.includes(q.id)?'참고에서 제외':'참고로 선택'}</button></div><p>${esc(match.reasons?.join(' · ')||'의미가 가까운 후보')}</p><p>${esc(match.snippet||q.summary)}</p></article>`;}).join('')}</div></section>
  <section class="author-panel"><h2>2. 참고할 출제 논리와 제작 프롬프트</h2><p class="author-note">선택한 기출 ${selected.length}/5 · 이 자료의 논리가 제작 의도에 맞는지 원문과 함께 판단하세요.</p>${selected.length?selected.map(q=>`<article class="author-reference"><div class="author-topline"><h3>${esc(questionLabel(q))} · ${esc(q.title)}</h3><button class="button button-quiet" data-select-ref="${esc(q.id)}">제외</button></div><div class="author-meta">${esc([...(q.types||[]),...(q.logic||[])].join(' · '))}</div><p class="author-mini">${esc(q.summary)}</p>${q.finalTreatment?`<p class="author-alert">최종 처리 참고 · 해설집 정답 ${q.answer??'미확인'}와 별도: ${esc(q.finalTreatment.summary||q.finalTreatment.type)}. ${esc(q.finalTreatment.evidenceNote||'세부 근거는 제작 프롬프트와 원문 출처를 확인하세요.')}</p>`:''}<details><summary>출제 논리·풀이·오답 함정 살펴보기</summary>${referenceBlueprint(q).map(s=>`<p><strong>${esc(s.label)}</strong><br>${esc(s.text)}</p>`).join('')}<a href="index.html#/question/${esc(q.id)}" target="_blank" rel="noopener">원문·해설 대조 ↗</a></details></article>`).join(''):'<p class="author-empty">왼쪽에서 기출을 고르거나, 문항 탐색·상세의 ‘제작에 참고’를 누르세요.</p>'}<label for="creation-notes">채택할 논리와 바꿀 점</label><textarea id="creation-notes" rows="4" maxlength="20000" placeholder="참고 기출에서 가져올 추론 구조, 바꿀 소재, 원하는 오답 함정 등을 적어 주세요. 비워 두면 제작 의도에 맞게 선택하도록 요청합니다.">${esc(project.designNotes)}</textarea><label for="creation-output-mode">ChatGPT 출력 형식</label><select id="creation-output-mode">${Object.entries(OUTPUT_MODES).map(([value,label])=>`<option value="${value}" ${project.outputMode===value?'selected':''}>${esc(label)}</option>`).join('')}</select><div class="author-actions"><button class="button button-sage" data-author-action="make-prompt">${project.draft?'현재 초안 수정 프롬프트 만들기':'제작 프롬프트 만들기'}</button></div><p class="author-note">선택한 기출의 전체 원문·해설과 출력 지침을 담은 프롬프트를 만듭니다. 문항만 모드는 완성 문항만, 문항과 해설 모드는 별도 해설까지 요청합니다.</p><label for="creation-prompt">ChatGPT에 붙여 넣을 프롬프트</label><textarea id="creation-prompt" class="author-prompt" rows="7" readonly>${esc(state.prompt)}</textarea><p id="prompt-status" class="author-note">${state.prompt?`총 ${state.prompt.length.toLocaleString()}자 · 원문과 전체 선택지 해설 포함`:'입력과 참고 자료를 정한 뒤 프롬프트를 만들어 주세요.'}</p><div class="author-actions"><button class="button button-quiet" data-author-action="copy-prompt">프롬프트 복사</button><button class="button button-quiet" data-author-action="download-prompt">프롬프트 파일</button><a class="button button-quiet" href="https://chatgpt.com/" target="_blank" rel="noopener">ChatGPT 열기 ↗</a></div><p class="author-note">복사한 뒤 ChatGPT에 직접 붙여 넣으세요. 문항만·문항과 해설 응답은 그대로 복사하여 사용합니다. 분류·검토를 사이트에서 이어가려면 구조화 JSON 모드를 선택하세요.</p></section>
  <section class="author-panel author-wide"><h2>3. 완성 문항 사용 · JSON 가져오기는 선택</h2><p class="author-note">문항만·문항과 해설 모드는 ChatGPT에서 받은 완성 문항을 그대로 사용하세요. 아래 가져오기는 구조화 JSON 모드의 응답을 위한 선택 기능입니다.</p><details id="draft-import" ${state.importError||project.outputMode==='json'&&!project.draft?'open':''}><summary>구조화 JSON 응답 붙여 넣기·수정 (선택)</summary>${state.importError?`<p class="author-alert" role="status">${esc(state.importError)} 기존 초안은 유지됩니다. 아래 보완 프롬프트로 수정을 요청할 수 있습니다.</p>`:''}<label for="creation-response">완성 응답 JSON</label><textarea id="creation-response" class="author-prompt" rows="8" placeholder="ChatGPT의 JSON 응답 하나를 붙여 넣으세요. 반영하면 이 브라우저에 저장됩니다.">${esc(state.rawResponse)}</textarea><div class="author-actions"><button class="button button-sage" data-author-action="import-draft">초안·분류·검토 반영</button><button class="button button-quiet" data-author-action="repair-prompt">응답 보완·독립 재검토 프롬프트</button></div></details><div id="author-draft">${draftView()}</div></section></div>`;
 }
 async function onClick(event){
  const button=event.target.closest?.('button');if(!button)return;
  if(button.dataset.restoreVersion){restoreDraftVersion(button.dataset.restoreVersion);return;}
  if(button.dataset.removeAttachment!==undefined){state.editor?.attachments.splice(Number(button.dataset.removeAttachment),1);state.editorDirty=true;save();render();return;}
  if(button.dataset.selectRef){select(button.dataset.selectRef);return;}
  switch(button.dataset.authorAction){
   case 'new-project':newProject();break;
   case 'start-editor':startEditor();break;
   case 'save-editor':saveEditor();break;
   case 'preview-editor':render();break;
   case 'cancel-editor':state.editor=null;state.editorDirty=false;project.pendingEditor=null;save();render();break;
   case 'insert-table':editField('passage',state.editor.passage+'\n\n| 항목 | 값 |\n| --- | --- |\n| 조건 A |  |\n| 조건 B |  |\n');render();break;
   case 'export-bank':download('leet-authoring-bank.json',exportBank());break;
   case 'print-draft':printDraft();break;
   case 'make-prompt':createPrompt();break;
   case 'repair-prompt':repairPrompt();break;
   case 'copy-prompt':
    if(!state.prompt){state.message='먼저 현재 입력으로 프롬프트를 만들어 주세요.';render();break;}
    try{if(!clipboard?.writeText)throw new Error();await clipboard.writeText(state.prompt);state.message='프롬프트를 복사했습니다.';render();}catch{state.message='자동 복사를 사용할 수 없습니다. 프롬프트 칸의 글을 선택해 복사해 주세요.';render();root.querySelector?.('#creation-prompt')?.select?.();}break;
   case 'download-prompt':if(state.prompt)download('leet-creation-prompt.txt',state.prompt,'text/plain');else{state.message='먼저 프롬프트를 만들어 주세요.';render();}break;
   case 'copy-question':case 'copy-question-solution':{
    if(!project.draft)break;
    const solved=button.dataset.authorAction==='copy-question-solution';
    const text=questionText(project.draft)+(solved?'\n정답 및 해설\n\n'+solutionText(project.draft):'');
    try{if(!clipboard?.writeText)throw new Error();await clipboard.writeText(text);state.message=solved?'문항과 해설을 복사했습니다.':'문항만 복사했습니다.';render();}
    catch{state.message='자동 복사를 사용할 수 없습니다. 완성 문항 칸의 글을 선택해 복사해 주세요.';render();const field=root.querySelector?.(solved?'#publication-question-solution':'#publication-question');const details=field?.closest?.('details');if(details)details.open=true;field?.select?.();}break;
   }
   case 'download-question':case 'download-question-solution':{
    if(!project.draft)break;
    const solved=button.dataset.authorAction==='download-question-solution';
    download(solved?'leet-question-solution.txt':'leet-question.txt',questionText(project.draft)+(solved?'\n정답 및 해설\n\n'+solutionText(project.draft):''),'text/plain');break;
   }
   case 'export-project':download('leet-authoring-project.json',exportProject());break;
   case 'import-draft':importDraft(state.rawResponse);break;
   case 'edit-draft':{state.rawResponse=JSON.stringify(project.draft,null,2);render();const details=root.querySelector?.('#draft-import');if(details)details.open=true;root.querySelector?.('#creation-response')?.focus?.();break;}
   case 'export-md':if(project.draft)download('leet-new-question.md',draftMarkdown(project.draft)+`\n\n사용자 확인: ${REVIEW_CRITERIA.map(c=>`${c.label} ${project.humanReview[c.id]?'확인 표시':'미확인'}`).join(' / ')}\n참고 기출: ${project.referenceIds.join(', ')}\n`,'text/markdown');break;
  }
 }
 function onInput(event){if(event.target.dataset?.editField)editField(event.target.dataset.editField,event.target.value);if(event.target.id==='creation-brief')setBrief(event.target.value);if(event.target.id==='creation-notes')setNotes(event.target.value);if(event.target.id==='creation-response'){state.rawResponse=event.target.value;state.importError='';invalidatePrompt();}}
 async function onChange(event){
  if(event.target.id==='author-project-select')switchProject(event.target.value);
  if(event.target.id==='author-project-name'){renameProject(event.target.value);render();}
  if(event.target.id==='author-bank-file'&&event.target.files?.[0]){const file=event.target.files[0];if(file.size>30000000){state.message='프로젝트 모음은 30MB 이하입니다.';render();return;}try{importBank(await file.text());}catch{state.message='모음 파일을 읽지 못했습니다.';render();}}
  if(event.target.id==='author-attachment-file'&&event.target.files?.[0]){
   try{const file=event.target.files[0];if(!state.editor||file.size>ATTACHMENT_BYTES||!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('120KB 이하 PNG/JPEG/WebP 이미지를 골라 주세요.');
    const dataUrl=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});
    const bitmap=await createImageBitmap(file);const {width,height}=bitmap;bitmap.close();if(width>4096||height>4096||width*height>8000000)throw new Error('4096px·800만 화소 이하 이미지를 골라 주세요.');
    const attachments=validateAttachments([...(state.editor.attachments||[]),{id:'img-'+Date.now(),name:file.name,caption:'',placement:'after-passage',dataUrl}]);state.editor.attachments=attachments;state.editorDirty=true;save();state.message='이미지를 편집 화면에 추가했습니다. 편집 내용을 반영하면 저장됩니다.';
   }catch(error){state.message='첨부 실패: '+error.message;}render();
  }

  if(event.target.id==='creation-output-mode')setOutputMode(event.target.value);
  if(event.target.dataset?.humanReview)confirmReview(event.target.dataset.humanReview,event.target.checked);
  if(event.target.id==='author-project-file'&&event.target.files?.[0]){const file=event.target.files[0];if(file.size>12000000){state.message='12MB 이하 작업 파일을 골라 주세요.';render();return;}try{importProject(await file.text());}catch{state.message='파일을 읽지 못했습니다. 현재 작업은 유지됩니다.';render();}}
 }
 function printDraft(){if(!project.draft)return;const win=globalThis.open?.('','_blank');if(!win){state.message='인쇄 창을 열지 못했습니다.';render();return;}win.document.write('<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>완성 문항</title><link rel="stylesheet" href="authoring.css?v=20261031-author-db1"></head><body class="author-print">'+richPreview(project.draft)+'</body></html>');win.document.close();win.addEventListener('load',()=>win.print(),{once:true});}
 function onSubmit(event){if(event.target.id==='author-search-form'){event.preventDefault();void search();}}
 root.addEventListener('click',onClick);root.addEventListener('input',onInput);root.addEventListener('change',onChange);root.addEventListener('submit',onSubmit);
 if(entry.has('brief')||questions.has(requested))save();render();
 return {get project(){return project;},get activeProjectId(){return activeId;},get projects(){bank.set(activeId,project);return [...bank].map(([id,project])=>({id,project}));},renameProject,switchProject,exportBank,importBank,startEditor,saveEditor,restoreDraftVersion,editField,state,setBrief,setNotes,setOutputMode,select,search,createPrompt,importDraft,importProject,confirmReview,exportProject,newProject,repairPrompt,render,dispose(){disposed=true;sequence++;client?.dispose?.();for(const [type,handler]of [['click',onClick],['input',onInput],['change',onChange],['submit',onSubmit]])root.removeEventListener(type,handler);}};
}

if(typeof document!=='undefined'&&document.querySelector('#author-project-file')===null){
 const root=document.querySelector('#main');
 if(root&&location.pathname.endsWith('/author.html')){
  try{const response=await fetch('data/archive.json?v=20261031-author-db1');if(!response.ok)throw new Error('HTTP '+response.status);const archive=await response.json();if(!Array.isArray(archive.questions)||!Array.isArray(archive.taxonomy))throw new Error('문항 자료 형식 오류');let answerRegistry;try{const decisions=await fetch('data/answer-exceptions.json?v=20261031-author-db1');if(decisions.ok)answerRegistry=await decisions.json();}catch{}let storage;try{storage=localStorage;}catch{}createAuthoringWorkspace(root,{archive,answerRegistry,storage,hash:location.hash});if(location.hash)history.replaceState(null,'',location.pathname);}
  catch(error){root.innerHTML=`<div class="error-state"><h1>제작 자료를 불러오지 못했습니다.</h1><p>${esc(error.message)}</p><a href="author.html">다시 불러오기</a></div>`;}
 }
}
