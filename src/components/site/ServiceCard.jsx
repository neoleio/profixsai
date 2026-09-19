import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ServiceCard({ service }) {
  const Icon = Icons[toPascalCase(service.icon)] || Icons.Wrench;
  return (
    <div className="group card p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink/5 hover:border-brand-blue/40 cursor-default">
      <div className="w-11 h-11 rounded-lg bg-brand-blue/10 grid place-items-center text-brand-blue transition-all duration-300 group-hover:bg-brand-blue group-hover:text-white group-hover:scale-110">
        <Icon size={22} />
      </div>
      <h3 className="font-display font-semibold text-lg">{service.name}</h3>
      <p className="text-sm text-ink/60 leading-relaxed flex-1">{service.description}</p>
      <Link
        to="/book-a-repair"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue group-hover:gap-2.5 transition-all duration-300"
      >
        Learn More <ArrowRight size={14} />
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
