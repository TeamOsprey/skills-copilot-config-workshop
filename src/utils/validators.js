import { strict as assert } from 'assert';

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

const STATUSES = new Set(['todo', 'in-progress', 'done']);
const PRIORITIES = new Set(['low', 'medium', 'high']);

function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

function isNonEmptyString(value) {
  return isString(value) && value.trim().length > 0;
}

function isLengthBetween(value, min, max) {
  if (!isString(value)) return false;
  const len = value.trim().length;
  return len >= min && len <= max;
}

function isValidStatus(value) {
  return STATUSES.has(value);
}

function isValidPriority(value) {
  return PRIORITIES.has(value);
}

function isISODateString(value) {
  if (!isString(value)) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime()) && d.toISOString() === value;
}

function isValidId(value) {
  if (!isString(value)) return false;
  // simple UUID-ish check or opaque non-empty string
  const uuidRegex = /^[0-9a-fA-F-]{4,}$/;
  return value.trim().length > 0 && uuidRegex.test(value);
}

/**
 * Validate task payload for creation or update.
 * Throws ValidationError on failure.
 */
function validateTaskPayload(payload, { creating = true } = {}) {
  if (creating) {
    if (!payload) throw new ValidationError('Payload is required');
    if (!isNonEmptyString(payload.title)) throw new ValidationError('title is required and must be non-empty (1..100 chars)');
    if (!isLengthBetween(payload.title, 1, 100)) throw new ValidationError('title length must be 1..100 characters');
    if (payload.description === undefined || payload.description === null) throw new ValidationError('description must be defined (may be empty string)');
    if (!isString(payload.description)) throw new ValidationError('description must be a string');
    if (payload.description.length > 500) throw new ValidationError('description max length is 500 characters');
    if (payload.status !== undefined && !isValidStatus(payload.status)) throw new ValidationError(`status must be one of: ${Array.from(STATUSES).join(', ')}`);
    if (payload.priority !== undefined && !isValidPriority(payload.priority)) throw new ValidationError(`priority must be one of: ${Array.from(PRIORITIES).join(', ')}`);
  } else {
    // updating: only validate fields that are present
    if (payload.title !== undefined) {
      if (!isNonEmptyString(payload.title)) throw new ValidationError('title must be non-empty when provided');
      if (!isLengthBetween(payload.title, 1, 100)) throw new ValidationError('title length must be 1..100 characters');
    }
    if (payload.description !== undefined) {
      if (!isString(payload.description)) throw new ValidationError('description must be a string');
      if (payload.description.length > 500) throw new ValidationError('description max length is 500 characters');
    }
    if (payload.status !== undefined && !isValidStatus(payload.status)) throw new ValidationError(`status must be one of: ${Array.from(STATUSES).join(', ')}`);
    if (payload.priority !== undefined && !isValidPriority(payload.priority)) throw new ValidationError(`priority must be one of: ${Array.from(PRIORITIES).join(', ')}`);
  }
}

export {
  ValidationError,
  isString,
  isNonEmptyString,
  isLengthBetween,
  isValidStatus,
  isValidPriority,
  isISODateString,
  isValidId,
  validateTaskPayload,
};
