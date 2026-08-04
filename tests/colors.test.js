import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { colorStatus, colorPriority, formatTask, formatTasks } from '../src/utils/colors.js';

const ANSI_ESCAPE = '\x1b[';

/** Minimal plain task fixture. */
const makeTask = (overrides = {}) => ({
  id: 'abc-123',
  title: 'Test task',
  description: 'A description',
  status: 'todo',
  priority: 'medium',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z',
  ...overrides,
});

describe('colorStatus', () => {
  test('returns a string containing an ANSI escape for each valid status', () => {
    for (const status of ['todo', 'in-progress', 'done']) {
      const result = colorStatus(status);
      assert.equal(typeof result, 'string', `colorStatus('${status}') should return a string`);
      assert.ok(
        result.includes(ANSI_ESCAPE),
        `colorStatus('${status}') must embed real ANSI escapes, not literal text`,
      );
      assert.ok(result.includes(status), `colorStatus('${status}') must include the status label`);
    }
  });

  test('throws TypeError for invalid status', () => {
    assert.throws(() => colorStatus('blocked'), TypeError);
    assert.throws(() => colorStatus(42), TypeError);
  });
});

describe('colorPriority', () => {
  test('returns a string containing an ANSI escape for each valid priority', () => {
    for (const priority of ['low', 'medium', 'high']) {
      const result = colorPriority(priority);
      assert.equal(typeof result, 'string', `colorPriority('${priority}') should return a string`);
      assert.ok(
        result.includes(ANSI_ESCAPE),
        `colorPriority('${priority}') must embed real ANSI escapes, not literal text`,
      );
      assert.ok(result.includes(priority), `colorPriority('${priority}') must include the priority label`);
    }
  });

  test('throws TypeError for invalid priority', () => {
    assert.throws(() => colorPriority('urgent'), TypeError);
    assert.throws(() => colorPriority(null), TypeError);
  });
});

describe('formatTask', () => {
  test('returns a multi-line string', () => {
    const output = formatTask(makeTask());
    assert.equal(typeof output, 'string');
    assert.ok(output.includes('\n'), 'output should span multiple lines');
  });

  test('includes the task title and id', () => {
    const task = makeTask({ id: 'id-99', title: 'My important task' });
    const output = formatTask(task);
    assert.ok(output.includes('id-99'), 'output must contain the task id');
    assert.ok(output.includes('My important task'), 'output must contain the task title');
  });

  test('contains real ANSI escape codes for status — not literal escape text', () => {
    const output = formatTask(makeTask({ status: 'done', priority: 'high' }));
    assert.ok(
      output.includes(ANSI_ESCAPE),
      'formatted output must contain real ANSI escape sequences',
    );
    assert.ok(
      !output.includes('\\x1b') && !output.includes('\\u001b'),
      'formatted output must not contain literal escape-sequence text',
    );
  });

  test('contains real ANSI escape codes for priority', () => {
    const output = formatTask(makeTask({ priority: 'low' }));
    assert.ok(
      output.includes(ANSI_ESCAPE),
      'formatted output must contain real ANSI escape sequences for priority',
    );
  });

  test('calls toJSON on task instances that expose it', () => {
    const task = {
      ...makeTask(),
      toJSON() {
        return { ...makeTask({ title: 'From toJSON' }) };
      },
    };
    const output = formatTask(task);
    assert.ok(output.includes('From toJSON'), 'formatTask must use toJSON when available');
  });

  test('throws TypeError when task is not an object', () => {
    assert.throws(() => formatTask(null), TypeError);
    assert.throws(() => formatTask('string'), TypeError);
    assert.throws(() => formatTask(42), TypeError);
  });
});

describe('formatTasks', () => {
  test('returns "(no tasks)" for an empty array', () => {
    assert.equal(formatTasks([]), '(no tasks)');
  });

  test('formats multiple tasks separated by blank lines', () => {
    const tasks = [makeTask({ id: '1', title: 'First' }), makeTask({ id: '2', title: 'Second' })];
    const output = formatTasks(tasks);
    assert.ok(output.includes('First'), 'output must include first task title');
    assert.ok(output.includes('Second'), 'output must include second task title');
    assert.ok(output.includes('\n\n'), 'tasks should be separated by a blank line');
  });

  test('throws TypeError when argument is not an array', () => {
    assert.throws(() => formatTasks(null), TypeError);
    assert.throws(() => formatTasks({}), TypeError);
  });
});
