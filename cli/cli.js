#! /usr/bin/env node

const program = require("commander");
const chalk = require('chalk');
const fs = require("fs");
const path = require("path");
const tempdir = path.join(fs.realpathSync(require("os").tmpdir()), "GDModTemp");
const asar = require("asar");
const GDJSPatcher = require("../Loader/dirtyLoader/loader");

program
    .name("gdmodCli")
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
        GDJSPatcher(directory);
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
        console.log(chalk.greenBright(chalk.italic("Loading asar file...")));
        
        // Make sure temp directory is empty
        try {
            fs.mkdirSync(tempdir);
        } catch {
            console.log(chalk.blue(chalk.italic("Cleaning up old files...")));
            fs.rmdirSync(tempdir, { recursive: true });
            fs.mkdirSync(tempdir);
        }

        // Copy asar to temp folder
        fs.writeFileSync(path.join(tempdir, "app.asar"), fs.readFileSync(asarFile));

        console.log(chalk.greenBright(chalk.italic("Backing up old asar file...")));
        fs.writeFileSync(asarFile + ".bak", fs.readFileSync(asarFile));

        try {
            console.log(chalk.greenBright(chalk.italic("Unpacking asar file...")));
            asar.extractAll(path.join(tempdir, "app.asar"), tempdir);
            fs.unlinkSync(path.join(tempdir, "app.asar")); // To not repack it later
        } catch (e) {
            if (args.debug) { console.log(e); }
            console.error(chalk.redBright(chalk.bold("[ERROR] ") + "Invalid asar File!"));
            return false;
        }

        console.log(chalk.greenBright(chalk.italic("Patching game data...")));
        GDJSPatcher(path.join(tempdir, "app")).then(() => {
            console.log(chalk.greenBright(chalk.italic("Repacking asar file...")));
            asar.createPackage(tempdir, path.join(tempdir, "app.asar")).then(() => {
                // Copy temporary new asar back to the original path
                fs.writeFileSync(asarFile, fs.readFileSync(path.join(tempdir, "app.asar")));
                console.log(chalk.greenBright(chalk.bold("DONE !")));
                console.log(chalk.blue(chalk.italic("Cleaning up...")));
                // Delete temp directory
                fs.rmdirSync(tempdir, { recursive: true });
            });
        }, () => {
            // Patch aborted, cleaning up:
            console.log(chalk.blue(chalk.italic("Cleaning up...")));
            // Delete temp directory
            fs.rmdirSync(tempdir, { recursive: true });
            return false;
        });
        return true;
    })

program
    .command("*")
    .outputHelp();

program.parse(process.argv);
