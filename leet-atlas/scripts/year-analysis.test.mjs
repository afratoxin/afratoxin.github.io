import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {analyzeArchive, renderYearAnalysis, validateYearContent} from '../year-analysis.mjs';
import {parseRoute,buildRoute} from '../core.mjs';

const archive=JSON.parse(await readFile(new URL('../data/archive.json',import.meta.url),'utf8'));
const fixture={exam:{questionCount:3},questions:[
 {id:'p001',examKey:'preliminary',year:2009,number:1,title:'단순 판단',text:'1. 옳은 것은?\n\n짧은 지문',sourceStem:'1. 옳은 것은?\n\n짧은 지문',logic:['개념 적용'],fields:['법률'],subjects:['권리'],sourceOptions:[{number:1,text:'긍정한다.'}]},
 {id:'0901',examKey:'2009',year:2009,number:1,title:'복합 조건',text:'1. 옳지 않은 것만을 고른 것은?\n\n단, 모든 경우에 조건을 적용한다. 다만 예외인 경우 제외한다.\nㄱ. 갑\nㄴ. 을\nㄷ. 병',sourceStem:'1. 옳지 않은 것만을 고른 것은?\n\n단, 모든 경우에 조건을 적용한다. 다만 예외인 경우 제외한다.\nㄱ. 갑\nㄴ. 을\nㄷ. 병',logic:['조건 추론','반례'],fields:['법률','수학'],subjects:['권리'],sourceOptions:[{number:1,text:'ㄱ, ㄴ'},{number:2,text:'ㄴ, ㄷ'}]},
 {id:'2701',examKey:'2027',year:2027,number:1,title:'수치 비교',text:'1. 추론할 수 있는 것은?\n\n20명이 30명으로 늘어났다.',sourceStem:'1. 추론할 수 있는 것은?\n\n20명이 30명으로 늘어났다.',logic:['비율'],fields:['수학'],subjects:['통계'],sourceOptions:[{number:1,text:'30% 이상이다.'},{number:2,text:'20% 미만이다.'}]},
]};

