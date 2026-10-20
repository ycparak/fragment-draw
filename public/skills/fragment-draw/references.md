# Reference frames

Nineteen frames from fragment.dev's own flipbooks, one for each pattern and each part of the vocabulary. Before drawing an illustration, open the reference for your pattern: look at its picture, read its filmstrip to see what changes, and read its geometry for the numbers.

Each reference is three files in `references/`:

- `<name>.png`: the key frame, as it looks on the site (light theme).
- `<name>.strip.png`: every frame in order, small, or eight spread across the lap when there are more. This is where the motion is: compare neighbours.
- `<name>.svg`: the key frame's geometry. Every box, line, chevron, mark and fill, with its real coordinates, weights and tokens. Text was outlined in the original; here each run of text is a dashed box with a comment giving its position, its height (ascender to descender) and its tone. The words are in the picture.

Read the geometry for measurements, never to trace: a new piece is built with the kit, from its own content.

| Reference | From | Pattern | Plate · frames | Take from it |
| --- | --- | --- | --- | --- |
| `architecture` | `AtoB_Blog-post_Arch` (customer story) | reveal | 622 × 501 · 7 | Nodes 40px tall, 1px `main`, 14px labels. Live arrows 0.7 `main`; arrows not yet explained 0.5 `main-300`. Two-way pairs run 18px apart. Drivers → Card Network → Merchants, with AtoB and FRAGMENT hung below |
| `architecture-phone` | the same, mobile | reveal | 379 × 470 · 7 | The phone set keeps every part and every size; only the spacing tightens to the narrower plate |
| `request-response` | `idempotency` (docs) | request and response | 622 × 451 · 7 | Docs plates draw boxes in 1px `main-500`, with ink only for the words. Captions `API`, `FRAGMENT` over the groups. Code at 16px: call in `royal`, property in `magenta`, braces in `main-500`. The retry greys out the first call |
| `request-response-phone` | the same, mobile | request and response | 379 × 451 · 7 | The same composition, with the two groups narrowed rather than stacked |
| `reveal-groups` | `reconciliation` (docs) | reveal | 621 × 450 · 7 | A FRAGMENT group holding Ledger and Link beside Bank, rows inside each. A part not yet explained goes to `main-500` labels; the title names each step |
| `state-table` | `entryBalancingStateLayer` (docs) | state table | 621 × 549 · 2 | An entry's lines over the accounting equation; account marks on every row; the row that sums it ruled apart |
| `two-tables` | `multi-currency-example` (docs) | data | 622 × 468 · 6 | Entry and Accounts side by side, 36px rows, amounts right-aligned with currency, a mark on each account |
| `hierarchy` | `api-overview` (docs) | reveal | 621 × 523 · 5 | Schema over Ledger over Account and Entry: containment shown by nesting boxes, not by lines |
| `pipeline` | `high-throughput-event-bus` (blog) | reveal | 622 × 501 · 7 | An entry mark in a small box → a drum (DynamoDB) → Event Bus → Balance Queue, on 0.7 arrows. The queue is a row of `main-200` cells filling with ink a cell at a time; its label turns white where it crosses the ink |
| `fan-in` | `low-throughput-updates` (blog) | data | 622 × 501 · 6 | A column of `$` items fanning in on thin `main-300` lines to `bank 3`; the live line in ink |
| `columns` | `historical-balance-structure` (blog) | data | 622 × 501 · 5 | Hour, Day, Month, Year as columns of cells; the column in focus in ink, the others in `main-300` |
| `window` | `deploy-your-ledger` (docs) | request and response | 622 × 450 · 5 | `createLedger()` in an API box → a FRAGMENT window holding Schema and Ledger, each with its mark |
| `terminal` | `whop-hero` (customer story) | type | 720 × 500 · 43 | A terminal window: header lines in a ruled box, the prompt typed a few characters a frame, the agent's working lines in `main-500`, the result last. Ticks in `forest` |
| `mask` | `security-encrypt` (security) | mask | 491 × 361 · 24 | One input on `canvas`, a caption over it; one character replaced a frame |
| `glyph` | `careers-hero` (careers) | build a glyph | 1201 × 795 · 8 | `<$/>` set a character a frame, then measured: guides 0.5 in `orange`, construction lines 0.5 `main-500` |
| `chart` | `nomos-hero` (customer story) | data | 621 × 500 · 12 | A chart in a window: bars 0.5 `main-500` on `canvas`, redrawn each frame; the saving in green |
| `phone` | `basic-capital-hero` (customer story) | data | 621 × 500 · 4 | A phone outline (the one rounded box) holding a portfolio: an ink line chart, a period switch with the selected chip filled `main`, a holdings bar |
| `currency-list` | `pleo-hero` (customer story) | data | 622 × 500 · 5 | A balances list in a window, one row per currency with its mark and a right-aligned amount |
| `checklist` | `security-controls` (security) | reveal | 491 × 361 · 5 | A list on 0.5 `main-300` rules that scrolls a row a frame: the current row centred in ink with its tick in `forest`; the rows round it fade with distance, `main-500` then `main-300` then `main-200`, their ticks grey |

Three more are rebuilt in full in `examples/`: `copay.js` (the home page's schema map), `clearing.js` (the Clearing Accounts odometer) and `carry.js` (after /v2).

## What the measurements say

Read across all nineteen, beyond `style.md`:

- **Type is one size.** Titles, box labels, captions and rows are all 14px. Code and its result inside a box are 16px. Only a row that is the whole picture is larger (24px).
- **Docs plates draw structure in grey.** Boxes, groups and arrows are 1px `main-500` in the docs; ink is for the words and for whatever the step is about. The customer stories' architecture diagrams draw their boxes in ink.
- **Rows are 36px** in tables and lists on a plate, 18px inside a product window.
- **Distance fades in steps.** A list or a sequence shows nearness with the greys, `main` → `main-500` → `main-300` → `main-200`, not with size or opacity (`checklist`, `columns`).
- **Positive results are `forest`**, the darker green: a tick, a saving, a `Done!`. `asset-green` stays an account's mark.
- **The phone set is the same picture.** The mobile frames keep every part at the same size and tighten the spacing to fit; nothing is dropped.
