# LEET Atlas — 추리논증 20회분 아카이브

예비시험과 2009~2027학년도 본시험의 **20회분 755문항**에 자체 작성 해설 초안과 **3,775개 선택지별 해설**을 제공합니다. 전체 문항의 소재·문항 유형·풀이 논리 및 분류 이유를 탐색할 수 있습니다.

- [문항 탐색](https://afratoxin.github.io/leet-atlas/#/questions)
- [7색 북마크 모아보기](https://afratoxin.github.io/leet-atlas/#/bookmarks)
- [태그 사전](https://afratoxin.github.io/leet-atlas/#/tags)

기본 목록은 10문항씩 표시하며 2열 보기와 연속 스크롤을 지원합니다. 한 문항에 여러 북마크 색을 붙일 수 있고, 이전 북마크·메모·검수 기록은 같은 브라우저에 보존됩니다.

2027학년도 40문항은 기존 수정 원문과 이미지를 유지합니다. 다른 715문항은 소장 PDF의 회차·문항·쪽수와 함께 자체 해설을 제공합니다. 새 원문 이미지·추출 텍스트·PDF는 현재 공개 사이트에 포함되어 있지 않습니다. 전체 원본 이미지·텍스트를 담은 개인 검수본은 별도로 보존합니다.

해설은 공식 해설이 아닌 자체 작성 초안이며 외부 공식 정답표 대조는 완료되지 않았습니다. 1034·2305·2435는 문언 해석이나 경계 사례에 따른 검토가 필요한 문항으로 표시하고, 원본 표시 답안을 유지합니다. 2708은 수정본의 ㄱ·ㄴ 참, ㄷ 거짓과 정답 ③을 보존합니다.

분류는 23개 분야 아래 중간 범주의 소재를 둡니다. 예: 경제학→게임이론, 철학→인식론·도덕·권리, 물리→운동법칙·천문·광학. 소재·문항 유형·풀이 논리는 별도 축입니다. 130개 이전 소재 링크도 현재 분류로 연결합니다.

## 검증

```sh
node --test scripts/*.test.mjs
python -m unittest discover -s scripts -p 'test_*.py'
python scripts/validate_archive.py
python scripts/validate_publication.py
python scripts/validate_data.py
node --check app.js
```

검증은 모든 문항의 데이터 완전성, 선지별 해설, 답안 충돌 표시, 2027 수정본 보존, 북마크·페이지·태그 동작을 확인합니다. DOM 어댑터 검증이며 실제 브라우저의 시각 검수를 대체하지 않습니다. 전체 문항의 독립 정답 검증이 완료되었다는 의미도 아닙니다.

`data/archive.json`은 현재 사이트 데이터, `data/2027.json`은 기존 수정본 보존 데이터입니다. 완성된 개인 원문 데이터에서 공개용 자체 해설만 추리려면 다음을 실행합니다.

```sh
python scripts/build_explanations_archive.py --input /path/to/full/archive.json --output /path/to/public/data/archive.json
```

풀이 논리 분류는 [SDSS 100개의 코드](https://sdss.kr/code/100.html)를 참고한 자체 분석입니다. 자세한 분류 기준은 `docs/taxonomy.md`, `docs/field-classification.md` 및 `docs/archive-classification.md`를 참고하십시오.
