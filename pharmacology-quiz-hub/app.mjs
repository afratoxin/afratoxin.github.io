import {shuffleChoices,gradeSelection,chooseQuestion,visibleQuestions} from './logic.mjs';

const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const numbers=['①','②','③','④','⑤'];
const STORAGE='pharmacology-exam-2026-v1';
let data=null,year='all',section='all',current=null,shown=null,answered=false,selected=new Set(),session=0,mode='quiz';
let progress={seen:{},correct:{},missed:{},recent:[]};
try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'null');if(saved&&saved.seen)progress={...progress,...saved};}catch{}

function save(){try{localStorage.setItem(STORAGE,JSON.stringify(progress));}catch{}}
function label(unit){
  if(unit==='all')return '전체 범위';
  const currentNo=data.currentNumbers[unit];
  const suffix=currentNo?` · 2026 ${currentNo}강`:'';
  return `${unit.startsWith('★')?'과거 편제':unit+'강'} ${data.titles[unit]||unit}${suffix}`;
}
function show(view){
  for(const name of ['menu','practice','review'])$(name+'View').hidden=(view!==name);
  window.scrollTo({top:0,behavior:'instant'});
}
function stats(){
  const qs=data.questions;
  $('statAll').textContent=qs.length;
  $('statQuiz').textContent=qs.filter(q=>q.status==='quiz').length;
  $('statReview').textContent=qs.filter(q=>q.status==='review').length;
  $('statDone').textContent=Object.keys(progress.seen).length;
}
function menu(){
  stats();
  const root=$('unitGroups');root.replaceChildren();
  for(const [title,units] of data.groups){
    const group=document.createElement('section');group.className='unit-group';
    group.innerHTML=`<div class="group-title"><h3>${esc(title)}</h3><small>단원별 학생 복원 기출</small></div><div class="unit-grid"></div>`;
    const grid=group.querySelector('.unit-grid');
    for(const u of units){
      const pool=visibleQuestions(data.questions,u,year,'quiz');
      const flagged=visibleQuestions(data.questions,u,year,'review').length;
      if(!pool.length&&!flagged)continue;
      const solved=pool.filter(q=>progress.correct[q.id]).length;
      const percentage=pool.length?Math.round(solved/pool.length*100):0;
      const card=document.createElement('button');card.type='button';card.className='unit-card';
      card.innerHTML=`<span class="fill" style="width:${percentage}%"></span><span class="icon">${esc(u.startsWith('★')?'OLD':u)}</span><span><strong>${esc(data.titles[u])}</strong><small>${pool.length}문항 · 완료 ${solved} · 확인 ${flagged}${data.currentNumbers[u]?' · 현재 '+esc(data.currentNumbers[u])+'강':''}</small></span><span class="arrow">→</span>`;
      card.addEventListener('click',()=>pool.length?startPractice(u):startReview(u));grid.append(card);
    }
    if(grid.childElementCount)root.append(group);
  }
}
function startPractice(unit){
  section=unit;mode='quiz';session=0;
  $('practiceHeading').textContent=label(unit)+(year==='all'?'':` · ${year}년`);
  show('practice');nextQuestion();
}
function nextQuestion(){
  const pool=visibleQuestions(data.questions,section,year,'quiz');
  if(!pool.length){$('questionCard').innerHTML='<div class="empty">이 범위에는 채점 가능한 문제가 없습니다.</div>';return;}
  current=chooseQuestion(pool,progress.seen,progress.recent);
  shown=shuffleChoices(current);answered=false;selected=new Set();session++;
  $('sourceTag').textContent=`${current.year} · ${current.page}쪽 · ${current.number}번`;
  $('sessionTag').textContent=`이번 회독 ${session}문제`;
  $('questionStem').textContent=current.stem;
  const list=$('choiceList');list.replaceChildren();
  shown.choices.forEach((choice,i)=>{
    const button=document.createElement('button');button.type='button';button.dataset.choice=String(i+1);
    button.innerHTML=`<span class="option-no">${numbers[i]}</span><span>${esc(choice)}</span>`;
    button.addEventListener('click',()=>toggle(i+1));list.append(button);
  });
  $('answerActions').hidden=false;$('feedback').hidden=true;$('nextButton').hidden=true;
  $('checkButton').disabled=true;
  $('checkButton').textContent=shown.answer.length>1?'선택한 답 확인 (복수 정답)':'정답 확인';
}
function toggle(n){
  if(answered)return;
  if(shown.answer.length===1)selected=new Set([n]);
  else if(selected.has(n))selected.delete(n);else selected.add(n);
  for(const button of $('choiceList').querySelectorAll('button'))button.classList.toggle('selected',selected.has(Number(button.dataset.choice)));
  $('checkButton').disabled=selected.size===0;
}
function check(){
  if(answered||!selected.size)return;
  answered=true;const good=gradeSelection(shown.answer,[...selected]);
  progress.seen[current.id]=(progress.seen[current.id]||0)+1;
  if(good)progress.correct[current.id]=(progress.correct[current.id]||0)+1;
  else progress.missed[current.id]=(progress.missed[current.id]||0)+1;
  progress.recent=[current.id,...progress.recent.filter(id=>id!==current.id)].slice(0,Math.min(8,Math.max(1,visibleQuestions(data.questions,section,year,'quiz').length-1)));
  save();stats();
  for(const btn of $('choiceList').querySelectorAll('button')){
    const i=Number(btn.dataset.choice);btn.disabled=true;
    if(shown.answer.includes(i))btn.classList.add('correct');
    else if(selected.has(i))btn.classList.add('wrong');
  }
  const correct=shown.answer.map(i=>`${numbers[i-1]} ${shown.choices[i-1]}`).join(' / ');
  const fb=$('feedback');fb.hidden=false;fb.className='feedback '+(good?'ok':'bad');
  fb.innerHTML=`<strong>${good?'정답입니다.':'다시 확인할 문항입니다.'}</strong><p>족보 답안표: ${esc(correct)}</p><p>학생 복원 문제와 답안이므로, 설명과 현행 강의록 내용은 직접 대조해 주세요. 출처: ${current.year}년 ${esc(data.titles[current.section])}, 족보 ${current.page}쪽.</p>`;
  $('answerActions').hidden=true;$('nextButton').hidden=false;
}
function startReview(unit){
  section=unit;mode='review';
  $('reviewHeading').textContent=`${label(unit)} · 원문 확인`;
  const pool=visibleQuestions(data.questions,unit,year,'review');
  const host=$('reviewItems');host.replaceChildren();
  if(!pool.length)host.innerHTML='<div class="empty">선택한 범위에 확인이 필요한 문항이 없습니다.</div>';
  for(const q of pool){
    const card=document.createElement('article');card.className='review-item';
    card.innerHTML=`<div class="meta">${esc(q.unit)} · ${q.year}년 · ${esc(q.number)}번 · 족보 ${q.page}쪽</div><h3>${esc(q.stem)}</h3><ul>${q.choices.map((v,i)=>`<li>${numbers[i]||'·'} ${esc(v)}</li>`).join('')}</ul><p>확인 이유: ${esc(q.reviewReason)}${q.answer.length?' · 답안표 표기 '+q.answer.map(a=>numbers[a-1]||'?').join(', '):''}</p>`;
    host.append(card);
  }
  show('review');
}
document.addEventListener('keydown',e=>{
  if(mode!=='quiz'||$('practiceView').hidden||e.altKey||e.ctrlKey||e.metaKey)return;
  if(/^[1-5]$/.test(e.key)){e.preventDefault();toggle(Number(e.key));}
  else if(e.key==='Enter'){e.preventDefault();answered?nextQuestion():check();}
});
$('checkButton').addEventListener('click',check);
$('nextButton').addEventListener('click',nextQuestion);
for(const id of ['backButton','reviewBack'])$(id).addEventListener('click',()=>{mode='menu';menu();show('menu');});
$('allUnit').addEventListener('click',()=>startPractice('all'));
$('reviewAll').addEventListener('click',()=>startReview('all'));
$('yearFilter').addEventListener('change',e=>{year=e.target.value;menu();});

try{
  const response=await fetch('questions.json',{cache:'no-store'});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  data=await response.json();
  const years=[...new Set(data.questions.map(q=>q.year))].sort((a,b)=>b-a);
  for(const y of years){const option=document.createElement('option');option.value=y;option.textContent=`${y}년`;$('yearFilter').append(option);}
  menu();
  const wanted=decodeURIComponent(location.hash.replace(/^#unit=/,''));
  if(data.unitOrder.includes(wanted))startPractice(wanted);
}catch(error){$('unitGroups').innerHTML=`<div class="empty">문항 자료를 불러오지 못했습니다. 새로고침해 주세요. (${esc(error.message)})</div>`;}
