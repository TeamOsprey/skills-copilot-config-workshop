import { randomUUID } from 'crypto';
import {
  validateTaskPayload,
  isISODateString,
  isValidId,
  ValidationError,
} from '../utils/validators.js';

/**
 * Represents a Task entity with validation and update helpers.
 */
class Task {
  /**
   * Create a Task instance. Use `Task.createFromInput` for typical creation.
   */
  constructor({ id, title, description, status, priority, createdAt, updatedAt }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Build and validate a Task from user input for creation.
   * @param {Object} input
   */
  static createFromInput(input = {}) {
    validateTaskPayload(input, { creating: true });

    const now = new Date().toISOString();
    const id = input.id && isValidId(input.id) ? input.id : randomUUID();
    const status = input.status || 'todo';
    const priority = input.priority || 'medium';

    return new Task({
      id,
      title: input.title.trim(),
      description: String(input.description || ''),
      status,
      priority,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Update mutable fields on the task with validation.
   * @param {Object} updates
   */
  update(updates = {}) {
    validateTaskPayload(updates, { creating: false });

    if (updates.title !== undefined) this.title = updates.title.trim();
    if (updates.description !== undefined) this.description = String(updates.description);
    if (updates.status !== undefined) this.status = updates.status;
    if (updates.priority !== undefined) this.priority = updates.priority;

    const now = new Date().toISOString();
    // ensure updatedAt is not earlier than createdAt
    if (!isISODateString(this.createdAt)) throw new ValidationError('createdAt is malformed');
    this.updatedAt = now;
  }
}

export { Task };
