# Stage-based practice

Triple Maze, Rainbow Sequence and Merged Ladder each have eight stages, with twelve prepared problems at every stage: 288 problems in total. Pool files are loaded only by the relevant game. They contain complete checked problems, so starting a browser game never runs a slow rejection-based maze generator.

Clear a problem to unlock the next stage in the current run. Forfeit reveals the answer and offers a different problem at the same stage. Wrong-answer cooldown and failed maze attempts retain the current problem and stage. Problems do not repeat within a stage until its twelve-member pool has been exhausted; the immediate previous problem is also excluded when recycling a pool. Clearing stage eight ends the run. Starting a new run resets to stage one.

| Stage | Maze mean route length, moves | Rainbow medium / complex rules | Ladder rails / rungs | Ladder tilt |
|---|---:|---:|---:|---:|
| 1 | 7.8–8.4 | 0 / 0 | 5 / 5 | 0 |
| 2 | 8.6–9.2 | 2 / 0 | 5 / 7 | 0 |
| 3 | 9.4–10.0 | 3 / 0 | 5 / 9 | 0 |
| 4 | 10.2–10.8 | 3 / 1 | 5 / 10 | 24 |
| 5 | 11.0–11.6 | 3 / 2 | 5 / 12 | 36 |
| 6 | 11.8–12.4 | 2 / 3 | 6 / 12 | 36 |
| 7 | 12.6–13.2 | 2 / 4 | 6 / 14 | 42 |
| 8 | 13.4–14.0 | 1 / 6 | 6 / 16 | 45 |

Maze difficulty is the arithmetic mean of the five entrance-to-destination routes, in moves, excluding the starting cell. The intervals are disjoint: every problem at the next stage has a greater mean than every problem at the previous stage. All 81 cells remain connected, the five colored destination patterns are unique, and destination routes use all three entrance branches. Later stages allow some longer shared subpaths while preserving three separate entrance routes. Stages 3–8 grow three side regions separately to keep the destinations spread rather than creating one long common corridor.

Rainbow fills all 49 cells to clear one stage. Normal cells remain one point and hidden G-column cells four points, for 70 points per completed board. The timer, number of cells and memory rules remain constant. Difficulty increases by replacing basic arithmetic, geometric, square and triangular patterns with alternating, changing-difference and digit rules, then interleaved, reversed and composite rules. Each board contains seven distinct sequence families. Rules are shown only in the answer review.

Ladder difficulty increases through rung count, then tilted rails and sloped rungs, then six rails. The tilt column above is the horizontal offset in SVG units, not degrees. Sloped rung endpoints remain strictly separated in height, so the logical order of swaps is unchanged. Answers always follow the currently displayed lower ends from left to right. All lower labels remain `?` until review. The answer input and review route controls expand to six digits/routes automatically.

Regenerate the deterministic pools from the repository root with `node scripts/build-university-levels.cjs`. `tests/university-level-pools.cjs` checks every prepared problem, all sequence recurrences, stage separation and no-repeat selection. The controller suites also clear all eight stages of each game and verify retry/forfeit behavior and final completion.
