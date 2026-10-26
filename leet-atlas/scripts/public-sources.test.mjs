import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createImageBundleStore} from '../core.mjs';

const root=new URL('../',import.meta.url);
const archive=JSON.parse(await readFile(new URL('data/archive.json',root),'utf8'));

test('all 715 added public originals resolve through the real image bundle loader',async()=>{
 const requested=new Set();
 const store=createImageBundleStore(async path=>{
  requested.add(path);
  return {ok:true,json:async()=>JSON.parse(await readFile(new URL(path,root),'utf8'))};
 });
 assert.equal(archive.publicationMode,'full-content');
 assert.equal(archive.questions.length,755);
 const added=archive.questions.filter(q=>q.examKey!=='2027');
 assert.equal(added.length,715);
 for(const q of added){
  assert.equal(q.sourceAccess,'bundled',q.id);
  assert.ok(q.text.startsWith(`${q.number}.`),q.id);
  assert.ok(q.text.includes('⑤'),q.id);
  assert.match(await store.load(q),/^data:image\/webp;base64,UklGR/,q.id);
 }
 assert.equal(requested.size,20);
});
