/**
 * An interface descibing a Mod.
 * @interface
 */
GDAPI.Mod = function() {
    /** 
     * The mod's name
     * @type {string}
     */
    this.name = "NO_NAME";

    /** 
     * The mod's uid
     * @type {string}
     */
    this.uid = "NO_UID";

    /** 
     * The mod's version
     * @type {string}
     */
    this.version = "0.0.0";

    /** 
     * The mod's description
     * @type {string}
     */
    this.description = "NO_DESC";

    /** 
     * The mod's author
     * @type {string}
     */
    this.author = "NO_AUTHOR";

    /**
     * Used to verify if an object is a mod
     * @type {boolean}
     * @private
     */
    this._isMod = true;
};

/**
 * Function called while the mod is loading.
 * @param {number} modID - The ID attributed to the mod by the Loader.
 */
GDAPI.Mod.prototype.initialize = function() {};

/**
 * Function called before the scene's event sheet.
 * @param {gdjs.RuntimeScene} runtimeScene - The current Scene.
 */
GDAPI.Mod.prototype.preEvent = function(runtimeScene) {};

/**
 * Function called after the scene's event sheet.
 * @param {gdjs.RuntimeScene} runtimeScene - The current Scene.
 */
GDAPI.Mod.prototype.postEvent = function(runtimeScene) {};

/**
 * Function called when the first game scene loaded.
 * @param {gdjs.RuntimeScene} runtimeScene - The current Scene.
 */
GDAPI.Mod.prototype.onGameStart = function(runtimeScene) {}

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
    if(mod.uid in this.mods) {
        return false;
    }
    this.mods[mod.uid] = mod;
    return true;
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
            return new Promise((resolver, rejecter) => {
                // First we need to verify if the manifests are correct
                // Verify their presence
                if(zip.file("data/GDMod.json") == undefined || zip.file("data/includes.json") == undefined || zip.file("data/resources.json") == undefined) {
                    reject("A manifest file is missing! Is this a GDMod mod?");
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
            .then((zip) => {
                let promises = [];
                let modLoaded = false;
                for (let include of manifests.includes) {
                    promises.push(
                        zip.file("code/"+include).async("string")
                        .then(jsFile => {
                            const potentialMod = eval(`(function() {${jsFile}}())`);
                            // If a mod is returned
                            if(typeof potentialMod === "function" && !modLoaded) {
                                const mod = new potentialMod(); // Instanciate it
                                if(mod._isMod) {
                                    function setAttribute(attribute) {
                                        if(typeof manifests.main[attribute] === "undefined") {
                                            console.warn(`Missing Atrribute '${attribute}' in GDMod.json!`);
                                        } else mod[attribute] = manifests.main[attribute];
                                    }
                                    // Now that we are pretty sure this is a mod, we set it's properties and load it
                                    setAttribute("name");
                                    setAttribute("uid");
                                    setAttribute("author");
                                    setAttribute("description");
                                    setAttribute("version");
                                    GDAPI.loadMod(mod);
                                    modLoaded = true; // Only allow one mod to load (else there would be multiple mods with same metadata).
                                }
                            }
                        })
                    )
                }
                return Promise.all(promises);
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
 * @param {GDAPI.Mod} mod - The {@link GDAPI.Mod} instance.
 */
GDAPI.loadMod = function(mod) {
    if(!GDAPI.ModManager.add(mod)) return console.error(`Tryed to load already loaded mod '${mod.name}'!`);
    GDAPI.registerCallback(GDAPI.CALLBACKS.PRE_EVENTS, mod.preEvent);
    GDAPI.registerCallback(GDAPI.CALLBACKS.POST_EVENTS, mod.postEvent);
    GDAPI.registerCallback(GDAPI.CALLBACKS.FIRST_SCENE_LOADED, mod.onGameStart);
    mod.initialize();
};
