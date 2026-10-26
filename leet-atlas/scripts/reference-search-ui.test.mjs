import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as core from '../core.mjs';
import * as tagGroups from '../tag-groups.mjs';
import * as localText from '../local-text.mjs';
import * as localSources from '../local-sources.mjs';
import * as sidebar from '../sidebar.mjs';
const references=await import('../reference-search.mjs').catch(()=>({}));
const source=(await readFile(new URL('../app.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n/gm,'');
const archive=JSON.parse(await readFile(new URL('../data/archive.json',import.meta.url),'utf8'));
const example='인문 논리학 소재의, 2명이 서로 싸우는 문항';

async function boot({hash='#/questions',createSemanticSearch=()=>({search:async()=>new Map(),dispose(){}})}={}){
 const elements=new Map(),events=new Map(),memory=new Map();
 const element=key=>{
  if(!elements.has(key))elements.set(key,{innerHTML:'',textContent:'',hidden:false,value:'',dataset:{},classList:{add(){},toggle(){}},style:{setProperty(){}},addEventListener(){},focus(){},setAttribute(){},removeAttribute(){},getClientRects(){return[1]}});
  return elements.get(key);
 };
 const location={hash,href:'https://afratoxin.github.io/leet-atlas/'+hash};
 const env={document:{querySelector:element,querySelectorAll:()=>[],addEventListener:(k,f)=>events.set(k,f)},location,window:{addEventListener(){},scrollTo(){}},history:{replaceState(_a,_b,path){location.hash=path}},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},navigator:{},fetch:async()=>({ok:true,json:async()=>structuredClone(archive)}),...core,...tagGroups,...localText,...localSources,...sidebar,...references,createSemanticSearch};
 const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
 const app=await new AsyncFunction(...Object.keys(env),source+'\nreturn {state,render,filteredQuestions,refreshSemanticSearch:typeof refreshSemanticSearch === "function" ? refreshSemanticSearch : null};')(...Object.values(env));
 return {app,elements,events,location};
}

test('recommendation search exposes two modes and explains actual reference matches',async()=>{
 const {app,elements}=await boot();
 assert.match(elements.get('#main').innerHTML,/id="search-mode"/);
 assert.equal(app.state.searchMode,'recommend');
 app.state.query=example;app.render();
 const ids=app.filteredQuestions().slice(0,10).map(q=>q.id);
 assert.ok(['1321','1512','1717','2218','2318'].filter(id=>ids.includes(id)).length>=3,ids.join(','));
 assert.match(elements.get('#question-list').innerHTML,/추천 근거/);
 assert.match(elements.get('#search-status').textContent,/관련 표현|문장/);
 app.state.searchMode='keyword';
 assert.equal(app.filteredQuestions().length,0);
});

test('recommendations keep explicitly selected taxonomy filters strict',async()=>{
 const year=archive.taxonomy.find(t=>t.axis==='year'&&t.label.includes('2022'));
 const {app}=await boot({hash:`#/questions?tag=${year.id}`});
 app.state.query='두 사람이 서로 논박하는 대화';
 const results=app.filteredQuestions();
 assert.ok(results.length>0);
 assert.ok(results.every(q=>q.examKey==='2022'));
});

test('late semantic responses cannot overwrite a newer query or keyword mode',async()=>{
 const pending=[];
 const {app}=await boot({createSemanticSearch:()=>({search:q=>new Promise(resolve=>pending.push({q,resolve})),dispose(){}})});
 assert.equal(typeof app.refreshSemanticSearch,'function');
 app.state.query='첫 검색';const first=app.refreshSemanticSearch();
 app.state.query='새 검색';const second=app.refreshSemanticSearch();
 pending[1].resolve(new Map([['2218',0.9]]));await second;
 pending[0].resolve(new Map([['1321',0.95]]));await first;
 assert.equal(app.state.semanticQuery,'새 검색');
 assert.equal(app.state.semanticScores.get('2218'),0.9);
 assert.ok(!app.state.semanticScores.has('1321'));
 app.state.query='세 번째';const third=app.refreshSemanticSearch();app.state.searchMode='keyword';
 pending[2].resolve(new Map([['1512',0.99]]));await third;
 assert.ok(!app.state.semanticScores.has('1512'));
});

test('failed semantic initialization leaves useful lightweight search and a truthful status',async()=>{
 const {app,elements}=await boot({createSemanticSearch:()=>({search:async()=>{throw new Error('network failed')},dispose(){}})});
 assert.equal(typeof app.refreshSemanticSearch,'function');
 app.state.query=example;app.render();await app.refreshSemanticSearch();
 assert.equal(app.state.semanticStatus.state,'fallback');
 assert.match(elements.get('#search-status').textContent,/관련 표현|준비하지 못/);
 assert.ok(app.filteredQuestions().length>0);
});

test('a worker fallback status is not relabeled as completed semantic comparison',async()=>{
 const {app}=await boot({createSemanticSearch:({onStatus})=>({search:async()=>{onStatus({state:'fallback'});return new Map()},dispose(){}})});
 app.state.query=example;await app.refreshSemanticSearch();
 assert.equal(app.state.semanticStatus.state,'fallback');
 assert.equal(app.state.semanticQuery,'');
});

test('cancelled query statuses cannot label a pending query or poison its semantic client',async()=>{
 const clients=[];
 const {app,events}=await boot({createSemanticSearch:({onStatus})=>{
  const client={failed:false,resolve:null,emit:status=>{if(status.state==='fallback')client.failed=true;onStatus(status)},search:query=>!query||client.failed?Promise.resolve(new Map()):new Promise(resolve=>{client.resolve=resolve}),dispose(){}};
  clients.push(client);return client;
 }});
 app.state.query='첫 검색';const old=app.refreshSemanticSearch();
 events.get('input')({target:{id:'question-search',value:'다음 검색',hasAttribute:()=>false}});
 clients[0].emit({state:'ready'});
 assert.notEqual(app.state.semanticStatus.state,'ready');
 clients[0].emit({state:'fallback'});
 const current=app.refreshSemanticSearch();
 assert.equal(clients.length,2);
 clients[1].resolve(new Map([['2218',0.9]]));await current;
 clients[0].resolve(new Map());await old;
 assert.equal(app.state.semanticQuery,'다음 검색');
 assert.equal(app.state.semanticScores.get('2218'),0.9);
 assert.equal(app.state.semanticStatus.state,'ready');
});

test('history restores chronological and accuracy sorts without a stale local override',async()=>{
 const {app,events,location,elements}=await boot();
 app.state.query='법률';
 events.get('change')({target:{id:'question-sort',value:'oldest'}});app.render();
 const oldest=app.filteredQuestions().slice(0,10).map(q=>q.id);
 events.get('change')({target:{id:'question-sort',value:'accuracy'}});app.render();
 const accuracy=app.filteredQuestions().slice(0,10).map(q=>q.id);
 assert.notDeepEqual(oldest,accuracy);
 location.hash='#/questions?sort=oldest';app.render();
 assert.equal(elements.get('#question-sort').value,'oldest');
 assert.deepEqual(app.filteredQuestions().slice(0,10).map(q=>q.id),oldest);
 location.hash='#/questions?sort=accuracy';app.render();
 assert.deepEqual(app.filteredQuestions().slice(0,10).map(q=>q.id),accuracy);
 events.get('change')({target:{id:'question-sort',value:'relevance'}});app.render();
 assert.equal(elements.get('#question-sort').value,'relevance');
});
