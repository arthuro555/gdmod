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
    if(callbackType === GDAPI.CALLBACKS.FIRST_SCENE_LOADED) { gdjs.callbacksFirstRuntimeSceneLoaded.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.SCENE_LOADED) { gdjs.callbacksRuntimeSceneLoaded.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.PRE_EVENTS) { gdjs.callbacksRuntimeScenePreEvents.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.POST_EVENTS) { gdjs.callbacksRuntimeScenePostEvents.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.SCENE_PAUSED) { gdjs.callbacksRuntimeScenePaused.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.SCENE_RESUMED) { gdjs.callbacksRuntimeSceneResumed.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.SCENE_UNLOADING) { gdjs.callbacksRuntimeSceneUnloading.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.SCENE_UNLOADED) { gdjs.callbacksRuntimeSceneUnloaded.push(callback); }
    if(callbackType === GDAPI.CALLBACKS.OBJECT_DELETED_FROM_SCENE) { gdjs.callbacksObjectDeletedFromScene.push(callback); }
}

/**
 * The current Instance of RuntimeScene.
 * @type {?gdjs.RuntimeScene}
 */
GDAPI.currentScene = GDAPI.currentScene || null;

/**
 * The Instance of RuntimeGame.
 * @type {?gdjs.RuntimeGame}
 */
GDAPI.game = GDAPI.game || null;

// Make a getter for GDAPI.currentScene
Object.defineProperty(GDAPI, 'currentScene', { get: function() { 
    if(GDAPI.game != undefined) {
        return GDAPI.game._sceneStack.getCurrentScene();
    }; 
}});

/**
 * This is a function overriden by the loader that lets you send updates to the UI.
 * Receiving and handling messages from the UI is handled by the loader.
 * @function
 * @param {string} id - The Identifier, aka the main message. This tells the IDE what you want to do.
 * @param {any} extraData - An object to pass to the UI with the message.
 */
GDAPI.messageUI = function(id, extraData) {};

// Polyfill Object registration to support older games
gdjs.RuntimeScene.prototype.registerObject = gdjs.RuntimeScene.prototype.registerObject || function(objectData) {
    this._objects.put(objectData.name, objectData);
    this._instances.put(objectData.name, []); //Also reserve an array for the instances
    this._instancesCache.put(objectData.name, []); //and for cached instances
    this._objectsCtor.put(objectData.name, gdjs.getObjectConstructor(objectData.type)); //And cache the constructor for the performance sake
}
