import { ClipboardList, Plus, SearchX, Sparkles } from "lucide-react";
import { PRIORITY_LABELS, STATUS_LABELS } from "../../../../app/constants/taskOptions";
import Button from "../../../../shared/ui/components/Button";
import { useBoard } from "../../hooks/useBoard";

const Panel = ({ icon, title, children, actions }) => (
  <div className="animate-fade-up mx-auto flex max-w-md flex-col items-center px-6 py-12 text-center md:py-16">
    <span className="flex size-14 items-center justify-center rounded-full bg-brand-subtle text-brand">
      {icon}
    </span>
    <h2 className="mt-4 text-lg font-semibold text-ink">{title}</h2>
    <div className="mt-1.5 text-ink-700">{children}</div>
    <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div>
  </div>
);

// No tasks at all.
export const BoardEmpty = () => {
  let { openCreate, loadSamples } = useBoard();

  return (
    <Panel
      icon={<ClipboardList size={26} aria-hidden="true" />}
      title="Your board is empty"
      actions={
        <>
          <Button variant="primary" onClick={() => openCreate()} icon={<Plus size={16} aria-hidden="true" />}>
            Create task
          </Button>
          <Button onClick={loadSamples} icon={<Sparkles size={16} aria-hidden="true" />}>
            Add sample tasks
          </Button>
        </>
      }
    >
      <p>Create your first task to start planning. Tasks are saved in this browser, so they're still here after a refresh.</p>
    </Panel>
  );
};

// Tasks exist, but none match the search and filters.
export const NoResults = () => {
  let { filters, clearFilters } = useBoard();
  let applied = [
    filters.search.trim() && `"${filters.search.trim()}"`,
    filters.priority !== "all" && `${PRIORITY_LABELS[filters.priority]} priority`,
    filters.status !== "all" && STATUS_LABELS[filters.status],
  ].filter(Boolean);

  return (
    <Panel
      icon={<SearchX size={26} aria-hidden="true" />}
      title="No tasks match your filters"
      actions={<Button onClick={clearFilters}>Clear filters</Button>}
    >
      <p>
        Nothing found for <span className="font-semibold text-ink">{applied.join(" · ")}</span>. Try a different
        title or remove a filter.
      </p>
    </Panel>
  );
};
