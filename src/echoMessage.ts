import debugLog from 'debug';
import { info } from './index.js';

const debug = debugLog('git-pull-run:echoMessage');
// const info = debugLog.debug('git-pull-run');
// info.log = console.log.bind(console);

// debugLog.enable('git-pull-run*');

export async function echoMessage(message: string) {
  debug(`Echo '${message}'`);

  // TODO support formatting and placeholders
  info(message);
}
