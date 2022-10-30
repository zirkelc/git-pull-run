import * as testingLibrary from '@gmrchk/cli-testing-library';
import type { CLITestEnvironment } from '@gmrchk/cli-testing-library/lib/types';
import { execSync } from 'child_process';

jest.setTimeout(10_000);

const clearDebugOutput = (result: string[]) => result
  .filter((line) => !line.startsWith('Debugger attached'))
  .filter((line) => !line.startsWith('Waiting for the debugger to disconnect'));

describe('Run CLI options', () => {
  let testEnv: CLITestEnvironment;

  beforeEach(async () => {
    testEnv = await testingLibrary.prepareEnvironment();
    const { execute } = testEnv;

    testEnv.execute = async (...params: Parameters<typeof execute>) => {
      const { stdout, stderr, ...result } = await execute(...params);
      return { ...result, stdout: clearDebugOutput(stdout), stderr: clearDebugOutput(stderr) };
    }
  });

  afterEach(async () => {
    await testEnv.cleanup();
  });

  test('Print version', async () => {
    execSync(`git commit --allow-empty -m "Empty-Commit"`);
    execSync("git reset --hard HEAD~1");

    const { code, stdout, stderr } = await testEnv.execute(
      'ts-node',
      './src/cli.ts -p README.md'
    );

    expect(code).toBe(0);
    expect(stderr).toHaveLength(0);
  });
});
