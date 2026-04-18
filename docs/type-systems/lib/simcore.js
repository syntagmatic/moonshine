// simcore.js — Simulation primitives for the Type Systems series.
// Attaches a single `SC` object to the global scope.
// No build step. Works alongside D3 v7.
//
// Public sections
// ---------------
//   SC.loop           Fixed-timestep animation loop (rAF-driven, pausable)
//   SC.state          Typed entity array helpers (get / set / map by index)
//   SC.forces         Force accumulator — reduce many forces into a net Vec2 per entity
//   SC.integrate      Integrator family: euler, semiImplicit, rk4, symplectic (stubs grow with the series)
//   SC.neighborhood   Neighborhood spec: ring, hex, vonNeumann, moore, knn (added as explainers need them)
//   SC.grid           Uniform-grid field stepper (for reaction-diffusion, CA, etc.)
//   SC.vec            Minimal 2-vector ops (add, sub, scale, norm, distance)
//
// Each explainer builds its sim on top of these so later explainers can respecialize
// via parameters rather than forking. This is the "accumulation principle" in code.

(function (global) {
  'use strict';

  // ─────────────────────────────────────────── vec (2D) ──
  var vec = {
    add: function (a, b) { return [a[0] + b[0], a[1] + b[1]]; },
    sub: function (a, b) { return [a[0] - b[0], a[1] - b[1]]; },
    scale: function (a, k) { return [a[0] * k, a[1] * k]; },
    norm: function (a) { return Math.hypot(a[0], a[1]); },
    dist: function (a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); },
    zero: function () { return [0, 0]; }
  };

  // ─────────────────────────────────────────── loop ──
  // Usage: var l = SC.loop(dt => { step(dt); render(); }); l.start(); l.pause();
  function loop(stepFn) {
    var raf = null, last = 0, running = false;
    function tick(t) {
      if (!running) return;
      var dt = last ? (t - last) / 1000 : 0;
      last = t;
      stepFn(Math.min(dt, 0.05)); // clamp to 50ms to avoid giant jumps on tab-switch
      raf = requestAnimationFrame(tick);
    }
    return {
      start: function () { if (!running) { running = true; last = 0; raf = requestAnimationFrame(tick); } },
      pause: function () { running = false; if (raf) cancelAnimationFrame(raf); },
      toggle: function () { if (running) this.pause(); else this.start(); },
      isRunning: function () { return running; }
    };
  }

  // ─────────────────────────────────────────── state ──
  // Thin wrapper over an Array of records. Keeps the door open for SoA later.
  function state(initial) {
    var arr = initial || [];
    return {
      get: function (i) { return arr[i]; },
      set: function (i, v) { arr[i] = v; },
      push: function (v) { arr.push(v); },
      map: function (f) { arr = arr.map(f); },
      forEach: function (f) { arr.forEach(f); },
      length: function () { return arr.length; },
      raw: function () { return arr; }
    };
  }

  // ─────────────────────────────────────────── forces ──
  // Accumulator: forces is an array of functions (entity, allEntities) -> Vec2.
  // Returns a function that, given (entity, all), sums their contributions.
  function forces(list) {
    return function (e, all) {
      var net = [0, 0];
      for (var i = 0; i < list.length; i++) {
        var f = list[i](e, all);
        net[0] += f[0]; net[1] += f[1];
      }
      return net;
    };
  }

  // ─────────────────────────────────────────── integrate ──
  // First member of the family. Others (semi-implicit, RK4, symplectic) grow with
  // explainers #4 → #7 as the type story around integrators thickens.
  var integrate = {
    euler: function (entity, netForce, dt) {
      // entity: { pos: [x,y], vel: [vx,vy], mass: m }
      var m = entity.mass || 1;
      var ax = netForce[0] / m, ay = netForce[1] / m;
      entity.vel = [entity.vel[0] + ax * dt, entity.vel[1] + ay * dt];
      entity.pos = [entity.pos[0] + entity.vel[0] * dt, entity.pos[1] + entity.vel[1] * dt];
      return entity;
    }
    // semiImplicit, rk4, symplectic: TODO as the series reaches them.
  };

  // ─────────────────────────────────────────── neighborhood ──
  // Returns a function (entity, all) -> [neighbors]. Added as explainers need them.
  var neighborhood = {
    radius: function (r) {
      var r2 = r * r;
      return function (e, all) {
        var out = [];
        for (var i = 0; i < all.length; i++) {
          var n = all[i]; if (n === e) continue;
          var dx = n.pos[0] - e.pos[0], dy = n.pos[1] - e.pos[1];
          if (dx * dx + dy * dy <= r2) out.push(n);
        }
        return out;
      };
    }
    // hex, vonNeumann, moore, knn: TODO as explainers #2, #6, #9 reach them.
  };

  // ─────────────────────────────────────────── grid ──
  // Uniform field stepper. Seeded empty; grown by #9 (reaction-diffusion).
  var grid = {};

  // ─────────────────────────────────────────── exports ──
  global.SC = {
    vec: vec,
    loop: loop,
    state: state,
    forces: forces,
    integrate: integrate,
    neighborhood: neighborhood,
    grid: grid
  };

})(window);
