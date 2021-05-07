import { ModManager } from "../ModManager";
import { loadAsync as loadZIP } from "jszip";
import { loadResources } from "../Loaders";
import { ModFile } from "./ManifestParser";
import { Mod } from ".";

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
