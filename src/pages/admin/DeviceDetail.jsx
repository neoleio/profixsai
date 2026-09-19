import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api.js";
import StatusBadge from "../../components/admin/StatusBadge.jsx";

export default function DeviceDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => { api.get(`/devices?id=${id}`).then(setData).catch(() => {}); }, [id]);

  if (!data) return <p className="text-ink/50">Loading…</p>;
  const { device, history } = data;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-bold text-2xl">{device.device_type} — {device.brand} {device.model}</h1>
      <p className="text-ink/60 mt-1">Serial: {device.serial_number || "—"} · IMEI: {device.imei || "—"} · Color: {device.color || "—"}</p>
      {device.condition_notes && <p className="text-sm text-ink/50 mt-1">Condition: {device.condition_notes}</p>}

      <h2 className="font-display font-semibold mt-8 mb-3">Repair History</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/40 text-xs uppercase tracking-wide border-b border-ink/10">
              <th className="py-3 px-4">Job No.</th>
              <th className="py-3 px-4">Problem</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id} className="border-b border-ink/5 last:border-0">
                <td className="py-3 px-4 font-mono text-xs">
                  <Link to={`/admin/job-orders/${h.id}`} className="text-brand-blue hover:underline">{h.job_no}</Link>
                </td>
                <td className="py-3 px-4">{h.reported_problem}</td>
                <td className="py-3 px-4"><StatusBadge value={h.status} /></td>
                <td className="py-3 px-4 text-ink/60">{h.date_received}</td>
              </tr>
            ))}
            {history.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-ink/40">No repair history yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
