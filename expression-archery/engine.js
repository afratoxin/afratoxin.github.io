(function (root) {
  'use strict';

  const RINGS = [
    { points: 1, values: [1.25, -2, 1, 37, 19, 45, -7, 108, 216, 15, 66, 31, 90, -0.5, 54] },
    { points: 2, values: [15625, 52, 78, 1.2, 701, 7777, -1.5, 47, 2.25, 732] },
    { points: 3, values: [716, 244, 601, 5184, 4090, -351] },
    { points: 4, values: [175, 373, 777] },
    { points: 5, values: [8388610] }
  ];

  function calculate(expression, cards) {
    if (typeof expression !== 'string' || !expression.trim() || expression.length > 120) {
      throw new Error('수식을 입력해 주세요 (최대 120자).');
    }
    const source = expression.replace(/\s/g, '').replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-');
    const tokens = source.match(/(?:[1-9]|[()+\-*/^!√])/g);
    if (!tokens || tokens.join('') !== source) throw new Error('한 자리 숫자와 + − × ÷ ^ √ ! 괄호만 사용할 수 있습니다.');
    const allowed = new Set(cards.map(Number));
    let i = 0;
    const check = value => {
      if (!Number.isFinite(value) || Math.abs(value) > 1e13) throw new Error('계산할 수 있는 범위를 넘었습니다.');
      return value;
    };
    function primary() {
      const t = tokens[i++];
      if (t === '(') {
        const v = sum();
        if (tokens[i++] !== ')') throw new Error('괄호가 맞지 않습니다.');
        return v;
      }
      if (t && /^[1-9]$/.test(t)) {
        if (!allowed.has(Number(t))) throw new Error(`${t}은(는) 이번 숫자 카드에 없습니다.`);
        return Number(t);
      }
      throw new Error('숫자 또는 괄호가 필요한 위치입니다.');
    }
    function postfix() {
      let v = primary();
      while (tokens[i] === '!') {
        i++;
        if (!Number.isInteger(v) || v < 0 || v > 12) throw new Error('팩토리얼은 0~12의 정수에만 쓸 수 있습니다.');
        let result = 1;
        for (let k = 2; k <= v; k++) result *= k;
        v = result;
      }
      return v;
    }
    function power() {
      const v = postfix();
      if (tokens[i] === '^') {
        i++;
        return check(Math.pow(v, unary()));
      }
      return v;
    }
    function unary() {
      if (tokens[i] === '+') { i++; return unary(); }
      if (tokens[i] === '-') { i++; return -unary(); }
      if (tokens[i] === '√') {
        i++;
        const v = unary();
        if (v < 0) throw new Error('음수의 제곱근은 사용할 수 없습니다.');
        return check(Math.sqrt(v));
      }
      return power();
    }
    function product() {
      let v = unary();
      while (tokens[i] === '*' || tokens[i] === '/') {
        const op = tokens[i++], right = unary();
        if (op === '/' && right === 0) throw new Error('0으로 나눌 수 없습니다.');
        v = check(op === '*' ? v * right : v / right);
      }
      return v;
    }
    function sum() {
      let v = product();
      while (tokens[i] === '+' || tokens[i] === '-') {
        const op = tokens[i++], right = product();
        v = check(op === '+' ? v + right : v - right);
      }
      return v;
    }
    const value = sum();
    if (i !== tokens.length) throw new Error('수식 끝에 처리하지 못한 기호가 있습니다.');
    return check(value);
  }

  function matches(value, target) { return Math.abs(value - target) <= 1e-7; }

  function scoreClaim(claimed, ringIndex, targetIndex) {
    const key = `${ringIndex}:${targetIndex}`;
    if (claimed.has(key)) throw new Error('이미 맞힌 목표입니다.');
    const next = new Set(claimed);
    next.add(key);
    const ring = RINGS[ringIndex];
    let bonus = 0;
    if (ring.values.length >= 3) {
      const seenTriples = new Set();
      for (let start = 0; start < ring.values.length; start++) {
        const triple = [0, 1, 2].map(offset => `${ringIndex}:${(start + offset) % ring.values.length}`);
        const identity = [...triple].sort().join('|');
        if (seenTriples.has(identity)) continue;
        seenTriples.add(identity);
        if (triple.every(item => next.has(item)) && !triple.every(item => claimed.has(item))) bonus += 2;
      }
    }
    return { next, points: ring.points + bonus, bonus };
  }

  const api = { RINGS, calculate, matches, scoreClaim };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.ArcheryEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
