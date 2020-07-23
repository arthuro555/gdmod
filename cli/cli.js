#! /usr/bin/env node

const program = require("commander");
const chalk = require('chalk');
const fs = require("fs");
const path = require("path");
const asar = require("asar");
const loader = require("../Loader/dirtyLoader/loader");

/**
 * @callback asarModifier
 * @param {string} - Temporary directory where the asar files are
 * @returns {Promise} - Asar repacks when returned promise resolves
 */

/**
 * Extracts an asar to a temporary directory, executes a callback to modify the files, before repacking the asar.
 * @param {string} asarFile The path to the asar
 * @param {asarModifier} editor The function to pass the temporary path to.
 * @param {boolean} debug Should debug output be shown?
 */
function editAsar(asarFile, editor, debug) {
    const tempDir = path.join(fs.realpathSync(require("os").tmpdir()), "GDModTemp");
    const tempAsar = path.join(tempDir, "app.asar");

    // Make sure temp directory is empty
    try {
        fs.mkdirSync(tempDir);
    } catch {
        console.log(chalk.blue(chalk.italic("Cleaning up old files...")));
        fs.rmdirSync(tempDir, { recursive: true });
        fs.mkdirSync(tempDir);
    }

    const asarFileContent = fs.readFileSync(asarFile);

    // Backup asar
    console.log(chalk.greenBright(chalk.italic("Backing up old asar file...")));
    fs.writeFileSync(asarFile + ".bak", asarFileContent);

    // Copy asar to temp folder
    console.log(chalk.greenBright(chalk.italic("Loading asar file...")));
    fs.writeFileSync(tempAsar, asarFileContent);

    try {
        console.log(chalk.greenBright(chalk.italic("Unpacking asar file...")));
        asar.extractAll(tempAsar, tempDir);
        fs.unlinkSync(tempAsar); // To not repack it later
    } catch (e) {
        if (debug) { console.log(e); }
        console.error(chalk.redBright(chalk.bold("[ERROR] ") + "Invalid asar File!"));
        return false;
    }

    console.log(chalk.greenBright(chalk.italic("Patching game data...")));
    editor(path.join(tempDir, "app")).then(() => {
        console.log(chalk.greenBright(chalk.italic("Repacking asar file...")));
        asar.createPackage(tempDir, tempAsar).then(() => {
            // Copy temporary new asar back to the original path
            fs.writeFileSync(asarFile, fs.readFileSync(tempAsar));
            console.log(chalk.greenBright(chalk.bold("DONE !")));
            console.log(chalk.blue(chalk.italic("Cleaning up...")));
            // Delete temp directory
            fs.rmdirSync(tempDir, { recursive: true });
        });
    }, () => {
        // Patch aborted, cleaning up:
        console.log(chalk.blue(chalk.italic("Cleaning up...")));
        // Delete temp directory
        fs.rmdirSync(tempDir, { recursive: true });
    });
}

program
    .name("gdmod-cli")
    .version('0.0.1')
    .description("A CLI for patchimg a game or adding a mod");

program
    .command('install-mod-unpacked <directory>')
    .description('Install a mod in an unpacked and patched GDevelop game')
    .action((directory) => {
        //TODO
        console.warn(chalk.redBright(chalk.bold("Error: Not Implemented")));
        return false;
    })

program
    .command('install-loader-unpacked <directory>')
    .description('Install the loader and apply patches to an unpacked GDevelop game')
    .action((directory) => {
        loader.installGDMod(directory)
        .catch(() => {
            console.error(chalk.redBright("An error occured, aborting."));
        });
        return true;
    })

program
    .command('install-mod-asar <asarFile>')
    .description('Install a mod in a patched GDevelop game')
    .action((asarFile) => {
        //TODO
        console.warn(chalk.redBright(chalk.bold("Error: Not Implemented")));
        return false;
    })

program
    .command('install-loader-asar <asarFile>')
    .option("-d, --debug", "Activate debug output")
    .description('Install the loader and apply patches to a GDevelop game')
    .action((asarFile, args) => {
        editAsar(asarFile, loader.installGDMod, args.debug);
    })

program
    .command("*")
    .outputHelp();

program.parse(process.argv);
