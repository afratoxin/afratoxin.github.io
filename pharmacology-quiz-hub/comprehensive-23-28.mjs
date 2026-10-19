export default [
  {
    id: 'comp-L23-Q1', lecture: 23,
    concept: 'MIC·MBC의 검사상 의미와 체내 효과 해석의 한계',
    format: 'judgment', polarity: 'incorrect',
    stem: '동일한 균주에 대한 한 항균제의 MIC는 2 mg/L, MBC는 8 mg/L였다. 이 결과의 해석으로 옳지 않은 것은?',
    options: [
      '검사 조건에서 증식을 억제한 최저 농도는 2 mg/L이다.',
      '검사 조건에서 살균 기준을 충족한 최저 농도는 8 mg/L이다.',
      '이 검사값만으로 투여 후 시간에 따른 농도 변화를 알 수는 없다.',
      '감염 조직에서 8 mg/L가 측정되면 체내 살균 성공을 판단할 수 있다.',
      '다른 균주·항균제 조합에서는 MIC와 MBC가 같은 값일 수도 있다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳은 설명이다. MIC는 정해진 검사 조건에서 눈에 보이는 미생물 증식을 억제하는 최소 농도다.',
      '옳은 설명이다. MBC는 정해진 검사 조건에서 미생물을 사멸시키는 데 필요한 최소 농도다.',
      '옳은 설명이다. MIC와 MBC는 농도 기준이며 환자에서 농도가 얼마나 오래 유지되는지를 직접 반영하지 않는다.',
      '옳지 않은 설명이다. 조직의 pH·산소 상태, 균량, 약물 분포와 환자의 면역 상태가 검사 조건과 다르므로 조직 농도 하나로 살균 성공을 판단할 수 없다.',
      '옳은 설명이다. MIC와 MBC의 관계는 약물과 균주에 따라 달라지며 두 값이 같을 수도 있다.'
    ],
    rationale: 'MIC·MBC는 시험관 안에서 얻은 농도 지표다. 실제 감염 부위의 환경과 시간에 따른 노출을 함께 고려해야 체내 효과를 해석할 수 있다.',
    notesPages: [30],
    examRefs: [{id: '23-2021-61-p54', page: 54}, {id: '23-2020-63-p55', page: 55}],
    lectureSources: [{label: '23강 항생제 치료의 기본 원리(2026 v2)', page: 31}, {label: '23강 항생제 치료의 기본 원리(2026 v2)', page: 33}, {label: 'Om 요약본', page: 157}],
    verifiedSources: []
  },
  {
    id: 'comp-L23-Q2', lecture: 23,
    concept: '항균제별 주요 PK/PD 노출 지표의 구별',
    format: 'association',
    stem: '강의의 수정된 PK/PD 표를 기준으로, 대표 항균제와 우선 평가할 노출 지표의 연결이 옳은 것은?',
    options: [
      'Aminoglycoside — fT>MIC',
      'Penicillin — Cmax/MIC',
      'Vancomycin — AUC24/MIC',
      'Fluoroquinolone — fT>MIC',
      'Erythromycin — Cmax/MIC'
    ],
    answerIndex: 2,
    explanations: [
      '틀린 연결이다. Aminoglycoside는 농도 의존적 살균을 보여 Cmax/MIC가 대표 지표다.',
      '틀린 연결이다. Penicillin을 비롯한 β-lactam은 유리 약물 농도가 MIC 이상인 시간인 fT>MIC가 대표 지표다.',
      '옳은 연결이다. Vancomycin은 일정 기간의 전체 노출을 반영하는 AUC24/MIC를 주요 효력 지표로 사용한다.',
      '틀린 연결이다. 수정된 표에서 fluoroquinolone의 주요 지표는 AUC/MIC이며 Cmax/MIC도 관련된다.',
      '틀린 연결이다. Erythromycin은 적절한 노출 시간 확보와 연결되며 fT>MIC가 주요 지표로 제시된다.'
    ],
    rationale: '최고농도, 기준 농도 이상인 시간, 전체 노출 중 어떤 요소가 중요한지는 약물군에 따라 다르다. Vancomycin은 AUC24/MIC와 연결한다.',
    notesPages: [30],
    examRefs: [{id: '23-2025-72-p53', page: 53}, {id: '23-2023-43-p54', page: 54}],
    lectureSources: [{label: '23강 항생제 치료의 기본 원리(2026 v2)', page: 47}, {label: '23강 항생제 치료의 기본 원리(2026 v2)', page: 48}],
    verifiedSources: []
  },
  {
    id: 'comp-L23-Q3', lecture: 23,
    concept: '여러 항균제의 세포 내 농도를 낮추는 유출펌프 내성',
    format: 'case',
    stem: '구조가 다른 여러 항균제에 내성을 보이는 균주를 조사했다. 약물의 초기 유입과 표적에 대한 결합은 유지되지만, 세포 안으로 들어간 약물이 정상 균주보다 빨리 사라졌다. 약물 분해산물은 검출되지 않았다. 가장 잘 맞는 변화는?',
    options: [
      '유출펌프 활성 증가',
      'β-lactamase에 의한 약물 분해 증가',
      'PBP의 약물 결합 친화도 감소',
      'Porin 감소에 의한 초기 유입 억제',
      '엽산 합성 경로에 대한 의존도 감소'
    ],
    answerIndex: 0,
    explanations: [
      '정답이다. 유출펌프는 이미 들어온 약물을 밖으로 배출하므로 정상적인 초기 유입에도 세포 내 축적이 감소한다. 기질 범위가 넓으면 다제내성과 연결된다.',
      '약물 불활성화 기전이다. 분해산물이 없고 여러 약물의 세포 내 소실이 빨라진 결과는 유출 증가에 더 잘 맞는다.',
      '표적 변형에 의한 내성이다. 이 경우 약물의 표적 결합이 달라지며, 제시된 정상 결합 결과와 맞지 않는다.',
      '세포 내 수송 저하 기전이다. Porin 감소라면 초기 유입 자체가 감소해야 하므로 제시된 관찰과 다르다.',
      '대사 경로의 변경·우회에 해당한다. 엽산 합성 억제제에 대한 내성을 설명할 수 있지만 여러 약물의 배출 속도 증가는 설명하지 못한다.'
    ],
    rationale: '유입 감소와 유출 증가는 모두 세포 내 농도를 낮춘다. 초기 유입이 유지된 상태에서 약물이 빨리 소실되면 유출펌프 증가가 가장 적절하다.',
    notesPages: [30],
    examRefs: [{id: '23-2025-71-p53', page: 53}],
    lectureSources: [{label: '23강 항생제 치료의 기본 원리(2026 v2)', page: 40}, {label: '23강 항생제 치료의 기본 원리(2026 v2)', page: 41}, {label: 'Om 요약본', page: 155}],
    verifiedSources: []
  },
  {
    id: 'comp-L23-Q4', lecture: 23,
    concept: '항균제 선택에서 살균성·감수성과 환자 요인을 함께 판단',
    format: 'judgment', polarity: 'incorrect',
    stem: '항균제 선택의 기본 원칙에 관한 설명으로 옳지 않은 것은?',
    options: [
      '치료를 시작하기 전에 세균 감염의 가능성과 항균제의 필요성을 검토한다.',
      '살균성이라는 분류는 정균성 약물보다 임상적으로 우수한 선택임을 뜻한다.',
      '병인 미생물이 동정되면 초기 경험적 치료의 항균 범위를 재검토한다.',
      '감수성 결과와 함께 신·간기능, 알레르기 및 감염 부위를 고려한다.',
      '병인 미생물 외에 정상세균총에 미칠 영향도 항균제 선택에 반영한다.'
    ],
    answerIndex: 1,
    explanations: [
      '옳은 설명이다. 바이러스성 질환 등 항균제의 이득이 없는 상황인지 먼저 판단하는 것이 기본 원칙이다.',
      '옳지 않은 설명이다. 살균·정균은 미생물에 대한 작용의 분류다. 정상 면역 등 조건에 따라 정균만으로 충분할 수 있으며 살균제가 임상적으로 우월하다고 단정할 수 없다.',
      '옳은 설명이다. 원인균을 알기 전과 후의 정보가 다르므로 동정·감수성 결과에 따라 적절한 범위로 조정할 수 있다.',
      '옳은 설명이다. 시험관 내 감수성만으로 약물 도달 여부와 환자의 독성 위험을 판단할 수 없다.',
      '옳은 설명이다. 항균제는 정상세균총도 변화시켜 기회감염 등 문제를 일으킬 수 있다.'
    ],
    rationale: '항균제 선택은 병인균의 감수성, 환자 상태, 감염 부위와 안전성을 함께 판단하는 과정이다. 살균성 자체를 최우선 목표로 삼지는 않는다.',
    notesPages: [29, 30],
    examRefs: [{id: '23-2021-62-p55', page: 55}, {id: '23-2023-44-p54', page: 54}, {id: '23-2018-1-p56', page: 56}],
    lectureSources: [{label: '23강 항생제 치료의 기본 원리(2026 v2)', page: 25}, {label: '23강 항생제 치료의 기본 원리(2026 v2)', page: 29}, {label: '23강 항생제 치료의 기본 원리(2026 v2)', page: 35}, {label: 'Om 요약본', page: 157}],
    verifiedSources: []
  },
  {
    id: 'comp-L23-Q5', lecture: 23,
    concept: '항생제 투여 후 효과의 정의와 β-lactam의 균종별 예외',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Post-antibiotic effect(PAE)에 관한 설명으로 옳지 않은 것은?',
    options: [
      '항균제를 제거한 뒤에도 세균의 증식 억제가 이어지는 현상이다.',
      '항균제에 노출된 세균이 정상 활동을 회복하는 데 걸리는 시간과 관련된다.',
      'Aminoglycoside 등 단백질 합성 억제제에서 뚜렷하게 관찰될 수 있다.',
      '세포벽 작용 항균제도 그람양성균에서는 PAE를 보일 수 있다.',
      'Carbapenem도 녹농균에 대해서는 PAE가 없거나 매우 짧다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. PAE의 기준은 약물이 제거된 후에도 성장 억제가 남는다는 점이다.',
      '옳은 설명이다. 약물 노출로 손상된 세포 기능이 회복되는 데 시간이 걸려 증식 억제가 지속될 수 있다.',
      '옳은 설명이다. 단백질·핵산 합성 억제제에서 주로 관찰하며 aminoglycoside가 대표적이다.',
      '옳은 설명이다. 세포벽 작용 항균제의 PAE는 그람양성균에서 관찰되고 그람음성균에서는 없거나 짧은 경향이 있다.',
      '옳지 않은 설명이다. Carbapenem은 그람음성균, 특히 P. aeruginosa에서도 PAE가 관찰되는 예외로 제시된다.'
    ],
    rationale: 'PAE는 약물 제거 후 남는 증식 억제다. 세포벽 작용 약물의 일반 경향을 기억하되 carbapenem의 그람음성균 PAE를 구별한다.',
    notesPages: [30],
    examRefs: [{id: '23-2023-43-p54', page: 54}, {id: '23-2021-60-p54', page: 54}, {id: '23-2019-77-p55', page: 55}],
    lectureSources: [{label: '23강 항생제 치료의 기본 원리(2026 v2)', page: 46}, {label: 'Om 요약본', page: 158}],
    verifiedSources: []
  },
  {
    id: 'comp-L24-Q1', lecture: 24,
    concept: 'β-lactam의 기질 모방과 PBP 효소 억제',
    format: 'judgment', polarity: 'correct',
    stem: 'β-lactam 항균제가 peptidoglycan의 교차결합을 방해하는 과정을 옳게 설명한 것은?',
    options: [
      '막 인지질에 직접 결합하여 이온 누출을 증가시킨다.',
      '세포벽 전구체의 D-Ala-D-Ala 말단을 감싸 효소 접근을 막는다.',
      '30S에 결합하여 잘못된 아미노산이 포함된 단백질을 만들게 한다.',
      'D-Ala-D-Ala를 모방해 PBP의 효소 활성을 억제한다.',
      'PABA와 경쟁하여 세포벽 재료에 필요한 엽산 합성을 차단한다.'
    ],
    answerIndex: 3,
    explanations: [
      '틀린 설명이다. 세포막의 지질과 결합하여 막을 손상시키는 것은 polymyxin 계열과 연결한다.',
      '틀린 설명이다. 전구체 말단 자체에 결합하는 것은 vancomycin의 작용이다. β-lactam은 그 구조를 모방해 효소인 PBP에 결합한다.',
      '틀린 설명이다. 30S 결합에 의한 오독 유발은 aminoglycoside의 작용이다.',
      '옳은 설명이다. β-lactam이 PBP를 억제하면 peptidoglycan 가닥 사이의 교차결합이 방해되어 세포벽이 약해진다.',
      '틀린 설명이다. PABA 유사체로 엽산 합성 효소를 경쟁적으로 억제하는 것은 sulfonamide다.'
    ],
    rationale: 'β-lactam의 직접 결합 대상은 PBP다. D-Ala-D-Ala를 모방하는 것과 전구체의 D-Ala-D-Ala에 직접 붙는 작용을 구별한다.',
    notesPages: [31],
    examRefs: [{id: '24-2025-73-p56', page: 56}, {id: '24-2021-63-p58', page: 58}],
    lectureSources: [{label: '24강 페니실린계·세파계 항생제(2026 v2)', page: 10}, {label: 'Om 요약본', page: 160}],
    verifiedSources: []
  },
  {
    id: 'comp-L24-Q2', lecture: 24,
    concept: 'Penicillin 아형별 항균 범위와 β-lactamase 안정성',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Penicillin계 약물과 특징의 연결로 옳지 않은 것은?',
    options: [
      'Penicillin G — Treponema pallidum 감염과 연결되는 천연 penicillin이다.',
      'Oxacillin — 변형 PBP2a를 갖는 MRSA에도 penicillinase 저항성 덕분에 활성을 유지한다.',
      'Ampicillin — Listeria·enterococcus 감염에 사용되는 aminopenicillin이다.',
      'Amoxicillin — β-lactamase에 취약하여 clavulanic acid와 병합할 수 있다.',
      'Piperacillin — Pseudomonas aeruginosa 활성을 갖는 확장범위 penicillin이다.'
    ],
    answerIndex: 1,
    explanations: [
      '옳은 연결이다. Penicillin G·V는 천연 penicillin이며 매독균에 대한 활성이 강조된다.',
      '옳지 않은 연결이다. Oxacillin의 penicillinase 저항성과 PBP2a에 대한 결합은 별개다. 항포도상구균 penicillin은 MSSA에 사용하지만 MRSA의 변형 PBP에는 효과가 낮다.',
      '옳은 연결이다. Ampicillin·amoxicillin은 aminopenicillin이며 Listeria·enterococcus 감염과 연결한다.',
      '옳은 연결이다. Amoxicillin의 약물 분해를 줄이기 위해 β-lactamase 억제제인 clavulanic acid를 병합할 수 있다.',
      '옳은 연결이다. Piperacillin·ticarcillin은 항녹농균 penicillin으로 분류된다.'
    ],
    rationale: 'β-lactamase에 안정한 약물이어도 표적인 PBP가 바뀌면 내성이 생긴다. Oxacillin의 MSSA 활성과 MRSA의 PBP2a 내성을 구별한다.',
    notesPages: [31],
    examRefs: [{id: '24-2022-55-p57', page: 57}, {id: '24-2021-63-p58', page: 58}, {id: '24-2019-75-p59', page: 59}],
    lectureSources: [{label: '24강 페니실린계·세파계 항생제(2026 v2)', page: 20}, {label: '24강 페니실린계·세파계 항생제(2026 v2)', page: 21}, {label: '24강 페니실린계·세파계 항생제(2026 v2)', page: 22}, {label: '24강 페니실린계·세파계 항생제(2026 v2)', page: 23}, {label: 'Om 요약본', page: 161}],
    verifiedSources: []
  },
  {
    id: 'comp-L24-Q3', lecture: 24,
    concept: 'Cephalosporin 세대별 범위와 MRSA·녹농균의 구별',
    format: 'judgment', polarity: 'incorrect',
    stem: '강의에서 강조한 cephalosporin의 세대별 항균 범위에 관한 설명으로 옳지 않은 것은?',
    options: [
      '1세대는 주로 그람양성균을 대상으로 하며 그람음성균 범위는 제한적이다.',
      '2세대는 1세대에 비해 그람음성균에 대한 항균 범위가 확대된다.',
      '3세대는 그람음성균 범위가 넓어져 중증 감염에도 사용된다.',
      '4세대에서 강조하는 범위 중 하나는 Pseudomonas aeruginosa다.',
      '5세대의 ceftaroline은 MRSA와 녹농균 모두에 활성을 갖는다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. 1세대의 주된 강점은 그람양성균이며 그람음성균 활성이 아예 없다는 뜻은 아니다.',
      '옳은 설명이다. 2세대는 1세대보다 그람음성균 범위가 확대되는 것이 기본 비교점이다.',
      '옳은 설명이다. 3세대는 그람음성균에 대한 범위 확대와 중증 감염 사용이 강조된다. 개별 약물의 녹농균 활성에는 차이가 있다.',
      '옳은 설명이다. 강의는 4세대의 녹농균 활성을 주요 구별점으로 제시한다.',
      '옳지 않은 설명이다. 강의의 대표 5세대 약물 ceftaroline은 MRSA 활성을 갖지만 녹농균에는 활성이 없다.'
    ],
    rationale: '세대가 높아진다고 모든 균에 대한 범위가 함께 넓어지는 것은 아니다. 강의의 대표 비교는 4세대의 녹농균 활성과 5세대 ceftaroline의 MRSA 활성이다.',
    notesPages: [31],
    examRefs: [{id: '24-2025-74-p57', page: 57}, {id: '24-2022-30-p57', page: 57}, {id: '24-2020-66-p58', page: 58}],
    lectureSources: [{label: '24강 페니실린계·세파계 항생제(2026 v2)', page: 28}, {label: '24강 페니실린계·세파계 항생제(2026 v2)', page: 31}, {label: '24강 페니실린계·세파계 항생제(2026 v2)', page: 32}, {label: '24강 페니실린계·세파계 항생제(2026 v2)', page: 45}, {label: 'Om 요약본', page: 162}],
    verifiedSources: []
  },
  {
    id: 'comp-L24-Q4', lecture: 24,
    concept: 'β-lactam 과민반응의 흔한 양상과 구조에 따른 교차반응',
    format: 'judgment', polarity: 'incorrect',
    stem: 'β-lactam의 과민반응과 교차반응에 관한 설명으로 옳지 않은 것은?',
    options: [
      '과민반응에서 흔한 임상 양상은 피부 발진이다.',
      '아나필락시스는 가능하지만 피부 발진보다 드물다.',
      'Penicillin과 carbapenem 사이에는 높은 교차반응률이 나타나는 것이 일반적이다.',
      'Aminopenicillin과 일부 cephalosporin의 유사한 side chain은 교차반응과 관련된다.',
      'Penicillin과 monobactam 사이의 교차반응은 대체로 매우 낮다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳은 설명이다. 강의는 β-lactam 과민반응의 가장 흔한 양상으로 rash를 제시한다.',
      '옳은 설명이다. 심각한 아나필락시스는 발생할 수 있으나 매우 드문 반응으로 제시된다.',
      '옳지 않은 설명이다. 강의에서 penicillin–carbapenem 교차반응은 대체로 minimal로 정리한다.',
      '옳은 설명이다. β-lactam 고리의 공통성만이 아니라 side chain의 구조적 유사성도 교차반응을 설명한다.',
      '옳은 설명이다. Penicillin–monobactam 교차반응은 거의 없거나 매우 낮은 경향으로 제시된다. 이를 개별 환자의 사용 가능 여부를 자동 결정하는 규칙으로 삼지는 않는다.'
    ],
    rationale: 'β-lactam 과민반응은 피부 발진이 대표적이고 아나필락시스는 드물다. 계열 간 교차반응의 정도와 side chain의 유사성을 구별한다.',
    notesPages: [31],
    examRefs: [{id: '24-2023-46-p57', page: 57}, {id: '24-2021-65-p58', page: 58}, {id: '24-2017-57-p59', page: 59}],
    lectureSources: [{label: '24강 페니실린계·세파계 항생제(2026 v2)', page: 41}, {label: '24강 페니실린계·세파계 항생제(2026 v2)', page: 42}, {label: 'Om 요약본', page: 163}],
    verifiedSources: []
  },
  {
    id: 'comp-L24-Q5', lecture: 24,
    concept: 'MRSA의 mecA·PBP2a 표적 변형 내성',
    format: 'case',
    stem: '한 S. aureus 균주에서 mecA가 검출되었다. 세포벽 합성은 유지되지만 다수의 β-lactam에 대한 감수성이 감소했다. 이 내성의 핵심을 가장 잘 설명한 것은?',
    options: [
      'D-Ala-D-Ala 말단을 D-Ala-D-Lac으로 바꾸어 약물 결합을 낮춘다.',
      'Peptidoglycan 세포벽을 없애 세포벽 합성 억제제의 표적을 제거한다.',
      '외막 porin을 감소시켜 작은 β-lactam의 유입을 차단한다.',
      '외부 엽산 이용을 늘려 β-lactam의 대사 차단을 우회한다.',
      '세포벽 합성 기능을 가진 저친화성 PBP2a를 만든다.'
    ],
    answerIndex: 4,
    explanations: [
      'Vancomycin 내성에서 중요한 전구체 말단 변화다. MRSA의 mecA에 의한 β-lactam 내성은 PBP2a와 연결한다.',
      'Mycoplasma의 본질적 β-lactam 내성을 설명하는 표적 부재다. MRSA는 세포벽을 유지한다.',
      '그람음성균에서 가능한 투과성 내성이다. S. aureus는 그람양성균이며 mecA의 핵심 결과는 porin 변화가 아니다.',
      '엽산 합성 억제제에 대한 대사 우회를 설명한다. β-lactam은 엽산 경로 대신 PBP를 표적으로 한다.',
      '정답이다. mecA가 암호화하는 PBP2a는 세포벽 합성 기능을 유지하면서 대부분의 β-lactam에 낮은 친화도를 보인다. Ceftaroline처럼 활성을 유지하는 예외도 있다.'
    ],
    rationale: 'MRSA는 세포벽을 없애는 대신 β-lactam이 잘 결합하지 않는 PBP2a를 사용한다. 약물 분해와 표적 변형은 서로 다른 내성 기전이다.',
    notesPages: [31],
    examRefs: [{id: '24-2023-48-p57', page: 57}, {id: '24-2019-76-p59', page: 59}, {id: '24-2018-57-p59', page: 59}],
    lectureSources: [{label: '24강 페니실린계·세파계 항생제(2026 v2)', page: 16}, {label: 'Om 요약본', page: 161}],
    verifiedSources: []
  },
  {
    id: 'comp-L25-Q1', lecture: 25,
    concept: '혐기·산성 환경에서 aminoglycoside의 세균 내 진입 감소',
    format: 'case',
    stem: 'Gentamicin을 정맥 투여해 충분한 혈중 노출을 얻었고 분리균도 시험관에서 감수성을 보였다. 그러나 산소분압이 낮고 산성인 농양에서는 효과가 떨어졌다. 가장 직접적인 약리학적 설명은?',
    options: [
      '소화관 내 금속 양이온과의 킬레이트 형성이 증가했다.',
      '세균 내막 통과에 필요한 산소 의존적 수송이 약해졌다.',
      '간의 활성화 대사가 줄어 gentamicin 활성체가 부족해졌다.',
      '혈장 단백결합이 강해져 유리 약물 분율이 감소했다.',
      '신장 배설이 빨라져 측정된 혈중 노출과 조직 노출이 함께 감소했다.'
    ],
    answerIndex: 1,
    explanations: [
      '경구 투여 약물의 흡수 단계에 해당하는 설명이다. 정맥 투여 gentamicin의 농양 내 진입 실패를 설명하지 못한다.',
      '정답이다. Aminoglycoside는 세균 내막을 통과할 때 산소 의존적 에너지 수송을 필요로 하므로 혐기·산성 환경에서 진입이 감소한다.',
      'Gentamicin은 간에서 활성화되어야 작용하는 전구약물이 아니다. 주로 미변화체로 신장 배설된다.',
      'Aminoglycoside의 단백결합은 낮으며 제시된 저산소·산성 환경의 핵심 제한 요인은 세균 내 진입이다.',
      '충분한 혈중 노출이 확인되었다는 조건과 맞지 않는다. 혈중 농도가 충분해도 세균 내부로 들어가는 관문에서 실패할 수 있다.'
    ],
    rationale: '시험관 감수성과 혈중 노출은 세균 내부의 약물 농도를 보장하지 않는다. Aminoglycoside의 산소 의존적 내막 수송은 농양 환경에서 약해진다.',
    notesPages: [32],
    examRefs: [{id: '25-2025-79-p60', page: 60}, {id: '25-2023-50-p60', page: 60}, {id: '25-2021-66-p61', page: 61}],
    lectureSources: [{label: '25강 아미노글리코사이드계·설파계·퀴놀론 항생제(2026 v1)', page: 12}, {label: '25강 아미노글리코사이드계·설파계·퀴놀론 항생제(2026 v1)', page: 14}, {label: 'Om 요약본', page: 164}],
    verifiedSources: []
  },
  {
    id: 'comp-L25-Q2', lecture: 25,
    concept: 'Aminoglycoside 축적 장기와 독성의 가역성',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Aminoglycoside의 독성에 관한 설명으로 옳지 않은 것은?',
    options: [
      '근위세뇨관에서 재흡수된 약물의 축적은 신독성과 연결된다.',
      '신독성이 발생해도 소변량이 뚜렷하게 줄지 않을 수 있다.',
      '세뇨관 손상은 비가역적인 반면 유모세포 손상은 재생으로 회복되는 것이 일반적이다.',
      '내이 축적에 따른 와우 유모세포 손상은 영구적인 청력 소실을 남길 수 있다.',
      '중증근무력증이나 근이완제 병용은 급성 신경근 차단 위험과 관련된다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳은 설명이다. 여과된 aminoglycoside 일부가 근위세뇨관으로 재흡수·축적되어 세뇨관 손상을 일으킨다.',
      '옳은 설명이다. 비핍뇨성 신손상이 가능하므로 소변량이 유지된다고 신독성을 배제할 수 없다.',
      '옳지 않은 설명이다. 가역성의 관계가 반대다. 세뇨관 상피는 재생하여 신독성이 대개 가역적이지만 내이 유모세포 손상은 비가역적이다.',
      '옳은 설명이다. 와우형 이독성은 유모세포의 소실과 관련되며 청력 손상이 영구적으로 남을 수 있다.',
      '옳은 설명이다. Aminoglycoside는 신경근 전달을 억제할 수 있어 중증근무력증이나 신경근 차단제 병용에서 위험이 커진다.'
    ],
    rationale: 'Aminoglycoside는 신피질과 내이에 축적된다. 세뇨관 재생이 가능한 신독성과 재생되지 않는 유모세포 손상을 구별한다.',
    notesPages: [32],
    examRefs: [{id: '25-2019-73-p62', page: 62}, {id: '36-2023-76-p86', page: 86}],
    lectureSources: [{label: '25강 아미노글리코사이드계·설파계·퀴놀론 항생제(2026 v1)', page: 16}, {label: '25강 아미노글리코사이드계·설파계·퀴놀론 항생제(2026 v1)', page: 19}, {label: 'Om 요약본', page: 165}],
    verifiedSources: []
  },
  {
    id: 'comp-L25-Q3', lecture: 25,
    concept: 'TMP–SMX의 엽산 경로 순차적 차단에 의한 상승작용',
    format: 'judgment', polarity: 'correct',
    stem: 'Sulfamethoxazole과 trimethoprim을 병용할 때의 상승작용을 가장 잘 설명한 것은?',
    options: [
      '두 약물이 DHPS의 같은 결합 부위를 번갈아 점유하여 저해 시간을 늘린다.',
      'Trimethoprim이 sulfamethoxazole의 장 흡수를 높여 유효 농도를 증가시킨다.',
      'Sulfamethoxazole이 trimethoprim의 신장 배설을 억제하여 반감기를 늘린다.',
      '각각 DHPS와 DHFR를 억제해 엽산 합성을 순차 차단한다.',
      '두 약물이 세균 리보솜의 30S와 50S를 각각 억제하여 단백질 합성을 함께 막는다.'
    ],
    answerIndex: 3,
    explanations: [
      '틀린 설명이다. 두 약물은 같은 효소의 같은 부위가 아니라 엽산 경로의 서로 다른 효소를 억제한다.',
      '틀린 설명이다. 병용 상승작용의 핵심은 흡수 증가가 아니라 DHPS·DHFR의 순차적 차단이다.',
      '틀린 설명이다. 배설 억제로 농도를 올리는 약동학적 상승작용이 주된 설명은 아니다.',
      '옳은 설명이다. PABA 유사체인 sulfamethoxazole은 DHPS를, trimethoprim은 DHFR를 억제하여 엽산 경로를 더 강하게 차단한다.',
      '틀린 설명이다. 두 약물의 직접 표적은 리보솜 소단위가 아니라 엽산 대사 효소다.'
    ],
    rationale: 'TMP–SMX의 상승작용은 동일한 대사 경로의 연속된 두 효소를 함께 막는 약력학적 협력이다.',
    notesPages: [32],
    examRefs: [{id: '25-2025-81-p60', page: 60}, {id: '25-2023-51-p61', page: 61}, {id: '25-2022-34-p61', page: 61}],
    lectureSources: [{label: '25강 아미노글리코사이드계·설파계·퀴놀론 항생제(2026 v1)', page: 22}, {label: '25강 아미노글리코사이드계·설파계·퀴놀론 항생제(2026 v1)', page: 23}, {label: 'Om 요약본', page: 166}],
    verifiedSources: []
  },
  {
    id: 'comp-L25-Q4', lecture: 25,
    concept: 'Trimethoprim의 크레아티닌 분비 억제와 가성 신기능 저하',
    format: 'case',
    stem: 'TMP–SMX를 시작한 뒤 혈청 크레아티닌이 상승했다. BUN과 소변량은 안정적이고, 크레아티닌과 독립적인 방법으로 측정한 사구체여과율도 변하지 않았다. 이 크레아티닌 상승을 가장 잘 설명하는 기전은?',
    options: [
      '사구체여과의 감소',
      '골격근의 크레아티닌 생성 증가',
      '탈수로 인한 유효 순환혈액량 감소',
      '산화성 적혈구 손상에 따른 색소성 신손상',
      '크레아티닌의 근위세뇨관 분비 억제'
    ],
    answerIndex: 4,
    explanations: [
      '사구체여과 감소라면 독립적으로 측정한 여과율도 감소해야 한다. 제시된 조건은 여과율 변화 없는 약물 효과를 시사한다.',
      '크레아티닌 생성 증가도 혈중 수치에 영향을 줄 수 있으나 trimethoprim에서 학습할 핵심 기전은 세뇨관 분비 억제다.',
      '유효 혈액량 감소는 실제 신장 관류·여과의 저하를 설명한다. 독립적으로 측정한 여과율이 유지된 조건과 맞지 않는다.',
      '실제 신손상을 일으키는 별도의 기전이다. Sulfonamide의 용혈 위험과 trimethoprim에 의한 크레아티닌 분비 억제를 혼동하지 않는다.',
      '정답이다. Trimethoprim이 OCT2·MATE1 등 수송을 억제하면 크레아티닌 분비가 줄어 실제 GFR 저하 없이 혈청 수치가 상승할 수 있다.'
    ],
    rationale: '크레아티닌은 여과뿐 아니라 세뇨관 분비에도 영향을 받는다. Trimethoprim은 분비를 억제할 수 있다. 실제 환자에서는 결정뇨·간질성 신염 등 진짜 신손상도 따로 고려한다.',
    notesPages: [32],
    examRefs: [{id: '25-2025-80-p60', page: 60}],
    lectureSources: [{label: '25강 아미노글리코사이드계·설파계·퀴놀론 항생제(2026 v1)', page: 25}],
    verifiedSources: []
  },
  {
    id: 'comp-L25-Q5', lecture: 25,
    concept: 'Fluoroquinolone의 약물별 범위·배설 차이와 요로 노출',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Fluoroquinolone계 약물에 관한 설명으로 옳지 않은 것은?',
    options: [
      'Moxifloxacin은 미변화체의 요중 배설 비율이 높아 요로감염에 특히 적합하다.',
      'Ciprofloxacin은 호기성 그람음성균과 녹농균에 대한 활성이 강조된다.',
      'Levofloxacin은 폐렴구균에 대한 활성을 갖는 호흡기 quinolone이다.',
      '경구 투여 시 금속 양이온과 킬레이트를 형성하면 흡수가 감소할 수 있다.',
      'DNA gyrase와 topoisomerase IV를 억제하여 세균의 DNA 합성을 방해한다.'
    ],
    answerIndex: 0,
    explanations: [
      '옳지 않은 설명이다. Moxifloxacin은 간 포합이 주된 제거 경로이고 미변화체 요중 배설이 적어 요로감염에 적합하지 않다. 시험관 감수성만으로 요로 효과를 판단하면 안 된다.',
      '옳은 설명이다. Ciprofloxacin의 대표 강점은 녹농균을 포함한 호기성 그람음성균 활성이다.',
      '옳은 설명이다. Levofloxacin은 ciprofloxacin보다 폐렴구균 범위가 보강된 호흡기 quinolone으로 설명된다.',
      '옳은 설명이다. 철·칼슘·마그네슘 등과 흡수되지 않는 복합체를 형성하여 경구 노출이 감소할 수 있다.',
      '옳은 설명이다. Fluoroquinolone의 직접 표적은 세균의 DNA gyrase·topoisomerase IV이며 RNA polymerase가 아니다.'
    ],
    rationale: '같은 계열이라도 제거 경로가 다르면 감염 부위에 형성되는 농도가 달라진다. Moxifloxacin의 간 포합·낮은 요중 노출이 주요 구별점이다.',
    notesPages: [33],
    examRefs: [{id: '25-2022-58-p61', page: 61}, {id: '25-2019-70-p62', page: 62}, {id: '25-2021-68-p61', page: 61}],
    lectureSources: [{label: '25강 아미노글리코사이드계·설파계·퀴놀론 항생제(2026 v1)', page: 30}, {label: '25강 아미노글리코사이드계·설파계·퀴놀론 항생제(2026 v1)', page: 31}, {label: '25강 아미노글리코사이드계·설파계·퀴놀론 항생제(2026 v1)', page: 32}, {label: 'Om 요약본', page: 168}],
    verifiedSources: []
  },
  {
    id: 'comp-L26-Q1', lecture: 26,
    concept: 'Tetracycline계의 킬레이트·조직 분포 및 약물별 특징',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Tetracycline계 약물의 화학적 성질과 체내 경로에 관한 설명으로 옳지 않은 것은?',
    options: [
      '금속 양이온과의 킬레이트 형성은 소화관에서 흡수를 감소시킬 수 있다.',
      '성장 중인 치아의 칼슘에 침착하면 영구적인 치아 착색이 생길 수 있다.',
      'Doxycycline은 대변 배설이 주된 경로여서 구세대 신배설 약물과 구별된다.',
      'Minocycline의 높은 지질 용해도는 중추 침투와 어지럼·운동실조에 연결된다.',
      'Demeclocycline은 항이뇨호르몬 작용을 강화하여 수분 저류를 일으킨다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. 칼슘·철·마그네슘 등과 흡수되지 않는 복합체를 형성한다. 같은 성질이 치아·뼈 침착도 설명한다.',
      '옳은 설명이다. 성장 중인 석회화 조직에 침착해 치아 착색을 남길 수 있다. 다만 doxycycline 단기 투여의 소아 rickettsia 감염 예외와는 구별한다.',
      '옳은 설명이다. Doxycycline은 대변 배설이 주된 경로여서 신기능에 크게 의존하는 구세대 tetracycline과 약동학이 다르다.',
      '옳은 설명이다. Minocycline은 지질 용해도와 중추 침투가 높으며 전정계 증상인 어지럼·운동실조가 구별점이다.',
      '옳지 않은 설명이다. Demeclocycline은 항이뇨호르몬 작용을 억제해 신성 요붕증을 일으킬 수 있으며, 이 성질을 SIADH에서 활용한 적이 있다.'
    ],
    rationale: 'Tetracycline의 킬레이트 형성은 흡수 상호작용과 조직 침착을 함께 설명한다. Demeclocycline은 ADH 작용 강화가 아니라 억제와 연결한다.',
    notesPages: [33],
    examRefs: [{id: '26-2020-71-p63', page: 63}, {id: '23-2025-82-p53', page: 53}],
    lectureSources: [{label: '26강 기타항생제(2026 v3)', page: 6}, {label: '26강 기타항생제(2026 v3)', page: 7}, {label: '26강 기타항생제(2026 v3)', page: 8}, {label: 'Om 요약본', page: 169}],
    verifiedSources: []
  },
  {
    id: 'comp-L26-Q2', lecture: 26,
    concept: 'Macrolide 내 CYP3A4 억제 차이와 azithromycin 조직 축적',
    format: 'case',
    stem: 'CYP3A4로 대사되는 statin을 복용 중인 환자의 약물 상호작용을 검토하고 있다. 후보 항균제 중 50S에 작용하면서 CYP3A4 억제가 적고, 백혈구·조직 축적과 긴 반감기가 특징인 약물은?',
    options: [
      'Erythromycin',
      'Clarithromycin',
      'Azithromycin',
      'Clindamycin',
      'Chloramphenicol'
    ],
    answerIndex: 2,
    explanations: [
      'Erythromycin은 50S에서 translocation을 억제하지만 CYP3A4 억제가 강하고 반감기가 짧다. 제시된 상호작용·분포 특성에 맞지 않는다.',
      'Clarithromycin도 macrolide이지만 CYP3A4 억제가 강해 해당 효소의 기질 약물 노출을 증가시킬 수 있다.',
      '정답이다. Azithromycin은 CYP3A4 억제가 적으며 식세포와 조직에 축적되고 반감기가 길다는 점이 구별된다.',
      'Clindamycin도 50S에 작용하지만 제시된 긴 반감기와 백혈구 축적의 대표 macrolide는 azithromycin이다. Clindamycin에서는 장내세균총 변화에 주목한다.',
      'Chloramphenicol은 50S의 peptidyl transferase를 억제한다. 제시된 약동학적 특징보다 골수억제·재생불량성 빈혈이 주요 구별점이다.'
    ],
    rationale: '같은 50S 억제제라도 약동학과 상호작용이 다르다. Azithromycin은 erythromycin·clarithromycin과 달리 CYP3A4 억제가 적고 조직 내에 오래 남는다.',
    notesPages: [34],
    examRefs: [{id: '26-2023-54-p63', page: 63}, {id: '26-2021-70-p63', page: 63}, {id: '26-2019-71-p64', page: 64}],
    lectureSources: [{label: '26강 기타항생제(2026 v3)', page: 12}, {label: 'Om 요약본', page: 171}],
    verifiedSources: []
  },
  {
    id: 'comp-L26-Q3', lecture: 26,
    concept: 'MLSB 교차내성의 범위와 clindamycin의 유도성 내성·세균총 영향',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Macrolide와 clindamycin의 표적·내성 및 정상세균총 영향에 관한 설명으로 옳지 않은 것은?',
    options: [
      '23S rRNA의 erm 매개 메틸화는 macrolide와 clindamycin의 교차내성과 관련된다.',
      'D-test 양성은 macrolide에 의해 유도되는 clindamycin 내성을 시사한다.',
      'Chloramphenicol은 같은 50S 영역에 결합하므로 MLSB 교차내성군에 포함된다.',
      '겹치는 50S 결합 부위를 두고 경쟁하면 macrolide와 clindamycin의 병용에서 길항이 생길 수 있다.',
      'Clindamycin의 장내 정상 혐기균 억제는 C. difficile 과증식과 연결된다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳은 설명이다. erm 매개 메틸화는 macrolide·lincosamide·streptogramin B의 결합을 방해하는 MLSB 내성을 일으킨다.',
      '옳은 설명이다. Erythromycin 내성·clindamycin 감수성으로 보이는 균주에서도 유도성 erm 내성이 숨을 수 있어 D-test로 확인한다.',
      '옳지 않은 설명이다. Chloramphenicol은 결합 부위가 인접하지만 MLSB군에는 포함되지 않는다. 강의는 chloramphenicol acetyltransferase에 의한 별도 내성 기전을 구별한다.',
      '옳은 설명이다. 두 약물의 결합 영역이 겹쳐 서로 경쟁할 수 있으므로 같은 리보솜 표적이라는 사실이 병용 상승효과를 뜻하지 않는다.',
      '옳은 설명이다. 정상 혐기균이 줄면 C. difficile의 증식을 억제하던 경쟁이 감소해 독소성 결장염이 생길 수 있다.'
    ],
    rationale: '50S의 인접한 부위에 붙는 것과 내성 기전이 같은 것은 구별해야 한다. MLSB는 macrolide·lincosamide·streptogramin B를 가리키며 chloramphenicol은 포함하지 않는다.',
    notesPages: [34],
    examRefs: [{id: '26-2023-54-p63', page: 63}, {id: '26-2019-3-p64', page: 64}, {id: '28-2022-53-p67', page: 67}],
    lectureSources: [{label: '26강 기타항생제(2026 v3)', page: 3}, {label: '26강 기타항생제(2026 v3)', page: 11}, {label: '26강 기타항생제(2026 v3)', page: 13}],
    verifiedSources: []
  },
  {
    id: 'comp-L26-Q4', lecture: 26,
    concept: 'Chloramphenicol의 두 혈액독성과 회색아기증후군의 기전 차이',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Chloramphenicol의 독성에 관한 설명으로 옳지 않은 것은?',
    options: [
      '골수억제는 용량 의존적이며 약물 노출이 줄면 회복될 수 있다.',
      '재생불량성 빈혈도 용량 의존적이어서 노출 정도로 발생을 예측한다.',
      '골수억제에는 사람 미토콘드리아 리보솜의 단백질 합성 억제가 관련된다.',
      '회색아기증후군은 신생아의 미성숙한 포합 대사와 느린 배설에 따른 축적과 관련된다.',
      '뇌척수액으로 이행할 수 있어도 심한 혈액독성 때문에 사용이 제한된다.'
    ],
    answerIndex: 1,
    explanations: [
      '옳은 설명이다. 흔히 비교하는 chloramphenicol의 골수억제는 용량 의존적이고 가역적인 독성이다.',
      '옳지 않은 설명이다. 재생불량성 빈혈은 특이체질성·용량 비의존적 반응이며 용량 의존적 골수억제와 기전·예측 가능성이 다르다.',
      '옳은 설명이다. 사람 미토콘드리아 리보솜과 세균 리보솜의 유사성 때문에 숙주의 단백질 합성도 영향을 받을 수 있다.',
      '옳은 설명이다. 신생아의 glucuronosyltransferase 미성숙과 느린 신배설이 약물 축적에 기여한다.',
      '옳은 설명이다. Chloramphenicol은 중추신경계 이행의 장점이 있지만 심한 혈액독성 때문에 사용이 제한된다.'
    ],
    rationale: '같은 혈액독성이라도 골수억제는 용량 의존적·가역적이고 재생불량성 빈혈은 특이체질성·용량 비의존적이다. 회색아기증후군은 신생아의 처리 능력 미성숙에 따른 축적이다.',
    notesPages: [34],
    examRefs: [{id: '26-2023-53-p63', page: 63}, {id: '26-2020-R4-p64', page: 64}],
    lectureSources: [{label: '26강 기타항생제(2026 v3)', page: 18}, {label: 'Om 요약본', page: 170}],
    verifiedSources: []
  },
  {
    id: 'comp-L26-Q5', lecture: 26,
    concept: 'Vancomycin의 기질 결합·투여 경로·주입 반응',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Vancomycin의 작용과 체내 경로에 관한 설명으로 옳지 않은 것은?',
    options: [
      'β-lactam과 마찬가지로 PBP 효소에 직접 결합하는 것이 주된 작용이다.',
      '경구 흡수가 매우 낮다는 특성을 C. difficile 결장염의 장관 내 작용에 활용한다.',
      '전신 감염에서 필요한 혈중 노출은 주로 정맥 투여로 얻는다.',
      '빠른 정맥 주입 때 생기는 홍조·가려움에는 직접적인 히스타민 유리가 관련된다.',
      '주로 신장으로 미변화체 배설되며 주요 효력 지표는 AUC24/MIC다.'
    ],
    answerIndex: 0,
    explanations: [
      '옳지 않은 설명이다. Vancomycin은 PBP가 아니라 세포벽 전구체의 D-Ala-D-Ala 말단에 결합해 효소의 접근을 막는다.',
      '옳은 설명이다. 경구로 흡수되지 않는 성질은 장관 내에 약물이 남아 국소적으로 작용하는 데 유리하다.',
      '옳은 설명이다. 경구 흡수가 불량하므로 전신 감염의 노출 확보에는 정맥 투여가 필요하다.',
      '옳은 설명이다. 대표적인 vancomycin 주입 반응은 비만세포의 직접적인 히스타민 유리로 발생하며 전형적 IgE 매개 알레르기와 구별한다.',
      '옳은 설명이다. 신기능이 제거에 중요하며 AUC24/MIC가 효력 지표다. 같은 최저농도에서도 전체 노출은 다를 수 있다.'
    ],
    rationale: 'Vancomycin은 세포벽 합성의 효소가 아니라 기질에 붙는다. 경구 국소 작용과 정맥 전신 작용, 주입 반응과 IgE 알레르기도 구별한다.',
    notesPages: [34],
    examRefs: [{id: '26-2019-3-p64', page: 64}, {id: '23-2025-72-p53', page: 53}],
    lectureSources: [{label: '26강 기타항생제(2026 v3)', page: 16}, {label: '26강 기타항생제(2026 v3)', page: 17}, {label: '26강 기타항생제(2026 v3)', page: 18}, {label: 'Om 요약본', page: 172}],
    verifiedSources: []
  },
  {
    id: 'comp-L27-Q1', lecture: 27,
    concept: 'Isoniazid의 pyridoxine 결핍·말초신경염과 NAT 대사',
    format: 'case',
    stem: '결핵 다제 치료 중 손발 저림이 나타났고 pyridoxine 결핍과의 관련성이 확인되었다. Mycolic acid 합성을 억제하며 NAT 대사의 개인차도 영향을 주는 원인 약물은?',
    options: [
      'Rifampin',
      'Ethambutol',
      'Isoniazid',
      'Pyrazinamide',
      'Streptomycin'
    ],
    answerIndex: 2,
    explanations: [
      'Rifampin은 세균 RNA polymerase를 억제한다. 간 대사효소 유도와 붉은색 소변·눈물이 대표 구별점이다.',
      'Ethambutol은 arabinosyl transferase를 억제하고 시신경염이 특징적이다. B6 결핍과 NAT 대사 조건에 맞지 않는다.',
      '정답이다. Isoniazid는 mycolic acid 합성을 억제하며 NAT에 의해 대사된다. Pyridoxine 결핍과 말초신경염이 연결된다.',
      'Pyrazinamide는 pyrazinoic acid로 전환되는 전구약물이다. 간독성·관절통과 연결하며 제시된 B6·NAT 특성과 다르다.',
      'Streptomycin은 aminoglycoside로 세균 리보솜에 작용하며 이독성·신독성이 중요한 구별점이다.'
    ],
    rationale: 'B6 결핍에 의한 말초신경염, mycolic acid 합성 억제, NAT 대사는 isoniazid를 가리키는 서로 다른 단서다.',
    notesPages: [35],
    examRefs: [{id: '27-2023-55-p65', page: 65}, {id: '27-2020-72-p65', page: 65}, {id: '27-2025-97-p64', page: 64}],
    lectureSources: [{label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 8}, {label: 'Om 요약본', page: 174}],
    verifiedSources: []
  },
  {
    id: 'comp-L27-Q2', lecture: 27,
    concept: '1차 항결핵제의 서로 다른 작용·유해반응과 병용 근거',
    format: 'judgment', polarity: 'incorrect',
    stem: '1차 항결핵제의 특징과 병용 근거에 관한 설명으로 옳지 않은 것은?',
    options: [
      'Rifampin은 간 대사효소를 유도하여 해당 효소 기질인 병용약의 노출을 낮출 수 있다.',
      'Rifampin의 붉은색 소변·눈물은 약물 자체의 색과 관련되어 나타날 수 있다.',
      'Ethambutol의 arabinosyl transferase 억제는 세포벽 약화와, 시신경염은 특징적 독성과 연결된다.',
      'Pyrazinamide의 활성체는 RNA polymerase를 선택적으로 억제한다.',
      '서로 다른 기전의 병용은 내성균 선택을 줄이는 데 도움이 되고 느린 균 증식은 장기 치료의 근거가 된다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳은 설명이다. Rifampin의 효소 유도로 기질 약물의 대사가 빨라져 혈중 노출과 효과가 감소할 수 있다.',
      '옳은 설명이다. Rifampin은 붉은색 체액 변화를 일으킬 수 있어 이 특징을 약물 자체의 색과 연결한다.',
      '옳은 설명이다. Ethambutol은 세포벽 합성 관련 효소를 억제하는 정균성 약물이며 시신경염이 구별점이다.',
      '옳지 않은 설명이다. Pyrazinamide의 정확한 기전은 완전히 규명되지 않았다. 강의는 막전위·에너지 생산 교란 등을 제시하며 RNA polymerase 억제는 rifampin과 연결한다.',
      '옳은 설명이다. 내성 변이의 선택을 막기 위한 병용과 느린 증식에 따른 긴 치료는 서로 다른 근거다.'
    ],
    rationale: '1차 항결핵제는 기전과 독성이 서로 다르다. Pyrazinamide를 rifampin의 RNA polymerase 억제와 바꾸지 않고, 기전이 완전히 확정되었다고 단정하지 않는다.',
    notesPages: [35],
    examRefs: [{id: '27-2023-55-p65', page: 65}, {id: '27-2022-3-p65', page: 65}, {id: '27-2025-97-p64', page: 64}],
    lectureSources: [{label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 5}, {label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 9}, {label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 10}, {label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 11}, {label: 'Om 요약본', page: 174}],
    verifiedSources: []
  },
  {
    id: 'comp-L27-Q3', lecture: 27,
    concept: 'Polyene 항진균제의 막 손상과 전신·국소 사용의 구별',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Amphotericin B와 nystatin의 특징을 비교한 설명으로 옳지 않은 것은?',
    options: [
      'Amphotericin B는 세포막 ergosterol에 결합하여 이온이 새는 통로를 형성한다.',
      'Nystatin은 전신 진균증에서 높은 혈중 농도를 확보하는 데 주로 사용된다.',
      'Amphotericin B는 위장관 흡수가 불량하여 전신 효과를 위해 주사로 투여한다.',
      'Amphotericin B는 항진균 범위가 넓어도 치료역은 좁고 신독성이 중요하다.',
      'Nystatin은 ergosterol 결합 기전을 가지며 Candida의 국소 감염과 연결된다.'
    ],
    answerIndex: 1,
    explanations: [
      '옳은 설명이다. 이미 형성된 세포막에 통로를 만들어 막 투과성과 이온 균형을 무너뜨린다. Ergosterol 합성 효소를 억제하는 azole과 다르다.',
      '옳지 않은 설명이다. Nystatin은 주로 Candida에 대한 국소 효과를 이용하는 약물이며 전신 진균증의 혈중 노출 확보에 사용하는 약물이 아니다.',
      '옳은 설명이다. Amphotericin B는 경구 흡수가 매우 낮아 전신 감염에서는 주사 투여와 연결한다.',
      '옳은 설명이다. 항진균 범위의 넓이와 치료역의 넓이는 다른 개념이다. Amphotericin B는 독성이 크고 특히 신독성이 중요하다.',
      '옳은 설명이다. Nystatin도 polyene으로 ergosterol에 결합해 막에 구멍을 만들며 Candida 국소 감염에 활용된다.'
    ],
    rationale: 'Amphotericin B와 nystatin은 ergosterol 결합·막 손상 기전을 공유한다. 전신 노출과 국소 효과의 사용 범위는 구별해야 한다.',
    notesPages: [35],
    examRefs: [{id: '27-2025-98-p64', page: 64}, {id: '27-2023-57-p65', page: 65}, {id: '27-2020-73-p66', page: 66}],
    lectureSources: [{label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 17}, {label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 18}, {label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 19}, {label: 'Om 요약본', page: 176}],
    verifiedSources: []
  },
  {
    id: 'comp-L27-Q4', lecture: 27,
    concept: 'Azole의 진균 효소 억제와 사람 CYP 상호작용·CYP2C19 변이',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Azole계 항진균제의 작용과 약동학에 관한 설명으로 옳지 않은 것은?',
    options: [
      '진균의 lanosterol 14α-demethylase 억제로 ergosterol 합성을 감소시킨다.',
      'Ketoconazole과 itraconazole은 사람 CYP3A 억제에 따른 약물 상호작용이 중요하다.',
      'Voriconazole의 약동학적 개인차에는 CYP2C19 유전형이 관여한다.',
      'CYP2C19의 대사 능력이 낮으면 voriconazole 노출이 증가할 수 있다.',
      'Itraconazole은 CYP3A 기질의 대사를 유도해 노출을 낮춘다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳은 설명이다. Azole의 항진균 표적은 ergosterol 생합성의 demethylase이며 세포막 성분의 합성을 방해한다.',
      '옳은 설명이다. 두 약물은 사람 CYP3A도 강하게 억제하여 기질 약물의 농도와 독성 위험을 높일 수 있다.',
      '옳은 설명이다. Voriconazole에서 강조한 대사 유전형은 CYP2C19이며 CYP2D6과 혼동하지 않는다.',
      '옳은 설명이다. 제거에 관여하는 대사가 느리면 동일한 투여 조건에서 노출이 높아질 수 있다.',
      '옳지 않은 설명이다. Itraconazole은 CYP3A 억제제이므로 해당 기질의 대사를 줄여 노출을 증가시키는 방향으로 작용할 수 있다. 효소 유도제 rifampin과 반대다.'
    ],
    rationale: 'Azole의 진균 표적 억제와 사람 CYP 억제에 따른 상호작용을 구별한다. Itraconazole의 효소 억제를 유도로 바꾸면 병용약 노출 변화의 방향도 반대가 된다.',
    notesPages: [35],
    examRefs: [{id: '27-2025-98-p64', page: 64}, {id: '27-2022-8-p65', page: 65}, {id: '27-2019-66-p66', page: 66}],
    lectureSources: [{label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 20}, {label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 21}, {label: 'Om 요약본', page: 176}],
    verifiedSources: ['https://cima.aemps.es/cima/dochtml/ft/77398/FT_77398.html']
  },
  {
    id: 'comp-L27-Q5', lecture: 27,
    concept: '항바이러스제의 핵산 복제·단백질 성숙·방출 단계 구별',
    format: 'judgment', polarity: 'incorrect',
    stem: '항바이러스제와 바이러스 생활사에서 차단하는 과정의 연결로 옳지 않은 것은?',
    options: [
      'Acyclovir — 활성 대사체가 바이러스 DNA polymerase에 작용하여 DNA 합성을 방해한다.',
      'Tenofovir — 활성형이 HBV DNA 합성에서 사슬 종결을 유도한다.',
      'Sofosbuvir — HCV의 NS5B RNA polymerase를 억제한다.',
      'Oseltamivir — influenza의 RNA polymerase를 억제한다.',
      'Glecaprevir — HCV의 NS3/4A protease를 억제하여 polyprotein의 성숙을 방해한다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳은 연결이다. Acyclovir는 활성화된 triphosphate 형태로 바이러스 DNA 합성을 억제하며 HSV·VZV와 연결된다.',
      '옳은 연결이다. Tenofovir의 diphosphate 활성형은 DNA 사슬 종결을 유도하며 HBV에 사용된다.',
      '옳은 연결이다. Sofosbuvir는 HCV의 NS5B polymerase 억제제다. NS5A 억제제와 구별한다.',
      '옳지 않은 연결이다. Oseltamivir는 neuraminidase를 억제하여 influenza 바이러스의 감염 세포로부터 방출을 방해한다.',
      '옳은 연결이다. Glecaprevir는 NS3/4A protease 억제제로 바이러스 polyprotein의 절단·성숙을 방해한다.'
    ],
    rationale: '바이러스 복제에 관여하는 효소를 모두 같은 표적으로 묶으면 안 된다. Oseltamivir는 핵산 복제보다 뒤 단계인 바이러스 방출을 억제한다.',
    notesPages: [36],
    examRefs: [{id: '27-2023-56-p65', page: 65}, {id: '27-2022-35-p65', page: 65}, {id: '27-2025-99-p64', page: 64}],
    lectureSources: [{label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 28}, {label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 30}, {label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 32}, {label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 33}, {label: '27강 항진균·항바이러스·항마이코박테리아 약물(2026 v2)', page: 37}, {label: 'Om 요약본', page: 178}],
    verifiedSources: []
  },
  {
    "id": "comp-L28-Q1",
    "lecture": 28,
    "concept": "조혈성 cytokine의 작용 계열과 sargramostim의 호중구·호산구 증가",
    "format": "case",
    "stem": "항암화학요법 뒤 호중구가 감소한 환자에게 호중구와 함께 호산구·단핵구 계열도 증가시키는 조혈성 제제를 사용하려 한다. 이에 해당하는 제제는?",
    "options": [
      "EPO",
      "Filgrastim",
      "M-CSF",
      "Sargramostim",
      "Interferon β"
    ],
    "answerIndex": 3,
    "explanations": [
      "EPO는 적혈구 생성을 촉진하여 빈혈에 사용하는 제제이다. 호중구·호산구 계열을 함께 증가시키는 이 문항의 제제와 다르다.",
      "Filgrastim은 G-CSF 제제로 강의에서 호중구 생성과 회복에 연결한다. 호산구 증가까지 함께 구별하는 단서는 sargramostim에 해당한다.",
      "M-CSF는 단핵구·대식세포 및 파골세포 계열과 연결된다. 과립구와 호산구 계열까지 함께 증가시키는 제제는 sargramostim이다.",
      "정답이다. Sargramostim은 GM-CSF 제제로 과립구·단핵구 계열을 촉진한다. 강의는 호중구뿐 아니라 호산구도 증가한다는 점을 filgrastim과 구별한다.",
      "Interferon β는 강의에서 다발성경화증 치료에 연결한다. 이 문항이 묻는 과립구·단핵구 계열의 조혈 촉진 제제가 아니다."
    ],
    "rationale": "Sargramostim은 GM-CSF 제제로 호중구뿐 아니라 호산구를 포함한 과립구·단핵구 계열을 촉진한다. Filgrastim의 G-CSF 작용 및 EPO의 적혈구 생성과 구별한다.",
    "notesPages": [
      36
    ],
    "examRefs": [
      {
        "id": "28-2023-58-p67",
        "page": 67
      },
      {
        "id": "28-2019-92-p68",
        "page": 68
      }
    ],
    "lectureSources": [
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 7
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 9
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 11
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 12
      }
    ],
    "emphasis": {
      "kind": "p7 GM-CSF 행의 빨간 상자, p9 sargramostim 행의 빨간 상자, p11 족보 스탬프와 호중구·호산구 증가의 노란 강조, p12 요약 표",
      "pages": [
        7,
        9,
        11,
        12
      ]
    },
    "materialRevision": "20261020-lectures1"
  },
  {
    "id": "comp-L28-Q2",
    "lecture": 28,
    "concept": "Immunophilin 결합과 calcineurin·mTOR 효과 표적의 구별",
    "format": "judgment",
    "polarity": "incorrect",
    "stem": "세포 내 신호를 억제하는 면역억제제의 결합 단백질·효과 표적과 특징에 관한 설명으로 옳지 않은 것은?",
    "options": [
      "Cyclosporine은 cyclophilin과 복합체를 형성하여 calcineurin을 억제한다.",
      "Tacrolimus는 FKBP12에 결합한 뒤 calcineurin–NFAT 경로를 억제한다.",
      "Sirolimus는 FKBP12에 결합하여 calcineurin을 억제하는 것이 주된 작용이다.",
      "Cyclosporine의 특징적인 유해반응에는 다모증과 치은비대증이 포함된다.",
      "Sirolimus의 mTOR 억제는 세포주기 진행 억제 및 상처 치유 지연과 연결된다."
    ],
    "answerIndex": 2,
    "explanations": [
      "옳은 설명이다. 결합 단백질은 cyclophilin, 복합체가 억제하는 효소는 calcineurin이다. 그 결과 NFAT 활성화와 IL-2 생산이 감소한다.",
      "옳은 설명이다. Tacrolimus는 FKBP12와 결합하지만 효과 표적은 cyclosporine과 같이 calcineurin이다.",
      "옳지 않은 설명이다. Sirolimus는 FKBP12 결합은 tacrolimus와 공유하지만 억제 표적은 mTOR다. Calcineurin 억제와 구별한다.",
      "옳은 설명이다. Cyclosporine의 다모증·치은비대증은 반복 출제된 구별점이며 신독성도 중요하다.",
      "옳은 설명이다. mTOR 억제는 IL-2에 대한 증식 반응을 줄이며 상처 치유 지연과 연결된다."
    ],
    "rationale": "결합 단백질과 최종 억제 표적은 서로 다른 단계다. Tacrolimus와 sirolimus는 FKBP12에 결합하지만 각각 calcineurin과 mTOR를 억제한다.",
    "notesPages": [
      37
    ],
    "examRefs": [
      {
        "id": "24-2022-73-p58",
        "page": 58
      },
      {
        "id": "28-2025-89-p66",
        "page": 66
      },
      {
        "id": "28-2023-59-p67",
        "page": 67
      },
      {
        "id": "28-2020-77-p68",
        "page": 68
      }
    ],
    "lectureSources": [
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 20
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 21
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 26
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 27
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 28
      }
    ],
    "emphasis": {
      "kind": "p20·21 calcineurin 및 약물 이름의 빨간 상자와 “오늘 강의에서 강조” 필기, p26 기전의 노란 강조와 족보 스탬프, p28 결합 단백질·부작용 비교 표",
      "pages": [
        20,
        21,
        26,
        28
      ]
    },
    "materialRevision": "20261020-lectures1"
  },
  {
    "id": "comp-L28-Q3",
    "lecture": 28,
    "concept": "항대사성 면역억제제의 활성 대사체와 핵산 합성·항염증 작용",
    "format": "judgment",
    "polarity": "incorrect",
    "stem": "항대사성 면역억제제의 대사 전환과 작용에 관한 설명으로 옳지 않은 것은?",
    "options": [
      "Azathioprine은 체내에서 6-MP로 전환되어 purine de novo 합성을 억제한다.",
      "Mycophenolate mofetil은 MPA로 전환되어 guanine nucleotide 합성을 억제한다.",
      "Methotrexate는 엽산 대사를 억제하여 DNA 합성과 림프구 증식을 감소시킨다.",
      "Mycophenolate mofetil은 guanine 유사체로 DNA 사슬에 직접 삽입되어 작용한다.",
      "Methotrexate의 항염증 효과에는 adenosine 증가와 염증성 cytokine 감소가 관련된다."
    ],
    "answerIndex": 3,
    "explanations": [
      "옳다. Azathioprine은 6-MP로 전환되는 전구약물이다. 강의는 이 전환과 purine de novo 합성 억제를 중심으로 설명한다.",
      "옳다. MMF의 활성 대사체는 mycophenolic acid(MPA)이다. MPA가 IMPDH를 억제하여 guanine nucleotide 공급과 핵산 합성을 감소시킨다.",
      "옳다. Methotrexate의 항엽산 작용은 DNA 합성과 증식 억제로 이어진다. 강의는 DHFR를 억제 표적으로 제시한다.",
      "옳지 않다. MMF–MPA는 IMPDH 효소를 억제하여 guanine nucleotide 합성을 줄인다. DNA 사슬에 guanine 유사체로 직접 삽입되는 것이 주된 작용은 아니다.",
      "옳다. 강의는 methotrexate의 항염증 효과를 adenosine 증가, 염증성 cytokine 감소 및 항염증성 cytokine 증가와 연결한다."
    ],
    "rationale": "Azathioprine–6-MP와 MMF–MPA의 대사 전환을 구별한다. MMF는 guanine nucleotide 합성 효소를 억제하며 DNA에 guanine 유사체로 직접 삽입되는 약물이 아니다.",
    "notesPages": [
      37
    ],
    "examRefs": [
      {
        "id": "28-2023-59-p67",
        "page": 67
      }
    ],
    "lectureSources": [
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 31
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 32
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 33
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 34
      }
    ],
    "emphasis": {
      "kind": "p31 약물·6-MP 전환의 빨간 상자와 족보 스탬프, p32 MMF→MPA→guanine 합성 억제 도식, p33 핵산·염증 작용도, p34 기전 요약 표",
      "pages": [
        31,
        32,
        33,
        34
      ]
    },
    "materialRevision": "20261020-lectures1"
  },
  {
    "id": "comp-L28-Q4",
    "lecture": 28,
    "concept": "Abatacept의 APC CD80/86 결합에 의한 공동자극 차단",
    "format": "case",
    "stem": "항원제시세포와 T세포를 함께 배양한 실험에서 TCR–MHC를 통한 항원 인식은 유지되지만, APC의 B7을 점유하여 T세포 CD28의 공동자극이 감소했다. 이 작용에 해당하는 약물은?",
    "options": [
      "Alefacept",
      "Abatacept",
      "Efalizumab",
      "Basiliximab",
      "Natalizumab"
    ],
    "answerIndex": 1,
    "explanations": [
      "Alefacept는 T세포의 CD2에 결합하여 CD2–CD58 상호작용을 방해한다. APC의 CD80·CD86을 점유하는 약물은 아니다.",
      "정답이다. Abatacept가 직접 결합하는 표적은 APC의 B7, 즉 CD80·CD86이다. CD28과의 결합을 막아 T세포 공동자극을 감소시킨다.",
      "Efalizumab은 LFA-1의 α 사슬인 CD11a를 표적으로 하여 ICAM-1과의 상호작용을 방해한다.",
      "Basiliximab은 CD25인 IL-2 수용체 α 사슬에 결합한다. B7–CD28 공동자극을 차단하는 약물과 구별한다.",
      "Natalizumab은 α4 integrin에 결합하여 VCAM-1과의 상호작용 및 림프구의 조직 침윤을 감소시킨다. B7을 직접 표적으로 하지 않는다."
    ],
    "rationale": "항원 인식 signal 1과 CD28–B7 공동자극 signal 2를 구별한다. Abatacept의 직접 결합 대상은 APC의 CD80·CD86이다.",
    "notesPages": [
      37
    ],
    "examRefs": [
      {
        "id": "28-2025-90-p66",
        "page": 66
      },
      {
        "id": "28-2021-77-p67",
        "page": 67
      },
      {
        "id": "28-2019-91-p68",
        "page": 68
      }
    ],
    "lectureSources": [
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 19
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 37
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 40
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 41
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 42
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 43
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 44
      }
    ],
    "emphasis": {
      "kind": "p40 abatacept 제목의 빨간 상자와 CD80/86 결합 도식·족보 스탬프, p41~43 비교 표적의 빨간 상자, p44 biologicals 표",
      "pages": [
        40,
        41,
        42,
        43,
        44
      ]
    },
    "materialRevision": "20261020-lectures1"
  },
  {
    "id": "comp-L28-Q5",
    "lecture": 28,
    "concept": "Biologicals의 항체 유형과 CD·cytokine 표적 구별",
    "format": "judgment",
    "polarity": "incorrect",
    "stem": "면역조절 biologicals의 종류 또는 직접 결합 표적을 연결한 것으로 옳지 않은 것은?",
    "options": [
      "ATG — 여러 T세포 표면 항원을 인식하는 다클론 항체",
      "Muromonab-CD3 — CD3를 표적으로 하는 단클론 항체",
      "Basiliximab — CD25를 표적으로 하는 단클론 항체",
      "Infliximab — TNF-α를 표적으로 하는 단클론 항체",
      "Alemtuzumab — CD20을 표적으로 하는 단클론 항체"
    ],
    "answerIndex": 4,
    "explanations": [
      "옳은 연결이다. ATG는 T세포의 여러 항원을 인식하는 다클론 항체 제제이며 단일 표적의 단클론 항체와 구별한다.",
      "옳은 연결이다. Muromonab-CD3는 OKT3로도 부르는 anti-CD3 단클론 항체다.",
      "옳은 연결이다. Basiliximab의 표적은 CD25인 IL-2Rα이며 IL-2 분자 자체나 CD2가 아니다.",
      "옳은 연결이다. Infliximab은 TNF-α 표적 항체다. TNF 수용체–Fc 융합단백질인 etanercept와 구조를 구별한다.",
      "옳지 않은 연결이다. Alemtuzumab의 표적은 CD52다. CD20 표적 항체는 rituximab이다."
    ],
    "rationale": "ATG는 다클론 항체이며 muromonab-CD3는 CD3, basiliximab은 CD25, infliximab은 TNF-α를 표적으로 한다. Alemtuzumab은 CD52 표적 항체이며 CD20 표적의 rituximab과 구별한다.",
    "notesPages": [
      37
    ],
    "examRefs": [
      {
        "id": "28-2022-57-p67",
        "page": 67
      },
      {
        "id": "28-2023-59-p67",
        "page": 67
      },
      {
        "id": "28-2021-76-p67",
        "page": 67
      }
    ],
    "lectureSources": [
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 12
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 35
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 36
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 37
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 38
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 44
      },
      {
        "kind": "lecture",
        "lecture": 28,
        "label": "28강 · 면역 억제 약리학",
        "page": 46
      }
    ],
    "emphasis": {
      "kind": "p35 ATG·polyclonal antibody 빨간 상자와 족보 스탬프, p36·37·38 항체–CD 표적 제목의 빨간 상자, p44 biologicals 및 p46 TNF-α·CD20 표적 표",
      "pages": [
        35,
        36,
        37,
        38,
        44,
        46
      ]
    },
    "materialRevision": "20261020-lectures1"
  }
];
