import {
  RuntimeSceneCallback,
  registerCallback,
  unregisterCallback,
  CALLBACKS,
} from "./Callbacks";
import type { Mod } from "./Mod";

interface CallbacksObject {
  preEvent?: RuntimeSceneCallback;
  postEvent?: RuntimeSceneCallback;
  sceneChanged?: RuntimeSceneCallback;
}

/**
 * The mod manager allows to load, unload and interact with Mods.
 *
 * @category Mod integration
 * @example
 * You can block loading your Mod if an incompatible mod is detected
 * ```js
 * class MyMod extends GDAPI.Mod {
 *   constructor() {
 *     const manager = GDAPI.ModManager.get();
 *     if(manager.has("my/incompatible/mod/uid")) manager.unload("my/mod/uid");
 *   }
 * }
 * ```
 *
 * @example
 * You can interact with another mod using its public methods:
 * ```js
 * class MyMod extends GDAPI.Mod {
 *   constructor() {
 *     const manager = GDAPI.ModManager.get();
 *     if(manager.has("my/compatible/mod/uid"))
 *       manager.get("my/compatible/mod/uid").setupIntegration(this);
 *   }
 * }
 * ```
 */
export class ModManager {
  private _mods: Record<string, Mod> = {};
  private _callbacks: Record<string, CallbacksObject> = {};
  private static instance = new ModManager();

  /**
   * Returns the singleton instance of the mod manager.
   */
  static get(): ModManager {
    return this.instance;
  }

  /**
   * Adds a mod to the manager.
   */
  add(uid: string, mod: Mod): void {
    if (this.has(uid)) this.unload(uid);

    this._mods[uid] = mod;

    const callbacks: Record<string, any> = (this._callbacks[uid] = {});
    if (mod.preEvent) {
      const callback = (scene) => mod.preEvent(scene);
      registerCallback(CALLBACKS.PRE_EVENTS, callback);
      callbacks.preEvent = callback;
    }
    if (mod.postEvent) {
      const callback = (scene) => mod.postEvent(scene);
      registerCallback(CALLBACKS.POST_EVENTS, callback);
      callbacks.postEvent = callback;
    }
    if (mod.sceneChanged) {
      const callback = (scene) => mod.sceneChanged(scene);
      registerCallback(CALLBACKS.SCENE_LOADED, callback);
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
      unregisterCallback(CALLBACKS.PRE_EVENTS, callbacks.preEvent);
    if (callbacks.postEvent)
      unregisterCallback(CALLBACKS.POST_EVENTS, callbacks.postEvent);
    if (callbacks.sceneChanged)
      unregisterCallback(CALLBACKS.SCENE_LOADED, callbacks.sceneChanged);

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
