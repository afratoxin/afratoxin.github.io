import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {CNS_QUESTIONS,RECEPTORS,DRUGS,CNS_MATCH,pickCnsQuestion} from './cns-data.mjs';
const detailIds=["detail-synapse-amphetamine","detail-synapse-cocaine","detail-ad-donepezil","detail-ad-antibody","detail-pd-carbidopa","detail-pd-bbb","detail-pd-longterm","detail-pd-amantadine","detail-pd-comt","detail-bzd-frequency","detail-bzd-flumazenil","detail-bzd-midazolam","detail-bzd-sleep","detail-bzd-buspirone","detail-bzd-zolpidem","detail-anesthesia-thiopental","detail-anesthesia-long","detail-depression-selective","detail-depression-snri","detail-depression-muscarinic","detail-depression-alpha","detail-depression-histamine","detail-depression-overdose","detail-depression-adverse","detail-psychosis-aripiprazole","detail-psychosis-haloperidol","detail-epilepsy-absence","detail-epilepsy-ttype","detail-epilepsy-dual","detail-epilepsy-gabapentin","detail-epilepsy-felbamate","detail-epilepsy-focal","detail-epilepsy-absence-first","detail-opioid-effects","detail-opioid-naloxone","detail-opioid-antagonist","detail-pd-exception","detail-bzd-exception","detail-depression-exception","detail-anesthesia-exception","detail-epilepsy-exception"];
test('300문항 모두 다섯 연결 선지를 판정하며 네 영역에서 정·오답 발문을 고르게 제공한다',()=>{
 assert.equal(CNS_QUESTIONS.length,300);assert.deepEqual(new Set(CNS_QUESTIONS.map(q=>q.id)),new Set([...RECEPTORS.filter(r=>r.type).map(r=>'structure-'+r.id),...RECEPTORS.map(r=>'effect-'+r.id),...DRUGS.flatMap(d=>['disease-'+d.id,'mechanism-'+d.id]),...detailIds]));
 assert.equal(CNS_QUESTIONS.filter(q=>q.polarity==='correct').length,150);assert.equal(CNS_QUESTIONS.filter(q=>q.polarity==='incorrect').length,150);
 for(const q of CNS_QUESTIONS){assert.equal(q.options.length,5);assert.ok(q.pairs?.length===5,q.id+' pair evidence');assert.ok(['correct','incorrect'].includes(q.polarity));assert.match(q.stem,/연결/);assert.match(q.stem,q.polarity==='incorrect'?/옳지 않은 것은\?/:/옳은 것은\?/);assert.equal(new Set(q.options).size,5);assert.equal(new Set(q.pairs.map(p=>p.left)).size,5,q.id+' distinct entities');assert.ok(new Set(q.pairs.map(p=>p.right)).size>=2,q.id+' varied features');
  for(let i=0;i<5;i++){const p=q.pairs[i];assert.equal(q.options[i],p.left+' — '+p.right);assert.ok(p.source&&p.explanation);assert.ok(q.details.some(t=>t.startsWith(q.options[i]+':')),q.id+' per-option explanation');}
  const selected=q.pairs.filter(p=>p.valid===(q.polarity==='correct'));assert.equal(selected.length,1,q.id);assert.equal(q.answer,selected[0].left+' — '+selected[0].right);
 }
 for(const area of ['structure','effect','disease','features']){const bank=CNS_QUESTIONS.filter(q=>q.area===area),correct=bank.filter(q=>q.polarity==='correct').length;assert.ok(correct>=bank.length*.4&&correct<=bank.length*.6,area);assert.ok(new Set(bank.map(q=>q.stem)).size>=4,area+' varied contextual stems');}
});
test('대표 기전 분류는 강의 범위를 발문과 선지에 명시하고 GlyR 이름에 정답 단서를 넣지 않는다',()=>{
 for(const q of CNS_QUESTIONS.filter(q=>q.pairs.some(p=>p.dimension==='mechanism'))){
  assert.match(q.stem,/15강.*대표.*분류/,q.id);
  for(const p of q.pairs){assert.match(p.right,/^대표 분류: /,q.id);assert.match(p.correctRight,/^대표 분류: /,q.id);}
 }
 for(const q of CNS_QUESTIONS)for(const p of q.pairs)if(p.entity==='glyr')assert.equal(p.left,'Glycine 수용체');
});
test('수용체 연결의 참·거짓을 독립 분류표로 검증하고 기존 드래그 데이터는 보존한다',()=>{
 for(const q of CNS_QUESTIONS.filter(q=>q.area==='structure'||q.area==='effect'))for(const p of q.pairs||[]){const r=RECEPTORS.find(r=>r.id===p.entity);assert.ok(r);const expected=q.area==='structure'?(r.type==='ionotropic'?'Ionotropic':'Metabotropic'):(r.effect==='excitatory'?'흥분성':'억제성');assert.equal(p.valid,p.right===expected,q.id+p.left);}
 assert.equal(createHash('sha256').update(JSON.stringify(CNS_MATCH)).digest('hex'),'e2de5e94da7d60065a36c54b8251d8f3a8e7c8c35a4cfdadfca8411172eee6fe','드래그 자료는 변경하지 않는다');
 const truth={na:['carbamazepine','phenytoin','lamotrigine','valproicacid','zonisamide'],ttype:['ethosuximide','valproicacid','zonisamide'],nmda:['memantine','amantadine','felbamate','ketamine'],opioid:['morphine','fentanyl']};
 for(const q of CNS_QUESTIONS)for(const p of q.pairs||[])if(p.dimension==='mechanism'&&truth[p.value])assert.equal(p.valid,truth[p.value].includes(p.entity),q.id+p.left+p.right);
});
test('1000회 출제에서 문항과 약물 반복을 억제하고 새 연결형 정답 위치를 섞는다',()=>{
 let seed=182;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32),state={seen:{},recent:[],recentSubjects:[],lastGroup:null},positions=[0,0,0,0,0];
 for(let i=0;i<1000;i++){const q=pickCnsQuestion(state,'all',random);assert.ok(q.pairs?.length===5);assert.equal(q.choices[q.answerIndex].text,q.answer);assert.ok(!state.recent.includes(q.id));assert.ok(!state.recentSubjects.includes(q.subject));positions[q.answerIndex]++;state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.recentSubjects=[q.subject,...state.recentSubjects].slice(0,3);state.lastGroup=q.group;}
 assert.equal(Object.keys(state.seen).length,300);for(const n of positions)assert.ok(n>140&&n<260);
});
