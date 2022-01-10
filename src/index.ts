import debugLog from 'debug';
import { getAbsolutePath } from './getAbsolutePath.js';
import { getChanges } from './getChanges.js';
import { getGitDirectory } from './getGitDirectory.js';
import { runCommand } from './runCommand.js';
import { runScript } from './runScript.js';

export type Options = {
  pattern: string;
  command: string;
  script: string;
  debug: boolean;
};

debugLog.enable('git-pull-run');
const info = debugLog.debug('git-pull-run');
info.log = console.log.bind(console);

export async function gitPullRun({ pattern, command, script }: Options): Promise<void> {
  try {
    const gitDir = await getGitDirectory();
    const changes = await getChanges(pattern);

    if (changes.length === 0) {
      info(`No relevant changes for pattern '${pattern}'`);
      return;
    } else {
      info(`Found ${changes.length} ${changes.length === 1 ? 'change' : 'changes'} for pattern '${pattern}'`);
    }

    for (const change of changes) {
      const { directory } = getAbsolutePath(gitDir, change);

      if (command) {
        info(`Running command '${command}' for change '${change}' in directory ${directory}...`);
        const result = await runCommand(command, directory);
      }

      if (script) {
        info(`Running script '${script}' for change '${change}' in directory ${directory}...`);
        const result = await runScript(script, directory);
      }
    }
  } catch (error) {
    console.log('error', error);
  }
}
