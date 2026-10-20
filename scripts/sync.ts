// Copy the kernel and the pieces the prototype page mounts into its _kit folder, after validating each piece.
// The page lives in yusufparak.com's Fragment Draw prototype; pass another folder to copy them somewhere else.
import { copyFileSync, mkdirSync } from "node:fs";
import { basename, join } from "node:path";

const skill = "public/skills/fragment-draw";
const out = process.argv[2] ?? "../yusufparak/src/content/prototypes/fragment-draw/_kit";
const pieces = [
  ...new Bun.Glob(`${skill}/examples/*.js`).scanSync(),
  ...new Bun.Glob("examples/*.js").scanSync(),
].sort();

async function node(...args: string[]): Promise<void> {
  const proc = Bun.spawn(["node", ...args], { stdout: "inherit", stderr: "inherit" });
  if ((await proc.exited) !== 0) process.exit(1);
}

for (const piece of pieces) await node(`${skill}/validate.mjs`, piece);

mkdirSync(join(out, "pieces"), { recursive: true });
copyFileSync(`${skill}/kit/kernel.js`, join(out, "kernel.js"));
for (const piece of pieces) copyFileSync(piece, join(out, "pieces", basename(piece)));
console.log(`copied the kernel and ${pieces.length} pieces to ${out}`);
