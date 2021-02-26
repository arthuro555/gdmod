/**
 * An interface descibing a Mod.
 * @interface
 */
GDAPI.Mod = class Mod {
  /**
   * Some basic mod metadata automatically set by the loader.
   */
  metadata = {
    /**
     * The mod's name
     * @type {string}
     */
    name: "NO_NAME",

    /**
     * The mod's uid
     * @type {string}
     */
    uid: "NO_UID",

    /**
     * The mod's version
     * @type {string}
     */
    version: "0.0.0",

    /**
     * The mod's description
     * @type {string}
     */
    description: "NO_DESC",

    /**
     * The mod's author
     * @type {string}
     */
    author: "NO_AUTHOR",
  };

  /**
   * Function called when the scene switched.
   * @param {gdjs.RuntimeScene} runtimeScene - The new Scene.
   */
  sceneChanged(runtimeScene) {}

  /**
   * Function called before the scene's event sheet.
   * @param {gdjs.RuntimeScene} runtimeScene - The current Scene.
   */
  preEvent(runtimeScene) {}

  /**
   * Function called after the scene's event sheet.
   * @param {gdjs.RuntimeScene} runtimeScene - The current Scene.
   */
  postEvent(runtimeScene) {}
};

/**
 * A Manager for mods.
 * @namespace
 */
GDAPI.ModManager = {
  mods: {},
};

/**
 * Adds a mod to the manager.
 * @param {GDAPI.Mod} mod - The mod to add to the manager.
 */
GDAPI.ModManager.add = function (mod) {
  this.mods[mod.metadata.uid] = mod;
};

/**
 * Get a mod by uid.
 * @param {string} modUID - The mods UID.
 * @returns {GDAPI.Mod}
 */
GDAPI.ModManager.get = function (modUID) {
  return this.mods[modUID];
};

/**
 * Check the existence of a mod by uid.
 * @param {string} modUID - The mods UID.
 * @returns {boolean}
 */
GDAPI.ModManager.has = function (modUID) {
  return modUID in this.mods;
};

/**
 * Get an array of all loaded mods.
 * @returns {Array<GDAPI.Mod>}
 */
GDAPI.ModManager.getAllMods = function () {
  return Object.values(this.mods);
};

/**
 * @typedef MainManifest
 * @property {string} name
 * @property {string} description
 * @property {string} version
 * @property {string} author
 * @property {string} uid
 */

/**
 * @typedef {Array<string>} IncludesManifest
 */

/**
 * @typedef {Array<{file: string, name: string, kind: string}>} ResourcesManifest
 */

/**
 * @typedef Manifests
 * @property {MainManifest} mainManifest
 * @property {IncludesManifest} includes
 * @property {ResourcesManifest} resources
 */

/**
 * @typedef ModFile
 * @property {Buffer | ArrayBuffer | Blob} file
 * @property {Manifests} manifest
 */

/**
 * Parses a mod from a zip.
 * @param {Buffer | ArrayBuffer | Blob} rawFile - The Mod file.
 * @returns {Promise<ModFile>}
 */
GDAPI.parseModManifest = async function (rawFile) {
  // Load the zip
  const file = await new JSZip().loadAsync(rawFile);

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
 * @param {ModFile} modFile - The Mod file.
 */
GDAPI.loadModFile = async function (modFile) {
  const {
    manifest: { resources, includes, mainManifest },
    file: rawFile,
  } = modFile;
  // Load the zip
  const file = await JSZip.loadAsync(rawFile);

  // Load resources
  if (resources.length !== 0) {
    const promises = [];
    for (let resource of resources)
      promises.push(async () => {
        // Get an URL for the image Blob
        const resourceFile = await file
          .file("resources/" + resource.file)
          .async("blob");
        const blobURL = URL.createObjectURL(resourceFile);

        // Create an HTML image element
        const img = new Image();
        img.src = blobURL;

        // Wait for the image to load
        await new Promise((resolve) =>
          img.addEventListener("load", () => resolve())
        );

        // Load the image as a pixi texture
        GDAPI.game
          .getImageManager()
          ._loadedTextures.put(
            resource.name,
            new PIXI.Texture(new PIXI.BaseTexture(img))
          );

        // Revoke the URL as we are done with loading the image
        URL.revokeObjectURL(blobURL);
      });

    // Wait for all ressources to load before loading the code
    await Promise.all(promises);
  }

  // Load the code
  let modLoaded = false;
  if (includes.length !== 0)
    for (let include of includes) {
      const jsFile = await file.file("code/" + include).async("string");
      const potentialMod = eval(`(function() {${jsFile}}())`);
      if (typeof potentialMod === "function" && !modLoaded) {
        // Load a GDAPI.Mod instance
        GDAPI.loadMod(potentialMod, mainManifest);
        modLoaded = true; // Only allow one mod to load (else there would be multiple mods with the same metadata).
      }
    }

  // Load dummy mod for mod list
  if (!modLoaded) GDAPI.loadMod(GDAPI.Mod, mainManifest);
};

/**
 * Loads a {@link GDAPI.Mod} instance.
 * This is used only to initialize a Mod class.
 * @param {GDAPI.Mod} ModClass - The {@link GDAPI.Mod} class.
 * @param {object} manifest - The main manifest of the mod.
 */
GDAPI.loadMod = function (ModClass, manifest) {
  const mod = new ModClass();
  mod.manifest = mod.manifest || {};

  function unserializeAttribute(attribute, optional) {
    optional = optional || false;
    if (typeof manifest[attribute] === "undefined" && !optional)
      // There are defaults for everything, but still warn if the attribute isn't meant to be optional.
      console.error(`Missing Atrribute '${attribute}' in GDMod.json!`);
    else mod.metadata[attribute] = manifest[attribute];
  }

  unserializeAttribute("name");
  unserializeAttribute("uid");
  unserializeAttribute("author");
  unserializeAttribute("description");
  unserializeAttribute("version");

  GDAPI.ModManager.add(mod);

  if (mod.preEvent)
    GDAPI.registerCallback(GDAPI.CALLBACKS.PRE_EVENTS, (scene) =>
      mod.preEvent(scene)
    );
  if (mod.postEvent)
    GDAPI.registerCallback(GDAPI.CALLBACKS.POST_EVENTS, (scene) =>
      mod.postEvent(scene)
    );
  if (mod.sceneChanged)
    GDAPI.registerCallback(GDAPI.CALLBACKS.SCENE_LOADED, (scene) =>
      mod.sceneChanged(scene)
    );
};
