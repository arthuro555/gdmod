const build = require("../../API/build");
const { copy, writeFile, emptyDir } = require("fs-extra-promise");
let lock = false;
exports.importAPI = async function () {
  if (lock) return;
  lock = true;
  const template = require("./manifest_template.json");
  const includes = require("../../API/includes.json");

  // Clear the target folder
  await emptyDir("./extension/api");

  // Build the API
  await build();

  // Copy the API files
  const promises = [
    copy("../../API/dist", "./extension/api"),
    writeFile("./extension/api/includes.json", JSON.stringify(includes)),
  ];

  // Set the files as loadable in the manifest
  includes.push("includes.json");
  template.web_accessible_resources = template.web_accessible_resources.concat(
    includes.map((file) => "/api/" + file),
    includes.map((file) => "/api/" + file + ".map")
  );
  promises.push(
    writeFile("./extension/manifest.json", JSON.stringify(template, null, 2))
  );

  await Promise.all(promises)
    .then(() => {
      console.log("✅ Successfully imported the API!");
      lock = false;
    })
    .catch((e) => {
      console.error("❌ An error occured! ", e.message);
      writeFile("stack.txt", e.stack);
      lock = false;
    });
};
