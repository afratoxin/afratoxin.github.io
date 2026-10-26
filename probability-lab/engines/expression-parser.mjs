// A deliberately small integer-expression grammar. No JavaScript is executed.
const MAX_SOURCE = 500;
const MAX_NODES = 150;
const MAX_DEPTH = 24;
const MAX_DEGREE = 4;
const safe = n => {
  if (!Number.isSafeInteger(n)) throw new Error('식의 중간 계산값이 안전한 정수 범위를 벗어납니다. 상수를 줄이세요.');
  return n;
};

export function parseExpression(source, k = 8) {
  if (typeof source !== 'string' || !source.trim()) throw new Error('비어 있지 않은 식을 입력하세요.');
  if (source.length > MAX_SOURCE) throw new Error(`식은 ${MAX_SOURCE}자 이내로 입력하세요.`);
  if (!Number.isInteger(k) || k < 1 || k > 8) throw new Error('문자의 수는 1~8이어야 합니다.');
  const text = source.replaceAll('×', '*').replaceAll('−', '-').replaceAll('²', '^2');
  const tokens = [];
  let pos = 0;
  while (pos < text.length) {
    const char = text[pos];
    if (/\s/.test(char)) { pos++; continue; }
    if ('+-*^()'.includes(char)) { tokens.push({ kind: char }); pos++; continue; }
    if (/\d/.test(char)) {
      const start = pos;
      while (pos < text.length && /\d/.test(text[pos])) pos++;
      const literal = text.slice(start, pos), value = Number(literal);
      if (!Number.isSafeInteger(value) || value > 10000) throw new Error('식의 정수 상수는 절댓값 10000 이하로 입력하세요.');
      tokens.push({ kind: 'number', value });
      continue;
    }
    if (/[A-Za-z_]/.test(char)) {
      const start = pos;
      while (pos < text.length && /[A-Za-z_0-9]/.test(text[pos])) pos++;
      const name = text.slice(start, pos);
      let index = /^[a-h]$/.test(name) ? name.charCodeAt(0) - 97 : /^x[1-8]$/.test(name) ? Number(name[1]) - 1 : -1;
      if (index < 0 || index >= k) throw new Error(`사용할 수 없는 문자 ${name}입니다. a부터 ${String.fromCharCode(96 + k)}까지 사용하세요.`);
      tokens.push({ kind: 'variable', index });
      continue;
    }
    throw new Error(`식에 사용할 수 없는 기호 '${char}'가 있습니다. +, -, *, ×, ^2와 괄호만 사용하세요.`);
  }
  tokens.push({ kind: 'end' });
  let cursor = 0, nodes = 0, nesting = 0;
  const current = () => tokens[cursor];
  const node = value => {
    if (++nodes > MAX_NODES) throw new Error(`식이 너무 복잡합니다. 연산과 항을 ${MAX_NODES}개 이내로 줄이세요.`);
    return value;
  };
  const descend = fn => {
    if (++nesting > MAX_DEPTH) throw new Error(`괄호와 부호의 깊이는 ${MAX_DEPTH}단계 이내로 줄이세요.`);
    try { return fn(); } finally { nesting--; }
  };
  function atom() {
    const token = current();
    if (token.kind === 'number') { cursor++; return node({ type: 'number', value: token.value }); }
    if (token.kind === 'variable') { cursor++; return node({ type: 'variable', index: token.index }); }
    if (token.kind === '(') {
      cursor++;
      const result = descend(sum);
      if (current().kind !== ')') throw new Error('괄호의 짝이 맞지 않습니다.');
      cursor++;
      return result;
    }
    throw new Error('숫자, 문자 또는 괄호로 묶인 식이 필요합니다.');
  }
  function power() {
    let result = atom();
    if (current().kind === '^') {
      cursor++;
      if (current().kind !== 'number' || current().value !== 2) throw new Error('거듭제곱은 ^2만 사용할 수 있습니다.');
      cursor++;
      result = node({ type: 'square', argument: result });
    }
    return result;
  }
  function unary() {
    if (current().kind === '+' || current().kind === '-') {
      const op = current().kind;
      cursor++;
      return node({ type: 'unary', op, argument: descend(unary) });
    }
    return power();
  }
  function product() {
    let result = unary();
    while (current().kind === '*') {
      cursor++;
      result = node({ type: 'binary', op: '*', left: result, right: unary() });
    }
    return result;
  }
  function sum() {
    let result = product();
    while (current().kind === '+' || current().kind === '-') {
      const op = current().kind;
      cursor++;
      result = node({ type: 'binary', op, left: result, right: product() });
    }
    return result;
  }
  const ast = sum();
  if (current().kind !== 'end') throw new Error('식의 연결을 확인하세요. 곱셈에는 * 또는 ×를 쓰고 거듭제곱은 괄호로 구분하세요.');
  function depth(tree) {
    if (tree.type === 'binary') return 1 + Math.max(depth(tree.left), depth(tree.right));
    if (tree.argument) return 1 + depth(tree.argument);
    return 1;
  }
  if (depth(ast) > MAX_DEPTH) throw new Error(`식의 연산 깊이는 ${MAX_DEPTH}단계 이내로 줄이세요.`);
  polynomial(ast); // Verify degree and exact integer coefficients before use.
  return ast;
}

