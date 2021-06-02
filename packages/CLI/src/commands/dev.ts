import { Command } from "clipanion";
import chalk from "chalk";
import { emptyDir, rm, readFile, readdir, createWriteStream } from "fs-extra";
import merge from "lodash/merge";
import ora from "ora";
import type { Cli } from "clipanion";
import type { BuildOptions } from "esbuild";

function getMain() {
  try {
    return require(process.cwd() + "/package.json").main;
  } catch {
    console.warn(
      chalk.yellow`⚠ No main field in package.json, using "./src/index.js"`
    );
    return process.cwd() + "/src/index.js";
  }
}

const DEFAULT_BUILD_CONFIGURATION: BuildOptions = {
  entryPoints: [getMain()],
  bundle: true,
  minify: true,
  format: "iife",
  platform: "browser",
  globalName: "Mod",
  banner: { js: "return (() => {" },
  footer: { js: "return Mod.default;\n})();\n" },
};

/**
 * Builds a GDMod code bundle out of the main es-module.
 * @param {*} to
 * @param {*} config
 */
async function buildBundle(to: string, config: BuildOptions = {}) {
  const [{ build }, { globalExternals }] = await Promise.all([
    import("esbuild"),
    import("@fal-works/esbuild-plugin-global-externals"),
  ]);

  return build(
    merge({}, config, DEFAULT_BUILD_CONFIGURATION, {
      outfile: to,
      plugins: [
        globalExternals({
          "@gdmod/api": {
            varName: "GDAPI",
            namedExports: require("../GDAPI_Signature.json"),
          },
        }),
      ],
    })
  );
}

async function buildMod() {
  const zip = new (await import("jszip")).default();

  // Copy resources
  await Promise.all(
    (await readdir("./resources")).map(async (file) =>
      zip.file("resources/" + file, await readFile("./resources/" + file))
    )
  );

  // Read manifests
  const [gdmod, resources, bundle] = await Promise.all([
    await readFile("./data/GDMod.json"),
    await readFile("./data/resources.json"),
    await readFile("./dist/bundle.js"),
  ]);

  return new Promise(async (resolve, reject) =>
    zip
      .file("data/GDMod.json", gdmod)
      .file("data/resources.json", resources)
      .file("data/includes.json", `["bundle.js"]`)
      .file("code/bundle.js", bundle)
      .generateNodeStream()
      .pipe(createWriteStream("./dist/mod.zip"))
      .once("finish", resolve)
      .once("error", reject)
  );
}

class BuildMod extends Command {
  static paths = [["dev", "build"]];
  static usage = {
    category: "Mod development",
    description: "Builds an es-module mod project to a GDMod mod.",
    details: `This is meant to be used in the scripts field of package.json, see @gmod/mod-template for an example. 
This will bundle all the code in one file, and create a mod zip with the bundle.`,
  };

  async execute() {
    console.log(chalk`{bold {cyan Launching production build}}`);
    const spinner: ora.Ora = ora(chalk.blueBright`Clean "dist"`).start();
    await emptyDir(`./dist`);
    spinner.succeed().start(chalk.magenta`Building bundle`);
    await buildBundle(`./dist/bundle.js`);
    spinner.succeed().start(chalk.magenta`Building mod file`);
    await buildMod();
    spinner.succeed().start(chalk.blueBright`Clean up temporary files`);
    await rm(`./dist/bundle.js`);
    spinner.succeed();
    console.info(
      chalk`{green {bold ✅ Success! You can now release the file {grey "{italic ./dist/mod.zip}"} and load it via a GDMod loader.}}`
    );
  }
}

export default (cli: Cli) => {
  cli.register(BuildMod);
};
