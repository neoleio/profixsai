import { ShieldCheck, Wrench, Clock, BadgeCheck } from "lucide-react";

const ITEMS = [
  { icon: Wrench, label: "Experienced Technicians" },
  { icon: BadgeCheck, label: "Quality Parts" },
  { icon: Clock, label: "Reliable Service" },
  { icon: ShieldCheck, label: "Warranty Available" }
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {ITEMS.map(({ icon: Icon, label }) => (
        <div key={label} className="group flex items-center gap-2 text-ink/70 text-sm transition-colors duration-200 hover:text-ink">
          <Icon size={18} className="text-brand-blue shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
