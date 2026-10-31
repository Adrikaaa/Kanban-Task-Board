import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { STORAGE_KEY } from "../../../app/constants/taskOptions";
import { readJSON, writeJSON } from "../../../config/storage";
import { tasksReducer } from "../state/tasksReducer";
import { createSampleTasks } from "../utils/sampleTasks";
import { nextTaskNumber } from "../utils/selectors";
import { sanitizeTask } from "../utils/validate";

// Corrupt or unexpected data falls back to an empty board. Tasks without a key
// number (hand-edited storage) get the next free one.
let loadTasks = () => {
  let stored = readJSON(STORAGE_KEY, []);
  if (!Array.isArray(stored)) return [];
  let tasks = stored.map(sanitizeTask).filter(Boolean);
  let next = nextTaskNumber(tasks);
  return tasks.map((t) => (t.number ? t : { ...t, number: next++ }));
};

// crypto.randomUUID only exists on secure origins (https or localhost).
let createId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

let cleanValues = (values) => ({
  title: values.title.trim().replace(/\s+/g, " "),
  description: values.description.trim(),
  priority: values.priority,
  status: values.status,
  dueDate: values.dueDate,
});

// Single source of truth for tasks: state, CRUD and LocalStorage sync.
export let useTasks = () => {
  let [tasks, dispatch] = useReducer(tasksReducer, undefined, loadTasks);
  let [saveFailed, setSaveFailed] = useState(false);
  let fromOtherTab = useRef(false);

  useEffect(() => {
    if (fromOtherTab.current) {
      fromOtherTab.current = false;
      return;
    }
    setSaveFailed(!writeJSON(STORAGE_KEY, tasks));
  }, [tasks]);

  // Keep several open tabs in sync instead of letting one overwrite another.
  useEffect(() => {
    let handleStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      fromOtherTab.current = true;
      dispatch({ type: "replaced", tasks: loadTasks() });
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  let addTask = useCallback(
    (values) => {
      let now = Date.now();
      let task = {
        id: createId(),
        number: nextTaskNumber(tasks),
        ...cleanValues(values),
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: "added", task });
      return task;
    },
    [tasks]
  );

  let updateTask = useCallback((id, values) => {
    dispatch({ type: "updated", id, changes: cleanValues(values), at: Date.now() });
  }, []);

  let moveTask = useCallback((id, status, beforeId = null) => {
    dispatch({ type: "moved", id, status, beforeId, at: Date.now() });
  }, []);

  let deleteTask = useCallback((id) => {
    dispatch({ type: "deleted", id });
  }, []);

  let loadSampleTasks = useCallback(() => {
    dispatch({ type: "replaced", tasks: createSampleTasks(createId) });
  }, []);

  return {
    tasks,
    saveFailed,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    loadSampleTasks,
  };
};
