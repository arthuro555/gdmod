namespace GDAPI {
  interface CallbacksObject {
    preEvent?: RuntimeSceneCallback;
    postEvent?: RuntimeSceneCallback;
    sceneChanged?: RuntimeSceneCallback;
  }

  /**
   * A utility class that manages loading and unloading of mods.
   * Don't use directly, use {@link ModManager}.
   */
  export class ModManagerClass {
    private _mods: Record<string, Mod> = {};
    private _callbacks: Record<string, CallbacksObject> = {};

    /**
     * Adds a mod to the manager.
     */
    add(uid: string, mod: Mod): void {
      if (this.has(uid)) this.unload(uid);

      this._mods[uid] = mod;

      const callbacks: Record<string, any> = (this._callbacks[uid] = {});
      if (mod.preEvent) {
        const callback = (scene) => mod.preEvent(scene);
        GDAPI.registerCallback(GDAPI.CALLBACKS.PRE_EVENTS, callback);
        callbacks.preEvent = callback;
      }
      if (mod.postEvent) {
        const callback = (scene) => mod.postEvent(scene);
        GDAPI.registerCallback(GDAPI.CALLBACKS.POST_EVENTS, callback);
        callbacks.postEvent = callback;
      }
      if (mod.sceneChanged) {
        const callback = (scene) => mod.sceneChanged(scene);
        GDAPI.registerCallback(GDAPI.CALLBACKS.SCENE_LOADED, callback);
        callbacks.sceneChanged = callback;
      }
    }

    /**
     * Get a mod by uid.
     */
    get(modUID: string): Mod | null {
      return this._mods[modUID] || null;
    }

    /**
     * Check if a mod is loaded by uid.
     * @param modUID - The mods UID.
     */
    has(modUID: string): boolean {
      return modUID in this._mods;
    }

    /**
     * Unloads a mod by uid.
     * @param modUID - The mods UID.
     */
    unload(modUID: string): void {
      const mod = this._mods[modUID];
      if (mod == undefined) return;
      if (mod.unload) mod.unload();

      const callbacks = this._callbacks[modUID];
      if (callbacks.preEvent)
        GDAPI.unregisterCallback(
          GDAPI.CALLBACKS.PRE_EVENTS,
          callbacks.preEvent
        );
      if (callbacks.postEvent)
        GDAPI.unregisterCallback(
          GDAPI.CALLBACKS.POST_EVENTS,
          callbacks.postEvent
        );
      if (callbacks.sceneChanged)
        GDAPI.unregisterCallback(
          GDAPI.CALLBACKS.SCENE_LOADED,
          callbacks.sceneChanged
        );

      delete this._callbacks[modUID];
      delete this._mods[modUID];
    }

    /**
     * Get an array of all loaded mods.
     */
    getAllMods(): Mod[] {
      return Object.values(this._mods);
    }
  }

  /**
   * The singleton instance of the {@link ModManager}.
   */
  export const ModManager = new ModManagerClass();
}
