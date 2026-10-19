import pk from './comprehensive-02-04.mjs?v=20261020-comp1';
import basics from './comprehensive-05-10.mjs?v=20261020-comp1';
import neural from './comprehensive-11-16.mjs?v=20261020-comp1';
import systems from './comprehensive-17-22.mjs?v=20261020-comp1';
import antimicrobials from './comprehensive-23-28.mjs?v=20261020-comp1';
import cancer from './comprehensive-29-36.mjs?v=20261020-comp1';
const titles=['약동학(1) · 흡수와 분포','약동학(2) · 소실·배설과 파라미터','약동학(3) · 약물요법의 통합적 적용','약력학(1)','약력학(2)','약물대사','약물수송체','자율신경계 약리 기초','콜린성 약리학(1)','콜린성 약리학(2)','아드레날린성 약리학(1)','아드레날린성 약리학(2)','중추신경계 약리 기초','중추신경계 질환 약리','내분비 약리 기초','체액·전해질 조절(1)','체액·전해질 조절(2)','순환기 약리 기초(1)','순환기 약리 기초(2)','히스타민 약리','지혈과 혈전증 약리','항생제 치료의 기본 원리','페니실린계·세파계 항생제','아미노글라이코사이드·설파·퀴놀론','기타 항생제','항진균·항바이러스·항마이코박테리아','면역억제 약리','항암제 기초','항대사·항호르몬 항암제','신호전달 표적항암제','면역항암제','스테로이드 약리','항염증 약리','갑상선·부갑상선 호르몬 약리','독성 약리'];
export const COMPREHENSIVE_LECTURES=titles.map((title,i)=>({number:i+2,title,scope:'comp-'+String(i+2).padStart(2,'0'),tabId:'compUnit'+String(i+2).padStart(2,'0')}));
const labelPages=pages=>pages.join('·');
function normalize(raw){
 const unit=COMPREHENSIVE_LECTURES.find(u=>u.number===raw.lecture);
 if(!unit||raw.options.length!==5||raw.explanations.length!==5||!raw.options[raw.answerIndex])throw Error('Invalid comprehensive item: '+raw.id);
 const lecture=raw.lectureSources?.map(s=>s.label+' PDF '+s.page+'쪽').join(' · '),exam=raw.examRefs.map(r=>'족보 PDF '+r.page+'쪽').filter((v,i,a)=>a.indexOf(v)===i).join(' · ');
 return {...raw,scope:unit.scope,answer:raw.options[raw.answerIndex],note:raw.rationale,details:raw.options.map((o,i)=>o+': '+raw.explanations[i]),source:'본인 정리본 PDF '+labelPages(raw.notesPages)+'쪽'+(lecture?' · '+lecture:''),exam};
}
export const COMPREHENSIVE_QUESTIONS=[...pk,...basics,...neural,...systems,...antimicrobials,...cancer].map(normalize);
if(COMPREHENSIVE_QUESTIONS.length!==175||new Set(COMPREHENSIVE_QUESTIONS.map(q=>q.id)).size!==175||COMPREHENSIVE_LECTURES.some(u=>COMPREHENSIVE_QUESTIONS.filter(q=>q.lecture===u.number).length!==5))throw Error('Each lecture from 2 to 36 must have exactly five questions.');
export function pickComprehensiveQuestion(lecture,state={},random=Math.random){
 const bank=COMPREHENSIVE_QUESTIONS.filter(q=>lecture==='all'||q.lecture===Number(lecture));if(!bank.length)return null;
 let pool=bank.filter(q=>!(state.recent||[]).includes(q.id));if(!pool.length)pool=bank;
 if(lecture==='all'){const other=pool.filter(q=>q.lecture!==state.lastLecture);if(other.length)pool=other;}
 const score=q=>Number(state.seen?.[q.id])||0,min=Math.min(...pool.map(score));pool=pool.filter(q=>score(q)===min);
 if(state.lastPolarity){const varied=pool.filter(q=>!q.polarity||q.polarity!==state.lastPolarity);if(varied.length)pool=varied;}
 const q=pool[Math.floor(random()*pool.length)],choices=q.options.map((text,i)=>({text,correct:i===q.answerIndex,reason:q.explanations[i]}));
 for(let i=choices.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
 return {...q,choices,answerIndex:choices.findIndex(c=>c.correct)};
}
