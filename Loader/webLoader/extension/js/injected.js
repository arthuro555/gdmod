/**
 * This is the file injected into HTML documents by GDMod patcher.
 * @fileoverview
 */

/**
 * The localforage store containing the cached mods.
 */
let modStore = null;

/**
 * Send an object to the Popup.
 * @param {string} id The identifier of the payload (tells the popup what to do with the data).
 * @param {any} payload The message to post to the Popup.
 */
function postToPopup(id, payload) {
  window.postMessage(
    {
      forwardTo: "GDMod",
      payload: { id: id, origin: "loader", payload: payload },
    },
    "*"
  );
}

/**
 * Installs the modding API.
 */
function installGDModAPI() {
  return new Promise((resolve) => {
    window.addEventListener("message", function (event) {
      if (event.data.message === "inlcudesList") resolve(event.data.includes);
    });
    window.postMessage({ forwardTo: "GDMod", listIncludes: true }, "*");
  })
    .then((includes) => {
      return new Promise((resolve) => {
        let loaded = 0;
        for (let include of includes) {
          const script = document.createElement("script");
          script.src = include;
          script.onload = function () {
            if (++loaded === includes.length) {
              resolve();
            }
            document.body.removeChild(script); // Cleanup document after loading API.
          };
          document.body.appendChild(script);
        }
      });
    })
    .then(() => {
      // Overwrite GDAPI.messageUI to let the modding API interract with this UI.
      GDAPI.messageUI = function (id, extraData) {
        window.postMessage(
          {
            forwardTo: "GDMod",
            payload: { id: id, origin: "GDAPI", payload: extraData },
          },
          "*"
        );
      };
    })
    .then(() => {
      postToPopup("installedAPI", true);
    });
}

/**
 * Loops through GDJS searching for scenes event loop and
 * patch them to continously set {@link GDAPI.currentScene}
 * to the current {@link GDJS.RuntimeScene}.
 */
function patchSceneCode() {
  for (let i in window.gdjs) {
    if (i.includes("Code")) {
      // Find all potential event code modules
      let module = window.gdjs[i];
      if (typeof module.func !== "undefined") {
        // Check if it really is an event code module
        module.originalFunc = module.func.bind({});
        module.func = function (...args) {
          if (typeof GDAPI === "undefined") window.GDAPI = {};
          window.GDAPI.game = args[0].getGame(); // First arg is runtimeScene.
          // We accept multiple args for compatibility with older games
          // who had other args (context).
          module.originalFunc.apply(module, args);
        };
      }
    }
  }

  // Override GDAPI.currentScene with a getter
  Object.defineProperty(GDAPI, "currentScene", {
    get: function () {
      if (GDAPI.game != undefined) {
        return GDAPI.game._sceneStack.getCurrentScene();
      }
    },
  });
}

/** From https://stackoverflow.com/a/12300351/10994662 */
function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: mimeString });
  return blob;
}

function reloadModList() {
  var allMods = [];
  modStore
    .iterate((mod) => {
      allMods.push({ info: mod.info, preload: mod.preload });
    })
    .then(() => postToPopup("listMods", allMods));
}

// First we verify if the game is a GDevelop game
if (window.gdjs !== undefined) {
  console.log("GDevelop game detected, GDAPI is being injected.");
  window.GDAPI = {}; // We need to define it so that the scene can be stored in it, even if the API isn't loaded yet.
  patchSceneCode();
  /*
   * We need to do so to patch the scene code before the first scene loaded: when the
   * scene starts it takes a reference to the function. So even if we replace it
   * it still executes the original code and we won't have access until the scene switches
   * once. This comment is here because we used to patch only on request by the user.
   */

  window.addEventListener("message", function (event) {
    const msg = event.data["message"];
    if (typeof msg !== "undefined") {
      if (msg === "ping") {
        postToPopup("pong", true);
      } else if (msg === "connect") {
        postToPopup("connected", gdjs.projectData.properties);
      } else if (msg === "listScenes") {
        let allScenes = [];
        for (let scene of gdjs.projectData.layouts) allScenes.push(scene.name);
        postToPopup("listScenes", allScenes);
      } else if (msg === "changeScene") {
        if (typeof GDAPI === "undefined") return;
        GDAPI.currentScene
          .getGame()
          ._sceneStack.replace(event.data.scene, true);
      } else if (msg === "installMod") {
        if (typeof GDAPI === "undefined") return;
        const mod = dataURItoBlob(event.data["mod"]);
        postToPopup("modReceived");
        GDAPI.parseModFile(mod)
          .then((mod) =>
            modStore.setItem(mod.manifest.main.uid, {
              file: mod.rawFile,
              info: mod.manifest.main,
              preload: false,
            })
          )
          .then(() => postToPopup("modInstalled"))
          .then(reloadModList)
          .catch(console.error);
      } else if (msg === "loadMod") {
        if (typeof GDAPI === "undefined") return;
        modStore
          .getItem(event.data.uid)
          .then((mod) => GDAPI.parseModFile(mod.file))
          .then(GDAPI.loadModFile)
          .catch(console.error);
      } else if (msg === "listMods") {
        reloadModList();
      } else if (msg === "localforageReady") {
        modStore = localforage.createInstance({ name: "GDMOD-mods" });
        reloadModList();
      } else if (msg === "setPreload") {
        modStore
          .getItem(event.data.uid)
          .then((mod) =>
            modStore.setItem(event.data.uid, {
              ...mod,
              preload: event.data.preload,
            })
          )
          .catch(console.error);
      }
    }
  });

  // Now that the "Essentials" are set up, we can load the API and mods.
  installGDModAPI().then(() => {
    (function handler() {
      // Wait for the scene and modstore to load
      if (
        typeof GDAPI !== "undefined" &&
        typeof GDAPI.currentScene !== "undefined" &&
        typeof modStore !== "undefined"
      ) {
        modStore.iterate((mod) => {
          if (mod.preload)
            GDAPI.parseModFile(mod.file)
              .then(GDAPI.loadModFile)
              .catch(console.error);
        });
      } else setTimeout(handler, 500);
    })();
  });
}

// At the end remove the script to not pollute the Document
document.body.removeChild(document.getElementById("gdmod-patcher-script"));
