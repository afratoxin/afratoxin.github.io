import { statisticsSpecs } from './statistics.mjs?v=20261026-prompt-style-fix';

const raw = Object.fromEntries(statisticsSpecs.map(spec => [spec.id, spec]));
const LIMIT = 999n;
const finite = value => typeof value === 'number' && Number.isFinite(value);
const fallback = (value, otherwise) => finite(value) ? value : otherwise;
const abs = value => value < 0n ? -value : value;
const gcd = (a, b) => { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a; };
const rational = (n, d = 1n) => { const g = gcd(n, d); return { n: n / g, d: d / g }; };
const subtract = (a, b) => rational(a.n * b.d - b.n * a.d, a.d * b.d);
const fractionText = value => value.d === 1n ? `${value.n}` : `${value.n}/${value.d}`;
const choose = (n, k) => { let count = 1n; for (let j = 1; j <= Math.min(k, n - k); j++) count = count * BigInt(n - j + 1) / BigInt(j); return count; };
const cloneControls = (base, patches = {}) => base.map(control => ({ ...control, ...(control.options ? { options: control.options.map(option => ({ ...option })) } : {}), ...patches[control.key] }));
const measured = (counts = [], fractions = [], values = [], denominators = []) => ({ counts, denominators: [...denominators, ...fractions.map(value => value.d)], values: [...values, ...fractions.map(value => value.n)] });
const exceeds = facts => Object.values(facts).flat().some(value => typeof value === 'bigint' ? abs(value) > LIMIT : !finite(value) || Math.abs(value) > 999);
function inputError(params, controls) {
  if (!params || typeof params !== 'object') return '입력값을 확인하세요.';
  for (const control of controls) {
    const value = params[control.key];
    if (control.type === 'number') {
      const tolerance = control.normalBound ? 1e-7 : 1e-10;
      if (!finite(value) || value < control.min - tolerance || value > control.max + tolerance || control.step === 1 && !Number.isInteger(value)) return `${control.label}: 표시된 범위 안의 ${control.step === 1 ? '정수' : '숫자'}를 입력하세요.`;
    } else if (control.type === 'select' && !control.options.some(option => option.value === value)) return `${control.label}: 제공된 선택지를 사용하세요.`;
  }
  return '';
}
const capError = facts => exceeds(facts) ? '계산에 사용하는 경우의 수와 정확한 분수의 분자·분모, 값은 절댓값 999 이하여야 합니다.' : '';

function normalControls(p, base) {
  const mu = fallback(p.mu, 50), sigma = fallback(p.sigma, 10), n = fallback(p.n, 1);
  const se = sigma > 0 && n > 0 ? sigma / Math.sqrt(n) : 10;
  const min = Math.max(-999, mu - 3 * se), max = Math.min(999, mu + 3 * se);
  const muMin = Math.ceil((-999 + 3 * se - 1e-10) * 10) / 10, muMax = Math.floor((999 - 3 * se + 1e-10) * 10) / 10;
  const bound = { min, max, step: 'any', normalBound: true, zscore: { min: -3, max: 3, step: 0.1, mu, sigma, se, n } };
  return cloneControls(base, { mu: { min: muMin, max: muMax }, sigma: { min: 0.1, max: 30, step: 0.01 }, n: { max: 999 }, lower: { ...bound }, upper: { ...bound } });
}
const normalProfile = {
  presets: raw.normal.presets,
  controls: normalControls,
  validate(p) {
    return inputError(p, normalControls(p, raw.normal.controls)) || (p.lower > p.upper ? '하한은 상한보다 클 수 없습니다.' : '');
  },
  facts(p, result) {
    const se = p.sigma / Math.sqrt(p.n);
    return measured([p.n], [], [p.mu, p.sigma, se, p.lower, p.upper, (p.lower - p.mu) / se, (p.upper - p.mu) / se, result.numeric]);
  }
};

