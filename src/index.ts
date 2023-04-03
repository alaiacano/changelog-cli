#! /usr/bin/env node

const { Command } = require("commander"); // add this line
import fs from "fs-extra";
import path from "path";
import { yamlToMarkdown } from "./commands/convert";
const figlet = require("figlet");

const program = new Command();

program
  .version("1.0.0")
  .description("A CLI for managing changelogs")
  .option(
    "-y, --yaml-file  [file]",
    "The yaml file to be converted to Markdown. Default is changelog.yaml."
  )
  .option(
    "-o, --output [file]",
    "The output destination, if desired. If not supplied, the markdown will print to stdout"
  )
  .parse(process.argv);

const options = program.opts();

// check if the option has been used the user
if (options.yamlFile) {
  const filepath =
    typeof options.yamlFile === "string" ? options.yamlFile : "changelog.yaml";

  if (!fs.existsSync(filepath)) {
    console.error(`No file found: ${filepath}`);
    process.exit(1);
  }

  yamlToMarkdown(filepath).then((md: string) => {
    if (options.output && typeof options.output === "string") {
      fs.writeFileSync(options.output, md);
    } else {
      console.log(md);
    }
  });
}

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
