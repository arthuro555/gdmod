const esbuild = require("esbuild");

module.exports = async function () {
  await esbuild.startService();
  return await esbuild.build({
    entryPoints: [__dirname + "/src/index.ts"],
    outfile: __dirname + "/dist/GDApi.js",
    sourcemap: true,
    bundle: true,
    minify: true,
    platform: "browser",
    treeShaking: true,
    format: "iife",
    globalName: "GDAPI",
  });
};

if (require.main === module) module.exports();
