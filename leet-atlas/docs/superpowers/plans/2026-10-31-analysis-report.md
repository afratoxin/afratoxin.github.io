# Author-focused analysis implementation

## Delivered

- Removed percentile weighting, synthetic scores, 1–5 burden levels, mean burden, and the difficulty chart. No aggregate year difficulty is derived from the seven connected rate records (five exact rates).
- Added `design-profile.mjs`: original Unicode text character counts; condition/rule signals; quantitative signals; argument/evidence signals; visual and option-comparison observations. Each dimension carries a status, observable evidence and explicit nulls for unmeasured work. Review recommendations distinguish automatic observations from the human review still required.
- Combination items count the actual ㄱ/ㄴ/ㄷ statement text separately from short answer-combination strings. Eight missing-option items remain unknown: p014, 2020, 2236, 2319, 2425, 2521, 2623, 2723. Diagram workload remains null, including when a visual reference is detected.
- Actual question extraction uses question-mark, paragraph and sentence boundaries, rather than a 450-character window. Parenthetical assumptions after the question are excluded. Regression coverage includes positive 0937/0940/1033/1034, negative p036/1209, passage dialogue questions, long passages and same-paragraph trailing tasks.
- Default year map: X = mean original source text characters (stem + statement content + available option text), Y = the union of 규칙·사례 적용 / 모형·수리 추론 / 논리 퍼즐. Alternatives expose argument/evidence share, visual-reference share, negative prompts and missing-option share. Definitions, units, denominator counts, full coordinate table and question evidence links accompany the axes. Coordinates are never jittered; coincident points use concentric rings. Visible ranges follow the observed data and retain actual labeled units.
- Empirical rates retain exact versus upper-bound distinction, missingness, source, sample description, booklet, publication date and caveats. The booklet-change article received the single metadata edit `kind: news-report`; its sample-data details and every answer remain intact.
- Existing representative-question links now display actual 학년도 n번 labels. Existing authored year commentary is disclosed separately and does not claim final human verification.

## Integration API

- `analyzeArchive(questions = [])`, `validateYearContent(content, questions)` and `renderYearAnalysis(options)` remain available.
- `renderYearAnalysis` accepts optional `axisX` / `axisY` (defaults `readingChars` / `processingRate`). Select IDs: `analysis-axis-x` and `analysis-axis-y`; root app owns the state/change handlers.
- `renderYearPlane(stats, selectedKey, {axisX, axisY})` and `DESIGN_AXES` are exported.
- `buildDesignProfile(question)` returns `{profile, features}`. No `assessDesign` alias or `.dimensions` property exists. An analyzed row exposes the profile directly as `row.designProfile`.
- Profile keys: `reading`, `conditions`, `quantitative`, `argument`, `visual`, `comparison`, `reviewRecommendations`. Dimension evidence is a string array; comparison also supplies `statements: [{label,text}]`.
- `reading`: `chars`, `stemChars`, `optionChars`, `coverage`. `conditions`: `markerCount`, `processingTypes`, `interactionCount:null`, `inferenceDepth:null`. `quantitative`: `numericSignals`, `labels`, `requiredOperations:null`. `argument`: `labels`, `discriminationDepth:null`. `visual`: `referenceDetected`, `possibleMissingOptions`, `workload:null`. `comparison`: `optionCount`, `optionChars` (null if any option is unavailable), `statementCount`, `statementChars`, `statements`, `combination`, `qualifiers`, `workload:null`.
- Old `score`, `burden`, `percentiles`, `weights`, `meanBurden`, `plane.modeling` and `plane.evidence` were intentionally removed. The map uses `plane.processing`, `argument`, `visual`, `negative`, `unknownOptions`, each with `count`, `percent`, `questionIds`.

## Verification

