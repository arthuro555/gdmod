const esbuild = require("esbuild");
const { resolve } = require("path");
const { readdir } = require("fs").promises;

const config = {
  entryPoints: [__dirname + "/../src/index.ts"],
  bundle: true,
  minify: true,
  treeShaking: true,
  // Needed to support older electrion builds
  target: "chrome50",
};

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

module.exports.build = async function () {
  await esbuild.startService();
  return await Promise.all([
    esbuild.build({
      entryPoints: (
        await getFiles(resolve(__dirname + "/../src/"))
      ).filter((file) => !file.includes(".test.ts")),
      outdir: __dirname + "/../dist/esm",
      platform: "browser",
      format: "esm",
    }),
    esbuild.build({
      ...config,
      outfile: __dirname + "/../dist/GDApi.cjs",
      platform: "node",
      format: "cjs",
    }),
    esbuild.build({
      ...config,
      outfile: __dirname + "/../dist/GDApi.js",
      platform: "browser",
      globalName: "GDAPI",
      sourcemap: "inline",
      format: "iife",
    }),
    esbuild.build({
      ...config,
      entryPoints: [__dirname + "/../src/index_polyfill.ts"],
      outfile: __dirname + "/../dist/polyfill.js",
      platform: "browser",
      format: "iife",
    }),
  ]);
};

if (require.main === module) module.exports.build();
