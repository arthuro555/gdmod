import { defineConfig } from "tsup";

export default defineConfig({
  outDir: "bin",
  target: "node14",
  bundle: true,
  minify: true,
  clean: true,
});
