import { registerCallback, unregisterCallback } from "./Callbacks";

/**
 * The instance of the current RuntimeGame.
 * Can be null if used between the load of GDAPI and a game frame, since the game is hijacked at the scene update.
 * @see https://docs.gdevelop-app.com/GDJS%20Runtime%20Documentation/RuntimeGame.html
 */
export var game: gdjs.RuntimeGame = null!;

/**
 * The instance of the current RuntimeScene.
 * Can be null if used between the load of GDAPI and a game frame, since the game is hijacked at the scene update.
 * @see https://docs.gdevelop-app.com/GDJS%20Runtime%20Documentation/RuntimeScene.html
 */
export var currentScene: gdjs.RuntimeScene = null!;

/**
 * If {@link game} is null, hack into the game to get it.
 * @see {@link game}
 */
export const getGame = async () => {
  if (!game) {
    game = await new Promise<gdjs.RuntimeGame>((resolve) => {
      registerCallback("preEvents", function temp(rs) {
        resolve(rs.getGame());
        // Avoid memory leak
        unregisterCallback("preEvents", temp);
      });
    });
  }

  return game;
};

/**
 * If {@link currentScene} is null, hack into the game to get it.
 * @see {@link currentScene}
 */
export const getScene = async () =>
  currentScene ||
  (currentScene = (await getGame()).getSceneStack().getCurrentScene()!);

// Call getScene for the game and scene to be pre-loaded in and cached.
getScene();

// Update the current scene when it is changed.
registerCallback("sceneLoaded", (rs) => {
  currentScene = rs;
});

registerCallback("sceneResumed", (rs) => {
  currentScene = rs;
});
