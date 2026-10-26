import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rankReferences,buildSearchDocuments} from '../reference-search.mjs';
import {questionForm} from '../search-documents.mjs';

const archive=JSON.parse(readFileSync(new URL('../data/archive.json',import.meta.url),'utf8')).questions;
const ids=(questions,query,options)=>rankReferences(questions,query,options).map(match=>match.id);
const fixture=(id,values={})=>({id,title:'',text:'',summary:'',steps:[],fields:[],domains:[],types:[],...values});

test('real archive finds named and family dialogues from a creation brief',()=>{
  const top=ids(archive,'인문 논리학 소재의, 2명이 서로 싸우는 문항').slice(0,10);
  assert.ok(['1321','1512','1717','2218','2318'].filter(id=>top.includes(id)).length>=3,top.join(','));
  assert.ok(!['1002','1319','2335','2534','2634'].some(id=>top.includes(id)),top.join(','));
});

test('generic structural descriptions work without a topical keyword',()=>{
  const questions=archive.filter(q=>q.examKey==='2022');
  for(const query of ['두 사람이 서로 논박하는 대화','두 사람이 서로 반박하는 문제','2명이 서로 싸우는 문항','2명의 논쟁','두 명의 논쟁','두사람이 논박하는 대화','둘이 서로 반박하는 문제']){
    const top=ids(questions,query);
    assert.ok(top.includes('2218'),query);
  }
});

test('an explicit logic field is a stronger match than a generic argument exercise',()=>{
  const questions=[fixture('a',{title:'인문 논증',fields:['철학'],domains:['인문'],types:['논증 평가']}),fixture('b',{title:'인문 논리',fields:['철학','논리학'],domains:['인문'],types:['논증 평가']})];
  assert.equal(ids(questions,'인문 논리학 문항')[0],'b');
});

test('two-syllable nouns, exam labels and metadata-only reasons remain searchable',()=>{
  const questions=[
    fixture('policy',{title:'법률의 정당성',tagReasons:{'법':'법 제도의 의도를 분석한다.'}}),
    fixture('p001',{examKey:'preliminary',examLabel:'2009학년도 예비시험',year:2009,title:'용기의 정의'}),
    fixture('0901',{examKey:'2009',examLabel:'2009학년도 본시험',year:2009,title:'정당화'}),
  ];
  for(const query of ['제도','의도','법 제도'])assert.equal(ids(questions,query)[0],'policy',query);
  assert.deepEqual(ids(questions,'예비시험'),['p001']);
  assert.deepEqual(ids(questions,'본시험'),['0901']);
  assert.equal(ids(questions,'preliminary')[0],'p001');
});

test('remembered family and fiction paraphrases recover the source questions',()=>{
  for(const [query,want] of [
    ['엄마랑 자식이 공부 안 하는 것도 원인이 되는지 논쟁','2218'],
    ['어머니와 자녀가 아무것도 안 해도 남을 기쁘게 할 수 있냐고 따지는 대화','2218'],
    ['홈즈 콧구멍 가지고 소설에서 참인 게 뭔지 싸우는 문제','2318'],
    ['소설 속 탐정의 코 구멍 수와 속편에서 밝혀진 진실에 관한 반박','2318'],
  ])assert.ok(ids(archive,query).slice(0,5).includes(want),`${want}: ${query}`);
});

test('two discourse participants differ from story characters and three-speaker puzzles',()=>{
  const questions=[
    fixture('a',{title:'용기의 정의',fields:['철학','논리학'],domains:['인문'],text:'소크라테스 : 용기란 무엇인가?\n라케스 : 끈기입니다.\n소 : 하지만 군인 두 사람과 의사의 사례는 반례입니다.\n라 : 그렇군요.'}),
    fixture('b',{title:'세 사람의 논쟁',fields:['철학','논리학'],domains:['인문'],text:'갑 : 사람은 이기적이다.\n을 : 반대한다.\n병 : 나도 반대한다.'}),
    fixture('c',{title:'참거짓 퍼즐',fields:['논리학'],types:['논리 퍼즐','거짓말 찾기'],text:'갑 : 을은 거짓말한다.\n을 : 병은 참말한다.\n병 : 갑은 거짓말한다.'}),
    fixture('d',{title:'두 군인',fields:['철학'],domains:['인문'],text:'철학자는 두 군인의 이야기를 제시한다. 한 사람은 싸우고 다른 사람은 도망쳤다.'}),
  ];
  const matches=rankReferences(questions,'인문 논리학 두 사람이 서로 논박하는 대화');
  assert.equal(matches[0].id,'a');
  assert.match(matches[0].reasons.join(' '),/소크라테스.*라케스/);
  assert.ok(!matches[0].reasons.join(' ').includes('군인'));
});

