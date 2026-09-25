const COLORS = {
  Received: "bg-fog-200 text-ink/70",
  Diagnosing: "bg-brand-blue/15 text-brand-blueDeep",
  "Waiting for Approval": "bg-amber-100 text-amber-700",
  "Not Repaired": "bg-brand-red/10 text-brand-red",
  Completed: "bg-emerald-100 text-emerald-700",
  Released: "bg-ink text-white",
  Unpaid: "bg-brand-red/10 text-brand-red",
  Partial: "bg-amber-100 text-amber-700",
  Paid: "bg-emerald-100 text-emerald-700",
  Active: "bg-emerald-100 text-emerald-700",
  "Expiring Soon": "bg-amber-100 text-amber-700",
  Expired: "bg-fog-200 text-ink/50",
  New: "bg-brand-blue/15 text-brand-blueDeep",
  Converted: "bg-emerald-100 text-emerald-700",
  Read: "bg-fog-200 text-ink/60",
  Dismissed: "bg-fog-200 text-ink/40",
  Archived: "bg-fog-200 text-ink/40"
};

export default function StatusBadge({ value }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold leading-tight ${COLORS[value] || "bg-fog-200 text-ink/70"}`}>
      {value}
    </span>
  );
}
