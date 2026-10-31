import {
  DESCRIPTION_MAX,
  PRIORITIES,
  STATUSES,
  TITLE_MAX,
  TITLE_MIN,
} from "../../../app/constants/taskOptions";
import { isISODate, todayISO } from "./dates";

// Returns field errors that block submit. `original` is the task being edited, so an
// existing overdue date can be kept, but a new date must not be in the past.
export let validateTask = (values, original = null) => {
  let errors = {};

  let title = values.title.trim();
  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length < TITLE_MIN) {
    errors.title = `Title must be at least ${TITLE_MIN} characters.`;
  } else if (title.length > TITLE_MAX) {
    errors.title = `Title must be ${TITLE_MAX} characters or fewer.`;
  }

  if (values.description.length > DESCRIPTION_MAX) {
    errors.description = `Description must be ${DESCRIPTION_MAX} characters or fewer.`;
  }

  if (!PRIORITIES.includes(values.priority)) {
    errors.priority = "Choose a priority.";
  }
  if (!STATUSES.includes(values.status)) {
    errors.status = "Choose a status.";
  }

  if (!values.dueDate) {
    errors.dueDate = "Due date is required.";
  } else if (!isISODate(values.dueDate)) {
    errors.dueDate = "Enter a valid date.";
  } else if (values.dueDate < todayISO() && values.dueDate !== original?.dueDate) {
    errors.dueDate = "Due date can't be in the past.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

// Used when reading from storage: drops anything that is not a usable task.
export let sanitizeTask = (raw) => {
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw.id !== "string" || !raw.id) return null;
  if (typeof raw.title !== "string" || !raw.title.trim()) return null;
  if (!STATUSES.includes(raw.status)) return null;

  let createdAt = Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now();

  return {
    id: raw.id,
    number: Number.isInteger(raw.number) && raw.number > 0 ? raw.number : null,
    title: raw.title.trim().slice(0, TITLE_MAX),
    description:
      typeof raw.description === "string" ? raw.description.slice(0, DESCRIPTION_MAX) : "",
    priority: PRIORITIES.includes(raw.priority) ? raw.priority : "medium",
    status: raw.status,
    dueDate: isISODate(raw.dueDate) ? raw.dueDate : "",
    createdAt,
    updatedAt: Number.isFinite(raw.updatedAt) ? raw.updatedAt : createdAt,
  };
};
