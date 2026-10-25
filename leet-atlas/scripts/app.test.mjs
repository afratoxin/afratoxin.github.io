// Executes actual application render functions with a minimal DOM adapter.
// Checks generated content and navigation; this is not a browser/layout test.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as core from '../core.mjs';
const data=JSON.parse(await readFile(new URL('../data/2027.json',import.meta.url),'utf8'));
const source=(await readFile(new URL('../app.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n/,'');
async function boot(hash='') {
 const elements=new Map();
 function element(key){if(!elements.has(key))elements.set(key,{innerHTML:'',textContent:'',hidden:true,value:'',dataset:{},classList:{add(){},toggle(){}},style:{setProperty(){}},addEventListener(){},focus(){},setAttribute(){},getBoundingClientRect(){return {left:0,top:0,bottom:10,width:100,height:20}},showModal(){},close(){}});return elements.get(key);}
 const document={querySelector:element,querySelectorAll(){return []},addEventListener(){}};
 const location={hash,href:'https://afratoxin.github.io/leet-atlas/'+hash};
 const window={addEventListener(){},scrollTo(){},innerWidth:1440,innerHeight:900};
 const history={replaceState(_a,_b,path){location.hash=path}};
 const memory=new Map();const localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
 const run=new (Object.getPrototypeOf(async function(){}).constructor)('document','location','window','history','localStorage','navigator','fetch','filterQuestions','parseRoute','buildRoute',source+'\nreturn {state,render,toggleTag,saveReview,filteredQuestions};');
 const app=await run(document,location,window,history,localStorage,{},async()=>({ok:true,json:async()=>structuredClone(data)}),core.filterQuestions,core.parseRoute,core.buildRoute);
 return {app,elements,location};
}
test('real app renders all 40 IDs with original-shape thumbnails',async()=>{const {elements}=await boot();const list=elements.get('#question-list').innerHTML;assert.equal((list.match(/<article class="question-row">/g)||[]).length,40);assert.match(list,/assets\/thumbs\/2701.webp/);assert.match(list,/assets\/thumbs\/2740.webp/);});
test('real app shows question and five option explanations',async()=>{const {elements}=await boot('#/question/2701');const html=elements.get('#main').innerHTML;assert.match(html,/assets\/questions\/2701.webp/);assert.match(html,/핵심 해설/);assert.equal((html.match(/class="option-row/g)||[]).length,5);assert.match(html,/공식정답 외부 대조 미완료/);});
test('source conflict is never rendered as an ordinary correct answer',async()=>{const {elements}=await boot('#/question/2708');const html=elements.get('#main').innerHTML;assert.match(html,/원본 문항·답안 불일치/);assert.match(html,/ㄴ만 성립/);assert.doesNotMatch(html,/>정답 ③</);});
test('clicking a tag routes to its filtered list',async()=>{const {app,elements,location}=await boot('#/question/2728');const q=data.questions.find(q=>q.id==='2728');const tag=q.tags.find(id=>data.taxonomy.find(t=>t.id===id)?.label==='경제학');app.toggleTag(tag);app.render();assert.match(location.hash,/#\/questions\?tag=/);assert.deepEqual(app.filteredQuestions().map(q=>q.id),['2725','2726','2728']);assert.match(elements.get('#question-list').innerHTML,/2728/);assert.doesNotMatch(elements.get('#question-list').innerHTML,/assets\/thumbs\/2738.webp/);});
test('invalid question link has a recovery route',async()=>{const {elements}=await boot('#/question/9999');assert.match(elements.get('#main').innerHTML,/문항을 찾을 수 없습니다/);assert.match(elements.get('#main').innerHTML,/#\/questions/);});
