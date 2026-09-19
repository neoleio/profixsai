import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, Inbox } from "lucide-react";
import { api } from "../../lib/api.js";

const emptyCustomer = { full_name: "", contact_number: "", email: "", address: "" };
const emptyDevice = { device_type: "Smartphone", brand: "", model: "", serial_number: "", imei: "", color: "", condition_notes: "" };
const emptyRepair = {
  reported_problem: "", diagnosis: "", requested_repair: "", parts_required: "",
  technician_id: "", repair_notes: "", estimated_cost: "", expected_completion: "", warranty_info: ""
};
const DEVICE_TYPES = ["Smartphone", "Laptop", "Tablet", "Desktop", "Smartwatch", "Other"];

export default function NewJobOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const sourceRequest = location.state?.fromRepairRequest || null;

  const [customers, setCustomers] = useState([]);
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [newCustomer, setNewCustomer] = useState(emptyCustomer);
  const [addingCustomer, setAddingCustomer] = useState(false);

  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [newDevice, setNewDevice] = useState(emptyDevice);
  const [addingDevice, setAddingDevice] = useState(false);

  const [technicians, setTechnicians] = useState([]);
  const [repair, setRepair] = useState(emptyRepair);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Arriving from a "Book a Repair" lead: pre-fill everything we already
  // know so staff aren't re-typing what the customer already told us.
  useEffect(() => {
    if (!sourceRequest) return;
    setAddingCustomer(true);
    setNewCustomer({
      full_name: sourceRequest.full_name || "",
      contact_number: sourceRequest.contact_number || "",
      email: sourceRequest.email || "",
      address: ""
    });
    setAddingDevice(true);
    setNewDevice((d) => ({ ...d, model: sourceRequest.device_description || "" }));
    setRepair((r) => ({ ...r, reported_problem: sourceRequest.problem_description || "" }));
  }, [sourceRequest]);

  function clearForm() {
    setCustomers([]);
    setCustomerQuery("");
    setCustomerId("");
    setNewCustomer(emptyCustomer);
    setAddingCustomer(false);
    setDevices([]);
    setDeviceId("");
    setNewDevice(emptyDevice);
    setAddingDevice(false);
    setRepair(emptyRepair);
    setError("");
  }

  useEffect(() => {
    api.get("/users").then(({ users }) => setTechnicians(users.filter((u) => u.role === "technician" && u.is_active))).catch(() => {});
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (customerQuery.trim()) {
        api.get(`/customers?q=${encodeURIComponent(customerQuery)}`).then(({ customers }) => setCustomers(customers)).catch(() => {});
      } else {
        setCustomers([]);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [customerQuery]);

  useEffect(() => {
    if (!customerId) { setDevices([]); return; }
    api.get(`/customers?id=${customerId}`).then(({ devices }) => setDevices(devices)).catch(() => {});
  }, [customerId]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      let finalCustomerId = customerId;
      if (addingCustomer || !customerId) {
        if (!newCustomer.full_name || !newCustomer.contact_number) {
          throw new Error("Customer name and contact number are required.");
        }
        const { customer } = await api.post("/customers", newCustomer);
        finalCustomerId = customer.id;
      }

      let finalDeviceId = deviceId;
      if (addingDevice || !deviceId) {
        const { device } = await api.post("/devices", { ...newDevice, customer_id: finalCustomerId });
        finalDeviceId = device.id;
      }

      const { jobOrder } = await api.post("/job-orders", {
        customer_id: finalCustomerId,
        device_id: finalDeviceId,
        ...repair,
        technician_id: repair.technician_id || null,
        estimated_cost: repair.estimated_cost || 0
      });

      if (sourceRequest) {
        // Best-effort — the job order is already created either way.
        api.put(`/repair-requests?id=${sourceRequest.id}`, { status: "Converted" }).catch(() => {});
      }

      navigate(`/admin/job-orders/${jobOrder.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <Link to="/admin/job-orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 hover:text-brand-blue transition-colors">
        <ArrowLeft size={15} /> Back to Job Orders
      </Link>
      <h1 className="font-display font-bold text-2xl mt-3">New Job Order</h1>
      <p className="text-ink/60 mt-1">Create a repair job for a customer and device.</p>

      {sourceRequest && (
        <div className="flex items-start gap-3 bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-4 mt-4 text-sm">
          <Inbox size={18} className="text-brand-blue mt-0.5 shrink-0" />
          <p className="text-ink/70">
            Pre-filled from a repair request submitted by <strong>{sourceRequest.full_name}</strong> on{" "}
            {new Date(sourceRequest.created_at).toLocaleDateString()}. Review the details below before saving —
            this request will be marked <strong>Converted</strong> once the job order is created.
          </p>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-8">
        {/* Customer */}
        <section className="card p-6">
          <h2 className="font-display font-semibold mb-4">Customer Information</h2>
          {!addingCustomer ? (
            <>
              <input
                className="input"
                placeholder="Search existing customer by name, phone, or email"
                value={customerQuery}
                onChange={(e) => { setCustomerQuery(e.target.value); setCustomerId(""); }}
              />
              {customers.length > 0 && !customerId && (
                <ul className="mt-2 border border-ink/10 rounded-lg divide-y divide-ink/5 max-h-48 overflow-y-auto">
                  {customers.map((c) => (
                    <li key={c.id}>
                      <button type="button" onClick={() => { setCustomerId(c.id); setCustomerQuery(c.full_name); setCustomers([]); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-fog-50">
                        {c.full_name} — {c.contact_number}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {customerId && <p className="text-sm text-emerald-600 mt-2">Selected: {customerQuery}</p>}
              <button type="button" className="text-sm text-brand-blue font-semibold mt-3" onClick={() => { setAddingCustomer(true); setCustomerId(""); }}>
                + Add new customer instead
              </button>
            </>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Customer Name"><input required className="input" value={newCustomer.full_name} onChange={(e) => setNewCustomer((c) => ({ ...c, full_name: e.target.value }))} /></Field>
              <Field label="Contact Number"><input required className="input" value={newCustomer.contact_number} onChange={(e) => setNewCustomer((c) => ({ ...c, contact_number: e.target.value }))} /></Field>
              <Field label="Email"><input className="input" value={newCustomer.email} onChange={(e) => setNewCustomer((c) => ({ ...c, email: e.target.value }))} /></Field>
              <Field label="Address"><input className="input" value={newCustomer.address} onChange={(e) => setNewCustomer((c) => ({ ...c, address: e.target.value }))} /></Field>
              <button type="button" className="text-sm text-ink/50 sm:col-span-2 text-left" onClick={() => setAddingCustomer(false)}>← Search existing customer instead</button>
            </div>
          )}
        </section>

        {/* Device */}
        {(customerId || addingCustomer) && (
          <section className="card p-6">
            <h2 className="font-display font-semibold mb-4">Device Information</h2>
            {devices.length > 0 && !addingDevice && (
              <>
                <select className="input" value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
                  <option value="">Select an existing device</option>
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>{d.device_type} — {d.brand} {d.model} ({d.serial_number || "no serial"})</option>
                  ))}
                </select>
                <button type="button" className="text-sm text-brand-blue font-semibold mt-3" onClick={() => setAddingDevice(true)}>
                  + Add a new device
                </button>
              </>
            )}
            {(devices.length === 0 || addingDevice) && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Device Type">
                  <select className="input" value={newDevice.device_type} onChange={(e) => setNewDevice((d) => ({ ...d, device_type: e.target.value }))}>
                    {DEVICE_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Brand"><input className="input" value={newDevice.brand} onChange={(e) => setNewDevice((d) => ({ ...d, brand: e.target.value }))} /></Field>
                <Field label="Model"><input className="input" value={newDevice.model} onChange={(e) => setNewDevice((d) => ({ ...d, model: e.target.value }))} /></Field>
                <Field label="Serial Number"><input className="input" value={newDevice.serial_number} onChange={(e) => setNewDevice((d) => ({ ...d, serial_number: e.target.value }))} /></Field>
                <Field label="IMEI"><input className="input" value={newDevice.imei} onChange={(e) => setNewDevice((d) => ({ ...d, imei: e.target.value }))} /></Field>
                <Field label="Color"><input className="input" value={newDevice.color} onChange={(e) => setNewDevice((d) => ({ ...d, color: e.target.value }))} /></Field>
                <Field label="Device Condition" className="sm:col-span-2"><textarea className="input" value={newDevice.condition_notes} onChange={(e) => setNewDevice((d) => ({ ...d, condition_notes: e.target.value }))} /></Field>
                {devices.length > 0 && (
                  <button type="button" className="text-sm text-ink/50 sm:col-span-2 text-left" onClick={() => setAddingDevice(false)}>← Choose an existing device instead</button>
                )}
              </div>
            )}
          </section>
        )}

        {/* Repair Info */}
        <section className="card p-6">
          <h2 className="font-display font-semibold mb-4">Repair Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Reported Problem" className="sm:col-span-2"><textarea required className="input" value={repair.reported_problem} onChange={(e) => setRepair((r) => ({ ...r, reported_problem: e.target.value }))} /></Field>
            <Field label="Initial Diagnosis" className="sm:col-span-2"><textarea className="input" value={repair.diagnosis} onChange={(e) => setRepair((r) => ({ ...r, diagnosis: e.target.value }))} /></Field>
            <Field label="Requested Repair" className="sm:col-span-2"><textarea className="input" value={repair.requested_repair} onChange={(e) => setRepair((r) => ({ ...r, requested_repair: e.target.value }))} /></Field>
            <Field label="Parts Required"><input className="input" value={repair.parts_required} onChange={(e) => setRepair((r) => ({ ...r, parts_required: e.target.value }))} /></Field>
            <Field label="Technician Assigned">
              <select className="input" value={repair.technician_id} onChange={(e) => setRepair((r) => ({ ...r, technician_id: e.target.value }))}>
                <option value="">Unassigned</option>
                {technicians.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
              </select>
            </Field>
            <Field label="Estimated Cost (₱)"><input type="number" min="0" step="0.01" className="input" value={repair.estimated_cost} onChange={(e) => setRepair((r) => ({ ...r, estimated_cost: e.target.value }))} /></Field>
            <Field label="Expected Completion Date"><input type="date" className="input" value={repair.expected_completion} onChange={(e) => setRepair((r) => ({ ...r, expected_completion: e.target.value }))} /></Field>
            <Field label="Warranty Information" className="sm:col-span-2"><input className="input" value={repair.warranty_info} onChange={(e) => setRepair((r) => ({ ...r, warranty_info: e.target.value }))} /></Field>
          </div>
        </section>

        {error && <p className="text-sm text-brand-red">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
            {submitting ? "Creating…" : "Create Job Order"}
          </button>
          <button type="button" onClick={clearForm} className="btn-secondary">
            <RotateCcw size={15} /> Clear
          </button>
        </div>
      </form>
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
