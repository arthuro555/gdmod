import "./Polyfill.js";

export * from "./Mod";
export * from "./ModManager";
export * from "./ExtensionsLoader";
export * from "./Callbacks";

// Delay the rest to when the module has finished loading
// as else the window.GDAPI object does not yet exist.
setTimeout(() => {
  // Make a getter for GDAPI.game and GDAPI.currentScene
  Object.defineProperty(window.GDAPI, "game", {
    get: function (): gdjs.RuntimeGame | null {
      return window.GDAPI_game;
    },
  });
  Object.defineProperty(window.GDAPI, "currentScene", {
    get: function (): gdjs.RuntimeScene | null {
      if (GDAPI.game != undefined)
        return GDAPI.game._sceneStack.getCurrentScene();
      else return null;
    },
  });
});
