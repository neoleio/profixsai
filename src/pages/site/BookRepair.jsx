import { useState } from "react";
import { api } from "../../lib/api.js";
import { useContent } from "../../lib/useContent.js";
import T from "../../components/site/T.jsx";

const initial = { full_name: "", contact_number: "", email: "", device_description: "", problem_description: "", preferred_date: "" };

export default function BookRepair() {
  const { t, s } = useContent();
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
        <T as="h1" id="book_done_title" className="block font-display font-bold text-2xl" />
        <T as="p" id="book_done_msg" className="block text-ink/60 mt-3" />
      </div>
    );
  }

  return (
    <div className="container-page py-14 max-w-3xl">
      <T as="h1" id="book_title" className="block font-display font-bold text-3xl" />
      <T as="p" id="book_intro" className="block text-ink/60 mt-2" />

      <form onSubmit={onSubmit} className="card p-6 sm:p-8 mt-8 flex flex-col gap-6">
        <section>
          <h2 className="font-display font-semibold text-lg">Your contact details</h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label={<T id="book_f_name" />}>
              <input required value={form.full_name} onChange={(e) => update("full_name", e.target.value)} className="input" />
            </Field>
            <Field label={<T id="book_f_contact" />}>
              <input required value={form.contact_number} onChange={(e) => update("contact_number", e.target.value)} className="input" />
            </Field>
            <Field label={<T id="book_f_email" />}>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="input" />
            </Field>
          </div>
        </section>

        <section className="border-t border-ink/10 pt-5">
          <h2 className="font-display font-semibold text-lg">Device and repair details</h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label={<T id="book_f_device" />}>
              <input required value={form.device_description} onChange={(e) => update("device_description", e.target.value)} className="input" placeholder="e.g. Smartphone, Samsung Galaxy S22" />
            </Field>
            <Field label={<T id="book_f_date" />}>
              <input
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={form.preferred_date}
                onChange={(e) => update("preferred_date", e.target.value)}
                className="input"
              />
            </Field>
            <Field label={<T id="book_f_problem" />} className="sm:col-span-2">
              <textarea required value={form.problem_description} onChange={(e) => update("problem_description", e.target.value)} className="input min-h-[100px]" />
            </Field>
          </div>
        </section>

        {error && <p className="text-sm text-brand-red">{error}</p>}

        <button type="submit" disabled={status === "submitting"} style={s("book_btn_send")} className="btn-primary mt-2 disabled:opacity-60">
          {status === "submitting" ? "Sending..." : t("book_btn_send")}
        </button>
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
