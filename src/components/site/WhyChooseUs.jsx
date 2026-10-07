import { Zap, ShieldCheck, Wallet, Award, Clock3, Sparkles } from "lucide-react";
import T from "./T.jsx";

const REASONS = [
  { icon: Zap, color: "text-brand-blue bg-brand-blue/10" },
  { icon: Award, color: "text-brand-red bg-brand-red/10" },
  { icon: Wallet, color: "text-emerald-600 bg-emerald-50" },
  { icon: ShieldCheck, color: "text-brand-blue bg-brand-blue/10" },
  { icon: Clock3, color: "text-brand-red bg-brand-red/10" },
  { icon: Sparkles, color: "text-emerald-600 bg-emerald-50" }
];

export default function WhyChooseUs() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {REASONS.map(({ icon: Icon, color }, i) => (
        <div
          key={i}
          className="group card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5 hover:border-brand-blue/30"
        >
          <div className={`w-12 h-12 rounded-xl grid place-items-center mb-4 transition-transform duration-300 group-hover:scale-110 ${color}`}>
            <Icon size={22} />
          </div>
          <T as="h3" id={`why_${i + 1}_title`} className="block font-display font-semibold text-lg" />
          <T as="p" id={`why_${i + 1}_desc`} className="block text-sm text-ink/60 mt-1.5 leading-relaxed" />
        </div>
      ))}
    </div>
  );
}
