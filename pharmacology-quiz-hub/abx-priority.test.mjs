import test from 'node:test';
import assert from 'node:assert/strict';
import {ABX_DRUGS,ABX_SIMPLE,ABX_QUESTIONS,pickAbxQuestion} from './abx-data.mjs';

const excluded=['cefadroxil','cefamandole','ceftolozane','avibactam','bedaquiline','delamanid','darunavir','elvitegravir','zanamivir','peramivir','ceftaroline'];
test('기본 항생제 범위는 별도 PDF·족보의 대표 약물로 좁히고 제외 범위를 확장 모드에만 둔다',()=>{
 const core=ABX_DRUGS.filter(d=>d.core);
 assert.ok(core.length<=50,`핵심 약물 ${core.length}개`);
 for(const id of excluded)assert.equal(ABX_DRUGS.find(d=>d.id===id).core,false,id);
 for(const id of ['gentamicin','trimethoprim','ciprofloxacin','doxycycline','erythromycin','vancomycin','isoniazid','rifampin','amphotericin-b','itraconazole','voriconazole','oseltamivir'])assert.ok(core.some(d=>d.id===id),id);
 for(const d of core)assert.ok(d.prioritySources?.some(s=>s.includes('별도 정리 PDF')),d.id);
});

test('기본 범위의 모든 발문·다섯 선지·해설에서 확장 약물이 빠지고 판별형의 참·거짓은 유지된다',()=>{
 const extra=ABX_DRUGS.filter(d=>!d.core);
 for(const bank of [ABX_SIMPLE,ABX_QUESTIONS]){
  const core=bank.filter(q=>q.core);assert.ok(core.length>=100);
  for(const q of core){
   assert.equal(q.options.length,5,q.id);assert.equal(new Set(q.options).size,5,q.id);assert.ok(q.options.includes(q.answer));
   const text=[q.stem,...q.options,q.note,...(q.details||[])].join(' ').toLowerCase();
   for(const d of extra)assert.ok(!text.includes(d.name.split(' (')[0].toLowerCase()),q.id+' includes '+d.name);
   if(!q.id.startsWith('priority-ceph-'))for(const p of q.pairs||[])assert.ok(ABX_DRUGS.some(d=>d.core&&d.name===p.left),q.id);
  }
 }
 for(const q of ABX_SIMPLE.filter(q=>q.core&&q.format!=='judgment'))assert.doesNotMatch(q.options.join(' '),/HIV protease|CCR5|gp41|Integrase|ATP synthase/i,q.id);
 for(const lecture of [23,24,25,26,27])assert.ok(ABX_QUESTIONS.some(q=>q.core&&q.lecture===lecture));
 const ceph=ABX_QUESTIONS.filter(q=>q.core&&q.id.startsWith('priority-ceph-'));
 assert.equal(ceph.length,2);for(const q of ceph){assert.equal(q.pairs.length,5);assert.equal(q.pairs.filter(p=>p.valid).length,q.polarity==='correct'?1:4);assert.equal(new Set(q.pairs.map(p=>p.left)).size,5);}
 for(const id of ['core-mrsa-pbp2a','core-antipseudomonal-penicillin','extra-rifampin-fluid','extra-ethambutol-vision','clinical-abx-dna-radicals','clinical-abx-b6-neuropathy'])assert.ok(ABX_QUESTIONS.find(q=>q.id===id)?.core,id);
});

test('1000회 기본 회독은 핵심 선지만 출제하고 임상형 부족 시 다른 유형으로 바꾸지 않는다',()=>{
 for(const kind of ['simple','general']){
  let seed=531;const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32),state={draws:0,seen:{},recent:[],subjects:[],lastGroup:null};
  for(let i=0;i<1000;i++){const q=pickAbxQuestion(kind,state,'all','core',random);assert.ok(q.core);assert.equal(q.choices[q.answerIndex].text,q.answer);state.draws++;state.seen[q.id]=(state.seen[q.id]||0)+1;state.recent=[q.id,...state.recent].slice(0,3);state.subjects=[q.subject,...state.subjects].slice(0,3);state.lastGroup=q.group;}
 }
 for(const lecture of [23,24,25,26,27]){
  const q=pickAbxQuestion('general',{},String(lecture),'core',()=>0.5,'clinical');
  if(q)assert.equal(q.format,'clinical',String(lecture));
 }
 assert.ok(pickAbxQuestion('simple',{},'all','all',()=>0.5));
});
