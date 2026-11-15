export function quizKey(event){
 const raw=String(event.key||'');
 if(event.shiftKey&&!/^[1-5]$/.test(raw))return null;
 const physical=/^(?:Digit|Numpad)([1-5])$/.exec(event.code||'');
 if(physical)return physical[1];
 if(/^(?:Numpad)?Enter$/.test(event.code||''))return 'Enter';
 const legacy=Number(event.keyCode||event.which||0);
 if(legacy>=49&&legacy<=53)return String(legacy-48);
 if(legacy>=97&&legacy<=101)return String(legacy-96);
 if(legacy===13)return 'Enter';
 if(/^[1-5]$/.test(raw))return raw;
 if(event.isComposing)return null;
 return /^(?:Enter|[oOxX])$/.test(raw)?raw:null;
}

function editing(target){
 const node=target?.closest?.('input,select,textarea,[contenteditable]:not([contenteditable="false"])');
 if(!node)return false;
 if(node.closest?.('details:not([open])')&&!node.closest?.('summary'))return false;
 if(typeof node.getClientRects==='function'&&!node.getClientRects().length)return false;
 if(node.tagName==='INPUT'&&/^(?:checkbox|radio|button|submit|reset)$/i.test(node.type))return false;
 return true;
}

export function quizKeyboardAction(event,{active=true,answered=false,choiceCount=5,blocked=false}={}){
 if(!active||blocked||event.ctrlKey||event.altKey||event.metaKey||event.repeat||editing(event.target)||event.target?.closest?.('dialog[open]'))return null;
 const key=quizKey(event);
 if(answered){
  if(event.target?.closest?.('nav,a,[role="link"],[role="tablist"],dialog[open]'))return null;
  const control=event.target?.closest?.('button,a,summary,[role="button"],[role="link"]');
  const quizControl=event.target?.closest?.('[data-answer],[data-path-answer],[data-study-answer],[data-bookmark],[data-path-bookmark],[data-study-bookmark],[data-photo-id],[data-evidence-open],[data-original-open],[data-action="next"],[data-path-action="next"],[data-study-next],.choice-explanations summary');
  if(control&&!quizControl)return null;
  return key==='Enter'?{type:'next'}:null;
 }
 let index=/^[1-5]$/.test(key||'')?Number(key)-1:null;
 if(choiceCount===2){if(/^[oO]$/.test(key||''))index=0;else if(/^[xX]$/.test(key||''))index=1;}
 return index!==null&&index<choiceCount?{type:'answer',index}:null;
}

const installations=new WeakMap();
// A single handler uses the same visible buttons as a mouse click in every quiz.
export function installQuizKeyboard({window:win=globalThis.window,document:doc=win.document}={}){
 if(installations.has(win))return installations.get(win);
 const visible=node=>Boolean(node&&!node.closest?.('[hidden],[inert]')&&node.getClientRects?.().length&&win.getComputedStyle(node).visibility!=='hidden');
 const trace=(event,status,card,action)=>{if(doc.documentElement?.dataset)doc.documentElement.dataset.quizKeyboardLast=JSON.stringify({at:Date.now(),key:event.key,code:event.code,keyCode:event.keyCode||event.which||0,target:event.target?.tagName||'',targetId:event.target?.id||'',status,question:card?.id||'',action:action?.type||''});};
 const listener=event=>{
  if(!quizKey(event))return;
  const card=[...doc.querySelectorAll('#questionCard,#pathQuestion,#lectures-question,#drill-question,#cblpast-question')].find(visible);
  if(!card){trace(event,'no-question');return;}
  const choices=[...card.querySelectorAll('[data-answer],[data-path-answer],[data-study-answer]')];
  const blocked=Boolean(doc.querySelector('dialog[open]'));
  const action=quizKeyboardAction(event,{answered:choices.length>0&&choices.every(button=>button.disabled),choiceCount:choices.length,blocked});
  if(!action){trace(event,blocked?'dialog':editing(event.target)?'editing':'ignored',card);return;}
  if(action.type==='next'&&typeof card.contains==='function'&&event.target?.closest?.('button,a,summary')&&!card.contains(event.target)&&!event.target.closest('.practice-support'))return;
  const button=action.type==='answer'?choices[action.index]:card.querySelector('[data-action="next"],[data-path-action="next"],[data-study-next]');
  if(!button||button.disabled)return;
  event.preventDefault();event.stopImmediatePropagation?.();trace(event,'handled',card,action);button.click();
 };
 win.addEventListener('keydown',listener,true);
 if(doc.documentElement?.dataset)doc.documentElement.dataset.quizKeyboardReady='true';
 const remove=()=>{win.removeEventListener('keydown',listener,true);installations.delete(win);};
 installations.set(win,remove);return remove;
}
