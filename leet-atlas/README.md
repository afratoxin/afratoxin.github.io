# LEET Atlas — 2027 추리논증 검수판

2027학년도 40문항(2701~2740)의 원본·해설·다축 분류를 검토하는 도구다. 현재 UI를 검수한 뒤 다른 연도의 태깅으로 확장한다.

- [문항 탐색](https://afratoxin.github.io/leet-atlas/#/questions)
- [모든 북마크](https://afratoxin.github.io/leet-atlas/#/bookmarks)
- [태그 사전](https://afratoxin.github.io/leet-atlas/#/tags)

## 문항 탐색

기본 목록은 **10문항씩, 넓은 화면에서 한 줄에 2문항**이다. 페이지 번호로 이동하거나 연속 스크롤로 전환한다. 검색·태그·북마크 색·검수 상태를 함께 적용할 수 있다.

왼쪽에 원문, 오른쪽에 해설을 배치한다. 문항마다 원본 이미지·추출 텍스트·다섯 선택지 해설을 제공하며 원본 확대를 지원한다.

## 7색 북마크

북마크 버튼에서 빨강·주황·노랑·초록·파랑·남색·보라를 고른다. **한 문항에 여러 색을 함께 붙일 수 있다.** 상단의 모든 북마크 화면과 색 필터로 모아 본다.

기존 단색 북마크는 빨강으로 이관하며 메모와 검수 상태는 보존한다. 기록은 같은 브라우저에 저장되고 JSON으로 내보낼 수 있다.

## 태그 검수

대범주 → 세부 분야와 기존 소재·유형·풀이 논리를 별도의 축으로 유지한다. 23개 분야와 그 정의를 등록했으며 2027에는 14개를 실제 배정했다. 미배정 9개 분야는 **현재 2027 자료 없음**으로 표시한다. 전체 연도에 해당 문항이 없다는 뜻이 아니다.

태그 사전에서는 모든 태그의 정의·문항 수를 보고, 개별 묶음에서 실제 배정 문항과 부여 이유를 확인한다. 기존 태그 ID와 필터 링크는 유지한다.

## 2708 수정본

사용자가 다시 제공한 수정 PDF와 사진을 반영했다. ㄱ 후반의 비교 대상은 ㉡·㉢이며, ㄷ의 전제는 ㉣이다. 현재 판정은 **ㄱ·ㄴ 참, ㄷ 거짓 → ③**으로 일치한다. 현재 문항의 이전 충돌 경고는 해제했고 [교체 이력](docs/source-history/2708-v1-v2.md)에 과거 검토를 보존했다.

정답은 제공 PDF의 회색 강조와 독립 풀이를 대조했다. 외부 공식 정답표 대조는 미완료다. 2723의 도식·2736의 수식은 원본 이미지가 기준이며 추출 복원 이력을 남겼다.

## 검증과 재생성

```sh
node --test scripts/core.test.mjs scripts/navigation.test.mjs scripts/app.test.mjs
python scripts/validate_data.py
node --check app.js
python scripts/build_data.py
```

Node 테스트는 최소 DOM 어댑터로 실제 앱의 생성 내용과 상태 전환을 검사한다. 실제 브라우저의 레이아웃·시각 검증을 대체하지 않는다. 이 환경에는 브라우저 검수 도구가 없다.

PyMuPDF·Pillow·Poppler가 있으면 원본 추출을 새 폴더에서 재현할 수 있다.

```sh
python scripts/extract_pdf.py data/2027-original.pdf /tmp/leet-atlas-extraction --start-page 1
```

원본 회색 강조는 보존한다. 2708 외 39개 문항의 기존 추출본은 유지했다. 수정 PDF의 2707에는 들여쓰기 차이만 있어 기존 공백을 보존했다. `data/source-manifest.json`에 원본 v1/v2의 해시와 문항별 출처 버전을 기록했다.

풀이 논리는 [SDSS 100개의 코드](https://sdss.kr/code/100.html)를 참고한 자체 분석이다. 공식 추리논증 분류나 공식 해설이 아니다. 정의와 참고 범위는 `docs/taxonomy.md`, `docs/field-classification.md`, `data/logic-research.json`에 기록했다.
