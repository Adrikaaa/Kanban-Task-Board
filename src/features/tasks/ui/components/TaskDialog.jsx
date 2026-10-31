import { Trash2, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import {
  DESCRIPTION_MAX,
  EMPTY_TASK,
  PRIORITIES,
  PRIORITY_LABELS,
  STATUSES,
  STATUS_LABELS,
  TITLE_MAX,
} from "../../../../app/constants/taskOptions";
import Button from "../../../../shared/ui/components/Button";
import { SelectField, TextAreaField, TextField } from "../../../../shared/ui/components/FormField";
import IconButton from "../../../../shared/ui/components/IconButton";
import Modal from "../../../../shared/ui/components/Modal";
import { useBoard } from "../../../board/hooks/useBoard";
import { formatTimestamp, todayISO } from "../../utils/dates";
import { taskKey } from "../../utils/selectors";
import { validateTask } from "../../utils/validate";
import { TaskTypeIcon } from "./TaskMeta";

const statusOptions = STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }));
const priorityOptions = PRIORITIES.map((p) => ({ value: p, label: PRIORITY_LABELS[p] }));

// Field order matters: the first invalid one gets focus on submit.
const FIELD_ORDER = ["title", "description", "priority", "status", "dueDate"];

let initialValues = (task, status) =>
  task
    ? {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
      }
    : { ...EMPTY_TASK, status: status ?? EMPTY_TASK.status };

// Create and edit share one form. Errors appear after the first submit attempt,
// then update as the user types.
const TaskForm = ({ task, presetStatus, onSubmit, onCancel, onDelete, titleRef }) => {
  let [values, setValues] = useState(() => initialValues(task, presetStatus));
  let [submitted, setSubmitted] = useState(false);
  let formId = useId();
  let headingId = `${formId}-heading`;

  let { errors, isValid } = validateTask(values, task);
  let shown = submitted ? errors : {};

  let set = (name) => (e) => setValues((prev) => ({ ...prev, [name]: e.target.value }));

  let handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) {
      let first = FIELD_ORDER.find((name) => errors[name]);
      document.getElementById(`${formId}-${first}`)?.focus();
      return;
    }
    onSubmit(values);
  };

  return (
    <form noValidate onSubmit={handleSubmit} aria-labelledby={headingId}>
      <header className="flex items-center gap-2 px-5 pt-5 pb-3 md:px-6">
        {task && <TaskTypeIcon />}
        <h2 id={headingId} className="flex-1 text-lg font-semibold text-ink">
          {task ? `Edit ${taskKey(task)}` : "Create task"}
        </h2>
        <IconButton label="Close" onClick={onCancel} icon={<X size={18} aria-hidden="true" />} />
      </header>

      <div className="space-y-4 px-5 pt-1 pb-5 md:px-6">
        <p className="text-xs text-ink-500">
          Required fields are marked with an asterisk <span className="text-danger">*</span>
        </p>

        <TextField
          id={`${formId}-title`}
          inputRef={titleRef}
          label="Title"
          required
          value={values.title}
          onChange={set("title")}
          maxLength={TITLE_MAX + 20}
          placeholder="What needs to be done?"
          autoComplete="off"
          error={shown.title}
          counter={values.title.length > TITLE_MAX - 20 ? `${values.title.trim().length}/${TITLE_MAX}` : null}
        />

        <TextAreaField
          id={`${formId}-description`}
          label="Description"
          value={values.description}
          onChange={set("description")}
          placeholder="Add more detail, links or acceptance criteria"
          error={shown.description}
          counter={`${values.description.length}/${DESCRIPTION_MAX}`}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField
            id={`${formId}-priority`}
            label="Priority"
            required
            value={values.priority}
            onChange={set("priority")}
            options={priorityOptions}
            error={shown.priority}
          />
          <SelectField
            id={`${formId}-status`}
            label="Status"
            required
            value={values.status}
            onChange={set("status")}
            options={statusOptions}
            error={shown.status}
          />
          <TextField
            id={`${formId}-dueDate`}
            label="Due date"
            type="date"
            required
            min={task?.dueDate && task.dueDate < todayISO() ? task.dueDate : todayISO()}
            value={values.dueDate}
            onChange={set("dueDate")}
            error={shown.dueDate}
          />
        </div>

        {task && (
          <p className="text-xs text-ink-500">
            Created {formatTimestamp(task.createdAt)}
            {task.updatedAt !== task.createdAt && ` · Updated ${formatTimestamp(task.updatedAt)}`}
          </p>
        )}
      </div>

      <footer className="sticky bottom-0 flex items-center gap-2 border-t border-line bg-surface px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6">
        {task && (
          <Button
            variant="subtle"
            onClick={onDelete}
            icon={<Trash2 size={16} aria-hidden="true" />}
            className="text-danger-text hover:text-danger-text"
          >
            Delete
          </Button>
        )}
        <Button variant="subtle" onClick={onCancel} className="ml-auto">
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {task ? "Save changes" : "Create"}
        </Button>
      </footer>
    </form>
  );
};

const TaskDialog = () => {
  let { dialog, editing, dialogOpen, closeDialog, submitTask, requestDelete } = useBoard();
  let titleRef = useRef(null);

  return (
    <Modal open={dialogOpen} onClose={closeDialog} size="lg" initialFocusRef={titleRef}>
      {dialogOpen && (
        <TaskForm
          // Remount per task so the form never shows stale values.
          key={editing?.id ?? "new"}
          task={editing}
          presetStatus={dialog.status}
          titleRef={titleRef}
          onSubmit={submitTask}
          onCancel={closeDialog}
          onDelete={() => requestDelete(editing.id)}
        />
      )}
    </Modal>
  );
};

export default TaskDialog;
