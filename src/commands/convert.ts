import YAML from "yaml";
import fs from "fs-extra";
import { Changelog, ChangelogVersion, ChangelogEntry } from "../types";

const writeLine = (entry: ChangelogEntry): string => {
  let line = `- ${entry.description.replace("\n", " ")}`;

  if (entry.author) {
    line += ` - ${entry.author?.name}`;
    if (entry.author?.email) {
      line += ` (${entry.author?.email})`;
    }
    line += "\n";
  }
  return line;
};

const stringifyEntries = (entries: ChangelogEntry[]): string => {
  let output = "";
  const breaking = entries.filter((e) => e.breaking === true);
  const notBreaking = entries.filter((e) => e.breaking !== true);

  if (breaking.length > 0) {
    output += "Breaking:\n\n";
    breaking.forEach((e) => {
      output += writeLine(e);
    });
    output += "\nNon-Breaking:\n\n";
  }
  notBreaking.forEach((e) => {
    output += writeLine(e);
  });
  output += "\n\n";
  return output;
};

const stringifyVersion = (ver: ChangelogVersion): string => {
  let output = "";
  // Version header
  output += `## [${ver.version}] - ${ver.date}\n\n`;
  if (ver.added && ver.added.length > 0) {
    output += "### Added\n\n";
    output += stringifyEntries(ver.added);
  }

  if (ver.changed && ver.changed.length > 0) {
    output += "### Changed\n\n";
    output += stringifyEntries(ver.changed);
  }

  if (ver.fixed && ver.fixed.length > 0) {
    output += "### Fixed\n\n";
    output += stringifyEntries(ver.fixed);
  }

  if (ver.removed && ver.removed.length > 0) {
    output += "### Removed\n\n";
    output += stringifyEntries(ver.removed);
  }

  return output;
};

export const yamlToMarkdown = (fileName: string): Promise<string> => {
  return fs.readFile(fileName, "utf8").then((text) => {
    const cl = YAML.parse(text) as Changelog;
    // Start building the file.
    let output = "";

    // Mandatory Title
    output += `# ${cl.title}\n\n`;

    // Mandatory Description
    output += `${cl.description}\n\n`;

    // Mandatory unreleased
    output += stringifyVersion(cl.unreleased);

    // Older versions:
    // Mandatory unreleased
    cl.releases?.forEach((release) => {
      output += stringifyVersion(release);
    });

    return output;
  });
};
