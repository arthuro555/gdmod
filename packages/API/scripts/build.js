const esbuild = require("esbuild");

module.exports.build = async function () {
  await esbuild.startService();
  return await esbuild.build({
    entryPoints: [__dirname + "/../src/index.ts"],
    outfile: __dirname + "/../dist/GDApi.js",
    sourcemap: "inline",
    bundle: true,
    minify: true,
    platform: "browser",
    treeShaking: true,
    format: "iife",
    globalName: "GDAPI",
    // Needed to support older electrion builds
    target: "chrome50",
  });
};

if (require.main === module) module.exports.build();
