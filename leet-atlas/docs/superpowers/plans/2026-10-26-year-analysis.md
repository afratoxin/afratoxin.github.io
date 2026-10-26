# Year Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 연도별 출제 경향·대표 문항·풀이 부담 그래프·외부 통계 비교를 제공한다.

**Architecture:** `year-analysis.mjs`에서 원문 기반 지표와 접근 가능한 화면을 계산한다. `data/year-analysis.json`에 검토된 연도별 해설과 출처를 저장한다. 기존 앱은 분석 탭에서만 이 자료를 불러온다.

**Tech Stack:** 기존 정적 HTML/CSS/JavaScript, SVG, Node test.

**Spec:** `docs/superpowers/specs/2026-10-26-year-analysis-design.md`

## Global Constraints

- 기존 755문항과 사용자 기록을 변경하지 않는다.
- 정답률과 추정 지표를 분리하고 미확보 정답률은 null로 둔다.
- 모든 연도별 대표 문항은 해당 회차에 실제 존재해야 한다.
- 책형·내용 대응이 불확실한 통계는 문항에 연결하지 않는다.

## Review Focus

- 35문항 회차와 40문항 회차의 비율 비교.
- 예비시험과 2009학년도 본시험의 구별.
- 통계가 없는 연도의 그래프와 출처 표시.
- 분석 자료 로딩 중 다른 탭으로 이동했을 때의 경합.
- 키보드·모바일에서 그래프와 자료 표 접근.

### Task 1: 분석 자료와 지표

- [x] `scripts/year-analysis.test.mjs`에 회차별 범위·비율·5단계 지표·자료 누락·출처 무결성 테스트를 작성하고 실패를 확인한다.
- [x] `year-analysis.mjs`의 `analyzeArchive(questions)`와 순수 렌더 함수를 구현한다. 각 지표의 실제 관측량과 산식을 반환한다.
- [x] 병렬 조사 결과를 `data/year-analysis.json`으로 통합하고 원문 문항 ID와 출처를 검증한다.

### Task 2: 탭과 그래프

- [x] 실제 앱 어댑터 테스트로 새 경로·연도 선택·대조 회차 선택·오류 재시도를 검증한다.
- [x] `core.mjs`에 분석 경로를, `app.js`에 지연 로딩과 화면 전환을, `index.html`에 메뉴를 추가한다.
- [x] `styles.css`에 기존 디자인과 맞는 반응형 분석 패널·그래프·자료 표를 추가한다.

### Task 3: 검증과 게시

- [x] 전체 테스트와 공개 자료 검증을 실행하고 변경 범위를 검토한다.
- [x] 코드 검토와 실제 브라우저에서 연도 전환·그래프·문항 링크를 확인한다.
- [ ] 최신 원격 변경과 충돌을 확인하고 이 요청의 파일만 게시한 뒤 공개 화면을 확인한다.
