import * as referenceSearch from '../reference-search.mjs';
import * as semanticSearch from '../semantic-search.mjs';
// Runs the actual app against a mixed archive. The adapter supplies browser I/O;
// routing, sorting, filtering, bookmark migration and rendered content remain real.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as core from '../core.mjs';
import * as tagGroups from '../tag-groups.mjs';
import * as localText from '../local-text.mjs';
import * as sidebar from '../sidebar.mjs';
import * as localSources from '../local-sources.mjs';

const source=(await readFile(new URL('../app.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n/gm,'');
const current=JSON.parse(await readFile(new URL('../data/2027.json',import.meta.url),'utf8')).questions.find(q=>q.id==='2701');
const taxonomy=[
 {id:'domain-humanities',axis:'domain',label:'인문',description:'인간과 사회의 규범을 다룹니다.'},
 {id:'field-law',axis:'field',label:'법학',parentDomain:'인문',description:'법적 규범과 제도의 관계를 다룹니다.'},
 {id:'subject-law-institutions',axis:'subject',label:'법 제도',parentField:'법학',description:'권한과 절차를 정하는 법 제도를 다룹니다.'},
 {id:'type-argument',axis:'type',label:'논증 평가',description:'주장의 근거를 평가합니다.'},
 {id:'logic-conditional',axis:'logic',label:'조건 추론',description:'조건 관계를 추론합니다.'},
 {id:'year-preliminary',axis:'year',label:'2009 예비시험',description:'2009학년도 예비시험입니다.'},
 {id:'year-2009',axis:'year',label:'2009학년도',description:'2009학년도 본시험입니다.'},
 {id:'year-2027',axis:'year',label:'2027학년도',description:'2027학년도 시험입니다.'},
 {id:'field-empty',axis:'field',label:'언론학',description:'언론과 매체를 다룹니다.'},
];
const common={domains:['인문'],fields:['법학'],subjects:['법 제도'],types:['논증 평가'],logic:['조건 추론'],text:'규칙과 권한의 범위를 비교하여 제도 사이의 관계를 추론한다.',examPage:1,sourcePage:3,sourcePdfPage:2,dataPath:'data/archive.json',answer:null,answerStatus:'not-reviewed'};
function question(id,number,preliminary=false) {
 const yearTag=preliminary?'year-preliminary':'year-2009';
 return {...common,id,number,year:2009,examKey:preliminary?'preliminary':'2009',examLabel:preliminary?'2009학년도 예비시험':'2009학년도',title:`제도 비교 ${number}`,image:`assets/questions/${id}.webp`,thumbnail:`assets/thumbs/${id}.webp`,sourcePdf:preliminary?'data/preliminary-original.pdf':'data/2009-original.pdf',tags:['domain-humanities','field-law','subject-law-institutions','type-argument','logic-conditional',yearTag],tagReasons:{'법학':'제도의 권한 범위를 다루므로 법학으로 분류했습니다.','법 제도':'두 제도의 권한과 절차를 비교하므로 법 제도 소재를 부여했습니다.','조건 추론':'규칙의 필요조건과 충분조건을 나누어 추론합니다.'}};
}
const fixture={exam:{questionCount:13,examCount:3},exams:[{key:'preliminary',label:'2009학년도 예비시험',questionCount:2,year:2009},{key:'2009',label:'2009학년도',questionCount:10,year:2009},{key:'2027',label:'2027학년도',questionCount:1,year:2027}],taxonomy,tagAliases:{'subject-old-authority':'subject-law-institutions'},questions:[question('0901',1),question('p002',2,true),...Array.from({length:9},(_,i)=>question(`09${String(i+2).padStart(2,'0')}`,i+2)),question('p001',1,true),{...current,examKey:'2027',examLabel:'2027학년도',sourcePdf:'data/2027-original.pdf',sourcePdfPage:current.sourcePage,dataPath:'data/archive.json',tags:['domain-humanities','field-law','subject-law-institutions','year-2027']}]};

async function boot(hash='',reviews={},data=fixture,blockedStorage=false,savedTexts=null) {
 const elements=new Map(),events=new Map(),requests=[];
 function element(key) {
  if(!elements.has(key))elements.set(key,{innerHTML:'',textContent:'',hidden:true,open:false,value:'',dataset:{},classList:{add(){},toggle(){}},style:{setProperty(){}},addEventListener(){},focus(){this.focusCount=(this.focusCount||0)+1},setAttribute(){},removeAttribute(){},getClientRects(){return [1]},getBoundingClientRect(){return {left:0,top:0,bottom:10,width:100,height:20}},showModal(){this.open=true},close(){this.open=false}});
  return elements.get(key);
 }
 const document={querySelector:element,querySelectorAll(){return []},addEventListener(k,fn){events.set(k,fn)}};
 const location={hash,href:'https://afratoxin.github.io/leet-atlas/'+hash};
 const window={addEventListener(){},scrollTo(){},innerWidth:1440,innerHeight:900};
 const history={replaceState(_a,_b,path){location.hash=path}};
 const memory=new Map([['leet-atlas:2027:reviews:v1',JSON.stringify({schemaVersion:1,reviews})]]);
 if(savedTexts!==null) memory.set(localText.LOCAL_TEXT_STORAGE_KEY,savedTexts);
 const localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,String(v))};
 const env={...referenceSearch,...semanticSearch,document,location,window,history,localStorage,navigator:{},fetch:async path=>{requests.push(path);return {ok:true,json:async()=>structuredClone(data)}},...core, ...tagGroups, ...localText, ...sidebar, ...localSources};
 const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
 const previous=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
 if(blockedStorage) {
  delete env.localStorage;
  Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw new Error('Storage disabled');}});
 }
 let app;
 try {
  app=await new AsyncFunction(...Object.keys(env),source+'\nreturn {state,render,toggleTag,resetFilters,filteredQuestions,showBookmarkPalette,selectBookmarkColor,catalogTags,clearLocalText,importLocalTextFile:typeof importLocalTextFile === "function" ? importLocalTextFile : null};')(...Object.values(env));
 } finally {
  if(blockedStorage) { if(previous) Object.defineProperty(globalThis,'localStorage',previous); else delete globalThis.localStorage; }
 }
 return {app,elements,document,location,memory,events,requests};
}
const rows=html=>[...html.matchAll(/class="row-index"[^>]*>([^<]+)</g)].map(match=>match[1]);

