// Native ES modules only. Counting probabilities use BigInt throughout.
const gcd = (a, b) => { a = a < 0n ? -a : a; while (b) [a, b] = [b, a % b]; return a; };
function fraction(n, d = 1n) {
  n = BigInt(n); d = BigInt(d);
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  n /= g; d /= g;
  return { exact: d === 1n ? `${n}` : `${n}/${d}`, numeric: Number(n) / Number(d) };
}
function choose(n, k) {
  let result = 1n;
  k = Math.min(k, n - k);
  for (let i = 1; i <= k; i++) result = result * BigInt(n - k + i) / BigInt(i);
  return result;
}
const fmt = (value, digits = 6) => {
  if (value === 0 || Object.is(value, -0)) return '0';
  if (Math.abs(value) < 1e-6) return value.toExponential(5);
  return Number(value.toFixed(digits)).toString();
};
const clamp = (value, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, value));
const numberControl = (key, label, min, max, step = 1, help) => ({ key, label, type: 'number', min, max, step, ...(help ? { help } : {}) });
const selectControl = (key, label, choices) => ({ key, label, type: 'select', options: choices.map(([value, text]) => ({ value, label: text })) });

function invalid(messages) {
  return {
    status: 'invalid', question: '입력 조건을 만족시키도록 매개변수를 바꾼 뒤 다시 계산하시오.',
    answer: messages.join(' '), numeric: null, unit: '',
    steps: [{ title: '입력 조건 확인', body: messages.join(' ') }], insight: '입력 범위와 분모, 구간의 순서를 먼저 확인하세요.', warnings: messages
  };
}
function define(config, calculate) {
  return { ...config, solve(raw = {}) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return invalid(['매개변수는 객체로 입력해야 합니다.']);
    const params = { ...config.defaults, ...raw };
    const errors = [];
    for (const key of Object.keys(raw)) if (!Object.hasOwn(config.defaults, key)) errors.push(`지원하지 않는 매개변수: ${key}`);
    for (const control of config.controls) {
      const value = params[control.key];
      if (control.type === 'number') {
        if (typeof value !== 'number' || !Number.isFinite(value)) errors.push(`${control.label}: 유한한 숫자를 입력하세요.`);
        else if (value < control.min || value > control.max) errors.push(`${control.label}: ${control.min} 이상 ${control.max} 이하로 입력하세요.`);
        else if (control.step === 1 && !Number.isInteger(value)) errors.push(`${control.label}: 정수를 입력하세요.`);
      } else if (!control.options.some(option => option.value === value)) errors.push(`${control.label}: 제공된 선택지 중 하나를 고르세요.`);
    }
    return errors.length ? invalid(errors) : calculate(params);
  } };
}

