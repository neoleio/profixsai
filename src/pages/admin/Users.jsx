import { useEffect, useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { api } from "../../lib/api.js";

const emptyForm = { full_name: "", email: "", password: "", role: "staff" };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const { users } = await api.get("/users");
    setUsers(users);
  }
  useEffect(() => { load(); }, []);

  async function addUser(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/users", form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleActive(u) {
    await api.put(`/users?id=${u.id}`, { is_active: !u.is_active });
    load();
  }

  async function changeRole(u, role) {
    await api.put(`/users?id=${u.id}`, { role });
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl">Users</h1>
          <p className="text-ink/60 mt-1">Manage staff and technician accounts.</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary"><Plus size={16} /> Add User</button>
      </div>

      {showForm && (
        <form onSubmit={addUser} className="card p-6 mt-6 grid sm:grid-cols-2 gap-4">
          <input required placeholder="Full name" className="input" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
          <input required type="email" placeholder="Email" className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <input required type="password" placeholder="Temporary password (min 8 chars)" className="input" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          <select className="input" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            <option value="staff">Staff</option>
            <option value="technician">Technician</option>
            <option value="admin">Administrator</option>
          </select>
          {error && <p className="text-sm text-brand-red sm:col-span-2">{error}</p>}
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" className="btn-secondary">Create User</button>
            <button type="button" onClick={() => setForm(emptyForm)} className="inline-flex items-center gap-2 text-sm font-semibold text-ink/50 hover:text-brand-red transition-colors px-2">
              <RotateCcw size={15} /> Clear
            </button>
          </div>
        </form>
      )}

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/40 text-xs uppercase tracking-wide border-b border-ink/10">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-ink/5 last:border-0">
                <td className="py-3 px-4">{u.full_name}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4">
                  <select value={u.role} onChange={(e) => changeRole(u, e.target.value)} className="input py-1.5 text-sm w-auto">
                    <option value="staff">Staff</option>
                    <option value="technician">Technician</option>
                    <option value="admin">Administrator</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <button onClick={() => toggleActive(u)} className={`text-xs font-semibold ${u.is_active ? "text-emerald-600" : "text-ink/40"}`}>
                    {u.is_active ? "Active — deactivate" : "Inactive — activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
