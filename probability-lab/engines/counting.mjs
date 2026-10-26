// Exact combinatorics engines. Counts stay as BigInt until chart/display conversion.
const N = (key, label, min, max, help) => ({ key, label, type: 'number', min, max, step: 1, ...(help ? { help } : {}) });
const S = (key, label, options, help) => ({ key, label, type: 'select', options: options.map(([value, label]) => ({ value, label })), ...(help ? { help } : {}) });
const C = (key, label, help) => ({ key, label, type: 'checkbox', ...(help ? { help } : {}) });
const factorial = n => { let v = 1n; for (let k = 2; k <= n; k++) v *= BigInt(k); return v; };
const choose = (n, k) => {
  if (n < 0 || k < 0 || k > n) return 0n;
  k = Math.min(k, n - k);
  let v = 1n;
  for (let j = 1; j <= k; j++) v = v * BigInt(n - j + 1) / BigInt(j);
  return v;
};
const falling = (n, k) => { if (n < k || k < 0) return 0n; let v = 1n; for (let i = 0; i < k; i++) v *= BigInt(n - i); return v; };
const power = (a, n) => BigInt(a) ** BigInt(n);
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const gcdBig = (a, b) => b ? gcdBig(b, a % b) : a;
const multinomial = (a, b, c) => choose(a + b + c, a) * choose(b + c, b);
const fraction = (a, b) => {
  const g = gcdBig(a, b), numerator = a / g, denominator = b / g;
  return { text: denominator === 1n ? `${numerator}` : `${numerator}/${denominator}`, numeric: Number(a) / Number(b) };
};
const comparison = { eq: '정확히', ge: '이상', le: '이하' };
const satisfies = (x, relation, target) => relation === 'eq' ? x === target : relation === 'ge' ? x >= target : x <= target;
const relationText = (target, relation, noun = '') => relation === 'eq' ? `정확히 ${target}${noun}` : `${target}${noun} ${comparison[relation]}`;
const countResult = (question, value, steps, insight, extra = {}) => ({ status: 'ok', question, answer: `${value}`, exact: `${value}`, numeric: Number(value), unit: '가지', steps, insight, ...extra });
const probabilityResult = (question, numerator, denominator, steps, insight, extra = {}) => {
  const f = fraction(numerator, denominator);
  return { status: 'ok', question, answer: f.text, exact: f.text, numeric: f.numeric, unit: '확률', steps, insight, ...extra };
};
const invalid = message => ({ status: 'invalid', question: '입력 조건을 확인하세요.', answer: '계산할 수 없음', numeric: null, unit: '', steps: [
  { title: '입력 확인', body: message },
  { title: '지원 범위', body: '각 입력란의 범위 안에서 정수와 제시된 선택지를 사용합니다.' },
  { title: '다시 계산', body: '입력을 수정하면 문제와 해설이 함께 갱신됩니다.' }
], insight: message, warnings: [message] });
function makeSpec(config, calculate, crossValidate = () => '') {
  return { ...config, solve(input = {}) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) return invalid('입력은 매개변수 객체여야 합니다.');
    const params = { ...config.defaults, ...input };
    for (const control of config.controls) {
      const value = params[control.key];
      if (control.type === 'number' && (typeof value !== 'number' || !Number.isInteger(value) || value < control.min || value > control.max)) return invalid(`${control.label}: ${control.min}부터 ${control.max}까지의 정수를 입력하세요.`);
      if (control.type === 'select' && !control.options.some(option => option.value === value)) return invalid(`${control.label}: 제공된 선택지 중 하나를 선택하세요.`);
      if (control.type === 'checkbox' && typeof value !== 'boolean') return invalid(`${control.label}: 참 또는 거짓이어야 합니다.`);
    }
    const error = crossValidate(params);
    return error ? invalid(error) : calculate(params);
  } };
}

