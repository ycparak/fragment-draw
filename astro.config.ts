import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: { port: 4517, host: "127.0.0.1" },
  vite: { plugins: [tailwindcss()] },
});
