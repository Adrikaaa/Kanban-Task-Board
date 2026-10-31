import { AlignLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { useBoard } from "../../../board/hooks/useBoard";
import { taskKey } from "../../utils/selectors";
import { DueDateBadge, Highlight, PriorityIcon, TaskTypeIcon } from "./TaskMeta";
import TaskMenu from "./TaskMenu";

// One card on the board. The whole card opens the task (the title button's ::after
// covers it); the "..." menu sits above that layer. Dragging is handled by the column.
const TaskCard = ({ task, dragging, onDragStart, onDragEnd }) => {
  let { openEdit, search, focusTaskRef } = useBoard();
  let titleRef = useRef(null);
  let done = task.status === "completed";

  useEffect(() => {
    if (focusTaskRef.current !== task.id) return;
    focusTaskRef.current = null;
    titleRef.current?.focus();
    titleRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [focusTaskRef, task.id]);

  return (
    <article
      data-task-id={task.id}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      className={`group relative cursor-grab rounded-card bg-surface p-3 shadow-card transition-[background-color,opacity,box-shadow] hover:bg-surface-hover active:cursor-grabbing ${
        dragging ? "opacity-40" : ""
      }`}
    >
      <h3 className="pr-11 text-sm md:pr-8 leading-5 break-words text-ink">
        <button
          ref={titleRef}
          type="button"
          onClick={() => openEdit(task.id)}
          className="line-clamp-2 text-left after:absolute after:inset-0 after:rounded-card focus-visible:shadow-none focus-visible:after:shadow-[var(--focus-ring)]"
        >
          <Highlight text={task.title} term={search} />
        </button>
      </h3>

      {task.description && (
        <p className="mt-1 line-clamp-2 pr-11 text-xs md:pr-8 leading-4 break-words text-ink-500">{task.description}</p>
      )}

      {task.dueDate && (
        <div className="mt-2.5">
          <DueDateBadge dueDate={task.dueDate} status={task.status} />
        </div>
      )}

      <div className="mt-2.5 flex items-center gap-2">
        <TaskTypeIcon />
        <span className={`text-xs font-semibold text-ink-700 ${done ? "line-through" : ""}`}>
          {taskKey(task)}
        </span>
        {task.description && (
          <AlignLeft size={14} aria-label="Has description" className="text-ink-500" />
        )}
        <span className="ml-auto">
          <PriorityIcon priority={task.priority} />
        </span>
      </div>

      {/* Always visible on touch screens; revealed on hover or focus with a mouse.
          The open menu lives inside this layer, so it is raised above the other cards' buttons. */}
      <div className="absolute top-2 right-2 z-10 transition-opacity focus-within:z-30 has-[[aria-expanded=true]]:z-30 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-within:opacity-100">
        <TaskMenu task={task} />
      </div>
    </article>
  );
};

export default TaskCard;
