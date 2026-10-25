// Executes actual render/navigation code with a minimal DOM adapter.
// Generated content and behavior are checked; layout and browser behavior are not.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as core from '../core.mjs';
const data=JSON.parse(await readFile(new URL('../data/2027.json',import.meta.url),'utf8'));
const source=(await readFile(new URL('../app.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n/,'');
async function boot(hash='',reviews={},mode='paged') {
 const elements=new Map();const events=new Map();
 function element(key){
  if(!elements.has(key))elements.set(key,{innerHTML:'',textContent:'',hidden:true,open:false,value:'',dataset:{},classList:{add(){},toggle(){}},style:{setProperty(){}},addEventListener(){},focus(){this.focusCount=(this.focusCount||0)+1},setAttribute(){},removeAttribute(){},getClientRects(){return [1]},getBoundingClientRect(){return {left:0,top:0,bottom:10,width:100,height:20}},showModal(){this.open=true},close(){this.open=false}});
  return elements.get(key);
 }
 const document={querySelector:element,querySelectorAll(){return []},addEventListener(k,fn){events.set(k,fn)}};
 const location={hash,href:'https://afratoxin.github.io/leet-atlas/'+hash};
 const window={addEventListener(){},scrollTo(){},innerWidth:1440,innerHeight:900};
 const history={replaceState(_a,_b,path){location.hash=path}};
 const memory=new Map([['leet-atlas:2027:reviews:v1',JSON.stringify({schemaVersion:1,reviews})],['leet-atlas:list-mode',mode]]);
 const localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,String(v))};
 const env={document,location,window,history,localStorage,navigator:{},fetch:async()=>({ok:true,json:async()=>structuredClone(data)}),...core};
 const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
 const run=new AsyncFunction(...Object.keys(env),source+'\nreturn {state,render,toggleTag,saveReview,filteredQuestions,updateListResults,showBookmarkPalette,selectBookmarkColor,changeListMode,resetListPage};');
 const app=await run(...Object.values(env));
 return {app,elements,location,memory,events};
}
const rowCount=html=>(html.match(/<article class="question-row(?: |")/g)||[]).length;
test('default list has ten cards and page four shows the final ten',async()=>{
 const first=await boot();const html=first.elements.get('#question-list').innerHTML;
 assert.equal(rowCount(html),10);assert.match(html,/assets\/thumbs\/2701.webp\?v=/);assert.doesNotMatch(html,/assets\/thumbs\/2711.webp/);
 const last=await boot('#/questions?page=4');const h=last.elements.get('#question-list').innerHTML;assert.equal(rowCount(h),10);assert.match(h,/2731/);assert.match(h,/2740/);assert.doesNotMatch(h,/assets\/thumbs\/2701.webp/);
});
test('scroll mode shows all forty and an explicit paged URL overrides saved scroll mode',async()=>{
 const scroll=await boot('#/questions?mode=scroll');assert.equal(rowCount(scroll.elements.get('#question-list').innerHTML),40);
 const saved=await boot('#/questions',{},'scroll');assert.equal(rowCount(saved.elements.get('#question-list').innerHTML),40);
 const paged=await boot('#/questions?mode=paged',{},'scroll');assert.equal(rowCount(paged.elements.get('#question-list').innerHTML),10);
});
test('reader renders original and five option explanations',async()=>{
 const {elements}=await boot('#/question/2701');const html=elements.get('#main').innerHTML;assert.match(html,/assets\/questions\/2701.webp\?v=/);assert.match(html,/핵심 해설/);assert.equal((html.match(/class="option-row/g)||[]).length,5);
});
test('updated 2708 has normal answer three and no obsolete conflict warning',async()=>{
 const {elements}=await boot('#/question/2708');const html=elements.get('#main').innerHTML;assert.match(html,/>정답 ③</);assert.doesNotMatch(html,/원본 문항·답안 불일치|ㄴ만 성립하지만/);
});
test('legacy bookmarks remain available in the dedicated page with notes and status',async()=>{
 const {app,elements,memory}=await boot('#/bookmarks',{'2701':{bookmark:true,note:'내 메모',status:'check'},'2703':{bookmark:false}});
 assert.equal(rowCount(elements.get('#question-list').innerHTML),1);assert.match(elements.get('#question-list').innerHTML,/2701/);assert.deepEqual(core.bookmarkColors(app.state.reviews['2701']),['red']);assert.equal(app.state.reviews['2701'].note,'내 메모');assert.equal(app.state.reviews['2701'].status,'check');
 assert.equal(JSON.parse(memory.get('leet-atlas:2027:reviews:v1')).reviews['2701'].note,'내 메모');
});
test('color-specific bookmark page excludes unmarked and differently colored questions',async()=>{
 const {elements}=await boot('#/bookmarks?bookmark=blue',{'2701':{bookmark:true},'2702':{bookmarkColors:['blue']},'2703':{bookmarkColors:['red','blue']}});
 const html=elements.get('#question-list').innerHTML;assert.equal(rowCount(html),2);assert.match(html,/2702/);assert.match(html,/2703/);assert.doesNotMatch(html,/assets\/thumbs\/2701.webp/);
});
test('palette has seven choices and color changes save without losing notes',async()=>{
 const {app,elements,memory}=await boot('#/question/2701',{'2701':{bookmark:true,note:'유지',status:'done'}});
 app.showBookmarkPalette('2701');assert.equal((elements.get('#bookmark-palette').innerHTML.match(/data-bookmark-color=/g)||[]).length,7);assert.equal(elements.get('#bookmark-dialog').open,true);
 app.selectBookmarkColor('blue');assert.deepEqual(core.bookmarkColors(app.state.reviews['2701']),['red','blue']);assert.equal(app.state.reviews['2701'].note,'유지');
 app.selectBookmarkColor(null,true);assert.equal(app.state.reviews['2701'].bookmark,false);assert.equal(app.state.reviews['2701'].status,'done');assert.equal(JSON.parse(memory.get('leet-atlas:2027:reviews:v1')).reviews['2701'].note,'유지');
});
test('tag directory includes field definitions and honest zero-count categories',async()=>{
 const {elements}=await boot('#/tags');assert.match(elements.get('#main').innerHTML,/<h1>태그 사전<\/h1>/);const html=elements.get('#tag-catalog-results').innerHTML;assert.match(html,/정보과학/);assert.match(html,/현재 2027 자료 없음/);assert.match(html,/물리/);assert.match(html,/언론학/);
});
test('tag bundle lists all matches with assignment reasons and preserves an old tag ID',async()=>{
 const q=data.questions.find(q=>q.id==='2728');const tag=q.tags.find(id=>data.taxonomy.find(t=>t.id===id)?.label==='경제학');
 const {app,elements}=await boot('#/tags/'+tag);assert.deepEqual(app.filteredQuestions().map(q=>q.id),['2725','2726','2728']);assert.equal(rowCount(elements.get('#question-list').innerHTML),3);assert.match(elements.get('#question-list').innerHTML,/부여 이유/);
 const empty=data.taxonomy.find(t=>t.axis==='field'&&t.label==='정보과학');const z=await boot('#/tags/'+empty.id);assert.equal(z.app.filteredQuestions().length,0);assert.match(z.elements.get('#question-list').innerHTML,/현재 2027 자료 없음/);
});
test('clicking a reader tag opens its dedicated collection',async()=>{
 const {app,location}=await boot('#/question/2728');const t=data.taxonomy.find(t=>t.axis==='field'&&t.label==='경제학');app.toggleTag(t.id);app.render();assert.equal(core.parseRoute(location.hash).view,'tag');assert.equal(core.parseRoute(location.hash).id,t.id);assert.equal(app.filteredQuestions().length,3);
});
test('removing bookmarks clamps a now-empty page without inventing results',async()=>{
 const reviews=Object.fromEntries(data.questions.slice(0,11).map(q=>[q.id,{bookmark:true}]));const {app,elements}=await boot('#/bookmarks?page=2',reviews);assert.equal(rowCount(elements.get('#question-list').innerHTML),1);
 app.showBookmarkPalette('2711');app.selectBookmarkColor(null,true);assert.equal(app.state.route.page,1);assert.equal(rowCount(elements.get('#question-list').innerHTML),10);
});
test('changing the list view is saved and returns to page one',async()=>{
 const {app,location,memory}=await boot('#/questions?page=3');app.changeListMode('scroll');app.render();assert.equal(core.parseRoute(location.hash).mode,'scroll');assert.equal(app.state.route.page,1);assert.equal(memory.get('leet-atlas:list-mode'),'scroll');
});
test('search changes reset the list page while retaining bookmark restrictions',async()=>{
 const {app}=await boot('#/bookmarks?page=3',Object.fromEntries(data.questions.map(q=>[q.id,{bookmark:true}])));app.state.query='2702';app.resetListPage();app.updateListResults();assert.equal(app.state.route.page,1);assert.deepEqual(app.filteredQuestions().map(q=>q.id),['2702']);
});
test('invalid question URL has a recovery link',async()=>{const {elements}=await boot('#/question/9999');assert.match(elements.get('#main').innerHTML,/문항을 찾을 수 없습니다/);assert.match(elements.get('#main').innerHTML,/#\/questions/);});

test('bookmark-only page rejects the unfiltered all override',async()=>{
 const {app,elements}=await boot('#/bookmarks?bookmark=all',{'2701':{bookmark:true}});assert.equal(app.state.route.bookmark,'any');assert.equal(rowCount(elements.get('#question-list').innerHTML),1);
});
test('reader tag navigation preserves an explicit paged mode over saved scroll preference',async()=>{
 const {app,location}=await boot('#/question/2728?mode=paged',{},'scroll');const tag=data.taxonomy.find(t=>t.axis==='field'&&t.label==='경제학');app.toggleTag(tag.id);app.render();assert.equal(core.parseRoute(location.hash).mode,'paged');
});
test('skip link focuses the current article without changing its route',async()=>{
 const {elements,events,location}=await boot('#/question/2708');let prevented=false;events.get('click')({target:{closest:selector=>selector==='.skip-link'?{}:null},preventDefault(){prevented=true}});assert.equal(prevented,true);assert.equal(location.hash,'#/question/2708');assert.equal(elements.get('#main').focusCount,1);
});
test('changing view mode restores keyboard focus after replacing the controls',async()=>{
 const {app,elements}=await boot('#/questions');app.changeListMode('scroll');app.render();assert.equal(elements.get('#main').focusCount,1);
});
test('year tag bundle explains its assignment rather than showing missing reasons',async()=>{
 const year=data.taxonomy.find(t=>t.axis==='year');const {elements}=await boot('#/tags/'+year.id);assert.doesNotMatch(elements.get('#question-list').innerHTML,/부여 이유가 아직 기록되지/);
});
