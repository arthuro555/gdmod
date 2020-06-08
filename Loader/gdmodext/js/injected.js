/**
 * This is the file injected into HTML documents by GDMod patcher.
 * @fileoverview
 */

/**
 * Debug Mode
 */
const debug = false;

/**
 * The CDN to fetch the GDAPI files from
 */
const CDN = "https://cdn.jsdelivr.net/gh/arthuro555/gdmod@latest/API/";

/**
 * Flag telling if that page got patched already.
 */
let isPatched = false;

/**
 * Flag telling if that page has loaded the API already.
 */
let isAPILoaded = false;


/**
 * Send an object to the Popup
 * @param {string} id The identifier of the payload (tells the popup what to do with the data)
 * @param {any} payload The message to post to the Popup
 */
function postToPopup(id, payload) {
    window.postMessage({forwardTo: "GDMod", payload: {id: id, payload: payload}}, "*");
}

/**
 * Installs the modding API.
 */
function installGDModAPI() {
    if(isAPILoaded) return;

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
                        isAPILoaded = true;
                        postToPopup("installedAPI", true);
                        resolve();
                    }
                    if(!debug) document.body.removeChild(script); // Cleanup document after loading API.
                }
                document.body.appendChild(script);
            }
        });
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
        if(i.includes("Code")) { // Find all potential Event Code
            let module = window.gdjs[i];
            if (typeof module.func !== "undefined") {
                module.originalFunc = module.func.bind({});
                module.func = function(runtimeScene) {
                    window.GDAPI.currentScene = runtimeScene;
                    module.originalFunc(runtimeScene);
                }
            }
        }
    }
}


// First we verify if the game is a GDevelop game
if(window.gdjs !== undefined) {
    if (debug) console.log("GD Game Detected!");
    window.GDAPI = {};
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
            }
        }
    });
}

// At the end remove the script to not pollute the Document
document.body.removeChild(document.getElementById("gdmod-patcher-script"));
