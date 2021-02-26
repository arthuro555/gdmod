/**
 * Polyfills missing callbacks by monkey patching classes to call the callbacks when certain methods are called.
 * @fileoverview
 */

(function () {
  if (!gdjs.callbacksFirstRuntimeSceneLoaded) {
    gdjs.callbacksFirstRuntimeSceneLoaded = [];
    const RuntimeSceneCtr = gdjs.RuntimeScene;
    let once = false;
    gdjs.RuntimeScene = function (...args) {
      RuntimeSceneCtr.apply(this, args);
      if (!once) {
        once = true;
        for (const e of gdjs.callbacksFirstRuntimeSceneLoaded) e(this);
      }
    };
    Object.assign(gdjs.RuntimeScene, RuntimeSceneCtr);
    gdjs.RuntimeScene.prototype = Object.create(RuntimeSceneCtr.prototype);
  }

  if (!gdjs.callbacksRuntimeSceneLoaded) {
    gdjs.callbacksRuntimeSceneLoaded = [];
    const RuntimeSceneCtr = gdjs.RuntimeScene;
    gdjs.RuntimeScene = function (...args) {
      RuntimeSceneCtr.apply(this, args);
      for (const e of gdjs.callbacksRuntimeSceneLoaded) e(this);
    };
    Object.assign(gdjs.RuntimeScene, RuntimeSceneCtr);
    gdjs.RuntimeScene.prototype = Object.create(RuntimeSceneCtr.prototype);
  }

  if (!gdjs.callbacksRuntimeScenePreEvents) {
    gdjs.callbacksRuntimeScenePreEvents = [];
    const renderAndStep = gdjs.RuntimeScene.prototype.renderAndStep;
    gdjs.RuntimeScene.prototype.renderAndStep = function (...args) {
      for (const e of gdjs.callbacksRuntimeScenePreEvents) e(this);
      return renderAndStep.apply(this, args);
    };
  }

  if (!gdjs.callbacksRuntimeScenePostEvents) {
    gdjs.callbacksRuntimeScenePostEvents = [];
    const renderAndStep = gdjs.RuntimeScene.prototype.renderAndStep;
    gdjs.RuntimeScene.prototype.renderAndStep = function (...args) {
      const retVal = renderAndStep.apply(this, args);
      for (const e of gdjs.callbacksRuntimeScenePostEvents) e(this);
      return retVal;
    };
  }

  if (!gdjs.callbacksRuntimeSceneUnloading) {
    gdjs.callbacksRuntimeSceneUnloading = [];
    const unloadScene = gdjs.RuntimeScene.prototype.unloadScene;
    gdjs.RuntimeScene.prototype.unloadScene = function (...args) {
      for (const e of gdjs.callbacksRuntimeSceneUnloading) e(this);
      return unloadScene.apply(this, args);
    };
  }

  if (!gdjs.callbacksRuntimeSceneUnloaded) {
    gdjs.callbacksRuntimeSceneUnloaded = [];
    const unloadScene = gdjs.RuntimeScene.prototype.unloadScene;
    gdjs.RuntimeScene.prototype.unloadScene = function (...args) {
      const retVal = unloadScene.apply(this, args);
      for (const e of gdjs.callbacksRuntimeSceneUnloaded) e(this);
      return retVal;
    };
  }

  if (!gdjs.callbacksRuntimeScenePaused) {
    gdjs.callbacksRuntimeScenePaused = [];
    const push = gdjs.SceneStack.prototype.push;
    gdjs.SceneStack.prototype.push = function (...args) {
      const retVal = push.apply(this, args);
      for (const e of gdjs.callbacksRuntimeScenePaused) e(GDAPI.currentScene);
      return retVal;
    };
  }

  if (!gdjs.callbacksRuntimeSceneResumed) {
    gdjs.callbacksRuntimeSceneResumed = [];
    const pop = gdjs.SceneStack.prototype.pop;
    gdjs.SceneStack.prototype.pop = function (...args) {
      const retVal = pop.apply(this, args);
      for (const e of gdjs.callbacksRuntimeSceneResumed) e(GDAPI.currentScene);
      return retVal;
    };
  }

  if (!gdjs.callbacksObjectDeletedFromScene) {
    gdjs.callbacksObjectDeletedFromScene = [];
    const deleteFromScene = gdjs.RuntimeObject.prototype.deleteFromScene;
    gdjs.RuntimeObject.prototype.deleteFromScene = function (...args) {
      const retVal = deleteFromScene.apply(this, args);
      for (const e of gdjs.callbacksObjectDeletedFromScene) e(this);
      return retVal;
    };
  }
})();
