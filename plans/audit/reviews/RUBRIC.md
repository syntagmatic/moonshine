# Series quality review: brief

I'm deciding what to cut from a gallery of interactive technical essays (repo /Users/kai/git/moonshine, pages in docs/<series>/). Most of it was batch-generated with an older model (Opus 4.5), often a whole series in one day. I want to keep only work that meets a Distill.pub bar and cut the rest, including whole series if needed. Be harsh. Don't grade on effort, length, or visual polish.

## Inputs
- Prose-only extracts (scripts and styles stripped): prose/<series>/<file>.txt. Read these for every article.
- Per-page metrics: metrics.json (lines, words, controls, em dashes, date added).
- Source HTML in docs/<series>/. Pages can be over 5k lines, so never read one whole. For at least 3 articles per series, grep for the figure code and read <=120-line windows to judge whether each figure really computes what the prose claims, or just animates, hardcodes, or decorates. If an extract is nearly empty, look at the HTML to find out why (the prose may be JS-rendered, or the page may be a stub).

## Score each article 1-5 on
- Substance: teaches a real, non-obvious idea correctly (5), or is generic, encyclopedic, or filler (1). Flag math or factual claims that look wrong.
- Figures: the interaction does real explanatory work and computes the thing (5), or is decorative, fake, static, or missing (1).
- Craft: a clear authorial voice and argument (5), or slop (em dashes, "not X but Y", grand summaries, callout or KPI boxes, listicle structure) (1).
- Fit: distinct from its siblings and from other series in the gallery (5), or padding, a near-duplicate, or overlapping (1).

Verdict per article: KEEP (fine or minor fixes) / FIX (worth keeping, needs real work) / MERGE -> <target> / CUT.

## Output
1. Write the full detail to review/<group>.md: for each series, a table (article | S F C Fit | verdict | one-line reason), then a series paragraph.
2. Return a report of at most 400 words. For each series, give: overall score (1-10), series verdict (KEEP / TRIM / RESTRUCTURE / CUT), estimated cut as % of articles and % of words, and the 2-3 decisive reasons. Also note any overlap with series outside your group that you noticed. Report conclusions only.
