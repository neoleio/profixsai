import T from "./T.jsx";

const NUMBERS = ["01", "02", "03", "04", "05", "06"];

export default function ProcessSteps() {
  return (
    <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {NUMBERS.map((n, i) => (
        <li
          key={n}
          className="group relative card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-red/30 overflow-hidden"
        >
          <span className="absolute -top-2 -right-1 font-display font-extrabold text-6xl text-brand-red/5 transition-all duration-300 group-hover:text-brand-red/10 group-hover:scale-110 select-none">
            {n}
          </span>
          <span className="relative font-display font-extrabold text-3xl text-brand-red/30 group-hover:text-brand-red transition-colors duration-300">{n}</span>
          <T as="h3" id={`step_${i + 1}_title`} className="relative block font-display font-semibold text-lg mt-2" />
          <T as="p" id={`step_${i + 1}_desc`} className="relative block text-sm text-ink/60 mt-1 leading-relaxed" />
          {i < NUMBERS.length - 1 && (
            <span className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-ink/15" aria-hidden="true" />
          )}
        </li>
      ))}
    </ol>
  );
}
