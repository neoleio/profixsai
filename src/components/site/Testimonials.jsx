import { Star, Quote } from "lucide-react";
import T from "./T.jsx";

// Wording for each testimonial (quote, name, device) is editable in
// Settings > Page Text & Colors > Home > Testimonials.
export default function Testimonials() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="group relative bg-white rounded-card border border-ink/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-blue/5"
        >
          <Quote size={28} className="text-brand-blue/15 absolute top-5 right-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-brand-blue/25" />
          <div className="flex gap-0.5 mb-3 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
          </div>
          <p className="text-sm text-ink/70 leading-relaxed relative z-10">
            "<T id={`testi_${n}_quote`} />"
          </p>
          <div className="mt-4 pt-4 border-t border-ink/5">
            <T as="p" id={`testi_${n}_name`} className="block font-display font-semibold text-sm" />
            <T as="p" id={`testi_${n}_device`} className="block text-xs text-ink/45 mt-0.5" />
          </div>
        </div>
      ))}
    </div>
  );
}
