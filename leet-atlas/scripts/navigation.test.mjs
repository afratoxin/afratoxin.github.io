import test from 'node:test';
import assert from 'node:assert/strict';
import {BOOKMARK_COLORS,bookmarkColors,normalizeReviews,toggleBookmarkColor,filterQuestions,paginateQuestions,parseRoute,buildRoute} from '../core.mjs';
const qs=Array.from({length:40},(_,i)=>({id:String(2701+i),year:2027,number:i+1,title:'문항 '+(i+1),text:'원문',fields:i<20?['생물']:['물리'],tags:i<20?['biology']:['physics']}));
test('legacy bookmarks migrate to red without losing notes or review state',()=>{
 const r=normalizeReviews({'2701':{bookmark:true,note:'다시 보기',status:'check'},'2702':{bookmark:false,note:'유지'}});
 assert.deepEqual(bookmarkColors(r['2701']),['red']);assert.equal(r['2701'].note,'다시 보기');assert.equal(r['2701'].status,'check');assert.deepEqual(bookmarkColors(r['2702']),[]);
});
test('seven colors support multiple selections and removing the last color',()=>{
 assert.deepEqual(BOOKMARK_COLORS.map(c=>c.id),['red','orange','yellow','green','blue','indigo','violet']);
 let r={bookmark:true,note:'메모'};r=toggleBookmarkColor(r,'blue');assert.deepEqual(bookmarkColors(r),['red','blue']);r=toggleBookmarkColor(r,'red');assert.deepEqual(bookmarkColors(r),['blue']);r=toggleBookmarkColor(r,'blue');assert.equal(r.bookmark,false);assert.deepEqual(bookmarkColors(r),[]);assert.equal(r.note,'메모');
});
test('bookmark-only and color filters combine with tags and review status',()=>{
 const reviews={'2701':{bookmark:true},'2702':{bookmarkColors:['blue'],status:'check'},'2722':{bookmarkColors:['red','blue']}};
 assert.deepEqual(filterQuestions(qs,{bookmark:'any'},reviews).map(q=>q.id),['2701','2702','2722']);
 assert.deepEqual(filterQuestions(qs,{bookmark:'blue',tags:['biology'],review:'check'},reviews).map(q=>q.id),['2702']);
 assert.deepEqual(filterQuestions(qs,{bookmark:'yellow'},reviews),[]);
 assert.equal(filterQuestions(qs,{query:'생물'}).length,20);
});
test('pagination serves exactly ten, clamps after filtering, and supports all-items scrolling',()=>{
 const p=paginateQuestions(qs,{page:4});assert.equal(p.items.length,10);assert.equal(p.items[0].id,'2731');assert.equal(p.pageCount,4);assert.equal(p.from,31);assert.equal(p.to,40);
 const short=paginateQuestions(qs.slice(0,2),{page:4});assert.equal(short.page,1);assert.equal(short.items.length,2);
 const empty=paginateQuestions([],{page:100});assert.equal(empty.page,1);assert.equal(empty.from,0);assert.equal(empty.to,0);
 const all=paginateQuestions(qs,{mode:'scroll',page:4});assert.equal(all.items.length,40);assert.equal(all.page,1);
});
test('bookmark, tag-directory and tag-bundle URLs round trip',()=>{
 for(const route of [{view:'bookmarks',id:null,tags:['biology'],bookmark:'blue',page:2,mode:'paged'},{view:'tags',id:null,tags:[],bookmark:'all',page:1,mode:'paged'},{view:'tag',id:'field-biology',tags:[],bookmark:'all',page:1,mode:'scroll'}])assert.deepEqual(parseRoute(buildRoute(route)),route);
 assert.equal(parseRoute('#/bookmarks').bookmark,'any');assert.equal(parseRoute('#/tags').view,'tags');assert.equal(parseRoute('#/question/2708').id,'2708');
});
