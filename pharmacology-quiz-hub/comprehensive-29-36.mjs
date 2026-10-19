export default [
  {
    id: 'comp-L29-Q1', lecture: 29,
    concept: '종양 내 약물 도달 장벽과 P-gp에 의한 세포 배출',
    format: 'judgment', polarity: 'incorrect',
    stem: '항암제의 종양 내 도달과 선택독성에 대한 설명으로 옳지 않은 것은?',
    options: [
      '종양의 불규칙한 혈관과 높은 간질압은 약물의 조직 내 분포를 방해할 수 있다.',
      '세포막 투과성과 수송체의 발현은 종양세포 안에 도달하는 약물량에 영향을 준다.',
      'P-gp의 발현 증가는 기질 항암제의 세포 내 유입을 촉진하여 약효를 높인다.',
      '혈중 약물 농도가 비슷해도 종양 조직과 세포 내부의 약물 농도는 다를 수 있다.',
      '세포독성 항암제는 빠르게 증식하는 정상 골수와 점막에도 손상을 줄 수 있다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳은 설명이다. 종양 혈관의 불균일한 관류와 높은 간질압은 혈관에서 종양 조직으로 약물이 이동하는 데 장벽이 된다.',
      '옳은 설명이다. 조직에 도달한 뒤에도 약물이 세포막이나 유입 수송체를 통과해야 세포 내 표적에 작용할 수 있다.',
      '틀린 설명으로 정답이다. P-gp는 ATP를 이용하는 약물 배출 수송체이다. 발현이 증가하면 기질 항암제의 세포 내 농도가 낮아져 내성이 생길 수 있다.',
      '옳은 설명이다. 혈중 노출은 종양 관류, 조직 이동 및 세포 유입·배출을 모두 나타내지 않으므로 종양 내 농도와 같다고 볼 수 없다.',
      '옳은 설명이다. 정상세포도 핵산 합성과 세포분열 기구를 사용하므로 골수억제와 점막 손상 등이 나타나 치료지수가 좁아진다.'
    ],
    rationale: '조직으로의 전달과 세포 내부로의 이동은 별개의 단계이다. P-gp는 세포 내부의 약물을 밖으로 내보내므로 유입 촉진과 반대 방향으로 작용한다.',
    notesPages: [38, 39],
    examRefs: [{ id: '29-2020-79-p70', page: 70 }, { id: '★원리-2019-101-p75', page: 75 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 189 }, { label: 'Om 약리학 요약(2025)', page: 194 }],
    verifiedSources: []
  },
  {
    id: 'comp-L29-Q2', lecture: 29,
    concept: 'Methotrexate의 세포 내 잔류와 leucovorin의 병용 목적',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Methotrexate 및 leucovorin에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Methotrexate는 극성이 높아 환원엽산 수송체를 이용하여 세포 안으로 들어간다.',
      'Methotrexate의 polyglutamation은 약물이 세포 안에 오래 머무르는 데 기여한다.',
      'Leucovorin은 DHFR의 환원 과정을 우회하여 methotrexate의 정상조직 독성을 줄일 수 있다.',
      '신장 배설이 감소하면 methotrexate의 전신 노출과 독성이 증가할 수 있다.',
      '5-Fluorouracil과 leucovorin의 병용은 항암효과를 약화시켜 정상조직을 구조하는 데 목적이 있다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. Methotrexate는 지질막을 자유롭게 통과하기 어려우므로 환원엽산 수송체 등의 유입 경로가 중요하다.',
      '옳은 설명이다. 세포 내에서 glutamate 잔기가 추가되면 약물의 세포 밖 배출이 어려워져 세포 내 잔류가 길어진다.',
      '옳은 설명이다. Leucovorin은 이미 환원된 엽산이므로 methotrexate가 차단한 DHFR 단계를 거치지 않고 엽산 보조인자 기능을 보완한다.',
      '옳은 설명이다. Methotrexate는 신장 배설이 중요하며, 신기능 저하나 배설을 방해하는 상호작용은 독성 위험을 높인다.',
      '틀린 설명으로 정답이다. 5-Fluorouracil과의 병용에서는 환원엽산이 thymidylate synthase 억제 복합체를 안정화하여 항암효과를 높인다. Methotrexate 구조요법과 목적이 다르다.'
    ],
    rationale: 'Leucovorin의 역할은 함께 쓰는 항암제에 따라 다르다. Methotrexate에서는 엽산 경로를 우회하여 구조하고, 5-fluorouracil에서는 표적 효소 억제를 강화한다.',
    notesPages: [38],
    examRefs: [{ id: '29-2021-79-p69', page: 69 }, { id: '29-2025-78-p69', page: 69 }, { id: '31-2020-80-p74', page: 74 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 191 }, { label: 'Om 약리학 요약(2025)', page: 192 }],
    verifiedSources: ['https://www.cancer.gov/publications/dictionaries/cancer-drug/def/arfolitixorin']
  },
  {
    id: 'comp-L29-Q3', lecture: 29,
    concept: '항암제 활성·불활성화와 DPYD·UGT1A1·NUDT15 차이',
    format: 'judgment', polarity: 'incorrect',
    stem: '세포독성 항암제의 대사 및 약물유전학에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Irinotecan은 esterase에 의해 활성 대사산물인 SN-38로 전환된다.',
      'UGT1A1은 SN-38을 더 강력한 활성 대사산물인 SN-38G로 전환한다.',
      'DPYD 기능 저하로 DPD 활성이 감소하면 5-fluorouracil의 분해가 줄어 독성이 증가할 수 있다.',
      'NUDT15 기능 저하는 6-mercaptopurine 관련 골수독성의 위험을 높일 수 있다.',
      'Allopurinol은 xanthine oxidase를 억제하여 6-mercaptopurine의 불활성화를 감소시킬 수 있다.'
    ],
    answerIndex: 1,
    explanations: [
      '옳은 설명이다. Irinotecan은 전구약물이며 carboxylesterase에 의한 가수분해로 더 강한 활성을 갖는 SN-38이 생성된다. SN-38의 장관 노출은 지연성 설사와 관련된다.',
      '틀린 설명으로 정답이다. UGT1A1은 SN-38을 glucuronidation하여 비활성 SN-38G로 만든다. 포합 능력이 감소하면 SN-38 노출과 독성이 증가할 수 있다.',
      '옳은 설명이다. DPYD가 암호화하는 DPD는 5-fluorouracil 분해에 중요하다. 기능 저하로 약물 제거가 감소하면 중증 독성 위험이 커진다.',
      '옳은 설명이다. NUDT15는 활성 thiopurine nucleotide의 처리에 관여한다. 기능이 낮으면 세포독성 대사산물의 영향이 커져 골수억제 위험이 증가한다.',
      '옳은 설명이다. Xanthine oxidase는 6-mercaptopurine 불활성화 경로 중 하나이다. Allopurinol에 의한 효소 억제는 약물 노출과 독성에 영향을 준다.'
    ],
    rationale: '전구약물 활성화와 활성 약물·대사산물의 불활성화를 구별한다. UGT1A1 포합은 SN-38을 불활성화하며 DPYD·NUDT15 차이와 XO 억제도 항암제 독성의 개인차를 설명한다.',
    notesPages: [38, 39],
    examRefs: [{ id: '29-2025-77-p69', page: 69 }, { id: '29-2025-76-p68', page: 68 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 193 }, { label: 'Om 약리학 요약(2025)', page: 195 }],
    verifiedSources: ['https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=9c6aa884-750e-4b11-9955-bc7ab6e9c2ad', 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e7309808-5ae8-4a55-90e3-3992ace0da62', 'https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=b268684b-487f-4716-a2e8-6e6d3e117b14']
  },
  {
    id: 'comp-L29-Q4', lecture: 29,
    concept: 'Cyclophosphamide의 acrolein 독성과 mesna의 방광 보호',
    format: 'case',
    stem: '한 항암제의 대사 과정에서 생성된 acrolein이 소변에 농축되어 방광 점막을 손상시킬 수 있다. 소변에서 이 대사산물과 반응하여 해당 독성을 줄이는 보조 약물은?',
    options: ['Leucovorin', 'Mesna', 'Dexrazoxane', 'Filgrastim', 'Amifostine'],
    answerIndex: 1,
    explanations: [
      'Leucovorin은 환원엽산을 공급하여 methotrexate 독성의 구조요법에 쓰인다. Acrolein을 소변에서 불활성화하는 약물은 아니다.',
      '정답이다. Mesna의 thiol기가 소변에서 acrolein과 반응하여 cyclophosphamide 등에 의한 출혈성 방광염을 줄인다.',
      'Dexrazoxane은 anthracycline 관련 심장독성 감소에 사용되는 보조 약물이다. Acrolein의 방광 독성을 표적으로 하지 않는다.',
      'Filgrastim은 호중구 생성과 회복을 촉진한다. 항암치료 관련 호중구감소증과 연관되며 방광 내 acrolein과 결합하는 약물은 아니다.',
      'Amifostine은 일부 항암치료의 정상조직 독성, 특히 cisplatin 관련 신독성을 줄이는 데 사용된다. Acrolein에 대한 대표적 요로 보호제는 mesna이다.'
    ],
    rationale: 'Acrolein에 의한 출혈성 방광염은 cyclophosphamide의 특징적인 대사산물 독성이다. Mesna는 이 독성 대사산물을 요로에서 불활성화한다.',
    notesPages: [38],
    examRefs: [{ id: '29-2020-78-p70', page: 70 }, { id: '29-2019-99-p70', page: 70 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 190 }],
    verifiedSources: []
  },
  {
    id: 'comp-L29-Q5', lecture: 29,
    concept: '합성치사·ADC·PROTAC을 이용한 표적치료 전략',
    format: 'judgment', polarity: 'incorrect',
    stem: '표적항암치료 전략에 대한 설명으로 옳지 않은 것은?',
    options: [
      'ADC는 항체에 세포독성 약물을 연결하여 항원을 발현하는 세포로 전달하는 전략이다.',
      '일부 ADC는 방출된 payload가 주변 세포에 작용하는 bystander effect를 나타낼 수 있다.',
      'PROTAC은 표적 단백질과 E3 ubiquitin ligase를 가깝게 하여 표적 분해를 유도한다.',
      'PARP 억제제는 BRCA 결손 종양의 상동재조합 복구 능력을 회복시켜 항암효과를 낸다.',
      '공유결합 저해제의 작용 지속시간은 혈중 반감기 외에 표적 단백질의 재합성 속도에도 영향을 받는다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳은 설명이다. ADC는 항체의 항원 인식과 세포독성 payload를 결합하여 약물 전달의 선택성을 높인다.',
      '옳은 설명이다. 링커와 payload의 성질에 따라 방출된 약물이 인접한 항원 음성 세포에도 작용할 수 있다. 이 효과의 정도는 ADC마다 다르다.',
      '옳은 설명이다. PROTAC은 표적과 E3 ligase를 연결하고 ubiquitination 및 proteasome 분해를 유도한다.',
      '틀린 설명으로 정답이다. BRCA 결손으로 상동재조합 복구가 손상된 세포에서 PARP까지 억제하면 DNA 손상을 견디기 어려워진다. 결손을 복구하는 것이 아니라 합성치사를 이용한다.',
      '옳은 설명이다. 비가역적으로 저해된 표적의 기능 회복에는 새로운 단백질 합성 등이 필요하므로 혈중 약물 농도 감소와 효과 소실이 일치하지 않을 수 있다.'
    ],
    rationale: '합성치사는 종양이 이미 잃은 기능에 더하여 다른 생존 경로를 차단하는 전략이다. PARP 억제는 BRCA 기능을 되살리는 작용이 아니다.',
    notesPages: [39],
    examRefs: [{ id: '29-2025-93-p69', page: 69 }, { id: '★표적-2018-1-p74', page: 74 }],
    lectureSources: [],
    verifiedSources: ['https://www.cancer.gov/publications/pdq/information-summaries/genetics/brca-genes-hp-pdq', 'https://www.cancer.gov/research/annual-plan/scientific-topics/drug-resistance', 'https://www.cancer.gov/publications/dictionaries/cancer-drug/def/anti-5t4-d-2102-antibody-drug-conjugate-acr246']
  },
  {
    id: 'comp-L30-Q1', lecture: 30,
    concept: 'Vinca alkaloid와 taxane의 미세소관 작용 및 주요 독성',
    format: 'judgment', polarity: 'incorrect',
    stem: '미세소관에 작용하는 항암제에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Vincristine은 미세소관의 해체를 억제하여 형성된 방추사를 안정화한다.',
      'Paclitaxel은 미세소관의 해체를 억제하여 정상적인 방추사 역동성을 방해한다.',
      'Vincristine은 말초신경병증과 자율신경 장애에 의한 변비를 일으킬 수 있다.',
      'Vinblastine에서는 골수억제가 중요한 용량 제한 독성이다.',
      'Vinca alkaloid와 taxane은 P-gp 증가에 의해 교차내성을 보일 수 있다.'
    ],
    answerIndex: 0,
    explanations: [
      '틀린 설명으로 정답이다. Vincristine은 tubulin에 결합하여 미세소관 중합을 억제한다. 이미 형성된 미세소관의 해체를 억제하는 것은 taxane의 특징이다.',
      '옳은 설명이다. Paclitaxel은 미세소관을 안정화하여 중합과 탈중합을 반복해야 하는 M기 방추사 기능을 방해한다.',
      '옳은 설명이다. 미세소관은 축삭 수송에도 필요하므로 vincristine은 감각 이상, 근력 저하, 변비 등의 신경독성을 보일 수 있다.',
      '옳은 설명이다. Vinblastine은 vincristine과 기전을 공유하지만 대표적 독성은 골수억제 쪽에 더 두드러진다.',
      '옳은 설명이다. 두 계열이 P-gp의 기질이면 약물 배출 증가라는 공통 기전으로 교차내성이 생길 수 있다.'
    ],
    rationale: 'Vinca alkaloid는 중합 억제, taxane은 탈중합 억제로 미세소관 역동성을 방해한다. 두 계열 모두 M기 방추사 기능을 억제한다.',
    notesPages: [39],
    examRefs: [{ id: '30-2025-39-p71', page: 71 }, { id: '30-2018-86-p72', page: 72 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 194 }, { label: 'Om 약리학 요약(2025)', page: 195 }],
    verifiedSources: []
  },
  {
    id: 'comp-L30-Q2', lecture: 30,
    concept: 'Topoisomerase 억제와 asparaginase의 기질 고갈 기전',
    format: 'judgment', polarity: 'incorrect',
    stem: '항암제의 분자 작용에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Irinotecan의 활성 대사산물은 topoisomerase I과 DNA의 절단 복합체를 안정화한다.',
      'Topotecan은 topoisomerase I을 표적으로 하여 절단된 DNA의 재결합을 방해한다.',
      'Etoposide는 topoisomerase II를 표적으로 하여 DNA 손상을 유도한다.',
      'Asparaginase는 asparagine 합성효소를 직접 차단하여 혈중 asparagine을 낮춘다.',
      'Dactinomycin은 DNA 사이에 끼어들어 전사를 방해한다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳은 설명이다. SN-38은 topoisomerase I-DNA 절단 복합체를 안정화하여 재결합을 막고 복제 과정에서 치명적인 DNA 손상을 유발한다.',
      '옳은 설명이다. Topotecan과 irinotecan은 모두 camptothecin 계열의 topoisomerase I 억제제이다.',
      '옳은 설명이다. Etoposide는 topoisomerase II-DNA 절단 복합체에 작용한다. Topoisomerase I 억제제와 표적이 다르다.',
      '틀린 설명으로 정답이다. Asparaginase는 혈중 asparagine을 가수분해하여 제거하는 효소이다. 암세포 내 asparagine 합성효소를 직접 억제하는 약물이 아니다.',
      '옳은 설명이다. Dactinomycin은 DNA intercalation을 통해 RNA 합성 등 핵산 기능을 방해한다.'
    ],
    rationale: 'Topoisomerase 억제제는 DNA 절단과 재결합 과정에, asparaginase는 세포 밖 영양 기질 고갈에 작용한다. 기질 분해와 합성효소 억제를 구별해야 한다.',
    notesPages: [39],
    examRefs: [{ id: '30-2023-63-p72', page: 72 }, { id: '30-2019-104-p72', page: 72 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 195 }, { label: 'Om 약리학 요약(2025)', page: 196 }, { label: 'Om 약리학 요약(2025)', page: 197 }],
    verifiedSources: []
  },
  {
    id: 'comp-L30-Q3', lecture: 30,
    concept: '항생제 유래 항암제의 장기별 대표 독성',
    format: 'judgment', polarity: 'incorrect',
    stem: '항생제 유래 항암제의 작용과 독성에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Doxorubicin은 DNA intercalation과 topoisomerase II 억제 등으로 작용한다.',
      'Bleomycin은 폐와 피부 독성에 더하여 강한 골수억제를 특징으로 한다.',
      'Dactinomycin은 DNA에 끼어들어 RNA 전사를 방해한다.',
      'Mitomycin C는 활성화된 뒤 DNA 교차결합을 형성할 수 있다.',
      'Daunorubicin은 anthracycline 계열로서 심장독성을 일으킬 수 있다.'
    ],
    answerIndex: 1,
    explanations: [
      '옳은 설명이다. Doxorubicin은 DNA intercalation, topoisomerase II-DNA 절단 복합체 안정화 및 ROS 생성 등을 통해 작용한다.',
      '틀린 설명으로 정답이다. Bleomycin은 폐독성 및 피부독성이 중요하지만, 다른 여러 세포독성 항암제에 비해 골수억제는 상대적으로 적다.',
      '옳은 설명이다. Dactinomycin은 DNA intercalation으로 RNA polymerase에 의한 전사를 방해한다.',
      '옳은 설명이다. Mitomycin C는 환원성 활성화 후 DNA를 손상시키고 교차결합을 유도하는 항암제이다.',
      '옳은 설명이다. Daunorubicin은 doxorubicin과 같은 anthracycline 계열이며 심장독성과 골수억제 등이 중요하다.'
    ],
    rationale: 'Bleomycin은 폐섬유화와 상대적으로 적은 골수억제를 함께 기억한다. Doxorubicin의 심장독성과 구별하는 것이 핵심이다.',
    notesPages: [39],
    examRefs: [{ id: '30-2023-61-p71', page: 71 }, { id: '30-2019-103-p72', page: 72 }, { id: '★원리-2019-97-p75', page: 75 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 196 }, { label: 'Om 약리학 요약(2025)', page: 197 }],
    verifiedSources: []
  },
  {
    id: 'comp-L30-Q4', lecture: 30,
    concept: '유방암의 SERM·SERD·aromatase 억제 기전',
    format: 'judgment', polarity: 'incorrect',
    stem: '호르몬 수용체 양성 유방암에 사용하는 약물에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Tamoxifen은 유방 조직에서 estrogen receptor의 작용을 억제한다.',
      'Tamoxifen은 자궁내막에서 부분 작용을 나타내어 자궁내막 증식 위험을 높일 수 있다.',
      'Fulvestrant는 estrogen receptor에 결합하여 수용체 분해를 촉진한다.',
      'Letrozole은 aromatase를 억제하여 estrogen 생성을 감소시킨다.',
      '폐경 전 난소의 되먹임 반응은 aromatase 억제제의 단독 효과를 높인다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. Tamoxifen은 SERM으로서 유방 조직에서 estrogen 신호를 길항한다.',
      '옳은 설명이다. SERM의 작용은 조직마다 다르며 tamoxifen의 자궁내막 부분 작용은 자궁내막암 위험과 연결된다.',
      '옳은 설명이다. Fulvestrant는 SERD로서 ER의 기능을 억제하고 ER 단백질의 분해를 촉진한다.',
      '옳은 설명이다. Letrozole 등 aromatase 억제제는 androgen에서 estrogen으로의 전환을 줄이며, ER을 직접 차단하는 약물과 구별된다.',
      '틀린 설명으로 정답이다. 폐경 전에는 난소의 호르몬 생성과 되먹임 반응이 유지된다. Aromatase 억제제를 사용하는 경우 난소 기능 억제를 함께 고려하는 이유이다.'
    ],
    rationale: 'ER 자체를 조절하는 SERM·SERD와 estrogen 합성을 줄이는 aromatase 억제제를 구별한다. 후자는 폐경 여부와 난소 기능의 영향을 받는다.',
    notesPages: [40],
    examRefs: [{ id: '30-2025-38-p71', page: 71 }, { id: '29-2022-80-p69', page: 69 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 199 }, { label: 'Om 약리학 요약(2025)', page: 200 }],
    verifiedSources: []
  },
  {
    id: 'comp-L30-Q5', lecture: 30,
    concept: '전립선암의 GnRH 조절·androgen 합성·수용체 차단',
    format: 'judgment', polarity: 'incorrect',
    stem: '전립선암의 androgen 신호를 억제하는 약물에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Leuprolide를 지속적으로 투여하면 GnRH 수용체의 탈감작으로 성선자극호르몬 분비가 감소한다.',
      'Degarelix는 GnRH 수용체를 차단하여 leuprolide와 같은 초기 자극성 flare를 유발한다.',
      'Enzalutamide는 androgen receptor 신호전달을 억제한다.',
      'Abiraterone은 CYP17을 억제하여 androgen 합성을 감소시킨다.',
      'Abiraterone에 의한 cortisol 감소와 ACTH 증가는 mineralocorticoid 과다 관련 이상반응에 기여한다.'
    ],
    answerIndex: 1,
    explanations: [
      '옳은 설명이다. GnRH 작용제는 처음에는 LH 분비를 자극하지만 지속 노출 후에는 수용체 탈감작과 하향조절로 testosterone을 낮춘다.',
      '틀린 설명으로 정답이다. Degarelix는 GnRH 길항제이므로 초기 수용체 자극에 의한 flare 없이 성선자극호르몬 분비를 억제한다.',
      '옳은 설명이다. Enzalutamide는 androgen receptor 길항 작용을 통해 androgen 의존성 신호를 억제한다.',
      '옳은 설명이다. Abiraterone은 CYP17의 효소 활성을 억제하여 androgen 생성을 줄인다. 수용체 차단과는 작용 위치가 다르다.',
      '옳은 설명이다. Cortisol 합성이 감소하면 ACTH 억제 되먹임이 약해지고 mineralocorticoid 활성을 가진 전구물질이 증가하여 고혈압·저칼륨혈증 등이 생길 수 있다.'
    ],
    rationale: 'GnRH 작용제의 초기 자극과 길항제의 직접 차단을 구별한다. Androgen 합성 억제와 수용체 차단도 서로 다른 단계의 접근이다.',
    notesPages: [40],
    examRefs: [],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 200 }],
    verifiedSources: []
  },
  {
    id: 'comp-L31-Q1', lecture: 31,
    concept: 'EGFR·HER2 표적 약물의 항체와 kinase 억제 구별',
    format: 'association',
    stem: 'EGFR 또는 HER2를 표적으로 하는 약물과 작용의 연결로 옳은 것은?',
    options: [
      'Cetuximab — 세포 내 EGFR kinase의 ATP 결합 부위를 경쟁적으로 억제한다.',
      'Trastuzumab — EGFR의 세포 외 부위에 결합하여 수용체 활성을 차단한다.',
      'Gefitinib — EGFR kinase의 ATP 결합 부위에 가역적으로 작용한다.',
      'Afatinib — EGFR kinase에 가역적으로 결합하는 1세대 저해제이다.',
      'Lapatinib — BCR-ABL과 SRC를 함께 억제하는 저분자 약물이다.'
    ],
    answerIndex: 2,
    explanations: [
      'Cetuximab은 EGFR의 세포 외 부위에 결합하는 단일클론항체이다. ATP 결합 부위에 작용하는 저분자 kinase 억제제와 다르다.',
      'Trastuzumab은 HER2의 세포 외 부위에 결합하는 항체이다. EGFR에 결합하는 항체는 cetuximab과 panitumumab이다.',
      '정답이다. Gefitinib은 1세대 EGFR TKI로서 세포 내 ATP 결합 부위에 가역적·경쟁적으로 작용한다.',
      'Afatinib은 비가역적 ErbB 계열 kinase 억제제이다. 가역적 1세대 EGFR 억제제인 gefitinib·erlotinib과 구별한다.',
      'Lapatinib은 EGFR과 HER2의 kinase를 억제한다. BCR-ABL과 SRC를 함께 억제하는 약물에는 dasatinib이 있다.'
    ],
    rationale: '동일한 성장인자 수용체를 표적으로 해도 항체는 주로 세포 외 부위에, 저분자 TKI는 세포 내 kinase에 작용한다.',
    notesPages: [40],
    examRefs: [{ id: '31-2021-83-p73', page: 73 }, { id: '31-2020-82-p74', page: 74 }, { id: '★항체-2021-87-p70', page: 70 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 204 }, { label: 'Om 약리학 요약(2025)', page: 205 }],
    verifiedSources: []
  },
  {
    id: 'comp-L31-Q2', lecture: 31,
    concept: 'BCR-ABL 억제와 imatinib·dasatinib의 표적 범위',
    format: 'judgment', polarity: 'incorrect',
    stem: 'BCR-ABL과 이를 표적으로 하는 항암제에 대한 설명으로 옳지 않은 것은?',
    options: [
      'BCR-ABL은 비정상적인 tyrosine kinase 활성을 나타내는 융합 단백질이다.',
      'Imatinib은 BCR-ABL의 인산화효소 활성을 억제한다.',
      'Imatinib의 c-KIT 억제 작용은 일부 위장관 기질종양에서의 사용과 관련된다.',
      'Dasatinib은 BCR-ABL뿐 아니라 SRC 계열 kinase도 억제한다.',
      'Dasatinib은 BCR-ABL 표적을 VEGF-A 중화로 바꾸어 imatinib 내성을 극복한다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. Philadelphia 염색체와 관련된 BCR-ABL 융합 단백질은 지속적인 kinase 신호를 유발한다.',
      '옳은 설명이다. Imatinib은 BCR-ABL kinase를 억제하여 해당 신호에 의존하는 종양세포의 증식을 억제한다.',
      '옳은 설명이다. Imatinib은 BCR-ABL 외에 c-KIT 등에도 작용하므로 c-KIT 관련 GIST에서도 의미가 있다.',
      '옳은 설명이다. Dasatinib은 BCR-ABL과 SRC 등을 억제하는 TKI이며 일부 imatinib 내성 상황에서 사용할 수 있다.',
      '틀린 설명으로 정답이다. Dasatinib도 BCR-ABL kinase를 표적으로 한다. VEGF-A 중화는 bevacizumab의 작용이며 dasatinib의 내성 극복 기전이 아니다.'
    ],
    rationale: 'Imatinib과 dasatinib은 모두 BCR-ABL kinase 억제제이다. 결합 특성과 추가 표적의 차이가 있으며, 다른 성장인자 항체로 바뀌는 것은 아니다.',
    notesPages: [40],
    examRefs: [{ id: '31-2021-82-p73', page: 73 }, { id: '31-2020-81-p74', page: 74 }, { id: '★표적-2019-96-p74', page: 74 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 206 }],
    verifiedSources: []
  },
  {
    id: 'comp-L31-Q3', lecture: 31,
    concept: 'VEGF 리간드 중화와 다중 표적 혈관신생 kinase 억제',
    format: 'judgment', polarity: 'incorrect',
    stem: '혈관신생을 표적으로 하는 항암제에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Bevacizumab은 VEGF-A에 결합하여 VEGF 수용체의 활성화를 줄인다.',
      'Sunitinib은 VEGFR 외에도 PDGFR과 c-KIT 등의 kinase를 억제한다.',
      'Sorafenib은 단일 표적 항체로서 VEGF-A에만 결합한다.',
      'Bevacizumab은 VEGF 수용체의 ATP 결합 부위를 직접 억제하는 TKI와 구별된다.',
      '혈관신생 억제는 종양 혈관에 대한 작용과 함께 정상 혈관 관련 이상반응도 일으킬 수 있다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳은 설명이다. Bevacizumab은 수용체가 아니라 VEGF-A 리간드를 중화하는 단일클론항체이다.',
      '옳은 설명이다. Sunitinib은 VEGFR·PDGFR·c-KIT 등을 억제하는 다중 표적 저분자 TKI이다.',
      '틀린 설명으로 정답이다. Sorafenib은 VEGFR, PDGFR 및 RAF 등 여러 kinase에 작용하는 저분자 억제제이다. VEGF-A에 결합하는 항체가 아니다.',
      '옳은 설명이다. 리간드 중화와 수용체 kinase 억제는 혈관신생 신호를 차단하는 서로 다른 작용 위치이다.',
      '옳은 설명이다. VEGF 신호는 정상 혈관 기능에도 관여하므로 혈압 상승과 출혈 등의 이상반응이 가능하다.'
    ],
    rationale: 'Bevacizumab은 VEGF 리간드를 중화하고, sunitinib과 sorafenib은 여러 kinase를 억제한다. 리간드·수용체·효소의 구분이 핵심이다.',
    notesPages: [40],
    examRefs: [{ id: '29-2021-81-p70', page: 70 }, { id: '29-2025-93-p69', page: 69 }, { id: '★항체-2021-89-p71', page: 71 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 207 }],
    verifiedSources: []
  },
  {
    id: 'comp-L31-Q4', lecture: 31,
    concept: 'Tretinoin에 의한 APL의 분화 차단 해제',
    format: 'case',
    stem: 'PML-RARα 융합 단백질이 확인된 급성전골수성백혈병에서 미성숙 세포의 분화 차단을 풀고자 한다. RARα에 결합하여 분화 관련 유전자의 전사를 회복시키는 약물은?',
    options: ['Bortezomib', 'Imatinib', 'Vorinostat', 'Tretinoin', 'Cetuximab'],
    answerIndex: 3,
    explanations: [
      'Bortezomib은 26S proteasome을 억제하는 약물이다. RARα에 결합하여 전골수세포 분화 차단을 해제하는 약물은 아니다.',
      'Imatinib은 BCR-ABL과 c-KIT 등의 kinase를 억제한다. PML-RARα의 분화 차단을 직접 표적으로 하지 않는다.',
      'Vorinostat는 histone deacetylase를 억제하여 염색질과 유전자 발현을 조절한다. RARα 리간드에 해당하지 않는다.',
      '정답이다. Tretinoin은 all-trans retinoic acid로서 PML-RARα의 RARα 부분에 작용하여 전사 억제를 풀고 분화를 촉진한다.',
      'Cetuximab은 EGFR의 세포 외 부위에 결합하는 항체이다. APL의 PML-RARα 분화 차단과는 표적이 다르다.'
    ],
    rationale: 'APL의 특징적인 융합 단백질과 분화 차단을 연결하면 RARα에 작용하는 tretinoin을 고를 수 있다. 세포분열 억제와 분화 유도는 구별되는 전략이다.',
    notesPages: [40],
    examRefs: [{ id: '31-2023-65-p73', page: 73 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 208 }],
    verifiedSources: []
  },
  {
    id: 'comp-L31-Q5', lecture: 31,
    concept: '혈액종양 표적 항체의 CD 항원과 proteasome·HDAC 표적',
    format: 'judgment', polarity: 'incorrect',
    stem: '항암제와 직접 표적의 연결로 옳지 않은 것은?',
    options: [
      'Rituximab — CD20',
      'Alemtuzumab — CD52',
      'Gemtuzumab ozogamicin — CD33',
      'Bortezomib — 26S proteasome',
      'Vorinostat — histone acetyltransferase'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 연결이다. Rituximab은 CD20을 표적으로 하는 항체이며 B세포 종양 등에서 사용된다.',
      '옳은 연결이다. Alemtuzumab은 CD52에 결합하는 항체이다.',
      '옳은 연결이다. Gemtuzumab ozogamicin은 CD33을 인식하는 항체에 세포독성 성분을 연결한 ADC이다.',
      '옳은 연결이다. Bortezomib은 26S proteasome의 단백질 분해 활성을 억제하며 다발성 골수종 등의 치료와 관련된다.',
      '틀린 연결로 정답이다. Vorinostat의 표적은 histone deacetylase이다. Acetyl기를 붙이는 acetyltransferase와 제거하는 deacetylase를 구별해야 한다.'
    ],
    rationale: '종양의 세포 표면 항원과 세포 내 조절 단백질은 모두 표적이 될 수 있다. Vorinostat는 HDAC 억제제이며 histone acetyltransferase 억제제가 아니다.',
    notesPages: [40],
    examRefs: [{ id: '31-2023-64-p73', page: 73 }, { id: '★표적-2017-77-p75', page: 75 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 207 }, { label: 'Om 약리학 요약(2025)', page: 208 }],
    verifiedSources: []
  },
  {
    id: 'comp-L32-Q1', lecture: 32,
    concept: 'T세포 활성 수용체와 억제성 면역관문 수용체',
    format: 'judgment', polarity: 'incorrect',
    stem: 'T세포의 활성 조절 분자에 대한 설명으로 옳지 않은 것은?',
    options: [
      'PD-1은 리간드와 결합하면 T세포의 반응을 억제하는 신호를 전달할 수 있다.',
      'CTLA-4는 B7에 결합하여 T세포 활성에 제동을 거는 억제성 수용체이다.',
      'LAG-3와 TIM-3는 억제성 면역관문으로 분류된다.',
      'GITR은 PD-1과 마찬가지로 대표적인 억제성 면역관문 수용체이다.',
      'CD28은 항원 인식과 함께 T세포 활성에 필요한 공동자극 신호를 제공한다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳은 설명이다. PD-1 신호는 T세포 반응을 억제하며, 종양은 PD-L1 발현 등을 통해 이 억제 경로를 이용할 수 있다.',
      '옳은 설명이다. CTLA-4는 CD80/86에 결합하여 CD28에 의한 공동자극을 제한하는 억제성 수용체이다.',
      '옳은 설명이다. LAG-3와 TIM-3는 T세포의 억제 및 탈진과 연관되는 분자이다.',
      '틀린 설명으로 정답이다. GITR은 이 강의에서 활성·공동자극 수용체로 구분한다. PD-1, CTLA-4 등 억제성 수용체와 같은 범주로 묶으면 안 된다.',
      '옳은 설명이다. CD28은 항원제시세포의 CD80/86과 상호작용하여 T세포 활성의 공동자극을 제공한다.'
    ],
    rationale: '면역관문 억제제는 억제 신호를 차단하여 항종양 T세포 반응을 돕는다. PD-1·CTLA-4 같은 억제성 분자와 CD28·GITR 같은 활성 분자를 구별한다.',
    notesPages: [41],
    examRefs: [{ id: '32-2022-7-p76', page: 76 }, { id: '32-2020-84-p77', page: 77 }, { id: '★표적-2019-95-p74', page: 74 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 212 }],
    verifiedSources: []
  },
  {
    id: 'comp-L32-Q2', lecture: 32,
    concept: 'PD-1·PD-L1·CTLA-4 억제 항체의 직접 표적',
    format: 'association',
    stem: '면역관문 억제 항체와 직접 표적의 연결로 옳은 것은?',
    options: [
      'Ipilimumab — PD-1',
      'Pembrolizumab — PD-1',
      'Nivolumab — PD-L1',
      'Avelumab — CTLA-4',
      'Durvalumab — CTLA-4'
    ],
    answerIndex: 1,
    explanations: [
      'Ipilimumab은 CTLA-4를 표적으로 한다. PD-1 억제 항체에는 pembrolizumab과 nivolumab 등이 있다.',
      '정답이다. Pembrolizumab은 T세포의 PD-1에 결합하여 PD-1 매개 억제 신호를 차단한다.',
      'Nivolumab의 직접 표적은 PD-1이다. 같은 경로에 작용하더라도 PD-L1 항체와 표적 분자가 다르다.',
      'Avelumab은 PD-L1을 표적으로 한다. CTLA-4 억제 항체에는 ipilimumab과 tremelimumab이 있다.',
      'Durvalumab은 PD-L1에 결합한다. PD-1·PD-L1 상호작용을 막는다는 점과 CTLA-4를 직접 막는다는 것은 구별해야 한다.'
    ],
    rationale: 'PD-1 항체는 pembrolizumab·nivolumab, PD-L1 항체는 avelumab·durvalumab·atezolizumab, CTLA-4 항체는 ipilimumab·tremelimumab으로 정리한다.',
    notesPages: [41],
    examRefs: [{ id: '32-2020-85-p77', page: 77 }, { id: '31-2023-66-p73', page: 73 }, { id: '★표적-2017-78-p75', page: 75 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 213 }],
    verifiedSources: ['https://www.cancer.gov/about-cancer/treatment/types/immunotherapy/checkpoint-inhibitors']
  },
  {
    id: 'comp-L32-Q3', lecture: 32,
    concept: '종양 미세환경과 항원제시 소실에 의한 면역회피',
    format: 'judgment', polarity: 'incorrect',
    stem: '종양의 면역회피 및 면역항암제 내성에 대한 설명으로 옳지 않은 것은?',
    options: [
      '종양 미세환경에 축적된 Treg와 MDSC는 효과 T세포 반응을 억제할 수 있다.',
      '종양의 항원 소실은 해당 항원에 특이적인 T세포의 인식을 어렵게 한다.',
      'β2-microglobulin의 기능 소실로 MHC I 항원제시가 감소하면 CTL 인식이 약해질 수 있다.',
      'CAF에서 분비되는 TGF-β 등의 인자는 면역억제적 미세환경 형성에 기여할 수 있다.',
      'PD-1 경로 차단 후 다른 억제성 수용체가 증가하면 T세포 활성은 더욱 강화되어 내성을 막는다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. 조절 T세포와 골수유래 억제세포는 효과 T세포 기능을 억제하여 종양의 면역회피에 기여한다.',
      '옳은 설명이다. 표적 항원의 발현이 없어지거나 줄면 기존 항원 특이 T세포가 종양세포를 인식하기 어려워진다.',
      '옳은 설명이다. β2-microglobulin은 MHC I 기능에 필요하며, 그 소실은 CD8 T세포에 대한 항원제시를 손상시킬 수 있다.',
      '옳은 설명이다. 암연관 섬유모세포는 면역세포의 유입과 기능에 영향을 주는 인자를 분비할 수 있다.',
      '틀린 설명으로 정답이다. TIM-3·LAG-3 등 다른 억제 경로의 증가는 T세포 억제를 유지하여 PD-1 차단에 대한 내성에 기여할 수 있다.'
    ],
    rationale: '면역회피는 억제성 세포·신호의 증가와 항원·MHC I 제시의 소실 등 여러 단계에서 발생한다. 다른 억제성 관문의 증가는 활성 강화가 아니라 대체 억제 경로가 될 수 있다.',
    notesPages: [41],
    examRefs: [{ id: '32-2025-94-p76', page: 76 }, { id: '32-2022-17-p77', page: 77 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 210 }, { label: 'Om 약리학 요약(2025)', page: 212 }, { label: 'Om 약리학 요약(2025)', page: 213 }],
    verifiedSources: []
  },
  {
    id: 'comp-L32-Q4', lecture: 32,
    concept: '면역기억에 의한 지속 반응과 면역 관련 이상반응',
    format: 'judgment', polarity: 'correct',
    stem: '면역관문 억제제의 치료 반응과 독성에 대한 설명으로 옳은 것은?',
    options: [
      '약물이 혈중에서 사라지면 형성된 항종양 면역기억도 같은 속도로 소실된다.',
      '주된 항암작용은 암세포 DNA의 직접 알킬화이므로 면역기억과의 관련성이 낮다.',
      '항종양 면역반응이 지속될 수 있으며 정상조직에 대한 면역반응으로 염증성 독성도 생길 수 있다.',
      '다른 항암제와 병용하면 면역세포의 기억 기능이 소실되어 지속 반응을 기대하기 어렵다.',
      '면역관문 억제의 독성은 빠르게 분열하는 골수세포의 직접 손상이 중심이다.'
    ],
    answerIndex: 2,
    explanations: [
      '틀린 설명이다. 활성화된 항종양 면역반응과 기억세포의 작용은 약물의 혈중 소실과 같은 시간 경과를 따르지 않을 수 있다.',
      '틀린 설명이다. 면역관문 억제제는 억제성 신호를 차단하여 면역세포의 종양 공격을 돕는다. DNA 알킬화는 세포독성 항암제의 다른 작용이다.',
      '옳은 설명으로 정답이다. 면역반응의 지속은 장기 반응의 근거가 되며, 면역 억제가 풀리면서 피부·장·내분비기관 등 정상조직의 염증도 가능하다.',
      '틀린 설명이다. 면역관문 억제제는 다른 항암제 또는 다른 관문 억제제와 병용할 수 있다. 병용 자체가 기억세포 소실을 뜻하지 않는다.',
      '틀린 설명이다. 면역관문 억제제의 특징적 독성은 면역반응에 의한 정상조직 염증이다. 골수세포의 비특이적 직접 손상은 전통적 세포독성 약물에서 더 중심적인 개념이다.'
    ],
    rationale: '면역항암제는 면역기억을 통해 약물 노출 이후에도 반응이 이어질 수 있다. 같은 면역 활성화가 정상조직을 공격하는 이상반응의 원인이 될 수도 있다.',
    notesPages: [41],
    examRefs: [{ id: '32-2022-60-p77', page: 77 }, { id: '★항체-2021-88-p71', page: 71 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 209 }, { label: 'Om 약리학 요약(2025)', page: 213 }],
    verifiedSources: ['https://www.cancer.gov/about-cancer/treatment/types/immunotherapy/checkpoint-inhibitors']
  },
  {
    id: 'comp-L32-Q5', lecture: 32,
    concept: '자가유래 CAR-T의 제작 원리와 cytokine release syndrome',
    format: 'judgment', polarity: 'incorrect',
    stem: '환자 자신의 T세포를 이용하는 CAR-T 세포치료에 대한 설명으로 옳지 않은 것은?',
    options: [
      '환자의 T세포를 채집하여 암 항원을 인식하는 수용체가 발현되도록 유전적으로 조작한다.',
      '체외에서 조작한 T세포를 증식시킨 뒤 환자에게 주입하는 세포치료 방식이다.',
      'CD19는 B세포 계열 혈액종양을 대상으로 하는 대표적인 CAR 표적이다.',
      '정제한 항종양 항체를 환자의 혈장에 섞어 되돌려 주는 것이 CAR-T의 세포 제작 과정이다.',
      '활성화된 면역세포의 과도한 사이토카인 방출로 cytokine release syndrome이 생길 수 있다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳은 설명이다. CAR-T에서는 T세포에 합성 항원수용체 유전자를 도입하여 표적 항원을 인식하도록 만든다.',
      '옳은 설명이다. 자가유래 CAR-T는 채집·유전자 조작·증식 후 세포를 환자에게 주입하는 과정을 포함한다.',
      '옳은 설명이다. CD19를 인식하도록 설계한 CAR-T는 여러 B세포 악성종양 치료의 대표적 예이다.',
      '틀린 설명으로 정답이다. 핵심은 항체를 혈장에 섞는 것이 아니라 T세포 자체가 표적을 인식하고 반응하도록 유전적으로 바꾸는 것이다.',
      '옳은 설명이다. CAR-T 활성화 후 생기는 전신적 사이토카인 방출은 중요한 독성이다. 이는 단순 항체 주입과 구별되는 세포치료의 특징이다.'
    ],
    rationale: 'CAR-T의 치료 단위는 유전적으로 조작한 살아 있는 T세포이다. 환자에게서 항체를 분리하여 주입하는 방식으로 이해하면 안 된다.',
    notesPages: [41],
    examRefs: [{ id: '32-2025-96-p76', page: 76 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 214 }],
    verifiedSources: ['https://www.cancer.gov/about-cancer/treatment/research/car-t-cells']
  },
  {
    id: 'comp-L33-Q1', lecture: 33,
    concept: '일차성 부신피질 기능저하의 두 호르몬 축 보충',
    format: 'case',
    stem: '자가면역성 부신피질 파괴로 cortisol과 aldosterone이 함께 감소하고 ACTH가 상승하였다. 두 호르몬 결핍을 각각 보완하는 약물 조합은?',
    options: [
      'Hydrocortisone + fludrocortisone',
      'Hydrocortisone + metyrapone',
      'Fludrocortisone + ketoconazole',
      'Metyrapone + dexamethasone',
      'Ketoconazole + mifepristone'
    ],
    answerIndex: 0,
    explanations: [
      '정답이다. Hydrocortisone은 cortisol을 보충하고 fludrocortisone은 강한 mineralocorticoid 작용으로 aldosterone 결핍을 보완한다.',
      'Hydrocortisone은 cortisol을 보충하지만 metyrapone은 CYP11B1을 억제하여 cortisol 합성을 낮춘다. 두 결핍 축을 보완하는 조합이 아니다.',
      'Fludrocortisone은 mineralocorticoid 작용을 보완하지만 ketoconazole은 부신 스테로이드 합성을 억제한다.',
      'Dexamethasone은 강한 glucocorticoid이지만 mineralocorticoid 작용은 매우 적고, metyrapone은 cortisol 합성을 억제한다.',
      'Ketoconazole은 스테로이드 합성을, mifepristone은 glucocorticoid 수용체 작용을 억제한다. 결핍을 보충하는 조합과 반대 방향이다.'
    ],
    rationale: '부신 자체의 손상에서는 cortisol 감소에도 ACTH가 높다. Aldosterone까지 부족한 경우 glucocorticoid와 mineralocorticoid 기능을 함께 보완해야 한다.',
    notesPages: [42, 43],
    examRefs: [{ id: '33-2025-58-p78', page: 78 }, { id: '33-2021-90-p79', page: 79 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 218 }, { label: 'Om 약리학 요약(2025)', page: 222 }],
    verifiedSources: []
  },
  {
    id: 'comp-L33-Q2', lecture: 33,
    concept: '11β-HSD2가 만드는 신장 mineralocorticoid 선택성',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Cortisol과 cortisone의 전환 및 mineralocorticoid 수용체 조절에 대한 설명으로 옳지 않은 것은?',
    options: [
      '신장의 11β-HSD2는 cortisol을 cortisone으로 전환한다.',
      '11β-HSD2는 cortisol이 신장의 mineralocorticoid 수용체를 과도하게 자극하지 못하도록 돕는다.',
      '간과 지방의 11β-HSD1은 cortisone을 cortisol로 전환하여 국소 활성을 높인다.',
      '감초 성분이 11β-HSD2를 억제하면 cortisol에 의한 mineralocorticoid 작용이 감소한다.',
      'Mineralocorticoid 작용이 과도해지면 나트륨 저류와 칼륨 소실이 나타날 수 있다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳은 설명이다. 11β-HSD2는 신장 등에서 활성 cortisol을 수용체 활성이 낮은 cortisone으로 바꾼다.',
      '옳은 설명이다. Cortisol도 MR에 결합할 수 있으므로 수용체 주변에서 cortisol을 불활성화하는 과정이 aldosterone 선택성에 중요하다.',
      '옳은 설명이다. 11β-HSD1의 대표적인 순방향 작용은 간·지방에서 cortisone을 활성 cortisol로 전환하는 것이다.',
      '틀린 설명으로 정답이다. 11β-HSD2 억제는 cortisol의 불활성화를 줄여 MR 자극을 증가시킨다. 고혈압과 저칼륨혈증이 발생할 수 있다.',
      '옳은 설명이다. MR 활성화는 신장의 나트륨 재흡수와 칼륨 분비를 촉진하여 체액량 증가 및 저칼륨혈증을 유발할 수 있다.'
    ],
    rationale: '11β-HSD2는 cortisol을 불활성화하여 신장의 MR을 보호한다. 이 효소가 억제되면 cortisol이 더 많이 MR에 작용하는 방향으로 바뀐다.',
    notesPages: [42],
    examRefs: [{ id: '33-2023-69-p78', page: 78 }, { id: '33-2019-82-p80', page: 80 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 219 }],
    verifiedSources: []
  },
  {
    id: 'comp-L33-Q3', lecture: 33,
    concept: '장기 외인성 glucocorticoid의 HPA 축 억제와 회복 지연',
    format: 'case',
    stem: 'Prednisone을 장기간 사용한 뒤 약물 노출이 갑자기 줄었다. 원래 질환의 재발과 별개로 저혈압과 부신기능저하가 생길 수 있는 가장 직접적인 내분비 기전은?',
    options: [
      '외인성 약물이 aldosterone 분해를 촉진하여 나트륨 재흡수가 증가한다.',
      'Glucocorticoid 수용체가 소실되어 혈중 cortisol이 급격히 과다해진다.',
      'ACTH 억제로 저하된 부신의 cortisol 합성이 회복되는 데 시간이 필요하다.',
      '음성 되먹임이 강화되어 부신에서 cortisol 합성이 곧바로 증가한다.',
      '장기간 축적된 prednisone이 cortisol 합성 효소를 비가역적으로 억제한다.'
    ],
    answerIndex: 2,
    explanations: [
      '외인성 glucocorticoid 중단의 핵심은 cortisol 생성 축의 억제이다. Aldosterone 분해와 나트륨 재흡수 증가로 부신기능저하를 설명할 수 없다.',
      '갑작스러운 노출 감소 후 문제는 내인성 cortisol 공급 부족이다. Cortisol 과다나 GR 소실이 중심 기전은 아니다.',
      '정답이다. 장기간의 음성 되먹임으로 CRH·ACTH가 억제되고 부신 기능이 저하되어, 외인성 약물이 줄어도 내인성 cortisol이 즉시 보충되지 못한다.',
      '외인성 약물이 줄면 억제성 되먹임은 약해지는 방향이다. 다만 HPA 축과 부신의 기능 회복에는 시간이 필요하다.',
      'Prednisone의 핵심 기전은 GR을 통한 되먹임이며 cortisol 합성 효소의 비가역적 직접 억제가 아니다. HPA 축의 기능 회복 지연이 문제이다.'
    ],
    rationale: '장기 투여의 음성 되먹임은 약물 농도가 떨어진 직후에 바로 되돌아가지 않는다. 외인성 공급 감소와 내인성 합성 회복 사이의 시간차가 부신기능저하를 설명한다.',
    notesPages: [42, 43],
    examRefs: [{ id: '33-2021-92-p79', page: 79 }, { id: '33-2020-92-p79', page: 79 }, { id: '33-2019-84-p80', page: 80 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 218 }, { label: 'Om 약리학 요약(2025)', page: 224 }],
    verifiedSources: []
  },
  {
    id: 'comp-L33-Q4', lecture: 33,
    concept: 'Glucocorticoid 과다의 대사·뼈·감염·안과 독성',
    format: 'judgment', polarity: 'incorrect',
    stem: '전신 glucocorticoid를 장기간 과다 노출했을 때의 변화로 옳지 않은 것은?',
    options: [
      '당신생 증가와 인슐린 저항성은 고혈당에 기여한다.',
      '근육 단백질의 분해 억제와 합성 증가는 근비대를 유발한다.',
      '뼈 대사에 대한 영향으로 골다공증과 골절 위험이 증가할 수 있다.',
      '면역반응 억제는 감염 위험 증가와 연결된다.',
      '안압 상승과 백내장은 장기간 노출에서 고려하는 이상반응이다.'
    ],
    answerIndex: 1,
    explanations: [
      '옳은 설명이다. Glucocorticoid는 당신생을 촉진하고 말초에서 인슐린 작용을 저해하여 고혈당을 유발할 수 있다.',
      '틀린 설명으로 정답이다. Glucocorticoid 과다는 단백질 이화를 촉진하여 근위축과 근력 저하를 일으킬 수 있다. 근비대는 대표적 변화가 아니다.',
      '옳은 설명이다. 골형성 억제와 칼슘 대사 변화 등으로 골소실과 골절 위험이 증가한다.',
      '옳은 설명이다. 항염증·면역억제 작용이 치료효과인 동시에 병원체에 대한 방어 약화의 원인이 된다.',
      '옳은 설명이다. 녹내장과 백내장은 glucocorticoid의 장기 이상반응에 포함된다.'
    ],
    rationale: 'Glucocorticoid 과다의 대표적인 조합은 고혈당, 단백질 이화에 따른 근위축, 골소실 및 면역억제이다. 근육량 증가로 바꾸어 연결하면 틀린 설명이 된다.',
    notesPages: [42, 43],
    examRefs: [{ id: '33-2025-60-p78', page: 78 }, { id: '33-2022-9-p79', page: 79 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 224 }],
    verifiedSources: []
  },
  {
    id: 'comp-L33-Q5', lecture: 33,
    concept: '부신 스테로이드 합성 억제와 수용체 작용의 구별',
    format: 'association',
    stem: '부신피질 호르몬 관련 약물과 주요 작용의 연결로 옳은 것은?',
    options: [
      'Ketoconazole — mineralocorticoid 수용체의 직접 작용제',
      'Mifepristone — CYP11B1 억제를 통한 cortisol 합성 차단',
      'Fludrocortisone — glucocorticoid 수용체의 선택적 길항',
      'Dexamethasone — CYP11B2 억제를 통한 aldosterone 합성 차단',
      'Metyrapone — CYP11B1 억제를 통한 cortisol 합성 감소'
    ],
    answerIndex: 4,
    explanations: [
      'Ketoconazole은 여러 스테로이드 합성 CYP를 억제한다. MR을 직접 자극하는 대표적인 약물은 fludrocortisone이다.',
      'Mifepristone은 progesterone 수용체 및 glucocorticoid 수용체 길항 작용을 한다. CYP11B1을 억제하는 약물은 metyrapone이다.',
      'Fludrocortisone은 강한 mineralocorticoid 작용을 나타내며 수용체 길항제가 아니다.',
      'Dexamethasone은 강력하고 작용이 긴 GR 작용제이다. 음성 되먹임으로 ACTH를 억제할 수 있지만 CYP11B2 억제제로 분류하지 않는다.',
      '정답이다. CYP11B1은 cortisol 합성의 마지막 11β-hydroxylation 단계에 관여하며 metyrapone이 이를 억제한다. Aldosterone 합성의 CYP11B2와 구별한다.'
    ],
    rationale: '호르몬 합성 효소를 억제하는 약물과 이미 생성된 호르몬의 수용체에 작용하는 약물을 구별한다. Metyrapone의 표적은 cortisol 합성 효소인 CYP11B1이다.',
    notesPages: [42, 43],
    examRefs: [{ id: '33-2023-67-p78', page: 78 }, { id: '33-2023-68-p78', page: 78 }, { id: '33-2021-91-p79', page: 79 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 216 }, { label: 'Om 약리학 요약(2025)', page: 222 }, { label: 'Om 약리학 요약(2025)', page: 225 }],
    verifiedSources: ['https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5e09acc0-fd26-4722-b8b3-46e560390d47']
  },
  {
    id: 'comp-L34-Q1', lecture: 34,
    concept: 'Aspirin의 비가역적 COX 억제와 혈소판 효과 지속',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Aspirin의 혈소판 작용과 이상반응에 대한 설명으로 옳지 않은 것은?',
    options: [
      'COX를 비가역적으로 아세틸화하여 혈소판의 thromboxane A2 생성을 줄인다.',
      '혈소판은 핵이 없어 억제된 COX를 충분히 재합성하지 못하므로 작용이 오래 지속된다.',
      'Aspirin이 혈중에서 제거되면 기존 혈소판의 TxA2 생성도 회복된다.',
      '항응고제와 병용하면 지혈에 대한 영향이 겹쳐 출혈 위험이 증가할 수 있다.',
      '바이러스 감염을 앓는 소아·청소년에서 Reye 증후군과 관련된다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳은 설명이다. Aspirin은 COX를 비가역적으로 억제하여 혈소판 응집을 촉진하는 TxA2 생성을 감소시킨다.',
      '옳은 설명이다. 혈소판의 COX 회복 능력이 제한되므로 혈중 약물의 짧은 반감기보다 항혈소판 효과가 길게 지속된다.',
      '틀린 설명으로 정답이다. 이미 비가역적으로 억제된 혈소판은 혈중 약물이 사라져도 바로 기능을 되찾지 못한다. 기능 회복에는 새로운 혈소판의 유입이 중요하다.',
      '옳은 설명이다. 혈소판 기능 억제와 항응고 작용이 함께 작용하면 출혈 위험이 증가한다.',
      '옳은 설명이다. Aspirin과 바이러스성 질환 관련 Reye 증후군의 연관은 해열·진통제 선택에서 중요한 약리학적 사실이다.'
    ],
    rationale: 'Aspirin의 혈중 소실과 비가역적으로 억제된 혈소판의 기능 회복은 다른 과정이다. 약물의 반감기만으로 항혈소판 작용의 지속시간을 판단할 수 없다.',
    notesPages: [44],
    examRefs: [{ id: '34-2025-53-p80', page: 80 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 229 }, { label: 'Om 약리학 요약(2025)', page: 231 }],
    verifiedSources: []
  },
  {
    id: 'comp-L34-Q2', lecture: 34,
    concept: 'COX-2 선택성과 위장관·심혈관 위험의 관계',
    format: 'judgment', polarity: 'incorrect',
    stem: 'COX 선택성과 NSAID의 작용에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Celecoxib은 비선택적 NSAID보다 COX-2에 대한 선택성이 높다.',
      '위점막 보호에 관여하는 prostaglandin 감소는 NSAID 관련 궤양과 연결된다.',
      'COX-2 선택성이 높으면 비선택적 약물보다 위장관 손상이 상대적으로 적을 수 있다.',
      'COX-2 선택적 억제는 혈관 PGI2를 감소시키면서 혈소판 TxA2를 비교적 보존할 수 있다.',
      'COX-2 선택제는 혈소판 COX-1을 비가역적으로 억제한다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. Celecoxib은 선택적 COX-2 억제제이며 ibuprofen 등 비선택적 약물과 구분된다.',
      '옳은 설명이다. COX 억제로 위점막 방어에 기여하는 prostaglandin이 줄면 궤양과 출혈 위험이 높아질 수 있다.',
      '옳은 설명이다. COX-1을 상대적으로 보존하면 위장관 위험이 낮아질 수 있다. 다만 위험이 완전히 없어지는 것은 아니다.',
      '옳은 설명이다. 항혈소판·혈관 확장 작용의 PGI2가 줄고 혈소판 TxA2가 보존되는 불균형은 혈전성 심혈관 위험을 설명한다.',
      '틀린 설명으로 정답이다. COX-2 선택제는 aspirin처럼 혈소판 COX-1을 비가역적으로 억제하지 않는다. 위장관 이점과 항혈소판 효과를 같은 것으로 보면 안 된다.'
    ],
    rationale: 'COX-2 선택제의 위장관 이점은 혈소판 COX-1 억제의 강화를 의미하지 않는다. PGI2와 TxA2의 균형 변화 때문에 심혈관 위험은 별도로 고려한다.',
    notesPages: [43, 44],
    examRefs: [{ id: '34-2025-52-p80', page: 80 }, { id: '34-2023-71-p81', page: 81 }, { id: '34-2019-86-p83', page: 83 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 228 }, { label: 'Om 약리학 요약(2025)', page: 229 }],
    verifiedSources: []
  },
  {
    id: 'comp-L34-Q3', lecture: 34,
    concept: '통풍 치료의 요산 생성·재흡수·분해 및 염증 억제',
    format: 'association',
    stem: '통풍 관련 약물과 작용의 연결로 옳은 것은?',
    options: [
      'Allopurinol — xanthine oxidase 억제로 요산 생성을 감소시킨다.',
      'Colchicine — URAT1 억제로 요산의 신장 재흡수를 감소시킨다.',
      'Probenecid — 원위세뇨관의 xanthine oxidase를 억제하여 요산 생성을 줄인다.',
      'Febuxostat — uricase 작용으로 요산을 allantoin으로 분해한다.',
      'Pegloticase — tubulin에 결합하여 호중구의 관절 유입을 감소시킨다.'
    ],
    answerIndex: 0,
    explanations: [
      '정답이다. Allopurinol은 xanthine oxidase를 억제하여 hypoxanthine·xanthine에서 요산으로 이어지는 생성을 줄인다.',
      'Colchicine은 tubulin과 미세소관에 작용하여 호중구의 이동과 염증반응을 억제한다. URAT1 억제에 의한 요산 배설 촉진과 다르다.',
      'Probenecid는 근위세뇨관의 요산 재흡수를 억제하여 배설을 증가시킨다. 원위세뇨관 작용이나 XO 억제로 연결하면 틀리다.',
      'Febuxostat는 비퓨린계 xanthine oxidase 억제제이다. Uricase를 이용한 요산 분해는 pegloticase 등의 작용이다.',
      'Pegloticase는 uricase로 작용하여 요산을 allantoin으로 분해한다. Tubulin 결합과 호중구 이동 억제는 colchicine의 특징이다.'
    ],
    rationale: '요산 생성 감소는 XO 억제, 배설 증가는 근위세뇨관 재흡수 억제, 분해 촉진은 uricase로 구분한다. Colchicine은 요산량보다 염증반응에 작용한다.',
    notesPages: [45],
    examRefs: [{ id: '34-2025-54-p81', page: 81 }, { id: '34-2019-87-p83', page: 83 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 230 }],
    verifiedSources: []
  },
  {
    id: 'comp-L34-Q4', lecture: 34,
    concept: 'DMARD의 공동자극·IL-6R·JAK 표적 구별',
    format: 'association',
    stem: '류마티스관절염 관련 약물과 직접 작용의 연결로 옳은 것은?',
    options: [
      'Tocilizumab — 세포 내 JAK를 직접 억제하여 cytokine 신호를 차단한다.',
      'Tofacitinib — TNF에 결합하여 수용체 활성화를 막는 단일클론항체이다.',
      'Abatacept — CD80/86에 결합하여 T세포 공동자극을 차단한다.',
      'Adalimumab — IL-6 수용체에 결합하여 IL-6 신호를 차단하는 항체이다.',
      'Methotrexate — IL-1β를 중화하여 염증성 신호를 억제하는 항체이다.'
    ],
    answerIndex: 2,
    explanations: [
      'Tocilizumab은 IL-6 수용체에 결합하여 신호를 차단하는 항체이다. 세포 내 JAK를 직접 억제하는 약물은 tofacitinib이다.',
      'Tofacitinib은 저분자 JAK 억제제이다. TNF 중화 항체와 약물 형태 및 작용 위치가 모두 다르다.',
      '정답이다. Abatacept의 직접 결합 상대는 항원제시세포의 CD80/86이다. 이들이 T세포 CD28과 상호작용하는 것을 막아 공동자극을 줄인다.',
      'Adalimumab은 TNF를 표적으로 하는 항체이다. IL-6 수용체 항체는 tocilizumab이다.',
      'Methotrexate는 합성 DMARD이며 항체 제제가 아니다. IL-1β를 표적으로 하는 항체의 예는 canakinumab이다.'
    ],
    rationale: '항체가 결합하는 세포 외 분자와 저분자가 억제하는 세포 내 kinase를 구별한다. Abatacept는 CTLA-4를 차단하는 항체가 아니라 CD80/86을 통한 공동자극을 막는 약물이다.',
    notesPages: [45],
    examRefs: [],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 183 }, { label: 'Om 약리학 요약(2025)', page: 185 }],
    verifiedSources: ['https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=0836c6ac-ee37-5640-2fed-a3185a0b16eb']
  },
  {
    id: 'comp-L34-Q5', lecture: 34,
    concept: 'NSAID의 신장 prostaglandin 억제와 혈류 감소',
    format: 'case',
    stem: '탈수 상태에서 이뇨제와 ACE 억제제를 사용 중인 사람에게 NSAID 노출이 추가되었다. NSAID가 사구체여과율을 더 낮출 수 있는 기전으로 가장 적절한 것은?',
    options: [
      'Renin 분비를 증가시켜 원심세동맥을 선택적으로 이완한다.',
      '신장 PG 생성을 줄여 구심세동맥의 확장을 억제한다.',
      '집합관의 ENaC를 차단하여 사구체 내 압력을 직접 증가시킨다.',
      '근위세뇨관 URAT1을 억제하여 수입세동맥의 저항을 낮춘다.',
      'Aldosterone 수용체를 자극하여 구심세동맥을 확장한다.'
    ],
    answerIndex: 1,
    explanations: [
      'ACE 억제제는 angiotensin II에 의한 원심세동맥 수축을 줄일 수 있지만, 제시한 renin 증가·선택적 이완은 NSAID의 직접 기전이 아니다.',
      '정답이다. 체액량이 감소하면 PGE2·PGI2의 구심세동맥 확장 작용이 신장 관류 유지에 중요해진다. NSAID는 이 보상을 차단하여 GFR 감소를 유발할 수 있다.',
      'ENaC 차단은 amiloride 계열의 작용이다. NSAID의 신장 혈역학적 영향은 COX와 prostaglandin 억제가 중심이다.',
      'URAT1 억제는 요산 재흡수 억제와 관련된다. NSAID 노출에 의한 구심세동맥 확장성 보상 감소를 설명하지 않는다.',
      'NSAID는 aldosterone 수용체 작용제가 아니다. 부종과 혈압 상승이 가능하더라도 이를 직접적인 MR 자극이나 구심세동맥 확장으로 설명하면 안 된다.'
    ],
    rationale: '체액량 감소, 원심세동맥 수축 감소, 구심세동맥 확장 보상 억제가 겹치면 여과압이 낮아질 수 있다. NSAID가 추가하는 변화는 신장 prostaglandin 감소이다.',
    notesPages: [44],
    examRefs: [{ id: '34-2023-71-p81', page: 81 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 229 }],
    verifiedSources: []
  },
  {
    id: 'comp-L35-Q1', lecture: 35,
    concept: 'PTU의 갑상선 합성과 말초 T4→T3 전환 억제',
    format: 'case',
    stem: '체중 감소와 빈맥을 보이며 TSH가 낮고 free T4가 높은 Graves병 환자에서 약물의 작용을 비교하고 있다. 갑상선 호르몬 합성을 억제하면서 말초의 T4→T3 전환도 억제하는 약물은?',
    options: ['Methimazole', 'Levothyroxine', 'Potassium iodide', 'Propylthiouracil', 'Liothyronine'],
    answerIndex: 3,
    explanations: [
      'Methimazole은 TPO를 억제하여 새 호르몬 합성을 줄이지만, PTU와 같은 말초 T4→T3 전환 억제 작용은 나타내지 않는다.',
      'Levothyroxine은 합성 T4로서 호르몬을 보충한다. 호르몬 합성과 말초 전환을 함께 억제하는 약물이 아니다.',
      '고용량 iodide는 호르몬의 유기화와 분비를 일시적으로 억제한다. 말초 T4→T3 전환 억제를 특징으로 하는 thionamide는 아니다.',
      '정답이다. Propylthiouracil은 TPO 관련 합성 단계를 억제하며 말초에서 T4가 활성 T3로 전환되는 것도 억제한다.',
      'Liothyronine은 합성 T3를 보충하는 제제이다. T3 생성 자체를 억제하는 약물이 아니다.'
    ],
    rationale: 'PTU와 methimazole은 갑상선 합성 억제를 공유하지만, PTU에는 말초 T4→T3 전환 억제가 추가된다. 합성과 분비, 호르몬 보충을 구별한다.',
    notesPages: [45, 46],
    examRefs: [{ id: '35-2025-35-p83', page: 83 }, { id: '35-2023-73-p83', page: 83 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 234 }],
    verifiedSources: ['https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=53c5f586-3e72-479d-89ba-379683c8f6ba', 'https://www.niddk.nih.gov/health-information/endocrine-diseases/hyperthyroidism']
  },
  {
    id: 'comp-L35-Q2', lecture: 35,
    concept: '일차성 갑상선기능저하의 되먹임과 levothyroxine 보충',
    format: 'association',
    stem: '뇌하수체 기능이 정상인 일차성 갑상선기능저하증의 검사 양상과 호르몬 보충 약물의 연결로 옳은 것은?',
    options: [
      'Free T4 감소·TSH 감소 — levothyroxine',
      'Free T4 감소·TSH 증가 — levothyroxine',
      'Free T4 증가·TSH 감소 — methimazole',
      'Free T4 증가·TSH 증가 — liothyronine',
      'Free T4 감소·TSH 증가 — propylthiouracil'
    ],
    answerIndex: 1,
    explanations: [
      'T4가 낮을 때 뇌하수체 기능이 정상이면 억제성 되먹임이 줄어 TSH는 높아진다. TSH가 낮거나 부적절하게 정상인 저하증은 중추성 원인을 생각하는 양상이다.',
      '정답이다. 갑상선 자체의 호르몬 생성 저하로 free T4가 낮고, 음성 되먹임 감소에 의해 TSH가 높다. Levothyroxine은 합성 T4를 공급한다.',
      'Free T4 증가·TSH 감소와 methimazole은 갑상선기능항진증 쪽의 연결이다. 제시된 일차성 기능저하증의 검사 양상과 보충 약물에 맞지 않는다.',
      'Free T4가 증가한 양상은 기능저하증에 맞지 않는다. Liothyronine도 합성 T3이지만 이 검사 조합을 일차성 저하증으로 해석하면 틀리다.',
      '검사 양상은 일차성 저하증에 맞지만 propylthiouracil은 호르몬 합성을 억제한다. 결핍을 보충하는 약물이 아니다.'
    ],
    rationale: '정상 뇌하수체는 T4 감소에 TSH 증가로 반응한다. Levothyroxine은 반감기가 긴 합성 T4 제제로 호르몬 결핍을 보충한다.',
    notesPages: [45, 46],
    examRefs: [{ id: '35-2022-66-p84', page: 84 }, { id: '35-2022-43-p84', page: 84 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 233 }, { label: 'Om 약리학 요약(2025)', page: 234 }],
    verifiedSources: []
  },
  {
    id: 'comp-L35-Q3', lecture: 35,
    concept: 'PTH의 신장 칼슘·인 조절과 간접 골흡수 작용',
    format: 'judgment', polarity: 'incorrect',
    stem: 'PTH의 생리 작용에 대한 설명으로 옳지 않은 것은?',
    options: [
      '혈중 이온화 칼슘의 감소는 PTH 분비를 자극한다.',
      '신장에서 칼슘 재흡수를 증가시켜 소변으로의 칼슘 소실을 줄인다.',
      '근위세뇨관의 인 재흡수를 증가시켜 인 배설을 감소시킨다.',
      '신장 1α-hydroxylase를 자극하여 활성 vitamin D 생성에 기여한다.',
      '뼈에서 RANKL 관련 신호를 증가시켜 osteoclast 매개 골흡수를 촉진할 수 있다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳은 설명이다. 부갑상선은 CaSR을 통해 세포외 칼슘을 감지하며 칼슘 감소는 PTH 분비를 증가시키는 방향으로 작용한다.',
      '옳은 설명이다. PTH는 신장 칼슘 재흡수를 높여 혈중 칼슘 유지에 기여한다.',
      '틀린 설명으로 정답이다. PTH는 근위세뇨관의 인 재흡수를 감소시켜 인 배설을 증가시킨다. 칼슘과 인의 신장 작용 방향이 다르다.',
      '옳은 설명이다. 활성 vitamin D의 생성 증가는 장에서 칼슘을 흡수하는 간접 경로를 제공한다.',
      '옳은 설명이다. PTH는 뼈의 osteoblast 계열 세포를 통한 RANKL 신호로 osteoclast의 골흡수에 간접적으로 영향을 준다.'
    ],
    rationale: 'PTH는 신장에서 칼슘은 보존하고 인은 배설시키는 방향으로 작용한다. 장 칼슘 흡수 증가는 활성 vitamin D를 통한 간접 효과이다.',
    notesPages: [46],
    examRefs: [{ id: '35-2025-36-p83', page: 83 }, { id: '35-2023-74-p83', page: 83 }, { id: '35-2020-98-p85', page: 85 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 236 }],
    verifiedSources: []
  },
  {
    id: 'comp-L35-Q4', lecture: 35,
    concept: 'Vitamin D 활성화 단계와 calcimimetic의 CaSR 작용',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Vitamin D 제제 및 calcimimetic에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Cholecalciferol은 간의 25-hydroxylation과 신장의 1α-hydroxylation을 거쳐 활성화된다.',
      'Calcitriol은 신장 1α-hydroxylation을 추가로 거치지 않아도 작용할 수 있는 활성형이다.',
      'Calcitriol은 VDR을 통해 장의 칼슘 흡수 관련 유전자 발현을 증가시킨다.',
      'Calcitriol은 PTH 유전자 발현을 억제하는 되먹임에 관여한다.',
      'Cinacalcet은 CaSR을 차단하여 부갑상선이 칼슘 부족을 감지하게 하고 PTH 분비를 증가시킨다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. Vitamin D3의 대표적인 활성화 경로는 간의 25-OH 형태를 거쳐 신장의 1,25-(OH)2 형태가 되는 과정이다.',
      '옳은 설명이다. Calcitriol 자체가 1,25-dihydroxyvitamin D이므로 활성화를 위한 신장의 마지막 반응을 우회한다.',
      '옳은 설명이다. 활성 vitamin D는 핵수용체 VDR을 통해 장의 칼슘 수송과 흡수에 관여하는 단백질 발현을 촉진한다.',
      '옳은 설명이다. Calcitriol은 PTH 합성·분비의 조절에 관여하며 PTH 유전자 발현을 억제할 수 있다.',
      '틀린 설명으로 정답이다. Cinacalcet은 CaSR의 양성 알로스테릭 조절제로서 칼슘에 대한 감수성을 높여 PTH 분비를 감소시킨다. 수용체 차단제가 아니다.'
    ],
    rationale: 'Vitamin D의 영양형과 활성형을 구별하고, cinacalcet은 칼슘을 직접 공급하지 않고 CaSR 신호를 강화하여 PTH를 낮춘다는 점을 연결한다.',
    notesPages: [46],
    examRefs: [{ id: '35-2019-18-p85', page: 85 }, { id: '35-2021-98-p84', page: 84 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 236 }, { label: 'Om 약리학 요약(2025)', page: 237 }, { label: 'Om 약리학 요약(2025)', page: 238 }],
    verifiedSources: ['https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0ba47b6a-ba49-4d7a-82e1-1c6e49bfa5d7']
  },
  {
    id: 'comp-L35-Q5', lecture: 35,
    concept: '골다공증의 골흡수 억제와 간헐적 PTH 골형성 촉진',
    format: 'judgment', polarity: 'incorrect',
    stem: '골다공증 관련 약물의 작용에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Alendronate는 골 표면에 결합하는 bisphosphonate로 osteoclast 기능을 억제한다.',
      'Denosumab은 osteoclast의 RANK 수용체에 직접 결합하여 RANKL과 경쟁하는 항체이다.',
      'Denosumab은 RANKL 신호를 줄여 osteoclast의 형성과 기능을 억제한다.',
      'Teriparatide의 간헐적 PTH 수용체 자극은 골형성을 촉진할 수 있다.',
      'Denosumab 중단 후에는 골흡수의 반동 증가가 나타날 수 있다.'
    ],
    answerIndex: 1,
    explanations: [
      '옳은 설명이다. Bisphosphonate는 뼈에 대한 친화성이 높은 pyrophosphate 유사체이며 osteoclast 매개 골흡수를 줄인다.',
      '틀린 설명으로 정답이다. Denosumab의 직접 표적은 RANK가 아니라 RANKL이다. 리간드에 결합하여 수용체 활성화를 막는다.',
      '옳은 설명이다. RANKL-RANK 상호작용 억제는 osteoclast 분화·활성과 생존을 줄이는 방향으로 작용한다.',
      '옳은 설명이다. 간헐적인 PTH 수용체 자극은 지속적인 PTH 과다와 달리 골형성 우세의 효과를 낼 수 있다.',
      '옳은 설명이다. Denosumab의 효과가 소실되면 골흡수가 반동적으로 증가할 수 있으며 척추 골절 위험 증가와 연결된다.'
    ],
    rationale: 'Alendronate와 denosumab은 골흡수 억제, teriparatide는 간헐 자극을 통한 골형성 촉진으로 구별한다. Denosumab은 RANKL 항체라는 직접 표적을 정확히 기억한다.',
    notesPages: [46],
    examRefs: [{ id: '35-2019-20-p85', page: 85 }, { id: '32-2021-84-p77', page: 77 }],
    lectureSources: [{ label: 'Om 약리학 요약(2025)', page: 238 }],
    verifiedSources: ['https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=49e5afe9-a0c7-40c4-af9f-f287a80c5c88']
  },
  {
    id: 'comp-L36-Q1', lecture: 36,
    concept: '콜린성·항무스카린성·opioid 중독증후군 구별',
    format: 'association',
    stem: '약물 과다 노출에 의한 급성 중독증후군과 전형적인 소견의 연결로 옳은 것은?',
    options: [
      'Opioid성 — 산동, 심한 발한, 고혈압',
      '항무스카린성 — 축동, 심한 침분비, 설사',
      '콜린성 — 입마름, 산동, 장운동 감소',
      '교감신경흥분성 — 축동, 서맥, 호흡억제',
      '콜린성 — 축동, 침분비 증가, 설사와 서맥'
    ],
    answerIndex: 4,
    explanations: [
      'Opioid성 중독증후군은 의식 저하, 축동과 호흡억제가 대표적이다. 산동·발한·고혈압은 교감신경흥분성 양상에 더 가깝다.',
      '축동·과도한 분비·설사는 muscarinic 자극 증가에 해당한다. 항무스카린성 양상은 입마름·산동·장운동 감소 쪽이다.',
      '입마름·산동·장운동 감소는 muscarinic 작용이 차단된 양상이다. 콜린성에서는 분비와 장운동이 증가하는 방향이다.',
      '교감신경흥분성 양상은 산동·빈맥·고혈압이 대표적이다. 축동과 호흡억제의 조합은 opioid성 양상과 구별해야 한다.',
      '정답이다. 이 소견들은 muscarinic 자극 증가에 부합한다. 유기인계 물질이나 carbamate 등에 의한 cholinesterase 억제에서 나타날 수 있다.'
    ],
    rationale: '축동만으로 구분하기보다 분비와 장운동, 호흡 양상을 함께 본다. 분비 증가·설사는 콜린성, 건조·장운동 감소는 항무스카린성의 특징이다.',
    notesPages: [47],
    examRefs: [{ id: '36-2023-78-p86', page: 86 }, { id: '36-2025-15-p85', page: 85 }],
    lectureSources: [],
    verifiedSources: []
  },
  {
    id: 'comp-L36-Q2', lecture: 36,
    concept: '해독제의 수용체 길항·효소 재활성화·금속 킬레이션 구별',
    format: 'judgment', polarity: 'incorrect',
    stem: '해독제의 표적과 약리 기전에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Naloxone은 opioid 수용체를 길항하여 opioid 작용을 줄인다.',
      'Flumazenil은 GABA-A 수용체 복합체의 benzodiazepine 인식 부위에서 경쟁적으로 작용한다.',
      'Deferoxamine은 철을 킬레이트하여 복합체 형성과 배설을 돕는다.',
      'Atropine은 인산화된 acetylcholinesterase를 재활성화하여 nicotinic 작용을 회복시킨다.',
      'Pralidoxime은 aging이 진행되기 전 인산화된 acetylcholinesterase의 재활성화에 관여한다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳은 설명이다. Naloxone은 수용체 수준에서 opioid와 길항한다. 독성 물질을 화학적으로 킬레이트하는 기전은 아니다.',
      '옳은 설명이다. Flumazenil의 경쟁 부위는 benzodiazepine 인식 부위이며 GABA 자체의 결합 부위를 차단하는 것으로 표현하면 부정확하다.',
      '옳은 설명이다. Deferoxamine은 철과 결합하는 킬레이터이다. 철 수용체를 차단하거나 이미 흡수된 철의 흡수만 막는 기전과 구별한다.',
      '틀린 설명으로 정답이다. Atropine은 muscarinic 수용체 길항제이다. Acetylcholinesterase를 재활성화하거나 nicotinic 수용체 작용을 직접 회복시키는 약물은 아니다.',
      '옳은 설명이다. Pralidoxime은 유기인에 의해 인산화된 효소를 재활성화할 수 있다. 효소-유기인 결합의 aging 이후에는 재활성화가 어려워진다.'
    ],
    rationale: 'Atropine의 수용체 길항과 pralidoxime의 효소 재활성화를 구별한다. Flumazenil은 benzodiazepine 결합 부위, deferoxamine은 철 자체에 작용한다.',
    notesPages: [48],
    examRefs: [{ id: '36-2025-104-p86', page: 86 }, { id: '36-2023-77-p86', page: 86 }, { id: '36-2025-105-p86', page: 86 }],
    lectureSources: [],
    verifiedSources: ['https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=442ed32b-b508-40cc-9915-ff05674566da', 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d91e16df-8daa-4cd2-86a2-273eaa2446e0']
  },
  {
    id: 'comp-L36-Q3', lecture: 36,
    concept: 'Acetaminophen의 NAPQI·glutathione과 NAC의 해독 원리',
    format: 'judgment', polarity: 'correct',
    stem: 'Acetaminophen의 간독성과 N-acetylcysteine의 작용에 대한 설명으로 옳은 것은?',
    options: [
      'Glutathione이 고갈되면 NAPQI와 간세포 단백질의 결합이 줄어 간독성이 감소한다.',
      'Acetaminophen의 glucuronidation은 NAPQI를 생성하는 대표적인 독성 활성화 경로이다.',
      'N-acetylcysteine은 glutathione을 유지·회복시키고 반응성 대사산물의 해독을 돕는다.',
      'N-acetylcysteine은 alcohol dehydrogenase를 억제하여 acetaminophen의 독성 대사를 줄인다.',
      'Acetaminophen의 간손상은 주로 COX의 비가역적 아세틸화에 의해 발생한다.'
    ],
    answerIndex: 2,
    explanations: [
      '틀린 설명이다. Glutathione은 NAPQI 해독에 필요하다. 고갈되면 NAPQI의 단백질 결합과 간세포 손상이 증가한다.',
      '틀린 설명이다. Glucuronidation과 sulfation은 주요 포합·배설 경로이다. NAPQI는 일부 약물이 CYP 산화 경로를 거치면서 생성된다.',
      '옳은 설명으로 정답이다. N-acetylcysteine은 glutathione의 유지·회복을 돕고 반응성 대사산물의 해독에 기여하여 간손상을 줄인다.',
      '틀린 설명이다. Alcohol dehydrogenase 억제는 methanol 등의 독성 대사산물 생성을 줄이는 fomepizole의 기전이다. NAC의 핵심 작용과 다르다.',
      '틀린 설명이다. 과량 acetaminophen의 특징적인 간독성은 NAPQI 생성과 glutathione 고갈로 설명한다. 비가역적 COX 아세틸화는 aspirin의 작용이다.'
    ],
    rationale: '해독 능력을 넘어선 NAPQI가 간세포를 손상시킨다. NAC는 glutathione 관련 해독을 보완하는 약물이며, 소변 알칼리화나 alcohol dehydrogenase 억제제와 구별한다.',
    notesPages: [44, 47, 48],
    examRefs: [{ id: '36-2025-105-p86', page: 86 }, { id: '36-2020-100-p87', page: 87 }, { id: '36-2019-6-p87', page: 87 }],
    lectureSources: [],
    verifiedSources: ['https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=6588c28d-0515-4cdf-99d3-c4ad3fd0976c']
  },
  {
    id: 'comp-L36-Q4', lecture: 36,
    concept: 'Salicylate의 소변 알칼리화와 ion trapping',
    format: 'judgment', polarity: 'correct',
    stem: '약산성 물질인 salicylate의 신장 배설과 소변 pH의 관계에 대한 설명으로 옳은 것은?',
    options: [
      '소변을 알칼리화하면 이온형의 비율이 증가하여 수동적 재흡수가 감소한다.',
      '소변을 알칼리화하면 비이온형의 비율이 증가하여 세뇨관 재흡수가 촉진된다.',
      '소변을 산성화하면 이온형의 비율이 증가하여 세뇨관 내 포획이 강화된다.',
      'Bicarbonate는 salicylate와 킬레이트 복합체를 만들어 여과를 증가시킨다.',
      '소변 pH의 변화는 장내 salicylate 흡착을 증가시켜 배설을 촉진한다.'
    ],
    answerIndex: 0,
    explanations: [
      '옳은 설명으로 정답이다. 약산은 pH가 높아지면 해리된 이온형의 비율이 커진다. 이온형은 지질막을 통한 수동 확산이 어려워 소변 쪽에 남기 쉬워진다.',
      '틀린 설명이다. 알칼리화는 약산의 비이온형이 아니라 이온형 비율을 높인다. 이 때문에 수동 재흡수는 줄어드는 방향이다.',
      '틀린 설명이다. 약산은 산성 환경에서 상대적으로 비이온형 비율이 증가하므로 제시한 이온형 증가와 방향이 반대이다.',
      '틀린 설명이다. Bicarbonate의 관련 원리는 pH 변화와 이온화이다. 금속 킬레이터처럼 salicylate를 포획하는 기전이 아니다.',
      '틀린 설명이다. 소변 pH 조절은 신장에서의 재흡수와 배설에 영향을 준다. 장관 내 흡착은 활성탄의 다른 작용이다.'
    ],
    rationale: '약산의 소변 알칼리화는 이온형 증가 → 수동 재흡수 감소 → 배설 증가의 관계로 이해한다. 이는 독성 물질의 체내 처분을 바꾸는 길항 기전이다.',
    notesPages: [44, 47, 48],
    examRefs: [{ id: '36-2025-105-p86', page: 86 }],
    lectureSources: [],
    verifiedSources: ['https://www.clintox.org/wp-content/uploads/2016/04/Position-Paper-on-Urine-Alkalinization.pdf']
  },
  {
    id: 'comp-L36-Q5', lecture: 36,
    concept: '활성탄의 장관 내 흡착과 킬레이션·배설 촉진의 구별',
    format: 'association',
    stem: '활성탄이 일부 경구 독성물질의 체내 흡수를 감소시키는 주된 원리는?',
    options: [
      '금속 이온과 수용성 킬레이트 복합체를 형성한다.',
      '소변 pH를 높여 약산성 물질의 재흡수를 감소시킨다.',
      'Alcohol dehydrogenase를 억제하여 독성 대사산물 생성을 줄인다.',
      '넓은 표면에 장관 내 독성물질을 흡착하여 흡수 가능한 양을 줄인다.',
      '혈액 속 유리 약물을 반투과막을 통해 체외로 제거한다.'
    ],
    answerIndex: 3,
    explanations: [
      '금속과 복합체를 만드는 것은 deferoxamine 같은 킬레이터의 원리이다. 활성탄은 철 등 일부 물질을 잘 흡착하지 못한다.',
      '소변 pH 변화에 의한 ion trapping은 신장 배설을 바꾸는 방법이다. 활성탄의 장관 내 흡착과 작용 위치가 다르다.',
      'Alcohol dehydrogenase 억제는 fomepizole의 작용이다. 활성탄은 흡수된 독성물질의 대사효소를 직접 억제하는 약물이 아니다.',
      '정답이다. 활성탄은 넓은 표면에 일부 물질을 흡착한다. 위벽을 코팅하거나 금속을 킬레이트하는 것으로 이해하면 부정확하다.',
      '반투과막을 통한 혈액 내 물질 제거는 혈액투석의 원리이다. 활성탄은 장관 내에서 작용한다.'
    ],
    rationale: '활성탄은 장관 내 흡착제이다. 킬레이션, 대사 억제, 소변 pH 조절, 혈액투석과 각각의 작용 위치·원리를 구별해야 한다.',
    notesPages: [47],
    examRefs: [{ id: '36-2025-103-p85', page: 85 }, { id: '36-2022-56-p86', page: 86 }],
    lectureSources: [],
    verifiedSources: ['https://www.poison.org/articles/activated-charcoal', 'https://www.clintox.org/wp-content/uploads/2016/04/Position-Statement-Single-Dose-Activated-Charcoal.pdf']
  }
];
