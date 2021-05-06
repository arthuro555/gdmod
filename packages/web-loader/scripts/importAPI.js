const { copy, emptyDir } = require("fs-extra");
let lock = false;

exports.importAPI = async function () {
  // Clear the target folder
  await emptyDir("./extension/api");
  // Copy the API file
  await copy(
    require.resolve("@gdmod/api/dist/GDApi"),
    "./extension/api/GDApi.js"
  );
  console.log("✅ Successfully imported the API!");
};

if (require.main === module) module.exports.importAPI();
