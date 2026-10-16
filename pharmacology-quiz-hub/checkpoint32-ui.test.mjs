import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {createTestDocument} from './test-dom.mjs';
import {C32_DRUGS,C32_QUESTIONS,C32_FEATURE_CARDS} from './checkpoint32-data.mjs';
import {createStudyStore} from './study-records.mjs';
import {studyStore} from './study-records.mjs?v=20261015-review1';
import {registerLectureStudies} from './study-catalog.mjs';
const api=await import('./checkpoint32-quiz.mjs').catch(()=>({}));
test('32강 객관식 46문항과 두 드래그 전체가 오답 복습·진도에 등록된다',()=>{
 const s=createStudyStore({getItem(){},setItem(){}});registerLectureStudies(s);
 for(const [id,count,type]of [['checkpoint32',46,'quiz'],['checkpoint32-target',8,'match'],['checkpoint32-car',11,'match']]){const d=s.definitions.get(id);assert.ok(d,id);assert.equal(d.items.size,count);assert.equal(d.route,'checkpoint32');assert.equal(d.type,type);}
 const q=C32_QUESTIONS[0];s.record('checkpoint32',q,false);assert.equal(s.counts('checkpoint32').wrong,1);s.record('checkpoint32',q,true);assert.equal(s.wrong('checkpoint32').length,0);assert.equal(s.counts('checkpoint32').total,46);
});
test('실제 32강 화면은 채점·전 선지 해설·영역 선택·키보드와 약물·CAR 드래그를 연결한다',async()=>{
 assert.equal(typeof api.initCheckpointQuiz,'function');
 const doc=createTestDocument(await readFile(new URL('index.html',import.meta.url),'utf8')),disk=new Map();globalThis.document=doc;globalThis.localStorage={getItem:k=>disk.get(k),setItem:(k,v)=>disk.set(k,v)};globalThis.CSS={escape:x=>x};const el=id=>doc.getElementById(id);
 studyStore.register({id:'checkpoint32',items:C32_QUESTIONS.map(q=>q.id),build:id=>C32_QUESTIONS.find(q=>q.id===id)});
 studyStore.register({id:'checkpoint32-target',type:'match',items:C32_DRUGS});studyStore.register({id:'checkpoint32-car',type:'match',items:C32_FEATURE_CARDS});
 el('checkpoint32View').hidden=false;const quiz=api.initCheckpointQuiz();quiz.open();assert.equal(el('c32Choices').children.length,5);assert.equal(studyStore.counts('checkpoint32').solved,0);
 const choices=el('c32Choices').children.map(b=>b.children[1].textContent),q=C32_QUESTIONS.find(q=>q.stem===el('c32Stem').textContent&&choices.every(c=>q.options.includes(c)));assert.ok(q);
 el('c32Choices').children[choices.findIndex(c=>c!==q.answer)].click();assert.equal(studyStore.counts('checkpoint32').wrong,1);assert.equal(el('c32Feedback').querySelectorAll('li').length,5);
 el('c32Choices').children[0].click();assert.equal(studyStore.counts('checkpoint32').solved,1);
 const native=doc.dispatch('keydown',{key:'Enter',target:doc.createElement('button')});assert.ok(!native.defaultPrevented);doc.dispatch('keydown',{key:'Enter',target:doc.createElement('div')});assert.ok(el('c32Feedback').hidden);
 el('c32Area').value='car';el('c32Area').dispatch('change');assert.match(el('c32Stem').textContent,/32강 비교표/);el('c32Skip').click();assert.equal(studyStore.counts('checkpoint32').solved,1);
 el('c32TargetTab').click();assert.equal(el('c32TargetCards').children.length,8);assert.equal(el('c32TargetZones').children.length,3);assert.equal(el('c32TargetTableBody').children.length,3);
 const place=(prefix,label,category)=>{const card=el(prefix+'Pool').querySelectorAll('.drug-chip').concat(el(prefix+'Zones').querySelectorAll('.drug-chip')).find(c=>c.textContent===label);assert.ok(card,label);card.click();el(prefix+'Zones').children.find(z=>z.dataset.category===category).click();};
 place('c32Target','Ipilimumab','PD-1 차단');el('c32TargetCheck').click();assert.equal(studyStore.counts('checkpoint32-target').wrong,1);assert.equal(studyStore.counts('checkpoint32-target').solved,1);
 el('c32TargetPool').querySelector('.match-wrong-toggle').click();assert.equal(el('c32TargetCards').children.length,1);place('c32Target','Ipilimumab','CTLA-4 차단');el('c32TargetCheck').click();assert.equal(studyStore.wrong('checkpoint32-target').length,0);
 el('c32CarTab').click();assert.equal(el('c32CarCards').children.length,11);assert.equal(el('c32CarTableBody').children.length,3);
 const shared=C32_FEATURE_CARDS.find(c=>c.id==='allogeneic').name;place('c32Car',shared,'CAR-NK');el('c32CarCheck').click();assert.equal(studyStore.counts('checkpoint32-car').correct,1);
 el('c32CarReset').click();place('c32Car',shared,'CAR-M');el('c32CarCheck').click();assert.equal(studyStore.counts('checkpoint32-car').correct,1);
 el('c32CarReset').click();place('c32Car',shared,'CAR-T');el('c32CarCheck').click();assert.equal(studyStore.counts('checkpoint32-car').wrong,1);assert.equal(studyStore.counts('checkpoint32-car').solved,1);
 doc.dispatch('keydown',{key:'1',target:doc.createElement('div')});assert.equal(studyStore.counts('checkpoint32').solved,1);
 el('c32QuizTab').click();el('checkpoint32View').hidden=true;doc.dispatch('keydown',{key:'1',target:doc.createElement('div')});assert.equal(studyStore.counts('checkpoint32').solved,1);
 assert.ok(disk.has('pharmacology-checkpoint-32-v1'));
});
test('32강은 같은 면역·항암 묶음의 탭과 허브·직접 주소에서 열리고 다른 화면에서는 숨겨진다',async()=>{
 const [html,app]=await Promise.all(['index.html','app.mjs'].map(f=>readFile(new URL(f,import.meta.url),'utf8')));assert.match(html,/class="hub-card[^"\n]*"[^>]*|data-open="checkpoint32"/);assert.match(html,/data-open="checkpoint32"/);assert.match(app,/if\(view==='checkpoint32'\)checkpoint32.open\(\)/);
 assert.match(app,/\[[^\]]*'checkpoint32'[^\]]*\]\.includes\(location\.hash\.slice\(1\)\)/);
 const {syncStudyFolder}=await import('./study-folder.mjs');const doc=createTestDocument(html),el=id=>doc.getElementById(id);syncStudyFolder('checkpoint32',doc);assert.equal(el('oncoView').hidden,false);assert.equal(el('checkpoint32View').hidden,false);assert.equal(el('signalView').hidden,true);assert.equal(el('checkpoint32UnitTab').getAttribute('aria-selected'),'true');syncStudyFolder('home',doc);assert.equal(el('checkpoint32View').hidden,true);
});
