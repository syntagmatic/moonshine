# Prose sweep

A short-term cleanup, not a house rule. Delete this file when every series is
done.

Much of the gallery's prose performs instead of explaining. The facts can be
fine and the page still reads like it is selling something: slogan headings,
"This essay decides with one number", particles that "cannot settle" things,
paragraphs that end on a punchline. I want every series to read like a clear
expert explaining a figure to a smart colleague: plain, specific, calm.
Emergence was swept first (957da31) and is the reference;
`git show 957da31 -- docs/emergence/02-flocking.html` is a good example of
the register and the size of the change.

## What to hunt for

1. **The "X, not Y" reveal.** "Each starling reacts to a handful of nearby
   birds, not to the flock as a whole." Keep a contrast only when it heads off
   a real misreading, and state it flatly.
2. **Talking about the page.** "This essay...", "this page decides", "every
   number below is measured live", "Watch what happens".
3. **Slogan headings.** Numeric parallelism ("Three rules, one number"),
   imperatives ("Strip it down"), clipped reveals ("A transition, measured"),
   riddles ("Who wins, and how often nobody does"). A heading says what the
   section covers: "Boids", "The Vicsek model", "String stability".
4. **Personification and punchlines.** Numbers, models or particles that
   "cannot settle", "refuse", "decide", "know" or "win". Closing sentences that
   restate the paragraph as a zinger ("motion alone joins the islands into one
   flock", "a spiral can kill").
5. **Dramatic setups and fragments.** "Here is the surprise", "The answer is
   striking", "It turns out", one-line paragraphs built for effect.
6. **Cute or breathless words.** "strangers", "creeps", "parks", "chops",
   "a toss-up", "magic", "beautiful", "stunning", "simply", "just".
7. **Explanation the reader doesn't need yet, or at all.** Definitions,
   formulas and asides placed before the reader has seen anything to attach
   them to. Flocking opened with the polarization formula and a 1/√N
   estimate before the first figure; now φ is defined in one plain sentence
   where its readout first appears, the 1/√N level sits beside the dashed
   line it explains, and the formula is gone. Ask of each technical passage:
   does the next figure or paragraph need it? If later, move it there. If
   never, cut it. If it's true and interesting but off the argument, cut it
   anyway. Intros should get to the first figure quickly. This is about
   order and relevance, not dumbing down: technical detail the argument
   actually uses stays, at the point it's used.

## What to leave alone

Plain declarative sentences, figure instructions ("Drag alignment to zero
and..."), careful hedges, captions that describe the figure. It is a light
touch, roughly 5 to 20 edits a page, and the page should not get longer.
Subtitles become plain descriptions.

## Rules for the sweep

- For patterns 1 to 6, change wording only. For pattern 7, moving or cutting
  passages is fine, but no number or claim that stays may change, and no
  figure code, control or citation changes. Check by diffing the numbers in
  removed and added lines per page; every difference should be a deliberate
  cut.
- A live-value span (`<span class="live" id=...>`) is written by the page's
  script. If you move one, keep its id and keep it unique; if you cut one,
  remove the line of script that writes it too.
- Rewording can quietly strengthen or weaken a claim ("can be mapped onto"
  becoming "maps exactly onto"). Watch for that, and on a fact-checked series
  check any touched claim against its `LEDGER.md`.
- On a series without a ledger, don't fix facts during the sweep. Note
  anything that looks wrong for that series' fact-check instead.
- Keep renamed headings in sync with anything that references them (in-page
  TOC, index cards, aria labels), and update the series `PROMPT.md` if it
  quotes changed text.
- No em dashes. Every touched page passes
  `node ~/.claude/scripts/render-check.mjs <file>`.
- One commit per series, "<Series>: plainer prose".

## Running it

Four agents per series (three or four pages each) worked well for Emergence
and took about two minutes. Each gets this file plus its page list, edits
only its pages, and doesn't commit; the main session reviews the diff, spot
checks flagged sentences, runs the checks and commits.

Order: fact-checked series first, since word-only edits are safest there.

| Series | Ledger | Swept |
|---|---|---|
| emergence | yes | 957da31 (patterns 1-6; pattern 7 done only in 02) |
| modular-forms | yes | 1b3a110 |
| algorithms-ml | yes | 44f6da9 |
| japan-earthquakes | yes (bilingual: list every changed English paragraph for a translator) | |
| noether | | |
| parallel-coordinates | | |
| mathematical-diagrams | | |
| game-is-the-math | | |
| exceptional-atlas | | |
| bioinformatics | | |
| cohomology | | |
| decision-trees | | |
| lattice-simulation | | |
| lithium-ion | | |
| grateful-dead | | |
| quasicrystals | | |
| foam | | |
| sph | (Ian's series; ask before touching) | |

## Notes for fact-checks (found during the sweep, not fixed)

- modular-forms 10: "Fourier coefficients of a cusp form ... are point
  counts" (a_p = p + 1 - #E(F_p) determines the count; it isn't the count).
- modular-forms 11: "c(0) = 744 is a convention" (744 is forced once j is
  normalised by 1728; the choice is j versus J).
- modular-forms 08 subtitle: "Hecke eigenforms have multiplicative
  coefficients" lacks the a(1) = 1 normalisation the body has.
- modular-forms 07: "tau(n) grows roughly as n^(11/2)" follows an upper
  bound, so it says more than the bound shows.
- modular-forms 03: "Finite area is what makes spaces of modular forms
  finite-dimensional" is a strong causal claim; check the ledger covers it.
