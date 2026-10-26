import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as core from '../core.mjs';
import * as tagGroups from '../tag-groups.mjs';
import * as localText from '../local-text.mjs';
import * as sidebar from '../sidebar.mjs';
import * as localSources from '../local-sources.mjs';
import * as annual from '../year-analysis.mjs';
const source=(await readFile(new URL('../app.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n/gm,'');
const data=JSON.parse(await readFile(new URL('../data/archive.json',import.meta.url),'utf8'));
const content=JSON.parse(await readFile(new URL('../data/year-analysis.json',import.meta.url),'utf8'));
async function boot(hash='#/analysis',respond=async()=>({ok:true,json:async()=>structuredClone(content)})) {
 const elements=new Map(),events=new Map(),requests=[];
 const element=key=>{if(!elements.has(key))elements.set(key,{innerHTML:'',textContent:'',hidden:true,open:false,value:'',dataset:{},classList:{add(){},toggle(){}},style:{setProperty(){}},addEventListener(){},focus(){},setAttribute(){},removeAttribute(){},getClientRects(){return[1]},getBoundingClientRect(){return{left:0,top:0,bottom:10,width:100,height:20}}});return elements.get(key);};
 const document={querySelector:element,querySelectorAll(){return[]},addEventListener(k,fn){events.set(k,fn)}};
 const location={hash,href:'https://example.invalid/'+hash};
 const env={document,location,window:{addEventListener(){},scrollTo(){}},history:{replaceState(_a,_b,path){location.hash=path}},navigator:{},localStorage:{getItem(){return null},setItem(){}},fetch:async path=>{requests.push(path);return String(path).startsWith('data/archive.json')?{ok:true,json:async()=>structuredClone(data)}:respond(path)},...core,...tagGroups,...localText,...sidebar,...localSources,...annual};
 const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
 const app=await new AsyncFunction(...Object.keys(env),source+'\nreturn {state,render,loadYearContent};')(...Object.values(env));
 return {app,elements,events,location,requests,document,html:()=>elements.get('#main').innerHTML};
}
test('analysis tab loads content once, defaults to 2027 and changes exam and comparison',async()=>{
 const page=await boot();await page.app.loadYearContent();page.app.render();
 assert.match(page.html(),/연도별 출제 분석/);
 assert.match(page.html(),/2027학년도 · 자체 원문 분석/);
 assert.match(page.html(),/정확한 수치 확보 4\/40/);
 page.events.get('change')({target:{id:'analysis-year',value:'2010'}});page.app.render();
 assert.match(page.location.hash,/#\/analysis\/2010/);
 assert.match(page.html(),/2010학년도 · 자체 원문 분석/);
 assert.match(page.html(),/전체 35문항/);
 page.events.get('change')({target:{id:'analysis-compare',value:'2009'}});page.app.render();
 assert.match(page.html(),/2009학년도 대비/);
 assert.equal(page.requests.filter(p=>p.startsWith('data/year-analysis.json')).length,1);
});
test('late analysis response cannot replace another view and cached data remains reusable',async()=>{
 let resolve;const waiting=new Promise(r=>{resolve=r});
 const page=await boot('#/analysis/preliminary',()=>waiting);
 assert.match(page.html(),/불러오고/);
 page.location.hash='#/questions';page.app.render();
 resolve({ok:true,json:async()=>structuredClone(content)});await page.app.loadYearContent();
 assert.doesNotMatch(page.html(),/연도별 출제 분석/);
 assert.match(page.html(),/문항 탐색/);
 page.location.hash='#/analysis/preliminary';page.app.render();
 assert.match(page.html(),/2009학년도 예비시험 · 자체 원문 분석/);
});
test('analysis data failure is explicit and retry recovers without changing public questions',async()=>{
 let attempt=0;
 const page=await boot('#/analysis/2025',async()=>++attempt===1?{ok:false,status:503}:{ok:true,json:async()=>structuredClone(content)});
 const before=structuredClone(page.app.state.data.questions);
 await page.app.loadYearContent();page.app.render();
 assert.match(page.html(),/불러오지 못했습니다/);
 assert.match(page.html(),/data-retry-year-analysis/);
 await page.app.loadYearContent(true);page.app.render();
 assert.match(page.html(),/2025학년도 · 자체 원문 분석/);
 assert.deepEqual(page.app.state.data.questions,before);
});
test('compiled year content covers all exams with valid question and source references',()=>{
 assert.equal(content.profiles.length,20);
 assert.deepEqual(annual.validateYearContent(content,data.questions),[]);
 for(const p of content.profiles)for(const section of ['logic','prompts','choices','materials'])assert.ok(p[section].text&&p[section].questionIds.length>=2,p.examKey);
});

test('opening a representative question retains a return link to its analysis year',async()=>{
 const page=await boot('#/analysis/2010');await page.app.loadYearContent();page.app.render();
 page.location.hash='#/question/1003';page.app.render();
 assert.equal(page.app.state.returnRoute.view,'analysis');
 assert.match(page.html(),/class="breadcrumb-link" href="#\/analysis\/2010/);
});

test('annual page title tracks the selected exam after returning from a question',async()=>{
 const page=await boot('#/analysis/2010');await page.app.loadYearContent();page.app.render();
 assert.match(page.document.title,/2010학년도.*연도별/);
 page.location.hash='#/question/1003';page.app.render();
 page.location.hash='#/analysis/2009';page.app.render();
 assert.match(page.document.title,/2009학년도.*연도별/);
 assert.doesNotMatch(page.document.title,/1003/);
});
