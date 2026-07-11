import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// For GitHub Pages "project pages" the app is served from /<repo>/.
// Set VITE_BASE to your repo name (e.g. "/biomed-dept-portal/") in the
// deploy workflow. Locally it stays "/". We use HashRouter so deep links
// work on Pages without any 404.html fallback.
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react(), tailwindcss()],
});
