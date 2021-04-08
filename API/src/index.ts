import "./Polyfill.js";
import { Mod, parseModManifest, loadModFile } from "./Mod";
import { ModManager } from "./ModManager";
import { loadExtension } from "./ExtensionsLoader";
import * as Callbacks from "./Callbacks";

// Expose the API
export {
  Mod,
  ModManager,
  Callbacks,
  parseModManifest,
  loadModFile,
  loadExtension,
};

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
