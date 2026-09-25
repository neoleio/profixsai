import { sql } from "../db.js";
import { getSessionFromRequest } from "../auth.js";
import { methodNotAllowed } from "../http.js";

async function summary(req, res) {
  const totals = await sql`
    select
      count(*)::int as total,
      count(*) filter (where status not in ('Completed','Released'))::int as pending,
      count(*) filter (where status in ('Diagnosing','Waiting for Approval'))::int as ongoing,
      count(*) filter (where status = 'Completed')::int as completed,
      count(*) filter (where status = 'Released')::int as released,
      count(*) filter (where payment_status != 'Paid')::int as unpaid,
      count(*) filter (where date_received = current_date)::int as today
    from job_orders
  `;

  const income = await sql`
    select
      coalesce(sum(amount) filter (where paid_at::date = current_date), 0)::numeric as today,
      coalesce(sum(amount) filter (where date_trunc('month', paid_at) = date_trunc('month', current_date)), 0)::numeric as this_month,
      coalesce(sum(amount), 0)::numeric as all_time
    from payments
  `;

  const warrantyCounts = await sql`
    select
      count(*) filter (where ends_on >= current_date)::int as active,
      count(*) filter (where ends_on >= current_date and ends_on <= current_date + interval '14 days')::int as expiring_soon,
      count(*) filter (where ends_on < current_date)::int as expired
    from warranties
  `;

  const recent = await sql`
    select jo.id, jo.job_no, jo.status, jo.payment_status, jo.date_received, jo.final_cost,
           c.full_name as customer_name, d.brand, d.model
    from job_orders jo
    join customers c on c.id = jo.customer_id
    join devices d on d.id = jo.device_id
    order by jo.created_at desc limit 8
  `;
  const byStatus = await sql`select status, count(*)::int as count from job_orders group by status`;

  res.status(200).json({
    totals: totals[0],
    income: income[0],
    warrantyCounts: warrantyCounts[0],
    recent,
    byStatus
  });
}

async function revenue(req, res) {
  const rows = await sql`
    select to_char(date_trunc('month', paid_at), 'Mon YYYY') as month,
           date_trunc('month', paid_at) as month_start,
           sum(amount)::numeric as total
    from payments
    where paid_at > now() - interval '12 months'
    group by 1, 2
    order by 2 asc
  `;
  res.status(200).json({ revenue: rows });
}

async function warranties(req, res) {
  const rows = await sql`
    select w.id, w.coverage, w.starts_on, w.ends_on,
           jo.id as job_order_id, jo.job_no,
           c.full_name as customer_name,
           d.device_type, d.brand, d.model,
           case
             when w.ends_on < current_date then 'Expired'
             when w.ends_on <= current_date + interval '14 days' then 'Expiring Soon'
             else 'Active'
           end as warranty_status
    from warranties w
    join job_orders jo on jo.id = w.job_order_id
    join customers c on c.id = jo.customer_id
    join devices d on d.id = jo.device_id
    order by w.ends_on asc
  `;
  res.status(200).json({ warranties: rows });
}

export default async function handleReports(req, res, rest) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  const session = getSessionFromRequest(req);
  if (!session || !["admin", "staff", "technician"].includes(session.role)) {
    return res.status(session ? 403 : 401).json({ error: session ? "You do not have permission to do that." : "Not authenticated." });
  }
  req.session = session;
  const type = rest[0];
  if (type === "summary") return summary(req, res);
  if (type === "revenue" || type === "warranties") {
    if (!["admin", "staff"].includes(session.role)) return res.status(403).json({ error: "You do not have permission to do that." });
    if (type === "revenue") return revenue(req, res);
    return warranties(req, res);
  }
  res.status(404).json({ error: "Unknown report." });
}
