import { must } from "./dom";

/** The title types on, as the home page's does. */
export function typeTitle(reduced: boolean): void {
  const typed = must("#typed"), title = must("#title");
  const text = typed.textContent ?? "";
  if (reduced) {
    title.setAttribute("data-done", "");
    return;
  }
  typed.textContent = "";
  let n = 0;
  const tick = (): void => {
    typed.textContent = text.slice(0, ++n);
    if (n < text.length) setTimeout(tick, text.charAt(n - 1) === " " ? 140 : 70);
    else title.setAttribute("data-done", "");
  };
  tick();
}
