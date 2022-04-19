import { JSZipObject, loadAsync as loadZIP } from "jszip";
import { loadResources } from "../Loaders";
import { Mod } from "./Mod";
import { ModFile } from "./ManifestParser";
import { ModManager } from "./ModManager";

/**
 * Loads a mod parsed by {@link parseModManifest}.
 * This is what is actually initializing a mod code and resources.
 *
 * @param modFile - The parsed and validated mod file.
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
      const jsFile = await (file.file("code/" + include) as JSZipObject).async(
        "string"
      );

      const potentialMod = window.eval(
        `(function() {${jsFile}})()`
      ) as typeof Mod;

      if (typeof potentialMod === "function" && !modLoaded) {
        // Load a Mod instance
        ModManager.add(mainManifest.uid, new potentialMod());
        modLoaded = true; // Only allow one mod to load (else there would be multiple mods with the same metadata).
      }
    }

  // Load dummy mod for mod list
  if (!modLoaded) ModManager.add(mainManifest.uid, new Mod());
};
