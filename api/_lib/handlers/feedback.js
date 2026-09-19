import { sql } from "../db.js";
import { getSessionFromRequest } from "../auth.js";
import { logAction } from "../audit.js";
import { badRequest, methodNotAllowed, sanitizeText } from "../http.js";

const STATUSES = ["New", "Read", "Archived"];

// Public — no auth. Anyone visiting the site can leave a message/review.
async function submitFeedback(req, res) {
  const full_name = sanitizeText(req.body?.full_name, 150);
  const email = sanitizeText(req.body?.email, 150);
  const message = sanitizeText(req.body?.message, 1500);
  const ratingRaw = req.body?.rating;
  const rating = Number.isInteger(ratingRaw) && ratingRaw >= 1 && ratingRaw <= 5 ? ratingRaw : null;

  if (!full_name || !message) {
    return badRequest(res, "Please include your name and a message.");
  }

  const rows = await sql`
    insert into feedback (full_name, email, rating, message)
    values (${full_name}, ${email}, ${rating}, ${message})
    returning id
  `;
  res.status(201).json({ ok: true, id: rows[0].id });
}

// Admin/staff only from here down.
async function listFeedback(req, res) {
  const rows = await sql`select * from feedback order by created_at desc limit 200`;
  res.status(200).json({ feedback: rows });
}

async function updateFeedbackStatus(req, res, id) {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) return badRequest(res, "Invalid status.");
  const rows = await sql`update feedback set status = ${status} where id = ${id} returning *`;
  if (!rows[0]) return res.status(404).json({ error: "Message not found." });
  await logAction({ userId: req.session.sub, action: `Marked message as ${status}`, entity: "feedback", entityId: id });
  res.status(200).json({ feedback: rows[0] });
}

export default async function handleFeedback(req, res, rest) {
  if (req.method === "POST" && rest.length === 0) return submitFeedback(req, res);

  const session = getSessionFromRequest(req);
  if (!session || !["admin", "staff"].includes(session.role)) {
    return res.status(session ? 403 : 401).json({ error: session ? "You do not have permission to do that." : "Not authenticated." });
  }
  req.session = session;

  if (rest.length === 0) {
    if (req.method === "GET") return listFeedback(req, res);
    return methodNotAllowed(res, ["GET", "POST"]);
  }
  if (rest.length === 1) {
    if (req.method === "PUT") return updateFeedbackStatus(req, res, rest[0]);
    return methodNotAllowed(res, ["PUT"]);
  }
  res.status(404).json({ error: "Not found." });
}
