import { sql } from "../db.js";
import { getSessionFromRequest } from "../auth.js";
import { methodNotAllowed } from "../http.js";

export default async function handleAuditLogs(req, res, rest) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  const session = getSessionFromRequest(req);
  if (!session || session.role !== "admin") {
    return res.status(session ? 403 : 401).json({ error: session ? "Admin only." : "Not authenticated." });
  }
  const rows = await sql`
    select a.*, u.full_name as user_name
    from audit_logs a left join users u on u.id = a.user_id
    order by a.created_at desc limit 300
  `;
  res.status(200).json({ auditLogs: rows });
}
