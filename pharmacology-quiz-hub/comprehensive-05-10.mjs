export default [
  {
    id: 'comp-L05-Q1', lecture: 5,
    concept: '상가·상승·증강작용과 생리학적·화학적 길항의 구별',
    format: 'judgment', polarity: 'incorrect',
    stem: '약물 상호작용에 대한 설명으로 옳지 않은 것은?',
    options: [
      '상가작용은 병용 효과가 정해진 가산 기준과 일치하는 경우이다.',
      '상승작용은 병용 효과가 정해진 가산 기준보다 큰 경우이다.',
      '증강작용은 단독 효과가 없는 약물이 다른 약물의 효과를 높이는 경우이다.',
      '생리학적 길항은 서로 다른 수용체나 경로를 통해 반대 반응을 내는 경우이다.',
      '화학적 길항은 두 약물이 같은 수용체의 결합 부위를 경쟁하는 경우이다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. 상가작용에서는 병용 효과가 두 약물에 대해 설정한 가산 기준에 부합한다.',
      '옳은 설명이다. 상승작용은 가산 기준을 초과하는 병용 효과를 뜻한다.',
      '옳은 설명이다. 단독 효과가 없는 약물이 다른 약물의 효과를 높이는 현상을 증강작용으로 구별한다.',
      '옳은 설명이다. Histamine의 기관지수축과 salbutamol의 기관지확장처럼 서로 다른 경로가 반대 반응을 낼 수 있다.',
      '옳지 않은 설명이다. 같은 결합 부위의 경쟁은 수용체 길항이다. 화학적 길항은 protamine과 heparin처럼 직접 결합하거나 화학반응으로 작용을 줄이는 경우이다.'
    ],
    rationale: '가산 기준과 비교하는 상가·상승작용, 단독 효과가 없는 물질의 증강작용, 길항이 일어나는 수준을 구별한다. 같은 수용체의 결합 부위 경쟁을 화학적 길항으로 부르면 안 된다.',
    notesPages: [4],
    examRefs: [{ id: '5-6-2025-61-p10', page: 10 }],
    lectureSources: [{ label: '2026 약력학(1)', page: 12 }, { label: '2026 약력학(1)', page: 13 }]
  },
  {
    id: 'comp-L05-Q2', lecture: 5,
    concept: '주요 수용체 계열과 신호전달 방식',
    format: 'association',
    stem: '수용체와 주된 신호전달 방식의 연결로 옳지 않은 것은?',
    options: [
      'Nicotinic acetylcholine 수용체 — 리간드 결합에 따른 이온통로 개방',
      'Muscarinic acetylcholine 수용체 — G단백을 통한 세포 내 신호 조절',
      'Insulin 수용체 — 수용체 tyrosine kinase를 통한 인산화 신호',
      '성장호르몬 수용체 — 연결된 JAK를 통한 STAT 신호전달',
      'PPAR — 세포막의 이종삼량체 G단백을 통한 신호전달'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 연결이다. Nicotinic 수용체는 리간드개폐 양이온통로이며 비교적 빠른 반응을 매개한다.',
      '옳은 연결이다. Muscarinic 수용체는 GPCR로서 G단백을 통해 효소와 이온통로를 조절한다.',
      '옳은 연결이다. Insulin 수용체는 자체 tyrosine kinase 활성을 갖는 수용체이다.',
      '옳은 연결이다. 성장호르몬 수용체에는 자체 kinase 활성이 없고 연결된 JAK가 STAT의 인산화를 매개한다.',
      '옳지 않은 연결이다. PPAR는 핵수용체로서 표적 DNA의 조절 서열과 관련하여 유전자 전사를 조절한다. 이 전사 과정 때문에 효과 발현에 시간이 걸린다.'
    ],
    rationale: '이온통로, GPCR, 효소연결 수용체, 핵수용체의 신호전달 방식을 구별하는 문제이다. PPAR는 GPCR가 아니라 전사를 조절하는 핵수용체이다.',
    notesPages: [4, 5],
    examRefs: [{ id: '5-6-2025-62-p10', page: 10 }, { id: '5-6-2019-30-p16', page: 16 }],
    lectureSources: [{ label: '2026 약력학(1)', page: 21 }, { label: '2026 약력학(1)', page: 25 }, { label: '2026 약력학(1)', page: 26 }, { label: '2026 약력학(1)', page: 27 }]
  },
  {
    id: 'comp-L05-Q3', lecture: 5,
    concept: 'G단백의 활성화·종결과 제2전령',
    format: 'judgment', polarity: 'correct',
    stem: 'G단백 연결 수용체의 신호전달에 대한 설명으로 옳은 것은?',
    options: [
      'Gα에 GDP가 결합하면 활성화되어 표적 효소에 신호를 전달한다.',
      'Gs는 adenylyl cyclase를 억제하여 cAMP 생성을 감소시킨다.',
      'Gαi는 adenylyl cyclase를 활성화하여 cAMP 생성을 증가시킨다.',
      'Gq는 adenylyl cyclase를 억제하여 cAMP 생성을 감소시킨다.',
      'RGS 단백은 Gα의 GTP 가수분해를 촉진하여 신호 종결을 돕는다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳지 않다. Gα-GDP는 불활성 상태이다. 수용체가 GDP와 GTP의 교환을 촉진하면 활성화된 Gα-GTP가 신호전달에 참여한다.',
      '옳지 않다. Gs는 adenylyl cyclase를 활성화하여 cAMP 생성을 증가시킨다. 제시된 억제 작용은 Gi의 경로이다.',
      '옳지 않다. Gαi는 adenylyl cyclase를 억제하여 cAMP 생성을 감소시킨다. 활성화·증가로 연결하면 작용 방향이 반대이다.',
      '옳지 않다. Gq는 PLCβ를 활성화하여 IP3와 DAG 생성을 유도한다. Adenylyl cyclase 억제는 Gi의 대표 경로이다.',
      '정답이다. RGS는 Gα의 GTP 가수분해를 촉진하여 활성 상태가 끝나도록 돕는다. GDP/GTP 교환에 의한 활성화와 구별한다.'
    ],
    rationale: 'Gs·Gi·Gq는 서로 다른 제2전령 경로에 연결된다. RGS는 GTP를 가수분해하도록 도와 활성 신호를 끝내는 조절 단백이다.',
    notesPages: [5],
    examRefs: [{ id: '5-6-2019-30-p16', page: 16 }],
    lectureSources: [{ label: '2026 약력학(1)', page: 22 }, { label: '2026 약력학(1)', page: 23 }]
  },
  {
    id: 'comp-L05-Q4', lecture: 5,
    concept: '부분효현제의 단독 효과와 완전효현제에 대한 경쟁',
    format: 'case',
    stem: '같은 조직에서 약물이 없을 때의 기저반응은 10이고, 완전효현제 A의 최대반응은 100이며, 약물 X의 단독 최대반응은 40이었다. 두 약물은 같은 수용체 결합 부위에서 가역적으로 경쟁하며, A의 농도를 일정하게 유지하고 X를 충분히 추가하면 반응이 감소하였다. X의 분류로 가장 적절한 것은?',
    options: [
      '완전효현제',
      '부분효현제',
      '중성 길항제',
      '역효현제',
      '비가역적 길항제'
    ],
    answerIndex: 1,
    explanations: [
      '적절하지 않다. 같은 조직에서 완전효현제라면 시스템의 최대반응에 도달해야 하지만 X의 최대반응은 A보다 낮다.',
      '정답이다. X는 단독으로 수용체를 활성화하지만 최대반응이 낮다. 완전효현제와 경쟁하면 더 낮은 효능의 X가 수용체를 차지하여 반응을 줄일 수 있다.',
      '적절하지 않다. 중성 길항제는 자체적으로 수용체를 활성화하지 않는다. X는 단독으로 양의 반응을 유발한다.',
      '적절하지 않다. 역효현제는 수용체의 기저 구성활성을 감소시키는 리간드이다. 제시된 X는 완전효현제보다 작지만 양의 효현 반응을 낸다.',
      '적절하지 않다. X의 결합은 가역적이라고 제시되었고, 단독 효현 반응도 있으므로 비가역적 길항제로 분류하지 않는다.'
    ],
    rationale: '부분효현제는 단독으로는 효현제로 작용하면서도, 완전효현제와 함께 있을 때는 결합 경쟁을 통해 반응을 낮출 수 있다.',
    notesPages: [4],
    examRefs: [{ id: '5-6-2021-10-p13', page: 13 }, { id: '5-6-2019-28-p15', page: 15 }],
    lectureSources: [{ label: '2026 약력학(1)', page: 17 }, { label: '2026 약력학(1)', page: 18 }]
  },
  {
    id: 'comp-L05-Q5', lecture: 5,
    concept: '탈감작·수용체 수 변화와 약력학적·약동학적 내성',
    format: 'judgment', polarity: 'incorrect',
    stem: '반복적인 약물 노출에 대한 적응 현상의 설명으로 옳지 않은 것은?',
    options: [
      '수용체 수가 줄지 않아도 신호전달의 변화로 탈감작이 나타날 수 있다.',
      '하향조절은 수용체 수가 감소하는 현상을 의미한다.',
      '대사효소 유도로 같은 투여량의 혈중 노출이 줄면 약동학적 내성이 가능하다.',
      '짧은 시간 내 반복투여로 반응이 빠르게 감소하는 현상을 급성 내성이라 한다.',
      '혈중 농도를 동일하게 맞춘 뒤에도 반응이 작아지면 체내 축적을 의미한다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. 탈감작은 반응 감소이고, 수용체 인산화나 신호 연결 변화 등으로 수용체 수 감소 없이도 발생할 수 있다.',
      '옳은 설명이다. 하향조절은 수용체 수의 감소를 가리키며 반응 감소 자체를 뜻하는 탈감작과 구별한다.',
      '옳은 설명이다. 약물이 더 빨리 대사되어 노출이 감소하면 같은 용량에 대한 반응이 줄어드는 약동학적 내성이 나타날 수 있다.',
      '옳은 설명이다. Tachyphylaxis는 짧은 시간 내 반복 노출에 따른 빠른 반응 감소를 뜻한다.',
      '옳지 않은 설명이다. 같은 농도에서 반응이 감소하는 것은 약력학적 내성을 시사한다. 축적은 이전 용량이 제거되기 전에 반복투여되어 체내 약물량이 증가하는 현상이다.'
    ],
    rationale: '수용체와 신호전달의 적응은 약력학적 내성이고, 대사 증가에 따른 노출 감소는 약동학적 내성이다. 축적은 체내 약물량의 증가라는 별도 개념이다.',
    notesPages: [4, 5],
    examRefs: [{ id: '5-6-2025-66-p11', page: 11 }],
    lectureSources: [{ label: '2026 약력학(1)', page: 10 }, { label: '2026 약력학(1)', page: 12 }, { label: '2026 약력학(1)', page: 29 }]
  },
  {
    id: 'comp-L06-Q1', lecture: 6,
    concept: 'EC50에 의한 효력과 Emax에 의한 최고효능의 독립적 비교',
    format: 'association',
    stem: '같은 조직과 측정 조건에서 약물 A의 EC50은 2 μmol/L, Emax는 60이고, 약물 B의 EC50은 20 μmol/L, Emax는 100이었다. 두 약물의 효력과 최고효능을 바르게 비교한 것은?',
    options: [
      'A는 B보다 효력이 높고 최고효능도 높다.',
      'A는 B보다 효력이 낮고 최고효능도 낮다.',
      'A는 B보다 효력이 높고 최고효능은 낮다.',
      'A는 B보다 효력이 낮고 최고효능은 높다.',
      'A와 B는 효력이 같고 최고효능은 다르다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳지 않다. A의 EC50이 낮아 효력은 높지만, Emax 60은 B의 100보다 낮아 최고효능은 낮다.',
      '옳지 않다. 최고효능이 낮다는 부분은 맞지만 EC50이 낮은 A의 효력은 B보다 높다.',
      '정답이다. EC50이 더 낮은 A가 더 높은 효력을 보이며, Emax가 더 낮으므로 최고효능은 더 작다.',
      '옳지 않다. A의 낮은 EC50과 낮은 Emax를 모두 반대로 해석한 연결이다.',
      '옳지 않다. EC50이 2와 20 μmol/L로 다르므로 효력이 같지 않다. Emax도 서로 다르다.'
    ],
    rationale: '효력은 필요한 농도와 관련되어 EC50이 낮을수록 높다. 최고효능은 최대반응 Emax로 비교하므로 두 지표의 순위는 서로 달라질 수 있다.',
    notesPages: [5, 6],
    examRefs: [{ id: '5-6-2025-64-p11', page: 11 }, { id: '5-6-2022-6-p12', page: 12 }],
    lectureSources: [{ label: '2026 약력학(2)', page: 8 }, { label: '2026 약력학(2)', page: 15 }]
  },
  {
    id: 'comp-L06-Q2', lecture: 6,
    concept: '단계형·실무율 반응과 ED50·치료지수의 의미',
    format: 'judgment', polarity: 'incorrect',
    stem: '집단에서 약물 투여 후 완전 무통증의 달성 여부와 독성 발생 여부를 평가하였다. 이러한 용량–반응 평가에 대한 설명으로 옳지 않은 것은?',
    options: [
      '완전 무통증의 달성 여부를 있음과 없음으로 나누면 실무율 반응이다.',
      '각 개인의 통증 점수 변화량을 연속값으로 측정하면 단계형 반응이다.',
      '실무율 반응의 ED50은 한 개인에서 최대 진통 효과의 절반이 나타나는 용량이다.',
      'TD50을 ED50으로 나눈 값으로 치료지수를 계산할 수 있다.',
      '치료지수는 집단의 유효성과 독성을 비교하지만 개인의 안전을 보장하지는 않는다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳은 설명이다. 정해진 기준을 충족했는지 이진값으로 평가하므로 실무율 반응에 해당한다.',
      '옳은 설명이다. 통증 점수처럼 개인에서 효과의 크기를 연속적으로 측정하면 단계형 반응이다.',
      '옳지 않은 설명이다. 실무율 ED50은 집단의 50%가 정해진 치료반응 기준을 충족하는 용량이다. 최대반응의 절반이라는 설명은 단계형 농도–반응의 EC50과 혼동한 것이다.',
      '옳은 설명이다. 치료지수는 TD50/ED50이며 치료반응과 독성반응의 집단 지표를 비교한다.',
      '옳은 설명이다. 개인차와 각 반응곡선의 분포가 있으므로 치료지수 하나로 개별 환자의 안전 범위를 확정할 수 없다.'
    ],
    rationale: '단계형은 효과의 크기, 실무율은 정해진 반응을 보이는 사람의 비율을 평가한다. 실무율 ED50을 개인 최대반응의 50%로 해석하면 안 된다.',
    notesPages: [5],
    examRefs: [{ id: '5-6-2022-6-p12', page: 12 }, { id: '5-6-2025-64-p11', page: 11 }],
    lectureSources: [{ label: '2026 약력학(2)', page: 4 }, { label: '2026 약력학(2)', page: 8 }, { label: '2026 약력학(2)', page: 9 }]
  },
  {
    id: 'comp-L06-Q3', lecture: 6,
    concept: '경쟁적·비경쟁적·비가역적 길항에 따른 곡선 변화',
    format: 'judgment', polarity: 'correct',
    stem: '완전효현제의 농도–반응곡선과 길항작용에 대한 설명으로 옳은 것은? 가역적 경쟁 길항은 평형 상태에서 평가하며, 비가역적 길항으로 잉여수용체가 소진된 경우를 구별한다.',
    options: [
      '가역적 경쟁 길항제는 효현제의 EC50을 낮추면서 Emax를 유지한다.',
      '가역적 경쟁 길항제는 효현제의 EC50을 높이면서 Emax를 유지한다.',
      '비경쟁적 길항으로 감소한 Emax는 효현제 농도를 높이면 원래 값으로 회복된다.',
      '잉여수용체가 소진된 뒤에도 비가역적 길항제는 Emax를 유지한다.',
      '비경쟁적 길항은 효현제와 동일한 결합 부위에서 가역적으로 경쟁하는 작용이다.'
    ],
    answerIndex: 1,
    explanations: [
      '옳지 않다. 경쟁 길항을 극복하려면 더 높은 효현제 농도가 필요하므로 EC50은 낮아지지 않고 높아진다.',
      '정답이다. 가역적 경쟁 길항은 곡선을 우측으로 이동시키며, 충분한 효현제로 길항을 극복할 수 있어 Emax는 유지된다.',
      '옳지 않다. 비경쟁적 길항으로 최대반응이 감소한 경우에는 효현제를 늘려도 그 감소를 극복할 수 없다.',
      '옳지 않다. 잉여수용체가 남아 있으면 최대반응이 보존될 수 있지만, 소진된 뒤에는 기능 가능한 수용체 감소로 Emax가 낮아진다.',
      '옳지 않다. 같은 부위에서의 가역적 경쟁은 경쟁 길항이다. 비경쟁적 길항은 다른 부위나 신호전달 단계에 작용할 수 있다.'
    ],
    rationale: '가역적 경쟁 길항은 EC50 증가와 Emax 유지가 특징이다. 비가역적 길항의 Emax 변화는 잉여수용체의 존재와 소진 여부를 함께 고려해야 한다.',
    notesPages: [6],
    examRefs: [{ id: '5-6-2021-14-p13', page: 13 }, { id: '5-6-2020-14-p14', page: 14 }],
    lectureSources: [{ label: '2026 약력학(2)', page: 18 }]
  },
  {
    id: 'comp-L06-Q4', lecture: 6,
    concept: '효과부위 평형 지연과 반시계방향 농도–효과 이력',
    format: 'case',
    stem: '활성대사체가 없고 수용체의 수와 민감성이 일정한 약물을 1회 투여하였다. 같은 혈장농도에서 농도 상승기보다 하강기의 효과가 더 컸고, 혈장농도가 최고점에 도달한 뒤에 효과가 최고점에 도달하였다. 이 관찰을 가장 잘 설명하는 것은?',
    options: [
      '혈장과 효과부위 사이의 농도 평형이 지연된다.',
      '반복 노출에 따른 급성 내성이 빠르게 형성된다.',
      '효과가 현재의 혈장농도에 즉시 정비례한다.',
      '약물의 제거에 따라 수용체 수가 점차 감소한다.',
      '혈장과 효과부위의 농도가 측정 내내 즉시 일치한다.'
    ],
    answerIndex: 0,
    explanations: [
      '정답이다. 효과부위 농도가 혈장농도보다 늦게 변하면 같은 혈장농도에서도 하강기의 효과가 더 커지는 반시계방향 이력이 나타날 수 있다.',
      '적절하지 않다. 급성 내성은 뒤 시점의 반응을 줄여 시계방향 이력의 원인이 될 수 있으며, 제시된 일정한 민감성과도 맞지 않는다.',
      '적절하지 않다. 효과가 현재 혈장농도에 즉시 정비례하면 같은 농도에서 상승기와 하강기의 효과가 달라지지 않는다.',
      '적절하지 않다. 수용체 수는 일정하다고 제시되었다. 수 감소에 따른 반응 저하는 뒤 시점의 효과가 더 큰 관찰도 설명하지 못한다.',
      '적절하지 않다. 즉시 평형과 일정한 농도–효과 관계만으로는 혈장농도 최고점보다 늦은 효과 최고점이나 제시된 이력을 설명할 수 없다.'
    ],
    rationale: '혈장과 효과부위 사이의 이동에 시간이 걸리면 혈장농도가 감소하기 시작한 뒤에도 효과가 증가할 수 있다. 이는 반시계방향 농도–효과 이력의 대표적인 기전이다.',
    notesPages: [6, 7],
    examRefs: [{ id: '5-6-2021-12-p13', page: 13 }, { id: '5-6-2023-8-p12', page: 12 }],
    lectureSources: [{ label: '2026 약력학(2)', page: 26 }, { label: '2026 약력학(2)', page: 27 }, { label: '2026 약력학(2)', page: 28 }]
  },
  {
    id: 'comp-L06-Q5', lecture: 6,
    concept: '선형 약동학과 Emax 모형에서 유효 효과의 지속시간',
    format: 'numeric',
    stem: '가상의 약물을 1회 투여한 직후 효과부위농도 C는 20 mg/L이다. C는 반감기 6시간의 일차속도로 감소한다. 효과는 지연 없이 E = 100C/(5 + C)를 따르고, E ≥ 50인 동안 유효하다고 한다. 유효 효과의 지속시간은 얼마인가? 단위는 시간이다.',
    options: ['3', '6', '12', '18', '24'],
    answerIndex: 2,
    explanations: [
      '3시간은 반감기보다 짧아 C가 아직 10 mg/L보다 높다. 유효농도 경계인 5 mg/L에 도달하지 않았다.',
      '6시간 뒤에는 한 번 반감하여 C = 10 mg/L이다. E는 약 66.7이므로 유효 효과가 아직 지속된다.',
      '정답이다. E = 50이 되는 농도는 5 mg/L이다. C가 20 → 10 → 5 mg/L로 두 번 반감하므로 6 × 2 = 12시간이다.',
      '18시간 뒤에는 세 번 반감하여 C = 2.5 mg/L이고 E는 약 33.3이다. 유효 효과의 경계에 도달한 뒤이다.',
      '24시간 뒤에는 네 번 반감하여 C = 1.25 mg/L이고 E = 20이다. 유효 효과는 그보다 앞선 12시간에 경계에 도달한다.'
    ],
    rationale: 'E ≥ 50을 만족하려면 C ≥ 5 mg/L이어야 한다. 초기농도 20 mg/L에서 5 mg/L까지는 두 반감기이므로 유효 효과는 12시간 지속된다.',
    notesPages: [6, 7],
    examRefs: [{ id: '5-6-2025-65-p11', page: 11 }, { id: '5-6-2023-7-p11', page: 11 }, { id: '5-6-2022-78-p12', page: 12 }],
    lectureSources: [{ label: '2026 약력학(2)', page: 15 }, { label: '2026 약력학(2)', page: 22 }, { label: '2026 약력학(2)', page: 33 }]
  },
  {
    id: 'comp-L07-Q1', lecture: 7,
    concept: 'Phase I 반응과 CYP 산화에 필요한 전자전달',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Phase I 약물대사와 cytochrome P450(CYP)에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Phase I 반응에는 산화, 환원, 가수분해가 포함된다.',
      '약물대사에 관여하는 microsomal CYP는 heme을 포함한다.',
      'CYP 산화의 전자전달에는 P450 reductase와 NADPH가 필요하다.',
      '하나의 약물은 기질 특이성이 겹치는 여러 CYP에 의해 대사될 수 있다.',
      'Alcohol dehydrogenase에 의한 산화는 CYP 의존성 반응으로 분류한다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. Phase I은 산화뿐 아니라 환원과 가수분해로 작용기를 도입하거나 노출하는 반응도 포함한다.',
      '옳은 설명이다. 약물대사 CYP는 주로 활면소포체 막에 존재하는 hemeprotein 효소이다.',
      '옳은 설명이다. NADPH의 전자가 P450 reductase를 통해 전달되어 CYP heme의 환원과 산화반응 주기에 이용된다.',
      '옳은 설명이다. CYP 동종효소의 기질 특이성은 부분적으로 겹치므로 한 약물이 여러 CYP의 기질일 수 있다.',
      '옳지 않은 설명이다. Alcohol dehydrogenase는 CYP와 별개의 효소이다. ADH, ALDH, MAO, FMO에 의한 산화는 CYP 비의존성 산화의 예이다.'
    ],
    rationale: 'Phase I과 CYP를 동일한 개념으로 보면 안 된다. CYP는 NADPH와 reductase를 이용하는 주요 산화계이지만, Phase I에는 CYP 비의존성 산화와 환원·가수분해도 포함된다.',
    notesPages: [7],
    examRefs: [{ id: '7-2022-47-p16', page: 16 }, { id: '7-2021-16-p17', page: 17 }, { id: '7-2019-37-p21', page: 21 }],
    lectureSources: [{ label: '2026 약물대사', page: 12 }, { label: '2026 약물대사', page: 13 }, { label: '2026 약물대사', page: 14 }, { label: '2026 약물대사', page: 16 }]
  },
  {
    id: 'comp-L07-Q2', lecture: 7,
    concept: 'Phase II 포합효소와 공여체의 연결',
    format: 'association',
    stem: 'Phase II 대사효소와 해당 반응의 공여체를 바르게 연결한 것은?',
    options: [
      'UDP-glucuronosyltransferase — PAPS',
      'N-acetyltransferase — S-adenosylmethionine',
      'Methyltransferase — S-adenosylmethionine',
      'Sulfotransferase — UDP-glucuronic acid',
      'Glutathione S-transferase — Acetyl-CoA'
    ],
    answerIndex: 2,
    explanations: [
      '옳지 않은 연결이다. UGT의 glucuronidation에는 UDP-glucuronic acid가 이용된다. PAPS는 sulfate 공여체이다.',
      '옳지 않은 연결이다. NAT의 acetylation에는 acetyl-CoA가 이용된다. S-adenosylmethionine은 methyl 공여체이다.',
      '정답이다. Methyltransferase는 S-adenosylmethionine(SAM)의 methyl기를 전달한다.',
      '옳지 않은 연결이다. SULT의 sulfate 공여체는 PAPS이다. UDP-glucuronic acid는 UGT 반응에 이용된다.',
      '옳지 않은 연결이다. GST는 glutathione의 cysteine thiol기를 이용해 기질을 포합한다. Acetyl-CoA를 이용하는 acetylation은 NAT 반응이다.'
    ],
    rationale: 'UGT–UDP-glucuronic acid, SULT–PAPS, NAT–acetyl-CoA, methyltransferase–SAM, GST–glutathione의 연결을 구별한다.',
    notesPages: [8],
    examRefs: [{ id: '7-2021-17-p17', page: 17 }, { id: '7-2020-17-p19', page: 19 }],
    lectureSources: [{ label: '2026 약물대사', page: 23 }, { label: '2026 약물대사', page: 26 }, { label: '2026 약물대사', page: 27 }, { label: '2026 약물대사', page: 28 }]
  },
  {
    id: 'comp-L07-Q3', lecture: 7,
    concept: 'Acetaminophen의 포합·NAPQI 생성·glutathione 해독',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Acetaminophen의 대사와 간독성에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Acetaminophen은 노출된 hydroxyl기가 있어 Phase I 없이도 포합될 수 있다.',
      '일반적인 대사의 주요 경로는 glucuronidation과 sulfation이다.',
      '일부 acetaminophen은 CYP에 의해 반응성 대사체 NAPQI로 전환된다.',
      'Glutathione이 고갈되면 NAPQI의 간세포 단백질 결합이 감소한다.',
      'Glutathione 포합은 생성된 NAPQI의 해독에 기여한다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳은 설명이다. 적합한 작용기가 이미 있으므로 먼저 산화되어야만 Phase II가 가능한 것은 아니다.',
      '옳은 설명이다. Acetaminophen의 대부분은 glucuronide와 sulfate 포합체로 대사된다.',
      '옳은 설명이다. CYP2E1 등을 통한 소량의 산화 경로에서 반응성이 높은 NAPQI가 생성될 수 있다.',
      '옳지 않은 설명이다. Glutathione이 고갈되면 NAPQI의 해독이 부족해져 간세포 단백질과의 공유결합 및 간세포 손상 위험이 증가한다.',
      '옳은 설명이다. Glutathione의 thiol기는 반응성 NAPQI를 포합하여 세포 성분과의 결합을 줄이는 데 기여한다.'
    ],
    rationale: '주요 포합 경로와 소량의 독성 대사체 생성 경로를 구별한다. NAPQI의 생성량과 이를 처리하는 glutathione의 여력이 간독성의 핵심이다.',
    notesPages: [8],
    examRefs: [{ id: '7-2019-36-p20', page: 20 }, { id: '7-2022-20-p16', page: 16 }],
    lectureSources: [{ label: '2026 약물대사', page: 28 }, { label: '2026 약물대사', page: 29 }]
  },
  {
    id: 'comp-L07-Q4', lecture: 7,
    concept: '약물유전학과 전구약물 활성화·활성대사체 제거의 구별',
    format: 'judgment', polarity: 'incorrect',
    stem: '약물대사효소의 기능 변화에 따른 설명으로 옳지 않은 것은? 복제수 증가는 기능성 CYP2D6 유전자의 증가를 의미한다.',
    options: [
      'CYP2D6 복제수가 증가하면 codeine에서 morphine의 생성이 증가할 수 있다.',
      'CYP2C19 기능이 저하되면 해당 경로를 통한 omeprazole 대사가 감소한다.',
      'NAT2 slow acetylator에서는 isoniazid의 대사가 느려져 독성 위험이 커질 수 있다.',
      'UGT1A1 기능이 저하되면 irinotecan의 활성대사체 SN-38의 포합이 감소한다.',
      'CYP2D6 기능 저하는 생성된 morphine의 주된 제거 경로를 차단한다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. CYP2D6는 codeine을 morphine으로 활성화하므로 기능성 유전자의 복제수 증가는 morphine 생성 증가와 연결될 수 있다.',
      '옳은 설명이다. CYP2C19는 omeprazole의 주요 대사 경로 중 하나이며 기능 저하는 이 경로의 대사를 감소시킨다.',
      '옳은 설명이다. NAT2에 의한 acetylation이 느리면 isoniazid 노출과 일부 독성 위험이 증가할 수 있다.',
      '옳은 설명이다. UGT1A1은 SN-38의 glucuronidation에 관여하므로 기능 저하는 SN-38 노출과 독성을 높일 수 있다.',
      '옳지 않은 설명이다. CYP2D6는 codeine에서 morphine이 생성되는 단계에 중요하다. 생성된 morphine의 주요 제거에는 UGT에 의한 glucuronidation이 관여한다.'
    ],
    rationale: '효소 기능이 낮아졌을 때 활성화가 줄어드는지 제거가 줄어드는지를 구별해야 한다. Codeine 활성화의 CYP2D6와 morphine 제거의 UGT는 서로 다른 단계이다.',
    notesPages: [8],
    examRefs: [{ id: '7-2022-68-p17', page: 17 }, { id: '7-2021-19-p18', page: 18 }, { id: '7-2021-21-p18', page: 18 }],
    lectureSources: [{ label: '2026 약물대사', page: 36 }, { label: '2026 약물대사', page: 47 }, { label: '2026 약물대사', page: 49 }, { label: '2026 약물대사', page: 50 }]
  },
  {
    id: 'comp-L07-Q5', lecture: 7,
    concept: 'CYP3A 유도·억제와 기질 약물 노출의 방향',
    format: 'judgment', polarity: 'incorrect',
    stem: '주요 약물대사 경로가 CYP3A이고 다른 조건이 일정할 때, 약물 상호작용에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Rifampin에 의한 효소 유도는 midazolam의 혈중 노출을 감소시킬 수 있다.',
      'Ritonavir에 의한 효소 억제는 alfentanil의 청소율을 감소시킬 수 있다.',
      'Ketoconazole에 의한 효소 억제는 terfenadine의 혈중 노출을 감소시킨다.',
      'Phenobarbital에 의한 효소 유도에는 효소 단백질의 발현 증가가 관여한다.',
      'St John’s wort의 효소 유도는 CYP3A 기질의 대사를 증가시킬 수 있다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳은 설명이다. Rifampin은 CYP3A 유도제로서 기질인 midazolam의 대사를 증가시켜 노출을 줄일 수 있다.',
      '옳은 설명이다. Ritonavir는 CYP3A 억제제로서 alfentanil의 대사를 억제하므로 청소율 감소와 노출 증가가 가능하다.',
      '옳지 않은 설명이다. Ketoconazole은 CYP3A를 억제하여 terfenadine의 대사를 줄이고 혈중 노출을 증가시킨다. 이 상호작용은 QT 연장 위험과 연결된다.',
      '옳은 설명이다. 유도는 핵수용체 등을 통한 발현 증가와 새 단백질 생성이 관여하므로 직접적인 효소 억제와 시간 경과가 다를 수 있다.',
      '옳은 설명이다. St John’s wort는 CYP3A 유도제로서 해당 효소에 의해 제거되는 기질 약물의 노출을 낮출 수 있다.'
    ],
    rationale: '활성 약물의 제거 경로를 유도하면 노출은 감소하고, 억제하면 노출은 증가한다. Terfenadine–ketoconazole의 경우 억제에 따른 terfenadine 증가가 핵심이다.',
    notesPages: [9],
    examRefs: [{ id: '7-2022-20-p16', page: 16 }, { id: '7-2020-20-p19', page: 19 }, { id: '7-2021-20-p18', page: 18 }],
    lectureSources: [{ label: '2026 약물대사', page: 52 }, { label: '2026 약물대사', page: 53 }, { label: '2026 약물대사', page: 54 }, { label: '2026 약물대사', page: 58 }]
  },
  {
    id: 'comp-L08-Q1', lecture: 8,
    concept: 'ABC·SLC 수송체 분류와 직접적인 구동력',
    format: 'association',
    stem: '수송체, 계열, 직접적인 구동력을 모두 바르게 연결한 것은?',
    options: [
      'P-gp — SLC — ATP 가수분해',
      'GLUT — ABC — 포도당 농도구배',
      'SGLT2 — SLC — 수송체 자체의 ATP 가수분해',
      'MATE — SLC — H+ 구배를 이용한 교환수송',
      'OCT2 — ABC — 양이온의 전기화학적 구배'
    ],
    answerIndex: 3,
    explanations: [
      '옳지 않은 연결이다. P-gp는 ATP 가수분해를 이용하지만 SLC가 아니라 ABC 수송체인 ABCB1이다.',
      '옳지 않은 연결이다. GLUT는 포도당 농도구배에 따른 촉진확산을 매개하는 SLC 수송체이다.',
      '옳지 않은 연결이다. SGLT2는 SLC 계열이지만 Na+ 구배와 포도당의 공동수송을 이용한다. 수송체가 ATP를 직접 가수분해하는 방식은 아니다.',
      '정답이다. MATE는 SLC 계열이며 H+ 구배를 이용해 유기양이온 약물을 교환수송한다.',
      '옳지 않은 연결이다. OCT2의 구동력은 양이온의 전기화학적 구배이지만 계열은 ABC가 아니라 SLC이다.'
    ],
    rationale: 'ABC는 ATP를 직접 사용하는 유출 수송체이고, SLC는 촉진확산이나 이온 구배에 연결된 수송을 포함한다. MATE는 H+ 구배를 이용하는 SLC 수송체이다.',
    notesPages: [9],
    examRefs: [{ id: '8-2025-67-p21', page: 21 }, { id: '8-2022-81-p21', page: 21 }],
    lectureSources: [{ label: '2026 약물수송체', page: 6 }]
  },
  {
    id: 'comp-L08-Q2', lecture: 8,
    concept: '장 상피 유입·유출 억제와 생체이용률·노출',
    format: 'judgment', polarity: 'incorrect',
    stem: '장 수송체가 경구 약물의 노출에 미치는 영향으로 옳지 않은 것은? 비교하는 동안 투여량과 전신 청소율은 일정하며, 다른 흡수·대사 경로의 변화는 없다고 가정한다.',
    options: [
      '장 내강에서 상피세포로 들어오는 유입 수송을 억제하면 생체이용률이 감소할 수 있다.',
      '상피세포에서 내강으로 내보내는 P-gp를 억제하면 생체이용률이 증가할 수 있다.',
      '생체이용률이 증가하면 AUC = F × Dose / CL에 따라 AUC가 증가한다.',
      'Dabigatran의 전구약물 dabigatran etexilate는 장 P-gp의 기질이다.',
      'Amiodarone의 장 P-gp 억제는 기질 약물의 내강 방향 유출을 증가시킨다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. 내강에서 세포로 들어오는 이동을 줄이면 흡수와 생체이용률이 감소할 수 있다.',
      '옳은 설명이다. P-gp에 의해 내강으로 되돌아가는 양이 줄면 순흡수와 생체이용률이 증가할 수 있다.',
      '옳은 설명이다. 선형 약동학에서 투여량과 청소율이 일정하면 AUC는 생체이용률 F에 비례한다.',
      '옳은 설명이다. 이 상호작용에서 장 P-gp의 기질로 다루는 것은 경구 전구약물 dabigatran etexilate이다.',
      '옳지 않은 설명이다. P-gp 억제는 내강 방향 유출을 감소시킨다. 따라서 기질의 흡수와 노출이 증가하는 방향으로 작용할 수 있다.'
    ],
    rationale: '수송체 억제라는 말만으로 노출의 방향을 판단할 수 없다. 장세포 유입 억제는 흡수를 줄이고, 장 내강으로의 유출 억제는 흡수를 늘릴 수 있다.',
    notesPages: [9, 10],
    examRefs: [{ id: '8-2025-69-p21', page: 21 }],
    lectureSources: [{ label: '2026 약물수송체', page: 9 }, { label: '2026 약물수송체', page: 11 }, { label: '2026 약물수송체', page: 12 }]
  },
  {
    id: 'comp-L08-Q3', lecture: 8,
    concept: 'Rosuvastatin의 간 유입과 혈중 노출·근육 독성의 관계',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Rosuvastatin의 수송과 cyclosporine의 상호작용에 대한 설명으로 옳지 않은 것은?',
    options: [
      'OATP1B1은 간세포의 혈액 쪽 막에서 간세포 유입에 관여한다.',
      'Cyclosporine은 OATP1B1과 BCRP를 억제하여 rosuvastatin 노출에 영향을 준다.',
      '장 BCRP에 의한 유출이 억제되면 rosuvastatin의 생체이용률이 증가할 수 있다.',
      '간 유입 감소로 혈중 농도가 높아져도 간세포 내 약효의 증가로 단정하기는 어렵다.',
      'OATP1B1 기능 저하로 혈중 노출이 증가하면 근육의 약물 노출은 감소한다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. OATP1B1은 간세포 sinusoidal 막에 위치한 유입 수송체이다.',
      '옳은 설명이다. Cyclosporine은 간 유입과 장 유출 경로를 함께 억제하여 rosuvastatin의 혈중 노출을 높일 수 있다.',
      '옳은 설명이다. 장세포에서 내강으로의 BCRP 유출이 줄면 순흡수가 증가하는 방향으로 작용할 수 있다.',
      '옳은 설명이다. 혈액과 표적 세포 안의 농도는 다르며, 간 유입이 줄면 혈중 노출 증가가 간의 약효 증가를 의미하지 않는다.',
      '옳지 않은 설명이다. 간 유입이 제한되어 혈중 노출이 높아지면 근육 등 간 외 조직의 노출과 근육 이상반응 위험이 증가할 수 있다.'
    ],
    rationale: 'Statin은 간세포에 들어가야 표적에 작용한다. 간 유입 억제로 혈중 농도가 증가하는 현상은 간 약효 강화보다 간 외 조직의 독성 위험과 연결될 수 있다.',
    notesPages: [10],
    examRefs: [{ id: '7-2025-68-p16', page: 16 }, { id: '7-2021-18-p17', page: 17 }, { id: '7-2020-18-p19', page: 19 }],
    lectureSources: [{ label: '2026 약물수송체', page: 14 }, { label: '2026 약물수송체', page: 16 }]
  },
  {
    id: 'comp-L08-Q4', lecture: 8,
    concept: '분비 수송체 억제로 인한 creatinine 상승과 실제 GFR의 구별',
    format: 'case',
    stem: 'Dolutegravir 투여 후 혈청 creatinine이 소폭 상승하고 creatinine 청소율은 감소하였다. 같은 기간 iohexol로 측정한 GFR에는 변화가 없었다. 강의에서 다룬 이 관찰의 기전으로 가장 적절한 것은?',
    options: [
      '사구체 여과율이 감소하여 creatinine의 여과가 줄었다.',
      'OCT2·MATE1 억제로 creatinine의 세뇨관 분비가 줄었다.',
      '세뇨관의 creatinine 재흡수가 억제되어 혈중에 축적되었다.',
      '신장 유입 수송이 촉진되어 creatinine의 요중 분비가 늘었다.',
      'Creatinine의 신장 청소율이 증가하여 혈중 농도가 높아졌다.'
    ],
    answerIndex: 1,
    explanations: [
      '적절하지 않다. 독립적인 지표인 iohexol GFR이 유지되었으므로 사구체 여과 저하가 이 관찰을 설명하지 않는다.',
      '정답이다. Dolutegravir는 OCT2·MATE1을 억제하여 creatinine 분비를 줄일 수 있다. 이 경우 혈청 creatinine은 높아져도 실제 GFR은 유지될 수 있다.',
      '적절하지 않다. Creatinine은 의미 있는 재흡수가 없는 지표로 다룬다. 재흡수를 억제하면 배설은 증가하는 방향이므로 제시된 변화와도 맞지 않는다.',
      '적절하지 않다. 요중 분비 증가라면 creatinine 제거를 증가시키는 방향이다. 강의의 기전은 분비 수송 억제이다.',
      '적절하지 않다. 청소율은 감소했다고 제시되었다. 같은 생성 속도에서 청소율 증가를 혈중 creatinine 상승의 원인으로 해석할 수 없다.'
    ],
    rationale: 'Creatinine 제거는 여과와 분비를 함께 반영한다. 분비 수송체가 억제되면 실제 여과 기능이 유지되어도 creatinine 기반 지표가 달라질 수 있다.',
    notesPages: [10],
    examRefs: [{ id: '8-2025-67-p21', page: 21 }],
    lectureSources: [{ label: '2026 약물수송체', page: 17 }, { label: '2026 약물수송체', page: 18 }]
  },
  {
    id: 'comp-L08-Q5', lecture: 8,
    concept: '치료 표적 수송체와 억제 후 이동 변화',
    format: 'association',
    stem: '약물, 표적 수송체, 억제 후 변화의 연결로 옳지 않은 것은?',
    options: [
      'Dapagliflozin — SGLT2 — 신장 포도당 재흡수 감소',
      'Furosemide — NKCC2 — 굵은상행각의 염분 재흡수 감소',
      'Fluoxetine — SERT — 신경세포의 세로토닌 재흡수 감소',
      'Tenapanor — NHE3 — 장 상피의 Na+ 흡수 감소',
      'Ezetimibe — IBAT — 회장의 담즙산 재흡수 감소'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 연결이다. Dapagliflozin은 근위세뇨관의 SGLT2를 억제하여 포도당 재흡수를 줄인다.',
      '옳은 연결이다. Furosemide는 굵은상행각의 NKCC2를 억제하여 Na+·K+·2Cl− 공동수송과 염분 재흡수를 줄인다.',
      '옳은 연결이다. Fluoxetine은 신경세포막의 SERT를 억제하여 세로토닌의 재흡수를 감소시킨다.',
      '옳은 연결이다. Tenapanor는 장 NHE3를 억제하여 Na+ 흡수를 줄이고 장내 수분을 증가시키는 방향으로 작용한다.',
      '옳지 않은 연결이다. Ezetimibe의 표적은 NPC1L1이며 소장의 콜레스테롤 흡수를 줄인다. IBAT 억제제의 예는 maralixibat과 odevixibat이다.'
    ],
    rationale: '억제하는 수송체에 따라 이동하는 물질과 장기가 달라진다. Ezetimibe–NPC1L1의 콜레스테롤 흡수 억제와 IBAT의 담즙산 재흡수 억제를 구별한다.',
    notesPages: [10],
    examRefs: [{ id: '8-2025-69-p21', page: 21 }, { id: '8-2022-84-p21', page: 21 }],
    lectureSources: [{ label: '2026 약물수송체', page: 26 }, { label: '2026 약물수송체', page: 27 }, { label: '2026 약물수송체', page: 28 }]
  },
  {
    id: 'comp-L09-Q1', lecture: 9,
    concept: '자율·체성신경의 연결과 교감성 콜린성 땀샘 예외',
    format: 'judgment', polarity: 'incorrect',
    stem: '체성신경계와 자율신경계의 연결에 대한 설명으로 옳지 않은 것은?',
    options: [
      '체성운동신경은 골격근의 Nm 수용체에 acetylcholine으로 신호를 전달한다.',
      '교감·부교감 신경절에서는 acetylcholine이 Nn 수용체에 작용한다.',
      '부교감신경의 절후 말단은 주로 작동기관의 muscarinic 수용체에 신호를 전달한다.',
      '땀샘의 교감성 신경전달에는 acetylcholine과 muscarinic 수용체가 관여한다.',
      '부교감신경절은 중추 가까이에 있어 절후섬유가 절전섬유보다 대체로 길다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. 체성운동신경은 중간 신경절 없이 골격근에 연결되며 신경근이음부의 Nm 수용체를 활성화한다.',
      '옳은 설명이다. 두 자율신경계의 절전뉴런은 ACh를 유리하며 신경절의 nicotinic Nn 수용체에 작용한다.',
      '옳은 설명이다. 부교감 절후뉴런의 주된 전달물질은 ACh이고 작동기관 수용체는 muscarinic 계열이다.',
      '옳은 설명이다. 땀샘은 교감신경 작동기관이면서도 ACh–muscarinic 신호를 이용하는 대표적인 예외이다.',
      '옳지 않은 설명이다. 부교감신경절은 작동기관 가까이 또는 기관 안에 있어 절전섬유가 길고 절후섬유는 짧다. 제시된 배열은 전형적인 교감신경 쪽에 가깝다.'
    ],
    rationale: '절전 ACh–Nn은 공통이고, 작동기관에서는 부교감 ACh–muscarinic과 대부분의 교감 NE–adrenergic이 구별된다. 부교감신경절의 위치와 땀샘 예외도 함께 확인한다.',
    notesPages: [11, 12],
    examRefs: [{ id: '11-2025-13-p25', page: 25 }, { id: '11-2022-48-p26', page: 26 }, { id: '11-2019-55-p27', page: 27 }],
    lectureSources: [{ label: '2026 자율신경계 약리 기초', page: 5 }, { label: '2026 자율신경계 약리 기초', page: 6 }, { label: '2026 자율신경계 약리 기초', page: 9 }, { label: '2026 자율신경계 약리 기초', page: 23 }]
  },
  {
    id: 'comp-L09-Q2', lecture: 9,
    concept: '자율신경 수용체 아형과 G단백·효소 경로',
    format: 'association',
    stem: '자율신경 수용체 아형, G단백, 주된 신호전달 경로의 연결로 옳은 것은?',
    options: [
      'M1 — Gs — adenylyl cyclase 활성화',
      'M2 — Gi — adenylyl cyclase 억제',
      'M3 — Gi — adenylyl cyclase 억제',
      'α1 — Gs — adenylyl cyclase 활성화',
      'β2 — Gq — phospholipase C 활성화'
    ],
    answerIndex: 1,
    explanations: [
      '옳지 않은 연결이다. M1은 Gq와 연결되어 PLC–IP3·DAG 경로를 활성화한다.',
      '정답이다. M2는 Gi와 연결되어 adenylyl cyclase와 cAMP 생성을 억제한다. M4도 같은 G단백 계열에 속한다.',
      '옳지 않은 연결이다. M3는 M1·M5와 함께 Gq–PLC 경로에 연결된다.',
      '옳지 않은 연결이다. α1은 Gq–PLC 경로에 연결된다. Gi에 연결되는 아드레날린성 아형은 α2이다.',
      '옳지 않은 연결이다. β2를 포함한 β 수용체는 Gs를 통해 adenylyl cyclase를 활성화하고 cAMP를 증가시킨다.'
    ],
    rationale: 'M1·M3·M5와 α1은 Gq, M2·M4와 α2는 Gi, β 수용체는 Gs에 연결된다는 대응을 구별한다.',
    notesPages: [12],
    examRefs: [{ id: '11-2023-10-p26', page: 26 }, { id: '11-2022-48-p26', page: 26 }],
    lectureSources: [{ label: '2026 자율신경계 약리 기초', page: 24 }, { label: '2026 자율신경계 약리 기초', page: 25 }]
  },
  {
    id: 'comp-L09-Q3', lecture: 9,
    concept: '콜린성 전달의 choline 유입·소포 저장·Ca2+ 의존 유리',
    format: 'association',
    stem: '콜린성 신경전달에 관여하는 물질과 기능의 연결로 옳지 않은 것은?',
    options: [
      'Hemicholinium — ChT 억제를 통한 choline의 신경말단 유입 감소',
      'Choline acetyltransferase — choline과 acetyl-CoA를 이용한 ACh 합성',
      'Vesamicol — 신경세포막 ChT 억제를 통한 choline의 유입 감소',
      'Synaptotagmin — 유입된 Ca2+를 감지하여 소포 유리를 조절',
      'Botulinum toxin — SNARE 단백질 절단을 통한 ACh 유리 억제'
    ],
    answerIndex: 2,
    explanations: [
      '옳은 연결이다. Hemicholinium은 신경말단 세포막의 choline 수송체를 억제하여 ACh 합성에 필요한 choline 공급을 줄인다.',
      '옳은 연결이다. ChAT는 acetyl-CoA의 acetyl기를 choline에 전달하여 ACh를 합성한다.',
      '옳지 않은 연결이다. Vesamicol의 표적은 VAChT이며, 이미 합성된 ACh가 소포 안에 저장되는 단계를 억제한다. ChT 억제제는 hemicholinium이다.',
      '옳은 연결이다. Synaptotagmin은 Ca2+ sensor이다. SNARE 단백질 자체와 구별하며, Ca2+ 유입에 따른 막 융합과 유리를 조절한다.',
      '옳은 연결이다. Botulinum toxin은 독소 아형에 따라 SNARE 단백질을 절단하여 소포막의 융합과 ACh 유리를 막는다.'
    ],
    rationale: 'ChT의 choline 유입, ChAT의 ACh 합성, VAChT의 소포 저장, Ca2+–SNARE에 의한 유리를 순서대로 구별한다. Vesamicol은 합성 전 유입 단계가 아니라 소포 저장 단계에 작용한다.',
    notesPages: [11],
    examRefs: [{ id: '11-2025-14-p25', page: 25 }, { id: '12-13-2023-14-p28', page: 28 }],
    lectureSources: [{ label: '2026 자율신경계 약리 기초', page: 12 }, { label: '2026 자율신경계 약리 기초', page: 13 }, { label: '2026 자율신경계 약리 기초', page: 14 }]
  },
  {
    id: 'comp-L09-Q4', lecture: 9,
    concept: 'Catecholamine 합성의 효소·세포 내 위치와 소포 저장',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Catecholamine의 합성과 저장에 대한 설명으로 옳지 않은 것은?',
    options: [
      'Tyrosine hydroxylase는 tyrosine을 L-DOPA로 전환한다.',
      'DOPA decarboxylase는 L-DOPA를 dopamine으로 전환한다.',
      'Dopamine β-hydroxylase는 소포 안에서 dopamine을 norepinephrine으로 전환한다.',
      'PNMT는 세포질에서 norepinephrine을 epinephrine으로 전환한다.',
      'Reserpine은 NET를 억제하여 norepinephrine의 신경말단 재흡수를 차단한다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. Tyrosine hydroxylase는 catecholamine 합성의 첫 단계인 L-DOPA 생성을 매개하며 metyrosine의 표적이다.',
      '옳은 설명이다. L-DOPA에서 carboxyl기가 제거되어 dopamine이 생성된다.',
      '옳은 설명이다. Dopamine은 VMAT로 소포에 들어간 뒤 소포의 dopamine β-hydroxylase에 의해 NE로 전환된다.',
      '옳은 설명이다. PNMT가 존재하는 세포에서는 세포질에서 NE의 methylation으로 epinephrine이 만들어지고 다시 소포에 저장될 수 있다.',
      '옳지 않은 설명이다. Reserpine은 소포막의 VMAT를 억제하여 monoamine 저장을 감소시킨다. 신경세포막 NET 억제제의 예는 cocaine과 삼환계 항우울제이다.'
    ],
    rationale: 'Dopamine에서 NE로의 전환은 소포 안, PNMT에 의한 epinephrine 생성은 세포질에서 일어난다. 소포 저장의 VMAT와 시냅스에서 회수하는 NET를 구별해야 한다.',
    notesPages: [11],
    examRefs: [{ id: '11-2025-14-p25', page: 25 }, { id: '11-2022-69-p26', page: 26 }, { id: '12-13-2023-14-p28', page: 28 }],
    lectureSources: [{ label: '2026 자율신경계 약리 기초', page: 16 }, { label: '2026 자율신경계 약리 기초', page: 17 }, { label: '2026 자율신경계 약리 기초', page: 18 }]
  },
  {
    id: 'comp-L09-Q5', lecture: 9,
    concept: 'ACh·NE의 작용 종결과 재흡수·자가수용체 피드백',
    format: 'judgment', polarity: 'correct',
    stem: '시냅스 신호의 종결과 음성 되먹임에 대한 설명으로 옳은 것은?',
    options: [
      '유리된 ACh는 주로 시냅스의 butyrylcholinesterase에 의해 분해된다.',
      'ACh는 분해되지 않은 형태로 ChT를 통해 신경말단에 재흡수된다.',
      'NET는 시냅스의 norepinephrine을 시냅스전 신경말단 안으로 회수한다.',
      '시냅스전 α2 자가수용체의 활성화는 norepinephrine의 추가 유리를 촉진한다.',
      'Cocaine과 삼환계 항우울제는 NET를 활성화하여 시냅스 NE 제거를 촉진한다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳지 않다. 신경 시냅스에서 ACh 작용의 빠른 종결을 주로 담당하는 것은 acetylcholinesterase이다. 혈장 cholinesterase와 구별한다.',
      '옳지 않다. ChT가 회수하는 것은 ACh 자체가 아니라 분해 산물인 choline이다. 회수된 choline은 새로운 ACh 합성에 이용된다.',
      '정답이다. NET의 신경말단 재흡수는 시냅스 NE를 제거하고 회수하는 주요 경로이다.',
      '옳지 않다. 시냅스전 α2 자가수용체는 유리된 NE를 감지하여 추가 유리를 줄이는 음성 되먹임에 참여한다.',
      '옳지 않다. 두 약물군은 NET를 억제하여 NE 재흡수를 감소시킨다. 따라서 시냅스 NE 신호가 지속되는 방향으로 작용한다.'
    ],
    rationale: 'ACh는 효소에 의한 분해, NE는 NET에 의한 회수가 중요하다. NET 억제와 자가수용체에 의한 유리 억제는 서로 다른 조절 단계이다.',
    notesPages: [11],
    examRefs: [{ id: '11-2025-14-p25', page: 25 }, { id: '11-2023-10-p26', page: 26 }],
    lectureSources: [{ label: '2026 자율신경계 약리 기초', page: 15 }, { label: '2026 자율신경계 약리 기초', page: 19 }, { label: '2026 자율신경계 약리 기초', page: 25 }]
  },
  {
    id: 'comp-L10-Q1', lecture: 10,
    concept: '콜린 에스테르의 β-methyl·carbamoyl 구조와 선택성·분해',
    format: 'judgment', polarity: 'incorrect',
    stem: '직접작용 콜린 에스테르의 구조와 성질에 대한 설명으로 옳지 않은 것은?',
    options: [
      'β-carbon의 methyl기는 nicotinic 작용을 감소시키는 데 기여한다.',
      'Carbamoyl기를 갖는 carbachol은 cholinesterase의 가수분해에 저항성이 크다.',
      'Methacholine은 ACh보다 느리지만 acetylcholinesterase에 의해 분해될 수 있다.',
      'Carbachol은 muscarinic 수용체와 nicotinic 수용체에 모두 작용할 수 있다.',
      'Bethanechol은 carbamoyl기를 가지며 β-carbon의 methyl기는 없다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. β-methyl 치환은 nicotinic 작용을 줄여 methacholine과 bethanechol의 상대적인 muscarinic 선택성에 기여한다.',
      '옳은 설명이다. Acetyl ester를 carbamic acid ester로 바꾸면 cholinesterase에 의한 가수분해가 매우 느려진다.',
      '옳은 설명이다. Methacholine의 β-methyl기는 분해를 늦추지만, carbamoyl기를 가진 약물처럼 분해 저항성이 큰 것은 아니다.',
      '옳은 설명이다. Carbachol에는 nicotinic 작용을 크게 줄이는 β-methyl 치환이 없어 두 콜린 수용체 계열에 작용할 수 있다.',
      '옳지 않은 설명이다. Bethanechol은 carbamoyl기와 β-methyl기를 모두 갖는다. Carbachol은 carbamoyl 치환을 갖지만 β-methyl기는 없다.'
    ],
    rationale: 'β-methyl기는 muscarinic 선택성과 분해 속도, carbamoyl기는 분해 저항성과 관련된다. Bethanechol은 두 구조 변형을 함께 가진 콜린 에스테르이다.',
    notesPages: [12, 13],
    examRefs: [{ id: '12-13-2025-17-p27', page: 27 }, { id: '12-13-2022-42-p28', page: 28 }],
    lectureSources: [{ label: '2026 콜린성 약리학(1)', page: 9 }, { label: '2026 콜린성 약리학(1)', page: 10 }]
  },
  {
    id: 'comp-L10-Q2', lecture: 10,
    concept: '직접작용 콜린 효현제의 대표적 응용',
    format: 'association',
    stem: '직접작용 콜린수용체 효현제와 대표적인 응용의 연결로 옳지 않은 것은?',
    options: [
      'Methacholine — 기관지 과민성의 진단 평가',
      'Carbachol — 안과 수술에서 동공조임근 수축 유도',
      'Bethanechol — 배뇨근 이완을 통한 과민성 방광 완화',
      'Pilocarpine — 침 분비 저하에 따른 구강건조 증상 완화',
      'Cevimeline — muscarinic 수용체 자극을 통한 침 분비 촉진'
    ],
    answerIndex: 2,
    explanations: [
      '옳은 연결이다. Methacholine은 기관지수축 반응을 이용한 과민성 평가에 사용되며, 천식 증상을 완화하는 약물은 아니다.',
      '옳은 연결이다. Carbachol은 콜린성 자극으로 동공조임근을 수축시켜 축동을 유도할 수 있다.',
      '옳지 않은 연결이다. Bethanechol은 muscarinic 효현제로서 배뇨근을 수축시킨다. 강의의 응용은 비폐쇄성 요정체 등이며 배뇨근 이완에 의한 과민성 방광 완화와는 다르다.',
      '옳은 연결이다. Pilocarpine은 muscarinic 수용체를 자극하며 쇼그렌 증후군이나 두경부 방사선 치료 후의 구강건조와 연결된다.',
      '옳은 연결이다. Cevimeline은 침샘의 muscarinic 수용체를 자극하여 침 분비를 촉진하는 약물이다.'
    ],
    rationale: '콜린성 자극은 샘 분비와 배뇨근 수축을 촉진한다. Bethanechol의 배뇨근 수축 작용을 항무스카린제의 배뇨근 이완 작용과 혼동하지 않아야 한다.',
    notesPages: [13],
    examRefs: [{ id: '12-13-2022-65-p28', page: 28 }, { id: '12-13-2021-25-p29', page: 29 }, { id: '12-13-2020-25-p29', page: 29 }],
    lectureSources: [{ label: '2026 콜린성 약리학(1)', page: 15 }]
  },
  {
    id: 'comp-L10-Q3', lecture: 10,
    concept: 'Muscarinic 효현제의 장기 반응과 내피 NO',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Muscarinic 수용체 자극의 직접적인 장기 반응으로 옳지 않은 것은? 혈관내피는 정상이며, 반사성 자율신경 반응은 제외한다.',
    options: [
      '동공조임근이 수축하여 동공이 작아진다.',
      '심장의 방실결절 전도 속도가 감소한다.',
      '혈관내피의 NO 생성이 증가하여 혈관이 확장된다.',
      '기관지 평활근이 이완하여 기도 저항이 감소한다.',
      '방광 배뇨근의 수축이 촉진된다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳은 설명이다. Muscarinic 자극은 동공조임근을 수축시켜 축동을 일으킨다.',
      '옳은 설명이다. 심장의 M2 신호는 심박수와 방실결절의 전도를 감소시키는 방향으로 작용한다.',
      '옳은 설명이다. 정상 내피의 muscarinic 자극은 NO 생성을 증가시키고, NO는 혈관평활근의 이완을 매개한다.',
      '옳지 않은 설명이다. 기관지의 muscarinic 자극은 평활근 수축과 분비 증가를 유도한다. 기관지 이완과 기도 저항 감소는 반대 방향이다.',
      '옳은 설명이다. Muscarinic 자극은 배뇨근 수축을 촉진하여 소변 배출을 돕는 방향으로 작용한다.'
    ],
    rationale: 'Muscarinic 자극은 축동, 서맥, 기관지수축, 샘 분비와 배뇨근 수축을 유도한다. 정상 혈관내피에서는 NO에 의한 혈관확장이 나타난다는 점을 함께 구별한다.',
    notesPages: [12],
    examRefs: [{ id: '12-13-2025-20-p27', page: 27 }, { id: '11-2023-10-p26', page: 26 }],
    lectureSources: [{ label: '2026 콜린성 약리학(1)', page: 12 }, { label: '2026 콜린성 약리학(1)', page: 13 }]
  },
  {
    id: 'comp-L10-Q4', lecture: 10,
    concept: 'Physostigmine·neostigmine의 화학적 성질과 AChE 억제 기전',
    format: 'association',
    stem: '약물의 화학적 성질과 작용 기전을 바르게 연결한 것은?',
    options: [
      'Neostigmine — 3차 아민, 중추로 이행 가능한 AChE 억제제',
      'Edrophonium — 4차 암모늄, AChE를 비가역적으로 인산화하는 억제제',
      'Physostigmine — 3차 아민, 가역성 carbamate AChE 억제제',
      'Pyridostigmine — 4차 암모늄, muscarinic 수용체 직접 효현제',
      'Pilocarpine — 3차 아민, 가역성 carbamate AChE 억제제'
    ],
    answerIndex: 2,
    explanations: [
      '옳지 않은 연결이다. Neostigmine은 4차 암모늄 화합물이므로 BBB 통과가 제한되며 말초 AChE 억제에 이용된다.',
      '옳지 않은 연결이다. Edrophonium은 4차 암모늄 화합물이지만 비공유결합으로 가역적으로 AChE를 억제한다. 효소 인산화는 유기인 제제의 기전이다.',
      '정답이다. Physostigmine은 3차 아민으로 BBB를 통과할 수 있고, 효소의 carbamylation을 통해 가역적으로 AChE를 억제한다.',
      '옳지 않은 연결이다. Pyridostigmine은 4차 암모늄 화합물인 가역성 AChE 억제제로 ACh를 간접적으로 증가시킨다. 수용체 직접 효현제가 아니다.',
      '옳지 않은 연결이다. Pilocarpine은 muscarinic 수용체에 직접 작용하는 효현제이며, carbamate AChE 억제제로 분류하지 않는다.'
    ],
    rationale: '중추 이행이 가능한 physostigmine과 말초 위주의 neostigmine·pyridostigmine을 구별한다. 직접 효현, 비공유결합 억제, carbamate 억제, 유기인 인산화도 서로 다른 기전이다.',
    notesPages: [12, 13],
    examRefs: [{ id: '12-13-2025-25-p27', page: 27 }, { id: '12-13-2020-26-p29', page: 29 }],
    lectureSources: [{ label: '2026 콜린성 약리학(1)', page: 19 }, { label: '2026 콜린성 약리학(1)', page: 23 }, { label: '2026 콜린성 약리학(1)', page: 24 }]
  },
  {
    id: 'comp-L10-Q5', lecture: 10,
    concept: '유기인에 의해 억제된 AChE의 재활성화와 aging',
    format: 'case',
    stem: '살충제 노출 뒤 축동, 다량의 기관지 분비물, 근섬유연축이 발생하였다. Atropine으로 muscarinic 증상은 호전되었지만 근력저하가 남아 있다. 숙성(aging) 전의 인산화된 AChE를 재활성화하려는 목적에 맞는 약물은?',
    options: [
      'Neostigmine',
      'Physostigmine',
      'Pilocarpine',
      'Pralidoxime',
      'Donepezil'
    ],
    answerIndex: 3,
    explanations: [
      '적절하지 않다. Neostigmine은 가역성 AChE 억제제이며 유기인에 의해 인산화된 효소를 재활성화하는 약물이 아니다.',
      '적절하지 않다. Physostigmine도 AChE를 억제하여 ACh를 증가시키는 약물이며, 유기인의 인산기를 제거하는 약물이 아니다.',
      '적절하지 않다. Pilocarpine은 muscarinic 수용체 직접 효현제로서 효소의 인산화 결합을 해제하지 않는다.',
      '정답이다. Pralidoxime의 oxime기는 인산화된 AChE에서 유기인 유래 인산기를 제거하여 효소 재활성화를 돕는다. Aging이 진행되면 재활성화가 어려워진다.',
      '적절하지 않다. Donepezil은 가역성 AChE 억제제로서 효소 재활성화제가 아니며, 이 목적과 반대 방향으로 AChE를 억제한다.'
    ],
    rationale: 'Atropine은 muscarinic 수용체를 차단하지만 억제된 AChE 자체를 재생하지는 않는다. 인산화 효소의 재활성화를 목표로 하는 약물은 pralidoxime이며 aging 여부가 중요하다.',
    notesPages: [12],
    examRefs: [{ id: '12-13-2020-26-p29', page: 29 }, { id: '12-13-2021-24-p28', page: 28 }],
    lectureSources: [{ label: '2026 콜린성 약리학(1)', page: 19 }, { label: '2026 콜린성 약리학(1)', page: 26 }, { label: '2026 콜린성 약리학(1)', page: 28 }]
  }
];
