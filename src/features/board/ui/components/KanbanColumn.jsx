import { Check, Plus } from "lucide-react";
import { useRef } from "react";
import { STATUS_LABELS } from "../../../../app/constants/taskOptions";
import TaskCard from "../../../tasks/ui/components/TaskCard";
import { useBoard } from "../../hooks/useBoard";

const emptyMessages = {
  todo: "Nothing to do yet.",
  in_progress: "Drag a task here to start it.",
  completed: "Finished tasks land here.",
};

const DropLine = () => <div aria-hidden="true" className="h-0.5 shrink-0 rounded-full bg-brand" />;

// The card the pointer is above (by vertical midpoint), or null for the bottom.
let findBeforeId = (listEl, clientY, draggingId) => {
  let cards = listEl.querySelectorAll("[data-task-id]");
  for (let card of cards) {
    if (card.dataset.taskId === draggingId) continue;
    let rect = card.getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) return card.dataset.taskId;
  }
  return null;
};

// One status column. Drop handling lives here; which card is being dragged and
// where the drop line shows are owned by KanbanBoard.
const KanbanColumn = ({ status, tasks, draggingId, dropTarget, onDragStart, onDragEnd, onDragTarget, onDrop }) => {
  let { openCreate, filters } = useBoard();
  let listRef = useRef(null);
  let label = STATUS_LABELS[status];
  let isOver = dropTarget?.status === status;
  let filtered = filters.search.trim() !== "" || filters.priority !== "all";

  let handleDragOver = (e) => {
    if (!draggingId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    let beforeId = findBeforeId(listRef.current, e.clientY, draggingId);
    if (!isOver || dropTarget.beforeId !== beforeId) onDragTarget({ status, beforeId });
  };

  let handleDragLeave = (e) => {
    if (isOver && !e.currentTarget.contains(e.relatedTarget)) onDragTarget(null);
  };

  let handleDrop = (e) => {
    if (!draggingId) return;
    e.preventDefault();
    onDrop(status, findBeforeId(listRef.current, e.clientY, draggingId));
  };

  return (
    <section
      aria-labelledby={`column-${status}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex w-[min(85vw,340px)] shrink-0 snap-start flex-col rounded-column transition-colors md:min-h-0 md:w-auto md:max-w-[400px] md:min-w-[272px] md:flex-1 ${
        isOver ? "bg-column-active ring-2 ring-brand/30" : "bg-column"
      }`}
    >
      <header className="flex items-center gap-2 px-3 pt-3 pb-2">
        <h2 id={`column-${status}`} className="text-xs font-semibold tracking-wide text-ink-700 uppercase">
          {label}
        </h2>
        <span
          aria-label={`${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`}
          className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-hover px-1.5 text-xs font-semibold text-ink-700 tabular-nums"
        >
          {tasks.length}
        </span>
        {status === "completed" && <Check size={16} strokeWidth={3} aria-hidden="true" className="text-success" />}
      </header>

      <div
        ref={listRef}
        className="thin-scroll flex min-h-24 flex-1 flex-col gap-1.5 overflow-y-auto px-2 pt-0.5 pb-2 md:min-h-0"
      >
        {tasks.map((task) => (
          <div key={task.id} className="flex flex-col gap-1.5">
            {isOver && dropTarget.beforeId === task.id && <DropLine />}
            <TaskCard
              task={task}
              dragging={draggingId === task.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          </div>
        ))}
        {isOver && dropTarget.beforeId === null && tasks.length > 0 && <DropLine />}

        {tasks.length === 0 && (
          <div
            className={`flex flex-1 items-center justify-center rounded-card border-2 border-dashed px-4 py-6 text-center text-xs ${
              isOver ? "border-brand/50 text-brand-hover" : "border-neutral-hover text-ink-500"
            }`}
          >
            {isOver ? "Drop to move here" : filtered ? "No matching tasks" : emptyMessages[status]}
          </div>
        )}
      </div>

      <div className="px-2 pb-2">
        <button
          type="button"
          onClick={() => openCreate(status)}
          className="flex min-h-11 w-full items-center gap-1.5 rounded-control px-2 text-sm font-medium text-ink-700 transition-colors hover:bg-neutral-hover hover:text-ink md:min-h-9"
        >
          <Plus size={16} aria-hidden="true" />
          Create
          <span className="sr-only">task in {label}</span>
        </button>
      </div>
    </section>
  );
};

export default KanbanColumn;
