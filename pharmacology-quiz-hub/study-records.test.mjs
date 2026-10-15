import test from 'node:test';
import assert from 'node:assert/strict';
const api=await import('./study-records.mjs').catch(()=>({}));
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v)};};
const question=(id='a')=>({id,stem:'질문',choices:[{text:'A'},{text:'B'},{text:'C'},{text:'D'},{text:'E'}],answerIndex:1,note:'근거'});

test('미리 보기·중복 응답은 분모를 늘리지 않고 최신 정답이 오답 목록을 해소한다',()=>{
 assert.equal(typeof api.createStudyStore,'function');
 const s=api.createStudyStore(memory());s.register({id:'x',title:'퀴즈',items:['a','b','c']});
 assert.deepEqual(s.counts('x'),{total:3,solved:0,correct:0,wrong:0,unknown:0,unanswered:3});
 s.record('x',question(),false);s.record('x',question(),false);
 assert.equal(s.counts('x').wrong,1);assert.equal(s.wrong('x').length,1);
 s.record('x',question(),true);assert.equal(s.wrong('x').length,0);assert.equal(s.counts('x').correct,1);
 s.record('x',question(),false);assert.equal(s.counts('x').wrong,1);
 s.record('x',question('removed'),false);assert.equal(s.counts('x').total,3);
});
test('오답의 계산 수치·그림·복수 정답과 선택지 대응을 새로고침 후에도 그대로 재현한다',()=>{
 assert.equal(typeof api.createStudyStore,'function');
 const disk=memory(),s=api.createStudyStore(disk);s.register({id:'pk',items:['a']});
 const q={...question(),stem:'C=32 mg/L일 때',plot:{points:[{t:1,c:32},{t:5,c:8}]},table:{headers:['t','C'],rows:[[1,32]]},steps:['32/8=4'],figure:'assets/a.svg'};
 s.record('pk',q,false);const reloaded=api.createStudyStore(disk);reloaded.register({id:'pk',items:['a']});assert.deepEqual(reloaded.wrong('pk')[0].question.plot,q.plot);assert.equal(reloaded.wrong('pk')[0].question.stem,q.stem);
 const multi=api.normalizeStudyQuestion({id:'m',stem:'둘 선택',choices:['X','Y','Z'],answer:[1,3],answerNote:'복수',figure:'x.svg'});assert.deepEqual(multi.answers,[0,2]);
 assert.equal(api.gradeStudyAnswer(multi,[0]),false);assert.equal(api.gradeStudyAnswer(multi,[2,0]),true);
 const shuffled=api.shuffleStudyQuestion(multi,()=>0);assert.deepEqual(shuffled.answers.map(i=>shuffled.choices[i]).sort(),['X','Z']);
});
test('최신 기록을 우선 이전하고 과거 누적 오답을 복습하며 PK 결과를 추측하지 않는다',()=>{
 assert.equal(typeof api.createStudyStore,'function');const s=api.createStudyStore(memory());
 s.register({id:'old',items:['a','b','c','d'],legacy:{seen:{a:4,b:2,c:1},missed:{a:2,b:1},lastResult:{a:true,b:false}},build:id=>question(id)});
 assert.equal(s.counts('old').correct,2);assert.equal(s.counts('old').wrong,1);
 s.record('old',question('b'),true);s.register({id:'old',items:['a','b','c','d'],legacy:{missed:{b:5}},build:id=>question(id)});assert.equal(s.counts('old').wrong,0);
 s.register({id:'pk',items:['a','b'],legacy:{attemptedVariants:{a:3},missedTopics:{ke:1}},unknownLegacy:true,build:id=>question(id)});assert.equal(s.counts('pk').unknown,1);assert.equal(s.counts('pk').wrong,0);
 s.register({id:'old',items:['b']});assert.equal(s.counts('old').total,1);assert.equal(s.counts('old').correct,1);
});
test('드래그는 미배치를 오답에 넣지 않고 복수의 올바른 칸을 보존한다',()=>{
 assert.equal(typeof api.createStudyStore,'function');const s=api.createStudyStore(memory());s.register({id:'drag',type:'match',items:[{id:'a',name:'약물A',categories:['I','II']},{id:'b',name:'약물B',categories:['III']}]});
 s.recordMatch('drag',[{item:{id:'a'},chosen:'III',correct:false},{item:{id:'b'},correct:false}],x=>x.id);assert.equal(s.counts('drag').wrong,1);assert.equal(s.counts('drag').unanswered,1);
 s.recordMatch('drag',[{item:{id:'a'},chosen:'II',correct:true}],x=>x.id);assert.equal(s.wrong('drag').length,0);
});

test('진행률 색상 경계는 전체 문항 분모의 정답·오답 비율과 정확히 일치한다',()=>{
 const values={},el={classList:{add(){}},style:{setProperty:(k,v)=>values[k]=v},setAttribute(){}};
 api.paintStudyProgress(el,{total:4,solved:3,correct:2,wrong:1,unknown:0,unanswered:1});
 assert.equal(values['--study-correct-end'],'50%');assert.equal(values['--study-wrong-end'],'75%');
 api.paintStudyProgress(el,{total:0,solved:0,correct:0,wrong:0,unknown:0,unanswered:0});assert.equal(values['--study-correct-end'],'0%');assert.equal(values['--study-wrong-end'],'0%');
});
