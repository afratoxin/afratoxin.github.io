import test from 'node:test';
import assert from 'node:assert/strict';
import * as keyboard from './quiz-keyboard.mjs';
const event=(key,code='',target=null,extra={})=>({key,code,target,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;},...extra});
test('physical digits and NumLock-off keypad work without moving focus',()=>{
 for(let n=1;n<=5;n++)for(const raw of [event(String(n),'Digit'+n),event(['','End','ArrowDown','PageDown','ArrowLeft','Clear'][n],'Numpad'+n),event('Process','',null,{keyCode:48+n,isComposing:true}),event('Unidentified','',null,{which:96+n})])assert.deepEqual(keyboard.quizKeyboardAction(raw),{type:'answer',index:n-1});
 const checkbox={tagName:'INPUT',type:'checkbox',closest:s=>s.includes('input')?checkbox:null,getClientRects:()=>[{}]};
 assert.deepEqual(keyboard.quizKeyboardAction(event('1','Digit1',checkbox)),{type:'answer',index:0});
 const nav={closest:s=>s.includes('nav')?{}:null};
 assert.deepEqual(keyboard.quizKeyboardAction(event('2','Digit2',nav)),{type:'answer',index:1});
 assert.deepEqual(keyboard.quizKeyboardAction(event('3','Digit3',null,{defaultPrevented:true})),{type:'answer',index:2});
});
function environment(id){
 const listeners=[],html={dataset:{}},answers=[],next=[];
 const choices=Array.from({length:id==='drill-question'?2:5},(_,i)=>({disabled:false,click(){answers.push(i);choices.forEach(c=>c.disabled=true);}}));
 const card={id,closest:()=>null,getClientRects:()=>[{}],querySelectorAll:()=>choices,querySelector:()=>({disabled:false,click(){next.push(true);}})};
 const doc={documentElement:html,querySelectorAll:()=>[card],querySelector:()=>null};
 const win={document:doc,getComputedStyle:()=>({display:'block',visibility:'visible'}),addEventListener(type,fn,capture){listeners.push({type,fn,capture});},removeEventListener(){}};
 return {win,doc,listeners,html,answers,next,choices};
}
test('one capture handler drives visible buttons in every quiz engine',()=>{
 assert.equal(typeof keyboard.installQuizKeyboard,'function');
 for(const id of ['questionCard','pathQuestion','lectures-question','drill-question','cblpast-question']){
  const env=environment(id);keyboard.installQuizKeyboard({window:env.win,document:env.doc});
  assert.equal(env.listeners.length,1);assert.equal(env.listeners[0].type,'keydown');assert.equal(env.listeners[0].capture,true);
  const raw=event('End','Numpad1');env.listeners[0].fn(raw);
  assert.deepEqual(env.answers,[0],id);assert.ok(raw.prevented&&raw.stopped,id);
  env.listeners[0].fn(event('Enter','Enter'));assert.equal(env.next.length,1,id);
 }
});
test('hidden questions, real editors and open image dialogs remain protected',()=>{
 assert.equal(typeof keyboard.installQuizKeyboard,'function');
 for(const condition of ['hidden','editor','dialog']){
  const env=environment('questionCard');
  if(condition==='hidden')env.doc.querySelectorAll=()=>[];
  if(condition==='dialog')env.doc.querySelector=()=>({});
  keyboard.installQuizKeyboard({window:env.win,document:env.doc});
  const editor={tagName:'INPUT',type:'search',getClientRects:()=>[{}],closest:s=>s.includes('input')?editor:null};
  env.listeners[0].fn(event('1','Digit1',condition==='editor'?editor:null));assert.deepEqual(env.answers,[],condition);
 }
});

test('an invisible legacy replacement prompt cannot block a visible unanswered question',()=>{
 const env=environment('questionCard');
 env.doc.querySelector=selector=>/replace|aria-modal/.test(selector)?{hidden:false}:null;
 keyboard.installQuizKeyboard({window:env.win,document:env.doc});
 env.listeners[0].fn(event('1','Digit1'));
 assert.deepEqual(env.answers,[0]);assert.equal(JSON.parse(env.html.dataset.quizKeyboardLast).status,'handled');
});
