#! /usr/bin/env node

const { Command } = require("commander"); // add this line
import fs from "fs-extra";
import { yamlToMarkdown } from "./commands/gen";
import { releaseVersion } from "./commands/release";
const figlet = require("figlet");

const program = new Command();

program
  .name("Changelog Util")
  .version("1.0.0")
  .description("A CLI for managing changelogs");

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
  .action((str: { yamlFile?: string | boolean; output?: string | boolean }) => {
    const { yamlFile, output } = str;
    if (!yamlFile && !output) {
      program.commands.find((c: any) => c._name === "gen").help();
      process.exit(1);
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

program
  .command("release")
  .name("release")
  .description(
    "Moves the unreleased section to the head of the releases section and creates a new empty unreleased section.\n" +
      "NOTE: This is not a versioning tool! It simply moves some text around, and doesn't actually bump versions."
  )
  .option(
    "-y, --yaml-file  [file]",
    "The yaml file to be converted to Markdown. Default is changelog.yaml."
  )
  .option(
    "-n, --new-version [new-version]",
    'If defined, it will make this the version of the new relase. Otherwise will move "unreleased" to the head of\nthe releases list.'
  )
  .action(
    (str: { yamlFile?: string | boolean; newVersion?: string | boolean }) => {
      const { yamlFile, newVersion } = str;

      const filepath =
        typeof yamlFile === "string" ? yamlFile : "changelog.yaml";

      if (!fs.existsSync(filepath)) {
        console.error(`No file found: ${filepath}`);
        process.exit(1);
      }
      const newVersionNumber =
        newVersion && typeof newVersion === "string"
          ? newVersion
          : "unreleased";
      return releaseVersion(filepath, newVersionNumber);
    }
  );

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
