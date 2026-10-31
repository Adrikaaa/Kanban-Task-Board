import { CalendarDays, ChevronDown, ChevronsUp, Equal } from "lucide-react";
import { PRIORITY_LABELS, STATUS_LABELS } from "../../../../app/constants/taskOptions";
import { formatDate, getDueState } from "../../utils/dates";

// Small, non-interactive pieces of task metadata shared by the card, list and dialog.

const priorityIcons = {
  high: { Icon: ChevronsUp, className: "text-priority-high" },
  medium: { Icon: Equal, className: "text-priority-medium" },
  low: { Icon: ChevronDown, className: "text-priority-low" },
};

// Icon plus visually hidden text, so priority never relies on colour alone.
export const PriorityIcon = ({ priority, showLabel = false, size = 16 }) => {
  let { Icon, className } = priorityIcons[priority];
  let label = `${PRIORITY_LABELS[priority]} priority`;

  return (
    <span className="inline-flex items-center gap-1.5" title={label}>
      <Icon size={size} strokeWidth={2.5} aria-hidden="true" className={className} />
      {showLabel ? (
        <span className="text-sm text-ink">{PRIORITY_LABELS[priority]}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </span>
  );
};

const lozenges = {
  todo: "bg-todo text-todo-ink",
  in_progress: "bg-progress text-progress-ink",
  completed: "bg-done text-done-ink",
};

// Jira's uppercase status pill.
export const StatusLozenge = ({ status }) => (
  <span
    className={`inline-flex h-5 shrink-0 items-center rounded-chip px-1.5 text-[11px] leading-none font-bold whitespace-nowrap uppercase ${lozenges[status]}`}
  >
    {STATUS_LABELS[status]}
  </span>
);

const dueStyles = {
  overdue: "bg-danger-subtle text-danger-text",
  today: "bg-warning-subtle text-warning-text",
  soon: "bg-warning-subtle text-warning-text",
  later: "bg-neutral text-ink-700",
  done: "bg-neutral text-ink-500",
};

const dueLabels = {
  overdue: "Overdue",
  today: "Due today",
};

export const DueDateBadge = ({ dueDate, status }) => {
  let state = getDueState(dueDate, status);
  if (!state) return null;
  let prefix = dueLabels[state];

  return (
    <span
      className={`inline-flex h-6 items-center gap-1 rounded-chip px-1.5 text-xs font-semibold whitespace-nowrap ${dueStyles[state]}`}
    >
      <CalendarDays size={14} aria-hidden="true" />
      <span className="sr-only">Due </span>
      {state === "today" ? prefix : formatDate(dueDate)}
      {state === "overdue" && <span className="font-normal">· {prefix}</span>}
    </span>
  );
};

// Jira's blue "task" issue-type square.
export const TaskTypeIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0">
    <rect width="16" height="16" rx="3" fill="#4bade8" />
    <path d="m4.5 8.2 2.3 2.3 4.7-5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Wraps the search term in <mark> so matches stand out on cards and rows.
export const Highlight = ({ text, term }) => {
  let query = term.trim();
  if (!query) return text;
  let index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-[2px] bg-highlight text-inherit">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
};
