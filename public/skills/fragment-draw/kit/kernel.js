/* ################################################################################################
 * fragment-draw kernel. Fixed: never edit it, never paste a changed copy. A piece calls fragment().
 *
 * INDEX: everything a piece may use. Read this comment, not the code under it.
 *
 * fragment(piece)                       declares the piece and mounts it on the bench. Call it once, last.
 *   piece.kind      "diagram" | "illustration" | "field"
 *   piece.name      lowercase, one word or hyphenated
 *   piece.means     one sentence, 140 characters at most: what it shows. The line under the plate.
 *   piece.title     optional title, top left of the plate (illustration and field), 48 characters at most
 *
 * kind "diagram": a live schema map, as on the product pages. HTML nodes, SVG edges, a $ that travels them.
 *   size            [w, h] of the map in CSS px; default [504, 560]
 *   nodes           [{ id, label, x, y, accounts?, muted? }]   x, y: the node's centre
 *     accounts      [{ name, type: "asset" | "liability" | "income" | "expense", muted? }]
 *   edges           [{ from, to, money?, muted?, via? }]        money defaults to true; via: [[x, y], …] corners
 *   steps           [["from~to", …], …]  which edges carry money together, in order; default one edge a step
 *   travel          ms a $ takes for one step (1200);  pause: ms of stillness at the end of the lap (700)
 *
 * kind "illustration": a flipbook of SVG frames in a plate, as in the blog, the docs and the stories.
 *   size            [w, h] viewBox; one of [621, 500] [621, 450] [621, 469] [720, 500] [491, 361] [1200, 795]
 *   frames          how many frames; 1 for a still
 *   hold            ms each frame shows (1200), or (i) => ms for frame i
 *   rest            the frame shown under reduced motion and as the thumbnail (default: the last)
 *   draw(i, k)      returns frame i as SVG markup (no <svg> wrapper). k is the kit below.
 *   narrow          optional { size: [378, 469], title?, draw(i, k) }: the same frames recomposed for a phone, shown
 *                   when the plate is under 520px wide, as the site ships a Mobile frame beside each frame
 *                   (378 × 469 for a 621-wide plate, 291 × 361 for 491 × 361, 640 × 796 for 1200 × 795)
 *
 *   k.c(token, a?)                  "rgb(var(--colour-token))"; a (0–1) only for neutral tokens (main*, negative, canvas, shadow)
 *   k.CH                            the width of one character at 14px (FragmentMono advance × 14)
 *   k.w(text, size = 14)            width of text in px
 *   k.title(text)                   the plate's title at (20, 32), 14px, main
 *   k.text(x, y, text, o)           o: { size 14, tone "main", anchor "start" | "middle" | "end", italic }
 *   k.label(x, y, text, o)          14px, main-500: the caption over a group ("API", "Response", "Entries"); o: { size, tone }
 *   k.box(x, y, w, h, o)            o: { tone "main", fill "negative", width 1, dash }
 *   k.node(cx, cy, text, o)         a 40px-tall box with its label centred; o: { w, tone, size }
 *   k.line(points, o)               an open polyline; o: { tone "main", width 0.7, dash }
 *   k.arrow(points, o)              a polyline ending in an open 45° chevron; o: { tone "main", width 0.7, head 9 }
 *   k.dot(cx, cy, type, r = 6)      an account mark: asset, liability, income, expense (letter in the disc)
 *   k.ledger(x, y, s = 12)          the ledger mark: four squares, green blue / red yellow
 *   k.entry(cx, cy, r = 6)          the entry mark: a disc in four quarters
 *   k.window(x, y, w, h, o)         app window chrome; o: { dark, shadow, bar 14 }; returns markup, content goes after it
 *   k.rows(x, y, w, rows, o)        a ruled table: rows [[cell, …], …], cell = text | { text, tone, align, w }
 *                                   o: { h 18, cols [widths], head: true (first row is a header in main-500), fill "main-100" }
 *   k.chip(x, y, text, o)           a filled tag; o: { fill "main", tone "negative", size 14, pad 6 }
 *   k.drum(cx, y, w, h, o)          a database or bucket: a cylinder, top ellipse at y; o: { tone, width 0.7, label }
 *   k.phone(x, y, w, h, o)          a phone's outline, the one rounded box; o: { r 28, tone }
 *   k.caret(x, y, h = 16, on = true) the typing caret
 *   k.check(x, y, o) / k.bang(x, y, o)  ✓ drawn in main and ! in orange; o: { size 14, tone }, (x, y) on the baseline
 *   k.cursor(x, y)                  a pointer arrow, tip at (x, y)
 *   k.typed(text, n)                the first n characters (n clamps)
 *   k.blink(i, every = 1)           true on alternate frames: for a ! or a caret that blinks
 *   k.esc(text)                     escapes text for markup (text() and label() already do)
 *
 * kind "field": the number field, as on /v2. A canvas grid of three-character cells, each a number or empty.
 *   period          ms for one seamless lap (5000)
 *   still           the t (0–1) shown under reduced motion and as the thumbnail (0.5)
 *   seed            integer (7)
 *   setup(g)        optional, once per grid size; whatever it returns is g.data
 *   cell(c, r, t, g) returns null (empty) or { value 1–100, tone, fill, label }
 *     tone          "ink" | "mid" | "far" | "scenery" (greys, near to far) | "green" | "red" | "blue" | "yellow" | "orange"
 *     fill          null, or a colour name: the cell is filled and its text turns black or white to suit
 *     label         replaces the number: a currency ("$4"), a mark ("v2"); three characters at most
 *
 *   g.cols, g.rows, g.data
 *   g.hash(x, y, s)        0–1, stable          g.noise(x, y, s)    smooth value noise, 0–1
 *   g.fbm(x, y, s)         three octaves, 0–1   g.loop(x, y, t, s, r = 1)  fbm on a circle: seamless in t
 *   g.smooth(x)            smoothstep of 0–1    g.ease(x)           ease in-out, 0–1
 *   g.clamp(x, a, b)       g.fract(x)           g.mix(a, b, x)
 *   g.ellipse(c, r, cx, cy, rx, ry)  0 at the edge, 1 at the centre; cx, cy, rx, ry in 0–1 of the grid
 *   g.cap(c, r)            the cell's ceiling, one of 28 44 52 61 73 81 88 100: values never pass it
 *   g.digit(c, r, t, rate = 1)  a number 1–99 that changes rate times a lap, different in each cell
 *   g.currency(c, r, v)    "$4", "€7", "£2", "¥9" for v 1–9; null otherwise
 *   g.life(name)           a Game of Life oscillator's cells, [[x, y], …]: blinker toad beacon clock pulsar
 *   g.step(cells, n)       that pattern after n generations, on its own; returns [[x, y], …]
 *
 * The bench drives the clock, the theme and the controls. A piece writes no timer, no
 * requestAnimationFrame, no colour of its own, and no event listener.
 * ############################################################################################## */