function binomialMaxN(denominator) {
  if (!Number.isInteger(denominator) || denominator < 1 || denominator > 999) return 0;
  let n = 0, power = 1n;
  while (n < 60 && power * BigInt(denominator) <= LIMIT) { power *= BigInt(denominator); n++; }
  return n;
}
function binomialMaxDenominator(n) {
  if (!Number.isInteger(n) || n < 0 || n > 60) return 1;
  if (n === 0) return 999;
  let denominator = 1;
  while (denominator < 999 && BigInt(denominator + 1) ** BigInt(n) <= LIMIT) denominator++;
  return denominator;
}
function binomialControls(p, base) {
  const denominator = fallback(p.denominator, 2), n = fallback(p.n, 8);
  return cloneControls(base, { n: { max: binomialMaxN(denominator) }, denominator: { max: binomialMaxDenominator(n) }, numerator: { max: Math.min(999, Math.max(0, denominator)) }, lower: { max: Math.max(0, n) }, upper: { max: Math.max(0, n) } });
}
function binomialFacts(p) {
  const n = BigInt(p.n), a = BigInt(p.numerator), q = BigInt(p.denominator), total = q ** n;
  let value;
  if (p.query === 'mean') value = rational(n * a, q);
  else if (p.query === 'variance') value = rational(n * a * (q - a), q * q);
  else {
    let successful = 0n;
    for (let k = p.lower; k <= p.upper; k++) successful += choose(p.n, k) * a ** BigInt(k) * (q - a) ** BigInt(p.n - k);
    value = rational(successful, total);
  }
  return measured([p.n], [value], [p.numerator, p.denominator], [total]);
}
const binomialProfile = {
  defaults: { n: 8 },
  presets: [
    { name: '동전 5번, 앞면 2~3번', params: { n: 5, numerator: 1, denominator: 2, lower: 2, upper: 3, query: 'probability' } },
    { name: '성공확률 2/5의 분산', params: { n: 4, numerator: 2, denominator: 5, lower: 0, upper: 4, query: 'variance' } },
    { name: '시행이 없는 경계', params: { n: 0, numerator: 1, denominator: 2, lower: 0, upper: 0, query: 'probability' } }
  ],
  controls: binomialControls,
  validate(p) { return inputError(p, binomialControls(p, raw.binomial.controls)) || (p.lower > p.upper ? '하한은 상한보다 클 수 없습니다.' : capError(binomialFacts(p))); },
  facts: binomialFacts
};

