import { runGit } from './runGit.js';
import debugLog from 'debug';
import micromatch from 'micromatch';

const debug = debugLog('git-pull-run:getGitDirectory');

export async function getGitDirectory(): Promise<string> {
  debug('Get git directory');

  const cmd = 'git rev-parse --show-toplevel';
  const result = await runGit(cmd);

  debug('Git directory:', result);

  return result;
}
