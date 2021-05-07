/**
 * A list of registerable callbacks.
 * Note that FIRST_SCENE_LOADED will never actually be called,
 * as mods are always loaded after the first scene has finished loading.
 */
export type GDCallback =
  | "preEvents"
  | "postEvents"
  | "sceneLoaded"
  | "scenePaused"
  | "sceneResumed"
  | "sceneUnloading"
  | "sceneUnloaded"
  | "objectDeleted";

const CbTypeToCbList: Record<GDCallback, RuntimeSceneCallback[]> = {
  preEvents: gdjs.callbacksRuntimeScenePreEvents,
  postEvents: gdjs.callbacksRuntimeScenePostEvents,
  sceneLoaded: gdjs.callbacksRuntimeSceneLoaded,
  scenePaused: gdjs.callbacksRuntimeScenePaused,
  sceneResumed: gdjs.callbacksRuntimeSceneResumed,
  sceneUnloading: gdjs.callbacksRuntimeSceneUnloading,
  sceneUnloaded: gdjs.callbacksRuntimeSceneUnloaded,
  objectDeleted: gdjs.callbacksObjectDeletedFromScene,
};

/**
 * A GDevelop runtime event callback.
 * @param runtimeScene The scene affected by the callback event.
 * @param [object] The object (if an object is affected).
 */
export type RuntimeSceneCallback = (
  runtimeScene: gdjs.RuntimeScene,
  object: gdjs.RuntimeObject
) => void;

/**
 * Registers a callback function for a GDevelop runtime event.
 * @param callbackType - The event on which you want your callback to be called.
 * @param callback - The callback to register.
 */
export const registerCallback = function (
  callbackType: GDCallback,
  callback: RuntimeSceneCallback
) {
  CbTypeToCbList[callbackType].push(callback);
};

/**
 * Unregisters a previously registered callback function.
 */
export const unregisterCallback = function (
  callbackType: GDCallback,
  callback: RuntimeSceneCallback
) {
  const callbackArray = CbTypeToCbList[callbackType];
  const indexOfCalllback = callbackArray.indexOf(callback);
  if (indexOfCalllback !== -1) callbackArray.splice(indexOfCalllback, 1);
};
