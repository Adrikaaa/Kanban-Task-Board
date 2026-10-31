// Thin wrappers around localStorage. Every call is guarded because storage can be
// blocked (private mode, browser settings) or full.

export let readJSON = (key, fallback) => {
  try {
    let raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

// Returns true when the value was saved.
export let writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};
