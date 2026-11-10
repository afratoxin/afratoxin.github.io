import test from 'node:test';
import assert from 'node:assert/strict';
import {bookmarkColors,normalizeReviews,toggleBookmarkColor,filterQuestions,parseRoute,buildRoute,BOOKMARK_COLORS} from '../core.mjs';
const model=await import('../bookmark-categories.mjs').catch(()=>({}));
const api=()=>{assert.equal(typeof model.defaultBookmarkCategories,'function');return model;};
const custom='bm_52903941-078c-40cd-b7da-23afc7b2b97c';
const category=(id=custom,label='나의 분류',hex='#abcdef')=>({id,label,hex});
const storage=()=>{const values=new Map();return {values,getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};};

test('custom UUID categories survive review normalization, toggles, filtering and URL round trips',()=>{
 const review={bookmarkColors:['blue',custom,'not-valid',custom],note:'유지',status:'check'};
 assert.deepEqual(bookmarkColors(review),['blue',custom]);
 assert.deepEqual(bookmarkColors(normalizeReviews({a:review}).a),['blue',custom]);
 assert.deepEqual(bookmarkColors(toggleBookmarkColor(review,'red')),['red','blue',custom]);
 assert.deepEqual(bookmarkColors(toggleBookmarkColor(review,custom)),['blue']);
 assert.equal(toggleBookmarkColor(review,'garbage').note,'유지');
 assert.deepEqual(filterQuestions([{id:'a',year:2027,number:1,tags:[]},{id:'b',year:2027,number:2,tags:[]}],{bookmark:custom},{a:review}).map(q=>q.id),['a']);
 assert.equal(parseRoute(buildRoute({view:'bookmarks',bookmark:custom})).bookmark,custom);
 assert.equal(BOOKMARK_COLORS.length,7);
});
test('new users get exactly three named defaults; only used missing IDs are recovered',()=>{
 const m=api(),defaults=m.defaultBookmarkCategories();
 assert.deepEqual(defaults.map(v=>[v.id,v.label]),[['red','북마크 1'],['green','북마크 2'],['blue','북마크 3']]);
 assert.deepEqual(m.resolveBookmarkCategories(undefined,{}),defaults);
 const resolved=m.resolveBookmarkCategories(undefined,{a:{bookmarkColors:['orange',custom]},b:{bookmark:true}});
 assert.deepEqual(resolved.map(v=>v.id),['red','green','blue','orange',custom]);
 assert.equal(resolved.find(v=>v.id==='orange').hex,BOOKMARK_COLORS.find(v=>v.id==='orange').hex);
 assert.doesNotThrow(()=>m.validateBookmarkCategories(resolved));
 assert.deepEqual(m.resolveBookmarkCategories([category()],{}),[category()]);
});
test('validation normalizes names and hex and rejects invalid or duplicate identity before mutation',()=>{
 const m=api();assert.deepEqual(m.validateBookmarkCategories([category(custom,'  이름  ','#ABCDEF')]),[category(custom,'이름','#abcdef')]);
 for(const data of [null,[category('bm_bad')],[category(custom,'')],[category(custom,'가'.repeat(41))],[category(custom,'x','red')],[category(),category()],[category(custom,'Name'),category('red',' name ')],Array.from({length:101},()=>category())])assert.throws(()=>m.validateBookmarkCategories(data));
});
test('rename and add persist stable IDs and do not alter review records',()=>{
 const m=api(),s=storage(),reviews={a:{bookmark:true,note:'원문'}};const before=JSON.stringify(reviews),store=m.createBookmarkCategoryStore(s,reviews);
 store.rename('red','검토할 문항');assert.equal(store.state[0].label,'검토할 문항');
 const added=store.add('새 분류');assert.match(added.id,/^bm_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);assert.match(added.hex,/^#[0-9a-f]{6}$/);
 assert.equal(m.createBookmarkCategoryStore(s,reviews).state.find(v=>v.id===added.id).label,'새 분류');
 assert.equal(JSON.stringify(reviews),before);
 const prior=store.state;assert.throws(()=>store.rename('red',' 새 분류 '));assert.deepEqual(store.state,prior);
});
test('sync before each mutation preserves another tabs additions and incoming merge wins by stable ID',()=>{
 const m=api(),s=storage(),a=m.createBookmarkCategoryStore(s,{}),b=m.createBookmarkCategoryStore(s,{});
 const first=a.add('첫 탭');b.rename('red','둘째 탭 이름');
 assert.ok(b.state.some(v=>v.id===first.id));a.add('둘째 추가');
 assert.equal(a.state.find(v=>v.id==='red').label,'둘째 탭 이름');
 a.merge([category(first.id,'가져온 이름')],{q:{bookmarkColors:['violet']}});
 assert.equal(a.state.find(v=>v.id===first.id).label,'가져온 이름');assert.ok(a.state.some(v=>v.id==='violet'));
 b.sync({});assert.equal(b.state.find(v=>v.id===first.id).label,'가져온 이름');
});
test('malformed storage is preserved and writes blocked while memory changes remain available',()=>{
 const m=api(),s=storage();s.values.set(m.BOOKMARK_CATEGORIES_KEY,'{broken');const store=m.createBookmarkCategoryStore(s,{});
 assert.ok(store.error);store.rename('red','현재 화면 이름');assert.equal(store.state[0].label,'현재 화면 이름');assert.equal(s.values.get(m.BOOKMARK_CATEGORIES_KEY),'{broken');
 const copy=store.state;copy[0].label='외부 변조';assert.equal(store.state[0].label,'현재 화면 이름');
});
test('write failures retain valid in-memory changes and later operations do not reset them',()=>{
 const m=api(),s=storage(),store=m.createBookmarkCategoryStore(s,{});s.setItem=()=>{throw new Error('quota');};
 const added=store.add('화면에 보관');assert.ok(store.error);assert.ok(store.state.some(v=>v.id===added.id));
 store.rename('red','남은 이름');assert.ok(store.state.some(v=>v.id===added.id));assert.equal(store.state[0].label,'남은 이름');
});
