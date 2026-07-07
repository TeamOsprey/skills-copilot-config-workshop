import { beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  clearStore,
  createTask,
  deleteTask,
  findTaskById,
  filterTasks,
  listTasks,
  NotFoundError,
  sortTasks,
  updateTask,
} from '../src/services/taskService.js';

describe('task service', () => {
  beforeEach(() => {
    clearStore();
  });

  test('createTask stores the task and makes it findable by id', () => {
    const task = createTask({ title: 'Ship release', description: 'Deploy the feature' });

    assert.equal(task.title, 'Ship release');
    assert.equal(findTaskById(task.id), task);
    assert.equal(listTasks().length, 1);
  });

  test('listTasks can filter by status, priority, and title content', () => {
    createTask({ title: 'Write docs', description: 'API guide', status: 'done', priority: 'high' });
    createTask({ title: 'Fix bug', description: 'Investigate regression', status: 'in-progress', priority: 'high' });
    createTask({ title: 'Refactor', description: 'Simplify helpers', status: 'todo', priority: 'low' });

    const filtered = listTasks({ filter: { status: 'done', priority: 'high' } });
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].title, 'Write docs');

    const byTitle = listTasks({ filter: { titleContains: 'bug' } });
    assert.equal(byTitle.length, 1);
    assert.equal(byTitle[0].title, 'Fix bug');
  });

  test('listTasks returns an empty array when no tasks match the filters', () => {
    createTask({ title: 'Write docs', description: 'API guide', status: 'done', priority: 'high' });

    const filtered = listTasks({ filter: { status: 'todo' } });
    assert.deepEqual(filtered, []);
  });

  test('listTasks ignores empty or missing filter values', () => {
    createTask({ title: 'Write docs', description: 'API guide', status: 'done', priority: 'high' });

    const filtered = listTasks({ filter: { status: '', titleContains: null } });
    assert.equal(filtered.length, 1);
  });

  test('listTasks can sort results by a supported field', () => {
    createTask({ title: 'Beta', description: '' });
    createTask({ title: 'Alpha', description: '' });

    const sorted = listTasks({ sortBy: 'title:desc' });
    assert.deepEqual(sorted.map((task) => task.title), ['Beta', 'Alpha']);
  });

  test('updateTask updates an existing task and throws when missing', () => {
    const task = createTask({ title: 'Initial', description: 'Before update' });

    const updated = updateTask(task.id, { status: 'done', title: 'Updated task' });

    assert.equal(updated.status, 'done');
    assert.equal(updated.title, 'Updated task');
    assert.equal(findTaskById(task.id).title, 'Updated task');
    assert.throws(() => updateTask('missing-id', { title: 'Nope' }), NotFoundError);
  });

  test('createTask rejects duplicate ids', () => {
    const first = createTask({ title: 'First', description: 'Original', id: '123e4567-e89b-12d3-a456-426614174000' });

    assert.throws(() => createTask({ title: 'Second', description: 'Duplicate', id: first.id }), /already exists/);
  });

  test('deleteTask removes an existing task and throws when missing', () => {
    const task = createTask({ title: 'Delete me', description: 'Temporary' });

    assert.equal(deleteTask(task.id), true);
    assert.equal(findTaskById(task.id), null);
    assert.throws(() => deleteTask(task.id), NotFoundError);
  });

  test('filterTasks and sortTasks work directly with task arrays', () => {
    const first = createTask({ title: 'Zeta', description: '', priority: 'high' });
    const second = createTask({ title: 'Alpha', description: '', priority: 'low' });

    const filtered = filterTasks([first, second], { priority: 'high' });
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].title, 'Zeta');

    const sorted = sortTasks([first, second], 'title:asc');
    assert.deepEqual(sorted.map((task) => task.title), ['Alpha', 'Zeta']);
  });

  test('filterTasks handles empty arrays and missing filter values', () => {
    const filtered = filterTasks([], { priority: 'high' });
    assert.deepEqual(filtered, []);

    const withMissing = filterTasks([{ title: 'A', status: 'todo', priority: 'low' }], { titleContains: undefined });
    assert.equal(withMissing.length, 1);
  });

  test('sortTasks handles empty arrays and unknown fields', () => {
    assert.deepEqual(sortTasks([], 'title:asc'), []);
    assert.deepEqual(sortTasks([{ title: 'B' }, { title: 'A' }], 'unknown:desc').map((task) => task.title), ['B', 'A']);
  });

  test('clearStore empties the in-memory store', () => {
    createTask({ title: 'Temporary', description: 'One-off' });
    clearStore();

    assert.equal(listTasks().length, 0);
  });
});
