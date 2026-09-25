# Cohomology

I want six essays that build cohomology by hand for a reader who already knows simplicial homology and Betti numbers. The reader should meet cohomology as the tool that names holes with functions you can pair against loops, multiply, integrate and track across scales. Every number in every figure should be computed live in the page by linear algebra on a small complex the reader can see, mostly over Z/2.

The first act says what cohomology is: why dualize, the cochain complex on real triangulations, and the cup product that turns the groups into a ring. The second act gives three more ways to compute the same groups: differential forms, gluing along a cover, and persistence on point-cloud data. A reader should finish able to compute H* of a small surface by transposing and reducing a matrix, fill in a cup product table, and turn a long-lived class on noisy data into a circular coordinate.

## Articles

**Act I: From holes to rings**

### 1. From holes to obstructions: why dualize at all
Homology counts holes; a cohomology class is a way of evaluating on them that ignores exact pieces. The reader clicks edges of a triangulated annulus to build a 1-cochain, sees which triangles break the cocycle condition, and slides an added coboundary in and out while the pairings with the inner and outer loops stay fixed. The hairy ball theorem is named as the kind of obstruction this language exists to express.

### 2. Singular cohomology on a triangulated torus
The only new step over homology is the transpose. The reader picks a surface (the minimal triangulated torus, the sphere, the projective plane, the Klein bottle), transposes its boundary matrix into a coboundary, and reduces it one step at a time over Z/2 to read off H0, H1 and H2. All four surfaces share H0 and H2 over Z/2 and differ in H1.

### 3. The cup product on RP2 and T2
The cup product makes cohomology a ring, and the ring sees shape that Betti numbers cannot. The reader clicks cells of a small cup product table and watches the Alexander-Whitney formula run over every ordered triangle, reading one class on the front edge and the other on the back. The anchor: the torus and a wedge of two circles with a sphere have the same Betti numbers and different rings, and the projective plane's generator cubes to zero while its square does not.

**Act II: From rings to computation**

### 4. de Rham: differential forms on S2
The same groups come from differential forms, with the exterior derivative in place of the coboundary and integration in place of pairing. The reader draws a loop on a sphere mesh carrying a 1-form, sees the loop integral vanish for closed forms and drift when a non-closed component is mixed in. On an annulus, the angle form integrates to 2 pi around the hole and to zero once the loop is pushed off it.

### 5. Mayer-Vietoris as a computation engine
Cut a space into two pieces, compute the cohomology of the pieces and their overlap, and the long exact sequence gives the whole. The reader paints vertices of a torus, Klein bottle or octahedral sphere into two covering sets or picks presets; the figure computes the rank of every map, checks exactness at each node, compares the predicted Betti numbers with the directly computed ones, and refuses when the painting fails to cover. The connecting map is worked by hand once on the octahedron.

### 6. Persistent cohomology and circular coordinates
Track which cocycles of a growing Rips complex survive across scales, and turn a long-lived one into an angle on the data. The reader drags points and a scale slider with Betti numbers computed live, then runs the full pipeline on a noisy annulus, clusters or a figure eight: complex, barcode, lifted cocycle, and each point colored by its recovered angle. Part of the story is why the computation leaves Z/2 for a larger prime field.

## What to get right

- Betti numbers are easy to misstate: the torus is (1, 2, 1). Over Z/2 every closed connected surface has H2 = Z/2; over the integers the projective plane and the Klein bottle differ. Say which coefficients each claim uses.
- The pairing of the H1 generator with the loop around the annulus's hole is 1 over Z/2, and it stays 1 as coboundaries are added.
- Mayer-Vietoris needs a genuine cover, and exactness must be checked from the rank of each map. Matching an alternating sum of Betti numbers proves nothing. Some small triangulations with complete 1-skeletons admit no nontrivial vertex cover at all, so choose example surfaces with room to split.
- Circular coordinates need an integer cocycle. Reading a Z/2 cocycle as 0 and 1 generally breaks the cocycle condition, so compute over a prime like 47, lift coefficients to the symmetric range, and check the lift on every triangle. Each bar must get its own cocycle.
- Hold one color language across the series: H0, H1 and H2 in three fixed hues, the coboundary in red, the cup product in violet, differential forms, covers and pairings each in their own. Barcodes run birth to death. Default examples should be seeded so they look the same on every visit.
- Hairy ball: Betti numbers alone don't explain it, but homology can prove it via degree. Don't claim homology is powerless there.