const eventAlgebra = define({
  id: 'event-algebra', title: '사건의 연산과 조건부확률', category: '확률',
  description: '겹치는 두 사건을 네 칸으로 나누어 합집합, 조건부확률과 독립을 비교합니다.',
  defaults: { both: 18, aOnly: 12, bOnly: 8, neither: 12, query: 'union' },
  controls: [
    numberControl('both', 'A와 B 모두 해당', 0, 100), numberControl('aOnly', 'A에만 해당', 0, 100),
    numberControl('bOnly', 'B에만 해당', 0, 100), numberControl('neither', '둘 다 해당하지 않음', 0, 100),
    selectControl('query', '구할 것', [['union', 'P(A∪B)'], ['intersection', 'P(A∩B)'], ['aGivenB', 'P(A|B)'], ['bGivenA', 'P(B|A)'], ['independence', 'A와 B의 독립 여부']])
  ],
  presets: [
    { name: '합집합에서 겹친 부분 빼기', params: { query: 'union' } },
    { name: '분모가 달라지는 조건부확률', params: { query: 'aGivenB' } },
    { name: '독립인 두 사건', params: { both: 10, aOnly: 10, bOnly: 15, neither: 15, query: 'independence' } }
  ]
}, p => {
  const total = p.both + p.aOnly + p.bOnly + p.neither;
  if (!total) return invalid(['전체 인원수는 1 이상이어야 합니다.']);
  const a = p.both + p.aOnly, b = p.both + p.bOnly;
  if ((p.query === 'aGivenB' && !b) || (p.query === 'bGivenA' && !a)) return invalid(['조건으로 삼은 사건의 확률이 0이므로 조건부확률을 정의할 수 없습니다.']);
  const count = { union: a + b - p.both, intersection: p.both, aGivenB: p.both, bGivenA: p.both };
  const symbol = { union: 'P(A∪B)', intersection: 'P(A∩B)', aGivenB: 'P(A|B)', bGivenA: 'P(B|A)' };
  const independent = p.both * total === a * b;
  const value = p.query === 'independence' ? { exact: independent ? '독립' : '독립 아님', numeric: independent ? 1 : 0 }
    : fraction(count[p.query], p.query === 'aGivenB' ? b : p.query === 'bGivenA' ? a : total);
  const pa = fraction(a, total).exact, pb = fraction(b, total).exact, pab = fraction(p.both, total).exact;
  const steps = [
    { title: '네 영역으로 전체를 세기', body: '서로 겹치지 않는 네 영역의 인원수를 더하면 전체 인원수이다.', formula: `N = ${p.both}+${p.aOnly}+${p.bOnly}+${p.neither} = ${total}` },
    { title: '주변 사건의 크기 구하기', body: 'A에 속한 인원에는 A에만 속한 사람과 두 사건 모두에 속한 사람이 포함된다. B도 같은 방식으로 센다.', formula: `n(A)=${a}, n(B)=${b}, n(A∩B)=${p.both}` }
  ];
  if (p.query === 'union') steps.push({ title: '중복을 한 번 빼기', body: 'A와 B를 더하면 교집합을 두 번 세므로 한 번 뺀다.', formula: `P(A∪B) = (${a}+${b}−${p.both})/${total} = ${value.exact}` });
  else if (p.query === 'intersection') steps.push({ title: '교집합을 전체로 나누기', body: '두 조건을 모두 만족하는 사람을 전체에서 뽑을 확률이다.', formula: `P(A∩B) = ${p.both}/${total} = ${value.exact}` });
  else if (p.query === 'independence') steps.push({ title: '독립의 필요충분조건 확인', body: `P(A∩B)와 P(A)P(B)를 분수 그대로 비교한다. 두 값이 ${independent ? '같으므로 독립이다.' : '다르므로 독립이 아니다.'}`, formula: `${p.both}×${total} ${independent ? '=' : '≠'} ${a}×${b}` });
  else steps.push({ title: '조건으로 표본공간 줄이기', body: `이미 ${p.query === 'aGivenB' ? 'B' : 'A'}가 일어났으므로 그 사건에 속한 사람만 분모에 놓는다.`, formula: `${symbol[p.query]} = ${p.both}/${p.query === 'aGivenB' ? b : a} = ${value.exact}` });
  return {
    status: 'ok', question: `어느 모임에서 두 조건 A, B를 조사하였다. 두 조건 모두 해당하는 사람은 ${p.both}명, A에만 해당하는 사람은 ${p.aOnly}명, B에만 해당하는 사람은 ${p.bOnly}명, 어느 조건에도 해당하지 않는 사람은 ${p.neither}명이다. 이 모임에서 한 명을 같은 가능성으로 뽑을 때 ${p.query === 'independence' ? '사건 A와 B가 독립인지 판정하시오.' : `${symbol[p.query]}를 구하시오.`}`,
    answer: p.query === 'independence' ? `두 사건은 ${independent ? '독립이다.' : '독립이 아니다.'}` : `${symbol[p.query]} = ${value.exact}`,
    ...value, unit: p.query === 'independence' ? '판정' : '확률', steps,
    insight: p.query === 'independence' ? '배반과 독립은 다릅니다. 교집합이 비었다는 사실만으로 독립이라고 할 수 없습니다.' : `P(A)=${pa}, P(B)=${pb}, P(A∩B)=${pab}. 조건부확률은 조건 사건이 분모가 됩니다.`,
    cases: [{ label: 'A∩B', count: `${p.both}` }, { label: 'A∩Bᶜ', count: `${p.aOnly}` }, { label: 'Aᶜ∩B', count: `${p.bOnly}` }, { label: 'Aᶜ∩Bᶜ', count: `${p.neither}` }],
    chart: [{ label: 'A와 B 모두', value: p.both / total }, { label: 'A만', value: p.aOnly / total }, { label: 'B만', value: p.bOnly / total }, { label: '어느 쪽도 아님', value: p.neither / total }]
  };
});

