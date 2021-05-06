const { watch } = require("chokidar");
const { build } = require("./build");

watch(__dirname + "/../src", {
  awaitWriteFinish: true,
  ignoreInitial: true,
}).on("all", async () => {
  console.info("ℹ A change has been detected, API is being rebuilt!");
  const { warnings } = await build();
  if (warnings.length !== 0) {
    console.warn(
      "⚠ Build finished with warnings!\n" +
        warnings.reduce((p, c) => p + "\n" + c, "")
    );
  } else console.info("✅ API rebuilt successfully!");
});
