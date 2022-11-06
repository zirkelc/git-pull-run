import debugLog from 'debug';
import { parse, resolve } from 'path';

const debug = debugLog('git-pull-run:getAbsolutePath');

export function getAbsolutePath(baseDir: string, path: string) {
  const { dir: relativeDir, base: file } = parse(path);
  const absoluteDir = resolve(baseDir, relativeDir);
  debug(`Absolute path resolved: ${absoluteDir}`);

  return { directory: absoluteDir, file };
}
