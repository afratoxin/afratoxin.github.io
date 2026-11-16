import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {QUESTIONS} from './bank.mjs';
import {TABLE_QUESTIONS} from './study-bank.mjs';

test('course entry points live in the hub, not in the top navigation',()=>{
 const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
 const nav=html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/)[0];
 assert.deepEqual([...nav.matchAll(/data-tab="([^"]+)"/g)].map(m=>m[1]),['home','bookmarks','review']);
 assert.doesNotMatch(nav,/role="tab/);
 const home=html.slice(html.indexOf('id="panel-home"'),html.indexOf('id="panel-quiz"'));
 assert.match(home,/id="homeLectureUnits"[^>]*>단원별 학습/);
 assert.match(home,/id="homeLectureStart"[^>]*>종합 학습/);
});

test('all antibiotic questions stand alone without a lecture or case-number lookup',()=>{
 assert.ok(QUESTIONS.length>=32);
 for(const q of QUESTIONS)assert.doesNotMatch(q.stem,/강의|증례\s*\d|PDF|다음 장면/,q.id);
 for(const q of QUESTIONS.filter(q=>q.format==='ox')){
  assert.match(q.stem,/\(O\/X\)$/);assert.doesNotMatch(q.stem,/인가\?|있는가\?/);
 }
 const pregnancy=QUESTIONS.filter(q=>q.topic==='pregnancy'&&q.format==='mcq');
 assert.ok(pregnancy.every(q=>q.choices.every(c=>c.length<55)));
 assert.ok(pregnancy.every(q=>!q.choices.includes('주의')));
});

test('table copies use the revised antibiotic question and answer',()=>{
 for(const q of TABLE_QUESTIONS.filter(q=>q.id.startsWith('table-abx-'))){
  const original=QUESTIONS.find(x=>'table-abx-'+x.id===q.id);
  assert.ok(original);assert.equal(q.stem,original.stem);assert.deepEqual(q.choices,original.choices);assert.equal(q.answer,original.answer);
 }
});
