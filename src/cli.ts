#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import debugLog from 'debug';
import { detect } from 'package-manager-detector/detect';
import { gitPullRun } from './index.js';

type Options = {
  pattern: string;
  message: string;
  command: string;
  script: string;
  debug: boolean;
  once: boolean;
};

const debug = debugLog('git-pull-run:cli');
const packageJsonPath = path.join(
  fileURLToPath(import.meta.url),
  '../../package.json',
);
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
const version = packageJson.version;

const program = new Command()
  .version(version)
  .option('-s, --script <script>', 'execute npm script for each matched file')
  .option(
    '-m, --message <message>',
    'print message to the console if matches were found',
  )
  .option('-d, --debug', 'print additional debug information', false);
program
  .command('default', { isDefault: true })
  .requiredOption('-p, --pattern <glob>', 'pattern to match files (required)')
  .option(
    '-c, --command <command>',
    'execute shell command for each matched file',
  )
  .option(
    '-o, --once',
    'run command only once if any files match the pattern',
    false,
  )
  .action(async () => {
    const options = program.opts<Options>();

    if (options.debug) debugLog.enable('git-pull-run*');

    debug(`Started git-pull-run@${version}`);

    gitPullRun(options)
      .then(() => {
        debug(`Finished git-pull-run@${version}`);
        process.exitCode = 0;
      })
      .catch(() => {
        process.exitCode = 1;
      });
  });

program.command('install', { isDefault: false }).action(async () => {
  const pm = await detect();
  if (!pm) throw new Error('Could not detect package manager');

  const command = `${pm.name} install`;
  let pattern = '';
  switch (pm.name) {
    case 'npm':
      pattern = '+(package.json|package-lock.json)';
      break;
    case 'yarn':
      pattern = '+(package.json|yarn.lock)';
      break;
    case 'pnpm':
      pattern = '+(package.json|pnpm-lock.yaml)';
      break;
    case 'bun':
      pattern = '+(package.json|bun.lockb)';
      break;
    case 'deno':
      pattern = '+(package.json|deno.lock)';
      break;
    default:
      throw new Error(
        `Unsupported package manager: found ${pm.name}, expecting npm, yarn, pnpm, bun or deno`,
      );
    // code block
  }

  const options = program.opts<Options>();

  if (options.debug) debugLog.enable('git-pull-run*');

  options.pattern = pattern;
  options.command = command;
  options.once = true;

  debug(`Started git-pull-run@${version}`);

  gitPullRun(options)
    .then(() => {
      debug(`Finished git-pull-run@${version}`);
      process.exitCode = 0;
    })
    .catch(() => {
      process.exitCode = 1;
    });
});

program.parse(process.argv);
