// Polyfill Object registration to support older games
gdjs.RuntimeScene.prototype.registerObject =
  gdjs.RuntimeScene.prototype.registerObject ||
  function (objectData) {
    this._objects.put(objectData.name, objectData);
    this._instances.put(objectData.name, []); //Also reserve an array for the instances
    this._instancesCache.put(objectData.name, []); //and for cached instances
    this._objectsCtor.put(
      objectData.name,
      gdjs.getObjectConstructor(objectData.type)
    ); //And cache the constructor for the performance sake
  };

/**
 * Tools to interract with scenes.
 * @memberof GDAPI
 * @namespace
 */
GDAPI.SceneTools = {};

/**
 * Add an object to the Scene and take care of registration.
 * @param {gdjs.RuntimeObject} runtimeObject - The object to add to the scene.
 */
GDAPI.SceneTools.addObjectToScene = function (runtimeObject) {
  if (!GDAPI.currentScene._objects.containsKey(runtimeObject.getName())) {
    GDAPI.currentScene.registerObject(runtimeObject.data);
  }
  GDAPI.currentScene.addObject(runtimeObject);
};
