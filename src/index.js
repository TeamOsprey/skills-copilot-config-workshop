import {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
  findTaskById,
  NotFoundError,
} from './services/taskService.js';
import { colorStatus, colorPriority } from './utils/colors.js';

function toDisplayTask(task) {
  const plainTask = typeof task?.toJSON === 'function' ? task.toJSON() : task;
  return {
    ...plainTask,
    status: colorStatus(plainTask.status),
    priority: colorPriority(plainTask.priority),
  };
}

function toDisplayTasks(tasks) {
  return tasks.map((task) => toDisplayTask(task));
}

async function runDemo() {
  console.log('Task Manager demo starting...');

  try {
    const t1 = createTask({ title: 'Buy groceries', description: 'Milk, eggs, bread', priority: 'high' });
    const t2 = createTask({ title: 'Read book', description: '', priority: 'low' });
    const t3 = createTask({ title: 'Write report', description: 'Quarterly results', status: 'in-progress' });

    console.log('\nCreated tasks:');
    console.log(toDisplayTask(t1));
    console.log(toDisplayTask(t2));
    console.log(toDisplayTask(t3));

    console.log('\nClone a task (t1):');
    console.log(toDisplayTask(t1.clone()));

    console.log('\nAll tasks:');
    console.log(toDisplayTasks(listTasks()));

    console.log('\nFilter tasks (priority=high):');
    console.log(toDisplayTasks(listTasks({ filter: { priority: 'high' } })));

    console.log('\nUpdate task status:');
    const updated = updateTask(t1.id, { status: 'done' });
    console.log(toDisplayTask(updated));

    console.log('\nFind by id:');
    console.log(toDisplayTask(findTaskById(t1.id)));

    console.log('\nDelete a task (t2):');
    deleteTask(t2.id);
    console.log('Deleted', t2.id);

    console.log('\nFinal tasks sorted by createdAt desc:');
    console.log(toDisplayTasks(listTasks({ sortBy: 'createdAt:desc' })));

    // demonstrate error handling
    try {
      updateTask('non-existent-id', { title: 'won\'t work' });
    } catch (err) {
      if (err instanceof NotFoundError) console.error('Error:', err.message);
      else throw err;
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exitCode = 1;
  }

  console.log('\nDemo complete.');
}

runDemo();
