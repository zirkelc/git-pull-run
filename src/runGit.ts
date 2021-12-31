import { execaCommand } from 'execa';
import debugLog from 'debug';

const debug = debugLog('git-pull-run:runGit');

export async function runGit(cmd: string): Promise<string> {
  debug(`Running git '${cmd}'`);

  try {
    const { stdout, exitCode } = await execaCommand(cmd);
    debug(`Git command executed with exit code: ${exitCode}`);

    return stdout;
  } catch (error) {
    console.log(error);
    throw new Error('');
    //throw new Error(error);
  }
}
