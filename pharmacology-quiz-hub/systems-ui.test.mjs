import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {createTestDocument} from './test-dom.mjs';
import {registerLectureStudies} from './study-catalog.mjs';
import {studyStore} from './study-records.mjs?v=20261015-review1';
const ui=await import('./systems-quiz.mjs').catch(()=>({}));
const data=await import('./systems-data.mjs').catch(()=>({}));
const html=await readFile(new URL('index.html',import.meta.url),'utf8');

test('three real quiz views grade once, explain all shuffled options, and ignore skipped or hidden answers',()=>{
 assert.equal(typeof ui.initSystemsQuiz,'function');
 const doc=createTestDocument(html),disk=new Map();globalThis.document=doc;globalThis.localStorage={getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)};
 registerLectureStudies();
 for(const scope of ['endocrine','renal','cardio']){
  const el=s=>doc.getElementById(scope+s);assert.ok(doc.querySelector('.hub-card[data-open="'+scope+'"]'));
  el('View').hidden=false;const quiz=ui.initSystemsQuiz(scope);quiz.open();
  assert.equal(el('Choices').children.length,5);const n=studyStore.counts(scope).solved;el('Skip').click();assert.equal(studyStore.counts(scope).solved,n);
  const stem=el('Stem').textContent,q=data.SYSTEMS_BANKS[scope].find(q=>q.stem===stem);assert.ok(q);
  const choices=el('Choices').children.map(b=>b.children[1].textContent),wrong=choices.findIndex(c=>c!==q.answer);
  el('Choices').children[wrong].click();assert.equal(studyStore.status(scope,q.id),'wrong');
  assert.equal(el('Feedback').querySelectorAll('li').length,5);
  for(const [i,row]of el('Feedback').querySelectorAll('li').entries())assert.ok(row.textContent.includes(choices[i]+':'));
  assert.deepEqual(studyStore.wrong(scope).find(x=>x.id===q.id).question.choices,choices);
  assert.equal(studyStore.counts(scope).total,40);el('Choices').children[wrong].click();assert.equal(studyStore.counts(scope).solved,n+1);
  el('View').hidden=true;el('Next').click();const before=studyStore.counts(scope).solved;doc.dispatch('keydown',{key:'1',target:doc.createElement('div')});assert.equal(studyStore.counts(scope).solved,before);
 }
});
