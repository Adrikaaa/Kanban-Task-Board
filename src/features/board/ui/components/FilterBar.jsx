import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  PRIORITIES,
  PRIORITY_LABELS,
  STATUSES,
  STATUS_LABELS,
} from "../../../../app/constants/taskOptions";
import Button from "../../../../shared/ui/components/Button";
import { PriorityIcon } from "../../../tasks/ui/components/TaskMeta";
import { countActiveFilters } from "../../../tasks/utils/selectors";
import { useBoard } from "../../hooks/useBoard";
import FilterMenu from "./FilterMenu";

const priorityOptions = PRIORITIES.map((p) => ({
  value: p,
  label: PRIORITY_LABELS[p],
  icon: <PriorityIcon priority={p} />,
}));
const statusOptions = STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }));

// Search by title, filter by priority and status. Shared by the board and list views.
const FilterBar = () => {
  let { tasks, visible, filters, setFilter, clearFilters, searchFocusRequest } = useBoard();
  let inputRef = useRef(null);
  let activeCount = countActiveFilters(filters);

  // "/" anywhere on the page focuses search.
  useEffect(() => {
    if (searchFocusRequest > 0) inputRef.current?.focus();
  }, [searchFocusRequest]);

  let handleKeyDown = (e) => {
    if (e.key === "Escape" && filters.search) {
      e.preventDefault();
      setFilter("search", "");
    }
  };

  return (
    <div role="search" className="flex shrink-0 flex-wrap items-center gap-2 px-4 py-3 md:px-6 md:py-4">
      <div className="relative w-full sm:w-64">
        <Search
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-ink-500"
        />
        <label htmlFor="task-search" className="sr-only">
          Search tasks by title
        </label>
        <input
          ref={inputRef}
          id="task-search"
          type="search"
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search tasks"
          autoComplete="off"
          aria-keyshortcuts="/"
          className="h-11 w-full rounded-control border-2 border-line-strong/60 bg-surface pr-9 pl-8 text-base text-ink placeholder:text-ink-500 hover:bg-surface-hover focus:border-brand focus:bg-surface focus:shadow-none md:h-9 md:text-sm [&::-webkit-search-cancel-button]:hidden"
        />
        {filters.search ? (
          <button
            type="button"
            onClick={() => {
              setFilter("search", "");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute top-1/2 right-1 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-control text-ink-500 hover:bg-neutral hover:text-ink md:size-7"
          >
            <X size={14} aria-hidden="true" />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded-chip border border-line px-1.5 font-sans text-[11px] text-ink-500 md:block">
            /
          </kbd>
        )}
      </div>

      <FilterMenu
        label="Priority"
        value={filters.priority}
        options={priorityOptions}
        onChange={(value) => setFilter("priority", value)}
      />
      <FilterMenu
        label="Status"
        value={filters.status}
        options={statusOptions}
        onChange={(value) => setFilter("status", value)}
      />

      {activeCount > 0 && (
        <Button variant="subtle" onClick={clearFilters}>
          Clear filters
        </Button>
      )}

      <p aria-live="polite" className="ml-auto text-xs text-ink-500 tabular-nums">
        {activeCount > 0 && tasks.length > 0 && `Showing ${visible.length} of ${tasks.length} tasks`}
      </p>
    </div>
  );
};

export default FilterBar;
