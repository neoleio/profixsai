import { ShieldCheck, Wrench, Clock, BadgeCheck } from "lucide-react";
import T from "./T.jsx";

const ITEMS = [
  { icon: Wrench, id: "trust_1" },
  { icon: BadgeCheck, id: "trust_2" },
  { icon: Clock, id: "trust_3" },
  { icon: ShieldCheck, id: "trust_4" }
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {ITEMS.map(({ icon: Icon, id }) => (
        <div key={id} className="group flex items-center gap-2 text-ink/70 text-sm transition-colors duration-200 hover:text-ink">
          <Icon size={18} className="text-brand-blue shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <T id={id} />
        </div>
      ))}
    </div>
  );
}
