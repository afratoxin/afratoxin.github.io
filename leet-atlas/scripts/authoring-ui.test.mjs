import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createSemanticSearch} from '../semantic-search.mjs';
const api=await import('../authoring-ui.mjs').catch(()=>({}));
const archive=JSON.parse(await readFile(new URL('../data/archive.json',import.meta.url),'utf8'));
const fixture=()=>({schemaVersion:1,title:'지원금 산정',passage:'기본 지원금100만원에 교육 가산20만원을 더한다. 미납자는 그 금액의25%를 감액한다. 기한 내 신청자는 마지막에10만원을 더한다. 갑은 교육을 이수한 미납자로서 기한 내 신청했다.',question:'갑의 지원금은?',choices:['80만원','85만원','90만원','100만원','110만원'],answer:4,solution:'(100+20)×0.75+10=100',steps:['교육 가산120만원','미납 감액90만원','마지막10만원 가산'],optionAnalyses:[1,2,3,4,5].map(number=>({number,isAnswer:number===4,reason:number===4?'규칙을 순서대로 적용하면100이다.':'정해진 순서의 계산 결과100과 다르다.'})),classifications:[{axis:'domain',label:'법률',reason:'규칙에 따라 지급액을 정한다.'},{axis:'type',label:'규칙·사례 적용',reason:'조건을 갑에 적용한다.'},{axis:'logic',label:'수식 계산',reason:'가산과 비율 감액을 수행한다.'}],review:['answerUniqueness','sufficiency','optionValidity','originality','classification'].map(criterion=>({criterion,status:'pass',evidence:'조건과 결과를 대조했다.'}))});
function boot(extra={}){const root={innerHTML:'',handlers:{},querySelector(){return null;},addEventListener(type,handler){this.handlers[type]=handler;},removeEventListener(){}};const store=new Map();return {root,app:api.createAuthoringWorkspace(root,{archive,storage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},semanticSearch:{search:async()=>new Map(),dispose(){}},...extra})};}

