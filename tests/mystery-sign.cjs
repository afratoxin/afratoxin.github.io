const A=require('node:assert/strict'),M=require('../brain-arena/puzzles/mystery.js');let seed=17815;const r=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296),rule=id=>M.rules.find(q=>q.id===id).calc;
A.equal(M.rules.length,63);A.equal(new Set(M.rules.map(q=>q.id)).size,63);A.equal(new Set(M.rules.map(q=>q.group)).size,6);
A.equal(rule('digit-sum')(123,45),15);A.equal(rule('holes')(808,69),7);A.equal(rule('segments')(10,8),15);A.equal(rule('common-digits')(112,121),3);A.equal(rule('prime-digits')(2357,418),4);A.equal(rule('gcd')(18,24),6);A.equal(rule('lcm')(18,24),72);A.equal(rule('divisors')(12,6),10);A.equal(rule('prime-factors')(12,18),6);A.equal(rule('distinct-prime-factors')(12,18),2);A.equal(rule('between-primes')(2,7),2);A.equal(rule('closed-primes')(2,7),4);A.equal(rule('between-integers')(9,10),0);
A.equal(M.korean(101),'백일');A.equal(M.korean(110),'백십');A.equal(M.korean(1234),'천이백삼십사');A.equal(rule('korean-length')(12,103),4);A.equal(rule('korean-finals')(37,14),4);A.equal(rule('korean-jamo')(37,14),14);A.equal(rule('korean-initial-ieung')(12,101),2);A.equal(rule('korean-common')(112,121),3);
A.equal(M.places(1,8),3);A.equal(M.places(100,20),0);A.equal(M.places(1,3),null);A.equal(M.period(1,6),1);A.equal(M.period(1,7),6);A.equal(M.period(1,8),0);A.equal(rule('decimal-first')(1,20),0);
const retired=['sum','subtract','multiply','gap','quotient','remainder','max','min','digit-count','comparison'];
for(const id of retired)A(!M.rules.some(q=>q.id===id),'no one-step rule: '+id);
const known={
 'product-minus-both':[7,4,17], 'product-plus-difference':[7,4,31], 'square-sum':[7,4,65],
 'sum-times-adjusted-gap':[7,4,44], 'quotient-plus-remainder':[37,8,9],
 'front-digit-product-minus-back':[234,17,7], 'front-digit-product-plus-back':[234,17,41],
 'front-digit-sum-times-back':[234,17,153], 'digit-product-gap':[23,47,22],
 'digit-product-times-sum':[23,47,66], 'reversed-front-gap':[23,47,15], 'reverse-added':[23,47,7],
 'digit-sum-gap-square':[23,47,36], 'cross-digit-products':[23,47,26], 'cross-digit-gap':[23,47,2],
 'digit-axis-product':[23,47,60], 'swapped-units-product':[23,47,1161], 'square-digit-sums':[23,47,146]
};
for(const [id,[a,b,expected]] of Object.entries(known))A.equal(rule(id)(a,b),expected,id);
A.equal(rule('front-digit-product-minus-back')(20,13),-13);
A.equal(rule('reverse-added')(50,50),1);
A.equal(M.output(M.rules.find(q=>q.id==='front-digit-product-minus-back'),7,4),null,'no one-digit degeneration');
const broadcast={
 'larger-plus-gap':[22,7,37], 'sum-gap-concat':[16,9,257], 'larger-remainder':[4,19,3],
 'digit-sums-product':[21,15,18], 'sum-mod-twelve':[18,13,7], 'sum-times-back':[7,4,44]
};
for(const [id,[a,b,expected]] of Object.entries(broadcast))A.equal(rule(id)(a,b),expected,id);
A.equal(rule('sum-gap-concat')(36,87),12351);A.equal(rule('sum-gap-concat')(12,12),240);
A.equal(Object.keys(M.standard).length,18);
const assertStandard=p=>{
 const profile=M.standard[p.ruleId];A(profile,'only curated default rules');A.equal(p.pool,'standard');
 A(profile.band<=(p.level<=3?1:p.level<=7?2:3),'gradual progression');
 const [loA,hiA,loB,hiB]=profile.range;
 for(const [a,b] of [...p.examples.map(e=>e.pair),p.question]){A(a>=loA&&a<=hiA&&b>=loB&&b<=hiB);A(a<=99&&b<=99,'short mental calculation');}
 const q=M.rules.find(q=>q.id===p.ruleId);A(!['decimal','korean'].includes(q.group),'obscure rules kept out of default');
};
const openings=new Set();for(let i=0;i<80;i++){const p=M.make(1,r);assertStandard(p);openings.add(p.ruleId);}
A(openings.size>=6,'varied approachable openings');
for(let run=0;run<8;run++){const seen=[];for(let level=1;level<=11;level++){const p=M.make(level,r,{exclude:seen});assertStandard(p);A(!seen.includes(p.ruleId),'no repeat in default run');seen.push(p.ruleId);}}
for(const id of Object.keys(M.standard)){const p=M.make(11,r,{pool:'standard',exclude:M.rules.filter(q=>q.id!==id).map(q=>q.id)});A.equal(p.ruleId,id);assertStandard(p);}
let count=0;for(const target of M.rules)for(let i=0;i<4;i++){
 const p=M.make(1,r,{pool:'all',exclude:M.rules.filter(q=>q.id!==target.id).map(q=>q.id)});A.equal(p.ruleId,target.id);A.equal(p.examples.length,6);A.equal(new Set(p.examples.map(e=>e.pair.join())).size,6);A(!p.examples.some(e=>e.pair.join()===p.question.join()));
 const remaining=M.rules.filter(q=>p.examples.every(e=>M.output(q,...e.pair)===e.value));A(remaining.length);for(const q of remaining)A.equal(M.output(q,...p.question),p.answer);A.equal(target.calc(...p.question),p.answer);const explanation=M.explain(p);A.equal(explanation.rows.length,7);if(target.compound){A(target.valid(...p.question));for(const e of p.examples)A(target.valid(...e.pair));A(explanation.rows.every(row=>row.working.endsWith('= '+row.value)));}count++;
}
const history=[];for(let i=0;i<M.rules.length;i++){const p=M.make(1,r,{pool:'all',exclude:history});A(!history.includes(p.ruleId));history.push(p.ruleId);if(i===5)A.equal(new Set(history.map(id=>M.rules.find(q=>q.id===id).group)).size,6);}A.equal(history.length,M.rules.length);
for(const pool of ['easy','hard',...Object.keys(M.groups)])for(let i=0;i<3;i++){const p=M.make(1,r,{pool}),q=M.rules.find(q=>q.id===p.ruleId);if(pool==='easy')A(q.difficulty<=2);else if(pool==='hard')A(q.difficulty>=3);else A.equal(q.group,pool);}
console.log('PASS: '+count+' forced-rule questions across 63 rules and six families; independent known results including Korean/prime/decimal edge cases; all consistent registered rules agree on unseen target; full non-repeating balanced coverage and pool filters.');
