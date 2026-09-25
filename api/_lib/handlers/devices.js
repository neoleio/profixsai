import { sql } from "../db.js";
import { getSessionFromRequest } from "../auth.js";
import { logAction } from "../audit.js";
import { badRequest, methodNotAllowed, sanitizeText } from "../http.js";

async function listDevices(req, res) {
  const q = sanitizeText(req.query?.q, 150);
  const rows = q
    ? await sql`
        select d.*, c.full_name as customer_name
        from devices d join customers c on c.id = d.customer_id
        where d.serial_number ilike ${"%" + q + "%"} or d.imei ilike ${"%" + q + "%"}
           or d.brand ilike ${"%" + q + "%"} or d.model ilike ${"%" + q + "%"} or c.full_name ilike ${"%" + q + "%"}
        order by d.created_at desc limit 100
      `
    : await sql`
        select d.*, c.full_name as customer_name
        from devices d join customers c on c.id = d.customer_id
        order by d.created_at desc limit 100
      `;
  res.status(200).json({ devices: rows });
}

async function createDevice(req, res) {
  if (!["admin", "staff"].includes(req.session.role)) return res.status(403).json({ error: "You do not have permission to do that." });
  const { customer_id, device_type, brand, model, serial_number, imei, color, condition_notes } = req.body || {};
  if (!customer_id || !device_type) return badRequest(res, "Customer and device type are required.");
  const rows = await sql`
    insert into devices (customer_id, device_type, brand, model, serial_number, imei, color, condition_notes)
    values (${customer_id}, ${sanitizeText(device_type, 60)}, ${sanitizeText(brand, 100)}, ${sanitizeText(model, 100)},
      ${sanitizeText(serial_number, 100)}, ${sanitizeText(imei, 30)}, ${sanitizeText(color, 40)}, ${sanitizeText(condition_notes, 500)})
    returning *
  `;
  await logAction({ userId: req.session.sub, action: "Added device", entity: "devices", entityId: rows[0].id });
  res.status(201).json({ device: rows[0] });
}

async function getDeviceHistory(req, res, id) {
  const device = await sql`select * from devices where id = ${id}`;
  if (!device[0]) return res.status(404).json({ error: "Device not found." });
  const history = await sql`
    select id, job_no, status, reported_problem, diagnosis, repair_notes, date_received, released_at
    from job_orders where device_id = ${id} order by date_received desc
  `;
  res.status(200).json({ device: device[0], history });
}

export default async function handleDevices(req, res, rest) {
  const session = getSessionFromRequest(req);
  if (!session || !["admin", "staff", "technician"].includes(session.role)) {
    return res.status(session ? 403 : 401).json({ error: session ? "You do not have permission to do that." : "Not authenticated." });
  }
  req.session = session;

  if (rest.length === 0) {
    if (req.method === "GET") return listDevices(req, res);
    if (req.method === "POST") return createDevice(req, res);
    return methodNotAllowed(res, ["GET", "POST"]);
  }
  if (rest.length === 1) {
    if (req.method === "GET") return getDeviceHistory(req, res, rest[0]);
    return methodNotAllowed(res, ["GET"]);
  }
  res.status(404).json({ error: "Not found." });
}
