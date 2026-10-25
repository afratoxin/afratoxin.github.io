import test from 'node:test';
import assert from 'node:assert/strict';
import {createIndexedDBFixture} from './fixtures/indexeddb.mjs';

const sources = await import('../local-sources.mjs').catch(error => {
  if (error.code === 'ERR_MODULE_NOT_FOUND') return {};
  throw error;
});
const questions = [
  {id:'2601',examKey:'2026',number:1,sourcePage:317,sourceAccess:'local-only'},
  {id:'2501',examKey:'2025',number:1,sourcePage:297,sourceAccess:'local-only'},
  {id:'2701',examKey:'2027',number:1,sourcePage:337,text:'public original'},
];
// A synthetic 1 x 1 WEBP created from a solid-color test image, not source material.
const image='data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
const row=(id='2601',changes={})=>{
  const q=questions.find(q=>q.id===id);
  return {id,examKey:q.examKey,number:q.number,sourcePage:q.sourcePage,text:'1. 합성 본문\n① 선택지',image,...changes};
};
const pack=rows=>({schemaVersion:1,kind:'leet-atlas-local-sources',questions:rows});

test('a source pack preserves text and embedded images while stripping unrelated fields',()=>{
  assert.equal(typeof sources.parseLocalSourcePack,'function');
  const text='  <b>literal</b> & 본문\n① 합성 보기  ';
  const input=pack([row('2601',{text,url:'https://example.invalid/private'}),row('2501')]);
  const before=structuredClone(input);
  assert.deepEqual(sources.parseLocalSourcePack(JSON.stringify(input),questions),[
    {id:'2601',examKey:'2026',number:1,sourcePage:317,text,image},row('2501'),
  ]);
  assert.deepEqual(input,before);
});

test('malformed JSON and unsupported schemas reject the whole pack',()=>{
  for(const input of ['{',null,[],{},pack(null),{...pack([]),kind:'other'},{...pack([]),schemaVersion:2}]) {
    assert.throws(()=>sources.parseLocalSourcePack(input,questions));
  }
});

test('duplicate, unknown, public, and mismatched registry references are rejected',()=>{
  for(const rows of [
    [row(),row()],[row('2601',{id:'unknown'})],[row('2701')],
    [row('2601',{examKey:'2025'})],[row('2601',{number:2})],
    [row('2601',{sourcePage:318})],[row('2601',{sourcePage:undefined})],
    [row('2601',{sourcePage:0})],[row('2601',{number:'1'})],
  ]) assert.throws(()=>sources.parseLocalSourcePack(pack(rows),questions));
});

test('blank, non-string and excessive text rejects all records',()=>{
  for(const text of ['', ' \n\t ', null, 3, 'x'.repeat(100001)]) {
    assert.throws(()=>sources.parseLocalSourcePack(pack([row('2501'),row('2601',{text})]),questions));
  }
  assert.equal(sources.parseLocalSourcePack(pack([row('2601',{text:'x'.repeat(100000)})]),questions)[0].text.length,100000);
});

test('only base64 WEBP image data is accepted and remote URLs are never requested',()=>{
  const originalFetch=globalThis.fetch;
  let requests=0;
  globalThis.fetch=()=>{requests++;throw new Error('must not fetch');};
  try {
    for(const image of ['',null,'https://example.invalid/image.webp','data:image/png;base64,aGVsbG8=',
      'data:image/webp;base64,aGVsbG8=','data:image/webp;base64,@@@=',
      'data:image/webp;base64,UklGRgAAAABXRUJQ',row().image+'\n']) {
      assert.throws(()=>sources.parseLocalSourcePack(pack([row('2601',{image})]),questions));
    }
    assert.equal(requests,0);
  } finally {globalThis.fetch=originalFetch;}
});

test('per-record and whole-pack UTF-8 limits include embedded image data and metadata',()=>{
  assert.throws(()=>sources.parseLocalSourcePack(pack([row('2601',{image:'data:image/webp;base64,'+'A'.repeat(2*1024*1024)})]),questions));
  assert.throws(()=>sources.parseLocalSourcePack({...pack([row()]),metadata:'한'.repeat(23*1024*1024)},questions));
});

