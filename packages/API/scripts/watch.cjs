const { watch } = require("chokidar");
const { build } = require("./build.cjs");
const { typeGen } = require("./type-gen.cjs");

let lock = false;
let requested = false;

watch(__dirname + "/../src", {
  awaitWriteFinish: true,
  ignoreInitial: true,
}).on("all", async function callback() {
  // Set the lock
  if (lock) {
    requested = true;
    console.log(
      `⚠ A change was detected, but a build is still in progress, awaiting build end.`
    );
    return;
  }
  lock = true;

  // Launch typegen in the background
  typeGen();
  console.info("ℹ A change has been detected, API is being rebuilt!");
  const warnings = (await build().catch(console.error)).reduce(
    (p, c) => p.concat(c.warnings),
    []
  );
  if (warnings.length !== 0) {
    console.warn(
      "⚠ Build finished with warnings!\n" +
        warnings.reduce((p, c) => p + "\n" + c, "")
    );
  } else console.info("✅ API rebuilt successfully!");

  lock = false;
  if (requested) callback();
  requested = false;
});
