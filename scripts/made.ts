// Rebuild what the page embeds after changing the kernel or a piece: validate each example, then build it into public/made.
import { basename } from "node:path";

const skill = "public/skills/fragment-draw";
const pieces = [
  ...new Bun.Glob(`${skill}/examples/*.js`).scanSync(),
  ...new Bun.Glob("examples/*.js").scanSync(),
].sort();

async function node(...args: string[]): Promise<void> {
  const proc = Bun.spawn(["node", ...args], { stdout: "inherit", stderr: "inherit" });
  if ((await proc.exited) !== 0) process.exit(1);
}

for (const piece of pieces) {
  await node(`${skill}/validate.mjs`, piece);
  await node(`${skill}/build.mjs`, piece, `public/made/fragment-${basename(piece, ".js")}.html`);
}
