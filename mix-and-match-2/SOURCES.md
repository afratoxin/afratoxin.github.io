# Mix & Match II

This solo practice game uses original Korean word lists and a newly authored grid alphabet. Each syllable has a fixed seven-column, eleven-row drawing box. Its occupied-cell bounds span all seven columns and all eleven rows; cell geometry stays square in both playback and the merged answer. There is one outer grid cell and two blank grid columns between syllables.

The user's supplied broadcast example (2026-11-15) establishes the tall block-letter proportions. No image pixels are shipped. `scripts/build-mix-hangul.cjs` builds the 175 complete syllable bitmaps in `glyphs.js` from block strokes and Hangul component layouts. It allocates five rows to final ㄹ to preserve its three separate horizontal strokes. The browser loads the complete atlas and never depends on the device's font rendering.

The twelve stages follow a fixed length schedule: four two-character words, five three-character words, three four-character words. Words shuffle within those groups, without repeats in a session. Three/four-piece selection, three-second playback, five-second declaration, scoring and thirty-second wrong-answer cooldown remain unchanged.

`node tests/mix-hangul.cjs` checks all glyph dimensions and occupied bounds, distinct bitmaps, word spacing, exact reconstruction from disjoint pieces, 100 decks, full twelve-stage scoring and timer/control behavior.
