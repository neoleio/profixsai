// lucide-react has no TikTok glyph, so this small inline SVG fills that slot
// next to the Facebook/YouTube icons. Sized and colored the same way (currentColor).
export default function TikTokIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.5 2h-3.2v13.9c0 1.56-1.27 2.83-2.83 2.83a2.83 2.83 0 0 1-2.83-2.83 2.83 2.83 0 0 1 2.83-2.83c.26 0 .5.03.74.1v-3.25a6.03 6.03 0 0 0-.74-.05A6.08 6.08 0 0 0 4.4 15.9a6.08 6.08 0 0 0 6.07 6.08 6.08 6.08 0 0 0 6.07-6.08V8.66a8.44 8.44 0 0 0 4.86 1.55V7.02a5.2 5.2 0 0 1-1.87-.54A5.24 5.24 0 0 1 16.5 2Z" />
    </svg>
  );
}
