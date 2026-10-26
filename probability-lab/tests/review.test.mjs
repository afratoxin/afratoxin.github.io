import test from 'node:test';
import assert from 'node:assert/strict';
import { integerSumSpec } from '../engines/integer-sum.mjs';
import { countingSpecs } from '../engines/counting.mjs';
import { statisticsSpecs } from '../engines/statistics.mjs';

// These reference outcomes are actual tuples/words, independent of engine DP.
const domains = {
  natural: x => x >= 1,
  nonnegative: x => x >= 0,
  integer: () => true,
  'positive-even': x => x > 0 && x % 2 === 0,
  'positive-odd': x => x > 0 && Math.abs(x % 2) === 1,
  'integer-even': x => x % 2 === 0,
  'integer-odd': x => Math.abs(x % 2) === 1
};
const compare = (sum, relation, total) => ({ eq: sum === total, le: sum <= total, lt: sum < total, ge: sum >= total, gt: sum > total })[relation];
function tuples(values, k, prefix = [], list = []) {
  if (prefix.length === k) list.push(prefix);
  else for (const value of values) tuples(values, k, [...prefix, value], list);
  return list;
}
const accepts = (xs, order, distinct) => (!distinct || new Set(xs).size === xs.length) &&
  xs.every((x, i) => !i || order === 'any' || (order === 'increasing' ? xs[i - 1] < x : xs[i - 1] <= x));

test('independent review: every domain, boundary relation, order and distinctness agrees with bounded tuple enumeration', () => {
  for (const [domain, belongs] of Object.entries(domains)) for (const k of [2, 3, 4]) {
    const universe = tuples([-2, -1, 0, 1, 2, 3].filter(belongs), k);
    for (const order of ['any', 'nondecreasing', 'increasing']) for (const distinct of [false, true]) {
      const allowed = universe.filter(xs => accepts(xs, order, distinct));
      for (const relation of ['eq', 'lt', 'le', 'gt', 'ge']) for (const total of [-5, -1, 0, 1, 4, 8]) {
        const input = { k, domain, total, relation, order, distinct, lowerOn: true, lower: -2, upperOn: true, upper: 3 };
        const expected = allowed.filter(xs => compare(xs.reduce((a, b) => a + b, 0), relation, total)).length;
        const actual = integerSumSpec.solve(input);
        assert.equal(actual.exact, String(expected), JSON.stringify(input));
      }
    }
  }
});

test('independent review: a one-sided bound plus an opposing sum bound is finite, with negative and parity endpoints', () => {
  for (const domain of ['integer', 'integer-even', 'integer-odd']) for (const k of [2, 3]) {
    for (const upperSide of [false, true]) {
      const values = Array.from({ length: 21 }, (_, i) => i - 10).filter(x => domains[domain](x) && (upperSide ? x <= 2 : x >= -2));
      const universe = tuples(values, k);
      for (const relation of upperSide ? ['eq', 'ge', 'gt'] : ['eq', 'le', 'lt']) for (const total of [-4, 0, 4]) {
        for (const order of ['any', 'nondecreasing', 'increasing']) for (const distinct of [false, true]) {
          const input = { k, domain, total, relation, order, distinct, lowerOn: !upperSide, lower: -2, upperOn: upperSide, upper: 2 };
          const expected = universe.filter(xs => accepts(xs, order, distinct) && compare(xs.reduce((a, b) => a + b, 0), relation, total)).length;
          assert.equal(integerSumSpec.solve(input).exact, String(expected), JSON.stringify(input));
        }
      }
    }
  }
});

test('independent review: infinite directions survive ordering and distinctness, while impossible parity remains zero', () => {
  for (const order of ['any', 'nondecreasing', 'increasing']) for (const distinct of [false, true]) {
    for (const input of [
      { domain: 'integer', relation: 'eq', total: 0 },
      { domain: 'natural', relation: 'ge', total: 80 },
      { domain: 'integer', upperOn: true, upper: -30, relation: 'lt', total: -40 },
      { domain: 'integer-odd', relation: 'eq', k: 3, total: 1 }
    ]) assert.equal(integerSumSpec.solve({ ...input, order, distinct }).status, 'infinite', JSON.stringify({ ...input, order, distinct }));
    assert.equal(integerSumSpec.solve({ k: 3, domain: 'integer-odd', relation: 'eq', total: 0, order, distinct }).exact, '0');
  }
});

function multisetWords(a, b, c, prefix = '', result = []) {
  if (!a && !b && !c) result.push(prefix);
  if (a) multisetWords(a - 1, b, c, prefix + 'A', result);
  if (b) multisetWords(a, b - 1, c, prefix + 'B', result);
  if (c) multisetWords(a, b, c - 1, prefix + 'C', result);
  return result;
}
function canonical(word) {
  return Array.from({ length: word.length }, (_, shift) => word.slice(shift) + word.slice(0, shift)).sort()[0];
}
function circularAccepts(word, condition) {
  if (condition === 'none') return true;
  if (condition === 'apart') return !Array.from(word).some((x, i) => x === 'A' && word[(i + 1) % word.length] === 'A');
  const count = [...word].filter(x => x === 'A').length;
  if (!count || count === word.length) return true;
  return [...word].filter((x, i) => x === 'A' && word[(i + word.length - 1) % word.length] !== 'A').length === 1;
}