test('blocked browser storage does not prevent public questions and explanations loading',async()=>{
 const {elements}=await boot('#/question/2701',{},fixture,true);
 const html=elements.get('#main').innerHTML;
 assert.match(html,/핵심 해설/);
 assert.doesNotMatch(html,/문항 데이터를 불러오지 못했습니다/);
});

test('automatic filtering combines multiple exam years and keeps bookmark constraints',async()=>{
 const reviews={'2701':{bookmarkColors:['blue']},'p001':{bookmarkColors:['blue']},'0901':{bookmarkColors:['red']}};
 const {app,elements}=await boot('#/bookmarks?bookmark=blue&tag=year-preliminary&tag=year-2027&tagMode=or',reviews);
 assert.deepEqual(app.filteredQuestions().map(q=>q.id),['2701','p001']);
 assert.match(elements.get('#main').innerHTML,/연도끼리는 OR/);
 assert.doesNotMatch(elements.get('#main').innerHTML,/id="tag-match-mode"/);
 assert.equal(app.state.route.tagMode,'auto');
 assert.doesNotMatch(elements.get('#question-list').innerHTML,/tagMode=/);
});

test('tag collection remains required while selected year filters use OR',async()=>{
 const data=structuredClone(fixture);
 data.questions.find(q=>q.id==='2701').tags=data.questions.find(q=>q.id==='2701').tags.filter(id=>id!=='field-law');
 const {app}=await boot('#/tags/field-law?tag=year-2009&tag=year-2027&tagMode=or',{},data);
 assert.deepEqual(app.filteredQuestions().map(q=>q.id),['0901','0902','0903','0904','0905','0906','0907','0908','0909','0910']);
});

test('adding a filter resets page and retains sort, selected years and color',async()=>{
 const {app,location}=await boot('#/bookmarks?tag=year-2009&tag=year-2027&bookmark=blue&sort=newest');
 app.toggleTag('field-law');app.render();
 assert.equal(app.state.route.tagMode,'auto');
 assert.equal(app.state.route.sort,'newest');
 assert.equal(app.state.route.bookmark,'blue');
 assert.equal(app.state.route.page,1);
 assert.deepEqual(app.state.route.tags,['year-2009','year-2027','field-law']);
 assert.doesNotMatch(location.hash,/tagMode=/);
});

