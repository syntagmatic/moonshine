# Force and Attention: Simone Weil

Twelve-part interactive explainer series on Simone Weil's movement between political oppression and spiritual attention, organized around *Gravity and Grace* and *Oppression and Liberty*.

## Locked plan

**Spine.** Weil's thought turns on the pressure of force and the discipline of attention. The political writings diagnose how labor, bureaucracy, war, and prestige separate thought from action; the notebooks ask how gravity, affliction, decreation, and grace reshape the self's contact with reality. Reader endpoint: a usable map of Weil's core terms, an understanding of how her factory and war writings connect to her mystical vocabulary, and enough caution to read her without either sentimentalizing or flattening her.

**Identity.** Slug `simone-weil`, title *Force and Attention: Simone Weil on Gravity, Grace, Oppression, and Liberty*. Audience is curious generalists. Voice should be clear, concrete, and interpretive rather than academic. The explainers should explain Weil's terms through examples, diagrams, and close paraphrase, not assume prior philosophy training.

**Shape.** Two acts, 12 explainers, 6/6.

- **Act I - Gravity & Grace:** gravity and necessity; attention; affliction; decreation; contradiction; grace.
- **Act II - Oppression and Liberty:** force; factory labor; bureaucracy; war; technique and method; liberty under necessity.

**Important framing.** *Gravity and Grace* and *Oppression and Liberty* are posthumous edited collections, not author-designed books with clean internal arcs. The series should use the two titles as organizing halves while repeatedly making the conceptual bridges visible: force becomes gravity, oppression becomes affliction, and liberty becomes truthful attention under necessity.

**Visual style.** Concept diagrams first. Use force fields, attention spotlights, factory-flow diagrams, command-chain maps, layered pressure diagrams, balance figures, and argument maps. Avoid decorative mysticism. The visuals should make abstractions inspectable.

**Rendering stack.** Standalone HTML/CSS/JS, no build step. Prefer SVG and small inline JS. Canvas is acceptable for force fields or dense motion, but most figures should be accessible, inspectable diagrams. A small shared helper may live at `docs/simone-weil/lib/weil-viz.js` and attach to a single `WEIL` global.

## Research grounding

The series should treat the named books as entry points into Weil's larger body of writing.

- *Gravity and Grace* is a topical selection from Weil's notebooks, arranged by Gustave Thibon after her death. It is useful for concept clusters such as void, detachment, imagination, decreation, necessity, affliction, violence, contradiction, attention, beauty, metaxu, the social imprint, and the Great Beast.
- *Oppression and Liberty* is a posthumous political collection centered on "Reflections Concerning the Causes of Liberty and Social Oppression" and related essays/fragments on revolution, technocracy, National Socialism, the USSR, Marxism, and war.
- "The Iliad, or the Poem of Force" is required context for the explainer on force and war, even though it is outside the two named books.
- Factory writings are required context for the bridge from oppression/humiliation to `malheur`, affliction.
- *The Need for Roots* is required context for the final explainer on liberty, obligation, rootedness, and reconstruction.
- *Waiting for God* and related letters/essays are useful context for attention, waiting, obedience, and consent.

## Key terms

Introduce the French terms at least once and avoid silently flattening them into English.

- `pesanteur` - gravity, weight, the downward pull of necessity across physics, psychology, and society.
- `grace` - grace, a counter-movement not produced by willpower.
- `necessite` - necessity, physical/social/psychological constraint and the order of reality.
- `malheur` - affliction, not ordinary suffering; bodily pain, social degradation, and psychic or spiritual crushing together.
- `attention` - receptive, disciplined waiting; not mere concentration or effort.
- `attente` - waiting, closely linked to attention.
- `decreation` - decreation, the withdrawal of the ego's claim to be the center.
- `force` - force, that which turns persons into things or thing-like beings.
- `puissance` - power, especially command, domination, and social power.
- `lecture` - Weil's French term for the interpretive frame through which a person or society reads signs in the world.
- `metaxu` - intermediary or bridge; worldly things that both separate from and connect to the good.
- `enracinement` / `deracinement` - rootedness / uprootedness.
- `consentement` - consent, especially consent to necessity; must not be confused with political passivity.

## Series outline

### Act I - Gravity & Grace

1. **Gravity.** Necessity as a downward pull: bodily, psychological, social, and spiritual. Figure: an interactive field where ego, status, hunger, fear, and prestige bend attention.
2. **Attention.** Attention as receptive discipline rather than willpower. Figure: an adjustable attention spotlight that changes what can be seen without grabbing it.
3. **Affliction.** `Malheur` as suffering that reaches body, status, and soul. Figure: layered pressure diagram showing why affliction is not just pain plus sadness.
4. **Decreation.** The self's withdrawal from the center so reality can appear. Figure: self/world boundary diagram with projections fading as attention deepens.
5. **Contradiction.** Contradiction as a place where thought meets what it cannot possess. Figure: argument map showing false resolution, evasion, and sustained attention.
6. **Grace.** Grace as interruption of gravity, not a reward for effort. Figure: balance/field diagram connecting necessity, waiting, consent, and non-mechanical transformation.

### Act II - Oppression and Liberty

