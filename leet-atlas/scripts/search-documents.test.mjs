import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {questionSearchSections,questionSearchText,buildSearchDocuments,questionForm} from '../search-documents.mjs';

const questions=JSON.parse(readFileSync(new URL('../data/archive.json',import.meta.url),'utf8')).questions;
const q=id=>questions.find(question=>question.id===id);

test('all five option explanations are searchable, including the discriminating-evidence error',()=>{
  const sections=questionSearchSections(q('1225'));
  for(const option of q('1225').options)assert.ok(sections.some(section=>section.label.includes(String(option.number))&&section.text.includes(option.explanation)));
  assert.match(questionSearchText(q('1225')),/차별 평가할 수 없다/);
  assert.ok(sections.some(section=>section.kind==='option'&&section.text.includes(q('1225').sourceOptions[0].text.replace(/\s+/g,' ').trim())));
  assert.ok(buildSearchDocuments([q('1225')]).some(document=>document.text===q('1225').options[0].explanation));
});

test('statements, traps and tail explanations are independent labelled evidence',()=>{
  const fixture={id:'x',title:'본문',text:'서론',sourceOptions:[{number:1,text:'판단문'}],options:[{number:1,correct:false,explanation:'이 설명의 고유한 꼬리 근거'}],statements:[{label:'ㄷ',verdict:false,explanation:'공통 입장은 반박이 아니다'}],pitfalls:['어떤 선택지의 채점 여부와 진술의 참은 다르다']};
  const sections=questionSearchSections(fixture);
  assert.ok(sections.some(s=>s.label.includes('ㄷ')&&s.text.includes('공통 입장은 반박이 아니다')));
  assert.ok(sections.some(s=>s.kind==='pitfall'&&s.text.includes(fixture.pitfalls[0])));
  assert.ok(buildSearchDocuments([fixture]).some(d=>d.text.includes('고유한 꼬리 근거')));
});

test('a previously unseen explanation phrase is available without a registered category',()=>{
  const fixture={id:'x',title:'새 문항',text:'대화',options:[{number:5,explanation:'사진의 그림자 길이로 천체의 높이를 역산한다'}]};
  assert.ok(buildSearchDocuments([fixture]).some(d=>d.text.includes('그림자 길이로 천체의 높이를 역산')));
});

test('forms distinguish full statements, referenced combinations, ordering and missing image choices',()=>{
  assert.equal(questionForm(q('1512')).choice,'statements');
  assert.equal(questionForm(q('2701')).choice,'combination');
  assert.equal(questionForm(q('1510')).choice,'combination');
  assert.equal(questionForm(q('1907')).choice,'combination');
  assert.equal(questionForm(q('1422')).choice,'combination');
  assert.equal(questionForm(q('2703')).choice,'ordering');
  assert.equal(questionForm(q('1708')).choice,'paired');
  assert.equal(questionForm(q('2319')).choice,'image');
  assert.equal(questionForm(q('1411')).choice,'statements');
  assert.equal(questionForm(q('1618')).choice,'statements');
  assert.equal(questionForm(q('1807')).choice,'values');
  assert.equal(questionForm(q('2627')).choice,'values');
});

test('completion task uses the actual question instruction instead of an incidental blank word',()=>{
  assert.equal(questionForm(q('0914')).completion,true);
  assert.equal(questionForm(q('1616')).completion,true);
  assert.equal(questionForm(q('2631')).completion,true);
  assert.equal(questionForm({sourceStem:'다음 설명으로 옳은 것은?\n\n표에는 빈칸이 많다.',sourceOptions:[]}).completion,false);
  assert.equal(questionForm({text:'다음 표를 보고 옳은 것을 고르시오.\n\n빈칸이 존재한다.'}).completion,false);
});

test('visually inspected blanks have source-bound shape evidence, changed text does not inherit it',()=>{
  const section=questionSearchSections(q('0914')).find(s=>s.kind==='visual');
  assert.ok(section.text.includes('박스'));
  assert.ok(section.text.includes('[A]'));
  assert.ok(!questionSearchSections({...q('0914'),text:'새로운 교정 원문'}).some(s=>s.kind==='visual'));
});

test('shape descriptions and calculation context do not depend on example queries',()=>{
  assert.match(questionSearchText(q('1512')),/독립.*선택지|선택지.*독립/);
  assert.match(questionSearchText(q('1807')),/계산/);
  assert.ok(!questionSearchSections(q('1332')).some(s=>s.kind==='features'&&s.text.includes('법률')));
});

test('documents have provenance, bounded chunks, complete tails and immutable records',()=>{
  const before=JSON.stringify(questions);
  const documents=buildSearchDocuments(questions);
  assert.equal(new Set(documents.map(d=>d.id)).size,755);
  assert.ok(documents.every(d=>d.kind&&d.label&&d.text.length>0&&d.text.length<=700));
  for(const question of questions)for(const option of question.options)assert.ok(documents.some(d=>d.id===question.id&&d.text.includes(option.explanation.slice(-Math.min(40,option.explanation.length)).replace(/\s+/g,' ').trim())),question.id+':'+option.number);
  assert.equal(JSON.stringify(questions),before);
});
