import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ValidationError,
  isString,
  isNonEmptyString,
  isLengthBetween,
  isValidStatus,
  isValidPriority,
  isISODateString,
  isValidId,
} from '../src/utils/validators.js';

describe('validators', () => {
  test('isString recognizes strings and String objects', () => {
    assert.equal(isString('hello'), true);
    assert.equal(isString(new String('hello')), true);
    assert.equal(isString(42), false);
    assert.equal(isString(null), false);
    assert.equal(isString(undefined), false);
  });

  test('isNonEmptyString rejects empty or whitespace-only values', () => {
    assert.equal(isNonEmptyString('task'), true);
    assert.equal(isNonEmptyString('   task   '), true);
    assert.equal(isNonEmptyString(''), false);
    assert.equal(isNonEmptyString('   '), false);
    assert.equal(isNonEmptyString(7), false);
    assert.equal(isNonEmptyString({}), false);
  });

  test('isLengthBetween respects trimmed length bounds', () => {
    assert.equal(isLengthBetween('hello', 2, 10), true);
    assert.equal(isLengthBetween('  hi  ', 2, 10), true);
    assert.equal(isLengthBetween('  long title  ', 1, 5), false);
    assert.equal(isLengthBetween(12, 1, 5), false);
    assert.equal(isLengthBetween('a'.repeat(100), 1, 10), false);
  });

  test('isValidStatus only accepts supported values', () => {
    assert.equal(isValidStatus('todo'), true);
    assert.equal(isValidStatus('in-progress'), true);
    assert.equal(isValidStatus('done'), true);
    assert.equal(isValidStatus('blocked'), false);
    assert.equal(isValidStatus(42), false);
  });

  test('isValidPriority only accepts supported values', () => {
    assert.equal(isValidPriority('low'), true);
    assert.equal(isValidPriority('medium'), true);
    assert.equal(isValidPriority('high'), true);
    assert.equal(isValidPriority('urgent'), false);
    assert.equal(isValidPriority(null), false);
  });

  test('isISODateString validates ISO-8601 timestamps', () => {
    assert.equal(isISODateString('2024-01-02T03:04:05.000Z'), true);
    assert.equal(isISODateString('2024-01-02'), false);
    assert.equal(isISODateString('not-a-date'), false);
    assert.equal(isISODateString(new Date('2024-01-02T03:04:05.000Z')), false);
  });

  test('isValidId accepts UUID-like strings', () => {
    assert.equal(isValidId('123e4567-e89b-12d3-a456-426614174000'), true);
    assert.equal(isValidId('123e4567e89b12d3a456426614174000'), true);
    assert.equal(isValidId('   '), false);
    assert.equal(isValidId('abc'), false);
    assert.equal(isValidId(12345), false);
  });

  test('ValidationError preserves the provided message', () => {
    const error = new ValidationError('Bad input');
    assert.equal(error.name, 'ValidationError');
    assert.equal(error.message, 'Bad input');
  });
});
