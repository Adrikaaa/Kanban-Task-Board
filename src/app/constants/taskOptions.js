export const STORAGE_KEY = "kanban.tasks.v1";

// Column order on the board. Ids are stored; labels are only for display.
export const STATUSES = ["todo", "in_progress", "completed"];
export const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  completed: "Completed",
};

export const PRIORITIES = ["high", "medium", "low"];
export const PRIORITY_LABELS = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const TASK_KEY_PREFIX = "KAN";

export const TITLE_MIN = 3;
export const TITLE_MAX = 120;
export const DESCRIPTION_MAX = 1000;

export const EMPTY_FILTERS = {
  search: "",
  priority: "all",
  status: "all",
};

export const EMPTY_TASK = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  dueDate: "",
};
