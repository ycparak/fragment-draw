# fragment-draw

A skill for coding agents that draws in Fragment's visual language: schema-map diagrams, SVG flipbook illustrations and number-field shaders, each as one self-contained HTML file. The site in this folder is its page, built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com) v4 and TypeScript, run with [Bun](https://bun.sh).

```
src/
  pages/index.astro        the skills page, served at /
  layouts/Base.astro       head, the before-paint theme script, the page's script
  components/              Topbar, Rail, Strip, Section, Pill, Example, Rows, ...
  data/page.ts             the nav, the steps, the ten rules and the file list
  scripts/                 the page's behaviour, in TypeScript: title, copy, theme, frames, scroll-spy
  styles/                  global.css (tokens, Tailwind theme) and rail.css (the rail and strip)
  assets/fonts/            FragmentMono, hashed and preloaded by the build
public/                    served as is
  skills/fragment-draw/    the skill: copy this folder into an agent's skills folder
    SKILL.md               the steps the agent follows
    style.md               the ten rules
    diagrams.md  illustrations.md  fields.md   one reference per kind
    catalogue.md           every finished piece on fragment.dev it learned from
    references.md          index of references/: 19 frames from the site as picture, filmstrip and geometry
    look.md                what to check with eyes
    kit/                   kernel.js (the three engines and the drawing kit), bench.html, fragment.css, fonts
    build.mjs  validate.mjs  export.mjs
    examples/              copay.js, clearing.js, carry.js: three finished pieces rebuilt
  made/                    every piece, built, as the page embeds them
examples/                  the three pieces the page shows under "What it draws"
scripts/made.ts            rebuilds public/made from the pieces
scripts/sync.ts            copies the kernel and pieces into the yusufparak.com prototype
```

The skill's own scripts stay plain Node `.mjs` and `.js` with no dependencies: an agent copies the folder and runs them as they are.

## Develop

```sh
bun install
bun run dev        # http://127.0.0.1:4517
bun run build      # type-checks, then writes dist/
bun run preview    # serves dist/
```

Rebuild what the page embeds after changing the kernel or a piece (the frames need http, so view it through `dev` or `preview`, not file://):

```sh
bun run made
```

The Fragment Draw prototype on yusufparak.com (`src/content/prototypes/fragment-draw` in that repo) mounts the kernel and the six pieces as they are. After changing them, validate and copy them into its `_kit/` in the sibling `yusufparak` checkout, or pass another folder:

```sh
bun run sync
```