const binomial = define({
  id: 'binomial', title: '이항분포의 확률과 평균', category: '확률분포',
  description: '독립시행의 횟수와 성공확률을 바꾸며 이항분포의 확률, 평균, 분산을 계산합니다.',
  defaults: { n: 10, numerator: 1, denominator: 2, lower: 3, upper: 6, query: 'probability' },
  controls: [numberControl('n', '독립시행 횟수 n', 0, 60), numberControl('numerator', '성공확률의 분자', 0, 1000), numberControl('denominator', '성공확률의 분모', 1, 1000), numberControl('lower', '성공 횟수의 하한', 0, 60), numberControl('upper', '성공 횟수의 상한', 0, 60), selectControl('query', '구할 것', [['probability', '구간 확률'], ['mean', '평균 E(X)'], ['variance', '분산 V(X)']])],
  presets: [{ name: '동전 5번, 앞면 2~3번', params: { n: 5, numerator: 1, denominator: 2, lower: 2, upper: 3, query: 'probability' } }, { name: '성공확률 2/5의 분산', params: { numerator: 2, denominator: 5, query: 'variance' } }, { name: '시행이 없는 경계', params: { n: 0, lower: 0, upper: 0 } }]
}, p => {
  if (p.numerator > p.denominator) return invalid(['성공확률은 0 이상 1 이하이어야 하므로 분자가 분모보다 클 수 없습니다.']);
  if (p.lower > p.upper || (p.query === 'probability' && p.upper > p.n)) return invalid(['확률을 구하는 구간은 0 ≤ 하한 ≤ 상한 ≤ n이어야 합니다.']);
  const den = BigInt(p.denominator), num = BigInt(p.numerator), fail = den - num, total = den ** BigInt(p.n);
  const masses = Array.from({ length: p.n + 1 }, (_, k) => choose(p.n, k) * num ** BigInt(k) * fail ** BigInt(p.n - k));
  const sum = masses.slice(p.lower, p.upper + 1).reduce((a, b) => a + b, 0n);
  const value = p.query === 'mean' ? fraction(BigInt(p.n) * num, den) : p.query === 'variance' ? fraction(BigInt(p.n) * num * fail, den * den) : fraction(sum, total);
  const prob = fraction(num, den).exact;
  const target = p.query === 'mean' ? 'E(X)' : p.query === 'variance' ? 'V(X)' : `P(${p.lower}≤X≤${p.upper})`;
  const third = p.query === 'probability'
    ? { title: '정수 구간의 확률 더하기', body: `양 끝을 포함하여 k=${p.lower}부터 ${p.upper}까지의 확률을 더한다.`, formula: `${target} = Σ P(X=k) = ${value.exact}` }
    : { title: p.query === 'mean' ? '평균 계산' : '분산 계산', body: p.query === 'mean' ? '각 시행의 성공 지시변수의 평균을 더하면 된다.' : '독립인 성공 지시변수의 분산을 더하면 된다.', formula: `${target} = ${p.query === 'mean' ? 'np' : 'np(1−p)'} = ${value.exact}` };
  return {
    status: 'ok', question: `한 번의 시행에서 성공할 확률이 ${prob}인 실험을 서로 독립적으로 ${p.n}번 반복한다. 성공한 횟수를 확률변수 X라 할 때 ${target}를 구하시오.`,
    answer: `${target} = ${value.exact}`, ...value, unit: p.query === 'probability' ? '확률' : p.query === 'mean' ? '회' : '회²',
    steps: [{ title: '이항분포 확인', body: '각 시행은 성공과 실패로 나뉘고 성공확률은 일정하며, 시행끼리 독립이다.', formula: `X ~ B(${p.n}, ${prob})` }, { title: '한 가지 성공 횟수의 확률', body: 'k번 성공하는 위치를 고른 뒤 각 배열의 확률을 곱한다. p=0 또는 p=1도 해당 점에 확률 1을 둔다.', formula: `P(X=k) = ${p.n}Ck·(${prob})ᵏ·(1−${prob})⁽${p.n}−k⁾` }, third],
    insight: '평균 np는 분포의 중심을, 분산 np(1−p)는 흩어진 정도를 나타냅니다. p가 0이나 1이면 성공 횟수는 상수입니다.',
    cases: masses.map((mass, k) => ({ label: `X=${k}`, count: fraction(mass, total).exact, detail: '해당 성공 횟수의 확률' })),
    chart: masses.map((mass, k) => ({ label: `${k}회`, value: fraction(mass, total).numeric }))
  };
});

