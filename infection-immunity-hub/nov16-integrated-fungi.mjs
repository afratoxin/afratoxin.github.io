// Cross-unit cases joining the November 16 fungi lectures with earlier infection lectures.
export const QUESTIONS = [
  {
    id: 'lecture-integrated-nov16-pcp-cmv',
    lecture: 'integrated', topic: 'integrated', kind: 'case', format: 'mcq',
    stem: 'A는 CD4 60/mm³인 HIV 환자로 마른기침·호흡곤란과 양측 간유리음영이 있다. 폐포 내 거품성 삼출물에서 GMS 양성의 찌그러진 낭벽이 보인다. B는 이식 후 폐렴 환자로, 비대한 세포에 halo를 동반한 큰 핵내 봉입체가 보인다. A / B의 대표 원인체는?',
    choices: ['CMV / Pneumocystis', 'Pneumocystis / Adenovirus', 'Pneumocystis / CMV', 'RSV / CMV', 'Mycobacterium / Pneumocystis'],
    answer: 2,
    explanation: 'Pneumocystis는 세포면역 저하, 간유리음영, 폐포 내 거품성 삼출물과 GMS 낭벽을 연결한다. CMV는 감염세포 비대와 halo가 있는 owl’s-eye 핵내 봉입체를 연결한다. 면역저하 폐렴이라는 배경보다 검체의 형태가 두 원인체를 가른다.',
    choiceNotes: ['두 원인체와 형태 단서를 서로 바꾸었다.', 'A는 맞지만 adenovirus는 smudge 형태의 핵 변화가 대표적이다.', 'A의 낭벽과 B의 거대 핵내 봉입체에 맞는 순서이다.', 'RSV는 다핵 융합세포·세포질 봉입체와 연결한다.', '항산성 막대균과 진균 낭벽·CMV 핵내 봉입체를 구별한다.'],
    keyClue: '거품성 폐포 삼출물·GMS 낭벽 ↔ 세포 비대·owl’s-eye 핵내 봉입체',
    tags: ['통합 감별', '면역저하 폐렴', 'Pneumocystis', 'CMV', '11월16일'],
    sourceRefs: [{doc: '261116_05', pages: [30,32,35,36]}, {doc: '261104_05', pages: [46,48]}, {doc: '261104_02', pages: [29,30]}],
    examRefs: [], refs: [], pages: [30,32,35,36]
  },
  {
    id: 'lecture-integrated-nov16-crypto-tb',
    lecture: 'integrated', topic: 'integrated', kind: 'case', format: 'mcq',
    stem: 'A와 B 모두 수 주간 진행한 두통과 림프구 우세 뇌척수액 소견을 보인다. A는 HIV 환자로 CSF India ink에서 협막성 출아 효모가 보인다. B는 폐 공동과 수막 병변이 있고 생검에서 건락성 육아종과 항산성 막대균이 확인되었다. A / B의 대표 원인체는?',
    choices: ['Cryptococcus / M. tuberculosis', 'M. tuberculosis / Cryptococcus', 'Candida / M. tuberculosis', 'Cryptococcus / N. meningitidis', 'Listeria / Cryptococcus'],
    answer: 0,
    explanation: '만성 경과와 림프구 우세 CSF만으로 두 원인체를 가르기 어렵다. A의 다당류 협막을 가진 출아 효모는 Cryptococcus를 지지한다. B의 폐 공동·수막 침범과 항산성 막대균은 결핵을 지지한다.',
    choiceNotes: ['협막성 효모와 항산성 막대균을 올바르게 연결했다.', '두 검체의 형태를 서로 바꾸었다.', 'Candida는 출아 효모·가성균사와 연결하며 이 협막성 효모 소견과 다르다.', '수막구균은 그람음성 쌍알균이며 항산성 막대균이 아니다.', 'Listeria는 그람양성 짧은막대균이며 협막성 출아 효모가 아니다.'],
    keyClue: '만성 수막염의 공통 임상보다 협막성 출아 효모 / 항산성 막대균을 구별',
    tags: ['통합 감별', '수막염', 'Cryptococcus', '결핵', '11월16일'],
    sourceRefs: [{doc: '261116_06', pages: [18,19]}, {doc: '261104_03', pages: [18,19,21,22]}, {doc: '261106_03', pages: [9,11]}],
    examRefs: [], refs: [], pages: [18,19]
  },
  {
    id: 'lecture-integrated-nov16-mold-nocardia',
    lecture: 'integrated', topic: 'integrated', kind: 'case', format: 'mcq',
    stem: 'A는 DKA 환자의 괴사성 부비동 병변으로 넓고 격막이 드문 균사가 보인다. B는 호중구감소 환자의 침습성 폐결절로 격막과 예각 분지를 보이는 균사가 관찰된다. C는 이식 환자의 폐·뇌농양으로 그람양성 분지 균체가 약한 항산성을 보인다. A / B / C의 대표 원인군을 순서대로 고르면?',
    choices: ['Aspergillus / Mucorales / Nocardia', 'Mucorales / Nocardia / Aspergillus', 'Nocardia / Aspergillus / Mucorales', 'Mucorales / Aspergillus / Nocardia', 'Mucorales / Aspergillus / Actinomyces'],
    answer: 3,
    explanation: 'DKA·괴사성 비부비동 감염·넓고 격막 드문 균사는 Mucorales를, 호중구감소·예각 분지 격막성 균사는 Aspergillus를 우선 시사한다. 폐에서 뇌로 파종하고 약한 항산성을 보이는 분지 세균은 Nocardia이다. B 같은 균사 형태만으로 속·종을 확정하지 않으며 배양을 함께 확인한다.',
    choiceNotes: ['두 사상균의 전형적인 형태·숙주 단서를 바꾸었다.', 'Nocardia는 이 증례의 격막성 진균 균사와 다르다.', 'DKA의 넓은 균사와 약항산성 분지 세균을 구별한다.', 'A의 Mucorales, B의 Aspergillus 추정, C의 Nocardia가 맞다.', 'Actinomyces는 황과립·혐기성·항산성 음성과 연결한다.'],
    keyClue: 'DKA·넓은 무격막성 균사 / 호중구감소·예각 격막성 균사 / 약항산성 분지 세균',
    tags: ['통합 감별', '균사와 분지 세균', 'Mucorales', 'Aspergillus', 'Nocardia', '11월16일'],
    sourceRefs: [{doc: '261116_06', pages: [5,6,9,10,23,24,25]}, {doc: '261106_05', pages: [26,27,32]}],
    examRefs: [], refs: [], pages: [5,6,9,10,23,24,25]
  },
  {
    id: 'lecture-integrated-nov16-catheter-candida-cns',
    lecture: 'integrated', topic: 'integrated', kind: 'case', format: 'mcq',
    stem: '중심정맥관을 사용 중인 두 환자에게 혈류감염이 생겼다. 서로 다른 말초 부위의 반복 배양에서 A는 출아 효모가 자라고 가성균사가 관찰된다. B는 catalase 양성·coagulase 음성인 포도송이 모양 그람양성 알균이 자라며 기구 표면 biofilm과 연관되었다. A / B의 대표 원인체는?',
    choices: ['Candida / S. aureus', 'Cryptococcus / S. epidermidis', 'S. epidermidis / Candida', 'Candida / K. pneumoniae', 'Candida / S. epidermidis'],
    answer: 4,
    explanation: '카테터는 Candida와 coagulase 음성 포도알균 모두의 감염 위험요인이다. 따라서 기구 사용력만으로 원인체를 정하지 않는다. A의 출아 효모·가성균사는 Candida, B의 catalase 양성·coagulase 음성 cluster와 biofilm은 대표적으로 S. epidermidis를 지지한다.',
    choiceNotes: ['A는 맞지만 S. aureus는 coagulase 양성이다.', 'Cryptococcus의 대표 형태는 협막성 출아 효모이다.', '진균 형태와 세균 형태를 서로 바꾸었다.', 'K. pneumoniae는 그람음성 막대균이다.', '효모·가성균사와 coagulase 음성 cluster를 올바르게 연결했다.'],
    keyClue: '같은 카테터 위험요인에서 출아·가성균사 ↔ catalase+·coagulase− cluster',
    tags: ['통합 감별', '카테터 감염', 'Candida', 'S. epidermidis', '11월16일'],
    sourceRefs: [{doc: '261116_05', pages: [4,19,20,21]}, {doc: '261104_05', pages: [39,40]}, {doc: '261104_01', pages: [2,3,20,26,27]}],
    examRefs: [], refs: [], pages: [4,19,20,21]
  }
];