7. **Force.** Force as the real subject of war and domination: it deforms victims, agents, and spectators. Figure: network model where force circulates through roles rather than belonging to one person.
8. **The Factory.** Labor, rhythm, fatigue, obedience, and the separation of thought from action. Figure: production-line diagram contrasting methodical action with mechanical compliance.
9. **Bureaucracy.** Abstraction, command chains, specialist language, and means becoming ends. Figure: hierarchy flow map showing where reality is lost as reports move upward and orders move downward.
10. **War.** War as a machine that consumes purposes, language, and bodies. Figure: escalation feedback diagram linking prestige, fear, retaliation, and necessity.
11. **Technique and Method.** Tools, science, planning, and the point where method becomes domination. Figure: split diagram of tool-as-contact versus system-as-command.
12. **Liberty.** Freedom not as escape from necessity, but lucid action within limits. Figure: final synthesis diagram connecting attention, rooted obligation, labor, necessity, and grace.

## Visual approach

- Keep figures conceptually exact rather than decorative.
- Use labels and captions to disambiguate Weil's unusual vocabulary.
- Prefer interactions that reveal a distinction: force vs. power, pain vs. affliction, attention vs. will, consent vs. submission, method vs. domination.
- Use subdued, readable palettes with semantic color roles for gravity/force, attention, affliction, grace, and rootedness.
- Keep quotations short. Prefer paraphrase and diagrammatic explanation because many English translations remain copyrighted.

## Source cautions

- Do not present *Gravity and Grace* as a finished systematic theology.
- Do not present *Oppression and Liberty* as a single book-length argument written and arranged by Weil.
- Do not romanticize suffering or turn affliction into spiritual atmosphere. Weil's concept is diagnostic and severe.
- Do not make consent sound like submission to injustice. Her political writings are anti-oppression; late consent concerns necessity, truth, and the good.
- Do not hide the reception problem around Weil's anti-Judaism and rejection of Jewish identity. The series should mention this honestly where relevant, without making every explainer a biography of the controversy.
- Do not reduce Weil to sainthood, pathology, or austerity. Keep the focus on concepts, arguments, and historical experience.
- Distinguish authorial claims from editorial arrangement and later reception.

## Sources

Primary and edition anchors:

- Stanford Encyclopedia of Philosophy, "Simone Weil": https://plato.stanford.edu/archives/spr2026/entries/simone-weil/
- Internet Encyclopedia of Philosophy, "Simone Weil": https://iep.utm.edu/weil/
- Routledge, *Gravity and Grace*: https://www.routledge.com/Gravity-and-Grace/Weil/p/book/9780415290005
- Routledge, *Oppression and Liberty*: https://www.routledge.com/Oppression-and-Liberty-1st-Edition/Weil/p/book/9780415254076
- Routledge, *The Need for Roots*: https://www.routledge.com/The-Need-for-Roots-Prelude-to-a-Declaration-of-Duties-Towards-Mankind/Weil/p/book/9780415271011
- "The Iliad, or the Poem of Force" for the force/war explainers.
- Factory writings and factory journal material for the labor/affliction hinge.

Secondary and reception anchors:

- Robert Chenavier, *Simone Weil: Attention to the Real*.
- Sharon Cameron, "The Practice of Attention: Simone Weil's Performance of Impersonality".
- Simone Petrement, *Simone Weil: A Life*.
- Robert Zaretsky, *The Subversive Simone Weil*.
- Recent reception criticism on Weil's anti-Judaism and the risks of sanctifying her image.

## Files

Planned implementation:

```text
plans/simone-weil/
  README.md
  briefs/
    01-gravity.md
    02-attention.md
    03-affliction.md
    04-decreation.md
    05-contradiction.md
    06-grace.md
    07-force.md
    08-the-factory.md
    09-bureaucracy.md
    10-war.md
    11-technique-and-method.md
    12-liberty.md
  vocabulary/
    structured-vocabulary.md
    concept-graphs.md
  sources/
    README.md
    source-map.md
    critical-quotes.md
    vocabulary-connections.md

docs/simone-weil/
  lib/
    weil-viz.js
  index.html
  01-gravity.html
  02-attention.html
  03-affliction.html
  04-decreation.html
  05-contradiction.html
  06-grace.html
  07-force.html
  08-the-factory.html
  09-bureaucracy.html
  10-war.html
  11-technique-and-method.html
  12-liberty.html
```

## Brief template

Each brief should be 400-700 words and include:

- **Pitch** - the concept, why it matters, and what becomes clearer through the figure.
- **Source basis** - named Weil text(s), with edition caveats if relevant.
- **Figures** - 3-5 visual elements, marked interactive/static.
- **Key terms** - French and English terms used in the explainer.
- **Misreadings to avoid** - likely distortions or oversimplifications.
- **Reader takeaway** - what the reader can now distinguish or explain.

## Source packet

The `sources/` folder holds quote anchors and source-routing notes for implementation. It should be used as a working packet, not as a public quotation anthology. Exact wording should be checked against the selected editions before page publication, especially where the source is a posthumous collection or a copyrighted English translation.

## Phase state

- [x] **Phase 0** - research grounding and locked series plan recorded.
- [x] **Phase 1** - write 12 briefs.
- [x] **Phase 1a** - source packet, critical quote anchors, and vocabulary-connection notes.
- [ ] **Phase 2** - build shared visual language and series index.
- [ ] **Phase 3** - build Act I explainers.
- [ ] **Phase 4** - build Act II explainers.
- [ ] **Phase 5** - root index entry, cross-reference pass, source-caution pass, mobile/browser audit.
