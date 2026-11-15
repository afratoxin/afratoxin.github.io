import test from 'node:test';
import assert from 'node:assert/strict';
import {quizKeyboardAction} from './quiz-keyboard.mjs';
const event=(key,extra={})=>({key,target:{closest:()=>null},...extra});
const focused=tag=>({closest:selector=>selector.split(',').some(s=>s.trim()===tag)?{}:null});

test('number keys select only a displayed choice for MCQ and OX',()=>{
 for(let n=1;n<=5;n++)assert.deepEqual(quizKeyboardAction(event(String(n)),{choiceCount:5}),{type:'answer',index:n-1});
 for(let n=1;n<=2;n++)assert.deepEqual(quizKeyboardAction(event(String(n)),{choiceCount:2}),{type:'answer',index:n-1});
 for(const key of ['0','3','4','5','6','Enter'])assert.equal(quizKeyboardAction(event(key),{choiceCount:2}),null,key);
 assert.deepEqual(quizKeyboardAction(event('O'),{choiceCount:2}),{type:'answer',index:0});
 assert.deepEqual(quizKeyboardAction(event('x'),{choiceCount:2}),{type:'answer',index:1});
 assert.equal(quizKeyboardAction(event('O'),{choiceCount:5}),null);
});

test('Enter advances a graded question once and cannot skip an unanswered one',()=>{
 assert.deepEqual(quizKeyboardAction(event('Enter'),{answered:true}),{type:'next'});
 assert.equal(quizKeyboardAction(event('Enter'),{answered:false}),null);
 assert.equal(quizKeyboardAction(event('1'),{answered:true}),null);
 assert.equal(quizKeyboardAction(event('Enter',{repeat:true}),{answered:true}),null);
});

test('shortcuts leave editing, dialogs, confirmation and other controls usable',()=>{
 for(const extra of [{defaultPrevented:true},{ctrlKey:true},{altKey:true},{metaKey:true},{repeat:true},{isComposing:true}])assert.equal(quizKeyboardAction(event('1',extra)),null);
 assert.equal(quizKeyboardAction(event('1'),{active:false}),null);
 assert.equal(quizKeyboardAction(event('Enter'),{answered:true,blocked:true}),null);
 for(const tag of ['input','select','textarea','nav','[role="tablist"]','dialog[open]','[contenteditable]:not([contenteditable="false"])']){
  assert.equal(quizKeyboardAction(event('1',{target:focused(tag)})),null,tag);
  assert.equal(quizKeyboardAction(event('Enter',{target:focused(tag)}),{answered:true}),null,tag);
 }
 for(const tag of ['button','a','summary','[role="button"]','[role="link"]'])assert.equal(quizKeyboardAction(event('Enter',{target:focused(tag)}),{answered:true}),null,tag);
 assert.deepEqual(quizKeyboardAction(event('1',{target:focused('button')})),{type:'answer',index:0});
});
