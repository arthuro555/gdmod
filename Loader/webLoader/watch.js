const { watch } = require("chokidar");
const { importAPI } = require("./importAPI");

watch("../../API/src", { awaitWriteFinish: true }).on("all", () => {
  console.info("ℹ A change has been detected, API is being reimported!");
  importAPI();
});
