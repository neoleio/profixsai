import { sql } from "../db.js";
import { getSessionFromRequest } from "../auth.js";
import { logAction } from "../audit.js";
import { methodNotAllowed, sanitizeText } from "../http.js";

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
  for (const [key, value] of Object.entries(updates)) {
    await sql`
      insert into system_settings (key, value) values (${key}, ${sanitizeText(String(value ?? ""), 2000)})
      on conflict (key) do update set value = excluded.value
    `;
  }
  await logAction({ userId: session.sub, action: "Updated site settings", entity: "system_settings", details: updates });
  res.status(200).json({ ok: true });
}

export default async function handleSettings(req, res, rest) {
  if (req.method === "GET") return getSettings(req, res);
  if (req.method === "PUT") return updateSettings(req, res);
  return methodNotAllowed(res, ["GET", "PUT"]);
}
