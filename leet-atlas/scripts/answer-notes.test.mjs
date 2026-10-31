import test from 'node:test';
import assert from 'node:assert/strict';
import {answerInfo} from '../answer-notes.mjs';
test('a final no-answer treatment never overwrites the explanation-book key',()=>{
 const q={id:'1034',answer:2};
 const info=answerInfo(q,{records:[{questionId:'1034',type:'no-answer',correctOptions:[],scoring:'all-accepted'}]});
 assert.equal(q.answer,2);assert.equal(info.bookAnswer,2);
 assert.match(info.finalLabel,/정답 없음/);assert.match(info.finalLabel,/전원 정답/);
});
test('multiple official options and no recorded treatment remain distinguishable',()=>{
 assert.match(answerInfo({id:'x',answer:1},{records:[{questionId:'x',type:'multiple-answers',correctOptions:[2,4]}]}).finalLabel,/②.*④/);
 assert.equal(answerInfo({id:'y',answer:3}).exception,null);
 assert.match(answerInfo({id:'y',answer:3}).verificationLabel,/별도.*미등록/);
});
