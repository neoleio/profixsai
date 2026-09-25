import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api.js";
import StatusBadge from "../../components/admin/StatusBadge.jsx";

export default function CustomerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => { api.get(`/customers?id=${id}`).then(setData).catch(() => {}); }, [id]);

  if (!data) return <p className="text-ink/50">Loading…</p>;
  const { customer, devices, jobOrders } = data;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display font-bold text-2xl">{customer.full_name}</h1>
      <p className="text-ink/60 mt-1">{customer.contact_number} {customer.email && `· ${customer.email}`}</p>
      {customer.address && <p className="text-ink/50 text-sm mt-1">{customer.address}</p>}

      <section className="mt-8">
        <h2 className="font-display font-semibold mb-3">Devices</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {devices.map((d) => (
            <div key={d.id} className="card p-4">
              <p className="font-medium">{d.device_type} — {d.brand} {d.model}</p>
              <p className="text-xs text-ink/50 mt-1">SN: {d.serial_number || "—"} · IMEI: {d.imei || "—"}</p>
            </div>
          ))}
          {devices.length === 0 && <p className="text-ink/40 text-sm">No devices on file.</p>}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display font-semibold mb-3">Repair History</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 text-xs uppercase tracking-wide border-b border-ink/10">
                <th className="py-3 px-4">Job No.</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {jobOrders.map((j) => (
                <tr key={j.id} className="border-b border-ink/5 last:border-0">
                  <td className="py-3 px-4 font-mono text-xs">
                    <Link to={`/admin/job-orders/${j.id}`} className="text-brand-blue hover:underline">{j.job_no}</Link>
                  </td>
                  <td className="py-3 px-4">{j.brand} {j.model}</td>
                  <td className="py-3 px-4"><StatusBadge value={j.status} /></td>
                  <td className="py-3 px-4">₱{Number(j.final_cost).toFixed(2)}</td>
                </tr>
              ))}
              {jobOrders.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-ink/40">No repair history yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
