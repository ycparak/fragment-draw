import { must } from "./dom";

/** The button says so for a moment; without a clipboard, the line is selected instead. */
async function copy(btn: HTMLElement, value: string, select?: Element): Promise<void> {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    if (!select) return;
    const range = document.createRange();
    range.selectNodeContents(select);
    const selection = getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    return;
  }
  const isCopy = btn.hasAttribute("data-copy");
  btn.setAttribute("data-copied", "");
  if (isCopy) btn.textContent = "Copied";
  setTimeout(() => {
    btn.removeAttribute("data-copied");
    if (isCopy) btn.textContent = "Copy";
  }, 1400);
}

export function initCopy(): void {
  document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((btn) => {
    const code = must("[data-copy-source]", btn.parentElement!);
    btn.addEventListener("click", () => void copy(btn, code.textContent ?? "", code));
  });
  document.querySelectorAll<HTMLButtonElement>("[data-anchor]").forEach((btn) => {
    btn.addEventListener("click", () => void copy(btn, `${location.origin}${location.pathname}#${btn.dataset.anchor}`));
  });
}
