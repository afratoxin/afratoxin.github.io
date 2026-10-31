# Authoring Workspace Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement inline. User requested continued execution toward the full goal.

**Goal:** Turn a free creation brief and selected LEET references into a complete generation prompt, then display, classify, review, save and export the resulting question.
**Architecture:** Dedicated author.html reuses archive, rankReferences and the existing browser model. Pure authoring functions own source packets and strict draft/project validation; a UI module owns asynchronous search and local work.
**Tech Stack:** Native browser ES modules, existing E5 search, localStorage, Node test runner, GitHub Pages.
**Spec:** ../specs/2026-10-31-authoring-workspace-design.md

## Global Constraints

- No paid generation, query transmission or new model; ChatGPT handoff is explicit copy/open.
- Preserve all755 source questions and existing search/reader behavior.
- Source packets preserve every selected source/option/explanation; maximum5 references.
- Imported AI review is not a verified logical verdict; manual confirmation resets on draft changes.
- Invalid import or storage failure must preserve current in-memory work.

## Review Focus

- Arbitrary briefs use the same real semantic search path and cannot show stale results.
- Broken, truncated, duplicate and malicious response JSON cannot overwrite a valid draft or inject markup.
- AI pass labels must not become independent logical approval.
- Edited references/brief/notes cannot leave an old prompt represented as current.
- Lost storage permission and reload/import must keep a usable export/recovery path.

### Task 1: Source packets, generation contract and draft/project validation

**Files:** authoring.mjs; scripts/authoring.test.mjs.
**Interfaces:** buildCreationPrompt({brief,designNotes,questions,taxonomy,draft}) -> string; parseDraft(input,taxonomy) -> normalized draft or Error; inspectDraft(draft) -> structural checks; parseProject(input,taxonomy,questionIds) -> normalized project.

- [x] Write meaningful tests for complete source packets, arbitrary brief preservation, output schema, invalid choice/answer/review/classification, fenced JSON, roundtrip and review invalidation; run RED.
- [x] Implement pure functions and run focused tests GREEN; commit.

### Task 2: Search, selection, prompt handoff and review workspace

**Files:** author.html, authoring-ui.mjs, authoring.css; app.js/index.html reference/menu links; scripts/authoring-ui.test.mjs.
**Interfaces:** createAuthoringWorkspace(root,{archive,storage,semanticSearch,download,clipboard}) -> workspace; module initializes on author.html.

- [x] Add route/link and UI behavior tests for selection, stale search, invalid import preservation, escaping, storage failure, edited-prompt freshness and review reset; run RED.
- [x] Implement3-stage responsive screen and persistence, prompt copy/download/open, validated draft/project import, review and export; run focused and full Node suite; commit.

### Task 3: End-to-end audit and publication

**Files:** README, completion record, screenshot.

- [x] Verify local browser actual E5 search and complete coherent draft roundtrip, narrow view and keyboard controls.
- [x] Obtain independent whole-change review and fix significant findings; run relevant tests and publication validators.
- [ ] Preserve current master, publish through authorized GitHub connection, verify Pages and production workflow; record evidence and screenshots.
