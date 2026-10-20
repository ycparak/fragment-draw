export type Colour = "asset-green" | "income-blue";

export interface NavLink { id: string; label: string }
export interface NavGroup { num: string; title: string; colour: Colour; mark: "squares" | "wheel"; links: NavLink[] }

export const groups: NavGroup[] = [
  {
    num: "1", title: "fragment-draw", colour: "asset-green", mark: "squares",
    links: [
      { id: "install", label: "Install" },
      { id: "use", label: "How to use it" },
      { id: "how", label: "How it works" },
      { id: "draws", label: "What it draws" },
    ],
  },
  {
    num: "2", title: "The source", colour: "income-blue", mark: "wheel",
    links: [
      { id: "kinds", label: "Three kinds" },
      { id: "rules", label: "The ten rules" },
      { id: "learned", label: "What it learned from" },
      { id: "files", label: "The files" },
    ],
  },
];

export const links: NavLink[] = groups.flatMap((g) => g.links);

/** A lettered or numbered row. `d` may hold inline markup. */
export interface Row { k: string; b: string; rest?: string; d: string }

export const how: Row[] = [
  { k: "A", b: "Kind.", d: "It reads the idea as a diagram, an illustration or a field, and asks when it could be two." },
  { k: "B", b: "Concepts.", d: "It offers two or three, one line each: what is on the plate, what changes, the sentence it says. You pick one." },
  { k: "C", b: "Build.", d: "It writes only the piece. The engine, the page and the tokens are pasted in as they are." },
  { k: "D", b: "Check.", d: "A script checks the piece against the rules text can check; then the agent looks at it in both themes, narrow, and through a whole lap." },
  { k: "E", b: "Hand over.", d: "You get the page, what it means, its timing, the rules it leans on, and anything it could not check." },
  { k: "F", b: "Adjust.", d: "Ask for changes while you use it. It edits the piece and checks again." },
];

export const rules: Row[] = [
  { k: "01", b: "mono", rest: "One typeface, a short scale", d: "FragmentMono for everything: 14 for titles, labels and captions, 16 for code, 24 for a hero row. No bold: emphasis is ink against grey." },
  { k: "02", b: "plate", rest: "White on grey, a fixed set of sizes", d: "621 × 500 for the blog and docs, 720 × 500 for a story's hero, 491 × 361 for security, square for a field." },
  { k: "03", b: "hairline", rest: "Four weights of line, no effects", d: "0.5, 0.7, 1 and 1.25. No gradient, blur, opacity or soft shadow; square corners." },
  { k: "04", b: "grey", rest: "Grey carries depth", d: "Ink is now, main-500 is secondary, main-300 is not yet. What becomes the subject goes from grey to ink." },
  { k: "05", b: "colour", rest: "Colour is accounting", d: "Green assets, red liabilities, blue income, yellow expenses, orange attention. Three in a frame at most." },
  { k: "06", b: "space", rest: "Centred and sparse", d: "One composition in the middle, about half the plate wide, the white kept round it." },
  { k: "07", b: "boxes", rest: "Boxes and chevrons", d: "Square boxes, straight orthogonal lines, open chevrons; two lines into a box share a trunk." },
  { k: "08", b: "money", rest: "Money moves as $", d: "In a diagram the only thing that moves is a $ on a white disc: 1200 ms a step, in order, then still." },
  { k: "09", b: "flipbook", rest: "Motion is a flipbook", d: "Whole frames, one small change each: a character typed, a digit cleared, a part lit. 1200 ms, or 140 ms for typing." },
  { k: "10", b: "words", rest: "Real objects, real words", d: "<code>Entry_1234</code>, <code>assets/cash</code>, <code>addLedgerEntry()</code>, <code>38,000.00 USD</code>. No lorem, no icons, no metaphors." },
];

export interface SkillFile { name: string; file?: string; d: string }

export const files: SkillFile[] = [
  { name: "SKILL.md", file: "SKILL.md", d: "The steps: kind, concepts, build, check, hand over, adjust." },
  { name: "style.md", file: "style.md", d: "The ten rules." },
  { name: "diagrams.md", file: "diagrams.md", d: "Schema maps: nodes, accounts, routing, steps." },
  { name: "illustrations.md", file: "illustrations.md", d: "Flipbooks: the vocabulary and nine patterns." },
  { name: "fields.md", file: "fields.md", d: "The number field: grid, tones, fills, the five on /v2." },
  { name: "catalogue.md", file: "catalogue.md", d: "Every finished piece, page by page." },
  { name: "references.md", file: "references.md", d: "Nineteen frames from the site: picture, filmstrip and measured geometry for each pattern." },
  { name: "look.md", file: "look.md", d: "What to check with eyes." },
  { name: "kit/kernel.js", file: "kit/kernel.js", d: "The three engines and the drawing kit. Fixed." },
  { name: "build · validate · export", d: "Three Node scripts, no dependencies." },
];
