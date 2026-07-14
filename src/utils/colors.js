import chalk from 'chalk';

const ALLOWED_STATUSES = new Set(['todo', 'in-progress', 'done']);
const ALLOWED_PRIORITIES = new Set(['low', 'medium', 'high']);

/**
 * Color a task status for terminal output.
 *
 * @param {string} status - One of: todo, in-progress, done.
 * @returns {string} Colorized status label.
 * @throws {TypeError} If `status` is not a string or is not a supported value.
 * @example
 * colorStatus('done');
 * @example
 * colorStatus('in-progress');
 */
function colorStatus(status) {
  if (typeof status !== 'string') {
    throw new TypeError('status must be a string');
  }
  if (!ALLOWED_STATUSES.has(status)) {
    throw new TypeError('status must be one of: todo, in-progress, done');
  }

  if (status === 'done') return chalk.green(status);
  if (status === 'in-progress') return chalk.yellow(status);
  return chalk.red(status);
}

/**
 * Color a task priority for terminal output.
 *
 * @param {string} priority - One of: low, medium, high.
 * @returns {string} Colorized priority label.
 * @throws {TypeError} If `priority` is not a string or is not a supported value.
 * @example
 * colorPriority('high');
 * @example
 * colorPriority('low');
 */
function colorPriority(priority) {
  if (typeof priority !== 'string') {
    throw new TypeError('priority must be a string');
  }
  if (!ALLOWED_PRIORITIES.has(priority)) {
    throw new TypeError('priority must be one of: low, medium, high');
  }

  if (priority === 'high') return chalk.bold.red(priority);
  if (priority === 'medium') return chalk.bold.yellow(priority);
  return chalk.dim(priority);
}

export { colorStatus, colorPriority };