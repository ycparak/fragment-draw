# Diagrams: schema maps

A diagram is the map Fragment draws inside its product window (`Schema` / `Schema/Billing`, under "Map"): the parties money passes between, the ledger it lands in, and a `$` riding each line in turn. It is live HTML and SVG, not a picture, so it stays sharp and themes with the page.

## What it is made of

Read off the live markup of `/` and `/product/ledgers`.

- **The map.** A white area about 504 × 560 CSS px. Everything is positioned from its top left; a node's `x, y` is its centre.
- **A node.** A box with a 1.25px border in `main`, a white fill, `1ch` of padding, its label in FragmentMono 14/18. No rounded corners, no shadow.
- **A ledger node.** The same box with its accounts under a 1.25px rule: one row each, a 1ch account mark (a disc in the account's colour with its letter: A, L, I, E) and the account's name. This is the box the money is about; there is usually one.
- **A line.** 1px `main`, round caps, orthogonal. The kernel routes it from the bottom of the source to the top of the target. When they are not in one column it bends at the midpoint between them, so two lines into one box share a trunk (a merge) and two lines out of one box share one (a split).
- **The chevron.** Open, 6px legs, 11px short of the target, so the `$` arrives on the box's edge.
- **The `$`.** FragmentMono 17 on a white disc of radius 11. It rides its line in `travel` ms (1200), fades in and out in 46ms, and waits while the other steps run.

## Composing one

1. **Find the route.** Who pays, who holds, who is paid. Three rows is the common shape: sources on top, the ledger in the middle, destinations below. Two rows (Customers → Acme) is fine; five is too many.
2. **Name the ledger's accounts.** Two to five, in the order the money meets them, typed honestly: receivables and cash are assets, payables and customer funds are liabilities, revenue is income, fees paid are expenses.
3. **Lay it on a column.** Centre the map at x = 252 for a 504-wide map. Put a pair of sources or destinations symmetrically about it (150 and 354 is the site's spacing). Rows about 180–230px apart, so a bend has room.
4. **Choose the steps.** One step is what moves at the same moment. Money arriving from two payers arrives together; it leaves together. A lap is two to four steps.
5. **Mark what is not live.** A line that exists but carries nothing yet is `muted: true` (`main-300`); a node that is not part of this story yet is `muted: true`; an account added later is `muted: true`.

## Proven shapes

| Shape | On the site | Nodes | Steps |
| --- | --- | --- | --- |
| **In and out** | `/product/ledgers`: Customers → Acme [Receivables, Cash, Deferred revenue, Revenue] → Bank | 3 in a column | 2 |
| **Merge then split** | `/`: Patient + Insurer → Acme Health [Receivables, Cash, Payables, Customer funds] → Clinic + Pharmacy | 5 | 2 |
| **Collect** | `/` "Model any funds flow": Customers → Acme → $ → Bank | 3 | 2 |

`examples/copay.js` is the second, in full.

## In the window

On the site the map sits in an app window beside a scenario list (`0 [Start]`, `1 patient_copay`, …) and under an agent terminal that types the change (`add a customer-funds liability`). The diagram kind draws the map alone, so it can be checked and reused; the window is the page's. If the person wants the whole window as a picture, that is an illustration (`k.window`, `k.rows`).

## On fragment.dev

`export.mjs` writes the map as `{ size, nodes, edges, steps, travel, pause }`. Each edge's id is `from~to`, which is what the site writes on its paths as `data-flow-edge`.
