const { watch } = require("chokidar");
const { generateGDAPISignature } = require("./gdapi-signature-gen");
require("child_process").exec("yarn build --watch").on("message", console.log);

watch(require.resolve("@gdmod/api/dist/GDApi"), {
  awaitWriteFinish: true,
}).on("change", () => {
  console.info("ℹ API has been rebuilt, regenerating signatures!");
  generateGDAPISignature();
});
