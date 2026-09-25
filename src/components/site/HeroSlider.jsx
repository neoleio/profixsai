import { useEffect, useState } from "react";

// Subtle auto-advancing crossfade — no library needed, just opacity
// transitions on stacked, absolutely-positioned images. Slides are managed
// by the admin (Settings > Homepage Slides) and passed in as a prop so the
// list isn't hardcoded here anymore.
const INTERVAL_MS = 4500;

export default function HeroSlider({ slides, className = "" }) {
  const [index, setIndex] = useState(0);
  const safeSlides = slides && slides.length ? slides : [];

  useEffect(() => {
    if (safeSlides.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % safeSlides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [safeSlides.length]);

  if (safeSlides.length === 0) return null;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {safeSlides.map((slide, i) => (
        <img
          key={slide.id || slide.image_url}
          src={slide.image_url}
          alt={slide.alt_text || "ProFixSAI repair work"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* Spacer to establish intrinsic sizing since images are absolutely positioned */}
      <img src={safeSlides[0].image_url} alt="" aria-hidden="true" className="w-full h-full object-cover invisible" />

      {safeSlides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" aria-hidden="true">
          {safeSlides.map((slide, i) => (
            <span
              key={slide.id || slide.image_url}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
