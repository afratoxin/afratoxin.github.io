# Smart tag filters implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement the checked tasks.

**Goal:** Select `(2025 OR 2026) AND 논리 퍼즐` without choosing a global operator.

**Architecture:** Use taxonomy axis metadata to OR year tags and AND every other selected tag. Share the grouping between the filter engine and visible expression. All existing search, bookmark, review, sort and navigation constraints remain active.

**Tech stack:** Buildless JavaScript ES modules, node:test, existing Python data validators.

**Spec:** User request of 2026-10-26: mutually exclusive tags use OR; overlapping tags use AND. Audit of all 755 questions shows only year has cardinality one; all five other axes overlap.

## Global constraints

- Change only filter behavior, UI guidance, tests and documentation; preserve archive data and source publication scope.
- Retain existing tag IDs, aliases, local text import, bookmark storage and review notes.
- Treat unregistered tag metadata conservatively as AND. Never infer exclusivity from absence of cooccurrence or display neighborhoods.

## Review focus

- Old `tagMode=or` URLs must migrate to automatic conditions.
- Adding a second year from a dedicated year collection must retain both years.
- Preliminary and regular 2009 are different exam tags.
- Multiple overlapping types or logic tags must remain AND.
- Query, bookmark, review, sorting, pagination and reader return must retain the same selected constraints.

## Implementation and verification

- [x] Reproduce the four real-archive UI failures before editing product code.
- [x] Add core regression tests for taxonomy array/Map, opaque IDs, unknown metadata, overlapping tags and real question IDs.
- [x] Implement `tagFilterGroups(tags, taxonomy)` and automatic matching in `core.mjs`; migrate route modes.
- [x] Update `app.js`, `styles.css`, `index.html` and README with automatic guidance, the visible expression and year collection navigation.
- [x] Run all Node tests and existing archive/publication/data validators; obtain independent code review.
- [ ] Publish only changed code/tests/docs to the current GitHub master using a leased fast-forward update; verify deployed asset versions and question links.
