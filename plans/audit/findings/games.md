# Findings: games track (docs/game-is-the-math)

The series goes from 15 articles to 10. The "play first, then the theorem" shape is kept in every survivor. Each article was checked against its own node computation (scripts in the session scratchpad; the per-article notes appended below record what each one computed).

## Cut, merged, renumbered

| old | new |
|---|---|
| 01-nim.html | 01-nim.html |
| 02-green-hackenbush.html | 02-green-hackenbush.html |
| 03-grundy-values-and-mex.html + 04-sprague-grundy-theorem.html | 03-sprague-grundy-theorem.html |
| 05-misere-play.html | 04-misere-play.html |
| 06-blue-red-hackenbush.html | 05-blue-red-hackenbush.html |
| 07-the-surreal-numbers.html + 08-simplicity-theorem.html | 06-surreal-numbers-and-simplicity.html |
| 09-domineering.html | 07-domineering.html |
| 10-temperature-and-cooling.html + 13-go-endgames.html | 08-temperature-and-cooling.html |
| 12-hex-and-positional-games.html | 09-hex-and-positional-games.html |
| 14-dots-and-boxes.html | 10-dots-and-boxes.html |
| 11-sums-of-games.html | deleted |
| 15-loopy-games-and-beyond.html | deleted |

Salvage from the cut pages: nothing. 11's "optimal" engine collapses options to their means and rounds with ceil/floor, so it isn't CGT. 15 had only static drawings, a reading list and a theorem tile grid.

Prose words, survivors (merged pairs counted together): 36,235 before, 12,332 after, a cut of about 66%. That is deeper than the 40% asked for. Most of what went was repetition, recap openers, Takeaways, "Honesty moment" boxes, promo closers, unverifiable history, and figures and passages that turned out to be wrong. The simplicity rule is stated once, in 06. 05 uses it in one sentence and points to 06.

All page `<title>`s now read "X | The Game Is the Math", so no em dashes remain in any prose or title. A few em dashes survive in JS comments in 02.

## Flagged errors: all confirmed, all fixed

- **01, 7->6 and 5->4 from (3,5,7):** (3,5,6) and (3,4,7) have XOR 0, so both are winning moves. Of the 15 moves from (3,5,7), exactly 3 win: (2,5,7), (3,4,7) and (3,5,6). The article's "Marienbad" label for (3,5,7) is removed; the real Marienbad layout (1,3,5,7) stays in 04.
- **09 (now 07), 2x2 Domineering:** it is {1|-1} = ±1, so old 11's `*` was wrong (moot, since 11 is cut). **Fig 5:** the region really is a 4-cell column worth +2, and the "3x1" label was the error. The figure now computes every region live and checks the sum against a single search of the whole 5x8 board: both give ±1. **"8x8 value computed in the 1990s":** false. Only outcomes are known: 8x8 is a first-player win (2000), then 10x10 (2002) and 11x11 (2016).
- **10 (now 08), two-switch swing:** {6|-2}+{2|0} has stops 6 and 0 around a mean of 3, so moving first is worth t1 - t2 = 3, not 4 + 1 = 5. The page now gives the general alternating-sum rule for sums of switches. Exhaustive minimax over 40,000 random sums agrees with the rule every time.
- **13, "Theorem 11 of Berlekamp-Wolfe":** removed. The 1994 book is still cited.
- **12 (now 09):** "Hellinger-Hales-Jewett" is now the Hales-Jewett theorem (1963). The Cantor/Hermite analogy had the dates wrong and is cut. TwixT and Havannah no longer inherit a first-player win: strategy stealing only gives "first player does not lose" when draws are possible.
- **14 (now 10):**
  - The long-chain rule was reversed. The fixed rule: the first player wants dots + long chains to be even. It is derived from turns = dots + double-crosses, and an exact search of all 2,604 positions on the 3x3-box board where every box has two sides drawn agrees. Loops don't count toward the rule.
  - The long-chain threshold is now >=3.
  - The fake "Position B" is replaced by four real positions whose chains, rule verdict and exact result are all computed live. Position D shows the rule pointing the wrong way.
  - The "1982 MSRI edition" is cut. The sources are now Winning Ways (1982) and Berlekamp 2000.
  - Barker and Korf showed 4x5 boxes is a tie (AAAI 2012).

## Other errors found and fixed

- **04:**
  - The normal-play all-ones endgame is a win only when the number of 1s is odd.
  - The suggested Marienbad opening had XOR 2, and the game always made the reader move first from an XOR-0 start, so it couldn't be won. A "Computer starts" button is added.
  - A static Hackenbush figure had wrong Grundy labels and a false claim that the colon principle fails under misère play (no counterexample among 5,913 trees). The figure and the claim are removed.
- **03:**
  - The stalk "bamboo" explanation is replaced; a stalk of n edges is worth n.
  - The Sum Challenge computer made illegal moves in 132 of 4,027 reachable positions. It now makes none, and none of its moves lose.
  - Old 04's proof assumed its conclusion; it is replaced with the standard proof.
- **05:** the prose said the computer does "no search", which was wrong. The denominator bound is now 2^(n-1). A statement about Right's moves in BRRR is corrected, and a blank formula now renders.
- **06:**
  - Old 07's recursive ≤ had L and R swapped (it gave 1 ≤ 0).
  - The stalk-rule prose was wrong.
  - "Earliest birthday can tie" is false.
  - Tree B is {1|1} = 1*, which is not the number 1.
  - The day-3 table included numbers born on day 4, and BRR is 1/4, not 3/4.
- **07:** {a|a} is a+*, not an integer. 3x4 is -3/2, so the reader (Left, moving first) cannot win, and the caption says so.
- **08:** {a|b} with a < b is the simplest number between a and b, not their average. {a|a} is a+*.
- **09:** only 4 of the 16 openings on 4x4 Hex win, where the article said any opening wins. The solved sizes are corrected (8x8 in 2009; 9x9 and the 10x10 centre in 2013). Step 5 of the strategy-stealing walkthrough contradicted steps 3-4. The no-draw sketch is replaced with Gale's 1979 argument.
- **10:** the double-cross arithmetic is now 10-2, and the chain drawings are redrawn (they had capturable "short" chains and walled "long" ones).
- **01:** a figure claiming backward induction actually coloured cells by XOR. It now runs real backward induction and matches XOR on all 512 cells.
- **01:** the Bouton title-page "facsimile" is removed; it was drawn from text.
- **01:** unverified biography is cut.

## Errors rejected

None of the reviewer's flags were rejected. One refinement: for 09's Fig 5, the reviewer said the strip is +1, not "+2". The drawn region is a 4-cell column (+2), so the label was wrong, not the value.

## Computer opponents (the "optimal computer" claims)

| part | what it does | verified |
|---|---|---|
| 01, 02 | Bouton rule; takes 1 when lost | optimal |
| 03 | Sprague-Grundy on the sum | optimal after the illegal-move fix |
| 04 | Misère rule, both conventions | optimal on 7,805 positions |
| 05 | Stalk values | optimal on 3,744 cases |
| 07 | Memoized full game-tree search; first legal move when lost | optimal |
| 08 | Exhaustive search over sums of switches | optimal |
| 09 | One-move shortest-path heuristic | not optimal; captions say so |
| 10 | Heuristic, then exact search once <=20 edges remain | captions say so |

