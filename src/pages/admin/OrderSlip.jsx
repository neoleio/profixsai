import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Minus, Printer, FileInput } from "lucide-react";
import { useSettings } from "../../lib/useSettings.js";
import { api } from "../../lib/api.js";
import { toDateInputValue } from "../../lib/date.js";
import Logotype from "../../components/site/Logotype.jsx";

// Pure client-side receipt/order-slip builder — nothing here is saved to the
// database. "Download PDF" opens the browser's print dialog, where choosing
// "Save as PDF" produces the file; this needs no extra library and works
// fine within the project's free-tier hosting.

const SITE_URL = "https://profixsai.vercel.app"; // update if a custom domain is connected later
const MIN_ROWS = 6; // pads the printed table out to a consistent size, like the paper template

const emptyItem = () => ({ qty: "", description: "", amount: "" });

export default function OrderSlip() {
  const settings = useSettings();
  const [searchParams] = useSearchParams();
  const jobOrderId = searchParams.get("jobOrderId");

  const [customer, setCustomer] = useState({ name: "", contact: "", address: "", date: "" });
  const [items, setItems] = useState([emptyItem()]);
  const [deposit, setDeposit] = useState("");
  const [sourceJobOrder, setSourceJobOrder] = useState(null);
  const [loadingJobOrder, setLoadingJobOrder] = useState(!!jobOrderId);

  // Coming from a Job Order's Print button — pull in its customer, items
  // (or a one-line fallback if it has none yet), and payments so far, all
  // still freely editable here before printing.
  useEffect(() => {
    if (!jobOrderId) return;
    api.get(`/job-orders?id=${jobOrderId}`)
      .then(({ jobOrder, items: joItems, payments }) => {
        setSourceJobOrder(jobOrder);
        setCustomer({
          name: jobOrder.customer_name || "",
          contact: jobOrder.contact_number || "",
          address: jobOrder.address || "",
          date: toDateInputValue(jobOrder.date_received)
        });
        if (joItems && joItems.length) {
          setItems(joItems.map((it) => ({
            qty: it.quantity,
            description: it.part_name,
            amount: (Number(it.quantity) * Number(it.unit_cost)).toFixed(2)
          })));
        } else {
          const fallbackAmount = Number(jobOrder.final_cost) || Number(jobOrder.estimated_cost) || 0;
          setItems([{ qty: 1, description: jobOrder.requested_repair || jobOrder.reported_problem || "Repair service", amount: fallbackAmount || "" }]);
        }
        const paid = (payments || []).reduce((s, p) => s + Number(p.amount), 0);
        if (paid) setDeposit(paid.toFixed(2));
      })
      .catch(() => {})
      .finally(() => setLoadingJobOrder(false));
  }, [jobOrderId]);

  const total = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
  const balance = total - (Number(deposit) || 0);

  function updateItem(i, field, value) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }
  function removeItem(i) {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  }

  const paddedItems = items.length >= MIN_ROWS ? items : [...items, ...Array(MIN_ROWS - items.length).fill(null)];
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(SITE_URL)}`;

  return (
    <div>
      <div className="no-print">
        <h1 className="font-display font-bold text-2xl">Order Slip</h1>
        <p className="text-ink/60 mt-1">
          Fill this in and print — it produces one page with a customer copy and an admin copy. Nothing here is saved automatically.
        </p>

        {loadingJobOrder && <p className="text-sm text-ink/50 mt-4">Loading job order details…</p>}
        {sourceJobOrder && (
          <div className="flex items-start gap-3 bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-4 mt-4 text-sm">
            <FileInput size={18} className="text-brand-blue mt-0.5 shrink-0" />
            <p className="text-ink/70">
              Pre-filled from job order <strong>{sourceJobOrder.job_no}</strong>. Everything below is editable —
              add, remove, or change items before printing.
            </p>
          </div>
        )}

        <div className="card p-6 mt-6 grid sm:grid-cols-2 gap-4">
          <input placeholder="Customer Name" className="input" value={customer.name} onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))} />
          <input placeholder="Contact Number" className="input" value={customer.contact} onChange={(e) => setCustomer((c) => ({ ...c, contact: e.target.value }))} />
          <input placeholder="Customer Address" className="input sm:col-span-2" value={customer.address} onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))} />
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="font-medium text-ink/80">Received Date</span>
            <input type="date" className="input" value={customer.date} onChange={(e) => setCustomer((c) => ({ ...c, date: e.target.value }))} />
          </label>
        </div>

        <div className="card p-6 mt-4">
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-[80px_1fr_120px_auto] gap-3 items-end mb-3">
              <label className="flex flex-col gap-1 text-xs">
                <span className="text-ink/50">Qty</span>
                <input type="number" min="0" className="input" value={it.qty} onChange={(e) => updateItem(i, "qty", e.target.value)} />
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span className="text-ink/50">Description</span>
                <input className="input" value={it.description} onChange={(e) => updateItem(i, "description", e.target.value)} />
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span className="text-ink/50">Amount</span>
                <input type="number" min="0" step="0.01" className="input" value={it.amount} onChange={(e) => updateItem(i, "amount", e.target.value)} />
              </label>
              <button type="button" onClick={() => removeItem(i)} disabled={items.length === 1} className="btn-secondary h-[42px] disabled:opacity-40" aria-label="Remove item">
                <Minus size={15} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blueDeep mt-1">
            <Plus size={15} /> Add Item
          </button>
        </div>

        <div className="card p-6 mt-4 grid sm:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink/80">Amount</span>
            <p className="input bg-fog-100 font-semibold">₱{total.toFixed(2)}</p>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink/80">Deposit</span>
            <input type="number" min="0" step="0.01" className="input" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink/80">Balance</span>
            <p className="input bg-fog-100 font-semibold">₱{balance.toFixed(2)}</p>
          </label>
        </div>

        <button onClick={() => window.print()} className="btn-primary mt-5">
          <Printer size={16} /> Download PDF
        </button>
      </div>

      <div className="hidden print:block">
        <Copy settings={settings} customer={customer} items={paddedItems} total={total} deposit={deposit} balance={balance} qrSrc={qrSrc} />
        <Copy settings={settings} customer={customer} items={paddedItems} total={total} deposit={deposit} balance={balance} qrSrc={qrSrc} />
      </div>
    </div>
  );
}

function Copy({ settings, customer, items, total, deposit, balance, qrSrc }) {
  return (
    <div className="p-6 text-[11px] text-ink border-b-2 border-dashed border-ink/20 last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="ProFixSAI logo" className="w-14 h-14 rounded-full object-cover" />
          <div>
            <Logotype size="lg" light />
            <p className="font-semibold uppercase">Computer and Laptop Repair</p>
            {settings.contact_address && <p>{settings.contact_address}</p>}
            {settings.contact_phone && <p>Contact Number: {settings.contact_phone}</p>}
            {settings.contact_email && <p>Email: {settings.contact_email}</p>}
          </div>
        </div>
        <div className="text-right">
          {settings.facebook_url && <p className="mb-1">Follow us on Facebook</p>}
          <img src={qrSrc} alt="Scan to visit our website" className="w-16 h-16 ml-auto" />
        </div>
      </div>

      <p className="mt-3">Services: Laptop, Macbook, Cellphone, Printer, Motherboard Level Repair, Chip Level Repair, GPU Repair</p>

      <table className="w-full border border-ink mt-2 border-collapse">
        <tbody>
          <tr>
            <td className="border border-ink p-1 w-1/2">Client Name: {customer.name}</td>
            <td className="border border-ink p-1">Date: {customer.date}</td>
          </tr>
          <tr>
            <td className="border border-ink p-1">Address: {customer.address}</td>
            <td className="border border-ink p-1">Contact #: {customer.contact}</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border border-ink border-collapse mt-1">
        <thead>
          <tr>
            <th className="border border-ink p-1 w-16 font-semibold">Quantity</th>
            <th className="border border-ink p-1 font-semibold">Description</th>
            <th className="border border-ink p-1 w-24 font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td className="border border-ink p-1 h-5">{it?.qty}</td>
              <td className="border border-ink p-1">{it?.description}</td>
              <td className="border border-ink p-1">{it?.amount ? Number(it.amount).toFixed(2) : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="w-full border border-ink border-collapse">
        <tbody>
          <tr className="bg-brand-red text-white font-semibold">
            <td className="border border-ink p-1">Deposit: {Number(deposit || 0).toFixed(2)}</td>
            <td className="border border-ink p-1">Remaining Balance: {balance.toFixed(2)}</td>
            <td className="border border-ink p-1">Total: {total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-2">Warranty: _______________________________________________</p>

      <div className="flex justify-between mt-6">
        <p className="border-t border-ink pt-1 w-40 text-center">Client Signature</p>
        <p className="border-t border-ink pt-1 w-40 text-center">Authorized Signature</p>
      </div>
    </div>
  );
}
