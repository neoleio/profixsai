import { useEffect, useState } from "react";
import ServiceCard from "../../components/site/ServiceCard.jsx";
import { api } from "../../lib/api.js";
import T from "../../components/site/T.jsx";

export default function Services() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    api.get("/services").then(({ services }) => setServices(services)).catch(() => {});
  }, []);

  const categories = ["All", ...new Set(services.map((s) => s.category).filter(Boolean))];
  const filtered = category === "All" ? services : services.filter((s) => s.category === category);

  return (
    <div className="container-page py-14">
      <T as="h1" id="services_title" className="block font-display font-bold text-3xl" />
      <T as="p" id="services_intro" className="block text-ink/60 mt-2 max-w-xl" />

      <img
        src="/assets/promo-banner.jpg"
        alt="ProFixSAI computer and laptop repair services overview"
        className="w-full rounded-card border border-ink/10 shadow-lg shadow-ink/5 mt-8 object-cover"
      />

      <div className="flex flex-wrap gap-2 mt-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              category === c ? "bg-brand-blue text-white border-brand-blue" : "border-ink/15 text-ink/70 hover:border-ink/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filtered.map((s) => <ServiceCard key={s.id} service={s} />)}
      </div>
    </div>
  );
}