The old homepage blurb said "an optimal computer" for every game, which was false for Hex and Dots and Boxes. The new entry below avoids that.

## Figures made honest or removed

- **Made honest:**
  - 01's induction grid.
  - 03's Sum Challenge.
  - 06's comparison and addition figures, which now run Conway's recursion with a trace, and its birthday tree, which is now generated rather than hardcoded.
  - 07's Figs 3-5, which now compute via a canonical-form evaluator. New Fig 6 is a computed value table for rectangles up to 4x4.
  - 08's smart-vs-naive figure, whose two columns could never differ. It is now a playable sum against an exhaustive opponent.
  - 09's "thousands of fills", which now has a real 1,000-fill button.
  - 10's parity panel and chain drawings.
- **Removed:**
  - 01's Bouton facsimile.
  - 04's misère Hackenbush figure.
  - 06's hardcoded worked-example tree, its duplicate constructor and the Conway vignette.
  - 09's history vignette.
  - 10's fake book-cover vignette.

## Unresolved (needs a human)

- 08 keeps a one-line mention of Berlekamp's Thermostrat, which is real (Berlekamp, "The economist's view of combinatorial games", 1996) but whose exact phrasing I didn't check against the source.
- The series has no dark-mode tokens (pre-existing, series-wide).
- 07 and 08 still load lib/cgt-*.js without using them (harmless).
- 02 has some dead CSS.
- lib/test.html is untouched.

## Inbound links to deleted or renamed pages

A grep of docs/ for `game-is-the-math/` found only the homepage series entry, which points at the series index. That link is still valid, but its `count` and `desc` are stale. No other series links into individual articles.

## Homepage entry

- title: The Game Is the Math
- count: 10
- href: game-is-the-math/index.html
- desc: "Combinatorial game theory where every article starts with a game against the computer and ends with the theorem that explains it: Nim and the XOR rule, Hackenbush, Grundy values and Sprague-Grundy, misère play, surreal numbers and simplicity, Domineering, temperature, Hex and Dots and Boxes."
- tags: "Nim · Sprague-Grundy · surreal numbers · temperature · Dots and Boxes"
- thumb: cgt-tree (unchanged)

---

# Appendix: per-article notes from the rewrite

## notes-01: docs/game-is-the-math/01-nim.html

Old -> new: 01-nim.html -> 01-nim.html (no merge, nothing absorbed).
Prose words (tags/scripts/styles stripped, scratchpad/games/wc01.mjs): 2232 -> 927 (-58%).

### Errors confirmed and fixed
Checked with scratchpad/games/nim01-check.mjs. It brute-forces the win/loss status of every triple with heaps up to 7 and found 0 mismatches against the XOR rule.
- "7->6 or 5->4 from (3,5,7) lands in a lost position": wrong. XOR(3,5,6)=0 and XOR(3,4,7)=0, so both moves win. There are 15 legal moves from (3,5,7), and exactly 3 of them win: (2,5,7), (3,4,7), (3,5,6). The prose now says this and explains it with the 1s column.
- (3,5,7) was called "Marienbad": wrong. The film layout is (1,3,5,7), which has XOR 0 and is covered in Part 4 (misere). I removed every Marienbad label, the film reference, and the button id (btn-marienbad -> btn-start, "Reset to (3, 5, 7)").
- Figure 2 claimed it was computed by backward induction, but the code colored cells by XOR and printed the XOR inside every cell. That presents the theorem as data before the article derives it. The figure now runs a memoized backward induction over (a,b,c). Its hover shows either a real winning move or "all n moves reach winning positions". Playwright checked all 512 cells against XOR: they match.
- Figure 5, the "facsimile" title page, was an SVG drawn from text and captioned "rendered from the historical record". I removed the figure along with its CSS and JS.
- Bouton bio: "student of Felix Klein at Göttingen" is wrong. As far as I know he did his PhD at Leipzig in 1898 under Lie, but I couldn't verify that here, so I cut the advisor claim. I also cut "associate professor", "variants played in China for centuries" (unverified), and "closes with the remark...". Kept: Annals of Math. 2nd ser. vol 3 (1901) pp. 35-39, the title, "safe combinations", the naming of the game, and Sprague and Grundy in the 1930s.

### Computer opponent
The computer uses CGT.games.nim.optimalMove (normal play). With nonzero XOR it moves to XOR 0 (the Bouton rule), which is optimal. With XOR 0 every move loses, so it takes 1 from the first nonempty heap. That is a legal choice with no better alternative. The page no longer uses "optimal" or "perfect" wording. The Fig 1 caption describes exactly this behavior, and the Fig 4 readout now says "Winning move" instead of "Optimal move".

### Other edits
- Subtitle is now "Part 1 of 10". Nav: next -> 02-green-hackenbush.html, no prev. Removed the in-prose "Explainer 2/4" refs; one pointer to Part 3 remains (Sprague-Grundy).
- Cut: Takeaways section and bullet list, forward-promo closer, the circular-definition aside, and the c=2/c=3 lists.
- Em dashes removed from prose and JS UI strings. One remains in `<title>` ("Nim — The Game Is the Math") because every file in the series shares that pattern. The lead should decide on it series-wide.

### Verification
- render-check PASS.
- scratchpad/games/pw01.mjs (Playwright) passes with 0 console errors. It plays a bad move in Fig 1 (the computer zeroes the XOR) and plays from (1,2,3). In Fig 2 it steps and hovers ((2,4,6) is LOSING, (2,5,6) gives the winning move to (2,4,6)), checks 8 L cells per slice, and checks induction == XOR on all cells. It also steps Fig 3 to (3,5,6), which shows as losing, and uses the Fig 4 preset and add heap.

### Unresolved
- The series-wide `<title>` em dash.
- lib is unchanged and needs nothing.

## notes-02: Green Hackenbush

File: docs/game-is-the-math/02-green-hackenbush.html (old 02, same number). No merge, nothing git rm'd.

### Word count (static prose, tags/scripts/styles stripped; scratchpad/games/wc-02.js)
- before: 2199
- after: 837 (about 62% cut). Heavier than the 40% target because the removed material was mostly repetition: recap opener, three restatements of the stalk theorem, "stalks are cosplay" paragraph, XOR-readout aside, Takeaways list, forward-promo closer, and a Definition callout box whose content is now two paragraphs. Every figure and every claim of substance survives.

### Computations (scratchpad/games/check-02.js, brute-force Grundy search over all edge subsets of the actual trees)
- Fig 4 tree (root edge; left subtree edge + fork 2,3; right subtree edge + fork 1,2): brute force = 7. Matches the walkthrough (1+(2^3)=2, 1+(1^2)=4, 2^4=6, +1=7). Correct.
- Fig 3: all 25 stem+fork plants a,b in 1..5 have value 1+(a^b). Correct.
- Ground fork 2,3 = 1; 2-2 plant plus lone edge = 0 (used in new prose). Correct.
- Stalks of length n have value n (n<=8). 3^5^7 = 1 (first player wins).
- Computer opponent: gardenOptimalChop -> CGT.games.nim.optimalMove (Bouton). Checked that from every N-position with heaps <=8 it moves to XOR 0. Optimal; "optimal" claim kept.

