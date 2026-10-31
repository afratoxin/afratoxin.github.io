import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {analyzeArchive,renderYearAnalysis,renderYearPlane} from '../year-analysis.mjs';
const archive=JSON.parse(await readFile(new URL('../data/archive.json',import.meta.url),'utf8'));
const stats=analyzeArchive(archive.questions);

test('prompt polarity stops at the actual question, excludes parenthetical assumptions, and finds a trailing stem',()=>{
 for(const id of ['0937','0940','1033','1034']) assert.equal(stats.questions.find(q=>q.id===id).features.negativePrompt,false,id);
 assert.equal(stats.questions.find(q=>q.id==='p036').features.negativePrompt,true);
 assert.equal(stats.questions.find(q=>q.id==='1209').features.negativePrompt,true,'dialogue questions cannot replace the leading task');
 assert.match(stats.questions.find(q=>q.id==='p036').features.prompt,/위 자료/);
 assert.doesNotMatch(stats.questions.find(q=>q.id==='0937').features.prompt,/고려/);
 const long={id:'x',year:2000,number:1,sourceStem:`${'지문은 그렇지 않다. '.repeat(100)}\n\n위 설명으로부터 추론할 수 있는 것은?`};
 assert.equal(analyzeArchive([long]).questions[0].features.negativePrompt,false);
 const dialogue={id:'dialogue',year:2000,number:2,sourceStem:'2. 갑: 우리가 원하는 것은 무엇인가?\n을: 내 생각은 다르다.\n\n위 논쟁을 평가한 것으로 옳지 않은 것은?'};
 assert.equal(analyzeArchive([dialogue]).questions[0].features.negativePrompt,true);
 assert.match(analyzeArchive([dialogue]).questions[0].features.prompt,/^위 논쟁/);
 const singleParagraph={id:'paragraph',year:2000,number:3,sourceStem:'3. 결과가 성립하지 않는 경우가 있다. 위 설명으로부터 추론할 수 있는 것은?'};
 assert.equal(analyzeArchive([singleParagraph]).questions[0].features.negativePrompt,false);
 assert.match(analyzeArchive([singleParagraph]).questions[0].features.prompt,/^위 설명/);
});

test('diagram options retain missingness and never masquerade as zero comparison demand',()=>{
 const q=stats.questions.find(q=>q.id==='p014');
 assert.equal(q.designProfile.comparison.status,'unknown');
 assert.equal(q.designProfile.comparison.optionChars,null);
 assert.equal(q.designProfile.visual.workload,null);
 assert.equal(q.designProfile.visual.status,'unmeasured');
 assert.ok(q.designProfile.reviewRecommendations.length);
});

test('reading volume counts original Unicode characters without expanding unit glyphs or using explanation text',()=>{
 const input={id:'unicode',year:2000,number:1,sourceStem:'㎏ Ⅲ',sourceOptions:[{text:'😀'}],summary:'해설'.repeat(100)};
 const q=analyzeArchive([input]).questions[0];
 assert.equal(q.designProfile.reading.stemChars,2);
 assert.equal(q.designProfile.reading.optionChars,1);
 assert.equal(q.designProfile.reading.chars,3);
});

test('combination demand counts actual ㄱㄴㄷ content rather than only selection strings',()=>{
 const q=stats.questions.find(q=>q.id==='0937');
 assert.equal(q.designProfile.comparison.statementCount,3);
 assert.ok(q.designProfile.comparison.statementChars>100);
 assert.ok(q.designProfile.comparison.statementChars>q.designProfile.comparison.optionChars);
 assert.ok(q.designProfile.conditions.evidence.length);
 assert.equal(q.designProfile.conditions.inferenceDepth,null);
});

test('default map uses full original textual volume and union of rule application, quantitative model and puzzle types',()=>{
 const rows=[{id:'a',year:2000,number:1,sourceStem:'가나다',sourceOptions:[{text:'라마'}],types:['모형·수리 추론','논리 퍼즐']},{id:'b',year:2000,number:2,sourceStem:'가나',types:['규칙·사례 적용']},{id:'c',year:2000,number:3,sourceStem:'가',types:['논증 평가']}];
 const e=analyzeArchive(rows).exams[0];
 assert.equal(e.metrics.readingChars,8/3);
 assert.equal(e.plane.processing.count,2);
 assert.equal(e.metrics.processingRate,200/3);
 assert.equal(e.metrics.meanBurden,undefined);
 assert.equal(e.questions[0].score,undefined);
 const html=renderYearPlane(stats,'2027');
 assert.match(html,/원문 텍스트 평균 읽기량/);
 assert.match(html,/조건·규칙·수리 처리 문항 비중/);
 assert.match(html,/analysis-axis-x/);
 assert.equal((html.match(/data-year-point=/g)||[]).length,20);
 const alternate=renderYearPlane(stats,'2027',{axisX:'visualRate',axisY:'argumentRate'});
 assert.match(alternate,/시각 자료 표지 문항 비중/);
 assert.match(alternate,/논증·증거 판정 문항 비중/);
});

test('writer UI separates dimensions and sourced empirical rates without deriving a year difficulty',()=>{
 const content={sources:[],profiles:[],questionRates:[]};
 const html=renderYearAnalysis({archive,analysis:stats,content,examKey:'2009'});
 assert.doesNotMatch(html,/풀이 부담 추정|평균 풀이|1~5|percentile|문항별 난이도/);
 assert.match(html,/설계 요구 프로필/);
 assert.match(html,/미측정/);
 assert.match(html,/2009학년도 37번/);
 assert.match(html,/관측 정답률/);
 assert.match(html,/추론 깊이/);
});

test('booklet-change news is labeled as reporting while retaining its sample-data caveat',async()=>{
 const content=JSON.parse(await readFile(new URL('../data/year-analysis.json',import.meta.url),'utf8'));
 const source=content.sources.find(s=>s.id==='lec-booklet-change-2027');
 assert.equal(source.kind,'news-report');
 assert.match(source.sampleDescription,/가채점/);
 const html=renderYearAnalysis({archive,analysis:stats,content,examKey:'2027'});
 assert.match(html,/보도·책형 안내/);
});
