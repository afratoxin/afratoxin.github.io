import {HIST_CASES,HIST_H1_CARDS,HIST_ACID_CARDS,pickHistamineQuestion} from './histamine21-data.mjs?v=20261017-hist1';
import {studyStore,recordStudyResult,studyCountLabel,paintStudyProgress} from './study-records.mjs?v=20261015-review1';
import {createMatchBoard} from './match-board.mjs?v=20261015-review1';

export function initHistamineQuiz(){
 const $=id=>document.getElementById(id),symbols=['①','②','③','④','⑤'],storage='pharmacology-histamine-21-v1';
 let state={draws:0,seen:{},recent:[],subjects:[],lastPolarity:null},current=null,answered=false,tab='Quiz';
 const boards={};
 try{const saved=JSON.parse(localStorage.getItem(storage)||'null');if(saved&&typeof saved==='object')state={...state,...saved};}catch{}
 if(!state.seen||typeof state.seen!=='object')state.seen={};if(!Array.isArray(state.recent))state.recent=[];if(!Array.isArray(state.subjects))state.subjects=[];
 const save=()=>{try{localStorage.setItem(storage,JSON.stringify(state));}catch{}};
 const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 function stats(){const counts=studyStore.counts('histamine');$('histStats').textContent=studyCountLabel(counts);paintStudyProgress($('histStats'),counts);}
 function next(){
  current=pickHistamineQuestion(state,$('histMode').value,$('histArea').value);answered=false;if(!current)return;
  state.draws=(Number(state.draws)||0)+1;state.seen[current.id]=(Number(state.seen[current.id])||0)+1;
  state.recent=[current.id,...state.recent].slice(0,4);state.subjects=[current.subject,...state.subjects].slice(0,3);state.lastPolarity=current.polarity;save();
  $('histProgress').textContent=current.group+' · '+state.draws+'번째 연습';
  $('histPolarity').textContent=current.polarity==='correct'?'옳은 것은?':'옳지 않은 것은?';$('histPolarity').classList.toggle('systems-negative',current.polarity==='incorrect');
  $('histStem').textContent=current.stem;$('histSource').textContent=current.source;$('histExam').textContent=current.exam;
  $('histFeedback').hidden=true;$('histNext').hidden=true;$('histChoices').replaceChildren();
  current.choices.forEach((c,i)=>{const b=node('button');b.type='button';b.append(node('span','option-no',symbols[i]),node('span','',c.text));b.addEventListener('click',()=>answer(i));$('histChoices').append(b);});stats();
 }
 function answer(index){
  if(!current||answered||$('histamineView').hidden||tab!=='Quiz'||index<0||index>=5)return;answered=true;
  const good=index===current.answerIndex;recordStudyResult('histamine',current,good);stats();
  [...$('histChoices').children].forEach((b,i)=>{b.disabled=true;if(i===current.answerIndex)b.classList.add('correct');else if(i===index)b.classList.add('wrong');});
  const fb=$('histFeedback');fb.className='feedback '+(good?'ok':'bad');fb.replaceChildren(node('strong','',(good?'정답입니다. ':'설명을 다시 확인하세요. ')+'정답 '+symbols[current.answerIndex]+' · '+current.answer),node('p','',current.note));
  const list=node('ol','ans-explanations systems-explanations');for(const [i,c]of current.choices.entries())list.append(node('li','',symbols[i]+' '+current.details.find(d=>d.startsWith(c.text+':'))));
  fb.append(list,node('p','cns-source',current.source));fb.hidden=false;$('histNext').hidden=false;
 }
 function board(prefix,items,scope){
  const host=$(prefix+'Board');host.replaceChildren();const wrap=node('div','match-board'),pool=node('div','match-column match-pool');pool.id=prefix+'Pool';
  const title=node('h3','','분류할 약물 ');title.append(node('span','pool-count'));pool.append(title);
  const cards=node('div','drag-cards');cards.id=prefix+'Cards';pool.append(cards,node('small','','카드를 끌거나, 카드와 칸을 차례로 누르세요. 일부만 배치해도 채점할 수 있습니다.'));
  const targets=node('div','match-column match-targets'),zones=node('div','drop-zones');zones.id=prefix+'Zones';targets.append(node('h3','','분류 칸'),zones);wrap.append(pool,targets);
  const actions=node('div','match-actions'),status=node('div','match-status');status.id=prefix+'Status';status.setAttribute('role','status');
  const check=node('button','primary','지금 채점하기');check.id=prefix+'Check';check.type='button';
  const resume=node('button','primary','이 배치에서 계속하기 →');resume.id=prefix+'Reset';resume.type='button';resume.hidden=true;
  const fresh=node('button','back-button','처음부터 섞기');fresh.type='button';actions.append(status,check,resume,fresh);host.append(wrap,actions);
  const b=createMatchBoard({poolId:pool.id,cardsId:cards.id,zonesId:zones.id,statusId:status.id,checkId:check.id,resetId:resume.id,items,studyId:scope,categoriesOf:d=>d.categories,keyOf:d=>d.id,labelOf:d=>d.name,onGrade:()=>{}});
  fresh.addEventListener('click',()=>b.reset());return b;
 }
 function openTab(name){
  tab=name;for(const n of ['Quiz','H1','Acid']){$('hist'+n+'Panel').hidden=n!==name;const b=$('hist'+n+'Tab');b.classList.toggle('active',n===name);b.setAttribute('aria-selected',String(n===name));}
  if(name==='Quiz'){if(!current)next();else stats();}
  else{if(!boards[name])boards[name]=board('hist'+name,name==='H1'?HIST_H1_CARDS:HIST_ACID_CARDS,name==='H1'?'histamine-h1':'histamine-acid');boards[name].open();}
 }
 for(const group of new Set(HIST_CASES.map(c=>c.group))){const o=node('option','',group);o.value=group;$('histArea').append(o);}
 for(const name of ['Quiz','H1','Acid'])$('hist'+name+'Tab').addEventListener('click',()=>openTab(name));
 $('histArea').addEventListener('change',next);$('histMode').addEventListener('change',next);$('histNext').addEventListener('click',next);$('histSkip').addEventListener('click',next);
 document.addEventListener('keydown',e=>{
  if($('histamineView').hidden||tab!=='Quiz'||e.altKey||e.ctrlKey||e.metaKey||/^(INPUT|TEXTAREA|SELECT|SUMMARY)$/.test(e.target.tagName))return;
  if(/^[1-5]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}
  if(e.key==='Enter'&&answered&&!/^(BUTTON|A)$/.test(e.target.tagName)){e.preventDefault();next();}
 });
 studyStore.subscribe(stats);stats();return {open(){openTab(tab);}};
}
