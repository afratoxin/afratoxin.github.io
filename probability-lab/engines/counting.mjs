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
  const question = `A ${a}개, B ${b}개, C ${c}개를 ${conditionLabel} ${circular ? '원형으로' : '일렬로'} 배열하는 경우의 수를 구하시오. 같은 문자는 구별하지 않는다.${circular ? ' 회전하여 일치하는 배열은 같게 보고, 뒤집기는 구별한다.' : ''}`;
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
  const label={none:'함수',onto:'전사함수',injective:'일대일함수'}[constraint];
  return countResult(`X={1,…,${n}}, Y={1,…,${m}}에 대하여 X에서 Y로의 ${label} 중 ${s?`f(1)=⋯=f(${s})=1을 만족하는`:'별도의 함수값 조건이 없는'} 것의 개수를 구하시오. 원소 수가 0인 집합은 공집합으로 본다.`,value,[
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
  return {...countResult(`다항식 ((${a})x^${p}+(${b})x^${q})^${n}을 전개한 식에서 x^${t}의 계수를 구하시오.`,value,[
    {title:'일반항 세우기',body:`${n}개의 괄호 중 첫째 항을 k번, 둘째 항을 ${n}−k번 선택합니다. 어느 괄호에서 첫째 항을 고르는지는 조합으로 셉니다.`,formula:`C(${n},k)·(${a})^k·(${b})^(${n}−k)·x^(${p}k+${q}(${n}−k))`},
    {title:equal?'같은 차수의 항 처리':'목표 차수와 일치시키기',body:equal?`두 항의 차수가 같아 모든 일반항의 차수는 ${n*p}입니다. 이 차수와 목표가 같으면 모든 계수를 더하고, 다르면 계수는 0입니다.`:`${p}k+${q}(${n}−k)=${t}를 만족하는 0 이상 ${n} 이하의 정수 k만 남깁니다. 정수 해가 없으면 해당 차수의 항도 없습니다.`,formula:equal?`(a+b)^n·x^(pn) = (${a+b})^${n}·x^${n*p}`:`(${p-q})k = ${t-q*n}`},
    {title:'계수 계산',body:cases.length?`조건에 맞는 일반항 ${cases.length}개의 계수를 더하면 ${value}입니다. 음수인 항은 부호까지 함께 계산합니다.`:'목표 차수를 만드는 선택이 없으므로 계수는 0입니다.',formula:`[x^${t}] = ${value}`}
  ],equal?'두 차수가 같으면 k를 한 값으로 결정할 수 없습니다. 먼저 같은 항을 합쳐 (a+b)^n으로 계산하세요.':'차수 방정식의 정수 조건과 0≤k≤n을 확인한 다음 계수를 계산합니다.',{cases}),unit:'계수'};
});

