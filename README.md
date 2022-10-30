[![npm version](https://badge.fury.io/js/git-pull-run.svg)](https://badge.fury.io/js/git-pull-run)
# Run Commands on Changes after Git Pull
Automatically run commands like **npm install** when fetching changes from git, but only if certain files have changed.

## How It Works
Git invokes the [`post-merge`](https://git-scm.com/docs/githooks#_post_merge) hook after a `git pull` was done a local repository. This package will then run `git diff-tree` to get a list of changed files. Each changed file is being matched against the specified pattern and in case of a match, the specified command or script will be executed.

For more information, please refer to my post: [Automatically Install NPM Dependencies on Git Pull](https://dev.to/zirkelc/automatically-install-npm-dependencies-on-git-pull-bg0)

## Install
```sh
npm install --save-dev git-pull-run
```
This package should be executed as a [`post-merge`](https://git-scm.com/docs/githooks#_post_merge) git hook.
## Command Line Options
```sh
> npx git-pull-run --help
Usage: git-pull-run [options]

Options:
  -V --version             output the version number
  -p, --pattern <glob>     pattern to match files (required)
  -c, --command <command>  execute shell command for each matched file
  -s, --script <script>    execute npm script for each matched file
  -m, --message <message>  print message to the console if matches were found
  -d, --debug              print additional debug information (default: false)
  -h, --help               display help for command
```
- **`--pattern <pattern>`**: Required glob pattern to detect if certain files have changed on the remote repository when pulling changes. Each changed file (including path from root) is matched against this pattern.
  - uses [micromatch](https://www.npmjs.com/package/micromatch) internally and supports all matching features like wildcards, negation, extglobs and more.
- **`--command <command>`**: Command to execute on the shell for each changed file that matches the `pattern`. The command is going to be executed inside the directory of the changed file.
  - uses [execa](https://github.com/sindresorhus/execa) internally with the `cwd` option set as directory of the matched file.
- **`--script <script>`**: NPM script to execute on the shell for each changed file that matches the `pattern`. Same as option **`--command "npm run <script>"`**. The script is going to be executed inside the directory of the changed file.
- **`--message <message>`**: Message to print to the shell if any changed files matches the `pattern`. The message is printed only once and not for each changed file.
- **`--debug`**: Run in debug mode and print additional information about the changed files and commands and scripts that are being executed.

## Usage

### Run `npm install` when `package-lock.json` changes
`post-merge` git hook with [Husky](https://github.com/typicode/husky):
```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# matches only the package-lock.json inside project directory
npx git-pull-run --pattern "package-lock.json" --command "npm install"
```
_On Windows, white spaces in the command like `npm install` must be escaped with backslashes, for example:_ `npx git-pull-run --pattern "package-lock.json" --command "npm\ install"`

### Run `npm install` in a multi-package monorepo
`post-merge` git hook with [Husky](https://github.com/typicode/husky):
```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# assumes monorepo structure with multiple packages in directory /packages
# matches any of these package-lock.json
npx git-pull-run --pattern "packages/*/package-lock.json" --command "npm install"
```

## FAQ
### Match `package.json` or `package-lock.json`?
The `package.json` contains the semver versions of each package whereas the `package-lock.json` contains the exactly installed version of each package. See [But what the hell is package-lock.json?](https://dev.to/saurabhdaware/but-what-the-hell-is-package-lock-json-b04) for more information.

### Run `npm install` or `npm ci`?
[Discussion on: But what the hell is package-lock.json?](https://dev.to/zkat/comment/epbj):
> `npm install` does not ignore `package.json` versions, nor does it ignore the `package-lock.json`. What it does is verify that the `package.json` and `package-lock.json` correspond to each other. That is, if the semver versions described in `package.json` fit with the locked versions in `package-lock.json`, `npm install` will use the latter completely, just like `npm ci` would.
>
> Now, if you change `package.json` such that the versions in `package-lock.json` are no longer valid, your `npm install` will be treated as if you'd done `npm install some-pkg@x.y.z`, where x.y.z is the new version in the `package.json` for some-package.

### Error: Command failed with exit code 1: npm

On Windows, white spaces in the command like `npm install` must be escaped with backslashes, for example: `npx git-pull-run --pattern "package-lock.json" --command "npm\ install"`

[Issue: Command failed with exit code 1: npm #1](https://github.com/zirkelc/git-pull-run/issues/1)

## What about Yarn?
The `yarn.lock` should be used as pattern option (instead of `package-lock.json`) and the `yarn install` should be used as command option (instead of `npm install`). If you want to run scripts defined in the `package.json` with yarn instead of npm, please use the command option with `--command "yarn run <script>"` instead of `--script "<script>"`.
