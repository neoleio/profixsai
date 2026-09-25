// Neon's driver returns `date`/`timestamp` columns as JS Date objects.
// When the API responds with res.json(), those get serialized via
// Date#toJSON() into full ISO strings like "2026-09-24T00:00:00.000Z" —
// fine for timestamps, but noisy for display and invalid for
// <input type="date">, which needs exactly "YYYY-MM-DD". Use these two
// helpers everywhere a date-only value from the API is shown or bound,
// instead of formatting ad hoc at each call site.

// For binding to <input type="date"> value.
export function toDateInputValue(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

// For human-readable display, e.g. "9/24/2026".
export function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}
