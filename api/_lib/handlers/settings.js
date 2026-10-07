import { sql } from "../db.js";
import { getSessionFromRequest } from "../auth.js";
import { logAction } from "../audit.js";
import { methodNotAllowed, sanitizeText } from "../http.js";

// Setting keys are simple identifiers. Page text and colors (Settings > Page
// Text & Colors) are stored as `<id>`, `<id>__color` and `<id>__bg`; "Added
// Text Blocks" are stored as one JSON string under `custom_blocks`.
const KEY_PATTERN = /^[a-z0-9_]{1,80}$/;
const COLOR_KEY = /__(color|bg)$/;
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const MAX_LEN = { custom_blocks: 20000 };

async function getSettings(req, res) {
  const rows = await sql`select key, value from system_settings`;
  res.status(200).json({ settings: Object.fromEntries(rows.map((r) => [r.key, r.value])) });
}

async function updateSettings(req, res) {
  const session = getSessionFromRequest(req);
  if (!session || session.role !== "admin") {
    return res.status(session ? 403 : 401).json({ error: session ? "Admin only." : "Not authenticated." });
  }
  const updates = req.body?.settings || {};
  const applied = {};

  for (const [key, raw] of Object.entries(updates)) {
    if (!KEY_PATTERN.test(key)) continue;
    let value = sanitizeText(String(raw ?? ""), MAX_LEN[key] || 2000);

    if (COLOR_KEY.test(key) && value !== "" && !HEX_COLOR.test(value)) continue; // ignore malformed colors

    if (key === "custom_blocks" && value !== "") {
      try {
        if (!Array.isArray(JSON.parse(value))) continue;
      } catch {
        continue; // not valid JSON — don't store it
      }
    }

    await sql`
      insert into system_settings (key, value) values (${key}, ${value})
      on conflict (key) do update set value = excluded.value
    `;
    applied[key] = key === "custom_blocks" ? "(updated added text blocks)" : value;
  }

  await logAction({ userId: session.sub, action: "Updated site settings", entity: "system_settings", details: applied });
  res.status(200).json({ ok: true });
}

export default async function handleSettings(req, res, rest) {
  if (req.method === "GET") return getSettings(req, res);
  if (req.method === "PUT") return updateSettings(req, res);
  return methodNotAllowed(res, ["GET", "PUT"]);
}
