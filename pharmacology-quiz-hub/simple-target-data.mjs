import {createPairedQuestion} from './statement-quiz.mjs?v=20261017-exam2';
// Short recognition practice, derived from the already verified lecture banks.
import {IMM_DRUGS} from './immune-data.mjs?v=20261017-clinical1';
import {ANTI_DRUGS} from './anticancer-data.mjs?v=20261017-clinical1';
import {SIGNAL_DRUGS} from './signal31-data.mjs?v=20261017-clinical1';
const immuneTargets={calcineurin:'Calcineurin',mtor:'mTOR',jak:'JAK',gr:'GR',purine:'Purine 합성',impdh:'IMPDH',dhfr:'DHFR',polyt:'T세포 표면항원',cd3:'CD3',cd25:'CD25 (IL-2Rα)',cd52:'CD52',cd20:'CD20',b7:'B7 (CD80·CD86)',cd2:'CD2',cd11a:'CD11a (LFA-1)',a4:'α4 integrin',tnf:'TNF',il6r:'IL-6R',il1r:'IL-1R',il17:'IL-17A'};
const antiTargets={vinca:'미세소관 중합',taxane:'미세소관 탈중합',topo1:'Topoisomerase I',topo2:'Topoisomerase II',anthra:'Topoisomerase II',ros:'DNA',crosslink:'DNA',intercalation:'DNA',asparagine:'Asparagine',gr:'GR',aromatase:'Aromatase',serm:'ER',serd:'ER',gnrhagonist:'GnRH 수용체',gnrhantagonist:'GnRH 수용체',ar:'AR',cyp17:'CYP17'};
const receptorKeys=new Set(['gr','serm','serd','gnrhagonist','gnrhantagonist','ar']);
function relation(d,targets,stem,note){return {...d,subject:d.id,validTargets:targets,stem,note,lectureNote:d.note};}
const immune=IMM_DRUGS.filter(d=>d.section!=='조혈·IFN·백신').map(d=>relation(d,[immuneTargets[d.key]],d.key==='gr'?`${d.name}이 작용하는 수용체는?`:`${d.name}의 억제·차단 표적은?`,`${d.name} → ${immuneTargets[d.key]}.${d.binding!=='—'?` 결합 단백질은 ${d.binding}, 억제 표적은 ${immuneTargets[d.key]}입니다.`:d.key==='impdh'?' 활성 대사체 MPA가 IMPDH를 억제합니다.':d.key==='purine'?' 6-MP로 전환된 뒤 purine 합성을 억제합니다.':d.key==='gr'?' GR에 작용하는 glucocorticoid입니다.':''}`));
const anticancer=ANTI_DRUGS.filter(d=>d.key!=='cardioprotection').map(d=>{
 const target=antiTargets[d.key],valid=d.key==='anthra'?[target,'DNA']:[target];
 const stem=receptorKeys.has(d.key)?`${d.name}이 작용하는 수용체는?`:['vinca','taxane'].includes(d.key)?`${d.name}이 억제하는 과정은?`:d.key==='asparagine'?`${d.name}이 분해하는 아미노산은?`:['ros','crosslink','intercalation'].includes(d.key)?`${d.name}의 손상·결합 대상은?`:`${d.name}의 억제 표적은?`;
 const action={vinca:'미세소관 중합 억제',taxane:'미세소관 탈중합 억제',anthra:'Topo II 억제·DNA 삽입·ROS 생성',ros:'ROS를 통한 DNA 가닥 절단',crosslink:'DNA 교차결합',intercalation:'DNA 삽입을 통한 전사 억제',asparagine:'Asparagine 분해·고갈',gr:'GR 작용제',serm:'유방 ER 길항 작용',serd:'ER 분해 촉진',gnrhagonist:'GnRH 수용체 작용제 · 지속 투여 시 탈감작',gnrhantagonist:'GnRH 수용체 길항제'}[d.key]||`${target} 억제`;
 return relation(d,valid,stem,`${d.name} → ${action}.`);
});
const signal=SIGNAL_DRUGS.map(d=>relation(d,d.targets,`${d.name}의 표적은?`,`${d.name} → ${d.targets.join(' · ')}.${d.id==='bevacizumab'?' VEGFR 자체가 아니라 VEGF-A 리간드에 결합합니다.':d.type==='ADC'?' 항체가 인식하는 표적입니다.':d.id==='tretinoin'?' RARα 작용을 통한 분화 촉진제입니다.':''}`));
function build(rows){
 const labels=[...new Set(rows.flatMap(d=>d.validTargets))];
 return rows.flatMap((d,index)=>d.validTargets.map((answer,n)=>{
  // For anthracyclines keep one concise Topo II question; DNA remains a valid target to exclude.
  if(d.key==='anthra'&&n>0)return null;
  const broad=new Set(['T세포 표면항원','Purine 합성']);
  const others=labels.filter(x=>!d.validTargets.includes(x)&&!broad.has(x)&&(d.key!=='polyt'||['Calcineurin','mTOR','JAK','IMPDH','DHFR'].includes(x))),offset=(index*3+n)%others.length,wrong=[...others.slice(offset),...others.slice(0,offset)].slice(0,4);
  return {id:d.id+':'+n,subject:d.id,core:d.core,weight:d.weight||1,stem:d.stem,answer,options:[answer,...wrong],validTargets:d.validTargets,note:d.note,lectureNote:d.lectureNote,details:[d.lectureNote],source:d.source,exam:d.exam||'강의 표적 복습'};
 }).filter(Boolean));
}
function withJudgments(drugs){
 const direct=build(drugs),byId=Object.fromEntries(drugs.map(d=>[d.id,d]));
 const rows=direct.map(q=>({id:q.id,left:byId[q.subject].name,right:q.answer,wrong:q.options.find(t=>!q.validTargets.includes(t)),source:q.source,note:q.note,family:byId[q.subject].key}));
 const judgments=direct.flatMap((q,index)=>['correct','incorrect'].map(polarity=>{
  const result=createPairedQuestion({...q,id:`judgment:${q.id}:${polarity}`},rows[index],rows,{polarity,index,topic:'약물과 강의록의 직접 표적'});
  return {...result,details:[...result.details,q.lectureNote]};
 }));
 return [...direct,...judgments];
}
export const SIMPLE_BANKS={'immune-simple':withJudgments(immune),'anticancer-simple':withJudgments(anticancer),'signal-simple':withJudgments(signal)};
function shuffle(items,random){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
export function pickSimpleTargetQuestion(scope,state,range='core',random=Math.random){
 const bank=SIMPLE_BANKS[scope].filter(q=>range!=='core'||q.core),recent=state.recent||[],subjects=state.subjects||[];
 let pool=bank.filter(q=>!recent.includes(q.id)&&!subjects.includes(q.subject));if(!pool.length)pool=bank.filter(q=>!recent.includes(q.id));if(!pool.length)pool=bank;
 const score=q=>(state.seen?.[q.id]||0)/q.weight,min=Math.min(...pool.map(score)),available=pool.filter(q=>score(q)===min),q=available[Math.floor(random()*available.length)],choices=shuffle(q.options,random).map(text=>({text}));
 return {...q,choices,answerIndex:choices.findIndex(x=>x.text===q.answer)};
}