### Errors confirmed and fixed
1. Fig 1 caption said taking k coins = "chopping the stalk at height n-k". Chop at height h leaves h-1 (stalkChop in the page), so the matching chop is height n-k+1. Rewritten as "the k-th edge from the top", both leave n-k.
2. Stalk theorem paragraph said a chop at height h "leaves a stalk of length h" (and took n-h coins to leave h). Off by one: leaves h-1. Fixed.
3. End-of-game message "That position was losing from the moment it became your turn" was false when the reader had a winning position and blundered (the 3-5-7 start is a win for the reader). Replaced with "Press Reset to try again."
4. Named (3,5,7) "Marienbad" (reviewer flagged this in 01; Marienbad is 1,3,5,7). Removed the name everywhere in 02 including move-log strings.
5. Interaction bug: the number label on each Nim coin in Fig 1 swallowed clicks (Playwright: "<text> intercepts pointer events"), so clicking the middle of a coin did nothing. Added pointer-events: none to the label.

### Rejected / unchanged
- Reviewer's "all math correct": confirmed for the colon principle and tree reduction; only the off-by-one heights above were wrong.
- "Green Hackenbush is John Conway's": kept (standard attribution, Winning Ways).

### Other edits
- Equivalence now defined without Grundy values (G = H iff G+X, H+X same winner for all X; impartial shortcut: G+H is a second-player win, shown by the mirror strategy for stalk vs heap). Grundy value only mentioned as the subject of Part 3. Colon readout and step texts no longer say "Grundy value".
- All user-visible em dashes removed (prose, captions, step labels, status strings). <title> em dash left as series convention.
- Removed aria-hidden from the XOR readout (it is real content).
- Nav: prev 01-nim.html "Part 1: Nim", next 03-sprague-grundy-theorem.html "Part 3: The Sprague-Grundy Theorem". Subtitle "Part 2 of 10".

### Figures
All four kept, all compute or show correct values: Fig 1 synced heap/stalk, Fig 2 playable garden vs Bouton, Fig 3 colon fork explorer, Fig 4 hand-drawn step walkthrough (static diagrams, values verified by brute force; it does not claim to compute).

### Verification
- render-check PASS.
- Playwright (scratchpad/games/pw-02.mjs): coin click and edge click update status; full 3-5-7 game played via hints ends "You win"; colon buttons change readout; reduction steps 0-4 advance; KaTeX renders; no console/page errors.

### Unresolved
- Dead CSS for .aside / .equivalence-box / .def-badge remains in the page's <style> (unused, harmless).

## Notes: 03-sprague-grundy-theorem.html (merge of old 03 + old 04)

### Files
- Target (rewritten): docs/game-is-the-math/03-sprague-grundy-theorem.html (was old 04)
- Absorbed and `git rm`'d: docs/game-is-the-math/03-grundy-values-and-mex.html (old 03)
- Nav: prev 02-green-hackenbush.html, next 04-misere-play.html. Subtitle "Part 3 of 10". In-prose refs: Part 1 (Bouton), Part 2 (stalk = heap, linked). No links to cut pages.

### Word counts (prose, tags/scripts/styles stripped; scratchpad/games/wc03.mjs)
- Before: old 03 = 1874, old 04 = 2788 (sum 4662)
- After: 1426 (about 49% of old 04 alone, 31% of the sum)
- Em dashes: old 04 had 18 (6 in HTML prose/captions, rest in JS strings); now 0 anywhere in the file.

### Structure now
Hook (the three-game board you will play at the end) -> mex + Grundy definition + short proof that 0 = losing -> Fig 1 game tree editor (old 03) -> Nim heap = n, take-{1,4} pile = 2, stalk = n (pointer to Part 2), subtraction {1,2,3} = n mod 4 -> theorem statement, sum and equivalence definitions, real proof (x + *g is a P-position by induction; sums via Bouton) -> one-sentence history -> winning-move recipe with a worked example -> Fig 2 Sum Challenge (old 04).

### Errors confirmed and fixed
1. Stalk explanation (flagged). Old text: "each edge has its own Grundy value equal to its height index, and the stalk is the sum by a bamboo argument". Wrong: the stalk is not a sum of its edges (XOR of 1..n is not n). Verified in node (verify03.mjs): stalk of n edges, options = stalks of 0..n-1 edges, Grundy values 0..8 = 0..8. Replaced with a one-paragraph correct statement pointing to Part 2.
2. Sum Challenge computer made ILLEGAL moves (not flagged by reviewer). In the subtraction {1,2,3} component it played `take = pile - target` instead of `take = (pile mod 4) - target`, e.g. pile 7 alone -> "take 7". Brute-force over all 4027 positions reachable from the 5 presets: original had 132 illegal computer moves; fixed version has 0 illegal and 0 suboptimal moves (every N-position -> P-position), and XOR total matches brute-force win/loss on every state. Script: scratchpad/games/verify03.mjs. So the computer is now verifiably optimal; prose says exactly what it does.
3. Old 04's induction "proof" argued "same set of option-values, therefore same strategic behavior", which assumes the conclusion. Replaced with the standard argument: x + *G(x) is a second-player win (three reply cases), then sums via Bouton (*a + *b + *(a xor b) has XOR 0).

### Checked and fine
- All five Sum Challenge presets: totals 4, 7, 3, 2, 3 (all nonzero, so the reader can win). mex examples, editor preset root values (seed 2, nim3 3, take-{1,4} from 4 = 2, shared leaves 0), subtraction {1,2,3} = n mod 4 (checked to n=12), worked example (6,3)+stalk 4+pile 10: 5^4^2 = 3, only the pile has g^T < g, after taking 1 total = 0 (verify03b.mjs).
- History kept to one sentence: Sprague 1935 Tohoku Math. J. ("Uber mathematische Kampfspiele"), Grundy 1939 Eureka ("Mathematics and games"), independent. Cut unverifiable colour: "22 and an undergraduate", "limited circulation in wartime Britain", "amateur number theorist", priority remark.

### Figures
- Kept: old 03 DAG editor (live mex, link-to-existing with cycle rejection, delete). Presets changed to Reset / Nim heap of 3 / Take 1 or 4 from 4 chips / Shared leaves; the take-{1,4} preset replaces old 03 Fig 5 (two games, same value) and the Nim-heap preset replaces old 03 Fig 4.
- Kept: old 04 Sum Challenge, fixed (above). Also: phase 2 no longer highlights/names the winning component (it gave the answer away); Hint now gives the method, not the numbers (Submit still reveals correct values on a wrong guess); "New position" cycles presets instead of random re-pick; reduced-motion skips the computer delay.
- Dropped (old 03): mex chip toggler (Fig 1; the editor info panel shows each mex), step-through propagation tree (Fig 2; duplicate of editor), Nim heap card grid (Fig 4; static), side-by-side equivalence trees (Fig 5; now an editor preset), fill-in-the-values challenge (duplicate of editor), Takeaways.
- Dropped (old 04): decorative theorem diagram (Fig 1), Nim+Nim sum-operator board (Fig 2; just Nim), static proof diagrams (Fig 3), XOR slider calculator (Fig 4; the Sum Challenge shows the same bit table live), history card (Fig 6, yellow callout), theorem box (callout), Takeaways, forward-promo closer.

