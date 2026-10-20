#!/usr/bin/env node
// Checks a piece against the rules that text can check: `node validate.mjs <name>.js`.
// Exits 0 when nothing failed (warnings may print), 1 when something failed, 2 when it cannot run.
//
// The checks, for an agent without Node to answer from its own code:
//   source  · no timer, frame loop, listener, DOM or window access: the kernel owns the clock and the page
//           · no colour of its own: no hex, rgb(), hsl() or named colour; only tokens, through the kit or rgb(var(--colour-…))
//           · 260 lines at most; fragment() is called once
//   declare · kind is diagram, illustration or field; name is lowercase; means ≤ 140 characters; title ≤ 48
//   illus.  · size is a canonical plate; 1–60 frames; each hold 60–4000 ms; rest is a frame
//           · every frame draws, and every narrow frame when there is a narrow set; fills and strokes are tokens or none; stroke widths 0.5 0.7 1 1.25; type sizes from the scale;
//             FragmentMono only; no gradient, filter, image, foreignObject or opacity; nothing past the plate's edge;
//             no frame repeats the one before it; three accent colours at most in a frame
//   diagram · 2–10 nodes with unique ids inside the map; labels ≤ 24 characters; ≤ 6 accounts, each a known type;
//             edges and steps name real nodes and edges; at least one edge carries money
//   field   · period 2000–20000 ms; cell() returns null or { value 0–100, tone, fill, label ≤ 3 }; tones and fills are
//             known; 5–85% of cells are drawn and at most 60% filled, at every quarter of the lap; the lap moves
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const file = process.argv[2];
if (!file) {
  console.error("usage: node validate.mjs <name>.js");
  process.exit(2);
}

const failed = [];
const warned = [];
const fail = (m) => failed.push(m);
const warn = (m) => warned.push(m);

const src = readFileSync(resolve(file), "utf8");
const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/.*$/gm, "$1");

