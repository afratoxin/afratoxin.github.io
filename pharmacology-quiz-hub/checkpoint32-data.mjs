import {createPairedQuestion} from './statement-quiz.mjs?v=20261017-exam2';
const antibodySource='32강 강의록 PDF 8쪽 · 면역관문 항체 분류';
const carSource='32강 강의록 PDF 32쪽 · CAR-T·CAR-NK·CAR-M 비교표';
export const C32_DRUGS=[
 ['atezolizumab','Atezolizumab','PD-L1 차단','PD-1 차단'],
 ['cemiplimab','Cemiplimab','PD-1 차단','CTLA-4 차단'],
 ['ipilimumab','Ipilimumab','CTLA-4 차단','PD-1 차단'],
 ['nivolumab','Nivolumab','PD-1 차단','CTLA-4 차단'],
 ['tremelimumab','Tremelimumab','CTLA-4 차단','PD-L1 차단'],
 ['pembrolizumab','Pembrolizumab','PD-1 차단','PD-L1 차단'],
 ['durvalumab','Durvalumab','PD-L1 차단','CTLA-4 차단'],
 ['avelumab','Avelumab','PD-L1 차단','PD-1 차단']
].map(([id,name,target,wrong])=>({id,name,target,wrong,categories:[target],source:antibodySource,note:`${name}은 ${target} 항체이다.`}));

// These are comparisons made by this lecture's teaching table, not universal
// claims about every investigational product, indication, or approval status.
export const C32_CARS=[
 {id:'car-t',name:'CAR-T',cell:'T세포',origin:'자가 유래 · 환자 혈액',crs:'발생 우려가 상대적으로 큼',cost:'환자 맞춤형 · 고가',indication:'혈액암'},
 {id:'car-nk',name:'CAR-NK',cell:'NK세포',origin:'동종 유래 · 일반인 혈액',crs:'발생 우려가 상대적으로 적음',cost:'기성품 방식 · 상대적 저가',indication:'혈액암·고형암'},
 {id:'car-m',name:'CAR-M',cell:'대식세포',origin:'동종 유래 · 일반인 혈액',crs:'발생 우려가 상대적으로 적음',cost:'기성품 방식 · 상대적 저가',indication:'고형암'}
].map(c=>({...c,source:carSource}));
const dimensions=[['cell','세포 기반'],['origin','세포 유래'],['crs','CRS 우려'],['cost','생산 방식·비용'],['indication','주요 적응증']];
const wrongCar={
 'car-t':{cell:'대식세포',origin:'동종 유래 · 일반인 혈액',crs:'발생 우려가 상대적으로 적음',cost:'기성품 방식 · 상대적 저가',indication:'고형암 중심'},
 'car-nk':{cell:'T세포',origin:'자가 유래 · 환자 혈액',crs:'발생 우려가 상대적으로 큼',cost:'환자 맞춤형 · 고가',indication:'혈액암에만 한정'},
 'car-m':{cell:'NK세포',origin:'자가 유래 · 환자 혈액',crs:'발생 우려가 상대적으로 큼',cost:'환자 맞춤형 · 고가',indication:'혈액암 중심'}
};
const antibodyRows=C32_DRUGS.map(d=>({id:d.id,left:d.name,right:d.target,wrong:d.wrong,family:d.target,source:d.source,note:d.note,subject:d.id}));
const carRows=C32_CARS.flatMap(c=>dimensions.map(([key,label])=>({id:`${c.id}:${key}`,left:`${c.name} · ${label}`,right:c[key],wrong:wrongCar[c.id][key],family:key,source:c.source,subject:c.id,note:`32강 비교표에서 ${c.name}의 ${label}: ${c[key]}.`})));
export const C32_QUESTIONS=[
 ...antibodyRows.flatMap((row,index)=>['correct','incorrect'].map(polarity=>createPairedQuestion({id:`checkpoint32-target:${row.id}:${polarity}`,subject:row.subject,area:'target',group:'target'},row,antibodyRows,{polarity,index,topic:'지정한 면역관문 항체와 차단 표적'}))),
 ...carRows.flatMap((row,index)=>['correct','incorrect'].map(polarity=>createPairedQuestion({id:`checkpoint32-car:${row.id}:${polarity}`,subject:row.subject,area:'car',group:row.family},row,carRows,{polarity,index,topic:'32강 비교표의 CAR 세포치료제와 특징'})))
];
export const C32_FEATURE_CARDS=[
 ['t-cell','T세포를 기반으로 제작',['CAR-T']],
 ['nk-cell','NK세포를 기반으로 제작',['CAR-NK']],
 ['macrophage','대식세포를 기반으로 제작',['CAR-M']],
 ['autologous','자가 유래 · 환자 혈액에서 추출',['CAR-T']],
 ['allogeneic','동종 유래 · 일반인 혈액에서 추출',['CAR-NK','CAR-M']],
 ['high-crs','CRS 발생 우려가 상대적으로 큼',['CAR-T']],
 ['low-crs','CRS 발생 우려가 상대적으로 적음',['CAR-NK','CAR-M']],
 ['personalized','환자 맞춤형 생산 · 고가',['CAR-T']],
 ['off-the-shelf','기성품 방식 · 상대적 저가',['CAR-NK','CAR-M']],
 ['blood-cancer','주요 적응증에 혈액암을 포함',['CAR-T','CAR-NK']],
 ['solid-cancer','주요 적응증에 고형암을 포함',['CAR-NK','CAR-M']]
].map(([id,name,categories])=>({id,name,categories,source:carSource,note:`32강 비교표 기준: ${name} → ${categories.join('·')}.`}));

export function pickCheckpointQuestion(state={},area='all',random=Math.random){
 const wanted=area==='all'?(state.lastArea==='target'?'car':'target'):area;
 const bank=C32_QUESTIONS.filter(q=>q.area===wanted);if(!bank.length)return null;
 const recent=state.recent||[],subjects=state.subjects||[];
 let pool=bank.filter(q=>!recent.includes(q.id)&&!subjects.includes(q.subject));
 if(!pool.length)pool=bank.filter(q=>!recent.includes(q.id)&&q.subject!==subjects[0]);
 if(!pool.length)pool=bank.filter(q=>!recent.includes(q.id));if(!pool.length)pool=bank;
 const min=Math.min(...pool.map(q=>Number(state.seen?.[q.id])||0)),eligible=pool.filter(q=>(Number(state.seen?.[q.id])||0)===min),q=eligible[Math.floor(random()*eligible.length)];
 const choices=q.options.map(text=>({text}));for(let i=choices.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
 return {...q,choices,answerIndex:choices.findIndex(c=>c.text===q.answer)};
}
