const { watch } = require("chokidar");
const { importAPI } = require("./importAPI");

watch("../../API").on("all", () => {
  console.info("ℹ A change has been detected in API, API is being reimported!");
  importAPI();
});
