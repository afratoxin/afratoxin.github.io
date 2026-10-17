import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pickQuestion,initAutonomicQuiz} from './autonomic-quiz.mjs';
import {registerLectureStudies} from './study-catalog.mjs';
import {createTestDocument} from './test-dom.mjs';
const api=await import('./adr13-beta.mjs').catch(()=>({}));
const nonselective=['propranolol','timolol','pindolol','nadolol','penbutolol','carvedilol','carteolol','labetalol'];
const beta1=['metoprolol','atenolol','esmolol','bisoprolol','celiprolol','betaxolol','nebivolol','acebutolol'];

test('β 선택성 전용 문항·카드는 지정 16개만 포함하고 5지선다 정답은 하나다',()=>{
 assert.ok(Array.isArray(api.ADR13_BETA_ITEMS),'dedicated 16-drug classification is available');
 const items=api.ADR13_BETA_ITEMS,bank=api.ADR13_BETA_QUESTIONS;
 assert.deepEqual(items.map(x=>x.drug).sort(),[...nonselective,...beta1].sort());
 assert.equal(new Set(items.map(x=>x.drug)).size,16);assert.equal(bank.length,16);
 const category=new Map(items.map(x=>[x.drug,x.category]));
 for(const [drugs,label]of [[nonselective,'비선택성 β 봉쇄제'],[beta1,'β1 선택성 봉쇄제']])for(const d of drugs)assert.equal(category.get(d),label);
 assert.deepEqual(bank.map(q=>q.answer).sort(),[...category.keys()].sort());
 for(const q of bank){assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);assert.equal(q.options.filter(d=>category.get(d)===q.group).length,1);assert.equal(category.get(q.answer),q.group);assert.equal(q.details.length,5);for(const d of q.options)assert.ok(q.details.some(s=>s.startsWith(d+':')&&s.includes(category.get(d))));}
 const state={recent:[],seen:{},missed:{},lastGroup:null};const covered=new Set();
 for(let n=0;n<1000;n++){const q=pickQuestion(bank,state);assert.notEqual(q.group,state.lastGroup);assert.ok(!state.recent.includes(q.id));assert.equal(q.choices.length,5);assert.equal(q.choices[q.answerIndex].text,q.answer);covered.add(q.id);state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.lastGroup=q.group;}
 assert.equal(covered.size,16);assert.ok(Math.max(...Object.values(state.seen))-Math.min(...Object.values(state.seen))<=1);
});

test('13강의 다섯 탭은 하나씩 열리고 숨겨진 객관식은 키보드 채점되지 않는다',async()=>{
 assert.equal(typeof api.ADR13_BETA_QUESTIONS,'object');
 const doc=createTestDocument(await readFile(new URL('index.html',import.meta.url),'utf8'));globalThis.document=doc;globalThis.CSS={escape:x=>x};globalThis.localStorage={getItem(){},setItem(){}};
 const {studyStore}=await import('./study-records.mjs?v=20261015-review1');registerLectureStudies();
 const {ADR13_QUESTIONS,ADR13_MATCH}=await import('./adr13.mjs');const el=id=>doc.getElementById(id);el('adr13View').hidden=false;
 const beta=initAutonomicQuiz({prefix:'adr13Beta',studyId:'adr13-beta',viewId:'adr13View',bank:api.ADR13_BETA_QUESTIONS,matchItems:api.ADR13_BETA_ITEMS,storageKey:'test-beta',manageTabs:false});
 const main=initAutonomicQuiz({prefix:'adr13',viewId:'adr13View',bank:ADR13_QUESTIONS,matchItems:ADR13_MATCH,storageKey:'test-main',table:{open(){}},extraTabs:[{suffix:'BetaQuiz',name:'beta-quiz',open:()=>beta.openTab('quiz')},{suffix:'BetaDrag',name:'beta-drag',open:()=>beta.openTab('drag')}]});
 main.open();const suffixes=['Quiz','Drag','Table','BetaQuiz','BetaDrag'];
 for(const active of ['BetaQuiz','Drag','BetaDrag','Table','Quiz','BetaQuiz']){el('adr13'+active+'Tab').click();for(const suffix of suffixes){assert.equal(el('adr13'+suffix+'Panel').hidden,suffix!==active,suffix);assert.equal(el('adr13'+suffix+'Tab').getAttribute('aria-selected'),String(suffix===active));}if(active==='BetaDrag'){assert.equal(el('adr13BetaCards').children.length,16);assert.equal(el('adr13BetaZones').children.length,2);}}
 assert.equal(studyStore.counts('adr13-beta').solved,0);assert.equal(studyStore.counts('adr13').solved,0);
 el('adr13TableTab').click();doc.dispatch('keydown',{key:'1',target:doc.createElement('div')});assert.equal(studyStore.counts('adr13-beta').solved,0);assert.equal(studyStore.counts('adr13').solved,0);
 el('adr13BetaQuizTab').click();doc.dispatch('keydown',{key:'1',target:doc.createElement('div')});assert.equal(studyStore.counts('adr13-beta').solved,1);assert.equal(studyStore.counts('adr13').solved,0);assert.equal(el('adr13BetaFeedback').querySelectorAll('li').length,5);
 assert.equal(studyStore.counts('adr13-beta-match').total,16);
});
