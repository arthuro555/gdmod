import { registerCallback } from "./Callbacks";

declare global {
  interface Window {
    GDAPI_game: gdjs.RuntimeGame | undefined;
  }
}

/**
 * The instance of the current RuntimeGame.
 * Can be null on mods that are not loaded via a GDMod loader.
 * @see https://docs.gdevelop-app.com/GDJS%20Runtime%20Documentation/RuntimeGame.html
 */
export var game = (typeof window !== "undefined" && window.GDAPI_game) || null!;

/**
 * The instance of the current RuntimeScene.
 * Can be null on mods that are not loaded via a GDMod loader.
 * @see https://docs.gdevelop-app.com/GDJS%20Runtime%20Documentation/RuntimeScene.html
 */
export var currentScene = game ? game._sceneStack.getCurrentScene()! : null!;

/**
 * If {@link game} is null, hack into the game to get it.
 * Intended for usage outside of a GDMod loader, as game can only be null there.
 * @see {@link game}
 */
export const getGame = async () => {
  if (!game) {
    game = await ((o) =>
      new Promise<gdjs.RuntimeGame>((resolve) => {
        gdjs.RuntimeScene.prototype.renderAndStep = function (...args) {
          resolve(this.getGame());
          return o.apply(this, args);
        };
      }))(gdjs.RuntimeScene.prototype.renderAndStep);
  }

  return game;
};

/**
 * If {@link currentScene} is null, hack into the game to get it.
 * Intended for usage outside of a GDMod loader, as game can only be null there.
 * @see {@link currentScene}
 */
export const getScene = async () =>
  (await getGame()).getSceneStack().getCurrentScene()!;

// Update the current scene when it is changed.
registerCallback("sceneLoaded", (rs) => {
  currentScene = rs;
});
registerCallback("sceneResumed", (rs) => {
  currentScene = rs;
});
