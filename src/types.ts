import { z } from "zod";

export const JSON_SCHEMA_DEFINITION =
  "# yaml-language-server: $schema=https://gist.githubusercontent.com/alaiacano/307e2fb6acb8d7c9be5137e8f33c4673/raw/b194eb64a4b7e71b77736d33258df7157f12331a/changelogschema.json";

/**
 * Represents a single change. Multiple `ChangelogEntry`s roll up into a `ChangelogRelease`
 */
const changelogEntry = z.object({
  description: z.string(),
  diff: z.string().optional(),
  author: z
    .object({ name: z.string(), email: z.string().optional() })
    .optional(),
  breaking: z.boolean().optional(),
});
export type ChangelogEntry = z.infer<typeof changelogEntry>;

/**
 * Represents a single release (or `unreleased`) version.
 *
 * The version has a date, string, optional [git] tag, and the following list of ChangelogEntry's:
 *
 * * added - what was added in this release?
 * * changed - which [breaking] changes were there?
 * * fixed - bug fixes, etc
 * * removed - what functionality whas removed?
 */
const changelogVersion = z.object({
  version: z.string(),
  date: z.string(),
  tag: z.string().optional(),
  description: z.string().optional(),
  added: z.array(changelogEntry).optional(),
  changed: z.array(changelogEntry).optional(),
  fixed: z.array(changelogEntry).optional(),
  removed: z.array(changelogEntry).optional(),
});
export type ChangelogVersion = z.infer<typeof changelogVersion>;

const changelog = z.object({
  title: z.string(),
  description: z.string(),
  unreleased: changelogVersion,
  releases: z.array(changelogVersion).optional(),
});
export type Changelog = z.infer<typeof changelog>;