test('independent review: periodic circular words and wraparound adjacency agree with full rotation equivalence classes', () => {
  const spec = countingSpecs.find(s => s.id === 'arrangement');
  for (const [a, b, c] of [[6, 6, 0], [4, 4, 2], [3, 3, 3], [6, 0, 0], [0, 6, 6]]) {
    const words = multisetWords(a, b, c);
    for (const condition of ['none', 'apart', 'together']) {
      const expected = new Set(words.filter(word => circularAccepts(word, condition)).map(canonical)).size;
      assert.equal(spec.solve({ a, b, c, condition, circular: true }).exact, String(expected), JSON.stringify({ a, b, c, condition }));
    }
  }
});

const integerGcd = (a, b) => b ? integerGcd(b, a % b) : a;
const rational = (n, d) => { const g = integerGcd(n, d); return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`; };

test('independent review: binomial probabilities agree with equally likely elementary trial strings', () => {
  const spec = statisticsSpecs.find(s => s.id === 'binomial');
  for (let n = 0; n <= 6; n++) {
    const universe = tuples([0, 1, 2], n);
    for (let numerator = 0; numerator <= 3; numerator++) {
      const counts = universe.map(xs => xs.filter(x => x < numerator).length);
      for (let lower = 0; lower <= n; lower++) for (let upper = lower; upper <= n; upper++) {
        const accepted = counts.filter(x => x >= lower && x <= upper).length;
        assert.equal(spec.solve({ n, numerator, denominator: 3, lower, upper }).exact, rational(accepted, universe.length));
      }
    }
  }
});

// Trapezoid area is exact on each straight edge and does not use the engine CDF.
function areaBetween(a, b, lower, upper, triangular) {
  const lo = Math.max(a, lower), hi = Math.min(b, upper);
  if (lo >= hi) return 0;
  if (!triangular) return (hi - lo) / (b - a);
  const peak = (a + b) / 2;
  const y = x => x <= peak ? (x - a) / (peak - a) * 2 / (b - a) : (b - x) / (b - peak) * 2 / (b - a);
  const knots = [lo, ...(peak > lo && peak < hi ? [peak] : []), hi];
  return knots.slice(1).reduce((sum, x, i) => sum + (x - knots[i]) * (y(x) + y(knots[i])) / 2, 0);
}

test('independent review: continuous probabilities match clipped rectangle and trapezoid areas', () => {
  const spec = statisticsSpecs.find(s => s.id === 'continuous');
  for (const [a, b] of [[-3.5, 7.5], [-100, 100], [1, 1.5]]) for (const shape of ['uniform', 'triangular']) {
    for (const [lower, upper] of [[-200, -101], [-200, 200], [-2, 3], [0, 0], [1, 1.25], [1.25, 1.5], [5, 8], [100, 200]]) {
      const expected = areaBetween(a, b, lower, upper, shape === 'triangular');
      const actual = spec.solve({ a, b, lower, upper, shape }).numeric;
      assert.ok(Math.abs(actual - expected) < 1e-12, JSON.stringify({ a, b, lower, upper, shape, actual, expected }));
    }
  }
});

test('independent review: all thirteen specs and all advertised presets have usable outputs', () => {
  const specs = [integerSumSpec, ...countingSpecs, ...statisticsSpecs];
  assert.equal(specs.length, 13);
  assert.equal(new Set(specs.map(s => s.id)).size, 13);
  for (const spec of specs) {
    for (const params of [{}, ...spec.presets.map(p => p.params)]) {
      const result = spec.solve(params);
      assert.notEqual(result.status, 'invalid', `${spec.id}: ${JSON.stringify(params)}`);
      assert.ok(result.question && result.answer && result.steps.length && result.insight, spec.id);
      assert.ok(result.numeric === null || Number.isFinite(result.numeric), spec.id);
      assert.ok((result.chart || []).every(row => Number.isFinite(row.value)), spec.id);
      assert.doesNotMatch(JSON.stringify(result), /NaN|undefined/, spec.id);
    }
    for (const input of [null, [], 7]) assert.equal(spec.solve(input).status, 'invalid', spec.id);
    for (const control of spec.controls.filter(c => c.type === 'number')) {
      assert.equal(spec.solve({ [control.key]: NaN }).status, 'invalid', `${spec.id}.${control.key}`);
      assert.equal(spec.solve({ [control.key]: Infinity }).status, 'invalid', `${spec.id}.${control.key}`);
    }
  }
});

test('independent review: inherited object keys cannot act as integer-sum domain or relation choices', () => {
  for (const key of ['toString', '__proto__', 'constructor']) {
    assert.equal(integerSumSpec.solve({ domain: key }).status, 'invalid');
    assert.equal(integerSumSpec.solve({ relation: key }).status, 'invalid');
  }
});
