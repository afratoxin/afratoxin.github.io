# University War memory and strategy games

Five independently playable, unofficial browser adaptations. All are registered in the University War hub folder. The source boards, movement constraints and scoring below were checked before implementation.

## Sources and rules

- **Triple Maze:** [official rules and play](https://www.youtube.com/watch?v=ZpeEkuVwoPY), [season 2 round 5 record](https://d.namu.moe/w/대학전쟁2/5회전). Three colored wall maps of a 9×9 maze; five three-wall colored destination patterns; two-minute observation, hidden movement, ten seconds per step, no immediate reversal. This adaptation generates connected mazes and checks that each destination pattern has exactly one matching location. Entry is I5.
- **Exit Strategy 2:** [official play](https://www.youtube.com/watch?v=TJcLhuuP5TE), [official episode report](https://news.coupang.com/archives/49485/), [season 2 round 3 record](https://d.namu.moe/w/대학전쟁2/3회전). A 7×7 board, central D4 exit, A4/G4 blockers, six pieces per side. A piece slides until blocked or at the board edge. Exit requires its final stopping point to be D4; passing across it does not end movement. This interpretation was checked against the actual clip's piece positions. Two escapes win a round; two round wins win the match.
- **Sum & Difference Gomoku:** [official rules and play](https://www.youtube.com/watch?v=CKlwtK6i61A), [official episode report](https://news.coupang.com/archives/49300/), [season 2 round 2 record](https://d.namu.moe/w/대학전쟁2/2회전). A 9×9 board, four stones of each value 1–5 for each side, opening value at most 3. Add own values and subtract opponent values along an uninterrupted maximal occupied line: exactly 16 wins. Opponent end stones remain part of the line; the published play's arithmetic supports counting the entire line rather than an arbitrary subsegment. No five-stone requirement. Two round wins win this browser match.
- **Rainbow Sequence:** [official rules and play](https://www.youtube.com/watch?v=a4AIHhzNcJA), [official episode report](https://news.coupang.com/archives/49654/), [season 2 round 5 record](https://d.namu.moe/w/대학전쟁2/5회전). Seven colors, one of each per column on a 7×7 board, color sequences read A→G. G-column terms are hidden. Five-minute study; numbers hide while colors remain. Normal values score one point; hidden values score four. One-minute answer turns.
- **Rotating RPS:** [official episode report](https://news.coupang.com/archives/32964/), [official final report](https://news.coupang.com/archives/32984/), [season 1 round 4 rules and play record](https://d.namu.moe/w/대학전쟁/4회전). The 7×7 hand-symbol floor and first three cube nets follow the recorded broadcast layouts. Two of each hand on a cube; two-minute net study, three visible faces, exact 3/4/5-step turns, no immediate reversal, twenty seconds per turn. Compare the final bottom face with the floor for +1/0/−1. Four points wins a round, three rounds wins the match. START above A4 (D column) is inferred from the broadcast diagram and move record; it cannot be revisited. Cube rotation is tested against independently rotated 3D normal vectors.

## Browser adaptations

Triple Maze and Rainbow Sequence now use five ascending stages, with twelve prepared problems at each stage. See `university-levels/README.md` for measured difficulty bands and selection behavior. Maze clears after two distinct destinations; Rainbow clears after all 49 cells. Correct clears advance, while forfeits draw a different problem at the same stage. Maze mean route length is measured over all five goals and strictly increases between stage pools. Rainbow adds increasingly complex rule families without changing observation or answer time.

Gomoku, Exit Strategy 2 and Rotating RPS have computer opponents using only the public board and rules. Exit combines the broadcast leader and mover roles into one player's controls; legal starting positions vary within the two side groups. The computer considers legal moves, immediate results and opponent responses. It is a practice opponent, not a guaranteed optimal solver.

Free practice removes deadlines. Triple Maze keeps reference maps visible; Rainbow keeps study numbers visible except hidden terms; Rotating RPS keeps the net visible. All games offer forfeit results. Review time stops, and restarting cancels pending computer moves.

## Verification

`tests/university-strategy.cjs` independently checks maze connectivity, wall symmetry and destination uniqueness; maximal-line arithmetic and legal stone inventory; sliding stops and exact-stop escape; sequence recurrences and board color constraints; physical cube rotations and legal paths. Controller checks complete two maze goals, verify actual computer replies, preserve cumulative sequence scores across rounds, and exercise animated shared-cube turns and restart cancellation.

`tests/triple-maze-balance.cjs` retains checks for the original short-route generator. `tests/university-level-pools.cjs` validates all 300 prepared stage problems, including every maze's mean route length and every sequence recurrence. Controller tests complete all five stages, including six-digit ladder answers and final-stage completion.

## Rotating RPS visual orientation

The visible cube now uses six stable face colors matching the study net and vector hand glyphs projected onto the actual face planes. Per-face print-up vectors rotate with the cube. The printed arrow follows those same vectors; it indicates picture orientation. The front and right face directions are explained relative to the board arrows. The hand type and floor scoring remain unchanged. Tests verify face-frame orthogonality and four-roll return, as well as the projected visible colors and transforms.
