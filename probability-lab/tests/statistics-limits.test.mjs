import test from 'node:test';
import assert from 'node:assert/strict';
import { statisticsSpecs } from '../engines/statistics.mjs';
import { createExamSpec } from '../engines/exam-limits.mjs';

let statisticsLimitProfiles = {}, loadError;
try { ({ statisticsLimitProfiles } = await import('../engines/statistics-limits.mjs')); }
catch (error) { loadError = error; }
const raw = id => statisticsSpecs.find(spec => spec.id === id);
const profile = id => { assert.ok(statisticsLimitProfiles[id], `missing profile ${id}`); return statisticsLimitProfiles[id]; };
const params = (id, more = {}) => ({ ...raw(id).defaults, ...profile(id).defaults, ...more });
const controls = (id, more) => profile(id).controls(params(id, more), raw(id).controls);
const facts = (id, more) => { const p = params(id, more); return profile(id).facts(p, raw(id).solve(p)); };
const within999 = item => typeof item === 'bigint' ? item >= -999n && item <= 999n : typeof item === 'number' && Number.isFinite(item) && Math.abs(item) <= 999;

test('statistics limits provide six safe defaults and advertised presets without mutating raw specs', () => {
  assert.ifError(loadError);
  assert.equal(Object.keys(statisticsLimitProfiles).length, 6);
  for (const spec of statisticsSpecs) {
    const before = JSON.stringify(spec.controls);
    for (const preset of [{ params: {} }, ...profile(spec.id).presets]) {
      const p = params(spec.id, preset.params);
      assert.equal(profile(spec.id).validate(p), '', `${spec.id}: ${preset.name}`);
      let result = spec.solve(p);
      assert.equal(result.status, 'ok', `${spec.id}: ${preset.name}`);
      if (profile(spec.id).transformResult) result = profile(spec.id).transformResult(p, result);
      const measured = profile(spec.id).facts(p, result);
      for (const values of Object.values(measured)) assert.ok(values.every(within999), `${spec.id}: ${preset.name}`);
    }
    controls(spec.id, {});
    assert.equal(JSON.stringify(spec.controls), before);
  }
  assert.equal(raw('binomial').defaults.n, 10, 'raw broad model remains untouched');
});

test('normal controls expose actual sample-mean three-sigma bounds and standard-score metadata', () => {
  const list = controls('normal', { mu: 20, sigma: 10, n: 4, lower: 5, upper: 35 });
  for (const key of ['lower', 'upper']) {
    const c = list.find(control => control.key === key);
    assert.equal(c.min, 5); assert.equal(c.max, 35); assert.equal(c.step, 'any');
    assert.equal(c.normalBound, true);
    assert.deepEqual(c.zscore, { min: -3, max: 3, step: 0.1, mu: 20, sigma: 10, se: 5, n: 4 });
  }
  assert.equal(list.find(c => c.key === 'mu').min, -984);
  assert.equal(list.find(c => c.key === 'mu').max, 984);
  assert.equal(list.find(c => c.key === 'sigma').max, 30);
  assert.equal(list.find(c => c.key === 'sigma').step, 0.01);
  assert.equal(list.find(c => c.key === 'n').max, 999);
});

test('normal guards reject direct-input and hash-style bounds beyond ±3 standard errors', () => {
  for (const more of [{ lower: 4.999, upper: 20 }, { lower: 20, upper: 35.001 }, { lower: 25, upper: 15 }, { sigma: 0 }, { n: 1000 }]) {
    assert.ok(profile('normal').validate(params('normal', { mu: 20, sigma: 10, n: 4, lower: 5, upper: 35, ...more })));
  }
  const p = params('normal', { mu: 0.1, sigma: 0.1, n: 999 });
  const c = controls('normal', p).find(c => c.key === 'lower');
  p.lower = Number(c.min.toFixed(8)); p.upper = Number(c.max.toFixed(8));
  assert.equal(profile('normal').validate(p), '');
  assert.ok(Object.values(facts('normal', p)).flat().every(within999), 'exam year 2022 is metadata, not a measured quantity');
});

