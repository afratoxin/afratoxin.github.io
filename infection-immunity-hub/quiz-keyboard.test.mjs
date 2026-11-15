import test from 'node:test';
import assert from 'node:assert/strict';
import {quizKeyboardAction} from './quiz-keyboard.mjs';
const event=(key,extra={})=>({key,target:{closest:()=>null},...extra});
const focused=(...selectors)=>({closest:selector=>selector.split(',').some(s=>selectors.includes(s.trim()))?{}:null});

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
 for(const extra of [{ctrlKey:true},{altKey:true},{metaKey:true},{repeat:true}])assert.equal(quizKeyboardAction(event('1',extra)),null);
 assert.equal(quizKeyboardAction(event('1'),{active:false}),null);
 assert.equal(quizKeyboardAction(event('Enter'),{answered:true,blocked:true}),null);
 for(const tag of ['input','select','textarea','dialog[open]','[contenteditable]:not([contenteditable="false"])']){
  assert.equal(quizKeyboardAction(event('1',{target:focused(tag)})),null,tag);
  assert.equal(quizKeyboardAction(event('Enter',{target:focused(tag)}),{answered:true}),null,tag);
 }
 for(const tag of ['button','a','summary','[role="button"]','[role="link"]'])assert.equal(quizKeyboardAction(event('Enter',{target:focused(tag)}),{answered:true}),null,tag);
 assert.deepEqual(quizKeyboardAction(event('1',{target:focused('button')})),{type:'answer',index:0});
});

test('physical digits and keypad digits survive Process or unidentified IME key values outside editing',()=>{
 for(const prefix of ['Digit','Numpad'])for(let n=1;n<=5;n++){
  assert.deepEqual(quizKeyboardAction(event(String(n),{code:prefix+n})),{type:'answer',index:n-1});
  assert.deepEqual(quizKeyboardAction(event('Process',{code:prefix+n,isComposing:true,keyCode:229})),{type:'answer',index:n-1});
  assert.deepEqual(quizKeyboardAction(event('Unidentified',{code:prefix+n})),{type:'answer',index:n-1});
 }
 for(const prefix of ['Digit','Numpad'])for(let n=1;n<=2;n++)assert.deepEqual(quizKeyboardAction(event('Process',{code:prefix+n,isComposing:true}),{choiceCount:2}),{type:'answer',index:n-1});
 for(const code of ['Digit3','Numpad3','Digit6','Numpad6'])assert.equal(quizKeyboardAction(event('Process',{code,isComposing:true}),{choiceCount:2}),null);
 for(const code of ['Digit1','Numpad2'])assert.equal(quizKeyboardAction(event('Process',{code,isComposing:true,shiftKey:true})),null);
 for(const extra of [{ctrlKey:true},{altKey:true},{metaKey:true},{repeat:true}])assert.equal(quizKeyboardAction(event('Process',{code:'Digit1',isComposing:true,...extra})),null);
 for(const tag of ['input','select','textarea','[contenteditable]:not([contenteditable="false"])']){
  assert.equal(quizKeyboardAction(event('Process',{code:'Digit1',isComposing:true,target:focused(tag)})),null,tag);
 }
 assert.equal(quizKeyboardAction(event('Process',{code:'KeyR',isComposing:true})),null);
});

test('graded Enter works from quiz choice, star, photo and next controls without consuming other buttons',()=>{
 for(const selector of ['[data-answer]','[data-path-answer]','[data-study-answer]','[data-bookmark]','[data-path-bookmark]','[data-study-bookmark]','[data-photo-id]','[data-evidence-open]','[data-action="next"]','[data-path-action="next"]','[data-study-next]','.choice-explanations summary']){
  const target=focused(selector.endsWith('summary')?'summary':'button',selector);
  assert.deepEqual(quizKeyboardAction(event('Enter',{target}),{answered:true}),{type:'next'},selector);
  assert.equal(quizKeyboardAction(event('Enter',{target}),{answered:false}),null,selector);
  assert.equal(quizKeyboardAction(event('Enter',{target,repeat:true}),{answered:true}),null,selector);
 }
 for(const selector of ['[data-action="previous"]','[data-action="menu"]','[data-study-previous]','[data-path-action="previous"]'])assert.equal(quizKeyboardAction(event('Enter',{target:focused('button',selector)}),{answered:true}),null,selector);
 assert.equal(quizKeyboardAction(event('Enter',{target:focused('button','[data-study-next]','nav')}),{answered:true}),null);
});

test('physical Enter survives IME Process outside editors and modal dialogs remain protected',()=>{
 for(const code of ['Enter','NumpadEnter']){
  assert.deepEqual(quizKeyboardAction(event('Process',{code,isComposing:true}),{answered:true}),{type:'next'});
  assert.equal(quizKeyboardAction(event('Process',{code,isComposing:true}),{answered:false}),null);
  assert.equal(quizKeyboardAction(event('Process',{code,isComposing:true}),{answered:true,blocked:true}),null);
  for(const tag of ['input','select','textarea','dialog[open]'])assert.equal(quizKeyboardAction(event('Process',{code,isComposing:true,target:focused(tag)}),{answered:true}),null,tag);
 }
 assert.equal(quizKeyboardAction(event('Enter',{isComposing:true}),{answered:true}),null);
});
