import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {analyzeArchive,renderYearPlane} from '../year-analysis.mjs';
const archive=JSON.parse(await readFile(new URL('../data/archive.json',import.meta.url),'utf8'));

test('processing includes rule application, modeling and puzzles once; argument is independent',()=>{
 const rows=[
  {id:'a',examKey:'2010',year:2010,number:1,types:['모형·수리 추론','논리 퍼즐','논증 평가']},
  {id:'b',examKey:'2010',year:2010,number:2,types:['논증 평가','실험 분석']},
  {id:'c',examKey:'2010',year:2010,number:3,types:['규칙·사례 적용']},
 ];
 const point=analyzeArchive(rows).byExam.get('2010').plane;
 assert.equal(point.processing.count,2);
 assert.equal(point.argument.count,2);
 assert.equal(point.processing.percent,200/3);
 assert.equal(point.argument.percent,200/3);
 assert.deepEqual(point.processing.questionIds,['a','c']);
});
test('real corpus has one point per exam, percentage denominators, and distinct preliminary/main 2009 exams',()=>{
 const stats=analyzeArchive(archive.questions);
 assert.equal(stats.exams.length,20);
 assert.equal(stats.byExam.get('preliminary').plane.processing.percent,47.5);
 assert.equal(stats.byExam.get('2009').plane.processing.percent,45);
 assert.equal(stats.byExam.get('2010').plane.processing.percent,100*16/35);
 assert.equal(stats.byExam.get('2027').plane.processing.percent,55);
 assert.equal(stats.byExam.get('2027').plane.argument.percent,27.5);
 for(const e of stats.exams) for(const p of Object.values(e.plane))assert.ok(p.percent>=0&&p.percent<=100);
});
test('scatter plot is linked, labeled and preserves coincident points without changing coordinates',()=>{
 const stats=analyzeArchive(archive.questions),html=renderYearPlane(stats,'2027');
 assert.equal((html.match(/data-year-point=/g)||[]).length,20);
 assert.match(html,/원문 텍스트 평균 읽기량/);
 assert.match(html,/조건·규칙·수리 처리 문항 비중/);
 assert.match(html,/id="analysis-axis-x"/);
 assert.match(html,/id="analysis-axis-y"/);
 assert.match(html,/href="#\/analysis\/preliminary"/);
 assert.match(html,/href="#\/analysis\/2027"/);
 assert.match(html,/is-selected/);
 assert.match(html,/같은 좌표.*동심원/);
 assert.match(html,/<table/);
 assert.match(html,/role="group"/);
 assert.doesNotMatch(html,/NaN|undefined/);
});

test('coincident year points keep their true coordinates with concentric rings and separate links',()=>{
 const rows=['2014','2018'].map(year=>({id:year+'01',examKey:year,year:Number(year),number:1,sourceStem:'옳은 것은? 가나다',sourceOptions:[{text:'정답'}],types:['규칙·사례 적용']}));
 const stats=analyzeArchive(rows),html=renderYearPlane(stats,'2014');
 const coordinates=[...html.matchAll(/data-year-point="(.*?)"[^]*?<circle cx="(.*?)" cy="(.*?)" r="(.*?)"/g)];
 assert.equal(coordinates.length,2);
 assert.equal(coordinates[0][2],coordinates[1][2]);
 assert.equal(coordinates[0][3],coordinates[1][3]);
 assert.notEqual(coordinates[0][4],coordinates[1][4]);
 assert.match(html,/같은 좌표.*동심원/);
});

test('reading-axis range spreads the real exams across the plot instead of crowding them at its edge',()=>{
 const html=renderYearPlane(analyzeArchive(archive.questions),'2027');
 const xs=[...html.matchAll(/data-year-point=".*?"[^]*?<circle cx="(.*?)"/g)].map(m=>Number(m[1]));
 assert.ok(Math.max(...xs)-Math.min(...xs)>500);
});
