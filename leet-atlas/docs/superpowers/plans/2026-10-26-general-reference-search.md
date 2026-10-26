# General Reference Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Any previously unseen Korean creation brief can search all755 questions by meaning and source evidence, with clearly separate recommendation and literal keyword interfaces.

**Architecture:** Prepare source-backed sections from all original text, options, option explanations, statements, pitfalls and question features. Use the existing browser E5 model to retrieve broad candidates and retain the best evidence passages; evaluate a generic Korean pairwise reranker before adopting additional model weight. Keep question data immutable and filter only by explicit user selections.

**Tech Stack:** Native ES modules, Node tests, fixed Transformers.js3.8.1 and multilingual-e5-small q8, WASM worker, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-26-search-intent-and-facets-design.md`; its initial user-correction section takes precedence.

## Global Constraints

- Any new query follows one general search path; no query→ID lists or support whitelist.
- All755 public questions, all5 option explanations and existing original images/answers remain intact.
- No paid inference API, account, external query transmission, or unapproved service.
- Exact question numbers and explicitly selected year/tag/bookmark/review restrictions stay reliable.
- Source evidence is quoted, not generated; unknown or inferred visual facts are never stated as confirmed.
- Preserve current annual analysis, sort, pagination, source-reader layout, reviews and private imports.

## Review Focus

- Unseen paraphrases with no known category words must enter semantic candidates, even when literal matching fails.
- Negative wording and compound demands must not be silently turned into mandatory inferred filters.
- Source overrides, index/model loading failures and rapid mode/query changes must not show old semantic evidence as current.
- Combination choices using non-jamo labels and empty image choices must not become independent statements by exclusion.
- Wrong-answer explanations are searchable without conflating answer-choice status with statement truth or claiming generated reasoning.

---

### Task 1: Evidence-complete question documents

**Files:** Create `search-documents.mjs`, `scripts/search-documents.test.mjs`; modify `reference-search.mjs` and index builder imports.

**Interfaces:** `questionSearchSections(question) -> Array<{kind,label,text}>`; `buildSearchDocuments(questions) -> Array<{id,kind,label,text}>`; `questionSearchText(question) -> string`.

- [x] Write failing tests for evidence that exists only in option explanations/statements/pitfalls, every option and tail text preservation, independent/combinatorial/image-unknown choices, actual completion task vs box in passage, immutable source records.
- [x] Run `node --test leet-atlas/scripts/search-documents.test.mjs`; expected missing module/export failure.
- [x] Implement section extraction with original evidence labels, generic source-backed question-form descriptions, exact taxonomy, and bounded overlapping chunks. Keep visual verification explicit in small source-provenance metadata, never a query mapping.
- [x] Run document tests and existing search tests; all pass. Commit document extraction.

### Task 2: General semantic ranking with passage evidence

**Files:** Modify `reference-search.mjs`, `semantic-index.mjs`, `semantic-search.mjs`, `semantic-worker.mjs`, builder; add/modify ranking/index/client tests.

**Interfaces:** Existing `rankReferences(questions,query,{semanticScores})` and `search(query)->Promise<Map>` stay compatible. Score maps may carry validated `.evidence:Map<id,{label,text,kind,score}>`. Index stores ordered passage metadata beside vectors and exposes `scoreSemanticEvidence(index,query)` while `scoreSemanticIndex` continues returning scores.

- [x] Write failing tests for arbitrary semantic-only candidates, evidence selected from non-answer explanations, ID/year ambiguity, law-vs-natural-laws, broad similarity fallback without claiming full match, passage payload validation and stale response/cancellation.
- [x] Run affected tests and confirm the new behavior fails.
- [x] Replace lexical/alias-dominated admission with general hybrid ranking. Keep explicit structure signals secondary; all meaningful natural-language input receives semantic comparison. Bound weak candidates, preserve strict user filters, and show actual closest evidence instead of a source introduction.
- [x] Evaluate a multilingual pairwise reranker on all four examples plus unseen briefs; adopt only if it improves held-out relevance and is practical in browser. Otherwise retain the measured evidence retrieval and record the reason, without claiming an unimplemented second model.
- [x] Rebuild index from new sections using fixed model/cache. Verify all755 IDs, document hashes, vectors and passage metadata. Run affected and complete Node tests; commit.

### Task 3: Clearly separate recommendation and keyword entry

**Files:** Modify `app.js`, `styles.css`, `index.html`, UI test adapters and recommendation UI tests; add focused behavior tests as needed.

**Interfaces:** Two visible mode buttons, separate retained draft inputs, explicit recommendation submit plus Ctrl/Cmd+Enter, keyword input and Enter/search. Pending text does not relabel previous results as current. Semantic evidence maps flow into ranking.

- [x] Write failing UI tests for labels/mode selection, independent drafts, submit, first-query/mode races and user filters, escaping and evidence source labels.
- [x] Run UI tests and confirm failures.
- [x] Build the approved two-button interface: ‘설명으로 추천받기’ / ‘단어로 검색하기’, ‘찾고 싶은 문항의 특징’ / ‘검색할 단어 또는 문항번호’. Move review filter away from search mode. Example buttons enter ordinary text and invoke the same path, never canned results.
- [x] Render evidence label and related source passage, including wrong-choice explanation when relevant. Keep model loading/fallback honest, private-text source limitation visible and annual screens intact.
- [x] Run complete Node tests, browser keyboard/narrow-screen/mode transitions; commit.

### Task 4: Genuine evaluation, review and publication

**Files:** Update README and corpus manifest; add reproducible evaluation queries/scripts. Keep large runtimes/caches/reports outside published files.

- [ ] Run real native model evaluation across topical, format, argument-error, negative, mixed and unrelated input classes. Reserve unseen paraphrases for final validation and report ranks/timing rather than encoding their IDs into the engine.
- [ ] Run all Node tests, Python tests and publication/data validators. Expected zero failures; redirect verbose output to plan workspace.
- [ ] Obtain fresh whole-branch review, fix material issues with RED→GREEN tests, and repeat the relevant full suite.
- [ ] Verify actual browser WASM query and evidence, cache/fallback, recommendations vs keywords, explicit filters and representative reader links.
- [ ] Fetch latest upstream, preserve concurrent changes, publish using authorized GitHub connection and expected-head lease. Verify successful Pages deployment and actual production query/evidence. Save screenshot and completion record.
