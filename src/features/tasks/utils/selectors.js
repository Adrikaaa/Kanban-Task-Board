import { STATUSES, TASK_KEY_PREFIX } from "../../../app/constants/taskOptions";

export let taskKey = (task) => `${TASK_KEY_PREFIX}-${task.number}`;

// Keys keep counting up, like Jira: the next task gets the highest number + 1.
export let nextTaskNumber = (tasks) =>
  tasks.reduce((max, t) => Math.max(max, t.number ?? 0), 0) + 1;

export let countActiveFilters = (filters) =>
  (filters.search.trim() !== "" ? 1 : 0) +
  (filters.priority !== "all" ? 1 : 0) +
  (filters.status !== "all" ? 1 : 0);

// Search matches the title (and the task key, so "KAN-4" finds that task).
// Order is preserved: the array order is the order cards appear in their column.
export let getVisibleTasks = (tasks, filters) => {
  let term = filters.search.trim().toLowerCase();

  return tasks.filter((t) => {
    if (filters.priority !== "all" && t.priority !== filters.priority) return false;
    if (filters.status !== "all" && t.status !== filters.status) return false;
    if (!term) return true;
    return t.title.toLowerCase().includes(term) || taskKey(t).toLowerCase() === term;
  });
};

export let groupByStatus = (tasks) => {
  let groups = Object.fromEntries(STATUSES.map((s) => [s, []]));
  for (let task of tasks) groups[task.status].push(task);
  return groups;
};
