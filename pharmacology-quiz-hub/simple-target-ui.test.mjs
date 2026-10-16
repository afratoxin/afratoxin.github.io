import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {createTestDocument} from './test-dom.mjs';import {studyStore} from './study-records.mjs?v=20261015-review1';
const api=await import('./simple-target-quiz.mjs').catch(()=>({}));
test('단순 매칭은 다른 탭 키보드를 차단하고 실제 문항의 최신 결과만 별도 저장한다',async()=>{
 assert.equal(typeof api.initSimpleTargetQuiz,'function');
 const {SIMPLE_BANKS}=await import('./simple-target-data.mjs');const doc=createTestDocument(await readFile(new URL('index.html',import.meta.url),'utf8')),disk=new Map();globalThis.document=doc;globalThis.localStorage={getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)};const el=id=>doc.getElementById(id);
 for(const [scope,prefix,view]of [['immune-simple','immSimple','immuneView'],['anticancer-simple','antiSimple','anticancerView'],['signal-simple','sigSimple','signalView']]){
  studyStore.register({id:scope,items:SIMPLE_BANKS[scope].map(q=>q.id),build:id=>SIMPLE_BANKS[scope].find(q=>q.id===id)});
  const panel=el(prefix+'Panel');panel.hidden=false;el(view).hidden=false;const quiz=api.initSimpleTargetQuiz({scope,prefix,viewId:view});quiz.open();assert.equal(el(prefix+'Choices').children.length,5);assert.equal(studyStore.counts(scope).solved,0);
  el(prefix+'Skip').click();assert.equal(studyStore.counts(scope).solved,0);
  el(prefix+'Choices').children[0].click();assert.equal(studyStore.counts(scope).solved,1);el(prefix+'Choices').children[1].click();assert.equal(studyStore.counts(scope).solved,1);
  const e=doc.dispatch('keydown',{key:'Enter',target:doc.createElement('button')});assert.ok(!e.defaultPrevented);
  doc.dispatch('keydown',{key:'Enter',target:doc.createElement('div')});assert.equal(el(prefix+'Feedback').hidden,true);
  panel.hidden=true;doc.dispatch('keydown',{key:'2',target:doc.createElement('div')});assert.equal(studyStore.counts(scope).solved,1);panel.hidden=false;el(view).hidden=true;doc.dispatch('keydown',{key:'2',target:doc.createElement('div')});assert.equal(studyStore.counts(scope).solved,1);
  assert.ok(disk.has('pharmacology-'+scope+'-v1'));
 }
});