// Number of strings on indexed circular positions with A-A adjacency forbidden.
function indexedCircleApart(a, b, c, originalSize) {
  const n = a + b + c;
  if (n === 1) return a && originalSize > 1 ? 0n : 1n;
  if (!a) return multinomial(a, b, c);
  const others = b + c;
  if (!others || a > others) return 0n;
  return BigInt(n) * choose(others, a) * choose(others, b) / BigInt(others);
}
const arrangement = makeSpec({
  id: 'arrangement', title: '같은 문자의 배열', category: '경우의 수',
  description: '중복 문자와 이웃 조건을 바꾸며 일렬 배열과 원형 배열을 비교합니다.',
  defaults: { a: 3, b: 2, c: 2, condition: 'apart', circular: false },
  controls: [N('a', 'A의 개수', 0, 10), N('b', 'B의 개수', 0, 10), N('c', 'C의 개수', 0, 10),
    S('condition', 'A의 이웃 조건', [['none', '제한 없음'], ['apart', 'A끼리 이웃하지 않음'], ['together', 'A가 한 덩어리']]),
    C('circular', '원형으로 배열', '회전해서 같으면 같은 배열입니다. 뒤집은 배열은 구별합니다. 전체 문자 수는 18 이하입니다.')],
  presets: [{ name: '빈틈에 A 넣기', params: { a: 3, b: 2, c: 2, condition: 'apart', circular: false } },
    { name: '원형의 대칭', params: { a: 2, b: 2, c: 2, condition: 'none', circular: true } },
    { name: '이웃 불가능', params: { a: 5, b: 1, c: 1, condition: 'apart', circular: false } }]
}, ({ a, b, c, condition, circular }) => {
  const n = a + b + c, others = b + c;
  const conditionLabel = { none: '아무런 제한 없이', apart: 'A끼리 이웃하지 않도록', together: '모든 A가 하나의 연속한 덩어리가 되도록' }[condition];
  const question = `문자 A가 ${a}개, B가 ${b}개, C가 ${c}개 있다. 이 문자들을 ${conditionLabel} ${circular ? '원형으로' : '일렬로'} 배열하는 경우의 수는?\n(단, 같은 문자끼리는 서로 구별하지 ${circular ? '않고, 회전하여 일치하는 배열은 같은 것으로 보며, 뒤집어서 일치하는 배열은 다른 것으로 본다.' : '않는다.'})`;
  let value, formula, method, cases;
  if (!n) {
    value = 1n; formula = '빈 배열의 수 = 1'; method = '아무 문자도 놓지 않는 빈 배열을 한 가지로 셉니다.';
  } else if (!circular) {
    if (condition === 'none') {
      value = multinomial(a, b, c); formula = `${n}! / (${a}!·${b}!·${c}!)`; method = '문자를 모두 구별하여 늘어놓은 뒤 같은 문자끼리 바뀌어 중복된 횟수를 나눕니다.';
    } else if (condition === 'apart') {
      value = choose(others, b) * choose(others + 1, a); formula = `C(${others}, ${b}) × C(${others + 1}, ${a})`;
      method = `먼저 B와 C를 ${choose(others, b)}가지로 배열합니다. 양 끝을 포함한 ${others + 1}개의 빈틈 중 ${a}곳에 A를 하나씩 놓습니다.`;
    } else {
      value = a ? factorial(others + 1) / (factorial(b) * factorial(c)) : choose(others, b);
      formula = a ? `${others + 1}! / (${b}!·${c}!)` : `C(${others}, ${b})`;
      method = a ? '모든 A를 하나의 묶음으로 바꾸어 B, C와 함께 배열합니다. A 묶음 내부에는 순서 차이가 없습니다.' : 'A가 없으므로 이웃 조건은 자동으로 만족하고 B와 C만 배열합니다.';
    }
  } else if (condition === 'together') {
    value = !a ? (() => { let sum=0n; for(let s=0;s<n;s++){const repeat=n/gcd(n,s);if(b%repeat===0&&c%repeat===0)sum+=choose(n/repeat,b/repeat);} return sum/BigInt(n); })() : !others ? 1n : choose(others, b);
    formula = a && others ? `${others}! / (${b}!·${c}!)` : a ? '모든 문자가 A인 원형 배열 = 1' : '회전별 고정 배열 수의 합 / 전체 자리 수';
    method = a && others ? '유일한 A 묶음의 시작점을 기준으로 고정합니다. 나머지 B와 C를 시계 방향으로 늘어놓으면 각 원형 배열과 일대일로 대응합니다.' : a ? '모든 문자가 A이므로 회전과 관계없이 하나의 배열만 있습니다.' : 'A가 없으면 B와 C의 원형 중복순열입니다. 회전마다 그대로 유지되는 배열의 수를 평균합니다.';
  } else {
    let sum = 0n;
    cases = [];
    for (let shift = 0; shift < n; shift++) {
      const period = gcd(n, shift), repeat = n / period;
      let fixed = 0n;
      if (a % repeat === 0 && b % repeat === 0 && c % repeat === 0) {
        const aa=a/repeat,bb=b/repeat,cc=c/repeat;
        fixed = condition === 'none' ? multinomial(aa,bb,cc) : indexedCircleApart(aa,bb,cc,n);
      }
      sum += fixed;
      cases.push({ label: `${shift}칸 회전`, count: `${fixed}`, detail: `길이 ${period}의 무늬를 ${repeat}번 반복해야 고정됩니다.` });
    }
    value = sum / BigInt(n); formula = `(${cases.map(row=>row.count).join(' + ')}) / ${n}`;
    method = condition === 'none' ? '회전마다 원래와 일치하는 배열을 셉니다. 한 회전에 고정되려면 짧은 무늬가 반복되어야 하므로 각 문자의 개수도 반복 횟수로 나누어져야 합니다.' : '회전에 고정되는 반복 무늬 중 A가 이웃하지 않는 것만 셉니다. 무늬 안의 A가 u개, 나머지가 v개이면 자리 번호를 붙인 원형 배치는 (u+v)·C(v,u)·C(v,B의 개수)/v가지입니다. 비A 사이의 빈틈을 고르되 시작 위치를 보정한 식입니다. 반복 무늬의 마지막과 처음도 이웃하므로 경계를 함께 확인하며, v=0인 경우와 길이 1인 경우는 직접 셉니다.';
  }
  return countResult(question, value, [
    { title: '같은 배열의 기준', body: circular ? '자리에는 시계 방향 순서만 있고 기준 자리는 없습니다. 회전은 같은 것으로, 거울 대칭은 다른 것으로 봅니다.' : '각 자리는 구별하지만 같은 종류의 문자끼리는 구별하지 않습니다.' },
    { title: circular && condition !== 'together' && n ? '회전 대칭까지 세기' : '조건을 만족하는 배열 세기', body: method, formula },
    { title: '경우의 수 확정', body: circular && condition !== 'together' && n ? `회전별 고정 배열 수를 ${n}으로 나눈 평균이 서로 다른 원형 배열 수입니다. 결과는 ${value}가지입니다.` : `중복을 제거하고 이웃 조건을 반영한 결과는 ${value}가지입니다.`, formula: `경우의 수 = ${value}` }
  ], value === 0n ? '조건을 만족하는 배치가 없으면 경우의 수는 0입니다. 빈틈 수와 A의 개수를 비교해 보세요.' : circular ? '중복 문자가 있는 원형 배열은 일렬 배열 수를 자리 수로 나누는 방법이 항상 성립하지 않습니다. 회전 대칭이 있는 배열을 따로 반영해야 합니다.' : '같은 문자는 나누어서, 이웃 조건은 묶음이나 빈틈으로 처리합니다.', { ...(cases ? { cases } : {}), warnings: [...(n === 0 ? ['빈 배열은 한 가지로 셉니다.'] : []), ...(circular ? ['같은 문자의 원형 배열은 회전 대칭을 따로 다루는 확장 실험입니다. 기출의 서로 다른 사람 원순열과 구분하세요.'] : [])] });
}, p => p.a + p.b + p.c > 18 ? '전체 문자 수는 18개 이하로 설정하세요.' : '');

const selection = makeSpec({
  id: 'selection', title: '색깔 공의 선택', category: '경우의 수',
  description: '빨간 공 개수 조건과 복원 여부에 따라 조합과 독립 추출을 구별합니다.',
  defaults: { red: 4, blue: 5, draw: 4, redTarget: 2, relation: 'eq', replacement: false },
  controls: [N('red','빨간 공 수',0,20),N('blue','파란 공 수',0,20),N('draw','뽑는 횟수·개수',0,20),N('redTarget','빨간 공 기준 수',0,20),
    S('relation','빨간 공 조건',[['eq','정확히'],['ge','이상'],['le','이하']]),C('replacement','뽑은 공을 되돌려 넣기','복원 추출에서는 뽑힌 순서까지 구별합니다. 각 공은 번호가 달라 서로 구별됩니다.')],
  presets: [{name:'빨간 공 정확히 2개',params:{red:4,blue:5,draw:4,redTarget:2,relation:'eq',replacement:false}},
    {name:'복원해서 4회',params:{red:2,blue:3,draw:4,redTarget:2,relation:'ge',replacement:true}},
    {name:'모두 파란 공',params:{red:4,blue:5,draw:3,redTarget:0,relation:'eq',replacement:false}}]
}, ({red,blue,draw,redTarget,relation,replacement}) => {
  const total = replacement ? power(red+blue,draw) : choose(red+blue,draw);
  const cases = []; let value = 0n;
  for (let k=0;k<=draw;k++) {
    if (!satisfies(k,relation,redTarget)) continue;
    const count = replacement ? choose(draw,k)*power(red,k)*power(blue,draw-k) : choose(red,k)*choose(blue,draw-k);
    value += count;
    cases.push({label:`빨간 공 ${k}개`,count:`${count}`,detail:replacement ? `C(${draw},${k}) × ${red}^${k} × ${blue}^${draw-k}` : `C(${red},${k}) × C(${blue},${draw-k})`});
  }
  const question=`서로 구별되는 빨간 공 ${red}개와 파란 공 ${blue}개가 있다. ${replacement?`공을 하나씩 뽑고 되돌려 넣는 시행을 ${draw}번 할 때, 순서를 구별한 추출 결과 중`:`공 ${draw}개를 동시에 뽑을 때`} 빨간 공이 ${relationText(redTarget,relation,'개')}인 경우의 수를 구하시오.`;
  return countResult(question,value,[
    {title:'무엇을 한 가지로 세는가',body:replacement?'서로 다른 공에는 번호가 있습니다. 복원 추출의 결과는 순서 있는 공 번호의 나열입니다. 같은 공이 여러 번 나올 수 있습니다.':'각 공은 서로 구별하지만 한 번에 뽑은 공의 순서는 구별하지 않습니다. 같은 공을 두 번 뽑을 수 없습니다.',formula:replacement?`전체 결과 수 = ${red+blue}^${draw} = ${total}`:`전체 선택 수 = C(${red+blue},${draw}) = ${total}`},
    {title:'빨간 공 개수로 분류',body:replacement?'빨간 공을 뽑는 위치 k개를 먼저 정합니다. 그 위치에는 빨간 공 중 하나, 나머지에는 파란 공 중 하나를 독립적으로 넣습니다.':'빨간 공을 k개 고르는 방법과 파란 공을 나머지 개수만큼 고르는 방법을 곱합니다. 뽑을 수 없는 개수의 조합은 0입니다.',formula:replacement?`k개일 때 C(${draw},k) × ${red}^k × ${blue}^(${draw}−k)`:`k개일 때 C(${red},k) × C(${blue},${draw}−k)`},
    {title:'서로 겹치지 않는 경우를 합하기',body:`조건을 만족하는 k에 대한 경우의 수를 더하면 ${value}가지입니다. 빨간 공 개수가 서로 다르면 같은 결과가 중복되지 않습니다.`,formula:`조건을 만족하는 항의 합 = ${value}`}
  ],replacement?'복원 여부뿐 아니라 순서를 구별하는지도 확인해야 합니다. 이 모형의 복원 추출은 순서 있는 독립 추출입니다.':'색깔만 구별하는 문제가 아니라 각각의 공을 구별하는 문제입니다. 따라서 같은 색의 공을 고를 때도 조합을 사용합니다.',{cases,chart:cases.map(row=>({label:row.label,value:Number(row.count)})),warnings:total===0n?['전체 공보다 많이 비복원 추출할 수 없으므로 가능한 선택은 0가지입니다.']:[]});
},p=>p.red+p.blue===0?'적어도 하나의 공이 있어야 합니다.':'');

