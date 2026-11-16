import fs from 'node:fs';
import assert from 'node:assert/strict';
import {QUESTIONS,SOURCES} from './bank.mjs';
import {PATH_QUESTIONS,PHOTOS} from './pathology-bank.mjs';
import {LECTURE_QUESTIONS,TABLE_QUESTIONS,DOCUMENTS} from './study-bank.mjs';
import {CBL_PAST_QUESTIONS,CBL_PAST_EMPTY} from './cbl-past-bank.mjs';
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
const modules=['app.mjs','bank.mjs','logic.mjs','pathology-bank.mjs','pathology-ui.mjs','photo-data.mjs','reference-tables.mjs','study-bank.mjs','study-core.mjs','study-ui.mjs','emphasis.mjs','practice-layout.mjs','source-pages.mjs','antibiotic-revision.mjs','pathology-statements.mjs','supplemental-bank.mjs','course-catalog.mjs','extension-bank.mjs','extension-integrated.mjs','recall-catalog.mjs','recall-ui.mjs','quiz-keyboard.mjs','continuous-queue.mjs','bookmark-ui.mjs','enteric-media-bank.mjs','pathedu-bank.mjs','cbl-bank.mjs','cbl1-bank.mjs','cbl2-bank.mjs','cbl3-bank.mjs','cbl-original.mjs','cbl-past-bank.mjs','cbl-past1-bank.mjs','cbl-past2356-bank.mjs','cbl-past4-bank.mjs','question-curation.mjs','nov16-virus-bank.mjs','nov16-fungi-bank.mjs','nov16-integrated-fungi.mjs'];
for(const name of modules)for(const m of read(name).matchAll(/from '([^']+)'/g))assert.ok(fs.existsSync(new URL(m[1].split('?')[0],import.meta.url)),`missing module ${m[1]}`);
const version='20261116c';
assert.ok([...html.matchAll(/\?v=([^"']+)/g)].every(m=>m[1]===version),'HTML cache versions differ');
for(const name of modules)assert.ok([...read(name).matchAll(/\?v=([^"']+)/g)].every(m=>m[1]===version),`module cache versions differ: ${name}`);
for(const q of QUESTIONS)for(const ref of q.refs)assert.ok(SOURCES[ref],`unknown source ${ref}`);
assert.ok(QUESTIONS.some(q=>q.format==='mcq'));
assert.ok(QUESTIONS.every(q=>['mcq','ox'].includes(q.format)));
assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,QUESTIONS.length);
for(const im of Object.values(PHOTOS))assert.ok(fs.existsSync(new URL(im.src,import.meta.url)),`missing photo ${im.src}`);
for(const q of PATH_QUESTIONS)for(const ref of q.sourceRefs)assert.ok(ref.pages.every(p=>Number.isInteger(p)&&p>=1&&p<={path1:37,path2:66,lab:71,...Object.fromEntries(Object.entries(DOCUMENTS).map(([id,d])=>[id,d.pages]))}[ref.doc]),`bad page in ${q.id}`);
for(const q of CBL_PAST_QUESTIONS)for(const im of [...q.original.captures,...q.choiceImages||[]])assert.ok(fs.existsSync(new URL(im.src,import.meta.url)),`missing original ${im.src}`);
for(const section of CBL_PAST_EMPTY)for(const im of section.captures)assert.ok(fs.existsSync(new URL(im.src,import.meta.url)),`missing absence proof ${im.src}`);
console.log(`Validated ${ids.length} HTML IDs, ARIA/labels, ${modules.length} modules, ${Object.keys(PHOTOS).length} photos and all ${QUESTIONS.length+PATH_QUESTIONS.length+LECTURE_QUESTIONS.length+TABLE_QUESTIONS.length+CBL_PAST_QUESTIONS.length} questions, including ${CBL_PAST_QUESTIONS.length} original CBL exams.`);
