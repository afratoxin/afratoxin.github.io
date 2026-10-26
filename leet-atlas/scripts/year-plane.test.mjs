import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {analyzeArchive,renderYearPlane} from '../year-analysis.mjs';
const archive=JSON.parse(await readFile(new URL('../data/archive.json',import.meta.url),'utf8'));

test('the two axes count modeling and evidence questions independently without double counting within an axis',()=>{
 const rows=[
  {id:'a',examKey:'2010',year:2010,number:1,types:['모형·수리 추론','논리 퍼즐','논증 평가']},
  {id:'b',examKey:'2010',year:2010,number:2,types:['논증 평가','실험 분석']},
  {id:'c',examKey:'2010',year:2010,number:3,types:['규칙·사례 적용']},
 ];
 const point=analyzeArchive(rows).byExam.get('2010').plane;
 assert.equal(point.modeling.count,1);
 assert.equal(point.evidence.count,2);
 assert.equal(point.modeling.percent,100/3);
 assert.equal(point.evidence.percent,200/3);
});
test('real corpus has one point per exam, percentage denominators, and distinct preliminary/main 2009 exams',()=>{
 const stats=analyzeArchive(archive.questions);
 assert.equal(stats.exams.length,20);
 assert.equal(stats.byExam.get('preliminary').plane.modeling.percent,42.5);
 assert.equal(stats.byExam.get('2009').plane.modeling.percent,30);
 assert.equal(stats.byExam.get('2010').plane.modeling.percent,100*11/35);
 assert.equal(stats.byExam.get('2027').plane.modeling.percent,30);
 assert.equal(stats.byExam.get('2027').plane.evidence.percent,27.5);
 for(const e of stats.exams) for(const p of Object.values(e.plane))assert.ok(p.percent>=0&&p.percent<=100);
});
test('scatter plot is linked, labeled and preserves coincident points without changing coordinates',()=>{
 const stats=analyzeArchive(archive.questions),html=renderYearPlane(stats,'2027');
 assert.equal((html.match(/data-year-point=/g)||[]).length,20);
 assert.match(html,/모형·수리 추론 비중/);
 assert.match(html,/논증·증거 평가 비중/);
 assert.match(html,/href="#\/analysis\/preliminary"/);
 assert.match(html,/href="#\/analysis\/2027"/);
 assert.match(html,/is-selected/);
 assert.match(html,/같은 좌표.*동심원/);
 assert.match(html,/<table/);
 assert.match(html,/role="group"/);
 assert.doesNotMatch(html,/NaN|undefined/);
 const e2014=stats.byExam.get('2014').plane,e2018=stats.byExam.get('2018').plane;
 assert.deepEqual(e2014,e2018);
});
