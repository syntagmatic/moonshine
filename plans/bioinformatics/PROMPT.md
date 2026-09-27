# Bioinformatics Visualization

I want an eight-article series on the standard plots and methods of modern bioinformatics, for readers with some biology or some data science who have seen these figures in papers and never learned to read them. Biology now measures thousands of cells, millions of bases and whole patient cohorts at once, and the field has built a vocabulary of plots for data that size. What makes this one series is a single biological story running through it: the tumor suppressor TP53 and its target CDKN1A (p21), and how losing TP53 can leave p21 switched off. The first article looks at that story through five kinds of data at once; each later article takes one kind and goes deep.

By the end a reader should be able to open a genome browser, a volcano plot, a clustered heatmap, a t-SNE map or a Kaplan-Meier curve and say what it computes, what it hides, and what question it can answer.

## Articles

Four groups: the spine (1), the genome (2-4), expression (5-7), patients (8).

### 1. Five Views of a Broken Pathway
One question, five views: a cohort oncoprint, a lollipop plot of mutation hotspots on the protein, promoter methylation, the signaling pathway, and a single-cell expression dot plot. The reader sorts the oncoprint by TP53 status and sees a mutually exclusive stripe appear, toggles a mutant in the pathway diagram, and ends with what each view can and cannot say.

### 2. Genome Browser
Where genes live on the chromosome, and how stacked tracks layer annotations, reads and signal along one coordinate axis. The reader pans and zooms a working browser around the EGFR locus, then reads a gene model's anatomy (coding exons, UTRs, introns, strand) and a zoomed region where promoter, transcription and conservation signals line up. Include the 0-based versus 1-based coordinate trap.

### 3. Circos Plot
How distant parts of the genome relate, drawn as a circle. The reader toggles track rings onto a real chromosome ideogram, compares thin links against ribbons for structural variants, zooms into the Philadelphia translocation between chromosomes 9 and 22, and reads human-mouse synteny from a real alignment. It ends with when a circular layout is the wrong choice.

### 4. ChIP-seq Peaks
Can mutant TP53 still bind its targets? The reader compares wildtype, mutant and input-control signal tracks at the CDKN1A promoter, moves a significance threshold and watches peaks get called and merged, then re-sorts a differential-binding table across validated TP53 targets.

### 5. Differential Expression
One RNA-seq experiment tested gene by gene, shown as an MA plot and a volcano plot of the same results. The reader moves fold-change and FDR thresholds and sees, because the simulation knows which genes truly changed, how many true and false hits each filter lets through.

### 6. Clustered Heatmaps
Hierarchical clustering and the dendrogram, then a multi-omics cohort grouped by consensus clustering. The reader flips a gene-by-sample matrix from original to clustered order and watches blocks emerge, cuts the dendrogram at different heights, and reads expression, methylation, mutation and copy number stacked for the same patients with the consensus matrix beside them.

### 7. Dimensionality Reduction
PCA and t-SNE computed in the page on simulated single cells. The signature figure hides two interlocking half-moons inside added noise dimensions and scores each method on whether neighbors stay neighbors; as noise rises, the usual story about which method wins turns around. The reader recolors the embedding by gene and hovers a cell to see its true high-dimensional neighbors.

### 8. Clinical Evidence
What the evidence says about patients: a response waterfall, Kaplan-Meier curves with log-rank tests and hazard ratios, and a random-effects meta-analysis with forest and funnel plots. The reader splits survival curves by one gene's expression, switches the pooling model and watches study weights and the pooled estimate move.

## What to get right

- Say what is real and what is simulated, figure by figure. Genome structure should be real: chromosome lengths and G-bands from the UCSC hg38 cytoband table, Ensembl GRCh38 gene models and UCSC CpG islands around EGFR, real synteny blocks from the UCSC human-mouse alignment net, and real TP53 hotspot positions and domains. Cohorts, expression and survival can be simulated, and the caption must say so.
- Use one genome assembly throughout. Batch-drafted coordinates tend to mix GRCh37 and GRCh38 (chromosome lengths, ABL1, BRCA1, PIK3CA, CDKN2A, the 9;22 breakpoints); check every coordinate against GRCh38.
- Never attach invented numbers to real names. A simulated forest plot gets generic study labels, never real consortia like TCGA or METABRIC with made-up years and effect sizes. Never present random synteny as real evolution.
- Five semantic colors recur across the series (gene, sample, expression, significance, pathway) and the index introduces them as a small legend. Diverging scales need a midpoint that works on a dark background too.
- Keep TP53 and p21 at the center of articles 1, 4, 6 and 8, and let the others point back to them where it fits (the Circos plot and differential expression do). The genome browser works around EGFR, where the real CpG islands and gene models live, and dimensionality reduction uses generic simulated cells.
