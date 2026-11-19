import {buildStatementQuestions} from './statement-bank.mjs?v=20261120a';
// Summary comparisons are ordinary lecture practice and share the same records.
export const SUMMARY_DOCUMENTS={
  "notes_general": {
    "title": "내 정리본: 감염·약리·병리·예방",
    "pages": 19
  },
  "notes_bacteria": {
    "title": "내 정리본: 세균·진균",
    "pages": 24
  },
  "notes_virus": {
    "title": "내 정리본: 바이러스",
    "pages": 20
  },
  "261117_01": {
    "title": "랍도바이러스·지발감염",
    "pages": 69
  },
  "261117_02": {
    "title": "파필로마바이러스·폴리오마바이러스",
    "pages": 25
  },
  "261117_03": {
    "title": "레트로바이러스",
    "pages": 19
  }
};
export const SUMMARY_COMPARISONS=[
  {
    "id": "lecture-summary-general-urine-count-clinical-context",
    "lecture": "261102_03",
    "topic": "261102_03",
    "kind": "case",
    "format": "mcq",
    "stem": "배뇨통·빈뇨와 농뇨가 있는 여성의 청결 중간뇨에서 E. coli가 단일 균종으로 10³ CFU/mL 검출되었다. 강의의 요배양 판독표에 따른 해석은?",
    "choices": [
      "무증상 세균뇨 기준 충족",
      "증상성 방광염을 지지 가능",
      "다균종 오염을 우선 시사",
      "유의한 세균뇨의 균수 기준 미달",
      "균혈증 동반 요로감염을 시사"
    ],
    "answer": 1,
    "explanation": "요배양의 유의한 균수는 증상·환자·채취법에 따라 다르다. 강의 표는 증상 있는 여성 방광염에서 10² CFU/mL를 넘는 균수도 감염을 지지할 수 있다고 구분한다. 따라서 10⁵ 미만이라는 이유로 이 결과를 오염으로 처리할 수 없다.",
    "choiceNotes": [
      "배뇨통·빈뇨가 있어 무증상 세균뇨의 임상 상황과 다르다.",
      "증상 있는 여성의 단일 균종 저균수 배양도 방광염을 뒷받침할 수 있다.",
      "단일 E. coli가 검출되었으므로 다균종 오염 소견으로 바꾸어 해석하지 않는다.",
      "증상 있는 여성 방광염은 무증상 중간뇨의 10⁵ 기준과 구별한다.",
      "소변 배양만으로 균혈증 동반 여부를 판단하지 않는다."
    ],
    "keyClue": "같은 중간뇨라도 무증상 여부와 감염 증후군에 따라 판독 기준이 달라진다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          2
        ]
      },
      {
        "doc": "261102_03",
        "pages": [
          29,
          31,
          32
        ]
      }
    ],
    "pages": [
      2
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "검체해석",
      "요배양",
      "조건부기준"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261102_03-ext-midstream",
        "lecture-integrated-urinary-cocci"
      ],
      "reason": "기존의 중간뇨 채취법·방광염 원인균 문제와 달리, 단일 균종의 낮은 균수를 증상 있는 여성이라는 조건에서 판독한다. 10⁵ 기준을 기계적으로 적용하는 오류가 새 판단축이다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-sputum-neutropenia-host-response",
    "lecture": "261102_03",
    "topic": "261102_03",
    "kind": "case",
    "format": "mcq",
    "stem": "호중구가 70/mm³인 폐렴 의심 환자의 호흡기 검체에서 백혈구가 적다. 편평상피세포가 많다는 소견은 제시되지 않았다. 가장 타당한 해석은?",
    "choices": [
      "백혈구 부족을 침 오염의 단독 근거로 삼는다.",
      "백혈구 부족을 세균성 폐렴의 배제 근거로 삼는다.",
      "균이 보이면 백혈구 수와 관계없이 원인균으로 확정한다.",
      "숙주 호중구감소가 염증세포 부족에 기여할 수 있다.",
      "호중구감소는 검체의 편평상피세포를 증가시킨다."
    ],
    "answer": 3,
    "explanation": "검체의 질과 숙주 염증반응은 서로 다른 축이다. 침 오염은 편평상피세포 등으로 평가하며, 심한 호중구감소에서는 감염이 있어도 염증세포와 징후가 적을 수 있다. 백혈구가 적다는 정보만으로 오염이나 비감염을 확정하지 않는다.",
    "choiceNotes": [
      "침 오염 여부는 편평상피세포와 채취 상황 등을 함께 보아야 한다.",
      "호중구가 부족하면 감염의 염증반응도 약할 수 있다.",
      "관찰된 균에는 오염균·상재균도 포함될 수 있다.",
      "검체 소견에 숙주의 실제 호중구 수를 결합한 해석이다.",
      "호중구감소 자체가 구강 편평상피세포 오염을 뜻하지 않는다."
    ],
    "keyClue": "검체 오염의 지표와 면역저하에 따른 약한 염증반응을 분리한다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          1,
          13
        ]
      },
      {
        "doc": "261102_03",
        "pages": [
          27,
          28
        ]
      },
      {
        "doc": "261118_02",
        "pages": [
          11,
          19
        ]
      }
    ],
    "pages": [
      1,
      13
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "검체해석",
      "숙주인자",
      "호중구감소"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261102_03-ext-sputum-good",
        "lecture-261102_03-ext-saliva-core2",
        "lecture-statement-261118_02-03"
      ],
      "reason": "기존 객담 문항은 면역 정상에서 상피세포·백혈구 조합을 판별했다. 새 문항은 심한 호중구감소를 추가하여 백혈구 부족을 침 오염으로 오인할 수 없는 예외 조건을 통합한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-febrile-infant-virus-bag-two-limits",
    "lecture": "261113_02",
    "topic": "261113_02",
    "kind": "case",
    "format": "mcq",
    "stem": "생후 18일 발열 영아의 RSV 검사가 양성이고, 부착형 소변백 배양에서도 세균이 검출되었다. 두 결과의 한계를 바르게 연결한 것은?",
    "choices": [
      "RSV: SBI 배제 불가 / 소변백 양성: UTI 확진 불가",
      "RSV: SBI 배제 가능 / 소변백 양성: UTI 확진 불가",
      "RSV: SBI 배제 불가 / 소변백 양성: UTI 확진 가능",
      "RSV: SBI 배제 가능 / 소변백 양성: UTI 확진 가능",
      "RSV: SBI 배제 불가 / 소변백 양성: UTI 배제 가능"
    ],
    "answer": 0,
    "explanation": "어린 영아의 바이러스 양성은 세균감염 위험을 낮출 수 있지만 없애지는 않는다. 소변백은 오염 가능성이 커서 양성 배양만으로 UTI를 확진할 수 없다. 연령에 맞는 SBI 평가와 도뇨 등 적절한 방법으로 얻은 소변 검체의 확인이 필요하다.",
    "choiceNotes": [
      "바이러스 동시감염 가능성과 소변백 오염 가능성을 각각 반영한다.",
      "RSV 양성만으로 신생아의 SBI를 배제할 수 없다.",
      "부착형 소변백의 양성 결과는 오염 여부를 확인해야 한다.",
      "두 검사 모두 단독으로 그와 같은 확정적 결론을 내리지 못한다.",
      "양성 소변백 배양은 UTI를 배제하는 결과도 아니다."
    ],
    "keyClue": "바이러스 양성의 배제 한계와 오염되기 쉬운 검체 양성의 확진 한계가 다르다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          11
        ]
      },
      {
        "doc": "261113_02",
        "pages": [
          12,
          16,
          18
        ]
      }
    ],
    "pages": [
      11
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "소아감염",
      "검체오염",
      "SBI"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261113_02-ext-uti",
        "lecture-261113_02-ext-rsv",
        "lecture-261102_03-ext-midstream"
      ],
      "reason": "기존 RSV 원인체·영아 SBI 부위 문제에 없던 두 검사 한계의 동시 해석이다. 신생아라는 고위험 조건에서 양성 바이러스 검사도, 부적절한 소변 검체 양성도 단독 결론이 될 수 없음을 묻는다."
    },
    "externalRefs": [
      {
        "title": "Canadian Paediatric Society: Management of well-appearing febrile young infants aged ≤90 days",
        "url": "https://cps.ca/en/documents/position/management-of-well-appearing-febrile-young-infants-aged-90-days"
      }
    ],
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-candida-specimen-tissue-evidence",
    "lecture": "261104_05",
    "topic": "261104_05",
    "kind": "case",
    "format": "mcq",
    "stem": "A는 객담에서 Candida가 배양되었을 뿐 폐 조직 침범 근거가 없다. B는 연하통과 식도 백색 병변이 있고, 생검에서 효모·가성균사의 점막 침범이 보인다. 더 타당한 해석은?",
    "choices": [
      "A·B 모두 배양 균수만으로 침습 여부를 정한다.",
      "A는 폐칸디다증 확진, B는 상재균 소견이다.",
      "A·B 모두 같은 의미의 침습성 폐 감염이다.",
      "A는 감염, B는 집락으로 먼저 해석한다.",
      "A는 집락 가능성, B는 식도칸디다증을 지지한다."
    ],
    "answer": 4,
    "explanation": "같은 Candida 검출이라도 검체와 조직 침범 근거에 따라 의미가 다르다. 객담 검출 단독은 폐칸디다증을 입증하지 못한다. 반면 증상 있는 식도 병변의 점막 침범은 해당 부위의 칸디다 감염을 뒷받침한다.",
    "choiceNotes": [
      "검체 부위·증상·조직 침범을 균수 하나로 대체할 수 없다.",
      "객담 양성만으로 폐 감염을 확정하지 않으며 B에는 점막 침범 근거가 있다.",
      "B의 병변은 식도이고, A에는 폐 조직 침범 증거가 없다.",
      "검출과 조직 침범의 증거 강도를 반대로 연결했다.",
      "호흡기 배양 결과와 병변에서 확인한 조직 침범을 구별한다."
    ],
    "keyClue": "병원체 이름보다 검체의 부위와 실제 조직 침범 증거가 감염 해석을 바꾼다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          6,
          8
        ]
      },
      {
        "doc": "261104_05",
        "pages": [
          39,
          40
        ]
      },
      {
        "doc": "261116_05",
        "pages": [
          9,
          23,
          25,
          27
        ]
      }
    ],
    "pages": [
      6,
      8
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "병리",
      "검체해석",
      "Candida"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-statement-261116_05-07",
        "lecture-261104_05-05",
        "lecture-261116_05-nov-oral-smear",
        "lecture-261116_05-nov-sputum-colonization"
      ],
      "reason": "기존 객담 Candida 단독해석과 가성균사 형태 문제를 합쳐, 같은 균 검출을 두 장기에서 다르게 판단하는 근거의 차이를 새로 묻는다. B의 증상 및 점막 침범을 추가해 모든 Candida를 집락으로 처리하는 반대 오류도 함께 판별한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-two-compartments-csf-intracellular",
    "lecture": "261102_05",
    "topic": "261102_05",
    "kind": "basic",
    "format": "mcq",
    "stem": "동일하게 시험관 내 감수성이 확인되었더라도 수막염과 장티푸스에서는 약물 도달 부위를 다르게 검토한다. 각각의 우선 확인 항목은?",
    "choices": [
      "소변 내 활성 농도 / 뇌척수액 이행",
      "뇌척수액 이행 / 세포 내 유효 농도",
      "세포 내 유효 농도 / 소변 내 활성 농도",
      "혈청 반감기 / 장관 내 국소 잔류",
      "장관 내 국소 잔류 / 뇌척수액 이행"
    ],
    "answer": 1,
    "explanation": "수막염에서는 혈액뇌장벽을 넘어 뇌척수액에서 유효 농도를 확보해야 한다. Salmonella Typhi는 세포 내 감염이라는 특성이 있어 세포 내 약물 농도가 중요하다. 시험관 내 감수성 결과가 각 구획의 약물 도달을 대신하지 않는다.",
    "choiceNotes": [
      "수막염과 장티푸스의 핵심 구획을 각각 잘못 연결했다.",
      "수막염의 혈액뇌장벽과 장티푸스의 세포 내 위치를 구별한다.",
      "수막염에서 먼저 검토할 구획은 CSF이며 장티푸스는 요로감염이 아니다.",
      "반감기는 고려 요소지만 이 비교의 핵심은 서로 다른 감염 구획이다.",
      "장내 국소 잔류만으로 침습성 장티푸스의 세포 내 감염을 해결하지 못한다."
    ],
    "keyClue": "감수성 결과에 감염 부위와 세포 내·외 위치를 함께 붙인다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          2,
          3
        ]
      },
      {
        "doc": "261102_05",
        "pages": [
          26,
          27,
          30,
          31,
          32
        ]
      }
    ],
    "pages": [
      2,
      3
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "항생제분포",
      "감염구획",
      "PK/PD"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261102_05-ext-concentration",
        "lecture-statement-261102_05-10",
        "cases-03-r3"
      ],
      "reason": "기존 CSF 이행이나 약물동태의 단일 정의와 달리, 두 전신 감염의 서로 다른 약물 구획을 직접 대비한다. 같은 S 판정이 두 구획에서 동일한 치료 적합성을 뜻하지 않는다는 추가 조건을 학습한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-oral-route-local-versus-systemic",
    "lecture": "261102_05",
    "topic": "261102_05",
    "kind": "case",
    "format": "mcq",
    "stem": "A는 C. difficile 대장염에 경구 vancomycin을, B는 감수성이 확인된 VRE 전신감염에 경구 linezolid를 사용한다. 경구 투여가 성립하는 주된 약동학적 이유를 연결하면?",
    "choices": [
      "A 높은 전신 흡수 / B 낮은 전신 흡수",
      "A 높은 CSF 이행 / B 장내 국소 잔류",
      "A 장내 국소 노출 / B 높은 전신 흡수",
      "A 신장 배설 / B 낮은 세포 내 농도",
      "A 높은 전신 흡수 / B 장내 국소 잔류"
    ],
    "answer": 2,
    "explanation": "경구 vancomycin은 흡수가 매우 낮아 장내 국소 작용에는 사용할 수 있지만 균혈증의 경구 대체제가 되지 못한다. Linezolid는 경구 생체이용률이 높아 감수성인 전신 감염에서 경구로도 전신 노출을 얻을 수 있다. 같은 경구 경로라도 목표 구획이 다르다.",
    "choiceNotes": [
      "Vancomycin의 낮은 경구 흡수와 linezolid의 높은 흡수를 반대로 놓았다.",
      "A의 표적은 장관이며 B의 전신 효과는 흡수로 설명한다.",
      "장관 국소 치료와 전신 감염 치료에서 필요한 노출을 구분했다.",
      "경구 투여가 가능한 이유를 각 약제의 목표 구획과 연결하지 못한다.",
      "Vancomycin을 전신 흡수 약으로, linezolid를 장내 잔류 약으로 바꾸었다."
    ],
    "keyClue": "경구로 투여한다는 사실만으로 전신 흡수가 높다고 해석하지 않는다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          3,
          10
        ]
      },
      {
        "doc": "261102_05",
        "pages": [
          39,
          40
        ]
      },
      {
        "doc": "261109_05",
        "pages": [
          64,
          65
        ]
      }
    ],
    "pages": [
      3,
      10
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "투여경로",
      "생체이용률",
      "국소전신"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "cases-11-r3",
        "oral-07-r3",
        "lecture-261109_05-ext-linezolid"
      ],
      "reason": "기존 경구 vancomycin 국소작용과 linezolid 흡수 사실을 서로 다른 치료 구획에 적용하는 비교이다. 경구 사용 가능성과 전신 흡수 가능성을 동일시할 수 없다는 새 관계를 묻는다."
    },
    "externalRefs": [
      {
        "title": "IDSA/SHEA Clinical Practice Guidelines for C. difficile Infection, 2021 focused update",
        "url": "https://www.idsociety.org/practice-guideline/clostridioides-difficile-2021-focused-update/"
      }
    ],
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-csf-versus-oral-availability-matrix",
    "lecture": "261102_05",
    "topic": "261102_05",
    "kind": "basic",
    "format": "mcq",
    "stem": "Ceftriaxone을 수막염에 정주하는 것과 ciprofloxacin을 안정된 감수성 요로감염에서 경구로 전환하는 것은 다른 약물 특성을 활용한다. 순서대로 맞는 것은?",
    "choices": [
      "높은 경구 흡수 / 낮은 요중 농도",
      "낮은 CSF 이행 / 높은 경구 흡수",
      "높은 CSF 이행 / 낮은 경구 흡수",
      "높은 CSF 이행 / 높은 경구 흡수",
      "낮은 CSF 이행 / 낮은 경구 흡수"
    ],
    "answer": 3,
    "explanation": "Ceftriaxone의 수막염 사용은 CSF로의 이행이라는 분포 특성과 연결한다. Ciprofloxacin의 경구 전환은 경구 흡수와 생체이용률이 높다는 특성이다. 조직 이행과 장관 흡수는 서로 다른 약동학적 단계이다.",
    "choiceNotes": [
      "Ceftriaxone은 경구 흡수가 좋아서 수막염에 쓰는 약제가 아니다.",
      "Ceftriaxone의 수막염 선택 이유는 CSF 이행이 좋기 때문이다.",
      "Ciprofloxacin은 경구 생체이용률이 높은 쪽에 속한다.",
      "분포와 흡수라는 두 독립된 약동학적 특성을 바르게 연결했다.",
      "두 약제를 선택하는 장점을 각각 반대로 적었다."
    ],
    "keyClue": "감염부위 분포가 좋다는 말과 경구 흡수가 좋다는 말은 다른 축이다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          2,
          3
        ]
      },
      {
        "doc": "261102_05",
        "pages": [
          27,
          34,
          35,
          39,
          40
        ]
      }
    ],
    "pages": [
      2,
      3
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "항생제분포",
      "생체이용률",
      "PK/PD"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261102_05-ext-oral-switch",
        "lecture-statement-261102_05-07",
        "lecture-statement-261102_05-10"
      ],
      "reason": "기존 경구 전환과 BBB 투과 문제를 약동학의 서로 다른 두 단계로 구별하는 새 비교이다. CSF 이행이 우수하면 경구 제형도 유리할 것이라는 추론 오류를 추가로 시험한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-enzyme-inhibitor-rescue-condition",
    "lecture": "261109_03",
    "topic": "261109_03",
    "kind": "basic",
    "format": "mcq",
    "stem": "KPC 생성균과 mecA 양성 S. aureus의 β-lactam 내성을 비교한다. β-lactamase 억제제를 더하는 전략의 차이를 가장 잘 설명한 것은?",
    "choices": [
      "KPC: 약물 배출 / mecA: 결합 표적 변화",
      "KPC: 분해효소 / mecA: 결합 표적 변화",
      "KPC: 결합 표적 변화 / mecA: 분해효소",
      "KPC: 분해효소 / mecA: 외막 porin 감소",
      "KPC: 외막 porin 감소 / mecA: 분해효소"
    ],
    "answer": 1,
    "explanation": "KPC는 β-lactam을 분해하는 효소이므로 이를 억제하는 avibactam 등의 조합이 해당 기전에서 의미를 가진다. mecA에 의한 PBP2a는 약물 결합 표적의 변화이므로 β-lactamase 억제라는 작용만으로 그 표적을 원래대로 되돌리지 못한다.",
    "choiceNotes": [
      "mecA의 표적 변화는 맞지만 KPC는 약물 배출이 아니라 β-lactam 분해효소이다.",
      "효소를 억제하는 전략과 바뀐 결합 표적의 문제를 구분한다.",
      "KPC와 mecA의 대표 내성 기전을 서로 바꾸었다.",
      "KPC는 분해효소지만 mecA의 표적은 PBP2a이며 그람양성 S. aureus의 외막 porin이 아니다.",
      "두 내성의 대표 기전을 바꾸었다. KPC는 분해효소, mecA는 PBP2a 결합 표적 변화이다."
    ],
    "keyClue": "내성이라는 표현보다 약물이 파괴되는지, 결합 표적이 바뀌었는지를 먼저 구별한다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          9,
          10
        ]
      },
      {
        "doc": "261109_03",
        "pages": [
          18,
          20,
          21,
          22
        ]
      },
      {
        "doc": "261109_05",
        "pages": [
          53,
          58,
          59
        ]
      }
    ],
    "pages": [
      9,
      10
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "내성기전",
      "표적변화",
      "효소억제"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261109_03-ext-mrsa",
        "lecture-261109_03-ext-lactamase",
        "lecture-261109_05-ext-kpc"
      ],
      "reason": "기존에는 mecA·KPC의 기전이나 약제를 각각 물었다. 새 문항은 같은 β-lactam 내성이라도 효소 억제제 추가가 해결할 수 있는 기전이 제한된다는 치료전략의 조건을 비교한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-esbl-urinary-stepdown-condition",
    "lecture": "261109_05",
    "topic": "261109_05",
    "kind": "case",
    "format": "mcq",
    "stem": "ESBL E. coli 신우신염으로 meropenem을 투여한 성인이 호전되었다. 혈역학적으로 안정되고 경구 섭취·흡수가 가능하며 ciprofloxacin 감수성이 확인되었다. 가장 적절한 원칙은?",
    "choices": [
      "ESBL 검출을 기준으로 정주를 유지한다.",
      "Ceftriaxone 감수성만 확인하고 전환한다.",
      "ESBL 음전 여부를 확인하고 전환한다.",
      "해열·경구 섭취를 확인하고 감수성은 생략한다.",
      "약제 감수성·임상 안정·경구 흡수를 함께 본다."
    ],
    "answer": 4,
    "explanation": "ESBL 검출은 모든 계열의 약제 내성을 뜻하지 않는다. 이 증례처럼 요로감염이 호전되고 감수성인 fluoroquinolone을 사용할 수 있으며 경구 흡수 조건도 충족하면 경구 전환을 검토할 수 있다. 중증 초기 치료와 안정 후 표적 치료의 판단을 구분한다.",
    "choiceNotes": [
      "ESBL이라는 내성 표지만으로 감수성인 경구 다른 계열 약제의 사용을 배제하지 않는다.",
      "전환하려는 경구약 자체의 감수성과 감염 부위 도달을 확인해야 한다.",
      "경구 전환의 기준은 내성 유전자·효소의 음전이 아니라 약제 감수성과 환자의 임상 조건이다.",
      "해열·경구 섭취 외에 사용할 경구약의 감수성도 필요하다.",
      "감수성, 혈역학적 안정, 감염 부위 도달과 충분한 장관 흡수가 전환 판단의 조건이다."
    ],
    "keyClue": "ESBL 여부, 현재 중증도, 감수성, 경구 흡수는 별개로 평가한다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          3,
          10
        ]
      },
      {
        "doc": "261102_05",
        "pages": [
          36,
          39,
          40
        ]
      },
      {
        "doc": "261109_05",
        "pages": [
          46,
          47,
          48,
          51
        ]
      }
    ],
    "pages": [
      3,
      10
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "내성균치료",
      "ESBL",
      "경구전환"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261109_05-ext-esbl-severe",
        "lecture-261102_05-ext-oral-switch"
      ],
      "reason": "기존 중증 ESBL 감염의 meropenem 선택을 반복하지 않고, 초기 치료 후 안정·감수성 확인이라는 시간적 조건이 바뀌었을 때 경구 표적 치료를 검토하는 의사결정을 추가한다."
    },
    "externalRefs": [
      {
        "title": "IDSA 2026 AMR Guidance: Transitioning to Oral Therapy",
        "url": "https://www.idsociety.org/practice-guideline/amr-guidance/"
      }
    ],
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-target-absence-versus-intracellular-access",
    "lecture": "261102_05",
    "topic": "261102_05",
    "kind": "basic",
    "format": "mcq",
    "stem": "M. pneumoniae에 β-lactam이 효과 없는 이유와, 세포 내 S. Typhi에 aminoglycoside를 고르기 어려운 이유를 순서대로 연결하면?",
    "choices": [
      "세포 내 축적 부족 / 세포벽 표적 부재",
      "효소적 분해 / 세포벽 표적 부재",
      "세포벽 표적 부재 / 세포 내 축적 부족",
      "세포막 표적 부재 / 리보솜 표적 부재",
      "리보솜 표적 변화 / 혈액뇌장벽 차단"
    ],
    "answer": 2,
    "explanation": "M. pneumoniae는 세포벽이 없어 β-lactam의 표적이 없다. S. Typhi에 대한 aminoglycoside 선택에서는 시험관 내 감수성뿐 아니라 세포 내 유효 농도 확보가 문제가 된다. 항생제 실패를 표적 부재와 약물 도달 실패로 나누어야 한다.",
    "choiceNotes": [
      "두 원인을 반대로 연결했다.",
      "M. pneumoniae의 본질적인 β-lactam 비효과는 세포벽이 없다는 점이다.",
      "병원체 표적의 존재와 약물의 감염 구획 도달을 구분한다.",
      "M. pneumoniae의 막은 존재하며 S. Typhi에도 리보솜은 존재한다.",
      "제시된 두 상황은 리보솜 변이나 CSF 이행 문제로 설명하지 않는다."
    ],
    "keyClue": "약물이 표적을 못 찾는 경우와 표적이 있는 곳까지 못 가는 경우는 다르다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          3,
          9
        ]
      },
      {
        "doc": "261102_05",
        "pages": [
          30,
          31,
          32
        ]
      },
      {
        "doc": "261105_06",
        "pages": [
          3,
          7
        ]
      }
    ],
    "pages": [
      3,
      9
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "항생제분포",
      "작용표적",
      "Mycoplasma"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261105_06-basic-wall",
        "lecture-261102_05-ext-concentration",
        "lecture-261109_03-ext-betalactam"
      ],
      "reason": "기존 Mycoplasma의 세포벽 부재와 약물 분포 사실을 치료 실패의 서로 다른 원인으로 비교한다. 정리본의 Mycoplasma를 세포 내 기생균으로 한데 묶은 표현도 그대로 답으로 사용하지 않는다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-granuloma-caseation-criterion",
    "lecture": "261104_05",
    "topic": "261104_05",
    "kind": "basic",
    "format": "mcq",
    "stem": "두 생검 모두 epithelioid histiocyte와 Langhans형 거대세포를 보인다. A에는 중심부 치즈양 괴사가 있고 B에는 없다. 건락성과 비건락성을 가르는 직접 소견은?",
    "choices": [
      "거대세포의 존재",
      "조직구의 존재",
      "거대세포의 핵 수",
      "중심부 괴사의 존재",
      "림프구의 존재"
    ],
    "answer": 3,
    "explanation": "육아종은 epithelioid histiocyte의 집합으로 정의한다. 건락성인지 여부는 중심부의 건락괴사로 구분하며, Langhans형 거대세포의 존재 자체가 건락성을 결정하지는 않는다. 이 형태만으로 원인균의 종까지 확정하는 것도 아니다.",
    "choiceNotes": [
      "두 검체에 모두 있으므로 건락성을 나누는 기준이 아니다.",
      "조직구는 두 검체를 육아종으로 분류하는 핵심이다.",
      "거대세포의 핵 수가 건락괴사의 유무를 대신하지 않는다.",
      "괴사의 존재 여부가 두 형태를 직접 구분한다.",
      "림프구는 육아종 주위에 동반될 수 있으나 건락성의 직접 기준은 아니다."
    ],
    "keyClue": "육아종의 구성세포와 육아종 중심의 괴사를 서로 다른 분류축으로 본다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          4,
          8
        ]
      },
      {
        "doc": "261104_02",
        "pages": [
          11,
          14
        ]
      },
      {
        "doc": "261104_05",
        "pages": [
          17,
          18
        ]
      }
    ],
    "pages": [
      4,
      8
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "병리",
      "육아종",
      "건락괴사"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261104_02-08",
        "lecture-statement-261104_02-01"
      ],
      "reason": "기존 육아종 구성세포 문제와 달리 거대세포가 두 병변에 공통으로 있다는 조건을 둔다. 건락성을 Langhans 유무로 판정한 암기카드 오류를 피하고 중심 괴사를 실제 구별축으로 선택한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-aids-foamy-space-versus-cell",
    "lecture": "261104_05",
    "topic": "261104_05",
    "kind": "basic",
    "format": "mcq",
    "stem": "진행된 HIV 감염의 두 검체에서 거품성 모습이 보인다. A는 폐포강의 거품성 삼출물과 GMS 양성 낭 구조, B는 조직구 세포질을 채운 항산균이다. 더 적절한 조합은?",
    "choices": [
      "A MAC / B Pneumocystis",
      "A Cryptococcus / B Candida",
      "A Pneumocystis / B MAC",
      "A Aspergillus / B Mucorales",
      "A Candida / B Cryptococcus"
    ],
    "answer": 2,
    "explanation": "거품성이라는 표현만으로 두 병변을 같게 보지 않는다. PCP에서는 폐포강 안의 거품성 삼출물과 GMS로 보이는 진균 구조가 단서이다. MAC 감염에서는 균이 많은 포말대식세포와 항산염색 양성이 단서이다. 구조의 위치와 염색의 표적을 함께 읽는다.",
    "choiceNotes": [
      "폐포강 삼출물과 균이 찬 조직구를 반대로 연결했다.",
      "A의 낭 구조·거품성 삼출물은 PCP, B의 항산균은 MAC을 지지한다.",
      "거품성 소견의 해부학적 위치와 GMS·AFB의 차이를 함께 반영한다.",
      "A·B에 제시된 구조는 균사형 곰팡이 형태가 아니다.",
      "B의 항산균을 피막성 효모로 해석할 수 없다."
    ],
    "keyClue": "폐포강의 거품성 삼출물과 세포질 안의 포말성 조직구는 다른 소견이다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          8,
          9
        ]
      },
      {
        "doc": "261104_03",
        "pages": [
          23,
          45
        ]
      },
      {
        "doc": "261104_05",
        "pages": [
          19,
          20,
          46,
          48,
          49
        ]
      }
    ],
    "pages": [
      8,
      9
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "병리",
      "HIV",
      "염색비교"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261104_03-04",
        "lecture-261104_05-03"
      ],
      "reason": "기존 MAC·PCP 개별 진단에서 공통으로 혼동할 수 있는 거품성 외형을 출발점으로 삼는다. 같은 HIV 숙주에서 세포 내·폐포강 위치와 특수염색을 교차해 구별하는 관계를 새로 묻는다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-syncytia-inclusion-location-pair",
    "lecture": "261104_02",
    "topic": "261104_02",
    "kind": "basic",
    "format": "mcq",
    "stem": "다핵 융합세포가 보이는 두 검체이다. A는 영아 세기관지염의 세포질 봉입체, B는 기침·결막염 뒤 발진이 생긴 환자의 림프절 핵내 봉입체이다. A와 B는?",
    "choices": [
      "A RSV / B Measles virus",
      "A Adenovirus / B CMV",
      "A HSV / B RSV",
      "A Measles virus / B RSV",
      "A CMV / B Molluscum contagiosum virus"
    ],
    "answer": 0,
    "explanation": "RSV는 영아 세기관지염과 세포질 봉입체, 홍역은 기침·결막염 뒤 발진과 림프절의 다핵 거대세포를 연결한다. 홍역에서는 핵내와 세포질 봉입체가 모두 보일 수 있다. 공통 세포융합 소견에 임상 양상과 봉입체의 위치를 더해 판별한다.",
    "choiceNotes": [
      "영아 세기관지염과 발진·림프절 다핵 거대세포의 임상·형태 소견을 연결한다.",
      "Adenovirus의 대표 봉입체는 핵내 smudge 형태이다.",
      "HSV의 대표 봉입체는 핵내이며 RSV는 세포질 쪽이다.",
      "A의 영아 세기관지염은 RSV, B의 발진·림프절 소견은 홍역에 맞으므로 두 대상을 바꾸었다.",
      "물사마귀의 봉입체는 주로 표피세포 세포질에 있다."
    ],
    "keyClue": "영아 세기관지염·세포질 / 발진·림프절 다핵 거대세포",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          4,
          5
        ]
      },
      {
        "doc": "261104_02",
        "pages": [
          25,
          28,
          29
        ]
      }
    ],
    "pages": [
      4,
      5
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "병리",
      "바이러스",
      "봉입체위치"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261104_02-05",
        "lecture-261104_05-basic-hsv",
        "lecture-261112_02-ext-fusion"
      ],
      "reason": "기존 RSV·HSV 다핵세포 사실을 새로 조합해, 다핵화가 공통일 때 추가 정보인 핵내/세포질 위치가 판별력을 갖는 상황을 묻는다. HSV만의 특이 소견으로 오인하는 조건부 오류를 겨냥한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-viral-rna-versus-host-surrogate-marker",
    "lecture": "261104_03",
    "topic": "261104_03",
    "kind": "basic",
    "format": "mcq",
    "stem": "종양 조직에서 시행한 EBER in situ hybridization과 p16 면역조직화학을 비교한다. 양성 신호가 뜻하는 표적을 순서대로 연결하면?",
    "choices": [
      "숙주 단백질 / HPV DNA",
      "EBV DNA / 숙주 항체",
      "숙주 항체 / EBV RNA",
      "HPV RNA / 바이러스 capsid",
      "EBV RNA / 숙주 세포주기 단백질"
    ],
    "answer": 4,
    "explanation": "EBER ISH는 조직 안의 EBV RNA를 직접 검출한다. p16 면역조직화학은 숙주의 세포주기 조절 단백질 발현을 보며, 적절한 조직·임상 맥락에서 고위험 HPV 연관성의 대리 표지자로 활용한다. p16 염색을 HPV 유전체 직접 검출과 동일시하지 않는다.",
    "choiceNotes": [
      "EBER의 표적은 EBV RNA이고 p16은 숙주 단백질이다.",
      "EBER는 RNA이며 p16 IHC는 혈청 항체검사가 아니다.",
      "ISH와 면역조직화학의 표적을 모두 잘못 연결했다.",
      "두 검사의 바이러스 연관성과 검출 대상을 바꾸었다.",
      "바이러스 핵산의 직접 검출과 숙주 반응 표지자를 구별한다."
    ],
    "keyClue": "바이러스 연관성을 평가하는 검사도 직접 바이러스 표적인지 숙주 대리 표지자인지가 다르다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          5
        ]
      },
      {
        "doc": "261104_03",
        "pages": [
          5,
          6,
          10
        ]
      }
    ],
    "pages": [
      5
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "병리",
      "분자진단",
      "대리표지자"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261104_03-02",
        "lecture-261104_03-09",
        "lecture-statement-261104_03-03"
      ],
      "reason": "기존 EBV↔EBER, HPV↔p16 이름 짝짓기를 반복하지 않는다. 서로 다른 검사법의 신호가 바이러스 RNA 자체인지 숙주 단백질인지 판정하는 증거 수준의 차이를 새로 묻는다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-chemotherapy-two-defense-layers",
    "lecture": "261118_02",
    "topic": "261118_02",
    "kind": "case",
    "format": "mcq",
    "stem": "항암치료 후 심한 구강·장관 점막염과 호중구 60/mm³가 함께 발생했고 Candida 혈증이 확인되었다. 이 감염을 함께 설명하는 방어 결손 조합은?",
    "choices": [
      "위산 장벽 / 보체 C5",
      "점막 장벽 / 탐식세포",
      "소변 흐름 / B림프구",
      "섬모운동 / 비장",
      "정상 피부 / 항체"
    ],
    "answer": 1,
    "explanation": "점막 손상은 상재 Candida가 장벽을 넘어 침입할 통로를 만들고, 호중구감소는 침입한 진균의 제거를 어렵게 한다. 하나의 항암치료가 제1단계 장벽과 제2단계 탐식 방어를 함께 손상시킬 수 있다.",
    "choiceNotes": [
      "위산 억제나 C5 결함이 제시된 점막염·호중구감소를 설명하지 않는다.",
      "침입 통로와 침입 후 제거라는 두 방어 단계가 함께 손상되었다.",
      "이 증례는 요로 흐름이나 항체 생성 장애가 직접 단서가 아니다.",
      "기도 삽관이나 비장절제라는 조건이 없다.",
      "피부가 정상이라는 사실은 손상된 점막과 호중구 결함을 대체하지 못한다."
    ],
    "keyClue": "같은 환자에서 병원체의 장벽 통과와 침입 후 제거가 동시에 손상될 수 있다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          13,
          14
        ]
      },
      {
        "doc": "261118_02",
        "pages": [
          15,
          18,
          20,
          32
        ]
      },
      {
        "doc": "261116_05",
        "pages": [
          19,
          20,
          21
        ]
      }
    ],
    "pages": [
      13,
      14
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "숙주방어",
      "장벽손상",
      "호중구감소"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261118_02-nov18-neutrophil",
        "lecture-261116_05-nov-neutropenic-candidemia",
        "lecture-261116_05-nov-candida-gut-entry"
      ],
      "reason": "기존 호중구감소의 병원체·초치료 선택이나 Candida의 장관 유래 문제와 달리, 점막염을 통한 침입 통로와 침입 후 제거 실패를 두 방어 단계로 분해한다. 같은 항암치료에서 장벽·탐식 방어가 동시에 손상되는 연결이 새 판단이다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-maternal-vaccine-two-recipients-immunity",
    "lecture": "261113_02",
    "topic": "261113_02",
    "kind": "basic",
    "format": "mcq",
    "stem": "임신 중 인플루엔자백신을 맞은 산모가 만든 항체가 태반을 통해 영아에게 전달되었다. 산모와 영아가 얻은 면역을 순서대로 연결하면?",
    "choices": [
      "인공능동 / 자연수동",
      "자연능동 / 인공수동",
      "인공수동 / 자연능동",
      "인공능동 / 인공능동",
      "자연수동 / 인공수동"
    ],
    "answer": 0,
    "explanation": "산모는 백신 항원에 반응해 스스로 항체를 만들므로 인공능동면역을 얻는다. 영아는 모체가 만든 항체를 전달받으므로 자연수동면역을 얻는다. 같은 모체 접종 사건이라도 면역을 획득하는 사람에 따라 분류가 다르다.",
    "choiceNotes": [
      "백신에 직접 반응한 산모와 항체를 전달받은 영아를 구별했다.",
      "산모는 자연감염이 아니라 접종을 받았고 영아에게 항체 제제를 직접 주사한 것도 아니다.",
      "항체를 직접 생성한 사람과 전달받은 사람의 역할을 바꾸었다.",
      "영아는 제시된 과정에서 백신 항원으로 능동 면역을 만든 것이 아니다.",
      "산모는 수동 항체를 받은 것이 아니라 백신에 반응해 항체를 생성했다."
    ],
    "keyClue": "동일한 접종 사건을 산모와 영아의 관점에서 각각 분류한다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          11,
          15
        ]
      },
      {
        "doc": "261113_02",
        "pages": [
          22
        ]
      },
      {
        "doc": "261119_02",
        "pages": [
          5
        ]
      }
    ],
    "pages": [
      11,
      15
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "소아감염",
      "모체접종",
      "능동수동면역"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261119_03-nov19-active-passive-pair"
      ],
      "reason": "기존 백신·면역글로불린의 투여물 분류와 달리, 한 번의 모체 접종이 두 사람에게 서로 다른 획득 방식의 면역을 준다는 수혜자 조건을 추가한다."
    },
    "externalRefs": [
      {
        "title": "ACOG: The Flu Vaccine and Pregnancy",
        "url": "https://www.acog.org/womens-health/faqs/the-flu-vaccine-and-pregnancy"
      }
    ],
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-blood-exposure-hbv-hcv-different-prevention",
    "lecture": "261119_03",
    "topic": "261119_03",
    "kind": "case",
    "format": "mcq",
    "stem": "HBV 백신을 접종받지 않은 의료진에게 두 바늘찔림 상황을 비교한다. A의 감염원은 HBsAg 양성, B의 감염원은 HCV RNA 양성이다. 특이 예방·추적 원칙의 연결은?",
    "choices": [
      "A HBIG 단독 / B HBV 백신",
      "A HBV 백신 단독 / B HBIG",
      "A HBIG+HBV 백신 / B 검사 추적, HCV PEP 없음",
      "A 검사 추적만 / B DAA 예방 투여",
      "A DAA 예방 투여 / B HBIG+HBV 백신"
    ],
    "answer": 2,
    "explanation": "HBV 미접종자가 HBsAg 양성 혈액에 노출되면 HBIG와 HBV 백신이 특이 예방의 축이다. HCV에는 같은 방식의 백신·면역글로불린 예방을 적용하지 않으며, 직업 노출 후 HCV PEP는 권고되지 않아 기초검사와 추적검사로 감염 발생 여부를 확인한다.",
    "choiceNotes": [
      "HBV 미접종자의 능동면역 형성을 빠뜨렸고 HBV 백신은 HCV 특이 예방이 아니다.",
      "HBsAg 양성 감염원 노출에서는 HBIG를 함께 고려하며 HBIG는 HCV 예방제가 아니다.",
      "두 혈행성 바이러스에서 가능한 특이 예방 수단이 다름을 반영한다.",
      "A에는 특이 예방 수단이 있으며 HCV DAA를 노출자에게 일률적 PEP로 사용하지 않는다.",
      "DAA의 HCV 치료 역할과 HBV의 능동·수동 예방 수단을 서로 바꾸었다."
    ],
    "keyClue": "혈액을 통해 전파된다는 공통점이 노출 후 특이 예방수단까지 같다는 뜻은 아니다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          16
        ]
      },
      {
        "doc": "261119_03",
        "pages": [
          20,
          21,
          22,
          23
        ]
      },
      {
        "doc": "261112_03",
        "pages": [
          29,
          31,
          40
        ]
      }
    ],
    "pages": [
      16
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "예방",
      "혈행성노출",
      "HBV-HCV"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261119_03-nov19-hbv-unvaccinated-positive-source",
        "lecture-261112_03-ext-daa-core2"
      ],
      "reason": "기존 HBV 노출 후 예방과 HCV DAA 치료를 대비하여, 치료제가 존재하는 것과 노출 후 예방으로 권고되는 것은 별개라는 새 의사결정 관계를 묻는다. 정리본의 HBV/HCV 공통 제목 아래 HBIG를 같이 적용할 위험도 교정한다."
    },
    "externalRefs": [
      {
        "title": "CDC: Responding to HBV Exposures in Health Care Settings",
        "url": "https://www.cdc.gov/hepatitis-b/hcp/infection-control/index.html"
      },
      {
        "title": "CDC: Testing and Clinical Management of Health Care Personnel Potentially Exposed to HCV",
        "url": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6906a1.htm"
      }
    ],
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-same-infections-deaths-different-denominators",
    "lecture": "261119_01",
    "topic": "261119_01",
    "kind": "case",
    "format": "mcq",
    "stem": "A·B 각각 감수성자 100명이 노출되어 50명씩 감염되었다. A는 현성발병 20명·사망 2명, B는 현성발병 10명·사망 2명이다. 올바른 비교는?",
    "choices": [
      "감염력 A>B / 치명률 A=B",
      "감염력 A=B / 치명률 A>B",
      "감염력 A<B / 치명률 A>B",
      "감염력 A=B / 치명률 A=B",
      "감염력 A=B / 치명률 A<B"
    ],
    "answer": 4,
    "explanation": "감염력은 감염자/노출된 감수성자이므로 두 집단 모두 50%이다. 치명률은 사망자/현성발병자이므로 A는 2/20=10%, B는 2/10=20%이다. 감염자와 사망자 수가 같아도 현성발병자 분모가 다르면 치명률은 다르다.",
    "choiceNotes": [
      "현성발병자가 더 많다는 이유로 감염력이 높아지는 것은 아니다.",
      "감염력은 같지만 치명률의 분모가 작은 B가 더 높다.",
      "감염자는 두 집단 모두 50명이며 치명률 방향도 반대이다.",
      "같은 사망자 수라도 현성발병자 수가 달라 치명률이 다르다.",
      "같은 감염력과 서로 다른 현성발병자 분모를 올바르게 적용했다."
    ],
    "keyClue": "분자가 같아도 지표마다 다른 분모 때문에 집단 간 순서가 달라질 수 있다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          14
        ]
      },
      {
        "doc": "261119_01",
        "pages": [
          18,
          19
        ]
      }
    ],
    "pages": [
      14
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "역학지표",
      "분모",
      "집단비교"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261119_01-nov19-infectivity-susceptible-denominator",
        "lecture-261119_01-nov19-virulence-fatality-endpoints"
      ],
      "reason": "기존 각 지표의 개별 계산과 달리 두 집단의 감염자·사망자 수를 같게 고정한다. 현성발병자 분모만 달라질 때 감염력은 같고 치명률 순위는 달라지는 비교 관계를 요구한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-combined-immunity-transmission-reduction",
    "lecture": "261119_02",
    "topic": "261119_02",
    "kind": "case",
    "format": "mcq",
    "stem": "R₀=4인 단순모형에서 인구의 50%가 감염을 막는 면역을 가졌다. 여기에 마스크로 β가 기존의 75%, 효과적 치료로 D가 50%가 되었다. 접촉률 κ 등은 일정할 때 최종 R과 유행 방향은?",
    "choices": [
      "0.50 / 감소",
      "0.75 / 감소",
      "1.00 / 경계",
      "1.50 / 증가",
      "2.00 / 증가"
    ],
    "answer": 1,
    "explanation": "면역을 반영한 R은 4×(1−0.5)=2이다. 여기에 β와 D의 상대 변화를 곱하면 2×0.75×0.5=0.75이다. R<1이므로 이 가정의 모형에서는 유행이 감소한다. 면역분율과 전파요인 감소를 같은 항으로 중복 계산하지 않는다.",
    "choiceNotes": [
      "β의 변화까지 함께 적용하면 0.50이 아니라 0.75이다.",
      "면역, 1회 접촉 전파확률, 전파기간의 변화를 모두 반영했다.",
      "R=1 경계보다 낮아지는 값이다.",
      "β만 줄이고 D 감소를 빠뜨린 값이다.",
      "면역만 반영하고 추가 중재 두 가지를 빠뜨린 값이다."
    ],
    "keyClue": "집단면역에 따른 감수성 감소와 β·D 감소를 서로 다른 요인으로 곱한다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          15
        ]
      },
      {
        "doc": "261119_02",
        "pages": [
          7,
          8,
          9
        ]
      }
    ],
    "pages": [
      15
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "집단면역",
      "복합중재",
      "감염재생산수"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261119_02-nov19-effective-r-calculation",
        "lecture-261119_02-nov19-transmission-components"
      ],
      "reason": "기존의 R₀(1−p) 단일 계산이나 중재-기호 짝짓기를 넘어 면역과 두 전파요인의 변화가 동시에 있을 때 최종 방향을 계산한다. 서로 다른 중재를 같은 효과로 중복 또는 누락 계산하는 오류를 판별한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-general-covered-probe-contact-site-level",
    "lecture": "261119_07",
    "topic": "261119_07",
    "kind": "case",
    "format": "mcq",
    "stem": "A는 온전한 복부 피부에만 접촉한 초음파 프로브, B는 일회용 커버를 씌워 질점막에 사용한 프로브이다. 세척 후 필요한 기본 재처리 수준을 연결하면?",
    "choices": [
      "A 낮은 수준 / B 낮은 수준",
      "A 높은 수준 / B 낮은 수준",
      "A 멸균 / B 높은 수준",
      "A 낮은 수준 / B 높은 수준",
      "A 높은 수준 / B 멸균"
    ],
    "answer": 3,
    "explanation": "기구의 위험도는 접촉 부위로 정한다. 온전한 피부에 사용하는 A는 비위험 기구의 낮은 수준 소독에 해당한다. 질점막에 사용하는 B는 준위험 기구로, 커버가 있더라도 파손·누출 가능성이 있어 높은 수준 소독이 필요하다. 커버가 소독 수준을 일괄 낮추는 근거는 아니다.",
    "choiceNotes": [
      "점막에 사용하는 B를 비위험 기구 수준으로 낮추었다.",
      "피부와 점막의 위험도 관계를 반대로 놓았다.",
      "A는 제시된 온전한 피부 접촉 조건에서 멸균이 기본 수준은 아니다.",
      "접촉 부위와 커버의 한계를 함께 반영했다.",
      "제시된 비침습성 체표·점막 접촉에 각각 한 단계 이상 높은 처리를 배정했다."
    ],
    "keyClue": "같은 초음파 기구라도 피부·점막 접촉이 다르면 수준이 달라지며 커버는 재처리를 대체하지 않는다.",
    "sourceRefs": [
      {
        "doc": "notes_general",
        "pages": [
          18
        ]
      },
      {
        "doc": "261119_07",
        "pages": [
          20,
          21,
          22
        ]
      }
    ],
    "pages": [
      18
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "환경관리",
      "의료기구",
      "준위험"
    ],
    "summaryDoc": "notes_general",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-final-261119_07-spaulding-three-devices",
        "lecture-statement-final-261119_07-semicritical-rinse"
      ],
      "reason": "기존 세 기구의 분류표를 반복하지 않고 같은 이름의 프로브를 접촉 부위와 커버 사용 조건에 따라 나눈다. 정리본의 모든 프로브에 낮은 수준+커버를 적용한 일반화를 교정하는 새 경계 사례이다."
    },
    "externalRefs": [
      {
        "title": "CDC: Guideline for Disinfection and Sterilization in Healthcare Facilities",
        "url": "https://www.cdc.gov/infection-control/media/pdfs/guideline-disinfection-h.pdf"
      },
      {
        "title": "AIUM 2025 Guidelines for Cleaning and Preparing Ultrasound Transducers",
        "url": "https://www.aium.org/resources/official-statements/view/guidelines-for-cleaning-and-preparing-external--and-internal-use-ultrasound-transducers-and-equipment-between-patients-as-well-as-safe-handling-and-use-of-ultrasound-coupling-gel"
      }
    ],
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-biofilm-sites",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "생물막이 공통 병인인 세 감염을 비교한다. 인공 션트 감염 / 만성 녹농균 기도감염 / EAEC 지속 설사의 대표 연결은?",
    "choices": [
      "Protein A / pyocyanin / 장침투",
      "Slime layer / pyoverdine / A/E 병변",
      "Slime layer / alginate / stacked-brick 부착",
      "Coagulase / alginate / Shiga toxin",
      "Teichoic acid / exotoxin A / 장침투"
    ],
    "answer": 2,
    "explanation": "S. epidermidis의 기구 부착, P. aeruginosa의 점액성 만성 기도감염, EAEC의 지속 설사는 서로 다른 부위에서 생물막을 이용하는 예이다. Slime layer–alginate–stacked-brick 부착을 대응시킨다.",
    "choiceNotes": [
      "Protein A는 IgG Fc 결합 인자이며 pyocyanin은 색소이다.",
      "Pyoverdine은 철 획득 인자이고 A/E 병변은 EPEC·EHEC와 연결된다.",
      "세 감염 부위의 생물막 관련 연결이 모두 맞는다.",
      "Coagulase는 응고효소이고 Shiga toxin은 EAEC의 대표 연결이 아니다.",
      "Exotoxin A는 단백질 합성을 억제하며 EAEC는 장침투형과 다르다."
    ],
    "keyClue": "같은 생물막, 서로 다른 감염 부위",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          3,
          4,
          7,
          10
        ]
      },
      {
        "doc": "261104_01",
        "pages": [
          11,
          15,
          33
        ]
      },
      {
        "doc": "261105_03",
        "pages": [
          5,
          9
        ]
      },
      {
        "doc": "261105_05",
        "pages": [
          34
        ]
      }
    ],
    "pages": [
      3,
      4,
      7,
      10
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261104_01-04",
        "lecture-261105_03-05",
        "lecture-261105_05-09"
      ],
      "reason": "기존은 각 균의 인자나 병원형을 따로 묻는다. 새 문항은 의료기구·기도·장관의 세 환경을 하나의 생물막 비교축으로 연결한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-antibody-defense-targets",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "S. aureus의 Protein A와 폐렴사슬알균의 IgA protease를 비교한 연결은?",
    "choices": [
      "IgG 분해 / IgA Fc 결합",
      "IgG Fc 결합 / 분비형 IgA 분해",
      "IgA Fc 결합 / IgG 분해",
      "IgG Fab 분해 / IgA 합성 억제",
      "보체 C5a 절단 / IgG Fc 결합"
    ],
    "answer": 1,
    "explanation": "Protein A는 IgG의 Fc 부분에 결합하여 항체 매개 제거를 방해한다. 폐렴사슬알균의 IgA protease는 점막의 분비형 IgA를 분해한다. 항체 종류와 작용 방식을 함께 구별한다.",
    "choiceNotes": [
      "Protein A의 대표 작용은 IgG 절단이 아니다.",
      "항체 종류와 결합·분해의 차이가 모두 맞는다.",
      "두 인자의 항체 표적과 작용을 바꾸었다.",
      "Protein A는 Fab 분해효소가 아니며 IgA protease는 합성 억제제가 아니다.",
      "C5a peptidase의 작용을 Protein A에 옮겼다."
    ],
    "keyClue": "Fc에 결합하는 인자와 점막 항체를 자르는 인자",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          3,
          5
        ]
      },
      {
        "doc": "261104_01",
        "pages": [
          11,
          15
        ]
      },
      {
        "doc": "261105_01",
        "pages": [
          23
        ]
      }
    ],
    "pages": [
      3,
      5
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261104_01-07",
        "lecture-261105_01-08"
      ],
      "reason": "기존의 Protein A 단독·IgA protease 단독 질문을 합쳐 항체 계열과 작용 동사를 동시에 구별하는 비교로 바꾸었다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-urease-organ-effects",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "동일한 urease 활성을 위와 요로에서 해석한다. H. pylori / Proteus 감염에서의 대표 결과는?",
    "choices": [
      "산성 적응 / 소변 산성화",
      "위산 합성 / 결석 용해",
      "미세융모 소실 / 소변 산성화",
      "위산 합성 / 소변 알칼리화",
      "국소 산성 완충 / 소변 알칼리화·결석"
    ],
    "answer": 4,
    "explanation": "Urease로 생성한 암모니아는 H. pylori의 국소 산성 환경 적응을 돕는다. Proteus에서는 소변 pH 상승과 염의 침전이 감염성 요로결석에 기여한다. 같은 효소를 서로 다른 장기의 결과에 연결하는 문제이다.",
    "choiceNotes": [
      "Proteus의 대표 효과는 소변 pH 상승이다.",
      "Urease는 위산 합성을 촉진하거나 감염성 결석을 녹이는 효소가 아니다.",
      "미세융모 소실은 A/E 병변의 연결이며 Proteus는 알칼리뇨와 연결된다.",
      "H. pylori urease의 직접 연결은 위산 합성이 아니라 국소 완충이다.",
      "위의 산성 적응과 요로의 pH 상승·결석이 모두 맞는다."
    ],
    "keyClue": "urease라는 공통 효소의 장기별 결과",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          8,
          9
        ]
      },
      {
        "doc": "261105_03",
        "pages": [
          29
        ]
      },
      {
        "doc": "261105_05",
        "pages": [
          24,
          25
        ]
      }
    ],
    "pages": [
      8,
      9
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261105_03-10",
        "lecture-261105_05-05"
      ],
      "reason": "기존 Proteus 종 감별·H. pylori 동정과 달리, 두 장기에서 동일 효소가 만드는 pH 변화와 임상 결과를 비교한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-immune-aftermath-organ",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "고름사슬알균 인두염 후 류마티스열과 C. jejuni 장염 후 Guillain–Barré 증후군의 공통 병인 / 주된 손상 부위 연결은?",
    "choices": [
      "감염 후 면역반응 / 심장·관절과 말초신경",
      "지속 균혈증 / 심장·관절과 말초신경",
      "분비성 장독소 / 말초신경과 심장·관절",
      "감염 후 면역반응 / 장 미세융모와 신세뇨관",
      "혈관 내 독소 작용 / 신세뇨관과 말초신경"
    ],
    "answer": 0,
    "explanation": "두 합병증은 앞선 감염에 유발된 면역반응과 관련된다. 류마티스열에서는 심장·관절 등을, Guillain–Barré 증후군에서는 말초신경을 연결한다. 증상이 늦게 나타났다는 이유로 두 부위의 지속 균혈증을 가정하지 않는다.",
    "choiceNotes": [
      "공통 면역 기전과 각 질환의 대표 손상 부위가 맞는다.",
      "두 합병증을 해당 부위의 지속 균혈증으로 설명하지 않는다.",
      "분비성 장독소는 두 감염 후 합병증의 공통 기전이 아니다.",
      "두 질환의 대표 손상 부위와 다르다.",
      "독소는 혈관 안에서 증식하는 병원체가 아니다."
    ],
    "keyClue": "감염 부위와 감염 후 면역 손상 부위를 구분",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          4,
          5,
          9
        ]
      },
      {
        "doc": "261105_01",
        "pages": [
          9,
          16
        ]
      },
      {
        "doc": "261105_05",
        "pages": [
          23
        ]
      }
    ],
    "pages": [
      4,
      5,
      9
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261105_01-03",
        "lecture-261105_05-04"
      ],
      "reason": "기존은 M protein이나 선행 장염 균을 따로 물었다. 새 문항은 두 감염 후 질환의 공통 면역 기전과 서로 다른 표적 장기를 연결한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-intracellular-dependence",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "숙주세포 의존성을 M. pneumoniae / C. trachomatis / L. pneumophila 순서로 비교한 것은?",
    "choices": [
      "절대세포내 / 세포외 증식 가능 / 조건세포내",
      "세포외 증식 가능 / 조건세포내 / 절대세포내",
      "조건세포내 / 절대세포내 / 세포외 증식 가능",
      "세포외 증식 가능 / 절대세포내 / 조건세포내",
      "절대세포내 / 조건세포내 / 세포외 증식 가능"
    ],
    "answer": 3,
    "explanation": "Mycoplasma는 세포벽이 없지만 숙주세포 밖에서도 증식할 수 있는 세균이다. Chlamydia는 절대세포내 세균이며, Legionella는 대식세포와 자연계 아메바 안에서도 증식하는 조건세포내 세균이다. 그람염색이 불량한 폐렴 원인균을 같은 생활양식으로 묶지 않는다.",
    "choiceNotes": [
      "Mycoplasma와 Chlamydia의 의존성을 바꾸었다.",
      "Chlamydia와 Legionella의 세포 의존성을 바꾸었다.",
      "Mycoplasma는 대표적인 독립생활 가능 세균이고 Legionella는 조건세포내 세균이다.",
      "세 균의 숙주세포 의존성이 모두 맞는다.",
      "Mycoplasma와 Chlamydia의 특성이 맞지 않는다."
    ],
    "keyClue": "그람염색 불량과 절대세포내 의존은 다른 축",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          10,
          11,
          18
        ]
      },
      {
        "doc": "261105_06",
        "pages": [
          3,
          13,
          14
        ]
      },
      {
        "doc": "261109_02",
        "pages": [
          10,
          18
        ]
      }
    ],
    "pages": [
      10,
      11,
      18
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261105_06-01",
        "lecture-integrated-chlamydia",
        "lecture-integrated-legionella-focus"
      ],
      "reason": "기존 폐렴 원인균 동정과 달리 세 비정형 원인균의 세포벽·염색 소견을 숙주세포 의존성과 혼동하지 않는 분류 비교이다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-actin-opposite-directions",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "숙주 actin을 이용하는 Listeria의 ActA / C. difficile의 CDT를 작용 방향으로 구분하면?",
    "choices": [
      "중합 억제 / 중합 촉진",
      "중합 촉진 / 중합 억제",
      "중합 촉진 / 중합 촉진",
      "중합 억제 / 중합 억제",
      "중합 촉진 / actin 직접 절단"
    ],
    "answer": 1,
    "explanation": "Listeria의 ActA는 actin 중합을 이용한 세포질 이동과 세포 간 전파를 돕는다. CDT는 actin을 ADP-ribosylation하여 중합을 방해한다. 같은 숙주 구조를 이용하더라도 작용 방향과 감염상의 의미는 다르다.",
    "choiceNotes": [
      "ActA와 CDT가 actin 중합에 주는 방향을 서로 바꾸었다.",
      "ActA의 중합 촉진과 CDT에 의한 중합 억제를 맞게 연결한다.",
      "ActA는 중합을 촉진하지만 CDT는 중합을 방해한다.",
      "CDT의 방향은 맞지만 ActA는 actin 중합을 촉진한다.",
      "CDT는 actin을 ADP-ribosylation하여 중합을 방해하며 actin을 직접 절단하는 단백분해효소로 설명하지 않는다."
    ],
    "keyClue": "같은 actin, 이동 촉진과 세포골격 손상",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          15,
          19
        ]
      },
      {
        "doc": "261106_06",
        "pages": [
          32
        ]
      },
      {
        "doc": "261109_02",
        "pages": [
          58,
          59
        ]
      }
    ],
    "pages": [
      15,
      19
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261109_02-10-q3",
        "lecture-261106_06-10"
      ],
      "reason": "기존은 ActA 또는 CDT 표적을 따로 묻는다. 새 문항은 동일한 actin에 대한 정반대 중합 효과와 병원체의 활용 방식을 비교한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-camp-three-routes",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "세 독소가 모두 cAMP 증가와 연결된다. 콜레라독소 / 백일해독소(PT) / ACT의 상류 작용을 순서대로 고르면?",
    "choices": [
      "Gi 억제 / Gs 활성 지속 / cyclase 직접 작용",
      "Gs 억제 / Gi 활성 지속 / cyclase 직접 작용",
      "Cyclase 직접 작용 / Gi 억제 / Gs 활성 지속",
      "Gs 활성 지속 / cyclase 직접 작용 / Gi 억제",
      "Gs 활성 지속 / Gi 억제 / cyclase 직접 작용"
    ],
    "answer": 4,
    "explanation": "콜레라독소는 Gsα 활성 상태를 지속시키고, PT는 Giα의 억제성 신호를 차단한다. ACT는 adenylyl cyclase 작용으로 식세포 cAMP를 직접 증가시킨다. 최종 신호가 같아도 상류 표적은 다르다.",
    "choiceNotes": [
      "콜레라독소와 PT의 G단백 표적을 바꾸었다.",
      "콜레라독소·PT의 작용 방향이 맞지 않는다.",
      "ACT의 직접 cyclase 작용을 콜레라독소에 옮겼다.",
      "PT와 ACT의 경로를 바꾸었다.",
      "Gs·Gi·직접 cyclase의 세 경로가 맞는다."
    ],
    "keyClue": "공통 종말점 cAMP와 서로 다른 상류 경로",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          8,
          16
        ]
      },
      {
        "doc": "261105_05",
        "pages": [
          10
        ]
      },
      {
        "doc": "261109_01",
        "pages": [
          16,
          17
        ]
      }
    ],
    "pages": [
      8,
      16
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-integrated-toxin-gs-focus",
        "lecture-integrated-toxin-gi",
        "lecture-261109_01-05"
      ],
      "reason": "기존은 Gs 독소 또는 PT/ACT 둘 중 하나를 고른다. 새 문항은 장관·호흡기 세 독소의 동일한 종말점과 서로 다른 상류 조절을 한꺼번에 구별한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-vaccine-antigen-matrix",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "Hib / 디프테리아 / 무세포 백일해 백신의 항원을 바르게 연결한 것은?",
    "choices": [
      "PRP 결합항원 / toxoid / 정제 백일해 항원",
      "PRP 결합항원 / 생균 / toxoid 단일 항원",
      "LOS / toxoid / 생약독화균",
      "PRP 비결합항원 / 생균 / 정제된 여러 항원",
      "단백질 협막 / toxoid / 사균 전체"
    ],
    "answer": 0,
    "explanation": "Hib 백신은 PRP를 단백질에 결합한 항원, 디프테리아 예방 성분은 toxoid이다. 무세포 백일해 백신은 불활화 PT 단독 또는 다른 정제항원과의 조합으로 제품 구성이 다르다. 강의의 대표 DTaP 제형에는 불활화 PT와 FHA 등 여러 정제항원이 포함된다.",
    "choiceNotes": [
      "Hib의 결합 다당류, 디프테리아 toxoid, 무세포 백일해의 정제항원이라는 세 항원 범주를 맞게 연결한다.",
      "디프테리아는 생균 백신이 아니며 무세포 백일해를 단일 toxoid로 한정하지 않는다.",
      "Hib의 주요 항원은 LOS가 아니라 PRP이며 무세포 백일해는 생균이 아니다.",
      "영아용 Hib의 핵심은 PRP 단백결합이고 디프테리아는 toxoid이다.",
      "PRP는 다당류이고 무세포 백일해는 사균 전체 백신과 다르다."
    ],
    "keyClue": "협막 결합백신·독소항원·정제항원을 구분",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          14,
          16
        ]
      },
      {
        "doc": "261109_01",
        "pages": [
          9,
          20
        ]
      }
    ],
    "pages": [
      14,
      16
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261109_01-01",
        "lecture-statement-261106_05-07"
      ],
      "reason": "기존의 Hib PRP 또는 디프테리아 toxoid 단독 질문과 달리, 세 백신의 항원 구성을 비교하고 정리본의 백일해=toxoid만이라는 과잉단순화를 배제한다."
    },
    "externalRefs": [
      {
        "title": "WHO: Acellular Pertussis Vaccines",
        "url": "https://www.who.int/teams/health-product-policy-and-standards/standards-and-specifications/norms-and-standards/vaccines-quality/acellular-pertussis-vaccines"
      }
    ],
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-infant-cough-two-causes",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "case",
    "format": "mcq",
    "stem": "A 영아는 신생아 결막염 뒤 발열 없는 폐렴이 생겼다. B 영아는 반복 무호흡·청색증과 현저한 림프구증가를 보인다. A / B를 가장 잘 연결한 것은?",
    "choices": [
      "C. pneumoniae / H. influenzae",
      "B. pertussis / C. trachomatis",
      "C. trachomatis / B. pertussis",
      "M. pneumoniae / N. meningitidis",
      "N. gonorrhoeae / M. pneumoniae"
    ],
    "answer": 2,
    "explanation": "분만 시 C. trachomatis 감염은 신생아 결막염에 이어 영아 무열성 폐렴을 일으킬 수 있다. 백일해 영아는 전형적인 whoop 없이 무호흡·청색증을 보일 수 있고 PT 관련 림프구증가가 감별 단서이다.",
    "choiceNotes": [
      "A는 분만 관련 C. trachomatis 연결이 더 맞고 B의 림프구증가가 설명되지 않는다.",
      "두 원인균을 뒤바꾸었다.",
      "결막염 선행·영아 폐렴과 무호흡·림프구증가를 바르게 구분한다.",
      "A의 분만 관련 결막염과 B의 백일해성 소견을 설명하지 못한다.",
      "임균은 신생아 결막염을 유발하지만 제시한 결막염 후 무열성 폐렴 연결은 C. trachomatis가 전형적이다."
    ],
    "keyClue": "영아의 호흡기 질환에서 결막염 선행과 림프구증가 비교",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          11,
          16
        ]
      },
      {
        "doc": "261105_06",
        "pages": [
          18
        ]
      },
      {
        "doc": "261109_01",
        "pages": [
          16,
          17
        ]
      }
    ],
    "pages": [
      11,
      16
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261105_06-02",
        "lecture-261109_01-03"
      ],
      "reason": "기존의 각 원인균 사례를 영아 기침이라는 같은 조건에 놓고, 선행 결막염과 면역혈액 소견을 동시에 비교하게 했다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-capsule-absence-not-avirulence",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "협막과 질환을 함께 비교할 때, NTHi 중이염과 임균성 요도염이 공통으로 보여 주는 것은?",
    "choices": [
      "PRP 협막이 국소 염증에 필요하다",
      "협막이 없어도 점막감염을 일으킨다",
      "다당류 협막 백신으로 함께 예방된다",
      "협막이 없으면 비인두 집락만 형성한다",
      "두 균 모두 수막염균 협막을 가진다"
    ],
    "answer": 1,
    "explanation": "NTHi는 비피막형 H. influenzae이며 중이염·부비동염 등을 일으킨다. 임균도 수막염균과 같은 다당류 협막은 없지만 부착인자·LOS 등에 의해 점막감염을 일으킨다. 협막 유무를 병원성 유무와 동일시하지 않는다.",
    "choiceNotes": [
      "PRP는 Hib 협막이며 두 감염 모두에 필요한 공통 인자가 아니다.",
      "협막 부재와 점막 병원성이 양립한다.",
      "Hib PRP 백신은 NTHi나 임균 감염을 예방하지 않는다.",
      "임균은 비인두 집락만 만드는 균이 아니며 NTHi도 국소·침습성 질환을 일으킬 수 있다.",
      "두 균은 수막염균의 다당류 협막을 가지지 않는다."
    ],
    "keyClue": "협막 없음과 감염능 없음은 다르다",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          16,
          17
        ]
      },
      {
        "doc": "261109_01",
        "pages": [
          9,
          10,
          23,
          25,
          30
        ]
      }
    ],
    "pages": [
      16,
      17
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261109_01-01",
        "lecture-integrated-urethritis"
      ],
      "reason": "기존의 Hib 협막·임균 동정을 반복하지 않고, 서로 다른 점막 병원체의 협막 부재가 병원성 부재를 뜻하지 않는다는 관계를 묻는다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-antibody-after-treatment",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "case",
    "format": "mcq",
    "stem": "H. pylori 제균 뒤 혈청항체 양성인 A와, 매독 치료 뒤 트레포네마 특이항체 양성인 B가 있다. 두 결과의 공통 해석은?",
    "choices": [
      "치료 전과 같은 활동성 감염의 표지",
      "감염 시점을 정하는 최근 노출의 표지",
      "제균·치료 반응을 보는 정량 추적 지표",
      "치료 후에도 남을 수 있는 항체 반응",
      "재발과 재감염을 나누는 감별 지표"
    ],
    "answer": 3,
    "explanation": "H. pylori 항체와 트레포네마 특이항체는 적절한 치료 뒤에도 남을 수 있다. H. pylori는 요소호기·대변항원검사 등으로 제균을 확인하며, 매독에서는 병력·증상 및 비트레포네마 역가 등을 함께 해석한다. 두 항체 양성만으로 현재 감염이나 치료 실패를 확정하지 않는다.",
    "choiceNotes": [
      "적절한 치료 뒤에도 항체가 남을 수 있어 양성만으로 현재 활동성을 판단하지 않는다.",
      "두 항체 양성만으로 새 감염의 시점을 정하지 않는다.",
      "H. pylori 제균은 요소호기·대변항원검사 등을, 매독 치료반응은 비트레포네마 역가 등을 함께 본다.",
      "두 항체는 치료 후에도 양성으로 남을 수 있다.",
      "잔존 항체만으로 재발과 재감염을 구별하지 않고 병력·증상과 적절한 추가 검사를 함께 평가한다."
    ],
    "keyClue": "과거 감염·치료 후 항체의 지속",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          9,
          20
        ]
      },
      {
        "doc": "261105_05",
        "pages": [
          28,
          29
        ]
      },
      {
        "doc": "261110_01",
        "pages": [
          7
        ]
      }
    ],
    "pages": [
      9,
      20
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261105_05-06-q3",
        "lecture-261110_01-04"
      ],
      "reason": "기존은 개별 검사 이름이나 제균검사를 물었다. 새 문항은 서로 다른 감염의 치료 후 항체 잔존을 비교하여 양성=현재 감염이라는 공통 오류를 교정한다."
    },
    "externalRefs": [
      {
        "title": "CDC: Laboratory Recommendations for Syphilis Testing, 2024",
        "url": "https://www.cdc.gov/mmwr/volumes/73/rr/rr7301a1.htm"
      }
    ],
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-epithelial-barrier-three-mechanisms",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "장상피·위상피 장벽 교란을 비교한다. BFT / TcdA·TcdB / CagA의 대표 연결은?",
    "choices": [
      "E-cadherin 절단 / Rho·Rac 변형 / 세포 내 전달 후 신호 교란",
      "Rho·Rac 변형 / E-cadherin 절단 / 세포 내 전달 후 신호 교란",
      "E-cadherin 절단 / EF-2 변형 / actin 중합 촉진",
      "Actin 변형 / Rho·Rac 변형 / IgA 분해",
      "EF-2 변형 / actin 변형 / E-cadherin 직접 절단"
    ],
    "answer": 0,
    "explanation": "ETBF의 BFT는 E-cadherin을 절단한다. C. difficile의 TcdA·TcdB는 Rho·Rac GTPase를 glycosylation하여 세포골격과 접합을 교란한다. H. pylori CagA는 제4형 분비계로 전달되어 숙주 신호·세포골격·접합 변화에 기여한다. 같은 장벽 손상이라는 결과에서 직접 표적과 작용 양식을 구별한다.",
    "choiceNotes": [
      "세 인자의 직접 표적·작용이 맞는다.",
      "BFT와 TcdA·TcdB의 표적을 바꾸었다.",
      "TcdA·TcdB를 EF-2 독소와, CagA를 ActA와 혼동했다.",
      "BFT는 E-cadherin 절단 인자이며 CagA는 IgA 분해효소가 아니다.",
      "세 인자의 대표 작용을 다른 독소·인자와 뒤섞었다."
    ],
    "keyClue": "장벽 손상은 같아도 직접 표적은 다르다",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          9,
          14,
          15
        ]
      },
      {
        "doc": "261106_06",
        "pages": [
          19,
          31
        ]
      },
      {
        "doc": "261105_05",
        "pages": [
          25
        ]
      }
    ],
    "pages": [
      9,
      14,
      15
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261106_06-07",
        "lecture-261106_06-04",
        "lecture-261105_05-07-q3"
      ],
      "reason": "기존의 BFT·Tcd·CagA 개별 명칭 회상과 달리 세 강의의 상피 장벽 교란을 직접 절단·GTPase 변형·세포 내 신호 교란이라는 비교축으로 연결한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-atypical-pneumonia-reservoirs",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "세포 내 생존 가능한 폐렴 원인균을 병원소·주된 노출로 구분한다. C. psittaci / Legionella의 연결은?",
    "choices": [
      "사람의 생식기 / 조류 비말",
      "수계 에어로졸 / 조류 유래 노출",
      "조류 유래 노출 / 오염 수계 에어로졸",
      "오염 식품 섭취 / 사람 간 비말",
      "토양의 아포 / 오염 식품 섭취"
    ],
    "answer": 2,
    "explanation": "C. psittaci는 조류 관련 인수공통 호흡기감염과 연결한다. Legionella는 수계 환경의 에어로졸 노출 및 자연계 아메바·사람 대식세포 내 생존과 연결된다. 세포 내 생존 가능성만으로 병원소나 전파경로를 같은 것으로 추정하지 않는다.",
    "choiceNotes": [
      "C. trachomatis의 생식기 연결을 C. psittaci에 옮겼다.",
      "두 병원체의 대표 노출을 뒤바꾸었다.",
      "조류 관련 노출과 환경 수계 에어로졸이 맞는다.",
      "식품 섭취는 Listeria 등의 주요 연결이며 Legionella는 사람 간 비말 전파가 일반적이지 않다.",
      "두 균은 이 아포·식품 노출 조합으로 분류하지 않는다."
    ],
    "keyClue": "세포 내 생존의 공통점과 환경·동물 병원소의 차이",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          11,
          18
        ]
      },
      {
        "doc": "261109_02",
        "pages": [
          10,
          18,
          19,
          28
        ]
      }
    ],
    "pages": [
      11,
      18
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261105_06-04",
        "lecture-integrated-legionella-focus"
      ],
      "reason": "기존의 개별 비정형폐렴 원인균 동정과 달리, 세포 내 생존이라는 공통점에서 조류와 환경 수계의 병원소·유입 경로가 갈리는 점을 비교한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-jaundice-cause-versus-risk",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "case",
    "format": "mcq",
    "stem": "A는 담수 침수 복구 뒤 결막충혈·종아리 압통과 새 황달·신손상이 생겼다. B는 기존 간경변 환자로 해수 상처 노출 뒤 출혈성 수포·쇼크가 생겼다. 황달·간질환의 역할을 바르게 해석하면?",
    "choices": [
      "A·B 모두 선행 간경변이 핵심이다",
      "A·B 모두 바이러스 간염의 결과이다",
      "A는 Vibrio 위험인자, B는 Leptospira 합병증이다",
      "A는 독소성 식중독, B는 감염 후 신염이다",
      "A는 Leptospira 장기손상, B는 Vibrio 고위험 숙주이다"
    ],
    "answer": 4,
    "explanation": "A의 새 황달·신손상은 Leptospira 감염의 장기손상과 연결된다. B의 선행 간경변은 V. vulnificus 패혈증의 위험인자이다. 두 사례 모두 간 관련 소견이 있지만, 한쪽에서는 감염의 결과이고 다른 쪽에서는 선행 위험요인이다.",
    "choiceNotes": [
      "A에서는 황달이 노출 뒤 새로 발생했고 선행 간경변이 제시되지 않았다.",
      "노출·신장·피부 소견이 Leptospira와 V. vulnificus를 지지한다.",
      "간 관련 소견의 시간 방향과 병원체를 바꾸었다.",
      "A의 전신 장기손상과 B의 빠른 괴사성 감염을 설명하지 못한다.",
      "노출·피부 소견과 간 관련 소견의 원인·위험인자 방향이 맞는다."
    ],
    "keyClue": "간질환이 선행 위험인자인가 감염의 결과인가",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          9,
          21
        ]
      },
      {
        "doc": "261110_01",
        "pages": [
          21,
          22
        ]
      },
      {
        "doc": "261105_05",
        "pages": [
          11,
          13
        ]
      }
    ],
    "pages": [
      9,
      21
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-bcase-261110_01-06",
        "lecture-261105_05-01"
      ],
      "reason": "기존은 각각 원인균을 고르게 했다. 새 문항은 담수·해수 노출과 함께 간 소견의 시간 방향, 즉 감염 결과와 선행 위험요인을 구분한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-anemia-immune-versus-microangiopathy",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "case",
    "format": "mcq",
    "stem": "A는 M. pneumoniae 감염 뒤 한랭항체 매개 용혈이 생겼다. B는 EHEC 장염 뒤 빈혈·혈소판감소·급성 신손상이 생겼다. A / B의 적혈구 손상 기전을 고르면?",
    "choices": [
      "미세혈전 손상 / 한랭항체 결합",
      "적혈구 항원 교차반응 / 미세혈관병성 용혈",
      "적혈구 직접 감염 / 골수 증식 억제",
      "골수 증식 억제 / 적혈구 직접 감염",
      "IgA 분해 / 보체 C5a 절단"
    ],
    "answer": 1,
    "explanation": "A는 감염에 수반된 항체 반응에 의한 용혈이고, B는 HUS에서 미세혈관 손상·미세혈전과 연결되는 용혈이다. 두 감염 후 빈혈을 모두 적혈구의 직접 감염으로 설명하지 않는다.",
    "choiceNotes": [
      "A와 B의 대표 기전을 뒤바꾸었다.",
      "한랭항체 관련 면역성 용혈과 HUS의 미세혈관병성 용혈이 맞는다.",
      "제시한 두 상황은 적혈구 직접 감염·골수 억제의 조합이 아니다.",
      "혈소판감소·신손상을 동반한 HUS를 설명하지 못한다.",
      "항체·보체 회피 인자를 적혈구 손상 기전에 옮겼다."
    ],
    "keyClue": "같은 감염 후 용혈, 항체와 미세혈관 손상",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          7,
          10
        ]
      },
      {
        "doc": "261105_03",
        "pages": [
          5,
          9
        ]
      },
      {
        "doc": "261105_06",
        "pages": [
          9,
          10
        ]
      }
    ],
    "pages": [
      7,
      10
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-integrated-mycoplasma",
        "lecture-261105_03-04",
        "lecture-cbl-past-1-2025-63"
      ],
      "reason": "기존은 Mycoplasma 한랭응집소를 동정 단서로 쓰거나 EHEC/HUS를 진단했다. 새 문항은 진단을 제시한 뒤 두 감염 후 빈혈의 손상 기전을 비교한다."
    },
    "externalRefs": [
      {
        "title": "CDC: About Mycoplasma pneumoniae Infection",
        "url": "https://www.cdc.gov/mycoplasma/about/"
      }
    ],
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-pulmonary-fungal-patterns",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "case",
    "format": "mcq",
    "stem": "A는 CD4 감소 환자의 양측 간유리음영, B는 호중구감소 환자의 halo를 동반한 폐결절, C는 기존 폐 공동 속 fungus ball이다. A / B / C의 대표 병태 연결은?",
    "choices": [
      "침습성 Aspergillus / PCP / aspergilloma",
      "PCP / aspergilloma / 침습성 Aspergillus",
      "Cryptococcus 수막염 / PCP / aspergilloma",
      "PCP / 침습성 Aspergillus / aspergilloma",
      "PCP / Cryptococcus 폐감염 / 침습성 Aspergillus"
    ],
    "answer": 3,
    "explanation": "PCP는 양측 간유리음영과, 침습성 폐 Aspergillus 감염은 위험 숙주에서 halo를 동반한 결절성 병변과 연결한다. Aspergilloma는 이미 존재하는 공동 내부의 균구이다. 영상의 빈 공간이나 음영이라는 외형만으로 침습성 병변과 공동 내 균구를 동일시하지 않는다.",
    "choiceNotes": [
      "A와 B의 위험 숙주·영상 연결을 바꾸었다.",
      "B의 침습성 결절과 C의 기존 공동 속 균구를 바꾸었다.",
      "A의 폐렴 소견을 수막염에 연결했다.",
      "세 영상과 병태의 연결이 맞는다.",
      "B의 halo 결절과 C의 fungus ball 연결이 맞지 않는다."
    ],
    "keyClue": "미만성 폐렴·침습성 결절·기존 공동 내 균구",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          23
        ]
      },
      {
        "doc": "261116_05",
        "pages": [
          30,
          32,
          33
        ]
      },
      {
        "doc": "261116_06",
        "pages": [
          8,
          9,
          12,
          13
        ]
      }
    ],
    "pages": [
      23
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261116_05-nov-pcp-host",
        "lecture-integrated-aspergillus",
        "path-traits-23-q3"
      ],
      "reason": "기존의 PCP 동정·Aspergillus 균사·halo와 air-crescent 시기 문제와 달리, 숙주와 영상에서 세 임상 병태를 구분한다. Aspergillus/Mucorales 형태 pair는 사용하지 않았다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-fungal-antigen-compartments",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "Aspergillus의 galactomannan 검사 / Cryptococcus 항원검사가 각각 연결되는 구조는?",
    "choices": [
      "협막 다당류 / 세포벽 galactomannan",
      "세포막 sterol / 협막 단백질",
      "리보솜 RNA / 미콜산",
      "세포벽 galactomannan / 협막 다당류",
      "Peptidoglycan / 세포막 sterol"
    ],
    "answer": 3,
    "explanation": "Aspergillus의 galactomannan은 진균 세포벽 성분이다. Cryptococcus 항원검사는 협막 다당류와 연결한다. 둘 다 항원검사라는 공통점이 있어도 검출 구조와 해당 병원체를 바꾸지 않는다.",
    "choiceNotes": [
      "두 병원체의 검출 구조를 뒤바꾸었다.",
      "두 검사 모두 이 sterol·단백질 조합을 검출하는 검사가 아니다.",
      "미콜산은 항산균 외피의 특징이며 이 진균 항원검사의 대응이 아니다.",
      "병원체별 항원과 세포 구조의 연결이 모두 맞는다.",
      "Peptidoglycan과 sterol로 바꾼 오답이다."
    ],
    "keyClue": "진균 항원검사를 세포벽과 협막의 구조에 대응",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          23,
          24
        ]
      },
      {
        "doc": "261116_06",
        "pages": [
          10,
          19
        ]
      }
    ],
    "pages": [
      23,
      24
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261116_06-nov-crypto-antigen-ink",
        "lecture-cbl-past-4-2021-7"
      ],
      "reason": "기존은 각 항원검사 양성을 진단·치료 단서로 썼다. 새 문항은 두 진균 검사의 항원이 위치하는 구조를 직접 비교한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-steroid-context-two-fungi",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "case",
    "format": "mcq",
    "stem": "A는 HIV 연관 PCP로 실내공기 A-a DO₂가 40 mmHg이다. B는 Cryptococcus 수막염 치료 중 뇌압 상승이 있으나 IRIS는 없다. 항감염 치료 외 추가 처치의 연결은?",
    "choices": [
      "A 보조 스테로이드 / B 반복 요추천자·배액",
      "A 반복 요추천자 / B 보조 스테로이드",
      "A 스테로이드 보류 / B mannitol 우선",
      "A mannitol / B 스테로이드·mannitol",
      "A 보조 스테로이드 / B 보조 스테로이드"
    ],
    "answer": 0,
    "explanation": "HIV 연관 PCP에서 A-a DO₂ ≥35 mmHg이면 보조 스테로이드 적응증에 해당한다. Cryptococcus 수막염의 뇌압 상승은 반복 요추천자·배액으로 조절하며, 단순 뇌압 조절을 위해 스테로이드를 일률적으로 투여하지 않는다. B는 중증 IRIS 같은 별도 상황을 제외했다.",
    "choiceNotes": [
      "질환·산소화·합병증에 따른 두 처치가 맞는다.",
      "폐의 산소화 장애와 뇌압 상승의 처치를 바꾸었다.",
      "A는 스테로이드 기준을 충족하며 B의 뇌압에 mannitol을 우선하지 않는다.",
      "두 약물을 두 진균 감염의 공통 보조요법으로 적용하지 않는다.",
      "PCP의 스테로이드 적응증을 Cryptococcus 뇌압 상승에 그대로 확장했다."
    ],
    "keyClue": "같은 면역저하 숙주라도 보조치료의 적응증은 다르다",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          23,
          24
        ]
      },
      {
        "doc": "261116_05",
        "pages": [
          34,
          38
        ]
      },
      {
        "doc": "261116_06",
        "pages": [
          21
        ]
      }
    ],
    "pages": [
      23,
      24
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261116_05-nov-pcp-steroid-threshold",
        "lecture-261116_06-nov-crypto-intracranial-pressure"
      ],
      "reason": "기존은 각 질환의 처치를 따로 물었다. 새 문항은 HIV·정량적 산소화 기준·IRIS 제외 조건을 제시해 스테로이드의 서로 다른 적응증을 비교한다."
    },
    "externalRefs": [
      {
        "title": "NIH: Pneumocystis Pneumonia in Adults and Adolescents With HIV",
        "url": "https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-opportunistic-infections/pneumocystis"
      },
      {
        "title": "NIH: Cryptococcosis in Adults and Adolescents With HIV",
        "url": "https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-opportunistic-infections/cryptococcosis"
      }
    ],
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-vibrio-shock-priorities",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "case",
    "format": "mcq",
    "stem": "A는 콜레라의 대량 수양성 설사·심한 탈수, B는 간경변 환자의 V. vulnificus 패혈증과 괴사성 하지 병변이다. 초기 처치의 핵심을 바르게 비교하면?",
    "choices": [
      "항균제 먼저 / 배양 확인 후 항균제",
      "수액·전해질 / 항균제·신속 외과 평가",
      "항균제 먼저 / 항균제·신속 외과 평가",
      "수액·전해질 / 항균제 후 괴사 경계 관찰",
      "지사제 먼저 / 배양 확인 후 외과 평가"
    ],
    "answer": 1,
    "explanation": "콜레라는 대량의 수분·전해질 손실에 대한 신속한 보충이 치료의 핵심이다. V. vulnificus의 빠른 패혈증·괴사성 연조직감염에서는 항균제와 쇼크 처치, 외과 평가를 지연하지 않는다. 해산물 연관성과 쇼크라는 공통 단서가 있어도 주요 손상 기전과 처치 우선순위가 다르다.",
    "choiceNotes": [
      "A의 중증 탈수 교정과 B의 신속 항균치료를 뒤로 미뤘다.",
      "콜레라의 체액 손실 교정과 괴사성 Vibrio 감염의 신속 항균제·외과 평가를 맞게 연결한다.",
      "B는 맞지만 A의 치료 중심은 대량 손실된 수분과 전해질의 신속 보충이다.",
      "A는 맞지만 빠르게 진행하는 괴사성 감염에서는 외과 평가를 지연하지 않는다.",
      "A의 탈수 교정을 지사제로 대체하거나 B의 치료·평가를 배양 결과까지 미루지 않는다."
    ],
    "keyClue": "독소성 수분 손실과 침습성 패혈증의 차이",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          8,
          9
        ]
      },
      {
        "doc": "261105_05",
        "pages": [
          10,
          11,
          13,
          14
        ]
      }
    ],
    "pages": [
      8,
      9
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261105_05-01",
        "lecture-261105_05-03"
      ],
      "reason": "기존은 각 Vibrio 종 동정을 따로 물었다. 새 문항은 두 원인균을 명시하고 동일한 쇼크 상황에서 수분 손실과 침습성 조직손상에 따른 처치 차이를 비교한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-specimen-context-priority",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "case",
    "format": "mcq",
    "stem": "A는 무증상 환자의 객담 Candida 양성, B는 증상·영상 근거 없이 한 번 검출된 호흡기 NTM, C는 발열·카테터 이상과 서로 다른 채혈의 동일 CNS 반복 양성이다. 검출 결과의 해석은?",
    "choices": [
      "A 침습성 폐렴 / B 활동성 결핵 / C 오염",
      "A 집락 가능 / B 임상 종합 / C 기구 관련 감염 의심",
      "A 진균혈증 / B 집락 불가 / C 피부 집락",
      "A 침습성 폐렴 / B 활동성 NTM 질환 확정 / C 오염",
      "A 집락 가능 / B 활동성 결핵 / C 감염 배제"
    ],
    "answer": 1,
    "explanation": "검출의 임상적 의미는 병원체 이름뿐 아니라 검체 부위·증상·영상·반복성에 따라 달라진다. 객담 Candida는 흔히 집락이며 NTM 한 번 검출만으로 질환을 확정하지 않는다. 반대로 발열·기구 이상과 독립 채혈의 동일 CNS 반복 검출은 기구 관련 혈류감염을 뒷받침한다.",
    "choiceNotes": [
      "객담 Candida와 단일 NTM 검출을 과잉 진단하고 C의 반복 근거를 무시했다.",
      "세 검체 맥락과 임상 근거의 강도를 바르게 비교했다.",
      "객담 검출을 진균혈증으로 바꿀 수 없고 C의 근거는 단순 피부 집락보다 강하다.",
      "A·B의 검출을 질환 확정으로 과대 해석하고 C를 단순 오염으로 보았다.",
      "NTM은 결핵균이 아니며 C의 반복 검출은 감염을 배제하는 근거가 아니다."
    ],
    "keyClue": "같은 양성 결과라도 검체·반복성·임상 일치가 다르다",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          4,
          10,
          12,
          22
        ]
      },
      {
        "doc": "261104_01",
        "pages": [
          33
        ]
      },
      {
        "doc": "261106_03",
        "pages": [
          40
        ]
      }
    ],
    "pages": [
      4,
      10,
      12,
      22
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261106_03-07",
        "lecture-bcase-261104_01-05"
      ],
      "reason": "기존은 NTM 단일 검출 또는 CNS 기구감염을 따로 판단했다. 새 문항은 세균·진균의 서로 다른 검체와 반복성 조건을 함께 비교해 양성 결과의 근거 강도를 구분한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-bacteria-black-lesion-three-etiologies",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "case",
    "format": "mcq",
    "stem": "A는 동물 접촉 뒤 통증이 적은 피부 가피·주변 부종, B는 가을 야외활동 뒤 발열·가피·림프절종대, C는 DKA 환자의 괴사성 부비동 병변이다. 대표 원인군의 연결은?",
    "choices": [
      "Orientia / B. anthracis / Mucorales",
      "B. anthracis / Mucorales / Orientia",
      "B. anthracis / Orientia / Mucorales",
      "Mucorales / Orientia / B. anthracis",
      "B. anthracis / R. prowazekii / Aspergillus"
    ],
    "answer": 2,
    "explanation": "가피나 검은 괴사라는 외형만으로 병원체를 정하지 않는다. 동물 관련 무통성 가피·부종은 피부 탄저, 가을 발열·가피·림프절종대는 쯔쯔가무시증, DKA의 괴사성 부비동 질환은 Mucorales 감염을 우선 연결한다.",
    "choiceNotes": [
      "A와 B의 노출·임상 연결을 바꾸었다.",
      "B는 Orientia, C는 Mucorales 연결이 더 맞는다.",
      "노출·숙주·병변 위치를 함께 반영한 연결이다.",
      "A와 C의 원인군을 바꾸었다.",
      "R. prowazekii는 가피형 쯔쯔가무시증의 원인이 아니며 C는 DKA 관련 Mucorales가 더 맞는다."
    ],
    "keyClue": "비슷한 검은 병변을 노출·숙주·해부학적 위치로 구분",
    "sourceRefs": [
      {
        "doc": "notes_bacteria",
        "pages": [
          18,
          21,
          24
        ]
      },
      {
        "doc": "261109_02",
        "pages": [
          40
        ]
      },
      {
        "doc": "261116_06",
        "pages": [
          23,
          24,
          25,
          26
        ]
      }
    ],
    "pages": [
      18,
      21,
      24
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated",
      "개인정리본",
      "비교"
    ],
    "summaryDoc": "notes_bacteria",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-integrated-scrub",
        "lecture-integrated-nov16-mold-nocardia"
      ],
      "reason": "기존은 각 가피 감염 또는 곰팡이 형태를 따로 물었다. 새 문항은 가피·괴사라는 비슷한 외형에서 동물 노출·가을 전신증상·DKA 부비동 병변을 교차 비교한다. 절지동물 자체의 병리 문항은 아니다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-dna-transcription-enzyme",
    "lecture": "261110_02",
    "topic": "261110_02",
    "kind": "basic",
    "format": "mcq",
    "stem": "Adenovirus와 poxvirus의 초기 mRNA 전사를 ‘장소·RNA 중합효소의 기원’으로 비교한 연결은?",
    "choices": [
      "핵·바이러스 / 세포질·숙주",
      "세포질·숙주 / 핵·바이러스",
      "핵·숙주 / 세포질·바이러스",
      "핵·숙주 / 핵·바이러스",
      "세포질·바이러스 / 세포질·숙주"
    ],
    "answer": 2,
    "explanation": "Adenovirus는 핵에서 숙주 RNA polymerase II로 초기 mRNA를 전사한다. Poxvirus는 세포질에서 입자에 포함된 바이러스 RNA polymerase로 초기 전사를 시작한다. 두 바이러스의 DNA 복제 효소와 mRNA 전사 효소도 구별한다.",
    "choiceNotes": [
      "전사 장소는 맞지만 효소의 기원을 서로 바꾸었다.",
      "두 바이러스의 전사 장소를 서로 바꾸었다.",
      "Adenovirus의 숙주 핵 전사와 poxvirus의 자체 세포질 전사를 함께 맞췄다.",
      "Poxvirus의 초기 전사는 핵에 의존하지 않는다.",
      "Adenovirus는 초기 전사에 숙주 핵 RNA polymerase를 이용한다."
    ],
    "keyClue": "같은 dsDNA라도 초기 전사 장소와 효소 의존성이 다르다.",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          2,
          3
        ]
      },
      {
        "doc": "261110_02",
        "pages": [
          8,
          26
        ]
      }
    ],
    "pages": [
      2,
      3
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "261110_02"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261110_02-ext-adeno-location",
        "lecture-261110_02-ext-pox-location"
      ],
      "reason": "기존 문항은 복제 장소를 각각 물었다. 새 문항은 초기 mRNA 전사라는 동일 단계에서 장소와 효소의 기원을 동시에 연결해 DNA 복제 효소와의 혼동까지 구별한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-cell-cycle-shared-target",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "세포주기 조절의 공통 숙주 표적을 기준으로 짝지었다. ‘pRb/E2F 축 — p53 축’ 순서로 옳은 것은?",
    "choices": [
      "Adeno E1A·HPV E7 — Adeno E1B·HPV E6",
      "Adeno E1B·HPV E6 — Adeno E1A·HPV E7",
      "Adeno E1A·HPV E6 — Adeno E1B·HPV E7",
      "Adeno E2·HPV E7 — Adeno E3·HPV E6",
      "Adeno E3·HPV E6 — Adeno E2·HPV E7"
    ],
    "answer": 0,
    "explanation": "Adenovirus E1A는 pRb/E2F 등 세포주기 경로를 조절하고 E1B는 p53·세포사멸 경로와 연결된다. 고위험 HPV에서는 E7이 pRb 기능을 억제하고 E6가 p53 분해를 촉진한다. 같은 숙주 축을 건드린다는 사실이 사람 발암 근거까지 같다는 뜻은 아니다.",
    "choiceNotes": [
      "두 바이러스의 서로 다른 이름을 공통 숙주 경로로 맞췄다.",
      "pRb와 p53에 해당하는 두 묶음을 서로 바꾸었다.",
      "HPV E6와 E7의 숙주 표적을 바꾸었다.",
      "Adenovirus E2는 주로 DNA 복제 관련 단백질이다.",
      "Adenovirus E3는 주로 면역조절과 연결된다."
    ],
    "keyClue": "Adeno E1A↔HPV E7, Adeno E1B↔HPV E6",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          2,
          18
        ]
      },
      {
        "doc": "261110_02",
        "pages": [
          9
        ]
      },
      {
        "doc": "261117_02",
        "pages": [
          10
        ]
      }
    ],
    "pages": [
      2,
      18
    ],
    "refs": [],
    "examRefs": [
      "2023년 82번 (유형 참고)",
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261104_03-02",
        "lecture-statement-261110_02-01"
      ],
      "reason": "기존의 HPV 대리표지자·아데노 특성 문항과 달리 두 바이러스 단백질의 이름을 숙주 pRb/p53 경로로 교차 정렬한다. 아데노의 사람 발암성을 추론하지 않도록 범위를 명시했다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-b19-hpv-target-genome",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "둘 다 비외피 DNA 바이러스이다. ‘B19 — HPV’의 유전체와 대표 표적세포를 바르게 연결한 것은?",
    "choices": [
      "선형 dsDNA·적혈구 전구세포 — 원형 ssDNA·편평상피",
      "원형 ssDNA·편평상피 — 선형 dsDNA·적혈구 전구세포",
      "선형 ssDNA·편평상피 — 원형 dsDNA·적혈구 전구세포",
      "원형 dsDNA·적혈구 전구세포 — 선형 ssDNA·편평상피",
      "선형 ssDNA·적혈구 전구세포 — 원형 dsDNA·편평상피"
    ],
    "answer": 4,
    "explanation": "B19는 선형 ssDNA를 갖고 분열 중인 적혈구 전구세포를 표적으로 한다. HPV는 원형 dsDNA를 가지며 피부·점막의 편평상피에 감염한다. 비외피라는 공통점만으로 유전체 가닥 수나 조직친화성을 묶을 수 없다.",
    "choiceNotes": [
      "두 바이러스의 DNA 가닥 수를 바꾸었다.",
      "형태와 표적을 모두 맞바꾼 연결이다.",
      "유전체는 맞지만 대표 표적세포를 서로 바꾸었다.",
      "B19와 HPV의 유전체 형태를 바꾸었다.",
      "가닥 수·형태·표적세포를 모두 맞췄다."
    ],
    "keyClue": "비외피 공통점 안의 선형 ssDNA/원형 dsDNA와 조혈/상피 차이",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          4,
          18
        ]
      },
      {
        "doc": "261111_01",
        "pages": [
          13
        ]
      },
      {
        "doc": "261117_02",
        "pages": [
          4
        ]
      }
    ],
    "pages": [
      4,
      18
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261111_01-ext-genome",
        "lecture-261111_01-ext-precursor",
        "path-image-04"
      ],
      "reason": "기존 B19 유전체·표적 및 HPV 조직상 단독 문항을 묶어 같은 비외피 DNA라는 조건 안에서 유전체 형태와 조직친화성을 동시에 판별하게 했다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-hpv-risk-pair",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "case",
    "format": "mcq",
    "stem": "두 HPV 관련 병변을 비교한다. ‘재발성 호흡기 유두종증 — 자궁경부 전암 병변’의 대표 유형 조합은?",
    "choices": [
      "16·18형 — 6·11형",
      "6·11형 — 16·18형",
      "6·16형 — 11·18형",
      "11·18형 — 6·16형",
      "2·27형 — 6·11형"
    ],
    "answer": 1,
    "explanation": "저위험 점막형 HPV 6·11은 재발성 호흡기 유두종증·첨형콘딜롬과 연결한다. 고위험 점막형 HPV 16·18 등은 자궁경부 전암 병변과 암에 연결한다. 사마귀성 병변이라는 표현만으로 고위험 유형을 확정하지 않는다.",
    "choiceNotes": [
      "저위험과 고위험 점막형의 대표 임상을 서로 바꾸었다.",
      "두 병변에 대응하는 대표 점막형을 맞췄다.",
      "6형과 16형의 위험군을 섞었다.",
      "11형과 18형의 위험군을 섞었다.",
      "2·27형은 대표적인 피부 사마귀 유형이며 두 점막 병변의 대응과 다르다."
    ],
    "keyClue": "호흡기 유두종 6·11 / 자궁경부 전암 16·18",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          18
        ]
      },
      {
        "doc": "261117_02",
        "pages": [
          8
        ]
      }
    ],
    "pages": [
      18
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "path-image-04",
        "lecture-261104_03-02"
      ],
      "reason": "기존의 사마귀 원인체 또는 고위험 HPV 표지자 질문과 달리 같은 HPV 안의 두 점막 임상상과 위험 유형을 한꺼번에 구별한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-vaccine-antigen-envelope",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "암 예방과 관련된 HPV·HBV 백신의 항원을 비교한다. ‘HPV — HBV’ 순서로 맞는 연결은?",
    "choices": [
      "E6·E7 발암 단백질 — HBsAg 외피 단백질",
      "L1 캡시드 단백질 — HBcAg 코어 단백질",
      "L2 캡시드 단백질 — HBeAg 분비 단백질",
      "L1 캡시드 단백질 — HBsAg 외피 단백질",
      "E1 헬리케이스 — HBV 중합효소"
    ],
    "answer": 3,
    "explanation": "HPV 예방백신은 주요 캡시드 단백질 L1의 바이러스 유사입자 항원을 이용한다. HBV 백신의 항원은 표면항원 HBsAg이다. 두 백신 모두 감염 예방으로 관련 암 부담을 줄일 수 있지만 항원이 놓이는 입자 구조는 다르다.",
    "choiceNotes": [
      "E6·E7은 발암 단백질로서 HPV 예방백신 항원 L1과 다르다.",
      "HBV 백신 항원은 HBcAg가 아니라 HBsAg이다.",
      "L2와 HBeAg를 각각 대표 예방백신 항원으로 연결하면 안 된다.",
      "HPV의 캡시드 항원과 HBV의 외피 표면항원을 구별했다.",
      "복제 효소는 이 두 예방백신의 대표 항원이 아니다."
    ],
    "keyClue": "HPV는 비외피 캡시드 L1, HBV는 외피 HBsAg",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          9,
          18
        ]
      },
      {
        "doc": "261112_03",
        "pages": [
          29
        ]
      },
      {
        "doc": "261117_02",
        "pages": [
          5,
          11
        ]
      }
    ],
    "pages": [
      9,
      18
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261112_03-ext-surface",
        "lecture-statement-final-261119_06-chronic-infectious-origin"
      ],
      "reason": "기존의 HBV 백신 항원·HPV 관련 암 사실을 재질문하지 않고, 암 예방이라는 공통 목적 아래 캡시드 항원과 외피 항원의 구조적 차이를 비교한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-polyoma-organ-triad",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "폴리오마바이러스를 ‘이식 후 신병증 — PML — 일부 메르켈세포암’ 순서로 연결하면?",
    "choices": [
      "JCPyV — BKPyV — MCPyV",
      "BKPyV — MCPyV — JCPyV",
      "BKPyV — JCPyV — MCPyV",
      "MCPyV — JCPyV — BKPyV",
      "JCPyV — MCPyV — BKPyV"
    ],
    "answer": 2,
    "explanation": "BKPyV는 신장이식 후 신병증 및 이식 후 출혈성 방광염, JCPyV는 세포면역 저하자의 PML, MCPyV는 일부 메르켈세포암과 연결한다. 같은 원형 dsDNA 계열이라도 대표 침범 장기가 다르다.",
    "choiceNotes": [
      "BK와 JC의 대표 장기를 서로 바꾸었다.",
      "JC와 MCPyV의 신경계 질환·종양 연결을 바꾸었다.",
      "세 바이러스의 대표 장기·질환을 모두 맞췄다.",
      "MCPyV를 이식 후 신병증의 대표 원인으로 연결했다.",
      "세 질환의 대응이 순환하여 바뀐 연결이다."
    ],
    "keyClue": "BK 신장 / JC 백질 / MCPyV 메르켈세포",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          18
        ]
      },
      {
        "doc": "261117_02",
        "pages": [
          14
        ]
      }
    ],
    "pages": [
      18
    ],
    "refs": [],
    "examRefs": [
      "2022년 55번 (유형 참고)",
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-statement-261104_02-02"
      ],
      "reason": "기존 decoy cell 사실에서 넓혀, 기존에 별도 활성 강의 단위가 없던 세 폴리오마바이러스의 장기·질환 지도를 동시에 판별한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-polyoma-specimen-context",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "case",
    "format": "mcq",
    "stem": "신장이식 후 신기능 저하와 면역저하자의 PML 의심을 각각 평가한다. ‘BKPyV 추적 — JCPyV 평가’에 맞는 조합은?",
    "choices": [
      "뇌척수액 DNA — 혈장 DNA와 신장 영상",
      "혈장 DNA — 뇌척수액 DNA와 뇌 MRI",
      "호흡기 항원 — 혈청 항체와 흉부 영상",
      "혈청 항체 — 소변 항원과 복부 영상",
      "뇌 MRI — 혈장 DNA와 신장 조직"
    ],
    "answer": 1,
    "explanation": "이식 후 BKPyV의 선별·추적에는 혈장 DNA가 이용된다. PML은 임상 경과, 뇌 MRI 백질 병변과 뇌척수액 JCPyV DNA를 종합한다. 어느 한 PCR 결과를 모든 장기 질환의 확진으로 확대하지 않는다.",
    "choiceNotes": [
      "BK와 JC의 임상 상황에 맞는 검체와 장기 평가를 서로 바꾸었다.",
      "신장 상황의 혈장 추적과 CNS 상황의 뇌척수액·뇌 MRI를 맞췄다.",
      "두 상황은 호흡기 항원검사나 흉부 영상으로 대표되지 않는다.",
      "항체·소변 항원 조합은 제시된 평가의 핵심이 아니다.",
      "영상과 검체를 각 바이러스의 침범 장기에 맞게 연결하지 않았다."
    ],
    "keyClue": "면역저하 공통점보다 침범 장기에 맞춘 검체·영상",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          17,
          18
        ]
      },
      {
        "doc": "261117_02",
        "pages": [
          16
        ]
      }
    ],
    "pages": [
      17,
      18
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-statement-261104_02-02",
        "lecture-261113_01-ext-cmv-drug"
      ],
      "reason": "기존 decoy cell·면역저하 CMV 문항과 달리 같은 폴리오마 내 신장과 CNS 상황에 맞는 검체·영상의 선택을 비교한다. 앞 문항의 질환명 삼중 연결과 평가축이 다르다."
    },
    "externalRefs": [
      {
        "title": "NIH: Progressive Multifocal Leukoencephalopathy / JC Virus",
        "url": "https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-opportunistic-infections/progressive"
      }
    ],
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-attachment-fusion-cross",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "‘수용체 부착 — 막 융합’ 역할을 HIV와 홍역에서 각각 연결한 것은?",
    "choices": [
      "HIV gp41—gp120 / 홍역 H—F",
      "HIV gp120—gp41 / 홍역 F—H",
      "HIV p24—gp41 / 홍역 H—L",
      "HIV gp120—p24 / 홍역 H—F",
      "HIV gp120—gp41 / 홍역 H—F"
    ],
    "answer": 4,
    "explanation": "HIV는 gp120으로 CD4와 보조수용체에 결합한 뒤 gp41이 막 융합을 매개한다. 홍역은 H가 부착, F가 막 융합을 담당한다. 단백질 이름이 달라도 부착과 융합이라는 두 기능을 구별할 수 있다.",
    "choiceNotes": [
      "HIV의 부착과 융합 단백질을 바꾸었다.",
      "홍역의 부착 H와 융합 F를 바꾸었다.",
      "p24는 HIV 캡시드이고 홍역 L은 중합효소이다.",
      "HIV p24는 막 융합 단백질이 아니다.",
      "두 바이러스 모두 부착 다음 융합이라는 기능 순서에 맞는다."
    ],
    "keyClue": "HIV gp120→gp41 / 홍역 H→F",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          7,
          18
        ]
      },
      {
        "doc": "261112_02",
        "pages": [
          8,
          10
        ]
      },
      {
        "doc": "261117_03",
        "pages": [
          8,
          9
        ]
      }
    ],
    "pages": [
      7,
      18
    ],
    "refs": [],
    "examRefs": [
      "2023년 85·86번 (유형 참고)",
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261112_02-ext-fusion",
        "lecture-261112_02-ext-attachment"
      ],
      "reason": "기존 홍역·paramyxo의 부착/융합 단독 사실을 HIV의 두 외피 단백질과 같은 기능축으로 교차 비교한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-retro-gag-pol-env",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "레트로바이러스에서 ‘캡시드 구성 — 역전사·통합 효소 — 외피 진입 단백질’의 유전자 순서는?",
    "choices": [
      "gag — pol — env",
      "pol — gag — env",
      "env — pol — gag",
      "gag — env — pol",
      "pol — env — gag"
    ],
    "answer": 0,
    "explanation": "gag는 기질·캡시드·뉴클레오캡시드 등 내부 구조 단백질, pol은 역전사효소·인테그라제 등, env는 수용체 결합과 막 융합에 관여하는 외피 단백질을 암호화한다.",
    "choiceNotes": [
      "내부 구조·효소·외피 기능을 순서대로 맞췄다.",
      "구조 단백질과 효소의 유전자를 바꾸었다.",
      "내부 구조와 외피 유전자를 바꾸었다.",
      "효소와 외피 유전자를 바꾸었다.",
      "세 기능을 담당하는 유전자의 대응이 모두 어긋난다."
    ],
    "keyClue": "gag 구조 / pol 효소 / env 외피",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          18
        ]
      },
      {
        "doc": "261117_03",
        "pages": [
          7
        ]
      }
    ],
    "pages": [
      18
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [],
      "reason": "기존 활성 문항에서 다루지 않은 정리본의 gag·pol·env를 세 기능군의 동시 연결로 추가한다. 원강의 39강의 입자·유전자 표로 확인했다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-hiv-htlv-tcell-outcome",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "역전사와 프로바이러스를 공통으로 갖는 HIV와 HTLV-1의 대표 병태를 각각 연결하면?",
    "choices": [
      "감염 T세포 클론 증식 — CD4 T세포 감소",
      "B세포 클론 증식 — 적혈구 전구세포 감소",
      "CD4 T세포 감소 — 감염 T세포 클론 증식",
      "적혈구 전구세포 감소 — B세포 클론 증식",
      "CD4 T세포 감소 — 감각신경절 잠복"
    ],
    "answer": 2,
    "explanation": "HIV의 대표 병태는 CD4 T세포 감소와 면역결핍이다. HTLV-1에서는 감염 T세포의 클론 증식과 관련된 성인 T세포 백혈병/림프종 등이 일부 환자에게 발생한다. 같은 바이러스과의 공통 생활사와 임상 결과를 구별한다.",
    "choiceNotes": [
      "두 레트로바이러스의 대표 병태를 바꾸었다.",
      "B세포와 적혈구 전구세포는 각각 EBV와 B19를 떠올릴 비교 단서이다.",
      "HIV의 면역결핍과 HTLV-1의 종양 관련 병태를 구별했다.",
      "B19와 EBV의 세포 단서를 두 레트로바이러스에 옮겼다.",
      "감각신경절 잠복은 HSV·VZV의 대표 연결이다."
    ],
    "keyClue": "같은 역전사·프로바이러스, 다른 T세포 임상 결과",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          18
        ]
      },
      {
        "doc": "261117_03",
        "pages": [
          4,
          16,
          17
        ]
      }
    ],
    "pages": [
      18
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261116_05-nov-pcp-prophylaxis",
        "lecture-statement-final-261119_06-chronic-infectious-origin"
      ],
      "reason": "기존 HIV 기회감염·감염성 발암의 개별 사실에서 넓혀 같은 레트로바이러스 내 세포 감소와 클론 증식을 대조한다. HTLV-1 감염 모두가 ATL로 진행한다는 뜻은 피했다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-hiv-test-purpose",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "case",
    "format": "mcq",
    "stem": "HIV 선별검사 반응성 검체의 판정과, 확진 환자의 치료 추적을 구별한다. ‘확진 — 바이러스 억제 — 면역 상태’에 맞는 조합은?",
    "choices": [
      "CD4 수 — 확인검사 — HIV RNA",
      "HIV RNA — CD4 수 — 선별검사",
      "선별검사 1회 — HIV 항체 — HIV RNA",
      "확인검사 — HIV RNA — CD4 수",
      "HIV 항체 — CD4 수 — 확인검사"
    ],
    "answer": 3,
    "explanation": "선별 반응성은 확인 절차를 거쳐 최종 판정한다. 확진 뒤 치료 추적에서는 HIV RNA가 바이러스량·억제를, CD4 T세포 수가 면역 상태를 평가한다. 검사 이름보다 검사 목적을 구분하는 문제이다.",
    "choiceNotes": [
      "CD4 수는 면역 지표로서 선별 반응성의 확진을 대신하지 않는다.",
      "바이러스량과 면역 지표를 서로 바꾸었고 선별검사를 면역 상태 지표로 사용했다.",
      "한 번의 선별 반응성만으로 확진하지 않으며 항체만으로 치료 억제를 판단하지 않는다.",
      "확인 절차·바이러스량·면역 지표를 각각의 목적에 맞췄다.",
      "항체검사·CD4·확인검사의 용도를 서로 바꾸었다."
    ],
    "keyClue": "선별 반응성≠최종 확진 / RNA는 바이러스 / CD4는 숙주",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          18
        ]
      },
      {
        "doc": "261117_03",
        "pages": [
          12
        ]
      }
    ],
    "pages": [
      18
    ],
    "refs": [],
    "examRefs": [
      "2022년 54번 (유형 참고)",
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261111_03-cbl-coinfection-assessment"
      ],
      "reason": "기존 Mpox 동반 HIV 선별검사 선택을 반복하지 않고, 선별 이후 최종 판정과 확진 후 두 추적 지표를 세 단계로 구분한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-art-three-stages",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "ART의 세 표적을 ‘DNA 생성 — 숙주 DNA 통합 — 입자 성숙’ 순서로 연결하면?",
    "choices": [
      "NRTI·NNRTI — INSTI — 단백분해효소 억제제",
      "INSTI — NRTI·NNRTI — 단백분해효소 억제제",
      "단백분해효소 억제제 — INSTI — NRTI·NNRTI",
      "NRTI·NNRTI — 단백분해효소 억제제 — INSTI",
      "INSTI — 단백분해효소 억제제 — NRTI·NNRTI"
    ],
    "answer": 0,
    "explanation": "NRTI·NNRTI는 역전사에 의한 바이러스 DNA 생성을, INSTI는 바이러스 DNA의 숙주 유전체 통합을, 단백분해효소 억제제는 전구체 절단과 입자 성숙을 차단한다. 모두 같은 단계의 약제가 아니므로 병합요법의 서로 다른 표적을 구별한다.",
    "choiceNotes": [
      "역전사·통합·성숙의 순서와 약제 계열이 맞는다.",
      "DNA 생성과 통합 단계의 계열을 바꾸었다.",
      "DNA 생성과 입자 성숙 단계의 계열을 바꾸었다.",
      "통합과 성숙 단계의 계열을 바꾸었다.",
      "세 단계의 약제 계열이 차례로 어긋난다."
    ],
    "keyClue": "역전사 → 통합 → 성숙",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          18
        ]
      },
      {
        "doc": "261117_03",
        "pages": [
          13
        ]
      }
    ],
    "pages": [
      18
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [],
      "reason": "기존 활성 문항에 없던 정리본의 ART 개념을 원강의의 세 생활사 표적과 연결해 확장했다. 용량·처방 선택이나 바이러스 제작 절차는 포함하지 않는다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-hbv-hiv-genome-rt",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "역전사를 이용한다는 공통점이 있는 HBV와 HIV를 비교한다. ‘감염성 입자의 유전체 — 대표 DNA 지속 형태’가 맞는 것은?",
    "choices": [
      "HBV RNA—프로바이러스 / HIV DNA—cccDNA",
      "HBV DNA—cccDNA / HIV RNA—프로바이러스",
      "HBV DNA—프로바이러스 / HIV RNA—cccDNA",
      "HBV RNA—cccDNA / HIV DNA—프로바이러스",
      "HBV DNA—감각신경절 잠복 / HIV RNA—cccDNA"
    ],
    "answer": 1,
    "explanation": "HBV 감염성 입자는 DNA를 가지며 핵의 cccDNA가 지속 감염의 저장고가 된다. HIV 입자는 RNA를 가지며 역전사된 DNA가 숙주 유전체에 통합되어 프로바이러스가 된다. 역전사 효소 사용만으로 RNA 바이러스로 분류하지 않는다.",
    "choiceNotes": [
      "입자 유전체와 지속 형태를 두 바이러스 사이에서 모두 바꾸었다.",
      "HBV의 DNA·cccDNA와 HIV의 RNA·프로바이러스를 맞췄다.",
      "입자 유전체는 맞지만 지속 DNA 형태를 바꾸었다.",
      "각 바이러스의 입자 유전체를 바꾸었다.",
      "감각신경절 잠복은 HBV의 대표 저장 형태가 아니다."
    ],
    "keyClue": "역전사 공통점과 입자 유전체·지속 DNA 형태의 차이",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          1,
          9,
          18
        ]
      },
      {
        "doc": "261112_03",
        "pages": [
          14,
          17,
          19
        ]
      },
      {
        "doc": "261117_03",
        "pages": [
          4,
          7
        ]
      }
    ],
    "pages": [
      1,
      9,
      18
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261112_03-ext-dna",
        "lecture-261112_03-ext-ccc-core2"
      ],
      "reason": "기존 HBV DNA·cccDNA 단독 사실을 HIV의 RNA·통합 DNA와 동시에 비교한다. HBV DNA의 숙주 통합 가능성을 부정하지 않고 대표 지속 저장고를 묻는다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-rabies-enterovirus-spread",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "표적 장기로 퍼지는 대표 경로를 비교한다. ‘Rabies virus의 CNS 도달 — enterovirus의 전신 파종’ 연결은?",
    "choices": [
      "혈행성 — 말초신경 축삭",
      "림프행성 — 말초신경 축삭",
      "말초신경 축삭 — 피부 표면 확산",
      "말초신경 축삭 — 혈행성",
      "혈행성 — 장관 내강 이동"
    ],
    "answer": 3,
    "explanation": "광견병 바이러스는 교상 부위에서 말초신경의 축삭을 따라 CNS로 진행하는 경로가 핵심이다. Enterovirus는 진입 후 바이러스혈증을 통해 원격 표적 장기로 파종하며 혈중 중화항체가 이를 억제하는 데 중요하다.",
    "choiceNotes": [
      "두 바이러스의 대표 장기 도달 경로를 서로 바꾸었다.",
      "Enterovirus의 전신 파종은 말초신경 축삭 이동으로 대표되지 않는다.",
      "피부 표면 확산만으로 enterovirus의 원격 장기 침범을 설명하지 못한다.",
      "광견병의 신경 경로와 enterovirus의 혈행성 파종을 구별했다.",
      "광견병의 대표 경로를 바꾸었고 장관 내강 이동은 전신 파종이 아니다."
    ],
    "keyClue": "Rabies 신경 축삭 / enterovirus 바이러스혈증",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          5,
          16
        ]
      },
      {
        "doc": "261111_02",
        "pages": [
          16,
          17
        ]
      },
      {
        "doc": "261117_01",
        "pages": [
          8
        ]
      }
    ],
    "pages": [
      5,
      16
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261111_02-ext-protection-core2",
        "lecture-261111_02-ext-polio"
      ],
      "reason": "기존 소아마비·혈중 중화항체 문항과 달리 CNS에 도달할 수 있는 두 RNA 바이러스의 서로 다른 파종 경로를 동시에 비교한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-rabies-human-animal-diagnosis",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "광견병 검사에서 ‘사람의 생전 평가 — 의심 동물의 사후 평가’에 맞는 연결은?",
    "choices": [
      "혈청 항체·소변 항원 — 타액 항체",
      "뇌 항원·뇌 항체 — 목덜미 피부 항원",
      "소변 RNA·혈청 항원 — 대변 RNA",
      "타액 RNA·피부 항원 — 뇌조직 dFA",
      "피부 항체·대변 RNA — 소변 항원"
    ],
    "answer": 3,
    "explanation": "사람의 생전 진단은 타액 RT-PCR, 목덜미 모낭 주변 피부 신경의 항원검사, 혈청·뇌척수액 항체 등 여러 검체·검사를 종합한다. 의심 동물의 뇌조직 dFA는 사후 검사로 구별한다.",
    "choiceNotes": [
      "사람의 생전 진단을 혈청 항체 한 번으로 정리할 수 없으며 이 소변·타액 조합은 강의의 대표 접근과 다르다.",
      "사람의 생전 여러 검체 평가와 동물의 사후 뇌조직 검사를 바꾸었다.",
      "소변·대변 검사는 제시된 사람 생전 평가와 동물 뇌조직 검사의 대표 연결이 아니다.",
      "사람의 타액 RNA·피부 신경 항원과 동물의 사후 뇌조직 항원을 맞췄다.",
      "목덜미 피부에서는 바이러스 항원을 확인하며 제시한 피부 항체·대변·소변 조합이 아니다."
    ],
    "keyClue": "사람 생전에는 여러 검체 / 동물 뇌 dFA는 사후",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          16
        ]
      },
      {
        "doc": "261117_01",
        "pages": [
          17,
          18
        ]
      }
    ],
    "pages": [
      16
    ],
    "refs": [],
    "examRefs": [
      "2025년 33번 (유형 참고)",
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [],
      "reason": "기존 활성 bank에 없던 광견병 진단을 원기출의 단순 검사명 재인에서 바꾸어 대상·검체·생전/사후라는 세 조건으로 구별한다."
    },
    "externalRefs": [
      {
        "title": "CDC: Laboratory Methods for Rabies Testing",
        "url": "https://www.cdc.gov/rabies/php/labs-specimens/testing.html"
      }
    ],
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-rabies-passive-active",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "case",
    "format": "mcq",
    "stem": "예방접종력이 없는 고위험 광견병 노출자에게 필요한 예방을 시행한다. ‘면역글로불린 — 백신’의 역할은?",
    "choices": [
      "능동면역·기억 형성 — 수동면역·즉시 중화",
      "수동면역·기억 형성 — 능동면역·즉시 중화",
      "능동면역·즉시 중화 — 수동면역·기억 형성",
      "수동면역·즉시 중화 — 수동면역·기억 형성",
      "수동면역·즉시 중화 — 능동면역·기억 형성"
    ],
    "answer": 4,
    "explanation": "면역글로불린은 이미 만들어진 항체를 제공하는 수동면역, 백신은 숙주의 항체 생성을 유도하는 능동면역이다. 광견병은 임상 발병 전에 노출 후 예방을 시행할 기회가 있으며, 이를 발병한 뇌염의 치료와 혼동하지 않는다.",
    "choiceNotes": [
      "면역글로불린과 백신의 수동/능동면역 성격을 서로 바꾸었다.",
      "투여 성격은 맞지만 즉시 항체 효과와 숙주의 면역 기억 형성 시점을 바꾸었다.",
      "면역글로불린은 수동 항체이며 백신이 능동면역과 면역 기억을 유도한다.",
      "면역글로불린은 수동면역이지만 백신은 숙주가 반응하는 능동면역이다.",
      "즉시 제공되는 항체와 뒤따르는 숙주의 항체·면역 기억 형성을 구별했다."
    ],
    "keyClue": "RIG 수동면역 / 백신 능동면역 / 임상 발병 전 예방",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          16
        ]
      },
      {
        "doc": "261117_01",
        "pages": [
          21,
          22
        ]
      }
    ],
    "pages": [
      16
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [],
      "reason": "기존 활성 bank에 없던 광견병 노출 후 예방을 투여 일정·용량 암기 대신 수동/능동면역의 시간적 역할 비교로 재구성했다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-slow-conventional-prion",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "지발성 CNS 질환을 병원체별로 정렬했다. ‘PML — SSPE — CJD’의 연결로 옳은 것은?",
    "choices": [
      "홍역바이러스 — JCPyV — prion",
      "JCPyV — prion — 홍역바이러스",
      "prion — 홍역바이러스 — JCPyV",
      "JCPyV — 홍역바이러스 — prion",
      "BKPyV — 홍역바이러스 — JCPyV"
    ],
    "answer": 3,
    "explanation": "PML은 JCPyV, SSPE는 홍역바이러스에 의한 conventional slow viral disease로 묶인다. CJD는 핵산 바이러스가 아닌 prion 질환이다. 경과가 길거나 CNS를 침범한다는 임상 공통점과 병원체 유형을 구별한다.",
    "choiceNotes": [
      "PML과 SSPE의 원인 바이러스를 서로 바꾸었다.",
      "SSPE와 CJD의 원인 유형을 서로 바꾸었다.",
      "PML과 CJD의 바이러스·prion 원인 유형을 바꾸었다.",
      "두 conventional 바이러스 질환과 prion 질환을 모두 맞췄다.",
      "PML은 BK가 아니라 JC이며 CJD는 JC 감염이 아니다."
    ],
    "keyClue": "PML=JC, SSPE=홍역, CJD=prion",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          7,
          17,
          18
        ]
      },
      {
        "doc": "261117_01",
        "pages": [
          26,
          27,
          29
        ]
      },
      {
        "doc": "261117_02",
        "pages": [
          14
        ]
      }
    ],
    "pages": [
      7,
      17,
      18
    ],
    "refs": [],
    "examRefs": [
      "2022년 55번 (유형 참고)",
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261112_02-ext-sspe",
        "path-general-23-q3-focus"
      ],
      "reason": "기존 SSPE 원인·prion 성질 각각의 문항을 넘어서 세 CNS 질환의 병원체와 conventional/prion 경계를 동시에 정렬한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-cjd-acquisition-types",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "case",
    "format": "mcq",
    "stem": "CJD의 세 배경을 비교한다. ‘PRNP 생식세포계열 변이 — 오염된 경막 이식 — BSE 관련 식품 노출’의 분류는?",
    "choices": [
      "의인성 — 가족성 — 변종",
      "가족성 — 의인성 — 변종",
      "가족성 — 변종 — 의인성",
      "산발성 — 가족성 — 의인성",
      "변종 — 의인성 — 가족성"
    ],
    "answer": 1,
    "explanation": "가족성 CJD는 PRNP의 생식세포계열 변이, 의인성 CJD는 오염된 이식물·의료 노출, 변종 CJD는 BSE와 관련된 획득 감염으로 구별한다. 변종 CJD를 PRNP 129번의 새 돌연변이로 정의하는 정리본 문장은 채택하지 않았다.",
    "choiceNotes": [
      "유전적 가족성 배경과 의료 관련 획득 감염을 바꾸었다.",
      "유전성·의료 관련 획득·BSE 관련 획득을 구별했다.",
      "경막 이식과 BSE 노출의 의인성/변종 연결을 바꾸었다.",
      "PRNP 생식세포계열 변이는 산발성보다는 가족성 배경이다.",
      "변종과 가족성의 원인 범주를 바꾸었다."
    ],
    "keyClue": "가족성=PRNP / 의인성=의료 노출 / 변종=BSE 관련",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          17
        ]
      },
      {
        "doc": "261117_01",
        "pages": [
          42
        ]
      }
    ],
    "pages": [
      17
    ],
    "refs": [],
    "examRefs": [
      "2025년 76번 (유형 참고)",
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "path-general-23-q3-focus"
      ],
      "reason": "기존 prion의 핵산·protease 성질 대신 CJD를 유전·의료 노출·BSE 관련 획득이라는 세 원인 범주로 비교한다."
    },
    "externalRefs": [
      {
        "title": "CDC: Classic Creutzfeldt–Jakob Disease",
        "url": "https://www.cdc.gov/creutzfeldt-jakob/about/"
      }
    ],
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-congenital-virus-matrix",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "선천 감염의 대표 결과를 ‘B19 — Rubella — Zika’ 순서로 연결한 것은?",
    "choices": [
      "소두증 — 태아 빈혈·수종 — 백내장·난청",
      "백내장·난청 — 소두증 — 태아 빈혈·수종",
      "태아 빈혈·수종 — 백내장·난청 — 소두증",
      "태아 빈혈·수종 — 소두증 — 백내장·난청",
      "백내장·난청 — 태아 빈혈·수종 — 소두증"
    ],
    "answer": 2,
    "explanation": "B19는 적혈구 전구세포 감염에 따른 태아 빈혈·수종, 선천성 풍진은 백내장·감각신경성 난청·심장기형, Zika는 태아 뇌 발달 이상·소두증과 대표적으로 연결한다. 실제 선천 감염의 소견이 한 항목에만 한정된다는 뜻은 아니다.",
    "choiceNotes": [
      "세 바이러스의 대표 결과가 순환하여 바뀌었다.",
      "B19·풍진·지카의 대표 결과를 각각 다른 바이러스에 연결했다.",
      "조혈계 손상·풍진의 대표 기형·지카의 뇌 발달 이상을 구별했다.",
      "풍진과 지카의 대표 소견을 서로 바꾸었다.",
      "B19와 풍진의 대표 결과를 서로 바꾸었다."
    ],
    "keyClue": "태아수종은 조혈 억제, 풍진은 백내장·난청, 지카는 뇌 발달",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          4,
          8,
          13
        ]
      },
      {
        "doc": "261111_01",
        "pages": [
          13
        ]
      },
      {
        "doc": "261112_02",
        "pages": [
          44
        ]
      },
      {
        "doc": "261116_02",
        "pages": [
          33
        ]
      }
    ],
    "pages": [
      4,
      8,
      13
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261111_01-ext-fetal",
        "lecture-261112_02-ext-congenital",
        "lecture-vcase-flavi-zika-congenital"
      ],
      "reason": "기존의 세 원인체별 단일 임상 사례를 반복하지 않고, 동일한 선천 감염 범주 안에서 조혈계 손상과 서로 다른 발달 이상을 삼중 비교한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-ebv-reactive-hiv-target",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "‘EBV의 잠복 B세포 — 단핵구증의 비정형 림프구 — HIV의 대표 표적 T세포’ 연결은?",
    "choices": [
      "기억 B — 반응성 CD8 — CD4",
      "기억 B — 감염 CD4 — CD8",
      "CD8 — 반응성 B — CD4",
      "CD4 — 반응성 CD8 — B",
      "기억 B — 반응성 CD4 — CD8"
    ],
    "answer": 0,
    "explanation": "EBV는 기억 B세포에 잠복하고, 감염성 단핵구증 말초혈액의 비정형 림프구는 이에 반응하는 CD8 T세포이다. HIV의 주요 수용체 CD4를 발현한 T세포와 구별한다. 감염 표적세포와 숙주 반응세포는 같지 않다.",
    "choiceNotes": [
      "잠복 세포·반응 세포·HIV 대표 T세포 표적을 모두 맞췄다.",
      "EBV 반응성 세포와 HIV 대표 T세포 표적을 바꾸었다.",
      "EBV의 잠복 B세포와 반응성 CD8 T세포를 바꾸었다.",
      "EBV 잠복 세포와 HIV의 대표 T세포 표적을 잘못 연결했다.",
      "CD4·CD8을 두 임상 상황 사이에서 바꾸었다."
    ],
    "keyClue": "EBV 감염 B / 반응 CD8 / HIV 표적 CD4",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          1,
          11,
          18
        ]
      },
      {
        "doc": "261113_01",
        "pages": [
          16,
          17
        ]
      },
      {
        "doc": "261117_03",
        "pages": [
          8,
          17
        ]
      }
    ],
    "pages": [
      1,
      11,
      18
    ],
    "refs": [],
    "examRefs": [
      "2022년 45번 (유형 참고)",
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261113_01-ext-ebv-latent",
        "lecture-261113_01-ext-atypical-cell",
        "lecture-statement-261113_01-09"
      ],
      "reason": "기존 EBV 잠복세포·비정형 림프구 단독 문항에 HIV의 CD4 표적을 더해 감염 표적과 반응 세포를 세 위치에서 구분하게 했다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-flavi-taxonomy-transmission",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "Dengue virus와 HCV는 모두 Flaviviridae에 속한다. 대표 전파 경로를 ‘Dengue — HCV’ 순서로 바르게 연결하면?",
    "choices": [
      "혈액 직접 노출 — 모기",
      "분변·경구 — 모기",
      "호흡기 — 분변·경구",
      "모기 — 혈액 직접 노출",
      "설치류 배설물 — 호흡기"
    ],
    "answer": 3,
    "explanation": "Dengue는 대표적인 모기 매개 감염이며 HCV는 혈액 노출을 중심으로 전파된다. 바이러스의 계통 분류와 arbovirus라는 전파 생태 범주는 같은 개념이 아니므로 Flaviviridae 전체를 모기 매개로 묶지 않는다.",
    "choiceNotes": [
      "두 바이러스의 대표 전파 경로를 서로 바꾸었다.",
      "Dengue를 HAV·HEV 같은 분변·경구 간염 경로에 옮겼다.",
      "호흡기·분변 경로는 두 바이러스의 대표 비교가 아니다.",
      "같은 과에서도 대표 전파 생태가 다름을 맞췄다.",
      "설치류 배설물은 한타바이러스의 대표 역학 단서이다."
    ],
    "keyClue": "계통상 같은 과 ≠ 같은 전파 생태",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          10,
          12,
          13
        ]
      },
      {
        "doc": "261112_03",
        "pages": [
          31
        ]
      },
      {
        "doc": "261116_02",
        "pages": [
          25,
          32
        ]
      }
    ],
    "pages": [
      10,
      12,
      13
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261112_03-ext-hcv-family",
        "lecture-261116_02-nov-biologic-vector"
      ],
      "reason": "기존 HCV 분류·arbovirus 정의를 각각 묻는 문항에서 바꾸어, 같은 Flaviviridae라는 조건이 전파 경로의 동일성을 보장하지 않는 관계를 확인한다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-reassortment-recombination",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "‘Influenza A·rotavirus의 분절 조합 변화 — coronavirus의 RNA 서열 재조합’을 구별한 용어 연결은?",
    "choices": [
      "표현형 혼합 — 재편성",
      "재조합 — 보완",
      "재편성 — 간섭",
      "재조합 — 표현형 혼합",
      "재편성 — 재조합"
    ],
    "answer": 4,
    "explanation": "Reassortment(재편성)는 분절 유전체의 조합 변화이며 influenza A와 rotavirus 같은 분절 RNA 바이러스에 연결한다. Coronavirus의 비분절 RNA에서 일어나는 서열 재조합은 recombination으로 구별한다. 둘 다 유전적 변화이지만 분절이라는 구조적 전제가 다르다.",
    "choiceNotes": [
      "표현형 혼합은 유전체 분절 조합 변화가 아니다.",
      "분절 조합 변화와 유전자 산물의 보완을 혼동했다.",
      "Coronavirus의 서열 재조합은 다른 바이러스의 억제인 간섭이 아니다.",
      "두 번째 현상은 표면 단백질 조합이 아니라 RNA 서열의 변화이다.",
      "분절 단위 조합과 서열 수준 재조합을 구별했다."
    ],
    "keyClue": "분절 조합=reassortment / 서열 재조합=recombination",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          2,
          5,
          19,
          20
        ]
      },
      {
        "doc": "261112_01",
        "pages": [
          5
        ]
      },
      {
        "doc": "261118_05",
        "pages": [
          7,
          48
        ]
      }
    ],
    "pages": [
      2,
      5,
      19,
      20
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261112_01-ext-shift",
        "lecture-statement-261118_05-03",
        "lecture-final-261119_06-genetic-versus-geographic"
      ],
      "reason": "기존 influenza shift 또는 rotavirus 분절 수를 독립적으로 묻던 구조에서, 분절 RNA 두 계열과 비분절 coronavirus의 변화 단위를 동시에 비교한다. 실행 실험이나 변이 설계 조건은 묻지 않는다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-genotype-versus-coat",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "바이러스 상호작용을 ‘유전체 정보의 조합 변화 — 유전형을 유지한 표면 단백질 조합 변화’로 비교하면?",
    "choices": [
      "보완 — 재조합",
      "재조합 — 표현형 혼합",
      "표현형 혼합 — 간섭",
      "간섭 — 재편성",
      "표현형 혼합 — 재조합"
    ],
    "answer": 1,
    "explanation": "유전체 정보 자체가 새로 조합되는 유전적 재조합과, 유전형 변화 없이 입자의 캡시드·외피 단백질 조합이 달라지는 표현형 혼합을 구별한다. 표면 성질의 변화만으로 유전체 서열이 바뀌었다고 결론내리지 않는다.",
    "choiceNotes": [
      "보완은 유전자 산물의 기능 공급으로서 유전체 조합 변화와 다르다.",
      "유전 정보의 변화와 입자 표면 표현형의 변화를 구별했다.",
      "표현형 혼합을 유전체 변화로, 간섭을 표면 조합 변화로 연결했다.",
      "간섭은 억제 현상이고 재편성은 분절 유전체 조합 변화이다.",
      "유전체 변화와 표면 표현형 변화를 서로 바꾸었다."
    ],
    "keyClue": "유전형 변화와 입자 표현형 변화는 구별한다.",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          2
        ]
      }
    ],
    "pages": [
      2
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-261112_01-ext-shift"
      ],
      "reason": "기존 bank가 다룬 influenza 항원 변화에서 확장해 정리본 2쪽의 유전적·비유전적 상호작용 경계를 묻는다. 특정 바이러스의 제작·감염 실험이나 외피 교체 방법은 포함하지 않는다."
    },
    "addedBatch": "20261120-final"
  },
  {
    "id": "lecture-summary-virus-complement-interference-direction",
    "lecture": "integrated",
    "topic": "integrated",
    "kind": "basic",
    "format": "mcq",
    "stem": "유전형 변화 없는 두 상호작용이다. ‘부족한 기능의 보충 — 결손 입자와의 경쟁에 따른 정상 바이러스 억제’ 연결은?",
    "choices": [
      "간섭 — 보완",
      "표현형 혼합 — 재조합",
      "재편성 — 보완",
      "보완 — 간섭",
      "보완 — 재편성"
    ],
    "answer": 3,
    "explanation": "Complementation(보완)은 유전자 산물의 기능이 보충되는 현상이고, interference(간섭)는 한 바이러스의 증식이 억제되는 현상이다. Defective interfering particle(DIP)은 정상 바이러스 기능에 의존하면서 정상 바이러스를 억제할 수 있어, 도움을 받는다는 사실과 결과의 방향을 구별한다.",
    "choiceNotes": [
      "기능 보충과 억제라는 결과의 방향을 서로 바꾸었다.",
      "표면 표현형 변화나 유전적 재조합은 제시한 두 기능 관계와 다르다.",
      "분절 유전체 조합 변화는 기능 보충과 다르다.",
      "기능 보완과 경쟁·억제라는 비유전적 상호작용을 구별했다.",
      "결손 입자에 의한 억제는 분절 조합의 재편성 자체가 아니다."
    ],
    "keyClue": "helper 의존성과 정상 바이러스에 미치는 효과의 방향은 별개",
    "sourceRefs": [
      {
        "doc": "notes_virus",
        "pages": [
          2,
          6
        ]
      },
      {
        "doc": "261112_01",
        "pages": [
          24
        ]
      },
      {
        "doc": "261112_02",
        "pages": [
          41
        ]
      }
    ],
    "pages": [
      2,
      6
    ],
    "refs": [],
    "examRefs": [
      "강의·정리본 핵심 재구성"
    ],
    "noteRefs": [],
    "tags": [
      "integrated"
    ],
    "summaryDoc": "notes_virus",
    "sourceScope": "personal-summary",
    "novelty": {
      "relatedQuestionIds": [
        "lecture-statement-261112_01-08"
      ],
      "reason": "기존 drift/shift 문항과 달리 정리본의 보완과 DIP 간섭을 기능 변화의 방향으로 비교한다. DIP의 생성·증폭·회수 조건 없이 정성적 이론에 한정했다."
    },
    "addedBatch": "20261120-final"
  }
];
export const SUMMARY_FACT_GROUPS={
  "notes_general": [
    {
      "id": "statement-fact-summary-general-resistance-label-versus-transmission-route",
      "lecture": "261119_03",
      "truth": "다제내성 폐결핵과 VRE 모두 항균제 내성이 있지만, 전파 차단은 각각 공기주의와 접촉주의를 기본으로 구분한다.",
      "falsehood": "다제내성 폐결핵과 VRE 모두 항균제 내성이 있으므로, 전파 차단은 각각 접촉주의와 접촉주의를 기본으로 구분한다.",
      "why": "항균제 내성은 치료약제 선택의 축이고, 전파경로별 주의는 병원체의 실제 전파 방식에 따른다. 내성이라는 공통 표지로 결핵의 공기전파를 접촉전파로 바꾸어 해석하지 않는다.",
      "axis": "내성과 전파경로의 독립성",
      "sourceRefs": [
        {
          "doc": "notes_general",
          "pages": [
            10,
            12,
            16
          ]
        },
        {
          "doc": "261119_03",
          "pages": [
            10,
            11
          ]
        },
        {
          "doc": "261109_05",
          "pages": [
            64,
            65
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_general",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261109_05-ext-vre-contact",
          "lecture-261109_05-ext-airborne"
        ],
        "reason": "기존 VRE·결핵의 주의법을 개별 암기하는 것과 달리 두 질환 모두 내성균이라는 조건을 고정해, 치료 특성과 전파경로가 서로 다른 분류축임을 묻는다."
      }
    },
    {
      "id": "statement-fact-summary-general-external-internal-threat-prevention-match",
      "lecture": "261118_02",
      "truth": "이식 환자의 공사 먼지 Aspergillus 위험에는 환경 노출 관리가, 잠복 CMV 위험에는 선별·감시와 예방 또는 선제 치료가 각각 중요하다.",
      "falsehood": "이식 환자의 공사 먼지 Aspergillus 위험과 잠복 CMV의 재활성화 위험은 모두 공사구역 환경 노출 관리로 직접 예방한다.",
      "why": "환경에서 새로 유입되는 병원체와 몸속 잠복 병원체의 재활성화는 예방 표적이 다르다. 공사구역 관리는 흡입 노출을 줄이고, CMV 선별·예방·PCR 감시는 잠복 또는 이식 관련 CMV 위험을 다룬다.",
      "axis": "병원체 유래에 따른 예방 표적",
      "sourceRefs": [
        {
          "doc": "notes_general",
          "pages": [
            13,
            14
          ]
        },
        {
          "doc": "261118_02",
          "pages": [
            8,
            28,
            29,
            31
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_general",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-statement-261118_02-02",
          "lecture-261118_02-nov18-endogenous",
          "lecture-final-261119_07-water-air-surface"
        ],
        "reason": "기존 환경/체내 유래 구별과 CMV 이름 선택을 넘어 같은 이식 숙주에게 서로 다른 예방수단을 배정한다. 병원체의 유래가 실제 예방 표적을 바꾸는 연결을 새로 시험한다."
      }
    },
    {
      "id": "statement-fact-summary-general-postdiarrhea-isolation-versus-exposure-clock",
      "lecture": "261119_01",
      "truth": "C. difficile 접촉주의의 설사 소실 후 기준은 전파 위험을 관리하는 시계이며, 노출 시점부터 잠복기를 고려하는 검역 시계와 구별한다.",
      "falsehood": "C. difficile 접촉주의의 설사 소실 후 기준은 노출 시점부터 잠복기를 고려하는 검역 시계와 같은 시작점을 사용한다.",
      "why": "검역은 노출되었으나 감염 여부가 불명확한 사람을 잠복기를 고려해 관리한다. C. difficile 접촉주의는 의심·확인 환자의 전파 위험을 관리하며, 강의는 설사 소실 후 최소 48시간이라는 별도 기준점을 제시한다.",
      "axis": "노출자 관리와 환자 관리의 시간 기준",
      "sourceRefs": [
        {
          "doc": "notes_general",
          "pages": [
            14,
            19
          ]
        },
        {
          "doc": "261119_01",
          "pages": [
            16
          ]
        },
        {
          "doc": "261119_07",
          "pages": [
            41
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_general",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261119_01-nov19-quarantine-isolation-target",
          "lecture-final-261119_07-cdiff-isolation-endpoint"
        ],
        "reason": "기존 검역/격리의 대상 구분과 C. difficile의 48시간 기준을 서로 다른 시작점의 시간축으로 비교한다. 잠복기만큼 기다리는 규칙을 회복 후 접촉주의에 그대로 적용하는 새 오류를 판별한다."
      }
    },
    {
      "id": "statement-fact-summary-general-defense-restoration-versus-direct-prophylaxis",
      "lecture": "261118_02",
      "truth": "호중구감소에 쓰는 G-CSF는 숙주 방어 회복, PCP 예방의 TMP-SMX는 특정 감염 위험에 대한 예방적 투약에 해당한다.",
      "falsehood": "호중구감소에 쓰는 G-CSF와 PCP 예방의 TMP-SMX는 모두 호중구 생성을 회복시켜 감염을 예방하는 약제에 해당한다.",
      "why": "예방전략에는 손상된 방어기전을 회복시키는 조치와 병원체를 직접 겨냥한 투약이 있다. G-CSF는 호중구 회복을 돕고 TMP-SMX는 적응증이 있는 숙주에서 PCP 예방에 사용된다. 두 조치는 목적과 표적이 다르다.",
      "axis": "숙주 표적과 병원체 표적 예방",
      "sourceRefs": [
        {
          "doc": "notes_general",
          "pages": [
            13,
            14
          ]
        },
        {
          "doc": "261118_02",
          "pages": [
            26,
            31,
            32
          ]
        },
        {
          "doc": "261116_05",
          "pages": [
            38,
            39
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_general",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-statement-261118_02-20",
          "lecture-261118_02-nov18-pcp-prophylaxis"
        ],
        "reason": "기존 G-CSF/ART의 회복 세포와 TMP-SMX 약제 선택을 반복하지 않는다. 숙주 기능을 회복시키는 조치와 특정 감염에 대한 직접 예방을 다른 치료 표적으로 분류하는 연결을 추가한다."
      }
    },
    {
      "id": "statement-fact-summary-general-endemicity-versus-clinical-severity",
      "lecture": "261119_02",
      "truth": "풍토성 여부는 특정 집단에서의 지속적인 발생 양상을, 치명률은 임상적 발병자 중 사망 비율을 나타내므로 서로 다른 축이다.",
      "falsehood": "풍토성 여부는 특정 집단의 감염병에서 치명률이 낮아졌는지를 기준으로 분류하므로, 풍토병은 낮은 치명률을 뜻한다.",
      "why": "풍토병은 지역·집단에서 병원체와 질병 발생이 지속된다는 역학적 분류이다. 치명률은 현성발병자 중 사망 비율로, 지속 발생 여부만으로 그 크기를 정할 수 없다.",
      "axis": "발생 양상과 중증도 지표의 독립성",
      "sourceRefs": [
        {
          "doc": "notes_general",
          "pages": [
            14,
            16
          ]
        },
        {
          "doc": "261119_01",
          "pages": [
            18
          ]
        },
        {
          "doc": "261119_02",
          "pages": [
            10,
            15,
            16
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_general",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261119_02-nov19-outbreak-baseline",
          "lecture-261119_01-nov19-virulence-fatality-endpoints"
        ],
        "reason": "기존 풍토병·유행병의 정의와 치명률 계산을 연결하여 지속 유행=가벼운 질환이라는 추론 오류를 판별한다. 발생의 시간·공간 축과 환자 중 사망이라는 분모 축을 구별하는 새 관계이다."
      }
    },
    {
      "id": "statement-fact-summary-general-case-control-sampling-not-attack-rate",
      "lecture": "261119_02",
      "truth": "환자 9명과 대조군 36명을 선정한 환자-대조군 연구에서 9/45를 해당 지역의 발병률로 계산할 수는 없다.",
      "falsehood": "환자 9명과 대조군 36명을 선정한 환자-대조군 연구에서 9/45는 해당 지역의 발병률이다.",
      "why": "환자-대조군 연구는 발병 여부에 따라 표본을 선정하므로 대조군의 선정 규모가 지역 전체의 위험 인구를 뜻하지 않는다. 노출과 질병의 연관성은 이 표에서 OR로 평가하며, 지역 발병률의 분모를 표본 전체로 대체하지 않는다.",
      "axis": "연구 표본과 위험 인구 분모",
      "sourceRefs": [
        {
          "doc": "notes_general",
          "pages": [
            14,
            16
          ]
        },
        {
          "doc": "261119_01",
          "pages": [
            18,
            19
          ]
        },
        {
          "doc": "261119_02",
          "pages": [
            27,
            28,
            29
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_general",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261119_02-nov19-case-control-choice",
          "lecture-261119_02-nov19-case-control-odds-ratio",
          "lecture-261119_02-nov19-cohort-risk-ratio"
        ],
        "reason": "기존 연구설계 선택·OR 산술을 넘어 발병 여부로 선정한 표본의 비율을 모집단 발병률로 오인하는 분모 문제를 추가한다. 후향적 코호트의 전체 참석자 분모와 왜 다른지를 시험한다."
      }
    }
  ],
  "notes_bacteria": [
    {
      "id": "statement-fact-summary-bacteria-hemolysis-catalase-independent",
      "lecture": "261104_01",
      "truth": "S. aureus와 S. pyogenes는 모두 β용혈을 보일 수 있지만, catalase는 전자가 양성이고 후자가 음성이다.",
      "falsehood": "S. aureus와 S. pyogenes는 모두 β용혈을 보이므로, catalase도 두 균에서 양성이다.",
      "why": "용혈은 적혈구에 대한 작용, catalase는 과산화수소 분해 반응이므로 서로 독립적인 감별 축이다. β용혈이라는 공통점이 catalase 반응의 일치를 뜻하지 않는다.",
      "axis": "용혈과 catalase의 독립성",
      "sourceRefs": [
        {
          "doc": "notes_bacteria",
          "pages": [
            3,
            4,
            5
          ]
        },
        {
          "doc": "261104_01",
          "pages": [
            14
          ]
        },
        {
          "doc": "261105_01",
          "pages": [
            3,
            16
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_bacteria",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261104_01-09",
          "lecture-261105_01-01"
        ],
        "reason": "기존은 catalase 또는 β용혈을 단독 동정 단서로 사용했다. 새 앵커는 동일 용혈 양상으로 효소 반응을 추정할 수 없다는 두 감별 축의 관계를 비교한다."
      }
    },
    {
      "id": "statement-fact-summary-bacteria-capsule-function-chemistry",
      "lecture": "261109_02",
      "truth": "탄저균의 poly-D-glutamic acid 협막과 Cryptococcus의 다당류 협막은 항식균 기능을 공유하지만 화학적 성분은 다르다.",
      "falsehood": "탄저균의 협막도 Cryptococcus처럼 다당류로 이루어져 항식균 작용을 한다.",
      "why": "협막의 기능과 성분은 별개의 축이다. 탄저균은 polypeptide인 poly-D-glutamic acid, Cryptococcus는 다당류 협막을 갖는다.",
      "axis": "동일한 항식균 기능과 다른 협막 성분",
      "sourceRefs": [
        {
          "doc": "notes_bacteria",
          "pages": [
            18,
            24
          ]
        },
        {
          "doc": "261109_02",
          "pages": [
            34,
            38
          ]
        },
        {
          "doc": "261116_06",
          "pages": [
            19
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_bacteria",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261109_02-basic-anthrax-capsule",
          "lecture-261116_06-nov-crypto-antigen-ink"
        ],
        "reason": "기존의 탄저 협막 성분이나 Cryptococcus 검사 단독 질문과 달리, 세균·진균에서 기능적 유사성과 화학적 차이를 함께 비교한다."
      }
    },
    {
      "id": "statement-fact-summary-bacteria-ros-generation-detoxification",
      "lecture": "261106_05",
      "truth": "녹농균의 pyocyanin은 ROS 생성·조직손상에, Nocardia의 catalase는 과산화수소 분해·산화스트레스 방어에 기여한다.",
      "falsehood": "녹농균의 pyocyanin과 Nocardia의 catalase는 모두 ROS를 생성하여 숙주 조직을 손상시킨다.",
      "why": "Pyocyanin은 산화환원 활성 색소로 ROS 생성을 촉진한다. Catalase는 과산화수소를 분해하므로 두 인자의 ROS 관련 작용 방향이 다르다.",
      "axis": "ROS 생성과 제거",
      "sourceRefs": [
        {
          "doc": "notes_bacteria",
          "pages": [
            10,
            14
          ]
        },
        {
          "doc": "261105_05",
          "pages": [
            34
          ]
        },
        {
          "doc": "261106_05",
          "pages": [
            29
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_bacteria",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261105_05-basic-pyocyanin",
          "lecture-261106_05-06"
        ],
        "reason": "기존은 색소명이나 Nocardia 동정을 물었다. 새 앵커는 두 기회감염균의 산화스트레스 관련 인자를 생성·해독이라는 반대 방향으로 비교한다."
      }
    },
    {
      "id": "statement-fact-summary-bacteria-intracellular-lps-exception",
      "lecture": "261110_03",
      "truth": "Chlamydia와 Orientia는 모두 절대세포내 세균이지만, LPS는 Chlamydia에 있고 Orientia에는 없다.",
      "falsehood": "Chlamydia와 Orientia는 모두 절대세포내 세균이므로, 두 균 모두 LPS가 없다.",
      "why": "절대세포내 생활양식만으로 외피의 LPS 보유를 예측하지 않는다. Chlamydia는 LPS를 갖고 Orientia는 LPS가 없는 예외에 해당한다.",
      "axis": "숙주 의존성과 외피 조성",
      "sourceRefs": [
        {
          "doc": "notes_bacteria",
          "pages": [
            11,
            21
          ]
        },
        {
          "doc": "261105_06",
          "pages": [
            13
          ]
        },
        {
          "doc": "261110_03",
          "pages": [
            4
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_bacteria",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261105_06-basic-inclusion",
          "lecture-statement-261110_03-01"
        ],
        "reason": "기존의 Chlamydia 생활사 또는 리케치아군 외피 단독 항목을, 서로 다른 강의의 절대세포내 세균에서 LPS 유무가 갈리는 비교로 연결한다."
      }
    },
    {
      "id": "statement-fact-summary-bacteria-flagellar-location",
      "lecture": "261110_01",
      "truth": "Leptospira의 endoflagella는 외막 안쪽 공간에, V. cholerae의 극성 편모는 균체 바깥쪽에 위치하며 둘 다 운동에 관여한다.",
      "falsehood": "Leptospira의 endoflagella는 V. cholerae의 극성 편모처럼 균체 바깥쪽에 위치하여 운동에 관여한다.",
      "why": "Spirochete의 axial filament 또는 endoflagella는 외막 아래의 periplasm에 있다. 비브리오의 외부 극성 편모와 운동 기능은 공유하지만 위치가 다르다.",
      "axis": "내부편모와 외부 극성편모",
      "sourceRefs": [
        {
          "doc": "notes_bacteria",
          "pages": [
            8,
            20
          ]
        },
        {
          "doc": "261110_01",
          "pages": [
            4,
            19
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_bacteria",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-integrated-lyme",
          "lecture-261105_05-03"
        ],
        "reason": "기존의 나선균·콜레라 임상 동정에서 더 나아가 외부 극성 편모와 스피로헤타 내부편모의 해부학적 위치를 비교한다. 배양·조작 조건은 다루지 않는다."
      }
    },
    {
      "id": "statement-fact-summary-bacteria-wall-drug-targets",
      "lecture": "261106_03",
      "truth": "Isoniazid는 항산균의 mycolic acid 형성을, echinocandin은 진균의 β-(1,3)-D-glucan 합성을 방해한다.",
      "falsehood": "Isoniazid는 항산균의 mycolic acid 형성을, echinocandin도 진균의 mycolic acid 형성을 방해한다.",
      "why": "세포 외피 합성을 방해한다는 공통 설명만으로 표적을 같게 보지 않는다. Isoniazid는 mycolic acid 형성, echinocandin은 진균 세포벽 glucan synthase 억제와 연결한다.",
      "axis": "세균·진균 외피 약물의 표적",
      "sourceRefs": [
        {
          "doc": "notes_bacteria",
          "pages": [
            12,
            22
          ]
        },
        {
          "doc": "261106_03",
          "pages": [
            24
          ]
        },
        {
          "doc": "261116_05",
          "pages": [
            18
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_bacteria",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261106_03-basic-mycolic",
          "lecture-statement-261116_05-04"
        ],
        "reason": "기존의 항산성 지질이나 항진균제 계열 회상과 달리, 항균제·항진균제가 서로 다른 외피 성분인 지질과 glucan을 겨냥함을 비교한다."
      }
    },
    {
      "id": "statement-fact-summary-bacteria-antigen-change-recurrence",
      "lecture": "261110_01",
      "truth": "임균의 pili 항원변이는 재감염에, 재귀열 Borrelia의 Vmp 항원변이는 같은 감염 경과 중 반복 균혈증에 기여한다.",
      "falsehood": "임균의 pili 항원변이는 재감염에 기여하지만, 재귀열 Borrelia는 Vmp 항원형을 고정하여 반복 균혈증을 일으킨다.",
      "why": "임균은 표면 항원 변이를 통해 기존 면역을 회피할 수 있다. 재귀열에서는 Vmp 항원형이 바뀌면서 앞선 항체 반응을 피한 균 집단이 늘어 반복 발열·균혈증을 일으킨다.",
      "axis": "항원변이와 재감염·재귀의 구분",
      "sourceRefs": [
        {
          "doc": "notes_bacteria",
          "pages": [
            17,
            20
          ]
        },
        {
          "doc": "261109_01",
          "pages": [
            23,
            25
          ]
        },
        {
          "doc": "261110_01",
          "pages": [
            12
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_bacteria",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-integrated-urethritis",
          "lecture-integrated-relapsing"
        ],
        "reason": "기존의 임균 동정과 Vmp 재귀열 동정을, 항원변이라는 공통 회피전략이 외부 재감염과 같은 감염 중 재귀라는 다른 경과에 연결되는 비교로 구성한다."
      }
    },
    {
      "id": "statement-fact-summary-bacteria-toxin-modification-target-outcome",
      "lecture": "261106_05",
      "truth": "디프테리아 독소·녹농균 exotoxin A는 EF-2의 ADP-ribosylation으로 번역을 억제하고, TcdA·TcdB는 Rho·Rac의 glycosylation으로 장벽을 교란한다.",
      "falsehood": "디프테리아 독소·녹농균 exotoxin A는 EF-2의 glycosylation으로 번역을 억제하고, TcdA·TcdB는 Rho·Rac의 glycosylation으로 장벽을 교란한다.",
      "why": "디프테리아 독소와 녹농균 exotoxin A는 EF-2를 ADP-ribosylation한다. TcdA·TcdB는 Rho·Rac GTPase를 glycosylation한다. 표적 단백질·화학적 변형·숙주 결과를 함께 구분한다.",
      "axis": "화학적 변형·표적·임상 결과",
      "sourceRefs": [
        {
          "doc": "notes_bacteria",
          "pages": [
            10,
            13,
            15
          ]
        },
        {
          "doc": "261105_05",
          "pages": [
            34
          ]
        },
        {
          "doc": "261106_05",
          "pages": [
            12
          ]
        },
        {
          "doc": "261106_06",
          "pages": [
            31
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_bacteria",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261105_05-10",
          "lecture-261106_06-04"
        ],
        "reason": "기존 EF-2 공유표적 또는 TcdA/B 표적 단독 질문과 달리, 세 독소의 화학적 변형까지 포함하여 번역 억제와 장벽 손상을 교차 비교한다."
      }
    }
  ],
  "notes_virus": [
    {
      "id": "statement-fact-summary-virus-hpv-e1-e2-functions",
      "lecture": "integrated",
      "truth": "HPV E1은 DNA 복제 헬리케이스, E2는 DNA 복제와 E6·E7 전사 조절에 관여한다.",
      "falsehood": "HPV E2는 DNA 복제 헬리케이스, E1은 DNA 복제와 E6·E7 전사 조절에 관여한다.",
      "why": "HPV 초기 단백질 중 E1의 헬리케이스 기능과 E2의 복제·전사 조절 기능을 구별한다. 발암 단백질 E6·E7 및 후기 캡시드 단백질 L1·L2와도 역할이 다르다.",
      "axis": "HPV 초기 복제·전사 단백질",
      "sourceRefs": [
        {
          "doc": "notes_virus",
          "pages": [
            18
          ]
        },
        {
          "doc": "261117_02",
          "pages": [
            5
          ]
        }
      ],
      "examRefs": [
        "2023년 82번 (유형 참고)",
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_virus",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261104_03-02"
        ],
        "reason": "기존 고위험 HPV 표지자와 달리 기존 활성 bank에 없던 E1/E2 기능을 교환한 앵커이다. 일반 문항의 pRb/p53 표적 비교와 다른 초기 복제·전사 축을 다룬다."
      }
    },
    {
      "id": "statement-fact-summary-virus-hpv-polyoma-major-capsid",
      "lecture": "integrated",
      "truth": "원형 dsDNA 바이러스인 HPV와 polyomavirus의 주요 캡시드 단백질은 각각 L1과 VP1이다.",
      "falsehood": "원형 dsDNA 바이러스인 HPV와 polyomavirus의 주요 캡시드 단백질은 각각 VP1과 L1이다.",
      "why": "두 바이러스군의 원형 dsDNA라는 공통점과 서로 다른 캡시드 명명법을 구별한다. HPV는 L1, polyomavirus는 VP1을 주요 캡시드 단백질로 연결한다.",
      "axis": "원형 dsDNA 두 바이러스군의 캡시드 명명",
      "sourceRefs": [
        {
          "doc": "notes_virus",
          "pages": [
            18
          ]
        },
        {
          "doc": "261117_02",
          "pages": [
            5,
            13
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_virus",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "path-image-04",
          "lecture-statement-261104_02-02"
        ],
        "reason": "기존 HPV 피부상·BK decoy cell의 비교가 아니라 구조상 공통점을 조건으로 서로 다른 두 주요 캡시드 명칭을 구별한다. 일반 문항의 HPV/HBV 백신 구조 비교와 대비 대상이 다르다."
      }
    },
    {
      "id": "statement-fact-summary-virus-two-rna-copies-not-dsrna",
      "lecture": "integrated",
      "truth": "HIV 입자의 단일가닥 RNA 두 사본과 rotavirus의 이중가닥 RNA는 서로 다른 유전체 구성을 뜻한다.",
      "falsehood": "HIV 입자의 단일가닥 RNA 두 사본은 rotavirus의 이중가닥 RNA와 같은 유전체 구성을 뜻한다.",
      "why": "HIV의 두 RNA 사본은 각각 단일가닥 RNA인 반면 rotavirus의 dsRNA는 상보적인 두 가닥이 이중가닥을 이룬 것이다. 사본 수와 핵산 가닥 수는 서로 다른 분류 축이다.",
      "axis": "RNA 사본 수와 가닥 수",
      "sourceRefs": [
        {
          "doc": "notes_virus",
          "pages": [
            1,
            18,
            20
          ]
        },
        {
          "doc": "261117_03",
          "pages": [
            7
          ]
        },
        {
          "doc": "261118_05",
          "pages": [
            48,
            52
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_virus",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261118_05-nov18-rota-genome",
          "lecture-statement-261118_05-03"
        ],
        "reason": "기존 rotavirus 가닥·분절 수 단독 사실과 달리 레트로바이러스의 diploid RNA를 dsRNA와 잘못 동일시하는 새로운 분류 오류를 판별한다."
      }
    },
    {
      "id": "statement-fact-summary-virus-hiv-p24-detection-versus-entry",
      "lecture": "integrated",
      "truth": "HIV 4세대 선별검사의 항원 표적인 p24는 캡시드 단백질이며 gp120의 수용체 결합 기능과 구별한다.",
      "falsehood": "HIV 4세대 선별검사의 항원 표적인 p24는 수용체 결합 단백질이며 gp120의 캡시드 구성 기능과 구별한다.",
      "why": "p24는 HIV 입자 내부의 캡시드 단백질이자 4세대 항원·항체 검사의 항원 표적이다. gp120은 CD4·보조수용체 결합과 연결한다. 검사에서 잡는 항원과 감염 진입의 표면 단백질은 다를 수 있다.",
      "axis": "HIV 검사 항원과 진입 단백질",
      "sourceRefs": [
        {
          "doc": "notes_virus",
          "pages": [
            18
          ]
        },
        {
          "doc": "261117_03",
          "pages": [
            8,
            12
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_virus",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261111_03-cbl-coinfection-assessment"
        ],
        "reason": "기존 HIV 선별검사 종류를 고르는 문항과 달리 진단 항원의 입자 내 위치와 진입 단백질의 기능을 교차 구별한다. 일반 문항의 확진/치료 추적 목적 비교와 다른 축이다."
      }
    },
    {
      "id": "statement-fact-summary-virus-u-equals-u-definition",
      "lecture": "integrated",
      "truth": "U=U는 ART로 지속적인 바이러스 억제가 유지될 때의 성접촉 전파 예방과 연결된다.",
      "falsehood": "U=U는 ART로 HIV 항체가 음전될 때의 성접촉 전파 예방과 연결된다.",
      "why": "U=U의 기준이 되는 억제는 혈중 바이러스량과 관련되며 HIV 항체 음전을 뜻하지 않는다. 강의에서 이를 지속적인 ART에 의한 성접촉 전파 예방으로 설명한 범위를 유지한다.",
      "axis": "HIV 바이러스 억제와 항체 음전",
      "sourceRefs": [
        {
          "doc": "notes_virus",
          "pages": [
            18
          ]
        },
        {
          "doc": "261117_03",
          "pages": [
            10,
            12
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_virus",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261119_03-nov19-historical-actg076-zdv"
        ],
        "reason": "기존 모자전파 예방 역사 문항과 달리 정리본 ART 예방 문구를 혈중 바이러스 억제와 항체 음전의 구별로 구체화한다. 성접촉 전파에 관한 진술로 범위를 한정했다."
      }
    },
    {
      "id": "statement-fact-summary-virus-negri-cmv-inclusion-location",
      "lecture": "integrated",
      "truth": "광견병의 Negri body는 신경세포 세포질, CMV의 올빼미눈 봉입체는 핵 안에 위치한다.",
      "falsehood": "광견병의 Negri body는 신경세포 핵, CMV의 올빼미눈 봉입체는 세포질에 위치한다.",
      "why": "광견병 감염 신경세포의 특징적 봉입체는 세포질 Negri body이다. CMV는 감염세포의 큰 핵 내 봉입체를 올빼미눈 소견으로 연결한다. 봉입체의 이름과 세포 내 위치를 함께 구별한다.",
      "axis": "신경·거대세포 바이러스 봉입체 위치",
      "sourceRefs": [
        {
          "doc": "notes_virus",
          "pages": [
            11,
            16
          ]
        },
        {
          "doc": "261113_01",
          "pages": [
            19
          ]
        },
        {
          "doc": "261117_01",
          "pages": [
            18
          ]
        }
      ],
      "examRefs": [
        "2025년 33번 (유형 참고)",
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_virus",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-statement-261104_02-02",
          "lecture-261113_01-ext-congenital"
        ],
        "reason": "기존 adeno·molluscum의 핵/세포질 위치와 CMV 소견에서 확장하여 새 랍도 영역의 Negri body와 CMV를 같은 위치축으로 비교한다."
      }
    },
    {
      "id": "statement-fact-summary-virus-slow-disease-tempo",
      "lecture": "integrated",
      "truth": "지발 감염의 slow는 긴 잠복기와 진행성 임상 경과를 가리키며 바이러스 증식 속도의 저하를 뜻하지 않는다.",
      "falsehood": "지발 감염의 slow는 바이러스 증식 속도의 저하를 가리키며 긴 잠복기와 진행성 임상 경과를 뜻하지 않는다.",
      "why": "Slow virus infection은 병의 시간적 양상을 기술한다. Conventional 바이러스와 prion처럼 서로 다른 병원체가 포함될 수 있으므로 명칭에서 공통 증식 속도를 추론하지 않는다.",
      "axis": "질병 진행 속도와 병원체 증식 속도",
      "sourceRefs": [
        {
          "doc": "notes_virus",
          "pages": [
            17
          ]
        },
        {
          "doc": "261117_01",
          "pages": [
            25,
            26
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_virus",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261112_02-ext-sspe",
          "path-general-23-q3-focus"
        ],
        "reason": "기존 SSPE 원인체·prion 성질을 재질문하지 않고 지발이라는 임상 명칭의 의미를 바꾸는 오류를 겨냥한다. 일반 문항의 PML/SSPE/CJD 원인 정렬과 구별된다."
      }
    },
    {
      "id": "statement-fact-summary-virus-kuru-gss-acquisition",
      "lecture": "integrated",
      "truth": "Kuru는 의례적 식인과 연관된 획득 prion 질환, GSS는 PRNP 생식세포계열 변이와 연관된 유전 prion 질환이다.",
      "falsehood": "Kuru는 PRNP 생식세포계열 변이와 연관된 유전 prion 질환, GSS는 의례적 식인과 연관된 획득 prion 질환이다.",
      "why": "병원체가 prion이라는 공통점이 있어도 획득 방식은 다르다. Kuru의 대표 역학은 의례적 식인이고 GSS는 유전 prion 질환이다. 정리본에서 Kuru를 유전으로도 전파된다고 묶은 표현은 적용하지 않는다.",
      "axis": "prion 질환의 획득성과 유전성",
      "sourceRefs": [
        {
          "doc": "notes_virus",
          "pages": [
            17
          ]
        },
        {
          "doc": "261117_01",
          "pages": [
            42
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_virus",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "path-general-23-q3-focus"
        ],
        "reason": "기존 prion의 분자 성질에서 확장해 Kuru/GSS라는 서로 다른 질환의 획득 배경을 비교한다. 일반 문항은 CJD 아형 내부 비교이고 이 앵커는 CJD 외 질환의 역학 비교이다."
      }
    },
    {
      "id": "statement-fact-summary-virus-animal-prion-host-pair",
      "lecture": "integrated",
      "truth": "대표 동물 prion 질환 중 scrapie는 양·염소, BSE는 소와 연결한다.",
      "falsehood": "대표 동물 prion 질환 중 scrapie는 소, BSE는 양·염소와 연결한다.",
      "why": "Scrapie와 bovine spongiform encephalopathy는 모두 동물 prion 질환이지만 대표 자연 숙주가 다르다. Scrapie는 양·염소, 이름에 bovine이 포함된 BSE는 소에 대응한다.",
      "axis": "동물 prion 질환과 자연 숙주",
      "sourceRefs": [
        {
          "doc": "notes_virus",
          "pages": [
            17
          ]
        },
        {
          "doc": "261117_01",
          "pages": [
            54,
            56
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_virus",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "path-general-23-q3-focus"
        ],
        "reason": "기존 사람 CJD의 핵산·protease 성질만으로 다루지 않은 동물 prion 질환의 숙주 대응을 새로 추가한다. 일반 문항의 사람 CJD 획득 경로와 중복되지 않는다."
      }
    },
    {
      "id": "statement-fact-summary-virus-ires-cap-snatching-contrast",
      "lecture": "integrated",
      "truth": "Picornavirus의 IRES는 cap 비의존 번역 개시에, influenza의 cap snatching은 바이러스 mRNA 전사 개시에 연결된다.",
      "falsehood": "Picornavirus의 IRES는 바이러스 mRNA 전사 개시에, influenza의 cap snatching은 cap 비의존 번역 개시에 연결된다.",
      "why": "Picornavirus의 양성가닥 RNA는 IRES를 통해 리보솜의 번역 개시와 연결한다. Influenza의 cap snatching은 숙주 RNA의 cap을 이용하는 바이러스 mRNA 전사 과정이다. 번역 개시와 mRNA 전사를 서로 바꾸지 않는다.",
      "axis": "RNA 바이러스의 번역 개시와 전사 개시",
      "sourceRefs": [
        {
          "doc": "notes_virus",
          "pages": [
            4,
            6
          ]
        },
        {
          "doc": "261111_02",
          "pages": [
            5,
            14
          ]
        },
        {
          "doc": "261112_01",
          "pages": [
            20
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_virus",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261111_02-ext-ires",
          "lecture-261112_01-ext-baloxavir"
        ],
        "reason": "기존 IRES 이름·PA 표적 약물의 개별 문항에서 바꾸어 두 RNA 바이러스 전략이 작용하는 정보 흐름 단계 자체를 비교한다. 정리본의 전사/번역 혼용을 교정했다."
      }
    },
    {
      "id": "statement-fact-summary-virus-hpv-vaccine-existing-lesion",
      "lecture": "integrated",
      "truth": "HPV L1 예방백신 접종과 기존 자궁경부 병변의 치료·필요한 선별검사는 서로 다른 목적이다.",
      "falsehood": "HPV L1 예방백신 접종은 기존 자궁경부 병변의 치료·필요한 선별검사를 대신하는 목적이다.",
      "why": "L1 예방백신은 새 감염 예방을 목표로 하며 기존 HPV 감염·병변의 치료 효과를 뜻하지 않는다. 접종 후에도 검진 대상자에게 필요한 선별검사는 이어진다. 예방 항원과 병변 치료를 구별한다.",
      "axis": "HPV 일차 예방과 기존 병변 관리",
      "sourceRefs": [
        {
          "doc": "notes_virus",
          "pages": [
            18
          ]
        },
        {
          "doc": "261117_02",
          "pages": [
            11
          ]
        }
      ],
      "examRefs": [
        "강의·정리본 핵심 재구성"
      ],
      "noteRefs": [],
      "summaryDoc": "notes_virus",
      "sourceScope": "personal-summary",
      "novelty": {
        "relatedQuestionIds": [
          "lecture-261104_03-02",
          "lecture-statement-final-261119_06-chronic-infectious-origin"
        ],
        "reason": "기존 HPV 대리표지자·감염성 만성병 사실 및 일반 문항의 항원·유형 비교와 달리, 이미 병변이 있는 상황에서 예방접종·치료·선별검사의 목적이 다름을 묻는다."
      },
      "externalRefs": [
        {
          "title": "NCI: HPV Vaccine—prevention and existing infection",
          "url": "https://www.cancer.gov/about-cancer/causes-prevention/risk/infectious-agents/hpv-vaccine-fact-sheet"
        }
      ]
    }
  ]
};
export const SUMMARY_SOURCE_REVIEW={
  "date": "2026-11-20",
  "summaryPages": 63,
  "bySummary": {
    "notes_general": {
      "comparisons": 20,
      "statements": 6
    },
    "notes_bacteria": {
      "comparisons": 21,
      "statements": 8
    },
    "notes_virus": {
      "comparisons": 24,
      "statements": 11
    }
  }
};
const titles={notes_general:'일반·약리·병리·예방 정리본',notes_bacteria:'세균·진균 정리본',notes_virus:'바이러스 정리본'};
const factsById=new Map(Object.values(SUMMARY_FACT_GROUPS).flat().map(f=>[f.id,f]));
export const SUMMARY_STATEMENTS=buildStatementQuestions(SUMMARY_FACT_GROUPS,titles).map(q=>{
 const anchor=factsById.get(q.statementEvidence[q.answer].factId);
 const refs=q.statementEvidence.flatMap(e=>factsById.get(e.factId)?.externalRefs||[]);
 const externalRefs=[...new Map(refs.map(r=>[r.url,r])).values()];
 return {...q,lecture:anchor.lecture,topic:anchor.lecture,summaryDoc:anchor.summaryDoc,sourceScope:'personal-summary',novelty:anchor.novelty,addedBatch:'20261120-final',...(externalRefs.length?{externalRefs}:{})};
});
export const SUMMARY_QUESTIONS=[...SUMMARY_COMPARISONS,...SUMMARY_STATEMENTS];
