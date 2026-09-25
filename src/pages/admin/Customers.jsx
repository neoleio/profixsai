import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, X, RotateCcw } from "lucide-react";
import { api } from "../../lib/api.js";

const emptyCustomerForm = { full_name: "", contact_number: "", email: "", address: "" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [q, setQ] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyCustomerForm);
  const [error, setError] = useState("");

  async function load() {
    const params = q ? `?q=${encodeURIComponent(q)}` : "";
    const { customers } = await api.get(`/customers${params}`);
    setCustomers(customers);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line

  async function addCustomer(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/customers", form);
      setForm(emptyCustomerForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const visibleCustomers = pageSize === "all" ? customers : customers.slice(0, pageSize);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">        <div>
          <h1 className="font-display font-bold text-2xl">Customers</h1>
          <p className="text-ink/60 mt-1">Search, add, and review customer history.</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Cancel" : "Add Customer"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addCustomer} className="card p-6 mt-6 grid sm:grid-cols-2 gap-4">
          <input required placeholder="Full name" className="input" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
          <input required placeholder="Contact number" className="input" value={form.contact_number} onChange={(e) => setForm((f) => ({ ...f, contact_number: e.target.value }))} />
          <input placeholder="Email" className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <input placeholder="Address" className="input" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          {error && <p className="text-sm text-brand-red sm:col-span-2">{error}</p>}
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" className="btn-secondary">Save Customer</button>
            <button type="button" onClick={() => setForm(emptyCustomerForm)} className="inline-flex items-center gap-2 text-sm font-semibold text-ink/50 hover:text-brand-red transition-colors px-2">
              <RotateCcw size={15} /> Clear
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <form onSubmit={(e) => { e.preventDefault(); load(); }} className="relative max-w-sm flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, or email" className="input pl-9" />
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
        Showing {visibleCustomers.length} of {customers.length} customer{customers.length === 1 ? "" : "s"}
      </p>

      <div className="card mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/40 text-xs uppercase tracking-wide border-b border-ink/10">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {visibleCustomers.map((c) => (
              <tr key={c.id} className="border-b border-ink/5 last:border-0">
                <td className="py-3 px-4">{c.full_name}</td>
                <td className="py-3 px-4">{c.contact_number}</td>
                <td className="py-3 px-4">{c.email}</td>
                <td className="py-3 px-4 text-right">
                  <Link to={`/admin/customers/${c.id}`} className="text-brand-blue text-sm font-semibold">View</Link>
                </td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-ink/40">No customers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
