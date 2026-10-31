# Authoring workspace report — 2026-10-31

## Scope and files

Owned changes are `authoring.mjs`, `authoring-ui.mjs`, `authoring.css`, `author.html`, new `author-rich-content.mjs`, `scripts/authoring-workspace.test.mjs`, and additions to `scripts/authoring-ui.test.mjs`. No source archive, baseline answer, local HWP helper or shared app changes were made by this task.

## Behavior and APIs

- Named project bank: up to 30 projects, switch/rename/create, per-project unfinished editor autosave, whole-bank JSON export/restore. Single project import creates an additional project and retains the previous project. Existing `PROJECT_KEY` remains a current-project compatibility snapshot. New `BANK_KEY` is `leet-atlas:authoring-bank:v1`.
- Actual draft changes retain the previous draft with ISO timestamp and ID; latest 20 versions, field-by-field before/after comparison, explicit restore that also retains the current draft. Identical draft import/save retains human confirmations and does not add a version. Pure APIs: `withDraft`, `restoreVersion`, `draftDiff`.
- Structured editor: title, passage, stem, five choices, answer, solution, one-step-per-line steps, five option analyses, expected minutes, classification selections and evidence. No complete JSON response is required to begin authoring. Incomplete editor fields are stored separately as `pendingEditor`, never counted as validated publication content. `parsePendingEditor` validates types/limits and attachments without requiring completed text.
- Old five AI-review checks migrate to nine: construct necessity, shortcut paths, distractor plausibility, expected time are added as `uncertain`, with unconfirmed human checks. Existing checks remain intact. Manual draft edits make prior AI checks uncertain and reset human checks; AI and human status remain visibly distinct.
- `qualityHints` reports deterministic checks (explicit monetary cap vs choices, absolute wording, absent expected time). Wording clearly says they are review prompts, not logical proof.
- Safe rich preview: Markdown pipe tables, literal escaped HTML, native MathML from a deliberately small TeX subset. Supports ASCII variables/numbers/operators, braces, superscripts/subscripts, `\frac`, `\sqrt`, selected Greek and comparison symbols. Unsupported formulas remain visible in highlighted literal `$...$` form. No HTML import, eval, external math runtime, or remote images.
- Raster attachments: max 3; each PNG/JPEG/WebP data URL max 120KB; matching base64/raster signature; PNG/JPEG/WebP pixel bounds, plus browser decoding and dimension validation for local upload (4096px per dimension / 8MP). Captions and after-passage / after-question / solution placement persist in project, unfinished editor, version and bank exports. Safe previews and printable question preview include images.
- Creation packets include taxonomy definitions/descriptions, `assignmentBoundary`, parent/parentId, and optional final-treatment metadata. Author boot loads `data/answer-exceptions.json`; matching records are attached only to a private question copy. Book answer remains unchanged and final handling is labelled separately; unregistered questions are not claimed free of exceptions.
- Existing default plain question-first prompt, JSON mode/repair, clean question-only or question+solution clipboard/TXT exports remain compatible. New metadata is in the workspace and review/packet paths. Local HWP workflow is preserved unchanged; plain TXT/HWP does not automatically place raster images. UI explicitly explains this and offers printable rich preview.
- 44px controls, scroll-safe tables, mobile stacking, restrained paper palette. Advanced import/export controls are in a management disclosure.

## Migration and failure behavior

Legacy project is read only if bank is absent, validated into the bank in memory, and saved on later changes. Bank and all imported projects/versions/pending content are fully validated before assignment. A corrupt persisted bank is never overwritten by subsequent edits (write-blocked recovery session, JSON export still usable). Malformed imports keep current work. Storage quota failures leave memory and export working and show a warning. Large images/history may reach browser quota before the theoretical 30-project/20-version limits; export is the recovery path. Bank restore intentionally restores the chosen saved bank.

## Verification

Test-first failures were observed for added review migration, history/no-op behavior, attachment rejection, table/MathML preview, quality hints, taxonomy/final-treatment packets, bank persistence, form editing/restore, non-destructive project import, and unfinished editor switching/reload. Final focused command:

`node --test scripts/authoring-ui.test.mjs scripts/authoring-workspace.test.mjs scripts/authoring.test.mjs`

40 authoring tests passed, 0 failed (41 including the shared writer-label test). Existing publication text/clipboard/TXT regression assertions remain in the passing suite. Syntax checks for authoring UI passed. Root owns full-suite and browser/desktop/mobile integration review.

## Limits and remaining integration review

- No automatic logical proof, live LLM generation, official-decision completeness claim, or measured solving-time claim.
- Formula subset and pipe-table syntax are intentionally limited; unsupported syntax is preserved. Inline images are local-only embedded rasters; SVG/HTML/network URLs are rejected.
- Imported raster signatures and dimensions are validated for PNG, JPEG (SOF markers including progressive), and WebP (VP8, VP8L and VP8X). Every supported import enforces 4096px per dimension and 8MP total. Truncated/missing size metadata, inconsistent WebP canvas/frame dimensions and animated WebP are rejected. The dependency-free parser is not a full entropy decoder; local uploads additionally use browser image decoding.
- Existing 500KB completed/unfinished draft limit includes embedded image data; project limit 12MB and bank limit 30MB. Browser quota may be lower.
- Browser visual and print review remains with root (project bank, forms, attachments, history, narrow viewport, HWP handoff).

## Review correction — 2026-10-31

Closed the JPEG/WebP dimension validation gap with actual Pillow-generated bounded-byte fixtures for valid, >4096px and >8MP PNG/JPEG/WebP images, including lossy, lossless and extended WebP. Truncated signature-only inputs are rejected. Authoring now imports the shared `question-label.mjs`, preserving the 2009 preliminary marker separately from regular 2009 questions. Updated changed authoring dependencies (`reference-search`, `search-documents`, archive and shared styles) to the author-db1 cache token; unchanged semantic-search keeps its existing version. Focused command with `scripts/writer-label.test.mjs`: 41 passed, 0 failed.
