import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const html = fs.readFileSync(new URL('index.html', root), 'utf8');
const css = ['style.css','design.css'].map(path=>fs.readFileSync(new URL(path,root),'utf8')).join('\n');
const runner = fileURLToPath(new URL('./helpers/ui-runner.mjs', import.meta.url));

function cssRules(text, media = []) {
  text = text.replace(/\/\*[\s\S]*?\*\//g, '');
  const result = [];
  let cursor = 0;
  while (cursor < text.length) {
    const open = text.indexOf('{', cursor); if (open < 0) break;
    let end = open + 1, depth = 1;
    while (end < text.length && depth) { if (text[end] === '{') depth++; else if (text[end] === '}') depth--; end++; }
    const header = text.slice(cursor, open).trim(), body = text.slice(open + 1, end - 1);
    if (header.startsWith('@media')) result.push(...cssRules(body, [...media, header]));
    else if (!header.startsWith('@')) result.push({ selectors: header.split(',').map(s => s.trim()), body, media });
    cursor = end;
  }
  return result;
}
const rules = cssRules(css);
function authoredStyle(selector, width, height = 900) {
  const result = {};
  for (const rule of rules) {
    if (!rule.selectors.includes(selector)) continue;
    if (!rule.media.every(media => [...media.matchAll(/(min|max)-(width|height)\s*:\s*(\d+)px/g)].every(([,side,axis,value]) => side === 'min' ? (axis==='width'?width:height) >= Number(value) : (axis==='width'?width:height) <= Number(value)))) continue;
    for (const declaration of rule.body.split(';')) {
      const colon = declaration.indexOf(':'); if (colon >= 0) result[declaration.slice(0, colon).trim()] = declaration.slice(colon + 1).trim();
    }
  }
  return result;
}
function tracks(value) {
  let depth = 0, result = 0, word = false;
  for (const char of value ?? '') {
    if (char === '(') depth++; if (char === ')') depth--;
    if (/\s/.test(char) && !depth) word = false;
    else if (!word) { result++; word = true; }
  }
  return result;
}

// Static CSS assertions check the authored layout contract, not rendered pixels.
test('layout contract: app height follows the dynamic viewport and the page itself does not vertically scroll', () => {
  assert.ok(/(?:height|block-size)\s*:\s*100dvh/.test(css), 'the app must use 100dvh');
  assert.ok(/body\s*\{[^}]*overflow(?:-y)?\s*:\s*hidden/s.test(css), 'body must prevent page-level vertical scrolling');
  assert.ok(/min-height\s*:\s*0/.test(css), 'nested pane tracks must be allowed to shrink');
});

test('layout contract: desktop has three separate work panes and narrow screens use an active pane', () => {
  assert.ok(/grid-template-columns\s*:[^;{}]*minmax\([^;{}]*minmax\([^;{}]*minmax\(/.test(css), 'desktop must define three flexible grid tracks');
  assert.match(html, /조정/); assert.match(html, /문제/); assert.match(html, /해설/);
  assert.ok(/data-(?:lab-)?pane|data-active(?:-pane)?/.test(css), 'narrow layout must select an active pane');
});

test('layout contract: later media rules cannot restore a two-column desktop or stack all narrow panes', () => {
  for (const width of [1024, 1280, 1440]) {
    const desktop = authoredStyle('.lab-grid', width);
    assert.equal(tracks(desktop['grid-template-columns']), 3, `${width}px authored desktop cascade has three tracks`);
    assert.ok(/minmax\(\s*0\s*,/.test(desktop['grid-template-columns'] ?? ''), 'flexible grid tracks prevent content from forcing a wide page');
  }
  for (const width of [390, 768, 1023]) assert.equal(tracks(authoredStyle('.lab-grid', width)['grid-template-columns']), 1, `${width}px authored narrow cascade exposes one pane at a time`);
  assert.ok(rules.some(rule => rule.media.some(m => /max-width/.test(m)) && /data-(?:lab-)?pane|data-active(?:-pane)?/.test(rule.selectors.join(' ')) && /display\s*:\s*none/.test(rule.body)), 'narrow rules hide inactive panes instead of leaving three vertically stacked panels');
  for (const width of [390, 1024, 1440]) assert.equal(authoredStyle('body', width).overflow, 'hidden');
  assert.equal(authoredStyle('.workbench-pane', 1440)['min-width'], '0');
  assert.equal(authoredStyle('.workbench-pane', 1440)['min-height'], '0');
  assert.equal(authoredStyle('.adjust-content', 1440).overflow, 'auto', 'short screens retain an internal fallback instead of clipping controls');
});

for (const [scenario, name] of [
  ['layout-tabs', 'adjustment tabs and basic pages expose every input while retaining hidden values'],
  ['layout-structure', 'eight variable cards and twelve conditions remain editable through their actual pages'],
  ['layout-phone', 'narrow pane navigation and appendix tabs preserve state and keyboard access'],
]) {
  test(`layout contract: ${name}`, () => {
    const result = spawnSync(process.execPath, [runner, scenario], { encoding: 'utf8', timeout: 25000, maxBuffer: 1024 * 1024 });
    assert.ifError(result.error); assert.equal(result.status, 0, result.stderr || result.stdout); assert.match(result.stdout, /PASS/);
  });
}

test('layout contract: normal bounds keep their complete numeric stepper across both metadata columns', () => {
  for (const width of [390,1024,1440]) {
    const wrapper=authoredStyle('.normal-bound-field .drag-meta .value-stepper',width);
    assert.equal(wrapper['grid-column'],'1 / -1');
    const input=authoredStyle('.normal-bound-field .drag-meta .control-value-input',width);
    assert.equal(input['min-width'],'0');
    assert.equal(input.width,'auto');
  }
});

test('layout contract: short mobile landscape keeps fixed controls compact around a scrollable editor',()=>{
  assert.equal(authoredStyle('.pane-title-row',844,390).display,'none');
  assert.equal(authoredStyle('.adjust-description',844,390).display,'none');
  assert.equal(authoredStyle('.adjust-content',844,390).overflow,'auto');
  assert.equal(authoredStyle('.controls-actions',844,390).padding,'6px 10px');
  assert.equal(tracks(authoredStyle('.lab-grid',844,390)['grid-template-columns']),1);
});
