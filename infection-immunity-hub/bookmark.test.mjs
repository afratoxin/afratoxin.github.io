import test from 'node:test';
import assert from 'node:assert/strict';
import {collectBookmarkedQuestions,filterBookmarkQuestions,removeBookmark} from './bookmark-ui.mjs';
import {tabFromHash,toggleBookmark} from './logic.mjs';
const groups=[
 {id:'antibiotics',label:'항생제',key:'abx',questions:[{id:'a',stem:'Amoxicillin 경구',choices:['A','B']},{id:'b',stem:'BBB 통과',choices:['C','D']}]},
 {id:'pathology',label:'병리',key:'path',questions:[{id:'p',stem:'CMV 조직',choices:['CMV','HSV']}]},
 {id:'lectures',label:'강의별',key:'lecture',questions:[{id:'l',stem:'장내세균',choices:['E. coli','Klebsiella']}]},
 {id:'drill',label:'표 암기',key:'drill',questions:[{id:'t',stem:'Neutral red',choices:['MacConkey','KIA']}]}
];
test('bookmark library aggregates valid saved stars from all four independent stores',()=>{
 const saved={abx:'["a","a","retired"]',path:'["p"]',lecture:'["l"]',drill:'["t"]'};
 const items=collectBookmarkedQuestions(groups,key=>saved[key]);
 assert.deepEqual(items.map(x=>x.question.id),['a','p','l','t']);
 assert.deepEqual(items.map(x=>x.group),['antibiotics','pathology','lectures','drill']);
 assert.equal(items[0].key,'abx');assert.equal(items[0].question,groups[0].questions[0]);
 assert.equal(groups[0].questions[0].bookmarkGroup,undefined);
 assert.equal(collectBookmarkedQuestions(groups,()=>'{broken').length,0);
 assert.equal(collectBookmarkedQuestions(groups,()=>null).length,0);
});
test('removing a star preserves other current and retired saved IDs without touching other banks',()=>{
 assert.deepEqual(removeBookmark('["a","b","retired","a"]','a'),['b','retired']);
 assert.deepEqual(removeBookmark('["p"]','a'),['p']);
 assert.deepEqual(removeBookmark('null','a'),[]);
 assert.deepEqual(removeBookmark('{broken','a'),[]);
});
test('bookmark filters search question and choice keywords within the chosen group',()=>{
 const items=collectBookmarkedQuestions(groups,key=>JSON.stringify(groups.find(g=>g.key===key).questions.map(q=>q.id)));
 assert.deepEqual(filterBookmarkQuestions(items,{group:'pathology'}).map(x=>x.question.id),['p']);
 assert.deepEqual(filterBookmarkQuestions(items,{search:' klebsiella '}).map(x=>x.question.id),['l']);
 assert.equal(filterBookmarkQuestions(items,{group:'pathology',search:'Neutral'}).length,0);
 assert.equal(tabFromHash('#bookmarks'),'bookmarks');
 assert.equal(tabFromHash('#mainContent'),null);
});


test('quiz star toggles preserve retired IDs while the active bank filters them from display',()=>{
 const raw='["a","retired","a","p",17,null]';
 const removed=toggleBookmark(raw,'a');assert.deepEqual(removed,['retired','p']);
 const added=toggleBookmark(JSON.stringify(removed),'b');assert.deepEqual(added,['retired','p','b']);
 assert.deepEqual(collectBookmarkedQuestions([groups[0]],()=>JSON.stringify(added)).map(x=>x.question.id),['b']);
 assert.deepEqual(toggleBookmark(JSON.stringify(added),'b'),['retired','p']);
 assert.equal(raw,'["a","retired","a","p",17,null]');
});

test('star toggles recover bad storage and do not alter another bank store',()=>{
 for(const raw of [null,undefined,'null','{}','{broken'])assert.deepEqual(toggleBookmark(raw,'a'),['a']);
 const saved={abx:'["a","retired-a"]',path:'["p","retired-p"]'};
 const pathBefore=saved.path;saved.abx=JSON.stringify(toggleBookmark(saved.abx,'a'));
 assert.deepEqual(JSON.parse(saved.abx),['retired-a']);assert.equal(saved.path,pathBefore);
 assert.deepEqual(toggleBookmark('["retired","retired"]','a'),['retired','a']);
});
