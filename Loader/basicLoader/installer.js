const path = require("path");
const fs = require("fs/promises");

/**
 * Inserts an include in a HTML document.
 * @param {string} text - The HTML to modify.
 * @param {string} include - The url to or the script to add.
 */
const insertInclude = function (text, include) {
  const n = text.lastIndexOf("<script src=");
  let originalInclude = text.slice(n).match(/<script src=.*>.*<\/script>/gm);
  originalInclude = originalInclude[originalInclude.length - 1];
  return (
    text.slice(0, n) +
    text
      .slice(n)
      .replace(
        /<script src=.*>.*<\/script>/gm,
        originalInclude + `\n\t<script src="${include}"></script>`
      )
  );
};

/**
 * Installs GDAPI in a GDevelop HTML5 game.
 * @param {string} outputDir - The directory of the GDevelop game.
 */
module.exports.installGDMod = async function (outputDir) {
  const outputDirFiles = await fs.readdir(outputDir);
  // Check if it is a GDevelop game
  if (!outputDirFiles.includes("gd.js"))
    throw new Error("The given output path is not a GDevelop game!");

  // Check if it already got patched
  if (outputDirFiles.includes("GDApi.js"))
    throw new Error("The given output path contains an already patched game!");

  // Copy over the API
  await fs.writeFile(
    path.join(outputDir, "GDApi.js"),
    await fs.readFile(
      path.join(__dirname, "..", "..", "API", "dist", "GDApi.js")
    )
  );

  // Patch RuntimeGame access
  const runtimeGameFile =
    "" +
    (await fs.readFile(path.join(outputDir, "runtimegame.js"))) +
    `

gdjs.RuntimeGame = (function(original) {
  if(typeof GDAPI === "undefined") window.GDAPI = {};
  return function(...args) {
    this.__proto__ = Object.create(original.prototype);
    original.apply(this, args);
    GDAPI.game = this;
  }
})(gdjs.RuntimeGame);
`;

  await fs.writeFile(path.join(outputDir, "runtimegame.js"), runtimeGameFile);

  // Add Includes for API
  const indexFile =
    "" + (await fs.readFile(path.join(outputDir, "index.html")));

  await fs.writeFile(
    path.join(outputDir, "index.html"),
    insertInclude(indexFile, "GDApi.js")
  );
};

/**
 * Installs the modding API with extras for electron.
 * @param {string} outputDir - The directory of the GDevelop game.
 */
module.exports.installGDModElectron = function (outputDir) {
  return module.exports.installGDMod(outputDir).then(async () => {
    // Copy the electron loader
    await fs.writeFile(
      path.join(outputDir, "electronLoader.js"),
      await fs.readFile(path.join(__dirname, "electronLoader.js"))
    );

    // Add include for the electron loader
    const indexFile =
      "" + (await fs.readFile(path.join(outputDir, "index.html")));
    await fs.writeFile(
      path.join(outputDir, "index.html"),
      insertInclude(indexFile, "electronLoader.js")
    );
  });
};
