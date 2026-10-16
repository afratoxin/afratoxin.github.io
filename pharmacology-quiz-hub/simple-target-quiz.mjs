import {pickSimpleTargetQuestion} from './simple-target-data.mjs?v=20261017-clinical1';
import {studyStore,recordStudyResult,studyCountLabel,paintStudyProgress} from './study-records.mjs?v=20261015-review1';
export function initSimpleTargetQuiz({scope,prefix,viewId}){
 const $=suffix=>document.getElementById(prefix+suffix),symbols=['①','②','③','④','⑤'],storage='pharmacology-'+scope+'-v1';
 let state={draws:0,seen:{},recent:[],subjects:[]},current=null,answered=false;
 try{const saved=JSON.parse(localStorage.getItem(storage)||'null');if(saved&&typeof saved==='object')state={...state,...saved};}catch{}
 state.seen||={};if(!Array.isArray(state.recent))state.recent=[];if(!Array.isArray(state.subjects))state.subjects=[];
 const save=()=>{try{localStorage.setItem(storage,JSON.stringify(state));}catch{}};
 const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 function stats(){const n=studyStore.counts(scope);$('Stats').textContent=studyCountLabel(n);paintStudyProgress($('Stats'),n);}
 function next(){
  current=pickSimpleTargetQuestion(scope,state,$('Scope').value);answered=false;state.draws++;
  state.recent=[current.id,...state.recent].slice(0,3);state.subjects=[current.subject,...state.subjects].slice(0,3);save();
  $('Progress').textContent=`${current.format==='judgment'?'연결 판별':'단순 매칭'} · ${state.draws}번째 연습`;$('Exam').textContent=current.exam;$('Stem').textContent=current.stem;$('Source').textContent=current.source;
  $('Feedback').hidden=true;$('Next').hidden=true;$('Choices').replaceChildren();
  current.choices.forEach((c,i)=>{const b=node('button');b.type='button';b.append(node('span','option-no',symbols[i]),node('span','',c.text));b.addEventListener('click',()=>answer(i));$('Choices').append(b);});stats();
 }
 function answer(index){
  if(!current||answered||index<0||index>=5)return;answered=true;const good=index===current.answerIndex;
  state.seen[current.id]=(state.seen[current.id]||0)+1;save();recordStudyResult(scope,current,good);stats();
  [...$('Choices').children].forEach((b,i)=>{b.disabled=true;if(i===current.answerIndex)b.classList.add('correct');else if(i===index)b.classList.add('wrong');});
  const fb=$('Feedback');fb.className=`feedback ${good?'ok':'bad'}`;fb.replaceChildren(node('strong','',`${good?'정답입니다.':'다시 연결해 보세요.'} 정답 ${symbols[current.answerIndex]} · ${current.answer}`),node('p','',current.note));
  const details=node('details','cns-choice-notes');
  if(current.format==='judgment'){details.append(node('summary','','선지별 판정·바른 연결'));const list=node('ul');for(const c of current.choices){const text=current.details.find(d=>d.startsWith(c.text+':'));if(text)list.append(node('li','',text));}details.append(list);}else details.append(node('summary','','강의 설명 더 보기'));
  details.append(node('p','',current.lectureNote),node('p','cns-source',current.source));fb.append(details);fb.hidden=false;$('Next').hidden=false;
 }
 $('Scope').addEventListener('change',next);$('Skip').addEventListener('click',next);$('Next').addEventListener('click',next);
 document.addEventListener('keydown',e=>{
  if(document.getElementById(viewId).hidden||$('Panel').hidden||e.altKey||e.ctrlKey||e.metaKey||/^(INPUT|TEXTAREA|SELECT|SUMMARY)$/.test(e.target.tagName))return;
  if(/^[1-5]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}if(e.key==='Enter'&&answered&&!/^(BUTTON|A)$/.test(e.target.tagName)){e.preventDefault();next();}
 });
 studyStore.subscribe(stats);stats();return {open(){if(!current)next();else stats();}};
}
