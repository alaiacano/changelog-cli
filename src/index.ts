#! /usr/bin/env node

const { Command } = require("commander"); // add this line
import fs from "fs-extra";
import path from "path";
import { yamlToMarkdown } from "./commands/convert";
const figlet = require("figlet");

const program = new Command();

program
  .name("Changelog Util")
  .version("1.0.0")
  .description("A CLI for managing changelogs");

type GenType = {
  yamlFile?: string | boolean;
  output?: string | boolean;
};
// Generate a changelog from yaml
program
  .command("gen")
  .name("gen")
  .option(
    "-y, --yaml-file  [file]",
    "The yaml file to be converted to Markdown. Default is changelog.yaml."
  )
  .option(
    "-o, --output [file]",
    "The output destination, if desired. If not supplied, the markdown will print to stdout"
  )
  .action((str: GenType) => {
    const { yamlFile, output } = str;
    if (!yamlFile && !output) {
      program.commands.find((c: any) => c._name === "gen").help();
      process.exit(0);
    }

    const filepath = typeof yamlFile === "string" ? yamlFile : "changelog.yaml";

    if (!fs.existsSync(filepath)) {
      console.error(`No file found: ${filepath}`);
      process.exit(1);
    }

    yamlToMarkdown(filepath).then((md: string) => {
      if (output && typeof output === "string") {
        fs.writeFileSync(output, md);
      } else {
        console.log(md);
      }
    });
  });

program.showHelpAfterError();

program.parse(process.argv);

// const options = program.opts();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
