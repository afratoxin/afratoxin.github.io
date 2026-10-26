import test from 'node:test';
import assert from 'node:assert/strict';
import { createExamSpec } from '../engines/exam-limits.mjs';
import { integerSumSpec } from '../engines/integer-sum.mjs';
const raw={id:'fixture',defaults:{n:1},controls:[{key:'n',type:'number',min:0,max:999,step:1}],presets:[{name:'작은 수',params:{n:2}},{name:'큰 수',params:{n:1000}}],solve:p=>({status:'ok',question:`n=${p.n}`,answer:String(p.n),exact:String(p.n),numeric:p.n,unit:'개',steps:[{title:'대응',formula:`${p.n}`}],cases:[]})};
const resultSpec=result=>createExamSpec({...raw,solve:()=>({status:'ok',question:'변수의 값을 구한다.',answer:'1',exact:'1',numeric:1,steps:[],cases:[],...result})});

test('public limits permit 999 and reject 1000 without clipping exact answers',()=>{
 const s=createExamSpec(raw);assert.equal(s.solve({n:999}).answer,'999');assert.equal(s.solve({n:1000}).status,'invalid');assert.equal(resultSpec({exact:'1000'}).solve({}).status,'invalid');
 assert.equal(resultSpec({exact:'-999'}).solve({}).status,'ok');assert.equal(resultSpec({exact:'-1000'}).solve({}).status,'invalid');
});
test('fractions, powers and full sample-space facts enforce the cap before simplification',()=>{
 for(const value of ['1000/3','3/1000','1/0','σ / 0','1 / - 0','1e3','10^3','(10)^3','999²','999^1.5'])assert.equal(resultSpec({exact:value}).solve({}).status,'invalid',value);
 for(const value of ['999/998','0.3413','1.959963984','-9.99e2'])assert.equal(resultSpec({exact:value}).solve({}).status,'ok',value);
 const s=createExamSpec(raw,{facts:()=>({counts:[1n],denominators:[1296n],values:[]})});assert.equal(s.solve({}).status,'invalid');
});
test('every displayed math field is checked while source years and normal-table metadata remain intact',()=>{
 for(const result of [{question:'a=1000'},{answer:'1000개'},{steps:[{body:'전체는 1000'}]},{cases:[{label:'a=1',count:'1000'}]},{samples:['(1000, 1)']},{chart:[{label:'1',value:1000}]}])assert.equal(resultSpec(result).solve({}).status,'invalid');
 const s=resultSpec({question:'2022학년도 9월 평가원 정규분포표',normalTable:{sourceYear:2022,area:'0.3413'},source:{year:2022,pdfPage:1000}});assert.equal(s.solve({}).status,'ok');
});
test('strict dynamic control bounds and prototypes cannot be bypassed by direct payloads',()=>{
 const s=createExamSpec(raw,{controls:(p,controls)=>controls.map(c=>({...c,max:p.n===1?5:9}))});assert.equal(s.solve({n:10}).status,'invalid');assert.equal(s.solve({n:1.5}).status,'invalid');
 assert.equal(s.solve(JSON.parse('{"n":1,"__proto__":{"polluted":true}}')).status,'invalid');assert.equal({}.polluted,undefined);
});
test('expression literals and derived constants are bounded without silently changing domains',()=>{
 const s=createExamSpec(integerSumSpec),model=(right,upper=998)=>({k:2,structure:{enabled:true,left:'a+b',relation:'eq',right,variables:[{domain:'natural',upper},{domain:'natural'}],conditions:[]}});
 assert.equal(s.solve(model('999')).answer,'998');for(const expression of ['1000','500+500','(500*3)-501'])assert.equal(s.solve(model(expression)).status,'invalid',expression);
 const p={k:2,structure:{enabled:true,left:'0',relation:'eq',right:'0',variables:[{domain:'integer',lower:0,upper:998},{domain:'integer',lower:0,upper:0}],conditions:[]}};
 assert.equal(s.solve(p).answer,'999');p.structure.variables[0].upper=999;assert.equal(s.solve(p).status,'invalid');
});
test('safe presets, exact allowed-value holes and dependent normalization are exposed',()=>{
 const s=createExamSpec({...raw,controls:[{...raw.controls[0],max:9}],solve:p=>({...raw.solve(p),exact:String(p.n===3?1000:p.n)})});assert.deepEqual(s.presets.map(p=>p.name),['작은 수']);assert.deepEqual(s.allowedValues('n',{}),[0,1,2,4,5,6,7,8,9]);
 const r={...raw,defaults:{n:2,m:4},controls:[...raw.controls,{key:'m',type:'number',min:0,max:9,step:1}]};const coupled=createExamSpec(r,{controls:(p,c)=>c.map(x=>x.key==='m'?{...x,max:p.n}:x)});assert.equal(coupled.normalizeParams({n:2,m:4},'n').m,2);assert.equal(coupled.normalizeParams({n:2,m:4},'m').m,4);
});
test('dynamic bounds do not shift the decimal step grid away from valid typed values',()=>{
 const decimal={...raw,defaults:{n:50},controls:[{key:'n',label:'평균',type:'number',min:-999,max:999,step:0.1}]};const s=createExamSpec(decimal,{controls:(p,c)=>c.map(control=>({...control,min:-997.04,max:997.04}))});assert.equal(s.solve({n:50}).status,'ok');
});
test('plain integer sums expose physical lower sums and synchronize simple-structure probes',()=>{
 const s=createExamSpec(integerSumSpec);assert.equal(s.getControls({}).find(c=>c.key==='total').min,4);assert.equal(s.allowedValues('total',{})[0],4);
 const p={...s.defaults,structure:{enabled:true,left:'a+b+c+d',relation:'eq',right:'7',variables:[{},{},{},{}],conditions:[]}};assert.deepEqual(s.allowedValues('total',p),s.allowedValues('total',{}));assert.ok(s.allowedValues('k',p).includes(8));const expanded=s.normalizeParams({...p,k:8},'k');assert.equal(expanded.total,8);assert.equal(expanded.structure.right,'8');assert.equal(s.solve(expanded).answer,'1');
 const custom={k:8,structure:{enabled:true,left:'0',relation:'eq',right:'0',variables:Array(8).fill({domain:'integer',lower:0,upper:0}),conditions:[]}};assert.equal(s.solve(custom).answer,'1');
});

test('moving both sides of a constraint cannot hide a coefficient or constant above the cap',()=>{
 const s=createExamSpec(integerSumSpec),structure={enabled:true,left:'999*a+b',relation:'eq',right:'-999*a+b',variables:Array(2).fill({domain:'integer',lower:0,upper:1}),conditions:[]};assert.equal(s.solve({k:2,structure}).status,'invalid');
 assert.equal(s.solve({k:2,structure:{...structure,left:'a+b+999',right:'-999'}}).status,'invalid');
});
