# Plans

One directory per live series in `docs/`, each holding a `PROMPT.md`. A prompt
describes its series as it stands now, closely enough that a capable model
with deep research and the `/shine` skill could rebuild it in one pass: the
arc, the big idea of each article, the signature interactive, and the traps
specific to that subject. It leaves the math, the history and the
implementation to that model's own research.

When a series changes (an article is added, cut or reshaped), update its
prompt in the same commit, so the prompt keeps matching the pages. A series
that is still being planned gets its prompt first and its pages second.

A series' claims ledger, when it has one, sits next to its prompt as
`LEDGER.md`. `FACT-CHECK.md` in this directory tracks which series have been
fact-checked and holds the open leads for all of them.

## The bar every prompt assumes

The prompts don't repeat the house style. Whoever runs one should hold every
article to this:

- Each article is an article, with an argument and a voice. Every figure
  makes one step of that argument visible. No dashboards, KPI cards,
  callout boxes or closing summaries.
- Every checkable claim is derived, computed or sourced from a primary
  source, and is recorded in the ledger. A claim without an entry gets cut.
- Data is real, fetched from its source and cited, or it is labeled
  simulated and carries no real names. Figures compute what they show at
  runtime.
- Every control works at phone width, in dark mode, from the keyboard and
  with reduced motion, and every caption is true of the figure it sits under.
- The prose is plain and direct, with no em dashes.

The full rules are in the skill (`plugins/moonshine/SKILL.md`).
