namespace GDAPI {
  /**
   * @typedef CallbacksObject
   * @property {RuntimeSceneCallback} [preEvent]
   * @property {RuntimeSceneCallback} [postEvent]
   * @property {RuntimeSceneCallback} [sceneChanged]
   */

  /**
   * A utility class that manages loading and unloading of mods.
   */
  class ModManagerClass {
    _mods: Record<string, Mod> = {};
    _callbacks: Record<string, any> = {};

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
     * @param {string} modUID - The mods UID.
     * @returns {boolean}
     */
    has(modUID) {
      return modUID in this._mods;
    }

    /**
     * Unloads a mod by uid.
     * @param {string} modUID - The mods UID.
     */
    unload(modUID) {
      const mod = this._mods[modUID];
      if (mod == undefined) return;
      if (mod.unload) mod.unload();

      /** @type {CallbacksObject} */
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
     * @returns {Array<GDAPI.Mod>}
     */
    getAllMods() {
      return Object.values(this._mods);
    }
  }

  /**
   * The singleton instance of the {@link ModManager}.
   */
  export const ModManager = new ModManagerClass();
}
