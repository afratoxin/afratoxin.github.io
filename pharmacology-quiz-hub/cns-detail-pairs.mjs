// Lecture-scoped factual pairs for the 41 approved CNS detail concepts.
// right is true; wrong is false for the stated entity/action. Question assembly lives in cns-data.mjs.
export const CNS_DETAIL_PAIRS = [
  {
    "id": "detail-synapse-amphetamine",
    "subject": "amphetamine",
    "left": "Amphetamine",
    "right": "모노아민 유리 촉진",
    "wrong": "모노아민 유리 억제",
    "source": "14강 PDF 18쪽",
    "note": "Amphetamine은 모노아민 유리를 촉진합니다. Cocaine은 SERT·NET·DAT를 통한 모노아민 재흡수를 억제합니다.",
    "family": "시냅스 작용 단계"
  },
  {
    "id": "detail-synapse-cocaine",
    "subject": "cocaine",
    "left": "Cocaine",
    "right": "SERT·NET·DAT 재흡수 억제",
    "wrong": "SERT·NET·DAT 재흡수 촉진",
    "source": "14강 PDF 18쪽",
    "note": "Cocaine은 SERT·NET·DAT 수송체를 억제하여 모노아민 재흡수를 줄입니다. 강의록은 이 작용을 시냅스 재흡수 단계로 분류합니다.",
    "family": "시냅스 작용 단계"
  },
  {
    "id": "detail-ad-donepezil",
    "subject": "donepezil",
    "left": "Donepezil",
    "right": "AChE 억제·ACh 분해 감소",
    "wrong": "AChE 활성·ACh 분해 증가",
    "source": "15강 PDF 8쪽",
    "note": "Donepezil은 알츠하이머병에 사용하는 AChE 억제제입니다. 아세틸콜린 분해를 줄여 콜린성 신경전달을 개선합니다.",
    "family": "알츠하이머병"
  },
  {
    "id": "detail-ad-antibody",
    "subject": "lecanemab",
    "left": "Lecanemab·Donanemab",
    "right": "아밀로이드β 표적 항체",
    "wrong": "도파민 D₂ 표적 항체",
    "source": "15강 PDF 8쪽",
    "note": "Lecanemab과 donanemab은 아밀로이드β를 표적으로 하는 항체입니다. 강의록은 아밀로이드β 응집체·plaque 제거와 연결합니다.",
    "family": "알츠하이머병"
  },
  {
    "id": "detail-pd-carbidopa",
    "subject": "carbidopa",
    "left": "Carbidopa",
    "right": "말초 AADC 억제",
    "wrong": "말초 AADC 활성",
    "source": "15강 PDF 14쪽",
    "note": "Carbidopa는 BBB를 통과하지 않는 말초 AADC 억제제입니다. Levodopa가 말초에서 dopamine으로 전환되는 것을 줄입니다.",
    "family": "파킨슨병"
  },
  {
    "id": "detail-pd-bbb",
    "subject": "levodopa",
    "left": "Levodopa",
    "right": "BBB를 통과하는 도파민 전구물질",
    "wrong": "BBB를 통과하는 아세틸콜린 전구물질",
    "source": "15강 PDF 14쪽",
    "note": "Levodopa는 LAT1을 통해 BBB를 통과하는 도파민 전구물질입니다. Dopamine 자체는 BBB를 통과하지 못합니다.",
    "family": "파킨슨병"
  },
  {
    "id": "detail-pd-longterm",
    "subject": "levodopa",
    "left": "Levodopa 장기 투여",
    "right": "운동 변동·이상운동증 발생 위험 증가",
    "wrong": "운동 변동·이상운동증 발생 위험 감소",
    "source": "15강 PDF 14쪽",
    "note": "Levodopa 장기 투여에서는 운동 변동(motor fluctuation)과 이상운동증(dyskinesia)이 발생할 수 있습니다.",
    "family": "파킨슨병"
  },
  {
    "id": "detail-pd-amantadine",
    "subject": "amantadine",
    "left": "Amantadine",
    "right": "항바이러스제로 개발·이상운동증 완화",
    "wrong": "항바이러스제로 개발·소발작 1차 약물",
    "source": "15강 PDF 14쪽",
    "note": "Amantadine은 항바이러스제로 개발되었으며 NMDA 수용체 차단 등의 작용으로 levodopa 유발 이상운동증을 완화합니다.",
    "family": "파킨슨병"
  },
  {
    "id": "detail-pd-comt",
    "subject": "entacapone",
    "left": "Entacapone",
    "right": "COMT 억제제",
    "wrong": "AADC 억제제",
    "source": "15강 PDF 14쪽",
    "note": "Entacapone과 tolcapone은 COMT 억제제입니다. Carbidopa는 말초 AADC 억제제이고, selegiline과 rasagiline은 MAO-B 억제제입니다.",
    "family": "파킨슨병"
  },
  {
    "id": "detail-bzd-frequency",
    "subject": "diazepam",
    "left": "Diazepam (BZD)",
    "right": "강의록의 Cl⁻ 개방 조절 분류: 빈도 증가",
    "wrong": "강의록의 Cl⁻ 개방 조절 분류: 시간 증가",
    "source": "15강 PDF 17·19쪽",
    "note": "Diazepam 등 BZD는 GABA_A의 BZD 결합부위에 작용하여 Cl⁻ 통로 개방 빈도를 증가시킵니다. Barbiturate는 개방 시간을 증가시키는 것으로 강의록에서 비교합니다.",
    "family": "불안·수면"
  },
  {
    "id": "detail-bzd-flumazenil",
    "subject": "flumazenil",
    "left": "Flumazenil",
    "right": "BZD 결합부위 길항제",
    "wrong": "BZD 결합부위 효능제",
    "source": "15강 PDF 18쪽",
    "note": "Flumazenil은 GABA_A 수용체의 BZD 결합부위 길항제이며 BZD 과용량에 대응하는 약물입니다.",
    "family": "불안·수면"
  },
  {
    "id": "detail-bzd-midazolam",
    "subject": "midazolam",
    "left": "Midazolam",
    "right": "검사 전처치에서 선행성 기억상실 이용",
    "wrong": "검사 전처치에서 기억형성 촉진 이용",
    "source": "15강 PDF 18쪽",
    "note": "Midazolam은 BZD 계열의 진정·최면 약물입니다. 선행성 기억상실을 이용하여 내시경·기관지경 검사 등의 전처치에 사용합니다.",
    "family": "불안·수면"
  },
  {
    "id": "detail-bzd-sleep",
    "subject": "triazolam",
    "left": "Triazolam",
    "right": "입면용 BZD 수면제",
    "wrong": "입면용 barbiturate 수면제",
    "source": "15강 PDF 18쪽",
    "note": "Triazolam은 BZD 계열 수면제이며 강의록 필기에서 입면과 연결됩니다. Flurazepam은 같은 필기에서 숙면과 연결됩니다.",
    "family": "불안·수면"
  },
  {
    "id": "detail-bzd-buspirone",
    "subject": "buspirone",
    "left": "Buspirone",
    "right": "5-HT₁A 부분효능 항불안제",
    "wrong": "5-HT₁A 길항 항불안제",
    "source": "15강 PDF 21쪽",
    "note": "Buspirone은 5-HT₁A 수용체 부분효능제로 항불안 작용을 나타냅니다. 강의록에서는 BZD의 수면·항경련·근이완 작용과 구별합니다.",
    "family": "불안·수면"
  },
  {
    "id": "detail-bzd-zolpidem",
    "subject": "zolpidem",
    "left": "Zolpidem",
    "right": "GABA_A 조절·복합수면행동 주의",
    "wrong": "GABA_B 조절·복합수면행동 주의",
    "source": "15강 PDF 21쪽",
    "note": "Zolpidem은 GABA_A 수용체의 BZD 결합부위에 작용하는 Z-drug 수면제입니다. 복합수면행동과 다음날 졸림에 주의합니다.",
    "family": "불안·수면"
  },
  {
    "id": "detail-anesthesia-thiopental",
    "subject": "thiopental",
    "left": "Thiopental",
    "right": "재분포에 따른 빠른 각성",
    "wrong": "장간순환에 따른 빠른 각성",
    "source": "15강 PDF 20쪽",
    "note": "Thiopental은 초단시간 작용 barbiturate 정맥마취제입니다. 강의록은 30초 내 작용하고 재분포로 5–10분 후 각성하는 것으로 설명합니다.",
    "family": "마취"
  },
  {
    "id": "detail-anesthesia-long",
    "subject": "phenobarbital",
    "left": "Phenobarbital",
    "right": "장시간 지속 barbiturate 항경련제",
    "wrong": "장시간 지속 BZD 항경련제",
    "source": "15강 PDF 20·22쪽",
    "note": "Phenobarbital은 장시간 지속 barbiturate입니다. 강의록은 뇌전증 등에서 나타나는 경련을 억제하는 항경련제로 분류합니다.",
    "family": "마취·항경련"
  },
  {
    "id": "detail-depression-selective",
    "subject": "fluoxetine",
    "left": "Fluoxetine",
    "right": "SSRI 계열 항우울제",
    "wrong": "SNRI 계열 항우울제",
    "source": "15강 PDF 24쪽",
    "note": "Fluoxetine은 SSRI 계열 항우울제입니다. 세로토닌 수송체를 통한 세로토닌 재흡수를 선택적으로 억제합니다.",
    "family": "우울증"
  },
  {
    "id": "detail-depression-snri",
    "subject": "venlafaxine",
    "left": "Duloxetine·Venlafaxine",
    "right": "SNRI 계열 항우울제",
    "wrong": "SSRI 계열 항우울제",
    "source": "15강 PDF 24쪽",
    "note": "Duloxetine과 venlafaxine은 SNRI 계열입니다. 세로토닌과 노르에피네프린 재흡수를 함께 억제합니다.",
    "family": "우울증"
  },
  {
    "id": "detail-depression-muscarinic",
    "subject": "amitriptyline",
    "left": "TCA의 무스카린 수용체 차단",
    "right": "구강건조·시력흐림·변비",
    "wrong": "침분비 증가·시력흐림·변비",
    "source": "15강 PDF 25쪽",
    "note": "TCA의 무스카린 수용체 차단은 구강건조·시력흐림·변비와 연결됩니다. 침분비 증가는 이 항무스카린 작용의 방향과 맞지 않습니다.",
    "family": "우울증"
  },
  {
    "id": "detail-depression-alpha",
    "subject": "imipramine",
    "left": "TCA의 α 아드레날린 수용체 차단",
    "right": "체위성 저혈압",
    "wrong": "체위성 고혈압",
    "source": "15강 PDF 25쪽",
    "note": "TCA의 α 아드레날린 수용체 차단은 체위성 저혈압과 연결됩니다. 무스카린 수용체 차단은 구강건조·시력흐림·변비와 연결됩니다.",
    "family": "우울증"
  },
  {
    "id": "detail-depression-histamine",
    "subject": "doxepin",
    "left": "TCA의 히스타민 H₁ 수용체 차단",
    "right": "진정작용",
    "wrong": "각성작용",
    "source": "15강 PDF 25쪽",
    "note": "TCA의 히스타민 H₁ 수용체 차단은 진정작용과 연결됩니다. TCA의 α 아드레날린 수용체 차단은 체위성 저혈압과 연결됩니다.",
    "family": "우울증"
  },
  {
    "id": "detail-depression-overdose",
    "subject": "amitriptyline",
    "left": "TCA 과량 투여",
    "right": "심독성·QRS 연장",
    "wrong": "심독성·QRS 단축",
    "source": "15강 PDF 25쪽",
    "note": "TCA 과량 투여는 심독성과 QRS 연장을 일으킬 수 있습니다. 강의록은 이를 TCA의 과량 투여 관련 위험으로 제시합니다.",
    "family": "우울증"
  },
  {
    "id": "detail-depression-adverse",
    "subject": "fluoxetine",
    "left": "SSRI·SNRI",
    "right": "5-HT 재흡수 억제·오심·성기능 부전",
    "wrong": "5-HT 재흡수 촉진·오심·성기능 부전",
    "source": "15강 PDF 25쪽",
    "note": "SSRI와 SNRI는 세로토닌 재흡수를 억제합니다. 강의록은 오심·수면장애·성기능 부전을 SSRI·SNRI의 부작용으로 제시합니다.",
    "family": "우울증"
  },
  {
    "id": "detail-psychosis-aripiprazole",
    "subject": "aripiprazole",
    "left": "Aripiprazole",
    "right": "D₂ 부분효능제로 분류",
    "wrong": "D₂ 완전효능제로 분류",
    "source": "15강 PDF 28쪽",
    "note": "Aripiprazole은 비정형 항정신병제이며 D₂ 수용체 부분효능제로 분류됩니다. 강의록은 D₂ 부분효능 작용을 별도로 표시합니다.",
    "family": "조현병"
  },
  {
    "id": "detail-psychosis-haloperidol",
    "subject": "haloperidol",
    "left": "Haloperidol",
    "right": "정형 항정신병제·D₂ 길항",
    "wrong": "정형 항정신병제·D₂ 효능",
    "source": "15강 PDF 28쪽",
    "note": "Haloperidol은 정형 항정신병제이며 대표적인 작용은 도파민 D₂ 수용체 길항입니다.",
    "family": "조현병"
  },
  {
    "id": "detail-epilepsy-absence",
    "subject": "ethosuximide",
    "left": "Ethosuximide",
    "right": "소발작 치료용 T형 Ca²⁺ 통로 차단제",
    "wrong": "소발작 치료용 T형 Ca²⁺ 통로 활성제",
    "source": "15강 PDF 31–32쪽",
    "note": "Ethosuximide는 T형 Ca²⁺ 통로를 억제하여 소발작 치료에 사용합니다. 강의록은 ethosuximide와 valproic acid를 소발작 1차 약물로 제시합니다.",
    "family": "뇌전증"
  },
  {
    "id": "detail-epilepsy-ttype",
    "subject": "ethosuximide",
    "left": "Ethosuximide",
    "right": "저전압활성 T형 Ca²⁺ 통로 억제",
    "wrong": "저전압활성 T형 Ca²⁺ 통로 촉진",
    "source": "15강 PDF 31쪽",
    "note": "Ethosuximide는 저전압활성 T형 Ca²⁺ 통로를 억제합니다. 강의록은 gabapentin을 고전압활성 HVA Ca²⁺ 통로 계열로 구분합니다.",
    "family": "뇌전증"
  },
  {
    "id": "detail-epilepsy-dual",
    "subject": "valproicacid",
    "left": "Valproic acid·Zonisamide",
    "right": "Na⁺·T형 Ca²⁺ 통로 차단",
    "wrong": "Na⁺·T형 Ca²⁺ 통로 활성화",
    "source": "15강 PDF 31쪽",
    "note": "Valproic acid와 zonisamide는 강의록에서 Na⁺ 통로 차단과 T형 Ca²⁺ 통로 차단 양쪽에 포함됩니다.",
    "family": "뇌전증"
  },
  {
    "id": "detail-epilepsy-gabapentin",
    "subject": "gabapentin",
    "left": "Gabapentin",
    "right": "HVA Ca²⁺ 통로 조절",
    "wrong": "GABA_A 수용체 직접 효능",
    "source": "15강 PDF 31쪽",
    "note": "Gabapentin은 강의록에서 HVA Ca²⁺ 통로 계열로 분류됩니다. GABA_A 수용체에 직접 효능제로 작용하는 약물로 분류하지 않습니다.",
    "family": "뇌전증"
  },
  {
    "id": "detail-epilepsy-felbamate",
    "subject": "felbamate",
    "left": "Felbamate",
    "right": "NMDA 수용체 억제 항뇌전증제",
    "wrong": "NMDA 수용체 활성 항뇌전증제",
    "source": "15강 PDF 31쪽",
    "note": "Felbamate는 강의록의 NMDA 수용체 억제 항뇌전증제입니다. NMDA 수용체 활성화가 아니라 glutamate 신호 억제와 연결됩니다.",
    "family": "뇌전증"
  },
  {
    "id": "detail-epilepsy-focal",
    "subject": "carbamazepine",
    "left": "Carbamazepine·Phenytoin",
    "right": "강의록 초점발작 1차 약물",
    "wrong": "강의록 소발작 1차 약물",
    "source": "15강 PDF 32쪽",
    "note": "Carbamazepine과 phenytoin은 강의록의 초점발작 1차 약물입니다. 같은 초점발작 1차 목록에 lamotrigine과 valproic acid도 포함됩니다.",
    "family": "뇌전증"
  },
  {
    "id": "detail-epilepsy-absence-first",
    "subject": "ethosuximide",
    "left": "Ethosuximide·Valproic acid",
    "right": "강의록 소발작 1차 약물",
    "wrong": "강의록 소발작 2차 약물",
    "source": "15강 PDF 32쪽",
    "note": "Ethosuximide와 valproic acid는 강의록의 소발작 1차 약물입니다. Lamotrigine과 clonazepam은 강의록의 소발작 2차 약물입니다.",
    "family": "뇌전증"
  },
  {
    "id": "detail-opioid-effects",
    "subject": "morphine",
    "left": "Morphine",
    "right": "호흡억제·축동·장운동 감소",
    "wrong": "호흡촉진·산동·장운동 증가",
    "source": "15강 PDF 33쪽",
    "note": "Morphine은 호흡중추의 CO₂ 감수성을 낮추어 호흡억제를 일으킵니다. 축동과 위장관 운동 감소도 morphine의 대표적인 효과입니다.",
    "family": "아편유사제"
  },
  {
    "id": "detail-opioid-naloxone",
    "subject": "naloxone",
    "left": "Naloxone",
    "right": "아편수용체 길항·과용량 호흡억제 대응",
    "wrong": "아편수용체 효능·과용량 호흡억제 대응",
    "source": "15강 PDF 33쪽",
    "note": "Naloxone은 아편수용체 길항제입니다. Morphine 등 아편유사제 과용량으로 발생한 호흡억제에 대응합니다.",
    "family": "아편유사제"
  },
  {
    "id": "detail-opioid-antagonist",
    "subject": "naltrexone",
    "left": "Naloxone·Naltrexone",
    "right": "아편수용체 길항제",
    "wrong": "아편수용체 효능제",
    "source": "15강 PDF 33쪽",
    "note": "Naloxone과 naltrexone은 아편수용체 길항제입니다. 강의록은 nalmefene도 아편수용체 길항제 목록에 포함합니다.",
    "family": "아편유사제"
  },
  {
    "id": "detail-pd-exception",
    "subject": "donepezil",
    "left": "Donepezil",
    "right": "알츠하이머병 치료용 AChE 억제제",
    "wrong": "파킨슨병 치료용 AADC 억제제",
    "source": "15강 PDF 8·14쪽",
    "note": "Donepezil은 알츠하이머병에 사용하는 AChE 억제제입니다. 파킨슨병에서 사용하는 말초 AADC 억제제는 carbidopa입니다.",
    "family": "파킨슨병·알츠하이머병"
  },
  {
    "id": "detail-bzd-exception",
    "subject": "buspirone",
    "left": "Buspirone",
    "right": "BZD와 구별되는 5-HT₁A 부분효능제",
    "wrong": "BZD에 속하는 5-HT₁A 부분효능제",
    "source": "15강 PDF 18·21쪽",
    "note": "Buspirone은 5-HT₁A 부분효능제이며 BZD 계열에 속하지 않습니다. Diazepam·midazolam·lorazepam·alprazolam은 BZD 계열입니다.",
    "family": "불안·수면"
  },
  {
    "id": "detail-depression-exception",
    "subject": "duloxetine",
    "left": "Duloxetine",
    "right": "SNRI 계열 항우울제",
    "wrong": "SSRI 계열 항우울제",
    "source": "15강 PDF 24쪽",
    "note": "Duloxetine은 SNRI 계열로 세로토닌과 노르에피네프린 재흡수를 함께 억제합니다. Fluoxetine·sertraline·paroxetine·citalopram은 SSRI 계열입니다.",
    "family": "우울증"
  },
  {
    "id": "detail-anesthesia-exception",
    "subject": "propofol",
    "left": "Propofol",
    "right": "정맥마취제",
    "wrong": "흡입마취제",
    "source": "15강 PDF 22쪽",
    "note": "Propofol은 강의록의 정맥마취제입니다. Sevoflurane·isoflurane·desflurane·N₂O는 강의록의 흡입마취제 목록에 포함됩니다.",
    "family": "마취"
  },
  {
    "id": "detail-epilepsy-exception",
    "subject": "carbamazepine",
    "left": "Carbamazepine",
    "right": "강의록 초점발작 1차 약물",
    "wrong": "강의록 소발작 1차 약물",
    "source": "15강 PDF 32쪽",
    "note": "Carbamazepine은 강의록의 초점발작 1차 약물입니다. 강의록의 소발작 1차 약물은 ethosuximide·valproic acid이고, 2차 약물은 lamotrigine·clonazepam입니다.",
    "family": "뇌전증"
  }
];