const discrete = define({
  id: 'discrete', title: '이산확률변수와 변환', category: '확률분포',
  description: '공정한 n면체의 눈을 함수로 바꾸고 같은 확률변수 값을 묶어 평균과 분산을 구합니다.',
  defaults: { faces: 6, transform: 'linear', scale: 1, offset: 0, query: 'mean' },
  controls: [numberControl('faces', '면의 수 n', 1, 30), selectControl('transform', '기본함수 g(i)', [['linear', 'g(i)=i'], ['square', 'g(i)=i²'], ['parity', '홀수이면 1, 짝수이면 0']]), numberControl('scale', '계수 a', -10, 10), numberControl('offset', '상수 b', -30, 30), selectControl('query', '구할 것', [['mean', '평균 E(X)'], ['variance', '분산 V(X)']])],
  presets: [{ name: '공정한 주사위', params: { faces: 6, transform: 'linear', scale: 1, offset: 0 } }, { name: '눈의 제곱', params: { transform: 'square', query: 'variance' } }, { name: '5면체의 홀짝', params: { faces: 5, transform: 'parity', query: 'mean' } }]
}, p => {
  const groups = new Map();
  let sum = 0n, sumSquares = 0n;
  for (let i = 1; i <= p.faces; i++) {
    const g = p.transform === 'square' ? i * i : p.transform === 'parity' ? i % 2 : i;
    const x = p.scale * g + p.offset;
    groups.set(x, (groups.get(x) || 0) + 1);
    sum += BigInt(x); sumSquares += BigInt(x) ** 2n;
  }
  const n = BigInt(p.faces), mean = fraction(sum, n), moment = fraction(sumSquares, n), variance = fraction(sumSquares * n - sum * sum, n * n);
  const value = p.query === 'mean' ? mean : variance;
  const description = p.transform === 'square' ? 'i²' : p.transform === 'parity' ? 'i가 홀수이면 1, 짝수이면 0' : 'i';
  const entries = [...groups].sort((a, b) => a[0] - b[0]);
  const target = p.query === 'mean' ? 'E(X)' : 'V(X)';
  return {
    status: 'ok', question: `1부터 ${p.faces}까지의 자연수가 하나씩 적힌 공정한 ${p.faces}면체를 한 번 던진다. 나온 눈 i에 대하여 g(i)=${description}, X=${p.scale}g(i)+(${p.offset})로 정할 때 ${target}를 구하시오.`,
    answer: `${target} = ${value.exact}`, ...value, unit: p.query === 'mean' ? '값' : '값²',
    steps: [{ title: '확률분포 만들기', body: `각 눈의 확률은 1/${p.faces}이다. 서로 다른 눈이 같은 X 값으로 바뀌면 그 확률을 합한다.`, formula: 'P(X=x) = X=x가 되는 눈의 수 / 전체 면의 수' }, { title: '일차와 이차 모멘트', body: '확률변수의 값에 각각의 확률을 곱해 더한다. E(X²)는 평균을 제곱한 값과 다르다.', formula: `E(X)=${mean.exact}, E(X²)=${moment.exact}` }, { title: p.query === 'mean' ? '평균 읽기' : '평균의 제곱을 빼기', body: p.query === 'mean' ? '확률로 가중한 값의 합이 구하는 평균이다.' : '분산은 이차 모멘트에서 평균의 제곱을 뺀 값이다.', formula: p.query === 'mean' ? `E(X)=${value.exact}` : `V(X)=E(X²)−{E(X)}²=${value.exact}` }],
    insight: '일차변환 aY+b에서 평균은 aE(Y)+b, 분산은 a²V(Y)입니다. 상수를 더해도 분산은 변하지 않습니다.',
    cases: entries.map(([x, count]) => ({ label: `X=${x}`, count: `${count}`, detail: `P(X=${x})=${fraction(count, p.faces).exact}` })),
    chart: entries.map(([x, count]) => ({ label: `X=${x}`, value: count / p.faces }))
  };
});

