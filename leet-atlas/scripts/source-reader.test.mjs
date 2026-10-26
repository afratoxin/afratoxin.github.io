import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as core from '../core.mjs';
import * as tagGroups from '../tag-groups.mjs';
import * as localText from '../local-text.mjs';
import * as sidebar from '../sidebar.mjs';
import * as localSources from '../local-sources.mjs';
import {createIndexedDBFixture} from './fixtures/indexeddb.mjs';

const publishedArchive=JSON.parse(await readFile(new URL('../data/archive.json',import.meta.url),'utf8'));
const archive=structuredClone(publishedArchive);
// These tests exercise imports from the earlier archive without bundled sources.
for (const q of archive.questions) if (q.examKey !== '2027') {
 q.sourceAccess='local-only';q.text='';q.image='';q.thumbnail='';delete q.imageBundle;
}
const source=(await readFile(new URL('../app.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n/gm,'');
const image='data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
const row=id=>{
 const q=archive.questions.find(q=>q.id===id);
 return {id,examKey:q.examKey,number:q.number,sourcePage:q.sourcePage,text:`${q.number}. 합성 원문 ${id} <표> & 보기\n① 하나 ② 둘 ③ 셋 ④ 넷 ⑤ 다섯`,image};
};
const file=records=>{
 const payload=JSON.stringify({schemaVersion:1,kind:'leet-atlas-local-sources',questions:records});
 return {size:Buffer.byteLength(payload),text:async()=>payload};
};

async function boot({id='p001',database=createIndexedDBFixture(),memory=new Map(),blockedIndexedDB=false,data=archive}={}) {
 const elements=new Map(),events=new Map(),requests=[],storageControl={failWrites:false};
 const element=key=>{
  if(!elements.has(key))elements.set(key,{innerHTML:'',textContent:'',hidden:true,open:false,value:'',dataset:{},classList:{add(){},toggle(){}},style:{setProperty(){}},addEventListener(){},focus(){},setAttribute(){},removeAttribute(name){delete this[name]},getClientRects(){return[1]},showModal(){this.open=true},close(){this.open=false}});
  return elements.get(key);
 };
 const document={querySelector:element,querySelectorAll:()=>[],addEventListener:(k,fn)=>events.set(k,fn)};
 const location={hash:`#/question/${id}`,href:`https://afratoxin.github.io/leet-atlas/#/question/${id}`};
 if(!memory.has('leet-atlas:2027:reviews:v1'))memory.set('leet-atlas:2027:reviews:v1',JSON.stringify({schemaVersion:2,reviews:{p001:{note:'보존할 메모',bookmarkColors:['blue'],status:'check'}}}));
 const env={document,location,window:{addEventListener(){},scrollTo(){}},history:{replaceState(_a,_b,path){location.hash=path}},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>{if(storageControl.failWrites)throw new Error('denied');memory.set(k,v)}},indexedDB:database.indexedDB,navigator:{},fetch:async path=>{requests.push(path);return{ok:true,json:async()=>structuredClone(data)}},...core,...tagGroups,...localText,...sidebar,...localSources};
 const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
 const previous=Object.getOwnPropertyDescriptor(globalThis,'indexedDB');
 if(blockedIndexedDB){delete env.indexedDB;Object.defineProperty(globalThis,'indexedDB',{configurable:true,get(){throw new Error('blocked database getter')}});}
 let app;try{app=await new AsyncFunction(...Object.keys(env),source+'\nreturn {state,render,filteredQuestions,showImage,importLocalSourceFile:typeof importLocalSourceFile === "function" ? importLocalSourceFile : null,importLocalTextFile,clearLocalText,clearLocalSource:typeof clearLocalSource === "function" ? clearLocalSource : null};')(...Object.values(env));}finally{if(blockedIndexedDB){if(previous)Object.defineProperty(globalThis,'indexedDB',previous);else delete globalThis.indexedDB;}}
 return {app,elements,events,requests,location,memory,database,storageControl};
}

test('personal source corrections survive the transition to bundled public originals',async()=>{
 const first=await boot({data:publishedArchive});
 await first.app.importLocalSourceFile(file([row('p001')]));
 assert.equal(first.app.state.localSources.size,1);
 assert.match(first.elements.get('#main').innerHTML,/합성 원문 p001/);
 assert.equal(first.elements.get('#text-coverage').textContent,'본문 755/755');
 const restored=await boot({data:publishedArchive,database:first.database,memory:first.memory});
 assert.equal(restored.app.state.localSources.size,1);
 assert.match(restored.elements.get('#main').innerHTML,/합성 원문 p001/);
 await restored.app.clearLocalSource('p001');
 assert.equal(restored.app.state.localSources.size,0);
 assert.equal(restored.elements.get('#text-coverage').textContent,'본문 755/755');
 assert.match(restored.elements.get('#main').innerHTML,/참을 깨달은 자/);
 assert.equal(restored.app.state.reviews.p001.note,'보존할 메모');
});

test('saved text corrections can restore and clear over the bundled public original',async()=>{
 const memory=new Map();
 const record=row('p001');delete record.image;
 memory.set(localText.LOCAL_TEXT_STORAGE_KEY,JSON.stringify({schemaVersion:1,kind:'leet-atlas-local-text',questions:[record]}));
 const context=await boot({data:publishedArchive,memory});
 assert.equal(context.app.state.localTexts.size,1);
 assert.match(context.elements.get('#main').innerHTML,/합성 원문 p001/);
 assert.match(context.elements.get('#main').innerHTML,/data-clear-local-text="p001"/);
 context.app.clearLocalText('p001');
 assert.equal(context.app.state.localTexts.size,0);
 assert.match(context.elements.get('#main').innerHTML,/참을 깨달은 자/);
});

test('source import connects actual reader images and text while preserving public data and reviews',async()=>{
 const {app,elements,memory,requests}=await boot();
 assert.equal(typeof app.importLocalSourceFile,'function');
 const before=structuredClone(app.state.data.questions);
 await app.importLocalSourceFile(file([row('p001'),row('2632')]));
 assert.equal(app.state.localSources.size,2);assert.equal(app.state.localTexts.size,2);
 assert.equal(elements.get('#text-coverage').textContent,'본문 42/755');
 assert.equal(elements.get('#image-coverage').textContent,'이미지 42/755');
 const html=elements.get('#main').innerHTML;
 assert.ok(html.includes(image));assert.match(html,/data-source-mode="image"/);
 assert.match(html,/data-source-mode="text"/);assert.match(html,/합성 원문 p001 &lt;표&gt; &amp; 보기/);
 assert.deepEqual(app.state.data.questions,before);
 assert.equal(app.state.reviews.p001.note,'보존할 메모');assert.deepEqual(app.state.reviews.p001.bookmarkColors,['blue']);
 assert.doesNotMatch(memory.get(localText.LOCAL_TEXT_STORAGE_KEY),/data:image/);
 assert.equal(requests.length,1);
});

test('imported images enlarge and both image and text return after reopening the archive',async()=>{
 const first=await boot({id:'2632'});
 assert.equal(typeof first.app.importLocalSourceFile,'function');
 await first.app.importLocalSourceFile(file([row('2632')]));
 first.app.showImage('2632');
 assert.equal(first.elements.get('#image-dialog').open,true);
 assert.equal(first.elements.get('#enlarged-image').src,image);
 const restored=await boot({id:'2632',database:first.database,memory:first.memory});
 assert.equal(restored.app.state.localSources.size,1);
 assert.ok(restored.elements.get('#main').innerHTML.includes(image));
 restored.app.state.sourceMode='text';restored.app.render();
 assert.match(restored.elements.get('#main').innerHTML,/<div id="source-text-view">/);
 assert.match(restored.elements.get('#main').innerHTML,/합성 원문 2632/);
});

test('legacy body imports update text without losing an already stored source image',async()=>{
 const first=await boot();assert.equal(typeof first.app.importLocalSourceFile,'function');
 await first.app.importLocalSourceFile(file([row('p001')]));
 const body={...row('p001'),text:'1. 나중에 고친 본문 ①②③④⑤'};delete body.image;
 const payload=JSON.stringify({schemaVersion:1,kind:'leet-atlas-local-text',questions:[body]});
 await first.app.importLocalTextFile({size:Buffer.byteLength(payload),text:async()=>payload});
 const restored=await boot({database:first.database,memory:first.memory});
 assert.match(restored.elements.get('#main').innerHTML,/나중에 고친 본문/);
 assert.ok(restored.elements.get('#main').innerHTML.includes(image));
});

test('invalid source packs leave existing source, text and review records unchanged',async()=>{
 const {app,elements}=await boot();assert.equal(typeof app.importLocalSourceFile,'function');
 await app.importLocalSourceFile(file([row('p001')]));
 const before=structuredClone([...app.state.localSources]);
 await app.importLocalSourceFile(file([{...row('p001'),image:'https://example.invalid/x.webp'}]));
 assert.deepEqual([...app.state.localSources],before);assert.match(elements.get('#toast').textContent,/불러오지 못했습니다/);
 assert.equal(app.state.reviews.p001.note,'보존할 메모');
});

test('storage failure keeps source available in this tab and says it was not saved',async()=>{
 const {app,elements,database}=await boot({database:createIndexedDBFixture({failPutAt:1})});
 assert.equal(typeof app.importLocalSourceFile,'function');
 await app.importLocalSourceFile(file([row('p001')]));
 assert.ok(elements.get('#main').innerHTML.includes(image));
 assert.match(elements.get('#toast').textContent,/현재 탭/);assert.equal(database.records().length,0);
});

test('deleting an imported source removes its text and image without deleting review notes',async()=>{
 const {app,elements,database,memory}=await boot();assert.equal(typeof app.importLocalSourceFile,'function');
 await app.importLocalSourceFile(file([row('p001')]));
 assert.equal(typeof app.clearLocalSource,'function');await app.clearLocalSource('p001');
 assert.equal(app.state.localSources.size,0);assert.equal(app.state.localTexts.size,0);
 assert.equal(elements.get('#text-coverage').textContent,'본문 40/755');
 assert.equal(elements.get('#image-coverage').textContent,'이미지 40/755');
 assert.match(elements.get('#main').innerHTML,/원문 출처/);assert.equal(app.state.reviews.p001.note,'보존할 메모');
 const restored=await boot({database,memory});assert.equal(restored.app.state.localSources.size,0);
});

test('failed body deletion never removes its persisted source image',async()=>{
 const context=await boot();await context.app.importLocalSourceFile(file([row('p001')]));
 context.storageControl.failWrites=true;await context.app.clearLocalSource('p001');
 assert.equal(context.app.state.localSources.size,1);
 assert.deepEqual(context.database.records().map(q=>q.id),['p001']);
 assert.match(context.elements.get('#toast').textContent,/지우지 못했습니다/);
});

test('a failed startup read is recovered before a partial import replaces saved sources',async()=>{
 const database=createIndexedDBFixture({records:[row('p001')],failRead:true});
 const context=await boot({database});assert.equal(context.app.state.localSources.size,0);
 database.failRead=false;await context.app.importLocalSourceFile(file([row('2632')]));
 assert.deepEqual(database.records().map(q=>q.id).sort(),['2632','p001']);
 assert.equal(context.app.state.localSources.size,2);
});

test('a throwing IndexedDB getter cannot prevent the public archive from opening',async()=>{
 const context=await boot({blockedIndexedDB:true});
 assert.equal(context.elements.get('#text-coverage').textContent,'본문 40/755');
 assert.match(context.elements.get('#main').innerHTML,/원문 출처/);
 assert.doesNotMatch(context.elements.get('#main').innerHTML,/문항 데이터를 불러오지 못했습니다/);
});

test('an unrecovered database read never lets a partial import erase saved originals',async()=>{
 const database=createIndexedDBFixture({records:[row('p001')],failRead:true});
 const context=await boot({database});await context.app.importLocalSourceFile(file([row('2632')]));
 assert.deepEqual(database.records().map(q=>q.id),['p001']);
 assert.equal(context.app.state.localSources.size,0);
 assert.match(context.elements.get('#toast').textContent,/저장된 원문을 읽지 못했습니다/);
});

test('an aborted image deletion restores the legacy body snapshot as well',async()=>{
 const context=await boot();await context.app.importLocalSourceFile(file([row('p001')]));
 context.database.abortOnCommit=true;await context.app.clearLocalSource('p001');
 assert.deepEqual(context.database.records().map(q=>q.id),['p001']);
 assert.deepEqual(JSON.parse(context.memory.get(localText.LOCAL_TEXT_STORAGE_KEY)).questions.map(q=>q.id),['p001']);
 assert.equal(context.app.state.localSources.size,1);
});