test('binomial dynamic limits enforce the unreduced trial-space denominator', () => {
  let list = controls('binomial', { denominator: 2 });
  assert.equal(list.find(c => c.key === 'n').max, 9);
  list = controls('binomial', { n: 4, denominator: 5 });
  assert.equal(list.find(c => c.key === 'denominator').max, 5);
  assert.equal(list.find(c => c.key === 'numerator').max, 5);
  assert.equal(list.find(c => c.key === 'upper').max, 4);
  assert.equal(profile('binomial').validate(params('binomial', { n: 9, denominator: 2 })), '');
  assert.ok(profile('binomial').validate(params('binomial', { n: 10, denominator: 2 })));
  assert.ok(profile('binomial').validate(params('binomial', { n: 5, numerator: 0, denominator: 4, lower: 0, upper: 0 })), 'zero-success simplification cannot hide 4^5 trial outcomes');
  assert.ok(profile('binomial').validate(params('binomial', { n: 1, numerator: 1, denominator: 999, query: 'variance' })));
  assert.ok(facts('binomial', { n: 9, denominator: 2 }).denominators.includes(512n));
});

test('discrete feasible limits use only moments actually needed for the selected query', () => {
  const mean = params('discrete', { faces: 29, transform: 'square', query: 'mean' });
  assert.equal(profile('discrete').validate(mean), '');
  const rawResult = raw('discrete').solve(mean);
  assert.equal(rawResult.exact, '295');
  const result = profile('discrete').transformResult(mean, rawResult);
  assert.equal(result.steps.length, 3);
  assert.doesNotMatch(result.steps.map(s => `${s.body} ${s.formula}`).join(' '), /Σi⁴|E\(Y²\)/);
  assert.ok(Object.values(profile('discrete').facts(mean, result)).flat().every(within999));
  assert.equal(controls('discrete', { transform: 'square', query: 'mean' }).find(c => c.key === 'faces').max, 29);
  assert.ok(profile('discrete').validate(params('discrete', { faces: 6, transform: 'square', query: 'variance' })));
  assert.equal(profile('discrete').validate(params('discrete', { faces: 5, transform: 'square', query: 'variance' })), '');
  assert.equal(profile('discrete').validate(params('discrete', { faces: 30, transform: 'square', scale: 0, offset: 30, query: 'variance' })), '', 'a constant needs no unused fourth moment');
});

test('continuous half-unit geometry supplies exact reduced probability fractions', () => {
  const measured = facts('continuous', { a: 0, b: 10, lower: 2, upper: 8 });
  assert.ok(measured.denominators.includes(25n));
  assert.ok(measured.values.includes(21n));
  const uniform = facts('continuous', { shape: 'uniform', a: 0, b: 100, lower: 0, upper: 0.5 });
  assert.ok(uniform.denominators.includes(200n));
  const p = params('continuous', { a: 0, b: 100, lower: 0.5, upper: 1 });
  assert.ok(profile('continuous').validate(p), '3/20000 cannot be hidden by a decimal answer');
  assert.ok(profile('continuous').validate(params('continuous', { lower: 0.25 })));
  assert.ok(profile('continuous').validate(params('continuous', { lower: -0.5 })));
  assert.equal(profile('continuous').validate(params('continuous', { a: 0, b: 100, lower: 0.5, upper: 0.5 })), '', 'a singleton has probability zero and needs no unused CDF fractions');
  const list = controls('continuous', { a: -3.5, b: 8 });
  assert.equal(list.find(c => c.key === 'lower').min, -3.5);
  assert.equal(list.find(c => c.key === 'upper').max, 8);
});

test('estimation limits use selected critical values and bound all displayed endpoints and widths', () => {
  assert.equal(params('estimation').mode, 'table');
  assert.equal(controls('estimation', {}).find(c => c.key === 'n').max, 999);
  assert.equal(controls('estimation', {}).find(c => c.key === 'mean').step, 'any');
  assert.equal(controls('estimation', {}).find(c => c.key === 'sigma').min, 0.01);
  assert.ok(profile('estimation').validate(params('estimation', { mean: 999, sigma: 1, n: 1 })));
  assert.ok(profile('estimation').validate(params('estimation', { mean: 0, sigma: 999, n: 1 })));
  assert.equal(profile('estimation').validate(params('estimation', { mean: 0, sigma: 10, n: 999 })), '');
  assert.ok(Object.values(facts('estimation', {})).flat().every(within999));
});

