import { useState } from "react";
import { api } from "../../lib/api.js";

const initial = { full_name: "", contact_number: "", email: "", device_description: "", problem_description: "" };

export default function BookRepair() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      await api.post("/public/repair-request", form);
      setStatus("done");
      setForm(initial);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="container-page py-20 max-w-lg text-center">
        <h1 className="font-display font-bold text-2xl">Request received</h1>
        <p className="text-ink/60 mt-3">
          Thanks for reaching out. Our team will contact you shortly to confirm your drop-off and give you a quote.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page py-14 max-w-lg">
      <h1 className="font-display font-bold text-3xl">Book a Repair</h1>
      <p className="text-ink/60 mt-2">Tell us about your device and the problem — we'll get back to you to confirm details.</p>

      <form onSubmit={onSubmit} className="card p-6 mt-8 flex flex-col gap-4">
        <Field label="Your Name">
          <input required value={form.full_name} onChange={(e) => update("full_name", e.target.value)} className="input" />
        </Field>
        <Field label="Contact Number">
          <input required value={form.contact_number} onChange={(e) => update("contact_number", e.target.value)} className="input" />
        </Field>
        <Field label="Email (optional)">
          <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="input" />
        </Field>
        <Field label="Device (type, brand, model)">
          <input required value={form.device_description} onChange={(e) => update("device_description", e.target.value)} className="input" placeholder="e.g. Smartphone, Samsung Galaxy S22" />
        </Field>
        <Field label="What's the problem?">
          <textarea required value={form.problem_description} onChange={(e) => update("problem_description", e.target.value)} className="input min-h-[100px]" />
        </Field>

        {error && <p className="text-sm text-brand-red">{error}</p>}

        <button type="submit" disabled={status === "submitting"} className="btn-primary mt-2 disabled:opacity-60">
          {status === "submitting" ? "Sending..." : "Send Request"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink/80">{label}</span>
      {children}
    </label>
  );
}
