(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RotationPattern = factory();
})(typeof window === 'object' ? window : this, function () {
  'use strict';
  const OPS = {
    cw: { label: '오른쪽 90°', symbol: '↻', axis: 'Z', angle: 90 },
    ccw: { label: '왼쪽 90°', symbol: '↺', axis: 'Z', angle: -90 },
    half: { label: '180° 회전', symbol: '↻', axis: 'Z', angle: 180 },
    left: { label: '왼쪽으로 뒤집기', symbol: '↔', axis: 'Y', angle: -180 },
    right: { label: '오른쪽으로 뒤집기', symbol: '↔', axis: 'Y', angle: 180 },
    up: { label: '위로 뒤집기', symbol: '↕', axis: 'X', angle: 180 },
    down: { label: '아래로 뒤집기', symbol: '↕', axis: 'X', angle: -180 }
  };
  function transform(index, n, op) {
    const r = Math.floor(index / n), c = index % n;
    switch (op) {
      case 'cw': return c * n + n - 1 - r;
      case 'ccw': return (n - 1 - c) * n + r;
      case 'half': return n * n - 1 - index;
      case 'left': case 'right': return r * n + n - 1 - c;
      case 'up': case 'down': return (n - 1 - r) * n + c;
      default: throw new Error('Unknown transformation: ' + op);
    }
  }
  function apply(indices, n, ops) {
    return ops.reduce((arr, op) => arr.map(i => transform(i, n, op)), [...indices]);
  }
  function same(a, b) {
    const sorted = [...b].sort((x, y) => x - y);
    return a.length === b.length && [...a].sort((x, y) => x - y).every((v, i) => v === sorted[i]);
  }
  function config(round) {
    const stage = Math.max(1, Math.min(20, Math.floor(Number(round) || 1)));
    const size = stage < 7 ? 5 : stage < 13 ? 6 : 7;
    // Six consecutive clears establish familiarity before the board grows.
    // On an expansion, restore observation time and keep the transformation count.
    const memory = stage <= 4 || stage >= 7 && stage <= 10 || stage >= 13 && stage <= 17 ? 10 : stage >= 19 ? 8 : 9;
    return {
      round: stage, size, count: stage + 4, memory,
      transforms: stage < 4 ? 1 : stage < 10 ? 2 : stage < 17 ? 3 : 4,
      answer: size === 5 ? 30 : size === 6 ? 35 : 40
    };
  }
  function make(options, random = Math.random) {
    const { size: n, count, transforms } = options;
    if (!Number.isInteger(n) || n < 3 || n > 11 || !Number.isInteger(count) || count < 1 || count > n * n - 2 || !Number.isInteger(transforms) || transforms < 1 || transforms > 6) throw new Error('Invalid puzzle configuration');
    const symmetries = [['cw'], ['ccw'], ['half'], ['left'], ['up'], ['cw', 'left'], ['cw', 'up']];
    let source;
    for (let attempt = 0; attempt < 500; attempt++) {
      const cells = Array.from({ length: n * n }, (_, i) => i);
      for (let i = cells.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [cells[i], cells[j]] = [cells[j], cells[i]];
      }
      source = cells.slice(0, count).sort((a, b) => a - b);
      if (!symmetries.some(ops => same(source, apply(source, n, ops)))) break;
    }
    const operations = [];
    let current = source;
    for (let step = 0; step < transforms; step++) {
      const choices = Object.keys(OPS).filter(op => {
        const last = operations[operations.length - 1];
        if (last && same(apply([0, 1, 3], 2, [last, op]), [0, 1, 3])) return false;
        const next = apply(current, n, [op]);
        return !same(next, source) && !same(next, current);
      });
      const op = choices[Math.floor(random() * choices.length)];
      operations.push(op);
      current = apply(current, n, [op]);
    }
    return { ...options, source, operations, target: current.sort((a, b) => a - b) };
  }
  function judge(target, selected) {
    const chosen = new Set(selected), wanted = new Set(target);
    const missing = target.filter(i => !chosen.has(i));
    const extra = [...chosen].filter(i => !wanted.has(i));
    return { correct: !missing.length && !extra.length, missing, extra, hits: target.filter(i => chosen.has(i)) };
  }
  return { OPS, transform, apply, same, config, make, judge };
});
