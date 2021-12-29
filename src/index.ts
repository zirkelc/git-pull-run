#!/usr/bin/env node

import { spawn } from 'child_process';

const gitDiff = spawn('git', ['diff', '--name-only HEAD@{1} HEAD'], {});
let stdOutData = '';
let stderrData = '';

gitDiff.stdout.on('data', (data) => (stdOutData += data));
gitDiff.stderr.on('data', (data) => (stderrData += data));
// gitDiff.on('close', (code) => (code != 0 ? reject(stderrData.toString()) : resolve(stdOutData.toString())));
gitDiff.on('close', (code) => console.log(`Closed: ${code}`));