test('filter sidebar and tag catalog show semantic neighborhoods and parent fields',async()=>{
 const list=await boot('#/questions');
 assert.match(list.elements.get('#main').innerHTML,/class="filter-tag-group"/);
 assert.match(list.elements.get('#main').innerHTML,/data-filter-disclosure="field:field-law"/);
 const catalog=await boot('#/tags?tagMode=or');
 assert.match(catalog.elements.get('#tag-catalog-results').innerHTML,/class="tag-neighborhood"/);
 assert.doesNotMatch(catalog.elements.get('#tag-catalog-results').innerHTML,/tagMode=/);
});

test('private text import renders escaped text, enables body search, and never sends contents',async()=>{
 const data=metadataOnlyArchive();
 const {app,elements,requests,memory}=await boot('#/question/0901',{},data);
 assert.equal(typeof app.importLocalTextFile,'function');
 const original=app.state.data.questions.find(q=>q.id==='0901').text;
 const text='브라우저전용본문 <script>alert(1)</script>\n① 첫 선택지';
 const pack={schemaVersion:1,kind:'leet-atlas-local-text',questions:[{id:'0901',examKey:'2009',number:1,sourcePage:3,text}]};
 await app.importLocalTextFile({size:400,text:async()=>JSON.stringify(pack)});
 assert.match(elements.get('#main').innerHTML,/브라우저전용본문 &lt;script&gt;/);
 assert.doesNotMatch(elements.get('#main').innerHTML,/<script>alert/);
 assert.equal(app.state.data.questions.find(q=>q.id==='0901').text,original);
 app.state.query='브라우저전용본문';
 assert.deepEqual(app.filteredQuestions().map(q=>q.id),['0901']);
 assert.equal(JSON.parse(memory.get('leet-atlas:local-texts:v1')).questions.length,1);
 assert.equal(requests.length,1);
});

test('invalid local text leaves imported text and review records intact',async()=>{
 const data=metadataOnlyArchive();
 const {app,memory}=await boot('#/question/0901',{'0901':{bookmarkColors:['blue'],note:'내 검수메모'}},data);
 assert.equal(typeof app.importLocalTextFile,'function');
 const record={id:'0901',examKey:'2009',number:1,sourcePage:3,text:'먼저 불러온 본문'};
 await app.importLocalTextFile({size:400,text:async()=>JSON.stringify({schemaVersion:1,kind:'leet-atlas-local-text',questions:[record]})});
 await app.importLocalTextFile({size:400,text:async()=>'{broken'});
 assert.equal(app.state.localTexts.get('0901').text,record.text);
 assert.equal(app.state.reviews['0901'].note,'내 검수메모');
 assert.equal(JSON.parse(memory.get('leet-atlas:local-texts:v1')).questions.length,1);
});

test('newest order applies to questions, bookmarks and tag collections while preserving number order',async()=>{
 for(const hash of ['#/questions?sort=newest','#/bookmarks?sort=newest','#/tags/field-law?sort=newest']) {
  const reviews=Object.fromEntries(fixture.questions.map(q=>[q.id,{bookmarkColors:['blue']}]));
  const {elements}=await boot(hash,reviews);
  assert.deepEqual(rows(elements.get('#question-list').innerHTML),['2701','0901','0902','0903','0904','0905','0906','0907','0908','0909']);
  assert.match(elements.get('#main').innerHTML,/id="question-sort"/);
  assert.equal(elements.get('#question-sort').value,'newest');
  assert.match(elements.get('#question-list').innerHTML,/sort=newest/);
 }
});

test('changing sort resets pagination and retains search, tags and bookmark color',async()=>{
 const reviews=Object.fromEntries(fixture.questions.map(q=>[q.id,{bookmarkColors:['blue']}]));
 const {app,events,location,elements}=await boot('#/bookmarks?bookmark=blue&tag=field-law&page=2',reviews);
 app.state.query='제도';
 events.get('change')({target:{id:'question-sort',value:'newest'}});
 app.render();
 assert.equal(app.state.route.sort,'newest');
 assert.equal(app.state.route.page,1);
 assert.equal(app.state.route.bookmark,'blue');
 assert.deepEqual(app.state.route.tags,['field-law']);
 assert.equal(app.state.query,'제도');
 assert.match(location.hash,/sort=newest/);
 assert.deepEqual(rows(elements.get('#question-list').innerHTML).slice(0,2),['2701','0901']);
});

