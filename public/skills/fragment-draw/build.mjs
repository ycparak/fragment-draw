#!/usr/bin/env node
// Assembles a piece into one self-contained page: `node build.mjs <name>.js [out.html]`.
// The page is the bench with the tokens, the fonts, the kernel and the piece put in place. Nothing else changes.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const [, , input, output] = process.argv;
if (!input) {
  console.error("usage: node build.mjs <name>.js [out.html]");
  process.exit(2);
}

const piece = readFileSync(resolve(input), "utf8");
let declared;
try {
  vm.runInNewContext(piece, { fragment: (p) => { declared = p; }, console }, { timeout: 2000 });
} catch (e) {
  console.error(`build: ${input} throws when it runs: ${e.message}`);
  process.exit(1);
}
if (!declared || !declared.name) {
  console.error(`build: ${input} never calls fragment({ kind, name, means, … }).`);
  process.exit(1);
}

const font = (f) => `data:font/woff2;base64,${readFileSync(join(here, "kit", "fonts", f)).toString("base64")}`;
const css = readFileSync(join(here, "kit", "fragment.css"), "utf8")
  .replace("FRAGMENT_MONO_REGULAR", font("FragmentMono-Regular.woff2"))
  .replace("FRAGMENT_MONO_ITALIC", font("FragmentMono-Italic.woff2"));
const kernel = readFileSync(join(here, "kit", "kernel.js"), "utf8");
const bench = readFileSync(join(here, "kit", "bench.html"), "utf8");

// by function, so a `$` in the kernel or the piece is never read as a replacement pattern
const page = bench
  .replace("/*CSS*/", () => css)
  .replace("/*KERNEL*/", () => kernel)
  .replace("/*FIGURE*/", () => piece)
  .replace("<title>fragment-draw</title>", () => `<title>${declared.name} · fragment-draw</title>`);

const out = output || `fragment-${declared.name}.html`;
writeFileSync(out, page);
console.log(`built ${out} (${declared.kind}, ${(page.length / 1024).toFixed(0)} KB)`);
