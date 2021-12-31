#!/usr/bin/env node
import { Command } from 'commander';
import debugLog from 'debug';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gitPullRun } from '../src/index.js';

type Options = {
  pattern: string;
  command: string;
  script: string;
  debug: boolean;
};

const debug = debugLog('git-pull-run:bin');
const packageJsonPath = path.join(fileURLToPath(import.meta.url), '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
const version = packageJson.version;

const program = new Command()
  .version(version, '-v --version')
  .option('-p, --pattern <glob>', 'pattern to match files')
  .option('-c, --command <command>', 'execute shell command for each matched file', '')
  .option('-s, --script <script>', 'execute npm script for each matched file', '')
  .option('-d, --debug', 'print additional debug information', false)
  .parse();

const options = program.opts<Options>();

if (options.debug) debugLog.enable('git-pull-run*');

debug(`Running git-pull-run@${version}`);

gitPullRun(options)
  .then(() => {
    process.exitCode = 0;
  })
  .catch(() => {
    process.exitCode = 1;
  });
