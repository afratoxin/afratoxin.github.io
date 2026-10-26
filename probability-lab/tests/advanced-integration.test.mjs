import test from 'node:test';
import assert from 'node:assert/strict';
import { integerSumSpec } from '../engines/integer-sum.mjs';
import { parseExpression, evaluateExpression, expressionVariables } from '../engines/expression-parser.mjs';
import { statisticsSpecs } from '../engines/statistics.mjs';

const variable = more => ({ domain: 'inherit', parity: 'any', lower: null, upper: null, ...more });
const model = (k, left, right, more = {}) => ({ k, structure: {
  enabled: true, left, right, relation: 'eq', variables: Array.from({ length: k }, () => variable()), conditions: [], ...more,
} });
const range = (lo, hi) => Array.from({ length: Math.max(0, hi - lo + 1) }, (_, i) => lo + i);
function enumerate(ranges, accept) {
  let total = 0;
  function visit(xs) {
    if (xs.length === ranges.length) { if (accept(xs)) total++; return; }
    for (const value of ranges[xs.length]) visit([...xs, value]);
  }
  visit([]);
  return String(total);
}
const solutionText = result => result.steps.map(step => [step.title, step.body, step.formula].filter(Boolean).join(' ')).join('\n');

test('advanced independent review: hand-derived factor, symmetry, coefficient-square and subset answers', () => {
  const factor = model(4, 'a+b+c+d', '16', { conditions: [{ kind: 'expression', left: 'a*b', relation: 'eq', right: '12' }] });
  factor.structure.variables[2].parity = 'odd';
  factor.structure.variables[3].lower = 2;
  const factorResult = integerSumSpec.solve(factor);
  assert.equal(factorResult.exact ?? factorResult.answer, '16');
  assert.match(solutionText(factorResult), /약수/);
  assert.match(solutionText(factorResult), /중복조합|조합/);

  const symmetry = model(4, 'a+b+c+d', '12', { conditions: [{ kind: 'expression', left: '(a-b)^2', relation: 'eq', right: '4' }] });
  const symmetryResult = integerSumSpec.solve(symmetry);
  assert.equal(symmetryResult.exact ?? symmetryResult.answer, '32');
  assert.match(solutionText(symmetryResult), /대칭|±/);

  const mixed = integerSumSpec.solve(model(4, 'a+b+2*c+d^2', '20'));
  assert.equal(mixed.exact ?? mixed.answer, '142');
  assert.match(solutionText(mixed), /중복조합|조합/);

  const parity = model(4, 'a+b+c+d', '12');
  parity.structure.variables[0].parity = 'even'; parity.structure.variables[1].parity = 'even';
  assert.equal(integerSumSpec.solve(parity).answer, '30');
  const bounded = model(4, 'a+b+c+d', '10');
  bounded.structure.variables[0].upper = 3; bounded.structure.variables[1].upper = 3;
  assert.equal(integerSumSpec.solve(bounded).answer, '45');
  const product = model(4, 'a*b*c*d', '12', { variables: Array.from({ length: 4 }, () => variable({ upper: 12 })) });
  assert.equal(integerSumSpec.solve(product).answer, '40');
  for (const result of [factorResult, symmetryResult, mixed]) {
    assert.equal(result.status, 'ok');
    assert.doesNotMatch(solutionText(result), /전수\s*열거|동적\s*계획|모든\s*튜플을\s*열거/);
  }
});

