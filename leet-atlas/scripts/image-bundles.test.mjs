import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as core from '../core.mjs';
import * as tagGroups from '../tag-groups.mjs';
import * as localText from '../local-text.mjs';
const WEBP='UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
const URL_IMAGE='data:image/webp;base64,'+WEBP;
const question=(id='p001',examKey='preliminary')=>({id,examKey,year:examKey==='preliminary'?2009:Number(examKey),number:Number(id.slice(-2)),examLabel:examKey==='preliminary'?'2009학년도 예비시험':`${examKey}학년도`,title:'번들 원문',image:`assets/questions/${id}.webp`,thumbnail:`assets/questions/${id}.webp`,imageBundle:`data/images/${examKey}.json`,sourceAccess:'bundled',sourcePdf:'',text:'추출한 원문',answer:2,answerStatus:'source-and-solution-agree',summary:'실제 해설',options:[1,2,3,4,5].map(number=>({number,correct:number===2,explanation:'선택지 해설'})),tags:[],fields:[],examPage:1,sourcePage:1});
const bundle=(examKey='preliminary',ids=['p001','p002'])=>({schemaVersion:1,examKey,mimeType:'image/webp',images:Object.fromEntries(ids.map(id=>[id,WEBP]))});
function store(fetcher){assert.equal(typeof core.createImageBundleStore,'function','image bundle loader is missing');return core.createImageBundleStore(fetcher,{version:'test'});}
function deferred(){let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no});return {promise,resolve,reject};}

test('one exam request supplies distinct question images to concurrent readers',async()=>{
 const response=deferred(),requests=[];
 const images=store(async path=>{requests.push(path);return response.promise;});
 const first=images.load(question()),second=images.load(question('p002'));
 assert.equal(images.get(question()).status,'pending');
 assert.equal(images.get(question()).url,'');
 response.resolve({ok:true,json:async()=>bundle()});
 assert.equal(await first,URL_IMAGE);assert.equal(await second,URL_IMAGE);
 assert.deepEqual(requests,['data/images/preliminary.json?v=test']);
 assert.equal(images.get(question('p002')).url,URL_IMAGE);
 await images.load(question());assert.equal(requests.length,1);
});

test('failed bundles stay failed until retry and concurrent retries share one request',async()=>{
 let attempts=0;
 const images=store(async()=>++attempts===1?{ok:false,status:503}:{ok:true,json:async()=>bundle()});
 await assert.rejects(images.load(question()),/503/);
 assert.equal(images.get(question()).status,'error');assert.equal(images.get(question()).url,'');
 await assert.rejects(images.load(question()));assert.equal(attempts,1);
 const result=await Promise.all([images.load(question(),{retry:true}),images.load(question('p002'),{retry:true})]);
 assert.deepEqual(result,[URL_IMAGE,URL_IMAGE]);assert.equal(attempts,2);
});

test('external bundle paths and image payloads cannot become image or fetch URLs',async()=>{
 const requests=[];const images=store(async path=>{requests.push(path);return {ok:true,json:async()=>({...bundle(),images:{p001:'https://example.com/tracker.webp'}})};});
 await assert.rejects(images.load({...question(),imageBundle:'https://example.com/images.json'}));
 assert.equal(requests.length,0);
 await assert.rejects(images.load(question()));
 assert.equal(images.get(question()).url,'');
 assert.equal(images.get({...question(),imageBundle:'data/images/../private.json'}).url,'');
});

test('a missing image or wrong exam never succeeds with another question image',async()=>{
 const missing=store(async()=>({ok:true,json:async()=>bundle('preliminary',['p002'])}));
 await assert.rejects(missing.load(question()),/p001/);
 assert.equal(missing.get(question()).status,'error');
 const wrong=store(async()=>({ok:true,json:async()=>bundle('2009',['p001'])}));
 await assert.rejects(wrong.load(question()));assert.equal(wrong.get(question()).url,'');
});

test('split image files retain the exam identity without allowing a different exam path',async()=>{
 const requests=[];const images=store(async path=>{requests.push(path);return {ok:true,json:async()=>bundle('2010',['1001'])};});
 const q={...question('1001','2010'),imageBundle:'data/images/2010-a.json'};
 assert.equal(await images.load(q),URL_IMAGE);
 assert.deepEqual(requests,['data/images/2010-a.json?v=test']);
 await assert.rejects(images.load({...q,imageBundle:'data/images/2011-a.json'}));
 assert.equal(requests.length,1);
});

