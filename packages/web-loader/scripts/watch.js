const { watch } = require("chokidar");
const { importAPI } = require("./importAPI");

watch(require.resolve("@gdmod/api/dist/GDApi"), {
  awaitWriteFinish: true,
}).on("change", () => {
  console.info("ℹ API has been rebuilt, reimporting it!");
  importAPI();
});
