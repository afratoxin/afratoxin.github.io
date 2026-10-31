import test from 'node:test';
import assert from 'node:assert/strict';
import {parseResearchBackup,relatedQuestions,createResearchStore,RESEARCH_KEY} from '../research-store.mjs';
const ids=new Set(['a','b','c']);
test('research backup restores named sets, saved search exclusions and existing review records',()=>{
 const input={kind:'leet-writer-backup',schemaVersion:1,research:{schemaVersion:1,sets:[{id:'s',name:'법률 계산 제외',ids:['a','b'],notes:'대조'}],compareIds:['b'],savedSearches:[{id:'f',name:'재사용',query:'법률 계산 제외',mode:'recommend',tags:[],excludedTags:['t']}],issues:[]},reviews:{a:{status:'check',note:'경계 확인',colors:['red']}}};
 const result=parseResearchBackup(JSON.stringify(input),ids);
 assert.equal(result.research.sets[0].name,'법률 계산 제외');
 assert.deepEqual(result.research.savedSearches[0].excludedTags,['t']);
 assert.equal(result.reviews.a.note,'경계 확인');
});
test('invalid or unknown references reject the entire import before any saved data changes',()=>{
 assert.throws(()=>parseResearchBackup(JSON.stringify({kind:'leet-writer-backup',schemaVersion:1,research:{sets:[{id:'s',name:'x',ids:['missing']}]},reviews:{}}),ids),/문항/);
 assert.throws(()=>parseResearchBackup('{bad',ids),/JSON/);
});
test('legacy review export is accepted as a review-only backup',()=>{
 assert.equal(parseResearchBackup(JSON.stringify({app:'LEET Atlas',schemaVersion:2,reviews:{a:{note:'기존'}}}),ids).reviews.a.note,'기존');
});
test('imported manual design reviews reject nonnumeric or out-of-range attributes',()=>{
 const file=value=>JSON.stringify({kind:'leet-writer-backup',schemaVersion:1,research:{},reviews:{a:{designReview:value}}});
 for(const value of [{expectedMinutes:'" autofocus onfocus="alert(1)'},{rules:6},{visual:-1},{inference:'3'},{expectedMinutes:0}])assert.throws(()=>parseResearchBackup(file(value),ids),/평가/);
 const designReview={rules:3,inference:null,distractors:4,visual:1,expectedMinutes:8.5,reason:'경계 사례',updatedAt:'2026-10-31'};
 assert.deepEqual(parseResearchBackup(file(designReview),ids).reviews.a.designReview,{...designReview,basis:'writer-review'});
});
test('related examples distinguish shared reasoning with different materials from shared material with different tasks',()=>{
 const q={id:'a',logic:['반례 구성'],fields:['법률'],types:['논증 평가']};
 const other=[q,{id:'b',logic:['반례 구성'],fields:['생물'],types:['논증 평가']},{id:'c',logic:['규칙 적용'],fields:['법률'],types:['규칙·사례 적용']}];
 assert.equal(relatedQuestions(q,other,'logic')[0].question.id,'b');
 assert.equal(relatedQuestions(q,other,'material')[0].question.id,'c');
});
test('corrupt stored research stays recoverable while new work remains usable in memory',()=>{
 const raw='{broken previous work';let writes=0;
 const storage={getItem:()=>raw,setItem:()=>writes++};
 const store=createResearchStore(storage,ids);
 store.update(value=>value.sets.push({id:'new',name:'현재 작업',ids:['a']}));
 assert.equal(store.state.sets[0].name,'현재 작업');assert.equal(writes,0);assert.match(store.error,/덮어쓰기.*중단/);
});
test('a stale tab refreshes latest saved sets before adding comparison selections',()=>{
 const memory=new Map();const storage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,value)};
 const first=createResearchStore(storage,ids),second=createResearchStore(storage,ids);
 first.update(value=>value.sets.push({id:'s',name:'다른 탭 자료',ids:['a']}));
 second.update(value=>value.compareIds=['b']);
 const reopened=createResearchStore(storage,ids);
 assert.equal(reopened.state.sets[0]?.name,'다른 탭 자료');assert.deepEqual(reopened.state.compareIds,['b']);
});