const functions = makeSpec({
  id:'function',title:'조건을 만족하는 함수',category:'경우의 수',
  description:'전체 함수, 일대일함수, 전사함수와 특정 함수값 조건을 비교합니다.',
  defaults:{domain:5,codomain:3,constraint:'onto',fixed:0},
  controls:[N('domain','정의역 원소 수 n',0,12),N('codomain','공역 원소 수 m',0,12),S('constraint','함수 조건',[['none','전체 함수'],['onto','전사함수'],['injective','일대일함수']]),N('fixed','f(1)=⋯=f(s)=1의 s',0,12,'s=0이면 고정 조건이 없습니다. s는 n 이하입니다.')],
  presets:[{name:'전사함수',params:{domain:5,codomain:3,constraint:'onto',fixed:0}},{name:'함수값 하나 고정',params:{domain:5,codomain:3,constraint:'onto',fixed:1}},{name:'일대일 불가능',params:{domain:5,codomain:3,constraint:'injective',fixed:0}}]
},({domain:n,codomain:m,constraint,fixed:s})=>{
  let value=0n,formula='',reason='',cases=[];
  const impossibleFixed=s>0&&m===0;
  if(impossibleFixed){reason='공역이 비어 있으므로 함수값을 1로 정할 수 없습니다.';formula='경우의 수 = 0';}
  else if(constraint==='none') {
    value=power(m,n-s);formula=`${m}^${n-s} = ${value}`;
    reason=`앞의 ${s}개 함수값은 정해져 있고 남은 ${n-s}개 원소의 상을 각각 ${m}가지 중에서 독립적으로 고릅니다.`;
  } else if(constraint==='injective') {
    if(s>=2){reason='서로 다른 두 정의역 원소가 모두 1로 가므로 일대일 조건을 만족할 수 없습니다.';formula='경우의 수 = 0';}
    else {value=falling(m-s,n-s);formula=`P(${m-s},${n-s}) = ${value}`;reason=s?'이미 사용한 상 1을 제외하고 서로 다른 상을 차례로 배정합니다.':'정의역의 원소마다 앞서 쓰지 않은 상을 차례로 배정합니다. 정의역이 공역보다 크면 불가능합니다.';}
  } else {
    const required=m-(s?1:0);
    for(let j=0;j<=required;j++) {
      const term=choose(required,j)*power(m-j,n-s),signed=j%2?-term:term;
      value+=signed;cases.push({label:`빠지는 상 ${j}개`,count:`${signed}`,detail:`${j%2?'빼기':'더하기'}: C(${required},${j}) × ${m-j}^${n-s}`});
    }
    formula=`Σ(j=0…${required}) (−1)^j C(${required},j) (${m}−j)^${n-s}`;
    reason=s?'상 1은 이미 사용되었습니다. 나머지 공역 원소가 하나라도 빠지는 함수를 포함배제로 제외합니다.':'공역 원소가 하나라도 상에서 빠지는 함수를 포함배제 원리로 제외합니다. 두 번 제외한 함수는 다시 더합니다.';
  }
  const setText=size=>size===0?'∅':size===1?'{1}':`{1, 2, …, ${size}}`;
  const functionConditions=[];
  if(constraint==='onto')functionConditions.push('f는 전사함수이다.');
  if(constraint==='injective')functionConditions.push('f는 일대일함수이다.');
  if(s)functionConditions.push(s===1?'f(1)=1':`f(1)=f(2)=⋯=f(${s})=1`);
  const question=`집합 X=${setText(n)}, Y=${setText(m)}에 대하여, ${functionConditions.length?'다음 조건을 만족시키는 함수':'함수'} f:X→Y의 개수를 구하시오.${functionConditions.length?`\n${functionConditions.map((condition,i)=>`(${String.fromCharCode(44032+i)}) ${condition}`).join('\n')}`:''}`;
  return countResult(question,value,[
    {title:'함수와 추가 조건',body:`각 정의역 원소는 정확히 하나의 상을 갖습니다. ${constraint==='onto'?'전사함수는 공역의 모든 원소를 상으로 사용합니다.':constraint==='injective'?'일대일함수에서는 서로 다른 정의역 원소의 상이 달라야 합니다.':'서로 다른 정의역 원소의 상이 같아도 됩니다.'}`},
    {title:'조건을 반영하여 세기',body:reason,formula},
    {title:'함수 개수 확정',body:`조건을 모두 만족하는 함수는 ${value}개입니다. 공집합에서 공집합으로의 함수는 빈 함수 한 개로 셉니다.`,formula:`함수의 수 = ${value}`}
  ],constraint==='onto'?'전사 조건은 상에서 빠진 공역 원소를 기준으로 포함배제합니다. 함수값을 고정하면 이미 사용한 상은 빠질 수 없습니다.':constraint==='injective'?'일대일 조건에서는 이미 사용한 상을 다시 쓸 수 없습니다. 여러 원소를 같은 상으로 고정하면 바로 0이 됩니다.':'각 원소의 함수값을 독립적으로 고르므로 곱의 법칙을 사용합니다.',{cases});
},p=>p.fixed>p.domain?'고정하는 함수값 개수 s는 정의역 원소 수 n 이하이어야 합니다.':'');

