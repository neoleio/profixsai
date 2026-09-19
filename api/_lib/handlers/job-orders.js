import { sql } from "../db.js";
import { getSessionFromRequest } from "../auth.js";
import { logAction } from "../audit.js";
import { badRequest, methodNotAllowed, sanitizeText } from "../http.js";

const STATUSES = ["Received", "Diagnosing", "Waiting for Approval", "Repairing", "Quality Check", "Completed", "Released"];

async function generateJobNo() {
  const year = new Date().getFullYear();
  const rows = await sql`select count(*)::int as count from job_orders where job_no like ${"JO-" + year + "-%"}`;
  const next = (rows[0].count + 1).toString().padStart(4, "0");
  return `JO-${year}-${next}`;
}

async function listJobOrders(req, res) {
  const { q, status, payment_status, technician_id, date_from, date_to } = req.query || {};
  let rows = await sql`
    select jo.*, c.full_name as customer_name, c.contact_number,
           d.device_type, d.brand, d.model, d.serial_number, d.imei,
           u.full_name as technician_name
    from job_orders jo
    join customers c on c.id = jo.customer_id
    join devices d on d.id = jo.device_id
    left join users u on u.id = jo.technician_id
    order by jo.created_at desc
    limit 500
  `;

  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter((r) =>
      [r.job_no, r.customer_name, r.contact_number, r.brand, r.model, r.serial_number, r.imei]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(needle))
    );
  }
  if (status) rows = rows.filter((r) => r.status === status);
  if (payment_status) rows = rows.filter((r) => r.payment_status === payment_status);
  if (technician_id) rows = rows.filter((r) => r.technician_id === technician_id);
  if (date_from) rows = rows.filter((r) => r.date_received >= date_from);
  if (date_to) rows = rows.filter((r) => r.date_received <= date_to);
  if (req.session.role === "technician") rows = rows.filter((r) => r.technician_id === req.session.sub);

  res.status(200).json({ jobOrders: rows, statuses: STATUSES });
}

async function createJobOrder(req, res) {
  if (!["admin", "staff"].includes(req.session.role)) return res.status(403).json({ error: "You do not have permission to do that." });
  const b = req.body || {};
  if (!b.customer_id || !b.device_id) return badRequest(res, "Customer and device are required.");

  const job_no = await generateJobNo();
  const rows = await sql`
    insert into job_orders (
      job_no, customer_id, device_id, reported_problem, diagnosis, requested_repair,
      parts_required, technician_id, repair_notes, estimated_cost, final_cost, capital_cost, profit,
      status, payment_status, date_received, expected_completion, warranty_info, created_by
    ) values (
      ${job_no}, ${b.customer_id}, ${b.device_id},
      ${sanitizeText(b.reported_problem, 1000)}, ${sanitizeText(b.diagnosis, 1000)}, ${sanitizeText(b.requested_repair, 1000)},
      ${sanitizeText(b.parts_required, 1000)}, ${b.technician_id || null}, ${sanitizeText(b.repair_notes, 2000)},
      ${Number(b.estimated_cost) || 0}, ${Number(b.final_cost) || 0}, ${Number(b.capital_cost) || 0}, ${(Number(b.final_cost) || 0) - (Number(b.capital_cost) || 0)},
      ${b.status && STATUSES.includes(b.status) ? b.status : "Received"},
      ${b.payment_status || "Unpaid"}, ${b.date_received || new Date().toISOString().slice(0, 10)},
      ${b.expected_completion || null}, ${sanitizeText(b.warranty_info, 500)}, ${req.session.sub}
    )
    returning *
  `;
  await logAction({ userId: req.session.sub, action: `Created job order ${job_no}`, entity: "job_orders", entityId: rows[0].id });
  res.status(201).json({ jobOrder: rows[0] });
}

