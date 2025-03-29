import { dim, green } from 'colorette';
import { Listr } from 'listr2';
import type { ListrTask } from 'listr2';
import { getAbsolutePath } from './getAbsolutePath.js';
import { getChanges } from './getChanges.js';
import { getGitDirectory } from './getGitDirectory.js';
import { runCommand } from './runCommand.js';
import { runScript } from './runScript.js';

export type Options = {
  pattern: string;
  message: string;
  command: string;
  script: string;
  debug: boolean;
  once: boolean;
};

export type Context = {
  gitDir: string;
  changes: string[];
};

export async function gitPullRun({
  pattern,
  message,
  command,
  script,
  once,
}: Options): Promise<void> {
  const runner = new Listr<Context>(
    [
      {
        title: 'Preparing git-pull-run...',
        task: async (ctx, task) => {
          task.output = 'Preparing git-pull-run...';
          ctx.gitDir = await getGitDirectory();

          task.output = `Collecting changes for ${green(pattern)}...`;
          ctx.changes = await getChanges(pattern);

          task.output =
            ctx.changes.length > 0
              ? `Found ${ctx.changes.length} ${ctx.changes.length === 1 ? 'change' : 'changes'} for ${green(pattern)}`
              : `No relevant changes for ${green(pattern)}`;
        },
        options: { persistentOutput: true },
      },
      {
        title: message,
        task: async (ctx, task) => {},
        options: { persistentOutput: true },
        enabled: (ctx) =>
          !!message &&
          message.length > 0 &&
          ctx.changes &&
          ctx.changes.length > 0,
      },
      {
        title: 'Running tasks...',
        task: (ctx, task): Listr => {
          const createTasks = (directory: string): ListrTask => ({
            title: `${dim(directory)}`,
            task: async (ctx, task) =>
              task.newListr([
                {
                  title: `${green(command)}`,
                  task: () => runCommand(command, directory),
                  enabled: () => !!command,
                },
                {
                  title: `npm run ${green(script)}`,
                  task: () => runScript(script, directory),
                  enabled: () => !!script,
                },
              ]),
          });

          const subtasks = once
            ? [createTasks(ctx.gitDir)]
            : ctx.changes.map<ListrTask>((change) => {
                const { directory } = getAbsolutePath(ctx.gitDir, change);

                return createTasks(directory);
              });

          return task.newListr([...subtasks], {
            concurrent: true,
            rendererOptions: { collapse: false },
          });
        },
        enabled: (ctx) =>
          (!!command || !!script) && ctx.changes && ctx.changes.length > 0,
        options: { persistentOutput: true },
      },
    ],
    { concurrent: false },
  );

  await runner.run();
}
