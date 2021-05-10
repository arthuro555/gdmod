const fs = require("fs").promises;
const { join } = require("path");
const asar = require("asar");
const chalk = require("chalk");
const os = require("os")

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
module.exports.editAsar = async (asarFile, editor, debug) => {
  const tempDir = join(await fs.realpath(os.tmpdir()), "GDModTemp");
  const tempAsar = join(tempDir, "app.asar");

  // Make sure temp directory is empty
  try {
    await fs.mkdir(tempDir);
  } catch {
    console.log(chalk.blue(chalk.italic("Cleaning up old files...")));
    await fs.rmdir(tempDir, { recursive: true });
    await fs.mkdir(tempDir);
  }

  // Read file
  const asarFileContent = await fs.readFile(asarFile);

  // Backup asar
  console.log(chalk.greenBright(chalk.italic("Backing up old asar file...")));
  await fs.writeFile(asarFile + ".bak", asarFileContent);

  // Copy asar to temp folder
  console.log(chalk.greenBright(chalk.italic("Loading asar file...")));
  await fs.writeFile(tempAsar, asarFileContent);

  // Unpack the asar
  try {
    console.log(chalk.greenBright(chalk.italic("Unpacking asar file...")));
    asar.extractAll(tempAsar, tempDir);
    await fs.unlink(tempAsar); // To not repack it later
  } catch (e) {
    if (debug) console.log(e);
    console.error(
      chalk.redBright(chalk.bold("[ERROR] ") + "Invalid asar File!")
    );
    return false;
  }

  // Run asar editor
  editor(join(tempDir, "app")).then(
    () => {
      // Success, repacking the asar
      console.log(chalk.greenBright(chalk.italic("Repacking asar file...")));
      asar.createPackage(tempDir, tempAsar).then(async () => {
        // Copy temporary new asar back to the original path
        await fs.writeFile(asarFile, await fs.readFile(tempAsar));
        console.log(chalk.greenBright(chalk.bold("DONE !")));
        console.log(chalk.blue(chalk.italic("Cleaning up...")));
        // Delete temp directory
        await fs.rmdir(tempDir, { recursive: true });
      });
    },
    async (e) => {
      // Patch aborted, cleaning up:
      console.log(chalk.redBright(chalk.bold("Error! ")), e);
      console.log(chalk.blue(chalk.italic("Cleaning up...")));
      // Delete temp directory
      await fs.rmdir(tempDir, { recursive: true });
    }
  );
};
