import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Printer, ArrowLeft, RotateCcw, ShieldCheck, Plus, Minus } from "lucide-react";
import { api } from "../../lib/api.js";
import { toDateInputValue } from "../../lib/date.js";
import { useAuth } from "../../lib/auth-context.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";

const STATUSES = ["Received", "Diagnosing", "Waiting for Approval", "Not Repaired", "Completed", "Released"];

export default function JobOrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [warrantyForm, setWarrantyForm] = useState({ coverage: "", starts_on: "", ends_on: "" });
  const [savingWarranty, setSavingWarranty] = useState(false);
  const [warrantyMessage, setWarrantyMessage] = useState("");
  const [items, setItems] = useState([]);

  const isTechnician = user.role === "technician";

  async function load() {
    const res = await api.get(`/job-orders?id=${id}`);
    setData(res);
    setForm(formFromJobOrder(res.jobOrder));
    setWarrantyForm({
      coverage: res.warranty?.coverage || "",
      starts_on: toDateInputValue(res.warranty?.starts_on),
      ends_on: toDateInputValue(res.warranty?.ends_on)
    });
    setItems(
      res.items && res.items.length
        ? res.items.map((it) => ({ description: it.part_name, quantity: it.quantity, unit_cost: it.unit_cost }))
        : [{ description: "", quantity: 1, unit_cost: "" }]
    );
  }

  function formFromJobOrder(jobOrder) {
    return {
      status: jobOrder.status,
      diagnosis: jobOrder.diagnosis || "",
      repair_notes: jobOrder.repair_notes || "",
      reported_problem: jobOrder.reported_problem || "",
      requested_repair: jobOrder.requested_repair || "",
      parts_required: jobOrder.parts_required || "",
      technician_name: jobOrder.technician_name || "",
      estimated_cost: jobOrder.estimated_cost || 0,
      final_cost: jobOrder.final_cost || 0,
      capital_cost: jobOrder.capital_cost || 0,
      warranty_info: jobOrder.warranty_info || "",
      expected_completion: toDateInputValue(jobOrder.expected_completion)
    };
  }

  function clearForm() {
    if (data?.jobOrder) setForm(formFromJobOrder(data.jobOrder));
    setMessage("");
  }

  function updateItem(i, field, value) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: 1, unit_cost: "" }]);
  }
  function removeItem(i) {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  }

  useEffect(() => { load(); }, [id]); // eslint-disable-line

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await api.put(`/job-orders?id=${id}`, form);
      try {
        await api.put(`/job-orders?id=${id}&action=items`, { items: items.filter((it) => it.description.trim()) });
        setMessage("Saved.");
      } catch (itemsErr) {
        setMessage(`Job order saved, but items didn't save: ${itemsErr.message}`);
      }
      load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function recordPayment() {
    if (!paymentAmount) return;
    await api.post(`/job-orders?id=${id}&action=payments`, { amount: Number(paymentAmount) });
    setPaymentAmount("");
    load();
  }

  async function saveWarranty(e) {
    e.preventDefault();
    setSavingWarranty(true);
    setWarrantyMessage("");
    try {
      await api.put(`/job-orders?id=${id}&action=warranty`, warrantyForm);
      setWarrantyMessage("Warranty saved.");
      load();
    } catch (err) {
      setWarrantyMessage(err.message);
    } finally {
      setSavingWarranty(false);
    }
  }

  if (!data) return <p className="text-ink/50">Loading…</p>;
  const { jobOrder, payments } = data;
  const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="max-w-3xl">
      {location.state?.itemsWarning && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg p-4 mb-4">
          {location.state.itemsWarning} You can add them below and save.
        </div>
      )}
      <Link to="/admin/job-orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 hover:text-brand-blue transition-colors">
        <ArrowLeft size={15} /> Back to Job Orders
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
        <div>
          <p className="font-mono text-xs text-ink/40">{jobOrder.job_no}</p>
          <h1 className="font-display font-bold text-2xl">{jobOrder.customer_name}</h1>
          <p className="text-ink/60">{jobOrder.device_type} — {jobOrder.brand} {jobOrder.model}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge value={jobOrder.status} />
          <Link to={`/admin/order-slip?jobOrderId=${id}`} className="btn-secondary"><Printer size={16} /> Print</Link>
        </div>
      </div>

      <form onSubmit={save} className="mt-8 flex flex-col gap-8">
        <section className="card p-6">
          <h2 className="font-display font-semibold mb-4">Status</h2>
          <select className="input max-w-xs" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </section>

        <section className="card p-6">
          <h2 className="font-display font-semibold mb-4">Diagnosis &amp; Repair</h2>
          <div className="grid gap-4">
            <Field label="Reported Problem">
              <textarea disabled={isTechnician} className="input disabled:bg-fog-100" value={form.reported_problem} onChange={(e) => setForm((f) => ({ ...f, reported_problem: e.target.value }))} />
            </Field>
            <Field label="Diagnosis">
              <textarea className="input" value={form.diagnosis} onChange={(e) => setForm((f) => ({ ...f, diagnosis: e.target.value }))} />
            </Field>
            <Field label="Requested Repair">
              <textarea disabled={isTechnician} className="input disabled:bg-fog-100" value={form.requested_repair} onChange={(e) => setForm((f) => ({ ...f, requested_repair: e.target.value }))} />
            </Field>
            <Field label="Parts Required">
              <input disabled={isTechnician} className="input disabled:bg-fog-100" value={form.parts_required} onChange={(e) => setForm((f) => ({ ...f, parts_required: e.target.value }))} />
            </Field>
            <Field label="Technician Assigned">
              <input disabled={isTechnician} placeholder="Type a technician's name" className="input disabled:bg-fog-100" value={form.technician_name} onChange={(e) => setForm((f) => ({ ...f, technician_name: e.target.value }))} />
            </Field>
            <Field label="Repair Notes">
              <textarea className="input" value={form.repair_notes} onChange={(e) => setForm((f) => ({ ...f, repair_notes: e.target.value }))} />
            </Field>
          </div>
        </section>

        {!isTechnician && (
          <section className="card p-6">
            <h2 className="font-display font-semibold mb-1">Items</h2>
            <p className="text-xs text-ink/50 mb-4">Parts or services for this job — these carry over automatically when printing an Order Slip for this job order.</p>
            {items.map((it, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_120px_auto] gap-3 items-end mb-3">
                <label className="flex flex-col gap-1 text-xs">
                  <span className="text-ink/50">Description</span>
                  <input className="input" value={it.description} onChange={(e) => updateItem(i, "description", e.target.value)} />
                </label>
                <label className="flex flex-col gap-1 text-xs">
                  <span className="text-ink/50">Qty</span>
                  <input type="number" min="1" className="input" value={it.quantity} onChange={(e) => updateItem(i, "quantity", e.target.value)} />
                </label>
                <label className="flex flex-col gap-1 text-xs">
                  <span className="text-ink/50">Unit Cost (₱)</span>
                  <input type="number" min="0" step="0.01" className="input" value={it.unit_cost} onChange={(e) => updateItem(i, "unit_cost", e.target.value)} />
                </label>
                <button type="button" onClick={() => removeItem(i)} disabled={items.length === 1} className="btn-secondary h-[42px] disabled:opacity-40" aria-label="Remove item">
                  <Minus size={15} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blueDeep mt-1">
              <Plus size={15} /> Add Item
            </button>
          </section>
        )}

        {!isTechnician && (
          <section className="card p-6">
            <h2 className="font-display font-semibold mb-4">Costs &amp; Warranty</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Estimated Cost (₱)"><input type="number" step="0.01" className="input" value={form.estimated_cost} onChange={(e) => setForm((f) => ({ ...f, estimated_cost: e.target.value }))} /></Field>
              <Field label="Final Cost (₱)"><input type="number" step="0.01" className="input" value={form.final_cost} onChange={(e) => setForm((f) => ({ ...f, final_cost: e.target.value }))} /></Field>
              <Field label="Capital Cost (₱)"><input type="number" step="0.01" className="input" value={form.capital_cost} onChange={(e) => setForm((f) => ({ ...f, capital_cost: e.target.value }))} /></Field>
              <Field label="Profit (₱)">
                <p className="input bg-fog-100 font-semibold text-emerald-700">
                  ₱{(Number(form.final_cost || 0) - Number(form.capital_cost || 0)).toFixed(2)}
                </p>
              </Field>
              <Field label="Expected Completion"><input type="date" className="input" value={form.expected_completion || ""} onChange={(e) => setForm((f) => ({ ...f, expected_completion: e.target.value }))} /></Field>
              <Field label="Warranty Information" className="sm:col-span-2"><input className="input" value={form.warranty_info} onChange={(e) => setForm((f) => ({ ...f, warranty_info: e.target.value }))} /></Field>
            </div>
            <p className="text-xs text-ink/40 mt-3">Profit is calculated automatically as Final Cost − Capital Cost, and is saved for internal reporting only — it never appears on the printed customer receipt.</p>
          </section>
        )}

        {message && <p className="text-sm text-ink/60">{message}</p>}
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button type="button" onClick={clearForm} className="btn-secondary">
            <RotateCcw size={15} /> Clear
          </button>
        </div>
      </form>

      {!isTechnician && (
        <section className="card p-6 mt-8">
          <h2 className="font-display font-semibold mb-1">Payments</h2>
          <p className="text-sm text-ink/50 mb-4">
            Total paid: ₱{totalPaid.toFixed(2)} of ₱{Number(jobOrder.final_cost).toFixed(2)} — <StatusBadge value={jobOrder.payment_status} />
          </p>
          <ul className="divide-y divide-ink/5 mb-4">
            {payments.map((p) => (
              <li key={p.id} className="py-2 text-sm flex justify-between">
                <span>{new Date(p.paid_at).toLocaleString()}</span>
                <span className="font-medium">₱{Number(p.amount).toFixed(2)}</span>
              </li>
            ))}
            {payments.length === 0 && <li className="py-2 text-sm text-ink/40">No payments recorded yet.</li>}
          </ul>
          <div className="flex gap-3">
            <input type="number" min="0" step="0.01" placeholder="Amount" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="input max-w-[160px]" />
            <button type="button" onClick={recordPayment} className="btn-secondary">Record Payment</button>
          </div>
        </section>
      )}

      {!isTechnician && (
        <section className="card p-6 mt-8">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={18} className="text-brand-blue" />
            <h2 className="font-display font-semibold">Warranty Tracking</h2>
          </div>
          <p className="text-sm text-ink/50 mb-4">
            Set a structured warranty period so this repair shows up in the Reports warranty tracker.
          </p>
          <form onSubmit={saveWarranty} className="grid sm:grid-cols-3 gap-4">
            <Field label="Coverage" className="sm:col-span-1">
              <input
                placeholder="e.g. 90-day parts and labor"
                className="input"
                value={warrantyForm.coverage}
                onChange={(e) => setWarrantyForm((w) => ({ ...w, coverage: e.target.value }))}
              />
            </Field>
            <Field label="Starts On">
              <input type="date" className="input" value={warrantyForm.starts_on || ""} onChange={(e) => setWarrantyForm((w) => ({ ...w, starts_on: e.target.value }))} />
            </Field>
            <Field label="Ends On">
              <input type="date" required className="input" value={warrantyForm.ends_on || ""} onChange={(e) => setWarrantyForm((w) => ({ ...w, ends_on: e.target.value }))} />
            </Field>
            {warrantyMessage && <p className="text-sm text-ink/60 sm:col-span-3">{warrantyMessage}</p>}
            <div className="sm:col-span-3">
              <button type="submit" disabled={savingWarranty} className="btn-secondary disabled:opacity-60">
                {savingWarranty ? "Saving…" : "Save Warranty"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`}>
      <span className="font-medium text-ink/80">{label}</span>
      {children}
    </label>
  );
}
