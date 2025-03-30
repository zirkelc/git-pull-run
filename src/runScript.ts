import debugLog from 'debug';
import { type ExecaError, execa } from 'execa';

const debug = debugLog('git-pull-run:runScript');

export async function runScript(script: string, cwd: string): Promise<string> {
  debug(`Running script '${script}' in directory '${cwd}'`);

  try {
    const commands = ['run-script', script];
    const cmdProcess = execa('npm', commands, { cwd });
    debug.enabled && cmdProcess.stdout?.pipe(process.stdout);

    const { stdout, exitCode } = await cmdProcess;
    debug(`Script executed with exit code: ${exitCode}`);

    return stdout;
  } catch (error) {
    const cmdError = error as ExecaError;
    const { exitCode, message } = cmdError;
    debug(`Script failed with exit code: ${exitCode}`);
    throw new Error(message);
  }
}
