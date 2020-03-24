/**
 * Tools to interract with scenes.
 * @memberof GDAPI
 * @namespace
 */
GDAPI.SceneTools = {}

/**
 * Add an object to the Scene and take care of registration.
 * @param {gdjs.RuntimeObject} runtimeObject - The object to add to the scene.
 */
GDAPI.SceneTools.addObjectToScene = function (runtimeObject) {
    if(!GDAPI.currentScene._objects.containsKey(runtimeObject.getName())) {
        GDAPI.currentScene.registerObject(runtimeObject.data);
    }
    GDAPI.currentScene.addObject(runtimeObject);
}
