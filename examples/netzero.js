// /fragment-draw field net to zero
// Two clusters, assets in green and liabilities in red, drift toward each other through the grey. Where they meet
// the numbers cancel into zeros; then they part and the zeros fade back into the world. The lap is the netting.

fragment({
  kind: "field",
  name: "netzero",
  means: "Green assets and red liabilities drift together through grey numbers and cancel into zeros where they meet, then part.",
  period: 10000,
  still: 0.5,
  seed: 11,
  cell(c, r, t, g) {
    const meet = g.ease(0.5 - 0.5 * Math.cos(t * Math.PI * 2)); // 0 apart → 1 together → 0, seamless
    const rough = (g.loop(c * 0.3, r * 0.3, t, 5, 1.4) - 0.5) * 0.2;
    const ax = 0.27 + 0.17 * meet, lx = 0.73 - 0.17 * meet, x = (c + 0.5) / g.cols;
    const a = g.ellipse(c, r, ax, 0.5, 0.2, 0.27) + rough;
    const l = g.ellipse(c, r, lx, 0.5, 0.2, 0.27) - rough;
    const value = Math.min(g.cap(c, r), g.digit(c, r, t, 8));

    if (a > 0.08 && l > 0.08) return { label: "0", tone: "ink" }; // netted
    const moving = Math.sin(t * Math.PI * 2) > 0; // drifting together, not apart
    // each front is filled on the side facing the other, and only while they close
    if (a > 0.08) return a < 0.14 && moving && x > ax ? { value, fill: "green" } : { value, tone: "green", label: value < 10 ? g.currency(c, r, value) : null };
    if (l > 0.08) return l < 0.14 && moving && x < lx ? { value, fill: "red" } : { value, tone: "red" };

    if (g.loop(c * 0.25, r * 0.25, t, 3, 0.5) < 0.58 || g.hash(c, r, 2) < 0.5) return null;
    return { value: g.digit(c, r, t, 3), tone: r < g.rows / 3 ? "far" : r < (2 * g.rows) / 3 ? "mid" : "scenery" };
  },
});
