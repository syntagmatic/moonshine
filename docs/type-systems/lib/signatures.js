// signatures.js — Canonical signatures and their type-geometric dimensions for #1–#12.
// Consumed by #11 (type-lattice parcoords) and #12 (signatures-as-data callbacks).
// Adding a new explainer: append one row. Changing a dimension: audit all rows.
//
// The nine dimensions trace out the "shape of a type signature." Each is a non-negative
// integer so they plot cleanly on parallel-coordinates axes.
//
//   arity    — number of value-level arguments the function takes.
//   sum      — variant count of the largest sum-typed input (0 if no sum).
//   prod     — field count of the largest product-typed input (0 if no product).
//   eff      — effect-rank. 0 = Det, 1 = Seeded Rand, 2 = unseeded Rand, 3 = IO.
//   shape    — number of type-level shape/size parameters.
//   refine   — number of refinement predicates anywhere in the signature.
//   phantom  — number of phantom type parameters.
//   invar    — number of invariants the function is stated to preserve.
//   traits   — number of trait / typeclass constraints attached to parameters.

(function (global) {
  'use strict';

  var dimKeys = ['arity', 'sum', 'prod', 'eff', 'shape', 'refine', 'phantom', 'invar', 'traits'];

  var dimMeta = {
    arity:    { label: 'arity',   max: 4, desc: 'value-level arguments' },
    sum:      { label: 'sum',     max: 6, desc: 'largest sum-type variant count' },
    prod:     { label: 'prod',    max: 6, desc: 'largest product-type field count' },
    eff:      { label: 'eff',     max: 3, desc: 'effect rank: Det | Rand (seeded) | Rand | IO' },
    shape:    { label: 'shape',   max: 3, desc: 'type-level shape parameters' },
    refine:   { label: 'refine',  max: 3, desc: 'refinement predicates' },
    phantom:  { label: 'phantom', max: 3, desc: 'phantom type parameters' },
    invar:    { label: 'invar',   max: 3, desc: 'preserved invariants' },
    traits:   { label: 'traits',  max: 4, desc: 'trait / typeclass constraints' }
  };

  // Rows are authored by hand from each explainer's §3. Re-audit when §3 changes.
  var entries = [
    {
      id: 1, title: 'Force-directed graph layout', href: '01-force-directed-graph.html',
      name: 'tick',
      sig: 'tick :: Delta Time -> Graph -> Graph',
      note: 'Graph contains Node { pos, vel, mass, id }; Fixed/Free phantom tags node updatability.',
      dims: { arity: 2, sum: 0, prod: 4, eff: 0, shape: 0, refine: 0, phantom: 1, invar: 0, traits: 0 }
    },
    {
      id: 2, title: 'Boids', href: '02-boids.html',
      name: 'Rule',
      sig: 'type Rule = Neighbors -> Boid -> Force',
      note: 'Curried; three rules share one type; `combine :: [Rule] -> Rule` falls out for free.',
      dims: { arity: 2, sum: 0, prod: 3, eff: 0, shape: 0, refine: 0, phantom: 0, invar: 0, traits: 0 }
    },
    {
      id: 3, title: 'Springs and Constraints', href: '03-springs-and-constraints.html',
      name: 'apply',
      sig: 'apply :: Constraint -> State -> State',
      note: 'Constraint is a sum of three variants (Spring | Anchor | Distance); the scene is [Constraint].',
      dims: { arity: 2, sum: 3, prod: 0, eff: 0, shape: 0, refine: 0, phantom: 0, invar: 0, traits: 0 }
    },
    {
      id: 4, title: 'Predator-Prey', href: '04-predator-prey.html',
      name: 'step',
      sig: 'step :: Params -> State -> State    where State = { prey :: Pop, pred :: Pop }, Pop = { p | p >= 0 }',
      note: 'Pop is a refinement over Double; non-negativity is enforced by type, not runtime guard.',
      dims: { arity: 2, sum: 2, prod: 2, eff: 0, shape: 0, refine: 1, phantom: 0, invar: 1, traits: 0 }
    },
    {
      id: 5, title: 'Traffic Flow', href: '05-traffic-flow.html',
      name: 'transition',
      sig: 'transition :: CarState -> Input -> CarState',
      note: 'CarState = Moving Speed | Braking Decel | Stopped; sum variants carry payloads.',
      dims: { arity: 2, sum: 3, prod: 0, eff: 0, shape: 0, refine: 0, phantom: 0, invar: 0, traits: 0 }
    },
    {
      id: 6, title: 'SIR on a Graph', href: '06-sir-on-a-graph.html',
      name: 'step',
      sig: 'step :: Rates -> Graph -> Graph    where Population = { p | sum p == N }',
      note: 'Compartment = S | I | R (payloadless); Population carries a conservation refinement.',
      dims: { arity: 2, sum: 3, prod: 4, eff: 0, shape: 0, refine: 1, phantom: 0, invar: 1, traits: 0 }
    },
    {
      id: 7, title: 'N-Body and Symplectic Integration', href: '07-n-body-symplectic.html',
      name: 'Integrator',
      sig: 'newtype Integrator law = Integrator (Hamiltonian -> State -> Dt -> State)',
      note: 'Phantom `law` tag distinguishes Euler | Semi | Symp; value signature identical across tags.',
      dims: { arity: 3, sum: 0, prod: 4, eff: 0, shape: 0, refine: 0, phantom: 1, invar: 1, traits: 0 }
    },
    {
      id: 8, title: 'Random Walks', href: '08-random-walks.html',
      name: 'Step',
      sig: 'type Step e = State -> e State',
      note: 'Effect parameter `e` ranges over Det, Rand (Seed s), Rand, IO — a three-step capability ladder.',
      dims: { arity: 1, sum: 0, prod: 2, eff: 3, shape: 0, refine: 0, phantom: 0, invar: 0, traits: 0 }
    },
    {
      id: 9, title: 'Reaction-Diffusion', href: '09-reaction-diffusion.html',
      name: 'step',
      sig: 'step :: ReactionParams -> Field w h -> Field w h',
      note: 'Shape params w, h are type-level Nats; convolve requires Stencil k against Field w h (k < min w h).',
      dims: { arity: 2, sum: 0, prod: 0, eff: 0, shape: 2, refine: 0, phantom: 0, invar: 0, traits: 0 }
    },
    {
      id: 10, title: 'Fitness Landscapes and Genetic Algorithms', href: '10-fitness-ga.html',
      name: 'step',
      sig: 'step :: (Fitness a, Mutate a, Cross a) => Rates -> [a] -> Rand [a]',
      note: 'Three trait constraints form the contract; the solver is polymorphic in the candidate type.',
      dims: { arity: 2, sum: 0, prod: 0, eff: 1, shape: 0, refine: 0, phantom: 0, invar: 0, traits: 3 }
    }
    // #11 (type lattice) plots these rows. #12 (root systems) does not plot, but uses the
    // symmetries of selected rows as its §5 gallery.
  ];

  global.TS_SIGNATURES = entries;
  global.TS_SIGNATURE_DIMS = dimKeys;
  global.TS_SIGNATURE_DIM_META = dimMeta;

})(window);
