import test from 'node:test';import assert from 'node:assert/strict';
import {createTestDocument} from './test-dom.mjs';import {readFile} from 'node:fs/promises';
const api=await import('./adr13-table.mjs').catch(()=>({}));
test('첨부 β표와 강의록의 세대·선택성·부가기전을 보존한 약물 정리를 제공한다',()=>{
 assert.equal(typeof api.ADR13_DRUG_TABLE,'object');const rows=api.ADR13_DRUG_TABLE;
 assert.equal(rows.length,29);assert.equal(new Set(rows.map(x=>x.id)).size,29);
 const by=id=>rows.find(x=>x.id===id);
 for(const id of ['penbutolol','carteolol','betaxolol','nebivolol','celiprolol'])assert.ok(by(id));
 assert.equal(by('carteolol').selectivity,'β1·β2');assert.equal(by('celiprolol').selectivity,'β1');
 assert.deepEqual(by('carvedilol').extras,['alpha1','calcium','antioxidant']);assert.deepEqual(by('celiprolol').extras,['no','beta2','alpha1','antioxidant']);
});
test('13강 정리 탭은 검색·계열 필터·6약물 부가기전 표를 제공하며 퀴즈 탭과 전환한다',async()=>{
 assert.equal(typeof api.initAdr13Table,'function');
 const doc=createTestDocument(await readFile(new URL('index.html',import.meta.url),'utf8'));globalThis.document=doc;globalThis.localStorage={getItem(){},setItem(){}};globalThis.CSS={escape:x=>x};
 const table=api.initAdr13Table();table.open();const el=id=>doc.getElementById(id);
 assert.equal(el('adr13TableBody').children.length,29);assert.equal(el('adr13ExtraBody').children.length,6);
 el('adr13TableFilter').value='beta';el('adr13TableFilter').dispatch('change');assert.equal(el('adr13TableBody').children.length,17);
 el('adr13TableSearch').value='nebivolol';el('adr13TableSearch').dispatch('input');assert.equal(el('adr13TableBody').children.length,1);
 el('adr13TableSearch').value='찾을수없는약물';el('adr13TableSearch').dispatch('input');assert.equal(el('adr13TableEmpty').hidden,false);
 const {initAutonomicQuiz}=await import('./autonomic-quiz.mjs');const {ADR13_QUESTIONS,ADR13_MATCH}=await import('./adr13.mjs');
 const quiz=initAutonomicQuiz({prefix:'adr13',viewId:'adr13View',bank:ADR13_QUESTIONS,matchItems:ADR13_MATCH,storageKey:'test-adr13',table});quiz.open();el('adr13TableTab').click();assert.equal(el('adr13TablePanel').hidden,false);assert.equal(el('adr13QuizPanel').hidden,true);assert.equal(el('adr13DragPanel').hidden,true);
 el('adr13QuizTab').click();assert.equal(el('adr13TablePanel').hidden,true);el('adr13DragTab').click();assert.equal(el('adr13TablePanel').hidden,true);assert.ok(el('adr13Cards').children.length);
});
