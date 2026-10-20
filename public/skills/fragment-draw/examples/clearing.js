// "Clearing Accounts", rebuilt: one liability line, an open balance with a blinking orange !, cleared digit by
// digit to zero, ticked, then filled again. One row, big type, nothing else on the plate: the change is the picture.
// The narrow set is the same row recomposed for a phone's 378-wide plate, as the site ships a Mobile frame per frame.

const AMOUNT = "100.00";
const WIDE = { x: 112, y: 225, w: 396, size: 24, right: 504, dot: [123, 243, 9], name: 137 };
const NARROW = { x: 24, y: 216, w: 330, size: 20, right: 330, dot: [35, 234, 8], name: 49 };

// which phase a frame is in: 0–5 blink, 6–11 delete, 12 settled, 13–18 retype
const phase = (i) => (i < 6 ? "open" : i < 12 ? "clear" : i === 12 ? "zero" : "fill");

/** The amount as black characters and grey placeholders, right-aligned on L.right. */
function amount(k, i, L) {
  let ink = AMOUNT, ghost = "";
  if (phase(i) === "clear") {
    ink = AMOUNT.slice(i - 5);
    ghost = "0.00".slice(0, Math.max(0, 4 - ink.length));
  } else if (phase(i) === "zero") {
    ink = "";
    ghost = "0.00";
  } else if (phase(i) === "fill") {
    ink = k.typed(AMOUNT, i - 12);
    ghost = AMOUNT.slice(ink.length).replace(/\d/g, "0");
  }
  const adv = k.w("0", L.size);
  // while filling, typed digits sit left of the grey ones; while clearing, the grey ones sit left of what is left
  const parts = phase(i) === "fill" ? [[ink, "main"], [ghost, "main-500"]] : [[ghost, "main-500"], [ink, "main"]];
  let x = L.right - (ghost + ink).length * adv, s = "";
  for (const [text, tone] of parts) {
    if (text) s += k.text(x, L.y + 27, text, { size: L.size, tone });
    x += text.length * adv;
  }
  return s;
}

function frame(i, k, L) {
  const open = phase(i) === "open" || phase(i) === "clear";
  const mark = open
    ? k.bang(L.right + 4, L.y + 27, { size: L.size, tone: phase(i) === "open" && k.blink(i) ? "main" : "orange" })
    : k.check(L.right + 6, L.y + 26, { size: L.size - 2 });
  return (
    k.box(L.x, L.y, L.w, 36, { tone: "main-300", width: 0.5 }) +
    k.dot(L.dot[0], L.dot[1], "liability", L.dot[2]) +
    k.text(L.name, L.y + 27, "Invoice_02", { size: L.size }) +
    amount(k, i, L) +
    mark
  );
}

fragment({
  kind: "illustration",
  name: "clearing",
  means: "An invoice's open balance blinks, clears to zero, is ticked, and fills again: a clearing account netting out.",
  size: [621, 500],
  frames: 19,
  hold: (i) => (i < 6 ? 520 : i < 12 ? 140 : i === 12 ? 1100 : i === 18 ? 1800 : 140),
  rest: 18,
  draw: (i, k) => frame(i, k, WIDE),
  narrow: { size: [378, 469], draw: (i, k) => frame(i, k, NARROW) },
});
