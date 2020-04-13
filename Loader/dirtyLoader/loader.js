const path = require("path");
const chalk = require("chalk");

let insertLine = function(line, position, text) {
    /** @type {Array<string>} */
    let arrayText = text.split("\n");
    arrayText.splice(position, 0, line);
    let newText = "";
    for(let newLine of arrayText) {
        newText += newLine + "\n";
    }
    return newText;
}

/**
 * Applies patches to a GD game
 * @param {string} outputDir - The directory of the GDevelop game.
 * @param {any} [fs] - The filesystem object to use.
 */
module.exports = function(outputDir, fs) {
    if(!fs) {
        const fs = require("fs");
    }

    // Basic check for a GDevelop game
    if (!fs.readdirSync(outputDir).includes("gd.js")) { console.error(chalk.redBright("The given output path is not a GDevelop game!")); return; }

    // Basic check for an existing patch
    if (!fs.readdirSync(outputDir).includes("GDApi.js")) { console.error(chalk.redBright("The given output path contains an already patched game!")); return; }

    // List recursively all API files
    let allfiles = [];
    findFiles = (dir) => {
        files = fs.readdirSync(dir);
        for(let file of files) {
            if(file.includes("git")) {continue;} // Ignore Version Control files
            if (fs.statSync(dir + "/" + file).isDirectory()) {
                findFiles(dir + "/" + file);
            } else {
                allfiles.push(path.join(dir, "/", file));
            }
        }
    }
    findFiles(path.join("..", "..", "API"));

    // Copy files over
    copyFiles = function(resolve) {
        for(let file of allfiles) {
            fs.readFile(file, (error, fileInMemory) => {
                let endpath = path.join(outputDir, file.replace(path.join("..", "..", "API/"), '').replace(path.join("patched_gdjs", ""), ""));
                console.log(chalk.greenBright("[BASE PATCHER] ") + chalk.green("Patching file ") + chalk.italic(chalk.grey(endpath)) + chalk.green("..."));
                fs.writeFile(endpath, fileInMemory, () => {});
            });
        }
        resolve();
    }

    new Promise(copyFiles).then(() => {
        // Compatibility Patch
        return new Promise((resolve) => {
            fs.readFile(path.join(outputDir, "index.html"), (err, indexFile) => {
                indexFile = String(indexFile)       
                .replace("gdjs.registerObjects();", '')
                .replace("gdjs.registerBehaviors();", '')
                .replace("gdjs.registerGlobalCallbacks();", '');
                fs.writeFile(path.join(outputDir, "index.html"), indexFile, () => {resolve();});
                console.log(chalk.greenBright("[BASE PATCHER] ") + chalk.magenta("Applied additional compatibility patch to index.html."));
            });
        });
        
    }).then(() => {
        // Add Includes for API

        let indexFile = String(fs.readFileSync(path.join(outputDir, "index.html")));
        // An include file is used to determine the loading order and what needs to be loaded.
        let APIFiles = JSON.parse(String(fs.readFileSync(path.join("..", "..", "API", "includes.json"))));
        for(let include of APIFiles.reverse()) {
            indexFile = insertLine("	<script src=\"" + include.split(path.sep).slice(-1)[0]  + "\"></script>", 70, indexFile);
        }
        fs.writeFileSync(path.join(outputDir, "index.html"), indexFile)
        console.log(chalk.greenBright("[BASE PATCHER] ") + chalk.magenta("Applied dependency includes patch to index.html."));
    });
}
