import * as testingLibrary from '@gmrchk/cli-testing-library';
import type { CLITestEnvironment } from '@gmrchk/cli-testing-library/lib/types';
import { echoMessage } from '../echoMessage';
import debugLog from 'debug';

jest.setTimeout(10_000);

describe('echoMessage', () => {
  // let testEnv: CLITestEnvironment;
  // let echoMessage: typeof import('../echoMessage').echoMessage;

  // beforeEach(async () => {
  //   testEnv = await testingLibrary.prepareEnvironment();
  // });

  // afterEach(async () => {
  //   await testEnv.cleanup();
  // });

  let consoleLog: jest.SpyInstance;
  beforeEach(() => {
    // const info = debugLog.debug('git-pull-run');
    // info.log = console.log.bind(console);
    // consoleError = jest.spyOn(global.console, 'error').mockImplementation(() => { });
    consoleLog = jest.spyOn(global.console, 'log').mockImplementation(() => { });
  });

  test('Print message to console', async () => {
    await echoMessage('Test');

    expect(consoleLog).toHaveBeenCalled();
    expect(consoleLog.mock.calls).toContain('Test');
  });
});
