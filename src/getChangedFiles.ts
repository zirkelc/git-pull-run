import { runGit } from './runGit.js';
import debugLog from 'debug';
import micromatch from 'micromatch';

const debug = debugLog('git-pull-run:getChangedFiles');

export async function getChangedFiles(pattern: string): Promise<string[]> {
  debug('Get changed files');

  const cmd = 'git diff --name-only HEAD@{1} HEAD';
  const result = await runGit(cmd);

  const files = result.split('\n');
  debug('Changed files:', files);

  const matches = micromatch(files, pattern);
  debug(`Match files with pattern '${pattern}':`, matches);

  return matches;
}
