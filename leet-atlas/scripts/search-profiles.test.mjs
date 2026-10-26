import test from 'node:test';import assert from 'node:assert/strict';
import {profileFingerprint,profileSections,validateProfile,profileSource} from '../search-profile-format.mjs';
import {profileData} from '../search-profile-data.mjs';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';

const question={id:'1225',text:'두 가설을 평가한다.',summary:'경쟁하는 두 가설이 있다.',options:[{number:1,explanation:'두 가설 모두와 양립하므로 차별 평가할 수 없다.'}],statements:[],steps:[],pitfalls:[]};
const record=()=>({id:'1225',brief:'경쟁하는 가설의 증거를 비교한다.',reasoning:'두 가설이 모두 예측하는 사실로 우열을 판별할 수 있는지 묻는다.',traps:['같은 관찰을 한쪽만 지지하는 것으로 판단한다.'],evidence:[{source:'options:1',quote:'두 가설 모두와 양립하므로 차별 평가할 수 없다.'}],fingerprint:profileFingerprint(question)});

test('free descriptions have original supporting evidence and do not require a query vocabulary',()=>{
 const profile=record();assert.equal(validateProfile(question,profile),true);
 const sections=profileSections(question,profile);
 assert.ok(sections.some(s=>s.text.includes('모두 예측하는 사실')));
 assert.ok(sections.every(s=>s.kind==='profile'&&s.support[0].text===question.options[0].explanation));
 assert.equal(profileSource(question,'options:1'),question.options[0].explanation);
});
test('profiles with a changed source, wrong question, invalid pointer or fabricated quote are rejected',()=>{
 for(const change of [p=>p.id='1302',p=>p.evidence[0].source='options:9',p=>p.evidence[0].quote='존재하지 않는 인용',p=>p.fingerprint='old']){
  const p=record();change(p);assert.equal(validateProfile(question,p),false);assert.deepEqual(profileSections(question,p),[]);
 }
 assert.deepEqual(profileSections({...question,text:'개인 교정 원문'},record()),[]);
});

test('every public question has a complete general profile with exact original evidence',()=>{
 const bytes=readFileSync(new URL('../data/archive.json',import.meta.url)),questions=JSON.parse(bytes).questions;
 assert.equal(profileData.questionCount,755);assert.equal(Object.keys(profileData.profiles).length,755);
 assert.equal(profileData.sourceSha256,createHash('sha256').update(bytes).digest('hex'));
 for(const q of questions)assert.equal(validateProfile(q,profileData.profiles[q.id]),true,q.id);
  const editable=JSON.parse(readFileSync(new URL('../data/search-profiles.json',import.meta.url),'utf8'));
  assert.deepEqual(new Map(editable.map(profile=>[profile.id,profile])),new Map(Object.entries(profileData.profiles)));
});