- New behavior tests were observed failing before implementation, including the five requested polarity cases, missing diagram choices, real combination text, no difficulty total, map spread, faithful Unicode character counts and booklet news labeling. Additional dialogue/same-paragraph cases also followed red → green.
- Latest focused command: `node --test scripts/design-profile.test.mjs scripts/year-analysis.test.mjs scripts/year-plane.test.mjs` — **21 passed, 0 failed**.
- Earlier full JavaScript snapshot before concurrent root route changes: **314 passed, 0 failed**. Later full snapshot during integration: 319 tests / 10 failures, all route/default compatibility assertions. The analysis route expectation was updated to the new explicit query/searchMode/excludedTags defaults and passes in the latest focused run. The other nine belong to root's concurrent core/app integration and were sent to root by name: automatic multiple-year filtering; real-archive year-and-puzzle old-OR URL; Unicode deep-link roundtrip; bookmark/tag route roundtrip; old global-mode migration; sort URL roundtrip; all sort choices roundtrip; canonical tag route roundtrip; malformed mode migration. Root must run the final integrated suite.
- Bundled Python with `-X utf8 -m unittest discover -s scripts -p 'test_*.py'`: **49 passed**. Without UTF-8 mode, eight existing tests failed while decoding UTF-8 files through Windows cp949; the UTF-8 run resolves those environment errors.
- No browser visual signoff was performed by this analysis subtask; root owns desktop/mobile integration QA.

## Limits

These are deterministic source observations and existing classification labels, not semantic proofs or psychometric measurements. Text reading volume omits unrecovered image content and marks partial option coverage. Visual-reference share is a text-reference detector, not a full image census. The automatic polarity detector can require review on unusual language. Interactions, independent condition count, necessary operations, inference depth, visual complexity and expected response time remain unmeasured; every item includes a human-review recommendation. Source URLs were retained, not newly researched during this implementation. No baseline question, answer, explanation or review record was changed by this subtask.

## Follow-up: integrated test adapters and regression verification

Root explicitly assigned scripts-only integration after the app/core contracts changed. The shared `scripts/writer-test-env.mjs` now supplies the real new modules to every app `AsyncFunction` adapter; explicit semantic-search doubles still override its defaults. Auxiliary fetches receive safe empty bounds/exception registries rather than fabricated archive-shaped metadata. Event doubles implement the native `hasAttribute` method. Storage and network assertions still verify that private imports generate only the three expected local asset reads.

Superseded assertions now check actual year/number labels, compact text cards, all five option analyses in a collapsed disclosure, the explanation-book answer label, optional OR within an axis, strict cross-axis/required/excluded restrictions, complete search-route defaults and URL-driven history. Stable question IDs are recovered from links for ordering assertions rather than from visible labels. No filter, bookmark, source import, failed storage or invalid-import cases were removed.

The surviving regressions exposed real runtime defects and were retained until root fixed them:

- Empty keyword-mode URLs reverted to recommendation mode and erased the unsent draft; empty keyword mode is now serialized.
- Old result counts overrode pending-edit and fallback explanations; search status now retains its truthful state.
- Compact text lists still fetched image bundles without image holders; readers now trigger those downloads.
- Legacy minimal question records could crash related-question rendering on absent arrays.
- A stale derived option flag could relabel another option as the book answer; the book key now controls the label.
- Legacy independent `derivedConclusion` remains visible in an explicitly nonofficial prior-review disclosure and does not create an official exception.

A new end-to-end adapter regression invokes the actual writer restore workflow with an old review backup, checks the downloadable pre-restore copy, verifies the persisted `{schemaVersion:2,reviews}` envelope, reboots the app from that saved storage, and confirms restored bookmarks/status/notes plus unrelated existing notes. Another integration test changes both map axes and switches years, verifying that the plotted title and selected axes persist.

Latest complete command: `node --test scripts/*.test.mjs` — **325 passed, 0 failed, 0 skipped**, approximately 9 seconds. Compact full log: `../writer-final-integrated-tests.log`. This fresh integrated result supersedes the earlier concurrent failure snapshots above. The initial focused adapter run terminated normally at 137 tests, and all 137 passed after the runtime fixes. The restore/axes focused command then passed 27/27. This follow-up made no production-code edits; root implemented the runtime fixes.