var FD = (function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ADV = 0.6; // FragmentMono advance, in em; measured on mount
  var clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  var fract = function (x) { return ((x % 1) + 1) % 1; };
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
  var NEUTRAL = /^(main(-\d+)?|negative|canvas|shadow|always-white|always-black)$/;
  var c = function (t, a) {
    if (a == null || a >= 1) return "rgb(var(--colour-" + t + "))";
    if (!NEUTRAL.test(t)) throw new Error("fragment: alpha is only for neutral tokens, not " + t);
    return "rgb(var(--colour-" + t + ") / " + a + ")";
  };

  function measure() {
    try {
      var x = document.createElement("canvas").getContext("2d");
      x.font = "100px FragmentMono, monospace";
      ADV = x.measureText("0").width / 100 || 0.6;
    } catch (e) { /* keep 0.6 */ }
  }

  /* ---------- the illustration kit: SVG strings, colours by token ---------- */

  var ACCOUNT = { asset: ["asset-green", "A"], liability: ["liability-red", "L"], income: ["income-blue", "I"], expense: ["expense-yellow", "E"] };
  var kit = {
    c: c,
    esc: esc,
    get CH() { return ADV * 14; },
    w: function (s, size) { return String(s).length * ADV * (size || 14); },
    text: function (x, y, s, o) {
      o = o || {};
      return '<text x="' + x + '" y="' + y + '" font-family="FragmentMono, monospace" font-size="' + (o.size || 14) + '"' +
        (o.italic ? ' font-style="italic"' : "") + ' fill="' + c(o.tone || "main") + '" text-anchor="' + (o.anchor || "start") +
        '" xml:space="preserve">' + esc(s) + "</text>";
    },
    label: function (x, y, s, o) { o = o || {}; return kit.text(x, y, s, { size: o.size || 14, tone: o.tone || "main-500", anchor: o.anchor }); },
    title: function (s) { return kit.text(20, 32, s, { size: 14 }); },
    box: function (x, y, w, h, o) {
      o = o || {};
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + (o.fill === "none" ? "none" : c(o.fill || "negative")) +
        '" stroke="' + c(o.tone || "main") + '" stroke-width="' + (o.width || 1) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : "") + "/>";
    },
    node: function (cx, cy, s, o) {
      o = o || {};
      var size = o.size || 14, w = o.w || Math.round(kit.w(s, size) + 36), h = 40;
      return kit.box(cx - w / 2, cy - h / 2, w, h, { tone: o.tone }) + kit.text(cx, cy + size * 0.36, s, { size: size, tone: o.tone || "main", anchor: "middle" });
    },
    line: function (p, o) {
      o = o || {};
      return '<path d="M' + p.map(function (q) { return q[0] + " " + q[1]; }).join(" L") + '" fill="none" stroke="' + c(o.tone || "main") +
        '" stroke-width="' + (o.width || 0.7) + '" stroke-linejoin="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : "") + "/>";
    },
    arrow: function (p, o) {
      o = o || {};
      var a = p[p.length - 2], b = p[p.length - 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, h = o.head || 9;
      var ux = dx / l, uy = dy / l, px = -uy, py = ux;
      var head = [[b[0] - ux * h + px * h, b[1] - uy * h + py * h], b, [b[0] - ux * h - px * h, b[1] - uy * h - py * h]];
      return kit.line(p, o) + kit.line(head, { tone: o.tone, width: o.width });
    },
    dot: function (cx, cy, type, r) {
      r = r || 6;
      var a = ACCOUNT[type];
      if (!a) throw new Error("fragment: dot type must be asset, liability, income or expense");
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + c(a[0]) + '"/>' +
        kit.text(cx, cy + r * 0.5, a[1], { size: Math.round(r * 1.45), tone: type === "expense" ? "always-black" : "negative", anchor: "middle" });
    },
    ledger: function (x, y, s) {
      s = s || 12; var h = s / 2;
      return '<g data-mark="ledger"><rect x="' + x + '" y="' + y + '" width="' + h + '" height="' + h + '" fill="' + c("asset-green") + '"/>' +
        '<rect x="' + (x + h) + '" y="' + y + '" width="' + h + '" height="' + h + '" fill="' + c("income-blue") + '"/>' +
        '<rect x="' + x + '" y="' + (y + h) + '" width="' + h + '" height="' + h + '" fill="' + c("liability-red") + '"/>' +
        '<rect x="' + (x + h) + '" y="' + (y + h) + '" width="' + h + '" height="' + h + '" fill="' + c("expense-yellow") + '"/></g>';
    },
    entry: function (cx, cy, r) {
      r = r || 6;
      var q = function (a0, t) {
        var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a0 + Math.PI / 2), y1 = cy + r * Math.sin(a0 + Math.PI / 2);
        return '<path d="M' + cx + " " + cy + " L" + x0 + " " + y0 + " A" + r + " " + r + " 0 0 1 " + x1 + " " + y1 + ' Z" fill="' + c(t) + '"/>';
      };
      return '<g data-mark="entry">' + q(-Math.PI / 2, "income-blue") + q(0, "expense-yellow") + q(Math.PI / 2, "liability-red") + q(Math.PI, "asset-green") + "</g>";
    },
    window: function (x, y, w, h, o) {
      o = o || {};
      var bar = o.bar || 14, dark = !!o.dark, s = "";
      if (o.shadow || dark) s += '<rect x="' + (x + 3) + '" y="' + (y + 3) + '" width="' + w + '" height="' + h + '" fill="' + c("shadow", 0.25) + '"/>';
      s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c(dark ? "main" : "main-100") + '" stroke="' + c(dark ? "main" : "main-500") + '" stroke-width="0.5"/>';
      s += kit.line([[x, y + bar], [x + w, y + bar]], { tone: dark ? "main-800" : "main-300", width: 0.5 });
      for (var i = 0; i < 3; i++) s += '<circle cx="' + (x + 7 + i * 6.5) + '" cy="' + (y + bar / 2) + '" r="2" fill="' + c(dark ? "main-800" : "main-300") + '"/>';
      return s;
    },
    rows: function (x, y, w, rows, o) {
      o = o || {};
      var h = o.h || 18, cols = o.cols, s = "";
      rows.forEach(function (row, i) {
        var top = y + i * h, head = o.head && i === 0;
        if (!head) s += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + h + '" fill="' + c(o.fill || "main-100") + '" stroke="' + c("main-300") + '" stroke-width="0.5"/>';
        var cx = x + 6;
        row.forEach(function (cell, j) {
          var cw = cols ? cols[j] : (w - 12) / row.length, t = typeof cell === "object" ? cell : { text: cell };
          var al = t.align || (j === row.length - 1 && row.length > 1 ? "end" : "start");
          var tx = al === "end" ? cx + cw : al === "middle" ? cx + cw / 2 : cx;
          if (t.text != null && t.text !== "") s += kit.text(tx, top + h / 2 + (t.size || 13) * 0.36, t.text, { size: t.size || 13, tone: t.tone || (head ? "main-500" : "main"), anchor: al });
          cx += cw;
        });
      });
      return s;
    },
    chip: function (x, y, s, o) {
      o = o || {};
      var size = o.size || 14, pad = o.pad == null ? 6 : o.pad, w = kit.w(s, size) + pad * 2, h = size + pad;
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c(o.fill || "main") + '"' + (o.round ? ' rx="' + h / 2 + '"' : "") + "/>" +
        kit.text(x + pad, y + h / 2 + size * 0.36, s, { size: size, tone: o.tone || "negative" });
    },
    drum: function (cx, y, w, h, o) {
      o = o || {};
      var rx = w / 2, ry = Math.max(4, w * 0.12), l = cx - rx, r = cx + rx, b = y + h, tone = c(o.tone || "main"), sw = o.width || 0.7;
      return '<path d="M' + l + " " + y + " L" + l + " " + b + " A" + rx + " " + ry + " 0 0 0 " + r + " " + b + " L" + r + " " + y +
        '" fill="' + c("negative") + '" stroke="' + tone + '" stroke-width="' + sw + '"/>' +
        '<ellipse cx="' + cx + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + c("negative") + '" stroke="' + tone + '" stroke-width="' + sw + '"/>' +
        (o.label ? kit.text(cx, y + h / 2 + ry / 2 + 4, o.label, { size: o.size || 12, anchor: "middle", tone: o.tone }) : "");
    },
    phone: function (x, y, w, h, o) {
      o = o || {};
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.r || 28) + '" fill="' + c("negative") + '" stroke="' + c(o.tone || "main") + '" stroke-width="1"/>';
    },
    caret: function (x, y, h, on) { return on === false ? "" : '<rect x="' + x + '" y="' + (y - (h || 16) * 0.8) + '" width="1" height="' + (h || 16) + '" fill="' + c("main") + '"/>'; },
    check: function (x, y, o) {
      o = o || {};
      var s = o.size || 14;
      return '<path d="M' + x + " " + (y - s * 0.36) + " L" + (x + s * 0.3) + " " + (y - s * 0.05) + " L" + (x + s * 0.85) + " " + (y - s * 0.72) +
        '" fill="none" stroke="' + c(o.tone || "main") + '" stroke-width="' + (s > 18 ? 1.25 : 1) + '" stroke-linecap="round" stroke-linejoin="round"/>';
    },
    bang: function (x, y, o) { o = o || {}; return kit.text(x, y, "!", { size: o.size || 14, tone: o.tone || "orange" }); },
    cursor: function (x, y) {
      return '<path d="M' + x + " " + y + " l0 15 l3.6 -3.4 l2.6 5.6 l2.3 -1.1 l-2.6 -5.4 l5 0 Z" + '" fill="' + c("negative") + '" stroke="' + c("main") + '" stroke-width="1" stroke-linejoin="round"/>';
    },
    typed: function (s, n) { return String(s).slice(0, clamp(Math.floor(n), 0, String(s).length)); },
    blink: function (i, every) { return Math.floor(i / (every || 1)) % 2 === 0; },
  };

  /* ---------- deterministic noise for the field ---------- */

  function hash(x, y, s) {
    var h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 362437);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  var smooth = function (x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  var ease = function (x) { x = clamp(x, 0, 1); return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
  function noise(x, y, s) {
    var x0 = Math.floor(x), y0 = Math.floor(y), u = smooth(x - x0), v = smooth(y - y0);
    var a = hash(x0, y0, s), b = hash(x0 + 1, y0, s), d = hash(x0, y0 + 1, s), e = hash(x0 + 1, y0 + 1, s);
    var top = a + (b - a) * u;
    return top + (d + (e - d) * u - top) * v;
  }
  function fbm(x, y, s) {
    var t = 0;
    for (var o = 0; o < 3; o++) t += noise(x * Math.pow(2.1, o), y * Math.pow(2.1, o), s + 17 * o) * Math.pow(0.5, o + 1);
    return t / 0.875;
  }
  var CAPS = [28, 44, 52, 61, 73, 81, 88, 100], CURRENCY = ["$", "€", "£", "¥"];
  var LIFE = {
    blinker: [[0, 0], [1, 0], [2, 0]],
    toad: [[1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1]],
    beacon: [[0, 0], [1, 0], [0, 1], [1, 1], [2, 2], [3, 2], [2, 3], [3, 3]],
    clock: [[2, 0], [0, 1], [2, 1], [1, 2], [3, 2], [1, 3]],
    pulsar: [[2,0],[3,0],[4,0],[8,0],[9,0],[10,0],[0,2],[5,2],[7,2],[12,2],[0,3],[5,3],[7,3],[12,3],[0,4],[5,4],[7,4],[12,4],[2,5],[3,5],[4,5],[8,5],[9,5],[10,5],[2,7],[3,7],[4,7],[8,7],[9,7],[10,7],[0,8],[5,8],[7,8],[12,8],[0,9],[5,9],[7,9],[12,9],[0,10],[5,10],[7,10],[12,10],[2,12],[3,12],[4,12],[8,12],[9,12],[10,12]],
  };
  function step(cells, n) {
    var live = new Set(cells.map(function (p) { return p[0] + "," + p[1]; }));
    for (var g = 0; g < n; g++) {
      var count = new Map();
      live.forEach(function (k) {
        var p = k.split(",").map(Number);
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if (dx || dy) {
          var q = p[0] + dx + "," + (p[1] + dy);
          count.set(q, (count.get(q) || 0) + 1);
        }
      });
      var next = new Set();
      count.forEach(function (n2, k) { if (n2 === 3 || (n2 === 2 && live.has(k))) next.add(k); });
      live = next;
    }
    return Array.from(live).map(function (k) { return k.split(",").map(Number); });
  }

  /** The g a field's cell() gets, for a grid of cols × rows at phase t. */
  function grid(cols, rows, t, seed, data) {
    return {
      cols: cols, rows: rows, t: t, data: data, seed: seed,
      hash: hash, noise: noise, fbm: fbm, smooth: smooth, ease: ease, clamp: clamp, fract: fract,
      mix: function (a, b, x) { return a + (b - a) * x; },
      loop: function (x, y, tt, s, r) { var a = fract(tt) * Math.PI * 2; r = r || 1; return fbm(x + Math.cos(a) * r, y + Math.sin(a) * r, s); },
      ellipse: function (cc, rr, cx, cy, rx, ry) {
        var x = ((cc + 0.5) / cols - cx) / rx, y = ((rr + 0.5) / rows - cy) / ry;
        return clamp(1 - Math.hypot(x, y), 0, 1);
      },
      cap: function (cc, rr) { return CAPS[Math.floor(hash(cc, rr, 1009) * CAPS.length)]; },
      digit: function (cc, rr, tt, rate) { var k = Math.floor(fract(tt) * (rate || 1) + hash(cc, rr, seed + 3) * 1000); return 1 + Math.floor(hash(cc + k * 31, rr, seed + 11) * 99); },
      currency: function (cc, rr, v) { return v >= 1 && v <= 9 ? CURRENCY[Math.floor(hash(cc, rr, seed + 8) * 4)] + v : null; },
      life: function (name) { return (LIFE[name] || []).map(function (q) { return q.slice(); }); },
      step: step,
    };
  }

  /* ---------- engines: each returns { seek(x), play(), pause(), playing(), readout(), destroy() } ---------- */

  function illustration(stage, p) {
    var n = Math.max(1, p.frames | 0 || 1), rest = p.rest == null ? n - 1 : p.rest;
    var hold = typeof p.hold === "function" ? p.hold : function () { return p.hold || 1200; };
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", p.means);
    svg.style.display = "block";
    stage.appendChild(svg);
    var i = reduced ? rest : 0, drawn = -1, timer = 0, on = !reduced && n > 1, seen = true, variant = null;
    // the narrow set, as the site ships a Mobile frame beside each one, below 520px of plate
    function pick() {
      var v = p.narrow && stage.clientWidth && stage.clientWidth < 520 ? "narrow" : "wide";
      if (v === variant) return false;
      variant = v;
      var size = v === "narrow" ? p.narrow.size || [378, 469] : p.size || [621, 500];
      svg.setAttribute("viewBox", "0 0 " + size[0] + " " + size[1]);
      stage.style.aspectRatio = size[0] + " / " + size[1];
      drawn = -1;
      return true;
    }
    function draw(k) {
      if (k === drawn) return;
      drawn = k;
      var narrow = variant === "narrow", size = narrow ? p.narrow.size || [378, 469] : p.size || [621, 500];
      var title = narrow ? p.narrow.title || p.title : p.title;
      svg.innerHTML = '<rect width="' + size[0] + '" height="' + size[1] + '" fill="' + c("negative") + '"/>' + (title ? kit.title(title) : "") + (narrow ? p.narrow.draw : p.draw)(k, kit);
    }
    pick();
    var ro = new ResizeObserver(function () { if (pick()) draw(i); });
    ro.observe(stage);
    function tick() {
      timer = 0;
      if (!on || !seen) return;
      i = (i + 1) % n;
      draw(i);
      timer = setTimeout(tick, hold(i));
    }
    function go() { clearTimeout(timer); timer = on && seen && n > 1 ? setTimeout(tick, hold(i)) : 0; }
    var io = new IntersectionObserver(function (e) { seen = e[0].isIntersecting; go(); });
    io.observe(stage);
    draw(i);
    return {
      frames: n,
      seek: function (k) { i = clamp(Math.round(k), 0, n - 1); draw(i); go(); },
      play: function () { on = n > 1; go(); },
      pause: function () { on = false; go(); },
      playing: function () { return on; },
      at: function () { return i; },
      readout: function () { return (n > 1 ? "frame " + (i + 1) + "/" + n : "still") + (variant === "narrow" ? " · narrow" : ""); },
      destroy: function () { clearTimeout(timer); io.disconnect(); ro.disconnect(); svg.remove(); },
    };
  }

  function field(stage, p) {
    var period = p.period || 5000, seed = p.seed == null ? 7 : p.seed, still = p.still == null ? 0.5 : p.still;
    var box = document.createElement("div"), cv = document.createElement("canvas"), ctx = cv.getContext("2d");
    box.style.cssText = "position:relative;width:100%;aspect-ratio:1/1;font:20px/27px FragmentMono,monospace";
    cv.style.cssText = "display:block;width:100%;height:100%";
    cv.setAttribute("aria-hidden", "true");
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", p.means);
    box.appendChild(cv);
    stage.appendChild(box);
    var layout = null, data = null, pal = null, t = reduced ? still : 0, on = !reduced, seen = true, raf = 0, last = -1e9, t0 = performance.now() - t * period;
    function palette() {
      var cs = getComputedStyle(document.documentElement);
      var rgb = function (name, a) { var ch = (cs.getPropertyValue("--colour-" + name).match(/\d+/g) || [0, 0, 0]).slice(0, 3); return "rgba(" + ch.join(",") + "," + a + ")"; };
      return {
        paper: rgb("negative", 1),
        tones: { ink: rgb("main", 1), mid: rgb("main", 0.71), far: rgb("main", 0.52), scenery: rgb("main", 0.34), green: rgb("asset-green", 1), red: rgb("liability-red", 1), yellow: rgb("expense-yellow", 1), blue: rgb("income-blue", 1), orange: rgb("orange", 1) },
        onLight: rgb("always-black", 1), onDark: rgb("always-white", 1),
      };
    }
    function layoutOf() {
      var w = box.clientWidth, h = box.clientHeight;
      if (!w || !h) return null;
      var narrow = w < 520, type = narrow ? 14 : 20, lh = narrow ? 18 : 27, m = Math.min(w, h) * 56 / 1080, cw = 3 * ADV * type;
      var cols = Math.max(1, Math.floor((w - 2 * m) / cw)), rows = Math.max(1, Math.floor((h - 2 * m) / lh));
      if (!layout || layout.w !== w || layout.h !== h) {
        layout = { w: w, h: h, type: type, lh: lh, cw: cw, cols: cols, rows: rows, ox: (w - cols * cw) / 2, oy: (h - rows * lh) / 2 };
        data = p.setup ? p.setup(api(layout, 0)) : null;
      }
      return layout;
    }
    function api(L, tt) { return grid(L.cols, L.rows, tt, seed, data); }
    function render() {
      var L = layoutOf();
      if (!L) return;
      if (!pal) pal = palette();
      var r = window.devicePixelRatio || 1, W = Math.round(L.w * r), H = Math.round(L.h * r);
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      ctx.setTransform(W / L.w, 0, 0, H / L.h, 0, 0);
      ctx.fillStyle = pal.paper;
      ctx.fillRect(0, 0, L.w, L.h);
      ctx.font = L.type + "px FragmentMono, monospace";
      ctx.textBaseline = "alphabetic";
      var g = api(L, t), base = (L.lh + 0.72 * L.type) / 2, out = [];
      for (var rr = 0; rr < L.rows; rr++) for (var cc = 0; cc < L.cols; cc++) {
        var v = p.cell(cc, rr, t, g);
        if (!v) continue;
        var val = v.value == null ? 0 : Math.round(clamp(v.value, 0, 100));
        if (!val && v.label == null) continue;
        out.push([cc, rr, v, val]);
      }
      out.forEach(function (o) {
        if (!o[2].fill) return;
        ctx.fillStyle = pal.tones[o[2].fill] || pal.tones.ink;
        var x0 = Math.round(L.ox + o[0] * L.cw), x1 = Math.round(L.ox + (o[0] + 1) * L.cw), y0 = Math.round(L.oy + o[1] * L.lh), y1 = Math.round(L.oy + (o[1] + 1) * L.lh);
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      });
      out.forEach(function (o) {
        var v = o[2], s = v.label != null ? String(v.label).slice(0, 3) : String(o[3]);
        ctx.fillStyle = v.fill ? (v.fill === "orange" ? pal.paper : v.fill === "red" ? pal.onDark : pal.onLight) : (pal.tones[v.tone] || pal.tones.ink);
        ctx.fillText(s, L.ox + o[0] * L.cw, L.oy + o[1] * L.lh + base);
      });
    }
    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (now - last < 1000 / 30) return;
      last = now;
      t = fract((now - t0) / period);
      render();
    }
    function go() {
      cancelAnimationFrame(raf);
      raf = 0;
      if (on && seen) { t0 = performance.now() - t * period; raf = requestAnimationFrame(frame); }
    }
    var io = new IntersectionObserver(function (e) { seen = e[0].isIntersecting; go(); });
    io.observe(box);
    var ro = new ResizeObserver(function () { render(); });
    ro.observe(box);
    var mo = new MutationObserver(function () { pal = null; render(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    var ready = document.fonts ? document.fonts.load("20px FragmentMono") : Promise.resolve();
    ready.then(function () { measure(); layout = null; render(); go(); }, function () { render(); go(); });
    return {
      frames: 0,
      seek: function (x) { t = fract(x); render(); go(); },
      play: function () { on = true; go(); },
      pause: function () { on = false; go(); },
      playing: function () { return on; },
      at: function () { return t; },
      readout: function () { return "t " + t.toFixed(2); },
      destroy: function () { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); mo.disconnect(); box.remove(); },
    };
  }

  function diagram(stage, p) {
    var size = p.size || [504, 560], travel = p.travel || 1200, pause = p.pause == null ? 700 : p.pause;
    var root = document.createElement("div");
    root.className = "fd-flow";
    root.setAttribute("role", "img");
    root.setAttribute("aria-label", p.means);
    root.style.cssText = "position:relative;width:" + size[0] + "px;height:" + size[1] + "px;margin:0 auto;font:14px/18px FragmentMono,monospace;color:" + c("main") + ";background:" + c("negative");
    var wrap = document.createElement("div");
    wrap.style.cssText = "width:100%;display:flex;justify-content:center;overflow:hidden";
    wrap.appendChild(root);
    stage.appendChild(wrap);
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;overflow:visible";
    root.appendChild(svg);
    var byId = {};
    (p.nodes || []).forEach(function (n) {
      var el = document.createElement("div");
      el.style.cssText = "position:absolute;z-index:1;left:" + n.x + "px;top:" + n.y + "px;transform:translate(-50%,-50%);display:flex;flex-direction:column;white-space:nowrap;" +
        "border:1.25px solid " + c(n.muted ? "main-300" : "main") + ";background:" + c("negative") + ";padding:1ch;color:" + c(n.muted ? "main-500" : "main");
      var head = document.createElement("div");
      head.textContent = n.label;
      el.appendChild(head);
      if (n.accounts && n.accounts.length) {
        head.style.paddingBottom = "1ch";
        var list = document.createElement("div");
        list.style.cssText = "margin:0 -1ch;border-top:1.25px solid " + c(n.muted ? "main-300" : "main") + ";padding:1ch 1ch 0;line-height:1;display:flex;flex-direction:column;gap:2px";
        n.accounts.forEach(function (a) {
          var A = ACCOUNT[a.type] || ACCOUNT.asset;
          var row = document.createElement("div");
          row.style.cssText = "display:flex;align-items:center;gap:.5ch;" + (a.muted ? "color:" + c("main-500") : "");
          row.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" style="flex:none;width:1ch;height:1ch"><circle cx="6" cy="6" r="6" fill="' + c(A[0]) + '"/>' +
            '<text x="6" y="9" text-anchor="middle" font-family="FragmentMono,monospace" font-size="8.5" fill="' + c(a.type === "expense" ? "always-black" : "negative") + '">' + A[1] + "</text></svg>";
          var name = document.createElement("span");
          name.textContent = a.name;
          row.appendChild(name);
          list.appendChild(row);
        });
        el.appendChild(list);
      }
      root.appendChild(el);
      byId[n.id] = { n: n, el: el };
    });
    var edges = (p.edges || []).map(function (e) { return { e: e, id: e.from + "~" + e.to }; });
    var steps = p.steps || edges.filter(function (x) { return x.e.money !== false && !x.e.muted; }).map(function (x) { return [x.id]; });
    var dur = steps.length * travel + pause, playing = !reduced, seen = true;

    function rect(id) {
      var o = byId[id];
      if (!o) throw new Error("fragment: no node " + id);
      var el = o.el;
      return { cx: o.n.x, cy: o.n.y, l: o.n.x - el.offsetWidth / 2, r: o.n.x + el.offsetWidth / 2, t: o.n.y - el.offsetHeight / 2, b: o.n.y + el.offsetHeight / 2 };
    }
    function route(e) {
      var a = rect(e.from), b = rect(e.to), pts;
      if (e.via) {
        var first = e.via[0], last = e.via[e.via.length - 1];
        var start = Math.abs(first[0] - a.cx) < 1 ? [a.cx, first[1] > a.cy ? a.b : a.t] : [first[0] > a.cx ? a.r : a.l, a.cy];
        var end = Math.abs(last[0] - b.cx) < 1 ? [b.cx, last[1] < b.cy ? b.t : b.b] : [last[0] < b.cx ? b.l : b.r, b.cy];
        pts = [start].concat(e.via, [end]);
      } else if (b.t >= a.b - 1) {
        var mid = Math.round((a.b + b.t) / 2);
        pts = Math.abs(a.cx - b.cx) < 1 ? [[a.cx, a.b], [b.cx, b.t]] : [[a.cx, a.b], [a.cx, mid], [b.cx, mid], [b.cx, b.t]];
      } else if (b.b <= a.t + 1) {
        var mid2 = Math.round((a.t + b.b) / 2);
        pts = Math.abs(a.cx - b.cx) < 1 ? [[a.cx, a.t], [b.cx, b.b]] : [[a.cx, a.t], [a.cx, mid2], [b.cx, mid2], [b.cx, b.b]];
      } else {
        var right = b.cx > a.cx, x0 = right ? a.r : a.l, x1 = right ? b.l : b.r, midx = Math.round((x0 + x1) / 2);
        pts = Math.abs(a.cy - b.cy) < 1 ? [[x0, a.cy], [x1, b.cy]] : [[x0, a.cy], [midx, a.cy], [midx, b.cy], [x1, b.cy]];
      }
      return pts;
    }
    function draw() {
      var kt = function (x) { return clamp(x, 0, 1); }, f = 46 / dur, html = "";
      edges.forEach(function (x, k) {
        var pts = route(x.e), id = "fd-e" + k, tone = x.e.muted ? "main-300" : "main";
        var d = "M" + pts.map(function (q) { return q[0] + "," + q[1]; }).join(" L");
        html += '<path id="' + id + '" d="' + d + '" fill="none" stroke="' + c(tone) + '" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>';
        var A = pts[pts.length - 2], B = pts[pts.length - 1], dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
        var tip = [B[0] - ux * 11, B[1] - uy * 11];
        html += '<path d="M' + (tip[0] - ux * 6 - uy * 6) + "," + (tip[1] - uy * 6 + ux * 6) + " L" + tip[0] + "," + tip[1] + " L" + (tip[0] - ux * 6 + uy * 6) + "," + (tip[1] - uy * 6 - ux * 6) +
          '" fill="none" stroke="' + c(tone) + '" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>';
        var s = steps.findIndex(function (st) { return st.indexOf(x.id) >= 0; });
        if (s < 0 || reduced) return;
        var a = kt(s * travel / dur), b = kt((s + 1) * travel / dur);
        var times = a <= 0 ? [0, b - f, b, 1] : [0, a, a + f, b - f, b, 1], vals = a <= 0 ? "1;1;0;0" : "0;0;1;1;0;0";
        html += '<g opacity="0"><animate attributeName="opacity" dur="' + dur + 'ms" repeatCount="indefinite" calcMode="linear" keyTimes="' + times.join(";") + '" values="' + vals + '"/>' +
          '<circle r="11" fill="' + c("negative") + '"/><text fill="' + c("main") + '" font-family="FragmentMono, monospace" font-size="17" text-anchor="middle" dominant-baseline="central">$</text>' +
          '<animateMotion dur="' + dur + 'ms" repeatCount="indefinite" calcMode="linear" keyTimes="' + (a <= 0 ? "0;" + b + ";1" : "0;" + a + ";" + b + ";1") + '" keyPoints="' + (a <= 0 ? "0;1;1" : "0;0;1;1") + '"><mpath href="#' + id + '"/></animateMotion></g>';
      });
      svg.innerHTML = html;
      if (!playing) svg.pauseAnimations();
    }
    function fit() {
      var avail = wrap.clientWidth, k = Math.min(1, avail / size[0]);
      root.style.transform = k < 1 ? "scale(" + k + ")" : "";
      root.style.transformOrigin = "top center";
      wrap.style.height = size[1] * k + "px";
    }
    function sync() { if (playing && seen) svg.unpauseAnimations(); else svg.pauseAnimations(); }
    var io = new IntersectionObserver(function (e) { seen = e[0].isIntersecting; sync(); });
    io.observe(wrap);
    var ro = new ResizeObserver(fit);
    ro.observe(wrap);
    var ready = document.fonts ? document.fonts.load("14px FragmentMono") : Promise.resolve();
    draw();
    fit();
    ready.then(function () { draw(); sync(); });
    return {
      frames: 0,
      seek: function (x) { svg.setCurrentTime(fract(x) * dur / 1000); },
      play: function () { playing = true; sync(); },
      pause: function () { playing = false; sync(); },
      playing: function () { return playing; },
      at: function () { return fract(svg.getCurrentTime() * 1000 / dur); },
      readout: function () { var s = Math.floor(fract(svg.getCurrentTime() * 1000 / dur) * dur / travel); return s < steps.length ? "step " + (s + 1) + "/" + steps.length : "rest"; },
      destroy: function () { io.disconnect(); ro.disconnect(); wrap.remove(); },
    };
  }

  measure();
  return { kit: kit, grid: grid, engines: { illustration: illustration, field: field, diagram: diagram }, reduced: reduced, version: "0.1.0" };
})();

/** Declares the piece. The bench (bench.html) defines window.__mount; without it, the piece mounts in #stage. */
function fragment(piece) {
  if (!piece || !FD.engines[piece.kind]) throw new Error("fragment: kind must be diagram, illustration or field");
  if (!/^[a-z][a-z0-9-]*$/.test(piece.name || "")) throw new Error("fragment: name must be lowercase, one word or hyphenated");
  if (!piece.means || piece.means.length > 140) throw new Error("fragment: means is one sentence, 140 characters at most");
  window.__piece = piece;
  if (typeof window.__mount === "function") return window.__mount(piece);
  return FD.engines[piece.kind](document.getElementById("stage"), piece);
}
