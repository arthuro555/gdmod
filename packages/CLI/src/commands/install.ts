import { Command, Option } from "clipanion";
import { installGDMod, installGDModElectron } from "@gdmod/local-loader";
import chalk from "chalk";
import fs from "fs/promises";
import { prompt } from "inquirer";
import { editAsar } from "../utils";
import type { Cli } from "clipanion";

class InstallWizard extends Command {
  static paths = [[`install`]];
  static usage = {
    category: "Loader Installation",
    description: "Launches the interactive installer.",
    details:
      "Launches an interactive step-by-step installer to patch any GDevelop game, so that it can run GDMod mods.",
    examples: [[`Launch the interactive installer`, `$0 install`]] as [
      string,
      string
    ][],
  };

  rest = Option.Proxy();

  async execute() {
    const results = await prompt([
      {
        type: "list",
        name: "type",
        message: "What type of export is the game you wish to patch?",
        choices: [
          { name: "A local HTML5 export", value: "dir" },
          { name: "An online HTML5 export", value: "web" },
          { name: "A PC export", value: "asar" },
          { name: "A mobile export", value: "mobile" },
        ],
      },
      {
        name: "location",
        message: `What is the path to the ${chalk.italic
          .blue`app.asar`} file of the game? You can find it under "the/game/folder/resources/app.asar".`,
        when: (currentAnswers) => {
          return currentAnswers.type === "asar";
        },
        validate: async (answer) => {
          try {
            const stat = await fs.stat(answer);
            if (!stat.isFile()) return "The path entered is not a file!";
          } catch {
            return "Cannot find or access the asar file!";
          }
          return true;
        },
      },
      {
        name: "location",
        message: `What is the path to the directory of the game?`,
        when: (currentAnswers) => {
          return currentAnswers.type === "dir";
        },
        validate: async (answer) => {
          const fs = require("fs/promises");
          try {
            const stat = await fs.stat(answer);
            if (!stat.isDirectory())
              return "The path entered is not a directory!";
          } catch {
            return "Cannot find or access the directory!";
          }
          return true;
        },
      },
      {
        type: "confirm",
        name: "electron",
        message: `Do you wish to apply electron only patches?`,
        when: (currentAnswers) => {
          return currentAnswers.type === "dir";
        },
      },
    ]);

    if (results.type === "mobile") {
      console.info(
        chalk.red`\nMobile is sadly not supported by GDMod currently.`
      );
      return 1;
    }

    if (results.type === "web") {
      console.log(
        chalk`{green The CLI cannot patch games hosted online. Please use the browser extension for this platform.} 
{italic {bold Learn more at} {underline {grey https://github.com/arthuro555/gdmod/wiki/Installation-Guide#web-games}}.}`
      );
      return 1;
    }

    const command: string[] = ["install", results.type, results.location];
    if (results.electron) command.push("--electron");
    return await this.cli.run(command.concat(this.rest));
  }
}

class InstallLoaderDir extends Command {
  static paths = [[`install`, `dir`]];
  static usage = {
    category: "Loader Installation",
    description: "Installs the loader in a directory.",
    details: "",
    examples: [[`Patch an exported GDevelop game`, `$0 install dir`]] as [
      string,
      string
    ][],
  };

  directory = Option.String({ required: true });
  electron = Option.Boolean(`-e,--electron`);
  debug = Option.Boolean(`-d,--debug`);

  async execute() {
    const currentLoader: (dir: string) => Promise<void> = this.electron
      ? installGDModElectron
      : installGDMod;

    try {
      await currentLoader(this.directory);
      return 0;
    } catch (e) {
      if (this.debug) console.log(e);
      return 1;
    }
  }
}

class InstallLoaderAsar extends Command {
  static paths = [[`install`, `asar`]];
  static usage = {
    category: "Loader Installation",
    description: "Installs the loader to an app.asar",
    details: "",
    examples: [[`Patch an asar file`, `$0 install asar ./app.asar`]] as [
      string,
      string
    ][],
  };

  asarFile = Option.String({ required: true });
  debug = Option.Boolean(`-d,--debug`, false);

  async execute() {
    try {
      await editAsar(this.asarFile, installGDModElectron, this.debug);
      return 0;
    } catch (e) {
      if (this.debug) console.log(e);
      return 1;
    }
  }
}

export default (cli: Cli) => {
  cli.register(InstallWizard);
  cli.register(InstallLoaderDir);
  cli.register(InstallLoaderAsar);
};
