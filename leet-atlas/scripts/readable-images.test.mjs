import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const css=await readFile(new URL('../styles.css',import.meta.url),'utf8');
test('original images use panel width and natural height instead of viewport fitting',()=>{
 const rules=[...css.matchAll(/\.source-image\{([^}]*)\}/g)].map(m=>m[1]);
 const cascade=Object.fromEntries(rules.flatMap(rule=>rule.split(';').filter(Boolean).map(d=>{const [name,...value]=d.split(':');return[name.trim(),value.join(':').trim()];})));
 assert.equal(cascade.width,'100%');
 assert.equal(cascade.height,'auto');
 assert.equal(cascade['max-height'],'none');
 assert.doesNotMatch(css,/--source-image-max-height/);
});
