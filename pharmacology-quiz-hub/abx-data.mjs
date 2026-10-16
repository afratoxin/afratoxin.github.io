import {ABX_CLINICAL} from './systems-clinical-data.mjs?v=20261017-clinical1';
import {clinicalQuestionPool} from './clinical-mix.mjs?v=20261017-clinical1';
import {createPairedQuestion} from './statement-quiz.mjs?v=20261017-exam2';
import {DRUGS as coreDrugs,QUESTIONS as coreQuestions} from './abx-core-data.mjs?v=20261016-abx1';
import {DRUGS as bacterialDrugs,QUESTIONS as bacterialQuestions} from './abx-bacterial-data.mjs?v=20261016-abx1';
import {DRUGS as extraDrugs,QUESTIONS as extraQuestions} from './abx-extra-data.mjs?v=20261016-abx1';
import {ABX_PRIORITY,ABX_CORE_REVISIONS} from './abx-priority.mjs?v=20261017-abxfocus1';
export const ABX_MECHANISMS={cellwall:'세포벽 합성 억제',pbp:'PBP 억제',bla:'β-lactamase 억제',dala:'D-Ala-D-Ala 결합',bactoprenol:'Bactoprenol 재활용 억제',alanine:'D-Ala 대사 억제',membrane:'세포막 손상','30s':'30S 단백질 합성 억제','50s':'50S 단백질 합성 억제',dhps:'DHPS 억제',dhfr:'DHFR 억제',gyrase:'DNA gyrase 억제',topo4:'Topoisomerase IV 억제',rnap:'세균 RNA polymerase 억제',dna_damage:'환원대사체의 DNA 손상',mycolic:'Mycolic acid 합성 억제',arabinosyl:'Arabinosyl transferase 억제',pza:'막전위·에너지 대사 방해',atpsynthase:'ATP synthase 억제',ergosterol:'Ergosterol 결합',demethylase:'14α-demethylase 억제',glucan:'β-(1,3)-glucan 합성 억제',dna_pol:'바이러스 DNA polymerase 억제',viral_rnap:'바이러스 RNA polymerase 억제',rt:'바이러스 역전사효소 억제',hcv_protease:'NS3/4A protease 억제',ns5a:'NS5A 억제',ns5b:'NS5B polymerase 억제',m2:'M2 이온통로 억제',neuraminidase:'Neuraminidase 억제',endonuclease:'Endonuclease 억제',hiv_protease:'HIV protease 억제',ccr5:'CCR5 차단',fusion:'gp41 매개 융합 억제',integrase:'Integrase 억제'};
export const ABX_DRUGS=[...coreDrugs,...bacterialDrugs,...extraDrugs].map(d=>({...d,core:!!ABX_PRIORITY[d.id],weight:ABX_PRIORITY[d.id]?.weight||1,prioritySources:ABX_PRIORITY[d.id]?.sources||[]}));
const keys=[...new Set(ABX_DRUGS.flatMap(d=>d.targets))];
const priorityKeys=new Set(ABX_DRUGS.filter(d=>d.core).flatMap(d=>d.targets));
// Broad effects are useful answers for their own drugs, but make poor distractors
// against a more specific mechanism that can produce the same downstream effect.
const broad=new Set(['cellwall','membrane','dna_damage','pza','viral_rnap']);
const simpleQuestions=ABX_DRUGS.flatMap((d,i)=>d.targets.map((key,n)=>{
 const other=keys.filter(k=>(!d.core||priorityKeys.has(k))&&!d.targets.includes(k)&&!broad.has(k)&&!(d.targets.includes('viral_rnap')&&k==='ns5b')),start=(i*3+n)%other.length,wrong=[...other.slice(start),...other.slice(0,start)].slice(0,4),answer=ABX_MECHANISMS[key];
 return {id:d.id+':'+key,subject:d.id,lecture:d.lecture,family:d.family,group:'simple',core:d.core,weight:d.weight||1,stem:`${d.name}의 작용기전은?`,options:[answer,...wrong.map(k=>ABX_MECHANISMS[k])],answer,note:`${d.name} → ${answer}.${d.core?'':' '+d.note}`,source:d.source,details:[],targets:d.targets,prioritySources:d.prioritySources};
}));
// A specific target may imply a broader effect. Do not turn that overlap into
// a supposedly false pair, including either valid target of multi-target drugs.
const overlappingTargets=[
 ['cellwall','pbp','dala','mycolic','arabinosyl'],
 ['viral_rnap','ns5b'],
 ['dna_pol','rt'],
 ['membrane','ergosterol','pza','atpsynthase'],
 ['pza','atpsynthase'],
 ['dna_damage','gyrase','topo4','dna_pol','rt']
];
const statementRows=ABX_DRUGS.flatMap(d=>d.targets.map(key=>{
 const excluded=new Set(d.targets);
 for(const cluster of overlappingTargets)if(d.targets.some(t=>cluster.includes(t)))for(const t of cluster)excluded.add(t);
 // Sulbactam also has intrinsic PBP activity in some organisms; that activity
 // must not become a false statement even though this lecture teaches its BLI role.
 if(d.id==='sulbactam')excluded.add('pbp');
 const candidates=keys.filter(k=>(!d.core||priorityKeys.has(k))&&!excluded.has(k)&&!broad.has(k));
 const right=ABX_MECHANISMS[key],wrong=ABX_MECHANISMS[candidates[(ABX_DRUGS.indexOf(d)*3+d.targets.indexOf(key))%candidates.length]];
 return {id:`${d.id}:${key}`,left:d.name,right,wrong,source:d.source,note:`${d.name}의 작용기전은 ${right}이다.`,family:d.family,drug:d};
}));
function mechanismJudgments(kind){
 return statementRows.flatMap((row,index)=>{
  const d=row.drug,scope=statementRows.filter(other=>!d.core||other.drug.core),local=scope.filter(other=>other.drug.lecture===d.lecture);
  const pool=new Set(local.map(other=>other.left)).size>=5?local:scope;
  return ['correct','incorrect'].map(polarity=>createPairedQuestion({
   id:`abx-${kind}-judgment:${row.id}:${polarity}`,subject:d.id,lecture:d.lecture,
   family:d.family,group:kind==='simple'?'simple':'mechanism',core:d.core,
   weight:d.weight||1,targets:d.targets,prioritySources:d.prioritySources
  },row,pool,{polarity,index,topic:'약물과 작용기전'}));
 });
}
export const ABX_SIMPLE=[...simpleQuestions,...mechanismJudgments('simple')];
const cephRows=[
 {id:'ceph1',left:'1세대',right:'그람양성균 활성이 중심이다',wrong:'MRSA 활성이 대표적인 구별점이다',source:'24강 강의록 PDF 28쪽',note:'1세대는 그람양성균 활성이 중심이다.'},
 {id:'ceph2',left:'2세대',right:'1세대보다 그람음성균 범위가 확대된다',wrong:'1세대보다 그람음성균 범위가 축소된다',source:'24강 강의록 PDF 29쪽',note:'2세대는 1세대에 비해 그람음성균 범위가 확대되는 경향을 배운다.'},
 {id:'ceph3',left:'3세대',right:'그람음성균의 중증 감염에 쓰는 약물이 포함된다',wrong:'세포벽이 없는 Mycoplasma가 대표적인 표적이다',source:'24강 강의록 PDF 30쪽',note:'3세대는 그람음성균 범위가 넓어지며 중증 감염에 쓰인다. 일부 약물의 녹농균 활성은 약물별로 다르다.'},
 {id:'ceph4',left:'4세대',right:'녹농균 활성을 갖는 약물이 포함된다',wrong:'주요 항균 표적은 30S 리보솜이다',source:'24강 강의록 PDF 31쪽',note:'4세대는 녹농균 활성을 갖는 약물을 포함하며 다른 β-lactam과 같이 PBP에 작용한다.'},
 {id:'ceph5',left:'5세대',right:'MRSA 활성을 갖는 약물이 포함된다',wrong:'모든 약물이 녹농균에 강한 활성을 보인다',source:'24강 강의록 PDF 32쪽',note:'강의의 대표적 5세대 약물은 MRSA 활성이 구별점이며 녹농균 활성은 없다.'}
].map(r=>({...r,family:r.id}));
const cephJudgments=['correct','incorrect'].map((polarity,index)=>createPairedQuestion({id:'priority-ceph-'+polarity,subject:'ceph-generations',lecture:24,group:'principle',core:true,weight:3,prioritySources:['별도 정리 PDF 3쪽','족보 2025년 24강 74번 · 2023년 47번']},cephRows[4],cephRows,{polarity,index,topic:'cephalosporin 세대별 특징'}));
const outside=ABX_DRUGS.filter(d=>!d.core);
function prioritizeQuestion(original){
 const q={...original,...ABX_CORE_REVISIONS[original.id]},drug=ABX_DRUGS.find(d=>d.id===q.subject);
 const text=[q.stem,...q.options,q.note,...(q.details||[])].join(' ').toLowerCase();
 const core=(drug?drug.core:!!q.core)&&!outside.some(d=>text.includes(d.name.split(' (')[0].toLowerCase()));
 return {...q,core,weight:core?(drug?.weight||q.weight||2):1,prioritySources:core?(drug?.prioritySources||[`별도 정리 PDF ${q.lecture===23?'1–2':q.lecture===24?'2–3':q.lecture===25?'3–4':q.lecture===26?'5–6':'6–7'}쪽`]):[]};
}
export const ABX_QUESTIONS=[...coreQuestions.map(prioritizeQuestion),...bacterialQuestions.map(prioritizeQuestion),...extraQuestions.map(prioritizeQuestion),...mechanismJudgments('general'),...ABX_CLINICAL.map(prioritizeQuestion),...cephJudgments];
export function shuffleAbx(values,random=Math.random){const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
export function pickAbxQuestion(kind,state,lecture='all',range='core',random=Math.random,mode='mixed'){
 const full=kind==='simple'?ABX_SIMPLE:ABX_QUESTIONS,selected=full.filter(q=>lecture==='all'||q.lecture===Number(lecture)),focused=selected.filter(q=>range!=='core'||q.core),bank=kind==='simple'?focused:mode==='clinical'?focused.filter(q=>q.format==='clinical'):mode==='ordinary'?focused.filter(q=>q.format!=='clinical'):clinicalQuestionPool(focused,state,mode),recent=state.recent||[],subjects=state.subjects||[];
 if(!bank.length)return null;
 let pool=bank.filter(q=>!recent.includes(q.id)&&!subjects.includes(q.subject)&&(kind==='simple'||q.group!==state.lastGroup));
 if(!pool.length)pool=bank.filter(q=>!recent.includes(q.id)&&!subjects.includes(q.subject));if(!pool.length)pool=bank.filter(q=>!recent.includes(q.id));if(!pool.length)pool=bank;
 const score=q=>(state.seen?.[q.id]||0)/(q.weight||1),min=Math.min(...pool.map(score)),available=pool.filter(q=>score(q)===min),q=available[Math.floor(random()*available.length)],choices=shuffleAbx(q.options,random).map(text=>({text}));return {...q,choices,answerIndex:choices.findIndex(x=>x.text===q.answer)};
}
