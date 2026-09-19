import { useEffect, useState } from "react";
import { Filter, Star } from "lucide-react";
import { api } from "../../lib/api.js";
import StatusBadge from "../../components/admin/StatusBadge.jsx";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  async function load() {
    setLoading(true);
    const { feedback } = await api.get("/feedback");
    setMessages(feedback);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, newStatus) {
    await api.put(`/feedback?id=${id}`, { status: newStatus });
    load();
  }

  const filtered = status ? messages.filter((m) => m.status === status) : messages;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl">Messages</h1>
          <p className="text-ink/60 mt-1">Feedback and reviews submitted through the public Contact page.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-ink/40" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="select-sm">
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Read">Read</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-ink/40 mt-4">
        Showing {filtered.length} of {messages.length} message{messages.length === 1 ? "" : "s"}
      </p>

      <div className="grid gap-4 mt-3">
        {filtered.map((m) => (
          <div key={m.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display font-semibold">{m.full_name}</p>
                {m.email && <p className="text-sm text-ink/60">{m.email}</p>}
              </div>
              <div className="flex items-center gap-3">
                {m.rating && (
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={i < m.rating ? "text-amber-400" : "text-ink/15"} fill={i < m.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                    ))}
                  </span>
                )}
                <StatusBadge value={m.status} />
                <span className="text-xs text-ink/40">{new Date(m.created_at).toLocaleString()}</span>
              </div>
            </div>
            <p className="text-sm text-ink/70 mt-3 leading-relaxed">{m.message}</p>

            {m.status !== "Archived" && (
              <div className="flex flex-wrap gap-3 mt-4">
                {m.status === "New" && (
                  <button onClick={() => updateStatus(m.id, "Read")} className="text-sm font-semibold text-brand-blue">
                    Mark Read
                  </button>
                )}
                <button onClick={() => updateStatus(m.id, "Archived")} className="text-sm font-semibold text-ink/40">
                  Archive
                </button>
              </div>
            )}
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-ink/40 py-8">
            {messages.length === 0
              ? "No messages yet — they'll show up here as customers use the Contact page's \"Leave a Message\" form."
              : "No messages match this filter."}
          </p>
        )}
      </div>
    </div>
  );
}
