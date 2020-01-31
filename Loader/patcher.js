const patchUtil = require('jsondiffpatch');
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");


/**
 * Applies all the patches to the engine files
 * @param {string} directory Path to the files to be patched.
 * @param {string} [additionalPatchesDir] Path to additional Patches to apply fo the game.
 */
const patcher = function(directory, additionalPatchesDir) {
    if(typeof directory !== "string") throw new Error(String(chalk.bold(chalk.redBright("[ERROR]: ") + chalk.red("Invalid Directory name passed: Not a string"))));
    additionalPatchesDir ? additionalPatchesDir : false;
    
    const patchsSource = path.join(path.dirname(module.filename), "Patches");
    console.info(chalk.yellow("[Info] Patches directory: " + patchsSource));

    let patchsStruture = fs.readdirSync(patchsSource).map(name => path.join(patchsSource, name));

    if (additionalPatchesDir) {
        patchsStruture.concat(fs.readdirSync(additionalPatchesDir).map(name => path.join(additionalPatchesDir, name)));
    }

    console.info(chalk.yellow("[Info] Patches: ", patchsStruture.toString()));
    console.info(chalk.greenBright("[Debug] App Directory: ", directory));
}

module.exports = patcher;
