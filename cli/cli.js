#! /usr/bin/env node

const program = require("commander");
var chalk = require('chalk');
const GDJSPatcher = require("../Loader/patchUtils/patcher")

program
    .name("gdmodCli")
    .version('0.0.1')
    .description("A CLI for installing the mod loader or a mod")

program
    .command('install-mod-unpacked <directory>')
    .description('Install a mod in an unpacked GDevelop game with the loader')
    .action((directory) => {
        //TODO
        console.warn(chalk.redBright(chalk.bold("Error: Not Implemented")))
    })

program
    .command('install-loader-unpacked <directory> [additionalPatches]')
    .description('Install the loader in an unpacked GDevelop game')
    .action((directory, additionalPatches) => {
        GDJSPatcher(directory, additionalPatches);
    })

program
    .command('install-mod-asar <asarFile>')
    .description('Install a mod in a GDevelop game with the loader')
    .action((asarFile) => {
        //TODO
        console.warn(chalk.redBright(chalk.bold("Error: Not Implemented")))
    })

program
    .command('install-loader-asar <asarFile>')
    .description('Install the loader in a GDevelop game')
    .action((asarFile) => {
        //TODO
        console.warn(chalk.redBright(chalk.bold("Error: Not Implemented")))
    })

program
    .command("*")
    .outputHelp()

program.parse(process.argv);
