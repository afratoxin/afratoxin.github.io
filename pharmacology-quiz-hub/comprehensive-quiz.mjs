import {COMPREHENSIVE_LECTURES as units,pickComprehensiveQuestion} from './comprehensive-data.mjs?v=20261020-lectures1';
import {studyStore,recordStudyResult,studyCountLabel,paintStudyProgress} from './study-records.mjs?v=20261015-review1';
const KEY='pharmacology-comprehensive-2026-v1',symbols=['①','②','③','④','⑤'];
export function initComprehensiveQuiz(){
 const $=id=>document.getElementById(id),node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 let state={lecture:2,seen:{},recent:[],lastLecture:null,lastPolarity:null},current=null,answered=false;
 try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved==='object')state={...state,...saved};}catch{}
 if(!state.seen||typeof state.seen!=='object')state.seen={};if(!Array.isArray(state.recent))state.recent=[];
 if(state.lecture!=='all'&&!units.some(u=>u.number===Number(state.lecture)))state.lecture=2;
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
 const scopeIds=()=>state.lecture==='all'?units.map(u=>u.scope):[units.find(u=>u.number===Number(state.lecture)).scope];
 function paint(){
  const counts=studyStore.counts(scopeIds());$('compSelectedStats').textContent=studyCountLabel(counts);paintStudyProgress($('compSelectedStats'),counts);
  const all=studyStore.counts(units.map(u=>u.scope));$('comprehensiveStats').textContent=studyCountLabel(all);paintStudyProgress($('comprehensiveStats'),all);
  for(const u of units){const b=$(u.tabId),active=Number(state.lecture)===u.number;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));const n=studyStore.counts(u.scope);paintStudyProgress(b,n);b.title=u.number+'강 · '+u.title+' · '+studyCountLabel(n);b.setAttribute('aria-label',b.title);}
  $('compAll').classList.toggle('active',state.lecture==='all');$('compAll').setAttribute('aria-pressed',String(state.lecture==='all'));
 }
 function select(value){state.lecture=value==='all'?'all':Number(value);$('compLecture').value=String(state.lecture);save();next();}
 function next(){
  current=pickComprehensiveQuestion(state.lecture,state);answered=false;$('compChoices').replaceChildren();$('compFeedback').hidden=true;$('compNext').hidden=true;
  if(!current){$('compStem').textContent='선택한 강의에 문항이 없습니다.';return;}
  state.seen[current.id]=(Number(state.seen[current.id])||0)+1;state.recent=[current.id,...state.recent].slice(0,3);state.lastLecture=current.lecture;if(current.polarity)state.lastPolarity=current.polarity;save();
  const u=units.find(u=>u.number===current.lecture);$('compHeading').textContent=current.lecture+'강 · '+u.title;
  $('compKind').textContent=current.format==='judgment'?(current.polarity==='correct'?'옳은 것은?':'옳지 않은 것은?'):({case:'상황 추론',association:'특징 연결',numeric:'계산'}[current.format]||'종합 이해');
  $('compStem').textContent=current.stem;$('compSource').textContent=current.source;$('compExam').textContent=current.exam?current.exam+' · 발문·소재 참고':'올해 강의록의 강조 내용';
  current.choices.forEach((c,i)=>{const b=node('button');b.type='button';b.append(node('span','option-no',symbols[i]),node('span','',c.text));b.addEventListener('click',()=>answer(i));$('compChoices').append(b);});paint();
 }
 function answer(index){
  if(!current||answered||$('comprehensiveView').hidden||index<0||index>=5)return;answered=true;
  const good=index===current.answerIndex;recordStudyResult(current.scope,current,good);
  [...$('compChoices').children].forEach((b,i)=>{b.disabled=true;if(i===current.answerIndex)b.classList.add('correct');else if(i===index)b.classList.add('wrong');});
  const feedback=$('compFeedback');feedback.className='feedback '+(good?'ok':'bad');feedback.replaceChildren(node('strong','',(good?'정답입니다. ':'다시 확인해 보세요. ')+'정답 '+symbols[current.answerIndex]+' · '+current.answer),node('p','',current.note));
  const list=node('ol','ans-explanations systems-explanations');current.choices.forEach((c,i)=>list.append(node('li','',symbols[i]+' '+c.text+' — '+c.reason)));feedback.append(list,node('p','cns-source',current.source+(current.exam?' · '+current.exam:'')));
  if(current.emphasis)feedback.append(node('p','cns-source','강의록 '+current.emphasis.kind+' 표시: PDF '+current.emphasis.pages.join('·')+'쪽'));
  if(current.verifiedSources?.length){const p=node('p','cns-source','추가 확인: ');for(const [i,url]of current.verifiedSources.entries()){const a=node('a','',String(i+1));a.href=url;a.target='_blank';a.rel='noopener';p.append(a,node('span','',' '));}feedback.append(p);}
  feedback.hidden=false;$('compNext').hidden=false;paint();
 }
 for(const u of units){const option=node('option','',u.number+'강 · '+u.title);option.value=String(u.number);$('compLecture').append(option);const b=node('button','comp-unit-button',u.number+'강');b.type='button';b.id=u.tabId;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>select(u.number));$('compUnitGrid').append(b);}
 $('compLecture').value=String(state.lecture);$('compLecture').addEventListener('change',()=>select($('compLecture').value));$('compAll').addEventListener('click',()=>select('all'));$('compSkip').addEventListener('click',next);$('compNext').addEventListener('click',next);
 document.addEventListener('keydown',e=>{if($('comprehensiveView').hidden||e.altKey||e.ctrlKey||e.metaKey||/^(INPUT|TEXTAREA|SELECT|SUMMARY)$/.test(e.target.tagName))return;if(/^[1-5]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}if(e.key==='Enter'&&answered&&!/^(BUTTON|A)$/.test(e.target.tagName)){e.preventDefault();next();}});
 studyStore.subscribe(paint);paint();return {open(){if(!current)next();else paint();}};
}
