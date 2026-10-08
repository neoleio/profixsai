import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import T from "./T.jsx";

export default function ServiceCard({ service }) {
  const Icon = Icons[toPascalCase(service.icon)] || Icons.Wrench;
  return (
    <div className="group service-card card p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-red/5 hover:border-brand-red/30 cursor-default">
      <div className="h-36 -mt-1 mb-1 rounded-lg overflow-hidden border border-ink/5 bg-fog-50">
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={service.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="service-card__icon-panel w-full h-full grid place-items-center text-brand-red">
            <span className="w-14 h-14 rounded-xl bg-white border border-ink/10 grid place-items-center transition-all duration-300 group-hover:border-brand-red/30 group-hover:bg-brand-red group-hover:text-white">
              <Icon size={26} strokeWidth={1.8} />
            </span>
          </div>
        )}
      </div>
      <h3 className="font-display font-semibold text-lg">{service.name}</h3>
      <p className="text-sm text-ink/60 leading-relaxed flex-1">{service.description}</p>
      <Link to="/book-a-repair" className="service-card__link inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red transition-colors duration-200">
        <T id="servicecard_link" /> <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function toPascalCase(str = "") {
  return str
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}