const coefficient=makeSpec({
  id:'coefficient',title:'이항정리의 계수',category:'경우의 수',
  description:'일반항의 차수를 맞추어 계수를 구하고, 두 항의 차수가 같은 예외도 확인합니다.',
  defaults:{a:2,b:1,p:1,q:2,n:5,target:7},
  controls:[N('a','첫째 항 계수 a',-9,9),N('p','첫째 항 차수 p',0,12),N('b','둘째 항 계수 b',-9,9),N('q','둘째 항 차수 q',0,12),N('n','거듭제곱 n',0,30),N('target','구할 차수 t',0,360)],
  presets:[{name:'기본 이항정리',params:{a:2,b:1,p:1,q:2,n:5,target:7}},{name:'같은 차수',params:{a:2,b:3,p:2,q:2,n:4,target:8}},{name:'음수 계수 상쇄',params:{a:1,b:-1,p:1,q:1,n:6,target:6}}]
},({a,b,p,q,n,target:t})=>{
  const cases=[];let value=0n;
  for(let k=0;k<=n;k++) {
    const exponent=p*k+q*(n-k);
    if(exponent!==t)continue;
    const term=choose(n,k)*power(a,k)*power(b,n-k);value+=term;
    cases.push({label:`첫째 항 ${k}번 선택`,count:`${term}`,detail:`C(${n},${k}) × (${a})^${k} × (${b})^${n-k}; 차수 ${exponent}`});
  }
  const equal=p===q;
  const termText=(coefficient,exponent)=>{
    if(coefficient===0)return '0';
    const sign=coefficient<0?'−':'',magnitude=Math.abs(coefficient);
    return `${sign}${exponent===0?magnitude:`${magnitude===1?'':magnitude}x${exponent===1?'':`^${exponent}`}`}`;
  };
  const polynomialText=`${termText(a,p)} ${b<0?'−':'+'} ${termText(Math.abs(b),q)}`;
  return {...countResult(`다항식 (${polynomialText})^${n}의 전개식에서 x^${t}의 계수는?`,value,[
    {title:'일반항 세우기',body:`${n}개의 괄호 중 첫째 항을 k번, 둘째 항을 ${n}−k번 선택합니다. 어느 괄호에서 첫째 항을 고르는지는 조합으로 셉니다.`,formula:`C(${n},k)·(${a})^k·(${b})^(${n}−k)·x^(${p}k+${q}(${n}−k))`},
    {title:equal?'같은 차수의 항 처리':'목표 차수와 일치시키기',body:equal?`두 항의 차수가 같아 모든 일반항의 차수는 ${n*p}입니다. 이 차수와 목표가 같으면 모든 계수를 더하고, 다르면 계수는 0입니다.`:`${p}k+${q}(${n}−k)=${t}를 만족하는 0 이상 ${n} 이하의 정수 k만 남깁니다. 정수 해가 없으면 해당 차수의 항도 없습니다.`,formula:equal?`(a+b)^n·x^(pn) = (${a+b})^${n}·x^${n*p}`:`(${p-q})k = ${t-q*n}`},
    {title:'계수 계산',body:cases.length?`조건에 맞는 일반항 ${cases.length}개의 계수를 더하면 ${value}입니다. 음수인 항은 부호까지 함께 계산합니다.`:'목표 차수를 만드는 선택이 없으므로 계수는 0입니다.',formula:`[x^${t}] = ${value}`}
  ],equal?'두 차수가 같으면 k를 한 값으로 결정할 수 없습니다. 먼저 같은 항을 합쳐 (a+b)^n으로 계산하세요.':'차수 방정식의 정수 조건과 0≤k≤n을 확인한 다음 계수를 계산합니다.',{cases}),unit:'계수'};
});

// Student-facing methods are independent of the distribution used for checking.
function boundedDiceSum(sides, rolls, target, cumulative) {
  const total = power(sides, rolls);
  if (target < rolls || (!cumulative && target > sides * rolls)) return { value: 0n, formula: '0', cases: [], size: 0 };
  if (cumulative && target >= sides * rolls) return { value: total, formula: `${sides}^${rolls}`, cases: [], size: 0 };
  const cases = [], terms = [];
  let value = 0n;
  for (let j = 0; j <= Math.min(rolls, Math.floor((target - rolls) / sides)); j++) {
    const top = target - sides * j - (cumulative ? 0 : 1), bottom = rolls - (cumulative ? 0 : 1);
    const term = choose(rolls, j) * choose(top, bottom), signed = j % 2 ? -term : term;
    value += signed;
    const product = `${j ? `C(${rolls},${j})×` : ''}C(${top},${bottom})`;
    terms.push(`${j ? j % 2 ? ' − ' : ' + ' : ''}${product}`);
    cases.push({ label: `상한 위반 ${j}개 보정`, count: `${signed}`, detail: `${j % 2 ? '빼기' : '더하기'}: ${product}` });
  }
  return { value, formula: terms.join('') || '0', cases, size: terms.length };
}

function sumTeaching(sides, rolls, target, relation) {
  const total = power(sides, rolls), center = rolls * (sides + 1);
  let selected, complement = false, symmetry = false, bound = target;
  if (relation === 'eq') {
    symmetry = target > center - target;
    bound = symmetry ? center - target : target;
    selected = boundedDiceSum(sides, rolls, bound, false);
  } else {
    const directBound = relation === 'le' ? target : target - 1;
    const reflectedBound = relation === 'le' ? center - target - 1 : center - target;
    const direct = boundedDiceSum(sides, rolls, directBound, true);
    const reflected = boundedDiceSum(sides, rolls, reflectedBound, true);
    symmetry = reflected.size < direct.size;
    bound = symmetry ? reflectedBound : directBound;
    complement = relation === 'le' ? symmetry : !symmetry;
    selected = symmetry ? reflected : direct;
  }
  const eventCount = complement ? total - selected.value : selected.value;
  const transformation = symmetry ? `대칭 치환 z_i=${sides + 1}−x_i를 쓰면 합 S는 ${center}−S로 바뀝니다. ` : '';
  const event = relation === 'eq' ? `합이 ${bound}인 경우` : `합이 ${bound} 이하인 경우`;
  const formula = `${complement ? `${sides}^${rolls} − (${selected.formula})` : selected.formula} = ${eventCount}`;
  return {
    steps: [
      { title: '하한을 치환하고 중복조합 적용', body: `원래 눈의 합 x_1+⋯+x_${rolls}=t라 두고 y_i=x_i−1로 치환하면 y_1+⋯+y_${rolls}=t−${rolls}, 0≤y_i≤${sides - 1}입니다. 상한을 잠시 뺀 중복조합은 C(t−1,${rolls - 1})입니다. 원래 눈의 합이 t 이하이면 남는 양을 새 변수로 두어 C(t,${rolls})로 셉니다.`, formula: `합=t: C(t−1,${rolls - 1}),  합≤t: C(t,${rolls})` },
      { title: `${symmetry ? '대칭 치환과 ' : ''}${complement ? '여사건·' : ''}상한의 포함배제`, body: `${transformation}${event}를 셉니다. x_i≥${sides + 1}인 변수를 j개 고르면 각각 ${sides}를 빼서 치환하므로 C(${rolls},j)를 곱해 번갈아 빼고 더합니다.${complement ? ' 구하기 쉬운 여사건을 전체에서 뺍니다.' : ''} 두 방향 중 보정 항이 적은 식을 사용합니다.`, formula }
    ], cases: selected.cases, count: eventCount,
    insight: '양의 정수해는 하한 치환 후 중복조합으로, 주사위 눈의 상한은 포함배제로 처리합니다. 꼬리가 긴 쪽은 여사건이나 눈을 뒤집는 대칭 치환으로 줄입니다.'
  };
}

