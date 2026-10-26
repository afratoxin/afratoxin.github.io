import test from 'node:test';
import assert from 'node:assert/strict';
import { countingSpecs } from '../engines/counting.mjs';

const solve = (id, params) => countingSpecs.find(spec => spec.id === id).solve(params);
const choose = (n, k) => {
  if (n < 0 || k < 0 || k > n) return 0n;
  let numerator = 1n, denominator = 1n;
  for (let i = 0; i < k; i++) { numerator *= BigInt(n - i); denominator *= BigInt(i + 1); }
  return numerator / denominator;
};
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const reduced = (a, b) => { const g = gcd(a, b); return b / g === 1n ? `${a / g}` : `${a / g}/${b / g}`; };
const countOf = (result, label) => BigInt(result.cases.find(row => row.label === label).count);

// A test-only arithmetic interpreter checks the expression shown to a learner.
// It has no access to production counting helpers and never evaluates JS.
function arithmetic(expression) {
  const text = expression.replace(/C\((-?\d+),(-?\d+)\)/g, (_, n, k) => `${choose(Number(n), Number(k))}`)
    .replaceAll('×', '*').replaceAll('−', '-').replace(/\s+/g, '');
  assert.match(text, /^[0-9()+*^\-]+$/, expression);
  const tokens = text.match(/\d+|[()+*^\-]/g);
  let at = 0;
  const atom = () => {
    if (tokens[at] === '-') { at++; return -atom(); }
    if (tokens[at] === '(') { at++; const value = sum(); assert.equal(tokens[at++], ')'); return value; }
    return BigInt(tokens[at++]);
  };
  const power = () => { const value = atom(); if (tokens[at] !== '^') return value; at++; return value ** power(); };
  const product = () => { let value = power(); while (tokens[at] === '*') { at++; value *= power(); } return value; };
  const sum = () => { let value = product(); while (tokens[at] === '+' || tokens[at] === '-') { const sign = tokens[at++], next = product(); value = sign === '+' ? value + next : value - next; } return value; };
  const value = sum();
  assert.equal(at, tokens.length, expression);
  return value;
}

function diceTuples(sides, rolls) {
  let tuples = [[]];
  for (let i = 0; i < rolls; i++) tuples = tuples.flatMap(tuple => Array.from({ length: sides }, (_, j) => [...tuple, j + 1]));
  return tuples;
}
const accepted = (value, relation, target) => relation === 'eq' ? value === target : relation === 'le' ? value <= target : value >= target;
const subsets = (n, size) => {
  const found = [];
  for (let mask = 0; mask < 2 ** n; mask++) {
    const cards = [];
    for (let bit = 0; bit < n; bit++) if (mask & 2 ** bit) cards.push(bit + 1);
    if (cards.length === size) found.push(cards);
  }
  return found;
};
const bHolds = (cards, condition, value) => condition === 'sum-even' ? cards.reduce((s, x) => s + x, 0) % 2 === 0 : condition === 'include' ? cards.includes(value) : Math.max(...cards) === value;
const aHolds = (cards, event, value) => event === 'odd-count' ? cards.filter(x => x % 2).length === value : event === 'include' ? cards.includes(value) : cards.reduce((s, x) => s + x, 0) >= value;

test('independent teaching review: displayed sum inclusion-exclusion, reflection and complement formulas match elementary tuples', () => {
  for (const sides of [2, 3, 4, 6]) for (const rolls of [1, 2, 3, 4]) {
    const tuples = diceTuples(sides, rolls), total = BigInt(tuples.length);
    const sums = tuples.map(tuple => tuple.reduce((s, x) => s + x, 0));
    for (let target = 0; target <= sides * rolls + 2; target++) for (const relation of ['eq', 'le', 'ge']) {
      const result = solve('probability-count', { sides, rolls, statistic: 'sum', target, relation });
      const expected = BigInt(sums.filter(value => accepted(value, relation, target)).length);
      const context = JSON.stringify({ sides, rolls, target, relation });
      assert.equal(result.exact, reduced(expected, total), context);
      assert.equal(countOf(result, '사건 A'), expected, context);
      assert.equal(countOf(result, '사건 A의 여사건'), total - expected, context);
      const displayed = result.steps.at(-2).formula.split(' = ');
      assert.equal(arithmetic(displayed[0]), expected, context);
      assert.equal(BigInt(displayed[1]), expected, context);
      for (const row of result.cases.filter(item => item.label.startsWith('상한 위반'))) {
        const parity = Number(row.label.match(/\d+/)[0]) % 2;
        assert.equal(BigInt(row.count), (parity ? -1n : 1n) * arithmetic(row.detail.split(': ')[1]), context);
      }
    }
  }
});

test('independent teaching review: the sum symbol refers to original eyes before the lower-bound substitution', () => {
  const result = solve('probability-count', { sides: 6, rolls: 3, statistic: 'sum', relation: 'eq', target: 10 });
  const explanation = result.steps[1].body;
  assert.match(explanation, /원래 눈의 합.*t/);
  assert.match(explanation, /y_1\+⋯\+y_3=t−3/);
  // S=10 gives Σy=7, hence C(9,2), with the three upper-bound violations removed.
  const expected = choose(9, 2) - 3n * choose(3, 2);
  assert.equal(countOf(result, '사건 A'), expected);
});

