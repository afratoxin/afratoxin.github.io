import {recordStudyResult} from './study-records.mjs?v=20261015-review1';
import {PK_TOPICS,PK_VARIANTS,pkQuestionId,makePkQuestion,pickPkTopic,shuffle} from './pk-calculations.mjs?v=20261019-pksimple1';
const SYMBOLS=['①','②','③','④','⑤'];
const KEY='pharmacology-pk-calculations-v1';

export function createPkPlot(doc,plot){
  const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 520 215');svg.setAttribute('font-family','system-ui, sans-serif');svg.setAttribute('role','img');svg.setAttribute('aria-label','시간에 따른 로그 혈장 농도. 소실기 기울기는 음의 소실속도상수입니다.');
  const add=(tag,attrs,text)=>{const node=doc.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v]of Object.entries(attrs))node.setAttribute(k,String(v));if(text!==undefined)node.textContent=text;svg.append(node);return node;};
  const points=plot.points,maxT=Math.max(...points.map(p=>p.t))+1,maxY=Math.ceil(Math.max(...points.map(p=>Math.log(p.c)))+.5);
  const x=t=>44+t/maxT*440,y=v=>170-v/maxY*137;
  add('line',{x1:44,y1:170,x2:492,y2:170,stroke:'#5a7483','stroke-width':1.5});
  add('line',{x1:44,y1:170,x2:44,y2:24,stroke:'#5a7483','stroke-width':1.5});
  for(let tick=0;tick<=maxY;tick++){
    add('line',{x1:44,y1:y(tick),x2:484,y2:y(tick),stroke:'#e0e9ed','stroke-width':1});
    add('text',{x:34,y:y(tick)+4,'text-anchor':'end',fill:'#587080','font-size':11},tick);
  }
  for(const t of [0,...points.map(p=>p.t)])add('text',{x:x(t),y:188,'text-anchor':'middle',fill:'#587080','font-size':11},t);
  const first=points[0],last=points.at(-1);
  add('line',{x1:x(first.t),y1:y(Math.log(first.c)),x2:x(last.t),y2:y(Math.log(last.c)),stroke:'#168881','stroke-width':3});
  points.forEach((p,i)=>{
    add('circle',{cx:x(p.t),cy:y(Math.log(p.c)),r:4.5,fill:'#168881'});
    add('text',{x:x(p.t)+(i? -10:10),y:y(Math.log(p.c))-12,'text-anchor':i?'end':'start',fill:'#174b6b','font-size':12},`${p.t} h · ${p.c} mg/L`);
  });
  add('text',{x:12,y:18,fill:'#174b6b','font-size':12},'ln C');
  add('text',{x:480,y:208,'text-anchor':'end',fill:'#174b6b','font-size':12},'t (h)');
  return svg;
}