test('principle labels and incidental combat examples are not speaker evidence',()=>{
  const questions=[
    fixture('principles',{title:'인과 원리',text:'원리A : 사건 a는 원인이다.\n원리B : 사건 b는 결과이다.',fields:['철학','논리학'],domains:['인문']}),
    fixture('dialogue',{title:'용기의 정의',text:'갑 : 용기란 무엇인가?\n을 : 끈기이다.\n갑 : 하지만 그 정의의 반례가 있다.',fields:['철학','논리학'],domains:['인문']}),
    fixture('combatExample',{title:'용기의 정의',text:'갑 : 용기란 무엇인가?\n을 : 끈기이다.\n갑 : 하지만 그 정의의 반례가 있다. 예를 들어 군인은 싸우고 있다.',fields:['철학','논리학'],domains:['인문']}),
  ];
  const matches=rankReferences(questions,'인문 논리학 2명이 싸우는 문항');
  assert.equal(matches.find(match=>match.id==='dialogue').score,matches.find(match=>match.id==='combatExample').score);
  assert.ok(!matches.find(match=>match.id==='principles').reasons.join(' ').includes('화자'));
  assert.ok(!buildSearchDocuments([questions[0]]).some(document=>document.text.includes('화자 2명')));
});

test('juxtaposed theories remain searchable without claiming reciprocal debate',()=>{
  const broad=ids(archive,'두 사람이 명제를 서로 다르게 정의');
  assert.ok(broad.slice(0,5).includes('2523'),broad.slice(0,5).join(','));
  const debate=ids(archive,'인문 논리학 두 사람이 서로 반박하는 논쟁');
  assert.ok(debate.indexOf('2523')<0||debate.indexOf('2523')>debate.indexOf('2318'));
  const result=rankReferences(archive.filter(q=>q.id==='2523'),'두 사람이 명제를 서로 다르게 정의')[0];
  assert.ok(!result.reasons.some(reason=>/논쟁|논박|반박/.test(reason)));
});

test('actual violence outranks philosophical mentions of violence only when requested',()=>{
  const questions=[
    fixture('debate',{title:'살인의 도덕성 논쟁',fields:['철학','논리학'],domains:['인문'],text:'갑 : 살인은 항상 나쁜가?\n을 : 당신의 주장에 반대한다. 폭행의 사례를 보라.\n갑 : 하지만 그 반례는 틀렸다.'}),
    fixture('fight',{title:'몸싸움과 상해죄',fields:['형사·증거'],domains:['법'],text:'갑과 을 두 사람이 주먹으로 서로 때려 상해를 입었다. 이 폭행에 정당방위가 인정되는지 판단한다.'}),
  ];
  assert.equal(ids(questions,'두 사람이 실제로 주먹질하고 몸싸움 하는 형법 문항')[0],'fight');
  assert.equal(ids(questions,'몸싸움은 없는 인문 논리학 두 사람의 논쟁')[0],'debate');
  assert.equal(ids(questions,'논쟁 말고 실제 몸싸움')[0],'fight');
});

test('crime-model theories are not bodily conflict merely because an option names a violent criminal',()=>{
  const questions=[
    fixture('crimeModel',{title:'범죄 이동 모형',fields:['일반사회'],text:'A : 범죄자는 표적을 선택한다.\nB : 범죄자는 검거를 피한다.\n보기: 두 명의 성폭행범은 이동 거리가 다르다.'}),
    fixture('violentEvent',{title:'폭행과 상해',fields:['형사·증거'],text:'갑이 을을 주먹으로 때려 상해를 입혔다.'}),
  ];
  const matches=rankReferences(questions,'두 사람이 몸싸움하는 형법 문항');
  assert.equal(matches[0].id,'violentEvent');
  assert.ok(!matches.some(match=>match.id==='crimeModel'));
});

