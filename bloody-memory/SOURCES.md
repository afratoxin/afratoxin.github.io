# Pattern Block and Hidden Mission

These are independent solo practice adaptations of **피의게임 2**. All vectors, number-face sets, target footprints and mission questions in this directory are authored/generated for this site. No broadcast frames or third-party images ship with the games.

## Pattern Block

- [Episode/day 8 rule record](https://www.namu.moe/w/피의%20게임2/8일차): 25 distinct patterns; a 60-second first look; number board after hiding; three targets per map; 10-second refresher between targets; two maps/six questions; an incorrect declaration gives the opponent a 30-second opportunity.
- [Broadcast screenshot sequence](https://theqoo.net/square/2813108016), particularly `JGvVtq.jpg`, `giyDzg.jpg`, and `djlLJU.jpg`, was inspected to understand the line patterns, numbered physical blocks and spatial reconstruction. The five-block/four-face domino interface is a browser adaptation with newly generated number faces. [Match Madness official publisher rules](https://www.thamesandkosmos.co.uk/wp-content/uploads/2024/11/FM_MatchMadness_2019Redesign_Rules-compressed.pdf) corroborate the five-block pattern-reconstruction mechanism; the show adds the memory-to-number mapping.
- In this practice each number maps to a fixed oriented line pattern. Turning a domino changes the positions of its two numbers, without independently rotating their lookup patterns. Targets are generated from actual legal placements of the five blocks. Four faces and four orientations can be tried. All final placements producing the target numbers are accepted, rather than only a generation witness.
- The solo adaptation omits the opponent. Wrong declarations lock submission for 30 seconds, without revealing the answer. Solving has no deadline. Free practice also removes memory deadlines. Targets use ten unit cells, including nonrectangular footprints, generated independently of broadcast questions.

## Hidden Mission

- [Episode/day 11 rule record](https://www.namu.moe/w/피의%20게임2/11일차): 6×6, 18 pairs; 10/20/30-second study across three rounds; correct pair +1; removing a pair uncovers two characters or spaces; a mission answer +3 ends the round. Guessing before all pairs are found is allowed.
- This adaptation preserves those board sizes, study limits, scores, hidden text and round transitions, while omitting the opponent and item purchase. Wrong pair/mission declarations impose a clearly documented ten-second solo retry, without revealing any unmatched pictures.
- Double can be activated once in the whole run: the next two successful pairs give +1 then +2; an intervening pair error gives −1 and ends the effect. Open can be used once in the whole run to view one unmatched picture for three seconds; no character or point is awarded. Item usage carries across all three rounds. These are explicit browser practice details.
- Forty independently authored stable knowledge/short-math questions fit in 36 cells, with trailing spaces. Text is read row-major. NFC/NFKC text normalization, whitespace/punctuation removal and explicit answer aliases accommodate natural Korean input. No semantic guessing or online model is used for grading.

## Checks

`tests/bloody-memory.cjs` checks 720 block targets with an independent exact-cover solver, all 25 pattern references, block-face coverage, malformed/overlapping/out-of-footprint placements, and hundreds of mission boards. Fake-clock controller checks cover six questions/two maps, 60/10-second memory boundaries, three 10/20/30-second hidden rounds, early mission answers, pair/bonus scoring, cooldowns, three-second peek expiry, single-use items across rounds, double penalties and the all-pairs-found state. Shared theme and hub tests cover integration.
