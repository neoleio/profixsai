import bcrypt from "bcryptjs";
import { sql } from "../db.js";
import { getSessionFromRequest } from "../auth.js";
import { logAction } from "../audit.js";
import { badRequest, methodNotAllowed, sanitizeText } from "../http.js";

async function listUsers(req, res) {
  const rows = await sql`
    select u.id, u.full_name, u.email, u.is_active, u.created_at, r.name as role
    from users u join roles r on r.id = u.role_id
    order by u.created_at desc
  `;
  res.status(200).json({ users: rows });
}

async function createUser(req, res) {
  if (req.session.role !== "admin") return res.status(403).json({ error: "Admin only." });
  const full_name = sanitizeText(req.body?.full_name, 150);
  const email = sanitizeText(req.body?.email, 150).toLowerCase();
  const role = req.body?.role;
  const password = req.body?.password;
  if (!full_name || !email || !password || !["admin", "staff", "technician"].includes(role)) {
    return badRequest(res, "Name, email, password, and a valid role are required.");
  }
  if (password.length < 8) return badRequest(res, "Password must be at least 8 characters.");

  const roleRow = await sql`select id from roles where name = ${role}`;
  const password_hash = await bcrypt.hash(password, 10);
  const rows = await sql`
    insert into users (full_name, email, password_hash, role_id)
    values (${full_name}, ${email}, ${password_hash}, ${roleRow[0].id})
    returning id, full_name, email
  `;
  await logAction({ userId: req.session.sub, action: `Created user ${email} (${role})`, entity: "users", entityId: rows[0].id });
  res.status(201).json({ user: rows[0] });
}

async function updateUser(req, res, id) {
  if (req.session.role !== "admin") return res.status(403).json({ error: "Admin only." });
  const { is_active, role } = req.body || {};
  if (typeof is_active === "boolean") await sql`update users set is_active = ${is_active} where id = ${id}`;
  if (role && ["admin", "staff", "technician"].includes(role)) {
    const roleRow = await sql`select id from roles where name = ${role}`;
    await sql`update users set role_id = ${roleRow[0].id} where id = ${id}`;
  }
  await logAction({ userId: req.session.sub, action: "Updated user", entity: "users", entityId: id, details: req.body });
  res.status(200).json({ ok: true });
}

export default async function handleUsers(req, res, rest) {
  const session = getSessionFromRequest(req);
  if (!session || !["admin", "staff"].includes(session.role)) {
    return res.status(session ? 403 : 401).json({ error: session ? "You do not have permission to do that." : "Not authenticated." });
  }
  req.session = session;

  if (rest.length === 0) {
    if (req.method === "GET") return listUsers(req, res);
    if (req.method === "POST") return createUser(req, res);
    return methodNotAllowed(res, ["GET", "POST"]);
  }
  if (rest.length === 1) {
    if (req.method === "PUT") return updateUser(req, res, rest[0]);
    return methodNotAllowed(res, ["PUT"]);
  }
  res.status(404).json({ error: "Not found." });
}
