// Presentation only: the engine's question remains the source for copying and solving.
export function questionBlocks(question) {
  const lines = String(question).split('\n').filter(text => text.trim());
  return lines.map((text, index) => ({
    text,
    kind: index === 0 || /구하시오[.。]?\s*$/.test(text) || /^를 만족/.test(text)
      ? 'prose'
      : index === 1 && /[=≤≥<>≠]/.test(text) && !/[가-힣]/.test(text)
        ? 'equation' : 'condition',
  }));
}

function element(document, tag, className, text) {
  const result = document.createElement(tag);
  result.className = className;
  if (text !== undefined) result.textContent = text;
  return result;
}

function inlineMath(document, target, text) {
  // Small, lossless typography pass. Never interpret question text as HTML.
  const tokens = /\b\d+\/\d+\b|[A-Za-z]\^[+-]?\d+|[A-Za-zΑ-ω][₀-₉̄]*|[=+≤≥<>−≠]|\*/gu;
  let cursor = 0;
  for (const match of text.matchAll(tokens)) {
    target.append(document.createTextNode(text.slice(cursor, match.index)));
    const token = match[0];
    if (/^\d+\//.test(token)) {
      const [numerator, denominator] = token.split('/');
      const fraction = element(document, 'span', 'exam-fraction');
      fraction.append(element(document, 'span', 'exam-numerator', numerator), element(document, 'span', 'sr-only', '/'), element(document, 'span', 'exam-denominator', denominator));
      target.append(fraction);
    } else if (token.includes('^')) {
      const [base, exponent] = token.split('^');
      const power = element(document, 'span', 'exam-power');
      power.append(element(document, 'i', 'exam-variable', base), element(document, 'span', 'sr-only', '^'), element(document, 'sup', '', exponent));
      target.append(power);
    } else target.append(element(document, 'span', token === '*' ? 'exam-times' : /^[=+≤≥<>−≠]$/.test(token) ? 'exam-operator' : 'exam-variable', token));
    cursor = match.index + token.length;
  }
  target.append(document.createTextNode(text.slice(cursor)));
}

export function renderExamQuestion(target, question, { valid = true } = {}) {
  const document = target.ownerDocument ?? globalThis.document;
  target.replaceChildren();
  target.classList.toggle('exam-question-invalid', !valid);
  let conditions = null;
  let conditionIndex = 0;
  const labels = '가나다라마바사아자차카타파하';
  for (const block of questionBlocks(question)) {
    if (block.kind === 'condition' && valid) {
      if (!conditions) {
        conditions = element(document, 'div', 'exam-conditions');
        conditions.setAttribute('role', 'group');
        conditions.setAttribute('aria-label', '문항 조건');
        target.append(conditions);
      }
      const row = element(document, 'div', 'exam-condition');
      const label = element(document, 'span', 'exam-condition-label', `(${labels[conditionIndex] ?? conditionIndex + 1})`);
      const content = element(document, 'p', 'exam-condition-text');
      inlineMath(document, content, block.text);
      row.append(label, content);
      conditions.append(row);
      conditionIndex++;
    } else {
      conditions = null;
      const paragraph = element(document, 'p', block.kind === 'equation' ? 'exam-equation' : 'exam-prose');
      inlineMath(document, paragraph, block.text);
      target.append(paragraph);
    }
  }
}
