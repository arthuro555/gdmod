const template = require("./manifest_template.json");
const includes = require("../../API/includes.json");
const { copy, writeFile } = require("fs-extra-promise");

exports.importAPI = async function () {
  // Copy the API files
  const promises = includes.map((file) =>
    copy("../../API/" + file, "./extension/api/" + file)
  );

  // Copy the includes file
  promises.push(
    writeFile("./extension/api/includes.json", JSON.stringify(includes))
  );

  // Set the files as loadable in the manifest
  includes.push("includes.json");
  template.web_accessible_resources = template.web_accessible_resources.concat(
    includes.map((file) => "/api/" + file)
  );
  promises.push(
    writeFile("./extension/manifest.json", JSON.stringify(template, null, 2))
  );

  await Promise.all(promises)
    .then(() => console.log("✅ Successfully imported the API!"))
    .catch((e) => {
      console.error("❌ An error occured! ", e.message);
      writeFile("stack.txt", e.stack);
    });
};
