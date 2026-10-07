import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../lib/api.js";
import { useContent } from "../../lib/useContent.js";
import T from "../../components/site/T.jsx";
import TrustBadges from "../../components/site/TrustBadges.jsx";
import ServiceCard from "../../components/site/ServiceCard.jsx";
import ProcessSteps from "../../components/site/ProcessSteps.jsx";
import WhyChooseUs from "../../components/site/WhyChooseUs.jsx";
import Testimonials from "../../components/site/Testimonials.jsx";
import HeroSlider from "../../components/site/HeroSlider.jsx";
import { Reveal, StaggerGroup, StaggerItem } from "../../components/motion/index.jsx";

export default function Home() {
  const { t, s } = useContent();
  const [services, setServices] = useState([]);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    api.get("/services").then(({ services }) => setServices(services.slice(0, 6))).catch(() => {});
    api.get("/settings?resource=hero-slides").then(({ slides }) => setSlides(slides)).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={s("home_hero_bg")} className="relative overflow-hidden bg-site-gradient text-ink">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl" aria-hidden="true" />

        <div className="container-page relative grid lg:grid-cols-2 gap-10 items-center py-16 lg:py-24">
          <StaggerGroup>
            <StaggerItem>
              <span style={s("hero_badge")} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-red bg-brand-red/10 border border-brand-red/20 rounded-full px-3 py-1">
                {t("hero_badge")}
              </span>
            </StaggerItem>
            <StaggerItem as="h1" className="font-display font-extrabold text-4xl sm:text-5xl leading-[1.1] mt-4">
              <T id="hero_headline" />
            </StaggerItem>
            <StaggerItem as="p" className="mt-5 text-ink/60 text-lg max-w-lg"><T id="hero_subtext" /></StaggerItem>
            <StaggerItem className="mt-8 flex flex-wrap gap-4">
              <Link to="/book-a-repair" style={s("hero_btn_primary")} className="btn-primary hover:shadow-lg hover:shadow-brand-red/30 hover:-translate-y-0.5">
                {t("hero_btn_primary")}
              </Link>
              <Link
                to="/services"
                style={s("hero_btn_secondary")}
                className="btn-secondary hover:-translate-y-0.5"
              >
                {t("hero_btn_secondary")}
              </Link>
            </StaggerItem>
            <StaggerItem className="mt-10">
              <TrustBadges />
            </StaggerItem>
          </StaggerGroup>
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute -inset-4 bg-brand-blue/10 rounded-card blur-2xl" aria-hidden="true" />
            <HeroSlider slides={slides} className="relative rounded-card border border-ink/10 w-full h-[320px] sm:h-[420px] shadow-2xl shadow-ink/10" />
          </motion.div>
        </div>
      </section>

      {/* Why choose us */}
      <Reveal as="section" className="container-page py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <T as="h2" id="home_why_title" className="block font-display font-bold text-2xl sm:text-3xl" />
          <T as="p" id="home_why_sub" className="block text-ink/60 mt-2" />
        </div>
        <WhyChooseUs />
      </Reveal>

      {/* Services preview */}
      <Reveal as="section" style={s("home_services_bg")} className="bg-site-band py-16">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <T as="h2" id="home_services_title" className="block font-display font-bold text-2xl sm:text-3xl" />
              <T as="p" id="home_services_sub" className="block text-ink/60 mt-1" />
            </div>
            <Link to="/services" className="hidden sm:inline text-brand-blue font-semibold text-sm hover:text-brand-blueDeep">
              <T id="home_services_link" />
            </Link>
          </div>
          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <StaggerItem key={s.id}>
                <ServiceCard service={s} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Reveal>

      {/* Repair process preview */}
      <Reveal as="section" className="container-page py-16">
        <div className="mb-8">
          <T as="h2" id="home_process_title" className="block font-display font-bold text-2xl sm:text-3xl" />
          <T as="p" id="home_process_sub" className="block text-ink/60 mt-1" />
        </div>
        <ProcessSteps />
      </Reveal>

      {/* Testimonials */}
      <Reveal as="section" style={s("home_testi_bg")} className="bg-site-band py-16">
        <div className="container-page">
          <div className="text-center max-w-xl mx-auto mb-10">
            <T as="h2" id="home_testi_title" className="block font-display font-bold text-2xl sm:text-3xl" />
            <T as="p" id="home_testi_sub" className="block text-ink/60 mt-2" />
          </div>
          <Testimonials />
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal as="section" style={s("home_cta_bg")} className="relative overflow-hidden bg-brand-blue py-16 text-center text-white">
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[32rem] h-64 bg-white/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="container-page relative">
          <T as="h2" id="cta_title" className="block font-display font-bold text-2xl sm:text-3xl" />
          <T as="p" id="cta_sub" className="block text-white/75 mt-2" />
          <Link to="/book-a-repair" style={s("cta_btn")} className="btn-primary mt-6 hover:shadow-lg hover:shadow-brand-redDeep/40 hover:-translate-y-0.5">
            {t("cta_btn")}
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
