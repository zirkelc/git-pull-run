import debugLog from 'debug';
import { runGit } from './runGit.js';

const debug = debugLog('git-pull-run:getGitDirectory');

export async function getGitDirectory(): Promise<string> {
  debug('Get git directory');

  const cmd = 'rev-parse --show-toplevel';
  const gitDir = await runGit(cmd);

  debug('Git directory:', gitDir);

  // ctx.gitDir = gitDir;
  return gitDir;
}
