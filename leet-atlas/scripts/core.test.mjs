import test from 'node:test';
import assert from 'node:assert/strict';
import {filterQuestions,parseRoute,buildRoute} from '../core.mjs';
const qs=[{id:'2702',year:2027,number:2,title:'학칙과 징계',text:'공동부정행위',tags:['law','rule']},{id:'2701',year:2027,number:1,title:'하루심리제도',text:'인간의 존엄성',tags:['law','argument']},{id:'2737',year:2027,number:37,title:'DNA 메틸화',text:'유전과 환경',tags:['science','argument']}];
test('filters combine tags as intersection and retain year-number order',()=>{assert.deepEqual(filterQuestions(qs,{tags:['law','argument']}).map(q=>q.id),['2701']);assert.deepEqual(filterQuestions(qs).map(q=>q.id),['2701','2702','2737']);});
test('search matches question IDs, body and Korean titles',()=>{assert.deepEqual(filterQuestions(qs,{query:'메틸화'}).map(q=>q.id),['2737']);assert.equal(filterQuestions(qs,{query:'2702'})[0].id,'2702');assert.equal(filterQuestions(qs,{query:'없는단어'}).length,0);});
test('review filters do not mark unseen items reviewed',()=>{const reviews={'2701':{status:'done'},'2702':{bookmark:true,status:'check'}};assert.deepEqual(filterQuestions(qs,{review:'done'},reviews).map(q=>q.id),['2701']);assert.deepEqual(filterQuestions(qs,{review:'bookmarked'},reviews).map(q=>q.id),['2702']);});
test('question deep links and tag routes round trip Unicode',()=>{for(const r of [{view:'question',id:'2701',tags:[]},{view:'list',id:null,tags:['logic-대우','law']}])assert.deepEqual(parseRoute(buildRoute(r)),{bookmark:"all",page:1,mode:"paged",sort:'oldest',...r});assert.equal(parseRoute('#/question/9999').id,'9999');assert.equal(parseRoute('#bad').view,'list');});
