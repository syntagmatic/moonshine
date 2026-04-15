// arcade.js — game engine primitives for the Exceptional Arcade.
//
// Thin shared layer. Each arcade game imports this plus whichever math lib
// (e8-math.js, oct-math.js, ...) it needs, and composes the primitives into
// its own round logic.
//
// Exposes a single `arcade` global with these helpers:
//   Timer(ms, onTick, onTimeout)     — countdown timer with 50ms tick resolution
//   Scoreboard(key)                  — localStorage-backed persistent scores
//   Streak(scoreboard, key)          — streak counter with best tracking
//   flash(element, color, ms)        — transient background-color flash
//   nearestPoint(points, x, y, tol)  — hit-test a click against an array of 2D points
//   makeDraggable(el, bins, onDrop)  — pointer-drag with bin drop targets
//
// Design notes:
// - All helpers are optional. Games can use them or roll their own. No framework.
// - Persistence is per-browser via localStorage. No login, no server.
// - No "experience points" or retention hooks. Scoring is accuracy + time.

(function (global) {
  'use strict';

  // ─────────────────────────────────────────────── Timer ─────
  function Timer(ms, onTick, onTimeout) {
    var remaining = ms;
    var lastTick = null;
    var interval = null;
    var running = false;
    return {
      start: function () {
        if (running) return;
        running = true;
        lastTick = Date.now();
        interval = setInterval(function () {
          var now = Date.now();
          var elapsed = now - lastTick;
          lastTick = now;
          remaining -= elapsed;
          if (onTick) onTick(Math.max(0, remaining));
          if (remaining <= 0) {
            clearInterval(interval);
            interval = null;
            running = false;
            if (onTimeout) onTimeout();
          }
        }, 50);
      },
      stop: function () {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        running = false;
      },
      reset: function (newMs) {
        remaining = (newMs != null) ? newMs : ms;
        lastTick = Date.now();
      },
      getRemaining: function () { return remaining; },
      isRunning: function () { return running; }
    };
  }

  // ─────────────────────────────────────────────── Scoreboard ─────
  // Persistent high-score store backed by localStorage under 'arcade:<key>'.
  // Values are arbitrary JSON. Pass a comparison function to `update` to
  // decide whether a new value is better than the stored one.
  function Scoreboard(key) {
    var storageKey = 'arcade:' + key;
    function load() {
      try {
        var raw = (typeof localStorage !== 'undefined') ? localStorage.getItem(storageKey) : null;
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }
    function save(data) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify(data));
        }
      } catch (e) {}
    }
    return {
      get: function (field) { return load()[field]; },
      set: function (field, value) {
        var data = load();
        data[field] = value;
        save(data);
        return value;
      },
      update: function (field, newValue, better) {
        var data = load();
        var cur = data[field];
        if (cur === undefined || (better && better(newValue, cur))) {
          data[field] = newValue;
          save(data);
          return true;
        }
        return false;
      },
      all: function () { return load(); },
      clear: function () { save({}); }
    };
  }

  // ─────────────────────────────────────────────── Streak ─────
  // Runtime streak counter, optionally syncing its best run to a scoreboard.
  function Streak(scoreboard, key) {
    var current = 0;
    var best = (scoreboard && key) ? (scoreboard.get(key) || 0) : 0;
    return {
      increment: function () {
        current++;
        if (current > best) {
          best = current;
          if (scoreboard && key) scoreboard.set(key, best);
        }
        return current;
      },
      reset: function () {
        current = 0;
      },
      get: function () { return current; },
      best: function () { return best; }
    };
  }

  // ─────────────────────────────────────────────── flash ─────
  // Briefly set an element's background color, then restore.
  function flash(element, color, ms) {
    ms = ms || 300;
    var original = element.style.backgroundColor || '';
    element.style.backgroundColor = color;
    setTimeout(function () {
      element.style.backgroundColor = original;
    }, ms);
  }

  // ─────────────────────────────────────────────── nearestPoint ─────
  // Given an array of 2D points [[x, y], ...] and a click (cx, cy), return
  // the index of the nearest point within `tolerance` pixels, or -1 if none.
  function nearestPoint(points, cx, cy, tolerance) {
    tolerance = tolerance || 20;
    var bestIdx = -1;
    var bestDist = Infinity;
    for (var i = 0; i < points.length; i++) {
      var dx = points[i][0] - cx;
      var dy = points[i][1] - cy;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < bestDist && d <= tolerance) {
        bestDist = d;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  // ─────────────────────────────────────────────── makeDraggable ─────
  // Attach pointer-drag behavior to an element. `bins` is an array of DOM
  // elements that serve as drop targets. `onDrop(idx, el)` is called with
  // the index of the bin the element was dropped into, or -1 if none.
  function makeDraggable(element, bins, onDrop) {
    var dragging = false;
    var offsetX = 0;
    var offsetY = 0;
    var originLeft = element.style.left;
    var originTop = element.style.top;
    var originPosition = element.style.position;

    element.style.cursor = 'grab';
    element.addEventListener('mousedown', function (ev) {
      dragging = true;
      element.style.cursor = 'grabbing';
      var rect = element.getBoundingClientRect();
      offsetX = ev.clientX - rect.left;
      offsetY = ev.clientY - rect.top;
      originLeft = element.style.left;
      originTop = element.style.top;
      originPosition = element.style.position;
      element.style.position = 'fixed';
      element.style.left = (ev.clientX - offsetX) + 'px';
      element.style.top = (ev.clientY - offsetY) + 'px';
      ev.preventDefault();
    });

    var moveHandler = function (ev) {
      if (!dragging) return;
      element.style.left = (ev.clientX - offsetX) + 'px';
      element.style.top = (ev.clientY - offsetY) + 'px';
    };
    var upHandler = function (ev) {
      if (!dragging) return;
      dragging = false;
      element.style.cursor = 'grab';
      var dropped = -1;
      var droppedEl = null;
      for (var i = 0; i < bins.length; i++) {
        var r = bins[i].getBoundingClientRect();
        if (ev.clientX >= r.left && ev.clientX <= r.right &&
            ev.clientY >= r.top && ev.clientY <= r.bottom) {
          dropped = i;
          droppedEl = bins[i];
          break;
        }
      }
      if (dropped < 0) {
        // Bounce back
        element.style.position = originPosition;
        element.style.left = originLeft;
        element.style.top = originTop;
      }
      if (onDrop) onDrop(dropped, droppedEl);
    };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);

    return {
      destroy: function () {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
      }
    };
  }

  // ─────────────────────────────────────────────── sanity checks ─────
  function runChecks() {
    var errors = [];
    if (typeof Timer !== 'function') errors.push('Timer not a function');
    if (typeof Scoreboard !== 'function') errors.push('Scoreboard not a function');
    if (typeof Streak !== 'function') errors.push('Streak not a function');
    if (typeof flash !== 'function') errors.push('flash not a function');
    if (typeof nearestPoint !== 'function') errors.push('nearestPoint not a function');
    if (typeof makeDraggable !== 'function') errors.push('makeDraggable not a function');

    // nearestPoint basic test
    var idx = nearestPoint([[0, 0], [10, 10], [20, 20]], 11, 11, 5);
    if (idx !== 1) errors.push('nearestPoint: expected 1, got ' + idx);
    var idx2 = nearestPoint([[0, 0], [100, 100]], 50, 50, 5);
    if (idx2 !== -1) errors.push('nearestPoint with far click: expected -1, got ' + idx2);

    if (errors.length === 0) {
      if (typeof console !== 'undefined' && console.log) {
        console.log('[arcade] sanity checks passed');
      }
    } else if (typeof console !== 'undefined' && console.error) {
      console.error('[arcade] sanity checks FAILED:', errors);
    }
    return errors;
  }

  // ─────────────────────────────────────────────── public API ─────
  var arcade = {
    Timer: Timer,
    Scoreboard: Scoreboard,
    Streak: Streak,
    flash: flash,
    nearestPoint: nearestPoint,
    makeDraggable: makeDraggable,
    _runChecks: runChecks
  };

  global.arcade = arcade;
  runChecks();

})(typeof window !== 'undefined' ? window : globalThis);
