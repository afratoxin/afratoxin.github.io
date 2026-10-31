import {buildDesignProfile} from './design-profile.mjs';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const compact=value=>String(value||'').normalize('NFKC').replace(/\s/g,'');
const mean=values=>values.length?values.reduce((a,b)=>a+b,0)/values.length:0;
const percent=(n,total)=>total?100*n/total:0;
const examLabel=key=>key==='preliminary'?'2009학년도 예비시험':`${key}학년도`;
const questionLink=(id,label)=>`<a href="#/question/${escape(id)}">${escape(label||id)}</a>`;
const safeUrl=url=>{try{const value=new URL(url);return /^https?:$/.test(value.protocol)?value.href:'';}catch{return '';}};
const SOURCE_SECTIONS=['logic','prompts','choices','materials'];
const itemLabel=q=>`${examLabel(q.examKey)} ${q.number}번`;
function distribution(questions,getLabels) {
  const counts=new Map();
  for(const q of questions)for(const label of new Set(getLabels(q)||[]))if(label)counts.set(label,(counts.get(label)||0)+1);
  return [...counts].map(([label,count])=>({label,count,percent:percent(count,questions.length)})).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label,'ko'));
}
function summarize(key,questions) {
  const share=predicate=>{const ids=questions.filter(predicate).map(q=>q.id);return {count:ids.length,percent:percent(ids.length,questions.length),questionIds:ids};};
  const processing=share(q=>q.features.processing),argument=share(q=>q.features.argument),visual=share(q=>q.features.visualReference),negative=share(q=>q.features.negativePrompt===true),unknownOptions=share(q=>q.features.optionsUnknown);
  const measured=questions.map(q=>q.features.readingChars).filter(Number.isFinite);
  return {key,label:key==='all'?'전체 회차':examLabel(key),count:questions.length,questions,
    plane:{processing,argument,visual,negative,unknownOptions},
    metrics:{readingChars:mean(measured),readingMeasuredCount:measured.length,processingRate:processing.percent,argumentRate:argument.percent,visualRate:visual.percent,negativePromptRate:negative.percent,promptUnknownCount:questions.filter(q=>q.features.negativePrompt===null).length,combinationRate:percent(questions.filter(q=>q.features.combination).length,questions.length),unknownOptionsRate:unknownOptions.percent},
    distributions:{logic:distribution(questions,q=>q.logic),fields:distribution(questions,q=>q.fields),subjects:distribution(questions,q=>q.subjects),prompts:distribution(questions,q=>[q.features.task]),choices:distribution(questions,q=>[q.features.optionsUnknown?'선택지 텍스트 미확인':q.features.combination?'보기 조합형':'개별 선택지형',...(q.features.negativePrompt?['부정 발문']:[]),...(q.features.qualifierChoices?['조건·한정어 선지']:[]),...(q.features.numericChoices?['수치·수식 선지']:[])])}};
}
export function analyzeArchive(questions=[]) {
  const rows=questions.map(q=>{const {profile,features}=buildDesignProfile(q);return {id:String(q.id),examKey:q.examKey||String(q.year),number:q.number??q.questionNumber,year:q.year,title:q.title||'',types:q.types||[],logic:q.logic||[],fields:q.fields||[],subjects:q.subjects||[],features,designProfile:profile};});
  const keys=[...new Set(rows.map(q=>q.examKey))].sort((a,b)=>a==='preliminary'?-1:b==='preliminary'?1:Number(a)-Number(b));
  const exams=keys.map(key=>summarize(key,rows.filter(q=>q.examKey===key).sort((a,b)=>a.number-b.number)));
  return {questions:rows,exams,byExam:new Map(exams.map(e=>[e.key,e])),corpus:summarize('all',rows)};
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
function distributionPanel(title,items,baseline) {
  const lookup=new Map(baseline.map(x=>[x.label,x]));
  return `<section class="annual-card"><h2>${title}</h2><div class="annual-distribution">${items.slice(0,7).map(item=>{const other=lookup.get(item.label)?.percent||0,difference=item.percent-other;return `<div class="annual-distribution-row"><div><strong>${escape(item.label)}</strong><span>${item.count}문항 · ${item.percent.toFixed(1)}% <small>${difference>=0?'+':''}${difference.toFixed(1)}%p</small></span></div><div class="annual-bar-track"><i style="width:${Math.min(100,item.percent)}%"></i><b style="left:${Math.min(100,other)}%" title="대조 회차 ${other.toFixed(1)}%"></b></div></div>`;}).join('')}</div></section>`;
}

export const DESIGN_AXES={
  readingChars:{label:'원문 텍스트 평균 읽기량',unit:'자',definition:'발문·지문·보기 진술·텍스트 선택지의 공백 제외 글자 수 평균. 그림 속 글자와 추출되지 않은 선택지는 포함하지 않습니다.'},
  processingRate:{label:'조건·규칙·수리 처리 문항 비중',unit:'%',plane:'processing',definition:'기존 유형 중 규칙·사례 적용, 모형·수리 추론, 논리 퍼즐의 합집합. 여러 유형이 겹쳐도 한 번만 셉니다.'},
  argumentRate:{label:'논증·증거 판정 문항 비중',unit:'%',plane:'argument',definition:'기존 유형 중 논증 평가 또는 실험 분석의 합집합.'},
  visualRate:{label:'시각 자료 표지 문항 비중',unit:'%',plane:'visual',definition:'원문에서 그림·그래프·도표·도식·표 참조가 감지된 문항. 실제 시각 작업량이나 모든 그림의 수가 아닙니다.'},
  negativePromptRate:{label:'부정 발문 비중',unit:'%',plane:'negative',definition:'물음표까지 분리한 실제 발문의 부정 표현 감지. 괄호의 가정·본문·선택지 부정은 제외합니다.'},
  unknownOptionsRate:{label:'선택지 텍스트 미확인 비중',unit:'%',plane:'unknownOptions',definition:'선택지의 일부 또는 전부가 추출되지 않은 문항. 그림 선택지의 비교 작업은 미측정입니다.'}
};
const axisValue=(e,key)=>e.metrics[key];
const formatted=(value,key)=>`${value.toFixed(key==='readingChars'?0:1)}${DESIGN_AXES[key].unit}`;
const axisDetail=(e,key)=>key==='readingChars'?`텍스트 관측 ${e.metrics.readingMeasuredCount}/${e.count}문항`:`${e.plane[DESIGN_AXES[key].plane].count}/${e.count}문항`;
function axisEvidence(exam,key) {
  const selected=key==='readingChars'?exam.questions.slice().sort((a,b)=>(b.features.readingChars||0)-(a.features.readingChars||0)).slice(0,5):exam.questions.filter(q=>exam.plane[DESIGN_AXES[key].plane].questionIds.includes(q.id));
  return selected.map(q=>questionLink(q.id,itemLabel(q))).join(' ')||'해당 문항 없음';
}
export function renderYearPlane(stats,selectedKey,{axisX='readingChars',axisY='processingRate'}={}) {
  if(!stats.exams.length)return '';
  if(!DESIGN_AXES[axisX])axisX='readingChars';if(!DESIGN_AXES[axisY])axisY='processingRate';
  const width=920,height=460,left=86,right=864,top=30,bottom=370;
  const domain=key=>{const values=stats.exams.map(e=>axisValue(e,key)),step=key==='readingChars'?100:10,min=Math.max(0,Math.floor(Math.min(...values)/step)*step),max=Math.ceil(Math.max(...values)/step)*step;return [min,Math.max(min+step,max)];};
  const [xmin,xmax]=domain(axisX),[ymin,ymax]=domain(axisY),x=v=>left+(right-left)*(v-xmin)/(xmax-xmin),y=v=>bottom-(bottom-top)*(v-ymin)/(ymax-ymin);
  const positions=stats.exams.map(exam=>({exam,x:x(axisValue(exam,axisX)),y:y(axisValue(exam,axisY))}));
  const occupied=[],coincident=new Map(),labels=[];
  const collide=(a,b)=>a.left<b.right+4&&a.right>b.left-4&&a.top<b.bottom+3&&a.bottom>b.top-3;
  const grid=Array.from({length:6},(_,i)=>{const xv=xmin+(xmax-xmin)*i/5,yv=ymin+(ymax-ymin)*i/5;return `<line x1="${x(xv)}" x2="${x(xv)}" y1="${top}" y2="${bottom}" class="annual-plane-grid"/><line x1="${left}" x2="${right}" y1="${y(yv)}" y2="${y(yv)}" class="annual-plane-grid"/><text x="${x(xv)}" y="395" text-anchor="middle">${Math.round(xv)}${DESIGN_AXES[axisX].unit}</text><text x="70" y="${y(yv)+4}" text-anchor="end">${Math.round(yv)}${DESIGN_AXES[axisY].unit}</text>`;}).join('');
  const points=positions.map(({exam:e,x:px,y:py})=>{
    const valueKey=`${px.toFixed(8)}/${py.toFixed(8)}`,ring=coincident.get(valueKey)||0;coincident.set(valueKey,ring+1);
    const selected=e.key===selectedKey,label=e.key==='preliminary'?'예비':e.key,labelWidth=36;
    let placement;
    for(const [dx,dy] of [[11,-9],[11,22],[-47,-9],[-47,22],[12,-31],[12,43],[-49,-31],[-49,43],[25,-51],[-61,63],[35,4],[-71,4]]){
      const box={left:px+dx,right:px+dx+labelWidth,top:py+dy-13,bottom:py+dy+3};
      if(box.left<left||box.right>right||box.top<top||box.bottom>bottom||occupied.some(b=>collide(box,b)))continue;
      if(positions.some(p=>p.exam.key!==e.key&&p.x>box.left-7&&p.x<box.right+7&&p.y>box.top-7&&p.y<box.bottom+7))continue;
      placement={box,dx,dy};break;
    }
    if(!placement){const dx=px>right-70?-49:11,dy=py>bottom-35?-18-ring*17:22+ring*17;placement={box:{left:px+dx,right:px+dx+36,top:py+dy-13,bottom:py+dy+3},dx,dy};}
    occupied.push(placement.box);
    const description=`${e.label} · ${DESIGN_AXES[axisX].label} ${formatted(axisValue(e,axisX),axisX)}, ${DESIGN_AXES[axisY].label} ${formatted(axisValue(e,axisY),axisY)} · ${e.count}문항`,lx=px+placement.dx,ly=py+placement.dy;
    labels.push(`<a href="#/analysis/${escape(e.key)}" aria-label="${escape(description)}" class="annual-plane-label${selected?' is-selected':''}"><line x1="${px}" y1="${py}" x2="${lx+18}" y2="${ly-5}"/><text x="${lx}" y="${ly}">${escape(label)}</text></a>`);
    return `<a href="#/analysis/${escape(e.key)}" data-year-point="${escape(e.key)}" aria-label="${escape(description)}" class="annual-plane-point${selected?' is-selected':''}"><title>${escape(description)}</title><circle cx="${px}" cy="${py}" r="${6+ring*4}"${ring?' fill="none"':''}/></a>`;
  }).join('');
  const selected=stats.byExam.get(selectedKey)||stats.exams.at(-1);
  const selector=(id,key)=>`<select id="${id}" aria-label="${id==='analysis-axis-x'?'가로축':'세로축'}">${Object.entries(DESIGN_AXES).map(([k,v])=>`<option value="${k}"${k===key?' selected':''}>${v.label} (${v.unit})</option>`).join('')}</select>`;
  return `<section class="annual-card annual-plane-card"><div class="annual-card-heading"><h2>연도별 출제 설계 지도</h2><span>점 1개 = 시행 회차 1개</span></div><div class="annual-axis-controls"><label>가로축${selector('analysis-axis-x',axisX)}</label><label>세로축${selector('analysis-axis-y',axisY)}</label></div><p class="annual-note">읽기량과 문항 구성 비중으로 시험지의 배합을 비교합니다. 각 점에서 해당 회차로 이동할 수 있습니다.</p><div class="annual-plane-layout"><div class="annual-plane-scroll"><svg class="annual-plane" viewBox="0 0 ${width} ${height}" role="group" aria-labelledby="year-plane-title year-plane-desc"><title id="year-plane-title">${escape(DESIGN_AXES[axisX].label)}와 ${escape(DESIGN_AXES[axisY].label)}</title><desc id="year-plane-desc">점선은 전체 문항 가중 평균입니다. 같은 좌표는 동심원으로 표시합니다. 전체 수치는 아래 표에서 확인할 수 있습니다.</desc>${grid}<line x1="${x(axisValue(stats.corpus,axisX))}" x2="${x(axisValue(stats.corpus,axisX))}" y1="${top}" y2="${bottom}" class="annual-plane-mean"/><line x1="${left}" x2="${right}" y1="${y(axisValue(stats.corpus,axisY))}" y2="${y(axisValue(stats.corpus,axisY))}" class="annual-plane-mean"/><text class="annual-plane-axis" x="${(left+right)/2}" y="440" text-anchor="middle">${escape(DESIGN_AXES[axisX].label)} →</text><text class="annual-plane-axis" transform="translate(20 ${(top+bottom)/2}) rotate(-90)" text-anchor="middle">${escape(DESIGN_AXES[axisY].label)} →</text>${points}${labels.join('')}</svg></div><aside class="annual-plane-selected"><span>선택한 회차</span><h3>${escape(selected.label)}</h3><dl>${[axisX,axisY].map((key,i)=>`<div><dt>${i?'세로':'가로'} · ${escape(DESIGN_AXES[key].label)}</dt><dd>${formatted(axisValue(selected,key),key)}<em>${axisDetail(selected,key)}</em></dd></div>`).join('')}</dl><p>점선: 전체 ${stats.corpus.count}문항 기준</p></aside></div><details class="annual-methodology annual-plane-definition"><summary>축의 정의·전체 좌표·선택 회차 근거 문항</summary>${[axisX,axisY].map(key=>`<p><strong>${escape(DESIGN_AXES[key].label)}</strong>: ${escape(DESIGN_AXES[key].definition)}</p><div class="annual-example-links">${axisEvidence(selected,key)}</div>`).join('')}<p>35·40문항 회차는 전체 문항을 분모로 비율을 계산합니다. 예비시험은 별도 회차입니다. 낮은 좌표가 쉬운 시험을 뜻하지 않습니다. 글자 수는 추론 깊이를 측정하지 않으며, 도표 작업량은 미측정입니다.</p><div class="annual-table-scroll"><table><caption>시행 회차별 좌표와 집계 범위</caption><thead><tr><th>회차</th><th>${escape(DESIGN_AXES[axisX].label)}</th><th>${escape(DESIGN_AXES[axisY].label)}</th></tr></thead><tbody>${stats.exams.map(e=>`<tr><th><a href="#/analysis/${escape(e.key)}">${escape(e.label)}</a></th>${[axisX,axisY].map(key=>`<td>${formatted(axisValue(e,key),key)} · ${axisDetail(e,key)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details></section>`;
}

const rateLabel=rate=>rate.correctRate===null?`${rate.upperBoundPercent}% 이하 (정확한 정답률 미확보)`:`${rate.correctRate}%`;
const externalLink=(source,label)=>safeUrl(source?.url)?`<a href="${escape(safeUrl(source.url))}" target="_blank" rel="noopener noreferrer">${escape(label||source.title)}</a>`:'';
const sourceKind=source=>({'official':'공식 자료','sample-statistics':'참여 표본 통계','expert-review':'전문가 총평','news-report':'보도·책형 안내'}[source.kind]||'외부 참고 자료');
function ratesChart(exam,rates) {
  const left=42,top=24,bottom=205,step=840/Math.max(1,exam.count),y=v=>bottom-(bottom-top)*v/100;
  const grid=[0,20,40,60,80,100].map(t=>`<line x1="${left}" x2="882" y1="${y(t)}" y2="${y(t)}" class="annual-grid-line"/><text x="33" y="${y(t)+4}" text-anchor="end">${t}%</text>`).join('');
  const marks=exam.questions.map((q,i)=>{const x=left+step*(i+.5),exact=rates.filter(r=>r.questionId===q.id&&r.correctRate!==null),label=`${itemLabel(q)} · ${exact.length?exact.map(rateLabel).join(' / '):'정확한 정답률 미확보'}`;return `<a href="#/question/${escape(q.id)}" aria-label="${escape(label)}"><title>${escape(label)}</title><rect x="${left+step*i}" y="${top}" width="${step}" height="240" class="annual-hit-area"/>${exact.length?exact.map((r,n)=>`<circle cx="${x+(n-(exact.length-1)/2)*5}" cy="${y(r.correctRate)}" r="5" class="annual-observed-point"/>`).join(''):`<circle cx="${x}" cy="250" r="2.5" class="annual-missing-point"/>`}<text x="${x}" y="226" text-anchor="middle">${q.number}</text></a>`;}).join('');
  return `<div class="annual-chart-scroll"><svg class="annual-chart" viewBox="0 0 900 280" role="img" aria-labelledby="annual-rates-title annual-rates-desc"><title id="annual-rates-title">${escape(exam.label)} 관측 정답률</title><desc id="annual-rates-desc">문항별 외부 표본 정답률입니다. 정확한 수치가 없는 문항은 별도 미확보 줄에 표시하며 0%를 뜻하지 않습니다. 출처와 표본은 아래 표에서 확인할 수 있습니다.</desc>${grid}<text x="33" y="254" text-anchor="end">미확보</text>${marks}</svg></div>`;
}
function dimensionEvidence(title,observations,evidence) {
  return `<div class="annual-demand-dimension"><strong>${escape(title)}</strong><p>${escape(observations)}</p>${evidence.length?`<ul>${evidence.slice(0,4).map(s=>`<li>${escape(s)}</li>`).join('')}</ul>`:'<small>텍스트에서 대응 표현 미검출 · 의미상 요구의 부재를 뜻하지 않음</small>'}</div>`;
}
function questionProfile(q) {
  const p=q.designProfile;
  return `<details class="annual-demand-item"><summary>${questionLink(q.id,itemLabel(q))}<span>${escape(q.title)}</span><small>${p.reading.chars??'미확인'}자 · 조건 표지 ${p.conditions.markerCount}회 · ${q.features.negativePrompt===null?'발문 미확인':q.features.negativePrompt?'부정 발문':'긍정 발문'}</small></summary><p class="annual-note">자동 관측 · 발문: ${escape(q.features.prompt||'분리 미확인')}</p><div class="annual-demand-grid">${dimensionEvidence('원문 읽기량',`${p.reading.chars??'미확인'}자 (발문·지문·보기 ${p.reading.stemChars??'미확인'}자, 선택지 ${p.reading.optionChars??'미확인'}자)`,p.reading.evidence)}${dimensionEvidence('조건·규칙 상호작용 신호',`조건·수량 한정 표지 ${p.conditions.markerCount}회 · 독립 조건 수·상호작용·추론 깊이는 미측정`,p.conditions.evidence)}${dimensionEvidence('수리 처리 신호',`숫자·수식 표지 ${p.quantitative.numericSignals}회 · 필수 연산 수 미측정`,p.quantitative.evidence)}${dimensionEvidence('논증·증거 구별',`${p.argument.labels.join(' / ')||'해당 유형 태그 없음'} · 판단 단계·변별 정도 미측정`,p.argument.evidence)}${dimensionEvidence('시각 자료·선택지 비교',`${p.visual.referenceDetected?'시각 자료 참조 감지':'시각 자료 참조 미검출'} · 시각 작업량 미측정. 선택지 ${p.comparison.optionChars===null?'텍스트 미확인·비교량 미측정':`${p.comparison.optionCount}개, 텍스트 ${p.comparison.optionChars}자`}. 보기 진술 ${p.comparison.statementCount}개, ${p.comparison.statementChars}자.`,[...p.visual.evidence,...p.comparison.statements.map(s=>`${s.label}. ${s.text}`)])}</div><p class="annual-review-recommendation"><strong>사람 검토 권고</strong> ${p.reviewRecommendations.map(escape).join(' ')}</p></details>`;
}
function profileSection(title,section,stats) {
  const byId=new Map(stats.questions.map(q=>[q.id,q]));
  return `<section class="annual-card annual-profile"><h2>${title}</h2><p>${escape(section?.text||'원문과 분류 근거를 대조해 출제 설계의 차이를 확인하세요.')}</p><div class="annual-example-links">${(section?.questionIds||[]).map(id=>byId.has(id)?questionLink(id,itemLabel(byId.get(id))):'').join('')}</div></section>`;
}
export function renderYearAnalysis({archive,analysis,content={},examKey,comparisonKey='all',axisX='readingChars',axisY='processingRate'}={}) {
  const stats=analysis||analyzeArchive(archive?.questions||[]),exam=stats.byExam.get(examKey)||stats.exams.at(-1);
  if(!exam)return '<p class="error-state">분석할 문항이 없습니다.</p>';
  const comparison=(comparisonKey!==exam.key&&stats.byExam.get(comparisonKey))||stats.corpus;
  const profile=(content.profiles||[]).find(p=>p.examKey===exam.key),rates=(content.questionRates||[]).filter(r=>r.examKey===exam.key),exactCount=new Set(rates.filter(r=>r.correctRate!==null).map(r=>r.questionId)).size;
  const sourceMap=new Map((content.sources||[]).map(s=>[s.id,s]));
  const sources=(content.sources||[]).filter(s=>(s.examKeys||[]).includes(exam.key)||rates.some(r=>r.sourceId===s.id));
  const options=stats.exams.slice().reverse().map(e=>`<option value="${escape(e.key)}"${e.key===exam.key?' selected':''}>${escape(e.label)} · ${e.count}문항</option>`).join('');
  const compareOptions=`<option value="all"${comparison.key==='all'?' selected':''}>전체 회차 · ${stats.corpus.count}문항</option>`+stats.exams.slice().reverse().filter(e=>e.key!==exam.key).map(e=>`<option value="${escape(e.key)}"${comparison.key===e.key?' selected':''}>${escape(e.label)}</option>`).join('');
  return `<div class="annual-page"><div class="page-heading"><div><div class="eyebrow">ITEM DESIGN RESEARCH</div><h1>연도별 출제 분석</h1><p>원문 읽기량과 조건·수리·논증의 배합을 비교하고 설계 근거 문항을 찾습니다.</p></div><span class="annual-corpus-badge">${stats.exams.length}회차 · ${stats.corpus.count}문항</span></div>
  ${renderYearPlane(stats,exam.key,{axisX,axisY})}<div class="annual-controls"><label>분석 회차<select id="analysis-year" aria-label="분석 회차">${options}</select></label><label>대조 회차<select id="analysis-compare" aria-label="대조 회차">${compareOptions}</select></label><p>분포의 막대는 선택 회차, 가는 표시는 대조 회차입니다.<br>비율 차이는 퍼센트포인트(%p)입니다.</p></div>
  <section class="annual-hero"><div><span class="annual-kicker">${escape(exam.label)} · 자체 원문 분석</span><h2>회차 구성과 설계 요구</h2><p>전체 ${exam.count}문항. 텍스트의 관측값과 기존 유형 분류를 기준으로 집계합니다. 원문 이미지에서 시각 자료와 상호작용을 검토하세요.</p></div><div class="annual-metrics"><div><strong>${exam.metrics.readingChars.toFixed(0)}<small>자</small></strong><span>원문 평균 읽기량</span></div><div><strong>${exam.metrics.processingRate.toFixed(1)}<small>%</small></strong><span>조건·규칙·수리 처리</span></div><div><strong>${exam.metrics.negativePromptRate.toFixed(1)}<small>%</small></strong><span>부정 발문 · 미확인 ${exam.metrics.promptUnknownCount}개</span></div><div><strong>${exam.plane.unknownOptions.count}</strong><span>선택지 텍스트 미확인</span></div></div></section>
  <section class="annual-card"><div class="annual-card-heading"><h2>문항별 설계 요구 프로필</h2><span>자동 관측 + 사람 검토 권고</span></div><p class="annual-note">각 문항을 펼치면 관측값과 원문 표현을 확인할 수 있습니다. 글자·표지의 수는 독립 조건 수나 실제 추론 깊이가 아닙니다. 그림 선택지의 작업량은 미측정으로 남깁니다.</p><div class="annual-demand-list">${exam.questions.map(questionProfile).join('')}</div></section>
  <section class="annual-card annual-chart-card"><div class="annual-card-heading"><h2>관측 정답률 · 출처별 실증 자료</h2><span>정확한 수치 확보 ${exactCount}/${exam.count}문항</span></div><p class="annual-note">${rates.length?'문항별 대응이 확인된 외부 자료만 표시합니다. 서로 다른 기관·표본의 값을 합산하지 않습니다.':'이 회차는 문항 대응까지 확인된 외부 정답률을 확보하지 못했습니다.'} 일부 문항의 수치로 회차 전체 난이도를 산출하지 않습니다. 자발적 참여 표본의 편향, 표본 인원, 책형과 조사 시점을 출처별로 확인해야 합니다. 회색 점은 정확한 정답률 미확보입니다.</p>${ratesChart(exam,rates)}
  <details class="annual-data-table"><summary>전체 ${exam.count}문항의 관측 정답률·표본·책형 보기</summary><div class="annual-table-scroll"><table><caption>${escape(exam.label)} 관측 정답률 근거</caption><thead><tr><th>문항</th><th>관측 정답률</th><th>출처·표본·책형</th></tr></thead><tbody>${exam.questions.map(q=>{const entries=rates.filter(r=>r.questionId===q.id);return `<tr><th>${questionLink(q.id,itemLabel(q))}</th><td>${entries.map(r=>escape(rateLabel(r))).join('<br>')||'정확한 정답률 미확보'}</td><td>${entries.map(r=>{const s=sourceMap.get(r.sourceId);return `<div>${externalLink(s,s?.publisher||s?.title)} · ${escape(r.sampleDescription||s?.sampleDescription||'표본 설명 미제공')}<small>책형 ${escape(r.booklet||'미확인')} · ${escape(s?.publishedAt||'조사일 미확인')}${r.publishedQuestionNumber?` · 출처의 ${escape(r.publishedQuestionNumber)}번`:''}</small><small>${escape(s?.caveats||'')}</small></div>`;}).join('')||'연결된 관측 자료 없음'}</td></tr>`;}).join('')}</tbody></table></div></details></section>
  <div class="annual-section-heading"><div><h2>유형·소재·발문 배합</h2></div><span>${escape(comparison.label)} 대비</span></div><p class="annual-note">복수 태그가 붙은 축의 비율 합은 100%를 넘을 수 있습니다. 원문 표현의 자동 관측과 자체 분류이며 공식 분류가 아닙니다.</p><div class="annual-two-column">${distributionPanel('핵심 풀이 논리',exam.distributions.logic,comparison.distributions.logic)}${distributionPanel('지문의 분야',exam.distributions.fields,comparison.distributions.fields)}${distributionPanel('발문이 요구하는 작업',exam.distributions.prompts,comparison.distributions.prompts)}${distributionPanel('선지와 판단 형식',exam.distributions.choices,comparison.distributions.choices)}</div>
  <details class="annual-methodology"><summary>기존 회차별 해설과 대표 문항</summary><p>기존 자체 해설입니다. 사람의 최종 검수 기록이나 실증 난이도 자료를 뜻하지 않습니다.</p><div class="annual-profile-grid">${profileSection('논리 · 추론의 분기',profile?.logic,stats)}${profileSection('발문 · 판정 작업',profile?.prompts,stats)}${profileSection('선지 · 구별할 차이',profile?.choices,stats)}${profileSection('소재 · 내용과 구조',profile?.materials,stats)}</div></details>
  <section class="annual-card annual-sources"><h2>외부 총평·통계의 출처</h2><p class="annual-note">아래 요약은 각 저자·기관의 관점과 표본에 해당합니다. 자동 프로필과 분리해 원자료를 검토하세요.</p>${(content.examComparisons||[]).filter(n=>n.examKey===exam.key).map(n=>`<p>외부 자료 요약: ${escape(n.summary)} ${(n.sourceIds||[]).map(id=>externalLink(sourceMap.get(id))).join(' · ')}</p>`).join('')}${sources.length?`<div class="annual-source-grid">${sources.map(s=>`<article><span class="annual-source-kind">${escape(sourceKind(s))}</span><h3>${externalLink(s)||escape(s.title)}</h3><p>${escape(s.summary)}</p><small>${escape(s.publisher)}${s.author?` · ${escape(s.author)}`:''}${s.publishedAt?` · ${escape(s.publishedAt)}`:''}</small><p class="annual-source-caveat">${escape(s.sampleDescription||'표본 정보 미제공')} · ${escape(s.caveats||'')}</p></article>`).join('')}</div>`:'<p>연결할 공개 외부 자료를 아직 확보하지 못했습니다.</p>'}</section>
  <details class="annual-methodology"><summary>관측 방법과 한계</summary><p>프로필의 automatic은 텍스트의 자동 관측, unknown은 텍스트 미확인, unmeasured는 작업량 미측정입니다. 읽기량은 원문 발문·지문·보기·텍스트 선택지의 공백 제외 글자 수이며 해설과 분류 설명은 세지 않습니다. 그림 속 글자·수식과 추출되지 않은 선택지는 빠질 수 있으므로 선택지 미확인 비중을 함께 봅니다.</p><p>조건 표지는 다만·단,·만약·경우·조건·적어도·많아야·오직·반드시·이상·이하·미만·초과·글머리표를 셉니다. 수리 신호는 숫자와 수식 기호의 출현, 논증 신호는 기존 유형과 표현을 보여줍니다. 독립 조건 수, 상호작용, 필수 연산, 추론 깊이, 시각 복잡성은 미측정이며 사람이 검토해야 합니다. 총점이나 난이도 등급으로 합산하지 않습니다.</p><p>정답률의 미확보 값은 비워 두며 상한값을 정확한 정답률로 바꾸지 않습니다. 연결한 일부 문항으로 나머지 문항이나 회차의 난이도를 추정하지 않습니다. 출처 확인일: ${escape(content.accessedAt||'미기록')}.</p></details></div>`;
}
