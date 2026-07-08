import { defineConfig } from "vite";

// base 用相對路徑，才能部署到 GitHub Pages 的 /<repo>/ 子路徑
export default defineConfig({
  base: "./",
  build: { assetsInlineLimit: 0 },
});
