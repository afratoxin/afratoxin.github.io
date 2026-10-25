# All-years question text implementation plan

**Goal:** Connect all 755 question texts while preserving the existing public-source boundary.

**Architecture:** Build one browser-only import containing the 715 local-only questions; retain the 40 existing 2027 texts. Reuse the existing parser, storage and reader flow. Display global/per-exam coverage and card availability.

- [x] Compare all715 source crops and extract hidden glyph/small-font risks using PDF metadata; inspect flagged source images.
- [x] Add a strict generic import builder with synthetic unit tests and exact, externally supplied correction records.
- [x] Add coverage UI and full715-row import/restore/search tests over the real755-question registry.
- [x] Apply verified source-text corrections and validate every real715 imported body plus existing2027 texts.
- [x] Save the consolidated body file for the user; keep original payloads outside the public repository.
- [ ] Run all code/data checks and publish only the functional changes and generic builder/tests.

**Constraints:** Do not change source PDF, existing2027 originals, answers, explanations, classifications, tag IDs, bookmark storage, or user notes. No new public original text/image payloads. Preliminary and regular2009 are distinct rounds. Text-only reconstruction cannot preserve arbitrary diagrams.
