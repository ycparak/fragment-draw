import { must } from "./dom";

/** The section in view: the first inside a band from under the bar to 30% down the window. */
export function initScrollSpy(root: HTMLElement): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".rail-link, .strip a"));
  const ids = Array.from(new Set(links.map((a) => a.hash.slice(1))));
  const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
  const first = sections[0];
  const last = sections[sections.length - 1];
  if (!first || !last) return;

  const rail = must(".rail nav"), strip = must(".strip-scroll");
  const dot = document.createElement("span");
  dot.className = "dot";
  dot.setAttribute("aria-hidden", "true");
  let active: string | null = null;
  let held = 0;

  function inView(): string | null {
    const top = parseFloat(getComputedStyle(first!).scrollMarginTop) || 0;
    const bottom = innerHeight * 0.3;
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) return last!.id;
    for (const section of sections) {
      const r = section.getBoundingClientRect();
      if (r.bottom > top + 1 && r.top < bottom) return section.id;
    }
    return first!.getBoundingClientRect().top >= bottom ? first!.id : null;
  }

  // transitions wait for the first mark, so the page does not animate in from nothing
  function live(el: Element): void {
    if (el.hasAttribute("data-live")) return;
    requestAnimationFrame(() => requestAnimationFrame(() => el.setAttribute("data-live", "")));
  }

  function mark(id: string | null): void {
    if (!id || id === active) return;
    active = id;
    for (const a of links) {
      if (a.hash === `#${id}`) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    }

    // the rail: each group's trunk reaches to the marked row's bend, or back to nothing
    if (rail.clientWidth) {
      rail.querySelectorAll("ul").forEach((list) => {
        const row = list.querySelector(`a[href="#${id}"]`);
        let reach = 0;
        if (row) {
          const box = list.getBoundingClientRect();
          const at = row.parentElement!.getBoundingClientRect();
          reach = (at.top - box.top + at.height / 2 - 6 + 1 + 2) / (box.height + 2);
        }
        list.style.setProperty("--reach", String(reach));
      });
      live(rail);
    }

    // the strip: a dot flies to the marked link, and the strip scrolls it into view
    const a = strip.querySelector(`a[href="#${id}"]`);
    if (a && strip.clientWidth) {
      if (!dot.parentNode) strip.appendChild(dot);
      const sb = strip.getBoundingClientRect(), ab = a.getBoundingClientRect();
      dot.style.translate = `${ab.left - sb.left + strip.scrollLeft + 6}px ${ab.top - sb.top + (ab.height - 5) / 2}px`;
      if (ab.left - 24 < sb.left) strip.scrollTo({ left: strip.scrollLeft + ab.left - 24 - sb.left });
      else if (ab.right + 24 > sb.right) strip.scrollTo({ left: strip.scrollLeft + ab.right + 24 - sb.right });
      live(strip);
    }
  }

  const pick = (): void => { if (performance.now() >= held) mark(inView()); };

  // marked as the page moves, and once more when it stops: a glide's last scroll event can come before its last pixel
  let settle: ReturnType<typeof setTimeout> | undefined;
  addEventListener("scroll", () => {
    pick();
    clearTimeout(settle);
    settle = setTimeout(() => { held = 0; pick(); }, 120);
  }, { passive: true });
  addEventListener("scrollend", () => { held = 0; pick(); });
  addEventListener("resize", () => {
    const was = active;
    active = null;
    mark(was ?? inView());
  });
  // a click on an in-page link marks it at once, and holds the mark while the page glides there
  document.addEventListener("click", (e) => {
    const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>("a[href^='#']") : null;
    if (!a || !document.getElementById(a.hash.slice(1))) return;
    mark(a.hash.slice(1));
    held = performance.now() + 1000;
  });

  mark(inView() ?? first.id);
  root.dataset.smooth = "";
}
