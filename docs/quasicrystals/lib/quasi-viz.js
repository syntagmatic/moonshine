(function (global) {
  'use strict';

  var phi = (1 + Math.sqrt(5)) / 2;
  var sigmaPhi = 1 - phi;
  var canonicalHalfWidth = phi * phi / (2 * Math.sqrt(1 + phi * phi));
  var NS = 'http://www.w3.org/2000/svg';

  var articles = [
    {
      id: '01',
      file: '01-fibonacci-cut-and-project-phasons.html',
      title: 'Fibonacci, Cut-and-Project, and Phasons',
      shortTitle: 'Fibonacci / phasons',
      subtitle: 'The smallest model set now carries the full vocabulary: projection, exact golden arithmetic, internal density, two gates, and phason offsets.',
      tags: 'Z2 projection / Z[phi] / phasons',
      act: 'Act I',
      figure: 'fibonacci',
      sections: [
        {
          kicker: 'Toy model',
          heading: 'A periodic lattice can cast a non-repeating shadow',
          paragraphs: [
            'Start with the integer lattice in the plane. Project it onto a line of slope 1/&phi;, but keep only the lattice points whose orthogonal coordinate lands inside a bounded strip. The kept points form a one-dimensional tiling with long and short intervals.',
            'Nothing random is being sampled. The non-repetition comes from the irrational slope, while the bounded window keeps the projected set locally finite.'
          ]
        },
        {
          kicker: 'Exact coordinates',
          heading: 'The hidden coordinate is arithmetic, not decoration',
          paragraphs: [
            'Numbers of the form a + b&phi; carry a paired value under the automorphism &sigma;(&phi;) = 1 - &phi;. The coefficients stay integer. Only the interpretation of &phi; changes.',
            'That pair is the arithmetic prototype for physical and internal coordinates. Floating point is fine for drawing, but exact integer pairs protect membership tests and identity checks.'
          ]
        },
        {
          kicker: 'Two gates',
          heading: 'The useful set is an intersection',
          paragraphs: [
            'A cut-and-project scheme has four pieces: a lattice Lambda, a physical projection, an internal projection, and a window. The physical projection gives visible coordinates. The internal projection decides membership.',
            'Physical and internal filters prune different failures. A point can be visible but rejected by the hidden coordinate, or hidden-valid but outside the finite visible span.'
          ]
        },
        {
          kicker: 'Offset',
          heading: 'Moving the window produces phason flips',
          paragraphs: [
            'The model set can be offset by moving the acceptance window in internal space. A lattice point appears when its internal coordinate enters the window and disappears when it leaves.',
            'Those boundary-crossing events are phason flips. Generic offsets avoid the boundary; singular offsets put at least one lattice point exactly on it, so the vertex set jumps under an arbitrarily small move.'
          ]
        }
      ],
      takeaway: 'The Fibonacci model set is the physical projection of exact lattice coordinates whose internal coordinate passes a moving window test.'
    },
    {
      id: '02',
      file: '02-penrose-projection-and-inflation.html',
      title: 'Penrose Projection and Inflation',
      shortTitle: 'Penrose / inflation',
      subtitle: 'The five-grid Penrose construction, local matching rules, and phi-inflation are three views of the same aperiodic order.',
      tags: 'de Bruijn pentagrid / matching rules / inflation',
      act: 'Act I',
      figure: 'pentagrid',
      sections: [
        {
          kicker: 'Five directions',
          heading: 'The canonical Penrose construction is five-fold from the start',
          paragraphs: [
            'A classical Penrose patch can be built from five families of parallel grid lines, often called a de Bruijn pentagrid. The five directions are not decoration; they are the visible trace of the ambient Z5 coordinates.',
            'The figure below keeps the pentagrid visible while drawing the finite projected patch next to it. This is the public Penrose construction, not the related in-house E8 slice.'
          ]
        },
        {
          kicker: 'Local rules',
          heading: 'Projection and matching rules meet here',
          paragraphs: [
            'For Penrose tilings, cut-and-project and matching-rule perspectives describe the same local-isomorphism class. They emphasize different data: a window in internal space, or local edge constraints in the plane.',
            'The local checker is intentionally small. It shows what a rule sees at an edge, not a complete proof that every legal infinite tiling is non-periodic.'
          ]
        },
        {
          kicker: 'Inflation',
          heading: 'Scaling by phi preserves the patch language',
          paragraphs: [
            'Inflation is not a visual zoom. It is a combinatorial map: scale by &phi;, subdivide, and the same local tile vocabulary reappears.',
            'Finite patches always have boundary effects, so the important signal is interior agreement. The overlay makes that distinction visible instead of pretending the finite boundary is canonical.'
          ]
        }
      ],
      takeaway: 'Penrose order can be read globally from a pentagrid, locally from matching rules, or recursively through phi-inflation.'
    },
    {
      id: '03',
      file: '03-icosahedral-diffraction-and-discovery.html',
      title: 'Icosahedral Diffraction and Discovery',
      shortTitle: 'Icosahedral / diffraction',
      subtitle: 'Five-fold axes, H3/H4 arithmetic, pure-point diffraction, and Shechtman belong in one arc: order without a 3D translation lattice.',
      tags: 'H3 / H4 / Bragg peaks / Shechtman',
      act: 'Act II',
      figure: 'icosahedron',
      sections: [
        {
          kicker: 'Restriction',
          heading: 'Five-fold rotation breaks periodic lattices',
          paragraphs: [
            'For a rotation preserving a three-dimensional periodic lattice, the matrix trace must be an integer. A rotation of order n around an axis has trace 1 + 2 cos(2*pi/n).',
            'Orders 1, 2, 3, 4, and 6 pass this integer test. Order 5 gives &phi;, which is not an integer. The icosahedron still has five-fold axes, so periodicity is the thing that must give.'
          ]
        },
        {
          kicker: 'Substrate',
          heading: 'The arithmetic source is icosian first',
          paragraphs: [
            'The 120 vertices of the 600-cell form the H4 symmetry language behind the icosian story. The in-house Elser-Sloane substrate is best labeled as a Hurwitz-golden Galois-pair lattice.',
            'E8 is nearby and useful through icosian arithmetic, but it should not be named as the projected source lattice for this model set.'
          ]
        },
        {
          kicker: 'How order is seen',
          heading: 'Sharp peaks do not require periodic spacing',
          paragraphs: [
            'An icosahedral quasicrystal can keep long-range orientational order without a three-dimensional translation lattice. Its diffraction has sharp peaks, but those peaks are indexed by a higher-rank module.',
            'A finite image only shows the brightest part of that module. Changing the acceptance window changes the amplitude envelope more than the algebraic set of candidate peak positions.'
          ]
        },
        {
          kicker: 'Historical test',
          heading: 'The pattern came before the accepted definition',
          paragraphs: [
            'Dan Shechtman observed an Al-Mn alloy diffraction pattern in 1982 with ten-fold symmetry. The 1984 paper reported long-range orientational order and no translational symmetry.',
            'The years of resistance mattered because the old definition tied crystal order to periodicity. The discovery made long-range order and periodic translation come apart.'
          ]
        },
        {
          kicker: 'Rival explanation',
          heading: 'Twinning is not the same signal',
          paragraphs: [
            'Multiple twinning can fake a star-like view by overlaying several periodic domains. A quasicrystal produces one coherent non-crystallographic module instead.',
            'The comparison below is schematic and rights-safe. It is meant to teach the distinction, not reproduce a copyrighted electron-diffraction plate.'
          ]
        }
      ],
      takeaway: 'Icosahedral symmetry is impossible for a periodic 3D lattice, but natural for an aperiodic model set whose diffraction has sharp non-crystallographic peaks.'
    },
    {
      id: '04',
      file: '04-beyond-cut-and-project.html',
      title: 'Beyond Cut-and-Project',
      shortTitle: 'Beyond CP',
      subtitle: 'Substitutions, matching rules, Hat, and Spectre show where the model-set lens stops being the whole field.',
      tags: 'definitions / Wang tiles / Hat / Spectre',
      act: 'Act II',
      figure: 'definitions',
      sections: [
        {
          kicker: 'Four doors',
          heading: 'Quasicrystal is a family of related definitions',
          paragraphs: [
            'The earlier articles used regular cut-and-project model sets as the working definition because they are computational and visual. That choice should now be made explicit.',
            'Other routes matter: substitution fixed points, matching-rule tilings, and diffraction-first definitions. For important examples these agree under conditions. In full generality they are not interchangeable.'
          ]
        },
        {
          kicker: 'Local rules',
          heading: 'Equivalence is a theorem, not a slogan',
          paragraphs: [
            'A substitution tiling need not be a Euclidean-window model set. A model set need not come with simple matching rules. A pure-point diffraction claim often depends on hypotheses.',
            'Wang tiles and substitution examples keep the local-rule side of the field visible without pretending that a small toy set demonstrates undecidability.'
          ]
        },
        {
          kicker: 'Single tile frontier',
          heading: 'Hat and Spectre close famous problems and open structure questions',
          paragraphs: [
            'The Hat tilings solved the single-tile aperiodic problem when reflections are allowed. The Spectre followed with a chiral monotile that avoids reflection.',
            'Both tiles belong to a one-parameter polygon family: edges of length a and b alternate around a fixed sequence on a kite grid, and any (a, b) gives a valid combinatorial tiling. Hat sits at (1, sqrt 3), Turtle at (sqrt 3, 1), and Tile(1, 1) is the symmetric member that the Spectre then breaks chirally with curved edges.',
            'These tiles belong in the same aperiodic-order landscape as Penrose tilings, but they should not be presented as ordinary regular model sets unless that structure is actually proven for the object under discussion.'
          ]
        }
      ],
      takeaway: 'Cut-and-project is a powerful working lens, but aperiodic order also lives in substitutions, local rules, and monotile frontiers.'
    }
  ];

  var EXTRA_FIGURES = {
    '01': [
      {
        key: 'golden',
        section: 1,
        label: 'Figure 2.',
        caption: 'Integer coefficients give both a physical value and its Galois-conjugate internal value.'
      },
      {
        key: 'anatomy',
        section: 2,
        label: 'Figure 3.',
        caption: 'The same four-part scheme is shown for Fibonacci, Penrose, and icosahedral examples. Only the dimensions and window change.'
      },
      {
        key: 'internalDensity',
        section: 2,
        label: 'Figure 4.',
        caption: 'Internal projections of a finite square of lattice points get denser as the enumeration radius grows. This is why the internal window is a real gate, not a decorative annotation.'
      },
      {
        key: 'twoGate',
        section: 2,
        label: 'Figure 5.',
        caption: 'Physical and internal gates prune different failures. The model set is the intersection: visible points that also pass the hidden acceptance window.'
      },
      {
        key: 'phason',
        section: 3,
        label: 'Figure 6.',
        caption: 'Moving the internal window changes accepted vertices by boundary crossings. The readout separates crossings during the last slider move from differences relative to offset zero.'
      },
      {
        key: 'boundaryDistance',
        section: 3,
        label: 'Figure 7.',
        caption: 'The nearest boundary distance over offset. Dips to zero mark singular offsets where a lattice point sits exactly on the acceptance-window boundary.'
      }
    ],
    '02': [
      {
        key: 'penroseMatching',
        section: 1,
        label: 'Figure 2.',
        caption: 'A small matching-rule checker for Penrose rhombs. The local arc colors are a different interface to the same aperiodic order as the projection story.'
      },
      {
        key: 'orientationalOrder',
        section: 1,
        label: 'Figure 3.',
        caption: 'The projected patch has five preferred edge directions. A periodic square or triangular lattice cannot carry this five-fold orientation vocabulary.'
      },
      {
        key: 'penroseInflation',
        section: 2,
        label: 'Figure 4.',
        caption: 'A phi-scaled copy overlays the finite Penrose patch. Interior points line up first; boundary points expose the finite-patch caveat.'
      }
    ],
    '03': [
      {
        key: 'periodicAperiodic',
        section: 0,
        label: 'Figure 2.',
        caption: 'The escape hatch in one drawing: a periodic lattice can repeat, or a quasicrystal can keep five-fold orientational order, but not both in ordinary 3D periodic crystallography.'
      },
      {
        key: 'icosian',
        section: 1,
        label: 'Figure 3.',
        caption: 'The Galois-pair flow keeps the icosian substrate distinct from the nearby E8 realization.'
      },
      {
        key: 'h3h4Substrate',
        section: 1,
        label: 'Figure 4.',
        caption: 'The 600-cell/H4 cloud and a finite H3 slice view. This is a self-contained substrate scene, not an all-radius proof.'
      },
      {
        key: 'diffractionOracle',
        section: 2,
        label: 'Figure 5.',
        caption: 'The finite diffraction oracle keeps the candidate peak module fixed while window and threshold controls change the visible amplitudes.'
      },
      {
        key: 'shechtmanComparison',
        section: 4,
        label: 'Figure 6.',
        caption: 'Multiple twinning overlays periodic domains; a quasicrystal gives a coherent ten-fold module. The sketch is rights-safe and schematic.'
      }
    ],
    '04': [
      {
        key: 'substitutionWang',
        section: 1,
        label: 'Figure 2.',
        caption: 'Substitution and Wang-tile views emphasize local rules. They are adjacent to cut-and-project, but their equivalence claims need hypotheses.'
      },
      {
        key: 'hatPatch',
        section: 2,
        label: 'Figure 3.',
        caption: 'Hat, Hurtle, and Turtle are members of the Smith-Myers-Kaplan-Goodman-Strauss Tile(a,b) family. Move the slider to deform every tile in the cluster in lockstep; the Spectre is recovered by enabling chiral edge curves at the symmetric a = b = 1 point.'
      }
    ]
  };

  var FIGURES = {
    fibonacci: mountFibonacciProjection,
    anatomy: mountAnatomy,
    golden: mountGoldenArithmetic,
    pentagrid: mountPentagridPenrose,
    penrose: mountPenroseProjection,
    inflation: mountInflation,
    phason: mountPhasonSlider,
    icosahedron: mountIcosahedron,
    icosian: mountIcosianFlow,
    diffraction: mountDiffraction,
    diffractionOracle: mountDiffractionOracle,
    timeline: mountTimeline,
    definitions: mountDefinitions,
    hat: mountHatSpectre,
    internalDensity: mountInternalDensity,
    twoGate: mountTwoGatePruning,
    penroseMatching: mountPenroseMatching,
    penroseInflation: mountPenroseInflation,
    orientationalOrder: mountOrientationalOrder,
    boundaryDistance: mountBoundaryDistance,
    periodicAperiodic: mountPeriodicAperiodic,
    h3h4Substrate: mountH3H4Substrate,
    shechtmanComparison: mountShechtmanComparison,
    substitutionWang: mountSubstitutionWang,
    hatPatch: mountHatSpectrePatch
  };

  function $(id) { return document.getElementById(id); }
  function articleById(id) { return articles.filter(function (a) { return a.id === id; })[0]; }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function html(tag, attrs, content) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === 'class') el.className = attrs[k];
      else if (k === 'html') el.innerHTML = attrs[k];
      else el.setAttribute(k, attrs[k]);
    });
    if (content !== undefined) {
      if (Array.isArray(content)) content.forEach(function (c) { el.appendChild(c); });
      else if (typeof content === 'string') el.innerHTML = content;
      else el.appendChild(content);
    }
    return el;
  }
  function svg(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }
  function append(parent, tag, attrs, content) {
    var child = svg(tag, attrs || {});
    if (content !== undefined) child.textContent = content;
    parent.appendChild(child);
    return child;
  }
  function css(name, fallback) {
    var value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }
  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
  function round(x, n) {
    var p = Math.pow(10, n || 2);
    return Math.round(x * p) / p;
  }
  function sinc(x) {
    if (Math.abs(x) < 1e-6) return 1;
    return Math.sin(x) / x;
  }
  function seeded(seed) {
    var s = seed >>> 0;
    return function () {
      s = (1664525 * s + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function mountIndex(rootId) {
    var root = typeof rootId === 'string' ? $(rootId) : rootId;
    clear(root);
    var wrap = html('div', { class: 'article' });
    wrap.appendChild(html('nav', { class: 'back-links' }, '<a href="../index.html">All series</a><span class="sep">/</span><a href="../parallel-coordinates/17-quasicrystals.html">Earlier quasicrystal chapter</a>'));
    wrap.appendChild(html('header', {}, [
      html('div', { class: 'eyebrow' }, 'Aperiodic order'),
      html('h1', {}, 'Quasicrystals from Lattice Projections'),
      html('p', { class: 'subtitle' }, 'Four interactive explainers about how periodic lattices in higher dimensions can produce non-repeating order, phason flips, sharp diffraction, and five-fold symmetry.')
    ]));
    var mark = html('div', { class: 'series-mark' });
    wrap.appendChild(mark);
    root.appendChild(wrap);
    drawSeriesMark(mark);

    wrap.appendChild(html('p', {}, 'The series starts with the Fibonacci tiling because every part of the construction can be drawn at once: an ambient lattice, a physical projection, an internal projection, a bounded window, and the phason offset that moves it. Later pages keep the same vocabulary while changing the dimension, symmetry, or definition.'));
    wrap.appendChild(html('p', {}, 'Act I builds the geometry of aperiodic order. Act II follows the same ideas into icosahedral diffraction, physical discovery, and the newer monotile frontier.'));

    appendAct(wrap, 'Act I', 'The geometry of aperiodic order', articles.slice(0, 2));
    appendAct(wrap, 'Act II', 'Higher dimensions and matter', articles.slice(2));

    wrap.appendChild(html('div', { class: 'footer' }, '<p>Source grounding lives in <code>plans/quasicrystals</code>. The current implementation uses standalone finite figures; squishy-thing embeds remain the deeper follow-up.</p>'));
  }

  function appendAct(wrap, label, title, list) {
    wrap.appendChild(html('div', { class: 'act-heading' }, label + ' / ' + title));
    var cards = html('div', { class: 'card-list' });
    list.forEach(function (a) {
      var card = html('a', { class: 'card', href: a.file });
      var thumb = html('div', { class: 'card-thumb', id: 'thumb-' + a.id });
      var body = html('div');
      body.appendChild(html('div', { class: 'card-number' }, a.id));
      body.appendChild(html('div', { class: 'card-title' }, a.title));
      body.appendChild(html('p', { class: 'card-desc' }, a.subtitle));
      body.appendChild(html('div', { class: 'card-tags' }, a.tags));
      card.appendChild(thumb);
      card.appendChild(body);
      cards.appendChild(card);
    });
    wrap.appendChild(cards);
    list.forEach(function (a) { drawThumb($('thumb-' + a.id), a.id); });
  }

  function mountArticle(id, rootId) {
    var root = typeof rootId === 'string' ? $(rootId) : (rootId || $('article-root'));
    var a = articleById(id);
    clear(root);
    document.title = a.title + ' - Aperiodic Order';

    var wrap = html('div', { class: 'article' });
    var prev = articles[articles.indexOf(a) - 1];
    var next = articles[articles.indexOf(a) + 1];
    wrap.appendChild(html('nav', { class: 'back-links' }, '<a href="index.html">Quasicrystals</a><span class="sep">/</span><a href="../index.html">All series</a>'));
    wrap.appendChild(html('header', {}, [
      html('div', { class: 'eyebrow' }, a.act + ' / ' + a.id),
      html('h1', {}, a.title),
      html('p', { class: 'subtitle' }, a.subtitle)
    ]));

    a.sections.forEach(function (section, i) {
      wrap.appendChild(html('div', { class: 'section-kicker' }, section.kicker));
      wrap.appendChild(html('h2', {}, section.heading));
      section.paragraphs.forEach(function (p) { wrap.appendChild(html('p', {}, p)); });
      if (i === 0) appendArticleFigure(wrap, a.figure, 'Figure 1.', captionFor(a.figure));
      appendExtraFigures(wrap, a.id, i);
    });

    wrap.appendChild(html('p', {}, '<strong>Reader takeaway.</strong> ' + a.takeaway));
    var nav = html('div', { class: 'next-prev' });
    nav.appendChild(prev ? html('a', { href: prev.file }, '<span class="label">Previous</span>' + prev.shortTitle) : html('a', { href: 'index.html' }, '<span class="label">Series</span>Index'));
    nav.appendChild(next ? html('a', { href: next.file }, '<span class="label">Next</span>' + next.shortTitle) : html('a', { href: 'index.html' }, '<span class="label">Series</span>Index'));
    wrap.appendChild(nav);
    wrap.appendChild(html('div', { class: 'footer' }, '<p>Part of <a href="index.html">Aperiodic Order: Quasicrystals from Lattice Projections</a>. Built with the Moonshine explainer style.</p>'));
    root.appendChild(wrap);
  }

  function appendExtraFigures(wrap, articleId, sectionIndex) {
    (EXTRA_FIGURES[articleId] || []).forEach(function (item) {
      if (item.section === sectionIndex) appendArticleFigure(wrap, item.key, item.label, item.caption);
    });
  }

  function appendArticleFigure(wrap, key, label, caption) {
    var fig = html('div', { class: 'figure figure-wide' });
    var figMount = html('div');
    fig.appendChild(figMount);
    fig.appendChild(html('div', { class: 'figure-caption' }, '<span class="figure-label">' + label + '</span> ' + caption));
    wrap.appendChild(fig);
    FIGURES[key](figMount);
  }

  function captionFor(key) {
    return {
      fibonacci: 'Change the slope and window width to see which lattice points survive the strip and what tile gaps appear below.',
      anatomy: 'The same four-part scheme is shown for Fibonacci, Penrose, and icosahedral examples. Only the dimensions and window change.',
      golden: 'Integer coefficients give both a physical value and its Galois-conjugate internal value.',
      pentagrid: 'A de Bruijn pentagrid on the left and the corresponding finite five-direction projected patch on the right. The phase control shifts the grid families.',
      penrose: 'A finite five-direction projection patch. The drawing names the construction as a Z5 star-basis model, not an E8 slice.',
      inflation: 'Iterating the Fibonacci substitution makes the count ratio approach phi while preserving a two-letter tile vocabulary.',
      phason: 'Moving the internal window changes accepted vertices by boundary crossings. The highlighted points are flips relative to offset zero.',
      icosahedron: 'The icosahedron has 5-fold, 3-fold, and 2-fold axis classes, while the trace test rules out 5-fold rotation for periodic 3D lattices.',
      icosian: 'The Galois-pair flow keeps the icosian substrate distinct from the nearby E8 realization.',
      diffraction: 'A schematic comparison of periodic, random, and quasiperiodic peak sets. The slider changes the internal-window envelope.',
      diffractionOracle: 'A live finite diffraction oracle. The peak module stays fixed while the window envelope and threshold change visible amplitudes.',
      timeline: 'Rights-safe schematic timeline and ten-fold diffraction sketch for the discovery story.',
      definitions: 'Four common definitions overlap under hypotheses but should not be collapsed into one unconditional claim.',
      hat: 'Hat and Spectre outlines from the Smith-Myers-Kaplan-Goodman-Strauss monotile family, shown as single-tile comparisons with an open-problem map.'
    }[key] || '';
  }

  function drawSeriesMark(container) {
    var W = 760, H = 210;
    clear(container);
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
    container.appendChild(s);
    var phys = css('--c-physical', '#c46f2f');
    var internal = css('--c-internal', '#1f7a8c');
    var win = css('--c-window', '#78a66f');
    var lattice = css('--c-lattice', '#353947');
    var gridXs = [];
    var gridYs = [];
    for (var x = 80; x <= 688; x += 38) {
      gridXs.push(x);
      append(s, 'line', { x1: x, y1: 25, x2: x, y2: 150, stroke: '#e5e5df', 'stroke-width': 1 });
    }
    for (var y = 32; y <= 144; y += 28) {
      gridYs.push(y);
      append(s, 'line', { x1: 60, y1: y, x2: 710, y2: y, stroke: '#e5e5df', 'stroke-width': 1 });
    }
    var angle = -0.38;
    var cx = 385, cy = 92;
    var ex = Math.cos(angle), ey = Math.sin(angle);
    var px = -ey, py = ex;
    var len = 340, hw = 30;
    var poly = [
      [cx - len * ex + hw * px, cy - len * ey + hw * py],
      [cx + len * ex + hw * px, cy + len * ey + hw * py],
      [cx + len * ex - hw * px, cy + len * ey - hw * py],
      [cx - len * ex - hw * px, cy - len * ey - hw * py]
    ].map(function (p) { return p.join(','); }).join(' ');
    append(s, 'polygon', { points: poly, fill: win, opacity: 0.14, stroke: win, 'stroke-width': 1.5 });
    append(s, 'line', { x1: cx - len * ex, y1: cy - len * ey, x2: cx + len * ex, y2: cy + len * ey, stroke: phys, 'stroke-width': 3 });
    append(s, 'line', { x1: cx - 95 * px, y1: cy - 95 * py, x2: cx + 95 * px, y2: cy + 95 * py, stroke: internal, 'stroke-width': 2, 'stroke-dasharray': '5 4' });
    gridYs.forEach(function (gy) {
      gridXs.forEach(function (gx) {
        var dist = Math.abs((gx - cx) * px + (gy - cy) * py);
        append(s, 'circle', { cx: gx, cy: gy, r: dist < hw ? 3.8 : 2.4, fill: dist < hw ? phys : lattice, opacity: dist < hw ? 0.88 : 0.22 });
      });
    });
    append(s, 'text', { x: 62, y: 184, fill: phys, 'font-size': 13, 'font-weight': 700 }, 'physical projection');
    append(s, 'text', { x: 245, y: 184, fill: internal, 'font-size': 13, 'font-weight': 700 }, 'internal coordinate');
    append(s, 'text', { x: 425, y: 184, fill: win, 'font-size': 13, 'font-weight': 700 }, 'acceptance window');
    append(s, 'text', { x: 590, y: 184, fill: lattice, 'font-size': 13, 'font-weight': 700 }, 'ambient lattice');
  }

  function drawThumb(container, id) {
    if (!container) return;
    clear(container);
    var canvas = document.createElement('canvas');
    var size = 80, dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#f5f6f3';
    ctx.fillRect(0, 0, size, size);
    var P = '#c46f2f', I = '#1f7a8c', W = '#78a66f', D = '#353947', G = '#b9942f';
    if (id === '01') {
      ctx.strokeStyle = '#d9dbd2';
      for (var x = 8; x <= 72; x += 10) { ctx.beginPath(); ctx.moveTo(x, 8); ctx.lineTo(x, 52); ctx.stroke(); }
      for (var y = 8; y <= 52; y += 10) { ctx.beginPath(); ctx.moveTo(8, y); ctx.lineTo(72, y); ctx.stroke(); }
      ctx.save();
      ctx.translate(40, 30);
      ctx.rotate(-0.48);
      ctx.fillStyle = W;
      ctx.globalAlpha = 0.18;
      ctx.fillRect(-42, -9, 84, 18);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = P;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-42, 0); ctx.lineTo(42, 0); ctx.stroke();
      ctx.strokeStyle = I;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(0, 24); ctx.stroke();
      ctx.restore();
      ctx.setLineDash([]);
      for (var i = 0; i < 8; i++) {
        ctx.fillStyle = i % 3 === 0 ? P : i % 3 === 1 ? I : G;
        ctx.beginPath(); ctx.arc(12 + i * 8, 66, i % 2 ? 2.1 : 3.3, 0, Math.PI * 2); ctx.fill();
      }
    } else if (id === '02') {
      ctx.save();
      ctx.translate(40, 40);
      var colors = [P, I, W, G, '#6e5ca8'];
      for (var k = 0; k < 5; k++) {
        var a = -Math.PI / 2 + k * 2 * Math.PI / 5;
        var nx = Math.cos(a), ny = Math.sin(a);
        var tx = -ny, ty = nx;
        ctx.strokeStyle = colors[k];
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.35;
        for (var j = -2; j <= 2; j++) {
          ctx.beginPath();
          ctx.moveTo(nx * j * 10 - tx * 44, ny * j * 10 - ty * 44);
          ctx.lineTo(nx * j * 10 + tx * 44, ny * j * 10 + ty * 44);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = P;
      ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
      for (var r = 13; r <= 30; r += 8) {
        for (var q = 0; q < 10; q += 2) {
          var b = q * Math.PI * 2 / 10 + r * 0.02;
          ctx.fillStyle = q % 4 ? I : G;
          ctx.beginPath(); ctx.arc(r * Math.cos(b), r * Math.sin(b), 1.6, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();
    } else if (id === '03') {
      ctx.save();
      ctx.translate(40, 40);
      for (var a3 = 0; a3 < Math.PI * 2; a3 += Math.PI / 5) {
        ctx.strokeStyle = '#d4d7cf';
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(32 * Math.cos(a3), 32 * Math.sin(a3)); ctx.stroke();
      }
      for (var r3 = 9; r3 <= 31; r3 += 7) {
        for (var p = 0; p < 10; p++) {
          var ang = p * Math.PI * 2 / 10 + (r3 % 2) * Math.PI / 10;
          ctx.fillStyle = p % 2 ? P : I;
          ctx.globalAlpha = 0.26 + r3 / 46;
          ctx.beginPath(); ctx.arc(r3 * Math.cos(ang), r3 * Math.sin(ang), 1.8 + r3 / 18, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = D;
      ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else {
      function tile(x, y, edgeColors) {
        ctx.fillStyle = '#fbfbf8';
        ctx.strokeStyle = '#d4d7cf';
        ctx.lineWidth = 1;
        ctx.fillRect(x, y, 18, 18);
        ctx.strokeRect(x, y, 18, 18);
        ctx.lineWidth = 3;
        ctx.strokeStyle = edgeColors[0]; ctx.beginPath(); ctx.moveTo(x + 2, y + 1); ctx.lineTo(x + 16, y + 1); ctx.stroke();
        ctx.strokeStyle = edgeColors[1]; ctx.beginPath(); ctx.moveTo(x + 17, y + 2); ctx.lineTo(x + 17, y + 16); ctx.stroke();
        ctx.strokeStyle = edgeColors[2]; ctx.beginPath(); ctx.moveTo(x + 16, y + 17); ctx.lineTo(x + 2, y + 17); ctx.stroke();
        ctx.strokeStyle = edgeColors[3]; ctx.beginPath(); ctx.moveTo(x + 1, y + 16); ctx.lineTo(x + 1, y + 2); ctx.stroke();
      }
      tile(8, 9, [P, I, W, G]);
      tile(54, 9, [I, W, G, P]);
      tile(8, 53, [W, P, I, G]);
      tile(54, 53, [G, W, P, I]);
      function poly(points, cx, cy, scale, color, alpha) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        points.forEach(function (pnt, idx) {
          if (idx) ctx.lineTo(pnt[0], pnt[1]);
          else ctx.moveTo(pnt[0], pnt[1]);
        });
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
      }
      poly([[-1.4, -0.2], [-0.8, -0.8], [-0.2, -0.55], [0.2, -1.05], [0.8, -0.58], [1.35, -0.18], [0.9, 0.45], [0.25, 0.32], [0, 0.95], [-0.55, 0.45], [-1.15, 0.55]], 36, 42, 10, P, 0.62);
      poly([[-1.2, -0.1], [-0.55, -0.7], [0.15, -0.48], [0.75, -0.8], [1.25, -0.16], [0.92, 0.52], [0.2, 0.42], [-0.18, 0.95], [-0.72, 0.38]], 48, 39, 8, I, 0.52);
    }
  }

  function basisForSlope(slope) {
    var n = Math.hypot(1, slope);
    var par = [1 / n, slope / n];
    var perp = [-slope / n, 1 / n];
    return { par: par, perp: perp };
  }

  function enumerateFibonacci(slope, halfWidth, offset, limit) {
    var b = basisForSlope(slope);
    var pts = [];
    for (var i = -limit; i <= limit; i++) {
      for (var j = -limit; j <= limit; j++) {
        var p = i * b.par[0] + j * b.par[1];
        var q = i * b.perp[0] + j * b.perp[1];
        var accepted = Math.abs(q + offset) <= halfWidth;
        pts.push({ i: i, j: j, x: i, y: j, par: p, perp: q, accepted: accepted, key: i + ',' + j });
      }
    }
    return pts;
  }

  function worldMap(W, H, xmin, xmax, ymin, ymax, pad) {
    pad = pad || 25;
    return function (x, y) {
      return [
        pad + (x - xmin) / (xmax - xmin) * (W - 2 * pad),
        H - pad - (y - ymin) / (ymax - ymin) * (H - 2 * pad)
      ];
    };
  }

  function mountFibonacciProjection(container) {
    var state = { slope: 1 / phi, halfWidth: canonicalHalfWidth, offset: 0 };
    container.appendChild(html('div', { class: 'controls' }, [
      html('label', {}, 'slope <input type="range" min="0.38" max="1.05" step="0.005" value="' + state.slope + '"><span class="value" data-v="slope"></span>'),
      html('label', {}, 'window <input type="range" min="0.28" max="1.15" step="0.005" value="' + state.halfWidth + '"><span class="value" data-v="width"></span>'),
      html('button', { type: 'button' }, 'reset')
    ]));
    var target = html('div');
    var seq = html('div', { class: 'figure-caption' });
    container.appendChild(target);
    container.appendChild(seq);
    var ranges = container.querySelectorAll('input');
    var reset = container.querySelector('button');
    ranges[0].addEventListener('input', function (e) { state.slope = +e.target.value; render(); });
    ranges[1].addEventListener('input', function (e) { state.halfWidth = +e.target.value; render(); });
    reset.addEventListener('click', function () {
      state.slope = 1 / phi;
      state.halfWidth = canonicalHalfWidth;
      ranges[0].value = state.slope;
      ranges[1].value = state.halfWidth;
      render();
    });
    function render() {
      container.querySelector('[data-v="slope"]').textContent = round(state.slope, 3);
      container.querySelector('[data-v="width"]').textContent = round(state.halfWidth, 3);
      var result = drawFibonacciScene(target, state, { phason: false });
      seq.innerHTML = result.summary;
    }
    render();
  }

  function drawFibonacciScene(target, state, options) {
    options = options || {};
    clear(target);
    var W = 920, H = 540;
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
    target.appendChild(s);
    var map = worldMap(W, H - 110, -8, 8, -5.8, 5.8, 30);
    var b = basisForSlope(state.slope);
    var extent = 10.5;
    var center = [-state.offset * b.perp[0], -state.offset * b.perp[1]];
    var poly = [
      [center[0] - extent * b.par[0] + state.halfWidth * b.perp[0], center[1] - extent * b.par[1] + state.halfWidth * b.perp[1]],
      [center[0] + extent * b.par[0] + state.halfWidth * b.perp[0], center[1] + extent * b.par[1] + state.halfWidth * b.perp[1]],
      [center[0] + extent * b.par[0] - state.halfWidth * b.perp[0], center[1] + extent * b.par[1] - state.halfWidth * b.perp[1]],
      [center[0] - extent * b.par[0] - state.halfWidth * b.perp[0], center[1] - extent * b.par[1] - state.halfWidth * b.perp[1]]
    ].map(function (p) { return map(p[0], p[1]).join(','); }).join(' ');
    append(s, 'polygon', { points: poly, fill: css('--c-window', '#78a66f'), opacity: 0.16, stroke: css('--c-window', '#78a66f'), 'stroke-width': 1.4 });
    for (var gx = -8; gx <= 8; gx++) {
      var a = map(gx, -6), z = map(gx, 6);
      append(s, 'line', { x1: a[0], y1: a[1], x2: z[0], y2: z[1], stroke: '#e6e6df', 'stroke-width': 1 });
    }
    for (var gy = -5; gy <= 5; gy++) {
      var l = map(-8, gy), r = map(8, gy);
      append(s, 'line', { x1: l[0], y1: l[1], x2: r[0], y2: r[1], stroke: '#e6e6df', 'stroke-width': 1 });
    }
    var lineA = map(-extent * b.par[0], -extent * b.par[1]);
    var lineB = map(extent * b.par[0], extent * b.par[1]);
    append(s, 'line', { x1: lineA[0], y1: lineA[1], x2: lineB[0], y2: lineB[1], stroke: css('--c-physical', '#c46f2f'), 'stroke-width': 2.6 });
    var intA = map(-4.2 * b.perp[0], -4.2 * b.perp[1]);
    var intB = map(4.2 * b.perp[0], 4.2 * b.perp[1]);
    append(s, 'line', { x1: intA[0], y1: intA[1], x2: intB[0], y2: intB[1], stroke: css('--c-internal', '#1f7a8c'), 'stroke-width': 1.8, 'stroke-dasharray': '5 4' });

    var pts = enumerateFibonacci(state.slope, state.halfWidth, state.offset, 8);
    var base = options.phason ? enumerateFibonacci(state.slope, state.halfWidth, 0, 8) : [];
    var baseAccepted = {};
    base.forEach(function (p) { if (p.accepted) baseAccepted[p.key] = true; });

    pts.forEach(function (p) {
      var xy = map(p.x, p.y);
      var changed = options.phason && p.accepted !== !!baseAccepted[p.key];
      append(s, 'circle', {
        cx: xy[0], cy: xy[1],
        r: p.accepted ? (changed ? 5.2 : 3.8) : 2.25,
        fill: p.accepted ? (changed ? css('--c-boundary', '#b44a3f') : css('--c-physical', '#c46f2f')) : css('--c-lattice', '#353947'),
        opacity: p.accepted ? 0.9 : 0.22
      });
      if (p.accepted) {
        var q = map(p.par * b.par[0], p.par * b.par[1]);
        append(s, 'line', { x1: xy[0], y1: xy[1], x2: q[0], y2: q[1], stroke: css('--c-physical', '#c46f2f'), 'stroke-width': 0.75, opacity: 0.25 });
        append(s, 'circle', { cx: q[0], cy: q[1], r: 2.6, fill: css('--c-physical', '#c46f2f'), opacity: 0.9 });
      }
    });

    var accepted = pts.filter(function (p) { return p.accepted && p.par > -7.5 && p.par < 7.5; }).sort(function (a, b) { return a.par - b.par; });
    var gaps = [];
    for (var i = 1; i < accepted.length; i++) gaps.push(accepted[i].par - accepted[i - 1].par);
    var minGap = Math.min.apply(null, gaps);
    var maxGap = Math.max.apply(null, gaps);
    var y0 = H - 75, x0 = 55, x1 = W - 55;
    append(s, 'line', { x1: x0, y1: y0, x2: x1, y2: y0, stroke: '#d8dacf', 'stroke-width': 1.5 });
    var parMin = accepted.length ? accepted[0].par : -1;
    var parMax = accepted.length ? accepted[accepted.length - 1].par : 1;
    function tx(v) { return x0 + (v - parMin) / (parMax - parMin || 1) * (x1 - x0); }
    for (var g = 0; g < gaps.length; g++) {
      var xa = tx(accepted[g].par);
      var xb = tx(accepted[g + 1].par);
      var long = gaps[g] > (minGap + maxGap) / 2;
      append(s, 'rect', { x: xa, y: y0 - 11, width: Math.max(1, xb - xa), height: 22, fill: long ? css('--c-gold', '#b9942f') : css('--c-internal', '#1f7a8c'), opacity: 0.35 });
      append(s, 'line', { x1: xa, y1: y0 - 14, x2: xa, y2: y0 + 14, stroke: long ? css('--c-gold', '#b9942f') : css('--c-internal', '#1f7a8c'), 'stroke-width': 1.5 });
    }
    append(s, 'text', { x: 55, y: H - 35, fill: css('--text-2', '#565a68'), 'font-size': 12 }, 'projected one-dimensional tiling');
    append(s, 'text', { x: 58, y: 28, fill: css('--c-physical', '#c46f2f'), 'font-size': 12, 'font-weight': 700 }, 'physical line');
    append(s, 'text', { x: 58, y: 46, fill: css('--c-internal', '#1f7a8c'), 'font-size': 12, 'font-weight': 700 }, 'internal direction');

    var unique = [];
    gaps.forEach(function (gap) {
      if (!unique.some(function (u) { return Math.abs(u - gap) < 0.025; })) unique.push(gap);
    });
    unique.sort(function (a, b) { return a - b; });
    var ratio = unique.length >= 2 ? unique[unique.length - 1] / unique[0] : NaN;
    var changedCount = 0;
    if (options.phason) {
      pts.forEach(function (p) {
        if (p.accepted !== !!baseAccepted[p.key]) changedCount++;
      });
    }
    var crossingPrefix = '';
    if (options.phason && typeof options.crossingCount === 'number') {
      crossingPrefix = 'Last slider move crossed ' + options.crossingCount + ' boundary event' + (options.crossingCount === 1 ? '' : 's') + '. ';
    }
    return {
      summary: options.phason
        ? crossingPrefix + 'Offset ' + round(state.offset, 3) + ' differs from offset zero in ' + changedCount + ' accepted-state decisions in this finite lattice window.'
        : 'Current finite view has ' + unique.length + ' visible gap length' + (unique.length === 1 ? '' : 's') + (unique.length >= 2 ? ', with largest/smallest ratio about ' + round(ratio, 3) + '.' : '.')
    };
  }

  function mountPhasonSlider(container) {
    var state = { slope: 1 / phi, halfWidth: canonicalHalfWidth, offset: 0.32 };
    var lastCrossings = 0;
    container.appendChild(html('div', { class: 'controls' }, [
      html('label', {}, 'offset <input type="range" min="-1.05" max="1.05" step="0.005" value="' + state.offset + '"><span class="value" data-v="offset"></span>'),
      html('button', { type: 'button' }, 'center')
    ]));
    var target = html('div');
    var seq = html('div', { class: 'figure-caption' });
    container.appendChild(target);
    container.appendChild(seq);
    var range = container.querySelector('input');
    range.addEventListener('input', function (e) {
      var next = +e.target.value;
      lastCrossings = countBoundaryCrossings(state.slope, state.halfWidth, state.offset, next, 8);
      state.offset = next;
      render();
    });
    container.querySelector('button').addEventListener('click', function () {
      lastCrossings = countBoundaryCrossings(state.slope, state.halfWidth, state.offset, 0, 8);
      state.offset = 0;
      range.value = 0;
      render();
    });
    function render() {
      container.querySelector('[data-v="offset"]').textContent = round(state.offset, 3);
      var result = drawFibonacciScene(target, state, { phason: true, crossingCount: lastCrossings });
      seq.innerHTML = result.summary;
    }
    render();
  }

  function boundaryDistance(perp, offset, halfWidth) {
    return halfWidth - Math.abs(perp + offset);
  }

  function countBoundaryCrossings(slope, halfWidth, fromOffset, toOffset, limit) {
    var pts = enumerateFibonacci(slope, halfWidth, 0, limit);
    var count = 0;
    pts.forEach(function (p) {
      var a = boundaryDistance(p.perp, fromOffset, halfWidth);
      var b = boundaryDistance(p.perp, toOffset, halfWidth);
      if (Math.abs(a) < 1e-9 || Math.abs(b) < 1e-9 || (a < 0 && b > 0) || (a > 0 && b < 0)) count++;
    });
    return count;
  }

  function mountBoundaryDistance(container) {
    var state = { offset: 0.32, slope: 1 / phi, halfWidth: canonicalHalfWidth };
    container.appendChild(html('div', { class: 'controls' }, [
      html('label', {}, 'offset <input type="range" min="-1.05" max="1.05" step="0.005" value="' + state.offset + '"><span class="value" data-v="offset"></span>')
    ]));
    var target = html('div');
    container.appendChild(target);
    container.querySelector('input').addEventListener('input', function (e) { state.offset = +e.target.value; draw(); });
    function draw() {
      container.querySelector('[data-v="offset"]').textContent = round(state.offset, 3);
      clear(target);
      var W = 880, H = 320;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      var pts = enumerateFibonacci(state.slope, state.halfWidth, 0, 8);
      var xs = [];
      for (var i = 0; i <= 220; i++) {
        var off = -1.05 + i * 2.1 / 220;
        var best = Infinity;
        pts.forEach(function (p) {
          best = Math.min(best, Math.abs(boundaryDistance(p.perp, off, state.halfWidth)));
        });
        xs.push({ offset: off, best: best });
      }
      var x0 = 58, x1 = W - 42, y0 = H - 58, y1 = 38;
      append(s, 'line', { x1: x0, y1: y0, x2: x1, y2: y0, stroke: '#d8dacf', 'stroke-width': 1.4 });
      append(s, 'line', { x1: x0, y1: y0, x2: x0, y2: y1, stroke: '#d8dacf', 'stroke-width': 1.4 });
      function xx(o) { return x0 + (o + 1.05) / 2.1 * (x1 - x0); }
      function yy(v) { return y0 - clamp(v / 0.22, 0, 1) * (y0 - y1); }
      var d = xs.map(function (p, i) { return (i ? 'L' : 'M') + xx(p.offset) + ' ' + yy(p.best); }).join(' ');
      append(s, 'path', { d: d, fill: 'none', stroke: css('--c-internal', '#1f7a8c'), 'stroke-width': 2.2 });
      xs.forEach(function (p, i) {
        if (i > 0 && i < xs.length - 1 && p.best < 0.004) {
          append(s, 'circle', { cx: xx(p.offset), cy: y0, r: 3.2, fill: css('--c-boundary', '#b44a3f'), opacity: 0.75 });
        }
      });
      append(s, 'line', { x1: xx(state.offset), y1: y0, x2: xx(state.offset), y2: y1, stroke: css('--c-physical', '#c46f2f'), 'stroke-width': 2, 'stroke-dasharray': '4 4' });
      var nearest = xs.reduce(function (best, p) {
        return Math.abs(p.offset - state.offset) < Math.abs(best.offset - state.offset) ? p : best;
      }, xs[0]);
      append(s, 'text', { x: x0, y: 22, fill: css('--text', '#1b1d2a'), 'font-size': 16, 'font-weight': 700 }, 'nearest boundary distance = ' + round(nearest.best, 4));
      append(s, 'text', { x: x0, y: H - 20, fill: css('--text-2', '#565a68'), 'font-size': 12 }, 'offset in internal space');
      append(s, 'text', { x: W - 42, y: H - 20, 'text-anchor': 'end', fill: css('--c-boundary', '#b44a3f'), 'font-size': 12 }, 'red ticks: sampled singular offsets');
    }
    draw();
  }

  function mountAnatomy(container) {
    var schemes = [
      { key: 'fib', label: 'Fibonacci', ambient: 'Z2', physical: 'line', internal: 'line', window: 'interval' },
      { key: 'penrose', label: 'Penrose', ambient: 'Z5', physical: 'plane', internal: '3-space', window: 'rhombic triacontahedron' },
      { key: 'h3', label: 'Icosahedral H3', ambient: 'Galois-pair module', physical: '3-space', internal: '5-space', window: 'product / 600-cell approximation' }
    ];
    var current = schemes[0];
    var controls = html('div', { class: 'controls segmented' });
    schemes.forEach(function (scheme, i) {
      var button = html('button', { type: 'button', class: i === 0 ? 'active' : '', 'aria-pressed': i === 0 ? 'true' : 'false' }, scheme.label);
      button.addEventListener('click', function () {
        current = scheme;
        Array.prototype.forEach.call(controls.querySelectorAll('button'), function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
        draw();
      });
      controls.appendChild(button);
    });
    container.appendChild(controls);
    var target = html('div');
    container.appendChild(target);
    function draw() {
      clear(target);
      var W = 880, H = 380;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      var boxes = [
        { x: 45, y: 70, w: 180, h: 92, title: 'Lambda', text: current.ambient, color: css('--c-lattice', '#353947') },
        { x: 350, y: 42, w: 185, h: 88, title: 'pi_parallel', text: current.physical, color: css('--c-physical', '#c46f2f') },
        { x: 350, y: 200, w: 185, h: 88, title: 'pi_perp', text: current.internal, color: css('--c-internal', '#1f7a8c') },
        { x: 640, y: 200, w: 185, h: 88, title: 'W', text: current.window, color: css('--c-window', '#78a66f') }
      ];
      boxes.forEach(function (b) {
        append(s, 'rect', { x: b.x, y: b.y, width: b.w, height: b.h, rx: 6, fill: '#fbfbf8', stroke: b.color, 'stroke-width': 1.6 });
        append(s, 'text', { x: b.x + 18, y: b.y + 31, fill: b.color, 'font-size': 14, 'font-weight': 700 }, b.title);
        append(s, 'text', { x: b.x + 18, y: b.y + 60, fill: css('--text', '#1b1d2a'), 'font-size': 18, 'font-weight': 700 }, b.text);
      });
      arrow(s, 225, 116, 350, 86, css('--c-physical', '#c46f2f'));
      arrow(s, 225, 116, 350, 244, css('--c-internal', '#1f7a8c'));
      arrow(s, 535, 244, 640, 244, css('--c-window', '#78a66f'));
      arrow(s, 730, 200, 465, 130, css('--c-window', '#78a66f'), '5 4');
      append(s, 'text', { x: 50, y: 235, fill: css('--text-2', '#565a68'), 'font-size': 14 }, 'Keep p in Lambda only when pi_perp(p) lies in W.');
      append(s, 'text', { x: 50, y: 260, fill: css('--text-2', '#565a68'), 'font-size': 14 }, 'Then pi_parallel(p) becomes a point of the model set.');
    }
    draw();
  }

  function mountInternalDensity(container) {
    var state = { radius: 5 };
    container.appendChild(html('div', { class: 'controls' }, [
      html('label', {}, 'enumeration radius <input type="range" min="2" max="10" step="1" value="' + state.radius + '"><span class="value" data-v="radius"></span>')
    ]));
    var target = html('div');
    var note = html('div', { class: 'figure-caption' });
    container.appendChild(target);
    container.appendChild(note);
    container.querySelector('input').addEventListener('input', function (e) { state.radius = +e.target.value; draw(); });
    function draw() {
      container.querySelector('[data-v="radius"]').textContent = state.radius;
      clear(target);
      var W = 880, H = 300;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      var pts = enumerateFibonacci(1 / phi, canonicalHalfWidth, 0, state.radius);
      var yAxis = 150, x0 = 58, x1 = W - 48;
      append(s, 'line', { x1: x0, y1: yAxis, x2: x1, y2: yAxis, stroke: '#d8dacf', 'stroke-width': 2 });
      append(s, 'rect', { x: x0 + 0.35 * (x1 - x0), y: yAxis - 30, width: 0.3 * (x1 - x0), height: 60, fill: css('--c-window', '#78a66f'), opacity: 0.14, stroke: css('--c-window', '#78a66f') });
      function tx(v) { return x0 + (v + 3) / 6 * (x1 - x0); }
      pts.forEach(function (p) {
        if (p.perp < -3 || p.perp > 3) return;
        var accepted = Math.abs(p.perp) <= canonicalHalfWidth;
        append(s, 'circle', {
          cx: tx(p.perp),
          cy: yAxis + ((p.i * 17 + p.j * 11) % 52) - 26,
          r: accepted ? 3.3 : 2.2,
          fill: accepted ? css('--c-window', '#78a66f') : css('--c-internal', '#1f7a8c'),
          opacity: accepted ? 0.78 : 0.34
        });
      });
      for (var t = -3; t <= 3; t++) {
        append(s, 'line', { x1: tx(t), y1: yAxis - 44, x2: tx(t), y2: yAxis + 44, stroke: '#eceee8', 'stroke-width': 1 });
        append(s, 'text', { x: tx(t), y: yAxis + 64, 'text-anchor': 'middle', fill: css('--muted', '#858998'), 'font-size': 11 }, t);
      }
      append(s, 'text', { x: x0, y: 42, fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, 'pi_perp(Z2) becomes visually dense in any bounded internal interval');
      append(s, 'text', { x: x0, y: 68, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'Finite radius: ' + state.radius + '. Green points pass the canonical Fibonacci window.');
      note.innerHTML = pts.length + ' lattice points sampled. ' + pts.filter(function (p) { return Math.abs(p.perp) <= canonicalHalfWidth; }).length + ' lie inside the window.';
    }
    draw();
  }

  function mountTwoGatePruning(container) {
    var state = { radius: 8, physical: 3.2, internal: canonicalHalfWidth };
    container.appendChild(html('div', { class: 'controls' }, [
      html('label', {}, 'radius <input type="range" min="3" max="11" step="1" value="' + state.radius + '"><span class="value" data-v="radius"></span>'),
      html('label', {}, 'physical span <input type="range" min="1.5" max="4.5" step="0.1" value="' + state.physical + '"><span class="value" data-v="physical"></span>')
    ]));
    var target = html('div');
    container.appendChild(target);
    var inputs = container.querySelectorAll('input');
    inputs[0].addEventListener('input', function (e) { state.radius = +e.target.value; draw(); });
    inputs[1].addEventListener('input', function (e) { state.physical = +e.target.value; draw(); });
    function draw() {
      container.querySelector('[data-v="radius"]').textContent = state.radius;
      container.querySelector('[data-v="physical"]').textContent = round(state.physical, 1);
      clear(target);
      var pts = enumerateFibonacci(1 / phi, state.internal, 0, state.radius);
      var groups = [
        { title: 'physical only', keep: function (p) { return Math.abs(p.par) <= state.physical; }, color: css('--c-physical', '#c46f2f') },
        { title: 'internal only', keep: function (p) { return Math.abs(p.perp) <= state.internal; }, color: css('--c-internal', '#1f7a8c') },
        { title: 'both gates', keep: function (p) { return Math.abs(p.par) <= state.physical && Math.abs(p.perp) <= state.internal; }, color: css('--c-window', '#78a66f') }
      ];
      var W = 880, H = 330;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      groups.forEach(function (g, gi) {
        var x = 65 + gi * 278, y = 70, w = 220, h = 180;
        append(s, 'rect', { x: x, y: y, width: w, height: h, rx: 6, fill: '#fbfbf8', stroke: '#dedfd8' });
        var kept = pts.filter(g.keep);
        kept.slice(0, 260).forEach(function (p) {
          var px = x + w / 2 + p.par * 22;
          var py = y + h / 2 - p.perp * 42;
          if (px < x + 8 || px > x + w - 8 || py < y + 8 || py > y + h - 8) return;
          append(s, 'circle', { cx: px, cy: py, r: 2.4, fill: g.color, opacity: 0.62 });
        });
        append(s, 'text', { x: x, y: y - 22, fill: g.color, 'font-size': 15, 'font-weight': 700 }, g.title);
        append(s, 'text', { x: x, y: y + h + 28, fill: css('--text-2', '#565a68'), 'font-size': 13 }, kept.length + ' kept of ' + pts.length);
      });
      append(s, 'text', { x: 65, y: 38, fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, 'The useful set is the intersection of two filters');
      append(s, 'text', { x: 65, y: 306, fill: css('--text-2', '#565a68'), 'font-size': 12 }, 'Coordinates in each panel: horizontal = physical projection, vertical = internal projection.');
    }
    draw();
  }

  function arrow(s, x1, y1, x2, y2, color, dash) {
    var id = 'arrow-' + Math.random().toString(36).slice(2);
    var defs = s.querySelector('defs') || append(s, 'defs', {});
    var marker = append(defs, 'marker', { id: id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' });
    append(marker, 'path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: color });
    append(s, 'line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: color, 'stroke-width': 2, 'stroke-dasharray': dash || '', 'marker-end': 'url(#' + id + ')' });
  }

  function mountGoldenArithmetic(container) {
    var state = { a: 1, b: 2 };
    container.appendChild(html('div', { class: 'controls' }, [
      html('label', {}, 'a <input type="range" min="-4" max="4" step="1" value="' + state.a + '"><span class="value" data-v="a"></span>'),
      html('label', {}, 'b <input type="range" min="-4" max="4" step="1" value="' + state.b + '"><span class="value" data-v="b"></span>')
    ]));
    var target = html('div');
    container.appendChild(target);
    var ranges = container.querySelectorAll('input');
    ranges[0].addEventListener('input', function (e) { state.a = +e.target.value; draw(); });
    ranges[1].addEventListener('input', function (e) { state.b = +e.target.value; draw(); });
    function draw() {
      container.querySelector('[data-v="a"]').textContent = state.a;
      container.querySelector('[data-v="b"]').textContent = state.b;
      clear(target);
      var W = 860, H = 330;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      var x = state.a + state.b * phi;
      var sx = (state.a + state.b) - state.b * phi;
      numberLine(s, 70, 95, 720, -7, 7, x, css('--c-physical', '#c46f2f'), 'physical value a + b phi = ' + round(x, 3));
      numberLine(s, 70, 215, 720, -7, 7, sx, css('--c-internal', '#1f7a8c'), 'internal value sigma(x) = ' + round(sx, 3));
      append(s, 'text', { x: 70, y: 290, fill: css('--text', '#1b1d2a'), 'font-size': 18, 'font-weight': 700 }, 'sigma(a + b phi) = (a + b) - b phi');
      append(s, 'text', { x: 520, y: 290, fill: css('--text-2', '#565a68'), 'font-size': 14 }, 'current pair: (' + state.a + ', ' + state.b + ') -> (' + (state.a + state.b) + ', ' + (-state.b) + ')');
    }
    draw();
  }

  function numberLine(s, x, y, w, min, max, value, color, label) {
    append(s, 'line', { x1: x, y1: y, x2: x + w, y2: y, stroke: '#d8dacf', 'stroke-width': 2 });
    for (var t = min; t <= max; t++) {
      var tx = x + (t - min) / (max - min) * w;
      append(s, 'line', { x1: tx, y1: y - 7, x2: tx, y2: y + 7, stroke: '#cfd2c8', 'stroke-width': 1 });
      if (t % 2 === 0) append(s, 'text', { x: tx, y: y + 26, 'text-anchor': 'middle', fill: css('--muted', '#858998'), 'font-size': 11 }, t);
    }
    var vx = x + (clamp(value, min, max) - min) / (max - min) * w;
    append(s, 'circle', { cx: vx, cy: y, r: 8, fill: color });
    append(s, 'text', { x: x, y: y - 28, fill: color, 'font-size': 15, 'font-weight': 700 }, label);
  }

  function mountPenroseProjection(container) {
    var state = { width: 2.08 };
    container.appendChild(html('div', { class: 'controls' }, [
      html('label', {}, 'internal cutoff <input type="range" min="1.45" max="2.65" step="0.02" value="' + state.width + '"><span class="value" data-v="width"></span>')
    ]));
    var target = html('div');
    container.appendChild(target);
    container.querySelector('input').addEventListener('input', function (e) { state.width = +e.target.value; draw(); });
    function draw() {
      container.querySelector('[data-v="width"]').textContent = round(state.width, 2);
      clear(target);
      var W = 850, H = 470;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      var pts = penrosePoints(state.width);
      var scale = 52, cx = 425, cy = 230;
      var dirs = starDirs();
      dirs.forEach(function (d, i) {
        append(s, 'line', { x1: cx, y1: cy, x2: cx + 185 * d[0], y2: cy + 185 * d[1], stroke: i % 2 ? css('--c-internal', '#1f7a8c') : css('--c-physical', '#c46f2f'), 'stroke-width': 1, opacity: 0.55 });
      });
      for (var i = 0; i < pts.length; i++) {
        for (var j = i + 1; j < pts.length; j++) {
          var dist = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (dist > 0.58 && dist < 0.66) {
            append(s, 'line', { x1: cx + pts[i].x * scale, y1: cy + pts[i].y * scale, x2: cx + pts[j].x * scale, y2: cy + pts[j].y * scale, stroke: '#d9dbd2', 'stroke-width': 1 });
          }
        }
      }
      pts.forEach(function (p) {
        append(s, 'circle', { cx: cx + p.x * scale, cy: cy + p.y * scale, r: 2.5, fill: p.internal < state.width * 0.68 ? css('--c-physical', '#c46f2f') : css('--c-gold', '#b9942f'), opacity: 0.82 });
      });
      append(s, 'text', { x: 35, y: 38, fill: css('--text-2', '#565a68'), 'font-size': 13 }, pts.length + ' projected vertices in this finite cutoff');
      append(s, 'text', { x: 35, y: 60, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'Five star directions stand in for the classical Z5 construction.');
    }
    draw();
  }

  function starDirs() {
    return Array.from({ length: 5 }, function (_, i) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / 5;
      return [Math.cos(a), Math.sin(a)];
    });
  }

  function penrosePoints(width) {
    var dirs = starDirs();
    var pts = [];
    var seen = {};
    for (var a = -3; a <= 3; a++) for (var b = -3; b <= 3; b++) for (var c = -3; c <= 3; c++) for (var d = -3; d <= 3; d++) for (var e = -3; e <= 3; e++) {
      var n = [a, b, c, d, e];
      var mean = (a + b + c + d + e) / 5;
      var internal = Math.sqrt(n.reduce(function (sum, v) { return sum + (v - mean) * (v - mean); }, 0));
      var x = n.reduce(function (sum, v, i) { return sum + v * dirs[i][0]; }, 0);
      var y = n.reduce(function (sum, v, i) { return sum + v * dirs[i][1]; }, 0);
      if (internal < width && Math.hypot(x, y) < 4.25) {
        var key = x.toFixed(3) + ',' + y.toFixed(3);
        if (!seen[key]) {
          seen[key] = true;
          pts.push({ x: x, y: y, internal: internal });
        }
      }
    }
    return pts;
  }

  function mountPentagridPenrose(container) {
    var state = { phase: 0.18, rings: 4 };
    container.appendChild(html('div', { class: 'controls' }, [
      html('label', {}, 'grid phase <input type="range" min="-0.48" max="0.48" step="0.01" value="' + state.phase + '"><span class="value" data-v="phase"></span>'),
      html('label', {}, 'patch radius <input type="range" min="2" max="5" step="1" value="' + state.rings + '"><span class="value" data-v="rings"></span>')
    ]));
    var target = html('div');
    container.appendChild(target);
    var inputs = container.querySelectorAll('input');
    inputs[0].addEventListener('input', function (e) { state.phase = +e.target.value; draw(); });
    inputs[1].addEventListener('input', function (e) { state.rings = +e.target.value; draw(); });
    function draw() {
      container.querySelector('[data-v="phase"]').textContent = round(state.phase, 2);
      container.querySelector('[data-v="rings"]').textContent = state.rings;
      clear(target);
      var W = 900, H = 430;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      drawPentagridPanel(s, 230, 220, state.phase, state.rings);
      drawPentagridPatchPanel(s, 675, 220, state.phase, state.rings);
      append(s, 'text', { x: 230, y: 34, 'text-anchor': 'middle', fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, 'five de Bruijn grids');
      append(s, 'text', { x: 675, y: 34, 'text-anchor': 'middle', fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, 'dual five-direction patch');
      append(s, 'text', { x: 60, y: 402, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'The phase shifts all five line families. The right panel uses the same five star directions to draw the finite dual patch.');
    }
    draw();
  }

  function drawPentagridPanel(s, cx, cy, phase, rings) {
    var colors = [css('--c-physical', '#c46f2f'), css('--c-internal', '#1f7a8c'), css('--c-window', '#78a66f'), css('--c-gold', '#b9942f'), css('--c-violet', '#6e5ca8')];
    append(s, 'rect', { x: cx - 170, y: cy - 160, width: 340, height: 320, rx: 6, fill: '#fbfbf8', stroke: '#dedfd8' });
    for (var i = 0; i < 5; i++) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / 5;
      var nx = Math.cos(a), ny = Math.sin(a);
      var tx = -ny, ty = nx;
      for (var k = -rings; k <= rings; k++) {
        var off = (k + phase * Math.sin(i * 1.7)) * 32;
        var x = cx + nx * off, y = cy + ny * off;
        append(s, 'line', {
          x1: x - tx * 240, y1: y - ty * 240,
          x2: x + tx * 240, y2: y + ty * 240,
          stroke: colors[i],
          'stroke-width': k === 0 ? 1.8 : 1,
          opacity: k === 0 ? 0.7 : 0.32
        });
      }
    }
    append(s, 'circle', { cx: cx, cy: cy, r: 3.5, fill: css('--c-boundary', '#b44a3f') });
  }

  function drawPentagridPatchPanel(s, cx, cy, phase, rings) {
    append(s, 'rect', { x: cx - 170, y: cy - 160, width: 340, height: 320, rx: 6, fill: '#fbfbf8', stroke: '#dedfd8' });
    var pts = penrosePoints(1.72 + rings * 0.15);
    var dirs = starDirs();
    var scale = 38;
    for (var d = 0; d < dirs.length; d++) {
      append(s, 'line', { x1: cx - dirs[d][0] * 130, y1: cy - dirs[d][1] * 130, x2: cx + dirs[d][0] * 130, y2: cy + dirs[d][1] * 130, stroke: d % 2 ? css('--c-internal', '#1f7a8c') : css('--c-gold', '#b9942f'), 'stroke-width': 1.5, opacity: 0.35 });
    }
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dist = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (dist > 0.58 && dist < 0.66) {
          append(s, 'line', { x1: cx + pts[i].x * scale, y1: cy + pts[i].y * scale, x2: cx + pts[j].x * scale, y2: cy + pts[j].y * scale, stroke: '#d9dbd2', 'stroke-width': 1 });
        }
      }
    }
    pts.forEach(function (p) {
      var wobble = phase * 0.16;
      append(s, 'circle', { cx: cx + (p.x + wobble * Math.sin(p.y)) * scale, cy: cy + (p.y + wobble * Math.cos(p.x)) * scale, r: 2.2, fill: p.internal < 1.4 ? css('--c-physical', '#c46f2f') : css('--c-gold', '#b9942f'), opacity: 0.78 });
    });
  }

  function mountPenroseInflation(container) {
    var state = { blend: 1, width: 2.08 };
    container.appendChild(html('div', { class: 'controls' }, [
      html('label', {}, 'inflation overlay <input type="range" min="0" max="1" step="0.01" value="' + state.blend + '"><span class="value" data-v="blend"></span>'),
      html('label', {}, 'patch size <input type="range" min="1.7" max="2.45" step="0.02" value="' + state.width + '"><span class="value" data-v="width"></span>')
    ]));
    var target = html('div');
    container.appendChild(target);
    var inputs = container.querySelectorAll('input');
    inputs[0].addEventListener('input', function (e) { state.blend = +e.target.value; draw(); });
    inputs[1].addEventListener('input', function (e) { state.width = +e.target.value; draw(); });
    function draw() {
      container.querySelector('[data-v="blend"]').textContent = round(state.blend, 2);
      container.querySelector('[data-v="width"]').textContent = round(state.width, 2);
      clear(target);
      var W = 880, H = 390;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      var pts = penrosePoints(state.width);
      var scale = 50, cx = 430, cy = 185;
      append(s, 'rect', { x: 50, y: 32, width: 760, height: 285, rx: 6, fill: '#fbfbf8', stroke: '#dedfd8' });
      pts.forEach(function (p) {
        if (Math.hypot(p.x, p.y) > 4.1) return;
        append(s, 'circle', { cx: cx + p.x * scale, cy: cy + p.y * scale, r: 2.4, fill: css('--c-physical', '#c46f2f'), opacity: 0.3 });
      });
      var matched = 0;
      pts.forEach(function (p) {
        var sx = p.x / phi, sy = p.y / phi;
        var bx = p.x * (1 - state.blend) + sx * state.blend;
        var by = p.y * (1 - state.blend) + sy * state.blend;
        if (Math.hypot(bx, by) > 4.1) return;
        var near = pts.some(function (q) { return Math.hypot(q.x - sx, q.y - sy) < 0.075; });
        if (near) matched++;
        append(s, 'circle', { cx: cx + bx * scale, cy: cy + by * scale, r: near ? 3.5 : 2.4, fill: near ? css('--c-window', '#78a66f') : css('--c-gold', '#b9942f'), opacity: near ? 0.82 : 0.48 });
      });
      append(s, 'text', { x: 70, y: 62, fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, 'phi-inflation overlay');
      append(s, 'text', { x: 70, y: 90, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'Orange: finite patch. Green/gold: same points sliding toward the 1/phi-scaled copy.');
      append(s, 'text', { x: 70, y: 342, fill: css('--text-2', '#565a68'), 'font-size': 13 }, matched + ' scaled points land near existing vertices; boundary disagreement is expected.');
      append(s, 'text', { x: 70, y: 365, fill: css('--text', '#1b1d2a'), 'font-size': 16, 'font-weight': 700 }, 'scale factor = phi');
    }
    draw();
  }

  function mountPenroseMatching(container) {
    var state = { mode: 'valid' };
    var controls = html('div', { class: 'controls segmented' });
    [
      ['valid', 'matching join'],
      ['invalid', 'rule violation']
    ].forEach(function (item, i) {
      var b = html('button', { type: 'button', class: i === 0 ? 'active' : '', 'aria-pressed': i === 0 ? 'true' : 'false' }, item[1]);
      b.addEventListener('click', function () {
        state.mode = item[0];
        Array.prototype.forEach.call(controls.querySelectorAll('button'), function (x) {
          x.classList.remove('active');
          x.setAttribute('aria-pressed', 'false');
        });
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
        draw();
      });
      controls.appendChild(b);
    });
    container.appendChild(controls);
    var target = html('div');
    container.appendChild(target);
    function draw() {
      clear(target);
      var W = 860, H = 330;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      var gold = css('--c-gold', '#b9942f');
      var teal = css('--c-internal', '#1f7a8c');
      var red = css('--c-boundary', '#b44a3f');
      drawRhomb(s, 305, 150, 72, gold, 'thick rhomb');
      drawRhomb(s, 430, 150, 36, teal, 'thin rhomb');
      append(s, 'line', { x1: 367, y1: 80, x2: 367, y2: 220, stroke: state.mode === 'valid' ? gold : red, 'stroke-width': 5, 'stroke-linecap': 'round' });
      append(s, 'path', { d: 'M 318 114 Q 367 88 416 114', fill: 'none', stroke: gold, 'stroke-width': 4, 'stroke-linecap': 'round' });
      append(s, 'path', { d: state.mode === 'valid' ? 'M 318 186 Q 367 212 416 186' : 'M 318 186 Q 367 212 416 186', fill: 'none', stroke: state.mode === 'valid' ? gold : teal, 'stroke-width': 4, 'stroke-linecap': 'round' });
      append(s, 'text', { x: 585, y: 105, fill: css('--text', '#1b1d2a'), 'font-size': 18, 'font-weight': 700 }, state.mode === 'valid' ? 'local rule passes' : 'local rule fails');
      append(s, 'text', { x: 585, y: 138, fill: css('--text-2', '#565a68'), 'font-size': 14 }, state.mode === 'valid' ? 'Both decorations ask for the same edge color across the join.' : 'The geometry still touches, but the decorations disagree.');
      append(s, 'text', { x: 585, y: 169, fill: css('--text-2', '#565a68'), 'font-size': 14 }, 'This is a tiny checker, not a complete Penrose tiler.');
      append(s, 'text', { x: 55, y: 278, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'Matching rules are local constraints. Cut-and-project is global geometry. For Penrose tilings, the two descriptions meet.');
    }
    draw();
  }

  function drawRhomb(s, cx, cy, acute, color, label) {
    var side = 82;
    var theta = acute * Math.PI / 180;
    var pts = [
      [-side * Math.cos(theta / 2), 0],
      [0, -side * Math.sin(theta / 2)],
      [side * Math.cos(theta / 2), 0],
      [0, side * Math.sin(theta / 2)]
    ];
    append(s, 'polygon', {
      points: pts.map(function (p) { return [cx + p[0], cy + p[1]].join(','); }).join(' '),
      fill: color,
      opacity: 0.2,
      stroke: color,
      'stroke-width': 2
    });
    append(s, 'text', { x: cx, y: cy + 96, 'text-anchor': 'middle', fill: color, 'font-size': 13, 'font-weight': 700 }, label);
  }

  function mountOrientationalOrder(container) {
    var target = html('div');
    container.appendChild(target);
    clear(target);
    var W = 880, H = 360;
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
    target.appendChild(s);
    drawPeriodicComparison(s, 225, 170);
    drawPenroseOrientationPatch(s, 650, 170);
    append(s, 'text', { x: 225, y: 322, 'text-anchor': 'middle', fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'periodic lattice: translation grid first');
    append(s, 'text', { x: 650, y: 322, 'text-anchor': 'middle', fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'Penrose patch: five orientation families');
  }

  function drawPeriodicComparison(s, cx, cy) {
    for (var x = -4; x <= 4; x++) {
      append(s, 'line', { x1: cx + x * 28, y1: cy - 112, x2: cx + x * 28, y2: cy + 112, stroke: '#dedfd8' });
      append(s, 'line', { x1: cx - 112, y1: cy + x * 28, x2: cx + 112, y2: cy + x * 28, stroke: '#dedfd8' });
    }
    for (var i = -4; i <= 4; i++) for (var j = -4; j <= 4; j++) {
      append(s, 'circle', { cx: cx + i * 28, cy: cy + j * 28, r: 2.5, fill: css('--c-lattice', '#353947'), opacity: 0.55 });
    }
    append(s, 'line', { x1: cx - 88, y1: cy, x2: cx + 88, y2: cy, stroke: css('--c-physical', '#c46f2f'), 'stroke-width': 3 });
    append(s, 'line', { x1: cx, y1: cy - 88, x2: cx, y2: cy + 88, stroke: css('--c-internal', '#1f7a8c'), 'stroke-width': 3 });
    append(s, 'text', { x: cx, y: 36, 'text-anchor': 'middle', fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, '4-fold periodic');
  }

  function drawPenroseOrientationPatch(s, cx, cy) {
    var pts = penrosePoints(2.05);
    var scale = 32;
    var dirs = starDirs();
    for (var k = 0; k < dirs.length; k++) {
      append(s, 'line', { x1: cx, y1: cy, x2: cx + dirs[k][0] * 122, y2: cy + dirs[k][1] * 122, stroke: k % 2 ? css('--c-internal', '#1f7a8c') : css('--c-gold', '#b9942f'), 'stroke-width': 2.2, opacity: 0.6 });
      append(s, 'line', { x1: cx, y1: cy, x2: cx - dirs[k][0] * 122, y2: cy - dirs[k][1] * 122, stroke: k % 2 ? css('--c-internal', '#1f7a8c') : css('--c-gold', '#b9942f'), 'stroke-width': 2.2, opacity: 0.6 });
    }
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dist = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (dist > 0.58 && dist < 0.66) {
          append(s, 'line', { x1: cx + pts[i].x * scale, y1: cy + pts[i].y * scale, x2: cx + pts[j].x * scale, y2: cy + pts[j].y * scale, stroke: '#d9dbd2', 'stroke-width': 1 });
        }
      }
    }
    pts.forEach(function (p) {
      append(s, 'circle', { cx: cx + p.x * scale, cy: cy + p.y * scale, r: 2.2, fill: css('--c-physical', '#c46f2f'), opacity: 0.72 });
    });
    append(s, 'text', { x: cx, y: 36, 'text-anchor': 'middle', fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, '5-fold orientational');
  }

  function mountInflation(container) {
    var state = { level: 6 };
    container.appendChild(html('div', { class: 'controls' }, [
      html('label', {}, 'level <input type="range" min="1" max="9" step="1" value="' + state.level + '"><span class="value" data-v="level"></span>')
    ]));
    var target = html('div');
    container.appendChild(target);
    container.querySelector('input').addEventListener('input', function (e) { state.level = +e.target.value; draw(); });
    function fibWord(n) {
      var w = 'L';
      for (var k = 0; k < n; k++) w = w.replace(/L|S/g, function (ch) { return ch === 'L' ? 'LS' : 'L'; });
      return w;
    }
    function drawRow(s, word, y, label) {
      var total = word.split('').reduce(function (sum, ch) { return sum + (ch === 'L' ? phi : 1); }, 0);
      var x = 90, wScale = 700 / total;
      append(s, 'text', { x: 28, y: y + 18, fill: css('--text-2', '#565a68'), 'font-size': 13 }, label);
      word.split('').forEach(function (ch) {
        var ww = (ch === 'L' ? phi : 1) * wScale;
        append(s, 'rect', { x: x, y: y, width: ww, height: 28, fill: ch === 'L' ? css('--c-gold', '#b9942f') : css('--c-internal', '#1f7a8c'), opacity: ch === 'L' ? 0.55 : 0.36, stroke: '#ffffff', 'stroke-width': 0.6 });
        x += ww;
      });
    }
    function draw() {
      container.querySelector('[data-v="level"]').textContent = state.level;
      clear(target);
      var W = 860, H = 300;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      var w0 = fibWord(state.level - 1);
      var w1 = fibWord(state.level);
      drawRow(s, w0, 80, 'before');
      drawRow(s, w1, 145, 'after');
      var L = (w1.match(/L/g) || []).length;
      var S = (w1.match(/S/g) || []).length;
      append(s, 'text', { x: 90, y: 45, fill: css('--text', '#1b1d2a'), 'font-size': 18, 'font-weight': 700 }, 'L -> LS, S -> L');
      append(s, 'text', { x: 90, y: 232, fill: css('--text-2', '#565a68'), 'font-size': 14 }, 'Counts at this level: L = ' + L + ', S = ' + S + ', ratio = ' + round(L / Math.max(1, S), 4) + ' (approaching phi = ' + round(phi, 4) + ').');
    }
    draw();
  }

  function mountIcosahedron(container) {
    var selected = '5';
    var controls = html('div', { class: 'controls segmented' });
    ['5', '3', '2'].forEach(function (n, i) {
      var b = html('button', { type: 'button', class: i === 0 ? 'active' : '', 'aria-pressed': i === 0 ? 'true' : 'false' }, n + '-fold axes');
      b.addEventListener('click', function () {
        selected = n;
        Array.prototype.forEach.call(controls.querySelectorAll('button'), function (x) {
          x.classList.remove('active');
          x.setAttribute('aria-pressed', 'false');
        });
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
        draw();
      });
      controls.appendChild(b);
    });
    container.appendChild(controls);
    var target = html('div');
    container.appendChild(target);
    function draw() {
      clear(target);
      var W = 850, H = 430;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      var verts = icosaVerts();
      var edges = [];
      for (var i = 0; i < verts.length; i++) for (var j = i + 1; j < verts.length; j++) {
        if (Math.abs(dist3(verts[i], verts[j]) - 2) < 0.04) edges.push([i, j]);
      }
      function project(v) {
        var r1 = rotateY(v, -0.45);
        var r2 = rotateX(r1, 0.55);
        return [245 + r2[0] * 72, 205 + r2[1] * 72, r2[2]];
      }
      edges.forEach(function (e) {
        var a = project(verts[e[0]]), b = project(verts[e[1]]);
        append(s, 'line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#cfd2c8', 'stroke-width': 1.3 });
      });
      verts.forEach(function (v) {
        var p = project(v);
        append(s, 'circle', { cx: p[0], cy: p[1], r: 4.3, fill: css('--c-internal', '#1f7a8c'), opacity: 0.7 + p[2] * 0.05 });
      });
      var axes = icosaAxes(selected);
      axes.forEach(function (dir) {
        var a0 = project(scale3(dir, 1.35)), a1 = project(scale3(dir, -1.35));
        append(s, 'line', {
          x1: a0[0], y1: a0[1], x2: a1[0], y2: a1[1],
          stroke: css('--c-boundary', '#b44a3f'),
          'stroke-width': 1.6,
          opacity: 0.55
        });
      });
      // Highlight one canonical axis at full strength to anchor the eye.
      var primary = axes[0];
      var p0 = project(scale3(primary, 1.35)), p1 = project(scale3(primary, -1.35));
      append(s, 'line', {
        x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1],
        stroke: css('--c-boundary', '#b44a3f'),
        'stroke-width': 3
      });
      // Anchor the 5-fold case visually to its vertex pair.
      if (selected === '5') {
        [primary, scale3(primary, -1)].forEach(function (v) {
          var p = project(v);
          append(s, 'circle', { cx: p[0], cy: p[1], r: 6.4, fill: 'none', stroke: css('--c-boundary', '#b44a3f'), 'stroke-width': 2 });
        });
      }
      var n = +selected;
      var trace = 1 + 2 * Math.cos(2 * Math.PI / n);
      append(s, 'text', { x: 470, y: 70, fill: css('--text', '#1b1d2a'), 'font-size': 20, 'font-weight': 700 }, selected + '-fold rotation');
      append(s, 'text', { x: 470, y: 108, fill: css('--text-2', '#565a68'), 'font-size': 15 }, 'trace = 1 + 2 cos(2*pi/' + n + ') = ' + round(trace, 4) + (selected === '5' ? ' = phi' : ''));
      append(s, 'text', { x: 470, y: 138, fill: selected === '5' ? css('--c-boundary', '#b44a3f') : css('--c-window', '#78a66f'), 'font-size': 15, 'font-weight': 700 }, selected === '5' ? 'not an integer, so not a periodic 3D lattice symmetry' : 'integer trace, allowed by the restriction test');
      var counts = selected === '5' ? axes.length + ' axes through opposite vertices' : selected === '3' ? axes.length + ' axes through opposite faces' : axes.length + ' axes through opposite edges';
      append(s, 'text', { x: 470, y: 185, fill: css('--text-2', '#565a68'), 'font-size': 15 }, counts);
    }
    draw();
  }

  function mountPeriodicAperiodic(container) {
    var target = html('div');
    container.appendChild(target);
    var W = 920, H = 380;
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
    target.appendChild(s);
    drawTraceCard(s, 30, 72, 200, 190, 5);
    drawHexagonalDiffraction(s, 470, 168, 'periodic reciprocal lattice (6-fold, allowed)');
    drawDiffractionStar(s, 770, 168, 'quasi 10-fold module');
    append(s, 'text', { x: 30, y: 298, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'Trace test blocks order 5 for a periodic 3D lattice.');
    append(s, 'text', { x: 320, y: 298, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'Hexagonal lattice passes (trace = 1 + 2 cos(60 deg) = 2, integer).');
    append(s, 'text', { x: 320, y: 318, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'A quasicrystal keeps sharp order by using a higher-rank module instead of translations.');
  }

  function drawHexagonalDiffraction(s, cx, cy, label) {
    append(s, 'rect', { x: cx - 145, y: cy - 118, width: 290, height: 236, rx: 6, fill: '#fbfbf8', stroke: '#dedfd8' });
    var basisA = [Math.sqrt(3) / 2 * 32, 0.5 * 32];
    var basisB = [-Math.sqrt(3) / 2 * 32, 0.5 * 32];
    for (var i = -4; i <= 4; i++) for (var j = -4; j <= 4; j++) {
      var x = i * basisA[0] + j * basisB[0];
      var y = i * basisA[1] + j * basisB[1];
      var r = Math.hypot(x, y);
      if (r > 110) continue;
      var amp = (110 - r) / 110;
      append(s, 'circle', {
        cx: cx + x,
        cy: cy + y,
        r: 2.6 + 3.4 * amp,
        fill: i === 0 && j === 0 ? css('--c-lattice', '#353947') : css('--c-physical', '#c46f2f'),
        opacity: i === 0 && j === 0 ? 0.7 : 0.22 + 0.55 * amp
      });
    }
    append(s, 'text', { x: cx, y: cy - 138, 'text-anchor': 'middle', fill: css('--text', '#1b1d2a'), 'font-size': 14, 'font-weight': 700 }, label);
  }

  function mountH3H4Substrate(container) {
    var state = { slice: 0.18, turn: 0.35 };
    container.appendChild(html('div', { class: 'controls' }, [
      html('label', {}, 'H3 slice <input type="range" min="-0.8" max="0.8" step="0.02" value="' + state.slice + '"><span class="value" data-v="slice"></span>'),
      html('label', {}, '4D turn <input type="range" min="0" max="1" step="0.01" value="' + state.turn + '"><span class="value" data-v="turn"></span>')
    ]));
    var target = html('div');
    container.appendChild(target);
    var inputs = container.querySelectorAll('input');
    inputs[0].addEventListener('input', function (e) { state.slice = +e.target.value; draw(); });
    inputs[1].addEventListener('input', function (e) { state.turn = +e.target.value; draw(); });
    function draw() {
      container.querySelector('[data-v="slice"]').textContent = round(state.slice, 2);
      container.querySelector('[data-v="turn"]').textContent = round(state.turn, 2);
      clear(target);
      var W = 900, H = 410;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      var verts = vertices600();
      append(s, 'rect', { x: 44, y: 52, width: 360, height: 280, rx: 6, fill: '#fbfbf8', stroke: '#dedfd8' });
      append(s, 'rect', { x: 496, y: 52, width: 360, height: 280, rx: 6, fill: '#fbfbf8', stroke: '#dedfd8' });
      // Axis crosshairs
      append(s, 'line', { x1: 70, y1: 192, x2: 378, y2: 192, stroke: '#e6e7e1', 'stroke-width': 1 });
      append(s, 'line', { x1: 224, y1: 78, x2: 224, y2: 306, stroke: '#e6e7e1', 'stroke-width': 1 });
      append(s, 'line', { x1: 522, y1: 192, x2: 830, y2: 192, stroke: '#e6e7e1', 'stroke-width': 1 });
      append(s, 'line', { x1: 676, y1: 78, x2: 676, y2: 306, stroke: '#e6e7e1', 'stroke-width': 1 });
      var projected = verts.map(function (v) { return project4(v, state.turn); });
      projected.sort(function (a, b) { return a.z - b.z; }).forEach(function (p) {
        append(s, 'circle', {
          cx: 224 + p.x * 82,
          cy: 192 + p.y * 82,
          r: 2.3 + 1.6 * (p.z + 1) / 2,
          fill: p.w > 0 ? css('--c-gold', '#b9942f') : css('--c-internal', '#1f7a8c'),
          opacity: 0.25 + 0.45 * (p.z + 1) / 2
        });
      });
      var slicePts = projected.filter(function (p) { return Math.abs(p.w - state.slice) < 0.22; });
      slicePts.forEach(function (p) {
        append(s, 'circle', {
          cx: 676 + p.x * 105,
          cy: 192 + p.y * 105,
          r: 4.5,
          fill: Math.abs(p.w - state.slice) < 0.08 ? css('--c-physical', '#c46f2f') : css('--c-window', '#78a66f'),
          opacity: 0.76
        });
      });
      drawIcosaWire(s, 676, 192, 74);
      append(s, 'text', { x: 224, y: 34, 'text-anchor': 'middle', fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, 'H4 / 600-cell vertices');
      append(s, 'text', { x: 676, y: 34, 'text-anchor': 'middle', fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, 'finite H3 slice view');
      // Axis labels
      append(s, 'text', { x: 380, y: 196, 'text-anchor': 'end', fill: css('--text-2', '#565a68'), 'font-size': 11 }, 'screen x  (rotates v_0, v_3 with 4D turn)');
      append(s, 'text', { x: 232, y: 76, fill: css('--text-2', '#565a68'), 'font-size': 11 }, 'screen y  (rotates v_1, v_2 with 4D turn)');
      append(s, 'text', { x: 832, y: 196, 'text-anchor': 'end', fill: css('--text-2', '#565a68'), 'font-size': 11 }, 'physical x');
      append(s, 'text', { x: 684, y: 76, fill: css('--text-2', '#565a68'), 'font-size': 11 }, 'physical y');
      append(s, 'text', { x: 522, y: 322, fill: css('--text-2', '#565a68'), 'font-size': 11 }, 'wire icosahedron drawn as a fixed reference frame');
      append(s, 'text', { x: 58, y: 358, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'Cloud: all 120 vertices of the 600-cell, projected via two 4D rotations whose phase is "4D turn".');
      append(s, 'text', { x: 58, y: 380, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'Slice: vertices with |w - ' + round(state.slice, 2) + '| < 0.22 (' + slicePts.length + ' points; orange = within 0.08 of the slice center).');
    }
    draw();
  }

  function vertices600() {
    var out = [];
    var signs = [-1, 1];
    for (var i = 0; i < 4; i++) {
      signs.forEach(function (sgn) {
        var v = [0, 0, 0, 0];
        v[i] = sgn;
        out.push(v);
      });
    }
    signs.forEach(function (a) { signs.forEach(function (b) { signs.forEach(function (c) { signs.forEach(function (d) {
      out.push([a * 0.5, b * 0.5, c * 0.5, d * 0.5]);
    }); }); }); });
    var base = [0, 0.5, phi / 2, 1 / (2 * phi)];
    permutations4(base).forEach(function (p) {
      signs.forEach(function (s1) { signs.forEach(function (s2) { signs.forEach(function (s3) {
        out.push(p.map(function (v) {
          if (Math.abs(v) < 1e-9) return 0;
          if (Math.abs(v - 0.5) < 1e-9) return s1 * v;
          if (Math.abs(v - phi / 2) < 1e-9) return s2 * v;
          return s3 * v;
        }));
      }); }); });
    });
    var seen = {};
    return out.filter(function (v) {
      var key = v.map(function (x) { return round(x, 5); }).join(',');
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function permutations4(arr) {
    var out = [];
    function rec(prefix, rest) {
      if (!rest.length) {
        var inversions = 0;
        for (var i = 0; i < prefix.length; i++) for (var j = i + 1; j < prefix.length; j++) if (prefix[i] > prefix[j]) inversions++;
        if (inversions % 2 === 0) out.push(prefix);
        return;
      }
      for (var k = 0; k < rest.length; k++) rec(prefix.concat(rest[k]), rest.slice(0, k).concat(rest.slice(k + 1)));
    }
    rec([], arr);
    return out;
  }

  function project4(v, turn) {
    var a = turn * Math.PI * 2;
    var b = turn * Math.PI * 1.3 + 0.4;
    var x1 = v[0] * Math.cos(a) - v[3] * Math.sin(a);
    var w1 = v[0] * Math.sin(a) + v[3] * Math.cos(a);
    var y1 = v[1] * Math.cos(b) - v[2] * Math.sin(b);
    var z1 = v[1] * Math.sin(b) + v[2] * Math.cos(b);
    return { x: x1 + 0.28 * z1, y: y1 - 0.18 * w1, z: z1, w: w1 };
  }

  function drawIcosaWire(s, cx, cy, scale) {
    var verts = icosaVerts();
    var pts = verts.map(function (v) {
      var r1 = rotateY(v, -0.35);
      var r2 = rotateX(r1, 0.5);
      return [cx + r2[0] * scale, cy + r2[1] * scale, r2[2]];
    });
    for (var i = 0; i < verts.length; i++) for (var j = i + 1; j < verts.length; j++) {
      if (Math.abs(dist3(verts[i], verts[j]) - 2) < 0.04) {
        append(s, 'line', { x1: pts[i][0], y1: pts[i][1], x2: pts[j][0], y2: pts[j][1], stroke: '#cfd2c8', 'stroke-width': 1, opacity: 0.55 });
      }
    }
  }

  function drawTraceCard(s, x, y, w, h, n) {
    var trace = 1 + 2 * Math.cos(2 * Math.PI / n);
    append(s, 'rect', { x: x, y: y, width: w, height: h, rx: 6, fill: '#fbfbf8', stroke: css('--c-boundary', '#b44a3f'), 'stroke-width': 1.6 });
    append(s, 'text', { x: x + 18, y: y + 38, fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, 'periodic + 5-fold');
    append(s, 'text', { x: x + 18, y: y + 78, fill: css('--text-2', '#565a68'), 'font-size': 14 }, 'trace = 1 + 2 cos(2pi/5)');
    append(s, 'text', { x: x + 18, y: y + 112, fill: css('--c-boundary', '#b44a3f'), 'font-size': 20, 'font-weight': 700 }, round(trace, 4) + ' is not integer');
    append(s, 'line', { x1: x + 22, y1: y + 145, x2: x + w - 22, y2: y + 145, stroke: css('--c-boundary', '#b44a3f'), 'stroke-width': 3 });
    append(s, 'text', { x: x + 18, y: y + 174, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'translation lattice fails');
  }

  function drawDiffractionStar(s, cx, cy, label) {
    append(s, 'rect', { x: cx - 155, y: cy - 118, width: 310, height: 236, rx: 6, fill: '#fbfbf8', stroke: '#dedfd8' });
    for (var r = 20; r <= 96; r += 19) {
      for (var k = 0; k < 10; k++) {
        var a = k * Math.PI * 2 / 10 + (r % 38 ? 0 : Math.PI / 10);
        append(s, 'circle', { cx: cx + r * Math.cos(a), cy: cy + r * Math.sin(a), r: 3.1 + (100 - r) / 35, fill: css('--c-internal', '#1f7a8c'), opacity: 0.28 + (100 - r) / 140 });
      }
    }
    for (var j = 0; j < 5; j++) {
      var b = j * Math.PI * 2 / 5;
      append(s, 'line', { x1: cx - 110 * Math.cos(b), y1: cy - 110 * Math.sin(b), x2: cx + 110 * Math.cos(b), y2: cy + 110 * Math.sin(b), stroke: css('--c-gold', '#b9942f'), 'stroke-width': 1, opacity: 0.35 });
    }
    append(s, 'text', { x: cx, y: cy - 138, 'text-anchor': 'middle', fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, label);
  }

  function icosaVerts() {
    var out = [], ps = [-1, 1];
    ps.forEach(function (a) { ps.forEach(function (b) { out.push([0, a, b * phi], [a, b * phi, 0], [a * phi, 0, b]); }); });
    return out;
  }
  function canonicalDirection(v) {
    // Pick the antipodal representative whose first nonzero coord is positive.
    for (var i = 0; i < v.length; i++) {
      if (Math.abs(v[i]) > 1e-6) return v[i] > 0 ? v.slice() : v.map(function (x) { return -x; });
    }
    return v.slice();
  }
  function dedupeDirections(vecs) {
    var seen = {}, out = [];
    vecs.forEach(function (v) {
      var c = canonicalDirection(v);
      var key = c.map(function (x) { return Math.round(x * 1e4) / 1e4; }).join(',');
      if (!seen[key]) { seen[key] = true; out.push(c); }
    });
    return out;
  }
  function icosaAxes(fold) {
    var verts = icosaVerts();
    if (fold === '5') {
      // 5-fold axes pass through opposite vertices.
      return dedupeDirections(verts);
    }
    if (fold === '3') {
      // 3-fold axes pass through face centroids; faces are triangles of mutually adjacent vertices.
      var centers = [];
      for (var i = 0; i < verts.length; i++) for (var j = i + 1; j < verts.length; j++) for (var k = j + 1; k < verts.length; k++) {
        if (Math.abs(dist3(verts[i], verts[j]) - 2) < 0.04 &&
            Math.abs(dist3(verts[j], verts[k]) - 2) < 0.04 &&
            Math.abs(dist3(verts[i], verts[k]) - 2) < 0.04) {
          centers.push([
            (verts[i][0] + verts[j][0] + verts[k][0]) / 3,
            (verts[i][1] + verts[j][1] + verts[k][1]) / 3,
            (verts[i][2] + verts[j][2] + verts[k][2]) / 3
          ]);
        }
      }
      return dedupeDirections(centers);
    }
    // 2-fold axes pass through edge midpoints; edges are vertex pairs at distance 2.
    var midpoints = [];
    for (var i = 0; i < verts.length; i++) for (var j = i + 1; j < verts.length; j++) {
      if (Math.abs(dist3(verts[i], verts[j]) - 2) < 0.04) {
        midpoints.push([
          (verts[i][0] + verts[j][0]) / 2,
          (verts[i][1] + verts[j][1]) / 2,
          (verts[i][2] + verts[j][2]) / 2
        ]);
      }
    }
    return dedupeDirections(midpoints);
  }
  function dist3(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); }
  function scale3(v, k) { return [v[0] * k, v[1] * k, v[2] * k]; }
  function rotateX(v, a) { var c = Math.cos(a), s = Math.sin(a); return [v[0], c * v[1] - s * v[2], s * v[1] + c * v[2]]; }
  function rotateY(v, a) { var c = Math.cos(a), s = Math.sin(a); return [c * v[0] + s * v[2], v[1], -s * v[0] + c * v[2]]; }

  function mountIcosianFlow(container) {
    var state = { a: 1, b: 1 };
    container.appendChild(html('div', { class: 'controls' }, [
      html('label', {}, 'a <input type="range" min="-3" max="3" step="1" value="' + state.a + '"><span class="value" data-v="a"></span>'),
      html('label', {}, 'b <input type="range" min="-3" max="3" step="1" value="' + state.b + '"><span class="value" data-v="b"></span>')
    ]));
    var target = html('div');
    container.appendChild(target);
    var inputs = container.querySelectorAll('input');
    inputs[0].addEventListener('input', function (e) { state.a = +e.target.value; draw(); });
    inputs[1].addEventListener('input', function (e) { state.b = +e.target.value; draw(); });
    function draw() {
      container.querySelector('[data-v="a"]').textContent = state.a;
      container.querySelector('[data-v="b"]').textContent = state.b;
      clear(target);
      var W = 850, H = 360;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      var boxes = [
        { x: 45, y: 120, w: 160, h: 92, title: 'H[phi]', body: 'g = a + b phi' },
        { x: 270, y: 65, w: 180, h: 92, title: 'physical', body: 'g = ' + round(state.a + state.b * phi, 3) },
        { x: 270, y: 205, w: 180, h: 92, title: 'internal', body: 'sigma(g) = ' + round((state.a + state.b) - state.b * phi, 3) },
        { x: 555, y: 120, w: 235, h: 92, title: 'Galois pair', body: '(g, sigma(g)) in R^2' }
      ];
      boxes.forEach(function (b, idx) {
        var color = idx === 1 ? css('--c-physical', '#c46f2f') : idx === 2 ? css('--c-internal', '#1f7a8c') : idx === 3 ? css('--c-gold', '#b9942f') : css('--c-lattice', '#353947');
        append(s, 'rect', { x: b.x, y: b.y, width: b.w, height: b.h, rx: 6, fill: '#fbfbf8', stroke: color, 'stroke-width': 1.6 });
        append(s, 'text', { x: b.x + 16, y: b.y + 30, fill: color, 'font-size': 14, 'font-weight': 700 }, b.title);
        append(s, 'text', { x: b.x + 16, y: b.y + 60, fill: css('--text', '#1b1d2a'), 'font-size': 16, 'font-weight': 700 }, b.body);
      });
      arrow(s, 205, 166, 270, 111, css('--c-physical', '#c46f2f'));
      arrow(s, 205, 166, 270, 251, css('--c-internal', '#1f7a8c'));
      arrow(s, 450, 111, 555, 166, css('--c-gold', '#b9942f'));
      arrow(s, 450, 251, 555, 166, css('--c-gold', '#b9942f'));
      append(s, 'text', { x: 48, y: 312, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'Scaling up: an icosian quaternion (q0, q1, q2, q3) in H[phi]^4 embeds as (q, sigma(q)) in R^8.');
      append(s, 'text', { x: 48, y: 332, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'Nearby E8 realization: useful comparison, not the source label for this model set.');
    }
    draw();
  }

  function mountDiffraction(container) {
    var state = { window: 1.2 };
    container.appendChild(html('div', { class: 'controls' }, [
      html('label', {}, 'window envelope <input type="range" min="0.45" max="2.2" step="0.02" value="' + state.window + '"><span class="value" data-v="window"></span>')
    ]));
    var canvas = document.createElement('canvas');
    canvas.style.height = '430px';
    container.appendChild(canvas);
    container.querySelector('input').addEventListener('input', function (e) { state.window = +e.target.value; draw(); });
    function draw() {
      container.querySelector('[data-v="window"]').textContent = round(state.window, 2);
      var rectW = 880, rectH = 430, dpr = window.devicePixelRatio || 1;
      canvas.width = rectW * dpr; canvas.height = rectH * dpr;
      canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, rectW, rectH);
      ctx.fillStyle = '#fbfbf8'; ctx.fillRect(0, 0, rectW, rectH);
      drawPanel(ctx, 145, 210, 'periodic', function () {
        for (var x = -4; x <= 4; x++) for (var y = -4; y <= 4; y++) peak(ctx, 145 + x * 20, 210 + y * 20, 2.2 + (x === 0 && y === 0 ? 3 : 0), '#353947', 0.65);
      });
      drawPanel(ctx, 440, 210, 'random', function () {
        var rnd = seeded(12);
        for (var i = 0; i < 180; i++) {
          var a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 95;
          peak(ctx, 440 + r * Math.cos(a), 210 + r * Math.sin(a), 1 + rnd() * 2, '#858998', 0.22);
        }
      });
      drawPanel(ctx, 735, 210, 'quasi module', function () {
        var dirs = starDirs();
        var peaks = [];
        for (var a = -2; a <= 2; a++) for (var b = -2; b <= 2; b++) for (var c = -2; c <= 2; c++) for (var d = -2; d <= 2; d++) for (var e = -2; e <= 2; e++) {
          var ns = [a, b, c, d, e];
          var x = 0, y = 0;
          for (var k = 0; k < 5; k++) { x += ns[k] * dirs[k][0]; y += ns[k] * dirs[k][1]; }
          var mean = (a + b + c + d + e) / 5;
          var internal = Math.sqrt(ns.reduce(function (sum, v) { return sum + (v - mean) * (v - mean); }, 0));
          var rr = Math.hypot(x, y);
          if (rr < 4.3) {
            var amp = Math.pow(sinc(state.window * internal), 2) / (1 + 0.06 * rr * rr);
            peaks.push({ x: x, y: y, amp: amp });
          }
        }
        peaks.sort(function (p, q) { return p.amp - q.amp; }).forEach(function (p) {
          peak(ctx, 735 + p.x * 23, 210 + p.y * 23, 1 + 8 * p.amp, '#1f7a8c', 0.16 + 0.75 * p.amp);
        });
      });
    }
    function drawPanel(ctx, cx, cy, title, fn) {
      ctx.strokeStyle = '#dedfd8'; ctx.strokeRect(cx - 120, cy - 140, 240, 280);
      fn();
      ctx.fillStyle = '#565a68';
      ctx.font = '700 14px Source Sans 3, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, cx, cy + 166);
    }
    function peak(ctx, x, y, r, color, alpha) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    draw();
  }

  function mountDiffractionOracle(container) {
    var state = { system: 'penrose', window: 1.1, threshold: 0.045 };
    var controls = html('div', { class: 'controls' });
    var modes = html('div', { class: 'segmented' });
    [
      ['fibonacci', 'Fibonacci'],
      ['penrose', 'Penrose'],
      ['h3', 'H3 shell']
    ].forEach(function (item, i) {
      var b = html('button', { type: 'button', class: i === 1 ? 'active' : '', 'aria-pressed': i === 1 ? 'true' : 'false' }, item[1]);
      b.addEventListener('click', function () {
        state.system = item[0];
        Array.prototype.forEach.call(modes.querySelectorAll('button'), function (x) {
          x.classList.remove('active');
          x.setAttribute('aria-pressed', 'false');
        });
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
        draw();
      });
      modes.appendChild(b);
    });
    controls.appendChild(modes);
    controls.appendChild(html('label', {}, 'window envelope <input type="range" min="0.35" max="2.25" step="0.02" value="' + state.window + '"><span class="value" data-v="window"></span>'));
    controls.appendChild(html('label', {}, 'peak threshold <input type="range" min="0.005" max="0.18" step="0.005" value="' + state.threshold + '"><span class="value" data-v="threshold"></span>'));
    container.appendChild(controls);
    var canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '450px';
    container.appendChild(canvas);
    var inputs = container.querySelectorAll('input');
    inputs[0].addEventListener('input', function (e) { state.window = +e.target.value; draw(); });
    inputs[1].addEventListener('input', function (e) { state.threshold = +e.target.value; draw(); });

    function draw() {
      container.querySelector('[data-v="window"]').textContent = round(state.window, 2);
      container.querySelector('[data-v="threshold"]').textContent = round(state.threshold, 3);
      var W = 900, H = 450, dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#fbfbf8';
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#dedfd8';
      ctx.strokeRect(42, 38, 816, 315);
      drawOraclePeaks(ctx, state);
      ctx.fillStyle = css('--text', '#1b1d2a');
      ctx.font = '700 18px Source Sans 3, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('finite diffraction oracle', 62, 70);
      ctx.fillStyle = css('--text-2', '#565a68');
      ctx.font = '13px Source Sans 3, sans-serif';
      ctx.fillText(oracleDescription(state.system), 62, 96);
      ctx.fillText('The candidate module is fixed. The window envelope changes intensities, and the threshold hides faint peaks.', 62, 394);
    }
    draw();
  }

  function drawOraclePeaks(ctx, state) {
    var W = 900, H = 450;
    var cx = W / 2, cy = 198;
    var peaks = state.system === 'fibonacci' ? fibonacciDiffractionPeaks(state.window) : state.system === 'h3' ? h3DiffractionPeaks(state.window) : penroseDiffractionPeaks(state.window);
    var visible = peaks.filter(function (p) { return p.amp >= state.threshold; });
    var scale = state.system === 'fibonacci' ? 33 : state.system === 'h3' ? 41 : 50;
    ctx.save();
    ctx.beginPath();
    ctx.rect(42, 38, 816, 315);
    ctx.clip();
    ctx.strokeStyle = '#e6e7e1';
    ctx.lineWidth = 1;
    for (var gx = -320; gx <= 320; gx += scale) {
      ctx.beginPath(); ctx.moveTo(cx + gx, 60); ctx.lineTo(cx + gx, 334); ctx.stroke();
    }
    for (var gy = -120; gy <= 120; gy += scale) {
      ctx.beginPath(); ctx.moveTo(64, cy + gy); ctx.lineTo(836, cy + gy); ctx.stroke();
    }
    // k=0 axes
    ctx.strokeStyle = '#cbcdc1';
    ctx.beginPath(); ctx.moveTo(64, cy); ctx.lineTo(836, cy); ctx.stroke();
    if (state.system !== 'fibonacci') {
      ctx.beginPath(); ctx.moveTo(cx, 60); ctx.lineTo(cx, 334); ctx.stroke();
    }
    peaks.sort(function (a, b) { return a.amp - b.amp; }).forEach(function (p) {
      var x = cx + p.x * scale;
      var y = cy + p.y * scale;
      if (x < 50 || x > 850 || y < 48 || y > 346) return;
      drawCanvasPeak(ctx, x, y, 1.1 + 7.5 * p.amp, p.amp >= state.threshold ? p.color : '#858998', p.amp >= state.threshold ? 0.18 + 0.72 * p.amp : 0.08);
    });
    ctx.restore();
    // Reciprocal-space axis labels and scale bar.
    ctx.fillStyle = css('--text-2', '#565a68');
    ctx.font = '12px Source Sans 3, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('k_par', 60, cy - 6);
    if (state.system !== 'fibonacci') ctx.fillText('k_perp', cx + 8, 70);
    // Scale bar of length one reciprocal-lattice unit.
    var barX = 70, barY = 338;
    ctx.strokeStyle = css('--text-2', '#565a68');
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(barX, barY); ctx.lineTo(barX + scale, barY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(barX, barY - 4); ctx.lineTo(barX, barY + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(barX + scale, barY - 4); ctx.lineTo(barX + scale, barY + 4); ctx.stroke();
    ctx.fillStyle = css('--text-2', '#565a68');
    ctx.textAlign = 'left';
    ctx.fillText(state.system === 'fibonacci' ? '1 (= step in Z + Z*phi)' : '1 module unit', barX + scale + 8, barY + 4);
    ctx.fillStyle = css('--text', '#1b1d2a');
    ctx.font = '700 16px Source Sans 3, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(visible.length + ' visible peaks', 838, 78);
    ctx.fillStyle = css('--text-2', '#565a68');
    ctx.font = '13px Source Sans 3, sans-serif';
    ctx.fillText(peaks.length + ' candidates in finite cutoff', 838, 101);
  }

  function drawCanvasPeak(ctx, x, y, r, color, alpha) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function oracleDescription(system) {
    return {
      fibonacci: 'One-dimensional Bragg peaks from the Z[phi] Fourier module, drawn on a line.',
      penrose: 'Five star-basis integer combinations give a dense ten-fold candidate module.',
      h3: 'An icosahedral shell approximation exposes the higher-rank H3/H4 vocabulary.'
    }[system];
  }

  function fibonacciDiffractionPeaks(windowValue) {
    // Module element a + b*phi sits in physical space; its Galois conjugate
    // a + b*sigma(phi) = a + b*(1 - phi) controls the window-FT envelope.
    var peaks = [];
    var seen = {};
    for (var a = -13; a <= 13; a++) for (var b = -13; b <= 13; b++) {
      var x = a + b * phi;
      var internal = a + b * sigmaPhi;
      if (Math.abs(x) > 10.4) continue;
      var amp = Math.pow(sinc(windowValue * internal), 2) / (1 + 0.018 * x * x);
      var key = x.toFixed(3);
      if (!seen[key] || seen[key].amp < amp) seen[key] = { x: x, y: 0, amp: amp, color: css('--c-physical', '#c46f2f') };
    }
    Object.keys(seen).forEach(function (k) { peaks.push(seen[k]); });
    peaks.push({ x: 0, y: 0, amp: 1, color: css('--c-lattice', '#353947') });
    return peaks;
  }

  function penroseDiffractionPeaks(windowValue) {
    var dirs = starDirs();
    var peaks = [];
    var seen = {};
    for (var a = -3; a <= 3; a++) for (var b = -3; b <= 3; b++) for (var c = -3; c <= 3; c++) for (var d = -3; d <= 3; d++) for (var e = -3; e <= 3; e++) {
      var ns = [a, b, c, d, e];
      var x = 0, y = 0;
      for (var k = 0; k < 5; k++) {
        x += ns[k] * dirs[k][0];
        y += ns[k] * dirs[k][1];
      }
      var radius = Math.hypot(x, y);
      if (radius > 4.9) continue;
      var mean = (a + b + c + d + e) / 5;
      var internal = Math.sqrt(ns.reduce(function (sum, v) { return sum + (v - mean) * (v - mean); }, 0));
      var amp = Math.pow(sinc(windowValue * internal), 2) / (1 + 0.035 * radius * radius);
      var key = x.toFixed(3) + ',' + y.toFixed(3);
      if (!seen[key] || seen[key].amp < amp) seen[key] = { x: x, y: y, amp: amp, color: css('--c-internal', '#1f7a8c') };
    }
    Object.keys(seen).forEach(function (k) { peaks.push(seen[k]); });
    return peaks;
  }

  function h3DiffractionPeaks(windowValue) {
    var verts = icosaVerts().map(function (v) {
      var n = Math.hypot(v[0], v[1], v[2]);
      return [v[0] / n, v[1] / n, v[2] / n];
    });
    var peaks = [];
    function addPeak(v, shell) {
      var r = rotateX(rotateY(v, -0.45), 0.56);
      var amp = Math.pow(sinc(windowValue * (shell - 0.55 * r[2])), 2) / (1 + 0.08 * shell * shell);
      peaks.push({ x: r[0] * shell, y: r[1] * shell, amp: amp, color: shell % 2 ? css('--c-gold', '#b9942f') : css('--c-internal', '#1f7a8c') });
    }
    verts.forEach(function (v) {
      for (var shell = 1; shell <= 4; shell++) addPeak(v, shell);
    });
    for (var i = 0; i < verts.length; i++) for (var j = i + 1; j < verts.length; j++) {
      var v = [verts[i][0] + verts[j][0], verts[i][1] + verts[j][1], verts[i][2] + verts[j][2]];
      var n = Math.hypot(v[0], v[1], v[2]);
      if (n > 0.85 && n < 1.75) addPeak([v[0] / n, v[1] / n, v[2] / n], 2);
    }
    peaks.push({ x: 0, y: 0, amp: 1, color: css('--c-lattice', '#353947') });
    return peaks;
  }

  function mountTimeline(container) {
    var W = 860, H = 360;
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
    container.appendChild(s);
    var events = [
      { year: 1982, label: 'electron diffraction observation' },
      { year: 1984, label: 'PRL paper' },
      { year: 2009, label: 'natural quasicrystal reported' },
      { year: 2011, label: 'Nobel Prize' },
      { year: 2023, label: 'Hat and Spectre frontier' }
    ];
    var min = 1980, max = 2025, x0 = 75, x1 = 785, y = 245;
    append(s, 'line', { x1: x0, y1: y, x2: x1, y2: y, stroke: '#cfd2c8', 'stroke-width': 2 });
    events.forEach(function (e, i) {
      var x = x0 + (e.year - min) / (max - min) * (x1 - x0);
      append(s, 'circle', { cx: x, cy: y, r: 6, fill: i < 2 ? css('--c-boundary', '#b44a3f') : css('--c-internal', '#1f7a8c') });
      append(s, 'text', { x: x, y: y + 28, 'text-anchor': 'middle', fill: css('--text', '#1b1d2a'), 'font-size': 13, 'font-weight': 700 }, e.year);
      append(s, 'text', { x: x, y: y + 48, 'text-anchor': 'middle', fill: css('--text-2', '#565a68'), 'font-size': 11 }, e.label);
    });
    var cx = 430, cy = 110;
    for (var r = 18; r <= 78; r += 20) {
      append(s, 'circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: '#e0e2dc', 'stroke-width': 1 });
      for (var k = 0; k < 10; k++) {
        var a = k * Math.PI * 2 / 10;
        append(s, 'circle', { cx: cx + r * Math.cos(a), cy: cy + r * Math.sin(a), r: 3.8, fill: css('--c-physical', '#c46f2f'), opacity: 0.25 + r / 110 });
      }
    }
    append(s, 'text', { x: cx, y: 24, 'text-anchor': 'middle', fill: css('--text', '#1b1d2a'), 'font-size': 18, 'font-weight': 700 }, 'schematic ten-fold diffraction');
    append(s, 'text', { x: cx, y: 44, 'text-anchor': 'middle', fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'redrawn, not a copied experimental plate');
  }

  function mountShechtmanComparison(container) {
    var state = { spread: 0.42 };
    container.appendChild(html('div', { class: 'controls' }, [
      html('label', {}, 'twin spread <input type="range" min="0" max="1" step="0.01" value="' + state.spread + '"><span class="value" data-v="spread"></span>')
    ]));
    var target = html('div');
    container.appendChild(target);
    container.querySelector('input').addEventListener('input', function (e) { state.spread = +e.target.value; draw(); });
    function draw() {
      container.querySelector('[data-v="spread"]').textContent = round(state.spread, 2);
      clear(target);
      var W = 900, H = 455;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      drawTwinningDiffraction(s, 245, 166, state.spread);
      drawQuasiDiffractionModule(s, 655, 166);
      append(s, 'text', { x: 245, y: 315, 'text-anchor': 'middle', fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'several periodic reciprocal lattices, overlaid');
      append(s, 'text', { x: 655, y: 315, 'text-anchor': 'middle', fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'one coherent ten-fold Fourier module');
      drawNotebookStrip(s, 115, 342);
    }
    draw();
  }

  function drawTwinningDiffraction(s, cx, cy, spread) {
    append(s, 'rect', { x: cx - 145, y: cy - 130, width: 290, height: 260, rx: 6, fill: '#fbfbf8', stroke: '#dedfd8' });
    var colors = [css('--c-physical', '#c46f2f'), css('--c-internal', '#1f7a8c'), css('--c-window', '#78a66f'), css('--c-gold', '#b9942f'), css('--c-violet', '#6e5ca8')];
    for (var domain = 0; domain < 5; domain++) {
      var angle = domain * Math.PI * 2 / 5 + (domain - 2) * spread * 0.08;
      var co = Math.cos(angle), si = Math.sin(angle);
      for (var i = -3; i <= 3; i++) for (var j = -3; j <= 3; j++) {
        if (i === 0 && j === 0) continue;
        var x = (i * co - j * si) * 28 + spread * (domain - 2) * 3;
        var y = (i * si + j * co) * 28 - spread * (domain - 2) * 2;
        if (Math.hypot(x, y) < 118) append(s, 'circle', { cx: cx + x, cy: cy + y, r: 2.2, fill: colors[domain], opacity: 0.28 });
      }
    }
    append(s, 'circle', { cx: cx, cy: cy, r: 5, fill: css('--c-lattice', '#353947'), opacity: 0.55 });
    append(s, 'text', { x: cx, y: cy - 152, 'text-anchor': 'middle', fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, 'multiple twinning');
  }

  function drawQuasiDiffractionModule(s, cx, cy) {
    append(s, 'rect', { x: cx - 145, y: cy - 130, width: 290, height: 260, rx: 6, fill: '#fbfbf8', stroke: '#dedfd8' });
    for (var r = 18; r <= 112; r += 18) {
      for (var k = 0; k < 10; k++) {
        var a = k * Math.PI * 2 / 10 + (r % 36 ? 0 : Math.PI / 10);
        var amp = (120 - r) / 115;
        append(s, 'circle', {
          cx: cx + r * Math.cos(a),
          cy: cy + r * Math.sin(a),
          r: 2.4 + 3.8 * amp,
          fill: k % 2 ? css('--c-internal', '#1f7a8c') : css('--c-physical', '#c46f2f'),
          opacity: 0.24 + 0.5 * amp
        });
      }
    }
    for (var axis = 0; axis < 5; axis++) {
      var b = axis * Math.PI * 2 / 5;
      append(s, 'line', { x1: cx - 118 * Math.cos(b), y1: cy - 118 * Math.sin(b), x2: cx + 118 * Math.cos(b), y2: cy + 118 * Math.sin(b), stroke: css('--c-gold', '#b9942f'), 'stroke-width': 1, opacity: 0.34 });
    }
    append(s, 'circle', { cx: cx, cy: cy, r: 5.5, fill: css('--c-lattice', '#353947'), opacity: 0.65 });
    append(s, 'text', { x: cx, y: cy - 152, 'text-anchor': 'middle', fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, 'quasicrystal');
  }

  function drawNotebookStrip(s, x, y) {
    append(s, 'rect', { x: x, y: y, width: 660, height: 54, rx: 6, fill: '#fbfbf8', stroke: '#dedfd8' });
    append(s, 'text', { x: x + 18, y: y + 24, fill: css('--text', '#1b1d2a'), 'font-size': 16, 'font-weight': 700 }, '1982 note');
    append(s, 'text', { x: x + 118, y: y + 24, fill: css('--c-boundary', '#b44a3f'), 'font-size': 17, 'font-weight': 700 }, '10-fold?');
    append(s, 'text', { x: x + 228, y: y + 24, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'rights-safe schematic, not a copied plate');
    append(s, 'line', { x1: x + 18, y1: y + 38, x2: x + 642, y2: y + 38, stroke: '#e4e5de', 'stroke-width': 1 });
    append(s, 'circle', { cx: x + 255, cy: y + 38, r: 4, fill: css('--c-boundary', '#b44a3f') });
    append(s, 'text', { x: x + 270, y: y + 43, fill: css('--text-2', '#565a68'), 'font-size': 12 }, '1984: long-range order without periodic translation');
  }

  function mountDefinitions(container) {
    var row = html('div', { class: 'definition-row' });
    [
      ['Model set', 'A cut-and-project set with a regular acceptance window. Computational and visual.'],
      ['Substitution', 'A tiling fixed by inflation and replacement rules. Powerful, but not always Euclidean-window.'],
      ['Matching rules', 'Local adjacency constraints force global aperiodicity. Equivalence can be hard.'],
      ['Diffraction', 'A pure-point spectrum gives sharp Bragg peaks. Hypotheses matter.']
    ].forEach(function (d) {
      row.appendChild(html('div', { class: 'definition-tile' }, '<h3>' + d[0] + '</h3><p>' + d[1] + '</p>'));
    });
    container.appendChild(row);
    var W = 860, H = 300;
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
    container.appendChild(s);
    var cols = ['model set', 'substitution', 'matching', 'diffraction'];
    var rows = [
      ['Fibonacci', 'yes', 'yes', 'under conditions', 'yes'],
      ['Penrose', 'yes', 'yes', 'yes', 'yes'],
      ['Pinwheel', 'not regular Euclidean', 'yes', 'varies', 'not pure point'],
      ['Hat / Spectre', 'not established here', 'hierarchical', 'yes', 'active study']
    ];
    cols.forEach(function (c, i) { append(s, 'text', { x: 250 + i * 145, y: 40, fill: css('--text', '#1b1d2a'), 'font-size': 13, 'font-weight': 700, 'text-anchor': 'middle' }, c); });
    rows.forEach(function (r, j) {
      append(s, 'text', { x: 45, y: 82 + j * 48, fill: css('--text', '#1b1d2a'), 'font-size': 14, 'font-weight': 700 }, r[0]);
      for (var i = 1; i < r.length; i++) {
        var x = 185 + (i - 1) * 145, y = 62 + j * 48;
        var positive = r[i] === 'yes';
        append(s, 'rect', { x: x, y: y, width: 125, height: 32, rx: 5, fill: positive ? '#edf4ea' : '#fbfbf8', stroke: positive ? css('--c-window', '#78a66f') : '#dedfd8' });
        append(s, 'text', { x: x + 62.5, y: y + 21, 'text-anchor': 'middle', fill: positive ? css('--c-window', '#78a66f') : css('--text-2', '#565a68'), 'font-size': 12, 'font-weight': positive ? 700 : 600 }, r[i]);
      }
    });
  }

  function mountSubstitutionWang(container) {
    var state = { example: 'substitution' };
    var controls = html('div', { class: 'controls segmented' });
    [
      ['substitution', 'substitution'],
      ['wang', 'Wang tiles']
    ].forEach(function (item, i) {
      var b = html('button', { type: 'button', class: i === 0 ? 'active' : '', 'aria-pressed': i === 0 ? 'true' : 'false' }, item[1]);
      b.addEventListener('click', function () {
        state.example = item[0];
        Array.prototype.forEach.call(controls.querySelectorAll('button'), function (x) {
          x.classList.remove('active');
          x.setAttribute('aria-pressed', 'false');
        });
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
        draw();
      });
      controls.appendChild(b);
    });
    container.appendChild(controls);
    var target = html('div');
    container.appendChild(target);
    function draw() {
      clear(target);
      var W = 860, H = 360;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);
      if (state.example === 'substitution') drawSubstitutionExample(s);
      else drawWangExample(s);
    }
    draw();
  }

  function drawSubstitutionExample(s) {
    append(s, 'text', { x: 55, y: 42, fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, 'L-tromino chair: one tile inflates into four');
    // Parent at unit scale: 2u x 2u with bottom-right u x u corner cut.
    var u1 = 30, x0 = 80, y0 = 80;
    drawLTromino(s, x0, y0, u1, 0, false, css('--c-physical', '#c46f2f'), 0.78);
    append(s, 'text', { x: x0 + u1, y: y0 + 2 * u1 + 22, 'text-anchor': 'middle', fill: css('--text-2', '#565a68'), 'font-size': 12 }, 'parent (scale 1)');
    arrow(s, x0 + 2 * u1 + 30, y0 + u1, x0 + 2 * u1 + 110, y0 + u1, css('--c-gold', '#b9942f'));
    append(s, 'text', { x: x0 + 2 * u1 + 70, y: y0 + u1 - 10, 'text-anchor': 'middle', fill: css('--c-gold', '#b9942f'), 'font-size': 13, 'font-weight': 700 }, 'inflate x2');
    // Inflated parent at 2x scale, tiled by four sub-trominoes at unit scale.
    var u2 = u1, X = 320, Y = y0;
    var subs = [
      { rot: 0, mirror: false, dx: 0, dy: 0, color: css('--c-physical', '#c46f2f') },
      { rot: 0, mirror: true,  dx: 2, dy: 0, color: css('--c-internal', '#1f7a8c') },
      { rot: 2, mirror: true,  dx: 0, dy: 2, color: css('--c-window', '#78a66f') },
      { rot: 0, mirror: false, dx: 1, dy: 1, color: css('--c-gold', '#b9942f') }
    ];
    subs.forEach(function (t) {
      drawLTromino(s, X + t.dx * u2, Y + t.dy * u2, u2, t.rot, t.mirror, t.color, 0.6);
    });
    // Outline of the inflated parent.
    var bigPolygon = [[0, 0], [4 * u2, 0], [4 * u2, 2 * u2], [2 * u2, 2 * u2], [2 * u2, 4 * u2], [0, 4 * u2]];
    append(s, 'polygon', {
      points: bigPolygon.map(function (p) { return [X + p[0], Y + p[1]].join(','); }).join(' '),
      fill: 'none',
      stroke: css('--text-2', '#565a68'),
      'stroke-width': 1.6,
      'stroke-dasharray': '4 3'
    });
    append(s, 'text', { x: X + 2 * u2, y: Y + 4 * u2 + 22, 'text-anchor': 'middle', fill: css('--text-2', '#565a68'), 'font-size': 12 }, '4 sub-tiles at scale 1 fill the scale-2 chair');
    append(s, 'text', { x: 540, y: 105, fill: css('--text-2', '#565a68'), 'font-size': 14 }, 'A substitution tiling is controlled by a finite rewrite rule.');
    append(s, 'text', { x: 540, y: 132, fill: css('--text-2', '#565a68'), 'font-size': 14 }, 'Iterating substitution generates the entire tiling from a seed,');
    append(s, 'text', { x: 540, y: 156, fill: css('--text-2', '#565a68'), 'font-size': 14 }, 'with no Euclidean window in sight.');
    append(s, 'text', { x: 540, y: 200, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'The chair has a model-set description only with a p-adic internal');
    append(s, 'text', { x: 540, y: 220, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'space, not a Euclidean one. That is why article 4 exists.');
  }

  // L-tromino with cells (0,0), (1,0), (0,1) at scale u, optionally rotated and mirrored.
  function drawLTromino(s, x, y, u, rot, mirror, color, opacity) {
    var pts = [[0, 0], [2 * u, 0], [2 * u, u], [u, u], [u, 2 * u], [0, 2 * u]];
    var cx = u, cy = u;
    var rad = rot * Math.PI / 2;
    var co = Math.cos(rad), si = Math.sin(rad);
    var transformed = pts.map(function (p) {
      var px = p[0] - cx;
      var py = p[1] - cy;
      if (mirror) px = -px;
      var nx = px * co - py * si;
      var ny = px * si + py * co;
      return [x + cx + nx, y + cy + ny];
    });
    append(s, 'polygon', {
      points: transformed.map(function (p) { return p.join(','); }).join(' '),
      fill: color,
      opacity: opacity,
      stroke: color,
      'stroke-width': 1.5,
      'stroke-linejoin': 'round'
    });
  }

  function drawWangExample(s) {
    append(s, 'text', { x: 55, y: 42, fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, 'edge colors make adjacency a local computation');
    var palette = [css('--c-physical', '#c46f2f'), css('--c-internal', '#1f7a8c'), css('--c-window', '#78a66f'), css('--c-gold', '#b9942f')];
    var tiles = [
      [0, 1, 2, 3], [1, 2, 3, 0], [2, 3, 0, 1],
      [3, 0, 1, 2], [0, 2, 1, 3], [2, 1, 3, 0],
      [1, 3, 0, 2], [3, 2, 1, 0], [0, 1, 3, 2]
    ];
    tiles.forEach(function (edges, idx) {
      var col = idx % 3, row = Math.floor(idx / 3);
      drawWangTile(s, 88 + col * 72, 80 + row * 72, 54, edges, palette);
    });
    append(s, 'text', { x: 360, y: 110, fill: css('--text-2', '#565a68'), 'font-size': 14 }, 'A placement is legal only when touching edges have the same color.');
    append(s, 'text', { x: 360, y: 139, fill: css('--text-2', '#565a68'), 'font-size': 14 }, 'Small toy sets demonstrate the interface. Berger-style');
    append(s, 'text', { x: 360, y: 163, fill: css('--text-2', '#565a68'), 'font-size': 14 }, 'undecidability needs a much larger construction.');
    append(s, 'line', { x1: 650, y1: 92, x2: 704, y2: 92, stroke: palette[1], 'stroke-width': 7 });
    append(s, 'line', { x1: 704, y1: 92, x2: 704, y2: 146, stroke: palette[2], 'stroke-width': 7 });
    append(s, 'text', { x: 650, y: 214, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'local rule');
    append(s, 'text', { x: 650, y: 238, fill: css('--text', '#1b1d2a'), 'font-size': 16, 'font-weight': 700 }, 'match every shared edge');
  }

  function drawWangTile(s, x, y, size, edges, palette) {
    append(s, 'rect', { x: x, y: y, width: size, height: size, fill: '#fbfbf8', stroke: '#dedfd8' });
    append(s, 'line', { x1: x, y1: y, x2: x + size, y2: y, stroke: palette[edges[0]], 'stroke-width': 6 });
    append(s, 'line', { x1: x + size, y1: y, x2: x + size, y2: y + size, stroke: palette[edges[1]], 'stroke-width': 6 });
    append(s, 'line', { x1: x + size, y1: y + size, x2: x, y2: y + size, stroke: palette[edges[2]], 'stroke-width': 6 });
    append(s, 'line', { x1: x, y1: y + size, x2: x, y2: y, stroke: palette[edges[3]], 'stroke-width': 6 });
  }

  function mountHatSpectre(container) {
    var W = 860, H = 360;
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
    container.appendChild(s);
    drawHatTile(s, 155, 170, 42, -0.08, css('--c-physical', '#c46f2f'), false, 0.72);
    drawHatTile(s, 302, 170, 42, 0.08, css('--c-gold', '#b9942f'), true, 0.46);
    append(s, 'text', { x: 221, y: 295, 'text-anchor': 'middle', fill: css('--c-physical', '#c46f2f'), 'font-size': 15, 'font-weight': 700 }, 'Hat uses reflected copies');
    drawSpectreTile(s, 485, 168, 43, -0.1, css('--c-internal', '#1f7a8c'), 0.7);
    append(s, 'line', { x1: 535, y1: 77, x2: 590, y2: 132, stroke: css('--c-boundary', '#b44a3f'), 'stroke-width': 4, 'stroke-linecap': 'round' });
    append(s, 'line', { x1: 590, y1: 77, x2: 535, y2: 132, stroke: css('--c-boundary', '#b44a3f'), 'stroke-width': 4, 'stroke-linecap': 'round' });
    append(s, 'text', { x: 500, y: 295, 'text-anchor': 'middle', fill: css('--c-internal', '#1f7a8c'), 'font-size': 15, 'font-weight': 700 }, 'Spectre forbids reflection');
    append(s, 'rect', { x: 640, y: 70, width: 170, height: 170, rx: 6, fill: '#fbfbf8', stroke: '#dedfd8' });
    append(s, 'text', { x: 725, y: 104, 'text-anchor': 'middle', fill: css('--text', '#1b1d2a'), 'font-size': 15, 'font-weight': 700 }, 'Open edges');
    ['diffraction', 'substitution spectra', 'formation mechanisms', 'definition equivalence'].forEach(function (t, i) {
      append(s, 'circle', { cx: 665, cy: 136 + i * 25, r: 3.2, fill: css('--c-gold', '#b9942f') });
      append(s, 'text', { x: 678, y: 141 + i * 25, fill: css('--text-2', '#565a68'), 'font-size': 12 }, t);
    });
    append(s, 'text', { x: 54, y: 38, fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 }, 'monotile outlines, shown as single-tile comparisons');
  }

  // The Hat, Hurtle, and Turtle are members of a one-parameter family
  // Tile(a,b) due to Smith, Myers, Kaplan, Goodman-Strauss (arXiv:2303.10798).
  // Edge lengths alternate a and b around a fixed 13-edge sequence on a kite
  // grid; every Hat tiling is also a valid Tile(a,b) tiling for any (a,b).
  // This figure morphs (a,b) along Hat -> Hurtle -> Turtle and applies the
  // same shape to a fixed cluster of placements, with optional Spectre
  // edge curves and reflected-tile coloring.
  function mountHatSpectrePatch(container) {
    var SQRT3 = Math.sqrt(3);
    var STOPS = [
      { t: 0,    name: 'Hat',    detail: 'a = 1, b = sqrt 3' },
      { t: 0.5,  name: 'Hurtle', detail: 'a = 1, b = 1 (Spectre base)' },
      { t: 1,    name: 'Turtle', detail: 'a = sqrt 3, b = 1' }
    ];
    var state = { morph: 0, curvature: 0, showReflected: true };

    function shapeAt(t) {
      // Two-segment path through (a,b) parameter space so the slider
      // passes through every named stop exactly:
      //   t = 0.0 -> Hat    (1, sqrt 3)
      //   t = 0.5 -> Hurtle (1, 1)
      //   t = 1.0 -> Turtle (sqrt 3, 1)
      // Linear Hat -> Turtle would skip Hurtle (it crosses the symmetric
      // point at a = b = (1 + sqrt 3) / 2 instead).
      if (t <= 0.5) {
        var u = t / 0.5;
        return { a: 1, b: SQRT3 + u * (1 - SQRT3) };
      }
      var v = (t - 0.5) / 0.5;
      return { a: 1 + v * (SQRT3 - 1), b: 1 };
    }
    function nearestStop(t) {
      for (var i = 0; i < STOPS.length; i++) {
        if (Math.abs(t - STOPS[i].t) < 0.025) return STOPS[i];
      }
      return null;
    }
    function polyArea(pts) {
      var a = 0;
      for (var i = 0; i < pts.length; i++) {
        var j = (i + 1) % pts.length;
        a += pts[i][0] * pts[j][1] - pts[j][0] * pts[i][1];
      }
      return Math.abs(a) / 2;
    }
    var REF_AREA = polyArea(monotileVertices(1, SQRT3));

    // A small, hand-arranged cluster of placements. The (a,b) morph deforms
    // every tile in lockstep; positions and rotations are fixed. The single
    // reflected tile shows the lone reflected member of any small Hat patch
    // and disappears under the Spectre interpretation (when curved edges
    // are enabled with a = b = 1, reflection becomes forbidden).
    var PATCH = [
      { tx:   0.0, ty:  0.0, rot: 210, reflected: true  },
      { tx:   3.6, ty:  2.1, rot:  90, reflected: false },
      { tx:  -3.6, ty:  2.1, rot: 330, reflected: false },
      { tx:   0.0, ty: -4.2, rot: 210, reflected: false },
      { tx:   7.2, ty:  0.0, rot: 150, reflected: false },
      { tx:  -7.2, ty:  0.0, rot:  30, reflected: false },
      { tx:   3.6, ty: -6.3, rot:  90, reflected: false },
      { tx:  -3.6, ty: -6.3, rot: 330, reflected: false }
    ];

    var controls = html('div', { class: 'controls' });
    var sliderLabel = html('label', {}, 'shape morph <input type="range" min="0" max="100" step="1" value="0" style="width:200px"><span class="value" data-v="shape">Hat</span>');
    controls.appendChild(sliderLabel);
    var refLabel = html('label', {}, '<input type="checkbox" checked> color reflected');
    controls.appendChild(refLabel);
    var curveLabel = html('label', {}, '<input type="checkbox"> Spectre curves');
    controls.appendChild(curveLabel);
    container.appendChild(controls);

    var jumpRow = html('div', { class: 'controls segmented' });
    var jumpButtons = STOPS.map(function (st) {
      var b = html('button', { type: 'button', class: st.t === 0 ? 'active' : '', 'aria-pressed': st.t === 0 ? 'true' : 'false' }, 'jump to ' + st.name);
      b.addEventListener('click', function () {
        state.morph = st.t;
        sliderLabel.querySelector('input').value = String(Math.round(st.t * 100));
        draw();
      });
      jumpRow.appendChild(b);
      return { stop: st, btn: b };
    });
    container.appendChild(jumpRow);

    var target = html('div');
    container.appendChild(target);

    sliderLabel.querySelector('input').addEventListener('input', function (e) {
      state.morph = +e.target.value / 100;
      draw();
    });
    refLabel.querySelector('input').addEventListener('change', function (e) {
      state.showReflected = e.target.checked;
      draw();
    });
    curveLabel.querySelector('input').addEventListener('change', function (e) {
      state.curvature = e.target.checked ? 0.18 : 0;
      draw();
    });

    function draw() {
      clear(target);
      var W = 900, H = 470;
      var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H });
      target.appendChild(s);

      var shape = shapeAt(state.morph);
      var stop = nearestStop(state.morph);
      var displayName = stop ? stop.name : ('Tile(' + shape.a.toFixed(2) + ', ' + shape.b.toFixed(2) + ')');
      var curveSuffix = state.curvature > 0 ? ' + curves' : '';

      var label = container.querySelector('[data-v="shape"]');
      if (label) label.textContent = displayName + curveSuffix;

      jumpButtons.forEach(function (j) {
        var active = stop && stop.name === j.stop.name;
        j.btn.classList.toggle('active', !!active);
        j.btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      append(s, 'rect', { x: 44, y: 56, width: 580, height: 380, rx: 6, fill: '#fbfbf8', stroke: '#dedfd8' });
      append(s, 'rect', { x: 660, y: 74, width: 200, height: 340, rx: 6, fill: '#fbfbf8', stroke: '#dedfd8' });

      var verts = monotileVertices(shape.a, shape.b);
      var area = polyArea(verts);
      var sizeNorm = Math.sqrt(REF_AREA / area);
      var BASE = 17;
      var renderScale = BASE * sizeNorm;
      var cx = 334, cy = 246;

      var REGULAR = css('--c-physical', '#c46f2f');
      var REFLECTED = css('--c-internal', '#1f7a8c');
      var CURVED_STROKE = css('--c-boundary', '#b44a3f');

      var nReflected = 0;
      PATCH.forEach(function (p) {
        var color = (state.showReflected && p.reflected) ? REFLECTED : REGULAR;
        if (p.reflected) nReflected++;
        var rotRad = p.rot * Math.PI / 180;
        var tx = cx + p.tx * renderScale;
        var ty = cy + p.ty * renderScale;
        if (state.curvature > 0) {
          var d = monotilePath(shape.a, shape.b, state.curvature, tx, ty, renderScale, rotRad, p.reflected);
          append(s, 'path', {
            d: d,
            fill: color,
            opacity: 0.62,
            stroke: state.curvature > 0 ? CURVED_STROKE : color,
            'stroke-width': 1.4,
            'stroke-linejoin': 'round'
          });
        } else {
          var pts = verts.map(function (v) {
            return transformPoint(v, tx, ty, renderScale, rotRad, p.reflected);
          });
          append(s, 'polygon', {
            points: pts.map(function (q) { return q.join(','); }).join(' '),
            fill: color,
            opacity: 0.62,
            stroke: color,
            'stroke-width': 1.4,
            'stroke-linejoin': 'round'
          });
        }
      });

      append(s, 'text', { x: 64, y: 38, fill: css('--text', '#1b1d2a'), 'font-size': 17, 'font-weight': 700 },
        'Tile(a,b): one polygon family deforming a fixed cluster');

      var px = 680, py = 96;
      append(s, 'text', { x: px, y: py, fill: css('--text', '#1b1d2a'), 'font-size': 14, 'font-weight': 700 }, 'Edge lengths');
      append(s, 'text', { x: px, y: py + 22, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'a = ' + shape.a.toFixed(3));
      append(s, 'text', { x: px, y: py + 40, fill: css('--text-2', '#565a68'), 'font-size': 13 }, 'b = ' + shape.b.toFixed(3));

      append(s, 'text', { x: px, y: py + 78, fill: css('--text', '#1b1d2a'), 'font-size': 14, 'font-weight': 700 }, 'Family stops');
      STOPS.forEach(function (st, i) {
        var active = stop && stop.name === st.name;
        var yLine = py + 102 + i * 38;
        append(s, 'circle', { cx: px + 5, cy: yLine - 4, r: 4.5, fill: active ? css('--c-gold', '#b9942f') : '#dedfd8' });
        append(s, 'text', { x: px + 18, y: yLine, fill: css('--text', '#1b1d2a'), 'font-size': 13, 'font-weight': active ? 700 : 600 }, st.name);
        append(s, 'text', { x: px + 18, y: yLine + 16, fill: css('--text-2', '#565a68'), 'font-size': 11 }, st.detail);
      });

      append(s, 'text', { x: px, y: py + 234, fill: css('--text', '#1b1d2a'), 'font-size': 14, 'font-weight': 700 }, 'Reflected tiles');
      append(s, 'text', { x: px, y: py + 254, fill: css('--text-2', '#565a68'), 'font-size': 12 }, 'this cluster: ' + nReflected + ' of ' + PATCH.length);
      append(s, 'text', { x: px, y: py + 272, fill: css('--text-2', '#565a68'), 'font-size': 11 }, 'Hat tilings: 1 in phi^4 + 1');
      append(s, 'text', { x: px, y: py + 288, fill: css('--text-2', '#565a68'), 'font-size': 11 }, 'Spectre tilings: 0 (chiral)');
      if (state.curvature > 0) {
        append(s, 'text', { x: px, y: py + 312, fill: CURVED_STROKE, 'font-size': 11, 'font-style': 'italic' }, 'Spectre edges: reflection forbidden');
      }

      append(s, 'text', { x: 64, y: 458, fill: css('--text-2', '#565a68'), 'font-size': 12 },
        'Same combinatorial cluster, three named members of one continuous polygon family. Tile(1,1) admits periodic tilings; chiral edge curves break that and recover the Spectre.');
    }

    draw();
  }

  // The Hat outline follows the public hatviz hex-grid coordinates. Spectre
  // uses the Tile(1,1) move list and reference curve formula from the monotile
  // outline generator.
  function hatVertices() {
    var h = Math.sqrt(3) / 2;
    function hexPoint(x, y) { return [x + 0.5 * y, h * y]; }
    return centerPoints([
      hexPoint(0, 0),
      hexPoint(-1, -1),
      hexPoint(0, -2),
      hexPoint(2, -2),
      hexPoint(2, -1),
      hexPoint(4, -2),
      hexPoint(5, -1),
      hexPoint(4, 0),
      hexPoint(3, 0),
      hexPoint(2, 2),
      hexPoint(0, 3),
      hexPoint(0, 2),
      hexPoint(-1, 2)
    ]);
  }

  function monotileMoves(a, b) {
    var c = Math.cos(Math.PI / 3), sn = Math.sin(Math.PI / 3);
    return [
      [c * b, sn * b], [b, 0], [0, a], [sn * a, c * a],
      [c * b, -sn * b], [-c * b, -sn * b], [sn * a, -c * a], [0, -a],
      [0, -a], [-sn * a, -c * a], [-c * b, sn * b], [-b, 0],
      [0, a], [-sn * a, c * a]
    ];
  }

  function monotileVertices(a, b) {
    var moves = monotileMoves(a, b);
    var pts = [[0, 0]], current = [0, 0];
    for (var i = 0; i < moves.length - 1; i++) {
      current = add(current, moves[i]);
      pts.push(current);
    }
    return centerPoints(pts);
  }

  function drawHatTile(s, cx, cy, scale, rot, color, mirror, opacity) {
    var verts = hatVertices();
    append(s, 'polygon', {
      points: verts.map(function (p) { return transformPoint(p, cx, cy, scale, rot, mirror).join(','); }).join(' '),
      fill: color,
      opacity: opacity,
      stroke: color,
      'stroke-width': 1.5,
      'stroke-linejoin': 'round'
    });
  }

  function drawSpectreTile(s, cx, cy, scale, rot, color, opacity) {
    append(s, 'path', {
      d: monotilePath(1, 1, 0.18, cx, cy, scale, rot, false),
      fill: color,
      opacity: opacity,
      stroke: color,
      'stroke-width': 1.5,
      'stroke-linejoin': 'round'
    });
  }

  // Curved-edge version of Tile(1,1). The control points follow the public
  // monotile outline generator: each relative move bends around its midpoint.
  function monotilePath(a, b, curve, cx, cy, scale, rot, mirror) {
    var moves = monotileMoves(a, b);
    var pts = [[0, 0]], current = [0, 0];
    moves.slice(0, -1).forEach(function (m) {
      current = add(current, m);
      pts.push(current);
    });
    var c = centroid(pts);
    current = sub([0, 0], c);
    var d = 'M ' + transformPoint(current, cx, cy, scale, rot, mirror).join(' ');
    moves.forEach(function (m) {
      var dx = m[0], dy = m[1];
      var c1 = [current[0] + dx / 2 - curve * dy, current[1] + dy / 2 + curve * dx];
      var c2 = [current[0] + dx / 2 + curve * dy, current[1] + dy / 2 - curve * dx];
      var p1 = [current[0] + dx, current[1] + dy];
      var c1t = transformPoint(c1, cx, cy, scale, rot, mirror);
      var c2t = transformPoint(c2, cx, cy, scale, rot, mirror);
      var end = transformPoint(p1, cx, cy, scale, rot, mirror);
      d += ' C ' + c1t.join(' ') + ' ' + c2t.join(' ') + ' ' + end.join(' ');
      current = p1;
    });
    return d + ' Z';
  }

  function centerPoints(points) {
    var c = centroid(points);
    return points.map(function (p) { return [p[0] - c[0], p[1] - c[1]]; });
  }

  function centroid(points) {
    var sum = points.reduce(function (acc, p) { return [acc[0] + p[0], acc[1] + p[1]]; }, [0, 0]);
    return [sum[0] / points.length, sum[1] / points.length];
  }

  function transformPoint(p, cx, cy, scale, rot, mirror) {
    var x = mirror ? -p[0] : p[0];
    var y = p[1];
    var co = Math.cos(rot), si = Math.sin(rot);
    return [cx + scale * (x * co - y * si), cy + scale * (x * si + y * co)];
  }

  function add(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k]; }

  global.QUASI = {
    phi: phi,
    sigmaPhi: sigmaPhi,
    articles: articles,
    mountIndex: mountIndex,
    mountArticle: mountArticle,
    drawThumb: drawThumb
  };
})(window);
