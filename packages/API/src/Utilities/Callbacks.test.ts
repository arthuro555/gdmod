//@ts-ignore This is an incomplete mock
global.gdjs = {
  callbacksRuntimeScenePreEvents: [],
  callbacksRuntimeScenePostEvents: [],
  callbacksRuntimeSceneLoaded: [],
  callbacksRuntimeScenePaused: [],
  callbacksRuntimeSceneResumed: [],
  callbacksRuntimeSceneUnloading: [],
  callbacksRuntimeSceneUnloaded: [],
  callbacksObjectDeletedFromScene: [],
};

import { registerCallback, unregisterCallback } from "./Callbacks";

describe("Callbacks", () => {
  const callback = jest.fn();

  it("Registers callbacks successfully", () => {
    registerCallback("preEvents", callback);
    gdjs.callbacksRuntimeScenePreEvents.forEach((cb) => cb(null as any));
    expect(callback).toHaveBeenCalled();
  });

  it("Unregisters callbacks successfully", () => {
    callback.mockReset();
    unregisterCallback("preEvents", callback);
    gdjs.callbacksRuntimeScenePreEvents.forEach((cb) => cb(null as any));
    expect(callback).not.toHaveBeenCalled();
  });
});