// ---- source
for (const [re, what] of [
  [/\brequestAnimationFrame\b/, "requestAnimationFrame"],
  [/\bset(Timeout|Interval)\b/, "a timer"],
  [/\baddEventListener\b|\.on[a-z]+\s*=[^=]/, "an event listener"],
  [/\bdocument\./, "the DOM (document.)"],
  [/\bwindow\./, "window."],
  [/\bfetch\(|\bXMLHttpRequest\b|\bimport\(/, "a network call"],
])
  if (re.test(code)) fail(`source: the piece uses ${what}; the kernel owns the clock and the page`);
if (/#[0-9a-fA-F]{3,8}\b/.test(code.replace(/href="#[^"]*"/g, ""))) fail("source: a hex colour; use a token");
if (/\b(rgba?|hsla?)\(\s*\d/.test(code)) fail("source: an rgb()/hsl() colour of its own; use a token");
if (/\b(fill|stroke|color)\s*=\s*\\?["'](red|black|white|green|blue|yellow|orange|gray|grey)\\?["']/i.test(code)) fail("source: a named colour in markup; use a token");
const lines = src.split("\n").length;
if (lines > 260) fail(`source: ${lines} lines; 260 at most. A longer piece is usually two ideas.`);
if ((code.match(/\bfragment\s*\(/g) || []).length !== 1) fail("source: call fragment({ … }) exactly once, last");

// ---- the kernel, without a page
const sandbox = { console, Math, Date, Set, Map, Array, Object, String, Number, JSON, Error, performance: { now: () => 0 } };
vm.createContext(sandbox);
vm.runInContext(readFileSync(join(here, "kit", "kernel.js"), "utf8") + "\n;globalThis.FD = FD;", sandbox);
const FD = sandbox.FD;
let p;
try {
  vm.runInContext(src, Object.assign(sandbox, { fragment: (x) => { p = x; } }), { timeout: 3000 });
} catch (e) {
  fail(`run: the piece throws: ${e.message}`);
}

const ACCENTS = ["asset-green", "liability-red", "income-blue", "expense-yellow", "orange", "amber", "royal", "forest", "purple", "magenta", "sea"];
const TOKEN = /^rgb\(var\(--colour-([a-z0-9-]+)\)( \/ (0?\.\d+|1))?\)$/;
const PLATES = ["621x500", "621x450", "621x469", "720x500", "491x361", "1200x795"];
const WIDTHS = ["0.5", "0.7", "1", "1.25"];
const SIZES = ["10", "11", "12", "13", "14", "16", "17", "20", "24", "32"];

function checkFrame(svg, i, w, h) {
  const at = `frame ${i + 1}`;
  if (typeof svg !== "string" || !svg.trim()) return fail(`${at}: draw() returned nothing`);
  for (const m of svg.matchAll(/\b(fill|stroke)="([^"]*)"/g)) {
    if (m[2] === "none") continue;
    const t = TOKEN.exec(m[2]);
    if (!t) fail(`${at}: ${m[1]}="${m[2]}" is not a token`);
  }
  for (const m of svg.matchAll(/stroke-width="([^"]*)"/g)) if (!WIDTHS.includes(String(+m[1]))) warn(`${at}: stroke-width ${m[1]}; the line weights are 0.5 0.7 1 1.25`);
  for (const m of svg.matchAll(/font-size="([^"]*)"/g)) if (!SIZES.includes(String(+m[1])) && +m[1] > 9) warn(`${at}: font-size ${m[1]} is off the scale (14 for titles, labels and captions, 16 for code, 24 for a hero row)`);
  for (const m of svg.matchAll(/font-family="([^"]*)"/g)) if (!/^FragmentMono/.test(m[1])) fail(`${at}: font ${m[1]}; FragmentMono only`);
  if (/<(linearGradient|radialGradient|filter|image|foreignObject|pattern)\b/.test(svg)) fail(`${at}: a gradient, filter, image, pattern or foreignObject; Fragment draws flat`);
  if (/\bopacity="/.test(svg)) fail(`${at}: opacity; use a lighter token (main-500, main-300) instead`);
  for (const m of svg.matchAll(/\b(x|cx|x1|x2)="(-?[\d.]+)"/g)) if (+m[2] < -1 || +m[2] > w + 1) fail(`${at}: ${m[1]}=${m[2]} is outside the ${w}-wide plate`);
  for (const m of svg.matchAll(/\b(y|cy|y1|y2)="(-?[\d.]+)"/g)) if (+m[2] < -1 || +m[2] > h + 1) fail(`${at}: ${m[1]}=${m[2]} is outside the ${h}-tall plate`);
  // the ledger and entry marks are four colours by design: they count as none
  const plain = svg.replace(/<g data-mark="[a-z]+">[\s\S]*?<\/g>/g, "");
  const accents = new Set([...plain.matchAll(/--colour-([a-z-]+)\)/g)].map((m) => m[1]).filter((t) => ACCENTS.includes(t)));
  if (accents.size > 3) warn(`${at}: ${accents.size} accent colours (${[...accents].join(", ")}); colour is information, three at most`);
}

if (p) {
  if (!["diagram", "illustration", "field"].includes(p.kind)) fail(`declare: kind "${p.kind}" is not diagram, illustration or field`);
  if (!/^[a-z][a-z0-9-]*$/.test(p.name || "")) fail(`declare: name "${p.name}" must be lowercase, one word or hyphenated`);
  if (!p.means) fail("declare: means is missing");
  else if (p.means.length > 140) fail(`declare: means is ${p.means.length} characters; 140 at most`);
  if (p.title && p.title.length > 48) fail(`declare: title is ${p.title.length} characters; 48 at most`);

  if (p.kind === "illustration") {
    const [w, h] = p.size || [621, 500];
    if (!PLATES.includes(`${w}x${h}`)) warn(`illustration: size ${w}×${h} is not one of the plates (${PLATES.join(", ")})`);
    const n = p.frames | 0 || 1;
    if (n < 1 || n > 60) fail(`illustration: ${n} frames; 1 to 60`);
    if (typeof p.draw !== "function") fail("illustration: draw(i, k) is missing");
    if (p.rest != null && (p.rest < 0 || p.rest >= n)) fail(`illustration: rest ${p.rest} is not a frame`);
    let prev = null;
    for (let i = 0; i < n && typeof p.draw === "function"; i++) {
      const hold = typeof p.hold === "function" ? p.hold(i) : p.hold || 1200;
      if (!(hold >= 60 && hold <= 4000)) fail(`frame ${i + 1}: hold ${hold} ms; 60 to 4000`);
      let svg;
      try {
        svg = p.draw(i, FD.kit);
      } catch (e) {
        fail(`frame ${i + 1}: draw throws: ${e.message}`);
        continue;
      }
      checkFrame((p.title ? FD.kit.title(p.title) : "") + svg, i, w, h);
      if (prev !== null && svg === prev) warn(`frame ${i + 1} repeats frame ${i}; hold the earlier one longer instead`);
      prev = svg;
    }
    if (p.narrow) {
      const [nw, nh] = p.narrow.size || [378, 469];
      if (!["378x469", "291x361", "640x796"].includes(`${nw}x${nh}`)) warn(`narrow: size ${nw}×${nh} is not one of the phone plates (378×469, 291×361, 640×796)`);
      if (nw >= w) warn(`narrow: ${nw} wide is not narrower than the plate's ${w}`);
      if (typeof p.narrow.draw !== "function") fail("narrow: draw(i, k) is missing");
      const title = p.narrow.title || p.title;
      for (let i = 0; i < n && typeof p.narrow.draw === "function"; i++) {
        try {
          checkFrame((title ? FD.kit.title(title) : "") + p.narrow.draw(i, FD.kit), i, nw, nh);
        } catch (e) {
          fail(`narrow frame ${i + 1}: draw throws: ${e.message}`);
        }
      }
    } else if (n > 1) warn("illustration: no narrow set; on a phone the frames scale down as a picture (the site ships a Mobile frame beside each)");
  }

  if (p.kind === "diagram") {
    const [w, h] = p.size || [504, 560];
    const nodes = p.nodes || [];
    const ids = new Set();
    if (nodes.length < 2 || nodes.length > 10) fail(`diagram: ${nodes.length} nodes; 2 to 10`);
    for (const nd of nodes) {
      if (ids.has(nd.id)) fail(`diagram: two nodes are called ${nd.id}`);
      ids.add(nd.id);
      if (!(nd.x >= 0 && nd.x <= w && nd.y >= 0 && nd.y <= h)) fail(`diagram: node ${nd.id} at ${nd.x},${nd.y} is outside the ${w}×${h} map`);
      if (!nd.label || nd.label.length > 24) fail(`diagram: node ${nd.id}'s label is empty or longer than 24 characters`);
      if ((nd.accounts || []).length > 6) fail(`diagram: node ${nd.id} has ${nd.accounts.length} accounts; 6 at most`);
      for (const a of nd.accounts || []) if (!["asset", "liability", "income", "expense"].includes(a.type)) fail(`diagram: account ${a.name} has type ${a.type}`);
    }
    const edges = new Set();
    for (const e of p.edges || []) {
      if (!ids.has(e.from) || !ids.has(e.to)) fail(`diagram: edge ${e.from}~${e.to} names a node that does not exist`);
      edges.add(`${e.from}~${e.to}`);
    }
    for (const s of p.steps || []) for (const id of s) if (!edges.has(id)) fail(`diagram: step names ${id}, which is not an edge`);
    if (!(p.edges || []).some((e) => e.money !== false && !e.muted)) fail("diagram: no edge carries money");
  }

  if (p.kind === "field") {
    const period = p.period || 5000;
    if (period < 2000 || period > 20000) fail(`field: period ${period} ms; 2000 to 20000`);
    if (typeof p.cell !== "function") fail("field: cell(c, r, t, g) is missing");
    const TONES = ["ink", "mid", "far", "scenery", "green", "red", "blue", "yellow", "orange"];
    const cols = 26, rows = 29;
    let data = null;
    try {
      data = p.setup ? p.setup(FD.grid(cols, rows, 0, p.seed ?? 7, null)) : null;
    } catch (e) {
      fail(`field: setup throws: ${e.message}`);
    }
    const shots = [];
    for (const t of [0, 0.25, 0.5, 0.75]) {
      const g = FD.grid(cols, rows, t, p.seed ?? 7, data);
      let drawn = 0, filled = 0, sig = "";
      for (let r = 0; r < rows && typeof p.cell === "function"; r++)
        for (let c = 0; c < cols; c++) {
          let v;
          try {
            v = p.cell(c, r, t, g);
          } catch (e) {
            fail(`field: cell throws at ${c},${r}, t ${t}: ${e.message}`);
            r = rows;
            break;
          }
          if (v == null) { sig += "."; continue; }
          if (typeof v !== "object") { fail("field: cell returns something other than null or an object"); r = rows; break; }
          if (v.value != null && !(v.value >= 0 && v.value <= 100)) fail(`field: value ${v.value} at ${c},${r}; 0 to 100`);
          if (v.tone && !TONES.includes(v.tone)) fail(`field: tone "${v.tone}"; one of ${TONES.join(" ")}`);
          if (v.fill && !TONES.slice(4).includes(v.fill)) fail(`field: fill "${v.fill}"; one of green red blue yellow orange`);
          if (v.label != null && String(v.label).length > 3) fail(`field: label "${v.label}" is longer than three characters`);
          if (v.value || v.label != null) drawn++;
          if (v.fill) filled++;
          sig += `${v.value ?? ""}${v.fill ? "f" : ""}|`;
        }
      const all = cols * rows;
      if (drawn / all < 0.05) fail(`field: at t ${t} only ${Math.round((drawn / all) * 100)}% of cells are drawn; the field reads as empty`);
      if (drawn / all > 0.85) warn(`field: at t ${t} ${Math.round((drawn / all) * 100)}% of cells are drawn; leave the grid room to breathe`);
      if (filled / all > 0.6) warn(`field: at t ${t} ${Math.round((filled / all) * 100)}% of cells are filled; colour is information, not paint`);
      shots.push(sig);
    }
    if (shots.length === 4 && new Set(shots).size === 1) fail("field: the four quarters of the lap are identical; nothing moves");
  }
}

for (const m of warned) console.log(`warn  ${m}`);
for (const m of failed) console.log(`FAIL  ${m}`);
console.log(failed.length ? `${failed.length} failed, ${warned.length} warned: ${file}` : `ok, ${warned.length} warned: ${file}`);
process.exit(failed.length ? 1 : 0);
