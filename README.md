# Kanban Task Board

A responsive, Jira-style Kanban board for managing tasks across **To Do**, **In Progress** and **Completed**. Built with React 19, Vite and Tailwind CSS v4. Everything is saved in the browser with LocalStorage.

**Live demo:** _add your deployed link here_ · **Demo video:** _add your video link here_

## Features

| Requirement | How it works |
| --- | --- |
| Add task | **Create** button (or press <kbd>C</kbd>), or **+ Create** at the bottom of any column to create straight into it. Title, description, priority, status and due date. |
| Edit / delete | Click a card to edit it. Delete from the card's **…** menu or the edit dialog, with a confirmation step. |
| Status | Drag cards between columns (and reorder inside a column) with a blue drop line. On touch screens and for keyboard users, the **…** menu has **Move to**, and the dialog has a Status field. |
| Search | Searches titles as you type (debounced), highlights matches, and also finds a task by its key (e.g. `KAN-4`). Press <kbd>/</kbd> to focus it. |
| Filter | Priority and status dropdowns. Filtering by status shows only that column. "Showing X of Y" and **Clear filters** appear while filters are on. |
| Persistence | Tasks are saved to LocalStorage on every change and validated when loaded. Open tabs stay in sync through the `storage` event. |
| Responsive | Desktop: columns side by side, each scrolls on its own. Phones: one column per screen with swipe and jump tabs, dialogs open as bottom sheets, 44px touch targets. |
| UX states | Empty board (with **Add sample tasks** for demos), empty columns, no-results state, inline form validation, toasts for every action, and a warning if storage is unavailable. |

Extra: a **List** view (table of the same filtered tasks), Jira-style task keys (`KAN-1`), priority icons, overdue/due-soon date badges and a completion progress bar.

## Getting started

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Folder structure

```
src/
├── app/
│   ├── constants/      # taskOptions.js (statuses, priorities, limits), site.js
│   ├── layouts/        # AppLayout: provider + top nav + dialogs + toast
│   └── routes/         # /board, /list, 404
├── config/
│   └── storage.js      # Guarded LocalStorage read/write
├── features/
│   ├── board/
│   │   ├── hooks/      # useBoard (context accessor)
│   │   ├── state/      # BoardContext + BoardProvider
│   │   └── ui/
│   │       ├── components/  # TopNav, ProjectHeader, FilterBar, FilterMenu,
│   │       │                # KanbanBoard, KanbanColumn, BoardStates
│   │       └── pages/       # BoardPage, ListPage
│   └── tasks/
│       ├── hooks/      # useTasks: reducer + persistence + cross-tab sync
│       ├── state/      # tasksReducer
│       ├── ui/components/   # TaskCard, TaskMenu, TaskDialog, DeleteTaskDialog,
│       │                    # TaskTable, TaskMeta (lozenge, priority, due date)
│       └── utils/      # validate, selectors, dates, sampleTasks
├── shared/
│   ├── hooks/          # useDebouncedValue, useMediaQuery, useToast, useShortcut, useDocumentTitle
│   └── ui/             # Button, IconButton, Modal, Menu, FormField, Toast, Logo, NotFound
└── styles/tokens.css   # Design tokens (Jira-inspired palette)
```

Code is grouped by **feature** (`board`, `tasks`) rather than by file type, so everything about tasks lives together. Generic building blocks live in `shared`.

## State management

- **`useTasks`** owns the task list with `useReducer`. The reducer handles `added`, `updated`, `moved`, `deleted` and `replaced`. A `useEffect` writes to LocalStorage after each change; a `storage` listener replaces state when another tab saves.
- **One array, ordered.** A column shows the tasks with its status in array order, so moving a card is "remove it, then insert it before another task". That one action covers moving between columns *and* reordering within a column.
- **`BoardProvider`** (React Context) combines `useTasks` with UI state that both views share: filters, the open dialog, the task pending deletion and toasts. Components read it through `useBoard()`.
- **Derived data is not stored.** Visible tasks, column groups, counts and progress are computed from tasks + filters with `useMemo` / plain selectors.
- Drag state (which card, where the drop line is) is local to `KanbanBoard` because nothing else needs it.

## Key decisions

- **No drag-and-drop library.** The native HTML5 API keeps the bundle small. Its gap (no touch support) is covered by the **Move to** menu and the Status field, which also make moving cards keyboard-accessible.
- **Validation on submit, then live.** Errors show after the first submit attempt and update as you type; focus jumps to the first invalid field. Title is 3–120 chars, due date is required and can't be in the past (an existing overdue date can be kept when editing).
- **Stored data is untrusted.** `sanitizeTask` drops or repairs anything malformed in LocalStorage so a bad value can't crash the app.
- **Native `<dialog>`** for modals gives focus trapping, Escape and an inert background for free. Focus returns to the control that opened it.
- **Menus are `position: fixed`** and measured from their trigger, so scrolling columns never clip them; they flip upward near the bottom of the screen.
- **Accessibility:** labelled controls, visible focus rings, priority/status never shown by colour alone, live regions for toasts and result counts, arrow-key navigation in menus.

## Deploying

The repo includes `vercel.json` and `public/_redirects`, so client-side routes like `/list` work on Vercel or Netlify. Import the repository, keep the defaults (build: `npm run build`, output: `dist`) and deploy.