test('newest detail navigation and taxonomy links retain the selected order',async()=>{
 const {elements}=await boot('#/question/0910?sort=newest');
 const html=elements.get('#main').innerHTML;
 assert.match(html,/data-question-nav="0909"/);
 assert.match(html,/data-question-nav="p001"/);
 assert.match(html,/href="#\/questions\?[^\"]*sort=newest/);
 assert.match(html,/href="#\/tags\/field-law\?[^\"]*sort=newest/);
 const catalog=await boot('#/tags?sort=newest');
 assert.match(catalog.elements.get('#tag-catalog-results').innerHTML,/href="#\/tags\/field-law\?[^\"]*sort=newest/);
});

test('bookmark palette keeps newest order when opening all bookmarks',async()=>{
 const {app,elements}=await boot('#/question/2701?sort=newest');
 app.showBookmarkPalette('2701');
 const route=core.parseRoute(elements.get('#palette-all-link').href);
 assert.equal(route.view,'bookmarks');
 assert.equal(route.sort,'newest');
});

test('accuracy selection ranks the active search and preserves filtering and reader order',async()=>{
 const data=structuredClone(fixture);
 Object.assign(data.questions.find(q=>q.id==='0902'),{title:'혈액형 비율',text:'학생들의 집단 구성을 조사한다.'});
 Object.assign(data.questions.find(q=>q.id==='0901'),{title:'학교 조사',text:'혈액형 비율에 관한 문제이다.'});
 Object.assign(data.questions.find(q=>q.id==='2701'),{title:'건강 조사',text:'혈액형을 조사한 뒤 학생 비율을 계산한다.'});
 const reviews=Object.fromEntries(data.questions.map(q=>[q.id,{bookmarkColors:['blue']}]));
 const {app,elements,events,location}=await boot('#/bookmarks?bookmark=blue&tag=field-law&page=2',reviews,data);
 app.state.query='혈액형 비율';
 assert.match(elements.get('#main').innerHTML,/<option value="accuracy">정확도 순<\/option>/);
 events.get('change')({target:{id:'question-sort',value:'accuracy'}});app.render();
 assert.equal(app.state.route.sort,'accuracy');
 assert.equal(app.state.route.page,1);
 assert.equal(app.state.route.bookmark,'blue');
 assert.deepEqual(app.state.route.tags,['field-law']);
 assert.deepEqual(rows(elements.get('#question-list').innerHTML),['0902','0901','2701']);
 location.hash=core.buildRoute({...app.state.route,view:'question',id:'0901'});app.render();
 assert.match(elements.get('#main').innerHTML,/data-question-nav="0902"/);
 assert.match(elements.get('#main').innerHTML,/data-question-nav="2701"/);
 assert.match(elements.get('#main').innerHTML,/sort=accuracy/);
 app.state.query='학교';location.hash='#/questions?sort=accuracy';app.render();
 assert.deepEqual(rows(elements.get('#question-list').innerHTML),['0901']);
 app.state.query='';app.render();
 assert.equal(rows(elements.get('#question-list').innerHTML)[0],'2701');
});

test('archive loading defaults to newest across ten-card pages',async()=>{
 const first=await boot();
 assert.match(first.requests[0],/^data\/archive\.json\?v=/);
 assert.deepEqual(rows(first.elements.get('#question-list').innerHTML),['2701','0901','0902','0903','0904','0905','0906','0907','0908','0909']);
 assert.match(first.elements.get('#main').innerHTML,/3회분/);
 assert.equal(first.elements.get('#archive-edition')?.textContent,'3회분 · 전체 아카이브');
 assert.equal(first.elements.get('#archive-count')?.textContent,13);
 assert.equal(first.elements.get('#question-sort').value,'newest');
 const last=await boot('#/questions?page=2');
 assert.deepEqual(rows(last.elements.get('#question-list').innerHTML),['0910','p001','p002']);
 assert.doesNotMatch(first.document.title,/2027/);
});

test('preliminary deep links open the source and navigate to regular 2009 after the preliminary exam',async()=>{
 assert.equal(core.parseRoute('#/question/p001').id,'p001');
 assert.equal(core.buildRoute({view:'question',id:'p001'}),'#/question/p001');
 const {elements}=await boot('#/question/p002?sort=oldest');
 const html=elements.get('#main').innerHTML;
 assert.match(html,/2009학년도 예비시험/);
 assert.match(html,/assets\/questions\/p002.webp\?v=/);
 assert.match(html,/data-question-nav="0901"/);
 assert.match(html,/data\/preliminary-original.pdf\?v=[^"#]+#page=2/);
 assert.match(html,/data\/archive.json\?v=/);
 assert.doesNotMatch(html,/data\/2027-original.pdf/);
});

test('unreviewed archive questions show classification reasons without asserting a solved answer',async()=>{
 const {elements}=await boot('#/question/0901');
 const html=elements.get('#main').innerHTML;
 assert.match(html,/소재와 태그 분류/);
 assert.match(html,/정답·해설 미검토/);
 assert.match(html,/두 제도의 권한과 절차를 비교하므로/);
 assert.match(html,/규칙의 필요조건과 충분조건을 나누어/);
 assert.doesNotMatch(html,/독립 풀이|공식정답 외부 대조|핵심 해설|정답 확인 중/);
});

test('existing 2027 explanations and legacy bookmarks remain available with archive data',async()=>{
 const reviewed=await boot('#/question/2701');
 const html=reviewed.elements.get('#main').innerHTML;
 assert.match(html,/핵심 해설/);
 assert.equal((html.match(/class="option-row/g)||[]).length,1);
 const {app,elements,memory}=await boot('#/bookmarks',{'2701':{bookmark:true,note:'남겨 둔 메모',status:'check'},'p001':{bookmarkColors:['blue']}});
 assert.deepEqual(rows(elements.get('#question-list').innerHTML),['2701','p001']);
 assert.equal(app.state.reviews['2701'].note,'남겨 둔 메모');
 assert.equal(JSON.parse(memory.get('leet-atlas:2027:reviews:v1')).reviews['2701'].status,'check');
 app.showBookmarkPalette('p001');app.selectBookmarkColor('violet');
 assert.deepEqual(core.bookmarkColors(app.state.reviews['p001']),['blue','violet']);
});

test('old subject links and query filters redirect to the canonical collection without losing filters',async()=>{
 const {app,elements,location}=await boot('#/tags/subject-old-authority?tag=subject-old-authority&tag=field-law&bookmark=blue&mode=scroll',{'p001':{bookmarkColors:['blue']}});
 assert.equal(app.state.route.view,'tag');
 assert.equal(app.state.route.id,'subject-law-institutions');
 assert.deepEqual(app.state.route.tags,['subject-law-institutions','field-law']);
 assert.deepEqual(app.filteredQuestions().map(q=>q.id),['p001']);
 assert.match(location.hash,/#\/tags\/subject-law-institutions\?/);
 assert.match(location.hash,/bookmark=blue/);
 assert.match(location.hash,/mode=scroll/);
 assert.doesNotMatch(location.hash,/subject-old-authority/);
 assert.match(elements.get('#question-list').innerHTML,/두 제도의 권한과 절차/);
});

test('subject catalog and collection show their parent field and archive-wide zero counts',async()=>{
 const catalog=await boot('#/tags');
 assert.match(catalog.elements.get('#tag-catalog-results').innerHTML,/법학/);
 assert.match(catalog.elements.get('#tag-catalog-results').innerHTML,/권한과 절차를 정하는 법 제도/);
 assert.doesNotMatch(catalog.elements.get('#tag-catalog-results').innerHTML,/현재 2027 자료 없음/);
 catalog.app.state.tagQuery='법학';
 assert.ok(catalog.app.catalogTags().some(tag=>tag.id==='subject-law-institutions'));
 const collection=await boot('#/tags/subject-law-institutions');
 assert.match(collection.elements.get('#main').innerHTML,/분야 · 법학/);
 assert.match(collection.elements.get('#main').innerHTML,/소재 · TAG COLLECTION/);
 const empty=await boot('#/tags/field-empty');
 assert.match(empty.elements.get('#question-list').innerHTML,/현재 아카이브 자료 없음/);
});

test('exam label searches distinguish preliminary and regular 2009 questions',async()=>{
 const {app}=await boot();
 app.state.query='예비시험';
 assert.deepEqual(app.filteredQuestions().map(q=>q.id),['p001','p002']);
});

test('755-question pagination keeps reachable first, nearby and last pages without a 76-button wall',async()=>{
 const questions=Array.from({length:755},(_,i)=>({...question(String(1001+i),i+1),year:2010}));
 const {elements}=await boot('#/questions?page=40',{}, {...fixture,questions,exam:{questionCount:755,examCount:20}});
 const nav=elements.get('#list-pagination').innerHTML;
 assert.match(nav,/data-list-page="1"/);
 assert.match(nav,/data-list-page="40"[^>]*aria-current="page"/);
 assert.match(nav,/data-list-page="76"/);
 assert.ok((nav.match(/data-list-page=/g)||[]).length<=11);
 assert.equal(rows(elements.get('#question-list').innerHTML).length,10);
});

function metadataOnlyArchive() {
 const data=structuredClone(fixture);
 data.questions=data.questions.map(question=>question.year===2027?question:{...question,sourceAccess:'local-only',image:'',thumbnail:'',text:'',sourcePdf:''});
 return data;
}

test('metadata-only reader gives an exact local PDF reference and classification without empty image controls',async()=>{
 const data=metadataOnlyArchive();
 data.questions.find(question=>question.id==='p001').sourcePage=237;
 const {elements}=await boot('#/question/p001',{},data);
 const html=elements.get('#main').innerHTML;
 assert.match(html,/원문 출처/);
 assert.match(html,/2009학년도 예비시험/);
 assert.match(html,/추리논증 1번/);
 assert.match(html,/통합 PDF/);
 assert.match(html,/237/);
 assert.match(html,/소재와 태그 분류/);
 assert.match(html,/두 제도의 권한과 절차를 비교하므로/);
 assert.doesNotMatch(html,/<img|data-enlarge|data-source-mode|원본 이미지를 그대로 보존|href="[^\"]*\.pdf/);
});

test('missing card thumbnails render question-and-field placeholders with working detail links',async()=>{
 const {elements}=await boot('#/questions?sort=oldest',{},metadataOnlyArchive());
 const html=elements.get('#question-list').innerHTML;
 assert.equal(rows(html).length,10);
 assert.match(html,/class="row-thumb[^\"]*is-placeholder/);
 assert.match(html,/>01<\/strong>/);
 assert.match(html,/>법학<\/span>/);
 assert.match(html,/href="#\/question\/p001/);
 assert.doesNotMatch(html,/<img|src=""/);
});

test('metadata-only search finds classification reasons when full source text is absent',async()=>{
 const data=metadataOnlyArchive();
 data.questions.find(question=>question.id==='p001').tagReasons['법 제도']='권한 분리와 상호 견제의 구조를 비교한다.';
 const {app}=await boot('#/questions',{},data);
 app.state.query='상호 견제';
 assert.deepEqual(app.filteredQuestions().map(question=>question.id),['p001']);
 app.state.query='법 제도';
 assert.equal(app.filteredQuestions().length,13);
});

test('an explicitly unavailable 2027 PDF never falls back to another original while existing sources still work',async()=>{
 const data=metadataOnlyArchive();
 const question=data.questions.find(question=>question.id==='2701');
 Object.assign(question,{sourceAccess:'local-only',image:'',thumbnail:'',text:'',sourcePdf:''});
 const hidden=await boot('#/question/2701',{},data);
 assert.doesNotMatch(hidden.elements.get('#main').innerHTML,/href="data\/2027-original.pdf|<img|data-enlarge/);
 const existing=await boot('#/question/2701',{},metadataOnlyArchive());
 assert.match(existing.elements.get('#main').innerHTML,/assets\/questions\/2701.webp/);
 assert.match(existing.elements.get('#main').innerHTML,/data\/2027-original.pdf/);
 assert.match(existing.elements.get('#main').innerHTML,/핵심 해설/);
});

test('shared subject collections display every parent field and search by secondary fields',async()=>{
 const shared={...fixture,taxonomy:taxonomy.map(tag=>tag.id==='subject-law-institutions'?{...tag,parentFields:['법학','역사학']}:tag)};
 const collection=await boot('#/tags/subject-law-institutions',{},shared);
 assert.match(collection.elements.get('#main').innerHTML,/분야 · 법학 · 역사학/);
 collection.app.state.tagQuery='역사학';
 assert.ok(collection.app.catalogTags().some(tag=>tag.id==='subject-law-institutions'));
});

const fullArchive=JSON.parse(await readFile(new URL('../data/archive.json',import.meta.url),'utf8'));
const puzzle='type-4536b24c5d',year2026='year-750655310c',year2025='year-abefd8a26e';

test('full archive provides every body and image without importing personal files',async()=>{
 const oldest=await boot('#/questions',{},fullArchive);
 assert.equal(oldest.elements.get('#text-coverage')?.textContent,'본문 755/755');
 assert.equal(oldest.elements.get('#image-coverage')?.textContent,'이미지 755/755');
 assert.match(oldest.elements.get('#text-coverage').title,/2009학년도 예비시험 40\/40/);
 assert.match(oldest.elements.get('#text-coverage').title,/2027학년도 본시험 40\/40/);
 assert.equal((oldest.elements.get('#question-list').innerHTML.match(/본문 있음/g)||[]).length,10);
 const newest=await boot('#/questions?sort=newest',{},fullArchive);
 assert.equal((newest.elements.get('#question-list').innerHTML.match(/본문 있음/g)||[]).length,10);
});

test('all 715 local bodies import across the real 755-question archive, restore, search and preserve review notes',async()=>{
 const legacyArchive=structuredClone(fullArchive);
 for (const q of legacyArchive.questions) if (q.examKey !== '2027') {
  q.sourceAccess='local-only';q.text='';q.image='';q.thumbnail='';delete q.imageBundle;
 }
 const reviews={'p001':{bookmarkColors:['blue'],status:'check',note:'기존 검수 메모'},'2701':{note:'공개 문항 메모'}};
 const {app,elements,memory,requests,location}=await boot('#/question/p001',reviews,legacyArchive);
 const nativeBefore=app.state.data.questions.filter(question=>question.examKey==='2027').map(question=>question.text);
 const records=legacyArchive.questions.filter(question=>question.sourceAccess==='local-only').map(question=>({
  id:question.id,examKey:question.examKey,number:question.number,sourcePage:question.sourcePage,
  text:`로컬전체본문 ${question.id} ${question.examLabel} ${question.number}번\n① 개인용 <본문> & 선택지`,
 }));
 assert.equal(records.length,715);
 const payload=JSON.stringify({schemaVersion:1,kind:'leet-atlas-local-text',questions:records});
 await app.importLocalTextFile({size:Buffer.byteLength(payload),text:async()=>payload});
 assert.equal(app.state.localTexts.size,715);
 assert.equal(elements.get('#text-coverage').textContent,'본문 755/755');
 assert.match(elements.get('#text-coverage').title,/2009학년도 예비시험 40\/40/);
 assert.match(elements.get('#text-coverage').title,/2010학년도 본시험 35\/35/);
 assert.match(elements.get('#toast').textContent,/715문항의 본문을 불러왔습니다/);
 assert.match(elements.get('#toast').textContent,/본문 755\/755/);
 assert.match(elements.get('#main').innerHTML,/로컬전체본문 p001/);
 assert.match(elements.get('#main').innerHTML,/&lt;본문&gt; &amp; 선택지/);
 assert.equal(app.state.reviews.p001.note,'기존 검수 메모');
 assert.equal(app.state.reviews['2701'].note,'공개 문항 메모');
 assert.deepEqual(app.state.data.questions.filter(question=>question.examKey==='2027').map(question=>question.text),nativeBefore);
 assert.equal(JSON.parse(memory.get(localText.LOCAL_TEXT_STORAGE_KEY)).questions.length,715);
 assert.equal(JSON.parse(memory.get('leet-atlas:2027:reviews:v1')).reviews.p001.note,'기존 검수 메모');
 app.state.query='로컬전체본문';
 assert.equal(app.filteredQuestions().length,715);
 for(const id of ['p001','0901','1001','2632']) {
  app.state.query=`로컬전체본문 ${id}`;
  assert.deepEqual(app.filteredQuestions().map(question=>question.id),[id]);
 }
 app.state.query='';location.hash='#/questions';app.render();
 assert.equal((elements.get('#question-list').innerHTML.match(/본문 있음/g)||[]).length,10);
 assert.equal(requests.length,1);
 const restored=await boot('#/question/2632',reviews,legacyArchive,false,memory.get(localText.LOCAL_TEXT_STORAGE_KEY));
 assert.equal(restored.app.state.localTexts.size,715);
 assert.equal(restored.elements.get('#text-coverage').textContent,'본문 755/755');
 assert.match(restored.elements.get('#main').innerHTML,/로컬전체본문 2632/);
 restored.app.clearLocalText('2632');
 assert.equal(restored.elements.get('#text-coverage').textContent,'본문 754/755');
 assert.match(restored.elements.get('#main').innerHTML,/원문 출처/);
 assert.equal(restored.app.state.reviews.p001.note,'기존 검수 메모');
});

test('real archive applies year AND puzzle even from an old global-OR URL',async()=>{
 const {app,elements,location}=await boot(`#/questions?tag=${year2026}&tag=${puzzle}&tagMode=or`,{},fullArchive);
 assert.deepEqual(app.filteredQuestions().map(q=>q.id),['2632','2633','2634']);
 assert.match(elements.get('#main').innerHTML,/연도끼리는 OR/);
 assert.doesNotMatch(elements.get('#main').innerHTML,/id="tag-match-mode"/);
 assert.doesNotMatch(location.hash,/tagMode=/);
});

test('real archive combines multiple years with puzzle and explains the current expression',async()=>{
 const {app,elements}=await boot(`#/questions?tag=${year2025}&tag=${year2026}&tag=${puzzle}`,{},fullArchive);
 assert.deepEqual(app.filteredQuestions().map(q=>q.id),['2632','2633','2634','2512','2533','2534','2535']);
 const html=elements.get('#main').innerHTML;
 assert.match(html,/적용 중인 조건/);
 assert.match(html,/2025학년도 또는 2026학년도/);
 assert.match(html,/그리고 논리 퍼즐/);
});

test('year collection can add another year without contradicting its pinned year',async()=>{
 const {app,location}=await boot(`#/tags/${year2026}?tag=${puzzle}&sort=newest`,{},fullArchive);
 app.toggleTag(year2025);app.render();
 assert.deepEqual(app.filteredQuestions().map(q=>q.id),['2632','2633','2634','2512','2533','2534','2535']);
 assert.equal(app.state.route.view,'list');
 assert.ok(app.state.route.tags.includes(year2026));
 assert.doesNotMatch(location.hash,/tagMode=/);
});

test('adding and removing year tags preserves puzzle, query, review and bookmark restrictions',async()=>{
 const reviews={'2632':{bookmarkColors:['blue'],status:'check'},'2512':{bookmarkColors:['blue'],status:'check'},'2533':{bookmarkColors:['red'],status:'check'}};
 const {app}=await boot(`#/bookmarks?bookmark=blue&tag=${year2026}&tag=${puzzle}&sort=newest`,reviews,fullArchive);
 app.state.searchMode='keyword';app.state.query='논리';app.state.review='check';
 app.toggleTag(year2025);app.render();
 assert.deepEqual(app.filteredQuestions().map(q=>q.id),['2632','2512']);
 assert.equal(app.state.query,'논리');assert.equal(app.state.review,'check');
 app.toggleTag(year2026);app.render();
 assert.deepEqual(app.filteredQuestions().map(q=>q.id),['2512']);
 assert.ok(app.state.route.tags.includes(puzzle));assert.equal(app.state.route.bookmark,'blue');
});

test('sidebar renders only four collapsible roots and nests fields and subjects under domains',async()=>{
 const {elements}=await boot('#/questions',{},fullArchive);
 const html=elements.get('#main').innerHTML;
 assert.deepEqual([...html.matchAll(/data-filter-root="([^"]+)"/g)].map(m=>m[1]),['domain','type','logic','year']);
 assert.match(html,/data-filter-disclosure="domain:domain-/);
 assert.match(html,/data-filter-disclosure="field:field-/);
 assert.doesNotMatch(html,/data-filter-root="(?:field|subject)"/);
});

test('manually opened sidebar sections survive filter rerender',async()=>{
 const {app,events,elements}=await boot('#/questions',{},fullArchive);
 const toggle=events.get('toggle');assert.equal(typeof toggle,'function');
 toggle({target:{dataset:{filterDisclosure:'axis:domain'},open:true}});
 app.render();
 assert.ok(app.state.filterOpen.has('axis:domain'));
 assert.match(elements.get('#main').innerHTML,/data-filter-disclosure="axis:domain" open/);
});