function maximumTeaching(sides, rolls, target, relation) {
  const atMost = m => power(Math.max(0, Math.min(sides, m)), rolls);
  const clamp = m => Math.max(0, Math.min(sides, m));
  const low = relation === 'eq' || relation === 'ge' ? target - 1 : target;
  const formula = relation === 'eq'
    ? `${clamp(target)}^${rolls} − ${clamp(target - 1)}^${rolls}`
    : relation === 'le' ? `${clamp(target)}^${rolls}` : `${sides}^${rolls} − ${clamp(target - 1)}^${rolls}`;
  const count = relation === 'eq' ? atMost(target) - atMost(target - 1) : relation === 'le' ? atMost(target) : power(sides, rolls) - atMost(target - 1);
  return {
    steps: [
      { title: '최댓값 이하를 먼저 세기', body: `최댓값 M이 m 이하라는 것은 모든 눈이 1부터 m까지라는 뜻입니다. 따라서 1≤m≤${sides}에서 경우의 수는 m^${rolls}입니다. m<1이면 0, m≥${sides}이면 전체입니다.`, formula: `|M≤m| = (0과 ${sides} 사이로 제한한 m)^${rolls}` },
      { title: relation === 'eq' ? '바로 아래의 누적 경우 빼기' : relation === 'ge' ? '여사건으로 바꾸기' : '같은 선택을 독립적으로 곱하기', body: relation === 'eq' ? `최댓값이 ${target} 이하인 경우에서 ${target - 1} 이하인 경우를 빼면 최댓값이 정확히 ${target}인 경우만 남습니다.` : relation === 'ge' ? `M≥${target}의 여사건은 M≤${target - 1}입니다. 모든 눈을 나눠 세지 않고 전체에서 한 번에 뺍니다.` : `각 눈이 모두 ${target} 이하이도록 가능한 눈을 고르면 됩니다.`, formula: `${formula} = ${count}` }
    ], count, cases: [{ label: `최댓값 ${low} 이하`, count: `${atMost(low)}`, detail: `${clamp(low)}^${rolls}` }],
    insight: '최댓값 문제는 각 눈을 따로 나열하기보다 “모두 m 이하”를 먼저 세면 거듭제곱 한두 항으로 정리됩니다.'
  };
}

function productPatternSummary(product, length, sides) {
  const descriptions = []; let types = 0;
  const visit = (remaining, slots, minFace, prefix) => {
    if (!slots) {
      if (remaining !== 1) return;
      types++;
      if (descriptions.length >= 3) return;
      const multiplicities = new Map();
      for (const face of prefix) multiplicities.set(face, (multiplicities.get(face) || 0) + 1);
      const denominator = [...multiplicities.values()].map(count => `${count}!`).join('·') || '1';
      descriptions.push(`${prefix.length ? `(${prefix.join(',')})` : '빈 앞부분'}: ${length}!/(${denominator})`);
      return;
    }
    if (remaining < minFace ** slots || remaining > sides ** slots) return;
    for (let face = minFace; face <= sides; face++) if (remaining % face === 0) visit(remaining / face, slots - 1, face, [...prefix, face]);
  };
  visit(product, length, 1, []);
  return `${descriptions.join('; ')}${types > descriptions.length ? `; 같은 원리의 다른 ${types - descriptions.length}유형` : ''}`;
}

function productTeaching(sides, rolls, target, relation, prefixDistribution) {
  const cases = []; let count = 0n;
  if (relation === 'eq') {
    for (let last = 1; last <= sides; last++) {
      if (target < 1 || target % last !== 0) continue;
      const q = target / last, prefixCount = prefixDistribution.get(q) || 0n;
      if (!prefixCount) continue;
      count += prefixCount;
      cases.push({ label: `앞부분의 곱 ${q}, 마지막 눈 ${last}`, count: `${prefixCount}`, detail: productPatternSummary(q, rolls - 1, sides) });
    }
  } else {
    const groups = new Map();
    for (const [q, ways] of prefixDistribution) {
      const allowed = relation === 'le' ? Math.max(0, Math.min(sides, Math.floor(target / q))) : sides - Math.max(0, Math.min(sides, Math.ceil(target / q) - 1));
      if (!allowed) continue;
      const group = groups.get(allowed) || { ways: 0n, min: q, max: q };
      group.ways += ways; group.min = Math.min(group.min, q); group.max = Math.max(group.max, q); groups.set(allowed, group);
    }
    for (const [allowed, group] of [...groups].sort((a,b)=>a[0]-b[0])) {
      const contribution = group.ways * BigInt(allowed); count += contribution;
      const last = relation === 'le' ? `1…${allowed}` : `${sides - allowed + 1}…${sides}`;
      cases.push({ label: `마지막 눈 ${last}`, count: `${contribution}`, detail: `가능한 앞부분 곱 ${group.min}…${group.max}에 해당하는 앞부분 배열 ${group.ways}가지 × 마지막 눈 ${allowed}가지` });
    }
  }
  return {
    steps: [
      { title: '소인수·약수와 같은 눈의 순열', body: `앞 ${rolls - 1}개의 눈의 곱을 q로 묶습니다. 곱이 정해지면 각 눈은 그 곱의 약수이고, 소인수의 지수를 나누어 가능한 눈의 종류별 개수를 정합니다. 같은 눈이 e_j번씩 나오는 한 유형의 순열 수는 (${rolls - 1})!/(e_1!e_2!…)입니다.`, formula: `N(q) = 곱이 q인 각 눈의 종류별 유형에 대한 (${rolls - 1})!/(e_1!e_2!…)의 합` },
      { title: '마지막 눈의 허용 개수 곱하기', body: relation === 'eq' ? `마지막 눈 d는 ${target}의 약수여야 하며 1≤d≤${sides}입니다. 앞부분의 곱이 ${target}/d가 되는 순열 수 N(${target}/d)를 더합니다. 곱이 0인 경우는 없습니다.` : `마지막 눈을 d라 하면 q·d ${relation === 'le' ? '≤' : '≥'} ${target}입니다. q가 주어졌을 때 가능한 d의 개수를 구하고, 허용되는 d의 범위가 같은 앞부분끼리 묶어 곱의 법칙을 적용합니다. 합과 달리 일반적인 곱 조건에는 중복조합 한 번으로 끝나는 공식이 없습니다.`, formula: relation === 'eq' ? `Σ(1≤d≤${sides}, d는 ${target}의 약수) N(${target}/d) = ${count}` : `Σ_q N(q) × |{d: 1≤d≤${sides}, qd ${relation === 'le' ? '≤' : '≥'} ${target}}| = ${count}` }
    ], count, cases,
    insight: '곱 조건은 약수와 소인수로 눈의 종류를 제한하고, 같은 종류끼리 묶은 순열 수를 사용합니다. 마지막 눈의 허용 범위가 같으면 한 경우로 합칩니다.'
  };
}

