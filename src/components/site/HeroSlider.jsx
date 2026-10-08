import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Subtle auto-advancing crossfade — no library needed, just opacity
// transitions on stacked, absolutely-positioned images. Slides are managed
// by the admin (Settings > Homepage Slides) and passed in as a prop so the
// list isn't hardcoded here anymore.
const INTERVAL_MS = 4500;
const FALLBACK_SLIDES = [
  { id: "repair-board", image_url: "/assets/slide-motherboard-closeup.jpg", alt_text: "Close-up of a device motherboard repair" },
  { id: "repair-station", image_url: "/assets/slide-reballing-station.jpg", alt_text: "Technician working at a repair station" },
  { id: "storefront", image_url: "/assets/slide-storefront.jpg", alt_text: "ProFixSAI repair shop" }
];

export default function HeroSlider({ slides, className = "" }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const safeSlides = slides && slides.length ? slides : FALLBACK_SLIDES;
  const activeIndex = index % safeSlides.length;

  useEffect(() => {
    if (safeSlides.length < 2 || reduceMotion) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % safeSlides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [safeSlides.length, reduceMotion]);

  if (safeSlides.length === 0) return null;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {safeSlides.map((slide, i) => (
        <img
          key={slide.id || slide.image_url}
          src={slide.image_url}
          alt={slide.alt_text || "ProFixSAI repair work"}
          className={`hero-slide absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
            i === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* Spacer to establish intrinsic sizing since images are absolutely positioned */}
      <img src={safeSlides[0].image_url} alt="" aria-hidden="true" className="w-full h-full object-cover invisible" />

      <span className="absolute top-4 left-4 rounded-md border border-white/25 bg-ink/65 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
        Repair bench <span className="text-brand-red">/</span> ProFixSAI
      </span>

      {safeSlides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" aria-hidden="true">
          {safeSlides.map((slide, i) => (
            <span
              key={slide.id || slide.image_url}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