async function getJobOrder(req, res, id) {
  const rows = await sql`
    select jo.*, c.full_name as customer_name, c.contact_number, c.email as customer_email, c.address,
           d.device_type, d.brand, d.model, d.serial_number, d.imei, d.color,
           u.full_name as technician_name
    from job_orders jo
    join customers c on c.id = jo.customer_id
    join devices d on d.id = jo.device_id
    left join users u on u.id = jo.technician_id
    where jo.id = ${id}
  `;
  if (!rows[0]) return res.status(404).json({ error: "Job order not found." });
  if (req.session.role === "technician" && rows[0].technician_id !== req.session.sub) {
    return res.status(403).json({ error: "This job order is not assigned to you." });
  }
  const items = await sql`select * from job_order_items where job_order_id = ${id}`;
  const payments = await sql`select * from payments where job_order_id = ${id} order by paid_at asc`;
  const warrantyRows = await sql`select * from warranties where job_order_id = ${id}`;
  res.status(200).json({ jobOrder: rows[0], items, payments, warranty: warrantyRows[0] || null });
}

async function updateJobOrder(req, res, id) {
  const existing = await sql`select technician_id from job_orders where id = ${id}`;
  if (!existing[0]) return res.status(404).json({ error: "Job order not found." });
  if (req.session.role === "technician" && existing[0].technician_id !== req.session.sub) {
    return res.status(403).json({ error: "This job order is not assigned to you." });
  }
  const b = req.body || {};
  const isTechnician = req.session.role === "technician";

  const finalCost = !isTechnician && b.final_cost !== undefined ? Number(b.final_cost) : null;
  const capitalCost = !isTechnician && b.capital_cost !== undefined ? Number(b.capital_cost) : null;

  const rows = await sql`
    update job_orders set
      diagnosis = coalesce(${b.diagnosis !== undefined ? sanitizeText(b.diagnosis, 1000) : null}, diagnosis),
      repair_notes = coalesce(${b.repair_notes !== undefined ? sanitizeText(b.repair_notes, 2000) : null}, repair_notes),
      status = coalesce(${b.status || null}, status),
      reported_problem = coalesce(${!isTechnician && b.reported_problem !== undefined ? sanitizeText(b.reported_problem, 1000) : null}, reported_problem),
      requested_repair = coalesce(${!isTechnician && b.requested_repair !== undefined ? sanitizeText(b.requested_repair, 1000) : null}, requested_repair),
      parts_required = coalesce(${!isTechnician && b.parts_required !== undefined ? sanitizeText(b.parts_required, 1000) : null}, parts_required),
      technician_id = coalesce(${!isTechnician ? (b.technician_id || null) : null}, technician_id),
      estimated_cost = coalesce(${!isTechnician && b.estimated_cost !== undefined ? Number(b.estimated_cost) : null}, estimated_cost),
      final_cost = coalesce(${finalCost}, final_cost),
      capital_cost = coalesce(${capitalCost}, capital_cost),
      profit = coalesce(${finalCost}, final_cost) - coalesce(${capitalCost}, capital_cost),
      payment_status = coalesce(${!isTechnician ? (b.payment_status || null) : null}, payment_status),
      expected_completion = coalesce(${!isTechnician ? (b.expected_completion || null) : null}, expected_completion),
      warranty_info = coalesce(${!isTechnician && b.warranty_info !== undefined ? sanitizeText(b.warranty_info, 500) : null}, warranty_info),
      released_at = case when ${b.status || null} = 'Released' then coalesce(released_at, current_date) else released_at end,
      updated_at = now()
    where id = ${id}
    returning *
  `;
  await logAction({ userId: req.session.sub, action: "Updated job order", entity: "job_orders", entityId: id, details: b });
  res.status(200).json({ jobOrder: rows[0] });
}

async function deleteJobOrder(req, res, id) {
  if (req.session.role !== "admin") return res.status(403).json({ error: "Admin only." });
  const rows = await sql`select job_no from job_orders where id = ${id}`;
  if (!rows[0]) return res.status(404).json({ error: "Job order not found." });
  await sql`delete from job_orders where id = ${id}`;
  await logAction({ userId: req.session.sub, action: `Deleted job order ${rows[0].job_no}`, entity: "job_orders", entityId: id });
  res.status(200).json({ ok: true });
}