test('negative topic constraints do not turn into positive matches',()=>{
  const questions=[
    fixture('physics',{title:'운동의 법칙',fields:['물리학'],text:'물리학에서 운동의 법칙을 탐구한다.'}),
    fixture('ethics',{title:'자유의지',fields:['철학'],domains:['인문'],text:'철학에서 자유의지를 탐구한다.'}),
  ];
  assert.equal(ids(questions,'물리학 말고 철학 문항')[0],'ethics');
  assert.ok(!ids(questions,'물리학 제외 철학').includes('physics'));
});

test('exact IDs dominate semantic similarities and ranking never expands filtered candidates',()=>{
  const filtered=archive.filter(q=>q.year===2022);
  const scores=new Map(archive.map(q=>[q.id,q.id==='2218'?.6:.99]));
  assert.equal(ids(filtered,'2218번',{semanticScores:scores})[0],'2218');
  assert.ok(ids(filtered,'인문 두 사람 논쟁',{semanticScores:scores}).every(id=>filtered.some(q=>q.id===id)));
  assert.deepEqual(ids(filtered,'2318'),[]);
  assert.deepEqual(ids(archive,'로컬전체본문 p001'),['p001']);
  assert.deepEqual(ids(archive,'로컬전체본문 0901'),['0901']);
  assert.deepEqual(ids(archive,'법률 문제 2022년도 기출처럼 계산이 들어가면 좋겠어').filter(id=>id==='2022'),[]);
  assert.deepEqual(ids(archive,'2022'),['2022']);
  assert.deepEqual(ids(archive,'2022번'),['2022']);
});

test('unregistered semantic candidates are not discarded for lacking known lexical or topic evidence',()=>{
  const questions=Array.from({length:80},(_,i)=>fixture(String(i).padStart(4,'0'),{title:'서로 다른 자료 '+i}));
  const scores=new Map(questions.map((q,i)=>[q.id,.88-i*.0006]));
  const matches=rankReferences(questions,'경험한 장면과 기억의 차이를 묻고 싶어요',{semanticScores:scores});
  assert.ok(matches.some(m=>m.id==='0035'));
});

test('known form negations improve ranking without preventing other arbitrary semantic descriptions',()=>{
 const matches=rankReferences(archive,'합답형 말고 독립선택지형 문항');
 assert.ok(matches.length>0);
 for(const match of matches.slice(0,10))assert.equal(questionForm(archive.find(q=>q.id===match.id)).choice,'statements',match.id);
 assert.ok(!matches.some(match=>match.id==='0912'));
 const numeric=archive.find(q=>q.id==='0912');assert.equal(questionForm(numeric).choice,'values');
 assert.ok(!rankReferences([numeric],'독립선택지형').some(match=>match.reasons.some(reason=>reason.includes('독립 선택지형'))));
 const computation=rankReferences(archive,'법률 문항인데 계산은 거의 필요 없는 글');
 assert.ok(computation.length>0);
 assert.ok(computation.slice(0,5).every(match=>!archive.find(q=>q.id===match.id).logic.includes('수식 계산')));
});

test('choice-count and ㄹ-item format descriptions search source-backed forms',()=>{
  const five=rankReferences(archive,'5개 선택지를 둔 오지선다 문항');
  assert.ok(five.length>0);
  assert.ok(five.every(match=>match.reasons.some(reason=>reason.includes('5지선다'))));
  const rItem=rankReferences([fixture('r',{sourceStem:'ㄱ. 조건 하나\nㄴ. 조건 둘\nㄷ. 조건 셋\nㄹ. 조건 넷'}),fixture('no-r',{sourceStem:'ㄱ. 조건 하나\nㄴ. 조건 둘\nㄷ. 조건 셋'})],'ㄱ, ㄴ, ㄷ, ㄹ 항목까지 있는 선택지');
  assert.deepEqual(rItem.map(match=>match.id),['r']);
  assert.ok(rItem[0].reasons.some(reason=>reason.includes('ㄹ 항목 포함')));
});

