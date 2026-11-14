# University War solo practice

Nine separate entries, registered under `university-war`. These are browser-generated practice puzzles, not a reproduction of a team competition. Existing Blood Game `mix-and-match/` and `mix-and-match-2/` are unrelated and retain their original category and URLs.

## Sources checked

- Match & Mix: [official Coupang report](https://news.coupang.com/archives/32916/), [season 1 round 3 rule record](https://namu.moe/w/대학전쟁/3회전). Eight sliding panels, five chips per panel, 20 pairs, 10-second initial study per panel and answer turn, compulsory panel move on a missed turn, no immediate reverse; round 3 also moves after a match.
- Pixel Number 1: [season 1 round 2 rule record](https://namu.moe/w/대학전쟁/2회전), [broadcast grid reference](https://img-cdn.theqoo.net/pkOMOa.png). Fifteen 3×5 cards, at least two cards per composite, three targets, five rounds, final hidden target worth three points.
- Pixel Number 2 / Area Ranking / Either Or: [official season 2 preview](https://www.youtube.com/watch?v=GStobpKlNKA), [rule record](https://dark.namu.moe/w/대학전쟁2/1회전). [Pixel reference](https://img-cdn.theqoo.net/HzGLqF.jpg) confirms gray/white background groups; each independently subtracts blue union from red union. [Area reference](https://img-cdn.theqoo.net/egpXFV.jpg) confirms connected regions in a 9×9 board. Either Or requires entering the larger numerical sum, not choosing a side.
- Merged Ladder / Hidden Algorithm / Weekday Equation: [official pyramid-game rules](https://www.youtube.com/watch?v=5WBLS7d-NMQ), [rule record](https://namu.moe/w/대학전쟁2/2회전). [Ladder](https://img-cdn.theqoo.net/QMAHzr.png): shuffle vertical strips horizontally, not layers. [Algorithm](https://img-cdn.theqoo.net/KgMVTV.png): 8×8 grid, exclude the immediately previous cell, halt on tied best neighbors, stop exactly at destination. [Weekday problem](https://img-cdn.theqoo.net/nUjoOQ.png) and [solution](https://img-cdn.theqoo.net/dRdIjC.png): choose actual dates of each weekday, not ordinal weekdays.
- Trisection: [official clip](https://www.youtube.com/watch?v=SjqAWjdn2P8), [season 3 round 2 rule record](https://namu.moe/w/대학전쟁3/2회전). All initial-consonant cards used by three canonical Sino-Korean positive integers, target sum, 30-second declaration window. Canonical unit names omit leading 일 before 십/백/천.

## Solo adjustments

Area Ranking hides internal cell grid lines at the user's request. All four regions stay connected and have distinct areas of 18–23 equal units (81 total), keeping comparisons close.

Match & Mix omits opponent turns and ends each of three rounds after eleven pairs. Free practice leaves numbers visible. Pixel 1 uses a three-minute round; its final hidden slot accepts any non-public decimal digit that can be formed. The other standalone tasks use ten questions (Trisection five; Merged Ladder now uses eight stages), a local score and retry cooldown, rather than team elimination or a first-to-three duel. Challenge limits: 120 seconds for the season 2 opening tasks, decreasing ten seconds after every four questions; three minutes for the other puzzles. Incorrect answers cost a point and allow retry after ten seconds (Trisection twenty). Free practice removes answer deadlines. Forfeit or expiry reveals a worked solution.

Multiple valid weekday, consonant and priority answers are accepted by the constraints rather than compared with one generated example. Geometry, canonical spelling, pixel compositing and date answers are verified independently in `tests/university-games.cjs`.

## Interaction updates requested by the user

Trisection cards can be dragged between a pool and three groups, reordered within groups, moved by tapping or keyboard, and reset without clearing typed answers. Repeated consonants retain separate card identities. Placement and typed answers persist through the retry cooldown.

Merged Ladder displays `?` at all five or six visible lower ends. In the reconstructed ladder, labels 1–5 (or 1–6) begin at the upper ends; trace these through the reconstructed rungs, then report their arrival values in the current shuffled display’s left-to-right order. The answer is not the lower values listed by strip identifier 1–5. Review reveals the displayed lower values plus the reconstructed diagram and individual routes.

## Progressive Merged Ladder

Merged Ladder has eight stages and twelve prepared problems per stage. A correct answer advances; forfeit offers a different problem at the same stage. Stages 4–8 use tilted rails and sloped rungs; stages 6–8 have six rails, six unknown bottom labels and six-digit answers. Rung endpoints remain ordered vertically so tracing and grading use the same sequence of swaps. See `university-levels/README.md` for stage configuration and verification.
