import { cwd } from 'node:process';
import debugLog from 'debug';
import picomatch from 'picomatch';
import { runCommand } from './runCommand.js';

const debug = debugLog('git-pull-run:getChanges');

export async function getChanges(pattern: string): Promise<string[]> {
  debug('Get changed files');

  const cmd = 'git diff --name-only HEAD@{1} HEAD';
  const result = await runCommand(cmd, cwd());

  const files = result.split('\n');
  debug('Changed files:', files);

  const isMatch = picomatch(pattern);
  const changes = files.filter((file) => isMatch(file));
  debug(`Changes that match pattern '${pattern}':`, changes);

  // ctx.changes = changes;
  return changes;
}
