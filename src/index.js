import {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
  findTaskById,
  NotFoundError,
} from './services/taskService.js';

async function runDemo() {
  console.log('Task Manager demo starting...');

  try {
    const t1 = createTask({ title: 'Buy groceries', description: 'Milk, eggs, bread', priority: 'high' });
    const t2 = createTask({ title: 'Read book', description: '', priority: 'low' });
    const t3 = createTask({ title: 'Write report', description: 'Quarterly results', status: 'in-progress' });

    console.log('\nCreated tasks:');
    console.log(t1);
    console.log(t2);
    console.log(t3);

    console.log('\nAll tasks:');
    console.log(listTasks());

    console.log('\nFilter tasks (priority=high):');
    console.log(listTasks({ filter: { priority: 'high' } }));

    console.log('\nUpdate task status:');
    const updated = updateTask(t1.id, { status: 'done' });
    console.log(updated);

    console.log('\nFind by id:');
    console.log(findTaskById(t1.id));

    console.log('\nDelete a task (t2):');
    deleteTask(t2.id);
    console.log('Deleted', t2.id);

    console.log('\nFinal tasks sorted by createdAt desc:');
    console.log(listTasks({ sortBy: 'createdAt:desc' }));

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
