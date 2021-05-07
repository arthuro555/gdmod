// Replace version in manifest with the package.json version
require("fs").writeFileSync(
  __dirname + "/../extension/manifest.json",
  JSON.stringify(
    Object.assign(require("../extension/manifest.json"), {
      version: require("../package.json").version,
    }),
    null,
    2
  )
);
