const program = require("commander");
var chalk = require('chalk');

program
    .version('0.0.1')
    .description("A CLI for installing the mod loader or a mod")
    .command('install-mod <asar file>', 'Install a mod in a GDevelop game with the loader')
    .action((asarFile) => {
        //TODO
        console.warn(chalk.redBright(chalk.bold("Error: Not Implemented")))
    })
    .command('install-loader <asar file>', 'Install the loader in a GDevelop game')
    .action((asarFile) => {
        //TODO
        console.warn(chalk.redBright(chalk.bold("Error: Not Implemented")))
    })
    .parse(process.argv);
