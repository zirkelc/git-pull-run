import { execaCommand } from 'execa';
import debugLog from 'debug';

const debug = debugLog('git-pull-run:runCommand');

export async function runCommand(cmd: string, cwd: string): Promise<string> {
  debug(`Running command '${cmd}' in directory '${cwd}'`);

  try {
    const { stdout, exitCode } = await execaCommand(cmd, { cwd });
    debug(`Command executed with exit code: ${exitCode}`);

    return stdout;
  } catch (error) {
    console.log(error);
    throw new Error('');
    //throw new Error(error);
  }
}
