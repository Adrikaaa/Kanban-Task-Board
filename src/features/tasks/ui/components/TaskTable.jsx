import { useBoard } from "../../../board/hooks/useBoard";
import { taskKey } from "../../utils/selectors";
import { DueDateBadge, Highlight, PriorityIcon, StatusLozenge, TaskTypeIcon } from "./TaskMeta";
import TaskMenu from "./TaskMenu";

// List view. On phones the status, priority and due date fold under the title.
const TaskTable = ({ tasks }) => {
  let { openEdit, search } = useBoard();

  return (
    <div className="overflow-hidden rounded-column border border-line bg-surface">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <thead className="bg-surface-hover text-xs font-semibold text-ink-500">
          <tr className="border-b border-line">
            <th scope="col" className="hidden w-28 px-4 py-2.5 sm:table-cell">Key</th>
            <th scope="col" className="px-4 py-2.5">Title</th>
            <th scope="col" className="hidden w-36 px-4 py-2.5 md:table-cell">Status</th>
            <th scope="col" className="hidden w-32 px-4 py-2.5 md:table-cell">Priority</th>
            <th scope="col" className="hidden w-40 px-4 py-2.5 md:table-cell">Due date</th>
            <th scope="col" className="w-14 px-2 py-2.5 md:w-12">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="group border-b border-line last:border-b-0 hover:bg-surface-hover">
              <td className="hidden px-4 py-2.5 align-middle sm:table-cell">
                <span className="flex items-center gap-2 text-xs font-semibold text-ink-700">
                  <TaskTypeIcon />
                  <span className={task.status === "completed" ? "line-through" : ""}>{taskKey(task)}</span>
                </span>
              </td>
              <td className="px-4 py-2.5 align-middle">
                <button
                  type="button"
                  onClick={() => openEdit(task.id)}
                  className="w-full truncate rounded-chip text-left font-medium text-ink hover:text-brand-hover hover:underline"
                >
                  <Highlight text={task.title} term={search} />
                </button>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 md:hidden">
                  <span className="text-xs font-semibold text-ink-700 sm:hidden">{taskKey(task)}</span>
                  <StatusLozenge status={task.status} />
                  <PriorityIcon priority={task.priority} />
                  <DueDateBadge dueDate={task.dueDate} status={task.status} />
                </div>
              </td>
              <td className="hidden px-4 py-2.5 align-middle md:table-cell">
                <StatusLozenge status={task.status} />
              </td>
              <td className="hidden px-4 py-2.5 align-middle md:table-cell">
                <PriorityIcon priority={task.priority} showLabel />
              </td>
              <td className="hidden px-4 py-2.5 align-middle md:table-cell">
                {task.dueDate ? <DueDateBadge dueDate={task.dueDate} status={task.status} /> : <span className="text-ink-500">None</span>}
              </td>
              <td className="px-2 py-2.5 text-right align-middle">
                <TaskMenu task={task} tone="subtle" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
