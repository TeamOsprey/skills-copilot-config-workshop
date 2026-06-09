# Task Manager Schema

## Data models

Task
- id: string
  - required
  - generated automatically when a task is created
  - unique identifier for task operations
  - validation: must be a non-empty UUID-style string or unique opaque string
- title: string
  - required
  - non-empty
  - validation: trimmed length must be 1..100 characters
  - used for task display and identification
- description: string
  - required
  - may be empty, but should always be defined
  - validation: must be a string; allow empty string; max length 500 characters
- status: string
  - required
  - allowed values: "todo", "in-progress", "done"
  - validation: must exactly match one of the allowed values
  - default: "todo" when creating a new task
- priority: string
  - required
  - allowed values: "low", "medium", "high"
  - validation: must exactly match one of the allowed values
  - default: "medium" when creating a new task
- createdAt: string
  - required
  - ISO 8601 timestamp generated at creation
  - validation: must be a valid ISO 8601 date-time string
- updatedAt: string
  - required
  - ISO 8601 timestamp updated on every modification
  - validation: must be a valid ISO 8601 date-time string and equal or later than createdAt

## File structure

- src/
  - index.js - application entry point and CLI command bootstrap
  - cli.js - parse command-line arguments and route commands
  - taskStore.js - in-memory storage and persistence helpers for the current process
  - taskService.js - business logic for creating, listing, updating, deleting, filtering, and sorting tasks
  - taskFormatter.js - presentation layer for formatting task output to the terminal
- docs/
  - project-plan.md - project requirements and implementation plan
  - schema.md - data schema, file structure, module responsibilities, and error handling strategy

## Module responsibilities

index.js
- exports: none
- responsibility: initialize the CLI and invoke `cli.js`
- dependencies: `./cli.js`

cli.js
- exports: `runCli(args)` or equivalent function
- responsibility: parse CLI arguments, validate command structure, and dispatch commands to `taskService.js`
- dependencies: `./taskService.js`, `./taskFormatter.js`

taskStore.js
- exports: functions to access and modify the in-memory task list, such as `getTasks()`, `addTask(task)`, `updateTask(id, updates)`, `deleteTask(id)`, and `findTaskById(id)`
- responsibility: maintain the task collection for the process lifetime and provide a single source of truth for task data
- dependencies: none (pure in-memory storage)

taskService.js
- exports: task operations: `createTask(input)`, `listTasks(options)`, `updateTask(id, updates)`, `deleteTask(id)`, `filterTasks(tasks, filters)`, `sortTasks(tasks, sortBy)`
- responsibility: implement business rules, validation, timestamp updates, filtering, and sorting
- dependencies: `./taskStore.js`

taskFormatter.js
- exports: formatting helpers such as `formatTask(task)`, `formatTaskList(tasks)`, `formatError(message)`
- responsibility: convert task objects and results into terminal-friendly text output
- dependencies: none or minimal formatting utilities

## Error handling strategy

Error types
- ValidationError
  - thrown when required task fields are missing or invalid
  - covers invalid `status`, invalid `priority`, missing `title`, and malformed command arguments
- NotFoundError
  - thrown when a task ID does not match any existing task
- CliError
  - thrown when the CLI receives an unknown command or invalid command syntax

Error handling locations
- `cli.js`
  - validate high-level command arguments
  - catch thrown errors from `taskService.js`
  - print user-friendly error messages with a prefix like `Error:`
  - exit with a non-zero status code on invalid input
- `taskService.js`
  - validate task payloads and command options
  - enforce allowed values for `status` and `priority`
  - refresh `updatedAt` when task changes
- `taskStore.js`
  - report missing tasks when update/delete operations target an unknown ID

Conventions
- Use consistent validation rules for required fields and allowed values
- Output CLI errors using a clear prefix: `Error:`
- Exit with a non-zero status code for invalid user input or failed operations
- Provide the accepted options when a filter or sort value is invalid
- Treat storage as process-local only; no persistence beyond runtime
