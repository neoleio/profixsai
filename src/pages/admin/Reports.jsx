import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Download, ShieldCheck, ArrowLeft } from "lucide-react";
import { api } from "../../lib/api.js";
import StatusBadge from "../../components/admin/StatusBadge.jsx";

export default function Reports() {
  const [revenue, setRevenue] = useState([]);
  const [summary, setSummary] = useState(null);
  const [warranties, setWarranties] = useState([]);
  const [warrantyFilter, setWarrantyFilter] = useState("");

  useEffect(() => {
    api.get("/reports?type=revenue").then(({ revenue }) => setRevenue(revenue));
    api.get("/reports?type=summary").then(setSummary);
    api.get("/reports?type=warranties").then(({ warranties }) => setWarranties(warranties));
  }, []);

  function exportCsv() {
    const rows = [["Month", "Revenue (PHP)"]];
    revenue.forEach((r) => rows.push([r.month, Number(r.total).toFixed(2)]));

    if (summary) {
      rows.push([]);
      rows.push(["Metric", "Value"]);
      rows.push(["Today's Income (PHP)", Number(summary.income.today).toFixed(2)]);
      rows.push(["This Month's Income (PHP)", Number(summary.income.this_month).toFixed(2)]);
      rows.push(["All-Time Income (PHP)", Number(summary.income.all_time).toFixed(2)]);
      rows.push(["Total Job Orders", summary.totals.total]);
      rows.push(["Pending", summary.totals.pending]);
      rows.push(["Ongoing", summary.totals.ongoing]);
      rows.push(["Completed", summary.totals.completed]);
      rows.push(["Released", summary.totals.released]);
      rows.push(["Unpaid Transactions", summary.totals.unpaid]);
      rows.push(["Today's Job Orders", summary.totals.today]);
    }

    if (warranties.length) {
      rows.push([]);
      rows.push(["Job No.", "Customer", "Device", "Coverage", "Ends On", "Status"]);
      warranties.forEach((w) =>
        rows.push([w.job_no, w.customer_name, `${w.brand} ${w.model}`, w.coverage || "", w.ends_on, w.warranty_status])
      );
    }

    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profixsai-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function csvEscape(value) {
    const str = String(value ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  }

  const visibleWarranties = warrantyFilter ? warranties.filter((w) => w.warranty_status === warrantyFilter) : warranties;

  return (
    <div>
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 hover:text-brand-blue transition-colors">
        <ArrowLeft size={15} /> Back to Dashboard
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
        <div>
          <h1 className="font-display font-bold text-2xl">Reports</h1>
          <p className="text-ink/60 mt-1">Income, revenue trends, and warranty tracking in one place.</p>
        </div>
        <button onClick={exportCsv} className="btn-secondary">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Income overview */}
      <section className="mt-8">
        <h2 className="font-display font-semibold text-sm uppercase tracking-wide text-ink/40 mb-3">Income Overview</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-2xl font-display font-bold text-emerald-600">₱{summary ? Number(summary.income.today).toFixed(2) : "—"}</p>
            <p className="text-sm text-ink/50 mt-1">Today's Income</p>
          </div>
          <div className="card p-5">
            <p className="text-2xl font-display font-bold text-brand-blue">₱{summary ? Number(summary.income.this_month).toFixed(2) : "—"}</p>
            <p className="text-sm text-ink/50 mt-1">This Month's Income</p>
          </div>
          <div className="card p-5">
            <p className="text-2xl font-display font-bold">₱{summary ? Number(summary.income.all_time).toFixed(2) : "—"}</p>
            <p className="text-sm text-ink/50 mt-1">All-Time Income</p>
          </div>
        </div>
      </section>

      {/* Revenue trend */}
      <section className="mt-8">
        <h2 className="font-display font-semibold text-sm uppercase tracking-wide text-ink/40 mb-3">Revenue Trend</h2>
        <div className="card p-6">
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `₱${Number(v).toFixed(2)}`} />
                <Bar dataKey="total" fill="#2F80ED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {revenue.length === 0 && <p className="text-center text-ink/40 text-sm mt-4">No payments recorded yet.</p>}
        </div>
      </section>

      {/* Job order snapshot */}
      {summary && (
        <section className="mt-8">
          <h2 className="font-display font-semibold text-sm uppercase tracking-wide text-ink/40 mb-3">Job Order Snapshot</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card p-5"><p className="text-2xl font-display font-bold">{summary.totals.total}</p><p className="text-sm text-ink/50 mt-1">Total Job Orders</p></div>
            <div className="card p-5"><p className="text-2xl font-display font-bold">{summary.totals.completed}</p><p className="text-sm text-ink/50 mt-1">Completed Repairs</p></div>
            <div className="card p-5"><p className="text-2xl font-display font-bold">{summary.totals.unpaid}</p><p className="text-sm text-ink/50 mt-1">Unpaid Transactions</p></div>
          </div>
        </section>
      )}

      {/* Warranty tracker */}
      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="font-display font-semibold text-sm uppercase tracking-wide text-ink/40">Warranty Tracker</h2>
          <select value={warrantyFilter} onChange={(e) => setWarrantyFilter(e.target.value)} className="select-sm">
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        {summary && (
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div className="card p-4 flex items-center gap-3">
              <ShieldCheck size={20} className="text-emerald-600" />
              <div><p className="font-display font-bold">{summary.warrantyCounts.active}</p><p className="text-xs text-ink/50">Active</p></div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <ShieldCheck size={20} className="text-amber-500" />
              <div><p className="font-display font-bold">{summary.warrantyCounts.expiring_soon}</p><p className="text-xs text-ink/50">Expiring in 14 Days</p></div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <ShieldCheck size={20} className="text-ink/30" />
              <div><p className="font-display font-bold">{summary.warrantyCounts.expired}</p><p className="text-xs text-ink/50">Expired</p></div>
            </div>
          </div>
        )}

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 text-xs uppercase tracking-wide border-b border-ink/10">
                <th className="py-3 px-4">Job No.</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Coverage</th>
                <th className="py-3 px-4">Ends On</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleWarranties.map((w) => (
                <tr key={w.id} className="border-b border-ink/5 last:border-0">
                  <td className="py-3 px-4 font-mono text-xs">
                    <Link to={`/admin/job-orders/${w.job_order_id}`} className="text-brand-blue hover:underline">{w.job_no}</Link>
                  </td>
                  <td className="py-3 px-4">{w.customer_name}</td>
                  <td className="py-3 px-4">{w.brand} {w.model}</td>
                  <td className="py-3 px-4 text-ink/60">{w.coverage || "—"}</td>
                  <td className="py-3 px-4 text-ink/60">{w.ends_on}</td>
                  <td className="py-3 px-4"><StatusBadge value={w.warranty_status} /></td>
                </tr>
              ))}
              {visibleWarranties.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-ink/40">
                  {warranties.length === 0 ? "No warranties recorded yet — set one from a job order's detail page." : "No warranties match this filter."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
