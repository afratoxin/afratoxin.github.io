# Pattern Block and Hidden Mission

These are independent solo practice adaptations of **피의게임 2**. All vectors, target footprints and mission questions in this directory are authored/generated for this site. No broadcast frames or third-party images ship with the games.

## Pattern Block

- [Episode/day 8 rule record](https://www.namu.moe/w/피의%20게임2/8일차): 25 distinct patterns; a 60-second first look; number board after hiding; three targets per map; 10-second refresher between targets; two maps/six questions; an incorrect declaration gives the opponent a 30-second opportunity.
- The browser uses independent single-cell numbered tiles at the user's request. Numbers 1–25 can be copied to any target cell, replaced, erased, moved or swapped. A history restores placements after edits and clears. Each number maps to one fixed oriented line pattern. No domino, face or rotation constraint remains.
- Connected ten-cell targets are generated directly, with at least seven distinct target numbers. Any placement with exactly the correct number in every target cell is accepted.
- The solo adaptation omits the opponent. Wrong declarations lock submission for 30 seconds, without revealing the answer. Solving has no deadline. Free practice also removes memory deadlines. Targets use ten unit cells, including nonrectangular footprints, generated independently of broadcast questions.

## Hidden Mission

- [Episode/day 11 rule record](https://www.namu.moe/w/피의%20게임2/11일차): 6×6, 18 pairs; 10/20/30-second study across three rounds; correct pair +1; removing a pair uncovers two characters or spaces; a mission answer +3 ends the round. Guessing before all pairs are found is allowed.
- This adaptation preserves those board sizes, study limits, scores, hidden text and round transitions, while omitting the opponent and item purchase. Wrong pair/mission declarations impose a clearly documented ten-second solo retry, without exposing hidden letters on an error. An incorrect pair leaves precisely the two selected pictures visible for the entire ten-second cooldown, then covers them again. A wrong mission answer exposes no additional pictures.
- Double can be activated once in the whole run: the next two successful pairs give +1 then +2; an intervening pair error gives −1 and ends the effect. Open can be used once in the whole run to view one unmatched picture for three seconds; no character or point is awarded. Item usage carries across all three rounds. These are explicit browser practice details.
- Forty independently authored stable knowledge/short-math questions each have exactly 36 characters, including internal spacing and punctuation. There is no trailing padding. Every board uses a single vocabulary. Each three-round run contains one Chinese-character board, one Korean-consonant board and one picture board in shuffled order. Chinese characters are selected from 24 visually related forms; consonants from 19 simple/double consonants. A picture board selects exactly one of three families (open frame, open ring, arrow), then 18 out of its 24 variants: six small dot positions times four rotations. The asymmetric frame/ring gap or arrow direction makes all rotations distinguishable. Different picture families never mix in a board. Text is read row-major. NFC/NFKC text normalization, whitespace/punctuation removal and explicit answer aliases accommodate natural Korean input. No semantic guessing or online model is used for grading.

## Checks

`tests/bloody-memory.cjs` checks 720 connected ten-cell targets, exact per-cell answers, repeated number use, replacement, nonadjacent move/swap, erase, immutable history inputs and invalid edits. It also checks hundreds of single-category mission boards, exact 36-character question lengths and 18 pairs. Fake-clock controller checks cover six questions/two maps, 60/10-second memory boundaries, all edit controls, three 10/20/30-second hidden rounds, early mission answers, scoring, exact wrong-pair picture expiry, cooldowns, three-second peek expiry, single-use items, double penalties and the all-pairs-found state. Shared theme and hub tests cover integration.
