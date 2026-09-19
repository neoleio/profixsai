// Single source of truth for the "PROFIXSAI" wordmark, styled to match the
// brand poster: PROFIX in red, SAI in white/light, tight together, all caps.
// Pass `subtitle` to stack the "Laptop Repair" tagline directly beneath it.
export default function Logotype({ size = "base", light = false, className = "", subtitle = false }) {
  const sizes = {
    sm: "text-base",
    base: "text-lg",
    lg: "text-2xl",
    xl: "text-4xl"
  };
  const saiColor = light ? "text-ink" : "text-white";
  const subtitleColor = light ? "text-ink/45" : "text-white/55";

  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className={`font-display font-extrabold uppercase tracking-tight ${sizes[size]}`}>
        <span className="text-brand-red">PROFIX</span>
        <span className={saiColor}>SAI</span>
      </span>
      {subtitle && (
        <span className={`font-display font-semibold uppercase tracking-[0.22em] text-[10px] mt-1 ${subtitleColor}`}>
          Laptop Repair
        </span>
      )}
    </span>
  );
}
