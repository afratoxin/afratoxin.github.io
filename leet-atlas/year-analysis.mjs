// Descriptive corpus analysis. Burden is a transparent source-based proxy, not an observed difficulty parameter.
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const compact=value=>String(value||'').normalize('NFKC').replace(/\s/g,'');
const mean=values=>values.length?values.reduce((a,b)=>a+b,0)/values.length:0;
const percent=(n,total)=>total?100*n/total:0;
const examLabel=key=>key==='preliminary'?'2009학년도 예비시험':`${key}학년도`;
const questionLink=(id,label)=>`<a href="#/question/${escape(id)}">${escape(label||id)}</a>`;
const safeUrl=url=>{try{const value=new URL(url);return /^https?:$/.test(value.protocol)?value.href:'';}catch{return '';}};
const SOURCE_SECTIONS=['logic','prompts','choices','materials'];
const WEIGHTS={readingChars:.30,conditionMarkers:.30,logicCount:.20,comparisonLoad:.20};
const LEVELS=['','낮음','다소 낮음','보통','다소 높음','높음'];

function optionTexts(question) {
  if(Array.isArray(question.sourceOptions)&&question.sourceOptions.some(o=>o.text))return question.sourceOptions.map(o=>String(o.text||''));
  return String(question.text||'').split(/[①②③④⑤]/).slice(1);
}
function sourceFeatures(question) {
  const text=String(question.sourceStem||question.text||'');
  const prompt=text.split(/\n\s*\n/)[0].slice(0,450);
  const options=optionTexts(question), choiceText=options.join('\n');
  const combination=options.some(s=>/[ㄱㄴㄷㄹㅁ]/.test(s)&&compact(s).length<20);
  const negativePrompt=/않는|않은|않을|수없는|수없을|아닌것|틀린것|거짓인것/.test(compact(prompt));
  const optionChars=options.reduce((sum,s)=>sum+compact(s).length,0);
  const qualifiers=(choiceText.match(/반드시|모든|어떤|오직|항상|경우|아니|않|이상|이하|미만|초과/g)||[]).length;
  const statementCount=new Set(text.match(/[ㄱㄴㄷㄹㅁ](?=[.．\s])/g)||[]).size;
  const conditions=(text.match(/다만|단,|만약|경우|조건|적어도|많아야|오직|반드시|[㉠-㉯]|[◦○•]/g)||[]).length;
  const task=/강화|약화/.test(prompt)?'강화·약화':/평가|비판|반박|쟁점/.test(prompt)?'논증 평가·쟁점':/규정|원칙|사례|적용/.test(prompt)?'규칙·사례 적용':/추론|알 수|따라/.test(prompt)?'추론·판정':'내용·조건 판단';
  return {readingChars:compact(text).length,conditionMarkers:conditions,logicCount:new Set(question.logic||[]).size,comparisonLoad:optionChars/Math.max(1,options.length)+statementCount*12+qualifiers*3,optionChars,statementCount,negativePrompt,combination,qualifierChoices:qualifiers>0,numericChoices:/\d|[%=<>≤≥]|[＋−×÷]/.test(choiceText),task};
}
function percentileRank(value,sorted) {
  if(sorted.length<=1)return 50;
  let lo=0,hi=sorted.length;
  while(lo<hi){const m=(lo+hi)>>1;if(sorted[m]<value)lo=m+1;else hi=m;}
  const left=lo;hi=sorted.length;
  while(lo<hi){const m=(lo+hi)>>1;if(sorted[m]<=value)lo=m+1;else hi=m;}
  return 100*(left+(lo-left-1)/2)/(sorted.length-1);
}
function distribution(questions,getLabels) {
  const counts=new Map();
  for(const q of questions)for(const label of new Set(getLabels(q)||[]))if(label)counts.set(label,(counts.get(label)||0)+1);
  return [...counts].map(([label,count])=>({label,count,percent:percent(count,questions.length)})).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label,'ko'));
}
function summarize(key,questions) {
  const modeling=questions.filter(q=>q.types.some(t=>['모형·수리 추론','논리 퍼즐'].includes(t))).length;
  const evidence=questions.filter(q=>q.types.some(t=>['논증 평가','실험 분석'].includes(t))).length;
  return {key,label:key==='all'?'전체 회차':examLabel(key),count:questions.length,questions,
    plane:{modeling:{count:modeling,percent:percent(modeling,questions.length)},evidence:{count:evidence,percent:percent(evidence,questions.length)}},
    metrics:{meanBurden:mean(questions.map(q=>q.burden)),readingChars:mean(questions.map(q=>q.features.readingChars)),negativePromptRate:percent(questions.filter(q=>q.features.negativePrompt).length,questions.length),combinationRate:percent(questions.filter(q=>q.features.combination).length,questions.length)},
    distributions:{logic:distribution(questions,q=>q.logic),fields:distribution(questions,q=>q.fields),subjects:distribution(questions,q=>q.subjects),prompts:distribution(questions,q=>[q.features.task]),choices:distribution(questions,q=>[q.features.combination?'보기 조합형':'개별 선택지형',...(q.features.negativePrompt?['부정 발문']:[]),...(q.features.qualifierChoices?['조건·한정어 선지']:[]),...(q.features.numericChoices?['수치·수식 선지']:[])])}};
}
export function analyzeArchive(questions=[]) {
  const rows=questions.map(q=>({id:String(q.id),examKey:q.examKey||String(q.year),number:q.number,year:q.year,title:q.title,types:q.types||[],logic:q.logic||[],fields:q.fields||[],subjects:q.subjects||[],features:sourceFeatures(q)}));
  const sorted=Object.fromEntries(Object.keys(WEIGHTS).map(key=>[key,rows.map(q=>q.features[key]).sort((a,b)=>a-b)]));
  for(const q of rows){q.percentiles=Object.fromEntries(Object.keys(WEIGHTS).map(key=>[key,percentileRank(q.features[key],sorted[key])]));q.score=Object.entries(WEIGHTS).reduce((sum,[key,weight])=>sum+q.percentiles[key]*weight,0);q.burden=Math.min(5,1+Math.floor(q.score/20));}
  const keys=[...new Set(rows.map(q=>q.examKey))].sort((a,b)=>a==='preliminary'?-1:b==='preliminary'?1:Number(a)-Number(b));
  const exams=keys.map(key=>summarize(key,rows.filter(q=>q.examKey===key).sort((a,b)=>a.number-b.number)));
  return {questions:rows,exams,byExam:new Map(exams.map(e=>[e.key,e])),corpus:summarize('all',rows),weights:WEIGHTS};
}

