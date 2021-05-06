(function () {
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
    const allMods = [];
    modStore
      .iterate((mod) => {
        allMods.push({
          info: mod.modFile.manifest.mainManifest,
          preload: mod.settings.preload,
          isLoaded:
            typeof GDAPI === "undefined"
              ? false
              : GDAPI.ModManager.get().has(
                  mod.modFile.manifest.mainManifest.uid
                ),
        });
      })
      .then(() => postToPopup("listMods", allMods));
  }

  // First we verify if the game is a GDevelop game. The gdjs namespace is present on all GDevelop games.
  if (window.gdjs !== undefined) {
    // Monkey-patch the event loop start function. Use an IIFE to enclose the original function.
    (function (original) {
      gdjs.RuntimeGame.prototype.startGameLoop = function (...args) {
        window.GDAPI_game = this;
        original.apply(this, args);
      };
    })(gdjs.RuntimeGame.prototype.startGameLoop);

    // Set up communication between the UI and the webLoader.
    window.addEventListener("message", function (event) {
      const msg = event.data["message"];
      if (typeof msg !== "undefined") {
        if (msg === "ping") {
          postToPopup("pong", true);
        } else if (msg === "connect") {
          postToPopup("connected", gdjs.projectData.properties);
        } else if (msg === "listScenes") {
          if (typeof gdjs === "undefined") return;
          let allScenes = [];
          for (let scene of gdjs.projectData.layouts)
            allScenes.push(scene.name);
          postToPopup("listScenes", allScenes);
        } else if (msg === "changeScene") {
          if (typeof GDAPI === "undefined") return;
          GDAPI.currentScene
            .getGame()
            ._sceneStack.replace(event.data.scene, true);
        } else if (msg === "installMod") {
          if (typeof GDAPI === "undefined" || event.data["mod"] == undefined)
            return;
          const mod = dataURItoBlob(event.data["mod"]);
          postToPopup("modReceived");
          GDAPI.parseModManifest(mod)
            .then(async (modFile) => {
              const uid = modFile.manifest.mainManifest.uid;

              // If the mod is already installed and loaded, reload it.
              if (GDAPI.ModManager.get().has(uid)) GDAPI.loadModFile(modFile);

              const oldMod = await modStore.getItem(uid);
              await modStore.setItem(uid, {
                modFile,
                settings:
                  oldMod != undefined ? oldMod.settings : { preload: false },
              });
            })
            .then(() => postToPopup("modInstalled"))
            .then(reloadModList)
            .catch((e) => {
              console.error(e);
              postToPopup("modInstallError", e.message);
            });
        } else if (msg === "loadMod") {
          if (typeof GDAPI.loadModFile === "undefined") return;
          modStore
            .getItem(event.data.uid)
            .then(({ modFile }) => GDAPI.loadModFile(modFile))
            .then(reloadModList)
            .catch(console.error);
        } else if (msg === "unloadMod") {
          if (typeof GDAPI.ModManager === "undefined") return;
          GDAPI.ModManager.get().unload(event.data.uid);
          reloadModList();
        } else if (msg === "listMods") {
          reloadModList();
        } else if (msg === "localforageReady") {
          modStore = localforage.createInstance({ name: "GDMOD-mods" });
          reloadModList();
        } else if (msg === "setPreload") {
          modStore
            .getItem(event.data.uid)
            .then((mod) => {
              mod.settings.preload = event.data.preload;
              return modStore.setItem(event.data.uid, mod);
            })
            .catch(console.error);
        }
      }
    });

    // Ask the injector to inject the API
    postToPopup("installAPI");

    // Now that the "Essentials" are set up, we can load the mods.
    (function handler() {
      // Wait for the scene, API and modstore to load
      if (
        typeof GDAPI !== "undefined" &&
        GDAPI.currentScene != null &&
        GDAPI.loadModFile != undefined &&
        modStore !== null
      )
        modStore.iterate(({ settings: { preload }, modFile }) => {
          if (preload) GDAPI.loadModFile(modFile).catch(console.error);
        });
      else setTimeout(handler, 500);
    })();
  }
})();
