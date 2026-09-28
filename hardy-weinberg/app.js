"use strict";
const app=document.querySelector("#app");
const TOTAL=10;
const LEVELS={
  easy:{seconds:25,types:["carrierRatio","carrierP","recessiveQ","blackWhite","carrierAlt","oppositeCarrier","dominantHetero"]},
  medium:{seconds:20,types:["excludeAA","carrierDivision","carrierRatio","blackWhite","cross","dominantHetero","countAllele","phenotypeRatio","carrierAlt"]},
  hard:{seconds:15,types:["hidden","excludeHetero","cross","carrierDivision","merged","excludeAA","countAllele","xMixed","twoTrait","crossRecessive"]}
};
let state={view:"home",level:null,round:0,questions:[],results:[],deadline:0,ticker:null,advanceTimer:null,flashTimer:null,feedback:false,started:0,guideFilter:"all",audio:null};
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a)||1;
const F=(n,d=1)=>{if(d<0){n=-n;d=-d}const g=gcd(n,d);return{n:n/g,d:d/g}};
const add=(a,b)=>F(a.n*b.d+b.n*a.d,a.d*b.d);
const sub=(a,b)=>F(a.n*b.d-b.n*a.d,a.d*b.d);
const mul=(a,b)=>F(a.n*b.n,a.d*b.d);
const div=(a,b)=>F(a.n*b.d,a.d*b.n);
const one=F(1);
const fmt=a=>a.d===1?String(a.n):a.n+"/"+a.d;
const fraction=a=>a.d===1?String(a.n):'<span class="frac" role="img" aria-label="'+fmt(a)+'"><span class="num">'+a.n+'</span><span class="den">'+a.d+'</span></span>';
const fracText=(n,d)=>'<span class="frac" role="img" aria-label="'+n+'/'+d+'"><span class="num">'+n+'</span><span class="den">'+d+'</span></span>';
const ratio=a=>{let [x,y,z]=a,g=gcd(gcd(x,y),z);return [x/g,y/g,z/g].join(":")};
const parseFrac=s=>{let m=s.trim().match(/^(\d+)(?:\s*\/\s*(\d+))?$/);return m&&Number.isSafeInteger(Number(m[1]))&&Number.isSafeInteger(Number(m[2]||1))&&Number(m[2]||1)>0?F(Number(m[1]),Number(m[2]||1)):null};
const parseRatio=s=>{let m=s.trim().match(/^(\d+)\s*:\s*(\d+)\s*:\s*(\d+)$/);return m&&m.slice(1).every(v=>Number.isSafeInteger(Number(v)))?m.slice(1).map(Number):null};
const sameRatio=(a,b)=>a&&a[0]>0&&a.every((x,i)=>x*b[0]===b[i]*a[0]);
const shuffle=a=>{let b=[...a];for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
// 2~10분모의 0과 1 사이 기약분수 31개 × 모든 유형을 미리 문항으로 만든다.
const PVALUES=Array.from({length:9},(_,i)=>i+2).flatMap(d=>Array.from({length:d-1},(_,i)=>i+1).filter(n=>gcd(n,d)===1).map(n=>[n,d]));
const ALL_TYPES=[...new Set(Object.values(LEVELS).flatMap(level=>level.types))];
const QUESTION_BANK=PVALUES.flatMap(pair=>ALL_TYPES.map(type=>makeQuestion(type,pair)));
const nav=(name)=>{const keepFlash=name==="game"&&state.view==="game"&&state.feedback;clearInterval(state.ticker);clearTimeout(state.advanceTimer);if(!keepFlash){clearTimeout(state.flashTimer);state.flashTimer=null;document.querySelector("#flash-layer")?.remove()}state.ticker=null;state.advanceTimer=null;state.view=name;state.feedback=false;window.scrollTo(0,0);render()};
function makeQuestion(type, pair){
  let p=F(pair[0],pair[1]),q=sub(one,p),r=div(one,add(one,q)),qCarrier=div(q,add(one,q)),qWithoutAA=div(one,add(one,p));
  let counts=[p.n*p.n,2*p.n*(p.d-p.n),(p.d-p.n)**2],gr=ratio(counts);
  let c={type,p,q,context:"한 쌍의 상염색체 대립유전자 A와 A′가 있다. 집단은 하디·바인베르크 평형이며, p=A의 빈도, q=A′의 빈도이다. p+q=1.",kind:"fraction",hint:"분수 형식으로 입력 · 예: 3/5"};
  switch(type){
    case "carrierAlt":
      return {...c,prompt:"A를 가진 개체를 합쳐서 구한 A′의 빈도는 "+fraction(qCarrier)+"이다.",ask:"전체 집단에서 A의 빈도 p는?",answer:p};
    case "oppositeCarrier":{
      let v=div(one,add(one,p));
      return {...c,prompt:"A′를 가진 개체를 합쳐서 구한 A′의 빈도는 "+fraction(v)+"이다.",ask:"전체 집단에서 A′의 빈도 q는?",answer:q}}
    case "dominantHetero":{
      let v=div(mul(F(2),q),add(one,q));
      return {...c,context:"검은색 몸 A는 흰색 몸 A′에 대해 완전 우성이다. 집단은 하디·바인베르크 평형이다.",
        prompt:"검은색 몸 개체 중 유전자형이 AA′인 개체의 비율은 "+fraction(v)+"이다.",ask:"전체 집단에서 A의 빈도 p는?",answer:p}}
    case "countAllele":{
      let v=div(add(one,q),F(2));
      return {...c,context:"검은색 몸 A는 흰색 몸 A′에 대해 완전 우성이다. 집단은 하디·바인베르크 평형이다.",
        prompt:fracText("검은색 몸 개체 수","검은색 몸 대립유전자 A의 총수")+" = "+fraction(v)+"이다.",ask:"전체 집단에서 A의 빈도 p는?",answer:p}}
    case "phenotypeRatio":{
      let v=div(sub(one,mul(q,q)),mul(q,q));
      return {...c,context:"검은색 몸 A는 흰색 몸 A′에 대해 완전 우성이다. 집단은 하디·바인베르크 평형이다.",
        prompt:fracText("검은색 몸 개체 수","흰색 몸 개체 수")+" = "+fraction(v)+"이다.",ask:"전체 집단에서 A의 빈도 p는?",answer:p}}
    case "carrierRatio":
      return {...c,prompt:"A를 가진 개체를 합쳐서 구한 A의 빈도는 "+fraction(r)+"이다.",ask:"AA : AA′ : A′A′의 개체 수 비율은?",kind:"ratio",hint:"세 수를 콜론으로 구분 · 예: 1:4:4",answer:gr,
        explain:"A 보유 집단은 AA와 AA′이다. 전체에서 p = "+fraction(p)+", q = "+fraction(q)+"이므로 p² : 2pq : q² = <strong>"+gr+"</strong>. 특히 조건이 3/5이면 AA : AA′ = 1 : 4다."};
    case "carrierP":
      return {...c,prompt:"A를 가진 개체를 합쳐서 구한 A의 빈도는 "+fraction(r)+"이다.",ask:"전체 집단에서 A의 빈도 p는?",answer:p,
        explain:"선택한 개체들의 A 수는 2AA+AA′, 전체 대립유전자 수는 2(AA+AA′). 따라서 A의 조건부 빈도 = 1/(1+q) = "+fraction(r)+". q = "+fraction(q)+"이고 p = 1−q = <strong>"+fraction(p)+"</strong>."};
    case "recessiveQ":{
      let recessive=mul(q,q);
      return {...c,prompt:"A가 A′에 대해 완전 우성이다. 열성 표현형 개체의 비율은 "+fraction(recessive)+"이다.",ask:"전체 집단에서 A′의 빈도 q는?",answer:q,
        explain:"열성 표현형은 A′A′만 해당하므로 q² = "+fraction(recessive)+". 양의 제곱근을 취하면 q = <strong>"+fraction(q)+"</strong>."}}
    case "blackWhite":
      return {...c,context:"검은색 몸 A는 흰색 몸 A′에 대해 완전 우성이다. 집단은 하디·바인베르크 평형이다.",prompt:"검은색 몸 개체를 합쳐서 구한 흰색 몸 대립유전자 A′의 빈도는 "+fraction(qCarrier)+"이다.",ask:"전체 집단에서 A의 빈도 p는?",answer:p,
        explain:"검은색 몸 집단은 AA와 AA′이다. A′는 AA′에만 1개 있으므로 조건부 빈도 = q/(1+q) = "+fraction(qCarrier)+". q = "+fraction(q)+", p = <strong>"+fraction(p)+"</strong>."};
    case "excludeAA":
      return {...c,prompt:"유전자형이 AA인 개체를 제외하고 구한 A′의 빈도는 "+fraction(qWithoutAA)+"이다.",ask:"원래 전체 집단에서 A′의 빈도 q는?",answer:q,
        explain:"남는 개체는 AA′와 A′A′이다. A′의 빈도 = (2pq+2q²)/[2(2pq+q²)] = 1/(1+p) = "+fraction(qWithoutAA)+". p = "+fraction(p)+"이므로 q = <strong>"+fraction(q)+"</strong>."};
    case "carrierDivision":{
      let d=div(add(one,p),add(one,q));
      return {...c,prompt:fracText("A를 가진 개체를 합쳐서 구한 A의 빈도","A′를 가진 개체를 합쳐서 구한 A′의 빈도")+" = "+fraction(d)+"이다.",ask:"전체 집단에서 A의 빈도 p는?",answer:p,
        explain:"위쪽은 1/(1+q), 아래쪽은 1/(1+p)이다. 따라서 전체 분수 = (1+p)/(1+q) = "+fraction(d)+". p+q=1을 함께 적용하면 p = <strong>"+fraction(p)+"</strong>."}}
    case "cross":{
      let black=sub(one,div(q,mul(F(2),add(one,q))));
      return {...c,context:"검은색 몸 A는 흰색 몸 A′에 대해 완전 우성이다. 암수의 유전자형 빈도는 동일하고, 집단은 하디·바인베르크 평형이다.",
        prompt:"A를 가진 수컷을 합쳐서 구한 A의 빈도는 "+fraction(r)+"이다. 이 집단에서 임의의 검은색 몸 수컷과 AA′ 암컷을 교배한다.",
        ask:"자손이 검은색 몸일 확률은?",answer:black,
        explain:"수컷의 A′ 생식세포 확률은 q/(1+q) = "+fraction(qCarrier)+"이고, AA′ 암컷의 A′ 확률은 1/2이다. 흰색 몸 확률을 1에서 빼면 <strong>"+fraction(black)+"</strong>."}}
    case "crossRecessive":{
      let white=div(q,mul(F(2),add(one,q)));
      return {...c,context:"검은색 몸 A는 흰색 몸 A′에 대해 완전 우성이다. 암수의 유전자형 빈도는 동일하고, 집단은 하디·바인베르크 평형이다.",
        prompt:"A를 가진 수컷을 합쳐서 구한 A의 빈도는 "+fraction(r)+"이다. 임의의 검은색 몸 수컷과 AA′ 암컷을 교배한다.",
        ask:"자손이 흰색 몸일 확률은?",answer:white}}
    case "hidden":
      return {...c,prompt:"㉠은 ‘A를 가진 개체’ 또는 ‘A′를 가진 개체’ 중 하나이다. ㉠을 가진 개체를 합쳐서 구한 A의 빈도는 "+fraction(r)+"이다.",ask:"전체 집단에서 A의 빈도 p는?",answer:p,
        explain:"제시된 값은 1/2보다 크다. A′ 보유 집단에서 A의 빈도는 p/(1+p)로 1/2 미만이므로 ㉠은 A이다. 1/(1+q) = "+fraction(r)+"에서 q = "+fraction(q)+", 따라서 p = <strong>"+fraction(p)+"</strong>."};
    case "excludeHetero":{
      let val=div(mul(q,q),add(mul(p,p),mul(q,q)));
      return {...c,prompt:"AA′ 개체를 모두 제외하고 구한 A′의 빈도는 "+fraction(val)+"이다.",ask:"원래 전체 집단의 AA : AA′ : A′A′ 비율은?",kind:"ratio",hint:"세 수를 콜론으로 구분 · 예: 1:4:4",answer:gr,
        explain:"남은 집단은 AA와 A′A′이므로 조건부 A′ 빈도 = A′A′/(AA+A′A′) = q²/(p²+q²). 조건으로 p = "+fraction(p)+", q = "+fraction(q)+"를 구한다. 원래 집단의 비율은 <strong>"+gr+"</strong>."}}
    case "merged":{
      let other=F(1,2),weighted=div(add(mul(F(2),p),other),F(3));
      return {...c,context:"서로 다른 두 집단 Ⅰ과 Ⅱ는 각각 하디·바인베르크 평형이다. Ⅰ의 개체 수는 Ⅱ의 2배이며, Ⅱ의 A 빈도는 1/2이다.",prompt:"Ⅰ에서 A를 가진 개체를 합쳐서 구한 A의 빈도는 "+fraction(r)+"이다.",ask:"Ⅰ과 Ⅱ의 모든 개체를 합친 A의 빈도는?",answer:weighted,
        explain:"Ⅰ의 A 빈도는 p = "+fraction(p)+"이다. 개체 수를 2N, N으로 두고 대립유전자 수로 가중 평균하면 (2p+1/2)/3 = <strong>"+fraction(weighted)+"</strong>. 합친 집단의 유전자형을 곧바로 p²:2pq:q²로 놓을 수는 없다."}}
    case "xMixed":{
      let combined=div(add(mul(F(2),p),F(1,2)),F(3));
      return {...c,context:"X 염색체의 A/A′ 형질이다. 암컷과 수컷은 각각 N명이고, 암컷 집단은 평형이다. 수컷의 A 빈도는 1/2이다.",
        prompt:"암컷 중 A를 가진 개체를 합쳐서 구한 A의 빈도는 "+fraction(r)+"이다.",ask:"암수의 X 염색체를 모두 합쳐서 구한 A의 빈도는?",answer:combined}}
    case "twoTrait":{
      let both=mul(sub(one,mul(q,q)),F(3,4));
      return {...c,context:"A/A′와 B/B′는 서로 다른 상염색체에 있고 독립적으로 유전된다. A와 B는 각각 완전 우성이며, 집단은 두 형질 모두 평형이다. B의 빈도는 1/2이다.",
        prompt:"A를 가진 개체를 합쳐서 구한 A의 빈도는 "+fraction(r)+"이다. 이 집단의 임의의 두 개체가 교배한다.",
        ask:"자손이 A의 우성 표현형과 B의 우성 표현형을 모두 나타낼 확률은?",answer:both}}
  }
}
function makeSet(level){
  const types=shuffle(LEVELS[level].types),pool=shuffle(QUESTION_BANK.filter(q=>types.includes(q.type)));
  const chosen=[],usedFractions=new Set();
  // 가능한 유형을 한 번씩 고른 후, 남는 칸은 은행 전체에서 고른다.
  for(const type of types){
    const item=pool.find(q=>q.type===type&&!usedFractions.has(fmt(q.p)));
    if(!item)continue;
    chosen.push(item);usedFractions.add(fmt(item.p));
  }
  for(const item of pool){
    if(chosen.length===TOTAL)break;
    if(usedFractions.has(fmt(item.p)))continue;
    chosen.push(item);usedFractions.add(fmt(item.p));
  }
  return shuffle(chosen);
}
function home(){
  return '<section class="home-intro"><div class="eyebrow">HARDY–WEINBERG · FRACTION PRACTICE</div><h1 class="page-title">하디-바인베르크 법칙<br>조건 해석</h1><div class="base-equation"><span>p + q = 1</span><span aria-hidden="true">·</span><span>AA : AA′ : A′A′ = p² : 2pq : q²</span></div></section><section class="menu-grid" aria-label="메인 메뉴"><button class="menu-card" data-view="how"><span class="menu-icon">?</span><span class="menu-title">HOW TO PLAY</span><span class="menu-desc">게임 진행 방식과 조작 방법</span><span class="menu-arrow" aria-hidden="true">↗</span></button><button class="menu-card primary" data-view="levels"><span class="menu-icon">▶</span><span class="menu-title">시작하기</span><span class="menu-desc">easy · medium · hard<br>난이도 선택</span><span class="menu-arrow" aria-hidden="true">→</span></button><button class="menu-card" data-view="guide"><span class="menu-icon concept-mark">p²</span><span class="menu-title">개념 설명</span><span class="menu-desc">분수의 분모부터 살펴보고<br>수식·개체 수로 해석하기</span><span class="menu-arrow" aria-hidden="true">↗</span></button></section>';
}
function levels(){
  return '<div class="page-top"><button class="back-link" data-view="home">← 첫 화면</button><div class="eyebrow">CHOOSE LEVEL</div><h1 class="page-title">난이도 선택</h1><p class="lead">한 판 10문항. 각 문항을 제한 시간 안에 풀어 보세요.<br>정오답을 확인하면 곧바로 다음 문제가 나옵니다.</p></div><section class="difficulty-grid" aria-label="난이도">'+
    [["easy","기본 조건 · 유전자 빈도와 유전자형 비율"],["medium","제외 조건 · 두 조건의 분수와 교배"],["hard","숨긴 기호 · X 염색체와 집단 합치기"]].map(([key,desc])=>'<button class="panel difficulty" data-level="'+key+'"><span class="eyebrow">LEVEL</span><span class="level">'+key+'</span><span class="seconds">문항당 '+LEVELS[key].seconds+'초</span><p>'+desc+'</p><span class="pick">이 난이도로 시작 →</span></button>').join("")+
    '</section><p class="panel rule-note"><strong>입력 방법</strong> 분수는 <span class="mono">3/5</span>, 세 유전자형의 비율은 <span class="mono">1:4:4</span>처럼 쓰세요. 동치 답도 정답입니다. Enter로 제출하거나 다음 문제로 바로 넘어갈 수 있습니다.</p>';
}
function game(){
  let q=state.questions[state.round],sec=LEVELS[state.level].seconds;
  return '<div class="page-top compact"><button class="back-link" data-view="levels">← 난이도 선택</button><div class="eyebrow">'+state.level+' · QUICK PRACTICE</div><h1 class="page-title">조건을 해석하세요</h1></div><section class="game-frame"><div class="game-top"><span class="counter">문항 <strong>'+(state.round+1)+'</strong> / '+TOTAL+' &nbsp;·&nbsp; 정답 <strong>'+state.results.filter(r=>r.correct).length+'</strong>개</span><span class="timer" id="timer" aria-label="남은 시간">00:'+String(sec).padStart(2,"0")+'</span></div><div class="progress-track" aria-hidden="true"><div class="progress-fill" id="progress-fill" style="width:100%"></div></div><article class="panel question-panel"><div class="question-label">QUESTION '+String(state.round+1).padStart(2,"0")+'</div><p class="question-context">'+q.context+'</p><h2 class="question-prompt">'+q.prompt+'</h2><p class="question-ask">'+q.ask+'</p><form id="answer-form" autocomplete="off"><label class="small muted" for="answer">정답 입력</label><div class="answer-row"><input id="answer" class="answer-input mono" inputmode="text" spellcheck="false" aria-describedby="answer-hint validation" placeholder="'+(q.kind==="ratio"?"1:4:4":"3/5")+'" required><button class="btn primary" type="submit">제출 · Enter</button></div><p id="answer-hint" class="input-hint">'+q.hint+' · Enter로 바로 다음 문제</p><p id="validation" class="validation" role="alert"></p></form><div id="feedback-slot" aria-live="assertive"></div></article><button class="quit" data-view="levels">게임 종료</button></section>';
}
function result(){
  let count=state.results.filter(x=>x.correct).length,elapsed=Math.round((Date.now()-state.started)/1000);
  return '<section class="panel result"><div class="eyebrow">'+state.level+' · RESULT</div><h1 class="page-title">연습 결과</h1><div class="result-big">'+count+'<small> / '+TOTAL+'</small></div><p class="lead" style="margin:18px auto 0">제한 시간 안에 맞힌 문항 수입니다.</p><div class="result-stats"><div><strong>'+state.results.filter(x=>x.timedOut).length+'</strong>시간 초과</div><div><strong>'+elapsed+'초</strong>총 소요 시간</div></div><div class="result-actions"><button class="btn primary" data-retry>같은 난이도 다시 하기</button><button class="btn" data-view="guide">개념 설명 보기</button><button class="btn" data-view="home">첫 화면</button></div></section>';
}
const CARD_DATA=[
 {cat:"기본",title:"A 보유 개체의 A 빈도",condition:"A를 가진 개체를 합쳐서 구한 A의 빈도 = "+fracText("3","5"),formula:"(2p²+2pq) / [2(p²+2pq)] = 1/(1+q). 3/5라면 q=2/3, p=1/3.",count:"선택한 AA=x, AA′=y라 두면 (2x+y)/2(x+y)=3/5. 따라서 y=4x, 즉 AA:AA′=1:4. 평형을 적용하면 AA:AA′:A′A′=1:4:4."},
 {cat:"기본",title:"A 보유 개체의 A′ 빈도",condition:"A를 가진 개체를 합쳐서 구한 A′의 빈도",formula:"2pq/[2(p²+2pq)] = q/(1+q). A 빈도와 더하면 1.",count:"A 보유 개체 AA=x, AA′=y에서 A′는 AA′에 하나씩만 있다. 따라서 y/[2(x+y)]. 예를 들어 1:4라면 4/[2(1+4)] = 2/5."},
 {cat:"기본",title:"A′ 보유 개체의 A′ 빈도",condition:"A′를 가진 개체를 합쳐서 구한 A′의 빈도",formula:"(2pq+2q²)/[2(2pq+q²)] = 1/(1+p).",count:"A′ 보유 개체 AA′=y, A′A′=z라 두고 (y+2z)/[2(y+z)]를 계산한다. 예를 들어 y:z=4:1이면 6/10=3/5."},
 {cat:"기본",title:"열성 표현형의 비율",condition:"흰색 몸 개체의 비율 (A가 완전 우성일 때)",formula:"흰색 몸은 A′A′만 해당하므로 q². 흰색 몸이 4/9라면 q=2/3.",count:"전체 개체를 9칸으로 놓으면 AA:AA′:A′A′=1:4:4이고, 흰색 몸은 9칸 중 4칸이다. 이 비율을 바로 쓰려면 원래 집단이 평형이라는 조건이 필요하다."},
 {cat:"기본",title:"우성 표현형 안의 유전자형",condition:fracText("AA′ 개체 수","검은색 몸 개체 수")+" (A가 완전 우성)",formula:"2pq/(p²+2pq) = 2q/(1+q). 반대로 AA/검은색 몸 = p/(1+q).",count:"검은색 몸은 AA와 AA′. 예를 들어 AA:AA′=1:4라면 그 안의 AA′ 비율은 4/(1+4)=4/5."},
 {cat:"기본",title:"개체 수와 대립유전자 수",condition:fracText("검은색 몸 개체 수","검은색 몸 대립유전자 A의 수"),formula:"(p²+2pq)/(2p²+2pq) = (1+q)/2. 분자는 개체 수, 분모는 A 사본 수라 단위가 다르다.",count:"AA=x, AA′=y이면 개체 수 x+y, A 사본 수 2x+y. 예: 1:4:4에서는 5/6. 전체 개체 수 N을 곱해도 약분된다."},
 {cat:"기본",title:"우성 개체 수와 열성 개체 수",condition:fracText("검은색 몸 개체 수","흰색 몸 개체 수")+" (A가 완전 우성)",formula:"(p²+2pq)/q² = (1−q²)/q².",count:"AA=x, AA′=y, A′A′=z이면 (x+y)/z. 예: 1:4:4에서는 (1+4)/4=5/4."},
 {cat:"제외",title:"AA를 뺀 뒤의 A′ 빈도",condition:"AA인 개체를 제외한 개체 중 A′의 빈도",formula:"(2pq+2q²)/[2(2pq+q²)] = 1/(1+p). 제외 후의 집단에 p²:2pq:q²를 다시 적용하지 않는다.",count:"남은 AA′=y, A′A′=z이면 A′ 수는 y+2z, 전체 대립유전자는 2(y+z). 예: 원래 1:4:4 → (4+8)/[2(4+4)]=3/4."},
 {cat:"제외",title:"AA′를 뺀 뒤의 A′ 빈도",condition:"AA′인 개체를 제외한 개체 중 A′의 빈도",formula:"2q²/[2(p²+q²)] = q²/(p²+q²).",count:"AA=x, A′A′=z만 남는다. A′ 빈도 = z/(x+z). 예: 원래 1:4:4 → 4/(1+4)=4/5."},
 {cat:"제외",title:"일부 개체 수를 더 빼기",condition:"검은색 몸 개체 중 k개를 제외하고 구한 A의 빈도",formula:"제외하기 전 A의 수 S, 개체 수 M에서 빼는 k명의 유전자형별 A 수를 T라 하면 (S−T)/[2(M−k)]. k명에 AA/AA′가 몇 명인지 알아야 한다.",count:"개체 수 표에서 AA, AA′, A′A′를 먼저 적고, 해당 칸의 인원과 A 사본 수를 각각 뺀다. 제외된 집단은 보통 평형 집단이 아니다."},
 {cat:"비교",title:"두 조건부 빈도의 몫",condition:fracText("A 보유 집단의 A 빈도","A′ 보유 집단의 A′ 빈도"),formula:"[1/(1+q)] ÷ [1/(1+p)] = (1+p)/(1+q). 큰 분수의 분자·분모를 각각 구한다.",count:"예: AA:AA′:A′A′=1:4:4 → 위쪽 6/10=3/5, 아래쪽 (4+8)/16=3/4. 두 값을 나누면 4/5."},
 {cat:"교배",title:"보유 개체 × 이형접합 개체",condition:"임의의 검은색 몸 수컷 × AA′ 암컷 → 검은색 몸 자손",formula:"수컷 A′ 생식세포 확률 q/(1+q). 자손 A′A′ 확률 q/[2(1+q)]. 검은색 몸 확률 = 1−q/[2(1+q)].",count:"예: 검은색 몸 수컷 AA:AA′=1:4. 수컷이 A′를 주는 확률은 (4/5)×(1/2)=2/5. 암컷은 1/2이므로 흰색 몸 1/5, 검은색 몸 4/5."},
 {cat:"집단",title:"두 집단을 모두 합치기",condition:"Ⅰ과 Ⅱ를 모두 합쳐서 구한 A의 빈도",formula:"(N₁p₁+N₂p₂)/(N₁+N₂). 각 집단이 평형이어도 합친 집단은 일반적으로 곧바로 평형이라고 볼 수 없다.",count:"Ⅰ 200명에서 A 빈도 1/4, Ⅱ 100명에서 A 빈도 1/2이면 A 사본 수는 100개+100개, 전체 사본 수 600개. 답은 1/3."},
 {cat:"특수",title:"㉠·우열 관계 숨기기",condition:"㉠을 가진 개체에서 A의 빈도 = "+fracText("3","5")+"; ㉠은 A 또는 A′",formula:"㉠=A라면 1/(1+q)>1/2; ㉠=A′라면 p/(1+p)<1/2 (0<p,q<1). 3/5이므로 ㉠=A.",count:"㉠=A′이면 선택 개체는 AA′와 A′A′이며 A는 이형접합에만 1개씩이라 절반을 넘을 수 없다. 3/5은 절반 초과라 ㉠=A."},
 {cat:"특수",title:"X 염색체 형질",condition:"암컷·수컷을 합쳐서 구한 X 연관 대립유전자 빈도",formula:"(2N♀p♀+N♂p♂)/(2N♀+N♂). 수컷 XY는 해당 X 대립유전자 사본이 1개다.",count:"암컷 100명, 수컷 100명이면 X 사본은 각각 200개와 100개. 각각의 대립유전자 수를 세어 300개를 분모로 쓴다. 상염색체의 2(N♀+N♂)와 다르다."},
 {cat:"특수",title:"두 독립 형질의 동시 발현",condition:"검은색 몸이면서 긴 날개인 자손의 확률",formula:"독립적으로 유전된다는 조건이 있으면 P(검은 몸)×P(긴 날개). 연관 여부가 불명확하면 단순히 곱하지 않는다.",count:"각 형질의 부모 생식세포 조합을 따로 표로 세어 확률을 구한 다음, 독립성이 확인될 때 두 확률을 곱한다."}
];
// 안내 문장의 수학 표기를 위아래 분수로 바꾼다.
const mathPart="(?:\\[[^\\]]+\\]|\\d+\\([^()]*\\)|\\([^()]*\\)|\\d+|\\d*[\\p{L}₀-₉♀♂′²][\\p{L}\\p{N}₀-₉♀♂′²]*)";
const mathFractionPattern=new RegExp("("+mathPart+")\\s*\\/\\s*("+mathPart+")","gu");
const typesetMath=s=>s.replace(mathFractionPattern,(_,a,b)=>{
  const unwrap=x=>x.startsWith("[")||x.startsWith("(")?x.slice(1,-1):x;
  return fracText(unwrap(a),unwrap(b));
});
function guide(){
  let filters=["all","기본","제외","비교","교배","집단","특수"],cards=CARD_DATA.filter(c=>state.guideFilter==="all"||c.cat===state.guideFilter);
  return '<div class="page-top"><button class="back-link" data-view="home">← 첫 화면</button><div class="eyebrow">CONCEPT NOTES</div><h1 class="page-title">개념 설명</h1><p class="lead guide-intro">첨부한 28문항의 분수 조건을 유형별로 묶었습니다.<br>어떤 개체가 분모에 들어가는지 확인한 다음 대립유전자 수를 세어 보세요.</p></div><div class="panel guide-foundation"><div class="eyebrow">기본 약속</div><p class="formula-row">p = A의 빈도 · q = A′의 빈도 · p+q=1</p><p class="formula-row">AA : AA′ : A′A′ = p² : 2pq : q²</p><ol class="concept-steps"><li><strong>분모 먼저:</strong> 조건에 따라 모은 개체가 몇 명인지 확인합니다.</li><li><strong>분자 다음:</strong> 그 개체들이 가진 A 또는 A′의 사본을 셉니다. 상염색체 개체 한 명은 사본 2개를 가집니다.</li><li><strong>마지막으로:</strong> 원래 집단이 평형일 때만 p² : 2pq : q²를 적용합니다. 일부를 제외한 뒤에는 남은 인원을 그대로 세세요.</li></ol></div><div class="tabs" aria-label="조건 유형">'+filters.map(x=>'<button class="tab" aria-pressed="'+(x===state.guideFilter)+'" data-filter="'+x+'">'+(x==="all"?"전체":x)+'</button>').join("")+'</div><div class="guide-grid">'+cards.map(c=>'<article class="panel guide-card"><div class="eyebrow">'+c.cat+'</div><h2>'+c.title+'</h2><div class="condition">'+c.condition+'</div><div class="method"><b>① 수식으로 해석</b><p>'+typesetMath(c.formula)+'</p></div><div class="method"><b>② 개체 수 비율로 해석</b><p class="example">'+typesetMath(c.count)+'</p></div></article>').join("")+'</div><div class="panel guide-warning"><strong>꼭 확인하세요</strong><br>우열 관계, 암수의 X 염색체 사본 수, 집단을 제외하거나 합친 뒤의 평형 여부에 따라 분모가 달라집니다.</div>';
}
function how(){
  const items=[
    {img:"home-v5",title:"1. 첫 화면에서 메뉴 선택",text:"시작하기는 게임으로, 개념 설명은 분수 조건을 읽는 법으로 이동합니다.",bullets:["HOW TO PLAY → 게임 조작 안내","개념 설명 → 수식과 개체 수로 각각 풀이"]},
    {img:"levels-v5",title:"2. 난이도 고르기",text:"easy, medium, hard 중 하나를 누르면 10문항이 시작됩니다. 한 문항의 제한 시간은 각각 25초, 20초, 15초입니다.",bullets:["문항 은행에는 31개 기약분수와 18개 조건 유형이 들어 있습니다.","한 판에는 그중 10문항을 골라 제시합니다."]},
    {img:"game-v5",title:"3. 입력하고 Enter 누르기",text:"조건을 보고 답을 입력한 뒤 Enter를 누르면 제출됩니다. 상단에서 남은 시간을 확인하세요.",bullets:["분수는 3/5, 비율은 1:4:4처럼 입력","제한 시간이 지나면 자동 오답"]},
    {img:"feedback-v6",title:"4. 정답 확인, 바로 다음 문제",text:"정답을 맞히면 카드 바깥 배경이 초록색으로, 틀리면 붉은색으로 1초 동안 부드럽게 변하며 효과음이 재생됩니다.",bullets:["틀렸을 때에는 문제 카드 아래에 원래 정답만 잠깐 표시합니다.","Enter로 즉시 넘어가거나, 잠시 기다리면 자동으로 다음 문제가 나옵니다."]}
  ];
  return '<div class="page-top"><button class="back-link" data-view="home">← 첫 화면</button><div class="eyebrow">How to play</div><h1 class="page-title">게임 진행 방법</h1><p class="lead">아래는 실제 화면을 캡처한 안내입니다. 민트색 숫자로 각 단계의 화면을 표시했습니다.</p></div><div class="how-grid">'+items.map((x,i)=>'<article class="panel how-step"><div class="shot-wrap"><img src="./assets/howto-'+x.img+'.jpg" alt="'+x.title+' 화면 캡처" loading="lazy"><span class="shot-label" aria-hidden="true">'+(i+1)+'</span></div><div><h2>'+x.title+'</h2><p>'+x.text+'</p><ul>'+x.bullets.map(y=>'<li>'+y+'</li>').join("")+'</ul></div></article>').join("")+'</div>';
}
function render(){
  document.body.classList.toggle("is-home",state.view==="home");
  app.innerHTML=({home,levels,game,result,guide,how})[state.view]();
  if(state.view==="game"){
    state.deadline=Date.now()+LEVELS[state.level].seconds*1000;
    updateTimer();
    state.ticker=setInterval(updateTimer,100);
    document.querySelector("#answer").focus({preventScroll:true});
  }
}
function updateTimer(){
  if(state.view!=="game"||state.feedback)return;
  const remain=Math.max(0,state.deadline-Date.now()),sec=Math.ceil(remain/1000),label=document.querySelector("#timer"),bar=document.querySelector("#progress-fill");
  if(!label||!bar)return;
  label.textContent="00:"+String(sec).padStart(2,"0");
  label.classList.toggle("urgent",sec<=7&&sec>0);label.classList.toggle("expired",sec===0);
  bar.style.width=(100*remain/(LEVELS[state.level].seconds*1000))+"%";
  if(remain<=0)complete(false,true);
}
function prepareAudio(){
  try{
    const Context=window.AudioContext||window.webkitAudioContext;
    if(!Context)return;
    state.audio ||= new Context();
    state.audio.resume().catch(()=>{});
  }catch{}
}
function playSound(correct){
  const ctx=state.audio;
  if(!ctx||ctx.state!=="running")return;
  const notes=correct?[[660,0,.10],[830,.11,.10],[1045,.22,.19]]:[[190,0,.28],[145,.13,.29]];
  for(const [frequency,delay,duration] of notes){
    const osc=ctx.createOscillator(),gain=ctx.createGain(),when=ctx.currentTime+delay;
    osc.type=correct?"sine":"sawtooth";osc.frequency.setValueAtTime(frequency,when);
    gain.gain.setValueAtTime(.0001,when);
    gain.gain.exponentialRampToValueAtTime(correct?.10:.075,when+.018);
    gain.gain.exponentialRampToValueAtTime(.0001,when+duration);
    osc.connect(gain);gain.connect(ctx.destination);osc.start(when);osc.stop(when+duration+.01);
  }
}
function showFlash(correct){
  clearTimeout(state.flashTimer);
  document.querySelector("#flash-layer")?.remove();
  const layer=document.createElement("div");
  layer.id="flash-layer";layer.className=correct?"flash-correct":"flash-wrong";
  document.body.append(layer);
  state.flashTimer=setTimeout(()=>{layer.remove();state.flashTimer=null},1000);
}
function advance(){
  if(state.view!=="game"||!state.feedback)return;
  clearTimeout(state.advanceTimer);state.advanceTimer=null;
  state.round++;
  nav(state.round>=TOTAL?"result":"game");
}
function complete(correct,timedOut=false){
  if(state.feedback)return;
  state.feedback=true;clearInterval(state.ticker);state.ticker=null;
  const q=state.questions[state.round],input=document.querySelector("#answer");
  const entered=input.value.trim();
  state.results.push({correct,timedOut,entered});
  input.disabled=true;document.querySelector("#answer-form button").disabled=true;
  const answer=q.kind==="ratio"?'<strong class="mono">'+q.answer+'</strong>':fraction(q.answer);
  document.querySelector("#feedback-slot").innerHTML='<div class="feedback '+(correct?"":"wrong")+'"><span>'+(correct?"정답":timedOut?"시간 초과 · 정답":"정답")+'</span> '+answer+'</div>';
  showFlash(correct);playSound(correct);
  state.advanceTimer=setTimeout(advance,1000);
}
function start(level){prepareAudio();state.level=level;state.round=0;state.results=[];state.questions=makeSet(level);state.started=Date.now();nav("game")}
app.addEventListener("click",e=>{
  const v=e.target.closest("[data-view]");if(v){nav(v.dataset.view);return}
  const l=e.target.closest("[data-level]");if(l){start(l.dataset.level);return}
  const f=e.target.closest("[data-filter]");if(f){state.guideFilter=f.dataset.filter;render();return}
  if(e.target.closest("[data-retry]")){start(state.level);return}
});
app.addEventListener("submit",e=>{
  if(e.target.id!=="answer-form")return;e.preventDefault();
  if(state.feedback)return;
  if(Date.now()>=state.deadline){complete(false,true);return}
  let q=state.questions[state.round],raw=document.querySelector("#answer").value.trim(),valid=q.kind==="ratio"?parseRatio(raw):parseFrac(raw);
  if(!valid){document.querySelector("#validation").textContent=q.kind==="ratio"?"예: 1:4:4처럼 세 수를 입력하세요.":"예: 3/5처럼 분수를 입력하세요.";return}
  let correct=q.kind==="ratio"?sameRatio(valid,q.answer.split(":").map(Number)):valid.n===q.answer.n&&valid.d===q.answer.d;
  document.querySelector("#validation").textContent="";
  complete(correct);
});
document.addEventListener("keydown",e=>{
  if(e.key!=="Enter"||e.repeat||state.view!=="game")return;
  if(state.feedback){e.preventDefault();advance();return}
  if(!e.target.closest("#answer-form")){e.preventDefault();document.querySelector("#answer-form")?.requestSubmit()}
});
render();
