import test from 'node:test';
import assert from 'node:assert/strict';

// Each fixture is hand-derived; loading an absent engine gives one clear RED assertion.
let statisticsSpecs = [];
let loadError;
try { ({ statisticsSpecs } = await import('../engines/statistics.mjs')); }
catch (error) { loadError = error; }
const solve = (id, params) => {
  const spec = statisticsSpecs.find(item => item.id === id);
  assert.ok(spec, `Missing statistics spec: ${id}`);
  return spec.solve(params);
};
const close = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≈ ${expected}`);

test('statistics module supplies six usable, explained default experiments', () => {
  assert.ifError(loadError);
  assert.equal(statisticsSpecs.length, 6);
  for (const spec of statisticsSpecs) {
    const result = spec.solve({});
    assert.equal(result.status, 'ok', spec.id);
    assert.ok(result.steps.length >= 3, spec.id);
    assert.ok(result.question.length > 20, spec.id);
    assert.ok(Number.isFinite(result.numeric), spec.id);
    assert.ok(result.chart.every(item => Number.isFinite(item.value)), spec.id);
  }
});

test('event union counts overlap once', () => assert.equal(solve('event-algebra', { query: 'union' }).exact, '19/25'));
test('event intersection and both conditional directions use their own denominators', () => {
  assert.equal(solve('event-algebra', { query: 'intersection' }).exact, '9/25');
  assert.equal(solve('event-algebra', { query: 'aGivenB' }).exact, '9/13');
  assert.equal(solve('event-algebra', { query: 'bGivenA' }).exact, '3/5');
});
test('independence compares exact cross products, including empty events', () => {
  assert.equal(solve('event-algebra', { both: 1, aOnly: 1, bOnly: 1, neither: 1, query: 'independence' }).numeric, 1);
  assert.equal(solve('event-algebra', { both: 1, aOnly: 0, bOnly: 0, neither: 1, query: 'independence' }).numeric, 0);
  assert.equal(solve('event-algebra', { both: 0, aOnly: 0, bOnly: 2, neither: 3, query: 'independence' }).numeric, 1);
});
test('conditional probability rejects zero conditioning mass and empty sample spaces', () => {
  assert.equal(solve('event-algebra', { both: 0, bOnly: 0, query: 'aGivenB' }).status, 'invalid');
  assert.equal(solve('event-algebra', { both: 0, aOnly: 0, bOnly: 0, neither: 0 }).status, 'invalid');
});

test('binomial inclusive interval has exact rational probability', () => {
  const result = solve('binomial', { n: 5, numerator: 1, denominator: 2, lower: 2, upper: 3 });
  assert.equal(result.exact, '5/8');
  assert.equal(result.numeric, 0.625);
  close(result.chart.reduce((sum, item) => sum + item.value, 0), 1);
});
test('binomial expectation and variance use rational success probabilities', () => {
  assert.equal(solve('binomial', { n: 10, numerator: 2, denominator: 5, query: 'mean' }).exact, '4');
  assert.equal(solve('binomial', { n: 10, numerator: 2, denominator: 5, query: 'variance' }).exact, '12/5');
});
test('degenerate binomials retain point mass one', () => {
  for (const params of [
    { n: 0, numerator: 1, denominator: 2, lower: 0, upper: 0 },
    { n: 5, numerator: 0, denominator: 2, lower: 0, upper: 0 },
    { n: 5, numerator: 2, denominator: 2, lower: 5, upper: 5 }
  ]) assert.equal(solve('binomial', params).exact, '1');
  assert.equal(solve('binomial', { numerator: 0, lower: 1, upper: 4 }).exact, '0');
});
test('binomial rejects zero denominators and invalid intervals or probabilities', () => {
  for (const params of [{ denominator: 0 }, { numerator: 6, denominator: 5 }, { lower: 8, upper: 7 }, { upper: 11 }]) {
    assert.equal(solve('binomial', params).status, 'invalid');
  }
});
test('binomial chooses a short complement for at-least-one and all-but-all events', () => {
  for (const params of [{ n: 5, lower: 1, upper: 5 }, { n: 5, lower: 0, upper: 4 }]) {
    const result = solve('binomial', params);
    assert.equal(result.exact, '31/32');
    assert.match(result.steps.at(-1).title, /여사건/);
    assert.match(result.steps.at(-1).formula, /1−/);
    assert.doesNotMatch(result.steps.at(-1).formula, /Σ/);
  }
  const interior = solve('binomial', { n: 10, lower: 1, upper: 9 });
  assert.equal(interior.exact, '511/512');
  assert.match(interior.steps.at(-1).formula, /P\(X=0\).*P\(X=10\)/);
});

test('fair die expectation and variance are exact', () => {
  assert.equal(solve('discrete', { query: 'mean' }).exact, '7/2');
  assert.equal(solve('discrete', { query: 'variance' }).exact, '35/12');
});
test('squared die values use the fourth moment in their variance', () => {
  assert.equal(solve('discrete', { transform: 'square' }).exact, '91/6');
  assert.equal(solve('discrete', { transform: 'square', query: 'variance' }).exact, '5369/36');
});
test('many faces mapping to one parity value are grouped', () => {
  const result = solve('discrete', { faces: 5, transform: 'parity', query: 'variance' });
  assert.equal(result.exact, '6/25');
  assert.equal(result.chart.length, 2);
  close(result.chart.reduce((sum, item) => sum + item.value, 0), 1);
});
test('affine transformations allow negative and zero slopes', () => {
  assert.equal(solve('discrete', { scale: -2, offset: 10 }).exact, '3');
  assert.equal(solve('discrete', { scale: -2, offset: 10, query: 'variance' }).exact, '35/3');
  assert.equal(solve('discrete', { scale: 0, query: 'variance' }).exact, '0');
});
test('discrete solutions use finite-sum identities and affine variance instead of face enumeration', () => {
  const linear = solve('discrete', { scale: -2, offset: 10, query: 'variance' });
  assert.match(linear.steps[0].formula, /Σi.*Σi²/);
  assert.match(linear.steps.at(-1).formula, /V\(X\).*².*V\(Y\)/);
  const square = solve('discrete', { transform: 'square', query: 'variance' });
  assert.match(square.steps[0].formula, /Σi².*Σi⁴/);
  const parity = solve('discrete', { faces: 5, transform: 'parity' });
  assert.match(parity.steps[0].body, /홀수.*3/);
});

test('uniform density integrates intersected support', () => {
  close(solve('continuous', { shape: 'uniform', a: 0, b: 10, lower: 2, upper: 6 }).numeric, 0.4);
  assert.equal(solve('continuous', { shape: 'uniform', lower: -20, upper: 20 }).numeric, 1);
  assert.equal(solve('continuous', { lower: 11, upper: 15 }).numeric, 0);
});
test('triangular density covers both pieces and peak boundaries', () => {
  close(solve('continuous', { a: 0, b: 10, lower: 2, upper: 8 }).numeric, 0.84);
  close(solve('continuous', { a: 0, b: 10, lower: 0, upper: 5 }).numeric, 0.5);
  assert.equal(solve('continuous', { lower: 5, upper: 5 }).numeric, 0);
});
test('continuous densities reject collapsed support and reversed intervals', () => {
  assert.equal(solve('continuous', { a: 5, b: 5 }).status, 'invalid');
  assert.equal(solve('continuous', { lower: 8, upper: 7 }).status, 'invalid');
});
test('continuous question defines exact density and marks rounded probabilities as approximate', () => {
  const triangle = solve('continuous', { shape: 'triangular', a: 0, b: 6, lower: 0, upper: 1 });
  assert.match(triangle.question, /a=0, b=6/);
  assert.match(triangle.question, /2\/\(b−a\)/);
  assert.doesNotMatch(triangle.question, /0\.333333/);
  assert.match(triangle.steps[0].formula, /≈/);
  const uniform = solve('continuous', { shape: 'uniform', a: 0, b: 3, lower: 0, upper: 1 });
  close(uniform.numeric, 1 / 3);
  assert.match(uniform.answer, /≈ 0\.3333333333/);
  assert.match(uniform.steps.at(-1).formula, /≈/);
  assert.ok(uniform.warnings.some(warning => /반올림/.test(warning)));
});

test('normal probability matches a standard one-sigma interval', () => {
  const result = solve('normal', { mu: 0, sigma: 1, n: 1, lower: -1, upper: 1 });
  close(result.numeric, 0.6826894921370859);
  assert.match(result.answer, /약/);
  assert.ok(result.warnings.length > 0);
});
test('sample mean standard error scales by square root n', () => {
  close(solve('normal', { mu: 50, sigma: 10, n: 25, lower: 48, upper: 52 }).numeric, 0.6826894921370859);
  close(solve('normal', { mu: 0, sigma: 1, n: 1, lower: -2, upper: 2 }).numeric, 0.9544997361036416);
});
test('normal extreme tails, equal endpoints and broad intervals stay valid', () => {
  const tail = solve('normal', { mu: 0, sigma: 1, lower: 8, upper: 9 });
  assert.ok(tail.numeric > 0 && tail.numeric < 1e-14);
  assert.equal(solve('normal', { lower: 50, upper: 50 }).numeric, 0);
  close(solve('normal', { lower: -1000, upper: 1000 }).numeric, 1);
});
test('normal rejects zero spread, noninteger sample sizes, and reversed bounds', () => {
  for (const params of [{ sigma: 0 }, { n: 1.5 }, { lower: 60, upper: 40 }]) assert.equal(solve('normal', params).status, 'invalid');
});
test('normal supplies the verified 2022 September exam table and solves with its rounded areas', () => {
  const result = solve('normal', { mu: 0, sigma: 1, lower: -1, upper: 1 });
  assert.deepEqual(result.normalTable.source, { exam: '2022학년도 대학수학능력시험 9월 모의평가', question: 27, pdfPage: 11 });
  assert.equal(result.normalTable.definition, 'P(0≤Z≤z)');
  assert.deepEqual(result.normalTable.rows, [
    { z: '0.5', probability: '0.1915' }, { z: '1.0', probability: '0.3413' },
    { z: '1.5', probability: '0.4332' }, { z: '2.0', probability: '0.4772' }
  ]);
  assert.match(result.answer, /0\.6826/);
  assert.match(result.steps.at(-1).body, /대칭/);
  assert.match(result.steps.at(-1).formula, /0\.3413/);
  close(result.numeric, 0.6826894921370859);
});
test('normal separates extra approximations from original exam rows and subtracts same-side areas', () => {
  const result = solve('normal', { mu: 0, sigma: 1, lower: 1.2, upper: 2 });
  assert.equal(result.normalTable.rows.length, 4);
  assert.deepEqual(result.normalTable.additionalRows, [{ z: '1.2', probability: '0.3849', label: '현재 문항 추가 근삿값' }]);
  assert.match(result.answer, /0\.0923/);
  assert.match(result.steps.at(-1).formula, /0\.4772−0\.3849/);
  assert.ok(result.normalTable.notes.some(note => /기출.*아닌|기출.*없는/.test(note)));
});

test('known-sigma 95 percent confidence interval has the expected width', () => {
  const result = solve('estimation', { mean: 50, sigma: 10, n: 100, confidence: '95', mode: 'precise' });
  close(result.numeric, 3.919927969080108);
  assert.match(result.answer, /48\.040036/);
  assert.match(result.answer, /51\.959964/);
});
test('quadrupling sample size halves CI length and confidence enlarges it', () => {
  const width100 = solve('estimation', { n: 100, query: 'length' }).numeric;
  const width400 = solve('estimation', { n: 400, query: 'length' }).numeric;
  close(width400, width100 / 2);
  assert.ok(solve('estimation', { confidence: '99' }).numeric > solve('estimation', { confidence: '90' }).numeric);
  close(solve('estimation', { mean: -250 }).numeric, width100);
});
test('confidence interval question supplies the selected normal critical value', () => {
  for (const [confidence, critical] of [['90', '1.644853627'], ['95', '1.9599639845'], ['99', '2.5758293035']]) {
    const result = solve('estimation', { confidence, mode: 'precise' });
    assert.ok(result.question.includes(`임계값 z≈${critical}`), result.question);
  }
});
test('estimation also supplies the exam table with separately identified textbook critical approximations', () => {
  const result = solve('estimation', { confidence: '95' });
  assert.equal(result.normalTable.source.pdfPage, 11);
  assert.ok(result.normalTable.additionalRows.some(row => row.z === '1.96' && row.probability === '0.4750'));
  assert.ok(result.steps.some(step => /표.*임계값/.test(step.title) && /1\.96/.test(step.formula)));
  assert.match(result.answer, /48\.04.*51\.96/);
  close(result.numeric, 3.92);
  for (const id of ['event-algebra', 'binomial', 'discrete', 'continuous']) assert.equal(solve(id, {}).normalTable, undefined);
});
test('confidence interval defaults to the textbook table and keeps every output on its selected basis', () => {
  for (const [confidence, z, length] of [['90', '1.645', 3.29], ['95', '1.96', 3.92], ['99', '2.58', 5.16]]) {
    const result = solve('estimation', { confidence, query: 'length' });
    close(result.numeric, length);
    assert.ok(result.question.includes(`임계값 z≈${z}`));
    assert.doesNotMatch(result.question, /1\.959963|2\.575829|1\.644853/);
    assert.ok(result.answer.includes(String(length)));
    assert.equal(result.steps.length, 3);
    assert.ok(result.chart.some(row => row.label.includes(`${confidence}%`) && Math.abs(row.value - length) < 1e-10));
  }
  assert.equal(solve('estimation', { mode: 'unsupported' }).status, 'invalid');
});
test('all numeric engines reject malformed input without NaN results', () => {
  for (const [id, key] of [['event-algebra', 'both'], ['binomial', 'n'], ['discrete', 'faces'], ['continuous', 'a'], ['normal', 'sigma'], ['estimation', 'sigma']]) {
    for (const value of [NaN, Infinity, '3', null, false]) {
      const result = solve(id, { [key]: value });
      assert.equal(result.status, 'invalid', `${id}: ${String(value)}`);
      assert.equal(result.numeric, null);
    }
    assert.equal(solve(id, { unsupported: 3 }).status, 'invalid');
  }
  assert.equal(solve('estimation', { sigma: 0 }).status, 'invalid');
  assert.equal(solve('estimation', { confidence: '92' }).status, 'invalid');
});
