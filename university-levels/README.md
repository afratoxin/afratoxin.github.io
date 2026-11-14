# Five-stage practice

Maze, Rainbow, Ladder, Hidden Algorithm and Weekday Equation each have five stages and twelve prepared problems at each stage: 300 problems. Clear to advance; forfeit reveals the answer and draws another problem at the same stage. Problems do not repeat until that stage's pool is exhausted. Stage five ends the run. Starting again resets to stage one.

| Stage | Maze mean moves | Rainbow medium / complex | Ladder rails / rungs | Algorithm grid / route cells |
|---|---:|---:|---:|---:|
| 1 | 9.4–10.0 | 3 / 0 | 5 / 9 | 5×5 / 5–7 |
| 2 | 10.2–10.8 | 3 / 1 | 5 / 10, tilted | 6×6 / 7–9 |
| 3 | 11.0–11.6 | 3 / 2 | 5 / 12, tilted | 6×6 / 9–12 |
| 4 | 12.6–13.2 | 2 / 4 | 6 / 14, tilted | 7×7 / 12–16 |
| 5 | 13.4–14.0 | 1 / 6 | 6 / 16, tilted | 8×8 / 16–22 |

Maze difficulty uses the mean of the five entrance-to-goal route lengths, excluding the starting cell. Adjacent stage bands do not overlap. Every board is connected and has five unique colored goal patterns and goals on all three entrance branches.

Rainbow clears after all 49 cells (70 points). Later boards replace basic rules with more digit-based, interleaved, reversed and composite patterns. The earlier trivial all-basic level has been removed.

Ladder now begins with nine rungs instead of five. Every rung has an explicit owner and every prepared source fragment is consistent with the reconstructed scoring diagram. Tilted rung endpoints stay vertically ordered; six rails begin at stage four. Answers are always in currently visible bottom order.

Hidden Algorithm begins with a readable 5×5 board and short traversal, then increases both board size and route length. Calendar uses actual dates and five variable weekdays with square, exponent, factorial, division and product templates. Its targets are restricted to 15–205; factorial arguments must be 0–6 and variable exponents 0–3. Each pool cycles through its permitted expression families, rather than repeatedly accepting only the easiest templates.

Regenerate with `node scripts/build-university-levels.cjs`. Pool and controller suites independently check connectivity, route length, unique patterns, pixel arithmetic, real calendar dates, alternative valid answers, every visible Ladder fragment, five-stage completion, and same-stage retries.
