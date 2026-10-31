import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as search from '../reference-search.mjs';
const archive=JSON.parse(readFileSync(new URL('../data/archive.json',import.meta.url))).questions;
const fixture=(id,extra={})=>({id,title:'자료',text:'자료를 비교한다.',domains:[],fields:[],types:[],logic:[],...extra});
const questions=[fixture('law',{domains:['법률'],fields:['공법']}),fixture('calc',{domains:['법률'],logic:['수식 계산']}),fixture('economy',{fields:['경제학']}),fixture('physics',{fields:['물리'],text:'자연의 법칙을 계산한다.'})];
const ids=(qs,q)=>search.rankReferences(qs,q,{semanticScores:new Map(qs.map((v,i)=>[v.id,i===0?.7:.99]))}).map(v=>v.id);

test('required material and excluded calculation filter before adversarial semantic ranking',()=>{
 assert.deepEqual(ids(questions,'법률이면서 계산 제외'),['law']);
 assert.deepEqual(ids(questions,'법률 계산이 필요 없는 문항'),['law']);
 assert.deepEqual(ids(questions,'계산 제외'),['law','economy','physics'].sort((a,b)=>ids(questions,'계산 제외').indexOf(a)-ids(questions,'계산 제외').indexOf(b)));
});
test('material OR is a union, AND an intersection, and negative scope is local',()=>{
 assert.deepEqual(new Set(ids(questions,'법률 또는 경제학')),new Set(['law','calc','economy']));
 assert.deepEqual(ids(questions,'법률이면서 경제학'),[]);
 assert.deepEqual(ids(questions,'법률 말고 경제학'),['economy']);
 assert.deepEqual(new Set(ids(questions,'(법률 또는 경제학) 계산 제외')),new Set(['law','economy']));
});
test('quotes and explicit arbitrary exclusions are literal hard constraints across choices and analysis',()=>{
 const qs=[fixture('a',{text:'어휘인용은 없고',options:[{number:1,explanation:'독특한 증거를 비교한다.'}]}),fixture('b',{text:'독특한 증거와 금지어가 등장한다.'})];
 assert.deepEqual(ids(qs,'"독특한 증거" 금지어 제외'),['a']);
 assert.deepEqual(ids(qs,'"세상에없는고유문구"'),[]);
 assert.deepEqual(ids(qs,'세상에없는고유문구 필수'),[]);
});
test('canonical reasoning labels normalize spacing and punctuation',()=>{
 const qs=[fixture('s',{logic:['강화·약화']}),fixture('p',{logic:['확률·조건부 판단']}),fixture('n')];
 for(const q of ['강화약화','강화 약화','강화·약화'])assert.deepEqual(ids(qs,q),['s']);
 for(const q of ['조건부확률','조건부 확률','조건부 확률 판단'])assert.deepEqual(ids(qs,q),['p']);
});
test('exam year and actual question number differ from stable archive IDs',()=>{
 for(const q of ['2022학년도 18번','2022년 18번','2022 18번'])assert.deepEqual(ids(archive,q),['2218'],q);
 assert.ok(ids(archive,'2022학년도 법률').every(id=>archive.find(q=>q.id===id).year===2022));
 assert.deepEqual(ids(archive,'2022학년도 99번'),[]);
 assert.deepEqual(ids(archive,'2218'),['2218']);
 assert.deepEqual(ids(archive,'2009학년도 예비시험 1번'),['p001']);
});
test('contradictions and no-match are explicit, with condition evidence on each result',()=>{
 const result=search.rankReferences(questions,'법률 필수 법률 제외');
 assert.equal(result.status,'contradiction'); assert.equal(result.length,0);
 const empty=search.rankReferences(questions,'"없는 문구"');assert.equal(empty.status,'no-match');
 const matches=search.rankReferences(questions,'법률 계산 제외');assert.ok(matches[0].conditionEvidence.length===2);
 assert.ok(matches[0].conditionEvidence.every(e=>e.satisfied&&e.label&&e.text));
 assert.equal(typeof search.compileSearchIntent,'function');
 assert.match(search.describeSearchIntent(search.compileSearchIntent('법률 또는 경제학 계산 제외')),/또는/);
});
test('unparsed prose still searches all sections and semantic evidence within hard candidates',()=>{
 const qs=[fixture('yes',{logic:['강화·약화'],options:[{number:2,explanation:'두 사람 모두 동의하는 증거이므로 양쪽 주장을 판별하지 못한다.'}]}),fixture('no',{text:'두 사람 모두 동의하는 증거를 제시한다.'})];
 assert.deepEqual(ids(qs,'강화약화에서 두사람 모두 동의하는 증거'),['yes']);
 const free=[fixture('yes',{options:[{number:2,explanation:'바삭한 고구마에 관한 특이한 설명이다.'}]}),fixture('no')];
 assert.equal(search.rankReferences(free,'바삭한 고구마')[0].id,'yes');
});
test('residual common-evidence descriptions rank supported profiles above generic evidence metadata',()=>{
 const matches=search.rankReferences(archive,'강화약화에서 두사람 모두 동의하는 증거');
 assert.ok(matches.slice(0,10).some(m=>m.id==='1225'),matches.slice(0,10).map(m=>m.id).join(','));
 assert.ok(matches.every(m=>archive.find(q=>q.id===m.id).logic.includes('강화·약화')));
 const result=matches.find(m=>m.id==='1225');assert.match(result.evidenceText,/모두|양립/);
});
test('group exclusions and double negation preserve their stated scope',()=>{
 assert.deepEqual(ids(questions,'(법률 또는 경제학) 제외'),['physics']);
 assert.deepEqual(ids(questions,'법률과 경제학 제외'),['physics']);
 assert.deepEqual(ids(questions,'법률 제외하지 말고 계산 제외'),['law']);
 const result=search.rankReferences(questions,'법률 (계산 또는 경제학) 계산 제외 경제학 제외');
 assert.equal(result.status,'contradiction');
});
test('plain feature nouns, year ranges and embedded years are hard requirements',()=>{
 const qs=[fixture('a',{year:2022,domains:['법률'],text:'표를 보고 판단한다.'}),fixture('b',{year:2023,domains:['법률'],text:'그림으로 설명한다.'})];
 assert.deepEqual(ids(qs,'표 없는 법률'),['b']);
 assert.deepEqual(ids(qs,'법률 2022'),['a']);
 assert.deepEqual(ids(qs,'2021~2022학년도 법률'),['a']);
 assert.deepEqual(ids(qs,'2022년 이후 법률'),ids(qs,'법률'));
 assert.deepEqual(ids(qs,'2022년 이전 법률'),['a']);
});
test('bare broad material and plain table nouns constrain rather than merely boosting scores',()=>{
 const qs=[fixture('s',{domains:['사회'],types:['사회과학 실험']}),fixture('n',{domains:['과학'],text:'표를 사용한다.'}),fixture('h',{domains:['인문']})];
 assert.deepEqual(ids(qs,'사회 소재'),['s']);
 assert.deepEqual(ids(qs,'과학'),['n']);
 assert.deepEqual(ids(qs,'사회과학 실험'),['s']);
 assert.deepEqual(ids(qs,'표를 사용하지 않는 과학'),[]);
 const conflict=search.rankReferences(qs,'독립선택지형 합답형');assert.equal(conflict.status,'contradiction');
});
test('quantitative legal arithmetic is excluded even when the calculation tag is missing',()=>{
 const qs=archive.filter(q=>['2711','2707'].includes(q.id));
 const scores=new Map([['2711',1],['2707',.71]]);
 assert.deepEqual(search.rankReferences(qs,'법률이면서 계산 제외',{semanticScores:scores}).map(m=>m.id),['2707']);
 const [positive]=search.rankReferences(qs,'법률 계산');assert.equal(positive.id,'2711');
 assert.match(positive.conditionEvidence.find(e=>e.condition==='수식 계산').text,/뺀|순이익|공익−사익/);
 const thresholds=[fixture('threshold',{domains:['법률'],fields:['수학'],types:['모형·수리 추론'],text:'제20조 제15항: 2022년 이후 5년 이하의 징역에 처한다. 요건에 해당하는지 판단한다.'})];
 assert.deepEqual(ids(thresholds,'법률 계산 제외'),['threshold']);
});
test('common Korean negative endings and stray parentheses cannot drop required exclusions',()=>{
 for(const q of ['법률 계산이 없어야 해','법률 계산을 하지 않는','법률 계산을 요구하지 않는','법률 계산하지 않는'])assert.deepEqual(ids(questions,q),['law'],q);
 assert.deepEqual(ids(questions,'법률) 계산 제외'),['law']);
 assert.deepEqual(ids(questions,') 법률 계산 제외'),['law']);
 assert.deepEqual(new Set(ids(questions,'법률이 아닌 문항 제외')),new Set(['law','calc']));
});
