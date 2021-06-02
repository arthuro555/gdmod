import install from "./install";
import dev from "./dev";
import type { Cli } from "clipanion";

export const installCommands = (cli: Cli) => {
  install(cli);
  dev(cli);
};