test('advanced independent review: two local group constraints and per-variable bounds intersect correctly', () => {
  for (const relation of ['eq', 'ne', 'le', 'lt', 'ge', 'gt']) {
    const input = model(4, 'a*b-c', 'd+1', {
      relation,
      variables: [variable({ domain: 'integer', lower: -2, upper: 3, parity: 'odd' }), variable({ domain: 'nonnegative', upper: 3 }), variable({ domain: 'integer', lower: -1, upper: 3 }), variable({ upper: 4 })],
      conditions: [{ kind: 'nondecreasing', variables: [0, 2] }, { kind: 'distinct', variables: [1, 3] }],
    });
    const cmp = (a, b) => ({ eq: a === b, ne: a !== b, le: a <= b, lt: a < b, ge: a >= b, gt: a > b })[relation];
    const expected = enumerate([[-1, 1, 3], range(0, 3), range(-1, 3), range(1, 4)], ([a, b, c, d]) => a <= c && b !== d && cmp(a * b - c, d + 1));
    const result = integerSumSpec.solve(input);
    assert.equal(result.answer, expected, relation);
    assert.ok(Number.isFinite(result.numeric));
  }
});

test('advanced independent review: custom equations retain their own right side independently of base sum', () => {
  const input = model(4, 'a+b+2*c+d^2', '20');
  for (const total of [-40, 7, 80]) assert.equal(integerSumSpec.solve({ ...input, total }).answer, '142');
  const simple = model(4, 'a+b+c+d', '12');
  simple.structure.variables[0].lower = 3;
  assert.equal(integerSumSpec.solve(simple).answer, '84');
});

test('advanced independent review: impossible parity stays zero when an otherwise unbounded sum uses the default editor structure', () => {
  const input = model(3, 'a+b+c', '8');
  input.domain = 'integer-odd'; input.total = 8;
  const result = integerSumSpec.solve(input);
  assert.equal(result.status, 'ok');
  assert.equal(result.answer, '0');
});

test('advanced independent review: parser precedence, aliases and safe integer rejection', () => {
  const expressions = [
    ['-a^2+2*b', ([a, b]) => -a * a + 2 * b],
    ['(-a)^2+2*b', ([a, b]) => a * a + 2 * b],
    ['(a-b)^2', ([a, b]) => (a - b) ** 2],
    ['x1+x2*2-(a-b)', ([a, b]) => a + 2 * b - (a - b)],
    ['2×(a+b)−3', ([a, b]) => 2 * (a + b) - 3],
  ];
  for (const [source, calculate] of expressions) {
    const ast = parseExpression(source, 2);
    for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) assert.equal(evaluateExpression(ast, [a, b]), calculate([a, b]), source);
    assert.deepEqual([...expressionVariables(ast)].sort(), [0, 1]);
  }
  for (const source of ['globalThis.process.exit()', 'constructor.constructor("return 1")()', 'a/2', 'a^3', 'a+h', '1.5+a', 'a**2', 'a;1', '(a+b', 'a'.repeat(501), '10001+a', '(10000^2)^2']) {
    assert.throws(() => parseExpression(source, 2), source);
  }
  assert.throws(() => evaluateExpression(parseExpression('a^2', 2), [Number.MAX_SAFE_INTEGER, 1]));
  for (const left of [null, {}, [], 7]) assert.equal(integerSumSpec.solve(model(2, left, '4')).status, 'invalid');
});

test('advanced independent review: individually safe bounds cannot silently round aggregate residual sums', () => {
  const input = model(8, 'a+b+c+d+e+f+g+h', '-8000*10000*10000*10000', { relation: 'ge' });
  input.domain = 'integer'; input.upperOn = true; input.upper = 40;
  const result = integerSumSpec.solve(input);
  // Setting y_i=40-x_i gives eight nonnegative values with sum <=8e15+320.
  let expected = 1n;
  for (let i = 1n; i <= 8n; i++) expected = expected * (8000000000000320n + i) / i;
  if (result.status === 'ok') assert.equal(result.answer, String(expected), 'an exact result must agree with the reflected stars-and-bars count');
  else { assert.equal(result.status, 'invalid'); assert.equal(result.numeric, null); assert.match(result.insight, /안전|범위|계산/); }
});

