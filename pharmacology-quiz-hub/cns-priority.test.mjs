import test from 'node:test';import assert from 'node:assert/strict';
import {CNS_QUESTIONS,pickCnsQuestion} from './cns-data.mjs';
const priority=await import('./cns-priority.mjs').catch(()=>({}));
const structureIds=['donepezil','rivastigmine','memantine','levodopa','carbidopa','selegiline','entacapone','bromocriptine','diazepam','flumazenil','pentobarbital','buspirone','zolpidem','fluoxetine','duloxetine','imipramine','amitriptyline','haloperidol','clozapine','risperidone','valproicacid','carbamazepine','gabapentin','ethosuximide','clonazepam','phenobarbital','felbamate','morphine','naloxone'];
test('강의록 구조식 29개와 진한 이름 62개를 실제 PDF 쪽 근거로 구분한다',()=>{
 assert.ok(priority.CNS_DRUG_PRIORITY,'강의록 강조 근거표가 필요합니다');
 const entries=Object.entries(priority.CNS_DRUG_PRIORITY);
 assert.equal(entries.filter(([,p])=>p.emphasized).length,62);
 assert.deepEqual(new Set(entries.filter(([,p])=>p.structures.length).map(([id])=>id)),new Set(structureIds));
 for(const [,p]of entries){assert.ok(p.emphasisPages.every(n=>Number.isInteger(n)&&n>=1&&n<=38));for(const s of p.structures){assert.ok([14,15].includes(s.lecture));assert.ok(Number.isInteger(s.page));}}
 assert.equal(priority.CNS_DRUG_PRIORITY.venlafaxine.emphasized,false);assert.equal(priority.CNS_DRUG_PRIORITY.levetiracetam.emphasized,false);
 assert.ok(priority.CNS_DRUG_PRIORITY.risperidone.structures.some(s=>s.lecture===15&&s.page===28));
 assert.ok(priority.CNS_DRUG_PRIORITY.midazolam.emphasisPages.includes(22));
});
test('핵심 약물 중심에서는 회색 약물·수용체 기초 문항을 제외하고 구조식 약물을 더 자주 회독한다',()=>{
 let seed=783;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
 const state={seen:{},recent:[],recentSubjects:[]};let structures=0;
 for(let i=0;i<1000;i++){
  const q=pickCnsQuestion(state,'all',random,'core');assert.ok(['structure-drug','emphasized-drug'].includes(q.priority),q.id);assert.ok(!['effect','structure'].includes(q.area));
  assert.ok(!state.recent.includes(q.id));assert.ok(!state.recentSubjects.includes(q.subject));structures+=q.priority==='structure-drug';
  state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.recentSubjects=[q.subject,...state.recentSubjects].slice(0,3);state.lastGroup=q.group;
 }
 assert.ok(structures>=600&&structures<=800,structures+' structure-priority draws');
 const expected=CNS_QUESTIONS.filter(q=>['structure-drug','emphasized-drug'].includes(q.priority));assert.equal(Object.keys(state.seen).length,expected.length);
 for(let i=0;i<100;i++)assert.equal(pickCnsQuestion({},'all',random,'structures').priority,'structure-drug');
 assert.equal(pickCnsQuestion({},'structure',random,'core').area,'structure');assert.equal(pickCnsQuestion({},'effect',random,'core').area,'effect');
 for(const q of CNS_QUESTIONS.filter(q=>q.priority==='structure-drug')){
  assert.ok(q.pairs.every(p=>priority.CNS_DRUG_PRIORITY[p.entity]?.structures.length),q.id+' structure-only options');
 }
});
