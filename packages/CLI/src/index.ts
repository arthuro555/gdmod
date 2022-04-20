#!/usr/bin/env node
import { Cli, Builtins } from "clipanion";
import { installCommands } from "./commands";

const cli: Cli = new Cli({
  binaryName: "gdmod-cli",
  binaryLabel: "GDMod CLI",
  binaryVersion: require("../package.json").version,
});

installCommands(cli);

cli.register(Builtins.VersionCommand);
cli.register(Builtins.HelpCommand);

cli.runExit(process.argv.slice(2), Cli.defaultContext);