const combinationText = (n, k) => n < 0 || k < 0 || k > n ? '0' : `C(${n},${k})`;
function parityCombinations(odds, evens, size, parity) {
  const terms = []; let count = 0n;
  for (let t = 0; t <= size; t++) {
    if (t % 2 !== parity) continue;
    const value = choose(odds,t) * choose(evens,size-t);
    if (!value) continue;
    count += value; terms.push({ t, count: value, formula: `C(${odds},${t})×C(${evens},${size-t})` });
  }
  return { count, formula: terms.map(term=>term.formula).join(' + ') || '0', terms };
}

// Combination shortcuts stop a whole class once its minimum/maximum sum decides it.
function thresholdCounter(cards) {
  const sums=[0], odds=[0], memo=new Map();
  for(const card of cards){sums.push(sums.at(-1)+card);odds.push(odds.at(-1)+(card%2));}
  const count=(length,size,target,parity=null)=>{
    if(size<0||size>length)return 0n;
    if(!size)return target<=0&&(parity===null||parity===0)?1n:0n;
    if(target>sums[length]-sums[length-size])return 0n;
    if(target<=sums[size])return parity===null?choose(length,size):parityCombinations(odds[length],length-odds[length],size,parity).count;
    if(size===1){let value=0n;for(let i=0;i<length;i++)if(cards[i]>=target&&(parity===null||cards[i]%2===parity))value++;return value;}
    const key=`${length},${size},${target},${parity}`;
    if(memo.has(key))return memo.get(key);
    const last=cards[length-1],nextParity=parity===null?null:(parity-last%2+2)%2;
    const value=count(length-1,size,target,parity)+count(length-1,size-1,target-last,nextParity);
    memo.set(key,value);return value;
  };
  return count;
}

function cardSumCases(cards, size, threshold, parity) {
  if(size<0||size>cards.length)return [];
  if(!size)return [{label:'합 조건: 남은 카드 없음',count:threshold<=0&&(parity===null||parity===0)?'1':'0',detail:`이미 고정한 카드의 합만으로 기준을 확인합니다.`}];
  const count=thresholdCounter(cards), rows=[];
  const minimumTotal=cards.slice(0,size).reduce((sum,card)=>sum+card,0),maximumTotal=cards.slice(-size).reduce((sum,card)=>sum+card,0);
  if(threshold>maximumTotal)return [{label:'합 조건: 최대 합으로 불가능 판정',count:'0',detail:`남은 ${size}장의 최대 합 ${maximumTotal}이 필요한 합 ${threshold}보다 작습니다.`}];
  if(threshold<=minimumTotal){
    const odd=cards.filter(card=>card%2).length;
    const formula=parity===null?combinationText(cards.length,size):parityCombinations(odd,cards.length-odd,size,parity).formula;
    return [{label:'합 조건: 모든 남은 카드 선택',count:`${count(cards.length,size,threshold,parity)}`,detail:`최소 합 ${minimumTotal}도 기준 ${threshold} 이상이므로 ${formula}`}];
  }
  for(let index=size-1;index<cards.length;index++) {
    const largest=cards[index],rest=size-1,target=threshold-largest,nextParity=parity===null?null:(parity-largest%2+2)%2;
    const value=count(index,rest,target,nextParity);
    const minimum=cards.slice(0,rest).reduce((s,x)=>s+x,0),maximum=cards.slice(index-rest,index).reduce((s,x)=>s+x,0);
    let detail;
    if(target>maximum)detail=`나머지 ${rest}장의 최대 합 ${maximum}도 필요한 합 ${target}에 못 미쳐 0`;
    else if(target<=minimum) {
      const odd=cards.slice(0,index).filter(x=>x%2).length;
      detail=nextParity===null?`나머지 ${rest}장의 최소 합 ${minimum}이 필요한 합 ${target} 이상: ${combinationText(index,rest)}=${value}`:`합 기준은 자동 만족, 남은 홀수 개수의 ${nextParity?'홀짝=홀수':'홀짝=짝수'} 조건: ${parityCombinations(odd,index-odd,rest,nextParity).formula}=${value}`;
    } else if(rest===1)detail=`${largest}보다 작은 카드 중 ${target} 이상${nextParity===null?'':nextParity?'인 홀수':'인 짝수'} ${value}장 중 한 장 선택: C(${value},1)`;
    else detail=`나머지 ${rest}장은 ${largest}보다 작은 카드에서 합 ${target} 이상${nextParity===null?'':`, 합은 ${nextParity?'홀수':'짝수'}`}. 최댓값을 더 고정하고 최소·최대 합 경계에서 조합으로 묶으면 ${value}가지`;
    rows.push({label:`합 조건: 남은 카드의 최댓값 ${largest}`,count:`${value}`,detail});
  }
  return rows;
}

