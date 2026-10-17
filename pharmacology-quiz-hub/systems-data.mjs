import {buildUnderstandingBank} from './systems-builder.mjs?v=20261017-systems1';
import {ENDOCRINE_CASES} from './endocrine16-data.mjs?v=20261017-systems1';
import {RENAL_CASES} from './renal1718-data.mjs?v=20261017-systems1';
import {CARDIAC_CASES} from './cardiac1920-data.mjs?v=20261017-systems1';
export const SYSTEMS_CASES={endocrine:ENDOCRINE_CASES,renal:RENAL_CASES,cardio:CARDIAC_CASES};
export const SYSTEMS_BANKS=Object.fromEntries(Object.entries(SYSTEMS_CASES).map(([scope,cases])=>[scope,buildUnderstandingBank(scope,cases)]));
export const SYSTEMS_CONFIG={
 endocrine:{title:'16강 · 내분비 종합 이해',focus:'작용 장기 → 세포 표적 → 혈당·체중 변화 → 부작용',notes:[
  '16강의 호르몬 기본 원리와 당뇨병 치료제가 범위입니다. 33강 스테로이드 세부 약물 분류는 포함하지 않습니다.',
  'DPP-4 억제제는 대체로 체중 중립적입니다. GLP-1 수용체 작용제의 식욕·체중 효과를 동일하게 옮기지 않습니다.',
  'Metformin의 간 작용과 신장 배설을 구별하며, 동반 질환이 있으면 모든 환자에게 같은 첫 약을 적용하지 않습니다.'
 ]},
 renal:{title:'17–18강 · 신장 종합 이해',focus:'네프론 위치 → 수송체·이온 방향 → 소변·혈중 변화 → 임상',notes:[
  '관강에서 혈액 쪽 이동은 재흡수, 혈액에서 관강 쪽 이동은 분비입니다. 소변 배설량과 혈중 농도를 구분하세요.',
  'NCC의 표준 위치는 초기 원위곡세뇨관(DCT)입니다. 강의 그림의 피질 희석 부위와 대응하며 NKCC2가 있는 TAL과 구별합니다.',
  'Mannitol의 이뇨는 여과액 삼투압 증가와 수분 재흡수 감소로 설명합니다. 무독성·모든 급성 신손상 회복으로 일반화하지 않습니다.',
  '직접 ENaC 차단과 MR 길항은 표적이 다릅니다. 알도스테론은 성호르몬이 아니라 무기질코르티코이드입니다.'
 ]},
 cardio:{title:'19–20강 · 순환기 종합 이해',focus:'심부전 혈역학 ↔ 부정맥 발생 기전 ↔ 세포·활동전위·약물',notes:[
  '심부전 약물과 항부정맥제는 목적이 다르지만 β차단제처럼 용도가 겹치는 약도 있습니다.',
  'Digoxin: Na⁺/K⁺ 펌프 억제 → 세포 내 Na⁺ 증가 → NCX의 Ca²⁺ 배출 감소 → Ca²⁺ 가용성 증가입니다.',
  'EAD는 재분극 완료 전, DAD는 완료 후입니다. 재분극 지연·QT 연장과 Ca²⁺ 과부하를 각각 구별하세요.',
  '경색 후 흉터·경계부는 재진입 회로의 기질이 될 수 있습니다. Na⁺ 통로 차단은 추가 심근경색을 일으키는 치료라는 뜻이 아닙니다.',
  '약물 선택 사례에는 필요한 조건을 명시했습니다. 특히 규칙적 결절 의존 PSVT와 WPW의 조기흥분성 AF는 같은 약물 원칙으로 묶지 않습니다.',
  'WPW·AF 및 경색 후 class IC의 주의점은 강의의 단순화를 임상 전반으로 확대하지 않도록 현행 지침·허가정보와 대조했습니다.'
 ]}
};
export function pickSystemsQuestion(scope,state={},polarity='all',random=Math.random,area='all'){
 let bank=(SYSTEMS_BANKS[scope]||[]).filter(q=>area==='all'||q.group===area);
 if(polarity!=='all')bank=bank.filter(q=>q.polarity===polarity);
 else{const next=state.lastPolarity==='correct'?'incorrect':'correct',matching=bank.filter(q=>q.polarity===next);if(matching.length)bank=matching;}
 if(!bank.length)return null;
 let pool=bank.filter(q=>!(state.recent||[]).includes(q.id)&&!(state.subjects||[]).includes(q.subject));
 if(!pool.length)pool=bank.filter(q=>!(state.recent||[]).includes(q.id)&&q.subject!==state.subjects?.[0]);
 if(!pool.length)pool=bank.filter(q=>!(state.recent||[]).includes(q.id));
 if(!pool.length)pool=bank;
 const count=q=>Number(state.seen?.[q.id])||0,min=Math.min(...pool.map(count)),least=pool.filter(q=>count(q)===min),q=least[Math.floor(random()*least.length)];
 const choices=q.options.map(text=>({text}));
 for(let i=choices.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]];}
 return {...q,choices,answerIndex:choices.findIndex(c=>c.text===q.answer)};
}
