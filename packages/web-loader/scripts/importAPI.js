const { copy, emptyDir } = require("fs-extra");
let lock = false;

exports.importAPI = async function () {
  // Clear the target folder
  await emptyDir("./extension/api");
  // Copy the API file
  await copy(
    require.resolve("@gdmod/api/dist/polyfill.cjs"),
    "./extension/api/polyfill.js"
  );
  await copy(
    require.resolve("@gdmod/api/dist/gdapi.min.cjs"),
    "./extension/api/gdapi.js"
  );
  console.log("✅ Successfully imported the API!");
};

if (require.main === module) module.exports.importAPI();
