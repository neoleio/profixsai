// Small helpers shared by API routes.
export function methodNotAllowed(res, allowed) {
  res.setHeader("Allow", allowed.join(", "));
  res.status(405).json({ error: "Method not allowed." });
}

export function sanitizeText(value, maxLen = 2000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

// Service images are stored as data: URLs (client-side resized/compressed
// before upload) or plain http(s) links. Cap the length as a safety net —
// the client already keeps uploads well under this.
const MAX_IMAGE_URL_LENGTH = 2_000_000;
export function sanitizeImageUrl(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length > MAX_IMAGE_URL_LENGTH) return null;
  if (!/^https?:\/\//i.test(trimmed) && !/^data:image\/(png|jpeg|jpg|webp);base64,/i.test(trimmed)) return null;
  return trimmed;
}

export function badRequest(res, message) {
  res.status(400).json({ error: message });
}
