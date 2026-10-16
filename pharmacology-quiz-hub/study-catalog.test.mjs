import test from 'node:test';import assert from 'node:assert/strict';
import {createStudyStore,normalizeStudyQuestion} from './study-records.mjs';
const catalog=await import('./study-catalog.mjs').catch(()=>({}));
test('모든 강의·종합·계산 퀴즈와 14종 드래그가 완전한 문항집으로 등록된다',()=>{
 assert.equal(typeof catalog.registerLectureStudies,'function');const s=createStudyStore({getItem(){},setItem(){}});catalog.registerLectureStudies(s);
 for(const id of ['cyp','ddi','tx','ans','ans-gpcr','chol','chol11','adr12','adr13','mixed','pk','cns','immune','anticancer','signal','immune-simple','anticancer-simple','signal-simple','abx','abx-simple']){
  const d=s.definitions.get(id);assert.ok(d,id);assert.ok(d.items.size>0,id);
  for(const id of d.items.keys()){const q=normalizeStudyQuestion(d.build(id),{id});assert.equal(q.id,id);assert.equal(q.choices.length,5,id);assert.equal(q.answers.length,1,id);assert.equal(new Set(q.choices).size,5,id);}
 }
 assert.equal([...s.definitions.values()].filter(d=>d.type==='match').length,14);
 assert.equal(s.definitions.get('pk').items.size,41);
 const anti=s.definitions.get('anti-target');assert.ok(anti.items.get('doxorubicin').categories.length>1);
});
test('족보 중 채점 가능한 문항만 추가하고 복수 정답·그림·이전 최신 결과를 유지한다',()=>{
 assert.equal(typeof catalog.registerArchiveStudy,'function');const s=createStudyStore({getItem(){},setItem(){}});
 catalog.registerArchiveStudy({questions:[{id:'a',status:'quiz',stem:'질문',choices:['x','y','z'],answer:[1,3],figure:'assets/a.svg',year:2025,page:2},{id:'b',status:'review',stem:'복원대기'}]},s,{seen:{a:2},lastResult:{a:'wrong'}});
 assert.equal(s.counts('archive').total,1);assert.equal(s.counts('archive').wrong,1);assert.deepEqual(s.wrong('archive')[0].question.answers,[0,2]);assert.equal(s.wrong('archive')[0].question.figure,'assets/a.svg');
});
test('중추신경계의 기존 오답은 같은 ID의 개편 문항으로 표시하고 다른 강의의 저장 문항은 유지한다',()=>{
 const s=createStudyStore({getItem(){},setItem(){}});catalog.registerLectureStudies(s);
 const cns=s.definitions.get('cns'),old={id:'structure-gabaa',stem:'기존 단순 발문',choices:['A','B','C','D','E'],answerIndex:0,note:'기존 해설'};
 s.record('cns',old,false);const saved=s.wrong('cns')[0].question,revised=cns.reviewQuestion(saved);
 assert.equal(revised.id,old.id);assert.match(revised.stem,/연결.*옳/);assert.equal(revised.choices.length,5);assert.ok(revised.choices.every(c=>c.includes(' — ')));assert.equal(revised.answers.length,1);
 assert.equal(s.counts('cns').wrong,1);assert.equal(s.counts('cns').total,300);assert.equal(s.wrong('cns')[0].question.stem,old.stem);
 for(const d of s.definitions.values())if(d.id!=='cns')assert.equal(d.reviewQuestion,undefined,d.id);
});
