import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Printer, Trash2, Eye } from "lucide-react";
import { api } from "../../lib/api.js";
import { formatDate } from "../../lib/date.js";
import { useAuth } from "../../lib/auth-context.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";

export default function JobOrders() {
  const { user } = useAuth();
  const [jobOrders, setJobOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const data = await api.get(`/job-orders?${params.toString()}`);
    setJobOrders(data.jobOrders);
    setStatuses(data.statuses);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line

  async function remove(id) {
    if (!confirm("Delete this job order? This cannot be undone.")) return;
    await api.del(`/job-orders?id=${id}`);
    load();
  }

  const visibleJobOrders = pageSize === "all" ? jobOrders : jobOrders.slice(0, pageSize);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl">Job Orders</h1>
          <p className="text-ink/60 mt-1">Track and manage every repair job.</p>
        </div>
        {(user.role === "admin" || user.role === "staff") && (
          <Link to="/admin/job-orders/new" className="btn-primary"><Plus size={16} /> New Job Order</Link>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); load(); }} className="flex flex-wrap gap-3 mt-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search job no, customer, serial, IMEI…"
            className="input pl-9"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-auto">
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="select-sm self-center"
        >
          <option value={5}>Show 5</option>
          <option value={10}>Show 10</option>
          <option value={25}>Show 25</option>
          <option value={50}>Show 50</option>
          <option value="all">Show All</option>
        </select>
        <button type="submit" className="btn-secondary">Filter</button>
      </form>

      <p className="text-xs text-ink/40 mt-3">
        Showing {visibleJobOrders.length} of {jobOrders.length} job order{jobOrders.length === 1 ? "" : "s"}
      </p>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/40 text-xs uppercase tracking-wide border-b border-ink/10">
              <th className="py-3 px-4">Job No.</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Device</th>
              <th className="py-3 px-4">Technician</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleJobOrders.map((j) => (
              <tr key={j.id} className="border-b border-ink/5 last:border-0">
                <td className="py-3 px-4 font-mono text-xs">{j.job_no}</td>
                <td className="py-3 px-4">{j.customer_name}</td>
                <td className="py-3 px-4">{j.brand} {j.model}</td>
                <td className="py-3 px-4">{j.technician_name || "—"}</td>
                <td className="py-3 px-4"><StatusBadge value={j.status} /></td>
                <td className="py-3 px-4"><StatusBadge value={j.payment_status} /></td>
                <td className="py-3 px-4 text-ink/60">{formatDate(j.date_received)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3 text-ink/50">
                    <Link to={`/admin/job-orders/${j.id}`} title="View / Edit" className="hover:text-brand-blue"><Eye size={16} /></Link>
                    <Link to={`/admin/order-slip?jobOrderId=${j.id}`} title="Print" className="hover:text-brand-blue"><Printer size={16} /></Link>
                    {user.role === "admin" && (
                      <button onClick={() => remove(j.id)} title="Delete" className="hover:text-brand-red"><Trash2 size={16} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && jobOrders.length === 0 && (
              <tr><td colSpan={8} className="py-8 text-center text-ink/40">No job orders match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