test('independent teaching review: maximum power differences hold beyond the support as well as inside it', () => {
  for (const sides of [2, 5, 8]) for (const rolls of [1, 2, 4]) {
    const tuples = diceTuples(sides, rolls), total = BigInt(tuples.length);
    for (const target of [0, 1, 2, sides - 1, sides, sides + 1, sides + 5]) for (const relation of ['eq', 'le', 'ge']) {
      const result = solve('probability-count', { sides, rolls, statistic: 'max', relation, target });
      const expected = BigInt(tuples.filter(tuple => accepted(Math.max(...tuple), relation, target)).length);
      assert.equal(arithmetic(result.steps.at(-2).formula.split(' = ')[0]), expected);
      assert.equal(result.exact, reduced(expected, total));
    }
  }
});

test('independent teaching review: fixed and parity card formulas agree with hand-derived combination counts', () => {
  const fixtures = [
    { params: { n: 8, draw: 3, condition: 'sum-even', event: 'include', eventValue: 1 }, denominator: choose(4, 0) * choose(4, 3) + choose(4, 2) * choose(4, 1), numerator: choose(3, 1) * choose(4, 1) },
    { params: { n: 8, draw: 3, condition: 'sum-even', event: 'include', eventValue: 2 }, denominator: choose(4, 0) * choose(4, 3) + choose(4, 2) * choose(4, 1), numerator: choose(4, 0) * choose(3, 2) + choose(4, 2) * choose(3, 0) },
    { params: { n: 8, draw: 3, condition: 'include', conditionValue: 1, event: 'include', eventValue: 2 }, denominator: choose(7, 2), numerator: choose(6, 1) },
    { params: { n: 8, draw: 3, condition: 'include', conditionValue: 1, event: 'odd-count', eventValue: 2 }, denominator: choose(7, 2), numerator: choose(3, 1) * choose(4, 1) },
    { params: { n: 8, draw: 3, condition: 'max-eq', conditionValue: 5, event: 'include', eventValue: 2 }, denominator: choose(4, 2), numerator: choose(3, 1) }
  ];
  for (const { params, denominator, numerator } of fixtures) {
    const result = solve('conditional', params);
    assert.equal(arithmetic(result.steps[1].formula.split(' = ')[1]), denominator);
    assert.equal(arithmetic(result.steps[2].formula.split(' = ')[1]), numerator);
    assert.equal(result.exact, reduced(numerator, denominator));
  }
});

test('independent teaching review: card denominators, numerators and maximum-case teaching rows match independent subsets', () => {
  for (let n = 1; n <= 8; n++) for (let draw = 0; draw <= Math.min(n, 4); draw++) {
    const combinations = subsets(n, draw);
    for (const condition of ['sum-even', 'include', 'max-eq']) for (const conditionValue of [...new Set([1, Math.ceil(n / 2), n, n + 1])]) {
      const inB = combinations.filter(cards => bHolds(cards, condition, conditionValue));
      const queries = [
        ...[0, 1, 2, draw + 1].map(eventValue => ({ event: 'odd-count', eventValue })),
        ...[0, 1, n, n + 1].map(eventValue => ({ event: 'include', eventValue })),
        ...[0, draw * (draw + 1) / 2, n * draw / 2 | 0, draw * (2 * n - draw + 1) / 2 + 1].map(eventValue => ({ event: 'sum-ge', eventValue }))
      ];
      for (const query of queries) {
        const params = { n, draw, condition, conditionValue, ...query }, result = solve('conditional', params);
        const inAB = inB.filter(cards => aHolds(cards, query.event, query.eventValue));
        const denominator = BigInt(inB.length), numerator = BigInt(inAB.length), context = JSON.stringify(params);
        assert.equal(countOf(result, 'B'), denominator, context);
        assert.equal(countOf(result, 'A∩B'), numerator, context);
        assert.equal(arithmetic(result.steps[1].formula.split(' = ')[1]), denominator, context);
        assert.equal(arithmetic(result.steps[2].formula.split(' = ')[1]), numerator, context);
        if (denominator) assert.equal(result.exact, reduced(numerator, denominator), context);
        else assert.equal(result.status, 'invalid', context);
        for (const row of result.cases.filter(item => item.label.startsWith('조건 B: 홀수'))) {
          const odd = Number(row.label.match(/\d+/)[0]);
          assert.equal(BigInt(row.count), choose(Math.ceil(n / 2), odd) * choose(Math.floor(n / 2), draw - odd), context);
        }
        if (query.event === 'sum-ge') {
          const rows = result.cases.filter(row => row.label.startsWith('합 조건:'));
          assert.equal(rows.reduce((sum, row) => sum + BigInt(row.count), 0n), numerator, context);
          for (const row of rows.filter(row => /최댓값 \d+$/.test(row.label))) {
            const maximum = Number(row.label.match(/\d+$/)[0]);
            const independent = inAB.filter(cards => Math.max(...cards.filter(card => condition === 'sum-even' || card !== conditionValue)) === maximum);
            assert.equal(BigInt(row.count), BigInt(independent.length), context);
          }
        }
      }
    }
  }
});
