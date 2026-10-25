import test from 'node:test';
import assert from 'node:assert/strict';
import {LOCAL_TEXT_STORAGE_KEY, parseLocalTextPack, loadLocalTexts, saveLocalTexts} from '../local-text.mjs';
import * as localText from '../local-text.mjs';

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

test('coverage counts native/imported overlap once and ignores unknown question IDs',()=>{
 const archive=questions.map(question=>({...question,examLabel:`${question.examKey}학년도`,text:question.id==='2501'?'':' 원래 본문 '}));
 const imports=new Map([
  ['2601',row()],['2501',row('2501')],['unknown',{...row(),id:'unknown'}],
 ]);
 const before=structuredClone(archive);
 assert.equal(typeof localText.localTextCoverage,'function');
 assert.deepEqual(localText.localTextCoverage(archive,imports),{
  total:3,available:3,native:2,imported:1,
  exams:[
   {examKey:'2026',examLabel:'2026학년도',total:1,available:1,native:1,imported:0},
   {examKey:'2025',examLabel:'2025학년도',total:1,available:1,native:0,imported:1},
   {examKey:'2027',examLabel:'2027학년도',total:1,available:1,native:1,imported:0},
  ],
 });
 assert.deepEqual(archive,before);
});

test('coverage rejects blank and invalid stored records while counting only nonblank native strings',()=>{
 const archive=[
  {...questions[0],text:' \n\t '},
  {...questions[1],text:42},
  {...questions[2],text:'native public text'},
 ];
 assert.equal(typeof localText.localTextCoverage,'function');
 for(const record of [
  row('2601',{text:' \n '}),row('2601',{text:5}),row('2601',{id:'wrong'}),
  row('2601',{examKey:'2025'}),row('2601',{number:2}),row('2601',{sourcePage:0}),
  row('2601',{text:'x'.repeat(100001)}),
 ]) {
  const coverage=localText.localTextCoverage(archive,new Map([['2601',record],['2701',row('2701')]]));
  assert.deepEqual({total:coverage.total,available:coverage.available,native:coverage.native,imported:coverage.imported},
   {total:3,available:1,native:1,imported:0});
 }
 assert.deepEqual(localText.localTextCoverage([],new Map()),{total:0,available:0,native:0,imported:0,exams:[]});
});

test('coverage survives browser storage restoration and groups questions from one exam together',()=>{
 const archive=[...questions.map(question=>({...question,text:question.id==='2701'?'public text':''})),
  {...questions[0],id:'2602',number:2,sourcePage:318,text:''}];
 const memory=new Map();
 const storage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,value)};
 saveLocalTexts(storage,[row(),row('2501'),{...row(),id:'2602',number:2,sourcePage:318}]);
 const restored=loadLocalTexts(storage,archive);
 assert.equal(typeof localText.localTextCoverage,'function');
 const coverage=localText.localTextCoverage(archive,restored);
 assert.deepEqual({total:coverage.total,available:coverage.available,native:coverage.native,imported:coverage.imported},
  {total:4,available:4,native:1,imported:3});
 assert.deepEqual(coverage.exams[0],{examKey:'2026',examLabel:'2026학년도',total:2,available:2,native:0,imported:2});
});
