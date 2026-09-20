# TickTick Changelog

## [Windows Support] - 2026-09-20

- Upgraded to `@raycast/api` 2.x, which is the version that supports the Raycast desktop app on Windows (the CLI now needs Node.js 22.22.2+)
- Added a `postinstall` workaround for an `@raycast/api` 2.x bug that fails the build for AI tools with array-typed inputs
- Added Windows to the extension's supported platforms
- Every keyboard shortcut is now declared per platform, so ⌘ bindings map to `Ctrl` on Windows
- The Menu Bar command stays macOS only — Raycast has no menu bar commands on Windows. Overdue and urgent alerts still reach Windows users as toasts when a view command opens

## [AI Tools] - 2026-08-07

- Manage TickTick from Raycast AI with tools for tasks, projects, habits, Pomodoro, smart lists, comments, and profile
- Create, update, complete, reopen, move, search, and delete tasks (including batch operations)
- Check in or undo habits, and start, pause, resume, or reset Pomodoro sessions
- List and manage projects, tags, and smart lists; add or remove task comments

## [Initial Version] - 2026-07-31

- Sign in to TickTick through Raycast OAuth without manual API credentials
- View Today, Inbox, Next 7 Days, Overdue, Completed, and Eisenhower Matrix task lists
- Search tasks and browse them by project, tag, or smart list
- Create, edit, move, complete, and delete tasks
- Create, rename, archive, and delete projects
- Track habits and run TickTick-synced Pomodoro focus sessions
- See task and timer status in the menu bar
- Receive optional alerts for overdue and high-priority tasks