function conditionalTeaching({n,draw:r,condition,conditionValue:b,event,eventValue:a}, countB, countAB) {
  const O=Math.ceil(n/2),E=Math.floor(n/2),cases=[];
  let denominator='0',denominatorBody,numerator='0',numeratorBody;
  const validB=condition==='sum-even'||(b<=n&&r>=1);
  if(condition==='sum-even') {
    const parity=parityCombinations(O,E,r,0);denominator=parity.formula;
    denominatorBody=`홀수 카드는 ${O}장, 짝수 카드는 ${E}장입니다. 합이 짝수이려면 홀수 카드 수 t가 짝수여야 하므로 C(${O},t)C(${E},${r}−t)를 짝수 t에 대해서만 더합니다.`;
    for(const term of parity.terms)cases.push({label:`조건 B: 홀수 ${term.t}장`,count:`${term.count}`,detail:term.formula});
  } else if(condition==='include') {
    denominator=validB?combinationText(n-1,r-1):'0';
    denominatorBody=validB?`${b}번 카드를 먼저 고정하고 제외하면 나머지 ${n-1}장 중 ${r-1}장을 고르면 됩니다.`:`조건의 ${b}번 카드를 포함할 수 없어 조건 B는 불가능합니다.`;
  } else {
    denominator=validB?combinationText(b-1,r-1):'0';
    denominatorBody=validB?`최댓값 ${b}번 카드를 고정하고 나머지는 1부터 ${b-1} 중 ${r-1}장을 고릅니다. 최댓값 이하의 차 C(${b},${r})−C(${b-1},${r})와도 같습니다.`:`최댓값 ${b}인 카드 선택이 존재하지 않습니다.`;
  }
  if(!countB){
    numerator='0';numeratorBody='조건 B 자체가 불가능하므로 교집합도 0가지입니다. 분모가 0인 조건부확률은 정의되지 않습니다.';
  } else if(event==='odd-count') {
    if(a>r){numerator='0';numeratorBody=`전체 ${r}장보다 홀수 ${a}장을 더 많이 뽑을 수 없어 교집합은 0가지입니다.`;}
    else if(condition==='sum-even') {
      numerator=a%2?'0':`${combinationText(O,a)}×${combinationText(E,r-a)}`;
      numeratorBody=a%2?'홀수 카드가 홀수 장이면 카드 합도 홀수입니다. 합이 짝수인 조건 B와 모순이므로 분자는 바로 0입니다.':`홀수 ${a}장을 ${O}장 중에서, 나머지 짝수 ${r-a}장을 ${E}장 중에서 고릅니다. 홀수 장수가 짝수라서 B도 자동 만족합니다.`;
    } else {
      const fixedOdd=b%2,available=condition==='include'?n-1:b-1;
      const odd=condition==='include'?O-fixedOdd:Math.ceil((b-1)/2),even=available-odd,need=a-fixedOdd;
      numerator=validB?`${combinationText(odd,need)}×${combinationText(even,r-1-need)}`:'0';
      numeratorBody=need<0||need>r-1?`고정된 ${b}번 카드의 홀짝과 요구한 홀수 ${a}장 조건을 함께 만족할 수 없어 0가지입니다.`:`이미 고정한 ${b}번 카드가 ${fixedOdd?'홀수':'짝수'}이므로 남은 ${r-1}장 중 홀수는 ${need}장이 필요합니다. 남은 홀수·짝수에서 각각 조합으로 고릅니다.`;
    }
  } else if(event==='include') {
    if(a<1||a>n||!r||!validB){numerator='0';numeratorBody='필요한 카드가 없거나 함께 뽑을 수 없으므로 교집합은 0가지입니다.';}
    else if(condition==='sum-even') {
      const odd=O-a%2,even=E-(1-a%2),parity=parityCombinations(odd,even,r-1,a%2);
      numerator=parity.formula;
      numeratorBody=`${a}번 카드를 고정하고 제외합니다. 이 카드가 ${a%2?'홀수':'짝수'}이므로 남은 ${r-1}장의 홀수 개수도 ${a%2?'홀수':'짝수'}여야 전체 합이 짝수입니다. 남은 홀수 ${odd}장·짝수 ${even}장에서 조합으로 고릅니다.`;
      for(const term of parity.terms)cases.push({label:`교집합: ${a}번 고정, 남은 홀수 ${term.t}장`,count:`${term.count}`,detail:term.formula});
    } else if(a===b){numerator=denominator;numeratorBody=`${b}번 카드는 조건 B에 의해 이미 고정되어 있으므로 A도 자동 만족합니다.`;}
    else if(r<2){numerator='0';numeratorBody='한 장만 뽑으면서 서로 다른 두 카드를 모두 포함할 수 없으므로 0가지입니다.';}
    else if(condition==='include'){numerator=combinationText(n-2,r-2);numeratorBody=`${a}번과 ${b}번 두 카드를 고정하고 나머지 ${n-2}장 중 ${r-2}장을 고릅니다.`;}
    else if(a>b){numerator='0';numeratorBody=`최댓값이 ${b}이므로 더 큰 ${a}번 카드는 포함할 수 없습니다.`;}
    else {numerator=combinationText(b-2,r-2);numeratorBody=`최댓값 ${b}번과 ${a}번을 고정합니다. 1부터 ${b-1} 중 ${a}를 제외한 ${b-2}장에서 ${r-2}장을 고릅니다.`;}
  } else {
    const fixed=condition==='sum-even'?0:b,k=r-(condition==='sum-even'?0:1);
    const cards=Array.from({length:condition==='max-eq'?Math.min(n,b-1):n},(_,i)=>i+1).filter(x=>condition==='sum-even'||x!==b);
    const rows=validB?cardSumCases(cards,k,a-fixed,condition==='sum-even'?0:null):[];
    cases.push(...rows);numerator=rows.length?`${rows.map(row=>row.count).join(' + ')}`:'0';
    numeratorBody=k===0?`더 뽑을 카드가 없으므로 고정된 카드의 합 ${fixed}이 기준 ${a} 이상인지만 확인합니다.`:`${fixed?`${b}번 카드를 고정했으므로 남은 카드 합은 ${a-b} 이상이어야 합니다. `:''}남은 카드의 최댓값 m을 기준으로 겹치지 않게 경우를 나눕니다. m을 제외한 카드의 최소 합이 기준 이상이면 그 경우 전체를 조합으로 세고, 최대 합도 기준 미만이면 0입니다. 경계 사이의 경우만 남은 합 조건으로 더 나눕니다. 일반적인 합 조건을 조합 한 항으로 바꾸는 공식은 없습니다.`;
  }
  return {
    steps:[
      {title:'분모: 조건 B를 조합으로 세기',body:denominatorBody,formula:`|B| = ${denominator} = ${countB}`},
      {title:event==='sum-ge'?'분자: 최댓값과 합의 경계로 분류':'분자: 고정·홀짝 조건을 함께 적용',body:numeratorBody,formula:`|A∩B| = ${numerator} = ${countAB}`}
    ], cases,
    insight:event==='sum-ge'?'카드 합의 기준은 고정 카드의 합을 먼저 빼고 남은 최댓값으로 분류합니다. 한 묶음이 전부 가능하거나 불가능한 경계는 최소·최대 합으로 판단해 조합으로 한 번에 셉니다.':'조건부확률은 B를 새로운 표본공간으로 삼습니다. 고정 카드를 먼저 빼고, 홀수·짝수의 남은 장수를 조합에 대입하면 전체 선택을 나열할 필요가 없습니다.'
  };
}

const probabilityCount=makeSpec({
  id:'probability-count',title:'주사위 시행의 확률',category:'확률',
  description:'합·곱·최댓값의 분포를 세어 확률을 기약분수로 구합니다.',
  defaults:{sides:6,rolls:3,statistic:'sum',relation:'ge',target:12},
  controls:[N('sides','공정한 주사위의 면 수',2,12),N('rolls','독립 시행 횟수',1,8),S('statistic','관찰하는 값',[['sum','눈의 합'],['product','눈의 곱'],['max','눈의 최댓값']]),S('relation','사건 조건',[['eq','정확히'],['ge','이상'],['le','이하']]),N('target','기준 값',0,500000000)],
  presets:[{name:'세 눈의 합',params:{sides:6,rolls:3,statistic:'sum',relation:'ge',target:12}},{name:'곱이 12',params:{sides:6,rolls:3,statistic:'product',relation:'eq',target:12}},{name:'최댓값이 5',params:{sides:6,rolls:4,statistic:'max',relation:'eq',target:5}}]
},({sides,rolls,statistic,relation,target})=>{
  let distribution=new Map([[statistic==='product'?1:0,1n]]),prefixDistribution=distribution;
  for(let i=0;i<rolls;i++) {
    if(i===rolls-1)prefixDistribution=distribution;
    const next=new Map();
    for(const [old,count] of distribution) for(let face=1;face<=sides;face++) {
      const value=statistic==='sum'?old+face:statistic==='product'?old*face:Math.max(old,face);
      next.set(value,(next.get(value)||0n)+count);
    }
    distribution=next;
  }
  let successful=0n;
  for(const [value,count] of distribution) if(satisfies(value,relation,target))successful+=count;
  const total=power(sides,rolls),name={sum:'합',product:'곱',max:'최댓값'}[statistic];
  const sorted=[...distribution].sort((a,b)=>a[0]-b[0]),chart=[];
  const width=Math.ceil(sorted.length/24);
  for(let i=0;i<sorted.length;i+=width){const group=sorted.slice(i,i+width);chart.push({label:group.length===1?`${group[0][0]}`:`${group[0][0]}~${group.at(-1)[0]}`,value:Number(group.reduce((s,row)=>s+row[1],0n))});}
  const teaching=statistic==='sum'?sumTeaching(sides,rolls,target,relation):statistic==='max'?maximumTeaching(sides,rolls,target,relation):productTeaching(sides,rolls,target,relation,prefixDistribution);
  const f=fraction(successful,total);
  return probabilityResult(`1부터 ${sides}까지의 자연수가 하나씩 적힌 주사위를 서로 독립적으로 ${rolls}회 던질 때, 나온 눈의 ${name}이 ${relationText(target,relation)}일 확률은?`,successful,total,[
    {title:'동일확률의 기준',body:`순서 있는 각 눈의 결과는 같은 확률입니다. 전체 ${total}가지를 분모로 삼고, 사건의 경우의 수를 조합·곱의 법칙으로 구합니다. ${name}의 서로 다른 값이 동일확률인 것은 아닙니다.`,formula:`전체 결과 수 = ${sides}^${rolls} = ${total}`},
    ...teaching.steps,
    {title:'확률로 마무리',body:`조건을 만족하는 ${successful}가지를 전체 ${total}가지로 나누어 약분합니다.`,formula:`P(A) = ${successful}/${total} = ${f.text}`}
  ],teaching.insight,{cases:[...teaching.cases,{label:'사건 A',count:`${successful}`,detail:`${name} 조건 만족`},{label:'사건 A의 여사건',count:`${total-successful}`},{label:'전체',count:`${total}`}],chart,warnings:sorted.length>24?['분포 그래프는 인접한 값을 묶어 표시합니다. 확률 계산에는 모든 값을 정확하게 사용했습니다.']:[]});
});

