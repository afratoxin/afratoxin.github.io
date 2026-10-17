import {SYSTEMS_BANKS,SYSTEMS_CONFIG,pickSystemsQuestion} from './systems-data.mjs?v=20261017-systems1';
import {studyStore,recordStudyResult,studyCountLabel,paintStudyProgress} from './study-records.mjs?v=20261015-review1';
export function initSystemsQuiz(scope){
 const config=SYSTEMS_CONFIG[scope];if(!config)throw Error('Unknown systems quiz: '+scope);
 const $=suffix=>document.getElementById(scope+suffix),symbols=['①','②','③','④','⑤'],storage='pharmacology-systems-'+scope+'-v1';
 let state={seen:{},recent:[],subjects:[],lastPolarity:null,draws:0},current=null,answered=false;
 try{const old=JSON.parse(localStorage.getItem(storage)||'null');if(old&&typeof old==='object')state={...state,...old};}catch{}
 if(!state.seen||typeof state.seen!=='object')state.seen={};
 if(!Array.isArray(state.recent))state.recent=[];if(!Array.isArray(state.subjects))state.subjects=[];
 const node=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 const save=()=>{try{localStorage.setItem(storage,JSON.stringify(state));}catch{}};
 function stats(){const counts=studyStore.counts(scope);$('Stats').textContent=studyCountLabel(counts);paintStudyProgress($('Stats'),counts);}
 function next(){
  current=pickSystemsQuestion(scope,state,$('Mode').value,Math.random,$('Area').value);answered=false;
  if(!current)return;
  state.draws=(Number(state.draws)||0)+1;state.seen[current.id]=(Number(state.seen[current.id])||0)+1;
  state.recent=[current.id,...state.recent].slice(0,4);state.subjects=[current.subject,...state.subjects].slice(0,3);state.lastPolarity=current.polarity;save();
  $('Polarity').textContent=current.polarity==='correct'?'옳은 것은?':'옳지 않은 것은?';
  $('Polarity').classList.toggle('systems-negative',current.polarity==='incorrect');
  $('Progress').textContent=current.group+' · '+state.draws+'번째 연습';
  $('Stem').textContent=current.stem;$('Source').textContent=current.source;$('Exam').textContent=current.exam;
  $('Feedback').hidden=true;$('Next').hidden=true;$('Choices').replaceChildren();
  for(const [i,choice]of current.choices.entries()){
   const b=node('button');b.type='button';b.append(node('span','option-no',symbols[i]),node('span','',choice.text));
   b.addEventListener('click',()=>answer(i));$('Choices').append(b);
  }
  stats();
 }
 function answer(index){
  if(!current||answered||$('View').hidden||index<0||index>=5)return;answered=true;
  const good=index===current.answerIndex;recordStudyResult(scope,current,good);stats();
  [...$('Choices').children].forEach((b,i)=>{b.disabled=true;if(i===current.answerIndex)b.classList.add('correct');else if(i===index)b.classList.add('wrong');});
  const fb=$('Feedback');fb.className='feedback '+(good?'ok':'bad');
  fb.replaceChildren(node('strong','',(good?'정답입니다. ':'다시 연결해 보세요. ')+'정답 '+symbols[current.answerIndex]+' · '+current.answer),node('p','',current.note));
  const list=node('ol','ans-explanations systems-explanations');
  current.choices.forEach((choice,i)=>list.append(node('li','',symbols[i]+' '+current.details.find(d=>d.startsWith(choice.text+':')))));
  fb.append(list,node('p','cns-source',current.source));fb.hidden=false;$('Next').hidden=false;
 }
 for(const group of new Set(SYSTEMS_BANKS[scope].map(q=>q.group))){const option=node('option','',group);option.value=group;$('Area').append(option);}
 const notes=$('Notes');for(const text of config.notes)notes.append(node('p','',text));
 $('Focus').textContent=config.focus;
 $('Mode').addEventListener('change',next);$('Area').addEventListener('change',next);$('Skip').addEventListener('click',next);$('Next').addEventListener('click',next);$('QuizTab').addEventListener('click',()=>{if(!current)next();else stats();});
 document.addEventListener('keydown',e=>{
  if($('View').hidden||e.altKey||e.ctrlKey||e.metaKey||/^(INPUT|TEXTAREA|SELECT|SUMMARY)$/.test(e.target.tagName))return;
  if(/^[1-5]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}
  if(e.key==='Enter'&&answered&&!/^(BUTTON|A)$/.test(e.target.tagName)){e.preventDefault();next();}
 });
 studyStore.subscribe(stats);stats();return {open(){if(!current)next();else stats();}};
}
