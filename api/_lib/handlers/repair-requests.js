import { sql } from "../db.js";
import { getSessionFromRequest } from "../auth.js";
import { logAction } from "../audit.js";
import { badRequest, methodNotAllowed } from "../http.js";

// Admin-side view of leads submitted through the public "Book a Repair" form.

const STATUSES = ["New", "Converted", "Dismissed"];

async function listRequests(req, res) {
  const rows = await sql`select * from repair_requests order by created_at desc limit 200`;
  res.status(200).json({ repairRequests: rows });
}

async function updateStatus(req, res, id) {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) return badRequest(res, "Invalid status.");
  const rows = await sql`update repair_requests set status = ${status} where id = ${id} returning *`;
  if (!rows[0]) return res.status(404).json({ error: "Request not found." });
  await logAction({ userId: req.session.sub, action: `Marked repair request as ${status}`, entity: "repair_requests", entityId: id });
  res.status(200).json({ repairRequest: rows[0] });
}

export default async function handleRepairRequests(req, res, rest) {
  const session = getSessionFromRequest(req);
  if (!session || !["admin", "staff"].includes(session.role)) {
    return res.status(session ? 403 : 401).json({ error: session ? "You do not have permission to do that." : "Not authenticated." });
  }
  req.session = session;

  if (rest.length === 0) {
    if (req.method === "GET") return listRequests(req, res);
    return methodNotAllowed(res, ["GET"]);
  }
  if (rest.length === 1) {
    if (req.method === "PUT") return updateStatus(req, res, rest[0]);
    return methodNotAllowed(res, ["PUT"]);
  }
  res.status(404).json({ error: "Not found." });
}
