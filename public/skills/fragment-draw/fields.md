# Fields: the number shader

The five pieces on `/v2` are one engine: a canvas grid of three-character cells, each empty, a number from 1 to 99 (100 at most), or a short label. Grey numbers are the world; coloured ones are the ledger. It runs at 30 frames a second in a seamless lap, sleeps offscreen, and holds still under reduced motion. The kernel is that engine; you write `cell(c, r, t, g)`.

## The grid

Read off the site's renderer.

- **Cells.** Three characters wide (`3 × advance × type size`), one line tall. FragmentMono 20/27 in a wide column, 14/18 in a narrow one. A cell shows its number left-aligned and padded to three characters, so `7` and `42` and `100` sit on one rhythm.
- **Margin.** `min(width, height) × 56/1080` on every side; the grid is centred in what is left.
- **Square.** The plate is 1:1 and fills its column.
- **Ceiling.** Each cell has a ceiling (`g.cap`): one of 28 44 52 61 73 81 88 100. A cell's value never passes it, so a growing area does not read as one flat number.

## The tones

| Tone | Is | Use |
| --- | --- | --- |
| `ink` | main | the nearest band of the world, the brightest grey |
| `mid` | main at 71% | the middle band |
| `far` | main at 52% | the far band |
| `scenery` | main at 34% | background flicker |
| `green` `red` `blue` `yellow` | the account colours | the ledger: numbers that are accounted for |
| `orange` | attention | a step that is stuck |

A **fill** paints the whole cell in a colour and turns its text black (on yellow, green, blue) or white (on red); an orange fill takes the paper's colour. On `/v2` fills mark motion: the front of a growing area is filled green, of a shrinking one red; a stuck cell is filled orange; the brand marks (`FRAGMENT`, `Money`, `v2`) are filled yellow.

A **label** replaces the number: a currency for a value under ten (`$4`, `€7`, `£2`, `¥9`, from `g.currency`), or a mark.

## The five on /v2

| Piece | What it does | Lap |
| --- | --- | --- |
| **hero** | grey numbers, banded far to near; a coloured cluster carrying the `FRAGMENT`, `Money` and `v2` marks in yellow takes over, then gives way | 15 s |
| **v1** | grey numbers flickering in place across the grid: the old world | 5 s, nearly still |
| **stutter** | a few coloured numbers hop from cell to cell through the grey, and some stall in orange | 5 s |
| **blend** | a coloured cluster grows in the middle of the grey, a few cells yellow | 5 s |
| **full** | coloured numbers sweep in and take the grid almost entirely, then leave | 3.75 s |

`examples/carry.js` is a cluster in the manner of `hero` and `blend`, in full.

## Composing one

1. **Say what the colour is.** Money gathering, money moving, money stuck, money settling. The colour is where the ledger is; the grey is everything it is not.
2. **Shape it with one mask.** `g.ellipse` for a cluster, a band of rows for a sweep, a set of points for hoppers. Roughen its edge with `g.loop` so it breathes without a seam.
3. **Give it a front.** Where the mask's edge moves, fill the cells: green growing, red shrinking.
4. **Keep the world sparse.** Grey cells at 30–50% density, in bands (far at the top to ink at the bottom), each changing a few times a lap (`g.digit(c, r, t, 3)`).
5. **Loop without a seam.** Anything that depends on `t` goes through `g.loop`, `Math.sin(2πt)`, or a curve that ends where it began. `g.digit(c, r, t, rate)` changes `rate` times a lap.
6. **Pick the still.** `still` is the `t` that reduced motion and the thumbnail show: the moment that says the most.

## Life

Some of `/v2`'s grey cells are Game of Life oscillators (blinker, toad, beacon, clock, pulsar) that pulse in place. `g.life(name)` gives a pattern's cells; `g.step(cells, n)` advances it. Precompute them in `setup(g)` (it runs once per grid size, and what it returns is `g.data`), then read them in `cell`.
