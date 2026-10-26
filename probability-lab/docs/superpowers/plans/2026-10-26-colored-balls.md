# Colored Balls Implementation Plan

Goal: 색 공 선택을 일반화하고 조건 조합이 가능한 상자 분배 생성기를 배포한다.
Architecture: 기존 엔진은 검산용으로 보존한다. 공개 selection을 새 모형으로 교체하고 distribution을 추가하며 공통 999 검증을 재사용한다. 두 모형의 규칙 편집기는 공통으로 사용한다.
Tech Stack: buildless ES modules, BigInt, Node test runner.
Spec: ../specs/2026-10-26-colored-balls-design.md

Global Constraints: 1~6 colors; 1~5 boxes; each displayed value/count/denominator <=999; retain 3 panes and pagination; preserve unrelated remote commits.
Review Focus: unequal color weights; shared-link invalid structures; unlabeled empty boxes; rules on removed colors/boxes; sequence event intersection with conditioning.

- [x] Tests: independent physical-ball combinations/sequences and set partitions for small inputs; limits and zero-event cases.
- [x] Engine: color-count compositions, exact sequence weights, safe rule algebra, colored partition weights, closed-form explanations, legacy migration.
- [x] UI: paged color/rule editor, subset selection, sliders and expressions, serialize/restore, changes invalidate stale answers.
- [x] Integration: expose models and supported condition taxonomy, add example presets, retain prior controls and catalog.
- [x] Verification: independent physical-ball and partition oracles, preset and UI scenarios, remote namespace comparison.

Release procedure: run the complete Node suite, publish only probability-lab changes on the latest master with an expected-head lease, and verify the corresponding Pages deployment workflow succeeds.

Review fixes: exclude zero-stock replacement states; use physical order weights in the denominator; refresh rule slider bounds from live draw and inventory; recover after invalid rules without resetting.
