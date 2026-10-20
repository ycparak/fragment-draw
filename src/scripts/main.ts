import { prefersReducedMotion } from "./dom";
import { initCopy } from "./copy";
import { initFrames } from "./frames";
import { initScrollSpy } from "./scrollspy";
import { initTheme } from "./theme";
import { typeTitle } from "./title";

const root = document.documentElement;

typeTitle(prefersReducedMotion());
initCopy();
initTheme(root);
initFrames(root);
initScrollSpy(root);
