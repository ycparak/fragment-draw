/** The first element matching `selector`; the page is static, so a miss is a bug worth throwing for. */
export function must<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`missing element: ${selector}`);
  return el;
}

export const prefersReducedMotion = (): boolean => matchMedia("(prefers-reduced-motion: reduce)").matches;
