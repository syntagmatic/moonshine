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

## What to leave alone

Plain declarative sentences, figure instructions ("Drag alignment to zero
and..."), careful hedges, captions that describe the figure. It is a light
touch, roughly 5 to 20 edits a page, and the page should not get longer.
Subtitles become plain descriptions.

## Rules for the sweep

- Change wording only. No number, claim, citation, figure code, control, id
  or live-value span changes. Check this by diffing the numbers in removed
  and added lines per page.
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
| emergence | yes | 957da31 |
| modular-forms | yes | |
| algorithms-ml | yes | |
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
