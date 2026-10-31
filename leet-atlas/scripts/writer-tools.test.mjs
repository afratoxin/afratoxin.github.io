import test from 'node:test';
import assert from 'node:assert/strict';
import {createWriterTools} from '../writer-tools.mjs';
test('manual evaluation storage failure is never reported as a successful save',()=>{
 const original=globalThis.FormData,messages=[];
 globalThis.FormData=class{get(key){return {rules:'3',reason:'조건 결합 검토'}[key]||''}};
 try{
  let record;
  const tools=createWriterTools({state:{questions:new Map([['a',{}]])},store:{},document:{querySelector:()=>null},toast:message=>messages.push(message),saveReview:(id,value)=>{record={id,...value};return false;}});
  tools.handleSubmit({target:{matches:()=>true,dataset:{designReview:'a'}},preventDefault(){}});
  assert.equal(record.id,'a');assert.equal(record.designReview.rules,3);assert.match(messages.at(-1),/저장.*실패|저장하지 못/);assert.doesNotMatch(messages.at(-1),/저장했습니다/);
 }finally{globalThis.FormData=original;}
});
