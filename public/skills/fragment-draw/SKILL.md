---
name: fragment-draw
description: Use when someone asks for a Fragment diagram, illustration or shader (a number field), or runs /fragment-draw with an idea. Draws one piece in the style of fragment.dev's hand-made work (a live schema map where money travels, an SVG flipbook on a plate, or a canvas field of numbers) on a fixed kernel, and hands it over as one self-contained HTML file.
argument-hint: "[diagram | illustration | field] <idea>"
---

# Fragment: draw a piece

You are making one piece in Fragment's visual language: monospace, hairline, white plates on grey, colour only where it means an account. Fragment draws three kinds of piece. You make one of them:

| Kind | What it is | Where it lives on fragment.dev | Reach for it when the idea is |
| --- | --- | --- | --- |
| **diagram** | A live schema map: square boxes in FragmentMono, accounts listed inside, orthogonal lines, a `$` that travels them | The heroes of `/`, `/product/ledgers`, `/product/payments` | how money moves between parties, and which accounts it lands in |
| **illustration** | An SVG flipbook on a plate: boxes, chevrons, app windows, ruled rows, code, typed text, swapped frame by frame | Every post on `/blog`, every guide under `/docs`, the customer stories, the changelog, `/security` | a mechanism, a sequence of states, a UI moment, an architecture |
| **field** | A canvas shader: a grid of two-digit numbers, grey for the world, coloured where the ledger is, in a seamless lap | The five pieces on `/v2` | a mood or a scale (money gathering, settling, sweeping in), a brand moment |

The finished pieces on fragment.dev are the bar. `catalogue.md` lists them, page by page, with what each one teaches. `references/` holds nineteen of their frames as pictures, filmstrips and measured geometry (`references.md`). `examples/` holds three rebuilt in the format you will write: `copay.js` (diagram), `clearing.js` (illustration) and `carry.js` (field).

You write one thing: the piece, `<name>.js`. The engine (`kit/kernel.js`), the page (`kit/bench.html`) and the tokens (`kit/fragment.css`) are fixed. Never edit them, never paste a changed copy of them, and never write again what the kernel already gives you.

Every file named below is in this skill's folder. The piece and the page are written in the person's working directory: run `build.mjs`, `validate.mjs` and `export.mjs` from there, by their path in this folder.

## 0. Kind

Take the kind from the request when it names one ("a diagram of…", "a shader…", "an illustration for the post about…"). A request for a "shader", "number field", "grid of numbers" or anything for `/v2` is a field. A request about money moving between named parties is a diagram. Everything else (a concept for a blog post or a guide, a state change, an architecture, a UI moment) is an illustration.

If the request could be two kinds, say so in one line and offer both as concepts in step 1.

If the request came with the person's own work (an SVG, a screenshot, a link to a page on fragment.dev), read `catalogue.md` for that page first, then look at the work itself: it is the reference, and the piece keeps its plate, its words and its proportions.

## 1. Concept

Read `style.md`: the ten rules. Then read the reference for the kind: `diagrams.md`, `illustrations.md` or `fields.md`. Each has the vocabulary, the proven patterns and the numbers. For an illustration, also read `references.md` and open the reference frames for the patterns you are weighing: the picture, the filmstrip, and the geometry for the numbers.

Offer two or three concepts, one line each:

> **Name.** What is on the plate. What changes (step by step, frame by frame, or over the lap). The one sentence it says.

Wait for the person to pick. Skip this step only when they arrived with the content and the change already chosen. If there is nobody to ask, take the concept with the strongest still frame and say which you took.

One piece, one idea. A concept that needs a paragraph under it to be understood is not a concept yet.

## 2. Build

1. Read the index at the top of `kit/kernel.js`: the comment under the hash line, down to `var FD`. It lists everything you may call. Do not read the code under it.
2. Read the example for your kind: `examples/copay.js`, `examples/clearing.js` or `examples/carry.js`. For an illustration, keep the reference frame for your pattern open beside it (`references/<name>.png` and `.svg`): match its sizes, weights and tones, never its coordinates.
3. Write the piece as `<name>.js` in the person's working directory, in the shape of the example, ending the file with `fragment({ kind, name, means, … })`.
   - `name`: lowercase, one word or hyphenated.
   - `means`: one sentence, 140 characters at most, saying what the piece shows. It is the line under the plate and the piece's accessible name.
   - `title`: only for an illustration or field that sits alone on a page, as the plates in the blog and the docs do; 48 characters at most, sentence case.
   - The words on the plate are the product's own: accounts, entries, invoices, API calls, amounts with two decimals (`style.md`, rule 10).
   - An illustration that moves also gets its phone frames, `narrow` (`illustrations.md`, "Phone frames"): the site ships a Mobile frame beside every frame.
