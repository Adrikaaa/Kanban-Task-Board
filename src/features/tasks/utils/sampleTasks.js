import { addDays, todayISO } from "./dates";

const SAMPLES = [
  ["Real-time order status for shoppers", "Push status changes to the order page so shoppers don't need to refresh.", "high", "todo", 3],
  ["Guest checkout", "Let shoppers buy without creating an account. Ask for an email only.", "medium", "todo", 7],
  ["Promo codes at checkout", "", "low", "todo", 12],
  ["Delivery dates at checkout", "Show the estimated delivery window next to each shipping option.", "high", "in_progress", 1],
  ["Past purchase reordering", "One-click reorder from the order history page.", "medium", "in_progress", 5],
  ["Address search improvements", "", "low", "in_progress", 9],
  ["Design confirmation page", "Final layout approved by design. Includes order summary and next steps.", "medium", "completed", 0],
  ["Standardize \"Organic\" badge", "Use the same icon and colour on product cards and the product page.", "low", "completed", 2],
];

// Demo data for the empty board, with due dates relative to today.
export let createSampleTasks = (createId) => {
  let now = Date.now();
  let today = todayISO();
  return SAMPLES.map(([title, description, priority, status, dueIn], i) => ({
    id: createId(),
    number: i + 1,
    title,
    description,
    priority,
    status,
    dueDate: addDays(today, dueIn),
    createdAt: now - (SAMPLES.length - i) * 60_000,
    updatedAt: now - (SAMPLES.length - i) * 60_000,
  }));
};
