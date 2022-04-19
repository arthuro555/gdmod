/**
 * This class describes a GDMod mod that can be returned by the JavaScript code. Using it has advantages:
 * 1. Other mods can interact with yours.
 * 2. The mod can be managed by GDMod, allowing for more control by the user and therefore a better UX.
 * 3. Fast and easy access to runtime callbacks.
 *
 * @category Mod integration
 * @example
 * ```js
 * class myMod extends Mod {
 *     preEvent(runtimeScene) {
 *         console.log("Hello World!");
 *     };
 * }
 *
 * return myMod;
 * ```
 */
 export class Mod {
  /**
   * Function called when the scene switched.
   * @param {gdjs.RuntimeScene} runtimeScene - The new scene.
   */
  sceneChanged(runtimeScene: gdjs.RuntimeScene) {}

  /**
   * Function called before the scene event sheet.
   * @param {gdjs.RuntimeScene} runtimeScene - The current scene.
   */
  preEvent(runtimeScene: gdjs.RuntimeScene) {}

  /**
   * Function called after the scene event sheet.
   * @param {gdjs.RuntimeScene} runtimeScene - The current scene.
   */
  postEvent(runtimeScene: gdjs.RuntimeScene) {}

  /**
   * Function called when the mod should get unloaded, to allow it to clean things up.
   */
  unload() {}
}
