/**
 * An interface descibing a Mod.
 * @interface
 */
GDAPI.Mod = function() {}

/**
 * Function called while the mod is loading.
 * @param {number} modID - The ID attributed to the mod by the Loader.
 */
GDAPI.Mod.prototype.initialize = function(modID) {
    this.id = modID;
};

/**
 * Function called before the scene's event sheet.
 * @param {gdjs.RuntimeScene} runtimeScene - The current Scene.
 */
GDAPI.Mod.prototype.preEvent = function(runtimeScene) {}

/**
 * Function called after the scene's event sheet.
 * @param {gdjs.RuntimeScene} runtimeScene - The current Scene.
 */
GDAPI.Mod.prototype.postEvent = function(runtimeScene) {}
