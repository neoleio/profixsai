// Small helpers shared by API routes.
export function methodNotAllowed(res, allowed) {
  res.setHeader("Allow", allowed.join(", "));
  res.status(405).json({ error: "Method not allowed." });
}

export function sanitizeText(value, maxLen = 2000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export function badRequest(res, message) {
  res.status(400).json({ error: message });
}
