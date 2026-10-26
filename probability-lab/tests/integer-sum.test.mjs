import test from 'node:test';
import assert from 'node:assert/strict';
import { integerSumSpec as s } from '../engines/integer-sum.mjs';

test('자연수와 0 이상 정수는 서로 다른 정수해를 센다', () => {
  assert.equal(s.solve({k:4,total:7}).answer,'20');
  assert.equal(s.solve({k:4,total:7,domain:'nonnegative'}).answer,'120');
});
test('등식과 두 엄격 부등호의 경계를 구별한다', () => {
  assert.equal(s.solve({k:3,total:5,relation:'le'}).answer,'10');
  assert.equal(s.solve({k:2,total:5,relation:'lt'}).answer,'6');
  assert.equal(s.solve({k:2,total:5,relation:'gt',upperOn:true,upper:4}).answer,'6');
});
test('홀짝 치환과 나머지 조건', () => {
  assert.equal(s.solve({k:3,total:10,domain:'positive-even'}).answer,'6');
  assert.equal(s.solve({k:3,total:9,domain:'positive-odd'}).answer,'10');
  assert.equal(s.solve({k:3,total:7,domain:'integer-even'}).answer,'0');
});
test('무한한 정의역에 유한 개수의 답을 꾸며내지 않는다', () => {
  assert.equal(s.solve({k:3,total:7,domain:'integer'}).status,'infinite');
  assert.equal(s.solve({k:3,total:7,relation:'ge'}).status,'infinite');
});
test('음수 경계, 서로 다른 값, 순서 조건을 센다', () => {
  assert.equal(s.solve({k:2,total:0,domain:'integer',lowerOn:true,lower:-2,upperOn:true,upper:2}).answer,'5');
  assert.equal(s.solve({k:3,total:6,distinct:true}).answer,'6');
  assert.equal(s.solve({k:3,total:6,order:'nondecreasing'}).answer,'3');
  assert.equal(s.solve({k:3,total:6,order:'increasing'}).answer,'1');
});
test('작은 유한 정의역의 모든 조합을 독립 열거한 값과 일치한다', () => {
  for (const relation of ['eq','lt','le','gt','ge']) for (const order of ['any','nondecreasing','increasing']) {
    const all=[];
    for(let a=-2;a<=3;a++)for(let b=-2;b<=3;b++)for(let c=-2;c<=3;c++)all.push([a,b,c]);
    const ok=xs=>{const sum=xs.reduce((a,b)=>a+b,0);return ({eq:sum===2,lt:sum<2,le:sum<=2,gt:sum>2,ge:sum>=2})[relation] && (order==='any'||(order==='nondecreasing'?xs[0]<=xs[1]&&xs[1]<=xs[2]:xs[0]<xs[1]&&xs[1]<xs[2]));};
    assert.equal(s.solve({k:3,total:2,relation,order,domain:'integer',lowerOn:true,lower:-2,upperOn:true,upper:3}).answer,String(all.filter(ok).length),`${relation}/${order}`);
  }
});
test('잘못된 입력은 계산을 멈춘다',()=>{
  assert.equal(s.solve({k:2.5}).status,'invalid');
  assert.equal(s.solve({total:NaN}).status,'invalid');
  assert.equal(s.solve({domain:'something'}).status,'invalid');
  for (const malformed of [null, [], 7, '']) assert.equal(s.solve(malformed).status,'invalid');
  for (const name of ['constructor','toString','__proto__']) {
    assert.equal(s.solve({domain:name}).status,'invalid');
    assert.equal(s.solve({relation:name}).status,'invalid');
  }
});
