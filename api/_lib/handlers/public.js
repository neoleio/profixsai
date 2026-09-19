import { sql } from "../db.js";
import { methodNotAllowed, sanitizeText, badRequest } from "../http.js";

async function repairRequest(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  const full_name = sanitizeText(req.body?.full_name, 150);
  const contact_number = sanitizeText(req.body?.contact_number, 40);
  const email = sanitizeText(req.body?.email, 150);
  const device_description = sanitizeText(req.body?.device_description, 200);
  const problem_description = sanitizeText(req.body?.problem_description, 1000);

  if (!full_name || !contact_number || !device_description || !problem_description) {
    return badRequest(res, "Please fill in your name, contact number, device, and the problem you're having.");
  }

  const rows = await sql`
    insert into repair_requests (full_name, contact_number, email, device_description, problem_description)
    values (${full_name}, ${contact_number}, ${email}, ${device_description}, ${problem_description})
    returning id
  `;
  res.status(201).json({ ok: true, id: rows[0].id });
}

export default async function handlePublic(req, res, rest) {
  if (rest[0] === "repair-request") return repairRequest(req, res);
  res.status(404).json({ error: "Not found." });
}
