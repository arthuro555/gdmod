const { watch } = require("chokidar");
const { importAPI } = require("./importAPI");

watch(require.resolve("@gdmod/api/dist/gdapi.min.cjs"), {
  awaitWriteFinish: true,
}).on("change", () => {
  console.info("ℹ API has been rebuilt, reimporting it!");
  importAPI();
});
