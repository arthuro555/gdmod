import {
  RuntimeSceneCallback,
  registerCallback,
  unregisterCallback,
  GDCallback,
} from "../Utilities/Callbacks";
import type { Mod } from ".";

type CallbacksObject = { [K in GDCallback]?: RuntimeSceneCallback };

/**
 * The mod manager allows to load, unload and interact with Mods.
 *
 * @category Mod integration
 * @example
 * You can block loading your Mod if an incompatible mod is detected:
 * ```js
 * class MyMod extends GDAPI.Mod {
 *   constructor() {
 *     if(GDAPI.ModManager.has("my/incompatible/mod/uid"))
 *       GDAPI.ModManager.unload("my/mod/uid");
 *   }
 * }
 * ```
 *
 * @example
 * You can interact with another mod using its public methods:
 * ```js
 * class MyMod extends GDAPI.Mod {
 *   constructor() {
 *     if(GDAPI.ModManager.has("my/compatible/mod/uid"))
 *       GDAPI.ModManager.get("my/compatible/mod/uid").setupIntegration(this);
 *   }
 * }
 * ```
 */
export class ModManager {
  private static _mods: Record<string, Mod> = {};
  private static _callbacks: Record<string, CallbacksObject> = {};

  /**
   * Adds a mod to the manager.
   * @param uid - The mods UID.
   * @param mod - The mod instance to add.
   */
  static add(uid: string, mod: Mod): void {
    if (this.has(uid)) this.unload(uid);

    this._mods[uid] = mod;

    const callbacks: CallbacksObject = (this._callbacks[uid] = {});

    if (mod.preEvent) {
      const callback = (scene: gdjs.RuntimeScene) => mod.preEvent(scene);
      registerCallback("preEvents", callback);
      callbacks.preEvents = callback;
    }

    if (mod.postEvent) {
      const callback = (scene: gdjs.RuntimeScene) => mod.postEvent(scene);
      registerCallback("postEvents", callback);
      callbacks.postEvents = callback;
    }

    if (mod.sceneChanged) {
      const callback = (scene: gdjs.RuntimeScene) => mod.sceneChanged(scene);
      registerCallback("sceneLoaded", callback);
      callbacks.sceneLoaded = callback;
    }
  }

  /**
   * Get a mod by uid.
   * @param modUID - The mods UID.
   */
  static get(modUID: string): Mod | null {
    return this._mods[modUID] || null;
  }

  /**
   * Check if a mod is loaded by uid.
   * @param modUID - The mods UID.
   */
  static has(modUID: string): boolean {
    return modUID in this._mods;
  }

  /**
   * Unloads a mod by uid.
   * @param modUID - The mods UID.
   */
  static unload(modUID: string): void {
    const mod = this._mods[modUID];
    if (mod == undefined) return;
    if (mod.unload) mod.unload();

    const callbacks = this._callbacks[modUID];
    Object.entries(callbacks).forEach(([name, cb]) =>
      unregisterCallback(name as GDCallback, cb as RuntimeSceneCallback)
    );

    delete this._callbacks[modUID];
    delete this._mods[modUID];
  }

  /**
   * Get an array of all loaded mods.
   */
  static getAllMods(): Mod[] {
    return Object.values(this._mods);
  }
}