export function validateYearContent(content,questions) {
  const errors=[],byId=new Map(questions.map(q=>[q.id,q])),exams=new Set(questions.map(q=>q.examKey)),sources=new Map();
  for(const source of content.sources||[]) {
    if(!source.id||sources.has(source.id))errors.push(`duplicate/missing source ${source.id}`);
    sources.set(source.id,source);
    if(!safeUrl(source.url))errors.push(`unsafe URL ${source.id}`);
  }
  const seen=new Set();
  for(const profile of content.profiles||[]) {
    if(!exams.has(profile.examKey)||seen.has(profile.examKey))errors.push(`invalid profile ${profile.examKey}`);
    seen.add(profile.examKey);
    for(const section of SOURCE_SECTIONS)for(const id of profile[section]?.questionIds||[])if(byId.get(id)?.examKey!==profile.examKey)errors.push(`wrong profile question ${profile.examKey}/${id}`);
  }
  const rateKeys=new Set();
  for(const rate of content.questionRates||[]) {
    if(byId.get(rate.questionId)?.examKey!==rate.examKey)errors.push(`wrong rate exam ${rate.questionId}`);
    if(!sources.has(rate.sourceId))errors.push(`missing rate source ${rate.sourceId}`);
    if(rate.correctRate!==null&&(!Number.isFinite(rate.correctRate)||rate.correctRate<0||rate.correctRate>100))errors.push(`invalid rate ${rate.questionId}`);
    if(rate.correctRate===null&&(!Number.isFinite(rate.upperBoundPercent)||rate.upperBoundPercent<0||rate.upperBoundPercent>100))errors.push(`invalid rate bound ${rate.questionId}`);
    const key=`${rate.questionId}/${rate.sourceId}`;if(rateKeys.has(key))errors.push(`duplicate rate ${key}`);rateKeys.add(key);
  }
  for(const comparison of content.examComparisons||[])for(const id of comparison.sourceIds||[])if(!sources.has(id))errors.push(`missing comparison source ${id}`);
  return errors;
}
function rateLabel(rate) {return rate.correctRate===null?`${rate.upperBoundPercent}% 이하（정확한 정답률 미확보）`:`${rate.correctRate}%`;}
function chart(exam,rates,observed=false) {
  const width=900,height=observed?280:245,left=40,top=24,bottom=205,plotWidth=840,step=plotWidth/Math.max(1,exam.count),max=observed?100:5;
  const ticks=observed?[0,20,40,60,80,100]:[1,2,3,4,5];
  const y=value=>bottom-(bottom-top)*value/max;
  const id=`annual-chart-${observed?'rates':'burden'}-${exam.key}`;
  const grid=ticks.map(t=>`<line x1="${left}" x2="880" y1="${y(t)}" y2="${y(t)}" class="annual-grid-line"/><text x="31" y="${y(t)+4}" text-anchor="end">${t}${observed?'%':''}</text>`).join('');
  const marks=exam.questions.map((q,i)=>{
    const x=left+step*(i+.5),entries=rates.filter(r=>r.questionId===q.id),exact=entries.filter(r=>r.correctRate!==null);
    const label=`${q.number}번 ${q.title} · ${observed?(entries.length?entries.map(rateLabel).join(' / '):'공개 정답률 미확보'):`풀이 부담 추정 ${q.burden}/5 (${LEVELS[q.burden]})`}`;
    const shape=observed?(exact.length?exact.map((r,n)=>`<circle cx="${x+(n-(exact.length-1)/2)*5}" cy="${y(r.correctRate)}" r="5" class="annual-observed-point"/>`).join(''):`<circle cx="${x}" cy="250" r="2.5" class="annual-missing-point"/>`):`<rect x="${x-step*.31}" y="${y(q.burden)}" width="${step*.62}" height="${bottom-y(q.burden)}" rx="3" class="annual-burden-bar level-${q.burden}"/>`;
    return `<a href="#/question/${escape(q.id)}" aria-label="${escape(label)}"><title>${escape(label)}</title><rect x="${left+step*i}" y="${top}" width="${step}" height="${bottom-top+24}" class="annual-hit-area"/>${shape}<text x="${x}" y="225" text-anchor="middle">${q.number}</text></a>`;
  }).join('');
  return `<div class="annual-chart-scroll"><svg class="annual-chart" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${escape(exam.label)} 문항별 ${observed?'외부 표본 정답률':'풀이 부담 추정'}</title><desc id="${id}-desc">가로축은 문항 번호입니다. ${observed?'확인된 정확한 정답률만 점으로 표시합니다. 그래프 아래 별도 미확보 줄의 회색 점은 정확한 정답률 미확보이며 0%를 뜻하지 않습니다.':'세로축은 원문 특징으로 계산한 1~5단계 상대 지표입니다. 실제 정답률이 아닙니다.'} 각 문항을 선택하면 원문과 해설로 이동합니다. 아래 자료 표에서도 같은 정보를 확인할 수 있습니다.</desc>${grid}${observed?'<text x="31" y="254" text-anchor="end">미확보</text>':''}${marks}</svg></div>`;
}
function distributionPanel(title,items,baseline) {
  const lookup=new Map(baseline.map(x=>[x.label,x]));
  return `<section class="annual-card"><h2>${title}</h2><div class="annual-distribution">${items.slice(0,7).map(item=>{const other=lookup.get(item.label)?.percent||0,difference=item.percent-other;return `<div class="annual-distribution-row"><div><strong>${escape(item.label)}</strong><span>${item.count}문항 · ${item.percent.toFixed(1)}% <small>${difference>=0?'+':''}${difference.toFixed(1)}%p</small></span></div><div class="annual-bar-track"><i style="width:${Math.min(100,item.percent)}%"></i><b style="left:${Math.min(100,other)}%" title="대조 회차 ${other.toFixed(1)}%"></b></div></div>`;}).join('')}</div></section>`;
}
function profileSection(title,section) {
  return `<section class="annual-card annual-profile"><h2>${title}</h2><p>${escape(section?.text||'회차별 원문 분포와 대표 문항을 함께 확인하세요.')}</p><div class="annual-example-links">${(section?.questionIds||[]).map(id=>questionLink(id,`${id}번 문항`)).join('')}</div></section>`;
}
export function renderYearPlane(stats,selectedKey) {
  if(!stats.exams.length)return '';
  const width=920,height=460,left=78,right=868,top=32,bottom=374;
  const max=Math.max(60,Math.ceil(Math.max(...stats.exams.flatMap(e=>[e.plane.modeling.percent,e.plane.evidence.percent]))/10)*10);
  const x=value=>left+(right-left)*value/max,y=value=>bottom-(bottom-top)*value/max;
  const positions=stats.exams.map(e=>({exam:e,x:x(e.plane.modeling.percent),y:y(e.plane.evidence.percent)}));
  const occupied=[],coincident=new Map(),labels=[];
  const collide=(a,b)=>a.left<b.right+4&&a.right>b.left-4&&a.top<b.bottom+3&&a.bottom>b.top-3;
  const ticks=Array.from({length:max/10+1},(_,i)=>i*10);
  const grid=ticks.map(t=>`<line x1="${x(t)}" x2="${x(t)}" y1="${top}" y2="${bottom}" class="annual-plane-grid"/><line x1="${left}" x2="${right}" y1="${y(t)}" y2="${y(t)}" class="annual-plane-grid"/><text x="${x(t)}" y="398" text-anchor="middle">${t}%</text><text x="62" y="${y(t)+4}" text-anchor="end">${t}%</text>`).join('');
  const points=positions.map(({exam:e,x:px,y:py})=>{
    const valueKey=`${e.plane.modeling.percent.toFixed(8)}/${e.plane.evidence.percent.toFixed(8)}`,ring=coincident.get(valueKey)||0;coincident.set(valueKey,ring+1);
    const selected=e.key===selectedKey,label=e.key==='preliminary'?'예비':e.key,labelWidth=e.key==='preliminary'?28:36;
    const candidates=[[11,-9],[11,22],[-labelWidth-11,-9],[-labelWidth-11,22],[12,-31],[12,43],[-labelWidth-13,-31],[-labelWidth-13,43],[25,-51],[-labelWidth-25,63],[35,4],[-labelWidth-35,4]];
    let placement;
    for(const [dx,dy] of candidates){const box={left:px+dx,right:px+dx+labelWidth,top:py+dy-13,bottom:py+dy+3};if(box.left<left||box.right>right||box.top<top||box.bottom>bottom)continue;if(occupied.some(b=>collide(box,b)))continue;if(positions.some(p=>p.exam.key!==e.key&&p.x>box.left-7&&p.x<box.right+7&&p.y>box.top-7&&p.y<box.bottom+7))continue;placement={box,dx,dy};break;}
    if(!placement){const dx=11,dy=22+ring*18;placement={box:{left:px+dx,right:px+dx+labelWidth,top:py+dy-13,bottom:py+dy+3},dx,dy};}
    occupied.push(placement.box);
    const lx=px+placement.dx,ly=py+placement.dy;
    const description=`${e.label} · 모형·수리 추론 ${e.plane.modeling.percent.toFixed(1)}%, 논증·증거 평가 ${e.plane.evidence.percent.toFixed(1)}% · ${e.count}문항`;
    labels.push(`<a href="#/analysis/${escape(e.key)}" tabindex="0" aria-label="${escape(description)}" class="annual-plane-label${selected?' is-selected':''}"><line x1="${px}" y1="${py}" x2="${lx+labelWidth/2}" y2="${ly-5}"/><text x="${lx}" y="${ly}">${escape(label)}</text></a>`);
    return `<a href="#/analysis/${escape(e.key)}" data-year-point="${escape(e.key)}" tabindex="0" aria-label="${escape(description)}" class="annual-plane-point${selected?' is-selected':''}"><title>${escape(description)}</title><circle cx="${px}" cy="${py}" r="${6+ring*4}"${ring?' fill="none"':''}/></a>`;
  }).join('');
  const selected=stats.byExam.get(selectedKey)||stats.exams.at(-1),baseline=stats.corpus.plane;
  const delta=key=>{const n=selected.plane[key].percent-baseline[key].percent;return `${n>=0?'+':''}${n.toFixed(1)}%p`;};
  return `<section class="annual-card annual-plane-card"><div class="annual-card-heading"><h2>연도별 출제 성격 지도</h2><span>점 1개 = 시행 회차 1개 · 점을 눌러 해당 연도 보기</span></div><p class="annual-note">가로축은 모형을 세우고 조건·수량을 구성하는 문항, 세로축은 주장이나 증거의 타당성을 평가하는 문항의 비중입니다. 두 축은 독립적으로 집계하며 난이도 순위를 뜻하지 않습니다.</p><div class="annual-plane-layout"><div class="annual-plane-scroll"><svg class="annual-plane" viewBox="0 0 ${width} ${height}" role="group" aria-labelledby="year-plane-title year-plane-desc"><title id="year-plane-title">시행 연도별 모형·수리 추론 비중과 논증·증거 평가 비중</title><desc id="year-plane-desc">가로축과 세로축의 단위는 해당 회차 전체 문항 중 비율입니다. 점선은 전체 회차의 문항 가중 평균입니다. 같은 좌표는 동심원으로 표시하고 연도 이름과 아래 표에서 각각 선택할 수 있습니다.</desc>${grid}<line x1="${x(baseline.modeling.percent)}" x2="${x(baseline.modeling.percent)}" y1="${top}" y2="${bottom}" class="annual-plane-mean"/><line x1="${left}" x2="${right}" y1="${y(baseline.evidence.percent)}" y2="${y(baseline.evidence.percent)}" class="annual-plane-mean"/><text class="annual-plane-axis" x="${(left+right)/2}" y="442" text-anchor="middle">모형·수리 추론 비중 →</text><text class="annual-plane-axis" transform="translate(18 ${(top+bottom)/2}) rotate(-90)" text-anchor="middle">논증·증거 평가 비중 →</text>${points}${labels.join('')}</svg></div><aside class="annual-plane-selected"><span>선택한 회차</span><h3>${escape(selected.label)}</h3><dl><div><dt>가로 · 모형·수리 추론</dt><dd>${selected.plane.modeling.percent.toFixed(1)}<small>%</small><em>${selected.plane.modeling.count}/${selected.count}문항</em></dd></div><div><dt>세로 · 논증·증거 평가</dt><dd>${selected.plane.evidence.percent.toFixed(1)}<small>%</small><em>${selected.plane.evidence.count}/${selected.count}문항</em></dd></div></dl><p>전체 회차 기준보다<br>가로 ${delta('modeling')} · 세로 ${delta('evidence')}</p><div class="annual-plane-key"><i></i>선택한 연도<br><b></b>전체 회차 기준선</div></aside></div><details class="annual-methodology annual-plane-definition"><summary>두 축의 정의와 전체 좌표 보기</summary><p>가로축: ‘모형·수리 추론’ 또는 ‘논리 퍼즐’ 유형이 붙은 문항의 비율. 세로축: ‘논증 평가’ 또는 ‘실험 분석’ 유형이 붙은 문항의 비율. 한 축의 두 유형이 겹치면 한 번만 세며, 같은 문항이 두 축에 모두 해당할 수 있습니다. 35문항·40문항 회차를 비율로 비교하고, 2009학년도 예비시험은 본시험과 별도 점입니다. 점선은 전체 ${stats.corpus.count}문항을 분모로 계산합니다.</p><p>이 축은 출제 성격을 압축하기 위해 자체적으로 설정한 기준입니다. 낮은 좌표가 쉬운 시험을 뜻하지 않으며, 규칙·사례 적용이나 내용 추론 등 두 축 밖의 유형이 많은 회차일 수도 있습니다. 같은 좌표는 동심원과 별도 연도 이름으로 구별하며 수치를 임의로 이동시키지 않습니다.</p><div class="annual-table-scroll"><table><caption>시행 회차별 2차원 좌표</caption><thead><tr><th scope="col">회차</th><th scope="col">가로: 모형·수리 추론</th><th scope="col">세로: 논증·증거 평가</th></tr></thead><tbody>${stats.exams.map(e=>`<tr><th scope="row"><a href="#/analysis/${escape(e.key)}">${escape(e.label)}</a></th><td>${e.plane.modeling.percent.toFixed(1)}% (${e.plane.modeling.count}/${e.count})</td><td>${e.plane.evidence.percent.toFixed(1)}% (${e.plane.evidence.count}/${e.count})</td></tr>`).join('')}</tbody></table></div></details></section>`;
}
export function renderYearAnalysis({archive,analysis,content={},examKey,comparisonKey='all'}={}) {
  const stats=analysis||analyzeArchive(archive.questions),exam=stats.byExam.get(examKey)||stats.exams.at(-1);
  if(!exam)return '<p class="error-state">분석할 문항이 없습니다.</p>';
  const comparison=(comparisonKey!==exam.key&&stats.byExam.get(comparisonKey))||stats.corpus;
  const profiles=content.profiles||[],profile=profiles.find(p=>p.examKey===exam.key),rates=(content.questionRates||[]).filter(r=>r.examKey===exam.key);
  const exactCount=new Set(rates.filter(r=>r.correctRate!==null).map(r=>r.questionId)).size;
  const sources=(content.sources||[]).filter(s=>(s.examKeys||[]).includes(exam.key)||rates.some(r=>r.sourceId===s.id));
  const sourceMap=new Map((content.sources||[]).map(s=>[s.id,s]));
  const options=stats.exams.slice().reverse().map(e=>`<option value="${escape(e.key)}"${e.key===exam.key?' selected':''}>${escape(e.label)} · ${e.count}문항</option>`).join('');
  const compareOptions=`<option value="all"${comparison.key==='all'?' selected':''}>전체 회차 · ${stats.corpus.count}문항</option>`+stats.exams.slice().reverse().filter(e=>e.key!==exam.key).map(e=>`<option value="${escape(e.key)}"${comparison.key===e.key?' selected':''}>${escape(e.label)}</option>`).join('');
  const comparisonNotes=(content.examComparisons||[]).filter(e=>e.examKey===exam.key);
  return `<div class="annual-page"><div class="page-heading"><div><div class="eyebrow">EXAM YEAR INSIGHTS</div><h1>연도별 출제 분석</h1><p>문항의 구조를 읽고, 회차별 차이와 풀이 부담을 비교합니다.</p></div><span class="annual-corpus-badge">${stats.exams.length}회차 · ${stats.corpus.count}문항</span></div>
  ${renderYearPlane(stats,exam.key)}<div class="annual-controls"><label>분석 회차<select id="analysis-year" aria-label="분석 회차">${options}</select></label><label>대조 회차<select id="analysis-compare" aria-label="대조 회차">${compareOptions}</select></label><p>막대는 선택 회차, 가는 표시는 대조 회차입니다.<br>차이는 문항 비율의 퍼센트포인트(%p)로 비교합니다.</p></div>
  <section class="annual-hero"><div><span class="annual-kicker">${escape(exam.label)} · 자체 원문 분석</span><h2>${escape(profile?.headline||'문항의 조건과 추론 구조를 비교해 보세요')}</h2><p>${escape(profile?.overview||'아래 분포는 수록된 원문과 기존 분류를 바탕으로 계산한 기술 통계입니다.')}</p></div><div class="annual-metrics"><div><strong>${exam.count}</strong><span>수록 문항</span></div><div><strong>${exam.metrics.negativePromptRate.toFixed(0)}<small>%</small></strong><span>부정 발문</span></div><div><strong>${exam.metrics.combinationRate.toFixed(0)}<small>%</small></strong><span>보기 조합형</span></div><div><strong>${exam.metrics.meanBurden.toFixed(1)}<small>/5</small></strong><span>평균 풀이 부담 추정</span></div></div></section>
  <div class="annual-section-heading"><div><span class="eyebrow">QUESTION BY QUESTION</span><h2>문항별 난이도 살펴보기</h2></div><span class="annual-data-badge">추정 지표와 관측 정답률 분리</span></div>
  <section class="annual-card annual-chart-card"><div class="annual-card-heading"><h3>풀이 부담 추정</h3><span>1 낮음 → 5 높음 · ${stats.corpus.count}문항 공통 기준</span></div><p class="annual-note">읽기량·조건 표현·논리 종류·선지 비교량을 조합한 상대 지표입니다. 실제 응시자의 정답률이나 검증된 난이도 등급을 뜻하지 않습니다. 막대를 누르면 해당 문항을 볼 수 있습니다.</p>${chart(exam,rates)}<div class="annual-level-legend">${[1,2,3,4,5].map(n=>`<span><i class="level-${n}"></i>${n} ${LEVELS[n]}</span>`).join('')}</div></section>
  <section class="annual-card annual-chart-card"><div class="annual-card-heading"><h3>공개 정답률 대조</h3><span>정확한 수치 확보 ${exactCount}/${exam.count}문항</span></div><p class="annual-note">${rates.length?'서로 다른 기관·표본의 정답률은 동일한 모집단의 측정값으로 합치지 않습니다. 정확한 수치가 있는 문항만 점으로 표시하고, 상한만 확인된 문항은 아래 표에 범위로 표시합니다.':'이 회차에 문항 대응까지 확인된 외부 정답률을 확보하지 못했습니다. 정답률을 추정 지표로 대신 채우지 않습니다.'} 회색 점은 정확한 정답률 미확보입니다.</p>${chart(exam,rates,true)}
  <details class="annual-data-table"><summary>전체 ${exam.count}문항의 지표와 정답률 보기</summary><div class="annual-table-scroll"><table><caption>${escape(exam.label)} 문항별 근거 자료</caption><thead><tr><th scope="col">문항</th><th scope="col">풀이 부담 추정</th><th scope="col">읽기량</th><th scope="col">조건 표현</th><th scope="col">외부 정답률·출처</th></tr></thead><tbody>${exam.questions.map(q=>`<tr><th scope="row">${questionLink(q.id,`${q.number}. ${q.title}`)}</th><td>${q.burden}/5 · ${LEVELS[q.burden]}</td><td>${q.features.readingChars}자</td><td>${q.features.conditionMarkers}회</td><td>${rates.filter(r=>r.questionId===q.id).map(r=>{const source=sourceMap.get(r.sourceId);return `<div>${escape(rateLabel(r))} ${safeUrl(source?.url)?`<a href="${escape(safeUrl(source.url))}" target="_blank" rel="noopener noreferrer">${escape(source.publisher||source.title)}</a>`:''}<small>${escape(r.booklet||'')} ${escape(r.sampleDescription||source?.sampleDescription||'표본 설명 미제공')}${r.publishedQuestionNumber?` · 출처의 ${escape(r.publishedQuestionNumber)}번`:''}</small></div>`;}).join('')||'정확한 정답률 미확보'}</td></tr>`).join('')}</tbody></table></div></details></section>
  <div class="annual-section-heading"><div><span class="eyebrow">PATTERNS & REASONING</span><h2>무엇을 어떻게 묻는가</h2></div><span>${escape(comparison.label)} 대비</span></div><p class="annual-note annual-distribution-note">자체 분류 기준이며 복수 태그가 붙은 축의 비율 합은 100%를 넘을 수 있습니다. 발문·선지 특징은 원문 표현을 기준으로 자동 집계하므로 대표 문항의 맥락을 함께 확인하세요.</p>
  <div class="annual-two-column">${distributionPanel('핵심 풀이 논리',exam.distributions.logic,comparison.distributions.logic)}${distributionPanel('지문의 분야',exam.distributions.fields,comparison.distributions.fields)}${distributionPanel('발문이 요구하는 작업',exam.distributions.prompts,comparison.distributions.prompts)}${distributionPanel('선지와 판단 형식',exam.distributions.choices,comparison.distributions.choices)}</div>
  <div class="annual-profile-grid">${profileSection('논리 · 어디에서 추론이 갈리는가',profile?.logic)}${profileSection('발문 · 무엇을 판정해야 하는가',profile?.prompts)}${profileSection('선지 · 어떤 차이를 구별해야 하는가',profile?.choices)}${profileSection('소재 · 배경지식보다 중요한 구조',profile?.materials)}</div>
  <section class="annual-study-note"><h2>이 회차를 공부할 때</h2><p>${escape(profile?.studyAdvice||'대표 문항을 원문으로 확인하고 조건·예외와 결론이 연결되는 과정을 설명해 보세요.')}</p><p class="annual-note">연도별 총평은 수록 문항을 읽고 작성한 자체 분석이며 공식 출제기관의 분류·평가가 아닙니다.</p></section>
  <section class="annual-card annual-sources"><h2>외부 총평·통계와 비교</h2>${comparisonNotes.map(note=>`<p>${escape(note.summary)} ${note.sourceIds.map(id=>sourceMap.get(id)).filter(Boolean).map(s=>safeUrl(s.url)?`<a href="${escape(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer">${escape(s.publisher||s.title)}</a>`:'').join(' · ')}</p>`).join('')}${sources.length?`<div class="annual-source-grid">${sources.map(s=>`<article><span class="annual-source-kind">${escape(s.kind==='official'?'공식 자료':s.kind==='sample-statistics'?'참여 표본 통계':'전문가 총평')}</span><h3>${safeUrl(s.url)?`<a href="${escape(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer">${escape(s.title)}</a>`:escape(s.title)}</h3><p>${escape(s.summary)}</p><small>${escape(s.publisher)}${s.author?` · ${escape(s.author)}`:''}${s.publishedAt?` · ${escape(s.publishedAt)}`:''}</small><p class="annual-source-caveat">${escape(s.sampleDescription||'')}${s.caveats?` · ${escape(s.caveats)}`:''}</p></article>`).join('')}</div>`:'<p class="annual-note">이 회차는 연결할 수 있는 공개 외부 자료를 아직 확보하지 못했습니다. 위 총평은 수록 원문에 근거한 자체 분석입니다.</p>'}</section>
  <details class="annual-methodology"><summary>분석 방법과 한계</summary><h3>풀이 부담 추정 산식</h3><p>발문·지문의 공백 제외 글자 수 30%, 조건·예외 표지의 출현 수 30%, 부여된 풀이 논리 종류 수 20%, 선지 비교량 20%를 사용합니다. 선지 비교량은 선택지 평균 글자 수 + 보기 진술 수×12 + 한정어 출현 수×3입니다. 각 관측량을 전체 ${stats.corpus.count}문항에서 동률 중간 순위의 백분위로 바꾼 후 가중합을 계산하고, 0~20·20~40·40~60·60~80·80~100 구간을 1~5단계로 표시합니다. 이 구간은 통계적 난이도 등급을 검증한 결과가 아닙니다.</p><p>조건 표지는 ‘다만·단,·만약·경우·조건·적어도·많아야·오직·반드시’와 도식·항목 표지를 셉니다. 의미상의 독립 조건 수나 실제 추론 단계 수와 같지 않습니다. 도표·수식의 시각적 복잡성, 익숙한 소재, 배경지식, 수험생 숙련도와 시간 압박은 이 지표에서 직접 측정하지 않습니다.</p><p>외부 정답률은 출처·표본·책형 대응을 별도로 확인합니다. 확인하지 못한 문항은 빈 값으로 유지합니다. 시험 전체 평균이나 일부 문항의 정답률만으로 나머지 문항의 정답률을 만들어 내지 않습니다. 출처 확인일: ${escape(content.accessedAt||'2026-10-26')}.</p></details></div>`;
}
