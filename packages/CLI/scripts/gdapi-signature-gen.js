const { writeFile, unlink } = require("fs/promises");

module.exports.generateGDAPISignature = async () => {
  // Mock GDJS to allow GDAPI to load
  global.gdjs = {
    RuntimeScene: class RuntimeScene {},
    RuntimeGame: class RuntimeGame {
      _sceneStack=  {
        getCurrentScene: () => null,
      }
    },
    RuntimeObject: class RuntimeObject {},
    SceneStack: class SceneStack {},
    callbacksRuntimeSceneLoaded: [],
    callbacksRuntimeSceneResumed: []
  };

  // Mock PIXI to allow GDAPI to load
  global.PIXI = { Texture: { fromURL: () => null } };

  // Mock GDAPI_game to allow GDAPI to load
  global.GDAPI_game = new gdjs.RuntimeGame();

  // Require transpiled module
  const GDAPI = require("@gdmod/api/dist/GDApi.cjs");

  // Write named exports names
  await writeFile(
    __dirname + "/../src/GDAPI_Signature.json",
    JSON.stringify(Object.keys(GDAPI))
  );
};

if (require.main === module) module.exports.generateGDAPISignature();
