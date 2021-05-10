const { build } = require("esbuild");
const { writeFile, unlink } = require("fs/promises");

module.exports.generateGDAPISignature = async () => {
  // Transpile from ts to js
  await build({
    entryPoints: [require.resolve("@gdmod/api")],
    format: "cjs",
    bundle: true,
    outfile: __dirname + "/GDAPI.cjs",
  });

  // Mock GDJS to allow GDAPI to load
  global.gdjs = {
    RuntimeScene: class RuntimeScene {},
    RuntimeGame: class RuntimeGame {},
    RuntimeObject: class RuntimeObject {},
    SceneStack: class SceneStack {},
  };

  // Mock PIXI to allow GDAPI to load
  global.PIXI = { Texture: { fromURL: () => null } };

  // Mock GDAPI_game to allow GDAPI to load
  global.GDAPI_game = new gdjs.RuntimeGame();

  // Require transpiled module
  const GDAPI = require("./GDAPI.cjs");

  // Write named exports names
  await writeFile(
    __dirname + "/../src/GDAPI_Signature.json",
    JSON.stringify(Object.keys(GDAPI))
  );

  // Remove temp GDAPI file
  await unlink(__dirname + "/GDAPI.cjs");
};

if (require.main === module) module.exports.generateGDAPISignature();
