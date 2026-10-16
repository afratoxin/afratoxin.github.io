import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CYP_FACTS,CYP_CASES,makeCypQuestion,makeCypCaseQuestion,initCypQuiz} from './cyp.mjs';
import {CYP3A45_FACTS,CYP3A45_LABELS,ddiCandidates,makeDdiClassificationQuestion,makeDdiEffectQuestion,initCyp3a45Quiz} from './cyp3a45.mjs';
import {ADR12_QUESTIONS,ADR12_MATCH} from './adr12.mjs';
import {ADR13_QUESTIONS,ADR13_MATCH} from './adr13.mjs';
import {createTestDocument} from './test-dom.mjs';
import {normalizeStudyQuestion} from './study-records.mjs';
const fixed=()=>0.31;

function checkPairs(q,options=q.options){
  assert.equal(q.format,'judgment');
  assert.equal(options.length,5);
  assert.equal(new Set(options).size,5);
  assert.equal(q.pairs.length,5);
  assert.equal(new Set(q.pairs.map(p=>p.entity)).size,5);
  const target=q.polarity==='incorrect'?false:true;
  assert.equal(q.pairs.filter(p=>p.valid===target).length,1);
  assert.equal(options[q.pairs.findIndex(p=>p.valid===target)],q.answer);
  assert.equal(q.details.length,5);
  assert.ok(q.details.every(s=>s.length>10));
  assert.ok(q.note.includes(q.answer));
  const saved=normalizeStudyQuestion(q);
  assert.equal(saved.choices[saved.answers[0]],q.answer);
  assert.deepEqual(saved.details,q.details);
}

test('CYP probes judge five distinct drug/enzyme statements with balanced polarities and original anchors',()=>{
  for(const direction of ['drug-to-enzyme','enzyme-to-drug']){
    const questions=CYP_FACTS.map(f=>makeCypQuestion(f,direction,fixed));
    assert.equal(questions.filter(q=>q.polarity==='correct').length,5);
    for(const [i,q]of questions.entries()){
      checkPairs(q,q.choices);
      assert.equal(q.fact,CYP_FACTS[i]);assert.equal(q.direction,direction);
      assert.match(q.stem,/강의록.*대표.*probe/);
      assert.ok(q.choices.every(x=>typeof x==='string'&&/강의록.*대표.*probe/.test(x)));
      assert.ok(q.pairs.some(p=>p.entity===q.fact.id));
      for(const p of q.pairs)assert.equal(p.correctRight,CYP_FACTS.find(f=>f.id===p.entity).enzyme);
    }
  }
  const c=makeCypCaseQuestion(CYP_CASES[0],fixed);
  assert.equal(c.stem,CYP_CASES[0].stem);assert.equal(c.answer,CYP_CASES[0].answer);
});

test('CYP3A4/5 classification judges lecture table pairs and retains all 40 IDs and kinds',()=>{
  assert.equal(ddiCandidates().length,40);assert.equal(new Set(ddiCandidates().map(c=>c.id)).size,40);
  const questions=CYP3A45_FACTS.map(f=>makeDdiClassificationQuestion(f,fixed));
  assert.ok(questions.some(q=>q.polarity==='correct'));assert.ok(questions.some(q=>q.polarity==='incorrect'));
  for(const q of questions){
    checkPairs(q,q.choices.map(c=>c.text));
    assert.equal(q.kind,'classification');assert.equal(q.id,`class:${q.fact.id}`);
    assert.equal(q.choices[q.answerIndex].text,q.answer);
    assert.equal(q.choices.filter(c=>c.correct).length,1);
    q.choices.forEach((c,i)=>{assert.equal(c.fact.id,q.pairs[i].entity);assert.equal(q.pairs[i].correctRight,CYP3A45_LABELS[c.fact.category]);});
  }
});

test('CYP3A4/5 exposure questions ask a complete statement judgment with the same pharmacologic result',()=>{
  for(const modifier of CYP3A45_FACTS.filter(f=>f.category!=='substrate'))for(const substrate of CYP3A45_FACTS.filter(f=>f.category==='substrate')){
    const q=makeDdiEffectQuestion(modifier,substrate,fixed),c=q.choices[q.answerIndex];
    assert.match(q.stem,/설명 중 옳은 것은/);assert.ok(q.stem.includes(modifier.drug)&&q.stem.includes(substrate.drug));
    assert.equal(c.pattern.metabolism,modifier.category==='inhibitor'?'감소':'증가');
    assert.equal(c.pattern.exposure,modifier.category==='inhibitor'?'증가':'감소');
  }
});

for(const [lecture,bank,match,oldCount]of [[12,ADR12_QUESTIONS,ADR12_MATCH,26],[13,ADR13_QUESTIONS,ADR13_MATCH,24]]){
  test(`${lecture}강 preserves original items and adds both polarities per named drug`,()=>{
    assert.equal(bank.length,oldCount+match.length*2);
    assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
    assert.ok(bank.slice(0,oldCount).every(q=>q.format!=='judgment'));
    const variants=bank.slice(oldCount);assert.ok(variants.length/bank.length>=0.5);
    for(const d of match){
      const rows=variants.filter(q=>q.anchor===d.drug);assert.equal(rows.length,2);
      assert.deepEqual(rows.map(q=>q.polarity).sort(),['correct','incorrect']);
      for(const q of rows){checkPairs(q);assert.match(q.source,new RegExp(`${lecture}강`));assert.ok(q.pairs.some(p=>p.entity===d.drug));}
    }
  });
}

test('CYP feedback renders the actual five statement explanations including false-pair corrections',()=>{
  const before={document:globalThis.document,localStorage:globalThis.localStorage,random:Math.random};
  try{
    const doc=createTestDocument(readFileSync(new URL('./index.html',import.meta.url),'utf8'));
    globalThis.document=doc;globalThis.localStorage={getItem(){return null;},setItem(){}};Math.random=fixed;
    const el=id=>doc.getElementById(id);
    initCypQuiz().open('cyp');
    const probe=makeCypQuestion(CYP_FACTS[3],'drug-to-enzyme',fixed);
    assert.equal(el('cypStem').textContent,probe.stem);
    el('cypChoices').children[0].click();
    assert.ok(el('cypFeedback').textContent.includes(probe.note));
    for(const detail of probe.details)assert.ok(el('cypFeedback').textContent.includes(detail));
    initCyp3a45Quiz();el('cypDdiTab').click();
    const ddi=makeDdiClassificationQuestion(CYP3A45_FACTS[3],fixed);
    assert.equal(el('cypDdiStem').textContent,ddi.stem);
    el('cypDdiChoices').children[0].click();
    assert.ok(el('cypDdiFeedback').textContent.includes(ddi.note));
    for(const detail of ddi.details)assert.ok(el('cypDdiFeedback').textContent.includes(detail));
  }finally{globalThis.document=before.document;globalThis.localStorage=before.localStorage;Math.random=before.random;}
});
