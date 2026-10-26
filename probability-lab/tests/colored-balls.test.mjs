import test from 'node:test';
import assert from 'node:assert/strict';
import { specById } from '../engines.mjs';
const draw=p=>specById.get('selection').solve({colorKinds:3,red:2,blue:2,yellow:1,draw:2,relation:'none',redTarget:0,replacement:false,ordered:false,query:'probability',...p});
const group=(rules=[],logic='and',negate=false)=>({rules,logic,negate});
const rules=(event=[],given=[])=>({event:group(event),given:group(given)});
const count=(colors,target,relation='eq')=>({kind:'count',colors,target,relation});
const kinds=target=>({kind:'kinds',colors:[0,1,2],target,relation:'eq'});
const boxes=p=>{assert.ok(specById.has('distribution'),'상자 분배 모형이 있어야 한다');return specById.get('distribution').solve({colorKinds:2,red:2,blue:1,boxes:3,ballsDistinct:false,boxesDistinct:true,...p});};
test('three color extraction uses physical-ball weights, not equal composition weights',()=>{
 const r=draw({ballRules:rules([kinds(2)])});assert.equal(r.status,'ok');assert.equal(r.exact,'4/5');assert.match(r.question,/노랑/);assert.match(JSON.stringify(r.steps),/조합|C\(/);
});
test('six colors are independent and legacy two-color links retain their answer',()=>{
 const r=draw({colorKinds:6,red:1,blue:1,yellow:1,green:1,purple:1,black:1,draw:2,query:'count',ballRules:rules([count([4,5],1,'ge')])});assert.equal(r.exact,'9');
 assert.equal(specById.get('selection').solve({red:4,blue:5,draw:4,redTarget:2,relation:'eq',replacement:false}).exact,'60');
});
test('subset parity, algebra, unions, complements, and conditional probability compose',()=>{
 const parity={kind:'parity',colors:[0,2],target:0};
 const expression={kind:'expression',left:'a*b+c^2',right:'1',relation:'ge'};
 const r=draw({ballRules:rules([expression],[parity])});assert.equal(r.status,'ok');
 // Conditioning: counts(red+yellow) is even => BB(1), RR(1), RY(2); the last alone has product+square >=1.
 assert.equal(r.exact,'1/2');
 const union=draw({ballRules:{event:group([count([0],0),count([1],0)],'or',true)}});assert.equal(union.exact,'2/5');
 assert.equal(draw({ballRules:rules([],[count([0],3)])}).status,'invalid');
});
test('ordered first and last colors intersect given counts correctly',()=>{
 const r=draw({replacement:true,ordered:true,draw:3,firstColor:0,lastColor:1,ballRules:rules([], [count([0],1)])});
 assert.equal(r.status,'ok');assert.equal(r.exact,'2/9');
 const apart=draw({colorKinds:2,red:1,blue:1,replacement:true,ordered:true,draw:3,sequence:'apart'});assert.equal(apart.exact,'1/4');
});
test('distribution distinguishes color, object identity, and box identity',()=>{
 assert.equal(boxes({}).exact,'18');
 assert.equal(boxes({ballsDistinct:true}).exact,'27');
 assert.equal(boxes({colorKinds:1,red:4,boxes:2}).exact,'5');
 assert.equal(boxes({colorKinds:1,red:4,boxes:2,boxesDistinct:false}).exact,'3');
 assert.equal(boxes({colorKinds:1,red:4,boxes:2,boxesDistinct:false,ballsDistinct:true}).exact,'8');
 assert.equal(boxes({colorKinds:1,red:0,boxes:3,boxesDistinct:false,ballsDistinct:true}).exact,'1');
});
test('local box conditions support only selected boxes and colors',()=>{
 const r=boxes({ballRules:rules([{kind:'eachBox',boxes:[0],colors:[0,1],target:1,relation:'le'},{kind:'boxKinds',boxes:[1],colors:[0,1],target:2,relation:'eq'}])});
 assert.equal(r.status,'ok');assert.equal(r.exact,'3');
 const algebra=boxes({ballRules:rules([{kind:'expression',colors:[0,1],left:'a^2-b',right:'0',relation:'eq'}])});assert.equal(algebra.status,'ok');
});
test('global occupied, monochrome, and all-color box constraints are computable',()=>{
 assert.equal(boxes({ballRules:rules([{kind:'allColorsBoxes',colors:[0,1],target:1,relation:'ge'}])}).exact,'9');
 assert.equal(boxes({ballRules:rules([{kind:'occupiedBoxes',target:3,relation:'eq'}])}).exact,'3');
 const r=boxes({boxesDistinct:false,ballRules:rules([{kind:'occupiedBoxes',target:2,relation:'eq'}])});assert.equal(r.exact,'2');
 assert.equal(boxes({boxesDistinct:false,ballRules:rules([{kind:'eachBox',boxes:[0],colors:[0],target:0,relation:'eq'}])}).status,'invalid');
});
test('input and output limits apply before expensive calculations or invalid sharing',()=>{
 assert.equal(draw({red:1000}).status,'invalid');
 assert.equal(draw({colorKinds:2,red:4,blue:5,draw:5,replacement:true,ordered:true}).status,'invalid');
 assert.equal(boxes({red:10,blue:10,boxes:5,ballsDistinct:true}).status,'invalid');
 assert.equal(draw({ballRules:rules([{kind:'expression',left:'a+1000',right:'0',relation:'ge'}])}).status,'invalid');
 assert.equal(draw({ballRules:rules([count([5],1)])}).status,'invalid');
});
test('all authored colored-ball presets stay within the public 999 policy',()=>{
 for(const id of ['selection','distribution']){const s=specById.get(id);assert.ok(s);assert.equal(s.solve(s.defaults).status,'ok');for(const p of s.presets)assert.equal(s.solve(p.params).status,'ok',p.name);}
});
test('ordered nonreplacement probability uses every physical ordering in the denominator',()=>{
 const r=draw({colorKinds:2,red:2,blue:1,ordered:true,ballRules:rules([count([0],2)])});
 assert.equal(r.status,'ok');assert.equal(r.exact,'1/3');
 const all=draw({colorKinds:2,red:2,blue:1,ordered:true});assert.equal(all.exact,'1');
});
test('independent physical-ball oracle covers extraction modes, sequence conditions and conditioning',()=>{
 const pool=[0,0,1,2];
 for(const replacement of [false,true])for(const ordered of [false,true])for(const sequence of (ordered||replacement?['any','apart','repeat','sameEnds','differentEnds']:['any'])){
  const n=3,results=[];
  function visit(seq,used){if(seq.length===n){results.push(seq);return;}for(let i=0;i<pool.length;i++){if(!replacement&&used.includes(i)||!ordered&&!replacement&&used.length&&i<=used.at(-1))continue;visit([...seq,pool[i]],[...used,i]);}}
  visit([],[]);let numerator=0,denominator=0;
  for(const seq of results){const reds=seq.filter(x=>x===0).length;if(reds<1)continue;denominator++;
   const equal=seq.some((x,i)=>i>0&&seq[i-1]===x),seqOK=sequence==='any'||sequence==='apart'&&!equal||sequence==='repeat'&&equal||sequence==='sameEnds'&&seq[0]===seq.at(-1)||sequence==='differentEnds'&&seq[0]!==seq.at(-1);
   if(seqOK&&new Set(seq).size===2)numerator++;
  }
  const r=draw({colorKinds:3,red:2,blue:1,yellow:1,draw:n,replacement,ordered,sequence,ballRules:rules([kinds(2)],[count([0],1,'ge')])});
  assert.equal(r.status,'ok',JSON.stringify({replacement,ordered,sequence}));assert.ok(Math.abs(r.numeric-numerator/denominator)<1e-12,`${replacement}/${ordered}/${sequence}: ${r.exact} vs ${numerator}/${denominator}`);
 }
});
test('unlabeled colored partitions agree with independent assignments of physical balls',()=>{
 for(const colors of [[0,0,1],[0,0,1,1],[0,1,2]])for(const k of [1,2,3])for(const distinct of [false,true]){
  const expected=new Set();
  function visit(assign){if(assign.length<colors.length){for(let j=0;j<k;j++)visit([...assign,j]);return;}
   const groups=Array.from({length:k},()=>[]);assign.forEach((box,i)=>groups[box].push(distinct?i:colors[i]));
   expected.add(groups.map(g=>g.sort((a,b)=>a-b).join(',')).sort().join('|'));
  }visit([]);
  const a=[0,0,0];colors.forEach(i=>a[i]++);
  const r=boxes({colorKinds:Math.max(...colors)+1,red:a[0],blue:a[1],yellow:a[2],boxes:k,ballsDistinct:distinct,boxesDistinct:false});
  assert.equal(r.status,'ok');assert.equal(Number(r.exact),expected.size,JSON.stringify({colors,k,distinct}));
 }
});
test('one-or-more color conditions choose a complement explanation',()=>{
 const r=draw({ballRules:rules([count([0,2],1,'ge')])});assert.equal(r.status,'ok');assert.equal(r.exact,'9/10');assert.match(JSON.stringify(r.steps),/여사건/);
});
test('a complemented empty condition is described as impossible rather than unrestricted',()=>{
 const r=draw({ballRules:{event:group([],'and',true)}});assert.equal(r.exact,'0');assert.match(r.question,/불가능|여사건/);
});
test('monochrome boxes use all colors even when a stale color subset is supplied',()=>{
 const r=boxes({colorKinds:2,red:1,blue:1,boxes:1,ballRules:rules([{kind:'monoBoxes',colors:[0],relation:'eq',target:1}])});assert.equal(r.exact,'0');
});
test('zero-stock colors never create impossible replacement states for event or given expressions',()=>{
 const expression={kind:'expression',left:'(b^2)^2',right:'0',relation:'eq'};
 for(const ballRules of [rules([expression]),rules([],[expression])]){
  const r=draw({colorKinds:2,red:1,blue:0,draw:10,replacement:true,ordered:true,ballRules});
  assert.equal(r.status,'ok',r.insight);assert.equal(r.exact,'1');
 }
});
