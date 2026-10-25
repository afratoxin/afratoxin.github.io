import test from 'node:test';
import assert from 'node:assert/strict';
import {LOCAL_TEXT_STORAGE_KEY, parseLocalTextPack, loadLocalTexts, saveLocalTexts} from '../local-text.mjs';

const questions = [
  {id:'2601',examKey:'2026',number:1,sourcePage:317,sourceAccess:'local-only'},
  {id:'2501',examKey:'2025',number:1,sourcePage:297,sourceAccess:'local-only'},
  {id:'2701',examKey:'2027',number:1,sourcePage:337},
];
const row = (id='2601', change={}) => {
  const q=questions.find(q=>q.id===id);
  return {id,examKey:q.examKey,number:q.number,sourcePage:q.sourcePage,text:'1. 복사 가능한 본문과 선택지입니다.\n① 첫 번째 선택지',...change};
};
const pack = rows => ({schemaVersion:1,kind:'leet-atlas-local-text',questions:rows});

test('parsing retains exact text while returning only local record fields in input order',()=>{
  const text='  <script>literal text</script> & "본문"\n① A ② B  ';
  const input=pack([row('2601',{text,options:[{text:'extra'}],image:'ignored'}),row('2501')]);
  const before=structuredClone(input);
  assert.deepEqual(parseLocalTextPack(JSON.stringify(input),questions),[
    {id:'2601',text,sourcePage:317,examKey:'2026',number:1},
    {id:'2501',text:row('2501').text,sourcePage:297,examKey:'2025',number:1},
  ]);
  assert.deepEqual(input,before);
});

test('invalid schema and malformed JSON fail before importing any records',()=>{
  for(const input of ['{',null,[],{},pack(null),{...pack([]),kind:'other'},{...pack([]),schemaVersion:2}]) {
    assert.throws(()=>parseLocalTextPack(input,questions));
  }
});

test('duplicate, unknown, public and mismatched question references are rejected',()=>{
  for(const rows of [
    [row(),row()],
    [row('2601',{id:'2699'})],
    [row('2701')],
    [row('2601',{examKey:'2025'})],
    [row('2601',{number:2})],
    [row('2601',{sourcePage:0})],
  ]) assert.throws(()=>parseLocalTextPack(pack(rows),questions));
});

test('empty, non-string and over-limit texts are rejected without partial acceptance',()=>{
  for(const text of ['', ' \n\t ', null, 3, 'x'.repeat(100001)]) {
    assert.throws(()=>parseLocalTextPack(pack([row('2501'),row('2601',{text})]),questions));
  }
  assert.equal(parseLocalTextPack(pack([row('2601',{text:'x'.repeat(100000)})]),questions)[0].text.length,100000);
});

test('whole-pack byte limit includes optional metadata and UTF-8 bytes',()=>{
  const oversized={...pack([row()]),extra:'한'.repeat(3*1024*1024)};
  assert.throws(()=>parseLocalTextPack(oversized,questions));
});

test('saved records restore locally using only the dedicated storage key',()=>{
  const memory=new Map([['leet-atlas:2027:reviews:v1','unchanged reviews']]);
  const storage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,value)};
  const records=parseLocalTextPack(pack([row(),row('2501')]),questions);
  saveLocalTexts(storage,records);
  assert.equal(LOCAL_TEXT_STORAGE_KEY,'leet-atlas:local-texts:v1');
  assert.deepEqual([...loadLocalTexts(storage,questions).values()],records);
  assert.equal(memory.get('leet-atlas:2027:reviews:v1'),'unchanged reviews');
  assert.equal(memory.size,2);
});

test('corrupt or inaccessible storage restores no text and failed saves propagate',()=>{
  for(const storage of [
    {getItem:()=>null},
    {getItem:()=>'{broken'},
    {getItem:()=>JSON.stringify(pack([row('2701')]))},
    {getItem(){throw new Error('denied');}},
  ]) assert.equal(loadLocalTexts(storage,questions).size,0);
  assert.throws(()=>saveLocalTexts({setItem(){throw new Error('quota');}},[row()]),/quota/);
});

test('merged storage cannot exceed the restore limit or replace existing saved data',()=>{
 let saved='previous pack';
 const storage={setItem(_key,value){saved=value;}};
 const records=Array.from({length:100},(_,i)=>({...row(),id:String(i),text:'한'.repeat(30000)}));
 assert.throws(()=>saveLocalTexts(storage,records),/8/);
 assert.equal(saved,'previous pack');
});
