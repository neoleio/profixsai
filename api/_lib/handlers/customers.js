import { sql } from "../db.js";
import { getSessionFromRequest } from "../auth.js";
import { logAction } from "../audit.js";
import { methodNotAllowed, sanitizeText, badRequest } from "../http.js";

async function listCustomers(req, res) {
  const q = sanitizeText(req.query?.q, 150);
  const rows = q
    ? await sql`
        select * from customers
        where full_name ilike ${"%" + q + "%"} or contact_number ilike ${"%" + q + "%"} or email ilike ${"%" + q + "%"}
        order by created_at desc limit 100
      `
    : await sql`select * from customers order by created_at desc limit 100`;
  res.status(200).json({ customers: rows });
}

async function createCustomer(req, res) {
  const full_name = sanitizeText(req.body?.full_name, 150);
  if (!full_name) return badRequest(res, "Customer name is required.");
  const contact_number = sanitizeText(req.body?.contact_number, 40);
  const email = sanitizeText(req.body?.email, 150);
  const address = sanitizeText(req.body?.address, 300);
  const rows = await sql`
    insert into customers (full_name, contact_number, email, address)
    values (${full_name}, ${contact_number}, ${email}, ${address})
    returning *
  `;
  await logAction({ userId: req.session.sub, action: "Created customer", entity: "customers", entityId: rows[0].id });
  res.status(201).json({ customer: rows[0] });
}

async function getCustomer(req, res, id) {
  const customerRows = await sql`select * from customers where id = ${id}`;
  if (!customerRows[0]) return res.status(404).json({ error: "Customer not found." });
  const devices = await sql`select * from devices where customer_id = ${id} order by created_at desc`;
  const jobOrders = await sql`
    select jo.*, d.brand, d.model, d.device_type
    from job_orders jo join devices d on d.id = jo.device_id
    where jo.customer_id = ${id} order by jo.created_at desc
  `;
  res.status(200).json({ customer: customerRows[0], devices, jobOrders });
}

async function updateCustomer(req, res, id) {
  const { full_name, contact_number, email, address } = req.body || {};
  const rows = await sql`
    update customers set
      full_name = coalesce(${full_name ? sanitizeText(full_name, 150) : null}, full_name),
      contact_number = coalesce(${contact_number ? sanitizeText(contact_number, 40) : null}, contact_number),
      email = coalesce(${email ? sanitizeText(email, 150) : null}, email),
      address = coalesce(${address ? sanitizeText(address, 300) : null}, address)
    where id = ${id}
    returning *
  `;
  if (!rows[0]) return res.status(404).json({ error: "Customer not found." });
  await logAction({ userId: req.session.sub, action: "Updated customer", entity: "customers", entityId: id });
  res.status(200).json({ customer: rows[0] });
}

export default async function handleCustomers(req, res, rest) {
  const session = getSessionFromRequest(req);
  if (!session || !["admin", "staff"].includes(session.role)) {
    return res.status(session ? 403 : 401).json({ error: session ? "You do not have permission to do that." : "Not authenticated." });
  }
  req.session = session;

  if (rest.length === 0) {
    if (req.method === "GET") return listCustomers(req, res);
    if (req.method === "POST") return createCustomer(req, res);
    return methodNotAllowed(res, ["GET", "POST"]);
  }
  if (rest.length === 1) {
    if (req.method === "GET") return getCustomer(req, res, rest[0]);
    if (req.method === "PUT") return updateCustomer(req, res, rest[0]);
    return methodNotAllowed(res, ["GET", "PUT"]);
  }
  res.status(404).json({ error: "Not found." });
}
