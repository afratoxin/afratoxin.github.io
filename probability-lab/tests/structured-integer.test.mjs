import test from 'node:test';
import assert from 'node:assert/strict';
import { integerSumSpec as spec } from '../engines/integer-sum.mjs';
const model=(k,left,right,more={})=>({k,structure:{enabled:true,left,relation:'eq',right,variables:Array.from({length:k},()=>({domain:'inherit',parity:'any',lower:null,upper:null})),conditions:[],...more}});
const text=r=>r.steps.map(s=>`${s.title} ${s.body} ${s.formula??''}`).join(' ');
function brute(ranges,predicate){let count=0;const walk=xs=>{if(xs.length===ranges.length){if(predicate(xs))count++;return;}for(const v of ranges[xs.length])walk([...xs,v]);};walk([]);return String(count);}
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);

test('structured factor-pair cases count residual stars and bars with individual parity and lower bounds',()=>{
 const input=model(4,'a+b+c+d','16',{conditions:[{kind:'expression',left:'a*b',relation:'eq',right:'12'}]});
 input.structure.variables[2].parity='odd'; input.structure.variables[3].lower=2;
 const r=spec.solve(input);
 assert.equal(r.answer,brute(Array(4).fill(range(1,16)),([a,b,c,d])=>a+b+c+d===16&&a*b===12&&c%2===1&&d>=2));
 assert.equal(r.solutionMethod,'factor-pairs');assert.match(text(r),/약수/);assert.match(text(r),/중복조합|조합/);assert.doesNotMatch(text(r),/D[ⱼ_j(]|동적 계획/);
 assert.ok(r.cases.length<=6);
});
test('squared differences explain the two symmetric signs rather than listing full tuples',()=>{
 const input=model(4,'a+b+c+d','12',{conditions:[{kind:'expression',left:'(a-b)^2',relation:'eq',right:'4'}]});
 const r=spec.solve(input);
 assert.equal(r.answer,brute(Array(4).fill(range(1,12)),([a,b,c,d])=>a+b+c+d===12&&(a-b)**2===4));
 assert.equal(r.solutionMethod,'symmetry');assert.match(text(r),/±2|\+2.*−2|2.*-2/);assert.match(text(r),/대칭/);
});
test('mixed coefficients, squares and arithmetic on both sides are exact',()=>{
 const r=spec.solve(model(4,'a+b+2*c+d^2','20'));
 assert.equal(r.answer,brute([range(1,20),range(1,20),range(1,10),range(1,4)],([a,b,c,d])=>a+b+2*c+d*d===20));
 assert.match(text(r),/중복조합|조합/);
 const q=spec.solve(model(3,'2*(a+b)-3','c+5',{variables:Array(3).fill({domain:'natural',upper:7})}));
 assert.equal(q.answer,brute(Array(3).fill(range(1,7)),([a,b,c])=>2*(a+b)-3===c+5));
});
test('only selected variables are even and selected upper bounds use inclusion-exclusion',()=>{
 const input=model(4,'a+b+c+d','12');input.structure.variables[0].parity='even';input.structure.variables[1].domain='positive-even';
 assert.equal(spec.solve(input).answer,brute(Array(4).fill(range(1,12)),([a,b,c,d])=>a+b+c+d===12&&a%2===0&&b%2===0));
 const bounded=model(4,'a+b+c+d','12');bounded.structure.variables[0].upper=3;bounded.structure.variables[2].upper=3;
 const r=spec.solve(bounded);assert.equal(r.answer,brute([range(1,3),range(1,12),range(1,3),range(1,12)],xs=>xs.reduce((s,v)=>s+v,0)===12));
 assert.equal(r.solutionMethod,'inclusion-exclusion');assert.match(text(r),/포함.*배제|초과/);
});
test('all six relations and local order constraints agree with independent enumeration',()=>{
 for(const relation of ['eq','ne','lt','le','gt','ge']){
  const input=model(3,'a*b-c','3',{relation,variables:Array(3).fill({domain:'integer',lower:-2,upper:3}),conditions:[{kind:'nondecreasing',variables:[0,1]},{kind:'distinct',variables:[0,2]}]});
  const r=spec.solve(input);const ok=x=>({eq:x===3,ne:x!==3,lt:x<3,le:x<=3,gt:x>3,ge:x>=3})[relation];
  assert.equal(r.answer,brute(Array(3).fill(range(-2,3)),([a,b,c])=>a<=b&&a!==c&&ok(a*b-c)),relation);
 }
});
test('safe bounds follow positive sums, squares, and positive products',()=>{
 assert.equal(spec.solve(model(2,'a*b','12')).answer,'6');
 const square=model(2,'a^2+b^2','5',{variables:Array(2).fill({domain:'integer'})});assert.equal(spec.solve(square).answer,'8');
 const unbounded=spec.solve(model(2,'a-b','0'));assert.equal(unbounded.status,'invalid');assert.match(unbounded.insight,/상한|범위/);
 assert.equal(spec.solve(model(2,'a*b','0',{variables:Array(2).fill({domain:'nonnegative'})})).status,'invalid');
});
test('invalid expressions and malicious or excessive models do not produce partial answers',()=>{
 for(const left of ['globalThis.process.exit()','a/2','a^3','a+h','a+1.2','a'.repeat(510),'10001+a','((((((((((((((((((((((((((((a))))))))))))))))))))))))))))']){
  assert.equal(spec.solve(model(2,left,'4')).status,'invalid',left);
 }
 const input=model(8,'a*b*c*d*e*f*g*h','1',{variables:Array(8).fill({domain:'natural',upper:40})});
 assert.equal(spec.solve(input).status,'invalid');
});
test('global constraints intersect overrides, and equation constants move across correctly',()=>{
 const p=model(3,'a+b+2','c+7',{variables:[{domain:'integer',lower:-2,upper:4},{upper:4},{upper:4}]});p.lowerOn=true;p.lower=0;
 assert.equal(spec.solve(p).answer,brute([range(0,4),range(1,4),range(1,4)],([a,b,c])=>a+b+2===c+7));
 const impossible=model(2,'a+b','7',{variables:[{domain:'positive-even',parity:'odd'},{}]});assert.equal(spec.solve(impossible).answer,'0');
});
test('plain global order uses gap substitution, and common caps have a school-level inclusion-exclusion proof',()=>{
 const bounded=spec.solve({k:3,total:9,upperOn:true,upper:5});assert.match(text(bounded),/포함.*배제/);assert.doesNotMatch(text(bounded),/D[ⱼ_j(]/);
 const p=model(3,'a+b+c','9');p.order='nondecreasing';p.upperOn=true;p.upper=5;const r=spec.solve(p);assert.equal(r.answer,brute(Array(3).fill(range(1,5)),([a,b,c])=>a<=b&&b<=c&&a+b+c===9));assert.match(text(r),/간격|차이/);assert.doesNotMatch(text(r),/D[ⱼ_j(]/);
 const unicode=model(3,'x1+x2+x3','9',{conditions:[{kind:'expression',left:'(a−b)²',relation:'eq',right:'4'}]});assert.equal(spec.solve(unicode).answer,'6');
});
test('plain parity contradictions stay zero even on otherwise unbounded integer domains',()=>{
 const input=model(3,'a+b+c','8');input.domain='integer-odd';assert.equal(spec.solve(input).answer,'0');
 const p=model(3,'a+b+c','8',{variables:Array(3).fill({domain:'integer-odd'})});assert.equal(spec.solve(p).answer,'0');
});
test('a pure positive product distributes prime exponents by stars and bars',()=>{
 const p=model(4,'a*b*c*d','12');const r=spec.solve(p);assert.equal(r.answer,'40');assert.equal(r.solutionMethod,'prime-exponents');assert.match(text(r),/소인수|지수/);assert.match(text(r),/C\(5,\s*3\).*C\(4,\s*3\)/);
 const bounded=model(4,'a*b*c*d','12',{variables:Array(4).fill({upper:12})});assert.equal(spec.solve(bounded).answer,'40');
});
test('residual proof formulas distinguish strict, cumulative and complement boundaries',()=>{
 for(const relation of ['eq','ne','lt','le','gt','ge']){
  const p=model(3,'a+b+c','7',{relation,variables:[{upper:3},{},{}]});p.upperOn=true;p.upper=5;
  const r=spec.solve(p);const formula=r.steps.find(s=>s.title==='상한 초과를 포함배제로 제외').formula;
  assert.match(formula,relation==='eq'||relation==='ne'?/m−1, m−1/:/\+m, m/);
  if(relation==='lt'||relation==='ge')assert.match(text(r),/S−1|S − 1/);
  assert.equal(r.cases.reduce((s,c)=>s+BigInt(c.count),0n),BigInt(r.answer));
 }
 const r=spec.solve(model(4,'a+b+c+d','16',{variables:[{},{},{parity:'odd'},{lower:2}],conditions:[{kind:'expression',left:'a*b',relation:'eq',right:'12'}]}));assert.ok(r.cases.every(c=>/⌊|C\(/.test(c.detail??'')));
});
test('symmetry rows multiply identical residual combinations and expensive predicate work is bounded',()=>{
 const p=model(4,'a+b+c+d','12',{conditions:[{kind:'expression',left:'(a-b)^2',relation:'eq',right:'4'}]});const r=spec.solve(p);assert.ok(r.cases.every(c=>/2 ×.*C\(/.test(c.detail)));
 const stress=model(4,'0','0',{variables:Array(4).fill({upper:37}),conditions:Array(12).fill({kind:'expression',left:'a^2+b^2+c^2+d^2',relation:'ge',right:'0'})});assert.equal(spec.solve(stress).status,'invalid');
});
test('a constant contradiction proves zero before finite-bound checks',()=>{
 const p=model(2,'a-a','0',{relation:'ne'});assert.equal(spec.solve(p).answer,'0');
 const q=model(2,'a-b','0',{conditions:[{kind:'expression',left:'a-a',relation:'ne',right:'0'}]});assert.equal(spec.solve(q).answer,'0');
});
