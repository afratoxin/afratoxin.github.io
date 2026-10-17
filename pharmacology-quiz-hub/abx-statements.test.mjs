import test from 'node:test';
import assert from 'node:assert/strict';
import {ABX_DRUGS,ABX_MECHANISMS,ABX_SIMPLE,ABX_QUESTIONS,pickAbxQuestion} from './abx-data.mjs';
import {ABX_FEATURE_GROUPS} from './abx-features.mjs';
import {QUESTIONS as core} from './abx-core-data.mjs';
import {QUESTIONS as bacterial} from './abx-bacterial-data.mjs';
import {QUESTIONS as extra} from './abx-extra-data.mjs';

test('남긴 문항의 ID·정답·출처는 보존하고 단순 기전의 정·역방향 중복은 제거한다',()=>{
 const original=[...core,...bacterial,...extra];
 for(const q of ABX_QUESTIONS){const old=original.find(x=>x.id===q.id);if(old){assert.equal(q.answer,old.answer,q.id);assert.equal(q.source,old.source);assert.equal(q.lecture,old.lecture);}}
 assert.equal(ABX_SIMPLE.length,ABX_DRUGS.length);
 for(const d of ABX_DRUGS){const qs=ABX_SIMPLE.filter(q=>q.subject===d.id);assert.equal(qs.length,1);assert.equal(qs[0].id,d.id+':'+d.targets[0]);assert.equal(qs[0].answer,ABX_MECHANISMS[d.targets[0]]);}
 assert.equal(ABX_QUESTIONS.filter(q=>q.format==='judgment').length,30);
 assert.ok(ABX_QUESTIONS.filter(q=>q.format==='judgment').every(q=>q.kind==='feature'));
});

test('판별형은 기전 대신 범위·독성·배설·상호작용을 비교하고 선지별 진릿값을 보존한다',()=>{
 const rows=ABX_FEATURE_GROUPS.flatMap(g=>g.rows);
 for(const q of ABX_QUESTIONS.filter(q=>q.format==='judgment')){
  assert.equal(q.pairs.length,5);assert.equal(new Set(q.pairs.map(p=>p.left)).size,5);
  assert.equal(q.pairs.filter(p=>p.valid).length,q.polarity==='correct'?1:4);
  for(const p of q.pairs){const r=rows.find(r=>r.id===p.entity);assert.ok(r);assert.equal(p.right,p.valid?r.right:r.wrong);assert.equal(p.correctRight,r.right);assert.equal(p.source,r.source);assert.ok(q.details.some(d=>d.startsWith(p.left+' — '+p.right+':')));}
 }
 // Counterexamples to the summary's incorrect simplifications.
 const r=id=>rows.find(r=>r.id===id);
 assert.match(r('vori-cyp').right,/CYP2C19/);assert.match(r('vori-cyp').wrong,/CYP2D6/);
 assert.match(r('rif').right,/효소 유도/);assert.match(r('itra-cyp').right,/억제/);
 assert.match(r('chlor-baby').right,/포합 대사 미성숙/);
 assert.match(r('vanco-resistance').right,/D-Ala-D-Ala/);assert.match(r('vanco-resistance').wrong,/PBP2a/);
 assert.match(r('doxy-child').right,/연령만으로 배제하지 않는다/);
 assert.match(r('nystatin').note,/경구 현탁액/);
 assert.match(r('teno').note,/모두 유효 표적/);
 assert.match(r('ag-tox').right,/신독성은 대체로 가역적이고 이독성은 비가역적/);
});

test('특징 전용 추출도 섞인 선지·정답·전 선지 해설을 원래 문항과 함께 반환한다',()=>{
 const target=ABX_QUESTIONS.find(q=>q.kind==='feature'&&q.polarity==='incorrect');
 const seen=Object.fromEntries(ABX_QUESTIONS.map(q=>[q.id,q.id===target.id?0:100]));
 const q=pickAbxQuestion('general',{seen},'all','core',()=>0.5,'features');
 assert.equal(q.id,target.id);assert.deepEqual(q.pairs,target.pairs);assert.equal(q.choices[q.answerIndex].text,target.answer);
 for(const c of q.choices)assert.ok(q.details.find(d=>d.startsWith(c.text+':')));
});
