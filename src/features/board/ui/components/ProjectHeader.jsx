import { ChevronRight, Columns3, List } from "lucide-react";
import { NavLink } from "react-router";
import { PROJECT_NAME, VIEWS } from "../../../../app/constants/site";
import { LogoMark } from "../../../../shared/ui/components/Logo";
import { useBoard } from "../../hooks/useBoard";

const viewIcons = {
  "/board": Columns3,
  "/list": List,
};

// Breadcrumb, project title, progress and the Board / List tabs.
const ProjectHeader = () => {
  let { tasks } = useBoard();
  let done = tasks.filter((t) => t.status === "completed").length;
  let percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);

  return (
    <div className="shrink-0 px-4 pt-4 md:px-6 md:pt-5">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-ink-500">
        <span>Projects</span>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">{PROJECT_NAME}</span>
      </nav>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="flex items-center gap-2.5 text-xl font-semibold text-ink md:text-2xl">
          <LogoMark className="size-7 md:size-8" />
          {PROJECT_NAME}
        </h1>
        {tasks.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-ink-500 md:ml-auto">
            <span className="tabular-nums">
              {done} of {tasks.length} completed
            </span>
            <span
              role="progressbar"
              aria-label="Tasks completed"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-1.5 w-24 overflow-hidden rounded-full bg-neutral"
            >
              <span className="block h-full rounded-full bg-success transition-[width]" style={{ width: `${percent}%` }} />
            </span>
          </div>
        )}
      </div>

      <nav aria-label="Views" className="mt-3 flex gap-1 border-b-2 border-line">
        {VIEWS.map(({ to, label }) => {
          let Icon = viewIcons[to];
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `-mb-0.5 flex min-h-11 items-center gap-1.5 border-b-2 px-2 text-sm font-medium transition-colors md:min-h-10 ${
                  isActive
                    ? "border-brand text-brand"
                    : "border-transparent text-ink-700 hover:border-line-strong hover:text-ink"
                }`
              }
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default ProjectHeader;
