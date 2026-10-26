import test from 'node:test';import assert from 'node:assert/strict';
import {filterQuestions} from '../core.mjs';
test('literal keyword search includes non-answer explanations and traps without dropping hard filters',()=>{
 const questions=[{id:'a',title:'실험',text:'공개 원문',year:2020,tags:['required'],options:[{number:5,correct:false,explanation:'그림자의 길이로 천체 높이를 역산한다'}],pitfalls:['각도의 방향을 반대로 적용하지 않는다']},{id:'b',title:'다른 문항',tags:[],options:[{number:1,explanation:'그림자의 길이로 천체 높이를 역산한다'}]}];
 assert.deepEqual(filterQuestions(questions,{query:'천체 역산',requiredTags:['required']}).map(q=>q.id),['a']);
 assert.deepEqual(filterQuestions(questions,{query:'방향을 반대로'}).map(q=>q.id),['a']);
 assert.deepEqual(filterQuestions(questions,{query:'천체 불포함'}),[]);
});
