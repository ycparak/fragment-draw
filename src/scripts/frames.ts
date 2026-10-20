/** A page the skill wrote, in a frame as tall as its column: its caption is the card's, so it is hidden inside. */
const QUIET = ".top, .cap, #theme { display: none !important; } main { padding: 18px 16px 20px !important; } body, html { background: rgb(var(--colour-negative)) !important; } .bar { padding-top: 14px !important; }";

export const frames = (): HTMLIFrameElement[] =>
  Array.from(document.querySelectorAll<HTMLIFrameElement>("iframe[data-frame]"));

// a frame from another origin throws on contentDocument
const docOf = (frame: HTMLIFrameElement): Document | null => {
  try { return frame.contentDocument; } catch { return null; }
};

export function setFramesDark(dark: boolean): void {
  for (const frame of frames()) docOf(frame)?.documentElement.classList.toggle("dark", dark);
}

export function initFrames(root: HTMLElement): void {
  const dark = (): boolean => root.classList.contains("dark");

  for (const frame of frames()) {
    let watch: ResizeObserver | undefined;
    let tries = 0;

    const fit = (): void => {
      const doc = docOf(frame);
      if (!doc) return;
      const main = doc.location.href !== "about:blank" ? doc.querySelector("main") : null;
      // a frame can report load before its page is in; look again shortly, for a few seconds at most
      if (!main) {
        if (tries++ < 40) setTimeout(fit, 150);
        return;
      }
      if (!doc.getElementById("fd-quiet")) {
        const style = doc.createElement("style");
        style.id = "fd-quiet";
        style.textContent = QUIET;
        doc.head.appendChild(style);
        doc.documentElement.classList.toggle("dark", dark());
      }
      const size = (): void => { frame.style.height = `${Math.ceil(main.getBoundingClientRect().height)}px`; };
      size();
      watch?.disconnect();
      const win = frame.contentWindow as (Window & typeof globalThis) | null;
      if (!win) return;
      watch = new win.ResizeObserver(size);
      watch.observe(main);
    };

    frame.addEventListener("load", () => { tries = 0; fit(); });
    frame.src = `${frame.dataset.src}?theme=${dark() ? "dark" : "light"}`;
  }
}
