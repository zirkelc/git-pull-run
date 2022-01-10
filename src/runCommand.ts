import { execaCommand, ExecaError } from 'execa';
import debugLog from 'debug';

const debug = debugLog('git-pull-run:runCommand');

export async function runCommand(cmd: string, cwd: string): Promise<string> {
  debug(`Running command '${cmd}' in directory '${cwd}'`);

  try {
    const cmdProcess = execaCommand(cmd, { cwd });
    debug.enabled && cmdProcess.stdout?.pipe(process.stdout);

    const { stdout, exitCode } = await cmdProcess;
    debug(`Command executed with exit code: ${exitCode}`);

    return stdout;
  } catch (error) {
    const cmdError = error as ExecaError;
    const { exitCode, message } = cmdError;
    debug(`Command failed with exit code: ${exitCode}`);
    throw new Error(message);
  }
}
