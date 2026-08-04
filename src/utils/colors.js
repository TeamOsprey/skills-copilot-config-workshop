import chalk from 'chalk';
import { isValidStatus, isValidPriority } from './validators.js';

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
  if (!isValidStatus(status)) {
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
  if (!isValidPriority(priority)) {
    throw new TypeError('priority must be one of: low, medium, high');
  }

  if (priority === 'high') return chalk.bold.red(priority);
  if (priority === 'medium') return chalk.bold.yellow(priority);
  return chalk.dim(priority);
}

/**
 * Format a task as a human-readable multi-line string with colorized status and priority.
 *
 * @param {object} task - A Task instance or plain task object.
 * @returns {string} Multi-line formatted string ready for terminal output.
 * @throws {TypeError} If `task` is not an object.
 * @example
 * formatTask(createTask({ title: 'Buy milk', priority: 'low' }));
 * @example
 * formatTask({ id: '1', title: 'Read', status: 'done', priority: 'high', description: '', createdAt: '...', updatedAt: '...' });
 */
function formatTask(task) {
  if (!task || typeof task !== 'object') {
    throw new TypeError('task must be an object');
  }
  const plain = typeof task.toJSON === 'function' ? task.toJSON() : task;
  const lines = [
    `[${plain.id}] ${plain.title}`,
    `  Status:      ${colorStatus(plain.status)}`,
    `  Priority:    ${colorPriority(plain.priority)}`,
    `  Description: ${plain.description || '(none)'}`,
    `  Created:     ${plain.createdAt}`,
    `  Updated:     ${plain.updatedAt}`,
  ];
  return lines.join('\n');
}

/**
 * Format an array of tasks as a human-readable string with each task separated by a blank line.
 *
 * @param {object[]} tasks - Array of Task instances or plain task objects.
 * @returns {string} Formatted string ready for terminal output.
 * @throws {TypeError} If `tasks` is not an array.
 * @example
 * formatTasks(listTasks());
 * @example
 * formatTasks([]);
 */
function formatTasks(tasks) {
  if (!Array.isArray(tasks)) {
    throw new TypeError('tasks must be an array');
  }
  if (tasks.length === 0) return '(no tasks)';
  return tasks.map(formatTask).join('\n\n');
}

export { colorStatus, colorPriority, formatTask, formatTasks };