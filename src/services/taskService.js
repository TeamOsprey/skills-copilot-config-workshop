import { Task } from '../models/task.js';
import { ValidationError } from '../utils/validators.js';

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// In-memory store: Map<id, Task>
const tasks = new Map();

/**
 * Create a task from input and store it.
 * @param {Object} input
 * @returns {Task}
 */
function createTask(input) {
  const task = Task.createFromInput(input);
  if (tasks.has(task.id)) throw new ValidationError('Task with this id already exists');
  tasks.set(task.id, task);
  return task;
}

/**
 * List tasks with optional filtering and sorting options.
 * @param {Object} options
 */
function listTasks(options = {}) {
  let arr = Array.from(tasks.values());
  if (options.filter) arr = filterTasks(arr, options.filter);
  if (options.sortBy) arr = sortTasks(arr, options.sortBy);
  return arr;
}

function findTaskById(id) {
  return tasks.get(id) || null;
}

function updateTask(id, updates) {
  const existing = tasks.get(id);
  if (!existing) throw new NotFoundError(`Task not found: ${id}`);
  existing.update(updates);
  tasks.set(id, existing);
  return existing;
}

function deleteTask(id) {
  if (!tasks.has(id)) throw new NotFoundError(`Task not found: ${id}`);
  tasks.delete(id);
  return true;
}

/**
 * Filter tasks by supported fields: status, priority, titleContains
 */
function filterTasks(taskArray, filters = {}) {
  return taskArray.filter((t) => {
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.titleContains && !t.title.toLowerCase().includes(String(filters.titleContains).toLowerCase())) return false;
    return true;
  });
}

/**
 * Sort tasks by `createdAt`, `updatedAt`, `priority`, or `title`.
 * Accepts string like 'createdAt:asc' or 'title:desc'. Default asc.
 */
function sortTasks(taskArray, sortBy) {
  const [field, dir = 'asc'] = String(sortBy).split(':');
  const multiplier = dir === 'desc' ? -1 : 1;
  const sorted = taskArray.slice().sort((a, b) => {
    const va = a[field];
    const vb = b[field];
    if (va === vb) return 0;
    return va > vb ? multiplier : -multiplier;
  });
  return sorted;
}

function clearStore() {
  tasks.clear();
}

export {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
  findTaskById,
  filterTasks,
  sortTasks,
  clearStore,
  NotFoundError,
};
