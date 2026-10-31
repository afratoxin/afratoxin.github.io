import test from 'node:test';import assert from 'node:assert/strict';
import {parseRoute,buildRoute,filterQuestions} from '../core.mjs';
test('shared search route preserves text, exclusion, mode and within-axis OR',()=>{
 const original={view:'list',query:'법률 계산 제외',searchMode:'recommend',tags:['law','science'],excludedTags:['visual'],tagMode:'or',sort:'newest'};
 const route=parseRoute(buildRoute(original));
 assert.equal(route.query,original.query);assert.equal(route.tagMode,'or');assert.deepEqual(route.excludedTags,['visual']);
 assert.equal(parseRoute(buildRoute({view:'workspace'})).view,'workspace');
});
test('within-axis alternatives and excluded tags are actual eligibility constraints',()=>{
 const qs=[{id:'a',tags:['law'],year:2025,number:1},{id:'b',tags:['science','visual'],year:2025,number:2},{id:'c',tags:['science'],year:2025,number:3}];
 const taxonomy=[{id:'law',axis:'domain'},{id:'science',axis:'domain'},{id:'visual',axis:'logic'}];
 assert.deepEqual(filterQuestions(qs,{tags:['law','science'],tagMode:'or',excludedTags:['visual'],taxonomy}).map(q=>q.id),['a','c']);
});
