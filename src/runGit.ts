import debugLog from 'debug';
import { type ExecaError, execaCommand } from 'execa';

const debug = debugLog('git-pull-run:runGit');

export async function runGit(cmd: string): Promise<string> {
  debug(`Running git '${cmd}'`);

  try {
    const cmdProcess = execaCommand(cmd);
    debug.enabled && cmdProcess.stdout?.pipe(process.stdout);

    const { stdout, exitCode } = await cmdProcess;
    debug(`Git command executed with exit code: ${exitCode}`);

    return stdout;
  } catch (error) {
    const cmdError = error as ExecaError;
    const { exitCode, message } = cmdError;
    debug(`Git failed with exit code: ${exitCode}`);
    throw new Error(message);
  }
}
