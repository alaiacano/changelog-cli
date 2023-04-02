#! /usr/bin/env node

const { Command } = require("commander"); // add this line
import fs from "fs-extra";
import path from "path";
import { yamlToMarkdown } from "./commands/convert";
const figlet = require("figlet");

const program = new Command();

// console.log(figlet.textSync("Changelog"));

program
  .version("1.0.0")
  .description("A CLI for managing changelogs")
  .option("-m, --markdown  [file]", "Convert changelog.yaml to markdown")
  .parse(process.argv);

const options = program.opts();

// check if the option has been used the user
if (options.markdown) {
  const filepath =
    typeof options.markdown === "string" ? options.markdown : __dirname;
  yamlToMarkdown(filepath).then(console.log);
  // console.log(text);
}

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
