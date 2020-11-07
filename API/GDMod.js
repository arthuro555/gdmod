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
 * @returns {boolean} - Was the adding successful?
 */
GDAPI.ModManager.add = function (mod) {
  if (mod.metadata.uid in this.mods) {
    return false;
  }
  this.mods[mod.metadata.uid] = mod;
  return true;
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
 * @typedef {Array<{file: string, name: string}>} ResourcesManifest
 */

/**
 * @typedef Manifests
 * @property {MainManifest} main
 * @property {IncludesManifest} includes
 * @property {ResourcesManifest} resources
 */

/**
 * @typedef ModFile
 * @property {JSZip} file
 * @property {Buffer | ArrayBuffer | Blob} rawFile
 * @property {Manifests} manifest
 */

/**
 * Parses a mod from a zip.
 * @param {Buffer | ArrayBuffer | Blob} rawFile - The Mod file.
 * @returns {Promise<ModFile>}
 */
GDAPI.parseModFile = function (rawFile) {
  return new JSZip().loadAsync(rawFile).then((file) => {
    // Load Manifests
    // First we need to verify if the manifests are correct
    // Verify their presence
    if (
      file.file("data/GDMod.json") == undefined ||
      file.file("data/includes.json") == undefined ||
      file.file("data/resources.json") == undefined
    ) {
      reject("A manifest file is missing! Is this a GDMod mod?");
      return;
    }

    if (GDAPI.currentScene == undefined) {
      reject(
        "The game seems unpatched or not fully loaded. Please wait for the game to fully load."
      );
      return;
    }

    // Verify their basic validity and store them in an object
    const manifest = {};
    return file
      .file("data/GDMod.json")
      .async("string")
      .then((GDMod) => {
        manifest.main = JSON.parse(GDMod);
      })
      .catch(() => {
        reject("The manifest GDMod.json cannot be parsed! Is it valid JSON?");
      })

      .then(() => file.file("data/includes.json").async("string"))
      .then((includes) => {
        manifest.includes = JSON.parse(includes);
      })
      .catch(() => {
        reject(
          "The manifest includes.json cannot be parsed! Is it valid JSON?"
        );
      })

      .then(() => file.file("data/resources.json").async("string"))
      .then((resources) => {
        manifest.resources = JSON.parse(resources);
      })
      .catch(() => {
        reject(
          "The manifest resources.json cannot be parsed! Is it valid JSON?"
        );
      })
      .then(() => {
        return {
          file,
          rawFile,
          manifest,
        };
      });
  });
};

/**
 * Loads a pre-parsed mod.
 * This is what is used to actually load a mod file.
 * @param {ModFile} modFile - The Mod file.
 */
GDAPI.loadModFile = function (modFile) {
  /** @type {Manifests} */
  const { manifest, file } = modFile;
  if (!manifest || !file) return Promise.reject("Invalid mod file!");

  // Load resources
  return new Promise((resolver) => {
    if (Object.keys(manifest.resources).length === 0) {
      resolver(); //Nothing to load.
    }

    const imageManager = GDAPI.game.getImageManager();

    let loaders = [];
    for (let resource of manifest.resources) {
      loaders.push(
        file
          .file("resources/" + resource.file)
          .async("blob")
          .then((resourceFile) => {
            // Convert blob to dataurl
            return new Promise((resolveReader) => {
              const blobURL = URL.createObjectURL(resourceFile);
              var img = new Image();
              img.addEventListener("load", function (event) {
                URL.revokeObjectURL(blobURL);
              });
              img.src = blobURL;
              imageManager._loadedTextures.put(
                resource.name,
                new PIXI.Texture(new PIXI.BaseTexture(img))
              );
              resolveReader();
            });
          })
      );
    }
    Promise.all(loaders).then(() => {
      resolver();
    });
  })
    .then(() => {
      // Load the code
      let promises = [];
      let modLoaded = false;

      for (let include of manifest.includes) {
        promises.push(
          file
            .file("code/" + include)
            .async("string")
            .then((jsFile) => {
              const potentialMod = eval(`(function() {${jsFile}}())`);
              if (typeof potentialMod === "function" && !modLoaded) {
                GDAPI.loadMod(potentialMod, manifest.main);
                modLoaded = true; // Only allow one mod to load (else there would be multiple mods with same metadata).
              }
            })
        );
      }
      return Promise.all(promises).then(() => {
        if (!modLoaded) {
          // Load dummy mod for mod list
          GDAPI.loadMod(GDAPI.Mod, manifests.main);
        }
      });
    })
    .catch((error) => {
      console.error("Error while loading mod file: " + error.toString());
    });
};

/**
 * Loads a {@link GDAPI.Mod} instance.
 * This is used only to initialize a Mod class.
 * @param {GDAPI.Mod} ModClass - The {@link GDAPI.Mod} class.
 * @param {object} manifest - The main manifest of the mod.
 */
GDAPI.loadMod = function (ModClass, manifest) {
  const mod = new ModClass();

  function unserializeAttribute(attribute, optional) {
    optional = optional || false;
    if (typeof manifest[attribute] === "undefined" && !optional) {
      // There are defaults for everything, but still warn if the attribute isn't meant to be optional.
      console.error(`Missing Atrribute '${attribute}' in GDMod.json!`);
    } else mod.metadata[attribute] = manifest[attribute];
  }

  unserializeAttribute("name");
  unserializeAttribute("uid");
  unserializeAttribute("author");
  unserializeAttribute("description");
  unserializeAttribute("version");

  if (!GDAPI.ModManager.add(mod))
    return console.error(`Tried to load already loaded mod '${mod.name}'!`);
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
