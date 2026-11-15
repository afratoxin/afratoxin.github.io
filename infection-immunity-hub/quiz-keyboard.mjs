/** Translate a quiz shortcut without consuming native control behavior. */
export function quizKeyboardAction(event,{active=true,answered=false,choiceCount=5,blocked=false}={}){
 if(!active||blocked||event.defaultPrevented||event.ctrlKey||event.altKey||event.metaKey||event.repeat)return null;
 const closest=selector=>event.target?.closest?.(selector);
 if(closest('input,select,textarea,[contenteditable]:not([contenteditable="false"]),nav,[role="tablist"],dialog[open]'))return null;
 let key=event.key;
 // Some IMEs expose physical quiz keys as Process while no text editor is active.
 // Never reinterpret composition in an input, or a shifted punctuation key.
 if(event.isComposing||key==='Process'||key==='Unidentified'||!key){
  if(event.shiftKey)return null;
  const digit=/^(?:Digit|Numpad)([1-5])$/.exec(event.code||'');
  if(digit)key=digit[1];else if(/^(?:Numpad)?Enter$/.test(event.code||''))key='Enter';else return null;
 }
 if(answered){
  const control=closest('button,a,summary,[role="button"],[role="link"]');
  const quizControl=closest('[data-answer],[data-path-answer],[data-study-answer],[data-bookmark],[data-path-bookmark],[data-study-bookmark],[data-photo-id],[data-evidence-open],[data-action="next"],[data-path-action="next"],[data-study-next],.choice-explanations summary');
  return key==='Enter'&&(!control||quizControl)?{type:'next'}:null;
 }
 let index=/^[1-5]$/.test(key)?Number(key)-1:null;
 if(choiceCount===2){if(/^[oO]$/.test(key))index=0;else if(/^[xX]$/.test(key))index=1;}
 return index!==null&&index<choiceCount?{type:'answer',index}:null;
}
