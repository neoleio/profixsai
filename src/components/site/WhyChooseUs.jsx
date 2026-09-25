import { Zap, ShieldCheck, Wallet, Award, Clock3, Sparkles } from "lucide-react";

const REASONS = [
  {
    icon: Zap,
    title: "Fast Turnaround",
    desc: "Most common repairs — screens, batteries, ports — are diagnosed the same day you walk in.",
    color: "text-brand-blue bg-brand-blue/10"
  },
  {
    icon: Award,
    title: "Experienced Technicians",
    desc: "Every repair is handled by trained technicians who know their way around the hardware.",
    color: "text-brand-red bg-brand-red/10"
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    desc: "You get a clear quote before any work starts — no surprise charges at pick-up.",
    color: "text-emerald-600 bg-emerald-50"
  },
  {
    icon: ShieldCheck,
    title: "Warranty Backed",
    desc: "Repairs are covered by warranty, so you're protected after you walk out the door.",
    color: "text-brand-blue bg-brand-blue/10"
  },
  {
    icon: Clock3,
    title: "Reliable Communication",
    desc: "We keep you posted at every stage — diagnosis, quote, repair, and pick-up.",
    color: "text-brand-red bg-brand-red/10"
  },
  {
    icon: Sparkles,
    title: "Quality Parts Only",
    desc: "We use parts built to last, never the cheapest option available.",
    color: "text-emerald-600 bg-emerald-50"
  }
];

export default function WhyChooseUs() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {REASONS.map(({ icon: Icon, title, desc, color }) => (
        <div
          key={title}
          className="group card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5 hover:border-brand-blue/30"
        >
          <div className={`w-12 h-12 rounded-xl grid place-items-center mb-4 transition-transform duration-300 group-hover:scale-110 ${color}`}>
            <Icon size={22} />
          </div>
          <h3 className="font-display font-semibold text-lg">{title}</h3>
          <p className="text-sm text-ink/60 mt-1.5 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  );
}
