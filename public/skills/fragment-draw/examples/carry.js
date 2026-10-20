// After /v2's opening field: grey numbers flicker in three bands of depth, and a coloured cluster grows from the
// middle, its edge filled while it moves (green as it grows, red as it gives back), then shrinks home.
// One idea: money gathering. The grey is the world; the colour is the ledger.

fragment({
  kind: "field",
  name: "carry",
  means: "A cluster of accounted numbers grows out of grey noise, its moving edge filled green, then gives the grid back in red.",
  period: 9000,
  still: 0.42,
  seed: 7,
  cell(c, r, t, g) {
    // 0 → 1 → 0 over the lap, quick out and slow back, with an eased turn at each end
    const grow = g.ease(t < 0.55 ? t / 0.55 : (1 - t) / 0.45);
    const rough = (g.loop(c * 0.3, r * 0.3, t, 21, 1.7) - 0.5) * 0.6;
    const reach = 0.12 + 0.36 * grow;
    const inside = g.ellipse(c, r, 0.5, 0.5, reach, reach) + rough * Math.min(1, grow * 3);

    if (inside > 0.1) {
      const value = Math.min(g.cap(c, r), g.digit(c, r, t, 9));
      if (inside < 0.17) return { value, fill: t < 0.55 ? "green" : "red" }; // the front
      const pick = g.hash(c, r, 5);
      const tone = pick < 0.5 ? "green" : pick < 0.78 ? "red" : "blue";
      if (g.hash(c, r, 40 + Math.floor(t * 18)) < 0.1) return { value, fill: tone };
      return { value, tone, label: value < 10 ? g.currency(c, r, value) : null };
    }

    // the scenery: sparse, slow, and fainter toward the top
    if (g.loop(c * 0.22, r * 0.22, t, 3, 0.6) < 0.6 || g.hash(c, r, 2) < 0.45) return null;
    const tone = r < g.rows / 3 ? "far" : r < (2 * g.rows) / 3 ? "mid" : "ink";
    return { value: g.digit(c, r, t, 4), tone };
  },
});
