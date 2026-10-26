import test from 'node:test';
import assert from 'node:assert/strict';
import { questionBlocks } from '../exam-paper.mjs';

test('exam layout retains the equation, every restriction and the final question', () => {
  const lines = ['4개의 변수 a, b, c, d에 대하여', 'a+b+c+d = 16', 'a: 자연수', 'b: 자연수', 'c: 자연수, 홀수', 'd: 자연수, 2 이상', 'a*b = 12', '모든 조건을 만족시키는 순서쌍의 개수를 구하시오.'];
  const blocks = questionBlocks(lines.join('\n'));
  assert.deepEqual(blocks.map(b => b.text), lines);
  assert.equal(blocks[1].kind, 'equation');
  assert.ok(blocks.slice(2, -1).every(b => b.kind === 'condition'));
  assert.equal(blocks.at(-1).kind, 'prose');
});

test('plain questions, trailing restrictions and untrusted text keep their content', () => {
  for (const question of ['성공할 확률이 1/2일 때 P(3≤X≤6)를 구하시오.', '자연수에 대하여\nx₁ + x₂ = 7\n를 만족시키는 순서쌍의 개수를 구하시오.\n두 수는 서로 다르다.', '<img src=x onerror=alert(1)>']) {
    assert.equal(questionBlocks(question).map(b => b.text).join('\n'), question);
  }
});

test('blank separators and the unlabeled-box preset trailing newline do not become conditions', () => {
  assert.deepEqual(questionBlocks('같은 공을 상자에 넣는다.\n\n제한 없이 분배하는 경우의 수를 구하시오.\n').map(b => [b.kind, b.text]), [
    ['prose', '같은 공을 상자에 넣는다.'], ['prose', '제한 없이 분배하는 경우의 수를 구하시오.'],
  ]);
});
