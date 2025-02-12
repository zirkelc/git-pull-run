#!/usr/bin/env node
import { Command } from 'commander';
import debugLog from 'debug';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
const packageJsonPath = path.join(fileURLToPath(import.meta.url), '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
const version = packageJson.version;

const program = new Command()
  .version(version)
  .requiredOption('-p, --pattern <glob>', 'pattern to match files (required)')
  .option('-c, --command <command>', 'execute shell command for each matched file')
  .option('-s, --script <script>', 'execute npm script for each matched file')
  .option('-m, --message <message>', 'print message to the console if matches were found')
  .option('-d, --debug', 'print additional debug information', false)
  .option('-o, --once', 'run command only once if any files match the pattern', false)
  .parse();

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
