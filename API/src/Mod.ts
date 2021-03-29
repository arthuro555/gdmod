import { ModManager } from "./ModManager";
import { loadAsync as loadZIP } from "jszip";

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

interface MainManifest {
  name: string;
  description: string;
  version: string;
  author: string;
  uid: string;
}

type Resource = { file: string; name: string; kind: string };

interface Manifests {
  mainManifest: MainManifest;
  includes: string[];
  resources: Resource[];
}

type File = Buffer | ArrayBuffer | Blob;

interface ModFile {
  file: File;
  manifest: Manifests;
}

/**
 * Parses a mod from a zip.
 * This allows preparsing the mod when installing it, to have access to its metadata without initializing it.
 * @param rawFile - The Mod file.
 * @internal
 */
export const parseModManifest = async function (
  rawFile: File
): Promise<ModFile> {
  // Load the zip
  const file = await loadZIP(rawFile);

  // Load the files
  const mainManifestFile = file.file("data/GDMod.json");
  const includesFile = file.file("data/includes.json");
  const resourcesFile = file.file("data/resources.json");

  // Verify their presence
  if (
    mainManifestFile == undefined ||
    includesFile == undefined ||
    resourcesFile == undefined
  )
    throw new Error("A manifest file is missing! Is this a GDMod mod?");

  if (GDAPI.currentScene == undefined)
    throw new Error(
      "The game seems unpatched or not fully loaded. Please wait for the game to fully load."
    );

  // Parse the files into a Manifests object
  try {
    return {
      manifest: {
        mainManifest: JSON.parse(await mainManifestFile.async("string")),
        includes: JSON.parse(await includesFile.async("string")),
        resources: JSON.parse(await resourcesFile.async("string")),
      },
      file: rawFile,
    };
  } catch (e) {
    throw new Error(
      "A manifest could not be parsed! Make sure it is valid JSON. " + e
    );
  }
};

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
  if (resources.length !== 0) {
    const promises: Promise<void>[] = [];
    for (let resource of resources)
      promises.push(
        (async function () {
          // Get an URL for the image Blob
          //@ts-ignore parseModManifest Already made sure that it isn't null
          const resourceFile = await file
            .file("resources/" + resource.file)
            .async("blob");
          const blobURL = URL.createObjectURL(resourceFile);

          // Create an HTML image element
          const img = new Image();
          img.src = blobURL;

          // Wait for the image to load
          await new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve());
          });

          // Load the image as a pixi texture
          GDAPI.game
            .getImageManager()
            ._loadedTextures.put(
              resource.name,
              new PIXI.Texture(new PIXI.BaseTexture(img))
            );

          // Revoke the URL as we are done with loading the image
          URL.revokeObjectURL(blobURL);
        })()
      );

    // Wait for all ressources to load before loading the code
    await Promise.all(promises);
  }

  // Load the code
  let modLoaded = false;
  if (includes.length !== 0)
    for (let include of includes) {
      //@ts-ignore parseModManifest Already made sure that it isn't null
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
