#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command, Option } from '@commander-js/extra-typings';
import debugLog from 'debug';
import { detect } from 'package-manager-detector/detect';
import { gitPullRun } from './index.js';

const installOption = new Option(
  '-i, --install',
  'detect package manager and run install',
);
const patternOption = new Option(
  '-p, --pattern <glob>',
  'pattern to match files (required)',
);
const commandOption = new Option(
  '-c, --command <command>',
  'execute shell command for each matched file',
);
const scriptOption = new Option(
  '-s, --script <script>',
  'execute npm script for each matched file',
);
const messageOption = new Option(
  '-m, --message <message>',
  'print message to the console if matches were found',
);
const debugOption = new Option(
  '-d, --debug',
  'print additional debug information',
);
const onceOption = new Option(
  '-o, --once',
  'run command only once if any files match the pattern',
);

const debug = debugLog('git-pull-run:cli');
const packageJsonPath = path.join(
  fileURLToPath(import.meta.url),
  '../../package.json',
);
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
const version = packageJson.version;

const program = new Command('git-pull-run')
  .name('git-pull-run')
  .version(version)
  .addOption(installOption.conflicts('pattern').implies({ once: true }))
  .addOption(patternOption.conflicts('install'))
  .addOption(commandOption.conflicts('install'))
  .addOption(scriptOption)
  .addOption(messageOption)
  .addOption(debugOption.default(false))
  .addOption(onceOption.default(false))
  .action(async (options) => {
    if (options.install) {
      const pm = await detect();
      if (!pm) program.error('Could not detect package manager');

      options.pattern = (() => {
        switch (pm?.name) {
          case 'npm':
            return '+(package.json|package-lock.json)';
          case 'yarn':
            return '+(package.json|yarn.lock)';
          case 'pnpm':
            return '+(package.json|pnpm-lock.yaml)';
          case 'bun':
            return '+(package.json|bun.lock|bun.lockb)';
          case 'deno':
            return '+(package.json|deno.json|deno.jsonc|deno.lock)';
          default:
            return program.error(
              `Unsupported package manager: found ${pm?.name}, expecting npm, yarn, pnpm, bun or deno`,
            );
        }
      })();
      options.command = `${pm?.name} install`;
    } else if (!options.pattern) {
      program.error(
        `error: required option '-p, --pattern <glob>' not specified`,
      );
    } else if (!options.install && !options.pattern) {
      program.error(
        `error: required option '-p, --pattern <glob>' not specified`,
      );
    }

    if (options.debug) debugLog.enable('git-pull-run*');

    debug(`Started git-pull-run@${version}`);

    gitPullRun({
      pattern: options.pattern ?? '',
      command: options.command ?? '',
      script: options.script ?? '',
      message: options.message ?? '',
      debug: options.debug,
      once: options.once,
    })
      .then(() => {
        debug(`Finished git-pull-run@${version}`);
        process.exitCode = 0;
      })
      .catch(() => {
        process.exitCode = 1;
      });
  });

await program.parseAsync(process.argv);
