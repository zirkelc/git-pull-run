import { cwd } from 'node:process';
import debugLog from 'debug';
import { runCommand } from './runCommand.js';

const debug = debugLog('git-pull-run:getGitDirectory');

export async function getGitDirectory(): Promise<string> {
  debug('Get git directory');

  const cmd = 'git rev-parse --show-toplevel';
  const gitDir = await runCommand(cmd, cwd());

  debug('Git directory:', gitDir);

  // ctx.gitDir = gitDir;
  return gitDir;
}
