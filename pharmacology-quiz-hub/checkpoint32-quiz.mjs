import {C32_DRUGS,C32_CARS,C32_FEATURE_CARDS,pickCheckpointQuestion} from './checkpoint32-data.mjs?v=20261017-c32v1';
import {studyStore,recordStudyResult,studyCountLabel,paintStudyProgress} from './study-records.mjs?v=20261015-review1';
import {createMatchBoard} from './match-board.mjs?v=20261015-review1';

export function initCheckpointQuiz(){
 const $=id=>document.getElementById(id),symbols=['①','②','③','④','⑤'],storage='pharmacology-checkpoint-32-v1';
 let state={draws:0,seen:{},recent:[],subjects:[],lastArea:null},current=null,answered=false,tab='Quiz';
 const boards={};
 try{const saved=JSON.parse(localStorage.getItem(storage)||'null');if(saved&&typeof saved==='object')state={...state,...saved};}catch{}
 state.seen||={};if(!Array.isArray(state.recent))state.recent=[];if(!Array.isArray(state.subjects))state.subjects=[];
 const save=()=>{try{localStorage.setItem(storage,JSON.stringify(state));}catch{}};
 const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 function stats(){const counts=studyStore.counts('checkpoint32');$('c32Stats').textContent=studyCountLabel(counts);paintStudyProgress($('c32Stats'),counts);}
 function next(){
  current=pickCheckpointQuestion(state,$('c32Area').value);answered=false;
  state.draws++;state.recent=[current.id,...state.recent].slice(0,3);state.subjects=[current.subject,...state.subjects].slice(0,3);state.lastArea=current.area;save();
  $('c32Progress').textContent=`${current.area==='target'?'항체–차단 표적':'CAR 세포 비교'} · ${state.draws}번째 연습`;
  $('c32Polarity').textContent=current.polarity==='correct'?'옳은 연결':'옳지 않은 연결';$('c32Stem').textContent=current.stem;$('c32Source').textContent=current.source;
  $('c32Feedback').hidden=true;$('c32Next').hidden=true;$('c32Choices').replaceChildren();
  current.choices.forEach((c,i)=>{const b=node('button');b.type='button';b.append(node('span','option-no',symbols[i]),node('span','',c.text));b.addEventListener('click',()=>answer(i));$('c32Choices').append(b);});stats();
 }
 function answer(index){
  if(!current||answered||index<0||index>=5)return;answered=true;
  const good=index===current.answerIndex;state.seen[current.id]=(state.seen[current.id]||0)+1;save();recordStudyResult('checkpoint32',current,good);stats();
  [...$('c32Choices').children].forEach((b,i)=>{b.disabled=true;if(i===current.answerIndex)b.classList.add('correct');else if(i===index)b.classList.add('wrong');});
  const fb=$('c32Feedback');fb.className=`feedback ${good?'ok':'bad'}`;fb.replaceChildren(node('strong','',`${good?'정답입니다.':'연결을 다시 확인하세요.'} 정답 ${symbols[current.answerIndex]} · ${current.answer}`),node('p','',current.note));
  const list=node('ol','ans-explanations');for(const c of current.choices)list.append(node('li','',current.details.find(d=>d.startsWith(c.text+':'))));fb.append(list,node('p','cns-source',current.source));fb.hidden=false;$('c32Next').hidden=false;
 }
 function board(prefix,items,scope){
  const host=$(prefix+'Board');host.replaceChildren();const wrap=node('div','match-board'),pool=node('div','match-column match-pool');pool.id=prefix+'Pool';
  const title=node('h3','','분류할 카드 ');title.append(node('span','pool-count'));pool.append(title);
  const cards=node('div','drag-cards');cards.id=prefix+'Cards';pool.append(cards,node('small','','카드를 끌거나, 카드와 칸을 차례로 누르세요. 일부만 배치해도 채점할 수 있습니다.'));
  const targets=node('div','match-column match-targets'),zones=node('div','drop-zones');zones.id=prefix+'Zones';targets.append(node('h3','','분류 칸'),zones);wrap.append(pool,targets);
  const actions=node('div','match-actions'),status=node('div','match-status');status.id=prefix+'Status';status.setAttribute('role','status');
  const check=node('button','primary','지금 채점하기');check.id=prefix+'Check';check.type='button';const resume=node('button','primary','이 배치에서 계속하기 →');resume.id=prefix+'Reset';resume.type='button';resume.hidden=true;
  const fresh=node('button','back-button','처음부터 섞기');fresh.type='button';actions.append(status,check,resume,fresh);host.append(wrap,actions);
  const b=createMatchBoard({poolId:pool.id,cardsId:cards.id,zonesId:zones.id,statusId:status.id,checkId:check.id,resetId:resume.id,items,studyId:scope,categoriesOf:d=>d.categories,keyOf:d=>d.id,labelOf:d=>d.name,onGrade:()=>{}});
  fresh.addEventListener('click',()=>b.reset());return b;
 }
 function tables(){
  const drugBody=$('c32TargetTableBody');drugBody.replaceChildren();for(const target of ['CTLA-4 차단','PD-1 차단','PD-L1 차단']){const tr=node('tr');tr.append(node('td','',target),node('td','',C32_DRUGS.filter(d=>d.target===target).map(d=>d.name).join(' · ')));drugBody.append(tr);}
  const carBody=$('c32CarTableBody');carBody.replaceChildren();for(const c of C32_CARS){const tr=node('tr');for(const value of [c.name,c.cell,c.origin,c.crs,c.cost,c.indication])tr.append(node('td','',value));carBody.append(tr);}
 }
 function openTab(name){
  tab=name;for(const n of ['Quiz','Target','Car']){$('c32'+n+'Panel').hidden=n!==name;const b=$('c32'+n+'Tab');b.classList.toggle('active',n===name);b.setAttribute('aria-selected',String(n===name));}
  if(name==='Quiz'){if(!current)next();else stats();}
  else{if(!boards[name])boards[name]=board('c32'+name,name==='Target'?C32_DRUGS:C32_FEATURE_CARDS,name==='Target'?'checkpoint32-target':'checkpoint32-car');boards[name].open();}
 }
 for(const name of ['Quiz','Target','Car'])$('c32'+name+'Tab').addEventListener('click',()=>openTab(name));
 $('c32Area').addEventListener('change',next);$('c32Next').addEventListener('click',next);$('c32Skip').addEventListener('click',next);
 document.addEventListener('keydown',e=>{
  if($('checkpoint32View').hidden||tab!=='Quiz'||e.altKey||e.ctrlKey||e.metaKey||/^(INPUT|TEXTAREA|SELECT|SUMMARY)$/.test(e.target.tagName))return;
  if(/^[1-5]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}if(e.key==='Enter'&&answered&&!/^(BUTTON|A)$/.test(e.target.tagName)){e.preventDefault();next();}
 });
 tables();studyStore.subscribe(stats);stats();return {open(){openTab(tab);}};
}
