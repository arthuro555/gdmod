#! /usr/bin/env node
const {
  Cli,
  Builtins: { HelpCommand, VersionCommand },
  Command: { Default },
} = require("clipanion");

const cli = new Cli({
  binaryName: "gdmod-cli",
  binaryLabel: "GDMod CLI",
  binaryVersion: require("../package.json").version,
});

require("./commands/install")(cli);

cli.register(VersionCommand);
cli.register(HelpCommand);

cli.runExit(process.argv.slice(2), Cli.defaultContext);
