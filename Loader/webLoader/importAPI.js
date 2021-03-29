const build = require("../../API/build");
const { copy, emptyDir } = require("fs-extra-promise");
let lock = false;

exports.importAPI = async function () {
  if (lock) return;
  lock = true;

  // Clear the target folder
  await emptyDir("./extension/api");

  // Build the API
  await build();

  // Copy the API files
  await copy("../../API/dist", "./extension/api");

  lock = false;
  console.log("✅ Successfully imported the API!");
};
