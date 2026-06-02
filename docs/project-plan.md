# Task Manager CLI Project Plan

## Project overview
Create a small Task Manager CLI application using in-memory storage and only built-in Node.js modules with no external dependencies. The app will let users create, list, update, delete, filter, and sort tasks while persisting state only for the lifetime of the process.

## User stories
1. As a user, I want to create a new task so I can track work items.
   - Acceptance criteria:
     - The CLI accepts title, description, status, and priority.
     - A createdAt and updatedAt timestamp are generated automatically.
     - The task is stored in memory and available for later commands.

2. As a user, I want to list all tasks so I can see my current workload.
   - Acceptance criteria:
     - The CLI prints a table or list of tasks.
     - Each task shows title, description, status, priority, createdAt, and updatedAt.
     - Tasks are returned in a stable order by default.

3. As a user, I want to update a task so I can change its status or priority.
   - Acceptance criteria:
     - The CLI supports updating title, description, status, and priority.
     - updatedAt is refreshed when a task changes.
     - The task remains accessible after modification.

4. As a user, I want to delete a task so I can remove completed or irrelevant items.
   - Acceptance criteria:
     - The CLI supports deleting a task by its identifier.
     - Deleted tasks are removed from in-memory storage.
     - The CLI confirms successful deletion.

5. As a user, I want to filter tasks by status or priority so I can focus on relevant work.
   - Acceptance criteria:
     - The CLI accepts a status filter for todo, in-progress, or done.
     - The CLI accepts a priority filter for low, medium, or high.
     - Filtered output contains only matching tasks.

6. As a user, I want to sort tasks by priority or creation date so I can order items by importance or recency.
   - Acceptance criteria:
     - The CLI supports sorting by priority and createdAt.
     - Output order reflects the selected sort option.
     - Ties preserve a consistent secondary order.

## Data model
- Task
  - id: string
  - title: string
  - description: string
  - status: "todo" | "in-progress" | "done"
  - priority: "low" | "medium" | "high"
  - createdAt: string
  - updatedAt: string

## File structure
- src/
  - index.js
  - cli.js
  - taskStore.js
  - taskService.js
  - taskFormatter.js
- docs/
  - project-plan.md

## Implementation phases
1. Setup and CLI skeleton
   - Initialize the project folder and create `src/index.js`.
   - Build basic command parsing in `src/cli.js`.

2. Task model and in-memory storage
   - Implement `Task` shape and helper functions.
   - Add `taskStore.js` to hold tasks in memory.

3. Create, list, update, delete operations
   - Implement create, list, update, and delete handlers in `taskService.js`.
   - Wire handlers into `cli.js`.

4. Filtering and sorting
   - Add filters by status and priority.
   - Add sort options for priority and createdAt.

5. Output formatting and validation
   - Implement readable CLI output in `taskFormatter.js`.
   - Add input validation for task fields and command arguments.

6. Error handling and validation conventions
   - Define clear validation rules for required fields and allowed values.
   - Use consistent CLI error messages with a prefix like `Error:`.
   - Exit with a non-zero status code on invalid input.
   - Handle missing or malformed task IDs and report user-friendly guidance.
   - Guard against invalid sort/filter values and list accepted options.
