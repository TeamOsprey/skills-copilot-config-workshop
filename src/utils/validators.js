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

export {
  ValidationError,
  isString,
  isNonEmptyString,
  isLengthBetween,
  isValidStatus,
  isValidPriority,
  isISODateString,
  isValidId,
};