const probabilityCount=makeSpec({
  id:'probability-count',title:'주사위 시행의 확률',category:'확률',
  description:'합·곱·최댓값의 분포를 세어 확률을 기약분수로 구합니다.',
  defaults:{sides:6,rolls:3,statistic:'sum',relation:'ge',target:12},
  controls:[N('sides','공정한 주사위의 면 수',2,12),N('rolls','독립 시행 횟수',1,8),S('statistic','관찰하는 값',[['sum','눈의 합'],['product','눈의 곱'],['max','눈의 최댓값']]),S('relation','사건 조건',[['eq','정확히'],['ge','이상'],['le','이하']]),N('target','기준 값',0,500000000)],
  presets:[{name:'세 눈의 합',params:{sides:6,rolls:3,statistic:'sum',relation:'ge',target:12}},{name:'곱이 12',params:{sides:6,rolls:3,statistic:'product',relation:'eq',target:12}},{name:'최댓값이 5',params:{sides:6,rolls:4,statistic:'max',relation:'eq',target:5}}]
},({sides,rolls,statistic,relation,target})=>{
  let distribution=new Map([[statistic==='product'?1:0,1n]]);
  for(let i=0;i<rolls;i++) {
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
  const f=fraction(successful,total);
  return probabilityResult(`1부터 ${sides}까지의 눈이 같은 확률로 나오는 주사위를 독립적으로 ${rolls}번 던진다. 나온 눈의 ${name}이 ${relationText(target,relation)}일 확률을 구하시오.`,successful,total,[
    {title:'같은 확률의 기본 결과',body:`기본 결과는 눈의 순서쌍 (${Array.from({length:rolls},(_,i)=>`x${i+1}`).join(', ')})입니다. 각 결과의 확률은 같고, 모두 ${total}가지입니다. 서로 다른 ${name}의 값들이 같은 확률인 것은 아닙니다.`,formula:`전체 결과 수 = ${sides}^${rolls} = ${total}`},
    {title:`${name}의 값별 경우의 수 누적`,body:`한 번 던질 때마다 이전 ${name}의 값에 가능한 눈 1부터 ${sides}까지를 반영합니다. 같은 값으로 도착하는 경우의 수를 모두 더하여 ${rolls}회 후의 분포를 얻습니다.`,formula:statistic==='sum'?'새 합 = 이전 합 + 새 눈':statistic==='product'?'새 곱 = 이전 곱 × 새 눈':'새 최댓값 = max(이전 최댓값, 새 눈)'},
    {title:'사건의 경우의 수를 전체로 나누기',body:`조건을 만족하는 값들의 경우의 수를 합하면 ${successful}가지입니다. 이를 전체 ${total}가지로 나누고 약분합니다.`,formula:`P(A) = ${successful}/${total} = ${f.text}`}
  ],'동일확률은 각 눈의 순서 있는 나열에 적용됩니다. 합이나 곱의 서로 다른 값에 동일확률을 가정하면 안 됩니다.',{cases:[{label:'사건 A',count:`${successful}`,detail:`${name} 조건 만족`},{label:'사건 A의 여사건',count:`${total-successful}`},{label:'전체',count:`${total}`}],chart,warnings:sorted.length>24?['분포 그래프는 인접한 값을 묶어 표시합니다. 확률 계산에는 모든 값을 정확하게 사용했습니다.']:[]});
});

const conditional=makeSpec({
  id:'conditional',title:'카드 선택의 조건부확률',category:'확률',
  description:'조건 B로 표본공간을 줄이고 A∩B와 B의 경우의 수를 직접 비교합니다.',
  defaults:{n:8,draw:3,condition:'sum-even',conditionValue:1,event:'include',eventValue:1},
  controls:[N('n','카드 번호의 최댓값 n',1,18),N('draw','동시에 뽑는 카드 수 r',0,9),S('condition','주어진 조건 B',[['sum-even','카드 합이 짝수'],['include','특정 카드 포함'],['max-eq','최댓값이 특정 수']]),N('conditionValue','조건 B의 카드 번호·최댓값',1,18,'B가 합의 짝수 여부일 때에는 사용하지 않습니다.'),S('event','구하려는 사건 A',[['odd-count','홀수 카드 개수가 특정 수'],['include','특정 카드 포함'],['sum-ge','카드 합이 기준 이상']]),N('eventValue','사건 A의 기준 값',0,180)],
  presets:[{name:'짝수 합과 1번 카드',params:{n:8,draw:3,condition:'sum-even',conditionValue:1,event:'include',eventValue:1}},{name:'1번 포함과 홀수 2장',params:{n:8,draw:3,condition:'include',conditionValue:1,event:'odd-count',eventValue:2}},{name:'최댓값 제한',params:{n:8,draw:3,condition:'max-eq',conditionValue:5,event:'sum-ge',eventValue:10}}]
},({n,draw:r,condition,conditionValue:b,event,eventValue:a})=>{
  let total=0n,countB=0n,countAB=0n,countAoutside=0n,neither=0n;
  const samples=[];
  const check=list=>{
    total++;
    const sum=list.reduce((s,x)=>s+x,0),odd=list.filter(x=>x%2).length;
    const B=condition==='sum-even'?sum%2===0:condition==='include'?list.includes(b):list.length>0&&list.at(-1)===b;
    const A=event==='odd-count'?odd===a:event==='include'?list.includes(a):sum>=a;
    if(B){countB++;if(A)countAB++;if(samples.length<6)samples.push(`{${list.join(', ')}}: ${A?'A∩B':'(A의 여사건)∩B'}`);}
    else if(A)countAoutside++;else neither++;
  };
  const visit=(start,list)=>{if(list.length===r){check(list);return;}for(let x=start;x<=n-(r-list.length)+1;x++)visit(x+1,[...list,x]);};
  visit(1,[]);
  const Btext=condition==='sum-even'?'뽑은 카드에 적힌 수의 합이 짝수':condition==='include'?`${b}번 카드를 포함`:`뽑은 카드에 적힌 수의 최댓값이 ${b}`;
  const Atext=event==='odd-count'?`홀수 카드가 정확히 ${a}장`:event==='include'?`${a}번 카드를 포함`:`카드에 적힌 수의 합이 ${a} 이상`;
  const question=`1부터 ${n}까지의 수가 하나씩 적힌 카드 ${n}장 중 ${r}장을 같은 확률로 동시에 뽑는다. ${Btext}라는 조건 B가 주어졌을 때, ${Atext}인 사건 A의 조건부확률 P(A|B)를 구하시오.`;
  const cases=[{label:'A∩B',count:`${countAB}`,detail:'분자: A와 B를 모두 만족'},{label:'(A의 여사건)∩B',count:`${countB-countAB}`,detail:'B 안에서 A가 성립하지 않음'},{label:'B',count:`${countB}`,detail:'분모: 위 두 경우의 합'},{label:'A∩(B의 여사건)',count:`${countAoutside}`,detail:'A는 만족하지만 B를 만족하지 않음'},{label:'(A의 여사건)∩(B의 여사건)',count:`${neither}`,detail:'A와 B를 모두 만족하지 않음'}];
  const steps=[
    {title:'동일확률의 선택 결과',body:`뽑힌 카드의 순서는 구별하지 않습니다. ${r}장짜리 부분집합은 각각 같은 확률로 선택되고 전체 ${total}가지입니다.`,formula:`전체 표본공간 크기 = C(${n},${r}) = ${total}`},
    {title:'조건 B로 표본공간 줄이기',body:`B를 만족하는 결과만 남기면 ${countB}가지입니다. 이 가운데 A도 함께 만족하는 결과는 ${countAB}가지입니다.`,formula:`|B| = ${countB}, |A∩B| = ${countAB}`},
    {title:'조건부확률 계산',body:countB?'B를 만족하는 결과끼리는 여전히 같은 확률이므로 A∩B의 개수를 B의 개수로 나누어 약분합니다.':'B를 만족하는 결과가 없습니다. 발생할 확률이 0인 조건에 대한 조건부확률은 이 모형에서 정의되지 않습니다.',formula:countB?`P(A|B) = P(A∩B)/P(B) = |A∩B|/|B| = ${countAB}/${countB} = ${fraction(countAB,countB).text}`:'P(B) = 0이므로 P(A|B)는 정의되지 않음'}
  ];
  const extra={cases,samples,chart:[{label:'B 안에서 A 만족',value:Number(countAB)},{label:'B 안에서 A 불만족',value:Number(countB-countAB)}]};
  if(!countB)return {status:'invalid',question,answer:'정의되지 않음',numeric:null,unit:'확률',steps,insight:'P(B)=0이면 조건부확률의 분모가 0입니다. 이를 확률 0으로 처리하지 않습니다.',warnings:['조건 B를 만족하는 선택이 없어 조건부확률이 정의되지 않습니다.'],...extra};
  return probabilityResult(question,countAB,countB,steps,'분모는 전체 선택 수가 아니라 조건 B를 만족하는 선택 수입니다. 분자에는 A만이 아니라 A와 B의 교집합을 셉니다.',extra);
},p=>p.draw>p.n?'뽑는 카드 수 r은 전체 카드 수 n 이하이어야 합니다.':'');

export const countingSpecs = [arrangement,selection,functions,coefficient,probabilityCount,conditional];
