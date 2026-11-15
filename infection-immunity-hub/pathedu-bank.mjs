// Photo identification: the prompt leaves the decisive morphology to the image.
const LIBRARY_URL='https://pathedu.snu.ac.kr/library';
const captions=['피부 조직','자궁경부 조직','조직 표본','조직 표본 · 면역조직화학','피부 조직','소변 세포진','조직 표본','림프절 조직','림프절 조직 · 항산염색','피부 조직','피부 조직 · 항산염색','항산염색 대조표본','맹장 조직','폐 조직','폐 조직 · GMS','맹장 조직','맹장 조직 · GMS','맹장 조직 · PAS','자궁경부·질 세포진','조직 표본','조직 표본 · GMS','조직 표본 · PAS','폐 조직','기관지세척액','기관지세척액 · GMS','폐 조직'];
const captureDimensions=[[900, 500], [900, 600], [800, 650], [800, 650], [900, 420], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [590, 430], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650], [800, 650]];
const libraryPhotoCandidates=Object.fromEntries(captions.map((caption,index)=>{
 const n=String(index+1).padStart(2,'0');
 return ['edu-'+n,{src:'assets/pathology/edu-'+n+'.webp',alt:'병리교육 조직 표본 '+(index+1),caption,doc:'pathedu',page:index+1,slideNumber:index+1,width:captureDimensions[index][0],height:captureDimensions[index][1],sourceUrl:LIBRARY_URL,sourceTitle:'서울대학교 병리교육 라이브러리'}];
}));

