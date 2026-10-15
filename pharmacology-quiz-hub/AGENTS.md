# Pharmacology quiz hub conventions

All existing and future scored quizzes must use the shared wrong-answer review and progress system.

- Register each complete question bank in `study-catalog.mjs` through `studyStore.register`. Use stable IDs and an explicit route/title; dynamic numeric quizzes count a finite set of problem forms. Register the full bank, even if the initial UI filters to high-yield questions.
- Call `recordStudyResult(scopeId, actualRenderedQuestion, correct)` once after grading. A question shown or skipped is unattempted. Store the actual rendered wrong question, including its numbers, choices, correct answers, explanation, table, plot, and figure. Do not generate new numeric values during retry.
- Each bank ID has one latest result. A correct retry removes it from the wrong list; a later miss adds it again. Attempts never increase the bank denominator. Preserve existing storage keys and migrate records without overwriting newer results.
- Use `createMatchBoard` for drag exercises. Register a matching definition and pass `studyId` (or a registered `boardIds` mapping). Only placed cards count as attempted. Wrong-only practice must keep the complete category set and accept every valid category.
- The shared review UI derives menu progress and retry tabs from the catalog. New lecture menus should use `.hub-card[data-open]` with the registered route. Provide a `tabId` for progress within an individual quiz tab. Never ship a quiz without an accessible retry entry and proportional progress.
- Refresh an existing matching board with `board.open()` when returning to its view. Preserve native Enter activation on navigation buttons and ignore keyboard answers in hidden views.
- Keep shared module cache versions identical across all importers and bump affected module/HTML/CSS versions when publishing.
- Run `node --test *.test.mjs`. Extend the app integration tests for a new bank or matching set. Validate the complete module graph and HTML IDs/ARIA references. Publish to the existing GitHub Pages repository and verify deployment success.
