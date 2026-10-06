// 2026 8강 약물수송체: 현 강의록의 표, 사례, 마지막 두 연습문제.
import {shuffle} from './cyp.mjs?v=20261005-4';
import {createMatchBoard} from './match-board.mjs?v=20261006-1';
const f=(id,group,correct,incorrect,note,page)=>({id,group,correct,incorrect,note,page});
export const TRANSPORT_FACTS=[
  f('abc-atp','family','ABC 수송체는 ATP 가수분해 에너지로 기질을 이동시킨다.','ABC 수송체는 Na⁺ 농도구배 에너지로 기질을 이동시킨다.','P-gp·BCRP·BSEP는 ABC 계열이다.',5),
  f('pgp-abc','family','P-gp(ABCB1·MDR1)는 ABC 수송체에 속한다.','P-gp(ABCB1·MDR1)는 SLC 수송체에 속한다.','강의록의 대표 수송체·구동력 표에 등장한다.',5),
  f('bcrp-abc','family','BCRP(ABCG2)는 ABC 계열 유출 수송체이다.','BCRP(ABCG2)는 SLC 계열 유출 수송체이다.','장 내강 쪽 BCRP를 막으면 유출이 감소한다.',15),
  f('bsep-abc','family','BSEP는 담즙산을 유출하는 ABC 수송체이다.','BSEP는 담즙산을 유출하는 SLC 수송체이다.','BSEP 억제는 담즙정체 위험과 연결된다.',12),
  f('oct2-slc','family','OCT2는 유기양이온을 운반하는 SLC 수송체이다.','OCT2는 유기양이온을 운반하는 ABC 수송체이다.','OCT2는 신장 혈액 쪽 막의 양이온 유입을 담당한다.',5),
  f('mate-slc','family','MATE는 H⁺ 구배에 연결되는 SLC 수송체이다.','MATE는 ATP 가수분해에 연결되는 ABC 수송체이다.','신세뇨관의 내강 쪽으로 양이온을 배출한다.',5),
  f('sglt2-slc','family','SGLT2는 Na⁺ 구배를 이용하는 SLC 수송체이다.','SGLT2는 ATP 가수분해를 이용하는 ABC 수송체이다.','포도당의 재흡수와 연결된 공동수송체다.',5),
  f('saturation','family','수송체의 기질 이동은 포화되어 최대속도 Vmax에 접근한다.','단순확산의 기질 이동은 포화되어 최대속도 Vmax에 접근한다.','강의록에서 수송체 이동에는 Km·Vmax가, 단순확산에는 선형 관계가 제시된다.',6),
  f('no-metabolism','family','약물수송체는 분자를 바꾸지 않고 막을 건너 이동시킨다.','약물수송체는 분자를 산화시켜 막을 건너 이동시킨다.','대사효소와 달리 화학적 변환이 아니다.',2),
  f('uptake-f','direction','장 내강에서 세포로의 유입을 막으면 흡수율 F가 감소한다.','장 내강에서 세포로의 유입을 막으면 흡수율 F가 증가한다.','장 안에서 세포로 들어오는 경로를 억제한 상황이다.',10),
  f('efflux-f','direction','장 세포에서 내강으로의 P-gp 유출을 막으면 F가 증가한다.','장 세포에서 내강으로의 P-gp 유출을 막으면 F가 감소한다.','배출을 막으면 장 세포를 거쳐 흡수될 약물이 늘 수 있다.',10),
  f('pgp-bbb','direction','BBB의 P-gp는 기질을 뇌에서 혈액 쪽으로 유출한다.','BBB의 P-gp는 기질을 혈액에서 뇌 쪽으로 유입한다.','뇌에 들어온 이물질을 혈액 쪽으로 퍼내는 기능이다.',29),
  f('tariquidar','direction','Tariquidar가 P-gp를 억제하면 기질의 뇌 분포가 늘 수 있다.','Tariquidar가 P-gp를 억제하면 기질의 뇌 분포가 줄 수 있다.','강의록의 [¹¹C]verapamil PET 사례에 해당한다.',29),
  f('pgp-tumour','direction','종양의 P-gp 증가로 기질 항암제의 세포 내 농도가 줄 수 있다.','종양의 P-gp 증가로 기질 항암제의 세포 내 농도가 늘 수 있다.','세포 바깥으로 내보내는 수송이 약물내성에 기여한다.',30),
  f('amio-pgp','direction','Amiodarone은 P-gp 억제제로 제시되며 장 유출을 낮춘다.','Amiodarone은 P-gp 억제제로 제시되며 장 유출을 높인다.','Dabigatran 전구약물의 장 P-gp와 병용 사례다. 관찰연구는 단독 인과를 증명하지 않는다.',11),
  f('oat-blood','direction','OAT1·OAT3는 신장 혈액 쪽에서 유기음이온 분비에 관여한다.','OAT1·OAT3는 신장 소변 쪽에서 유기음이온 재흡수에 관여한다.','신장 혈액 쪽 분비 경로의 유입 수송체다.',23),
  f('oat-probenecid','direction','Probenecid는 OAT1·OAT3의 유기음이온 분비 경로를 억제한다.','Probenecid는 OAT1·OAT3의 유기음이온 분비 경로를 촉진한다.','강의록의 신장 수송체 억제제 대응이다.',23),
  f('cyc-bcrp','hepatic','Cyclosporine이 장 BCRP를 막으면 rosuvastatin 흡수가 늘 수 있다.','Cyclosporine이 장 BCRP를 막으면 rosuvastatin 흡수가 줄 수 있다.','장 내강 유출을 줄여 생체이용률 F가 증가하는 방향이다.',15),
  f('cyc-oatp','hepatic','Cyclosporine이 간 OATP1B1을 막으면 rosuvastatin의 간 유입이 준다.','Cyclosporine이 간 OATP1B1을 막으면 rosuvastatin의 간 유입이 는다.','OATP1B1은 간세포의 혈액 쪽 유입 수송체다.',13),
  f('statin-plasma','hepatic','OATP1B1 유입이 줄면 statin의 혈중 노출이 증가할 수 있다.','OATP1B1 유입이 줄면 statin의 혈중 노출이 감소할 수 있다.','간으로 들어가지 못하면 혈액에 더 남고 근육 이상반응 위험이 커질 수 있다.',13),
  f('plasma-not-pd','hepatic','Statin 혈중 농도가 늘어도 간세포 내 약효 증가를 단정할 수 없다.','Statin 혈중 농도가 늘면 간세포 내 약효 증가를 단정할 수 있다.','표적은 간세포 안에 있으므로 혈중 노출과 간 내 노출을 구별한다.',13),
  f('bsep-cholestasis','hepatic','BSEP 억제는 간세포 담즙산 축적과 담즙정체 위험을 높인다.','BSEP 억제는 간세포 담즙산 축적과 담즙정체 위험을 낮춘다.','담즙산 유출을 막아 세포 내 축적이 생긴다.',12),
  f('slco1b1','hepatic','SLCO1B1 기능 저하는 OATP1B1의 statin 간 유입을 줄일 수 있다.','SLCO1B1 기능 저하는 OATP1B1의 statin 간 유입을 늘릴 수 있다.','강의록의 statin 유전자형 사례다.',14),
  f('ntcp-entry','hepatic','간세포 NTCP는 담즙산 유입과 HBV·HDV의 진입에 관여한다.','간세포 NTCP는 담즙산 유출과 HBV·HDV의 진입에 관여한다.','강의록의 NTCP 그림: 담즙산 유입과 바이러스 진입 수용체가 겹친다.',28),
  f('bulevirtide','hepatic','Bulevirtide는 NTCP에 결합하여 HDV의 간세포 진입을 막는다.','Bulevirtide는 NTCP에 결합하여 HDV의 간세포 진입을 촉진한다.','강의록의 만성 HDV 치료 표적이다.',28),
  f('cr-gfr','renal','Dolutegravir 투여 후 creatinine 상승에도 실제 GFR은 유지될 수 있다.','Dolutegravir 투여 후 creatinine 상승은 실제 GFR 감소를 뜻한다.','OCT2·MATE1 억제로 분비가 줄어든 경우, iohexol 측정 GFR은 변하지 않았다.',16),
  f('dolutegravir','renal','Dolutegravir는 OCT2·MATE1을 억제해 creatinine 분비를 줄인다.','Dolutegravir는 OCT2·MATE1을 촉진해 creatinine 분비를 늘린다.','혈청 수치 상승과 사구체 여과 감소를 구별한다.',16),
  f('oct2-blood','renal','OCT2는 metformin을 혈액 쪽에서 신세뇨관 세포로 유입시킨다.','OCT2는 metformin을 소변 쪽에서 신세뇨관 세포로 유입시킨다.','신장의 basolateral 막 수송체다.',17),
  f('mate-urine','renal','MATE는 metformin을 신세뇨관 세포에서 소변으로 배출한다.','MATE는 metformin을 신세뇨관 세포에서 혈액으로 배출한다.','내강 쪽 apical 막의 유출 경로다.',17),
  f('pyrimethamine','renal','Pyrimethamine은 MATE1·MATE2-K를 억제하는 약물이다.','Pyrimethamine은 MATE1·MATE2-K를 유도하는 약물이다.','강의록의 metformin 병용 사례다.',17),
  f('metformin-pkpd','renal','Pyrimethamine 병용 연구에서 metformin AUC는 늘고 혈당강하 효과는 줄었다.','Pyrimethamine 병용 연구에서 metformin AUC는 늘고 혈당강하 효과도 늘었다.','강의록 21–22쪽 사례에서 혈중 노출 증가와 약효 감소가 함께 관찰됐다.',21),
  f('creatinine-cl','renal','수송체가 세뇨관 분비를 억제하면 실제 GFR 변화 없이 creatinine이 오를 수 있다.','수송체가 세뇨관 분비를 억제하면 실제 GFR 감소로만 creatinine이 오른다.','혈청 creatinine 상승의 두 원인을 구별한다.',16),
  f('renal-eq','renal','같은 채집 구간에서 요중 배설량 Ae는 신장 청소율 CLᵣ×AUC이다.','같은 채집 구간에서 요중 배설량 Ae는 신장 청소율 CLᵣ÷AUC이다.','강의록 15·35쪽: CLᵣ=Ae/AUC를 변형한다.',35),
  f('oat-furosemide','renal','Furosemide는 OAT1·OAT3 분비로 내강에 도달해 NKCC2를 억제한다.','Furosemide는 OAT1·OAT3 분비로 내강에 도달해 NCC를 억제한다.','수송체를 통한 약물의 표적 접근과 NKCC2의 표적 작용을 구분한다.',25),
  f('urate-reabs','renal','URAT1 억제는 요산 재흡수를 줄여 요산 배설을 늘린다.','URAT1 억제는 요산 재흡수를 늘려 요산 배설을 줄인다.','요산의 소변→혈액 재흡수 경로를 억제한다.',23),
  f('sglt-glif','targets','Gliflozin 계열은 SGLT2를 억제해 포도당 재흡수를 줄인다.','Gliflozin 계열은 SGLT2를 활성화해 포도당 재흡수를 늘린다.','강의록의 신장 표적 치료제 표에 실린다.',25),
  f('nkcc-furo','targets','Furosemide는 NKCC2를 억제해 Na⁺·수분 배설을 늘린다.','Furosemide는 NCC를 억제해 Na⁺·수분 배설을 늘린다.','Furosemide의 표적은 굵은상행각 NKCC2다.',25),
  f('ncc-thiazide','targets','Thiazide계는 NCC를 억제해 Na⁺ 배설을 늘린다.','Thiazide계는 NKCC2를 억제해 Na⁺ 배설을 늘린다.','강의록은 원위세뇨관 NCC와 연결한다.',25),
  f('urat-dotin','targets','Dotinurad는 URAT1을 억제해 요산 배설을 늘린다.','Dotinurad는 URAT1을 활성화해 요산 배설을 줄인다.','혈중 요산 농도를 낮추는 신장 표적이다.',25),
  f('npc-eze','targets','Ezetimibe는 NPC1L1을 막아 장 콜레스테롤 흡수를 줄인다.','Ezetimibe는 NPC1L1을 막아 장 콜레스테롤 흡수를 늘린다.','강의록의 장 상피세포 표적 표에 실린다.',27),
  f('ibat-mara','targets','Maralixibat는 IBAT(ASBT)를 막아 담즙산 재흡수를 줄인다.','Maralixibat는 IBAT(ASBT)를 막아 담즙산 재흡수를 늘린다.','IBAT는 회장 쪽 담즙산 재흡수 경로다.',27),
  f('ibat-ode','targets','Odevixibat는 IBAT(ASBT) 억제와 연결된다.','Odevixibat는 NTCP 억제와 연결된다.','Maralixibat와 함께 IBAT 표적의 약물이다.',27),
  f('nhe-tena','targets','Tenapanor는 NHE3를 막아 장 Na⁺ 흡수를 줄인다.','Tenapanor는 NHE3를 막아 장 Na⁺ 흡수를 늘린다.','강의록의 변비형 과민성장증후군 치료 사례다.',27),
  f('sert-fluo','targets','Fluoxetine은 SERT를 억제해 세로토닌 재흡수를 줄인다.','Fluoxetine은 NET를 억제해 세로토닌 재흡수를 줄인다.','강의록의 신경세포막 약물 표에 실린다.',26),
  f('sert-net-dulo','targets','Duloxetine은 SERT·NET를 억제해 두 신경전달물질 재흡수를 줄인다.','Duloxetine은 SERT·NET를 활성화해 두 신경전달물질 재흡수를 늘린다.','강의록에서 세로토닌과 노르에피네프린을 함께 표시한다.',26),
  f('vmat-val','targets','Valbenazine은 VMAT2를 억제해 소포 내 모노아민 저장을 줄인다.','Valbenazine은 VMAT2를 억제해 소포 내 모노아민 저장을 늘린다.','강의록의 지연성 운동장애 치료 예시다.',26),
  f('ntcp-bule-target','targets','Bulevirtide의 치료 표적은 간세포 막의 NTCP이다.','Bulevirtide의 치료 표적은 간세포 막의 BSEP이다.','NTCP는 HDV 진입 수용체이고 BSEP는 담즙산 유출 수송체다.',28)
];
export const TRANSPORT_SPECIALS=[
  {id:'pick-abc',group:'family',stem:'다음 중 SLC 수송체 넷과 계열이 다른 것은?',answer:'BSEP',options:['BSEP','OCT2','MATE','SGLT2','SERT'],note:'BSEP는 ABC 수송체, 나머지는 SLC 계열이다.'},
  {id:'pick-inhibitor',group:'renal',stem:'다음 중 강의록에서 MATE 억제제로 제시된 약물은?',answer:'Pyrimethamine',options:['Pyrimethamine','Probenecid','Amiodarone','Tariquidar','Cyclosporine'],note:'Pyrimethamine은 MATE1·MATE2-K를 억제한다. Probenecid는 OAT1·OAT3, amiodarone·tariquidar는 P-gp 억제와 연결된다.'},
  {id:'pick-ntcp',group:'hepatic',stem:'HDV의 간세포 진입을 막는 bulevirtide의 표적 수송체는?',answer:'NTCP',options:['NTCP','BSEP','OATP1B1','BCRP','P-gp'],note:'NTCP는 담즙산 유입 수송체이면서 HBV·HDV 진입 수용체다.'},
  {id:'pick-pd','group':'hepatic',stem:'혈중 약물 노출은 그대로인데 간세포의 표적 억제율이 감소했다. 두 가설을 구분할 추가 측정값은?',answer:'간세포 내 약물농도',options:['간세포 내 약물농도','혈중 약물 최고농도','혈중 약물 AUC','투여한 약물 총량','혈장 단백결합률'],note:'강의록 연습문제 1: 혈중 곡선만으로 간세포 유입 감소와 세포 내 감수성 감소를 구별할 수 없다.'},
  {id:'pick-pgp','group':'direction',stem:'장 P-gp를 억제했을 때 직접 예상되는 변화는?',answer:'장 내강 유출 감소',options:['장 내강 유출 감소','장 내강 유출 증가','장 상피 유입 감소','간세포 유입 증가','담즙산 유출 증가'],note:'장세포에서 내강으로 되돌리는 유출이 억제된다. 약물별 전체 AUC 변화는 다른 경로도 고려해야 한다.'}
];
export const AE_CASES=[
  {id:'ae-lecture',auc:2.15,cl:0.39},
  {id:'ae-a',auc:1.5,cl:0.4},
  {id:'ae-b',auc:2.4,cl:0.5},
  {id:'ae-c',auc:3.0,cl:0.3},
  {id:'ae-d',auc:1.8,cl:0.6}
];
export const TARGET_TABLE=[
  ['SGLT2','Gliflozin 계열','포도당 재흡수 ↓ · 요당 ↑',25],['NKCC2','Furosemide','Na⁺·수분 재흡수 ↓',25],['NCC','Thiazide계','Na⁺ 재흡수 ↓',25],['URAT1','Dotinurad','요산 재흡수 ↓ · 요산 배설 ↑',25],
  ['SERT','Fluoxetine','세로토닌 재흡수 ↓',26],['SERT·NET','Duloxetine','세로토닌·NE 재흡수 ↓',26],['VMAT2','Valbenazine','소포 내 모노아민 저장 ↓',26],
  ['NPC1L1','Ezetimibe','콜레스테롤 흡수 ↓',27],['IBAT(ASBT)','Maralixibat · Odevixibat','담즙산 재흡수 ↓',27],['NHE3','Tenapanor','장 Na⁺ 흡수 ↓',27],['NTCP','Bulevirtide','HDV의 간세포 진입 차단',28]
];
export const TRANSPORT_DRUGS=[
  ['amiodarone','P-gp 억제'],['tariquidar','P-gp 억제'],['pyrimethamine','MATE 억제'],['dolutegravir','OCT2·MATE1 억제'],['probenecid','OAT1·OAT3 억제'],['cyclosporine','BCRP·OATP1B1 억제'],
  ['metformin','OCT·MATE 기질'],['rosuvastatin','OATP1B1·BCRP 기질'],
  ['gliflozins','SGLT2 표적'],['furosemide','NKCC2 표적'],['thiazides','NCC 표적'],['dotinurad','URAT1 표적'],
  ['fluoxetine','SERT 표적'],['duloxetine','SERT·NET 표적'],['valbenazine','VMAT2 표적'],
  ['ezetimibe','NPC1L1 표적'],['maralixibat','IBAT 표적'],['odevixibat','IBAT 표적'],['tenapanor','NHE3 표적'],['bulevirtide','NTCP 표적']
].map(([drug,category])=>({drug,category}));
const SYMBOLS=['①','②','③','④','⑤'];
export function makeTransportQuestion(fact,targetCorrect,random=Math.random){
  const others=shuffle(TRANSPORT_FACTS.filter(x=>x.group===fact.group&&x.id!==fact.id),random);
  const desired=(targetCorrect?fact.correct:fact.incorrect).length;
  const competitors=others.sort((a,b)=>Math.abs((targetCorrect?a.incorrect:a.correct).length-desired)-Math.abs((targetCorrect?b.incorrect:b.correct).length-desired)).slice(0,4);
  const choices=shuffle([{fact,text:targetCorrect?fact.correct:fact.incorrect,isAnswer:true},...competitors.map(x=>({fact:x,text:targetCorrect?x.incorrect:x.correct,isAnswer:false}))],random);
  const topic={family:'수송체 계열·구동력',direction:'이동 방향과 노출',hepatic:'간 유입·유출',renal:'신장 분비·청소율',targets:'수송체 표적 약물'}[fact.group];
  return {stem:`다음 중 ${topic}에 대한 설명으로 ${targetCorrect?'옳은':'옳지 않은'} 것은?`,choices,answerIndex:choices.findIndex(x=>x.isAnswer),fact};
}
export function makeTransportSpecial(fact,random=Math.random){
  const choices=shuffle(fact.options.map(text=>({text,isAnswer:text===fact.answer})),random);
  return {stem:fact.stem,choices,answerIndex:choices.findIndex(x=>x.isAnswer),fact,special:true};
}
export function makeAeQuestion(fact,random=Math.random){
  const val=(n)=>`${Number(n.toFixed(2))}배`;
  const answer=val(fact.auc*fact.cl);
  const options=[answer,val(fact.auc),val(fact.cl),val(fact.cl/fact.auc),val(fact.auc/fact.cl)];
  const choices=shuffle([...new Set(options)].map(text=>({text,isAnswer:text===answer})),random);
  if(choices.length!==5)throw new Error(`Ae 계산 선택지 중복: ${fact.id}`);
  return {stem:`동일한 24시간 채집에서 AUC는 ${fact.auc}배, 신장 청소율 CLᵣ은 ${fact.cl}배가 되었다. 그 구간의 요중 배설량 Ae는 원래의 약 몇 배인가?`,choices,answerIndex:choices.findIndex(x=>x.isAnswer),fact:{...fact,answer,note:`Ae = CLᵣ × AUC이므로 ${fact.cl} × ${fact.auc} = ${(fact.auc*fact.cl).toFixed(3)}배 (약 ${answer}). 동일한 채집 구간을 비교한다.`},special:true};
}
export function initTransportQuiz(){
  const $=id=>document.getElementById(id),KEY='pharmacology-transporter-lecture8-v1';
  let state={seen:{},missed:{},recent:[],lastGroup:null,lastTarget:false,total:0,right:0,boards:0};
  try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved?.seen)state={...state,...saved};}catch{}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
  let tab='quiz',current=null,answered=false,session=0;
  const totalFacts=TRANSPORT_FACTS.length+TRANSPORT_SPECIALS.length+AE_CASES.length;
  function stats(){$('txStats').textContent=`정답 ${state.right}/${state.total} · 복기한 연결 ${Object.keys(state.seen).length}/${totalFacts}`;}
  function next(){
    const all=[...TRANSPORT_FACTS,...TRANSPORT_SPECIALS,...AE_CASES.map(c=>({...c,group:'calculation'}))];
    let pool=all.filter(f=>!(state.recent||[]).includes(f.id)&&f.group!==state.lastGroup);
    if(!pool.length)pool=all.filter(f=>!(state.recent||[]).includes(f.id));
    const weight=f=>(state.seen[f.id]||0)-0.3*(state.missed[f.id]||0);
    const min=Math.min(...pool.map(weight));const fact=shuffle(pool.filter(f=>weight(f)===min))[0];
    const target=!state.lastTarget;state.lastTarget=target;state.lastGroup=fact.group;
    state.recent=[fact.id,...(state.recent||[]).filter(id=>id!==fact.id)].slice(0,3);
    current=fact.group==='calculation'?makeAeQuestion(fact):TRANSPORT_SPECIALS.includes(fact)?makeTransportSpecial(fact):makeTransportQuestion(fact,target);
    answered=false;session++;save();stats();$('txProgress').textContent=`이번 회독 ${session}문제`;$('txStem').textContent=current.stem;
    $('txFeedback').hidden=true;$('txNext').hidden=true;
    const host=$('txChoices');host.replaceChildren();current.choices.forEach((entry,i)=>{const button=document.createElement('button');button.type='button';const no=document.createElement('span');no.className='option-no';no.textContent=SYMBOLS[i];const label=document.createElement('span');label.textContent=entry.text;button.append(no,label);button.addEventListener('click',()=>answer(i));host.append(button);});
  }
  function answer(i){
    if(answered||!current)return;answered=true;const good=i===current.answerIndex,f=current.fact;
    state.total++;state.right+=Number(good);state.seen[f.id]=(state.seen[f.id]||0)+1;
    if(!good)state.missed[f.id]=(state.missed[f.id]||0)+1;save();stats();
    [...$('txChoices').children].forEach((button,j)=>{button.disabled=true;if(j===current.answerIndex)button.classList.add('correct');else if(j===i)button.classList.add('wrong');});
    const fb=$('txFeedback');fb.className=`feedback ${good?'ok':'bad'}`;fb.replaceChildren();
    const heading=document.createElement('strong');heading.textContent=`${good?'정답입니다.':'바뀐 부분을 확인하세요.'} 정답 ${SYMBOLS[current.answerIndex]}`;
    const list=document.createElement('ol');list.className='ans-explanations';
    if(current.special){const row=document.createElement('li');row.textContent=`${f.answer} · ${f.note}`;list.append(row);}
    else current.choices.forEach((item,j)=>{const row=document.createElement('li');row.textContent=`${SYMBOLS[j]} ${item.text===item.fact.correct?'옳음':'틀림'} · ${item.fact.note}${item.text!==item.fact.correct?' 바른 설명: '+item.fact.correct:''} (강의록 ${item.fact.page}쪽)`;list.append(row);});
    fb.append(heading,list);fb.hidden=false;$('txNext').hidden=false;
  }
  function buildTable(){const body=$('txTableBody');for(const [target,drug,effect,page] of TARGET_TABLE){const row=document.createElement('tr');for(const value of [target,drug,effect,`${page}쪽`]){const cell=document.createElement('td');cell.textContent=value;row.append(cell);}body.append(row);}}
  const match=createMatchBoard({poolId:'txPool',cardsId:'txCards',zonesId:'txZones',statusId:'txDragStatus',checkId:'txCheck',resetId:'txReset',items:TRANSPORT_DRUGS,categoryOf:x=>x.category,keyOf:x=>x.drug,labelOf:x=>x.drug,onGrade:()=>{state.boards++;save();}});
  $('txNext').addEventListener('click',next);
  for(const [id,value] of [['txQuizTab','quiz'],['txDragTab','drag'],['txTableTab','table']])$(id).addEventListener('click',()=>{
    tab=value;for(const panel of ['quiz','drag','table'])$('tx'+panel[0].toUpperCase()+panel.slice(1)+'Panel').hidden=tab!==panel;
    for(const [tabId,choice] of [['txQuizTab','quiz'],['txDragTab','drag'],['txTableTab','table']]){$(tabId).classList.toggle('active',tab===choice);$(tabId).setAttribute('aria-selected',String(tab===choice));}
    if(tab==='quiz'&&!current)next();if(tab==='drag')match.open();
  });
  document.addEventListener('keydown',e=>{if($('txView').hidden||tab!=='quiz'||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(/^[1-5]$/.test(e.key)){e.preventDefault();answer(Number(e.key)-1);}if(e.key==='Enter'&&answered){e.preventDefault();next();}});
  buildTable();stats();return{open(){if(tab==='quiz'&&!current)next();if(tab==='drag')match.open();}};
}