test('workspace links selected references to a complete prompt, displays source logic and invalidates edited prompt',()=>{
 const {app,root}=boot({hash:'#ref=1022'});app.setBrief('새로운 가산 감액과 조건 경계 문항');app.setNotes('순서를 바꾼 오답을 설계');app.createPrompt();
 assert.match(app.state.prompt,/해설 원형/);assert.match(root.innerHTML,/출제 논리/);assert.match(root.innerHTML,/ChatGPT/);
 app.setNotes('수정된 출제 방향');assert.equal(app.state.prompt,'');
 app.createPrompt();app.select('1807');assert.equal(app.state.prompt,'');
});
test('out-of-order semantic results and editing brief cannot replace current search',async()=>{
 const deferred=[];const {app}=boot({semanticSearch:{search:q=>new Promise(resolve=>deferred.push({q,resolve})),dispose(){}}});
 app.setBrief('지원금 비율 계산');const first=app.search();app.setBrief('두 철학자의 논박');const second=app.search();
 const scores=new Map([['1321',1]]);deferred[1].resolve(scores);await second;const ids=app.state.matches.map(v=>v.id);
 deferred[0].resolve(new Map([['1022',1]]));await first;assert.deepEqual(app.state.matches.map(v=>v.id),ids);assert.equal(app.state.searchedBrief,'두 철학자의 논박');
});
test('draft import renders escaped text, classifications and AI review separately from human checks; invalid import preserves draft',()=>{
 const {app,root}=boot();const data=fixture();data.title='<script>alert(1)</script>';app.importDraft(JSON.stringify(data));
 assert.match(root.innerHTML,/&lt;script&gt;/);assert.doesNotMatch(root.innerHTML,/<script>alert/);assert.match(root.innerHTML,/독립 검증 전/);assert.match(root.innerHTML,/수식 계산/);
 app.confirmReview('answerUniqueness',true);const previous=app.project.draft;assert.equal(app.importDraft('{'),false);assert.equal(app.project.draft,previous);
 data.title='수정';app.importDraft(JSON.stringify(data));assert.deepEqual(app.project.humanReview,{});
});
test('storage failure leaves exportable work and invalid project import cannot erase it',()=>{
 const {app}=boot({storage:{getItem(){return null;},setItem(){throw new Error('quota');}}});app.setBrief('원하는 문항');app.select('1022');app.importDraft(JSON.stringify(fixture()));
 assert.equal(app.state.storageFailed,true);assert.match(app.exportProject(),/지원금 산정/);const previous=app.project;
 assert.equal(app.importProject('{"schemaVersion":1}'),false);assert.equal(app.project,previous);
});
test('existing site offers authoring navigation and reference entry links',async()=>{
 const html=await readFile(new URL('../index.html',import.meta.url),'utf8'),source=await readFile(new URL('../app.js',import.meta.url),'utf8');
 assert.match(html,/href="author.html"/);assert.match(source,/author\.html#ref=/);
 const {app}=boot();for(const id of ['1022','1807','2307','2703','2607','2211'])app.select(id);assert.equal(app.project.referenceIds.length,5);
});
test('real worker failure is reported honestly and a subsequent search creates a fresh client',async()=>{
 let attempts=0;
 const {app}=boot({semanticSearch:undefined,semanticFactory:options=>createSemanticSearch({...options,workerFactory(){attempts++;throw new Error('offline');}})});
 app.setBrief('계산을 통해 가중 처벌을 판단');await app.search();assert.match(app.state.searchMessage,/못해|실패/);await app.search();assert.equal(attempts,2);
});
test('malformed project draft values cannot erase a successfully imported draft',()=>{
 const {app}=boot();app.importDraft(JSON.stringify(fixture()));const previous=app.project;
 for(const draft of [false,0,'',undefined]){const imported=JSON.parse(app.exportProject());imported.draft=draft;assert.equal(app.importProject(JSON.stringify(imported)),false);assert.equal(app.project,previous);}
});
test('review changes invalidate revision prompts and a fresh project exports previous work before clearing',()=>{
 const backups=[];const {app}=boot({hash:'#ref=1022',download:(name,text)=>backups.push({name,text})});app.setBrief('의도');app.importDraft(JSON.stringify(fixture()));app.createPrompt();app.confirmReview('answerUniqueness',true);assert.equal(app.state.prompt,'');
 app.newProject();assert.equal(backups.length,1);assert.match(backups[0].text,/지원금 산정/);assert.equal(app.project.draft,null);assert.equal(app.project.referenceIds.length,0);assert.equal(app.project.brief,'');
});
test('initial inaccessible storage is never represented as successfully saved',()=>{
 const {app,root}=boot({storage:{getItem(){throw new Error('disabled');},setItem(){throw new Error('disabled');}}});assert.equal(app.state.storageFailed,true);assert.match(root.innerHTML,/브라우저 저장에 실패/);
});
test('rejected responses can generate a fresh independent repair prompt with original request and sources',()=>{
 const {app}=boot({hash:'#ref=1022'});app.setBrief('순차적 가산과 감액을 결합한 문항');app.createPrompt();app.importDraft('{"broken":true,}');assert.equal(app.state.prompt,'');app.repairPrompt();
 assert.match(app.state.prompt,/broken/);assert.match(app.state.prompt,/JSON 하나만/);assert.match(app.state.prompt,/독립적으로/);assert.match(app.state.prompt,/참고 기출 1022/);assert.equal(app.project.draft,null);
});

test('output mode changes invalidate prompt and persist without losing draft; JSON import is optional',()=>{
 const {app,root}=boot({hash:'#ref=1022'});app.setBrief('의도');app.importDraft(JSON.stringify(fixture()));app.createPrompt();
 assert.equal(app.project.outputMode,'question');assert.match(root.innerHTML,/문항만.*기본/);assert.match(root.innerHTML,/JSON.*선택/);
 const previous=app.project.draft;app.setOutputMode('json');assert.equal(app.state.prompt,'');assert.equal(app.project.draft,previous);app.createPrompt();assert.match(app.state.prompt,/응답 JSON 형식/);
 const exported=app.exportProject();app.setOutputMode('question-solution');assert.equal(app.state.prompt,'');app.importProject(exported);assert.equal(app.project.outputMode,'json');
 app.setOutputMode('bogus');assert.equal(app.project.outputMode,'json');
});
test('copy and TXT actions export question-first publication content with optional solution and no review metadata',async()=>{
 const copies=[],files=[];const {app,root}=boot({clipboard:{writeText:async value=>copies.push(value)},download:(name,text,type)=>files.push({name,text,type})});app.importDraft(JSON.stringify(fixture()));
 assert.match(root.innerHTML,/id="publication-question"/);assert.match(root.innerHTML,/문항만 복사/);
 const click=action=>root.handlers.click({target:{closest:()=>({dataset:{authorAction:action}})}});
 await click('copy-question');await click('download-question');await click('copy-question-solution');await click('download-question-solution');
 assert.match(copies[0],/^1\. 갑의 지원금은\?/);assert.match(copies[0],/⑤ 110만원/);assert.doesNotMatch(copies[0],/정답:|지원금 산정|분류|확인 표시/);
 assert.match(copies[1],/\n\n정답 및 해설\n\n정답: ④/);assert.doesNotMatch(copies[1],/분류|검토|참고 기출|\\n/);
 const selectable=root.innerHTML.match(/id="publication-question-solution"[^>]*>([\s\S]*?)<\/textarea>/)[1];assert.match(selectable,/\n\n정답 및 해설\n\n정답: ④/);assert.doesNotMatch(selectable,/\\n/);
 assert.deepEqual(files.map(v=>[v.name,v.type]),[['leet-question.txt','text/plain'],['leet-question-solution.txt','text/plain']]);assert.equal(files[0].text,copies[0]);assert.equal(files[1].text,copies[1]);
});
test('clipboard failure reveals and selects the complete question and solution for manual copy',async()=>{
 const {app,root}=boot({clipboard:{writeText:async()=>{throw new Error('unavailable');}}});app.importDraft(JSON.stringify(fixture()));
 const details={open:false};let selected=false;const field={closest:()=>details,select(){selected=true;}};
 root.querySelector=selector=>selector==='#publication-question-solution'?field:null;
 await root.handlers.click({target:{closest:()=>({dataset:{authorAction:'copy-question-solution'}})}});
 assert.equal(details.open,true);assert.equal(selected,true);assert.match(app.state.message,/선택해 복사/);
});

test('named project bank switches without losing drafts, restores on reload and rejects malformed bank atomically',()=>{
 const store=new Map();const storage={getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)};const {app}=boot({storage});app.renameProject('첫 프로젝트');app.setBrief('첫 의도');app.importDraft(JSON.stringify(fixture()));const first=app.activeProjectId;app.newProject('두 프로젝트');app.setBrief('두 의도');const second=app.activeProjectId;assert.notEqual(first,second);app.switchProject(first);assert.equal(app.project.brief,'첫 의도');assert.equal(app.project.draft.title,'지원금 산정');const reloaded=boot({storage}).app;assert.equal(reloaded.project.name,'첫 프로젝트');reloaded.switchProject(second);assert.equal(reloaded.project.brief,'두 의도');const prior=reloaded.exportBank();assert.equal(reloaded.importBank('{"kind":"leet-authoring-bank","projects":[{}]}'),false);assert.equal(reloaded.exportBank(),prior);
});
test('structured form saving and version restore preserve old content and clear only actual draft changes',()=>{
 const {app,root}=boot();app.importDraft(JSON.stringify(fixture()));app.confirmReview('answerUniqueness',true);assert.equal(app.saveEditor(app.project.draft),true);assert.equal(app.project.humanReview.answerUniqueness,true);const next={...app.project.draft,passage:'바뀐 지문',expectedMinutes:3};assert.equal(app.saveEditor(next),true);assert.deepEqual(app.project.humanReview,{});assert.equal(app.project.versions.length,1);assert.match(root.innerHTML,/지문·발문·선택지 편집/);assert.equal(app.restoreDraftVersion(app.project.versions[0].id),true);assert.match(app.project.draft.passage,/교육/);assert.equal(app.project.versions.length,2);const before=app.exportProject();assert.equal(app.saveEditor({...next,attachments:[{dataUrl:'javascript:alert(1)'}]}),false);assert.equal(app.exportProject(),before);
});