const conditional=makeSpec({
  id:'conditional',title:'카드 선택의 조건부확률',category:'확률',
  description:'조건 B로 표본공간을 줄이고 A∩B와 B의 경우의 수를 직접 비교합니다.',
  defaults:{n:8,draw:3,condition:'sum-even',conditionValue:1,event:'include',eventValue:1},
  controls:[N('n','카드 번호의 최댓값 n',1,18),N('draw','동시에 뽑는 카드 수 r',0,9),S('condition','주어진 조건 B',[['sum-even','카드 합이 짝수'],['include','특정 카드 포함'],['max-eq','최댓값이 특정 수']]),N('conditionValue','조건 B의 카드 번호·최댓값',1,18,'B가 합의 짝수 여부일 때에는 사용하지 않습니다.'),S('event','구하려는 사건 A',[['odd-count','홀수 카드 개수가 특정 수'],['include','특정 카드 포함'],['sum-ge','카드 합이 기준 이상']]),N('eventValue','사건 A의 기준 값',0,180)],
  presets:[{name:'짝수 합과 1번 카드',params:{n:8,draw:3,condition:'sum-even',conditionValue:1,event:'include',eventValue:1}},{name:'1번 포함과 홀수 2장',params:{n:8,draw:3,condition:'include',conditionValue:1,event:'odd-count',eventValue:2}},{name:'최댓값 제한',params:{n:8,draw:3,condition:'max-eq',conditionValue:5,event:'sum-ge',eventValue:10}}]
},({n,draw:r,condition,conditionValue:b,event,eventValue:a})=>{
  let total=0n,countB=0n,countAB=0n,countAoutside=0n,neither=0n;
  const check=list=>{
    total++;
    const sum=list.reduce((s,x)=>s+x,0),odd=list.filter(x=>x%2).length;
    const B=condition==='sum-even'?sum%2===0:condition==='include'?list.includes(b):list.length>0&&list.at(-1)===b;
    const A=event==='odd-count'?odd===a:event==='include'?list.includes(a):sum>=a;
    if(B){countB++;if(A)countAB++;}
    else if(A)countAoutside++;else neither++;
  };
  const visit=(start,list)=>{if(list.length===r){check(list);return;}for(let x=start;x<=n-(r-list.length)+1;x++)visit(x+1,[...list,x]);};
  visit(1,[]);
  const Btext=condition==='sum-even'?'뽑은 카드에 적힌 수의 합이 짝수일 때':condition==='include'?`뽑은 카드에 ${b}번 카드가 포함되어 있을 때`:`뽑은 카드에 적힌 수의 최댓값이 ${b}일 때`;
  const Atext=event==='odd-count'?`뽑은 카드 중 홀수인 수가 정확히 ${a}개일`:event==='include'?`뽑은 카드에 ${a}번 카드가 포함되어 있을`:`뽑은 카드에 적힌 수의 합이 ${a} 이상일`;
  const question=`1부터 ${n}까지의 자연수가 각각 하나씩 적힌 카드 ${n}장 중 ${r}장을 임의로 동시에 뽑는다. ${Btext}, ${Atext} 확률은?`;
  const teaching=conditionalTeaching({n,draw:r,condition,conditionValue:b,event,eventValue:a},countB,countAB);
  const cases=[...teaching.cases,{label:'A∩B',count:`${countAB}`,detail:'분자: A와 B를 모두 만족'},{label:'(A의 여사건)∩B',count:`${countB-countAB}`,detail:'B 안에서 A가 성립하지 않음'},{label:'B',count:`${countB}`,detail:'분모: 위 두 경우의 합'},{label:'A∩(B의 여사건)',count:`${countAoutside}`,detail:'A는 만족하지만 B를 만족하지 않음'},{label:'(A의 여사건)∩(B의 여사건)',count:`${neither}`,detail:'A와 B를 모두 만족하지 않음'}];
  const steps=[
    {title:'같은 확률과 새로운 표본공간',body:`${r}장을 동시에 뽑으므로 순서는 구별하지 않습니다. 전체는 C(${n},${r})=${total}가지이지만, 조건부확률의 분모는 B를 만족하는 경우의 수입니다.`,formula:`P(A|B)=P(A∩B)/P(B)=|A∩B|/|B|`},
    ...teaching.steps,
    {title:'조건부확률 계산',body:countB?'분자와 분모에 공통인 전체 표본공간 크기는 약분되므로 두 경우의 수를 바로 나눕니다.':'B를 만족하는 결과가 없습니다. 확률이 0인 조건에 대한 조건부확률은 이 모형에서 정의되지 않습니다.',formula:countB?`P(A|B) = ${countAB}/${countB} = ${fraction(countAB,countB).text}`:'P(B) = 0이므로 P(A|B)는 정의되지 않음'}
  ];
  const extra={cases,chart:[{label:'B 안에서 A 만족',value:Number(countAB)},{label:'B 안에서 A 불만족',value:Number(countB-countAB)}]};
  if(!countB)return {status:'invalid',question,answer:'정의되지 않음',numeric:null,unit:'확률',steps,insight:'P(B)=0이면 조건부확률의 분모가 0입니다. 이를 확률 0으로 처리하지 않습니다.',warnings:['조건 B를 만족하는 선택이 없어 조건부확률이 정의되지 않습니다.'],...extra};
  return probabilityResult(question,countAB,countB,steps,teaching.insight,extra);
},p=>p.draw>p.n?'뽑는 카드 수 r은 전체 카드 수 n 이하이어야 합니다.':'');

export const countingSpecs = [arrangement,selection,functions,coefficient,probabilityCount,conditional];
