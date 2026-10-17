import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {createTestDocument} from './test-dom.mjs';import {studyStore} from './study-records.mjs?v=20261015-review1';
const api=await import('./abx-quiz.mjs').catch(()=>({}));
test('항생제 새 화면의 두 세트·강의 필터·키보드·최신 오답 기록이 독립적으로 동작한다',async()=>{
 assert.equal(typeof api.initAbxQuiz,'function');const {ABX_SIMPLE,ABX_QUESTIONS}=await import('./abx-data.mjs');const doc=createTestDocument(await readFile(new URL('index.html',import.meta.url),'utf8')),disk=new Map();globalThis.document=doc;globalThis.localStorage={getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)};const el=id=>doc.getElementById(id);
 for(const [id,bank]of [['abx-simple',ABX_SIMPLE],['abx',ABX_QUESTIONS]])studyStore.register({id,items:bank.map(q=>q.id),build:id=>bank.find(q=>q.id===id)});
 el('abxView').hidden=false;const quiz=api.initAbxQuiz();quiz.open();assert.equal(el('abxChoices').children.length,5);assert.equal(el('abxSimplePanel').hidden,true);el('abxSimpleTab').click();assert.equal(el('abxSimpleChoices').children.length,5);
 el('abxSimpleChoices').children[0].click();assert.equal(studyStore.counts('abx-simple').solved,1);el('abxSimpleChoices').children[1].click();assert.equal(studyStore.counts('abx-simple').solved,1);
 const e=doc.dispatch('keydown',{key:'Enter',target:doc.createElement('button')});assert.ok(!e.defaultPrevented);doc.dispatch('keydown',{key:'Enter',target:doc.createElement('div')});assert.equal(el('abxSimpleFeedback').hidden,true);
 el('abxQuizTab').click();assert.equal(el('abxSimplePanel').hidden,true);assert.equal(el('abxChoices').children.length,5);el('abxLecture').value='25';el('abxLecture').dispatch('change');assert.match(el('abxSource').textContent,/25강/);
 el('abxQuestionType').value='features';el('abxQuestionType').dispatch('change');assert.match(el('abxStem').textContent,/옳은 것은|옳지 않은 것은/);
 el('abxChoices').children[0].click();assert.equal(studyStore.counts('abx').solved,1);assert.equal(studyStore.counts('abx-simple').solved,1);
 el('abxSimpleTab').click();el('abxSimpleLecture').value='27';el('abxSimpleLecture').dispatch('change');assert.match(el('abxSimpleSource').textContent,/27강/);
 el('abxSimpleLecture').value='999';el('abxSimpleLecture').dispatch('change');assert.equal(el('abxSimpleChoices').children.length,0,'문항이 없는 범위에는 이전 문항을 남기지 않는다');assert.match(el('abxSimpleStem').textContent,/문항이 없습니다/);doc.dispatch('keydown',{key:'1',target:doc.createElement('div')});assert.equal(studyStore.counts('abx-simple').solved,1);
 el('abxView').hidden=true;doc.dispatch('keydown',{key:'2',target:doc.createElement('div')});assert.equal(studyStore.counts('abx-simple').solved,1);assert.equal(studyStore.counts('abx').solved,1);
 assert.ok(disk.has('pharmacology-abx-simple-v1'));assert.ok(disk.has('pharmacology-abx-v1'));
});
