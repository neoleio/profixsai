import { useEffect, useRef } from "react";

export default function SwordCursor() {
  const cursorRef = useRef(null);
  const swordRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return undefined;

    const moveCursor = (event) => {
      const cursor = cursorRef.current;
      if (!cursor) return;

      cursor.style.transform = `translate3d(${event.clientX - 34}px, ${event.clientY - 5}px, 0)`;
      cursor.classList.add("is-visible");
    };

    const swingSword = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const sword = swordRef.current;
      if (!sword) return;

      sword.getAnimations().forEach((animation) => animation.cancel());
      sword.animate(
        [
          { transform: "rotate(0deg)" },
          { transform: "rotate(17deg)", offset: 0.42 },
          { transform: "rotate(-5deg)", offset: 0.72 },
          { transform: "rotate(0deg)" },
        ],
        { duration: 280, easing: "cubic-bezier(0.2, 0.75, 0.25, 1)" }
      );
    };

    const hideCursor = () => cursorRef.current?.classList.remove("is-visible");

    document.addEventListener("pointermove", moveCursor);
    document.addEventListener("pointerdown", swingSword);
    document.addEventListener("mouseleave", hideCursor);

    return () => {
      document.removeEventListener("pointermove", moveCursor);
      document.removeEventListener("pointerdown", swingSword);
      document.removeEventListener("mouseleave", hideCursor);
    };
  }, []);

  return (
    <div ref={cursorRef} className="sword-cursor" aria-hidden="true">
      <svg
        ref={swordRef}
        className="sword-cursor__art"
        viewBox="0 0 48 48"
        fill="none"
      >
        <path d="M10 39 14 34 36 12 42 6 39 15 16 38 11 42Z" fill="#DDE6F0" stroke="#334155" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="m14 34 4 4M20 28l4 4M26 22l4 4M32 16l4 4" stroke="#94A3B8" strokeWidth="1" />
        <path d="m9 30 9 9-3 3-9-9z" fill="#B88746" stroke="#704B25" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="m7 30 2-2 10 10-2 2z" fill="#E4C27A" stroke="#704B25" strokeWidth="1" strokeLinejoin="round" />
        <path d="m5 34 5-5 2 2-5 5z" fill="#783F31" stroke="#4B2923" strokeWidth="1" strokeLinejoin="round" />
        <path d="m39 15 3-9-9 3z" fill="#F8FAFC" opacity=".9" />
      </svg>
    </div>
  );
}
