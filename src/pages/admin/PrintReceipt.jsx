import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Printer } from "lucide-react";
import { api } from "../../lib/api.js";
import Logotype from "../../components/site/Logotype.jsx";

export default function PrintReceipt() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/job-orders?id=${id}`).then(setData).catch(() => {});
  }, [id]);

  if (!data) return <p className="p-8 text-ink/50">Loading receipt…</p>;

  return (
    <div className="bg-fog-100 min-h-screen py-8 print:bg-white print:py-0">
      <div className="no-print max-w-[780px] mx-auto mb-4 flex justify-end">
        <button onClick={() => window.print()} className="btn-primary"><Printer size={16} /> Print / Save as PDF</button>
      </div>
      <Copy jobOrder={data.jobOrder} payments={data.payments} label="Customer Copy" />
      <div className="max-w-[780px] mx-auto border-t-2 border-dashed border-ink/20 my-6 print:break-after-page" />
      <Copy jobOrder={data.jobOrder} payments={data.payments} label="Admin Copy" />
    </div>
  );
}

function Copy({ jobOrder, payments, label }) {
  const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);
  const balance = Number(jobOrder.final_cost || 0) - totalPaid;

  return (
    <div className="bg-white max-w-[780px] mx-auto p-8 border border-ink/10 text-sm print:border-0 print:shadow-none">
      <div className="text-center border-b-2 border-ink pb-3 mb-4">
        <img src="/assets/logo.png" alt="ProFixSAI logo" className="w-16 h-16 mx-auto rounded-full object-cover mb-2" />
        <Logotype size="xl" light />
        <p className="text-ink/60 text-xs">Gadget Repair Service</p>
        <p className="text-xs font-semibold uppercase tracking-wide mt-2 text-brand-red">{label}</p>
      </div>

      <p className="text-center font-display font-bold text-lg mb-4">Repair Job Order / Receipt</p>

      <div className="grid grid-cols-2 border border-ink/20 mb-4">
        <Cell label="Job Order No.">{jobOrder.job_no}</Cell>
        <Cell label="Date Received">{jobOrder.date_received}</Cell>
        <Cell label="Customer Name">{jobOrder.customer_name}</Cell>
        <Cell label="Contact Number">{jobOrder.contact_number}</Cell>
        <Cell label="Device">{jobOrder.device_type}</Cell>
        <Cell label="Brand / Model">{jobOrder.brand} {jobOrder.model}</Cell>
        <Cell label="Technician">{jobOrder.technician_name || "Unassigned"}</Cell>
        <Cell label="Expected Release">{jobOrder.expected_completion || "—"}</Cell>
      </div>

      <Box label="Reported Problem">{jobOrder.reported_problem}</Box>
      <Box label="Diagnosis">{jobOrder.diagnosis}</Box>
      <Box label="Repair Service / Parts Used">{jobOrder.parts_required || jobOrder.repair_notes}</Box>
      <Box label="Warranty Information">{jobOrder.warranty_info || "—"}</Box>

      <div className="grid grid-cols-2 border border-ink/20 mt-4">
        <Cell label="Subtotal">₱{Number(jobOrder.final_cost || jobOrder.estimated_cost || 0).toFixed(2)}</Cell>
        <Cell label="Amount Paid">₱{totalPaid.toFixed(2)}</Cell>
        <Cell label="Balance">₱{balance.toFixed(2)}</Cell>
        <Cell label="Payment Status" className="col-span-2">{jobOrder.payment_status}</Cell>
      </div>

      <div className="grid grid-cols-2 gap-10 mt-14 text-center text-xs">
        <div className="border-t border-ink pt-2">Customer Signature</div>
        <div className="border-t border-ink pt-2">Technician / Staff Signature</div>
      </div>
      <p className="text-center text-[11px] text-ink/40 mt-6">Thank you for trusting ProFixSAI.</p>
    </div>
  );
}

function Cell({ label, children, className = "" }) {
  return (
    <div className={`border-b border-r border-ink/20 p-2.5 ${className}`}>
      <p className="text-[10px] uppercase tracking-wide text-ink/40 font-semibold">{label}</p>
      <p className="mt-0.5">{children}</p>
    </div>
  );
}

function Box({ label, children }) {
  return (
    <div className="border border-ink/20 p-2.5 mb-2">
      <p className="text-[10px] uppercase tracking-wide text-ink/40 font-semibold">{label}</p>
      <p className="mt-0.5 min-h-[18px]">{children || "—"}</p>
    </div>
  );
}
