import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const css=await readFile(new URL('../styles.css',import.meta.url),'utf8');
test('original images fit the panel and viewport while retaining natural proportions',()=>{
 const rules=[...css.matchAll(/\.source-image\{([^}]*)\}/g)].map(m=>m[1]);
 const cascade=Object.fromEntries(rules.flatMap(rule=>rule.split(';').filter(Boolean).map(d=>{const [name,...value]=d.split(':');return[name.trim(),value.join(':').trim()];})));
 assert.equal(cascade.width,'auto');
 assert.equal(cascade.height,'auto');
 assert.equal(cascade['max-height'],'88vh');
 assert.doesNotMatch(css,/--source-image-max-height/);
});
