// Exam relationships, including the pre-2020 targeted-therapy sections.
// The two 2023 direct-answer anchors remain in the same revision priority set.
export const SIGNAL_EXAM_PRIORITY={
 gefitinib:{weight:4,sources:['2021년 31강 83번','2020년 31강 82번','2019년 표적 항암 94번','2017년 표적 항암 76번']},
 dasatinib:{weight:4,sources:['2021년 31강 82번','2020년 31강 81번','2018년 표적 항암 88번']},
 imatinib:{weight:4,sources:['2025년 유전자 표적 항암 91번','2019년 표적 항암 96번']},
 sunitinib:{weight:4,sources:['2025년 유전자 표적 항암 93번','2018년 표적 항암 1번','2017년 표적 항암 76번']},
 cetuximab:{weight:3,sources:['2021년 31강 83번','2021년 항암 항체 치료제 87번','2019년 표적 항암 96번']},
 trastuzumab:{weight:3,sources:['2018년 표적 항암 1번','2020년 면역항암제 83번']},
 lapatinib:{weight:3,sources:['2017년 표적 항암 76번','2020년 31강 82번 보기']},
 rituximab:{weight:3,sources:['2023년 31강 64번','2017년 표적 항암 77번']},
 alemtuzumab:{weight:3,sources:['2023년 31강 64번','2017년 표적 항암 77번']},
 bevacizumab:{weight:3,sources:['2021년 유전자 표적 항암 81번','2018년 표적 항암 1번','2019년 표적 항암 96번']},
 tretinoin:{weight:2,sources:['2023년 31강 65번 · APL–RARα']},
 gemtuzumab:{weight:2,sources:['2023년 31강 64번 · CD33']}
};
export function signalPriorityPool(pool,state={}){
 // Each 25-draw cycle contains four complete 5-draw blocks for priority drugs
 // and one for other drugs. This stays independent of the existing clinical,
 // target and support slots, so every question type keeps its full coverage.
 const draws=Number.isFinite(state.draws)?state.draws:Object.values(state.seen||{}).reduce((n,v)=>n+(Number(v)||0),0);
 const priority=Math.floor(draws/5)%5<4;
 const selected=pool.filter(q=>!!SIGNAL_EXAM_PRIORITY[q.subject]===priority);
 return selected.length?selected:pool;
}
export function signalSubjectPool(pool,bank,state={},random=Math.random){
 const seen=new Map();for(const q of bank)seen.set(q.subject,(seen.get(q.subject)||0)+(Number(state.seen?.[q.id])||0));
 const subjects=[...new Set(pool.map(q=>q.subject))],score=id=>(seen.get(id)||0)/(SIGNAL_EXAM_PRIORITY[id]?.weight||1);
 const min=Math.min(...subjects.map(score)),eligible=subjects.filter(id=>score(id)===min),subject=eligible[Math.floor(random()*eligible.length)];
 // Choose a drug before choosing its question. Four target rows must not
 // give one drug four times the chance of another drug at the same priority.
 return pool.filter(q=>q.subject===subject);
}
