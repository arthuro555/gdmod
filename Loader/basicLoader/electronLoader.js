(function () {
  const electron = require("electron");
  const fs = require("fs");
  const { join } = require("path");

  const ModDir = join(".", "resources", "mods");

  // Load mods
  GDAPI.registerCallback(GDAPI.CALLBACKS.FIRST_SCENE_LOADED, () => {
    if (!fs.existsSync(ModDir)) fs.mkdirSync(ModDir);
    fs.readdir(ModDir, (err, dir) => {
      if (err) console.error(err);
      for (let file of dir) {
        fs.readFile(join(ModDir, file), (err, mod) => {
          if (err) {
            console.error(err);
          } else {
            GDAPI.parseModManifest(mod)
              .then(GDAPI.loadModFile)
              .catch((error) => console.error(error));
          }
        });
      }
    });
  });

  // Add a way to open the inspector
  if (fs.existsSync("debug.txt"))
    electron.remote.getCurrentWindow().webContents.openDevTools();
})();
