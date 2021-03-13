const esbuild = require("esbuild");
const { readdir } = require("fs").promises;

module.exports = async function () {
  await esbuild.startService();
  return Promise.all(
    (await readdir(__dirname + "/src")).map((file) =>
      esbuild.build({
        entryPoints: [__dirname + "/src/" + file],
        sourcemap: true,
        minify: true,
        outdir: __dirname + "/dist",
      })
    )
  );
};

if (require.main === module) module.exports();