function discreteMath(p) {
  const n = BigInt(p.faces), a = BigInt(p.scale), b = BigInt(p.offset);
  const odd = (n + 1n) / 2n;
  const baseMean = p.transform === 'linear' ? rational(n + 1n, 2n) : p.transform === 'square' ? rational((n + 1n) * (2n * n + 1n), 6n) : rational(odd, n);
  const baseVariance = p.transform === 'linear' ? rational(n * n - 1n, 12n) : p.transform === 'square' ? rational((n + 1n) * (2n * n + 1n) * (8n * n * n + 3n * n - 11n), 180n) : rational(odd * (n - odd), n * n);
  const answer = p.query === 'mean' ? rational(a * baseMean.n + b * baseMean.d, baseMean.d) : rational(a * a * baseVariance.n, baseVariance.d);
  const values = Array.from({ length: p.faces }, (_, i) => { const eye = BigInt(i + 1); return a * (p.transform === 'square' ? eye * eye : p.transform === 'parity' ? eye % 2n : eye) + b; });
  return { baseMean, baseVariance, answer, values };
}
function discreteFacts(p) {
  const math = discreteMath(p);
  const fractions = p.scale === 0 ? [math.answer] : [p.query === 'mean' ? math.baseMean : math.baseVariance, math.answer];
  return measured([p.faces], fractions, math.values, [BigInt(p.faces)]);
}
function feasibleRange(p, key, min, max) {
  const feasible = [];
  for (let value = min; value <= max; value++) if (!exceeds(discreteFacts({ ...p, [key]: value }))) feasible.push(value);
  return feasible.length ? { min: feasible[0], max: feasible.at(-1) } : { min, max: min };
}
function discreteControls(p, base) {
  const safe = { ...raw.discrete.defaults, ...p };
  if (![safe.faces, safe.scale, safe.offset].every(Number.isInteger) || safe.faces < 1 || safe.faces > 30 || !['linear', 'square', 'parity'].includes(safe.transform) || !['mean', 'variance'].includes(safe.query)) return cloneControls(base);
  return cloneControls(base, { faces: feasibleRange(safe, 'faces', 1, 30), scale: feasibleRange(safe, 'scale', -10, 10), offset: feasibleRange(safe, 'offset', -30, 30) });
}
function discreteTeaching(p, result) {
  const { baseMean, baseVariance } = discreteMath(p), target = p.query === 'mean' ? 'E(X)' : 'V(X)';
  if (p.scale === 0) return { ...result, steps: [
    { title: '상수인 확률변수', body: '계수가 0이므로 어떤 눈이 나와도 X의 값은 일정하다.', formula: `X=${p.offset}` },
    { title: '상수의 평균과 분산', body: '상수의 평균은 그 상수이고 분산은 0이다.', formula: `E(X)=${p.offset}, V(X)=0` },
    { title: '구하는 값 확정', body: '불필요한 합이나 모멘트를 계산할 필요가 없다.', formula: `${target}=${result.exact}` }
  ] };
  const formula = p.query === 'mean'
    ? p.transform === 'linear' ? `E(Y)=(n+1)/2=${fractionText(baseMean)}` : p.transform === 'square' ? `E(Y)=(n+1)(2n+1)/6=${fractionText(baseMean)}` : `E(Y)=q=⌈n/2⌉/n=${fractionText(baseMean)}`
    : p.transform === 'linear' ? `V(Y)=(n²−1)/12=${fractionText(baseVariance)}` : p.transform === 'square' ? `V(Y)=(n+1)(2n+1)(8n²+3n−11)/180=${fractionText(baseVariance)}` : `V(Y)=q(1−q)=${fractionText(baseVariance)}`;
  return { ...result, steps: [
    { title: p.query === 'mean' ? '기본변수의 평균 공식' : '기본변수의 분산 공식', body: p.transform === 'parity' ? `Y=g(i)는 홀수이면 1인 지시변수이다. 홀수 눈은 ${Math.ceil(p.faces / 2)}개이므로 q=⌈n/2⌉/n이다.` : p.transform === 'square' ? p.query === 'mean' ? 'Y=i²의 평균은 제곱합을 n으로 나눈 값이다.' : '제곱합과 네제곱합에서 유도한 분산 공식을 사용한다.' : '등확률인 1부터 n까지의 자연수에는 합과 제곱합에서 얻은 평균·분산 공식을 적용한다.', formula },
    { title: '일차변환 공식 적용', body: p.query === 'mean' ? 'X=aY+b의 평균은 aE(Y)+b이다.' : 'X=aY+b의 분산은 a²V(Y)이며 상수 b는 영향을 주지 않는다.', formula: p.query === 'mean' ? `E(X)=(${p.scale})E(Y)+(${p.offset})=${result.exact}` : `V(X)=(${p.scale})²V(Y)=${result.exact}` },
    { title: '구하는 값 확정', body: '구하는 평균 또는 분산에 필요한 공식만 계산한다.', formula: `${target}=${result.exact}` }
  ] };
}
const discreteProfile = {
  presets: [raw.discrete.presets[0], { name: '눈의 제곱의 분산', params: { faces: 5, transform: 'square', scale: 1, offset: 0, query: 'variance' } }, raw.discrete.presets[2]],
  controls: discreteControls,
  validate(p) { return inputError(p, raw.discrete.controls) || capError(discreteFacts(p)); },
  facts: discreteFacts,
  transformResult: discreteTeaching
};

