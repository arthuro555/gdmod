declare const JSZip: typeof import("jszip");
namespace GDAPI {
  /**
   * The base mod of all mods.
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
   * @param rawFile - The Mod file.
   * @returns {Promise<ModFile>}
   */
  export const parseModManifest = async function (
    rawFile: File
  ): Promise<ModFile> {
    // Load the zip
    const file = await JSZip.loadAsync(rawFile);

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
   * This is what is used to actually load a mod file.
   * @param modFile - The Mod file.
   */
  export const loadModFile = async function (modFile: ModFile) {
    const {
      manifest: { resources, includes, mainManifest },
      file: rawFile,
    } = modFile;
    // Load the zip
    const file = await JSZip.loadAsync(rawFile);

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

        // Code run through eval have access to this scopes variable,
        // we override those with undefined in the scope of the Mod
        // to not let those internal temporaries leak.
        const blockedVariables = [
          "blockedVariables",
          "jsFile",
          "include",
          "includes",
          "modLoaded",
          "resources",
          "mainManifest",
          "file",
          "modFile",
          "rawFile",
        ];

        const potentialMod = (eval(
          `(function(${blockedVariables.join(", ")}) {${jsFile}})`
        ) as () => any)
          //@ts-ignore Array.fill works with undefined
          .apply({}, blockedVariables.fill(undefined));

        if (typeof potentialMod === "function" && !modLoaded) {
          // Load a GDAPI.Mod instance
          GDAPI.ModManager.add(mainManifest.uid, new potentialMod());
          modLoaded = true; // Only allow one mod to load (else there would be multiple mods with the same metadata).
        }
      }

    // Load dummy mod for mod list
    if (!modLoaded) GDAPI.ModManager.add(mainManifest.uid, new GDAPI.Mod());
  };
}
