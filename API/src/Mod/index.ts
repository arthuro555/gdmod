import { ModManager } from "../ModManager";
import { loadAsync as loadZIP } from "jszip";
import { loadResources } from "../Loaders";
import { parseModManifest, ModFile } from "./ManifestParser";

export { parseModManifest };

/**
 * This class describes a GDMod mod that can be returned by the JavaScript code. Using it has advantages:
 * 1. Other mods can interact with yours.
 * 2. The mod can be managed by GDMod, allowing for more control by the user and therefore a better UX.
 * 3. Hopefully a better modding experience.
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

/**
 * Loads a pre-parsed mod.
 * This is what is actually loading a mod.
 * @param modFile - The Mod file.
 * @internal
 */
export const loadModFile = async function (modFile: ModFile) {
  const {
    manifest: { resources, includes, mainManifest },
    file: rawFile,
  } = modFile;

  // Load the zip
  const file = await loadZIP(rawFile);

  // Load resources
  if (resources.length !== 0) await loadResources(file, resources);

  // Load the code
  let modLoaded = false;
  if (includes.length !== 0)
    for (let include of includes) {
      //@ts-ignore parseModManifest already made sure that it isn't null
      const jsFile = await file.file("code/" + include).async("string");

      const potentialMod = window.eval(
        `(function() {${jsFile}})()`
      ) as typeof Mod;

      if (typeof potentialMod === "function" && !modLoaded) {
        // Load a Mod instance
        ModManager.get().add(mainManifest.uid, new potentialMod());
        modLoaded = true; // Only allow one mod to load (else there would be multiple mods with the same metadata).
      }
    }

  // Load dummy mod for mod list
  if (!modLoaded) ModManager.get().add(mainManifest.uid, new Mod());
};
