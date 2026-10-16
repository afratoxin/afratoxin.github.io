import {CNS_CLINICAL} from './cns-clinical-data.mjs?v=20261017-clinical1';
import {CNS_DRUG_PRIORITY,cnsPriority} from './cns-priority.mjs?v=20261017-exam2';
import {clinicalQuestionPool} from './clinical-mix.mjs?v=20261017-clinical1';
import {buildCnsPairQuestions} from './cns-pair-builder.mjs?v=20261017-exam2';
// Teaching scope: 2026 CNS lectures 14–15. PDF page numbers include note pages.
export const CNS_AREAS={structure:'수용체 구조',effect:'흥분·억제',disease:'질환–약물',features:'약물 세부 특징',clinical:'임상 상황 → 약물'};
const structureLabel={ionotropic:'Ionotropic · 리간드개폐 이온통로',metabotropic:'Metabotropic · GPCR'};
const effectLabel={excitatory:'흥분성',inhibitory:'억제성'};
const receptor=(id,name,family,type,effect,why)=>({id,name,family,type,effect,why,source:'14강 PDF 15–17·19·22·27·31·36·39·49쪽'});
export const RECEPTORS=[
  receptor('nicotinic','Nicotinic 수용체','아세틸콜린','ionotropic','excitatory','니코틴성 수용체는 양이온 통로입니다. 무스카린성 수용체는 GPCR입니다.'),
  ...[1,2,3,4,5].map(i=>receptor('m'+i,'Muscarinic M'+i,'아세틸콜린','metabotropic',[1,3,5].includes(i)?'excitatory':'inhibitory','M₁·M₃·M₅는 Gq 계열의 흥분성, M₂·M₄는 Gi 계열의 억제성으로 분류합니다.')),
  receptor('gabaa','GABA_A 수용체','GABA·Glycine','ionotropic','inhibitory','GABA_A는 Cl⁻ 통로입니다. GABA_B와 구조는 다르지만 둘 다 억제성입니다.'),
  receptor('gabab','GABA_B 수용체','GABA·Glycine','metabotropic','inhibitory','GABA_B는 Gi/o 결합 GPCR입니다. GABA_A의 리간드개폐 Cl⁻ 통로와 구별합니다.'),
  receptor('glyr','Glycine 수용체 · strychnine-sensitive','GABA·Glycine','ionotropic','inhibitory','Strychnine-sensitive glycine 수용체는 억제성 이온통로입니다. NMDA의 glycine 결합부위는 흥분성 신호를 돕습니다.'),
  ...[['nmda','NMDA'],['ampa','AMPA'],['kainate','Kainate']].map(([id,name])=>receptor(id,name+' 수용체','Glutamate','ionotropic','excitatory','NMDA·AMPA·kainate는 이온통로형 glutamate 수용체이며 강의록에서 흥분성으로 분류합니다.')),
  ...[1,2,3,4,5,6,7,8].map(i=>receptor('mglu'+i,'mGlu'+i+' 수용체','Glutamate','metabotropic',[1,5].includes(i)?'excitatory':'inhibitory','mGlu는 모두 GPCR입니다. mGlu₁·mGlu₅는 흥분성, mGlu₂·₃·₄·₆·₇·₈은 억제성입니다.')),
  ...[1,2,3,4,5].map(i=>receptor('d'+i,'Dopamine D'+i,'모노아민','metabotropic',[1,5].includes(i)?'excitatory':'inhibitory','도파민 수용체는 모두 GPCR입니다. D₁·D₅는 Gs–cAMP 증가, D₂·D₃·D₄는 Gi–cAMP 감소로 연결합니다.')),
  ...[['alpha1','α₁','excitatory'],['alpha2','α₂','inhibitory'],['beta1','β₁','excitatory'],['beta2','β₂','excitatory']].map(([id,name,effect])=>receptor(id,'Adrenergic '+name,'모노아민','metabotropic',effect,'아드레날린성 수용체는 GPCR입니다. 강의록의 신경전달물질 표에서는 α₁·β₁·β₂를 흥분성, α₂를 억제성으로 분류합니다.')),
  ...[1,2,3,4,5,6,7].map(i=>receptor('5ht'+i,'5-HT'+i+' 수용체','모노아민',i===3?'ionotropic':'metabotropic',[1,5].includes(i)?'inhibitory':'excitatory','5-HT₃만 양이온 통로이며 나머지는 GPCR입니다. 강의록 표에서 5-HT₁·5-HT₅는 억제성, 5-HT₂·₃·₄·₆·₇은 흥분성입니다.')),
  ...[1,2,3].map(i=>receptor('h'+i,'Histamine H'+i,'모노아민','metabotropic',i===3?'inhibitory':'excitatory','히스타민 수용체는 GPCR입니다. 강의록 표의 H₁·H₂는 흥분성, H₃는 억제성입니다.')),
  ...[['mu','μ'],['delta','δ'],['kappa','κ']].map(([id,name])=>receptor(id,'Opioid '+name,'펩타이드','metabotropic','inhibitory','아편유사펩타이드 수용체 μ·δ·κ는 GPCR이며 강의록에서 억제성으로 분류합니다.')),
  ...[1,2,3].map(i=>receptor('nk'+i,'Tachykinin NK'+i,'펩타이드','metabotropic','excitatory','Tachykinin의 NK₁·NK₂·NK₃ 수용체는 GPCR이며 강의록에서 흥분성으로 분류합니다.')),
  receptor('nmda-glycine','NMDA 수용체의 glycine 결합부위','GABA·Glycine',null,'excitatory','Glycine은 이 부위에서 NMDA 수용체의 공동작용제로 작용합니다. 별개의 glycine GPCR이 아니며, 억제성 glycine 수용체와 구별합니다.')
];