test('bracketed answer slots count as completion evidence only when the source asks to fill them',()=>{
  const completion=fixture('box',{sourceStem:'□에 들어갈 표현을 고르시오.',text:'다음 □에 들어갈 내용을 찾으시오.'});
  const incidental=fixture('aside',{sourceStem:'빈칸이 있었던 사례를 소개한다.',text:'이야기에서 빈칸은 이미 채워져 있다.'});
  const matches=rankReferences([completion,incidental],'빈칸에 들어갈 말을 선택하는 문제');
  assert.equal(matches[0].id,'box');
  assert.ok(matches[0].reasons.some(reason=>reason.includes('빈칸')));
});

test('a circled source annotation and an unrelated “몰아넣을” verb are not an answer slot',()=>{
  const question=archive.find(q=>q.id==='2113');
  const scores=new Map([['2113',.93],['2112',.70]]);
  const [match]=rankReferences([question], '빈칸에 들어갈 말을 선택하는 문제', {semanticScores:scores});
  assert.ok(match);
  assert.ok(!match.reasons.some(reason=>reason.includes('답안이 들어갈 자리')||reason.includes('빈칸')));
});

test('unseen paraphrases can be found by meaningful raw E5 scores without lexical overlap',()=>{
  const questions=[fixture('x',{title:'부작위의 인과성',text:'갑 : 부작위의 결과이다.\n을 : 그렇지 않다.'}),fixture('y',{title:'행성 궤도',text:'행성은 항성을 공전한다.'})];
  const matches=rankReferences(questions,'멈춰 있는 선택이 누군가의 행복을 바꿀 수 있나',{semanticScores:new Map([['x',.91],['y',.66]])});
  assert.equal(matches[0].id,'x');
  assert.ok(matches[0].snippet.length>0);
  assert.ok(matches[0].reasons.every(reason=>!reason.includes('행복을 바꾼다')));
});

test('semantic-only recommendations show the matching evidence even when it is a non-answer option',()=>{
  const questions=[fixture('x',{title:'관찰과 가설',options:[{number:2,correct:false,explanation:'서로 다른 가설이 모두 예측하는 관찰이므로 판별할 수 없다.'}]}),fixture('y',{title:'행성'})];
  const scores=new Map([['x',.91],['y',.70]]);
  scores.evidence=new Map([['x',{kind:'option',label:'2번 ② 선택지와 해설',text:questions[0].options[0].explanation,score:.92}]]);
  const [match]=rankReferences(questions,'양쪽 이야기에 다 들어맞는 관찰로 우열을 매기는 오류',{semanticScores:scores});
  assert.equal(match.id,'x');
  assert.ok(match.snippet.includes('판별할 수 없다'));
  assert.equal(match.evidenceLabel,'2번 ② 선택지와 해설');
});

test('natural-law field is not labelled law and a year in a sentence is not an exact question request',()=>{
  const questions=[fixture('1332',{title:'높이뛰기',fields:['운동법칙'],domains:['과학·기술']}),fixture('1807',{title:'휴업 보상금',domains:['법률'],fields:['공법']})];
  assert.equal(rankReferences(questions,'법률 문항')[0].id,'1807');
  assert.deepEqual(rankReferences(questions.slice(0,1),'법률 문항'),[]);
  const matches=rankReferences(archive,'2022 학년도 두 사람 논쟁');
  assert.ok(matches.some(m=>m.id==='2218'));
  for(const query of ['법률 문제 2022년도 기출처럼 계산이 들어가면 좋겠어','법률 계산 2022']){
    const results=rankReferences(archive,query);
    assert.ok(results.some(match=>match.id==='1022'),query);
    assert.ok(results.some(match=>match.id==='2307'),query);
    assert.ok(!results.some(match=>match.id==='2022'&&match.reasons.some(reason=>reason.startsWith('문항번호:'))),query);
  }
});

