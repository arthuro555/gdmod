/**
 * This is the file injected into HTML documents by GDMod patcher.
 * @fileoverview
 */

/**
 * Debug Mode.
 */
const debug = false;

/**
 * The CDN to fetch the GDAPI files from.
 */
const CDN = debug ? "http://localhost:5000/" : "https://cdn.jsdelivr.net/gh/arthuro555/gdmod@0.0.4-preview/API/";

/**
 * Flag telling if that page got patched already.
 */
let isPatched = false;

/**
 * Flag telling if that page has loaded the API already.
 */
let isAPILoading = false;

/**
 * Flag telling if that page has loaded the API already.
 */
let isAPILoaded = false;


/**
 * Send an object to the Popup.
 * @param {string} id The identifier of the payload (tells the popup what to do with the data).
 * @param {any} payload The message to post to the Popup.
 */
function postToPopup(id, payload) {
    window.postMessage({forwardTo: "GDMod", payload: {id: id, origin:"loader", payload: payload}}, "*");
}

/**
 * Installs the modding API.
 */
function installGDModAPI() {
    if(isAPILoaded || isAPILoading) {
        if(isAPILoaded)
            postToPopup("installedAPI", true);
        return;
    }

    isAPILoading = true;

    return fetch(CDN + "includes.json")
    .then(req => req.json())
    .then(includes => {
        return new Promise((resolve) => {
            let loaded = 0;
            for(let include of includes) {
                if(debug) console.log(`Loading ${include}`);
                const script = document.createElement("script");
                script.src = CDN + include;
                script.onload = function() {
                    if (++loaded === includes.length) {
                        resolve();
                    }
                    if(!debug) document.body.removeChild(script); // Cleanup document after loading API.
                }
                document.body.appendChild(script);
            }
        });
    })
    .then(() => {
        // Overwrite GDAPI.messageUI to let the modding API interract with this UI.
        GDAPI.messageUI = function(id, extraData) {
            window.postMessage({forwardTo: "GDMod", payload: {id: id, origin:"GDAPI", payload: extraData}}, "*");
        }
    })
    .then(() => {
        isAPILoading = false;
        isAPILoaded = true;
        postToPopup("installedAPI", true);
    })
    .then(() => {if(debug) console.log("Loaded GDAPI")});
}

/**
 * Loops through GDJS searching for scenes event loop and 
 * patch them to continously set {@link GDAPI.currentScene} 
 * to the current {@link GDJS.RuntimeScene}.
 */
function patchSceneCode() {
    if(isPatched) return;
    isPatched = true;

    if(debug) console.log("Patching Game");

    for (let i in window.gdjs) {
        if(i.includes("Code")) { // Find all potential event code modules
            let module = window.gdjs[i];
            if (typeof module.func !== "undefined") { // Check if it really is an event code module
                module.originalFunc = module.func.bind({});
                module.func = function(...args) {
                    if(typeof GDAPI === "undefined") window.GDAPI = {};
                    window.GDAPI.game = args[0].getGame(); // First arg is runtimeScene.
                                                           // We accept multiple args for compatibility with older games 
                                                           // who had other args (context).
                    module.originalFunc.apply(module, args);
                }
            }
        }
    }

    // Override GDAPI.currentScene with a getter
    Object.defineProperty(GDAPI, 'currentScene', { get: function() { 
        if(GDAPI.game != undefined) {
            return GDAPI.game._sceneStack.getCurrentScene();
        }; 
    }});
}

/** From https://stackoverflow.com/a/12300351/10994662 */
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
  
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
  
    // create a view into the buffer
    var ia = new Uint8Array(ab);
  
    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  
  }


// First we verify if the game is a GDevelop game
if(window.gdjs !== undefined) {
    if (debug) console.log("GD Game Detected!");
    window.GDAPI = {}; // We need to define it so that the scene can be stored in it, even if the API isn't loaded yet.
    patchSceneCode(); /* 
                       * We need to do so to patch the scene code before the first scene loaded: when the 
                       * scene starts it takes a reference to the function. So even if we replace it
                       * it still executes the original code and we won't have access until the scene switches
                       * once. This comment is here because we used to patch only on request by the user.
                       */

    window.addEventListener("message", function(event) {
        if(typeof event.data["message"] !== "undefined") {
            if(event.data["message"] === "ping") {
                postToPopup("pong", true);
            } else if(event.data["message"] === "installAPI") {
                installGDModAPI();
            } else if(event.data["message"] === "connect") {
                postToPopup("connected", gdjs.projectData.properties);
            } else if(event.data["message"] === "listScenes") {
                let allScenes = [];
                for (let scene of gdjs.projectData.layouts) allScenes.push(scene.name);
                postToPopup("listScenes", allScenes);
            } else if(event.data["message"] === "changeScene") {
                if(typeof GDAPI === "undefined") return;
                GDAPI.currentScene.getGame()._sceneStack.replace(event.data.scene, true);
            } else if(event.data["message"] === "loadMod") {
                const mod = dataURItoBlob(event.data["mod"]);
                postToPopup("modReceived");
                GDAPI.loadZipMod(mod);
            } else if(event.data["message"] === "listMods") {
                if(typeof GDAPI !== "undefined" && typeof GDAPI.ModManager !== "undefined") {
                    postToPopup("listMods", GDAPI.ModManager.getAllMods())
                } else postToPopup("listMods", []);;
            }
        }
    });
}

// At the end remove the script to not pollute the Document
document.body.removeChild(document.getElementById("gdmod-patcher-script"));
