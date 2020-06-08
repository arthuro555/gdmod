/**
 * An interface descibing a Mod.
 * @interface
 */
GDAPI.Mod = function() {};

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
 * Loads a mod from a zip.
 * This is what is used to actually load a modfile.
 * @param {Buffer | ArrayBuffer | Blob} modAsZip - The Mod file.
 */
GDAPI.loadZipMod = function(modAsZip) {
    let manifests = {};

    return new Promise((resolve, reject) => {
        new JSZip().loadAsync(modAsZip)
        .then((zip) => {
            // First we need to verify if the manifests are correct
            // Verify their presence
            if(zip.file("data/GDMod.json") == undefined || zip.file("data/includes.json") == undefined || zip.file("data/resources.json") == undefined) {
                reject("A manifest file is missing! Is this a GDMod mod?");
                return;
            }

            // Verify their basic validity and store them in an object
            zip.file("data/GDMod.json").async("string")
            .then((GDMod) => {
                return new Promise((resolver) => {
                    manifests.main = JSON.parse(GDMod);
                    resolver();
                });
            })
            .catch(() => {
                reject("The manifest GDMod.json cannot be parsed! Is it valid JSON?")
            })

            .then(zip.file("data/includes.json").async("string"))
            .then((includes) => {
                return new Promise((resolver) => {
                    manifests.includes = JSON.parse(includes);
                    resolver();
                });
            })
            .catch(() => {
                reject("The manifest includes.json cannot be parsed! Is it valid JSON?")
            })

            .then(zip.file("data/resources.json").async("string"))
            .then((resources) => {
                return new Promise((resolver) => {
                    manifests.resources = JSON.parse(resources);
                    resolver();
                });
            })
            .catch(() => {
                reject("The manifest resources.json cannot be parsed! Is it valid JSON?")
            });

        }).then(() => {
            console.log(manifests);
            resolve();
        });
    }).catch((error) => {
        console.error("Error while loading mod file: " + error.toString());
    });
};

/**
 * Loads a {@link GDAPI.Mod} instance.
 * This is used only to initialize a Mod interface implementation.
 * @param {GDAPI.Mod} mod - The {@link GDAPI.Mod} instance.
 */
GDAPI.loadMod = function(mod) {
    GDAPI.registerCallback(GDAPI.CALLBACKS.PRE_EVENTS, mod.preEvent);
    GDAPI.registerCallback(GDAPI.CALLBACKS.POST_EVENTS, mod.postEvent);
    GDAPI.registerCallback(GDAPI.CALLBACKS.FIRST_SCENE_LOADED, mod.onGameStart);
    mod.initialize();
};
