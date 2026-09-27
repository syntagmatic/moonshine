# Parallel Coordinates

I want a twelve-part series on Alfred Inselberg's geometry of parallel coordinates. A point in five dimensions can't be drawn in Cartesian coordinates, but draw five parallel axes and connect its values with a polyline, and it can. The through-line is that this is a real geometry with a precise duality, and every pattern an analyst learns to read (crossings, bundles, envelopes, brushes) is a statement about that duality.

It is for readers comfortable with linear algebra and curious about high-dimensional geometry or data visualization. By the end they should be able to read correlation, clusters, outliers and hyperplanes off a plot, know why axis order matters, and follow four applications and the regular polytopes of four dimensions.

## Articles

**Foundations**

### 1. The Duality
In parallel coordinates a point becomes a polyline, and a line becomes a point where polylines converge. The reader drags points along a Cartesian line and watches their segments converge on one dual point that moves with the line's slope. Carry it through the projective view to N dimensions and indexed points.

### 2. What Crossings Tell You
Negative correlation makes an X of crossings between two axes, and positive correlation makes a parallel bundle. The reader varies the correlation and watches the pattern change, then reads the real Iris dataset.

### 3. Surfaces You Can't See
A hyperplane in N-space leaves a signature of indexed points, and a curve appears as the envelope of its points' segments, traced by the dual points of its tangents. The reader moves along a circle or parabola and watches the dual curve form, with inflections and cusps trading places.

### 4. Axis Order Is Everything
Only adjacent axes show their relationship, so permuting the axes changes what you can see. The reader drags axes to reorder the real mtcars data, compares all orderings of four variables, and tries a greedy correlation-based ordering.

**Geometric properties**

### 5. Bundles and Deviations
A cluster shows up as a tight bundle of polylines, and an outlier as a polyline that breaks away from one at the axes where it is unusual. The reader brushes the real UCI Wine data colored by cultivar, drags an injected outlier's values against a bundle, and sees its Mahalanobis distance split by axis.

### 6. Inside or Outside
A convex set's boundary becomes a band between the axes, and a point is inside exactly when its whole extended line stays within that band. The reader drags test points around a circle, an ellipse and a polygon and watches the line stay in or leave the band, then sees how the test extends to three dimensions.

### 7. Brushing Is Slicing
Selecting a range on one axis slices the data between two parallel hyperplanes, several brushes intersect those slices, and an angular brush between two axes selects by slope. The reader brushes axes, draws one strum line or two to make a wedge, and combines them.

**Applied domains**

### 8. Anomaly and Classification
The same mechanism detects drift in a process and classifies a patient: a polyline wandering out of a normal bundle, or a profile landing between two bundles. The reader watches reactor sensor readings drift against a normal bundle, then explores real heart disease data with per-axis effect sizes and an age brush.

### 9. Collision Courses
Two aircraft in a plane are one point in an eight-dimensional state space, and the collision condition marks out a dangerous region of it. The reader sets the aircraft's positions and velocities, watches the closest point of approach, and sees where dangerous pairs sit among the polylines.

### 10. Robot Arms
A robot arm's joint angles are a point in configuration space, and inverse kinematics becomes brushing on the end-effector axes. The reader drags a target for a two-link or three-link arm and sees the family of joint configurations that reach it, with joint limits and redundancy.

### 11. The Pareto Front
When no design is best on every objective, the ones worth considering form the Pareto front, where no objective improves without another getting worse. Parallel coordinates show it for many objectives at once, one axis per objective. The reader explores a hundred car designs scored on five objectives, tests dominance, adds objectives, and tries weighted-sum selection.

**Four dimensions**

### 12. Polytopes in Four Dimensions
The six regular 4-polytopes appear as polyline families beside rotating wireframes. The reader rotates each one, including through the fourth dimension, reads edges as indexed points, checks which rotations restore the vertex set, and compares duals and the Euler relation.

## What to get right

- Named datasets must be the real files: Iris and Wine (178 rows: 59, 71, 48) from UCI, mtcars from R, heart disease from the UCI Cleveland file. Invented data (car designs, reactor sensors, aircraft) is captioned as simulated. Never "simulated from the distributions of" a named dataset.
- The containment test is easy to state wrong: the segment between the axes staying in the band is necessary but insufficient, and the whole extended line must stay in. Intersection of convex sets means lying in both bands. In three dimensions the pairwise tests suffice only for boxes.
- Crossings between adjacent axes record only that two coordinates are in opposite order. They do not encode a polytope's edges, and they are not a topological invariant. The 24-cell's symmetry in a coordinate plane depends on the coordinates you choose; state it for yours.
- A weighted sum reaches only the convex part of a Pareto front. The per-axis Mahalanobis split is exact only for diagonal covariance. Say "envelope" only where something computes one.
- One color vocabulary runs through all twelve articles, each color tied to a geometric role (polylines, crossings and convergence, Cartesian points, brushes, envelopes, axes) and mirrored in equations and prose.
- The source is Inselberg's Parallel Coordinates (Springer, 2009).
