/**
 * The namespace containing the whole modding API.
 * @namespace
 */
namespace GDAPI {
  /**
   * A list of registerable callbacks.
   * Note that FIRST_SCENE_LOADED will never actually be called,
   * as mods are always loaded after the first scene has finished loading.
   * @enum
   */
  export const enum CALLBACKS {
    FIRST_SCENE_LOADED,
    SCENE_LOADED,
    PRE_EVENTS,
    POST_EVENTS,
    SCENE_PAUSED,
    SCENE_RESUMED,
    SCENE_UNLOADING,
    SCENE_UNLOADED,
    OBJECT_DELETED_FROM_SCENE,
  }

  /**
   * A GDevelop runtime event callback.
   */
  export type RuntimeSceneCallback = (runtimeScene: gdjs.RuntimeScene) => void;

  /**
   * Registers a callback function for a GDevelop runtime event.
   * @param callbackType - The event on which you want your callback to be called.
   * @param callback - The callback to register.
   */
  export const registerCallback = function (
    callbackType: CALLBACKS,
    callback: RuntimeSceneCallback
  ) {
    if (callbackType === GDAPI.CALLBACKS.FIRST_SCENE_LOADED)
      gdjs.callbacksFirstRuntimeSceneLoaded.push(callback);
    else if (callbackType === GDAPI.CALLBACKS.SCENE_LOADED)
      gdjs.callbacksRuntimeSceneLoaded.push(callback);
    else if (callbackType === GDAPI.CALLBACKS.PRE_EVENTS)
      gdjs.callbacksRuntimeScenePreEvents.push(callback);
    else if (callbackType === GDAPI.CALLBACKS.POST_EVENTS)
      gdjs.callbacksRuntimeScenePostEvents.push(callback);
    else if (callbackType === GDAPI.CALLBACKS.SCENE_PAUSED)
      gdjs.callbacksRuntimeScenePaused.push(callback);
    else if (callbackType === GDAPI.CALLBACKS.SCENE_RESUMED)
      gdjs.callbacksRuntimeSceneResumed.push(callback);
    else if (callbackType === GDAPI.CALLBACKS.SCENE_UNLOADING)
      gdjs.callbacksRuntimeSceneUnloading.push(callback);
    else if (callbackType === GDAPI.CALLBACKS.SCENE_UNLOADED)
      gdjs.callbacksRuntimeSceneUnloaded.push(callback);
    else if (callbackType === GDAPI.CALLBACKS.OBJECT_DELETED_FROM_SCENE)
      gdjs.callbacksObjectDeletedFromScene.push(callback);
  };

  /**
   * Unregisters a previously registered callback function.
   */
  export const unregisterCallback = function (
    callbackType: CALLBACKS,
    callback: RuntimeSceneCallback
  ) {
    let callbackArray;
    if (callbackType === GDAPI.CALLBACKS.FIRST_SCENE_LOADED)
      callbackArray = gdjs.callbacksFirstRuntimeSceneLoaded;
    else if (callbackType === GDAPI.CALLBACKS.SCENE_LOADED)
      callbackArray = gdjs.callbacksRuntimeSceneLoaded;
    else if (callbackType === GDAPI.CALLBACKS.PRE_EVENTS)
      callbackArray = gdjs.callbacksRuntimeScenePreEvents;
    else if (callbackType === GDAPI.CALLBACKS.POST_EVENTS)
      callbackArray = gdjs.callbacksRuntimeScenePostEvents;
    else if (callbackType === GDAPI.CALLBACKS.SCENE_PAUSED)
      callbackArray = gdjs.callbacksRuntimeScenePaused;
    else if (callbackType === GDAPI.CALLBACKS.SCENE_RESUMED)
      callbackArray = gdjs.callbacksRuntimeSceneResumed;
    else if (callbackType === GDAPI.CALLBACKS.SCENE_UNLOADING)
      callbackArray = gdjs.callbacksRuntimeSceneUnloading;
    else if (callbackType === GDAPI.CALLBACKS.SCENE_UNLOADED)
      callbackArray = gdjs.callbacksRuntimeSceneUnloaded;
    else if (callbackType === GDAPI.CALLBACKS.OBJECT_DELETED_FROM_SCENE)
      callbackArray = gdjs.callbacksObjectDeletedFromScene;
    else return;

    const indexOfCalllback = callbackArray.indexOf(callback);
    if (indexOfCalllback !== -1) callbackArray.splice(indexOfCalllback, 1);
  };

  /**
   * The instance of the current RuntimeScene.
   * @type {?gdjs.RuntimeScene}
   * @see https://docs.gdevelop-app.com/GDJS%20Runtime%20Documentation/RuntimeScene.html
   */
  export const currentScene: gdjs.RuntimeScene = GDAPI.currentScene;

  /**
   * The instance of the current RuntimeGame.
   * @type {?gdjs.RuntimeGame}
   * @see https://docs.gdevelop-app.com/GDJS%20Runtime%20Documentation/RuntimeGame.html
   */
  export const game: gdjs.RuntimeGame = GDAPI.game;

  // Make a getter for GDAPI.currentScene
  Object.defineProperty(GDAPI, "currentScene", {
    get: function (): gdjs.RuntimeScene | null {
      if (GDAPI.game != undefined)
        return GDAPI.game._sceneStack.getCurrentScene();
      else return null;
    },
  });
}
