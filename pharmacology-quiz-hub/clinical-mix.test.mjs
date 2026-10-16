import test from 'node:test';import assert from 'node:assert/strict';
const api=await import('./clinical-mix.mjs').catch(()=>({}));
const bank=[{id:'a',format:'clinical'},{id:'b',format:'clinical'},{id:'c',format:'judgment'},{id:'d'}];
test('임상형과 기존형을 계획된 간격으로 섞고 유형 전용 연습도 지원한다',()=>{
 assert.equal(typeof api.clinicalQuestionPool,'function');
 let clinical=0;
 for(let draws=0;draws<100;draws++){const pool=api.clinicalQuestionPool(bank,{draws},'mixed',4);assert.ok(pool.length);assert.ok(pool.every(q=>q.format===pool[0].format||q.format!=='clinical'));if(pool[0].format==='clinical')clinical++;}
 assert.equal(clinical,25);
 assert.deepEqual(api.clinicalQuestionPool(bank,{},'clinical'),bank.slice(0,2));assert.deepEqual(api.clinicalQuestionPool(bank,{},'ordinary'),bank.slice(2));
});
test('기존 기록은 풀이 횟수로 순환을 잇고 빈 유형은 전체 풀로 복구한다',()=>{
 assert.equal(typeof api.clinicalQuestionPool,'function');
 assert.ok(api.clinicalQuestionPool(bank,{seen:{a:1,b:2,c:1}},'mixed',4).every(q=>q.format==='clinical'));
 assert.deepEqual(api.clinicalQuestionPool(bank.slice(2),{draws:0},'mixed',4),bank.slice(2));
 const state={draws:0,seen:{a:2}};api.clinicalQuestionPool(bank,state,'mixed');assert.deepEqual(state,{draws:0,seen:{a:2}});
});
