import fs from 'node:fs';
import assert from 'node:assert/strict';
import {QUESTIONS,SOURCES} from './bank.mjs';
const read=name=>fs.readFileSync(new URL(name,import.meta.url),'utf8');
const html=read('index.html');
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'duplicate HTML IDs');
for(const m of html.matchAll(/(?:aria-controls|aria-labelledby|for)="([^"]+)"/g)) {
  for(const id of m[1].split(' '))assert.ok(ids.includes(id),`missing ARIA/label target ${id}`);
}
for(const m of html.matchAll(/(?:src|href)="([^"#][^"]+)"/g)) {
  const path=m[1].split('?')[0];
  if(/^(?:https?:|data:|\.\.\/)/.test(path))continue;
  assert.ok(fs.existsSync(new URL(path,import.meta.url)),`missing asset ${path}`);
}
const app=read('app.mjs');
for(const m of app.matchAll(/from '([^']+)'/g)) {
  assert.ok(fs.existsSync(new URL(m[1].split('?')[0],import.meta.url)),`missing module ${m[1]}`);
}
const version='20261108a';
assert.ok([...html.matchAll(/\?v=([^"']+)/g)].every(m=>m[1]===version),'HTML cache versions differ');
assert.ok([...app.matchAll(/\?v=([^"']+)/g)].every(m=>m[1]===version),'module cache versions differ');
for(const q of QUESTIONS)for(const ref of q.refs)assert.ok(SOURCES[ref],`unknown source ${ref}`);
assert.equal(QUESTIONS.filter(q=>q.format==='mcq').length,36);
assert.equal(QUESTIONS.filter(q=>q.format==='ox').length,36);
console.log(`Validated ${ids.length} HTML IDs, ARIA/labels, static assets, module imports, source links and all 72 questions.`);
