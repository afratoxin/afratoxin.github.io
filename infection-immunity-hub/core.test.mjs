import test from 'node:test';
import assert from 'node:assert/strict';
import {selectQuestions,makeSession,answerQuestion,sessionResult,saveState,loadState,stats,recordResponse,finishSession,mergeProgress,reconcileSession} from './core.mjs';
const qs = [
 {id:'a',lecture:'A',difficulty:'고난도',stem:'보체 검사',tags:['루프스'],choices:['가','나','다','라','마'],answer:2},
 {id:'b',lecture:'A',difficulty:'기본',stem:'활막 소견',tags:['관절'],choices:['가','나','다','라','마'],answer:0},
 {id:'c',lecture:'B',difficulty:'중상',stem:'신장 침범',tags:['루프스'],choices:['가','나','다','라','마'],answer:4},
];
test('filters lectures, difficulty, search, latest wrong and bookmarks',()=>{
 const state={records:{a:{correct:false},b:{correct:true}},bookmarks:['a','c']};
 assert.deepEqual(selectQuestions(qs,state,{lecture:'A',mode:'wrong'}).map(q=>q.id),['a']);
 assert.deepEqual(selectQuestions(qs,state,{mode:'starred',query:'루프스',difficulty:'고난도'}).map(q=>q.id),['a']);
 assert.deepEqual(selectQuestions(qs,state,{mode:'unseen'}).map(q=>q.id),['c']);
 assert.deepEqual(stats(qs,state),{total:3,attempted:2,correct:1,wrong:1,unseen:1,starred:2});
});
test('shuffling preserves answer identity and grades displayed choice positions',()=>{
 const s=makeSession(qs,{shuffle:true,exam:false},()=>0.2);
 const item=s.items.find(x=>x.id==='a');
 const updated=answerQuestion(s,qs,'a',item.order.indexOf(2));
 assert.equal(updated.responses.a.correct,true);
 assert.equal(updated.responses.a.choice,2);
 assert.equal(s.responses.a,undefined);
 assert.deepEqual([...item.order].sort(),[0,1,2,3,4]);
 assert.throws(()=>answerQuestion(s,qs,'a',5));
});
test('exam answers can change and unanswered questions reduce score',()=>{
 let s=makeSession(qs,{exam:true,limit:2,shuffle:false});
 s=answerQuestion(s,qs,'a',0);
 s=answerQuestion(s,qs,'a',2);
 assert.deepEqual(sessionResult(s,qs),{total:2,answered:1,correct:1,wrong:0,unanswered:1,score:50});
});
test('continued study queues unseen before latest wrong answers',()=>{
 const state={records:{a:{correct:false},b:{correct:true}},bookmarks:[]};
 assert.deepEqual(selectQuestions(qs,state,{mode:'continue'}).map(x=>x.id),['c','a']);
});
test('retries replace latest wrong while keeping bookmarks and counting attempts',()=>{
 const initial={records:{a:{correct:false,choice:0,attempts:2}},bookmarks:['a'],session:null};
 const updated=recordResponse(initial,'a',{correct:true,choice:2,at:100});
 assert.deepEqual(selectQuestions(qs,updated,{mode:'wrong'}),[]);
 assert.equal(updated.records.a.attempts,3);
 assert.deepEqual(updated.bookmarks,['a']);
 assert.equal(initial.records.a.correct,false);
});
test('exam submission records answered questions once and leaves unanswered unseen',()=>{
 let session=makeSession(qs,{exam:true,limit:2});
 session=answerQuestion(session,qs,'a',2);
 const state={records:{},bookmarks:['a'],session};
 const finished=finishSession(state);
 assert.equal(finished.records.a.correct,true);
 assert.equal(finished.records.b,undefined);
 assert.equal(finishSession(finished).records.a.attempts,1);
 assert.equal(state.records.a,undefined);
});
test('new storage namespace restores sessions and degrades when storage is unavailable',()=>{
 let data={};const storage={getItem:k=>data[k]??null,setItem:(k,v)=>{data[k]=v}};
 const state={records:{a:{correct:false,choice:0}},bookmarks:['a'],session:makeSession(qs,{exam:true})};
 assert.equal(saveState(storage,state),true);
 assert.deepEqual(loadState(storage),state);
 assert.equal(Object.keys(data)[0],'infection-immune-exam2-20261125-v1');
 const broken={getItem:()=>{throw Error()},setItem:()=>{throw Error()}};
 assert.deepEqual(loadState(broken),{records:{},bookmarks:[],session:null});
 assert.equal(saveState(broken,state),false);
 data[Object.keys(data)[0]]='{bad';
 assert.deepEqual(loadState(storage),{records:{},bookmarks:[],session:null});
});
test('two active tabs retain independent answers and merge the latest shared result',()=>{
 const baseline={records:{},bookmarks:[],session:null};
 const local={records:{b:{correct:true,choice:0,at:20}},bookmarks:[],session:{id:'local'}};
 const remote={records:{a:{correct:false,choice:1,at:10}},bookmarks:['a'],session:{id:'remote'}};
 const merged=mergeProgress(local,remote,baseline);
 assert.deepEqual(Object.keys(merged.records).sort(),['a','b']);
 assert.deepEqual(merged.bookmarks,['a']);
 assert.deepEqual(merged.session,{id:'local'});
 assert.equal(mergeProgress({...local,records:{a:{correct:true,choice:2,at:30}}},remote,baseline).records.a.correct,true);
});
test('a star removed in another tab is not resurrected by unrelated local progress',()=>{
 const baseline={records:{},bookmarks:['a','b'],session:null};
 const local={...baseline,bookmarks:['a','b','c']};
 const remote={...baseline,bookmarks:['b','d']};
 assert.deepEqual(mergeProgress(local,remote,baseline).bookmarks.sort(),['b','c','d']);
 assert.deepEqual(mergeProgress({...local,bookmarks:['b','c']},baseline,baseline).bookmarks.sort(),['b','c']);
});
test('retired questions invalidate the old session instead of silently shortening an exam',()=>{
 const session=makeSession(qs,{exam:true});
 assert.equal(reconcileSession(session,qs.filter(q=>q.id!=='b')),null);
 assert.equal(reconcileSession(null,qs),null);
});
test('unchanged questions retain saved answers while stale response keys are removed',()=>{
 let session=answerQuestion(makeSession(qs,{shuffle:false}),qs,'a',2);
 session.responses.retired={choice:0,correct:true};session.index=99;
 const result=reconcileSession(session,qs);
 assert.equal(result.responses.a.correct,true);
 assert.equal(result.responses.retired,undefined);
 assert.equal(result.index,2);
 assert.equal(session.responses.retired.correct,true);
});
