import T from "./T.jsx";

const NUMBERS = ["01", "02", "03", "04", "05", "06"];

export default function ProcessSteps() {
  return (
    <ol className="process-steps grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {NUMBERS.map((n, i) => (
        <li
          key={n}
          className="process-step group relative card p-6 transition-all duration-300 hover:border-brand-red/30"
        >
          <span className="process-step__number relative z-10 inline-grid w-10 h-10 place-items-center rounded-full border border-brand-red/25 bg-white font-mono text-xs font-semibold text-brand-red transition-colors duration-200 group-hover:bg-brand-red group-hover:text-white">
            {n}
          </span>
          <T as="h3" id={`step_${i + 1}_title`} className="relative block font-display font-semibold text-lg mt-4" />
          <T as="p" id={`step_${i + 1}_desc`} className="relative block text-sm text-ink/60 mt-1 leading-relaxed" />
        </li>
      ))}
    </ol>
  );
}
