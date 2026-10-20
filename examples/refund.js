// /fragment-draw illustration how a refund reverses an entry
// An order's entry sits in the ledger; a refund entry is typed in under it with the opposite amount; then each
// account it touched goes back to zero, one at a time, and both are ticked. Reversal, not deletion.

const WIDE = { x: 150, w: 321 }; // the column both tables share, centred on the 621 plate
const NARROW = { x: 24, w: 316 }; // the same column on a phone's 378 plate
const ROW = 24;
const ORDER = "Order_118", REFUND = "Refund_118";

// 0 the order alone · 1–5 the refund typed, two characters a frame · 6 its amount · 7 cash cleared · 8 sales cleared · 9 ticked
const typing = (i) => i >= 1 && i <= 5;

function entries(k, i, L) {
  const refund = i === 0 ? null : typing(i) ? k.typed(REFUND, i * 2) : REFUND;
  const rows = [["Entry", "Amount"], ["  " + ORDER, "120.00"]];
  if (refund !== null) rows.push(["  " + refund, i >= 6 ? "-120.00" : ""]);
  let s = k.label(L.x, 170, "Entries") + k.rows(L.x, 180, L.w, rows, { h: ROW, head: true, cols: [L.w - 112, 100] });
  s += k.entry(L.x + 12, 180 + ROW * 1.5, 5);
  if (refund !== null) {
    s += k.entry(L.x + 12, 180 + ROW * 2.5, 5);
    if (typing(i)) s += k.caret(L.x + 6 + k.w("  " + refund, 13) + 1, 180 + ROW * 2.5 + 6, 14);
  }
  return s;
}

function balances(k, i, L) {
  const cash = i >= 7 ? "0.00" : "120.00";
  const sales = i >= 8 ? "0.00" : "120.00";
  const y = 300;
  let s = k.label(L.x, y - 10, "Balances") +
    k.rows(L.x, y, L.w, [["Account", "Balance"], ["  assets/cash", cash], ["  income/sales", sales]], { h: ROW, head: true, cols: [L.w - 112, 100] });
  s += k.dot(L.x + 12, y + ROW * 1.5, "asset", 5) + k.dot(L.x + 12, y + ROW * 2.5, "income", 5);
  if (i === 9) s += k.check(L.x + L.w + 8, y + ROW * 1.5 + 5) + k.check(L.x + L.w + 8, y + ROW * 2.5 + 5);
  return s;
}

fragment({
  kind: "illustration",
  name: "refund",
  title: "Reversals",
  means: "A refund is posted as a second entry with the opposite amount, and every account the order touched returns to zero.",
  size: [621, 500],
  frames: 10,
  hold: (i) => (i === 0 ? 1400 : typing(i) ? 130 : i === 6 ? 1000 : i === 9 ? 2000 : 900),
  rest: 9,
  draw: (i, k) => entries(k, i, WIDE) + balances(k, i, WIDE),
  narrow: { size: [378, 469], draw: (i, k) => entries(k, i, NARROW) + balances(k, i, NARROW) },
});
