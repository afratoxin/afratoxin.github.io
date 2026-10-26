import test from 'node:test';
import assert from 'node:assert/strict';
import {countingSpecs} from '../engines/counting.mjs';
const {countingLimitProfiles:profiles={}}=await import('../engines/counting-limits.mjs').catch(error=>{
  if(error.code==='ERR_MODULE_NOT_FOUND')return {};
  throw error;
});
const raw=id=>countingSpecs.find(spec=>spec.id===id);
const profile=id=>{assert.ok(profiles[id],`${id} limit profile exists`);return profiles[id];};
const merged=(id,params={})=>({...raw(id).defaults,...profile(id).defaults,...params});
const controls=(id,params={})=>profile(id).controls(merged(id,params),raw(id).controls);
const control=(id,key,params={})=>controls(id,params).find(item=>item.key===key);
const within=value=>{const n=typeof value==='bigint'?value:BigInt(value);return n>=-999n&&n<=999n;};
function allowed(id,overrides={}) {
  const params=merged(id,overrides),p=profile(id);
  if(p.validate?.(params))return false;
  const result=raw(id).solve(params);
  if(result.status!=='ok')return false;
  const facts=p.facts?.(params,result)||{};
  return Object.values(facts).every(values=>values.every(within));
}

test('all counting profiles preserve raw modules and provide safe default/preset manuscripts',()=>{
  assert.deepEqual(Object.keys(profiles),countingSpecs.map(spec=>spec.id));
  for(const spec of countingSpecs) {
    const p=profile(spec.id),params=merged(spec.id);
    assert.equal(allowed(spec.id,params),true,`${spec.id} defaults`);
    const presets=p.presets??spec.presets;
    assert.ok(presets.length);
    for(const preset of presets) {
      assert.equal(allowed(spec.id,preset.params),true,`${spec.id}: ${preset.name}`);
      const result=spec.solve({...spec.defaults,...p.defaults,...preset.params});
      const visible=[result.question,result.answer,result.insight,...result.steps.flatMap(s=>[s.title,s.body,s.formula||'']),...(result.cases||[]).flatMap(c=>[c.label,c.count,c.detail||''])].join('\n');
      for(const token of visible.match(/[+-]?\d+(?:\.\d+)?/g)||[])assert.ok(Math.abs(Number(token))<=999,`${spec.id} preset contains visible number ${token}`);
    }
    const before=JSON.stringify(spec.controls),adapted=p.controls(params,spec.controls);
    assert.notEqual(adapted,spec.controls);
    assert.equal(JSON.stringify(spec.controls),before);
    for(let i=0;i<adapted.length;i++)assert.notEqual(adapted[i],spec.controls[i]);
  }
  assert.equal(raw('coefficient').solve({a:1,b:1,p:2,q:0,n:30,target:2}).exact,'30');
  assert.equal(raw('function').controls.find(c=>c.key==='domain').max,12);
});

test('valid large parameter choices remain available when the numbers actually used fit',()=>{
  assert.equal(allowed('arrangement',{a:10,b:0,c:0,condition:'none',circular:false}),true);
  assert.equal(allowed('selection',{red:20,blue:20,draw:2,redTarget:1,relation:'eq',replacement:false}),true);
  assert.equal(allowed('selection',{red:7,blue:8,draw:12,redTarget:5,relation:'eq',replacement:false}),true);
  assert.equal(allowed('function',{domain:3,codomain:10,fixed:0,constraint:'injective'}),true);
  assert.equal(allowed('coefficient',{a:1,b:1,p:2,q:0,n:30,target:2}),true);
  assert.equal(allowed('conditional',{n:18,draw:3,condition:'sum-even',event:'include',eventValue:1}),true);
});

test('counts and unreduced probability sample spaces above 999 are rejected',()=>{
  assert.equal(allowed('arrangement',{a:10,b:10,c:10,condition:'none'}),false);
  assert.equal(allowed('selection',{red:7,blue:8,draw:7,replacement:false}),false);
  assert.equal(allowed('function',{domain:3,codomain:10,fixed:0,constraint:'none'}),false);
  assert.equal(allowed('function',{domain:4,codomain:10,fixed:0,constraint:'injective'}),false);
  assert.equal(allowed('coefficient',{a:9,b:9,p:1,q:1,n:5,target:5}),false);
  assert.equal(allowed('probability-count',{sides:6,rolls:4,statistic:'max',target:5}),false);
  assert.equal(allowed('conditional',{n:18,draw:9}),false);
});

