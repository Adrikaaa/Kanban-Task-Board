// Due dates are stored as local "YYYY-MM-DD" strings (what <input type="date"> gives us),
// so comparisons never shift a day because of time zones.

let pad = (n) => String(n).padStart(2, "0");

export let toISODate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export let todayISO = () => toISODate(new Date());

export let addDays = (iso, days) => {
  let date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
};

export let isISODate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return toISODate(parseISODate(value)) === value;
};

export let parseISODate = (iso) => {
  let [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

let daysBetween = (fromISO, toISO) =>
  Math.round((parseISODate(toISO) - parseISODate(fromISO)) / 86_400_000);

// "Oct 31", or "Oct 31, 2027" when it is not this year.
export let formatDate = (iso) => {
  let date = parseISODate(iso);
  let sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
};

// How urgent a due date is. Completed tasks are never overdue.
export let getDueState = (iso, status) => {
  if (!iso) return null;
  if (status === "completed") return "done";
  let diff = daysBetween(todayISO(), iso);
  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  if (diff <= 2) return "soon";
  return "later";
};

export let formatTimestamp = (ms) =>
  new Date(ms).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
