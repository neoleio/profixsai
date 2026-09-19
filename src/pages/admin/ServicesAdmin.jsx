import { useEffect, useState } from "react";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { api } from "../../lib/api.js";

const emptyForm = { name: "", category: "", description: "", icon: "wrench" };

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const { services } = await api.get("/services?all=1");
    setServices(services);
  }
  useEffect(() => { load(); }, []);

  async function addService(e) {
    e.preventDefault();
    await api.post("/services", form);
    setForm(emptyForm);
    setShowForm(false);
    load();
  }

  async function toggleActive(s) {
    await api.put(`/services?id=${s.id}`, { is_active: !s.is_active });
    load();
  }

  async function removeService(id) {
    if (!confirm("Delete this service?")) return;
    await api.del(`/services?id=${id}`);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl">Services</h1>
          <p className="text-ink/60 mt-1">Add, edit, or hide services shown on the public site.</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary"><Plus size={16} /> Add Service</button>
      </div>

      {showForm && (
        <form onSubmit={addService} className="card p-6 mt-6 grid sm:grid-cols-2 gap-4">
          <input required placeholder="Service name" className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <input placeholder="Category (e.g. Smartphone Repair)" className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          <textarea placeholder="Short description" className="input sm:col-span-2" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <input placeholder="Icon name (lucide-react, e.g. smartphone)" className="input" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" className="btn-secondary">Save Service</button>
            <button type="button" onClick={() => setForm(emptyForm)} className="inline-flex items-center gap-2 text-sm font-semibold text-ink/50 hover:text-brand-red transition-colors px-2">
              <RotateCcw size={15} /> Clear
            </button>
          </div>
        </form>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {services.map((s) => (
          <div key={s.id} className={`card p-5 ${!s.is_active ? "opacity-50" : ""}`}>
            <div className="flex justify-between items-start gap-3">
              <div>
                <p className="font-display font-semibold">{s.name}</p>
                <p className="text-xs text-ink/40">{s.category}</p>
              </div>
              <button onClick={() => removeService(s.id)} className="text-ink/30 hover:text-brand-red"><Trash2 size={16} /></button>
            </div>
            <p className="text-sm text-ink/60 mt-2">{s.description}</p>
            <button onClick={() => toggleActive(s)} className="text-xs font-semibold text-brand-blue mt-3">
              {s.is_active ? "Hide from site" : "Show on site"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
