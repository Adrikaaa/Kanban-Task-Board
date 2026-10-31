import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EMPTY_FILTERS, STATUS_LABELS } from "../../../app/constants/taskOptions";
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";
import { useToast } from "../../../shared/hooks/useToast";
import { useTasks } from "../../tasks/hooks/useTasks";
import { getVisibleTasks, taskKey } from "../../tasks/utils/selectors";
import { BoardContext } from "./BoardContext";

const CLOSED_DIALOG = { mode: null, id: null, status: null };

// Holds everything the board and list views share: tasks, filters, dialogs and toasts.
const BoardProvider = ({ children }) => {
  let tasksApi = useTasks();
  let { tasks, saveFailed, addTask, updateTask, moveTask, deleteTask, loadSampleTasks } = tasksApi;
  let { toast, showToast, dismissToast } = useToast();

  let [filters, setFilters] = useState(EMPTY_FILTERS);
  let [dialog, setDialog] = useState(CLOSED_DIALOG);
  let [deleteId, setDeleteId] = useState(null);
  let [searchFocusRequest, setSearchFocusRequest] = useState(0);
  // A card moved from its menu remounts in another column; it takes focus back on mount.
  let focusTaskRef = useRef(null);

  let search = useDebouncedValue(filters.search, 150);
  let visible = useMemo(
    () => getVisibleTasks(tasks, { ...filters, search }),
    [tasks, filters, search]
  );

  useEffect(() => {
    if (saveFailed) {
      showToast("Couldn't save to this browser. Changes are kept for this session only.", "error", 8000);
    }
  }, [saveFailed, showToast]);

  // A dialog for a task that no longer exists (deleted in another tab) closes itself.
  let editing = dialog.mode === "edit" ? tasks.find((t) => t.id === dialog.id) ?? null : null;
  let dialogOpen = dialog.mode === "new" || Boolean(editing);
  let deleting = deleteId ? tasks.find((t) => t.id === deleteId) ?? null : null;

  let openCreate = useCallback((status = "todo") => {
    setDialog({ mode: "new", id: null, status });
  }, []);

  let openEdit = useCallback((id) => setDialog({ mode: "edit", id, status: null }), []);
  let closeDialog = useCallback(() => setDialog(CLOSED_DIALOG), []);

  let submitTask = (values) => {
    if (editing) {
      updateTask(editing.id, values);
      showToast(`${taskKey(editing)} updated.`);
    } else {
      let task = addTask(values);
      showToast(`${taskKey(task)} created in ${STATUS_LABELS[task.status]}.`);
    }
    closeDialog();
  };

  let requestDelete = (id) => {
    closeDialog();
    setDeleteId(id);
  };

  let cancelDelete = () => setDeleteId(null);

  let confirmDelete = () => {
    if (!deleting) return;
    deleteTask(deleting.id);
    setDeleteId(null);
    showToast(`${taskKey(deleting)} deleted.`);
  };

  // From a card menu: the task goes to the top of the target column.
  let changeStatus = (id, status) => {
    let task = tasks.find((t) => t.id === id);
    if (!task || task.status === status) return;
    let firstInColumn = tasks.find((t) => t.status === status);
    focusTaskRef.current = id;
    moveTask(id, status, firstInColumn?.id ?? null);
    showToast(`${taskKey(task)} moved to ${STATUS_LABELS[status]}.`);
  };

  // From drag and drop: `beforeId` is the card it was dropped above (null = bottom).
  let dropTask = (id, status, beforeId) => {
    let task = tasks.find((t) => t.id === id);
    if (!task) return;
    moveTask(id, status, beforeId);
    if (task.status !== status) {
      showToast(`${taskKey(task)} moved to ${STATUS_LABELS[status]}.`);
    }
  };

  let loadSamples = () => {
    loadSampleTasks();
    showToast("Sample tasks added.");
  };

  let setFilter = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  let clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  let focusSearch = useCallback(() => setSearchFocusRequest((n) => n + 1), []);

  let value = {
    ...tasksApi,
    toast,
    showToast,
    dismissToast,
    filters,
    setFilter,
    clearFilters,
    search,
    visible,
    dialog,
    editing,
    dialogOpen,
    openCreate,
    openEdit,
    closeDialog,
    submitTask,
    deleting,
    requestDelete,
    cancelDelete,
    confirmDelete,
    changeStatus,
    focusTaskRef,
    dropTask,
    loadSamples,
    focusSearch,
    searchFocusRequest,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};

export default BoardProvider;
