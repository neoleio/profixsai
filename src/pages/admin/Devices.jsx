import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { api } from "../../lib/api.js";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [q, setQ] = useState("");
  const [pageSize, setPageSize] = useState(5);

  async function load() {
    const params = q ? `?q=${encodeURIComponent(q)}` : "";
    const { devices } = await api.get(`/devices${params}`);
    setDevices(devices);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line

  const visibleDevices = pageSize === "all" ? devices : devices.slice(0, pageSize);

  return (
    <div>
      <h1 className="font-display font-bold text-2xl">Devices</h1>
      <p className="text-ink/60 mt-1">Search by serial number, IMEI, brand, model, or owner.</p>

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <form onSubmit={(e) => { e.preventDefault(); load(); }} className="relative max-w-sm flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search devices" className="input pl-9" />
        </form>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="select-sm self-center"
        >
          <option value={5}>Show 5</option>
          <option value={10}>Show 10</option>
          <option value={25}>Show 25</option>
          <option value="all">Show All</option>
        </select>
      </div>
      <p className="text-xs text-ink/40 mt-3">
        Showing {visibleDevices.length} of {devices.length} device{devices.length === 1 ? "" : "s"}
      </p>

      <div className="card mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/40 text-xs uppercase tracking-wide border-b border-ink/10">
              <th className="py-3 px-4">Device</th>
              <th className="py-3 px-4">Serial / IMEI</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {visibleDevices.map((d) => (
              <tr key={d.id} className="border-b border-ink/5 last:border-0">
                <td className="py-3 px-4">{d.device_type} — {d.brand} {d.model}</td>
                <td className="py-3 px-4 text-ink/60">{d.serial_number || "—"} / {d.imei || "—"}</td>
                <td className="py-3 px-4">{d.customer_name}</td>
                <td className="py-3 px-4 text-right">
                  <Link to={`/admin/devices/${d.id}`} className="text-brand-blue text-sm font-semibold">History</Link>
                </td>
              </tr>
            ))}
            {devices.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-ink/40">No devices found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
