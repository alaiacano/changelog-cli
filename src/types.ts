/**
 * Represents a single change. Multiple `ChangelogEntry`s roll up into a `ChangelogRelease`
 */
export type ChangelogEntry = {
  description: string;
  diff?: string;
  author?: {
    name: string;
    email?: string;
  };
  breaking?: boolean;
};

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
export type ChangelogVersion = {
  // Version should be semantic version `major.minor.patch` or "cal-ver" `yy.mm.xx`
  version: string;
  // Dates should be `YYYY-MM-DD` format
  date: string;
  tag?: string;

  // Lists of the changes made in this release.
  added?: ChangelogEntry[];
  changed?: ChangelogEntry[];
  fixed?: ChangelogEntry[];
  removed?: ChangelogEntry[];
};

/**
 * The full Changelog!
 *
 * There is a single `unreleased` field and a list of `releases`.
 */
export type Changelog = {
  title: string;
  description: string;
  unreleased: ChangelogVersion;
  releases?: ChangelogVersion[];
};
