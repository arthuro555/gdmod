/**
 * The main namespace of the modding API.
 */
declare namespace GDAPI {
  /**
   * The instance of the current RuntimeScene.
   * @type {?gdjs.RuntimeScene}
   * @see https://docs.gdevelop-app.com/GDJS%20Runtime%20Documentation/RuntimeScene.html
   */
  export const currentScene: gdjs.RuntimeScene;

  /**
   * The instance of the current RuntimeGame.
   * @type {?gdjs.RuntimeGame}
   * @see https://docs.gdevelop-app.com/GDJS%20Runtime%20Documentation/RuntimeGame.html
   */
  export const game: gdjs.RuntimeGame;

  // Rexport the API in the type definition to get full autocomplete on GDAPI namesapce.
  export const Mod: typeof import("./Mod").Mod;
  export const ModManager: typeof import("./ModManager").ModManager;
  export const Callbacks: typeof import("./Callbacks");
  export const parseModManifest: typeof import("./Mod/ManifestParser").parseModManifest;
  export const loadModFile: typeof import("./Mod").loadModFile;
  export const loadExtensions: typeof import("./ExtensionsLoader").loadExtension;
}
