import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { Task } from '../src/models/task.js';
import { ValidationError } from '../src/utils/validators.js';

describe('Task model', () => {
  test('constructor creates a task from valid values', () => {
    const createdAt = '2024-01-01T00:00:00.000Z';
    const updatedAt = '2024-01-02T00:00:00.000Z';

    const task = new Task({
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Write tests',
      description: 'Add coverage for the service',
      status: 'in-progress',
      priority: 'high',
      createdAt,
      updatedAt,
    });

    assert.equal(task.id, '123e4567-e89b-12d3-a456-426614174000');
    assert.equal(task.title, 'Write tests');
    assert.equal(task.description, 'Add coverage for the service');
    assert.equal(task.status, 'in-progress');
    assert.equal(task.priority, 'high');
    assert.equal(task.createdAt, createdAt);
    assert.equal(task.updatedAt, updatedAt);
  });

  test('createFromInput creates a task with generated defaults', () => {
    const task = Task.createFromInput({
      title: '   Review PR   ',
      description: 'Inspect the patch',
    });

    assert.equal(task.title, 'Review PR');
    assert.equal(task.description, 'Inspect the patch');
    assert.equal(task.status, 'todo');
    assert.equal(task.priority, 'medium');
    assert.match(task.id, /^[0-9a-fA-F-]{4,}$/);
    assert.equal(task.createdAt, task.updatedAt);
  });

  test('createFromInput converts missing description to an empty string', () => {
    const task = Task.createFromInput({ title: 'Draft spec' });
    assert.equal(task.description, '');
  });

  test('createFromInput validates required fields', () => {
    assert.throws(() => Task.createFromInput({ title: '   ' }), ValidationError);
    assert.throws(() => Task.createFromInput({ title: 'Task', description: 42 }), ValidationError);
    assert.throws(() => Task.createFromInput({ title: 'Task', status: 'blocked' }), ValidationError);
  });

  test('createFromInput applies defaults when optional fields are omitted', () => {
    const task = Task.createFromInput({ title: 'Defaults' });

    assert.equal(task.description, '');
    assert.equal(task.status, 'todo');
    assert.equal(task.priority, 'medium');
  });

  test('constructor rejects title and description values beyond supported boundaries', () => {
    const validPayload = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Valid title',
      description: 'Valid description',
      status: 'todo',
      priority: 'medium',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    assert.throws(() => new Task({ ...validPayload, title: 'a'.repeat(101) }), ValidationError);
    assert.throws(() => new Task({ ...validPayload, description: 'x'.repeat(501) }), ValidationError);
  });

  test('constructor rejects type mismatches for ids and dates', () => {
    const validPayload = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Valid title',
      description: 'Valid description',
      status: 'todo',
      priority: 'medium',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    assert.throws(() => new Task({ ...validPayload, id: 7 }), ValidationError);
    assert.throws(() => new Task({ ...validPayload, createdAt: 'not-a-date' }), ValidationError);
    assert.throws(() => new Task({ ...validPayload, updatedAt: null }), ValidationError);
  });

  test('update preserves existing values when optional fields are omitted', () => {
    const task = Task.createFromInput({ title: 'Original', description: 'Preserve me', status: 'todo', priority: 'medium' });

    task.update({ title: 'Updated title' });

    assert.equal(task.title, 'Updated title');
    assert.equal(task.description, 'Preserve me');
    assert.equal(task.status, 'todo');
    assert.equal(task.priority, 'medium');
  });

  test('update changes mutable fields and refreshes updatedAt', () => {
    const task = Task.createFromInput({ title: 'Initial', description: 'Example' });
    const before = task.updatedAt;

    task.update({ title: '  Updated title  ', description: 'New description', status: 'done', priority: 'low' });

    assert.equal(task.title, 'Updated title');
    assert.equal(task.description, 'New description');
    assert.equal(task.status, 'done');
    assert.equal(task.priority, 'low');
    assert.notEqual(task.updatedAt, before);
    assert.ok(new Date(task.updatedAt).getTime() > new Date(task.createdAt).getTime());
  });

  test('update rejects invalid changes', () => {
    const task = Task.createFromInput({ title: 'Initial', description: 'Example' });
    assert.throws(() => task.update({ title: '' }), ValidationError);
    assert.throws(() => task.update({ description: 5 }), ValidationError);
    assert.throws(() => task.update({ priority: 'urgent' }), ValidationError);
  });

  test('clone creates a detached task with a new id', () => {
    const task = Task.createFromInput({ title: 'Clone me', description: 'Shareable copy' });
    const clone = task.clone();

    assert.notEqual(clone.id, task.id);
    assert.equal(clone.title, task.title);
    assert.equal(clone.description, task.description);
    assert.equal(clone.status, task.status);
    assert.equal(clone.priority, task.priority);
    assert.notStrictEqual(clone, task);
  });

  test('toJSON exposes the task as a plain object', () => {
    const task = Task.createFromInput({ title: 'Export', description: 'Value' });
    const json = task.toJSON();

    assert.deepEqual(json, {
      id: task.id,
      title: 'Export',
      description: 'Value',
      status: 'todo',
      priority: 'medium',
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  });
});
