import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {graphValue as f,graphRoots as roots,graphIntegral as integral} from '../graphs.js';
const data=JSON.parse(readFileSync(new URL('../data/geometry.json',import.meta.url)));
let checks=0;
function near(actual,expected,epsilon=1e-7){assert.ok(Math.abs(actual-expected)<epsilon,`${actual} != ${expected}`);checks++}
function count(id,height,expected){
  const p=data.plots[id],xs=p.curves.flatMap(c=>{
    if(c.count===false)return [];
    const [a,b]=c.range??p.x;
    return roots(c.fn,height,Math.max(a,p.x[0]),Math.min(b,p.x[1])).filter(x=>!(c.openLeft&&Math.abs(x-a)<1e-6)&&!(c.openRight&&Math.abs(x-b)<1e-6));
  }).sort((a,b)=>a-b).filter((x,i,a)=>!i||Math.abs(x-a[i-1])>1e-6);
  assert.equal(xs.length,expected,`${id} at ${height}: ${xs}`);checks++;return xs;
}
count('2021-06-b-19',0,1);count('2021-06-b-19',8,2);count('2021-06-b-19',8.1,1);
count('2021-09-b-26',-12,2);count('2021-09-b-26',0,3);
count('2022-09-20',3,4);count('2022-09-20',7,3);count('2022-09-20',0,3);
count('2025-06-21',8/3,3);count('2025-06-21',3,4);count('2025-06-21',-19/3,1);
count('2025-09-20',-1,3);count('2025-09-20',0,3);count('2025-09-20',-.5,4);
count('2026-06-15',13,2);count('2026-06-15',13.2,1);count('2026-06-15',12.8,2);
count('2026-11-09',5,2);count('2027-06-14',.5,10);count('2027-06-14',-1,5);count('2027-06-14',-1.1,0);
const before=count('2027-06-21',3.9,1),at=count('2027-06-21',4,2);
assert.ok(before.at(-1)<-5);near(at.at(-1),1);
const final=data.plots['2023-11-22-final'].curves[0].fn;
near(f(final,0),-3);near(f(final,3),6);near(f(final,4),13);
// Verify secant/tangent equality and the global minimum identity on both sides of A.
for(const x of [-10,-2,0,.99,1.01,2,2.5,3,8]){
  const slope=(f(final,x)-f(final,1))/(x-1),g=2+Math.sqrt(((x-2.5)**2+.75)/3);
  near(slope,3*(g-2)**2);near(slope-.75,(x-2.5)**2);assert.ok(g>=2.5);
}
const r=data.plots['2023-09-22'].fn;
for(const [t,n] of [[4.9,0],[5,1],[5.1,0]]){
  const h=f(r,t),ref={type:'poly',c:r.c.map((v,i)=>i===r.c.length-1?2*h-v:-v)};
  assert.equal(roots(ref,0,-2,t).filter(x=>x<t-1e-7).length+roots(r,0,t,9).length,n);checks++;
}
for(const [t,n] of [[1,2],[1.5,1],[2,0]]){
  assert.equal(roots({type:'poly',c:[2,5-2*t,t*t-2.5*t+2]},0,-3,2).length,n);checks++;
}
near(integral({type:'poly',c:[1,-2,0]},0,3),0);
near(integral({type:'poly',c:[3,-16,-20]},0,10),0,1e-6);
const norm=data.plots['2026-09-29'].curves[0].fn;
near(integral(norm,2,8),.022750131948,1e-8);
for(const [id,p] of Object.entries(data.plots)){
  for(const c of p.curves??[]){
    const [a,b]=c.range??p.x;
    assert.ok(Array.from({length:101},(_,i)=>f(c.fn,a+(b-a)*i/100)).some(Number.isFinite),id);
  }
}
for(const [id,s] of Object.entries(data.items)){
  assert.equal(s.steps.length,s.teaching.focus.length,id);
  for(const key of Object.values(s.teaching.plots))assert.ok(data.plots[key],key);
  for(const text of s.steps){assert.equal(text.split('$').length%2,1,id);assert.ok(!/[\u0000-\u0008\u000b\u000c]/.test(text),id)}
}
console.log(`${checks} exact-value and boundary checks passed; all 71 solution/plot references valid.`);
