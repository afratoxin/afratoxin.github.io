import test from 'node:test';
import assert from 'node:assert/strict';
import {parseResearchBackup,researchBackup,emptyResearch,relatedQuestions,createResearchStore,RESEARCH_KEY} from '../research-store.mjs';
const ids=new Set(['a','b','c']);
const customBookmark='bm_12345678-1234-4234-8234-123456789abc';
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

test('writer backup roundtrips renamed and custom bookmark categories with their existing review references',()=>{
 const research=emptyResearch(),reviews={a:{bookmarkColors:['red',customBookmark],note:'두 분류 모두 유지',status:'check'}};
 const categories=[{id:'red',label:' 다시 출제할 문항 ',hex:'#AABBCC'},{id:customBookmark,label:'논증 경계',hex:'#123456'}];
 const snapshot=structuredClone({research,reviews,categories});
 const serialized=researchBackup(research,reviews,categories);
 const restored=parseResearchBackup(serialized,ids);
 assert.deepEqual(restored.bookmarkCategories,[{id:'red',label:'다시 출제할 문항',hex:'#aabbcc'},{id:customBookmark,label:'논증 경계',hex:'#123456'}]);
 assert.deepEqual(restored.reviews.a.bookmarkColors,['red',customBookmark]);
 assert.equal(restored.reviews.a.note,'두 분류 모두 유지');
 assert.deepEqual({research,reviews,categories},snapshot,'backup validation does not mutate the caller');
});

test('the original two-argument backup payload and legacy backups omit optional category settings',()=>{
 const research=emptyResearch(),reviews={a:{note:'기존 메모'}};
 const oldPayload=JSON.parse(researchBackup(research,reviews));
 assert.deepEqual(Object.keys(oldPayload),['kind','schemaVersion','exportedAt','research','reviews']);
 assert.deepEqual(oldPayload.research,research);assert.deepEqual(oldPayload.reviews,reviews);
 assert.equal(Object.hasOwn(parseResearchBackup(JSON.stringify(oldPayload),ids),'bookmarkCategories'),false);
 for(const schemaVersion of [1,2]){
  const restored=parseResearchBackup(JSON.stringify({app:'LEET Atlas',schemaVersion,reviews}),ids);
  assert.equal(restored.reviews.a.note,'기존 메모');
  assert.equal(Object.hasOwn(restored,'bookmarkCategories'),false);
 }
});

test('legacy review-only exports accept valid optional category settings',()=>{
 const categories=[{id:customBookmark,label:'직접 만든 분류',hex:'#123456'}];
 for(const schemaVersion of [1,2]){
  const restored=parseResearchBackup(JSON.stringify({app:'LEET Atlas',schemaVersion,reviews:{a:{bookmarkColors:[customBookmark]}},bookmarkCategories:categories}),ids);
  assert.deepEqual(restored.bookmarkCategories,categories);
  assert.deepEqual(restored.reviews.a.bookmarkColors,[customBookmark]);
 }
});

test('invalid bookmark configurations reject the whole backup before a restore candidate is available',()=>{
 const valid={id:'red',label:'정상 분류',hex:'#123456'};
 const overCapacity=Array.from({length:101},(_,i)=>({id:`bm_00000000-0000-4000-8000-${i.toString(16).padStart(12,'0')}`,label:`분류 ${i}`,hex:'#123456'}));
 const invalid=[null,{},[null],[{...valid,id:'invented'}],[{...valid,label:' '}],[{...valid,label:42}],[{...valid,label:'가'.repeat(41)}],[{...valid,hex:'#abc'}],[{...valid,hex:'red'}],[valid,{...valid,label:'다른 이름'}],[valid,{id:customBookmark,label:valid.label,hex:'#abcdef'}],overCapacity];
 const research=emptyResearch(),reviews={a:{note:'기존 저장 자료'}};
 const snapshot=structuredClone({research,reviews});
 for(const bookmarkCategories of invalid){
  for(const identity of [{kind:'leet-writer-backup',schemaVersion:1,research},{app:'LEET Atlas',schemaVersion:1},{app:'LEET Atlas',schemaVersion:2}]){
   let restored;
   assert.throws(()=>{restored=parseResearchBackup(JSON.stringify({...identity,reviews,bookmarkCategories}),ids);});
   assert.equal(restored,undefined,'invalid settings cannot reach the restore step');
  }
 }
 assert.deepEqual({research,reviews},snapshot);
 assert.throws(()=>researchBackup(research,reviews,[{...valid,hex:'url(javascript:alert(1))'}]));
 assert.equal(parseResearchBackup(researchBackup(research,reviews,overCapacity.slice(0,100)),ids).bookmarkCategories.length,100,'the supported 100-category boundary remains usable');
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