const continuous = define({
  id: 'continuous', title: '확률밀도함수의 넓이', category: '확률분포',
  description: '균등분포와 가운데에 꼭짓점이 있는 삼각형 밀도함수에서 구간의 넓이를 구합니다.',
  defaults: { shape: 'triangular', a: 0, b: 10, lower: 2, upper: 8 },
  controls: [selectControl('shape', '밀도함수 모양', [['uniform', '균등분포'], ['triangular', '가운데가 높은 삼각형']]), numberControl('a', '분포의 왼쪽 끝 a', -100, 100, 0.5), numberControl('b', '분포의 오른쪽 끝 b', -100, 100, 0.5), numberControl('lower', '구할 구간의 왼쪽 끝', -200, 200, 0.5), numberControl('upper', '구할 구간의 오른쪽 끝', -200, 200, 0.5)],
  presets: [{ name: '삼각형의 가운데 60%', params: { shape: 'triangular', a: 0, b: 10, lower: 2, upper: 8 } }, { name: '균등분포의 같은 길이', params: { shape: 'uniform', a: 0, b: 10, lower: 2, upper: 8 } }, { name: '분포 밖까지 넓힌 구간', params: { a: 0, b: 10, lower: -5, upper: 15 } }]
}, p => {
  if (p.a >= p.b) return invalid(['밀도함수의 양 끝은 a < b를 만족해야 합니다.']);
  if (p.lower > p.upper) return invalid(['구간의 왼쪽 끝은 오른쪽 끝보다 클 수 없습니다.']);
  const width = p.b - p.a, middle = (p.a + p.b) / 2;
  const cdf = x => {
    if (x <= p.a) return 0;
    if (x >= p.b) return 1;
    if (p.shape === 'uniform') return (x - p.a) / width;
    return x <= middle ? 2 * ((x - p.a) / width) ** 2 : 1 - 2 * ((p.b - x) / width) ** 2;
  };
  const fl = cdf(p.lower), fu = cdf(p.upper), probability = clamp(fu - fl);
  const density = p.shape === 'uniform' ? '구간 [a,b]에서 f(x)=1/(b−a), 그 밖에서는 0' : '꼭짓점 ((a+b)/2, 2/(b−a))과 밑변의 양 끝 (a,0), (b,0)을 잇는 삼각형이고, [a,b] 밖에서는 0';
  return {
    status: 'ok', question: `a=${p.a}, b=${p.b}이다. 연속확률변수 X의 확률밀도함수는 ${density}이다. P(${p.lower}≤X≤${p.upper})를 구하시오.`,
    answer: `P(${p.lower}≤X≤${p.upper}) ≈ ${fmt(probability, 10)}`, numeric: probability, unit: '확률',
    steps: [{ title: '전체 넓이 1 확인', body: p.shape === 'uniform' ? '높이는 밑변 길이의 역수이므로 직사각형의 넓이는 1이다.' : '삼각형의 넓이가 1이므로 높이는 밑변 길이의 역수의 2배이다.', formula: p.shape === 'uniform' ? `높이=1/(b−a)≈${fmt(1 / width)}` : `높이=2/(b−a)≈${fmt(2 / width)}` }, { title: '누적확률로 나타내기', body: 'F(x)=P(X≤x)라 두면 구간의 확률은 양 끝의 누적확률 차이다. 분포 바깥에서 F는 각각 0 또는 1이다.', formula: p.shape === 'uniform' ? 'F(x)=(x−a)/(b−a), a≤x≤b' : 'F(x)=2{(x−a)/(b−a)}² (a≤x≤중점), 1−2{(b−x)/(b−a)}² (중점≤x≤b)' }, { title: '양 끝의 누적확률 빼기', body: '연속확률변수는 한 점의 확률이 0이므로 구간 끝의 포함 여부는 결과에 영향을 주지 않는다.', formula: `P(${p.lower}≤X≤${p.upper})=F(${p.upper})−F(${p.lower})≈${fmt(fu, 10)}−${fmt(fl, 10)}≈${fmt(probability, 10)}` }],
    insight: '확률은 밀도함수의 높이가 아니라 구간 아래의 넓이입니다. 밀도의 높이는 1보다 클 수도 있습니다.',
    warnings: ['표시된 소수 확률과 밀도 높이는 반올림한 근사값입니다.', ...(p.lower < p.a || p.upper > p.b ? ['분포의 범위를 벗어난 부분의 확률은 0으로 계산했습니다.'] : [])],
    chart: Array.from({ length: 10 }, (_, i) => { const a = p.a + width * i / 10, b = p.a + width * (i + 1) / 10; return { label: `${fmt(a)}~${fmt(b)}`, value: clamp(cdf(b) - cdf(a)) }; })
  };
});

