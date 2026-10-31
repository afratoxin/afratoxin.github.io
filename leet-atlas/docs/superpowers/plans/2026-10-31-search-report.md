# Author DB search implementation report

## Files

- `search-intent.mjs`: inspectable Korean query compiler and Korean interpretation text.
- `reference-search.mjs`: eligibility filtering before lexical/semantic scoring, condition evidence, residual prose ranking, compatibility API.
- `scripts/search-intent.test.mjs`: 13 behavioral tests using small controlled records, the actual 755-item corpus and adversarial semantic scores.
- `scripts/reference-search.test.mjs`: retain existing regressions, update deliberately superseded soft year/form/speaker expectations.
- `writer-ui.css`: additional compact writer UI styling (see visual verification note below).

## Public API

`compileSearchIntent(query, taxonomy?)` returns `{raw, clauses, expression, required, excluded, unparsed, uncertain, contradictions}`. Clauses carry stable per-query IDs, canonical keys, kind, label, negation and their literal/tag/year/number data. Optional taxonomy objects/arrays can contribute `label` values. Expressions use `clause`, `and`, `or` nodes.

`describeSearchIntent(intent)` returns a Korean string that exposes the expression, exclusions, unparsed prose and contradictions.

The compiler additionally exposes `.syntaxWarnings`; mismatched closing parentheses no longer discard later hard conditions, and the interpretation explicitly describes the recovery. Common Korean negation endings (`없어야`, `하지 않는`, `요구하지 않는`) and “아닌 문항 제외” are covered by a failing-then-passing behavioral regression.

`rankReferences(questions, query, {semanticScores = new Map()} = {})` retains the existing array contract and existing match fields (`id`, `score`, `reasons`, `snippet`, optional evidence fields). Each match additionally has `conditionEvidence`: `{conditionId, condition, negated, satisfied, matched, label, kind, text, support?}`. Satisfied OR alternatives are reported; an unused OR branch is never claimed as satisfied.

The returned array has non-enumerable `.intent`, `.description`, `.status` and `.message`. Status is `ok`, `empty`, `no-match` or `contradiction`. Non-enumerability preserves existing JSON, mapping and empty-array comparisons.

## Behavior

Recognized material, reasoning, form, calculation, visual clues, literal phrases, exclusions, year and actual-number references filter the original candidate set before semantic ranking. Semantic scores never re-admit an excluded record. Negative-only queries work. Required unknown words marked `필수` and quoted phrases remain hard literals, including absent words. Contradictory queries do not silently relax requirements.

Normalization handles Korean spacing, compatibility characters and common punctuation, including 강화약화/강화 약화/강화·약화 and 조건부확률/조건부 확률. Law material does not match natural-science 법칙. Years support intervals, 이전/이후 and explicit/bare embedded years. `2022학년도 18번` finds the actual exam question 18; a standalone `2218` or legacy `2022` retains exact internal-ID lookup. `2009학년도 예비시험 1번` distinguishes the preliminary exam.

Adjacent facets are AND. Natural-language OR binds more tightly than facet adjacency: `법률 또는 경제학 계산 제외` means `(법률 OR 경제학) AND NOT 계산`. Parentheses clarify other scopes. Group exclusion uses De Morgan's rule. Simple `A와 B 제외` excludes both; `A이면서 B 제외` excludes only B. `제외하지 말고` preserves the positive requirement. Symbolic consistency checks include nested alternatives and mutually exclusive choice forms, with bounded work for unusually long expressions.

Unparsed prose continues to search the entire original, options, all explanations, profiles and analysis. Existing semantic evidence/provenance survives. Residual prose uses section-level lexical evidence with rare-word weighting and a small optional common-evidence paraphrase ranking aid. This aid does not impose hard filters or manufacture evidence. The corpus query `강화약화에서 두사람 모두 동의하는 증거` finds 1225 in the top ten without embeddings and preserves its exact supporting option/profile evidence.

## Verification

Red-first new behavioral suite initially failed 7/7; later group/year/feature and common-evidence tests each failed before implementation.