function continuousControls(p, base) {
  const a = fallback(p.a, 0), b = fallback(p.b, 10);
  return cloneControls(base, { a: { min: -100, max: Math.min(100, b - 0.5) }, b: { min: Math.max(-100, a + 0.5), max: 100 }, lower: { min: a, max: b }, upper: { min: a, max: b } });
}
function continuousFacts(p) {
  const a = BigInt(Math.round(2 * p.a)), b = BigInt(Math.round(2 * p.b)), width = b - a;
  const density = rational(p.shape === 'uniform' ? 2n : 4n, width);
  if (p.lower === p.upper) return measured([], [rational(0n), density], [p.a, p.b, p.lower, p.upper]);
  const cdf = x => {
    const coordinate = BigInt(Math.round(2 * x));
    if (coordinate <= a) return rational(0n);
    if (coordinate >= b) return rational(1n);
    if (p.shape === 'uniform') return rational(coordinate - a, width);
    return 2n * coordinate <= a + b ? rational(2n * (coordinate - a) ** 2n, width * width) : rational(width * width - 2n * (b - coordinate) ** 2n, width * width);
  };
  const lower = cdf(p.lower), upper = cdf(p.upper), probability = subtract(upper, lower);
  return measured([], [probability, lower, upper, density], [p.a, p.b, p.lower, p.upper]);
}
const continuousProfile = {
  presets: [raw.continuous.presets[0], raw.continuous.presets[1], { name: '분포 전체의 넓이', params: { shape: 'triangular', a: 0, b: 10, lower: 0, upper: 10 } }],
  controls: continuousControls,
  validate(p) {
    const error = inputError(p, continuousControls(p, raw.continuous.controls));
    if (error) return error;
    if (![p.a, p.b, p.lower, p.upper].every(value => Number.isInteger(2 * value))) return '구간 끝은 0.5 간격의 값으로 입력하세요.';
    return p.a >= p.b || p.lower > p.upper ? '구간의 양 끝과 순서를 확인하세요.' : capError(continuousFacts(p));
  },
  facts: continuousFacts,
  transformResult(p, result) {
    if (p.lower !== p.upper) return result;
    return { ...result, steps: [
      { title: '구간의 길이 확인', body: '하한과 상한이 같으므로 구하는 사건은 한 점만 포함한다.', formula: `${p.lower}≤X≤${p.upper} ⇔ X=${p.lower}` },
      { title: '연속확률변수의 한 점 확률', body: '한 점의 가로 길이는 0이므로 밀도함수 아래의 넓이도 0이다.', formula: `P(X=${p.lower})=0` },
      { title: '구하는 확률 확정', body: '누적확률을 따로 계산할 필요가 없다.', formula: `P(${p.lower}≤X≤${p.upper})=0` }
    ] };
  }
};

const critical = { table: { '90': 1.645, '95': 1.96, '99': 2.58 }, precise: { '90': 1.6448536269514722, '95': 1.959963984540054, '99': 2.5758293035489004 } };
function estimationControls(p, base) {
  const n = fallback(p.n, 100), mean = fallback(p.mean, 50), sigma = fallback(p.sigma, 10), z = critical[p.mode]?.[p.confidence] || 1.96;
  const root = n > 0 ? Math.sqrt(n) : 1, margin = z * sigma / root;
  const chartCritical = Math.max(...Object.values(critical[p.mode] || critical.table));
  const maximumSigma = Math.max(0.01, Math.floor((Math.min(999, (999 - Math.abs(mean)) * root / z, 999 * root / (2 * chartCritical)) + 1e-10) * 100) / 100);
  return cloneControls(base, { n: { max: 999 }, mean: { min: Math.max(-999, -999 + margin), max: Math.min(999, 999 - margin), step: 'any' }, sigma: { min: 0.01, max: maximumSigma, step: 0.01 } });
}
function estimationFacts(p) {
  const z = critical[p.mode][p.confidence], se = p.sigma / Math.sqrt(p.n), margin = z * se;
  return measured([p.n], [], [p.mean, p.sigma, z, se, margin, p.mean - margin, p.mean + margin, 2 * margin, ...Object.values(critical[p.mode]).map(value => 2 * value * se)]);
}
const estimationProfile = {
  presets: raw.estimation.presets,
  controls: estimationControls,
  validate(p) { return inputError(p, estimationControls(p, raw.estimation.controls)) || capError(estimationFacts(p)); },
  facts: estimationFacts
};

const eventProfile = {
  presets: raw['event-algebra'].presets,
  controls: (_params, baseControls) => cloneControls(baseControls),
  validate(p) {
    const error = inputError(p, raw['event-algebra'].controls);
    if (error) return error;
    const total = p.both + p.aOnly + p.bOnly + p.neither;
    if (!total) return '전체 인원은 1 이상이어야 합니다.';
    if (p.query === 'aGivenB' && !p.both && !p.bOnly || p.query === 'bGivenA' && !p.both && !p.aOnly) return '조건 사건의 확률이 0이면 조건부확률은 정의되지 않습니다.';
    return '';
  },
  facts(p) { const total = p.both + p.aOnly + p.bOnly + p.neither; return measured([total, p.both, p.aOnly, p.bOnly, p.neither, p.both + p.aOnly, p.both + p.bOnly], [], [], [BigInt(total)]); }
};

export const statisticsLimitProfiles = { 'event-algebra': eventProfile, binomial: binomialProfile, discrete: discreteProfile, continuous: continuousProfile, normal: normalProfile, estimation: estimationProfile };