### Verification
- render-check: PASS.
- Playwright (scratchpad/games/pw03.mjs): editor presets give expected root values; add leaf / add child / link (cycle rejected) / delete update values; Sum Challenge: wrong guess keeps phase 1, correct guess opens play; playing the zeroing strategy wins all 5 presets; a naive player loses to the computer. No console or page errors.

### Unresolved
- None in the shared libs. Page has no dark-mode tokens (same as the rest of the series).

## notes-04: Misère Play

File: docs/game-is-the-math/04-misere-play.html (was 05-misere-play.html). No merge; nothing absorbed.

### Word count (prose, tags/scripts/styles stripped; wc04.js)
- before: 2148
- after: 1062 (about 51% cut)

### Errors confirmed and fixed
Verification scripts: verify-04-nim.js, verify-04-hack.js, verify-04-trees.js (this dir).

1. **Normal-play all-ones endgame was wrong.** Prose and Fig 2 caption said that under normal play every all-ones position with m >= 1 is a win for the player to move, and only m = 0 loses. Brute force: normal play, the player to move wins iff m is odd (m=2 and m=4 lose). Fixed the prose and the KaTeX rule, which now states both conventions (normal: m odd wins; misère: m even wins). Fig 2 now also shows a computed "normal: winning/losing" line per cell (classifyNormal).
2. **Marienbad opening move was wrong.** Prose said the optimal first move from (1,3,5,7) brings the XOR to zero by taking 2 from the 7, leaving (1,3,5,5). In fact 1^3^5^7 = 0 (the page's own KaTeX said so), (1,3,5,5) has XOR 2, and brute force finds no losing-for-opponent move from (1,3,5,7) under misère or normal play. The first player loses. So Fig 4 as built (reader always moves first against a perfect computer) could never be won. Fixed: prose now says (1,3,5,7) is lost for whoever starts; added a "Computer starts" button so the reader can play the winning side; hint text says the position is lost against perfect play.
3. **(3,5,7) called "Marienbad's iconic opening position"** in Fig 1 intro. Marienbad is (1,3,5,7). Removed the label.
4. **Figure 5 (static Hackenbush drawing) had wrong labels.** Y-tree labeled "Grundy = 1 ⊕ 2 ⊕ 1 fused": brute-force Grundy is 4. Loop+stem labeled "fusion → Grundy 2": brute force gives 0 as drawn (base edge on the ground counts as a loop) or 1 without it. The claimed point, that the Colon Principle fails under misère on this Y-tree, is not supported: exhaustive check of all 5913 single-trunk trees up to 8 edges found every tree has the same misère outcome as the stalk with its Grundy value. Figure 5 and its CSS/JS removed. The (1,1) vs (2,2) argument (correct: both Grundy 0, misère win vs loss) carries the section; it now says the breakdown is in sums.
5. Fig 3 checker text said a fat nonzero-XOR position wins by "zeroing the XOR"; with a single big heap the winning misère move is to leave an odd number of 1s. Text now branches on bigCount.

### Verified correct (kept)
- Misère Nim theorem as stated (fat: lose iff XOR 0; thin: lose iff odd 1s; empty is a misère win for the mover): 0 mismatches over 7805 positions (up to 4 heaps of 0..7, 5 heaps of 0..4).
- Computer opponents: CGT.games.nim.optimalMove (misère and normal) always moves to a losing position whenever a winning move exists, over the same 7805 positions. The Fig 1 and Fig 4 computers are genuinely perfect; prose says so and cites the check.
- Divergence claim: over all 3-heap positions up to 7, the normal and misère computers differ only when exactly one heap has >= 2 objects. Also follows from the lib code (bigCount >= 2 branch is the normal move).
- (1,1,1) misère loss / normal win; (1,1,1,1) misère win / normal loss.
- Film: Resnais, Last Year at Marienbad (1961), rows 1,3,5,7, last match loses. Plambeck misère quotients 2005 (Integers 5, "Taming the wild"). Winning Ways chapter "Survival in the Lost World" (dropped the "Volume 2, chapter 13" specifics).

### Other edits
- Subtitle Part 4 of 10; nav prev 03-sprague-grundy-theorem.html, next 05-blue-red-hackenbush.html ("End of Act I" dropped).
- Cut: "Honesty moment" callout, "End of Act I" grand summary + forward-promo, recap-heavy intro, "plain English" paragraph inside theorem card (moved as a short proof sketch in prose). Added a 3-sentence proof sketch of the theorem.
- All user-visible em dashes removed from prose and UI strings (the <title> keeps the series-wide "X — The Game Is the Math" pattern).
- Fig 4 race fix: undo/reset during the computer's 500 ms delay could let a stale reply fire; added a generation counter.

### Verification
- render-check: PASS.
- pw-04.mjs (Playwright): Fig 1 same moves on both boards reaches divergence at (0,1,2) [normal -> (0,1,1), misère -> (0,1,0)]; Fig 2 cells correct; Fig 3 presets classify correctly; Fig 4 "Computer starts" + following hints ends "You won"; "You start" hint reports no winning move; click+immediate undo leaves (1,3,5,7) with reader to move. No console/page errors.

### Unresolved
- None in the page. (.honesty CSS removed.)
- Shared lib: no fix needed.

## notes-05: Blue-Red Hackenbush

File: docs/game-is-the-math/05-blue-red-hackenbush.html (old 06, renamed by lead). Nothing absorbed, nothing git rm'd.
Scratch: scratchpad/games/05/ (verify.js, drive.mjs, wc.js, body.html, splice.py, fixjs.py, page-math.js).

### Word count (tags/scripts/styles/head stripped)
3331 before, 1383 after (about -58%). More than the 40% target because the cut text was mostly recap,
repeated statements of the same claim, a Takeaways list, a forward-promo closer and a callout aside.
All five figures kept.

### Verification
verify.js extracts the page's own math (gameValue, simplestBetween, optimalLeft/RightMove) and
compares against two independent computations:
- recursive {L|R} with an independent simplest-number walk (surreal tree walk), and
- Berlekamp's sign-expansion rule for stalks.
Results: all 511 stalks up to 8 edges agree (0 mismatches); all 961 two-stalk sums up to 4 edges each
agree and equal the sum of the parts. BR 1/2, BRR 1/4, BRRR 1/8, BRBR 5/8, BBBRR 9/4, BBRR 5/4,
BBRRR 9/8, sums BR+BR 1, BRR+BRR 1/2, BBR+RRB 0, BBR+BRR 7/4, BR+RB 0 all confirmed.
Sign of value vs pure win/loss outcome search: 0 mismatches.

Computer optimality: for 3744 (position, mover) cases (single stalks and two-stalk sums up to 4+4
edges), whenever a plain win/loss search (no values) says the mover has a winning move, the page's
optimalRightMove / optimalLeftMove picks a winning move. 0 failures. The "optimal" label stays.

### Errors confirmed and fixed
- Prose said the computer uses "no search". False: gameValue is a memoized recursion over the whole
  game tree. Rewritten to say exactly that, plus the exhaustive check above.
- Denominator bound "depth d gives at most 2^d": true but loose. Measured max denominator for a
  stalk of n edges is 2^(n-1) (n = 1..8), which also follows from Berlekamp's rule. Stated as 2^(n-1).
- BRRR prose implied Right must chop from the top; any red chop is legal. Fixed.
- `math-H-plus-X` span had no katex render call (rendered empty in the old page). Added.
- Fig 4 status text said "a preset will start a game" after building; the build path uses the
  "Play built position" button. Fixed.
- Calculator readout for one-color stalks said "val = ceil(max L) + 1 if needed"; replaced with
  "next integer above max(L)" (correct for Hackenbush, where one-color positions are integers).
- Misleading code comment on the Left-has-no-moves branch rewritten (it is a Hackenbush-only shortcut).
- Part refs: "explainer 4/7/8/9/10/11" -> Part 3, 6, 7, 8; link to cut 11-sums-of-games removed.
  Nav: prev 04-misere-play.html, next 06-surreal-numbers-and-simplicity.html. Subtitle "Part 5 of 10".

### Simplicity rule
The full "Simplicity rule (number form)" paragraph and the Takeaways restatement are gone. One
sentence uses it for BR with a pointer to Part 6. Berlekamp's stalk rule is kept as a separate,
stalk-specific reading rule (it is not the simplicity rule).

### Removed
- "How the computer is playing" .aside callout (and its CSS); content moved into a plain paragraph.
- Takeaways list, forward-promo closer, recap opener, homomorphism/transfinite paragraph.

### Rejected / not errors
- Reviewer's value list: all correct, no change needed.

### Shared lib
Page does not use lib/cgt-math.js functions for its values (own dyadic code). No lib changes needed.
Note for lib owners: the page's one-sided branches (only-L or only-R moves) are Hackenbush shortcuts,
not general simplest-number code.

### Unresolved
- <title> still uses "Blue-Red Hackenbush — The Game Is the Math" to match the series' title pattern;
  leave to the lead if titles get a sitewide change.

### Checks
render-check PASS. drive.mjs: plays BBBRR via hints to a win, BRBR with computer first, calculator
presets and add-red, BR+BR sum played to a win, built BR+RB shows 0; all KaTeX spans rendered;
no console errors or warnings.

## notes-06: Surreal Numbers and Simplicity

### Files
- Target: docs/game-is-the-math/06-surreal-numbers-and-simplicity.html (was 08-simplicity-theorem.html). Rewritten as one article, new title/h1 "Surreal Numbers and Simplicity".
- Absorbed and `git rm`ed: docs/game-is-the-math/07-the-surreal-numbers.html.
- Nav: prev 05-blue-red-hackenbush.html, next 07-domineering.html. In-prose pointers: Part 2 (green edge = *), Part 8 (switches/temperature). No links to cut pages.
- Pre-merge copy of old 08: scratchpad/games/old08-original.html (old 07 is in git history).
- Dropped unused script includes lib/cgt-math.js and lib/cgt-games.js (the page never called them). The libs themselves are untouched.

### Word counts (prose, tags/scripts/styles stripped; scratchpad/games/wc06.py)
- Before: old 08 = 2435, old 07 = 3184, combined 5619.
- After: 1579 (72% cut from the combined text, about 35% under old 08 alone).

### Errors confirmed and fixed (verify06.js, all checks pass)
1. **Recursive order definition was wrong (old 07).** It gave `x <= y iff no x_R <= y and no y_L >= x`, which has L and R swapped. Implementing it literally gave `1 <= 0 = true` and failed 277 checks against numeric order. The correct rule, `x <= y iff no x^L >= y and no y^R <= x`, agrees with numeric order on all 225 pairs of numbers born by day 3.
2. **Wrong Berlekamp stalk rule (old 08 prose).** It said "each edge of the opposite color halves the increment and flips its sign". The correct rule: the first run of one color counts +-1 per edge; after the first color change, every edge counts half the edge below it, with the sign set by its own color. Checked against the recursive simplicity computation on all 2047 stalks with up to 10 edges. For example, BRR = 1/4, but the old wording would not halve on the second red. The page's code already used the correct rule; only the prose was wrong.
3. **"If more than one number shares the earliest birthday..." (old 08).** Wrong: the simplest number in an open interval is always unique. Brute force over 8001 intervals with endpoints born by day 6 found exactly one earliest-born number every time. The statement now says so. The brief's wording (the integer of least absolute value if one fits, otherwise the unique dyadic with the smallest denominator) was checked on the same 8001 intervals, plus the one-sided cases.
4. **Old 08 Fig 1 Tree B: {0,1 | 1,2} was called "value 1" because both stops are 1.** Wrong: this is {1|1} = 1*, which is not a number. Recursive <= gives `G <= 1` false and `1 <= G` false. I removed the stops figure. Stops belong to Part 8 (temperature), which has its own stops figure.
5. **Old 07 birthday table and chart.** The table listed -5/2 and 5/2 under day 3 (both are born on day 4), and the sketched day-3 dots included ±5/4 and ±7/4 (both day 4). The new Fig 1 generates days 0 to 4 from the gap rule and draws no hardcoded dots. The birthday formula floor(|x|)+1+k was checked on every number born by day 8.
6. **Old 07 "Why this matters" claimed that "blue, red, red" has value 3/4.** BRR = 1/4 (3/4 is BRB). That section was cut.

### Figures
- Kept, made real: **Fig 3, order and addition, unfolded** (replaces old 07's comparison and addition figures, which "trusted the arithmetic"). `<=` runs Conway's recursion on canonical game trees and prints the full indented trace with short-circuiting. `+` builds {x^L+y, x+y^L | x^R+y, x+y^R} with each option computed by recursive sums. The simplicity rule names the bracket, then recursive <= checks that the bracket and the named number are each <= the other. Fraction addition appears only as a cross-check. Verified: all 225 pairs agree.
- **Fig 1, birthday tree** (from old 07). Rebuilt: generated by the gap rule, days 0 to 4, evenly spaced by rank. Each number hangs from its later-born canonical option. Click or hover shows the {x^L | x^R} form, computed.
- **Fig 2, number line** (old 08). Kept. Now uses the shared `simplest()`, with a clearer trace.
- **Fig 4, calculator** (old 08). Kept. Added presets {1|1} and {-1,0|}, and handles empty sides via +-infinity.
- **Fig 5, two-method stalk check** (old 08). Kept. Added "+ blue", "+ red" and "remove top" buttons and click-to-flip on edges, up to 8 edges. It now traces every prefix.
- Removed: old 08 Fig 1 (stops; misleading, see error 4, and Part 8's material). Old 08 Fig 4 (worked 3/4 tree; its node values were hardcoded per step, `valuesAtStep`, not computed; BRB = {0, 1/2 | 1} = 3/4 in prose and Fig 5 covers the same ground). Old 07 Fig 2 (constructor; duplicated the calculator). Old 07 Fig 5 (Conway title-page facsimile vignette; padded history).
- History cut to one sentence: Go endgames origin; Knuth's *Surreal Numbers* (1974) introduced the construction and the name; Conway's *On Numbers and Games* (1976). I dropped the unverified detail (the 1972 Cambridge visit, "a week in a hotel in Norway", the OUP/A K Peters print history).

### Verification
- `render-check`: PASS.
- Playwright (scratchpad/games/pw06.mjs): all figures driven (clicking dots, chips, op toggle, presets, add/remove, edge flip). Expected values asserted, console clean, no horizontal scroll at 390px. That last check needed `overflow-x: auto` on display math. ALL PASS.
- Math: scratchpad/games/verify06.js against scratchpad/games/core06.js (the same functions embedded in the page, apart from display strings). ALL OK.

### Unresolved / for the lead
- Part 5 (05-blue-red-hackenbush.html) has its own `simplestBetween` and, per its comment, "prefer integers, then halves...". I didn't audit it (not my file). Its prose already points to Part 6 for the rule.
- Part 2 is cited as "the single green edge from Part 2, written *"; the notation is introduced here, so it does not depend on Part 2 using it.

## notes-07: Domineering (old 09-domineering.html -> 07-domineering.html)

Scratch scripts: scratchpad/games/07/ (cgt.js = node canonical-form evaluator, verify.js, five.js, drive.mjs, wc.js).

### Word count
Before 2694, after 1047 (tags/scripts/styles stripped; includes figure captions and table labels). About 61% cut, more than the 40% target. All six figures stay (one of them new).

### Evaluator
cgt.js computes canonical forms of short games: recursive {L|R}, removes dominated options, bypasses reversible options, interns forms, detects numbers with the simplest-dyadic rule, and computes stops and outcomes. Sanity checks: {0|}=1, {0|1}=1/2, {0|0}=*, *+*=0, 1/2+1/2=1, {0|*}=up.
Domineering results (rows x cols, Left vertical as in Winning Ways):
m x 1 = floor(m/2); 1 x n = -floor(n/2); 2x2 = {1|-1}; 3x3 = {1|-1}; 2x3 = {2|-1/2}; 3x2 = {1/2|-2}; 2x4 = {{2|0}|0}; 4x2 = {0|{0|-2}}; 3x4 = -3/2; 4x3 = 3/2; 2x5 = 1/2; 3x5 = -1; 4x5 = 1; 5x4 = -1; 4x4 = {G,0|0,-G} with G = {{2|0},{2|{2|0}} | {{2|0}|0},{2|0}}, stops 0/0, outcome N; 5x5 = 0 (P, matches Wikipedia; took 18s).
The same evaluator (ES5 port) now runs in the page and drives Figs 3, 4, 5 and 6.

### Errors confirmed and fixed
1. 2x2 = {1|-1}: confirmed. (Old 11's claim that it equals * is wrong. Old 11 is cut.)
2. Fig 5. The drawn board really had a 4-cell column (+2), but the card label said "vertical 3x1 strip". A 3x1 strip is +1, and with it the total would be {0|-2}, not the switch. Fixed the label to 4x1. The values are now computed live, and the figure also evaluates the whole 5x8 board in one search and checks that it matches the sum ({1|-1}). Orientation: Left is vertical, as in Winning Ways and Wikipedia.
3. "8x8 value computed by Berlekamp and others in the 1990s": wrong. Wikipedia: Breuker, Uiterwijk and van den Herik solved the 8x8 outcome in 2000 (first-player win). 9x9 followed soon after, Bullock solved 10x10 in 2002, and Uiterwijk solved 11x11 in 2016. The prose now says only outcomes are known and the 8x8 value has never been computed.
4. "n x n unsolved for n > 9": wrong, since 10x10 and 11x11 are solved. Removed.
5. Hot/cold paragraph: "L = R is itself an integer" is wrong ({a|a} = a+*, not a number). Rewritten as three cases for number options a and b.
6. Fig 2 caption: "3x4 is harder" was misleading. 3x4 = -3/2, a Right win whoever starts, so the Left player cannot win. The caption now says so. The claim "4x4 and 3x3 are first-player wins" is confirmed (N).
7. Claim that Berlekamp computed 2 x n for n <= 30: I couldn't verify it, so I cut it. Also cut the claims that the game was "marketed as Stop-Gate/..." and that thermography was developed by "Conway, Berlekamp and Hanner" (that paragraph was removed).
Kept after checking: Andersson invented the game around 1973 and Gardner published it in Scientific American in 1974 as Crosscram (sources: arXiv math/0006066, IMA). Each player has 6 moves on an empty 3x3 board. The temperature of {1|-1} is 1.

### Computer opponent
winsToMove is a memoized exhaustive negamax over the full tree (3x3, 3x4, 4x4), so it is optimal for win/loss. When it is losing it plays its first legal move (the old comment claiming it "maximizes opponent move count" was false and is fixed). The caption describes this accurately.

### Figures
- Fig 3: the hardcoded floor(k/2) values are replaced by the evaluator. The readouts show the real canonical form, e.g. {1|}=2.
- Fig 4: the value is recomputed from the board after each move.
- Fig 5: computed; the sum is checked against the whole-board search.
- Fig 6 (new): canonical values of empty 1..4 x 1..4 rectangles, computed on load, with hot and infinitesimal cells marked. It replaces the "values are wildly irregular" claim, which had no support.
- Removed: the history aside (callout box), the Takeaways list, and the forward-promo closer. The simplicity rule is now a one-line pointer to Part 6. Nav: prev 06-surreal-numbers-and-simplicity.html, next 08-temperature-and-cooling.html.

### Verification
- drive.mjs (Playwright) plays 3x3 as Left, switches to 3x4, steps the Fig 3 steppers, clicks the Fig 4 buttons, and reads Figs 5 and 6. The display changes as expected and there are no page errors.
- render-check: PASS on one run. Other runs failed only on ERR_CONNECTION_RESET/SOCKET_NOT_CONNECTED/404 from the shared, overloaded :8805 server (for lib files that are served fine on retry).

### Unresolved
- The <title> still uses an em dash ("Domineering — The Game Is the Math"). I left it to match the series.
- The page still loads lib/cgt-math.js and cgt-games.js but doesn't use them. It's harmless, and I didn't remove them to stay consistent.

## notes-08: Temperature and Cooling

### Files
- Target: docs/game-is-the-math/08-temperature-and-cooling.html (old 10). Rewritten; absorbs old 13.
- Source: docs/game-is-the-math/13-go-endgames.html, removed with `git rm`.
- Nav: prev 07-domineering.html, next 09-hex-and-positional-games.html. In-prose links go to Part 6 (simplicity rule, one-line pointer) and Part 7 (the 2x2 board = {1|-1}). No links to cut pages. Subtitle says "Part 8 of 10".
- Scratch work: scratchpad/games/08/ (switches.mjs evaluator, body.html/script-*.js/extra.css + assemble.mjs build the page from orig-08.html, drive.mjs Playwright run, wc.mjs word count, katexcheck.mjs).

### Word counts (prose, tags/scripts/styles stripped)
- Before: old 10 = 3114, old 13 = 3306 (6420 combined).
- After: 1448. That is 47% of old 10 alone, or 23% of the combined total. Em dashes in prose: 0 (only the `<title>`, which matches the sibling pages).

### Errors confirmed and fixed (computed with scratchpad/games/08/switches.mjs, exhaustive minimax over sums of switches)
1. Old 10 said "total swing = sum of temperatures 4+1 = 5 to whoever moves first" for {6|-2}+{2|0}. Minimax: Left stop 6, Right stop 0, mean 3. Moving first is worth 3 = 4 - 1 relative to the mean. General rule, checked on 40,000 random sums of up to 5 hot switches (0 mismatches between exhaustive search, the formula and hottest-first play): stops = sum of means ± (t1 - t2 + t3 - ...). The prose now says this and shows the formula.
2. Old 10's Fig 4 "smart vs naive" was fake. With two switches the naive track always fell back to the same move as smart, so the two scores could never differ, but the caption said "smart play reliably outperforms naive play". Replaced it with a new sum-of-switches figure: Right plays exhaustive minimax, a live "best total from here" shows the exact value, the log reports what each of the reader's moves cost, and the opening line prints the exhaustive stops next to the formula. Presets: {6|-2}+{2|0}, the three Go fights from old 13, and four switches. Left or Right can move first.
3. For a < b, old Figs 1-3 reported the mean as (a+b)/2 and put the thermograph mast there. {a|b} with a < b is the simplest number between a and b (for example {1|4} = 2, not 2.5). Fixed in Fig 1 and the thermograph (simplestBetween).
4. Old 10 said {a|a} "is just that number". It is a+* (stops a, temperature 0). Fixed in Fig 1, the thermograph and the prose.
5. Old 13's "Theorem 11 of Berlekamp and Wolfe" plus "the proof is in Explainer 10": I couldn't verify it and it is probably invented. Removed. The book citation stays: Berlekamp & Wolfe, Mathematical Go: Chilling Gets the Last Point, A K Peters 1994.
6. "Play the hottest" was described as correct in general or "approximately correct". The page now says it is optimal for sums of switches (checked above, and it follows by induction) and only a heuristic for general sums. It mentions Berlekamp's Thermostrat as a refinement with loss bounds. I am fairly but not fully sure of that attribution (Games of No Chance, 1996). Cut it if the lead wants zero risk.

### Checked and kept
- Thermograph (now Fig 2): it computes the real thermograph of a switch, with walls a-t and b+t meeting at ((a+b)/2, (a-b)/2). I added a tax slider t that marks the cooled game's stops on a dashed line, and a readout of {a-t | b+t} or "frozen". The caption notes that the literature flips the value axis.
- Old 13's three fights {2|-2}, {1|-1}, {1|0}: hottest-first gives +2 and opening in C gives 0. Both verified. The formula gives 1/2 + (2 - 1 + 1/2) = 2.
- Berlekamp dates 1940-2019 are correct, but the vignette was cut. Cooling and thermographs: credited to Conway's ONAG (1976) and Winning Ways (1982).

### Cut from the sources
- Old 10: Fig 2, the stops calculator (a duplicate of Fig 1; its readout moved into Fig 1). Fig 5, the Berlekamp vignette with a decorative "depiction" SVG. The Takeaways list, the scope-note callout, the insight box and the forward promos.
- Old 13: the 9x9 board (Fig 1). Its fight values ("two empty points between walls = {2|-2}") are not sound Go scoring, so the page now calls the fights idealised. Also cut: the per-fight decomposition cards (Fig 2, the same arithmetic as old 10), the Fig 3 play-out (replaced by the new exhaustive sum figure using its values as a preset), the Fig 4 history vignette with its fake "title page rendered from text", the further-reading list, the honesty aside, the Takeaways and the "not claiming" lists. Unverifiable claims were dropped: that Berlekamp's algorithm beat 9-dan pros, and "the Berlekamp school in the early 1990s".
- Kept from old 13, briefly: decomposition into independent regions, the idealised three-fight example, miai versus deiri counting (miai = half the swing = the temperature of a switch), chilling as "essentially cooling by one point", and the limits (independence, ko is loopy, modern engines don't use CGT).

### Old 11 (sums-of-games, being cut): nothing salvaged
- Fig 3/4's "optimal" Domineering engine (Dom.valueOf) collapses options to their means and picks the "simplest number" with ceil/floor, which confirms the reviewer's point. It is not CGT and there was nothing to reuse. Figs 1-2 are recaps (Nim XOR, a sum of single-colour stalks). The new sum-of-switches figure here covers what 11's hot-sum section was trying to show, with exact search.

### Verification
- render-check: PASS. Earlier FAILs came from the shared single-threaded server resetting font requests (ERR_CONNECTION_RESET) and KaTeX's .woff/.ttf fallbacks returning 404. Both are environmental and the same on 07.
- drive.mjs (Playwright) runs: Fig 1 sliders ({6|-2}, {1|4} -> 2, {3|3} -> 3+*), thermograph tax slider and presets, and Fig 3 in three scenarios. Cool-first shows "cost 6", final 0. The Go preset played hottest-first ends at +2. Four switches with Right first gives stops +7/+1, matching the formula. A reset during the computer's move is guarded by a generation token. No console or page errors. 0 KaTeX errors. No horizontal scroll at 390px (display math now scrolls inside `.katex-display`).

### Unresolved
- The page still loads lib/cgt-math.js and lib/cgt-games.js, although it uses neither. Harmless; I left the includes to match the siblings.

## notes-09: Hex and Positional Games

File: docs/game-is-the-math/09-hex-and-positional-games.html (was 12-hex-and-positional-games.html). No merge.

### Word count (prose, tags/scripts/styles stripped; scratch/wc09.js)
- before: 3761
- after: 1338 (-64%)

### Errors confirmed and fixed
1. "Hellinger-Hales-Jewett theorem": no such theorem. Replaced with the real Hales-Jewett theorem (1963) and its actual game consequence: k-in-a-row on a high-dimensional k^d cube cannot draw, so strategy stealing gives a (non-constructive) first-player win.
2. Cantor/Hermite transcendental analogy: wrong chronology (Liouville 1844/1851 explicit transcendentals; Hermite e 1873; Cantor 1874/1891). Cut the whole analogy list.
3. TwixT/Havannah "inherit first-player win": wrong, both can draw. Rewrote: strategy stealing in any positional game proves only "first player does not lose"; a win needs no-draw (Hex, Y). Havannah named as drawable; TwixT dropped (its positional-game status is murky).
4. "The first player can play anywhere and still win": false. scratch/solve09.js exhaustively solves 2x2..4x4 with the page's adjacency: on 4x4 only the 4 short-diagonal openings win, 12 lose. Now stated in prose.
5. Swap-rule paragraph claimed "sizes up to 9 solved as of early 2020s", "no cell is exactly balanced" (trivially true, no draws), "centre first to be banned", "long-diagonal cells weakest enough". Replaced with verified facts: 8x8 all openings 2009 (Henderson/Arneson/Hayward, IJCAI 2009), 9x9 all openings + 10x10 centre by Pawlewicz & Hayward (CG 2013). Source: webdocs.cs.ualberta.ca/~hayward/hex/, hexwiki Small boards.
6. Figure 3 step 5 board contradicted steps 3-4 (cell (2,1) Red then Blue; stones vanished). Step 5 now extends step 4's board to a real Blue chain (0,2)-(1,2)-(2,2)-(3,2). Step texts rewritten; contradiction stated correctly (Blue's stolen strategy vs Red following S).
7. No-draw proof sketch was hand-wavy ("boundary curve... cells along the arc are Red"). Replaced with Gale's (1979) boundary-path argument (degree-3 vertices, path from a corner exits at a corner).
8. Figure 2 caption "We have run thousands of random fills" (unbacked). Added a real "1,000 fills" button; counter now counts fills with NOT exactly one winner (checks both colours; previously only "no winner"). scratch/nodraw09.js: all fills of 2x2, 3x3, 4x4 and 100k random 7x7 have exactly one winner; 118/512 3x3 square-grid (4-adjacency) fills have no winner (stated in prose).

### History cut or kept
- Kept (confident): Hein, Politiken, Dec 1942, "Polygon"; Nash independently at Princeton c. 1948, strategy-stealing proof his; Parker Brothers "Hex" 1952; Gardner SciAm July 1957; Gale 1979 Hex <=> Brouwer.
- Cut: Hein "conjectured no-draw/first-player win" and "sketch of planarity argument" (unverified); washroom-floor anecdote (folklore); vignette card (Figure 4) incl. "schematic style of diagrams Nash sketched" (invented), RAND memo citation, Nobel aside, Go/miai forward-promo to cut article 13.
- Theorem labels "Hein c.1942; Nash 1948" on no-draw and "Nash, 1949" dates removed; kept "(Nash)".

### Computer opponent
Not claimed optimal. Code: one-ply heuristic scoring each empty cell by 10*(own shortest-path reduction) + 6*(opponent path increase) + centre bonus + tiny random tiebreak. Caption now describes exactly that and says it does not know bridges. Removed "it will beat you the first few games" and "discovers bridges by accident".

### Removed
Recap/promo text, Takeaways list, Figure 4 vignette (HTML, CSS, JS), refs to cut 11/13, Nim (3,5,7) reference, unused KaTeX ids.

### Nav
prev 08-temperature-and-cooling.html, next 10-dots-and-boxes.html; subtitle "Part 9 of 10".

### Verification
- render-check PASS (first run had a transient ERR_SOCKET_NOT_CONNECTED/404 that did not reproduce; Playwright logged zero failed requests).
- scratch/pw09.mjs: Fig 1 vs-computer (3 clicks, computer replies logged), Fig 2 single fill + 1,000 fills + clear, Fig 3 stepped to 5/5 with chain highlighted; no console/page errors; 15 KaTeX spans.

### Unresolved
- <title> keeps an em dash ("Hex and Positional Games — The Game Is the Math"), matching the series; lead may normalize.

## notes-10: Dots and Boxes

File: docs/game-is-the-math/10-dots-and-boxes.html (old 14-dots-and-boxes.html). No merge. Not committed.
Scratch scripts: scratchpad/games/db10/ (lib.js solver + chain decomposition, check.js, dc.js, pw.mjs, pw-time.mjs, shot.mjs; orig-10.html = pre-edit copy).

### Word count (prose, tags/scripts/styles stripped)
3169 -> 1285 (-59%). The cut is deeper than 40% because the removed material was mostly wrong (parity derivation, vignette, honesty box, Takeaways, forward promo to cut Part 15). The one remaining em dash is the shared `<title>` convention.

### Errors confirmed and fixed
1. **Long chain rule reversed.** Derived: every turn but the last ends on a non-completing move, so turns = E - (B - D) + 1 = dots + D (Euler: E - B = dots - 1). Checked in node on 10,000 random games over 1x1..5x5 boxes (check.js): identity holds every time. Controller plays the last turn, so first player wants dots + D odd; with D = (long chains - 1) + 2*loops, first player wants dots + long chains EVEN, loops don't count. Exhaustive exact search of all 2,604 positions on the 3x3-box board where every box has 2 sides drawn: 0 long chains -> first wins 68/68; 2 -> first wins 1108/1108; 3 -> second wins 32/32; 1 -> second wins 1316/1396 (the 80 exceptions all contain a loop). Old prose said 16 dots -> first wants odd (wrong). Old code used (m+n) parity: right for 3x3 by coincidence, wrong for 4x4 boxes (25 dots). Fixed in prose, bot (`chainTargetParity` now uses dot count), and the figure.
2. **Long-chain threshold 4 -> 3.** Fixed in code (bot) and prose. Also replaced the wrong "profitability" justification with the correct one (a 2-chain can be opened in the middle, which leaves no handout; a 3+ chain can't be).
3. **Position B "three long chains of length >= 4 on 9 boxes".** The old figure was a hand-coded 4x4-box sketch captioned as 3x3, with verdicts hardcoded and backwards. Replaced with Figure 4: four real frozen positions on the 4x4-dot board (masks from the enumeration). Chains, loops, player to move, rule verdict and an exact game-tree result are all computed live. A: chains 6,3 -> first wins 7-2. B: three 3-chains -> second wins 5-4. C: 6-loop + 3-chain -> second wins 6-3 (shows loops don't count). D: 4-loop + 3-chain + 2-chain -> rule says second gets control, but first wins 5-4 (control not worth the cost).
4. **"1982 MSRI edition"**: cut. Now cites Winning Ways (1982) chapter and Berlekamp, The Dots and Boxes Game: Sophisticated Child's Play (A K Peters, 2000). Removed the fake book-cover SVG vignette, the page counts, the Berkeley tournament and "forty years" claims (unverified).
5. **"Barker-Korf solved 5x5 in 2002, draw"**: wrong. Checked the AAAI 2012 paper listing: 4x5 boxes, tie, largest solved at the time. Fixed. Also cut "4x4 solved in the 1990s" and "1889 puzzle book used 6x6" (unverified).
6. **Double-cross figure arithmetic and geometry.** Old readout: "+6 to you, +4 to them" (3+5=8 anyway) and the handout was drawn as an interior edge with the chain's far end closed (a closed end would make the end box already 3-sided). Now the chain is open at both ends and the handout is the far-end edge; scores computed from the chain lengths: take-all 5-7, all-but-two 10-2. Verified with the exact solver on a real 2x6-box position holding a 5-chain and a 7-chain (dc.js): +8 for the taker.
7. **Computer opponent.** Old article claimed the chain-aware bot double-crosses; its code comment said it never does. It now runs an exact memoised search when <= 20 edges remain (on 3x3 boxes: from its third move), so late-game play, double-crosses included, is optimal; earlier it is a described heuristic. Caption says exactly that. Search at 20 free edges: ~140 ms in Chromium.
8. Figure 2 chain drawings were wrong (the "short" boxes had 3 sides drawn = capturable; the "long" chain had all internal walls drawn = not a chain). Redrawn: runs with top/bottom drawn, all verticals open; 3 cards (short, long, loop).

### Errors rejected
None of the reviewer's flags were rejected. Note the reviewer's "9 boxes" reading of Position B came from the caption; the drawing itself was 16 boxes, but the figure was fake either way.

### Structure / nav
Header "Part 10 of 10". Footer: prev 09-hex-and-positional-games.html, next -> index.html (series index). No links to cut pages. Removed Takeaways, honesty box, forward promo, grand summary, the vignette figure, and unused CSS (.insight, .honesty, .vignette, .parity-formula).

### Verification
- render-check PASS.
- pw.mjs (Playwright, real mouse clicks): Fig 4 all four presets produce the expected readouts; Fig 3 toggles between 5-7 and 10-2; Fig 1 full games played to completion on 3x3/4x4/5x5 vs chain-aware and greedy; no console or page errors.

### Unresolved
- Page has no dark-mode tokens (pre-existing, series-wide).
- SVG fills use var(--x) in presentation attributes (pre-existing pattern, not through a scale).