export function evaluateExpression(ast, values) {
  switch (ast.type) {
    case 'number': return ast.value;
    case 'variable': return safe(values[ast.index]);
    case 'unary': return safe((ast.op === '-' ? -1 : 1) * evaluateExpression(ast.argument, values));
    case 'square': { const value = evaluateExpression(ast.argument, values); return safe(value * value); }
    case 'binary': {
      const left = evaluateExpression(ast.left, values), right = evaluateExpression(ast.right, values);
      return safe(ast.op === '+' ? left + right : ast.op === '-' ? left - right : left * right);
    }
    default: throw new Error('올바르지 않은 식입니다.');
  }
}

export function expressionVariables(ast) {
  const result = new Set();
  function visit(tree) {
    if (tree.type === 'variable') result.add(tree.index);
    if (tree.argument) visit(tree.argument);
    if (tree.left) visit(tree.left);
    if (tree.right) visit(tree.right);
  }
  visit(ast);
  return result;
}

export function polynomial(ast) {
  const append = (map, key, value) => {
    const coefficient = safe((map.get(key) || 0) + value);
    if (coefficient) map.set(key, coefficient); else map.delete(key);
  };
  function multiply(left, right) {
    const result = new Map();
    for (const [a, av] of left) for (const [b, bv] of right) {
      const indices = [...(a === '' ? [] : a.split(',')), ...(b === '' ? [] : b.split(','))].sort((x, y) => Number(x) - Number(y));
      if (indices.length > MAX_DEGREE) throw new Error(`식의 차수는 ${MAX_DEGREE} 이하로 입력하세요.`);
      append(result, indices.join(','), safe(av * bv));
    }
    return result;
  }
  function expand(tree) {
    if (tree.type === 'number') return tree.value ? new Map([['', tree.value]]) : new Map();
    if (tree.type === 'variable') return new Map([[String(tree.index), 1]]);
    if (tree.type === 'unary') return new Map([...expand(tree.argument)].map(([key, value]) => [key, tree.op === '-' ? safe(-value) : value]));
    if (tree.type === 'square') { const base = expand(tree.argument); return multiply(base, base); }
    if (tree.type === 'binary') {
      const left = expand(tree.left), right = expand(tree.right);
      if (tree.op === '*') return multiply(left, right);
      for (const [key, value] of right) append(left, key, tree.op === '-' ? -value : value);
      return left;
    }
    throw new Error('올바르지 않은 식입니다.');
  }
  return expand(ast);
}
