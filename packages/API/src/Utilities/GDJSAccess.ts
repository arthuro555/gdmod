interface GDJSTools {
  /**
   * The instance of the current RuntimeScene.
   * @see https://docs.gdevelop-app.com/GDJS%20Runtime%20Documentation/RuntimeScene.html
   */
  currentScene: gdjs.RuntimeScene;

  /**
   * The instance of the current RuntimeGame.
   * @see https://docs.gdevelop-app.com/GDJS%20Runtime%20Documentation/RuntimeGame.html
   */
  game: gdjs.RuntimeGame;
}

//@ts-ignore It will be filled with getters in the following lines.
const gdjsTools: GDJSTools = {};

declare const GDAPI_game: gdjs.RuntimeGame;

// Use getters as GDAPI_game may be filled before or after loading the API.
Object.defineProperty(gdjsTools, "game", {
  get: function (): gdjs.RuntimeGame | null {
    return GDAPI_game;
  },
});

Object.defineProperty(gdjsTools, "currentScene", {
  get: function (): gdjs.RuntimeScene | null {
    if (exports.game != undefined)
      return exports.game._sceneStack.getCurrentScene();
    else return null;
  },
});

export = gdjsTools;