test('large WEBP data below the per-record limit validates without regex stack overflows',()=>{
  const bytes=Buffer.alloc(1024*1024);
  bytes.write('RIFF',0);bytes.writeUInt32LE(bytes.length-8,4);
  bytes.write('WEBPVP8 ',8);bytes.writeUInt32LE(bytes.length-20,16);
  const largeImage='data:image/webp;base64,'+bytes.toString('base64');
  assert.equal(sources.parseLocalSourcePack(pack([row('2601',{image:largeImage})]),questions)[0].image,largeImage);
});

test('IndexedDB save restores complete records and replaces the previous dataset',async()=>{
  assert.equal(typeof sources.saveLocalSources,'function');
  assert.equal(typeof sources.loadLocalSources,'function');
  const fixture=createIndexedDBFixture();
  await sources.saveLocalSources(fixture.indexedDB,[row(),row('2501')]);
  assert.deepEqual([...await sources.loadLocalSources(fixture.indexedDB,questions)].sort(),[
    ['2501',row('2501')],['2601',row()],
  ]);
  await sources.saveLocalSources(fixture.indexedDB,[row('2501',{text:'replacement'})]);
  assert.deepEqual([...await sources.loadLocalSources(fixture.indexedDB,questions)],[
    ['2501',row('2501',{text:'replacement'})],
  ]);
  await sources.saveLocalSources(fixture.indexedDB,[]);
  assert.equal((await sources.loadLocalSources(fixture.indexedDB,questions)).size,0);
});

test('save resolves only after commit and never treats request success as persistence',async()=>{
  const fixture=createIndexedDBFixture({records:[row()],holdCommits:true});
  let settled=false;
  const saving=sources.saveLocalSources(fixture.indexedDB,[row('2501')]).then(()=>{settled=true;});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(settled,false);
  assert.deepEqual(fixture.records(),[row()]);
  fixture.releaseCommits();
  await saving;
  assert.deepEqual(fixture.records(),[row('2501')]);
});

test('quota failure after clear and one successful put preserves the old dataset',async()=>{
  const fixture=createIndexedDBFixture({records:[row('2601',{text:'old'})],failPutAt:2});
  await assert.rejects(sources.saveLocalSources(fixture.indexedDB,[row(),row('2501')]),/Quota/);
  assert.deepEqual(fixture.records(),[row('2601',{text:'old'})]);
});

test('abort after all requests succeeded and synchronous put failures both preserve old data',async()=>{
  for(const options of [{abortOnCommit:true},{throwPut:true}]) {
    const fixture=createIndexedDBFixture({records:[row()],...options});
    await assert.rejects(sources.saveLocalSources(fixture.indexedDB,[row('2501')]));
    assert.deepEqual(fixture.records(),[row()]);
  }
});

test('unavailable, blocked, denied, corrupt and failed reads load an empty map',async()=>{
  for(const indexedDB of [undefined,{},...[
    {throwOpen:true},{failOpen:true},{blocked:true},{failRead:true},
    {failTransaction:true},{records:[row('2701')]},{records:[row('2601',{sourcePage:999})]},
    {records:[row(),row('2501',{image:'https://example.invalid/private.webp'})]},
  ].map(options=>createIndexedDBFixture(options).indexedDB)]) {
    assert.equal((await sources.loadLocalSources(indexedDB,questions)).size,0);
  }
});

test('unavailable storage and invalid or excessive writes reject without replacing data',async()=>{
  for(const indexedDB of [undefined,{},createIndexedDBFixture({throwOpen:true}).indexedDB,
    createIndexedDBFixture({failOpen:true}).indexedDB,createIndexedDBFixture({blocked:true}).indexedDB]) {
    await assert.rejects(sources.saveLocalSources(indexedDB,[row()]));
  }
  const fixture=createIndexedDBFixture({records:[row()]});
  for(const records of [[row(),row()],[row('2501',{text:''})],[row('2501',{image:'bad'})],
    Array.from({length:720},(_,i)=>({...row(),id:String(i),text:'한'.repeat(100000)}))]) {
    await assert.rejects(sources.saveLocalSources(fixture.indexedDB,records));
    assert.deepEqual(fixture.records(),[row()]);
  }
});

test('strict loading distinguishes failed reads from an empty source database',async()=>{
 const fixture=createIndexedDBFixture({records:[row()],failRead:true});
 await assert.rejects(()=>sources.loadLocalSources(fixture.indexedDB,questions,{strict:true}));
 assert.equal((await sources.loadLocalSources(fixture.indexedDB,questions)).size,0);
});