Latest focused command: `node --test scripts/search-intent.test.mjs scripts/reference-search.test.mjs scripts/search-documents.test.mjs scripts/search-profiles.test.mjs scripts/semantic-search.test.mjs scripts/reference-search-ui.test.mjs` — **76/76 pass**.

An earlier full `node --test scripts/*.test.mjs` run — **314/315 pass**. Sole failure: `scripts/authoring-ui.test.mjs` “unfinished form edits survive project switches and reload without marking them as a validated draft” (line 96, false !== true), outside search ownership and reported to root. The root/authoring agent was still editing shared files during that run.

The root owns final browser checks and app wiring. Search files do not change data, original answers, images, source PDFs or saved personal records.

Browser follow-up found an untagged arithmetic item (2711, public/private-interest subtraction) incorrectly eligible for `계산 제외`. Added a failing corpus regression with semantic score 1.0, then extended the calculation feature to require a quantitative field/type plus actual operation evidence and numerical quantities. Article numbers, dates and penalty thresholds alone remain eligible. Both the original corpus question and an adversarial threshold-only record are covered; the two-file search suite passes **37/37** after this fix.

Latest post-fix engine/document/profile/semantic run: `node --test scripts/search-intent.test.mjs scripts/reference-search.test.mjs scripts/search-documents.test.mjs scripts/search-profiles.test.mjs scripts/semantic-search.test.mjs` — **66/66 pass**.

Final post-audit six-file command (including `scripts/reference-search-ui.test.mjs`) — **78/78 pass**, including the 2711 quantitative arithmetic and malformed-parenthesis/negation regressions. `git diff --check` remains clean.

## Writer UI stylesheet

`writer-ui.css` is an additive stylesheet only; app/index/base styles remain root-owned. It gives the search a compact two-line entry with adjacent submit button, small mode controls, a closed help disclosure and visible interpretation; uses one readable result column with hidden tiny thumbnails; styles selection, set/compare/issue workspace and provenance/answer exceptions; retains cropped image aspect geometry with bounded normal and enlarged frames. At 760px and below it stacks controls, keeps menu labels on a horizontal scrolling line, uses 44px controls and leaves space for the selection bar. Main text is 16px, supporting text 13–14px, with navy text on white/sage surfaces. Comparison tables scroll inside their own boundary.

`git diff --check` passes. Final browser checks are delegated to root as requested; no visual QA success is claimed here. The attempted standalone CSS parser was unavailable because this machine has no `python` command, so CSS parsing/layout verification remains part of browser QA.

Desktop follow-up places closed help beside search modes and interpretation beside save/copy controls, removes the redundant explanatory sentence from the desktop metadata row (the disclosure keeps it), and tightens library header spacing. This addresses the root-observed first-card top of 782px; final measured geometry remains root-owned browser QA. Touch targets stay 44px and mobile keeps its stacked layout.

Root measured the subsequent first card at 620px with its full 196px height visible in a 900px viewport. A further desktop density pass uses a 62px two-line entry, removes the redundant library introductory sentence and idle pre-query status, and tightens spacing. Search progress/error statuses remain visible after a submitted intent exists. Final remeasurement is root-owned.

## Limits

This is a deterministic on-device compiler plus lexical/semantic retrieval, not unrestricted language comprehension. Unknown prose is exposed as prose, not silently represented as a recognized requirement. Explicit quotes or `필수` can require unfamiliar terms. Ambiguous unparenthesized coordination follows the documented local scope; use parentheses for group exclusion.

Negative feature evidence means no corresponding clue was found in current taxonomy/verified extraction/profile evidence; it is explicitly marked as unconfirmed for unextracted image content. It does not prove that an image has no table or that arithmetic can never be used. Visual clues remain content-derived text/verified visual clues, not new image recognition.

Symbolic contradiction search has a 2048-step budget. Budget exhaustion avoids a false contradiction claim and the actual candidate filter still enforces every clause. Arbitrary highly complex prose and implicit real-world entailments remain dependent on available source evidence and semantic-model quality.
