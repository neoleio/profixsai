import { ShieldCheck, Users, Wrench } from "lucide-react";

export default function About() {
  return (
    <div className="container-page py-14">
      <div className="max-w-3xl">
        <h1 className="font-display font-bold text-3xl">About ProFixSAI</h1>
        <p className="mt-4 text-ink/70 leading-relaxed">
          ProFixSAI is a gadget repair shop dedicated to getting your devices back in your hands, fast.
          We work on smartphones, laptops, tablets, and other electronics, using quality parts and
          transparent pricing — no surprises at pick-up.
        </p>
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
          <h3 className="font-display font-semibold">Skilled Technicians</h3>
          <p className="text-sm text-ink/60 mt-1">Trained to diagnose and repair a wide range of devices and issues.</p>
        </div>
        <div className="group card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <Wrench className="text-brand-blue mb-3 transition-transform duration-300 group-hover:scale-110" />
          <h3 className="font-display font-semibold">Quality Parts</h3>
          <p className="text-sm text-ink/60 mt-1">We use parts built to last, not the cheapest option available.</p>
        </div>
        <div className="group card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <ShieldCheck className="text-brand-blue mb-3 transition-transform duration-300 group-hover:scale-110" />
          <h3 className="font-display font-semibold">Warranty Backed</h3>
          <p className="text-sm text-ink/60 mt-1">Every repair comes with warranty coverage for peace of mind.</p>
        </div>
      </div>
    </div>
  );
}
