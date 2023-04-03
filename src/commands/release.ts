import YAML from "yaml";
import fs from "fs-extra";
import { Changelog, JSON_SCHEMA_DEFINITION } from "../types";

export const releaseVersion = (
  fileName: string,
  newVersion: string | undefined
) => {
  return fs
    .readFile(fileName, "utf8")
    .then((text) => {
      const cl = YAML.parse(text) as Changelog;

      // Change the version of `cl.unreleased` to the specified one, if applicable.
      // This will become the head of the `releases` list.
      const newRelease = {
        ...cl.unreleased,
        version: newVersion || cl.unreleased.version,
      };

      const currentDate = new Date().toISOString().split("T")[0];
      const newCl: Changelog = {
        ...cl,
        unreleased: { version: "unreleased", date: currentDate },
        releases: [newRelease, ...(cl.releases || [])],
      };
      return YAML.stringify(newCl);
    })
    .then((text: string) => {
      // Add in our schema definition.
      const textWithSchema = `${JSON_SCHEMA_DEFINITION}\n\n${text}`;
      fs.writeFile(fileName, textWithSchema);
    });
};
