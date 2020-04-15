/**
 * An interface descibing a Mod.
 * @interface
 */
GDAPI.Mod = function() {};

/**
 * Function called while the mod is loading.
 * @param {number} modID - The ID attributed to the mod by the Loader.
 */
GDAPI.Mod.prototype.initialize = function() {};

/**
 * Function called before the scene's event sheet.
 * @param {gdjs.RuntimeScene} runtimeScene - The current Scene.
 */
GDAPI.Mod.prototype.preEvent = function(runtimeScene) {};

/**
 * Function called after the scene's event sheet.
 * @param {gdjs.RuntimeScene} runtimeScene - The current Scene.
 */
GDAPI.Mod.prototype.postEvent = function(runtimeScene) {};

/**
 * Function called when the first game scene loaded.
 * @param {gdjs.RuntimeScene} runtimeScene - The current Scene.
 */
GDAPI.Mod.prototype.onGameStart = function(runtimeScene) {}

/**
 * Loads a mod from a zip.
 * @param {any} modAsZip - The Mod file.
 */
GDAPI.loadZipMod = function(modAsZip) {
    // TODO
};

/**
 * Loads a {@link GDAPI.Mod} instance.
 * @param {GDAPI.Mod} mod - The {@link GDAPI.Mod} instance.
 */
GDAPI.loadMod = function(mod) {
    GDAPI.registerCallback(GDAPI.CALLBACKS.PRE_EVENTS, mod.preEvent);
    GDAPI.registerCallback(GDAPI.CALLBACKS.POST_EVENTS, mod.postEvent);
    GDAPI.registerCallback(GDAPI.CALLBACKS.FIRST_SCENE_LOADED, mod.onGameStart);
    mod.initialize();
};