test('year routes preserve preliminary as a separate exam and round trip',()=>{
 for(const id of [null,'preliminary','2009','2027']) {
  const route={view:'analysis',id,tags:[],bookmark:'all',page:1,mode:'paged',sort:'newest'};
  assert.deepEqual(parseRoute(buildRoute(route)),{...route,tagMode:'auto',query:'',searchMode:'recommend',excludedTags:[]});
 }
});
test('all 755 questions belong to exactly one of 20 correctly sized exams',()=>{
 const analysis=analyzeArchive(archive.questions);
 assert.equal(analysis.exams.length,20);
 assert.equal(analysis.exams.reduce((n,e)=>n+e.count,0),755);
 assert.equal(analysis.byExam.get('preliminary').count,40);
 assert.equal(analysis.byExam.get('2009').count,40);
 assert.equal(analysis.byExam.get('2010').count,35);
 assert.equal(analysis.byExam.get('2027').count,40);
 for(const q of analysis.questions) {
  assert.ok(Number.isFinite(q.designProfile.reading.chars)&&q.designProfile.reading.chars>0,q.id);
  assert.equal(q.score,undefined,'no synthetic difficulty');
  assert.equal(q.designProfile.conditions.inferenceDepth,null,'actual inference depth is unmeasured');
  assert.equal(q.correctRate,undefined,'no inferred correct rates');
 }
});
test('source features distinguish reading, rules, negative prompts and combination choices',()=>{
 const analysis=analyzeArchive(fixture.questions);
 const simple=analysis.questions.find(q=>q.id==='p001'), complex=analysis.questions.find(q=>q.id==='0901');
 assert.ok(complex.features.readingChars>simple.features.readingChars);
 assert.ok(complex.features.conditionMarkers>simple.features.conditionMarkers);
 assert.equal(complex.features.negativePrompt,true);
 assert.equal(complex.features.combination,true);
 assert.equal(simple.features.negativePrompt,false);
 assert.equal(analysis.byExam.get('2009').distributions.fields[0].percent,100);
 assert.equal(analysis.byExam.get('2009').distributions.fields[1].percent,100);
});
test('design observations are source-based, deterministic and do not mutate answer or solution data',()=>{
 const before=structuredClone(fixture.questions);
 const first=analyzeArchive(fixture.questions);
 const changed=fixture.questions.map(q=>({...q,answer:5,confidence:'low',summary:'해설을 길게 바꿔도'.repeat(100),steps:Array(100).fill('따라서')}));
 assert.deepEqual(analyzeArchive(changed).questions.map(q=>q.designProfile),first.questions.map(q=>q.designProfile));
 assert.deepEqual(fixture.questions,before);
 assert.deepEqual(analyzeArchive([]).exams,[]);
 const equal=analyzeArchive([fixture.questions[0]]).questions[0];
 assert.ok(Number.isFinite(equal.designProfile.reading.chars));
});
test('missing observed rates stay missing and threshold bands never become exact percentages',()=>{
 const content={profiles:[],sources:[{id:'s',title:'표본 통계',url:'https://example.com/review',kind:'sample-statistics',examKeys:['2027'],sampleDescription:'자발적 참여 표본',caveats:'전수 통계 아님'}],questionRates:[{questionId:'2701',examKey:'2027',correctRate:null,upperBoundPercent:40,sourceId:'s',booklet:'단일형'}]};
 const html=renderYearAnalysis({archive:fixture,analysis:analyzeArchive(fixture.questions),content,examKey:'2027'});
 assert.match(html,/설계 요구 프로필/);
 assert.match(html,/40% 이하/);
 assert.match(html,/정확한 정답률.*미확보/);
 assert.doesNotMatch(html,/정답률 0%/);
 assert.match(html,/\/question\/2701/);
});
test('year screen provides accessible graph, data table, comparisons and safe source links',()=>{
 const content={profiles:[],sources:[],questionRates:[]};
 const html=renderYearAnalysis({archive:fixture,analysis:analyzeArchive(fixture.questions),content,examKey:'2009',comparisonKey:'preliminary'});
 assert.match(html,/분석 회차/);
 assert.match(html,/대조 회차/);
 assert.match(html,/role="img"/);
 assert.match(html,/<title/);
 assert.match(html,/<table/);
 assert.match(html,/35|예비시험/);
 assert.match(html,/복수.*100%/);
 assert.doesNotMatch(html,/NaN|undefined/);
});
test('evidence validator rejects mismatched exams, missing sources, invalid rates and unsafe URLs',()=>{
 const bad={profiles:[{examKey:'2027',logic:{text:'test',questionIds:['0901']}}],sources:[{id:'bad',url:'javascript:alert(1)'}],questionRates:[{questionId:'2701',examKey:'2009',correctRate:120,sourceId:'missing'}]};
 assert.ok(validateYearContent(bad,fixture.questions).length>=4);
});

test('negative prompt detection includes inferable, possible, true and false variants',()=>{
 const prompts=['다음으로부터 추론될 수 없는 것은?','사례라고 볼 수 없는 것은?','동시에 참일 수 없는 것은?','성립하지 않는 것은?','다음 중 거짓인 것은?'];
 const rows=prompts.map((text,i)=>({id:`11${i+1}`,examKey:'2011',year:2011,number:i+1,text:`${i+1}. ${text}\n\n본문`,logic:[]}));
 assert.ok(analyzeArchive(rows).questions.every(q=>q.features.negativePrompt));
 assert.equal(analyzeArchive(rows).byExam.get('2011').metrics.negativePromptRate,100);
});

test('a comparison equal to the selected exam falls back to corpus in both select and statistics',()=>{
 const analysis=analyzeArchive(fixture.questions);
 const one=renderYearAnalysis({archive:fixture,analysis,content:{},examKey:'2009',comparisonKey:'2009'});
 const all=renderYearAnalysis({archive:fixture,analysis,content:{},examKey:'2009',comparisonKey:'all'});
 assert.equal(one,all);
});