test('all statistics profile validations reject nonfinite measurements', () => {
  for (const [id, key] of [['event-algebra', 'both'], ['binomial', 'n'], ['discrete', 'faces'], ['continuous', 'a'], ['normal', 'mu'], ['estimation', 'sigma']]) {
    for (const value of [NaN, Infinity, '3', null]) assert.ok(profile(id).validate(params(id, { [key]: value })), `${id} ${value}`);
  }
});

test('public statistics wrappers preserve feasible exact means and reject large hidden rational denominators', () => {
  const publicSpec = id => createExamSpec(raw(id), profile(id));
  assert.equal(publicSpec('discrete').solve({ faces: 29, transform: 'square', scale: 1, offset: 0, query: 'mean' }).exact, '295');
  assert.equal(publicSpec('discrete').solve({ faces: 6, transform: 'square', scale: 1, offset: 0, query: 'variance' }).status, 'invalid');
  assert.equal(publicSpec('discrete').solve({ faces: 30, transform: 'square', scale: 0, offset: 30, query: 'variance' }).exact, '0');
  assert.equal(publicSpec('continuous').solve({ a: 0, b: 100, lower: 0.5, upper: 1 }).status, 'invalid');
  assert.equal(publicSpec('continuous').solve({ a: 0, b: 100, lower: 0.5, upper: 0.5 }).status, 'ok');
  assert.equal(publicSpec('continuous').solve({ shape: 'uniform', a: 0, b: 100, lower: 0, upper: 0.5 }).status, 'ok');
  assert.equal(publicSpec('binomial').solve({ n: 1, numerator: 1, denominator: 999, lower: 1, upper: 1 }).exact, '1/999');
  assert.equal(publicSpec('binomial').solve({ n: 1, numerator: 1, denominator: 999, lower: 0, upper: 1, query: 'variance' }).status, 'invalid');
});

test('public normal and confidence interval wrappers keep decimal inputs, valid table metadata and selected small spreads', () => {
  const normal = createExamSpec(raw('normal'), profile('normal'));
  const p = { mu: 1.5, sigma: 0.25, n: 4, lower: 1.125, upper: 1.875 };
  assert.equal(normal.solve(p).status, 'ok');
  assert.equal(normal.solve({ ...p, lower: p.lower - 0.001 }).status, 'invalid');
  const normalized = normal.normalizeParams({ ...p, n: 25 }, 'n');
  assert.ok(normalized.lower >= 1.35 - 1e-7 && normalized.upper <= 1.65 + 1e-7);
  const result = normal.solve(normalized);
  assert.equal(result.status, 'ok');
  assert.equal(result.normalTable.source.exam, '2022학년도 대학수학능력시험 9월 모의평가');
  const waterUse = normal.solve({ mu: 220, sigma: 10, n: 1, lower: 190, upper: 250 });
  assert.equal(waterUse.status, 'ok', 'ordinary exam means such as 220 remain feasible');
  const edgeControls = normal.getControls({ mu: 900, sigma: 30, n: 1, lower: 810, upper: 990 });
  const meanControl = edgeControls.find(c => c.key === 'mu');
  assert.ok(meanControl.max + 90 <= 999);
  assert.ok(meanControl.min - 90 >= -999);
  const ci = createExamSpec(raw('estimation'), profile('estimation')).solve({ sigma: 0.01 });
  assert.equal(ci.status, 'ok');
  assert.ok(Math.abs(ci.numeric - 0.00392) < 1e-12);
  const ciSpec = createExamSpec(raw('estimation'), profile('estimation'));
  assert.equal(ciSpec.solve({ mean: 0, sigma: 193.8, n: 1, mode: 'precise' }).status, 'ok', 'the precise-mode 99% comparison width is below 999');
  assert.equal(ciSpec.solve({ mean: 0, sigma: 193.8, n: 1, mode: 'table' }).status, 'invalid', 'the table-mode 99% comparison width exceeds 999');
});
