import {pickAbxQuestion} from './abx-data.mjs?v=20261016-abx1';
import {studyStore,recordStudyResult,studyCountLabel,paintStudyProgress} from './study-records.mjs?v=20261015-review1';
export function initAbxQuiz(){
 const doc=document,$=id=>doc.getElementById(id),symbols=['①','②','③','④','⑤'];let tab='simple';
 const node=(tag,cls,text)=>{const e=doc.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 function panel(kind,prefix,scope,statsId){
  const storage='pharmacology-'+scope+'-v1';let state={draws:0,seen:{},recent:[],subjects:[],lastGroup:null},current=null,answered=false;
  try{const saved=JSON.parse(localStorage.getItem(storage)||'null');if(saved&&typeof saved==='object')state={...state,...saved};}catch{}
  state.seen||={};if(!Array.isArray(state.recent))state.recent=[];if(!Array.isArray(state.subjects))state.subjects=[];
  const save=()=>{try{localStorage.setItem(storage,JSON.stringify(state));}catch{}};
  function stats(){const n=studyStore.counts(scope);$(statsId).textContent=studyCountLabel(n);paintStudyProgress($(statsId),n);}
  function next(){
   const q=pickAbxQuestion(kind,state,$(prefix+'Lecture').value,$(prefix+'Range').value);if(!q){current=null;answered=false;$(prefix+'Choices').replaceChildren();$(prefix+'Stem').textContent='이 범위에 등록된 문항이 없습니다.';$(prefix+'Source').textContent='';$(prefix+'Exam').textContent='';$(prefix+'Progress').textContent='0문항';$(prefix+'Feedback').hidden=true;$(prefix+'Next').hidden=true;return;}current=q;answered=false;state.draws++;state.recent=[q.id,...state.recent].slice(0,3);state.subjects=[q.subject,...state.subjects].slice(0,3);state.lastGroup=q.group;save();
   $(prefix+'Progress').textContent=`${kind==='simple'?'단순 매칭':'일반 5지선다'} · ${state.draws}번째 연습`;$(prefix+'Exam').textContent=`${q.lecture}강 · ${q.core?'핵심':'전체 범위'}`;$(prefix+'Stem').textContent=q.stem;$(prefix+'Source').textContent=q.source;
   $(prefix+'Feedback').hidden=true;$(prefix+'Next').hidden=true;$(prefix+'Choices').replaceChildren();
   q.choices.forEach((c,i)=>{const b=node('button');b.type='button';b.append(node('span','option-no',symbols[i]),node('span','',c.text));b.addEventListener('click',()=>answer(i));$(prefix+'Choices').append(b);});stats();
  }
  function answer(index){
   if(!current||answered||index<0||index>=5)return;answered=true;const good=index===current.answerIndex;state.seen[current.id]=(state.seen[current.id]||0)+1;save();recordStudyResult(scope,current,good);stats();
   [...$(prefix+'Choices').children].forEach((b,i)=>{b.disabled=true;if(i===current.answerIndex)b.classList.add('correct');else if(i===index)b.classList.add('wrong');});
   const fb=$(prefix+'Feedback');fb.className=`feedback ${good?'ok':'bad'}`;fb.replaceChildren(node('strong','',`${good?'정답입니다.':'다시 확인해 보세요.'} 정답 ${symbols[current.answerIndex]} · ${current.answer}`),node('p','',current.note));
   if(current.details?.length){const detail=node('details','cns-choice-notes');detail.append(node('summary','','추가 해설'));for(const text of current.details)detail.append(node('p','',text));fb.append(detail);}fb.append(node('p','cns-source',current.source));fb.hidden=false;$(prefix+'Next').hidden=false;
  }
  for(const suffix of ['Lecture','Range'])$(prefix+suffix).addEventListener('change',next);for(const suffix of ['Next','Skip'])$(prefix+suffix).addEventListener('click',next);
  studyStore.subscribe(stats);stats();return {open(){if(!current)next();else stats();},answer,next,get answered(){return answered;}};
 }
 const panels={simple:panel('simple','abxSimple','abx-simple','abxSimpleStats'),general:panel('general','abx','abx','abxQuizStats')};
 for(const [kind,button,panelId]of [['simple','abxSimpleTab','abxSimplePanel'],['general','abxQuizTab','abxQuizPanel']])$(button).addEventListener('click',()=>{
  tab=kind;for(const [k,b,p]of [['simple','abxSimpleTab','abxSimplePanel'],['general','abxQuizTab','abxQuizPanel']]){$(p).hidden=k!==kind;$(b).classList.toggle('active',k===kind);$(b).setAttribute('aria-selected',String(k===kind));}panels[tab].open();
 });
 doc.addEventListener('keydown',e=>{
  if($('abxView').hidden||e.altKey||e.ctrlKey||e.metaKey||/^(INPUT|TEXTAREA|SELECT|SUMMARY)$/.test(e.target.tagName))return;const active=panels[tab];
  if(/^[1-5]$/.test(e.key)){e.preventDefault();active.answer(Number(e.key)-1);}if(e.key==='Enter'&&active.answered&&!/^(BUTTON|A)$/.test(e.target.tagName)){e.preventDefault();active.next();}
 });
 return {open(){panels[tab].open();}};
}
