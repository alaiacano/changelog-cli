This is a simple utility to manage Changelogs. Consider it in alpha for now, until there are tests.

It was inspired by two things:

- https://keepachangelog.com and is intended to help you manage changelogs using that paradigm. Unfortunately, there are no standard formats for changelogs which makes it difficult to build tooling.
- The [ADR plugin for Backstage](https://github.com/backstage/backstage/tree/master/plugins/adr), and using tools like [pyadr](https://github.com/opinionated-digital-center/pyadr) to produce markdown documents in a consistent and reliable format.

This tool defines a standard schema for changelogs, both as TypeScript types and a JSON Schema. Developers create their changelog in YAML format, and use `changelog` to migrate it to markdown and/or manage the release cycle.

# Installing

To install:

```bash
npm i @alaiacano/changelog
```

or

```bash
yarn add @alaiacano/changelog
```

From source:

```bash
npm run build
npm install -g
```

This will give you a `changelog` command.

```bash
▶ changelog
Usage: Changelog Util [options] [command]

A CLI for managing changelogs

Options:
  -V, --version      output the version number
  -h, --help         display help for command

Commands:
  gen [options]
  release [options]  Moves the unreleased section to the head of the releases section and creates a new empty unreleased section.

                     This is not a versioning tool! It simply moves some text around, and doesn't actually bump versions.
  help [command]     display help for command
```

# Example: Generating Markdown

Here's an example input. Note that the `yaml-language-server` line at the top is important! You should be using the [Redhat YAML Language Support for VSCode](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) (or similar) in order to get real-time verification of your syntax.

```yaml
# yaml-language-server: $schema=schema.json

title: My Changelog
description: This is an example changelog in the format I made.
unreleased:
  version: unreleased
  date: "2023-04-03"
  description: This is the stuff that will be released soon. The `version` is probably still "unreleased."
  added:
    - description: Created the "gen" sub command to convert changelog.yaml to changelog.md

releases:
  - version: "0.0.0"
    date: "2023-04-01"
    description: Came up with the idea
    added: []
    changed:
      - description: Description of a breaking change
        author:
          name: john doe
          email: john@doe.com
        breaking: true
      - description: A notable but non-breaking change.
        author:
          name: Jane Doe
          email: jane@doe.com
        breaking: false
    removed:
      - description: Got rid of the depreated code.
        url: http://www.github.com/org/project/pull/420
    fixed:
      - description: Finally fixed the bug everyone ran into.
        url: http://www.github.com/org/project/issues/421
```

Running `changelog gen -y changelog.yml` produces:

```markdown
<!--
NOTE! This is an auto-generated changelog file.
Edit example.yaml instead of this otherwise changes will likely be lost.
-->

# My Changelog

This is an example changelog in the format I made.

## [unreleased] - 2023-04-03

This is the stuff that will be released soon. The `version` is probably still "unreleased."

### Added

- Created the "gen" sub command to convert changelog.yaml to changelog.md

## [0.0.0] - 2023-04-01

Came up with the idea

### Changed

Breaking:

- Description of a breaking change - john doe (john@doe.com)

Non-Breaking:

- A notable but non-breaking change. - Jane Doe (jane@doe.com)

### Fixed

- Finally fixed the bug everyone ran into. [#](http://www.github.com/org/project/issues/421)

### Removed

- Got rid of the depreated code. [#](http://www.github.com/org/project/pull/420)
```

# Example: Making a Release

The `changelog release` command will put the `unreleased` section into the head of the `releases` list and create a new `unreleased` section for you. Running these two commands using the `changelog.yaml` from above

```bash
changelog release -y example.yaml -v 2.0.0
changelog gen -y example.yaml
```

will yield:

```markdown
# My Changelog

This is an example changelog in the format I made.

## [unreleased] - 2023-04-03

## [2.0.0] - 2023-04-02

### Added

- Created the "gen" sub command to convert changelog.yaml to changelog.md- Created the "release" sub command to move `unreleased` to the head of the `releases` list and make a new `unreleased`.

### Fixed

- TODO: forgot to include a description of the ChangelogVersion.

## [0.0.0] - 2023-04-01

### Changed

Breaking:

- Description of a breaking change - john doe (john@doe.com)

Non-Breaking:

- A notable but non-breaking change. - Jane Doe (jane@doe.com)

### Fixed

- Finally fixed the bug everyone ran into.

### Removed

- Got rid of the depreated code.
```
