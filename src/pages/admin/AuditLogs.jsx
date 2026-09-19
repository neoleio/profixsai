import { useEffect, useState } from "react";
import { api } from "../../lib/api.js";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => { api.get("/audit-logs").then(({ auditLogs }) => setLogs(auditLogs)); }, []);

  return (
    <div>
      <h1 className="font-display font-bold text-2xl">Audit Logs</h1>
      <p className="text-ink/60 mt-1">Every important change made in the system, in order.</p>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/40 text-xs uppercase tracking-wide border-b border-ink/10">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Date / Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-ink/5 last:border-0">
                <td className="py-3 px-4">{l.user_name || "System"}</td>
                <td className="py-3 px-4">{l.action}</td>
                <td className="py-3 px-4 text-ink/60">{new Date(l.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={3} className="py-8 text-center text-ink/40">No activity recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
