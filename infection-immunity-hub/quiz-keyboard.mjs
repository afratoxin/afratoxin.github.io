/** Translate a quiz shortcut without consuming native control behavior. */
export function quizKeyboardAction(event,{active=true,answered=false,choiceCount=5,blocked=false}={}){
 if(!active||blocked||event.defaultPrevented||event.ctrlKey||event.altKey||event.metaKey||event.repeat||event.isComposing)return null;
 const closest=selector=>event.target?.closest?.(selector);
 if(closest('input,select,textarea,[contenteditable]:not([contenteditable="false"]),nav,[role="tablist"],dialog[open]'))return null;
 if(answered)return event.key==='Enter'&&!closest('button,a,summary,[role="button"],[role="link"]')?{type:'next'}:null;
 let index=/^[1-5]$/.test(event.key)?Number(event.key)-1:null;
 if(choiceCount===2){if(/^[oO]$/.test(event.key))index=0;else if(/^[xX]$/.test(event.key))index=1;}
 return index!==null&&index<choiceCount?{type:'answer',index}:null;
}