export const MECHANISMS={
  ache:'Acetylcholinesterase 억제',nmda:'NMDA 수용체 차단',amyloid:'아밀로이드β 표적 항체',precursor:'도파민 전구물질 공급',aadc:'말초 AADC 억제',maob:'MAO-B 억제',comt:'COMT 억제',da:'파킨슨병 치료용 도파민 수용체 효능제',bzd:'BZD 계열 · Cl⁻ 통로 개방 빈도 증가',flumazenil:'GABA_A의 BZD 결합부위 길항',barbiturate:'GABA_A 조절 · Cl⁻ 통로 개방 시간 증가',buspirone:'5-HT₁A 수용체 부분효능',zolpidem:'Z-drug 계열 · GABA_A의 BZD 결합부위 조절',iv:'강의록의 기타 정맥마취제',inhaled:'강의록의 흡입마취제',ssri:'SSRI 계열 · 세로토닌 선택적 재흡수 억제',snri:'SNRI 계열 · 세로토닌·노르에피네프린 재흡수 억제',tca:'TCA 계열 · 모노아민 재흡수 억제',d2:'D₂ 수용체 길항',atypical:'5-HT₂A 및 D₂ 수용체 길항',aripiprazole:'D₂ 부분효능 · 5-HT₂A 길항',na:'전압개폐 Na⁺ 통로 차단',dual:'Na⁺ 및 T형 Ca²⁺ 통로 차단',hva:'고전압활성 Ca²⁺ 통로 조절',ttype:'T형 Ca²⁺ 통로 차단',sv2a:'시냅스 소포 단백질 SV2A 결합',opioid:'아편수용체 효능',antagonist:'아편수용체 길항'
};
const drugs=[];
function add(names,family,categories,mechanism,pdf,slide,note){
  for(const name of names.split('|'))drugs.push({id:name.toLowerCase().replace(/[^a-z0-9]/g,''),name,family,categories:[...categories],mechanism,source:`15강 PDF ${pdf}쪽 · 슬라이드 ${slide}쪽`,note});
}
add('Donepezil|Galantamine|Rivastigmine','알츠하이머병',['알츠하이머병'],'ache',8,6,'AChE를 억제하여 아세틸콜린 분해를 줄이고 콜린성 신경전달을 개선합니다. 수용체 길항제가 아닙니다.');
add('Memantine','알츠하이머병',['알츠하이머병'],'nmda',8,6,'NMDA 수용체를 차단하여 과도한 glutamate 흥분에 의한 신경독성을 줄이는 전략입니다.');
add('Lecanemab|Donanemab','알츠하이머병',['알츠하이머병'],'amyloid',8,6,'강의록에 추가된 항아밀로이드β 항체입니다. AChE 억제제나 NMDA 차단제와 표적을 구별합니다.');
add('Levodopa','파킨슨병',['파킨슨병'],'precursor',14,10,'LAT1을 통해 BBB를 통과하는 도파민 전구물질입니다. 도파민 자체는 BBB를 통과하지 못합니다.');
add('Carbidopa','파킨슨병',['파킨슨병'],'aadc',14,10,'BBB를 통과하지 않고 말초 AADC를 억제합니다. Levodopa의 말초 전환을 줄여 중추 도달을 돕습니다.');
add('Selegiline|Rasagiline','파킨슨병',['파킨슨병'],'maob',14,10,'MAO-B를 억제하여 도파민 대사를 감소시킵니다. COMT 억제제와 구별합니다.');
add('Entacapone|Tolcapone','파킨슨병',['파킨슨병'],'comt',14,10,'COMT를 억제하여 levodopa 대사를 줄이는 약물입니다. AADC 억제제인 carbidopa와 구별합니다.');
add('Bromocriptine|Pramipexole|Ropinirole|Rotigotine','파킨슨병',['파킨슨병'],'da',14,10,'도파민 수용체에 직접 효능제로 작용합니다. 전구물질 공급이나 분해효소 억제와 구별합니다.');
add('Amantadine','파킨슨병',['파킨슨병'],'nmda',14,10,'항바이러스제로 개발되었으며 NMDA 수용체 차단 등의 작용으로 levodopa 유발 dyskinesia 완화에 사용됩니다.');
add('Alprazolam','불안·수면',['불안 완화'],'bzd',18,13,'BZD 계열 항불안제입니다. GABA_A의 BZD 부위에 결합하여 GABA 작용을 증강합니다.');
add('Diazepam|Clonazepam|Lorazepam','불안·수면',['불안 완화','뇌전증'],'bzd',18,13,'강의록에서 불안 완화와 항경련 용도가 모두 제시된 BZD입니다. Cl⁻ 통로 개방 빈도를 증가시킵니다.');
add('Flurazepam|Temazepam|Triazolam','불안·수면',['수면장애·진정'],'bzd',18,13,'강의록의 BZD 수면장애 치료제입니다. Flurazepam은 숙면, triazolam은 입면 용도로 제시됩니다.');
add('Midazolam','마취',['마취'],'bzd',18,13,'BZD 계열의 진정·최면 및 마취 유도 약물입니다. 선행성 기억상실을 이용한 검사 전처치에도 사용됩니다.');
add('Flumazenil','불안·수면',['BZD 과용량 대응'],'flumazenil',18,13,'BZD 결합부위 길항제입니다. 아편수용체 길항제인 naloxone과 구별합니다.');
add('Thiopental|Methohexital','마취',['마취'],'barbiturate','20·22','15·17','강의록에서 정맥마취 유도용 barbiturate로 분류합니다. BZD와 달리 Cl⁻ 통로 개방 시간을 늘립니다.');
add('Pentobarbital|Secobarbital|Amobarbital','불안·수면',['수면장애·진정','뇌전증'],'barbiturate',20,15,'단시간 지속 barbiturate로 진정과 긴급 발작 등에 제한적으로 사용되는 것으로 제시됩니다.');
add('Phenobarbital','뇌전증',['뇌전증'],'barbiturate',20,15,'장시간 지속 barbiturate로 경련 억제에 사용됩니다. GABA_A 조절을 통한 개방 시간 증가를 연결합니다.');
add('Buspirone','불안·수면',['불안 완화'],'buspirone',21,16,'5-HT₁A 부분효능제입니다. 항불안 효과는 있으나 BZD의 수면·항경련·근이완 작용은 없습니다.');
add('Zolpidem','불안·수면',['수면장애·진정'],'zolpidem',21,16,'Z-drug이며 GABA_A의 BZD 결합부위에 작용합니다. 복합수면행동과 다음날 졸림에 주의하며 항경련·근이완 용도와 구별합니다.');
add('Fentanyl|Ketamine|Propofol','마취',['마취'],'iv',22,17,'강의록의 기타 정맥마취제 항목입니다. 정맥·흡입 분류를 묻는 데 사용하며, 세 약물의 분자 표적이 같다는 뜻은 아닙니다.');
add('Sevoflurane|Isoflurane|Enflurane|Desflurane|Halothane|N₂O','마취',['마취'],'inhaled',22,17,'강의록에서 마취 유지에 사용하는 흡입마취제 항목으로 분류합니다. 정맥마취제 목록과 구별합니다.');
add('Fluoxetine|Fluvoxamine|Paroxetine|Sertraline|Citalopram','우울증',['우울증'],'ssri',24,19,'SSRI입니다. SERT를 통한 세로토닌 재흡수를 선택적으로 억제하며 SNRI·TCA와 구별합니다.');
add('Duloxetine|Venlafaxine','우울증',['우울증'],'snri',24,19,'SNRI입니다. 세로토닌과 노르에피네프린 재흡수를 함께 억제합니다.');
add('Imipramine|Amitriptyline|Clomipramine|Trimipramine|Doxepin|Desipramine|Nortriptyline','우울증',['우울증'],'tca',25,20,'TCA로 분류합니다. 무스카린·α 아드레날린·히스타민 수용체 차단 관련 부작용과 과량 시 심독성도 연결합니다.');
add('Haloperidol|Pimozide|Thiothixene|Fluphenazine|Chlorpromazine|Prochlorperazine|Thioridazine','조현병',['조현병'],'d2',28,22,'강의록의 1세대 정형 항정신병제입니다. D₂ 수용체 길항 작용으로 분류합니다.');
add('Clozapine|Olanzapine|Quetiapine|Ziprasidone|Risperidone|Paliperidone','조현병',['조현병'],'atypical',28,22,'강의록의 2세대 비정형 항정신병제로, 5-HT₂A와 D₂ 수용체 차단을 연결합니다.');
add('Aripiprazole','조현병',['조현병'],'aripiprazole',28,22,'강의록에서 별표로 표시한 D₂ 부분효능제입니다. D₂ 길항제로만 암기하지 않도록 구별합니다.');
add('Carbamazepine|Lamotrigine|Phenytoin','뇌전증',['뇌전증'],'na','31–32','25–26','강의록의 Na⁺ 통로 차단 항뇌전증제입니다. 발작 유형별 1차·2차 약물 목록도 함께 확인합니다.');
add('Valproic acid|Zonisamide','뇌전증',['뇌전증'],'dual',31,25,'강의록에서 Na⁺ 통로 차단과 저전압활성 T형 Ca²⁺ 통로 차단 양쪽에 제시됩니다.');
add('Gabapentin','뇌전증',['뇌전증'],'hva',31,25,'강의록의 HVA Ca²⁺ 통로 차단 계열입니다. GABA_A 수용체 조절 약물로 분류하지 않습니다.');
add('Ethosuximide','뇌전증',['뇌전증'],'ttype','31–32','25–26','T형 Ca²⁺ 통로를 억제하며 소발작(absence seizure) 치료와 연결합니다.');
add('Felbamate','뇌전증',['뇌전증'],'nmda',31,25,'강의록의 NMDA 수용체 억제 항뇌전증제입니다. 소발작 1차 약물은 ethosuximide·valproic acid로 제시됩니다.');
drugs.push({id:'levetiracetam',name:'Levetiracetam',family:'뇌전증',categories:['뇌전증'],mechanism:'sv2a',source:'14강 PDF 18쪽 · 슬라이드 17쪽',note:'14강의 신경전달 유리 단계 표에서 SV2A 결합 약물로 제시됩니다. 15강 요약의 SV2A 기전과 연결합니다.'});
add('Morphine','아편유사제',['통증 완화'],'opioid',33,27,'아편수용체 효능제입니다. 진통과 함께 호흡억제·축동·위장관 운동 감소를 연결합니다.');
add('Naloxone','아편유사제',['아편수용체 길항','아편 과용량 대응'],'antagonist',33,27,'아편수용체 길항제입니다. Morphine 등의 아편 과용량에 의한 호흡억제에 대응하는 약물로 제시됩니다.');
add('Naltrexone|Nalmefene','아편유사제',['아편수용체 길항'],'antagonist',33,27,'강의록의 아편수용체 길항제 목록입니다. 이 퀴즈에서는 수용체 길항 분류를 확인합니다.');
export const DRUGS=drugs;
// Use all relevant mechanisms to exclude overlapping distractors, even when a drug is
// placed under a different heading in the slide (e.g. ketamine under IV anesthesia).
export function hasMechanism(drug,key){
  if(drug.mechanism===key)return true;
  if(drug.mechanism==='dual'&&['na','ttype'].includes(key))return true;
  if(drug.mechanism==='atypical'&&key==='d2')return true;
  if(drug.id==='ketamine'&&key==='nmda')return true;
  if(drug.id==='fentanyl'&&key==='opioid')return true;
  if(drug.id==='aripiprazole'&&key==='buspirone')return true;
  return false;
}
function possibleUse(drug,category){
  if(drug.categories.includes(category))return true;
  // Do not use genuine additional indications as false alternatives to a broad stem.
  if(category==='통증 완화'&&['fentanyl','gabapentin','ketamine'].includes(drug.id))return true;
  if(category==='뇌전증'&&drug.id==='midazolam')return true;
  return false;
}

