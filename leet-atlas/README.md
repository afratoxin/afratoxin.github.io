# LEET Atlas — 추리논증 20회분 아카이브

예비시험과 2009~2027학년도 본시험의 **20회분 755문항**을 분야 → 중간 소재로 분류한 도구다. 소재·문항 유형·풀이 논리와 배정 이유를 모든 회차에 적용했다. 2027학년도 40문항(2701~2740)은 기존 수정 원문과 해설을 보존한다. 새로 추가한 715문항은 분류·근거·출처 페이지를 제공하며, 첨부 원문과 파생 이미지·PDF는 추가 공개하지 않는다.

- [문항 탐색](https://afratoxin.github.io/leet-atlas/#/questions)
- [모든 북마크](https://afratoxin.github.io/leet-atlas/#/bookmarks)
- [태그 사전](https://afratoxin.github.io/leet-atlas/#/tags)

## 문항 탐색

기본 목록은 **10문항씩, 넓은 화면에서 한 줄에 2문항**이다. 페이지 번호로 이동하거나 연속 스크롤로 전환한다. 검색·태그·북마크 색·검수 상태를 함께 적용할 수 있다.

2027 문항은 왼쪽에 원문, 오른쪽에 기존 해설을 배치한다. 다른 회차는 회차·문항번호·통합 원본 PDF 쪽과 분류 근거를 보여준다. 검토하지 않은 정답과 해설을 생성하지 않는다.

## 7색 북마크

북마크 버튼에서 빨강·주황·노랑·초록·파랑·남색·보라를 고른다. **한 문항에 여러 색을 함께 붙일 수 있다.** 상단의 모든 북마크 화면과 색 필터로 모아 본다.

기존 단색 북마크는 빨강으로 이관하며 메모와 검수 상태는 보존한다. 기록은 같은 브라우저에 저장되고 JSON으로 내보낼 수 있다.

## 태그 검수

대범주 → 분야 아래의 소재를 중간 범주 하나로 통일한다. 예: 경제학 → 게임이론, 철학 → 인식론·도덕·권리, 물리 → 운동법칙·천문·광학. 구체적인 사건명과 사례는 제목과 분류 이유에서 확인한다. 23개 분야의 정의와 모든 태그의 문항 수는 전체 755문항을 기준으로 제공한다. 소재·문항 유형·풀이 논리는 별도의 축이다.

태그 사전에서는 모든 태그의 정의·문항 수를 보고, 개별 묶음에서 실제 배정 문항과 부여 이유를 확인한다. 기존 분야·유형·논리 ID를 유지하고, 통합된 세부 소재 ID 130개는 새 중간 범주 또는 분야로 연결한다.

## 2708 수정본

사용자가 다시 제공한 수정 PDF와 사진을 반영했다. ㄱ 후반의 비교 대상은 ㉡·㉢이며, ㄷ의 전제는 ㉣이다. 현재 판정은 **ㄱ·ㄴ 참, ㄷ 거짓 → ③**으로 일치한다. 현재 문항의 이전 충돌 경고는 해제했고 [교체 이력](docs/source-history/2708-v1-v2.md)에 과거 검토를 보존했다.

정답은 제공 PDF의 회색 강조와 독립 풀이를 대조했다. 외부 공식 정답표 대조는 미완료다. 2723의 도식·2736의 수식은 원본 이미지가 기준이며 추출 복원 이력을 남겼다.

## 검증과 재생성

```sh
node --test scripts/*.test.mjs
python scripts/validate_archive.py
python scripts/validate_data.py
node --check app.js
python scripts/build_data.py
python scripts/build_archive.py --source-dir /path/to/source-audit --metadata-only
```

Node 테스트는 최소 DOM 어댑터로 실제 앱의 생성 내용과 상태 전환을 검사한다. 실제 브라우저의 레이아웃·시각 검증을 대체하지 않는다. 이 환경에는 브라우저 검수 도구가 없다.

PyMuPDF·Pillow·Poppler가 있으면 원본 추출을 새 폴더에서 재현할 수 있다.

```sh
python scripts/extract_pdf.py data/2027-original.pdf /tmp/leet-atlas-extraction --start-page 1
```

원본 회색 강조는 보존한다. 2708 외 39개 문항의 기존 추출본은 유지했다. 수정 PDF의 2707에는 들여쓰기 차이만 있어 기존 공백을 보존했다. `data/source-manifest.json`에 원본 v1/v2의 해시와 문항별 출처 버전을 기록했다.

풀이 논리는 [SDSS 100개의 코드](https://sdss.kr/code/100.html)를 참고한 자체 분석이다. 공식 추리논증 분류나 공식 해설이 아니다. 정의와 참고 범위는 `docs/taxonomy.md`, `docs/field-classification.md`, `data/logic-research.json`에 기록했다.


전체 회차의 범위와 분류 정책, 원본·분류 검증 정보 및 재생성 방법은 [전체 아카이브 안내](docs/archive-classification.md)를 참고한다. `data/archive.json`이 현재 UI의 데이터이고 `data/2027.json`은 기존 수정본의 보존 데이터다.
