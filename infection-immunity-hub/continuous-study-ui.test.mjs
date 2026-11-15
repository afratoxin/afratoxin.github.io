import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const study=fs.readFileSync(new URL('./study-ui.mjs',import.meta.url),'utf8');
const recall=fs.readFileSync(new URL('./recall-ui.mjs',import.meta.url),'utf8');

test('lecture and recall practice use the continuous queue without session-size or replacement controls',()=>{
 for(const name of ['startContinuousSession','advanceContinuousSession','resumeContinuousSession'])assert.match(study,new RegExp('\\b'+name+'\\('));
 assert.doesNotMatch(study,/id="\$\{id\}-(?:count|replace)"|반복 길이|새 세트|한 세트를|라운드/);
 assert.doesNotMatch(study,/quizKeyboardAction|document\.addEventListener\('keydown'/,'the shared keyboard delegate owns shortcuts');
 assert.match(study,/미풀이 학습/);assert.match(study,/오답 복습/);
 assert.match(study,/questionIds:\[qid\]/,'one-question retry remains in its explicit scope');
});

test('recall topic selection remains available and resumes the whole chosen scope in learning order',()=>{
 assert.match(recall,/role="tablist"/);assert.match(recall,/data-recall-whole-lecture/);
 assert.doesNotMatch(recall,/전체 섞기|이 묶음 반복|RECALL · SMALL SETS/);
 assert.match(recall,/미풀이.*오답/);
 assert.match(recall,/resume\(\)/);
});
