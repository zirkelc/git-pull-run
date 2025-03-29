import debugLog from 'debug';
import micromatch from 'micromatch';
import type { Context } from './index.js';
import { runGit } from './runGit.js';

const debug = debugLog('git-pull-run:getChanges');

export async function getChanges(pattern: string): Promise<string[]> {
  debug('Get changed files');

  const cmd = 'git diff --name-only HEAD@{1} HEAD';
  const result = await runGit(cmd);

  const files = result.split('\n');
  debug('Changed files:', files);

  const changes = micromatch(files, pattern);
  debug(`Changes that match pattern '${pattern}':`, changes);

  // ctx.changes = changes;
  return changes;
}