export const CNS_MATCH={
  structure:RECEPTORS.filter(r=>r.type).map(r=>({...r,categories:[structureLabel[r.type]]})),
  effect:RECEPTORS.map(r=>({...r,categories:[effectLabel[r.effect]]})),
  disease:DRUGS
};

export function shuffle(items,random=Math.random){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
export const CNS_PAIR_QUESTIONS=buildCnsPairQuestions({RECEPTORS,DRUGS,hasMechanism,possibleUse}).map(q=>({...q,format:'judgment'}));
export const CNS_QUESTIONS=[...CNS_PAIR_QUESTIONS,...CNS_CLINICAL.map(q=>({...q,priority:cnsPriority(q.subject),prioritySources:CNS_DRUG_PRIORITY[q.subject]}))];

export function cnsQuestionBank(area='all',focus='all'){
  return CNS_QUESTIONS.filter(q=>(area==='all'||(area==='judgment'?q.format!=='clinical':q.area===area))&&(
    focus==='all'||['structure','effect'].includes(area)||
    (focus==='structures'?q.priority==='structure-drug':['structure-drug','emphasized-drug'].includes(q.priority))
  ));
}
export function pickCnsQuestion(state,area='all',random=Math.random,focus='all'){
  const bank=clinicalQuestionPool(cnsQuestionBank(area,focus),state,area==='clinical'?'clinical':area==='all'?'mixed':'ordinary');
  const recent=state.recent||[],subjects=state.recentSubjects||[],seen=state.seen||{};
  let pool=bank.filter(q=>!recent.includes(q.id)&&!subjects.includes(q.subject)&&q.subject!==state.lastSubject&&q.group!==state.lastGroup);
  if(!pool.length)pool=bank.filter(q=>!recent.includes(q.id)&&q.subject!==state.lastSubject);
  if(!pool.length)pool=bank.filter(q=>!recent.includes(q.id));
  if(!pool.length)pool=bank;
  const score=q=>(seen[q.id]||0)/(focus==='core'&&q.priority==='structure-drug'?2:1);
  const min=Math.min(...pool.map(score));
  const eligible=pool.filter(q=>score(q)===min),q=eligible[Math.floor(random()*eligible.length)];
  const choices=shuffle(q.options,random).map(text=>({text}));
  return {...q,choices,answerIndex:choices.findIndex(x=>x.text===q.answer)};
}
