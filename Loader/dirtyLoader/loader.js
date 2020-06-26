const path = require("path");
const chalk = require("chalk");
const fs = require("fs");

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
 */
module.exports.installGDMod = function(outputDir) {
        const outputDirFiles = fs.readdirSync(outputDir);
        
        // Basic check for a GDevelop game
        if (!outputDirFiles.includes("gd.js")) { 
            console.error(chalk.redBright("The given output path is not a GDevelop game!")); 
            return Promise.reject("The given output path is not a GDevelop game!"); 
        }

        // Basic check for an existing patch
        if (outputDirFiles.includes("GDApi.js")) { 
            console.error(chalk.redBright("The given output path contains an already patched game!")); 
            return Promise.reject("The given output path contains an already patched game!"); 
        }

        // List recursively all API files
        findFiles = (dir) => {
            return new Promise((resolve) => {
                let allfiles = [];
                finder = (dir) => {
                    for(let file of fs.readdirSync(dir)) {
                        const filePath = path.join(dir, file);
                        if(file.includes("git")) {continue;} // Ignore Version Control files
                        if (fs.statSync(filePath).isDirectory()) {
                            finder(dir + "/" + file);
                        } else {
                            allfiles.push(path.join(dir, "/", file));
                        }
                    }
                }
                finder(dir);
                fs.writeFileSync(path.join(__dirname, "log.txt"), allfiles);
                resolve(allfiles);
            });
        }

        // Copy files over
        copyFiles = function(allFiles) {
            return new Promise((resolve) => {
                let finished = 0;
                for(let file of allFiles) {
                    fs.readFile(file, (error, fileInMemory) => {
                        let endpath = path.join(outputDir, file.replace(path.join(__dirname, "..", "..", "API/"), '').replace(path.join("patched_gdjs", ""), ""));
                        console.log(chalk.greenBright("[BASE PATCHER] ") + chalk.green("Patching file ") + chalk.italic(chalk.grey(endpath)) + chalk.green("..."));
                        fs.writeFile(endpath, fileInMemory, () => {});

                        if(++finished === allFiles.length) { resolve(); }
                    });
                }
            });
        }

        return findFiles(path.join(__dirname, "..", "..", "API"))
        .then(copyFiles)
        .then(() => {
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
            let APIFiles = JSON.parse(String(fs.readFileSync(path.join(__dirname, "..", "..", "API", "includes.json"))));
            for(let include of APIFiles.reverse()) {
                indexFile = insertLine("	<script src=\"" + include.split(path.sep).slice(-1)[0]  + "\"></script>", 70, indexFile);
            }
            fs.writeFileSync(path.join(outputDir, "index.html"), indexFile)
            console.log(chalk.greenBright("[BASE PATCHER] ") + chalk.magenta("Applied dependency includes patch to index.html."));
        })
}
