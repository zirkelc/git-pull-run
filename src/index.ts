import debugLog from 'debug';
import { getAbsolutePath } from './getAbsolutePath.js';
// import { runGit } from './runGit';
// import { execaSync } from 'execa';
import { getChangedFiles } from './getChangedFiles.js';
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
  // const regex = '(^packages/.*/package-lock.json)|(^package-lock.json)';
  // const glob = 'package-lock.json';

  try {
    const gitDir = await getGitDirectory();
    const changedFiles = await getChangedFiles(pattern);

    if (changedFiles.length === 0) {
      info(`No relevant changes for pattern '${pattern}'`);
      return;
    }

    for (const file of changedFiles) {
      const directory = getAbsolutePath(gitDir, file);

      if (command) {
        info(`Running command '${command}' for file '${file}'...`);
        const result = await runCommand(command, directory);
      }

      if (script) {
        info(`Running script '${script}' for file '${file}'...`);
        const result = await runScript(script, directory);
      }
    }
  } catch (error) {
    console.log('error', error);
  }
}
