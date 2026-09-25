# The Lithium-Ion Cell

I want a five-article series on the lithium-ion cell for engineers and technically curious readers who have used batteries but never looked inside the voltage. The through-line is that almost everything you can measure from outside a cell is a voltage. The series starts from the resting voltage, subtracts what a current costs, follows the cell as it ages, reads that aging back through an impedance sweep, and ends by putting cells together into a pack. Each article should lean on the ones before it, so the pack article's charge taper, state-of-charge estimator and fast-charge limits visibly depend on the curves and losses built earlier.

By the end a reader should be able to look at a voltage curve and say why it has the shape it has, why state of charge is hard to read from it on some chemistries, and what a pack designer has to worry about that a single cell never shows.

## Articles

Three acts: inside one cell (1-2), aging and diagnosis (3-4), many cells (5).

### 1. The Voltage at Rest
Graphite fills with lithium in stages, each stage boundary is a two-phase region, and each two-phase region is a flat stretch of voltage. The reader drags lithium content through a cross-section of graphite and watches galleries fill in the ideal stage sequence, then sees the anode, cathode and full-cell resting voltages together with a cathode choice (LFP or NMC). A third figure shows the slope of each curve, which is what decides whether a battery management system can read charge from voltage.

### 2. Voltage Under Load
Under current, terminal voltage is the resting voltage minus a stack of ohmic, charge-transfer and concentration losses, each with its own current law. The signature figure peels the voltage apart as state of charge sweeps down, with the reader setting C-rate and temperature and dragging a cursor to read each loss. A companion shows lithium depleting at a particle's surface, and a triangle plot shows which loss dominates as conditions change.

### 3. Aging and Failure
Most cells die slowly as a passivation layer thickens on the anode roughly as the square root of time; some die fast when lithium plates into dendrites that short the separator. The reader watches the layer grow over simulated years under chosen temperature and state of charge, splits capacity fade into calendar and cycle parts with their own knobs, and grows a dendrite across a gap by tuning how sticky and field-biased the arriving lithium is.

### 4. Impedance Spectroscopy
A small AC signal swept over eight decades of frequency separates the ohmic path, the interface and diffusion into three features of one curve. The reader builds the equivalent circuit element by element and watches the Nyquist spectrum respond, with each region labeled by the earlier article that explains it. A final figure deforms the spectrum as the cell ages.

### 5. From Cell to Pack
Four problems that only appear when cells are charged and combined: charging against a voltage ceiling, the weakest cell in a series string, estimating a charge no sensor can read, and heat crossing from one cell to the next. The reader runs a constant-current, constant-voltage charge and sweeps C-rate; discharges a string of cells drawn with random capacity and charge spread, with and without balancing, and sees usable capacity fall with string length; watches a Kalman filter track state of charge against coulomb counting and voltage lookup on a cell with a biased current sensor; and triggers runaway in one cell of a stack to see when it spreads.

## What to get right

- The graphite resting-voltage curve should be a published fit (Chen et al. 2020 for the LG M50 graphite-SiOx anode is a good one), with plateaus near 0.21, 0.13 and 0.09 V and never dipping below 0 V. If cathode curves are hand-drawn shapes, say so in the caption beside the real fit. LFP's plateau sits near 3.42 V vs lithium; make the drawn curve agree with the text.
- The staging figure draws the known phase sequence with the lever rule splitting the lattice into coexisting domains. It must not claim to simulate anything it doesn't, and filled sites should match the stated composition.
- Every figure in the pack article should compute its model: the charge taper from the resting curve and a resistance, the string from sampled cells, a real two-state EKF, and a thermal network where each cell has finite energy and no fixed trigger temperature. Say which parameters were chosen and that the EKF is handed the exact cell model. Numbers in prose should match the live readouts.
- Common errors to avoid: the Warburg element belongs in series with charge-transfer resistance inside the faradaic branch of the Randles circuit, in both the drawing and the math. SEI is a few to a few tens of nanometres thick. Graphite cells plate under fast charging near 0 °C even when new. The additive loss stack is a lumped first model with couplings it ignores. Impedance spectra are measured on the bench and at end of line; vehicles estimate resistance from current pulses.
- Keep one color per concept across all five articles (lithium, graphite, each cathode chemistry, voltage, danger), mirrored in equations and prose.
