# The ten rules

They are read off the finished pieces on fragment.dev (`catalogue.md`): the site's tokens, the schema maps' markup, 698 frames of the blog's and the docs' flipbooks, and the `/v2` field engine. Each rule has what it says, how to keep it with the kernel, and what gets a piece rejected.

## 01 · mono: one typeface, a short scale

Everything is set in FragmentMono, the site's own monospace: labels, numbers, code, titles. The scale is short.

| Size | For |
| --- | --- |
| 12 | small print only: a chart's axis, a measurement guide |
| 13 | dense table rows |
| 14 | the default: a plate's title (top left), box labels, a group's caption (`API`, `Response`, `Entries`, in `main-500`), rows, terminal lines |
| 16 | code and its result inside a box (`addLedgerEntry(){`, `ikReplay: false`) |
| 17 | the `$` token in a diagram |
| 24 | one big row when the row is the whole picture (`Invoice_02  100.00`) |

- **Keep it:** `k.text`, `k.label`, `k.title`, `k.node` and `k.rows` already set the family and the sizes. The wordmark is written `FRAGMENT`, in capitals, one size down from the words around it.
- **Rejected when:** any other family; a size off the scale without a reason; a title set smaller than its labels; bold anywhere (Fragment has no bold; emphasis is main against main-500).

## 02 · plate: white on grey, a fixed set of sizes

A piece sits on a white plate (`negative`) on the grey canvas (`canvas`). The plate's size says where the piece goes.

| Plate | Used for |
| --- | --- |
| 621 × 500 | blog posts, most docs guides (the default) |
| 621 × 450 | shorter docs plates (intro, reconciliation, migrations, import, export) |
| 621 × 469 | the changelog, and the wallet and scoreboard posts |
| 720 × 500 | customer-story heroes (Whop, Ramp, AtoB landing) |
| 491 × 361 | `/security` |
| 1200 × 795 | `/careers` |
| 1 : 1 | a field (fills its column) |
| 504 × ~560 | a diagram's map, inside a product window |

- **Keep it:** `size` on the piece; the kernel paints the plate. A title, when there is one, is at (20, 32), 14px, main, in sentence case or as `FRAGMENT + Partner Architecture`.
- **Rejected when:** a background colour other than the plate; a border round the plate; a plate size invented without a reason.

## 03 · hairline: four weights of line, no effects

| Weight | For |
| --- | --- |
| 0.5 | table rules, row outlines, window outlines, inactive edges |
| 0.7 | arrows in an illustration |
| 1 | boxes in an illustration, every line in a diagram |
| 1.25 | a diagram node's border, a tick |

- **Keep it:** the kit's defaults. Shapes are filled with `negative` only to hide what is behind them; tables and inputs sit on `main-100` or `main-200`.
- **Rejected when:** a gradient, filter, blur, glow, `opacity`, rounded corner (one exception: a chip that is a button, `Pay $100`), or a soft shadow. The one shadow on the site is the dark agent window's hard 3px offset (`k.window(…, { dark: true })`).

## 04 · grey carries depth

Fragment says "now", "later", "secondary" and "not yet" with four greys, not with opacity or colour.

| Token | Means |
| --- | --- |
| `main` | what is happening now: the active box, the line carrying money, the typed text |
| `main-500` | labels, placeholders, secondary output, the deleted digits, the agent's working lines; on a docs plate, the boxes and arrows themselves |
| `main-300` | inactive or future edges, rules, the parts of an architecture not yet explained |
| `main-200`, `main-100` | the fill of inputs, rows, selected rows |

- **Keep it:** step a part from `main-300` to `main` in the frame where it becomes the subject, and back when it stops being one. Show distance in a list with the steps `main` → `main-500` → `main-300` → `main-200` (`references/checklist`).
- **Rejected when:** a part is dimmed with `opacity`; everything is `main`, so nothing reads as first.

## 05 · colour is accounting

Colour on Fragment is information. Each colour is an account type, and that is all it is.

| Token | Means |
| --- | --- |
| `asset-green` | assets: cash, receivables. In a field, a front that is growing |
| `liability-red` | liabilities: payables, customer funds. In a field, a front that is giving back |
| `income-blue` | income: revenue, fees earned |
| `expense-yellow` | expenses. Also the `v2` and brand marks, filled |
| `forest` | a positive result in words or marks: a tick, a saving, `Done!` |
| `orange` | attention: an open balance's `!`, a stuck step, a measurement guide |
| `magenta`, `royal` | code only: property names magenta, values royal (`income-blue` for keywords) |

