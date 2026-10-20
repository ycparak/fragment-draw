/** A path under the site's base, for the files in public/. */
export const withBase = (path: string): string =>
  import.meta.env.BASE_URL.replace(/\/$/, "") + "/" + path.replace(/^\//, "");

/** The skill's own files, served from public/skills/fragment-draw. */
export const skill = (file: string): string => withBase(`skills/fragment-draw/${file}`);
