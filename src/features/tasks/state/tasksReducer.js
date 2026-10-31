// Tasks live in one array. A column shows the tasks with its status in array order,
// so moving a card is "remove it, then insert it before another task".

let insertBefore = (list, task, beforeId) => {
  let index = beforeId ? list.findIndex((t) => t.id === beforeId) : -1;
  if (index === -1) return [...list, task];
  return [...list.slice(0, index), task, ...list.slice(index)];
};

export let tasksReducer = (state, action) => {
  switch (action.type) {
    // New tasks go to the top of their column.
    case "added": {
      let firstInColumn = state.find((t) => t.status === action.task.status);
      return insertBefore(state, action.task, firstInColumn?.id);
    }

    case "updated":
      return state.map((t) =>
        t.id === action.id ? { ...t, ...action.changes, updatedAt: action.at } : t
      );

    // beforeId null = end of the target column.
    case "moved": {
      let task = state.find((t) => t.id === action.id);
      if (!task || action.beforeId === action.id) return state;
      let rest = state.filter((t) => t.id !== action.id);
      let changed = task.status !== action.status;
      let moved = changed ? { ...task, status: action.status, updatedAt: action.at } : task;
      return insertBefore(rest, moved, action.beforeId);
    }

    case "deleted":
      return state.filter((t) => t.id !== action.id);

    case "replaced":
      return action.tasks;

    default:
      return state;
  }
};
