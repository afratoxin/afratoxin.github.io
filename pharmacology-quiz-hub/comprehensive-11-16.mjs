export default [
  {
    id: 'comp-L11-Q1', lecture: 11,
    concept: '안과용 항무스카린제의 산동·조절마비와 전방각 위험',
    format: 'judgment', polarity: 'incorrect',
    stem: '안과 검사에 사용하는 tropicamide의 작용에 관한 설명으로 옳지 않은 것은?',
    options: [
      '무스카린 수용체를 차단하여 동공 확대를 일으킨다.',
      '섬모체근의 이완으로 근거리 초점 조절이 어려워질 수 있다.',
      'Atropine보다 작용이 짧아 일시적인 검사에 이용하기 좋다.',
      '동공 확대에 따라 눈부심과 대광반사 감소가 나타날 수 있다.',
      '전방각이 좁은 눈에서 동공을 축소시켜 폐쇄각 발작 위험을 낮춘다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳다. 동공조임근의 무스카린 수용체를 차단하면 부교감신경에 의한 축동이 억제되어 산동한다.',
      '옳다. 섬모체근의 무스카린성 수축을 억제하므로 조절마비가 생겨 가까운 물체에 초점을 맞추기 어려워질 수 있다.',
      '옳다. Tropicamide는 atropine보다 작용이 짧아 검사 후 장기간의 산동·조절마비 부담이 적다.',
      '옳다. 산동과 빛에 대한 동공 수축의 억제 때문에 눈부심 및 대광반사 감소가 나타날 수 있다.',
      '옳지 않다. Tropicamide는 축동제가 아니라 산동제이다. 전방각이 좁은 눈에서는 산동이 급성 폐쇄각 발작을 유발할 수 있다.'
    ],
    rationale: '항무스카린제는 동공조임근과 섬모체근의 수축을 억제한다. 따라서 산동·조절마비를 일으키며, 좁은 전방각에서의 폐쇄각 위험을 낮추는 약물로 해석하면 안 된다.',
    notesPages: [13, 14],
    examRefs: [{id: '12-13-2025-23-p27', page: 27}, {id: '12-13-2019-61-p30', page: 30}],
    lectureSources: [{label: '콜린성 약리학(2)', page: 14}], verifiedSources: []
  },
  {
    id: 'comp-L11-Q2', lecture: 11,
    concept: '항무스카린제의 아민 구조와 중추 이행',
    format: 'association',
    stem: '항무스카린제의 화학적 특성과 대표 작용을 바르게 연결한 것은?',
    options: [
      'Ipratropium — 3차 아민 — 중추성 멀미 억제',
      'Atropine — 4차 암모늄 — 혈액뇌장벽 통과 제한',
      'Scopolamine — 3차 아민 — 중추성 멀미 억제',
      'Tiotropium — 4차 암모늄 — 중추성 구토반사 억제',
      'Trospium — 3차 아민 — 중추 이행이 큰 방광 작용제'
    ],
    answerIndex: 2,
    explanations: [
      '틀린 연결이다. Ipratropium은 4차 암모늄 항무스카린제로 중추 이행이 제한되며, 흡입하여 기관지 수축을 억제한다.',
      '틀린 연결이다. Atropine은 3차 아민이므로 혈액뇌장벽을 통과할 수 있다. 4차 암모늄 약물과 구별해야 한다.',
      '바른 연결이다. Scopolamine은 3차 아민으로 중추에 이행하여 전정계와 관련된 콜린성 전달을 억제하므로 멀미에 사용된다.',
      '틀린 연결이다. Tiotropium의 4차 암모늄 구조는 맞지만, 대표 작용은 흡입 후 말초 기도에서의 항무스카린 작용이다.',
      '틀린 연결이다. Trospium은 4차 암모늄 항무스카린제이다. 과민성 방광에 사용되지만 중추 이행이 큰 3차 아민으로 분류하지 않는다.'
    ],
    rationale: '3차 아민인 scopolamine의 중추 작용과, 4차 암모늄인 ipratropium·tiotropium·trospium의 제한된 중추 이행을 구분한다.',
    notesPages: [13, 14],
    examRefs: [{id: '12-13-2022-11-p28', page: 28}, {id: '12-13-2023-12-p28', page: 28}],
    lectureSources: [{label: '콜린성 약리학(2)', page: 11}, {label: '콜린성 약리학(2)', page: 13}, {label: '콜린성 약리학(2)', page: 16}], verifiedSources: []
  },
  {
    id: 'comp-L11-Q3', lecture: 11,
    concept: '과민성 방광·기도·중추 증상에 사용하는 항무스카린제',
    format: 'association',
    stem: '항무스카린제와 작용 기전·임상 응용을 바르게 연결한 것은?',
    options: [
      'Oxybutynin — 방광 무스카린 수용체 차단 — 배뇨근 이완',
      'Tiotropium — 기도 무스카린 수용체 차단 — 기관지 분비 증가',
      'Tropicamide — 안구 무스카린 수용체 차단 — 조절마비 없는 산동',
      'Scopolamine — 중추 무스카린 수용체 차단 — 혈액뇌장벽 통과 제한',
      'Benztropine — 중추 무스카린 수용체 차단 — 도파민 합성 촉진'
    ],
    answerIndex: 0,
    explanations: [
      '바른 연결이다. Oxybutynin은 방광의 무스카린 수용체를 차단하여 불수의적 배뇨근 수축과 요절박을 줄인다.',
      '틀린 연결이다. Tiotropium의 기도 무스카린 수용체 차단은 맞지만, 항무스카린 작용은 기관지 분비를 늘리는 방향이 아니다. 기관지 수축과 콜린성 분비를 억제한다.',
      '틀린 연결이다. Tropicamide는 동공조임근과 섬모체근의 무스카린 반응을 함께 억제하므로 산동과 조절마비를 일으킨다. 조절마비 없는 산동은 주로 α1 효현제의 작용과 구별한다.',
      '틀린 연결이다. Scopolamine은 3차 아민으로 혈액뇌장벽을 통과하며, 중추 이행이 멀미 억제 작용과 연결된다. 중추 이행이 제한적인 4차 암모늄 약물과 구별한다.',
      '틀린 연결이다. Benztropine의 중추 항무스카린 작용은 맞지만, 도파민 합성 촉진제는 아니다. 상대적으로 우세한 콜린성 전달을 낮추어 도파민·아세틸콜린의 기능적 불균형을 완화한다.'
    ],
    rationale: 'Oxybutynin은 방광의 무스카린 수용체 차단으로 배뇨근을 이완시킨다. 다른 선택지들은 항무스카린 표적 자체는 맞지만 분비 방향, 조절마비, 중추 이행 또는 도파민 합성 효과를 잘못 연결했다.',
    notesPages: [14],
    examRefs: [{id: '12-13-2025-18-p27', page: 27}, {id: '14-15-2021-28-p33', page: 33}, {id: '14-15-2022-10-p32', page: 32}],
    lectureSources: [{label: '콜린성 약리학(2)', page: 11}, {label: '콜린성 약리학(2)', page: 13}, {label: '콜린성 약리학(2)', page: 14}, {label: '콜린성 약리학(2)', page: 16}, {label: '콜린성 약리학(2)', page: 17}], verifiedSources: []
  },
  {
    id: 'comp-L11-Q4', lecture: 11,
    concept: '유기인 중독에서 atropine과 pralidoxime의 역할',
    format: 'judgment', polarity: 'correct',
    stem: '유기인계 살충제에 의한 아세틸콜린에스터라제 억제와 그 길항 원리에 관한 설명으로 옳은 것은?',
    options: [
      'Atropine은 운동종판의 Nm 수용체를 차단하여 근력 저하를 직접 되돌린다.',
      'Pralidoxime은 무스카린 수용체에 경쟁적으로 결합하여 분비를 억제한다.',
      '효소와 유기인의 결합이 숙성되면 pralidoxime에 의한 효소 재생이 쉬워진다.',
      'Atropine은 무스카린 수용체를 차단하여 기관지 분비 증가와 서맥을 완화한다.',
      'Neostigmine은 인산화된 효소를 재생시켜 과도한 아세틸콜린을 감소시킨다.'
    ],
    answerIndex: 3,
    explanations: [
      '틀리다. Atropine은 무스카린 수용체 길항제이며 골격근 Nm 수용체에 대한 과도한 자극을 직접 차단하지 않는다.',
      '틀리다. Pralidoxime은 숙성 전 인산화된 아세틸콜린에스터라제의 재활성화를 돕는 약물이다. 무스카린 수용체 차단은 atropine의 역할이다.',
      '틀리다. 숙성은 유기인과 효소의 결합을 더 안정하게 하여 oxime에 의한 재활성화를 어렵게 한다.',
      '옳다. 분비 증가와 미주신경성 서맥은 무스카린성 증상이므로 atropine의 수용체 차단으로 완화할 수 있다.',
      '틀리다. Neostigmine은 아세틸콜린에스터라제 억제제이므로 아세틸콜린을 증가시킨다. 효소 재생제인 pralidoxime과 반대된다.'
    ],
    rationale: 'Atropine은 수용체 단계에서 무스카린성 증상을 억제하고, pralidoxime은 숙성 전 효소를 재활성화한다. 두 약물은 작용 위치가 다르다.',
    notesPages: [13],
    examRefs: [{id: '12-13-2021-24-p28', page: 28}, {id: '12-13-2020-26-p29', page: 29}],
    lectureSources: [{label: '콜린성 약리학(2)', page: 18}], verifiedSources: []
  },
  {
    id: 'comp-L11-Q5', lecture: 11,
    concept: '탈분극성·비탈분극성 신경근 봉쇄의 차이',
    format: 'judgment', polarity: 'incorrect',
    stem: '신경근 봉쇄 약물에 관한 설명으로 옳지 않은 것은? Succinylcholine에 대해서는 초기의 phase I 봉쇄를 기준으로 판단한다.',
    options: [
      'Rocuronium은 운동종판 니코틴 수용체에서 아세틸콜린과 경쟁하는 길항제이다.',
      'Succinylcholine은 운동종판의 탈분극을 지속시켜 신경근 전달을 차단한다.',
      'Succinylcholine은 근육으로부터 칼륨 유출을 일으켜 고칼륨혈증을 유발할 수 있다.',
      'Succinylcholine의 phase I 봉쇄는 아세틸콜린에스터라제 억제로 쉽게 역전된다.',
      '두 종류의 신경근 봉쇄제 모두 호흡근을 마비시킬 수 있다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳다. Rocuronium은 비탈분극성 Nm 수용체 경쟁적 길항제로 아세틸콜린에 의한 운동종판 탈분극을 방해한다.',
      '옳다. Succinylcholine은 Nm 수용체를 활성화한 뒤 운동종판의 탈분극을 지속시켜 정상적인 반복 흥분을 막는다.',
      '옳다. 니코틴성 양이온 통로 활성화에 따른 칼륨 유출 때문에 혈중 칼륨이 증가할 수 있다.',
      '옳지 않다. Phase I 봉쇄에서 아세틸콜린에스터라제 억제는 봉쇄를 역전시키는 방법이 아니며 오히려 연장·강화할 수 있다. 비탈분극성 봉쇄와 구별한다.',
      '옳다. 두 종류 모두 횡격막과 늑간근의 신경근 전달을 억제하여 호흡근 마비를 일으킬 수 있다.'
    ],
    rationale: '비탈분극성 봉쇄는 경쟁적 길항이고, succinylcholine의 phase I 봉쇄는 지속적 탈분극이다. 아세틸콜린 증가에 대한 반응도 같지 않다.',
    notesPages: [14],
    examRefs: [{id: '12-13-2021-26-p29', page: 29}, {id: '12-13-2019-57-p30', page: 30}],
    lectureSources: [{label: '콜린성 약리학(2)', page: 21}, {label: '콜린성 약리학(2)', page: 22}], verifiedSources: []
  },
  {
    id: 'comp-L12-Q1', lecture: 12,
    concept: '선택적 아드레날린 효현제와 α2 음성되먹임',
    format: 'association',
    stem: '아드레날린 효현제와 대표 수용체·작용을 바르게 연결한 것은?',
    options: [
      'Phenylephrine — α2 활성화 — 신경말단 norepinephrine 유리 억제',
      'Clonidine — α2 활성화 — 교감신경 활성 유출 억제',
      'Dobutamine — α1 활성화 — 전립선 평활근 수축 억제',
      'Mirabegron — β2 활성화 — 방광 배뇨근 수축 억제',
      'Albuterol — β1 활성화 — 기관지 평활근 수축 억제'
    ],
    answerIndex: 1,
    explanations: [
      '틀린 연결이다. Phenylephrine의 대표 작용은 α1 활성화에 의한 혈관 수축과 산동이다. α2를 통한 norepinephrine 유리 억제와 구별한다.',
      '바른 연결이다. Clonidine은 중추 α2 수용체를 활성화하여 교감신경 활성 유출을 줄인다. 시냅스전 α2 자가수용체 활성화도 norepinephrine 유리를 억제한다.',
      '틀린 연결이다. Dobutamine은 주로 β1 수용체를 활성화하여 심근 수축력을 증가시킨다. α1 활성화는 전립선 평활근을 수축시키는 방향이다.',
      '틀린 연결이다. Mirabegron은 β3 수용체 효현제로 배뇨근을 이완시킨다. 방광 작용의 수용체를 β2와 바꾸면 안 된다.',
      '틀린 연결이다. Albuterol의 기관지확장 작용은 β2 수용체 활성화에 의한다. β1은 심장 작용과 연결한다.'
    ],
    rationale: 'Clonidine은 효현제이지만 α2 수용체의 억제성 되먹임을 이용하므로 교감신경 출력을 낮춘다. 효현제라는 이유만으로 교감신경의 모든 작용을 증가시킨다고 보면 안 된다.',
    notesPages: [14, 15],
    examRefs: [{id: '14-15-2020-32-p33', page: 33}, {id: '14-15-2019-48-p34', page: 34}],
    lectureSources: [{label: '아드레날린성 약리학(1)', page: 10}, {label: '아드레날린성 약리학(1)', page: 22}, {label: '아드레날린성 약리학(1)', page: 23}], verifiedSources: []
  },
  {
    id: 'comp-L12-Q2', lecture: 12,
    concept: 'Epinephrine 반전의 β2 혈관 이완 기전',
    format: 'case',
    stem: '혈압 반응 실험에서 epinephrine은 처음에는 혈압을 올렸으나, α 수용체를 충분히 차단한 뒤에는 혈압을 낮췄다. 이 반전을 설명하는 주된 수용체–신호–혈관 반응은?',
    options: [
      'α1 — Gq·PLC 활성화 — 혈관 평활근 이완',
      'β1 — Gs·cAMP 증가 — 혈관 평활근 수축',
      'α2 — Gi·cAMP 감소 — 혈관 평활근 이완',
      'β2 — Gi·cAMP 감소 — 혈관 평활근 이완',
      'β2 — Gs·cAMP 증가 — 혈관 평활근 이완'
    ],
    answerIndex: 4,
    explanations: [
      '해당하지 않는다. α1–Gq–PLC 활성화는 혈관 평활근 수축과 연결된다. 실험에서는 α 수용체 반응이 차단되어 있다.',
      '해당하지 않는다. β1–Gs 신호는 주로 심박수와 심근 수축력을 증가시키며, 혈관 평활근 수축을 통해 반전을 설명하지 않는다.',
      '해당하지 않는다. α2의 Gi 결합은 맞지만, 혈관의 시냅스후 α2 활성화는 수축을 일으킬 수 있다. 또한 실험에서는 α 수용체 반응이 차단되어 있다.',
      '해당하지 않는다. β2는 Gi가 아니라 Gs와 결합하여 cAMP를 증가시킨다.',
      '맞다. α에 의한 혈관 수축이 차단되면 epinephrine의 β2–Gs–cAMP 신호에 의한 혈관 이완이 드러나 혈압이 떨어질 수 있다.'
    ],
    rationale: 'Epinephrine에는 α에 의한 혈관 수축과 β2에 의한 이완 작용이 함께 있다. α 봉쇄 후 드러나는 β2 작용이 반전의 핵심이며, β2 작용이 미미한 norepinephrine과 구별된다.',
    notesPages: [15],
    examRefs: [{id: '14-15-2022-23-p32', page: 32}, {id: '14-15-2025-22-p31', page: 31}],
    lectureSources: [{label: '아드레날린성 약리학(1)', page: 11}, {label: '아드레날린성 약리학(1)', page: 16}], verifiedSources: []
  },
  {
    id: 'comp-L12-Q3', lecture: 12,
    concept: 'β 효현제의 장기 선택성과 칼륨 이동',
    format: 'judgment', polarity: 'incorrect',
    stem: 'β 아드레날린 효현제의 작용에 관한 설명으로 옳지 않은 것은?',
    options: [
      'Albuterol은 β2 수용체를 활성화하여 기관지 평활근을 이완시킨다.',
      'Salmeterol은 albuterol보다 작용이 긴 β2 수용체 효현제이다.',
      'Dobutamine은 주로 β1 수용체를 통해 심근 수축력을 증가시킨다.',
      'Mirabegron은 β3 수용체를 활성화하여 방광 배뇨근을 이완시킨다.',
      'β2 수용체 활성화는 골격근에서 칼륨 유출을 촉진하여 혈중 칼륨을 높인다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳다. Albuterol의 β2 활성화는 기도 평활근 이완과 기관지확장을 일으킨다.',
      '옳다. 강의에서 albuterol은 단시간, salmeterol은 장시간 작용하는 β2 효현제로 구분한다.',
      '옳다. Dobutamine은 β1 작용이 우세한 효현제로 심근 수축력 증가와 연결된다.',
      '옳다. Mirabegron은 β3 효현제로 과민성 방광에서 저장기에 배뇨근을 이완시킨다.',
      '옳지 않다. β2 활성화는 골격근으로의 칼륨 흡수를 촉진하여 혈중 칼륨을 낮출 수 있다. 칼륨 유출과 고칼륨혈증으로 연결하면 반대이다.'
    ],
    rationale: 'β1은 심장, β2는 기관지·자궁·혈관 평활근과 골격근 칼륨 흡수, β3는 방광 배뇨근 이완으로 연결한다.',
    notesPages: [14, 15],
    examRefs: [{id: '14-15-2019-51-p34', page: 34}, {id: '14-15-2019-52-p34', page: 34}, {id: '14-15-2022-10-p32', page: 32}],
    lectureSources: [{label: '아드레날린성 약리학(1)', page: 10}, {label: '아드레날린성 약리학(1)', page: 23}], verifiedSources: []
  },
  {
    id: 'comp-L12-Q4', lecture: 12,
    concept: '간접 교감신경모방제의 유리·재흡수·대사 표적',
    format: 'judgment', polarity: 'correct',
    stem: '간접 작용 교감신경모방제와 카테콜아민 대사 조절 약물의 기전에 관한 설명으로 옳은 것은?',
    options: [
      'Amphetamine은 MAO를 억제하여 카테콜아민의 산화적 분해를 줄인다.',
      'Ephedrine은 norepinephrine의 재흡수를 촉진하여 교감신경 반응을 높인다.',
      'Selegiline은 COMT를 억제하여 카테콜아민의 메틸화를 줄인다.',
      'Cocaine은 NET를 억제하여 유리된 norepinephrine의 재흡수를 줄인다.',
      'Entacapone은 VMAT를 억제하여 모노아민의 소포 내 저장을 줄인다.'
    ],
    answerIndex: 3,
    explanations: [
      '틀리다. Amphetamine의 대표 기전은 모노아민 유리 증가이다. MAO 억제제인 selegiline과 구별한다.',
      '틀리다. Ephedrine은 norepinephrine 유리 촉진과 직접 수용체 작용을 가진 혼합 작용제이다. 재흡수 촉진으로 시냅스 반응을 높이는 약물이 아니다.',
      '틀리다. Selegiline은 MAO-B 억제제이다. COMT 억제제는 entacapone·tolcapone이다.',
      '옳다. Cocaine은 norepinephrine 수송체를 억제하여 재흡수를 줄이고 시냅스에 남는 norepinephrine을 증가시킨다.',
      '틀리다. Entacapone은 COMT 억제제이다. 소포 모노아민 수송체인 VMAT 억제는 reserpine과 같은 약물의 기전이다.'
    ],
    rationale: '유리 촉진, 재흡수 억제, MAO 억제, COMT 억제, 소포 저장 억제는 서로 다른 단계이다. Cocaine은 그중 재흡수 수송체를 억제한다.',
    notesPages: [14, 15],
    examRefs: [{id: '14-15-2022-50-p32', page: 32}, {id: '14-15-2022-61-p32', page: 32}],
    lectureSources: [{label: '아드레날린성 약리학(1)', page: 7}, {label: '아드레날린성 약리학(1)', page: 25}], verifiedSources: []
  },
  {
    id: 'comp-L12-Q5', lecture: 12,
    concept: '교감신경모방제의 구조 치환과 선택성·대사',
    format: 'judgment', polarity: 'incorrect',
    stem: '교감신경모방제의 기본 구조와 치환기 효과에 관한 설명으로 옳지 않은 것은?',
    options: [
      '카테콜 구조는 벤젠환의 서로 인접한 위치에 두 hydroxyl기가 있는 구조이다.',
      '벤젠환의 3번 hydroxyl기를 제거하면 효력은 줄 수 있지만 작용시간은 길어질 수 있다.',
      '아미노기의 알킬기가 커지면 isoproterenol처럼 β 수용체 작용이 우세해질 수 있다.',
      'α 탄소의 methyl기는 MAO 산화를 촉진하여 amphetamine의 분해를 빠르게 한다.',
      'β 탄소의 hydroxyl기는 직접 작용 약물의 아드레날린 수용체 활성화에 기여한다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳다. 카테콜아민의 카테콜 부분은 벤젠환에 인접한 두 hydroxyl기가 있는 부분이며, 강의에서는 3·4번 위치로 표시한다.',
      '옳다. 강의의 구조–작용 관계에서 벤젠환 hydroxyl기 변화는 직접 작용의 효력과 생체이용률·지속시간을 함께 바꿀 수 있다.',
      '옳다. 질소에 붙은 알킬기의 크기 증가는 β 수용체 작용 증가 및 α 작용 감소와 연결하며, isoproterenol이 대표 예이다.',
      '옳지 않다. α 탄소의 methyl 치환은 MAO에 의한 산화에 저항성을 높여 대사를 줄이는 방향이다. 산화를 촉진한다는 설명은 반대이다.',
      '옳다. β-hydroxyl기는 직접 아드레날린 수용체 작용을 높이는 구조 요소로 제시된다.'
    ],
    rationale: '구조 치환은 수용체 선택성뿐 아니라 효소 대사도 바꾼다. α-methyl 치환은 MAO에 의한 분해를 촉진하는 것이 아니라 저항성을 높인다.',
    notesPages: [15],
    examRefs: [{id: '14-15-2025-22-p31', page: 31}, {id: '14-15-2022-8-p32', page: 32}],
    lectureSources: [{label: '아드레날린성 약리학(1)', page: 20}], verifiedSources: []
  },
  {
    id: 'comp-L13-Q1', lecture: 13,
    concept: 'α 봉쇄제의 가역성과 자가수용체 효과',
    format: 'judgment', polarity: 'incorrect',
    stem: 'α 아드레날린 수용체 길항제에 관한 설명으로 옳지 않은 것은?',
    options: [
      'Phenoxybenzamine은 α 수용체와 공유결합하여 비가역적 봉쇄를 일으킨다.',
      'Phentolamine은 α1과 α2 수용체를 가역적으로 봉쇄한다.',
      '혈관 α1 수용체 봉쇄는 말초혈관 저항을 감소시킨다.',
      '신경말단 α2 자가수용체 봉쇄는 norepinephrine 유리를 감소시킨다.',
      'α 봉쇄에 따른 혈관 확장은 기립성 저혈압의 원인이 될 수 있다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳다. Phenoxybenzamine은 수용체와 공유결합하는 비가역적 α 봉쇄제로, 가역적 phentolamine과 구별한다.',
      '옳다. Phentolamine은 가역적 비선택적 α 길항제로 α1과 α2를 봉쇄한다.',
      '옳다. α1에 의한 혈관 평활근 수축을 억제하므로 말초혈관 저항이 낮아진다.',
      '옳지 않다. α2 자가수용체는 norepinephrine 유리를 억제하는 되먹임 장치이다. 이를 봉쇄하면 억제가 풀려 norepinephrine 유리가 증가한다.',
      '옳다. 일어설 때 필요한 혈관 수축이 억제되어 기립성 저혈압이 생길 수 있다.'
    ],
    rationale: 'α1 봉쇄는 혈관 이완을, 시냅스전 α2 봉쇄는 norepinephrine 유리 증가를 일으킨다. 두 수용체의 봉쇄 효과를 같은 방향으로 해석하지 않는다.',
    notesPages: [16],
    examRefs: [{id: '14-15-2025-27-p31', page: 31}, {id: '14-15-2022-70-p32', page: 32}],
    lectureSources: [{label: '아드레날린성 약리학(2)', page: 13}], verifiedSources: []
  },
  {
    id: 'comp-L13-Q2', lecture: 13,
    concept: '선택적 α1 봉쇄의 전립선 작용과 보존되는 α2 되먹임',
    format: 'case',
    stem: '전립선 비대에 따른 배뇨장애를 완화하기 위해 prazosin의 작용을 검토하였다. 이 약물이 비선택적 α 봉쇄제보다 반사성 빈맥을 덜 일으키는 경향을 설명하는 것은?',
    options: [
      'α1 수용체를 보존하여 전립선과 혈관의 수축을 유지하기 때문이다.',
      '심장의 β1 수용체를 직접 봉쇄하여 심박수 증가를 막기 때문이다.',
      'α2 자가수용체를 보존하여 전달물질 유리 억제를 유지하기 때문이다.',
      '혈관 β2 수용체를 봉쇄하여 말초혈관 저항을 높이기 때문이다.',
      'α2 자가수용체를 함께 봉쇄하여 norepinephrine 유리를 줄이기 때문이다.'
    ],
    answerIndex: 2,
    explanations: [
      '틀리다. Prazosin은 α1 길항제이므로 전립선과 혈관 평활근의 α1 매개 수축을 억제한다.',
      '틀리다. Prazosin은 β1 봉쇄제가 아니다. 빈맥 차이는 α2 자가수용체의 보존 여부와 연결한다.',
      '맞다. 선택적 α1 봉쇄는 시냅스전 α2에 의한 norepinephrine 유리 억제를 보존하므로, α1·α2 동시 봉쇄보다 빈맥이 덜 나타나는 경향이 있다.',
      '틀리다. Prazosin의 작용은 β2 봉쇄가 아니며, α1 봉쇄로 말초혈관 저항을 낮춘다.',
      '틀리다. α2를 함께 봉쇄하면 norepinephrine 유리 억제가 풀려 유리가 증가한다. 또한 prazosin은 α1 선택적 길항제이다.'
    ],
    rationale: '전립선 평활근의 α1을 차단하면서 시냅스전 α2 되먹임을 보존하는 것이 선택적 α1 봉쇄의 중요한 차이이다. 혈관 확장에 따른 빈맥 가능성 자체가 없어지는 것은 아니다.',
    notesPages: [16],
    examRefs: [{id: '14-15-2025-21-p30', page: 30}, {id: '14-15-2020-33-p33', page: 33}, {id: '14-15-2019-53-p34', page: 34}],
    lectureSources: [{label: '아드레날린성 약리학(2)', page: 13}, {label: '아드레날린성 약리학(2)', page: 17}, {label: '아드레날린성 약리학(2)', page: 18}], verifiedSources: []
  },
  {
    id: 'comp-L13-Q3', lecture: 13,
    concept: 'β 봉쇄제의 선택성과 심장·기도·방수 생성 작용',
    format: 'judgment', polarity: 'incorrect',
    stem: 'β 아드레날린 수용체 길항제의 분류와 장기 작용에 관한 설명으로 옳지 않은 것은?',
    options: [
      'Propranolol은 β1과 β2 수용체를 봉쇄하는 비선택적 약물이다.',
      'Metoprolol은 통상적인 용량 범위에서 β1 선택성이 있는 약물이다.',
      '사구체옆세포의 β1 수용체 봉쇄는 renin 유리를 감소시킨다.',
      'Timolol의 안압 감소에는 섬모체에서의 방수 생성 억제가 기여한다.',
      '비선택적 β 봉쇄제의 β2 차단은 기관지 평활근을 이완시킨다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳다. Propranolol은 β1·β2 비선택적 봉쇄제로 심장 작용과 β2 관련 부작용을 함께 고려한다.',
      '옳다. Metoprolol은 β1 선택적 약물이다. 수용체 선택성은 절대적인 성질은 아니므로 용량과 조건에 따라 달라질 수 있다.',
      '옳다. 신장의 β1 자극은 renin 유리를 촉진하므로 이를 봉쇄하면 renin 유리가 감소한다.',
      '옳다. Timolol은 방수의 생성을 감소시켜 안압을 낮춘다. 콜린 유사제의 방수 배출 증가와 구별한다.',
      '옳지 않다. 기관지 이완은 β2 활성화의 효과이다. β2 봉쇄는 기관지 수축을 유발할 수 있어 천식·COPD에서 문제가 된다.'
    ],
    rationale: 'β1 봉쇄는 심장과 renin 유리를 억제하고, β2 봉쇄는 기관지 이완 작용을 없애 수축 위험을 높인다. Timolol은 방수 생성 억제로 연결한다.',
    notesPages: [16],
    examRefs: [{id: '12-13-2023-13-p28', page: 28}, {id: '14-15-2020-36-p34', page: 34}, {id: '14-15-2021-32-p33', page: 33}],
    lectureSources: [{label: '아드레날린성 약리학(2)', page: 19}, {label: '아드레날린성 약리학(2)', page: 20}, {label: '아드레날린성 약리학(2)', page: 21}], verifiedSources: []
  },
  {
    id: 'comp-L13-Q4', lecture: 13,
    concept: '혈관 확장 작용을 함께 가진 β 봉쇄제',
    format: 'association',
    stem: 'β 봉쇄제와 추가적인 혈관 확장 기전을 바르게 연결한 것은?',
    options: [
      'Carvedilol — β1·β2 봉쇄와 α1 봉쇄',
      'Labetalol — β1 선택적 봉쇄와 COMT 억제',
      'Nebivolol — β1 선택적 봉쇄와 NO 생성 억제',
      'Metoprolol — β1·β2 봉쇄와 α1 봉쇄',
      'Propranolol — β1 선택적 봉쇄와 NO 생성 증가'
    ],
    answerIndex: 0,
    explanations: [
      '바른 연결이다. Carvedilol은 비선택적 β 봉쇄에 α1 봉쇄가 더해져 혈관 확장 효과를 가진다. 강의에서는 항산화 작용도 제시한다.',
      '틀린 연결이다. Labetalol은 비선택적 β 봉쇄와 α1 봉쇄를 함께 한다. COMT 억제제는 entacapone·tolcapone이다.',
      '틀린 연결이다. Nebivolol의 추가 혈관 확장 기전은 NO 생성 증가와 연결한다. NO 생성 억제라고 하면 작용 방향이 반대이다.',
      '틀린 연결이다. Metoprolol은 β1 선택적 봉쇄제로 분류하며, α1 봉쇄를 함께 하는 대표 약물은 carvedilol·labetalol이다.',
      '틀린 연결이다. Propranolol은 β1·β2 비선택적 봉쇄제이다. β1 선택성과 NO 생성 증가는 nebivolol과 연결한다.'
    ],
    rationale: '혈관 확장성 β 봉쇄제는 β 봉쇄 외의 기전을 함께 가진다. Carvedilol·labetalol은 α1 봉쇄, nebivolol은 NO 생성 증가가 핵심 구분점이다.',
    notesPages: [16],
    examRefs: [{id: '14-15-2020-34-p34', page: 34}, {id: '14-15-2019-49-p34', page: 34}],
    lectureSources: [{label: '아드레날린성 약리학(2)', page: 20}], verifiedSources: []
  },
  {
    id: 'comp-L13-Q5', lecture: 13,
    concept: '비선택적 β 봉쇄와 저혈당 회복·경고 증상',
    format: 'judgment', polarity: 'incorrect',
    stem: '인슐린을 사용하는 사람에서 비선택적 β 봉쇄가 저혈당 반응에 미치는 영향으로 옳지 않은 것은?',
    options: [
      '심장 β1 봉쇄는 저혈당 때의 빈맥을 덜 뚜렷하게 만들 수 있다.',
      'β2 봉쇄는 간의 글리코겐 분해를 촉진하여 혈당 회복을 빠르게 한다.',
      'β2 봉쇄는 떨림과 같은 교감신경성 경고 증상을 줄일 수 있다.',
      '땀 분비는 주로 무스카린성 전달을 따르므로 β 봉쇄 후에도 남을 수 있다.',
      'β1 선택적 약물은 비선택적 약물보다 β2 관련 대사 작용을 덜 차단하는 경향이 있다.'
    ],
    answerIndex: 1,
    explanations: [
      '옳다. 저혈당 때의 β1 매개 심박수 증가가 억제되어 빈맥·심계항진이 경고 신호로 덜 뚜렷할 수 있다.',
      '옳지 않다. β2 자극은 간의 글리코겐 분해와 혈당 상승에 기여한다. β2 봉쇄는 이 반응을 방해하여 저혈당 회복을 늦출 수 있다.',
      '옳다. 골격근 β2 반응이 차단되면 저혈당 때 나타나는 떨림이 감소할 수 있다.',
      '옳다. 땀샘의 교감신경 말단은 아세틸콜린–무스카린 수용체를 이용하므로 발한이 β 봉쇄와 함께 소실된다고 단정하지 않는다.',
      '옳다. β1 선택성은 β2에 의한 기관지·대사 반응의 차단을 줄이는 방향의 특성이다. 선택성은 절대적이지 않다.'
    ],
    rationale: '비선택적 β 봉쇄는 β2에 의한 혈당 회복을 늦추고 일부 경고 증상도 가릴 수 있다. 다만 무스카린성 땀 분비는 별도로 구분해야 한다.',
    notesPages: [16],
    examRefs: [{id: '14-15-2020-35-p34', page: 34}, {id: '14-15-2019-50-p34', page: 34}],
    lectureSources: [{label: '아드레날린성 약리학(2)', page: 20}, {label: '콜린성 약리학(2)', page: 7}], verifiedSources: []
  },
  {
    id: 'comp-L14-Q1', lecture: 14,
    concept: '신경교세포의 기능과 혈액뇌장벽 구성',
    format: 'judgment', polarity: 'incorrect',
    stem: '중추신경계 구성 세포와 혈액뇌장벽에 관한 설명으로 옳지 않은 것은?',
    options: [
      '성상교세포는 세포외 칼륨 농도와 신경전달물질 농도의 조절에 관여한다.',
      '뇌모세혈관 내피세포의 밀착연접은 혈액뇌장벽의 물리적 장벽을 이룬다.',
      '희소돌기아교세포는 중추 축삭의 수초 형성과 대사적 지원에 관여한다.',
      '미세아교세포는 포식 작용을 포함한 중추의 면역 반응에 관여한다.',
      '뇌실막세포는 중추 축삭에 치밀한 수초를 만들어 도약전도를 촉진한다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳다. 성상교세포는 세포외 이온 환경과 glutamate 등 신경전달물질의 흡수·대사를 조절한다.',
      '옳다. 내피세포의 밀착연접이 핵심 장벽을 이루며 성상교세포 종족과 주위세포가 이를 지지한다. 성상교세포 자체가 내피세포 밀착연접을 대신하는 것은 아니다.',
      '옳다. 희소돌기아교세포는 중추 수초를 만들며 축삭에 대한 영양·대사 지원도 제공한다.',
      '옳다. 미세아교세포는 중추의 면역 감시와 포식 기능을 담당한다.',
      '옳지 않다. 치밀한 중추 수초는 희소돌기아교세포가 만든다. 뇌실막세포는 뇌실을 덮고 뇌척수액 환경과 이동에 관여한다.'
    ],
    rationale: '장벽·이온 및 전달물질 조절은 성상교세포, 수초는 희소돌기아교세포, 면역·포식은 미세아교세포로 구분한다. 혈액뇌장벽의 밀착연접은 내피세포에 있다.',
    notesPages: [17],
    examRefs: [{id: '9-2025-40-p21', page: 21}],
    lectureSources: [{label: '중추신경계 약리 기초', page: 8}, {label: '중추신경계 약리 기초', page: 9}, {label: '중추신경계 약리 기초', page: 10}], verifiedSources: []
  },
  {
    id: 'comp-L14-Q2', lecture: 14,
    concept: '이온통로 수용체와 GPCR의 신호 구별',
    format: 'association',
    stem: '중추신경계 수용체와 신호전달 방식을 바르게 연결한 것은?',
    options: [
      'GABAA — Gs 결합 — cAMP 증가',
      '5-HT3 — Gq 결합 — IP3 생성',
      'GABAB — Gi/o 결합 — 칼륨 유출 촉진',
      'NMDA — Gi/o 결합 — adenylyl cyclase 억제',
      '무스카린 수용체 — 리간드 개폐 통로 — 직접적인 나트륨 유입'
    ],
    answerIndex: 2,
    explanations: [
      '틀린 연결이다. GABAA는 GPCR이 아니라 리간드 개폐 염화물 통로이며, 성숙 뉴런에서 대체로 억제성 반응을 일으킨다.',
      '틀린 연결이다. 5-HT3는 세로토닌 수용체 가운데 이온통로형인 예외로, 양이온 전도도를 증가시킨다.',
      '바른 연결이다. GABAB는 Gi/o 결합 GPCR로 cAMP 생성을 억제하며 GIRK 통로를 통한 칼륨 유출과 시냅스전 칼슘 통로 억제로 뉴런 활성을 낮춘다.',
      '틀린 연결이다. NMDA는 glutamate가 작용하는 이온통로형 수용체로 양이온을 통과시킨다. Gi/o 결합 GPCR로 분류하지 않는다.',
      '틀린 연결이다. 무스카린 수용체는 GPCR이다. 아세틸콜린 수용체 중 직접 양이온 통로를 이루는 것은 니코틴 수용체이다.'
    ],
    rationale: 'GABAB와 무스카린 수용체는 GPCR이며, GABAA·NMDA·5-HT3는 이온통로형이다. 같은 전달물질이라도 수용체 아형에 따라 신호 방식이 달라진다.',
    notesPages: [17],
    examRefs: [{id: '9-2025-41-p21', page: 21}, {id: '9-2023-24-p22', page: 22}, {id: '9-2021-38-p22', page: 22}],
    lectureSources: [{label: '중추신경계 약리 기초', page: 15}, {label: '중추신경계 약리 기초', page: 16}, {label: '중추신경계 약리 기초', page: 31}, {label: '중추신경계 약리 기초', page: 39}], verifiedSources: []
  },
  {
    id: 'comp-L14-Q3', lecture: 14,
    concept: '아세틸콜린의 합성·분해·재사용과 약물 표적',
    format: 'judgment', polarity: 'correct',
    stem: '중추의 아세틸콜린 신경전달에 관한 설명으로 옳은 것은?',
    options: [
      'Choline acetyltransferase는 choline과 acetyl-CoA로 아세틸콜린을 합성한다.',
      '아세틸콜린은 VMAT를 통해 모노아민과 같은 방식으로 소포에 저장된다.',
      '유리된 아세틸콜린은 DAT에 의해 원래 분자 상태로 주로 재흡수된다.',
      'Acetylcholinesterase는 choline의 아세틸화를 촉진하여 전달물질을 보충한다.',
      'Donepezil은 무스카린 수용체에 직접 결합하는 효현제로 신호를 높인다.'
    ],
    answerIndex: 0,
    explanations: [
      '옳다. ChAT는 choline에 acetyl-CoA의 acetyl기를 전달하여 아세틸콜린을 합성하는 효소이다.',
      '틀리다. 아세틸콜린의 소포 저장에는 VAChT가 관여한다. VMAT는 dopamine·serotonin 등 모노아민의 소포 수송체이다.',
      '틀리다. 아세틸콜린은 시냅스에서 AChE로 분해되고 생성된 choline이 재사용된다. DAT는 dopamine 수송체이다.',
      '틀리다. AChE는 아세틸콜린을 가수분해하는 효소이다. 합성 효소인 ChAT와 방향이 반대이다.',
      '틀리다. Donepezil은 AChE를 억제하여 아세틸콜린 분해를 줄이는 간접 작용 약물이며, 무스카린 수용체 직접 효현제가 아니다.'
    ],
    rationale: 'ChAT는 합성, AChE는 분해를 담당한다. 아세틸콜린은 모노아민처럼 원형 재흡수되기보다 분해 후 choline을 재사용하며, donepezil은 분해 단계를 억제한다.',
    notesPages: [17, 18],
    examRefs: [{id: '9-2020-40-p22', page: 22}, {id: '9-2019-64-p23', page: 23}],
    lectureSources: [{label: '중추신경계 약리 기초', page: 18}, {label: '중추신경계 약리 기초', page: 21}, {label: '중추신경계 약리 기초', page: 49}], verifiedSources: []
  },
  {
    id: 'comp-L14-Q4', lecture: 14,
    concept: 'Glutamate–glutamine 순환과 GABA 합성 방향',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Glutamate와 GABA의 대사 및 수용체에 관한 설명으로 옳지 않은 것은?',
    options: [
      '유리된 glutamate는 성상교세포의 수송체를 통해 흡수될 수 있다.',
      '성상교세포의 glutamine synthetase는 glutamate를 glutamine으로 전환한다.',
      '뉴런은 공급받은 glutamine을 glutamate로 전환하여 전달물질 합성에 사용한다.',
      'Glutamate decarboxylase는 GABA를 탈카복실화하여 glutamate를 만든다.',
      'NMDA·AMPA·kainate 수용체는 glutamate가 작용하는 이온통로형 수용체이다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳다. 성상교세포의 glutamate 흡수는 시냅스 주변 glutamate 농도를 조절하는 중요한 과정이다.',
      '옳다. Glutamine synthetase는 성상교세포에서 glutamate를 glutamine으로 전환하며, 이후 glutamine을 뉴런에 공급할 수 있다.',
      '옳다. 뉴런의 glutamine으로부터 glutamate를 재생하는 과정과 성상교세포의 전환 과정이 순환을 이룬다.',
      '옳지 않다. GAD는 glutamate를 탈카복실화하여 GABA를 만든다. 제시된 설명은 기질과 생성물의 방향을 뒤집었다.',
      '옳다. 세 수용체는 이온통로형 glutamate 수용체이며, 별도로 metabotropic glutamate 수용체도 존재한다.'
    ],
    rationale: '성상교세포는 glutamate를 glutamine으로 바꾸어 공급하고 뉴런은 이를 다시 사용한다. GABA 합성은 glutamate에서 GABA로 진행하는 GAD 반응이다.',
    notesPages: [17],
    examRefs: [{id: '9-2021-40-p22', page: 22}, {id: '9-2020-42-p23', page: 23}, {id: '9-2019-63-p23', page: 23}],
    lectureSources: [{label: '중추신경계 약리 기초', page: 25}, {label: '중추신경계 약리 기초', page: 26}, {label: '중추신경계 약리 기초', page: 27}, {label: '중추신경계 약리 기초', page: 29}], verifiedSources: []
  },
  {
    id: 'comp-L14-Q5', lecture: 14,
    concept: 'Serotonin의 전구체·합성 효소·신호 종료',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Serotonin 신경전달에 관한 설명으로 옳지 않은 것은?',
    options: [
      'Tryptophan hydroxylase는 tryptophan을 5-hydroxytryptophan으로 전환한다.',
      '5-Hydroxytryptophan의 탈카복실화로 serotonin이 만들어진다.',
      'Serotonin성 뉴런의 세포체는 뇌간의 raphe nuclei에 집중되어 있다.',
      'SERT 억제는 유리된 serotonin의 재흡수를 줄여 시냅스 농도를 높인다.',
      'MAO 억제는 serotonin의 산화적 분해를 촉진하여 신호를 짧게 한다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳다. Serotonin은 tryptophan에서 유래하며, tryptophan hydroxylase가 5-HTP를 만드는 속도결정 단계에 관여한다.',
      '옳다. 5-HTP가 탈카복실화되면 5-hydroxytryptamine, 즉 serotonin이 된다.',
      '옳다. Serotonin성 신경회로는 raphe nuclei에서 넓은 뇌 영역으로 투사한다. Locus coeruleus는 norepinephrine 계통과 연결한다.',
      '옳다. SERT는 serotonin의 재흡수 수송체이며, 그 억제는 시냅스 내 serotonin 작용을 늘리는 항우울제 기전이다.',
      '옳지 않다. MAO 억제는 serotonin의 산화적 분해를 줄인다. 분해 촉진에 의한 신호 단축이라고 하면 작용 방향이 반대이다.'
    ],
    rationale: 'Serotonin의 합성은 tryptophan에서 시작하고, 재흡수에는 SERT, 대사에는 MAO가 관여한다. 수송체 억제와 대사효소 억제 모두 serotonin의 제거를 줄이는 방향이다.',
    notesPages: [17],
    examRefs: [{id: '9-2021-39-p22', page: 22}, {id: '9-2019-65-p23', page: 23}, {id: '9-2021-38-p22', page: 22}],
    lectureSources: [{label: '중추신경계 약리 기초', page: 38}, {label: '중추신경계 약리 기초', page: 39}, {label: '중추신경계 약리 기초', page: 40}], verifiedSources: []
  },
  {
    id: 'comp-L15-Q1', lecture: 15,
    concept: '알츠하이머병 약물의 콜린성·NMDA·아밀로이드 표적',
    format: 'association',
    stem: '알츠하이머병 치료 약물과 작용 기전을 바르게 연결한 것은?',
    options: [
      'Donepezil — AChE 억제 — 시냅스 아세틸콜린 감소',
      'Memantine — NMDA 수용체 길항 — 과도한 glutamate 신호 억제',
      'Rivastigmine — 무스카린 수용체 효능 — 콜린성 신호 증강',
      'Lecanemab — amyloid-β 생성효소 억제 — 아밀로이드 축적 감소',
      'Donanemab — amyloid-β 표적 항체 — 뉴런 내 아밀로이드 제거'
    ],
    answerIndex: 1,
    explanations: [
      '틀린 연결이다. Donepezil의 AChE 억제는 맞지만, 그 결과 아세틸콜린 분해가 감소하여 시냅스의 아세틸콜린 작용은 증가한다.',
      '바른 연결이다. Memantine은 NMDA 수용체 길항제로 과도한 glutamate성 흥분에 따른 신경독성을 줄이는 전략에 해당한다.',
      '틀린 연결이다. Rivastigmine은 콜린성 전달을 강화하지만, 무스카린 수용체에 직접 작용하는 효현제가 아니라 콜린에스터라제 억제제이다.',
      '틀린 연결이다. Lecanemab은 amyloid-β에 결합하는 항체로 제거를 돕는다. Amyloid-β를 생성하는 효소 자체를 억제하는 약물과 구별한다.',
      '틀린 연결이다. Donanemab의 amyloid-β 표적 항체라는 분류는 맞지만, 표적 아밀로이드 침착은 주로 뉴런 밖의 plaque이다. 뉴런 내 응집체는 tau에 의한 신경섬유매듭과 구별한다.'
    ],
    rationale: '알츠하이머병 약물은 콜린성 전달 강화, NMDA 매개 과흥분 억제, amyloid-β 표적 항체의 세 전략으로 구분한다.',
    notesPages: [18],
    examRefs: [{id: '9-2021-38-p22', page: 22}, {id: '9-2020-40-p22', page: 22}],
    lectureSources: [{label: '중추신경계 비정상 신경전달의 약리학', page: 7}, {label: '중추신경계 비정상 신경전달의 약리학', page: 8}, {label: '중추신경계 비정상 신경전달의 약리학', page: 10}], verifiedSources: []
  },
  {
    id: 'comp-L15-Q2', lecture: 15,
    concept: '파킨슨병 약물의 혈액뇌장벽·합성·분해 표적',
    format: 'judgment', polarity: 'incorrect',
    stem: '파킨슨병에 사용하는 다음 약물의 작용에 관한 설명으로 옳지 않은 것은?',
    options: [
      'Levodopa는 LAT1을 이용해 혈액뇌장벽을 통과하는 도파민 전구물질이다.',
      'Carbidopa의 주된 효과는 중추로 들어가 levodopa의 도파민 전환을 억제하는 것이다.',
      'Selegiline은 MAO-B를 억제하여 도파민의 대사를 줄인다.',
      'Entacapone은 COMT를 억제하여 말초에서 levodopa의 대사를 줄인다.',
      'Bromocriptine은 도파민 수용체를 직접 활성화하는 효현제이다.'
    ],
    answerIndex: 1,
    explanations: [
      '옳다. Levodopa는 LAT1 수송을 이용해 중추로 들어간 뒤 도파민으로 전환된다. 도파민 자체의 혈액뇌장벽 통과는 제한적이다.',
      '옳지 않다. Carbidopa는 혈액뇌장벽을 거의 통과하지 않고 말초 AADC를 억제한다. 따라서 중추에 도달할 levodopa를 보존한다.',
      '옳다. Selegiline은 MAO-B 억제로 중추의 도파민 대사를 줄이는 전략에 속한다.',
      '옳다. Entacapone은 말초 COMT를 억제하여 levodopa가 3-O-methyldopa로 대사되는 것을 줄인다.',
      '옳다. Bromocriptine은 도파민 수용체 효현제로, 전구물질 공급이나 분해효소 억제와 다른 방식으로 도파민 신호를 보완한다.'
    ],
    rationale: 'Carbidopa는 중추의 도파민 생성을 막으려는 약물이 아니라, 중추에 도달하기 전 말초의 levodopa 전환을 억제하는 보조 약물이다.',
    notesPages: [18],
    examRefs: [{id: '10-2025-42-p23', page: 23}, {id: '10-2023-25-p24', page: 24}, {id: '14-15-2021-33-p33', page: 33}],
    lectureSources: [{label: '중추신경계 비정상 신경전달의 약리학', page: 14}, {label: '중추신경계 비정상 신경전달의 약리학', page: 16}], verifiedSources: []
  },
  {
    id: 'comp-L15-Q3', lecture: 15,
    concept: '진정·항불안·아편 길항 약물의 수용체 작용',
    format: 'judgment', polarity: 'incorrect',
    stem: '진정·항불안 관련 약물 및 아편 길항제의 표적에 관한 연결로 옳지 않은 것은?',
    options: [
      'Diazepam — GABAA 양성 알로스테릭 조절 — 염화물 통로 개방 빈도 증가',
      'Pentobarbital — GABAA 작용 증강 — 염화물 통로 개방 시간 증가',
      'Buspirone — 5-HT1A 부분 효능 — 항불안 작용',
      'Naloxone — 아편수용체 경쟁적 길항 — 아편에 의한 호흡억제 길항',
      'Flumazenil — 아편수용체 경쟁적 길항 — morphine 작용 길항'
    ],
    answerIndex: 4,
    explanations: [
      '옳다. Diazepam은 benzodiazepine 결합부위에서 GABA 작용을 증강하여 GABAA 통로의 개방 빈도를 높인다.',
      '옳다. Pentobarbital은 barbiturate로 GABAA 염화물 통로의 개방 시간을 늘린다. Benzodiazepine의 빈도 증가와 구분한다.',
      '옳다. Buspirone은 5-HT1A 부분 효능제로 항불안 작용을 나타낸다. GABAA 증강제와 같은 항경련·근이완 작용으로 분류하지 않는다.',
      '옳다. Naloxone은 아편수용체 길항제로 아편 과량에 의한 호흡억제와 의식 저하를 되돌리는 데 사용된다.',
      '옳지 않다. Flumazenil은 GABAA의 benzodiazepine 결합부위 길항제이다. Morphine의 아편수용체 작용을 길항하는 약물은 naloxone이다.'
    ],
    rationale: 'GABAA 조절제의 개방 빈도·시간 차이와, flumazenil의 benzodiazepine 부위 및 naloxone의 아편수용체 길항을 구분한다.',
    notesPages: [18, 19],
    examRefs: [{id: '10-2025-43-p23', page: 23}, {id: '10-2022-R89-p24', page: 24}, {id: '10-2021-R3-p24', page: 24}],
    lectureSources: [{label: '중추신경계 비정상 신경전달의 약리학', page: 17}, {label: '중추신경계 비정상 신경전달의 약리학', page: 19}, {label: '중추신경계 비정상 신경전달의 약리학', page: 21}, {label: '중추신경계 비정상 신경전달의 약리학', page: 33}], verifiedSources: []
  },
  {
    id: 'comp-L15-Q4', lecture: 15,
    concept: '항우울제의 재흡수 표적과 삼환계 수용체 부작용',
    format: 'judgment', polarity: 'incorrect',
    stem: '항우울제의 작용과 부작용에 관한 설명으로 옳지 않은 것은?',
    options: [
      'Fluoxetine은 serotonin 수송체를 억제하는 SSRI이다.',
      'Duloxetine은 serotonin과 norepinephrine의 재흡수를 억제하는 SNRI이다.',
      'Imipramine은 MAO를 억제하여 serotonin과 norepinephrine의 분해를 줄인다.',
      'Amitriptyline의 무스카린 수용체 차단은 구강건조와 변비에 기여한다.',
      '삼환계 항우울제의 H1 수용체 차단은 진정 작용에 기여한다.'
    ],
    answerIndex: 2,
    explanations: [
      '옳다. Fluoxetine은 SERT를 억제하여 시냅스의 serotonin 농도를 높이는 SSRI이다.',
      '옳다. Duloxetine은 SERT와 NET를 억제하는 SNRI로, serotonin에 선택적인 fluoxetine과 구별한다.',
      '옳지 않다. Imipramine은 삼환계 항우울제로 serotonin·norepinephrine의 재흡수를 억제한다. MAO 억제에 의한 분해 감소와는 다르다.',
      '옳다. Amitriptyline 등 삼환계 약물의 항무스카린 작용은 구강건조·시력흐림·변비와 연결된다.',
      '옳다. H1 수용체 차단은 진정과 연결한다. 과량 복용 시 나타나는 QRS 연장 등의 심독성은 H1 차단에 의한 진정과 구별한다.'
    ],
    rationale: 'SSRI·SNRI·삼환계 약물은 재흡수 억제를 이용한다. 삼환계 약물은 추가로 무스카린·α 아드레날린·H1 수용체를 차단하여 여러 부작용을 일으킨다.',
    notesPages: [19],
    examRefs: [{id: '10-2023-26-p24', page: 24}, {id: '14-15-2025-45-p31', page: 31}],
    lectureSources: [{label: '중추신경계 비정상 신경전달의 약리학', page: 24}, {label: '중추신경계 비정상 신경전달의 약리학', page: 25}], verifiedSources: []
  },
  {
    id: 'comp-L15-Q5', lecture: 15,
    concept: '소발작과 T형 칼슘 전류 억제 약물',
    format: 'association',
    stem: '항뇌전증제 가운데 시상 뉴런의 T형 Ca2+ 전류 억제를 대표 기전으로 하며, 주로 소발작에 사용하는 약물은?',
    options: ['Carbamazepine', 'Felbamate', 'Gabapentin', 'Ethosuximide', 'Phenytoin'],
    answerIndex: 3,
    explanations: [
      '해당하지 않는다. Carbamazepine은 전압개폐 Na+ 통로 억제가 대표 기전이며, 초점발작과 연결한다.',
      '해당하지 않는다. Felbamate의 강의상 대표 표적은 glutamate NMDA 수용체이다. 소발작에 특화된 T형 Ca2+ 전류 억제제와 구별한다.',
      '해당하지 않는다. Gabapentin은 전압개폐 Ca2+ 통로의 α2δ 소단위에 결합하는 약물로, 소발작의 T형 전류를 표적으로 하는 대표 약물이 아니다.',
      '맞다. Ethosuximide는 저전압 활성화 T형 Ca2+ 전류를 억제하여 소발작과 관련된 시상 회로의 반복 방전을 줄인다.',
      '해당하지 않는다. Phenytoin은 전압개폐 Na+ 통로를 억제하는 약물이며, 소발작에 특화된 T형 Ca2+ 억제제와는 다르다.'
    ],
    rationale: '소발작–T형 Ca2+ 전류 억제–ethosuximide의 연결을 기억한다. Na+ 통로 억제제, 고전압 활성화 Ca2+ 통로 관련 약물, NMDA 길항제와 구분한다.',
    notesPages: [19],
    examRefs: [{id: '10-2025-44-p24', page: 24}, {id: '10-2022-R88-p24', page: 24}, {id: '10-2021-41-p24', page: 24}],
    lectureSources: [{label: '중추신경계 비정상 신경전달의 약리학', page: 31}, {label: '중추신경계 비정상 신경전달의 약리학', page: 32}], verifiedSources: []
  },
  {
    id: 'comp-L16-Q1', lecture: 16,
    concept: 'β세포의 KATP–탈분극–인슐린 분비와 sulfonylurea',
    format: 'judgment', polarity: 'incorrect',
    stem: '췌장 β세포의 인슐린 분비와 sulfonylurea의 작용에 관한 설명으로 옳지 않은 것은?',
    options: [
      '세포 안으로 들어온 glucose의 대사가 증가하면 ATP가 증가한다.',
      'KATP 통로가 닫히면 칼륨 유출이 줄어 세포막이 탈분극한다.',
      '탈분극에 따른 전압개폐 Ca2+ 통로 개방은 인슐린 분비를 촉진한다.',
      'Sulfonylurea는 KATP 통로의 열린 상태를 유지하여 인슐린 분비를 늘린다.',
      'Sulfonylurea에 의한 인슐린 분비 증가는 저혈당과 체중 증가를 유발할 수 있다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳다. Glucose 대사에 따른 ATP 증가는 β세포의 전기적 반응을 시작하는 신호이다.',
      '옳다. ATP 민감성 칼륨 통로가 닫히면 바깥으로 나가는 양전하가 줄어 막전위가 탈분극 방향으로 변한다.',
      '옳다. 전압개폐 칼슘 통로를 통한 Ca2+ 유입은 인슐린 함유 소포의 분비를 유도한다.',
      '옳지 않다. Sulfonylurea는 KATP 통로를 닫아 탈분극과 Ca2+ 유입을 일으킨다. 열린 상태를 유지한다는 설명은 반대이다.',
      '옳다. 인슐린 분비를 직접 촉진하므로 sulfonylurea는 저혈당과 체중 증가가 중요한 부작용이다.'
    ],
    rationale: 'Glucose 대사 증가 → ATP 증가 → KATP 폐쇄 → 탈분극 → Ca2+ 유입 → 인슐린 분비 순서이다. Sulfonylurea는 이 과정에서 KATP 폐쇄 단계를 이용한다.',
    notesPages: [20],
    examRefs: [{id: '16-2023-39-p35', page: 35}, {id: '16-2020-58-p36', page: 36}],
    lectureSources: [{label: '내분비 약리 기초', page: 20}, {label: '내분비 약리 기초', page: 21}], verifiedSources: []
  },
  {
    id: 'comp-L16-Q2', lecture: 16,
    concept: 'Metformin의 간 포도당신생 억제와 신장 기능 관련 위험',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Metformin의 작용과 특성에 관한 설명으로 옳지 않은 것은?',
    options: [
      '간의 포도당신생을 감소시키는 것이 주요 혈당강하 기전이다.',
      '말초 조직의 인슐린 감수성 증가와 glucose 이용 증가에 기여한다.',
      '단독 사용 시 sulfonylurea보다 저혈당을 유발하는 경향이 작다.',
      '신장 기능이 크게 저하되면 약물 축적과 젖산산증 위험이 문제가 될 수 있다.',
      '췌장 β세포의 KATP 통로 폐쇄를 통한 직접적인 인슐린 분비 촉진이 주기전이다.'
    ],
    answerIndex: 4,
    explanations: [
      '옳다. Metformin은 간에서의 glucose 생성을 줄이며, 강의에서는 포도당신생 억제를 주요 작용으로 제시한다.',
      '옳다. 근육·지방 등 말초 조직에서 인슐린 감수성을 높여 glucose 이용에 기여한다.',
      '옳다. 인슐린 분비를 직접 촉진하는 약물이 아니므로 단독 사용에서 저혈당 위험이 비교적 낮다.',
      '옳다. 신기능 저하에 따른 metformin 축적은 드물지만 중요한 젖산산증 위험과 연결된다.',
      '옳지 않다. β세포 KATP 폐쇄는 sulfonylurea·meglitinide의 기전이다. Metformin을 직접 인슐린 분비 촉진제로 분류하지 않는다.'
    ],
    rationale: 'Metformin은 간 포도당 생성 억제와 인슐린 감수성 개선을 중심으로 이해한다. 직접 분비 촉진제가 아니라는 점이 sulfonylurea와의 저혈당 위험 차이도 설명한다.',
    notesPages: [20],
    examRefs: [{id: '16-2025-28-p35', page: 35}, {id: '16-2023-40-p35', page: 35}, {id: '16-2022-67-p36', page: 36}],
    lectureSources: [{label: '내분비 약리 기초', page: 23}], verifiedSources: []
  },
  {
    id: 'comp-L16-Q3', lecture: 16,
    concept: 'GLP-1·GIP 효현제와 DPP-4 억제제의 구별',
    format: 'judgment', polarity: 'incorrect',
    stem: 'Incretin 관련 당뇨병 약물에 관한 설명으로 옳지 않은 것은?',
    options: [
      'GLP-1 수용체 활성화는 glucose에 따른 인슐린 분비 반응을 증강한다.',
      'Semaglutide는 GLP-1 수용체 효현제로 분류한다.',
      'Tirzepatide는 GIP와 GLP-1의 두 수용체에 작용하는 효현제이다.',
      'DPP-4 억제제의 주기전은 GLP-1 수용체에 직접 결합하여 활성화하는 것이다.',
      'GLP-1은 위 배출을 지연시키고 식욕을 억제하는 작용도 가진다.'
    ],
    answerIndex: 3,
    explanations: [
      '옳다. Incretin은 β세포의 분비 신호를 증폭하며, GLP-1 수용체 활성화는 혈당에 따른 인슐린 분비를 증가시킨다.',
      '옳다. Semaglutide는 GLP-1 수용체를 직접 활성화하는 약물이다.',
      '옳다. Tirzepatide는 GIP/GLP-1 이중 수용체 효현제이다. GLP-1 단일 수용체 효현제와 구분한다.',
      '옳지 않다. DPP-4 억제제는 incretin 분해효소를 억제하여 내인성 GLP-1·GIP의 작용을 연장한다. 수용체에 직접 작용하는 효현제와는 다르다.',
      '옳다. GLP-1은 인슐린 분비 증강 외에도 위 배출 지연과 식욕 억제에 관여하며, GLP-1 관련 약물의 포만감 증가를 설명한다.'
    ],
    rationale: '직접 수용체 효현제인 semaglutide·tirzepatide와, 내인성 incretin의 분해를 줄이는 DPP-4 억제제를 구분한다.',
    notesPages: [20],
    examRefs: [{id: '16-2025-29-p35', page: 35}],
    lectureSources: [{label: '내분비 약리 기초', page: 24}, {label: '내분비 약리 기초', page: 25}, {label: '내분비 약리 기초', page: 26}, {label: '내분비 약리 기초', page: 27}, {label: '내분비 약리 기초', page: 28}], verifiedSources: []
  },
  {
    id: 'comp-L16-Q4', lecture: 16,
    concept: 'SGLT2 억제에 따른 요당·삼투성 이뇨·체액량 감소',
    format: 'case',
    stem: '제2형 당뇨병 환자에게 약물을 추가한 뒤 혈당은 낮아졌지만 소변의 glucose 배출과 소변량이 늘고, 일어설 때 어지러운 증상이 생겼다. 근위세뇨관의 Na+–glucose 공동 재흡수 억제로 이 변화를 설명하는 약물군은?',
    options: ['DPP-4 억제제', 'Thiazolidinedione', 'Sulfonylurea', 'α-Glucosidase 억제제', 'SGLT2 억제제'],
    answerIndex: 4,
    explanations: [
      '해당하지 않는다. DPP-4 억제제는 incretin의 분해를 줄이는 약물로, 신장 Na+–glucose 공동수송을 직접 차단하지 않는다.',
      '해당하지 않는다. TZD는 PPAR-γ를 통해 인슐린 감수성을 높이며, 오히려 체액 저류와 부종이 중요한 부작용이다.',
      '해당하지 않는다. Sulfonylurea는 β세포 KATP 통로를 차단하여 인슐린 분비를 늘린다. 요당 배출 증가를 직접 이용하는 약물이 아니다.',
      '해당하지 않는다. α-Glucosidase 억제제는 장내 탄수화물 분해를 늦춘다. 신장 재흡수 차단과 구별한다.',
      '맞다. SGLT2 억제는 근위세뇨관에서 glucose·Na+ 재흡수를 줄인다. 요당 증가에 따른 삼투성 이뇨와 체액량 감소는 소변량 증가·기립 시 어지러움을 설명한다.'
    ],
    rationale: '혈당 저하와 함께 나타나는 요당·이뇨 증가가 핵심 단서이다. 신장 재흡수 억제에 따른 체액량 감소를 인슐린 분비나 장 흡수 기전과 구분한다.',
    notesPages: [20],
    examRefs: [{id: '16-2025-30-p35', page: 35}],
    lectureSources: [{label: '내분비 약리 기초', page: 29}], verifiedSources: []
  },
  {
    id: 'comp-L16-Q5', lecture: 16,
    concept: 'TZD의 핵수용체 표적과 체액 저류',
    format: 'association',
    stem: '당뇨병 약물과 주된 표적·대표 부작용을 바르게 연결한 것은?',
    options: [
      'Acarbose — β세포 KATP 통로 폐쇄 — 저혈당',
      'Pioglitazone — PPAR-γ 활성화 — 체액 저류와 부종',
      'Meglitinide — 장 α-glucosidase 억제 — 탄수화물 발효에 따른 가스',
      'Insulin — 신장 SGLT2 억제 — 삼투성 이뇨',
      'Rosiglitazone — DPP-4 억제 — incretin 분해 지연'
    ],
    answerIndex: 1,
    explanations: [
      '틀린 연결이다. Acarbose는 장 α-glucosidase 억제제로 탄수화물 분해를 늦추며, 가스·복부 불쾌감이 특징적이다. KATP 폐쇄는 분비 촉진제와 연결한다.',
      '바른 연결이다. Pioglitazone은 TZD로 핵수용체 PPAR-γ를 활성화하여 인슐린 감수성을 높인다. 체중 증가·체액 저류·부종은 중요한 부작용이다.',
      '틀린 연결이다. Meglitinide는 β세포 KATP 통로에 작용하는 인슐린 분비 촉진제로 저혈당·체중 증가와 연결한다. 장내 효소 억제제와 구별한다.',
      '틀린 연결이다. Insulin은 인슐린 수용체 신호를 통해 glucose 이용과 저장을 촉진한다. SGLT2 억제에 의한 요당·이뇨 증가는 다른 약물군의 기전이다.',
      '틀린 연결이다. Rosiglitazone은 pioglitazone과 같은 TZD이며 PPAR-γ 효현제이다. DPP-4 억제제로 분류하지 않는다.'
    ],
    rationale: 'TZD는 인슐린 분비 촉진제나 incretin 분해 억제제가 아니라 핵수용체를 통한 감수성 개선제이다. 혈당을 낮추더라도 체액 저류·부종을 동반할 수 있다.',
    notesPages: [20],
    examRefs: [{id: '16-2022-16-p35', page: 35}, {id: '16-2021-55-p36', page: 36}, {id: '16-2019-81-p37', page: 37}],
    lectureSources: [{label: '내분비 약리 기초', page: 31}], verifiedSources: []
  }
];
