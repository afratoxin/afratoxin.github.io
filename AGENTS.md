# BRAIN ARENA interface requirements

These rules apply to `brain-arena/` and every game registered in its catalog. They do not apply to unrelated study sites or the personal blog in this repository.

The user requires one consistent design across the game hub, category folders and all individual games, including future additions. Use `brain-arena/theme.css` as the shared interface stylesheet. Load it **last**, after board-specific styles and inline style blocks, on every game and hub page. Do not copy the common styles into individual games or create an alternative interface theme.

- Mark the hub's `html` with `data-arena="hub"`. Mark each game's `html` with `data-arena="game"` and `data-arena-id="<catalog id>"`.
- Use the shared navy background, mint primary controls, text colors, typography, panel borders, corner radii, spacing and responsive breakpoints from `theme.css`. Change these centrally when a shared design change is requested.
- Keep a consistent `header.arena-header`: a linked `.brand` on the left and `nav.arena-nav` with `aria-label="게임 탐색"` on the right. Include links to `게임 보관함` and the correct source folder (or nested group).
- Prefer the existing `.shell`, `.intro`, `.layout`, `.board-shell`, `.side`, `.panel`, `.primary` and `.secondary` interface structure for new games. Desktop games normally have a board and a 304px control column; stack them below 900px. Specialized dual-view games may retain the space their game needs.
- Preserve colors, symbols, contrast and geometry that carry game rules: suit colors, pixel backgrounds, sequence colors, cube face colors, target rings, diagrams and game boards are not interface decoration. Keep game rendering and scoring independent from the theme.
- Keep current game URLs, rules, timers, difficulty and saved game state intact when changing presentation. Do not rename element IDs that controllers depend on.
- Before publishing interface changes, run `node tests/arena-theme.cjs` and affected game suites. Inspect the hub and representative game layouts in the browser, including one with older inline styles. Check that navigation, board controls and mobile stacking remain usable.

See `brain-arena/AGENTS.md` for category and catalog rules. All new games must satisfy the same shared design contract before being added to the catalog.
