import debugLog from 'debug';
import { echoMessage } from './echoMessage.js';
import { getAbsolutePath } from './getAbsolutePath.js';
import { getChanges } from './getChanges.js';
import { getGitDirectory } from './getGitDirectory.js';
import { runCommand } from './runCommand.js';
import { runScript } from './runScript.js';

export type Options = {
  pattern: string;
  message: string;
  command: string;
  script: string;
  debug: boolean;
};

debugLog.enable('git-pull-run');

function humanize(ms: number): string;
function humanize(ms: string): number;
function humanize(ms: number | string): string | number {
  return ``;
}
debugLog.humanize = humanize;

const info = debugLog.debug('git-pull-run');
info.log = console.log.bind(console);


export { info };

export async function gitPullRun({ pattern, message, command, script }: Options): Promise<void> {
  try {
    const gitDir = await getGitDirectory();
    const changes = await getChanges(pattern);

    if (changes.length === 0) {
      info(`No relevant changes for pattern '${pattern}'`);
      return;
    } else {
      info(`Found ${changes.length} ${changes.length === 1 ? 'change' : 'changes'} for pattern '${pattern}'`);
    }

    if (message) {
      echoMessage(message);
    }

    for (const change of changes) {
      const { directory } = getAbsolutePath(gitDir, change);

      if (command) {
        info(`Running command '${command}' for change '${change}' in directory ${directory}...`);
        await runCommand(command, directory);
      }

      if (script) {
        info(`Running script '${script}' for change '${change}' in directory ${directory}...`);
        await runScript(script, directory);
      }
    }
  } catch (error) {
    console.log('error', error);
  }
}