const appSource=(await readFile(new URL('../app.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n/gm,'');
async function boot(hash='#/questions',respond=async()=>({ok:true,json:async()=>bundle('preliminary',Array.from({length:10},(_,i)=>`p${String(i+1).padStart(3,'0')}`))})){
 const elements=new Map(),events=new Map(),requests=[];
 const questions=[...Array.from({length:10},(_,i)=>question(`p${String(i+1).padStart(3,'0')}`)),question('0901','2009')];
 const data={exam:{examCount:2},taxonomy:[],questions};
 const holders=new Map();
 function element(key){if(!elements.has(key))elements.set(key,{innerHTML:'',textContent:'',hidden:true,open:false,value:'',dataset:{},src:'',classList:{add(){},toggle(){}},style:{setProperty(){}},addEventListener(k,fn){events.set(key+':'+k,fn)},focus(){},setAttribute(k,v){this[k]=v},removeAttribute(k){delete this[k]},getClientRects(){return [1]},showModal(){this.open=true},close(){this.open=false;events.get(key+':close')?.()}});return elements.get(key);}
 function currentHolders(){
  const active=[];for(const parent of ['#main','#question-list']){
   const html=element(parent).innerHTML;
   for(const m of html.matchAll(/data-image-question="([^"]+)" data-image-kind="([^"]+)"/g)){
    const key=parent+':'+m[1]+':'+m[2];if(!holders.has(key))holders.set(key,{innerHTML:'',dataset:{imageQuestion:m[1],imageKind:m[2]},classList:{toggle(){}},setAttribute(){}});active.push(holders.get(key));
   }
  }return active;
 }
 const document={querySelector:element,querySelectorAll(selector){return selector==='[data-image-question]'?currentHolders():[]},addEventListener(k,fn){events.set(k,fn)}};
 const location={hash,href:'https://afratoxin.github.io/leet-atlas/'+hash};
 const env={document,location,window:{addEventListener(){},scrollTo(){}},history:{replaceState(_a,_b,path){location.hash=path}},localStorage:{getItem(){return null},setItem(){}},navigator:{},fetch:async path=>{requests.push(path);return path.startsWith('data/archive.json')?{ok:true,json:async()=>structuredClone(data)}:respond(path)},...core, ...tagGroups, ...localText};
 const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
 const app=await new AsyncFunction(...Object.keys(env),appSource+'\nreturn {state,render,imageFor,hydrateImages,showImage,retryImage,questionCard,readerSource};')(...Object.values(env));
 return {app,elements,location,requests,questions,holders:currentHolders,events};
}

test('ten visible cards hydrate from one bundle and detail and enlargement reuse the same image',async()=>{
 const pending=deferred();const ui=await boot('#/questions',()=>pending.promise);
 const before=ui.elements.get('#question-list').innerHTML;
 assert.doesNotMatch(before,/src="assets\/questions\/p/);assert.match(before,/불러오는 중/);
 assert.equal(ui.requests.filter(path=>path.includes('/images/')).length,1);
 pending.resolve({ok:true,json:async()=>bundle('preliminary',ui.questions.slice(0,10).map(q=>q.id))});
 await ui.app.hydrateImages(ui.questions.slice(0,10));
 assert.equal(ui.holders().length,10);
 for(const holder of ui.holders())assert.ok(holder.innerHTML.includes(URL_IMAGE));
 ui.location.hash='#/question/p001';ui.app.render();
 assert.ok(ui.elements.get('#main').innerHTML.includes(URL_IMAGE));
 ui.app.showImage('p001');assert.equal(ui.elements.get('#enlarged-image').src,URL_IMAGE);
 assert.equal(ui.requests.filter(path=>path.includes('/images/')).length,1);
 assert.doesNotMatch(ui.elements.get('#main').innerHTML,/href="data\/2027-original.pdf/);
});

test('a late bundle response cannot replace a different question or its open enlargement',async()=>{
 const preliminary=deferred(),regular=deferred();
 const ui=await boot('#/question/p001',path=>path.includes('preliminary')?preliminary.promise:regular.promise);
 ui.app.showImage('p001');
 ui.location.hash='#/question/0901';ui.app.render();ui.app.showImage('0901');
 regular.resolve({ok:true,json:async()=>bundle('2009',['0901'])});await ui.app.hydrateImages([ui.questions[10]]);
 const title=ui.elements.get('#image-dialog-title').textContent;
 preliminary.resolve({ok:true,json:async()=>bundle()});await new Promise(resolve=>setImmediate(resolve));
 assert.match(title,/0901/);assert.equal(ui.elements.get('#image-dialog-title').textContent,title);
 assert.equal(ui.elements.get('#enlarged-image').src,URL_IMAGE);
 assert.equal(ui.app.state.route.id,'0901');
 assert.ok(ui.elements.get('#main').innerHTML.includes('0901'));
});

test('reader exposes an image retry after failure and recovers without a page reload',async()=>{
 let attempts=0;const ui=await boot('#/question/p001',async()=>++attempts===1?{ok:false,status:503}:{ok:true,json:async()=>bundle()});
 await ui.app.hydrateImages([ui.questions[0]]);
 assert.ok(ui.holders().some(h=>h.innerHTML.includes('data-retry-image="p001"')));
 await ui.app.retryImage('p001');
 assert.ok(ui.holders().some(h=>h.innerHTML.includes(URL_IMAGE)));assert.equal(attempts,2);
});
