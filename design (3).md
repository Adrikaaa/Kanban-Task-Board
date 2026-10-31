# Design Specification — Shoppers App

## 1. Product Overview

**Product:** Shoppers App  
**Interface type:** Team task-management board with threaded collaboration and AI-assisted task execution.

The interface helps a team track shopper-related work across a Kanban board, discuss individual tasks in threads, and review work completed or proposed by AI agents.

## 2. Design Goals

- Make task status and ownership easy to scan.
- Keep task details compact so many cards fit on one board.
- Connect task discussion, agent activity, and approval flows to the relevant work item.
- Make AI-generated changes visible and require clear user approval when appropriate.
- Keep the interface calm and workspace-focused, with restrained color and minimal visual noise.

## 3. Information Architecture

### Primary workspace
- **Workspace name:** Shoppers App
- **Top navigation:** workspace title, view tabs, and utility actions.
- **Views shown:** Timeline, Backlog, Board, List.
- **Primary view:** Board / Kanban.

### Board columns
The recording shows a workflow organized into columns similar to:
- **To Do**
- **In progress**
- **Review**
- **Done**

Each column displays a task count and a vertical stack of task cards. The board is wider than the viewport and supports horizontal navigation.

### Task card
A task card can contain:
- Task title
- Project or issue identifier (for example, `SHOP-27`)
- Checklist or completion indicator
- Current status
- Assignee avatar
- Small status, activity, or integration icons

Example task titles visible in the recording include:
- Real-time order status for shoppers
- Delivery dates at checkout
- Past purchase reordering
- Design confirmation page
- Guest checkout

### Collaboration and agent surfaces
- **Thread panel:** a discussion attached to a task or work item.
- **Agent activity cards:** show an agent name, task status, and a continuation action.
- **Approval panel:** presents a proposed change, a summary of affected work, and explicit actions such as dismissing or accepting the proposal.
- **Summary panel:** provides a concise recap and suggested follow-up actions.

## 4. Layout and Visual System

### Canvas
- Use a light neutral workspace background.
- The board canvas may use a subtle dotted grid to reinforce the spatial/workbench feel without competing with task content.
- Keep the main board horizontally oriented, with columns aligned to a shared baseline.

### Spacing
Use a consistent spacing scale:
- `4px` — icon and label micro-spacing
- `8px` — compact internal card spacing
- `12px` — standard card padding gaps
- `16px` — section spacing
- `24px` — panel and page separation
- `32px` — major layout separation

### Shape and elevation
- Cards and dialogs use softly rounded corners.
- Use thin, low-contrast borders for task cards and panels.
- Reserve shadows for floating dialogs and overlays.
- Avoid heavy outlines or strong drop shadows on every card.

### Typography
Use a modern sans-serif UI font.
- Workspace title: 16–18px, semibold
- Column headings: 13–15px, semibold
- Task titles: 12–14px, medium
- Metadata and helper text: 11–12px
- Dialog title: 16–18px, semibold
- Body text: 13–14px

Keep task titles readable and allow up to two lines before truncation or card expansion.

## 5. Color and Status Semantics

The recording uses a mostly white and light-gray interface with restrained accent colors.

Suggested tokens:
- `--color-canvas: #F7F8FA`
- `--color-surface: #FFFFFF`
- `--color-surface-muted: #F1F3F5`
- `--color-border: #E3E6EA`
- `--color-text-primary: #202124`
- `--color-text-secondary: #6B7280`
- `--color-accent: #2563EB`
- `--color-success: #2E9D62`
- `--color-warning: #E7A126`
- `--color-danger: #D94B4B`

Use status color sparingly:
- Neutral gray for inactive or queued work
- Blue for primary actions and selected states
- Orange/amber for waiting, attention, or in-progress signals
- Green for completed or successful states
- Red only for errors or blocked states

Do not rely on color alone; pair status colors with labels or icons.

## 6. Core Components

### Workspace header
Contains the workspace name, view switcher, and compact utility actions. Keep it visually quiet and aligned with the board.

### View switcher
- Display the available views as compact text tabs with icons where useful.
- Clearly highlight the active view.
- Preserve the same header position across views.

