import { useEffect, useState } from "react";

// Subtle auto-advancing crossfade — no library needed, just opacity
// transitions on stacked, absolutely-positioned images.
const SLIDES = [
  { src: "/assets/technician.jpg", alt: "Technician repairing a smartphone with precision tools" },
  { src: "/assets/repair-macro-1.jpg", alt: "Close-up of laptop motherboard repair work" },
  { src: "/assets/repair-macro-2.jpg", alt: "Detailed circuit-level repair in progress" },
  { src: "/assets/promo-banner.jpg", alt: "ProFixSAI repair services overview" }
];

const INTERVAL_MS = 4500;

export default function HeroSlider({ className = "" }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* Spacer to establish intrinsic sizing since images are absolutely positioned */}
      <img src={SLIDES[0].src} alt="" aria-hidden="true" className="w-full h-full object-cover invisible" />

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" aria-hidden="true">
        {SLIDES.map((slide, i) => (
          <span
            key={slide.src}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
