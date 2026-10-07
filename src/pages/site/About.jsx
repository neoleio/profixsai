import { ShieldCheck, Users, Wrench } from "lucide-react";
import T from "../../components/site/T.jsx";

export default function About() {
  return (
    <div className="container-page py-14">
      <div className="max-w-3xl">
        <T as="h1" id="about_title" className="block font-display font-bold text-3xl" />
        <T as="p" id="about_body" className="block mt-4 text-ink/70 leading-relaxed" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-8 max-w-3xl">
        <img
          src="/assets/repair-macro-1.jpg"
          alt="Close-up of a smartphone motherboard being repaired"
          className="rounded-card border border-ink/10 shadow-md shadow-ink/5 h-48 sm:h-56 w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
        />
        <img
          src="/assets/repair-macro-2.jpg"
          alt="Technician soldering a laptop motherboard"
          className="rounded-card border border-ink/10 shadow-md shadow-ink/5 h-48 sm:h-56 w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mt-10 max-w-3xl">
        <div className="group card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <Users className="text-brand-blue mb-3 transition-transform duration-300 group-hover:scale-110" />
          <T as="h3" id="about_1_title" className="block font-display font-semibold" />
          <T as="p" id="about_1_desc" className="block text-sm text-ink/60 mt-1" />
        </div>
        <div className="group card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <Wrench className="text-brand-blue mb-3 transition-transform duration-300 group-hover:scale-110" />
          <T as="h3" id="about_2_title" className="block font-display font-semibold" />
          <T as="p" id="about_2_desc" className="block text-sm text-ink/60 mt-1" />
        </div>
        <div className="group card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <ShieldCheck className="text-brand-blue mb-3 transition-transform duration-300 group-hover:scale-110" />
          <T as="h3" id="about_3_title" className="block font-display font-semibold" />
          <T as="p" id="about_3_desc" className="block text-sm text-ink/60 mt-1" />
        </div>
      </div>
    </div>
  );
}
