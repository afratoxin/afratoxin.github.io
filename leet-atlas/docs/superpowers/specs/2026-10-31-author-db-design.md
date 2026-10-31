# 출제자용 LEET DB 개편

## Intent and authority
The user explicitly approved implementing the preceding critical review with corrections: this is an item-writer DB, not a student practice app. Existing answers are the explanation-book baseline and must remain intact. Actual final multiple/no-answer decisions are separate records. User delegated the visual design, useful analytic axes and additional author tools. Proceed without an additional design approval gate; the latest detailed request is the execution authority.

## Constraints
- Preserve all 755 baseline questions, answers, source PDFs/images, previous links, bookmark/review records and the current clean question/HWP output workflow.
- Static GitHub Pages, no credentials or paid server required. Public search runs on-device; no claim of unrestricted LLM comprehension.
- Explicit natural-language requirements/exclusions constrain candidate eligibility before semantic ranking. Expose interpreted conditions and uncertain/unparsed text; never silently relax a contradictory query.
- Keep book answer and final treatment separate. Every known exception needs status, scope, source, date and explanation. Never infer official verification for unresearched questions.
- Visual margins are removed from every bundled image using content bounds; source pixels/PDFs remain recoverable. Local imported source must not receive another source's bounds.
- Display questions as 학년도 + actual number, with stable internal IDs retained in URLs/data.
- No student test/timer/score features. Build writer research, comparison, sets, review and authoring tools.
- Escape user content and validate imported JSON and attachments. Preserve old local data on failed import/migration.

## Approach
Extend the existing dependency-light ES modules. Search becomes a structured intent compiler plus evidence-based retrieval and semantic reranking. Research tools and source-image presentation are separate modules to avoid further growing app.js. Authoring remains the user-approved ChatGPT prompt/copy/import workflow, with structured editing and versioned projects.

## Deliverables
1. Search: required/excluded material, reasoning, form, numeric/visual features, year/number; OR and negation; normalization; compound conditions; explicit evidence per requirement; unconstrained prose ranked by source sections. Same engine in library and authoring. Save searches, share query in URL, navigate within active result set. Optional tag OR mode.
2. Source and provenance: all-image content bounds, human-readable labels, book/final answer overlay, a known-decision registry, provenance panel and local issue/review history.
3. Design analysis: replace percentile difficulty score with transparent design-demand dimensions and separately sourced empirical rates. Missing diagram workload is unknown, never zero. Isolate actual stem question before classifying polarity. Default year map uses mean source text length and share of condition/quantitative processing items; alternate axis pairs and point-to-question evidence make it an exam-assembly tool, not a difficulty ranking.
4. Research workspace: named item sets, up to four-item side-by-side comparison, same-logic/different-material and same-material/different-task suggestions, saved searches, review backup/restore and issue records. Export set JSON/Markdown and printable question/reference and answer documents.
5. Authoring: project bank, non-destructive versions, form editor for passage/stem/options/answer/explanations, table and formula/diagram content support, safe attachments, review of construct necessity, shortcut solutions, distractor plausibility and expected time. Keep AI versus human review distinct; add deterministic hints rather than claiming automatic logical proof. Include taxonomy boundaries and exception notes in reference packets.
6. UI: compact search above visible results, legible type/contrast, optional secondary controls, no giant internal IDs, useful preview text, restrained palette, consistent 44px touch targets and non-broken mobile nav. Preserve author-specific advanced import/export in a management disclosure.

## Validation
Meaningful regression queries cover hard negation, OR, synonyms, semantic leakage and zero-result contradictions. Image bounds must enclose every detected foreground pixel on all 755 assets. Analysis tests cover diagram missingness, real prompt polarity, known empirical gaps and all-year map coverage. Legacy authoring projects and review backups must migrate without losing data. Browser checks cover desktop/mobile library, search, detail, comparison, authoring and print/export. Review the whole change before publishing; publish with expected-HEAD concurrency protection.
