/**
 * The namespace containing the whole modding API
 * @namespace
 */
window.GDAPI = {};

/**
 * GD Callback type enum.
 * @enum
 */
GDAPI.CALLBACKS = {
    FIRST_SCENE_LOADED: 0,
    SCENE_LOADED: 1,
    PRE_EVENTS: 2,
    POST_EVENTS: 3,
    SCENE_PAUSED: 4,
    SCENE_RESUMED: 5,
    SCENE_UNLOADING: 6,
    SCENE_UNLOADED: 7,
    OBJECT_DELETED_FROM_SCENE: 8
}

/**
 * Registers Callback functions.
 * @param {GDAPI.CALLBACKS} callbackType - The event on which you want your callback to be called.
 * @param {Function} callback - The callback to register.
 */
GDAPI.registerCallback = function(callbackType, callback) {
    if(callbackType === GDAPI.CALLBACKS.FIRST_SCENE_LOADED) { callbacksFirstRuntimeSceneLoaded.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.SCENE_LOADED) { callbacksRuntimeSceneLoaded.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.PRE_EVENTS) { callbacksRuntimeScenePreEvents.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.POST_EVENTS) { callbacksRuntimeScenePostEvents.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.SCENE_PAUSED) { callbacksRuntimeScenePaused.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.SCENE_RESUMED) { callbacksRuntimeSceneResumed.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.SCENE_UNLOADING) { callbacksRuntimeSceneUnloading.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.SCENE_UNLOADED) { callbacksRuntimeSceneUnloaded.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.OBJECT_DELETED_FROM_SCENE) { callbacksObjectDeletedFromScene.push(callback); }
}

/**
 * The current Instance of RuntimeScene.
 * @type {gdjs.RuntimeScene}
 */
GDAPI.currentScene = null;

/**
 * The Instance of RuntimeGame.
 * @type {gdjs.RuntimeGame}
 */
GDAPI.game = null;

// Polyfill Object registration to support Older games
gdjs.RuntimeScene.prototype.registerObject = gdjs.RuntimeScene.prototype.registerObject || function(objectData) {
    this._objects.put(objectData.name, objectData);
    this._instances.put(objectData.name, []); //Also reserve an array for the instances
    this._instancesCache.put(objectData.name, []); //and for cached instances
    this._objectsCtor.put(objectData.name, gdjs.getObjectConstructor(objectData.type)); //And cache the constructor for the performance sake
}
