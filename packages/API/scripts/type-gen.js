const { exec } = require("child_process");
const { readFile, writeFile } = require("fs/promises");

const declarations = __dirname + "/../types/GDAPI/index.d.ts";

module.exports.typeGen = () => {
  return new Promise((resolve) => {
    const p = exec("yarn ts", { cwd: __dirname + "/.." }).on(
      "exit",
      async (c) => {
        if (c !== 0)
          console.warn(
            "Type generation unsucessful! Fix ts errors before regenerating types."
          );
        else {
          await writeFile(
            declarations,
            (await readFile(declarations)) +
              "\ndeclare namespace GDAPI { export * from 'index'; };\n"
          );
        }
        resolve();
      }
    );
    p.stderr.pipe(process.stderr);
  });
};

if (require.main === module) module.exports.typeGen();
