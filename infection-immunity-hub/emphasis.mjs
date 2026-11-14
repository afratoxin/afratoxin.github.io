const HTML_ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => HTML_ENTITIES[character]);
}

function marker(entries) {
  const colors = new Map(entries.map(([term, color]) => [term.toLowerCase(), color]));
  const alternatives = [...colors.keys()].sort((a, b) => b.length - a.length).map(term => {
    const literal = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Whole Latin tokens avoid altering names, longer words, and compounds.
    return /^[a-z]/i.test(term) ? `(?<![\\p{L}\\p{N}_-])${literal}(?![\\p{L}\\p{N}_-])` : literal;
  });
  const pattern = new RegExp(alternatives.join('|'), 'giu');
  return text => escapeHTML(text).replace(pattern, term => `<mark class="mark-${colors.get(term.toLowerCase())}">${term}</mark>`);
}

const markPrompt = marker([
  ['옳지 않은', 'red'], ['틀린', 'red'], ['맞지 않은', 'red'],
  ['적절하지 않은', 'red'], ['잘못된', 'red'],
  ['가장 가능성이 높은', 'blue'], ['가장 가능성 높은', 'blue'],
  ['가장 적절한', 'blue'], ['옳은', 'blue'], ['우선', 'yellow'],
]);

const markFeedback = marker([
  ['그람양성', 'blue'], ['그람음성', 'red'], ['항산성', 'red'],
  ['coagulase', 'yellow'], ['catalase', 'yellow'], ['optochin', 'yellow'], ['PYR', 'yellow'],
  ['핵 내', 'blue'], ['핵내', 'blue'], ['세포질', 'red'],
  ['예각', 'blue'], ['직각', 'red'], ['무통성', 'blue'], ['통증성', 'red'],
  ['수양성', 'blue'], ['혈성', 'red'], ['GABA', 'yellow'], ['glycine', 'yellow'], ['EF-2', 'yellow'],
]);

export function emphasizePrompt(text) {
  return markPrompt(text);
}

export function emphasizeFeedback(text, { clue = false } = {}) {
  return clue ? `<mark class="mark-yellow">${escapeHTML(text)}</mark>` : markFeedback(text);
}
