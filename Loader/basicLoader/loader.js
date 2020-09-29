const path = require("path");
const chalk = require("chalk");
const fs = require("fs");

/**
 * The Directory of the API files.
 * @type {string}
 */
const APIDir = path.join(__dirname, "..", "..", "API");

/**
 * A list of all relevant API files.
 * @type {string}
 */
const APIDeps = require(APIDir + "/includes.json");

/**
 * Inserts an include in a HTML document.
 * @param {string} text - The HTML to modify.
 * @param {string} include - The url to or the script to add.
 */
const insertInclude = function(text, include) {
    const n = text.lastIndexOf("<script src=");
    let originalInclude = text.slice(n).match(/<script src=.*>.*<\/script>/gm);
    originalInclude = originalInclude[originalInclude.length - 1];
    return text.slice(0, n) + text.slice(n).replace(
        /<script src=.*>.*<\/script>/gm, 
        originalInclude + `\n\t<script src="${include}"></script>`
    );
}

/**
 * Installs GDAPI in a GDevelop HTML5 game.
 * @param {string} outputDir - The directory of the GDevelop game.
 */
module.exports.installGDMod = function(outputDir) {
        const outputDirFiles = fs.readdirSync(outputDir);
        
        // Check if it is a GDevelop game
        if (!outputDirFiles.includes("gd.js")) { 
            console.error(chalk.redBright("The given output path is not a GDevelop game!")); 
            return Promise.reject("The given output path is not a GDevelop game!"); 
        }

        // Check if it already got patched
        if (outputDirFiles.includes("GDApi.js")) { 
            console.error(chalk.redBright("The given output path contains an already patched game!")); 
            return Promise.reject("The given output path contains an already patched game!"); 
        }

        // Copy files over
        const copyFiles = function() {
            return new Promise((resolve) => {
                let finished = 0;
                for(let file of APIDeps) {
                    fs.readFile(file, (error, fileInMemory) => {
                        const endpath = path.join(outputDir, file);
                        console.log(chalk.greenBright("[BASE PATCHER] ") + chalk.green("Adding file ") + chalk.italic(chalk.grey(endpath)) + chalk.green("..."));
                        fs.writeFile(endpath, fileInMemory, () => {});

                        if(++finished === APIDeps.length) { resolve(); }
                    });
                }
            });
        }

        return copyFiles()
        .then(() => { // Get RuntimeGame access
            let runtimeGameFile = String(fs.readFileSync(path.join(outputDir, "runtimegame.js")));
            runtimeGameFile = runtimeGameFile.replace(
                "gdjs.RuntimeGame = function(data, options) {", 
`gdjs.RuntimeGame = function(data, options) {
  if(typeof GDAPI === "undefined") window.GDAPI = {};
  GDAPI.game = this;`);
            fs.writeFileSync(path.join(outputDir, "runtimegame.js"), runtimeGameFile);
            console.log(chalk.greenBright("[BASE PATCHER] ") + chalk.magenta("Applied RuntimeGame access patch."));
        })
        .then(() => { // Add Includes for API
            let indexFile = String(fs.readFileSync(path.join(outputDir, "index.html")));
            // An include file is used to determine the loading order and what needs to be loaded.
            for(let include of APIDeps) {
                indexFile = insertInclude(indexFile, include);
            }
            fs.writeFileSync(path.join(outputDir, "index.html"), indexFile);
            console.log(chalk.greenBright("[BASE PATCHER] ") + chalk.magenta("Applied dependency includes patch to index.html."));
        });
}
