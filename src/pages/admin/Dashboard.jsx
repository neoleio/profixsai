import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { api } from "../../lib/api.js";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import { StaggerGroup, StaggerItem } from "../../components/motion/index.jsx";

const CARD_DEFS = [
  { key: "total", label: "Total Job Orders" },
  { key: "pending", label: "Pending Repairs" },
  { key: "ongoing", label: "Ongoing Repairs" },
  { key: "completed", label: "Completed Repairs" },
  { key: "released", label: "Released Devices" },
  { key: "unpaid", label: "Unpaid Transactions" },
  { key: "today", label: "Today's Job Orders" }
];

const COLORS = ["#2F80ED", "#E23744", "#22C55E", "#A855F7", "#F59E0B", "#64748B", "#0B0F16"];

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/reports?type=summary").then(setData).catch(() => {});
  }, []);

  if (!data) return <p className="text-ink/50">Loading dashboard…</p>;

  return (
    <div>
      <h1 className="font-display font-bold text-2xl">Dashboard</h1>
      <p className="text-ink/60 mt-1">A snapshot of everything happening at ProFixSAI right now.</p>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 card p-5 bg-ink text-white border-none">
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide">Today's Income</p>
            <p className="font-display font-bold text-2xl mt-1">₱{Number(data.income.today).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide">This Month's Income</p>
            <p className="font-display font-bold text-2xl mt-1">₱{Number(data.income.this_month).toFixed(2)}</p>
          </div>
        </div>
        <Link to="/admin/reports" className="text-sm font-semibold text-brand-blue hover:text-white transition-colors whitespace-nowrap">
          View Full Reports →
        </Link>
      </div>

      <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {CARD_DEFS.map(({ key, label }) => (
          <StaggerItem key={key} className="card p-5">
            <p className="text-3xl font-display font-bold">{data.totals[key]}</p>
            <p className="text-sm text-ink/50 mt-1">{label}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">Recent Transactions</h2>
            <Link to="/admin/job-orders" className="text-sm text-brand-blue font-semibold">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink/40 text-xs uppercase tracking-wide">
                  <th className="py-2 pr-3">Job No.</th>
                  <th className="py-2 pr-3">Customer</th>
                  <th className="py-2 pr-3">Device</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((r) => (
                  <tr key={r.id} className="border-t border-ink/5">
                    <td className="py-2.5 pr-3 font-mono text-xs">
                      <Link to={`/admin/job-orders/${r.id}`} className="text-brand-blue hover:underline">{r.job_no}</Link>
                    </td>
                    <td className="py-2.5 pr-3">{r.customer_name}</td>
                    <td className="py-2.5 pr-3">{r.brand} {r.model}</td>
                    <td className="py-2.5 pr-3"><StatusBadge value={r.status} /></td>
                    <td className="py-2.5 pr-3"><StatusBadge value={r.payment_status} /></td>
                  </tr>
                ))}
                {data.recent.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-ink/40">No job orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold mb-2">Jobs by Status</h2>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.byStatus} dataKey="count" nameKey="status" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {data.byStatus.map((entry, i) => <Cell key={entry.status} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1">
            {data.byStatus.map((s, i) => (
              <li key={s.status} className="flex items-center gap-2 text-xs text-ink/60">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {s.status} — {s.count}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
