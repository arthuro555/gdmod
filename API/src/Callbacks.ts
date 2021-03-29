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
  if (callbackType === CALLBACKS.FIRST_SCENE_LOADED)
    gdjs.callbacksFirstRuntimeSceneLoaded.push(callback);
  else if (callbackType === CALLBACKS.SCENE_LOADED)
    gdjs.callbacksRuntimeSceneLoaded.push(callback);
  else if (callbackType === CALLBACKS.PRE_EVENTS)
    gdjs.callbacksRuntimeScenePreEvents.push(callback);
  else if (callbackType === CALLBACKS.POST_EVENTS)
    gdjs.callbacksRuntimeScenePostEvents.push(callback);
  else if (callbackType === CALLBACKS.SCENE_PAUSED)
    gdjs.callbacksRuntimeScenePaused.push(callback);
  else if (callbackType === CALLBACKS.SCENE_RESUMED)
    gdjs.callbacksRuntimeSceneResumed.push(callback);
  else if (callbackType === CALLBACKS.SCENE_UNLOADING)
    gdjs.callbacksRuntimeSceneUnloading.push(callback);
  else if (callbackType === CALLBACKS.SCENE_UNLOADED)
    gdjs.callbacksRuntimeSceneUnloaded.push(callback);
  else if (callbackType === CALLBACKS.OBJECT_DELETED_FROM_SCENE)
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
  if (callbackType === CALLBACKS.FIRST_SCENE_LOADED)
    callbackArray = gdjs.callbacksFirstRuntimeSceneLoaded;
  else if (callbackType === CALLBACKS.SCENE_LOADED)
    callbackArray = gdjs.callbacksRuntimeSceneLoaded;
  else if (callbackType === CALLBACKS.PRE_EVENTS)
    callbackArray = gdjs.callbacksRuntimeScenePreEvents;
  else if (callbackType === CALLBACKS.POST_EVENTS)
    callbackArray = gdjs.callbacksRuntimeScenePostEvents;
  else if (callbackType === CALLBACKS.SCENE_PAUSED)
    callbackArray = gdjs.callbacksRuntimeScenePaused;
  else if (callbackType === CALLBACKS.SCENE_RESUMED)
    callbackArray = gdjs.callbacksRuntimeSceneResumed;
  else if (callbackType === CALLBACKS.SCENE_UNLOADING)
    callbackArray = gdjs.callbacksRuntimeSceneUnloading;
  else if (callbackType === CALLBACKS.SCENE_UNLOADED)
    callbackArray = gdjs.callbacksRuntimeSceneUnloaded;
  else if (callbackType === CALLBACKS.OBJECT_DELETED_FROM_SCENE)
    callbackArray = gdjs.callbacksObjectDeletedFromScene;
  else return;

  const indexOfCalllback = callbackArray.indexOf(callback);
  if (indexOfCalllback !== -1) callbackArray.splice(indexOfCalllback, 1);
};
