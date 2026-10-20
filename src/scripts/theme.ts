import { must } from "./dom";
import { setFramesDark } from "./frames";

/** The theme: here and in every frame. The class is set before first paint by the inline script in the layout. */
export function initTheme(root: HTMLElement): void {
  const btn = must<HTMLButtonElement>("#theme");
  const paint = (): void => {
    const dark = root.classList.contains("dark");
    btn.textContent = dark ? "Light" : "Dark";
    setFramesDark(dark);
  };
  btn.addEventListener("click", () => {
    root.classList.toggle("dark");
    try { localStorage.setItem("fd-theme", root.classList.contains("dark") ? "dark" : "light"); } catch { /* storage can be blocked */ }
    paint();
  });
  paint();
}