### Kanban column
- Column title and item count at the top.
- Consistent card width and vertical spacing.
- Keep column headers visible while scrolling where practical.
- Provide a clear empty state when a column contains no tasks.

### Task card
- White surface with a subtle border and rounded corners.
- Title near the top; identifier, checklist, status, and assignee metadata below.
- Use small icons and avatars, avoiding excessive metadata density.
- Support hover/focus states without shifting the card layout.
- Make the whole card a clear interaction target.

### Thread panel
- Floating or overlay panel anchored to the workspace context.
- Header includes the title “Thread” and a close control.
- Show the original message first, followed by replies in chronological order.
- Each reply includes an avatar, author, timestamp, and message.
- Composer at the bottom with a multiline input and compact attachment/formatting actions.
- Keep the panel scrollable while preserving the composer.

### Agent activity card
- Show agent identity, task title, current state, and elapsed or relative time.
- Include one primary action such as **Continue** when user input is needed.
- Use explicit labels for states such as waiting for input, in progress, and finished.

### Approval dialog
- Clearly state what the agent proposes to change.
- Show a concise change summary and relevant affected task.
- Offer distinct actions: **Dismiss** and **Accept all**.
- Make the primary action visually prominent but not ambiguous.
- Never imply that a proposed change has been applied before the user accepts it.

### Summary panel
- Display a short summary of completed work or proposed updates.
- Include a linked task reference when available.
- Offer a small number of follow-up actions, such as asking a question or continuing the workflow.

## 7. Interaction Patterns

1. **Navigate views:** Selecting Timeline, Backlog, Board, or List changes the workspace content while preserving the workspace context.
2. **Inspect a task:** Selecting a card opens its details or related collaboration surface.
3. **Discuss work:** Open a thread from a task, read replies, and compose a response.
4. **Continue agent work:** When an agent is waiting for input, show a clear Continue action.
5. **Review a proposal:** Display the proposal and summary, then wait for the user to accept or dismiss it.
6. **Track completion:** When a task finishes, update its status and show a visible but restrained completion indicator.

## 8. Responsive Behavior

- **Desktop:** Show multiple Kanban columns side by side; use a floating panel for threads and approvals.
- **Tablet:** Keep cards readable and allow horizontal scrolling across columns.
- **Mobile:** Show one column at a time or a horizontally scrollable board; open threads and approvals as full-screen sheets.
- Avoid shrinking task text to fit more columns. Prefer scrolling or alternate views.

## 9. Accessibility

- Maintain sufficient contrast for text, borders, and status labels.
- Provide visible keyboard focus states for cards, tabs, buttons, and dialog controls.
- Give icon-only buttons accessible names and tooltips.
- Ensure dialogs trap focus and return focus to the initiating control when closed.
- Support keyboard navigation between columns and task cards.
- Announce asynchronous agent states and task completion to assistive technology.
- Pair status icons with text labels.

## 10. UX States to Design

- Loading board and loading thread
- Empty column and empty search results
- Agent waiting for input
- Agent processing
- Agent completed successfully
- Agent failed or needs attention
- Approval pending
- Proposal accepted
- Proposal dismissed
- Network or save error
- No permission to edit a task

## 11. Implementation Notes

- Build reusable components for the workspace header, view switcher, Kanban column, task card, thread panel, agent activity card, approval dialog, and summary panel.
- Keep task state, agent state, and approval state separate in the data model.
- Use optimistic UI updates only for actions that can be safely reverted; show clear feedback if persistence fails.
- Keep task identifiers and links consistent across the board, thread, and summary surfaces.
- Ensure dialogs and panels do not obscure the user's context more than necessary.

## 12. Design Principles

1. **Clarity over decoration:** the work and its status should remain the visual priority.
2. **Compact, not cramped:** fit useful metadata into cards without sacrificing readability.
3. **Contextual collaboration:** discussions and agent activity should stay connected to the task they concern.
4. **Human control:** make AI actions and approval requirements explicit.
5. **Consistent feedback:** every meaningful action should have a visible state change or confirmation.

---

*This specification is based on the supplied screen recording. Exact dimensions, font family, and production color values were not directly measurable, so the tokens above are proposed implementation defaults rather than claims about the original source code.*
