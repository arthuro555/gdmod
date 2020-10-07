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
    }

    /**
     * Function called when the scene switched.
     * @param {gdjs.RuntimeScene} runtimeScene - The new Scene.
     */
    sceneChanged(runtimeScene) {};

    /**
     * Function called before the scene's event sheet.
     * @param {gdjs.RuntimeScene} runtimeScene - The current Scene.
     */
    preEvent(runtimeScene) {};

    /**
     * Function called after the scene's event sheet.
     * @param {gdjs.RuntimeScene} runtimeScene - The current Scene.
     */
    postEvent(runtimeScene) {};
};

/**
 * A Manager for mods.
 * @namespace
 */
GDAPI.ModManager = {
    mods: {}
};

/**
 * Adds a mod to the manager.
 * @param {GDAPI.Mod} mod - The mod to add to the manager.
 * @returns {boolean} - Was the adding successful?
 */
GDAPI.ModManager.add = function(mod) {
    if(mod.metadata.uid in this.mods) {
        return false;
    }
    this.mods[mod.metadata.uid] = mod;
    GDAPI.messageUI("listMods", this.getAllMods().map(mod => mod.metadata));
    return true;
}

/**
 * Get a mod by uid.
 * @param {string} modUID - The mods UID.
 * @returns {GDAPI.Mod}
 */
GDAPI.ModManager.get = function(modUID) {
    return this.mods[modUID];
}

/**
 * Get an array of all loaded mods.
 * @returns {Array<GDAPI.Mod>}
 */
GDAPI.ModManager.getAllMods = function() {
    return Object.values(this.mods);
}

/**
 * Loads a mod from a zip.
 * This is what is used to actually load a modfile.
 * @param {Buffer | ArrayBuffer | Blob} modAsZip - The Mod file.
 */
GDAPI.loadZipMod = function(modAsZip) {
    let manifests = {};

    return new Promise((resolve, reject) => {
        new JSZip().loadAsync(modAsZip)
        .then((zip) => {
            // Load Manifests
            return new Promise((resolver, rejecter) => {
                // First we need to verify if the manifests are correct
                // Verify their presence
                if(zip.file("data/GDMod.json") == undefined || zip.file("data/includes.json") == undefined || zip.file("data/resources.json") == undefined) {
                    reject("A manifest file is missing! Is this a GDMod mod?");
                    return;
                }

                if(GDAPI.currentScene == undefined) {
                    reject("The game seems unpatched or not fully loaded. Please wait for the game to fully load.");
                    return;
                }

                // Verify their basic validity and store them in an object
                zip.file("data/GDMod.json").async("string")
                .then((GDMod) => {
                    manifests.main = JSON.parse(GDMod);
                })
                .catch(() => {
                    reject("The manifest GDMod.json cannot be parsed! Is it valid JSON?")
                })

                .then(() => zip.file("data/includes.json").async("string"))
                .then((includes) => {
                    manifests.includes = JSON.parse(includes);
                })
                .catch(() => {
                    reject("The manifest includes.json cannot be parsed! Is it valid JSON?")
                })

                .then(() => zip.file("data/resources.json").async("string"))
                .then((resources) => {
                    manifests.resources = JSON.parse(resources);
                })
                .catch(() => {
                    reject("The manifest resources.json cannot be parsed! Is it valid JSON?")
                })
                .then(() => resolver(zip));
            })
            .then(zip => {
                // Notify the UI how many files are to load (to update the progress bar size)
                GDAPI.messageUI(
                    "beginLoading", 
                    [Object.keys(manifests.resources).length, Object.keys(manifests.includes).length]
                );
                return zip;
            })
            .then(zip => {
                // Load resources
                return new Promise(resolver => {
                    if (Object.keys(manifests.resources).length === 0) {
                        resolver(zip); //Nothing to load.
                        return;
                    }

                    GDAPI.messageUI("beginLoadingResources");
                    const imageManager = GDAPI.game.getImageManager();

                    let loaders = [];
                    for(let resource of manifests.resources) {
                        loaders.push(
                            zip.file("resources/"+resource.file).async("blob")
                            .then(resourceFile => {
                                // Convert blob to dataurl
                                return new Promise((resolveReader) => {
                                    const blobURL = URL.createObjectURL(resourceFile);
                                    var img = new Image();
                                    img.addEventListener("load", function(event){URL.revokeObjectURL(blobURL);});
                                    img.src = blobURL;
                                    imageManager._loadedTextures.put(resource.name, new PIXI.Texture(new PIXI.BaseTexture(img)));
                                    resolveReader();
                                });
                            }));
                    }
                    Promise.all(loaders)
                    .then(() => {
                        resolver(zip);
                    });
                });
            })
            .then((zip) => {
                // Load the code
                let promises = [];
                let modLoaded = false;

                for (let include of manifests.includes) {
                    promises.push(
                        zip.file("code/"+include).async("string")
                        .then(jsFile => {
                            const potentialMod = eval(`(function() {${jsFile}}())`);
                            if(typeof potentialMod === "function" && !modLoaded) {
                                GDAPI.loadMod(potentialMod, manifests.main);
                                modLoaded = true; // Only allow one mod to load (else there would be multiple mods with same metadata).
                            }
                        })
                    )
                }
                return Promise.all(promises).then(() => {
                    if(!modLoaded) {
                        // Load dummy mod for mod list
                        GDAPI.loadMod(GDAPI.Mod, manifests.main);
                    }
                });
            })
            .then(() => GDAPI.messageUI("modLoaded"));
        });
    }).catch((error) => {
        console.error("Error while loading mod file: " + error.toString());
        GDAPI.messageUI("modLoadError", error);
    });
};

/**
 * Loads a {@link GDAPI.Mod} instance.
 * This is used only to initialize a Mod interface implementation.
 * @param {GDAPI.Mod} ModClass - The {@link GDAPI.Mod} class.
 * @param {object} manifest - The main manifest of the mod.
 */
GDAPI.loadMod = function(ModClass, manifest) {
    const mod = new ModClass();

    function unserializeAttribute(attribute, optional) {
        optional = optional || false;
        if(typeof manifest[attribute] === "undefined" && !optional) {
            // There are defaults for everything, but still warn if the attribute isn't meant to be optional.
            console.error(`Missing Atrribute '${attribute}' in GDMod.json!`);
        } else mod.metadata[attribute] = manifest[attribute];
    }

    unserializeAttribute("name");
    unserializeAttribute("uid");
    unserializeAttribute("author");
    unserializeAttribute("description");
    unserializeAttribute("version");

    if(!GDAPI.ModManager.add(mod)) return console.error(`Tried to load already loaded mod '${mod.name}'!`);
    if(mod.preEvent) GDAPI.registerCallback(GDAPI.CALLBACKS.PRE_EVENTS, scene => mod.preEvent(scene));
    if(mod.postEvent) GDAPI.registerCallback(GDAPI.CALLBACKS.POST_EVENTS, scene => mod.postEvent(scene));
    if(mod.sceneChanged) GDAPI.registerCallback(GDAPI.CALLBACKS.SCENE_LOADED, scene => mod.sceneChanged(scene));
};
