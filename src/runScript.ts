import { execa } from 'execa';
import debugLog from 'debug';

const debug = debugLog('git-pull-run:runScript');

export async function runScript(script: string, cwd: string): Promise<string> {
  debug(`Running script '${script}' in directory '${cwd}'`);

  try {
    const commands = ['run-script', script];
    const { stdout, exitCode } = await execa('npm', commands, { cwd });
    debug(`Script executed with exit code: ${exitCode}`);

    return stdout;
  } catch (error) {
    console.log(error);
    throw new Error('');
    //throw new Error(error);
  }
}
