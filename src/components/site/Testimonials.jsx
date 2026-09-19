import { Star, Quote } from "lucide-react";

// Placeholder testimonials — swap these for real customer quotes whenever
// you have them (just send them over and they'll be dropped in here).
const TESTIMONIALS = [
  {
    name: "Marisol T.",
    device: "iPhone screen replacement",
    quote: "Walked in with a cracked screen, walked out an hour later with my phone looking brand new. Fair price too.",
  },
  {
    name: "Jericho A.",
    device: "Laptop won't charge",
    quote: "They diagnosed the charging port issue for free and had it fixed the next day. Way cheaper than buying a new charger port assembly elsewhere.",
  },
  {
    name: "Dani R.",
    device: "Water-damaged tablet",
    quote: "Honestly thought my tablet was gone for good. They brought it back to life and explained exactly what they did.",
  }
];

export default function Testimonials() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {TESTIMONIALS.map((t) => (
        <div
          key={t.name}
          className="group relative bg-white rounded-card border border-ink/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-blue/5"
        >
          <Quote size={28} className="text-brand-blue/15 absolute top-5 right-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-brand-blue/25" />
          <div className="flex gap-0.5 mb-3 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
          </div>
          <p className="text-sm text-ink/70 leading-relaxed relative z-10">"{t.quote}"</p>
          <div className="mt-4 pt-4 border-t border-ink/5">
            <p className="font-display font-semibold text-sm">{t.name}</p>
            <p className="text-xs text-ink/45 mt-0.5">{t.device}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
