// Teaching scope: 2026 CNS lectures 14–15. PDF page numbers include note pages.
export const CNS_AREAS={structure:'수용체 구조',effect:'흥분·억제',disease:'질환–약물',features:'약물 세부 특징'};
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
// Spread distractors across families before taking a second from the same family.
function contrast(pool,index){const ordered=[...pool.slice(index%pool.length),...pool.slice(0,index%pool.length)],out=[],families=new Set();for(const item of ordered)if(!families.has(item.family)){out.push(item);families.add(item.family);if(out.length===4)return out;}for(const item of ordered)if(!out.includes(item)){out.push(item);if(out.length===4)return out;}return out;}
const questions=[];
for(const [i,r] of RECEPTORS.entries()){
  for(const area of ['structure','effect']){
    const property=area==='structure'?'type':'effect',value=r[property];if(!value)continue;
    const wrong=contrast(RECEPTORS.filter(x=>x[property]&&x[property]!==value),i);
    const label=area==='structure'?structureLabel[value]:effectLabel[value];
    questions.push({id:`${area}-${r.id}`,area,subject:r.id,group:area+'-'+r.family,target:value,
      stem:area==='structure'?`다음 수용체 중 ${label}에 해당하는 것은?`:`다음 중 강의록 요약표에서 ${label}으로 분류된 수용체 또는 결합부위는?`,
      options:[r.name,...wrong.map(x=>x.name)],answer:r.name,note:r.why,source:r.source,
      details:[r,...wrong].map(x=>`${x.name}: ${area==='structure'?structureLabel[x.type]:effectLabel[x.effect]}. ${x.why}`)});
  }
}
for(const [i,d] of DRUGS.entries()){
  const category=d.categories[0];
  const wrong=contrast(DRUGS.filter(x=>!possibleUse(x,category)),i);
  questions.push({id:'disease-'+d.id,area:'disease',subject:d.id,group:'disease-'+d.family,
    stem:`다음 중 14–15강에서 '${category}' 용도로 제시된 약물은?`,options:[d.name,...wrong.map(x=>x.name)],answer:d.name,
    note:d.note,source:d.source,details:[d,...wrong].map(x=>`${x.name}: ${x.categories.join(' · ')}. ${MECHANISMS[x.mechanism]}.`)});
  // These two entries are administration-route classifications, not shared receptor mechanisms.
  const route=['iv','inhaled'].includes(d.mechanism);
  const alternatives=contrast(DRUGS.filter(x=>!hasMechanism(x,d.mechanism)&&(!route||['bzd','barbiturate','inhaled','iv'].includes(x.mechanism))),i);
  questions.push({id:'mechanism-'+d.id,area:'features',subject:d.id,group:'mechanism-'+d.family,
    stem:route?`강의록의 마취제 표에서 '${MECHANISMS[d.mechanism]}' 항목에 해당하는 약물은?`:`강의록에서 '${MECHANISMS[d.mechanism]}' ${d.mechanism==='tca'?'계열로':'기전으로'} 분류된 약물은?`,
    options:[d.name,...alternatives.map(x=>x.name)],answer:d.name,note:d.note,source:d.source,
    details:[d,...alternatives].map(x=>`${x.name}: ${MECHANISMS[x.mechanism]}. ${x.note}`)});
}
// Additional past-exam style comparisons. Each tuple contains one keyed statement and four parallel distractors.
function feature(id,subject,stem,answer,wrong,note,pdf,lecture=15){questions.push({id:'detail-'+id,area:'features',subject,group:'details-'+id.split('-')[0],stem,options:[answer,...wrong],answer,note,source:`${lecture}강 PDF ${pdf}쪽`});}
feature('synapse-amphetamine','amphetamine','14강의 약물 작용 단계 표에서 monoamine 유리 촉진 약물로 제시된 것은?','Amphetamine',['Cocaine','Donepezil','Carbidopa','Haloperidol'],'Amphetamine은 유리 촉진, cocaine은 재흡수 억제로 제시됩니다. Donepezil은 분해효소, carbidopa는 합성 단계, haloperidol은 수용체에 작용합니다.',18,14);
feature('synapse-cocaine','cocaine','14강의 약물 작용 단계 표에서 cocaine의 작용 단계는?','수송체를 통한 재흡수',['전구물질의 합성','소포 내 신경전달물질 저장','신경전달물질의 유리','분해효소에 의한 대사'],'강의록은 cocaine을 SERT·NET·DAT 수송체 재흡수 억제 단계에 배치합니다. Amphetamine의 유리 촉진 단계와 구별합니다.',18,14);
feature('ad-donepezil','donepezil','Donepezil의 작용기전으로 옳은 것은?','AChE를 억제하여 ACh 분해를 감소시킨다.',['AADC를 억제하여 DOPA 전환을 감소시킨다.','COMT를 억제하여 DOPA 대사를 감소시킨다.','D₂를 차단하여 도파민 작용을 감소시킨다.','NMDA를 차단하여 glutamate 작용을 감소시킨다.'],'Donepezil은 AChE 억제제입니다. 수용체 자체를 차단하는 약물이나 파킨슨병의 효소 억제제와 구별합니다.',8);
feature('ad-antibody','lecanemab','Lecanemab과 donanemab의 공통 표적으로 옳은 것은?','아밀로이드β',['아세틸콜린에스터레이스','도파민 D₂ 수용체','세로토닌 수송체','NMDA 수용체'],'두 약물은 강의록에 추가된 항아밀로이드β 항체입니다. Donepezil의 AChE, memantine의 NMDA 표적과 구별합니다.',8);
feature('pd-carbidopa','carbidopa','파킨슨병에서 levodopa와 함께 투여하는 carbidopa의 작용은?','말초 AADC 억제',['중추 MAO-B 억제','도파민 D₂ 차단','말초 COMT 억제','중추 AChE 억제'],'Carbidopa는 BBB를 통과하지 않는 말초 AADC 억제제입니다. Levodopa가 말초에서 dopamine으로 전환되는 것을 줄입니다.',14);
feature('pd-bbb','levodopa','도파민 대신 levodopa를 투여하는 이유로 옳은 것은?','Levodopa가 BBB를 통과하여 도파민으로 전환되기 때문이다.',['Levodopa가 말초에서 AADC를 직접 억제하기 때문이다.','Levodopa가 중추에서 D₂ 수용체를 차단하기 때문이다.','Levodopa가 중추에서 AChE를 직접 억제하기 때문이다.','Levodopa가 말초에서 COMT를 직접 억제하기 때문이다.'],'Dopamine 자체는 BBB를 통과하지 못하지만 전구물질 levodopa는 LAT1을 통해 통과합니다.',14);
feature('pd-longterm','levodopa','Levodopa 장기 투여와 연결되는 특징은?','운동 변동과 이상운동증',['구강건조와 시력흐림','선행성 기억상실과 최면','복합수면행동과 졸림','QRS 연장과 심독성'],'강의록에서 levodopa 장기 투여의 motor fluctuation·dyskinesia를 강조합니다. 다른 선지는 각각 TCA·midazolam·zolpidem 등의 특징입니다.',14);
feature('pd-amantadine','amantadine','항바이러스제로 개발되었고 levodopa 유발 dyskinesia 완화에 사용하는 약물은?','Amantadine',['Carbidopa','Selegiline','Entacapone','Bromocriptine'],'Amantadine은 NMDA 수용체 차단 등의 기전을 갖습니다. 나머지는 각각 AADC·MAO-B·COMT 억제 또는 dopamine 수용체 효능제입니다.',14);
feature('pd-comt','entacapone','약물–표적의 연결로 옳은 것은?','Entacapone — COMT',['Carbidopa — MAO-B','Selegiline — AADC','Rasagiline — COMT','Bromocriptine — AChE'],'Entacapone·tolcapone은 COMT 억제제, selegiline·rasagiline은 MAO-B 억제제입니다. Carbidopa는 말초 AADC를 억제합니다.',14);
feature('bzd-frequency','diazepam','BZD와 barbiturate의 Cl⁻ 통로 조절 차이로 옳은 것은?','BZD는 개방 빈도, barbiturate는 개방 시간을 증가시킨다.',['BZD는 개방 시간, barbiturate는 개방 빈도를 증가시킨다.','BZD는 개방 빈도, barbiturate는 개방 시간을 감소시킨다.','BZD는 개방 시간, barbiturate는 개방 빈도를 감소시킨다.','BZD는 개방 빈도, barbiturate는 개방 시간에 영향이 없다.'],'둘 다 GABA_A 작용을 증강하지만 BZD는 빈도, barbiturate는 시간을 증가시킵니다. BZD는 GABA 자체의 결합부위와 다른 부위에 작용합니다.','17·19');
feature('bzd-flumazenil','flumazenil','BZD 과용량에 대응하는 결합부위 길항제는?','Flumazenil',['Naloxone','Buspirone','Zolpidem','Memantine'],'Flumazenil은 BZD 결합부위 길항제입니다. Naloxone은 아편수용체 길항제이며, buspirone은 5-HT₁A 부분효능제입니다.',18);
feature('bzd-midazolam','midazolam','검사 전처치에서 선행성 기억상실을 이용하는 BZD는?','Midazolam',['Buspirone','Flumazenil','Memantine','Ethosuximide'],'Midazolam은 진정·최면과 선행성 기억상실을 이용합니다. Flumazenil은 BZD 작용을 증강하는 약물이 아니라 길항제입니다.',18);
feature('bzd-sleep','triazolam','BZD 수면제의 용도 연결로 강의록 필기와 일치하는 것은?','Flurazepam — 숙면 / Triazolam — 입면',['Flurazepam — 입면 / Triazolam — 숙면','Flumazenil — 숙면 / Buspirone — 입면','Midazolam — 입면 / Flumazenil — 숙면','Buspirone — 숙면 / Midazolam — 입면'],'강의록 필기는 flurazepam을 숙면, triazolam을 입면과 연결합니다. Flumazenil은 BZD 길항제이고 buspirone은 수면 작용이 없는 항불안제입니다.',18);
feature('bzd-buspirone','buspirone','Buspirone에 대한 설명으로 옳은 것은?','5-HT₁A 부분효능으로 항불안 작용을 나타낸다.',['GABA_A 길항으로 항경련 작용을 나타낸다.','D₂ 길항으로 수면 유도 작용을 나타낸다.','NMDA 효능으로 근이완 작용을 나타낸다.','AChE 억제로 마취 유도 작용을 나타낸다.'],'Buspirone은 5-HT₁A 부분효능제입니다. BZD와 비교할 만한 항불안 효과가 있으나 수면·항경련·근이완 작용은 없습니다.',21);
feature('bzd-zolpidem','zolpidem','Zolpidem의 특징으로 옳은 것은?','GABA_A에 작용하며 복합수면행동에 주의한다.',['GABA_B에 작용하며 ACh 분해를 억제한다.','5-HT₁A에 작용하며 항경련 효과가 강하다.','NMDA에 작용하며 도파민 합성을 늘린다.','D₂에 작용하며 BZD 결합을 길항한다.'],'Zolpidem은 BZD와 같은 결합부위에 작용하는 Z-drug입니다. 복합수면행동·다음날 졸림과 항경련·근이완 작용이 없다는 점을 구별합니다.',21);
feature('anesthesia-thiopental','thiopental','Thiopental 투여 후 빠른 각성의 주된 설명으로 강의록에 제시된 것은?','약물의 재분포',['약물의 장간순환','약물의 소변 산성화','약물의 대사효소 유도','약물의 수용체 발현 증가'],'Thiopental은 30초 내 작용하고 재분포로 5–10분 후 각성하는 초단시간 barbiturate로 제시됩니다. 이 각성을 전량 배설이나 빠른 효소 유도로 설명하지 않습니다.',20);
feature('anesthesia-long','phenobarbital','장시간 지속 barbiturate로 경련 억제에 사용하는 약물은?','Phenobarbital',['Thiopental','Methohexital','Midazolam','Zolpidem'],'Phenobarbital은 장시간 지속 barbiturate입니다. Thiopental과 methohexital은 정맥마취 유도용 목록이며 midazolam은 BZD, zolpidem은 Z-drug입니다.','20·22');
feature('depression-selective','fluoxetine','세로토닌 재흡수에 대한 선택성이 높은 SSRI는?','Fluoxetine',['Duloxetine','Imipramine','Clomipramine','Buspirone'],'족보의 선택성 비교 형태입니다. Fluoxetine은 SSRI, duloxetine은 SNRI, imipramine·clomipramine은 TCA, buspirone은 5-HT₁A 부분효능제입니다.',24);
feature('depression-snri','venlafaxine','Duloxetine과 venlafaxine의 공통 계열은?','SNRI',['SSRI','TCA','BZD','Barbiturate'],'두 약물은 serotonin과 norepinephrine 재흡수를 함께 억제하는 SNRI입니다. 세로토닌 선택적 SSRI와 구별합니다.',24);
feature('depression-muscarinic','amitriptyline','TCA의 구강건조·시력흐림·변비와 연결되는 작용은?','무스카린 수용체 차단',['히스타민 수용체 차단','α 아드레날린 수용체 차단','NMDA 수용체 차단','도파민 D₂ 수용체 차단'],'TCA의 항무스카린 작용은 구강건조·시력흐림·변비와 연결됩니다. 히스타민 차단은 진정, α 차단은 체위성 저혈압과 연결합니다.',25);
feature('depression-alpha','imipramine','TCA의 체위성 저혈압과 연결되는 작용은?','α 아드레날린 수용체 차단',['무스카린 수용체 차단','히스타민 수용체 차단','GABA_A 수용체 조절','5-HT₁A 수용체 부분효능'],'강의록은 TCA의 α 아드레날린 수용체 차단을 체위성 저혈압과 연결합니다. 다른 수용체 차단에 의한 부작용과 나누어 기억합니다.',25);
feature('depression-histamine','doxepin','TCA의 히스타민 수용체 차단과 연결되는 부작용은?','진정작용',['구강건조','체위성 저혈압','시력흐림','변비'],'강의록 표에서 히스타민 차단은 진정, 무스카린 차단은 구강건조·시력흐림·변비, α 차단은 체위성 저혈압과 연결됩니다.',25);
feature('depression-overdose','amitriptyline','TCA 과량 투여의 심독성과 연결되는 소견은?','QRS 연장',['축동','복합수면행동','이상운동증','선행성 기억상실'],'강의록에서 TCA 과량 시 심독성(QRS 연장)을 제시합니다. 나머지는 아편유사제·zolpidem·levodopa·midazolam과 연결되는 특징입니다.',25);
feature('depression-adverse','fluoxetine','SSRI·SNRI의 부작용으로 강의록에 묶여 제시된 것은?','오심 · 수면장애 · 성기능 부전',['축동 · 호흡억제 · 위장관 운동 감소','구강건조 · 시력흐림 · 변비','운동 변동 · 이상운동증 · 효과 감소','진정 · 체위성 저혈압 · QRS 연장'],'강의록은 SSRI·SNRI의 오심·수면장애·성기능 부전을 제시합니다. TCA의 광범위한 수용체 차단 부작용이 적다는 것이 모든 부작용이 없다는 뜻은 아닙니다.',25);
feature('psychosis-aripiprazole','aripiprazole','비정형 항정신병제 중 D₂ 부분효능제로 별도 표시된 약물은?','Aripiprazole',['Clozapine','Olanzapine','Risperidone','Quetiapine'],'Aripiprazole은 강의록에서 D₂ 부분효능제로 별표 표시됩니다. 같은 표에 있다고 모두 D₂ 길항제로만 묶으면 안 됩니다.',28);
feature('psychosis-haloperidol','haloperidol','Haloperidol의 대표 표적으로 옳은 것은?','도파민 D₂ 수용체',['세로토닌 수송체','NMDA 수용체','Acetylcholinesterase','말초 AADC'],'Haloperidol은 정형 항정신병제이며 D₂ 길항제입니다. 파킨슨병의 도파민 신호 증강 전략과 작용 방향을 구별합니다.',28);
feature('epilepsy-absence','ethosuximide','아이가 대화 중 약 10초간 멍하니 있다가 눈을 깜빡이고 바로 회복한다. 소발작을 겨냥하는 약물은?','Ethosuximide',['Phenytoin','Gabapentin','Carbamazepine','Thiopental'],'족보의 소발작 사례 형태입니다. Ethosuximide는 T형 Ca²⁺ 통로 억제제이며, 강의록 소발작 1차 목록에는 valproic acid도 포함됩니다.','31–32');
feature('epilepsy-ttype','ethosuximide','Ethosuximide가 억제하는 대표 통로는?','T형 Ca²⁺ 통로',['전압개폐 Na⁺ 통로','고전압활성 Ca²⁺ 통로','GABA_A의 Cl⁻ 통로','Nicotinic의 양이온 통로'],'Ethosuximide는 저전압활성 T형 Ca²⁺ 통로를 억제합니다. Gabapentin의 HVA 계열이나 Na⁺ 차단제와 구별합니다.',31);
feature('epilepsy-dual','valproicacid','강의록에서 Na⁺ 통로와 T형 Ca²⁺ 통로 차단 양쪽에 포함된 약물 조합은?','Valproic acid — Zonisamide',['Carbamazepine — Phenytoin','Ethosuximide — Gabapentin','Felbamate — Lamotrigine','Clonazepam — Phenobarbital'],'Valproic acid와 zonisamide는 Na⁺·T형 Ca²⁺ 양쪽에 표시됩니다. Carbamazepine·phenytoin은 Na⁺, ethosuximide는 T형, gabapentin은 HVA로 분류합니다.',31);
feature('epilepsy-gabapentin','gabapentin','Gabapentin의 강의록상 표적 분류로 옳은 것은?','고전압활성 Ca²⁺ 통로',['GABA_A 수용체','GABA_B 수용체','NMDA 수용체','T형 Ca²⁺ 통로'],'이름에 GABA가 들어가지만 강의록의 gabapentin은 HVA Ca²⁺ 통로 계열입니다. GABA_A 조절제나 ethosuximide의 T형 통로와 구별합니다.',31);
feature('epilepsy-felbamate','felbamate','항뇌전증제 중 glutamate NMDA 수용체를 억제하는 약물은?','Felbamate',['Gabapentin','Ethosuximide','Phenytoin','Phenobarbital'],'Felbamate는 강의록의 NMDA 억제 항뇌전증제입니다. Memantine도 NMDA 차단제이지만 이 강의에서는 알츠하이머병 약물로 제시됩니다.',31);
feature('epilepsy-focal','carbamazepine','강의록에서 초점발작 1차 약물로 제시된 조합은?','Carbamazepine — Phenytoin',['Ethosuximide — Gabapentin','Felbamate — Phenobarbital','Zonisamide — Clonazepam','Memantine — Donepezil'],'초점발작 1차에는 carbamazepine·phenytoin·lamotrigine·valproic acid가 제시됩니다. Gabapentin·felbamate·phenobarbital·zonisamide는 표의 2차 목록입니다.',32);
feature('epilepsy-absence-first','ethosuximide','강의록에서 소발작 1차 약물로 제시된 조합은?','Ethosuximide — Valproic acid',['Phenytoin — Carbamazepine','Gabapentin — Felbamate','Phenobarbital — Zonisamide','Lamotrigine — Clonazepam'],'소발작 1차는 ethosuximide·valproic acid입니다. Lamotrigine·clonazepam은 이 표의 소발작 2차 목록입니다.',32);
feature('opioid-effects','morphine','Morphine의 효과·부작용 조합으로 옳은 것은?','호흡억제 · 축동 · 위장관 운동 감소',['호흡촉진 · 축동 · 위장관 운동 증가','호흡억제 · 산동 · 위장관 운동 증가','호흡촉진 · 산동 · 위장관 운동 감소','호흡억제 · 산동 · 위장관 운동 감소'],'Morphine은 호흡중추의 CO₂ 감수성을 낮추며 축동과 위장관 운동 감소를 유발합니다. 진통 효과와 함께 묶어 기억합니다.',33);
feature('opioid-naloxone','naloxone','Morphine 과용량에 의한 호흡억제와 연결되는 길항제는?','Naloxone',['Flumazenil','Memantine','Buspirone','Carbidopa'],'Naloxone은 아편수용체 길항제입니다. Flumazenil은 BZD 결합부위 길항제이므로 표적을 구별합니다.',33);
feature('opioid-antagonist','naltrexone','아편수용체 길항제로만 구성된 조합은?','Naloxone — Naltrexone',['Morphine — Naloxone','Fentanyl — Morphine','Buspirone — Flumazenil','Memantine — Ketamine'],'강의록은 naloxone·naltrexone·nalmefene을 아편수용체 길항제로 제시합니다. Morphine은 아편수용체 효능제입니다.',33);
feature('pd-exception','donepezil','다음 중 강의록의 파킨슨병 치료약물 목록에 포함되지 않는 것은?','Donepezil',['Levodopa','Carbidopa','Selegiline','Entacapone'],'Donepezil은 알츠하이머병의 AChE 억제제입니다. 나머지는 파킨슨병에서 전구물질 공급이나 대사 조절에 사용하는 약물입니다.','8·14');
feature('bzd-exception','buspirone','다음 중 BZD 계열에 속하지 않는 것은?','Buspirone',['Diazepam','Midazolam','Lorazepam','Alprazolam'],'Buspirone은 5-HT₁A 부분효능제입니다. 나머지는 BZD 계열이며 GABA_A의 BZD 결합부위에 작용합니다.','18·21');
feature('depression-exception','duloxetine','다음 중 SSRI로 분류되지 않는 것은?','Duloxetine',['Fluoxetine','Sertraline','Paroxetine','Citalopram'],'Duloxetine은 SNRI이며 5-HT·NE 재흡수를 함께 억제합니다. 나머지 네 약물은 강의록의 SSRI 목록입니다.',24);
feature('anesthesia-exception','propofol','다음 중 강의록의 흡입마취제에 포함되지 않는 것은?','Propofol',['Sevoflurane','Isoflurane','Desflurane','N₂O'],'Propofol은 정맥마취제로 제시됩니다. 나머지는 강의록의 흡입마취제 목록에 해당합니다.',22);
feature('epilepsy-exception','carbamazepine','다음 중 강의록 표의 소발작 1차·2차 약물 목록에 포함되지 않는 것은?','Carbamazepine',['Ethosuximide','Valproic acid','Lamotrigine','Clonazepam'],'강의록 소발작 표의 1차는 ethosuximide·valproic acid, 2차는 lamotrigine·clonazepam입니다. Carbamazepine은 초점발작 1차로 제시됩니다.',32);
export const CNS_QUESTIONS=questions;

export function pickCnsQuestion(state,area='all',random=Math.random){
  const bank=CNS_QUESTIONS.filter(q=>area==='all'||q.area===area);
  const recent=state.recent||[],subjects=state.recentSubjects||[],seen=state.seen||{};
  let pool=bank.filter(q=>!recent.includes(q.id)&&!subjects.includes(q.subject)&&q.subject!==state.lastSubject&&q.group!==state.lastGroup);
  if(!pool.length)pool=bank.filter(q=>!recent.includes(q.id)&&q.subject!==state.lastSubject);
  if(!pool.length)pool=bank.filter(q=>!recent.includes(q.id));
  if(!pool.length)pool=bank;
  const min=Math.min(...pool.map(q=>seen[q.id]||0));
  const eligible=pool.filter(q=>(seen[q.id]||0)===min),q=eligible[Math.floor(random()*eligible.length)];
  const choices=shuffle(q.options,random).map(text=>({text}));
  return {...q,choices,answerIndex:choices.findIndex(x=>x.text===q.answer)};
}