test('selection bounds respond to pool size, replacement and the actual binomial coefficients',()=>{
  assert.equal(control('selection','draw',{red:20,blue:20,draw:2,replacement:false}).max,2);
  assert.equal(control('selection','draw',{red:7,blue:8,draw:12,replacement:false}).max,15);
  assert.equal(control('selection','redTarget',{draw:12,red:7,blue:8}).max,12);
  const replacement={red:2,blue:3,draw:4,replacement:true};
  assert.equal(control('selection','draw',replacement).max,4);
  assert.equal(control('selection','red',replacement).max,2);
  assert.equal(control('selection','blue',replacement).max,3);
  const facts=profile('selection').facts(merged('selection',replacement),raw('selection').solve(replacement));
  assert.ok(facts.counts.some(x=>BigInt(x)===625n));
});

test('function fixed images and coefficient degrees track their own parameters',()=>{
  assert.equal(control('function','fixed',{domain:3}).max,3);
  const params=merged('function',{domain:3,codomain:10,fixed:0,constraint:'injective'});
  const facts=profile('function').facts(params,raw('function').solve(params));
  assert.ok(facts.counts.some(x=>BigInt(x)===720n));
  assert.ok(!facts.counts.some(x=>BigInt(x)===1000n),'unused total-function space is not an artificial restriction on injective functions');
  assert.equal(control('coefficient','n',{a:1,b:1,p:2,q:0,n:30,target:2}).max,30);
  assert.equal(control('coefficient','target',{n:5,p:1,q:2}).min,5);
  assert.equal(control('coefficient','target',{n:5,p:1,q:2}).max,10);
});

test('dice controls bound the full denominator and the selected statistic support',()=>{
  assert.equal(control('probability-count','rolls',{sides:6,rolls:3}).max,3);
  assert.equal(control('probability-count','sides',{sides:6,rolls:3}).max,9);
  for(const [statistic,min,max] of [['sum',3,18],['product',1,216],['max',1,6]]) {
    const c=control('probability-count','target',{sides:6,rolls:3,statistic});
    assert.equal(c.min,min);assert.equal(c.max,max);
  }
  const p=merged('probability-count',{sides:6,rolls:3});
  const facts=profile('probability-count').facts(p,raw('probability-count').solve(p));
  assert.ok(facts.denominators.some(x=>BigInt(x)===216n));
  assert.equal((profile('probability-count').presets||[]).find(x=>x.params.statistic==='max').params.rolls,3);
});

test('card ranges follow subset size, conditioning event and real possible sums',()=>{
  assert.equal(control('conditional','n',{n:18,draw:3}).max,18);
  assert.equal(control('conditional','draw',{n:18,draw:3}).max,3);
  assert.equal(control('conditional','draw',{n:13,draw:4}).max,9,'safe high-end choices survive the holes in binomial coefficients');
  assert.equal(control('conditional','conditionValue',{n:8,draw:3}).max,8);
  assert.equal(control('conditional','eventValue',{n:8,draw:3,event:'odd-count'}).max,3);
  assert.equal(control('conditional','eventValue',{n:8,draw:3,event:'include'}).min,1);
  const sum=control('conditional','eventValue',{n:8,draw:3,condition:'max-eq',conditionValue:5,event:'sum-ge',eventValue:10});
  assert.equal(sum.min,8);assert.equal(sum.max,12);
  const params=merged('conditional',{n:18,draw:3});
  assert.ok(profile('conditional').facts(params,raw('conditional').solve(params)).denominators.some(x=>BigInt(x)===816n));
});

test('invalid restored combinations still yield finite ordered controls within three-digit inputs',()=>{
  for(const [id,params] of [
    ['probability-count',{sides:12,rolls:8,statistic:'product',target:500000000}],
    ['conditional',{n:1,draw:9,condition:'max-eq',conditionValue:18,event:'sum-ge',eventValue:180}],
  ])for(const c of controls(id,params).filter(c=>c.type==='number')){
    assert.ok(Number.isFinite(c.min)&&Number.isFinite(c.max));
    assert.ok(c.min<=c.max,`${id}.${c.key} has an ordered recovery range`);
    assert.ok(Math.abs(c.min)<=999&&Math.abs(c.max)<=999,`${id}.${c.key} range cannot expose a four-digit input`);
  }
});
