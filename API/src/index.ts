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

// Make a getter for GDAPI.currentScene.
// Delay it, as the window.GDAPI object does 
// not exist until the module has finished loading.
setTimeout(() =>
  Object.defineProperty(window.GDAPI, "currentScene", {
    get: function (): gdjs.RuntimeScene | null {
      if (GDAPI.game != undefined)
        return GDAPI.game._sceneStack.getCurrentScene();
      else return null;
    },
  })
);
