const { Command } = require("clipanion");
const chalk = require("chalk");
const {
  emptyDir,
  rm,
  readFile,
  writeFile,
  readdir,
  createWriteStream,
} = require("fs-extra");

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

const DEFAULT_BUILD_CONFIGURATION = {
  entryPoints: [getMain()],
  bundle: true,
  minify: true,
  format: "iife",
  platform: "browser",
  globalName: "Mod",
};

/**
 * Builds a GDMod code bundle out of the main es-module.
 * @param {*} to
 * @param {*} config
 */
async function buildBundle(to, config = {}) {
  const { build } = require("esbuild");
  const {
    globalExternals,
  } = require("@fal-works/esbuild-plugin-global-externals");
  const merge = require("lodash/merge");

  const results = await build(
    merge({}, DEFAULT_BUILD_CONFIGURATION, config, {
      outfile: to,
      plugins: [
        globalExternals({
          "@gdmod/api": {
            varName: "GDAPI",
            namedExports: [
              "Mod",
              "ModManager",
              "registerCallback",
              "unregisterCallback",
              "GDCallback",
              "RuntimeSceneCallback",
              "loadExtension",
              "parseModManifest",
              "loadModFile",
            ],
          },
        }),
      ],
    })
  );

  await writeFile(
    to,
    "return (() => {\n  " +
      (await readFile(to)) +
      "  return Mod.default;\n})();\n"
  );

  return results;
}

async function buildMod() {
  const zip = new (require("jszip"))();
  await Promise.all(
    (await readdir("./resources")).map(async (file) =>
      zip.file("resources/" + file, await readFile("./resources/" + file))
    )
  );
  return new Promise(async (resolve, reject) =>
    zip
      .file("data/GDMod.json", await readFile("./data/GDMod.json"))
      .file("data/resources.json", await readFile("./data/resources.json"))
      .file("data/includes.json", `["bundle.js"]`)
      .file("code/bundle.js", await readFile("./dist/bundle.js"))
      .generateNodeStream()
      .pipe(createWriteStream("./dist/mod.zip"))
      .once("finish", resolve)
      .once("error", reject)
  );
}

module.exports = (cli) => {
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
      const spinner = require("ora")(chalk.blueBright`Clean "dist"`).start();
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
  cli.register(BuildMod);
};
