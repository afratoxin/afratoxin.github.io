import {ABX_CLINICAL} from './systems-clinical-data.mjs?v=20261017-clinical1';
import {clinicalQuestionPool} from './clinical-mix.mjs?v=20261017-clinical1';
import {DRUGS as coreDrugs,QUESTIONS as coreQuestions} from './abx-core-data.mjs?v=20261016-abx1';
import {DRUGS as bacterialDrugs,QUESTIONS as bacterialQuestions} from './abx-bacterial-data.mjs?v=20261016-abx1';
import {DRUGS as extraDrugs,QUESTIONS as extraQuestions} from './abx-extra-data.mjs?v=20261016-abx1';
import {ABX_PRIORITY,ABX_CORE_REVISIONS} from './abx-priority.mjs?v=20261017-abxfocus1';
import {ABX_FEATURE_QUESTIONS,ABX_FEATURE_CLINICAL} from './abx-features.mjs?v=20261017-abxshort1';
export const ABX_MECHANISMS={cellwall:'세포벽 합성 억제',pbp:'PBP 억제',bla:'β-lactamase 억제',dala:'D-Ala-D-Ala 결합',bactoprenol:'Bactoprenol 재활용 억제',alanine:'D-Ala 대사 억제',membrane:'세포막 손상','30s':'30S 단백질 합성 억제','50s':'50S 단백질 합성 억제',dhps:'DHPS 억제',dhfr:'DHFR 억제',gyrase:'DNA gyrase 억제',topo4:'Topoisomerase IV 억제',rnap:'세균 RNA polymerase 억제',dna_damage:'환원대사체의 DNA 손상',mycolic:'Mycolic acid 합성 억제',arabinosyl:'Arabinosyl transferase 억제',pza:'막전위·에너지 대사 방해',atpsynthase:'ATP synthase 억제',ergosterol:'Ergosterol 결합',demethylase:'14α-demethylase 억제',glucan:'β-(1,3)-glucan 합성 억제',dna_pol:'바이러스 DNA polymerase 억제',viral_rnap:'바이러스 RNA polymerase 억제',rt:'바이러스 역전사효소 억제',hcv_protease:'NS3/4A protease 억제',ns5a:'NS5A 억제',ns5b:'NS5B polymerase 억제',m2:'M2 이온통로 억제',neuraminidase:'Neuraminidase 억제',endonuclease:'Endonuclease 억제',hiv_protease:'HIV protease 억제',ccr5:'CCR5 차단',fusion:'gp41 매개 융합 억제',integrase:'Integrase 억제'};
// The active catalog is intentionally small. Expanded and reciprocal mechanism
// forms are no longer registered, so they do not inflate progress or normal draws.
export const ABX_DRUGS=[...coreDrugs,...bacterialDrugs,...extraDrugs].filter(d=>ABX_PRIORITY[d.id]).map(d=>({...d,core:true,weight:1,prioritySources:ABX_PRIORITY[d.id].sources}));
const priorityKeys=[...new Set(ABX_DRUGS.flatMap(d=>d.targets))],broad=new Set(['cellwall','membrane','dna_damage','pza','viral_rnap']);
export const ABX_SIMPLE=ABX_DRUGS.map((d,i)=>{
 const key=d.targets[0],other=priorityKeys.filter(k=>!d.targets.includes(k)&&!broad.has(k)),start=i*3%other.length,wrong=[...other.slice(start),...other.slice(0,start)].slice(0,4),answer=ABX_MECHANISMS[key];
 return {id:d.id+':'+key,subject:d.id,lecture:d.lecture,family:d.family,group:'simple',core:true,weight:1,stem:`${d.name}의 작용기전은?`,options:[answer,...wrong.map(k=>ABX_MECHANISMS[k])],answer,note:`${d.name} → ${answer}. ${d.note}`,source:d.source,details:[],targets:d.targets,prioritySources:d.prioritySources};
});
const retainedIds=['core-mic-readout','core-cidal-superiority','core-beta-time-index','core-resistance-selection','core-beta-hypersensitivity','bac-vanco-infusion','bac-vanco-auc','extra-tb-combination'];
const clinicalIds=['clinical-abx-pseudomonas-gyrase','clinical-abx-colitis-local','clinical-abx-rickettsia','clinical-abx-candida-local','clinical-abx-b6-neuropathy'];
const originals=[...coreQuestions,...bacterialQuestions,...extraQuestions,...ABX_CLINICAL];
const keep=id=>{const raw=originals.find(q=>q.id===id);if(!raw)throw Error('Missing retained question: '+id);return {...raw,...ABX_CORE_REVISIONS[id],core:true,weight:1};};
export const ABX_QUESTIONS=[...retainedIds.map(keep),...ABX_FEATURE_QUESTIONS,...clinicalIds.map(keep),...ABX_FEATURE_CLINICAL];
export const ABX_COUNTS={simple:ABX_SIMPLE.length,general:ABX_QUESTIONS.length};
export function shuffleAbx(values,random=Math.random){const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
export function pickAbxQuestion(kind,state={},lecture='all',range='core',random=Math.random,mode='mixed'){
 const full=kind==='simple'?ABX_SIMPLE:ABX_QUESTIONS,selected=full.filter(q=>lecture==='all'||q.lecture===Number(lecture));
 // 'range' is accepted for old callers; every current question is in the curated bank.
 const bank=kind==='simple'?selected:mode==='features'?selected.filter(q=>q.kind==='feature'):mode==='clinical'?selected.filter(q=>q.format==='clinical'):mode==='ordinary'?selected.filter(q=>q.format!=='clinical'):clinicalQuestionPool(selected,state,mode),recent=state.recent||[],subjects=state.subjects||[];
 if(!bank.length)return null;
 let pool=bank.filter(q=>!recent.includes(q.id)&&!subjects.includes(q.subject)&&(kind==='simple'||q.group!==state.lastGroup));
 if(!pool.length)pool=bank.filter(q=>!recent.includes(q.id)&&!subjects.includes(q.subject));if(!pool.length)pool=bank.filter(q=>!recent.includes(q.id));if(!pool.length)pool=bank;
 const count=q=>Number(state.seen?.[q.id])||0,min=Math.min(...pool.map(count)),available=pool.filter(q=>count(q)===min),q=available[Math.floor(random()*available.length)],choices=shuffleAbx(q.options,random).map(text=>({text}));return {...q,choices,answerIndex:choices.findIndex(x=>x.text===q.answer)};
}