test('empty, gibberish and unrelated input do not return arbitrary archive records',()=>{
  for(const query of ['','  ','asdfghjklqwerty','ㅁㄴㅇㄹㅋㅌㅊ','젤라토 레시피 마스카포네'])assert.deepEqual(ids(archive,query),[],query);
  assert.deepEqual(ids(archive,'asdfghjklqwerty',{semanticScores:new Map(archive.map(q=>[q.id,.67]))}),[]);
});

test('high E5 background similarity alone does not admit unrelated or nonlinguistic input',()=>{
  const questions=[fixture('x',{title:'부작위와 인과성',text:'갑 : 부작위는 원인이다.\n을 : 반대한다.'}),fixture('y',{title:'행성 궤도',text:'행성은 항성을 공전한다.'}),fixture('z',{title:'투표 규칙',text:'최다 득표자가 선출된다.'})];
  // Max/median pairs measured using genuine multilingual-e5-small over all755 records.
  for(const [query,max,median] of [['asdfghjklqwerty',.81433,.78012],['ㅁㄴㅇㄹㅋㅌㅊ',.85386,.82364],['젤라토 레시피 마스카포네',.82085,.77871]]){
    assert.deepEqual(ids(questions,query,{semanticScores:new Map([['x',max],['y',median],['z',median-.01]])}),[],query);
  }
  assert.equal(ids(questions,'멈춰 있는 선택이 누군가의 행복을 바꿀 수 있나',{semanticScores:new Map([['x',.85471],['y',.8104],['z',.80]])})[0],'x');
  const incidental=[fixture('cat',{title:'고양이 먹이',text:'고양이의 먹이 선호를 실험한다.'}),...questions.slice(1)];
  assert.deepEqual(ids(incidental,'아무 관련 없는 무지개 고양이 우주케이크',{semanticScores:new Map([['cat',.83427],['y',.78550],['z',.77]])}),[]);
});

test('evidence is source based, scores are finite and inputs are not mutated',()=>{
  const questions=[fixture('one',{title:'개인 교정 제목',text:'갑 : 교정된 부작위 원인입니다.\n을 : 반대합니다.',fields:['철학','논리학']})];
  const before=JSON.stringify(questions);
  const [match]=rankReferences(questions,'교정된 부작위 원인');
  assert.equal(JSON.stringify(questions),before);
  assert.equal(match.id,'one');
  assert.ok(Number.isFinite(match.score));
  assert.ok(match.reasons.length>0);
  assert.ok(match.snippet.includes('교정된 부작위 원인'));
});

test('source snippets preserve original circled markers and mathematical typography',()=>{
  const questions=[fixture('symbols',{title:'인과 설명',text:'갑 : ㉠ 공부하지 않는 것이 원인이다.\n을 : ①과 ②를 비교하면 x²가 다르다.'})];
  const [match]=rankReferences(questions,'공부 원인');
  assert.ok(match.snippet.includes('㉠'));
  assert.ok(match.snippet.includes('①과 ②'));
  assert.ok(match.snippet.includes('x²'));
});

test('embedding documents retain source tails, overlap and complete concise analysis',()=>{
  const question=fixture('long',{title:'긴 원문',fields:['철학'],summary:'요약에는 고유한 부작위 설명이 있다.',steps:['첫 분석 단계','마지막 분석 단계'],text:'시작머리'+ '가'.repeat(480)+'중간연결'+ '나'.repeat(700)+'마지막꼬리정보'});
  const before=JSON.stringify(question);
  const docs=buildSearchDocuments([question]);
  assert.ok(docs.every(doc=>doc.id==='long'&&typeof doc.text==='string'&&doc.text.length<=750));
  assert.ok(docs.some(doc=>doc.text.includes('마지막꼬리정보')));
  assert.ok(docs.filter(doc=>doc.text.includes('중간연결')).length>=2);
  assert.ok(docs.some(doc=>doc.text.includes('고유한 부작위 설명')));
  assert.ok(docs.some(doc=>doc.text.includes('마지막 분석 단계')));
  assert.equal(JSON.stringify(question),before);
  assert.equal(new Set(buildSearchDocuments(archive).map(doc=>doc.id)).size,755);
});
