# Balance, pattern and relay practice

These games use independently generated problems and the shared BRAIN ARENA interface. No video frames or third-party artwork are bundled.

## Source and rule checks

- **Balance scale:** [tvN D ENT / Diggle's Cooperative Hold'em clip](https://www.dailymotion.com/video/x7lhap7) identifies the original match. The [episode's rule record](https://www.namu.moe/w/더%20지니어스:그랜드%20파이널/10화) describes using a specified number of counters to balance two sides; each numbered position gives the contribution of one counter there. The browser practice permits stacking counters and accepts every allocation meeting the stated number and equality. Distances are decorative and are not multiplied into the numbered contributions.
- **Same Pattern:** [season 1 final rule record](https://www.namu.moe/w/대학전쟁/5회전), original name `숨은 패턴 찾기`: a 10-column, 8-row arrow board; a 2×2 target; rotations permitted, reflections excluded; answer by upper-left coordinate; correct +1, incorrect/duplicate −1; a valid end declaration +3, an early end −2. Six targets use two boards, replaced before round four. Rotation changes both arrow directions and positions.
- **Time Shift and Pixel Art:** [season 3 relay rule record](https://www.namu.moe/w/대학전쟁3/3회전). Time Shift consumes the supplied numbers once to complete a statement. Pixel Art chooses three of nine 3×3 colored pictures, permits rotation and excludes reflection. Its mixing footnote specifically excludes a 2:1 overlap of two different colors. This implementation accepts repeated identical colors, equal-count combinations of different primary colors, and three distinct primaries as black. It rejects red+red+yellow rather than treating it as orange. A separate third-party implementation found in research contradicts that footnote and was not used as a coding source.
- **Block Count:** [season 1 relay rule record](https://www.namu.moe/w/대학전쟁/4회전) identifies counting all cubes in the depicted stack. The new problems use solid columns and a monotone staircase, making every column's top visible. Hidden support cubes are included; empty hidden columns and floating cubes are not generated.

## Browser practice choices

The five games are solo practice. Free practice has no deadline. Challenge mode uses a clearly labeled two-minute limit per problem or pattern round; this is a browser practice setting, not a claim about the broadcast's timing or team rules. Incorrect submissions have a ten-second retry delay. Scale, Time Shift, Pixel Art and Block Count each progress through five difficulty levels. Clear advances, forfeit reveals a valid answer and retains the difficulty for the next fresh problem. Pattern uses six rounds and end-declaration scoring; the original alternating-team turns are omitted.

Time Shift's generated statement families use a 24-hour clock with minute carry, midnight rollovers, before/after offsets and two successive moves. These are new practice sentences, not transcriptions of broadcast questions. All valid arrangements are accepted, including alternatives to the generation witness. Pixel Art likewise validates the actual chosen cards and rotations instead of requiring a fixed card-index witness.

## Verification

`tests/arena-puzzles.cjs` checks generated balance solutions, card consumption and clock rollovers, independently computed pixel rotations and strict color ratios, solid stack layers and SVG cube counts, and independent geometric matching of arrow rotations. Controller checks cover five-stage completion, same-level retries, deadline and cooldown boundaries, card return, duplicate pattern answers, early end penalties and the six-round board replacement.

`tests/arena-theme.cjs` checks the hub and every catalog game for the shared final stylesheet and consistent folder navigation. Existing Genius tests additionally check that random A–P labels remain fixed throughout a board's memorization, hidden-answer and review phases, and that solution coordinates use the same labels.
