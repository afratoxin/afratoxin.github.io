import test from 'node:test';
import assert from 'node:assert/strict';
import {factQuestion,nextRound} from './study-core.mjs';
import {buildSession,grade,restoreSession,stats,tabFromHash} from './logic.mjs';

const fact={id:'fact-example',category:'cocci',prompt:'α용혈·optochin 감수성·담즙 용해',answer:'S. pneumoniae',pool:['S. mitis','S. pneumoniae','S. pyogenes','S. agalactiae','E. faecalis','S. mutans'],explanation:'Optochin 감수성과 담즙 용해가 감별 단서.',sourceRefs:[{doc:'261105_01',pages:[26,27]}]};
test('table facts become stable five-option questions including the correct answer',()=>{
 const a=factQuestion(fact),b=factQuestion(fact);
 assert.equal(a.choices.length,5);assert.equal(new Set(a.choices).size,5);
 assert.equal(a.choices[a.answer],fact.answer);assert.deepEqual(a,b);
 assert.equal(a.topic,'table-cocci');
});
test('a shuffled table answer and progress survive reload without adding unique items',()=>{
 const q=factQuestion(fact),bank=[q],s=buildSession(bank,{}, {},()=>0.3);
 const p=grade(s,{},0,s.items[0].answer,bank).progress;
 assert.equal(stats(bank,p).correct,1);assert.ok(restoreSession(JSON.stringify(s),bank));
 assert.equal(stats(bank,grade(buildSession(bank),p,0,0,bank).progress).total,1);
});
test('new rounds avoid immediate repetition and terminate an empty wrong-only pool',()=>{
 const bank=['a','b','c'].map(id=>({...factQuestion(fact),id}));
 const s=nextRound(bank,{count:0}, {},()=>0.5,[],'a');
 assert.notEqual(s.items[0].id,'a');assert.equal(new Set(s.items.map(x=>x.id)).size,3);
 assert.equal(nextRound(bank,{mode:'wrong'},{},Math.random,[]).items.length,0);
});
test('new routes preserve existing routes and skip anchor semantics',()=>{
 for(const tab of ['lectures','drill','home','quiz','pathology','review','notes'])assert.equal(tabFromHash('#'+tab),tab);
 assert.equal(tabFromHash('#mainContent'),null);
});
