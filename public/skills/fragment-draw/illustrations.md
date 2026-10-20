# Illustrations: flipbooks on a plate

Every illustration in Fragment's blog, docs, customer stories, changelog and security page is a flipbook: a short list of whole SVG frames, each drawn by hand, swapped on a timer (1200ms unless the piece says otherwise), looping. There are 56 of them on the site, 698 frames in all (`catalogue.md`). Nothing inside a frame animates; the motion is the difference between frames.

You write `draw(i, k)`: it returns frame `i` as SVG markup. Draw every frame from the same code, so what stays still stays exactly still and only the change moves.

## The vocabulary

Each is a kit call (`kit/kernel.js`, the index). Measurements are the site's.

| Part | Looks like | Kit |
| --- | --- | --- |
| **Title** | 14px, main, at (20, 32), the same size as everything else: `Idempotency`, `Export to S3`, `FRAGMENT + AtoB Architecture` | `title` on the piece |
| **Node** | 40px tall square box, label 14px centred: `Drivers`, `Card Network`, `Bank`. 1px `main` in a story's architecture; 1px `main-500` on a docs plate, where ink is kept for the words | `k.node(cx, cy, label, { tone })` |
| **Group** | a larger box (1px `main-500` or `main-300`) with a 14px `main-500` caption over its top left: `API`, `Bank`; `FRAGMENT` as the wordmark | `k.box` + `k.label` |
| **Arrow** | 0.7 `main`, orthogonal, an open chevron with 9px legs; an inactive one 0.5 `main-300`. Two-way pairs run side by side 18px apart | `k.arrow([[x, y], …])` |
| **App window** | `main-100` fill, 0.5 `main-500` outline, a 14px bar with three `main-300` dots | `k.window(x, y, w, h)` |
| **Agent window** | `main` fill, `main-800` dots, a hard 3px shadow; text in `negative`, output in `main-500` | `k.window(…, { dark: true })` |
| **Ruled rows** | 18px rows on `main-100`, 0.5 `main-300` rules, head row in `main-500`, amounts right-aligned | `k.rows(x, y, w, rows, { head: true })` |
| **Account mark** | a disc in the account's colour with its letter | `k.dot(x, y, "asset")` |
| **Ledger mark** | four squares, green blue over red yellow | `k.ledger(x, y)` |
| **Entry mark** | a disc in four quarters | `k.entry(x, y)` |
| **Code** | 16px; property names `magenta`, values `royal` or `income-blue`, punctuation and braces `main-500` | `k.text` per token |
| **Input** | a `main-200` field with a 1px caret; placeholder in `main-500` | `k.box` + `k.caret` |
| **Chip** | a filled tag, `main` with `negative` text: `[Start]`, `Pay $100` (rounded only when it is a button) | `k.chip` |
| **Pointer** | the arrow cursor, when a click is the event | `k.cursor(x, y)` |
| **Marks** | `✓` in main when settled, `!` in orange when open | `k.check`, `k.bang` |

A tree of accounts is rows with `├` `└` `│` connectors in `main-300` and indented names (`assets`, `├ cash`, `└ payments`).

## The patterns

Each is a way the site's flipbooks change from frame to frame. A piece uses one, sometimes two.

| Pattern | What changes | Frames · hold | On the site |
| --- | --- | --- | --- |
| **Reveal** | an architecture is built up, or walked: the part being explained goes from `main-300` to `main`, the title names the step | 4–8 · 1200 | `reconciliation` (Ledger, Link, Bank: "Transact at your external…", "Sync real-world money movement…", "Reconcile Transactions via API"), `AtoB_Blog-post_Arch`, `nomos-arch`, `api-overview`, `deploy-your-ledger` |
| **Request and response** | a call goes right, a result comes back left; then the same call again, and the answer changes | 4–7 · 1200 | `idempotency` (`addLedgerEntry(){ ik:1234 }` → `Entry_1234`, `ikReplay: false` then `true`), `authentication` |
| **Type** | a prompt is typed a few characters a frame in a terminal or a field; then the output arrives in `main-500` | 15–43 · 100–160 | `whop-hero` (43 frames: `Create a Partnerships card at 30 limit`), `Jan26Changelog` |
| **Odometer** | a number is deleted and retyped digit by digit; placeholders in `main-500` | 12–20 · 140 | `ClearingAccountBlog` (`Invoice_02 100.00!` → `0.00✓` → `100.00✓`) |
| **Mask** | characters are replaced one at a time | 24 · 140 | `security-encrypt` (`A1080bc45f3p6st` → `***************`) |
| **Blink** | a mark alternates `main` and `orange` | 2–6 · 500 | the `!` in `ClearingAccountBlog` |
| **Build a glyph** | a mark is set a character a frame, then measured with orange guides | 8 · 1200 | `careers-hero` (`<$/>`) |
| **Data** | a chart or table is redrawn with new numbers each frame | 10–12 · 1200 | `nomos-hero` (consumption bars, `Savings: 20%`), the balance tables in `historical-balance-*` |
| **State table** | an accounting equation fills in as entry lines are added | 2–6 · 1200 | `entryBalancingStateLayer` (Assets 10, Liabilities 5, State 5, Change 0) |

`examples/clearing.js` is the odometer and the blink, in full. `references.md` maps each pattern to a frame from the site, with its picture, its filmstrip and its measured geometry.

## Composing one

1. **Pick the one change.** What is different between the first frame and the last? That is the piece. Everything else stays where it is in every frame.
2. **Draw the most complete frame first.** That is `rest`: the thumbnail and the reduced-motion view. Then derive the other frames from it by taking things away or greying them.
3. **Lay it out from the centre.** Groups on a column; a pair of groups side by side with 60–70px between them for the arrows; the title alone at the top left; the bottom third of the plate left empty.
4. **Time it.** 1200ms a step; 100–160ms a character; a long hold on the last frame. A lap reads in 5 to 15 seconds.
5. **Count the accents.** Three at most in a frame (rule 05). Orange only where something needs attention.

## Phone frames

The site never shrinks a plate onto a phone. Every flipbook ships a second set of frames, the same count with the same changes, recomposed for a narrow plate: 378 × 469 beside a 621-wide plate, 291 × 361 beside security's 491 × 361, 640 × 796 beside careers' 1200 × 795. Groups that sat side by side stack; rows narrow to the plate less 24px each side; type stays the same size, so the phone reads it at full size.

- **Keep it:** give the piece `narrow: { size: [378, 469], draw(i, k) }`. Write both from one function that takes a layout, as `examples/clearing.js` does with `WIDE` and `NARROW`, so the frames can never drift apart. The kernel shows the narrow set when the plate is under 520px wide.
- **Skip it** only for a still that reads at phone width as it is; the validator warns when a flipbook has none.

## Static plates

A still is an illustration with `frames: 1`: the site's static guides (`export-data`, `import-data_diagram`) are two frames that differ by one arrow. If a picture does not change, one frame is right; do not invent motion.

## On fragment.dev

`export.mjs` writes each frame as `<name>-<a…>-diagram.svg` (the site's names: `idempotency-a-diagram`, `idempotency-b-diagram`, …), with the colours kept as `rgb(var(--colour-…))` so they theme on the site, and a `<name>.timing.json` with each frame's hold. The site's flipbook component takes the frames in order; a hold other than its default goes in its `customTiming`.
