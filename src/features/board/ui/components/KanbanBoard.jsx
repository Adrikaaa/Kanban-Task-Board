import { useRef, useState } from "react";
import { STATUSES, STATUS_LABELS } from "../../../../app/constants/taskOptions";
import { groupByStatus } from "../../../tasks/utils/selectors";
import { useBoard } from "../../hooks/useBoard";
import KanbanColumn from "./KanbanColumn";

// Columns side by side on desktop; a swipeable row (one column per screen) with
// jump tabs on phones. Drag and drop uses the native HTML5 API. Touch and keyboard
// users move cards with the card's "..." menu or the Status field in the task dialog.
const KanbanBoard = () => {
  let { visible, filters, dropTask } = useBoard();
  let [draggingId, setDraggingId] = useState(null);
  let [dropTarget, setDropTarget] = useState(null);
  let [activeIndex, setActiveIndex] = useState(0);
  let scrollerRef = useRef(null);

  let groups = groupByStatus(visible);
  let statuses = filters.status === "all" ? STATUSES : [filters.status];

  let handleDragStart = (e, task) => {
    e.dataTransfer.effectAllowed = "move";
    // Firefox only starts a drag when some data is set.
    e.dataTransfer.setData("text/plain", task.id);
    setDraggingId(task.id);
  };

  let reset = () => {
    setDraggingId(null);
    setDropTarget(null);
  };

  let handleDrop = (status, beforeId) => {
    dropTask(draggingId, status, beforeId);
    reset();
  };

  // Phones only: which column is snapped into view.
  let handleScroll = () => {
    let scroller = scrollerRef.current;
    let first = scroller.querySelector("section");
    if (!first) return;
    let step = first.offsetWidth + 12;
    setActiveIndex(Math.min(statuses.length - 1, Math.round(scroller.scrollLeft / step)));
  };

  // The scroller is `relative`, so a column's offsetLeft is measured from it.
  let jumpTo = (index) => {
    let scroller = scrollerRef.current;
    let column = scroller.querySelectorAll("section")[index];
    if (!column) return;
    setActiveIndex(index);
    scroller.scrollTo({ left: column.offsetLeft - 16, behavior: "smooth" });
  };

  return (
    <>
      {statuses.length > 1 && (
        <div role="group" aria-label="Jump to column" className="flex gap-1 px-4 pb-3 md:hidden">
          {statuses.map((status, index) => (
            <button
              key={status}
              type="button"
              onClick={() => jumpTo(index)}
              aria-current={activeIndex === index ? "true" : undefined}
              className={`flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-control px-2 text-xs font-semibold transition-colors ${
                activeIndex === index ? "bg-brand-subtle text-brand-hover" : "bg-neutral text-ink-700"
              }`}
            >
              {STATUS_LABELS[status]}
              <span className="tabular-nums opacity-80">{groups[status].length}</span>
            </button>
          ))}
        </div>
      )}

      {/* `relative` keeps absolutely positioned children (sr-only labels) inside the
          scroller; without it they widen the page on phones. */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="dot-grid thin-scroll relative flex flex-1 snap-x snap-mandatory items-start scroll-px-4 gap-3 overflow-x-auto px-4 pb-4 md:min-h-0 md:snap-none md:items-stretch md:px-6 md:pb-6"
      >
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={groups[status]}
            draggingId={draggingId}
            dropTarget={dropTarget}
            onDragStart={handleDragStart}
            onDragEnd={reset}
            onDragTarget={setDropTarget}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </>
  );
};

export default KanbanBoard;
