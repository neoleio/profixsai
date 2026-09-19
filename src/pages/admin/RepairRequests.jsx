import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import { api } from "../../lib/api.js";
import StatusBadge from "../../components/admin/StatusBadge.jsx";

export default function RepairRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    const { repairRequests } = await api.get("/repair-requests");
    setRequests(repairRequests);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    await api.put(`/repair-requests?id=${id}`, { status });
    load();
  }

  function createJobOrder(request) {
    navigate("/admin/job-orders/new", { state: { fromRepairRequest: request } });
  }

  const filtered = status ? requests.filter((r) => r.status === status) : requests;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl">Repair Requests</h1>
          <p className="text-ink/60 mt-1">
            Leads submitted through the public "Book a Repair" form. Convert them into a
            job order once you've confirmed details with the customer.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-ink/40" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="select-sm">
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Converted">Converted</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-ink/40 mt-4">
        Showing {filtered.length} of {requests.length} request{requests.length === 1 ? "" : "s"}
      </p>

      <div className="grid gap-4 mt-3">
        {filtered.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display font-semibold">{r.full_name}</p>
                <p className="text-sm text-ink/60">{r.contact_number}{r.email && ` · ${r.email}`}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge value={r.status} />
                <span className="text-xs text-ink/40">{new Date(r.created_at).toLocaleString()}</span>
              </div>
            </div>
            <p className="text-sm mt-3"><span className="text-ink/50">Device: </span>{r.device_description}</p>
            <p className="text-sm mt-1"><span className="text-ink/50">Problem: </span>{r.problem_description}</p>

            {r.status === "New" && (
              <div className="flex flex-wrap gap-3 mt-4">
                <button onClick={() => createJobOrder(r)} className="btn-secondary text-sm py-2 px-4">
                  Create Job Order
                </button>
                <button onClick={() => updateStatus(r.id, "Converted")} className="text-sm font-semibold text-emerald-600">
                  Mark Converted
                </button>
                <button onClick={() => updateStatus(r.id, "Dismissed")} className="text-sm font-semibold text-ink/40">
                  Dismiss
                </button>
              </div>
            )}
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-ink/40 py-8">
            {requests.length === 0
              ? 'No repair requests yet — they\'ll show up here as customers submit the "Book a Repair" form.'
              : "No requests match this filter."}
          </p>
        )}
      </div>
    </div>
  );
}