test('advanced independent review: signed polynomials and local parity agree with 108 independent bounded enumerations', () => {
  const formulas = [
    ['a^2+b*c', '2', ([a, b, c]) => a * a + b * c - 2],
    ['(a-b)^2+c', '3', ([a, b, c]) => (a - b) ** 2 + c - 3],
    ['-2*a+b-c^2', '-1', ([a, b, c]) => -2 * a + b - c * c + 1],
    ['a*b*c', '-4', ([a, b, c]) => a * b * c + 4],
    ['a^2*b^2+c', '8', ([a, b, c]) => a * a * b * b + c - 8],
    ['2*(a+b)-3', 'c+5', ([a, b, c]) => 2 * (a + b) - 3 - c - 5],
  ];
  for (const [left, right, calculate] of formulas) for (const relation of ['eq', 'ne', 'lt', 'le', 'gt', 'ge']) for (const parity of ['any', 'odd', 'even']) {
    const ranges = [range(-3, 3).filter(x => parity === 'any' || (parity === 'even' ? x % 2 === 0 : x % 2 !== 0)), range(-3, 3), range(-3, 3)];
    const expected = enumerate(ranges, xs => { const v = calculate(xs); return ({ eq: v === 0, ne: v !== 0, lt: v < 0, le: v <= 0, gt: v > 0, ge: v >= 0 })[relation]; });
    const input = model(3, left, right, { relation, variables: [0, 1, 2].map(i => variable({ domain: 'integer', parity: i === 0 ? parity : 'any', lower: -3, upper: 3 })) });
    assert.equal(integerSumSpec.solve(input).answer, expected, JSON.stringify({ left, right, relation, parity }));
  }
});

test('advanced independent review: original normal-table rows remain fixed and current extra values are identified separately', () => {
  const normal = statisticsSpecs.find(s => s.id === 'normal');
  const estimation = statisticsSpecs.find(s => s.id === 'estimation');
  const expectedRows = [{ z: '0.5', probability: '0.1915' }, { z: '1.0', probability: '0.3413' }, { z: '1.5', probability: '0.4332' }, { z: '2.0', probability: '0.4772' }];
  const first = normal.solve({ mu: 0, sigma: 1, n: 1, lower: -1, upper: 1 });
  assert.deepEqual(first.normalTable.rows, expectedRows); assert.deepEqual(first.normalTable.additionalRows, []);
  assert.equal(first.normalTable.definition, 'P(0≤Z≤z)'); assert.equal(first.normalTable.source.question, 27); assert.equal(first.normalTable.source.pdfPage, 11);
  const extra = normal.solve({ mu: 0, sigma: 1, n: 1, lower: -1.2, upper: 2.7 });
  assert.deepEqual(extra.normalTable.rows, expectedRows);
  assert.deepEqual(extra.normalTable.additionalRows.map(({ z, probability }) => ({ z, probability })), [{ z: '1.2', probability: '0.3849' }, { z: '2.7', probability: '0.4965' }]);
  assert.ok(extra.normalTable.additionalRows.every(row => /추가|근사/.test(row.label)));
  const interval = estimation.solve({}); assert.deepEqual(interval.normalTable.rows, expectedRows);
  for (const spec of statisticsSpecs.filter(s => !['normal', 'estimation'].includes(s.id))) assert.equal(spec.solve({}).normalTable, undefined);
});

test('advanced independent review: work limits account for expensive repeated polynomial conditions', () => {
  const input = model(4, '0', '0', {
    variables: Array.from({ length: 4 }, () => variable({ upper: 37 })),
    conditions: Array.from({ length: 12 }, () => ({ kind: 'expression', left: 'a^2+b^2+c^2+d^2', relation: 'ge', right: '0' })),
  });
  const started = performance.now();
  const result = integerSumSpec.solve(input);
  assert.ok(performance.now() - started < 2000, 'this valid bounded model must be simplified or rejected before blocking the UI for seconds');
  if (result.status === 'ok') assert.equal(result.answer, '1874161');
  else { assert.equal(result.status, 'invalid'); assert.equal(result.numeric, null); }
});
