const subjects = [
  {name:'수학Ⅰ',alias:'수1',cls:'math1',units:['지수함수와 로그함수','삼각함수','수열']},
  {name:'수학Ⅱ',alias:'수2',cls:'math2',units:['함수의 극한과 연속','미분','적분']},
  {name:'확률과 통계',alias:'확통',cls:'stats',units:['경우의 수','확률','통계']},
];
const $=s=>document.querySelector(s);
const el=(tag,attrs={},...children)=>{
  const x=document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k==='class')x.className=v;else if(k==='text')x.textContent=v;else if(k.startsWith('on'))x.addEventListener(k.slice(2),v);else x.setAttribute(k,v);
  }
  x.append(...children.filter(x=>x!==undefined&&x!==null));return x;
};
const norm=s=>String(s||'').normalize('NFKC').toLocaleLowerCase('ko').replace(/\s+/g,'');
const params=new URLSearchParams(location.search);
const state={subject:params.get('subject')||'',unit:params.get('unit')||'',exam:params.get('exam')||'',points:params.get('points')||'',chapter:params.get('chapter')||'',search:params.get('search')||'',id:params.get('q')||'',mode:'original'};
const cohorts=['확률과 통계','미적분','기하','가형','나형'];
state.order=params.get('order')==='wrong'?'wrong':'';
state.cohort=cohorts.includes(params.get('cohort'))?params.get('cohort'):cohorts[0];
state.logic=params.get('logic')||'';
if(params.get('view')==='solution')state.mode='solution';
let archive,items=[],filtered=[],selected,toastTimer;
let ebsi={exams:{},rates:{}}, solutions={groups:{},items:{}};
const unitNav=$('#unit-nav'),results=$('#results'),detail=$('#detail');
const modeNames={original:'시험지 원문',latex:'LaTeX',concept:'개념',solution:'해설·풀이 논리'};
function toast(message){const t=$('#toast');t.textContent=message;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{t.hidden=true},2200)}
function examLabel(q,full=false){const t=q.paper_type||q.type;return `${q.year}${full?'학년도':''} ${q.session}${['가형','나형'].includes(t)?` ${t}`:''}`}
function writeURL(){
  const p=new URLSearchParams();
  for(const key of ['subject','unit','exam','points','chapter','search','order','logic'])if(state[key])p.set(key,state[key]);
  if(state.cohort!==cohorts[0])p.set('cohort',state.cohort);
  if(selected){
    p.set('q',selected.id);
    if(state.mode==='solution'&&selected.points===4)p.set('view','solution');
  }
  history.replaceState(null,'',location.pathname+(p.size?'?'+p:''));
}
const rate=(q,cohort=state.cohort)=>ebsi.rates[q.id]?.[cohort];
const percent=n=>`${n.toFixed(1)}%`;
const cohortFor=q=>q.paper_type==='가형'||q.paper_type==='나형'?q.paper_type:q.number>=23?cohorts[0]:state.cohort;
const externalLink=(text,href)=>el('a',{text,href,target:'_blank',rel:'noopener noreferrer'});
function matches(q){
  if(state.subject&&q.subject!==state.subject||state.unit&&q.unit!==state.unit||state.exam&&q.exam_id!==state.exam||state.points&&String(q.points)!==state.points||state.chapter&&!q.textbook_chapters?.some(c=>String(c.number)===state.chapter))return false;
  if(state.logic&&!solutions.items[q.id]?.logic?.includes(state.logic))return false;
  if(state.order==='wrong'&&rate(q)===undefined)return false;
  const query=state.search.trim();if(!query)return true;
  if(/^\d{1,2}\s*번?$/.test(query))return q.number===parseInt(query,10);
  const a=subjects.find(s=>s.name===q.subject);
  const logic=(solutions.items[q.id]?.logic||[]).map(key=>solutions.groups[key]?.title);
  const hay=norm([q.id,examLabel(q,true),q.subject,a?.alias,q.unit,...q.concepts,...logic,...(q.textbook_chapters||[]).map(c=>c.title),q.number+'번',q.statement_latex].join(' '));
  return query.split(/\s+/).every(w=>hay.includes(norm(w)));
}
function chooseSubject(subject='',unit=''){Object.assign(state,{subject,unit,chapter:'',logic:'',id:''});render();}
function categoryButton(label,count,active,cls,fn){return el('button',{type:'button',class:cls,...(active?{'aria-current':'true'}:{}),onclick:fn},el('span',{text:label}),el('span',{class:'unit-count',text:String(count)}))}
function renderNav(){
  unitNav.replaceChildren(categoryButton('전체 문항',items.length,!state.subject,'unit-title',()=>chooseSubject()));
  for(const s of subjects){
    const group=el('div',{class:'unit-section'});const si=items.filter(q=>q.subject===s.name);
    group.append(categoryButton(s.name,si.length,state.subject===s.name&&!state.unit,'unit-title',()=>chooseSubject(s.name)));
    for(const u of s.units)group.append(categoryButton(u,si.filter(q=>q.unit===u).length,state.subject===s.name&&state.unit===u,'unit-button',()=>chooseSubject(s.name,u)));
    unitNav.append(group);
  }
  $('#chapter-filter').hidden=state.subject!=='확률과 통계';
  $('#chapter-select').value=state.chapter;
}
function buildLogicCatalog(scopeSubject,scopeUnit=''){
  return subjects.filter(s=>!scopeSubject||s.name===scopeSubject).flatMap(subject=>
    subject.units.filter(unit=>!scopeUnit||unit===scopeUnit).map(unit=>{
      const counts=new Map();
      for(const q of items){
        if(q.subject!==subject.name||q.unit!==unit||q.points!==4)continue;
        for(const key of solutions.items[q.id]?.logic||[])counts.set(key,(counts.get(key)||0)+1);
      }
      return {subject:subject.name,unit,options:[...counts].filter(([key])=>solutions.groups[key])
        .map(([key,count])=>({key,count,title:solutions.groups[key].title}))
        .sort((a,b)=>a.title.localeCompare(b.title,'ko'))};
    }).filter(group=>group.options.length)
  );
}
function renderLogicFilter(){
  const scope=state.subject||selected?.subject||'';
  const select=$('#logic-select');
  const groups=buildLogicCatalog(scope);
  select.replaceChildren(el('option',{value:'',text:`${scope?scope+' ':''}풀이 논리 전체`}));
  // Related-question links may intentionally span several units in this subject.
  if(state.logic&&!state.unit){
    select.append(el('option',{value:JSON.stringify([scope,'',state.logic]),text:`${solutions.groups[state.logic].title} · ${scope} 전체 단원`}));
  }
  for(const group of groups){
    select.append(el('optgroup',{label:`${group.subject} · ${group.unit}`},
      ...group.options.map(option=>el('option',{
        value:JSON.stringify([group.subject,group.unit,option.key]),
        text:`${option.title} (${option.count})`
      }))));
  }
  select.value=state.logic?JSON.stringify([scope,state.unit,state.logic]):'';
  select.setAttribute('aria-label',`${scope?scope+' ':''}4점 문항 풀이 논리`);
  $('#logic-filter').hidden=groups.length===0;
}
function openQuestion(q,focus=false){state.id=q.id;selected=q;renderLogicFilter();renderResults();renderDetail();writeURL();if(focus){detail.focus({preventScroll:true});if(innerWidth<591)detail.scrollIntoView({block:'start',behavior:'smooth'})}}
function renderResults(){
  const scroll=results.scrollTop;
  let rank=0;
  results.replaceChildren(...filtered.map((q,index)=>{
    const wrong=rate(q,state.order==='wrong'?state.cohort:cohortFor(q));
    if(state.order==='wrong'&&(index===0||wrong!==rate(filtered[index-1])))rank=index+1;
    return el('button',{type:'button',class:'result',...(q.id===state.id?{'aria-current':'true'}:{}),onclick:()=>openQuestion(q,true)},
      el('span',{class:'result-title'},el('span',{text:`${state.order==='wrong'?`${rank}위 · `:''}${examLabel(q)}`}),el('strong',{text:`${q.number}번`})),
      el('span',{class:'result-unit',text:`${q.subject} · ${q.unit} · ${q.points}점${wrong===undefined?'':state.order==='wrong'?` · 오답 ${percent(wrong)}`:` · 정답 ${percent(100-wrong)}`}`})
    );
  }));
  if(!filtered.length)results.append(el('p',{class:'result-empty',text:'조건에 맞는 문항이 없습니다.'}));
  results.scrollTop=scroll;
  $('#result-count').textContent=`${filtered.length.toLocaleString('ko-KR')}개 문항`;
}
function originalCrop(q,zoom=false){
  const o=q.original;
  const wrap=el('div',{class:'paper-crop',style:`width:min(100%, ${zoom?o.width*1.6:o.width}px);aspect-ratio:${o.width}/${o.height}`});
  const image=el('img',{src:o.atlas,alt:`${examLabel(q,true)} ${q.number}번 시험지 원문`,style:`width:${100*o.atlas_width/o.width}%;top:${-100*o.y/o.height}%;left:${-100*o.x/o.width}%;`});
  image.addEventListener('error',()=>{wrap.replaceChildren(el('p',{class:'notice',text:'원문을 불러오지 못했습니다. 페이지를 새로 고쳐 주세요.'}));wrap.style.aspectRatio='auto'});
  wrap.append(image);return wrap;
}
async function copy(s,message){try{await navigator.clipboard.writeText(s);toast(message)}catch{toast('복사할 수 없습니다. 소스에서 직접 선택해 복사하세요.')}}
function typeset(node){const run=()=>window.MathJax?.typesetPromise?.([node]).catch(()=>{});if(window.MathJax?.typesetPromise)run();else $('#mathjax').addEventListener('load',()=>{window.MathJax?.startup?.promise?.then(run).catch(()=>{})},{once:true})}
function rateDetails(q){
  const cohort=cohortFor(q);
  const wrong=rate(q,cohort);
  const text=wrong===undefined?`EBSi 정답률 미확인 · ${cohort} 응시`:`EBSi 정답률 ${percent(100-wrong)} · ${cohort} 응시`;
  const box=el('details',{class:'rate-details'},el('summary',{text}));
  const rows=Object.entries(ebsi.rates[q.id]||{});
  if(rows.length){
    box.append(el('ul',{},...rows.map(([cohort,n])=>el('li',{text:`${cohort} 응시 · 정답 ${percent(100-n)} · 오답 ${percent(n)}` }))));
  }
  const exam=ebsi.exams[q.exam_id.replace(/-[ab]$/,'')];
  box.append(el('p',{text:exam?'정답률은 100%에서 EBSi 오답률을 뺀 값입니다. 집단별 오답률 TOP15에 공개된 값만 표시합니다.':'이 문항의 EBSi 응시 집계는 확인되지 않았습니다.'}));
  if(exam)box.append(externalLink('EBSi 풀서비스 출처 ↗',exam));
  return box;
}
function chooseLogic(logic,id='',subject=selected?.subject||state.subject){
  Object.assign(state,{logic,id,subject,unit:'',exam:'',points:'4',chapter:'',search:'',order:'',mode:'solution'});
  syncFilters();
  render();
}
function renderSolution(q,panel){
  const solution=solutions.items[q.id];
  const box=el('div',{class:'solution-panel'});
  if(solution?.answer)box.append(el('p',{class:'solution-answer',text:`정답 ${solution.answer}`}));
  if(solution?.idea&&solution.steps?.length){
    const teaching=solution.teaching;
    const steps=solution.steps.map((text,index)=>{
      const key=teaching?.key_step===index;
      const row=el('li',{class:key?'solution-key-step':'solution-step'});
      if(key)row.append(el('p',{class:'solution-clue'},el('span',{class:'solution-clue-label',text:'조건에서 읽을 단서'}),el('span',{text:teaching.why})),el('span',{class:'solution-key-label',text:'핵심 단계'}));
      row.append(el('p',{class:key?'solution-key-text':'',text}));
      for(const detail of teaching?.details?.[index]||[])row.append(el('p',{class:'solution-step-detail',text:detail}));
      return row;
    });
    box.append(
      el('section',{class:'solution-idea'},el('h3',{text:'핵심 아이디어'}),el('p',{text:solution.idea})),
      el('section',{class:'solution-steps'},el('h3',{text:'해설'}),el('ol',{class:'solution-sequence'},...steps))
    );
  }else{
    box.append(el('p',{class:'notice',text:'이 문항의 서술형 해설은 아직 작성되지 않았습니다.'}));
  }
  if(solution?.logic?.length)box.append(el('h3',{class:'related-heading',text:'풀이 논리로 함께 보기'}));
  for(const key of solution?.logic||[]){
    const group=solutions.groups[key];
    const related=items.filter(item=>item.id!==q.id&&item.subject===q.subject&&solutions.items[item.id]?.logic?.includes(key));
    box.append(el('section',{class:'logic-card'},el('h3',{text:group.title}),
      el('p',{text:group.description}),
      related.length?el('button',{class:'secondary',type:'button',text:`${q.subject}에서 같은 풀이 논리 ${related.length+1}문항 보기`,onclick:()=>chooseLogic(key,q.id,q.subject)}):null));
  }
  panel.append(box);
  typeset(box);
}
function renderPanel(q,panel){
  if(state.mode==='original'){
    panel.append(el('div',{class:'paper-frame'},originalCrop(q)),el('div',{class:'paper-meta'},el('span',{text:`한국교육과정평가원 · 시험지 ${q.page_in_exam}쪽`}),el('button',{type:'button',class:'secondary',text:'원문 확대',onclick:()=>{$('#zoom-content').replaceChildren(originalCrop(q,true));$('#zoom-dialog').showModal()}})));
  }else if(state.mode==='latex'){
    const body=el('div',{class:'latex-panel'});
    const source=el('pre',{class:'latex-code',text:q.statement_latex});
    const rendered=el('div',{class:'latex-rendered',text:q.statement_latex});
    if(q.transcription_status!=='verified')body.append(el('p',{class:'notice',text:'LaTeX 변환본입니다. 복잡한 수식과 표·도형은 시험지 원문과 대조해 주세요.'}));
    body.append(el('div',{class:'latex-actions'},el('button',{type:'button',class:'secondary',text:'LaTeX 복사',onclick:()=>copy(q.statement_latex,'LaTeX를 복사했습니다.')})),rendered,el('details',{},el('summary',{text:'LaTeX 소스 펼치기'}),source),el('details',{},el('summary',{text:'원문과 대조하기'}),originalCrop(q)));
    panel.append(body);typeset(rendered);
  }else if(state.mode==='solution'){
    renderSolution(q,panel);
  }else{
    const box=el('div',{class:'concept-panel'},el('h3',{text:`${q.subject} / ${q.unit}`}),el('ul',{},...q.concepts.map(c=>el('li',{text:c}))));
    if(q.concept_note)box.append(el('p',{text:q.concept_note}));
    if(q.scope_judgement)box.append(el('p',{class:'scope-judgement',text:q.scope_judgement}));
    if(q.textbook_chapters?.length){
      box.append(el('h3',{text:'수능특강 확률과 통계에서 찾기'}),el('ul',{},...q.textbook_chapters.map(ch=>el('li',{text:`${String(ch.number).padStart(2,'0')}. ${ch.title} · ${ch.page}${ch.end_page?'–'+ch.end_page:''}쪽${ch.end_page?'':'부터'}`}))));
    }
    if(q.concept_evidence.length)box.append(el('p',{text:`문항의 확인 단서: ${q.concept_evidence.join(' · ')}`}));
    box.append(el('button',{class:'secondary',type:'button',text:'교과 범위 기준 보기',onclick:()=>$('#sources-dialog').showModal()}));panel.append(box);
  }
}
function renderDetail(){
  if(!selected){detail.replaceChildren(el('div',{class:'empty'},el('div',{class:'empty-symbol','aria-hidden':'true',text:'∑'}),el('h2',{text:'문항이 없습니다'}),el('p',{text:'회차나 단원 필터를 바꿔 보세요.'})));return}
  const q=selected,subject=subjects.find(s=>s.name===q.subject),i=filtered.indexOf(q);
  const tabs=el('div',{class:'tabs',role:'tablist','aria-label':'문항 보기'});
  const modes=q.points===4?Object.keys(modeNames):['original','latex','concept'];
  if(!modes.includes(state.mode))state.mode='original';
  for(const mode of modes){
    const selectMode=nextMode=>{state.mode=nextMode;renderDetail();writeURL();$(`#tab-${nextMode}`).focus()};
    const b=el('button',{type:'button',class:'tab',id:`tab-${mode}`,role:'tab','aria-controls':'question-panel','aria-selected':String(state.mode===mode),tabindex:state.mode===mode?'0':'-1',text:modeNames[mode],onclick:()=>selectMode(mode)});
    b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const j=modes.indexOf(mode);const next=e.key==='Home'?0:e.key==='End'?modes.length-1:(j+(e.key==='ArrowLeft'?-1:1)+modes.length)%modes.length;selectMode(modes[next])});tabs.append(b);
  }
  const panel=el('div',{id:'question-panel',role:'tabpanel','aria-labelledby':`tab-${state.mode}`});
  const previous=el('button',{type:'button',class:'secondary',text:'← 이전 문항',onclick:()=>openQuestion(filtered[i-1],true)});previous.disabled=i<1;
  const next=el('button',{type:'button',class:'secondary',text:'다음 문항 →',onclick:()=>openQuestion(filtered[i+1],true)});next.disabled=i<0||i>=filtered.length-1;
  detail.replaceChildren(el('div',{class:'detail-head'},el('div',{},el('p',{class:'detail-kicker',text:'평가원 수학 영역'}),el('h2',{text:`${examLabel(q,true)} ${q.number}번`})),el('button',{class:'quiet',type:'button',text:'문항 링크 복사',onclick:()=>copy(location.href,'문항 링크를 복사했습니다.')})),el('div',{class:'tag-row'},el('span',{class:`tag ${subject?.cls||''}`,text:q.subject}),el('span',{class:'tag',text:q.unit}),q.points?el('span',{class:'tag',text:`${q.points}점`}):null),tabs,panel,el('div',{class:'pagination'},previous,next));
  tabs.before(rateDetails(q));
  renderPanel(q,panel);
}
function render(){
  filtered=items.filter(matches);
  if(state.order==='wrong')filtered.sort((a,b)=>rate(b)-rate(a));
  selected=filtered.find(q=>q.id===state.id)||filtered[0];
  state.id=selected?.id||'';
  $('#ranking-note').hidden=state.order!=='wrong';
  renderNav();renderLogicFilter();renderResults();renderDetail();writeURL();
}
function syncFilters(){
  $('#search').value=state.search;
  for(const field of ['exam','points','chapter','order','cohort'])$(`#${field}-select`).value=state[field];
}
function coverage(){
  const out=$('#coverage-content');
  const table=el('table',{class:'coverage-table'},el('thead',{},el('tr',{},...['회차','수학Ⅰ·Ⅱ','확률과 통계'].map(text=>el('th',{scope:'col',text})))));
  const body=el('tbody');
  for(const ex of archive.exams){
    const qs=items.filter(q=>q.exam_id===ex.id),ps=qs.filter(q=>q.subject==='확률과 통계').length;
    body.append(el('tr',{},el('td',{text:examLabel(ex,true)}),el('td',{text:`${qs.length-ps}문항`}),el('td',{class:ps?'':'pending',text:ps?`${ps}문항`:'선택과목 원문 미수록'})));
  }
  table.append(body);
  const notes=Object.values(solutions.items);
  out.replaceChildren(el('p',{text:archive.scope_note}),
    el('p',{text:`EBSi 공개 정답률 ${Object.keys(ebsi.rates).length}문항 · 4점 문항 ${notes.length}개 중 서술형 해설 ${notes.filter(item=>item.idea&&item.steps?.length).length}개`}),
    table,el('p',{},externalLink('EBSi 평가원 기출문제 원문 찾아보기 ↗','https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D300')));
  $('#coverage-dialog').showModal();
}
$('#coverage-open').addEventListener('click',()=>{if(archive)coverage()});
$('#sources-open').addEventListener('click',()=>$('#sources-dialog').showModal());
$('#search').addEventListener('input',e=>{state.search=e.target.value;state.id='';render()});
$('#exam-select').addEventListener('change',e=>{state.exam=e.target.value;state.id='';render()});
$('#points-select').addEventListener('change',e=>{state.points=e.target.value;state.id='';render()});
$('#chapter-select').addEventListener('change',e=>{state.chapter=e.target.value;state.id='';render()});
for(const field of ['order','cohort']){
  $(`#${field}-select`).addEventListener('change',e=>{state[field]=e.target.value;state.id='';render()});
}
$('#logic-select').addEventListener('change',event=>{
  if(!event.target.value){state.logic='';state.id='';render();return;}
  const [subject,unit,logic]=JSON.parse(event.target.value);
  Object.assign(state,{subject,unit,logic,points:'4',chapter:'',id:'',mode:'solution'});
  syncFilters();render();
});
$('#reset').addEventListener('click',()=>{
  Object.assign(state,{subject:'',unit:'',exam:'',points:'',chapter:'',search:'',id:'',mode:'original',order:'',cohort:cohorts[0],logic:''});
  syncFilters();render();
});
if(matchMedia('(max-width:800px)').matches)$('#unit-menu').open=false;
async function loadData(path){
  const response=await fetch(path);
  if(!response.ok)throw new Error(`HTTP ${response.status} for ${path}`);
  return response.json();
}
try{
  const [catalog,rates,notes]=await Promise.all([
    loadData('data/questions.json?v=ebsi'),
    loadData('data/ebsi-rates.json').catch(()=>null),
    loadData('data/solutions.json?v=teaching-steps-1').catch(()=>null),
  ]);
  archive=catalog;
  if(rates)ebsi=rates;
  if(notes)solutions=notes;
  for(const q of archive.items){
    const correction=solutions.question_overrides?.[q.id];
    if(correction)Object.assign(q,correction);
  }
  items=archive.items.sort((a,b)=>b.exam_id.localeCompare(a.exam_id)||a.number-b.number);
  const es=$('#exam-select');
  for(const ex of [...archive.exams].sort((a,b)=>b.id.localeCompare(a.id)))es.append(el('option',{value:ex.id,text:examLabel(ex,true)}));
  if(state.exam&&!archive.exams.some(ex=>ex.id===state.exam))state.exam='';
  for(const [number,[title]] of Object.entries(archive.probability_reference.chapters))$('#chapter-select').append(el('option',{value:number,text:`${String(number).padStart(2,'0')}. ${title}`}));
  if(!solutions.groups[state.logic])state.logic='';
  syncFilters();
  $('#total-count').textContent=items.length.toLocaleString('ko-KR');render();
}catch(e){detail.replaceChildren(el('div',{class:'empty'},el('h2',{text:'문항 자료를 불러오지 못했습니다'}),el('p',{text:'페이지를 새로 고쳐 다시 확인해 주세요.'})));$('#result-count').textContent='자료 불러오기 실패';}
finally{$('#archive').setAttribute('aria-busy','false')}
