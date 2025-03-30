import { parse, resolve } from 'node:path';
import debugLog from 'debug';

const debug = debugLog('git-pull-run:getAbsolutePath');

export function getAbsolutePath(baseDir: string, path: string) {
  const { dir: relativeDir, base: file } = parse(path);
  const absoluteDir = resolve(baseDir, relativeDir);
  debug(`Absolute path resolved: ${absoluteDir}`);

  return { directory: absoluteDir, file };
}
