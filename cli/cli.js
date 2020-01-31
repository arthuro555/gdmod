const program = require("commander");
var chalk = require('chalk');
const GDJSPatcher = require("../Loader/patcher")

program
    .version('0.0.1')
    .description("A CLI for installing the mod loader or a mod")
    .command('install-mod-unpacked <directory>', 'Install a mod in an unpacked GDevelop game with the loader')
    .action((directory) => {
        //TODO
        console.warn(chalk.redBright(chalk.bold("Error: Not Implemented")))
    })
    .command('install-loader-unpacked <directory> [additional patches]', 'Install the loader in an unpacked GDevelop game')
    .action((directory, additionalPatches) => {
        GDJSPatcher(directory, additionalPatches);
    })
    .command('install-mod-asar <asar file>', 'Install a mod in a GDevelop game with the loader')
    .action((asarFile) => {
        //TODO
        console.warn(chalk.redBright(chalk.bold("Error: Not Implemented")))
    })
    .command('install-loader-asar <asar file>', 'Install the loader in a GDevelop game')
    .action((asarFile) => {
        //TODO
        console.warn(chalk.redBright(chalk.bold("Error: Not Implemented")))
    })
    .parse(process.argv);
