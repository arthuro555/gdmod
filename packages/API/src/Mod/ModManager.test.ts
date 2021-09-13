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

import { Mod, ModManager } from ".";

describe("Mod manager", () => {
  // Clear the GDJS access patch event listeners.
  gdjs.callbacksRuntimeScenePreEvents.length = 0;
  const mod = new Mod();
  const spy = jest.spyOn(mod, "preEvent");

  it("Can load a mod", () => {
    expect(ModManager.getAllMods()).toHaveLength(0);
    expect(ModManager.has("mod")).not.toBeTruthy();
    ModManager.add("mod", mod);
    expect(ModManager.getAllMods()).toHaveLength(1);
    expect(ModManager.has("mod")).toBeTruthy();
  });

  it("Registers mod methods as runtime callbacks", () => {
    expect(spy).not.toHaveBeenCalled();
    console.log(gdjs.callbacksRuntimeScenePreEvents);
    gdjs.callbacksRuntimeScenePreEvents.forEach((cb) => cb(null as any));
    expect(spy).toHaveBeenCalled();
  });

  it("Allows getting the mod instance", () => {
    expect(ModManager.get("mod")).toEqual(mod);
  });

  it("Can unload a mod", () => {
    expect(ModManager.getAllMods()).toHaveLength(1);
    expect(ModManager.has("mod")).toBeTruthy();
    ModManager.unload("mod");
    expect(ModManager.getAllMods()).toHaveLength(0);
    expect(ModManager.has("mod")).not.toBeTruthy();
  });

  it("Unregisters mod methods as runtime callbacks", () => {
    spy.mockClear();
    expect(spy).not.toHaveBeenCalled();
    gdjs.callbacksRuntimeScenePreEvents.forEach((cb) => cb(null as any));
    expect(spy).not.toHaveBeenCalled();
  });
});