async function updateStatus(req, res, id) {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) return badRequest(res, "Invalid status.");
  const existing = await sql`select technician_id from job_orders where id = ${id}`;
  if (!existing[0]) return res.status(404).json({ error: "Job order not found." });
  if (req.session.role === "technician" && existing[0].technician_id !== req.session.sub) {
    return res.status(403).json({ error: "This job order is not assigned to you." });
  }
  const rows = await sql`
    update job_orders set
      status = ${status},
      released_at = case when ${status} = 'Released' then coalesce(released_at, current_date) else released_at end,
      updated_at = now()
    where id = ${id}
    returning *
  `;
  await logAction({ userId: req.session.sub, action: `Set status to ${status}`, entity: "job_orders", entityId: id });
  res.status(200).json({ jobOrder: rows[0] });
}

async function addPayment(req, res, id) {
  if (!["admin", "staff"].includes(req.session.role)) return res.status(403).json({ error: "You do not have permission to do that." });
  const { amount, method } = req.body || {};
  if (!amount || Number(amount) <= 0) return badRequest(res, "Enter a valid payment amount.");

  const rows = await sql`
    insert into payments (job_order_id, amount, method, received_by)
    values (${id}, ${Number(amount)}, ${method || "Cash"}, ${req.session.sub})
    returning *
  `;
  const totals = await sql`
    select jo.final_cost, coalesce(sum(p.amount), 0) as paid
    from job_orders jo left join payments p on p.job_order_id = jo.id
    where jo.id = ${id}
    group by jo.final_cost
  `;
  const paid = Number(totals[0]?.paid || 0);
  const final = Number(totals[0]?.final_cost || 0);
  const paymentStatus = paid <= 0 ? "Unpaid" : paid >= final && final > 0 ? "Paid" : "Partial";
  await sql`update job_orders set payment_status = ${paymentStatus} where id = ${id}`;
  await logAction({ userId: req.session.sub, action: `Recorded payment of ${amount}`, entity: "job_orders", entityId: id });
  res.status(201).json({ payment: rows[0], payment_status: paymentStatus });
}

async function setWarranty(req, res, id) {
  if (!["admin", "staff"].includes(req.session.role)) return res.status(403).json({ error: "You do not have permission to do that." });
  const { coverage, starts_on, ends_on } = req.body || {};
  if (!ends_on) return badRequest(res, "A warranty end date is required.");

  const existing = await sql`select id from warranties where job_order_id = ${id}`;
  let rows;
  if (existing[0]) {
    rows = await sql`
      update warranties set
        coverage = ${sanitizeText(coverage, 300)},
        starts_on = ${starts_on || null},
        ends_on = ${ends_on}
      where job_order_id = ${id}
      returning *
    `;
  } else {
    rows = await sql`
      insert into warranties (job_order_id, coverage, starts_on, ends_on)
      values (${id}, ${sanitizeText(coverage, 300)}, ${starts_on || null}, ${ends_on})
      returning *
    `;
  }
  await logAction({ userId: req.session.sub, action: "Set warranty period", entity: "job_orders", entityId: id });
  res.status(200).json({ warranty: rows[0] });
}

export default async function handleJobOrders(req, res, rest) {
  const session = getSessionFromRequest(req);
  if (!session || !["admin", "staff", "technician"].includes(session.role)) {
    return res.status(session ? 403 : 401).json({ error: session ? "You do not have permission to do that." : "Not authenticated." });
  }
  req.session = session;

  if (rest.length === 0) {
    if (req.method === "GET") return listJobOrders(req, res);
    if (req.method === "POST") return createJobOrder(req, res);
    return methodNotAllowed(res, ["GET", "POST"]);
  }

  const [id, sub] = rest;

  if (rest.length === 1) {
    if (req.method === "GET") return getJobOrder(req, res, id);
    if (req.method === "PUT") return updateJobOrder(req, res, id);
    if (req.method === "DELETE") return deleteJobOrder(req, res, id);
    return methodNotAllowed(res, ["GET", "PUT", "DELETE"]);
  }

  if (rest.length === 2 && sub === "status") {
    if (req.method === "PUT") return updateStatus(req, res, id);
    return methodNotAllowed(res, ["PUT"]);
  }

  if (rest.length === 2 && sub === "payments") {
    if (req.method === "POST") return addPayment(req, res, id);
    return methodNotAllowed(res, ["POST"]);
  }

  if (rest.length === 2 && sub === "warranty") {
    if (req.method === "PUT") return setWarranty(req, res, id);
    return methodNotAllowed(res, ["PUT"]);
  }

  res.status(404).json({ error: "Not found." });
}