// Composite Simpson integration of the standard-normal upper tail.
// 1024 subintervals give better than 1e-8 absolute accuracy over our domain.
// Keeping the upper-tail form avoids cancellation for intervals such as [8,9].
function normalTail(z) {
  if (z >= 12) return 0;
  if (z === 0) return 0.5;
  const count = 1024, h = (12 - z) / count;
  const density = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  let sum = density(z) + density(12);
  for (let i = 1; i < count; i++) sum += (i % 2 ? 4 : 2) * density(z + i * h);
  return clamp(sum * h / 3, 0, 0.5);
}
function normalInterval(lower, upper) {
  if (lower === upper) return 0;
  if (lower >= 0) return clamp(normalTail(lower) - normalTail(upper));
  if (upper <= 0) return clamp(normalTail(-upper) - normalTail(-lower));
  return clamp(1 - normalTail(-lower) - normalTail(upper));
}
const normal = define({
  id: 'normal', title: '정규분포와 표본평균', category: '통계',
  description: '모표준편차와 표본크기를 바꾸며 표본평균을 표준화하고 구간확률을 비교합니다.',
  defaults: { mu: 50, sigma: 10, n: 1, lower: 40, upper: 60 },
  controls: [numberControl('mu', '모평균 μ', -1000, 1000, 0.1), numberControl('sigma', '모표준편차 σ', 0.01, 1000, 0.01), numberControl('n', '독립 표본의 크기 n', 1, 10000), numberControl('lower', '표본평균 구간의 하한', -10000, 10000, 0.1), numberControl('upper', '표본평균 구간의 상한', -10000, 10000, 0.1)],
  presets: [{ name: '평균에서 표준편차 한 칸', params: { mu: 50, sigma: 10, n: 1, lower: 40, upper: 60 } }, { name: '표본크기 25, 같은 표준화', params: { mu: 50, sigma: 10, n: 25, lower: 48, upper: 52 } }, { name: '평균에서 표준편차 두 칸', params: { mu: 0, sigma: 1, n: 1, lower: -2, upper: 2 } }]
}, p => {
  if (p.lower > p.upper) return invalid(['구간의 하한은 상한보다 클 수 없습니다.']);
  const se = p.sigma / Math.sqrt(p.n), zl = (p.lower - p.mu) / se, zu = (p.upper - p.mu) / se;
  const probability = normalInterval(zl, zu);
  return {
    status: 'ok', question: `모평균이 ${p.mu}, 모표준편차가 ${p.sigma}인 정규분포에서 크기가 ${p.n}인 표본을 독립적으로 추출한다. 표본평균을 X̄라 할 때 P(${p.lower}≤X̄≤${p.upper})를 구하시오.`,
    answer: `P(${p.lower}≤X̄≤${p.upper}) ≈ ${fmt(probability, 10)} (약 ${fmt(100 * probability, 6)}%)`, numeric: probability, unit: '확률',
    steps: [{ title: '표본평균의 분포', body: '정규모집단에서 독립적으로 추출한 표본평균도 정규분포를 따른다. 표본평균의 표준편차는 σ/√n이다.', formula: `E(X̄)=${p.mu}, σ(X̄)=${p.sigma}/√${p.n}=${fmt(se, 10)}` }, { title: '양 끝을 표준화', body: '평균을 빼고 표본평균의 표준편차로 나눈다. σ 자체로 나누는 것과 구별한다.', formula: `Z=(X̄−${p.mu})/${fmt(se, 10)}, z₁=${fmt(zl, 8)}, z₂=${fmt(zu, 8)}` }, { title: '표준정규분포의 넓이', body: 'Φ(z)=P(Z≤z)라 하면 두 누적확률의 차가 구하는 확률이다. 이 실험실에서는 밀도함수를 수치적분하여 근사한다.', formula: `P(${fmt(zl, 8)}≤Z≤${fmt(zu, 8)})=Φ(${fmt(zu, 8)})−Φ(${fmt(zl, 8)})≈${fmt(probability, 10)}` }],
    insight: '표본크기가 4배가 되면 표본평균의 표준편차는 절반이 됩니다. 같은 실제 구간이라도 표준화된 구간은 더 넓어집니다.',
    warnings: ['정규분포 확률은 수치 근사값입니다. 표준정규분포표의 반올림값과 약간 다를 수 있습니다.'],
    chart: Array.from({ length: 12 }, (_, i) => { const l = -3 + i * 0.5, u = l + 0.5; return { label: `${fmt(p.mu + l * se)}~${fmt(p.mu + u * se)}`, value: normalInterval(l, u) }; })
  };
});

