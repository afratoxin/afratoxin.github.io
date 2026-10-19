export default [
  {
    id: 'comp-L17-Q1', lecture: 17,
    concept: '사구체 여과를 결정하는 압력과 여과장벽', format: 'judgment', polarity: 'incorrect',
    stem: '다른 조건이 같다고 할 때, 사구체 여과에 관한 설명으로 옳지 않은 것은?',
    options: [
      '사구체 모세혈관의 혈장 교질삼투압이 증가하면 여과를 억제하는 힘이 커진다.',
      '보먼주머니의 정수압이 증가하면 사구체에서 보먼주머니로의 여과가 감소한다.',
      '수입세동맥이 수축하면 사구체 모세혈관 정수압이 높아져 여과가 증가한다.',
      '여과장벽의 손상과 섬유화는 사구체의 여과 능력을 떨어뜨릴 수 있다.',
      '심한 순환부전으로 신장 관류압이 크게 낮아지면 사구체 여과가 감소한다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳다. 혈장 단백질의 교질삼투압은 물을 모세혈관 안에 유지하여 여과에 반대한다.',
      '옳다. 보먼주머니의 정수압은 여과 방향에 반대하므로 높아지면 순여과압이 감소한다.',
      '옳지 않다. 수입세동맥 수축은 사구체로 들어오는 혈류와 사구체 정수압을 낮추어 GFR을 감소시킨다.',
      '옳다. 여과장벽이 손상되고 섬유화되면 유효 여과면적과 투과성이 감소할 수 있다.',
      '옳다. 심한 관류 저하는 여과를 지지하는 정수압을 낮추어 소변 생성 감소로 이어진다.'
    ],
    rationale: 'GFR은 여과를 미는 사구체 정수압과 이에 반대하는 보먼주머니 정수압·혈장 교질삼투압의 영향을 받는다. 수입세동맥 수축은 여과압을 낮춘다.',
    notesPages: [21], examRefs: [],
    lectureSources: [{label: '2026 체액 및 전해질 조절 약물(1)', page: 8}]
  },
  {
    id: 'comp-L17-Q2', lecture: 17,
    concept: '헨레고리의 수분 투과성과 요농축·요희석', format: 'association',
    stem: '네프론 부위와 수분 이동의 연결로 옳은 것은?',
    options: [
      '근위세뇨관 — Na+가 재흡수되어도 물은 거의 통과하지 못한다.',
      '가는 하행각 — 수질의 고삼투압을 따라 물이 재흡수되어 세뇨관액이 농축된다.',
      '굵은 상행각 — NaCl과 물이 함께 재흡수되어 세뇨관액의 삼투압이 유지된다.',
      '초기 원위곡세뇨관 — 높은 수분 투과성으로 여과액의 농축을 주도한다.',
      '집합관 — vasopressin이 증가하면 물 투과성이 낮아져 묽은 소변이 증가한다.'
    ],
    answerIndex: 1,
    explanations: [
      '틀린 연결이다. 근위세뇨관에서는 Na+와 함께 많은 양의 물이 재흡수된다.',
      '옳은 연결이다. 하행각은 물이 잘 통과하므로 고삼투성 수질로 물이 빠져나가 관내액이 농축된다.',
      '틀린 연결이다. 굵은 상행각은 물의 투과성이 낮고 NaCl을 재흡수하므로 관내액을 희석한다.',
      '틀린 연결이다. 초기 원위곡세뇨관도 물의 투과성이 낮은 희석 부위이다.',
      '틀린 연결이다. Vasopressin은 집합관의 aquaporin을 늘려 물 투과성과 물 재흡수를 높인다.'
    ],
    rationale: '하행각은 물을 내보내 농축하고, 상행각은 물을 남기면서 NaCl을 재흡수하여 희석한다. 집합관의 물 투과성은 vasopressin으로 조절된다.',
    notesPages: [21],
    examRefs: [{id: '17-18-2023-29-p38', page: 38}, {id: '17-18-2021-45-p40', page: 40}],
    lectureSources: [{label: '2026 체액 및 전해질 조절 약물(1)', page: 9}, {label: '2026 체액 및 전해질 조절 약물(1)', page: 10}, {label: '2026 체액 및 전해질 조절 약물(1)', page: 11}]
  },
  {
    id: 'comp-L17-Q3', lecture: 17,
    concept: '치밀반의 NaCl 감지와 세뇨관사구체 되먹임', format: 'association',
    stem: '치밀반(macula densa)에 도달하는 NaCl과 세뇨관사구체 되먹임 반응의 연결로 옳은 것은?',
    options: [
      'NaCl 전달 증가 — prostaglandin 신호 증가 — 수입세동맥 확장',
      'NaCl 전달 감소 — adenosine 신호 증가 — renin 분비 억제',
      'NaCl 전달 감소 — prostaglandin 신호 증가 — renin 분비 억제',
      'NaCl 전달 증가 — adenosine 신호 증가 — 수입세동맥 수축',
      'NaCl 전달 증가 — adenosine 신호 증가 — renin 분비 촉진'
    ],
    answerIndex: 3,
    explanations: [
      '틀린 연결이다. NaCl 전달이 증가하면 adenosine을 통한 수입세동맥 수축 반응이 나타난다.',
      '틀린 연결이다. NaCl 전달 감소는 prostaglandin 등의 신호를 통해 renin 분비를 촉진한다.',
      '틀린 연결이다. 낮은 NaCl에 따른 prostaglandin 신호는 renin을 억제하는 대신 분비를 촉진한다.',
      '옳은 연결이다. 높은 NaCl 전달은 adenosine 신호로 수입세동맥을 수축시켜 GFR을 낮추는 방향으로 작용한다.',
      '틀린 연결이다. 높은 NaCl 전달에 대한 adenosine 반응은 renin 분비를 억제하는 방향이다.'
    ],
    rationale: '치밀반은 NaCl 전달량을 감지하여 수입세동맥의 긴장도와 JG 세포의 renin 분비를 조절한다. 높은 NaCl 전달에는 GFR을 줄이는 되먹임이 작동한다.',
    notesPages: [21], examRefs: [],
    lectureSources: [{label: '2026 체액 및 전해질 조절 약물(1)', page: 12}, {label: '2026 체액 및 전해질 조절 약물(1)', page: 13}]
  },
  {
    id: 'comp-L17-Q4', lecture: 17,
    concept: '근위세뇨관의 대량 재흡수와 후기 Cl− 세포사이 이동', format: 'judgment', polarity: 'incorrect',
    stem: '근위세뇨관의 재흡수에 관한 설명으로 옳지 않은 것은?',
    options: [
      '여과된 Na+ 재흡수의 절대량은 집합관보다 근위세뇨관에서 크다.',
      '관강측 Na+/H+ 교환은 Na+ 재흡수와 H+ 분비를 연결한다.',
      '기저외측 Na+/K+-ATPase는 Na+ 재흡수에 필요한 농도 기울기를 유지한다.',
      'Cl−의 농도 기울기에 따른 세포사이 재흡수는 근위세뇨관의 전반부에서 주로 일어난다.',
      '근위세뇨관에서는 용질과 함께 많은 물이 재흡수되어 관내액이 대체로 등장성을 유지한다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳다. 근위세뇨관은 여과된 Na+와 물의 큰 비율을 재흡수하며 집합관은 최종 조절을 담당한다.',
      '옳다. NHE는 관강의 Na+를 세포 안으로 들이고 H+를 관강으로 내보내는 교환수송체이다.',
      '옳다. Na+/K+-ATPase가 세포 내 Na+를 낮게 유지하여 관강측 Na+ 유입을 지지한다.',
      '옳지 않다. 강의에서 Cl−의 paracellular bulk flow를 강조한 부위는 근위세뇨관 후반부이다.',
      '옳다. 근위세뇨관의 높은 수분 투과성 때문에 용질 재흡수에 물이 동반되어 대체로 등장성 재흡수가 일어난다.'
    ],
    rationale: '근위세뇨관은 대량 재흡수 부위이며, 전반부에서 다른 용질이 먼저 재흡수된 뒤 남은 Cl−의 농도 기울기에 따른 세포사이 이동은 후반부에서 중요하다.',
    notesPages: [21],
    examRefs: [{id: '17-18-2025-2-p37', page: 37}, {id: '17-18-2020-48-p41', page: 41}, {id: '17-18-2019-24-p42', page: 42}],
    lectureSources: [{label: '2026 체액 및 전해질 조절 약물(1)', page: 17}, {label: '2026 체액 및 전해질 조절 약물(1)', page: 21}]
  },
  {
    id: 'comp-L17-Q5', lecture: 17,
    concept: '집합관 ENaC·ROMK 연결과 원위 Na+ 전달에 따른 K+ 분비', format: 'judgment', polarity: 'correct',
    stem: '집합관에서 Na+와 K+를 조절하는 원리로 옳은 것은?',
    options: [
      'ENaC를 통한 Na+ 재흡수가 증가하면 관강이 더 양성이 되어 K+ 분비가 감소한다.',
      'Vasopressin은 ROMK를 직접 억제하는 작용으로 집합관의 물 재흡수를 높인다.',
      'ENaC와 ROMK는 ATP를 직접 사용하여 Na+와 K+를 1:1로 교환하는 한 수송체이다.',
      '상류의 Na+ 재흡수가 억제되어 집합관으로 전달되는 Na+가 늘면 K+ 분비가 증가할 수 있다.',
      'Aldosterone은 집합관의 ENaC 발현을 줄여 소변으로 Na+가 빠져나가게 한다.'
    ],
    answerIndex: 3,
    explanations: [
      '틀리다. ENaC로 양전하가 재흡수되면 관강이 상대적으로 음성이 되어 ROMK를 통한 K+ 분비가 촉진된다.',
      '틀리다. Vasopressin의 항이뇨 작용은 주로 aquaporin을 통한 물 투과성 증가이다.',
      '틀리다. ENaC와 ROMK는 서로 다른 이온 통로이며 고정된 1:1 교환을 수행하는 ATPase가 아니다.',
      '옳다. 집합관에 도달한 Na+가 ENaC로 더 재흡수되면 관강 전위 변화와 함께 K+ 소실이 커질 수 있다.',
      '틀리다. Aldosterone은 ENaC 등 Na+ 재흡수에 관여하는 단백질 발현을 증가시킨다.'
    ],
    rationale: '집합관의 Na+ 재흡수와 K+ 분비는 전기적으로 연결된다. 집합관보다 앞에서 작용하는 이뇨제가 저칼륨혈증을 일으킬 수 있는 이유이다.',
    notesPages: [21, 23],
    examRefs: [{id: '17-18-2025-6-p38', page: 38}],
    lectureSources: [{label: '2026 체액 및 전해질 조절 약물(1)', page: 19}, {label: '2026 체액 및 전해질 조절 약물(1)', page: 20}]
  },
  {
    id: 'comp-L18-Q1', lecture: 18,
    concept: '삼투성 이뇨제의 초기 혈관내 용적 증가와 심장 부담', format: 'case',
    stem: '두개내압이 높은 환자에게 정맥으로 약물을 투여하였다. 혈장 삼투압이 상승하면서 조직의 물이 혈관으로 이동했고, 이어 소변량이 증가하였다. 초기 혈관내 용적 증가로 폐울혈이 악화될 수 있는 이 약물은?',
    options: ['Acetazolamide', 'Furosemide', 'Mannitol', 'Hydrochlorothiazide', 'Amiloride'],
    answerIndex: 2,
    explanations: [
      'Acetazolamide는 탄산탈수효소를 억제하여 HCO3− 배설과 방수 생성 감소를 일으킨다. 제시된 삼투성 체액 이동의 원인은 아니다.',
      'Furosemide는 NKCC2 억제로 NaCl 재흡수를 줄인다. 혈장에 삼투성 입자로 남아 초기 용적 팽창을 일으키는 약물이 아니다.',
      'Mannitol은 세포외액의 삼투압을 높여 조직의 물을 혈관으로 이동시키고, 여과 후 관내에서 물 재흡수를 줄인다. 초기 심장 부담이 증가할 수 있다.',
      'Hydrochlorothiazide는 원위곡세뇨관 NCC 억제제이다. 두개내압을 낮추는 삼투성 체액 이동과는 기전이 다르다.',
      'Amiloride는 집합관 ENaC 억제제이다. K+를 보존하는 이뇨제이며 제시된 삼투성 효과를 설명하지 못한다.'
    ],
    rationale: '조직에서 혈관으로 물이 이동한 뒤 이뇨가 나타나는 것은 mannitol의 특징이다. 이뇨가 시작되기 전 혈관내 용적 팽창이 심부전을 악화시킬 수 있다.',
    notesPages: [22],
    examRefs: [{id: '17-18-2023-31-p39', page: 39}, {id: '17-18-2022-25-p39', page: 39}],
    lectureSources: [{label: '2026 체액 및 전해질 조절 약물(2)', page: 3}, {label: '2026 체액 및 전해질 조절 약물(2)', page: 6}]
  },
  {
    id: 'comp-L18-Q2', lecture: 18,
    concept: 'Acetazolamide의 bicarbonate 배설·산염기 변화와 간성혼수 위험', format: 'judgment', polarity: 'incorrect',
    stem: 'Acetazolamide의 작용과 그 결과에 관한 설명으로 옳지 않은 것은?',
    options: [
      '근위세뇨관의 탄산탈수효소를 억제하여 소변으로 HCO3− 배설을 늘린다.',
      'HCO3− 소실로 소변은 알칼리화되고 혈액에는 대사성 산증이 나타날 수 있다.',
      '섬모체의 탄산탈수효소 억제로 방수 생성을 줄일 수 있다.',
      '소변 알칼리화는 인산칼슘 결석 형성을 촉진할 수 있다.',
      '소변 알칼리화는 NH4+로의 포획을 늘려 NH3 재흡수를 줄인다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳다. 탄산탈수효소 억제는 H+ 재순환과 HCO3− 재흡수를 감소시켜 bicarbonaturia를 유발한다.',
      '옳다. 관내에 남은 HCO3−가 소변 pH를 높이고 체내 HCO3− 감소는 대사성 산증을 일으킨다.',
      '옳다. 눈의 탄산탈수효소 억제는 방수 생성을 감소시키는 기전으로 작용한다.',
      '옳다. 알칼리성 소변에서는 인산칼슘이 침전하기 쉬워 결석 위험이 높아질 수 있다.',
      '옳지 않다. 알칼리화되면 NH3가 NH4+로 포획되는 비율이 줄어 NH3 재흡수가 증가할 수 있어 간성혼수에 불리하다.'
    ],
    rationale: 'Acetazolamide는 HCO3− 배설을 늘리는 약물이다. 소변의 H+가 감소하면 암모니아의 NH4+ 포획이 줄어 간성혼수를 악화시킬 수 있다.',
    notesPages: [22],
    examRefs: [{id: '17-18-2021-42-p40', page: 40}, {id: '17-18-2020-44-p41', page: 41}, {id: '17-18-2025-4-p37', page: 37}],
    lectureSources: [{label: '2026 체액 및 전해질 조절 약물(2)', page: 10}, {label: '2026 체액 및 전해질 조절 약물(2)', page: 11}, {label: '2026 체액 및 전해질 조절 약물(2)', page: 12}]
  },
  {
    id: 'comp-L18-Q3', lecture: 18,
    concept: 'Loop 이뇨제의 Ca2+·Mg2+ 소실과 내이 독성', format: 'case',
    stem: '전신부종으로 이뇨제를 사용한 뒤 손발 경련과 이명이 나타났다. 혈중 K+, Mg2+, Ca2+가 감소했고 소변의 Ca2+ 배설은 증가하였다. 이 소견을 가장 잘 설명하는 약물은?',
    options: ['Hydrochlorothiazide', 'Spironolactone', 'Acetazolamide', 'Furosemide', 'Amiloride'],
    answerIndex: 3,
    explanations: [
      'Hydrochlorothiazide는 저칼륨혈증을 일으킬 수 있지만 Ca2+의 소변 배설은 줄이는 방향으로 작용한다.',
      'Spironolactone은 aldosterone 수용체 길항제로 K+를 보존한다. 저칼륨혈증과 loop 이뇨제형 내이 독성을 설명하기 어렵다.',
      'Acetazolamide는 HCO3− 배설과 대사성 산증이 특징이다. Ca2+·Mg2+ 소실과 이명이 함께 나타난 양상은 loop 이뇨제에 더 부합한다.',
      'Furosemide는 NKCC2 억제로 Ca2+·Mg2+ 재흡수를 줄이고 K+ 소실을 늘린다. 내이 독성에 따른 이명도 나타날 수 있다.',
      'Amiloride는 ENaC 억제로 K+ 분비를 줄이는 약물이다. 제시된 저칼륨혈증과 loop 이뇨제형 소견에 맞지 않는다.'
    ],
    rationale: 'Loop 이뇨제는 굵은 상행각의 관강 양전위를 감소시켜 Ca2+·Mg2+ 재흡수를 줄인다. 전해질 소실에 이명이 동반되면 furosemide를 연결한다.',
    notesPages: [22],
    examRefs: [{id: '17-18-2025-5-p38', page: 38}, {id: '17-18-2021-46-p41', page: 41}],
    lectureSources: [{label: '2026 체액 및 전해질 조절 약물(2)', page: 15}, {label: '2026 체액 및 전해질 조절 약물(2)', page: 17}]
  },
  {
    id: 'comp-L18-Q4', lecture: 18,
    concept: 'Thiazide의 NCC 억제와 요중 Ca2+ 감소', format: 'judgment', polarity: 'correct',
    stem: 'Hydrochlorothiazide의 작용에 관한 설명으로 옳은 것은?',
    options: [
      '원위곡세뇨관 NCC를 억제하고 Ca2+의 소변 배설을 감소시킨다.',
      '수질의 NKCC2를 억제하여 농축 기울기를 크게 무너뜨린다.',
      '집합관 ENaC를 억제하여 고칼륨혈증을 주된 전해질 이상으로 일으킨다.',
      '요산의 세뇨관 분비를 촉진하여 혈중 요산 농도를 낮춘다.',
      'Aldosterone 수용체에 길항하여 Na+ 통로의 합성을 억제한다.'
    ],
    answerIndex: 0,
    explanations: [
      '옳다. Thiazide는 NCC 억제로 NaCl 배설을 늘리는 한편 Ca2+ 재흡수를 촉진하여 요중 Ca2+를 줄인다.',
      '틀리다. 수질 NKCC2와 농축 기울기에 크게 영향을 주는 것은 furosemide 등 loop 이뇨제이다.',
      '틀리다. ENaC 억제는 amiloride·triamterene의 기전이다. Thiazide는 K+ 소실과 저칼륨혈증을 일으킬 수 있다.',
      '틀리다. Thiazide는 요산 배설을 감소시켜 고요산혈증을 일으킬 수 있다.',
      '틀리다. Aldosterone 수용체 길항은 spironolactone의 기전이며 hydrochlorothiazide의 주된 표적은 NCC이다.'
    ],
    rationale: 'Thiazide의 핵심은 NCC 억제와 요중 Ca2+ 감소이다. Ca2+ 배설을 늘리는 loop 이뇨제와 구별하며 칼슘 결석 관련 기출에 연결한다.',
    notesPages: [22],
    examRefs: [{id: '17-18-2025-3-p37', page: 37}, {id: '17-18-2020-46-p41', page: 41}, {id: '17-18-2019-20-p42', page: 42}],
    lectureSources: [{label: '2026 체액 및 전해질 조절 약물(2)', page: 18}, {label: '2026 체액 및 전해질 조절 약물(2)', page: 19}, {label: '2026 체액 및 전해질 조절 약물(2)', page: 20}]
  },
  {
    id: 'comp-L18-Q5', lecture: 18,
    concept: 'K+ 보존 이뇨제의 ENaC 억제와 aldosterone 길항 구별', format: 'judgment', polarity: 'incorrect',
    stem: 'K+ 보존 이뇨제에 관한 설명으로 옳지 않은 것은?',
    options: [
      'Amiloride는 집합관 관강측 ENaC를 직접 억제한다.',
      'Spironolactone은 aldosterone 수용체에 길항하여 Na+ 재흡수를 줄인다.',
      'Triamterene은 Na+/K+-ATPase를 직접 억제하여 K+를 보존한다.',
      'Spironolactone의 성호르몬 관련 길항작용은 여성형 유방을 일으킬 수 있다.',
      'ENaC 억제제와 aldosterone 길항제는 모두 고칼륨혈증을 일으킬 수 있다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳다. Amiloride는 ENaC를 억제하여 Na+ 재흡수와 이에 연결된 K+ 분비를 줄인다.',
      '옳다. Spironolactone은 aldosterone 작용을 막아 ENaC 등 수송 단백질의 발현을 감소시킨다.',
      '옳지 않다. Triamterene의 표적은 관강측 ENaC이다. Na+/K+-ATPase를 직접 억제하는 강심배당체와 다르다.',
      '옳다. Spironolactone은 항안드로겐 작용도 있어 여성형 유방 등 성호르몬 관련 부작용이 가능하다.',
      '옳다. 두 기전 모두 집합관 K+ 배설을 감소시키므로 고칼륨혈증이 공통된 위험이다.'
    ],
    rationale: 'Amiloride·triamterene은 ENaC를 직접 차단하고 spironolactone은 aldosterone 수용체에 길항한다. 결과는 K+ 보존으로 비슷하지만 분자 표적이 다르다.',
    notesPages: [23],
    examRefs: [{id: '17-18-2025-6-p38', page: 38}, {id: '17-18-2023-32-p39', page: 39}, {id: '17-18-2019-21-p42', page: 42}],
    lectureSources: [{label: '2026 체액 및 전해질 조절 약물(2)', page: 22}, {label: '2026 체액 및 전해질 조절 약물(2)', page: 23}, {label: '2026 체액 및 전해질 조절 약물(2)', page: 24}]
  },
  {
    id: 'comp-L19-Q1', lecture: 19,
    concept: '심부전의 preload·afterload와 Frank–Starling 관계', format: 'judgment', polarity: 'incorrect',
    stem: '심부전의 혈역학에 관한 설명으로 옳지 않은 것은?',
    options: [
      '혈장량 증가로 심실에 유입되는 혈액이 늘면 preload가 증가할 수 있다.',
      '대동맥판 협착은 심실이 혈액을 내보내는 저항을 높여 afterload를 증가시킨다.',
      '수축기 기능이 저하된 심장은 같은 이완기말 용적에서 정상보다 적은 박출량을 보인다.',
      '비대된 심근의 이완이 저하되면 심실 충만에 문제가 생길 수 있다.',
      '좌심실 충만압이 상승하면 폐정맥의 압력이 낮아져 폐울혈이 완화된다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳다. 혈장량과 정맥 환류 증가는 심실의 이완기 충만과 preload를 높이는 요인이다.',
      '옳다. 판막 협착과 높은 동맥압은 심실 박출에 맞서는 부하인 afterload를 증가시킨다.',
      '옳다. 수축력 저하는 Frank–Starling 곡선을 아래로 이동시켜 같은 충만량에서 박출량을 줄인다.',
      '옳다. 심근 비대와 이완 장애는 충만을 어렵게 하며 수축 기능이 비교적 보존되어도 심부전을 일으킬 수 있다.',
      '옳지 않다. 좌심실 충만압 상승은 좌심방과 폐정맥으로 전달되어 폐울혈과 폐부종을 악화시킬 수 있다.'
    ],
    rationale: 'Preload는 심실 충만과, afterload는 박출 저항과 관계된다. 좌심부전에서 높은 충만압이 폐순환으로 전달되는 것이 폐울혈의 중요한 원인이다.',
    notesPages: [23, 24],
    examRefs: [{id: '19-20-2021-51-p45', page: 45}, {id: '19-20-2019-14-p47', page: 47}],
    lectureSources: [{label: '2026 순환기 약리 기초(1)', page: 5}, {label: '2026 순환기 약리 기초(1)', page: 6}, {label: '2026 순환기 약리 기초(1)', page: 8}]
  },
  {
    id: 'comp-L19-Q2', lecture: 19,
    concept: '저칼륨혈증에 의해 악화되는 digoxin 독성', format: 'case',
    stem: '심부전 약물을 복용하던 환자가 이뇨제를 추가한 뒤 구역과 식욕저하, 물체가 황록색으로 보이는 증상 및 새로운 부정맥을 보였다. 혈중 K+는 2.9 mmol/L였다. 저칼륨혈증에 의해 독성이 커진 약물로 가장 적절한 것은?',
    options: ['Losartan', 'Carvedilol', 'Spironolactone', 'Enalapril', 'Digoxin'],
    answerIndex: 4,
    explanations: [
      'Losartan은 AT1 수용체 차단제이다. 제시된 황록색 시야 이상과 저칼륨혈증에 따른 강심배당체 독성에 맞지 않는다.',
      'Carvedilol은 β 차단 작용을 가진 약물로 서맥·저혈압 등이 가능하지만 이 증상 묶음은 digoxin 독성의 단서이다.',
      'Spironolactone은 K+를 보존하는 aldosterone 길항제이다. 저칼륨혈증으로 증폭되는 특징적인 시각 이상을 설명하지 못한다.',
      'Enalapril은 ACE 억제제이다. 마른기침·혈관부종 등이 알려져 있으며 제시된 강심배당체 독성 양상과 다르다.',
      'Digoxin은 저칼륨혈증에서 독성이 나타나기 쉬워진다. Na+/K+-ATPase 억제는 세포 내 Na+를 늘려 NCX를 통한 Ca2+ 배출을 줄이며 구역·시각 이상·부정맥이 가능하다.'
    ],
    rationale: '저칼륨혈증은 digoxin의 Na+/K+-ATPase 억제 작용과 독성을 증강시킬 수 있다. 소화기 증상·황록색 시야 이상·부정맥의 조합이 원인 약물을 가리킨다.',
    notesPages: [24],
    examRefs: [{id: '19-20-2021-52-p45', page: 45}, {id: '19-20-2020-54-p46', page: 46}, {id: '19-20-2025-12-p43', page: 43}],
    lectureSources: [{label: '2026 순환기 약리 기초(1)', page: 11}, {label: '2026 순환기 약리 기초(1)', page: 12}],
    verifiedSources: ['https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=d91e3646-4c63-4512-ab22-db39c085c4dc&version=12']
  },
  {
    id: 'comp-L19-Q3', lecture: 19,
    concept: '심부전에서 β 차단제의 단기 수축력 저하와 장기 신경호르몬 억제', format: 'judgment', polarity: 'correct',
    stem: '심부전에서 β 차단제가 작용하는 원리로 옳은 것은?',
    options: [
      '투여 초기에 β1 자극을 강화하여 수축력을 높이는 것이 장기 이득의 바탕이다.',
      'JG 세포의 β1 수용체를 차단하면 renin 분비가 증가하여 심근 비대가 억제된다.',
      '초기 수축력이 감소할 수 있으나 장기적으로 과도한 교감신경 자극과 심근 재형성을 줄인다.',
      '심근의 Na+/K+-ATPase를 억제하여 세포 내 Ca2+를 증가시키는 것이 주된 기전이다.',
      'AT1 수용체에 직접 결합하여 angiotensin II의 혈관 수축 작용을 차단한다.'
    ],
    answerIndex: 2,
    explanations: [
      '틀리다. β 차단제는 β1 자극을 강화하지 않으며 초기에는 수축력과 심박출량을 낮출 수 있다.',
      '틀리다. JG 세포의 β1 차단은 renin 분비를 감소시킨다. Renin 증가가 장기 이득의 기전은 아니다.',
      '옳다. 단기 음성 수축력 효과와 장기 병적 교감 활성·심근 비대 억제를 구별해야 한다.',
      '틀리다. Na+/K+-ATPase 억제에 따른 Ca2+ 증가는 digoxin의 기전이다.',
      '틀리다. AT1 수용체 직접 차단은 losartan 등 ARB의 기전이며 β 차단제의 직접 표적이 아니다.'
    ],
    rationale: '심부전에서 지속적인 β1 자극은 renin 분비와 심근 손상·비대를 촉진한다. β 차단제는 초기 수축력 감소 가능성과 장기 재형성 억제를 함께 이해해야 한다.',
    notesPages: [24],
    examRefs: [{id: '19-20-2021-53-p45', page: 45}, {id: '19-20-2023-37-p44', page: 44}],
    lectureSources: [{label: '2026 순환기 약리 기초(1)', page: 14}, {label: '2026 순환기 약리 기초(1)', page: 15}]
  },
  {
    id: 'comp-L19-Q4', lecture: 19,
    concept: 'Angiotensin II의 체액·혈관 작용과 renin 음성 되먹임', format: 'judgment', polarity: 'incorrect',
    stem: 'Angiotensin II의 주된 AT1 수용체 매개 작용으로 옳지 않은 것은?',
    options: [
      '혈관평활근을 수축시켜 혈압을 높인다.',
      'Aldosterone 분비를 촉진하여 Na+와 수분 저류에 기여한다.',
      'ADH 분비와 신장 NaCl 재흡수를 촉진한다.',
      '심근과 혈관의 비대 및 재형성에 관여한다.',
      'JG 세포의 renin 분비를 촉진한다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳다. Angiotensin II의 AT1 작용은 강한 혈관 수축을 일으켜 말초저항과 혈압을 높인다.',
      '옳다. Aldosterone 분비 증가로 원위 네프론의 Na+ 재흡수가 증가하여 체액 저류에 기여한다.',
      '옳다. ADH 분비와 세뇨관 NaCl 재흡수 증가도 혈액량을 유지하는 작용이다.',
      '옳다. 지속적인 angiotensin II 신호는 심혈관 비대와 병적 재형성에 관여한다.',
      '옳지 않다. Angiotensin II는 JG 세포의 renin 분비를 억제하는 음성 되먹임을 제공한다.'
    ],
    rationale: 'Angiotensin II는 혈관 수축과 Na+·수분 저류로 혈압을 높이지만 renin 분비에는 음성 되먹임을 건다. 혈압 상승 작용과 renin 분비 방향을 구별한다.',
    notesPages: [24],
    examRefs: [{id: '19-20-2023-33-p43', page: 43}, {id: '19-20-2023-38-p44', page: 44}, {id: '19-20-2019-13-p47', page: 47}],
    lectureSources: [{label: '2026 순환기 약리 기초(1)', page: 17}, {label: '2026 순환기 약리 기초(1)', page: 19}, {label: '2026 순환기 약리 기초(1)', page: 20}]
  },
  {
    id: 'comp-L19-Q5', lecture: 19,
    concept: '심실근·심방근·SA 결절의 활동전위와 이온 전류', format: 'judgment', polarity: 'incorrect',
    stem: '심장 세포의 활동전위에 관한 설명으로 옳지 않은 것은?',
    options: [
      '심실근의 phase 0에서는 빠른 Na+ 통로를 통한 유입이 급격한 탈분극을 만든다.',
      'SA 결절의 phase 0에서는 전압의존성 Ca2+ 통로를 통한 유입이 중요하다.',
      '심실근의 phase 2에서는 Ca2+ 유입과 근소포체 Ca2+ 유리가 수축에 관여한다.',
      '심실근의 phase 3에서는 지연성 정류 K+ 전류가 재분극에 기여한다.',
      '심방근의 짧은 활동전위는 일과성 외향 K+ 전류가 심실근보다 약하기 때문이다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳다. 심실근의 빠른 phase 0는 전압의존성 Na+ 통로의 개방으로 발생한다.',
      '옳다. SA 결절은 빠른 Na+ 전류보다 Ca2+ 전류가 phase 0를 담당하는 느린 반응 세포이다.',
      '옳다. L형 Ca2+ 통로 유입이 RyR2를 통한 Ca2+ 유리를 유도하고 troponin 결합과 수축으로 이어진다.',
      '옳다. Phase 3의 외향 K+ 전류가 막전위를 다시 음성으로 되돌린다.',
      '옳지 않다. 강의에서는 심방근의 일과성 외향 K+ 전류가 더 발달해 phase 1이 뚜렷하고 활동전위가 짧다고 설명한다.'
    ],
    rationale: '빠른 Na+ 전류를 쓰는 심실근과 Ca2+ 전류로 탈분극하는 SA 결절을 구별한다. 심방근의 강한 일과성 외향 K+ 전류는 심실근보다 짧은 활동전위에 기여한다.',
    notesPages: [24],
    examRefs: [{id: '19-20-2025-7-p42', page: 42}, {id: '19-20-2025-8-p43', page: 43}, {id: '19-20-2019-12-p47', page: 47}],
    lectureSources: [{label: '2026 순환기 약리 기초(1)', page: 24}, {label: '2026 순환기 약리 기초(1)', page: 25}, {label: '2026 순환기 약리 기초(1)', page: 26}]
  },
  {
    id: 'comp-L20-Q1', lecture: 20,
    concept: '심실 탈분극·재분극의 순서와 T파의 방향', format: 'judgment', polarity: 'correct',
    stem: '정상 심전도에서 T파의 주된 방향이 QRS complex와 대체로 같은 이유로 가장 적절한 것은?',
    options: [
      '심실의 재분극은 심실의 탈분극과 같은 순서로 진행하기 때문이다.',
      '심실의 재분극이 심방의 탈분극과 동시에 진행하기 때문이다.',
      '심실 전체가 같은 순간에 재분극하여 심장 내 전위차가 커지기 때문이다.',
      '심실의 재분극은 탈분극과 반대 순서로 진행하고 전기적 극성 변화도 반대이기 때문이다.',
      '심방 재분극의 전기 신호가 심실 재분극보다 커서 T파를 형성하기 때문이다.'
    ],
    answerIndex: 3,
    explanations: [
      '틀리다. 정상 심실의 재분극은 탈분극과 반대 순서로 진행하는 것이 핵심이다.',
      '틀리다. P파는 심방 탈분극이며 T파가 나타나는 시기의 심실 재분극과 구별된다.',
      '틀리다. 세포들이 모두 같은 전기적 상태이면 공간적 전위차는 작아져 뚜렷한 파형을 만들기 어렵다.',
      '옳다. 진행 순서와 극성이 함께 반대가 되어 표면 심전도에서 QRS와 T파의 주된 방향이 같을 수 있다.',
      '틀리다. 심방 재분극은 주로 QRS에 가려지며 T파는 심실 재분극을 나타낸다.'
    ],
    rationale: 'QRS는 심실 탈분극, T파는 심실 재분극이다. 재분극의 진행 순서가 반대이고 전기적 변화의 부호도 반대이므로 같은 방향의 파형이 가능하다.',
    notesPages: [24],
    examRefs: [{id: '19-20-2025-9-p43', page: 43}],
    lectureSources: [{label: '2026 순환기 약리 기초(2)', page: 2}, {label: '2026 순환기 약리 기초(2)', page: 4}, {label: '2026 순환기 약리 기초(2)', page: 5}, {label: '2026 순환기 약리 기초(2)', page: 6}]
  },
  {
    id: 'comp-L20-Q2', lecture: 20,
    concept: 'SA 결절 자동능을 낮추는 약물과 이온 전류', format: 'association',
    stem: '약물과 SA 결절에서 자동능을 낮추는 작용의 연결로 옳은 것은?',
    options: [
      'Adenosine — K+ 전도도 증가와 과분극 유도',
      'β 차단제 — funny current 증가와 phase 4 기울기 증가',
      'Verapamil — 빠른 Na+ 통로 억제와 phase 0 감소',
      'Amiodarone — 재분극 K+ 유출 증가와 활동전위 기간 단축',
      'Lidocaine — L형 Ca2+ 통로 억제와 phase 0 감소'
    ],
    answerIndex: 0,
    explanations: [
      '옳은 연결이다. Adenosine은 결절 세포의 과분극과 자발적 탈분극 억제를 통해 자동능·전도를 낮춘다.',
      '틀린 연결이다. β 차단은 funny current를 촉진하는 교감 신호를 줄여 phase 4의 자발적 탈분극을 느리게 한다.',
      '틀린 연결이다. Verapamil은 L형 Ca2+ 통로를 억제한다. SA 결절 phase 0도 Ca2+ 전류에 의존한다.',
      '틀린 연결이다. Amiodarone의 K+ 통로 차단 작용은 재분극을 지연시켜 활동전위 기간을 늘리는 방향이다.',
      '틀린 연결이다. Lidocaine은 class I Na+ 통로 차단제이며 L형 Ca2+ 통로 차단제로 분류하지 않는다.'
    ],
    rationale: '결절의 과분극은 adenosine, phase 4 교감성 촉진 억제는 β 차단제, phase 0의 Ca2+ 유입 억제는 verapamil과 연결한다.',
    notesPages: [25, 26],
    examRefs: [{id: '19-20-2020-102-p46', page: 46}, {id: '19-20-2023-34-p43', page: 43}],
    lectureSources: [{label: '2026 순환기 약리 기초(2)', page: 16}, {label: '2026 순환기 약리 기초(2)', page: 17}, {label: '2026 순환기 약리 기초(2)', page: 26}]
  },
  {
    id: 'comp-L20-Q3', lecture: 20,
    concept: '재분극 지연과 QT 연장에 따른 조기 후탈분극', format: 'case',
    stem: '저칼륨혈증이 있는 환자에게 항부정맥제를 추가한 뒤 QT 간격이 더 길어지고, 재분극이 끝나기 전 phase 3에서 새 탈분극이 발생하였다. 이 현상을 촉진할 수 있는 주된 약물 작용은?',
    options: [
      '빠른 Na+ 통로를 억제하여 심실근의 흥분 역치를 높이는 작용',
      'β1 수용체를 차단하여 교감성 자동능 증가를 줄이는 작용',
      '지연성 정류 K+ 통로를 차단하여 재분극을 늦추는 작용',
      'L형 Ca2+ 통로를 억제하여 plateau의 내향 전류를 줄이는 작용',
      '결절의 K+ 전도도를 높여 막전위를 더 음성으로 만드는 작용'
    ],
    answerIndex: 2,
    explanations: [
      '이 문항의 원인 작용이 아니다. Na+ 통로 억제에 따른 역치 상승은 강의에서 유발된 흥분을 억제하는 기전으로 제시된다.',
      '이 문항의 원인 작용이 아니다. β1 차단은 교감신경에 의한 자동능 증가를 낮추는 방향이다.',
      '정답이다. K+ 재분극 전류 감소는 활동전위를 늘려 EAD를 촉진할 수 있고, 저칼륨혈증은 그 위험을 높인다.',
      '이 문항의 원인 작용이 아니다. Plateau 내향 전류 감소는 재분극 지연을 강화하는 설명과 맞지 않는다.',
      '이 문항의 원인 작용이 아니다. 결절 과분극은 자발적 흥분을 낮추며 심실 phase 3의 지연과 구별된다.'
    ],
    rationale: '재분극 완료 전의 후탈분극은 EAD이다. 저칼륨혈증과 재분극 K+ 전류 감소가 활동전위·QT를 연장하여 이를 촉진할 수 있다.',
    notesPages: [25, 26],
    examRefs: [{id: '19-20-2021-49-p45', page: 45}, {id: '19-20-2022-24-p44', page: 44}],
    lectureSources: [{label: '2026 순환기 약리 기초(2)', page: 9}, {label: '2026 순환기 약리 기초(2)', page: 10}, {label: '2026 순환기 약리 기초(2)', page: 17}, {label: '2026 순환기 약리 기초(2)', page: 25}]
  },
  {
    id: 'comp-L20-Q4', lecture: 20,
    concept: '세포내 Ca2+ 과부하와 NCX에 의한 지연 후탈분극', format: 'judgment', polarity: 'incorrect',
    stem: '지연 후탈분극(delayed after-depolarization, DAD)에 관한 설명으로 옳지 않은 것은?',
    options: [
      '선행 활동전위의 재분극이 끝난 뒤 이완기에 나타날 수 있다.',
      '세포 내 Ca2+ 과부하가 발생의 중요한 원인이 된다.',
      '교감신경 자극이나 강심배당체 독성이 유발 요인이 될 수 있다.',
      'Ca2+를 배출하는 NCX가 Na+도 세포 밖으로 내보내 탈분극을 일으킨다.',
      'Na+ 통로 차단에 따른 흥분 역치 상승은 후탈분극이 새 활동전위를 만드는 것을 억제할 수 있다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳다. DAD는 재분극 완료 뒤에 나타나는 후탈분극으로 선행 활동전위에 의해 유발된다.',
      '옳다. 세포 내 Ca2+ 과부하와 이완기 Ca2+ 유리가 DAD의 핵심 원인이다.',
      '옳다. 교감성 Ca2+ 증가와 digitalis 독성 등은 Ca2+ 과부하를 통해 DAD를 유발할 수 있다.',
      '옳지 않다. NCX가 Ca2+를 밖으로 배출할 때 Na+는 세포 안으로 들어온다. 이 순내향 전류가 탈분극에 기여한다.',
      '옳다. 역치를 높이면 후탈분극이 있어도 새 활동전위로 이어질 가능성을 줄일 수 있다.'
    ],
    rationale: 'DAD의 중심은 Ca2+ 과부하이다. Ca2+ 배출과 결합된 NCX의 Na+ 유입이 순내향 전류를 만들므로 Na+ 이동 방향을 정확히 구별해야 한다.',
    notesPages: [25],
    examRefs: [{id: '19-20-2022-14-p44', page: 44}],
    lectureSources: [{label: '2026 순환기 약리 기초(2)', page: 9}, {label: '2026 순환기 약리 기초(2)', page: 10}, {label: '2026 순환기 약리 기초(2)', page: 19}]
  },
  {
    id: 'comp-L20-Q5', lecture: 20,
    concept: '회귀 회로·불응기와 Na+ 통로 차단의 부정맥 유발 가능성', format: 'judgment', polarity: 'incorrect',
    stem: '회귀(re-entry)와 항부정맥제 작용에 관한 설명으로 옳지 않은 것은?',
    options: [
      '이미 흥분했던 조직이 다시 흥분할 수 있는 시점에 전기 신호가 돌아오면 회로가 유지될 수 있다.',
      'WPW 증후군에서는 심방과 심실 사이의 부전도로가 회귀 회로에 관여할 수 있다.',
      '허혈로 전도가 불균일해진 심근은 기능적 회귀의 바탕이 될 수 있다.',
      '불응기를 늘려 돌아온 신호에 조직이 반응하지 못하게 하면 회귀 회로가 끊길 수 있다.',
      'Na+ 통로 차단은 허혈 부위의 전도속도를 높이므로 회귀성 부정맥을 악화시키기 어렵다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳다. 돌아온 신호가 불응기에서 회복된 조직을 다시 흥분시키면 순환하는 전도가 지속될 수 있다.',
      '옳다. WPW의 부전도로는 정상 AV 경로와 함께 해부학적 회귀에 관여한다.',
      '옳다. 허혈에 의한 느리고 불균일한 전도는 회귀가 성립하기 쉬운 환경을 만든다.',
      '옳다. 신호가 돌아왔을 때 조직이 불응 상태이면 전도가 이어지지 않아 회로가 중단될 수 있다.',
      '옳지 않다. Na+ 통로 차단은 전도를 느리게 한다. 허혈 등으로 전도 여력이 낮은 조직에서는 부정맥을 유발·악화시킬 수 있다.'
    ],
    rationale: '회귀는 전도 경로와 불응기의 관계로 이해한다. Na+ 통로 차단은 회로를 막을 수도 있지만 일부 조직에서 전도 지연을 심화하여 부정맥을 유발할 수 있다.',
    notesPages: [25],
    examRefs: [{id: '19-20-2023-36-p44', page: 44}, {id: '19-20-2021-50-p45', page: 45}, {id: '19-20-2020-52-p46', page: 46}],
    lectureSources: [{label: '2026 순환기 약리 기초(2)', page: 20}, {label: '2026 순환기 약리 기초(2)', page: 21}]
  },
  {
    id: 'comp-L21-Q1', lecture: 21,
    concept: 'Histamine의 합성·과립 저장과 두 대사 경로', format: 'judgment', polarity: 'incorrect',
    stem: 'Histamine의 합성·저장·대사에 관한 설명으로 옳지 않은 것은?',
    options: [
      'Histidine은 L-histidine decarboxylase에 의해 histamine으로 전환된다.',
      '비만세포와 호염기구에서는 histamine이 heparin 등과 함께 과립에 저장된다.',
      '신경세포와 위 ECL 세포의 histamine은 과립 저장 비만세포보다 교체가 빠르다.',
      '뇌에서는 DAO에 의한 분해가 주된 경로이고 HNMT에 의한 메틸화는 주로 장에서 일어난다.',
      'Histamine은 피부·기관지·장 점막에 많지만 정상 혈장 농도는 낮다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳다. Histamine 합성은 histidine의 탈카복실화 반응이며 효소는 L-histidine decarboxylase이다.',
      '옳다. 비만세포·호염기구의 histamine은 산성 과립에 저장되었다가 탈과립으로 유리될 수 있다.',
      '옳다. ECL 세포와 신경세포는 지속적인 합성·분비와 빠른 교체가 특징이다.',
      '옳지 않다. 뇌의 주요 경로는 HNMT에 의한 메틸화 후 MAO 대사이며 DAO 경로는 장에서 중요하다.',
      '옳다. 국소 조직에서는 많은 양이 존재할 수 있지만 혈장에는 낮은 농도로 분포하는 autacoid이다.'
    ],
    rationale: '합성 효소와 대사 효소를 구별한다. Histidine 탈카복실화가 합성이며 HNMT–MAO 경로와 DAO 경로가 대사를 담당한다.',
    notesPages: [26],
    examRefs: [{id: '21-2023-23-p48', page: 48}, {id: '21-2022-75-p49', page: 49}, {id: '21-2020-39-p50', page: 50}, {id: '21-2025-55-p47', page: 47}],
    lectureSources: [{label: '2026 히스타민 약리(v2)', page: 8}]
  },
  {
    id: 'comp-L21-Q2', lecture: 21,
    concept: 'Histamine H1–H4 수용체의 G 단백질과 기능', format: 'association',
    stem: 'Histamine 수용체와 주된 신호·기능의 연결로 옳은 것은?',
    options: [
      'H1 — Gs — 위 벽세포의 산 분비 촉진',
      'H2 — Gq — 혈관 내피의 투과성 증가',
      'H3 — Gi/o — 신경전달물질 유리 억제',
      'H4 — Gs — 심근의 심박수 증가',
      'H1 — Gi/o — 중추의 각성 억제'
    ],
    answerIndex: 2,
    explanations: [
      '틀린 연결이다. 위 벽세포의 Gs–cAMP를 통한 산 분비는 H2의 대표 작용이다. H1은 Gq/11에 연결된다.',
      '틀린 연결이다. 내피의 투과성 증가와 Gq 신호는 H1과 연결한다. H2의 대표 신호는 Gs이다.',
      '옳은 연결이다. H3는 Gi/o에 연결되는 신경계 자가·이종 수용체로 histamine과 다른 신경전달물질 유리를 억제한다.',
      '틀린 연결이다. H4는 Gi/o에 연결되며 면역세포의 주화성·가려움 등에 관여한다. 심박수 증가는 H2와 연결한다.',
      '틀린 연결이다. 중추 H1은 Gq/11 신호를 통해 각성을 촉진한다. 이 수용체를 차단하면 졸림이 나타날 수 있다.'
    ],
    rationale: 'H1은 Gq와 알레르기·각성, H2는 Gs와 위산 분비, H3·H4는 Gi/o와 연결한다. H3 억제성 신호를 낮추는 pitolisant는 각성을 높인다.',
    notesPages: [27],
    examRefs: [{id: '21-2021-36-p49', page: 49}, {id: '21-2025-56-p48', page: 48}],
    lectureSources: [{label: '2026 히스타민 약리(v2)', page: 11}, {label: '2026 히스타민 약리(v2)', page: 12}, {label: '2026 히스타민 약리(v2)', page: 20}]
  },
  {
    id: 'comp-L21-Q3', lecture: 21,
    concept: '1세대 H1 항히스타민제의 졸림과 항무스카린 부작용', format: 'case',
    stem: '알레르기성 비염으로 경구 약물을 복용한 뒤 심한 졸림과 집중력 저하가 생겼다. 입마름과 배뇨 곤란도 함께 나타났다. 다음 중 이 증상을 일으켰을 가능성이 가장 높은 약물은?',
    options: ['Loratadine', 'Fexofenadine', 'Chlorpheniramine', 'Desloratadine', 'Levocetirizine'],
    answerIndex: 2,
    explanations: [
      'Loratadine은 중추 이행과 항무스카린 작용이 상대적으로 적은 2세대 H1 약물이다. 제시된 증상 묶음에는 1세대 약물이 더 적합하다.',
      'Fexofenadine은 뇌 이행이 적어 진정이 적은 2세대 약물이다. 심한 졸림과 항무스카린 증상의 조합을 가장 잘 설명하지는 않는다.',
      'Chlorpheniramine은 BBB를 통과하는 1세대 H1 약물이다. 중추 H1 차단에 의한 졸림과 항무스카린성 입마름·요저류가 가능하다.',
      'Desloratadine은 2세대 H1 약물로 강한 진정·항무스카린 작용이 특징인 1세대 약물과 구별한다.',
      'Levocetirizine도 졸림이 가능하지만, 강한 진정에 입마름·요저류까지 동반된 양상은 chlorpheniramine에 더 부합한다.'
    ],
    rationale: '1세대 H1 약물의 중추 이행은 졸림을, 항무스카린 작용은 입마름·배뇨 곤란을 설명한다. 두 부작용이 함께 제시된 경우 세대 구별이 핵심이다.',
    notesPages: [27],
    examRefs: [{id: '21-2025-56-p48', page: 48}, {id: '21-2021-35-p49', page: 49}, {id: '21-2020-37-p50', page: 50}, {id: '21-2019-89-p51', page: 51}],
    lectureSources: [{label: '2026 히스타민 약리(v2)', page: 15}, {label: '2026 히스타민 약리(v2)', page: 16}]
  },
  {
    id: 'comp-L21-Q4', lecture: 21,
    concept: 'ECL–H2 위산 분비와 H2RA·PPI·P-CAB의 표적', format: 'judgment', polarity: 'incorrect',
    stem: '위산 분비와 위산 억제 약물에 관한 설명으로 옳지 않은 것은?',
    options: [
      'ECL 세포가 분비한 histamine은 위 벽세포의 H2 수용체를 자극한다.',
      'Famotidine은 벽세포 H2 수용체를 차단하여 histamine 신호를 낮춘다.',
      'Omeprazole은 산성 환경에서 활성화되어 양성자 펌프에 비가역적으로 결합한다.',
      'Tegoprazan은 H2 수용체에서 histamine과 경쟁하여 산 분비를 억제한다.',
      'Cimetidine은 H2 차단 외에 CYP 억제로 다른 약물의 대사에 영향을 줄 수 있다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳다. ECL 세포에서 유리된 histamine이 벽세포 H2–Gs–cAMP 신호로 산 분비를 촉진한다.',
      '옳다. Famotidine의 표적은 양성자 펌프 자체가 아니라 벽세포의 H2 수용체이다.',
      '옳다. Omeprazole은 PPI로 산성 환경에서 활성화된 뒤 H+/K+-ATPase에 공유결합한다.',
      '옳지 않다. Tegoprazan은 P-CAB으로 양성자 펌프의 K+ 결합 부위에서 가역적 경쟁 억제를 한다.',
      '옳다. Cimetidine은 CYP 억제를 동반하므로 다른 H2 차단제와 약물상호작용 양상이 다를 수 있다.'
    ],
    rationale: 'H2 차단제는 histamine 수용체, PPI와 P-CAB은 최종 산 분비 단계의 양성자 펌프를 표적으로 한다. PPI의 비가역 결합과 P-CAB의 K+ 경쟁을 구별한다.',
    notesPages: [27],
    examRefs: [{id: '21-2023-21-p48', page: 48}, {id: '21-2021-37-p50', page: 50}, {id: '21-2020-38-p50', page: 50}, {id: '21-2019-90-p51', page: 51}],
    lectureSources: [{label: '2026 히스타민 약리(v2)', page: 21}, {label: '2026 히스타민 약리(v2)', page: 22}]
  },
  {
    id: 'comp-L21-Q5', lecture: 21,
    concept: 'ACE 억제에 따른 bradykinin 분해 감소와 기침·혈관부종', format: 'case',
    stem: '고혈압 약물을 새로 시작한 환자에게 마른기침이 지속되다가 가려운 팽진 없이 입술과 혀가 붓는 증상이 발생하였다. Bradykinin 분해 감소로 이 소견을 일으킬 수 있는 원인 약물은?',
    options: ['Valsartan', 'Enalapril', 'Amlodipine', 'Propranolol', 'Furosemide'],
    answerIndex: 1,
    explanations: [
      'Valsartan은 AT1 수용체 차단제이다. ACE를 직접 억제하지 않으므로 bradykinin 분해 억제가 주된 기전은 아니다.',
      'Enalapril은 ACE 억제제이다. ACE의 bradykinin 분해도 감소시켜 마른기침과 혈관부종을 일으킬 수 있다.',
      'Amlodipine은 Ca2+ 통로 차단제이다. 말초부종이 가능하지만 bradykinin 분해 억제에 의한 기침·혈관부종을 설명하는 표적은 아니다.',
      'Propranolol은 β 차단제이다. 기관지 수축과는 관련될 수 있지만 ACE 억제를 통한 bradykinin 축적과는 구별한다.',
      'Furosemide는 NKCC2 억제제이다. 전해질 소실 등이 특징이며 bradykinin 분해 감소는 주된 작용이 아니다.'
    ],
    rationale: 'ACE는 angiotensin I 전환뿐 아니라 bradykinin 분해에도 관여한다. ACE 억제에 따른 기침·혈관부종을 histamine성 두드러기 및 유전성 C1-INH 결핍과 구별한다.',
    notesPages: [27], examRefs: [],
    lectureSources: [{label: '2026 히스타민 약리(v2)', page: 23}, {label: '2026 히스타민 약리(v2)', page: 24}]
  },
  {
    id: 'comp-L22-Q1', lecture: 22,
    concept: '항혈소판제의 COX-1·P2Y12·PDE3·GP IIb/IIIa 표적', format: 'association',
    stem: '항혈소판제와 표적·작용의 연결로 옳은 것은?',
    options: [
      'Aspirin — P2Y12 차단 — ADP 신호 감소',
      'Clopidogrel — COX-1 비가역 억제 — TXA2 생성 감소',
      'Cilostazol — PDE3 억제 — 혈소판 cAMP 감소',
      'Eptifibatide — GP IIb/IIIa 차단 — fibrinogen 결합 감소',
      'Dipyridamole — adenosine 재흡수 촉진 — 혈소판 cAMP 감소'
    ],
    answerIndex: 3,
    explanations: [
      '틀린 연결이다. Aspirin은 COX-1을 비가역적으로 억제하여 TXA2 생성을 줄인다. P2Y12 억제제와 다르다.',
      '틀린 연결이다. Clopidogrel은 ADP 수용체 P2Y12를 억제한다. COX-1의 비가역 억제는 aspirin과 연결한다.',
      '틀린 연결이다. PDE3 억제는 cAMP 분해를 줄여 혈소판 cAMP를 증가시키고 활성화를 억제한다.',
      '옳은 연결이다. Eptifibatide는 GP IIb/IIIa를 막아 fibrinogen 매개의 혈소판 응집을 억제한다.',
      '틀린 연결이다. Dipyridamole은 adenosine 재흡수를 억제하며 PDE 억제와 함께 cAMP 증가 방향으로 작용한다.'
    ],
    rationale: 'Aspirin–COX-1, clopidogrel–P2Y12, cilostazol–PDE3, eptifibatide–GP IIb/IIIa를 구별한다. 혈소판 cAMP 증가는 활성화를 억제하는 방향이다.',
    notesPages: [28],
    examRefs: [{id: '22-2025-31-p51', page: 51}, {id: '22-2021-58-p52', page: 52}, {id: '22-2019-11-p52', page: 52}],
    lectureSources: [{label: '사용자 약리학 필기', page: 28}, {label: 'Om 약리학 정리', page: 153}]
  },
  {
    id: 'comp-L22-Q2', lecture: 22,
    concept: '혈소판 감소와 새로운 혈전이 동반되는 HIT의 원인 약물', format: 'case',
    stem: '입원 후 항응고 약물을 투여하던 환자에서 8일째 혈소판 수가 24만/μL에서 8만/μL로 감소하고 새 다리 정맥혈전이 발생하였다. 혈색소와 백혈구 수에는 뚜렷한 변화가 없었다. 이 부작용을 일으킨 약물로 가장 적절한 것은?',
    options: ['Warfarin', 'Dabigatran', 'Alteplase', 'Heparin', 'Clopidogrel'],
    answerIndex: 3,
    explanations: [
      'Warfarin은 초기 protein C 감소로 혈전성 합병증이 가능하지만, 투여 5–10일 무렵의 현저한 혈소판 감소와 새 혈전은 HIT에 더 부합한다.',
      'Dabigatran은 직접 thrombin 억제제이다. Heparin–PF4 항체를 매개로 하는 혈소판 활성화가 주된 부작용 기전은 아니다.',
      'Alteplase는 혈전용해제이며 항응고제로 분류하지 않는다. 출혈 위험과 달리 제시된 혈소판 활성화성 혈전 양상은 HIT의 단서이다.',
      'Heparin은 PF4와 복합체를 만들고 이에 대한 항체가 혈소판을 활성화하는 HIT를 유발할 수 있다. 혈소판 감소와 혈전증이 함께 나타난다.',
      'Clopidogrel은 항혈소판제이다. 이 상황의 항응고 약물 투여 시점과 새 혈전·혈소판 감소의 전형적 조합은 heparin에 더 부합한다.'
    ],
    rationale: '항응고제 투여 뒤 혈소판이 크게 감소하면서 오히려 새 혈전이 생기는 양상은 HIT를 시사한다. PF4–heparin 복합체에 대한 면역반응이 혈소판을 활성화한다.',
    notesPages: [28],
    examRefs: [{id: '22-2025-32-p51', page: 51}, {id: '22-2023-42-p52', page: 52}],
    lectureSources: [{label: '사용자 약리학 필기', page: 28}, {label: 'Om 약리학 정리', page: 150}]
  },
  {
    id: 'comp-L22-Q3', lecture: 22,
    concept: '항응고제의 직접·antithrombin 매개 억제와 Xa·IIa 선택성', format: 'association',
    stem: '항응고제와 작용 기전의 연결로 옳은 것은?',
    options: [
      'Dabigatran — antithrombin 매개 — thrombin 간접 억제',
      'Rivaroxaban — antithrombin 비의존 — factor Xa 직접 억제',
      'Fondaparinux — antithrombin 비의존 — factor Xa 직접 억제',
      'UFH — vitamin K 재생 억제 — 응고인자 II·VII·IX·X의 기능 감소',
      'LMWH — antithrombin 매개 — factor Xa보다 thrombin 억제가 우세'
    ],
    answerIndex: 1,
    explanations: [
      '틀린 연결이다. Dabigatran은 antithrombin 없이 thrombin의 활성을 직접 억제한다.',
      '옳은 연결이다. Rivaroxaban은 직접 factor Xa 억제제이며 antithrombin을 매개로 하지 않는다.',
      '틀린 연결이다. Fondaparinux는 antithrombin에 결합하여 factor Xa 억제를 촉진하는 간접 억제제이다.',
      '틀린 연결이다. UFH는 antithrombin을 통해 Xa와 IIa를 억제한다. Vitamin K 재생 억제는 warfarin의 기전이다.',
      '틀린 연결이다. LMWH는 일반적으로 anti-Xa 활성이 anti-IIa 활성보다 크다. Thrombin 억제가 우세한 것도, 전혀 없는 것도 아니다.'
    ],
    rationale: '표적이 Xa인지 IIa인지와 antithrombin이 필요한지를 따로 판단한다. Fondaparinux와 rivaroxaban은 모두 Xa 억제 효과가 있지만 직접성에서 다르다.',
    notesPages: [28],
    examRefs: [{id: '22-2021-59-p52', page: 52}, {id: '22-2020-60-p52', page: 52}, {id: '22-2019-12-p53', page: 53}],
    lectureSources: [{label: '사용자 약리학 필기', page: 28}, {label: 'Om 약리학 정리', page: 150}, {label: 'Om 약리학 정리', page: 151}],
    verifiedSources: ['https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d8afb29f-cbed-43bc-809f-09b30fca28f5']
  },
  {
    id: 'comp-L22-Q4', lecture: 22,
    concept: 'Warfarin의 VKORC1 억제와 초기 protein C 감소', format: 'judgment', polarity: 'incorrect',
    stem: 'Warfarin에 관한 설명으로 옳지 않은 것은?',
    options: [
      'VKORC1을 억제하여 환원형 vitamin K의 재생을 감소시킨다.',
      '응고인자 II·VII·IX·X의 vitamin K 의존성 γ-carboxylation을 저해한다.',
      '혈중에 이미 존재하는 thrombin의 활성 부위를 직접 막아 즉시 작용한다.',
      '투여 초기에 protein C가 감소하여 일시적으로 혈전 형성에 유리할 수 있다.',
      '항응고 효과의 변동을 평가할 때 PT를 표준화한 INR이 이용된다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳다. VKORC1 억제는 vitamin K 재생을 막아 응고인자의 정상적인 성숙에 영향을 준다.',
      '옳다. Vitamin K 의존성 γ-carboxylation이 저하되면 이들 인자의 Ca2+ 결합과 정상 기능이 감소한다.',
      '옳지 않다. Warfarin은 이미 존재하는 thrombin을 직접 억제하지 않는다. 기존 응고인자가 소실되는 시간이 필요하다.',
      '옳다. Protein C도 vitamin K 의존성 단백질이며 초기 감소로 항응고계가 먼저 약해질 수 있다.',
      '옳다. INR은 warfarin 항응고 효과의 변동을 추적하는 대표적인 지표이다.'
    ],
    rationale: 'Warfarin은 응고인자의 성숙을 방해하며 활성 thrombin 직접 억제제와 다르다. 작용 지연과 초기 protein C 감소는 같은 기전에서 이해할 수 있다.',
    notesPages: [29],
    examRefs: [{id: '22-2020-61-p52', page: 52}, {id: '22-2021-59-p52', page: 52}],
    lectureSources: [{label: '사용자 약리학 필기', page: 29}, {label: 'Om 약리학 정리', page: 147}, {label: 'Om 약리학 정리', page: 151}]
  },
  {
    id: 'comp-L22-Q5', lecture: 22,
    concept: 'Plasminogen 활성화와 항섬유소용해 작용의 구별', format: 'judgment', polarity: 'incorrect',
    stem: '섬유소용해와 이를 조절하는 약물·단백질의 설명으로 옳지 않은 것은?',
    options: [
      'Alteplase는 plasminogen을 plasmin으로 전환하여 fibrin 분해를 촉진한다.',
      'Streptokinase는 plasminogen과 복합체를 형성하여 plasminogen 활성화를 촉진한다.',
      'Tranexamic acid는 plasminogen의 fibrin 결합을 늘려 형성된 혈전의 분해를 촉진한다.',
      'PAI-1은 tPA의 작용을 억제하여 plasmin 생성 단계를 제한한다.',
      'α2-Antiplasmin은 생성된 plasmin을 억제하여 과도한 섬유소용해를 제한한다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳다. Alteplase는 재조합 tPA로 plasmin 생성을 촉진하며 plasmin이 fibrin을 분해한다.',
      '옳다. Streptokinase는 plasminogen과의 복합체를 통해 섬유소용해를 촉진한다.',
      '옳지 않다. Tranexamic acid는 lysine 유사체로 plasminogen의 fibrin 결합을 억제하여 혈전 분해를 줄이고 형성된 clot을 보존한다.',
      '옳다. PAI-1은 plasmin 자체보다 그 상위의 plasminogen activator를 억제한다.',
      '옳다. α2-Antiplasmin은 활성 plasmin을 억제하는 내인성 섬유소용해 조절 단백질이다.'
    ],
    rationale: '혈전용해제는 plasmin 생성을 촉진하지만 tranexamic acid는 plasminogen의 fibrin 결합을 막아 혈전 분해를 억제한다. PAI-1과 antiplasmin의 작용 단계도 구별한다.',
    notesPages: [29],
    examRefs: [{id: '22-2023-41-p51', page: 51}, {id: '22-2025-33-p51', page: 51}, {id: '22-2021-57-p52', page: 52}],
    lectureSources: [{label: '사용자 약리학 필기', page: 29}, {label: 'Om 약리학 정리', page: 148}, {label: 'Om 약리학 정리', page: 152}]
  }
];
