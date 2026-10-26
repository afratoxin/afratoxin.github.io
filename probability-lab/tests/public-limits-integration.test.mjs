import test from 'node:test';
import assert from 'node:assert/strict';
import { specs } from '../engines.mjs';
import { integerSumSpec as rawInteger } from '../engines/integer-sum.mjs';
import { countingSpecs as rawCounting } from '../engines/counting.mjs';
import { statisticsSpecs as rawStatistics } from '../engines/statistics.mjs';

const byId = new Map(specs.map(spec => [spec.id, spec]));
const get = id => { const spec = byId.get(id); assert.ok(spec, id); return spec; };
const variable = more => ({ domain: 'inherit', parity: 'any', lower: null, upper: null, ...more });
const model = (k, left, right, more = {}) => ({ k, structure: { enabled: true, left, right, relation: 'eq', variables: Array.from({ length: k }, () => variable()), conditions: [], ...more } });
const visibleContent = result => [result.question, result.answer, result.exact, result.insight,
  ...(result.steps ?? []).flatMap(step => [step.title, step.body, step.formula]),
  ...(result.warnings ?? []), ...(result.cases ?? []).flatMap(row => [row.label, row.count, row.detail]), ...(result.samples ?? []),
  ...(result.chart ?? []).flatMap(row => [row.label, row.value]),
  ...(result.normalTable?.rows ?? []).flatMap(row => [row.z, row.probability]),
  ...(result.normalTable?.additionalRows ?? []).flatMap(row => [row.z, row.probability]),
].filter(value => value !== null && value !== undefined).join('\n');
function withinVisibleLimit(result, label) {
  assert.equal(result.status, 'ok', `${label}: ${result.insight}`);
  assert.ok(Number.isFinite(result.numeric) && Math.abs(result.numeric) <= 999, `${label}: numeric answer`);
  // Parse decimal values as whole numeric tokens; 0.3413 is not integer 3413.
  for (const token of visibleContent(result).match(/[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?/gi) ?? []) {
    assert.ok(Math.abs(Number(token)) <= 999, `${label}: visible mathematical value ${token}`);
  }
}

test('public limits: every experiment exposes dynamic controls and only safe defaults and presets', () => {
  assert.equal(specs.length, 13);
  for (const spec of specs) {
    assert.equal(typeof spec.getControls, 'function', `${spec.id}.getControls`);
    assert.equal(typeof spec.allowedValues, 'function', `${spec.id}.allowedValues`);
    withinVisibleLimit(spec.solve(spec.defaults), `${spec.id} defaults`);
    assert.ok(spec.presets.length, `${spec.id}: at least one safe authored preset`);
    for (const preset of spec.presets) withinVisibleLimit(spec.solve({ ...spec.defaults, ...preset.params }), `${spec.id}: ${preset.name}`);
    for (const control of spec.getControls(spec.defaults).filter(control => control.type === 'number')) {
      assert.ok(Math.abs(control.min) <= 999 && Math.abs(control.max) <= 999, `${spec.id}.${control.key}: visible input bounds`);
      const allowed = spec.allowedValues(control.key, spec.defaults);
      assert.ok(allowed === null || Array.isArray(allowed));
      if (allowed) assert.ok(allowed.every(value => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 999));
    }
  }
});

test('public limits: raw APIs preserve broad mathematics while public experiments reject wide results and infinite presets', () => {
  assert.equal(rawInteger.solve({ k: 8, total: 16 }).answer, '6435');
  assert.equal(get('integer-sum').solve({ k: 8, total: 16 }).status, 'invalid');
  assert.equal(rawInteger.solve({ domain: 'integer' }).status, 'infinite');
  assert.equal(get('integer-sum').solve({ domain: 'integer' }).status, 'invalid');
  const rawDice = rawCounting.find(spec => spec.id === 'probability-count');
  assert.equal(rawDice.solve({ sides: 10, rolls: 3, relation: 'ge', target: 3 }).answer, '1');
  assert.equal(get('probability-count').solve({ sides: 10, rolls: 3, relation: 'ge', target: 3 }).status, 'invalid', 'full equally likely outcome space 1000 exceeds the cap even if probability reduces to 1');
});

test('public limits: answer and rational-denominator boundaries include 999 and reject 1000', () => {
  const singleton = model(2, '0', '0', { variables: [variable({ domain: 'integer', lower: 0, upper: 998 }), variable({ domain: 'integer', lower: 0, upper: 0 })] });
  const accepted = get('integer-sum').solve(singleton); withinVisibleLimit(accepted, '999 choices'); assert.equal(accepted.answer, '999');
  singleton.structure.variables[0].upper = 999;
  assert.equal(get('integer-sum').solve(singleton).status, 'invalid', '1000 choices from individually valid 0..999 values');
  const binomial = get('binomial');
  const oneIn999 = binomial.solve({ n: 1, numerator: 1, denominator: 999, lower: 1, upper: 1 });
  withinVisibleLimit(oneIn999, '1/999'); assert.equal(oneIn999.exact, '1/999');
  assert.equal(binomial.solve({ n: 1, numerator: 1, denominator: 1000, lower: 1, upper: 1 }).status, 'invalid');
  assert.equal(binomial.solve({ n: 10, numerator: 1, denominator: 2, lower: 1, upper: 1 }).status, 'invalid', 'unreduced trial denominator 1024 cannot pass through a reduced 5/512 answer');
});

test('public limits: structured AST literals, folded constants, coefficients and local boundaries cannot bypass the cap', () => {
  const integer = get('integer-sum');
  const legal = integer.solve(model(2, 'a+b', '999')); withinVisibleLimit(legal, 'literal 999'); assert.equal(legal.answer, '998');
  for (const input of [
    model(2, 'a+b', '1000'), model(2, 'a+b', '500+500'), model(2, '1000*a+b', '1'), model(2, '500*2*a+b', '1'),
    model(2, 'a+b', '4', { variables: [variable({ lower: -1000 }), variable()] }),
    model(2, 'a+b', '4', { variables: [variable(), variable({ upper: 1000 })] }),
    model(2, 'a+b', '4', { conditions: [{ kind: 'expression', left: 'a-b', relation: 'ne', right: '-1000' }] }),
    model(2, '999*a+b', '-999*a+b', { variables: [variable({ domain: 'integer', lower: 0, upper: 1 }), variable({ domain: 'integer', lower: 0, upper: 1 })] }),
    model(2, 'a+b+999', '-999'),
  ]) assert.equal(integer.solve(input).status, 'invalid', JSON.stringify(input));
  const negative = integer.solve(model(2, 'a+b', '-999', { variables: [variable({ domain: 'integer', lower: -999, upper: -1 }), variable({ domain: 'integer', lower: 0, upper: 0 })] }));
  withinVisibleLimit(negative, 'negative endpoint -999'); assert.equal(negative.answer, '1');
});

test('public limits: normal endpoints are restricted to mu plus or minus three standard errors, including decimal boundaries', () => {
  const normal = get('normal');
  const params = { mu: 1.5, sigma: 0.25, n: 4, lower: 1.125, upper: 1.875 };
  withinVisibleLimit(normal.solve(params), 'exact +/-3 standard errors');
  for (const bad of [{ lower: 1.1249 }, { upper: 1.8751 }]) assert.equal(normal.solve({ ...params, ...bad }).status, 'invalid');
  const controls = normal.getControls(params);
  for (const key of ['lower', 'upper']) {
    const control = controls.find(control => control.key === key);
    assert.ok(Math.abs(control.min - 1.125) < 1e-12); assert.ok(Math.abs(control.max - 1.875) < 1e-12);
  }
  assert.equal(typeof normal.normalizeParams, 'function');
  const changed = normal.normalizeParams({ ...params, n: 25 }, 'n');
  assert.ok(changed.lower >= 1.35 - 1e-12 && changed.upper <= 1.65 + 1e-12);
  withinVisibleLimit(normal.solve(changed), 'dependent normal bounds normalize with new n');
  const rawNormal = rawStatistics.find(spec => spec.id === 'normal');
  assert.equal(rawNormal.solve({ mu: 0, sigma: 1, n: 1, lower: -8, upper: 8 }).status, 'ok');
  withinVisibleLimit(normal.solve({ mu: 220, sigma: 10, n: 1, lower: 190, upper: 250 }), 'a legal mean above 100 retains its full three-sigma range');
  assert.equal(normal.solve({ mu: 990, sigma: 10, n: 1, lower: 990, upper: 990 }).status, 'invalid', 'the full three-sigma actual-value range must fit the 999 cap');
});

test('public limits: integer controls expose physical sums and a variable-count change can normalize its coupled default sum', () => {
  const integer = get('integer-sum');
  const old = { ...integer.defaults, structure: model(4, 'a+b+c+d', '7').structure };
  const totals = integer.allowedValues('total', old);
  assert.ok(totals.every(value => value >= 4 && value <= 20), 'a natural four-variable sum starts at 4 and the count cap ends at 20');
  assert.ok(integer.allowedValues('k', old).includes(8), 'the eight-variable choice remains reachable through dependent normalization');
  const next = integer.normalizeParams({ ...old, k: 8 }, 'k');
  assert.equal(next.k, 8); assert.equal(next.total, 8); assert.equal(next.structure.right, '8'); assert.equal(next.structure.variables.length, 8);
  withinVisibleLimit(integer.solve(next), 'eight variables at their minimum possible sum'); assert.equal(integer.solve(next).answer, '1');
});
