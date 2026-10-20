#!/usr/bin/env node
// Writes a piece in the form fragment.dev's components take: `node export.mjs <name>.js [out dir]`.
//   illustration → one SVG per frame, named <name>-a-diagram.svg, <name>-b-diagram.svg, … (the site's names), and a
//                  <name>-a-diagram-mobile.svg beside each when the piece has a narrow set; colours
//                  kept as rgb(var(--colour-…)) so they theme on the site, and <name>.timing.json with each frame's hold
//   diagram      → <name>.flow.json: size, nodes, edges (each with its from~to id), steps, travel, pause
//   field        → <name>.field.mjs: the piece as an ES module whose default export is its declaration
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const [, , input, outArg] = process.argv;
if (!input) {
  console.error("usage: node export.mjs <name>.js [out dir]");
  process.exit(2);
}

const src = readFileSync(resolve(input), "utf8");
const sandbox = { console, Math, Date, Set, Map, Array, Object, String, Number, JSON, Error, performance: { now: () => 0 } };
vm.createContext(sandbox);
vm.runInContext(readFileSync(join(here, "kit", "kernel.js"), "utf8") + "\n;globalThis.FD = FD;", sandbox);
let p;
vm.runInContext(src, Object.assign(sandbox, { fragment: (x) => { p = x; } }), { timeout: 3000 });
if (!p) {
  console.error(`export: ${input} never calls fragment({ … }).`);
  process.exit(1);
}

const out = resolve(outArg || join("export", p.name));
mkdirSync(out, { recursive: true });
const written = [];
const write = (file, text) => { writeFileSync(join(out, file), text); written.push(file); };

if (p.kind === "illustration") {
  const [w, h] = p.size || [621, 500];
  const n = p.frames | 0 || 1;
  const letter = (i) => (i < 26 ? String.fromCharCode(97 + i) : letter(Math.floor(i / 26) - 1) + String.fromCharCode(97 + (i % 26)));
  const frames = [];
  for (let i = 0; i < n; i++) {
    const body = (p.title ? sandbox.FD.kit.title(p.title) : "") + p.draw(i, sandbox.FD.kit);
    const svg = `<svg width="100%" height="100%" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="rgb(var(--colour-negative))"/>${body}</svg>\n`;
    const file = `${p.name}-${letter(i)}-diagram.svg`;
    write(file, svg);
    const frame = { file, holdMs: typeof p.hold === "function" ? p.hold(i) : p.hold || 1200 };
    if (p.narrow) {
      const [nw, nh] = p.narrow.size || [378, 469];
      const title = p.narrow.title || p.title;
      const nbody = (title ? sandbox.FD.kit.title(title) : "") + p.narrow.draw(i, sandbox.FD.kit);
      frame.mobile = `${p.name}-${letter(i)}-diagram-mobile.svg`;
      write(frame.mobile, `<svg width="100%" height="100%" viewBox="0 0 ${nw} ${nh}" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="${nw}" height="${nh}" fill="rgb(var(--colour-negative))"/>${nbody}</svg>\n`);
    }
    frames.push(frame);
  }
  const holds = frames.map((f) => f.holdMs);
  const delayMs = holds.sort((a, b) => holds.filter((x) => x === b).length - holds.filter((x) => x === a).length)[0];
  write(`${p.name}.timing.json`, JSON.stringify({ name: p.name, means: p.means, size: [w, h], rest: p.rest ?? n - 1, delayMs, loop: true, frames }, null, 2) + "\n");
} else if (p.kind === "diagram") {
  const edges = (p.edges || []).map((e) => ({ id: `${e.from}~${e.to}`, ...e }));
  write(`${p.name}.flow.json`, JSON.stringify({ name: p.name, means: p.means, size: p.size || [504, 560], nodes: p.nodes, edges, steps: p.steps || null, travel: p.travel || 1200, pause: p.pause ?? 700 }, null, 2) + "\n");
} else if (p.kind === "field") {
  write(`${p.name}.field.mjs`, `// ${basename(input)}, as a module: the default export is the field's declaration.\n` + src.replace(/\bfragment\s*\(/, "export default ("));
}

console.log(`exported ${p.kind} ${p.name} to ${out}: ${written.length > 4 ? `${written.length} files` : written.join(", ")}`);