- **Keep it:** `k.dot(x, y, "asset")` and its siblings; `k.ledger` (the four squares) and `k.entry` (the four-quarter disc) are the only multi-colour marks. Three accents in a frame at most.
- **Rejected when:** colour is decoration; a colour means two things in one piece; text is coloured to look nice; an account's dot does not match its type.

## 06 · centred and sparse

One composition, centred, with the white around it doing the work. The content spans roughly 40–65% of the plate's width; nothing comes within 20px of its edge. A row that is the whole idea (`clearing`) sits alone in the middle of the plate.

- **Keep it:** compute positions from the plate's centre; keep groups aligned to a column; leave the bottom third empty rather than filling it.
- **Rejected when:** the piece fills the plate; two compositions compete; something touches the edge.

## 07 · boxes and chevrons

Things are square-cornered boxes. Connections are straight, orthogonal lines ending in an open chevron.

- **Keep it:** an illustration's node is 40px tall with its label centred (`k.node`); a group is a larger box with a caption above it (`k.label`). An illustration's arrow is 0.7 with 45° legs of 9 (`k.arrow`). A diagram's line is 1 with legs of 6, its chevron 11px short of the box so the `$` can arrive (the kernel draws it). Two lines into one box merge on a shared trunk; one box out to two splits from one.
- **Keep it, when many things go to one:** a fan of thin straight lines (0.5, `main-300`) may run diagonally from a column of items to one box, as `low-throughput-updates` does; the line that is live goes `main` and carries the chevron.
- **Rejected when:** a curve, a diagonal outside a fan, a filled arrowhead, a dashed line that is not a measurement guide, an icon standing in for a box.

## 08 · money moves as `$`

In a diagram, the only thing that moves is a `$` in FragmentMono 17 on a white disc of radius 11, riding a line. It travels a step in 1200ms, linearly; steps run in order; edges in one step move together; then the map is still for 700ms and the lap begins again.

- **Keep it:** `steps`, `travel`, `pause`. A line that carries no money is `money: false`; one that is not live yet is `muted: true`.
- **Rejected when:** more than one thing moves; a `$` rides a line that carries no money; the timing is eased.

## 09 · motion is a flipbook

An illustration moves by swapping whole frames. Nothing tweens; nothing eases. What changes between two frames is one small thing: a character typed, a digit deleted, a row added, a part going from `main-300` to `main`, a `!` turning orange.

| Hold | For |
| --- | --- |
| 1200 ms | the default: each frame is a step of an explanation |
| 100–160 ms | typing and deleting, a character a frame |
| 400–600 ms | a blink, every other frame |
| 1600–2000 ms | the last frame, before the lap starts again |

A field moves continuously at 30 frames a second, in a seamless lap of 4–15 seconds.

- **Keep it:** `frames`, `hold`, `rest`; `k.typed(text, n)` and `k.blink(i)`. The `rest` frame is what reduced motion shows and what a thumbnail shows: make it the most complete frame.
- **Rejected when:** a frame repeats the one before it (hold the first longer); a step changes three things at once; the rest frame is empty.

## 10 · real objects, real words

The words on a plate are the product's own, and the numbers are real-looking money.

- **Keep it:** accounts as paths (`assets/receivable:inv_4821`) or names (`Receivables`); entries and ids in snake_case with a number (`Entry_1234`, `pay_7Q4Xm2`, `inv_4821`); API calls as code (`addLedgerEntry()`, `ik: 1234`); amounts with two decimals, right-aligned, with a currency where it helps (`38,000.00 USD`, `$71,200`); files (`bank-oct.csv`); parties by role (`Customers`, `Bank`, `Card Network`) or as Acme. An agent's prompt is lower case, plain (`reconcile these for October`); its output is indented in `main-500` and ends with `* done` or `+ settled`.
- **Rejected when:** lorem ipsum, `Foo`, `Service A`; an amount without decimals in a table; a person, a face, a hand drawn as a figure (the pointer arrow is the only hand); a metaphor that stands in for the product (no rockets, no coins, no piggy banks).
