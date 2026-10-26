# Reference Search Implementation Plan

> **For agentic workers:** Use the approved design and execute task-by-task with failing-then-passing tests. Independent ranking and semantic-runtime tasks may run in parallel; integrate only against the interfaces below.

**Goal:** Recommend useful LEET reference questions from a Korean description of the question the user wants to create, without a paid service.

**Architecture:** Keep exact keyword filtering intact. Rank filtered candidates with lexical/concept/structure evidence and optional locally computed E5 similarity. Precompute passage embeddings for all755 public records and compute only the query embedding in a browser worker.

**Tech Stack:** Vanilla JavaScript modules, Node tests, Transformers.js3.8.1, multilingual-e5-small quantized ONNX, GitHub Pages.

**Spec:** ../specs/2026-10-26-reference-search-design.md

## Global Constraints

- No external inference API, account, key, or per-query charges; model downloads may use public CDN/model hosting.
- Preserve original data, all755 questions, images, classifications, answers, explanations, tag IDs and saved reviews/corrections.
- First model initialization may take time and data; report loading and fallback truthfully, and do not block keyword/structural search.
- Existing explicit tag/year/bookmark/review filters remain strict. Inferred conditions affect rank and are not asserted as verified facts.
- Use evidenced recommendation reasons. Exact question IDs remain reliable. Do not hardcode result IDs to pass examples.

## Review Focus

- Named philosophers and mother/child dialogues must not be missed by an only-갑/을 detector.
- Violence in an example must not turn a verbal debate into a physical fight recommendation.
- Rapid query changes must not show stale semantic results; worker/network/cache failures must leave the page usable.
- Mobile first-load/model memory limits must degrade to accurately labeled lightweight search.
- Old personal corrections and all explicit filters must still work in both search modes.

## Task1: Evidence-based recommendation ranking

**Files:** Create reference-search.mjs and scripts/reference-search.test.mjs.

**Interface:** `rankReferences(questions, query, {semanticScores = new Map()} = {})` returns an array of `{id, score, reasons: string[], snippet: string}` ordered by relevance. It accepts only already-filtered candidates and must not mutate inputs. Export `buildSearchDocuments(questions)` returning `{id,text}[]` for complete short metadata/analysis and overlapping source passages. The runtime consumes raw model similarities; exact combination is measured against the supplied gold queries.

- [ ] Write tests for paraphrases, named two-person rebuttal, discourse participants versus characters, physical conflict, negative constraints, exact IDs and unrelated input. Observe failure.
- [ ] Implement transparent query interpretation and evidence extraction from title/tags/summary/steps/original text, without hardcoded question answers.
- [ ] Run tests over the real archive: sample top10 includes at least3 of1321/1512/1717/2218/2318;2218 and2318 are top5 for their paraphrase descriptions.
- [ ] Record limitations of deterministic evidence and ensure semantic scores can improve unseen paraphrases.

## Task2: Local semantic runtime and precomputed index

**Files:** Create semantic-search.mjs, semantic-worker.mjs, semantic-index.mjs, scripts/build-search-index.mjs, scripts/semantic-search.test.mjs, data/reference-embeddings.json and data/reference-search-manifest.json. Builder-only packages/caches stay outside the published site.

**Interface:** `createSemanticSearch({onStatus, workerFactory, timeoutMs}={})` returns `{search(query):Promise<Map<string,number>>, dispose()}`. Status callback receives `{state:'loading'|'searching'|'ready'|'fallback', progress?:number, message?:string}`. `workerFactory` is optional for tests; normal production creates a module worker lazily. Failed or stale searches must not replace a later result. The builder consumes Task1 `buildSearchDocuments` and stores versioned embeddings mapped to question IDs; no model weights are published.

- [ ] Test request ordering, lazy loading, failure/timeout/disposal and corrupt index validation before implementation.
- [ ] Pin model revision and runtime version, use E5 query/passage prefixes, mean pooling and L2 normalization consistently on build and browser paths.
- [ ] Build vectors for every document; retain tail passages. Record source hash, model/revision, dimensions, encoding, document/question counts.
- [ ] Run the genuine model against the representative queries and record ranking scores, not mocked embeddings.

## Task3: Search UI and integration

**Files:** Modify app.js, styles.css, index.html, README.md and relevant app-adapter tests. Create scripts/reference-search-ui.test.mjs if necessary.

**Interface:** Candidate filtering calls existing filterQuestions with an empty query in recommendation mode, then Task1 ranking with Task2 similarities. Keyword mode uses existing filterQuestions unchanged. UI keeps per-ID matches to render escaped reasons/snippets and a relevant-first sort option for nonempty recommendation queries.

- [ ] Write failing tests for the actual example, both modes, preserved filters/corrections and stale async responses.
- [ ] Add mode control, natural-language placeholder/example, evidenced result reasons, initial download notice and truthful progress/fallback labels.
- [ ] Debounce worker requests and protect query/mode/filter transitions. Keep browsing and keyword mode available during preparation.
- [ ] Run all Node and Python tests, publication/data validators, syntax/diff checks, and a fresh read-only review.

## Task4: Browser verification and publication

- [ ] Serve locally and verify model loading, real ranking, reasons, filters, source navigation and failure fallback in the browser.
- [ ] Verify original data files are byte-identical to the published baseline; update version strings and documentation.
- [ ] Publish only reviewed feature files and embedding data using the connected GitHub tools, preserving concurrent unrelated changes.
- [ ] Confirm Pages deployment succeeds and verify the user's query on the deployed site.