export const PATHEDU_QUESTIONS=Object.freeze([
 {
  "id": "path-edu-v2-hpv",
  "topic": "path-image",
  "format": "mcq",
  "kind": "integrated",
  "ask": "organism",
  "stem": "손등의 작은 구진을 생검한 조직이다. 가장 가능성이 높은 원인 바이러스는?",
  "photos": [
   "edu-01",
   "edu-01-detail"
  ],
  "choices": [
   "HPV",
   "Molluscum contagiosum virus",
   "HSV",
   "VZV",
   "CMV"
  ],
  "answer": 0,
  "choiceNotes": [
   "표피가 유두상으로 솟고, 상층 세포의 불규칙한 핵 주위에 밝은 공간이 보입니다. HPV 감염의 koilocytosis와 사마귀성 상피 증식입니다. 물사마귀는 큰 세포질 봉입체가 표피세포를 채웁니다.",
   "분엽성으로 증식한 표피가 컵 모양 병변을 만들고, 큰 봉입체가 세포질을 채웁니다. 세포질 내 molluscum body는 물사마귀를 일으키는 poxvirus의 단서입니다.",
   "상피세포 안의 여러 핵이 서로 맞물리고, 핵 내부가 뿌옇게 보입니다. 다핵화·핵 molding·ground-glass 핵 변화는 HSV 감염을 지지합니다.",
   "HSV와 비슷한 다핵화·핵 변화가 가능하며, 전신 수포나 피부분절 병변의 임상 맥락을 비교합니다.",
   "주변보다 큰 세포의 핵 안에 짙은 봉입체와 그 주위의 밝은 띠가 보입니다. 세포 비대와 owl’s-eye 핵 내 봉입체는 CMV의 핵심 소견입니다."
  ],
  "imageClue": "표피가 유두상으로 솟고, 상층 세포의 불규칙한 핵 주위에 밝은 공간이 보입니다.",
  "coreFact": "HPV 감염의 koilocytosis와 사마귀성 상피 증식입니다.",
  "contrast": "물사마귀는 큰 세포질 봉입체가 표피세포를 채웁니다.",
  "explanation": "표피가 유두상으로 솟고, 상층 세포의 불규칙한 핵 주위에 밝은 공간이 보입니다. HPV 감염의 koilocytosis와 사마귀성 상피 증식입니다. 물사마귀는 큰 세포질 봉입체가 표피세포를 채웁니다.",
  "keyClue": "표피가 유두상으로 솟고, 상층 세포의 불규칙한 핵 주위에 밝은 공간이 보입니다.",
  "studyFocus": "핵주변 halo·사마귀성 증식 ↔ 큰 세포질 봉입체",
  "sourceRefs": [
   {
    "doc": "path1",
    "pages": [
     29
    ]
   },
   {
    "doc": "lab",
    "pages": [
     5,
     6
    ]
   }
  ],
  "examRefs": [],
  "refs": [],
  "pages": [
   29
  ],
  "externalRefs": [
   {
    "title": "서울대학교 병리교육 라이브러리",
    "url": "https://pathedu.snu.ac.kr/library"
   }
  ]
 },
 {
  "id": "path-edu-v2-hsv",
  "topic": "path-image",
  "format": "mcq",
  "kind": "integrated",
  "ask": "organism",
  "stem": "외음부 통증과 군집 수포가 있는 환자의 자궁경부 조직이다. 가장 가능성이 높은 원인 바이러스는?",
  "photos": [
   "edu-02"
  ],
  "choices": [
   "CMV",
   "HSV",
   "VZV",
   "Adenovirus",
   "BK polyomavirus"
  ],
  "answer": 1,
  "choiceNotes": [
   "주변보다 큰 세포의 핵 안에 짙은 봉입체와 그 주위의 밝은 띠가 보입니다. 세포 비대와 owl’s-eye 핵 내 봉입체는 CMV의 핵심 소견입니다.",
   "상피세포 안의 여러 핵이 서로 맞물리고, 핵 내부가 뿌옇게 보입니다. 다핵화·핵 molding·ground-glass 핵 변화는 HSV 감염을 지지합니다. VZV와 형태가 겹치므로 생식기 군집 수포라는 임상 맥락도 함께 봅니다.",
   "HSV와 비슷한 다핵화·핵 변화가 가능하며, 전신 수포나 피부분절 병변의 임상 맥락을 비교합니다.",
   "짙고 뭉개진 핵 내 봉입체가 단서이며 HSV의 다핵화 및 CMV의 큰 봉입체와 비교합니다.",
   "소변 속 요로 상피세포가 커지고 핵이 짙게 뭉개져 악성세포처럼 보입니다. 신장이식 환자의 decoy cell은 BK polyomavirus를 먼저 고려하는 조합입니다."
  ],
  "imageClue": "상피세포 안의 여러 핵이 서로 맞물리고, 핵 내부가 뿌옇게 보입니다.",
  "coreFact": "다핵화·핵 molding·ground-glass 핵 변화는 HSV 감염을 지지합니다.",
  "contrast": "VZV와 형태가 겹치므로 생식기 군집 수포라는 임상 맥락도 함께 봅니다.",
  "explanation": "상피세포 안의 여러 핵이 서로 맞물리고, 핵 내부가 뿌옇게 보입니다. 다핵화·핵 molding·ground-glass 핵 변화는 HSV 감염을 지지합니다. VZV와 형태가 겹치므로 생식기 군집 수포라는 임상 맥락도 함께 봅니다.",
  "keyClue": "상피세포 안의 여러 핵이 서로 맞물리고, 핵 내부가 뿌옇게 보입니다.",
  "studyFocus": "다핵화·molding ↔ CMV의 큰 감염세포·핵 내 봉입체",
  "sourceRefs": [
   {
    "doc": "path1",
    "pages": [
     25,
     29,
     32
    ]
   },
   {
    "doc": "lab",
    "pages": [
     13,
     15
    ]
   }
  ],
  "examRefs": [
   "2025 30번",
   "2023 88번",
   "2021 14번"
  ],
  "refs": [],
  "pages": [
   25,
   29,
   32
  ],
  "externalRefs": [
   {
    "title": "서울대학교 병리교육 라이브러리",
    "url": "https://pathedu.snu.ac.kr/library"
   }
  ]
 },
 {
  "id": "path-edu-v2-cmv",
  "topic": "path-image",
  "format": "mcq",
  "kind": "integrated",
  "ask": "organism",
  "stem": "면역억제 치료 중인 환자의 생검 조직이다. 가장 가능성이 높은 원인 바이러스는?",
  "photos": [
   "edu-03"
  ],
  "choices": [
   "HSV",
   "Adenovirus",
   "CMV",
   "BK polyomavirus",
   "VZV"
  ],
  "answer": 2,
  "choiceNotes": [
   "상피세포 안의 여러 핵이 서로 맞물리고, 핵 내부가 뿌옇게 보입니다. 다핵화·핵 molding·ground-glass 핵 변화는 HSV 감염을 지지합니다.",
   "짙고 뭉개진 핵 내 봉입체가 단서이며 HSV의 다핵화 및 CMV의 큰 봉입체와 비교합니다.",
   "주변보다 큰 세포의 핵 안에 짙은 봉입체와 그 주위의 밝은 띠가 보입니다. 세포 비대와 owl’s-eye 핵 내 봉입체는 CMV의 핵심 소견입니다. HPV의 halo는 핵주변 세포질에 있으며, HSV는 다핵화·핵 molding을 비교합니다.",
   "소변 속 요로 상피세포가 커지고 핵이 짙게 뭉개져 악성세포처럼 보입니다. 신장이식 환자의 decoy cell은 BK polyomavirus를 먼저 고려하는 조합입니다.",
   "HSV와 비슷한 다핵화·핵 변화가 가능하며, 전신 수포나 피부분절 병변의 임상 맥락을 비교합니다."
  ],
  "imageClue": "주변보다 큰 세포의 핵 안에 짙은 봉입체와 그 주위의 밝은 띠가 보입니다.",
  "coreFact": "세포 비대와 owl’s-eye 핵 내 봉입체는 CMV의 핵심 소견입니다.",
  "contrast": "HPV의 halo는 핵주변 세포질에 있으며, HSV는 다핵화·핵 molding을 비교합니다.",
  "explanation": "주변보다 큰 세포의 핵 안에 짙은 봉입체와 그 주위의 밝은 띠가 보입니다. 세포 비대와 owl’s-eye 핵 내 봉입체는 CMV의 핵심 소견입니다. HPV의 halo는 핵주변 세포질에 있으며, HSV는 다핵화·핵 molding을 비교합니다.",
  "keyClue": "주변보다 큰 세포의 핵 안에 짙은 봉입체와 그 주위의 밝은 띠가 보입니다.",
  "studyFocus": "CMV → cytomegaly·owl’s-eye / 세포질 봉입체도 가능",
  "sourceRefs": [
   {
    "doc": "path1",
    "pages": [
     25,
     29,
     30
    ]
   },
   {
    "doc": "lab",
    "pages": [
     7,
     8
    ]
   }
  ],
  "examRefs": [],
  "refs": [],
  "pages": [
   25,
   29,
   30
  ],
  "externalRefs": [
   {
    "title": "서울대학교 병리교육 라이브러리",
    "url": "https://pathedu.snu.ac.kr/library"
   }
  ]
 },
 {
  "id": "path-edu-v2-molluscum",
  "topic": "path-image",
  "format": "mcq",
  "kind": "integrated",
  "ask": "organism",
  "stem": "소아의 얼굴에 생긴 작은 구진의 조직이다. 가장 가능성이 높은 원인 바이러스는?",
  "photos": [
   "edu-05",
   "p04"
  ],
  "choices": [
   "HPV",
   "HSV",
   "CMV",
   "Molluscum contagiosum virus",
   "VZV"
  ],
  "answer": 3,
  "choiceNotes": [
   "표피가 유두상으로 솟고, 상층 세포의 불규칙한 핵 주위에 밝은 공간이 보입니다. HPV 감염의 koilocytosis와 사마귀성 상피 증식입니다.",
   "상피세포 안의 여러 핵이 서로 맞물리고, 핵 내부가 뿌옇게 보입니다. 다핵화·핵 molding·ground-glass 핵 변화는 HSV 감염을 지지합니다.",
   "주변보다 큰 세포의 핵 안에 짙은 봉입체와 그 주위의 밝은 띠가 보입니다. 세포 비대와 owl’s-eye 핵 내 봉입체는 CMV의 핵심 소견입니다.",
   "표피세포가 분엽상으로 증식하고, 큰 봉입체가 세포질을 채웁니다. 세포질 내 molluscum body는 물사마귀를 일으키는 poxvirus의 단서입니다. HPV는 큰 봉입체보다 koilocyte의 핵주변 halo와 유두상 증식이 중심입니다.",
   "HSV와 비슷한 다핵화·핵 변화가 가능하며, 전신 수포나 피부분절 병변의 임상 맥락을 비교합니다."
  ],
  "imageClue": "표피세포가 분엽상으로 증식하고, 큰 봉입체가 세포질을 채웁니다.",
  "coreFact": "세포질 내 molluscum body는 물사마귀를 일으키는 poxvirus의 단서입니다.",
  "contrast": "HPV는 큰 봉입체보다 koilocyte의 핵주변 halo와 유두상 증식이 중심입니다.",
  "explanation": "표피세포가 분엽상으로 증식하고, 큰 봉입체가 세포질을 채웁니다. 세포질 내 molluscum body는 물사마귀를 일으키는 poxvirus의 단서입니다. HPV는 큰 봉입체보다 koilocyte의 핵주변 halo와 유두상 증식이 중심입니다.",
  "keyClue": "표피세포가 분엽상으로 증식하고, 큰 봉입체가 세포질을 채웁니다.",
  "studyFocus": "컵 모양 표피·세포질 봉입체 ↔ HPV의 koilocyte",
  "sourceRefs": [
   {
    "doc": "path1",
    "pages": [
     29
    ]
   },
   {
    "doc": "lab",
    "pages": [
     10,
     11
    ]
   }
  ],
  "examRefs": [
   "2025 100번",
   "2021 16번"
  ],
  "refs": [],
  "pages": [
   29
  ],
  "externalRefs": [
   {
    "title": "서울대학교 병리교육 라이브러리",
    "url": "https://pathedu.snu.ac.kr/library"
   }
  ]
 },
 {
  "id": "path-edu-v2-bk",
  "topic": "path-image",
  "format": "mcq",
  "kind": "integrated",
  "ask": "organism",
  "stem": "신장이식 후 면역억제 중인 환자의 소변 세포검사다. 가장 가능성이 높은 원인 바이러스는?",
  "photos": [
   "edu-06"
  ],
  "choices": [
   "CMV",
   "Adenovirus",
   "HSV",
   "HPV",
   "BK polyomavirus"
  ],
  "answer": 4,
  "choiceNotes": [
   "주변보다 큰 세포의 핵 안에 짙은 봉입체와 그 주위의 밝은 띠가 보입니다. 세포 비대와 owl’s-eye 핵 내 봉입체는 CMV의 핵심 소견입니다.",
   "짙고 뭉개진 핵 내 봉입체가 단서이며 HSV의 다핵화 및 CMV의 큰 봉입체와 비교합니다.",
   "상피세포 안의 여러 핵이 서로 맞물리고, 핵 내부가 뿌옇게 보입니다. 다핵화·핵 molding·ground-glass 핵 변화는 HSV 감염을 지지합니다.",
   "표피가 유두상으로 솟고, 상층 세포의 불규칙한 핵 주위에 밝은 공간이 보입니다. HPV 감염의 koilocytosis와 사마귀성 상피 증식입니다.",
   "소변 속 요로 상피세포가 커지고 핵이 짙게 뭉개져 악성세포처럼 보입니다. 신장이식 환자의 decoy cell은 BK polyomavirus를 먼저 고려하는 조합입니다. CMV·Adenovirus도 핵 변화를 만들 수 있어 형태 하나로 확진하지는 않습니다."
  ],
  "imageClue": "소변 속 요로 상피세포가 커지고 핵이 짙게 뭉개져 악성세포처럼 보입니다.",
  "coreFact": "신장이식 환자의 decoy cell은 BK polyomavirus를 먼저 고려하는 조합입니다.",
  "contrast": "CMV·Adenovirus도 핵 변화를 만들 수 있어 형태 하나로 확진하지는 않습니다.",
  "explanation": "소변 속 요로 상피세포가 커지고 핵이 짙게 뭉개져 악성세포처럼 보입니다. 신장이식 환자의 decoy cell은 BK polyomavirus를 먼저 고려하는 조합입니다. CMV·Adenovirus도 핵 변화를 만들 수 있어 형태 하나로 확진하지는 않습니다.",
  "keyClue": "소변 속 요로 상피세포가 커지고 핵이 짙게 뭉개져 악성세포처럼 보입니다.",
  "studyFocus": "신장이식·소변 decoy cell / 악성세포와의 형태적 혼동",
  "sourceRefs": [
   {
    "doc": "path1",
    "pages": [
     33
    ]
   },
   {
    "doc": "lab",
    "pages": [
     16
    ]
   }
  ],
  "examRefs": [],
  "refs": [],
  "pages": [
   33
  ],
  "externalRefs": [
   {
    "title": "서울대학교 병리교육 라이브러리",
    "url": "https://pathedu.snu.ac.kr/library"
   }
  ]
 },
 {
  "id": "path-edu-v2-tb",
  "topic": "path-image",
  "format": "mcq",
  "kind": "integrated",
  "ask": "organism",
  "stem": "수주간 기침과 체중감소가 지속된 환자의 폐 조직이다. 가장 가능성 높은 원인 병원체는?",
  "photos": [
   "edu-07",
   "p12"
  ],
  "choices": [
   "M. tuberculosis complex",
   "M. avium complex (MAC)",
   "M. leprae",
   "Nocardia spp.",
   "Actinomyces spp."
  ],
  "answer": 0,
  "choiceNotes": [
   "중앙의 무정형 괴사를 상피양 조직구의 육아종성 반응이 둘러쌉니다. 만성 폐 증상과 건락괴사성 육아종은 결핵균군을 지지합니다. MAC·나균도 항산성이므로 항산염색 양성만으로 균종을 구분하지 않습니다.",
   "포말성 조직구가 밀집하고, 항산염색에서 세포 안에 많은 붉은 간균이 보입니다. 심한 HIV 면역저하의 림프절에서 이 조합은 MAC를 지지합니다.",
   "피부의 포말성 조직구와 세포 내 항산균을 손발의 감각저하와 연결합니다. M. leprae는 피부·말초신경을 침범하며 나종형에서는 포말성 조직구가 두드러집니다.",
   "가는 분지성 세균과 약한 항산성을 비교합니다. 조밀한 방사상 세균 집락과 구분합니다.",
   "치밀한 집락의 주변부가 방사상으로 퍼지고, 주위를 화농성 염증세포가 둘러쌉니다. 이 sulfur granule은 Actinomyces 감염의 대표적 형태입니다."
  ],
  "imageClue": "중앙의 무정형 괴사를 상피양 조직구의 육아종성 반응이 둘러쌉니다.",
  "coreFact": "만성 폐 증상과 건락괴사성 육아종은 결핵균군을 지지합니다.",
  "contrast": "MAC·나균도 항산성이므로 항산염색 양성만으로 균종을 구분하지 않습니다.",
  "explanation": "중앙의 무정형 괴사를 상피양 조직구의 육아종성 반응이 둘러쌉니다. 만성 폐 증상과 건락괴사성 육아종은 결핵균군을 지지합니다. MAC·나균도 항산성이므로 항산염색 양성만으로 균종을 구분하지 않습니다.",
  "keyClue": "중앙의 무정형 괴사를 상피양 조직구의 육아종성 반응이 둘러쌉니다.",
  "studyFocus": "괴사 중심·육아종 경계 / 항산성 자체는 결핵에 특이적이지 않음",
  "sourceRefs": [
   {
    "doc": "path2",
    "pages": [
     19,
     21,
     22
    ]
   },
   {
    "doc": "lab",
    "pages": [
     18
    ]
   }
  ],
  "examRefs": [
   "2023 79번"
  ],
  "refs": [],
  "pages": [
   19,
   21,
   22
  ],
  "externalRefs": [
   {
    "title": "서울대학교 병리교육 라이브러리",
    "url": "https://pathedu.snu.ac.kr/library"
   }
  ]
 },
 {
  "id": "path-edu-v2-mac",
  "topic": "path-image",
  "format": "mcq",
  "kind": "integrated",
  "ask": "organism",
  "stem": "심한 면역저하를 동반한 HIV 환자에게 발열과 림프절종대가 생겼다. 림프절 H&E·항산염색 사진의 원인체로 가장 적절한 것은?",
  "photos": [
   "edu-08",
   "edu-09"
  ],
  "choices": [
   "M. tuberculosis complex",
   "M. avium complex (MAC)",
   "M. leprae",
   "Cryptococcus spp.",
   "Pneumocystis jirovecii"
  ],
  "answer": 1,
  "choiceNotes": [
   "중앙의 무정형 괴사를 상피양 조직구와 거대세포의 육아종이 둘러쌉니다. 만성 폐 증상과 건락괴사성 육아종은 결핵균군을 지지합니다.",
   "포말성 조직구가 밀집하고, 항산염색에서 세포 안에 많은 붉은 간균이 보입니다. 심한 HIV 면역저하의 림프절에서 이 조합은 MAC를 지지합니다. 나균도 포말조직구·항산균을 보일 수 있지만 피부·말초신경 병변을 함께 비교합니다.",
   "피부의 포말성 조직구와 세포 내 항산균을 손발의 감각저하와 연결합니다. M. leprae는 피부·말초신경을 침범하며 나종형에서는 포말성 조직구가 두드러집니다.",
   "투명한 halo를 두른 둥근 효모가 보이고, GMS에서도 효모 형태가 강조됩니다. 피막성 효모와 폐·중추신경계 감염을 연결하면 Cryptococcus가 적절합니다.",
   "폐포 공간에 거품성 물질이 차고, GMS에서 검은 컵·반달 모양의 낭이 보입니다. 면역저하 폐렴에서 이 조합은 Pneumocystis jirovecii의 단서입니다."
  ],
  "imageClue": "포말성 조직구가 밀집하고, 항산염색에서 세포 안에 많은 붉은 간균이 보입니다.",
  "coreFact": "심한 HIV 면역저하의 림프절에서 이 조합은 MAC를 지지합니다.",
  "contrast": "나균도 포말조직구·항산균을 보일 수 있지만 피부·말초신경 병변을 함께 비교합니다.",
  "explanation": "포말성 조직구가 밀집하고, 항산염색에서 세포 안에 많은 붉은 간균이 보입니다. 심한 HIV 면역저하의 림프절에서 이 조합은 MAC를 지지합니다. 나균도 포말조직구·항산균을 보일 수 있지만 피부·말초신경 병변을 함께 비교합니다.",
  "keyClue": "포말성 조직구가 밀집하고, 항산염색에서 세포 안에 많은 붉은 간균이 보입니다.",
  "studyFocus": "AIDS·림프절 / foamy macrophage 안의 다수 AFB",
  "sourceRefs": [
   {
    "doc": "path2",
    "pages": [
     23
    ]
   },
   {
    "doc": "lab",
    "pages": [
     19,
     20
    ]
   }
  ],
  "examRefs": [
   "2023 69번"
  ],
  "refs": [],
  "pages": [
   23
  ],
  "externalRefs": [
   {
    "title": "서울대학교 병리교육 라이브러리",
    "url": "https://pathedu.snu.ac.kr/library"
   }
  ]
 },
 {
  "id": "path-edu-v2-leprae",
  "topic": "path-image",
  "format": "mcq",
  "kind": "integrated",
  "ask": "organism",
  "stem": "손발에 감각저하와 반복되는 피부 상처가 있는 환자다. 피부 조직과 항산염색을 보고 원인 병원체를 고르시오.",
  "photos": [
   "edu-10",
   "p16"
  ],
  "choices": [
   "M. avium complex (MAC)",
   "M. tuberculosis complex",
   "M. leprae",
   "Nocardia spp.",
   "Actinomyces spp."
  ],
  "answer": 2,
  "choiceNotes": [
   "포말성 조직구가 밀집하고, 항산염색에서 세포 안에 많은 붉은 간균이 보입니다. 심한 HIV 면역저하의 림프절에서 이 조합은 MAC를 지지합니다.",
   "중앙의 무정형 괴사를 상피양 조직구와 거대세포의 육아종이 둘러쌉니다. 만성 폐 증상과 건락괴사성 육아종은 결핵균군을 지지합니다.",
   "피부의 포말성 조직구와 세포 내 항산균을 손발의 감각저하와 연결합니다. M. leprae는 피부·말초신경을 침범하며 나종형에서는 포말성 조직구가 두드러집니다. MAC와 항산성·포말조직구가 겹치므로 검체 장기와 신경 증상이 감별에 중요합니다.",
   "가는 분지성 세균과 약한 항산성을 비교합니다. 조밀한 방사상 세균 집락과 구분합니다.",
   "치밀한 집락의 주변부가 방사상으로 퍼지고, 주위를 화농성 염증세포가 둘러쌉니다. 이 sulfur granule은 Actinomyces 감염의 대표적 형태입니다."
  ],
  "imageClue": "피부의 포말성 조직구와 세포 내 항산균을 손발의 감각저하와 연결합니다.",
  "coreFact": "M. leprae는 피부·말초신경을 침범하며 나종형에서는 포말성 조직구가 두드러집니다.",
  "contrast": "MAC와 항산성·포말조직구가 겹치므로 검체 장기와 신경 증상이 감별에 중요합니다.",
  "explanation": "피부의 포말성 조직구와 세포 내 항산균을 손발의 감각저하와 연결합니다. M. leprae는 피부·말초신경을 침범하며 나종형에서는 포말성 조직구가 두드러집니다. MAC와 항산성·포말조직구가 겹치므로 검체 장기와 신경 증상이 감별에 중요합니다.",
  "keyClue": "피부의 포말성 조직구와 세포 내 항산균을 손발의 감각저하와 연결합니다.",
  "studyFocus": "피부·말초신경 / 면역 약화 → lepromatous·foamy histiocyte",
  "sourceRefs": [
   {
    "doc": "path2",
    "pages": [
     24,
     25
    ]
   },
   {
    "doc": "lab",
    "pages": [
     21,
     22,
     23,
     25
    ]
   }
  ],
  "examRefs": [
   "2020 16번",
   "2021 15번"
  ],
  "refs": [],
  "pages": [
   24,
   25
  ],
  "externalRefs": [
   {
    "title": "서울대학교 병리교육 라이브러리",
    "url": "https://pathedu.snu.ac.kr/library"
   }
  ]
 },
 {
  "id": "path-edu-v2-actinomyces",
  "topic": "path-image",
  "format": "mcq",
  "kind": "integrated",
  "ask": "organism",
  "stem": "맹장 주변 농양이 오래 지속되어 절제한 조직이다. 사진의 집락을 만드는 원인 병원체는?",
  "photos": [
   "edu-13"
  ],
  "choices": [
   "Nocardia spp.",
   "Aspergillus spp.",
   "Candida spp.",
   "Actinomyces spp.",
   "Mucorales"
  ],
  "answer": 3,
  "choiceNotes": [
   "가는 분지성 세균과 약한 항산성을 비교합니다. 조밀한 방사상 세균 집락과 구분합니다.",
   "비교적 가는 균사에 격막이 보이고, 예각으로 가지를 칩니다. 격막성 균사와 예각 분지는 Aspergillus의 핵심 감별점입니다.",
   "타원형 효모가 출아하고, 길게 이어진 가성균사가 함께 보입니다. 효모와 가성균사의 조합을 점막 감염과 연결하면 Candida가 적절합니다.",
   "치밀한 집락의 주변부가 방사상으로 퍼지고, 주위를 화농성 염증세포가 둘러쌉니다. 이 sulfur granule은 Actinomyces 감염의 대표적 형태입니다. Nocardia의 분지성 세균 및 진균의 개별 균사와 조밀한 세균 집락을 구분합니다.",
   "넓은 균사가 접히거나 구불구불하며, 격막이 드물고 불규칙한 둔각 분지를 보입니다. 이 리본형 균사는 Mucorales를 지지하며 혈관 침범은 혈전·괴사를 일으킬 수 있습니다."
  ],
  "imageClue": "치밀한 집락의 주변부가 방사상으로 퍼지고, 주위를 화농성 염증세포가 둘러쌉니다.",
  "coreFact": "이 sulfur granule은 Actinomyces 감염의 대표적 형태입니다.",
  "contrast": "Nocardia의 분지성 세균 및 진균의 개별 균사와 조밀한 세균 집락을 구분합니다.",
  "explanation": "치밀한 집락의 주변부가 방사상으로 퍼지고, 주위를 화농성 염증세포가 둘러쌉니다. 이 sulfur granule은 Actinomyces 감염의 대표적 형태입니다. Nocardia의 분지성 세균 및 진균의 개별 균사와 조밀한 세균 집락을 구분합니다.",
  "keyClue": "치밀한 집락의 주변부가 방사상으로 퍼지고, 주위를 화농성 염증세포가 둘러쌉니다.",
  "studyFocus": "솜뭉치·방사상 집락 / 만성 화농·섬유화 / 대표 A. israelii",
  "sourceRefs": [
   {
    "doc": "path2",
    "pages": [
     29,
     30
    ]
   },
   {
    "doc": "lab",
    "pages": [
     26,
     27
    ]
   }
  ],
  "examRefs": [
   "2022 41번"
  ],
  "refs": [],
  "pages": [
   29,
   30
  ],
  "externalRefs": [
   {
    "title": "서울대학교 병리교육 라이브러리",
    "url": "https://pathedu.snu.ac.kr/library"
   }
  ]
 },
 {
  "id": "path-edu-v2-aspergillus",
  "topic": "path-image",
  "format": "mcq",
  "kind": "integrated",
  "ask": "organism",
  "stem": "항암치료 후 호중구감소가 지속되는 환자의 폐 조직이다. H&E와 GMS 사진에서 보이는 병원체는?",
  "photos": [
   "edu-14",
   "edu-15"
  ],
  "choices": [
   "Candida spp.",
   "Cryptococcus spp.",
   "Mucorales",
   "Pneumocystis jirovecii",
   "Aspergillus spp."
  ],
  "answer": 4,
  "choiceNotes": [
   "타원형 효모가 출아하고, 길게 이어진 가성균사가 함께 보입니다. 효모와 가성균사의 조합을 점막 감염과 연결하면 Candida가 적절합니다.",
   "투명한 halo를 두른 둥근 효모가 보이고, GMS에서도 효모 형태가 강조됩니다. 피막성 효모와 폐·중추신경계 감염을 연결하면 Cryptococcus가 적절합니다.",
   "넓은 균사가 접히거나 구불구불하며, 격막이 드물고 불규칙한 둔각 분지를 보입니다. 이 리본형 균사는 Mucorales를 지지하며 혈관 침범은 혈전·괴사를 일으킬 수 있습니다.",
   "폐포 공간에 거품성 물질이 차고, GMS에서 검은 컵·반달 모양의 낭이 보입니다. 면역저하 폐렴에서 이 조합은 Pneumocystis jirovecii의 단서입니다.",
   "비교적 가는 균사에 격막이 보이고, 예각으로 가지를 칩니다. 격막성 균사와 예각 분지는 Aspergillus의 핵심 감별점입니다. Mucorales는 더 넓고 불규칙하며 격막이 드뭅니다. 혈관 침범은 두 군 모두 가능합니다."
  ],
  "imageClue": "비교적 가는 균사에 격막이 보이고, 예각으로 가지를 칩니다.",
  "coreFact": "격막성 균사와 예각 분지는 Aspergillus의 핵심 감별점입니다.",
  "contrast": "Mucorales는 더 넓고 불규칙하며 격막이 드뭅니다. 혈관 침범은 두 군 모두 가능합니다.",
  "explanation": "비교적 가는 균사에 격막이 보이고, 예각으로 가지를 칩니다. 격막성 균사와 예각 분지는 Aspergillus의 핵심 감별점입니다. Mucorales는 더 넓고 불규칙하며 격막이 드뭅니다. 혈관 침범은 두 군 모두 가능합니다.",
  "keyClue": "비교적 가는 균사에 격막이 보이고, 예각으로 가지를 칩니다.",
  "studyFocus": "가는 격막성 균사·예각 ↔ 넓고 불규칙한 균사·드문 격막",
  "sourceRefs": [
   {
    "doc": "path2",
    "pages": [
     37,
     41
    ]
   },
   {
    "doc": "lab",
    "pages": [
     29,
     33,
     34
    ]
   }
  ],
  "examRefs": [],
  "refs": [],
  "pages": [
   37,
   41
  ],
  "externalRefs": [
   {
    "title": "서울대학교 병리교육 라이브러리",
    "url": "https://pathedu.snu.ac.kr/library"
   }
  ]
 },
 {
  "id": "path-edu-v2-mucorales",
  "topic": "path-image",
  "format": "mcq",
  "kind": "integrated",
  "ask": "organism",
  "stem": "당뇨가 조절되지 않는 환자에게 장 괴사가 발생했다. 절제 조직의 GMS 사진에서 보이는 병원체군은?",
  "photos": [
   "edu-17",
   "p20"
  ],
  "choices": [
   "Mucorales",
   "Aspergillus spp.",
   "Candida spp.",
   "Cryptococcus spp.",
   "Pneumocystis jirovecii"
  ],
  "answer": 0,
  "choiceNotes": [
   "넓은 균사가 접히거나 구불구불하며, 격막이 드물고 불규칙한 둔각 분지를 보입니다. 이 리본형 균사는 Mucorales를 지지하며 혈관 침범은 혈전·괴사를 일으킬 수 있습니다. Aspergillus의 가는 격막성 균사와 비교합니다. 혈관 침범 자체는 단독 감별점이 아닙니다.",
   "비교적 가는 균사에 격막이 보이고, 예각으로 가지를 칩니다. 격막성 균사와 예각 분지는 Aspergillus의 핵심 감별점입니다.",
   "타원형 효모가 출아하고, 길게 이어진 가성균사가 함께 보입니다. 효모와 가성균사의 조합을 점막 감염과 연결하면 Candida가 적절합니다.",
   "투명한 halo를 두른 둥근 효모가 보이고, GMS에서도 효모 형태가 강조됩니다. 피막성 효모와 폐·중추신경계 감염을 연결하면 Cryptococcus가 적절합니다.",
   "폐포 공간에 거품성 물질이 차고, GMS에서 검은 컵·반달 모양의 낭이 보입니다. 면역저하 폐렴에서 이 조합은 Pneumocystis jirovecii의 단서입니다."
  ],
  "imageClue": "넓은 균사가 접히거나 구불구불하며, 격막이 드물고 불규칙한 둔각 분지를 보입니다.",
  "coreFact": "이 리본형 균사는 Mucorales를 지지하며 혈관 침범은 혈전·괴사를 일으킬 수 있습니다.",
  "contrast": "Aspergillus의 가는 격막성 균사와 비교합니다. 혈관 침범 자체는 단독 감별점이 아닙니다.",
  "explanation": "넓은 균사가 접히거나 구불구불하며, 격막이 드물고 불규칙한 둔각 분지를 보입니다. 이 리본형 균사는 Mucorales를 지지하며 혈관 침범은 혈전·괴사를 일으킬 수 있습니다. Aspergillus의 가는 격막성 균사와 비교합니다. 혈관 침범 자체는 단독 감별점이 아닙니다.",
  "keyClue": "넓은 균사가 접히거나 구불구불하며, 격막이 드물고 불규칙한 둔각 분지를 보입니다.",
  "studyFocus": "넓은 균사·드문 격막·둔각 / 당뇨·혈관 침범·허혈성 괴사",
  "sourceRefs": [
   {
    "doc": "path2",
    "pages": [
     37,
     42
    ]
   },
   {
    "doc": "lab",
    "pages": [
     35,
     36,
     38
    ]
   }
  ],
  "examRefs": [
   "2022 36번",
   "2021 13번",
   "2022 5번"
  ],
  "refs": [],
  "pages": [
   37,
   42
  ],
  "externalRefs": [
   {
    "title": "서울대학교 병리교육 라이브러리",
    "url": "https://pathedu.snu.ac.kr/library"
   }
  ]
 },
 {
  "id": "path-edu-v2-candida",
  "topic": "path-image",
  "format": "mcq",
  "kind": "integrated",
  "ask": "organism",
  "stem": "질 가려움과 분비물로 내원한 환자의 자궁경부·질 세포진이다. 사진 속 병원체는?",
  "photos": [
   "p21"
  ],
  "choices": [
   "Cryptococcus spp.",
   "Candida spp.",
   "Aspergillus spp.",
   "Mucorales",
   "Pneumocystis jirovecii"
  ],
  "answer": 1,
  "choiceNotes": [
   "투명한 halo를 두른 둥근 효모가 보이고, GMS에서도 효모 형태가 강조됩니다. 피막성 효모와 폐·중추신경계 감염을 연결하면 Cryptococcus가 적절합니다.",
   "타원형 효모가 출아하고, 길게 이어진 가성균사가 함께 보입니다. 효모와 가성균사의 조합을 점막 감염과 연결하면 Candida가 적절합니다. Cryptococcus의 피막성 효모와 구분하며 이 형태만으로 Candida의 종을 확정하지 않습니다.",
   "비교적 가는 균사에 격막이 보이고, 예각으로 가지를 칩니다. 격막성 균사와 예각 분지는 Aspergillus의 핵심 감별점입니다.",
   "넓은 균사가 접히거나 구불구불하며, 격막이 드물고 불규칙한 둔각 분지를 보입니다. 이 리본형 균사는 Mucorales를 지지하며 혈관 침범은 혈전·괴사를 일으킬 수 있습니다.",
   "폐포 공간에 거품성 물질이 차고, GMS에서 검은 컵·반달 모양의 낭이 보입니다. 면역저하 폐렴에서 이 조합은 Pneumocystis jirovecii의 단서입니다."
  ],
  "imageClue": "타원형 효모가 출아하고, 길게 이어진 가성균사가 함께 보입니다.",
  "coreFact": "효모와 가성균사의 조합을 점막 감염과 연결하면 Candida가 적절합니다.",
  "contrast": "Cryptococcus의 피막성 효모와 구분하며 이 형태만으로 Candida의 종을 확정하지 않습니다.",
  "explanation": "타원형 효모가 출아하고, 길게 이어진 가성균사가 함께 보입니다. 효모와 가성균사의 조합을 점막 감염과 연결하면 Candida가 적절합니다. Cryptococcus의 피막성 효모와 구분하며 이 형태만으로 Candida의 종을 확정하지 않습니다.",
  "keyClue": "타원형 효모가 출아하고, 길게 이어진 가성균사가 함께 보입니다.",
  "studyFocus": "점막 감염 / 출아 효모 + pseudohyphae",
  "sourceRefs": [
   {
    "doc": "path2",
    "pages": [
     37,
     43
    ]
   },
   {
    "doc": "lab",
    "pages": [
     39,
     40
    ]
   }
  ],
  "examRefs": [
   "2021 18번",
   "2022 77번"
  ],
  "refs": [],
  "pages": [
   37,
   43
  ],
  "externalRefs": [
   {
    "title": "서울대학교 병리교육 라이브러리",
    "url": "https://pathedu.snu.ac.kr/library"
   }
  ]
 },
 {
  "id": "path-edu-v2-cryptococcus",
  "topic": "path-image",
  "format": "mcq",
  "kind": "integrated",
  "ask": "organism",
  "stem": "면역억제 치료 중인 환자에게 폐 병변과 두통이 생겼다. 조직의 H&E와 GMS 사진에서 보이는 병원체는?",
  "photos": [
   "edu-20",
   "edu-21"
  ],
  "choices": [
   "Candida spp.",
   "Pneumocystis jirovecii",
   "Cryptococcus spp.",
   "Aspergillus spp.",
   "Mucorales"
  ],
  "answer": 2,
  "choiceNotes": [
   "타원형 효모가 출아하고, 길게 이어진 가성균사가 함께 보입니다. 효모와 가성균사의 조합을 점막 감염과 연결하면 Candida가 적절합니다.",
   "폐포 공간에 거품성 물질이 차고, GMS에서 검은 컵·반달 모양의 낭이 보입니다. 면역저하 폐렴에서 이 조합은 Pneumocystis jirovecii의 단서입니다.",
   "투명한 halo를 두른 둥근 효모가 보이고, GMS에서도 효모 형태가 강조됩니다. 피막성 효모와 폐·중추신경계 감염을 연결하면 Cryptococcus가 적절합니다. Candida는 가성균사를, Pneumocystis는 폐포 내 거품성 물질과 오목한 낭을 비교합니다.",
   "비교적 가는 균사에 격막이 보이고, 예각으로 가지를 칩니다. 격막성 균사와 예각 분지는 Aspergillus의 핵심 감별점입니다.",
   "넓은 균사가 접히거나 구불구불하며, 격막이 드물고 불규칙한 둔각 분지를 보입니다. 이 리본형 균사는 Mucorales를 지지하며 혈관 침범은 혈전·괴사를 일으킬 수 있습니다."
  ],
  "imageClue": "투명한 halo를 두른 둥근 효모가 보이고, GMS에서도 효모 형태가 강조됩니다.",
  "coreFact": "피막성 효모와 폐·중추신경계 감염을 연결하면 Cryptococcus가 적절합니다.",
  "contrast": "Candida는 가성균사를, Pneumocystis는 폐포 내 거품성 물질과 오목한 낭을 비교합니다.",
  "explanation": "투명한 halo를 두른 둥근 효모가 보이고, GMS에서도 효모 형태가 강조됩니다. 피막성 효모와 폐·중추신경계 감염을 연결하면 Cryptococcus가 적절합니다. Candida는 가성균사를, Pneumocystis는 폐포 내 거품성 물질과 오목한 낭을 비교합니다.",
  "keyClue": "투명한 halo를 두른 둥근 효모가 보이고, GMS에서도 효모 형태가 강조됩니다.",
  "studyFocus": "피막성 출아 효모 / macrophage·폐·수막염",
  "sourceRefs": [
   {
    "doc": "path2",
    "pages": [
     37,
     44
    ]
   },
   {
    "doc": "lab",
    "pages": [
     41,
     42,
     44,
     45
    ]
   }
  ],
  "examRefs": [
   "2023 25번",
   "2020 10번"
  ],
  "refs": [],
  "pages": [
   37,
   44
  ],
  "externalRefs": [
   {
    "title": "서울대학교 병리교육 라이브러리",
    "url": "https://pathedu.snu.ac.kr/library"
   }
  ]
 },
 {
  "id": "path-edu-v2-pneumocystis",
  "topic": "path-image",
  "format": "mcq",
  "kind": "integrated",
  "ask": "organism",
  "stem": "HIV 환자에게 마른기침과 호흡곤란이 생겼다. 폐 H&E와 기관지세척액 GMS 사진의 원인 병원체는?",
  "photos": [
   "edu-23",
   "p24"
  ],
  "choices": [
   "Cryptococcus spp.",
   "Candida spp.",
   "Aspergillus spp.",
   "Pneumocystis jirovecii",
   "Mucorales"
  ],
  "answer": 3,
  "choiceNotes": [
   "투명한 halo를 두른 둥근 효모가 보이고, GMS에서도 효모 형태가 강조됩니다. 피막성 효모와 폐·중추신경계 감염을 연결하면 Cryptococcus가 적절합니다.",
   "타원형 효모가 출아하고, 길게 이어진 가성균사가 함께 보입니다. 효모와 가성균사의 조합을 점막 감염과 연결하면 Candida가 적절합니다.",
   "비교적 가는 균사에 격막이 보이고, 예각으로 가지를 칩니다. 격막성 균사와 예각 분지는 Aspergillus의 핵심 감별점입니다.",
   "GMS에서 검은 컵·반달 모양의 낭이 보입니다. Pneumocystis는 면역저하 폐렴과 폐포 내 거품성 삼출물, GMS 양성 낭을 연결합니다. 검은 구조는 숙주 폐세포의 핵이 아니라 병원체의 낭이며 피막성 출아 효모와 구분합니다.",
   "넓은 균사가 접히거나 구불구불하며, 격막이 드물고 불규칙한 둔각 분지를 보입니다. 이 리본형 균사는 Mucorales를 지지하며 혈관 침범은 혈전·괴사를 일으킬 수 있습니다."
  ],
  "imageClue": "GMS에서 검은 컵·반달 모양의 낭이 보입니다.",
  "coreFact": "Pneumocystis는 면역저하 폐렴과 폐포 내 거품성 삼출물, GMS 양성 낭을 연결합니다.",
  "contrast": "검은 구조는 숙주 폐세포의 핵이 아니라 병원체의 낭이며 피막성 출아 효모와 구분합니다.",
  "explanation": "GMS에서 검은 컵·반달 모양의 낭이 보입니다. Pneumocystis는 면역저하 폐렴과 폐포 내 거품성 삼출물, GMS 양성 낭을 연결합니다. 검은 구조는 숙주 폐세포의 핵이 아니라 병원체의 낭이며 피막성 출아 효모와 구분합니다.",
  "keyClue": "GMS에서 검은 컵·반달 모양의 낭이 보입니다.",
  "studyFocus": "AIDS·폐포 거품성 삼출물 / GMS의 낭 형태",
  "sourceRefs": [
   {
    "doc": "path2",
    "pages": [
     45
    ]
   },
   {
    "doc": "lab",
    "pages": [
     46,
     47,
     48,
     49
    ]
   }
  ],
  "examRefs": [
   "2022 75번",
   "2020 17번",
   "2023 18번"
  ],
  "refs": [],
  "pages": [
   45
  ],
  "externalRefs": [
   {
    "title": "서울대학교 병리교육 라이브러리",
    "url": "https://pathedu.snu.ac.kr/library"
   }
  ]
 }
].map(question=>Object.freeze(question)));

libraryPhotoCandidates['edu-01-detail']={...libraryPhotoCandidates['edu-01'],src:'assets/pathology/edu-01-detail.webp',caption:'피부 조직 · 고배율',width:900,height:600};
export const PATHEDU_PHOTOS=Object.fromEntries([...new Set(PATHEDU_QUESTIONS.flatMap(q=>q.photos))].filter(id=>id.startsWith('edu-')).map(id=>[id,libraryPhotoCandidates[id]]));
