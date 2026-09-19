import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api.js";
import { useSettings } from "../../lib/useSettings.js";
import TrustBadges from "../../components/site/TrustBadges.jsx";
import ServiceCard from "../../components/site/ServiceCard.jsx";
import ProcessSteps from "../../components/site/ProcessSteps.jsx";
import WhyChooseUs from "../../components/site/WhyChooseUs.jsx";
import Testimonials from "../../components/site/Testimonials.jsx";
import HeroSlider from "../../components/site/HeroSlider.jsx";

export default function Home() {
  const settings = useSettings();
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/services").then(({ services }) => setServices(services.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-site-gradient text-ink">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl" aria-hidden="true" />

        <div className="container-page relative grid lg:grid-cols-2 gap-10 items-center py-16 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-red bg-brand-red/10 border border-brand-red/20 rounded-full px-3 py-1">
              Trusted Gadget Repair
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-[1.1] mt-4">
              {settings.hero_headline}
            </h1>
            <p className="mt-5 text-ink/60 text-lg max-w-lg">{settings.hero_subtext}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/book-a-repair" className="btn-primary hover:shadow-lg hover:shadow-brand-red/30 hover:-translate-y-0.5">
                Book a Repair
              </Link>
              <Link
                to="/services"
                className="btn-secondary hover:-translate-y-0.5"
              >
                View Services
              </Link>
            </div>
            <div className="mt-10">
              <TrustBadges />
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-brand-blue/10 rounded-card blur-2xl" aria-hidden="true" />
            <HeroSlider className="relative rounded-card border border-ink/10 w-full h-[320px] sm:h-[420px] shadow-2xl shadow-ink/10" />
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="container-page py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-display font-bold text-2xl sm:text-3xl">Why Choose ProFixSAI</h2>
          <p className="text-ink/60 mt-2">Repairs you can trust, from people who actually explain what's wrong.</p>
        </div>
        <WhyChooseUs />
      </section>

      {/* Services preview */}
      <section className="bg-site-band py-16">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl">Our Services</h2>
              <p className="text-ink/60 mt-1">Repairs for every device, handled by trained technicians.</p>
            </div>
            <Link to="/services" className="hidden sm:inline text-brand-blue font-semibold text-sm hover:text-brand-blueDeep">
              See all services →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      </section>

      {/* Repair process preview */}
      <section className="container-page py-16">
        <div className="mb-8">
          <h2 className="font-display font-bold text-2xl sm:text-3xl">How Repairs Work</h2>
          <p className="text-ink/60 mt-1">A straightforward process from drop-off to pick-up.</p>
        </div>
        <ProcessSteps />
      </section>

      {/* Testimonials */}
      <section className="bg-site-band py-16">
        <div className="container-page">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-display font-bold text-2xl sm:text-3xl">What Customers Say</h2>
            <p className="text-ink/60 mt-2">Real repairs, real relief.</p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-blue py-16 text-center text-white">
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[32rem] h-64 bg-white/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="container-page relative">
          <h2 className="font-display font-bold text-2xl sm:text-3xl">Got a gadget that needs fixing?</h2>
          <p className="text-white/75 mt-2">Get a quote today — most repairs are diagnosed the same day.</p>
          <Link to="/book-a-repair" className="btn-primary mt-6 hover:shadow-lg hover:shadow-brand-redDeep/40 hover:-translate-y-0.5">
            Book a Repair
          </Link>
        </div>
      </section>
    </div>
  );
}
