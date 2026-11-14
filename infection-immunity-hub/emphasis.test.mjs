import test from 'node:test';
import assert from 'node:assert/strict';

const load = () => import('./emphasis.mjs');
const withoutMarks = html => html.replace(/<mark class="mark-(?:red|blue|yellow)">|<\/mark>/g, '');

test('HTML is escaped before any emphasis is added', async () => {
  const { escapeHTML, emphasizeFeedback, emphasizePrompt } = await load();
  const text = '<img src=x onerror="alert(1)"> & \'항산성\' 옳지 않은';
  const escaped = '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#39;항산성&#39; 옳지 않은';
  assert.equal(escapeHTML(text), escaped);
  for (const html of [emphasizeFeedback(text), emphasizePrompt(text), emphasizeFeedback(text, { clue: true })]) {
    assert.equal(withoutMarks(html), escaped);
    assert.doesNotMatch(html, /<img|onerror="/);
  }
});

test('prompts emphasize task wording without revealing diagnostic clues or organisms', async () => {
  const { escapeHTML, emphasizePrompt } = await load();
  const text = '그람양성, catalase 양성인 Staphylococcus aureus에 대한 설명 중 옳지 않은 것은?';
  const html = emphasizePrompt(text);
  assert.equal(html, `${escapeHTML(text.slice(0, text.indexOf('옳지 않은')))}<mark class="mark-red">옳지 않은</mark> 것은?`);
  assert.doesNotMatch(html, /<mark[^>]*>(?:그람양성|catalase|Staphylococcus|aureus)/);
  assert.match(emphasizePrompt('가장 가능성이 높은 원인과 우선 시행할 검사는?'), /mark-blue.*가장 가능성이 높은.*mark-yellow.*우선/);
});

test('feedback marks a small diagnostic vocabulary without nesting or splitting Latin names', async () => {
  const { escapeHTML, emphasizeFeedback } = await load();
  const text = '그람양성/그람음성, 항산성; coagulase, catalase, optochin, PYR. 핵 내/세포질, 예각/직각, 무통성/통증성, 수양성/혈성, GABA/glycine/EF-2. Mycobacterium pyri catalaseLike anti-GABA.';
  const html = emphasizeFeedback(text);
  assert.equal(withoutMarks(html), escapeHTML(text));
  assert.match(html, /<mark class="mark-blue">그람양성<\/mark>/);
  assert.match(html, /<mark class="mark-red">그람음성<\/mark>/);
  assert.match(html, /<mark class="mark-yellow">coagulase<\/mark>/);
  assert.ok(!/<mark[^>]*>[^<]*<mark/.test(html), 'marks must never nest');
  assert.ok(html.endsWith('Mycobacterium pyri catalaseLike anti-GABA.'), 'Latin words and compound words stay whole');
  assert.equal(emphasizeFeedback(text), html, 'matching is deterministic');
});

test('clues use one yellow marker and preserve every escaped character', async () => {
  const { escapeHTML, emphasizeFeedback } = await load();
  const text = '  항산성\n핵 내 <핵심> & EF-2  ';
  assert.equal(emphasizeFeedback(text, { clue: true }), `<mark class="mark-yellow">${escapeHTML(text)}</mark>`);
  assert.equal(emphasizeFeedback(''), '');
});
