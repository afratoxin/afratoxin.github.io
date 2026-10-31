import test from 'node:test';
import assert from 'node:assert/strict';
import {questionLabel} from '../question-label.mjs';
test('human labels use actual exam year and number rather than misleading internal id',()=>{
 assert.equal(questionLabel({id:'2021',year:2020,examKey:'2020',number:21}),'2020학년도 21번');
 assert.equal(questionLabel({id:'p014',year:2009,examKey:'preliminary',number:14}),'2009학년도 예비시험 14번');
});
