import { sql } from "../db.js";
import { getSessionFromRequest } from "../auth.js";
import { logAction } from "../audit.js";
import { methodNotAllowed, sanitizeText, badRequest } from "../http.js";

async function listServices(req, res) {
  const activeOnly = req.query?.all !== "1";
  const rows = activeOnly
    ? await sql`select * from services where is_active = true order by sort_order asc`
    : await sql`select * from services order by sort_order asc`;
  res.status(200).json({ services: rows });
}

async function createService(req, res) {
  const name = sanitizeText(req.body?.name, 150);
  if (!name) return badRequest(res, "Service name is required.");
  const category = sanitizeText(req.body?.category, 100);
  const description = sanitizeText(req.body?.description, 1000);
  const icon = sanitizeText(req.body?.icon, 60) || "wrench";
  const rows = await sql`
    insert into services (name, category, description, icon, sort_order)
    values (${name}, ${category}, ${description}, ${icon}, coalesce((select max(sort_order) + 1 from services), 0))
    returning *
  `;
  await logAction({ userId: req.session.sub, action: "Created service", entity: "services", entityId: rows[0].id });
  res.status(201).json({ service: rows[0] });
}

async function updateService(req, res, id) {
  const { name, category, description, icon, is_active, sort_order } = req.body || {};
  const rows = await sql`
    update services set
      name = coalesce(${name ? sanitizeText(name, 150) : null}, name),
      category = coalesce(${category ? sanitizeText(category, 100) : null}, category),
      description = coalesce(${description ? sanitizeText(description, 1000) : null}, description),
      icon = coalesce(${icon ? sanitizeText(icon, 60) : null}, icon),
      is_active = coalesce(${typeof is_active === "boolean" ? is_active : null}, is_active),
      sort_order = coalesce(${typeof sort_order === "number" ? sort_order : null}, sort_order)
    where id = ${id}
    returning *
  `;
  if (!rows[0]) return res.status(404).json({ error: "Service not found." });
  await logAction({ userId: req.session.sub, action: "Updated service", entity: "services", entityId: id });
  res.status(200).json({ service: rows[0] });
}

async function deleteService(req, res, id) {
  await sql`delete from services where id = ${id}`;
  await logAction({ userId: req.session.sub, action: "Deleted service", entity: "services", entityId: id });
  res.status(200).json({ ok: true });
}

export default async function handleServices(req, res, rest) {
  const needsAdmin = req.method !== "GET";
  if (needsAdmin) {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return res.status(session ? 403 : 401).json({ error: session ? "Admin only." : "Not authenticated." });
    }
    req.session = session;
  }

  if (rest.length === 0) {
    if (req.method === "GET") return listServices(req, res);
    if (req.method === "POST") return createService(req, res);
    return methodNotAllowed(res, ["GET", "POST"]);
  }
  if (rest.length === 1) {
    if (req.method === "PUT") return updateService(req, res, rest[0]);
    if (req.method === "DELETE") return deleteService(req, res, rest[0]);
    return methodNotAllowed(res, ["PUT", "DELETE"]);
  }
  res.status(404).json({ error: "Not found." });
}