4. Assemble it: `node build.mjs <name>.js` writes `fragment-<name>.html`. Without Node, copy `kit/bench.html`; put `kit/fragment.css` where `/*CSS*/` is (with the two font URLs pointing at `kit/fonts/`), `kit/kernel.js` where `/*KERNEL*/` is, and your piece where `/*FIGURE*/` is, by file operation, changing nothing else.

## 3. Check

1. `node validate.mjs <name>.js`. Fix every line it prints as `FAIL`, and run it again until it exits 0. Read every `warn`: each is a rule bent, and needs a reason you can say.
2. Look at the page, in a browser if you have one. Read `look.md` and answer its questions from these views, each an address on the built page:
   - the rest view: `fragment-<name>.html?at=<rest frame>` for an illustration, `?at=<still>` for a field, `?at=0.3` for a diagram;
   - both themes: add `&theme=light`, then `&theme=dark`;
   - the narrow view: add `&w=320`;
   - the whole lap, playing, once from the start.
   Fix what fails, rebuild, and look again.

Without a browser, answer `look.md` from the code, each answer with the line that makes it true, and say at hand-over, in these words, that the piece was **not looked at in a browser**. Without Node, read the checks listed at the top of `validate.mjs` and answer each one from your code.

Do not hand over a piece the validator rejects. Do not say the look is done if you did not look.

## 4. Hand over

Leave `fragment-<name>.html` where the person can open it and say where it is. Then say, one line each:

- what it shows: the `means`;
- the kind, the plate and the timing (frames × hold, or the period, or steps × travel);
- the rules from `style.md` it leans on most;
- anything you could not verify (no Node, no browser), plainly.

If the piece is going onto fragment.dev, run `node export.mjs <name>.js`. It writes what the site's components take: an illustration's frames as SVG files named the way the site names them, with their holds; a diagram's nodes, edges and steps as JSON; a field's cell function as a module. Say where it wrote them.

## 5. Adjust

When the person asks for a change, edit only `<name>.js`, then build, validate and look again. The tenth version is held to the same bar as the first. A change to timing is a change to `hold`, `period` or `travel` alone.

## What goes wrong

| If you catch yourself | Do this instead |
| --- | --- |
| reaching for a colour that is not an account, or for orange as decoration | grey carries depth: main, main-500, main-300 (rule 04); colour is accounting (rule 05) |
| setting `opacity`, a gradient, a shadow or a rounded corner | a lighter token; square corners; the one hard 3px shadow belongs to the dark agent window only (rule 03, 07) |
| writing a timer, a `requestAnimationFrame` or a CSS animation | frames and holds (illustration), `period` (field), `steps` and `travel` (diagram): the kernel owns the clock |
| tweening a value across frames | swap whole frames: a character per frame, a digit per frame, a row per frame (rule 09) |
| drawing curved or diagonal connectors | straight, orthogonal, with an open chevron (rule 07) |
| filling the plate edge to edge | centre one composition and leave the white (rule 06) |
| labelling with lorem, `Foo`, `Service A`, or an icon from a set | the product's words: `Entry_1234`, `assets/cash`, `addLedgerEntry()`, `38,000.00 USD` (rule 10) |
| setting type in anything but FragmentMono, or at a size off the scale | FragmentMono at 14, 16 for code, 24 for a hero row (rule 01) |
| making a field busy everywhere | grey is the world, sparse and banded; colour gathers in one place (fields.md) |
| using the `$` token on a line that carries no money | `money: false`, or `muted: true` for a line that is not live yet |
| adding a second idea to the lap | cut it: one piece, one idea |
| editing the kernel or the bench to make something work | the piece is wrong; change the piece |
