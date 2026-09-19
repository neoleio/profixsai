const STEPS = [
  { n: "01", title: "Bring Your Gadget", desc: "Drop off your device at our shop, in person or through a scheduled pickup." },
  { n: "02", title: "Initial Diagnosis", desc: "Our technicians inspect the device and identify the root cause." },
  { n: "03", title: "Repair Quote", desc: "We explain the issue and give you a clear, upfront quote before any work begins." },
  { n: "04", title: "Repair", desc: "Once approved, our technicians carry out the repair using quality parts." },
  { n: "05", title: "Quality Check", desc: "Every repair is tested and inspected before it's marked complete." },
  { n: "06", title: "Pick Up", desc: "We notify you when it's ready, and you pick up your working device." }
];

export default function ProcessSteps() {
  return (
    <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {STEPS.map((s, i) => (
        <li
          key={s.n}
          className="group relative card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-red/30 overflow-hidden"
        >
          <span className="absolute -top-2 -right-1 font-display font-extrabold text-6xl text-brand-red/5 transition-all duration-300 group-hover:text-brand-red/10 group-hover:scale-110 select-none">
            {s.n}
          </span>
          <span className="relative font-display font-extrabold text-3xl text-brand-red/30 group-hover:text-brand-red transition-colors duration-300">{s.n}</span>
          <h3 className="relative font-display font-semibold text-lg mt-2">{s.title}</h3>
          <p className="relative text-sm text-ink/60 mt-1 leading-relaxed">{s.desc}</p>
          {i < STEPS.length - 1 && (
            <span className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-ink/15" aria-hidden="true" />
          )}
        </li>
      ))}
    </ol>
  );
}