test('importing another valid project retains current named project in the bank',()=>{const {app}=boot({download(){}});app.renameProject('보관할 작업');app.setBrief('유지할 의도');const original=app.activeProjectId;const incoming=JSON.parse(app.exportProject());incoming.name='받은 작업';incoming.brief='가져온 의도';assert.equal(app.importProject(JSON.stringify(incoming)),true);assert.notEqual(app.activeProjectId,original);app.switchProject(original);assert.equal(app.project.brief,'유지할 의도');});
test('malformed persisted bank is not overwritten by subsequent edits',()=>{const store=new Map([['leet-atlas:authoring-bank:v1','broken bank']]);const {app}=boot({storage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)}});app.setBrief('화면에서 새 작업');assert.equal(store.get('leet-atlas:authoring-bank:v1'),'broken bank');assert.equal(app.state.storageFailed,true);assert.match(app.exportProject(),/화면에서 새 작업/);});

test('known final no-answer treatment appears in prompt while book answer remains intact',()=>{const {app,root}=boot({hash:'#ref=1034',answerRegistry:{records:[{questionId:'1034',type:'no-answer',scoring:'all-accepted',summary:'전원 정답 처리',sources:[{title:'출제기관',url:'https://example.org/decision'}]}]}});app.setBrief('이 문항의 논리에서 새 문항');const prompt=app.createPrompt();assert.match(prompt,/no-answer/);assert.match(prompt,/all-accepted/);assert.match(prompt,/전원 정답 처리/);assert.match(root.innerHTML,/최종 처리 참고/);assert.equal(archive.questions.find(q=>q.id==='1034').finalTreatment,undefined);});

test('unfinished form edits survive project switches and reload without marking them as a validated draft',()=>{const store=new Map();const storage={getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)};const {app}=boot({storage,download(){}});app.startEditor();app.editField('passage','아직 작성 중인 지문');const first=app.activeProjectId;assert.equal(app.newProject('별도 작업'),true);assert.equal(app.switchProject(first),true);assert.equal(app.state.editor.passage,'아직 작성 중인 지문');assert.equal(app.project.draft,null);const reloaded=boot({storage}).app;assert.equal(reloaded.state.editor.passage,'아직 작성 중인 지문');assert.equal(reloaded.project.draft,null);});

test('author reference labels distinguish preliminary from regular questions and use current search module',async()=>{const {app,root}=boot();app.select('p001');app.select('0901');assert.match(root.innerHTML,/2009학년도 예비시험 1번/);assert.match(root.innerHTML,/2009학년도 1번/);const source=await readFile(new URL('../authoring-ui.mjs',import.meta.url),'utf8');assert.match(source,/reference-search\.mjs\?v=20261031-author-db1/);assert.match(source,/question-label\.mjs/);});
