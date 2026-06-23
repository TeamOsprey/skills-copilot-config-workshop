import { randomUUID } from 'crypto';
import {
  isString,
  isNonEmptyString,
  isLengthBetween,
  isValidStatus,
  isValidPriority,
  isISODateString,
  isValidId,
  ValidationError,
} from '../utils/validators.js';

function validateTaskPayload(payload, { creating = true, requireId = false, requireDates = false } = {}) {
  if (creating) {
    if (!payload || typeof payload !== 'object') {
      throw new ValidationError('Payload is required');
    }
  }

  if (requireId || payload?.id !== undefined || creating) {
    if (!isValidId(payload.id)) {
      throw new ValidationError('id must be a valid identifier');
    }
  }

  if (creating || payload.title !== undefined) {
    if (!isNonEmptyString(payload.title)) {
      throw new ValidationError('title is required and must be non-empty (1..100 chars)');
    }
    if (!isLengthBetween(payload.title, 1, 100)) {
      throw new ValidationError('title length must be 1..100 characters');
    }
  }

  if (creating || payload.description !== undefined) {
    if (payload.description === undefined || payload.description === null) {
      throw new ValidationError('description must be defined (may be empty string)');
    }
    if (!isString(payload.description)) {
      throw new ValidationError('description must be a string');
    }
    if (payload.description.length > 500) {
      throw new ValidationError('description max length is 500 characters');
    }
  }

  if (payload.status !== undefined && !isValidStatus(payload.status)) {
    throw new ValidationError('status must be one of: todo, in-progress, done');
  }

  if (payload.priority !== undefined && !isValidPriority(payload.priority)) {
    throw new ValidationError('priority must be one of: low, medium, high');
  }

  if (requireDates || payload.createdAt !== undefined) {
    if (!isISODateString(payload.createdAt)) {
      throw new ValidationError('createdAt must be a valid ISO date string');
    }
  }

  if (requireDates || payload.updatedAt !== undefined) {
    if (!isISODateString(payload.updatedAt)) {
      throw new ValidationError('updatedAt must be a valid ISO date string');
    }
  }

  if (requireDates && payload.createdAt !== undefined && payload.updatedAt !== undefined) {
    if (new Date(payload.updatedAt) < new Date(payload.createdAt)) {
      throw new ValidationError('updatedAt must not be earlier than createdAt');
    }
  }
}

/**
 * Represents a Task entity with validation and update helpers.
 */
class Task {
  /**
   * Create a Task instance. Use `Task.createFromInput` for typical creation.
   * @param {Object} options
   * @param {string} options.id
   * @param {string} options.title
   * @param {string} options.description
   * @param {string} options.status
   * @param {string} options.priority
   * @param {string} options.createdAt
   * @param {string} options.updatedAt
   */
  constructor({ id, title, description, status, priority, createdAt, updatedAt }) {
    validateTaskPayload(
      { id, title, description, status, priority, createdAt, updatedAt },
      { creating: false, requireId: true, requireDates: true },
    );

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

  /**
   * Return a plain object representation of the task.
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export { Task };
