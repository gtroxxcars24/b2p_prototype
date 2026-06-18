import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // node_modules is symlinked to the turbo-ui repo; keep Vite's cache local
  // so we don't write into that repo.
  cacheDir: ".vite-cache",
  server: { host: true },
});