const critical = { '90': 1.6448536269514722, '95': 1.959963984540054, '99': 2.5758293035489004 };
const estimation = define({
  id: 'estimation', title: '모평균의 신뢰구간', category: '통계',
  description: '모표준편차를 아는 정규모집단에서 신뢰수준, 표본크기와 신뢰구간의 길이를 비교합니다.',
  defaults: { mean: 50, sigma: 10, n: 100, confidence: '95', query: 'interval' },
  controls: [numberControl('mean', '표본평균 x̄', -1000, 1000, 0.1), numberControl('sigma', '알려진 모표준편차 σ', 0.01, 1000, 0.01), numberControl('n', '독립 표본의 크기 n', 1, 10000), selectControl('confidence', '신뢰수준', [['90', '90%'], ['95', '95%'], ['99', '99%']]), selectControl('query', '구할 것', [['interval', '모평균의 신뢰구간'], ['length', '신뢰구간의 길이']])],
  presets: [{ name: '95% 신뢰구간', params: { mean: 50, sigma: 10, n: 100, confidence: '95', query: 'interval' } }, { name: '표본크기 네 배', params: { n: 400, query: 'length' } }, { name: '99%로 신뢰수준 높이기', params: { confidence: '99', query: 'interval' } }]
}, p => {
  const z = critical[p.confidence], se = p.sigma / Math.sqrt(p.n), margin = z * se, lower = p.mean - margin, upper = p.mean + margin, length = 2 * margin;
  return {
    status: 'ok', question: `모표준편차 σ=${p.sigma}가 알려진 정규모집단에서 크기가 ${p.n}인 표본을 독립적으로 추출하였더니 표본평균이 ${p.mean}이었다. 모평균 μ의 신뢰수준 ${p.confidence}% ${p.query === 'length' ? '신뢰구간의 길이를' : '신뢰구간을'} 구하시오. 신뢰구간 계산에는 임계값 z≈${fmt(z, 10)}를 사용한다.`,
    answer: p.query === 'length' ? `신뢰구간의 길이 ≈ ${fmt(length, 10)}` : `${fmt(lower)} ≤ μ ≤ ${fmt(upper)} (길이 약 ${fmt(length)})`, numeric: length, unit: '구간 길이',
    steps: [{ title: '신뢰수준에 맞는 임계값', body: `표준정규분포의 가운데 ${p.confidence}%를 남기는 양의 임계값을 z라 둔다. 모표준편차를 알고 있으므로 z 신뢰구간을 사용한다.`, formula: `P(−z≤Z≤z)=${Number(p.confidence) / 100}, z≈${fmt(z, 10)}` }, { title: '표준오차와 오차한계', body: '표준오차에 임계값을 곱하면 표본평균의 좌우에 더할 오차한계가 된다.', formula: `표준오차=σ/√n=${fmt(se, 10)}, 오차한계=zσ/√n≈${fmt(margin, 10)}` }, { title: '구간과 길이 구하기', body: '표본평균을 중심으로 오차한계만큼 양쪽으로 넓힌다. 길이는 오차한계의 두 배이다.', formula: `[x̄−zσ/√n, x̄+zσ/√n]≈[${fmt(lower)}, ${fmt(upper)}], 길이≈${fmt(length, 10)}` }],
    insight: '표본평균은 구간의 위치를 바꿉니다. 표준편차와 신뢰수준은 클수록 구간이 길어지고, 표본크기는 클수록 구간이 짧아집니다. 신뢰수준은 같은 절차를 반복했을 때 구간이 모평균을 포함하는 비율을 뜻합니다.',
    warnings: ['임계값은 수치 근사값입니다. 교과서에서 z=1.96 등으로 반올림하여 계산한 값과 약간 다를 수 있습니다.'],
    cases: [{ label: '구간의 하한', count: fmt(lower, 10) }, { label: '구간의 상한', count: fmt(upper, 10) }, { label: '구간의 길이', count: fmt(length, 10) }],
    chart: ['90', '95', '99'].map(level => ({ label: `${level}% 구간 길이`, value: 2 * critical[level] * se }))
  };
});

export const statisticsSpecs = [eventAlgebra, binomial, discrete, continuous, normal, estimation];