export function initPkQuiz(){
  const $=id=>document.getElementById(id);
  let state={total:0,right:0,seenTopics:{},missedTopics:{},seenVariants:{},attemptedVariants:{},lastTopic:null};
  try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved==='object')state={...state,...saved};}catch{}
  for(const key of ['seenTopics','missedTopics','seenVariants','attemptedVariants'])if(!state[key]||typeof state[key]!=='object')state[key]={};
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
  let tab='quiz',current=null,answered=false,session=0;
  const activeIds=PK_TOPICS.flatMap(t=>PK_VARIANTS[t.id].map(v=>pkQuestionId(t.id,v)));
  function stats(){
    const attempted=activeIds.filter(id=>state.attemptedVariants[id]>0).length;
    $('pkStats').textContent=`정답 ${state.right}/${state.total} · 풀이한 형태 ${attempted}/${activeIds.length}`;
  }
  for(const topic of PK_TOPICS){
    const option=document.createElement('option');option.value=topic.id;option.textContent=topic.title;$('pkTopic').append(option);
    const row=document.createElement('tr');
    for(const value of [topic.title,topic.formula,topic.unit,topic.note]){const cell=document.createElement('td');cell.textContent=value;row.append(cell);}
    $('pkFormulaRows').append(row);
  }
  function next(){
    const topic=pickPkTopic(state,$('pkTopic').value);
    const variants=PK_VARIANTS[topic],score=v=>state.seenVariants[pkQuestionId(topic,v)]||0,min=Math.min(...variants.map(score));
    const variant=shuffle(variants.filter(v=>score(v)===min))[0];
    current=makePkQuestion(topic,Math.random,variant);
    state.lastTopic=topic;state.seenTopics[topic]=(state.seenTopics[topic]||0)+1;state.seenVariants[current.id]=(state.seenVariants[current.id]||0)+1;
    answered=false;session++;save();stats();
    $('pkProgress').textContent=`${current.title} · 이번 회독 ${session}문제`;
    $('pkStem').textContent=current.stem;$('pkSource').textContent=current.source;
    $('pkFeedback').hidden=true;$('pkNext').hidden=true;$('pkHint').hidden=true;
    $('pkHint').textContent=current.formula;$('pkHintButton').textContent='공식 힌트 보기';
    const visual=$('pkVisual');visual.replaceChildren();visual.hidden=!current.plot&&!current.table;
    if(current.plot)visual.append(createPkPlot(document,current.plot));
    if(current.table){
      const table=document.createElement('table');table.className='pk-data-table';
      const caption=document.createElement('caption');caption.textContent='농도–시간 관측 자료';table.append(caption);
      const head=document.createElement('thead'),header=document.createElement('tr');
      current.table.headers.forEach(text=>{const th=document.createElement('th');th.setAttribute('scope','col');th.textContent=text;header.append(th);});head.append(header);table.append(head);
      const body=document.createElement('tbody');current.table.rows.forEach(values=>{const row=document.createElement('tr');values.forEach(value=>{const cell=document.createElement('td');cell.textContent=String(value);row.append(cell);});body.append(row);});table.append(body);visual.append(table);
    }
    const host=$('pkChoices');host.replaceChildren();
    current.choices.forEach((choice,i)=>{
      const button=document.createElement('button');button.type='button';
      const number=document.createElement('span');number.className='option-no';number.textContent=SYMBOLS[i];
      const label=document.createElement('span');label.textContent=choice.text;
      button.append(number,label);button.addEventListener('click',()=>answer(i));host.append(button);
    });
  }
  function answer(i){
    if(!current||answered)return;answered=true;const good=i===current.answerIndex;
    state.total++;state.right+=Number(good);state.attemptedVariants[current.id]=(state.attemptedVariants[current.id]||0)+1;
    if(!good)state.missedTopics[current.topic]=(state.missedTopics[current.topic]||0)+1;
    save();stats();
    recordStudyResult('pk',current,good);
    [...$('pkChoices').children].forEach((button,j)=>{button.disabled=true;if(j===current.answerIndex)button.classList.add('correct');else if(j===i)button.classList.add('wrong');});
    const fb=$('pkFeedback');fb.replaceChildren();fb.className=`feedback ${good?'ok':'bad'}`;
    const title=document.createElement('strong');title.textContent=`${good?'정답입니다.':'공식과 단위를 다시 확인하세요.'} 정답 ${SYMBOLS[current.answerIndex]} · ${current.choices[current.answerIndex].text}`;
    const steps=document.createElement('ol');steps.className='pk-solution';for(const text of current.steps){const li=document.createElement('li');li.textContent=text;steps.append(li);}
    const details=document.createElement('details');details.className='pk-distractors';details.open=current.format==='judgment';const summary=document.createElement('summary');summary.textContent=current.format==='judgment'?'보기별 진위와 바른 관계 확인':'보기별 계산 실수 확인';details.append(summary);
    const list=document.createElement('ul');current.choices.forEach((choice,j)=>{if(choice.correct&&current.format!=='judgment')return;const row=document.createElement('li');row.textContent=`${SYMBOLS[j]} ${choice.text} · ${choice.reason}`;list.append(row);});details.append(list);
    fb.append(title,steps,details);fb.hidden=false;$('pkNext').hidden=false;
  }
  $('pkNext').addEventListener('click',next);$('pkTopic').addEventListener('change',next);
  $('pkHintButton').addEventListener('click',()=>{$('pkHint').hidden=!$('pkHint').hidden;$('pkHintButton').textContent=$('pkHint').hidden?'공식 힌트 보기':'공식 힌트 닫기';});
  for(const [id,value]of [['pkQuizTab','quiz'],['pkFormulaTab','formula']])$(id).addEventListener('click',()=>{
    tab=value;$('pkQuizPanel').hidden=tab!=='quiz';$('pkFormulaPanel').hidden=tab!=='formula';
    for(const [key,active]of [['pkQuizTab',tab==='quiz'],['pkFormulaTab',tab==='formula']]){$(key).classList.toggle('active',active);$(key).setAttribute('aria-selected',String(active));}
    if(tab==='quiz'&&!current)next();
  });
  document.addEventListener('keydown',e=>{
    if($('pkView').hidden||tab!=='quiz'||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
    if(/^[1-5]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}
    if(e.key==='Enter'&&answered&&!/^(BUTTON|A)$/.test(e.target.tagName)){e.preventDefault();next();}
  });
  stats();return {open(){if(tab==='quiz'&&!current)next();}};
}
